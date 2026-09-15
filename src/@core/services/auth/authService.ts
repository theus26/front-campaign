import { startConnection, stopConnection } from "@/composables/useCampaignHub";
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
const interceptedAxios = new WeakSet<AxiosInstance>();

export default class AuthService implements IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;

  constructor(axiosIns: AxiosInstance, authOverrideConfig: Object) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...authDefaultConfig, ...authOverrideConfig };

    this.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  configureInterceptorsAxiosInstance(axiosIns: AxiosInstance) {
    if (interceptedAxios.has(axiosIns)) return;
    interceptedAxios.add(axiosIns);

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

        if (error.response?.status !== 401) {
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        const requestUrl = String(originalRequest?.url ?? "").toLowerCase();
        if (requestUrl.includes("refresh")) {
          return Promise.reject(error);
        }

        const refreshToken = useCookie("refreshToken").value;

        if (!refreshToken) {
          this.logout();
          return Promise.reject(error);
        }

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
          const response = await this.refreshToken(refreshToken);

          const newAccessToken = response.accessToken;
          const newRefreshToken = response.refreshToken;

          useCookie("accessToken").value = newAccessToken;
          useCookie("refreshToken").value = newRefreshToken;

          axiosIns.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

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
      },
    );
  }

  async login(payload: IBodyLogin): Promise<IResponseAuth> {
    const response = await this.axiosIns.post(
      this.serviceConfig.loginEndpoint,
      payload,
    );
    return this.persistSession(this.normalizeAuthResponse(response.data));
  }

  async loginWithGoogle(credential: IBodyLogin): Promise<IResponseAuth> {
    const response = await this.axiosIns.post(
      this.serviceConfig.loginWithGoogle,
      credential,
    );
    return this.persistSession(this.normalizeAuthResponse(response.data));
  }

  async refreshToken(refreshToken: string): Promise<IResponseAuth> {
    const response = await this.axiosIns.post(this.serviceConfig.refreshToken, {
      refreshToken,
    });

    return this.normalizeAuthResponse(response.data);
  }

  logout = async (payload?: { expired?: boolean }) => {
    useCookie("accessToken").value = null;
    useCookie("refreshToken").value = null;
    useCookie("userAbilityRules").value = null;
    userData.value = null;
    await stopConnection();
    await router.push("/login");

    if (payload?.expired !== false) {
      toast.error("Sua sessão expirou. Faça login novamente para continuar.");
    }
  };

  private normalizeAuthResponse(data: any): IResponseAuth {
    return {
      accessToken:
        data?.accessToken ?? data?.token ?? data?.AccessToken ?? data?.Token,
      refreshToken: data?.refreshToken ?? data?.RefreshToken,
      userData: data?.userData ?? data?.UserData,
      userAbilityRules: data?.userAbilityRules ?? data?.UserAbilityRules,
    };
  }

  private persistSession(auth: IResponseAuth): IResponseAuth {
    if (auth.accessToken) useCookie("accessToken").value = auth.accessToken;
    if (auth.refreshToken) useCookie("refreshToken").value = auth.refreshToken;
    if (auth.userData) useCookie("userData").value = auth.userData;
    if (auth.userAbilityRules)
      useCookie("userAbilityRules").value = auth.userAbilityRules;

    void stopConnection().then(() => startConnection());

    return auth;
  }
}
