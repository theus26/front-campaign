<script setup lang="ts">
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { useProvidersManager } from '@/composables/Provider/useProvidersManager';
import ConnectProviderDialog from '@/pages/campaigns/dialogs/ConnectProviderDialog.vue';
import DeleteProviderDialog from '@/pages/campaigns/dialogs/DeleteProviderDialog.vue';
import DisconnectProviderDialog from '@/pages/campaigns/dialogs/DisconnectProviderDialog.vue';
import EditProviderDialog from '@/pages/campaigns/dialogs/EditProviderDialog.vue';
import QrCodeModal from '@/pages/campaigns/dialogs/QrCodeModal.vue';
import ReconnectProviderDialog from '@/pages/campaigns/dialogs/ReconnectProviderDialog.vue';
import { VForm } from 'vuetify/components';


const {
  providers,
  nameProvider,
  selectedProvider,
  searchQuery,
  headers,
  totalRecords,
  itemsPerPage,
  page,
  loading,
  creatingLoading,
  base64,
  reconnectBase64,
  qrcodeModal,
  openAddDialog,
  editDialog,
  deleteProviderDialog,
  disconnectingProviderDialog,
  reconetingProviderDialog,
  selectedProviderArr,
  formRef,
  onSelectRow,
  updateOptions,
  resolveStatus,
  openDialogEdit,
  updateProvider,
  excluirProvider,
  openDeleteDialog,
  desconectarConexao,
  openDisconnectDialog,
  openReconnectDialog,
  createNewProvider,
  loadProviders,
  syncContactsInBackground,
} = useProvidersManager()

const { validateStepThree } = useCreateCampaign()

const emit = defineEmits<{
  (e: "next"): void;
  (e: "back"): void;
}>();

const onNext = async () => {
  validateStepThree(formRef.value)
  loadProviders()
}

</script>

<template>
  <div>
    <VCard title="Conexões" subtitle="Gerencie suas conexões do WhatsApp" class="mb-6">
      <div class="d-flex align-center gap-4 ma-6">
        <AppTextField v-model="searchQuery" placeholder="Pesquise conexão" class="flex-grow-1" />
        <VBtn color="primary" prepend-icon="tabler-plus" @click="openAddDialog = true">
          Nova conexão
        </VBtn>
      </div>

      <VForm ref="formRef" @submit.prevent="onNext">
        <VRow>
          <VCol cols="12">

            <VDivider class="mt-4" />

            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedProviderArr"
              v-model:page="page" :loading="loading" loading-text="Aguarde..." :headers="headers" :items="providers"
              :items-length="totalRecords" return-object :single-select="true" class="text-no-wrap"
              @update:model-value="onSelectRow" @update:options="updateOptions">
              <template #item.product="{ item }">
                <div class="d-flex align-center gap-x-4">
                  <VAvatar v-if="item.profilePictureUrl" size="38" variant="tonal" rounded
                    :image="item.profilePictureUrl" />
                  <div class="d-flex flex-column">
                    <span class="text-body-1 font-weight-medium text-high-emphasis">
                      {{ item.name }}
                    </span>
                    <span class="text-body-2">
                      {{ item.owner ?? 'Desconectado' }}
                    </span>
                  </div>
                </div>
              </template>

              <template #item.status="{ item }">
                <VChip v-bind="resolveStatus(item.status)" density="default" label size="small" />
              </template>

              <template #item.actions="{ item }">
                <IconBtn @click="openDialogEdit(item)">
                  <VIcon icon="tabler-edit" color="primary" />
                </IconBtn>



                <IconBtn>
                  <VIcon icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                    <VList>
                      <template v-if="item.status === 'close'">
                        <VListItem value="reconnect" prepend-icon="tabler-refresh" color="primary"
                          @click="openReconnectDialog(item)">
                          Reconectar
                        </VListItem>

                        <VListItem value="delete" prepend-icon="tabler-trash" @click="openDeleteDialog(item)">
                          Excluir
                        </VListItem>
                      </template>

                      <template v-else>
                        <VListItem value="disconnect" prepend-icon="tabler-refresh-off"
                          @click="openDisconnectDialog(item)">
                          Desconectar
                        </VListItem>
                        <VListItem value="sync" prepend-icon="tabler-refresh"
                          @click="syncContactsInBackground(item.instanceName)">
                          Sincronizar Contatos
                        </VListItem>
                      </template>
                    </VList>
                  </VMenu>
                </IconBtn>
              </template>

              <template #bottom>
                <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalRecords" />
              </template>
            </VDataTableServer>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </div>



  <QrCodeModal v-model="qrcodeModal" :base64="base64" :name="nameProvider" @next="onNext" />
  <ConnectProviderDialog v-model="openAddDialog" :creating-loading="creatingLoading" @loadProvieders="loadProviders"
    @create-new-provider="createNewProvider" />
  <EditProviderDialog v-model="editDialog" :provider="selectedProvider" :loading="loading"
    @update="updateProvider($event)" />
  <DeleteProviderDialog v-model="deleteProviderDialog" :provider="selectedProvider" :loading="loading"
    @delete="excluirProvider($event)" />
  <DisconnectProviderDialog v-model="disconnectingProviderDialog" :provider="selectedProvider" :loading="loading"
    @disconnected="desconectarConexao($event)" />
  <ReconnectProviderDialog v-model="reconetingProviderDialog" :base64="reconnectBase64"
    :name="selectedProvider?.name || ''" @next="onNext" />

</template>
