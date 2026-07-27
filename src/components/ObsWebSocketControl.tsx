import React, { useState, useEffect } from "react";
import { 
  Radio, Wifi, WifiOff, Tv, Play, Square, Video, Mic, MicOff, 
  Layers, Activity, Cpu, HardDrive, RefreshCw, AlertCircle, CheckCircle2, Lock, Shield
} from "lucide-react";
import { globalObsClient, OBSState } from "../lib/obsWebSocket";

interface ObsWebSocketControlProps {
  streamUrl: string;
  onUpdateStreamUrl: (url: string) => void;
  isActive: boolean;
}

export default function ObsWebSocketControl({ streamUrl, onUpdateStreamUrl, isActive }: ObsWebSocketControlProps) {
  const [obsUrl, setObsUrl] = useState<string>("ws://localhost:4455");
  const [obsPassword, setObsPassword] = useState<string>("");
  const [obsState, setObsState] = useState<OBSState>(globalObsClient.getState());
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = globalObsClient.subscribe((state) => {
      setObsState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      await globalObsClient.connect(obsUrl, obsPassword);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    globalObsClient.disconnect();
  };

  const isConnected = obsState.connectionState === "CONNECTED";

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-xl text-left font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              OBS Studio WebSocket Remote Control
            </h4>
            <p className="text-[10px] text-slate-400">Hubungkan web portal redaksi ke OBS Studio untuk kendali siaran, switch scene, dan statistik realtime.</p>
          </div>
        </div>

        {/* Connection Status Badge */}
        <div className="flex items-center gap-2">
          {obsState.connectionState === "CONNECTED" && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              TERHUBUNG (OBS v{obsState.obsVersion || "5.0"})
            </span>
          )}
          {(obsState.connectionState === "CONNECTING" || obsState.connectionState === "AUTHENTICATING") && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-950/80 border border-amber-800/80 text-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
              PROSES KONEKSI...
            </span>
          )}
          {(obsState.connectionState === "DISCONNECTED" || obsState.connectionState === "ERROR" || obsState.connectionState === "AUTH_FAILED") && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <WifiOff className="w-3 h-3 text-slate-500" />
              DISCONNECTED
            </span>
          )}
        </div>
      </div>

      {/* Connection Form / Actions */}
      {!isConnected ? (
        <form onSubmit={handleConnect} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Alamat OBS WebSocket Server (ws/wss)
              </label>
              <input
                type="text"
                required
                value={obsUrl}
                onChange={(e) => setObsUrl(e.target.value)}
                placeholder="ws://localhost:4455 atau ws://192.168.1.10:4455"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Default OBS v28+: <code className="text-amber-400">ws://localhost:4455</code></p>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Kata Sandi OBS WebSocket (Opsional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={obsPassword}
                  onChange={(e) => setObsPassword(e.target.value)}
                  placeholder="Masukkan password jika diaktifkan di OBS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pr-12 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1"
                >
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>
          </div>

          {obsState.errorMessage && (
            <div className="p-2.5 bg-red-950/40 border border-red-900/60 rounded-lg text-red-300 text-[10px] font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{obsState.errorMessage}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <p className="text-[10px] text-slate-400">
              💡 Buka OBS Studio &gt; Menu <strong>Tools</strong> &gt; <strong>WebSocket Server Settings</strong> untuk mengaktifkan server.
            </p>

            <button
              type="submit"
              disabled={isConnecting}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Hubungkan ke OBS Studio</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Connected Control & Telemetry Panel */
        <div className="space-y-4">
          {/* Quick Toolbar & Disconnect */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${obsState.isStreaming ? "bg-red-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"}`}>
                <span className={`w-2 h-2 rounded-full ${obsState.isStreaming ? "bg-white animate-ping" : "bg-slate-600"}`}></span>
                {obsState.isStreaming ? "OBS ON AIR (STREAMING)" : "OBS OFFLINE"}
              </span>

              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${obsState.isRecording ? "bg-amber-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"}`}>
                <Video className="w-3.5 h-3.5" />
                {obsState.isRecording ? "REKAP DOKUMENTASI (RECORDING)" : "RECORD IDLE"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDisconnect}
              className="text-[10px] font-bold text-slate-400 hover:text-red-400 underline uppercase tracking-wider"
            >
              Putuskan Koneksi OBS
            </button>
          </div>

          {/* Quick Action Controls (Start/Stop Stream & Record) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => globalObsClient.toggleStream()}
              className={`p-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                obsState.isStreaming
                  ? "bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-900/50"
                  : "bg-red-600 hover:bg-red-500 text-white"
              }`}
            >
              {obsState.isStreaming ? (
                <>
                  <Square className="w-4 h-4 fill-red-400 text-red-400" />
                  <span>Hentikan Siaran OBS (Stop Stream)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Mulai Siaran OBS (Start Stream)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => globalObsClient.toggleRecord()}
              className={`p-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                obsState.isRecording
                  ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-900/50"
                  : "bg-amber-600 hover:bg-amber-500 text-white"
              }`}
            >
              {obsState.isRecording ? (
                <>
                  <Square className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Hentikan Rekaman OBS</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Mulai Rekam di OBS</span>
                </>
              )}
            </button>
          </div>

          {/* Live Scene Switcher Grid */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-500" />
                Live OBS Scene Switcher (Pindah Adegan Realtime)
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Klik scene untuk mengaktifkan di OBS</span>
            </div>

            {obsState.scenes.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">Tidak ada scene yang terdeteksi di OBS Studio.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {obsState.scenes.map((sc) => {
                  const isActiveScene = obsState.activeScene === sc.sceneName;
                  return (
                    <button
                      key={sc.sceneName}
                      type="button"
                      onClick={() => globalObsClient.switchScene(sc.sceneName)}
                      className={`p-3 rounded-lg text-xs font-bold transition-all border text-left truncate cursor-pointer ${
                        isActiveScene
                          ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30 font-black scale-[1.02]"
                          : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
                      }`}
                    >
                      <span className="text-[9px] block text-slate-400 uppercase tracking-widest mb-0.5">Scene #{sc.sceneIndex + 1}</span>
                      <span className="truncate block">{sc.sceneName}</span>
                      {isActiveScene && (
                        <span className="text-[8px] uppercase tracking-wider bg-white/20 text-white px-1.5 py-0.5 rounded mt-1.5 inline-block">● ACTIVE PROGRAM</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-1">FPS Active</span>
              <div className="text-base font-black text-emerald-400 font-mono">
                {obsState.stats?.activeFps || 0} <span className="text-[10px] text-slate-500">FPS</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-1">Bandwidth Bitrate</span>
              <div className="text-base font-black text-sky-400 font-mono">
                {obsState.streamStatus?.outputKbitsPerSec || 0} <span className="text-[10px] text-slate-500">kbps</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-1">CPU Usage</span>
              <div className="text-base font-black text-amber-400 font-mono">
                {(obsState.stats?.cpuUsage || 0).toFixed(1)} <span className="text-[10px] text-slate-500">%</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block mb-1">Dropped Frames</span>
              <div className="text-base font-black text-rose-400 font-mono">
                {obsState.streamStatus?.outputSkippedFrames || 0}
              </div>
            </div>
          </div>

          {/* Audio Input Mute/Unmute Mixer */}
          {obsState.audioInputs.length > 0 && (
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-500" />
                Audio Mixer OBS (Mikrofon &amp; Desktop Feed)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {obsState.audioInputs.map((input) => (
                  <div key={input.inputName} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-xs font-bold text-slate-300 truncate mr-2">{input.inputName}</span>
                    <button
                      type="button"
                      onClick={() => globalObsClient.toggleInputMute(input.inputName)}
                      className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                        input.inputMuted
                          ? "bg-red-950/80 text-red-400 border border-red-900/60"
                          : "bg-emerald-950/80 text-emerald-400 border border-emerald-900/60"
                      }`}
                    >
                      {input.inputMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      <span>{input.inputMuted ? "MUTED" : "UNMUTED"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stream Feed / RTMP URL for Public Portal Display */}
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-300">
              📺 Feed Tautan Siaran OBS Publik (HLS / YouTube Embed / Custom RTMP Player)
            </label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => onUpdateStreamUrl(e.target.value)}
              placeholder="Contoh: https://www.youtube.com/embed/LIVE_ID atau https://stream.domain.com/hls/obs.m3u8"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
            />
            <p className="text-[9px] text-slate-400">
              Masukkan tautan YouTube Live, Twitch embed, atau feed stream HLS (.m3u8) dari OBS agar pembaca di portal publik dapat menonton hasil siaran OBS Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
