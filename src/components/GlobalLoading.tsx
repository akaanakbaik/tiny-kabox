import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useApp } from "../state/useApp"

export default function GlobalLoading() {
  const { loading } = useApp()

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/55 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="card w-[min(92vw,520px)] p-5"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full border border-border bg-surfaceElev" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-ring/80" />
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-semibold">Processing</div>
                <div className="text-xs text-muted">Please wait a moment</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}