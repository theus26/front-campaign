export interface ICampaignService {
  serviceCampaignConfig: ICampaignConfig;

  createCampaign(data: ICreateCampaign): Promise<void>;
}

export type ICampaignConfig = {
  createCampaign: string;
  updateCampaign: string;
  deleteCampaign: string;
  getCampaign: string;
  getListCampaigns: string;
};

export interface ICreateCampaign {
  name: string;
  intervalRepeat?: number | null;
  content?: MessageData[];
  numbers: string[];
  recurrence?: string | null;
  startTime?: string | null;
  timeEnd?: string | null;
  status: string;
  intervalMessage?: string;
  startCampaign?: string | null;
  endCampaign?: string | null;
  accountId?: string;
  providerId?: string;
}

export interface MessageData {
  type: string;
  message?: string;
  mediatype?: string;
  mimetype?: string;
  caption?: string;
  filename?: string;
  media?: string;
  dataUrl?: string;
}
