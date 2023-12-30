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
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthentication } from "../composables/useAuthentication";
import { useAuthStore } from "src/stores";
import router from "../router";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    useAuthentication();
    const authStore = useAuthStore();

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
