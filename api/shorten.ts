import type { VercelRequest, VercelResponse } from "@vercel/node"
import crypto from "crypto"
import { makePool, ensureSchema } from "./_db"

type BodyShape = {
  url?: string
  code?: string
}

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

function parseBody(input: unknown): BodyShape {
  if (!input) return {}
  if (typeof input === "string") {
    try {
      return JSON.parse(input)
    } catch {
      return {}
    }
  }
  if (typeof input === "object") return input as BodyShape
  return {}
}

function isValidCustomCode(code: string): boolean {
  const trimmed = code.trim()
  const minLen = Number(process.env.CUSTOM_CODE_MIN_LEN || "3")
  const maxLen = Number(process.env.CUSTOM_CODE_MAX_LEN || "10")

  if (!trimmed) return false
  if (trimmed.length < minLen) return false
  if (trimmed.length > maxLen) return false

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
  const minParts = Number(process.env.CODE_MIN_PARTS || "3")
  const maxParts = Number(process.env.CODE_MAX_PARTS || "6")
  const n = crypto.randomInt(minParts, maxParts + 1)

  let s = ""
  for (let i = 0; i < n; i += 1) s += pickWord()

  const cleaned = s.replace(/[^a-zA-Z0-9_-]/g, "")
  return cleaned.slice(0, 10)
}

function isPgDuplicateError(e: any): boolean {
  return e?.code === "23505"
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return toJson(res, 405, { ok: false, message: "Method not allowed" })
  }

  const baseUrl = normBase(process.env.BASE_URL || "")
  if (!baseUrl) {
    return toJson(res, 500, { ok: false, message: "Missing BASE_URL" })
  }

  const body = parseBody(req.body)
  const url = String(body.url || "").trim()
  const requestedCode = String(body.code || "").trim()

  if (!isValidUrl(url)) {
    return toJson(res, 400, { ok: false, message: "Invalid URL" })
  }

  if (requestedCode && !isValidCustomCode(requestedCode)) {
    return toJson(res, 400, { ok: false, message: "Invalid code" })
  }

  const pool = makePool()

  try {
    await ensureSchema(pool)

    if (requestedCode) {
      try {
        await pool.query(
          "INSERT INTO short_urls(code, url, created_at, clicks) VALUES ($1, $2, NOW(), 0)",
          [requestedCode, url]
        )

        const short = `${baseUrl}/${requestedCode}`

        return toJson(res, 200, {
          ok: true,
          code: requestedCode,
          url,
          shortUrl: short,
          short_url: short
        })
      } catch (e: any) {
        if (isPgDuplicateError(e)) {
          return toJson(res, 409, { ok: false, message: "Code already in use" })
        }
        return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
      }
    }

    let finalCode = ""
    let inserted = false

    for (let i = 0; i < 12; i += 1) {
      const candidate = randomCode() || `kbx${crypto.randomInt(100, 999)}`
      try {
        await pool.query(
          "INSERT INTO short_urls(code, url, created_at, clicks) VALUES ($1, $2, NOW(), 0)",
          [candidate, url]
        )
        finalCode = candidate
        inserted = true
        break
      } catch (e: any) {
        if (!isPgDuplicateError(e)) {
          return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
        }
      }
    }

    if (!inserted || !finalCode) {
      return toJson(res, 500, { ok: false, message: "Failed to generate unique code" })
    }

    const short = `${baseUrl}/${finalCode}`

    return toJson(res, 200, {
      ok: true,
      code: finalCode,
      url,
      shortUrl: short,
      short_url: short
    })
  } catch (e: any) {
    return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
  } finally {
    await pool.end().catch(() => {})
  }
}