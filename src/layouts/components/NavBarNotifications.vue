<script lang="ts" setup>
import { useCampaignHub } from '@/composables/useCampaignHub'
import { useNotificationStore } from '@/store/notifications'
import { router } from '@/plugins/1.router'

const notificationStore = useNotificationStore()
useCampaignHub()

const removeNotification = (notificationId: number) => {
  notificationStore.removeNotification(notificationId)
}

const markRead = (notificationId: number[]) => {
  notificationStore.markRead(notificationId)
}

const markUnRead = (notificationId: number[]) => {
  notificationStore.markUnRead(notificationId)
}

const handleNotificationClick = (notification: { isSeen: boolean; id: number; campaignId?: string }) => {
  if (!notification.isSeen)
    markRead([notification.id])

  if (notification.campaignId)
    router.push('/campaigns/list')
}

const clearAll = () => {
  notificationStore.clearAll()
}
</script>

<template>
  <Notifications
    :notifications="notificationStore.notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @clear="clearAll"
    @click:notification="handleNotificationClick"
  />
</template>
