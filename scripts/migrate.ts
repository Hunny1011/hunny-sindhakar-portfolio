// Applies every SQL file in supabase/migrations in order. Each file must be idempotent.
// Usage: pnpm db:migrate
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const dir = join(process.cwd(), "supabase", "migrations");

async function main() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
      process.stdout.write(`applying ${file}... `);
      await client.query(readFileSync(join(dir, file), "utf8"));
      console.log("ok");
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
