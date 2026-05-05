import {
  IContatos,
  IContatosFiltros,
} from "@/@core/services/interfaces/contacts/IContactsService";

import useContact from "@/services/contacts/useContacts";

export function useListContactComposable(params: {
  nome: Ref<string>;
  numero: Ref<string>;
  page: Ref<number>;
  itemsPerPage: Ref<number>;
}) {
  const { nome, numero, page, itemsPerPage } = params;

  const loading = ref(false);
  const erro = ref<string | null>(null);
  const data = ref<IContatos[]>([]);
  const totalRecords = ref(0);

  const fetch = async () => {
    try {
      loading.value = true;
      erro.value = null;

      const filtro: IContatosFiltros = {
        nome: nome.value.trim(),
        numero: numero.value.trim(),
        pagina: page.value,
        tamanhoPagina: itemsPerPage.value,
      };

      const response = await useContact.listContacts(filtro);

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

  watch([nome, numero, page, itemsPerPage], fetch, {
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
