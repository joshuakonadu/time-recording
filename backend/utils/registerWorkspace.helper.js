import RegisterWorkspace from "../models/registerWorkspaceModel.js";

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
  if (!registerWorkspace) throw new Error("Register workspace not found");
  registerWorkspace.register = registerWorkspace.register.filter(
    (data) => data.workspaceId.toString() !== workspaceId.toString()
  );
  return registerWorkspace.save();
};
