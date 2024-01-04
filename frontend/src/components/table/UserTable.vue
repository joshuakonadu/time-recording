<script setup>
import { DateTime } from "luxon";
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const columns = [
  { name: "firstname", label: "Vorname", field: "firstname" },
  { name: "lastname", label: "Nachname", field: "lastname" },
  {
    name: "isAdmin",
    label: "Admin",
    field: "isAdmin",
    format: (val) => (val ? "Ja" : "Nein"),
  },
  {
    name: "joined",
    label: "Beitritt",
    field: "joined",
    format: (val) => DateTime.fromISO(val).toLocaleString(DateTime.DATE_MED),
  },
];
</script>

<template>
  <q-table
    title="Mitglieder"
    :rows="props.data"
    :columns="columns"
    row-key="name"
    :hide-bottom="true"
  />
</template>

<style scoped></style>
