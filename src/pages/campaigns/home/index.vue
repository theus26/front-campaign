<script setup lang="ts">
const nomeUsuario = ref("")
onMounted(() => {
  const userData = useCookie<any>("userData");
  nomeUsuario.value = userData.value.name

})
</script>

<template>
  <VCardText>
    <VRow class="py-6">
      <VCol cols="12" md="4">
        <div class="pe-3">
          <h5 class="text-h5 mb-2">
            Bem vindo de volta,
            <span class="text-h4"> {{ nomeUsuario }} 👋🏻 </span>
          </h5>
          <div class="text-wrap text-body-1" style="max-inline-size: 360px">
            Que bom ver você novamente. Tudo pronto para começar.
          </div>
        </div>
      </VCol>
    </VRow>
  </VCardText>
</template>
