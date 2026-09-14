import { ICampaign } from "@/@core/services/interfaces/campaign/ICampaignService";
import {
  IDashboardFiltro,
  IDashboardHome,
} from "@/@core/services/interfaces/dashboard/IDashboardService";
import useCampaign from "@/services/campaign/useCampaign";
import useDashboard from "@/services/dashboard/useDashboard";
import { useNotificationStore } from "@/store/notifications";
import { endOfDay, startOfDay, subDays } from "date-fns";
import {
  emptyCampanhasStatus,
  emptyFila,
  emptyFunil,
  emptyRecorrencia,
  emptyTaxas,
  extractDashboardError,
} from "./dashboardHelpers";

export type DashboardPeriodo = "all" | "7d" | "30d";

const emptyHome = (): IDashboardHome => ({
  campanhas: emptyCampanhasStatus(),
  recorrencia: emptyRecorrencia(),
  fila: emptyFila(),
  funilMensagens: emptyFunil(),
  funilDestinatarios: emptyFunil(),
  taxas: emptyTaxas(),
});

const toUtcIso = (date: Date, end = false) =>
  (end ? endOfDay(date) : startOfDay(date)).toISOString();

export function useDashboardHome() {
  const notificationStore = useNotificationStore();

  const nomeUsuario = ref("");
  const loading = ref(false);
  const loadingCampaigns = ref(false);
  const hasLoaded = ref(false);
  const erro = ref<string | null>(null);
  const dashboard = ref<IDashboardHome>(emptyHome());
  const campanhasRecentes = ref<ICampaign[]>([]);
  const periodo = ref<DashboardPeriodo>("all");

  let requestId = 0;

  const isEmpty = computed(() => dashboard.value.campanhas.total === 0);

  const filtro = computed<IDashboardFiltro | undefined>(() => {
    if (periodo.value === "all") return undefined;

    const dias = periodo.value === "7d" ? 6 : 29;

    return {
      inicio: toUtcIso(subDays(new Date(), dias)),
      fim: toUtcIso(new Date(), true),
    };
  });

  const fetchDashboard = async (options?: { silent?: boolean }) => {
    const currentRequest = ++requestId;

    try {
      if (!options?.silent) loading.value = true;
      erro.value = null;

      const response = await useDashboard.getDashboardHome(filtro.value);

      if (currentRequest !== requestId) return;

      dashboard.value = response;
    } catch (error: any) {
      if (currentRequest !== requestId) return;

      erro.value = extractDashboardError(error);
      dashboard.value = emptyHome();
    } finally {
      if (currentRequest === requestId) {
        if (!options?.silent) loading.value = false;
        hasLoaded.value = true;
      }
    }
  };

  const fetchCampanhasRecentes = async () => {
    try {
      loadingCampaigns.value = true;
      const response = await useCampaign.listCampaigns({
        pagina: 1,
        tamanhoPagina: 6,
      });
      campanhasRecentes.value = response.data ?? [];
    } catch {
      campanhasRecentes.value = [];
    } finally {
      loadingCampaigns.value = false;
    }
  };

  const selecionarPeriodo = (value: DashboardPeriodo) => {
    if (periodo.value === value) return;
    periodo.value = value;
  };

  watch(periodo, () => fetchDashboard(), { immediate: true });

  onBeforeUnmount(() => {
    requestId += 1;
  });

  watch(
    () => notificationStore.lastCampaignEvent,
    async (event) => {
      if (!event) return;
      await fetchDashboard({ silent: true });
      await fetchCampanhasRecentes();
    },
  );

  onMounted(() => {
    const userData = useCookie<any>("userData");
    nomeUsuario.value = userData.value?.name ?? "";
    fetchCampanhasRecentes();
  });

  return {
    nomeUsuario,
    loading,
    loadingCampaigns,
    hasLoaded,
    erro,
    dashboard,
    campanhasRecentes,
    periodo,
    isEmpty,
    selecionarPeriodo,
    fetchDashboard,
    fetchCampanhasRecentes,
  };
}
