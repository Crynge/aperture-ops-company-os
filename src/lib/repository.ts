import type { Prisma } from "@prisma/client";

import { apertureProfile, operatingScenarios } from "@/lib/demo-data";
import { parseJson, stringifyJson } from "@/lib/json";
import { prisma } from "@/lib/prisma";
import type {
  CompanyProfile,
  CompanyRunRecord,
  CompanySystemsSnapshot,
  DeliveryPlan,
  ExecutiveBrief,
  FinanceSnapshot,
  GrowthPlan,
  HiringPlan,
  OperatingBrief,
  OperatingScenario,
  OpsWorkspace,
  RevenuePlan,
  RunTrace,
  SupportPlan,
} from "@/types/company";

type RunWithTraceEvents = Prisma.CompanyRunGetPayload<{
  include: {
    traceEvents: true;
  };
}>;

const emptyWorkspace = (
  brief: OperatingBrief,
  systems: CompanySystemsSnapshot,
  profileSlug: string,
): OpsWorkspace => ({
  status: "idle",
  profileSlug,
  brief,
  systems,
  notices: [],
});

function mapRun(run: RunWithTraceEvents): CompanyRunRecord {
  return {
    id: run.id,
    title: run.title,
    status: run.status,
    modelName: run.modelName,
    profileSlug: run.profileSlug,
    brief: parseJson<OperatingBrief>(run.briefData, {} as OperatingBrief),
    systems: parseJson<CompanySystemsSnapshot>(run.systemsData, {} as CompanySystemsSnapshot),
    workspace: parseJson<OpsWorkspace>(run.workspaceData, {} as OpsWorkspace),
    revenuePlan: parseJson<RevenuePlan | undefined>(run.revenuePlanData, undefined),
    deliveryPlan: parseJson<DeliveryPlan | undefined>(run.deliveryPlanData, undefined),
    financeSnapshot: parseJson<FinanceSnapshot | undefined>(run.financeData, undefined),
    hiringPlan: parseJson<HiringPlan | undefined>(run.hiringPlanData, undefined),
    supportPlan: parseJson<SupportPlan | undefined>(run.supportPlanData, undefined),
    growthPlan: parseJson<GrowthPlan | undefined>(run.growthPlanData, undefined),
    executiveBrief: parseJson<ExecutiveBrief | undefined>(run.executiveBriefData, undefined),
    errorMessage: run.errorMessage,
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
    traceEvents: run.traceEvents.map(
      (event): RunTrace => ({
        id: event.id,
        runId: event.runId,
        stepIndex: event.stepIndex,
        phase: event.phase,
        agentKey: event.agentKey as RunTrace["agentKey"],
        label: event.label,
        status: event.status,
        summary: event.summary,
        payload: parseJson(event.payloadData, null),
        createdAt: event.createdAt.toISOString(),
      }),
    ),
  };
}

function toLegacyProfile(profile: CompanyProfile) {
  return {
    ...profile,
    signatureDestinations: profile.serviceLines,
  };
}

function toLegacyBrief(scenario: OperatingScenario) {
  return {
    slug: scenario.slug,
    title: scenario.title,
    blurb: scenario.blurb,
    brief: {
      clientName: scenario.title,
      occasion: scenario.brief.trigger,
      travelers: scenario.brief.teamSize.toString(),
      origin: "Executive Office",
      travelMonth: scenario.brief.timeframe,
      durationNights: 7,
      budgetUsd: scenario.systems.finance.cashOnHandUsd,
      destinations: scenario.brief.priorities,
      priorities: scenario.brief.priorities,
      avoid: scenario.brief.constraints,
      style: "board-ready",
      notes: scenario.brief.notes,
    },
    systems: scenario.systems,
  };
}

function toLegacyRun(run: CompanyRunRecord) {
  return {
    ...run,
    tripPlan: {
      tripTitle: run.executiveBrief?.summary ?? run.title,
      overview:
        run.executiveBrief?.companyState ??
        run.workspace.directivePlan?.operatingPosture ??
        run.executiveBrief?.summary ??
        "Executive brief will appear once the run completes.",
      days: [] as Array<{
        day: number;
        title: string;
        stay: string;
        morning: string;
        afternoon: string;
        evening: string;
        highlight: string;
      }>,
      markdown: run.executiveBrief?.markdown ?? "",
    },
    quoteDraft: {
      headline: run.revenuePlan?.summary ?? "Operating plan ready",
      investmentRangeUsd: run.financeSnapshot?.marginOutlook ?? "See finance snapshot for commercial implications.",
      inclusions: run.revenuePlan?.next30Days ?? run.workspace.directivePlan?.prioritySequence ?? [],
      emailDraft: run.executiveBrief?.boardStyleMemo ?? run.executiveBrief?.summary ?? "",
    },
    campaignPack: {
      hookLine: run.growthPlan?.positioningShift ?? run.executiveBrief?.summary ?? "Messaging pack pending",
      instagramCaptions: run.growthPlan?.campaignPriorities ?? run.growthPlan?.next30Days ?? [],
      tiktokHooks: run.growthPlan?.demandGenerationMoves ?? run.growthPlan?.next30Days ?? [],
    },
  };
}

export async function resetDemoData() {
  await prisma.traceEvent.deleteMany();
  await prisma.companyRun.deleteMany();
  await prisma.scenarioRecord.deleteMany();
  await prisma.companyProfileRecord.deleteMany();

  await prisma.companyProfileRecord.create({
    data: {
      slug: apertureProfile.slug,
      version: apertureProfile.version,
      name: apertureProfile.name,
      data: stringifyJson(apertureProfile),
    },
  });

  await prisma.scenarioRecord.createMany({
    data: operatingScenarios.map((scenario) => ({
      slug: scenario.slug,
      title: scenario.title,
      blurb: scenario.blurb,
      data: stringifyJson({
        brief: scenario.brief,
        systems: scenario.systems,
      }),
    })),
  });
}

export async function ensureDemoData() {
  const profileCount = await prisma.companyProfileRecord.count();

  if (profileCount === 0) {
    await resetDemoData();
  }
}

export async function getCompanyProfile(slug = apertureProfile.slug): Promise<CompanyProfile> {
  await ensureDemoData();

  const record = await prisma.companyProfileRecord.findUniqueOrThrow({
    where: { slug },
  });

  return parseJson(record.data, apertureProfile);
}

export async function getAgencyProfile() {
  return toLegacyProfile(await getCompanyProfile());
}

export async function listOperatingScenarios(): Promise<OperatingScenario[]> {
  await ensureDemoData();

  const records = await prisma.scenarioRecord.findMany({
    orderBy: { createdAt: "asc" },
  });

  return records.map((record) => {
    const parsed = parseJson<{ brief: OperatingBrief; systems: CompanySystemsSnapshot }>(record.data, {
      brief: operatingScenarios[0]?.brief ?? ({} as OperatingBrief),
      systems: operatingScenarios[0]?.systems ?? ({} as CompanySystemsSnapshot),
    });

    return {
      slug: record.slug,
      title: record.title,
      blurb: record.blurb,
      brief: parsed.brief,
      systems: parsed.systems,
    };
  });
}

export async function listDemoBriefs() {
  return (await listOperatingScenarios()).map(toLegacyBrief);
}

export async function createCompanyRun(input: {
  title: string;
  modelName: string;
  profileSlug: string;
  brief: OperatingBrief;
  systems: CompanySystemsSnapshot;
}) {
  const workspace = emptyWorkspace(input.brief, input.systems, input.profileSlug);

  return prisma.companyRun.create({
    data: {
      title: input.title,
      status: "running",
      modelName: input.modelName,
      profileSlug: input.profileSlug,
      briefData: stringifyJson(input.brief),
      systemsData: stringifyJson(input.systems),
      workspaceData: stringifyJson({ ...workspace, status: "running" }),
    },
    include: {
      traceEvents: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function appendTraceEvent(input: {
  runId: string;
  stepIndex: number;
  phase: string;
  agentKey: string;
  label: string;
  status: string;
  summary: string;
  payload: unknown;
}) {
  return prisma.traceEvent.create({
    data: {
      runId: input.runId,
      stepIndex: input.stepIndex,
      phase: input.phase,
      agentKey: input.agentKey,
      label: input.label,
      status: input.status,
      summary: input.summary,
      payloadData: stringifyJson(input.payload),
    },
  });
}

export async function updateCompanyRun(
  runId: string,
  data: {
    status: string;
    workspace: OpsWorkspace;
    modelName?: string;
    revenuePlan?: RevenuePlan;
    deliveryPlan?: DeliveryPlan;
    financeSnapshot?: FinanceSnapshot;
    hiringPlan?: HiringPlan;
    supportPlan?: SupportPlan;
    growthPlan?: GrowthPlan;
    executiveBrief?: ExecutiveBrief;
    errorMessage?: string | null;
    completed?: boolean;
  },
) {
  return prisma.companyRun.update({
    where: { id: runId },
    data: {
      status: data.status,
      modelName: data.modelName,
      workspaceData: stringifyJson(data.workspace),
      revenuePlanData: data.revenuePlan ? stringifyJson(data.revenuePlan) : undefined,
      deliveryPlanData: data.deliveryPlan ? stringifyJson(data.deliveryPlan) : undefined,
      financeData: data.financeSnapshot ? stringifyJson(data.financeSnapshot) : undefined,
      hiringPlanData: data.hiringPlan ? stringifyJson(data.hiringPlan) : undefined,
      supportPlanData: data.supportPlan ? stringifyJson(data.supportPlan) : undefined,
      growthPlanData: data.growthPlan ? stringifyJson(data.growthPlan) : undefined,
      executiveBriefData: data.executiveBrief ? stringifyJson(data.executiveBrief) : undefined,
      errorMessage: data.errorMessage,
      completedAt: data.completed ? new Date() : undefined,
    },
    include: {
      traceEvents: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getCompanyRun(runId: string) {
  const run = await prisma.companyRun.findUnique({
    where: { id: runId },
    include: {
      traceEvents: {
        orderBy: [{ stepIndex: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!run) {
    return null;
  }

  return mapRun(run);
}

export async function getTripRun(runId: string) {
  const run = await getCompanyRun(runId);
  return run ? toLegacyRun(run) : null;
}

export async function listLatestRuns(limit = 6) {
  const runs = await prisma.companyRun.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      traceEvents: {
        orderBy: [{ stepIndex: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return runs.map(mapRun);
}

export async function getDashboardData() {
  try {
    const [profile, scenarios, runs] = await Promise.all([
      getCompanyProfile(),
      listOperatingScenarios(),
      listLatestRuns(4),
    ]);

    return {
      profile: toLegacyProfile(profile),
      scenarios,
      briefs: scenarios.map(toLegacyBrief),
      runs: runs.map(toLegacyRun),
    };
  } catch {
    return {
      profile: toLegacyProfile(apertureProfile),
      scenarios: operatingScenarios,
      briefs: operatingScenarios.map(toLegacyBrief),
      runs: [],
    };
  }
}
