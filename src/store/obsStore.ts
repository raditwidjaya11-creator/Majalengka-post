import { create } from "zustand";
import { OBSState, OBSScene, OBSSource, OBSAudioInput } from "../types/obs";
import { obsApiService } from "../services/obsService";

interface OBSStore {
  state: OBSState;
  scenes: OBSScene[];
  sources: OBSSource[];
  audioInputs: OBSAudioInput[];
  loading: boolean;
  error: string | null;
  notification: { type: "success" | "error" | "info"; message: string } | null;

  // Actions
  setState: (newState: Partial<OBSState>) => void;
  setNotification: (notif: { type: "success" | "error" | "info"; message: string } | null) => void;
  fetchStatus: () => Promise<void>;
  connect: (host?: string, port?: number, password?: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  startStream: () => Promise<void>;
  stopStream: () => Promise<void>;
  startRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  pauseRecord: () => Promise<void>;
  resumeRecord: () => Promise<void>;
  fetchScenes: () => Promise<void>;
  changeScene: (sceneName: string) => Promise<void>;
  addScene: (sceneName: string) => Promise<void>;
  renameScene: (sceneName: string, newSceneName: string) => Promise<void>;
  removeScene: (sceneName: string) => Promise<void>;
  fetchSources: (sceneName?: string) => Promise<void>;
  toggleSource: (sceneName: string, sceneItemId: number, enabled: boolean) => Promise<void>;
  lockSource: (sceneName: string, sceneItemId: number, locked: boolean) => Promise<void>;
  setVolume: (inputName: string, volumeDb?: number, volumeMul?: number) => Promise<void>;
  toggleMute: (inputName: string, currentMuted: boolean) => Promise<void>;
  mediaControl: (inputName: string, action: string) => Promise<void>;
  toggleStudioMode: (enabled: boolean) => Promise<void>;
  triggerTransition: () => Promise<void>;
  takeScreenshot: (sourceName?: string, imageFormat?: string, imageWidth?: number, imageHeight?: number) => Promise<string | null>;
}

const initialOBSState: OBSState = {
  connected: false,
  connecting: false,
  host: "127.0.0.1",
  port: 4455,
  obsVersion: null,
  isStreaming: false,
  isRecording: false,
  isRecordingPaused: false,
  activeScene: null,
  previewScene: null,
  studioModeEnabled: false,
  currentProfile: null,
  currentCollection: null,
  streamTimecode: "00:00:00",
  recordTimecode: "00:00:00",
  stats: {
    cpuUsage: 0,
    memoryUsage: 0,
    activeFps: 0,
    averageFrameTime: 0,
    renderTotalFrames: 0,
    renderSkippedFrames: 0,
    outputKbitsPerSec: 0,
    outputSkippedFrames: 0,
    outputTotalFrames: 0,
    outputCongestion: 0,
  },
  lastError: null,
};

export const useObsStore = create<OBSStore>((set, get) => ({
  state: initialOBSState,
  scenes: [],
  sources: [],
  audioInputs: [],
  loading: false,
  error: null,
  notification: null,

  setState: (newState) =>
    set((s) => ({
      state: { ...s.state, ...newState },
    })),

  setNotification: (notif) => set({ notification: notif }),

  fetchStatus: async () => {
    try {
      const res = await obsApiService.getStatus();
      if (res.success && res.data) {
        set((s) => ({
          state: {
            ...s.state,
            ...res.data,
            host: res.data.config?.host || s.state.host,
            port: res.data.config?.port || s.state.port,
          },
        }));
        if (res.data.connected) {
          get().fetchScenes();
          get().fetchSources();
        }
      }
    } catch (err: any) {
      console.warn("fetchStatus error:", err.message);
    }
  },

  connect: async (host, port, password) => {
    set({ loading: true, error: null });
    try {
      const res = await obsApiService.connect(host, port, password);
      if (res.success) {
        set({
          loading: false,
          notification: { type: "success", message: res.message || "Berhasil terhubung ke OBS!" },
        });
        await get().fetchStatus();
        return true;
      } else {
        set({
          loading: false,
          error: res.error || "Gagal menghubungkan",
          notification: { type: "error", message: res.error || "Koneksi gagal." },
        });
        return false;
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Gagal menghubungkan ke OBS";
      set({
        loading: false,
        error: msg,
        notification: { type: "error", message: msg },
      });
      return false;
    }
  },

  disconnect: async () => {
    try {
      await obsApiService.disconnect();
      set({
        state: { ...get().state, connected: false, connecting: false },
        scenes: [],
        sources: [],
        audioInputs: [],
        notification: { type: "info", message: "Terputus dari OBS Studio" },
      });
    } catch (err: any) {
      console.error(err);
    }
  },

  startStream: async () => {
    try {
      const res = await obsApiService.startStream();
      set({ notification: { type: "success", message: res.message } });
      await get().fetchStatus();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  stopStream: async () => {
    try {
      const res = await obsApiService.stopStream();
      set({ notification: { type: "info", message: res.message } });
      await get().fetchStatus();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  startRecord: async () => {
    try {
      const res = await obsApiService.startRecord();
      set({ notification: { type: "success", message: res.message } });
      await get().fetchStatus();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  stopRecord: async () => {
    try {
      const res = await obsApiService.stopRecord();
      set({ notification: { type: "info", message: res.message } });
      await get().fetchStatus();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  pauseRecord: async () => {
    try {
      const res = await obsApiService.pauseRecord();
      set({ notification: { type: "info", message: res.message } });
      await get().fetchStatus();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  resumeRecord: async () => {
    try {
      const res = await obsApiService.resumeRecord();
      set({ notification: { type: "success", message: res.message } });
      await get().fetchStatus();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  fetchScenes: async () => {
    try {
      const res = await obsApiService.getScenes();
      if (res.success && res.data) {
        set({
          scenes: res.data.scenes || [],
          state: {
            ...get().state,
            activeScene: res.data.activeScene || get().state.activeScene,
            previewScene: res.data.previewScene || get().state.previewScene,
          },
        });
      }
    } catch (err) {}
  },

  changeScene: async (sceneName) => {
    try {
      const res = await obsApiService.changeScene(sceneName);
      set({
        state: { ...get().state, activeScene: sceneName },
        notification: { type: "success", message: res.message },
      });
      await get().fetchSources(sceneName);
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  addScene: async (sceneName) => {
    try {
      const res = await obsApiService.addScene(sceneName);
      set({ notification: { type: "success", message: res.message } });
      await get().fetchScenes();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  renameScene: async (sceneName, newSceneName) => {
    try {
      const res = await obsApiService.renameScene(sceneName, newSceneName);
      set({ notification: { type: "success", message: res.message } });
      await get().fetchScenes();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  removeScene: async (sceneName) => {
    try {
      const res = await obsApiService.removeScene(sceneName);
      set({ notification: { type: "info", message: res.message } });
      await get().fetchScenes();
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  fetchSources: async (sceneName) => {
    try {
      const res = await obsApiService.getSources(sceneName);
      if (res.success && res.data) {
        set({
          sources: res.data.sources || [],
          audioInputs: res.data.audioInputs || [],
        });
      }
    } catch (err) {}
  },

  toggleSource: async (sceneName, sceneItemId, enabled) => {
    try {
      await obsApiService.toggleSource(sceneName, sceneItemId, enabled);
      set((s) => ({
        sources: s.sources.map((item) =>
          item.sceneItemId === sceneItemId ? { ...item, sceneItemEnabled: enabled } : item
        ),
      }));
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  lockSource: async (sceneName, sceneItemId, locked) => {
    try {
      await obsApiService.lockSource(sceneName, sceneItemId, locked);
      set((s) => ({
        sources: s.sources.map((item) =>
          item.sceneItemId === sceneItemId ? { ...item, sceneItemLocked: locked } : item
        ),
      }));
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  setVolume: async (inputName, volumeDb, volumeMul) => {
    try {
      await obsApiService.volumeSource(inputName, volumeDb, volumeMul);
      set((s) => ({
        audioInputs: s.audioInputs.map((i) =>
          i.inputName === inputName
            ? { ...i, inputVolumeDb: volumeDb !== undefined ? volumeDb : i.inputVolumeDb }
            : i
        ),
      }));
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  toggleMute: async (inputName, currentMuted) => {
    try {
      if (currentMuted) {
        await obsApiService.unmuteSource(inputName);
      } else {
        await obsApiService.muteSource(inputName);
      }
      set((s) => ({
        audioInputs: s.audioInputs.map((i) =>
          i.inputName === inputName ? { ...i, inputMuted: !currentMuted } : i
        ),
      }));
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  mediaControl: async (inputName, action) => {
    try {
      const res = await obsApiService.mediaControl(inputName, action);
      set({ notification: { type: "info", message: res.message } });
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  toggleStudioMode: async (enabled) => {
    try {
      const res = await obsApiService.toggleStudioMode(enabled);
      set({
        state: { ...get().state, studioModeEnabled: enabled },
        notification: { type: "info", message: res.message },
      });
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  triggerTransition: async () => {
    try {
      const res = await obsApiService.studioTransition();
      set({ notification: { type: "success", message: res.message } });
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
    }
  },

  takeScreenshot: async (sourceName, imageFormat, imageWidth, imageHeight) => {
    try {
      const res = await obsApiService.screenshot(sourceName, imageFormat, imageWidth, imageHeight);
      if (res.success && res.data?.imageData) {
        set({ notification: { type: "success", message: "Tangkapan layar berhasil dibuat!" } });
        return res.data.imageData;
      }
      return null;
    } catch (err: any) {
      set({ notification: { type: "error", message: err.response?.data?.error || err.message } });
      return null;
    }
  },
}));
