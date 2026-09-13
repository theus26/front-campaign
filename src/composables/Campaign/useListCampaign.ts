import {
  ICampaign,
  ICampaignFilter,
} from "@/@core/services/interfaces/campaign/ICampaignService";
import useCampaign from "@/services/campaign/useCampaign";
import { useNotificationStore } from "@/store/notifications";

export function useListCampaign(params: {
  search: Ref<string>;
  status: Ref<string>;
  recurring: Ref<string>;
  page: Ref<number>;
  itemsPerPage: Ref<number>;
}) {
  const { search, status, recurring, page, itemsPerPage } = params;
  const notificationStore = useNotificationStore();

  const loading = ref(false);
  const erro = ref<string | null>(null);
  const data = ref<ICampaign[]>([]);
  const totalRecords = ref(0);

  const normalizeCampaign = (campaign: ICampaign) => {
    const raw = campaign as ICampaign & {
      TimeEnd?: string;
      EstimatedDuration?: ICampaign["estimatedDuration"];
    };

    return {
      ...campaign,
      timeEnd: raw.timeEnd ?? raw.TimeEnd,
      estimatedDuration: raw.estimatedDuration ?? raw.EstimatedDuration,
    };
  };

  const fetch = async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) loading.value = true;
      erro.value = null;

      const filtro: ICampaignFilter = {
        name: search.value.trim(),
        status: status.value,
        recurrence: recurring.value,
        pagina: page.value,
        tamanhoPagina: itemsPerPage.value,
      };

      const response = await useCampaign.listCampaigns(filtro);

      data.value = (response.data ?? []).map(normalizeCampaign);
      totalRecords.value = response.totalRegister;
    } catch (e: any) {
      erro.value = e.error || "Erro desconhecido";
      data.value = [];
      totalRecords.value = 0;
    } finally {
      if (!options?.silent) loading.value = false;
    }
  };

  watch([search, status, recurring, page, itemsPerPage], () => fetch(), {
    immediate: true,
  });

  watch(
    () => notificationStore.lastCampaignEvent,
    async (event) => {
      if (!event || event.type !== "CampaignUpdated") return;

      const campaign = data.value.find(
        (item) => item.campaignId === event.campaignId,
      );

      if (campaign && event.status) {
        campaign.status = event.status as ICampaign["status"];
      }

      await fetch({ silent: true });
    },
  );

  return {
    data,
    totalRecords,
    loading,
    erro,
    fetch,
  };
}
