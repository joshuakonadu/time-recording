<script setup>
import { useUserStore, useAlertStore } from "src/stores";
import {
  acceptInvitation,
  removeInvite,
  getWorkspaceMembers,
} from "../service";
import { notifyUsersInWorkspaceToUpdateMembers } from "../helpers/socketHelpers.js";

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
  } finally {
    getWorkspaceMembers(props.invitation.workspaceId)
      .then(({ data }) => {
        notifyUsersInWorkspaceToUpdateMembers(
          data,
          props.invitation.workspaceId
        );
      })
      .catch((err) => {});
  }
};

const removeInvitation = async () => {
  try {
    await removeInvite({ messageId: props.invitation.messageId });
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
    Du wurdest von {{ props.invitation.sendUserName }} in den Workspace '{{
      props.invitation.workspaceName
    }}' eingeladen.
    <template v-slot:action>
      <q-btn flat @click="removeInvitation" color="negative" label="Löschen" />
      <q-btn flat @click="accept" color="positive" label="Akzeptieren" />
    </template>
  </q-banner>
</template>
