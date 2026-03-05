import React from "react"
import { motion } from "framer-motion"
import { Link2, Wand2, Copy, ExternalLink } from "lucide-react"
import { useHttp } from "../lib/http"
import { copyText } from "../lib/clipboard"
import { isValidCustomCode, isValidUrl, normalizeCode } from "../lib/validators"

type ShortenResponse = {
  code: string
  short_url: string
  url: string
}

function GlowDivider() {
  return <div className="h-px w-full bg-border/70" />
}

export default function HomePage() {
  const { request, notifySuccess, notifyInfo, notifyWarn } = useHttp()
  const [url, setUrl] = React.useState("")
  const [custom, setCustom] = React.useState("")
  const [result, setResult] = React.useState<ShortenResponse | null>(null)

  const canSubmit = isValidUrl(url) && (custom.trim() === "" || isValidCustomCode(normalizeCode(custom)))

  async function onShorten() {
    const trimmedUrl = url.trim()
    const trimmedCode = normalizeCode(custom)

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

    setResult({ code: data.code, short_url: data.short_url, url: data.url })
    notifySuccess("Berhasil dibuat", `Short URL: ${data.short_url}`)
  }

  async function onCopy() {
    if (!result?.short_url) return
    const ok = await copyText(result.short_url)
    if (ok) notifyInfo("Copied", "Short URL sudah disalin ke clipboard.")
    else notifyWarn("Gagal copy", "Browser membatasi akses clipboard.")
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="card overflow-hidden"
      >
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="chip">
                <Wand2 className="h-4 w-4" />
                fast, clean, modern
              </span>
              <span className="chip">
                <Link2 className="h-4 w-4" />
                tiny.kabox.my.id
              </span>
            </div>

            <div className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              Buat short link yang rapi, singkat, dan cepat
            </div>
            <div className="text-sm leading-relaxed text-muted">
              Masukkan URL panjang, pilih custom code (opsional), lalu sistem akan menghasilkan short URL yang siap dipakai.
              Semua interaksi sudah memakai notifikasi dan loading modern.
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted">URL Asli</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/sangat/panjang"
                className="input"
                inputMode="url"
              />
              <div className="text-xs text-muted">Wajib http atau https.</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted">Custom code (opsional)</label>
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="ptfaka"
                className="input"
                inputMode="text"
              />
              <div className="text-xs text-muted">3-10 karakter, huruf/angka/_/-</div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onShorten}
              disabled={!canSubmit}
              className={[
                "btn w-full sm:w-auto",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surfaceElev"
              ].join(" ")}
            >
              <Wand2 className="h-4 w-4" />
              Shorten
            </button>

            <a
              href="/apidocs"
              className="btn w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault()
                notifyInfo("API Docs", "Buka halaman API Docs untuk melihat endpoint dan contoh cURL.")
                window.location.assign("/apidocs")
              }}
            >
              <Link2 className="h-4 w-4" />
              API Docs
            </a>
          </div>
        </div>

        <GlowDivider />

        <div className="p-5 md:p-6">
          <div className="text-sm font-semibold">Hasil</div>
          <div className="mt-2 text-xs text-muted">Short URL akan muncul di sini, lengkap dengan tombol copy dan open.</div>

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
                  <button type="button" onClick={onCopy} className="btn px-4 py-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <a
                    href={result.short_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn px-4 py-2"
                    onClick={() => notifyInfo("Opening", "Membuka short URL di tab baru.")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4 rounded-2xl border border-border/70 bg-surfaceElev p-4 text-sm text-muted">
              Belum ada hasil. Masukkan URL lalu tekan Shorten.
            </div>
          )}

          <div className="mt-5 text-xs text-muted">
            Butuh detail kebijakan penggunaan? Baca{" "}
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
            Kamu bisa request custom code seperti <span className="font-semibold text-foreground">ptfaka</span>. Jika kosong,
            sistem akan memilih kode otomatis yang tetap singkat.
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
            Layout responsif, sidebar menu nyaman di mobile, dan kontrol tetap mudah dipakai di desktop.
          </div>
        </div>
      </motion.section>
    </div>
  )
}