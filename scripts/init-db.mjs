import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const url = process.env.DATABASE_URL ?? "file:./dev.db";

if (!url.startsWith("file:")) {
  throw new Error(`Unsupported DATABASE_URL for local bootstrap: ${url}`);
}

const relativePath = url.slice("file:".length);
const resolvedPath = path.resolve(process.cwd(), relativePath);
mkdirSync(path.dirname(resolvedPath), { recursive: true });

const db = new DatabaseSync(resolvedPath);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS "CompanyProfileRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "CompanyProfileRecord_slug_key"
  ON "CompanyProfileRecord"("slug");

  CREATE TABLE IF NOT EXISTS "ScenarioRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE UNIQUE INDEX IF NOT EXISTS "ScenarioRecord_slug_key"
  ON "ScenarioRecord"("slug");

  CREATE TABLE IF NOT EXISTS "CompanyRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "profileSlug" TEXT NOT NULL,
    "briefData" TEXT NOT NULL,
    "systemsData" TEXT NOT NULL,
    "workspaceData" TEXT NOT NULL,
    "revenuePlanData" TEXT,
    "deliveryPlanData" TEXT,
    "financeData" TEXT,
    "hiringPlanData" TEXT,
    "supportPlanData" TEXT,
    "growthPlanData" TEXT,
    "executiveBriefData" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
  );

  CREATE TABLE IF NOT EXISTS "TraceEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "phase" TEXT NOT NULL,
    "agentKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "payloadData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TraceEvent_runId_fkey"
      FOREIGN KEY ("runId") REFERENCES "CompanyRun" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE INDEX IF NOT EXISTS "TraceEvent_runId_stepIndex_idx"
  ON "TraceEvent"("runId", "stepIndex");
`);

db.close();
console.log(`SQLite schema ensured at ${resolvedPath}`);
