import pg from "pg"

const { Pool } = pg

function cleanCa(raw: string): string {
  return raw.replace(/\\n/g, "\n").replace(/\r/g, "").trim()
}

function getHostnameFromUrl(s: string): string | undefined {
  try {
    return new URL(s).hostname
  } catch {
    return undefined
  }
}

export function makePool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL || ""
  const rawCa = process.env.PG_CA_CERT || ""
  const ca = cleanCa(rawCa)

  if (!connectionString) throw new Error("Missing DATABASE_URL")
  if (!ca || !ca.includes("BEGIN CERTIFICATE")) throw new Error("Invalid PG_CA_CERT")

  const servername = getHostnameFromUrl(connectionString)

  return new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: true,
      ca,
      ...(servername ? { servername } : {})
    },
    max: 2
  })
}