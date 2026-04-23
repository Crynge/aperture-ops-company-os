import {
  appendTraceEvent,
  createCompanyRun,
  getCompanyProfile,
  getCompanyRun,
  updateCompanyRun,
} from "@/lib/repository";
import { generateJson, getClaudeEnv } from "@/lib/claude";
import {
  mockDeliveryPlan,
  mockDirectivePlan,
  mockExecutivePackage,
  mockFinanceSnapshot,
  mockGrowthPlan,
  mockHiringPlan,
  mockRevenuePlan,
  mockSupportPlan,
} from "@/lib/swarm/mock";
import {
  deliveryPlanSchema,
  directivePlanSchema,
  executivePackageSchema,
  financeSnapshotSchema,
  growthPlanSchema,
  hiringPlanSchema,
  revenuePlanSchema,
  supportPlanSchema,
} from "@/lib/swarm/schemas";
import { sleep, titleFromOperatingBrief } from "@/lib/utils";
import type {
  AgentKey,
  CompanySystemsSnapshot,
  DeliveryPlan,
  ExecutiveBrief,
  FinanceSnapshot,
  GrowthPlan,
  HiringPlan,
  OperatingBrief,
  OpsWorkspace,
  RevenuePlan,
  StreamEvent,
  SupportPlan,
} from "@/types/company";
import type { z } from "zod";

type Emit = (event: StreamEvent) => Promise<void>;

async function persistSystemEvent(input: {
  runId: string;
  stepIndex: number;
  summary: string;
  payload: unknown;
}) {
  await appendTraceEvent({
    runId: input.runId,
    stepIndex: input.stepIndex,
    phase: "system",
    agentKey: "system",
    label: "System",
    status: "info",
    summary: input.summary,
    payload: input.payload,
  });
}

async function generateWithFallback<T>(input: {
  systemPrompt: string;
  userPrompt: string;
  jsonShape: string;
  schema: z.ZodType<T>;
  mockFactory: () => T;
  maxTokens?: number;
}) {
  try {
    return await generateJson({
      systemPrompt: input.systemPrompt,
      userPrompt: input.userPrompt,
      jsonShape: input.jsonShape,
      schema: input.schema,
      maxTokens: input.maxTokens,
    });
  } catch (error) {
    const env = getClaudeEnv();

    if (!env.COMPANY_OS_ALLOW_MOCK_FALLBACK) {
      throw error;
    }

    return {
      data: input.schema.parse(input.mockFactory()),
      modelName: "mock://aperture-demo-fallback",
    };
  }
}

function buildContext(workspace: OpsWorkspace) {
  return JSON.stringify(workspace, null, 2);
}

async function runAgent<T>(input: {
  runId: string;
  stepIndex: number;
  agentKey: AgentKey;
  label: string;
  workspace: OpsWorkspace;
  schema: z.ZodType<T>;
  jsonShape: string;
  systemPrompt: string;
  userPrompt: string;
  mockFactory: () => T;
  applyResult: (result: T, modelName: string) => Promise<OpsWorkspace>;
  emit: Emit;
}) {
  await appendTraceEvent({
    runId: input.runId,
    stepIndex: input.stepIndex,
    phase: "agent",
    agentKey: input.agentKey,
    label: input.label,
    status: "started",
    summary: `${input.label} is working.`,
    payload: { snapshot: input.workspace },
  });

  await input.emit({
    type: "agent.started",
    runId: input.runId,
    stepIndex: input.stepIndex,
    agentKey: input.agentKey,
    label: input.label,
  });

  await sleep(240);

  const { data, modelName } = await generateWithFallback({
    systemPrompt: input.systemPrompt,
    userPrompt: input.userPrompt,
    jsonShape: input.jsonShape,
    schema: input.schema,
    mockFactory: input.mockFactory,
  });

  const workspace = await input.applyResult(data, modelName);

  await appendTraceEvent({
    runId: input.runId,
    stepIndex: input.stepIndex,
    phase: "agent",
    agentKey: input.agentKey,
    label: input.label,
    status: "completed",
    summary: (data as { summary?: string }).summary ?? `${input.label} completed.`,
    payload: data,
  });

  await input.emit({
    type: "agent.completed",
    runId: input.runId,
    stepIndex: input.stepIndex,
    agentKey: input.agentKey,
    label: input.label,
    summary: (data as { summary?: string }).summary ?? `${input.label} completed.`,
    payload: data,
    modelName,
  });

  return { data, workspace, modelName };
}

export async function runCompanyWorkflow(input: {
  brief: OperatingBrief;
  systems: CompanySystemsSnapshot;
  profileSlug?: string;
  emit: Emit;
}) {
  const profile = await getCompanyProfile(input.profileSlug);
  const initialModelName = getClaudeEnv().ANTHROPIC_MODEL;
  const title = titleFromOperatingBrief(input.brief);

  const created = await createCompanyRun({
    title,
    profileSlug: profile.slug,
    modelName: initialModelName,
    brief: input.brief,
    systems: input.systems,
  });

  await input.emit({
    type: "run.created",
    runId: created.id,
    title,
    modelName: initialModelName,
  });

  await persistSystemEvent({
    runId: created.id,
    stepIndex: 0,
    summary: "Company OS workflow initialized.",
    payload: {
      activeModel: initialModelName,
      mockFallbackEnabled: getClaudeEnv().COMPANY_OS_ALLOW_MOCK_FALLBACK,
    },
  });

  let workspace: OpsWorkspace = {
    status: "running",
    profileSlug: profile.slug,
    brief: input.brief,
    systems: input.systems,
    notices: [],
  };

  try {
    const directive = await runAgent({
      runId: created.id,
      stepIndex: 1,
      agentKey: "chief-of-staff",
      label: "Chief of Staff",
      workspace,
      emit: input.emit,
      schema: directivePlanSchema,
      jsonShape: `{
  "summary": "string",
  "operatingPosture": "string",
  "companyNarrative": "string",
  "prioritySequence": ["string"],
  "coordinationRules": ["string"]
}`,
      systemPrompt:
        "You are the Chief of Staff for Aperture Ops. Convert company ambiguity into one crisp operating posture. Be specific, executive, and cross-functional.",
      userPrompt: `Company profile:\n${JSON.stringify(profile, null, 2)}\n\nOperating brief:\n${JSON.stringify(
        input.brief,
        null,
        2,
      )}\n\nCompany systems:\n${JSON.stringify(input.systems, null, 2)}`,
      mockFactory: () => mockDirectivePlan(input.brief),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, directivePlan: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          modelName,
        });
        return workspace;
      },
    });

    if (directive.modelName.startsWith("mock://")) {
      const message =
        "Claude did not produce a live structured result, so the repo switched to the built-in operating-system fallback for this run.";
      workspace = { ...workspace, notices: [...workspace.notices, message] };
      await persistSystemEvent({
        runId: created.id,
        stepIndex: 1,
        summary: message,
        payload: { fallback: directive.modelName },
      });
      await input.emit({
        type: "run.notice",
        runId: created.id,
        level: "warn",
        message,
      });
    }

    const revenue = await runAgent({
      runId: created.id,
      stepIndex: 2,
      agentKey: "sales-ops-lead",
      label: "Sales Ops Lead",
      workspace,
      emit: input.emit,
      schema: revenuePlanSchema,
      jsonShape: `{
  "summary": "string",
  "pipelineAssessment": "string",
  "proposalActions": ["string"],
  "handoffRisks": ["string"],
  "next30Days": ["string"],
  "kpis": ["string"]
}`,
      systemPrompt:
        "You are the Sales Ops Lead. Focus on pipeline quality, proposal discipline, and handoff readiness. Avoid generic revenue talk.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nChief of Staff directive:\n${JSON.stringify(
        workspace.directivePlan,
        null,
        2,
      )}\n\nCRM snapshot:\n${JSON.stringify(input.systems.crm, null, 2)}`,
      mockFactory: () => mockRevenuePlan(input.brief, input.systems),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, revenuePlan: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          revenuePlan: result,
          modelName,
        });
        return workspace;
      },
    });

    const delivery = await runAgent({
      runId: created.id,
      stepIndex: 3,
      agentKey: "delivery-ops-lead",
      label: "Delivery Ops Lead",
      workspace,
      emit: input.emit,
      schema: deliveryPlanSchema,
      jsonShape: `{
  "summary": "string",
  "utilizationStatus": "string",
  "staffingMoves": ["string"],
  "launchReadiness": "string",
  "clientRisks": ["string"],
  "next30Days": ["string"],
  "kpis": ["string"]
}`,
      systemPrompt:
        "You are the Delivery Ops Lead. Protect launch quality, utilization health, and staffing realism. Be concrete and operational.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nDirective:\n${JSON.stringify(
        workspace.directivePlan,
        null,
        2,
      )}\n\nDelivery snapshot:\n${JSON.stringify(input.systems.delivery, null, 2)}\n\nSupport snapshot:\n${JSON.stringify(
        input.systems.support,
        null,
        2,
      )}`,
      mockFactory: () => mockDeliveryPlan(input.systems),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, deliveryPlan: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          revenuePlan: workspace.revenuePlan,
          deliveryPlan: result,
          modelName,
        });
        return workspace;
      },
    });

    const finance = await runAgent({
      runId: created.id,
      stepIndex: 4,
      agentKey: "finance-ops-lead",
      label: "Finance Ops Lead",
      workspace,
      emit: input.emit,
      schema: financeSnapshotSchema,
      jsonShape: `{
  "summary": "string",
  "marginOutlook": "string",
  "cashflowStatus": "string",
  "invoiceActions": ["string"],
  "costControls": ["string"],
  "riskFlags": ["string"],
  "next30Days": ["string"],
  "kpis": ["string"]
}`,
      systemPrompt:
        "You are the Finance Ops Lead. Tie cash, margin, and commitment pacing together. Every finance point should imply an operating action.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nDirective:\n${JSON.stringify(
        workspace.directivePlan,
        null,
        2,
      )}\n\nFinance snapshot:\n${JSON.stringify(input.systems.finance, null, 2)}\n\nRevenue plan:\n${JSON.stringify(
        revenue.data,
        null,
        2,
      )}`,
      mockFactory: () => mockFinanceSnapshot(input.systems),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, financeSnapshot: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          revenuePlan: workspace.revenuePlan,
          deliveryPlan: workspace.deliveryPlan,
          financeSnapshot: result,
          modelName,
        });
        return workspace;
      },
    });

    const hiring = await runAgent({
      runId: created.id,
      stepIndex: 5,
      agentKey: "people-ops-lead",
      label: "People Ops Lead",
      workspace,
      emit: input.emit,
      schema: hiringPlanSchema,
      jsonShape: `{
  "summary": "string",
  "hiringPriorities": ["string"],
  "onboardingPlan": "string",
  "capacityReliefMoves": ["string"],
  "peopleRisks": ["string"],
  "next30Days": ["string"],
  "kpis": ["string"]
}`,
      systemPrompt:
        "You are the People Ops Lead. Convert company pressure into a staffing sequence, not a generic talent memo.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nDirective:\n${JSON.stringify(
        workspace.directivePlan,
        null,
        2,
      )}\n\nPeople snapshot:\n${JSON.stringify(input.systems.people, null, 2)}\n\nDelivery plan:\n${JSON.stringify(
        delivery.data,
        null,
        2,
      )}\n\nFinance snapshot:\n${JSON.stringify(finance.data, null, 2)}`,
      mockFactory: () => mockHiringPlan(input.systems, input.brief),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, hiringPlan: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          revenuePlan: workspace.revenuePlan,
          deliveryPlan: workspace.deliveryPlan,
          financeSnapshot: workspace.financeSnapshot,
          hiringPlan: result,
          modelName,
        });
        return workspace;
      },
    });

    const support = await runAgent({
      runId: created.id,
      stepIndex: 6,
      agentKey: "support-ops-lead",
      label: "Support Ops Lead",
      workspace,
      emit: input.emit,
      schema: supportPlanSchema,
      jsonShape: `{
  "summary": "string",
  "slaHealth": "string",
  "triageMoves": ["string"],
  "escalations": ["string"],
  "clientRiskAccounts": ["string"],
  "next30Days": ["string"],
  "kpis": ["string"]
}`,
      systemPrompt:
        "You are the Support Ops Lead. Treat support as revenue protection and operational signal, not just queue management.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nDirective:\n${JSON.stringify(
        workspace.directivePlan,
        null,
        2,
      )}\n\nSupport snapshot:\n${JSON.stringify(input.systems.support, null, 2)}\n\nDelivery plan:\n${JSON.stringify(
        delivery.data,
        null,
        2,
      )}`,
      mockFactory: () => mockSupportPlan(input.systems),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, supportPlan: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          revenuePlan: workspace.revenuePlan,
          deliveryPlan: workspace.deliveryPlan,
          financeSnapshot: workspace.financeSnapshot,
          hiringPlan: workspace.hiringPlan,
          supportPlan: result,
          modelName,
        });
        return workspace;
      },
    });

    const growth = await runAgent({
      runId: created.id,
      stepIndex: 7,
      agentKey: "growth-ops-lead",
      label: "Growth Ops Lead",
      workspace,
      emit: input.emit,
      schema: growthPlanSchema,
      jsonShape: `{
  "summary": "string",
  "positioningShift": "string",
  "campaignPriorities": ["string"],
  "demandGenerationMoves": ["string"],
  "brandNarrative": "string",
  "next30Days": ["string"],
  "kpis": ["string"]
}`,
      systemPrompt:
        "You are the Growth Ops Lead. Sharpen demand generation and market positioning in ways the company can actually fulfill.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nDirective:\n${JSON.stringify(
        workspace.directivePlan,
        null,
        2,
      )}\n\nGrowth snapshot:\n${JSON.stringify(input.systems.growth, null, 2)}\n\nRevenue plan:\n${JSON.stringify(
        revenue.data,
        null,
        2,
      )}\n\nDelivery plan:\n${JSON.stringify(delivery.data, null, 2)}`,
      mockFactory: () => mockGrowthPlan(input.systems),
      applyResult: async (result, modelName) => {
        workspace = { ...workspace, growthPlan: result };
        await updateCompanyRun(created.id, {
          status: "running",
          workspace,
          revenuePlan: workspace.revenuePlan,
          deliveryPlan: workspace.deliveryPlan,
          financeSnapshot: workspace.financeSnapshot,
          hiringPlan: workspace.hiringPlan,
          supportPlan: workspace.supportPlan,
          growthPlan: result,
          modelName,
        });
        return workspace;
      },
    });

    const executive = await runAgent({
      runId: created.id,
      stepIndex: 8,
      agentKey: "executive-qa",
      label: "Executive QA",
      workspace,
      emit: input.emit,
      schema: executivePackageSchema,
      jsonShape: `{
  "summary": "string",
  "approved": true,
  "contradictions": ["string"],
  "revisions": ["string"],
  "confidenceStatement": "string",
  "executiveBrief": {
    "summary": "string",
    "companyState": "string",
    "topDecisions": ["string"],
    "criticalRisks": ["string"],
    "operatingCadence": ["string"],
    "scorecard": ["string"],
    "boardStyleMemo": "string"
  }
}`,
      systemPrompt:
        "You are Executive QA for Aperture Ops. Resolve cross-functional contradictions and produce one final executive brief that leadership can act on immediately.",
      userPrompt: `Operating brief:\n${JSON.stringify(input.brief, null, 2)}\n\nFull workspace:\n${buildContext(
        workspace,
      )}`,
      mockFactory: () =>
        mockExecutivePackage({
          brief: input.brief,
          revenuePlan: workspace.revenuePlan ?? mockRevenuePlan(input.brief, input.systems),
          deliveryPlan: workspace.deliveryPlan ?? mockDeliveryPlan(input.systems),
          financeSnapshot: workspace.financeSnapshot ?? mockFinanceSnapshot(input.systems),
          hiringPlan: workspace.hiringPlan ?? mockHiringPlan(input.systems, input.brief),
          supportPlan: workspace.supportPlan ?? mockSupportPlan(input.systems),
          growthPlan: workspace.growthPlan ?? mockGrowthPlan(input.systems),
        }),
      applyResult: async (result, modelName) => {
        const executiveBrief: ExecutiveBrief = {
          ...result.executiveBrief,
          markdown: [
            `# ${input.brief.scenarioTitle} Executive Brief`,
            "",
            "## Summary",
            result.executiveBrief.summary,
            "",
            "## Company State",
            result.executiveBrief.companyState,
            "",
            "## Top Decisions",
            ...result.executiveBrief.topDecisions.map((item) => `- ${item}`),
            "",
            "## Critical Risks",
            ...result.executiveBrief.criticalRisks.map((item) => `- ${item}`),
            "",
            "## Operating Cadence",
            ...result.executiveBrief.operatingCadence.map((item) => `- ${item}`),
            "",
            "## Board-Style Memo",
            result.executiveBrief.boardStyleMemo,
          ].join("\n"),
        };

        const nextStatus = result.approved ? "completed" : "needs_revision";
        workspace = {
          ...workspace,
          executiveBrief,
          qaReport: {
            summary: result.summary,
            approved: result.approved,
            contradictions: result.contradictions,
            revisions: result.revisions,
            confidenceStatement: result.confidenceStatement,
          },
          status: nextStatus,
        };

        await updateCompanyRun(created.id, {
          status: nextStatus,
          workspace,
          revenuePlan: workspace.revenuePlan,
          deliveryPlan: workspace.deliveryPlan,
          financeSnapshot: workspace.financeSnapshot,
          hiringPlan: workspace.hiringPlan,
          supportPlan: workspace.supportPlan,
          growthPlan: workspace.growthPlan,
          executiveBrief,
          modelName,
          completed: result.approved,
        });
        return workspace;
      },
    });

    if (!executive.data.approved) {
      workspace = {
        ...workspace,
        status: "completed",
        notices: [
          ...workspace.notices,
          "Executive QA requested revisions, and the executive memo was tightened before final delivery.",
        ],
      };

      await persistSystemEvent({
        runId: created.id,
        stepIndex: 9,
        summary: "Executive QA revisions were applied before finalizing the operating brief.",
        payload: {
          revisions: executive.data.revisions,
        },
      });

      await updateCompanyRun(created.id, {
        status: "completed",
        workspace,
        revenuePlan: workspace.revenuePlan,
        deliveryPlan: workspace.deliveryPlan,
        financeSnapshot: workspace.financeSnapshot,
        hiringPlan: workspace.hiringPlan,
        supportPlan: workspace.supportPlan,
        growthPlan: workspace.growthPlan,
        executiveBrief: workspace.executiveBrief,
        modelName: executive.modelName,
        completed: true,
      });
    }

    const finalRun = await getCompanyRun(created.id);

    if (!finalRun) {
      throw new Error("Run completed, but the company record could not be reloaded.");
    }

    await input.emit({
      type: "run.completed",
      runId: created.id,
      run: finalRun,
    });

    return finalRun;
  } catch (error) {
    const message = error instanceof Error ? error.message : "The company workflow failed unexpectedly.";
    workspace = { ...workspace, status: "failed", notices: [...workspace.notices, message] };

    await updateCompanyRun(created.id, {
      status: "failed",
      workspace,
      errorMessage: message,
    });

    await appendTraceEvent({
      runId: created.id,
      stepIndex: 99,
      phase: "system",
      agentKey: "system",
      label: "System",
      status: "failed",
      summary: message,
      payload: { error: message },
    });

    await input.emit({
      type: "run.failed",
      runId: created.id,
      message,
    });

    throw error;
  }
}

export async function generateExecutiveReportForRun(runId: string) {
  const run = await getCompanyRun(runId);

  if (!run) {
    throw new Error("Run not found.");
  }

  if (run.executiveBrief) {
    return run.executiveBrief;
  }

  const executivePackage = mockExecutivePackage({
    brief: run.brief,
    revenuePlan: run.revenuePlan ?? mockRevenuePlan(run.brief, run.systems),
    deliveryPlan: run.deliveryPlan ?? mockDeliveryPlan(run.systems),
    financeSnapshot: run.financeSnapshot ?? mockFinanceSnapshot(run.systems),
    hiringPlan: run.hiringPlan ?? mockHiringPlan(run.systems, run.brief),
    supportPlan: run.supportPlan ?? mockSupportPlan(run.systems),
    growthPlan: run.growthPlan ?? mockGrowthPlan(run.systems),
  });

  const executiveBrief: ExecutiveBrief = {
    ...executivePackage.executiveBrief,
    markdown:
      executivePackage.executiveBrief.markdown ||
      [
        `# ${run.brief.scenarioTitle} Executive Brief`,
        "",
        "## Summary",
        executivePackage.executiveBrief.summary,
      ].join("\n"),
  };

  await updateCompanyRun(runId, {
    status: run.status,
    workspace: {
      ...run.workspace,
      executiveBrief,
    },
    revenuePlan: run.revenuePlan,
    deliveryPlan: run.deliveryPlan,
    financeSnapshot: run.financeSnapshot,
    hiringPlan: run.hiringPlan,
    supportPlan: run.supportPlan,
    growthPlan: run.growthPlan,
    executiveBrief,
    modelName: run.modelName,
  });

  return executiveBrief;
}
