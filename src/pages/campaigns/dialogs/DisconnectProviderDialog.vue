<template>
  <v-dialog v-model="isOpen" max-width="420">
    <v-card>
      <v-card-title class="text-h6 font-semibold">
        Desconectar Provider
      </v-card-title>
      <v-card-text>
        Deseja desconectar o provider
        <strong>{{ providerName }}</strong>?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="warning" @click="handleDisconnect" :loading="loading">
          Desconectar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
  providerName?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "disconnected"]);

const isOpen = ref(props.modelValue);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

function closeDialog() {
  emit("update:modelValue", false);
}

async function handleDisconnect() {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 1000));
    emit("disconnected", props.providerName);
    closeDialog();
  } finally {
    loading.value = false;
  }
}
</script>
