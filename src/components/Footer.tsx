import React from "react"
import { Github, Heart, Send } from "lucide-react"
import { getTelegramUrl } from "../lib/config"

export default function Footer() {
  const telegram = getTelegramUrl()

  return (
    <footer className="relative z-10 border-t border-border/70 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>created by</span>
          <a
            href="https://akadev.me"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-border bg-surfaceElev px-2 py-1 font-semibold text-foreground transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            title="aka"
          >
            <span className="text-danger">aka</span>
          </a>
          <span>di buat dgn</span>
          <span className="inline-flex items-center gap-1 text-foreground">
            <Heart className="h-3.5 w-3.5 fill-current text-danger" />
            kode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={telegram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surfaceElev text-foreground transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Telegram @akamodebaik"
            title="Telegram @akamodebaik"
          >
            <Send className="h-4 w-4" />
          </a>

          <a
            href="https://github.com/akaanakbaik"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surfaceElev text-foreground transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
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