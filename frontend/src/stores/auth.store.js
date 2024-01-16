import { defineStore } from "pinia";
import { whoami, login, logout } from "../service";
import router from "../router";
import { useAlertStore } from "./index";
import { isInUnauthorizedRoute } from "src/helpers";
import { socketConnection } from "../client.socket.js";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: null,
  }),
  actions: {
    async login(data) {
      try {
        const userData = await login(data);

        // update pinia state
        this.user = userData.data;

        // redirect to previous url or default to home page
        router.push("/auth");
      } catch (error) {
        const message = error.message.includes("400")
          ? "Fehlerhafte Anmeldung. Prüfen Sie Ihren Benutzernamen und Ihr Passwort."
          : "Der Sever ist zurzeit nicht verfügbar";
        const alertStore = useAlertStore();
        alertStore.error(message, 5000);
      }
    },
    async checkAuthenticated() {
      if (this.user) {
        socketConnection();
        return;
      }
      try {
        const userData = await whoami();
        const { user, autherized } = userData.data;
        if (!autherized) throw new Error("Not autherized");

        this.user = user;
        socketConnection();
        await router.isReady();
        if (isInUnauthorizedRoute(router.currentRoute.value.path)) {
          router.push("/auth");
        }
      } catch (err) {
        if (isInUnauthorizedRoute(router.currentRoute.value.path) === false) {
          router.push("/login");
        }
      }
    },
    async logout() {
      this.user = null;
      await logout();
      router.push("/login");
    },
  },
});
