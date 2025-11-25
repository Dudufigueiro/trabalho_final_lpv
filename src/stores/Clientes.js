import { defineStore } from 'pinia'
import { ClientesService } from '../services/Clientes'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarClientes() {
      this.loading = true
      this.error = null

      try {
        const data = await ClientesService.listar()

        if (Array.isArray(data)) {
          this.clientes = data
        } else {
          console.warn('Dados recebidos de /clientes não são um array:', data)
          this.clientes = []
        }
      } catch (err) {
        console.error('Erro ao carregar clientes:', err)
        this.error = 'Erro ao carregar clientes.'
        this.clientes = []
      } finally {
        this.loading = false
      }
    },

    async adicionarCliente(payload) {
      this.loading = true
      this.error = null

      try {
        const criado = await ClientesService.criar(payload)

        if (criado) {
          this.clientes.push(criado)
        }

        return criado
      } catch (err) {
        console.error('Erro ao criar cliente:', err)
        this.error = 'Erro ao criar cliente.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizarCliente(id, payload) {
      this.loading = true
      this.error = null

      try {
        const atualizado = await ClientesService.atualizar(id, payload)

        const idx = this.clientes.findIndex(c => c.id === id)
        if (idx !== -1) {
          this.clientes.splice(idx, 1, atualizado)
        }

        return atualizado
      } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        this.error = 'Erro ao atualizar cliente.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async removerCliente(id) {
      this.loading = true
      this.error = null

      try {
        await ClientesService.remover(id)
        this.clientes = this.clientes.filter(c => c.id !== id)
      } catch (err) {
        console.error('Erro ao remover cliente:', err)
        this.error = 'Erro ao remover cliente.'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})