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
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-dark-100 mb-2">{{ pessoa?.razaoSocial }}</h1>
            <p class="text-xl text-dark-300 mb-2">{{ pessoa?.nome }}</p>
            <p class="text-dark-300">Código: #{{ pessoa?.codigo }}</p>
          </div>
          <router-link :to="`/pessoas-juridicas/${pessoa?.codigo}/editar`" class="btn-primary">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </router-link>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="pessoa" class="space-y-6">
        <!-- Dados da Empresa -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Dados da Empresa</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-dark-300">CNPJ</label>
              <p class="text-lg font-mono">{{ formatCnpj(pessoa.cnpj) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-dark-300">Inscrição Estadual</label>
              <p class="text-lg">{{ pessoa.inscricaoEstadual || '-' }}</p>
            </div>
            <div v-if="pessoa.homepage">
              <label class="text-sm font-medium text-dark-300">Site</label>
              <a :href="pessoa.homepage" target="_blank" class="text-lg text-primary-600 hover:underline flex items-center gap-2">
                {{ pessoa.homepage }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div v-if="pessoa.representanteNome">
              <label class="text-sm font-medium text-dark-300">Representante</label>
              <p class="text-lg">{{ pessoa.representanteNome }} <span class="text-dark-400">(#{{ pessoa.representante }})</span></p>
            </div>
            <div>
              <label class="text-sm font-medium text-dark-300">Cadastrado em</label>
              <p class="text-lg">{{ formatDate(pessoa.cadastro) }}</p>
            </div>
          </div>
        </div>

        <!-- Endereço -->
        <div class="card p-6" v-if="pessoa.endereco || pessoa.cep">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Endereço</h2>
          <div class="space-y-2">
            <p v-if="pessoa.endereco" class="text-lg">
              {{ pessoa.enderecoNome }}, {{ pessoa.numero }}
              {{ pessoa.complemento ? `- ${pessoa.complemento}` : '' }}
            </p>
            <p v-if="pessoa.bairroNome" class="text-dark-300">{{ pessoa.bairroNome }}</p>
            <p v-if="pessoa.cidadeNome" class="text-dark-300">
              {{ pessoa.cidadeNome }} - {{ pessoa.estadoNome }}
            </p>
            <p v-if="pessoa.cep" class="font-mono text-dark-300">CEP: {{ pessoa.cep }}</p>
          </div>
        </div>

        <!-- Contatos -->
        <div class="card p-6" v-if="pessoa.telefones?.length || pessoa.enderecosEletronicos?.length">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Contatos</h2>
          <div class="space-y-4">
            <div v-if="pessoa.telefones?.length">
              <h3 class="font-semibold text-dark-200 mb-2">Telefones</h3>
              <div class="space-y-2">
                <div v-for="tel in pessoa.telefones" :key="tel.codigo" class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="font-mono">{{ tel.telefone }}</span>
                  <span v-if="tel.descricao" class="text-dark-300">- {{ tel.descricao }}</span>
                </div>
              </div>
            </div>
            <div v-if="pessoa.enderecosEletronicos?.length">
              <h3 class="font-semibold text-dark-200 mb-2">E-mails</h3>
              <div class="space-y-2">
                <div v-for="email in pessoa.enderecosEletronicos" :key="email.codigo" class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ email.endereco }}</span>
                  <span v-if="email.descricao" class="text-dark-300">- {{ email.descricao }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Observações -->
        <div class="card p-6" v-if="pessoa.obs">
          <h2 class="text-xl font-bold text-dark-100 mb-4">Observações</h2>
          <p class="text-dark-200 whitespace-pre-wrap">{{ pessoa.obs }}</p>
        </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import LayoutApp from '@/components/LayoutApp.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import pessoaJuridicaService from '@/services/pessoaJuridicaService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const pessoa = ref(null)
const loading = ref(false)

const loadPessoa = async () => {
  try {
    loading.value = true
    pessoa.value = await pessoaJuridicaService.getById(route.params.id)
  } catch (error) {
    toast.error('Erro ao carregar dados')
    router.push('/pessoas-juridicas')
  } finally {
    loading.value = false
  }
}

const formatCnpj = (cnpj) => {
  if (!cnpj) return '-'
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(() => {
  loadPessoa()
})
</script>
