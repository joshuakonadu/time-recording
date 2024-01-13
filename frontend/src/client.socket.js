import { io } from "socket.io-client";
import { useAuthStore, useUserStore } from "src/stores";
import { handleMsg } from "./helpers";

export const data = {};

export function recieverNotifyInvitationByUserId(id, msg) {
  data.socket?.emit("new invitation", id, msg);
}

export const socketConnection = () => {
  data.socket = io("http://localhost:5000");

  data.socket?.on("connect", () => {
    const authStore = useAuthStore();
    data.socket.emit("user", authStore.user?._id);
  });

  data.socket?.on("new invitation", (msg) => {
    const userStore = useUserStore();
    userStore.getInvitations();
    if (msg) handleMsg(msg);
  });
};
