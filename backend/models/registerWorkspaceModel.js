import mongoose from "mongoose";

const registerWorkspaceSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please add a user ID"],
    },
    register: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const RegisterWorkspace = mongoose.model(
  "RegisterWorkspace",
  registerWorkspaceSchema
);

export default RegisterWorkspace;
