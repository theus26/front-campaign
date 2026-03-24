//import { useSnackbar } from "@/composables/useSnackbar"; // se você tiver um composable global de snackbar
import {
  IProvider,
  IProviderGeneric,
} from "@/@core/services/interfaces/campaign/IProviderService";
import useProvider from "@/services/provider/useProvider";
import axios from "axios";
import { ref } from "vue";

/**
 * Composable responsável por gerenciar providers (caixas de saída).
 */
export function useProvidersManager() {
  // --- Estado reativo ---
  const provider = ref<IProviderGeneric[]>([]);
  const totalProviders = ref(0);
  const itemsPerPage = ref(10);
  const page = ref(1);
  const searchQuery = ref("");
  const loading = ref(false);
  const nameProvider = ref("");
  const selectedProvider = ref<IProvider | null>(null);

  // --- Snackbar (feedback ao usuário) ---
  // const { showSnackbar } = useSnackbar?.() ?? { showSnackbar: console.log };

  // --- Cabeçalho da tabela ---
  const headers = [
    { title: "Caixa de saída", key: "product" },
    { title: "Status", key: "status" },
    { title: "Ações", key: "actions", sortable: false },
  ];

  // --- Funções principais ---

  /**
   * Carrega a lista de providers da API
   */
  const loadProviders = async () => {
    try {
      loading.value = true;

      // // Exemplo de chamada: ajuste conforme sua API
      // const { data } = await axios.get("/api/providers", {
      //   params: {
      //     page: page.value,
      //     pageSize: itemsPerPage.value,
      //     query: searchQuery.value,
      //   },
      // });
      const data = await useProvider.getProvidersByAccountId(
        "cd777da1-e9ae-4c3c-9fea-1e0c6ca14378"
      );
      console.log(data);
      provider.value = data ?? [];
      console.log("provider", provider);

      //provider = data.items ?? data ?? [];
      totalProviders.value = provider.value.length;
    } catch (err) {
      console.error("Erro ao carregar providers:", err);
      //showSnackbar?.("Erro ao carregar conexões", "error");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cria uma nova caixa de saída
   */
  const createProvider = async (name: string) => {
    try {
      loading.value = true;
      const { data } = await axios.post("/api/providers", { name });
      //showSnackbar?.("Caixa criada com sucesso", "success");
      //provider.push(data);
    } catch (err) {
      console.error("Erro ao criar provider:", err);
      // showSnackbar?.("Falha ao criar caixa de saída", "error");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Atualiza o provider selecionado
   */
  const editarItem = (item: IProvider) => {
    selectedProvider.value = item;
    console.log("Editar provider:", item);
    // Aqui você pode abrir um diálogo de edição, por exemplo
  };

  /**
   * Reestabelece a conexão de um provider
   */
  const reconectarProvider = async (item: IProvider) => {
    try {
      loading.value = true;
      await axios.post(`/api/providers/${item.accountId}/reconnect`);
      //showSnackbar?.("Conexão reestabelecida com sucesso", "success");
      await loadProviders();
    } catch (err) {
      console.error("Erro ao reconectar provider:", err);
      //showSnackbar?.("Erro ao reconectar caixa de saída", "error");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Desconecta uma conexão ativa
   */
  const desconectarConexao = async (item: IProvider) => {
    try {
      loading.value = true;
      await axios.post(`/api/providers/${item.accountId}/disconnect`);
      //showSnackbar?.("Caixa desconectada com sucesso", "info");
      await loadProviders();
    } catch (err) {
      console.error("Erro ao desconectar:", err);
      //showSnackbar?.("Falha ao desconectar caixa", "error");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Exclui um provider
   */
  const excluirProvider = async (item: IProvider) => {
    try {
      loading.value = true;
      await axios.delete(`/api/providers/${item.accountId}`);
      // var a = provider.filter((p) => p.accountId !== item.accountId);
      //showSnackbar?.("Caixa excluída com sucesso", "info");
    } catch (err) {
      console.error("Erro ao excluir provider:", err);
      //showSnackbar?.("Falha ao excluir caixa", "error");
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
        return { color: "warning", text: "Conectando..." };
      default:
        return { color: "error", text: "Desconectado" };
    }
  };

  /**
   * Abre o diálogo de nova conexão
   */
  const openAddDialog = () => {
    console.log("Abrir modal de nova conexão");
    // Aqui você pode emitir um evento, ou usar store/global dialog
  };

  return {
    // refs e states
    provider,
    totalProviders,
    itemsPerPage,
    page,
    searchQuery,
    loading,
    nameProvider,
    selectedProvider,

    // tabela
    headers,

    // métodos
    loadProviders,
    createProvider,
    editarItem,
    reconectarProvider,
    desconectarConexao,
    excluirProvider,
    onSelectRow,
    updateOptions,
    resolveStatus,
    openAddDialog,
  };
}
