# 🎯 Painel Administrativo

Sistema de painel administrativo completo com arquitetura MVC, desenvolvido em Next.js e Express.js.

## 🎨 Paleta de Cores

O projeto utiliza uma paleta de cores moderna e profissional:

| Cor | RGB | Hex |
|-----|-----|-----|
| Branco | rgb(251, 251, 251) | #FBFBFB |
| Cinza Claro | rgb(193, 196, 200) | #C1C4C8 |
| Laranja | rgb(247, 156, 47) | #F79C2F |
| Cinza Escuro | rgb(107, 111, 115) | #6B6F73 |
| Laranja Claro | rgb(248, 198, 138) | #F8C68A |
| Azul Marinho | rgb(22, 35, 49) | #162331 |

## 🏗️ Arquitetura MVC

O projeto foi refatorado seguindo o padrão Model-View-Controller (MVC):

### 📁 Estrutura de Pastas

```
src/
├── models/          # Modelos de dados
│   ├── User.ts      # Modelo de usuário
│   ├── Order.ts     # Modelo de pedido
│   └── Product.ts   # Modelo de produto
├── services/        # Lógica de negócio
│   ├── UserService.ts
│   └── OrderService.ts
├── controllers/     # Controladores
│   ├── UserController.ts
│   └── OrderController.ts
├── routes/          # Rotas da API
│   ├── userRoutes.ts
│   ├── orderRoutes.ts
│   └── index.ts
├── middleware/      # Middlewares
│   └── authMiddleware.ts
├── utils/           # Utilitários
├── app.ts           # Configuração da aplicação
└── server.ts        # Inicialização do servidor
```

## 🔐 Segurança

### Criptografia de Senhas
- Utiliza bcryptjs com salt rounds de 12
- Senhas são criptografadas antes de serem salvas no banco

### Mascaramento de Emails
- Emails são mascarados automaticamente nas respostas da API
- Formato: `j***n@exemplo.com`

### Autenticação
- Middleware de autenticação JWT
- Controle de roles (admin, manager, user)
- Proteção de rotas sensíveis

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Firebase configurado

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd painel-administrativo
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute o projeto:

**Desenvolvimento (Frontend + Backend):**
```bash
npm run dev:full
```

**Apenas Frontend:**
```bash
npm run dev
```

**Apenas Backend:**
```bash
npm run dev:server
```

### Build para Produção

```bash
# Build do frontend
npm run build

# Build do backend
npm run build:server

# Iniciar servidor de produção
npm run start:server
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário

### Usuários
- `POST /api/users` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário
- `PATCH /api/users/:id/toggle-status` - Ativar/Desativar usuário
- `GET /api/users/stats` - Estatísticas de usuários
- `GET /api/users/department/:department` - Usuários por departamento

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Buscar pedido por ID
- `PUT /api/orders/:id/status` - Atualizar status do pedido
- `PUT /api/orders/:id/payment-status` - Atualizar status do pagamento
- `DELETE /api/orders/:id` - Cancelar pedido
- `POST /api/orders/:id/items` - Adicionar item ao pedido
- `DELETE /api/orders/:id/items/:itemId` - Remover item do pedido
- `GET /api/orders/stats` - Estatísticas de pedidos
- `GET /api/customers/:customerId/orders` - Pedidos por cliente

## 🔧 Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **React Query** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

### Backend
- **Express.js** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Firebase Firestore** - Banco de dados
- **bcryptjs** - Criptografia
- **Helmet** - Segurança
- **CORS** - Cross-origin resource sharing
- **Morgan** - Logging

## 📊 Funcionalidades

### Gestão de Usuários
- ✅ CRUD completo de usuários
- ✅ Criptografia de senhas
- ✅ Mascaramento de emails
- ✅ Controle de roles
- ✅ Ativação/Desativação
- ✅ Estatísticas

### Gestão de Pedidos
- ✅ CRUD completo de pedidos
- ✅ Controle de estoque automático
- ✅ Status de pedidos e pagamentos
- ✅ Adição/remoção de itens
- ✅ Cancelamento com devolução de estoque
- ✅ Estatísticas e relatórios

### Segurança
- ✅ Autenticação JWT
- ✅ Middleware de autorização
- ✅ Proteção de rotas
- ✅ Validação de dados
- ✅ Tratamento de erros

## 🎨 Interface

- Design responsivo e moderno
- Tema claro/escuro
- Componentes acessíveis
- Paleta de cores profissional
- UX otimizada

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para suporte@exemplo.com ou abra uma issue no GitHub.
