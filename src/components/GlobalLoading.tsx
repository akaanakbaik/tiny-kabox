import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useApp } from "../state/useApp"

export default function GlobalLoading() {
  const { loading, loadingLabel } = useApp()

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="w-[min(92vw,480px)] overflow-hidden rounded-[30px] border border-border bg-surface shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14">
                  <div className="absolute inset-0 rounded-full border border-border bg-surfaceElev" />
                  <div className="absolute inset-[6px] rounded-full border-2 border-transparent border-t-ring animate-spin" />
                  <div className="absolute inset-[12px] rounded-full border border-border/80 bg-surfaceElev2" />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">Sedang memproses</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted">{loadingLabel}</div>
                </div>
              </div>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                <motion.div
                  className="h-full rounded-full bg-ring/90"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "35%" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}