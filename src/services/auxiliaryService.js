import api from './api'

export const auxiliaryService = {
  async getEstados() {
    const response = await api.get('/estado')
    return response.data
  },

  async getCidades(estadoId = null) {
    const url = estadoId ? `/cidade/estado/${estadoId}` : '/cidade'
    const response = await api.get(url)
    return response.data
  },

  async buscarCep(cep) {
    const response = await api.get(`/cep/${cep}`)
    return response.data
  },

  async getTiposTelefone() {
    const response = await api.get('/tipotelefone')
    return response.data
  },

  async getTiposEnderecoEletronico() {
    const response = await api.get('/tipoenderecoeletronico')
    return response.data
  },

  async getEstadosCivis() {
    const response = await api.get('/estadocivil')
    return response.data
  },

  async getNacionalidades() {
    const response = await api.get('/nacionalidade')
    return response.data
  },

  async getProfissoes() {
    const response = await api.get('/cbo')
    return response.data
  }
}

export default auxiliaryService
