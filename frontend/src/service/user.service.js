import { BackendConfig, ApiClient } from "../backend.config";

export function login(data) {
  return ApiClient.post(BackendConfig.login, data);
}

export function logout() {
  // remove user from local storage to log user out
}
