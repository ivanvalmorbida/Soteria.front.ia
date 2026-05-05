# Sistema de Cadastro - Frontend Vue.js

Frontend desenvolvido em Vue.js 3 (Composition API) para o Sistema de Cadastro, com autenticação JWT, cadastro de pessoas físicas e jurídicas e dados auxiliares (CEP, endereços, profissões, etc.).

## 🚀 Tecnologias

- Vue.js 3.4
- Vite 7.3
- Vue Router 4.3
- Pinia 2.1
- Axios 1.6
- VeeValidate 4.12 + Yup 1.4
- Vue Toastification 2.0
- Tailwind CSS 3.4

## 📋 Pré-requisitos

- Node.js 18+
- npm
- Backend API em execução (porta padrão `64934`)

## 🔧 Instalação

```bash
npm install
```

### Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste a URL da API se necessário:

```env
VITE_API_URL=http://localhost:64934/api
```

> O Vite também faz proxy de `/api` para `http://localhost:64934` em modo de desenvolvimento (configurado em `vite.config.js`).

## 📝 Scripts

```bash
npm run dev       # Dev server em http://localhost:3000
npm run build     # Build de produção (saída em dist/)
npm run preview   # Preview do build
npm run lint      # ESLint com auto-fix em arquivos .vue/.js
```

## 🎯 Funcionalidades

### Autenticação
- ✅ Login e cadastro de usuário
- ✅ Token JWT persistido em `localStorage`
- ✅ Guarda de rotas (`requiresAuth` / `public`)
- ✅ Redirecionamento automático em caso de 401
- ✅ Troca de senha

### Pessoas Físicas
- ✅ Listagem e busca
- ✅ Cadastro, edição, visualização e exclusão
- ✅ Validação e máscara de CPF
- ✅ Busca de CEP automática
- ✅ Estado civil, nacionalidade e profissão (CBO)
- ✅ UF/Cidade de nascimento e cônjuge
- ✅ Múltiplos telefones e endereços eletrônicos

### Pessoas Jurídicas
- ✅ Listagem e busca
- ✅ Cadastro, edição, visualização e exclusão
- ✅ Validação e máscara de CNPJ (alfanumérico)
- ✅ Atividade econômica (subsetor)
- ✅ Representante legal (busca de pessoa física)
- ✅ Múltiplos telefones e endereços eletrônicos

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── main.css                # Tailwind + utilitários globais
├── components/
│   ├── LayoutApp.vue           # Layout principal (autenticado)
│   └── LoadingSpinner.vue
├── router/
│   └── index.js                # Rotas + guarda de autenticação
├── services/
│   ├── api.js                  # Instância Axios (interceptors, baseURL)
│   ├── authService.js          # /auth/*
│   ├── pessoaFisicaService.js
│   ├── pessoaJuridicaService.js
│   └── auxiliaryService.js     # estados, cidades, CEP, CBO, etc.
├── stores/
│   └── auth.js                 # Store Pinia (user, token, isAuthenticated)
├── views/
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── PessoaFisica/
│   │   ├── ListaView.vue
│   │   ├── FormView.vue        # Reutilizada para novo e edição
│   │   └── DetalhesView.vue
│   └── PessoaJuridica/
│       ├── ListaView.vue
│       ├── FormView.vue
│       └── DetalhesView.vue
├── App.vue
└── main.js
```

Alias de path: `@` resolve para `src/`.

## 🛣️ Rotas

| Caminho | Acesso | Descrição |
| --- | --- | --- |
| `/login` | público | Login |
| `/register` | público | Cadastro de usuário |
| `/` | autenticado | Home |
| `/pessoas-fisicas` | autenticado | Lista |
| `/pessoas-fisicas/novo` | autenticado | Novo cadastro |
| `/pessoas-fisicas/:id` | autenticado | Detalhes |
| `/pessoas-fisicas/:id/editar` | autenticado | Edição |
| `/pessoas-juridicas` | autenticado | Lista |
| `/pessoas-juridicas/novo` | autenticado | Novo cadastro |
| `/pessoas-juridicas/:id` | autenticado | Detalhes |
| `/pessoas-juridicas/:id/editar` | autenticado | Edição |

## 🔌 Integração com o Backend

- **Base URL:** definida em `.env` como `VITE_API_URL` (padrão `http://localhost:64934/api`)
- **Proxy de desenvolvimento:** `/api` → `http://localhost:64934` (`vite.config.js`)
- **Interceptors** (`src/services/api.js`):
  - Anexa `Authorization: Bearer <token>` quando há token em `localStorage`
  - Em resposta 401, limpa o token e redireciona para `/login`

### Endpoints utilizados

#### Autenticação
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET  /api/auth/me`
- `POST /api/auth/change-password`

#### Pessoa Física
- `GET    /api/pessoafisica`
- `GET    /api/pessoafisica/:id`
- `GET    /api/pessoafisica/nome/:nome` — busca por nome
- `POST   /api/pessoafisica`
- `PUT    /api/pessoafisica/:id`
- `DELETE /api/pessoa/:id`
- `GET    /api/pessoa/search?termo=xxx`

#### Pessoa Jurídica
- `GET    /api/pessoajuridica`
- `GET    /api/pessoajuridica/:id`
- `POST   /api/pessoajuridica`
- `PUT    /api/pessoajuridica/:id`
- `DELETE /api/pessoa/:id`

#### Dados auxiliares
- `GET /api/estado`
- `GET /api/cidade/estado/:id`
- `GET /api/cep/:cep`
- `GET /api/tipotelefone`
- `GET /api/tipoenderecoeletronico`
- `GET /api/estadocivil`
- `GET /api/nacionalidade`
- `GET /api/cbo` — profissões
- `GET /api/cbo/descricao/:descricao`
- `GET /api/endereco/nome/:nome`
- `GET /api/bairro/nome/:nome`
- `GET /api/atividadeeconomicasubsetor`

## 🎨 Design System

### Cores
- **Primary:** azul (`#0ea5e9`)
- **Secondary:** roxo (`#d946ef`)
- **Dark:** cinzas neutros para fundo e texto

### Tipografia
- **Sans:** DM Sans
- **Mono:** JetBrains Mono

### Classes utilitárias (em `src/assets/main.css`)
- `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger`
- `.card`
- `.input-field`
- `.badge-*`

## 📱 Responsividade

Layout adaptável para mobile, tablet e desktop.

## 🌐 Navegadores Suportados

Chrome, Firefox, Safari e Edge (últimas 2 versões).

## 🤝 Contribuindo

1. Crie uma branch (`git checkout -b feature/minha-feature`)
2. Commit das mudanças (`git commit -m 'feat: minha feature'`)
3. Push (`git push origin feature/minha-feature`)
4. Abra um Pull Request

## 📄 Licença

MIT.

---

**Nota:** o backend deve estar em execução para que o frontend funcione integralmente.
