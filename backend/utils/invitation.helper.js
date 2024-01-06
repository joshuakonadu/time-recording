import UserInvitations from "../models/userInvitationsModel.js";
import { workspaceById } from "./workspace.helper.js";
import { registerWorkspaceByUserId } from "./registerWorkspace.helper.js";

export const userInvitationsByUserId = (userId) =>
  UserInvitations.findOne({ userId });

export const createUserInvitations = (userId) =>
  UserInvitations.create({ userId });

export const inviteUserToWorkspace = async (userId, data) => {
  const userInvitations = await UserInvitations.findOne({ userId });
  //TODO CHECK IF Workspace invitation already exist before push
  userInvitations.invitations.push(data);
  return userInvitations.save();
};

export const removeWorkspaceInvitation = async (userId, sendUserId) => {
  const userInvitations = await UserInvitations.findOne({ userId });
  if (!userInvitations) throw new Error("User Invitations not found");
  userInvitations.invitations = userInvitations.invitations.filter(
    (data) => data.sendUserId.toString() !== sendUserId.toString()
  );
  return userInvitations.save();
};

export const acceptWorkspaceInvitation = async (user, workspaceId) => {
  const userInvitations = await userInvitationsByUserId(user._id);
  const findInvitation = userInvitations.invitations.find(
    (data) => data.workspaceId.toString() === workspaceId.toString()
  );
  if (!findInvitation) throw new Error("Invitation not found");

  const workspace = workspaceById(workspaceId);
  const registerWorkspace = registerWorkspaceByUserId(user._id);

  await workspace;
  await registerWorkspace;

  if (!workspace) throw new Error("Workspace not found");
  if (!registerWorkspace) throw new Error("Register Workspace not found");

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

  const sendUserInvitations = await userInvitationsByUserId(
    findInvitation.sendUserId
  );
  sendUserInvitations.invitations.push({
    type: "accept_invitation",
    sendUserName: `${user.firstname} ${user.lastname}`,
    workspaceName: findInvitation.workspaceName,
    sendUserId: user._id,
  });
  sendUserInvitations.save();
  userInvitations.invitations = userInvitations.invitations.filter(
    (data) => data.workspaceId.toString() !== workspaceId.toString()
  );

  return userInvitations.save();
};
