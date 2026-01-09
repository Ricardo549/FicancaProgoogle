
# Especificação de Dados - FinanzoPro

Este documento detalha a estrutura de dados utilizada pelo sistema. Embora o frontend utilize `localStorage` para persistência imediata, a lógica segue o modelo relacional abaixo.

## Esquema Relacional

### Entidades Principais

1. **Users**: Armazena as credenciais e o nível de plano do usuário.
2. **Accounts**: Representa as carteiras físicas ou digitais (Bancos, Dinheiro Vivo).
3. **Categories**: Sistema de tags para classificação de fluxo de caixa.
4. **Transactions**: O registro granular de toda movimentação financeira.
5. **Goals**: Planejamento de médio/longo prazo com tracking de progresso.

## Regras de Negócio de Dados

- **Integridade**: Nenhuma `Transaction` pode existir sem um `categoryId` e um `accountId`.
- **Saldo Dinâmico**: O `balance` de uma `Account` é a soma de `Transactions(INCOME)` - `Transactions(EXPENSE)`.
- **Escopo**: Todos os dados possuem um `userId` para garantir o isolamento em ambientes multi-tenant.

## Estrutura de Armazenamento (JSON)

```json
{
  "fpro_user": { "id": "uuid", "name": "...", "plan": "pro" },
  "fpro_tx": [ { "id": "tx_001", "amount": 150.00, ... } ],
  "fpro_categories": [ { "id": "cat_001", "name": "Lazer", ... } ],
  "fpro_accounts": [ { "id": "acc_001", "balance": 5000.00, ... } ]
}
```
