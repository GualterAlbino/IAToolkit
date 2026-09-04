---
name: gestor-worktree
author: GualterAlbino
description: >
  Isola o trabalho de múltiplos agentes (terminais simultâneos) em git worktrees, garantindo que
  não sobrescrevam, travem ou conflitem arquivos no mesmo repositório durante o desenvolvimento.
---

# 🛠️ Skill de Sistema: Gestor de Git Worktree para Agentes

**Objetivo:** Garantir que múltiplos agentes (terminais simultâneos) não sobrescrevam, travem ou conflitem arquivos no mesmo repositório durante o desenvolvimento. 

**Regras de Execução:**

1. **Identificação do Agente:**
   Ao iniciar uma nova sessão ou tarefa, você deve assumir uma identidade de terminal sequencial (ex: `agente1`, `agente2`, `agente3`, etc.) caso o usuário não tenha definido uma.

2. **Isolamento Obrigatório (Setup):**
   Antes de editar qualquer arquivo no repositório principal, você deve criar um Git Worktree isolado. 
   * Execute: `git worktree add ../<nome-do-repo>-<id-do-agente>-<nome-da-task> -b <nome-da-branch>`
   * Mude o diretório do terminal para este novo worktree recém-criado.
   * *Nota:* Crie o worktree sempre um nível acima do repositório principal (`../`) para evitar problemas de aninhamento de pastas lidas pelo Git, ou em uma pasta `.worktrees` previamente ignorada no `.gitignore`.

3. **Execução da Tarefa:**
   Realize todas as edições, instalações de pacotes, testes e commits exclusivamente dentro do diretório do seu worktree.

4. **Protocolo de Encerramento (Obrigatório):**
   Assim que a tarefa designada for concluída, você **NÃO DEVE** fazer merge automático na branch principal nem excluir o diretório por conta própria. Você deve obrigatoriamente pausar a execução e perguntar ao usuário:
   
   > *"Tarefa concluída no worktree do [agenteX]. Você deseja que eu encerre e faça o merge deste worktree com a branch principal, ou prefere continuar trabalhando nele?"*

5. **Ações Pós-Resposta do Usuário:**
   * **Se o usuário escolher "Continuar":** Aguarde as próximas instruções e continue operando dentro do mesmo worktree.
   * **Se o usuário escolher "Encerrar/Merge":**
     1. Faça o commit das alterações pendentes (se houver).
     2. Mude para o repositório principal.
     3. Faça o merge da branch do agente com a branch alvo.
     4. Remova o worktree com segurança: `git worktree remove <caminho-do-worktree>`
     5. Exclua a branch de trabalho temporária (opcional, confirme se necessário).

---

### Exemplo prático de fluxo que o agente deve seguir:

Se você for o `agente1` trabalhando em uma feature de login:
```bash
# 1. Criação e isolamento
git worktree add ../meu-projeto-agente1-login -b feature/agente1-login
cd ../meu-projeto-agente1-login

# 2. Trabalha no código...
git add .
git commit -m "feat: implementa validação de login"

# 3. Pausa e interage com o usuário
# "Devo encerrar/fazer merge ou continuar?"
```