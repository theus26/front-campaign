export interface ITelephonyService {
  serviceProviderConfig: IProviderConfig;
  createProvider(name: string, credential: string, accountId: string): Promise<void>;
  getQrCode(): Promise<string>;
}

export type IProviderConfig = {
  createProvider: string;
  getQrCode: string;
};
