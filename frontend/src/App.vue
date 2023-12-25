<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { useToastAlert } from "./composables/useToastAlert";
export default defineComponent({
  name: "App",
  setup() {
    useToastAlert();
  },
});
</script>
