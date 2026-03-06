import React from "react"
import { motion } from "framer-motion"
import { FileText, Gavel, Shield, TriangleAlert } from "lucide-react"
import Seo from "../components/Seo"

function InfoBlock(props: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-border bg-surfaceElev p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface">
          {props.icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">{props.title}</div>
          <div className="mt-3 text-xs leading-relaxed text-muted">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <Seo title="Syarat dan Ketentuan" description="Aturan penggunaan layanan short url by kabox" path="/terms" />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="rounded-[30px] border border-border bg-surfaceElev p-5 shadow-2xl md:p-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs text-muted">
          <FileText className="h-4 w-4 text-ring" />
          usage policy and platform rules
        </div>

        <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Syarat & Ketentuan</div>
        <div className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Halaman ini menjelaskan aturan, kebijakan, hak, batasan, dan tanggung jawab dalam penggunaan layanan short url by kabox.
          Dengan menggunakan layanan ini, kamu dianggap memahami dan menyetujui isi kebijakan berikut.
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.04 }}>
          <InfoBlock icon={<Gavel className="h-5 w-5 text-ring" />} title="Ruang Lingkup Layanan">
            Layanan ini menyediakan sistem pemendek URL berbasis web dan API. Pengguna dapat membuat short link baru, memakai custom code,
            serta mengarahkan pengunjung ke URL tujuan tertentu. Layanan ini disediakan untuk kebutuhan berbagi link yang lebih singkat, bersih,
            dan mudah diingat.
          </InfoBlock>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.08 }}>
          <InfoBlock icon={<TriangleAlert className="h-5 w-5 text-warn" />} title="Larangan Penggunaan">
            Pengguna dilarang memanfaatkan layanan ini untuk penipuan, phishing, malware, spam, distribusi konten ilegal, penyesatan identitas,
            atau aktivitas yang merugikan pihak lain. Sistem dapat menolak, membatasi, atau menghapus short link tertentu jika ditemukan indikasi penyalahgunaan.
          </InfoBlock>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.12 }}>
          <InfoBlock icon={<Shield className="h-5 w-5 text-ok" />} title="Privasi & Keamanan">
            Kami berusaha menjaga koneksi, penyimpanan data, dan interaksi sistem tetap aman. Namun, pengguna tetap bertanggung jawab memastikan
            URL tujuan yang dipakai aman, sah, dan tidak melanggar hukum. Kami dapat melakukan pembatasan teknis atau audit dasar untuk menjaga kestabilan layanan.
          </InfoBlock>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: 0.16 }}>
          <InfoBlock icon={<FileText className="h-5 w-5 text-ring" />} title="Perubahan Kebijakan">
            Ketentuan ini dapat berubah sewaktu-waktu untuk penyesuaian fitur, keamanan, atau kebutuhan operasional layanan. Versi terbaru akan ditampilkan pada halaman ini.
            Penggunaan layanan setelah pembaruan dianggap sebagai persetujuan terhadap ketentuan terbaru.
          </InfoBlock>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.2 }}
        className="rounded-[30px] border border-border bg-surfaceElev p-5 shadow-soft"
      >
        <div className="text-sm font-semibold text-foreground">Ketentuan Tambahan</div>

        <div className="mt-4 space-y-4 text-xs leading-relaxed text-muted">
          <p>
            1. Pengguna bertanggung jawab penuh atas setiap URL yang dimasukkan ke dalam sistem, termasuk isi, tujuan, dan dampak dari distribusi link tersebut.
          </p>
          <p>
            2. Custom short code yang telah digunakan pengguna lain tidak dapat dipakai ulang, kecuali link terkait telah dihapus atau dinonaktifkan oleh sistem.
          </p>
          <p>
            3. Statistik, klik, dan data teknis yang tersedia dalam sistem digunakan untuk operasional layanan dan dapat berubah sewaktu-waktu tanpa pemberitahuan khusus.
          </p>
          <p>
            4. Kami tidak menjamin layanan akan selalu tersedia tanpa gangguan. Maintenance, perubahan infrastruktur, atau gangguan eksternal dapat mempengaruhi akses.
          </p>
          <p>
            5. Untuk penggunaan komersial, integrasi berat, atau kebutuhan trafik tinggi, pengguna disarankan memastikan arsitektur penggunaan sesuai dengan batas sistem.
          </p>
          <p>
            6. Pelanggaran terhadap kebijakan ini dapat menyebabkan pembatasan akses, penghapusan link, atau tindakan teknis lain yang dianggap perlu untuk menjaga stabilitas layanan.
          </p>
        </div>
      </motion.section>
    </div>
  )
}