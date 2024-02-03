<script setup>
import { computed, watch, ref, nextTick } from "vue";
import { useUserStore, useAuthStore, useAlertStore } from "../../stores";
import { DateTime } from "luxon";
import {
  updateMembers,
  deleteWorkspaceMember,
  notifyUsersInWorkspaceToUpdateMembers,
  sendRemoveInvitationMessage,
} from "../../helpers";
import { recieverNotifyUpdateByUserId } from "../../client.socket.js";
import { getWorkspaceMembers } from "../../service";
import { useRouter, useRoute } from "vue-router";

const userStore = useUserStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showConfirmDelete = ref(false);
let deleteMemberId = null;

const editableColumns = ["firstname", "lastname", "isAdmin"];

const adminOptions = [
  { label: "Ja", value: true },
  { label: "Nein", value: false },
];

const columns = [
  {
    name: "firstname",
    label: "Vorname",
    field: "firstname",
    classes: "text-center",
    style: "text-align: center;",
    headerStyle: "text-align: center;",
  },
  {
    name: "lastname",
    label: "Nachname",
    field: "lastname",
    classes: "text-center",
    style: "text-align: center;",
    headerStyle: "text-align: center;",
  },
  {
    name: "isAdmin",
    label: "Admin",
    field: "isAdmin",
    classes: "text-center",
    style: "text-align: center;",
    headerStyle: "text-align: center;",
  },
  {
    name: "joined",
    label: "Beitritt",
    field: "joined",
    style: "text-align: center;",
    headerStyle: "text-align: center;",
  },
];

const emit = defineEmits(["selectMember"]);

const showDeleteMemberDialog = (id) => {
  deleteMemberId = id;
  showConfirmDelete.value = true;
};

const closeDeleteDialogAndResetValues = () => {
  deleteMemberId = null;
  showConfirmDelete.value = false;
};

const formatDate = (date) => {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
};

const update = async () => {
  try {
    //nextTick important
    await nextTick();
    await updateMembers();
    alertStore.success("Erfolgreich geändert");
    await nextTick();
    if (!userStore.isActiveWorkspaceAdmin) {
      const workspaceId = route.params.id;
      router.push("/workspace/" + workspaceId);
    }
  } catch (err) {
    alertStore.error("Änderung Fehlgeschlagen", 3000);
  } finally {
    notifyWorkspaceUsers();
  }
};

const emitSelectedMember = (data, tab) => {
  const newData = {
    firstname: data.firstname,
    lastname: data.lastname,
    userId: data.userId,
  };
  emit("selectMember", newData, tab);
};

const deleteMember = async () => {
  try {
    if (!deleteMemberId) throw new Error("Fehler");
    await deleteWorkspaceMember(deleteMemberId);
    alertStore.success("Erfolgreich gelöscht");
    if (deleteMemberId === authStore.user._id) {
      router.push("/auth");
    } else {
      const workspaceId = route.params.id;
      sendRemoveInvitationMessage(
        {
          sendUserId: deleteMemberId,
          workspaceName: userStore.activeWorkspace.name,
        },
        workspaceId
      )
        .then(() => updateMessages(deleteMemberId))
        .then(() => closeDeleteDialogAndResetValues());
    }
    notifyWorkspaceUsers();
  } catch (err) {
    alertStore.error("Löschen Fehlgeschlagen", 3000);
  }
};

const notifyWorkspaceUsers = () => {
  const workspaceId = route.params.id;
  getWorkspaceMembers(workspaceId)
    .then(({ data }) => {
      const excludeThisMember = data.filter(
        (member) => member.userId !== authStore.user._id
      );
      notifyUsersInWorkspaceToUpdateMembers(excludeThisMember, workspaceId);
    })
    .catch((err) => {});
};

function updateMessages(deleteMemberId) {
  recieverNotifyUpdateByUserId(deleteMemberId);
}
</script>

<template>
  <div>
    <q-table
      title="Mitglieder bearbeiten"
      :rows="userStore.activeWorkspace.members"
      :columns="columns"
      row-key="name"
      :hide-bottom="true"
      class="q-mb-lg"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
            <q-icon
              v-if="editableColumns.includes(col.name)"
              class="q-mb-xs q-ml-sm"
              name="fa-solid fa-pen-to-square"
              size="1.1em"
            />
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="md"
              color="accent"
              dense
              flat
              icon="fa-regular fa-clock"
              @click="emitSelectedMember(props.row, 'user')"
            >
              <q-tooltip> Zeiten einsehen/bearbeiten </q-tooltip>
            </q-btn>
          </q-td>
          <q-td auto-width>
            <q-btn
              size="md"
              color="primary"
              dense
              flat
              icon="fa-solid fa-chart-line"
              @click="emitSelectedMember(props.row, 'charts')"
            >
              <q-tooltip> Zeiten Diagramme </q-tooltip>
            </q-btn>
          </q-td>
          <q-td key="firstname" :props="props">
            {{ props.row.firstname }}
            <q-popup-edit
              v-model="props.row.firstname"
              max-height="500px"
              @save="update"
              title="Bearbeiten"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <div class="text-italic text-primary q-mb-xs">Bearbeiten</div>
              <q-input
                type="text"
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="lastname" :props="props">
            {{ props.row.lastname }}
            <q-popup-edit
              v-model="props.row.lastname"
              max-height="500px"
              @save="update"
              title="Bearbeiten"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <div class="text-italic text-primary q-mb-xs">Bearbeiten</div>
              <q-input
                type="text"
                v-model="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="isAdmin" :props="props">
            <span v-if="props.row.isAdmin">Ja</span>
            <span v-else>Nein</span>
            <q-popup-edit
              v-model="props.row.isAdmin"
              @save="update"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <div class="text-italic text-primary q-mb-xs">
                Admin Rechte geben?
              </div>
              <q-select
                v-model="scope.value"
                :options="adminOptions"
                map-options
                emit-value
                label="Admin"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="joined" :props="props">
            {{ formatDate(props.row.joined) }}
          </q-td>
          <q-td auto-width>
            <q-btn-dropdown
              size="sm"
              color="dark"
              dense
              flat
              icon="fa-solid fa-ellipsis-vertical"
              dropdown-icon="none"
            >
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="showDeleteMemberDialog(props.row.userId)"
                >
                  <q-item-section>
                    <q-item-label>Löschen</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="showConfirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Willst du den User wirklich löschen?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Löschen" color="negative" @click="deleteMember" />
          <q-btn
            flat
            label="Abbrechen"
            color="primary"
            @click="closeDeleteDialogAndResetValues"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style></style>
