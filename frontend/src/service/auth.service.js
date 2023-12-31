import { BackendConfig, ApiClient } from "../backend.config";

export function register(data) {
  return ApiClient.post(BackendConfig.register, data);
}

export function login(data) {
  return ApiClient.post(BackendConfig.login, data);
}

export function logout() {
  return ApiClient.get(BackendConfig.logout);
}

export function whoami() {
  return ApiClient.get(BackendConfig.whoami);
}
