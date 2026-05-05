import { AxiosInstance } from "axios";
import { IAuthService } from "../interfaces/auth/IAuthService";
import ContactService from "./contactService";

export default function useContacts(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  overrideConfig: Object = {},
) {
  const contacts = new ContactService(axiosIns, useAuth, overrideConfig);
  return { contacts: contacts };
}
