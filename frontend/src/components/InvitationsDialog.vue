<script setup>
import { defineAsyncComponent, computed } from "vue";
import { useUserStore } from "../stores";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["hide"]);

const userStore = useUserStore();

const reactiveShow = computed({
  get() {
    return props.show;
  },
  set() {
    emit("hide");
  },
});

const lazyAcceptBannerComponent = defineAsyncComponent(() =>
  import("./AcceptBanner.vue")
);
const lazyInvitationBannerComponent = defineAsyncComponent(() =>
  import("./InvitationBanner.vue")
);
</script>

<template>
  <q-dialog v-model="reactiveShow">
    <q-card style="min-width: 90vw; max-width: 460px">
      <q-card-section>
        <div class="text-h6">Einladungen</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh; padding: 0" class="scroll">
        <div
          v-for="invitation in userStore.invitations"
          :key="invitation.sendUserId"
        >
          <template v-if="invitation.type === 'invitation'">
            <component
              :is="lazyInvitationBannerComponent"
              :invitation="invitation"
            />
          </template>
          <template v-else-if="invitation.type === 'accept_invitation'">
            <component
              :is="lazyAcceptBannerComponent"
              :invitation="invitation"
            />
          </template>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          class="q-mt-xl"
          flat
          label="Schliessen"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style></style>
