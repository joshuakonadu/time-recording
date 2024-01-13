<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
</script>

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6 custom-title">{{ props.data.name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn :to="`/workspace/${props.data.workspaceId}`" flat>Öffnen</q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.my-card {
  width: 200px;
}

.text-h6 {
  text-overflow: ellipsis;
  overflow: hidden;
}

:deep(.q-card__section) {
  display: flex;
  flex-wrap: wrap;
  height: 90px;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
</style>
