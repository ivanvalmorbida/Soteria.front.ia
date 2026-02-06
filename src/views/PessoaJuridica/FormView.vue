<template>
  <LayoutApp>
    <div class="max-w-4xl mx-auto animate-fade-in">
      <div class="mb-8">
        <router-link to="/pessoas-juridicas" class="text-secondary-600 hover:text-secondary-700 flex items-center mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-dark-100">
          {{ isEditing ? 'Editar Pessoa Jurídica' : 'Nova Pessoa Jurídica' }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Dados da Empresa -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Dados da Empresa</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Razão Social *</label>
              <input v-model="form.razaoSocial" type="text" required class="input-field" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Nome Fantasia *</label>
              <input v-model="form.nome" type="text" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">CNPJ</label>
              <input v-model="form.cnpj" type="text" class="input-field" placeholder="00.000.000/0000-00" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Inscrição Estadual</label>
              <input v-model="form.inscricaoEstadual" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Homepage</label>
              <input v-model="form.homepage" type="url" class="input-field" placeholder="https://" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Representante (Código Pessoa)</label>
              <input v-model="form.representante" type="number" class="input-field" placeholder="Código da pessoa" />
            </div>
          </div>
        </div>

        <!-- Endereço -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Endereço</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">CEP</label>
              <input v-model="form.cep" type="text" class="input-field" placeholder="00000-000" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-dark-200 mb-2">Endereço</label>
              <input v-model="form.endereco" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Número</label>
              <input v-model="form.numero" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Bairro</label>
              <input v-model="form.bairro" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-200 mb-2">Complemento</label>
              <input v-model="form.complemento" type="text" class="input-field" />
            </div>
          </div>
        </div>

        <!-- Contatos -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Contatos</h2>
          <div class="space-y-4">
            <div v-for="(telefone, index) in form.telefones" :key="index" class="flex gap-4">
              <input v-model="telefone.telefone" type="text" placeholder="(00) 0000-0000" class="input-field flex-1" />
              <select v-model="telefone.tipo" class="input-field">
                <option :value="null">Tipo</option>
                <option :value="1">Residencial</option>
                <option :value="2">Celular</option>
                <option :value="3">Comercial</option>
                <option :value="4">Outro</option>
              </select>
              <input v-model="telefone.descricao" type="text" placeholder="Descrição" class="input-field flex-1" />
              <button type="button" @click="form.telefones.splice(index, 1)" class="btn-danger">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button type="button" @click="addTelefone" class="btn-outline w-full">+ Adicionar Telefone</button>
          </div>
        </div>

        <!-- Observações -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-4">Observações</h2>
          <textarea v-model="form.obs" rows="4" class="input-field" placeholder="Observações adicionais..."></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 justify-end">
          <router-link to="/pessoas-juridicas" class="btn-secondary">Cancelar</router-link>
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
import pessoaJuridicaService from '@/services/pessoaJuridicaService'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)

const form = ref({
  razaoSocial: '',
  nome: '',
  cnpj: '',
  inscricaoEstadual: '',
  homepage: '',
  representante: null,
  cep: '',
  endereco: '',
  numero: '',
  bairro: '',
  complemento: '',
  telefones: [{ telefone: '', tipo: null, descricao: '' }],
  enderecosEletronicos: [{ endereco: '', tipo: null, descricao: '' }],
  obs: ''
})

const addTelefone = () => {
  form.value.telefones.push({ telefone: '', tipo: null, descricao: '' })
}

const loadPessoa = async () => {
  try {
    const data = await pessoaJuridicaService.getById(route.params.id)
    form.value = { 
      ...data, 
      telefones: data.telefones || [{ telefone: '', tipo: null, descricao: '' }],
      enderecosEletronicos: data.enderecosEletronicos || [{ endereco: '', tipo: null, descricao: '' }]
    }
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/pessoas-juridicas')
  }
}

const handleSubmit = async () => {
  try {
    saving.value = true
    if (isEditing.value) {
      await pessoaJuridicaService.update(route.params.id, form.value)
      toast.success('Empresa atualizada com sucesso')
    } else {
      await pessoaJuridicaService.create(form.value)
      toast.success('Empresa cadastrada com sucesso')
    }
    router.push('/pessoas-juridicas')
  } catch (error) {
    toast.error('Erro ao salvar empresa')
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEditing.value) {
    loadPessoa()
  }
})
</script>
