---
name: gerar-mr
author: ricardoalves-dev
description: >
   Gera o conteúdo de um Merge Request a partir das alterações da branch atual.
   Acione quando o usuário disser "gere o MR", "gere o merge request",
   "finalize a feature" ou ao executar /gerar-mr.
---

# gerar-mr

## Objetivo

Gerar o conteúdo de um **Merge Request claro, objetivo e fiel às alterações realizadas na branch atual**.

O resultado deve ser um arquivo Markdown contendo as informações necessárias para o usuário revisar e utilizar como descrição do Merge Request.

A skill **não deve criar o Merge Request na plataforma**. Sua responsabilidade é analisar a branch e gerar o arquivo com seu conteúdo.

## Regra de ouro

> **O conteúdo do MR deve explicar o motivo da alteração, as informações relevantes fornecidas pelo usuário, o que efetivamente foi implementado e como o resultado pode ser validado manualmente.**

**Nunca invente contexto, regras de negócio, comportamentos, dados de teste ou informações que não possam ser sustentadas pelo ticket, conversa, histórico, commits ou código analisado.**

Se não for possível entender por que a alteração foi realizada, **pergunte ao usuário até compreender o contexto antes de gerar o MR**.

---

## Arquivo de saída

O conteúdo deve ser salvo em um arquivo Markdown com o formato:

```text
conteudo-mr-{nome-da-branch}.md
```

Exemplo:

```text
Branch: feature/sincronismo

Arquivo:
conteudo-mr-feature-sincronismo.md
```

Como nomes de branch podem conter `/`, normalize o nome para que seja válido como nome de arquivo.

Exemplo:

```text
feature/sincronismo
```

deve resultar em:

```text
conteudo-mr-feature-sincronismo.md
```

### Diretório de saída

O arquivo **não pode ser criado em um diretório monitorado pelo Git**.

Antes de criar o arquivo:

1. Verifique se o diretório está sob controle do Git.
2. Caso esteja, procure um diretório apropriado que não seja monitorado.
3. Se necessário, utilize um diretório explicitamente ignorado pelo `.gitignore`.

**Nunca deixe o arquivo `conteudo-mr-*.md` aparecer como uma alteração pendente no repositório.**

---

# Fluxo de trabalho

## 1. Identifique a branch atual

Obtenha a branch atual utilizando Git.

Exemplo:

```bash
git branch --show-current
```

Utilize a branch atual para:

* identificar o nome do arquivo de saída;
* identificar os commits da feature;
* analisar as alterações realizadas.

Se não for possível identificar a branch atual, interrompa e informe o problema.

---

## 2. Identifique a branch base

Determine contra qual branch a alteração deve ser analisada.

Normalmente será `develop`, a menos que o usuário diga explicitamente que se deve comparar com outra branch.

---

## 3. Analise os commits da branch

Identifique os commits existentes na branch atual desde sua divergência em relação à branch base.

Analise, para cada commit:

* hash;
* mensagem;
* arquivos alterados;
* diff;
* finalidade;
* relação com os demais commits.

Não se limite a copiar as mensagens dos commits.

**Analise o código para entender o que cada commit realmente implementa.**

A análise deve considerar tanto os commits individualmente quanto o conjunto das alterações da branch.

---

## 4. Valide a coerência da branch

Verifique se todas as alterações da branch pertencem ao mesmo contexto lógico.

Uma MR deve representar uma **única feature, correção, melhoria ou mudança lógica coesa**.

Se forem encontradas alterações claramente não relacionadas:

1. informe o usuário;
2. explique quais alterações parecem não pertencer ao mesmo contexto;
3. solicite orientação antes de gerar o conteúdo definitivo.

**Não tente criar artificialmente uma narrativa que conecte alterações independentes.**

---

## 5. Obtenha o contexto

A seção **Contexto** deve explicar:

* qual problema motivou a alteração;
* qual era a necessidade original;
* por que a feature/fix foi realizada;
* qual comportamento precisava ser implementado ou corrigido.

Priorize, nesta ordem, informações provenientes de:

1. descrição original do ticket;
2. conversa atual;
3. documentação relacionada;
4. informações fornecidas pelo usuário;
5. histórico de commits;
6. código e comportamento implementado.

### Regra obrigatória

Se o contexto não estiver suficientemente claro, **pergunte ao usuário**.

Não faça suposições.

Exemplo:

> Não consegui identificar com segurança o motivo funcional desta alteração.
>
> Entendi o que foi implementado, mas não está claro qual problema do ticket motivou essa mudança.
>
> Qual problema ou necessidade essa alteração deveria resolver?

Continue perguntando até possuir informações suficientes para escrever um contexto correto.

---

## 6. Solicite informações pertinentes

**Sempre pergunte ao usuário se existe alguma informação adicional que deve ser inserida no MR.**

Utilize uma pergunta semelhante a:

> Existe alguma informação adicional que você gostaria de inserir na seção "Informações Pertinentes" do MR?

Se o usuário fornecer informações:

* inclua-as na seção **Informações Pertinentes**;
* preserve o significado original;
* organize o texto quando necessário;
* não altere o sentido da informação fornecida.

Se o usuário informar que não há informações adicionais, utilize:

```markdown
# Informações Pertinentes

Nenhuma informação adicional.
```

**Nunca pule essa pergunta.**

---

## 7. Gere a seção "Alterações"

A seção **Alterações** deve apresentar os commits da branch e o entendimento resumido de cada alteração.

Para cada commit:

1. apresente a mensagem original do commit;
2. transforme a mensagem em um link para o commit, quando for possível determinar a URL corretamente;
3. apresente, após o link, um resumo do que foi implementado;
4. explique brevemente a finalidade da alteração quando isso estiver claro no código.

### Formato

Utilize:

```markdown
- [**<mensagem do commit>**](<URL>): <entendimento resumido da alteração>.
```

Exemplo:

```markdown
- [**feat(unit-utils): criar método para manipular registro final sinc. por tabela**](http://gitlab.teksystemweb.com.br/tekdashboard/backend/-/commit/5ee1a971725eddf6f710d6b2be6674e07937b392): cria método utilitário para manipular o filtro de registro final. Este filtro será utilizado como watermark na busca de registros a serem sincronizados.
```

### Regra importante

**O resumo deve representar o entendimento da LLM sobre o código, e não simplesmente repetir a mensagem do commit.**

Exemplo inadequado:

```markdown
- **feat(unit-utils): criar método para manipular registro final sinc. por tabela**: cria método para manipular registro final.
```

Exemplo adequado:

```markdown
- **feat(unit-utils): criar método para manipular registro final sinc. por tabela**: cria um método utilitário responsável por manipular o filtro de registro final por tabela. Esse filtro será utilizado como watermark para determinar a partir de qual registro os dados devem ser buscados durante o sincronismo.
```

O objetivo é que o leitor consiga compreender rapidamente:

* o que foi alterado;
* qual é a finalidade da alteração;
* como aquela alteração contribui para a feature.

---

## 8. Links para os commits

Quando o projeto utilizar GitLab e for possível determinar a URL correta do repositório, crie links para os commits.

O formato preferencial é:

```text
<URL_DO_PROJETO>/-/commit/<HASH>
```

Caso o fluxo do projeto utilize links de diff por commit, também pode ser utilizado:

```text
<URL_DO_PROJETO>/-/merge_requests/<MR>/diffs?commit_id=<HASH>
```

**Nunca invente uma URL.**

Se não for possível determinar a URL correta, apresente a mensagem do commit sem link.

---

## 9. Gere a seção "Testes de Validação"

A seção **Testes de Validação** deve conter instruções para que um usuário, especialmente o time de QA, consiga validar manualmente se a alteração implementada produz o resultado esperado.

**Não devem ser criados testes unitários, testes de integração, testes automatizados ou código de teste.**

Os testes desta seção representam **cenários de validação funcional/manual**, ou seja, passos que um usuário poderia executar no sistema para verificar o comportamento da feature ou correção.

### Objetivo

Os cenários devem ser construídos a partir do entendimento obtido durante a análise:

* do contexto da alteração;
* do problema que precisava ser resolvido;
* do resultado esperado;
* dos commits da branch;
* dos diffs;
* do comportamento implementado;
* das informações adicionais fornecidas pelo usuário.

A LLM deve pensar como um profissional de QA que recebeu o MR e precisa saber:

1. o que deve ser feito;
2. onde deve ser feito;
3. quais condições precisam existir;
4. qual comportamento deve ser observado;
5. qual resultado confirma que a implementação está correta.

### Regra de ouro dos testes

> **Os testes devem validar o comportamento esperado da alteração, e não simplesmente verificar se o código executa sem erro.**

Sempre que possível, descreva:

* pré-condições;
* passos para execução;
* resultado esperado.

Não é necessário criar uma estrutura excessivamente formal quando um cenário simples puder ser descrito de forma objetiva.

### Como derivar os testes

Utilize o seguinte raciocínio:

```text
Contexto
   ↓
Problema a resolver
   ↓
Resultado esperado
   ↓
Alterações realizadas
   ↓
Comportamentos observáveis afetados
   ↓
Cenários de validação manual
```

A pergunta central deve ser:

> **Como um usuário poderia comprovar que o problema descrito no contexto foi realmente resolvido?**

Essa pergunta deve orientar a criação dos cenários.

### Exemplo

Se o contexto indicar que a feature permite filtrar pedidos de compra por fornecedor, e as alterações implementarem esse filtro:

```markdown
### Cenário 1 — Filtrar pedidos por fornecedor

1. Acesse a tela de Pedidos de Compra.
2. Informe um fornecedor que possua pedidos cadastrados.
3. Execute a consulta.
4. Verifique os pedidos apresentados.

**Resultado esperado:** devem ser exibidos somente os pedidos pertencentes ao fornecedor informado.
```

Um teste inadequado seria:

```markdown
### Cenário 1

1. Acesse a tela de Pedidos de Compra.
2. Clique em consultar.

**Resultado esperado:** a tela deve funcionar corretamente.
```

Esse cenário não valida especificamente o comportamento implementado.

---

### Teste baseado no comportamento, não na implementação

Os testes devem validar **efeitos observáveis pelo usuário**, e não detalhes internos do código.

Por exemplo, se o código implementa um mecanismo de `watermark`, o teste não deve orientar o QA a verificar uma variável, método, propriedade ou estrutura interna utilizada para armazená-lo.

Em vez disso, deve validar o efeito produzido pela funcionalidade:

```markdown
### Cenário 1 — Evitar o reprocessamento de registros

1. Execute a sincronização com registros pendentes.
2. Aguarde a conclusão.
3. Execute novamente a sincronização sem inserir novos registros.

**Resultado esperado:** a segunda execução não deve processar novamente os registros que já foram sincronizados.
```

O QA deve conseguir executar o cenário **sem precisar conhecer a implementação interna da solução**.

---

### Comportamentos que devem ser considerados

Ao analisar as alterações, considere a necessidade de validar:

1. **Fluxo principal da feature**
   Comprovar que o comportamento esperado funciona.

2. **Regras de negócio alteradas**
   Comprovar que os critérios implementados estão sendo respeitados.

3. **Cenários alternativos relevantes**
   Comprovar comportamentos diferentes que possam ser afetados pela alteração.

4. **Regressões diretamente relacionadas**
   Verificar que comportamentos existentes diretamente relacionados à alteração continuam funcionando.

Considere cenários como:

* quando existe informação;
* quando não existe informação;
* quando o usuário informa um valor específico;
* quando o usuário não informa o valor;
* quando existe mais de um registro relacionado;
* situações limite relevantes para a regra implementada.

**Não é obrigatório criar todos esses cenários.**

Inclua somente aqueles que forem relevantes para as alterações analisadas.

---

### Não invente dados de teste

Não invente:

* códigos;
* registros;
* usuários;
* valores;
* parâmetros;
* regras de negócio;
* condições específicas.

Quando for necessário um dado para executar o teste, descreva a condição necessária.

Exemplo:

```markdown
### Cenário 1 — Processar somente novos registros

1. Acesse a funcionalidade de sincronização.
2. Utilize uma tabela que possua registros pendentes de sincronização.
3. Execute o sincronismo.
4. Após a conclusão, execute novamente o sincronismo sem inserir novos registros.

**Resultado esperado:** na segunda execução, somente registros ainda não processados devem ser considerados.
```

Isso é preferível a inventar dados específicos que não foram fornecidos ou não podem ser determinados pela análise.

---

### Quantidade de testes

Não existe uma quantidade fixa de cenários.

Crie **somente os cenários necessários para dar confiança de que a alteração atende ao objetivo do MR**.

Evite:

* testes redundantes;
* cenários genéricos;
* testes que não estejam relacionados às alterações;
* testes excessivamente detalhados;
* cenários criados apenas para aumentar a quantidade de testes.

A quantidade deve ser determinada pela complexidade, pelo impacto e pelos comportamentos alterados.

---

### Quando não for possível criar um teste funcional

Se a alteração for puramente interna e não houver comportamento observável suficiente para definir um teste manual confiável, não invente um cenário.

Nesse caso, utilize:

```markdown
Não foi identificado um cenário de validação manual específico para esta alteração.
```

---

## 10. Estrutura do MR

O arquivo deve conter **exatamente quatro seções principais**:

```markdown
# Contexto

<descrição do contexto>

# Informações Pertinentes

<informações fornecidas pelo usuário>

# Alterações

- [**commit 1**](<url>): resumo da alteração.
- [**commit 2**](<url>): resumo da alteração.

# Testes de Validação

### Cenário 1 — <descrição>

1. <passo>
2. <passo>
3. <passo>

**Resultado esperado:** <resultado esperado>

### Cenário 2 — <descrição>

1. <passo>
2. <passo>
3. <passo>

**Resultado esperado:** <resultado esperado>
```

Não crie automaticamente outras seções como:

* Testes;
* Evidências;
* Impacto;
* Riscos;
* Observações;
* Checklist;
* Considerações técnicas.

As informações devem permanecer dentro das quatro seções definidas.

---

## 11. Qualidade do conteúdo

O conteúdo deve ser:

* objetivo;
* claro;
* tecnicamente correto;
* fiel ao ticket;
* fiel ao código;
* baseado nas alterações reais;
* compreensível para alguém que não acompanhou a implementação;
* livre de informações inventadas.

Evite descrições excessivamente técnicas quando elas não agregarem valor ao entendimento da alteração.

Ao mesmo tempo, não simplifique uma alteração a ponto de perder sua finalidade.

### Exemplo

Mensagem do commit:

```text
feat(sincronismo): adicionar watermark por tabela
```

Não escreva simplesmente:

```text
Adiciona watermark por tabela.
```

Prefira:

```text
Adiciona o controle do último registro processado individualmente por tabela, permitindo que as próximas execuções utilizem esse registro como ponto de partida para buscar somente novos dados.
```

Da mesma forma, não gere um teste baseado apenas no nome técnico da implementação.

Prefira validar seu efeito:

```markdown
### Cenário — Não reprocessar registros já sincronizados

1. Execute a sincronização com registros pendentes.
2. Aguarde a conclusão.
3. Execute novamente a sincronização sem novos registros.

**Resultado esperado:** registros já processados não devem ser sincronizados novamente.
```

---

## 12. Validação final

Antes de criar o arquivo, confirme:

* [ ] A branch atual foi identificada.
* [ ] A branch base foi identificada.
* [ ] Os commits da branch foram identificados.
* [ ] Os diffs dos commits foram analisados.
* [ ] As alterações da branch pertencem ao mesmo contexto lógico.
* [ ] O contexto da feature está claro.
* [ ] Caso o contexto não estivesse claro, o usuário foi questionado.
* [ ] O usuário foi questionado sobre informações adicionais.
* [ ] A seção `Contexto` foi preenchida.
* [ ] A seção `Informações Pertinentes` foi preenchida.
* [ ] A seção `Alterações` contém os commits da branch.
* [ ] Cada commit possui um resumo baseado na análise do código.
* [ ] Os links dos commits foram adicionados somente quando puderam ser determinados com segurança.
* [ ] O resultado esperado da alteração foi identificado.
* [ ] Os comportamentos observáveis afetados pela alteração foram identificados.
* [ ] Foram criados cenários de validação manual quando aplicável.
* [ ] Os testes são reproduzíveis por um usuário/QA.
* [ ] Os testes validam comportamento, e não detalhes internos da implementação.
* [ ] Os testes foram derivados do contexto, resultado esperado e alterações dos commits.
* [ ] Não foram inventados dados, regras de negócio ou comportamentos.
* [ ] Foram evitados cenários redundantes ou genéricos.
* [ ] A seção `Testes de Validação` foi preenchida.
* [ ] O nome do arquivo segue o padrão `conteudo-mr-{nome-da-branch}.md`.
* [ ] O arquivo será criado em um diretório não monitorado pelo Git.

**Somente após todas as validações o arquivo deve ser criado.**

---

## 13. Resultado

Ao finalizar, informe:

* a branch analisada;
* o caminho do arquivo gerado.

Exemplo:

```text
MR gerado com sucesso.

Branch: feature/sincronismo

Arquivo:
<diretorio>/conteudo-mr-feature-sincronismo.md
```

A skill **não deve modificar arquivos da implementação da feature**.

Sua responsabilidade é exclusivamente:

1. analisar a branch;
2. compreender o contexto da alteração;
3. coletar informações adicionais do usuário;
4. identificar o resultado esperado;
5. identificar os comportamentos que precisam ser validados;
6. gerar instruções de testes manuais baseadas nesse comportamento;
7. gerar o conteúdo do Merge Request;
8. salvar o resultado no arquivo especificado.
