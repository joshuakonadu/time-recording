import { defineStore } from "pinia";
import { whoami, login } from "../service";
import router from "../router";
import { useAlertStore } from "./index";

const unautherizedRoutes = ["login", "register"];

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: null,
    returnUrl: null,
  }),
  actions: {
    async login(data) {
      try {
        const userData = await login(data);

        // update pinia state
        this.user = userData.data;

        // redirect to previous url or default to home page
        router.push(this.returnUrl || "/auth");
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.error(error.message);
      }
    },
    async checkAuthenticated() {
      try {
        const userData = await whoami();

        this.user = userData.data;
        if (unautherizedRoutes.includes(router.currentRoute.value)) {
          router.push("/auth/");
        }
      } catch (err) {
        router.push("/login");
      }
    },
    logout() {
      this.user = null;
      router.push("/login");
    },
  },
});
