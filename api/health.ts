import type { VercelRequest, VercelResponse } from "@vercel/node"
import pg from "pg"

const { Pool } = pg

function safe(v: string | undefined) {
  if (!v) return ""
  if (v.length <= 10) return "***"
  return `${v.slice(0, 4)}***${v.slice(-4)}`
}

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const hasDb = !!process.env.DATABASE_URL
  const hasCa = !!process.env.PG_CA_CERT
  const base = process.env.BASE_URL || ""
  console.log("health env", {
    BASE_URL: safe(base),
    DATABASE_URL: hasDb,
    PG_CA_CERT: hasCa,
    node: process.version
  })

  if (!process.env.DATABASE_URL || !process.env.PG_CA_CERT) {
    return toJson(res, 500, { ok: false, message: "Missing DATABASE_URL or PG_CA_CERT" })
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true, ca: process.env.PG_CA_CERT },
    max: 2
  })

  try {
    const r = await pool.query("SELECT VERSION() AS version")
    return toJson(res, 200, { ok: true, db_version: r.rows?.[0]?.version || "" })
  } catch (e: any) {
    console.error("health error", e?.message || e, e?.stack || "")
    return toJson(res, 500, { ok: false, message: e?.message || "DB error" })
  } finally {
    await pool.end().catch(() => {})
  }
}
