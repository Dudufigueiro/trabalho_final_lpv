<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2 flex flex-center">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="width: 360px; max-width: 90vw;">
      <div class="text-center q-mb-md">
        <div class="text-subtitle2">BEM VINDO!</div>
        <div class="text-caption text-grey-7">
          Digite suas credenciais para acessar o sistema
        </div>
      </div>

      <q-form @submit.prevent="login">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          outlined
          dense
          class="q-mb-md"
          placeholder="seu@email.com"
        />

        <q-input
          v-model="senha"
          label="Senha"
          type="password"
          outlined
          dense
          class="q-mb-md"
          placeholder="Digite sua senha"
        />

        <div class="row items-center justify-between q-mb-md">
          <q-checkbox v-model="lembrar" label="Lembrar de mim" size="sm" />
          <q-btn flat label="Esqueceu a senha?" color="primary" @click="recuperarSenha" />
        </div>

        <q-btn
          label="Entrar"
          type="submit"
          color="primary"
          unelevated
          class="full-width"
        />

        <q-separator spaced />

        <div class="text-center text-caption">
          Não tem uma conta?
          <q-btn flat color="primary" label="Cadastre-se" @click="cadastro" />
        </div>
      </q-form>
    </q-card>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const senha = ref('')
const lembrar = ref(false)

const login = () => {
  if (email.value && senha.value) {
    router.push('/app/home')
  } else {
    alert('Por favor, preencha o email e a senha.')
  }
}

</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>