<script setup>
import { ref, computed } from "vue";
import { DateTime } from "luxon";
import { deleteWorkspaceUser } from "../../service";
import router from "../../router";
import { useAlertStore } from "../../stores";

const props = defineProps({
  time: {
    type: String,
  },
});
const verifyLeave = ref(false);

//const emit = defineEmits(["change"]);
const leaveWorkspace = async () => {
  const workspaceId = router.currentRoute.value.params?.id;
  verifyLeave.value = false;
  const alertStore = useAlertStore();
  try {
    await deleteWorkspaceUser(workspaceId);
    alertStore.success("Löschen Erfolgreich");
    navigateHome();
  } catch (err) {
    alertStore.error("Löschen Fehlgeschlagen");
  }
};
const navigateHome = () => {
  router.push("/auth");
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

<style scoped>
button {
  margin-right: 16px;
}
</style>
