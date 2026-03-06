import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Sparkles } from "lucide-react"
import Sidebar from "./Sidebar"
import { useApp } from "../state/useApp"
import { getAppName, getLogoUrl } from "../lib/config"

function HeaderTitle() {
  const location = useLocation()
  const pathname = location.pathname
  const appName = getAppName()
  const logo = getLogoUrl()

  const subtitle =
    pathname === "/"
      ? "short link generator"
      : pathname === "/apidocs"
        ? "developer api reference"
        : pathname === "/terms"
          ? "policy and usage terms"
          : "modern short url platform"

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-white/10 blur-md" />
        <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surfaceElev shadow-soft">
          <img src={logo} alt={appName} className="h-8 w-8 select-none object-contain" draggable={false} />
        </div>
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-semibold tracking-tight text-foreground md:text-base">{appName}</div>
        <div className="truncate text-xs text-muted md:text-sm">{subtitle}</div>
      </div>
    </div>
  )
}

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <HeaderTitle />
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-surfaceElev px-3 py-2 text-xs text-muted md:inline-flex">
            <Sparkles className="h-4 w-4 text-ring" />
            smooth, modern, responsive
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surfaceElev shadow-soft transition-all hover:bg-surfaceElev2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </header>
  )
}