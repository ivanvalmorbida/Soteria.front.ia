<template>
  <LayoutApp>
    <div class="max-w-3xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/plano-contas" class="text-primary-600 hover:text-primary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">
          {{ isEditing ? 'Editar Conta Contábil' : 'Nova Conta Contábil' }}
        </h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div v-if="isEditing" class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Código</label>
              <input :value="form.codigo" type="text" class="input-field" disabled />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Tipo *</label>
              <select v-model="form.tipo" required class="input-field">
                <option value="">Selecione</option>
                <option value="A">A - Ativo</option>
                <option value="P">P - Passivo</option>
                <option value="R">R - Receita</option>
                <option value="D">D - Despesa</option>
                <option value="C">C - Custo</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Rótulo *</label>
              <input v-model="form.rotulo" type="text" required maxlength="20" class="input-field" placeholder="Ex.: 1.1.01" />
            </div>

            <div class="md:col-span-6">
              <label class="block text-sm font-medium text-dark-200 mb-2">Descrição *</label>
              <input v-model="form.descricao" type="text" required maxlength="200" class="input-field" />
            </div>

            <div class="md:col-span-6 relative">
              <label class="block text-sm font-medium text-dark-200 mb-2">Conta Pai</label>
              <input
                v-model="paiBusca"
                type="text"
                class="input-field"
                placeholder="Digite pelo menos 2 letras..."
                autocomplete="off"
                @input="onPaiInput"
                @blur="fecharDropdownComAtraso"
                @focus="abrirDropdownSeHaTermo"
              />
              <div v-if="paiLoading" class="absolute right-3 top-9 text-dark-400">
                <div class="loader w-4 h-4"></div>
              </div>
              <ul
                v-if="showDropdown"
                class="absolute z-50 w-full mt-1 bg-dark-700 border border-dark-600 rounded-lg shadow-lg max-h-56 overflow-y-auto"
              >
                <li v-if="paiLoading" class="px-4 py-2 text-dark-300 text-sm italic">Buscando...</li>
                <li v-else-if="paiSugestoes.length === 0" class="px-4 py-2 text-dark-300 text-sm italic">Nenhuma conta encontrada</li>
                <li
                  v-for="item in paiSugestoes"
                  :key="item.codigo"
                  class="px-4 py-2 cursor-pointer hover:bg-dark-600 text-dark-100 text-sm"
                  @mousedown.prevent="selecionarPai(item)"
                >
                  <span class="font-mono text-primary-400">{{ item.rotulo }}</span> — {{ item.descricao }}
                </li>
              </ul>
              <p v-if="form.codigoPai" class="mt-1 text-xs text-dark-400">
                Selecionado: #{{ form.codigoPai }}
                <button type="button" class="text-red-400 ml-2" @click="limparPai">remover</button>
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <router-link to="/plano-contas" class="btn-secondary">Cancelar</router-link>
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
import planoContaService from '@/services/planoContaService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  codigo: null,
  codigoPai: null,
  tipo: '',
  rotulo: '',
  descricao: ''
})

const paiBusca = ref('')
const paiSugestoes = ref([])
const paiLoading = ref(false)
const showDropdown = ref(false)
let paiTimeout = null

const loadItem = async () => {
  if (!isEditing.value) return
  try {
    loading.value = true
    const data = await planoContaService.getById(route.params.id)
    form.value = {
      codigo: data.codigo,
      codigoPai: data.codigoPai ?? null,
      tipo: data.tipo ?? '',
      rotulo: data.rotulo ?? '',
      descricao: data.descricao ?? ''
    }
    if (data.codigoPaiRotulo) {
      paiBusca.value = data.codigoPaiRotulo
    }
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/plano-contas')
  } finally {
    loading.value = false
  }
}

const onPaiInput = () => {
  if (paiTimeout) clearTimeout(paiTimeout)
  form.value.codigoPai = null
  const termo = paiBusca.value.trim()
  if (termo.length < 2) {
    paiSugestoes.value = []
    showDropdown.value = false
    return
  }
  paiTimeout = setTimeout(async () => {
    try {
      paiLoading.value = true
      showDropdown.value = true
      paiSugestoes.value = await planoContaService.buscarPorDescricao(termo)
    } catch {
      paiSugestoes.value = []
    } finally {
      paiLoading.value = false
    }
  }, 350)
}

const selecionarPai = (item) => {
  form.value.codigoPai = item.codigo
  paiBusca.value = `${item.rotulo} — ${item.descricao}`
  showDropdown.value = false
}

const limparPai = () => {
  form.value.codigoPai = null
  paiBusca.value = ''
}

const fecharDropdownComAtraso = () => {
  setTimeout(() => { showDropdown.value = false }, 200)
}

const abrirDropdownSeHaTermo = () => {
  if (paiSugestoes.value.length > 0) showDropdown.value = true
}

const handleSubmit = async () => {
  if (form.value.tipo.length !== 1) {
    toast.error('O tipo deve ter 1 caractere')
    return
  }
  try {
    saving.value = true
    const payload = {
      codigoPai: form.value.codigoPai || null,
      tipo: form.value.tipo,
      rotulo: form.value.rotulo,
      descricao: form.value.descricao
    }
    if (isEditing.value) {
      await planoContaService.update(form.value.codigo, payload)
      toast.success('Conta atualizada com sucesso')
    } else {
      await planoContaService.create(payload)
      toast.success('Conta cadastrada com sucesso')
    }
    router.push('/plano-contas')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Erro ao salvar')
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadItem()
})
</script>
