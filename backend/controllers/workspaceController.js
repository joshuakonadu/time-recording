import asyncHandler from "express-async-handler";
import {
  createRegisterWorkspace,
  registerAddWorkspace,
} from "../models/registerWorkspaceModel.js";
import { createWorkspace, workspaceById } from "../models/workspaceModel.js";

export const createUserRegisterWorkspace = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await createRegisterWorkspace(userId);
  res.status(200).send();
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
  res.status(201).send();
});

export const getWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workspace = await workspaceById(id);
  res.status(200).json(workspace);
});
