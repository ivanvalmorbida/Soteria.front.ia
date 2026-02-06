# Sistema de Cadastro - Frontend Vue.js

Frontend moderno e responsivo desenvolvido em Vue.js 3 para integração com o Sistema de Cadastro API.

## 🎨 Características

- ✅ **Vue.js 3** com Composition API
- ✅ **Vue Router** para navegação
- ✅ **Pinia** para gerenciamento de estado
- ✅ **Tailwind CSS** para estilização
- ✅ **Axios** para requisições HTTP
- ✅ **VeeValidate + Yup** para validação de formulários
- ✅ **Vue Toastification** para notificações
- ✅ **Design moderno** e profissional
- ✅ **Totalmente responsivo**
- ✅ **Animações suaves**
- ✅ **Tema personalizado** com gradientes e efeitos

## 🚀 Tecnologias

- Vue.js 3.4
- Vite 5.2
- Vue Router 4.3
- Pinia 2.1
- Axios 1.6
- Tailwind CSS 3.4
- VeeValidate 4.12
- Yup 1.4

## 📋 Pré-requisitos

- Node.js 18+ ou superior
- npm ou yarn
- Backend API rodando (veja o projeto backend)

## 🔧 Instalação

### 1. Clone o repositório

```bash
cd frontend-vuejs
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🎯 Funcionalidades

### Pessoas Físicas
- ✅ Listagem com busca
- ✅ Cadastro completo
- ✅ Edição de dados
- ✅ Visualização detalhada
- ✅ Exclusão com confirmação
- ✅ Validação de CPF
- ✅ Busca de CEP automática
- ✅ Múltiplos telefones e e-mails

### Pessoas Jurídicas
- ✅ Listagem de empresas
- ✅ Cadastro completo
- ✅ Edição de dados
- ✅ Visualização detalhada
- ✅ Validação de CNPJ
- ✅ Campo de representante (código da pessoa)
- ✅ Exibição do nome do representante
- ✅ Múltiplos contatos

## 📁 Estrutura do Projeto

```
frontend-vuejs/
├── public/              # Arquivos públicos
├── src/
│   ├── assets/         # Arquivos estáticos (CSS, imagens)
│   │   └── main.css    # Estilos globais com Tailwind
│   ├── components/     # Componentes reutilizáveis
│   │   ├── LayoutApp.vue       # Layout principal
│   │   └── LoadingSpinner.vue  # Componente de loading
│   ├── router/         # Configuração de rotas
│   │   └── index.js
│   ├── services/       # Serviços de API
│   │   ├── api.js                      # Cliente Axios
│   │   ├── pessoaFisicaService.js      # API Pessoa Física
│   │   ├── pessoaJuridicaService.js    # API Pessoa Jurídica
│   │   └── auxiliaryService.js         # APIs auxiliares
│   ├── views/          # Páginas da aplicação
│   │   ├── HomeView.vue
│   │   ├── PessoaFisica/
│   │   │   ├── ListaView.vue
│   │   │   ├── FormView.vue
│   │   │   └── DetalhesView.vue
│   │   └── PessoaJuridica/
│   │       ├── ListaView.vue
│   │       ├── FormView.vue
│   │       └── DetalhesView.vue
│   ├── App.vue         # Componente raiz
│   └── main.js         # Ponto de entrada
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Cores Principais

- **Primary**: Azul (tons de #0ea5e9)
- **Secondary**: Roxo (tons de #d946ef)
- **Dark**: Cinzas neutros para texto e fundos

### Tipografia

- **Fonte Principal**: DM Sans (sans-serif)
- **Fonte Mono**: JetBrains Mono (monospace)

### Componentes Personalizados

- `.btn-primary` - Botão primário com gradiente
- `.btn-secondary` - Botão secundário neutro
- `.btn-outline` - Botão com borda
- `.btn-danger` - Botão de ação destrutiva
- `.card` - Card com sombra e bordas arredondadas
- `.input-field` - Input estilizado
- `.badge-*` - Badges coloridos

## 🔌 Integração com Backend

O frontend está configurado para se comunicar com a API através do Axios. As configurações estão em:

- **Base URL**: Definida em `.env` como `VITE_API_URL`
- **Proxy**: Configurado no `vite.config.js` para redirecionar `/api` para o backend
- **Interceptors**: Configurados em `src/services/api.js` para:
  - Adicionar token de autenticação (se disponível)
  - Tratar erros 401 (não autorizado)
  - Redirecionar para login quando necessário

### Endpoints Utilizados

#### Pessoa Física
- `GET /api/pessoafisica` - Listar todas
- `GET /api/pessoafisica/:id` - Buscar por ID
- `POST /api/pessoafisica` - Criar nova
- `PUT /api/pessoafisica/:id` - Atualizar
- `DELETE /api/pessoa/:id` - Excluir
- `GET /api/pessoa/search?termo=xxx` - Buscar

#### Pessoa Jurídica
- `GET /api/pessoajuridica` - Listar todas
- `GET /api/pessoajuridica/:id` - Buscar por ID
- `POST /api/pessoajuridica` - Criar nova
- `PUT /api/pessoajuridica/:id` - Atualizar
- `DELETE /api/pessoa/:id` - Excluir

#### Dados Auxiliares
- `GET /api/estado` - Listar estados
- `GET /api/cidade/estado/:id` - Listar cidades por estado
- `GET /api/cep/:cep` - Buscar CEP
- `GET /api/tipotelefone` - Tipos de telefone
- `GET /api/tipoenderecoeletronico` - Tipos de endereço eletrônico

## 🚦 Estados e Loading

O aplicativo possui estados de loading para todas as operações assíncronas:

- **Loading Spinner**: Exibido durante carregamento de dados
- **Skeleton Screens**: Disponíveis para melhor UX
- **Toasts**: Notificações de sucesso, erro e informação

## 🔐 Autenticação (Preparado)

O sistema está preparado para autenticação JWT:

- Interceptor Axios já configurado
- LocalStorage para armazenar token
- Redirecionamento automático em caso de 401

## 📱 Responsividade

O frontend é totalmente responsivo, adaptando-se a:

- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🎭 Animações

Todas as páginas e componentes possuem animações suaves:

- Fade in ao carregar páginas
- Slide up para modais
- Hover effects em botões e cards
- Transições entre rotas

## 🐛 Tratamento de Erros

- Toast notifications para erros da API
- Validação de formulários em tempo real
- Mensagens amigáveis ao usuário
- Console logs para debug (em desenvolvimento)

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint (se configurado)
npm run lint
```

## 🌐 Navegadores Suportados

- Chrome (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Edge (últimas 2 versões)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para integração com o Sistema de Cadastro API.

## 🙏 Agradecimentos

- Vue.js Team
- Tailwind CSS Team
- Vite Team
- Comunidade Open Source

---

**Nota**: Certifique-se de que o backend está rodando antes de iniciar o frontend para uma experiência completa!
