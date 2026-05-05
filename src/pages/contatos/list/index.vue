<script setup lang="ts">
import { useContact } from '@/composables/Contacts/useContact';

const { data, itemsPerPage, loading, page, nome, numero, totalRecords, headers, exibirEdicao, itemEditado, numeroFormatado, exibirCancelamento, exibirSucesso, exibirConfirmacaoDesativacao, mensagemErro, deletarContact, abrirConfirmacaoExclusao, salvarEdicao, fecharEdicao, updateOptions, abrirEdicao, formatPhone, getInitials, stringToColor } = useContact();
</script>

<template>
  <div>


    <VCard title="Contatos" subtitle="Lista de contatos sincronizado" class="mb-6">
      <VDivider />

      <div class="d-flex align-center gap-4 ma-6">

        <AppTextField v-model="nome" placeholder="Buscar por nome" class="flex-grow-1" />
        <AppTextField v-model="numero" placeholder="Buscar por numero (ex: 79 9999-9999)" class="flex-grow-1" />

        <VBtn color="primary" prepend-icon="tabler-plus" @click="$router.push('/contatos/add')">
          Criar Contato
        </VBtn>

      </div>

      <VDivider class="mt-4" />

      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers" :items="data"
        :items-length="totalRecords" loading-text="Carregando..." :loading="loading" class="text-no-wrap"
        @update:options="updateOptions">
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar v-if="item.fotoPerfil" size="38" variant="tonal" rounded :image="item.fotoPerfil" />
            <VAvatar v-else size="38" rounded :style="{ backgroundColor: stringToColor(item.nome || '') }">
              <span class="text-white text-sm font-weight-medium">
                {{ getInitials(item.nome || '') }}
              </span>
            </VAvatar>
            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.nome }}</span>
              <span class="text-body-2">{{ formatPhone(item.numero ?? '') }}</span>
            </div>
          </div>
        </template>

        <template #item.number="{ item }">
          <span class="text-body-1 font-weight-medium text-high-emphasis text-center">
            {{ formatPhone(item.numero ?? '') }}
          </span>
        </template>


        <template #item.actions="{ item }">

          <IconBtn @click="abrirEdicao(item)">
            <VIcon icon="tabler-edit" color="primary" />
          </IconBtn>
          <IconBtn @click="abrirConfirmacaoExclusao(item)">
            <VIcon icon="tabler-trash" color="error" />
          </IconBtn>
        </template>

        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalRecords" />
        </template>
      </VDataTableServer>
    </VCard>
  </div>

  <VDialog v-model="exibirEdicao" max-width="500px">
    <DialogCloseBtn @click="fecharEdicao" />
    <VCard title="Editar contato">

      <VCardText>
        <VRow>

          <VCol cols="12">
            <AppTextField v-model="itemEditado.nome" label="Nome" placeholder="Ex: João Silva" />
          </VCol>

          <VCol cols="12">
            <AppTextField v-model="numeroFormatado" label="Telefone" placeholder="(79) 99999-9999" />
          </VCol>

        </VRow>
      </VCardText>

      <VCardText>
        <div class="d-flex justify-end gap-4">
          <VBtn color="error" variant="outlined" @click="fecharEdicao">
            Cancelar
          </VBtn>

          <VBtn color="primary" :loading="loading" @click="salvarEdicao">
            Salvar
          </VBtn>
        </div>
      </VCardText>

    </VCard>
  </VDialog>

  <ConfirmDialog v-model:showSuccess="exibirSucesso" v-model:showCancel="exibirCancelamento"
    v-model:is-dialog-visible="exibirConfirmacaoDesativacao"
    confirmation-question="Tem certeza de que deseja apagar este contato?" confirm-title="Deletado!"
    confirm-msg="O contato foi deletado com sucesso." cancel-title="Cancelado" :cancel-msg="mensagemErro"
    @confirm="deletarContact" />
</template>
