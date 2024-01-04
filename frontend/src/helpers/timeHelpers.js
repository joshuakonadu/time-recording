import { DateTime, Interval } from "luxon";
import { useUserStore } from "src/stores/user.store.js";
import {
  getTimesByWorkspaceUser,
  getTimesByWorkspaceAdmin,
  addTimeRecord,
  adminAddTimeRecord,
} from "../service";
import router from "../router";

export const timeMask = "YYYY-MM-DDTHH:mm:ss.SSSZ";

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
    let timeDiff = Interval.fromDateTimes(from, to).length("minutes");
    if (isNaN(timeDiff)) {
      timeDiff = 0;
    }
    acc += timeDiff;
    return acc;
  }, 0);
  const hours = Math.floor(sumAllminutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.floor(sumAllminutes) % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const sortDate = (data1, data2) => {
  return data1.from > data2.from ? -1 : data1.from < data2.from ? 1 : 0;
};

export const loadTimeTables = async () => {
  const userStore = useUserStore();
  const routeId = router.currentRoute.value.params?.id;
  const sendData = {
    workspaceId: routeId,
    from: userStore.selectedTimeRange?.from,
    to: userStore.selectedTimeRange?.to,
  };
  const { data } = await getTimesByWorkspaceUser(sendData);

  const processedTimeData = getProcessedTimeData(data);
  userStore.setTimeTablesData(processedTimeData);
};

export const addNewTimeRecord = async (data) => {
  const userStore = useUserStore();
  const apiData = await addTimeRecord(data);
  const timeZoneTransform = getTimeZoneTransform(apiData.data);
  userStore.addNewTimeData(timeZoneTransform);
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
  const apiData = await adminAddTimeRecord(data);
  const timeZoneTransform = getTimeZoneTransform(apiData.data);
  userStore.addNewTimeData(timeZoneTransform);
};

export const adminloadTimeTables = async (userId) => {
  const userStore = useUserStore();
  const routeId = router.currentRoute.value.params?.id;
  const sendData = {
    workspaceId: routeId,
    from: userStore.selectedTimeRange?.from,
    to: userStore.selectedTimeRange?.to,
    userId: userId,
  };
  const { data } = await getTimesByWorkspaceAdmin(sendData);

  const processedTimeData = getProcessedTimeData(data);
  userStore.setTimeTablesData(processedTimeData);
};

export const modifyToSelect = (time) => {
  return DateTime.fromISO(time)
    .set({ hour: 23, minute: 59, second: 59 })
    .toString();
};

function getProcessedTimeData(timeData) {
  const processedData = timeData.map((timeObj) => {
    return {
      ...timeObj,
      from: DateTime.fromISO(timeObj.from).toString(),
      to: DateTime.fromISO(timeObj.to).toString(),
    };
  });
  processedData.sort(sortDate);
  return processedData;
}

function getTimeZoneTransform(timeData) {
  if (!timeData) return;
  return {
    ...timeData,
    from: DateTime.fromISO(timeData.from).toString(),
    to: DateTime.fromISO(timeData.to).toString(),
  };
}
