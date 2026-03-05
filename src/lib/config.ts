export function getPublicBaseUrl(): string {
  const v = (import.meta as any).env?.VITE_PUBLIC_BASE_URL as string | undefined
  const base = (v && v.trim().length > 0 ? v : window.location.origin).replace(/\/+$/, "")
  return base
}

export function getAppName(): string {
  const v = (import.meta as any).env?.VITE_APP_NAME as string | undefined
  return (v && v.trim().length > 0 ? v : "short url by kabox").trim()
}

export function getLogoUrl(): string {
  const v = (import.meta as any).env?.VITE_LOGO_URL as string | undefined
  return (v && v.trim().length > 0 ? v : "https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/logokaboxnobg.png").trim()
}

export function getTelegramUrl(): string {
  const v = (import.meta as any).env?.VITE_TELEGRAM_URL as string | undefined
  return (v && v.trim().length > 0 ? v : "https://t.me/").trim()
}