import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Info, OctagonX, X } from "lucide-react"
import { useApp } from "../state/useApp"

function ToastIcon({ kind }: { kind: "success" | "error" | "info" | "warning" }) {
  if (kind === "success") return <CheckCircle2 className="h-5 w-5 text-ok" />
  if (kind === "warning") return <AlertTriangle className="h-5 w-5 text-warn" />
  if (kind === "error") return <OctagonX className="h-5 w-5 text-danger" />
  return <Info className="h-5 w-5 text-ring" />
}

function ToastBar({ kind }: { kind: "success" | "error" | "info" | "warning" }) {
  const color =
    kind === "success"
      ? "bg-ok/80"
      : kind === "warning"
        ? "bg-warn/80"
        : kind === "error"
          ? "bg-danger/80"
          : "bg-ring/80"

  return (
    <div className="h-1 w-full overflow-hidden bg-border/50">
      <div className={`h-full w-full origin-left animate-progress ${color}`} />
    </div>
  )
}

export default function Toaster() {
  const { toasts, removeToast } = useApp()

  return (
    <div className="pointer-events-none fixed right-3 top-20 z-[80] flex w-[min(94vw,420px)] flex-col gap-3 md:right-6 md:top-24">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const ActionTag = toast.action?.href ? "a" : "button"

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surfaceElev">
                  <ToastIcon kind={toast.kind} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">{toast.title}</div>
                  {toast.message ? <div className="mt-1 text-xs leading-relaxed text-muted">{toast.message}</div> : null}

                  {toast.action ? (
                    <div className="mt-3">
                      <ActionTag
                        {...(toast.action.href
                          ? {
                              href: toast.action.href,
                              target: "_blank",
                              rel: "noreferrer"
                            }
                          : {
                              type: "button",
                              onClick: toast.action.onClick
                            })}
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-surfaceElev px-3 py-2 text-xs font-semibold text-foreground transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      >
                        {toast.action.label}
                      </ActionTag>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ToastBar kind={toast.kind} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}