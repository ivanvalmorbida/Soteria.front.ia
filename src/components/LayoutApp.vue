<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="glass-effect border-b border-dark-700 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <router-link to="/" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/50 transition-all glow-primary">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gradient">Sistema de Cadastro</span>
            </router-link>

            <nav class="hidden md:flex space-x-1">
              <router-link
                to="/"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-dark-700 text-dark-300 hover:text-dark-100"
                active-class="bg-primary-600/20 text-primary-400"
              >
                Início
              </router-link>
              <router-link
                to="/pessoas-fisicas"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-dark-700 text-dark-300 hover:text-dark-100"
                active-class="bg-primary-600/20 text-primary-400"
              >
                Pessoas Físicas
              </router-link>
              <router-link
                to="/pessoas-juridicas"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-dark-700 text-dark-300 hover:text-dark-100"
                active-class="bg-primary-600/20 text-primary-400"
              >
                Pessoas Jurídicas
              </router-link>
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-dark-100">{{ authStore.userName }}</p>
                <p class="text-xs text-dark-400">{{ userTypeLabel }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-primary-500/30">
                {{ userInitials }}
              </div>
            </div>
            <button
              @click="handleLogout"
              class="hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-medium text-dark-300 hover:bg-dark-700 hover:text-dark-100 transition-colors"
              title="Sair"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors text-dark-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide">
        <div v-if="showMobileMenu" class="md:hidden border-t border-dark-700 bg-dark-800/95 backdrop-blur-lg">
          <nav class="px-4 py-4 space-y-2">
            <router-link
              to="/"
              @click="toggleMobileMenu"
              class="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-700 text-dark-300"
              active-class="bg-primary-600/20 text-primary-400"
            >
              Início
            </router-link>
            <router-link
              to="/pessoas-fisicas"
              @click="toggleMobileMenu"
              class="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-700 text-dark-300"
              active-class="bg-primary-600/20 text-primary-400"
            >
              Pessoas Físicas
            </router-link>
            <router-link
              to="/pessoas-juridicas"
              @click="toggleMobileMenu"
              class="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-700 text-dark-300"
              active-class="bg-primary-600/20 text-primary-400"
            >
              Pessoas Jurídicas
            </router-link>
            <div class="border-t border-dark-700 my-2 pt-2">
              <div class="px-4 py-2">
                <p class="text-sm font-medium text-dark-100">{{ authStore.userName }}</p>
                <p class="text-xs text-dark-400">{{ userTypeLabel }}</p>
              </div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20"
              >
                <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </nav>
        </div>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-dark-700 bg-dark-800/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-sm text-dark-400">
          <p>&copy; 2024 Sistema de Cadastro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const userInitials = computed(() => {
  if (!authStore.userName) return 'U'
  const names = authStore.userName.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return authStore.userName.substring(0, 2).toUpperCase()
})

const userTypeLabel = computed(() => {
  const types = {
    'A': 'Administrador',
    'U': 'Usuário',
    'G': 'Gerente'
  }
  return types[authStore.userType] || 'Usuário'
})

const handleLogout = () => {
  authStore.logout()
  toast.success('Você saiu do sistema')
  router.push('/login')
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
