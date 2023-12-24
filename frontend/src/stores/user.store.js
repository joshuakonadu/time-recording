import { defineStore } from "pinia";

import { useAuthStore } from "./index";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
  id: "users",
  state: () => ({
    user: {},
    workspaces: [],
  }),
  actions: {
    async register(user) {
      await fetchWrapper.post(`${baseUrl}/register`, user);
    },
  },
});
