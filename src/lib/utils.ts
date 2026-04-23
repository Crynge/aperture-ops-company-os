import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function sentenceList(items: string[]) {
  return items.filter(Boolean).join(", ");
}

export function titleFromOperatingBrief(brief: {
  scenarioTitle: string;
  timeframe: string;
}) {
  return `${brief.scenarioTitle} for ${brief.timeframe}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
