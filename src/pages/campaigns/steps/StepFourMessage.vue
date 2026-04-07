<script setup lang="ts">
//import useCampaign from "@/services/campaign/useCampaign";
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign'
import { computed, ref } from 'vue'
import MessageComponent from '../components/message.vue'

const { campaignStore } = useCreateCampaign()

// If you use the Pinia store created earlier:
const store = campaignStore // alias

const formRef = ref()

// canCreate: at least one message present in draft
const canCreate = computed(() => {
  const draft = store.getDraft ?? store.campaignDraft ?? null
  // Support different shapes: try common access
  const messages = (draft && (draft.messages ?? draft?.messages)) ?? []
  console.log('messages', messages);

  return Array.isArray(messages) && messages.length > 0
})

const onCreate = async () => {
  // Here you should call your API to create the campaign OR trigger store action.
  // Example placeholder:
  const draft = store.getDraft ?? store.campaignDraft ?? null
  console.log('Creating campaign with draft:', draft)
  // TODO: call API and show toast/snackbar on success/failure

  console.log(draft);



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

            <VBtn type="submit" :disabled="!canCreate">
              Criar campanha
              <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
            </VBtn>
          </div>
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>
