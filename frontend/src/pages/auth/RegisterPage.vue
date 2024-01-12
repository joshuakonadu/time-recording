<script setup>
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { register } from "../../service";

import { useAlertStore } from "../../stores";
import router from "../../router";

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
    alertStore.success("Registration successful", 5000);
  } catch (error) {
    alertStore.error(error.message, 5000);
  }
}
</script>

<template>
  <div class="card m-3">
    <h4 class="card-header">Register</h4>
    <div class="card-body">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ errors, isSubmitting }"
      >
        <div class="form-group">
          <label>First Name</label>
          <Field
            name="firstname"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.firstname }"
          />
          <div class="invalid-feedback">{{ errors.firstname }}</div>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <Field
            name="lastname"
            type="text"
            class="form-control"
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
            :class="{ 'is-invalid': errors.passwordConfirmation }"
          />
          <div class="invalid-feedback">{{ errors.passwordConfirmation }}</div>
        </div>
        <div class="form-group">
          <button class="btn btn-primary" :disabled="isSubmitting">
            <span
              v-show="isSubmitting"
              class="spinner-border spinner-border-sm mr-1"
            ></span>
            Register
          </button>
          <router-link to="login" class="btn btn-link">Cancel</router-link>
        </div>
      </Form>
    </div>
  </div>
</template>
