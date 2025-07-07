export interface IProviderService {
  serviceProviderConfig: IProviderConfig;
  createProvider(provider: IProvider): Promise<string>;
  connectInstance(instanceName: string): Promise<IConnectInstance>;
  removeProvider(providerId: string): Promise<void>;
  logoutProvider(providerId: string): Promise<void>;
  getProvidersByAccountId(accountId: string): Promise<IProviderGeneric[]>;
}

export type IProviderConfig = {
  createProvider: string;
  connectInstance: string;
  removeProvider: string;
  logoutProvider: string;
  getProvidersByAccountId: string;
};

export interface IProvider {
  name: string;
  credential: string;
  accountId: string;
}

export interface IConnectInstance {
  base64: string;
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
