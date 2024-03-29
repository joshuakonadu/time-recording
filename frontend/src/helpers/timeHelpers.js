import { DateTime, Interval } from "luxon";
import { useUserStore } from "src/stores";
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

export const calculateTimeNumber = (data) => {
  const minutesDiff = Interval.fromDateTimes(
    DateTime.fromISO(data.from),
    DateTime.fromISO(data.to)
  ).length("minute");
  return minutesDiff;
};

export const minutesInHoursMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const restMinutes = (Math.floor(minutes) % 60).toString().padStart(2, "0");

  return `${hours}:${restMinutes}h`;
};

export const sortDate = (data1, data2) => {
  return data1.from > data2.from ? -1 : data1.from < data2.from ? 1 : 0;
};

export const loadTimeTables = async () => {
  const userStore = useUserStore();
  const workspaceId = userStore.activeWorkspace._id;
  const sendData = {
    workspaceId: workspaceId,
    from: userStore.selectedTimeRange?.from,
    to: userStore.selectedTimeRange?.to,
    project: userStore.selectedProjectFilter,
    role: userStore.selectedRoleFilter,
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
  return timeZoneTransform;
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
  return timeZoneTransform;
};

export const adminloadTimeTables = async (userId) => {
  const userStore = useUserStore();
  const workspaceId = userStore.activeWorkspace._id;
  const sendData = {
    workspaceId: workspaceId,
    from: userStore.selectedTimeRange?.from,
    to: userStore.selectedTimeRange?.to,
    project: userStore.selectedProjectFilter,
    role: userStore.selectedRoleFilter,
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

export function getTimeZoneTransform(timeData) {
  if (!timeData) return;
  return {
    ...timeData,
    from: DateTime.fromISO(timeData.from).toString(),
    to: DateTime.fromISO(timeData.to).toString(),
  };
}

export const updateAdminTime = (time) => {
  if (
    adminIsInUserView(time.workspaceId, time.userId) &&
    isInSelectedTimeRange(time.from) &&
    fulfillsCurrentFilter(time)
  ) {
    const userStore = useUserStore();
    userStore.addNewTimeData(time);
  }
};

export const updateUserTime = (time) => {
  if (
    userIsInWorkspace(time.workspaceId) &&
    isInSelectedTimeRange(time.from) &&
    fulfillsCurrentFilter(time)
  ) {
    const userStore = useUserStore();
    userStore.addNewTimeData(time);
  }
};

export const updateAdminChangeTime = (time) => {
  if (
    adminIsInUserView(time.workspaceId, time.userId) &&
    isInSelectedTimeRange(time.from) &&
    fulfillsCurrentFilter(time)
  ) {
    const userStore = useUserStore();
    userStore.editTimeData(time);
  }
};

export const updateUserChangeTime = (time) => {
  if (
    userIsInWorkspace(time.workspaceId) &&
    isInSelectedTimeRange(time.from) &&
    fulfillsCurrentFilter(time)
  ) {
    const userStore = useUserStore();
    userStore.editTimeData(time);
  }
};

export const updateAdminDeletedTime = (time) => {
  if (
    adminIsInUserView(time.workspaceId, time.userId) &&
    isInSelectedTimeRange(time.from) &&
    fulfillsCurrentFilter(time)
  ) {
    const userStore = useUserStore();
    userStore.deleteTimeData(time);
  }
};

export const updateUserDeletedTime = (time) => {
  if (
    userIsInWorkspace(time.workspaceId) &&
    isInSelectedTimeRange(time.from) &&
    fulfillsCurrentFilter(time)
  ) {
    const userStore = useUserStore();
    userStore.deleteTimeData(time);
  }
};

const adminIsInUserView = (workspaceId, userId) => {
  const userStore = useUserStore();

  return workspaceId === userStore.activeWorkspace._id &&
    userStore.selectedWorkspaceMember?.userId === userId
    ? true
    : false;
};

const userIsInWorkspace = (workspaceId) => {
  const userStore = useUserStore();
  const routeId = userStore.activeWorkspace._id;
  const path = router.currentRoute.value.path;
  const isInWorkspace = path.split("/")[1] === "workspace";

  return isInWorkspace &&
    workspaceId === routeId &&
    userStore.selectedWorkspaceMember === null
    ? true
    : false;
};

const isInSelectedTimeRange = (timeFrom) => {
  const userStore = useUserStore();
  return timeFrom <= userStore.selectedTimeRange.to ? true : false;
};

const fulfillsCurrentFilter = (time) => {
  const userStore = useUserStore();
  return (
    (userStore.selectedProjectFilter === null ||
      userStore.selectedProjectFilter === time.project) &&
    (userStore.selectedRoleFilter === null ||
      userStore.selectedRoleFilter === time.role)
  );
};
