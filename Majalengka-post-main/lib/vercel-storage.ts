import fs from "fs";
import path from "path";

// Paths
export let SHARES_FILE = path.join(process.cwd(), "shares.json");
export let LIVESTREAM_FILE = path.join(process.cwd(), "livestream.json");
export let SEO_SETTINGS_FILE = path.join(process.cwd(), "seo-settings.json");
export let UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Memory caches
let memoryShares: Record<string, any> | null = null;
let memoryLiveStreamSettings: any = null;
let memorySeoSettings: any = null;

// Determine writeability
try {
  const testFile = path.join(process.cwd(), ".write_test");
  fs.writeFileSync(testFile, "test");
  fs.unlinkSync(testFile);
} catch (e) {
  console.log("Read-only filesystem detected (e.g. Vercel). Using /tmp directory for writable files.");
  SHARES_FILE = "/tmp/shares.json";
  LIVESTREAM_FILE = "/tmp/livestream.json";
  SEO_SETTINGS_FILE = "/tmp/seo-settings.json";
  UPLOADS_DIR = "/tmp/uploads";
}

// Make sure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create UPLOADS_DIR:", err);
  }
}

// Shares functions
export function readShares(): Record<string, { total: number; facebook: number; twitter: number; whatsapp: number; telegram: number; other: number }> {
  if (memoryShares) {
    return memoryShares;
  }
  try {
    if (fs.existsSync(SHARES_FILE)) {
      const content = fs.readFileSync(SHARES_FILE, "utf-8");
      const parsed = JSON.parse(content);
      memoryShares = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Error reading shares.json:", err);
  }
  return {};
}

export function writeShares(data: Record<string, any>) {
  memoryShares = data;
  try {
    fs.writeFileSync(SHARES_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing shares.json:", err);
  }
}

// Livestream functions
export interface LiveStreamSettings {
  active: boolean;
  title: string;
  viewerCount: number;
  streamType: "youtube" | "camera" | "custom";
  streamUrl: string;
}

export const defaultLiveStreamSettings: LiveStreamSettings = {
  active: true,
  title: "Sidang Paripurna DPR & Peninjauan Lokasi Bencana Tol Majalengka",
  viewerCount: 1340,
  streamType: "youtube",
  streamUrl: "https://www.youtube.com/embed/live_stream?channel=UCz3A9S7AecK9BTh40S77Dug"
};

export function readLiveStreamSettings(): LiveStreamSettings {
  if (memoryLiveStreamSettings) {
    return { ...defaultLiveStreamSettings, ...memoryLiveStreamSettings };
  }
  try {
    if (fs.existsSync(LIVESTREAM_FILE)) {
      const content = fs.readFileSync(LIVESTREAM_FILE, "utf-8");
      const parsed = JSON.parse(content);
      memoryLiveStreamSettings = parsed;
      return { ...defaultLiveStreamSettings, ...parsed };
    }
  } catch (err) {
    console.error("Error reading livestream.json:", err);
  }
  return defaultLiveStreamSettings;
}

export function writeLiveStreamSettings(data: LiveStreamSettings) {
  memoryLiveStreamSettings = data;
  try {
    fs.writeFileSync(LIVESTREAM_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing livestream.json:", err);
  }
}

// Webcam frame cache (stored in globalThis to persist across serverless hot reloads)
const globalFrameKey = Symbol.for("currentLiveCameraFrame");
export function getLiveCameraFrame(): string {
  return (globalThis as any)[globalFrameKey] || "";
}

export function setLiveCameraFrame(frame: string) {
  (globalThis as any)[globalFrameKey] = frame;
}

// SEO settings functions
export interface SeoSettings {
  googleSiteVerification: string;
}

export const defaultSeoSettings: SeoSettings = {
  googleSiteVerification: ""
};

export function readSeoSettings(): SeoSettings {
  if (memorySeoSettings) {
    return { ...defaultSeoSettings, ...memorySeoSettings };
  }
  try {
    if (fs.existsSync(SEO_SETTINGS_FILE)) {
      const content = fs.readFileSync(SEO_SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      memorySeoSettings = parsed;
      return { ...defaultSeoSettings, ...parsed };
    }
  } catch (err) {
    console.error("Error reading seo-settings.json:", err);
  }
  return defaultSeoSettings;
}

export function writeSeoSettings(data: SeoSettings) {
  memorySeoSettings = data;
  try {
    fs.writeFileSync(SEO_SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing seo-settings.json:", err);
  }
}
