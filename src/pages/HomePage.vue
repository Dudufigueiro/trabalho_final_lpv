<template>
  <q-page padding>
    <div class="text-h6 text-weight-medium q-mb-lg">
      Bem-vindo, Eduardo!
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4" v-for="card in cards" :key="card.label">
        <q-card class="q-pa-lg text-center bg-white rounded-borders shadow-1">
          <q-icon :name="card.icon" size="40px" color="positive" />
          <div class="text-caption text-grey-7 q-mt-sm">{{ card.label }}</div>
          <div class="text-h5 text-bold q-mt-xs">{{ card.value }}</div>
        </q-card>
      </div>
    </div>

    <q-card class="q-pa-md bg-white rounded-borders shadow-1">
      <div class="text-h6 q-mb-md text-weight-bold">Produtos Mais Vendidos</div>

      <q-table
        :rows="produtos"
        :columns="colunas"
        row-key="codigo"
        flat
        bordered
        dense
        hide-bottom
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const cards = [
  { label: 'Total de Clientes', value: '5,423', icon: 'group' },
  { label: 'Total de Vendas', value: '1,893', icon: 'shopping_cart' },
  { label: 'Total de Vendas (R$)', value: '189', icon: 'monitor' },
]

const colunas = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' },
  { name: 'produto', label: 'Produto', field: 'produto', align: 'left' },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'center' },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'valorTotal', label: 'Valor Total', field: 'valorTotal', align: 'right' },
]

const produtos = ref([
  { codigo: '101', produto: 'Camiseta Casual', quantidade: 150, categoria: 'Vestuário', valorTotal: 'R$ 7.500' },
  { codigo: '102', produto: 'Calça Jeans', quantidade: 120, categoria: 'Vestuário', valorTotal: 'R$ 6.000' },
  { codigo: '103', produto: 'Tênis Esportivo', quantidade: 80, categoria: 'Calçados', valorTotal: 'R$ 4.000' },
  { codigo: '104', produto: 'Boné', quantidade: 200, categoria: 'Acessórios', valorTotal: 'R$ 2.000' },
  { codigo: '105', produto: 'Mochila', quantidade: 50, categoria: 'Acessórios', valorTotal: 'R$ 2.500' },
])
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>