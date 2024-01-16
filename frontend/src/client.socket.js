import { io } from "socket.io-client";
import { useAuthStore } from "src/stores";
import { handleMsg } from "./helpers";

export const data = {};

export function recieverNotifyUpdateByUserId(
  id,
  msg = JSON.stringify({ action: "update_messages" })
) {
  data.socket?.emit("update", id, msg);
}

export const socketConnection = () => {
  data.socket = io("http://localhost:5000");

  data.socket?.on("connect", () => {
    const authStore = useAuthStore();
    data.socket.emit("user", authStore.user?._id);
  });

  data.socket?.on("update", (msg) => {
    if (msg) handleMsg(msg);
  });
};
