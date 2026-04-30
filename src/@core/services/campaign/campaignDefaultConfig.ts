import { ICampaignConfig } from "../interfaces/campaign/ICampaignService";

const defaultConfig: ICampaignConfig = {
  createCampaign: "campaign/createCampaingn",
  updateCampaign: "/campaign/updateCampaign",
  deleteCampaign: "/campaign/deleteCampaign",
  getCampaignById: "/campaign/GetCampaignById",
  getListCampaigns: "/campaign/ListCampaigns",
  reportsCampaigns: "Relatorios/RelatorioCampanhas",
};

export default defaultConfig;
