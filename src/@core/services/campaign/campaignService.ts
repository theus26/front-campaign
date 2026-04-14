import { AxiosInstance } from "axios";
import AuthService from "../auth/authService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import {
  ICampaign,
  ICampaignConfig,
  ICampaignFilter,
  ICampaignService,
  ICreateCampaign,
  IReportsCampaigns,
} from "../interfaces/campaign/ICampaignService";
import { IPaginacao } from "../interfaces/types";
import defaultConfig from "./campaignDefaultConfig";

export default class CampaignService
  extends AuthService
  implements ICampaignService
{
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceCampaignConfig: ICampaignConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object,
  ) {
    super(axiosIns, overrideConfig);
    this.serviceCampaignConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }
  async reportsCampaign(): Promise<IReportsCampaigns> {
    const response = await this.axiosIns.get(
      this.serviceCampaignConfig.reportsCampaigns,
    );
    return response.data;
  }
  async listCampaigns(filter: ICampaignFilter): Promise<IPaginacao<ICampaign>> {
    const response = await this.axiosIns.get(
      this.serviceCampaignConfig.getListCampaigns,
      {
        params: filter,
      },
    );
    return response.data;
  }

  async createCampaign(data: ICreateCampaign): Promise<void> {
    const response = await this.axiosIns.post(
      this.serviceCampaignConfig.createCampaign,
      data,
    );
    return response.data;
  }
}
