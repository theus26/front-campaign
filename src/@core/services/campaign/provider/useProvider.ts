import { AxiosInstance } from "axios";
import { IAuthService } from "../../interfaces/auth/IAuthService";
import ProviderService from "./providerService";

export default function useProvider(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  overrideConfig: Object = {}
) {
  const provider = new ProviderService(axiosIns, useAuth, overrideConfig);

  return {
    provider: provider,
  };
}
