<script setup>
import { computed, watch, ref } from "vue";
import { useUserStore, useAlertStore } from "../../stores";
import { calculateTime, timeMask } from "../../helpers/timeHelpers";
import { DateTime } from "luxon";
import { loadTimeTables } from "../../helpers/timeHelpers.js";
import { deleteTimeRecordById } from "../../service";

const userStore = useUserStore();
const alertStore = useAlertStore();

const showConfirmDelete = ref(false);
let deleteTimeRecordId = null;

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["changeIndex", "changedList"]);

const sumTime = computed(() => {
  return calculateTime(props.data);
});

const emitIndex = (index) => {
  emit("changeIndex", index);
};

const deleteTimeRecord = async () => {
  try {
    //TODO: Delete Time Record Api
    await deleteTimeRecordById(deleteTimeRecordId);
    await loadTimeTables();
    alertStore.success("Löschen Erfolgreich");
  } catch (err) {
    alertStore.error("Löschen Fehlgeschlagen", 3000);
  } finally {
    closeDeleteDialog();
  }
};

const showDeleteTimeRecordDialog = (id) => {
  deleteTimeRecordId = id;
  showConfirmDelete.value = true;
};

const closeDeleteDialog = () => {
  deleteTimeRecordId = null;
  showConfirmDelete.value = false;
};

watch(
  () => props.data,
  (newVal, oldVal) => {
    emit("changedList", newVal);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div>
    <q-table
      :title="`${DateTime.fromISO(props.day).toLocaleString(
        DateTime.DATE_HUGE
      )} (${sumTime}h)`"
      :rows="props.data"
      :columns="columns"
      row-key="name"
      :hide-bottom="true"
      class="q-mb-lg"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
            <q-icon
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
          <q-td key="from" :props="props">
            {{ props.cols[0].format(props.row.from) }}
            <q-popup-edit
              v-model="props.row.from"
              max-height="500px"
              @save="emitIndex(props.rowIndex)"
              title="Edit the Name"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <q-time
                :mask="timeMask"
                flat
                :now-btn="true"
                v-model="scope.value"
              >
              </q-time>
            </q-popup-edit>
          </q-td>
          <q-td key="to" :props="props">
            {{ props.cols[0].format(props.row.to) }}
            <q-popup-edit
              v-model="props.row.to"
              max-height="500px"
              @save="emitIndex(props.rowIndex)"
              title="Edit the Name"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <q-time
                :mask="timeMask"
                flat
                :now-btn="true"
                v-model="scope.value"
              >
              </q-time>
            </q-popup-edit>
          </q-td>
          <q-td key="project" :props="props">
            {{ props.row.project }}
            <q-popup-edit
              v-model="props.row.project"
              @save="emitIndex(props.rowIndex)"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <div class="text-italic text-primary q-mb-xs">Bearbeiten</div>
              <q-select
                v-model="scope.value"
                :options="userStore.activeWorkspace.projectOption"
                dense
              />
            </q-popup-edit>
          </q-td>
          <q-td key="role" :props="props">
            {{ props.row.role }}
            <q-popup-edit
              v-model="props.row.role"
              @save="emitIndex(props.rowIndex)"
              buttons
              v-slot="scope"
              label-set="Speichern"
              label-cancel="Abbrechen"
            >
              <div class="text-italic text-primary q-mb-xs">Bearbeiten</div>
              <q-select
                v-model="scope.value"
                :options="userStore.activeWorkspace.roleOption"
                dense
              />
            </q-popup-edit>
          </q-td>
          <q-td key="description" :props="props">
            {{ props.row.description }}
            <q-popup-edit
              v-model="props.row.description"
              @save="emitIndex(props.rowIndex)"
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
