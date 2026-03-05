export function isValidUrl(input: string): boolean {
  try {
    const u = new URL(input)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function normalizeCode(code: string): string {
  return code.trim()
}

export function isValidCustomCode(code: string): boolean {
  if (code.length < 3 || code.length > 10) return false
  return /^[a-zA-Z0-9_-]+$/.test(code)
}