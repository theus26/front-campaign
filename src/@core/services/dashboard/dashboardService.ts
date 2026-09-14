import { AxiosInstance } from "axios";
import AuthService from "../auth/authService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import {
  IDashboardCampanha,
  IDashboardConfig,
  IDashboardFiltro,
  IDashboardHome,
  IDashboardService,
} from "../interfaces/dashboard/IDashboardService";
import defaultConfig from "./dashboardDefaultConfig";

export default class DashboardService
  extends AuthService
  implements IDashboardService
{
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceDashboardConfig: IDashboardConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object,
  ) {
    super(axiosIns, overrideConfig);
    this.serviceDashboardConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  async getDashboardHome(filtro?: IDashboardFiltro): Promise<IDashboardHome> {
    const response = await this.axiosIns.get(
      this.serviceDashboardConfig.getDashboardHome,
      { params: filtro },
    );

    return response.data;
  }

  async getDashboardCampanha(campaignId: string): Promise<IDashboardCampanha> {
    const response = await this.axiosIns.get(
      this.serviceDashboardConfig.getDashboardCampanha,
      { params: { campaignId } },
    );

    return response.data;
  }
}
