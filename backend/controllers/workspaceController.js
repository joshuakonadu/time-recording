import asyncHandler from "express-async-handler";
import {
  createRegisterWorkspace,
  registerAddWorkspace,
  registerWorkspaceByUserId,
  createWorkspace,
  workspaceById,
  workspaceUpdateMember,
  checkWorkspaceAdminPermission,
  checkWorkspacePermission,
  deleteUserWorkspaceData,
} from "../utils/index.js";

export const getAllRegisterWorkspaces = asyncHandler(async (req, res) => {
  const user = req.user;
  let registerWorkspace = null;
  registerWorkspace = await registerWorkspaceByUserId(user._id);
  if (!registerWorkspace) {
    registerWorkspace = await createRegisterWorkspace(user._id);
  }
  res.status(200).json({
    workspaces: registerWorkspace.register,
  });
});

export const addWorkspace = asyncHandler(async (req, res) => {
  const user = req.user;
  const data = req.body;
  data.members = [];
  data.members.push({
    userId: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    joined: new Date(),
    isAdmin: true,
  });
  const workspace = await createWorkspace(data);
  await registerAddWorkspace(user._id, {
    workspaceId: workspace._id,
    name: workspace.name,
  });
  res.status(201).json({
    workspaceId: workspace._id,
  });
});

export const getWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workspace = await workspaceById(id);
  if (!workspace) throw new Error("No Workspace");

  checkWorkspacePermission(req.user._id, workspace.members);
  res.status(200).json(workspace);
});

export const deleteWorkspaceUser = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const userId = req.user._id;
  const [registerWorkspace, workspace, deletedTimes] =
    await deleteUserWorkspaceData({ workspaceId, userId });

  res.status(200).json({
    workspaceDeleted:
      workspace.deletedCount && workspace.deletedCount > 0 ? true : false,
  });
});

export const updateWorkspaceMember = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const { members } = req.body;

  const userId = req.user._id;
  const updatedWorkspace = await workspaceUpdateMember(
    userId,
    workspaceId,
    members
  );
  res.status(200).json(updatedWorkspace.members);
});

export const deleteWorkspaceMember = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const { deleteUserId } = req.body;

  const userId = req.user._id;
  await checkWorkspaceAdminPermission(userId, workspaceId);

  const promiseResolveList = await deleteUserWorkspaceData({
    workspaceId,
    userId: deleteUserId,
  });
  const [registerWorkspace, workspace, deletedTimes] = promiseResolveList;
  let workspaceDeleted = false;
  if (workspace.deletedCount && workspace.deletedCount > 0) {
    workspaceDeleted = true;
  }
  res.status(200).json({
    workspaceDeleted,
  });
});

export const getWorkspaceMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workspace = await workspaceById(id);
  if (!workspace) throw new Error("No Workspace");
  res.status(200).json(workspace.members);
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (!id || !data) {
    throw new Error("Required data not fulfilled");
  }
  const workspace = await workspaceById(id);
  if (!workspace) throw new Error("No Workspace");
  const updateProps = ["name", "projectOption", "roleOption", "mode"];

  updateProps.forEach((prop) => {
    workspace[prop] = data[prop];
  });

  const savedWorkspace = await workspace.save();
  res.status(200).json(savedWorkspace);
});

export const updateRegisterWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (!id || !data) {
    throw new Error("Required data not fulfilled");
  }
  const userId = req.user._id;
  await checkWorkspaceAdminPermission(userId, data.workspaceId);

  const registerWorkspace = await registerWorkspaceByUserId(id);

  if (!registerWorkspace) throw new Error("No Register Workspace");

  registerWorkspace.register = registerWorkspace.register.map((workspace) => {
    if (workspace.workspaceId === data.workspaceId) {
      return data;
    } else {
      return workspace;
    }
  });

  const savedRegisterWorkspace = await registerWorkspace.save();
  res.status(200).json(savedRegisterWorkspace);
});
