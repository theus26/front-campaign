<template>
  <v-dialog v-model="isOpen" max-width="480">
    <v-card>
      <v-card-title class="text-h6 font-semibold">
        Reconectar Provider
      </v-card-title>

      <v-card-text>
        Deseja reconectar o provider <strong>{{ providerName }}</strong>?
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="handleReconnect" :loading="loading">
          Reconectar
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
const emit = defineEmits(["update:modelValue", "reconnected"]);

const isOpen = ref(props.modelValue);
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

function closeDialog() {
  emit("update:modelValue", false);
}

async function handleReconnect() {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 1000));
    emit("reconnected", props.providerName);
    closeDialog();
  } finally {
    loading.value = false;
  }
}
</script>
