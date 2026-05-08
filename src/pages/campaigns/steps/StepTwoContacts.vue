<script setup lang="ts">
import { typeContacts } from '@/@core/useCreateCampaign.const';
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { useCreateDraftCampaign } from "@/composables/Campaign/useCreateDraftCampaign";
import { formatInputNumber } from '@/composables/Contacts/useFormatNumberComposable';
import { VForm } from 'vuetify/components';
import NumbersPreview from '../components/NumbersPreview.vue';

const emit = defineEmits(['next', 'back']);
const { shippingNumbers, contatos, numeros, selectedContacts, message, loading, fileName, fileInput, formRef, isEdit, addNumber, deleteNumber, handleFileUpload, validateStepTwo, updateCampaign, customFilter, getInitials } = useCreateCampaign()
const { createDraft, loadingDraft } = useCreateDraftCampaign()


const onNext = async () => {
  await validateStepTwo(formRef.value)
  emit('next');
}
</script>

<template>
  <VForm ref="formRef" @submit.prevent="onNext">
    <VRow>
      <VCol cols="12">
        <h6 class="text-h6 font-weight-medium">Público-alvo</h6>
        <p class="mb-0 text-body-2 text-gray-400">
          Defina a lista de contatos para onde serão enviadas as mensagens da campanha.
        </p>
      </VCol>

      <VCol cols="12">
        <CustomRadios v-model:selected-radio="selectedContacts" :radio-content="typeContacts"
          :grid-column="{ cols: '12', md: '4' }" />
      </VCol>

      <VCol cols="12" v-if="selectedContacts === 'contatos'">
        <VCol cols="12">


          <AppAutocomplete v-model="shippingNumbers" label="Selecione os contatos" placeholder="Selecione"
            :items="contatos" item-title="nome" item-value="numero" :custom-filter="customFilter" multiple chips
            closable-chips clearable :return-object="false" prepend-inner-icon="tabler-users">
            <!-- Item da lista -->
            <template #item="{ props, item }">
              <VListItem v-bind="props" :title="item.raw.nome" :subtitle="formatInputNumber(item.raw.numero)">
                <template #prepend>
                  <VAvatar size="32" color="primary" variant="tonal">
                    {{ getInitials(item.raw.nome) }}
                  </VAvatar>
                </template>
              </VListItem>
            </template>

            <!-- Chips selecionados -->
            <template #chip="{ props, item }">
              <VChip v-bind="props" size="small" :color="item.raw.nome ? 'primary' : 'warning'" variant="tonal">
                {{ item.raw.nome ?? "Sem nome" }}
              </VChip>
            </template>
          </AppAutocomplete>

        </VCol>

        <VExpandTransition>
          <div v-if="shippingNumbers.length" class="mt-6">
            <p class="text-sm text-gray-400 mb-2 font-medium">Números adicionados</p>
            <NumbersPreview :numbers="shippingNumbers" :onDelete="deleteNumber" />
          </div>
        </VExpandTransition>
      </VCol>

      <VCol cols="12" v-if="selectedContacts === 'import'">
        <div class="upload-container">

          <div class="mb-3">
            <h6 class="text-h6 font-weight-medium">
              Importar contatos
            </h6>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Envie um arquivo com os números para disparo da campanha.
            </p>
          </div>

          <div class="dropzone" @click="fileInput?.click()">
            <VIcon icon="tabler-upload" size="32" class="mb-2 text-primary" />

            <div class="text-subtitle-2 font-weight-medium">
              Arraste seu arquivo aqui
            </div>

            <div class="text-caption text-medium-emphasis">
              ou clique para selecionar
            </div>

            <input ref="fileInput" type="file" class="d-none" accept=".csv, .xlsx" @change="handleFileUpload" />
          </div>

          <div class="mt-3 text-caption text-medium-emphasis">
            ✔ Arquivos permitidos: <b>.csv</b> ou <b>.xlsx</b><br />
            ✔ Deve conter a coluna <b>"numeros"</b>
          </div>

          <VFadeTransition>
            <div v-if="fileName" class="mt-4 success-box">
              <VIcon icon="tabler-check" color="success" class="mr-2" />
              <span class="text-sm">
                {{ fileName }} carregado com sucesso
              </span>
            </div>
          </VFadeTransition>

        </div>

        <VExpandTransition>
          <div v-if="shippingNumbers.length" class="mt-6">
            <p class="text-sm text-gray-400 mb-2 font-medium">Números adicionados</p>
            <NumbersPreview :numbers="shippingNumbers" :onDelete="deleteNumber" />
          </div>
        </VExpandTransition>
      </VCol>


    </VRow>
    <div class="d-flex justify-space-between align-center mt-8 flex-wrap gap-4">

      <!-- ESQUERDA -->
      <div>
        <VBtn color="info" variant="tonal" @click="$emit('back')">
          <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
          Voltar
        </VBtn>
      </div>

      <!-- DIREITA -->
      <div class="d-flex gap-4">
        <VBtn v-if="isEdit" color="warning" variant="tonal" @click="updateCampaign" :loading="loading">
          Salvar Alterações
        </VBtn>

        <VBtn v-else color="info" variant="tonal" @click="createDraft" :loading="loadingDraft">
          Salvar rascunho
        </VBtn>

        <VBtn type="submit" color="primary" variant="elevated">
          Próximo
          <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
        </VBtn>
      </div>

    </div>
  </VForm>
</template>

<style scoped>
.upload-container {
  border-radius: 12px;
}

.dropzone {
  border: 2px dashed rgba(100, 100, 100, 0.3);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropzone:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.success-box {
  display: flex;
  align-items: center;
  background-color: rgba(76, 175, 80, 0.1);
  padding: 10px 14px;
  border-radius: 8px;
}
</style>
