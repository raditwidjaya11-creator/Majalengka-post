import React from "react";
import { Mic, MicOff, Volume2, VolumeX, Sliders, Activity } from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsAudioMixer() {
  const { audioInputs, state, setVolume, toggleMute } = useObsStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Audio Mixer ({audioInputs.length} Input Audio)
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">dB Level &amp; Peak Meter</span>
      </div>

      {audioInputs.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">
          {state.connected ? "Tidak ada input audio terdeteksi." : "Hubungkan ke OBS Studio untuk melihat mixer audio."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {audioInputs.map((inp) => {
            const isMuted = inp.inputMuted;
            const volumeDb = inp.inputVolumeDb || 0;
            const volumeMul = inp.inputVolumeMul || 1;

            return (
              <div
                key={inp.inputName}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-3"
              >
                {/* Input Label & Mute Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isMuted ? "bg-red-950/60 text-red-400" : "bg-emerald-950/60 text-emerald-400"}`}>
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white truncate max-w-[150px]" title={inp.inputName}>
                        {inp.inputName}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-500 block">{inp.inputKind}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMute(inp.inputName, isMuted)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isMuted
                        ? "bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600/30"
                        : "bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 hover:bg-emerald-600/30"
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isMuted ? "MUTED" : "LIVE"}</span>
                  </button>
                </div>

                {/* Volume Slider & dB readout */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 font-bold">Volume Gain</span>
                    <span className="text-amber-400 font-black">{volumeDb.toFixed(1)} dB</span>
                  </div>

                  <input
                    type="range"
                    min="-60"
                    max="6"
                    step="0.5"
                    value={volumeDb}
                    onChange={(e) => setVolume(inp.inputName, parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Peak Meter Animation Simulation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-slate-500 uppercase font-mono">
                    <span>Peak Meter</span>
                    <span>{isMuted ? "-INF" : `${Math.min(0, volumeDb).toFixed(0)} dB`}</span>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2 p-0.5 border border-slate-800 flex items-center overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isMuted
                          ? "w-0"
                          : volumeDb > 0
                          ? "w-[90%] bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 animate-pulse"
                          : volumeDb > -12
                          ? "w-[75%] bg-gradient-to-r from-emerald-500 to-amber-400"
                          : "w-[40%] bg-emerald-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
