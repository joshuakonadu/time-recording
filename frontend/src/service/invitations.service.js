import { BackendConfig, ApiClient } from "../backend.config";

export function createUserInvitations(data) {
  return ApiClient.post(BackendConfig.createUserInvitations, data);
}
