import React from "react"
import * as Toast from "@radix-ui/react-toast"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react"

export type ToastKind = "success" | "info" | "warning" | "error"

export type ToastItem = {
  id: string
  kind: ToastKind
  title: string
  description?: string
  createdAt: number
  durationMs: number
}

type Ctx = {
  push: (t: Omit<ToastItem, "id" | "createdAt">) => void
}

const ToastCtx = React.createContext<Ctx | null>(null)

export function useToaster(): Ctx {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error("useToaster must be used within ToasterProvider")
  return ctx
}

function iconFor(kind: ToastKind) {
  if (kind === "success") return <CheckCircle2 className="h-5 w-5 text-ok" />
  if (kind === "info") return <Info className="h-5 w-5 text-ring" />
  if (kind === "warning") return <AlertTriangle className="h-5 w-5 text-warn" />
  return <XCircle className="h-5 w-5 text-danger" />
}

function titleColor(kind: ToastKind): string {
  if (kind === "success") return "text-ok"
  if (kind === "info") return "text-foreground"
  if (kind === "warning") return "text-warn"
  return "text-danger"
}

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})

  const push = React.useCallback((t: Omit<ToastItem, "id" | "createdAt">) => {
    const id = uid()
    const it: ToastItem = {
      id,
      kind: t.kind,
      title: t.title,
      description: t.description,
      createdAt: Date.now(),
      durationMs: t.durationMs
    }
    setItems((prev) => [it, ...prev].slice(0, 6))
    setOpenMap((prev) => ({ ...prev, [id]: true }))
  }, [])

  const ctx = React.useMemo<Ctx>(() => ({ push }), [push])

  return (
    <ToastCtx.Provider value={ctx}>
      <Toast.Provider swipeDirection="right" duration={5200}>
        {children}

        <Toast.Viewport className="fixed right-4 top-4 z-[90] w-[min(92vw,420px)] outline-none md:right-6 md:top-6" />

        <div className="pointer-events-none fixed right-4 top-4 z-[91] w-[min(92vw,420px)] space-y-2 md:right-6 md:top-6">
          <AnimatePresence initial={false}>
            {items.map((t) => {
              const isOpen = openMap[t.id] !== false
              return (
                <Toast.Root
                  key={t.id}
                  open={isOpen}
                  onOpenChange={(v) => {
                    setOpenMap((prev) => ({ ...prev, [t.id]: v }))
                    if (!v) {
                      setTimeout(() => {
                        setItems((prev) => prev.filter((x) => x.id !== t.id))
                        setOpenMap((prev) => {
                          const n = { ...prev }
                          delete n[t.id]
                          return n
                        })
                      }, 120)
                    }
                  }}
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.99 }}
                    transition={{ duration: 0.18 }}
                    className="pointer-events-auto overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev">
                        {iconFor(t.kind)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-semibold ${titleColor(t.kind)}`}>{t.title}</div>
                        {t.description ? <div className="mt-1 text-xs leading-relaxed text-muted">{t.description}</div> : null}

                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/60">
                          <div className="h-full w-full origin-left animate-progress bg-ring/60" />
                        </div>
                      </div>

                      <Toast.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                          aria-label="Close"
                          title="Close"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Toast.Close>
                    </div>
                  </motion.div>
                </Toast.Root>
              )
            })}
          </AnimatePresence>
        </div>
      </Toast.Provider>
    </ToastCtx.Provider>
  )
}
