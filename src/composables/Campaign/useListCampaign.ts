import {
  ICampaign,
  ICampaignFilter,
} from "@/@core/services/interfaces/campaign/ICampaignService";
import useCampaign from "@/services/campaign/useCampaign";

export function useListCampaign(params: {
  search: Ref<string>;
  status: Ref<string>;
  recurring: Ref<string>;
  page: Ref<number>;
  itemsPerPage: Ref<number>;
}) {
  const { search, status, recurring, page, itemsPerPage } = params;

  const loading = ref(false);
  const erro = ref<string | null>(null);
  const data = ref<ICampaign[]>([]);
  const totalRecords = ref(0);

  const fetch = async () => {
    try {
      loading.value = true;
      erro.value = null;

      const filtro: ICampaignFilter = {
        name: search.value.trim(),
        status: status.value,
        recurrence: recurring.value,
        pagina: page.value,
        tamanhoPagina: itemsPerPage.value,
      };

      const response = await useCampaign.listCampaigns(filtro);

      data.value = response.data;
      totalRecords.value = response.totalRegister;
    } catch (e: any) {
      erro.value = e.error || "Erro desconhecido";
      data.value = [];
      totalRecords.value = 0;
    } finally {
      loading.value = false;
    }
  };

  watch([search, status, recurring, page, itemsPerPage], fetch, {
    immediate: true,
  });

  return {
    data,
    totalRecords,
    loading,
    erro,
    fetch,
  };
}
