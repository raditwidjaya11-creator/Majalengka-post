import React from "react";
import { 
  Play, Square, Video, Pause, Wifi, WifiOff, RefreshCw
} from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsControls() {
  const { 
    state, connect, disconnect, 
    startStream, stopStream, 
    startRecord, stopRecord, pauseRecord, resumeRecord,
    loading 
  } = useObsStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-sans">
          Kontrol Utama Streaming &amp; Perekaman OBS
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Real-Time Express Proxy API</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Connect / Disconnect */}
        {!state.connected ? (
          <button
            type="button"
            onClick={() => connect()}
            disabled={loading}
            className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
            <span>Connect OBS</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => disconnect()}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-900/40 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <WifiOff className="w-4 h-4 text-red-400" />
            <span>Disconnect OBS</span>
          </button>
        )}

        {/* Start/Stop Stream */}
        {!state.isStreaming ? (
          <button
            type="button"
            disabled={!state.connected}
            onClick={() => startStream()}
            className="p-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Streaming</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => stopStream()}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-900/50 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-blue-400" />
            <span>Stop Streaming</span>
          </button>
        )}

        {/* Start/Stop Record */}
        {!state.isRecording ? (
          <button
            type="button"
            disabled={!state.connected}
            onClick={() => startRecord()}
            className="p-3.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => stopRecord()}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-900/50 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-4 h-4 fill-orange-400" />
            <span>Stop Recording</span>
          </button>
        )}

        {/* Pause/Resume Record */}
        {state.isRecording ? (
          state.isRecordingPaused ? (
            <button
              type="button"
              onClick={() => resumeRecord()}
              className="p-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => pauseRecord()}
              className="p-3.5 bg-amber-600/20 text-amber-300 border border-amber-600/50 hover:bg-amber-600/30 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Recording</span>
            </button>
          )
        ) : (
          <button
            type="button"
            disabled
            className="p-3.5 bg-slate-800/50 text-slate-600 border border-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Pause className="w-4 h-4" />
            <span>Pause Recording</span>
          </button>
        )}
      </div>
    </div>
  );
}
