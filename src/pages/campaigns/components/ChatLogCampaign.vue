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
    <div v-for="(msgGrp, index) in msgGroups" :key="msgGrp.senderId + String(index)" class="chat-group d-flex" :class="[
      {
        'justify-end mb-6': msgGrp.senderId !== contact.id,
        'justify-start mb-6': msgGrp.senderId === contact.id,
      },
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
              <img :src="msgData.mediaUrl" alt="Anexo de imagem" class="chat-image" />
            </template>

            <template v-else-if="msgData.mediaType === 'document'">
              <iframe :src="msgData.mediaUrl" allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                class="chat-document" />
            </template>

            <template v-else-if="msgData.mediaType === 'video'">
              <video class="tw-h-full tw-w-full" :src="msgData.mediaUrl" controls :loop="true">
                Seu navegador não suporta a reprodução de vídeo.
              </video>
            </template>
          </div>

          <IconBtn size="x-small" class="ms-2">
            <VIcon icon="tabler-dots-vertical" size="18" />

            <VMenu activator="parent">
              <VList density="compact">
                <VListItem @click="openEditModal(msgGrp, msgData)">
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
.chat-document,
video {
  max-width: 100%;
  border-radius: 8px;
}

.chat-document {
  width: 300px;
  height: 400px;
  border: none;
}
</style>
