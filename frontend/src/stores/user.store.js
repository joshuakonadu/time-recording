import { defineStore } from "pinia";
import { getAllWorkspaces } from "../service";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    workspaces: [],
    activeWorkspace: {
      name: "",
      members: [],
      projectOption: [],
      roleOption: [],
      mode: null,
    },
    timeTablesData: [],
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
    setTimeTablesData(data) {
      this.timeTablesData = data;
    },
    addNewTimeData(data) {
      this.timeTablesData = [data, ...this.timeTablesData];
    },
    setActiveWorkspace(data) {
      this.activeWorkspace = data;
    },
  },
});
