export type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "CONNECTING";

export interface OBSStats {
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
}

export interface OBSState {
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
  stats: OBSStats;
  lastError: string | null;
}

export interface OBSScene {
  sceneName: string;
  sceneIndex: number;
}

export interface OBSSource {
  sceneItemId: number;
  sourceName: string;
  sourceType: string;
  sceneItemEnabled: boolean;
  sceneItemLocked: boolean;
}

export interface OBSAudioInput {
  inputName: string;
  inputKind: string;
  inputMuted: boolean;
  inputVolumeDb: number;
  inputVolumeMul: number;
}

export interface OBSEventData {
  eventType: string;
  data: any;
  timestamp: number;
}
