import { AxiosInstance } from "axios";

export interface IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance): void;
  login(args: IBodyLogin): Promise<IResponseAuth>;
  logout(payload?: object): void;
  refreshToken(refreshToken: string): Promise<IResponseAuth>;
}

export type IAuthConfig = {
  loginEndpoint: string;
  refreshToken: string;
};

export type IBodyLogin = {
  email: string;
  password: string;
};

export interface IResponseAuth {
  accessToken: string;
  refreshToken: string;
  userData: any;
  userAbilityRules: any;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}
