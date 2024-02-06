<script setup>
import { ref, computed } from "vue";
import { DateTime } from "luxon";
import { deleteWorkspaceUser, getWorkspaceMembers } from "../../service";
import { useAlertStore, useAuthStore, useUserStore } from "../../stores";
import { useRouter, useRoute } from "vue-router";
import { notifyUsersInWorkspaceToUpdateMembers } from "../../helpers";

const props = defineProps({
  time: {
    type: String,
  },
});
const verifyLeave = ref(false);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();

//const emit = defineEmits(["change"]);
const leaveWorkspace = async () => {
  const workspaceId = userStore.activeWorkspace._id;
  verifyLeave.value = false;
  const alertStore = useAlertStore();
  try {
    const { data } = await deleteWorkspaceUser(workspaceId);
    alertStore.success("Löschen Erfolgreich");
    if (!data.workspaceDeleted) {
      notifyWorkspaceUsers();
    }
    navigateHome();
  } catch (err) {
    alertStore.error("Löschen Fehlgeschlagen", 3000);
  }
};
const navigateHome = () => {
  router.push("/auth");
};

const notifyWorkspaceUsers = async () => {
  const workspaceId = userStore.activeWorkspace._id;
  const { data } = await getWorkspaceMembers(workspaceId);
  try {
    const excludeThisMember = data.filter(
      (member) => member.userId !== authStore.user._id
    );
    notifyUsersInWorkspaceToUpdateMembers(excludeThisMember, workspaceId);
  } catch (err) {}
};
</script>

<template>
  <div class="q-py-lg container flex-container flex-between">
    <div>
      <q-btn
        flat
        color="negative"
        @click="verifyLeave = true"
        label="Workspace verlassen"
      />
    </div>
    <q-dialog v-model="verifyLeave">
      <q-card>
        <q-card-section>
          <div class="text-h6">Workspace verlassen</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Wollen Sie den Workspace wirklich verlassen?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Verlassen"
            color="negative"
            @click="leaveWorkspace"
          />
          <q-btn flat label="Abbrechen" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
