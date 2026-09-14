<script setup lang="ts">
import { formatDashboardNumber } from '@/composables/Dashboard/dashboardHelpers'
import { useDashboardCampaign } from '@/composables/Dashboard/useDashboardCampaign'
import DashboardErrorsCard from '@/views/campaigns/dashboard/DashboardErrorsCard.vue'
import DashboardFunnelCard from '@/views/campaigns/dashboard/DashboardFunnelCard.vue'
import DashboardQueueCard from '@/views/campaigns/dashboard/DashboardQueueCard.vue'
import DashboardRatesCard from '@/views/campaigns/dashboard/DashboardRatesCard.vue'

const route = useRoute()
const campaignId = computed(() => String(route.params.id ?? ''))

const {
  loading,
  erro,
  dashboard,
  resolveStatus,
  resolveRecurrence,
  formatDate,
  fetchDashboard,
} = useDashboardCampaign(campaignId)

const summaryItems = computed(() => [
  {
    title: 'Destinatários previstos',
    value: formatDashboardNumber(dashboard.value.destinatariosPrevistos),
    icon: 'tabler-users',
    color: 'primary',
  },
  {
    title: 'Na fila',
    value: formatDashboardNumber(dashboard.value.fila.total),
    icon: 'tabler-list',
    color: 'info',
  },
  {
    title: 'Início',
    value: formatDate(dashboard.value.inicioCampanha),
    icon: 'tabler-calendar-event',
    color: 'warning',
  },
  {
    title: 'Término',
    value: formatDate(dashboard.value.fimCampanha),
    icon: 'tabler-calendar-off',
    color: 'secondary',
  },
])
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VProgressLinear
        v-if="loading"
        indeterminate
        color="primary"
      />

      <VCardText>
        <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-6">
          <div class="d-flex align-center gap-3">
            <VBtn
              icon
              variant="tonal"
              color="secondary"
              to="/campaigns/home"
            >
              <VIcon icon="tabler-arrow-left" />
            </VBtn>

            <div>
              <div class="d-flex flex-wrap align-center gap-2 mb-1">
                <h4 class="text-h4">
                  {{ dashboard.nome || 'Dashboard da campanha' }}
                </h4>
                <VChip
                  v-if="dashboard.nome"
                  :color="resolveStatus(dashboard.status).color"
                  size="small"
                  label
                >
                  {{ resolveStatus(dashboard.status).label }}
                </VChip>
                <VChip
                  v-if="dashboard.recorrencia"
                  :color="resolveRecurrence(dashboard.recorrencia).color"
                  size="small"
                  label
                >
                  {{ resolveRecurrence(dashboard.recorrencia).label }}
                </VChip>
              </div>
              <div class="text-body-1 text-medium-emphasis">
                Acompanhe fila, funil, taxas e os erros desta campanha.
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <VBtn
              variant="tonal"
              color="primary"
              prepend-icon="tabler-refresh"
              :loading="loading"
              @click="fetchDashboard()"
            >
              Atualizar
            </VBtn>
            <VBtn
              variant="tonal"
              prepend-icon="tabler-edit"
              :to="`/campaigns/edit/${campaignId}`"
            >
              Editar
            </VBtn>
          </div>
        </div>

        <VAlert
          v-if="erro"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ erro }}
        </VAlert>

        <VRow>
          <VCol
            v-for="item in summaryItems"
            :key="item.title"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="d-flex align-center gap-4">
              <VAvatar
                variant="tonal"
                :color="item.color"
                rounded
                size="42"
              >
                <VIcon
                  :icon="item.icon"
                  size="24"
                />
              </VAvatar>
              <div>
                <div class="text-body-1">
                  {{ item.title }}
                </div>
                <h5 class="text-h5">
                  {{ item.value }}
                </h5>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VRow class="match-height">
      <VCol
        cols="12"
        lg="7"
      >
        <DashboardQueueCard
          :fila="dashboard.fila"
          :progresso="dashboard.taxas.progressoFila"
        />
      </VCol>

      <VCol
        cols="12"
        lg="5"
      >
        <DashboardFunnelCard
          :funil-mensagens="dashboard.funilMensagens"
          :funil-destinatarios="dashboard.funilDestinatarios"
        />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardRatesCard :taxas="dashboard.taxas" />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardErrorsCard :erros="dashboard.principaisErros" />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
