<script setup>
import { removeInvite } from "../service";
import { useUserStore, useAlertStore } from "src/stores";
const props = defineProps({
  invitation: {
    type: Object,
    required: true,
  },
});

const alertStore = useAlertStore();
const userStore = useUserStore();

const removeInvitation = async () => {
  try {
    await removeInvite({ workspaceId: props.invitation.workspaceId });
  } catch (err) {
    alertStore.error("Aktion fehlgeschlagen", 4000);
  }
  try {
    await userStore.getInvitations();
  } catch (err) {
    alertStore.error(
      "Beim aktualisieren der Nachrichten ist ein Fehler aufgetreten",
      5000
    );
  }
};
</script>

<template>
  <q-banner class="bg-positive text-white">
    <template v-slot:avatar>
      <q-icon name="fa-regular fa-square-check" color="white" />
    </template>
    {{ props.invitation.sendUserName }} hat deine Einladung in den Workspace
    {{ props.invitation.workspaceName }} angenommen.
    <template v-slot:action>
      <q-btn @click="removeInvitation" flat color="white" label="Okay" />
    </template>
  </q-banner>
</template>
