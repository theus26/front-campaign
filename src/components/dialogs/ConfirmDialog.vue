<script setup lang="ts">
interface Props {
  confirmationQuestion: string;
  isDialogVisible: boolean;
  confirmTitle: string;
  confirmMsg: string;
  cancelTitle: string;
  cancelMsg: string;
  showSuccess: boolean;
  showCancel: boolean;
}

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "update:showSuccess", value: boolean): void;
  (e: "update:showCancel", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const updateModelValue = (val: boolean) => {
  emit("update:isDialogVisible", val);
};

const onConfirmation = () => {
  emit("confirm");
  updateModelValue(false);
};

const onCancel = () => {
  emit("cancel");
  updateModelValue(false);
};
</script>

<template>
  <!-- Dialog de confirmação -->
  <VDialog max-width="500" :model-value="props.isDialogVisible" @update:model-value="updateModelValue">
    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn icon variant="outlined" color="warning" class="my-4"
          style="block-size: 88px; inline-size: 88px; pointer-events: none">
          <span class="text-5xl">!</span>
        </VBtn>

        <h6 class="text-lg font-weight-medium">
          {{ props.confirmationQuestion }}
        </h6>
      </VCardText>

      <VCardText class="d-flex align-center justify-center gap-2">
        <VBtn color="info" variant="tonal" @click="onCancel">Cancelar</VBtn>
        <VBtn variant="elevated" @click="onConfirmation">Confirmar</VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Sucesso -->
  <VDialog :model-value="props.showSuccess" @update:model-value="(val) => emit('update:showSuccess', val)"
    max-width="500">
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn icon variant="outlined" color="success" class="my-4"
          style="block-size: 88px; inline-size: 88px; pointer-events: none">
          <VIcon icon="tabler-check" size="38" />
        </VBtn>

        <h1 class="text-h4 mb-4">{{ props.confirmTitle }}</h1>
        <p>{{ props.confirmMsg }}</p>

        <VBtn color="success" @click="emit('update:showSuccess', false)">
          Ok
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Cancelado -->
  <VDialog :model-value="props.showCancel" @update:model-value="(val) => emit('update:showCancel', val)"
    max-width="500">
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn icon variant="outlined" color="error" class="my-4"
          style="block-size: 88px; inline-size: 88px; pointer-events: none">
          <span class="text-5xl font-weight-light">X</span>
        </VBtn>

        <h1 class="text-h4 mb-4">{{ props.cancelTitle }}</h1>
        <p>{{ props.cancelMsg }}</p>

        <VBtn color="success" @click="emit('update:showCancel', false)">
          Ok
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
