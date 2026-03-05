import { useApp } from "../state/useApp"

export type ApiOk<T> = { ok: true } & T
export type ApiErr = { ok: false; message: string }

export function useHttp() {
  const { setLoading, pushToast } = useApp()

  async function request<T>(path: string, init?: RequestInit): Promise<ApiOk<T>> {
    const started = performance.now()
    setLoading(true)
    try {
      const res = await fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {})
        }
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : null

      if (!res.ok) {
        const message = data?.message || "Request failed"
        pushToast({ kind: "error", title: "Request error", message })
        throw new Error(message)
      }

      return data as ApiOk<T>
    } finally {
      const elapsed = performance.now() - started
      const min = 380
      if (elapsed < min) await new Promise((r) => window.setTimeout(r, Math.ceil(min - elapsed)))
      setLoading(false)
    }
  }

  function notifySuccess(title: string, message?: string) {
    pushToast({ kind: "success", title, message })
  }

  function notifyInfo(title: string, message?: string) {
    pushToast({ kind: "info", title, message })
  }

  function notifyWarn(title: string, message?: string) {
    pushToast({ kind: "warning", title, message })
  }

  return { request, notifySuccess, notifyInfo, notifyWarn }
}