import type { VercelRequest, VercelResponse } from "@vercel/node"
import pg from "pg"

const { Pool } = pg

function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env ${name}`)
  return v
}

function getPool(): pg.Pool {
  const ca = env("PG_CA_CERT")
  const url = env("DATABASE_URL")
  return new Pool({
    connectionString: url,
    ssl: {
      rejectUnauthorized: true,
      ca
    },
    max: 5
  })
}

async function ensureSchema(pool: pg.Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS short_urls (
      code TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      clicks BIGINT NOT NULL DEFAULT 0
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS short_urls_created_at_idx ON short_urls(created_at DESC)`)
}

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.send(JSON.stringify(data))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET")
    return toJson(res, 405, { ok: false, message: "Method not allowed" })
  }

  const pool = getPool()
  try {
    await ensureSchema(pool)
    const v = await pool.query(`SELECT NOW() as now, VERSION() as version`)
    const row = v.rows[0] || {}
    return toJson(res, 200, {
      ok: true,
      db_time: row.now ? new Date(row.now).toISOString() : null,
      db_version: row.version ? String(row.version) : null
    })
  } catch (e: any) {
    return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
  } finally {
    await pool.end().catch(() => {})
  }
}