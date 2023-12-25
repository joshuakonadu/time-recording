import axios from "axios";

const getBaseUrlForEnv = () => {
  if (process.env.NODE_ENV === "production")
    return "https://landingpage.de/api";
  else if (process.env.NODE_ENV === "dev")
    return "https://dev.landingpage.de/api";
  else return "http://localhost:5000/api";
};

export const BackendConfig = {
  baseURL: getBaseUrlForEnv(),
  login: "/auth/login",
  register: "/auth/register",
};
export const ApiClient = axios.create({
  baseURL: BackendConfig.baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});
