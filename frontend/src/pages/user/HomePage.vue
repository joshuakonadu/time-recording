<script setup>
import CreateWorkspace from "../../components/workspace/CreateWorkspace.vue";
import WorkSpaces from "../../components/workspace/WorkSpaces.vue";
import { useUserStore, useAlertStore, useAuthStore } from "../../stores";

const fetchAllWorkspaces = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  try {
    await userStore.getWorkspaces();
  } catch (err) {
    const alertStore = useAlertStore();
    alertStore.error("Workspaces konnten nicht geladen werden", 4000);
    if (!authStore.user) router.push("/login");
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
