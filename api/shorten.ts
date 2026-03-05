import type { VercelRequest, VercelResponse } from "@vercel/node"
import pg from "pg"
import crypto from "crypto"

const { Pool } = pg

type ShortenBody = {
  url?: string
  code?: string
}

const syllables = [
  "ka","box","tin","y","pt","fa","aka","dev","id","my","ur","li","sh","or","tr","zi","ko","bo","xa","ne","mi","no","ra","ri","ta","te","la","lu","pa","pi","sa","si","do","di","ve","vi","xo","xi","yo","ya"
]

function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env ${name}`)
  return v
}

function numEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  const n = raw ? Number(raw) : fallback
  if (!Number.isFinite(n)) return fallback
  return n
}

function getPool(): pg.Pool {
  const ca = env("PG_CA_CERT")
  const url = env("DATABASE_URL")
  return new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: true, ca },
    max: 20
  })
}

async function ensureSchema(pool: pg.Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS short_urls (
      code TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      clicks BIGINT NOT NULL DEFAULT 0
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS short_urls_created_at_idx ON short_urls(created_at DESC)`)
}

function isValidCustomCode(code: string): boolean {
  const minLen = numEnv("CUSTOM_CODE_MIN_LEN", 3)
  const maxLen = numEnv("CUSTOM_CODE_MAX_LEN", 10)
  if (code.length < minLen || code.length > maxLen) return false
  return /^[a-zA-Z0-9_-]+$/.test(code)
}

function pick<T>(arr: T[]): T {
  const i = crypto.randomInt(0, arr.length)
  return arr[i]
}

function generateCode(): string {
  const minParts = numEnv("CODE_MIN_PARTS", 3)
  const maxParts = numEnv("CODE_MAX_PARTS", 6)
  const parts = crypto.randomInt(minParts, maxParts + 1)
  let out = ""
  for (let i = 0; i < parts; i += 1) out += pick(syllables)
  const maxLen = numEnv("CUSTOM_CODE_MAX_LEN", 10)
  if (out.length > maxLen) out = out.slice(0, maxLen)
  if (out.length < 3) out = (out + "kbx").slice(0, 3)
  return out
}

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.send(JSON.stringify(data))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return toJson(res, 405, { ok: false, message: "Method not allowed" })
  }

  let body: ShortenBody = {}
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as ShortenBody)
  } catch {
    return toJson(res, 400, { ok: false, message: "Invalid JSON body" })
  }

  const rawUrl = (body.url || "").trim()
  if (!rawUrl) return toJson(res, 400, { ok: false, message: "URL is required" })

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return toJson(res, 400, { ok: false, message: "URL is not valid" })
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return toJson(res, 400, { ok: false, message: "Only http and https are allowed" })
  }

  const baseUrl = env("BASE_URL").replace(/\/+$/, "")
  const pool = getPool()

  try {
    await ensureSchema(pool)

    const requested = (body.code || "").trim()
    let code = ""

    if (requested) {
      code = requested
      if (!isValidCustomCode(code)) {
        return toJson(res, 400, { ok: false, message: "Custom code must be 3-10 chars, only letters numbers _ -" })
      }

      try {
        await pool.query(`INSERT INTO short_urls(code,url) VALUES($1,$2)`, [code, parsed.toString()])
      } catch (e: any) {
        const msg = String(e?.message || "")
        const isDup = msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")
        if (isDup) return toJson(res, 409, { ok: false, message: "Custom code already used" })
        return toJson(res, 500, { ok: false, message: "DB error" })
      }
    } else {
      let tries = 0
      while (tries < 14) {
        const candidate = generateCode()
        try {
          await pool.query(`INSERT INTO short_urls(code,url) VALUES($1,$2)`, [candidate, parsed.toString()])
          code = candidate
          break
        } catch (e: any) {
          const msg = String(e?.message || "")
          const isDup = msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")
          if (!isDup) return toJson(res, 500, { ok: false, message: "DB error" })
        }
        tries += 1
      }
      if (!code) return toJson(res, 500, { ok: false, message: "Failed to generate unique code" })
    }

    return toJson(res, 200, {
      ok: true,
      code,
      short_url: `${baseUrl}/${code}`,
      url: parsed.toString()
    })
  } catch (e: any) {
    return toJson(res, 500, { ok: false, message: e?.message || "Server error" })
  } finally {
    await pool.end().catch(() => {})
  }
}