<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthentication } from "../composables/useAuthentication";

useAuthentication();
</script>
