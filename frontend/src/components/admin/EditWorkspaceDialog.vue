<script setup>
import { defineAsyncComponent, computed, ref, toRaw } from "vue";
import { useUserStore, useAuthStore, useAlertStore } from "../../stores";
import { notifyAllToUpdateWorkspace } from "../../helpers";
import { updateWorkspace, updateRegisterWorkspace } from "../../service";
import { useRoute } from "vue-router";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["hide"]);

const userStore = useUserStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const route = useRoute();

const loading = ref(false);
const activeWorkspace = toRaw(userStore.activeWorkspace);

const name = ref(activeWorkspace.name);
const timeMode = ref(activeWorkspace.mode);
const roleText = ref("");
const projectText = ref("");
const roles = ref(new Set([...activeWorkspace.roleOption]));
const projects = ref(new Set([...activeWorkspace.projectOption]));
let createdWorkspaceId = null;

const timeModeOptions = [
  { label: "Alle Zeiten", value: "all" },
  { label: "Nur Selben Tag", value: "24h" },
];

const saveData = async () => {
  if (!name.value) return;
  const workspaceId = route.params.id;
  loading.value = true;
  const data = {
    name: name.value.toLowerCase(),
    projectOption: [...toRaw(projects.value)],
    roleOption: [...toRaw(roles.value)],
    mode: timeMode.value,
  };
  const alertStore = useAlertStore();
  try {
    const apiResponse = await updateWorkspace(workspaceId, data);
    userStore.setActiveWorkspace(apiResponse.data);
    reactiveShow.value = false;
    alertStore.success("Erfolgreich geändert");
    updateRegisterWorkspaceAndNotifyUsers(apiResponse.data);
  } catch (err) {
    alertStore.error("Änderung fehlgeschlagen", 3000);
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
};

const reactiveShow = computed({
  get() {
    return props.show;
  },
  set() {
    emit("hide");
  },
});

const cleanUp = () => {
  loading.value = false;
  name.value = "";
  loading.value = false;
  roleText.value = "";
  projectText.value = "";
  roles.value = new Set([]);
  projects.value = new Set([]);
  timeMode.value = "";
};

const updateRegisterWorkspaceAndNotifyUsers = async (workspace) => {
  try {
    const promises = workspace.members.map((member) => {
      return updateRegisterWorkspace(member.userId, {
        workspaceId: workspace._id,
        name: workspace.name,
      });
    });
    await Promise.all(promises);
  } catch (err) {
    console.error(err);
  } finally {
    notifyAllToUpdateWorkspace(workspace._id, workspace.members);
  }
};
</script>

<template>
  <q-dialog class="create-workspace" @hide="cleanUp" v-model="reactiveShow">
    <q-card style="width: 800px; max-width: 80vw; min-height: 180px">
      <q-card-section>
        <div class="text-h6">Workspace bearbeiten</div>
      </q-card-section>

      <q-card-section v-if="!loading" class="q-pt-none">
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

      <q-inner-loading class="q-mt-xl" style="height: 120px" :showing="loading">
        <q-spinner-gears size="100px" color="primary" />
      </q-inner-loading>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn v-if="!loading" flat label="Abbrechen" v-close-popup />
        <q-btn v-if="!loading" flat label="Speichern" @click="saveData" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
