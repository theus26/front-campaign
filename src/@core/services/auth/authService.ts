import {
  IAuthConfig,
  IAuthService,
  IBodyCadastrarSenha,
  IBodyLogin,
  IDTOResetarSenha,
  IDTOResponseLogin,
  IResponseAuth,
  IResponseCadastrarSenha,
  IResponseResetarSenha,
} from "@core/services/interfaces/auth/IAuthService";
import { AxiosInstance, AxiosResponse } from "axios";
import authDefaultConfig from "./authDefaultConfig";

export default class AuthService implements IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  constructor(axiosIns: AxiosInstance, authOverrideConfig: Object) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...authDefaultConfig, ...authOverrideConfig };

    this.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance) {
    // Request Interceptor
    axiosIns.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken();
        if (accessToken) {
          config.headers.Authorization = `${this.serviceConfig.tokenType} ${accessToken}`;
        }
        config.headers.Domain = this.getDomain();

        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosIns.interceptors.response.use(
      (response) => {
        const currentRoute = window.location.pathname;
        if (
          typeof response.data === "string" &&
          response.data.match(/^\s*<!DOCTYPE html/i)
        ) {
          this.logout({
            sessaoExpirada: true,
            statusCode: response.status,
          });
        }

        return response;
      },
      (error) => {
        const { response, code } = error;

        if (
          (response && (response.status === 401 || response.status === 403)) ||
          code === "ERR_NETWORK"
        ) {
          this.logout({
            sessaoExpirada: true,
            statusCode: response.status,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  logout(payload?: object): void {
    const logoutEvento = new CustomEvent("logout", {
      detail: payload,
    });

    document.dispatchEvent(logoutEvento);
  }

  getToken(): string | null {
    return localStorage.getItem(this.serviceConfig.storageTokenKeyName);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.serviceConfig.storageRefreshTokenKeyName);
  }

  getExpiresAt(): string | null {
    return localStorage.getItem(this.serviceConfig.storageExpiresAtKeyName);
  }

  getDomain(): string | null {
    return localStorage.getItem(this.serviceConfig.storageDomainKeyName);
  }

  setToken(value: string): void {
    localStorage.setItem(this.serviceConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value: string): void {
    localStorage.setItem(this.serviceConfig.storageRefreshTokenKeyName, value);
  }

  setExpiresAt(value: string): void {
    localStorage.setItem(this.serviceConfig.storageExpiresAtKeyName, value);
  }

  setDomain(value: string): void {
    localStorage.setItem(this.serviceConfig.storageDomainKeyName, value);
  }

  login(args: IBodyLogin): Promise<AxiosResponse<IResponseAuth>> {
    return this.axiosIns
      .post(this.serviceConfig.loginEndpoint, {
        login: args,
      })
      .then((response: AxiosResponse<IDTOResponseLogin>) => {
        return {
          ...response,
          data: response.data.d,
        };
      });
  }

  refreshToken(): Promise<IResponseAuth> {
    return this.axiosIns.post(this.serviceConfig.refreshEndpoint, {
      token: this.getToken(),
      expiresAt: this.getExpiresAt(),
      refreshToken: this.getRefreshToken(),
    });
  }

  requestCadastrarSenha(
    body: IBodyCadastrarSenha
  ): Promise<AxiosResponse<IResponseCadastrarSenha>> {
    const dados = {
      viewModel: {
        Guid: body.codigo,
        UsuarioId: body.usuario,
        SenhaNova: body.novaSenha,
      },
    };

    return this.axiosIns
      .post(this.serviceConfig.novaSenhaEndpoint, dados)
      .then((resposta) => {
        let mensagemError: any = "";
        if (resposta.data.d) {
          const dados = JSON.parse(resposta.data.d);
          if (dados.Mensagens) {
            mensagemError = dados.Mensagens;
          }
        }
        return {
          ...resposta,
          data: {
            Erros: mensagemError,
          },
        };
      });
  }

  requestResetarSenha(
    email: string,
    fandiOne: boolean = true
  ): Promise<AxiosResponse<IResponseResetarSenha>> {
    return this.axiosIns
      .post(this.serviceConfig.resetarSenhaEndpoint, { email, fandiOne })
      .then((response) => {
        let resultado = false;
        let mensagem = "";
        if (response.data.d) {
          const resposta: IDTOResetarSenha = JSON.parse(response.data.d);
          resultado = resposta.result;
          mensagem = resposta.msg;
        }
        return {
          ...response,
          data: {
            resultado: resultado,
            mensagem: mensagem,
          },
        };
      });
  }
}
