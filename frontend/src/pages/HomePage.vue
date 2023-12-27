<script setup>
import CreateWorkspace from "../components/CreateWorkspace.vue";
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
  </div>
</template>

<style></style>
