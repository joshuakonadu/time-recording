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
    <q-card style="width: 90vw; max-width: 760px">
      <q-card-section>
        <div class="text-h6">Neues Mitglied</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        hi
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
        <q-btn
          class="q-mt-xl"
          flat
          label="Senden"
          color="positive"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
