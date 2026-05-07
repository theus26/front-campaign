import useContactComposable from "@/services/contacts/useContacts";
import { formatInputNumber } from "./useFormatNumberComposable";
import { useListContactComposable } from "./useListContact";

export function useContact() {
  const nome = ref("");
  const numero = ref("");
  const mensagemErro = ref("");
  const itemsPerPage = ref(10);
  const page = ref(1);
  const sortBy = ref();
  const orderBy = ref();

  const exibirSucesso = ref(false);
  const exibirCancelamento = ref(false);
  const exibirConfirmacaoDesativacao = ref(false);
  const exibirEdicao = ref(false);
  const itemEditado = ref({
    id: "",
    nome: "",
    numero: "",
  });

  const headers = [
    { title: "Nome", key: "name", sortable: false },
    {
      title: "Número",
      key: "number",
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

  const numeroFormatado = computed({
    get: () => itemEditado.value.numero,
    set: (val: string) => {
      itemEditado.value.numero = formatInputNumber(val);
    },
  });

  const {
    data,
    totalRecords,
    loading,
    fetch: loadContacts,
  } = useListContactComposable({
    nome,
    numero,
    page,
    itemsPerPage,
  });

  const updateOptions = (options: any) => {
    sortBy.value = options.sortBy[0]?.key;
    orderBy.value = options.sortBy[0]?.order;
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

  const formatPhone = (phone: string) => {
    if (!phone) return "";

    const cleaned = phone.replace(/\D/g, "");

    // Remove DDI 55 se existir
    let number = cleaned.startsWith("55") ? cleaned.slice(2) : cleaned;

    // Se tiver mais de 11 dígitos, corta excesso (caso bugado tipo 734472962272)
    if (number.length > 11) {
      number = number.slice(-11);
    }

    // Se tiver menos de 10, não dá pra formatar direito
    if (number.length < 10) {
      return number;
    }

    const ddd = number.slice(0, 2);
    const part1 =
      number.length === 11
        ? number.slice(2, 7) // celular (5 dígitos)
        : number.slice(2, 6); // fixo (4 dígitos)

    const part2 = number.slice(-4);

    return `(${ddd}) ${part1}-${part2}`;
  };

  const abrirEdicao = (item: any) => {
    itemEditado.value = {
      id: item.id,
      nome: item.nome,
      numero: item.numero,
    };

    exibirEdicao.value = true;
  };

  const fecharEdicao = () => {
    exibirEdicao.value = false;
  };

  const abrirConfirmacaoExclusao = (item: any) => {
    itemEditado.value = { ...item };
    exibirConfirmacaoDesativacao.value = true;
  };

  const limparNumero = (numero: string): string => {
    return numero.replace(/\D/g, "");
  };

  const salvarEdicao = async () => {
    loading.value = true;
    if (!itemEditado.value?.id) return;

    const numeroLimpo = limparNumero(itemEditado.value.numero);

    const payload = {
      ...itemEditado.value,
      numero: numeroLimpo,
    };

    try {
      await useContactComposable.updateContact(itemEditado.value.id, payload);
      fecharEdicao();
      await loadContacts();
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
    } finally {
      loading.value = false;
    }
  };

  const deletarContact = async () => {
    loading.value = true;
    try {
      await useContactComposable.deleteContact(itemEditado.value.id ?? "");
      exibirSucesso.value = true;
      await loadContacts();
    } catch (e: any) {
      mensagemErro.value =
        e?.response?.data?.error ?? "Erro ao remover contato";
      exibirCancelamento.value = true;
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    nome,
    numero,
    itemsPerPage,
    page,
    headers,
    data,
    totalRecords,
    loading,
    exibirEdicao,
    itemEditado,
    exibirSucesso,
    exibirCancelamento,
    mensagemErro,
    exibirConfirmacaoDesativacao,
    numeroFormatado,
    salvarEdicao,
    fecharEdicao,
    updateOptions,
    abrirEdicao,
    deletarContact,
    abrirConfirmacaoExclusao,
    getInitials,
    stringToColor,
    formatPhone,
  };
}
