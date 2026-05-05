import { ICriarContato } from "@/@core/services/interfaces/contacts/IContactsService";
import { router } from "@/plugins/1.router";
import useContact from "@/services/contacts/useContacts";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components";

export function useCreateContact() {
  const toast = useToast();

  const formRef = ref<VForm>();
  const nome = ref("");
  const numero = ref("");
  const loading = ref(false);

  const buildPayload = (): ICriarContato => ({
    nome: nome.value.trim(),
    numero: numero.value.replace(/\D/g, ""),
  });

  const createContact = async () => {
    loading.value = true;

    try {
      const payload = buildPayload();
      await useContact.createContact(payload);

      toast.success("Indicante criado com sucesso!");
      router.push("/contatos/list");
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Erro inesperado ao criar indicante";
      console.error(message);
      toast.error(message);
    } finally {
      loading.value = false;
    }
  };

  const submit = () => {
    formRef.value?.validate().then(({ valid }) => {
      if (valid) createContact();
    });
  };

  return {
    formRef,
    nome,
    numero,
    loading,
    submit,
  };
}
