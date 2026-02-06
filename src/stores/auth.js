import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.nome || '')
  const userType = computed(() => user.value?.tipo || '')

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const login = async (usuario, senha) => {
    try {
      loading.value = true
      const response = await authService.login(usuario, senha)
      setToken(response.token)
      setUser(response.usuario)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login'
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (nome, usuario, senha, tipo = 'U') => {
    try {
      loading.value = true
      const response = await authService.register(nome, usuario, senha, tipo)
      setToken(response.token)
      setUser(response.usuario)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao registrar'
      }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      // Tenta buscar dados do usuário para validar o token
      const userData = await authService.getCurrentUser()
      setUser(userData)
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userName,
    userType,
    login,
    register,
    logout,
    checkAuth
  }
})
