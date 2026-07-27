import React, { useState } from "react";
import { Camera, Download, Image as ImageIcon, RefreshCw } from "lucide-react";
import { useObsStore } from "../../store/obsStore";

export default function ObsScreenshotTool() {
  const { state, takeScreenshot } = useObsStore();
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });
  const [capturing, setCapturing] = useState(false);

  const handleCapture = async (targetSource?: string) => {
    setCapturing(true);
    try {
      const sourceToCapture = targetSource || state.activeScene || "";
      const base64Data = await takeScreenshot(sourceToCapture, "png", resolution.width, resolution.height);
      if (base64Data) {
        setScreenshotData(base64Data);
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleDownload = () => {
    if (!screenshotData) return;
    const link = document.createElement("a");
    link.href = screenshotData;
    link.download = `OBS_Screenshot_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">
            Screenshot &amp; Capture Program/Preview
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Export Frame PNG</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls Column */}
        <div className="space-y-3">
          {/* Resolution Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Pilih Resolusi Hasil Screenshot
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setResolution({ width: 1920, height: 1080 })}
                className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                  resolution.width === 1920
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                1080p (Full HD)
              </button>

              <button
                type="button"
                onClick={() => setResolution({ width: 1280, height: 720 })}
                className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                  resolution.width === 1280
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                720p (HD)
              </button>

              <button
                type="button"
                onClick={() => setResolution({ width: 854, height: 480 })}
                className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                  resolution.width === 854
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                480p (SD)
              </button>
            </div>
          </div>

          {/* Capture Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!state.connected || capturing}
              onClick={() => handleCapture(state.activeScene || undefined)}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {capturing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              <span>Capture Program</span>
            </button>

            <button
              type="button"
              disabled={!state.connected || capturing}
              onClick={() => handleCapture(state.previewScene || state.activeScene || undefined)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Capture Preview</span>
            </button>
          </div>
        </div>

        {/* Screenshot Result Frame */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
          {screenshotData ? (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-black">
                <img src={screenshotData} alt="OBS Screenshot Preview" className="w-full h-auto object-contain max-h-48 mx-auto" />
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="w-full p-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar PNG</span>
              </button>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-600 space-y-2">
              <Camera className="w-8 h-8 stroke-1" />
              <p className="text-xs text-slate-500">Klik "Capture Program" untuk mengambil foto tayangan OBS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
