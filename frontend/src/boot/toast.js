import { boot } from "quasar/wrappers";
import "vue-toastification/dist/index.css";
import Toast from "vue-toastification";

export default boot(({ app }) => {
  app.use(Toast);
});
