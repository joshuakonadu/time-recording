import { defineStore } from "pinia";
import { getAllWorkspaces } from "../service";
import {
  sortDate,
  getDateNow,
  getFirstOfMonth,
} from "../helpers/timeHelpers.js";
import { useAuthStore } from "./auth.store";

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
    timeTablesDate: {
      from: getFirstOfMonth(),
      to: getDateNow(),
    },
  }),
  getters: {
    isActiveWorkspaceAdmin(state) {
      const authStore = useAuthStore();
      return state.activeWorkspace.members.some(
        (user) => user.userId === authStore.user._id
      );
    },
  },
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
      this.timeTablesDate = {
        from: getFirstOfMonth(),
        to: getDateNow(),
      };
    },
  },
});
