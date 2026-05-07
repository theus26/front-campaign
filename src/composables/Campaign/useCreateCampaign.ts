import {
  ICampaign,
  IUpdateCampaign,
} from "@/@core/services/interfaces/campaign/ICampaignService";
import { router } from "@/plugins/1.router";
import useCampaign from "@/services/campaign/useCampaign";
import { useCampaignStore } from "@/store/campaign";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components";
import * as XLSX from "xlsx";

export function useCreateCampaign() {
  const $toast = useToast();
  const campaignStore = useCampaignStore();

  const route = useRoute();
  const isEdit = computed(() => !!route.params.id);

  const loading = ref(false);
  const isCurrentStepValid = ref(true);
  const currentStep = ref(0);

  const stepOneForm = reactive({
    nameCampaign: "",
    typeCampaign: "",
    dataStart: null,
    dataEnd: null,
    messageBreak: null,
    intervalRepeat: null,
    startTime: "",
    endTime: "",
  });
  const formRef = ref<VForm | null>(null);
  const campaign = ref<ICampaign | null>(null);
  const fileName = ref("");
  const shippingNumbers = ref<string[]>([]);
  const selectedContacts = ref<"import" | "contatos" | "grupos">("import");
  const message = ref("");
  const showSuccessDialogDesconectar = ref(false);
  const showSuccessDialogExcluir = ref(false);
  const showCancelDialog = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const convertStringForDate = (value?: string | null) => {
    if (!value) return undefined;
    const d = new Date(value);
    return d.toISOString();
  };

  const validateTime = (startTime: string, endTime: string) => {
    const time1 = new Date(`1970-01-01T${startTime}:00Z`);
    const time2 = new Date(`1970-01-01T${endTime}:00Z`);
    if (endTime < startTime) {
      $toast.error("Horário de envio final não pode ser menor que inicial!!");
      return false;
    }
    const differenceInMinutes = Math.abs(
      (time2.getTime() - time1.getTime()) / 1000 / 60,
    );
    if (differenceInMinutes < 60) {
      $toast.error(
        "Horário do início da campanha deve ser pelo menos 1 hora antes do fim da campanha!",
      );
      return false;
    }
    return true;
  };

  const getDetailCampaign = (obj: any) => {
    return {
      campaignId: null,
      name: obj.nameCampaign,
      numbers: obj.numbers || [],

      startCampaign: convertStringForDate(obj.dataStart),
      endCampaign: convertStringForDate(obj.dataEnd),
      startTime: obj.startTime,
      timeEnd: obj.endTime,
      recurrence: obj.typeCampaign,
      intervalMessage: obj.messageBreak,
      intervalRepeat: obj.intervalRepeat,
      status: "Draft",
    } as any;
  };

  const validateStepOne = async (item: any) => {
    await item.validate().then((valid: any) => {
      if (!valid) {
        isCurrentStepValid.value = false;
        return;
      }
      if (!validateTime(stepOneForm.startTime, stepOneForm.endTime)) {
        isCurrentStepValid.value = false;
        return;
      }

      const campaign = getDetailCampaign(stepOneForm);

      campaignStore.setDraft(campaign);
      currentStep.value++;
      isCurrentStepValid.value = true;
    });
  };

  const validateStepTwo = async (item: any) => {
    await item?.validate().then((valid: any) => {
      if (valid.valid) {
        campaignStore.setDraft({
          numbers: shippingNumbers.value,
        });
        currentStep.value++;
        isCurrentStepValid.value = true;
      } else {
        isCurrentStepValid.value = false;
      }
    });
  };

  const validateStepThree = async (item: any) => {
    await item?.validate().then((valid: any) => {
      if (valid.valid) {
        currentStep.value++;

        isCurrentStepValid.value = true;
      } else {
        isCurrentStepValid.value = false;
      }
    });
  };

  const extractNumbers = (inputString: string) => {
    const rawNumber = String(inputString).replace(/[^0-9]/g, "");
    if (
      rawNumber.length < 10 ||
      (rawNumber.length > 11 && !rawNumber.startsWith("55"))
    ) {
      $toast.error("Número inválido: tamanho incorreto.");
      return "";
    }
    const completeNumber = rawNumber.startsWith("55")
      ? rawNumber
      : `55${rawNumber}`;
    return completeNumber;
  };

  const addNumber = () => {
    const number = extractNumbers(message.value);
    if (!number) return;
    shippingNumbers.value.push(number);
    message.value = "";
  };

  const deleteNumber = (numero: string) => {
    shippingNumbers.value = shippingNumbers.value.filter(
      (item) => item !== numero,
    );
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0] as File | undefined;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerRow: any = jsonData[0];
      const columnIndex = headerRow.findIndex((header: any) => {
        if (!header) return false;
        const headerStr = String(header).toLowerCase();
        return (
          headerStr === "numeros" ||
          headerStr === "numero" ||
          headerStr === "números"
        );
      });

      if (columnIndex !== -1) {
        const numbers = jsonData
          .slice(1)
          .map((row: any) => row[columnIndex])
          .filter((item) => item !== undefined && item !== null);

        const formattedNumbers = numbers.map((item: any) =>
          extractNumbers(String(item)),
        );
        const validNumbers = formattedNumbers.filter((n) => n !== "");
        shippingNumbers.value.push(...validNumbers);
        $toast.success(`Importados ${validNumbers.length} números.`);
      } else {
        $toast.error("Coluna 'numeros' não encontrada.");
      }

      if (fileInput.value) {
        try {
          // limpar input file (HTML)
          (fileInput.value as any).value = "";
        } catch {
          /* noop */
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCancel = () => {
    showCancelDialog.value = true;
  };

  const updatePayload = (): IUpdateCampaign => {
    return {
      ...campaign.value,

      name: stepOneForm.nameCampaign ?? campaign.value?.name,
      startCampaign: stepOneForm.dataStart
        ? convertStringForDate(stepOneForm.dataStart)
        : campaign.value?.startCampaign,

      endCampaign: stepOneForm.dataEnd
        ? convertStringForDate(stepOneForm.dataEnd)
        : campaign.value?.endCampaign,

      startTime: stepOneForm.startTime ?? campaign.value?.startTime,
      timeEnd: stepOneForm.endTime ?? campaign.value?.timeEnd,
      recurrence: stepOneForm.typeCampaign == "unica" ? "Unique" : "Recurrent",

      intervalMessage:
        stepOneForm.messageBreak ?? campaign.value?.intervalMessage,

      intervalRepeat:
        stepOneForm.intervalRepeat ?? campaign.value?.intervalRepeat,

      numbers: shippingNumbers.value ?? campaign.value?.numbers,
      status: "Draft",
      content: campaignStore.getDraft.messages ?? campaign.value?.content,
      providerId:
        campaignStore.getDraft.providerId ?? campaign.value?.providerId,
    };
  };

  const updateCampaign = async () => {
    loading.value = true;
    try {
      const campaignId = String(route.params.id);
      const payload = updatePayload();

      await useCampaign.updateCampaign(campaignId, payload);
      $toast.success("Campanha atualizada com sucesso!");
      router.push("/campaigns/list");
    } catch (error) {
      $toast.error("Erro ao atualizar campanha. Tente novamente.");
    } finally {
      loading.value = false;
    }
  };

  const fillCampaign = (data: any) => {
    stepOneForm.nameCampaign = data.name;
    stepOneForm.typeCampaign =
      data.recurrence === "Unique" ? "unica" : "recorrente";
    stepOneForm.dataStart = data.startCampaign;
    stepOneForm.dataEnd = data.endCampaign;
    stepOneForm.messageBreak = data.intervalMessage;
    stepOneForm.intervalRepeat = data.intervalRepeat;
    stepOneForm.startTime = data.startTime;
    stepOneForm.endTime = data.timeEnd;
    // STEP TWO
    shippingNumbers.value = data.numbers || [];

    // STEP THREE -
    campaignStore.setDraft({
      providerId: data.providerId,
    });

    campaignStore.setDraft({
      messages: data.content || [],
    });
  };

  watch(
    stepOneForm,
    (newVal) => {
      const campaign = getDetailCampaign(newVal);
      campaignStore.setDraft(campaign);
    },
    { deep: true, immediate: true },
  );

  watch(
    shippingNumbers,
    (newVal) => {
      campaignStore.setDraft({ numbers: newVal });
    },
    { deep: true },
  );

  watch(selectedContacts, (newVal) => {
    campaignStore.setDraft({ recurrence: newVal });
  });

  onMounted(async () => {
    if (isEdit.value) {
      campaign.value = await useCampaign.getCampaignById(
        String(route.params.id),
      );
      fillCampaign(campaign.value);
    }
  });

  return {
    // UI
    loading,
    fileName,
    isCurrentStepValid,
    currentStep,
    validateStepOne,
    validateStepTwo,
    validateStepThree,

    // forms
    stepOneForm,
    formRef,
    isEdit,
    // step2
    shippingNumbers,
    selectedContacts,
    message,
    addNumber,
    deleteNumber,
    fileInput,
    handleFileUpload,
    updateCampaign,
    showSuccessDialogDesconectar,
    showSuccessDialogExcluir,
    showCancelDialog,

    handleCancel,
    // store
    campaignStore,
  };
}
