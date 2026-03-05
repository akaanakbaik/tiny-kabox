import React from "react"
import { motion } from "framer-motion"
import { FileText, Shield, AlertTriangle, Gavel } from "lucide-react"
import Seo from "../components/Seo"

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surfaceElev">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-2 text-xs leading-relaxed text-muted">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <Seo title="Syarat & Ketentuan" description="Terms, usage policy, and privacy" path="/terms" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="card p-5 md:p-6">
        <div className="inline-flex flex-wrap items-center gap-2">
          <span className="chip">
            <FileText className="h-4 w-4" />
            Syarat & Ketentuan
          </span>
          <span className="chip">
            <Shield className="h-4 w-4" />
            Privacy & Safety
          </span>
        </div>

        <div className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">Syarat & Ketentuan Penggunaan</div>
        <div className="mt-2 text-sm leading-relaxed text-muted">
          Dokumen ini menjelaskan aturan penggunaan layanan <span className="font-semibold text-foreground">short url by kabox</span>. Dengan menggunakan layanan ini,
          kamu dianggap memahami dan menyetujui seluruh poin di bawah. Jika tidak setuju, hentikan penggunaan layanan.
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section icon={<Gavel className="h-5 w-5" />} title="Ruang Lingkup Layanan">
          Layanan menyediakan fitur pembuatan tautan pendek yang mengarah ke URL asli. Data yang tersimpan dapat mencakup kode short link, URL tujuan, waktu pembuatan,
          dan jumlah klik. Fitur dapat berubah sewaktu-waktu untuk peningkatan kualitas, performa, dan keamanan.
        </Section>

        <Section icon={<AlertTriangle className="h-5 w-5 text-warn" />} title="Larangan Penggunaan">
          Dilarang menggunakan layanan untuk tujuan melanggar hukum atau merugikan pihak lain, termasuk phishing, malware, penipuan, spam, konten ilegal, doxing, atau
          tindakan yang bertujuan mengecoh pengguna lain. Jika terdeteksi penyalahgunaan, kami berhak menonaktifkan short link tanpa pemberitahuan.
        </Section>

        <Section icon={<Shield className="h-5 w-5" />} title="Privasi & Data">
          Kami meminimalkan data yang dikumpulkan. Data yang disimpan terutama untuk fungsi utama: pemetaan kode ke URL dan statistik klik. Kami tidak menjanjikan
          anonimitas penuh. Untuk menjaga keamanan layanan, audit teknis dapat dilakukan pada pola penggunaan (misalnya lonjakan traffic abnormal) untuk mengurangi spam.
        </Section>

        <Section icon={<FileText className="h-5 w-5" />} title="Ketersediaan & Batasan">
          Layanan disediakan sebagaimana adanya. Kami berusaha menjaga uptime, namun tidak menjamin selalu tersedia tanpa gangguan. Gangguan dapat terjadi karena pemeliharaan,
          perubahan infrastruktur, atau faktor eksternal. Untuk kebutuhan penting, siapkan mekanisme cadangan.
        </Section>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold">Ketentuan Tambahan</div>
        <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
          <p>
            1. Kamu bertanggung jawab atas URL yang dipendekkan. Pastikan kamu memiliki hak/izin membagikan URL tersebut dan kontennya tidak melanggar hukum atau hak pihak lain.
          </p>
          <p>
            2. Custom code bersifat first come, first served. Kami dapat menonaktifkan kode yang melanggar kebijakan, menipu, atau berpotensi membingungkan pengguna.
          </p>
          <p>
            3. Statistik klik disediakan untuk kebutuhan dasar dan dapat terpengaruh oleh sistem keamanan browser, adblocker, atau mekanisme jaringan tertentu.
          </p>
          <p>
            4. Kami dapat menerapkan rate limit, validasi tambahan, atau mekanisme anti-spam kapan saja untuk menjaga kualitas layanan.
          </p>
          <p>
            5. Jika terjadi penyalahgunaan berat atau pelanggaran hukum, kami dapat bekerja sama dengan pihak berwenang sesuai peraturan yang berlaku apabila diwajibkan.
          </p>
          <p>
            6. Kebijakan ini dapat diperbarui sewaktu-waktu. Versi terbaru ditampilkan pada halaman ini. Dengan tetap menggunakan layanan setelah pembaruan, kamu menyetujui perubahan.
          </p>
          <p>
            7. Untuk masukan atau laporan penyalahgunaan, gunakan kanal yang tersedia di website.
          </p>
        </div>
      </div>
    </div>
  )
}