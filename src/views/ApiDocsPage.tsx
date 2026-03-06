import React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, CheckCircle2, Copy, Link2, TerminalSquare } from "lucide-react"
import Seo from "../components/Seo"
import Button from "../components/ui/Button"
import { copyText } from "../lib/clipboard"
import { getPublicBaseUrl } from "../lib/config"
import { useHttp } from "../lib/http"

function CodeBlock({ label, code }: { label: string; code: string }) {
  const { notifySuccess, notifyWarn } = useHttp()

  async function handleCopy() {
    const ok = await copyText(code)
    if (ok) notifySuccess("Snippet disalin", "Contoh request berhasil disalin ke clipboard.")
    else notifyWarn("Gagal menyalin", "Browser menolak akses clipboard.")
  }

  return (
    <div className="rounded-[24px] border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surfaceElev px-3 py-2 text-xs text-muted">
          <TerminalSquare className="h-4 w-4 text-ring" />
          {label}
        </div>

        <Button type="button" size="xs" onClick={handleCopy} leftIcon={<Copy className="h-4 w-4" />}>
          Copy
        </Button>
      </div>

      <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surfaceElev p-4 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ApiCard(props: {
  title: string
  path: string
  description: string
  codeLabel: string
  code: string
  response?: string
}) {
  return (
    <div className="rounded-[28px] border border-border bg-surfaceElev p-5 shadow-soft">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BookOpen className="h-4 w-4 text-ring" />
        {props.title}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-surface px-3 py-2 text-xs text-muted">
        Path: <span className="font-semibold text-foreground">{props.path}</span>
      </div>

      <div className="mt-3 text-sm leading-relaxed text-muted">{props.description}</div>

      <div className="mt-4">
        <CodeBlock label={props.codeLabel} code={props.code} />
      </div>

      {props.response ? (
        <div className="mt-4">
          <CodeBlock label="Contoh output" code={props.response} />
        </div>
      ) : null}
    </div>
  )
}

export default function ApiDocsPage() {
  const base = getPublicBaseUrl()

  const shortenCurl = `curl -X POST ${base}/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/very/long/path","code":"ptfaka"}'`

  const shortenRandomCurl = `curl -X POST ${base}/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/very/long/path"}'`

  const shortenResponse = `{
  "ok": true,
  "code": "ptfaka",
  "url": "https://example.com/very/long/path",
  "shortUrl": "${base}/ptfaka",
  "short_url": "${base}/ptfaka"
}`

  const healthCurl = `curl -X GET ${base}/api/health`

  const urlDetailCurl = `curl -X GET ${base}/api/url/ptfaka`

  return (
    <div className="space-y-6">
      <Seo title="API Docs" description="Dokumentasi endpoint short url by kabox" path="/apidocs" />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="rounded-[30px] border border-border bg-surfaceElev p-5 shadow-2xl md:p-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs text-muted">
              <Link2 className="h-4 w-4 text-ring" />
              developer api reference
            </div>

            <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">API Documentation</div>
            <div className="mt-3 text-sm leading-relaxed text-muted">
              Seluruh endpoint inti untuk membuat short URL, memeriksa status backend, mengambil detail code, dan melakukan redirect.
              Dokumentasi ini didesain supaya enak dibaca, mudah dicoba, dan konsisten dengan UI utama.
            </div>
          </div>

          <Button
            type="button"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.location.assign("/")}
          >
            Kembali ke Home
          </Button>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.04 }}>
          <ApiCard
            title="POST /api/shorten"
            path={`${base}/api/shorten`}
            description="Membuat short URL baru menggunakan URL target dan optional custom code. Jika custom code tidak diisi, sistem akan membuat code otomatis."
            codeLabel="Contoh cURL"
            code={shortenCurl}
            response={shortenResponse}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.08 }}>
          <ApiCard
            title="POST /api/shorten (random)"
            path={`${base}/api/shorten`}
            description="Versi random generator. Cocok jika kamu hanya ingin membuat short URL secepat mungkin tanpa menentukan custom code."
            codeLabel="Contoh cURL"
            code={shortenRandomCurl}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.12 }}>
          <ApiCard
            title="GET /api/health"
            path={`${base}/api/health`}
            description="Mengecek apakah backend dan koneksi database berjalan dengan baik."
            codeLabel="Contoh cURL"
            code={healthCurl}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.16 }}>
          <ApiCard
            title="GET /api/url/:code"
            path={`${base}/api/url/ptfaka`}
            description="Mengambil detail link yang tersimpan berdasarkan short code tertentu."
            codeLabel="Contoh cURL"
            code={urlDetailCurl}
          />
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div className="rounded-[26px] border border-border bg-surfaceElev p-5 shadow-soft">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface">
            <CheckCircle2 className="h-5 w-5 text-ok" />
          </div>
          <div className="mt-3 text-sm font-semibold text-foreground">Format response konsisten</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">Backend mengembalikan format JSON yang rapi, mudah dipakai, dan ramah integrasi.</div>
        </div>

        <div className="rounded-[26px] border border-border bg-surfaceElev p-5 shadow-soft">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface">
            <TerminalSquare className="h-5 w-5 text-ring" />
          </div>
          <div className="mt-3 text-sm font-semibold text-foreground">Siap untuk developer</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">Contoh request dibuat jelas, bisa langsung dipakai untuk testing dengan curl atau client lain.</div>
        </div>

        <div className="rounded-[26px] border border-border bg-surfaceElev p-5 shadow-soft">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface">
            <Link2 className="h-5 w-5 text-warn" />
          </div>
          <div className="mt-3 text-sm font-semibold text-foreground">Redirect sederhana</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">Akses langsung ke `/:code` untuk redirect ke URL tujuan dengan alur yang cepat dan ringkas.</div>
        </div>
      </motion.section>
    </div>
  )
}