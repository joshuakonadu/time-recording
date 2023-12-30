import mongoose from "mongoose";

const workspaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    members: {
      type: Array,
      default: [],
    },
    projectOption: {
      type: Array,
      default: [],
    },
    roleOption: {
      type: Array,
      default: [],
    },
    mode: {
      type: String,
      default: "24h",
      enum: ["24h", "all", "timer"],
    },
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
