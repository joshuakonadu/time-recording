<script setup>
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

import { useAuthStore } from "../../stores";

const schema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

async function onSubmit(values) {
  const authStore = useAuthStore();
  await authStore.login(values);
}
</script>

<template>
  <div class="card m-3">
    <h4 class="card-header">Login</h4>
    <div class="card-body">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ errors, isSubmitting }"
      >
        <div class="form-group">
          <label>Email</label>
          <Field
            name="email"
            type="text"
            class="form-control"
            placeholder="Email..."
            :class="{ 'is-invalid': errors.email }"
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <Field
            name="password"
            type="password"
            class="form-control"
            placeholder="Password..."
            :class="{ 'is-invalid': errors.password }"
          />
          <div class="invalid-feedback">{{ errors.password }}</div>
        </div>
        <div class="form-group">
          <q-btn
            color="primary"
            class="q-mr-xl"
            type="submit"
            :loading="isSubmitting"
          >
            Login
          </q-btn>
          <q-btn color="secondary" to="/register"> Registrieren </q-btn>
        </div>
      </Form>
    </div>
  </div>
</template>
