import { useAuthStore } from "../stores";

export function useAuthentication() {
  const authStore = useAuthStore();

  authStore.checkAuthenticated();
}
