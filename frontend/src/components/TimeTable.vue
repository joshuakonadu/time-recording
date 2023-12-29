<script setup>
import { computed, watch } from "vue";
import { DateTime, Interval } from "luxon";
import { useUserStore } from "../stores/user.store";

const userStore = useUserStore();

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
  const sumAllminutes = props.data.reduce((acc, obj) => {
    const from = DateTime.fromISO(obj.from);
    const to = DateTime.fromISO(obj.to);
    acc += Interval.fromDateTimes(from, to).length("minutes");
    return acc;
  }, 0);
  const hours = Math.floor(sumAllminutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.floor(sumAllminutes) % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

const emitIndex = (index) => {
  emit("changeIndex", index);
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
          >
            <q-time
              mask="YYYY-MM-DDTHH:mm"
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
          >
            <q-time
              mask="YYYY-MM-DDTHH:mm"
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
      </q-tr>
    </template>
  </q-table>
</template>

<style></style>
