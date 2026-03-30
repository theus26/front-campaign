<script setup lang="ts">
import { typeContacts } from '@/@core/useCreateCampaign.const';
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { ref } from 'vue';
import { VForm } from 'vuetify/components';

const emit = defineEmits(['next', 'back']);
const { shippingNumbers, selectedContacts, message, addNumber, deleteNumber, handleFileUpload, validateStepTwo, loading } = useCreateCampaign()
const formRef = ref<VForm | null>(null);
const fileInput = ref<HTMLInputElement | null>(null)


const onNext = async () => {
  console.log(formRef.value);

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
        <AppTextField v-model="message" clearable label="Adicione os números manualmente"
          placeholder="Ex: 559999999999, 558888888888" type="text">
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
            <div class="flex flex-wrap gap-3">
              <VChip v-for="(item, index) in shippingNumbers" :key="index" color="primary" variant="flat"
                text-color="white" class="rounded-xl px-4 py-2 text-sm flex items-center gap-2" closable
                @click:close="deleteNumber(item)">
                {{ item }}
              </VChip>
            </div>
          </div>
        </VExpandTransition>
      </VCol>

      <!-- Opção importação -->
      <VCol cols="12" v-if="selectedContacts === 'import'">
        <div class="flex flex-col gap-2">
          <VFileInput ref="fileInput" @change="handleFileUpload" accept=".csv, .xlsx" variant="outlined" color="primary"
            label="Clique aqui para escolher um arquivo" show-size density="comfortable" class="rounded-lg" />
          <span class="text-sm text-gray-400">
            Obs: Permitido arquivos <b>.csv</b> ou <b>.xlsx (Excel)</b> com a coluna <b>'numeros'</b>.
          </span>
        </div>

        <VExpandTransition>
          <div v-if="shippingNumbers.length" class="mt-6">
            <p class="text-sm text-gray-400 mb-2 font-medium">Números adicionados</p>
            <div class="flex flex-wrap gap-3">
              <VChip v-for="(item, index) in shippingNumbers" :key="index" color="primary" variant="flat"
                text-color="white" class="rounded-xl px-4 py-2 text-sm flex items-center gap-2" closable
                @click:close="deleteNumber(item)">
                {{ item }}
              </VChip>
            </div>
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
