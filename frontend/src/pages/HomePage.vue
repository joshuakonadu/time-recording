<script setup>
import CreateWorkspace from "../components/CreateWorkspace.vue";
import WorkSpaces from "../components/WorkSpaces.vue";
import { useUserStore } from "../stores";

const fetchAllWorkspaces = async () => {
  const userStore = useUserStore();
  await userStore.getWorkspaces();
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
