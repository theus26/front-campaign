<script lang="ts" setup>
import { useCampaignStore } from '@/store/campaign';
import { useChatStore } from '@/views/apps/chat/useChatStore';
import type { ChatOut } from '@db/apps/chat/types';

const store = useChatStore()
const campaignStore = useCampaignStore();

const isEditDialogOpen = ref(false);
const editableMessageText = ref("");
const selectedMessage = ref<any>(null);

interface MessageGroup {
  senderId: ChatOut['messages'][number]['senderId']
  messages: Omit<ChatOut['messages'][number], 'senderId'>[]
}

const contact = computed(() => ({
  id: store.activeChat?.contact.id,
  avatar: store.activeChat?.contact.avatar,
}))

const openEditModal = (msgGrp: any, msgData: any) => {
  selectedMessage.value = msgData;
  editableMessageText.value = msgData.message ?? "";
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
  editableMessageText.value = "";
  selectedMessage.value = null;
};

const saveEditedMessage = () => {
  if (!selectedMessage.value || !editableMessageText.value.trim()) return;

  const oldMessage = selectedMessage.value.message;
  const newMessage = editableMessageText.value.trim();

  selectedMessage.value.message = newMessage;

  const currentMessages = campaignStore.getDraft?.messages || [];

  const updatedMessages = currentMessages.map((msg: any) => {
    if (msg.message === oldMessage) {
      return {
        ...msg,
        message: newMessage,
      };
    }

    return msg;
  });

  campaignStore.setDraft({
    messages: updatedMessages,
  });

  closeEditDialog();
};

// Feedback icon
const resolveFeedbackIcon = (feedback: ChatOut['messages'][number]['feedback']) => {
  if (feedback.isSeen)
    return { icon: 'tabler-checks', color: 'success' }
  else if (feedback.isDelivered)
    return { icon: 'tabler-checks', color: undefined }
  else
    return { icon: 'tabler-check', color: undefined }
}

const msgGroups = computed(() => {
  let messages: ChatOut['messages'] = []

  const _msgGroups: MessageGroup[] = []

  if (store.activeChat!.chat) {
    messages = store.activeChat!.chat.messages

    let msgSenderId = messages.length > 0 ? messages[0].senderId : 11

    let msgGroup: MessageGroup = {
      senderId: msgSenderId,
      messages: [],
    }

    messages.forEach((msg, index) => {
      if (msgSenderId === msg.senderId) {
        msgGroup.messages.push({
          message: msg.message,
          mediaType: msg.mediaType,
          mediaUrl: msg.mediaUrl,
          time: msg.time,
          feedback: msg.feedback,
        })
      }
      else {
        msgSenderId = msg.senderId
        _msgGroups.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              message: msg.message,
              mediaType: msg.mediaType,
              mediaUrl: msg.mediaUrl,
              time: msg.time,
              feedback: msg.feedback,
            },
          ],
        }
      }

      if (index === messages.length - 1)
        _msgGroups.push(msgGroup)
    })
  }

  return _msgGroups
})



const deleteMessage = (msgGrp: any, msgData: any) => {
  if (!store.activeChat?.chat) return;

  // Remove da fonte real usada pelo computed (store.activeChat.chat.messages)
  store.activeChat.chat.messages = store.activeChat.chat.messages.filter(
    (message: any) =>
      !(
        message.time === msgData.time &&
        message.message === msgData.message &&
        message.senderId === msgGrp.senderId
      ),
  );

  // Remove também do draft
  const currentDraftMessages = campaignStore.getDraft?.messages || [];

  const updatedDraftMessages = currentDraftMessages.filter(
    (message: any) =>
      !(
        message.message === msgData.message &&
        (message.type ?? message.mediaType ?? "text") === msgData.mediaType
      ),
  );

  campaignStore.setDraft({
    messages: updatedDraftMessages,
  });
};
</script>

<template>
  <div class="chat-log pa-6">
    <div v-for="(msgGrp, index) in msgGroups" :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex justify-end mb-6" :class="[

        msgGroups.length - 1 === index ? 'mb-0' : '',
      ]">
      <div class="chat-body d-flex flex-column">
        <div v-if="msgGrp.messages.length > 0" v-for="(msgData, msgIndex) in msgGrp.messages" :key="msgData.time"
          class="d-flex align-center mb-2" :class="msgGrp.senderId !== contact.id ? 'justify-end' : 'justify-start'">
          <div class="chat-content py-2 px-4 elevation-2" style="background-color: rgb(var(--v-theme-surface));">
            <template v-if="msgData.mediaType === 'text'">
              <p class="mb-0 text-base">
                {{ msgData.message }}
              </p>
            </template>

            <template v-else-if="msgData.mediaType === 'image'">
              <div class="media-container">
                <img :src="msgData.mediaUrl" alt="Anexo de imagem" class="chat-image" />
              </div>
            </template>

            <template v-else-if="msgData.mediaType === 'document'">
              <div
                class="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#1f2330] shadow-lg">
                <iframe :src="msgData.mediaUrl" allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  class="h-[320px] w-full border-0 bg-white" />
              </div>
            </template>

            <template v-else-if="msgData.mediaType === 'video'">
              <div
                class="tw-w-full tw-max-w-[420px] tw-h-[240px] tw-overflow-hidden tw-rounded-2xl tw-border tw-border-white/10 tw-bg-black">
                <video :src="msgData.mediaUrl" controls playsinline preload="metadata" class="
      tw-block
      !tw-w-full
      !tw-h-full
      tw-max-w-none
      tw-max-h-none
      tw-object-cover
      tw-bg-black
      tw-align-middle
      tw-flex-none
      tw-shrink-0
      tw-grow-0
    " />
              </div>
            </template>
          </div>

          <IconBtn size="x-small" class="ms-2">
            <VIcon icon="tabler-dots-vertical" size="18" />

            <VMenu activator="parent">
              <VList density="compact">
                <VListItem v-if="msgData.mediaType === `text`" @click="openEditModal(msgGrp, msgData)">
                  <template #prepend>
                    <VIcon icon="tabler-edit" color="primary" />
                  </template>
                  <VListItemTitle>Editar</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteMessage(msgGrp, msgData)">
                  <template #prepend>
                    <VIcon icon="tabler-trash" color="error" />
                  </template>
                  <VListItemTitle>Apagar</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </div>

        <div class="text-sm text-disabled d-flex align-center"
          :class="msgGrp.senderId !== contact.id ? 'justify-end' : 'justify-start'">
          <span>
            {{
              formatDate(
                msgGrp.messages[msgGrp.messages.length - 1].time,
                {
                  hour: "numeric",
                  minute: "numeric",
                },
              )
            }}
          </span>

          <VIcon v-if="msgGrp.senderId !== contact.id" size="16" class="ms-2" :color="resolveFeedbackIcon(
            msgGrp.messages[msgGrp.messages.length - 1].feedback,
          ).color
            ">
            {{
              resolveFeedbackIcon(
                msgGrp.messages[msgGrp.messages.length - 1].feedback,
              ).icon
            }}
          </VIcon>
        </div>
      </div>
    </div>
  </div>

  <VDialog v-model="isEditDialogOpen" max-width="700">
    <DialogCloseBtn @click="closeEditDialog" />

    <VCard>
      <VCardTitle class="text-h6 font-weight-bold">
        Editar mensagem
      </VCardTitle>

      <VCardText>
        <p class="text-medium-emphasis mb-4">
          Atualize o conteúdo da mensagem selecionada.
        </p>

        <VTextarea v-model="editableMessageText" label="Mensagem" auto-grow rows="4" variant="outlined" counter
          clearable />
      </VCardText>

      <VDivider />

      <VCardActions class="justify-end">
        <VBtn variant="text" @click="closeEditDialog">
          Cancelar
        </VBtn>

        <VBtn color="primary" :disabled="!editableMessageText.trim()" @click="saveEditedMessage">
          Salvar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang=scss>
.chat-log {
  .chat-body {
    max-inline-size: calc(100% - 6.75rem);

    .chat-content {
      border-end-end-radius: 6px;
      border-end-start-radius: 6px;

      p {
        overflow-wrap: anywhere;
      }

      &.chat-left {
        border-start-end-radius: 6px;
      }

      &.chat-right {
        border-start-start-radius: 6px;
      }
    }
  }
}

.chat-content {
  max-width: 75%;
  border-radius: 12px;
  word-break: break-word;
}

.chat-image,
.chat-document {
  border-radius: 8px;
}

.chat-document {
  width: 300px;
  height: 400px;
  border: none;
}

.media-container {
  max-width: 320px;
  border-radius: 16px;
  overflow: hidden;
  background: #1e1e1e;
}

.chat-image {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: 0.2s ease;
}

.chat-image:hover {
  transform: scale(1.02);
}

video {
  display: block;
  /* Permite o uso de propriedades de caixa/modelo */
  width: 100%;
  /* Respeita o limite do elemento pai */
  max-width: 600px;
  /* Largura máxima para não estourar em telas grandes */
  height: 300px;
  /* Mantém a proporção original do vídeo */
  object-fit: contain;
  /* Ajusta o vídeo dentro do espaço sem distorcer */
}

.video-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  /* Centraliza o contêiner na página */
}

.video-container video {
  width: 100%;
  /* Força o vídeo a preencher a div */
  height: auto;
}
</style>
