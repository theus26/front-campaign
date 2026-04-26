<script setup lang="ts">
import { ICreateCampaign } from "@/@core/services/interfaces/campaign/ICampaignService";
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { useCreateDraftCampaign } from "@/composables/Campaign/useCreateDraftCampaign";
import { router } from "@/plugins/1.router";
import useCampaignService from '@/services/campaign/useCampaign';
import { CampaignDraft } from "@/store/campaign";
import { computed, ref } from 'vue';
import { useToast } from "vue-toast-notification";
import MessageComponent from '../components/message.vue';

const { createDraft, loadingDraft } = useCreateDraftCampaign()

const { campaignStore } = useCreateCampaign()
const toast = useToast();
const store = campaignStore
const loading = ref(false)

const canCreate = computed(() => validation.value.valid)

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
    providerId: payload.providerId ?? undefined,
  }
}

const validation = computed(() => {
  const draft = store.getDraft ?? store.campaignDraft ?? null
  if (!draft) return { valid: false, errors: ['Draft não encontrado'] }

  const errors: string[] = []

  // Nome
  if (!draft.name || !draft.name.trim()) {
    errors.push('Informe o nome da campanha')
  }

  // Números
  if (!Array.isArray(draft.numbers) || draft.numbers.length === 0) {
    errors.push('Adicione pelo menos um número')
  }

  // Mensagens
  if (!Array.isArray(draft.messages) || draft.messages.length === 0) {
    errors.push('Adicione pelo menos uma mensagem')
  }

  // Horários
  if (!draft.startTime) {
    errors.push('Informe o horário de início')
  }

  if (!draft.timeEnd) {
    errors.push('Informe o horário de término')
  }

  // Provider / Account
  if (!draft.providerId) {
    errors.push('Selecione uma caixa de saida')
  }

  // Recorrência
  if (draft.recurrence !== 'unica' && !draft.intervalRepeat) {
    errors.push('Informe o intervalo de repetição')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
})


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
    router.push({ name: 'campaigns-list' })
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
            <VBtn color="secondary" variant="tonal" @click="createDraft" :loading="loadingDraft">
              Salvar rascunho
            </VBtn>

            <VTooltip :disabled="canCreate">
              <template #activator="{ props }">
                <div v-bind="props">
                  <VBtn type="submit" :disabled="!canCreate" :loading="loading">
                    Criar campanha
                  </VBtn>
                </div>
              </template>

              <div v-if="validation.errors.length">
                <div v-for="(err, i) in validation.errors" :key="i">
                  • {{ err }}
                </div>
              </div>
            </VTooltip>
          </div>
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
