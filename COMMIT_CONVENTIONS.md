# Convenções de Commits

Este documento descreve os tipos de commits que devem ser usados no projeto, seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/).

## Formato

```
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<rodapé opcional>
```

## Tipos de Commits

### 🎉 `feat` - Nova Funcionalidade
Usado quando adiciona uma nova funcionalidade ao projeto.

**Exemplos:**
```bash
git commit -m "feat: adicionar componente ButtonUI"
git commit -m "feat(button): adicionar suporte a loading state"
git commit -m "feat(auth): implementar login com Firebase"
```

### 🐛 `fix` - Correção de Bug
Usado quando corrige um bug no código.

**Exemplos:**
```bash
git commit -m "fix: corrigir erro de renderização no toggle"
git commit -m "fix(input): corrigir validação de email"
git commit -m "fix: corrigir crash ao navegar entre tabs"
```

### 📝 `docs` - Documentação
Usado quando adiciona ou altera apenas documentação.

**Exemplos:**
```bash
git commit -m "docs: adicionar README do projeto"
git commit -m "docs: atualizar guia de instalação"
git commit -m "docs(api): documentar novos endpoints"
```

### 🎨 `style` - Formatação
Usado quando altera apenas formatação, espaçamento, etc (não afeta a lógica).

**Exemplos:**
```bash
git commit -m "style: formatar código com Prettier"
git commit -m "style(button): ajustar espaçamento"
git commit -m "style: remover linhas em branco desnecessárias"
```

### ♻️ `refactor` - Refatoração
Usado quando refatora código sem adicionar funcionalidade ou corrigir bug.

**Exemplos:**
```bash
git commit -m "refactor: reorganizar estrutura de pastas"
git commit -m "refactor(components): extrair lógica comum"
git commit -m "refactor: simplificar função de validação"
```

### ⚡ `perf` - Performance
Usado quando melhora a performance do código.

**Exemplos:**
```bash
git commit -m "perf: otimizar renderização de lista"
git commit -m "perf(images): adicionar lazy loading"
git commit -m "perf: reduzir re-renders desnecessários"
```

### ✅ `test` - Testes
Usado quando adiciona ou modifica testes.

**Exemplos:**
```bash
git commit -m "test: adicionar testes para ButtonUI"
git commit -m "test(utils): adicionar testes de validação"
git commit -m "test: corrigir testes quebrados"
```

### 🔧 `chore` - Tarefas de Manutenção
Usado para mudanças em build, dependências, configurações, etc.

**Exemplos:**
```bash
git commit -m "chore: atualizar dependências"
git commit -m "chore: configurar ESLint"
git commit -m "chore: adicionar script de build"
git commit -m "chore: atualizar configuração do Babel"
```

### 🗑️ `remove` - Remoção
Usado quando remove código, arquivos ou funcionalidades.

**Exemplos:**
```bash
git commit -m "remove: remover componente não utilizado"
git commit -m "remove(api): remover endpoint deprecado"
git commit -m "remove: remover dependência não usada"
```

### 🔄 `revert` - Reverter Commit
Usado quando reverte um commit anterior.

**Exemplos:**
```bash
git commit -m "revert: reverter mudanças no componente X"
git commit -m "revert(abc123): reverter commit que causou bug"
```

### 🚀 `deploy` - Deploy
Usado quando faz deploy ou mudanças relacionadas a produção.

**Exemplos:**
```bash
git commit -m "deploy: configurar variáveis de ambiente"
git commit -m "deploy: atualizar configuração de produção"
```

### 🔐 `security` - Segurança
Usado quando corrige vulnerabilidades de segurança.

**Exemplos:**
```bash
git commit -m "security: corrigir vulnerabilidade XSS"
git commit -m "security: atualizar dependências com vulnerabilidades"
```

## Escopo (Opcional)

O escopo é opcional e indica a área do código afetada:

- `feat(button)`: Nova funcionalidade no componente button
- `fix(auth)`: Correção no módulo de autenticação
- `refactor(api)`: Refatoração na API
- `style(components)`: Formatação nos componentes

## Corpo (Opcional)

Use o corpo para explicar o **o quê** e **por quê**, não o **como**:

```
feat: adicionar componente ButtonUI

Adiciona componente de botão reutilizável com suporte a:
- 3 variantes de cor (primary, secondary, tertiary)
- Estados disabled e loading
- Animações suaves

Resolve: #123
```

## Rodapé (Opcional)

Use para referenciar issues, breaking changes, etc:

```
feat: adicionar nova API

BREAKING CHANGE: A API antiga foi removida
Closes #123
Refs #456
```

## Exemplos Completos

### Commit Simples
```bash
git commit -m "feat: adicionar componente Toggle"
```

### Commit com Escopo
```bash
git commit -m "fix(button): corrigir alinhamento do texto"
```

### Commit com Corpo
```bash
git commit -m "feat: adicionar sistema de temas

Implementa sistema de temas com suporte a modo claro/escuro.
Adiciona provider de tema e hooks para consumo.
"
```

### Commit com Breaking Change
```bash
git commit -m "refactor: reorganizar estrutura de componentes

BREAKING CHANGE: Componentes movidos de /components para /components/ui
"
```

## Boas Práticas

✅ **FAÇA:**
- Use mensagens claras e descritivas
- Use o tipo correto para cada mudança
- Seja específico no escopo quando relevante
- Use o corpo para explicar mudanças complexas

❌ **NÃO FAÇA:**
- Commits genéricos como "atualizar código"
- Múltiplas mudanças não relacionadas no mesmo commit
- Mensagens muito longas na primeira linha (máx 72 caracteres)
- Misturar tipos diferentes no mesmo commit

## Checklist Antes de Commitar

- [ ] O commit tem um tipo claro?
- [ ] A mensagem descreve o que foi feito?
- [ ] O commit contém apenas mudanças relacionadas?
- [ ] O código está funcionando?
- [ ] Não há console.logs ou código de debug?

## Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

