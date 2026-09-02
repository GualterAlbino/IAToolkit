---
name: organizar-imports
author: ricardoalves-dev
description: Organiza e agrupa imports de um arquivo de acordo com seu path e escopo ordenando de forma crescente
---

# Instruções
1. Esta organização deve ser realizado apenas em novos arquivos ou arquivo modificados.
2. Ao organizar imports, agrupe os mesmos pelo escopo.
3. Em seguida, adicione um comentário identificando o escopo
Ex:
```typescript
// Domain
import BaseMapeamento from '@/domain/base/BaseMapeamento';
import type TemaFinanceiroBruto from './TemaFinanceiroBruto';
import type ClienteModel from '@/domain/cliente/ClienteModel';
import TemaModel, { type TConfigSincronismo } from '../TemaModel';
import ParametrosExecucaoModel from '@/domain/parametros-execucao/ParametrosExecucaoModel';
import type FiltroExecucaoModel from '@/domain/parametros-execucao/filtro-execucao/FiltroExecucaoModel';
import SubprocessoExecucaoModel from '@/domain/parametros-execucao/subprocesso/SubprocessoExecucaoModel';
import type { TFiltroExecucaoModel } from '@/domain/parametros-execucao/filtro-execucao/FiltroExecucaoModel';
import type { TBaixaDuplicataTemaFinanceiroModel } from './detalhamentos/baixa-duplicata/BaixaDuplicataTemaFinanceiroModel';
import type { TGrupoResultadoTemaFinanceiroModel } from './detalhamentos/grupo-resultado/GrupoResultadoTemaFinanceiroModel';
import BaixaDuplicataTemaFinanceiroModel, {
  MapeamentoBaixaDuplicataTemaFinanceiro,
} from './detalhamentos/baixa-duplicata/BaixaDuplicataTemaFinanceiroModel';
import GrupoResultadoTemaFinanceiroModel, {
  MapeamentoGrupoResultadoTemaFinanceiroModel,
} from './detalhamentos/grupo-resultado/GrupoResultadoTemaFinanceiroModel';

// Shared - Enums
import DateUtils from '@/shared/utils/DateUtils';
import ETipoFiltro from '@/shared/enums/ETipoFiltro';
import EClausulaSQL from '@/shared/enums/EClausulaSQL';
import ECodificacao from '@/shared/enums/ECodificacao';
import { ETipoDuplicata } from './enums/ETipoDuplicata';
import FormatterUtil from '@/shared/utils/FormatterUtils';
import EFormatoFiltro from '@/shared/enums/EFormatoFiltro';
import { EOrigemDuplicata } from './enums/EOrigemDuplicata';
import { ESituacaoAuditoria } from './enums/ESituacaoAuditoria';
import { ESubOrigemDuplicata } from './enums/ESubOrigemDuplicata';
import EEstrategiaReceptor from '@/shared/enums/EEstrategiaReceptor';
import EMacroFiltroExecucao from '@/shared/enums/EMacroFiltroExecucao';
import EOperadorFiltroExecucao from '@/shared/enums/EOperadorFiltroExecucao';
import EIndicadorFiltroExecucao from '@/shared/enums/EIndicadorFiltroExecucao';
import ETipoOperacaoSincronismo from '@/shared/enums/ETipoOperacaoSincronismo';
import EEtapaProcessamentoTemaFinanceiro from './enums/EEtapaProcessamentoTemaFinanceiro';

// Constantes
import {
  cBASE_SQL_TEMA_FINANCEIRO,
  cCONSULTA_DUPLICATAS_PAGAR,
  cCONSULTA_DUPLICATAS_RECEBER,
  cCONSULTA_DUPLICATAS_EXCLUIDAS,
  cCONSULTA_DUPLICATAS_SUBSTITUIDAS,
} from './sql/TemaFinanceiroSQL';
```
4. Coloque os imports agrupados por escopo ordenados de forma crescente de acordo com o tamanho do texto
Ex:
```typescript
// Domain
import BaseMapeamento from '@/domain/base/BaseMapeamento';
import type TemaFinanceiroBruto from './TemaFinanceiroBruto';
import type ClienteModel from '@/domain/cliente/ClienteModel';
import TemaModel, { type TConfigSincronismo } from '../TemaModel';
import ParametrosExecucaoModel from '@/domain/parametros-execucao/ParametrosExecucaoModel';
```
