import { Request, Response } from "express";
import { obsBackendService } from "../services/obsService.js";

/**
 * Controller for OBS Studio WebSocket operations.
 */

export async function getStatus(req: Request, res: Response) {
  try {
    const state = obsBackendService.getState();
    const config = obsBackendService.getConfig();
    return res.json({
      success: true,
      data: {
        ...state,
        config,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function connectObs(req: Request, res: Response) {
  try {
    const { host, port, password } = req.body || {};
    const success = await obsBackendService.connect(host, port ? parseInt(port, 10) : undefined, password);
    const state = obsBackendService.getState();

    if (success) {
      return res.json({
        success: true,
        message: "Berhasil terhubung ke OBS Studio!",
        data: state,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: state.lastError || "Gagal menghubungkan ke OBS Studio.",
        data: state,
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function disconnectObs(req: Request, res: Response) {
  try {
    await obsBackendService.disconnect();
    return res.json({
      success: true,
      message: "Koneksi ke OBS Studio berhasil diputuskan.",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function startStream(req: Request, res: Response) {
  try {
    await obsBackendService.startStream();
    return res.json({
      success: true,
      message: "Siaran langsung (Streaming) OBS telah dimulai.",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function stopStream(req: Request, res: Response) {
  try {
    await obsBackendService.stopStream();
    return res.json({
      success: true,
      message: "Siaran langsung (Streaming) OBS telah dihentikan.",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function startRecord(req: Request, res: Response) {
  try {
    await obsBackendService.startRecord();
    return res.json({
      success: true,
      message: "Perekaman (Recording) OBS telah dimulai.",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function stopRecord(req: Request, res: Response) {
  try {
    await obsBackendService.stopRecord();
    return res.json({
      success: true,
      message: "Perekaman (Recording) OBS telah dihentikan.",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function pauseRecord(req: Request, res: Response) {
  try {
    await obsBackendService.pauseRecord();
    return res.json({
      success: true,
      message: "Perekaman OBS dijeda (Paused).",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function resumeRecord(req: Request, res: Response) {
  try {
    await obsBackendService.resumeRecord();
    return res.json({
      success: true,
      message: "Perekaman OBS dilanjutkan (Resumed).",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function getScenes(req: Request, res: Response) {
  try {
    const result = await obsBackendService.getSceneList();
    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function changeScene(req: Request, res: Response) {
  try {
    const { sceneName } = req.body || {};
    if (!sceneName) {
      return res.status(400).json({ success: false, error: "Nama scene (sceneName) wajib diisi." });
    }
    await obsBackendService.setCurrentProgramScene(sceneName);
    return res.json({
      success: true,
      message: `Scene OBS berhasil diubah ke: '${sceneName}'`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function addScene(req: Request, res: Response) {
  try {
    const { sceneName } = req.body || {};
    if (!sceneName) {
      return res.status(400).json({ success: false, error: "Nama scene baru wajib diisi." });
    }
    await obsBackendService.createScene(sceneName);
    return res.json({
      success: true,
      message: `Scene '${sceneName}' berhasil ditambahkan ke OBS.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function renameScene(req: Request, res: Response) {
  try {
    const { sceneName, newSceneName } = req.body || {};
    if (!sceneName || !newSceneName) {
      return res.status(400).json({ success: false, error: "sceneName dan newSceneName wajib diisi." });
    }
    await obsBackendService.setSceneName(sceneName, newSceneName);
    return res.json({
      success: true,
      message: `Scene '${sceneName}' diubah namanya menjadi '${newSceneName}'.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function removeScene(req: Request, res: Response) {
  try {
    const { sceneName } = req.body || {};
    if (!sceneName) {
      return res.status(400).json({ success: false, error: "Nama scene wajib diisi." });
    }
    await obsBackendService.removeScene(sceneName);
    return res.json({
      success: true,
      message: `Scene '${sceneName}' berhasil dihapus dari OBS.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function getSources(req: Request, res: Response) {
  try {
    const sceneName = (req.query.sceneName as string) || undefined;
    const result = await obsBackendService.getSourcesList(sceneName);
    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function toggleSource(req: Request, res: Response) {
  try {
    const { sceneName, sceneItemId, enabled } = req.body || {};
    if (!sceneName || sceneItemId === undefined || enabled === undefined) {
      return res.status(400).json({ success: false, error: "sceneName, sceneItemId, dan enabled wajib diisi." });
    }
    await obsBackendService.toggleSourceVisibility(sceneName, Number(sceneItemId), Boolean(enabled));
    return res.json({
      success: true,
      message: `Visibilitas source ID ${sceneItemId} berhasil diperbarui.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function lockSource(req: Request, res: Response) {
  try {
    const { sceneName, sceneItemId, locked } = req.body || {};
    if (!sceneName || sceneItemId === undefined || locked === undefined) {
      return res.status(400).json({ success: false, error: "sceneName, sceneItemId, dan locked wajib diisi." });
    }
    await obsBackendService.lockSource(sceneName, Number(sceneItemId), Boolean(locked));
    return res.json({
      success: true,
      message: `Status lock source ID ${sceneItemId} diperbarui.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function volumeSource(req: Request, res: Response) {
  try {
    const { inputName, volumeDb, volumeMul } = req.body || {};
    if (!inputName) {
      return res.status(400).json({ success: false, error: "inputName wajib diisi." });
    }
    await obsBackendService.setSourceVolume(inputName, volumeDb !== undefined ? Number(volumeDb) : undefined, volumeMul !== undefined ? Number(volumeMul) : undefined);
    return res.json({
      success: true,
      message: `Volume audio '${inputName}' berhasil diperbarui.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function muteSource(req: Request, res: Response) {
  try {
    const { inputName } = req.body || {};
    if (!inputName) {
      return res.status(400).json({ success: false, error: "inputName wajib diisi." });
    }
    await obsBackendService.setSourceMute(inputName, true);
    return res.json({
      success: true,
      message: `Audio '${inputName}' di-mute.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function unmuteSource(req: Request, res: Response) {
  try {
    const { inputName } = req.body || {};
    if (!inputName) {
      return res.status(400).json({ success: false, error: "inputName wajib diisi." });
    }
    await obsBackendService.setSourceMute(inputName, false);
    return res.json({
      success: true,
      message: `Audio '${inputName}' di-unmute.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function mediaControl(req: Request, res: Response) {
  try {
    const { inputName, action } = req.body || {};
    if (!inputName || !action) {
      return res.status(400).json({ success: false, error: "inputName dan action wajib diisi." });
    }

    let obsAction: any = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY";
    const act = String(action).toLowerCase();
    if (act === "play") obsAction = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY";
    else if (act === "pause") obsAction = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PAUSE";
    else if (act === "stop") obsAction = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_STOP";
    else if (act === "restart") obsAction = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART";
    else if (act === "next") obsAction = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NEXT";
    else if (act === "previous") obsAction = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PREVIOUS";

    await obsBackendService.mediaControl(inputName, obsAction);
    return res.json({
      success: true,
      message: `Aksi media '${action}' dikirim ke '${inputName}'.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function toggleStudioMode(req: Request, res: Response) {
  try {
    const { enabled } = req.body || {};
    await obsBackendService.toggleStudioMode(Boolean(enabled));
    return res.json({
      success: true,
      message: `Studio Mode ${enabled ? "Diaktifkan" : "Dinonaktifkan"}.`,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function studioTransition(req: Request, res: Response) {
  try {
    await obsBackendService.triggerStudioTransition();
    return res.json({
      success: true,
      message: "Transisi Studio Mode berhasil dipicu.",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function screenshot(req: Request, res: Response) {
  try {
    const { sourceName, imageFormat, imageWidth, imageHeight } = req.body || {};
    const imageData = await obsBackendService.saveSourceScreenshot(sourceName, imageFormat || "png", imageWidth, imageHeight);
    return res.json({
      success: true,
      data: {
        imageData,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const state = obsBackendService.getState();
    return res.json({
      success: true,
      data: {
        stats: state.stats,
        isStreaming: state.isStreaming,
        isRecording: state.isRecording,
        streamTimecode: state.streamTimecode,
        recordTimecode: state.recordTimecode,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
