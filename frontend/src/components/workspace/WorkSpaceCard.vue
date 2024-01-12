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
      <div class="text-h6">{{ props.data.name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn :to="`/workspace/${props.data.workspaceId}`" flat>Öffnen</q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.my-card {
  width: 160px;
}

.text-h6 {
  text-align: center;
}
</style>
