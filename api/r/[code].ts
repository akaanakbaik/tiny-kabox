import type { VercelRequest, VercelResponse } from "@vercel/node"
import { ensureSchema, makePool } from "../_db"

function normalizeBaseUrl(input: string): string {
  return input.replace(/\/+$/, "")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let pool = null

  try {
    const code = String(req.query.code || "").trim()
    const baseUrl = normalizeBaseUrl(process.env.BASE_URL || "") || "/"

    if (!code) {
      res.statusCode = 302
      res.setHeader("Location", baseUrl)
      res.setHeader("Cache-Control", "no-store")
      res.end()
      return
    }

    pool = makePool()
    await ensureSchema(pool)

    const found = await pool.query("SELECT url FROM short_urls WHERE code = $1 LIMIT 1", [code])

    if (!found.rowCount) {
      res.statusCode = 302
      res.setHeader("Location", `${baseUrl}/404`)
      res.setHeader("Cache-Control", "no-store")
      res.end()
      return
    }

    const targetUrl = String(found.rows[0].url || "")

    await pool.query("UPDATE short_urls SET clicks = clicks + 1 WHERE code = $1", [code])

    res.statusCode = 302
    res.setHeader("Location", targetUrl)
    res.setHeader("Cache-Control", "no-store")
    res.end()
  } catch {
    const baseUrl = normalizeBaseUrl(process.env.BASE_URL || "") || "/"
    res.statusCode = 302
    res.setHeader("Location", baseUrl)
    res.setHeader("Cache-Control", "no-store")
    res.end()
  } finally {
    if (pool) {
      await pool.end().catch(() => {})
    }
  }
}