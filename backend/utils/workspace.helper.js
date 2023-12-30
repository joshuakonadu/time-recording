import Workspace from "../models/workspaceModel.js";

export const workspaceById = (id) => Workspace.findById(id);

export const createWorkspace = (data) => Workspace.create(data);

export const workspaceAddMember = async (id, member) => {
  const workspace = await Workspace.findById(id);
  workspace.members.push(member);
  return workspace.save();
};

export const workspaceRemoveMember = async (userId, workspaceId) => {
  const workspace = await Workspace.findById(workspaceId);

  workspace.members = workspace.members.filter(
    (user) => user.userId.toString() !== userId.toString()
  );

  if (workspace.members.length) {
    return workspace.save();
  }
  return Workspace.deleteOne({ _id: workspaceId });
};
