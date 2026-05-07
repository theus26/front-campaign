<script setup lang="ts">
import { formatInputNumber } from '@/composables/Contacts/useFormatNumberComposable';
import { useCreateGroupContact } from '@/composables/Group-contacts/useCreateGroupContact';
const {
  formRef,
  loading,
  nome,
  numeros,
  contatos,
  submit,
  customFilter,
  getInitials
} = useCreateGroupContact();
</script>

<template>
  <div>
    <VRow>
      <VCol md="12">
        <VCard class="mb-6" title="Inserir Grupo Contato">
          <VCardText>
            <VForm ref="formRef" @submit.prevent="submit">
              <VRow>
                <VCol cols="12">
                  <AppTextField v-model="nome" label="Inserir nome *" placeholder="Informe nome"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12">


                  <AppAutocomplete v-model="numeros" label="Selecione os contatos" placeholder="Selecione"
                    :items="contatos" item-title="nome" item-value="numero" :custom-filter="customFilter" multiple chips
                    closable-chips clearable :return-object="false" prepend-inner-icon="tabler-users">
                    <!-- Item da lista -->
                    <template #item="{ props, item }">
                      <VListItem v-bind="props" :title="item.raw.nome" :subtitle="formatInputNumber(item.raw.numero)">
                        <template #prepend>
                          <VAvatar size="32" color="primary" variant="tonal">
                            {{ getInitials(item.raw.nome) }}
                          </VAvatar>
                        </template>
                      </VListItem>
                    </template>

                    <!-- Chips selecionados -->
                    <template #chip="{ props, item }">
                      <VChip v-bind="props" size="small" color="primary" variant="tonal">
                        {{ item.raw.nome }}
                      </VChip>
                    </template>
                  </AppAutocomplete>
                </VCol>

                <VCol cols="12">
                  <div class="d-flex flex-wrap gap-4 justify-end mt-8">
                    <VBtn color="info" variant="tonal" @click="$router.back()">
                      Voltar
                    </VBtn>

                    <VBtn color="primary" type="submit" :loading="loading">
                      Salvar
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
