import api from './api'

export const planoContaService = {
  async getAll() {
    const response = await api.get('/PlanoConta')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/PlanoConta/${codigo}`)
    return response.data
  },

  async getByTipo(tipo) {
    const response = await api.get(`/PlanoConta/tipo/${encodeURIComponent(tipo)}`)
    return response.data
  },

  async buscarPorDescricao(descricao) {
    const response = await api.get(`/PlanoConta/descricao/${encodeURIComponent(descricao)}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/PlanoConta', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/PlanoConta/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/PlanoConta/${codigo}`)
    return response.data
  }
}

export default planoContaService
