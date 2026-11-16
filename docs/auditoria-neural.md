# Auditoria Neural Evolution · Etapa 01 (16/11/2026)

Diagnóstico da simulação antes da Neural Evolution. Nenhum código do jogo foi alterado nesta etapa. Versão auditada: `338be64` (a `main` de 16/11).

## Como foi feita

- **Leitura do código** dos sistemas de macroeconomia (`pais.ts`, `regras.ts`), moeda, empresas e holding (`valor.ts`, `governanca.ts`, `economia.ts`), coroa, lugar no país e conteúdo.
- **Testes existentes:** `npx vitest run` → 59 arquivos, 582 testes, todos passando (16/11).
- **Túnel de 10.000 vidas:** rodado nesta mesma versão na publicação de 16/11 (`docs/metricas.md`); não foi rodado de novo.
- **Experimento novo, dinastias longas** (script de bancada, fora do repositório): `nascer` + `viver` (o robô do túnel) + `continuarComoHerdeiro`, até 12 gerações, começando em 2026. Sementes, estratégia e classe de origem: 101 arriscada classe 5; 202 cautelosa classe 5; 303 arriscada classe 6; 404 cautelosa classe 2. O sorteio do robô de cada geração é `semente × 31 + geração`.
- **Evidência do dono:** cinco fotos de uma vida real (PIB de R$ 51.194 trilhões, 74,9 milhões de pessoas, holding de R$ 5.147 trilhões).

O que é **comprovado** tem a evidência ao lado. O que é **hipótese** está marcado assim.

## Resultado do experimento (semente 101, arriscada, classe 5)

| Geração | Ano | PIB | População | PIB por pessoa | Renda de quem joga | Caixa da holding com a dupla | Inflação |
|---|---|---|---|---|---|---|---|
| 1 | 2083 | 6,1e13 | 193 mi | R$ 314 mil | R$ 300 mil | — | 2,2% |
| 4 | 2197 | 4,5e14 | 134 mi | R$ 3,3 mi | R$ 380 mil | 2,4e8 | 5,4% |
| 7 | 2307 | 6,6e15 | 88 mi | R$ 74 mi | R$ 220 mil | 2,1e14 | 9,0% |
| 10 | 2401 | 3,4e16 | 64 mi | R$ 530 mi | 3,4e13 | 8,6e14 | 11,9% |
| 11 | 2441 | 3,5e16 | 53 mi | R$ 661 mi | 3,5e13 | 1,4e15 | 10,3% |
| 12 | 2465 | 2,3e16 | 48 mi | R$ 475 mi | R$ 6 mi | 1,8e14 | 13,7% |

As outras três dinastias acabaram antes por falta de herdeiro (gerações 2, 6 e 1) e mostram a mesma inclinação do PIB no trecho que viveram.

---

## CRÍTICO — compromete a integridade da simulação

### C-01 · O PIB cresce em juro composto para sempre, sem convergência
- **Onde:** `pais.ts:800` (o PIB do ano), `pais.ts:230` (`potencialDe`), `regras.ts:552` (`CRESCIMENTO_POTENCIAL = 2`).
- **Sistema:** macroeconomia.
- **Evidência:** no experimento, o PIB vai de 6,1e13 (2083) a 3,5e16 (2441), e o PIB por pessoa de R$ 314 mil a R$ 661 milhões. Na vida do dono: R$ 51.194 trilhões e R$ 684 milhões por pessoa.
- **Consequência:** depois de umas seis gerações, todos os números do país perdem sentido, e tudo que é proporcional ao PIB (o mercado de cada setor, as listas dos mais ricos, a renda da coroa) explode junto.
- **Causa:** o crescimento potencial é uma constante (2% ao ano, mais educação e tecnologia) que não depende do nível de renda nem da população. Nada puxa o crescimento para baixo quando o país já é rico ou encolhe.
- **Correção recomendada:** crescimento por pessoa com convergência (o potencial cai quando o PIB por pessoa se afasta de uma fronteira que anda devagar), somado ao crescimento da população.
- **Teste:** dinastia de 12 gerações com o PIB por pessoa dentro de um limite declarado (por exemplo, até 8 vezes o de 2026 em 400 anos); invariante no túnel.

### C-02 · Salários, custos e limiares em reais fixos não acompanham a economia
- **Onde:** `trabalho.ts` e `carreira.ts` (nenhuma leitura do PIB ou do PIB por pessoa), `campos.ts:781` (`LIMITES_CLASSE`), `empresa.ts:814`, `governanca.ts:98`, `grupo.ts:54`, os valores do conteúdo.
- **Sistema:** renda, custo de vida, classes, conteúdo.
- **Evidência:** a renda de quem joga fica em torno de R$ 300 mil da geração 1 à 9, enquanto o PIB por pessoa sobe mais de 700 vezes. A maior jogada do conteúdo custa R$ 600 bilhões.
- **Consequência:** o país produz R$ 684 milhões por pessoa e o salário é de R$ 300 mil: PIB incompatível com a renda. Os preços do conteúdo viram troco.
- **Causa:** os valores foram calibrados para o Brasil de 2026 e nunca foram indexados.
- **Correção recomendada:** resolver C-01 primeiro (com o PIB por pessoa contido, a maior parte deixa de ser problema); depois, indexar salário e limiares ao PIB por pessoa onde ainda fizer diferença.
- **Teste:** a razão entre a renda mediana dos robôs e o PIB por pessoa fica numa faixa declarada em todas as gerações.

### C-03 · O caixa aplicado da holding rende sem teto
- **Onde:** `valor.ts:235` (o rendimento do caixa aplicado), contra `economia.ts:200` (o teto dos investimentos de quem joga, `CAPACIDADE_DO_MERCADO = 5e12`).
- **Sistema:** holding, dupla do valor.
- **Evidência:** caixa da holding de 1,4e15 no experimento e de R$ 5.147 trilhões na vida do dono, mil vezes o teto de R$ 5 trilhões que vale para os investimentos pessoais.
- **Consequência:** contratar a dupla vira uma máquina de dinheiro sem limite: o caminho de exploração mais forte do jogo.
- **Causa:** defeito introduzido na atualização "a dupla aloca de verdade" (I-180): a carteira da holding não passou pela regra "o mundo tem tamanho".
- **Correção recomendada:** o mesmo teto dos investimentos pessoais, somando a holding e quem joga.
- **Teste:** holding com caixa acima do teto rende só sobre o teto; dinastia longa com a dupla.

## ALTO — compromete o realismo ou a progressão

### A-01 · Valores passam do limite de precisão dos números
- **Onde:** todo o livro (`livro.ts`), `pais.ts:800`.
- **Evidência:** PIB de 3,5e16 e conta do mercado de 1,8e16, acima de 9,0e15 (o maior inteiro exato). Conferido: `3.5e16 + 1 === 3.5e16`.
- **Consequência:** somas e arredondamentos perdem unidades; a conferência do dinheiro do mundo usa uma folga proporcional (`invariantes.ts`), que esconde o erro.
- **Causa:** consequência de C-01 e C-03. **Correção:** resolver os dois; depois, um invariante de teto para qualquer valor em reais. **Teste:** o invariante no túnel e na auditoria.

### A-02 · A renda da coroa é uma fração do PIB
- **Onde:** `coroa.ts:56`, `regras.ts:704` (`taxa: 0.001`).
- **Evidência:** renda de 3,4e13 por ano nas gerações 10 e 11 (exatamente 0,1% do PIB).
- **Consequência:** com C-01, o monarca recebe dezenas de trilhões por ano. **Correção:** some com C-01; conferir se a fração faz sentido com o PIB contido. **Teste:** dinastia longa com coroa.

### A-03 · A população encolhe para sempre
- **Onde:** `pais.ts:339` (`taxaDaPopulacao`), `regras.ts:561` (piso de −0,35% ao ano).
- **Evidência:** 213 milhões em 2026, 48 milhões em 2465, sem estabilizar.
- **Consequência:** em dinastias longas o país se esvazia, e o PIB por pessoa sobe ainda mais. **Correção:** a taxa volta a zero quando a população cai abaixo de um patamar. **Teste:** população dentro de uma faixa em 400 anos.

### A-04 · Acima de R$ 1 trilhão não há o que fazer
- **Onde:** `conteudo/storylets/*.json`.
- **Evidência:** dos 1.004 storylets, 943 não têm piso de patrimônio, 18 pedem entre R$ 1 bilhão e R$ 1 trilhão, e nenhum pede R$ 1 trilhão ou mais. A jogada mais cara custa R$ 600 bilhões.
- **Consequência:** é o que o dono sentiu: nesse patamar o dinheiro compra tudo, nada mais reage, e não há objetivo novo.
- **Correção recomendada:** uma camada de fim de jogo, com custos e riscos proporcionais ao tamanho do país (não em reais fixos), depois de C-01 a C-03.
- **Teste:** storylets da camada aparecendo no túnel em vidas extremas.

### A-05 · Ninguém testava dinastias longas nem jogadores extremos
- **Onde:** `scripts/auditoria.ts` (até 4 gerações), `scripts/tunel.ts` (20 vidas por jogador, cada uma começando do zero).
- **Evidência:** o túnel e a auditoria passam, e C-01, C-03 e A-01 existem. O robô mais rico do túnel tem patrimônio mediano de R$ 27 milhões; o dono chegou a R$ 5.154 trilhões.
- **Consequência:** os defeitos de longuíssimo prazo só aparecem no celular do dono.
- **Correção recomendada:** uma bancada de dinastias longas com robôs que exploram, com invariantes de escala. É a base honesta da "rede neural": um explorador que aprende, rodando na bancada.
- **Teste:** a própria bancada no `verificar`.

### A-06 · A inflação sobe nas gerações tardias (causa não isolada)
- **Evidência:** 2% a 5% nas gerações 1 a 6; 9% a 14% nas gerações 7 a 12 (semente 101).
- **Hipótese:** o rendimento do caixa da holding e a renda da coroa injetam dinheiro que circula (a regra "o que quem joga recebe do mercado move o dinheiro"). Não foi verificado.
- **Teste:** repetir a dinastia depois de C-03 e A-02 e comparar.

## MODERADO — reduz a qualidade ou a profundidade

- **M-01 · Repetição entre vidas.** 86,6% das instâncias de storylet da 20ª vida já foram vistas (`docs/metricas.md`). O conteúdo satura para quem joga muito.
- **M-02 · Histórias na beira.** 72 storylets aparecem em menos de 0,05% das vidas; quatro sumiram por acaso em rodadas recentes (I-174).
- **M-03 · A dupla ainda nega muito.** 9 pedidos aprovados contra 66 negados no túnel; o rendimento do caixa aplicado variou de +R$ 141 bilhões a −R$ 26 bilhões entre rodadas.
- **M-04 · "0,0027% do PIB" ao lado de um grupo de R$ 5.154 trilhões.** O número é o valor adicionado do grupo (certo), mas o caixa da holding não produz nada; o rótulo engana (`Grupo.tsx`).
- **M-05 · Patrimônio menor que o caixa da holding** (semente 101, geração 11: 2,5e14 contra 1,4e15). **Hipótese:** a parte de quem joga na holding foi diluída na herança. Não verificado.
- **M-06 · Save acima de 1 MB** nas vidas com muitas empresas (máximo de 1.287 KB no túnel).
- **M-07 · CPU por vida** em 184 ms contra o portão de 48 ms (o portão é informativo e depende da máquina).

## BAIXO — melhoria desejável

- **B-01 ·** 483,7 toques por vida contra o teto informativo de 480.
- **B-02 ·** o honorário mínimo da dupla e os capitais mínimos são reais fixos (some com C-01).
- **B-03 ·** os robôs do túnel não governam por muitas gerações nem acumulam coroa, ilha e holding juntas.

---

## Priorização

**Os dez mais importantes:** C-01, C-03, C-02, A-05, A-04, A-01, A-02, A-03, A-06, M-01.

**Antes da Neural Evolution:** C-01, C-03 e A-05. Sem conter o PIB e o caixa da holding, qualquer explorador só vai reencontrar esses dois defeitos; sem a bancada de dinastias longas, não há como medir nada do que vier depois.

**O que funciona:**
- o livro-razão e as contas (todo real com contraparte: 4,2 milhões de entradas conferidas no túnel, sem problema);
- as dívidas como contratos;
- o determinismo;
- os invariantes de estado dentro de uma vida;
- o ciclo de cada setor;
- a régua do lugar no país (ela acompanha o PIB por pessoa);
- os 582 testes.

**O que precisa de reconstrução:**
- o crescimento de longo prazo (potencial com convergência e demografia que estabiliza);
- a camada de conteúdo de fim de jogo;
- a bancada de teste de longuíssimo prazo.

**Dependências:** C-02, A-01, A-02 e B-02 dependem de C-01. A-06 depende de C-03 e A-02. A-04 depende de C-01 a C-03 (os custos da camada nova precisam de uma economia estável).

**Ordem recomendada:**
1. A-05: a bancada de dinastias longas, com os invariantes de escala falhando hoje (para provar o defeito).
2. C-03: o teto do caixa aplicado da holding.
3. C-01 e A-03: crescimento com convergência e população que estabiliza.
4. Reavaliar C-02, A-01, A-02 e A-06 com os números novos e corrigir o que sobrar.
5. A-04: a camada de fim de jogo.
6. O explorador que aprende (a rede neural de bancada), com relatório.

## Limites desta auditoria

- **Relações, eventos, mortalidade e sucessão** não foram reauditados a fundo nesta etapa; a última auditoria deles é a missão AAA (10/11) e a auditoria de dinastias do `verificar`, que passam.
- **Uma só dinastia chegou a 12 gerações.** Os números do experimento são de uma semente; a direção é confirmada pela vida do dono, mas as magnitudes variam.
- **A rede neural pedida não pode coletar dados de jogadores reais:** o jogo não tem servidor, por regra do dono. O que é possível é o explorador de bancada (item 6) e, se o dono quiser, a leitura de um save exportado por ele.
