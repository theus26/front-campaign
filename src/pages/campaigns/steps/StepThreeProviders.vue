<script setup lang="ts">
import { useCreateCampaign } from '@/composables/useCreateCampaign';
import { useProvidersManager } from '@/composables/useProvidersManager';
import { defineEmits, watch } from 'vue';
import { VForm } from 'vuetify/components';

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'back'): void
}>()

const formRef = ref<VForm | null>(null);

// providers composable encapsulates provider logic
const {
  provider,
  loadProviders,
  createProvider,
  nameProvider,
  searchQuery,
  headers,
  totalProviders,
  itemsPerPage,
  page,
  onSelectRow,
  updateOptions,
  resolveStatus,
  editarItem,
  reconectarProvider,
  excluirProvider,
  desconectarConexao,
  openAddDialog,
  loading
} = useProvidersManager()

const { validateStepThree, selectedRows } = useCreateCampaign()

// Local refs for datatable binding
//const selectedRowsLocal = ref<any[]>([])

// re-expose handlers with slightly adapted signatures
const onSelectRowLocal = (rows: any[]) => {
  // keep only last selected to mimic original behavior
  if (!rows || rows.length === 0) {
    selectedRows.value = []
    return
  }
  selectedRows.value = [rows[rows.length - 1]]
  console.log(selectedRows.value);

  onSelectRow(rows)
}

const updateOptionsLocal = (options: any) => {
  updateOptions(options)
}

watch(searchQuery, () => {
  // could debounce and call server filter if needed
})


// life-cycle
onMounted(async () => {
  await loadProviders()
  console.log(provider);

})

// emit next handler (called by form submit)
const onNext = async () => {
  // ensure providers up-to-date
  validateStepThree(formRef.value)
  //await loadProviders()
  emit('next')
}

const handleCreateProvider = async () => {
  if (!nameProvider.value || nameProvider.value.trim().length === 0) return
  await createProvider(nameProvider.value)
  // after creation, refresh
  await loadProviders()
}
</script>

<template>
  <VForm ref="formRef" @submit.prevent="onNext">
    <VRow>
      <VCol cols="12">
        <h6 class="text-h6 font-weight-medium">Caixa de saída</h6>
        <p class="mb-0">Escolha a caixa de saída que será utilizada para enviar mensagens</p>
      </VCol>

      <!-- When there are no providers -->
      <VCol cols="12" v-if="!provider.length">
        <AppTextField v-model="nameProvider" clearable label="Nome da caixa."
          placeholder="Insira um nome para caixa de saída" type="text" :hide-spin-buttons="true"
          class="textfield-demo-icon-slot" :rules="[requiredValidator]">
          <!-- Append -->
          <template #append>
            <VBtn @click="createProvider" :disabled="nameProvider.length < 2">
              <span class="ms-3">Criar caixa</span>
            </VBtn>
          </template>
        </AppTextField>
      </VCol>


      <!-- When there are providers -->
      <VCol v-else cols="12">
        <VDivider />

        <div class="d-flex flex-wrap gap-4 ma-6">
          <div class="d-flex align-center">
            <AppTextField v-model="searchQuery" placeholder="Pesquise conexão" style="inline-size: 500px" />
          </div>

          <VSpacer />
          <div class="d-flex gap-4 flex-wrap align-center">
            <VBtn color="primary" prepend-icon="tabler-plus" @click="openAddDialog">Nova conexão</VBtn>
          </div>
        </div>

        <VDivider class="mt-4" />

        <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows" v-model:page="page"
          :headers="headers" :items="provider" :items-length="totalProviders" return-object show-select
          class="text-no-wrap" @update:model-value="onSelectRowLocal" @update:options="updateOptionsLocal">
          <template #item.product="{ item }">
            <div class="d-flex align-center gap-x-4">
              <VAvatar v-if="item.profilePictureUrl" size="38" variant="tonal" rounded
                :image="item.profilePictureUrl" />
              <div class="d-flex flex-column">
                <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.name }}</span>
                <span class="text-body-2">{{ item.owner ?? 'Desconectado' }}</span>
              </div>
            </div>
          </template>

          <template #item.status="{ item }">
            <VChip v-bind="resolveStatus(item.status)" density="default" label size="small" />
          </template>

          <template #item.actions="{ item }">
            <IconBtn @click="editarItem(item)">
              <VIcon icon="tabler-edit" />
            </IconBtn>

            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <template v-if="item.status === 'close'">
                    <VListItem value="reconnect" prepend-icon="tabler-refresh" @click="reconectarProvider(item)">
                      Reconectar
                    </VListItem>

                    <VListItem value="delete" prepend-icon="tabler-trash" @click="excluirProvider(item)">
                      Excluir
                    </VListItem>
                  </template>

                  <template v-else>
                    <VListItem value="disconnect" prepend-icon="tabler-refresh-off" @click="desconectarConexao(item)">
                      Desconectar
                    </VListItem>
                  </template>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <template #bottom>
            <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalProviders" />
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
            <VBtn color="secondary" variant="tonal">Salvar rascunho</VBtn>

            <VBtn type="submit">
              Próximo
              <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
