<script setup lang="ts">
import type { IFunilMensagem } from '@/@core/services/interfaces/dashboard/IDashboardService'
import { formatDashboardNumber } from '@/composables/Dashboard/dashboardHelpers'

const props = defineProps<{
  funilMensagens: IFunilMensagem
  funilDestinatarios: IFunilMensagem
}>()

type FunilVisao = 'destinatarios' | 'mensagens'

const visao = ref<FunilVisao>('destinatarios')

const visaoOptions: { title: string; value: FunilVisao }[] = [
  { title: 'Destinatários', value: 'destinatarios' },
  { title: 'Mensagens', value: 'mensagens' },
]

const funilAtual = computed(() =>
  visao.value === 'mensagens' ? props.funilMensagens : props.funilDestinatarios,
)

const hasData = computed(() => funilAtual.value.enviadas > 0)

const etapas = computed(() => {
  const enviadas = funilAtual.value.enviadas || 0
  const entregues = funilAtual.value.entregues || 0
  const lidas = funilAtual.value.lidas || 0
  const base = Math.max(enviadas, 1)

  return [
    {
      title: 'Enviadas',
      value: enviadas,
      color: 'primary',
      width: 100,
    },
    {
      title: 'Entregues',
      value: entregues,
      color: 'info',
      width: Math.max(Math.round((entregues / base) * 100), entregues ? 36 : 28),
    },
    {
      title: 'Lidas',
      value: lidas,
      color: 'success',
      width: Math.max(Math.round((lidas / base) * 100), lidas ? 24 : 20),
    },
  ]
})
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Funil de mensagens</VCardTitle>
      <VCardSubtitle>Do envio até a leitura</VCardSubtitle>

      <template #append>
        <div class="d-flex flex-wrap gap-2">
          <VChip
            v-for="option in visaoOptions"
            :key="option.value"
            :color="visao === option.value ? 'primary' : undefined"
            :variant="visao === option.value ? 'flat' : 'outlined'"
            size="small"
            label
            @click="visao = option.value"
          >
            {{ option.title }}
          </VChip>
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div
        v-if="!hasData"
        class="text-body-1 text-medium-emphasis py-8 text-center"
      >
        Ainda não há envios para montar o funil.
      </div>

      <div
        v-else
        class="funnel-wrap d-flex flex-column align-center gap-3 py-2"
      >
        <div
          v-for="etapa in etapas"
          :key="etapa.title"
          class="funnel-row"
          :style="{ width: `${etapa.width}%` }"
        >
          <div
            class="funnel-step rounded-lg px-4 py-3 d-flex align-center justify-space-between"
            :class="`bg-${etapa.color}`"
          >
            <span class="text-white font-weight-medium">
              {{ etapa.title }}
            </span>
            <span class="text-white text-h6">
              {{ formatDashboardNumber(etapa.value) }}
            </span>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.funnel-wrap {
  inline-size: 100%;
}

.funnel-row {
  max-inline-size: 100%;
  min-inline-size: 0;
  transition: width 0.3s ease;
}

.funnel-step {
  box-shadow: 0 8px 18px rgba(var(--v-theme-on-background), 0.08);
}
</style>
