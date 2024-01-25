import { watch, ref } from "vue";
import {
  groupDatesByDay,
  calculateTime,
  loadTimeTables,
  adminloadTimeTables,
} from "../helpers";
import { useUserStore, useAlertStore } from "src/stores";
import { useRouter } from "vue-router";

export function useTimeTablesData() {
  const userStore = useUserStore();
  const alertStore = useAlertStore();
  const router = useRouter();
  const groupedTimeTablesData = ref(groupDatesByDay(userStore.timeTablesData));
  const calculateAllTime = ref(calculateTime(userStore.timeTablesData));
  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      groupedTimeTablesData.value = groupDatesByDay(newVal);
    }
  );

  watch(
    () => userStore.timeTablesData,
    (newVal) => {
      calculateAllTime.value = calculateTime(newVal);
    },
    {
      deep: true,
    }
  );

  watch(
    () => userStore.selectedTimeRange,
    async () => {
      try {
        const path = router.currentRoute.value.path;
        if (path.includes("adminworkspace")) {
          await adminloadTimeTables(userStore.selectedWorkspaceMember);
        } else {
          await loadTimeTables();
        }
        alertStore.success("Erfolgreich geladen", 2500);
      } catch (err) {
        alertStore.error("Laden Fehlgeschlagen", 3000);
      }
    },
    {
      deep: true,
    }
  );

  watch(
    () => userStore.selectedProjectFilter,
    async () => {
      try {
        const path = router.currentRoute.value.path;
        if (path.includes("adminworkspace")) {
          await adminloadTimeTables(userStore.selectedWorkspaceMember);
        } else {
          await loadTimeTables();
        }
        alertStore.success("Erfolgreich geladen", 2500);
      } catch (err) {
        alertStore.error("Laden Fehlgeschlagen", 3000);
      }
    }
  );

  watch(
    () => userStore.selectedRoleFilter,
    async () => {
      try {
        const path = router.currentRoute.value.path;
        if (path.includes("adminworkspace")) {
          await adminloadTimeTables(userStore.selectedWorkspaceMember);
        } else {
          await loadTimeTables();
        }
        alertStore.success("Erfolgreich geladen", 2500);
      } catch (err) {
        alertStore.error("Laden Fehlgeschlagen", 3000);
      }
    }
  );

  return {
    groupedTimeTablesData,
    calculateAllTime,
  };
}
