import asyncHandler from "express-async-handler";
import { userByEmail } from "../utils/user.helper.js";
import {
  createUserInvitations,
  inviteUserToWorkspace,
  removeWorkspaceInvitation,
  acceptWorkspaceInvitation,
  getAllInvitations,
  removeWorkspaceInvitationByMessageId,
} from "../utils/invitation.helper.js";
import { nanoid } from "nanoid";

export const inviteWorkspace = asyncHandler(async (req, res) => {
  const { workspaceId, workspaceName, isAdmin, email } = req.body;
  const sendUser = req.user;
  if (sendUser.email === email)
    throw new Error("Einladung an sich selber ist nicht erlaubt");
  const user = await userByEmail(email);
  if (!user) throw new Error("Kein Nutzer mit dieser Email");

  await inviteUserToWorkspace(user._id, {
    workspaceId,
    isAdmin,
    workspaceName,
    sendUserName: `${sendUser.firstname} ${sendUser.lastname}`,
    sendUserId: sendUser._id,
    type: "invitation",
    messageId: nanoid(),
  });
  res.status(200).send();
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  const { workspaceId } = req.body;
  const user = req.user;
  await acceptWorkspaceInvitation(user, workspaceId);
  res.status(200).send();
});

export const removeInvitation = asyncHandler(async (req, res) => {
  const { messageId } = req.body;
  const user = req.user;
  await removeWorkspaceInvitationByMessageId(user._id, messageId);
  res.status(200).send();
});

export const getInvitations = asyncHandler(async (req, res) => {
  const user = req.user;
  const invitations = await getAllInvitations(user._id);
  res.status(200).json(invitations);
});
