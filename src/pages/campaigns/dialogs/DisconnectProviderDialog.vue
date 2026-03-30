<script setup lang="ts">
import { IProvider } from "@/@core/services/interfaces/campaign/IProviderService";
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  provider?: IProvider | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "disconnected"]);

const isOpen = ref(props.modelValue);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

const closeDialog = () => {
  emit("update:modelValue", false);
};


</script>

<template>
  <VDialog v-model="isOpen" max-width="420">
    <DialogCloseBtn @click="closeDialog" />

    <VCard>

      <VCardTitle class="text-h6 font-weight-bold d-flex align-center gap-2">

        Desconectar conexão
      </VCardTitle>

      <VCardText class="text-center">

        <p class="mb-3">
          Você está prestes a desconectar a conexão:
        </p>

        <div class="pa-3 rounded bg-grey-lighten-4 text-center mb-3 font-weight-medium">
          {{ props.provider?.name || "Sem nome" }}
        </div>

        <p class="text-medium-emphasis text-sm mx-auto" style="max-width: 320px">
          Após desconectar, será necessário escanear o QR Code novamente
          para reconectar o WhatsApp.
        </p>

      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">

        <VBtn variant="text" @click="closeDialog">
          Cancelar
        </VBtn>

        <VBtn color="warning" variant="flat" :loading="loading"
          @click=" emit('disconnected', props.provider?.providerId)">
          Desconectar
        </VBtn>

      </VCardActions>

    </VCard>
  </VDialog>
</template>
