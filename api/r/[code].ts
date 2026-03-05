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
    max: 20
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

function notFound(res: VercelResponse): void {
  res.status(404)
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.send("Not Found")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD")
    return notFound(res)
  }

  const code = String(req.query.code || "").trim()
  if (!code) return notFound(res)

  const pool = getPool()

  try {
    await ensureSchema(pool)
    const found = await pool.query(`SELECT url FROM short_urls WHERE code=$1`, [code])
    if (!found.rowCount || found.rowCount === 0) return notFound(res)

    const url = String(found.rows[0].url || "")
    if (!url) return notFound(res)

    await pool.query(`UPDATE short_urls SET clicks = clicks + 1 WHERE code=$1`, [code])

    res.statusCode = 302
    res.setHeader("Location", url)
    res.setHeader("Cache-Control", "no-store")
    return res.end()
  } catch {
    return notFound(res)
  } finally {
    await pool.end().catch(() => {})
  }
}