import asyncHandler from "express-async-handler";
import {
  createRegisterWorkspace,
  registerAddWorkspace,
  registerWorkspaceByUserId,
} from "../models/registerWorkspaceModel.js";
import { createWorkspace, workspaceById } from "../models/workspaceModel.js";

export const createUserRegisterWorkspace = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await createRegisterWorkspace(userId);
  res.status(200).send();
});

export const getAllRegisterWorkspaces = asyncHandler(async (req, res) => {
  console.log("REINGEKOMMEN");
  const user = req.user;
  const registerWorkspace = await registerWorkspaceByUserId(user._id);
  console.log(registerWorkspace);
  res.status(200).json({
    workspaces: registerWorkspace.register,
  });
});

export const addWorkspace = asyncHandler(async (req, res) => {
  const user = req.user;
  const data = req.body;
  data.members = [];
  data.members.push({ ...user, role: "admin" });
  const workspace = await createWorkspace(data);
  await registerAddWorkspace(user._id, {
    workspaceId: workspace._id,
    name: workspace.name,
  });
  res.status(201).json({
    workspaceById: workspace._id,
  });
});

export const getWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workspace = await workspaceById(id);
  res.status(200).json(workspace);
});
