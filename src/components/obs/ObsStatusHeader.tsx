import React, { useState } from "react";
import { 
  Radio, Wifi, WifiOff, Cpu, HardDrive, Activity, 
  Settings, RefreshCw, Layers, ShieldCheck, Video
} from "lucide-react";
import { useObsStore } from "../../store/obsStore";
import { formatPercentage } from "../../utils/formatters";

export default function ObsStatusHeader() {
  const { state, connect, disconnect, loading } = useObsStore();
  const [showConfig, setShowConfig] = useState(false);
  const [hostInput, setHostInput] = useState(state.host || "127.0.0.1");
  const [portInput, setPortInput] = useState(state.port || 4455);
  const [passwordInput, setPasswordInput] = useState("");

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    await connect(hostInput, Number(portInput), passwordInput);
    setShowConfig(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 p-0.5 shadow-lg shadow-red-900/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Radio className={`w-6 h-6 ${state.connected ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-wide font-sans">
                OBS Studio Remote Control
              </h2>
              {state.obsVersion && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  v{state.obsVersion}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Host WebSocket: <code className="text-slate-200 font-mono">{state.host}:{state.port}</code>
            </p>
          </div>
        </div>

        {/* Realtime Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Connection Status: Green = Connected, Red = Disconnected */}
          {state.connected ? (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Connected
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              Disconnected
            </span>
          )}

          {/* Streaming Status: Blue = Streaming */}
          {state.isStreaming && (
            <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              Streaming ({state.streamTimecode || "ON AIR"})
            </span>
          )}

          {/* Recording Status: Orange = Recording */}
          {state.isRecording && (
            <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-pulse">
              <Video className="w-3.5 h-3.5" />
              Recording {state.isRecordingPaused ? "(Paused)" : `(${state.recordTimecode})`}
            </span>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all text-xs font-bold flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Konfigurasi</span>
          </button>
        </div>
      </div>

      {/* Config Drawer Form */}
      {showConfig && (
        <form onSubmit={handleConnect} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Host / IP Address OBS
              </label>
              <input
                type="text"
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                placeholder="127.0.0.1"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Port WebSocket (v5)
              </label>
              <input
                type="number"
                value={portInput}
                onChange={(e) => setPortInput(Number(e.target.value))}
                placeholder="4455"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Password Server (Opsional)
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Aman di server (.env)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Password diproses aman di backend dan tidak pernah dikirim ke browser client.
            </span>

            <div className="flex items-center gap-2">
              {state.connected && (
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-lg text-xs font-bold transition-all"
                >
                  Disconnect
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow transition-all flex items-center gap-1.5"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{state.connected ? "Reconnect OBS" : "Connect OBS"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Hardware Telemetry Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            FPS Active
          </span>
          <div className="text-lg font-black text-emerald-400 font-mono">
            {state.stats.activeFps || 0} <span className="text-xs text-slate-500 font-normal">FPS</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            CPU Usage
          </span>
          <div className="text-lg font-black text-amber-400 font-mono">
            {formatPercentage(state.stats.cpuUsage)}
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            Memory Usage
          </span>
          <div className="text-lg font-black text-sky-400 font-mono">
            {(state.stats.memoryUsage || 0).toFixed(0)} <span className="text-xs text-slate-500 font-normal">MB</span>
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Current Profile / Collection
          </span>
          <div className="text-xs font-bold text-slate-200 truncate font-mono">
            {state.currentProfile || "Default"} / {state.currentCollection || "Default"}
          </div>
        </div>
      </div>
    </div>
  );
}
