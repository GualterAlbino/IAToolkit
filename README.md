# 🛠️ Claude Skills Hub

Repositório de **skills** para o Claude Code, instaláveis com um único comando via [`npx skills`](https://github.com/vercel-labs/skills).

## O que são skills?

Skills são arquivos de instruções (`SKILL.md`) que ensinam o Claude Code a executar tarefas específicas. Cada skill é uma pasta com um `SKILL.md` (frontmatter com `name` e `description`) e, opcionalmente, arquivos de apoio.

## Skills disponíveis

| Skill | Autor | Descrição |
|-------|-------|-----------|
| `commit-msg` | ricardoalves-dev | Gera commits atômicos, coesos e fáceis de entender e reverter. |
| `gerar-mr` | ricardoalves-dev | Gera o conteúdo de um Merge Request a partir das alterações da branch atual. |
| `organizar-imports` | ricardoalves-dev | Organiza e agrupa imports de um arquivo TypeScript por escopo, em ordem crescente. |

## Instalação

Use o CLI [`skills`](https://github.com/vercel-labs/skills) — o mesmo padrão usado por outros repositórios de skills (ex.: `npx skills add JuliusBrussee/caveman`).

### Ver o que o repo oferece

```bash
npx skills add GualterAlbino/ClaudeCodeSkills --list
```

### Instalar tudo

```bash
npx skills add GualterAlbino/ClaudeCodeSkills
```

### Instalar uma skill específica

```bash
npx skills add GualterAlbino/ClaudeCodeSkills --skill organizar-imports
```

### Instalar globalmente (todos os projetos)

```bash
npx skills add GualterAlbino/ClaudeCodeSkills -g -a claude-code
```

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ (para o `npx`)
- [git](https://git-scm.com/)

Após instalar, **reinicie o Claude Code** para carregar a skill.

## Como usar a skill

Depois de instalada e com o Claude Code reiniciado:

- **Linguagem natural:** descreva a tarefa (o Claude reconhece pela `description`):
  ```
  organize os imports deste arquivo agrupando por escopo
  ```
- **Invocação explícita:**
  ```
  /organizar-imports
  ```

> A skill `organizar-imports` organiza apenas **arquivos novos ou modificados** (regra definida no próprio `SKILL.md`).

## Onde as skills são instaladas?

O `npx skills` cuida disso automaticamente:

- **Projeto:** `./.claude/skills/<nome>/`
- **Global (`-g`):** `~/.claude/skills/<nome>/`

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

3. Faça o commit e o `git push`. A skill passa a ficar disponível via `npx skills add`.

## Desenvolvimento

- `npm run validate` — valida o frontmatter (`name`/`description`) de cada `SKILL.md` e a sintaxe dos scripts.
- O [Husky](https://typicode.github.io/husky/) executa essa validação em cada `git commit`, e o [commitlint](https://commitlint.js.org/) valida a mensagem do commit.

### Convenção de commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona skill de organizar imports
fix: corrige instrução da skill
docs: atualiza README
chore: atualiza dependências
```

> **Nota:** as URLs de instalação apontam para a branch `master`. Lembre-se de publicar (`git push`) as mudanças para que a instalação reflita a versão mais recente.
