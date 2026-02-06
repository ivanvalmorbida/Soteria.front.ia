<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md animate-fade-in">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-2xl">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-gradient mb-2">Sistema de Cadastro</h1>
        <p class="text-dark-300">Entre para continuar</p>
      </div>

      <!-- Login Card -->
      <div class="card p-8 mb-4">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
                class="input-field pl-10 pr-10"
                placeholder="••••••••"
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
          </div>

          <!-- Lembrar-me e Esqueci senha -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-dark-600 rounded focus:ring-primary-500"
                :disabled="loading"
              />
              <span class="ml-2 text-sm text-dark-200">Lembrar-me</span>
            </label>
            <button
              type="button"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              @click="showForgotPassword = true"
              :disabled="loading"
            >
              Esqueci minha senha
            </button>
          </div>

          <!-- Botão Login -->
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="!loading" class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Entrar
            </span>
            <span v-else class="flex items-center justify-center">
              <div class="loader mr-2"></div>
              Entrando...
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

        <!-- Cadastre-se -->
        <div class="text-center">
          <span class="text-dark-300">Não tem uma conta? </span>
          <router-link
            to="/register"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Cadastre-se
          </router-link>
        </div>
      </div>

      <!-- Info adicional -->
      <div class="text-center text-sm text-dark-300">
        <p>Ao entrar, você concorda com nossos</p>
        <p>
          <a href="#" class="text-primary-600 hover:underline">Termos de Serviço</a>
          e
          <a href="#" class="text-primary-600 hover:underline">Política de Privacidade</a>
        </p>
      </div>
    </div>

    <!-- Modal Esqueci Senha -->
    <teleport to="body">
      <div
        v-if="showForgotPassword"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showForgotPassword = false"
      >
        <div class="card p-6 max-w-md w-full animate-slide-up">
          <h3 class="text-xl font-bold text-dark-100 mb-4">Recuperar Senha</h3>
          <p class="text-dark-300 mb-6">
            Digite seu e-mail e enviaremos instruções para recuperar sua senha.
          </p>
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <input
                v-model="forgotEmail"
                type="email"
                required
                class="input-field"
                placeholder="seu@email.com"
              />
            </div>
            <div class="flex gap-3 justify-end">
              <button
                type="button"
                @click="showForgotPassword = false"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
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
  usuario: '',
  senha: '',
  rememberMe: false
})

const showPassword = ref(false)
const loading = ref(false)
const showForgotPassword = ref(false)
const forgotEmail = ref('')

const handleLogin = async () => {
  loading.value = true
  
  try {
    const result = await authStore.login(form.value.usuario, form.value.senha)
    
    if (result.success) {
      toast.success('Login realizado com sucesso!')
      router.push('/')
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    toast.error('Erro ao fazer login')
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  toast.info('Funcionalidade em desenvolvimento')
  showForgotPassword.value = false
  forgotEmail.value = ''
}
</script>
