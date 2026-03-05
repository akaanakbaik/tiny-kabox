import React from "react"

type ToastKind = "success" | "error" | "info" | "warning"

export type ToastItem = {
  id: string
  kind: ToastKind
  title: string
  message?: string
  createdAt: number
}

type AppState = {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  loading: boolean
  setLoading: (v: boolean) => void
  toasts: ToastItem[]
  pushToast: (t: Omit<ToastItem, "id" | "createdAt">) => void
  dismissToast: (id: string) => void
}

const AppContext = React.createContext<AppState | null>(null)

function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = React.useCallback((t: Omit<ToastItem, "id" | "createdAt">) => {
    const id = uid()
    const createdAt = Date.now()
    const item: ToastItem = { ...t, id, createdAt }
    setToasts((prev) => [item, ...prev].slice(0, 6))
    window.setTimeout(() => dismissToast(id), 5200)
  }, [dismissToast])

  const value: AppState = {
    sidebarOpen,
    setSidebarOpen,
    loading,
    setLoading,
    toasts,
    pushToast,
    dismissToast
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = React.useContext(AppContext)
  if (!ctx) throw new Error("AppProvider is missing")
  return ctx
}