import React from "react"

export type ToastKind = "success" | "error" | "info" | "warning"

export type ToastAction = {
  label: string
  onClick?: () => void
  href?: string
}

export type ToastItem = {
  id: string
  kind: ToastKind
  title: string
  message?: string
  duration?: number
  action?: ToastAction
}

type AppContextValue = {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  loading: boolean
  loadingLabel: string
  startLoading: (label?: string) => void
  stopLoading: () => void
  pushToast: (toast: Omit<ToastItem, "id">) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  toasts: ToastItem[]
}

const AppContext = React.createContext<AppContextValue | null>(null)

function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [loadingCount, setLoadingCount] = React.useState(0)
  const [loadingLabel, setLoadingLabel] = React.useState("Memproses permintaan...")
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const startLoading = React.useCallback((label?: string) => {
    if (label && label.trim()) setLoadingLabel(label.trim())
    setLoadingCount((prev) => prev + 1)
  }, [])

  const stopLoading = React.useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1))
  }, [])

  const pushToast = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = createId()
    const item: ToastItem = {
      id,
      duration: toast.duration ?? 4200,
      ...toast
    }

    setToasts((prev) => [item, ...prev].slice(0, 6))

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, item.duration)

    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  const value = React.useMemo<AppContextValue>(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      loading: loadingCount > 0,
      loadingLabel,
      startLoading,
      stopLoading,
      pushToast,
      removeToast,
      clearToasts,
      toasts
    }),
    [sidebarOpen, loadingCount, loadingLabel, startLoading, stopLoading, pushToast, removeToast, clearToasts, toasts]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = React.useContext(AppContext)
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppProvider")
  }
  return ctx
}