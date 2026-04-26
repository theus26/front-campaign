import { router } from "@/plugins/1.router";
import {
  IAuthConfig,
  IAuthService,
  IBodyLogin,
  IResponseAuth,
} from "@core/services/interfaces/auth/IAuthService";
import { AxiosInstance } from "axios";
import { useToast } from "vue-toast-notification";
import authDefaultConfig from "./authDefaultConfig";

const toast = useToast();
const userData = useCookie<any>("userData");

export default class AuthService implements IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  constructor(axiosIns: AxiosInstance, authOverrideConfig: Object) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...authDefaultConfig, ...authOverrideConfig };

    this.configureInterceptorsAxiosInstance(this.axiosIns);
  }
  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance) {
    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });

      failedQueue = [];
    };

    // ✅ REQUEST
    axiosIns.interceptors.request.use(
      (config) => {
        const accessToken = useCookie("accessToken").value;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // ✅ RESPONSE
    axiosIns.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // ❌ não é 401
        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        // ❌ evitar loop infinito
        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        // ❌ não interceptar refresh
        if (originalRequest.url.includes("/refresh")) {
          return Promise.reject(error);
        }

        const refreshToken = useCookie("refreshToken").value;

        if (!refreshToken) {
          this.logout();
          return Promise.reject(error);
        }

        // 🔒 se já está atualizando, entra na fila
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axiosIns(originalRequest));
              },
              reject: (err: any) => {
                reject(err);
              },
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // ⚠️ IMPORTANTE: ideal usar outro axios aqui
          const response = await this.refreshToken(refreshToken);

          const newAccessToken = response.accessToken;
          const newRefreshToken = response.refreshToken;

          // 💾 salva novos tokens
          useCookie("accessToken").value = newAccessToken;
          useCookie("refreshToken").value = newRefreshToken;

          // atualiza header global
          axiosIns.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          // atualiza request original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosIns(originalRequest);
        } catch (err) {
          processQueue(err, null);
          this.logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      },
    );
  }

  async login(payload: IBodyLogin): Promise<IResponseAuth> {
    const response = await this.axiosIns.post(
      this.serviceConfig.loginEndpoint,
      payload,
    );
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<IResponseAuth> {
    const response = await this.axiosIns.post(this.serviceConfig.refreshToken, {
      refreshToken,
    });
    console.log(response.data);

    return response.data;
  }

  logout = async () => {
    useCookie("accessToken").value = null;
    userData.value = null;
    router.push("/login");
    toast.error("Sua sessão expirou. Faça login novamente para continuar.");
  };
}
