<script setup lang="ts">
import type { IFilaEnvio } from '@/@core/services/interfaces/dashboard/IDashboardService'
import { formatDashboardNumber } from '@/composables/Dashboard/dashboardHelpers'

const props = defineProps<{
  fila: IFilaEnvio
  progresso: number
}>()

const hasChartData = computed(() => Number(props.progresso ?? 0) > 0 || props.fila.total > 0)

const series = computed(() => [Math.max(Number(props.progresso ?? 0), 0)])

const chartOptions = {
  labels: ['Progresso'],
  chart: {
    type: 'radialBar',
    animations: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    radialBar: {
      offsetY: 10,
      startAngle: -140,
      endAngle: 130,
      hollow: {
        size: '65%',
      },
      track: {
        background: 'rgba(var(--v-theme-on-surface), 0.08)',
        strokeWidth: '100%',
      },
      dataLabels: {
        name: {
          offsetY: -20,
          color: 'rgba(var(--v-theme-on-surface), var(--v-disabled-opacity))',
          fontSize: '13px',
          fontWeight: '400',
        },
        value: {
          offsetY: 10,
          color: 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))',
          fontSize: '28px',
          fontWeight: '500',
          formatter(val: string) {
            return Number(val ?? 0).toLocaleString('pt-BR', {
              maximumFractionDigits: 1,
            })
          },
        },
      },
    },
  },
  colors: ['rgba(var(--v-theme-primary), 1)'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      shadeIntensity: 0.5,
      gradientToColors: ['rgba(var(--v-theme-primary), 1)'],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 0.6,
      stops: [30, 70, 100],
    },
  },
  stroke: {
    dashArray: 10,
  },
  grid: {
    padding: {
      top: -20,
      bottom: 5,
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
    active: {
      filter: {
        type: 'none',
      },
    },
  },
}

const filaItems = computed(() => [
  {
    title: 'Aguardando',
    value: props.fila.aguardando,
    icon: 'tabler-clock',
    color: 'warning',
  },
  {
    title: 'Enviadas',
    value: props.fila.enviadas,
    icon: 'tabler-send',
    color: 'success',
  },
  {
    title: 'Falhas',
    value: props.fila.falhas,
    icon: 'tabler-alert-circle',
    color: 'error',
  },
])
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Fila de envio</VCardTitle>
      <VCardSubtitle>Progresso dos disparos na fila</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="5"
        >
          <div class="mb-4 mt-2">
            <h2 class="text-h2">
              {{ formatDashboardNumber(fila.total) }}
            </h2>
            <p class="text-base mb-0">
              Mensagens na fila
            </p>
          </div>

          <VList class="card-list">
            <VListItem
              v-for="item in filaItems"
              :key="item.title"
            >
              <VListItemTitle class="font-weight-medium">
                {{ item.title }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ formatDashboardNumber(item.value) }}
              </VListItemSubtitle>
              <template #prepend>
                <VAvatar
                  rounded
                  size="34"
                  :color="item.color"
                  variant="tonal"
                  class="me-1"
                >
                  <VIcon
                    size="22"
                    :icon="item.icon"
                  />
                </VAvatar>
              </template>
            </VListItem>
          </VList>
        </VCol>

        <VCol
          cols="12"
          md="7"
          class="d-flex align-center justify-center"
        >
          <div
            v-if="hasChartData"
            class="chart-wrap"
          >
            <VueApexCharts
              type="radialBar"
              :options="chartOptions"
              :series="series"
              height="280"
            />
          </div>
          <div
            v-else
            class="text-body-1 text-medium-emphasis text-center"
          >
            Nenhum disparo na fila neste período.
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}

.chart-wrap {
  inline-size: 100%;
  min-block-size: 280px;
}
</style>
