import TimeRecord from "../models/timerecordModel.js";

export const findTimeRecordsByUserId = (userId) => TimeRecord.find({ userId });

export const findTimeRecordsById = (id) => TimeRecord.findById(id);

export const createTimeRecord = (data) => TimeRecord.create(data);

export const findTimeRecordsByWorkspaceId = (workspaceId) => {
  return TimeRecord.find({ workspaceId });
};

export const findTimeRecordsByUserAndWorkspaceId = (userId, workspaceId) => {
  return TimeRecord.find({ workspaceId, userId });
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

export const deleteTimeRecordById = (id) => {
  return TimeRecord.deleteOne({ _id: id });
};
