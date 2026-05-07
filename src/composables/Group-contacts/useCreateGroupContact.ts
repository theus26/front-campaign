import {
  IContactsAll,
  IContatosFiltrosSemPaginacaoDto,
} from "@/@core/services/interfaces/contacts/IContactsService";
import { ICriarGrupoContato } from "@/@core/services/interfaces/group-contacts/IGroupContactsService";
import { router } from "@/plugins/1.router";
import useContacts from "@/services/contacts/useContacts";
import useGroupContact from "@/services/group-contacts/useGroupContact";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components";

export function useCreateGroupContact() {
  const toast = useToast();

  const formRef = ref<VForm>();
  const nome = ref("");
  const numeros = ref<string[]>([]);
  const contatos = ref<IContactsAll[]>([]);
  const loading = ref(false);

  const buildPayload = (): ICriarGrupoContato => ({
    nome: nome.value.trim(),
    numeros: numeros.value,
  });

  const createGroupContact = async () => {
    loading.value = true;

    try {
      const payload = buildPayload();
      await useGroupContact.createGroupContact(payload);

      toast.success("Grupo contato criado com sucesso!");
      router.push("/grupo-contato/list");
    } catch (error: any) {
      const message =
        error?.response?.data?.erro ?? "Erro inesperado ao criar grupo contato";
      console.error(message);
      toast.error(message);
    } finally {
      loading.value = false;
    }
  };

  const customFilter = (_: any, query: string, item: any) => {
    const search = query.toLowerCase().trim();

    const nome = item.raw.nome?.toLowerCase() || "";
    const numero = item.raw.numero?.toString().toLowerCase() || "";

    return nome.includes(search) || numero.includes(search);
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

  const submit = () => {
    formRef.value?.validate().then(({ valid }) => {
      if (valid) createGroupContact();
    });
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
    formRef,
    nome,
    numeros,
    loading,
    contatos,
    submit,
    customFilter,
    getInitials,
  };
}
