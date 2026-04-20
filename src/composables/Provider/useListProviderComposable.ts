import {
  IProviderFilter,
  IProviderGeneric,
} from "@/@core/services/interfaces/campaign/IProviderService";

import useProvider from "@/services/provider/useProvider";

export function useListProviderComposable(params: {
  search: Ref<string>;
  page: Ref<number>;
  itemsPerPage: Ref<number>;
}) {
  const { search, page, itemsPerPage } = params;

  const loading = ref(false);
  const erro = ref<string | null>(null);
  const data = ref<IProviderGeneric[]>([]);
  const totalRecords = ref(0);

  const fetch = async () => {
    try {
      loading.value = true;
      erro.value = null;

      const filtro: IProviderFilter = {
        //userId: "4cfdfc46-b38e-4e28-94e0-a141f7170bf5",
        search: search.value.trim(),
        page: page.value,
        pageSize: itemsPerPage.value,
      };

      const response = await useProvider.getListProviders(filtro);

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

  watch([search, page, itemsPerPage], fetch, {
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
