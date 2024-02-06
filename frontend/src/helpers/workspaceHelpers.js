import { toRaw } from "vue";
import { useAuthStore, useUserStore } from "src/stores";
import router from "../router";
import {
  updateWorkspaceMembers,
  getWorkspaceMembers,
  getWorkspace,
  deleteWorkspaceMember as deleteMember,
} from "../service";

export const updateMembers = async () => {
  const userStore = useUserStore();
  const routeId = userStore.activeWorkspace._id;
  let apiData = null;
  try {
    apiData = await updateWorkspaceMembers(
      routeId,
      toRaw(userStore.activeWorkspace.members)
    );
  } catch (err) {
    apiData = await getWorkspaceMembers(routeId);
    throw new Error("Fehler");
  }
  userStore.updateWorkspaceMembers(apiData.data);
};

export const deleteWorkspaceMember = async (id) => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const routeId = userStore.activeWorkspace._id;
  try {
    const { data } = await deleteMember(routeId, {
      deleteUserId: id,
    });

    if (!data.workspaceDeleted && id !== authStore.user._id) {
      const apiData = await getWorkspaceMembers(routeId);
      userStore.updateWorkspaceMembers(apiData.data);
    }
  } catch (err) {
    throw new Error("Fehler");
  }
};

export const updateWorkspaceAction = async (workspaceId) => {
  const userStore = useUserStore();
  const routeId = userStore.activeWorkspace._id;
  if (routeId === workspaceId) {
    const apiData = await getWorkspaceMembers(workspaceId);
    userStore.updateWorkspaceMembers(apiData.data);
  }
};

export const removedWorkspaceAction = async (workspaceId) => {
  await router.isReady();
  const userStore = useUserStore();
  if (router.currentRoute.value.path === "/auth") {
    userStore.getWorkspaces();
  } else if (userStore.activeWorkspace._id === workspaceId) {
    router.push("/auth");
  }
};

export const updateChangedWorkspace = async (workspaceId) => {
  const userStore = useUserStore();
  const routeId = userStore.activeWorkspace._id;
  const routePath = router.currentRoute.value.path;
  if (routeId === workspaceId) {
    const workspace = await getWorkspace(workspaceId);
    userStore.setActiveWorkspace(workspace.data);
  } else if (routePath.includes("auth")) {
    userStore.getWorkspaces();
  }
};
