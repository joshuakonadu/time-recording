const routes = [
  {
    path: "/",
    component: () => import("layouts/GuestLayout.vue"),
    children: [
      { path: "/login", component: () => import("pages/LoginPage.vue") },
      { path: "/register", component: () => import("pages/RegisterPage.vue") },
      { path: "", component: () => import("pages/LandingPage.vue") },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/HomePage.vue") },
      {
        path: "/workspace/:id",
        component: () => import("pages/WorkspacePage.vue"),
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
