import TimeRecord from "../models/timerecordModel.js";
import { isWorkspaceAdminCheck, workspaceById } from "./workspace.helper.js";

export const findTimeRecordsByUserId = (userId) => TimeRecord.find({ userId });

export const findTimeRecordById = (id) => TimeRecord.findById(id);

export const createTimeRecord = (data) => TimeRecord.create(data);

export const findTimeRecordsByWorkspaceId = (workspaceId) => {
  return TimeRecord.find({ workspaceId });
};

export const findTimeRecordsByUserAndWorkspaceId = (
  userId,
  workspaceId,
  from,
  to,
  project,
  role
) => {
  const prepareFindObject = {
    workspaceId,
    userId,
    from: {
      $gte: from,
      $lte: to,
    },
    project,
    role,
  };
  for (let key in prepareFindObject) {
    if (
      prepareFindObject[key] === null ||
      prepareFindObject[key] === undefined
    ) {
      delete prepareFindObject[key];
    }
  }
  return TimeRecord.find(prepareFindObject);
};

export const updateTimeRecordById = async (id, data) => {
  const updateTimeRecordProperties = [
    "description",
    "project",
    "role",
    "to",
    "from",
  ];

  const timeRecord = await TimeRecord.findById(id);
  updateTimeRecordProperties.forEach((key) => {
    timeRecord[key] = data[key];
  });
  return timeRecord.save();
};

export const deleteAllTimeRecordsByUser = (userId, workspaceId) => {
  return TimeRecord.deleteMany({ userId, workspaceId });
};

export const checkTimeRecordPermission = async (
  userId,
  workspaceId,
  timeRecordUserId
) => {
  if (userId.toString() === timeRecordUserId.toString()) {
    return;
  }
  const workspace = await workspaceById(workspaceId);
  if (isWorkspaceAdminCheck(userId, workspace.members)) {
    return;
  } else {
    throw new Error("No Permission");
  }
};

export const deleteTimeRecordById = (id) => {
  return TimeRecord.deleteOne({ _id: id });
};
