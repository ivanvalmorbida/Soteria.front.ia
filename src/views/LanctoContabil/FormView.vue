<template>
  <LayoutApp>
    <div class="max-w-5xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/lancamentos-contabeis" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">
          {{ isEditing ? 'Editar Lançamento Contábil' : 'Novo Lançamento Contábil' }}
        </h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Dados do Lançamento -->
        <div class="card p-6 relative z-30">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Dados do Lançamento</h2>
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div v-if="isEditing" class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Código</label>
              <input :value="form.codigo" type="text" class="input-field" disabled />
            </div>

            <div :class="isEditing ? 'md:col-span-2' : 'md:col-span-3'">
              <label class="block text-sm font-medium text-dark-200 mb-2">Data *</label>
              <input v-model="form.data" type="date" required class="input-field" />
            </div>

            <div :class="isEditing ? 'md:col-span-2' : 'md:col-span-3'">
              <label class="block text-sm font-medium text-dark-200 mb-2">Valor *</label>
              <input
                v-model.number="form.valor"
                type="number"
                step="0.01"
                min="0"
                required
                class="input-field"
                placeholder="0,00"
              />
            </div>

            <!-- Pessoa -->
            <div class="md:col-span-6 relative">
              <label class="block text-sm font-medium text-dark-200 mb-2">Pessoa *</label>
              <input
                v-model="pessoaBusca"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 3 letras..."
                autocomplete="off"
                @input="onPessoaInput"
                @blur="() => fecharDropdown('pessoa')"
                @focus="() => abrirDropdown('pessoa')"
              />
              <div v-if="pessoaLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul v-if="dropdowns.pessoa" class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                <li v-if="pessoaLoading" class="px-4 py-2 text-dark-300 text-sm italic">Buscando...</li>
                <li v-else-if="pessoaSugestoes.length === 0" class="px-4 py-2 text-dark-300 text-sm italic">Nenhuma pessoa encontrada</li>
                <li
                  v-for="p in pessoaSugestoes"
                  :key="p.codigo"
                  class="px-4 py-2 cursor-pointer hover:bg-dark-600 text-dark-100 text-sm"
                  @mousedown.prevent="selecionarPessoa(p)"
                >
                  <span class="font-mono text-primary-400">#{{ p.codigo }}</span> — {{ p.nome }}
                </li>
              </ul>
              <p v-if="form.pessoa" class="mt-1 text-xs text-dark-400">
                Selecionado: #{{ form.pessoa }}
                <button type="button" class="text-red-400 ml-2" @click="limparPessoa">remover</button>
              </p>
            </div>
          </div>
        </div>

        <!-- Contas (Débito e Crédito) -->
        <div class="card p-6 relative z-20">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Partida Dobrada</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Débito -->
            <div class="relative">
              <label class="block text-sm font-medium text-red-400 mb-2">Conta Débito *</label>
              <input
                v-model="debitoBusca"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 2 letras..."
                autocomplete="off"
                @input="onDebitoInput"
                @blur="() => fecharDropdown('debito')"
                @focus="() => abrirDropdown('debito')"
              />
              <div v-if="debitoLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul v-if="dropdowns.debito" class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                <li v-if="debitoLoading" class="px-4 py-2 text-dark-300 text-sm italic">Buscando...</li>
                <li v-else-if="debitoSugestoes.length === 0" class="px-4 py-2 text-dark-300 text-sm italic">Nenhuma conta encontrada</li>
                <li
                  v-for="conta in debitoSugestoes"
                  :key="conta.codigo"
                  class="px-4 py-2 cursor-pointer hover:bg-dark-600 text-dark-100 text-sm"
                  @mousedown.prevent="selecionarDebito(conta)"
                >
                  <span class="font-mono text-primary-400">{{ conta.rotulo }}</span> — {{ conta.descricao }}
                </li>
              </ul>
              <p v-if="form.debito" class="mt-1 text-xs text-dark-400">
                Selecionado: #{{ form.debito }}
                <button type="button" class="text-red-400 ml-2" @click="limparDebito">remover</button>
              </p>
            </div>

            <!-- Crédito -->
            <div class="relative">
              <label class="block text-sm font-medium text-green-400 mb-2">Conta Crédito *</label>
              <input
                v-model="creditoBusca"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 2 letras..."
                autocomplete="off"
                @input="onCreditoInput"
                @blur="() => fecharDropdown('credito')"
                @focus="() => abrirDropdown('credito')"
              />
              <div v-if="creditoLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul v-if="dropdowns.credito" class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                <li v-if="creditoLoading" class="px-4 py-2 text-dark-300 text-sm italic">Buscando...</li>
                <li v-else-if="creditoSugestoes.length === 0" class="px-4 py-2 text-dark-300 text-sm italic">Nenhuma conta encontrada</li>
                <li
                  v-for="conta in creditoSugestoes"
                  :key="conta.codigo"
                  class="px-4 py-2 cursor-pointer hover:bg-dark-600 text-dark-100 text-sm"
                  @mousedown.prevent="selecionarCredito(conta)"
                >
                  <span class="font-mono text-primary-400">{{ conta.rotulo }}</span> — {{ conta.descricao }}
                </li>
              </ul>
              <p v-if="form.credito" class="mt-1 text-xs text-dark-400">
                Selecionado: #{{ form.credito }}
                <button type="button" class="text-red-400 ml-2" @click="limparCredito">remover</button>
              </p>
            </div>
          </div>
        </div>

        <!-- Centro de Custo e Histórico -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Classificação</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Centro de Custo *</label>
              <select v-model.number="form.centroCusto" required class="input-field">
                <option :value="0">Selecione</option>
                <option v-for="cc in centrosCusto" :key="cc.codigo" :value="cc.codigo">
                  #{{ cc.codigo }} — {{ cc.descricao }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Histórico Contábil *</label>
              <select v-model.number="form.hc" required class="input-field">
                <option :value="0">Selecione</option>
                <option v-for="h in historicos" :key="h.codigo" :value="h.codigo">
                  #{{ h.codigo }} — {{ h.descricao }}
                </option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Descrição / Complemento</label>
              <textarea
                v-model="form.descricao"
                class="input-field"
                rows="3"
                maxlength="500"
                placeholder="Detalhes adicionais do lançamento..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <router-link to="/lancamentos-contabeis" class="btn-secondary">Cancelar</router-link>
          <button type="submit" class="btn-primary" :disabled="saving">
            <span v-if="!saving">{{ isEditing ? 'Salvar' : 'Cadastrar' }}</span>
            <span v-else class="flex items-center">
              <div class="loader mr-2"></div>
              Salvando...
            </span>
          </button>
        </div>
      </form>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import lanctoContabilService from '@/services/lanctoContabilService'
import planoContaService from '@/services/planoContaService'
import centroCustoService from '@/services/centroCustoService'
import historicoContabilService from '@/services/historicoContabilService'
import pessoaFisicaService from '@/services/pessoaFisicaService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  codigo: null,
  pessoa: 0,
  centroCusto: 0,
  credito: 0,
  debito: 0,
  valor: 0,
  data: new Date().toISOString().split('T')[0],
  hc: 0,
  descricao: ''
})

const centrosCusto = ref([])
const historicos = ref([])

const pessoaBusca = ref('')
const pessoaSugestoes = ref([])
const pessoaLoading = ref(false)

const debitoBusca = ref('')
const debitoSugestoes = ref([])
const debitoLoading = ref(false)

const creditoBusca = ref('')
const creditoSugestoes = ref([])
const creditoLoading = ref(false)

const dropdowns = reactive({ pessoa: false, debito: false, credito: false })
const timeouts = { pessoa: null, debito: null, credito: null }

const fecharDropdown = (key) => {
  setTimeout(() => { dropdowns[key] = false }, 200)
}
const abrirDropdown = (key) => {
  if (key === 'pessoa' && pessoaSugestoes.value.length) dropdowns.pessoa = true
  if (key === 'debito' && debitoSugestoes.value.length) dropdowns.debito = true
  if (key === 'credito' && creditoSugestoes.value.length) dropdowns.credito = true
}

const onPessoaInput = () => {
  if (timeouts.pessoa) clearTimeout(timeouts.pessoa)
  form.value.pessoa = 0
  const termo = pessoaBusca.value.trim()
  if (termo.length < 3) {
    pessoaSugestoes.value = []
    dropdowns.pessoa = false
    return
  }
  timeouts.pessoa = setTimeout(async () => {
    try {
      pessoaLoading.value = true
      dropdowns.pessoa = true
      pessoaSugestoes.value = await pessoaFisicaService.search(termo)
    } catch {
      pessoaSugestoes.value = []
    } finally {
      pessoaLoading.value = false
    }
  }, 350)
}

const selecionarPessoa = (p) => {
  form.value.pessoa = p.codigo
  pessoaBusca.value = `#${p.codigo} — ${p.nome}`
  dropdowns.pessoa = false
}
const limparPessoa = () => { form.value.pessoa = 0; pessoaBusca.value = '' }

const buscarConta = async (termo) => {
  return await planoContaService.buscarPorDescricao(termo)
}

const onDebitoInput = () => {
  if (timeouts.debito) clearTimeout(timeouts.debito)
  form.value.debito = 0
  const termo = debitoBusca.value.trim()
  if (termo.length < 2) {
    debitoSugestoes.value = []
    dropdowns.debito = false
    return
  }
  timeouts.debito = setTimeout(async () => {
    try {
      debitoLoading.value = true
      dropdowns.debito = true
      debitoSugestoes.value = await buscarConta(termo)
    } catch {
      debitoSugestoes.value = []
    } finally {
      debitoLoading.value = false
    }
  }, 350)
}

const selecionarDebito = (conta) => {
  form.value.debito = conta.codigo
  debitoBusca.value = `${conta.rotulo} — ${conta.descricao}`
  dropdowns.debito = false
}
const limparDebito = () => { form.value.debito = 0; debitoBusca.value = '' }

const onCreditoInput = () => {
  if (timeouts.credito) clearTimeout(timeouts.credito)
  form.value.credito = 0
  const termo = creditoBusca.value.trim()
  if (termo.length < 2) {
    creditoSugestoes.value = []
    dropdowns.credito = false
    return
  }
  timeouts.credito = setTimeout(async () => {
    try {
      creditoLoading.value = true
      dropdowns.credito = true
      creditoSugestoes.value = await buscarConta(termo)
    } catch {
      creditoSugestoes.value = []
    } finally {
      creditoLoading.value = false
    }
  }, 350)
}

const selecionarCredito = (conta) => {
  form.value.credito = conta.codigo
  creditoBusca.value = `${conta.rotulo} — ${conta.descricao}`
  dropdowns.credito = false
}
const limparCredito = () => { form.value.credito = 0; creditoBusca.value = '' }

const loadAuxiliares = async () => {
  try {
    const [cc, hc] = await Promise.all([
      centroCustoService.getAll(),
      historicoContabilService.getAll()
    ])
    centrosCusto.value = cc
    historicos.value = hc
  } catch (error) {
    toast.error('Erro ao carregar dados auxiliares')
    console.error(error)
  }
}

const loadItem = async () => {
  if (!isEditing.value) return
  try {
    loading.value = true
    const data = await lanctoContabilService.getById(route.params.id)
    form.value = {
      codigo: data.codigo,
      pessoa: data.pessoa ?? 0,
      centroCusto: data.centroCusto ?? 0,
      credito: data.credito ?? 0,
      debito: data.debito ?? 0,
      valor: data.valor ?? 0,
      data: data.data ? data.data.split('T')[0] : '',
      hc: data.hc ?? 0,
      descricao: data.descricao ?? ''
    }
    if (data.pessoaNome) pessoaBusca.value = `#${data.pessoa} — ${data.pessoaNome}`
    if (data.debitoDescricao) debitoBusca.value = data.debitoDescricao
    if (data.creditoDescricao) creditoBusca.value = data.creditoDescricao
  } catch (error) {
    toast.error('Erro ao carregar lançamento')
    router.push('/lancamentos-contabeis')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.pessoa) { toast.error('Selecione uma pessoa'); return }
  if (!form.value.debito) { toast.error('Selecione a conta de débito'); return }
  if (!form.value.credito) { toast.error('Selecione a conta de crédito'); return }
  if (form.value.debito === form.value.credito) {
    toast.error('Conta débito e crédito não podem ser iguais')
    return
  }
  if (!form.value.centroCusto) { toast.error('Selecione um centro de custo'); return }
  if (!form.value.hc) { toast.error('Selecione um histórico contábil'); return }
  if (!form.value.valor || form.value.valor <= 0) {
    toast.error('Informe um valor maior que zero')
    return
  }

  try {
    saving.value = true
    const payload = {
      pessoa: form.value.pessoa,
      centroCusto: form.value.centroCusto,
      credito: form.value.credito,
      debito: form.value.debito,
      valor: form.value.valor,
      data: new Date(form.value.data).toISOString(),
      hc: form.value.hc,
      descricao: form.value.descricao || ''
    }
    if (isEditing.value) {
      await lanctoContabilService.update(form.value.codigo, payload)
      toast.success('Lançamento atualizado com sucesso')
    } else {
      await lanctoContabilService.create(payload)
      toast.success('Lançamento cadastrado com sucesso')
    }
    router.push('/lancamentos-contabeis')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Erro ao salvar lançamento')
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadAuxiliares()
  await loadItem()
})
</script>
