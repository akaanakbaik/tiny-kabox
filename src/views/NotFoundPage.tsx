import React from "react"
import { motion } from "framer-motion"
import { Home, AlertCircle } from "lucide-react"
import Seo from "../components/Seo"

export default function NotFoundPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="card p-6">
      <Seo title="Not Found" description="Page not found" path="/404" />
      <div className="flex items-start gap-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surfaceElev">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold">Halaman tidak ditemukan</div>
          <div className="mt-2 text-sm text-muted">Link yang kamu buka tidak tersedia. Silakan kembali ke Home.</div>
          <a href="/" className="btn mt-4 inline-flex px-4 py-2">
            <Home className="h-4 w-4" />
            Back to Home
          </a>
        </div>
      </div>
    </motion.div>
  )
}