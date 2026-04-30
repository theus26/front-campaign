import { IPaginacao } from "../types";

export interface ICampaignService {
  serviceCampaignConfig: ICampaignConfig;

  createCampaign(data: ICreateCampaign): Promise<void>;
  listCampaigns(filter: ICampaignFilter): Promise<IPaginacao<ICampaign>>;
  reportsCampaign(): Promise<IReportsCampaigns>;
  getCampaignById(campaignId: string): Promise<ICampaign>;
  updateCampaign(campaignId: string, data: IUpdateCampaign): Promise<void>;
}

export type ICampaignConfig = {
  createCampaign: string;
  updateCampaign: string;
  deleteCampaign: string;
  getCampaignById: string;
  getListCampaigns: string;
  reportsCampaigns: string;
};

export interface ICreateCampaign {
  name: string;
  intervalRepeat?: string | null;
  content?: MessageData[];
  numbers: string[];
  recurrence?: string | null;
  startTime?: string | null;
  timeEnd?: string | null;
  status: string;
  intervalMessage?: string;
  startCampaign?: string | null;
  endCampaign?: string | null;
  providerId?: string;
}

export interface IUpdateCampaign extends ICreateCampaign {}

export interface IReportsCampaigns {
  emAndamento: number;
  finalizada: number;
  agendada: number;
  rascunho: number;
  pausada: number;
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

type Status = "InProgress" | "Closed" | "Scheduled" | "Draft" | "Paused";
type Recurrence = "Recurrent" | "Unique";

export interface ICampaignFilter {
  campaignId?: string;
  name?: string;
  intervalRepeat?: string;
  content?: string;
  recurrence?: string;
  startTime?: string;
  timeEnd?: string;
  status?: string;
  intervalMessage?: string;
  startCampaign?: string;
  endCampaign?: string;
  accountId?: string;
  providerId?: string;
  pagina: number;
  tamanhoPagina: number;
}

export interface ICampaign {
  campaignId: string;
  name?: string;
  intervalRepeat?: string | null;
  recurrence?: Recurrence;
  startTime?: string;
  providerName?: string;
  timeEnd?: string;
  status?: Status;
  numbers?: string[];
  intervalMessage?: string;
  startCampaign?: string;
  endCampaign?: string;
  providerId?: string;
}
