import {
  IContactsAll,
  IContatosFiltrosSemPaginacaoDto,
} from "@/@core/services/interfaces/contacts/IContactsService";
import {
  IContatosGrupoDto,
  IGruposContatosDto,
} from "@/@core/services/interfaces/group-contacts/IGroupContactsService";
import useContacts from "@/services/contacts/useContacts";
import useGroupContactComposable from "@/services/group-contacts/useGroupContact";
import { useListGroupContact } from "./useListGroupContacts";
export function useGroupContact() {
  const nome = ref("");
  const mensagemErro = ref("");
  const itemsPerPage = ref(10);
  const page = ref(1);
  const sortBy = ref();
  const orderBy = ref();

  const exibirSucesso = ref(false);
  const exibirCancelamento = ref(false);
  const exibirConfirmacaoDesativacao = ref(false);
  const exibirEdicao = ref(false);
  const exibirPreviewGrupo = ref(false);

  const grupoSelecionado = ref<IGruposContatosDto | null>(null);
  const expandedRows = ref<string[]>([]);
  const contatos = ref<IContactsAll[]>([]);
  const itemEditado = ref<IGruposContatosDto>({
    grupoId: "",
    nome: "",
    contatosGrupoDto: [],
    dataCriacao: "",
  });

  const headers = [
    { title: "Grupo", key: "grupo", sortable: false },
    {
      title: "Participantes",
      key: "totalParticipantes",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Prévia",
      key: "preview",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Criado em",
      key: "createdAt",
      align: "center" as const,
      sortable: false,
    },
    {
      title: "Ações",
      key: "actions",
      sortable: false,
      align: "center" as const,
    },
  ];

  const {
    data,
    totalRecords,
    loading,
    fetch: loadGroupContacts,
  } = useListGroupContact({
    nome,
    page,
    itemsPerPage,
  });

  const updateOptions = (options: any) => {
    sortBy.value = options.sortBy[0]?.key;
    orderBy.value = options.sortBy[0]?.order;
  };

  const abrirEdicao = (item: IGruposContatosDto) => {
    itemEditado.value = { ...item };
    exibirEdicao.value = true;
  };

  const abrirConfirmacaoExclusao = (item: IGruposContatosDto) => {
    itemEditado.value = { ...item };
    exibirConfirmacaoDesativacao.value = true;
  };

  const getInitials = (nome: string) => {
    if (!nome) return "G";

    return nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getGroupColor = (nomeGrupo: string) => {
    const colors = ["#7367F0", "#28C76F", "#FF9F43", "#00CFE8", "#EA5455"];
    const index = nomeGrupo.length % colors.length;

    return colors[index];
  };

  const formatarData = (data: string) => {
    if (!data) return "-";

    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const gerarPreviewParticipantes = (item: IContatosGrupoDto[]) => {
    if (!item?.length) return "Nenhum participante";

    const preview = item.slice(0, 3).map((contato) => contato.nome);

    return item.length > 3
      ? `${preview.join(", ")} +${item.length - 3}`
      : preview.join(", ");
  };

  const customFilter = (_: any, query: string, item: any) => {
    const search = query.toLowerCase().trim();

    const nome = item.raw.nome?.toLowerCase() || "";
    const numero = item.raw.numero?.toString().toLowerCase() || "";

    return nome.includes(search) || numero.includes(search);
  };

  const abrirPreviewGrupo = (grupo: IGruposContatosDto) => {
    grupoSelecionado.value = grupo;
    exibirPreviewGrupo.value = true;
  };

  const salvarEdicao = async () => {
    try {
      loading.value = true;

      const payload = {
        nome: itemEditado.value.nome,
        numeros: itemEditado.value.contatosGrupoDto.map(
          (contato) => contato.numero,
        ),
      };

      await useGroupContactComposable.updateGroupContact(
        itemEditado.value.grupoId,
        payload,
      );

      exibirEdicao.value = false;

      await loadGroupContacts();
    } finally {
      loading.value = false;
    }
  };

  const deletarGroupContact = async () => {
    loading.value = true;
    try {
      await useGroupContactComposable.deleteGroupContact(
        itemEditado.value.grupoId ?? "",
      );
      exibirSucesso.value = true;
      await loadGroupContacts();
    } catch (e: any) {
      mensagemErro.value = e?.response?.data?.error ?? "Erro ao remover Grupo";
      exibirCancelamento.value = true;
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const listAllContatcts = async () => {
    try {
      const filter: IContatosFiltrosSemPaginacaoDto = {};
      const data = await useContacts.getListaAllContacts(filter);

      contatos.value = data;
    } catch (error: any) {
      console.error("Erro ao buscar contatos:", error);
    }
  };

  onMounted(async () => {
    await listAllContatcts();
  });

  return {
    nome,
    itemsPerPage,
    page,
    headers,
    data,
    totalRecords,
    loading,
    exibirEdicao,
    exibirSucesso,
    exibirCancelamento,
    mensagemErro,
    exibirConfirmacaoDesativacao,
    expandedRows,
    itemEditado,
    contatos,
    grupoSelecionado,
    exibirPreviewGrupo,
    updateOptions,
    abrirConfirmacaoExclusao,
    gerarPreviewParticipantes,
    formatarData,
    getGroupColor,
    getInitials,
    deletarGroupContact,
    abrirEdicao,
    salvarEdicao,
    customFilter,
    abrirPreviewGrupo,
  };
}
