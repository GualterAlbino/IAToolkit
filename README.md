# 🛠️ IAToolkit

Repositório de **skills** e **ferramentas** para assistentes de IA, instaláveis com um único comando via [`npx skills`](https://github.com/vercel-labs/skills).

## Estrutura — o que é portável

O repositório tem duas camadas, separadas de propósito:

| Pasta | Conteúdo | Funciona em |
|-------|----------|-------------|
| `skills/` | Instruções (`SKILL.md`) de boas práticas: commits, MR, imports, questionamento. | Conteúdo **portável** — vale para qualquer assistente de IA; hoje é entregue no formato `SKILL.md` (Claude Code/Desktop e ferramentas que adotam o padrão `skills`). |
| `claude/` | Configurações específicas do Claude Code: `statusLine`, hooks (`Stop`/`Notification`). | **Somente Claude Code.** |

As **skills** são conhecimento genérico de engenharia; as **configs** em `claude/` dependem da mecânica interna do Claude Code (`settings.json`, o JSON do `statusLine` e os hooks).

## O que são skills?

Skills são arquivos de instruções (`SKILL.md`) que ensinam o Claude Code a executar tarefas específicas. Cada skill é uma pasta com um `SKILL.md` (frontmatter com `name` e `description`) e, opcionalmente, arquivos de apoio.

## Skills disponíveis

| Skill | Autor | Descrição |
|-------|-------|-----------|
| `commit-msg` | [ricardoalves-dev](https://github.com/ricardoalves-dev) | Gera commits atômicos, coesos e fáceis de entender e reverter. |
| `gerar-mr` | [ricardoalves-dev](https://github.com/ricardoalves-dev) | Gera o conteúdo de um Merge Request a partir das alterações da branch atual. |
| `gestor-worktree` | [GualterAlbino](https://github.com/GualterAlbino) | Isola o trabalho de múltiplos agentes em git worktrees, evitando conflitos e sobrescritas no mesmo repositório. |
| `organizar-imports` | [ricardoalves-dev](https://github.com/ricardoalves-dev) | Organiza e agrupa imports de um arquivo TypeScript por escopo, em ordem crescente. |
| `questionante` | [GualterAlbino](https://github.com/GualterAlbino) | Questiona pedidos de implementação vagos ou ambíguos, refinando a especificação antes de escrever código. |

## Instalação

Use o CLI [`skills`](https://github.com/vercel-labs/skills) — o mesmo padrão usado por outros repositórios de skills (ex.: `npx skills add JuliusBrussee/caveman`).

### Ver o que o repo oferece

```bash
npx skills add GualterAlbino/IAToolkit --list
```

### Instalar tudo

```bash
npx skills add GualterAlbino/IAToolkit -a claude-code
```

### Instalar uma skill específica

```bash
npx skills add GualterAlbino/IAToolkit --skill organizar-imports -a claude-code
```

### Instalar globalmente (todos os projetos)

```bash
npx skills add GualterAlbino/IAToolkit -g -a claude-code
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

O `npx skills` instala em um diretório **canônico e neutro** — `.agents/skills/` — e, a partir dele, cria um link (symlink) ou cópia para o diretório do agente alvo:

| Escopo | Local canônico (`.agents`) | Onde o Claude Code lê |
|--------|---------------------------|----------------------|
| Projeto | `./.agents/skills/<nome>/` | `./.claude/skills/<nome>/` |
| Global (`-g`) | `~/.agents/skills/<nome>/` | `~/.claude/skills/<nome>/` |

Ou seja: o `.agents/` é o ponto de entrada do CLI, comum a vários agentes (Claude Code, Codex, Cursor, Gemini CLI…). O **Claude Code só lê** de `.claude/skills/`, por isso o CLI espelha o conteúdo de `.agents/skills/` para lá.

> **Importante:** especifique `-a claude-code` ao instalar. Sem ele (ou em projeto recém-criado), o CLI pode deixar a skill apenas em `.agents/skills/` sem criar o link em `.claude/skills/` — e aí o Claude Code não a enxerga. Isso é um [bug conhecido](https://github.com/vercel-labs/skills/issues/851).

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

## Configurações do Claude Code (`claude/`)

Além das skills, este repositório centraliza **configurações** do Claude Code em `claude/`. Assim como nas skills, você instala com **um comando, sem clonar** — escolhendo qual config e o escopo.

| Config | O que faz |
|--------|-----------|
| `statusline` | Status line customizada (contexto, custo, tokens, velocidade). |
| `beep` | Alertas sonoros — bipe ao terminar a resposta e ao pedir permissão. |

### Listar as configurações

```bash
npx github:GualterAlbino/IAToolkit --list
```

### Instalar uma configuração

```bash
npx github:GualterAlbino/IAToolkit statusline             # global (~/.claude/)
npx github:GualterAlbino/IAToolkit statusline --project   # por projeto (.claude/ deste diretório)
npx github:GualterAlbino/IAToolkit beep --project         # alertas sonoros só neste projeto
```

O `npx` baixa a config e o instalador copia o(s) arquivo(s) para o diretório `.claude` correspondente, fazendo o merge do campo necessário no `settings.json` — **preservando** as configurações existentes. Depois, reinicie o Claude Code.

> No escopo por projeto, rode o comando a partir do diretório do projeto em questão.

### Alternativa: instalar a partir do código local

Se preferir, clone o repositório e rode `node scripts/install-config.js <config> [--project]` (mesma sintaxe).

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
