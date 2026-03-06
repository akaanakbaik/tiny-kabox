import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, FileText, Home, Link2, X } from "lucide-react"
import { NavLink } from "react-router-dom"
import { getAppName, getLogoUrl } from "../lib/config"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

function Item(props: {
  to: string
  title: string
  description: string
  icon: React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={props.to}
      onClick={props.onNavigate}
      className={({ isActive }) =>
        [
          "group flex items-start gap-3 rounded-2xl border px-4 py-3 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          isActive ? "border-border bg-surfaceElev2" : "border-border/70 bg-surfaceElev hover:bg-surfaceElev2"
        ].join(" ")
      }
    >
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface">
        {props.icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{props.title}</div>
        <div className="mt-1 text-xs leading-relaxed text-muted">{props.description}</div>
      </div>
    </NavLink>
  )
}

export default function Sidebar({ open, onOpenChange }: Props) {
  const close = () => onOpenChange(false)
  const appName = getAppName()
  const logo = getLogoUrl()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                initial={{ x: 420, opacity: 0.92 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 420, opacity: 0.92 }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="fixed right-0 top-0 z-[70] flex h-dvh w-[88vw] max-w-md flex-col border-l border-border bg-surface shadow-2xl outline-none md:w-[420px]"
              >
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surfaceElev">
                      <img src={logo} alt={appName} className="h-8 w-8 object-contain" draggable={false} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{appName}</div>
                      <div className="text-xs text-muted">navigation panel</div>
                    </div>
                  </div>

                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surfaceElev transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      aria-label="Close sidebar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-3">
                    <Item
                      to="/"
                      onNavigate={close}
                      title="Home"
                      description="Buat short link, copy hasil, dan buka link secara instan."
                      icon={<Home className="h-5 w-5" />}
                    />
                    <Item
                      to="/apidocs"
                      onNavigate={close}
                      title="API Docs"
                      description="Lihat endpoint, struktur request, response, dan contoh penggunaan."
                      icon={<BookOpen className="h-5 w-5" />}
                    />
                    <Item
                      to="/terms"
                      onNavigate={close}
                      title="Syarat & Ketentuan"
                      description="Baca aturan penggunaan, privasi, dan batasan layanan."
                      icon={<FileText className="h-5 w-5" />}
                    />
                  </div>

                  <div className="mt-5 rounded-3xl border border-border bg-surfaceElev p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Link2 className="h-4 w-4 text-ring" />
                      Quick notes
                    </div>
                    <div className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
                      <p>Custom code: 3–10 karakter, huruf, angka, underscore, dan dash.</p>
                      <p>Jika tidak mengisi custom code, sistem akan membuat kode otomatis.</p>
                      <p>Semua aksi penting menampilkan loading dan notifikasi dari UI web.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/70 px-4 py-4">
                  <a
                    href="https://akadev.me"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-surfaceElev px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    Visit akadev.me
                  </a>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}