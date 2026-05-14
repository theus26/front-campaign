<script setup lang="ts">
import { Contato, GrupoContato } from '@/@core/services/interfaces/campaign/ICampaignService';
import { computed, ref } from 'vue';

interface Props {
  numbers: string[]
  onDelete?: (value: string) => void
}


const props = defineProps<Props>()

const showNumbers = ref(false)
const search = ref('')

const LIMIT = 50

const isGrupo = (item: unknown): item is GrupoContato => {
  return (
    typeof item === "object" &&
    item !== null &&
    "grupoId" in item &&
    "contatosGrupoDto" in item
  );
};

const isContato = (item: unknown): item is Contato => {
  return (
    typeof item === "object" &&
    item !== null &&
    "numero" in item
  );
};

const isString = (item: unknown): item is string => {
  return typeof item === "string";
};

const normalizarNumeros = (
  items: Array<string | Contato | GrupoContato>,
): string[] => {
  return [
    ...new Set(
      items.flatMap((item) => {
        // Grupo
        if (isGrupo(item)) {
          return item.contatosGrupoDto.map(c => c.numero);
        }

        // Contato
        if (isContato(item)) {
          return item.numero;
        }

        // String
        if (isString(item)) {
          return item;
        }

        return [];
      }),
    ),
  ];
};

const filteredNumbers = computed(() => {
  const numeros = normalizarNumeros(props.numbers);

  if (!search.value) {
    return numeros;
  }

  return numeros.filter(numero =>
    numero.includes(search.value),
  );
});

const visibleNumbers = computed(() => {
  return filteredNumbers.value.slice(0, LIMIT)
})


const totalNumbers = computed(() => {
  return normalizarNumeros(props.numbers).length
})
</script>

<template>
  <div v-if="totalNumbers" class="mt-6">
    <!-- HEADER -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center gap-2">
        <VIcon icon="tabler-phone" size="20" class="text-primary" />

        <span class="text-subtitle-1 font-weight-medium">
          {{ totalNumbers }} números adicionados
        </span>
      </div>

      <VBtn variant="text" size="small" class="text-primary font-weight-medium" @click="showNumbers = !showNumbers">
        {{ showNumbers ? 'Ocultar' : 'Ver números' }}
      </VBtn>
    </div>

    <!-- EXPANSÃO -->
    <VExpandTransition>
      <div v-if="showNumbers">

        <!-- LISTA -->
        <div class="numbers-container">
          <VChip v-for="(item, index) in visibleNumbers" :key="index" color="primary" variant="flat"
            class="rounded-xl px-3 py-1 text-xs mr-2 mb-2" closable @click:close="onDelete?.(item)">
            {{ item }}
          </VChip>
        </div>

        <!-- INFO LIMITE -->
        <div v-if="filteredNumbers.length > LIMIT" class="text-xs text-gray-400 mt-2">
          Mostrando {{ LIMIT }} de {{ filteredNumbers.length }} números
        </div>
      </div>
    </VExpandTransition>
  </div>
</template>

<style scoped>
.numbers-container {
  max-height: 200px;
  overflow-y: auto;
}
</style>
