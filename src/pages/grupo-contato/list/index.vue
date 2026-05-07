<script setup lang="ts">
import { formatInputNumber } from '@/composables/Contacts/useFormatNumberComposable';
import { useGroupContact } from '@/composables/Group-contacts/useGroupContact';
const { data, itemsPerPage, loading, page, nome, totalRecords, headers, exibirEdicao, exibirCancelamento, exibirSucesso, exibirConfirmacaoDesativacao, mensagemErro, itemEditado, contatos, exibirPreviewGrupo, grupoSelecionado, abrirPreviewGrupo, abrirConfirmacaoExclusao, updateOptions, formatarData, gerarPreviewParticipantes, getGroupColor, getInitials, abrirEdicao, deletarGroupContact, salvarEdicao, customFilter } = useGroupContact();

</script>

<template>
  <VCard title="Grupo de Contatos" subtitle="Gerencie grupos e encontre contatos sincronizados por nome ou número"
    class="mb-6">
    <VDivider />

    <div class="d-flex align-center gap-4 ma-6">

      <AppTextField v-model="nome" placeholder="Buscar por nome" class="flex-grow-1" />

      <VBtn color="primary" prepend-icon="tabler-plus" @click="$router.push('/grupo-contato/add')">
        Criar Grupo
      </VBtn>
    </div>


    <VDivider class="mt-4" />

    <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers" :items="data"
      :items-length="totalRecords" :loading="loading" loading-text="Carregando grupos..." item-value="grupoId"
      class="text-no-wrap" @update:options="updateOptions">

      <template #item.grupo="{ item }">
        <div class="d-flex align-center gap-x-4 py-2">
          <VAvatar size="42" rounded :style="{ backgroundColor: getGroupColor(item.nome) }">
            <span class="text-white font-weight-bold">
              {{ getInitials(item.nome) }}
            </span>
          </VAvatar>

          <div class="d-flex flex-column">
            <span class="text-body-1 font-weight-medium text-high-emphasis">
              {{ item.nome }}
            </span>
          </div>
        </div>
      </template>

      <template #item.totalParticipantes="{ item }">
        <div class="text-center">
          <VChip color="primary" size="small" variant="tonal">
            {{ item.contatosGrupoDto.length }} membros
          </VChip>
        </div>
      </template>

      <!-- Preview -->
      <template #item.preview="{ item }">
        <span class="text-body-2 text-medium-emphasis">
          {{ gerarPreviewParticipantes(item.contatosGrupoDto) }}
        </span>
      </template>

      <!-- Criado em -->
      <template #item.createdAt="{ item }">
        <span class="text-body-2">
          {{ formatarData(item.dataCriacao) }}
        </span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-center">
          <VTooltip text="Editar Grupo">
            <template #activator="{ props }">
              <IconBtn v-bind="props" @click="abrirEdicao(item)">
                <VIcon icon="tabler-edit" color="primary" />
              </IconBtn>
            </template>
          </VTooltip>

          <VTooltip text="Visualizar Grupo">
            <template #activator="{ props }">
              <IconBtn v-bind="props" @click="abrirPreviewGrupo(item)">
                <VIcon icon="tabler-eye" color="info" />
              </IconBtn>
            </template>
          </VTooltip>

          <VTooltip text="Excluir Grupo">
            <template #activator="{ props }">
              <IconBtn v-bind="props" @click="abrirConfirmacaoExclusao(item)">
                <VIcon icon="tabler-trash" color="error" />
              </IconBtn>
            </template>
          </VTooltip>
        </div>
      </template>

      <template #bottom>
        <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalRecords" />
      </template>
    </VDataTableServer>
  </VCard>

  <VDialog v-model="exibirEdicao" max-width="700px">
    <DialogCloseBtn @click="exibirEdicao = false" />

    <VCard>
      <!-- Header -->
      <VCardItem>
        <template #prepend>
          <VAvatar color="primary" variant="tonal">
            <VIcon icon="tabler-users-group" />
          </VAvatar>
        </template>

        <VCardTitle class="text-h5">
          Editar Grupo
        </VCardTitle>

        <VCardSubtitle>
          Atualize o nome do grupo e gerencie os participantes
        </VCardSubtitle>
      </VCardItem>

      <VDivider />

      <!-- Conteúdo -->
      <VCardText class="pt-6">
        <VRow>
          <!-- Nome do grupo -->
          <VCol cols="12">
            <AppTextField v-model="itemEditado.nome" label="Nome do Grupo" placeholder="Ex: Grupo Financeiro"
              prepend-inner-icon="tabler-users-group" />
          </VCol>

          <!-- Participantes -->
          <VCol cols="12">
            <AppAutocomplete v-model="itemEditado.contatosGrupoDto" label="Participantes"
              placeholder="Selecione os contatos" :items="contatos" item-title="nome" item-value="numero"
              :custom-filter="customFilter" multiple chips closable-chips clearable :return-object="true"
              prepend-inner-icon="tabler-users">
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

            <!-- Helper -->
            <div class="text-caption text-medium-emphasis mt-2">
              {{ itemEditado.contatosGrupoDto?.length || 0 }} contato(s) selecionado(s)
            </div>
          </VCol>

          <!-- Preview selecionados -->
          <VCol v-if="itemEditado.contatosGrupoDto?.length" cols="12">
            <VCard border flat>
              <VCardText>
                <div class="text-subtitle-2 font-weight-bold mb-3">
                  Participantes Selecionados
                </div>

                <div class="d-flex flex-wrap gap-2">
                  <VChip v-for="item in itemEditado.contatosGrupoDto" :key="item.numero" color="primary"
                    variant="outlined" size="small">
                    {{ formatInputNumber(item.numero) }}
                  </VChip>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <!-- Footer -->
      <VCardText>
        <div class="d-flex justify-end gap-3">
          <VBtn color="error" variant="outlined" prepend-icon="tabler-x" @click="exibirEdicao = false">
            Cancelar
          </VBtn>

          <VBtn color="primary" prepend-icon="tabler-device-floppy" :loading="loading" @click="salvarEdicao">
            Salvar Alterações
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="exibirPreviewGrupo" max-width="800">
    <DialogCloseBtn @click="exibirPreviewGrupo = false" />

    <VCard>
      <VCardItem>
        <template #prepend>
          <VAvatar color="primary" variant="tonal">
            <VIcon icon="tabler-users-group" />
          </VAvatar>
        </template>

        <VCardTitle class="text-h5">
          {{ grupoSelecionado?.nome }}
        </VCardTitle>

        <VCardSubtitle>
          Visualização dos participantes do grupo
        </VCardSubtitle>

        <template #append>
          <VChip color="primary" variant="tonal">
            {{ grupoSelecionado?.contatosGrupoDto?.length || 0 }}
            contatos
          </VChip>
        </template>
      </VCardItem>

      <VDivider />

      <VCardText class="pt-6">
        <VRow v-if="grupoSelecionado?.contatosGrupoDto?.length">
          <VCol v-for="(contato, index) in grupoSelecionado.contatosGrupoDto" :key="`${contato.numero}-${index}`"
            cols="12" md="6">
            <VCard border flat>
              <VCardText>
                <div class="d-flex align-center gap-x-3">
                  <!-- Avatar -->
                  <VAvatar size="42" color="primary" variant="tonal">
                    {{ getInitials(contato.nome) }}
                  </VAvatar>

                  <!-- Infos -->
                  <div class="d-flex flex-column">
                    <span class="font-weight-medium text-body-1">
                      {{ contato.nome }}
                    </span>

                    <span class="text-body-2 text-medium-emphasis">
                      {{ formatInputNumber(contato.numero) }}
                    </span>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <VAlert v-else type="info" variant="tonal">
          Nenhum participante encontrado neste grupo.
        </VAlert>
      </VCardText>

      <VDivider />

      <VCardText>
        <div class="d-flex justify-end">
          <VBtn color="primary" prepend-icon="tabler-x" @click="exibirPreviewGrupo = false">
            Fechar
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <ConfirmDialog v-model:showSuccess="exibirSucesso" v-model:showCancel="exibirCancelamento"
    v-model:is-dialog-visible="exibirConfirmacaoDesativacao"
    confirmation-question="Tem certeza de que deseja apagar este grupo?" confirm-title="Deletado!"
    confirm-msg="O grupo foi deletado com sucesso." cancel-title="Cancelado" :cancel-msg="mensagemErro"
    @confirm="deletarGroupContact" />
</template>
