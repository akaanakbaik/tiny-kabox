import type { VercelRequest, VercelResponse } from "@vercel/node"
import { makePool } from "./_db"

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const pool = makePool()
  try {
    const r = await pool.query("SELECT VERSION() AS version")
    return toJson(res, 200, { ok: true, db_version: r.rows?.[0]?.version || "" })
  } catch (e: any) {
    return toJson(res, 500, { ok: false, message: e?.message || "DB error" })
  } finally {
    await pool.end().catch(() => {})
  }
}