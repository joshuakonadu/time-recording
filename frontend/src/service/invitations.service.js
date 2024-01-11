import { BackendConfig, ApiClient } from "../backend.config";

export function createUserInvitations(data) {
  return ApiClient.post(BackendConfig.createUserInvitations, data);
}

export function inviteUserToWorkspace(data) {
  return ApiClient.post(BackendConfig.inviteUserToWorkspace, data);
}

export function getAllInvitations() {
  return ApiClient.get(BackendConfig.getAllInvitations);
}

export function acceptInvitation(data) {
  return ApiClient.post(BackendConfig.acceptInvitation, data);
}

export function removeInvite(data) {
  return ApiClient.post(BackendConfig.removeInvitation, data);
}

export function addNewRemoveInvitationMessage(data) {
  return ApiClient.post(BackendConfig.addNewRemoveInvitationMessage, data);
}
