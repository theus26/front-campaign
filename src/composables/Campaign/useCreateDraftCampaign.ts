import { ICreateCampaign } from "@/@core/services/interfaces/campaign/ICampaignService";
import { useCreateCampaign } from "@/composables/Campaign/useCreateCampaign";
import { router } from "@/plugins/1.router";
import useCampaignService from "@/services/campaign/useCampaign";
import { CampaignDraft } from "@/store/campaign";
import { useToast } from "vue-toast-notification";

export function useCreateDraftCampaign() {
  const { campaignStore } = useCreateCampaign();
  const toast = useToast();
  const store = campaignStore;
  const loadingDraft = ref(false);

  const buildPayload = (payload: CampaignDraft): ICreateCampaign => {
    return {
      name: payload.name ?? "",
      content: payload.messages ?? [],
      numbers: payload.numbers ?? [],
      intervalRepeat: payload.intervalRepeat ?? undefined,
      recurrence:
        payload.recurrence?.toLowerCase() == "unica" ? "Unique" : "Recurrent",
      startTime: payload.startTime,
      timeEnd: payload.timeEnd,
      status: "draft",
      intervalMessage: payload.intervalMessage ?? undefined,
      startCampaign: payload.startCampaign,
      endCampaign: payload.endCampaign,
      providerId: payload.providerId ?? undefined,
    };
  };

  const createDraft = async () => {
    loadingDraft.value = true;

    const draft = store.getDraft ?? store.campaignDraft ?? null;
    try {
      const payload = buildPayload(draft);
      console.log("Constructed payload for campaign creation:", payload);
      await useCampaignService.createCampaign(payload);
      toast.success("Campanha salva como rascunho!");
      router.push("/campaigns/list");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Erro ao salvar como rascunho. Por favor, tente novamente.");
    } finally {
      loadingDraft.value = false;
    }
  };

  return {
    createDraft,
    loadingDraft,
  };
}
