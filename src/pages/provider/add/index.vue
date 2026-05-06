<script setup lang="ts">
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { useProvidersManager } from '@/composables/Provider/useProvidersManager';
import QrCodeModal from '@/pages/campaigns/dialogs/QrCodeModal.vue';
import { router } from '@/plugins/1.router';
import { VForm } from 'vuetify/components';

const {
  nameProvider,
  base64,
  qrcodeModal,
  formRef,
  creatingLoading,
  createProvider,
} = useProvidersManager()

const { validateStepThree } = useCreateCampaign()

const emit = defineEmits<{
  (e: "next"): void;
  (e: "back"): void;
}>();

const onNext = async () => {
  validateStepThree(formRef.value)
  router.push("/provider/list")
}


</script>

<template>
  <div>
    <VRow>
      <VCol md="12">
        <VCard class="mb-6" title="Criar conexão" subtitle="crie a conexão que será utilizada para enviar mensagens">
          <VCardText>
            <VForm ref="formRef">
              <VRow>
                <VCol cols="12">
                  <AppTextField v-model="nameProvider" clearable label="Nome da caixa."
                    placeholder="Insira um nome para caixa de saída" type="text" :hide-spin-buttons="true"
                    class="textfield-demo-icon-slot" :rules="[requiredValidator]">
                  </AppTextField>

                </VCol>

                <VCol cols="12">
                  <div class="d-flex flex-wrap gap-4 justify-end mt-8">
                    <VBtn color="info" variant="tonal" @click="$router.back()">
                      Voltar
                    </VBtn>

                    <VBtn color="primary" @click="createProvider" :loading="creatingLoading">
                      Salvar
                    </VBtn>
                  </div>
                </VCol>
              </VRow>

            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>


  <QrCodeModal v-model="qrcodeModal" :base64="base64" :name="nameProvider" @next="onNext" />
</template>
