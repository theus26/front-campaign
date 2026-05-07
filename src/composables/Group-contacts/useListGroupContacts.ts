import {
  IGruposContatosDto,
  IGruposFiltros,
} from "@/@core/services/interfaces/group-contacts/IGroupContactsService";
import useGroupContact from "@/services/group-contacts/useGroupContact";
export function useListGroupContact(params: {
  nome: Ref<string>;
  page: Ref<number>;
  itemsPerPage: Ref<number>;
}) {
  const { nome, page, itemsPerPage } = params;
  const loading = ref(false);
  const erro = ref<string | null>(null);
  const data = ref<IGruposContatosDto[]>([]);
  const totalRecords = ref(0);

  const fetch = async () => {
    try {
      loading.value = true;
      erro.value = null;

      const filtro: IGruposFiltros = {
        nome: nome.value.trim(),
        pagina: page.value,
        tamanhoPagina: itemsPerPage.value,
      };

      const response = await useGroupContact.getListGroupContacts(filtro);

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

  watch([nome, page, itemsPerPage], fetch, {
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
