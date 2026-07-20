import React, { useState } from "react";
import { 
  X, Smartphone, Tablet, Monitor, Zap, FileText, Moon, Sun, Printer, Download 
} from "lucide-react";
import { Article } from "../types";

interface ArticlePreviewModalProps {
  article: Article;
  onClose: () => void;
}

type PreviewMode = "desktop" | "tablet" | "mobile" | "amp" | "pdf" | "dark";

export default function ArticlePreviewModal({
  article,
  onClose
}: ArticlePreviewModalProps) {
  const [mode, setMode] = useState<PreviewMode>("desktop");

  const formattedDate = (() => {
    if (!article.date) return "-";
    try {
      const d = new Date(article.date);
      if (isNaN(d.getTime())) return article.date;
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      return article.date;
    }
  })();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-100 dark:bg-gray-950 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Modal Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Multi-Device Pratinjau Redaksi</span>
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate max-w-sm" title={article.title}>
              Pratinjau: {article.title}
            </h3>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setMode("desktop")}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                mode === "desktop" 
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow" 
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setMode("tablet")}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                mode === "tablet" 
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow" 
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setMode("mobile")}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                mode === "mobile" 
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow" 
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
            <button
              onClick={() => setMode("amp")}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                mode === "amp" 
                  ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shadow" 
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">AMP Fast</span>
            </button>
            <button
              onClick={() => setMode("pdf")}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                mode === "pdf" 
                  ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 shadow" 
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">PDF</span>
            </button>
            <button
              onClick={() => setMode("dark")}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
                mode === "dark" 
                  ? "bg-gray-950 text-white shadow" 
                  : "text-gray-500 hover:text-gray-950 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Dark Mode</span>
            </button>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Preview Frame Area */}
        <div className="flex-1 bg-gray-200 dark:bg-gray-900 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          
          {/* 1. DESKTOP VIEW */}
          {mode === "desktop" && (
            <div className="bg-white dark:bg-gray-950 w-full max-w-4xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden animate-fadeIn">
              <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-3 text-[10px] text-gray-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                <span className="ml-2 font-mono text-[9px]">https://www.majalengkapost.co.id/{article.category.toLowerCase()}/article-preview</span>
              </div>
              <div className="p-8 md:p-12 space-y-6">
                <div className="border-l-4 border-red-600 pl-3.5">
                  <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">{article.category}</span>
                  {article.subTitle && <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">{article.subTitle}</p>}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{article.title}</h1>
                
                {/* Author card */}
                <div className="flex items-center gap-3.5 border-y border-gray-100 dark:border-gray-900 py-3 text-xs text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center">RW</div>
                  <div>
                    <p className="font-bold text-gray-850 dark:text-gray-200">Oleh: {article.author}</p>
                    <p className="text-[10px]">{formattedDate} • {article.time} WIB</p>
                  </div>
                </div>

                {/* Cover Image */}
                {article.coverImage && (
                  <figure className="rounded-xl overflow-hidden shadow-sm">
                    <img src={article.coverImage} alt={article.title} className="w-full h-auto object-cover max-h-[400px]" />
                  </figure>
                )}

                {/* Summary / Lead block */}
                <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-red-600 p-4 rounded-r-lg">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 italic leading-relaxed">{article.summary}</p>
                </div>

                {/* Article body html */}
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-250 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          )}

          {/* 2. TABLET VIEW */}
          {mode === "tablet" && (
            <div className="bg-white dark:bg-gray-950 w-[768px] rounded-2xl shadow-lg border-8 border-gray-400 overflow-hidden animate-fadeIn min-h-[600px]">
              <div className="p-8 space-y-5">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">{article.category}</span>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{article.title}</h1>
                <p className="text-xs text-gray-500">{formattedDate} • {article.time} WIB</p>
                
                {article.coverImage && (
                  <img src={article.coverImage} alt={article.title} className="w-full h-[250px] object-cover rounded-lg" />
                )}

                <p className="text-xs font-bold text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{article.summary}</p>

                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-xs text-gray-800 dark:text-gray-300 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          )}

          {/* 3. MOBILE VIEW */}
          {mode === "mobile" && (
            <div className="w-[360px] h-[640px] bg-white dark:bg-gray-950 rounded-[32px] shadow-2xl border-8 border-gray-900 overflow-hidden flex flex-col animate-fadeIn relative">
              {/* Speaker notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-gray-900 rounded-full z-20"></div>
              
              <div className="flex-1 overflow-y-auto p-4 pt-8 space-y-4">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">{article.category}</span>
                <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-snug">{article.title}</h1>
                <p className="text-[9px] text-gray-400 font-mono">Wartawan: {article.author} • {article.time}</p>
                
                {article.coverImage && (
                  <img src={article.coverImage} alt={article.title} className="w-full h-40 object-cover rounded-lg" />
                )}

                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 italic border-l-2 border-red-600 pl-2 leading-relaxed">{article.summary}</p>

                <div 
                  className="prose prose-xs dark:prose-invert max-w-none text-xs text-gray-800 dark:text-gray-300 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          )}

          {/* 4. AMP PREVIEW */}
          {mode === "amp" && (
            <div className="bg-white w-full max-w-2xl p-6 border border-gray-300 animate-fadeIn font-sans">
              <div className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest inline-flex items-center gap-1 mb-4">
                <Zap className="w-3.5 h-3.5 fill-current" /> AMP LAYOUT FAST
              </div>
              
              <header className="border-b-2 border-red-600 pb-3 mb-4">
                <span className="text-xs font-extrabold text-red-600 uppercase">{article.category}</span>
                <h1 className="text-xl font-black text-gray-900 leading-tight mt-1">{article.title}</h1>
                <p className="text-[11px] text-gray-500 font-mono mt-1">Oleh: {article.author} • {formattedDate}</p>
              </header>

              {article.coverImage && (
                <div className="my-4">
                  <img src={article.coverImage} alt={article.title} className="w-full h-auto" />
                </div>
              )}

              <p className="text-xs font-bold text-gray-700 italic border-l-4 border-gray-400 pl-3 my-4">{article.summary}</p>

              <div 
                className="prose prose-sm max-w-none text-gray-800 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          )}

          {/* 5. PDF PRINT PREVIEW */}
          {mode === "pdf" && (
            <div className="bg-white text-gray-900 w-full max-w-3xl p-12 border border-gray-300 shadow-2xl font-serif animate-fadeIn relative">
              <div className="absolute top-4 right-4 flex gap-2 font-sans">
                <button onClick={() => window.print()} className="p-2 bg-red-600 text-white rounded hover:bg-red-700">
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center border-b-4 border-double border-black pb-4 mb-6">
                <h1 className="text-3xl font-black uppercase tracking-tight">KABAR NEGARA</h1>
                <p className="text-[10px] font-sans uppercase font-bold text-gray-500 tracking-widest">Lembar Pratinjau Cetak / PDF Jurnalistik</p>
              </div>

              <div className="flex justify-between font-sans text-xs text-gray-500 border-b pb-2 mb-4">
                <span>SEKTOR: {article.category.toUpperCase()}</span>
                <span>WARTAWAN: {article.author.toUpperCase()}</span>
                <span>DRAFT ID: {article.id}</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center leading-tight">{article.title}</h2>
                <p className="text-xs text-center text-gray-500 font-sans italic">{formattedDate} • {article.time} WIB</p>
                
                {article.coverImage && (
                  <div className="text-center my-4">
                    <img src={article.coverImage} alt={article.title} className="w-[300px] h-auto object-cover mx-auto border" />
                    <p className="text-[10px] text-gray-500 mt-1 italic">Cover Lampiran Berita</p>
                  </div>
                )}

                <div className="border border-gray-300 p-4 my-4 bg-gray-50">
                  <p className="text-xs font-bold leading-relaxed">{article.summary}</p>
                </div>

                <div 
                  className="prose prose-sm max-w-none font-serif text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          )}

          {/* 6. DARK MODE PREVIEW */}
          {mode === "dark" && (
            <div className="bg-gray-950 text-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-900 p-8 md:p-12 space-y-6 animate-fadeIn font-serif">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest block border-l-2 border-red-500 pl-2">{article.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">{article.title}</h1>
              <p className="text-xs text-gray-400 font-sans">Published by {article.author} • {formattedDate}</p>

              {article.coverImage && (
                <img src={article.coverImage} alt={article.title} className="w-full h-auto max-h-[350px] object-cover rounded-xl border border-gray-900" />
              )}

              <p className="text-sm font-semibold text-gray-300 bg-gray-900 p-4 rounded-lg italic leading-relaxed">{article.summary}</p>

              <div 
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          )}

        </div>

        {/* Footer controls */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider">
            Format: {article.bodyJson ? "ProseMirror JSON 🟢" : "HTML format 🟡"}
          </span>
          <button 
            onClick={onClose} 
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-bold"
          >
            Selesai Pratinjau
          </button>
        </footer>

      </div>
    </div>
  );
}
