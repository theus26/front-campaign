<script setup lang="ts">
import { ref } from 'vue'
import StepFourMessage from './steps/StepFourMessage.vue'
import StepOneInfo from './steps/StepOneInfo.vue'
import StepThreeProviders from './steps/StepThreeProviders.vue'
import StepTwoContacts from './steps/StepTwoContacts.vue'


import { iconsSteps as icons } from '@/@core/useCreateCampaign.const'
import { useCreateCampaign } from '@/composables/Campaign/useCreateCampaign'


const { loading, isCurrentStepValid } = useCreateCampaign()


const currentStep = ref(0)
const snackbar = ref({ visible: false, message: '', color: 'success' })
const iconsSteps = icons


const goNext = () => (currentStep.value++);

const goBack = () => (currentStep.value = Math.max(currentStep.value - 1, 0))
</script>

<template>
  <VCard>
    <VCardText>
      <AppStepper v-model:current-step="currentStep" :items="iconsSteps" :is-active-step-valid="isCurrentStepValid"
        align="center" />
    </VCardText>


    <VDivider />


    <VCardText>
      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <StepOneInfo @next="goNext" />
        </VWindowItem>


        <VWindowItem>
          <StepTwoContacts @next="goNext" @back="goBack" />
        </VWindowItem>


        <VWindowItem>
          <StepThreeProviders @next="goNext" @back="goBack" />
        </VWindowItem>


        <VWindowItem>
          <StepFourMessage @back="goBack" />
        </VWindowItem>


      </VWindow>
    </VCardText>

    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="3000" location="center">
      {{ snackbar.message }}
    </v-snackbar>
  </VCard>
</template>
