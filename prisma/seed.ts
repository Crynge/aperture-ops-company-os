import { resetDemoData } from "../src/lib/repository";

async function main() {
  await resetDemoData();
  console.log("Aperture Ops demo data seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
