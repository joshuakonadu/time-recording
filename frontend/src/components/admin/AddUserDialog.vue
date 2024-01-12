<script setup>
import { defineAsyncComponent, computed, ref } from "vue";
import { useUserStore, useAuthStore, useAlertStore } from "../../stores";
import { inviteUserToWorkspace } from "../../service";
import router from "../../router";
import { recieverNotifyInvitationByUserId } from "../../client.socket.js";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["hide"]);

const userStore = useUserStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();

const loading = ref(false);
const success = ref(false);

const email = ref("");

const isAdmin = ref(false);

const adminOptions = [
  { label: "Admin", value: true },
  { label: "Kein Admin", value: false },
];

const reactiveShow = computed({
  get() {
    return props.show;
  },
  set() {
    emit("hide");
  },
});

const cleanUp = () => {
  loading.value = false;
  success.value = false;
  email.value = "";
  isAdmin.value = false;
};

const sendInvitation = async () => {
  if (!email.value) return;
  loading.value = true;
  const sendData = {
    workspaceId: router.currentRoute.value.params?.id,
    workspaceName: userStore.activeWorkspace.name,
    isAdmin: isAdmin.value,
    email: email.value,
  };
  try {
    const response = await inviteUserToWorkspace(sendData);
    const { recieverUserId } = response.data;
    success.value = true;
    recieverNotifyInvitationByUserId(recieverUserId);
  } catch (err) {
    alertStore.error(err.response.data.message, 5000);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-dialog v-model="reactiveShow">
    <q-card style="width: 800px; max-width: 80vw; min-height: 180px">
      <q-card-section>
        <div class="text-h6">Neues Mitglied</div>
      </q-card-section>

      <q-card-section v-if="!loading && !success" class="q-pt-none">
        <div class="flex-container">
          <div class="name">
            <q-input bottom-slots v-model="email" label="E-Mail"> </q-input>
          </div>
          <div class="mode">
            <q-select
              v-model="isAdmin"
              :options="adminOptions"
              map-options
              emit-value
              label="Rolle"
            >
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <transition appear enter-active-class="animated fadeIn">
          <div v-show="success" class="text-positive">
            Einladung wurde erfolgreich gesendet.
          </div>
        </transition>
      </q-card-section>

      <q-inner-loading class="q-mt-xl" style="height: 120px" :showing="loading">
        <q-spinner-gears size="100px" color="primary" />
      </q-inner-loading>

      <q-card-actions v-if="!loading" align="right">
        <q-btn
          class="q-mt-xl"
          flat
          label="Schliessen"
          color="primary"
          v-close-popup
          @click="cleanUp"
        />
        <q-btn
          v-if="!success"
          class="q-mt-xl"
          flat
          label="Senden"
          color="positive"
          @click="sendInvitation"
        />
        <q-btn
          v-else
          class="q-mt-xl"
          flat
          label="Weitere einladen"
          color="info"
          @click="cleanUp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped>
.name {
  width: 100%;
}

@media screen and (min-width: 750px) {
  .name {
    width: 70%;
  }

  .mode {
    width: 20%;
    margin-left: 24px;
  }
}
</style>
