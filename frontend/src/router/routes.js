const routes = [
  {
    path: "/",
    component: () => import("layouts/GuestLayout.vue"),
    children: [
      { path: "/login", component: () => import("pages/auth/LoginPage.vue") },
      {
        path: "/register",
        component: () => import("pages/auth/RegisterPage.vue"),
      },
      { path: "", component: () => import("pages/LandingPage.vue") },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/user/HomePage.vue") },
      {
        path: "/workspace/:id",
        component: () => import("pages/user/WorkspacePage.vue"),
      },
      {
        path: "/adminworkspace/:id",
        component: () => import("pages/admin/WorkspaceAdmin.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
