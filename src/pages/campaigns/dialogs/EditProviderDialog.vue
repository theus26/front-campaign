<script setup lang="ts">
import { IProvider } from "@/@core/services/interfaces/campaign/IProviderService";
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  provider?: IProvider | null;
  loading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "update"]);

const isOpen = ref(props.modelValue);
const providerName = ref(props.provider?.name || "");

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

watch(
  () => props.provider,
  (val) => (providerName.value = val?.name || "")
);

const closeDialog = () => {
  emit("update:modelValue", false);
}

</script>

<template>
  <VDialog v-model="isOpen" max-width="420">
    <DialogCloseBtn @click="closeDialog" />

    <VCard>

      <VCardTitle class="text-h6 font-weight-bold">
        Editar conexão
      </VCardTitle>

      <VCardText>

        <p class="text-medium-emphasis mb-4">
          Altere o nome da caixa de saída associada a esta conexão.
        </p>

        <AppTextField v-model="providerName" label="Nome da caixa" placeholder="Ex: Atendimento Suporte" clearable />

      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">

        <VBtn variant="text" @click="closeDialog">
          Cancelar
        </VBtn>

        <VBtn color="primary" :loading="props.loading" :disabled="!providerName" @click="emit('update', providerName)">
          Salvar alterações
        </VBtn>

      </VCardActions>

    </VCard>
  </VDialog>
</template>
