import { defineStore } from "pinia";

import router from "../router";
import { useAlertStore } from "./index";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: null,
    returnUrl: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const user = await fetchWrapper.post(`${baseUrl}/authenticate`, {
          username,
          password,
        });

        // update pinia state
        this.user = user;

        // redirect to previous url or default to home page
        router.push(this.returnUrl || "/");
      } catch (error) {
        const alertStore = useAlertStore();
        alertStore.error(error);
      }
    },
    logout() {
      this.user = null;
      router.push("/account/login");
    },
  },
});
