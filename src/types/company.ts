export type AgentKey =
  | "chief-of-staff"
  | "sales-ops-lead"
  | "delivery-ops-lead"
  | "finance-ops-lead"
  | "people-ops-lead"
  | "support-ops-lead"
  | "growth-ops-lead"
  | "executive-qa";

export interface CompanyProfile {
  version: number;
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  positioning: string;
  brandVoice: {
    tone: string[];
    bannedPhrases: string[];
    leadershipPromise: string;
  };
  serviceLines: string[];
  teamStructure: {
    totalEmployees: number;
    departments: Array<{
      name: string;
      headcount: number;
      mandate: string;
    }>;
  };
  policies: {
    delivery: string[];
    finance: string[];
    hiring: string[];
    support: string[];
    escalation: string[];
  };
  operatingTargets: {
    grossMarginPct: number;
    utilizationPct: number;
    npsTarget: number;
    cashBufferMonths: number;
    pipelineCoverageMonths: number;
  };
  visualDirection: {
    palette: string[];
    typography: string;
    atmosphere: string;
  };
}

export interface CompanySystemsSnapshot {
  crm: {
    qualifiedPipelineUsd: number;
    proposalsOut: number;
    expansionOpportunities: number;
    atRiskDeals: string[];
  };
  delivery: {
    utilizationPct: number;
    activeClients: number;
    launchesNext30Days: number;
    constrainedTeams: string[];
  };
  finance: {
    cashOnHandUsd: number;
    monthlyBurnUsd: number;
    receivablesDueUsd: number;
    marginPct: number;
    invoiceDelays: string[];
  };
  people: {
    openRoles: number;
    candidatesLateStage: number;
    onboardingStartsNext30Days: number;
    capacityPressureTeams: string[];
  };
  support: {
    backlogTickets: number;
    slaBreaches: number;
    escalatedAccounts: string[];
    csatPct: number;
  };
  growth: {
    monthlyInboundLeads: number;
    contentCampaignsLive: number;
    webinarPipelineUsd: number;
    brandRisks: string[];
  };
}

export interface OperatingBrief {
  scenarioTitle: string;
  trigger: string;
  timeframe: string;
  teamSize: number;
  activeClients: number;
  sensitivity?: "standard" | "sensitive" | "highly-sensitive";
  priorities: string[];
  constraints: string[];
  leadershipQuestion: string;
  notes: string;
  peopleConcern?: {
    theme: string;
    confidentiality: string;
    restrictedAudience: string[];
    requiredActions: string[];
  };
}

export interface OperatingScenario {
  slug: string;
  title: string;
  blurb: string;
  brief: OperatingBrief;
  systems: CompanySystemsSnapshot;
}

export interface DirectivePlan {
  summary: string;
  operatingPosture: string;
  companyNarrative: string;
  prioritySequence: string[];
  coordinationRules: string[];
}

export interface RevenuePlan {
  summary: string;
  pipelineAssessment: string;
  proposalActions: string[];
  handoffRisks: string[];
  next30Days: string[];
  kpis: string[];
}

export interface DeliveryPlan {
  summary: string;
  utilizationStatus: string;
  staffingMoves: string[];
  launchReadiness: string;
  clientRisks: string[];
  next30Days: string[];
  kpis: string[];
}

export interface FinanceSnapshot {
  summary: string;
  marginOutlook: string;
  cashflowStatus: string;
  invoiceActions: string[];
  costControls: string[];
  riskFlags: string[];
  next30Days: string[];
  kpis: string[];
}

export interface HiringPlan {
  summary: string;
  hiringPriorities: string[];
  onboardingPlan: string;
  capacityReliefMoves: string[];
  peopleRisks: string[];
  next30Days: string[];
  kpis: string[];
}

export interface SupportPlan {
  summary: string;
  slaHealth: string;
  triageMoves: string[];
  escalations: string[];
  clientRiskAccounts: string[];
  next30Days: string[];
  kpis: string[];
}

export interface GrowthPlan {
  summary: string;
  positioningShift: string;
  campaignPriorities: string[];
  demandGenerationMoves: string[];
  brandNarrative: string;
  next30Days: string[];
  kpis: string[];
}

export interface ExecutiveBrief {
  summary: string;
  companyState: string;
  topDecisions: string[];
  criticalRisks: string[];
  operatingCadence: string[];
  scorecard: string[];
  boardStyleMemo: string;
  markdown: string;
}

export interface ExecutiveQAReport {
  summary: string;
  approved: boolean;
  contradictions: string[];
  revisions: string[];
  confidenceStatement: string;
}

export interface OpsWorkspace {
  status: "idle" | "running" | "needs_revision" | "completed" | "failed";
  profileSlug: string;
  brief: OperatingBrief;
  systems: CompanySystemsSnapshot;
  notices: string[];
  directivePlan?: DirectivePlan;
  revenuePlan?: RevenuePlan;
  deliveryPlan?: DeliveryPlan;
  financeSnapshot?: FinanceSnapshot;
  hiringPlan?: HiringPlan;
  supportPlan?: SupportPlan;
  growthPlan?: GrowthPlan;
  executiveBrief?: ExecutiveBrief;
  qaReport?: ExecutiveQAReport;
}

export interface RunTrace {
  id: string;
  runId: string;
  stepIndex: number;
  phase: string;
  agentKey: AgentKey | "system";
  label: string;
  status: string;
  summary: string;
  payload: unknown;
  createdAt: string;
}

export interface CompanyRunRecord {
  id: string;
  title: string;
  status: string;
  modelName: string;
  profileSlug: string;
  brief: OperatingBrief;
  systems: CompanySystemsSnapshot;
  workspace: OpsWorkspace;
  revenuePlan?: RevenuePlan;
  deliveryPlan?: DeliveryPlan;
  financeSnapshot?: FinanceSnapshot;
  hiringPlan?: HiringPlan;
  supportPlan?: SupportPlan;
  growthPlan?: GrowthPlan;
  executiveBrief?: ExecutiveBrief;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  traceEvents: RunTrace[];
}

export interface HealthStatus {
  ok: boolean;
  activeModel: string;
  availableModels: string[];
  baseUrl: string;
  message: string;
}

export type StreamEvent =
  | {
      type: "run.created";
      runId: string;
      title: string;
      modelName: string;
    }
  | {
      type: "run.notice";
      runId: string;
      level: "info" | "warn";
      message: string;
    }
  | {
      type: "agent.started";
      runId: string;
      stepIndex: number;
      agentKey: AgentKey;
      label: string;
    }
  | {
      type: "agent.completed";
      runId: string;
      stepIndex: number;
      agentKey: AgentKey;
      label: string;
      summary: string;
      payload: unknown;
      modelName: string;
    }
  | {
      type: "run.completed";
      runId: string;
      run: CompanyRunRecord;
    }
  | {
      type: "run.failed";
      runId: string;
      message: string;
    };
