import { defineStore } from "pinia";
import { getAllWorkspaces, getAllInvitations } from "../service";
import {
  sortDate,
  getDateNow,
  getFirstOfMonth,
  modifyToSelect,
} from "../helpers";
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
    selectedWorkspaceMember: null,
    timeTablesData: [],
    timeTablesDate: {
      from: getFirstOfMonth(),
      to: getDateNow(),
    },
    invitations: [],
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
      const apiData = await getAllWorkspaces();
      this.workspaces = apiData.data.workspaces;
    },
    async getInvitations() {
      const apiData = await getAllInvitations();
      this.invitations = apiData.data;
    },
    setTimeTablesData(data) {
      this.timeTablesData = data;
    },
    addNewTimeData(data) {
      this.timeTablesData = [data, ...this.timeTablesData].sort(sortDate);
    },
    editTimeData(data) {
      this.timeTablesData = this.timeTablesData
        .map((timeData) => {
          return timeData._id === data._id ? data : timeData;
        })
        .sort(sortDate);
    },
    deleteTimeData(data) {
      this.timeTablesData = this.timeTablesData.filter(
        (timeData) => timeData._id !== data._id
      );
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
      this.selectedWorkspaceMember = null;
    },
  },
});
