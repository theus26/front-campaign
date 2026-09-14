<script setup lang="ts">
import { formatDashboardPercent } from '@/composables/Dashboard/dashboardHelpers'
import { useDashboardHome, type DashboardPeriodo } from '@/composables/Dashboard/useDashboardHome'
import DashboardFunnelCard from '@/views/campaigns/dashboard/DashboardFunnelCard.vue'
import DashboardQueueCard from '@/views/campaigns/dashboard/DashboardQueueCard.vue'
import DashboardRatesCard from '@/views/campaigns/dashboard/DashboardRatesCard.vue'
import DashboardRecentCampaigns from '@/views/campaigns/dashboard/DashboardRecentCampaigns.vue'
import DashboardRecurrenceCard from '@/views/campaigns/dashboard/DashboardRecurrenceCard.vue'
import DashboardStatusWidgets from '@/views/campaigns/dashboard/DashboardStatusWidgets.vue'

const {
  nomeUsuario,
  loading,
  loadingCampaigns,
  hasLoaded,
  erro,
  dashboard,
  campanhasRecentes,
  periodo,
  isEmpty,
  selecionarPeriodo,
  fetchDashboard,
} = useDashboardHome()

const periodOptions: { title: string; value: DashboardPeriodo }[] = [
  { title: 'Tudo', value: 'all' },
  { title: '7 dias', value: '7d' },
  { title: '30 dias', value: '30d' },
]

const welcomeStats = computed(() => [
  {
    title: 'Progresso da fila',
    value: formatDashboardPercent(dashboard.value.taxas.progressoFila),
    icon: 'tabler-loader',
    color: 'primary',
  },
  {
    title: 'Taxa de entrega',
    value: formatDashboardPercent(dashboard.value.taxas.taxaEntrega),
    icon: 'tabler-mailbox',
    color: 'info',
  },
  {
    title: 'Taxa de leitura',
    value: formatDashboardPercent(dashboard.value.taxas.taxaLeitura),
    icon: 'tabler-eye-check',
    color: 'success',
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
        <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-4">
          <div class="d-flex flex-wrap gap-2">
            <VChip
              v-for="option in periodOptions"
              :key="option.value"
              :color="periodo === option.value ? 'primary' : undefined"
              :variant="periodo === option.value ? 'flat' : 'outlined'"
              label
              @click="selecionarPeriodo(option.value)"
            >
              {{ option.title }}
            </VChip>
          </div>

          <VBtn
            variant="tonal"
            color="primary"
            prepend-icon="tabler-refresh"
            :loading="loading"
            @click="fetchDashboard()"
          >
            Atualizar
          </VBtn>
        </div>

        <VAlert
          v-if="erro"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ erro }}
        </VAlert>

        <VRow class="py-6">
          <VCol
            cols="12"
            md="8"
            :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'"
          >
            <div class="pe-3">
              <h5 class="text-h5 mb-2">
                Bem vindo de volta,
                <span class="text-h4"> {{ nomeUsuario }} 👋🏻 </span>
              </h5>
              <div
                class="text-wrap text-body-1"
                style="max-inline-size: 360px"
              >
                Que bom ver você novamente. Tudo pronto para começar.
              </div>

              <div class="d-flex justify-space-between flex-wrap gap-4 flex-column flex-md-row mt-6">
                <div
                  v-for="stat in welcomeStats"
                  :key="stat.title"
                >
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      :color="stat.color"
                      rounded
                      size="54"
                      class="me-4"
                    >
                      <VIcon
                        :icon="stat.icon"
                        size="28"
                      />
                    </VAvatar>
                    <div>
                      <h6 class="text-h6 text-medium-emphasis">
                        {{ stat.title }}
                      </h6>
                      <h4
                        class="text-h4"
                        :class="`text-${stat.color}`"
                      >
                        {{ stat.value }}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <div class="d-flex justify-space-between align-center h-100">
              <div class="d-flex flex-column ps-3">
                <h5 class="text-h5 mb-1 text-no-wrap">
                  Campanhas
                </h5>
                <div class="text-body-1 mb-4">
                  Visão geral do período
                </div>
                <h4 class="text-h4 mb-2">
                  {{ dashboard.campanhas.total }}
                </h4>
                <div>
                  <VChip
                    color="info"
                    label
                    size="small"
                  >
                    {{ dashboard.campanhas.emAndamento }} em andamento
                  </VChip>
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VRow
      v-if="!hasLoaded"
      class="mb-6"
    >
      <VCol cols="12">
        <VSkeletonLoader type="article, heading, list-item-three-line" />
      </VCol>
    </VRow>

    <VRow
      v-else-if="isEmpty && !erro"
      class="mb-6"
    >
      <VCol cols="12">
        <VCard>
          <VCardText class="text-center py-12">
            <VAvatar
              color="primary"
              variant="tonal"
              size="64"
              class="mb-4"
            >
              <VIcon
                icon="tabler-rocket"
                size="36"
              />
            </VAvatar>
            <h5 class="text-h5 mb-2">
              {{ periodo === 'all' ? 'Seu painel ainda está vazio' : 'Nenhuma campanha neste período' }}
            </h5>
            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ periodo === 'all'
                ? 'Crie uma campanha para ver fila, funil, taxas e o ritmo dos disparos.'
                : 'Tente outro período ou crie uma nova campanha para começar.' }}
            </p>
            <VBtn
              color="primary"
              prepend-icon="tabler-plus"
              to="/campaigns/create"
            >
              Criar campanha
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <template v-else-if="!isEmpty">
      <DashboardStatusWidgets
        class="mb-6"
        :campanhas="dashboard.campanhas"
      />

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
          <DashboardRecurrenceCard :recorrencia="dashboard.recorrencia" />
        </VCol>
      </VRow>
    </template>

    <VRow class="mt-6">
      <VCol cols="12">
        <DashboardRecentCampaigns
          :campanhas="campanhasRecentes"
          :loading="loadingCampaigns"
        />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
