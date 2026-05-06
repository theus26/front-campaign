import { AxiosInstance } from "axios";
import { IAuthService } from "../interfaces/auth/IAuthService";
import GroupContactService from "./groupContactService";

export default function useGroupContact(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  overrideConfig: Object = {},
) {
  const groupContacts = new GroupContactService(
    axiosIns,
    useAuth,
    overrideConfig,
  );
  return { groupContacts: groupContacts };
}
