import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { extractJsonObject } from "@/lib/json";
import type { HealthStatus } from "@/types/company";

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-20250514"),
  ANTHROPIC_BASE_URL: z.string().optional(),
  COMPANY_OS_ALLOW_MOCK_FALLBACK: z
    .string()
    .default("true")
    .transform((value) => value === "true"),
});

function baseApiUrl(baseUrl?: string) {
  return (baseUrl && baseUrl.trim()) || "https://api.anthropic.com";
}

export function getClaudeEnv() {
  return envSchema.parse({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
    ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL,
    COMPANY_OS_ALLOW_MOCK_FALLBACK: process.env.COMPANY_OS_ALLOW_MOCK_FALLBACK,
  });
}

export function getAnthropicClient() {
  const env = getClaudeEnv();

  return new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    baseURL: env.ANTHROPIC_BASE_URL || undefined,
  });
}

function textFromContent(content: Anthropic.Messages.Message["content"]) {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

export async function checkClaudeHealth(): Promise<HealthStatus> {
  const env = getClaudeEnv();
  const baseUrl = baseApiUrl(env.ANTHROPIC_BASE_URL);

  if (!env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      activeModel: env.ANTHROPIC_MODEL,
      availableModels: [],
      baseUrl,
      message: "Missing ANTHROPIC_API_KEY. Add it to .env to enable live Claude runs.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/v1/models`, {
      headers: {
        "anthropic-version": "2023-06-01",
        "x-api-key": env.ANTHROPIC_API_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Anthropic model lookup failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as {
      data?: Array<{ id: string }>;
    };
    const availableModels = payload.data?.map((model) => model.id) ?? [];

    return {
      ok: true,
      activeModel: availableModels.includes(env.ANTHROPIC_MODEL)
        ? env.ANTHROPIC_MODEL
        : availableModels[0] ?? env.ANTHROPIC_MODEL,
      availableModels,
      baseUrl,
      message: "Anthropic is reachable and ready for company-operation runs.",
    };
  } catch (error) {
    return {
      ok: false,
      activeModel: env.ANTHROPIC_MODEL,
      availableModels: [],
      baseUrl,
      message: error instanceof Error ? error.message : "Unable to reach the Anthropic API.",
    };
  }
}

export async function generateJson<T>(input: {
  systemPrompt: string;
  userPrompt: string;
  jsonShape: string;
  schema: z.ZodType<T>;
  maxTokens?: number;
}) {
  const env = getClaudeEnv();

  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY.");
  }

  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: input.maxTokens ?? 1800,
    temperature: 0.4,
    system: input.systemPrompt,
    messages: [
      {
        role: "user",
        content: `${input.userPrompt}

Return valid JSON only.
JSON shape:
${input.jsonShape}`,
      },
    ],
  });

  const content = textFromContent(response.content);

  if (!content) {
    throw new Error("Claude returned no text content.");
  }

  const parsed = JSON.parse(extractJsonObject(content));

  return {
    data: input.schema.parse(parsed),
    modelName: response.model,
  };
}
