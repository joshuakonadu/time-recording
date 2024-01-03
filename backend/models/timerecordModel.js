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
      type: String,
      required: [true, "Please add a to Date"],
    },
    from: {
      type: String,
      required: [true, "Please add a from Date"],
    },
  },
  {
    timestamps: true,
  }
);

const TimeRecord = mongoose.model("TimeRecord", timerecordSchema);

export default TimeRecord;
