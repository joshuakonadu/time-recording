import { watch, ref } from "vue";
import {
  groupDatesByDay,
  calculateTime,
  loadTimeTables,
  adminloadTimeTables,
} from "../helpers";
import { useUserStore, useAlertStore } from "src/stores";
import { useRoute } from "vue-router";

export function useTimeTablesData() {
  const userStore = useUserStore();
  const alertStore = useAlertStore();
  const route = useRoute();
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
        const path = route.path;
        if (path.includes("adminworkspace")) {
          if (!userStore.selectedWorkspaceMember?.userId) {
            throw new Error("no member selected");
          }
          await adminloadTimeTables(userStore.selectedWorkspaceMember.userId);
        } else {
          await loadTimeTables();
        }
        alertStore.success("Erfolgreich geladen");
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
        const path = route.path;
        if (path.includes("adminworkspace")) {
          if (!userStore.selectedWorkspaceMember?.userId) {
            throw new Error("no member selected");
          }
          await adminloadTimeTables(userStore.selectedWorkspaceMember.userId);
        } else {
          await loadTimeTables();
        }
        alertStore.success("Erfolgreich geladen");
      } catch (err) {
        alertStore.error("Laden Fehlgeschlagen", 3000);
      }
    }
  );

  watch(
    () => userStore.selectedRoleFilter,
    async () => {
      try {
        const path = route.path;
        if (path.includes("adminworkspace")) {
          if (!userStore.selectedWorkspaceMember?.userId) {
            throw new Error("no member selected");
          }
          await adminloadTimeTables(userStore.selectedWorkspaceMember.userId);
        } else {
          await loadTimeTables();
        }
        alertStore.success("Erfolgreich geladen");
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
