<script setup lang="ts">
import { useCreateContact } from "@/composables/Contacts/useCreateContact";
import { formatInputNumber } from "@/composables/Contacts/useFormatNumberComposable";

const {
  formRef,
  loading,
  nome,
  numero,
  submit,
} = useCreateContact();
</script>

<template>
  <div>
    <VRow>
      <VCol md="12">
        <VCard class="mb-6" title="Inserir Contato">
          <VCardText>
            <VForm ref="formRef" @submit.prevent="submit">
              <VRow>
                <VCol cols="12" md="6">
                  <AppTextField v-model="nome" label="Inserir nome *" placeholder="Informe nome"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField v-model="numero" label="Inserir número *" placeholder="(79) 99999-9999"
                    @input="numero = formatInputNumber(numero)" :rules="[requiredValidator]" />
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

<style lang="scss" scoped>
.drop-zone {
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 6px;
}
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-items: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}

.ProseMirror {
  p {
    margin-block-end: 0;
  }

  padding: 0.5rem;
  outline: none;

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}
</style>
