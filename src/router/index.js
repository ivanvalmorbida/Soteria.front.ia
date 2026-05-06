import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login', public: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Cadastro', public: true }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Início', requiresAuth: true }
    },
    {
      path: '/pessoas-fisicas',
      name: 'pessoas-fisicas',
      component: () => import('../views/PessoaFisica/ListaView.vue'),
      meta: { title: 'Pessoas Físicas', requiresAuth: true }
    },
    {
      path: '/pessoas-fisicas/novo',
      name: 'pessoa-fisica-novo',
      component: () => import('../views/PessoaFisica/FormView.vue'),
      meta: { title: 'Nova Pessoa Física', requiresAuth: true }
    },
    {
      path: '/pessoas-fisicas/:id',
      name: 'pessoa-fisica-detalhes',
      component: () => import('../views/PessoaFisica/DetalhesView.vue'),
      meta: { title: 'Detalhes Pessoa Física', requiresAuth: true }
    },
    {
      path: '/pessoas-fisicas/:id/editar',
      name: 'pessoa-fisica-editar',
      component: () => import('../views/PessoaFisica/FormView.vue'),
      meta: { title: 'Editar Pessoa Física', requiresAuth: true }
    },
    {
      path: '/pessoas-juridicas',
      name: 'pessoas-juridicas',
      component: () => import('../views/PessoaJuridica/ListaView.vue'),
      meta: { title: 'Pessoas Jurídicas', requiresAuth: true }
    },
    {
      path: '/pessoas-juridicas/novo',
      name: 'pessoa-juridica-novo',
      component: () => import('../views/PessoaJuridica/FormView.vue'),
      meta: { title: 'Nova Pessoa Jurídica', requiresAuth: true }
    },
    {
      path: '/pessoas-juridicas/:id',
      name: 'pessoa-juridica-detalhes',
      component: () => import('../views/PessoaJuridica/DetalhesView.vue'),
      meta: { title: 'Detalhes Pessoa Jurídica', requiresAuth: true }
    },
    {
      path: '/pessoas-juridicas/:id/editar',
      name: 'pessoa-juridica-editar',
      component: () => import('../views/PessoaJuridica/FormView.vue'),
      meta: { title: 'Editar Pessoa Jurídica', requiresAuth: true }
    },

    // Centro de Custo
    {
      path: '/centros-custo',
      name: 'centros-custo',
      component: () => import('../views/CentroCusto/ListaView.vue'),
      meta: { title: 'Centros de Custo', requiresAuth: true }
    },
    {
      path: '/centros-custo/novo',
      name: 'centro-custo-novo',
      component: () => import('../views/CentroCusto/FormView.vue'),
      meta: { title: 'Novo Centro de Custo', requiresAuth: true }
    },
    {
      path: '/centros-custo/:id/editar',
      name: 'centro-custo-editar',
      component: () => import('../views/CentroCusto/FormView.vue'),
      meta: { title: 'Editar Centro de Custo', requiresAuth: true }
    },

    // Histórico Contábil
    {
      path: '/historicos-contabeis',
      name: 'historicos-contabeis',
      component: () => import('../views/HistoricoContabil/ListaView.vue'),
      meta: { title: 'Históricos Contábeis', requiresAuth: true }
    },
    {
      path: '/historicos-contabeis/novo',
      name: 'historico-contabil-novo',
      component: () => import('../views/HistoricoContabil/FormView.vue'),
      meta: { title: 'Novo Histórico Contábil', requiresAuth: true }
    },
    {
      path: '/historicos-contabeis/:id/editar',
      name: 'historico-contabil-editar',
      component: () => import('../views/HistoricoContabil/FormView.vue'),
      meta: { title: 'Editar Histórico Contábil', requiresAuth: true }
    },

    // Plano de Contas
    {
      path: '/plano-contas',
      name: 'plano-contas',
      component: () => import('../views/PlanoConta/ListaView.vue'),
      meta: { title: 'Plano de Contas', requiresAuth: true }
    },
    {
      path: '/plano-contas/novo',
      name: 'plano-conta-novo',
      component: () => import('../views/PlanoConta/FormView.vue'),
      meta: { title: 'Nova Conta Contábil', requiresAuth: true }
    },
    {
      path: '/plano-contas/:id/editar',
      name: 'plano-conta-editar',
      component: () => import('../views/PlanoConta/FormView.vue'),
      meta: { title: 'Editar Conta Contábil', requiresAuth: true }
    },

    // Lançamento Contábil
    {
      path: '/lancamentos-contabeis',
      name: 'lancamentos-contabeis',
      component: () => import('../views/LanctoContabil/ListaView.vue'),
      meta: { title: 'Lançamentos Contábeis', requiresAuth: true }
    },
    {
      path: '/lancamentos-contabeis/novo',
      name: 'lancamento-contabil-novo',
      component: () => import('../views/LanctoContabil/FormView.vue'),
      meta: { title: 'Novo Lançamento Contábil', requiresAuth: true }
    },
    {
      path: '/lancamentos-contabeis/:id',
      name: 'lancamento-contabil-detalhes',
      component: () => import('../views/LanctoContabil/DetalhesView.vue'),
      meta: { title: 'Detalhes Lançamento Contábil', requiresAuth: true }
    },
    {
      path: '/lancamentos-contabeis/:id/editar',
      name: 'lancamento-contabil-editar',
      component: () => import('../views/LanctoContabil/FormView.vue'),
      meta: { title: 'Editar Lançamento Contábil', requiresAuth: true }
    },

    // Hospedagem
    {
      path: '/hospedagens',
      name: 'hospedagens',
      component: () => import('../views/Hospedagem/ListaView.vue'),
      meta: { title: 'Hospedagens', requiresAuth: true }
    },
    {
      path: '/hospedagens/novo',
      name: 'hospedagem-novo',
      component: () => import('../views/Hospedagem/FormView.vue'),
      meta: { title: 'Nova Hospedagem', requiresAuth: true }
    },
    {
      path: '/hospedagens/:id',
      name: 'hospedagem-detalhes',
      component: () => import('../views/Hospedagem/DetalhesView.vue'),
      meta: { title: 'Detalhes Hospedagem', requiresAuth: true }
    },
    {
      path: '/hospedagens/:id/editar',
      name: 'hospedagem-editar',
      component: () => import('../views/Hospedagem/FormView.vue'),
      meta: { title: 'Editar Hospedagem', requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Sistema de Cadastro` : 'Sistema de Cadastro'
  
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublic = to.matched.some(record => record.meta.public)

  // Se a rota requer autenticação
  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Não autenticado, redireciona para login
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      // Autenticado, pode prosseguir
      next()
    }
  } 
  // Se é uma rota pública e usuário já está autenticado
  else if (isPublic && authStore.isAuthenticated) {
    // Já está logado, redireciona para home
    next({ name: 'home' })
  }
  // Rota pública e usuário não autenticado
  else {
    next()
  }
})

export default router
