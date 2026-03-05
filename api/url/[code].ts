import type { VercelRequest, VercelResponse } from "@vercel/node"
import { makePool } from "../_db"

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = String(req.query.code || "").trim()
  if (!code) return toJson(res, 400, { ok: false, message: "Missing code" })

  const pool = makePool()
  try {
    const r = await pool.query("SELECT code, url, created_at, clicks FROM short_urls WHERE code = $1 LIMIT 1", [code])
    if (!r.rowCount) return toJson(res, 404, { ok: false, message: "Not found" })
    return toJson(res, 200, { ok: true, data: r.rows[0] })
  } catch (e: any) {
    return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
  } finally {
    await pool.end().catch(() => {})
  }
}