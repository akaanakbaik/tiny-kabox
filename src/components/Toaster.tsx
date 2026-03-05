import React from "react"
import * as Toast from "@radix-ui/react-toast"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react"
import { useApp } from "../state/useApp"

function Icon({ kind }: { kind: "success" | "error" | "info" | "warning" }) {
  if (kind === "success") return <CheckCircle2 className="h-5 w-5 text-ok" />
  if (kind === "error") return <XCircle className="h-5 w-5 text-danger" />
  if (kind === "warning") return <AlertTriangle className="h-5 w-5 text-warn" />
  return <Info className="h-5 w-5 text-ring" />
}

export default function Toaster() {
  const { toasts, dismissToast } = useApp()
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const next: Record<string, boolean> = {}
    for (const t of toasts) next[t.id] = true
    setOpenMap((prev) => ({ ...prev, ...next }))
  }, [toasts])

  return (
    <Toast.Provider swipeDirection="right">
      <div className="fixed right-3 top-[72px] z-[60] flex w-[min(92vw,420px)] flex-col gap-2 md:right-6 md:top-[84px]">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <Toast.Root
              key={t.id}
              open={openMap[t.id] ?? true}
              onOpenChange={(v) => {
                setOpenMap((p) => ({ ...p, [t.id]: v }))
                if (!v) dismissToast(t.id)
              }}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="card overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="mt-0.5">{<Icon kind={t.kind} />}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{t.title}</div>
                    {t.message ? <div className="mt-0.5 text-xs leading-relaxed text-muted">{t.message}</div> : null}
                  </div>
                  <Toast.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      aria-label="Close notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Toast.Close>
                </div>
                <Toast.Progress className="h-[3px] w-full bg-transparent">
                  <div className="h-full w-full origin-left scale-x-0 bg-ring/70 data-[state=open]:animate-progress" />
                </Toast.Progress>
              </motion.div>
            </Toast.Root>
          ))}
        </AnimatePresence>
      </div>