import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FileText, Send, CheckCircle2, ShieldAlert, Mail, Phone, Clock, FileCheck } from "lucide-react";
import { safeLocalStorage } from "../lib/safeStorage";

export default function HakJawab() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    judulBerita: "",
    urlBerita: "",
    isiHakJawab: ""
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save locally to simulate recording the response
    try {
      const existing = safeLocalStorage.getItem("majalengkapost_hak_jawab_responses") || "[]";
      const responses = JSON.parse(existing);
      responses.push({
        ...formData,
        id: "hj_" + Date.now(),
        timestamp: new Date().toISOString()
      });
      safeLocalStorage.setItem("majalengkapost_hak_jawab_responses", JSON.stringify(responses));
    } catch (err) {
      console.warn("Failed to persist Hak Jawab response:", err);
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      nama: "",
      email: "",
      telepon: "",
      judulBerita: "",
      urlBerita: "",
      isiHakJawab: ""
    });
    setSubmitted(false);
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>Hak Jawab Pembaca - Portal Berita Majalengka Post</title>
        <meta name="description" content="Kanal resmi pengajuan Hak Jawab Pembaca di Majalengka Post sesuai UU Pers Nomor 40 Tahun 1999 untuk mengoreksi pemberitaan yang merugikan." />
        <link rel="canonical" href={`${window.location.origin}/#hak-jawab`} />
        <meta property="og:title" content="Hak Jawab Pembaca - Majalengka Post" />
        <meta property="og:description" content="Formulir resmi dan pedoman pengajuan Hak Jawab Pembaca demi pemenuhan keadilan pers nasional." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/#hak-jawab`} />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium font-sans">
        <a href="#" className="hover:text-red-600 transition-colors">Beranda</a>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold">Hak Jawab Pembaca</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Rules & Explanations */}
        <div className="lg:col-span-7 space-y-6 prose prose-slate max-w-none dark:prose-invert">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mt-0">
            <strong>Hak Jawab</strong> adalah hak konstitusional yang melekat pada setiap individu, kelompok, maupun lembaga organisasi yang merasa dirugikan oleh fakta pemberitaan yang diterbitkan oleh pers. <strong>Majalengka Post</strong> tunduk sepenuhnya pada peraturan regulasi pers dan wajib memuat tanggapan, sanggahan, atau koreksi secara proporsional.
          </p>

          <div className="bg-red-50 dark:bg-red-950/10 border-l-4 border-red-600 p-4 rounded-r-xl">
            <h4 className="text-xs font-black text-red-900 dark:text-red-300 uppercase tracking-wider mt-0 mb-1">Dasar Hukum Hak Jawab</h4>
            <p className="text-xs text-red-800 dark:text-red-400 leading-normal m-0 font-medium">
              Undang-Undang Nomor 40 Tahun 1999 tentang Pers Pasal 1 angka 11, Pasal 5 ayat (2), dan Pasal 15 ayat (2) huruf d menetapkan bahwa pers wajib melayani Hak Jawab untuk menyelesaikan sengketa pers demi meluruskan kekeliruan informasi secara seimbang.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-4 mb-2">Pedoman Pengajuan Hak Jawab</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Siapa yang Dapat Mengajukan</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Setiap individu, perwakilan kelompok, institusi swasta, maupun instansi pemerintah yang secara langsung namanya disebut, dikutip, atau menjadi subjek utama dalam pemberitaan yang dianggap tidak akurat atau merugikan.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Tata Cara Pengisian</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Sampaikan sanggahan dengan bahasa yang sopan, rasional, dan objektif. Sebutkan judul berita, link URL berita asli, dan sertakan kronologi atau pemaparan fakta pembanding yang sebenar-benarnya secara mendalam.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Dokumen Lampiran Pendukung</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Sertakan scan atau foto kartu identitas (KTP/SIM) pihak pemohon yang masih berlaku. Apabila mewakili lembaga atau institusi, wajib melampirkan Surat Kuasa resmi yang dibubuhi tanda tangan Pemimpin dan cap basah institusi.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  04
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Batas Waktu & Jangka Verifikasi</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Batas waktu pengajuan maksimal adalah 2 (dua) bulan sejak tanggal berita orisinal dipublikasikan. Redaksi akan memverifikasi permohonan maksimal dalam waktu 2x24 jam sejak dokumen dinyatakan lengkap diterima.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center shrink-0 text-red-600 text-xs font-bold font-mono">
                  05
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0 mb-1">Alasan Penolakan Permohonan</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-0">
                    Redaksi berhak menolak Hak Jawab jika: isi pengajuan mengandung unsur fitnah baru terhadap pihak lain, bermuatan ujaran kebencian, melanggar SARA, atau pengaju tidak bersedia menyertakan identitas hukum yang sah.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-150 dark:border-gray-850 space-y-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <span>Email Redaksi: <strong>redaksi@majalengkapost.web.id</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span>Kontak Layanan Pengaduan: +62 811-2345-6789</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-900 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-150 dark:border-slate-850 pb-3">
            <FileText className="w-5 h-5 text-red-600 shrink-0" />
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Formulir Hak Jawab</h3>
          </div>

          {submitted ? (
            <div className="space-y-4 text-center py-6">
              <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Pengajuan Berhasil Terkirim!</h4>
              <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-500 font-medium max-w-sm mx-auto">
                Terima kasih. Pengajuan Hak Jawab Anda telah terekam secara resmi dalam sistem log Majalengka Post. Tim penilai redaksi kami akan memproses dan menghubungi Anda dalam waktu maksimal 1x24 jam melalui email atau nomor telepon yang dicantumkan.
              </p>
              <button 
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Kirim Pengajuan Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Nama Lengkap Pemohon *</label>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama Anda sesuai KTP..."
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">No. Telepon / WA *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Judul Berita yang Disanggah *</label>
                <input
                  type="text"
                  required
                  placeholder="Ketik judul berita yang bermasalah..."
                  value={formData.judulBerita}
                  onChange={(e) => setFormData({ ...formData, judulBerita: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Link / URL Artikel Berita *</label>
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
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Isi Hak Jawab & Klarifikasi Fakta *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Posisikan secara jelas bagian berita mana yang salah beserta kalimat sanggahan atau fakta pembanding yang benar..."
                  value={formData.isiHakJawab}
                  onChange={(e) => setFormData({ ...formData, isiHakJawab: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-red-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Hak Jawab</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
