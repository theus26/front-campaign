import { AxiosInstance } from "axios";
import { IAuthService } from "../interfaces/auth/IAuthService";
import UserService from "./userService";

export default function useUser(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  overrideConfig: Object = {},
) {
  const user = new UserService(axiosIns, useAuth, overrideConfig);
  return { user };
}
