<script setup lang="ts">
import type { ICampanhasStatus } from '@/@core/services/interfaces/dashboard/IDashboardService'
import { formatDashboardNumber } from '@/composables/Dashboard/dashboardHelpers'

const props = defineProps<{
  campanhas: ICampanhasStatus
}>()

const widgetData = computed(() => [
  {
    title: 'Em andamento',
    value: props.campanhas.emAndamento,
    icon: 'tabler-activity',
    color: 'info',
  },
  {
    title: 'Agendadas',
    value: props.campanhas.agendada,
    icon: 'tabler-calendar-stats',
    color: 'warning',
  },
  {
    title: 'Finalizadas',
    value: props.campanhas.finalizada,
    icon: 'tabler-checks',
    color: 'success',
  },
  {
    title: 'Pausadas',
    value: props.campanhas.pausada,
    icon: 'tabler-pause',
    color: 'error',
  },
  {
    title: 'Rascunhos',
    value: props.campanhas.rascunho,
    icon: 'tabler-file-pencil',
    color: 'secondary',
  },
  {
    title: 'Total',
    value: props.campanhas.total,
    icon: 'tabler-stack-2',
    color: 'primary',
  },
])
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <template
          v-for="data in widgetData"
          :key="data.title"
        >
          <VCol
            cols="12"
            sm="6"
            md="4"
            lg="2"
            class="px-6"
          >
            <div class="d-flex justify-space-between">
              <div class="d-flex flex-column">
                <h4 class="text-h4">
                  {{ formatDashboardNumber(data.value) }}
                </h4>
                <div class="text-body-1">
                  {{ data.title }}
                </div>
              </div>

              <VAvatar
                variant="tonal"
                :color="data.color"
                rounded
                size="42"
              >
                <VIcon
                  :icon="data.icon"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCol>
        </template>
      </VRow>
    </VCardText>
  </VCard>
</template>
