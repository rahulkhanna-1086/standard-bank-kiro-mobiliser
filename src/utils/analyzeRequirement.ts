interface AnalyzedRole {
  discipline: 'Architecture' | 'Engineering' | 'Testing' | 'Data' | 'Delivery';
  roleTitle: string;
  count: number;
  minSeniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

interface AnalyzedRequirementResponse {
  title: string;
  code: string;
  businessUnit: string;
  description: string;
  urgency: 'Immediate' | 'High' | 'Standard';
  duration: '2 Weeks (Spike)' | '1 Month (Sprint)' | '3 Months (Quarterly)' | '6 Months';
  workloadRequirementPercent: number;
  rolesNeeded: AnalyzedRole[];
  aiSummary: string;
}

// Fallback heuristic analyzer when GEMINI_API_KEY is not configured or in offline mode
export function fallbackAnalyzePrompt(prompt: string): AnalyzedRequirementResponse {
  const p = prompt.toLowerCase();
  
  if (p.includes('chat') || p.includes('bot') || p.includes('conversational') || p.includes('nlp') || p.includes('llm') || p.includes('ai assistant')) {
    return {
      title: 'Customer Self-Service AI Chatbot',
      code: 'REQ-CHATBOT-01',
      businessUnit: 'PBB Digital & Conversational Banking',
      description: `Delivery squad to build and deploy an omnichannel AI Chatbot (${prompt}) integrated with Standard Bank messaging rails, secure authentication, and knowledge base backends.`,
      urgency: 'High',
      duration: '1 Month (Sprint)',
      workloadRequirementPercent: 100,
      aiSummary: 'Analyzed requirement for Conversational AI Chatbot: Mobilizing a balanced squad with Cloud Architecture, Full-Stack TypeScript/React engineering, Playwright automation QA, and Agile Delivery leadership.',
      rolesNeeded: [
        {
          discipline: 'Architecture',
          roleTitle: 'Conversational AI & Cloud Architect',
          count: 1,
          minSeniority: 'Senior',
          requiredSkills: ['Solutions Architecture', 'AWS Cloud', 'API Gateway'],
          niceToHaveSkills: ['Zero Trust Security', 'Microservices'],
        },
        {
          discipline: 'Engineering',
          roleTitle: 'Full-Stack TypeScript & API Engineer',
          count: 2,
          minSeniority: 'Senior',
          requiredSkills: ['React', 'TypeScript', 'Docker', 'CI/CD Pipelines'],
          niceToHaveSkills: ['Python', 'PostgreSQL'],
        },
        {
          discipline: 'Testing',
          roleTitle: 'Conversational QA & Automation Engineer',
          count: 1,
          minSeniority: 'Mid',
          requiredSkills: ['Test Automation', 'Playwright', 'API Contract Testing'],
          niceToHaveSkills: ['BDD / Cucumber'],
        },
        {
          discipline: 'Delivery',
          roleTitle: 'Agile Delivery Lead / Scrum Master',
          count: 1,
          minSeniority: 'Mid',
          requiredSkills: ['Agile Delivery', 'SAFe / Scrum', 'Team Facilitation'],
          niceToHaveSkills: ['Jira / Confluence'],
        },
      ],
    };
  }

  if (p.includes('fraud') || p.includes('risk') || p.includes('security') || p.includes('aml')) {
    return {
      title: 'Real-Time Fraud & Anomaly Detection Engine',
      code: 'REQ-FRAUD-02',
      businessUnit: 'Financial Crime & Risk Engineering',
      description: `Rapid-response engineering squad to deploy streaming fraud detection (${prompt}) with sub-50ms latency scoring on payment rails.`,
      urgency: 'Immediate',
      duration: '2 Weeks (Spike)',
      workloadRequirementPercent: 100,
      aiSummary: 'Analyzed requirement for Fraud & Risk Engine: Mobilizing low-latency streaming specialists (Kafka, Python/Go), Cloud Platform Architect, and Performance QA.',
      rolesNeeded: [
        {
          discipline: 'Architecture',
          roleTitle: 'High-Throughput Platform Architect',
          count: 1,
          minSeniority: 'Lead',
          requiredSkills: ['Solutions Architecture', 'Kafka', 'Zero Trust Security'],
          niceToHaveSkills: ['AWS Cloud', 'Microservices'],
        },
        {
          discipline: 'Engineering',
          roleTitle: 'Streaming Backend Engineer (Go / Java)',
          count: 1,
          minSeniority: 'Senior',
          requiredSkills: ['Go', 'Kafka', 'Docker'],
          niceToHaveSkills: ['PostgreSQL', 'Java Spring Boot'],
        },
        {
          discipline: 'Data',
          roleTitle: 'Real-Time Data & ML Engineer',
          count: 1,
          minSeniority: 'Senior',
          requiredSkills: ['Python', 'Spark', 'Databricks'],
          niceToHaveSkills: ['dbt', 'Data Architecture'],
        },
        {
          discipline: 'Testing',
          roleTitle: 'Performance & Latency QA Engineer',
          count: 1,
          minSeniority: 'Senior',
          requiredSkills: ['Performance Testing', 'k6', 'API Contract Testing'],
          niceToHaveSkills: ['Test Automation'],
        },
      ],
    };
  }

  // General banking requirement synthesis
  return {
    title: prompt.length > 40 ? prompt.slice(0, 38) + '...' : prompt,
    code: 'REQ-GEN-' + Math.floor(1000 + Math.random() * 9000),
    businessUnit: 'Group Technology Engineering',
    description: `Mobilisation request synthesized from prompt: "${prompt}". Formatted for rapid team allocation under Standard Bank agile engineering standards.`,
    urgency: p.includes('urgent') || p.includes('asap') || p.includes('immediate') ? 'Immediate' : 'High',
    duration: p.includes('week') ? '2 Weeks (Spike)' : '1 Month (Sprint)',
    workloadRequirementPercent: 100,
    aiSummary: `Analyzed requirement: "${prompt}". Synthesized cross-functional squad covering Solution Architecture, Engineering, QA Automation, and Agile Delivery.`,
    rolesNeeded: [
      {
        discipline: 'Architecture',
        roleTitle: 'Solution Architect',
        count: 1,
        minSeniority: 'Senior',
        requiredSkills: ['Solutions Architecture', 'AWS Cloud', 'Microservices'],
        niceToHaveSkills: ['Zero Trust Security'],
      },
      {
        discipline: 'Engineering',
        roleTitle: 'Full-Stack Software Engineer',
        count: 2,
        minSeniority: 'Senior',
        requiredSkills: ['React', 'TypeScript', 'Docker'],
        niceToHaveSkills: ['PostgreSQL', 'CI/CD Pipelines'],
      },
      {
        discipline: 'Testing',
        roleTitle: 'Test Automation Engineer',
        count: 1,
        minSeniority: 'Mid',
        requiredSkills: ['Test Automation', 'Playwright'],
        niceToHaveSkills: ['API Contract Testing'],
      },
      {
        discipline: 'Delivery',
        roleTitle: 'Agile Delivery Lead',
        count: 1,
        minSeniority: 'Mid',
        requiredSkills: ['Agile Delivery', 'SAFe / Scrum'],
        niceToHaveSkills: ['Jira / Confluence'],
      },
    ],
  };
}


