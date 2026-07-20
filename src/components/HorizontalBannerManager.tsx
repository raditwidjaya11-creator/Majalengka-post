import React, { useState, useRef } from "react";
import { Upload, Link2, Eye, MousePointerClick, Trash2, Edit2, Play, Pause, Sparkles, Image as ImageIcon } from "lucide-react";
import { AdBanner } from "../types";

interface HorizontalBannerManagerProps {
  banners: AdBanner[];
  onAddBanner: (banner: AdBanner) => void;
  onUpdateBanner: (banner: AdBanner) => void;
  onDeleteBanner: (id: string) => void;
}

// Beautiful preset horizontal images from Unsplash (Landscape 1200x120 or 1200x200)
const PRESET_BANNERS = [
  {
    title: "Pesona Terasering Panyaweuyan - Tiket Spesial Wisata Majalengka",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&h=150&auto=format&fit=crop",
    adUrl: "https://wisata.majalengkakab.go.id/panyaweuyan"
  },
  {
    title: "Festival Kuliner Khas Majalengka 2026 - Diskon Kuliner up to 50%",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&h=150&auto=format&fit=crop",
    adUrl: "https://kuliner.majalengkakab.go.id"
  },
  {
    title: "Promo Terbatas: Gadget Store Majalengka - Cicilan 0% Seluruh Produk",
    imageUrl: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1200&h=150&auto=format&fit=crop",
    adUrl: "https://gadget-majalengka.com"
  },
  {
    title: "Universitas Majalengka - Pendaftaran Mahasiswa Baru Gelombang 2",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&h=150&auto=format&fit=crop",
    adUrl: "https://unma.ac.id/pmb"
  }
];

export default function HorizontalBannerManager({
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
}: HorizontalBannerManagerProps) {
  const horizontalBanners = banners.filter(b => b.position === "header");

  const [editingBanner, setEditingBanner] = useState<AdBanner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState({
    title: "",
    adUrl: "",
    imageUrl: "",
    active: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const triggerLocalMessage = (msg: string) => {
    setLocalMessage(msg);
    setTimeout(() => {
      setLocalMessage(prev => prev === msg ? null : prev);
    }, 4500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        triggerLocalMessage("Harap pilih file gambar!");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormState(prev => ({
            ...prev,
            imageUrl: event.target!.result as string
          }));
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        triggerLocalMessage("Gagal membaca file gambar!");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset: typeof PRESET_BANNERS[0]) => {
    setFormState(prev => ({
      ...prev,
      title: preset.title,
      adUrl: preset.adUrl,
      imageUrl: preset.imageUrl,
    }));
  };

  const handleEditClick = (banner: AdBanner) => {
    setEditingBanner(banner);
    setFormState({
      title: banner.title,
      adUrl: banner.adUrl,
      imageUrl: banner.imageUrl || "",
      active: banner.active,
    });
    setShowForm(true);
  };

  const handleOpenCreateForm = () => {
    setEditingBanner(null);
    setFormState({
      title: "",
      adUrl: "",
      imageUrl: "",
      active: true,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      triggerLocalMessage("Harap masukkan judul iklan!");
      return;
    }
    if (!formState.imageUrl.trim()) {
      triggerLocalMessage("Harap upload gambar banner atau gunakan preset!");
      return;
    }
    if (!formState.adUrl.trim()) {
      triggerLocalMessage("Harap masukkan link target iklan!");
      return;
    }

    if (editingBanner) {
      // Edit existing
      onUpdateBanner({
        ...editingBanner,
        title: formState.title,
        adUrl: formState.adUrl,
        imageUrl: formState.imageUrl,
        active: formState.active,
      });
    } else {
      // Add new
      const newBanner: AdBanner = {
        id: `banner-horizontal-${Date.now()}`,
        title: formState.title,
        position: "header",
        type: "internal",
        adUrl: formState.adUrl,
        imageUrl: formState.imageUrl,
        views: 0,
        clicks: 0,
        active: formState.active,
      };
      onAddBanner(newBanner);
    }

    setShowForm(false);
    setEditingBanner(null);
  };

  return (
    <div id="horizontal-banner-manager" className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl space-y-6 shadow-sm">
      {localMessage && (
        <div className="bg-red-50 dark:bg-red-950/45 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold flex items-center justify-between z-20 shadow-sm">
          <span>{localMessage}</span>
          <button onClick={() => setLocalMessage(null)} className="text-red-400 hover:text-red-600 p-1">✕</button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-4">
        <div>
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="bg-red-500 text-white p-1 rounded-md">
              <ImageIcon className="w-4 h-4" />
            </span>
            Pengelola Banner Rotasi Horizontal (Header)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Atur iklan horizontal teratas yang berotasi otomatis di portal publik. Lengkap dengan upload gambar, penautan, dan pemantauan statistik tayangan.
          </p>
        </div>
        {!showForm && (
          <button
            id="btn-open-ad-form"
            type="button"
            onClick={handleOpenCreateForm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tambah Banner Rotasi</span>
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in bg-gray-50 dark:bg-gray-950/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-gray-800 dark:text-gray-300 uppercase tracking-widest">
              {editingBanner ? "Edit Detail Iklan Horizontal" : "Buat Iklan Horizontal Baru"}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Fields Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Judul Banner / Kampanye Iklan
                </label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={e => setFormState(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 px-3 py-2 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                  placeholder="e.g. Promo Ramadhan Berkah Majalengka"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  URL Link Target (Redirect)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Link2 className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={formState.adUrl}
                    onChange={e => setFormState(prev => ({ ...prev, adUrl: e.target.value }))}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-850 pl-9 pr-3 py-2 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-900 dark:text-white"
                    placeholder="https://example.com/kampanye-majalengka"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white dark:bg-gray-900 p-3.5 rounded-lg border border-gray-200 dark:border-gray-850">
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Publikasi</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Aktifkan untuk langsung menampilkan banner ini dalam antrean rotasi.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState(prev => ({ ...prev, active: !prev.active }))}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                    formState.active ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      formState.active ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right Upload Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Gambar Banner (Upload File)
                </label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-5 text-center flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-2 min-h-[140px]">
                  {isUploading ? (
                    <div className="text-xs text-gray-400 animate-pulse">Sedang membaca file gambar...</div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                      <div className="text-center space-y-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Drag & drop berkas gambar Anda, atau</span>
                        <label className="text-xs text-red-600 hover:text-red-500 font-extrabold cursor-pointer hover:underline inline-block">
                          Pilih File Komputer
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-[9px] text-gray-400">Rekomendasi rasio landscape panjang (misal: 1200x150 px)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Presets Option */}
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  Atau Gunakan Template Premium Majalengka:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_BANNERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectPreset(preset)}
                      className="border border-gray-150 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 bg-white dark:bg-gray-900 p-1.5 rounded-lg text-left text-[10px] hover:shadow-sm transition-all overflow-hidden flex items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-10 h-7 shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-800">
                        <img src={preset.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-bold truncate flex-1">{preset.title.split("-")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Live Real-time Preview */}
          {formState.imageUrl && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Live Preview Banner Terpasang (Skala Responsif)
                </span>
              </div>
              <a href={formState.adUrl || "#"} target="_blank" rel="noreferrer" className="block w-full border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-gray-950/40 shadow-xs hover:opacity-95 transition-all">
                <img src={formState.imageUrl} alt={formState.title} className="w-full object-cover max-h-[100px]" />
              </a>
              <p className="text-[10px] text-gray-400 italic font-mono truncate">Target Link: {formState.adUrl || "belum diset"}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800/80 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingBanner(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {editingBanner ? "Simpan Perubahan" : "Terbitkan Banner"}
            </button>
          </div>
        </form>
      ) : (
        /* Grid list of active horizontal banners */
        <div className="space-y-4">
          {horizontalBanners.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-150 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-950/20">
              <ImageIcon className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Belum Ada Banner Horizontal Terdaftar</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">Klik tombol tambah banner untuk mengunggah gambar promosi horizontal atau memuat template Unsplash.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {horizontalBanners.map((banner) => {
                const isDown = banner.clicks > 0 && banner.views > 0;
                const ctr = isDown ? ((banner.clicks / banner.views) * 100).toFixed(2) : "0.00";
                return (
                  <div
                    key={banner.id}
                    className="border border-gray-150 dark:border-gray-850 hover:border-gray-200 dark:hover:border-gray-800 rounded-xl p-4 bg-white dark:bg-gray-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-xs group"
                  >
                    {/* Left info & image */}
                    <div className="flex items-start md:items-center gap-4 flex-1 w-full min-w-0">
                      <div className="w-24 sm:w-28 h-12 rounded overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shrink-0 relative">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-white dark:border-gray-900 ${
                          banner.active ? "bg-emerald-500" : "bg-gray-300"
                        }`} />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            banner.active
                              ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          }`}>
                            {banner.active ? "Aktif" : "Nonaktif"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono truncate">{banner.id}</span>
                        </div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate" title={banner.title}>
                          {banner.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 truncate">
                          <Link2 className="w-3 h-3 shrink-0" />
                          <span className="font-mono truncate">{banner.adUrl}</span>
                        </div>
                      </div>
                    </div>

                    {/* Statistics counters */}
                    <div className="flex items-center gap-6 self-end md:self-center bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-150 dark:border-gray-850 text-[11px] font-mono shrink-0">
                      <div className="text-center px-1">
                        <span className="text-[9px] text-gray-400 uppercase font-sans block mb-0.5">Views</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {banner.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-center px-1 border-l border-gray-200 dark:border-gray-800">
                        <span className="text-[9px] text-gray-400 uppercase font-sans block mb-0.5">Clicks</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1">
                          <MousePointerClick className="w-3 h-3 text-emerald-500" />
                          {banner.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-center px-1 border-l border-gray-200 dark:border-gray-800">
                        <span className="text-[9px] text-gray-400 uppercase font-sans block mb-0.5">CTR</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{ctr}%</span>
                      </div>
                    </div>

                    {/* Actions list */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 border-gray-100 dark:border-gray-850 pt-3 md:pt-0 w-full md:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateBanner({ ...banner, active: !banner.active });
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          banner.active 
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        title={banner.active ? "Klik untuk Nonaktifkan" : "Klik untuk Aktifkan"}
                      >
                        {banner.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditClick(banner)}
                        className="p-1.5 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus banner "${banner.title}"?`)) {
                            onDeleteBanner(banner.id);
                          }
                        }}
                        className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Hapus Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
