<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Time App </q-toolbar-title>
        <q-btn
          @click="fixed = true"
          class="q-mr-md"
          dense
          round
          flat
          icon="email"
        >
          <q-badge color="red" floating transparent>
            {{ userStore.invitations.length }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <div class="half">
        <q-item-label header> Navigation </q-item-label>
        <q-list>
          <EssentialLink
            v-for="link in essentialLinks1"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </div>

      <div class="half end">
        <q-item-label header> Aktionen </q-item-label>
        <q-list>
          <EssentialLink
            v-for="link in essentialLinks2"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="fixed">
      <q-card style="min-width: 400px">
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
              <InvitationBanner :invitation="invitation" />
            </template>
            <template v-else-if="invitation.type === 'accept_invitation'">
              <AcceptBanner :invitation="invitation" />
            </template>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Schliessen" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthentication } from "../composables/useAuthentication";
import { useAuthStore, useUserStore } from "src/stores";
import router from "../router";
import AcceptBanner from "../components/AcceptBanner.vue";
import InvitationBanner from "../components/InvitationBanner.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
    AcceptBanner,
    InvitationBanner,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    useAuthentication();
    const authStore = useAuthStore();

    const fixed = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const linksList1 = [
      {
        title: "Home",
        caption: "",
        icon: "home",
        clickAction: () => {
          router.push("/auth");
          toggleLeftDrawer();
        },
      },
    ];
    const linksList2 = [
      {
        title: "Abmelden",
        caption: "",
        icon: "logout",
        clickAction: () => authStore.logout(),
      },
    ];
    return {
      essentialLinks1: linksList1,
      essentialLinks2: linksList2,
      leftDrawerOpen,
      toggleLeftDrawer,
      userStore: useUserStore(),
      fixed,
    };
  },
});
</script>

<style scoped>
.half {
  height: 50%;
}

.half.end {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
