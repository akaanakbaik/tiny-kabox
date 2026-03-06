import type { VercelRequest, VercelResponse } from "@vercel/node"
import { ensureSchema, makePool } from "./_db"

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  let pool = null

  try {
    pool = makePool()
    await ensureSchema(pool)

    const result = await pool.query("SELECT VERSION() AS version, NOW() AS now")
    const row = result.rows?.[0] || {}

    return toJson(res, 200, {
      ok: true,
      db_version: String(row.version || ""),
      db_time: row.now ? new Date(row.now).toISOString() : null
    })
  } catch (error: any) {
    return toJson(res, 500, {
      ok: false,
      message: error?.message || "Health check failed"
    })
  } finally {
    if (pool) {
      await pool.end().catch(() => {})
    }
  }
}