import { boot } from "quasar/wrappers";
import Router from "src/router";
import { useAuthStore } from "src/stores";
import { unAutherizedRoutes } from "src/helpers/routesHelpers";

export default boot(({ app }) => {
  const authStore = useAuthStore();
  Router.beforeEach((to, from, next) => {
    if (
      authStore.user &&
      unAutherizedRoutes.some((route) => route === to.path)
    ) {
      console.log("fullfilled");
      next({ path: "/auth" });
    } else {
      next();
    }
  });
});
