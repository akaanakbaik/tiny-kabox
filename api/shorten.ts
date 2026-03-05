import type { VercelRequest, VercelResponse } from "@vercel/node"
import crypto from "crypto"
import { makePool } from "./_db"

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function normBase(base: string): string {
  return base.replace(/\/+$/, "")
}

function isValidCustomCode(code: string): boolean {
  const trimmed = code.trim()
  if (!trimmed) return false
  if (trimmed.length < (Number(process.env.CUSTOM_CODE_MIN_LEN) || 3)) return false
  if (trimmed.length > (Number(process.env.CUSTOM_CODE_MAX_LEN) || 10)) return false
  return /^[a-zA-Z0-9_-]+$/.test(trimmed)
}

const WORDS = [
  "kbx",
  "tiny",
  "url",
  "go",
  "link",
  "fast",
  "mini",
  "safe",
  "web",
  "box",
  "aka",
  "dev",
  "id",
  "net",
  "app",
  "pro",
  "byte",
  "code",
  "data",
  "hub",
  "node",
  "edge",
  "cloud",
  "snap",
  "dash",
  "nova",
  "mint",
  "zen",
  "echo",
  "flux",
  "kite",
  "volt",
  "pixel"
]

function pickWord(): string {
  const i = crypto.randomInt(0, WORDS.length)
  return WORDS[i]
}

function randomCode(): string {
  const minParts = Number(process.env.CODE_MIN_PARTS) || 3
  const maxParts = Number(process.env.CODE_MAX_PARTS) || 6
  const n = crypto.randomInt(minParts, maxParts + 1)
  let s = ""
  for (let i = 0; i < n; i++) s += pickWord()
  return s.slice(0, 10).replace(/[^a-zA-Z0-9_-]/g, "")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return toJson(res, 405, { ok: false, message: "Method not allowed" })

  const baseUrl = normBase(process.env.BASE_URL || "")
  if (!baseUrl) return toJson(res, 500, { ok: false, message: "Missing BASE_URL" })

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
  const url = String(body?.url || "").trim()
  const requestedCode = String(body?.code || "").trim()

  if (!isValidUrl(url)) return toJson(res, 400, { ok: false, message: "Invalid URL" })

  const code = requestedCode ? (isValidCustomCode(requestedCode) ? requestedCode : "") : ""
  if (requestedCode && !code) return toJson(res, 400, { ok: false, message: "Invalid code" })

  const pool = makePool()
  try {
    let finalCode = code || randomCode()
    for (let i = 0; i < 8; i++) {
      const exists = await pool.query("SELECT 1 FROM short_urls WHERE code = $1 LIMIT 1", [finalCode])
      if (exists.rowCount === 0) break
      if (code) return toJson(res, 409, { ok: false, message: "Code already in use" })
      finalCode = randomCode()
    }

    await pool.query(
      "INSERT INTO short_urls(code, url, created_at, clicks) VALUES ($1, $2, NOW(), 0)",
      [finalCode, url]
    )

    return toJson(res, 200, { ok: true, code: finalCode, url, shortUrl: `${baseUrl}/${finalCode}` })
  } catch (e: any) {
    return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
  } finally {
    await pool.end().catch(() => {})
  }
}