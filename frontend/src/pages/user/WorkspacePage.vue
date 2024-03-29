<script setup>
import {
  onBeforeUnmount,
  ref,
  watch,
  nextTick,
  defineAsyncComponent,
} from "vue";
import AddTimeEntry from "../../components/timerecord/AddTimeEntry.vue";
import GroupedTimeTables from "../../components/GroupedTimeTables.vue";
import { getWorkspace } from "../../service";
import { useUserStore, useAlertStore, useAuthStore } from "src/stores";
import { loadTimeTables } from "../../helpers";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const lazyUserTableComponent = defineAsyncComponent(() =>
  import("../../components/table/UserTable.vue")
);
const lazyWorkspaceActionsComponent = defineAsyncComponent(() =>
  import("../../components/workspace/WorkspaceActions.vue")
);

const tab = ref(route.query.tab || "times");

const initializeData = async () => {
  const workspaceId = route.params.id;
  try {
    const workspace = await getWorkspace(workspaceId);
    userStore.setActiveWorkspace(workspace.data);
    await nextTick();
    if (!userStore.isActiveWorkspaceMember) {
      if (!authStore.user) return router.push("/login");

      return router.push("/auth");
    }
    await loadTimeTables();
  } catch (err) {
    alertStore.error("Fehler beim Laden", 4000);
    if (!authStore.user) return router.push("/login");
  }
};
initializeData();

const setQuery = (val) => {
  const newQuery = val === "times" ? {} : { tab: val };
  router.replace({ query: newQuery });
};

onBeforeUnmount(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <q-page class="workspace-page">
    <div class="container flex-container flex-between align-center">
      <div class="title">
        <h1 class="text-h2">{{ userStore.activeWorkspace?.name }}</h1>
      </div>
      <div class="admin-button" v-if="userStore.isActiveWorkspaceAdmin">
        <q-btn
          :to="`/adminworkspace/${route.params.id}`"
          flat
          label="Admin-Ansicht"
          color="primary"
        />
      </div>
    </div>
    <q-tabs narrow-indicator v-model="tab" class="text-teal q-mb-sm">
      <q-tab
        :ripple="false"
        @click="setQuery('times')"
        name="times"
        icon="alarm"
      />
      <q-tab
        :ripple="false"
        @click="setQuery('info')"
        name="info"
        icon="info"
      />
      <q-tab
        :ripple="false"
        @click="setQuery('settings')"
        name="settings"
        icon="settings"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="times">
        <AddTimeEntry />
        <section class="container">
          <GroupedTimeTables />
        </section>
      </q-tab-panel>
      <q-tab-panel name="info">
        <div class="container">
          <component
            :is="lazyUserTableComponent"
            :data="userStore.activeWorkspace.members"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="settings">
        <div>
          <component :is="lazyWorkspaceActionsComponent" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
