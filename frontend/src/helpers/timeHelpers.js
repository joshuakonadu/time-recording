import { DateTime, Interval } from "luxon";

export const testData = [
  {
    from: DateTime.local(2017, 5, 15, 8, 30).toString(),
    to: DateTime.local(2017, 5, 15, 12, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2018, 5, 15, 8, 30).toString(),
    to: DateTime.local(2018, 5, 15, 12, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2018, 5, 15, 13, 30).toString(),
    to: DateTime.local(2018, 5, 15, 15, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2018, 5, 15, 15, 30).toString(),
    to: DateTime.local(2018, 5, 15, 18, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2018, 6, 15, 8, 30).toString(),
    to: DateTime.local(2018, 6, 15, 12, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2018, 7, 15, 8, 30).toString(),
    to: DateTime.local(2018, 7, 15, 12, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2019, 5, 15, 8, 30).toString(),
    to: DateTime.local(2019, 5, 15, 12, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2019, 6, 15, 8, 30).toString(),
    to: DateTime.local(2019, 6, 15, 12, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
  {
    from: DateTime.local(2019, 6, 15, 13, 30).toString(),
    to: DateTime.local(2019, 6, 15, 16, 30).toString(),
    project: "Test Project",
    role: "DEV",
    description: "test Description",
  },
];

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
