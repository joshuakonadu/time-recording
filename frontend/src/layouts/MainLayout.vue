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
        <div class="q-mr-xl">
          {{ authStore.user?.firstname }} {{ authStore.user?.lastname }}
          <q-icon class="q-ml-xs" name="fa-solid fa-at">
            <q-tooltip> {{ authStore.user?.email }} </q-tooltip>
          </q-icon>
        </div>
        <q-btn
          @click="showMessages"
          class="q-mr-md"
          dense
          round
          flat
          icon="email"
        >
          <q-badge
            v-if="userStore.invitations.length"
            color="red"
            floating
            transparent
          >
            {{ userStore.invitations.length }}
          </q-badge>
          <q-badge v-else color="grey" floating transparent> 0 </q-badge>
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

    <template v-if="openMessageDialog">
      <component
        :is="lazyInvitationsDialogComponent"
        @hide="openMessageDialog = false"
        :show="openMessageDialog"
      />
    </template>
  </q-layout>
</template>

<script>
import { defineComponent, ref, defineAsyncComponent, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthentication } from "../composables/useAuthentication";
import { useAuthStore, useUserStore, useAlertStore } from "src/stores";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    useAuthentication();
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const router = useRouter();

    const openMessageDialog = ref(false);
    const lazyInvitationsDialogComponent = defineAsyncComponent(() =>
      import("../components/messages/InvitationsDialog.vue")
    );

    onMounted(async () => {
      try {
        await userStore.getInvitations();
      } catch (err) {
        const alertStore = useAlertStore();
        alertStore.error("Nachrichten konnten nicht geladen werden", 4000);
      }
    });

    const showMessages = () => {
      if (!userStore.invitations.length) return;
      openMessageDialog.value = true;
    };

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
      userStore,
      authStore,
      openMessageDialog,
      showMessages,
      lazyInvitationsDialogComponent,
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
