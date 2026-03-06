import type { VercelRequest, VercelResponse } from "@vercel/node"
import crypto from "crypto"
import { ensureSchema, makePool } from "./_db"

type RequestBody = {
  url?: string
  code?: string
}

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

function normalizeBaseUrl(input: string): string {
  return input.replace(/\/+$/, "")
}

function parseBody(body: unknown): RequestBody {
  if (!body) return {}
  if (typeof body === "string") {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  if (typeof body === "object") return body as RequestBody
  return {}
}

function isValidUrl(input: string): boolean {
  try {
    const u = new URL(input)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function isValidCode(input: string): boolean {
  const minLen = Number(process.env.CUSTOM_CODE_MIN_LEN || "3")
  const maxLen = Number(process.env.CUSTOM_CODE_MAX_LEN || "10")
  if (input.length < minLen || input.length > maxLen) return false
  return /^[a-zA-Z0-9_-]+$/.test(input)
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
  return WORDS[crypto.randomInt(0, WORDS.length)]
}

function generateRandomCode(): string {
  const minParts = Number(process.env.CODE_MIN_PARTS || "3")
  const maxParts = Number(process.env.CODE_MAX_PARTS || "6")
  const parts = crypto.randomInt(minParts, maxParts + 1)

  let out = ""
  for (let i = 0; i < parts; i += 1) out += pickWord()

  const cleaned = out.replace(/[^a-zA-Z0-9_-]/g, "")
  return cleaned.slice(0, 10) || `kbx${crypto.randomInt(100, 999)}`
}

function isDuplicateError(error: any): boolean {
  return error?.code === "23505"
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let pool = null

  try {
    if (req.method !== "POST") {
      return toJson(res, 405, { ok: false, message: "Method not allowed" })
    }

    const baseUrl = normalizeBaseUrl(process.env.BASE_URL || "")
    if (!baseUrl) {
      return toJson(res, 500, { ok: false, message: "Missing BASE_URL" })
    }

    const body = parseBody(req.body)
    const url = String(body.url || "").trim()
    const requestedCode = String(body.code || "").trim()

    if (!isValidUrl(url)) {
      return toJson(res, 400, { ok: false, message: "Invalid URL" })
    }

    if (requestedCode && !isValidCode(requestedCode)) {
      return toJson(res, 400, { ok: false, message: "Invalid code" })
    }

    pool = makePool()
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
      } catch (error: any) {
        if (isDuplicateError(error)) {
          return toJson(res, 409, { ok: false, message: "Code already in use" })
        }

        return toJson(res, 500, {
          ok: false,
          message: error?.message || "Failed to create short URL"
        })
      }
    }

    let finalCode = ""
    for (let i = 0; i < 12; i += 1) {
      const candidate = generateRandomCode()

      try {
        await pool.query(
          "INSERT INTO short_urls(code, url, created_at, clicks) VALUES ($1, $2, NOW(), 0)",
          [candidate, url]
        )
        finalCode = candidate
        break
      } catch (error: any) {
        if (!isDuplicateError(error)) {
          return toJson(res, 500, {
            ok: false,
            message: error?.message || "Failed to create short URL"
          })
        }
      }
    }

    if (!finalCode) {
      return toJson(res, 500, {
        ok: false,
        message: "Failed to generate unique code"
      })
    }

    const short = `${baseUrl}/${finalCode}`

    return toJson(res, 200, {
      ok: true,
      code: finalCode,
      url,
      shortUrl: short,
      short_url: short
    })
  } catch (error: any) {
    return toJson(res, 500, {
      ok: false,
      message: error?.message || "Server error"
    })
  } finally {
    if (pool) {
      await pool.end().catch(() => {})
    }
  }
}