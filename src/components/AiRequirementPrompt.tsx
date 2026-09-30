import { fallbackAnalyzePrompt } from '../utils/analyzeRequirement';
import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, Loader2, CheckCircle2, RefreshCw, Wand2, Lightbulb, Users } from 'lucide-react';
import { DeliveryRequest, RoleRequirement } from '../types';

interface AiRequirementPromptProps {
  onApplyAiRequest: (request: DeliveryRequest, aiSummary: string) => void;
  isAutoAssembling?: boolean;
}

const EXAMPLE_PROMPTS = [
  {
    label: 'AI Chatbot',
    text: 'Like we need to build an chatbot for customer self-service with WhatsApp and web integration',
    icon: '💬',
  },
  {
    label: 'Fraud Engine',
    text: 'Build a real-time fraud detection engine for instant payments with sub-50ms latency',
    icon: '🛡️',
  },
  {
    label: 'Mobile Banking',
    text: 'Mobile banking app feature with biometric authentication and offline transaction sync',
    icon: '📱',
  },
  {
    label: 'ISO 20022 Clearing',
    text: 'Migrate core payments clearing to ISO 20022 and high-throughput Kafka streaming on AWS',
    icon: '⚡',
  },
];

export const AiRequirementPrompt: React.FC<AiRequirementPromptProps> = ({
  onApplyAiRequest,
  isAutoAssembling,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<{
    title: string;
    summary: string;
    rolesCount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const inputPrompt = (textToAnalyze ?? prompt).trim();
    if (!inputPrompt) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call server-side API endpoint
      const response = import.meta.env.VITE_DEMO_MODE === 'true' ? null : await fetch('/api/analyze-requirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      if (response && !response.ok) {
        throw new Error(`Analysis service returned status ${response.status}`);
      }

      const data = response ? await response.json() : fallbackAnalyzePrompt(inputPrompt);

      // Transform to full DeliveryRequest
      const reqId = `req-ai-${Date.now()}`;
      const rolesWithIds: RoleRequirement[] = (data.rolesNeeded || []).map((r: any, idx: number) => ({
        id: `role-ai-${idx}-${Date.now()}`,
        discipline: r.discipline || 'Engineering',
        roleTitle: r.roleTitle || `${r.discipline} Specialist`,
        count: typeof r.count === 'number' ? r.count : 1,
        minSeniority: r.minSeniority || 'Senior',
        requiredSkills: Array.isArray(r.requiredSkills) ? r.requiredSkills : [],
        niceToHaveSkills: Array.isArray(r.niceToHaveSkills) ? r.niceToHaveSkills : [],
      }));

      const synthesizedRequest: DeliveryRequest = {
        id: reqId,
        title: data.title || 'Synthesized Delivery Initiative',
        code: data.code || `AI-${Math.floor(100 + Math.random() * 900)}`,
        businessUnit: data.businessUnit || 'PBB Digital Engineering',
        description: data.description || inputPrompt,
        urgency: data.urgency || 'High',
        duration: data.duration || '1 Month (Sprint)',
        workloadRequirementPercent: data.workloadRequirementPercent || 100,
        rolesNeeded: rolesWithIds,
      };

      const summaryText = data.aiSummary || `Synthesized requirement from prompt: "${inputPrompt}". Mobilized ${rolesWithIds.reduce((sum, r) => sum + r.count, 0)} specialist slots.`;

      setLastAnalysis({
        title: synthesizedRequest.title,
        summary: summaryText,
        rolesCount: rolesWithIds.reduce((sum, r) => sum + r.count, 0),
      });

      // Apply to app and trigger auto squad assembly
      onApplyAiRequest(synthesizedRequest, summaryText);
    } catch (err: any) {
      console.error('Failed to analyze prompt with server, running client heuristic fallback:', err);
      // Client heuristic fallback for complete reliability
      const p = inputPrompt.toLowerCase();
      const isChatbot = p.includes('chat') || p.includes('bot') || p.includes('assistant') || p.includes('nlp');
      
      const fallbackRequest: DeliveryRequest = {
        id: `req-fallback-${Date.now()}`,
        title: isChatbot ? 'Customer Service AI Chatbot' : inputPrompt.slice(0, 36) + '...',
        code: `AI-${Math.floor(100 + Math.random() * 900)}`,
        businessUnit: 'PBB Digital & Innovation',
        description: `Automated requirement synthesized for: "${inputPrompt}"`,
        urgency: p.includes('urgent') || p.includes('immediate') ? 'Immediate' : 'High',
        duration: '1 Month (Sprint)',
        workloadRequirementPercent: 100,
        rolesNeeded: [
          {
            id: `role-fb-1`,
            discipline: 'Architecture',
            roleTitle: 'Solutions & Cloud Architect',
            count: 1,
            minSeniority: 'Senior',
            requiredSkills: ['Solutions Architecture', 'AWS Cloud', 'API Gateway'],
            niceToHaveSkills: ['Zero Trust Security'],
          },
          {
            id: `role-fb-2`,
            discipline: 'Engineering',
            roleTitle: 'Full-Stack Developer (TypeScript/React)',
            count: 2,
            minSeniority: 'Senior',
            requiredSkills: ['React', 'TypeScript', 'Docker'],
            niceToHaveSkills: ['PostgreSQL', 'Python'],
          },
          {
            id: `role-fb-3`,
            discipline: 'Testing',
            roleTitle: 'Automation QA Engineer',
            count: 1,
            minSeniority: 'Mid',
            requiredSkills: ['Test Automation', 'Playwright'],
            niceToHaveSkills: ['API Contract Testing'],
          },
          {
            id: `role-fb-4`,
            discipline: 'Delivery',
            roleTitle: 'Agile Delivery Lead',
            count: 1,
            minSeniority: 'Mid',
            requiredSkills: ['Agile Delivery', 'SAFe / Scrum'],
            niceToHaveSkills: ['Jira / Confluence'],
          },
        ],
      };

      const summaryText = `Analyzed requirement: "${inputPrompt}". Generated cross-functional squad covering Architecture, Engineering, QA Automation, and Delivery.`;

      setLastAnalysis({
        title: fallbackRequest.title,
        summary: summaryText,
        rolesCount: fallbackRequest.rolesNeeded.reduce((sum, r) => sum + r.count, 0),
      });

      onApplyAiRequest(fallbackRequest, summaryText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseExample = (exampleText: string) => {
    setPrompt(exampleText);
    handleAnalyze(exampleText);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl shadow-md border border-blue-800/60 p-4 sm:p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
            <Wand2 className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                AI Prompt-to-Squad Mobiliser
              </span>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.2 rounded-full font-medium">
                {import.meta.env.VITE_DEMO_MODE === 'true' ? 'Rules-based demo' : 'Auto-Analysis'}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Describe Your Need — AI Will Analyze & Assemble the Squad
            </h2>
          </div>
        </div>
      </div>

      {/* Natural Language Prompt Input Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && prompt.trim()) {
                handleAnalyze();
              }
            }}
            placeholder='Type prompt, e.g. "Like we need to build an chatbot for customer support" or "Fraud detection spike"...'
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={isLoading || !prompt.trim()}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition shadow-sm cursor-pointer whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
              <span>Analyzing & Assembling...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Analyze & Suggest Squad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium flex items-center mr-1 text-[11px]">
          <Lightbulb className="w-3 h-3 text-amber-400 mr-1" />
          Try examples:
        </span>
        {EXAMPLE_PROMPTS.map((ex, i) => (
          <button
            key={i}
            onClick={() => handleUseExample(ex.text)}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700/70 transition text-[11px] cursor-pointer"
            title={ex.text}
          >
            <span>{ex.icon}</span>
            <span className="font-medium">{ex.label}</span>
          </button>
        ))}
      </div>

      {/* Last Analysis Notification / Banner */}
      {lastAnalysis && !isLoading && (
        <div className="mt-3 p-3 bg-blue-950/70 border border-blue-700/60 rounded-lg flex items-start space-x-2.5 text-xs text-blue-100 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <strong className="text-white font-semibold">
                Squad Assembled for: {lastAnalysis.title}
              </strong>
              <span className="text-[11px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-medium">
                {lastAnalysis.rolesCount} Squad Members Matched
              </span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
              {lastAnalysis.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

