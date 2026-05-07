import type {
  AgentKey,
  CompanyProfile,
  CompanyRunRecord,
  HealthStatus,
  StreamEvent,
} from "@/types/company";

export type { AgentKey, HealthStatus, StreamEvent };

export interface AgencyProfile extends CompanyProfile {
  signatureDestinations: string[];
}

export interface DemoBrief {
  slug: string;
  title: string;
  blurb: string;
  brief: {
    clientName: string;
    occasion: string;
    travelers: string;
    origin: string;
    travelMonth: string;
    durationNights: number;
    budgetUsd: number;
    destinations: string[];
    priorities: string[];
    avoid: string[];
    style: string;
    notes: string;
  };
  systems?: unknown;
}

export interface TripRunRecord extends CompanyRunRecord {
  tripPlan?: {
    tripTitle?: string;
    overview?: string;
    days: Array<{
      day: number;
      title: string;
      stay: string;
      morning: string;
      afternoon: string;
      evening: string;
      highlight: string;
    }>;
    markdown?: string;
  };
  quoteDraft?: {
    headline?: string;
    investmentRangeUsd?: string;
    inclusions: string[];
    emailDraft?: string;
  };
  campaignPack?: {
    hookLine?: string;
    instagramCaptions: string[];
    tiktokHooks: string[];
  };
}
