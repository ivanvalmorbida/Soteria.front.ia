<template>
  <LayoutApp>
    <div class="max-w-6xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/pessoas-fisicas" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">
          {{ isEditing ? 'Editar Pessoa Física' : 'Nova Pessoa Física' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Dados Pessoais -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Dados Pessoais</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-dark-200 mb-2">Nome Completo *</label>
              <input v-model="form.nome" type="text" required class="input-field" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">CPF</label>
              <input v-model="form.cpf" type="text" class="input-field" placeholder="000.000.000-00" maxlength="14" @input="maskCpf" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Data de Nascimento</label>
              <input v-model="form.nascimento" type="date" class="input-field" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Sexo *</label>
              <select v-model="form.sexo" class="input-field" required>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Dados Complementares -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Dados Complementares</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">UF Nascimento</label>
              <select v-model="form.ufNasc" class="input-field" @change="onUfNascChange">
                <option :value="null">Selecione</option>
                <option v-for="estado in estados" :key="estado.codigo" :value="estado.codigo">
                  {{ estado.sigla }} - {{ estado.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Cidade Nascimento</label>
              <select v-model="form.cidadeNasc" class="input-field" :disabled="!form.ufNasc">
                <option :value="null">Selecione</option>
                <option v-for="cidade in cidadesNasc" :key="cidade.codigo" :value="cidade.codigo">
                  {{ cidade.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Nacionalidade</label>
              <select v-model="form.nacionalidade" class="input-field">
                <option :value="null">Selecione</option>
                <option v-for="nac in nacionalidades" :key="nac.codigo" :value="nac.codigo">
                  {{ nac.pais }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Profissão</label>
              <select v-model="form.profissao" class="input-field">
                <option :value="null">Selecione</option>
                <option v-for="prof in profissoes" :key="prof.codigo" :value="prof.codigo">
                  {{ prof.codigo }} - {{ prof.descricao }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Estado Civil</label>
              <select v-model="form.estadoCivil" class="input-field">
                <option :value="null">Selecione</option>
                <option v-for="ec in estadosCivis" :key="ec.codigo" :value="ec.codigo">
                  {{ ec.descricao }}
                </option>
              </select>
            </div>

            <div v-if="showConjuge">
              <label class="block text-sm font-medium text-dark-200 mb-2">Cônjuge</label>
              <input v-model="form.conjuge" type="number" class="input-field" placeholder="Código Pessoa" />
            </div>
          </div>
        </div>

        <!-- Endereço -->
        <div class="card p-6 relative z-30">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Endereço</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">CEP</label>
              <input v-model="form.cep" type="text" class="input-field" placeholder="00000-000" />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Estado</label>
              <select v-model="form.estado" class="input-field" @change="onEstadoChange">
                <option :value="null">Selecione</option>
                <option v-for="estado in estados" :key="estado.codigo" :value="estado.codigo">
                  {{ estado.sigla }} - {{ estado.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Cidade</label>
              <select v-model="form.cidade" class="input-field" :disabled="!form.estado">
                <option :value="null">Selecione</option>
                <option v-for="cidade in cidades" :key="cidade.codigo" :value="cidade.codigo">
                  {{ cidade.nome }}
                </option>
              </select>
            </div>

            <div class="md:col-span-2 relative">
              <label class="block text-sm font-medium text-dark-200 mb-2">Endereço</label>
              <input
                v-model="enderecoNome"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 3 letras..."
                autocomplete="off"
                @input="onEnderecoInput"
                @blur="fecharDropdownComAtraso"
                @focus="abrirDropdownSeHaTermo"
              />
              <div v-if="enderecoLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul
                v-if="showEnderecoDropdown"
                class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto"
              >
                <li
                  v-if="enderecoLoading"
                  class="px-4 py-2 text-dark-300 text-sm italic"
                >Buscando...</li>
                <li
                  v-else-if="enderecoSugestoes.length === 0"
                  class="px-4 py-2 text-dark-300 text-sm italic"
                >Nenhum endereço encontrado</li>
                <li
                  v-for="item in enderecoSugestoes"
                  :key="item.id ?? item.codigo"
                  class="px-4 py-2 cursor-pointer hover:bg-dark-600 text-dark-100 text-sm"
                  @mousedown.prevent="selecionarEndereco(item)"
                >
                  {{ item.nome ?? item.descricao }}
                </li>
              </ul>
              <p v-if="enderecoNome && !form.enderecoId && !showEnderecoDropdown" class="mt-1 text-xs text-dark-400">Selecione uma opção da lista</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Número</label>
              <input v-model="form.numero" type="text" class="input-field" />
            </div>

            <div class="relative">
              <label class="block text-sm font-medium text-dark-200 mb-2">Bairro</label>
              <input
                v-model="bairroNome"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 3 letras..."
                autocomplete="off"
                @input="onBairroInput"
                @blur="fecharDropdownBairroComAtraso"
                @focus="abrirDropdownBairroSeHaTermo"
              />
              <div v-if="bairroLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul
                v-if="showBairroDropdown"
                class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto"
              >
                <li
                  v-if="bairroLoading"
                  class="px-4 py-2 text-dark-300 text-sm italic"
                >Buscando...</li>
                <li
                  v-else-if="bairroSugestoes.length === 0"
                  class="px-4 py-2 text-dark-300 text-sm italic"
                >Nenhum bairro encontrado</li>
                <li
                  v-for="item in bairroSugestoes"
                  :key="item.id ?? item.codigo"
                  class="px-4 py-2 cursor-pointer hover:bg-dark-600 text-dark-100 text-sm"
                  @mousedown.prevent="selecionarBairro(item)"
                >
                  {{ item.nome ?? item.descricao }}
                </li>
              </ul>
              <p v-if="bairroNome && !form.bairro && !showBairroDropdown" class="mt-1 text-xs text-dark-400">Selecione uma opção da lista</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Complemento</label>
              <input v-model="form.complemento" type="text" class="input-field" />
            </div>
          </div>
        </div>

        <!-- Telefones -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Telefones</h2>
          <div class="space-y-3">
            <div v-for="(telefone, index) in form.telefones" :key="index" class="flex gap-3">
              <input v-model="telefone.telefone" type="text" placeholder="(00) 00000-0000" class="input-field flex-1" />
              <select v-model="telefone.tipo" class="input-field w-40">
                <option :value="null">Tipo</option>
                <option :value="1">📱 Celular</option>
                <option :value="2">☎️ Fixo</option>
                <option :value="3">💬 WhatsApp</option>
                <option :value="4">✈️ Telegram</option>
                <option :value="5">🏢 Comercial</option>
                <option :value="6">🏠 Residencial</option>
                <option :value="7">📞 Recado</option>
                <option :value="8">📠 Fax</option>
                <option :value="99">📞 Outro</option>
              </select>
              <input v-model="telefone.descricao" type="text" placeholder="Descrição" class="input-field flex-1" />
              <button type="button" @click="form.telefones.splice(index, 1)" class="btn-danger whitespace-nowrap">
                Remover
              </button>
            </div>
            <button type="button" @click="addTelefone" class="btn-outline w-full">
              + Adicionar Telefone
            </button>
          </div>
        </div>

        <!-- Endereços Eletrônicos -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Endereços Eletrônicos</h2>
          <div class="space-y-3">
            <div v-for="(email, index) in form.enderecosEletronicos" :key="index" class="flex gap-3">
              <input v-model="email.endereco" type="text" placeholder="exemplo@email.com ou https://site.com" class="input-field flex-1" />
              <select v-model="email.tipo" class="input-field w-48">
                <option :value="null">Tipo</option>
                <option :value="1">📧 E-mail</option>
                <option :value="2">🌐 Website</option>
                <option :value="3">📘 Facebook</option>
                <option :value="4">📷 Instagram</option>
                <option :value="5">💼 LinkedIn</option>
                <option :value="6">🐦 Twitter</option>
                <option :value="7">💬 WhatsApp</option>
                <option :value="8">✈️ Telegram</option>
                <option :value="9">📺 YouTube</option>
                <option :value="10">🎵 TikTok</option>
                <option :value="11">💻 GitHub</option>
                <option :value="99">🔗 Outro</option>
              </select>
              <input v-model="email.descricao" type="text" placeholder="Descrição" class="input-field flex-1" />
              <button type="button" @click="form.enderecosEletronicos.splice(index, 1)" class="btn-danger whitespace-nowrap">
                Remover
              </button>
            </div>
            <button type="button" @click="addEmail" class="btn-outline w-full">
              + Adicionar Endereço Eletrônico
            </button>
          </div>
        </div>

        <!-- Observações -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-4">Observações</h2>
          <textarea v-model="form.obs" rows="4" class="input-field" placeholder="Observações adicionais..."></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 justify-end">
          <router-link to="/pessoas-fisicas" class="btn-secondary">Cancelar</router-link>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import pessoaFisicaService from '@/services/pessoaFisicaService'
import auxiliaryService from '@/services/auxiliaryService'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)

const showConjuge = computed(() => [4, 8].includes(form.value.estadoCivil))

// Dados das APIs auxiliares
const estados = ref([])
const cidades = ref([])
const cidadesNasc = ref([])
const estadosCivis = ref([])
const nacionalidades = ref([])
const profissoes = ref([])

const form = ref({
  nome: '',
  cpf: '',
  identidade: '',
  orgaoIdentidade: '',
  ufIdentidade: null,
  nascimento: '',
  sexo: '',
  estadoCivil: null,
  nacionalidade: null,
  profissao: null,
  ctps: '',
  pis: '',
  cidadeNasc: null,
  ufNasc: null,
  conjuge: null,
  cep: '',
  estado: null,
  cidade: null,
  bairro: null,
  enderecoId: null,
  numero: '',
  complemento: '',
  telefones: [{ telefone: '', tipo: null, descricao: '' }],
  enderecosEletronicos: [{ endereco: '', tipo: null, descricao: '' }],
  obs: ''
})

// Autocomplete de endereço
const enderecoNome = ref('')
const enderecoSugestoes = ref([])
const enderecoLoading = ref(false)
const showEnderecoDropdown = ref(false)
let enderecoDebounce = null

// Autocomplete de bairro
const bairroNome = ref('')
const bairroSugestoes = ref([])
const bairroLoading = ref(false)
const showBairroDropdown = ref(false)
let bairroDebounce = null

const normalizarLista = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  if (data && typeof data === 'object') return [data]
  return []
}

const onEnderecoInput = () => {
  form.value.enderecoId = null
  const termo = enderecoNome.value.trim()
  clearTimeout(enderecoDebounce)
  if (termo.length < 3) {
    enderecoSugestoes.value = []
    showEnderecoDropdown.value = false
    enderecoLoading.value = false
    return
  }
  showEnderecoDropdown.value = true
  enderecoLoading.value = true
  enderecoDebounce = setTimeout(async () => {
    try {
      const data = await auxiliaryService.buscarEnderecosPorNome(termo)
      enderecoSugestoes.value = normalizarLista(data)
    } catch (err) {
      enderecoSugestoes.value = []
      if (err?.response?.status !== 404) {
        toast.error('Erro ao buscar endereços')
      }
    } finally {
      enderecoLoading.value = false
    }
  }, 350)
}

const selecionarEndereco = (item) => {
  form.value.enderecoId = item.id ?? item.codigo
  enderecoNome.value = item.nome ?? item.descricao ?? ''
  enderecoSugestoes.value = []
  showEnderecoDropdown.value = false
}

const fecharDropdownComAtraso = () => {
  setTimeout(() => { showEnderecoDropdown.value = false }, 150)
}

const abrirDropdownSeHaTermo = () => {
  if (enderecoNome.value.trim().length >= 3) {
    showEnderecoDropdown.value = true
  }
}

const onBairroInput = () => {
  form.value.bairro = null
  const termo = bairroNome.value.trim()
  clearTimeout(bairroDebounce)
  if (termo.length < 3) {
    bairroSugestoes.value = []
    showBairroDropdown.value = false
    bairroLoading.value = false
    return
  }
  showBairroDropdown.value = true
  bairroLoading.value = true
  bairroDebounce = setTimeout(async () => {
    try {
      const data = await auxiliaryService.buscarBairrosPorNome(termo)
      bairroSugestoes.value = normalizarLista(data)
    } catch (err) {
      bairroSugestoes.value = []
      if (err?.response?.status !== 404) {
        toast.error('Erro ao buscar bairros')
      }
    } finally {
      bairroLoading.value = false
    }
  }, 350)
}

const selecionarBairro = (item) => {
  form.value.bairro = item.id ?? item.codigo
  bairroNome.value = item.nome ?? item.descricao ?? ''
  bairroSugestoes.value = []
  showBairroDropdown.value = false
}

const fecharDropdownBairroComAtraso = () => {
  setTimeout(() => { showBairroDropdown.value = false }, 150)
}

const abrirDropdownBairroSeHaTermo = () => {
  if (bairroNome.value.trim().length >= 3) {
    showBairroDropdown.value = true
  }
}

const addTelefone = () => {
  form.value.telefones.push({ telefone: '', tipo: null, descricao: '' })
}

const addEmail = () => {
  form.value.enderecosEletronicos.push({ endereco: '', tipo: null, descricao: '' })
}

const loadAuxiliaryData = async () => {
  try {
    const [estadosData, estadosCivisData, nacionalidadesData, profissoesData] = await Promise.all([
      auxiliaryService.getEstados(),
      auxiliaryService.getEstadosCivis(),
      auxiliaryService.getNacionalidades(),
      auxiliaryService.getProfissoes()
    ])
    
    estados.value = estadosData
    estadosCivis.value = estadosCivisData
    nacionalidades.value = nacionalidadesData
    profissoes.value = profissoesData
  } catch (error) {
    console.error('Erro ao carregar dados auxiliares:', error)
    toast.error('Erro ao carregar dados auxiliares')
  }
}

const onEstadoChange = async () => {
  if (form.value.estado) {
    try {
      cidades.value = await auxiliaryService.getCidades(form.value.estado)
      form.value.cidade = null // Limpa cidade selecionada ao mudar estado
    } catch (error) {
      console.error('Erro ao carregar cidades:', error)
      toast.error('Erro ao carregar cidades')
    }
  } else {
    cidades.value = []
    form.value.cidade = null
  }
}

const onUfNascChange = async () => {
  if (form.value.ufNasc) {
    try {
      cidadesNasc.value = await auxiliaryService.getCidades(form.value.ufNasc)
      form.value.cidadeNasc = null
    } catch (error) {
      console.error('Erro ao carregar cidades:', error)
      toast.error('Erro ao carregar cidades')
    }
  } else {
    cidadesNasc.value = []
    form.value.cidadeNasc = null
  }
}

const maskCpf = () => {
  const raw = (form.value.cpf || '').replace(/\D/g, '').slice(0, 11)
  let v = raw
  if (raw.length > 9) v = raw.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4')
  else if (raw.length > 6) v = raw.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3')
  else if (raw.length > 3) v = raw.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2')
  form.value.cpf = v
}

const loadPessoa = async () => {
  try {
    const data = await pessoaFisicaService.getById(route.params.id)
    form.value = {
      ...data,
      enderecoId: data.enderecoId ?? data.endereco ?? null,
      telefones: data.telefones?.length > 0 ? data.telefones : [{ telefone: '', tipo: null, descricao: '' }],
      enderecosEletronicos: data.enderecosEletronicos?.length > 0 ? data.enderecosEletronicos : [{ endereco: '', tipo: null, descricao: '' }]
    }
    if (form.value.cpf) maskCpf()
    enderecoNome.value = data.enderecoNome ?? ''
    bairroNome.value = data.bairroNome ?? ''

    // Carregar cidades se tiver estado
    if (form.value.estado) {
      cidades.value = await auxiliaryService.getCidades(form.value.estado)
    }
    if (form.value.ufNasc) {
      cidadesNasc.value = await auxiliaryService.getCidades(form.value.ufNasc)
    }
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/pessoas-fisicas')
  }
}

const handleSubmit = async () => {
  try {
    saving.value = true
    const payload = {
      ...form.value,
      cpf: (form.value.cpf || '').replace(/\D/g, ''),
      telefones: form.value.telefones.filter(t => t.telefone?.trim()),
      enderecosEletronicos: form.value.enderecosEletronicos.filter(e => e.endereco?.trim())
    }
    
    if (isEditing.value) {
      await pessoaFisicaService.update(route.params.id, payload)
      toast.success('Pessoa atualizada com sucesso')
    } else {
      await pessoaFisicaService.create(payload)
      toast.success('Pessoa cadastrada com sucesso')
    }
    router.push('/pessoas-fisicas')
  } catch (error) {
    toast.error('Erro ao salvar pessoa')
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadAuxiliaryData()
  
  if (isEditing.value) {
    await loadPessoa()
  }
})
</script>