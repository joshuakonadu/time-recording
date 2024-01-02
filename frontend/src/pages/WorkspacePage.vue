<script setup>
import { onUnmounted, ref, watch } from "vue";
import AddTimeEntry from "../components/AddTimeEntry.vue";
import TimeTables from "../components/TimeTables.vue";
import WorkspaceActions from "../components/WorkspaceActions.vue";
import { getWorkspace } from "../service";
import { useUserStore } from "src/stores/user.store.js";
import { loadTimeTables } from "../helpers/timeHelpers.js";
import UserTable from "../components/UserTable.vue";
import router from "../router";

const userStore = useUserStore();

const tab = ref("times");

const initializeData = async () => {
  const workspaceId = router.currentRoute.value.params?.id;
  const workspace = await getWorkspace(workspaceId);
  userStore.setActiveWorkspace(workspace.data);
  await loadTimeTables();
};
initializeData();

onUnmounted(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <q-page>
    <div class="container flex-container flex-between align-center">
      <h1 class="container text-h2">{{ userStore.activeWorkspace?.name }}</h1>
      <div>
        <q-btn flat label="Zur Admin Ansicht" color="primary" />
      </div>
    </div>
    <q-tabs narrow-indicator v-model="tab" class="text-teal q-mb-xl">
      <q-tab :ripple="false" name="times" icon="alarm" label="Zeiten" />
      <q-tab :ripple="false" name="info" icon="info" label="Info" />
      <q-tab
        :ripple="false"
        name="settings"
        icon="settings"
        label="Einstellung"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="times">
        <AddTimeEntry />
        <TimeTables />
      </q-tab-panel>
      <q-tab-panel name="info">
        <div class="container">
          <UserTable :data="userStore.activeWorkspace.members" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="settings">
        <div>
          <WorkspaceActions />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
