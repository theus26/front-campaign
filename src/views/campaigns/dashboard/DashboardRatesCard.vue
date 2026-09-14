<script setup lang="ts">
import type { ITaxasDashboard } from '@/@core/services/interfaces/dashboard/IDashboardService'
import { formatDashboardPercent } from '@/composables/Dashboard/dashboardHelpers'

const props = defineProps<{
  taxas: ITaxasDashboard
}>()

const rateItems = computed(() => [
  {
    title: 'Progresso da fila',
    value: props.taxas.progressoFila,
    color: 'primary',
    icon: 'tabler-loader',
  },
  {
    title: 'Taxa de entrega',
    value: props.taxas.taxaEntrega,
    color: 'info',
    icon: 'tabler-mailbox',
  },
  {
    title: 'Taxa de leitura',
    value: props.taxas.taxaLeitura,
    color: 'success',
    icon: 'tabler-eye-check',
  },
  {
    title: 'Taxa de falha',
    value: props.taxas.taxaFalha,
    color: 'error',
    icon: 'tabler-alert-triangle',
  },
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Indicadores</VCardTitle>
      <VCardSubtitle>Como os disparos estão performando</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol
          v-for="item in rateItems"
          :key="item.title"
          cols="12"
          sm="6"
        >
          <div class="d-flex align-center gap-4">
            <VProgressCircular
              :model-value="item.value"
              :color="item.color"
              size="64"
              width="6"
            >
              <VIcon
                :icon="item.icon"
                size="22"
                :color="item.color"
              />
            </VProgressCircular>

            <div>
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h4 class="text-h4">
                {{ formatDashboardPercent(item.value) }}
              </h4>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
