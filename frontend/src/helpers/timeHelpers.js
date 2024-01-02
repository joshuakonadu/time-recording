import { DateTime, Interval } from "luxon";
import { useUserStore } from "src/stores/user.store.js";
import {
  getTimesByWorkspaceUser,
  getTimesByWorkspaceAdmin,
  addTimeRecord,
} from "../service";
import router from "../router";

export const timeMask = "YYYY-MM-DDTHH:mm:ss";

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
  const sendData = {
    workspaceId: routeId,
    from: userStore.timeTablesDate.from,
    to: userStore.timeTablesDate.to,
  };
  const { data } = await getTimesByWorkspaceUser(sendData);
  data.sort(sortDate);
  userStore.setTimeTablesData(data);
};

export const addNewTimeRecord = async (data) => {
  const userStore = useUserStore();
  const apiData = await addTimeRecord(data);
  userStore.addNewTimeData(apiData.data);
};

export const getFirstOfMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return DateTime.fromJSDate(firstDay).toString();
};

export const getDateNow = () => {
  return DateTime.now().toString();
};

export const adminAddNewTimeRecord = async (data) => {
  const userStore = useUserStore();
  const apiData = await addTimeRecord(data);
  userStore.addNewTimeData(apiData.data);
};

export const adminloadTimeTables = async (userId) => {
  const userStore = useUserStore();
  const routeId = router.currentRoute.value.params?.id;
  const sendData = {
    workspaceId: routeId,
    from: userStore.timeTablesDate.from,
    to: userStore.timeTablesDate.to,
    userId: userId,
  };
  const { data } = await getTimesByWorkspaceAdmin(sendData);
  data.sort(sortDate);
  userStore.setTimeTablesData(data);
};
