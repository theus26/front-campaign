import { AxiosInstance } from "axios";
import { IAuthService } from "../interfaces/auth/IAuthService";
import CampaignService from "./campaignService";

export default function useCampaign(
  axiosIns: AxiosInstance,
  useAuth: IAuthService,
  overrideConfig: Object = {},
) {
  const campaign = new CampaignService(axiosIns, useAuth, overrideConfig);
  return { campaign: campaign };
}
