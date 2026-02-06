<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md animate-fade-in">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-2xl">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gradient mb-2">Criar Conta</h1>
        <p class="text-dark-300">Preencha os dados para se cadastrar</p>
      </div>

      <!-- Register Card -->
      <div class="card p-8 mb-4">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium text-dark-200 mb-2">
              Nome Completo
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                v-model="form.nome"
                type="text"
                required
                class="input-field pl-10"
                placeholder="João Silva Santos"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- E-mail -->
          <div>
            <label class="block text-sm font-medium text-dark-200 mb-2">
              E-mail
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                v-model="form.usuario"
                type="email"
                required
                class="input-field pl-10"
                placeholder="seu@email.com"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Senha -->
          <div>
            <label class="block text-sm font-medium text-dark-200 mb-2">
              Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="form.senha"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="input-field pl-10 pr-10"
                placeholder="Mínimo 6 caracteres"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="loading"
              >
                <svg v-if="!showPassword" class="w-5 h-5 text-dark-400 hover:text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5 text-dark-400 hover:text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p class="mt-1 text-xs text-dark-500">A senha deve ter no mínimo 6 caracteres</p>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label class="block text-sm font-medium text-dark-200 mb-2">
              Confirmar Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                v-model="form.confirmarSenha"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pl-10"
                placeholder="Digite a senha novamente"
                :disabled="loading"
              />
            </div>
            <p v-if="form.senha && form.confirmarSenha && form.senha !== form.confirmarSenha" class="mt-1 text-xs text-red-600">
              As senhas não coincidem
            </p>
          </div>

          <!-- Termos -->
          <div class="flex items-start">
            <input
              v-model="form.aceitoTermos"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 text-primary-600 border-dark-600 rounded focus:ring-primary-500"
              :disabled="loading"
            />
            <label class="ml-2 text-sm text-dark-200">
              Eu concordo com os
              <a href="#" class="text-primary-600 hover:underline">Termos de Serviço</a>
              e
              <a href="#" class="text-primary-600 hover:underline">Política de Privacidade</a>
            </label>
          </div>

          <!-- Botão Cadastrar -->
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading || form.senha !== form.confirmarSenha"
          >
            <span v-if="!loading" class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Criar Conta
            </span>
            <span v-else class="flex items-center justify-center">
              <div class="loader mr-2"></div>
              Cadastrando...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-dark-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-dark-800 text-dark-300">ou</span>
          </div>
        </div>

        <!-- Já tem conta -->
        <div class="text-center">
          <span class="text-dark-300">Já tem uma conta? </span>
          <router-link
            to="/login"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Faça login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const form = ref({
  nome: '',
  usuario: '',
  senha: '',
  confirmarSenha: '',
  aceitoTermos: false
})

const showPassword = ref(false)
const loading = ref(false)

const handleRegister = async () => {
  if (form.value.senha !== form.value.confirmarSenha) {
    toast.error('As senhas não coincidem')
    return
  }

  if (!form.value.aceitoTermos) {
    toast.error('Você precisa aceitar os termos')
    return
  }

  loading.value = true
  
  try {
    const result = await authStore.register(
      form.value.nome,
      form.value.usuario,
      form.value.senha
    )
    
    if (result.success) {
      toast.success('Conta criada com sucesso!')
      router.push('/')
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    toast.error('Erro ao criar conta')
  } finally {
    loading.value = false
  }
}
</script>
