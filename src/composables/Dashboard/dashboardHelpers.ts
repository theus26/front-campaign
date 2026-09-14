import {
  ICampanhasStatus,
  IFilaEnvio,
  IFunilMensagem,
  IRecorrenciaDashboard,
  ITaxasDashboard,
} from "@/@core/services/interfaces/dashboard/IDashboardService";

export const emptyCampanhasStatus = (): ICampanhasStatus => ({
  total: 0,
  emAndamento: 0,
  finalizada: 0,
  agendada: 0,
  rascunho: 0,
  pausada: 0,
});

export const emptyRecorrencia = (): IRecorrenciaDashboard => ({
  unica: 0,
  recorrente: 0,
});

export const emptyFila = (): IFilaEnvio => ({
  total: 0,
  aguardando: 0,
  enviadas: 0,
  falhas: 0,
});

export const emptyFunil = (): IFunilMensagem => ({
  total: 0,
  enviadas: 0,
  entregues: 0,
  lidas: 0,
});

export const emptyTaxas = (): ITaxasDashboard => ({
  progressoFila: 0,
  taxaFalha: 0,
  taxaEntrega: 0,
  taxaLeitura: 0,
});

export const formatDashboardNumber = (value?: number | null) =>
  Number(value ?? 0).toLocaleString("pt-BR");

export const formatDashboardPercent = (value?: number | null) => {
  const amount = Number(value ?? 0);

  return `${amount.toLocaleString("pt-BR", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}%`;
};

export const extractDashboardError = (error: any) =>
  error?.response?.data?.erro ??
  error?.response?.data?.error ??
  error?.error ??
  "Erro ao carregar o dashboard";
