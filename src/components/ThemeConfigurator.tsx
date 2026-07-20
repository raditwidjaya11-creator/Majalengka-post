import React from "react";
import { Palette, Layout, Type, Check } from "lucide-react";

export interface PresetTheme {
  name: string;
  primary: string;
  secondary: string;
  bgClass: string;
}

export const THEME_PRESETS: PresetTheme[] = [
  { name: "Majalengka Red (Red)", primary: "#DC2626", secondary: "#991B1B", bgClass: "bg-red-600" },
  { name: "Warta Bahari (Blue)", primary: "#2563EB", secondary: "#1E40AF", bgClass: "bg-blue-600" },
  { name: "Sinar Nusantara (Gold)", primary: "#D97706", secondary: "#92400E", bgClass: "bg-amber-600" },
  { name: "Lentera Hijau (Emerald)", primary: "#059669", secondary: "#065F46", bgClass: "bg-emerald-600" },
  { name: "Metro Malam (Dark Grey)", primary: "#4B5563", secondary: "#1F2937", bgClass: "bg-gray-600" },
];

interface ThemeConfiguratorProps {
  currentTheme: PresetTheme;
  onChangeTheme: (theme: PresetTheme) => void;
  fontFamily: string;
  onChangeFont: (font: string) => void;
  density: "compact" | "normal" | "spacious";
  onChangeDensity: (density: "compact" | "normal" | "spacious") => void;
}

export default function ThemeConfigurator({
  currentTheme,
  onChangeTheme,
  fontFamily,
  onChangeFont,
  density,
  onChangeDensity,
}: ThemeConfiguratorProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
        <Palette className="w-5 h-5 text-gray-500" />
        <h3 className="font-bold text-gray-900 dark:text-white">Pengaturan Identitas Visual</h3>
      </div>

      {/* Preset Palette Selection */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Warna Utama Portal (Branding)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEME_PRESETS.map((theme) => {
            const isSelected = currentTheme && theme.name === currentTheme.name;
            return (
              <button
                key={theme.name}
                id={`btn-theme-${theme.name.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => onChangeTheme(theme)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  isSelected
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${theme.bgClass} flex-shrink-0 flex items-center justify-center`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                <span className="truncate">{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family Config */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Type className="w-4 h-4 text-gray-400" />
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tipografi & Font Judul
          </label>
        </div>
        <select
          id="select-font-family"
          value={fontFamily}
          onChange={(e) => onChangeFont(e.target.value)}
          className="w-full text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
        >
          <option value="font-sans">Inter (Modern & Bersih)</option>
          <option value="font-serif">Georgia / Playfair (Editorial & Premium)</option>
          <option value="font-mono">JetBrains Mono (Teknis & Brutalist)</option>
        </select>
      </div>

      {/* Spacing Density Config */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Layout className="w-4 h-4 text-gray-400" />
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Kerapatan Tampilan (Kepadatan Layout)
          </label>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {(["compact", "normal", "spacious"] as const).map((opt) => {
            const isSel = density === opt;
            return (
              <button
                key={opt}
                id={`btn-density-${opt}`}
                onClick={() => onChangeDensity(opt)}
                className={`text-center py-1.5 rounded text-xs font-medium capitalize transition-all ${
                  isSel
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                }`}
              >
                {opt === "compact" ? "Padat" : opt === "normal" ? "Normal" : "Senggang"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
