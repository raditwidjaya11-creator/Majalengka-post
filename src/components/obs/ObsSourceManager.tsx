import React from "react";
import { Eye, EyeOff, Lock, Unlock, Volume2, VolumeX, Tv, Layers } from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsSourceManager() {
  const { sources, state, toggleSource, lockSource, setVolume, toggleMute, audioInputs } = useObsStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Source Management (Scene: {state.activeScene || "Tidak ada"})
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{sources.length} Layer Source</span>
      </div>

      {sources.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">
          {state.connected ? "Tidak ada source di scene ini." : "Hubungkan OBS untuk mengelola source layer."}
        </p>
      ) : (
        <div className="space-y-2">
          {sources.map((src) => {
            // Check if there is an audio input associated with this source
            const audioInp = audioInputs.find((a) => a.inputName === src.sourceName);

            return (
              <div
                key={src.sceneItemId}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  src.sceneItemEnabled
                    ? "bg-slate-950/80 border-slate-800 text-slate-200"
                    : "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60"
                }`}
              >
                {/* Info */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${src.sceneItemEnabled ? "bg-slate-800 text-slate-200" : "bg-slate-900 text-slate-600"}`}>
                    <Layers className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold">{src.sourceName}</h4>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {src.sourceType}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500">Item ID: #{src.sceneItemId}</span>
                  </div>
                </div>

                {/* Control Toggles */}
                <div className="flex items-center gap-2">
                  {/* Show / Hide */}
                  <button
                    type="button"
                    onClick={() => state.activeScene && toggleSource(state.activeScene, src.sceneItemId, !src.sceneItemEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      src.sceneItemEnabled
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {src.sceneItemEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{src.sceneItemEnabled ? "Visible" : "Hidden"}</span>
                  </button>

                  {/* Lock / Unlock */}
                  <button
                    type="button"
                    onClick={() => state.activeScene && lockSource(state.activeScene, src.sceneItemId, !src.sceneItemLocked)}
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      src.sceneItemLocked
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                    }`}
                    title={src.sceneItemLocked ? "Unlock Source" : "Lock Source"}
                  >
                    {src.sceneItemLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>

                  {/* Audio mute toggle if source has audio */}
                  {audioInp && (
                    <button
                      type="button"
                      onClick={() => toggleMute(audioInp.inputName, audioInp.inputMuted)}
                      className={`p-1.5 rounded-lg text-xs transition-all ${
                        audioInp.inputMuted
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
                      }`}
                      title={audioInp.inputMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {audioInp.inputMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
