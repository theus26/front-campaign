import { AxiosInstance, AxiosResponse } from "axios";

export interface IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance): void;
  getToken(): string | null;
  getRefreshToken(): string | null;
  getExpiresAt(): string | null;
  getDomain(): string | null;
  setToken(value: string): void;
  setRefreshToken(value: string): void;
  setExpiresAt(value: string): void;
  setDomain(value: string): void;
  login(args: IBodyLogin): Promise<AxiosResponse<IResponseAuth>>;
  logout(payload?: object): void;
  refreshToken(): Promise<IResponseAuth>;
  requestCadastrarSenha(
    body: IBodyCadastrarSenha
  ): Promise<AxiosResponse<IResponseCadastrarSenha>>;
  requestResetarSenha(
    body: string,
    fandiOne: boolean
  ): Promise<AxiosResponse<IResponseResetarSenha>>;
}

export type IAuthConfig = {
  tokenType: string;
  storageTokenKeyName: string;
  storageRefreshTokenKeyName: string;
  storageExpiresAtKeyName: string;
  storageDomainKeyName: string;

  loginEndpoint: string;
  refreshEndpoint: string;
  logoutEndpoint: string;
  novaSenhaEndpoint: string;
  resetarSenhaEndpoint: string;
  obterChaveMFAEndpoint: string;
  salvarMFACodigoAutenticacaoEndpoint: string;
  desativarMFAEndpoint: string;
  logarDMSEndpoint: string;
};

export type IBodyLogin = {
  usuario: string;
  senha: string;
  url: string;
  usuarioContrasenha?: string;
  contrasenha?: string;
  codigoMFA?: string;
  TermoDeUso?: boolean;
};

export interface IResponseAuth {
  Data: {
    authentication: boolean;
    senhaExpirada: boolean;
    loginMultiplo: boolean;
  };
  Mensagens: IMensagensError[];
}

export interface IDTOResponseLogin {
  d: {
    Data: {
      authentication: boolean;
      senhaExpirada: boolean;
      loginMultiplo: boolean;
    };
    Mensagens: [];
  };
}

export interface IResponseCadastrarSenha {
  Erros: any;
}

export interface IBodyCadastrarSenha {
  usuario: string;
  codigo: string;
  novaSenha: string;
}
export interface IResponseResetarSenha {
  resultado: boolean;
  mensagem: string;
}

export interface IDTOResetarSenha {
  result: boolean;
  msg: string;
}

export interface IMensagensError {
  Key: string;
  Msg: string;
  EhErroNegocio: boolean;
  Sistema: null;
  TipoMensagem: number;
}

export interface IObterChaveMFA {
  CustomSecretKey: string;
  QrCodeImageData: string;
  TwoFactorSetupKey: string;
}
