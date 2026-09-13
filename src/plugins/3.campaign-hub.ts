import type { App } from "vue";
import { startConnection } from "@/composables/useCampaignHub";

export default function (_app: App) {
  if (typeof window === "undefined") return;

  const connect = () => {
    void startConnection();
  };

  if (document.readyState === "complete") connect();
  else window.addEventListener("load", connect, { once: true });
}
