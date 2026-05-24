<script setup lang="ts">
import { breakMessage, radioContent, recurrencePeriod } from '@/@core/useCreateCampaign.const';
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign';
import { useCreateDraftCampaign } from "@/composables/Campaign/useCreateDraftCampaign";
import { VForm } from 'vuetify/components';

const emit = defineEmits(['next', 'back']);
const { stepOneForm, formRef, isEdit, loading, validateStepOne, updateCampaign } = useCreateCampaign()
const { createDraft, loadingDraft } = useCreateDraftCampaign()

const onNext = async () => {
  await validateStepOne(formRef.value)
  emit('next');
}

</script>

<template>
  <VForm ref="formRef" @submit.prevent="onNext">
    <VRow>
      <VCol cols="12">
        <h6 class="text-h6 font-weight-medium"> {{ isEdit ? 'Atualizar' : '' }} Informações da campanha</h6>
        <p class="mb-0">Preencha os dados essenciais, escolha o tipo, defina a recorrência, agende os disparos e
          estabeleça o intervalo de tempo.</p>
      </VCol>


      <VCol cols="12">
        <VLabel class="mb-1 text-body-2" text="Título da campanha *" />
        <AppTextField v-model="stepOneForm.nameCampaign" />
      </VCol>


      <VCol cols="12">
        <VLabel class="mb-1 text-body-2" text="Tipo da campanha" />
        <CustomRadios v-model:selected-radio="stepOneForm.typeCampaign" :radio-content="radioContent"
          :grid-column="{ sm: '6', cols: '12' }" />
      </VCol>


      <VCol cols="12" md="6">
        <VLabel class="mb-1 text-body-2" text="Início da campanha *" />
        <AppDateTimePicker v-model="stepOneForm.dataStart" prepend-inner-icon="tabler-calendar" />
      </VCol>


      <VCol cols="12" md="6" v-if="stepOneForm.typeCampaign === 'recorrente'">
        <VLabel class="mb-1 text-body-2" text="Fim da campanha *" />
        <AppDateTimePicker v-model="stepOneForm.dataEnd" prepend-inner-icon="tabler-calendar" />
      </VCol>


      <VCol cols="12" md="6">
        <VLabel class="mb-1 text-body-2" text="Tempo de disparo das mensagens *" />
        <AppSelect :items="breakMessage" item-title="label" item-value="value" v-model="stepOneForm.messageBreak" />
      </VCol>


      <VCol cols="12" md="6" v-if="stepOneForm.typeCampaign === 'recorrente'">
        <VLabel class="mb-1 text-body-2" text="Período de recorrência *" />
        <AppSelect :items="recurrencePeriod" item-title="label" item-value="value"
          v-model="stepOneForm.intervalRepeat" />
      </VCol>


      <VCol cols="12" md="6">
        <VLabel class="mb-1 text-body-2" text="Horário de envio *" />
        <AppDateTimePicker v-model="stepOneForm.startTime"
          :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i', altFormat: 'H:i' }"
          prepend-inner-icon="tabler-clock" />
      </VCol>


      <VCol cols="12" md="6">
        <VLabel class="mb-1 text-body-2" text="Horário de término *" />
        <AppDateTimePicker v-model="stepOneForm.endTime"
          :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i', altFormat: 'H:i' }"
          prepend-inner-icon="tabler-clock" />

      </VCol>


    </VRow>


    <div class="d-flex justify-end align-center mt-8 flex-wrap gap-4">

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
