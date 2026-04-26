import { useCampaignStore } from "@/store/campaign";
import { useToast } from "vue-toast-notification";
import { VForm } from "vuetify/components";
import * as XLSX from "xlsx";

export function useCreateCampaign() {
  const $toast = useToast();
  const campaignStore = useCampaignStore();
  const toast = useToast();
  const store = campaignStore;
  const loadingDraft = ref(false);
  const loading = ref(false);
  const isCurrentStepValid = ref(true);

  const currentStep = ref(0);

  const stepOneForm = ref({
    nameCampaign: "",
    typeCampaign: "unica",
    dataStart: "",
    dataEnd: "",
    intervalRepeat: "",
    messageBreak: "",
    startTime: "",
    endTime: "",
  });
  const formRef = ref<VForm | null>(null);

  const fileName = ref("");
  const shippingNumbers = ref<string[]>([]);
  const selectedContacts = ref<"manual" | "import">("manual");
  const message = ref("");
  const showSuccessDialogDesconectar = ref(false);
  const showSuccessDialogExcluir = ref(false);
  const showCancelDialog = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);

  const getInterval = (value: string | undefined) => {
    if (!value) return null;
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const validateIntervalMessage = (value?: string) => {
    const interval = getInterval(value ?? "");
    if (interval === 5) return "00:05";
    if (interval === 3) return "00:03";
    if (interval === 2) return "00:02";
    if (interval === 1) return "00:01";
    return null;
  };

  const convertStringForDate = (value?: string) => {
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
    const intervalMsg = validateIntervalMessage(obj.messageBreak);
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
      intervalMessage: intervalMsg,
      intervalRepeat: obj.intervalRepeat
        ? validateIntervalRepeat(obj.intervalRepeat)
        : undefined,
      providerId: null,
      status: "Draft",
    } as any;
  };

  const validateIntervalRepeat = (value?: string) => {
    if (!value) return undefined;
    if (value === "Diário") return 1;
    if (value === "Semanal") return 7;
    if (value === "Mensal") return 30;
    return undefined;
  };

  const validateStepOne = async (item: any) => {
    await item.validate().then((valid: any) => {
      if (!valid) {
        isCurrentStepValid.value = false;
        return;
      }
      if (
        !validateTime(stepOneForm.value.startTime, stepOneForm.value.endTime)
      ) {
        isCurrentStepValid.value = false;
        return;
      }

      const campaign = getDetailCampaign(stepOneForm.value);
      console.log("campaign", campaign);

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
    // apenas fechar/registrar
    showCancelDialog.value = true;
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
    // step2
    shippingNumbers,
    selectedContacts,
    message,
    addNumber,
    deleteNumber,
    fileInput,
    handleFileUpload,
    showSuccessDialogDesconectar,
    showSuccessDialogExcluir,
    showCancelDialog,

    handleCancel,
    // store
    campaignStore,
  };
}
