import { BackendConfig, ApiClient } from "../backend.config";

export function addTimeRecord(data) {
  return ApiClient.post(BackendConfig.addTimeRecord, data);
}

export function getTimesByWorkspace(id) {
  return ApiClient.get(BackendConfig.getTimesByWorkspace + id);
}

export function getTimesByUser() {
  return ApiClient.get(BackendConfig.getTimesByUser);
}

export function getTimesByWorkspaceUser(data) {
  return ApiClient.post(BackendConfig.getTimesByWorkspaceUser, data);
}

export function updateTimeRecord(data) {
  return ApiClient.put(BackendConfig.updateTimeRecord, data);
}

export function deleteTimeRecordById(id) {
  return ApiClient.delete(BackendConfig.deleteTimeRecord + id);
}

export function adminAddTimeRecord(data) {
  return ApiClient.post(BackendConfig.adminAddTimeRecord, data);
}

export function getTimesByWorkspaceAdmin(data) {
  return ApiClient.post(BackendConfig.adminworkspace, data);
}
