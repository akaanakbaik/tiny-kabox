import React from "react"
import { motion } from "framer-motion"
import { Copy, TerminalSquare, Link2, ArrowLeft } from "lucide-react"
import { copyText } from "../lib/clipboard"
import { useHttp } from "../lib/http"
import Seo from "../components/Seo"
import { getPublicBaseUrl } from "../lib/config"

function CodeBlock({ code }: { code: string }) {
  const { notifyInfo, notifyWarn } = useHttp()

  async function onCopy() {
    const ok = await copyText(code)
    if (ok) notifyInfo("Copied", "Snippet sudah disalin.")
    else notifyWarn("Gagal copy", "Browser membatasi akses clipboard.")
  }

  return (
    <div className="mt-3 rounded-2xl border border-border/70 bg-surfaceElev p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="chip">
          <TerminalSquare className="h-4 w-4" />
          cURL
        </div>
        <button type="button" onClick={onCopy} className="btn px-3 py-2">
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </div>
      <pre className="mt-3 overflow-auto rounded-xl border border-border/70 bg-surface px-3 py-3 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-xs leading-relaxed text-muted">{children}</div>
    </div>
  )
}

export default function ApiDocsPage() {
  const base = getPublicBaseUrl()

  const curl1 = `curl -X POST ${base}/api/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com/very/long/path","code":"ptfaka"}'`
  const curl2 = `curl -X POST ${base}/api/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com/very/long/path"}'`

  const output1 = `{
  "ok": true,
  "code": "ptfaka",
  "short_url": "${base}/ptfaka",
  "url": "https://example.com/very/long/path"
}`

  return (
    <div className="space-y-6">
      <Seo title="API Docs" description="Endpoints, cURL, and responses" path="/apidocs" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="card p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="chip">
              <Link2 className="h-4 w-4" />
              API Documentation
            </div>
            <div className="text-xl font-semibold tracking-tight md:text-2xl">API Docs</div>
            <div className="text-sm text-muted">
              Endpoint untuk membuat short URL dan redirect. Semua respons JSON memiliki field <span className="font-semibold text-foreground">ok</span>.
            </div>
          </div>

          <a href="/" className="btn px-4 py-2" aria-label="Back to home">
            <ArrowLeft className="h-4 w-4" />
            Home
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="POST /api/shorten">
          Buat short URL baru. Body JSON wajib berisi <span className="font-semibold text-foreground">url</span>. Field{" "}
          <span className="font-semibold text-foreground">code</span> opsional (3-10 karakter, huruf/angka/_/-).
          <div className="mt-3 text-xs text-foreground">
            Path: <span className="font-semibold">{base}/api/shorten</span>
          </div>
          <CodeBlock code={curl1} />
          <div className="mt-3 rounded-2xl border border-border/70 bg-surfaceElev p-3">
            <div className="text-xs font-semibold text-foreground">Contoh output</div>
            <pre className="mt-2 overflow-auto rounded-xl border border-border/70 bg-surface px-3 py-3 text-xs leading-relaxed text-foreground">
              <code>{output1}</code>
            </pre>
          </div>
        </Card>

        <Card title="POST /api/shorten (random code)">
          Jika <span className="font-semibold text-foreground">code</span> tidak diberikan, sistem akan membuat kode otomatis yang singkat.
          <div className="mt-3 text-xs text-foreground">
            Path: <span className="font-semibold">{base}/api/shorten</span>
          </div>
          <CodeBlock code={curl2} />
          <div className="mt-3 rounded-2xl border border-border/70 bg-surfaceElev p-3">
            <div className="text-xs font-semibold text-foreground">Penjelasan</div>
            <div className="mt-2 text-xs leading-relaxed text-muted">
              Kode otomatis dihasilkan dari beberapa potongan pendek agar tetap mudah dibaca. Sistem akan mencoba beberapa kali hingga menemukan kode unik.
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="GET /:code">
          Redirect ke URL asli. Contoh: buka{" "}
          <span className="font-semibold text-foreground">{base}/ptfaka</span> untuk diarahkan otomatis.
        </Card>
        <Card title="Validasi code">
          Custom code minimal 3 dan maksimal 10. Karakter yang diizinkan: huruf, angka, underscore, dash.
        </Card>
        <Card title="Click tracking">
          Setiap redirect akan menambah <span className="font-semibold text-foreground">clicks</span> di database.
        </Card>
      </div>
    </div>
  )
}