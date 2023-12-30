import { defineStore } from "pinia";
import { getAllWorkspaces } from "../service";
import { sortDate } from "../helpers/timeHelpers.js";

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
      } catch (err) {}
    },
    setTimeTablesData(data) {
      this.timeTablesData = data;
    },
    addNewTimeData(data) {
      this.timeTablesData = [data, ...this.timeTablesData].sort(sortDate);
    },
    setActiveWorkspace(data) {
      this.activeWorkspace = data;
    },
    resetTimeData() {
      this.activeWorkspace = {
        name: "",
        members: [],
        projectOption: [],
        roleOption: [],
        mode: null,
      };

      this.timeTablesData = [];
    },
  },
});
