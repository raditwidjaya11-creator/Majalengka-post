import React from "react";
import { Gauge, Wifi, Users, AlertTriangle, Layers, Activity } from "lucide-react";
import { useObsStore } from "../../store/obsStore";
import { formatBitrate } from "../../utils/formatters";

export default function ObsStreamInfo() {
  const { state } = useObsStore();
  const stats = state.stats;

  // Render lag percentage
  const renderLagPercent =
    stats.renderTotalFrames > 0
      ? ((stats.renderSkippedFrames / stats.renderTotalFrames) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Informasi Telemetri Siaran OBS (Streaming Info)
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Live Broadcast Telemetry</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {/* Bitrate */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Bitrate
          </span>
          <div className="text-sm font-black text-sky-400 font-mono">
            {formatBitrate(stats.outputKbitsPerSec)}
          </div>
        </div>

        {/* Resolution */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Resolusi
          </span>
          <div className="text-sm font-black text-slate-200 font-mono">
            1080p (60fps)
          </div>
        </div>

        {/* Encoder */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Encoder
          </span>
          <div className="text-sm font-black text-purple-400 font-mono">
            NVENC / x264
          </div>
        </div>

        {/* Active FPS */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            FPS Realtime
          </span>
          <div className="text-sm font-black text-emerald-400 font-mono">
            {stats.activeFps || 0} FPS
          </div>
        </div>

        {/* Dropped Frames */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Dropped Frames
          </span>
          <div className={`text-sm font-black font-mono ${stats.outputSkippedFrames > 0 ? "text-rose-400" : "text-slate-300"}`}>
            {stats.outputSkippedFrames || 0}
          </div>
        </div>

        {/* Render Lag */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Render Lag
          </span>
          <div className="text-sm font-black text-amber-400 font-mono">
            {renderLagPercent}%
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Network Status
          </span>
          <div className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXCELLENT</span>
          </div>
        </div>

        {/* Total Viewers */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">
            Total Penonton
          </span>
          <div className="text-sm font-black text-amber-400 font-mono flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>1,340 Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
