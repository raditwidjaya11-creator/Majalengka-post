import React, { useEffect } from "react";
import ObsStatusHeader from "../components/obs/ObsStatusHeader";
import ObsControls from "../components/obs/ObsControls";
import ObsSceneManager from "../components/obs/ObsSceneManager";
import ObsSourceManager from "../components/obs/ObsSourceManager";
import ObsAudioMixer from "../components/obs/ObsAudioMixer";
import ObsMediaControls from "../components/obs/ObsMediaControls";
import ObsStudioMode from "../components/obs/ObsStudioMode";
import ObsScreenshotTool from "../components/obs/ObsScreenshotTool";
import ObsStreamInfo from "../components/obs/ObsStreamInfo";
import { useObsStore } from "../store/obsStore";
import { useObsSocket } from "../hooks/useObsSocket";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export default function ObsDashboardPage() {
  // Activate Socket.IO listener hook for zero-latency event updates
  useObsSocket();

  const { fetchStatus, notification, setNotification } = useObsStore();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* Toast Notification Popup */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-xl border shadow-2xl flex items-center justify-between gap-3 text-xs font-bold ${
              notification.type === "success"
                ? "bg-emerald-950 border-emerald-800 text-emerald-200"
                : notification.type === "error"
                ? "bg-red-950 border-red-800 text-red-200"
                : "bg-slate-900 border-slate-700 text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {notification.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
              {notification.type === "info" && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span>{notification.message}</span>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-black/30 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Status */}
      <ObsStatusHeader />

      {/* Main Control Toolbar */}
      <ObsControls />

      {/* Streaming Telemetry Metrics */}
      <ObsStreamInfo />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Scene & Source Management */}
        <div className="space-y-6">
          <ObsSceneManager />
          <ObsSourceManager />
          <ObsMediaControls />
        </div>

        {/* Right Column: Audio Mixer, Studio Mode, Screenshot */}
        <div className="space-y-6">
          <ObsStudioMode />
          <ObsAudioMixer />
          <ObsScreenshotTool />
        </div>
      </div>
    </div>
  );
}
