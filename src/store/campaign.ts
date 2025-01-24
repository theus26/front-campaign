import _ from 'lodash';
import { defineStore } from 'pinia';

export interface Messages {
  type: string | null;
  message: string | null;
  mediaType: string | null;
  mimetype: string | null;
  caption: string | null;
  fileName: string | null;
  media: string | null;
  dataUrl: string | null;
}

export interface CampaignDraft {
  campaignId: string | null;
  name: string | null;
  intervalRepeat: number | null | undefined;
  numbers: any[];
  messages: Messages[] | any;
  recurrence: string | null;
  startTime: string | null;
  timeEnd: string | null;
  providerId: string | null;
  startCampaign: string | null | undefined;
  endCampaign: string | null | undefined;
  status: string | null;
  intervalMessage: string | null | undefined;
  accountId: string | null;
}

interface UIFlags {
  isFetchingItem: boolean;
  isFetching: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  isExecuting: boolean;
}

interface State {
  uiFlags: UIFlags;
  records: any[];
  listInboxesStatus: any[];
  inboxes: any[];
  providers: any[];
  metrics: any[];
  inbox: any | null;
  unsubscriber: any | null;
  inboxCounter: number;
  searchText: string;
  campaignDraft: CampaignDraft;
}

const defaultCampaignDraft: CampaignDraft = {
  campaignId: null,
  name: null,
  intervalRepeat: null,
  numbers: [],
  messages:[],
  recurrence: null,
  startTime: null,
  timeEnd: null,
  providerId: null,
  startCampaign: null,
  endCampaign: null,
  status: null,
  intervalMessage: null,
  accountId: null,
};

export const useCampaignStore = defineStore('campaign', {
  state: (): State => ({
    uiFlags: {
      isFetchingItem: false,
      isFetching: false,
      isCreating: false,
      isDeleting: false,
      isUpdating: false,
      isExecuting: false,
    },
    records: [],
    listInboxesStatus: [],
    inboxes: [],
    providers: [],
    metrics: [],
    inbox: null,
    unsubscriber: null,
    inboxCounter: 0,
    searchText: '',
    campaignDraft: _.cloneDeep(defaultCampaignDraft),
  }),

  getters: {
    getUIFlags: (state) => state.uiFlags,
    getDraft: (state) => state.campaignDraft,
    getListStatusInboxes: (state) => state.listInboxesStatus,
    getAllProviders: (state) => state.providers,
    getAllCampaigns: (state) => state.records,
    getSearchText: (state) => state.searchText,
    getMetricsCampaigns: (state) => state.metrics,
  },
  actions: {
    setDraft(payload: Partial<CampaignDraft>) {
      const draft = _.omitBy(
        {
          ...this.campaignDraft,
          ...payload,
        },
        (v) => v == null || v === ''
      );

      //draft.accountId = router.currentRoute.value.params.accountId;
      this.campaignDraft = draft as unknown as CampaignDraft;
    },

    clearDraft() {
      this.campaignDraft = _.cloneDeep(defaultCampaignDraft);
    },

    // setSearchText(searchText: string) {
    //   this.searchText = searchText;
    // },

    // async saveCampaign() {
    //   this.uiFlags.isCreating = true;
    //   try {
    //     const draft = this.campaignDraft;
    //     if (
    //       draft.numeroContatoViewModel.tipoNumero === 'NumerosBrutos' ||
    //       draft.numeroContatoViewModel.tipoNumero === '2'
    //     ) {
    //       draft.numeroContatoViewModel.conteudoNumeroContato = JSON.parse(
    //         draft.numeroContatoViewModel.conteudoNumeroContato
    //       ).join(';');
    //     }

    //     if (draft.campanhaId) {
    //       await updateCampaign(draft);
    //     } else {
    //       await createCampaign(draft);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     this.uiFlags.isCreating = false;
    //   }
    // },

    // async getCampaigns() {
    //   this.uiFlags.isFetching = true;
    //   try {
    //     const accountId = router.currentRoute.value.params.accountId;
    //     const response = await getAllCampaigns(accountId);
    //     this.records = response.data.data;
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     this.uiFlags.isFetching = false;
    //   }
    // },

    // async getMetrics(campaignId: string) {
    //   this.uiFlags.isFetching = true;
    //   try {
    //     const response = await getMetricsCampaigns(campaignId);
    //     this.metrics = response.data.data;
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     this.uiFlags.isFetching = false;
    //   }
    // },
  },
})
