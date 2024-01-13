import { toRaw } from "vue";
import { useAuthStore, useUserStore } from "src/stores";
import router from "../router";
import {
  updateWorkspaceMembers,
  getWorkspaceMembers,
  deleteWorkspaceMember as deleteMember,
} from "../service";

export const updateMembers = async () => {
  const userStore = useUserStore();
  await router.isReady();
  const routeId = router.currentRoute.value.params?.id;
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
  await router.isReady();
  const routeId = router.currentRoute.value.params?.id;
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
  await router.isReady();
  const routeId = router.currentRoute.value.params?.id;
  if (routeId === workspaceId) {
    const userStore = useUserStore();
    const apiData = await getWorkspaceMembers(workspaceId);
    userStore.updateWorkspaceMembers(apiData.data);
  }
};

export const removedWorkspaceAction = async (workspaceId) => {
  await router.isReady();
  if (router.currentRoute.value.path === "/auth") {
    const userStore = useUserStore();
    userStore.getWorkspaces();
  } else if (router.currentRoute.value.params?.id === workspaceId) {
    router.push("/auth");
  }
};
