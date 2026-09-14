<script setup lang="ts">
import type { ICampaign } from '@/@core/services/interfaces/campaign/ICampaignService'

defineProps<{
  campanhas: ICampaign[]
  loading?: boolean
}>()

const campaignStatusMap: Record<string, { label: string; color: string }> = {
  InProgress: { label: 'Em andamento', color: 'info' },
  Closed: { label: 'Encerrada', color: 'success' },
  Scheduled: { label: 'Agendada', color: 'warning' },
  Draft: { label: 'Rascunho', color: 'secondary' },
  Paused: { label: 'Pausada', color: 'error' },
}

const resolveStatus = (status?: string) =>
  campaignStatusMap[status ?? ''] ?? { label: status || '—', color: 'secondary' }

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('')

const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash)

  return `hsl(${hash % 360}, 60%, 50%)`
}
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Acompanhar campanhas</VCardTitle>
      <VCardSubtitle>Abra o dashboard de uma campanha específica</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <VSkeletonLoader
        v-if="loading"
        type="list-item-avatar-two-line@3"
      />

      <div
        v-else-if="!campanhas.length"
        class="text-center py-6"
      >
        <p class="text-body-1 text-medium-emphasis mb-4">
          Nenhuma campanha ainda. Crie a primeira para ver os números ao vivo.
        </p>
        <VBtn
          color="primary"
          prepend-icon="tabler-plus"
          to="/campaigns/create"
        >
          Criar campanha
        </VBtn>
      </div>

      <VList
        v-else
        class="card-list"
      >
        <VListItem
          v-for="campanha in campanhas"
          :key="campanha.campaignId"
          :to="`/campaigns/dashboard/${campanha.campaignId}`"
          rounded
        >
          <template #prepend>
            <VAvatar
              size="38"
              rounded
              :style="{ backgroundColor: stringToColor(campanha.name || '') }"
            >
              <span class="text-white text-sm font-weight-medium">
                {{ getInitials(campanha.name || '') }}
              </span>
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ campanha.name }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ campanha.providerName || 'Sem caixa de saída' }}
          </VListItemSubtitle>

          <template #append>
            <VChip
              :color="resolveStatus(campanha.status).color"
              size="small"
              label
            >
              {{ resolveStatus(campanha.status).label }}
            </VChip>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 8px;
}
</style>
