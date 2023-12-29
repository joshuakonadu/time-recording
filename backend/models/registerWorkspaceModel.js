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
export const registerWorkspaceByUserId = (userId) =>
  RegisterWorkspace.findOne({ userId });
export const createRegisterWorkspace = (userId) =>
  RegisterWorkspace.create({ userId });
export const registerAddWorkspace = async (userId, data) => {
  const registerWorkspace = await RegisterWorkspace.findOne({ userId });
  registerWorkspace.register.push(data);
  return registerWorkspace.save();
};
export const unregisterWorkspace = async (userId, workspaceId) => {
  const registerWorkspace = await RegisterWorkspace.findOne({ userId });
  registerWorkspace.register = registerWorkspace.register.filter(
    (data) => data.workspaceId !== workspaceId
  );
  return registerWorkspace.save();
};
