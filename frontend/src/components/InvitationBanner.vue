<script setup>
import { useUserStore, useAlertStore } from "src/stores";
import { acceptInvitation, removeInvite } from "../service";
const props = defineProps({
  invitation: {
    type: Object,
    required: true,
  },
});
const userStore = useUserStore();
const alertStore = useAlertStore();

const accept = async () => {
  try {
    await acceptInvitation({ workspaceId: props.invitation.workspaceId });
    alertStore.success("Aktion Erfolgreich", 2500);
  } catch (err) {
    alertStore.error("Beim Annehmen ist ein Fehler aufgetreten", 4000);
  }
  try {
    await userStore.getWorkspaces();
    await userStore.getInvitations();
  } catch (err) {
    alertStore.error(
      "Beim Aktualisieren der Daten ist ein Fehler aufgetreten",
      4000
    );
  }
};

const removeInvitation = async () => {
  try {
    await removeInvite({ messageId: props.invitation.messageId });
    alertStore.success("Erfolgreich Angenommen", 2500);
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
  <q-banner class="bg-primary text-white">
    <template v-slot:avatar>
      <q-icon name="fa-regular fa-building" color="white" />
    </template>
    Du wurdest von {{ props.invitation.sendUserName }} in den Workspace
    {{ props.invitation.workspaceName }} eingeladen.
    <template v-slot:action>
      <q-btn flat @click="removeInvitation" color="negative" label="Löschen" />
      <q-btn flat @click="accept" color="positive" label="Akzeptieren" />
    </template>
  </q-banner>
</template>
