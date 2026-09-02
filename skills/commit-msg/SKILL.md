---
name: commit-msg
description: >
  Gera commits atômicos, coesos e fáceis de entender e reverter. Acione quando o usuário disser
  "escreva um commit", "gere um commit", "comite os arquivos" ou ao executar /commit-msg.
---

# commit-msg

## Objetivo

Gerar **commits atômicos, coesos e fáceis de entender e reverter**.

## Regra de ouro

> **Um commit deve representar uma única mudança lógica.**

Atomicidade não significa "um arquivo por commit", e sim **uma mudança lógica por commit**.
Alterações em vários arquivos que fazem parte da mesma funcionalidade, correção ou refatoração
devem permanecer juntas em um único commit.

> **Dependência técnica não significa necessariamente que as mudanças pertençam ao mesmo commit.:**
Quando uma alteração cria ou modifica um recurso reutilizável e outra alteração utiliza esse recurso em uma funcionalidade específica, avalie as mudanças separadamente.
Antes de agrupar alterações em um mesmo commit, pergunte: **"Se eu precisar reutilizar, fazer cherry-pick ou reverter apenas esta parte da alteração, eu conseguiria fazer isso sem levar junto mudanças de outra funcionalidade?"**

Se a resposta for **não**, avalie separar os commits.

Outra pergunta útil:

> **"Esta alteração possui valor/conceito independente da funcionalidade que a está utilizando?"**

Se sim, prefira separar.

Exemplos de alterações que normalmente devem ser separadas quando possuem uso independente:

* criação ou evolução de utilitários;
* criação de helpers;
* criação de componentes reutilizáveis;
* criação de serviços compartilhados;
* criação de abstrações;
* criação de bibliotecas ou módulos;
* refatorações que habilitam outras funcionalidades;
* alterações estruturais que podem ser utilizadas por múltiplas funcionalidades.

## Fluxo de trabalho

1. Verifique se há alterações preparadas com `git diff --staged`.
   - Se não houver nenhuma alteração staged, **interrompa** e informe que é necessário adicionar
     as alterações ao stage primeiro.
2. Analise cuidadosamente o diff completo das alterações staged.
3. Identifique se todas as alterações pertencem ao mesmo contexto lógico.
   - Alterações da mesma funcionalidade, correção ou refatoração permanecem no mesmo commit.
   - Alterações sem relação entre si vão para **commits distintos**.
   - Não agrupe alterações diferentes apenas porque estão no mesmo `git diff --staged`.
   - Sempre priorize a atomicidade: cada commit representa uma única mudança lógica e coesa.
   - Se necessário, reorganize as alterações staged antes de commitar, usando `git restore --staged`,
     `git add` e `git add -p`.
   - **Nunca descarte alterações do working tree.** O objetivo é apenas organizar quais alterações
     pertencem a cada commit.
4. Para cada grupo logicamente relacionado, escreva uma mensagem seguindo o formato abaixo.
5. Execute o `git commit` separadamente para cada grupo de alterações.

## Formato da mensagem

```
type(scope): assunto curto

- bullet descrevendo o que foi alterado
- bullet explicando por que a alteração foi feita
```

- Tipos permitidos: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
- O assunto deve ter menos de 60 caracteres.
- Os bullets no corpo são opcionais, mas recomendados quando ajudarem a explicar a alteração.
- **Nunca** inclua um trailer `Co-Authored-By` na mensagem de commit.

## Exemplo de separação

Se o diff contiver uma correção no cálculo de estoque, uma alteração independente no login e uma
atualização de documentação, **não** crie um único commit. Crie commits separados:

- `fix(estoque): corrige cálculo do saldo`
- `fix(login): corrige validação da sessão`
- `docs: atualiza documentação de autenticação`

## Erros comuns

- Agrupar mudanças não relacionadas apenas por estarem no mesmo stage.
- Tratar atomicidade como "um arquivo por commit" — a unidade é lógica, não por arquivo.
- Descartar alterações do working tree ao reorganizar o stage.
- Incluir `Co-Authored-By` no trailer do commit.
