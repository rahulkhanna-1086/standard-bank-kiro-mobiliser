import { fallbackAnalyzePrompt } from './src/utils/analyzeRequirement';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Known Enterprise skill pool for grounding
const CANDIDATE_SKILLS = [
  'Solutions Architecture', 'AWS Cloud', 'Microservices', 'ISO 20022', 'Kafka',
  'API Gateway', 'Zero Trust Security', 'Data Architecture', 'Kubernetes', 'Terraform',
  'Java Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'CI/CD Pipelines',
  'Go', 'Tailwind CSS', 'Payment Rails', 'GraphQL', 'Test Automation', 'Playwright',
  'API Contract Testing', 'Performance Testing', 'k6', 'JMeter', 'BDD / Cucumber',
  'Python', 'Databricks', 'Spark', 'PowerBI', 'dbt', 'Agile Delivery', 'SAFe / Scrum',
  'Team Facilitation', 'Risk & Governance', 'Executive Stakeholder Mgmt', 'Jira / Confluence',
  'Release Management'
];

// API endpoint to analyze natural language prompt into delivery requirements
app.post('/api/analyze-requirement', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  // If Gemini API is configured, use gemini-3.8-flash
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are a Senior Solution Architect & Agile PMO Director at Enterprise South Africa.
Analyze this user requirement prompt and synthesize a structured Delivery Request specification for rapid squad mobilization.

User requirement prompt: "${prompt}"

Available Enterprise candidate skill tags to choose from (MUST use tags from this list whenever possible):
${CANDIDATE_SKILLS.join(', ')}

Available Disciplines:
- Architecture
- Engineering
- Testing
- Data
- Delivery

Seniorities:
- Junior
- Mid
- Senior
- Lead
- Principal

Return clean JSON matching this exact structure:
{
  "title": "Clear, professional project title (e.g. 'Customer Service AI Chatbot')",
  "code": "REQ-...",
  "businessUnit": "Appropriate banking unit, e.g. PBB Digital & Innovation",
  "description": "Comprehensive 1-2 sentence initiative overview",
  "urgency": "Immediate" | "High" | "Standard",
  "duration": "2 Weeks (Spike)" | "1 Month (Sprint)" | "3 Months (Quarterly)" | "6 Months",
  "workloadRequirementPercent": 100,
  "aiSummary": "1-2 sentence architectural summary of what was inferred from the prompt and why this squad composition was chosen.",
  "rolesNeeded": [
    {
      "discipline": "Architecture" | "Engineering" | "Testing" | "Data" | "Delivery",
      "roleTitle": "Descriptive title, e.g. Conversational AI Architect",
      "count": 1,
      "minSeniority": "Senior",
      "requiredSkills": ["skill1", "skill2"],
      "niceToHaveSkills": ["skill3"]
    }
  ]
}`,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an enterprise banking software solution architect. Always output valid JSON strictly matching the requested schema.',
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.json(parsed);
        return;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic heuristic analyzer:', err);
    }
  }

  // Fallback to domain-aware heuristic analyzer
  const fallback = fallbackAnalyzePrompt(prompt);
  res.json(fallback);
});

// Static files from public folder
app.use(express.static(path.resolve('.', 'public')));

// Dedicated download route
app.get('/download', (_req, res) => {
  const zipPath = path.resolve('.', 'public', 'squad-mobiliser.zip');
  res.download(zipPath, 'squad-mobiliser.zip');
});

// Setup Vite middleware for local development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve('.', 'dist'));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('.', 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`[Enterprise Mobiliser] Server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

