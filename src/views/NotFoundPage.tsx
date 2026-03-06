import React from "react"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Compass } from "lucide-react"
import Seo from "../components/Seo"
import Button from "../components/ui/Button"

export default function NotFoundPage() {
  return (
    <div className="space-y-6">
      <Seo title="Page Not Found" description="Halaman yang kamu cari tidak ditemukan." path="/404" />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="mx-auto max-w-3xl rounded-[32px] border border-border bg-surfaceElev p-6 text-center shadow-2xl md:p-8"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] border border-border bg-surface shadow-soft">
          <AlertCircle className="h-8 w-8 text-warn" />
        </div>

        <div className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Halaman tidak ditemukan</div>
        <div className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Link yang kamu buka tidak tersedia, sudah berubah, atau short code yang diminta belum ada di sistem.
          Silakan kembali ke halaman utama untuk membuat short URL baru atau menavigasi ulang ke halaman yang tersedia.
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.location.assign("/")}
          >
            Kembali ke Home
          </Button>

          <Button
            type="button"
            variant="secondary"
            leftIcon={<Compass className="h-4 w-4" />}
            onClick={() => window.location.assign("/apidocs")}
          >
            Buka API Docs
          </Button>
        </div>
      </motion.section>
    </div>
  )
}