import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Clock, Send, CheckCircle2, ShieldCheck, Mail, Link as LinkIcon, FileCheck } from "lucide-react";
import { safeLocalStorage } from "../lib/safeStorage";

export default function Koreksi() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    urlBerita: "",
    bagianSalah: "",
    perbaikanBenar: "",
    lampiran: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save locally to simulate recording the response
    try {
      const existing = safeLocalStorage.getItem("majalengkapost_koreksi_responses") || "[]";
      const responses = JSON.parse(existing);
      responses.push({
        ...formData,
        id: "kor_" + Date.now(),
        timestamp: new Date().toISOString()
      });
      safeLocalStorage.setItem("majalengkapost_koreksi_responses", JSON.stringify(responses));
    } catch (err) {
      console.warn("Failed to persist Koreksi response:", err);
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      nama: "",
      email: "",
      urlBerita: "",
      bagianSalah: "",
      perbaikanBenar: "",
      lampiran: ""
    });
    setSubmitted(false);
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>Koreksi & Ralat Berita - Portal Berita Majalengka Post</title>
        <meta name="description" content="Layanan pengajuan koreksi dan ralat berita resmi dari redaksi Majalengka Post. Kami berkomitmen penuh menjaga akurasi dan kebenaran data jurnalisme." />
        <link rel="canonical" href={`${window.location.origin}/#koreksi`} />
        <meta property="og:title" content="Koreksi & Ralat Berita - Majalengka Post" />
        <meta property="og:description" content="Saluran pengaduan pembaca untuk koreksi data, nama, lokasi, dan salah ketik dalam berita siber Majalengka Post." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/#koreksi`} />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium font-sans">
        <a href="#" className="hover:text-red-600 transition-colors">Beranda</a>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">Koreksi & Ralat Berita</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Explanations */}
        <div className="lg:col-span-7 space-y-6 prose prose-slate max-w-none dark:prose-invert">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mt-0">
            Sebagai komitmen jurnalisme bermutu dan transparan, <strong>Majalengka Post</strong> selalu mengutamakan akurasi data dalam setiap penulisan berita. Namun, apabila terdapat kekeliruan atau kesalahan penulisan (seperti nama, gelar, lokasi, tanggal, angka, atau kutipan narasumber), pembaca dapat mengajukan permohonan <strong>Koreksi & Ralat Berita</strong> agar kami perbaiki secepatnya.
          </p>

          <div className="bg-red-50 dark:bg-red-950/10 border-l-4 border-red-600 p-4 rounded-r-xl">
            <h4 className="text-xs font-black text-red-900 dark:text-red-300 uppercase tracking-wider mt-0 mb-1">Dasar Hukum Koreksi</h4>
            <p className="text-xs text-red-800 dark:text-red-400 leading-normal m-0 font-medium">
              Sesuai dengan Kode Etik Jurnalistik Dewan Pers Pasal 10 dan Undang-Undang Nomor 40 Tahun 1999 tentang Pers, redaksi pers berkewajiban untuk segera mencabut, meralat, dan memperbaiki berita yang keliru dan tidak akurat demi akuntabilitas publik.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-4 mb-2">Panduan Pengajuan Koreksi Berita</h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Jenis Kesalahan yang Dapat Dikoreksi</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Salah ketik (typo), kesalahan penulisan gelar atau instansi narasumber, kekeliruan data statistik, kesalahan penyebutan alamat/lokasi kejadian, kekeliruan pencantuman sumber hak cipta foto/video, serta inkonsistensi fakta berita.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  B
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Penyertaan Bukti Pendukung</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Tuliskan argumentasi koreksi dengan jelas. Pembaca disarankan menyertakan tautan dokumen pendukung, file rilis resmi pers, atau bukti autentik foto/dokumen lainnya agar redaksi dapat memverifikasi kebenaran laporan Anda secara instan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  C
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Mekanisme Verifikasi & Publikasi</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Redaksi penanggung jawab rubrik akan memeriksa bukti pendukung Anda dalam waktu secepatnya. Jika koreksi disetujui, kami akan melakukan ralat langsung pada artikel berita bersangkutan dan mencantumkan <strong>"Catatan Redaksi (Ralat)"</strong> di bagian bawah tubuh berita sebagai bentuk akuntabilitas publik.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  D
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Kebijakan Transparansi Jurnalisme</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Majalengka Post menganut asas keterbukaan informasi. Setiap perbaikan berita tidak dilakukan secara sembunyi-sembunyi, melainkan diumumkan secara eksplisit tanggal, jam, serta poin-poin yang diperbarui dalam ralat tersebut demi edukasi bersama.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-150 dark:border-gray-850 space-y-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <span>Saluran Resmi Email Koreksi: <strong>redaksi@majalengkapost.web.id</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600 shrink-0" />
                <span>Target Resolusi Koreksi: Maksimal 1x12 Jam Kerja</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-900 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-150 dark:border-slate-850 pb-3">
            <Clock className="w-5 h-5 text-red-600 shrink-0" />
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Formulir Koreksi Berita</h3>
          </div>

          {submitted ? (
            <div className="space-y-4 text-center py-6">
              <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Laporan Koreksi Dikirim!</h4>
              <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-500 font-medium max-w-sm mx-auto">
                Terima kasih atas kepedulian Anda terhadap integritas jurnalisme Majalengka Post. Laporan koreksi berita Anda telah masuk ke antrean utama dewan redaksi kami. Editor kami segera melakukan peninjauan dalam waktu kurang dari 12 jam kerja.
              </p>
              <button 
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Ajukan Koreksi Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Nama Lengkap Pelapor *</label>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama Anda..."
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Alamat Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nama@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Link / URL Artikel Berita yang Salah *</label>
                <input
                  type="url"
                  required
                  placeholder="https://majalengkapost.web.id/berita/..."
                  value={formData.urlBerita}
                  onChange={(e) => setFormData({ ...formData, urlBerita: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Bagian / Paragraf yang Salah *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ketik kata/kalimat/data awal yang keliru di artikel..."
                  value={formData.bagianSalah}
                  onChange={(e) => setFormData({ ...formData, bagianSalah: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Klarifikasi / Perbaikan yang Benar *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan data, nama, lokasi atau perbaikan yang benar sesuai fakta..."
                  value={formData.perbaikanBenar}
                  onChange={(e) => setFormData({ ...formData, perbaikanBenar: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Tautan Bukti Pendukung / Lampiran (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... (atau link bukti lainnya)"
                  value={formData.lampiran}
                  onChange={(e) => setFormData({ ...formData, lampiran: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-red-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Koreksi Berita</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
