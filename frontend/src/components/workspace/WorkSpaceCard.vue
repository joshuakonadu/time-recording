<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <q-card class="workspace-card my-card">
    <q-card-section>
      <div class="text-h6 custom-title">{{ props.data.name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn :to="`/workspace/${props.data.workspaceId}`" flat>Öffnen</q-btn>
    </q-card-actions>
  </q-card>
</template>
