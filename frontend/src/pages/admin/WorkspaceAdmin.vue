<script setup>
import {
  onBeforeUnmount,
  onMounted,
  nextTick,
  ref,
  defineAsyncComponent,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import { adminloadTimeTables } from "../../helpers";
import EditableUserTable from "../../components/admin/EditableUserTable.vue";
import { useUserStore, useAlertStore, useAuthStore } from "src/stores";
import { getWorkspace } from "../../service";

const userStore = useUserStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();

const panel = ref(router.currentRoute.value.query.tab || "table");
const openTimeEntry = ref(false);
const showAddUserDialog = ref(false);
const showAddNewTime = ref(false);
const showEditWorkspaceDialog = ref(false);

const lazyGroupedTimeTablesComponent = defineAsyncComponent(() =>
  import("../../components/GroupedTimeTables.vue")
);

const lazyAdminAddTimeEntryComponent = defineAsyncComponent(() =>
  import("../../components/admin/AdminAddTimeEntry.vue")
);

const lazyAddUserDialogComponent = defineAsyncComponent(() =>
  import("../../components/admin/AddUserDialog.vue")
);

const lazyEditWorkspaceDialogComponent = defineAsyncComponent(() =>
  import("../../components/admin/EditWorkspaceDialog.vue")
);

const initializeData = async () => {
  const workspaceId = router.currentRoute.value.params?.id;
  try {
    const workspace = await getWorkspace(workspaceId);
    userStore.setActiveWorkspace(workspace.data);
    await nextTick();
    if (!userStore.isActiveWorkspaceAdmin) {
      if (!authStore.user) return router.push("/login");
      return router.push("/auth");
    }
    if (router.currentRoute.value.query.id) {
      const routeUserId = router.currentRoute.value.query.id;
      const member = userStore.activeWorkspace.members.find(
        (member) => member.userId === routeUserId
      );
      if (!member) throw new Error("err");
      userStore.selectedWorkspaceMember = member;
      adminloadTimeTables(member.userId);
    }
  } catch (err) {
    alertStore.error("Laden fehlgeschlagen", 4000);
    if (!authStore.user) return router.push("/login");
    router.push("/auth");
  }
};

onMounted(() => {
  initializeData();
});

const setSelectedMember = async (data) => {
  userStore.selectedWorkspaceMember = data;
  panel.value = "user";
  setQuery("user", data.userId);
  try {
    await adminloadTimeTables(data.userId);
  } catch (err) {
    alertStore.error("Zeiteinträge Laden fehlgeschlagen", 4000);
  }
};

const goBack = () => {
  if (panel.value !== "table") {
    panel.value = "table";
    userStore.selectedWorkspaceMember = null;
    userStore.resetTimeRange();
    setQuery("table");
  } else {
    const workspaceId = router.currentRoute.value.params?.id;
    router.push(`/workspace/${workspaceId}`);
  }
};

const setQuery = (val, id) => {
  const newQuery = val === "table" ? {} : { tab: val, id };
  router.replace({ query: newQuery });
};

const setOpenTimeEntry = () => {
  openTimeEntry.value = true;
};

const memberSelected = computed({
  get() {
    return {
      label: `${userStore.selectedWorkspaceMember?.firstname} ${userStore.selectedWorkspaceMember?.lastname}`,
      value: userStore.selectedWorkspaceMember?.userId,
    };
  },
  set(obj) {
    processData(obj.value);
  },
});

const processData = async (userId) => {
  try {
    setUserSelectedMember(userId);
    setQuery("user", userId);
    await adminloadTimeTables(userId);
    alertStore.success("Erfolgreich geladen");
  } catch (err) {
    alertStore.error("Zeiteinträge Laden fehlgeschlagen", 4000);
  }
};

const setUserSelectedMember = (userId) => {
  const findMember = userStore.activeWorkspace.members.find(
    (member) => member.userId === userId
  );
  if (!findMember) throw new Error("Member nicht gefunden");
  userStore.selectedWorkspaceMember = findMember;
};

const workspaceMemberOptions = computed(() => {
  return userStore.activeWorkspace.members.map((member) => {
    return {
      label: `${member.firstname} ${member.lastname}`,
      value: member.userId,
    };
  });
});

onBeforeUnmount(() => {
  userStore.resetTimeData();
});
</script>

<template>
  <section class="workspace-admin custom-full-height">
    <div class="container q-pt-xl">
      <h1 class="text-center q-mt-none text-h2">
        {{ userStore.activeWorkspace.name }}
      </h1>
      <div class="flex-container flex-between align-center q-mb-lg">
        <div>
          <q-btn @click="goBack" color="accent" flat label="Zurück"></q-btn>
        </div>
        <div>
          <q-btn
            @click="showEditWorkspaceDialog = true"
            class="q-mr-xl btn--no-hover"
            dense
            round
            flat
            icon="fa-solid fa-gear"
          >
            <q-tooltip> Workspace bearbeiten </q-tooltip>
          </q-btn>

          <q-btn
            @click="showAddUserDialog = true"
            class="btn--no-hover"
            dense
            round
            flat
            icon="fa-solid fa-user-plus"
          >
            <q-tooltip> Mitglieder hinzufügen </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
        <q-tab-panel name="table">
          <div>
            <EditableUserTable @selectMember="setSelectedMember" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="user">
          <section class="user-action">
            <div class="custom-select-lg q-mb-xl">
              <q-select
                v-model="memberSelected"
                :options="workspaceMemberOptions"
                label="Ausgewähltes Mitglied"
                label-color="primary"
              />
            </div>
            <div>
              <q-btn
                @click="showAddNewTime = true"
                class="btn--no-hover"
                dense
                round
                flat
                color="accent"
                size="lg"
                icon="fa-regular fa-calendar-plus"
              >
                <q-tooltip> Zeiteintrag hinzufügen </q-tooltip>
              </q-btn>
            </div>
          </section>
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
    <template v-else-if="showEditWorkspaceDialog">
      <component
        :is="lazyEditWorkspaceDialogComponent"
        :show="showEditWorkspaceDialog"
        @hide="showEditWorkspaceDialog = false"
      />
    </template>
    <q-dialog class="create-workspace" v-model="showAddNewTime">
      <q-card style="width: 800px; max-width: 80vw; min-height: 180px">
        <component
          :is="lazyAdminAddTimeEntryComponent"
          :memberId="userStore.selectedWorkspaceMember?.userId"
        />
        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="Schliessen" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>
