<template>
  <v-dialog v-model="isOpen" max-width="420">
    <v-card class="pa-4 text-center">
      <v-avatar size="56" class="mx-auto mb-3" variant="tonal">
        <v-icon icon="tabler-check" size="32" />
      </v-avatar>

      <v-card-title class="text-h6 font-medium">{{ title }}</v-card-title>

      <v-card-text class="text-body-2 mb-4">
        <div v-html="message" />
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="confirm">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  /**
   * Auto close in milliseconds. If 0 or undefined, dialog won't auto-close.
   */
  timeout?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const isOpen = ref<boolean>(props.modelValue)
const title = props.title ?? 'Sucesso'
const message = props.message ?? 'Operação realizada com sucesso.'
const timeout = props.timeout ?? 0

let autoCloseTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
    if (val && timeout && timeout > 0) startAutoClose()
  }
)

watch(isOpen, (val) => {
  emit('update:modelValue', val)
  if (val && timeout && timeout > 0) startAutoClose()
  if (!val) clearAutoClose()
})

function confirm() {
  emit('confirm')
  isOpen.value = false
}

function startAutoClose() {
  clearAutoClose()
  autoCloseTimer = setTimeout(() => {
    isOpen.value = false
  }, timeout)
}

function clearAutoClose() {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

onUnmounted(() => clearAutoClose())
</script>
