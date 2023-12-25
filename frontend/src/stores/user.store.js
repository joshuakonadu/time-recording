import { defineStore } from "pinia";

export const useUsersStore = defineStore({
  id: "user",
  state: () => ({
    user: {},
    workspaces: [],
  }),
  actions: {
    async setUser(user) {
      console.log(user);
    },
  },
});
