import React from "react"
import { motion } from "framer-motion"
import { FileText, Shield, AlertTriangle, Gavel } from "lucide-react"

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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="card p-5 md:p-6">
        <div className="inline-flex items-center gap-2">
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
          kamu dianggap memahami dan menyetujui seluruh poin di bawah. Jika tidak setuju, mohon hentikan penggunaan layanan.
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Section icon={<Gavel className="h-5 w-5" />} title="Ruang Lingkup Layanan">
          Layanan ini menyediakan fitur untuk membuat tautan pendek yang mengarah ke URL asli. Sistem dapat menyimpan data kode short link, URL tujuan,
          waktu pembuatan, dan jumlah klik. Layanan dapat berubah, ditambah, atau dikurangi sewaktu-waktu untuk peningkatan kualitas dan keamanan.
        </Section>

        <Section icon={<AlertTriangle className="h-5 w-5 text-warn" />} title="Larangan Penggunaan">
          Dilarang menggunakan layanan untuk tujuan melanggar hukum atau merugikan pihak lain. Termasuk namun tidak terbatas pada: phishing, malware,
          penipuan, penyebaran konten ilegal, doxing, spam, atau tindakan yang bertujuan mengecoh pengguna lain. Jika terdeteksi penyalahgunaan,
          kami berhak menonaktifkan kode short link terkait tanpa pemberitahuan.
        </Section>

        <Section icon={<Shield className="h-5 w-5" />} title="Privasi & Data">
          Kami berupaya meminimalkan data yang dikumpulkan. Data yang disimpan terutama untuk fungsi utama: pemetaan kode ke URL dan statistik klik.
          Kami tidak menjanjikan anonimitas penuh. Jika diperlukan untuk keamanan, kami dapat melakukan audit teknis pada pola penggunaan (misalnya lonjakan traffic
          abnormal) untuk mengurangi spam dan penyalahgunaan.
        </Section>

        <Section icon={<FileText className="h-5 w-5" />} title="Ketersediaan & Batasan">
          Layanan disediakan sebagaimana adanya. Walaupun kami berusaha menjaga uptime dan performa, kami tidak menjamin layanan selalu tersedia tanpa gangguan.
          Gangguan dapat terjadi akibat pemeliharaan, perubahan infrastruktur, atau faktor eksternal. Kamu disarankan tidak mengandalkan layanan ini sebagai satu-satunya
          sumber kritikal tanpa mekanisme cadangan.
        </Section>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold">Ketentuan Tambahan yang Lebih Rinci</div>
        <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
          <p>
            1. Kamu bertanggung jawab penuh atas URL yang kamu pendekkan. Pastikan kamu memiliki hak atau izin untuk membagikan URL tersebut, dan pastikan konten tujuan
            tidak melanggar hukum maupun hak pihak lain.
          </p>
          <p>
            2. Custom code bersifat “first come, first served”. Jika code sudah digunakan, kamu harus memilih code lain. Kami dapat menghapus atau mengganti code yang
            dinilai melanggar kebijakan atau berpotensi membingungkan pengguna (misalnya meniru brand/layanan lain dengan tujuan menipu).
          </p>
          <p>
            3. Statistik klik (clicks) disediakan untuk kebutuhan dasar. Kami tidak menjamin statistik tersebut akurat 100% dalam semua kondisi karena beberapa klik dapat
            diblokir oleh sistem keamanan browser, adblocker, atau mekanisme cache tertentu.
          </p>
          <p>
            4. Kami dapat menerapkan pembatasan rate limit, validasi tambahan, atau mekanisme anti-spam kapan saja. Tujuannya adalah menjaga layanan tetap sehat dan
            melindungi pengguna dari penyalahgunaan.
          </p>
          <p>
            5. Jika terjadi penyalahgunaan berat atau pelanggaran hukum, kami dapat bekerja sama dengan pihak berwenang sesuai peraturan yang berlaku, termasuk memberikan
            informasi teknis yang relevan apabila diwajibkan secara hukum.
          </p>
          <p>
            6. Kebijakan ini dapat diperbarui sewaktu-waktu. Versi terbaru akan ditampilkan pada halaman ini. Dengan tetap menggunakan layanan setelah pembaruan, kamu
            dianggap menyetujui perubahan yang berlaku.
          </p>
          <p>
            7. Untuk pertanyaan, masukan, atau laporan penyalahgunaan, kamu dapat menghubungi pihak pengelola melalui kanal yang tersedia di website.
          </p>
        </div>
      </div>
    </div>
  )
}