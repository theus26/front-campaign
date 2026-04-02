<script setup lang="ts">
import { IProvider } from "@/@core/services/interfaces/campaign/IProviderService";
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  provider?: IProvider | null;
  loading: boolean;

}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "delete"]);

const isOpen = ref(props.modelValue);
const loading = ref(props.loading);

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

watch(
  () => props.loading,
  (val) => (loading.value = val)
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
        Excluir conexão
      </VCardTitle>

      <VCardText class="text-center">

        <p class="mb-3">
          Você está prestes a excluir a conexão:
        </p>

        <div class="pa-3 rounded bg-grey-lighten-4 text-center mb-3 font-weight-medium">
          {{ provider?.name || "Sem nome" }}
        </div>

        <p class="text-medium-emphasis text-sm mx-auto" style="max-width: 320px">
          Esta ação não pode ser desfeita.
        </p>

      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">

        <VBtn variant="text" @click="closeDialog">
          Cancelar
        </VBtn>

        <VBtn color="error" variant="flat" :loading="loading" @click="emit('delete', props.provider?.providerId)">
          Excluir
        </VBtn>

      </VCardActions>

    </VCard>
  </VDialog>
</template>
