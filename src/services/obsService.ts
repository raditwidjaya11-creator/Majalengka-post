import axios from "axios";
import { OBSState, OBSScene, OBSSource, OBSAudioInput } from "../types/obs";

const api = axios.create({
  baseURL: "/api/obs",
  headers: {
    "Content-Type": "application/json",
  },
});

export const obsApiService = {
  async getStatus(): Promise<{ success: boolean; data: OBSState & { config: { host: string; port: number } } }> {
    const res = await api.get("/status");
    return res.data;
  },

  async connect(host?: string, port?: number, password?: string): Promise<{ success: boolean; message?: string; error?: string; data?: OBSState }> {
    const res = await api.post("/connect", { host, port, password });
    return res.data;
  },

  async disconnect(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/disconnect");
    return res.data;
  },

  async startStream(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/start-stream");
    return res.data;
  },

  async stopStream(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/stop-stream");
    return res.data;
  },

  async startRecord(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/start-record");
    return res.data;
  },

  async stopRecord(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/stop-record");
    return res.data;
  },

  async pauseRecord(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/pause-record");
    return res.data;
  },

  async resumeRecord(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/resume-record");
    return res.data;
  },

  async getScenes(): Promise<{ success: boolean; data: { activeScene: string; previewScene: string; scenes: OBSScene[] } }> {
    const res = await api.get("/scenes");
    return res.data;
  },

  async changeScene(sceneName: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/change-scene", { sceneName });
    return res.data;
  },

  async addScene(sceneName: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/scene/add", { sceneName });
    return res.data;
  },

  async renameScene(sceneName: string, newSceneName: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/scene/rename", { sceneName, newSceneName });
    return res.data;
  },

  async removeScene(sceneName: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/scene/remove", { sceneName });
    return res.data;
  },

  async getSources(sceneName?: string): Promise<{ success: boolean; data: { sources: OBSSource[]; audioInputs: OBSAudioInput[] } }> {
    const res = await api.get("/sources", { params: { sceneName } });
    return res.data;
  },

  async toggleSource(sceneName: string, sceneItemId: number, enabled: boolean): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/source/toggle", { sceneName, sceneItemId, enabled });
    return res.data;
  },

  async lockSource(sceneName: string, sceneItemId: number, locked: boolean): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/source/lock", { sceneName, sceneItemId, locked });
    return res.data;
  },

  async volumeSource(inputName: string, volumeDb?: number, volumeMul?: number): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/source/volume", { inputName, volumeDb, volumeMul });
    return res.data;
  },

  async muteSource(inputName: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/source/mute", { inputName });
    return res.data;
  },

  async unmuteSource(inputName: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/source/unmute", { inputName });
    return res.data;
  },

  async mediaControl(inputName: string, action: string): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/media/control", { inputName, action });
    return res.data;
  },

  async toggleStudioMode(enabled: boolean): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/studio-mode/toggle", { enabled });
    return res.data;
  },

  async studioTransition(): Promise<{ success: boolean; message: string }> {
    const res = await api.post("/studio-mode/transition");
    return res.data;
  },

  async screenshot(sourceName?: string, imageFormat?: string, imageWidth?: number, imageHeight?: number): Promise<{ success: boolean; data: { imageData: string } }> {
    const res = await api.post("/screenshot", { sourceName, imageFormat, imageWidth, imageHeight });
    return res.data;
  },

  async getStats(): Promise<{ success: boolean; data: any }> {
    const res = await api.get("/stats");
    return res.data;
  },
};
