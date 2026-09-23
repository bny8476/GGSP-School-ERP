import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "./utils";
import { getQueryClient } from "@/providers/QueryProvider";

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (typeof window === "undefined") {
    return null as unknown as Socket;
  }

  if (!socketInstance) {
    const apiBase = getApiBaseUrl();
    const token = localStorage.getItem("token");

    socketInstance = io(apiBase, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      // Socket connected
    });

    socketInstance.on("connect_error", (error) => {
      console.warn("Real-time socket connection notice:", error.message);
    });

    // Central event listeners that automatically invalidate TanStack queries
    socketInstance.on("attendance:marked", () => {
      const qc = getQueryClient();
      qc.invalidateQueries({ queryKey: ["attendance"] });
      qc.invalidateQueries({ queryKey: ["child-attendance"] });
      qc.invalidateQueries({ queryKey: ["parent"] });
    });

    socketInstance.on("homework:assigned", () => {
      const qc = getQueryClient();
      qc.invalidateQueries({ queryKey: ["homework"] });
      qc.invalidateQueries({ queryKey: ["child-homework"] });
    });

    socketInstance.on("notification:created", () => {
      const qc = getQueryClient();
      qc.invalidateQueries({ queryKey: ["notifications"] });
    });

    socketInstance.on("message:received", () => {
      const qc = getQueryClient();
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    });

    socketInstance.on("fee:updated", () => {
      const qc = getQueryClient();
      qc.invalidateQueries({ queryKey: ["fees"] });
      qc.invalidateQueries({ queryKey: ["child-fees"] });
    });
  }

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export function joinRoom(room: string): void {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit("join-room", room);
  }
}

export function leaveRoom(room: string): void {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit("leave-room", room);
  }
}
