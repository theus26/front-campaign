<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  creatingLoading: boolean;

}
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", 'loadProvieders', 'createNewProvider']);

const isOpen = ref(props.modelValue);
const providerName = ref("");

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

const closeDialog = () => {
  emit("update:modelValue", false);
}

</script>

<template>
  <VDialog v-model="isOpen" max-width="480">
    <DialogCloseBtn @click="closeDialog" />

    <VCard>

      <VCardTitle class="text-h6">
        Criar nova conexão
      </VCardTitle>

      <VCardText>

        <p class="text-medium-emphasis mb-4">
          Crie uma caixa de saída para conectar um número do WhatsApp ao sistema.
        </p>

        <AppTextField v-model="providerName" label="Nome da caixa" placeholder="Ex: Atendimento Suporte" clearable
          :rules="[requiredValidator]" />

      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">

        <VBtn variant="text" @click="closeDialog">
          Cancelar
        </VBtn>

        <VBtn color="primary" :loading="props.creatingLoading" :disabled="providerName.length < 2"
          @click="emit('createNewProvider', providerName)">
          Criar conexão
        </VBtn>

      </VCardActions>

    </VCard>
  </VDialog>

</template>
