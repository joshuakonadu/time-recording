import { io } from "socket.io-client";
import { useAuthStore } from "src/stores";
import { handleMsg } from "./helpers";

let socket = null;

export function recieverNotifyUpdateByUserId(
  id,
  msg = JSON.stringify({ action: "update_messages" })
) {
  socket.emit("update", id, msg);
}

export const socketConnection = () => {
  if (socket) return;

  socket = io("http://localhost:5000", { transports: ["websocket"] });

  socket.on("connect", () => {
    const authStore = useAuthStore();
    socket.emit("user", authStore.user?._id);
  });

  socket.on("update", (msg) => {
    if (msg) handleMsg(msg);
  });
};

export const socketConnectionClose = () => {
  socket.emit("close-connection");
  if (socket) socket = null;
};
