<script setup lang="ts">
import { typeContacts } from '@/@core/useCreateCampaign.const';
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { ref } from 'vue';
import { VForm } from 'vuetify/components';
import NumbersPreview from '../components/NumbersPreview.vue';

const emit = defineEmits(['next', 'back']);
const { shippingNumbers, selectedContacts, message, addNumber, deleteNumber, handleFileUpload, validateStepTwo, loading } = useCreateCampaign()
const formRef = ref<VForm | null>(null);
const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')


const onNext = async () => {

  await validateStepTwo(formRef.value)
  emit('next');
}
</script>

<template>
  <VForm ref="formRef" @submit.prevent="onNext">
    <VRow>
      <!-- Cabeçalho -->
      <VCol cols="12">
        <h6 class="text-h6 font-weight-medium">Público-alvo</h6>
        <p class="mb-0 text-body-2 text-gray-400">
          Defina a lista de contatos para onde serão enviadas as mensagens da campanha.
        </p>
      </VCol>

      <!-- Seleção de tipo de importação -->
      <VCol cols="12">
        <CustomRadios v-model:selected-radio="selectedContacts" :radio-content="typeContacts"
          :grid-column="{ sm: '6', cols: '12' }" />
      </VCol>

      <!-- Opção manual -->
      <VCol cols="12" v-if="selectedContacts === 'manual'">
        <AppTextField v-model="message" clearable label="Adicione os números manualmente" placeholder="Ex: 559999999999"
          type="text">
          <template #append-inner>
            <VFadeTransition leave-absolute>
              <VProgressCircular v-if="loading" width="3" size="24" indeterminate />
            </VFadeTransition>
          </template>
          <template #append>
            <VBtn :disabled="message.length < 2" color="primary" @click="addNumber">Adicionar</VBtn>
          </template>
        </AppTextField>

        <VExpandTransition>
          <div v-if="shippingNumbers.length" class="mt-6">
            <p class="text-sm text-gray-400 mb-2 font-medium">Números adicionados</p>
            <NumbersPreview :numbers="shippingNumbers" :onDelete="deleteNumber" />
          </div>
        </VExpandTransition>
      </VCol>

      <!-- Opção importação -->
      <VCol cols="12" v-if="selectedContacts === 'import'">
        <div class="upload-container" v-if="!shippingNumbers.length">

          <!-- TÍTULO -->
          <div class="mb-3">
            <h6 class="text-h6 font-weight-medium">
              Importar contatos
            </h6>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Envie um arquivo com os números para disparo da campanha.
            </p>
          </div>

          <!-- DROPZONE -->
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

          <!-- INFO -->
          <div class="mt-3 text-caption text-medium-emphasis">
            ✔ Arquivos permitidos: <b>.csv</b> ou <b>.xlsx</b><br />
            ✔ Deve conter a coluna <b>"numeros"</b>
          </div>

          <!-- FEEDBACK -->
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

      <!-- Botões de navegação -->
      <VCol cols="12">
        <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
          <VBtn color="secondary" variant="tonal" @click="emit('back')">Voltar</VBtn>
          <div class="d-flex gap-4">
            <VBtn color="secondary" variant="tonal">Salvar rascunho</VBtn>
            <VBtn type="submit">Próximo
              <VIcon icon="tabler-arrow-right" end />
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>
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
