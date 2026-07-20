import React from "react";
import { Helmet } from "react-helmet-async";
import { FileText, ArrowLeft, ShieldCheck, HelpCircle, BookOpen, AlertCircle, Scale, MessageSquare, ExternalLink } from "lucide-react";

interface TermsPageProps {
  onBackHome: () => void;
}

export default function TermsPage({ onBackHome }: TermsPageProps) {
  const lastUpdated = "17 Juli 2026";
  const siteUrl = window.location.origin || "https://majalengkapost.web.id";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="terms-page-container">
      <Helmet>
        <title>Persyaratan Layanan | Majalengka Post</title>
        <meta name="description" content="Persyaratan dan ketentuan penggunaan layanan portal berita Majalengka Post. Pahami hak, kewajiban, dan aturan berkomentar pembaca secara hukum di Indonesia." />
        <meta name="keywords" content="persyaratan layanan, terms of service, ketentuan penggunaan, aturan komentar, majalengka post" />
        <link rel="canonical" href={`${siteUrl}/terms`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Persyaratan Layanan | Majalengka Post" />
        <meta property="og:description" content="Persyaratan dan ketentuan penggunaan layanan portal berita Majalengka Post. Pahami hak, kewajiban, dan aturan berkomentar pembaca secara hukum." />
        <meta property="og:url" content={`${siteUrl}/terms`} />
        <meta property="og:site_name" content="Majalengka Post" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Persyaratan Layanan | Majalengka Post" />
        <meta name="twitter:description" content="Ketentuan penggunaan portal berita Majalengka Post." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 mb-6" id="terms-breadcrumb">
        <button onClick={onBackHome} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
          Beranda
        </button>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300">Persyaratan Layanan</span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-amber-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden" id="terms-hero-header">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Scale className="w-56 h-56" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4 border border-white/10">
            <Scale className="w-3.5 h-3.5" />
            <span>Aspek Hukum & Regulasi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">Persyaratan Layanan</h1>
          <p className="text-xs sm:text-sm text-red-50 font-bold max-w-xl leading-relaxed">
            Selamat datang di Majalengka Post. Harap baca Persyaratan Layanan ini dengan cermat sebelum mengakses atau menggunakan portal berita kami.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span>Status: <strong className="text-amber-300">AKTIF</strong></span>
            <span>•</span>
            <span>Pembaruan Terakhir: <strong>{lastUpdated}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 sm:p-10 text-slate-800 dark:text-slate-200 leading-relaxed space-y-8" id="terms-content-card">
        
        {/* Section 1 */}
        <section className="space-y-3" id="terms-sec-pengantar">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <BookOpen className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">1. Pengantar</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Persyaratan Layanan ini mengatur akses Anda ke situs web, aplikasi seluler, buletin berita, serta layanan konten lainnya yang disediakan oleh <strong className="text-slate-900 dark:text-white">Majalengka Post</strong> (berada di bawah naungan PT Majalengka Post Media). Dengan mengakses, menelusuri, atau menggunakan portal kami, Anda secara hukum menyatakan setuju untuk terikat oleh seluruh poin persyaratan ini, kebijakan privasi, serta pedoman komunitas kami tanpa terkecuali. Jika Anda tidak menyetujui bagian mana pun dari persyaratan ini, Anda disarankan untuk segera menghentikan penggunaan layanan kami.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3" id="terms-sec-penggunaan">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">2. Ketentuan Penggunaan Website</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Akses ke portal Majalengka Post disediakan secara gratis untuk publik sebagai sarana literasi informasi lokal dan nasional. Sebagai pengguna, Anda setuju untuk:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
            <li>Menggunakan situs hanya untuk tujuan yang sah secara hukum dan tidak melanggar ketentuan perundang-undangan di Republik Indonesia.</li>
            <li>Tidak melakukan tindakan yang dapat mengganggu kestabilan server, menginfeksi situs dengan virus, worm, trojan, malware, atau teknologi perusak lainnya.</li>
            <li>Tidak menggunakan bot, spider, scraper, scraper AI, atau alat otomatis lainnya untuk mengambil konten atau data sensitif dari situs tanpa izin tertulis dari Redaksi.</li>
            <li>Bertanggung jawab sepenuhnya atas perangkat keras, jaringan internet, dan biaya operator yang digunakan untuk mengakses layanan ini.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3" id="terms-sec-hak-kewajiban">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Scale className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">3. Hak dan Kewajiban Pengguna</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Pengguna berhak memperoleh informasi yang akurat, obyektif, independen, dan berimbang yang diterbitkan oleh jurnalis Majalengka Post. Pengguna berkewajiban untuk menghormati integritas jurnalisme dengan tidak mendistribusikan ulang, menyalin, memodifikasi, atau memperjualbelikan materi berita di portal ini untuk tujuan komersial sepihak tanpa izin tertulis resmi.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3" id="terms-sec-hak-cipta">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <FileText className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">4. Hak Cipta Konten (Copyright)</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Seluruh konten yang tayang di portal Majalengka Post—termasuk namun tidak terbatas pada artikel berita, tajuk rencana, opini, kolom, foto jurnalistik, video eksklusif, ilustrasi grafis, logo merek dagang, kode sumber pemrograman, dan tata letak desain—adalah milik eksklusif PT Majalengka Post Media dan dilindungi oleh Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta serta perjanjian hak cipta internasional. Pengutipan berita diperbolehkan maksimal sebanyak 250 karakter dengan <strong className="text-red-600 dark:text-red-400">menyertakan atribusi sumber berupa tautan (hyperlink) aktif langsung menuju artikel asli di portal Majalengka Post</strong>.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3" id="terms-sec-aturan-komentar">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <MessageSquare className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">5. Aturan Kolom Komentar Pembaca</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Majalengka Post menyediakan ruang diskusi interaktif berupa kolom komentar untuk bertukar opini sehat. Kami menerapkan sistem moderasi ketat. Anda dilarang keras mengirimkan komentar yang mengandung unsur:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
            <li className="text-red-600 dark:text-red-400 font-extrabold">SARA, rasisme, ujaran kebencian (hate speech), pelecehan seksual, bullying, atau ancaman kekerasan fisik.</li>
            <li>Penyebaran kabar bohong (hoaks), fitnah, pencemaran nama baik pihak lain, atau pelanggaran privasi orang lain.</li>
            <li>Spamming secara berulang, promosi komersial terselubung, perjudian, narkoba, pornografi, atau muatan melanggar hukum siber.</li>
            <li>Link eksternal yang mencurigakan, mengandung malware, phishing, atau berbahaya bagi perangkat pembaca lain.</li>
          </ul>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
            *Redaksi memiliki hak absolut untuk menyunting, menyembunyikan, menghapus komentar melanggar, atau memblokir alamat IP pengguna yang terbukti melanggar aturan ini demi kenyamanan komunitas pembaca.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3" id="terms-sec-disclaimer">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">6. Penafian (Disclaimer)</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Semua berita dan informasi yang diterbitkan disediakan untuk tujuan informasi edukasi publik semata. Kami senantiasa berupaya menyajikan konten secara akurat melalui proses verifikasi jurnalistik yang ketat berdasarkan Pedoman Pemberitaan Media Siber. Namun, Majalengka Post tidak memberikan jaminan mutlak tanpa cela atas kelengkapan, ketepatan waktu, atau ketersediaan berkelanjutan atas seluruh informasi atau data eksternal di portal ini. Kerugian materiil atau non-materiil yang timbul dari keputusan pribadi pembaca berdasarkan berita di portal ini menjadi tanggung jawab pribadi pengguna sepenuhnya.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3" id="terms-sec-hukum">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Scale className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">7. Hukum yang Berlaku di Indonesia</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Persyaratan Layanan ini dibuat, diatur, dan ditafsirkan sepenuhnya tunduk pada ketentuan hukum siber serta Undang-Undang yang berlaku di Republik Indonesia, khususnya <strong className="text-slate-900 dark:text-white">Undang-Undang Nomor 40 Tahun 1999 tentang Pers</strong>, <strong className="text-slate-900 dark:text-white">Undang-Undang Informasi dan Transaksi Elektronik (UU ITE)</strong>, serta peraturan turunannya. Setiap perselisihan hukum yang mungkin terjadi akan diupayakan diselesaikan melalui musyawarah mufakat, Dewan Pers Indonesia, atau melalui jalur peradilan di Pengadilan Negeri Kabupaten Majalengka, Jawa Barat.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3" id="terms-sec-kontak">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">8. Hubungi Redaksi</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Jika Anda memiliki pertanyaan mengenai Persyaratan Layanan ini, pengaduan pemberitaan, hak jawab, koreksi berita, atau perizinan penggunaan konten, silakan hubungi tim legal kami melalui saluran resmi berikut:
          </p>
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 text-xs sm:text-sm font-semibold space-y-2 mt-2">
            <p>🏢 <strong className="text-slate-900 dark:text-white">Kantor Redaksi:</strong> Jalan K.H. Abdul Halim No. 120, Kec. Majalengka, Kabupaten Majalengka, Jawa Barat 45411</p>
            <p>✉️ <strong className="text-slate-900 dark:text-white">Email Resmi:</strong> redaksi@majalengkapost.web.id</p>
            <p>📞 <strong className="text-slate-900 dark:text-white">Telepon / WhatsApp Redaksi:</strong> +62 811-2345-6789</p>
          </div>
        </section>

      </div>

      {/* Back to Home Button */}
      <div className="mt-8 flex justify-center" id="terms-back-btn">
        <button
          onClick={onBackHome}
          className="inline-flex items-center gap-2.5 bg-gradient-to-br from-[#FF3B30] to-[#E60023] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-all focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  );
}
