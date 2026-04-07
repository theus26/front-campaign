import { ICampaignConfig } from "../interfaces/campaign/ICampaignService";

const defaultConfig: ICampaignConfig = {
  createCampaign: "/campaign/createCampaign",
  updateCampaign: "/campaign/updateCampaign",
  deleteCampaign: "/campaign/deleteCampaign",
  getCampaign: "/campaign/getCampaign",
  getListCampaigns: "/campaign/getListCampaigns",
};

export default defaultConfig;
