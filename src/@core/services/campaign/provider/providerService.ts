import AuthService from "@core/services/auth/authService";
import { AxiosInstance } from "axios";
import { IAuthService } from "../../interfaces/auth/IAuthService";

import {
  IConnectInstance,
  IProvider,
  IProviderConfig,
  IProviderGeneric,
  IProviderService,
} from "../../interfaces/campaign/IProviderService";
import defaultConfig from "./providerDefaultConfig";

export default class ProviderService
  extends AuthService
  implements IProviderService
{
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceProviderConfig: IProviderConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object
  ) {
    super(axiosIns, overrideConfig);
    this.serviceProviderConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }
  async removeProvider(providerId: string): Promise<void> {
    await this.axiosIns.delete(this.serviceProviderConfig.removeProvider, {
      params: { providerId },
    });
  }
  async getProvidersByAccountId(
    accountId: string
  ): Promise<IProviderGeneric[]> {
    const providers = await this.axiosIns.get<IProviderGeneric[]>(
      this.serviceProviderConfig.getProvidersByAccountId,
      { params: { accountId } }
    );

    return providers.data;
  }
  async createProvider(provider: IProvider): Promise<string> {
    const response = await this.axiosIns.post(
      this.serviceProviderConfig.createProvider,
      provider
    );
    return response.data;
  }
  async connectInstance(nameInstance: string): Promise<IConnectInstance> {
    var base64 = await this.axiosIns.get(
      this.serviceProviderConfig.connectInstance,
      { params: nameInstance }
    );

    return base64.data;
  }
}
