import {
  ICreateProvider,
  IProvider,
  ISyncContacts,
  IUpdateProvider,
} from "@/@core/services/interfaces/campaign/IProviderService";
import useProvider from "@/services/provider/useProvider";
import { useCampaignStore } from "@/store/campaign";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components";
import { useListProviderComposable } from "./useListProviderComposable";

export function useProvidersManager() {
  const toast = useToast();
  const route = useRoute();
  const campaignStore = useCampaignStore();

  const selectedProvider = ref<IProvider>();
  const selectedProviderArr = ref<IProvider[]>([]);

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
    { title: "Caixa de saída", key: "product", sortable: false },
    {
      title: "Status",
      key: "status",
      sortable: false,
      align: "center" as const,
    },
    {
      title: "Ações",
      key: "actions",
      sortable: false,
      align: "center" as const,
    },
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

  const syncContactsInBackground = async (name: string) => {
    const payload: ISyncContacts = {
      nomeInstancia: name ?? "",
    };

    try {
      toast.info("Sincronização de contatos iniciada...");

      await useProvider.syncContacts(payload);
      toast.success("Contatos sincronizados com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar contatos:", error);
      toast.error("Erro ao sincronizar contatos");
    }
  };

  const updateOptions = (options: any) => {
    if (options.page) page.value = options.page;
    if (options.itemsPerPage) itemsPerPage.value = options.itemsPerPage;
  };

  const onSelectRow = (rows: IProvider[]) => {
    if (rows.length > 0) {
      campaignStore.setDraft({
        providerId: rows[0]?.providerId ?? null,
      });
    }
  };

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

  const isEdit = computed(() => !!route.params.id);

  watch(
    [() => campaignStore.campaignDraft.providerId, providers, isEdit],
    ([providerId, providerList, editing]) => {
      if (!editing) return;

      if (!providerId || !providerList?.length) {
        selectedProvider.value = undefined;
        selectedProviderArr.value = [];
        return;
      }

      const selecionado =
        providerList.find(
          (provider) =>
            String(provider.providerId).trim() === String(providerId).trim(),
        ) ?? undefined;

      selectedProvider.value = selecionado;

      selectedProviderArr.value = selecionado ? [selecionado] : [];
    },
    {
      immediate: true,
    },
  );

  watchEffect(() => {
    console.log(searchQuery.value);
  });

  onMounted(async () => {
    await loadProviders();
  });

  return {
    // refs e states
    providers,
    selectedProviderArr,
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
    openAddDialog,
    formRef,
    headers,
    // métodos
    loadProviders,
    createProvider,
    openDialogEdit,
    updateProvider,
    desconectarConexao,
    openDisconnectDialog,
    openReconnectDialog,
    excluirProvider,
    openDeleteDialog,
    onSelectRow,
    updateOptions,
    resolveStatus,
    createNewProvider,
    syncContactsInBackground,
  };
}
