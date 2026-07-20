import React, { useState } from "react";
import { Search, Flame, ShieldAlert, MonitorPlay, Moon, Sun, Menu, X, Radio, Newspaper, Lock, Unlock, KeyRound, Bell, BellRing } from "lucide-react";
import { motion } from "motion/react";
import { CATEGORIES } from "../mockData";
import { UserRole, ValasRate } from "../types";
import logoImg from "../assets/images/majalengka_post_logo_1783851016975.jpg";

interface HeaderNavProps {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onToggleAdmin: () => void;
  isAdminView: boolean;
  breakingNewsList: string[];
  isRedaksiUnlocked?: boolean;
  onLockRedaksi?: () => void;
  onOpenUnlockModal?: () => void;
  valasRates: ValasRate[];
  isSubscribed: boolean;
  notificationPermission: "default" | "granted" | "denied" | "unsupported";
  onToggleNotifications: () => void;
  onWatchLiveStream?: () => void;
}

export default function HeaderNav({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  activeRole,
  onSelectRole,
  onToggleAdmin,
  isAdminView,
  breakingNewsList,
  isRedaksiUnlocked = false,
  onLockRedaksi,
  onOpenUnlockModal,
  valasRates,
  isSubscribed,
  notificationPermission,
  onToggleNotifications,
  onWatchLiveStream,
}: HeaderNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 z-50 shadow-sm"
    >
      
      {/* 2. Brand & Utility Header (High Density style) */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mobile menu toggle & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Logo (Left) */}
          <div className="flex flex-col cursor-pointer select-none shrink-0" onClick={() => onSelectCategory("")}>
            <div className="flex items-center gap-2">
              <img
                src={logoImg}
                className="w-10 h-10 object-contain rounded-full border-2 border-red-700 bg-white shadow-sm"
                alt="Majalengka Post Logo"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-red-700 dark:text-red-500 tracking-tighter leading-none uppercase">
                MAJALENGKA<span className="text-slate-900 dark:text-white"> POST</span>
              </h1>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.15em] uppercase mt-1">
              Suara Rakyat Majalengka • Terpercaya • Akurat
            </span>
            
            {/* LIVE STREAMING & Tanggal precisely below slogan */}
            <div className="flex items-center gap-2.5 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onWatchLiveStream}
                className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-red-600 dark:text-red-400 transition-all duration-250 shadow-xs cursor-pointer"
                title="Tonton Live Streaming"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                <span>LIVE STREAMING</span>
              </button>
              <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Hamburger (Right) */}
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 focus:outline-none p-2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Global Search (Desktop - center aligned) */}
        <div className="flex-1 max-w-md mx-6 lg:mx-12 hidden md:block w-full">
          <div className="relative">
            <input
              id="input-global-search"
              type="text"
              placeholder="Cari berita, tokoh, atau peristiwa..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border-none rounded-lg py-2.5 pl-4 pr-10 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>
        </div>

        {/* Financial Tickers and Actions */}
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-end w-full md:w-auto">
          {/* IHSG & USD/IDR */}
          <div className="flex gap-4 pr-4 border-r border-slate-200 dark:border-slate-800 text-[11px] font-bold">
            <div className="text-right">
              <div className="text-[9px] text-slate-400 uppercase">IHSG</div>
              <div className="text-xs font-bold text-green-600">7,215.12 (+0.45%)</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-400 uppercase">USD/IDR</div>
              <div className="text-xs font-bold text-red-600">16,245.00</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark / Light Toggle */}
            <button
              id="btn-dark-mode"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Ubah Tema"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell Toggle */}
            {notificationPermission !== "unsupported" && (
              <button
                id="btn-push-notifications"
                onClick={onToggleNotifications}
                className={`p-2 rounded-lg border transition-colors relative ${
                  isSubscribed && notificationPermission === "granted"
                    ? "border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
                    : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                title={
                  isSubscribed && notificationPermission === "granted"
                    ? "Notifikasi Artikel Baru Aktif"
                    : "Aktifkan Notifikasi Artikel Baru"
                }
              >
                {isSubscribed && notificationPermission === "granted" ? (
                  <BellRing className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                  isSubscribed && notificationPermission === "granted" ? "bg-red-600" : "bg-gray-400"
                }`} />
              </button>
            )}

            {isRedaksiUnlocked ? (
              <>
                {/* Role dropdown trigger (only shown to unlocked editors) */}
                <div className="relative">
                  <button
                    id="btn-role-dropdown"
                    onClick={() => setShowRolesDropdown(!showRolesDropdown)}
                    className="flex items-center gap-1.5 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold px-2.5 py-2 rounded-lg text-gray-800 dark:text-gray-200 border border-slate-200 dark:border-slate-700"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span className="max-w-[70px] lg:max-w-none truncate capitalize">
                      Role: {activeRole.toLowerCase().replace("_", " ")}
                    </span>
                  </button>
                  {showRolesDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50">
                      <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Role Redaksi</p>
                      </div>
                      <div className="max-h-60 overflow-y-auto p-1 grid grid-cols-1">
                        {Object.values(UserRole).map((role) => (
                          <button
                            key={role}
                            id={`btn-select-role-${role.toLowerCase()}`}
                            onClick={() => {
                              onSelectRole(role);
                              setShowRolesDropdown(false);
                            }}
                            className={`text-left text-xs px-3 py-2 rounded transition-colors ${
                              activeRole === role
                                ? "bg-slate-100 dark:bg-slate-800 text-red-600 font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {role.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View switcher (only shown to unlocked editors) */}
                <button
                  id="btn-toggle-view"
                  onClick={onToggleAdmin}
                  className="flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-lg shadow-sm transition-all text-white hover:opacity-90"
                  style={{
                    backgroundColor: isAdminView ? "var(--primary-color, #DC2626)" : "#1E293B",
                  }}
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  <span>{isAdminView ? "Lihat Portal" : "CMS Redaksi"}</span>
                </button>

                {/* Lock Editorial Access button */}
                <button
                  onClick={onLockRedaksi}
                  className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-900 flex items-center gap-1.5 text-xs font-bold"
                  title="Kunci Panel Redaksi (Kembali ke Mode Pembaca)"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kunci CMS</span>
                </button>
              </>
            ) : (
              /* Simple discreet "Akses Redaksi" button for authorized staff, looks completely safe */
              <button
                onClick={onOpenUnlockModal}
                className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                title="Masuk ke Panel Redaksi"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Akses Redaksi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Category Bar (Desktop) */}
      <nav className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 flex items-center gap-1">
          <button
            id="btn-cat-all"
            onClick={() => onSelectCategory("")}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
              currentCategory === ""
                ? "text-red-700 border-b-2 border-red-700 pb-1 font-black"
                : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
            }`}
          >
            BERANDA
          </button>
          {CATEGORIES.slice(0, 14).map((cat) => (
            <button
              key={cat}
              id={`btn-cat-${cat.toLowerCase()}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
                currentCategory === cat
                  ? "text-red-700 border-b-2 border-red-700 pb-1 font-black"
                  : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
              }`}
            >
              {cat}
            </button>
          ))}
          {CATEGORIES.length > 14 && (
            <div className="relative group inline-block">
              <button className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 flex items-center gap-1">
                KATEGORI LAIN ▾
              </button>
              <div className="absolute left-0 mt-1 hidden group-hover:block w-64 bg-white dark:bg-gray-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl p-2 grid grid-cols-2 gap-1 z-50">
                {CATEGORIES.slice(14).map((cat) => (
                  <button
                    key={cat}
                    id={`btn-cat-dropdown-${cat.toLowerCase()}`}
                    onClick={() => onSelectCategory(cat)}
                    className="text-left text-[11px] font-bold uppercase px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-red-600 truncate"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 4. Breaking News Ticker (High Density) */}
      <div className="bg-slate-900 text-white flex items-center h-10 px-6 overflow-hidden border-b border-slate-950 relative z-10">
        <div className="bg-red-600 text-[10px] font-black uppercase px-2 py-1 mr-4 whitespace-nowrap animate-pulse">
          Breaking News
        </div>
        <div className="relative flex-1 w-full overflow-hidden whitespace-nowrap text-xs font-medium italic">
          <div className="inline-block animate-marquee pl-4 hover:[animation-play-state:paused] cursor-pointer">
            {breakingNewsList.map((news, i) => (
              <span key={i} className="mx-6 hover:underline inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                {news}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4b. Kurs Valas Running Ticker (Horizontal) */}
      <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center h-9 px-6 overflow-hidden relative z-10 text-[11px] font-bold text-slate-600 dark:text-slate-400">
        <div className="bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 mr-4 whitespace-nowrap rounded font-mono border border-emerald-200/50 dark:border-emerald-900/40">
          KURS VALAS
        </div>
        <div className="relative flex-1 w-full overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee pl-4 hover:[animation-play-state:paused] cursor-pointer">
            {valasRates.map((curr, i) => {
              const isDown = curr.change.startsWith("-");
              return (
                <span key={i} className="mx-6 inline-flex items-center gap-1.5 font-mono">
                  <span className="font-sans font-extrabold text-slate-850 dark:text-slate-200">{curr.code}</span>
                  <span className="text-slate-950 dark:text-slate-100 font-extrabold">{curr.rate}</span>
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isDown ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {isDown ? "▼" : "▲"} {curr.change}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Mobile Category Menu (Collapsible Sidebar Drawer with Backdrop) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl z-[60] flex flex-col p-6 transition-transform duration-300 ease-out transform translate-x-0 lg:hidden border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <img
                  src={logoImg}
                  className="w-8 h-8 object-contain rounded-full border border-red-700 bg-white shadow-sm"
                  alt="Logo"
                />
                <span className="text-sm font-black text-red-700 dark:text-red-500 tracking-tight">MENU UTAMA</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg min-w-[48px] min-h-[48px] flex items-center justify-center border border-slate-100 dark:border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="mb-6 relative">
              <input
                id="input-mobile-search"
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[48px]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>

            {/* Drawer Categories Scroll Container */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-hide">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-2">KATEGORI BERITA</p>
              
              <button
                onClick={() => {
                  onSelectCategory("");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left text-xs font-bold px-4 py-3 rounded-xl uppercase transition-colors flex items-center min-h-[48px] ${
                  currentCategory === ""
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Beranda
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left text-xs font-bold px-4 py-3 rounded-xl uppercase transition-colors flex items-center min-h-[48px] ${
                    currentCategory === cat
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  style={{
                    backgroundColor: currentCategory === cat ? "var(--primary-color, #DC2626)" : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Drawer Footer Actions (Akses Redaksi / Theme Toggle) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">UBAH TEMA</span>
                <button
                  onClick={onToggleDarkMode}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              {/* Redaksi Access in Drawer */}
              <div className="pt-2">
                {isRedaksiUnlocked ? (
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">REDAKSI AKTIF ({activeRole.replace("_", " ")})</div>
                    <button
                      onClick={() => {
                        onToggleAdmin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <MonitorPlay className="w-4 h-4" />
                      <span>{isAdminView ? "Lihat Portal" : "CMS Redaksi"}</span>
                    </button>
                    {onLockRedaksi && (
                      <button
                        onClick={() => {
                          onLockRedaksi();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-900 flex items-center justify-center gap-2 min-h-[48px]"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Kunci CMS</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (onOpenUnlockModal) onOpenUnlockModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <KeyRound className="w-4 h-4 text-slate-400" />
                    <span>Akses Redaksi</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.header>
  );
}
