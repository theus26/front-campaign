import type { Notification } from "@layouts/types";
import { defineStore } from "pinia";
import { useToast } from "vue-toast-notification";

export type CampaignLiveEventType =
  | "MessageSent"
  | "MessageFailed"
  | "CampaignUpdated";

export interface CampaignLiveEvent {
  type: CampaignLiveEventType;
  campaignId: string;
  campaignName: string;
  status?: string;
  number?: string;
  error?: string;
  occurredAt?: string;
}

const STORAGE_KEY = "campaign-notifications";
const MAX_NOTIFICATIONS = 50;
const recentEventKeys = new Set<string>();
let toastTimer: ReturnType<typeof setTimeout> | null = null;

const loadStoredNotifications = (): Notification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
};

const formatTimeLabel = (occurredAt?: string) => {
  const date = occurredAt ? new Date(occurredAt) : new Date();
  if (Number.isNaN(date.getTime())) return "Agora";

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const eventFingerprint = (event: CampaignLiveEvent) =>
  [
    event.type,
    event.campaignId,
    event.status ?? "",
    event.number ?? "",
    event.error ?? "",
    event.occurredAt ?? "",
  ].join("|");

const isDuplicateEvent = (event: CampaignLiveEvent) => {
  const key = eventFingerprint(event);
  if (recentEventKeys.has(key)) return true;

  recentEventKeys.add(key);
  setTimeout(() => recentEventKeys.delete(key), 8000);
  return false;
};

const notifyNewNotificationsToast = () => {
  if (toastTimer) return;

  toastTimer = setTimeout(() => {
    toastTimer = null;
    useToast().info("Você tem novas notificações", { duration: 4000 });
  }, 600);
};

const mapEventToNotification = (event: CampaignLiveEvent): Notification => {
  const campaignName = event.campaignName || "Campanha";
  const number = event.number || "número";

  if (event.type === "MessageFailed") {
    const errorSuffix = event.error ? ` ${event.error}` : "";
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      icon: "tabler-alert-circle",
      color: "error",
      title: "Erro no envio",
      subtitle: `Falha ao enviar o número ${number} na campanha "${campaignName}".${errorSuffix}`,
      time: formatTimeLabel(event.occurredAt),
      isSeen: false,
      campaignId: event.campaignId,
    };
  }

  if (event.status === "Closed") {
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      icon: "tabler-checks",
      color: "success",
      title: "Campanha encerrada",
      subtitle: `A campanha "${campaignName}" foi encerrada.`,
      time: formatTimeLabel(event.occurredAt),
      isSeen: false,
      campaignId: event.campaignId,
    };
  }

  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    icon: "tabler-refresh",
    color: "info",
    title: "Campanha atualizada",
    subtitle: `A campanha "${campaignName}" mudou de status.`,
    time: formatTimeLabel(event.occurredAt),
    isSeen: false,
    campaignId: event.campaignId,
  };
};

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    notifications: loadStoredNotifications() as Notification[],
    lastCampaignEvent: null as CampaignLiveEvent | null,
  }),
  getters: {
    unseenCount: (state) =>
      state.notifications.filter((item) => !item.isSeen).length,
  },
  actions: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    },
    handleLiveEvent(event: CampaignLiveEvent) {
      this.lastCampaignEvent = event;

      if (isDuplicateEvent(event)) return;

      const shouldNotify =
        event.type === "MessageFailed" ||
        (event.type === "CampaignUpdated" && event.status === "Closed");

      if (!shouldNotify) return;

      this.notifications = [
        mapEventToNotification(event),
        ...this.notifications,
      ].slice(0, MAX_NOTIFICATIONS);
      this.persist();
      notifyNewNotificationsToast();
    },
    removeNotification(notificationId: number) {
      this.notifications = this.notifications.filter(
        (item) => item.id !== notificationId,
      );
      this.persist();
    },
    markRead(notificationIds: number[]) {
      this.notifications.forEach((item) => {
        if (notificationIds.includes(item.id)) item.isSeen = true;
      });
      this.persist();
    },
    markUnRead(notificationIds: number[]) {
      this.notifications.forEach((item) => {
        if (notificationIds.includes(item.id)) item.isSeen = false;
      });
      this.persist();
    },
    clearAll() {
      this.notifications = [];
      this.persist();
    },
  },
});
