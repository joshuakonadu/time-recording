import { defineStore } from "pinia";
import { getAllWorkspaces } from "../service";
import {
  sortDate,
  getDateNow,
  getFirstOfMonth,
  modifyToSelect,
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
      return state.activeWorkspace.members?.find(
        (user) => user.userId === authStore.user._id
      )?.isAdmin;
    },
    isActiveWorkspaceMember(state) {
      const authStore = useAuthStore();
      return state.activeWorkspace.members?.some((user) => {
        return user.userId === authStore.user._id;
      });
    },
    selectedTimeRange(state) {
      return {
        from: state.timeTablesDate.from,
        to: modifyToSelect(state.timeTablesDate.to),
      };
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
    updateWorkspaceMembers(data) {
      this.activeWorkspace.members = data;
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
