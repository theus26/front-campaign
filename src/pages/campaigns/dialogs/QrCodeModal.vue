<script setup lang="ts">
import useProvider from "@/services/provider/useProvider";
import { CampaignDraft, useCampaignStore } from "@/store/campaign";
import { onUnmounted, ref, watch } from "vue";
import { useToast } from "vue-toast-notification";


const props = defineProps<{
  modelValue: boolean
  base64: string
  name: string
}>()

const $toast = useToast();
const campaignStore = useCampaignStore();
const emit = defineEmits(["update:modelValue", "next"]);

const isOpen = ref(props.modelValue);
const qrCodeBase64 = ref<string | null>(props.base64);
const connectionStatus = ref<"waiting" | "connecting" | "connected">("waiting");

const loading = ref(false);
const expired = ref(false);

let interval: any = null
let qrTimeout: any = null
let connectingTimeout: any = null

const startTimer = async () => {
  clearInterval(interval)
  clearTimeout(qrTimeout)
  clearTimeout(connectingTimeout)

  const state = await useProvider.getConnectionState(props.name)
  const status = state?.instance?.state
  const providerId = state?.instance?.providerId

  if (status === "open") {
    connectionStatus.value = "connected"
    $toast.success("Dispositivo conectado com sucesso")
    campaignStore.setDraft({
      ...(campaignStore as unknown as CampaignDraft),
      providerId: providerId ?? null
    } as CampaignDraft)
    emit("next")

    return
  }

  if (status === "connecting") {
    connectionStatus.value = "connecting"

    interval = setInterval(checkConnection, 3000)

    connectingTimeout = setTimeout(() => {
      clearInterval(interval)

      expired.value = true
      qrCodeBase64.value = null

      $toast.warning("Tempo de conexão excedido")
    }, 90000)

    return
  }

  connectionStatus.value = "waiting"

  interval = setInterval(checkConnection, 3000)

  qrTimeout = setTimeout(() => {
    if (connectionStatus.value === "waiting") {
      clearInterval(interval)

      expired.value = true
      qrCodeBase64.value = null

      $toast.warning("QR Code expirado")
    }
  }, 30000)
}

const checkConnection = async () => {
  const state = await useProvider.getConnectionState(props.name)

  if (!state?.instance) return

  const status = state.instance.state

  if (status === "connecting") {

    if (connectionStatus.value !== "connecting") {
      connectionStatus.value = "connecting"

      clearTimeout(qrTimeout)

      // tolerância de 1min30
      connectingTimeout = setTimeout(() => {
        clearInterval(interval)

        expired.value = true
        qrCodeBase64.value = null

        $toast.warning("Tempo de conexão excedido")
      }, 90000)
    }

    return
  }

  if (status === "open") {
    const providerId = state.instance.providerId
    connectionStatus.value = "connected"

    clearInterval(interval)
    clearTimeout(qrTimeout)
    clearTimeout(connectingTimeout)

    campaignStore.setDraft({
      ...(campaignStore as unknown as CampaignDraft),
      providerId: providerId ?? null
    } as CampaignDraft)

    $toast.success("Dispositivo conectado com sucesso")
    emit("update:modelValue", false)
    emit("next")

    return
  }
}

async function reloadQrCode() {
  loading.value = true;
  expired.value = false;

  try {
    const data = await useProvider.connectInstance(props.name);


    qrCodeBase64.value = data.code ?? data.pairingCode ?? data.base64 ?? "";

    startTimer();
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;

    if (val) {
      qrCodeBase64.value = props.base64 ?? "";
      expired.value = false;
      startTimer();
    } else {
      clearTimeout(qrTimeout);
      clearTimeout(connectingTimeout);
    }
  }
);

watch(isOpen, (val) => {
  emit("update:modelValue", val);
});

function closeDialog() {
  clearInterval(interval);
  clearTimeout(qrTimeout);
  clearTimeout(connectingTimeout);
  emit("update:modelValue", false);
}

onUnmounted(() => {
  clearInterval(interval);
  clearTimeout(qrTimeout);
  clearTimeout(connectingTimeout);
});
</script>

<template>
  <VDialog v-model="isOpen" max-width="420">
    <DialogCloseBtn @click="closeDialog" />

    <VCard>

      <VCardTitle class="text-h6 font-weight-bold">
        Conectar WhatsApp
      </VCardTitle>

      <VCardText class="text-center">

        <p class="text-medium-emphasis mb-4">
          Abra o WhatsApp no celular e escaneie o QR Code abaixo.
        </p>

        <v-progress-circular v-if="loading" indeterminate size="40" width="4" class="mb-4" />

        <!-- Expirado -->
        <div v-else-if="expired">
          <v-alert type="warning" variant="tonal" class="mb-4">
            QR Code expirado
          </v-alert>

          <v-btn color="primary" prepend-icon="mdi-refresh" @click="reloadQrCode">
            Gerar novo QR Code
          </v-btn>
        </div>

        <!-- QR CODE -->
        <div v-else-if="qrCodeBase64" class="pa-4 d-inline-block rounded bg-grey-lighten-4">
          <v-img :src="qrCodeBase64" width="240" height="240" contain
            :class="{ 'opacity-50': connectionStatus === 'connecting' }" />

          <!-- Status -->
          <div v-if="connectionStatus === 'connecting'" class="mt-3">
            <v-progress-circular indeterminate size="20" width="3" class="me-2" />
            <span class="text-warning">Conectando dispositivo...</span>
          </div>

          <div v-else class="text-caption text-medium-emphasis mt-3">
            Aguardando leitura do QR Code...
          </div>
        </div>

        <!-- Sem QR -->
        <div v-else class="text-caption text-medium-emphasis mt-3">
          QR Code indisponível
        </div>

        <div class="text-caption text-medium-emphasis mt-4">
          O QR Code expira em 30 segundos
        </div>

      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">

        <VBtn variant="text" @click="closeDialog">
          Fechar
        </VBtn>

      </VCardActions>

    </VCard>
  </VDialog>
</template>
