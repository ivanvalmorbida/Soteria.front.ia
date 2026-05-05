import api from './api'

export const lanctoContabilService = {
  async getAll() {
    const response = await api.get('/LanctoContabil')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/LanctoContabil/${codigo}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/LanctoContabil', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/LanctoContabil/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/LanctoContabil/${codigo}`)
    return response.data
  }
}

export default lanctoContabilService
