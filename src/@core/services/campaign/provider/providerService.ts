import AuthService from "@core/services/auth/authService";
import { AxiosInstance } from "axios";
import { IAuthService } from "../../interfaces/auth/IAuthService";

import {
  IConnectInstance,
  IConnectionState,
  ICreateProvider,
  IProviderConfig,
  IProviderFilter,
  IProviderGeneric,
  IProviderService,
  IUpdateProvider,
} from "../../interfaces/campaign/IProviderService";
import { IPaginacao } from "../../interfaces/types";
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
    overrideConfig: Object,
  ) {
    super(axiosIns, overrideConfig);
    this.serviceProviderConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }
  async updateProvider(
    providerId: string,
    updateData: IUpdateProvider,
  ): Promise<void> {
    await this.axiosIns.put(
      this.serviceProviderConfig.updateProvider,
      updateData,
      {
        params: { providerId },
      },
    );
  }
  async getConnectionState(instanceName: string): Promise<IConnectionState> {
    const response = await this.axiosIns.get<IConnectionState>(
      this.serviceProviderConfig.getConnectionState,
      { params: { instanceName } },
    );

    return response.data;
  }
  async logoutProvider(providerId: string): Promise<void> {
    await this.axiosIns.delete(this.serviceProviderConfig.logoutProvider, {
      params: { providerId },
    });
  }
  async removeProvider(providerId: string): Promise<void> {
    await this.axiosIns.delete(this.serviceProviderConfig.removeProvider, {
      params: { providerId },
    });
  }
  async getListProviders(
    filter: IProviderFilter,
  ): Promise<IPaginacao<IProviderGeneric>> {
    const providers = await this.axiosIns.get(
      this.serviceProviderConfig.getListProviders,
      { params: filter },
    );

    return providers.data;
  }

  async createProvider(provider: ICreateProvider): Promise<string> {
    const response = await this.axiosIns.post(
      this.serviceProviderConfig.createProvider,
      provider,
    );
    return response.data;
  }
  async connectInstance(instanceName: string): Promise<IConnectInstance> {
    var response = await this.axiosIns.get(
      this.serviceProviderConfig.connectInstance,
      { params: { instanceName } },
    );

    return response.data;
  }
}
