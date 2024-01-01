import { boot } from "quasar/wrappers";
import Router from "src/router";
import { useAuthStore } from "src/stores";
import { isInUnauthorizedRoute } from "src/helpers/routesHelpers";

export default boot(({ app }) => {
  const authStore = useAuthStore();
  Router.beforeEach((to, from, next) => {
    if (authStore.user && isInUnauthorizedRoute(to.path)) {
      next({ path: "/auth" });
    } else {
      next();
    }
  });
});
