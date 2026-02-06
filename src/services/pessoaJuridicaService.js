import api from './api'

export const pessoaJuridicaService = {
  async getAll() {
    const response = await api.get('/pessoajuridica')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/pessoajuridica/${codigo}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/pessoajuridica', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/pessoajuridica/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/pessoa/${codigo}`)
    return response.data
  }
}

export default pessoaJuridicaService
