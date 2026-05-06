import api from './api'

export const hospedagemService = {
  async getAll() {
    const response = await api.get('/Hospedagem')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/Hospedagem/${codigo}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/Hospedagem', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/Hospedagem/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/Hospedagem/${codigo}`)
    return response.data
  }
}

export default hospedagemService
