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

let isRefreshing = false;
let failedQueue: any[] = [];
const toast = useToast();
const userData = useCookie<any>("userData");

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
}

export default class AuthService implements IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  constructor(axiosIns: AxiosInstance, authOverrideConfig: Object) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...authDefaultConfig, ...authOverrideConfig };

    this.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance) {
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

    axiosIns.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;

          const refreshToken = useCookie("refreshToken").value;

          if (!refreshToken) {
            this.logout();
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosIns(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          isRefreshing = true;

          try {
            const response = await this.refreshToken(refreshToken);

            const newAccessToken = response.token;
            const newRefreshToken = response.refreshToken;

            // 💾 salva novos tokens
            useCookie("accessToken").value = newAccessToken;
            useCookie("refreshToken").value = newRefreshToken;

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosIns(originalRequest);
          } catch (err) {
            processQueue(err, null);
            this.logout();
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
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

    return response.data;
  }

  logout = async () => {
    useCookie("accessToken").value = null;
    userData.value = null;
    router.push("/login");
    toast.error("Sua sessão expirou. Faça login novamente para continuar.");
  };
}
