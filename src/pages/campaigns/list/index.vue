<script setup lang="ts">
import { useCampaignList } from '@/composables/Campaign/useCampaign';

const {
  searchQuery,
  itemsPerPage,
  page,
  selectedStatus,
  selectedRecurrence,
  campaigns,
  headers,
  statusCampaign,
  recurrences,
  widgetData,
  loading,
  totalRecords,
  resolveStatus,
  resolveRecurrence,
  formatDate,
  getInitials,
  stringToColor,
  getCampaignActions,
  handleAction,
  getSubtitle,
  updateOptions,
} = useCampaignList()
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <template v-for="(data, id) in widgetData" :key="id">
            <VCol cols="12" sm="6" md="3" class="px-6">
              <div class="d-flex justify-space-between" :class="$vuetify.display.xs
                ? id !== widgetData.length - 1 ? 'border-b pb-4' : ''
                : $vuetify.display.sm
                  ? id < (widgetData.length / 2) ? 'border-b pb-4' : ''
                  : ''">
                <div class="d-flex flex-column">
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>

                  <div class="text-body-1">
                    {{ data.title }}
                  </div>
                </div>

                <VAvatar variant="tonal" rounded size="42">
                  <VIcon :icon="data.icon" size="26" class="text-high-emphasis" />
                </VAvatar>
              </div>
            </VCol>
            <VDivider v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
              : $vuetify.display.smAndUp ? id % 2 === 0
                : false" vertical inset length="60" />
          </template>
        </VRow>
      </VCardText>
    </VCard>

    <VCard title="Filtros" class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6">
            <AppSelect v-model="selectedStatus" placeholder="Status da campanha" :items="statusCampaign" clearable
              clear-icon="tabler-x" />
          </VCol>

          <VCol cols="12" sm="6">
            <AppSelect v-model="selectedRecurrence" placeholder="Recorrência" :items="recurrences" clearable
              clear-icon="tabler-x" />
          </VCol>


        </VRow>
      </VCardText>

      <VDivider />

      <div class="d-flex align-center gap-4 ma-6">

        <AppTextField v-model="searchQuery" placeholder="Buscar campanha" class="flex-grow-1" />

        <VBtn color="primary" prepend-icon="tabler-plus" @click="$router.push('/campaigns/create')">
          Criar Campanha
        </VBtn>

      </div>

      <VDivider class="mt-4" />

      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers" :items="campaigns"
        :items-length="totalRecords" :loading="loading" class="text-no-wrap" @update:options="updateOptions">
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar size="38" rounded :style="{ backgroundColor: stringToColor(item.name || '') }">
              <span class="text-white text-sm font-weight-medium">
                {{ getInitials(item.name || '') }}
              </span>
            </VAvatar>
            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.name }}</span>
              <span class="text-body-2">{{ getSubtitle(item) }}</span>
            </div>
          </div>
        </template>



        <template #item.recurrence="{ item }">
          <VChip :color="resolveRecurrence(item.recurrence || '').color" size="small" label>
            {{ resolveRecurrence(item.recurrence || '').label }}
          </VChip>
        </template>

        <template #item.inbox="{ item }">
          <span class="text-body-1 font-weight-medium text-high-emphasis text-center">{{ item.providerName }}</span>
        </template>


        <template #item.startDate="{ item }">
          <span class="text-body-1 font-weight-medium text-high-emphasis text-center">{{ formatDate(item.startCampaign
            || null)
          }}</span>
        </template>

        <template #item.endDate="{ item }">
          <span class="text-body-1 font-weight-medium text-high-emphasis text-center">{{ formatDate(item.endCampaign ||
            null)
          }}</span>
        </template>

        <template #item.status="{ item }">
          <VChip :color="resolveStatus(item.status || '').color" size="small" label>
            {{ resolveStatus(item.status || '').label }}
          </VChip>
        </template>

        <template #item.actions="{ item }">

          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />

            <VMenu activator="parent">
              <VList>
                <VListItem v-for="action in getCampaignActions(item.status || '')" :key="action.key"
                  @click="handleAction(action.key, item)">
                  <template #prepend>
                    <VIcon :icon="action.icon" :color="action.color" />
                  </template>

                  <VListItemTitle>
                    {{ action.label }}
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalRecords" />
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>
