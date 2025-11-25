import { api } from 'boot/axios'

export const ClientesService = {
  async listar() {
    const { data } = await api.get('/clientes')
    return data
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/clientes/${id}`)
    return data
  },

  async criar(payload) {
    const { data } = await api.post('/clientes', payload)
    return data
  },

  async atualizar(id, payload) {
    const { data } = await api.put(`/clientes/${id}`, payload)
    return data
  },

  async remover(id) {
    await api.delete(`/clientes/${id}`)
  }
}