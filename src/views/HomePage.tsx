import React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2, Copy, Link2, ShieldCheck, Sparkles, Wand2 } from "lucide-react"
import { Link } from "react-router-dom"
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

function StatCard(props: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-surfaceElev p-4 shadow-soft">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface">
        {props.icon}
      </div>
      <div className="mt-3 text-sm font-semibold text-foreground">{props.title}</div>
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
      notifyWarn("Custom code tidak valid", "Gunakan 3-10 karakter, hanya huruf, angka, underscore, atau dash.")
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
      notifySuccess("Berhasil disalin", "Short URL telah masuk ke clipboard.")
    } else {
      notifyWarn("Copy gagal", "Browser menolak akses clipboard.")
    }
  }

  function handleOpen() {
    if (!result?.shortUrl) return
    notifyInfo("Membuka short URL", "Link dibuka di tab baru.")
    window.open(result.shortUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="space-y-6">
      <Seo title="Home" description="Create short links with modern UI and smooth interactions" path="/" />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="overflow-hidden rounded-[28px] border border-border bg-surfaceElev shadow-2xl"
        >
          <div className="border-b border-border/70 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <Sparkles className="h-4 w-4" />
                modern shortener
              </span>
              <span className="chip">
                <ShieldCheck className="h-4 w-4" />
                feedback rich ui
              </span>
            </div>

            <div className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Short URL cepat, modern, profesional, dan nyaman digunakan di semua perangkat
            </div>
            <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Buat link pendek, pakai custom code, dapatkan loading modern, toast interaktif, dan pengalaman UI halus tanpa notifikasi browser bawaan.
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="URL tujuan"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/artikel/panjang"
                hint="Gunakan URL http atau https yang valid."
                error={url.length > 0 && !isValidUrl(trimmedUrl) ? "Format URL tidak valid." : undefined}
              />

              <Input
                label="Custom short code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="ptfaka"
                hint="Opsional. Gunakan 3–10 karakter."
                error={
                  customCode.length > 0 && !isValidCustomCode(trimmedCode)
                    ? "Custom code harus 3–10 karakter dan hanya huruf, angka, underscore, atau dash."
                    : undefined
                }
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleShorten}
                disabled={!canSubmit}
                leftIcon={<Wand2 className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Buat Short URL
              </Button>

              <Button
                type="button"
                onClick={() => {
                  notifyInfo("Membuka dokumentasi", "Mengarah ke halaman dokumentasi API.")
                  window.location.assign("/apidocs")
                }}
                leftIcon={<Link2 className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Lihat API Docs
              </Button>
            </div>

            <div className="mt-6 rounded-[26px] border border-border bg-surface p-4 md:p-5">
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
                  <div className="rounded-2xl border border-border bg-surfaceElev p-4">
                    <div className="text-xs font-semibold text-muted">Short URL</div>
                    <div className="mt-1 break-all text-sm font-semibold text-foreground">{result.shortUrl}</div>
                    <div className="mt-3 text-xs text-muted">Target: {result.url}</div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" size="sm" onClick={handleCopy} leftIcon={<Copy className="h-4 w-4" />}>
                      Copy Link
                    </Button>
                    <Button type="button" size="sm" onClick={handleOpen} leftIcon={<ArrowUpRight className="h-4 w-4" />}>
                      Open Link
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-surfaceElev p-4 text-sm text-muted">
                  Belum ada hasil. Masukkan URL lalu tekan tombol buat short URL.
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
          <StatCard
            icon={<Sparkles className="h-5 w-5 text-ring" />}
            title="Interaksi modern"
            text="Loading global, toast interaktif, animasi halus, dan seluruh feedback ditampilkan dari UI web."
          />
          <StatCard
            icon={<ShieldCheck className="h-5 w-5 text-ok" />}
            title="Aman dan profesional"
            text="Validasi input jelas, tampilan rapi, dan alur penggunaan dibuat sederhana namun tetap kuat."
          />
          <StatCard
            icon={<Link2 className="h-5 w-5 text-warn" />}
            title="Fleksibel"
            text="Bisa request custom code sendiri atau biarkan sistem membuat short code otomatis secara cepat."
          />

          <div className="rounded-[28px] border border-border bg-surfaceElev p-5 shadow-soft">
            <div className="text-sm font-semibold text-foreground">Tips penggunaan</div>
            <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
              <p>Gunakan custom code unik jika ingin URL lebih mudah diingat.</p>
              <p>Pastikan URL tujuan benar agar pengunjung tidak diarahkan ke link yang salah.</p>
              <p>Jika muncul error, sistem akan memberi pemberitahuan yang lebih jelas langsung dari UI.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}