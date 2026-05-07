import { checkClaudeHealth, generateJson, getClaudeEnv } from "@/lib/claude";

export function getOllamaEnv() {
  return getClaudeEnv();
}

export async function checkOllamaHealth() {
  return checkClaudeHealth();
}

export { generateJson };
