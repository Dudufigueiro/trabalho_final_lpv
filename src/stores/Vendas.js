import { defineStore } from 'pinia'
import { VendasService } from 'src/services/Vendas'

export const useVendasStore = defineStore('vendas', {
  state: () => ({
    vendas: [],
    loading: false,
    error: null
  }),

  actions: {
    async carregarVendas() {
      this.loading = true
      this.error = null
      try {
        const data = await VendasService.listar()
        this.vendas = Array.isArray(data) ? data : []
      } catch (err) {
        console.error('Erro ao carregar vendas:', err)
        this.error = 'Erro ao carregar vendas.'
        this.vendas = []
      } finally {
        this.loading = false
      }
    },

    async adicionarVenda(payload) {
      this.loading = true
      this.error = null
      try {
        const criada = await VendasService.criar(payload)
        this.vendas.push(criada)
        return criada
      } catch (err) {
        console.error('Erro ao criar venda:', err)
        this.error = 'Erro ao criar venda.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async atualizarVenda(id, payload) {
      this.loading = true
      this.error = null
      try {
        const atualizada = await VendasService.atualizar(id, payload)
        const idx = this.vendas.findIndex(v => v.id === id)
        if (idx !== -1) {
          this.vendas[idx] = atualizada
        }
        return atualizada
      } catch (err) {
        console.error('Erro ao atualizar venda:', err)
        this.error = 'Erro ao atualizar venda.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async removerVenda(id) {
      this.loading = true
      this.error = null
      try {
        await VendasService.remover(id)
        this.vendas = this.vendas.filter(v => v.id !== id)
      } catch (err) {
        console.error('Erro ao remover venda:', err)
        this.error = 'Erro ao remover venda.'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})