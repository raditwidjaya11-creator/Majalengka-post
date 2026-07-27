import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useObsStore } from "../store/obsStore";

let socket: Socket | null = null;

export function useObsSocket() {
  const setState = useObsStore((s) => s.setState);
  const fetchScenes = useObsStore((s) => s.fetchScenes);
  const fetchSources = useObsStore((s) => s.fetchSources);
  const fetchStatus = useObsStore((s) => s.fetchStatus);

  useEffect(() => {
    if (!socket) {
      socket = io({
        path: "/socket.io",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 2000,
      });
    }

    socket.on("connect", () => {
      console.log("[OBS Socket] Connected to Express Socket.IO server");
      fetchStatus();
    });

    socket.on("obs:state_update", (updatedState: any) => {
      if (updatedState) {
        setState(updatedState);
      }
    });

    socket.on("obs:event", (eventPayload: { eventType: string; data: any }) => {
      const { eventType } = eventPayload || {};

      switch (eventType) {
        case "CurrentProgramSceneChanged":
        case "CurrentPreviewSceneChanged":
          fetchScenes();
          fetchSources();
          break;
        case "StreamStateChanged":
        case "RecordStateChanged":
        case "StudioModeStateChanged":
          fetchStatus();
          break;
        case "InputMuteStateChanged":
        case "InputVolumeChanged":
        case "SceneItemEnableStateChanged":
          fetchSources();
          break;
        case "ExitStarted":
          setState({ connected: false, isStreaming: false, isRecording: false });
          break;
        default:
          break;
      }
    });

    socket.on("disconnect", () => {
      console.warn("[OBS Socket] Socket disconnected");
    });

    return () => {
      // Keep socket alive for app lifespan or clean up listeners
    };
  }, [setState, fetchScenes, fetchSources, fetchStatus]);
}
