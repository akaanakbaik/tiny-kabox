import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Copy, ExternalLink, Link2, Wand2 } from "lucide-react"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Seo from "../components/Seo"
import { useHttp } from "../lib/http"
import { copyText } from "../lib/clipboard"
import { isValidCustomCode, isValidUrl, normalizeCode } from "../lib/validators"
import { getPublicBaseUrl } from "../lib/config"

type ShortenResponse = {
  code: string
  short_url?: string
  shortUrl?: string
  url: string
}

function makeShortUrl(base: string, code: string): string {
  const b = base.replace(/\/+$/, "")
  return `${b}/${code}`
}

export default function HomePage() {
  const { request, notifySuccess, notifyInfo, notifyWarn } = useHttp()
  const [url, setUrl] = React.useState("")
  const [custom, setCustom] = React.useState("")
  const [result, setResult] = React.useState<{ code: string; short_url: string; url: string } | null>(null)

  const base = getPublicBaseUrl()
  const trimmedUrl = url.trim()
  const trimmedCode = normalizeCode(custom)
  const canSubmit = isValidUrl(trimmedUrl) && (trimmedCode.length === 0 || isValidCustomCode(trimmedCode))

  async function onShorten() {
    if (!isValidUrl(trimmedUrl)) {
      notifyWarn("URL tidak valid", "Masukkan URL dengan format http atau https.")
      return
    }

    if (trimmedCode && !isValidCustomCode(trimmedCode)) {
      notifyWarn("Custom code tidak valid", "Gunakan 3-10 karakter, huruf/angka/_/-")
      return
    }

    const payload: Record<string, string> = { url: trimmedUrl }
    if (trimmedCode) payload.code = trimmedCode

    const data = await request<ShortenResponse>("/api/shorten", {
      method: "POST",
      body: JSON.stringify(payload)
    })

    const short = data.short_url || data.shortUrl || makeShortUrl(base, data.code)
    const forced = { code: data.code, short_url: short, url: data.url }
    setResult(forced)
    notifySuccess("Berhasil dibuat", forced.short_url)
  }

  async function onCopy() {
    if (!result?.short_url) return
    const ok = await copyText(result.short_url)
    if (ok) notifyInfo("Copied", "Short URL sudah disalin ke clipboard.")
    else notifyWarn("Gagal copy", "Browser membatasi akses clipboard.")
  }

  return (
    <div className="space-y-6">
      <Seo title="Home" description="Create short links fast" path="/" />

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="card overflow-hidden"
      >
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">
              <Wand2 className="h-4 w-4" />
              fast, clean, modern
            </span>
            <span className="chip">
              <Link2 className="h-4 w-4" />
              {base.replace(/^https?:\/\//, "")}
            </span>
          </div>

          <div className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">Buat short link yang rapi, singkat, dan cepat</div>
          <div className="mt-2 text-sm leading-relaxed text-muted">
            Masukkan URL panjang, pilih custom code (opsional), lalu sistem menghasilkan short URL. Semua interaksi memakai notifikasi dan loading modern.
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="URL Asli"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/sangat/panjang"
              inputMode="url"
              hint="Wajib http atau https."
              error={url.length > 0 && !isValidUrl(trimmedUrl) ? "Format URL tidak valid" : undefined}
            />
            <Input
              label="Custom code (opsional)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="ptfaka"
              inputMode="text"
              hint="3-10 karakter, huruf/angka/_/-"
              error={custom.length > 0 && !isValidCustomCode(trimmedCode) ? "Code harus 3-10 karakter dan valid" : undefined}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              onClick={onShorten}
              disabled={!canSubmit}
              leftIcon={<Wand2 className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Shorten
            </Button>

            <Button
              type="button"
              onClick={() => {
                notifyInfo("API Docs", "Buka halaman API Docs untuk melihat endpoint dan contoh cURL.")
                window.location.assign("/apidocs")
              }}
              leftIcon={<Link2 className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              API Docs
            </Button>
          </div>
        </div>

        <div className="h-px w-full bg-border/70" />

        <div className="p-5 md:p-6">
          <div className="text-sm font-semibold">Hasil</div>
          <div className="mt-2 text-xs text-muted">Short URL muncul di sini, lengkap dengan tombol copy dan open.</div>

          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-4 rounded-2xl border border-border/70 bg-surfaceElev p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-muted">Short URL</div>
                  <div className="mt-1 truncate text-sm font-semibold">{result.short_url}</div>
                  <div className="mt-2 text-xs text-muted">Target: {result.url}</div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={onCopy} leftIcon={<Copy className="h-4 w-4" />}>
                    Copy
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    leftIcon={<ExternalLink className="h-4 w-4" />}
                    onClick={() => notifyInfo("Opening", "Membuka short URL di tab baru.")}
                  >
                    <a href={result.short_url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4 rounded-2xl border border-border/70 bg-surfaceElev p-4 text-sm text-muted">
              Belum ada hasil. Masukkan URL lalu tekan Shorten.
            </div>
          )}

          <div className="mt-5 text-xs text-muted">
            Butuh detail kebijakan penggunaan? Buka{" "}
            <Link to="/terms" className="font-semibold text-foreground underline decoration-border underline-offset-4">
              Syarat & Ketentuan
            </Link>
            .
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.06 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <div className="card p-5">
          <div className="text-sm font-semibold">Custom code</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">
            Kamu bisa request custom code seperti <span className="font-semibold text-foreground">ptfaka</span>. Jika kosong, sistem memilih kode otomatis.
          </div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">Full feedback</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">
            Semua proses menggunakan notifikasi, loading overlay, dan animasi halus. Tidak ada alert bawaan browser.
          </div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">Mobile ready</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">
            Layout responsif, sidebar nyaman di mobile, dan kontrol mudah dipakai di desktop.
          </div>
        </div>
      </motion.section>
    </div>
  )
}