<script setup>
import CreateWorkspace from "../../components/workspace/CreateWorkspace.vue";
import WorkSpaces from "../../components/workspace/WorkSpaces.vue";
import { useUserStore, useAlertStore } from "../../stores";

const fetchAllWorkspaces = async () => {
  const userStore = useUserStore();
  try {
    await userStore.getWorkspaces();
  } catch (err) {
    const alertStore = useAlertStore();
    alertStore.error("Workspaces konnten nicht geladen werden", 4000);
  }
};

fetchAllWorkspaces();
</script>

<template>
  <div class="container">
    <CreateWorkspace />
    <WorkSpaces />
  </div>
</template>

<style></style>
