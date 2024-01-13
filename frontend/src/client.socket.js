import { io } from "socket.io-client";
import { useAuthStore, useUserStore } from "src/stores";
import { handleMsg } from "./helpers";

const authStore = useAuthStore();
const userStore = useUserStore();

export const socket = io("http://localhost:5000");

socket.on("connect", () => {
  socket.emit("user", authStore.user?._id);
});

socket.on("new invitation", (msg) => {
  userStore.getInvitations();
  if (msg) handleMsg(msg);
});

export function recieverNotifyInvitationByUserId(id, msg) {
  socket.emit("new invitation", id, msg);
}
