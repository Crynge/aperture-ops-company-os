import { apertureProfile } from "@/lib/demo-data";
import { formatCurrency, sentenceList } from "@/lib/utils";
import type {
  CompanySystemsSnapshot,
  DeliveryPlan,
  DirectivePlan,
  ExecutiveBrief,
  ExecutiveQAReport,
  FinanceSnapshot,
  GrowthPlan,
  HiringPlan,
  OperatingBrief,
  RevenuePlan,
  SupportPlan,
} from "@/types/company";

function coreNarrative(brief: OperatingBrief) {
  if (brief.peopleConcern) {
    return `${brief.scenarioTitle} needs a tightly controlled operating answer that protects people first, limits unnecessary access, and separates confidential people handling from broader company execution.`;
  }

  return `${brief.scenarioTitle} needs one operating answer that sequences revenue, staffing, margin, and service risk in the same conversation.`;
}

export function mockDirectivePlan(brief: OperatingBrief): DirectivePlan {
  const prioritySequence = brief.peopleConcern
    ? [
        "Protect the affected employees before optimizing throughput.",
        "Restrict sensitive details to the smallest necessary audience.",
        "Create separate tracks for people review and client continuity.",
      ]
    : [
        "Stabilize the most constrained team first.",
        "Protect margin and cash before optional expansion.",
        "Align client promises with actual delivery and support capacity.",
      ];

  const coordinationRules = brief.peopleConcern
    ? [
        "People-sensitive facts stay within the restricted audience list.",
        "No staffing or reporting-line change can look retaliatory.",
        "Client communication should reference continuity actions, not confidential personnel detail.",
      ]
    : [
        "No major sales promise without delivery review.",
        "Every hiring action must cite a utilization, revenue, or service case.",
        "Escalated accounts stay visible in every leadership recommendation.",
      ];

  return {
    summary: coreNarrative(brief),
    operatingPosture: brief.peopleConcern
      ? "Confidential people-protection posture with controlled continuity planning."
      : "Disciplined growth with explicit capacity protection.",
    companyNarrative: brief.peopleConcern
      ? "Leadership needs to show that psychological safety and operational stability can both be protected when the response is deliberate and tightly scoped."
      : "The company is healthy enough to move, but only if leadership chooses sequencing over simultaneous ambition.",
    prioritySequence,
    coordinationRules,
  };
}

export function mockRevenuePlan(
  brief: OperatingBrief,
  systems: CompanySystemsSnapshot,
): RevenuePlan {
  return {
    summary:
      "Revenue should lean into qualified expansion and cleaner proposal quality rather than raw commitment volume.",
    pipelineAssessment: `Qualified pipeline is ${formatCurrency(systems.crm.qualifiedPipelineUsd)} with ${systems.crm.proposalsOut} proposals out, which supports selective growth but not sloppy handoffs.`,
    proposalActions: [
      "Tighten qualification on deals that would hit already constrained teams.",
      "Prioritize expansion motions with smoother onboarding paths.",
      "Add delivery-readiness checks before any launch date is promised.",
    ],
    handoffRisks: systems.crm.atRiskDeals.length > 0 ? systems.crm.atRiskDeals : ["No named handoff risks."],
    next30Days: [
      "Review all open proposals against delivery capacity.",
      "Advance the cleanest expansion opportunities first.",
      "Force one shared revenue-delivery commit threshold.",
    ],
    kpis: [
      `Pipeline coverage vs target question: ${sentenceList(brief.priorities.slice(0, 2))}`,
      `Qualified pipeline: ${formatCurrency(systems.crm.qualifiedPipelineUsd)}`,
      `Expansion opportunities: ${systems.crm.expansionOpportunities}`,
    ],
  };
}

export function mockDeliveryPlan(
  systems: CompanySystemsSnapshot,
): DeliveryPlan {
  return {
    summary:
      "Delivery should behave like the pacing function of the business, not the cleanup function after sales commitments are made.",
    utilizationStatus: `Utilization is ${systems.delivery.utilizationPct}%, with pressure concentrated in ${sentenceList(systems.delivery.constrainedTeams)}.`,
    staffingMoves: [
      "Redeploy generalists away from lower-risk internal work.",
      "Gate new launch timing through constrained-team review.",
      "Create a red-yellow-green staffing list for the next 30 days.",
    ],
    launchReadiness: `There are ${systems.delivery.launchesNext30Days} launches inside the next 30 days, so sequencing matters more than optimism.`,
    clientRisks: systems.support.escalatedAccounts,
    next30Days: [
      "Pause low-leverage expansion work if launch staffing is unclear.",
      "Name an owner for each constrained team.",
      "Publish one operating list of launches that can move safely.",
    ],
    kpis: [
      `Utilization: ${systems.delivery.utilizationPct}%`,
      `Launches next 30 days: ${systems.delivery.launchesNext30Days}`,
      `Active clients: ${systems.delivery.activeClients}`,
    ],
  };
}

export function mockFinanceSnapshot(
  systems: CompanySystemsSnapshot,
): FinanceSnapshot {
  return {
    summary:
      "Finance should tighten receivables and commitment pacing before using hiring or brand cuts as the first response.",
    marginOutlook: `Current gross margin is ${systems.finance.marginPct}% against a target of ${apertureProfile.operatingTargets.grossMarginPct}%.`,
    cashflowStatus: `Cash on hand is ${formatCurrency(systems.finance.cashOnHandUsd)} against monthly burn of ${formatCurrency(systems.finance.monthlyBurnUsd)}.`,
    invoiceActions: [
      "Escalate late receivables with named client owners.",
      "Tie invoicing discipline to delivery and account leadership.",
      "Bring finance risk into weekly exec review until buffer improves.",
    ],
    costControls: [
      "Delay non-critical spend that does not directly protect delivery, revenue, or support.",
      "Sequence hiring by capacity relief and revenue certainty.",
    ],
    riskFlags:
      systems.finance.invoiceDelays.length > 0
        ? systems.finance.invoiceDelays
        : ["No immediate invoice delay flags."],
    next30Days: [
      "Reduce aging receivables.",
      "Protect margin on new statements of work.",
      "Maintain a cash narrative leadership can explain clearly.",
    ],
    kpis: [
      `Cash on hand: ${formatCurrency(systems.finance.cashOnHandUsd)}`,
      `Receivables due: ${formatCurrency(systems.finance.receivablesDueUsd)}`,
      `Margin: ${systems.finance.marginPct}%`,
    ],
  };
}

export function mockHiringPlan(
  systems: CompanySystemsSnapshot,
  brief?: OperatingBrief,
): HiringPlan {
  const peopleFirst = Boolean(brief?.peopleConcern);

  return {
    summary: peopleFirst
      ? "People Ops should treat this as a protected employee-concern workflow first and only then decide what temporary capacity relief is safe and non-retaliatory."
      : "Hiring should relieve the most expensive bottlenecks first and treat onboarding capacity as part of the cost.",
    hiringPriorities: peopleFirst
      ? [
          "Do not use role or reporting changes as a disguised response to the complaint.",
          "Stand up temporary coverage around the affected team before opening broad new reqs.",
          "Limit leadership access to sensitive employee detail to the restricted review group.",
        ]
      : [
          "Fill roles tied directly to constrained delivery and support teams.",
          "Delay nice-to-have growth hires unless revenue certainty increases.",
          "Build one explicit backfill versus net-new hiring list.",
        ],
    onboardingPlan: peopleFirst
      ? "Any staffing relief should preserve confidentiality, minimize rumor spread, and avoid forcing the affected team into awkward interim reporting arrangements."
      : "Sequence starts in waves so managers and support systems can absorb the hires cleanly rather than creating hidden productivity drag.",
    capacityReliefMoves: peopleFirst
      ? [
          "Shift non-critical work away from the affected pod immediately.",
          "Assign temporary backup coverage from a neutral team lead.",
          "Document protected next steps through People Ops instead of ad hoc manager decisions.",
        ]
      : [
          "Use interim contractor support only where it protects launch quality.",
          "Pair new hires to the highest-pressure pods first.",
          "Require a 30-day capacity proof point for each open role.",
        ],
    peopleRisks:
      systems.people.capacityPressureTeams.length > 0
        ? systems.people.capacityPressureTeams
        : ["No major team pressure signals."],
    next30Days: peopleFirst
      ? [
          "Put immediate workload protection in place for the affected team.",
          "Run the confidential people review with named executive oversight.",
          "Reassess open roles only after the immediate trust risk is stabilized.",
        ]
      : [
          "Lock the next two highest-priority roles.",
          "Protect onboarding quality by limiting overlapping starts.",
          "Review role openings against current utilization and support backlog.",
        ],
    kpis: [
      `Open roles: ${systems.people.openRoles}`,
      `Late-stage candidates: ${systems.people.candidatesLateStage}`,
      `Onboarding starts next 30 days: ${systems.people.onboardingStartsNext30Days}`,
    ],
  };
}

export function mockSupportPlan(
  systems: CompanySystemsSnapshot,
): SupportPlan {
  return {
    summary:
      "Support should be treated as a revenue-protection function, not a cleanup queue, because SLA misses become renewal risk quickly.",
    slaHealth: `${systems.support.slaBreaches} SLA breaches and ${systems.support.backlogTickets} open backlog tickets need a cross-functional recovery plan.`,
    triageMoves: [
      "Separate escalations from routine backlog work.",
      "Assign executive attention to named at-risk accounts.",
      "Link recurring ticket themes back to delivery and onboarding fixes.",
    ],
    escalations: systems.support.escalatedAccounts,
    clientRiskAccounts: systems.support.escalatedAccounts,
    next30Days: [
      "Publish a top-account recovery list.",
      "Reduce backlog with explicit ownership and update cadence.",
      "Feed support patterns back into delivery and sales messaging.",
    ],
    kpis: [
      `Backlog: ${systems.support.backlogTickets}`,
      `SLA breaches: ${systems.support.slaBreaches}`,
      `CSAT: ${systems.support.csatPct}%`,
    ],
  };
}

export function mockGrowthPlan(
  systems: CompanySystemsSnapshot,
): GrowthPlan {
  return {
    summary:
      "Growth should sharpen the company story around operational clarity and client outcomes instead of broad category noise.",
    positioningShift:
      "Push the narrative toward company operating discipline, not generic AI automation claims.",
    campaignPriorities: [
      "Turn operating wins into sharper enterprise case studies.",
      "Align demand generation to service lines that the delivery team can absorb cleanly.",
      "Make executive-proof differentiation the center of the brand story.",
    ],
    demandGenerationMoves: [
      "Promote thought leadership that ties ops quality to business outcomes.",
      "Prioritize channels that generate qualified, not merely abundant, demand.",
      "Synchronize campaign promises with delivery reality.",
    ],
    brandNarrative:
      systems.growth.brandRisks[0] ??
      "The market should understand Aperture Ops as the company OS layer for modern operators.",
    next30Days: [
      "Refresh the homepage narrative around integrated company operations.",
      "Publish one proof-heavy case study.",
      "Tie campaigns to the cleanest pipeline lanes.",
    ],
    kpis: [
      `Inbound leads: ${systems.growth.monthlyInboundLeads}`,
      `Campaigns live: ${systems.growth.contentCampaignsLive}`,
      `Webinar pipeline: ${formatCurrency(systems.growth.webinarPipelineUsd)}`,
    ],
  };
}

export function mockExecutivePackage(input: {
  brief: OperatingBrief;
  revenuePlan: RevenuePlan;
  deliveryPlan: DeliveryPlan;
  financeSnapshot: FinanceSnapshot;
  hiringPlan: HiringPlan;
  supportPlan: SupportPlan;
  growthPlan: GrowthPlan;
}) {
  const peopleSensitive = Boolean(input.brief.peopleConcern);

  const executiveBrief: ExecutiveBrief = {
    summary: peopleSensitive
      ? "Aperture Ops should respond as a people-first executive office: protect the affected employees, restrict sensitive access, stabilize delivery safely, and keep retaliation risk at zero."
      : "Aperture Ops should act like one executive office: pace growth, protect constrained teams, tighten cash discipline, and keep escalated accounts visible.",
    companyState: peopleSensitive
      ? "The company can preserve trust only if confidential people handling is separated from broader execution decisions while still protecting client continuity."
      : "The company can keep moving, but only if leadership makes linked decisions across revenue, delivery, finance, hiring, and support rather than optimizing each lane independently.",
    topDecisions: peopleSensitive
      ? [
          "Restrict case details to the named executive and People Ops audience only.",
          "Reduce immediate workload and exposure for the affected team without creating retaliatory optics.",
          "Run a separate client-continuity plan that protects delivery without disclosing confidential people matters.",
        ]
      : [
          "Protect the most constrained delivery and support teams before increasing launch commitments.",
          "Tie hiring sequence to actual capacity relief and revenue certainty.",
          "Elevate receivables, SLA recovery, and handoff quality into the same weekly operating review.",
        ],
    criticalRisks: peopleSensitive
      ? [
          "Trust damage deepens if the affected team sees delay, rumor spread, or retaliatory staffing signals.",
          "Client continuity can be harmed if continuity owners are not assigned quickly and discretely.",
          input.growthPlan.brandNarrative,
        ]
      : [
          input.financeSnapshot.riskFlags[0] ?? "Margin quality will drift if growth outruns staffing discipline.",
          input.supportPlan.clientRiskAccounts[0] ?? "Escalations can turn into renewal pressure if recovery lacks owners.",
          input.deliveryPlan.clientRisks[0] ?? "Launch pacing may overrun team bandwidth.",
        ],
    operatingCadence: [
      "Monday cross-functional operating review",
      "Midweek delivery and support exception review",
      "Friday finance and pipeline reconciliation",
    ],
    scorecard: [
      input.financeSnapshot.kpis[2] ?? "Gross margin on track",
      input.deliveryPlan.kpis[0] ?? "Utilization controlled",
      input.supportPlan.kpis[1] ?? "SLA breach count improving",
    ],
    boardStyleMemo: peopleSensitive
      ? `The immediate win is controlled response, not speed theater. ${coreNarrative(input.brief)} Leadership should preserve confidentiality, protect the affected employees, document non-retaliatory actions, and separately assign client continuity owners.`
      : `The immediate win is sequencing. ${coreNarrative(input.brief)} Revenue quality, launch pacing, receivables, and support recovery should now be treated as one operating system problem.`,
    markdown: "",
  };

  executiveBrief.markdown = [
    `# ${input.brief.scenarioTitle} Executive Brief`,
    "",
    "## Summary",
    executiveBrief.summary,
    "",
    "## Company State",
    executiveBrief.companyState,
    "",
    "## Top Decisions",
    ...executiveBrief.topDecisions.map((item) => `- ${item}`),
    "",
    "## Critical Risks",
    ...executiveBrief.criticalRisks.map((item) => `- ${item}`),
    "",
    "## Operating Cadence",
    ...executiveBrief.operatingCadence.map((item) => `- ${item}`),
    "",
    "## Board-Style Memo",
    executiveBrief.boardStyleMemo,
  ].join("\n");

  const qaReport: ExecutiveQAReport = {
    summary: peopleSensitive
      ? "The department recommendations align around one coherent posture: restricted access, employee protection, non-retaliatory action, and controlled continuity planning."
      : "The department recommendations align around one coherent posture: disciplined growth, explicit staffing protection, and weekly executive coordination.",
    approved: true,
    contradictions: ["No blocking contradictions."],
    revisions: peopleSensitive
      ? [
          "Keep individual employee detail out of any broad operating circulation.",
          "Ensure continuity actions are framed operationally, not as commentary on the confidential concern.",
        ]
      : [
          "Keep the finance and hiring narratives explicitly linked in the final memo.",
          "Name support recovery as a revenue-protection issue, not only a service issue.",
        ],
    confidenceStatement: peopleSensitive
      ? "This brief is ready for restricted executive handling and should remain tightly controlled outside People Ops."
      : "This operating brief is decision-ready for leadership review and can be assigned into a next-30-day action cadence.",
  };

  return {
    ...qaReport,
    executiveBrief,
  };
}
