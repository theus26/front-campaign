import {
  ICreateProvider,
  IProvider,
  IUpdateProvider,
} from "@/@core/services/interfaces/campaign/IProviderService";
import useProvider from "@/services/provider/useProvider";
import axios from "axios";
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import { useListProviderComposable } from "./useListProviderComposable";
import { VForm } from "vuetify/components";

export function useProvidersManager() {
  const toast = useToast();
  const emit = defineEmits<{
  (e: "next"): void
  (e: "back"): void
}>();

  const selectedProvider = ref<IProvider | null>(null);
  const formRef = ref<VForm | null>(null);
  
  const itemsPerPage = ref(10);
  const page = ref(1);
  const searchQuery = ref("");
  const nameProvider = ref("");
  const base64 = ref("");
  const reconnectBase64 = ref("");
  const qrcodeModal = ref(false);
  const creatingLoading = ref(false);
  const openAddDialog = ref(false);
  const editDialog = ref(false);
  const disconnectingProviderDialog = ref(false);
  const deleteProviderDialog = ref(false);
  const reconetingProviderDialog = ref(false);

  const headers = [
    { title: "Caixa de saída", key: "product" },
    { title: "Status", key: "status" },
    { title: "Ações", key: "actions", sortable: false },
  ];

  const {
    data: providers,
    totalRecords,
    loading,
    fetch: loadProviders,
  } = useListProviderComposable({
    search: searchQuery,
    page,
    itemsPerPage,
  });

  const createProvider = async () => {
    creatingLoading.value = true;
    try {
      const provider: ICreateProvider = {
        accountId: "d58900cc-9f9b-47ab-9e0f-84c69697da78",
        name: nameProvider.value,
        credential: nameProvider.value,
      };

      const response = await useProvider.createProvider(provider);
      base64.value = response ?? "";
      qrcodeModal.value = true;
    } catch (err) {
      console.error("Erro ao criar provider:", err);
      toast.error("Erro ao criar caixa de saída");
    } finally {
      creatingLoading.value = false;
    }
  };

  const createNewProvider = async (providerName: string) => {
    nameProvider.value = providerName;
    await createProvider();
    openAddDialog.value = false;
    await loadProviders();
  };

  const openDialogEdit = (item: IProvider) => {
    editDialog.value = true;
    selectedProvider.value = item;
  };

  const updateProvider = async (name: string) => {
    loading.value = true;
    try {
      const data: IUpdateProvider = { name };
      await useProvider.updateProvider(
        selectedProvider.value?.providerId || "",
        data,
      );

      toast.success("Caixa de saída atualizada com sucesso");
      editDialog.value = false;
      await loadProviders();
    } catch (err) {
      console.error("Erro ao atualizar provider:", err);
      toast.error("Erro ao atualizar caixa de saída");
    } finally {
      loading.value = false;
    }
  };

  const openReconnectDialog = async (item: IProvider) => {
    try {
      loading.value = true;
      const data = await useProvider.connectInstance(item.name);

      reconnectBase64.value = data.base64 ?? "";
      selectedProvider.value = item;
      reconetingProviderDialog.value = true;
    } catch (err) {
      console.error("Erro ao gerar QR Code para reconectar:", err);
      toast.error("Erro ao gerar QR Code para reconectar");
    } finally {
      loading.value = false;
    }
  };

  const reconectarProvider = async (item: IProvider) => {
    try {
      loading.value = true;
      await axios.post(`/api/providers/${item.accountId}/reconnect`);
      await loadProviders();
    } catch (err) {
      console.error("Erro ao reconectar provider:", err);
      toast.error("Erro ao reconectar caixa de saída");
    } finally {
      loading.value = false;
    }
  };

  const openDisconnectDialog = (item: IProvider) => {
    selectedProvider.value = item;
    disconnectingProviderDialog.value = true;
  };

  const desconectarConexao = async (providerId: string) => {
    loading.value = true;
    try {
      await useProvider.logoutProvider(providerId);
      toast.info("Caixa de saída desconectada");
      disconnectingProviderDialog.value = false;
      await loadProviders();
    } catch (err) {
      toast.error("Falha ao desconectar caixa de saída");
    } finally {
      loading.value = false;
    }
  };

  const openDeleteDialog = (item: IProvider) => {
    selectedProvider.value = item;
    deleteProviderDialog.value = true;
  };

  const excluirProvider = async (providerId: string) => {
    loading.value = true;
    try {
      await useProvider.removeProvider(providerId);
      toast.info("Caixa de saída excluída com sucesso");
      deleteProviderDialog.value = false;
      await loadProviders();
    } catch (err) {
      console.error("Erro ao excluir provider:", err);
      toast.error("Falha ao excluir caixa de saída");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Atualiza opções da tabela (paginação e ordenação)
   */
  const updateOptions = (options: any) => {
    if (options.page) page.value = options.page;
    if (options.itemsPerPage) itemsPerPage.value = options.itemsPerPage;
    loadProviders();
  };

  

  /**
   * Define qual provider foi selecionado (Step 3)
   */
  const onSelectRow = (rows: IProvider[]) => {
    if (!rows || rows.length === 0) return;
    const last = rows[rows.length - 1];
    selectedProvider.value = last;
  };

  /**
   * Resolve o status visual (chip)
   */
  const resolveStatus = (status: string) => {
    switch (status) {
      case "open":
        return { color: "success", text: "Conectado" };
      case "connecting":
        return { color: "warning", text: "Conectando" };
      default:
        return { color: "error", text: "Desconectado" };
    }
  };

  return {
    // refs e states
    providers,
    totalRecords,
    itemsPerPage,
    page,
    searchQuery,
    loading,
    creatingLoading,
    nameProvider,
    selectedProvider,
    base64,
    reconnectBase64,
    qrcodeModal,
    editDialog,
    disconnectingProviderDialog,
    deleteProviderDialog,
    reconetingProviderDialog,

    // tabela
    headers,

    // métodos
    loadProviders,
    createProvider,
    openDialogEdit,
    updateProvider,
    reconectarProvider,
    desconectarConexao,
    openDisconnectDialog,
    openReconnectDialog,
    excluirProvider,
    openDeleteDialog,
    onSelectRow,
    updateOptions,
    resolveStatus,
    createNewProvider,
    emit,
    openAddDialog,
    formRef,
  };
}
