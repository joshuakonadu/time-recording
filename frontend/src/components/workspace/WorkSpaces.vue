<script setup>
import { useUserStore } from "../../stores";
import WorkSpaceCard from "./WorkSpaceCard.vue";

const userStore = useUserStore();
</script>
<template>
  <div class="workspaces flex-custom">
    <WorkSpaceCard
      v-for="workspace in userStore.workspaces"
      :key="workspace.workspaceId"
      :data="workspace"
    />
  </div>
</template>
