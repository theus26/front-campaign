<script setup lang="ts">
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { useProvidersManager } from '@/composables/Provider/useProvidersManager';
import { VForm } from 'vuetify/components';
import ConnectProviderDialog from '../dialogs/ConnectProviderDialog.vue';
import DeleteProviderDialog from '../dialogs/DeleteProviderDialog.vue';
import DisconnectProviderDialog from '../dialogs/DisconnectProviderDialog.vue';
import EditProviderDialog from '../dialogs/EditProviderDialog.vue';
import QrCodeModal from '../dialogs/QrCodeModal.vue';
import ReconnectProviderDialog from '../dialogs/ReconnectProviderDialog.vue';

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
  createProvider,

} = useProvidersManager()

const { validateStepThree } = useCreateCampaign()

const emit = defineEmits<{
  (e: "next"): void;
  (e: "back"): void;
}>();

const onNext = async () => {
  validateStepThree(formRef.value)
  await loadProviders()
  emit('next')
}

</script>

<template>
  <VForm ref="formRef" @submit.prevent="onNext">
    <VRow>
      <VCol cols="12">
        <h6 class="text-h6 font-weight-medium">Caixa de saída</h6>
        <p class="mb-0">Escolha a caixa de saída que será utilizada para enviar mensagens</p>
      </VCol>

      <VCol cols="12" v-if="loading">
        <VSkeletonLoader type="table" style="width: 100%; height: 300px" />
      </VCol>

      <VCol cols="12" v-else-if="!providers.length && !searchQuery">
        <AppTextField v-model="nameProvider" clearable label="Nome da caixa."
          placeholder="Insira um nome para caixa de saída" type="text" :hide-spin-buttons="true"
          class="textfield-demo-icon-slot" :rules="[requiredValidator]">
          <template #append>
            <VBtn @click="createProvider()" :disabled="nameProvider.length < 2" :loading="creatingLoading">
              <span>Criar caixa</span>
            </VBtn>
          </template>
        </AppTextField>
      </VCol>

      <VCol v-else cols="12">
        <VDivider />

        <div class="d-flex flex-wrap gap-4 ma-6">
          <div class="d-flex align-center">
            <AppTextField v-model="searchQuery" placeholder="Pesquise conexão" style="inline-size: 500px" />
          </div>

          <VSpacer />

          <div class="d-flex gap-4 flex-wrap align-center">
            <VBtn color="primary" prepend-icon="tabler-plus" @click="openAddDialog = true">
              Nova conexão
            </VBtn>
          </div>
        </div>

        <VDivider class="mt-4" />

        <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedProviderArr"
          v-model:page="page" :headers="headers" :items="providers" :items-length="totalRecords" return-object
          :single-select="true" show-select class="text-no-wrap" @update:model-value="onSelectRow"
          @update:options="updateOptions">
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
              <VIcon icon="tabler-edit" />
            </IconBtn>

            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <template v-if="item.status === 'close'">
                    <VListItem value="reconnect" prepend-icon="tabler-refresh" @click="openReconnectDialog(item)">
                      Reconectar
                    </VListItem>

                    <VListItem value="delete" prepend-icon="tabler-trash" @click="openDeleteDialog(item)">
                      Excluir
                    </VListItem>
                  </template>

                  <template v-else>
                    <VListItem value="disconnect" prepend-icon="tabler-refresh-off" @click="openDisconnectDialog(item)">
                      Desconectar
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

      <VCol cols="12">
        <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
          <VBtn color="secondary" variant="tonal" @click="$emit('back')">
            <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
            Voltar
          </VBtn>

          <div class="d-flex gap-4">
            <VBtn color="secondary" variant="tonal">
              Salvar rascunho
            </VBtn>

            <VBtn type="submit">
              Próximo
              <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>
  </VForm>

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
