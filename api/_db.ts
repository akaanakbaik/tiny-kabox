import pg from "pg"

const { Pool } = pg

function normalizeCa(raw: string): string {
  return raw.replace(/\\n/g, "\n").replace(/\r/g, "").trim()
}

function getDbUrl(): string {
  const value = process.env.DATABASE_URL || ""
  if (!value) {
    throw new Error("Missing DATABASE_URL")
  }
  return value
}

function getDbCa(): string {
  const value = normalizeCa(process.env.PG_CA_CERT || "")
  if (!value || !value.includes("BEGIN CERTIFICATE")) {
    throw new Error("Invalid PG_CA_CERT")
  }
  return value
}

function getHostFromConnectionString(connectionString: string): string | undefined {
  try {
    return new URL(connectionString).hostname
  } catch {
    return undefined
  }
}

export function makePool(): pg.Pool {
  const connectionString = getDbUrl()
  const ca = getDbCa()
  const servername = getHostFromConnectionString(connectionString)

  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: true,
      ca,
      ...(servername ? { servername } : {})
    },
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000
  })
}

export async function ensureSchema(pool: pg.Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS short_urls (
      code TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      clicks BIGINT NOT NULL DEFAULT 0
    )
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS short_urls_created_at_idx
    ON short_urls(created_at DESC)
  `)
}