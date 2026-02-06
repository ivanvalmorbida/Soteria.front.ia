import api from './api'

export const authService = {
  async login(usuario, senha) {
    const response = await api.post('/auth/login', { usuario, senha })
    return response.data
  },

  async register(nome, usuario, senha, tipo = 'U') {
    const response = await api.post('/auth/register', { 
      nome, 
      usuario, 
      senha, 
      tipo 
    })
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async changePassword(senhaAtual, novaSenha) {
    const response = await api.post('/auth/change-password', {
      senhaAtual,
      novaSenha
    })
    return response.data
  }
}

export default authService
