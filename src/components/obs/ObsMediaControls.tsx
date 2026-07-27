import React, { useState } from "react";
import { Play, Pause, Square, RotateCcw, SkipForward, SkipBack, Film } from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsMediaControls() {
  const { sources, state, mediaControl } = useObsStore();

  // Find sources that are media inputs (e.g. ffmpeg_source, vlc_source, media_source)
  const mediaSources = sources.filter(
    (s) =>
      s.sourceType.toLowerCase().includes("media") ||
      s.sourceType.toLowerCase().includes("ffmpeg") ||
      s.sourceType.toLowerCase().includes("vlc") ||
      s.sourceType.toLowerCase().includes("video")
  );

  const [selectedMedia, setSelectedMedia] = useState<string>(
    mediaSources[0]?.sourceName || sources[0]?.sourceName || ""
  );

  const activeMedia = selectedMedia || (sources.length > 0 ? sources[0].sourceName : "");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Media Input Control (Video &amp; BGM)
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">OBS Media Source Action</span>
      </div>

      {sources.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">
          {state.connected ? "Tidak ada source media terdeteksi." : "Hubungkan ke OBS Studio."}
        </p>
      ) : (
        <div className="space-y-3">
          {/* Media Target Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Pilih Media Source OBS
            </label>
            <select
              value={activeMedia}
              onChange={(e) => setSelectedMedia(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-sans focus:outline-none focus:border-purple-500"
            >
              {sources.map((s) => (
                <option key={s.sceneItemId} value={s.sourceName}>
                  {s.sourceName} ({s.sourceType})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              type="button"
              disabled={!activeMedia || !state.connected}
              onClick={() => mediaControl(activeMedia, "play")}
              className="p-2.5 bg-emerald-600/20 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-600/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-300" />
              <span>Play</span>
            </button>

            <button
              type="button"
              disabled={!activeMedia || !state.connected}
              onClick={() => mediaControl(activeMedia, "pause")}
              className="p-2.5 bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>

            <button
              type="button"
              disabled={!activeMedia || !state.connected}
              onClick={() => mediaControl(activeMedia, "stop")}
              className="p-2.5 bg-red-600/20 text-red-300 border border-red-600/40 hover:bg-red-600/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Square className="w-3.5 h-3.5 fill-red-300" />
              <span>Stop</span>
            </button>

            <button
              type="button"
              disabled={!activeMedia || !state.connected}
              onClick={() => mediaControl(activeMedia, "restart")}
              className="p-2.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            <button
              type="button"
              disabled={!activeMedia || !state.connected}
              onClick={() => mediaControl(activeMedia, "previous")}
              className="p-2.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={!activeMedia || !state.connected}
              onClick={() => mediaControl(activeMedia, "next")}
              className="p-2.5 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
