export type Discipline = 'Architecture' | 'Engineering' | 'Testing' | 'Data' | 'Delivery';

export type Seniority = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal';

export type AvailabilityBand = 'Immediate' | 'Moderate' | 'Constrained';

export interface EmployeeSkill {
  name: string;
  level: 'Proficient' | 'Advanced' | 'Expert';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  discipline: Discipline;
  seniority: Seniority;
  location: string;
  department: string;
  skills: EmployeeSkill[];
  currentAllocationPercent: number; // 0 to 100 (% committed elsewhere)
  availableCapacityPercent: number; // 100 - currentAllocationPercent
  availabilityBand: AvailabilityBand;
  currentProject: string;
  releaseDate: string; // e.g. "Available Now", "In 3 days", "Sprint End"
  pastProjects: string[];
  avatarBg: string;
  initials: string;
}

export interface RoleRequirement {
  id: string;
  discipline: Discipline;
  roleTitle: string;
  count: number;
  minSeniority?: Seniority;
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

export interface DeliveryRequest {
  id: string;
  title: string;
  code: string;
  businessUnit: string;
  description: string;
  urgency: 'Immediate' | 'High' | 'Standard';
  duration: '2 Weeks (Spike)' | '1 Month (Sprint)' | '3 Months (Quarterly)' | '6 Months';
  workloadRequirementPercent: number; // e.g. 50 or 100
  rolesNeeded: RoleRequirement[];
}

export interface MatchScoreBreakdown {
  overallScore: number; // 0 - 100
  skillMatchScore: number; // out of 40
  matchedMustHaveSkills: string[];
  missingMustHaveSkills: string[];
  matchedNiceToHaveSkills: string[];
  availabilityScore: number; // out of 30
  roleScore: number; // out of 20
  workloadScore: number; // out of 10
  reasons: string[];
  riskFlags: string[];
}

export interface ScoredCandidate {
  employee: Employee;
  targetRoleRequirement?: RoleRequirement;
  targetDiscipline: Discipline;
  scoreBreakdown: MatchScoreBreakdown;
}

export interface SquadMemberAssignment {
  employeeId: string;
  employee: Employee;
  assignedRole: string;
  discipline: Discipline;
  allocatedCapacityPercent: number;
  matchScore: number;
}
