import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { NavLink } from "react-router-dom"
import { X, Home, BookOpen, FileText } from "lucide-react"
import { getAppName, getLogoUrl } from "../lib/config"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

function NavItem(props: { to: string; icon: React.ReactNode; title: string; desc: string; onClick?: () => void }) {
  return (
    <NavLink
      to={props.to}
      onClick={props.onClick}
      className={({ isActive }) =>
        [
          "group flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          isActive ? "border-border bg-surfaceElev2" : "border-border/70 bg-surfaceElev hover:bg-surfaceElev2"
        ].join(" ")
      }
    >
      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface">
        {props.icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-semibold">{props.title}</div>
        <div className="text-xs text-muted">{props.desc}</div>
      </div>
    </NavLink>
  )
}

export default function Sidebar({ open, onOpenChange }: Props) {
  const close = () => onOpenChange(false)
  const app = getAppName()
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
                className="fixed inset-0 z-50 bg-black/55"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                initial={{ x: 420, opacity: 0.9 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 420, opacity: 0.9 }}
                transition={{ type: "spring", stiffness: 420, damping: 38 }}
                className="fixed right-0 top-0 z-50 h-dvh w-[86vw] max-w-md border-l border-border bg-surface shadow-2xl outline-none md:w-[420px]"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={logo} alt="kabox" className="h-9 w-9 select-none" draggable={false} />
                      <div className="flex flex-col leading-tight">
                        <div className="text-sm font-semibold">{app}</div>
                        <div className="text-xs text-muted">Menu</div>
                      </div>
                    </div>

                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surfaceElev shadow-soft transition-all active:scale-[0.98] hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex-1 overflow-auto px-4 py-4">
                    <div className="space-y-3">
                      <NavItem to="/" onClick={close} icon={<Home className="h-5 w-5" />} title="Home" desc="Create and use short links" />
                      <NavItem to="/apidocs" onClick={close} icon={<BookOpen className="h-5 w-5" />} title="API Docs" desc="Endpoints, cURL, responses" />
                      <NavItem to="/terms" onClick={close} icon={<FileText className="h-5 w-5" />} title="Syarat & Ketentuan" desc="Terms, usage policy, privacy" />
                    </div>

                    <div className="mt-6 rounded-2xl border border-border/70 bg-surfaceElev px-4 py-4">
                      <div className="text-sm font-semibold">Tips</div>
                      <div className="mt-1 text-xs leading-relaxed text-muted">
                        Custom code boleh 3-10 karakter dan hanya huruf, angka, underscore, atau dash. Jika kosong, sistem akan buat kode singkat otomatis.
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/70 px-4 py-4">
                    <a
                      href="https://akadev.me"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-surfaceElev px-4 py-3 text-sm font-semibold transition-all active:scale-[0.99] hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      Visit akadev.me
                    </a>
                  </div>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}