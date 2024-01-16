import { useUserStore } from "src/stores";

export const updateInvitations = () => {
  const userStore = useUserStore();
  userStore.getInvitations();
};
