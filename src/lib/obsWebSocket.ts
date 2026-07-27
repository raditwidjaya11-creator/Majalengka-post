// OBS WebSocket v5 Protocol Client implementation for AI Studio / Majalengka Post
// Full real-time OBS Studio remote control & telemetry monitoring via WebSocket (ws/wss)

export type OBSConnectionState = 
  | "DISCONNECTED" 
  | "CONNECTING" 
  | "AUTHENTICATING" 
  | "CONNECTED" 
  | "AUTH_FAILED" 
  | "ERROR";

export interface OBSStreamStatus {
  outputActive: boolean;
  outputReconnecting: boolean;
  outputTimecode: string;
  outputDuration: number; // in ms
  outputCongestion: number;
  outputBytes: number;
  outputKbitsPerSec: number;
  outputSkippedFrames: number;
  outputTotalFrames: number;
}

export interface OBSStats {
  cpuUsage: number;
  memoryUsage: number;
  activeFps: number;
  averageFrameTime: number;
  renderTotalFrames: number;
  renderSkippedFrames: number;
}

export interface OBSScene {
  sceneName: string;
  sceneIndex: number;
}

export interface OBSAudioInput {
  inputName: string;
  inputKind: string;
  inputMuted: boolean;
  inputVolumeDb?: number;
}

export interface OBSState {
  connectionState: OBSConnectionState;
  errorMessage: string | null;
  obsVersion: string | null;
  isStreaming: boolean;
  isRecording: boolean;
  activeScene: string | null;
  scenes: OBSScene[];
  streamStatus: OBSStreamStatus | null;
  stats: OBSStats | null;
  audioInputs: OBSAudioInput[];
}

async function sha256Base64(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  let binary = "";
  for (let i = 0; i < hashArray.length; i++) {
    binary += String.fromCharCode(hashArray[i]);
  }
  return btoa(binary);
}

export class OBSWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = "ws://localhost:4455";
  private password: string = "";
  private requestIdCounter = 0;
  private responseCallbacks: Map<string, { resolve: (data: any) => void; reject: (err: any) => void }> = new Map();
  private stateChangeListeners: Set<(state: OBSState) => void> = new Set();

  private currentState: OBSState = {
    connectionState: "DISCONNECTED",
    errorMessage: null,
    obsVersion: null,
    isStreaming: false,
    isRecording: false,
    activeScene: null,
    scenes: [],
    streamStatus: null,
    stats: null,
    audioInputs: [],
  };

  private telemetryInterval: any = null;

  constructor() {}

  public getState(): OBSState {
    return { ...this.currentState };
  }

  public subscribe(listener: (state: OBSState) => void) {
    this.stateChangeListeners.add(listener);
    listener(this.getState());
    return () => {
      this.stateChangeListeners.delete(listener);
    };
  }

  private updateState(partial: Partial<OBSState>) {
    this.currentState = { ...this.currentState, ...partial };
    this.stateChangeListeners.forEach(fn => fn(this.getState()));
  }

  public async connect(url: string = "ws://localhost:4455", password: string = ""): Promise<boolean> {
    this.disconnect();

    this.url = url || "ws://localhost:4455";
    this.password = password || "";

    this.updateState({
      connectionState: "CONNECTING",
      errorMessage: null,
    });

    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          // Connection opened, wait for Opcode 0 (Hello)
        };

        this.ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data);
            await this.handleOpcode(message, resolve);
          } catch (err) {
            console.error("[OBS WS] Failed to parse message:", err);
          }
        };

        this.ws.onerror = (err) => {
          console.warn("[OBS WS] Error:", err);
          this.updateState({
            connectionState: "ERROR",
            errorMessage: "Koneksi ke OBS WebSocket gagal. Pastikan OBS Studio berjalan & opsi WebSocket Server aktif di menu Tools -> WebSocket Server Settings.",
          });
          resolve(false);
        };

        this.ws.onclose = () => {
          this.stopTelemetryPolling();
          this.updateState({
            connectionState: "DISCONNECTED",
          });
        };
      } catch (err: any) {
        this.updateState({
          connectionState: "ERROR",
          errorMessage: err.message || "Gagal membuka socket WebSocket.",
        });
        resolve(false);
      }
    });
  }

  public disconnect() {
    this.stopTelemetryPolling();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.updateState({
      connectionState: "DISCONNECTED",
      obsVersion: null,
      isStreaming: false,
      isRecording: false,
      activeScene: null,
      scenes: [],
      streamStatus: null,
      stats: null,
    });
  }

  private async handleOpcode(msg: any, connectResolve?: (success: boolean) => void) {
    const { op, d } = msg;

    switch (op) {
      case 0: { // Hello
        const obsVersion = d?.obsWebSocketVersion || "5.0";
        this.updateState({ obsVersion });

        let authResponse: string | undefined = undefined;
        if (d?.authentication) {
          this.updateState({ connectionState: "AUTHENTICATING" });
          const { salt, challenge } = d.authentication;
          if (!this.password) {
            this.updateState({
              connectionState: "AUTH_FAILED",
              errorMessage: "OBS memerlukan kata sandi. Silakan masukkan password di panel pengaturan.",
            });
            if (connectResolve) connectResolve(false);
            this.disconnect();
            return;
          }
          const secret = await sha256Base64(this.password + salt);
          authResponse = await sha256Base64(secret + challenge);
        }

        // Send Identify (Opcode 1)
        const identifyPayload = {
          op: 1,
          d: {
            rpcVersion: 1,
            authentication: authResponse,
            eventSubscriptions: 33, // General + Scenes + Inputs + Outputs
          },
        };
        this.ws?.send(JSON.stringify(identifyPayload));
        break;
      }

      case 2: { // Identified
        this.updateState({
          connectionState: "CONNECTED",
          errorMessage: null,
        });
        if (connectResolve) connectResolve(true);

        // Fetch initial data & start telemetry loop
        await this.refreshInitialData();
        this.startTelemetryPolling();
        break;
      }

      case 5: { // Event
        this.handleObsEvent(d);
        break;
      }

      case 7: { // RequestResponse
        const requestId = d?.requestId;
        if (requestId && this.responseCallbacks.has(requestId)) {
          const { resolve, reject } = this.responseCallbacks.get(requestId)!;
          this.responseCallbacks.delete(requestId);
          if (d.requestStatus?.result) {
            resolve(d.responseData || {});
          } else {
            reject(new Error(d.requestStatus?.comment || "Request failed"));
          }
        }
        break;
      }
    }
  }

  private handleObsEvent(eventData: any) {
    const { eventType, eventData: payload } = eventData || {};
    if (!eventType) return;

    if (eventType === "StreamStateChanged") {
      const active = payload?.outputActive ?? false;
      this.updateState({ isStreaming: active });
    } else if (eventType === "RecordStateChanged") {
      const active = payload?.outputActive ?? false;
      this.updateState({ isRecording: active });
    } else if (eventType === "CurrentProgramSceneChanged") {
      this.updateState({ activeScene: payload?.sceneName || null });
    }
  }

  public sendRequest(requestType: string, requestData?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.currentState.connectionState !== "CONNECTED") {
        reject(new Error("OBS WebSocket belum terhubung."));
        return;
      }

      const requestId = `req_${++this.requestIdCounter}_${Date.now()}`;
      this.responseCallbacks.set(requestId, { resolve, reject });

      const payload = {
        op: 6,
        d: {
          requestType,
          requestId,
          requestData: requestData || {},
        },
      };

      this.ws.send(JSON.stringify(payload));

      // Timeout safety
      setTimeout(() => {
        if (this.responseCallbacks.has(requestId)) {
          this.responseCallbacks.delete(requestId);
          reject(new Error(`Timeout menunggu respon '${requestType}' dari OBS.`));
        }
      }, 5000);
    });
  }

  public async refreshInitialData() {
    try {
      // 1. Stream Status
      const streamRes = await this.sendRequest("GetStreamStatus").catch(() => null);
      const isStreaming = streamRes?.outputActive ?? false;

      // 2. Record Status
      const recordRes = await this.sendRequest("GetRecordStatus").catch(() => null);
      const isRecording = recordRes?.outputActive ?? false;

      // 3. Scene List
      const scenesRes = await this.sendRequest("GetSceneList").catch(() => null);
      const scenes: OBSScene[] = (scenesRes?.scenes || []).map((s: any) => ({
        sceneName: s.sceneName,
        sceneIndex: s.sceneIndex,
      }));
      const activeScene = scenesRes?.currentProgramSceneName || (scenes[0]?.sceneName ?? null);

      // 4. Inputs
      const inputsRes = await this.sendRequest("GetInputList").catch(() => null);
      const audioInputs: OBSAudioInput[] = (inputsRes?.inputs || [])
        .filter((i: any) => i.inputKind?.includes("audio") || i.inputKind?.includes("mic") || i.inputKind?.includes("wasapi"))
        .map((i: any) => ({
          inputName: i.inputName,
          inputKind: i.inputKind,
          inputMuted: false,
        }));

      this.updateState({
        isStreaming,
        isRecording,
        scenes,
        activeScene,
        audioInputs,
      });
    } catch (err) {
      console.warn("[OBS WS] Refresh initial data error:", err);
    }
  }

  private startTelemetryPolling() {
    this.stopTelemetryPolling();
    this.telemetryInterval = setInterval(async () => {
      if (this.currentState.connectionState !== "CONNECTED") return;
      try {
        const streamStatus = await this.sendRequest("GetStreamStatus").catch(() => null);
        const stats = await this.sendRequest("GetStats").catch(() => null);

        this.updateState({
          isStreaming: streamStatus?.outputActive ?? this.currentState.isStreaming,
          streamStatus: streamStatus ? {
            outputActive: streamStatus.outputActive,
            outputReconnecting: streamStatus.outputReconnecting,
            outputTimecode: streamStatus.outputTimecode || "00:00:00",
            outputDuration: streamStatus.outputDuration || 0,
            outputCongestion: streamStatus.outputCongestion || 0,
            outputBytes: streamStatus.outputBytes || 0,
            outputKbitsPerSec: streamStatus.outputKbitsPerSec || 0,
            outputSkippedFrames: streamStatus.outputSkippedFrames || 0,
            outputTotalFrames: streamStatus.outputTotalFrames || 0,
          } : null,
          stats: stats ? {
            cpuUsage: stats.cpuUsage || 0,
            memoryUsage: stats.memoryUsage || 0,
            activeFps: Math.round(stats.activeFps || 0),
            averageFrameTime: stats.averageFrameTime || 0,
            renderTotalFrames: stats.renderTotalFrames || 0,
            renderSkippedFrames: stats.renderSkippedFrames || 0,
          } : null,
        });
      } catch (e) {}
    }, 2000);
  }

  private stopTelemetryPolling() {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
  }

  // OBS Control Actions
  public async toggleStream(): Promise<boolean> {
    const res = await this.sendRequest("ToggleStream");
    const active = res?.outputActive ?? !this.currentState.isStreaming;
    this.updateState({ isStreaming: active });
    return active;
  }

  public async startStream(): Promise<void> {
    await this.sendRequest("StartStream");
    this.updateState({ isStreaming: true });
  }

  public async stopStream(): Promise<void> {
    await this.sendRequest("StopStream");
    this.updateState({ isStreaming: false });
  }

  public async toggleRecord(): Promise<boolean> {
    const res = await this.sendRequest("ToggleRecord");
    const active = res?.outputActive ?? !this.currentState.isRecording;
    this.updateState({ isRecording: active });
    return active;
  }

  public async switchScene(sceneName: string): Promise<void> {
    await this.sendRequest("SetCurrentProgramScene", { sceneName });
    this.updateState({ activeScene: sceneName });
  }

  public async toggleInputMute(inputName: string): Promise<boolean> {
    const res = await this.sendRequest("ToggleInputMute", { inputName });
    const isMuted = res?.inputMuted ?? false;

    const updatedAudio = this.currentState.audioInputs.map(i => 
      i.inputName === inputName ? { ...i, inputMuted: isMuted } : i
    );
    this.updateState({ audioInputs: updatedAudio });
    return isMuted;
  }
}

export const globalObsClient = new OBSWebSocketClient();
