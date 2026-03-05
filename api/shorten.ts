import type { VercelRequest, VercelResponse } from "@vercel/node"
import pg from "pg"

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

function getPool(): pg.Pool {
  const ca = env("PG_CA_CERT")
  const url = env("DATABASE_URL")
  return new Pool({
    connectionString: url,
    ssl: {
      rejectUnauthorized: true,
      ca
    },
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

function normalizeCode(input: string): string {
  return input.trim()
}

function isValidCustomCode(code: string): boolean {
  const minLen = Number(process.env.CUSTOM_CODE_MIN_LEN || "3")
  const maxLen = Number(process.env.CUSTOM_CODE_MAX_LEN || "10")
  if (code.length < minLen || code.length > maxLen) return false
  return /^[a-zA-Z0-9_-]+$/.test(code)
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateCode(): string {
  const minParts = Number(process.env.CODE_MIN_PARTS || "3")
  const maxParts = Number(process.env.CODE_MAX_PARTS || "6")
  const parts = Math.max(minParts, Math.min(maxParts, minParts + Math.floor(Math.random() * (maxParts - minParts + 1))))
  let out = ""
  for (let i = 0; i < parts; i += 1) out += pick(syllables)
  const maxLen = Number(process.env.CUSTOM_CODE_MAX_LEN || "10")
  if (out.length > maxLen) out = out.slice(0, maxLen)
  if (out.length < 3) out = (out + "kbx").slice(0, 3)
  return out
}

function toJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status)
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.send(JSON.stringify(data))
}

function badRequest(res: VercelResponse, message: string): void {
  toJson(res, 400, { ok: false, message })
}

function conflict(res: VercelResponse, message: string): void {
  toJson(res, 409, { ok: false, message })
}

function serverError(res: VercelResponse, message: string): void {
  toJson(res, 500, { ok: false, message })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return badRequest(res, "Method not allowed")
  }

  let body: ShortenBody = {}
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as ShortenBody)
  } catch {
    return badRequest(res, "Invalid JSON body")
  }

  const rawUrl = (body.url || "").trim()
  if (!rawUrl) return badRequest(res, "URL is required")

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    return badRequest(res, "URL is not valid")
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return badRequest(res, "Only http and https are allowed")
  }

  const baseUrl = env("BASE_URL").replace(/\/+$/, "")
  const pool = getPool()

  try {
    await ensureSchema(pool)

    const requested = (body.code || "").trim()
    let code = ""

    if (requested) {
      code = normalizeCode(requested)
      if (!isValidCustomCode(code)) return badRequest(res, "Custom code must be 3-10 chars, only letters numbers _ -")
      const exists = await pool.query(`SELECT code FROM short_urls WHERE code=$1`, [code])
      if (exists.rowCount && exists.rowCount > 0) return conflict(res, "Custom code already used")
      await pool.query(`INSERT INTO short_urls(code,url) VALUES($1,$2)`, [code, parsed.toString()])
    } else {
      let tries = 0
      while (tries < 12) {
        const candidate = generateCode()
        const exists = await pool.query(`SELECT code FROM short_urls WHERE code=$1`, [candidate])
        if (!exists.rowCount || exists.rowCount === 0) {
          code = candidate
          await pool.query(`INSERT INTO short_urls(code,url) VALUES($1,$2)`, [code, parsed.toString()])
          break
        }
        tries += 1
      }
      if (!code) return serverError(res, "Failed to generate unique code")
    }

    return toJson(res, 200, {
      ok: true,
      code,
      short_url: `${baseUrl}/${code}`,
      url: parsed.toString()
    })
  } catch (e: any) {
    return serverError(res, e?.message || "Server error")
  } finally {
    await pool.end().catch(() => {})
  }
}