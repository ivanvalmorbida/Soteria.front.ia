<template>
  <LayoutApp>
    <div class="max-w-3xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/hospedagens" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">
          {{ isEditing ? 'Editar Hospedagem' : 'Nova Hospedagem' }}
        </h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2 relative">
              <label class="block text-sm font-medium text-dark-200 mb-2">Hóspede (Pessoa) *</label>
              <input
                v-model="pessoaBusca"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 3 letras..."
                autocomplete="off"
                @input="onPessoaInput"
                @blur="fecharDropdownPessoa"
                @focus="abrirDropdownPessoa"
              />
              <div v-if="pessoaLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul v-if="dropdownPessoa" class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto">
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

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Quarto</label>
              <input
                v-model="form.quarto"
                type="text"
                maxlength="50"
                class="input-field"
                placeholder="Número/identificação do quarto"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Status</label>
              <select v-model="form.status" class="input-field">
                <option value="">Selecione...</option>
                <option value="A">Ativa</option>
                <option value="I">Inativa</option>
                <option value="C">Cancelada</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Check-in *</label>
              <input v-model="form.checkin" type="datetime-local" required class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Check-out</label>
              <input v-model="form.checkout" type="datetime-local" class="input-field" />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Valor Diária *</label>
              <input
                v-model.number="form.diaria"
                type="number"
                step="0.01"
                required
                class="input-field"
                placeholder="0,00"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Total</label>
              <input
                v-model.number="form.total"
                type="number"
                step="0.01"
                class="input-field"
                placeholder="0,00"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Observações</label>
              <textarea
                v-model="form.observacoes"
                rows="3"
                class="input-field"
                placeholder="Observações sobre a hospedagem..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <router-link to="/hospedagens" class="btn-secondary">Cancelar</router-link>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import hospedagemService from '@/services/hospedagemService'
import pessoaFisicaService from '@/services/pessoaFisicaService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  pessoa: 0,
  quarto: '',
  checkin: '',
  checkout: '',
  diaria: '',
  total: '',
  status: 'A',
  observacoes: ''
})

const pessoaBusca = ref('')
const pessoaSugestoes = ref([])
const pessoaLoading = ref(false)
const dropdownPessoa = ref(false)
let pessoaTimeout = null

const fecharDropdownPessoa = () => {
  setTimeout(() => { dropdownPessoa.value = false }, 200)
}
const abrirDropdownPessoa = () => {
  if (pessoaSugestoes.value.length) dropdownPessoa.value = true
}

const onPessoaInput = () => {
  if (pessoaTimeout) clearTimeout(pessoaTimeout)
  form.value.pessoa = 0
  const termo = pessoaBusca.value.trim()
  if (termo.length < 3) {
    pessoaSugestoes.value = []
    dropdownPessoa.value = false
    return
  }
  pessoaTimeout = setTimeout(async () => {
    try {
      pessoaLoading.value = true
      dropdownPessoa.value = true
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
  dropdownPessoa.value = false
}

const limparPessoa = () => {
  form.value.pessoa = 0
  pessoaBusca.value = ''
}

const loadItem = async () => {
  if (!isEditing.value) return
  try {
    loading.value = true
    const data = await hospedagemService.getById(route.params.id)
    form.value = {
      pessoa: data.pessoa ?? 0,
      quarto: data.quarto ?? '',
      checkin: data.checkin ? formatDateTimeLocal(data.checkin) : '',
      checkout: data.checkout ? formatDateTimeLocal(data.checkout) : '',
      diaria: data.diaria ?? '',
      total: data.total ?? '',
      status: data.status ?? 'A',
      observacoes: data.observacoes ?? ''
    }
    if (data.pessoa) {
      pessoaBusca.value = data.pessoaNome
        ? `#${data.pessoa} — ${data.pessoaNome}`
        : `#${data.pessoa}`
    }
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/hospedagens')
  } finally {
    loading.value = false
  }
}

const formatDateTimeLocal = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().slice(0, 16)
}

const handleSubmit = async () => {
  if (!form.value.pessoa) {
    toast.error('Selecione um hóspede')
    return
  }
  try {
    saving.value = true
    const payload = {
      pessoa: form.value.pessoa,
      quarto: form.value.quarto || null,
      checkin: form.value.checkin,
      checkout: form.value.checkout || null,
      diaria: parseFloat(form.value.diaria),
      total: form.value.total ? parseFloat(form.value.total) : null,
      status: form.value.status || null,
      observacoes: form.value.observacoes || null
    }

    if (isEditing.value) {
      await hospedagemService.update(route.params.id, payload)
      toast.success('Hospedagem atualizada com sucesso')
    } else {
      await hospedagemService.create(payload)
      toast.success('Hospedagem cadastrada com sucesso')
    }
    router.push('/hospedagens')
  } catch (error) {
    toast.error('Erro ao salvar')
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadItem()
})
</script>
