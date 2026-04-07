import { MessageData } from "./ICampaign";

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

export type Status = "Active" | "Inactive" | "Draft"; // exemplo

export interface ICreateCampaign {
  name: string;
  intervalRepeat?: string; // TimeSpan -> string (ex: "00:05:00")
  content?: MessageData[];
  numbers: string[];
  recurrence?: string;
  startTime?: string;
  timeEnd?: string;
  status: Status;
  intervalMessage?: string; // TimeSpan -> string
  startCampaign?: string; // DateTimeOffset -> ISO string
  endCampaign?: string; // DateTimeOffset -> ISO string
  accountId?: string; // Guid -> string
  providerId?: string; // Guid -> string
}
