<script setup>
import { useUserStore } from "src/stores";
const props = defineProps({
  invitation: {
    type: Object,
    required: true,
  },
});
const userStore = useUserStore();

const removeInvitation = () => {
  userStore.invitations = userStore.invitations.filter(
    (data, index) => index !== 0
  );
};
</script>

<template>
  <q-banner class="bg-primary text-white">
    Du wurdest von {{ props.invitation.sendUserName }} in den Workspace
    {{ props.invitation.workspaceName }} eingeladen.
    <template v-slot:action>
      <q-btn flat @click="removeInvitation" color="negative" label="Löschen" />
      <q-btn flat color="positive" label="Akzeptieren" />
    </template>
  </q-banner>
</template>
