import { Router } from "express";
import { obsRateLimiter, validateRequestBody } from "../middleware/security.js";
import {
  getStatus,
  connectObs,
  disconnectObs,
  startStream,
  stopStream,
  startRecord,
  stopRecord,
  pauseRecord,
  resumeRecord,
  getScenes,
  changeScene,
  addScene,
  renameScene,
  removeScene,
  getSources,
  toggleSource,
  lockSource,
  volumeSource,
  muteSource,
  unmuteSource,
  mediaControl,
  toggleStudioMode,
  studioTransition,
  screenshot,
  getStats,
} from "../controllers/obsController.js";

const router = Router();

// Apply rate limiter on all OBS endpoints
router.use(obsRateLimiter);

// Status & Connections
router.get("/status", getStatus);
router.post("/connect", connectObs);
router.post("/disconnect", disconnectObs);

// Stream Control
router.post("/start-stream", startStream);
router.post("/stop-stream", stopStream);

// Record Control
router.post("/start-record", startRecord);
router.post("/stop-record", stopRecord);
router.post("/pause-record", pauseRecord);
router.post("/resume-record", resumeRecord);

// Scene Management
router.get("/scenes", getScenes);
router.post("/change-scene", validateRequestBody(["sceneName"]), changeScene);
router.post("/scene/add", validateRequestBody(["sceneName"]), addScene);
router.post("/scene/rename", validateRequestBody(["sceneName", "newSceneName"]), renameScene);
router.post("/scene/remove", validateRequestBody(["sceneName"]), removeScene);

// Source & Input Management
router.get("/sources", getSources);
router.post("/source/toggle", validateRequestBody(["sceneName", "sceneItemId", "enabled"]), toggleSource);
router.post("/source/lock", validateRequestBody(["sceneName", "sceneItemId", "locked"]), lockSource);
router.post("/source/volume", validateRequestBody(["inputName"]), volumeSource);
router.post("/source/mute", validateRequestBody(["inputName"]), muteSource);
router.post("/source/unmute", validateRequestBody(["inputName"]), unmuteSource);

// Media Control
router.post("/media/control", validateRequestBody(["inputName", "action"]), mediaControl);

// Studio Mode & Transitions
router.post("/studio-mode/toggle", toggleStudioMode);
router.post("/studio-mode/transition", studioTransition);

// Screenshot & Stats
router.post("/screenshot", screenshot);
router.get("/stats", getStats);

export default router;
