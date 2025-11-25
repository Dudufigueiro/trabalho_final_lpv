<template>
  <q-page class="q-pa-lg">

    <div class="text-h5 q-mb-lg"><b>Listagem de Produtos</b></div>

    <div class="row justify-end q-mb-md">
      <q-btn label="Adicionar Produto" color="primary" unelevated rounded @click="abrirModal" />
    </div>

    <q-table
      :rows="produtos"
      :columns="colunas"
      row-key="id"
      flat bordered
      class="shadow-1"
      :loading="carregando"
      loading-label="Carregando produtos..."
    >

      <template #body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn flat size="sm" color="primary" label="Editar" @click="editarProduto(props.row)" />
          <q-btn flat size="sm" color="negative" label="Excluir" @click="excluirProduto(props.row)" />
        </q-td>
      </template>

      <template #bottom>
        <div class="text-caption text-bold q-pa-sm">
          Mostrando 1 até {{ produtos.length }} de {{ produtos.length }} Registros
        </div>
      </template>

    </q-table>

    <q-dialog v-model="modalAberta" persistent>
      <q-card style="width: 450px; max-width: 90vw;">

        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Novo Produto</div>
          <q-btn flat dense round icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="salvarProduto">

            <q-input v-model="form.codigo" label="Código" outlined dense class="q-mb-sm" required />
            <q-input v-model="form.nome" label="Nome" outlined dense class="q-mb-sm" required />
            <q-input v-model.number="form.quantidade" label="Quantidade em Estoque" type="number" outlined dense class="q-mb-sm" required />
            <q-input v-model.number="form.preco" label="Preço" type="number" step="0.01" outlined dense class="q-mb-sm" required />
            <q-input v-model="form.categoria" label="Categoria" outlined dense class="q-mb-md" required />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn color="primary" label="Salvar" type="submit" :loading="salvando" />
            </div>

          </q-form>
        </q-card-section>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'

const produtos = ref([])
const carregando = ref(false)
const salvando = ref(false)
const modalAberta = ref(false)

const form = ref({
  codigo: "",
  nome: "",
  quantidade: "",
  preco: "",
  categoria: ""
})

const colunas = [
  { name: 'codigo', label: 'Código', align: 'left', field: 'codigo' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'quantidade', label: 'Quantidade em Estoque', align: 'center', field: 'quantidade' },
  { name: 'preco', label: 'Preço', align: 'center', field: 'preco',
    format: (val) => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  },
  { name: 'categoria', label: 'Categoria', align: 'center', field: 'categoria' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const carregarProdutos = async () => {
  carregando.value = true

  produtos.value = [
    { id: 1, codigo: '1', nome: 'Notebook Gamer', quantidade: 10, preco: 5500, categoria: 'Eletrônicos' },
    { id: 2, codigo: '2', nome: 'Mouse Sem Fio', quantidade: 50, preco: 80, categoria: 'Periféricos' },
    { id: 3, codigo: '3', nome: 'Teclado Mecânico', quantidade: 30, preco: 250, categoria: 'Periféricos' },
    { id: 4, codigo: '4', nome: 'Monitor 27"', quantidade: 15, preco: 1200, categoria: 'Eletrônicos' },
    { id: 5, codigo: '5', nome: 'Headset Gamer', quantidade: 20, preco: 300, categoria: 'Periféricos' }
  ]

  carregando.value = false
}

const abrirModal = () => {
  form.value = { codigo: "", nome: "", quantidade: "", preco: "", categoria: "" }
  modalAberta.value = true
}

const salvarProduto = async () => {
  salvando.value = true
  await new Promise(r => setTimeout(r, 800))

  produtos.value.push({
    id: produtos.value.length + 1,
    ...form.value
  })

  Notify.create({ type: 'positive', message: 'Produto cadastrado com sucesso!' })
  modalAberta.value = false
  salvando.value = false
}

const editarProduto = (produto) => {
  Notify.create({ type: 'info', message: `Editar produto ID ${produto.id} (implementar...)` })
}

const excluirProduto = (produto) => {
  if (!confirm(`Excluir produto "${produto.nome}"?`)) return
  produtos.value = produtos.value.filter(p => p.id !== produto.id)
  Notify.create({ type: 'positive', message: 'Produto removido!' })
}

onMounted(carregarProdutos)
</script>

<style scoped>
.q-page {
  background: #fff;
}
.text-h5 {
  font-size: 22px;
  font-weight: 600;
}
.q-table {
  border-radius: 10px;
}
</style>