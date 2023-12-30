import { useToast } from "vue-toastification";
import { watch } from "vue";
import { useAlertStore } from "../stores";

export function useToastAlert() {
  const toast = useToast();

  const alertStore = useAlertStore();

  watch(
    () => alertStore.alert,
    (newVal) => {
      toast[newVal.type](newVal.message, {
        timeout: newVal.ms,
      });
    }
  );
}
