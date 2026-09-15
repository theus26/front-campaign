import { AxiosInstance } from "axios";

export interface IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance): void;
  login(args: IBodyLogin): Promise<IResponseAuth>;
  loginWithGoogle(args: IBodyLogin): Promise<IResponseAuth>;
  logout(payload?: { expired?: boolean }): void;
  refreshToken(refreshToken: string): Promise<IResponseAuth>;
}

export type IAuthConfig = {
  loginEndpoint: string;
  refreshToken: string;
  loginWithGoogle: string;
};

export type IBodyLogin = {
  email: string;
  password: string;
  name?: string;
};

export interface IUserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface IResponseAuth {
  accessToken: string;
  refreshToken: string;
  userData: IUserData;
  userAbilityRules: any;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}
