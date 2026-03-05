import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import Sidebar from "./Sidebar"
import { useApp } from "../state/useApp"

function Title() {
  const location = useLocation()
  const isHome = location.pathname === "/"
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/logokaboxnobg.png"
        alt="kabox"
        className="h-9 w-9 select-none"
        draggable={false}
      />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight md:text-base">short url by kabox</span>
        <span className="text-xs text-muted md:text-sm">{isHome ? "Create short links fast" : "Modern short link platform"}</span>
      </div>
    </div>
  )
}

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="group inline-flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
          <Title />
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surfaceElev shadow-soft transition-all active:scale-[0.98] hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </header>
  )
}