<script setup>
import { ref, toRaw, defineAsyncComponent } from "vue";
import { createWorkspace } from "../../service";
import { useUserStore, useAlertStore } from "../../stores";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const showDialog = ref(false);
const loading = ref(false);

const name = ref("");
const timeMode = ref("all");
const roleText = ref("");
const projectText = ref("");
const roles = ref(new Set([]));
const projects = ref(new Set([]));
const showAddUserDialog = ref(false);

const createdWorkspaceId = ref(null);
const createdWorkspaceName = ref(null);

const success = ref(false);
const error = ref(false);

const timeModeOptions = [
  { label: "Alle Zeiten", value: "all" },
  { label: "Nur Selben Tag", value: "24h" },
];

const lazyAddUserDialogComponent = defineAsyncComponent(() =>
  import("..//admin/AddUserDialog.vue")
);

const sendData = async () => {
  if (!name.value) return;

  loading.value = true;
  const data = {
    name: name.value.toLocaleLowerCase(),
    projectOption: [...toRaw(projects.value)],
    roleOption: [...toRaw(roles.value)],
    mode: timeMode.value,
  };
  try {
    const apiData = await createWorkspace(data);
    createdWorkspaceId.value = apiData.data.workspaceId;
    createdWorkspaceName.value = apiData.data.name;
    success.value = true;
    await userStore.getWorkspaces();
  } catch (err) {
    error.value = true;
    const alertStore = useAlertStore();
    alertStore.error("Konnte nicht erstellt werden", 3000);
  } finally {
    loading.value = false;
  }
};

const addRole = () => {
  if (!roleText.value) return;
  roles.value.add(roleText.value);
  roleText.value = "";
};
const removeRole = (role) => {
  roles.value.delete(role);
};

const addProject = () => {
  if (!projectText.value) return;
  projects.value.add(projectText.value);
  projectText.value = "";
};
const removeProject = (project) => {
  projects.value.delete(project);
};
const resetValues = () => {
  name.value = "";
  loading.value = false;
  roleText.value = "";
  projectText.value = "";
  roles.value = new Set([]);
  projects.value = new Set([]);
  timeMode.value = "all";

  success.value = false;
  error.value = false;
};
const openAddUserDialog = () => {
  showDialog.value = false;
  showAddUserDialog.value = true;
};
const openWorkspace = async () => {
  await router.push(`/workspace/${createdWorkspaceId.value}`);
};
</script>

<template>
  <div class="q-mt-lg q-mb-xl">
    <div class="custom-height">
      <q-btn
        color="primary"
        @click="showDialog = true"
        flat
        label="Workspace erstellen"
      />
    </div>
    <q-dialog class="create-workspace" @hide="resetValues" v-model="showDialog">
      <q-card style="width: 800px; max-width: 80vw; min-height: 180px">
        <q-card-section>
          <div v-if="!success" class="text-h6">Erstelle Workspace</div>
          <div v-else class="text-h6">Erfolgreich erstellt</div>
        </q-card-section>

        <q-card-section v-if="!loading && !success" class="q-pt-none">
          <div class="flex-container">
            <div class="name">
              <q-input bottom-slots v-model="name" label="Name">
                <template v-slot:hint> Pflichtfeld </template>
              </q-input>
            </div>
            <div class="mode">
              <q-select
                v-model="timeMode"
                :options="timeModeOptions"
                map-options
                emit-value
                label="Zeit Modus"
              >
              </q-select>
            </div>
          </div>
          <div class="q-mt-md project-role">
            <div class="input">
              <q-input
                @keydown.enter="addProject"
                bottom-slots
                autogrow
                v-model="projectText"
                label="Projekt"
              >
                <template v-slot:append>
                  <q-btn @click="addProject" round dense flat icon="add" />
                </template>
                <template v-slot:hint> Optional </template>
              </q-input>
            </div>
            <div class="input">
              <q-input
                @keydown.enter="addRole"
                bottom-slots
                autogrow
                v-model="roleText"
                label="Rolle"
              >
                <template v-slot:append>
                  <q-btn @click="addRole" round dense flat icon="add" />
                </template>
                <template v-slot:hint> Optional </template>
              </q-input>
            </div>
          </div>
          <div class="q-mt-md project-role">
            <div class="chips">
              <q-chip
                v-for="project in projects"
                :key="project"
                removable
                @remove="removeProject(project)"
                color="secondary"
                text-color="white"
              >
                {{ project }}
              </q-chip>
            </div>
            <div class="chips">
              <q-chip
                v-for="role in roles"
                :key="role"
                removable
                @remove="removeRole(role)"
                color="accent"
                text-color="white"
              >
                {{ role }}
              </q-chip>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <transition appear enter-active-class="animated fadeIn">
            <div v-show="success" class="text-positive">
              Workspace wurde erfolgreich erstellt
            </div>
          </transition>
        </q-card-section>

        <q-inner-loading
          class="q-mt-xl"
          style="height: 120px"
          :showing="loading"
        >
          <q-spinner-gears size="100px" color="primary" />
        </q-inner-loading>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            v-if="!loading"
            color="negative"
            flat
            label="Schließen"
            v-close-popup
          />
          <q-btn
            v-if="!loading && !success"
            flat
            color="primary"
            label="Erstellen"
            @click="sendData"
          />
          <q-btn
            v-if="success"
            flat
            color="primary"
            label="Weiteren erstellen"
            @click="resetValues"
          />
          <q-btn
            v-if="success"
            color="accent"
            flat
            label="Mitglieder hinzufügen"
            @click="openAddUserDialog"
          />
          <q-btn
            v-if="success"
            color="positive"
            flat
            label="Öffnen"
            @click="openWorkspace"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <template v-if="showAddUserDialog">
      <component
        :is="lazyAddUserDialogComponent"
        :show="showAddUserDialog"
        :workspaceId="createdWorkspaceId"
        :workspaceName="createdWorkspaceName"
        @hide="showAddUserDialog = false"
      />
    </template>
  </div>
</template>
