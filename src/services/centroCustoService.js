import api from './api'

export const centroCustoService = {
  async getAll() {
    const response = await api.get('/CentroCusto')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/CentroCusto/${codigo}`)
    return response.data
  },

  async buscarPorDescricao(descricao) {
    const response = await api.get(`/CentroCusto/descricao/${encodeURIComponent(descricao)}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/CentroCusto', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/CentroCusto/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/CentroCusto/${codigo}`)
    return response.data
  }
}

export default centroCustoService
