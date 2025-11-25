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
      :loading="loading"
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

    <q-dialog v-model="modalAberta">
      <q-card style="width: 450px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">{{ editando ? 'Editar Produto' : 'Novo Produto' }}</div>
          <q-btn flat dense round icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="salvarProduto">
            <q-input
              v-model="form.codigo"
              label="Código"
              outlined
              dense
              class="q-mb-sm"
              required
            />

            <q-input
              v-model="form.nome"
              label="Nome"
              outlined
              dense
              class="q-mb-sm"
              required
            />

            <q-input
              v-model.number="form.quantidade"
              label="Quantidade em Estoque"
              type="number"
              outlined
              dense
              class="q-mb-sm"
              required
            />

            <q-input
              v-model.number="form.preco"
              label="Preço"
              type="number"
              step="0.01"
              outlined
              dense
              class="q-mb-sm"
              required
            />

            <q-select
              v-model="form.categoria"
              :options="opcoesCategorias"
              label="Categoria"
              outlined
              dense
              class="q-mb-md"
              emit-value
              map-options
              :loading="carregandoCategorias"
              clearable
              required
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn
                color="primary"
                :label="editando ? 'Atualizar' : 'Salvar'"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { useProdutosStore } from 'src/stores/Produtos'
import { api } from 'boot/axios'

const produtosStore = useProdutosStore()

const produtos = computed(() => produtosStore.produtos)
const loading = computed(() => produtosStore.loading)

const salvando = ref(false)
const modalAberta = ref(false)
const editando = ref(false)

const categorias = ref([])
const carregandoCategorias = ref(false)

const form = ref({
  id: null,
  codigo: '',
  nome: '',
  quantidade: '',
  preco: '',
  categoria: ''
})

const colunas = [
  { name: 'codigo', label: 'Código', align: 'left', field: 'codigo' },
  { name: 'nome', label: 'Nome', align: 'left', field: 'nome' },
  { name: 'quantidade', label: 'Quantidade em Estoque', align: 'center', field: 'quantidade' },
  {
    name: 'preco',
    label: 'Preço',
    align: 'center',
    field: 'preco',
    format: val =>
      `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  },
  { name: 'categoria', label: 'Categoria', align: 'center', field: 'categoria' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const opcoesCategorias = computed(() =>
  categorias.value.map(c =>
    typeof c === 'string'
      ? { label: c, value: c }
      : {
          label: c.nome ?? c.label ?? String(c),
          value: c.nome ?? c.value ?? String(c)
        }
  )
)

const carregarCategorias = async () => {
  carregandoCategorias.value = true
  try {
    const { data } = await api.get('/categorias')
    categorias.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Erro ao carregar categorias:', err)
    categorias.value = []
  } finally {
    carregandoCategorias.value = false
  }
}

onMounted(async () => {
  await produtosStore.carregarProdutos()
  await carregarCategorias()
})

const abrirModal = () => {
  editando.value = false
  form.value = {
    id: null,
    codigo: '',
    nome: '',
    quantidade: '',
    preco: '',
    categoria: ''
  }
  modalAberta.value = true
}

const salvarProduto = async () => {
  salvando.value = true

  const payload = {
    codigo: form.value.codigo,
    nome: form.value.nome,
    quantidade: Number(form.value.quantidade),
    preco: Number(form.value.preco),
    categoria: form.value.categoria
  }

  try {
    if (editando.value) {
      await produtosStore.atualizarProduto(form.value.id, payload)
      Notify.create({ type: 'positive', message: 'Produto atualizado!' })
    } else {
      await produtosStore.adicionarProduto(payload)
      Notify.create({ type: 'positive', message: 'Produto cadastrado!' })
    }
  } catch (err) {
    console.error('Erro ao salvar produto:', err)
    Notify.create({ type: 'negative', message: 'Erro ao salvar produto.' })
  } finally {
    salvando.value = false
    modalAberta.value = false
  }
}

const editarProduto = produto => {
  editando.value = true
  form.value = { ...produto }
  modalAberta.value = true
}

const excluirProduto = async produto => {
  if (!confirm(`Excluir produto "${produto.nome}"?`)) return

  try {
    await produtosStore.removerProduto(produto.id)
    Notify.create({ type: 'positive', message: 'Produto removido!' })
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao remover produto.' })
  }
}
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