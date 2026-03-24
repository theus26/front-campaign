<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title class="text-h6 font-semibold">
        Conectar Provider
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="providerName" label="Nome do Provider" variant="outlined" dense />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="handleConnect" :loading="loading">
          Conectar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "connected"]);

const isOpen = ref(props.modelValue);
const providerName = ref("");
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

function closeDialog() {
  emit("update:modelValue", false);
}

async function handleConnect() {
  loading.value = true;
  try {
    // Chamada da API ou store
    await new Promise((r) => setTimeout(r, 1000));
    emit("connected", providerName.value);
    closeDialog();
  } finally {
    loading.value = false;
  }
}
</script>
