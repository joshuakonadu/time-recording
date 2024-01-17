import { recieverNotifyUpdateByUserId } from "../client.socket.js";
import {
  updateWorkspaceAction,
  removedWorkspaceAction,
  updateInvitations,
  updateAdminTime,
} from "./index.js";
import { addNewRemoveInvitationMessage } from "../service";
import { useUserStore } from "src/stores";

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

export const notifyNewTimeToAdmins = async (timeData) => {
  const userStore = useUserStore();
  const admins = userStore.activeWorkspace.members.filter(
    (user) => user.isAdmin
  );
  admins.forEach((admin) => {
    recieverNotifyUpdateByUserId(
      admin.userId,
      JSON.stringify({ action: "update_admin_time", time: timeData })
    );
  });
};

export const handleMsg = (serializedObj) => {
  const obj = JSON.parse(serializedObj);
  const processMessages = {
    update_workspace: () => updateWorkspaceAction(obj.workspace),
    removed_workspace: () => removedWorkspaceAction(obj.workspace),
    update_messages: () => updateInvitations(),
    update_admin_time: () => updateAdminTime(obj.time),
  };

  processMessages[obj.action] && processMessages[obj.action]();
};
