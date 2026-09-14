export interface IDashboardService {
  serviceDashboardConfig: IDashboardConfig;

  getDashboardHome(filtro?: IDashboardFiltro): Promise<IDashboardHome>;
  getDashboardCampanha(campaignId: string): Promise<IDashboardCampanha>;
}

export type IDashboardConfig = {
  getDashboardHome: string;
  getDashboardCampanha: string;
};

export interface IDashboardFiltro {
  inicio?: string;
  fim?: string;
}

export interface ICampanhasStatus {
  total: number;
  emAndamento: number;
  finalizada: number;
  agendada: number;
  rascunho: number;
  pausada: number;
}

export interface IRecorrenciaDashboard {
  unica: number;
  recorrente: number;
}

export interface IFilaEnvio {
  total: number;
  aguardando: number;
  enviadas: number;
  falhas: number;
}

export interface IFunilMensagem {
  total: number;
  enviadas: number;
  entregues: number;
  lidas: number;
}

export interface ITaxasDashboard {
  progressoFila: number;
  taxaFalha: number;
  taxaEntrega: number;
  taxaLeitura: number;
}

export interface IErroEnvio {
  mensagem: string;
  quantidade: number;
}

export interface IDashboardHome {
  campanhas: ICampanhasStatus;
  recorrencia: IRecorrenciaDashboard;
  fila: IFilaEnvio;
  funilMensagens: IFunilMensagem;
  funilDestinatarios: IFunilMensagem;
  taxas: ITaxasDashboard;
}

export interface IDashboardCampanha {
  campanhaId: string;
  nome: string;
  status: "InProgress" | "Closed" | "Scheduled" | "Draft" | "Paused";
  recorrencia: "Recurrent" | "Unique" | null;
  inicioCampanha: string | null;
  fimCampanha: string | null;
  destinatariosPrevistos: number;
  fila: IFilaEnvio;
  funilMensagens: IFunilMensagem;
  funilDestinatarios: IFunilMensagem;
  taxas: ITaxasDashboard;
  principaisErros: IErroEnvio[];
}
