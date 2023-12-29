import { unregisterWorkspace } from "../models/registerWorkspaceModel.js";
import { workspaceRemoveMember } from "../models/workspaceModel.js";
import { deleteAllTimeRecordsByUser } from "../models/timerecordModel.js";

export const deleteUserWorkspaceData = async ({ workspaceId, userId }) => {
  const actions = [
    unregisterWorkspace,
    workspaceRemoveMember,
    deleteAllTimeRecordsByUser,
  ];
  const promises = actions.map((action) => action(userId, workspaceId));
  return Promise.all(promises);
};
