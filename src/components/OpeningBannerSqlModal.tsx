import React, { useState } from "react";
import { X, Copy, Check, Database, Download, Code, Sparkles, Terminal } from "lucide-react";
import { OpeningBanner } from "../types";

interface OpeningBannerSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
  banners: OpeningBanner[];
}

export default function OpeningBannerSqlModal({
  isOpen,
  onClose,
  banners
}: OpeningBannerSqlModalProps) {
  const [dialect, setDialect] = useState<"postgresql" | "mysql" | "sqlite">("postgresql");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const escapeSqlStr = (str: string | undefined | null): string => {
    if (!str) return "NULL";
    return `'${str.replace(/'/g, "''")}'`;
  };

  const generatePostgresSql = (): string => {
    let sql = `-- PostgreSQL Schema & Inserts for Opening Banners\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS opening_banners (\n`;
    sql += `    id VARCHAR(100) PRIMARY KEY,\n`;
    sql += `    title VARCHAR(255) NOT NULL,\n`;
    sql += `    subtitle TEXT,\n`;
    sql += `    image_url TEXT NOT NULL,\n`;
    sql += `    button_text VARCHAR(100) DEFAULT 'Baca Selengkapnya',\n`;
    sql += `    button_link TEXT DEFAULT '#',\n`;
    sql += `    is_active BOOLEAN DEFAULT TRUE,\n`;
    sql += `    status VARCHAR(20) DEFAULT 'published',\n`;
    sql += `    start_date TIMESTAMP WITH TIME ZONE NULL,\n`;
    sql += `    end_date TIMESTAMP WITH TIME ZONE NULL,\n`;
    sql += `    display_position VARCHAR(50) DEFAULT 'center',\n`;
    sql += `    animation VARCHAR(50) DEFAULT 'zoom',\n`;
    sql += `    animation_duration NUMERIC(3,2) DEFAULT 0.40,\n`;
    sql += `    overlay_color VARCHAR(20) DEFAULT '#000000',\n`;
    sql += `    overlay_opacity NUMERIC(3,2) DEFAULT 0.65,\n`;
    sql += `    display_interval VARCHAR(20) DEFAULT 'always',\n`;
    sql += `    display_frequency VARCHAR(50) DEFAULT 'once_per_session',\n`;
    sql += `    display_delay_seconds INT DEFAULT 1,\n`;
    sql += `    auto_close_seconds INT NULL,\n`;
    sql += `    blur_backdrop BOOLEAN DEFAULT TRUE,\n`;
    sql += `    show_once BOOLEAN DEFAULT FALSE,\n`;
    sql += `    page_target VARCHAR(50) DEFAULT 'all',\n`;
    sql += `    sort_order INT DEFAULT 1,\n`;
    sql += `    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    sql += `-- Indices for query optimization\n`;
    sql += `CREATE INDEX IF NOT EXISTS idx_opening_banners_active ON opening_banners (is_active, status, sort_order);\n\n`;

    sql += `-- Data Insert Statements\n`;
    if (banners.length === 0) {
      sql += `-- No banners currently saved. Initial template insert:\n`;
      sql += `INSERT INTO opening_banners (id, title, subtitle, image_url, button_text, button_link, is_active, status) VALUES\n`;
      sql += `('banner-1', 'Promo Spesial', 'Deskripsi banner', 'https://example.com/banner.jpg', 'Klik Disini', '#', TRUE, 'published');\n`;
    } else {
      banners.forEach((b) => {
        sql += `INSERT INTO opening_banners (\n`;
        sql += `    id, title, subtitle, image_url, button_text, button_link,\n`;
        sql += `    is_active, status, display_position, animation, animation_duration,\n`;
        sql += `    overlay_color, overlay_opacity, display_interval, display_frequency,\n`;
        sql += `    display_delay_seconds, blur_backdrop, page_target, sort_order\n`;
        sql += `) VALUES (\n`;
        sql += `    ${escapeSqlStr(b.id)},\n`;
        sql += `    ${escapeSqlStr(b.title)},\n`;
        sql += `    ${escapeSqlStr(b.subtitle || b.subTitle)},\n`;
        sql += `    ${escapeSqlStr(b.imageUrl)},\n`;
        sql += `    ${escapeSqlStr(b.buttonText)},\n`;
        sql += `    ${escapeSqlStr(b.buttonLink)},\n`;
        sql += `    ${b.isActive ? "TRUE" : "FALSE"},\n`;
        sql += `    ${escapeSqlStr(b.status || "published")},\n`;
        sql += `    ${escapeSqlStr(b.displayPosition || "center")},\n`;
        sql += `    ${escapeSqlStr(b.animation || "zoom")},\n`;
        sql += `    ${b.animationDuration || 0.4},\n`;
        sql += `    ${escapeSqlStr(b.overlayColor || "#000000")},\n`;
        sql += `    ${b.overlayOpacity ?? 0.65},\n`;
        sql += `    ${escapeSqlStr(b.displayInterval || "always")},\n`;
        sql += `    ${escapeSqlStr(b.displayFrequency || "once_per_session")},\n`;
        sql += `    ${b.displayDelaySeconds ?? 1},\n`;
        sql += `    ${b.blurBackdrop !== false ? "TRUE" : "FALSE"},\n`;
        sql += `    ${escapeSqlStr(b.pageTarget || "all")},\n`;
        sql += `    ${b.sortOrder || 1}\n`;
        sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
        sql += `    title = EXCLUDED.title,\n`;
        sql += `    subtitle = EXCLUDED.subtitle,\n`;
        sql += `    image_url = EXCLUDED.image_url,\n`;
        sql += `    is_active = EXCLUDED.is_active,\n`;
        sql += `    updated_at = CURRENT_TIMESTAMP;\n\n`;
      });
    }

    return sql;
  };

  const generateMysqlSql = (): string => {
    let sql = `-- MySQL / MariaDB Schema & Inserts for Opening Banners\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS \`opening_banners\` (\n`;
    sql += `    \`id\` VARCHAR(100) NOT NULL,\n`;
    sql += `    \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `    \`subtitle\` TEXT NULL,\n`;
    sql += `    \`image_url\` TEXT NOT NULL,\n`;
    sql += `    \`button_text\` VARCHAR(100) DEFAULT 'Baca Selengkapnya',\n`;
    sql += `    \`button_link\` TEXT DEFAULT '#',\n`;
    sql += `    \`is_active\` TINYINT(1) DEFAULT 1,\n`;
    sql += `    \`status\` VARCHAR(20) DEFAULT 'published',\n`;
    sql += `    \`start_date\` DATETIME NULL,\n`;
    sql += `    \`end_date\` DATETIME NULL,\n`;
    sql += `    \`display_position\` VARCHAR(50) DEFAULT 'center',\n`;
    sql += `    \`animation\` VARCHAR(50) DEFAULT 'zoom',\n`;
    sql += `    \`animation_duration\` DECIMAL(3,2) DEFAULT 0.40,\n`;
    sql += `    \`overlay_color\` VARCHAR(20) DEFAULT '#000000',\n`;
    sql += `    \`overlay_opacity\` DECIMAL(3,2) DEFAULT 0.65,\n`;
    sql += `    \`display_interval\` VARCHAR(20) DEFAULT 'always',\n`;
    sql += `    \`display_frequency\` VARCHAR(50) DEFAULT 'once_per_session',\n`;
    sql += `    \`display_delay_seconds\` INT DEFAULT 1,\n`;
    sql += `    \`auto_close_seconds\` INT NULL,\n`;
    sql += `    \`blur_backdrop\` TINYINT(1) DEFAULT 1,\n`;
    sql += `    \`show_once\` TINYINT(1) DEFAULT 0,\n`;
    sql += `    \`page_target\` VARCHAR(50) DEFAULT 'all',\n`;
    sql += `    \`sort_order\` INT DEFAULT 1,\n`;
    sql += `    \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n`;
    sql += `    PRIMARY KEY (\`id\`),\n`;
    sql += `    INDEX \`idx_opening_banners_active\` (\`is_active\`, \`status\`, \`sort_order\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (banners.length > 0) {
      banners.forEach((b) => {
        sql += `INSERT INTO \`opening_banners\` (\n`;
        sql += `    \`id\`, \`title\`, \`subtitle\`, \`image_url\`, \`button_text\`, \`button_link\`,\n`;
        sql += `    \`is_active\`, \`status\`, \`display_position\`, \`animation\`, \`animation_duration\`,\n`;
        sql += `    \`overlay_color\`, \`overlay_opacity\`, \`display_interval\`, \`display_frequency\`,\n`;
        sql += `    \`display_delay_seconds\`, \`blur_backdrop\`, \`page_target\`, \`sort_order\`\n`;
        sql += `) VALUES (\n`;
        sql += `    ${escapeSqlStr(b.id)},\n`;
        sql += `    ${escapeSqlStr(b.title)},\n`;
        sql += `    ${escapeSqlStr(b.subtitle || b.subTitle)},\n`;
        sql += `    ${escapeSqlStr(b.imageUrl)},\n`;
        sql += `    ${escapeSqlStr(b.buttonText)},\n`;
        sql += `    ${escapeSqlStr(b.buttonLink)},\n`;
        sql += `    ${b.isActive ? 1 : 0},\n`;
        sql += `    ${escapeSqlStr(b.status || "published")},\n`;
        sql += `    ${escapeSqlStr(b.displayPosition || "center")},\n`;
        sql += `    ${escapeSqlStr(b.animation || "zoom")},\n`;
        sql += `    ${b.animationDuration || 0.4},\n`;
        sql += `    ${escapeSqlStr(b.overlayColor || "#000000")},\n`;
        sql += `    ${b.overlayOpacity ?? 0.65},\n`;
        sql += `    ${escapeSqlStr(b.displayInterval || "always")},\n`;
        sql += `    ${escapeSqlStr(b.displayFrequency || "once_per_session")},\n`;
        sql += `    ${b.displayDelaySeconds ?? 1},\n`;
        sql += `    ${b.blurBackdrop !== false ? 1 : 0},\n`;
        sql += `    ${escapeSqlStr(b.pageTarget || "all")},\n`;
        sql += `    ${b.sortOrder || 1}\n`;
        sql += `) ON DUPLICATE KEY UPDATE\n`;
        sql += `    \`title\` = VALUES(\`title\`),\n`;
        sql += `    \`subtitle\` = VALUES(\`subtitle\`),\n`;
        sql += `    \`image_url\` = VALUES(\`image_url\`),\n`;
        sql += `    \`is_active\` = VALUES(\`is_active\`);\n\n`;
      });
    }

    return sql;
  };

  const generateSqliteSql = (): string => {
    let sql = `-- SQLite Schema & Inserts for Opening Banners\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS opening_banners (\n`;
    sql += `    id TEXT PRIMARY KEY,\n`;
    sql += `    title TEXT NOT NULL,\n`;
    sql += `    subtitle TEXT,\n`;
    sql += `    image_url TEXT NOT NULL,\n`;
    sql += `    button_text TEXT DEFAULT 'Baca Selengkapnya',\n`;
    sql += `    button_link TEXT DEFAULT '#',\n`;
    sql += `    is_active INTEGER DEFAULT 1,\n`;
    sql += `    status TEXT DEFAULT 'published',\n`;
    sql += `    start_date TEXT NULL,\n`;
    sql += `    end_date TEXT NULL,\n`;
    sql += `    display_position TEXT DEFAULT 'center',\n`;
    sql += `    animation TEXT DEFAULT 'zoom',\n`;
    sql += `    animation_duration REAL DEFAULT 0.40,\n`;
    sql += `    overlay_color TEXT DEFAULT '#000000',\n`;
    sql += `    overlay_opacity REAL DEFAULT 0.65,\n`;
    sql += `    display_interval TEXT DEFAULT 'always',\n`;
    sql += `    display_frequency TEXT DEFAULT 'once_per_session',\n`;
    sql += `    display_delay_seconds INTEGER DEFAULT 1,\n`;
    sql += `    auto_close_seconds INTEGER NULL,\n`;
    sql += `    blur_backdrop INTEGER DEFAULT 1,\n`;
    sql += `    show_once INTEGER DEFAULT 0,\n`;
    sql += `    page_target TEXT DEFAULT 'all',\n`;
    sql += `    sort_order INTEGER DEFAULT 1,\n`;
    sql += `    created_at TEXT DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `    updated_at TEXT DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;

    if (banners.length > 0) {
      banners.forEach((b) => {
        sql += `INSERT OR REPLACE INTO opening_banners (\n`;
        sql += `    id, title, subtitle, image_url, button_text, button_link,\n`;
        sql += `    is_active, status, display_position, animation, animation_duration,\n`;
        sql += `    overlay_color, overlay_opacity, display_interval, display_frequency,\n`;
        sql += `    display_delay_seconds, blur_backdrop, page_target, sort_order\n`;
        sql += `) VALUES (\n`;
        sql += `    ${escapeSqlStr(b.id)},\n`;
        sql += `    ${escapeSqlStr(b.title)},\n`;
        sql += `    ${escapeSqlStr(b.subtitle || b.subTitle)},\n`;
        sql += `    ${escapeSqlStr(b.imageUrl)},\n`;
        sql += `    ${escapeSqlStr(b.buttonText)},\n`;
        sql += `    ${escapeSqlStr(b.buttonLink)},\n`;
        sql += `    ${b.isActive ? 1 : 0},\n`;
        sql += `    ${escapeSqlStr(b.status || "published")},\n`;
        sql += `    ${escapeSqlStr(b.displayPosition || "center")},\n`;
        sql += `    ${escapeSqlStr(b.animation || "zoom")},\n`;
        sql += `    ${b.animationDuration || 0.4},\n`;
        sql += `    ${escapeSqlStr(b.overlayColor || "#000000")},\n`;
        sql += `    ${b.overlayOpacity ?? 0.65},\n`;
        sql += `    ${escapeSqlStr(b.displayInterval || "always")},\n`;
        sql += `    ${escapeSqlStr(b.displayFrequency || "once_per_session")},\n`;
        sql += `    ${b.displayDelaySeconds ?? 1},\n`;
        sql += `    ${b.blurBackdrop !== false ? 1 : 0},\n`;
        sql += `    ${escapeSqlStr(b.pageTarget || "all")},\n`;
        sql += `    ${b.sortOrder || 1}\n`;
        sql += `);\n\n`;
      });
    }

    return sql;
  };

  const getSqlContent = (): string => {
    switch (dialect) {
      case "mysql":
        return generateMysqlSql();
      case "sqlite":
        return generateSqliteSql();
      case "postgresql":
      default:
        return generatePostgresSql();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSqlContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([getSqlContent()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `opening_banners_${dialect}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                SQL Generator & Schema Banner Pembuka
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                  SQL Auto-Build
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate skema DDL & DML INSERT query secara otomatis dari data banner pembuka yang aktif.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 bg-slate-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Dialek SQL:
            </span>
            <div className="inline-flex p-1 bg-gray-200 dark:bg-gray-900 rounded-xl">
              <button
                onClick={() => setDialect("postgresql")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dialect === "postgresql"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                PostgreSQL
              </button>
              <button
                onClick={() => setDialect("mysql")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dialect === "mysql"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                MySQL / MariaDB
              </button>
              <button
                onClick={() => setDialect("sqlite")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  dialect === "sqlite"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                SQLite
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 font-semibold text-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Berhasil Disalin!" : "Salin SQL"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh .sql</span>
            </button>
          </div>
        </div>

        {/* Code Editor Preview Area */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 text-slate-200 font-mono text-xs relative">
          <div className="absolute top-3 right-4 text-[10px] text-slate-500 uppercase tracking-widest pointer-events-none flex items-center gap-1">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>SQL Script Preview</span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed selection:bg-indigo-500/40">
            {getSqlContent()}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Terdapat <strong>{banners.length}</strong> banner dalam data saat ini.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
