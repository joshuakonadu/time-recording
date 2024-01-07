<script setup>
const props = defineProps({
  invitation: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <q-banner class="bg-positive text-white">
    <template v-slot:avatar>
      <q-icon name="fa-regular fa-square-check" color="white" />
    </template>
    {{ props.invitation.sendUserName }} hat deine Einladung in den Workspace
    {{ props.invitation.workspaceName }} angenommen.
    <template v-slot:action>
      <q-btn flat color="white" label="Okay" />
    </template>
  </q-banner>
</template>
