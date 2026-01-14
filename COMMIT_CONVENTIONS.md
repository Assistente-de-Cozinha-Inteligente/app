# Convenções de Commits

## Tipos Principais

### `feat` - Nova Funcionalidade
**Para que usar:** Quando adiciona uma nova funcionalidade
**Exemplo:** `git commit -m "feat: adicionar componente ButtonUI"`

### `fix` - Correção de Bug
**Para que usar:** Quando corrige um bug
**Exemplo:** `git commit -m "fix: corrigir erro de renderização no toggle"`

### `refactor` - Refatoração
**Para que usar:** Quando refatora código sem adicionar funcionalidade
**Exemplo:** `git commit -m "refactor: reorganizar estrutura de pastas"`

### `chore` - Tarefas de Manutenção
**Para que usar:** Mudanças em build, dependências, configurações
**Exemplo:** `git commit -m "chore: atualizar dependências"`

### `docs` - Documentação
**Para que usar:** Quando adiciona ou altera apenas documentação
**Exemplo:** `git commit -m "docs: adicionar README do projeto"`

### `style` - Formatação
**Para que usar:** Quando altera apenas formatação (não afeta lógica)
**Exemplo:** `git commit -m "style: formatar código com Prettier"`

### `remove` - Remoção
**Para que usar:** Quando remove código, arquivos ou funcionalidades
**Exemplo:** `git commit -m "remove: remover componente não utilizado"`

## Formato

```
<tipo>(<escopo>): <descrição>
```

