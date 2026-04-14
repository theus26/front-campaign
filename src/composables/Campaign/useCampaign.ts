import { IReportsCampaigns } from "@/@core/services/interfaces/campaign/ICampaignService";
import useCampaign from "@/services/campaign/useCampaign";
import { ref } from "vue";
import { useListCampaign } from "./useListCampaign";

export function useCampaignList() {
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
      title: "Data de inicio",
      key: "startDate",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Data de término",
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

  const formatDate = (date: string | null) => {
    return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
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
    ],
    Draft: [
      { key: "finish", label: "Encerrar", icon: "tabler-x", color: "error" },
      {
        key: "activate",
        label: "Ativar",
        icon: "tabler-play",
        color: "success",
      },
    ],
    Closed: [
      {
        key: "reactivate",
        label: "Reativar",
        icon: "tabler-refresh",
        color: "info",
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
    ],
  };

  const getCampaignActions = (status: string) => {
    return campaignActionsMap[status as keyof typeof campaignActionsMap] ?? [];
  };

  const handleAction = (actionKey: string, item: any) => {
    switch (actionKey) {
      case "pause":
        break;

      case "finish":
        console.log("Encerrar", item);
        break;

      case "activate":
        console.log("Ativar", item);
        break;

      case "reactivate":
        console.log("Reativar", item);
        break;
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
      {
        title: "Rascunhos",
        value: reports.value.rascunho,
        icon: "tabler-edit",
      },
    ];
  });

  onMounted(async () => {
    reports.value = await useCampaign.reportsCampaign();
  });

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
    getInitials,
    stringToColor,
    getSubtitle,
    handleAction,
    getCampaignActions,
    updateOptions,
  };
}
