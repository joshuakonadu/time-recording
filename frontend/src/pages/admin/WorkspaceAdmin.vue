<script setup>
import { onUnmounted, nextTick, ref, defineAsyncComponent } from "vue";
import EditableUserTable from "../../components/admin/EditableUserTable.vue";
import { useUserStore } from "src/stores/user.store.js";
import { getWorkspace } from "../../service";
import router from "../../router";

const userStore = useUserStore();

const selectedMember = ref(null);
const panel = ref("table");

const lazyGroupedTimeTablesComponent = defineAsyncComponent(() =>
  import("../../components/GroupedTimeTables.vue")
);

const lazyAdminAddTimeEntryComponent = defineAsyncComponent(() =>
  import("../../components/admin/AdminAddTimeEntry.vue")
);

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

const setSelectedMember = (data) => {
  selectedMember.value = data;
  panel.value = "user";
};

const showTable = () => {
  panel.value = "table";
  selectedMember.value = {};
};

onUnmounted(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <section class="custom-full-height">
    <div class="container q-pt-xl">
      <h1 class="text-center text-h2">Admin Panel</h1>
      <h2>{{ userStore.activeWorkspace.name }}</h2>
      <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="table">
          <div>
            <EditableUserTable @selectMember="setSelectedMember" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="user">
          <q-btn @click="showTable" color="primary" flat label="Zurück"></q-btn>
          <div>
            <h3>
              {{ selectedMember.firstname }} {{ selectedMember.lastname }}
            </h3>
          </div>
          <component
            :is="lazyAdminAddTimeEntryComponent"
            :memberId="selectedMember.id"
          />
          <component :is="lazyGroupedTimeTablesComponent" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </section>
</template>

<style scoped>
:deep(.q-tab-panels) {
  box-shadow: none;
}
.custom-full-height {
  min-height: 100vh;
  background: #ebdbfd;
}

:deep(.q-tab-panel) {
  background: #ebdbfd;
}
</style>
