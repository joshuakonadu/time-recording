import { defineStore } from "pinia";
import { getAllWorkspaces } from "../service";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    workspaces: [],
  }),
  actions: {
    async getWorkspaces() {
      try {
        const apiData = await getAllWorkspaces();
        this.workspaces = apiData.data.workspaces;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
