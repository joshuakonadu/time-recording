import { BackendConfig, ApiClient } from "../backend.config";

export function login(data) {
  return ApiClient.post(BackendConfig.login, data);
}

export function logout() {
  return ApiClient.post(BackendConfig.logout);
}

export function whoami() {
  return ApiClient.get(BackendConfig.whoami);
}
