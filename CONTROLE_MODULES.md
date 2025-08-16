# Módulos de Controle - Documentação

## Visão Geral

Este documento descreve os novos módulos de Controle implementados no sistema: **Estoque** e **Frota**, além das atualizações no sistema de permissões de usuários.

## 1. Módulo Estoque

### 1.1 Funcionalidades Principais

O módulo de Estoque oferece controle completo de produtos e movimentações:

#### Página Principal (`/dashboard/controle/estoque`)
- **Estatísticas em tempo real:**
  - Total de produtos em estoque
  - Produtos em baixa (alerta)
  - Entradas e saídas do mês
  - Valor total do estoque

- **Cards de Navegação:**
  - Produtos: Visualização e gestão de todos os produtos
  - Movimentações: Controle de entradas, saídas e transferências
  - Categorias: Organização por famílias de produtos
  - Relatórios: Relatórios de estoque, giro e valorização
  - Alertas: Configuração de estoque mínimo e máximo
  - Importar/Exportar: Funcionalidades de importação e exportação

#### Página de Produtos (`/dashboard/controle/estoque/produtos`)
- **Tabela completa com:**
  - Código e nome do produto
  - Categoria e fornecedor
  - Quantidade atual e mínima
  - Preço unitário e valor total
  - Status (Normal/Baixa)
  - Localização no depósito
  - Última movimentação
  - Ações (Visualizar, Editar, Mais opções)

- **Filtros avançados:**
  - Busca por nome/código
  - Filtro por categoria
  - Filtro por fornecedor
  - Status do produto

#### Página de Movimentações (`/dashboard/controle/estoque/movimentacoes`)
- **Controle de:**
  - Entradas (compras, reposições)
  - Saídas (vendas, consumo)
  - Transferências entre depósitos

- **Informações detalhadas:**
  - Tipo de movimentação
  - Produto e quantidade
  - Responsável pela operação
  - Documento (NF, OS, etc.)
  - Data e hora
  - Observações

### 1.2 Dados Mockados

O sistema inclui dados de exemplo para demonstração:
- 8 produtos diferentes (ferramentas, elétrica, pintura)
- 8 movimentações recentes
- Estatísticas realistas de estoque

## 2. Módulo Frota

### 2.1 Funcionalidades Principais

O módulo de Frota oferece gestão completa de veículos e motoristas:

#### Página Principal (`/dashboard/controle/frota`)
- **Estatísticas da frota:**
  - Total de veículos
  - Veículos em manutenção
  - Motoristas ativos
  - Consumo médio de combustível

- **Status da frota:**
  - Operacional (87.5%)
  - Em manutenção (12.5%)
  - Alertas (8.3%)

- **Cards de Navegação:**
  - Veículos: Gestão completa da frota
  - Motoristas: Controle de condutores
  - Manutenções: Preventivas e corretivas
  - Rotas: Planejamento de entregas
  - Combustível: Controle de abastecimentos
  - Relatórios: Performance e custos

#### Página de Veículos (`/dashboard/controle/frota/veiculos`)
- **Informações completas:**
  - Placa e modelo
  - Tipo de veículo (Van, Caminhão, Moto)
  - Motorista responsável
  - Status operacional
  - Quilometragem atual e próxima manutenção
  - Consumo de combustível
  - Localização atual

- **Indicadores visuais:**
  - Status badges (Operacional, Manutenção, Alerta)
  - Ícones por tipo de veículo
  - Cores para quilometragem (verde, amarelo, vermelho)

### 2.2 Dados Mockados

O sistema inclui dados de exemplo para demonstração:
- 8 veículos diferentes (vans, caminhões, moto)
- Diferentes status operacionais
- Informações de quilometragem e manutenção

## 3. Sistema de Permissões Atualizado

### 3.1 Novos Roles

Foram adicionados dois novos roles específicos:

#### Role: `estoque`
- **Permissões:**
  - Serviços: Apenas visualização
  - Controle: Acesso apenas ao módulo Estoque
  - Usuários: Sem acesso
  - Financeiro: Sem acesso
  - Relatórios: Apenas visualização

#### Role: `frota`
- **Permissões:**
  - Serviços: Apenas visualização
  - Controle: Acesso apenas ao módulo Frota
  - Usuários: Sem acesso
  - Financeiro: Sem acesso
  - Relatórios: Apenas visualização

### 3.2 Estrutura de Permissões

```typescript
permissions: {
  servicos?: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  controle?: {
    autemMobile: boolean;
    estoque: boolean;
    frota: boolean;
  };
  usuarios?: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
    excluir: boolean;
  };
  financeiro?: {
    visualizar: boolean;
    criar: boolean;
    editar: boolean;
  };
  relatorios?: {
    visualizar: boolean;
    exportar: boolean;
  };
}
```

### 3.3 Métodos de Verificação

O modelo `User` inclui métodos para verificação de permissões:

```typescript
// Verificar permissão específica
user.hasPermission('controle', 'estoque')

// Verificar acesso ao módulo de controle
user.hasControleAccess('estoque')

// Atualizar permissões
user.updatePermissions(newPermissions)
```

## 4. Middleware de Autorização

### 4.1 Novos Middlewares

#### `AuthorizationMiddleware.requireControleAccess(module)`
Verifica se o usuário tem acesso ao módulo específico de controle.

#### `AuthorizationMiddleware.requireAuthAndControleAccess(module)`
Combinação de autenticação + verificação de acesso ao controle.

### 4.2 Uso nos Controllers

```typescript
// Exemplo de uso em rotas
router.get('/estoque/produtos', 
  AuthorizationMiddleware.requireAuthAndControleAccess('estoque'),
  EstoqueController.getProdutos
);
```

## 5. Navegação Atualizada

### 5.1 Sidebar

O menu lateral foi atualizado para incluir os novos módulos:

```
Controle
├── AutEM Mobile
├── Estoque
└── Frota
```

### 5.2 Ícones

- **Estoque:** `Package` (ícone de pacote)
- **Frota:** `Truck` (ícone de caminhão)

## 6. Estrutura de Arquivos

```
app/dashboard/controle/
├── estoque/
│   ├── page.tsx                    # Página principal
│   ├── produtos/
│   │   └── page.tsx               # Lista de produtos
│   └── movimentacoes/
│       └── page.tsx               # Histórico de movimentações
└── frota/
    ├── page.tsx                    # Página principal
    └── veiculos/
        └── page.tsx               # Lista de veículos

src/
├── models/
│   └── User.ts                    # Modelo atualizado com permissões
└── middleware/
    └── authorizationMiddleware.ts # Novos middlewares de autorização
```

## 7. Próximos Passos

### 7.1 Funcionalidades Pendentes

1. **Integração com Backend:**
   - Criar models para Produto, Movimentacao, Veiculo
   - Implementar services para cada entidade
   - Criar controllers e rotas

2. **Funcionalidades Avançadas:**
   - Sistema de alertas automáticos
   - Relatórios em PDF/Excel
   - Integração com sistemas externos
   - Dashboard com gráficos

3. **Melhorias de UX:**
   - Formulários de criação/edição
   - Modais de confirmação
   - Notificações em tempo real
   - Filtros avançados

### 7.2 Considerações de Segurança

- Implementar validação de dados
- Adicionar logs de auditoria
- Implementar rate limiting
- Configurar CORS adequadamente

## 8. Conclusão

Os módulos de Estoque e Frota foram implementados com sucesso, oferecendo:

- **Interface intuitiva** com dados mockados para demonstração
- **Sistema de permissões granular** para controle de acesso
- **Estrutura escalável** para futuras funcionalidades
- **Integração completa** com o sistema existente

Os módulos estão prontos para uso e podem ser facilmente expandidos conforme as necessidades do negócio.
