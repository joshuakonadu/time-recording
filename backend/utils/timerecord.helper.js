import TimeRecord from "../models/timerecordModel.js";

export const findTimeRecordsByUserId = (userId) => TimeRecord.find({ userId });

export const findTimeRecordsById = (id) => TimeRecord.findById(id);

export const createTimeRecord = (data) => TimeRecord.create(data);

export const findTimeRecordsByWorkspaceId = (workspaceId) => {
  return TimeRecord.find({ workspaceId });
};

export const findTimeRecordsByUserAndWorkspaceId = (
  userId,
  workspaceId,
  from,
  to
) => {
  return TimeRecord.find({
    workspaceId,
    userId,
    from: {
      $gte: from,
      $lte: to,
    },
  });
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
