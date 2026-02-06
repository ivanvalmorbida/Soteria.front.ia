import api from './api'

export const pessoaFisicaService = {
  async getAll() {
    const response = await api.get('/pessoafisica')
    return response.data
  },

  async getById(codigo) {
    const response = await api.get(`/pessoafisica/${codigo}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/pessoafisica', data)
    return response.data
  },

  async update(codigo, data) {
    const response = await api.put(`/pessoafisica/${codigo}`, {
      codigo,
      ...data
    })
    return response.data
  },

  async delete(codigo) {
    const response = await api.delete(`/pessoa/${codigo}`)
    return response.data
  },

  async search(termo) {
    const response = await api.get(`/pessoa/search?termo=${termo}`)
    return response.data
  }
}

export default pessoaFisicaService
