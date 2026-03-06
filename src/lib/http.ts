import { useApp } from "../state/useApp"

export type ApiOk<T> = { ok: true } & T

function tryParseJson(text: string) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function normalizeServerMessage(text: string, data: any): string {
  if (data && typeof data === "object" && typeof data.message === "string" && data.message.trim()) {
    return data.message.trim()
  }

  const raw = text.trim()

  if (!raw) return "Terjadi kesalahan pada server."
  if (raw.startsWith("A server error has occurred")) return "Server sedang bermasalah. Silakan coba lagi sesaat lagi."
  if (raw.includes("FUNCTION_INVOCATION_FAILED")) return "Function backend gagal dijalankan. Silakan coba lagi."
  return raw
}

export function useHttp() {
  const { startLoading, stopLoading, pushToast } = useApp()

  async function request<T>(path: string, init?: RequestInit): Promise<ApiOk<T>> {
    startLoading("Sedang memproses permintaan...")

    try {
      const res = await fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {})
        }
      })

      const text = await res.text()
      const data = tryParseJson(text)

      if (!res.ok) {
        const message = normalizeServerMessage(text, data)

        pushToast({
          kind: "error",
          title: "Permintaan gagal",
          message,
          duration: 5200
        })

        throw new Error(message)
      }

      if (!data || typeof data !== "object") {
        const message = "Respons server tidak valid."
        pushToast({
          kind: "error",
          title: "Format respons salah",
          message,
          duration: 5200
        })
        throw new Error(message)
      }

      return data as ApiOk<T>
    } catch (error: any) {
      if (error instanceof Error) throw error

      const message = "Terjadi gangguan jaringan."
      pushToast({
        kind: "error",
        title: "Koneksi gagal",
        message,
        duration: 5200
      })
      throw new Error(message)
    } finally {
      stopLoading()
    }
  }

  function notifySuccess(title: string, message?: string) {
    pushToast({
      kind: "success",
      title,
      message,
      duration: 3600
    })
  }

  function notifyInfo(title: string, message?: string) {
    pushToast({
      kind: "info",
      title,
      message,
      duration: 3600
    })
  }

  function notifyWarn(title: string, message?: string) {
    pushToast({
      kind: "warning",
      title,
      message,
      duration: 4200
    })
  }

  function notifyError(title: string, message?: string) {
    pushToast({
      kind: "error",
      title,
      message,
      duration: 5200
    })
  }

  return {
    request,
    notifySuccess,
    notifyInfo,
    notifyWarn,
    notifyError
  }
}