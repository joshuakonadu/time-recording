import { recieverNotifyUpdateByUserId } from "../client.socket.js";
import {
  updateWorkspaceAction,
  removedWorkspaceAction,
  updateInvitations,
  updateAdminTime,
  updateUserTime,
  getTimeZoneTransform,
  updateAdminChangeTime,
  updateUserChangeTime,
  updateAdminDeletedTime,
  updateUserDeletedTime,
  updateChangedWorkspace,
} from "./index.js";
import { addNewRemoveInvitationMessage } from "../service";
import { useUserStore } from "src/stores";

export const notifyUsersInWorkspaceToUpdateMembers = (members, workspaceId) => {
  members.forEach((member) => {
    recieverNotifyUpdateByUserId(
      member.userId,
      JSON.stringify({
        action: "update_workspace_members",
        workspace: workspaceId,
      })
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

export const NotifyNewTimeToUser = async (timeData) => {
  recieverNotifyUpdateByUserId(
    timeData.userId,
    JSON.stringify({ action: "update_user_time", time: timeData })
  );
};

export const notifyUserAndAdminsUpdatedTimeRecord = async (timeData) => {
  const localTimeZone = getTimeZoneTransform(timeData);
  const userStore = useUserStore();
  const admins = userStore.activeWorkspace.members.filter(
    (user) => user.isAdmin
  );
  admins.forEach((admin) => {
    recieverNotifyUpdateByUserId(
      admin.userId,
      JSON.stringify({
        action: "update_admin_time_change",
        time: localTimeZone,
      })
    );
  });

  recieverNotifyUpdateByUserId(
    localTimeZone.userId,
    JSON.stringify({ action: "update_user_time_change", time: localTimeZone })
  );
};

export const notifyUserAndAdminsDeletedTimeRecord = async (timeData) => {
  const localTimeZone = getTimeZoneTransform(timeData);
  const userStore = useUserStore();
  const admins = userStore.activeWorkspace.members.filter(
    (user) => user.isAdmin
  );
  admins.forEach((admin) => {
    recieverNotifyUpdateByUserId(
      admin.userId,
      JSON.stringify({
        action: "update_admin_time_deleted",
        time: localTimeZone,
      })
    );
  });

  recieverNotifyUpdateByUserId(
    localTimeZone.userId,
    JSON.stringify({ action: "update_user_time_deleted", time: localTimeZone })
  );
};

export const notifyAllToUpdateWorkspace = (workspaceId, members) => {
  members.forEach((member) => {
    recieverNotifyUpdateByUserId(
      member.userId,
      JSON.stringify({
        action: "update_workspace",
        workspaceId,
      })
    );
  });
};

export const handleMsg = (serializedObj) => {
  const obj = JSON.parse(serializedObj);
  const processMessages = {
    update_workspace_members: () => updateWorkspaceAction(obj.workspace),
    removed_workspace: () => removedWorkspaceAction(obj.workspace),
    update_messages: () => updateInvitations(),
    update_admin_time: () => updateAdminTime(obj.time),
    update_user_time: () => updateUserTime(obj.time),
    update_admin_time_change: () => updateAdminChangeTime(obj.time),
    update_user_time_change: () => updateUserChangeTime(obj.time),
    update_admin_time_deleted: () => updateAdminDeletedTime(obj.time),
    update_user_time_deleted: () => updateUserDeletedTime(obj.time),
    update_workspace: () => updateChangedWorkspace(obj.workspaceId),
  };

  processMessages[obj.action] && processMessages[obj.action]();
};
