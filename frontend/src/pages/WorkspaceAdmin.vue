<script setup>
import { onUnmounted, nextTick } from "vue";
import EditableUserTable from "../components/EditableUserTable.vue";
import { useUserStore } from "src/stores/user.store.js";
import { getWorkspace } from "../service";
import router from "../router";

const userStore = useUserStore();

const initializeData = async () => {
  const workspaceId = router.currentRoute.value.params?.id;
  //TODO: check if visitor is a member of the workspace
  const workspace = await getWorkspace(workspaceId);
  userStore.setActiveWorkspace(workspace.data);
  await nextTick();
  if (!userStore.isActiveWorkspaceAdmin) {
    router.push("/auth");
  }
};
initializeData();

onUnmounted(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <div class="container q-mt-xl">
    <h1 class="text-center text-h2">Admin Panel</h1>
    <h2>Test</h2>
    <EditableUserTable />
  </div>
</template>

<style scoped></style>
