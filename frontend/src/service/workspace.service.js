import { BackendConfig, ApiClient } from "../backend.config";

export function createRegisterWorkspace(data) {
  return ApiClient.post(BackendConfig.createRegisterWorkspace, data);
}

export function createWorkspace(data) {
  return ApiClient.post(BackendConfig.addWorkspace, data);
}

export function getWorkspace(id) {
  return ApiClient.get(BackendConfig.getWorkspace + id);
}

export function getAllWorkspaces() {
  return ApiClient.get(BackendConfig.getAllWorkspaces);
}

export function deleteWorkspaceUser(workspaceId) {
  return ApiClient.delete(BackendConfig.deleteWorkspaceUser + workspaceId);
}

export function updateWorkspaceMembers(workspaceId, data) {
  return ApiClient.put(BackendConfig.updateWorkspaceMembers + workspaceId, {
    members: data,
  });
}

export function deleteWorkspaceMember(workspaceId, data) {
  return ApiClient.put(BackendConfig.deleteWorkspaceMember + workspaceId, data);
}

export function getWorkspaceMembers(workspaceId) {
  return ApiClient.get(BackendConfig.getWorkspaceMembers + workspaceId);
}
