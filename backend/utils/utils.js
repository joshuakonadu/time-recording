import { unregisterWorkspace } from "./registerWorkspace.helper.js";
import { workspaceRemoveMember } from "./workspace.helper.js";
import { deleteAllTimeRecordsByUser } from "./timerecord.helper.js";
import { removeWorkspaceInvitation } from "./invitation.helper.js";

export const deleteUserWorkspaceData = async ({ workspaceId, userId }) => {
  const actions = [
    unregisterWorkspace,
    workspaceRemoveMember,
    deleteAllTimeRecordsByUser,
    removeWorkspaceInvitation,
  ];
  const promises = actions.map((action) => action(userId, workspaceId));
  return Promise.all(promises);
};
