import type { VercelRequest, VercelResponse } from "@vercel/node"
import { makePool } from "../_db"

function normBase(base: string): string {
  return base.replace(/\/+$/, "")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = String(req.query.code || "").trim()
  if (!code) {
    res.statusCode = 302
    res.setHeader("Location", normBase(process.env.BASE_URL || "") || "/")
    res.end()
    return
  }

  const pool = makePool()
  try {
    const r = await pool.query("SELECT url FROM short_urls WHERE code = $1 LIMIT 1", [code])
    if (!r.rowCount) {
      res.statusCode = 302
      res.setHeader("Location", `${normBase(process.env.BASE_URL || "")}/404`)
      res.end()
      return
    }

    await pool.query("UPDATE short_urls SET clicks = clicks + 1 WHERE code = $1", [code])

    res.statusCode = 302
    res.setHeader("Location", String(r.rows[0].url))
    res.setHeader("Cache-Control", "no-store")
    res.end()
  } catch {
    res.statusCode = 302
    res.setHeader("Location", normBase(process.env.BASE_URL || "") || "/")
    res.end()
  } finally {
    await pool.end().catch(() => {})
  }
}