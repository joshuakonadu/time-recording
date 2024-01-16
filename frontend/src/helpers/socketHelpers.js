import { recieverNotifyUpdateByUserId } from "../client.socket.js";
import {
  updateWorkspaceAction,
  removedWorkspaceAction,
  updateInvitations,
} from "./index.js";
import { addNewRemoveInvitationMessage } from "../service";

export const notifyUsersInWorkspaceToUpdateMembers = (members, workspaceId) => {
  members.forEach((member) => {
    recieverNotifyUpdateByUserId(
      member.userId,
      JSON.stringify({ action: "update_workspace", workspace: workspaceId })
    );
  });
};

export const sendRemoveInvitationMessage = async (data, workspaceId) => {
  await addNewRemoveInvitationMessage(data);
  recieverNotifyUpdateByUserId(
    data.sendUserId,
    JSON.stringify({ action: "removed_workspace", workspace: workspaceId })
  );
};

export const handleMsg = (serializedObj) => {
  const obj = JSON.parse(serializedObj);
  const processMessages = {
    update_workspace: () => updateWorkspaceAction(obj.workspace),
    removed_workspace: () => removedWorkspaceAction(obj.workspace),
    update_messages: () => updateInvitations(),
  };

  processMessages[obj.action] && processMessages[obj.action]();
};
