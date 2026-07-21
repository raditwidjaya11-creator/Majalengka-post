import React, { useState } from "react";
import { 
  Plus, Edit, Trash2, Eye, Calendar, Sparkles, Check, X, Image as ImageIcon,
  Sliders, Monitor, Smartphone, Clock, Layout, RefreshCw, Upload, Link as LinkIcon,
  Play, ShieldAlert, Layers, Move, ArrowUpRight
} from "lucide-react";
import { OpeningBanner, OpeningBannerPosition, OpeningBannerAnimation, OpeningBannerPageTarget, OpeningBannerInterval } from "../types";
import OpeningBannerModal from "./OpeningBannerModal";

interface OpeningBannerManagerProps {
  banners: OpeningBanner[];
  onSaveBanner: (banner: OpeningBanner) => Promise<void>;
  onDeleteBanner: (id: string) => Promise<void>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
}

export default function OpeningBannerManager({
  banners,
  onSaveBanner,
  onDeleteBanner,
  onToggleActive
}: OpeningBannerManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<OpeningBanner | null>(null);
  const [previewingBanner, setPreviewingBanner] = useState<OpeningBanner | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");

  // Form State
  const [formData, setFormData] = useState<Partial<OpeningBanner>>({
    id: "",
    title: "Promo Spesial Hari Ini",
    subtitle: "Dapatkan akses berita eksklusif dan promo berlangganan Majalengka Post.",
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
    buttonText: "Baca Selengkapnya",
    buttonLink: "#",
    isActive: true,
    status: "published",
    startDate: "",
    endDate: "",
    displayPosition: "center",
    animation: "zoom",
    animationDuration: 0.4,
    overlayColor: "#000000",
    overlayOpacity: 0.65,
    displayInterval: "always",
    showOnce: false,
    pageTarget: "all",
    sortOrder: 1
  });

  const handleCreateNew = () => {
    setSelectedBanner(null);
    setFormData({
      id: `banner-opening-${Date.now()}`,
      title: "",
      subtitle: "",
      imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
      buttonText: "Baca Selengkapnya",
      buttonLink: "#",
      isActive: true,
      status: "published",
      startDate: "",
      endDate: "",
      displayPosition: "center",
      animation: "zoom",
      animationDuration: 0.4,
      overlayColor: "#000000",
      overlayOpacity: 0.65,
      displayInterval: "always",
      showOnce: false,
      pageTarget: "all",
      sortOrder: (banners.length || 0) + 1
    });
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleEdit = (banner: OpeningBanner) => {
    setSelectedBanner(banner);
    setFormData({ ...banner });
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert("Judul banner wajib diisi.");
      return;
    }
    if (!formData.imageUrl?.trim()) {
      alert("Gambar banner wajib diunggah atau diisi URL-nya.");
      return;
    }

    setIsSaving(true);
    try {
      const bannerToSave: OpeningBanner = {
        id: formData.id || `banner-opening-${Date.now()}`,
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim() || "",
        imageUrl: formData.imageUrl.trim(),
        buttonText: formData.buttonText?.trim() || "Baca Selengkapnya",
        buttonLink: formData.buttonLink?.trim() || "#",
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        status: formData.status || "published",
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        displayPosition: (formData.displayPosition as OpeningBannerPosition) || "center",
        animation: (formData.animation as OpeningBannerAnimation) || "zoom",
        animationDuration: Number(formData.animationDuration || 0.4),
        overlayColor: formData.overlayColor || "#000000",
        overlayOpacity: Number(formData.overlayOpacity !== undefined ? formData.overlayOpacity : 0.65),
        displayInterval: (formData.displayInterval as OpeningBannerInterval) || "always",
        showOnce: !!formData.showOnce,
        pageTarget: (formData.pageTarget as OpeningBannerPageTarget) || "all",
        sortOrder: Number(formData.sortOrder || 1),
        createdAt: selectedBanner?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSaveBanner(bannerToSave);
      setIsEditing(false);
      setActiveTab("list");
      alert("Banner Pembuka berhasil disimpan!");
    } catch (err: any) {
      console.error("Gagal menyimpan banner:", err);
      alert(`Gagal menyimpan banner: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus banner "${title}"?`)) {
      try {
        await onDeleteBanner(id);
      } catch (err: any) {
        alert(`Gagal menghapus banner: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CMS Redaksi • Modul Banner Pembuka</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Floating Opening Banner / Splash Promo
            </h2>
            <p className="mt-1 text-sm sm:text-base text-white/90 max-w-2xl font-light">
              Kelola banner mengambang (splash promo) yang muncul saat pengunjung membuka portal. Dilengkapi efek backdrop blur, animasi halus, dan penjadwalan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "list" ? (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-red-600 hover:bg-red-50 font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Banner Baru</span>
              </button>
            ) : (
              <button
                onClick={() => { setActiveTab("list"); setIsEditing(false); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-medium text-sm backdrop-blur-md transition-all"
              >
                <X className="w-4 h-4" />
                <span>Kembali ke Daftar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => { setActiveTab("list"); setIsEditing(false); }}
          className={`px-5 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "list"
              ? "border-red-600 text-red-600 dark:text-red-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Daftar Banner Pembuka ({banners.length})</span>
        </button>

        {isEditing && (
          <button
            onClick={() => setActiveTab("form")}
            className={`px-5 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "form"
                ? "border-red-600 text-red-600 dark:text-red-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{selectedBanner ? "Edit Banner" : "Buat Banner Baru"}</span>
          </button>
        )}
      </div>

      {/* TAB 1: LIST BANNERS */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-850 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Belum Ada Banner Pembuka
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Buat banner promo mengambang pertama Anda untuk menyapa pembaca saat pertama kali membuka website.
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Banner Pembuka</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                          banner.isActive
                            ? "bg-emerald-500/90 text-white"
                            : "bg-gray-500/90 text-white"
                        }`}>
                          {banner.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md uppercase">
                          {banner.pageTarget === "all" ? "Semua Halaman" : banner.pageTarget}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 text-gray-900 dark:bg-gray-900/90 dark:text-white shadow-sm backdrop-blur-md">
                        Urutan #{banner.sortOrder || 1}
                      </div>
                    </div>

                    {/* Info Body */}
                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">
                        {banner.title}
                      </h4>
                      {banner.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {banner.subtitle}
                        </p>
                      )}

                      <div className="pt-2 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                          <Layout className="w-3.5 h-3.5" />
                          <span>Posisi: {banner.displayPosition}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Animasi: {banner.animation}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Tampil: {banner.displayInterval}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewingBanner(banner)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 font-semibold text-xs transition-colors"
                      title="Uji Tampil / Live Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Uji Tampil</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleActive(banner.id, !banner.isActive)}
                        className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                          banner.isActive
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                        title={banner.isActive ? "Nonaktifkan Banner" : "Aktifkan Banner"}
                      >
                        {banner.isActive ? "Matikan" : "Aktifkan"}
                      </button>

                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                        title="Edit Banner"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
                        title="Hapus Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FORM EDITOR */}
      {activeTab === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Form Inputs */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Sliders className="w-5 h-5 text-red-600" />
              <span>Konfigurasi Banner Pembuka</span>
            </h3>

            {/* 1. Status & Target Page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status Banner
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActiveToggle" className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer select-none">
                    {formData.isActive ? "Aktif Tayang" : "Nonaktif (Draft)"}
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pilih Halaman Target
                </label>
                <select
                  value={formData.pageTarget || "all"}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageTarget: e.target.value as OpeningBannerPageTarget }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="all">Semua Halaman</option>
                  <option value="home">Halaman Utama (Home)</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="article">Halaman Artikel Detail</option>
                </select>
              </div>
            </div>

            {/* 2. Judul & Sub Judul */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Judul Banner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Misal: Promo Merdeka Majalengka Post"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Sub Judul / Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Penjelasan singkat mengenai promo atau pesan pembuka..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none resize-none"
                />
              </div>
            </div>

            {/* 3. Upload Gambar Banner */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Gambar Banner <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setUploadMode("upload")}
                    className={`px-2.5 py-1 rounded-lg ${uploadMode === "upload" ? "bg-red-600 text-white font-bold" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`px-2.5 py-1 rounded-lg ${uploadMode === "url" ? "bg-red-600 text-white font-bold" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
                  >
                    URL Gambar
                  </button>
                </div>
              </div>

              {uploadMode === "upload" ? (
                <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Format didukung: <strong>JPG, PNG, WebP</strong> (Maksimal 8MB)
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="bannerImageFileInput"
                  />
                  <label
                    htmlFor="bannerImageFileInput"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Pilih File Gambar
                  </label>
                </div>
              ) : (
                <input
                  type="url"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://domain.com/gambar-banner.jpg"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              )}
            </div>

            {/* 4. Tombol CTA & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Teks Tombol
                </label>
                <input
                  type="text"
                  value={formData.buttonText || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Contoh: Baca Selengkapnya"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Link Tombol (URL)
                </label>
                <input
                  type="text"
                  value={formData.buttonLink || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="Contoh: https://... atau #terbaru"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
            </div>

            {/* 5. Jadwal Tayang */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <Calendar className="w-4 h-4 text-red-600" />
                <span>Jadwal Tayang Banner (Opsional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Tanggal Mulai
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value ? new Date(e.target.value).toISOString() : "" }))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Tanggal Berakhir
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value).toISOString() : "" }))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            {/* 6. Desain, Animasi, Posisi & Overlay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Posisi Floating
                </label>
                <select
                  value={formData.displayPosition || "center"}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayPosition: e.target.value as OpeningBannerPosition }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="center">Tengah Layar (Modal Central)</option>
                  <option value="bottom_right">Kanan Bawah</option>
                  <option value="bottom_left">Kiri Bawah</option>
                  <option value="fullscreen">Layar Penuh (Full Screen)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Efek Animasi
                </label>
                <select
                  value={formData.animation || "zoom"}
                  onChange={(e) => setFormData(prev => ({ ...prev, animation: e.target.value as OpeningBannerAnimation }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="zoom">Zoom In (Membesar Halus)</option>
                  <option value="fade">Fade In (Memudar)</option>
                  <option value="slide_up">Slide Up (Geser Ke Atas)</option>
                  <option value="bounce">Bounce (Membal Memikat)</option>
                </select>
              </div>
            </div>

            {/* Overlay Color & Opacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Warna Backdrop Overlay</span>
                  <span className="font-mono text-xs">{formData.overlayColor || "#000000"}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.overlayColor || "#000000"}
                    onChange={(e) => setFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-600"
                  />
                  <div className="flex items-center gap-1.5">
                    {["#000000", "#0f172a", "#1e1b4b", "#022c22", "#450a0a"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, overlayColor: c }))}
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Kegelapan Overlay (Opacity)</span>
                  <span className="font-mono text-xs">{Math.round((formData.overlayOpacity ?? 0.65) * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.overlayOpacity ?? 0.65}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            </div>

            {/* 7. Frekuensi & Urutan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Frekuensi Kemunculan
                </label>
                <select
                  value={formData.displayInterval || "always"}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayInterval: e.target.value as OpeningBannerInterval }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                >
                  <option value="always">Selalu Tampil Setiap Reload</option>
                  <option value="1h">Setiap 1 Jam Sekali</option>
                  <option value="6h">Setiap 6 Jam Sekali</option>
                  <option value="12h">Setiap 12 Jam Sekali</option>
                  <option value="24h">Setiap 24 Jam Sekali</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Urutan Tampil (Sort Order)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sortOrder || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 1 }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setPreviewingBanner(formData as OpeningBanner)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400 font-bold text-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Uji Tampil (Live Preview)</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveTab("list"); setIsEditing(false); }}
                  className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Simpan Banner Pembuka</span>
                </button>
              </div>
            </div>
          </form>

          {/* Right Side: Live Device Preview Simulation */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-600" />
                <span>Pratinjau Tampilan Modal</span>
              </h4>

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${previewDevice === "desktop" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${previewDevice === "mobile" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500"}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Simulated Canvas */}
            <div className={`mx-auto transition-all duration-300 bg-gray-900/90 rounded-2xl p-4 min-h-[360px] flex items-center justify-center relative overflow-hidden border border-gray-800 ${
              previewDevice === "mobile" ? "max-w-[300px]" : "w-full"
            }`}>
              {/* Card Preview inside Canvas */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 w-full text-left">
                <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                  <img
                    src={formData.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center text-xs">
                    ✕
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h5 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                    {formData.title || "Judul Banner Pembuka"}
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {formData.subtitle || "Sub judul penjelasan promo singkat akan muncul di sini."}
                  </p>
                  <div className="pt-2">
                    <div className="w-full py-2 px-3 rounded-lg bg-red-600 text-white text-xs font-bold text-center">
                      {formData.buttonText || "Baca Selengkapnya"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Klik tombol <strong className="text-indigo-600 dark:text-indigo-400">"Uji Tampil"</strong> di atas untuk mencoba modal interaktif penuh dengan animasi secara langsung.
            </p>
          </div>
        </div>
      )}

      {/* Live Preview Interactive Overlay Modal */}
      {previewingBanner && (
        <OpeningBannerModal
          banners={[]}
          previewBanner={previewingBanner}
          onClosePreview={() => setPreviewingBanner(null)}
        />
      )}
    </div>
  );
}
