import { DateTime, Interval } from "luxon";
import { useUserStore } from "src/stores/user.store.js";
import { getTimesByWorkspaceUser } from "../service";
import router from "../router";

export const groupDatesByDay = (dates) => {
  const timesObj = {};
  dates.forEach((obj) => {
    const day = obj.from.split("T")[0];
    if (!(day in timesObj)) {
      timesObj[day] = [];
    }
    timesObj[day].push(obj);
  });
  return timesObj;
};

export const calculateTime = (data) => {
  const sumAllminutes = data.reduce((acc, obj) => {
    const from = DateTime.fromISO(obj.from);
    const to = DateTime.fromISO(obj.to);
    acc += Interval.fromDateTimes(from, to).length("minutes");
    return acc;
  }, 0);
  const hours = Math.floor(sumAllminutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.floor(sumAllminutes) % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const sortDate = (data1, data2) => {
  return data1.from > data2.from ? -1 : 1;
};

export const loadTimeTables = async () => {
  const userStore = useUserStore();
  const routeId = router.currentRoute.value.params?.id;
  const { data } = await getTimesByWorkspaceUser(routeId);
  data.sort(sortDate);
  userStore.setTimeTablesData(data);
};
