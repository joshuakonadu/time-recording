import { BackendConfig, ApiClient } from "../backend.config";

export function register(data) {
  return ApiClient.post(BackendConfig.register, data);
}
