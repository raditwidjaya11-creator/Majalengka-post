import React, { useState } from "react";
import { 
  Users, Briefcase, Mail, Megaphone, MapPin, Phone, 
  Send, ArrowLeft, Calendar, User, FileText, CheckCircle2,
  Clock, Award, ShieldCheck, DollarSign, HelpCircle, ChevronRight, Shield
} from "lucide-react";
import { UserRole } from "../types";
import PedomanMediaSiber from "./PedomanMediaSiber";
import KodeEtik from "./KodeEtik";
import HakJawab from "./HakJawab";
import Koreksi from "./Koreksi";

export interface CompanyProfilePage {
  id: string; // "about" | "redaksi" | "karir" | "kontak" | "iklan" | "pedoman" | "kode-etik" | "hak-jawab" | "koreksi"
  title: string;
  content: string; // HTML formatted string
  lastUpdated: string;
}

interface CompanyProfileProps {
  activePage: "about" | "redaksi" | "karir" | "kontak" | "iklan" | "pedoman" | "kode-etik" | "hak-jawab" | "koreksi";
  profiles: CompanyProfilePage[];
  onClose: () => void;
  onPageChange: (page: "about" | "redaksi" | "karir" | "kontak" | "iklan" | "pedoman" | "kode-etik" | "hak-jawab" | "koreksi") => void;
}

export default function CompanyProfile({
  activePage,
  profiles,
  onClose,
  onPageChange
}: CompanyProfileProps) {
  const currentPage = profiles.find(p => p.id === activePage) || {
    id: activePage,
    title: activePage === "about" ? "Tentang Kami" :
           activePage === "redaksi" ? "Susunan Redaksi" : 
           activePage === "karir" ? "Karir Wartawan" :
           activePage === "kontak" ? "Hubungi Kami" :
           activePage === "iklan" ? "Tarif Pemasangan Iklan" :
           activePage === "pedoman" ? "Pedoman Media Siber" :
           activePage === "kode-etik" ? "Kode Etik Jurnalistik" :
           activePage === "hak-jawab" ? "Hak Jawab Pembaca" : "Koreksi & Ralat Berita",
    content: "",
    lastUpdated: new Date().toISOString()
  };

  // State for Contact Form
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // State for Career Form
  const [careerName, setCareerName] = useState("");
  const [careerEmail, setCareerEmail] = useState("");
  const [careerPhone, setCareerPhone] = useState("");
  const [careerPosition, setCareerPosition] = useState("Wartawan Daerah (Majalengka)");
  const [careerCvLink, setCareerCvLink] = useState("");
  const [careerCoverLetter, setCareerCoverLetter] = useState("");
  const [careerSuccess, setCareerSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    }, 1000);
  };

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerName || !careerEmail || !careerPhone) return;
    setCareerSuccess(true);
    setTimeout(() => {
      setCareerName("");
      setCareerEmail("");
      setCareerPhone("");
      setCareerCvLink("");
      setCareerCoverLetter("");
    }, 1000);
  };

  const menuItems = [
    { id: "about" as const, title: "Tentang Kami", icon: ShieldCheck, color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
    { id: "redaksi" as const, title: "Susunan Redaksi", icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
    { id: "karir" as const, title: "Karir Wartawan", icon: Briefcase, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
    { id: "kontak" as const, title: "Hubungi Kami", icon: Mail, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" },
    { id: "iklan" as const, title: "Tarif Pemasangan Iklan", icon: Megaphone, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
    { id: "pedoman" as const, title: "Pedoman Media Siber", icon: Shield, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/30" },
    { id: "kode-etik" as const, title: "Kode Etik Jurnalistik", icon: Award, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30" },
    { id: "hak-jawab" as const, title: "Hak Jawab Pembaca", icon: FileText, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30" },
    { id: "koreksi" as const, title: "Koreksi & Ralat", icon: Clock, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar with back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Portal Berita
          </button>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
            Pembaruan Terakhir: {(() => {
              if (!currentPage.lastUpdated) return "-";
              try {
                const date = new Date(currentPage.lastUpdated);
                if (isNaN(date.getTime())) return currentPage.lastUpdated;
                return date.toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                });
              } catch (e) {
                return currentPage.lastUpdated;
              }
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">
                Informasi Perusahaan
              </h3>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        window.location.hash = item.id;
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? "bg-red-600 text-white shadow-sm" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? "bg-white/20 text-white" : item.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 opacity-75 ${isActive ? "translate-x-0.5" : "opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats / Info Widget */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Majalengka Post</h4>
                <p className="text-xs text-red-100 leading-relaxed mb-4">
                  Portal berita independen, terpercaya, dan tercepat menyajikan berita seputar Kabupaten Majalengka dan wilayah Jawa Barat.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-white bg-red-900/40 px-3 py-1.5 rounded-lg w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Terverifikasi Dewan Pers
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${
                  activePage === "about" ? "bg-red-100 text-red-600 dark:bg-red-950/30" :
                  activePage === "redaksi" ? "bg-blue-100 text-blue-600 dark:bg-blue-950/30" :
                  activePage === "karir" ? "bg-amber-100 text-amber-600 dark:bg-amber-950/30" :
                  activePage === "kontak" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30" :
                  activePage === "iklan" ? "bg-purple-100 text-purple-600 dark:bg-purple-950/30" :
                  activePage === "pedoman" ? "bg-teal-100 text-teal-600 dark:bg-teal-950/30" :
                  activePage === "kode-etik" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30" :
                  activePage === "hak-jawab" ? "bg-rose-100 text-rose-600 dark:bg-rose-950/30" :
                  "bg-orange-100 text-orange-600 dark:bg-orange-950/30"
                }`}>
                  {activePage === "about" && <ShieldCheck className="w-6 h-6" />}
                  {activePage === "redaksi" && <Users className="w-6 h-6" />}
                  {activePage === "karir" && <Briefcase className="w-6 h-6" />}
                  {activePage === "kontak" && <Mail className="w-6 h-6" />}
                  {activePage === "iklan" && <Megaphone className="w-6 h-6" />}
                  {activePage === "pedoman" && <Shield className="w-6 h-6" />}
                  {activePage === "kode-etik" && <Award className="w-6 h-6" />}
                  {activePage === "hak-jawab" && <FileText className="w-6 h-6" />}
                  {activePage === "koreksi" && <Clock className="w-6 h-6" />}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {currentPage.title}
                </h1>
              </div>

              {/* Company profile HTML content edited by CMS */}
              {activePage === "pedoman" ? (
                <PedomanMediaSiber />
              ) : activePage === "kode-etik" ? (
                <KodeEtik />
              ) : activePage === "hak-jawab" ? (
                <HakJawab />
              ) : activePage === "koreksi" ? (
                <Koreksi />
              ) : (
                <div 
                  className="prose prose-sm sm:prose max-w-none dark:prose-invert prose-red
                    prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
                    prose-a:text-red-600 dark:prose-a:text-red-400 hover:prose-a:underline
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-850/50 prose-blockquote:py-1 prose-blockquote:px-4"
                  dangerouslySetInnerHTML={{ __html: currentPage.content }}
                />
              )}

              {/* Dynamic Action Sections based on pages */}
              {activePage === "kontak" && (
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Kirim Pesan Langsung
                  </h3>

                  {contactSuccess ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-xl text-center space-y-3">
                      <div className="inline-flex p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-8 h-8 animate-bounce" />
                      </div>
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Pesan Berhasil Dikirim!</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500 max-w-md mx-auto">
                        Terima kasih telah menghubungi kami. Tim redaksi kami akan meninjau pesan Anda dan segera merespon dalam waktu maksimal 1x24 jam.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                          <input 
                            type="text" 
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Contoh: Radit Widjaya"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Email *</label>
                          <input 
                            type="email" 
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="Contoh: nama@domain.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subjek / Perihal</label>
                        <input 
                          type="text"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="Contoh: Penawaran Kerja Sama, Koreksi Berita"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pesan Anda *</label>
                        <textarea 
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tuliskan detail pertanyaan atau keluhan Anda di sini secara jelas..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        Kirim Pesan
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activePage === "karir" && (
                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Formulir Lamaran Cepat
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                    Kirimkan CV dan portofolio jurnalistik Anda untuk diproses oleh HRD PT Majalengka Post Media.
                  </p>

                  {careerSuccess ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-xl text-center space-y-3">
                      <div className="inline-flex p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-8 h-8 animate-bounce" />
                      </div>
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Lamaran Terkirim!</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500 max-w-md mx-auto">
                        Lamaran Anda telah kami terima secara elektronik. Jika profil Anda memenuhi kriteria kebutuhan redaksi, tim rekrutmen kami akan menghubungi Anda via email atau WhatsApp.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleCareerSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Pelamar *</label>
                          <input 
                            type="text" 
                            required
                            value={careerName}
                            onChange={(e) => setCareerName(e.target.value)}
                            placeholder="Contoh: Sarah Anindita"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Email *</label>
                          <input 
                            type="email" 
                            required
                            value={careerEmail}
                            onChange={(e) => setCareerEmail(e.target.value)}
                            placeholder="sarah@domain.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor WhatsApp *</label>
                          <input 
                            type="tel" 
                            required
                            value={careerPhone}
                            onChange={(e) => setCareerPhone(e.target.value)}
                            placeholder="0812xxxxxxxx"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Posisi yang Dilamar *</label>
                          <select 
                            value={careerPosition}
                            onChange={(e) => setCareerPosition(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          >
                            <option>Wartawan Daerah (Majalengka)</option>
                            <option>Wartawan Daerah (Kuningan / Indramayu)</option>
                            <option>Editor Konten & Copywriter</option>
                            <option>Fotografer & Jurnalis Foto</option>
                            <option>Social Media Specialist</option>
                            <option>Videografer & Editor Video</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tautan CV & Portofolio (Google Drive/Dropbox) *</label>
                          <input 
                            type="url" 
                            required
                            value={careerCvLink}
                            onChange={(e) => setCareerCvLink(e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Surat Pengantar / Motivasi</label>
                        <textarea 
                          rows={3}
                          value={careerCoverLetter}
                          onChange={(e) => setCareerCoverLetter(e.target.value)}
                          placeholder="Ceritakan singkat mengapa Anda tertarik bergabung dengan Majalengka Post..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4" />
                        Kirim Lamaran Pekerjaan
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
