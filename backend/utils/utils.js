import { unregisterWorkspace } from "../models/registerWorkspaceModel";
import { workspaceRemoveMember } from "../models/workspaceModel";
import { deleteAllTimeRecordsByUser } from "../models/timerecordModel";

export const deleteUserWorkspaceData = async ({ workspaceId, userId }) => {
  const actions = [
    unregisterWorkspace,
    workspaceRemoveMember,
    deleteAllTimeRecordsByUser,
  ];
  const promises = actions.map((action) => action(userId, workspaceId));
  return Promise.all(promises);
};
