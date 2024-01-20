import UserInvitations from "../models/userInvitationsModel.js";
import { workspaceById } from "./workspace.helper.js";
import { registerWorkspaceByUserId } from "./registerWorkspace.helper.js";
import { nanoid } from "nanoid";

export const userInvitationsByUserId = (userId) =>
  UserInvitations.findOne({ userId });

export const createUserInvitations = (userId) =>
  UserInvitations.create({ userId });

export const getAllInvitations = async (userId) => {
  let userInvitations = null;
  try {
    userInvitations = await userInvitationsByUserId(userId);
    if (!userInvitations) throw new Error("Existiert nicht");
  } catch (err) {
    userInvitations = await createUserInvitations(userId);
  }
  return userInvitations.invitations;
};

export const inviteUserToWorkspace = async (userId, data) => {
  const workspace = await workspaceById(data.workspaceId);
  if (!workspace) throw new Error("Workspace existiert nicht");

  const isAlreadyInWorkspace = workspace.members.find((member) => {
    return member.userId.toString() === userId.toString();
  });

  if (isAlreadyInWorkspace) {
    throw new Error("User ist bereits Mitglied");
  }

  const userInvitations = await userInvitationsByUserId(userId);
  if (!userInvitations)
    throw new Error("Nutzer muss sich mindestens einmal eingeloggt haben");

  const isAlreadyInvited = userInvitations.invitations.find(
    (invitation) =>
      invitation.workspaceId?.toString() === data.workspaceId.toString()
  );

  if (isAlreadyInvited) {
    throw new Error("Es existiert bereits eine Einladung von diesem Workspace");
  }

  userInvitations.invitations.push(data);
  return userInvitations.save();
};

export const removeWorkspaceInvitation = async (userId, workspaceId) => {
  const userInvitations = await userInvitationsByUserId(userId);
  if (!userInvitations) throw new Error("User Invitations not found");
  userInvitations.invitations = userInvitations.invitations.filter(
    (data) => data.workspaceId.toString() !== workspaceId.toString()
  );
  return userInvitations.save();
};

export const removeWorkspaceInvitationByMessageId = async (
  userId,
  messageId
) => {
  const userInvitations = await userInvitationsByUserId(userId);
  if (!userInvitations) throw new Error("User Invitations not found");
  userInvitations.invitations = userInvitations.invitations.filter(
    (data) => data.messageId.toString() !== messageId.toString()
  );
  return userInvitations.save();
};

export const acceptWorkspaceInvitation = async (user, workspaceId) => {
  const userInvitations = await userInvitationsByUserId(user._id);
  const findInvitation = userInvitations.invitations.find(
    (data) => data.workspaceId.toString() === workspaceId.toString()
  );
  if (!findInvitation) throw new Error("Invitation not found");

  const [workspace, registerWorkspace] = await Promise.all([
    workspaceById(workspaceId),
    registerWorkspaceByUserId(user._id),
  ]);

  if (!workspace) throw new Error("Workspace not found");
  if (!registerWorkspace) throw new Error("Register Workspace not found");

  const workspaceAdmins = workspace.members.filter((member) => member.isAdmin);

  workspace.members.push({
    userId: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    joined: new Date(),
    isAdmin: findInvitation.isAdmin,
  });

  registerWorkspace.register.push({
    workspaceId,
    name: findInvitation.workspaceName,
  });

  await Promise.all([workspace.save(), registerWorkspace.save()]);

  for (const adminMember of workspaceAdmins) {
    const sendUserInvitations = await userInvitationsByUserId(
      adminMember.userId
    );
    sendUserInvitations.invitations.push({
      type: "accept_invitation",
      sendUserName: `${user.firstname} ${user.lastname}`,
      workspaceName: findInvitation.workspaceName,
      workspaceId,
      messageId: nanoid(),
    });
    sendUserInvitations.save();
  }
  userInvitations.invitations = userInvitations.invitations.filter(
    (data) => data.workspaceId.toString() !== workspaceId.toString()
  );

  return userInvitations.save();
};

export const addNewRemoveInvitationMessage = async (userId, workspaceName) => {
  const userInvitations = await userInvitationsByUserId(userId);
  userInvitations.invitations.push({
    type: "removed",
    workspaceName: workspaceName,
    messageId: nanoid(),
  });
  return userInvitations.save();
};
