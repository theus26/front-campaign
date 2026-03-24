import type { IProviderGeneric } from "@/@core/services/interfaces/campaign/IProviderService";
import useProvider from "@/services/provider/useProvider";
import { CampaignDraft, useCampaignStore } from "@/store/campaign";
import { onMounted, onUnmounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import * as XLSX from "xlsx";

// NOTE: ajuste imports caso seus paths sejam diferentes

export function useCreateCampaign() {
  const $toast = useToast();
  const campaignStore = useCampaignStore();

  // UI / controle
  const loading = ref(false);
  const isCurrentStepValid = ref(true);

  // Step control (mantido aqui para conveniência)
  const currentStep = ref(0);

  // Step 1 form (mantive o mesmo shape do seu código original)
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

  // outros forms simples usados no template
  const personalForm = ref({
    firstName: "",
    lastName: "",
    country: undefined,
    language: undefined,
  });

  const socialForm = ref({
    twitter: "",
    facebook: "",
    googlePlus: "",
    linkedIn: "",
  });

  const addressForm = ref({
    address: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  // Step 2 — contatos
  const shippingNumbers = ref<string[]>([]);
  const selectedContacts = ref<"manual" | "import">("manual");
  const message = ref("");

  // Step 3 — providers
  const provider = ref<IProviderGeneric[]>([]);
  const pro = ref<IProviderGeneric[]>([]); // se você usa em outro lugar
  const img = ref("");
  const nameProvider = ref("");
  const searchQuery = ref("");
  const selectedRows = ref<IProviderGeneric[]>([]);

  // dialogs
  const reconectarDialog = ref(false);
  const conectarDialog = ref(false);
  const editarProviderDialog = ref(false);
  const excluirProviderDialog = ref(false);
  const desconectarDialog = ref(false);
  const addProviderDialog = ref(false);
  const showSuccessDialogDesconectar = ref(false);
  const showSuccessDialogExcluir = ref(false);
  const showCancelDialog = ref(false);

  // refs para VForm / inputs (no script do componente original)
  const refStepOne = ref<any>(null);
  const refStepTwo = ref<any>(null);
  const refSocialLinkForm = ref<any>(null);
  const refAddressForm = ref<any>(null);
  const fileInput = ref<HTMLInputElement | null>(null);

  // datatable / paginação
  const itemsPerPage = ref(10);
  const page = ref(1);
  const totalProviders = ref(0);

  // QR management
  let qrCodeInterval: ReturnType<typeof setInterval> | null = null;
  let qrCodeTimeout: ReturnType<typeof setTimeout> | null = null;

  // constantes / opções
  const breakMessage = [
    "A cada 5 min - Recomendado",
    "A cada 3 min",
    "A cada 2 min - Risco de banimento",
    "A cada 1 min - Alto risco de banimento",
  ];
  const recurrencePeriod = ["Diário", "Semanal", "Mensal"];

  // Helpers
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

  // ---------- Validation functions used by template ----------
  const validateTime = (startTime: string, endTime: string) => {
    const time1 = new Date(`1970-01-01T${startTime}:00Z`);
    const time2 = new Date(`1970-01-01T${endTime}:00Z`);
    if (endTime < startTime) {
      $toast.error("Horário de envio final não pode ser menor que inicial!!");
      return false;
    }
    const differenceInMinutes = Math.abs(
      (time2.getTime() - time1.getTime()) / 1000 / 60
    );
    if (differenceInMinutes < 60) {
      $toast.error(
        "Horário do início da campanha deve ser pelo menos 1 hora antes do fim da campanha!"
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
      accountId: null,
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

  // Validate step functions (used in your template)
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
    console.log(item);

    await item?.validate().then((valid: any) => {
      if (valid.valid) {
        console.log("aqui");

        campaignStore.setDraft({
          ...(campaignStore as unknown as CampaignDraft),
          numbers: shippingNumbers.value,
        });
        currentStep.value++;
        isCurrentStepValid.value = true;
        console.log(shippingNumbers.value);

        console.log(campaignStore.getDraft);
      } else {
        isCurrentStepValid.value = false;
      }
    });
  };

  const validateStepThree = async (item: any) => {
    await item?.validate().then((valid: any) => {
      if (valid.valid) {
        console.log(selectedRows.value);
        currentStep.value++;
        isCurrentStepValid.value = true;
      } else {
        isCurrentStepValid.value = false;
      }
    });
  };

  const validateSocialLinkForm = async () => {
    await refSocialLinkForm.value?.validate().then((valid: any) => {
      if (valid.valid) {
        currentStep.value++;
        isCurrentStepValid.value = true;
      } else {
        isCurrentStepValid.value = false;
      }
    });
  };

  // ---------- Numbers management ----------
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
    console.log(shippingNumbers.value);
    message.value = "";
  };

  const deleteNumber = (numero: string) => {
    shippingNumbers.value = shippingNumbers.value.filter(
      (item) => item !== numero
    );
  };

  // ---------- File upload (xlsx/csv) ----------
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
          extractNumbers(String(item))
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

  // ---------- Providers loading / creation / reconnection ----------
  const loadProviders = async () => {
    try {
      loading.value = true;
      // substitua accountId pelo real se precisar (ou passe como param)
      const data = await useProvider.getProvidersByAccountId(
        "cd777da1-e9ae-4c3c-9fea-1e0c6ca14378"
      );
      if (Array.isArray(data)) {
        provider.value = data;
        totalProviders.value = data.length;
      } else {
        provider.value = [];
        totalProviders.value = 0;
      }
    } catch (err) {
      console.error("Erro ao carregar providers:", err);
    } finally {
      loading.value = false;
    }
  };

  const createProvider = async () => {
    try {
      loading.value = true;

      const providerNew = {
        name: nameProvider.value,
        credential: `${nameProvider.value}_account_cd777da1-e9ae-4c3c-9fea-1e0c6ca14378`,
        accountId: "cd777da1-e9ae-4c3c-9fea-1e0c6ca14378",
      };

      const base64 = await useProvider.createProvider(providerNew);
      img.value = base64;
      conectarDialog.value = true;

      // atualiza QR periodicamente
      qrCodeInterval = setInterval(async () => {
        try {
          const updated = await useProvider.connectInstance(providerNew.name);
          if (updated?.base64) img.value = updated.base64;
        } catch (err) {
          console.error("Erro atualizar QR:", err);
        }
      }, 5000);

      qrCodeTimeout = setTimeout(() => {
        if (qrCodeInterval) {
          clearInterval(qrCodeInterval);
          qrCodeInterval = null;
        }
        conectarDialog.value = false;
        img.value = "";
      }, 30000);
    } catch (err) {
      console.error("Erro createProvider:", err);
    } finally {
      loading.value = false;
    }
  };

  const reconectarProvider = async (item: IProviderGeneric) => {
    try {
      loading.value = true;
      const instance = await useProvider.connectInstance(item.instanceName);
      if (instance?.base64) img.value = instance.base64;
      reconectarDialog.value = true;

      // atualiza QR periodicamente
      qrCodeInterval = setInterval(async () => {
        try {
          const updated = await useProvider.connectInstance(item.instanceName);
          if (updated?.base64) img.value = updated.base64;
        } catch (err) {
          console.error("Erro atualizar QR:", err);
        }
      }, 5000);

      qrCodeTimeout = setTimeout(() => {
        if (qrCodeInterval) {
          clearInterval(qrCodeInterval);
          qrCodeInterval = null;
        }
        reconectarDialog.value = false;
        img.value = "";
      }, 30000);
    } catch (err) {
      console.error("Erro reconectarProvider:", err);
    } finally {
      loading.value = false;
    }
  };

  const excluirProvider = (item: IProviderGeneric) => {
    // abre diálogo para confirmação; a ação real de remoção está em handleConfirm
    editedItem.value = { ...item };
    excluirProviderDialog.value = true;
  };

  const desconectarConexao = (item: IProviderGeneric) => {
    editedItem.value = { ...item };
    desconectarDialog.value = true;
  };

  // confirm/cancel handlers (síncronos — você já tem handlers no componente original)
  const editedItem = ref<IProviderGeneric | null>(null);

  const handleConfirm = async () => {
    try {
      loading.value = true;
      if (!editedItem.value?.providerId) return;
      // se estiver no fluxo de desconectar
      if (desconectarDialog.value) {
        await useProvider.logoutProvider(editedItem.value.providerId);
        showSuccessDialogDesconectar.value = true;
      }
      // se estiver excluindo
      if (excluirProviderDialog.value) {
        await useProvider.removeProvider(editedItem.value.providerId);
        showSuccessDialogExcluir.value = true;
      }
      // atualizar lista
      await loadProviders();
    } catch (err) {
      console.error(err);
      showCancelDialog.value = true;
    } finally {
      loading.value = false;
    }
  };

  const handleCancel = () => {
    // apenas fechar/registrar
    showCancelDialog.value = true;
  };

  // select row behavior (mantém somente último selecionado)
  const onSelectRow = (rows: IProviderGeneric[]) => {
    if (!rows || rows.length === 0) {
      selectedRows.value = [];
      return;
    }
    selectedRows.value = [rows[rows.length - 1]];
  };

  const updateOptions = (options: any) => {
    // extrai opções de sort/pagination do datatable
    // ex: options.sortBy[0].key / order
    // como placeholder, atualiza page/itemsPerPage
    if (options.page) page.value = options.page;
    if (options.itemsPerPage) itemsPerPage.value = options.itemsPerPage;
  };

  const resolveStatus = (statusMsg?: string) => {
    if (statusMsg === "conecting")
      return { text: "Conectando", color: "warning" };
    if (statusMsg === "open") return { text: "Conectado", color: "success" };
    if (statusMsg === "close") return { text: "Desconectado", color: "error" };
    return { text: statusMsg ?? "Desconhecido", color: "default" };
  };

  // lifecycle
  onMounted(async () => {
    // await loadProviders();
  });

  onUnmounted(() => {
    if (qrCodeInterval) clearInterval(qrCodeInterval);
    if (qrCodeTimeout) clearTimeout(qrCodeTimeout);
  });

  // Retorno: inclua tudo que o seu componente original acessa
  return {
    // UI
    loading,
    isCurrentStepValid,
    currentStep,
    validateStepOne,
    validateStepTwo,
    validateStepThree,

    // forms
    stepOneForm,
    personalForm,
    socialForm,
    addressForm,

    // step2
    shippingNumbers,
    selectedContacts,
    message,
    addNumber,
    deleteNumber,
    fileInput,
    handleFileUpload,

    // providers
    provider,
    pro,
    img,
    nameProvider,
    searchQuery,
    selectedRows,
    providers: provider, // alias usado antes no template
    loadProviders,
    createProvider,
    reconectarProvider,
    excluirProvider,
    desconectarConexao,
    editarItem: (item: IProviderGeneric) => {
      editedItem.value = { ...item };
      editarProviderDialog.value = true;
    },

    // datatable helpers
    onSelectRow,
    updateOptions,
    itemsPerPage,
    page,
    totalProviders,
    resolveStatus,

    // dialogs / flags
    reconectarDialog,
    conectarDialog,
    editarProviderDialog,
    excluirProviderDialog,
    desconectarDialog,
    addProviderDialog,
    showSuccessDialogDesconectar,
    showSuccessDialogExcluir,
    showCancelDialog,

    // confirm handlers
    handleConfirm,
    handleCancel,

    // store
    campaignStore,
  };
}
