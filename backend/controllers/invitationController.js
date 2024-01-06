import asyncHandler from "express-async-handler";
import { userByEmail } from "../utils/user.helper.js";
import {
  createUserInvitations,
  inviteUserToWorkspace,
  removeWorkspaceInvitation,
  acceptWorkspaceInvitation,
} from "../utils/invitation.helper.js";

export const inviteWorkspace = asyncHandler(async (req, res) => {
  const {
    workspaceId,
    sendUserName,
    sendUserId,
    workspaceName,
    isAdmin,
    email,
  } = req.body;
  const user = await userByEmail(email);
  if (!user) throw new Error("No User with that Email");

  await inviteUserToWorkspace(user._id, {
    workspaceId,
    isAdmin,
    workspaceName,
    sendUserName,
    sendUserId,
    type: "invitation",
  });
  res.status(200).send();
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  const { workspaceId } = req.body;
  const user = req.user;
  await acceptWorkspaceInvitation(user, workspaceId);
  res.status(200).send();
});

export const createUserInvitations = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await createUserInvitations(userId);
  res.status(200).send();
});
