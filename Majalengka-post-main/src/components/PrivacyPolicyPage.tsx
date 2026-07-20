import React from "react";
import { Helmet } from "react-helmet-async";
import { Shield, ArrowLeft, ShieldAlert, Lock, Eye, Database, Globe, HelpCircle, ExternalLink, Settings } from "lucide-react";

interface PrivacyPolicyPageProps {
  onBackHome: () => void;
}

export default function PrivacyPolicyPage({ onBackHome }: PrivacyPolicyPageProps) {
  const lastUpdated = "17 Juli 2026";
  const siteUrl = window.location.origin || "https://majalengkapost.web.id";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="privacy-page-container">
      <Helmet>
        <title>Kebijakan Privasi | Majalengka Post</title>
        <meta name="description" content="Kebijakan Privasi portal berita Majalengka Post. Pelajari bagaimana kami mengumpulkan, melindungi, dan memperlakukan data pribadi Anda sesuai standar privasi global." />
        <meta name="keywords" content="kebijakan privasi, privacy policy, perlindungan data pribadi, cookies, google analytics, google adsense" />
        <link rel="canonical" href={`${siteUrl}/privacy-policy`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kebijakan Privasi | Majalengka Post" />
        <meta property="og:description" content="Kebijakan Privasi portal berita Majalengka Post. Pelajari bagaimana kami melindungi data pribadi Anda." />
        <meta property="og:url" content={`${siteUrl}/privacy-policy`} />
        <meta property="og:site_name" content="Majalengka Post" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Kebijakan Privasi | Majalengka Post" />
        <meta name="twitter:description" content="Ketentuan kebijakan privasi portal berita Majalengka Post." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 mb-6" id="privacy-breadcrumb">
        <button onClick={onBackHome} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
          Beranda
        </button>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300">Kebijakan Privasi</span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-amber-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden" id="privacy-hero-header">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Shield className="w-56 h-56" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4 border border-white/10">
            <Lock className="w-3.5 h-3.5" />
            <span>Kerahasiaan & Keamanan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">Kebijakan Privasi</h1>
          <p className="text-xs sm:text-sm text-red-50 font-bold max-w-xl leading-relaxed">
            Kepercayaan Anda adalah prioritas utama kami. Di Majalengka Post, kami berkomitmen penuh untuk mengumpulkan dan memperlakukan informasi pribadi Anda secara transparan dan aman.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span>Status: <strong className="text-amber-300">AKTIF</strong></span>
            <span>•</span>
            <span>Pembaruan Terakhir: <strong>{lastUpdated}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 sm:p-10 text-slate-800 dark:text-slate-200 leading-relaxed space-y-8" id="privacy-content-card">
        
        {/* Section 1 */}
        <section className="space-y-3" id="privacy-sec-pengantar">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Eye className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">1. Pengantar</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Kebijakan Privasi ini menjelaskan bagaimana <strong className="text-slate-900 dark:text-white">Majalengka Post</strong> ("kami") mengumpulkan, menyimpan, menggunakan, mengolah, dan melindungi informasi pribadi Anda ("Pengguna") sewaktu Anda menjelajahi portal berita kami, berlangganan newsletter, berinteraksi dengan AI chat, atau mengirim komentar. Kami menjunjung tinggi hak privasi Anda dan patuh pada ketentuan Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) serta standar privasi global (GDPR dan CCPA).
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3" id="privacy-sec-data-dikumpulkan">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Database className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">2. Data yang Kami Kumpulkan</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Kami mengumpulkan informasi dari Anda dengan beberapa cara, termasuk informasi yang Anda berikan langsung maupun data yang terekam otomatis oleh sistem portal:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
            <li><strong>Data Pribadi yang Anda Berikan:</strong> Nama, alamat email (sewaktu berlangganan newsletter), isi komentar, foto yang Anda unggah melalui portal redaksi publik, serta riwayat percakapan dengan chatbot interaktif "Tanya AI".</li>
            <li><strong>Informasi Perangkat Pengguna:</strong> Jenis ponsel atau komputer, sistem operasi, resolusi layar, preferensi bahasa, dan jenis web browser yang Anda gunakan untuk mengakses Majalengka Post.</li>
            <li><strong>Alamat IP (Internet Protocol):</strong> Alamat IP dicatat secara otomatis untuk keperluan keamanan jaringan, memitigasi aktivitas spamming di kolom komentar, dan menganalisis tren asal geografis pembaca (seperti kecamatan di Kabupaten Majalengka).</li>
            <li><strong>Data Lokasi Kasar:</strong> Koordinat wilayah tingkat kabupaten/kota berdasarkan alamat IP guna menyajikan konten informasi cuaca lokal atau iklan sponsor yang relevan.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3" id="privacy-sec-cookies">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Settings className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">3. Penggunaan Cookie</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Majalengka Post menggunakan cookie, pixel tag, dan teknologi pelacakan sejenis untuk mengingat preferensi Anda (seperti status Mode Gelap, kategori favorit yang Anda pin, dan penanda bookmark artikel). Cookie membantu kami mempercepat pemuatan halaman (page caching) serta memberikan pengalaman navigasi personal yang lancar. Anda dapat menonaktifkan cookie melalui pengaturan browser Anda, namun beberapa fitur interaktif situs mungkin tidak berjalan optimal setelah penonaktifan.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3" id="privacy-sec-integrasi">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Globe className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">4. Layanan Pihak Ketiga & Integrasi</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Untuk menyajikan portal media siber kelas dunia, kami mengintegrasikan beberapa layanan teknologi pihak ketiga yang juga mengumpulkan data anonim secara terpisah:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1.5">Google Analytics & News</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Digunakan untuk memantau lalu lintas (traffic) kunjungan halaman secara agregat guna menganalisis minat pembaca dan meningkatkan relevansi berita lokal di Google News.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1.5">Google AdSense</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Menyajikan iklan terprogram yang relevan. Google menggunakan cookie DART untuk menampilkan iklan berdasarkan kunjungan Anda ke portal kami dan situs internet lainnya.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1.5">Reader Revenue Manager</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Mengelola sistem donasi pembaca, langganan premium digital berbayar, atau akses eksklusif yang aman dan patuh standar PCI-DSS.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-1.5">Supabase / Cloud Database</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Menyimpan data interaktif pembaca (seperti bookmark, voting polling publik, draf naskah rujukan) dalam kondisi terenkripsi di server komputasi awan berkeamanan tinggi.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3" id="privacy-sec-perlindungan">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <Lock className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">5. Perlindungan Keamanan Data</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Kami menerapkan tindakan pengamanan teknis, fisik, dan administratif yang ketat guna melindungi data pribadi Anda dari akses tidak sah, pencurian, kehilangan, kebocoran, pengungkapan ilegal, atau manipulasi data sepihak. Transmisi data sensitif di portal kami selalu dienkripsi menggunakan protokol HTTPS dengan sertifikat Secure Sockets Layer (SSL) standar industri.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3" id="privacy-sec-hak-pengguna">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">6. Hak Anda & Penghapusan Data</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Sesuai UU Perlindungan Data Pribadi (PDP) Indonesia, Anda memiliki hak penuh untuk mengakses informasi pribadi yang tersimpan dalam sistem kami, melakukan pembaruan jika terdapat kesalahan, atau meminta penghapusan total atas riwayat data pribadi Anda (termasuk pendaftaran email newsletter, bookmark, riwayat percakapan "Tanya AI", atau komentar yang pernah Anda kirim).
          </p>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 mt-2">
            <p className="text-xs text-amber-800 dark:text-amber-400 font-bold leading-relaxed">
              👉 <strong>Cara Meminta Penghapusan Data Pribadi:</strong> Kirimkan surat elektronik (email) permohonan Anda ke alamat <strong className="text-red-600 dark:text-red-400">privacy@majalengkapost.web.id</strong> dengan subjek "Permohonan Penghapusan Data Pengguna". Tim IT dan legal kami akan memproses serta memusnahkan data Anda dari server utama dalam kurun waktu 2 x 24 jam hari kerja.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-3" id="privacy-sec-kontak">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-500">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">7. Informasi Kontak Legal</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
            Jika ada kekhawatiran terkait privasi data, penyalahgunaan informasi, atau pertanyaan mendalam tentang kepatuhan siber kami, silakan berkomunikasi dengan pejabat perlindungan data (Data Protection Officer) kami di:
          </p>
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 text-xs sm:text-sm font-semibold space-y-2 mt-2">
            <p>🏢 <strong className="text-slate-900 dark:text-white">PT Majalengka Post Media (Departemen IT & Legal Compliance)</strong></p>
            <p>✉️ <strong className="text-slate-900 dark:text-white">Email Privasi:</strong> privacy@majalengkapost.web.id</p>
            <p>📍 <strong className="text-slate-900 dark:text-white">Alamat Korespondensi:</strong> Jalan K.H. Abdul Halim No. 120, Kec. Majalengka, Kabupaten Majalengka, Jawa Barat 45411</p>
          </div>
        </section>

      </div>

      {/* Back to Home Button */}
      <div className="mt-8 flex justify-center" id="privacy-back-btn">
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
