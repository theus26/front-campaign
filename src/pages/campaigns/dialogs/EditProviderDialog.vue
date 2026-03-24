<template>
  <v-dialog v-model="isOpen" max-width="500">
    <v-card>
      <v-card-title class="text-h6 font-semibold">
        Editar Provider
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="editedName" label="Nome do Provider" variant="outlined" dense />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="handleEdit" :loading="loading">
          Salvar
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
const emit = defineEmits(["update:modelValue", "edited"]);

const isOpen = ref(props.modelValue);
const editedName = ref(props.providerName ?? "");
const loading = ref(false);

watch(
  () => props.modelValue,
  (val) => (isOpen.value = val)
);

function closeDialog() {
  emit("update:modelValue", false);
}

async function handleEdit() {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 1000));
    emit("edited", editedName.value);
    closeDialog();
  } finally {
    loading.value = false;
  }
}
</script>
