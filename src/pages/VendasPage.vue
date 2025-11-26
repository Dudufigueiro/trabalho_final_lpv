<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-lg"><b>Listagem de Vendas</b></div>

    <div class="row justify-end q-mb-md">
      <q-btn
        label="Nova Venda"
        color="primary"
        unelevated
        rounded
        @click="novaVenda"
      />
    </div>

    <q-table
      :rows="vendasPaginadas"
      :columns="colunas"
      row-key="id"
      flat
      bordered
      class="shadow-1"
      :loading="loadingVendas"
      loading-label="Carregando vendas..."
    >
      <template #body-cell-acoes="props">
        <q-td class="text-center">
          <q-btn flat size="sm" color="primary" label="Editar" @click="editarVenda(props.row)" />
          <q-btn flat size="sm" color="negative" label="Excluir" @click="excluirVenda(props.row)" />
          <q-btn flat size="sm" color="dark" label="Detalhes" @click="abrirDetalhes(props.row)" />
        </q-td>
      </template>

      <template #body-cell-cliente="props">
        <q-td class="text-center">
          <span class="texto-link">{{ props.row.clienteNome }}</span>
        </q-td>
      </template>

      <template #body-cell-vendedor="props">
        <q-td class="text-center">
          <span class="texto-link">{{ props.row.vendedorNome }}</span>
        </q-td>
      </template>

      <template #bottom>
        <div class="row items-center justify-between full-width q-pa-sm">
          <div class="text-caption text-bold">
            Mostrando {{ rangeInicio }} até {{ rangeFim }} de {{ vendasComNomes.length }} Registros
          </div>

          <div class="row items-center q-gutter-xs">
            <q-btn
              dense
              flat
              icon="chevron_left"
              :disable="pagina === 1"
              @click="pagina--"
            />
            <div class="text-caption">
              Página {{ pagina }} de {{ totalPaginas }}
            </div>
            <q-btn
              dense
              flat
              icon="chevron_right"
              :disable="pagina === totalPaginas"
              @click="pagina++"
            />
          </div>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="modalVendaAberta">
      <q-card style="width: 700px; max-width: 95vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            {{ editando ? 'Editar Venda' : 'Nova Venda' }}
          </div>
          <q-btn flat dense round icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="salvarVenda">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.data"
                  label="Data da Venda"
                  type="date"
                  outlined
                  dense
                  required
                />
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.clienteId"
                  :options="opcoesClientes"
                  label="Cliente"
                  outlined
                  dense
                  emit-value
                  map-options
                  required
                />
              </div>

              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.vendedorId"
                  :options="opcoesVendedores"
                  label="Vendedor"
                  outlined
                  dense
                  emit-value
                  map-options
                  required
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1 q-mb-sm"><b>Itens da Venda</b></div>

            <div class="row q-col-gutter-sm items-center q-mb-sm">
              <div class="col-12 col-md-5">
                <q-select
                  v-model="itemAtual.produtoId"
                  :options="opcoesProdutos"
                  label="Produto"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>
              <div class="col-6 col-md-2">
                <q-input
                  v-model.number="itemAtual.quantidade"
                  label="Qtd."
                  type="number"
                  min="1"
                  outlined
                  dense
                />
              </div>
              <div class="col-6 col-md-3">
                <q-input
                  :model-value="precoAtualFormatado"
                  label="Preço Unit."
                  outlined
                  dense
                  readonly
                />
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  label="Adicionar"
                  color="primary"
                  unelevated
                  class="full-width"
                  @click="adicionarItem"
                />
              </div>
            </div>

            <q-table
              :rows="itens"
              :columns="colunasItens"
              row-key="produtoId"
              dense
              flat
              bordered
              hide-bottom
              class="q-mb-md"
            >
              <template #body-cell-acoes="props">
                <q-td class="text-center">
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    @click="removerItem(props.row)"
                  />
                </q-td>
              </template>
            </q-table>

            <div class="row justify-end q-mt-md">
              <div class="text-subtitle2 q-mr-md">
                <b>Total: {{ formatMoney(total) }}</b>
              </div>
            </div>

            <div class="row justify-end q-gutter-sm q-mt-md">
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

    <q-dialog v-model="modalDetalhesAberta">
      <q-card style="width: 600px; max-width: 95vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            Detalhes da Venda {{ vendaDetalhe?.id ?? '' }}
          </div>
          <q-btn flat dense round icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-md">
            <div><b>Data:</b> {{ vendaDetalhe?.data }}</div>
            <div><b>Cliente:</b> {{ nomeCliente(vendaDetalhe?.clienteId) }}</div>
            <div><b>Vendedor:</b> {{ nomeVendedor(vendaDetalhe?.vendedorId) }}</div>
          </div>

          <q-table
            :rows="itensDetalhe"
            :columns="colunasItens"
            row-key="produtoId"
            dense
            flat
            bordered
            hide-bottom
          />

          <div class="row justify-end q-mt-md">
            <div class="text-subtitle2">
              <b>Total: {{ formatMoney(totalDetalhe) }}</b>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import { api } from 'boot/axios'
import { useVendasStore } from 'src/stores/Vendas'

const vendasStore = useVendasStore()

const clientes = ref([])
const vendedores = ref([])
const produtos = ref([])

const modalVendaAberta = ref(false)
const modalDetalhesAberta = ref(false)
const editando = ref(false)
const salvando = ref(false)

const form = ref({
  id: null,
  data: '',
  clienteId: null,
  vendedorId: null
})

const itens = ref([])
const itemAtual = ref({ produtoId: null, quantidade: 1 })
const vendaDetalhe = ref(null)

const formatMoney = v =>
  'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })

const nomeCliente = id => {
  const c = clientes.value.find(x => x.id === id)
  return c ? c.nome : '—'
}
const nomeVendedor = id => {
  const v = vendedores.value.find(x => x.id === id)
  return v ? v.nome : '—'
}
const normalizarItens = itensBrutos =>
  (itensBrutos || []).map(i => {
    const prod = produtos.value.find(p => p.id === i.produtoId)
    const preco = Number(i.precoUnitario)
    const qtd = Number(i.quantidade)
    return {
      produtoId: i.produtoId,
      produtoNome: prod ? prod.nome : `Produto #${i.produtoId}`,
      quantidade: qtd,
      precoUnitario: preco,
      subtotal: qtd * preco
    }
  })

const colunas = [
  { name: 'id', label: 'ID da Venda', align: 'left', field: 'id' },
  { name: 'data', label: 'Data da Venda', align: 'center', field: 'data' },
  { name: 'cliente', label: 'Nome do Cliente', align: 'center', field: 'clienteNome' },
  { name: 'valor', label: 'Valor Total', align: 'center', field: 'valorTotal', format: v => formatMoney(v) },
  { name: 'vendedor', label: 'Vendedor', align: 'center', field: 'vendedorNome' },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const colunasItens = [
  { name: 'produto', label: 'Produto', field: 'produtoNome', align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'center' },
  { name: 'precoUnitario', label: 'Preço Unit.', field: 'precoUnitario', align: 'right', format: v => formatMoney(v) },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right', format: v => formatMoney(v) },
  { name: 'acoes', label: 'Ações', align: 'center' }
]

const vendas = computed(() => vendasStore.vendas)
const loadingVendas = computed(() => vendasStore.loading)

const opcoesClientes = computed(() =>
  clientes.value.map(c => ({ label: c.nome, value: c.id }))
)
const opcoesVendedores = computed(() =>
  vendedores.value.map(v => ({ label: v.nome, value: v.id }))
)
const opcoesProdutos = computed(() =>
  produtos.value.map(p => ({ label: p.nome, value: p.id }))
)

const vendasComNomes = computed(() =>
  vendas.value.map(v => ({
    ...v,
    clienteNome: nomeCliente(v.clienteId),
    vendedorNome: nomeVendedor(v.vendedorId)
  }))
)

const pagina = ref(1)
const linhasPorPagina = 5

const totalPaginas = computed(() => {
  const total = vendasComNomes.value.length
  return total ? Math.ceil(total / linhasPorPagina) : 1
})

const vendasPaginadas = computed(() => {
  const inicio = (pagina.value - 1) * linhasPorPagina
  const fim = inicio + linhasPorPagina
  return vendasComNomes.value.slice(inicio, fim)
})

const rangeInicio = computed(() =>
  vendasComNomes.value.length ? (pagina.value - 1) * linhasPorPagina + 1 : 0
)

const rangeFim = computed(() =>
  Math.min(pagina.value * linhasPorPagina, vendasComNomes.value.length)
)

const total = computed(() =>
  itens.value.reduce((s, i) => s + i.subtotal, 0)
)

const precoAtual = computed(() => {
  const p = produtos.value.find(x => x.id === itemAtual.value.produtoId)
  return p ? Number(p.preco) : 0
})
const precoAtualFormatado = computed(() => formatMoney(precoAtual.value))

const itensDetalhe = computed(() =>
  normalizarItens(vendaDetalhe.value?.itens)
)
const totalDetalhe = computed(() =>
  itensDetalhe.value.reduce((s, i) => s + i.subtotal, 0)
)

const carregarAuxiliares = async () => {
  const [cli, vend, prod] = await Promise.all([
    api.get('/clientes'),
    api.get('/vendedores'),
    api.get('/produtos')
  ])
  clientes.value = cli.data || []
  vendedores.value = vend.data || []
  produtos.value = prod.data || []
}

onMounted(async () => {
  await Promise.all([vendasStore.carregarVendas(), carregarAuxiliares()])
})

const novaVenda = () => {
  editando.value = false
  form.value = { id: null, data: '', clienteId: null, vendedorId: null }
  itens.value = []
  itemAtual.value = { produtoId: null, quantidade: 1 }
  modalVendaAberta.value = true
}

const adicionarItem = () => {
  if (!itemAtual.value.produtoId || !itemAtual.value.quantidade) {
    Notify.create({ type: 'warning', message: 'Selecione produto e quantidade.' })
    return
  }
  const prod = produtos.value.find(p => p.id === itemAtual.value.produtoId)
  if (!prod) return

  const qtd = Number(itemAtual.value.quantidade)
  const preco = Number(prod.preco)
  const subtotal = qtd * preco

  const existente = itens.value.find(i => i.produtoId === prod.id)
  if (existente) {
    existente.quantidade += qtd
    existente.subtotal += subtotal
  } else {
    itens.value.push({
      produtoId: prod.id,
      produtoNome: prod.nome,
      quantidade: qtd,
      precoUnitario: preco,
      subtotal
    })
  }

  itemAtual.value = { produtoId: null, quantidade: 1 }
}

const removerItem = item => {
  itens.value = itens.value.filter(i => i.produtoId !== item.produtoId)
}

const salvarVenda = async () => {
  if (!form.value.data || !form.value.clienteId || !form.value.vendedorId) {
    Notify.create({ type: 'warning', message: 'Preencha data, cliente e vendedor.' })
    return
  }
  if (!itens.value.length) {
    Notify.create({ type: 'warning', message: 'Adicione pelo menos um item.' })
    return
  }

  salvando.value = true
  const payload = {
    data: form.value.data,
    clienteId: form.value.clienteId,
    vendedorId: form.value.vendedorId,
    itens: itens.value.map(i => ({
      produtoId: i.produtoId,
      quantidade: i.quantidade,
      precoUnitario: i.precoUnitario
    })),
    valorTotal: total.value
  }

  try {
    if (editando.value && form.value.id) {
      await vendasStore.atualizarVenda(form.value.id, payload)
      Notify.create({ type: 'positive', message: 'Venda atualizada!' })
    } else {
      await vendasStore.adicionarVenda(payload)
      Notify.create({ type: 'positive', message: 'Venda cadastrada!' })
      pagina.value = totalPaginas.value
    }
  } catch (e) {
    console.error(e)
    Notify.create({ type: 'negative', message: 'Erro ao salvar venda.' })
  } finally {
    salvando.value = false
    modalVendaAberta.value = false
  }
}

const editarVenda = vendaRow => {
  const v = vendas.value.find(x => x.id === vendaRow.id)
  if (!v) return

  editando.value = true
  form.value = {
    id: v.id,
    data: v.data,
    clienteId: v.clienteId,
    vendedorId: v.vendedorId
  }
  itens.value = normalizarItens(v.itens)
  itemAtual.value = { produtoId: null, quantidade: 1 }
  modalVendaAberta.value = true
}

const excluirVenda = async vendaRow => {
  if (!confirm(`Deseja excluir a venda ${vendaRow.id}?`)) return
  try {
    await vendasStore.removerVenda(vendaRow.id)
    Notify.create({ type: 'positive', message: 'Venda excluída!' })

    if (vendasPaginadas.value.length === 0 && pagina.value > 1) {
      pagina.value--
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao excluir venda.' })
  }
}

const abrirDetalhes = vendaRow => {
  const v = vendas.value.find(x => x.id === vendaRow.id)
  if (!v) return
  vendaDetalhe.value = v
  modalDetalhesAberta.value = true
}
</script>

<style scoped>
.q-page {
  background-color: #ffffff;
}
.text-h5 {
  font-size: 22px;
  font-weight: 600;
}
.q-table {
  border-radius: 12px;
}
.texto-link {
  color: #3b82f6;
  cursor: pointer;
}
</style>