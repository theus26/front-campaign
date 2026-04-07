import { AxiosInstance } from "axios";
import AuthService from "../auth/authService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import {
  ICampaignConfig,
  ICampaignService,
  ICreateCampaign,
} from "../interfaces/campaign/ICampaignService";
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
  async createCampaign(data: ICreateCampaign): Promise<void> {
    const response = await this.axiosIns.post(
      this.serviceCampaignConfig.createCampaign,
      data,
    );
    return response.data;
  }
}
