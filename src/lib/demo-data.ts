import type {
  CompanyProfile,
  ExecutiveBrief,
  OperatingScenario,
} from "@/types/company";

export const apertureProfile: CompanyProfile = {
  version: 1,
  slug: "aperture-ops",
  name: "Aperture Ops",
  tagline: "Thirty AI employees, one operating system, zero handoff chaos.",
  mission:
    "Aperture Ops helps growing companies run revenue, delivery, finance, hiring, support, and executive rhythm through one coordinated AI operations layer.",
  positioning:
    "Aperture Ops is a 30-person AI operations agency that behaves like a modern executive office, combining backoffice rigor with live decision support across the company.",
  brandVoice: {
    tone: ["decisive", "executive", "calm under pressure", "operator-grade"],
    bannedPhrases: ["move fast and break things", "growth at all costs", "spray and pray"],
    leadershipPromise:
      "Every operating recommendation should feel board-ready, grounded in data, and specific enough to assign on Monday morning.",
  },
  serviceLines: [
    "revenue operations",
    "delivery management",
    "finance and margin control",
    "people operations",
    "support systems",
    "executive reporting",
  ],
  teamStructure: {
    totalEmployees: 30,
    departments: [
      { name: "Revenue", headcount: 5, mandate: "Pipeline quality, proposals, expansion, forecasting." },
      { name: "Delivery", headcount: 10, mandate: "Client launches, staffing, utilization, fulfillment quality." },
      { name: "Finance", headcount: 3, mandate: "Margins, billing, receivables, cash discipline." },
      { name: "People", headcount: 4, mandate: "Hiring, onboarding, staffing pressure, performance health." },
      { name: "Support", headcount: 4, mandate: "Client issues, SLA protection, escalations." },
      { name: "Growth", headcount: 4, mandate: "Positioning, campaigns, demand generation, brand signal." },
    ],
  },
  policies: {
    delivery: [
      "No new launch should start without named staffing coverage and handoff clarity.",
      "Utilization above 82% requires mitigation before additional commitments are approved.",
    ],
    finance: [
      "Protect a minimum three-month cash buffer unless leadership explicitly chooses to draw it down.",
      "Every margin recommendation must name the tradeoff, not just the number.",
    ],
    hiring: [
      "Open roles should be tied to utilization pressure, revenue coverage, or service risk.",
      "Onboarding capacity is a constraint, not a footnote.",
    ],
    support: [
      "Escalated accounts must be surfaced alongside delivery and revenue decisions.",
      "SLA breaches should trigger cross-functional recovery plans, not isolated ticket work.",
    ],
    escalation: [
      "Conflicts between growth, delivery, and finance should be resolved in the executive brief.",
      "Every major recommendation should identify an owner and a next-30-day action.",
    ],
  },
  operatingTargets: {
    grossMarginPct: 42,
    utilizationPct: 76,
    npsTarget: 62,
    cashBufferMonths: 3,
    pipelineCoverageMonths: 4,
  },
  visualDirection: {
    palette: ["graphite", "bone", "oxidized teal", "signal amber", "slate silver"],
    typography: "Cormorant Garamond headlines with IBM Plex Sans body.",
    atmosphere: "Executive war room meets premium annual report.",
  },
};

export const operatingScenarios: OperatingScenario[] = [
  {
    slug: "quarterly-planning",
    title: "Quarterly Planning Reset",
    blurb: "Pipeline is healthy, but delivery capacity and margin quality are starting to drift apart.",
    brief: {
      scenarioTitle: "Quarterly Planning Reset",
      trigger: "Leadership wants a single plan for growth, staffing, and margin control before the new quarter begins.",
      timeframe: "Q3 planning cycle",
      teamSize: 30,
      activeClients: 21,
      priorities: ["protect gross margin", "increase qualified pipeline", "avoid delivery strain"],
      constraints: ["hiring budget is capped", "two major launches overlap", "support SLAs are slipping"],
      leadershipQuestion: "How do we grow next quarter without overcommitting the delivery team or thinning cash discipline?",
      notes:
        "The CEO wants one decision-ready operating brief that unifies revenue targets, staffing actions, and service risk.",
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 1850000,
        proposalsOut: 12,
        expansionOpportunities: 5,
        atRiskDeals: ["Monark Health renewal", "Eastline migration pilot"],
      },
      delivery: {
        utilizationPct: 81,
        activeClients: 21,
        launchesNext30Days: 4,
        constrainedTeams: ["Implementation", "RevOps Enablement"],
      },
      finance: {
        cashOnHandUsd: 970000,
        monthlyBurnUsd: 312000,
        receivablesDueUsd: 226000,
        marginPct: 39,
        invoiceDelays: ["Harbor Bio", "Strata Legal"],
      },
      people: {
        openRoles: 4,
        candidatesLateStage: 3,
        onboardingStartsNext30Days: 2,
        capacityPressureTeams: ["Implementation", "Support"],
      },
      support: {
        backlogTickets: 47,
        slaBreaches: 6,
        escalatedAccounts: ["Northbeam", "Relay Commerce"],
        csatPct: 88,
      },
      growth: {
        monthlyInboundLeads: 41,
        contentCampaignsLive: 3,
        webinarPipelineUsd: 240000,
        brandRisks: ["Messaging feels too generic for enterprise operators."],
      },
    },
  },
  {
    slug: "hiring-surge",
    title: "Hiring Surge Decision",
    blurb: "Demand is climbing fast, but onboarding and manager bandwidth may buckle before the new roles pay off.",
    brief: {
      scenarioTitle: "Hiring Surge Decision",
      trigger: "Two enterprise wins would require immediate delivery and support expansion.",
      timeframe: "Next 45 days",
      teamSize: 30,
      activeClients: 24,
      priorities: ["staff upcoming launches", "preserve onboarding quality", "avoid margin erosion"],
      constraints: ["manager capacity is thin", "support already has escalation pressure"],
      leadershipQuestion: "Which hires should be opened now, and what should wait until revenue is more certain?",
      notes: "The COO wants a hiring sequence, not just a wish list.",
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 2140000,
        proposalsOut: 15,
        expansionOpportunities: 7,
        atRiskDeals: ["Callisto Healthcare expansion"],
      },
      delivery: {
        utilizationPct: 84,
        activeClients: 24,
        launchesNext30Days: 5,
        constrainedTeams: ["Implementation", "Technical Project Management", "Support"],
      },
      finance: {
        cashOnHandUsd: 1180000,
        monthlyBurnUsd: 326000,
        receivablesDueUsd: 194000,
        marginPct: 41,
        invoiceDelays: ["Pioneer Freight"],
      },
      people: {
        openRoles: 6,
        candidatesLateStage: 5,
        onboardingStartsNext30Days: 3,
        capacityPressureTeams: ["Delivery", "People Ops"],
      },
      support: {
        backlogTickets: 52,
        slaBreaches: 8,
        escalatedAccounts: ["Monark Health", "Zeno Labs"],
        csatPct: 86,
      },
      growth: {
        monthlyInboundLeads: 46,
        contentCampaignsLive: 4,
        webinarPipelineUsd: 310000,
        brandRisks: ["Case-study depth is lagging the quality of work."],
      },
    },
  },
  {
    slug: "delivery-bottleneck",
    title: "Delivery Bottleneck Response",
    blurb: "Utilization is high, launches are stacking up, and the leadership team needs a credible throttle plan.",
    brief: {
      scenarioTitle: "Delivery Bottleneck Response",
      trigger: "Client launches and expansion work are outpacing available specialist capacity.",
      timeframe: "Next 30 days",
      teamSize: 30,
      activeClients: 26,
      priorities: ["protect client quality", "reduce staffing strain", "avoid missed launches"],
      constraints: ["cannot pause all growth activity", "support also needs relief"],
      leadershipQuestion: "What work should be slowed, reassigned, or declined to keep the company stable?",
      notes: "The executive team wants to know where to say no before the business says yes by accident.",
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 1630000,
        proposalsOut: 10,
        expansionOpportunities: 4,
        atRiskDeals: ["Summit Retail expansion", "Lattice growth pilot"],
      },
      delivery: {
        utilizationPct: 88,
        activeClients: 26,
        launchesNext30Days: 6,
        constrainedTeams: ["Implementation", "Solutions", "Support"],
      },
      finance: {
        cashOnHandUsd: 860000,
        monthlyBurnUsd: 305000,
        receivablesDueUsd: 176000,
        marginPct: 37,
        invoiceDelays: ["Helio Systems", "Northbeam"],
      },
      people: {
        openRoles: 5,
        candidatesLateStage: 2,
        onboardingStartsNext30Days: 1,
        capacityPressureTeams: ["Delivery", "Support"],
      },
      support: {
        backlogTickets: 61,
        slaBreaches: 11,
        escalatedAccounts: ["Strata Legal", "Relay Commerce", "Northbeam"],
        csatPct: 83,
      },
      growth: {
        monthlyInboundLeads: 34,
        contentCampaignsLive: 2,
        webinarPipelineUsd: 170000,
        brandRisks: ["Case studies overpromise operational speed."],
      },
    },
  },
  {
    slug: "cashflow-risk",
    title: "Cashflow Risk Review",
    blurb: "Receivables have slipped and leadership needs a company-wide operating correction before cash gets tight.",
    brief: {
      scenarioTitle: "Cashflow Risk Review",
      trigger: "Finance flagged a cash buffer dip if invoices remain delayed and hiring continues at the planned pace.",
      timeframe: "Next 60 days",
      teamSize: 30,
      activeClients: 19,
      priorities: ["stabilize cash", "protect delivery quality", "sequence spending carefully"],
      constraints: ["cannot trigger visible client instability", "must preserve top-tier hires already in motion"],
      leadershipQuestion: "What immediate operating changes reduce risk fastest without damaging future revenue?",
      notes: "The CEO wants an operating answer, not just a finance warning memo.",
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 1210000,
        proposalsOut: 8,
        expansionOpportunities: 3,
        atRiskDeals: ["Northbeam renewal"],
      },
      delivery: {
        utilizationPct: 74,
        activeClients: 19,
        launchesNext30Days: 2,
        constrainedTeams: ["Customer Success"],
      },
      finance: {
        cashOnHandUsd: 540000,
        monthlyBurnUsd: 301000,
        receivablesDueUsd: 338000,
        marginPct: 35,
        invoiceDelays: ["Helio Systems", "Aster Media", "Harbor Bio"],
      },
      people: {
        openRoles: 3,
        candidatesLateStage: 4,
        onboardingStartsNext30Days: 2,
        capacityPressureTeams: ["Finance"],
      },
      support: {
        backlogTickets: 39,
        slaBreaches: 4,
        escalatedAccounts: ["Harbor Bio"],
        csatPct: 89,
      },
      growth: {
        monthlyInboundLeads: 28,
        contentCampaignsLive: 2,
        webinarPipelineUsd: 120000,
        brandRisks: ["Brand spend is disconnected from current cash reality."],
      },
    },
  },
  {
    slug: "support-backlog",
    title: "Support Backlog Recovery",
    blurb: "Escalations are climbing and the business needs a cross-functional response, not a ticket queue patch.",
    brief: {
      scenarioTitle: "Support Backlog Recovery",
      trigger: "Support SLA misses are starting to affect renewal confidence and account health.",
      timeframe: "Next 21 days",
      teamSize: 30,
      activeClients: 23,
      priorities: ["stabilize key accounts", "reduce backlog", "rebuild renewal confidence"],
      constraints: ["delivery team is already near threshold", "sales cannot overpromise recovery timing"],
      leadershipQuestion: "What company-wide moves stop support pain from turning into churn risk?",
      notes: "The CRO wants a client-safe recovery plan that sales and delivery can actually uphold.",
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 1490000,
        proposalsOut: 11,
        expansionOpportunities: 4,
        atRiskDeals: ["Northbeam expansion", "Helio renewal"],
      },
      delivery: {
        utilizationPct: 79,
        activeClients: 23,
        launchesNext30Days: 3,
        constrainedTeams: ["Support", "Customer Success"],
      },
      finance: {
        cashOnHandUsd: 910000,
        monthlyBurnUsd: 297000,
        receivablesDueUsd: 182000,
        marginPct: 40,
        invoiceDelays: ["Relay Commerce"],
      },
      people: {
        openRoles: 2,
        candidatesLateStage: 2,
        onboardingStartsNext30Days: 1,
        capacityPressureTeams: ["Support", "Customer Success"],
      },
      support: {
        backlogTickets: 84,
        slaBreaches: 17,
        escalatedAccounts: ["Northbeam", "Helio Systems", "Relay Commerce"],
        csatPct: 79,
      },
      growth: {
        monthlyInboundLeads: 31,
        contentCampaignsLive: 2,
        webinarPipelineUsd: 145000,
        brandRisks: ["Client sentiment could leak into market perception if escalations linger."],
      },
    },
  },
  {
    slug: "leadership-weekly-review",
    title: "Leadership Weekly Review",
    blurb: "The exec team wants one concise operating brief covering pipeline, margin, delivery health, hiring, and risk.",
    brief: {
      scenarioTitle: "Leadership Weekly Review",
      trigger: "Weekly executive check-in needs a cross-company snapshot with real decisions, not raw department updates.",
      timeframe: "This week",
      teamSize: 30,
      activeClients: 22,
      priorities: ["clarify top decisions", "surface cross-functional risk", "sequence the next 30 days"],
      constraints: ["keep it board-ready", "avoid noisy department-level detail"],
      leadershipQuestion: "What matters most this week, who owns it, and what cannot drift another seven days?",
      notes: "The CEO wants a short but forceful weekly operating memo.",
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 1710000,
        proposalsOut: 13,
        expansionOpportunities: 6,
        atRiskDeals: ["Aster Media renewal"],
      },
      delivery: {
        utilizationPct: 77,
        activeClients: 22,
        launchesNext30Days: 3,
        constrainedTeams: ["Implementation"],
      },
      finance: {
        cashOnHandUsd: 1010000,
        monthlyBurnUsd: 309000,
        receivablesDueUsd: 212000,
        marginPct: 41,
        invoiceDelays: ["Northbeam"],
      },
      people: {
        openRoles: 3,
        candidatesLateStage: 4,
        onboardingStartsNext30Days: 2,
        capacityPressureTeams: ["Implementation", "Support"],
      },
      support: {
        backlogTickets: 44,
        slaBreaches: 5,
        escalatedAccounts: ["Monark Health"],
        csatPct: 87,
      },
      growth: {
        monthlyInboundLeads: 38,
        contentCampaignsLive: 3,
        webinarPipelineUsd: 220000,
        brandRisks: ["Thought leadership cadence is good, but differentiators need sharpening."],
      },
    },
  },
  {
    slug: "people-concern-escalation",
    title: "People Concern Escalation",
    blurb: "A highly sensitive internal issue involving burnout, manager conduct concerns, and team trust requires a restricted, people-first operating response.",
    brief: {
      scenarioTitle: "People Concern Escalation",
      trigger:
        "Multiple employees raised confidential concerns about burnout, uneven treatment, and manager behavior inside a high-pressure delivery pod.",
      timeframe: "Next 72 hours",
      teamSize: 30,
      activeClients: 22,
      sensitivity: "highly-sensitive",
      priorities: [
        "protect employee wellbeing",
        "contain trust and retention risk",
        "preserve client continuity without forcing harmful pacing",
      ],
      constraints: [
        "access must stay tightly restricted",
        "no retaliatory staffing move can be taken",
        "client coverage cannot collapse while the issue is investigated",
      ],
      leadershipQuestion:
        "What immediate, confidential company actions protect people first while stabilizing delivery and leadership trust?",
      notes:
        "This workflow should be treated as restricted to executive, people ops, and only the minimum operational owners needed to protect staff and client continuity.",
      peopleConcern: {
        theme: "burnout, manager conduct concerns, and team psychological safety",
        confidentiality: "Restricted circulation. Do not broad-share details outside executive leadership and People Ops.",
        restrictedAudience: ["CEO", "Chief of Staff", "People Ops Lead", "Executive QA"],
        requiredActions: [
          "stabilize the affected team workload immediately",
          "open a confidential people review path",
          "protect reporting employees from retaliation",
          "separate client continuity planning from people-investigation details",
        ],
      },
    },
    systems: {
      crm: {
        qualifiedPipelineUsd: 1580000,
        proposalsOut: 9,
        expansionOpportunities: 4,
        atRiskDeals: ["Northbeam renewal", "Callisto Healthcare expansion"],
      },
      delivery: {
        utilizationPct: 86,
        activeClients: 22,
        launchesNext30Days: 4,
        constrainedTeams: ["Implementation Pod B", "Support", "Solutions"],
      },
      finance: {
        cashOnHandUsd: 925000,
        monthlyBurnUsd: 308000,
        receivablesDueUsd: 205000,
        marginPct: 38,
        invoiceDelays: ["Relay Commerce"],
      },
      people: {
        openRoles: 3,
        candidatesLateStage: 2,
        onboardingStartsNext30Days: 1,
        capacityPressureTeams: ["Implementation Pod B", "Support"],
      },
      support: {
        backlogTickets: 49,
        slaBreaches: 7,
        escalatedAccounts: ["Northbeam", "Monark Health"],
        csatPct: 85,
      },
      growth: {
        monthlyInboundLeads: 35,
        contentCampaignsLive: 2,
        webinarPipelineUsd: 180000,
        brandRisks: ["Employer-brand and client-confidence risk if the issue is mishandled."],
      },
    },
  },
];

export const landingExecutivePreview: ExecutiveBrief = {
  summary: "Aperture Ops converts a noisy company into one clear operating rhythm.",
  companyState:
    "Demand is healthy, but the company performs best when leadership makes revenue, staffing, margin, and SLA choices in one place instead of four separate meetings.",
  topDecisions: [
    "Sequence hiring behind constrained delivery and support teams, not across the board.",
    "Protect cash by accelerating receivables and tightening proposal-to-handoff quality.",
    "Reduce launch strain before expanding commitments in the next 30 days.",
  ],
  criticalRisks: [
    "Delivery pressure can quietly erode margin if launch pacing is left ungoverned.",
    "Support escalations become renewal risk if sales and delivery do not align their story.",
  ],
  operatingCadence: [
    "Monday executive review",
    "Midweek delivery and support checkpoint",
    "Friday margin and pipeline reconciliation",
  ],
  scorecard: [
    "Pipeline coverage above 4 months",
    "Utilization below 82% for constrained teams",
    "Gross margin back above target band",
  ],
  boardStyleMemo:
    "Aperture Ops is strongest when leadership acts on one integrated operating brief. The winning move is not more dashboards; it is faster, cleaner company-level tradeoff resolution.",
  markdown: `# Aperture Ops Executive Brief

## Summary
Aperture Ops converts a noisy company into one clear operating rhythm.

## Decisions
- Sequence hiring behind constrained delivery and support teams, not across the board.
- Protect cash by accelerating receivables and tightening proposal-to-handoff quality.
- Reduce launch strain before expanding commitments in the next 30 days.
`,
};
