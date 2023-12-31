<script setup>
import { computed, watch, ref } from "vue";
import { useUserStore } from "../stores/user.store.js";
import { useAlertStore } from "../stores/alert.store.js";
import { DateTime } from "luxon";

const userStore = useUserStore();
const alertStore = useAlertStore();

const showConfirmDelete = ref(false);
let deleteTimeRecordId = null;

const columns = [
  { name: "firstname", label: "Vorname", field: "firstname" },
  { name: "lastname", label: "Nachname", field: "lastname" },
  {
    name: "isAdmin",
    label: "Admin",
    field: "isAdmin",
  },
  {
    name: "joined",
    label: "Beitritt",
    field: "joined",
  },
];

const members = computed({
  get() {
    return userStore.activeWorkspace.members;
  },
  set(val) {
    console.log(val);
  },
});

const emit = defineEmits(["changeIndex", "changedList"]);

const showDeleteTimeRecordDialog = (id) => {
  deleteTimeRecordId = id;
  showConfirmDelete.value = true;
};

const closeDeleteDialog = () => {
  deleteTimeRecordId = null;
  showConfirmDelete.value = false;
};

const formatDate = (date) => {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
};

const emitIndex = (index) => {
  console.log(index);
};
</script>

<template>
  <div>
    <q-table
      title="Mitglieder bearbeiten"
      :rows="members"
      :columns="columns"
      row-key="name"
      :hide-bottom="true"
      class="q-mb-lg"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="firstname" :props="props">
            {{ props.row.firstname }}
            <q-popup-edit
              v-model="props.row.firstname"
              max-height="500px"
              @save="emitIndex(props.rowIndex)"
              title="Edit the Name"
              buttons
              v-slot="scope"
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
              @save="emitIndex(props.rowIndex)"
              title="Edit the Name"
              buttons
              v-slot="scope"
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
                  @click="showDeleteTimeRecordDialog(props.row._id)"
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
          <span class="q-ml-sm"
            >Willst du den Zeiteintrag wirklich löschen?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Löschen"
            color="negative"
            @click="deleteTimeRecord"
          />
          <q-btn
            flat
            label="Abbrechen"
            color="primary"
            @click="closeDeleteDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style></style>
