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
