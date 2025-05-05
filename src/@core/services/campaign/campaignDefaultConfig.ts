import { IProviderConfig } from "../interfaces/campaign/ICampaignService";

const defaultConfig: IProviderConfig = {
  createProvider: "/campaign",
  getQrCode: "/campaign/qrcode",
};

export default defaultConfig;
