import { IDashboardCampanha } from "@/@core/services/interfaces/dashboard/IDashboardService";
import useDashboard from "@/services/dashboard/useDashboard";
import { useNotificationStore } from "@/store/notifications";
import { format, parse } from "date-fns";
import {
  emptyFila,
  emptyFunil,
  emptyTaxas,
  extractDashboardError,
} from "./dashboardHelpers";

const emptyCampaign = (): IDashboardCampanha => ({
  campanhaId: "",
  nome: "",
  status: "Draft",
  recorrencia: null,
  inicioCampanha: null,
  fimCampanha: null,
  destinatariosPrevistos: 0,
  fila: emptyFila(),
  funilMensagens: emptyFunil(),
  funilDestinatarios: emptyFunil(),
  taxas: emptyTaxas(),
  principaisErros: [],
});

const campaignStatusMap = {
  InProgress: { label: "Em andamento", color: "info" },
  Closed: { label: "Encerrada", color: "success" },
  Scheduled: { label: "Agendada", color: "warning" },
  Draft: { label: "Rascunho", color: "secondary" },
  Paused: { label: "Pausada", color: "error" },
};

const campaignTypeMap = {
  Recurrent: { label: "Recorrente", color: "primary" },
  Unique: { label: "Única", color: "info" },
};

export function useDashboardCampaign(campaignId: Ref<string>) {
  const notificationStore = useNotificationStore();
  const loading = ref(false);
  const erro = ref<string | null>(null);
  const dashboard = ref<IDashboardCampanha>(emptyCampaign());

  const resolveStatus = (status?: string | null) =>
    campaignStatusMap[status as keyof typeof campaignStatusMap] ?? {
      label: status || "—",
      color: "secondary",
    };

  const resolveRecurrence = (recurrence?: string | null) =>
    campaignTypeMap[recurrence as keyof typeof campaignTypeMap] ?? {
      label: "—",
      color: "secondary",
    };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    try {
      const dataSemUtc = date.replace(/Z$/, "").split(".")[0];
      const dataObj = parse(dataSemUtc, "yyyy-MM-dd'T'HH:mm:ss", new Date());

      if (!Number.isNaN(dataObj.getTime()))
        return format(dataObj, "dd/MM/yyyy");

      const fallback = new Date(date);
      return Number.isNaN(fallback.getTime())
        ? "—"
        : format(fallback, "dd/MM/yyyy");
    } catch {
      return "—";
    }
  };

  const fetchDashboard = async (options?: { silent?: boolean }) => {
    if (!campaignId.value) return;

    try {
      if (!options?.silent) loading.value = true;
      erro.value = null;
      dashboard.value = await useDashboard.getDashboardCampanha(
        campaignId.value,
      );
    } catch (error: any) {
      erro.value = extractDashboardError(error);
      dashboard.value = emptyCampaign();
    } finally {
      if (!options?.silent) loading.value = false;
    }
  };

  watch(campaignId, () => fetchDashboard(), { immediate: true });

  watch(
    () => notificationStore.lastCampaignEvent,
    async (event) => {
      if (!event || event.campaignId !== campaignId.value) return;
      await fetchDashboard({ silent: true });
    },
  );

  return {
    loading,
    erro,
    dashboard,
    resolveStatus,
    resolveRecurrence,
    formatDate,
    fetchDashboard,
  };
}
