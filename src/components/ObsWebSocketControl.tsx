import React from "react";
import ObsDashboardPage from "../pages/ObsDashboardPage";

interface ObsWebSocketControlProps {
  streamUrl: string;
  onUpdateStreamUrl: (url: string) => void;
  isActive: boolean;
}

export default function ObsWebSocketControl({ streamUrl, onUpdateStreamUrl, isActive }: ObsWebSocketControlProps) {
  return (
    <div className="space-y-4">
      {/* Stream Feed URL Config */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
          📺 Feed Tautan Siaran OBS Publik (HLS / YouTube Embed / Custom RTMP Player)
        </label>
        <input
          type="text"
          value={streamUrl}
          onChange={(e) => onUpdateStreamUrl(e.target.value)}
          placeholder="Contoh: https://www.youtube.com/embed/LIVE_ID atau https://stream.domain.com/hls/obs.m3u8"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono"
        />
        <p className="text-[10px] text-slate-400">
          Masukkan link siaran YouTube Live atau stream HLS (.m3u8) dari OBS agar pembaca di portal publik dapat menonton tayangan langsung dari OBS Studio Anda.
        </p>
      </div>

      {/* Main OBS Control Dashboard */}
      <ObsDashboardPage />
    </div>
  );
}
