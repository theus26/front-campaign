<script setup lang="ts">
import { ICreateCampaign } from "@/@core/services/interfaces/campaign/ICampaignService";
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import useCampaignService from '@/services/campaign/useCampaign';
import { CampaignDraft } from "@/store/campaign";
import { computed, ref } from 'vue';
import { useToast } from "vue-toast-notification";
import MessageComponent from '../components/message.vue';

const { campaignStore } = useCreateCampaign()
const toast = useToast();
const store = campaignStore
const formRef = ref()
const loading = ref(false)

const canCreate = computed(() => {
  const draft = store.getDraft ?? store.campaignDraft ?? null
  const messages = (draft && (draft.messages ?? draft?.messages)) ?? []
  return Array.isArray(messages) && messages.length > 0
})

const buildPayload = (payload: CampaignDraft): ICreateCampaign => {

  return {
    name: payload.name ?? '',
    content: payload.messages ?? [],
    numbers: payload.numbers ?? [],
    intervalRepeat: payload.intervalRepeat ?? undefined,
    recurrence: payload.recurrence?.toLowerCase() == "unica" ? "Unique" : "Recurrent",
    startTime: payload.startTime,
    timeEnd: payload.timeEnd,
    status: 'InProgress',
    intervalMessage: payload.intervalMessage ?? undefined,
    startCampaign: payload.startCampaign,
    endCampaign: payload.endCampaign,
    accountId: payload.accountId ?? undefined,
    providerId: payload.providerId ?? undefined,
  }
}


const onCreate = async () => {
  loading.value = true

  const draft = store.getDraft ?? store.campaignDraft ?? null
  console.log('Creating campaign with draft:', draft)
  // TODO: call API and show toast/snackbar on success/failure
  try {
    const payload = buildPayload(draft)
    console.log('Constructed payload for campaign creation:', payload)
    await useCampaignService.createCampaign(payload)
    toast.success('Campanha criada com sucesso!')
  }
  catch (error) {
    console.error('Error creating campaign:', error)
    toast.error('Erro ao criar campanha. Por favor, tente novamente.')
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  console.log('store', store.getDraft);

})
</script>

<template>
  <VForm ref="formRef" @submit.prevent="onCreate">
    <VRow>
      <VCol cols="12">
        <h6 class="text-h6 font-weight-medium">Mensagem</h6>
        <p class="mb-0">
          Escreva a mensagem que será enviada na campanha. Pode adicionar arquivos, emojis, entre outras
          personalizações,
          semelhante as mensagens do WhatsApp.
        </p>
      </VCol>

      <VCol cols="12">
        <!-- Reuse your existing MessageComponent -->
        <MessageComponent />
      </VCol>

      <VCol cols="12">
        <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
          <VBtn color="secondary" variant="tonal" @click="$emit('back')">
            <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
            Voltar
          </VBtn>

          <div class="d-flex gap-4">
            <VBtn color="secondary" variant="tonal">Salvar rascunho</VBtn>

            <VBtn type="submit" :disabled="!canCreate" :loading="loading">
              Criar campanha
              <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
