<script setup lang="ts">
import { useCreateGroupContact } from '@/composables/Group-contacts/useCreateGroupContact';
const {
  formRef,
  loading,
  nome,
  numeros,
  mock,
  submit,
  customFilter,
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
                <VCol cols="12" md="6">
                  <AppTextField v-model="nome" label="Inserir nome *" placeholder="Informe nome"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12" md="6">
                  <AppAutocomplete v-model="numeros" placeholder="Selecione" label="Selecione Contatos" :items="mock"
                    item-title="nome" item-value="numero" :custom-filter="customFilter" multiple chips clearable>

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
