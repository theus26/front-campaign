<script setup lang="ts">
import { IBodyLogin } from "@/@core/services/interfaces/auth/IAuthService"
import useAuth from "@/services/auth/useAuth"
import { useToast } from "vue-toast-notification"

const route = useRoute()
const router = useRouter()
const ability = useAbility()
const toast = useToast()

const callback = (response: any) => {
  const credential = response?.credential
  if (!credential) return

  const payload = JSON.parse(
    decodeURIComponent(
      atob(credential.split('.')[1])
        .split('')
        .map(char => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  )

  const body: IBodyLogin = {
    email: payload.email,
    password: ' ',
    name: payload.name || [payload.given_name, payload.family_name].filter(Boolean).join(' '),
  }

  loginWithGoogle(body)
}

const loginWithGoogle = async (body: IBodyLogin) => {
  try {
    const response = await useAuth.loginWithGoogle(body);

    const { userAbilityRules } = response;

    useCookie("userAbilityRules").value = userAbilityRules;
    ability.update(userAbilityRules);

    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : "/");
    });
  } catch (errors: any) {
    console.error('Erro ao fazer login com Google:', errors);
    toast.error(
      errors?.response?.data?.erro ?? errors?.message ?? "Ocorreu um erro inesperado. Tente novamente."
    );
  }
};
</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-1">
    <GoogleLogin :callback="callback" />
  </div>
</template>
