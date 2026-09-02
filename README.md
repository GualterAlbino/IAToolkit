# 🛠️ Claude Skills Hub

Repositório centralizado de **skills** para o Claude Code, instaláveis com um único comando — **sem precisar clonar**.

## O que são skills?

Skills são arquivos de instruções (`SKILL.md`) que ensinam o Claude Code a executar tarefas específicas. Elas são copiadas para `~/.claude/skills/` e carregadas automaticamente na inicialização.

## Skills disponíveis

| Skill | Descrição |
|-------|-----------|
| `organizar-imports` | Organiza e agrupa imports de um arquivo TypeScript por escopo, em ordem crescente. |

## Instalação (um comando, sem clonar)

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/GualterAlbino/ClaudeCodeSkills/master/install.ps1 | iex
```

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/GualterAlbino/ClaudeCodeSkills/master/install.sh | bash
```

O comando baixa o repositório temporariamente (via `git`) e instala **todas** as skills.

Para instalar uma skill específica (macOS/Linux):

```bash
curl -fsSL https://raw.githubusercontent.com/GualterAlbino/ClaudeCodeSkills/master/install.sh | bash -s organizar-imports
```

### Pré-requisitos

- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 18+

Após instalar, **reinicie o Claude Code** para carregar as skills.

## Instalação alternativa (clonando)

```bash
git clone https://github.com/GualterAlbino/ClaudeCodeSkills.git
cd ClaudeCodeSkills

npm run install:all                      # todas as skills
npm run install:skill organizar-imports  # uma skill específica
```

## Onde as skills são instaladas?

```
~/.claude/skills/<nome-da-skill>/SKILL.md
```

## Como criar uma nova skill

1. Crie uma pasta com o nome da skill em `skills/`:

   ```
   skills/minha-skill/
   ```

2. Adicione um arquivo `SKILL.md` com frontmatter:

   ```markdown
   ---
   name: minha-skill
   description: O que essa skill faz
   ---

   # Instruções
   ...
   ```

3. Rode `npm run install:skill minha-skill`.

## Desenvolvimento

- `npm run validate` — valida o frontmatter de cada `SKILL.md` e a sintaxe dos scripts.
- O [Husky](https://typicode.github.io/husky/) executa essa validação em cada `git commit`, e o [commitlint](https://commitlint.js.org/) valida a mensagem do commit.

### Convenção de commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona skill de organizar imports
fix: corrige caminho de instalação
docs: atualiza README
chore: atualiza dependências
```

> **Nota:** as URLs de instalação apontam para a branch `master`. Lembre-se de publicar (`git push`) as mudanças para que a instalação via URL reflita a versão mais recente.
