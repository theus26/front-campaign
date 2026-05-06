import { ICriarGrupoContato } from "@/@core/services/interfaces/group-contacts/IGroupContactsService";
import { router } from "@/plugins/1.router";
import useGroupContact from "@/services/group-contacts/useGroupContact";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components";

export function useCreateGroupContact() {
  const toast = useToast();

  const formRef = ref<VForm>();
  const nome = ref("");
  const numeros = ref<string[]>([]);
  const loading = ref(false);

  const mock = [
    { id: "1", nome: "João Silva", numero: "79999991111" },
    { id: "2", nome: "Maria Souza", numero: "79988882222" },
    { id: "3", nome: "Carlos Lima", numero: "79977773333" },
    { id: "4", nome: "Ana Oliveira", numero: "79966664444" },
    { id: "5", nome: "Pedro Santos", numero: "79955555555" },
  ];

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
        error?.response?.data?.error ??
        "Erro inesperado ao criar grupo contato";
      console.error(message);
      toast.error(message);
    } finally {
      loading.value = false;
    }
  };

  const customFilter = (_: any, query: string, item: any) =>
    item.raw.nome.toLowerCase().includes(query.toLowerCase());

  const submit = () => {
    formRef.value?.validate().then(({ valid }) => {
      if (valid) createGroupContact();
    });
  };

  return {
    formRef,
    nome,
    numeros,
    loading,
    mock,
    submit,
    customFilter,
  };
}
