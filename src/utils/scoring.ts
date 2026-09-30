import { Employee, RoleRequirement, DeliveryRequest, MatchScoreBreakdown, ScoredCandidate, Seniority } from '../types';

const SENIORITY_LEVELS: Record<Seniority, number> = {
  Junior: 1,
  Mid: 2,
  Senior: 3,
  Lead: 4,
  Principal: 5,
};

export function scoreCandidateForRole(
  employee: Employee,
  roleReq: RoleRequirement,
  deliveryRequest: DeliveryRequest
): MatchScoreBreakdown {
  const employeeSkillMap = new Map(employee.skills.map((s) => [s.name.toLowerCase(), s]));

  // 1. SKILL MATCH (Max 40 pts)
  const mustHave = roleReq.requiredSkills || [];
  const niceToHave = roleReq.niceToHaveSkills || [];

  const matchedMustHave: string[] = [];
  const missingMustHave: string[] = [];
  const matchedNiceToHave: string[] = [];

  let mustHaveScore = 0;
  if (mustHave.length > 0) {
    mustHave.forEach((reqSkill) => {
      const match = employeeSkillMap.get(reqSkill.toLowerCase());
      if (match) {
        matchedMustHave.push(match.name);
        const levelBonus = match.level === 'Expert' ? 1.15 : match.level === 'Advanced' ? 1.05 : 1.0;
        mustHaveScore += (30 / mustHave.length) * levelBonus;
      } else {
        missingMustHave.push(reqSkill);
      }
    });
    mustHaveScore = Math.min(30, Math.round(mustHaveScore));
  } else {
    // If no specific must have, score based on general skills in this discipline
    mustHaveScore = 25;
  }

  let niceToHaveScore = 0;
  if (niceToHave.length > 0) {
    niceToHave.forEach((niceSkill) => {
      const match = employeeSkillMap.get(niceSkill.toLowerCase());
      if (match) {
        matchedNiceToHave.push(match.name);
        niceToHaveScore += 10 / niceToHave.length;
      }
    });
    niceToHaveScore = Math.min(10, Math.round(niceToHaveScore));
  } else {
    niceToHaveScore = 8;
  }

  const skillMatchScore = Math.min(40, mustHaveScore + niceToHaveScore);

  // 2. AVAILABILITY & CAPACITY (Max 30 pts)
  const requiredWorkload = deliveryRequest.workloadRequirementPercent;
  const availableCap = employee.availableCapacityPercent;
  let availabilityScore = 0;

  if (availableCap >= requiredWorkload) {
    if (employee.availabilityBand === 'Immediate') {
      availabilityScore = 30;
    } else if (employee.availabilityBand === 'Moderate') {
      availabilityScore = 24;
    } else {
      availabilityScore = 16;
    }
  } else {
    // Partial capacity available
    const capacityRatio = Math.max(0, availableCap / Math.max(requiredWorkload, 1));
    availabilityScore = Math.round(capacityRatio * 18);
  }

  // Urgent delivery penalty if candidate is tied up
  if (deliveryRequest.urgency === 'Immediate' && employee.currentAllocationPercent >= 75) {
    availabilityScore = Math.max(2, availabilityScore - 8);
  }

  // 3. ROLE & SENIORITY ALIGNMENT (Max 20 pts)
  let roleDisciplineScore = 0;
  if (employee.discipline === roleReq.discipline) {
    roleDisciplineScore = 15;
  } else {
    // Cross discipline bonus if they have overlapping skills
    roleDisciplineScore = matchedMustHave.length > 0 ? 8 : 4;
  }

  let seniorityScore = 5;
  if (roleReq.minSeniority) {
    const requiredLevel = SENIORITY_LEVELS[roleReq.minSeniority];
    const candidateLevel = SENIORITY_LEVELS[employee.seniority];
    if (candidateLevel >= requiredLevel) {
      seniorityScore = 5;
    } else if (candidateLevel === requiredLevel - 1) {
      seniorityScore = 3;
    } else {
      seniorityScore = 1;
    }
  }

  const roleScore = roleDisciplineScore + seniorityScore;

  // 4. WORKLOAD BUFFER & URGENCY FIT (Max 10 pts)
  const headroom = availableCap - requiredWorkload;
  let workloadScore = 0;
  if (headroom >= 15) {
    workloadScore = 10;
  } else if (headroom >= 0) {
    workloadScore = 7;
  } else if (headroom >= -20) {
    workloadScore = 4;
  } else {
    workloadScore = 1;
  }

  const overallScore = Math.min(100, skillMatchScore + availabilityScore + roleScore + workloadScore);

  // 5. EXPLANATIONS & WHY RECOMMENDED
  const reasons: string[] = [];
  const riskFlags: string[] = [];

  if (matchedMustHave.length === mustHave.length && mustHave.length > 0) {
    reasons.push(`100% coverage on required must-have skills (${matchedMustHave.slice(0, 3).join(', ')})`);
  } else if (matchedMustHave.length > 0) {
    reasons.push(`Strong skill match: verified expertise in ${matchedMustHave.slice(0, 3).join(', ')}`);
  }

  if (matchedNiceToHave.length > 0) {
    reasons.push(`Bonus secondary capabilities in ${matchedNiceToHave.slice(0, 2).join(', ')}`);
  }

  if (employee.availableCapacityPercent >= requiredWorkload) {
    reasons.push(
      `Sufficient bandwidth: ${employee.availableCapacityPercent}% available capacity (requires ${requiredWorkload}%)`
    );
  }

  if (employee.releaseDate === 'Available Now' || employee.availabilityBand === 'Immediate') {
    reasons.push(`Ready for immediate mobilisation without project handover friction`);
  }

  if (roleReq.minSeniority && SENIORITY_LEVELS[employee.seniority] >= SENIORITY_LEVELS[roleReq.minSeniority]) {
    reasons.push(`${employee.seniority} level depth aligns with delivery complexity`);
  }

  if (employee.pastProjects && employee.pastProjects.length > 0) {
    reasons.push(`Relevant domain pedigree: previous contributor on ${employee.pastProjects[0]}`);
  }

  // Risks
  if (missingMustHave.length > 0) {
    riskFlags.push(`Missing required skills: ${missingMustHave.join(', ')}`);
  }

  if (employee.availableCapacityPercent < requiredWorkload) {
    riskFlags.push(
      `Capacity shortfall: only ${employee.availableCapacityPercent}% free vs ${requiredWorkload}% required. Requires stakeholder de-allocation.`
    );
  }

  if (deliveryRequest.urgency === 'Immediate' && employee.releaseDate !== 'Available Now') {
    riskFlags.push(`Release lead time: currently committed until ${employee.releaseDate}`);
  }

  return {
    overallScore,
    skillMatchScore,
    matchedMustHaveSkills: matchedMustHave,
    missingMustHaveSkills: missingMustHave,
    matchedNiceToHaveSkills: matchedNiceToHave,
    availabilityScore,
    roleScore,
    workloadScore,
    reasons,
    riskFlags,
  };
}

export function rankTalentPoolForRequest(
  pool: Employee[],
  deliveryRequest: DeliveryRequest,
  activeDisciplineFilter?: string
): ScoredCandidate[] {
  const scoredList: ScoredCandidate[] = [];

  for (const employee of pool) {
    // Find the best fitting role requirement from the request
    let bestBreakdown: MatchScoreBreakdown | null = null;
    let bestReq: RoleRequirement | undefined = undefined;

    // Prioritize role requirements matching the employee's discipline
    const matchingReqs = deliveryRequest.rolesNeeded.filter(
      (r) => r.discipline === employee.discipline
    );

    const candidateReqs = matchingReqs.length > 0 ? matchingReqs : deliveryRequest.rolesNeeded;

    for (const req of candidateReqs) {
      const breakdown = scoreCandidateForRole(employee, req, deliveryRequest);
      if (!bestBreakdown || breakdown.overallScore > bestBreakdown.overallScore) {
        bestBreakdown = breakdown;
        bestReq = req;
      }
    }

    if (!bestBreakdown) {
      // Fallback synthetic role req if request has no roles
      const dummyReq: RoleRequirement = {
        id: 'generic',
        discipline: employee.discipline,
        roleTitle: employee.role,
        count: 1,
        requiredSkills: [],
        niceToHaveSkills: [],
      };
      bestBreakdown = scoreCandidateForRole(employee, dummyReq, deliveryRequest);
      bestReq = dummyReq;
    }

    // Check discipline filter if provided
    if (activeDisciplineFilter && activeDisciplineFilter !== 'All') {
      if (employee.discipline !== activeDisciplineFilter) {
        continue;
      }
    }

    scoredList.push({
      employee,
      targetRoleRequirement: bestReq,
      targetDiscipline: employee.discipline,
      scoreBreakdown: bestBreakdown,
    });
  }

  // Sort descending by overall match score, then available capacity
  return scoredList.sort((a, b) => {
    if (b.scoreBreakdown.overallScore !== a.scoreBreakdown.overallScore) {
      return b.scoreBreakdown.overallScore - a.scoreBreakdown.overallScore;
    }
    return b.employee.availableCapacityPercent - a.employee.availableCapacityPercent;
  });
}
