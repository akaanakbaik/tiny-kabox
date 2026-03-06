import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Link2,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap
} from "lucide-react"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Seo from "../components/Seo"
import { copyText } from "../lib/clipboard"
import { getPublicBaseUrl } from "../lib/config"
import { useHttp } from "../lib/http"
import { isValidCustomCode, isValidUrl, normalizeCode } from "../lib/validators"

type ShortenResponse = {
  code: string
  url: string
  shortUrl?: string
  short_url?: string
}

function createFinalShortUrl(base: string, code: string, shortUrl?: string, short_url?: string) {
  if (shortUrl) return shortUrl
  if (short_url) return short_url
  return `${base.replace(/\/+$/, "")}/${code}`
}

function FeatureCard(props: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-border bg-surfaceElev p-5 shadow-soft">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface">
        {props.icon}
      </div>
      <div className="mt-4 text-sm font-semibold text-foreground">{props.title}</div>
      <div className="mt-2 text-xs leading-relaxed text-muted">{props.text}</div>
    </div>
  )
}

export default function HomePage() {
  const { request, notifyError, notifyInfo, notifySuccess, notifyWarn } = useHttp()

  const [url, setUrl] = React.useState("")
  const [customCode, setCustomCode] = React.useState("")
  const [result, setResult] = React.useState<{ code: string; url: string; shortUrl: string } | null>(null)

  const baseUrl = getPublicBaseUrl()
  const trimmedUrl = url.trim()
  const trimmedCode = normalizeCode(customCode)

  const canSubmit = isValidUrl(trimmedUrl) && (trimmedCode === "" || isValidCustomCode(trimmedCode))

  async function handleShorten() {
    if (!isValidUrl(trimmedUrl)) {
      notifyWarn("URL tidak valid", "Masukkan URL dengan format http atau https.")
      return
    }

    if (trimmedCode && !isValidCustomCode(trimmedCode)) {
      notifyWarn("Custom code tidak valid", "Gunakan 3-10 karakter dengan huruf, angka, underscore, atau dash.")
      return
    }

    try {
      const payload: Record<string, string> = { url: trimmedUrl }
      if (trimmedCode) payload.code = trimmedCode

      const data = await request<ShortenResponse>("/api/shorten", {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const shortUrl = createFinalShortUrl(baseUrl, data.code, data.shortUrl, data.short_url)

      setResult({
        code: data.code,
        url: data.url,
        shortUrl
      })

      notifySuccess("Short URL berhasil dibuat", shortUrl)
    } catch (error: any) {
      notifyError("Gagal membuat short URL", error?.message || "Terjadi kesalahan saat memproses permintaan.")
    }
  }

  async function handleCopy() {
    if (!result?.shortUrl) return
    const ok = await copyText(result.shortUrl)
    if (ok) {
      notifySuccess("Berhasil disalin", "Short URL telah disalin ke clipboard.")
    } else {
      notifyWarn("Gagal menyalin", "Clipboard tidak dapat diakses di browser ini.")
    }
  }

  function handleOpen() {
    if (!result?.shortUrl) return
    notifyInfo("Membuka link", "Short URL dibuka di tab baru.")
    window.open(result.shortUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-6">
      <Seo title="Home" description="Create short links with premium modern UI and smooth interactions" path="/" />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="overflow-hidden rounded-[30px] border border-border bg-surfaceElev shadow-2xl"
        >
          <div className="border-b border-border/70 p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <Sparkles className="h-4 w-4" />
                premium shortener
              </span>
              <span className="chip">
                <ShieldCheck className="h-4 w-4" />
                secure interaction
              </span>
              <span className="chip">
                <Zap className="h-4 w-4" />
                smooth ui feedback
              </span>
            </div>

            <div className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
              Buat short URL yang lebih rapi, cepat, dan jauh lebih nyaman dipakai
            </div>
            <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Semua proses dibuat lebih interaktif dengan loading modern, toast yang jelas, tombol yang nyaman dipakai,
              dan desain yang konsisten di mobile maupun desktop.
            </div>
          </div>

          <div className="p-5 md:p-7">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="URL tujuan"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/artikel/panjang"
                hint="Gunakan URL valid dengan http atau https."
                error={url.length > 0 && !isValidUrl(trimmedUrl) ? "Format URL tidak valid." : undefined}
              />

              <Input
                label="Custom short code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="ptfaka"
                hint="Opsional. Panjang 3 sampai 10 karakter."
                error={
                  customCode.length > 0 && !isValidCustomCode(trimmedCode)
                    ? "Custom code harus 3-10 karakter dan hanya berisi huruf, angka, underscore, atau dash."
                    : undefined
                }
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="primary"
                onClick={handleShorten}
                disabled={!canSubmit}
                leftIcon={<Wand2 className="h-4 w-4" />}
              >
                Buat Short URL
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  notifyInfo("Membuka dokumentasi", "Kamu diarahkan ke halaman API Docs.")
                  window.location.assign("/apidocs")
                }}
                leftIcon={<Link2 className="h-4 w-4" />}
              >
                API Docs
              </Button>
            </div>

            <div className="mt-7 rounded-[28px] border border-border bg-surface p-4 md:p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-ok" />
                Hasil short URL
              </div>

              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 space-y-4"
                >
                  <div className="rounded-[22px] border border-border bg-surfaceElev p-4">
                    <div className="text-xs font-semibold text-muted">Short URL</div>
                    <div className="mt-1 break-all text-sm font-semibold text-foreground md:text-base">{result.shortUrl}</div>
                    <div className="mt-3 text-xs leading-relaxed text-muted">Target: {result.url}</div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" variant="secondary" size="sm" onClick={handleCopy} leftIcon={<Copy className="h-4 w-4" />}>
                      Copy Link
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={handleOpen} leftIcon={<ArrowUpRight className="h-4 w-4" />}>
                      Open Link
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="mt-4 rounded-[22px] border border-dashed border-border bg-surfaceElev p-4 text-sm text-muted">
                  Belum ada hasil. Isi URL lalu tekan tombol buat short URL untuk menampilkan hasil di sini.
                </div>
              )}
            </div>

            <div className="mt-5 text-xs leading-relaxed text-muted">
              Dengan menggunakan layanan ini, kamu menyetujui{" "}
              <Link to="/terms" className="font-semibold text-foreground underline decoration-border underline-offset-4">
                syarat dan ketentuan
              </Link>{" "}
              yang berlaku.
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.06 }}
          className="space-y-4"
        >
          <FeatureCard
            icon={<Sparkles className="h-5 w-5 text-ring" />}
            title="UI modern dan premium"
            text="Tampilan dibuat lebih profesional, bersih, halus, dan tetap ringan saat digunakan."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5 text-ok" />}
            title="Notifikasi lebih jelas"
            text="Setiap aksi penting akan menampilkan feedback dari sistem UI internal, bukan alert browser bawaan."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5 text-warn" />}
            title="Alur cepat dan ringan"
            text="Input sederhana, hasil cepat ditampilkan, dan aksi lanjutan dibuat jelas untuk copy maupun open."
          />

          <div className="rounded-[28px] border border-border bg-surfaceElev p-5 shadow-soft">
            <div className="text-sm font-semibold text-foreground">Tips penggunaan</div>
            <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
              <p>Gunakan custom code jika ingin URL pendek yang mudah diingat.</p>
              <p>Biarkan kosong jika ingin sistem membuat code otomatis secara cepat.</p>
              <p>Kalau backend error, UI sekarang akan menampilkan notifikasi yang lebih jelas dan aman dipahami.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}