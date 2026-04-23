import { z } from "zod";

export const directivePlanSchema = z.object({
  summary: z.string(),
  operatingPosture: z.string(),
  companyNarrative: z.string(),
  prioritySequence: z.array(z.string()),
  coordinationRules: z.array(z.string()),
});

export const revenuePlanSchema = z.object({
  summary: z.string(),
  pipelineAssessment: z.string(),
  proposalActions: z.array(z.string()),
  handoffRisks: z.array(z.string()),
  next30Days: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const deliveryPlanSchema = z.object({
  summary: z.string(),
  utilizationStatus: z.string(),
  staffingMoves: z.array(z.string()),
  launchReadiness: z.string(),
  clientRisks: z.array(z.string()),
  next30Days: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const financeSnapshotSchema = z.object({
  summary: z.string(),
  marginOutlook: z.string(),
  cashflowStatus: z.string(),
  invoiceActions: z.array(z.string()),
  costControls: z.array(z.string()),
  riskFlags: z.array(z.string()),
  next30Days: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const hiringPlanSchema = z.object({
  summary: z.string(),
  hiringPriorities: z.array(z.string()),
  onboardingPlan: z.string(),
  capacityReliefMoves: z.array(z.string()),
  peopleRisks: z.array(z.string()),
  next30Days: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const supportPlanSchema = z.object({
  summary: z.string(),
  slaHealth: z.string(),
  triageMoves: z.array(z.string()),
  escalations: z.array(z.string()),
  clientRiskAccounts: z.array(z.string()),
  next30Days: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const growthPlanSchema = z.object({
  summary: z.string(),
  positioningShift: z.string(),
  campaignPriorities: z.array(z.string()),
  demandGenerationMoves: z.array(z.string()),
  brandNarrative: z.string(),
  next30Days: z.array(z.string()),
  kpis: z.array(z.string()),
});

export const executivePackageSchema = z.object({
  summary: z.string(),
  approved: z.boolean(),
  contradictions: z.array(z.string()),
  revisions: z.array(z.string()),
  confidenceStatement: z.string(),
  executiveBrief: z.object({
    summary: z.string(),
    companyState: z.string(),
    topDecisions: z.array(z.string()),
    criticalRisks: z.array(z.string()),
    operatingCadence: z.array(z.string()),
    scorecard: z.array(z.string()),
    boardStyleMemo: z.string(),
  }),
});
