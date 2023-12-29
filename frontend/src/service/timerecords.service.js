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

export function getTimesByWorkspaceUser(id) {
  return ApiClient.get(BackendConfig.getTimesByWorkspaceUser + id);
}

export function updateTimeRecord(data) {
  return ApiClient.put(BackendConfig.updateTimeRecord, data);
}
