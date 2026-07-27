import React from "react";
import { Monitor, ArrowRightLeft, Sparkles, Scissors, Wand2 } from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsStudioMode() {
  const { state, toggleStudioMode, triggerTransition, changeScene } = useObsStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Studio Mode &amp; Transition Effects
          </h3>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          disabled={!state.connected}
          onClick={() => toggleStudioMode(!state.studioModeEnabled)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            state.studioModeEnabled
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>{state.studioModeEnabled ? "Studio Mode ACTIVE" : "Enable Studio Mode"}</span>
        </button>
      </div>

      {/* Preview vs Program Scene Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Preview Scene */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-900/40 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 block">
            PREVIEW SCENE (Persiapan)
          </span>
          <div className="text-sm font-extrabold text-white truncate">
            {state.previewScene || state.activeScene || "Tidak Ada Preview"}
          </div>
          <span className="text-[9px] text-slate-500 block">Scene yang sedang disiapkan sebelum tayang</span>
        </div>

        {/* Program Scene */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-red-900/40 space-y-1">
          <span className="text-[10px] uppercase font-black tracking-widest text-red-500 block">
            PROGRAM SCENE (Tayang Siaran)
          </span>
          <div className="text-sm font-extrabold text-white truncate">
            {state.activeScene || "Tidak Ada Program"}
          </div>
          <span className="text-[9px] text-slate-500 block">Scene aktif di tayangan publik siaran</span>
        </div>
      </div>

      {/* Transitions Controls */}
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
          Pilihan Transisi Pindah Adegan (Transition)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            disabled={!state.connected}
            onClick={() => triggerTransition()}
            className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cut / Fade</span>
          </button>

          <button
            type="button"
            disabled={!state.connected}
            onClick={() => triggerTransition()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Cut Quick</span>
          </button>

          <button
            type="button"
            disabled={!state.connected}
            onClick={() => triggerTransition()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Fade (1000ms)</span>
          </button>

          <button
            type="button"
            disabled={!state.connected}
            onClick={() => triggerTransition()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Stinger Effect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
