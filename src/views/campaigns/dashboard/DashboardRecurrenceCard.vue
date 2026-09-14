<script setup lang="ts">
import type { IRecorrenciaDashboard } from '@/@core/services/interfaces/dashboard/IDashboardService'
import { formatDashboardNumber } from '@/composables/Dashboard/dashboardHelpers'

const props = defineProps<{
  recorrencia: IRecorrenciaDashboard
}>()

const hasData = computed(() => props.recorrencia.unica + props.recorrencia.recorrente > 0)

const series = computed(() => [
  props.recorrencia.unica,
  props.recorrencia.recorrente,
])

const total = computed(() => props.recorrencia.unica + props.recorrencia.recorrente)

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    parentHeightOffset: 0,
    animations: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  labels: ['Única', 'Recorrente'],
  colors: ['rgba(var(--v-theme-info), 1)', 'rgba(var(--v-theme-primary), 1)'],
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  tooltip: {
    theme: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          value: {
            fontSize: '1.125rem',
            color: 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))',
            fontWeight: 500,
            offsetY: -15,
            formatter(val: string) {
              return val
            },
          },
          name: {
            offsetY: 20,
          },
          total: {
            show: true,
            fontSize: '13px',
            label: 'Total',
            color: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
            formatter() {
              return String(total.value)
            },
          },
        },
      },
    },
  },
}))
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Recorrência</VCardTitle>
      <VCardSubtitle>Campanhas únicas e recorrentes</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <div
        v-if="hasData"
        class="d-flex align-center justify-space-between gap-4"
      >
        <div class="d-flex flex-column gap-4">
          <div class="d-flex align-center gap-3">
            <VBadge
              dot
              inline
              color="info"
            />
            <div>
              <div class="text-body-1">
                Única
              </div>
              <h5 class="text-h5">
                {{ formatDashboardNumber(recorrencia.unica) }}
              </h5>
            </div>
          </div>

          <div class="d-flex align-center gap-3">
            <VBadge
              dot
              inline
              color="primary"
            />
            <div>
              <div class="text-body-1">
                Recorrente
              </div>
              <h5 class="text-h5">
                {{ formatDashboardNumber(recorrencia.recorrente) }}
              </h5>
            </div>
          </div>
        </div>

        <div class="chart-wrap">
          <VueApexCharts
            type="donut"
            height="160"
            width="160"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </div>

      <div
        v-else
        class="text-body-1 text-medium-emphasis py-6 text-center"
      >
        Ainda não há campanhas para comparar a recorrência.
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.chart-wrap {
  inline-size: 160px;
  block-size: 160px;
}
</style>
