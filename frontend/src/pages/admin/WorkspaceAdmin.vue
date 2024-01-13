<script setup>
import {
  onUnmounted,
  onMounted,
  nextTick,
  ref,
  defineAsyncComponent,
} from "vue";
import { useRouter } from "vue-router";
import { adminloadTimeTables } from "../../helpers";
import EditableUserTable from "../../components/admin/EditableUserTable.vue";
import { useUserStore, useAlertStore } from "src/stores";
import { getWorkspace } from "../../service";

const userStore = useUserStore();
const alertStore = useAlertStore();

const selectedMember = ref(null);
const panel = ref("table");
const openTimeEntry = ref(false);
const showAddUserDialog = ref(false);

const lazyGroupedTimeTablesComponent = defineAsyncComponent(() =>
  import("../../components/GroupedTimeTables.vue")
);

const lazyAdminAddTimeEntryComponent = defineAsyncComponent(() =>
  import("../../components/admin/AdminAddTimeEntry.vue")
);

const lazyAddUserDialogComponent = defineAsyncComponent(() =>
  import("../../components/admin/AddUserDialog.vue")
);

const initializeData = async () => {
  const router = useRouter();
  const workspaceId = router.currentRoute.value.params?.id;
  try {
    const workspace = await getWorkspace(workspaceId);
    userStore.setActiveWorkspace(workspace.data);
    await nextTick();
    if (!userStore.isActiveWorkspaceAdmin) {
      router.push("/auth");
    }
  } catch (err) {
    alertStore.error("Laden fehlgeschlagen", 4000);
    router.push("/auth");
  }
};

onMounted(() => {
  initializeData();
});

const setSelectedMember = async (data) => {
  selectedMember.value = data;
  userStore.selectedWorkspaceMember = data.id;
  panel.value = "user";
  try {
    await adminloadTimeTables(data.id);
  } catch (err) {
    alertStore.error("Zeiteinträge Laden fehlgeschlagen", 4000);
  }
};

const showTable = () => {
  panel.value = "table";
  selectedMember.value = {};
  userStore.selectedWorkspaceMember = null;
};

const setOpenTimeEntry = () => {
  openTimeEntry.value = true;
};

onUnmounted(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <section class="custom-full-height">
    <div class="container q-pt-xl">
      <h1 class="text-center text-h2">Admin Panel</h1>
      <div class="flex-container flex-between align-center">
        <h2 class="text-h3">{{ userStore.activeWorkspace.name }}</h2>
        <q-btn
          @click="showAddUserDialog = true"
          class="q-mr-md btn--no-hover"
          dense
          round
          flat
          icon="fa-solid fa-user-plus"
        />
      </div>
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
          <q-expansion-item
            class="q-mb-xl"
            style="width: fit-content"
            icon="fa-solid fa-calendar-plus"
            label="Neuer Zeiteintrag"
            header-class="text-accent"
            @before-show="setOpenTimeEntry"
          >
            <template v-if="openTimeEntry">
              <component
                :is="lazyAdminAddTimeEntryComponent"
                :memberId="selectedMember.id"
              />
            </template>
          </q-expansion-item>
          <component :is="lazyGroupedTimeTablesComponent" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <template v-if="showAddUserDialog">
      <component
        :is="lazyAddUserDialogComponent"
        :show="showAddUserDialog"
        @hide="showAddUserDialog = false"
      />
    </template>
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
  padding-inline: 0;
}

:deep(.q-tab-panel .time-calculator) {
  background: #ffffff;
}
:deep(.q-btn.btn--no-hover .q-focus-helper) {
  display: none;
}

:deep(.q-btn.btn--no-hover) {
  height: fit-content;
}
</style>
