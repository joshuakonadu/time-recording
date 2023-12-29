import mongoose from "mongoose";

const timerecordSchema = mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: [true, "Please add a workspace ID"],
    },
    userId: {
      type: String,
      required: [true, "Please add a user ID"],
    },
    description: {
      type: String,
      required: [true, "Please add an description"],
    },
    project: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: null,
    },
    to: {
      type: Date,
      required: [true, "Please add a to Date"],
    },
    from: {
      type: Date,
      required: [true, "Please add a from Date"],
    },
  },
  {
    timestamps: true,
  }
);

const TimeRecord = mongoose.model("TimeRecord", timerecordSchema);

const updateTimeRecordProperties = [
  "description",
  "project",
  "role",
  "to",
  "from",
];

export default TimeRecord;
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
  const timeRecord = await TimeRecord.findById(id);
  updateTimeRecordProperties.forEach((key) => {
    timeRecord[key] = data[key];
  });
  return timeRecord.save();
};

export const deleteAllTimeRecordsByUser = async (userId, workspaceId) => {
  return TimeRecord.deleteMany({ userId, workspaceId });
};
