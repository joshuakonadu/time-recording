import { recieverNotifyInvitationByUserId } from "../client.socket.js";
import {
  updateWorkspaceAction,
  removedWorkspaceAction,
} from "./workspaceHelpers.js";
import { addNewRemoveInvitationMessage } from "../service";

export const notifyUsersInWorkspaceToUpdateMembers = (members, workspaceId) => {
  members.forEach((member) => {
    recieverNotifyInvitationByUserId(
      member.userId,
      JSON.stringify({ action: "update_workspace", workspace: workspaceId })
    );
  });
};

export const sendRemoveInvitationMessage = async (data, workspaceId) => {
  await addNewRemoveInvitationMessage(data);
  recieverNotifyInvitationByUserId(
    data.sendUserId,
    JSON.stringify({ action: "removed_workspace", workspace: workspaceId })
  );
};

export const handleMsg = (serializedObj) => {
  const obj = JSON.parse(serializedObj);
  const processMessages = {
    update_workspace: () => updateWorkspaceAction(obj.workspace),
    removed_workspace: () => removedWorkspaceAction(obj.workspace),
  };

  processMessages[obj.action] && processMessages[obj.action]();
};
