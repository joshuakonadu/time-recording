import { defineStore } from "pinia";
import { whoami, login, logout } from "../service";
import router from "../router";
import { useAlertStore } from "./index";
import { isInUnautherizedRoute } from "src/helpers/routesHelpers";

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
        const alertStore = useAlertStore();
        alertStore.error(error.message);
      }
    },
    async checkAuthenticated() {
      if (this.user) {
        return;
      }
      try {
        const userData = await whoami();
        this.user = userData.data;
        if (isInUnautherizedRoute(router.currentRoute.value.path)) {
          router.push("/auth");
        }
      } catch (err) {
        if (isInUnautherizedRoute(router.currentRoute.value.path) === false) {
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
