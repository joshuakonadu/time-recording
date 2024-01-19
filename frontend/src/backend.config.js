import axios from "axios";

const getBaseUrlForEnv = () => {
  if (process.env.NODE_ENV === "production")
    return "https://landingpage.de/api";
  else return "http://localhost:5000/api";
};

export const BackendConfig = {
  baseURL: getBaseUrlForEnv(),
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  whoami: "/auth/whoami",
  createRegisterWorkspace: "/workspace/newregister",
  addWorkspace: "/workspace/add",
  getWorkspace: "/workspace/data/",
  updateWorkspace: "/workspace/update-workspace/",
  updateRegisterWorkspace: "/workspace/update-register-workspace/",
  getAllWorkspaces: "/workspace/register-workspaces",
  deleteWorkspaceUser: "/workspace/remove/",
  addTimeRecord: "/timerecords/add",
  updateTimeRecord: "/timerecords/update",
  getTimesByWorkspace: "/timerecords/workspace/",
  getTimesByUser: "/timerecords/user",
  deleteTimeRecord: "/timerecords/delete/",
  getTimesByWorkspaceUser: "/timerecords/user-workspace",
  updateWorkspaceMembers: "/workspace/update-members/",
  deleteWorkspaceMember: "/workspace/remove-member/",
  getWorkspaceMembers: "/workspace/members/",
  adminAddTimeRecord: "/timerecords/admin-add",
  adminworkspace: "/timerecords/admin-workspace",
  inviteUserToWorkspace: "/invitation/add",
  getAllInvitations: "/invitation/all",
  acceptInvitation: "/invitation/accept",
  removeInvitation: "/invitation/remove",
  addNewRemoveInvitationMessage: "/invitation/remove-invitation-message",
};
export const ApiClient = axios.create({
  baseURL: BackendConfig.baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});
