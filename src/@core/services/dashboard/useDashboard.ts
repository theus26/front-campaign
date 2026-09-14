import { AxiosInstance } from "axios";
import { IAuthService } from "../interfaces/auth/IAuthService";
import DashboardService from "./dashboardService";

export default function useDashboard(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  overrideConfig: Object = {},
) {
  const dashboard = new DashboardService(axiosIns, useAuth, overrideConfig);
  return { dashboard };
}
