import { defineStore } from "pinia";

export const useAlertStore = defineStore({
  id: "alert",
  state: () => ({
    alert: null,
  }),
  actions: {
    success(message) {
      this.alert = { message, type: "success" };
    },
    info(message) {
      this.alert = { message, type: "info" };
    },
    error(message) {
      this.alert = { message, type: "error" };
    },
    clear() {
      this.alert = null;
    },
  },
});
