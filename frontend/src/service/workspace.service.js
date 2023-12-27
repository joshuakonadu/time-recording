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
