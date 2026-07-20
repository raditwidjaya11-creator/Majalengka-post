import React, { useState } from "react";
import { Mail, Shield, Download, Rss, Globe, Award, CheckCircle2, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-900 mt-12">
      
      {/* 1. Upper Footer: Newsletter & App Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Newsletter Signup */}
        <div className="lg:col-span-7">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-red-500" />
            Dapatkan Berita Pilihan Langsung di Email Anda
          </h3>
          <p className="text-xs text-gray-400 max-w-lg mb-4">
            Berlangganan newsletter harian Majalengka Post untuk rangkuman berita terpopuler, analisis mendalam, serta laporan eksklusif redaksi secara gratis.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
            <input
              id="input-newsletter-email"
              type="email"
              placeholder="Ketik email Anda..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full flex-1 text-sm bg-gray-900 border border-gray-800 focus:border-red-600 rounded-xl px-4 py-3 text-gray-200 outline-none min-h-[48px]"
            />
            <button
              id="btn-newsletter-submit"
              type="submit"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-3 rounded-xl whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 min-h-[48px]"
            >
              <span>Berlangganan</span>
            </button>
          </form>
          {subscribed && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Terima kasih! Email Anda telah terdaftar dalam sistem newsletter kami.</span>
            </div>
          )}
        </div>

        {/* Mobile App Promotion Badges */}
        <div className="lg:col-span-5 flex flex-col md:items-end justify-center">
          <span className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1">
            <Download className="w-4 h-4 text-red-500" />
            BACA LEBIH CEPAT DI SMARTPHONE ANDA
          </span>
          <div className="flex flex-wrap gap-3 w-full md:justify-end">
            <a
              href="#download-android"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 transition-colors min-h-[48px]"
            >
              <div className="text-left">
                <p className="text-[9px] text-gray-400 uppercase leading-none">Download on</p>
                <p className="text-xs font-bold text-white mt-1">Google Play</p>
              </div>
            </a>
            <a
              href="#download-ios"
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 transition-colors min-h-[48px]"
            >
              <div className="text-left">
                <p className="text-[9px] text-gray-400 uppercase leading-none">Download on</p>
                <p className="text-xs font-bold text-white mt-1">App Store</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Middle Footer: Sitemap Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        
        {/* Brand Column */}
        <div className="sm:col-span-2">
          <h4 className="text-xl font-black text-white uppercase tracking-tighter">
            MAJALENGKA<span className="text-red-500"> POST</span>
          </h4>
          <p className="text-xs text-gray-400 mt-3 leading-relaxed max-w-sm">
            Majalengka Post adalah portal berita daerah Jawa Barat masa kini yang menyajikan berita aktual, investigatif, kredibel, dan berimbang. Kami menggabungkan jurnalisme profesional dengan teknologi kecerdasan buatan terdepan guna mendukung akselerasi informasi siber lokal dan nasional.
          </p>
          
          {/* Social Media Row - aligned horizontally */}
          <div className="flex items-center gap-3 mt-5">
            <a href="#facebook" className="p-2.5 bg-gray-900 hover:bg-red-600 hover:text-white rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-800" title="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#twitter" className="p-2.5 bg-gray-900 hover:bg-red-600 hover:text-white rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-800" title="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#instagram" className="p-2.5 bg-gray-900 hover:bg-red-600 hover:text-white rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-800" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#youtube" className="p-2.5 bg-gray-900 hover:bg-red-600 hover:text-white rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-800" title="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3 mt-4 text-[11px] text-gray-500 font-mono">
            <Globe className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>AJI & Dewan Pers Terverifikasi</span>
          </div>
        </div>

        {/* Categories Link Columns - vertical links with minimum tap height */}
        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
            Rekomendasi
          </h5>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li><a href="#politik" className="block py-1.5 hover:text-white transition-colors">Politik & Hukum</a></li>
            <li><a href="#ekonomi" className="block py-1.5 hover:text-white transition-colors">Bisnis & Finansial</a></li>
            <li><a href="#teknologi" className="block py-1.5 hover:text-white transition-colors">Teknologi & AI</a></li>
            <li><a href="#travel" className="block py-1.5 hover:text-white transition-colors">Sektor Pariwisata</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
            Tentang Kami
          </h5>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li><a href="#about" className="block py-1.5 hover:text-white transition-colors">Tentang Kami</a></li>
            <li><a href="#redaksi" className="block py-1.5 hover:text-white transition-colors">Redaksi & Tim</a></li>
            <li><a href="#kontak" className="block py-1.5 hover:text-white transition-colors">Kontak Hubungi Kami</a></li>
            <li><a href="#iklan" className="block py-1.5 hover:text-white transition-colors">Pemasangan Iklan</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
            Pedoman & Etik
          </h5>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li><a href="#pedoman" className="block py-1.5 hover:text-white transition-colors">Pedoman Media Siber</a></li>
            <li><a href="#kode-etik" className="block py-1.5 hover:text-white transition-colors">Kode Etik Jurnalistik</a></li>
            <li><a href="#hak-jawab" className="block py-1.5 hover:text-white transition-colors">Hak Jawab Pembaca</a></li>
            <li><a href="#koreksi" className="block py-1.5 hover:text-white transition-colors">Koreksi & Ralat Berita</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
            Layanan Hukum
          </h5>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li><a href="/terms" className="block py-1.5 hover:text-white transition-colors">Persyaratan Layanan</a></li>
            <li><a href="/privacy-policy" className="block py-1.5 hover:text-white transition-colors">Kebijakan Privasi</a></li>
            <li><a href="#sitemap" className="block py-1.5 hover:text-white transition-colors">Sitemap XML</a></li>
            <li><a href="#rss" className="py-1.5 hover:text-white transition-colors flex items-center gap-1">
              <Rss className="w-3 h-3 text-amber-500" />
              Sindikasi RSS Feed
            </a></li>
          </ul>
        </div>
      </div>

      {/* 3. Lower Footer: Copyrights & Trust badges */}
      <div className="bg-gray-950 border-t border-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-500 text-center md:text-left">
            © 2026 PT Majalengka Post Media. Seluruh Hak Cipta Dilindungi. Seluruh artikel, foto, dan grafis dilindungi undang-undang hak cipta.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-500">
            <a href="/privacy-policy" className="hover:text-gray-400 flex items-center gap-1 py-1">
              <Shield className="w-3.5 h-3.5 text-gray-600" />
              Kebijakan Privasi
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="/terms" className="hover:text-gray-400 py-1 text-center sm:text-left">Persyaratan Layanan</a>
            <span className="hidden sm:inline">•</span>
            <a href="#pedoman" className="hover:text-gray-400 py-1 text-center sm:text-left">Pedoman Media Siber</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
