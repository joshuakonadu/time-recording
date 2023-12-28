<template>
  <div class="container">
    <div class="button-section q-pt-md">
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Registrieren</router-link>
    </div>
    <h1 class="text-h2 text-center">Willkommen bei Time App</h1>
  </div>
</template>

<style scoped>
.button-section {
  display: flex;
  justify-content: flex-end;
}
.button-section a {
  margin-left: 1em;
  font-size: 1rem;
}
</style>
