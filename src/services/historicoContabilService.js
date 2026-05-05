import api from './api'

export const historicoContabilService = {
  async getAll() {
    const response = await api.get('/HistoricoContabil')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/HistoricoContabil/${codigo}`)
    return response.data
  },

  async buscarPorDescricao(descricao) {
    const response = await api.get(`/HistoricoContabil/descricao/${encodeURIComponent(descricao)}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/HistoricoContabil', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/HistoricoContabil/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/HistoricoContabil/${codigo}`)
    return response.data
  }
}

export default historicoContabilService
