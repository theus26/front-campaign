<script lang="ts" setup>
import { MessageData } from '@/@core/services/interfaces/campaign/ICampaignService'
import ChatLog from '@/pages/campaigns/components/ChatLogCampaign.vue'
import { ChatMessage } from '@/plugins/fake-api/handlers/apps/chat/types'
import { themes } from '@/plugins/vuetify/theme'
import type { Messages } from '@/store/campaign'
import { useCampaignStore } from '@/store/campaign'
import { ActiveChat } from '@/views/apps/chat/useChat'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { useRoute } from "vue-router"
import { useToast } from 'vue-toast-notification'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'

definePage({
  meta: {
    layoutWrapperClasses: 'layout-content-height-fixed',
  },
})
// composables
const $toast = useToast();
const store = useChatStore()
const { activeChat } = storeToRefs(store);
const campaignStore = useCampaignStore();
const route = useRoute();
const isEdit = computed(() => !!route.params.id);
// Perfect scrollbar
const chatLogPS = ref()
const MAX_FILE_SIZE_MB = 40;
const messages = ref<MessageData[]>([
  {
    type: "text",
  },
]);





const scrollToBottomInChatLog = () => {
  const scrollEl = chatLogPS.value.$el || chatLogPS.value
  scrollEl.scrollTop = scrollEl.scrollHeight
}

// Search query
const q = ref('')





watch(
  q,
  val => store.fetchChatsAndContacts(val),
  { immediate: true },
)
// Chat message
const msg = ref('')

const sendMessage = async () => {
  if (!msg.value) return;

  const newMessage: ChatMessage = {
    mediaType: 'text',
    feedback: {
      isSent: true,
      isDelivered: true,
      isSeen: true,
    },
    message: msg.value,
    senderId: 11,
    time: new Date().toString(),
  };

  await store.sendMsg(newMessage);
  const message: Messages = {
    type: 'text',
    message: msg.value,
    mediaType: null,
    mimetype: null,
    caption: null,
    fileName: null,
    media: null,
    dataUrl: null,
  };

  setDraftOfCampaign(message);
  msg.value = '';

  // Scroll to bottom
  nextTick(scrollToBottomInChatLog);
};
const triggerFileSelection = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '*/*';
  input.addEventListener('change', (event) => onFileChange(event, 0));
  input.click();
};
const onFileChange = async (event: Event, index: number) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (isFileSizeValid(file.size)) {
    try {
      const base64 = await convertToBase64(file);
      const dataUrl = URL.createObjectURL(file);
      sendMessageMedia(index, file, base64, dataUrl);
    } catch (error) {
      $toast.error('Erro ao processar o arquivo.', { duration: 5000 });
    }
  } else {
    $toast.error('O tamanho máximo permitido para arquivos é de 40MB.', { duration: 5000 });
  }
};
const isFileSizeValid = (size: number) => size / (1024 * 1024) <= MAX_FILE_SIZE_MB;
const sendMessageMedia = async (index: number, file: File, base64: string, dataUrl: string) => {
  messages.value[index] = {
    filename: file.name,
    ...parseBase64(base64),
    dataUrl,
  };
  const data = new Date();

  const mediaType = messages.value[index].mediatype ? messages.value[index].mediatype.split("/")[0] : '';
  const msg: ChatMessage = {
    mediaUrl: base64,
    mediaType: mediaType,
    feedback: {
      isSent: true,
      isDelivered: true,
      isSeen: true,
    },
    message: '',
    senderId: 1,
    time: data.toString(),
  };
  await store.sendMsg(msg);
  const message: Messages = {
    type: mediaType,
    message: null,
    mediaType: mediaType,
    mimetype: mediaType,
    caption: null,
    fileName: file.name,
    media: base64,
    dataUrl: dataUrl,
  };
  setDraftOfCampaign(message);
};
const convertToBase64 = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("Erro ao converter para Base64");
      }
    };

    reader.onerror = () => {
      reject("Erro ao ler o arquivo");
    };
  });
};
const parseBase64 = (base64: string) => {
  const defaultObj = {
    mediatype: "",
    mimetype: "",
    type: "",
    media: "",
  };

  if (!base64.startsWith("data:")) return defaultObj;

  const [mediaType, mediaData] = base64.split(";");
  const [_, mimeType] = mediaType.split(":");
  const [type] = mimeType.split("/");

  const mediaTypeMap: Record<string, string> = {
    audio: "audio",
    image: "image",
    application: "document",
    video: "video",
  };

  return {
    ...defaultObj,
    mediatype: mimeType.replace("application", "document"),
    mimetype: mimeType.replace("application", "document"),
    type: mediaTypeMap[type] || "media",
    media: mediaData.split(",")[1],
  };
};

const setDraftOfCampaign = (message: Messages) => {
  const currentMessages = campaignStore.getDraft.messages || [];

  campaignStore.setDraft({
    messages: [...currentMessages, message],
  });
};

const getFormattedCurrentTime = () => {
  return new Date().toString();
};

const normalizeDraftMessages = (messages: any[] = []) => {

  return messages.map((message) => ({
    mediaType: message.type ?? message.mediaType ?? "text",
    mediaUrl: message.media ?? message.mediaUrl ?? undefined,
    feedback: {
      isSent: true,
      isDelivered: true,
      isSeen: true,
    },
    message: message.message ?? "",
    senderId: 11,
    time: getFormattedCurrentTime(),
  }));
};

const draftRawMessages =
  campaignStore.getDraft?.messages ??
  campaignStore.campaignDraft?.messages ??
  [];

const draftMessages = normalizeDraftMessages(draftRawMessages);

const mergeUniqueMessages = (
  originalMessages: any[] = [],
  newMessages: any[] = [],
) => {


  return newMessages.map((newMsg, index) => {
    const originalMsg = originalMessages[index];

    if (!originalMsg) return newMsg;

    const hasChanged =
      originalMsg.message !== newMsg.message ||
      originalMsg.mediaType !== newMsg.mediaType ||
      originalMsg.mediaUrl !== newMsg.mediaUrl ||
      originalMsg.senderId !== newMsg.senderId;

    return hasChanged ? newMsg : originalMsg;
  });
};

const fallbackChatData: ActiveChat = {
  chat: {
    id: 2,
    userId: 1,
    unseenMsgs: 0,
    messages: draftMessages,
  },
  contact: {
    id: 1,
    fullName: "Gavin Griffith",
    role: "Frontend Developer",
    about:
      "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
    avatar: "/src/assets/images/avatars/avatar-5.png",
    status: "offline",
  },
};

const chatData = computed<ActiveChat>(() => {
  if (activeChat.value) {
    return {
      ...activeChat.value,
      chat: activeChat.value.chat
        ? {
          ...activeChat.value.chat,
          messages: mergeUniqueMessages(
            activeChat.value.chat.messages,
            draftMessages,
          ),
        }
        : activeChat.value.chat,
    };
  }

  return fallbackChatData;
});

const mockData: ActiveChat = {
  chat: {
    id: 2,
    userId: 1,
    unseenMsgs: 0,
    messages: [
      // {
      //   mediaType: undefined,
      //   mediaUrl: undefined,
      //   feedback: { isSent: false, isDelivered: false, isSeen: false },
      //   message: '',
      //   senderId: 11,
      //   time: ''
      // }
    ]
  },
  contact: {
    id: 1,
    fullName: 'Gavin Griffith',
    role: 'Frontend Developer',
    about:
      'Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing',
    avatar: '/src/assets/images/avatars/avatar-5.png',
    status: 'offline'
  }
}

onMounted(async () => {
  if (isEdit.value) {
    store.activeChat = chatData.value;
    return;
  }

  store.activeChat = mockData;
})


// file input
const refInputEl = ref<HTMLElement>()

const { name } = useTheme()

const chatContentContainerBg = computed(() => {
  let color = 'transparent'

  if (themes)
    color = themes?.[name.value].colors?.background as string

  return color
})
</script>

<template>
  <VLayout class="chat-app-layout" style="z-index: 0;">

    <!-- 👉 Chat content -->
    <VMain class="chat-content-container">
      <!-- 👉 Right content: Active Chat -->
      <div v-if="store.activeChat" class="d-flex flex-column h-100">
        <VSpacer />
        <VDivider />

        <PerfectScrollbar ref="chatLogPS" tag="ul" :options="{ wheelPropagation: false }" class="flex-grow-1">
          <ChatLog />
        </PerfectScrollbar>

        <!-- Message form -->
        <VForm class="chat-log-message-form mb-5 mx-5" @submit.prevent="sendMessage">
          <VTextField :key="store.activeChat?.contact.id" v-model="msg" variant="solo" density="default"
            class="chat-message-input" placeholder="Escreva sua mensagem" autofocus>
            <template #append-inner>
              <div class="d-flex gap-1">
                <IconBtn @click="triggerFileSelection">
                  <VIcon icon="tabler-paperclip" size="22" />
                </IconBtn>
                <div class="d-none d-md-block">
                  <VBtn append-icon="tabler-send" @click="sendMessage">
                    Enviar
                  </VBtn>
                </div>
                <IconBtn class="d-block d-md-none" @click="sendMessage">
                  <VIcon icon="tabler-send" />
                </IconBtn>
              </div>
            </template>
          </VTextField>

          <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden>
        </VForm>
      </div>

      <!-- 👉 Start conversation -->
      <div v-if="store.activeChat?.contact.id" class="d-flex h-100 align-center justify-center flex-column">
        <p style="max-inline-size: 40ch; text-wrap: balance;" class="text-center text-disabled">
          Start connecting with the people by selecting one of the contact on left
        </p>
      </div>
    </VMain>
  </VLayout>
</template>

<style lang="scss">
@use "@styles/variables/vuetify";
@use "@core/scss/base/mixins";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 76px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1.5rem;
}

.chat-start-conversation-btn {
  cursor: default;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  /* stylelint-disable-next-line value-keyword-case */
  background-color: v-bind(chatContentContainerBg);

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__input {
      font-size: 0.9375rem !important;
      line-height: 1.375rem !important;
      padding-block: 0.6rem 0.5rem;
    }

    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 8px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
