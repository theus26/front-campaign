<script setup lang="ts">
import type { IErroEnvio } from '@/@core/services/interfaces/dashboard/IDashboardService'
import { formatDashboardNumber } from '@/composables/Dashboard/dashboardHelpers'

const props = defineProps<{
  erros: IErroEnvio[]
}>()

const maxQuantidade = computed(() =>
  Math.max(...props.erros.map(erro => erro.quantidade), 1),
)
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Principais erros</VCardTitle>
      <VCardSubtitle>Os 5 motivos que mais barraram o envio</VCardSubtitle>
    </VCardItem>

    <VCardText>
      <div
        v-if="!erros.length"
        class="text-body-1 text-medium-emphasis py-6 text-center"
      >
        Nenhum erro registrado nesta campanha. Os disparos estão limpos.
      </div>

      <div
        v-else
        class="d-flex flex-column gap-5"
      >
        <div
          v-for="erro in erros"
          :key="erro.mensagem"
        >
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-body-1 font-weight-medium">
              {{ erro.mensagem || 'Erro sem descrição' }}
            </span>
            <span class="text-body-1">
              {{ formatDashboardNumber(erro.quantidade) }}
            </span>
          </div>
          <VProgressLinear
            :model-value="(erro.quantidade / maxQuantidade) * 100"
            color="error"
            height="8"
            rounded
          />
        </div>
      </div>
    </VCardText>
  </VCard>
</template>
