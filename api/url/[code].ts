import type { VercelRequest, VercelResponse } from "@vercel/node"
import { ensureSchema, makePool } from "../_db"

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let pool = null

  try {
    if (req.method !== "GET") {
      return toJson(res, 405, { ok: false, message: "Method not allowed" })
    }

    const code = String(req.query.code || "").trim()
    if (!code) {
      return toJson(res, 400, { ok: false, message: "Missing code" })
    }

    pool = makePool()
    await ensureSchema(pool)

    const result = await pool.query(
      "SELECT code, url, created_at, clicks FROM short_urls WHERE code = $1 LIMIT 1",
      [code]
    )

    if (!result.rowCount) {
      return toJson(res, 404, { ok: false, message: "URL not found" })
    }

    const row = result.rows[0]

    return toJson(res, 200, {
      ok: true,
      data: {
        code: String(row.code || ""),
        url: String(row.url || ""),
        created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
        clicks: Number(row.clicks || 0)
      }
    })
  } catch (error: any) {
    return toJson(res, 500, {
      ok: false,
      message: error?.message || "Failed to fetch short URL detail"
    })
  } finally {
    if (pool) {
      await pool.end().catch(() => {})
    }
  }
}