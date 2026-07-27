import OBSWebSocket from "obs-websocket-js";
import { Server as SocketIOServer } from "socket.io";

export interface OBSBackendState {
  connected: boolean;
  connecting: boolean;
  host: string;
  port: number;
  obsVersion: string | null;
  isStreaming: boolean;
  isRecording: boolean;
  isRecordingPaused: boolean;
  activeScene: string | null;
  previewScene: string | null;
  studioModeEnabled: boolean;
  currentProfile: string | null;
  currentCollection: string | null;
  streamTimecode: string;
  recordTimecode: string;
  stats: {
    cpuUsage: number;
    memoryUsage: number;
    activeFps: number;
    averageFrameTime: number;
    renderTotalFrames: number;
    renderSkippedFrames: number;
    outputKbitsPerSec: number;
    outputSkippedFrames: number;
    outputTotalFrames: number;
    outputCongestion: number;
  };
  lastError: string | null;
}

class OBSBackendService {
  private obs: OBSWebSocket = new OBSWebSocket();
  private io: SocketIOServer | null = null;
  private isConnected = false;
  private isConnecting = false;
  private wasConnected = false;
  private consecutiveFailures = 0;
  private maxConsecutiveFailures = 3;
  private autoReconnectTimer: any = null;

  // Connection settings loaded from .env or configured dynamically
  private host = process.env.OBS_HOST || "127.0.0.1";
  private port = parseInt(process.env.OBS_PORT || "4455", 10);
  private password = process.env.OBS_PASSWORD || "";

  private state: OBSBackendState = {
    connected: false,
    connecting: false,
    host: this.host,
    port: this.port,
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

  private telemetryTimer: any = null;

  constructor() {
    this.setupListeners();
  }

  public setSocketServer(ioServer: SocketIOServer) {
    this.io = ioServer;
  }

  public getConfig() {
    return {
      host: this.host,
      port: this.port,
      // Password is NEVER returned to client for security
    };
  }

  public setConfig(host?: string, port?: number, password?: string) {
    if (host) this.host = host;
    if (port) this.port = port;
    if (password !== undefined) this.password = password;
    this.state.host = this.host;
    this.state.port = this.port;
  }

  public getState(): OBSBackendState {
    return { ...this.state };
  }

  private broadcastState() {
    if (this.io) {
      this.io.emit("obs:state_update", this.getState());
    }
  }

  private broadcastEvent(eventType: string, data: any) {
    if (this.io) {
      this.io.emit("obs:event", { eventType, data, timestamp: Date.now() });
    }
  }

  private setupListeners() {
    this.obs.on("ConnectionClosed", (error) => {
      const msg = error?.message || (typeof error === "string" ? error : "Koneksi ke OBS Studio terputus");
      console.warn("[OBS Service] Connection closed:", msg);
      this.isConnected = false;
      this.isConnecting = false;
      this.state.connected = false;
      this.state.connecting = false;
      this.state.lastError = msg;
      this.stopTelemetry();
      this.broadcastState();
      this.broadcastEvent("ConnectionClosed", { message: "Disconnected from OBS" });

      // Trigger auto reconnect only if previously connected and retries remain
      this.scheduleAutoReconnect();
    });

    this.obs.on("ConnectionError", (err: any) => {
      const msg = err?.message || err?.comment || "Gagal menghubungkan ke OBS WebSocket";
      console.warn("[OBS Service] Connection error:", msg);
      this.state.lastError = msg;
      this.broadcastState();
    });

    // Event Listeners for OBS WebSocket v5 events
    this.obs.on("CurrentProgramSceneChanged", (data) => {
      this.state.activeScene = data.sceneName;
      this.broadcastState();
      this.broadcastEvent("CurrentProgramSceneChanged", data);
    });

    this.obs.on("CurrentPreviewSceneChanged", (data) => {
      this.state.previewScene = data.sceneName || null;
      this.broadcastState();
      this.broadcastEvent("CurrentPreviewSceneChanged", data);
    });

    this.obs.on("StreamStateChanged", (data) => {
      this.state.isStreaming = data.outputActive;
      this.broadcastState();
      this.broadcastEvent("StreamStateChanged", data);
    });

    this.obs.on("RecordStateChanged", (data) => {
      this.state.isRecording = data.outputActive;
      this.state.isRecordingPaused = data.outputState === "OBS_WEBSOCKET_OUTPUT_PAUSED";
      this.broadcastState();
      this.broadcastEvent("RecordStateChanged", data);
    });

    this.obs.on("StudioModeStateChanged", (data) => {
      this.state.studioModeEnabled = data.studioModeEnabled;
      this.broadcastState();
      this.broadcastEvent("StudioModeStateChanged", data);
    });

    this.obs.on("InputMuteStateChanged", (data) => {
      this.broadcastEvent("InputMuteStateChanged", data);
    });

    this.obs.on("InputVolumeChanged", (data) => {
      this.broadcastEvent("InputVolumeChanged", data);
    });

    this.obs.on("SceneItemEnableStateChanged", (data) => {
      this.broadcastEvent("SceneItemEnableStateChanged", data);
    });

    this.obs.on("MediaInputPlaybackStarted", (data) => {
      this.broadcastEvent("MediaInputPlaybackStarted", data);
    });

    this.obs.on("MediaInputPlaybackEnded", (data) => {
      this.broadcastEvent("MediaInputPlaybackEnded", data);
    });

    this.obs.on("ExitStarted", () => {
      this.broadcastEvent("ExitStarted", {});
      this.disconnect();
    });
  }

  private scheduleAutoReconnect() {
    if (this.autoReconnectTimer) clearTimeout(this.autoReconnectTimer);
    
    // Do not attempt auto-reconnect if we never successfully connected,
    // or if we have exceeded the max consecutive failure limit.
    if (!this.wasConnected || this.consecutiveFailures >= this.maxConsecutiveFailures) {
      console.info("[OBS Service] Auto-reconnect stopped (max retries reached or server offline).");
      return;
    }

    this.autoReconnectTimer = setTimeout(() => {
      console.log(`[OBS Service] Attempting auto-reconnect (attempt ${this.consecutiveFailures + 1}/${this.maxConsecutiveFailures})...`);
      this.connect().catch(() => {});
    }, 5000);
  }

  public async connect(customHost?: string, customPort?: number, customPassword?: string): Promise<boolean> {
    // If explicitly called with custom credentials, reset failure counter
    if (customHost !== undefined || customPort !== undefined || customPassword !== undefined) {
      this.consecutiveFailures = 0;
    }

    if (customHost) this.host = customHost;
    if (customPort) this.port = customPort;
    if (customPassword !== undefined) this.password = customPassword;

    this.state.host = this.host;
    this.state.port = this.port;

    if (this.isConnected) {
      return true;
    }

    if (this.isConnecting) {
      return false;
    }

    this.isConnecting = true;
    this.state.connecting = true;
    this.state.lastError = null;
    this.broadcastState();

    const address = `ws://${this.host}:${this.port}`;
    try {
      console.log(`[OBS Service] Connecting to ${address}...`);
      const { obsWebSocketVersion } = await this.obs.connect(address, this.password || undefined);

      this.isConnected = true;
      this.isConnecting = false;
      this.wasConnected = true;
      this.consecutiveFailures = 0;
      this.state.connected = true;
      this.state.connecting = false;
      this.state.obsVersion = obsWebSocketVersion || "5.0";
      this.state.lastError = null;

      if (this.autoReconnectTimer) {
        clearTimeout(this.autoReconnectTimer);
        this.autoReconnectTimer = null;
      }

      await this.refreshInitialStatus();
      this.startTelemetry();
      this.broadcastState();
      this.broadcastEvent("Connected", { obsWebSocketVersion });
      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.isConnecting = false;
      this.consecutiveFailures++;
      this.state.connected = false;
      this.state.connecting = false;
      this.state.lastError = err?.comment || err?.message || "Gagal terhubung ke OBS WebSocket Server";
      console.warn(`[OBS Service] Connect error (${address}):`, this.state.lastError);
      this.broadcastState();
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.autoReconnectTimer) {
      clearTimeout(this.autoReconnectTimer);
      this.autoReconnectTimer = null;
    }
    this.stopTelemetry();
    try {
      await this.obs.disconnect();
    } catch (e) {}
    this.isConnected = false;
    this.isConnecting = false;
    this.state.connected = false;
    this.state.connecting = false;
    this.broadcastState();
  }

  public async refreshInitialStatus(): Promise<void> {
    if (!this.isConnected) return;
    try {
      // 1. Get Stream Status
      const streamRes = await this.obs.call("GetStreamStatus").catch(() => null);
      if (streamRes) {
        this.state.isStreaming = streamRes.outputActive;
        this.state.streamTimecode = streamRes.outputTimecode || "00:00:00";
      }

      // 2. Get Record Status
      const recordRes = await this.obs.call("GetRecordStatus").catch(() => null);
      if (recordRes) {
        this.state.isRecording = recordRes.outputActive;
        this.state.isRecordingPaused = recordRes.outputPaused || false;
        this.state.recordTimecode = recordRes.outputTimecode || "00:00:00";
      }

      // 3. Get Scenes
      const sceneRes = await this.obs.call("GetSceneList").catch(() => null);
      if (sceneRes) {
        this.state.activeScene = sceneRes.currentProgramSceneName || null;
        this.state.previewScene = sceneRes.currentPreviewSceneName || null;
      }

      // 4. Studio Mode State
      const studioRes = await this.obs.call("GetStudioModeEnabled").catch(() => null);
      if (studioRes) {
        this.state.studioModeEnabled = studioRes.studioModeEnabled;
      }

      // 5. Profiles & Collections
      const profileRes = await this.obs.call("GetProfileList").catch(() => null);
      if (profileRes) {
        this.state.currentProfile = profileRes.currentProfileName || null;
      }

      const collectionRes = await this.obs.call("GetSceneCollectionList").catch(() => null);
      if (collectionRes) {
        this.state.currentCollection = collectionRes.currentSceneCollectionName || null;
      }
    } catch (err) {
      console.warn("[OBS Service] Error refreshing initial status:", err);
    }
  }

  private startTelemetry() {
    this.stopTelemetry();
    this.telemetryTimer = setInterval(async () => {
      if (!this.isConnected) return;
      try {
        const stats = await this.obs.call("GetStats").catch(() => null);
        const streamStatus = await this.obs.call("GetStreamStatus").catch(() => null);
        const recordStatus = await this.obs.call("GetRecordStatus").catch(() => null);

        if (stats) {
          this.state.stats.cpuUsage = stats.cpuUsage || 0;
          this.state.stats.memoryUsage = stats.memoryUsage || 0;
          this.state.stats.activeFps = Math.round(stats.activeFps || 0);
          this.state.stats.averageFrameTime = stats.averageFrameTime || 0;
          this.state.stats.renderTotalFrames = stats.renderTotalFrames || 0;
          this.state.stats.renderSkippedFrames = stats.renderSkippedFrames || 0;
        }

        if (streamStatus) {
          this.state.isStreaming = streamStatus.outputActive;
          this.state.streamTimecode = streamStatus.outputTimecode || "00:00:00";
          this.state.stats.outputKbitsPerSec = streamStatus.outputKbitsPerSec || 0;
          this.state.stats.outputSkippedFrames = streamStatus.outputSkippedFrames || 0;
          this.state.stats.outputTotalFrames = streamStatus.outputTotalFrames || 0;
          this.state.stats.outputCongestion = streamStatus.outputCongestion || 0;
        }

        if (recordStatus) {
          this.state.isRecording = recordStatus.outputActive;
          this.state.isRecordingPaused = recordStatus.outputPaused || false;
          this.state.recordTimecode = recordStatus.outputTimecode || "00:00:00";
        }

        this.broadcastState();
      } catch (e) {}
    }, 1500);
  }

  private stopTelemetry() {
    if (this.telemetryTimer) {
      clearInterval(this.telemetryTimer);
      this.telemetryTimer = null;
    }
  }

  // ======================
  // OBS Action Methods
  // ======================

  public async startStream() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("StartStream");
    this.state.isStreaming = true;
    this.broadcastState();
  }

  public async stopStream() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("StopStream");
    this.state.isStreaming = false;
    this.broadcastState();
  }

  public async startRecord() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("StartRecord");
    this.state.isRecording = true;
    this.state.isRecordingPaused = false;
    this.broadcastState();
  }

  public async stopRecord() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("StopRecord");
    this.state.isRecording = false;
    this.state.isRecordingPaused = false;
    this.broadcastState();
  }

  public async pauseRecord() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("PauseRecord");
    this.state.isRecordingPaused = true;
    this.broadcastState();
  }

  public async resumeRecord() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("ResumeRecord");
    this.state.isRecordingPaused = false;
    this.broadcastState();
  }

  public async getSceneList() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    const res = await this.obs.call("GetSceneList");
    return {
      activeScene: res.currentProgramSceneName,
      previewScene: res.currentPreviewSceneName,
      scenes: (res.scenes || []).map((s: any) => ({
        sceneName: s.sceneName,
        sceneIndex: s.sceneIndex,
      })),
    };
  }

  public async setCurrentProgramScene(sceneName: string) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetCurrentProgramScene", { sceneName });
    this.state.activeScene = sceneName;
    this.broadcastState();
  }

  public async createScene(sceneName: string) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("CreateScene", { sceneName });
  }

  public async setSceneName(sceneName: string, newSceneName: string) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetSceneName", { sceneName, newSceneName });
  }

  public async removeScene(sceneName: string) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("RemoveScene", { sceneName });
  }

  public async getSourcesList(sceneName?: string) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    const targetScene = sceneName || this.state.activeScene;
    if (!targetScene) return { sources: [], audioInputs: [] };

    const itemsRes = await this.obs.call("GetSceneItemList", { sceneName: targetScene }).catch(() => ({ sceneItems: [] }));
    const inputsRes = await this.obs.call("GetInputList").catch(() => ({ inputs: [] }));

    const sources = (itemsRes.sceneItems || []).map((item: any) => ({
      sceneItemId: item.sceneItemId,
      sourceName: item.sourceName,
      sourceType: item.inputKind || item.sourceType || "Item",
      sceneItemEnabled: item.sceneItemEnabled,
      sceneItemLocked: item.sceneItemLocked,
    }));

    const audioInputs = await Promise.all(
      (inputsRes.inputs || [])
        .filter((i: any) => i.inputKind?.includes("audio") || i.inputKind?.includes("mic") || i.inputKind?.includes("wasapi"))
        .map(async (i: any) => {
          const muteRes = await this.obs.call("GetInputMute", { inputName: i.inputName }).catch(() => ({ inputMuted: false }));
          const volRes = await this.obs.call("GetInputVolume", { inputName: i.inputName }).catch(() => ({ inputVolumeDb: 0, inputVolumeMul: 1 }));
          return {
            inputName: i.inputName,
            inputKind: i.inputKind,
            inputMuted: muteRes.inputMuted,
            inputVolumeDb: volRes.inputVolumeDb,
            inputVolumeMul: volRes.inputVolumeMul,
          };
        })
    );

    return { sources, audioInputs };
  }

  public async toggleSourceVisibility(sceneName: string, sceneItemId: number, enabled: boolean) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetSceneItemEnabled", { sceneName, sceneItemId, sceneItemEnabled: enabled });
  }

  public async lockSource(sceneName: string, sceneItemId: number, locked: boolean) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetSceneItemLocked", { sceneName, sceneItemId, sceneItemLocked: locked });
  }

  public async setSourceVolume(inputName: string, volumeDb?: number, volumeMul?: number) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetInputVolume", {
      inputName,
      inputVolumeDb: volumeDb,
      inputVolumeMul: volumeMul,
    });
  }

  public async setSourceMute(inputName: string, mute: boolean) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetInputMute", { inputName, inputMuted: mute });
  }

  public async mediaControl(inputName: string, mediaAction: "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY" | "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PAUSE" | "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_STOP" | "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART" | "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NEXT" | "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PREVIOUS") {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("TriggerMediaInputAction", { inputName, mediaAction });
  }

  public async toggleStudioMode(enabled: boolean) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("SetStudioModeEnabled", { studioModeEnabled: enabled });
    this.state.studioModeEnabled = enabled;
    this.broadcastState();
  }

  public async triggerStudioTransition() {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    await this.obs.call("TriggerStudioModeTransition");
  }

  public async saveSourceScreenshot(sourceName: string, imageFormat: string = "png", imageWidth?: number, imageHeight?: number) {
    if (!this.isConnected) throw new Error("OBS WebSocket belum terhubung.");
    const targetSource = sourceName || this.state.activeScene || "";
    const res = await this.obs.call("GetSourceScreenshot", {
      sourceName: targetSource,
      imageFormat,
      imageWidth,
      imageHeight,
    });
    return res.imageData; // base64 encoded data URI string
  }
}

export const obsBackendService = new OBSBackendService();
