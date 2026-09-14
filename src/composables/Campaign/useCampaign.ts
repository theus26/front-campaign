import {
  ICampaign,
  IReportsCampaigns,
  IUpdateCampaign,
} from "@/@core/services/interfaces/campaign/ICampaignService";
import { router } from "@/plugins/1.router";
import useCampaign from "@/services/campaign/useCampaign";
import { useNotificationStore } from "@/store/notifications";
import { format, parse } from "date-fns";
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import { useListCampaign } from "./useListCampaign";
export function useCampaignList() {
  const toast = useToast();
  const notificationStore = useNotificationStore();
  const searchQuery = ref("");
  const itemsPerPage = ref(10);
  const page = ref(1);
  const sortBy = ref();
  const orderBy = ref();

  const selectedStatus = ref();
  const selectedRecurrence = ref();
  const reports = ref<IReportsCampaigns | null>(null);

  const statusCampaign = [
    { title: "Em Andamento", value: "InProgress" },
    { title: "Encerrada", value: "Closed" },
    { title: "Agendada", value: "Scheduled" },
    { title: "Rascunho", value: "Draft" },
    { title: "Pausada", value: "Paused" },
  ];

  const recurrences = [
    { title: "Recorrente", value: "Recurrent" },
    { title: "Única", value: "Unique" },
  ];

  const headers = [
    { title: "Nome", key: "name", sortable: false },
    {
      title: "Status",
      key: "status",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Caixa de Saida",
      key: "inbox",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Recorrencia",
      key: "recurrence",
      align: "center" as const,
      sortable: false,
    },
     {
      title: "Duração estimada",
      key: "estimatedDuration",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Data de inicio",
      key: "startDate",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Horário de término",
      key: "endDate",
      align: "center" as const,
      sortable: false,
    },
   
    {
      title: "Ações",
      key: "actions",
      align: "center" as const,
      sortable: false,
    },
  ];

  const statusMap = {
    InProgress: "Em andamento",
    Closed: "Encerrada",
    Scheduled: "Agendada",
    Draft: "Rascunho",
    Paused: "Pausada",
  };

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

  const createResolver = (map: Record<string, any>) => {
    return (key: string) => map[key] ?? { label: key, color: "default" };
  };

  const {
    data: campaigns,
    totalRecords,
    loading,
    fetch: loadCampaigns,
  } = useListCampaign({
    search: searchQuery,
    page,
    itemsPerPage,
    recurring: selectedRecurrence,
    status: selectedStatus,
  });

  const resolveStatus = createResolver(campaignStatusMap);
  const resolveRecurrence = createResolver(campaignTypeMap);

  const isValidDate = (value: Date) => !Number.isNaN(value.getTime());

  const formatDate = (date: string | null) => {
    if (!date) return "";

    try {
      if (date.includes("Z") || date.includes("T")) {
        const dataSemUtc = date.replace(/Z$/, "").split(".")[0];
        const dataObj = parse(dataSemUtc, "yyyy-MM-dd'T'HH:mm:ss", new Date());

        if (isValidDate(dataObj)) return format(dataObj, "dd/MM/yyyy");

        const fallback = new Date(date);
        return isValidDate(fallback) ? format(fallback, "dd/MM/yyyy") : "";
      }

      const dataObj = parse(date, "yyyy-MM-dd", new Date());
      if (isValidDate(dataObj)) return format(dataObj, "dd/MM/yyyy");

      const fallback = new Date(date);
      return isValidDate(fallback) ? format(fallback, "dd/MM/yyyy") : "";
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "";
    }
  };

  const formatTime = (time?: string | null) => {
    if (!time) return "";

    const timeSpanMatch =
      /^(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec(time.trim());

    if (timeSpanMatch) {
      const hours = timeSpanMatch[2].padStart(2, "0");
      const minutes = timeSpanMatch[3];
      return `${hours}:${minutes}`;
    }

    try {
      if (time.includes("T") || time.includes("Z")) {
        const dataSemUtc = time.replace(/Z$/, "").split(".")[0];
        const dataObj = parse(dataSemUtc, "yyyy-MM-dd'T'HH:mm:ss", new Date());
        if (isValidDate(dataObj)) return format(dataObj, "HH:mm");
      }
    } catch (error) {
      console.error("Erro ao formatar horário:", error);
    }

    return time;
  };

  const formatDurationParts = (days: number, hours: number, minutes: number) => {
    const parts: string[] = [];

    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || !parts.length) parts.push(`${minutes}min`);

    return parts.join(" ");
  };

  const formatEstimatedDuration = (value?: unknown) => {
    if (value == null || value === "") return "";

    if (typeof value === "number" && Number.isFinite(value)) {
      const totalMinutes = Math.round(value);
      const days = Math.floor(totalMinutes / 1440);
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;
      return formatDurationParts(days, hours, minutes);
    }

    if (typeof value === "object") {
      const duration = value as Record<string, unknown>;
      const totalMinutes = duration.totalMinutes ?? duration.TotalMinutes;

      if (typeof totalMinutes === "number") {
        return formatEstimatedDuration(totalMinutes);
      }

      const days = Number(duration.days ?? duration.Days ?? 0);
      const hours = Number(duration.hours ?? duration.Hours ?? 0);
      const minutes = Number(duration.minutes ?? duration.Minutes ?? 0);

      if ([days, hours, minutes].some((part) => part > 0)) {
        return formatDurationParts(days, hours, minutes);
      }
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      const timeSpanMatch =
        /^(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec(
          normalized,
        );

      if (timeSpanMatch) {
        const days = Number(timeSpanMatch[1] ?? 0);
        const hours = Number(timeSpanMatch[2]);
        const minutes = Number(timeSpanMatch[3]);
        return formatDurationParts(days, hours, minutes);
      }

      return normalized;
    }

    return "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 50%)`;
  };

  const getSubtitle = (campaign: any) => {
    const status = statusMap[campaign.status as keyof typeof statusMap];
    const date = campaign.startDate
      ? new Date(campaign.startDate).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        })
      : null;

    return [campaign.providerName, status, date].filter(Boolean).join(" • ");
  };

  const updateOptions = (options: any) => {
    sortBy.value = options.sortBy[0]?.key;
    orderBy.value = options.sortBy[0]?.order;
  };

  const campaignActionsMap = {
    InProgress: [
      { key: "pause", label: "Pausar", icon: "tabler-pause", color: "warning" },
      {
        key: "finish",
        label: "Finalizar",
        icon: "tabler-check",
        color: "success",
      },
    ],
    Scheduled: [
      { key: "finish", label: "Encerrar", icon: "tabler-x", color: "error" },
      {
        key: "edit",
        label: "Editar",
        icon: "tabler-edit",
        color: "primary",
      },
    ],
    Draft: [
      { key: "finish", label: "Encerrar", icon: "tabler-x", color: "error" },
      {
        key: "activate",
        label: "Ativar",
        icon: "tabler-play",
        color: "success",
      },
      {
        key: "edit",
        label: "Editar",
        icon: "tabler-edit",
        color: "primary",
      },
    ],
    Closed: [
      {
        key: "reactivate",
        label: "Reativar",
        icon: "tabler-refresh",
        color: "info",
      },
      {
        key: "edit",
        label: "Editar",
        icon: "tabler-edit",
        color: "primary",
      },
    ],
    Paused: [
      { key: "finish", label: "Encerrar", icon: "tabler-x", color: "error" },
      {
        key: "reactivate",
        label: "Reativar",
        icon: "tabler-play",
        color: "success",
      },
      {
        key: "edit",
        label: "Editar",
        icon: "tabler-edit",
        color: "primary",
      },
    ],
  };

  const getCampaignActions = (status: string) => {
    const dashboardAction = {
      key: "dashboard",
      label: "Dashboard",
      icon: "tabler-chart-histogram",
      color: "info",
    };

    return [
      dashboardAction,
      ...(campaignActionsMap[status as keyof typeof campaignActionsMap] ?? []),
    ];
  };

  const mapCampaignToUpdate = (
    campaign: ICampaign,
    status: IUpdateCampaign["status"],
  ): IUpdateCampaign => ({
    name: campaign.name ?? "",
    intervalRepeat: campaign.intervalRepeat ?? null,
    content: campaign.content ?? [],
    numbers: campaign.numbers ?? [],
    recurrence: campaign.recurrence ?? null,
    startTime: campaign.startTime ?? null,
    timeEnd: campaign.timeEnd ?? null,
    status,
    intervalMessage: campaign.intervalMessage ?? "",
    startCampaign: campaign.startCampaign ?? null,
    endCampaign: campaign.endCampaign ?? null,
    providerId: campaign.providerId,
  });

  const handleAction = async (actionKey: string, item: ICampaign) => {
    if (actionKey === "edit") {
      router.push(`/campaigns/edit/${item.campaignId}`);
      return;
    }

    if (actionKey === "dashboard") {
      router.push(`/campaigns/dashboard/${item.campaignId}`);
      return;
    }

    const statusMap: Record<string, IUpdateCampaign["status"]> = {
      pause: "Paused",
      finish: "Closed",
      activate: "InProgress",
      reactivate: "InProgress",
    };

    const newStatus = statusMap[actionKey];

    if (!newStatus) {
      console.log("Ação não mapeada:", actionKey);
      return;
    }

    try {
      const updatePayload = mapCampaignToUpdate(item, newStatus);

      await useCampaign.updateCampaign(item.campaignId, updatePayload);
      toast.success(
        `Campanha ${item.name} atualizada para ${resolveStatus(newStatus).label}`,
      );
      await loadCampaigns();
    } catch (error) {
      toast.error(`Erro ao executar ação ${actionKey}`);
      console.error(`Erro ao executar ação ${actionKey}:`, error);
    }
  };

  const widgetData = computed(() => {
    if (!reports.value) return [];

    return [
      {
        title: "Campanhas Pendentes",
        value: reports.value.agendada,
        icon: "tabler-calendar-stats",
      },
      {
        title: "Campanhas Concluídas",
        value: reports.value.finalizada,
        icon: "tabler-checks",
      },
      {
        title: "Campanhas Pausadas",
        value: reports.value.pausada,
        icon: "tabler-pause",
      },
      {
        title: "Campanhas em Andamento",
        value: reports.value.emAndamento,
        icon: "tabler-activity",
      },
    ];
  });

  const loadReports = async () => {
    reports.value = await useCampaign.reportsCampaign();
  };

  onMounted(async () => {
    await loadReports();
  });

  watch(
    () => notificationStore.lastCampaignEvent,
    async (event) => {
      if (event?.type === "CampaignUpdated") await loadReports();
    },
  );

  return {
    searchQuery,
    itemsPerPage,
    page,
    selectedStatus,
    selectedRecurrence,

    campaigns,
    headers,
    statusCampaign,
    recurrences,
    widgetData,
    totalRecords,
    loading,
    resolveStatus,
    resolveRecurrence,
    formatDate,
    formatTime,
    formatEstimatedDuration,
    getInitials,
    stringToColor,
    getSubtitle,
    handleAction,
    getCampaignActions,
    updateOptions,
  };
}
