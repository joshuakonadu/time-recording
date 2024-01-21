<script setup>
import { Form, Field } from "vee-validate";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import { register } from "../../service";

import { useAlertStore } from "../../stores";

const router = useRouter();

const schema = Yup.object().shape({
  firstname: Yup.string()
    .required("First Name is required")
    .min(3, "firstname must be at least 3 characters"),
  lastname: Yup.string()
    .required("Last Name is required")
    .min(2, "lastname must be at least 2 characters"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  passwordConfirmation: Yup.string()
    .required("Password wiederholen is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

async function onSubmit(values) {
  const alertStore = useAlertStore();
  try {
    await register(values);
    await router.push("/login");
    alertStore.success("Registrierung erfolgreich", 5000);
  } catch (error) {
    alertStore.error(error.message, 5000);
  }
}
</script>

<template>
  <div class="card m-3">
    <h4 class="card-header">Registrieren</h4>
    <div class="card-body">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ errors, isSubmitting }"
      >
        <div class="form-group">
          <label>Vorname</label>
          <Field
            name="firstname"
            type="text"
            class="form-control"
            placeholder="Vorname..."
            :class="{ 'is-invalid': errors.firstname }"
          />
          <div class="invalid-feedback">{{ errors.firstname }}</div>
        </div>
        <div class="form-group">
          <label>Nachname</label>
          <Field
            name="lastname"
            type="text"
            class="form-control"
            placeholder="Nachname..."
            :class="{ 'is-invalid': errors.lastname }"
          />
          <div class="invalid-feedback">{{ errors.lastname }}</div>
        </div>
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
          <label>Password wiederholen</label>
          <Field
            name="passwordConfirmation"
            type="password"
            class="form-control"
            placeholder="Password wiederholen..."
            :class="{ 'is-invalid': errors.passwordConfirmation }"
          />
          <div class="invalid-feedback">{{ errors.passwordConfirmation }}</div>
        </div>
        <div class="form-group">
          <q-btn
            class="q-mr-xl"
            color="primary"
            type="submit"
            :loading="isSubmitting"
          >
            Registrieren
          </q-btn>
          <q-btn color="negative" to="/login"> Abbrechen </q-btn>
        </div>
      </Form>
    </div>
  </div>
</template>
