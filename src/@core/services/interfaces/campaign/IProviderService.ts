import { IPaginacao } from "../types";

export interface IProviderService {
  serviceProviderConfig: IProviderConfig;
  createProvider(provider: ICreateProvider): Promise<string>;
  updateProvider(
    providerId: string,
    updateData: IUpdateProvider,
  ): Promise<void>;
  connectInstance(instanceName: string): Promise<IConnectInstance>;
  removeProvider(providerId: string): Promise<void>;
  logoutProvider(providerId: string): Promise<void>;
  getListProviders(
    filter: IProviderFilter,
  ): Promise<IPaginacao<IProviderGeneric>>;
  getConnectionState(instanceName: string): Promise<IConnectionState>;
}

export type IProviderConfig = {
  createProvider: string;
  connectInstance: string;
  removeProvider: string;
  logoutProvider: string;
  getListProviders: string;
  getConnectionState: string;
  updateProvider: string;
};

export interface IProvider {
  name: string;
  credential: string;
  accountId: string;
  providerId: string;
}

export interface ICreateProvider {
  name: string;
  credential: string;
  userId?: string;
}

export interface IConnectInstance {
  pairingCode?: string;
  code?: string;
  base64?: string;
}
export interface IProviderGeneric {
  id: number;
  providerId: string;
  credential: string;
  name: string;
  accountId: string;
  instanceName: string;
  instanceId: string;
  status: string;
  owner: string | null;
  profileName: string | null;
  profilePictureUrl: string | null;
}

export interface IConnectionState {
  instance?: Instance | null;
}

export interface Instance {
  instanceName?: string | null;
  state?: string | null;
  providerId?: string;
}

export interface IProviderFilter {
  userId?: string;
  search?: string | null;
  page?: number;
  pageSize?: number;
}

export interface IUpdateProvider {
  name?: string;
}
