import defaultConfig from "@/services/defaultConfig";
import { store } from "@/plugins/2.pinia";
import {
  useNotificationStore,
  type CampaignLiveEvent,
} from "@/store/notifications";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";

let connection: HubConnection | null = null;
let connecting = false;
let lastToken = "";
let retryTimeout: ReturnType<typeof setTimeout> | null = null;

const getAccessToken = () => {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  if (!match?.[1]) return "";

  try {
    const decoded = decodeURIComponent(match[1]);
    if (
      (decoded.startsWith('"') && decoded.endsWith('"')) ||
      (decoded.startsWith("'") && decoded.endsWith("'"))
    ) {
      return decoded.slice(1, -1);
    }
    return decoded;
  } catch {
    return match[1];
  }
};

const hubUrl = () => {
  if (import.meta.env.DEV) return "/hubs/campaigns";
  return `${defaultConfig.baseUrlService}/hubs/campaigns`;
};

const normalizeEvent = (payload: any): CampaignLiveEvent => ({
  type: payload?.type ?? payload?.Type,
  campaignId: String(payload?.campaignId ?? payload?.CampaignId ?? ""),
  campaignName: payload?.campaignName ?? payload?.CampaignName ?? "",
  status: payload?.status ?? payload?.Status,
  number: payload?.number ?? payload?.Number,
  error: payload?.error ?? payload?.Error,
  occurredAt: payload?.occurredAt ?? payload?.OccurredAt,
});

const scheduleRetry = () => {
  if (retryTimeout) return;
  retryTimeout = setTimeout(() => {
    retryTimeout = null;
    void startConnection();
  }, 4000);
};

export const startConnection = async () => {
  const token = getAccessToken();
  if (!token || connecting) return;
  if (connection?.state === HubConnectionState.Connected && lastToken === token)
    return;

  connecting = true;

  try {
    if (connection) {
      await connection.stop().catch(() => undefined);
      connection = null;
    }

    const notificationStore = useNotificationStore(store);

    connection = new HubConnectionBuilder()
      .withUrl(hubUrl(), {
        accessTokenFactory: () => getAccessToken(),
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("CampaignEvent", (payload) => {
      notificationStore.handleLiveEvent(normalizeEvent(payload));
    });

    connection.onreconnected(() => {
      console.info("[campanha] reconectado ao hub de notificações");
    });

    connection.onclose(() => {
      connection = null;
      lastToken = "";
      if (getAccessToken()) scheduleRetry();
    });

    await connection.start();
    lastToken = token;
    console.info("[campanha] conectado ao hub de notificações");
  } catch (error) {
    console.error("Não foi possível conectar ao hub de campanhas:", error);
    connection = null;
    scheduleRetry();
  } finally {
    connecting = false;
  }
};

export const stopConnection = async () => {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }

  if (!connection) return;

  try {
    if (connection.state !== HubConnectionState.Disconnected)
      await connection.stop();
  } finally {
    connection = null;
    connecting = false;
    lastToken = "";
  }
};

export function useCampaignHub() {
  const accessToken = useCookie("accessToken");

  watch(
    accessToken,
    async (token) => {
      if (token || getAccessToken()) await startConnection();
      else await stopConnection();
    },
    { immediate: true },
  );

  onMounted(() => {
    if (getAccessToken()) void startConnection();
  });
}
