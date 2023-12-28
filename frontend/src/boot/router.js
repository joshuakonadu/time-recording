import { boot } from "quasar/wrappers";
import Router from "src/router";
import { useAuthStore } from "src/stores";
import { isInUnautherizedRoute } from "src/helpers/routesHelpers";

export default boot(({ app }) => {
  const authStore = useAuthStore();
  Router.beforeEach((to, from, next) => {
    if (authStore.user && isInUnautherizedRoute(to.path)) {
      next({ path: "/auth" });
    } else {
      next();
    }
  });
});
