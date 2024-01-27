import { defineStore } from "pinia";

export const useAlertStore = defineStore({
  id: "alert",
  state: () => ({
    alert: null,
  }),
  actions: {
    success(message, ms = 1200) {
      this.alert = { message, type: "success", ms };
    },
    info(message, ms = 2000) {
      this.alert = { message, type: "info", ms };
    },
    error(message, ms = 2000) {
      this.alert = { message, type: "error", ms };
    },
    clear() {
      this.alert = null;
    },
  },
});
