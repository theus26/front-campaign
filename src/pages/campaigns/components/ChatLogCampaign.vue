<script lang="ts" setup>
import { useChatStore } from '@/views/apps/chat/useChatStore'
import type { ChatOut } from '@db/apps/chat/types'

const store = useChatStore()

interface MessageGroup {
  senderId: ChatOut['messages'][number]['senderId']
  messages: Omit<ChatOut['messages'][number], 'senderId'>[]
}

const contact = computed(() => ({
  id: store.activeChat?.contact.id,
  avatar: store.activeChat?.contact.avatar,
}))

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
</script>

<template>
  <div class="chat-log pa-6">
    <div v-for="(msgGrp, index) in msgGroups" :key="msgGrp.senderId + String(index)" class="chat-group d-flex align-end"
      :class="[{
        'flex-row-reverse mb-6': msgGrp.senderId,
        'mb-6': msgGroups.length - 1 !== index,
      }]">
      <div class="chat-avatar me-4">
        <VAvatar size="32">
          <VImg :src="store.profileUser?.avatar" />
        </VAvatar>
      </div>
      <div class="chat-body d-inline-flex flex-column align-end">
        <div v-if="msgGrp.messages.length > 0" v-for="(msgData, msgIndex) in msgGrp.messages" :key="msgData.time"
          class="chat-content py-2 px-4 elevation-2 chat-left" style="background-color: rgb(var(--v-theme-surface));"
          :class="[
            msgGrp.messages.length - 1 !== msgIndex ? 'mb-2' : 'mb-1',
          ]">
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
              style="border: none;"></iframe>
          </template>

          <template v-else-if="msgData.mediaType === 'video'">
            <video class="tw-h-full tw-w-full" :src="msgData.mediaUrl" controls :loop="true" :volume="1.0">
              Seu navegador não suporta a reprodução de vídeo.
            </video>
          </template>
        </div>
        <div class="text-right">
          <VIcon v-if="msgGrp.senderId !== contact.id" size="16"
            :color="resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).color">
            {{ resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).icon }}
          </VIcon>
          <span class="text-sm ms-2 text-disabled">{{ formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
            hour: 'numeric', minute: 'numeric'
          }) }}</span>
        </div>
      </div>
    </div>
  </div>
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
</style>
