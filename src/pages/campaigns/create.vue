<script setup lang="ts">
import type { CampaignDraft } from '@/store/campaign'
import { useCampaignStore } from '@/store/campaign'
import type { CustomInputContent } from '@core/types'
import customWizardAccount from '@images/svg/wizard-account.svg'
import customWizardAddress from '@images/svg/wizard-address.svg'
import customWizardPersonal from '@images/svg/wizard-personal.svg'
import customWizardSocialLink from '@images/svg/wizard-social-link.svg'
import { themeConfig } from '@themeConfig'
import { useToast } from 'vue-toast-notification'
import { VForm } from 'vuetify/components/VForm'
import * as XLSX from 'xlsx'
import MessageComponent from './components/message.vue'

const $toast = useToast();
const campaignStore = useCampaignStore();

const iconsSteps = [
  {
    title: 'Informações da campanha',
    icon: customWizardAccount,
  },
  {
    title: 'Público-alvo',
    icon: customWizardPersonal,
  },
  {
    title: 'Caixa de saída',
    icon: customWizardAddress,
  },
  {
    title: 'Mensagem',
    icon: customWizardSocialLink,
  },
]
const radioContent: CustomInputContent[] = [
  {
    title: 'Única',
    desc: 'Envie mensagens automáticas para seus contatos de forma única.',
    value: 'unica',
  },
  {
    title: 'Recorrente',
    value: 'recorrente',
    desc: 'Envie mensagens automáticas de maneira recorrente para seus contatos.'
  },
]

const typeContacts: CustomInputContent[] = [
  {
    title: 'Adicione os números de forma manual',
    desc: 'Digite os números desejados manualmente para incluir novos contatos no chat.',
    value: 'manual',
  },
  {
    title: ' Importar planilhas',
    value: 'import',
    desc: 'Importe um arquivo em formato XLS, XLSX ou CSV contendo a lista de números.'
  },
]

const currentStep = ref(0)
const isCurrentStepValid = ref(true)
const loading = ref(false)
const refStepOne = ref<VForm>()
const refStepTwo = ref<VForm>()
const refSocialLinkForm = ref<VForm>()
const refAddressForm = ref<VForm>()
const fileInput = ref<HTMLInputElement | null>(null);
const shippingNumbers = ref([] as string[])
const selectedContacts = ref('manual')
const message = ref('')
const nameProvider = ref('')

const breakMessage = ['A cada 5 min - Recomendado', 'A cada 3 min', 'A cada 2 min - Risco de banimento', 'A cada 1 min - Alto risco de banimento']
const recurrencePeriod = ['Diário', 'Semanal', 'Mensal']

const stepOneForm = ref({
  nameCampaign: '',
  typeCampaign: 'unica',
  dataStart: '',
  dataEnd: '',
  intervalRepeat: '',
  messageBreak: '',
  startTime: '',
  endTime: '',
})

const personalForm = ref({
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
})

const socialForm = ref({
  twitter: '',
  facebook: '',
  googlePlus: '',
  linkedIn: '',
})

const addressForm = ref({
  address: '',
  landmark: '',
  city: '',
  pincode: '',
})

const addNumber = () => {
  var number = extractNumbers(message.value);
  if (!number) return;
  shippingNumbers.value.push(number);
  message.value = "";
}

const createProvider = () => {
  console.log('provider criaddo')
}

const validateStepOne = () => {
  refStepOne.value?.validate().then(valid => {
    console.log(stepOneForm.value)
    if (!valid.valid) {
      isCurrentStepValid.value = false
      return
    }
    if (!validateTime(stepOneForm.value.startTime, stepOneForm.value.endTime)) {
      return;
    }
    const campaign = getDetailCampaign(stepOneForm.value);
    campaignStore.setDraft(campaign)
    currentStep.value++;
    isCurrentStepValid.value = true;
  })
}

const validateStepTwo = () => {
  refStepTwo.value?.validate().then(valid => {
    if (valid.valid) {
      campaignStore.setDraft({
        ...campaignStore as unknown as CampaignDraft,
        numbers: shippingNumbers.value
      })
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const validateAddressForm = () => {
  refAddressForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const validateSocialLinkForm = () => {
  refSocialLinkForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const getDetailCampaign = (obj: any): CampaignDraft => {
  return {
    campaignId: null,
    name: obj.nameCampaign,
    numbers: [],
    messages: [],
    startCampaign: convertStringForDate(obj.dataStart),
    endCampaign: convertStringForDate(obj.dataEnd),
    startTime: obj.startTime,
    timeEnd: obj.endTime,
    recurrence: obj.typeCampaign,
    intervalMessage: validateIntervalMessage(obj.messageBreak),
    intervalRepeat: validateIntervalRepeat(obj.intervalRepeat),
    providerId: null,
    accountId: null,
    status: 'Draft',
  }
}

const convertStringForDate = (value: string) => {
  if (!value) {
    return
  }
  const date = new Date(value);
  return date.toISOString()
}

const validateIntervalRepeat = (value: string) => {
  if (value == "Diário") return 1
  if (value == "Semanal") return 7
  if (value == "Mensal") return 30
}

const validateIntervalMessage = (value: string) => {
  const interval = getInterval(value);
  if (interval === 5) return "00:05"
  if (interval === 3) return "00:03"
  if (interval === 2) return "00:02"
  if (interval === 1) return "00:01"
}

const getInterval = (value: string) => {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

const validateTime = (startTime: string, endTime: string) => {
  const time1 = new Date(`1970-01-01T${startTime}:00Z`);
  const time2 = new Date(`1970-01-01T${endTime}:00Z`);
  if (endTime < startTime) {
    $toast.error('Horário de envio final não pode ser menor que inicial!!');
    return false
  }
  const differenceInMinutes = Math.abs((time2.getTime() - time1.getTime()) / 1000 / 60);
  if (differenceInMinutes < 60) {
    $toast.error('Horário do início da campanha deve ser pelo menos 1 hora antes do fim da campanha!');
    return false
  }
  return true
}

const extractNumbers = (inputString: string) => {
  const rawNumber = String(inputString).replace(/[^0-9]/g, "");
  if (
    rawNumber.length < 10 ||
    (rawNumber.length > 11 && !rawNumber.startsWith("55"))
  ) {
    $toast.error("Número inválido: tamanho incorreto.");
    return ""
  }
  const completeNumber = rawNumber.startsWith("55")
    ? rawNumber
    : `55${rawNumber}`;
  return completeNumber;
};

const deleteNumber = (numero: string) => {
  shippingNumbers.value = shippingNumbers.value.filter(
    (item) => item !== numero
  );
};

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headerRow: any = jsonData[0];
    const columnIndex = headerRow.findIndex((header: any) => header === "numeros");

    if (columnIndex !== -1) {
      const numbers = jsonData.slice(1).map((row: any) => row[columnIndex]).filter((item) => item !== undefined);
      const formattedNumbers = numbers.map((item) => extractNumbers(item));
      const validNumbers = formattedNumbers.filter((number) => number !== "");
      shippingNumbers.value.push(...validNumbers);
    } else {
      $toast.error('Coluna NUMERO não encontrada.');
    }

    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  reader.readAsArrayBuffer(file);
};


watch(selectedContacts, () => {
  shippingNumbers.value = []
});

</script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper v-model:current-step="currentStep" :items="iconsSteps" :is-active-step-valid="isCurrentStepValid"
        align="center" />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->

      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <VForm ref="refStepOne" @submit.prevent="validateStepOne">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Informações da campanha
                </h6>
                <p class="mb-0">
                  Preencha os dados essenciais, escolha o tipo, defina a recorrência, agende
                  os disparos e estabeleça o intervalo de tempo.
                </p>
              </VCol>

              <VCol cols="12">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;" text="TÍtulo da campanha *" />
                <AppTextField v-model="stepOneForm.nameCampaign" placeholder="" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;" text="Tipo da campanha" />
                <CustomRadios v-model:selected-radio="stepOneForm.typeCampaign" :radio-content="radioContent"
                  :grid-column="{ sm: '6', cols: '12' }" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;" text="Início da campanha *" />
                <AppDateTimePicker v-model="stepOneForm.dataStart" placeholder="DD/MM/AAAA HH:MM"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12" md="6" v-if="stepOneForm.typeCampaign == 'recorrente'">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;" text="Fim da campanha *" />
                <AppDateTimePicker v-model="stepOneForm.dataEnd" placeholder="DD/MM/AAAA HH:MM"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;"
                  text=" Tempo de disparo das mensagens *" />
                <AppSelect :items="breakMessage" v-model="stepOneForm.messageBreak"
                  placeholder="Escolha o tempo de disparos das mensagens" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12" md="6" v-if="stepOneForm.typeCampaign == 'recorrente'">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;"
                  text=" Período de recorrência *" />
                <AppSelect :items="recurrencePeriod" placeholder="Selecione" v-model="stepOneForm.intervalRepeat" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;" text="Horário de envio *" />
                <AppDateTimePicker v-model="stepOneForm.startTime" placeholder="Selecione o horario"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12" md="6">
                <VLabel class="mb-1 text-body-2 text-wrap " style="line-height: 15px;" text="" />
                <AppDateTimePicker v-model="stepOneForm.endTime" placeholder="Selecione o horario"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }" :rules="[requiredValidator]" />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-end mt-8">
                  <VBtn color="secondary" variant="tonal" disabled>
                    Salvar rascunho
                  </VBtn>

                  <VBtn type="submit">
                    Próximo
                    <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm ref="refStepTwo" @submit.prevent="validateStepTwo">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Público-alvo
                </h6>
                <p class="mb-0">
                  Defina a lista de contatos para onde serão enviadas as mensagens da
                  campanha.
                </p>
              </VCol>

              <VCol cols="12">
                <CustomRadios v-model:selected-radio="selectedContacts" :radio-content="typeContacts"
                  :grid-column="{ sm: '6', cols: '12' }" />
              </VCol>

              <VCol cols="12" v-if="selectedContacts == 'manual'">
                <AppTextField v-model="message" clearable label="Adicione os números." placeholder="Números para envio"
                  type="number" :hide-spin-buttons="true" class="textfield-demo-icon-slot">
                  <!-- AppendInner -->
                  <template #append-inner>
                    <VFadeTransition leave-absolute>
                      <VProgressCircular v-if="loading" color="primary" width="3" size="24" indeterminate />

                      <VNodeRenderer v-else class="text-2xl" :nodes="themeConfig.app.logo" />
                    </VFadeTransition>
                  </template>
                  <!-- Append -->
                  <template #append>
                    <VBtn :icon="$vuetify.display.smAndDown" :disabled="message.length < 12" @click="addNumber">
                      <span v-if="$vuetify.display.mdAndUp" class="ms-3">Adicionar</span>
                    </VBtn>
                  </template>
                </AppTextField>

                <VRow class="d-flex ga-2">
                  <VCol cols="12" class="mt-4 mr-1">
                    <VLabel v-if="shippingNumbers.length > 0" class="mb-1 text-body-2 text-wrap "
                      style="line-height: 10px;" text="Números adicionados" />
                  </VCol>
                  <div v-for="item in shippingNumbers" :key="item" class="mb-1">
                    <VChip color="blue" text-color="white" class="ml-3" label>
                      {{ item }}
                      <VIcon @click="deleteNumber(item)" size="x-small" icon="tabler-x" />
                    </VChip>
                  </div>
                </VRow>
              </VCol>

              <VCol cols="12" v-if="selectedContacts == 'import'">
                <VFileInput label=" Clique aqui para escolher um arquivo" density="compact" ref="fileInput"
                  @change="handleFileUpload" />
                <VLabel class="mt-5 text-body-2 text-wrap " style="line-height: 15px;" text="Obs: Permitido arquivos .csv ou .xlsx(Exel) com a coluna
              'numeros'." />

                <VRow class="d-flex ga-2">
                  <VCol cols="12" class="mt-4 mr-1">
                    <VLabel v-if="shippingNumbers.length > 0" class="mb-1 text-body-2 text-wrap "
                      style="line-height: 10px;" text="Números adicionados" />
                  </VCol>
                  <div v-for="item in shippingNumbers" :key="item" class="mb-1">
                    <VChip color="blue" text-color="white" class="ml-1" label>
                      {{ item }}
                      <VIcon @click="deleteNumber(item)" size="x-small" icon="tabler-x" />
                    </VChip>
                  </div>
                </VRow>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Voltar
                  </VBtn>

                  <div class="d-flex gap-4">
                    <VBtn color="secondary" variant="tonal">
                      Salvar rascunho
                    </VBtn>

                    <VBtn type="submit">
                      Próximo
                      <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm ref="refAddressForm" @submit.prevent="validateAddressForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Caixa de saída
                </h6>
                <p class="mb-0">
                  Escolha a caixa de saída que será utilizada para enviar mensagens
                </p>
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="nameProvider" clearable label="Nome da caixa."
                  placeholder="Insira um nome para caixa de saída" type="text" :hide-spin-buttons="true"
                  class="textfield-demo-icon-slot" :rules="[requiredValidator]">
                  <!-- AppendInner -->
                  <template #append-inner>
                    <VFadeTransition leave-absolute>
                      <VProgressCircular v-if="loading" color="primary" width="3" size="24" indeterminate />

                      <VNodeRenderer v-else class="text-2xl" :nodes="themeConfig.app.logo" />
                    </VFadeTransition>
                  </template>
                  <!-- Append -->
                  <template #append>
                    <VBtn :icon="$vuetify.display.smAndDown" @click="createProvider">
                      <span v-if="$vuetify.display.mdAndUp" class="ms-3">Criar caixa</span>
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>



              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Voltar
                  </VBtn>

                  <div class="d-flex gap-4">
                    <VBtn color="secondary" variant="tonal">
                      Salvar rascunho
                    </VBtn>

                    <VBtn type="submit">
                      Próximo
                      <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm ref="refSocialLinkForm" @submit.prevent="validateSocialLinkForm">
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6 font-weight-medium">
                  Mensagem
                </h6>
                <p class="mb-0">
                  Escreva a mensagem que será enviada na campanha. Pode adicionar arquivos,
                  emojis, entre outras personalizações, semelhante as mensagens do WhatsApp.
                </p>
              </VCol>

              <VCol cols="12">
                <MessageComponent />
              </VCol>


              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                    Voltar
                  </VBtn>

                  <div class="d-flex gap-4">
                    <VBtn color="secondary" variant="tonal">
                      Salvar rascunho
                    </VBtn>

                    <VBtn type="submit" :disabled="campaignStore.getDraft.messages.length === 0">
                      Criar campanha
                      <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
                    </VBtn>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <div class="text-base">
            <h6 class="text-base font-weight-medium mb-2">
              Account
            </h6>

            <p class="mb-1">
              {{ stepOneForm.nameCampaign }}
            </p>
            <p class="mb-1">
              {{ stepOneForm.nameCampaign }}
            </p>

            <VDivider class="my-4" />

            <h6 class="text-base font-weight-medium mb-2">
              Personal Info
            </h6>

            <p class="mb-1">
              {{ personalForm.firstName }}
            </p>
            <p class="mb-1">
              {{ personalForm.lastName }}
            </p>
            <p class="mb-1">
              {{ personalForm.country }}
            </p>
            <p class="mb-1">
              {{ personalForm.language }}
            </p>

            <VDivider class="my-4" />

            <h6 class="text-base font-weight-medium mb-2">
              Address
            </h6>

            <p class="mb-1">
              {{ addressForm.address }}
            </p>
            <p class="mb-1">
              {{ addressForm.landmark }}
            </p>
            <p class="mb-1">
              {{ addressForm.pincode }}
            </p>
            <p class="mb-1">
              {{ addressForm.city }}
            </p>

            <VDivider class="my-4" />

            <h6 class="text-base font-weight-medium mb-2">
              Social Links
            </h6>

            <p class="mb-1">
              {{ socialForm.twitter }}
            </p>
            <p class="mb-1">
              {{ socialForm.facebook }}
            </p>
            <p class="mb-1">
              {{ socialForm.googlePlus }}
            </p>
            <p class="mb-1">
              {{ socialForm.linkedIn }}
            </p>
          </div>
          <VCol cols="12">
            <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
              <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="currentStep--">
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                Voltar
              </VBtn>

              <VBtn color="success" @click="console.log('Form Submitted')">
                submit
              </VBtn>
            </div>
          </VCol>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
