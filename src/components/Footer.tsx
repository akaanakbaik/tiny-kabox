import React from "react"
import { Github, Send } from "lucide-react"
import { getTelegramUrl } from "../lib/config"

export default function Footer() {
  const telegram = getTelegramUrl()

  return (
    <footer className="border-t border-border/70 bg-surface/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 text-xs text-muted md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span>created by</span>
          <a
            href="https://akadev.me"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surfaceElev px-2 py-1 font-semibold text-foreground transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="aka"
            title="aka"
          >
            <span className="text-danger">aka</span>
          </a>
          <span>di buat dgn</span>
          <span aria-hidden="true">❤️</span>
          <span>dan kode</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={telegram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Telegram @akamodebaik"
            title="Telegram @akamodebaik"
          >
            <Send className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/akaanakbaik"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="GitHub @akaanakbaik"
            title="GitHub @akaanakbaik"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}