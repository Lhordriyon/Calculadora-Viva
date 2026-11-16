# Etapa 02 · O laboratório de longo prazo

Data: 16/11/2026. Pedido do dono: "TRAJETÓRIA — ETAPA 02 / LONG-HORIZON SIMULATION LAB", depois da auditoria da etapa 01 (`docs/auditoria-neural.md`). Sem a rede neural nesta etapa.

O resumo em uma frase: o universo deixou de crescer para sempre. Em 100 gerações, o PIB ia de R$ 11,7 trilhões a 10⁴⁰ reais, a população caía a 7.515 pessoas e o dinheiro do mundo deixava de somar zero. Agora o país cresce em direção a uma renda que anda com o mundo e desacelera, a população para num tamanho, e nenhum invariante de escala quebra em 100 gerações.

## 1. O que foi construído: a bancada de dinastias

`npm run dinastias` (`scripts/dinastias.ts`) joga a mesma família por muitas gerações e mede o que só aparece em séculos.

- **Cenários controlados** (nove): rica e arriscada, rica e cautelosa, bilionária e arriscada, trilionária e cautelosa, classe média e arriscada, pobre e cautelosa, realeza e cautelosa, regime e arriscada, origem sorteada e aleatória.
- **Sementes reproduzíveis**: 101, 202, 303… (`--sementes=N`). A mesma versão do motor dá a mesma rodada, número por número.
- **Métricas por geração** (no JSON e numa tabela em Markdown): ano, PIB em reais de hoje e nominal, população, PIB per capita, crescimento e inflação médios da vida, inflação máxima de um ano, dívida pública, renda aos 40 e ela diante do PIB per capita, patrimônio e ele diante do PIB, percentil da riqueza, dívida de quem joga, número de empresas, caixa das holdings, rendimento da holding, dinheiro do mercado diante do PIB, maior número em reais, resíduo do dinheiro do mundo, tamanho do save e CPU.
- **Comparação entre rodadas** (`--comparar=rodada.json`): para cada dinastia, a primeira geração em que algo mudou e o que mudou; e a tabela de antes e depois por geração.
- **Reprodução de falhas** (`--reproduzir=cenario:semente --geracao=N`): refaz a dinastia e imprime a geração N ano a ano, com as entradas do livro que moveram mais de um décimo do PIB numa conta do país (foi assim que o defeito da herança apareceu).
- **A família sem herdeiro continua por um sobrinho** (a intervenção da bancada, contada em "fim natural"): sem isso, só uma de 27 dinastias chegaria a 12 gerações, e nenhuma a 25.
- **Permanente**: `npm run dinastias:ci` (9 dinastias, 12 gerações, 24 s, sai com erro se um invariante quebrar) entra no `npm run verificar` e no CI. As rodadas de referência ficam em `docs/bancada/` (antes e depois desta etapa, 12 e 100 gerações).

### Os invariantes de escala (limites absolutos)

Nenhum limite cresce com o tamanho do país. Cada um diz o ano e a geração em que quebrou pela primeira vez.

| Invariante | O limite | Por quê |
|---|---|---|
| precisão | todo campo em reais abaixo de 2^53 | acima disso, o ponto flutuante deixa de guardar os reais um a um |
| resíduo | o dinheiro do mundo soma zero com R$ 100 de folga | os centavos do arredondamento; a bancada mede R$ 0,03 |
| PIB per capita | entre 1/5 e 50 vezes o de 2026 | o modelo alcança umas 29 vezes (a fronteira para em 8,2; as melhores políticas, escola e tecnologia dão 3,3 vezes de nível) mais o que o grupo de quem joga acrescenta; 1/5 é um país que regrediu um século |
| salário | quem vive de salário, dos 25 aos 60, ganha pelo menos 1/20 da renda média | o salário desligado do tamanho do país |
| patrimônio | ninguém tem mais que 6 PIBs | toda a riqueza de um país fica em torno disso |
| rendimento | o que o dinheiro aplicado de quem joga (a carteira e o caixa que a dupla aplica) rende no ano não passa do que o mercado comporta de um dono vezes o melhor retorno do ano | mais que isso é dinheiro rendendo fora do mercado (era o caixa da holding antes) |
| população | acima de 20 milhões | nove em cada dez pessoas sumiram |
| moeda | o dinheiro do mercado não fica negativo; nenhuma empresa tem mais que um PIB em caixa | fluxos que não têm de onde vir |
| consolidado | a parte de quem joga nas empresas é a soma, empresa por empresa, da parte efetiva vezes o valor; a holding vale o caixa | patrimônio contado duas vezes, ativo duplicado |
| estado | os invariantes do motor (`invariantes.ts`) depois de cada ano | |
| contas | cada entrada do livro fecha (`contas.ts`) | |

No motor (`invariantes.ts`), duas mudanças: a folga do dinheiro do mundo virou fixa (R$ 100; era o PIB × 10⁻¹¹, que crescia com o erro) e todo campo em reais é conferido contra 2^53. As duas valem na auditoria, no túnel e nos testes.

## 2. Os problemas corrigidos

| # | Problema (etapa 01) | Comprovado na bancada antes | Correção | Arquivos |
|---|---|---|---|---|
| C-01 | O PIB compunha o crescimento para sempre | PIB per capita 13 mil vezes o de 2026 na 12ª geração, 10³¹ vezes na 100ª | o crescimento converge para uma renda potencial que anda com uma fronteira que desacelera | `pais.ts`, `campos.ts`, `regras.ts` |
| A-03 | A população encolhia 0,35% ao ano para sempre | 7.515 pessoas na 100ª geração | o espaço que sobra faz as famílias voltarem a crescer | `pais.ts`, `regras.ts` |
| C-02 | Salários em reais fixos num país cada vez mais rico | salário de 1/400 da renda média na 8ª geração | o salário de entrada anda com o PIB per capita; o de quem trabalha, com a tendência | `campos.ts`, `trabalho.ts`, `carreira.ts`, `poder.ts`, `herdeiro.ts`, `coroa.ts` |
| C-03 | O caixa aplicado da holding rendia sem teto | R$ 5 × 10¹⁸ de rendimento numa vida | o mercado comporta 43% do PIB de um dono, dividido entre a carteira e a holding | `campos.ts`, `economia.ts`, `valor.ts` |
| A-01 | Números acima de 2^53 | 24 de 27 dinastias já na 12ª geração | os números ficam limitados pelo modelo; invariante de 2^53 no motor | `invariantes.ts` |
| novo | A herança reabria as contas do país do zero | o dinheiro do mercado em −9,6 PIBs; depressões de anos sem causa | as contas passam inteiras a quem herda | `moeda.ts`, `herdeiro.ts` |
| novo | O caixa das empresas não perdia a inflação | caixa de empresa de 3 PIBs | o caixa parado perde a inflação, como a conta de quem joga | `empresa.ts`, `valor.ts` |
| novo | Dois imóveis herdados com o mesmo id | 4 de 9 dinastias de 100 gerações (o contrato sem o imóvel) | o id livre confere também o número | `contratos.ts` |
| novo | O ciclo media o crescimento contra 2% fixos | (túnel rápido) o bilionário feito sumiu: 0,00% de quem nasce sem fortuna | o momento do ano, a aprovação e a causa da virada medem contra a tendência; a economia aquecida é o hiato | `pais.ts` |
| novo | A ilha que quem joga funda compunha para sempre | o PIB da ilha acima de 2^53 na 37ª geração | a renda persegue um potencial da fronteira; a população, o espaço da ilha | `coroa.ts`, `regras.ts` |
| novo | Os bens valorizavam para sempre | 53 bens valendo 4,2 PIBs, um deles 3,2 PIBs, na 100ª geração | a valorização própria para acima de 4,5 vezes o preço justo | `bens.ts`, `regras.ts` |
| novo | Uma classe pequena da carteira podia ter o mercado inteiro | 39% do PIB em cripto, rendendo 53% do PIB num ano | cripto e fundos imobiliários até 3% do PIB por dono | `campos.ts`, `economia.ts` |
| novo | O excedente acima do mercado não perdia nada | uma família com 114% do PIB | o excedente parado perde a inflação, como dinheiro parado | `economia.ts` |
| novo | O túnel contava a guerra de preços como guerra militar | a "guerra de 25 anos" do túnel rápido | a medida conta só os países de fora | `scripts/tunel-vida.ts` |
| A-06 | A inflação subia nas gerações tardias | (ver a seção 4) | efeito do dinheiro do mundo que deixava de fechar; com ele fechado, a inflação média ficou entre 4,7% e 5,8% em todas as gerações | |

## 3. As decisões matemáticas e as fórmulas

### 3.1 O crescimento

**Antes** (`pais.ts`):

```
PIB(t) = PIB(t−1) × (1 + g(t)/100)
g(t)   = limitar(pot + 0,8 × (g(t−1) − pot) + choque + 0,6 × impulso − 0,12 × (juro real − neutro − 0,5) + moeda, −9, 12)
pot    = 2 + políticas + 0,015 × (educação − 50) + 0,02 × (tecnologia − 50) − dívida acima de 90 − violência acima de 25
```

O potencial era um ritmo, não um destino: 2% ao ano, para sempre.

**Depois**:

```
pot        = tendência(t) + políticas + 0,015 × (educação − 50) + 0,02 × (tecnologia − 50) − dívida − violência   (o ciclo é o mesmo)
tendência  = 100 × (F(t)/F(t−1) − 1)  +  n(t)  +  limitar(2 × ln(y*/y), −6, 6)
F(t)       = exp(0,014 × 150 × (1 − e^(−(t−2026)/150)))      a fronteira do mundo (1 em 2026, 8,2 no limite)
y*(t)      = y*(t−1) × F(t)/F(t−1)                            a renda potencial por pessoa (pais.renda_potencial)
y*(2026)   = y(2026) × e^0,075                                8% acima da de hoje: os 2% de sempre em 2026
```

`y` é o PIB per capita e `n`, o crescimento da população. Em 2026: 1,4 (fronteira) + 0,45 (gente) + 0,15 (convergência) = 2%.

- **A fronteira desacelera** pela ideia do crescimento semi-endógeno: as ideias vêm de gente, e a população do mundo para de crescer perto de 2085. Os 1,4% de 2026 são o ritmo por pessoa dos países ricos de 1990 a 2019; a escala de 150 anos deixa o avanço perto de 1% até o fim do século. É a hipótese mais forte do modelo. A alternativa (1,4% para sempre) deixaria o PIB composto, só mais devagar. Uma escala de 85 anos, testada primeiro, deixava o limite em 2,8 vezes, mas dava quase as mesmas recessões (a seção 3.7).
- **O que antes mudava o ritmo agora muda o nível.** As políticas, a escola, a tecnologia, a dívida e a violência continuam somando ao potencial de cada ano; a convergência transforma um ponto a mais por ano em uns 65% a mais de renda no longo prazo (`e^(1/2)`). Entre o melhor e o pior país possível, umas 40 vezes (o melhor soma 2,4 pontos ao potencial; o pior tira uns 5), da ordem do que existe entre países de verdade.
- **O grupo de quem joga**: o valor adicionado a mais que ele traz ao PIB (`empresa.ts › pesoNoPib`) ergue a renda potencial junto. A capacidade que ele construiu é do país, e a convergência não a desfaz.
- **O save antigo** (`iniciarNumeros`): o país que seguiu o caminho comum ganha a renda potencial do ano dele; o que já tinha crescido demais fica com a renda que tem como potencial e para de compor, sem perder um real.

### 3.2 A população

**Antes**: `n = max(−0,35; 0,45 − 0,022 × (t − 2026)) + 0,01 × (saúde − 50) + 0,006 × (pobreza − 25)`.

**Depois**: o mesmo, mais `0,5 × ln(213 milhões ÷ população)`. Com menos gente do que o país já teve, morar e criar filho fica mais barato. Não é crescimento imposto: é uma volta para um tamanho que depende da saúde e da pobreza (com as duas na média, uns 105 milhões, devagar: uns 200 anos de meia-vida). A guerra continua tirando gente.

### 3.3 O salário

**Antes**: o salário de entrada era o do cargo em reais de 2026 (`salarioDoCargo`), o do cargo eletivo e o da Casa Real eram fixos, e o de quem trabalhava subia o `crescimento` do setor (0,3% a 2% ao ano) mais o ciclo.

**Depois** (`campos.ts › indiceDeSalarios`):

```
índice = limitar((y / y*) × e^0,075 × F(t), 0,3, 30)     o PIB per capita diante do de 2026 (no caminho comum)
salário de entrada = salário do cargo × índice            carreira, cargo eletivo, Casa Real do Brasil, herdeiro adulto
salário de quem trabalha: + (crescimento do setor − 0,8%) + (tendência − n)   a cada ano, mais o ciclo
```

Os 0,8% são a média do que os setores davam; agora a produtividade vem do país, e o setor vale a diferença dele para a média. No save antigo cujo país cresceu demais, o índice é o do caminho comum (não salta 10 mil vezes).

**Os preços do conteúdo ficam em reais de hoje** (o carro, a festa, a viagem). Com o país a umas 2 vezes a renda de 2026 no fim da primeira vida e no máximo umas 9 vezes depois de séculos (no caminho comum), eles continuam pesando. Antes, com o PIB per capita 13 mil vezes o de 2026 na 12ª geração, nenhum preço dizia mais nada.

### 3.4 O dinheiro aplicado e a holding

**Antes**: a carteira de quem joga rendia até R$ 5 trilhões fixos (`CAPACIDADE_DO_MERCADO`); o caixa aplicado da holding rendia inteiro (`valor.ts`: `rendeu = aplicado × retorno`), tudo como reavaliação.

**Depois**:

```
capacidade = 0,427 × PIB                          (os R$ 5 trilhões de 2026)
aplicado   = carteira de quem joga + caixa aplicado das holdings com a dupla
cabe       = min(1, capacidade / aplicado)
rendeu na carteira = classe × retorno × cabe
rendeu na holding  = aplicado da holding × cabe × (w × ações + (1 − w) × Tesouro)
```

A parte em ações é cotação (reavaliação, o mercado); a parte no Tesouro é juro, pago pelo Tesouro. O teto não é um número escolhido para a holding: é a regra que já valia para a carteira, do tamanho da economia e dividida entre os dois bolsos do mesmo dono. A liquidez continua (o caixa não fica preso), o risco continua (a cotação pode perder) e as contas fecham (cada real tem o lado de lá).

**O caixa parado das empresas** perde a inflação do ano, para o Banco Central, como a conta de quem joga: `−(caixa − aplicado × cabe) × π/(1 + π)`. O que a dupla deixa aplicado e cabe no mercado não perde (já rendeu acima da inflação).

### 3.5 A herança e as contas do país

**Antes**: na vida de quem herda, `abrirContas` abria as contas do país do zero, com o mercado em `0,45 × PIB − dinheiro da vida`. Com uma fortuna grande, o mercado ficava negativo; o crédito tentava repor e a economia passava anos em queda (o PIB per capita caiu a 1/5 do de 2026 numa dinastia).

**Depois**: o banco, o Tesouro, o Banco Central e lá fora passam inteiros; o mercado fica com o resto (`−(dinheiro da vida + as outras contas)`), e a soma continua zero.

### 3.6 A precisão

BigInt e decimal foram avaliados e não adotados:

- o motor faz conta com frações em quase toda linha (juros, inflação, partes, rendimento), e BigInt não tem fração;
- uma biblioteca decimal multiplicaria o custo de cada operação, e o túnel joga 10.000 vidas por push;
- o save é JSON, e BigInt não serializa;
- a interface formata `number`.

A saída foi limitar os números pelo modelo e conferir o limite: com o país limitado, o maior número em reais da bancada (27 dinastias de 12 gerações e 9 de 100) ficou em 1,4 × 10¹⁴, 60 vezes abaixo de 2^53; o invariante do motor trava o contrário. As folgas de cada entrada do livro (meio real mais 10⁻⁹ do maior valor da entrada) ficaram: não acumulam no tempo, e os valores de uma entrada agora são limitados.

### 3.7 O ciclo contra a tendência, e as fases

**Antes**: o momento do ano (`momentoDe`: o que move os salários, o crescimento das empresas e o rendimento da família), a aprovação do governo e a causa da virada de fase comparavam o crescimento com 2% fixos (`desvio = g − 2`); a fase era o crescimento absoluto (aquecida a partir de 4%, recessão abaixo de −0,5%, crise abaixo de −2,5%).

**Depois**: `desvio = g − tendência` nos três; a economia aquecida é `g ≥ potencial + 2` (com o potencial de 2%, os 4% de sempre; encolhendo, nunca); a recessão e a crise continuam sendo o PIB caindo.

O primeiro túnel rápido (2.000 vidas) mostrou por que: com o país envelhecido crescendo perto de 1%, o momento contra 2% fixos era uma recessão permanente nos salários e nas empresas, e o bilionário feito sumiu (0,00% de quem nasce sem fortuna; antes, 0,33%).

As fases, medidas em 400 vidas (as mesmas sementes nas três colunas):

| Fase | Antes | Primeira versão (fronteira de 1,2% em 85 anos, ciclo contra 2%) | Final |
|---|---|---|---|
| normal | 63,8% | 64,3% | 52,6% |
| aquecida | 24,0% | 9,5% | 24,5% |
| recessão | 9,8% | 19,9% | 17,7% |
| crise | 2,4% | 6,3% | 5,3% |
| crescimento médio da vida | 2,06% | 0,92% | 1,13% |

A recessão quase dobrou porque o PIB passou a sentir a população encolhendo (o IBGE projeta a queda a partir de 2042). Ficou mais perto do Brasil real: de 1981 a 2023, o PIB caiu em 21% dos anos, e em 14% caiu mais de 2,5%. O portão do túnel "as fases têm o tamanho de antes" (do agente, incremento 8) virou "o tamanho de um Brasil que envelhece" (normal 45–72%, aquecida 15–30%, recessão 7–22%, crise 1–8%), com esse porquê registrado.

### 3.8 O que mais compunha para sempre

A bancada final, já com o país corrigido, achou mais quatro lugares onde um número crescia sem fim, cada um corrigido com o limite econômico dele:

- **A ilha** (`coroa.ts › anoDaIlha`). Antes: `renda por pessoa × (1 + 2,5% ± …)` e `população × (1 + 1% ± …)` todo ano. Depois: a renda persegue `80 mil × e^0,75 × F(ano)/F(fundação)` com a convergência de 2% ao ano (uns 2,5% nas primeiras décadas, como antes; reconhecida e a taxa viram nível), e a população cresce `(1% + reconhecida) × (1 − população ÷ 1 milhão) − fuga`.
- **Os bens** (`bens.ts › regraDosBens`). Antes: `valor × (1 + valorização própria + mercado + sorte)`, para sempre. Depois: a valorização própria vale enquanto `ln(valor ÷ preço justo) < 1,5`, com o preço justo `preço do catálogo × F(ano)/F(2026)`; acima, `−5% × (ln(valor ÷ justo) − 1,5)`.
- **As classes pequenas** (`campos.ts › parteQueCabeNaClasse`). Antes: um teto só para a carteira inteira (43% do PIB). Depois: cripto e fundos imobiliários também têm o tamanho deles, 3% do PIB por dono.
- **O excedente parado** (`economia.ts › economiaDoAno`). Antes: acima do teto, nem rendia nem perdia. Depois: perde `π/(1 + π)` ao ano, como a conta e o caixa parado das empresas.

## 4. Os resultados comparados (mesmas sementes e condições)

As rodadas completas, com os mínimos e as medianas de cada geração, estão em `docs/bancada/` (`antes-etapa-02-*` jogadas com o motor anterior, `depois-etapa-02-*` com o final; os JSON servem de `--comparar` para a próxima etapa). "Antes" e "depois" usam a mesma bancada, os mesmos cenários e as mesmas sementes. Os números em reais estão em reais de hoje (2,75e+13 = R$ 27,5 trilhões).

#### 27 dinastias, 12 gerações (9 cenários × 3 sementes)

| Métrica | g1 antes | g1 depois | g2 antes | g2 depois | g4 antes | g4 depois | g8 antes | g8 depois | g12 antes | g12 depois |
|---|---|---|---|---|---|---|---|---|---|---|
| PIB (mediana) | 3.81e+13 | 2.75e+13 | 1.04e+14 | 3.84e+13 | 3.08e+14 | 4.01e+13 | 5.63e+15 | 5.18e+13 | 5.48e+16 | 6.25e+13 |
| PIB (máximo) | 1.61e+14 | 5.92e+13 | 4.96e+14 | 8.60e+13 | 2.15e+15 | 7.44e+13 | 3.17e+16 | 1.19e+14 | 1.01e+18 | 1.11e+14 |
| PIB per capita / 2026 (mediana) | 3.70 | 2.62 | 11.11 | 3.86 | 40.33 | 4.80 | 1086.10 | 7.16 | 13234.76 | 9.84 |
| PIB per capita / 2026 (máximo) | 14.74 | 6.43 | 47.72 | 9.79 | 246.61 | 8.67 | 5635.98 | 15.82 | 2.71e+5 | 16.39 |
| população (mediana) | 1.94e+8 | 1.92e+8 | 1.73e+8 | 1.77e+8 | 1.40e+8 | 1.54e+8 | 9.07e+7 | 1.32e+8 | 5.97e+7 | 1.17e+8 |
| população (mínimo) | 1.76e+8 | 1.68e+8 | 1.56e+8 | 1.60e+8 | 1.18e+8 | 1.45e+8 | 7.34e+7 | 1.14e+8 | 4.79e+7 | 1.03e+8 |
| crescimento médio % (mediana) | 1.78 | 1.27 | 2.07 | 0.91 | 2.33 | -0.08 | 2.17 | 0.32 | 2.32 | 0.52 |
| inflação média % (mediana) | 4.62 | 4.70 | 5.00 | 4.71 | 4.64 | 4.65 | 5.22 | 4.87 | 5.01 | 5.02 |
| inflação máxima de um ano % (máximo) | 15.70 | 16.50 | 15.10 | 15.90 | 15.60 | 15.20 | 16.00 | 19.60 | 15.90 | 20.50 |
| renda aos 40 / PIB per capita, assalariados (mediana) | - | 1.65 | 0.04 | 0.49 | - | - | 2.36e-3 | - | - | 0.57 |
| patrimônio / PIB (máximo) | 0.09 | 0.22 | 0.10 | 0.86 | 0.06 | 0.42 | 0.04 | 0.20 | 0.02 | 0.07 |
| caixa das holdings / PIB (máximo) | 1.60e-5 | 3.36e-5 | 9.93e-5 | 3.75e-5 | 3.11e-3 | 5.12e-3 | 0.04 | 0.20 | 0.41 | 0.42 |
| rendimento da holding na vida (máximo) | 2.24e+8 | 0.00 | 4.91e+9 | 1.04e+7 | 3.26e+11 | 4.61e+10 | 1.01e+14 | 7.56e+12 | 1.33e+15 | 3.57e+13 |
| maior número em reais (máximo) | 1.61e+14 | 5.95e+13 | 4.96e+14 | 8.60e+13 | 2.15e+15 | 8.67e+13 | 5.76e+16 | 1.42e+14 | 1.01e+18 | 1.11e+14 |
| resíduo do dinheiro R$ (máximo) | 0.03 | 0.02 | 0.10 | 0.05 | 0.44 | 0.03 | 6.00 | 0.03 | 465.62 | 0.11 |
| dívida do país % PIB (mediana) | 83.10 | 82.40 | 83.70 | 87.50 | 85.40 | 80.90 | 88.80 | 83.50 | 85.46 | 85.70 |
| save KB (mediana) | 604.00 | 570.00 | 385.00 | 365.00 | 386.00 | 346.00 | 399.00 | 388.00 | 382.00 | 358.00 |

| Invariante | antes: dinastias / vezes | depois: dinastias / vezes |
|---|---|---|
| precisao | 24/27 / 2306 | 0/27 / 0 |
| residuo | 3/27 / 62 | 0/27 / 0 |
| pibPerCapita | 27/27 / 6965 | 0/27 / 0 |
| salario | 9/27 / 109 | 0/27 / 0 |
| patrimonio | 0/27 / 0 | 0/27 / 0 |
| rendimento | 9/27 / 600 | 0/27 / 0 |
| populacao | 0/27 / 0 | 0/27 / 0 |
| moeda | 0/27 / 0 | 0/27 / 0 |
| consolidado | 0/27 / 0 | 0/27 / 0 |
| estado | 0/27 / 0 | 0/27 / 0 |
| contas | 0/27 / 0 | 0/27 / 0 |

- Sobrevivência sem intervenção, antes: g1: 27, g2: 20, g4: 10, g8: 4, g12: 1
- Sobrevivência sem intervenção, depois: g1: 27, g2: 21, g4: 10, g8: 6, g12: 3
- CPU da rodada: antes 87 s, depois 80 s
- Primeira geração diferente: a 1ª, nas 27

#### 9 dinastias, 100 gerações (9 cenários × 1 semente)

| Métrica | g1 antes | g1 depois | g2 antes | g2 depois | g4 antes | g4 depois | g8 antes | g8 depois | g12 antes | g12 depois | g25 antes | g25 depois | g50 antes | g50 depois | g100 antes | g100 depois |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PIB (mediana) | 3.22e+13 | 2.71e+13 | 7.34e+13 | 4.27e+13 | 2.81e+14 | 3.90e+13 | 5.64e+15 | 5.02e+13 | 6.07e+16 | 7.11e+13 | 8.05e+19 | 7.47e+13 | 8.17e+26 | 6.86e+13 | 2.86e+40 | 6.43e+13 |
| PIB (máximo) | 1.28e+14 | 5.61e+13 | 3.49e+14 | 8.60e+13 | 1.56e+15 | 6.10e+13 | 1.27e+16 | 1.12e+14 | 9.12e+17 | 1.03e+14 | 6.09e+22 | 1.00e+14 | 7.03e+30 | 9.71e+13 | 2.05e+48 | 8.37e+13 |
| PIB per capita / 2026 (mediana) | 2.98 | 2.51 | 7.60 | 4.65 | 36.14 | 4.34 | 1179.23 | 6.95 | 16124.17 | 10.37 | 6.67e+7 | 12.39 | 1.13e+16 | 11.77 | 6.93e+31 | 10.86 |
| PIB per capita / 2026 (máximo) | 12.82 | 5.78 | 36.34 | 9.79 | 204.39 | 6.76 | 2430.47 | 15.82 | 2.67e+5 | 16.00 | 6.72e+10 | 16.04 | 7.88e+19 | 16.87 | 2.53e+39 | 14.05 |
| população (mediana) | 1.92e+8 | 1.90e+8 | 1.75e+8 | 1.76e+8 | 1.39e+8 | 1.54e+8 | 9.46e+7 | 1.32e+8 | 6.21e+7 | 1.18e+8 | 1.56e+7 | 1.05e+8 | 1.22e+6 | 1.06e+8 | 7515.00 | 1.08e+8 |
| população (mínimo) | 1.76e+8 | 1.77e+8 | 1.62e+8 | 1.60e+8 | 1.18e+8 | 1.45e+8 | 7.34e+7 | 1.20e+8 | 4.79e+7 | 1.13e+8 | 9.03e+6 | 1.00e+8 | 5.30e+5 | 1.01e+8 | 1169.00 | 1.03e+8 |
| crescimento médio % (mediana) | 1.63 | 1.41 | 2.49 | 1.12 | 1.80 | -0.23 | 3.00 | 0.42 | 2.41 | -5.88e-3 | 1.49 | 0.27 | 2.37 | 0.44 | 2.53 | 0.02 |
| inflação média % (mediana) | 4.47 | 4.64 | 5.35 | 5.01 | 4.34 | 4.35 | 5.56 | 4.78 | 5.01 | 5.15 | 4.50 | 5.18 | 4.87 | 5.09 | 5.00 | 5.31 |
| inflação máxima de um ano % (máximo) | 15.10 | 16.30 | 15.10 | 13.70 | 15.60 | 14.50 | 15.90 | 12.70 | 15.90 | 15.30 | 17.70 | 22.20 | 15.60 | 20.10 | 12.10 | 22.40 |
| renda aos 40 / PIB per capita, assalariados (mediana) | - | - | 0.04 | 0.49 | - | - | - | - | - | - | 9.73e-9 | - | - | - | - | 0.42 |
| patrimônio / PIB (máximo) | 6.95e-3 | 0.02 | 5.61e-3 | 0.01 | 5.21e-3 | 4.13e-3 | 0.04 | 1.92e-3 | 0.01 | 0.03 | 2.74e-4 | 0.02 | 3.70e-3 | 0.58 | 1.45e-8 | 1.18e-3 |
| caixa das holdings / PIB (máximo) | 0.00 | 0.00 | 0.00 | 0.00 | 1.16e-8 | 1.17e-5 | 0.04 | 0.03 | 0.08 | 0.09 | 0.02 | 0.51 | 8.75e-5 | 0.40 | 1.34e-14 | 0.22 |
| rendimento da holding na vida (máximo) | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 3.57e+6 | 4.42e+13 | 6.92e+11 | 3.22e+14 | 0.00 | 3.34e+16 | 5.96e+13 | 5.13e+18 | 3.12e+13 | 1.10e+17 | 1.55e+13 |
| maior número em reais (máximo) | 1.28e+14 | 5.61e+13 | 3.49e+14 | 8.60e+13 | 1.59e+15 | 6.54e+13 | 1.27e+16 | 1.12e+14 | 9.12e+17 | 1.03e+14 | 7.38e+22 | 1.04e+14 | 7.03e+30 | 1.08e+14 | 3.97e+61 | 8.37e+13 |
| resíduo do dinheiro R$ (máximo) | 0.03 | 0.01 | 0.04 | 0.05 | 0.22 | 0.02 | 3.55 | 0.03 | 248.00 | 0.05 | 7.34e+6 | 0.04 | 7.74e+14 | 0.05 | 3.85e+32 | 0.03 |
| dívida do país % PIB (mediana) | 84.30 | 78.90 | 81.70 | 86.20 | 90.30 | 84.80 | 88.50 | 83.70 | 82.60 | 86.00 | 88.00 | 88.90 | 84.30 | 79.30 | 81.70 | 79.80 |
| save KB (mediana) | 604.00 | 570.00 | 186.00 | 369.00 | 412.00 | 346.00 | 383.00 | 478.00 | 288.00 | 354.00 | 337.00 | 645.00 | 417.00 | 328.00 | 235.00 | 424.00 |

| Invariante | antes: dinastias / vezes | depois: dinastias / vezes |
|---|---|---|
| precisao | 9/9 / 321378 | 0/9 / 0 |
| residuo | 9/9 / 21345 | 0/9 / 0 |
| pibPerCapita | 9/9 / 26884 | 0/9 / 0 |
| salario | 6/9 / 469 | 0/9 / 0 |
| patrimonio | 0/9 / 0 | 0/9 / 0 |
| rendimento | 4/9 / 2535 | 0/9 / 0 |
| populacao | 9/9 / 21944 | 0/9 / 0 |
| moeda | 1/9 / 13 | 0/9 / 0 |
| consolidado | 0/9 / 0 | 0/9 / 0 |
| estado | 4/9 / 63 | 0/9 / 0 |
| contas | 6/9 / 6203 | 0/9 / 0 |

- Sobrevivência sem intervenção, antes: g1: 9, g2: 9, g4: 6, g8: 2, g12: 1, g25: 0, g50: 0, g100: 0
- Sobrevivência sem intervenção, depois: g1: 9, g2: 9, g4: 6, g8: 3, g12: 2, g25: 0, g50: 0, g100: 0
- CPU da rodada: antes 220 s, depois 267 s
- Primeira geração diferente: a 1ª, nas 9


**Como ler.** A primeira geração já é diferente em todas as dinastias: o crescimento muda desde o primeiro ano, e a vida segue outro caminho. Por isso a comparação é das distribuições (medianas, mínimos e máximos), não vida a vida.

**O que melhorou, além de números menores** (o pedido: "não considere uma redução de números, por si só, uma melhoria"):

- **O país tem tamanho de país.** O PIB per capita fica entre 2,5 e 12 vezes o de 2026 na mediana das gerações (o máximo, 17 vezes), em vez de 10³¹ vezes; o PIB, entre R$ 27 e R$ 120 trilhões.
- **O salário voltou a dizer alguma coisa.** A renda aos 40 de quem vive de salário ficou entre 0,4 e 1,7 vezes a renda média do país nas gerações em que a bancada teve assalariados (antes: 0,04 na 2ª geração e 10⁻⁹ na 25ª).
- **O país continua um país.** A população para entre 100 e 120 milhões, em vez de sumir (antes: 7.515 pessoas na 100ª geração).
- **O dinheiro existe em todas as gerações.** O resíduo do dinheiro do mundo ficou em centavos (no máximo R$ 0,11; antes, R$ 466 na 12ª geração e 10³² na 100ª), e o dinheiro do mercado nunca ficou negativo.
- **A holding aplica e rende, dentro do mercado.** O maior rendimento da holding numa vida foi de R$ 36 trilhões (12 gerações; antes, R$ 1,3 quatrilhão), e nenhum ano rendeu mais que o mercado comporta (antes, em 9 de 27 dinastias).
- **Nenhum número passa de 2^53.** O maior número em reais de toda a bancada foi 1,4 × 10¹⁴, 60 vezes abaixo do limite (antes, 4 × 10⁶¹).
- **A inflação não sobe nas gerações tardias** (A-06 da etapa 01): a média de cada vida ficou entre 4,4% e 5,7% em todas as gerações.

**O que não mudou e pode piorar a experiência** (para medir com o dono):

- **O crescimento médio de uma vida fica perto de zero depois de 2300** (a mediana entre −0,2% e +0,5%). A fronteira quase parou e a população também; o que sobra é o ciclo e as políticas. É o que o modelo diz de um mundo que parou de crescer; se cansar quem joga dinastias longas, a saída é conteúdo (o que fazer num país parado), não um crescimento inventado.
- **A impressora acende menos a inflação**: com a política da moeda na impressora, a inflação de 8 anos sobe +2,4 pontos na média de 10 sementes (de +1,4 a +3,4), contra +3,1 antes da etapa. A causa não foi isolada; o efeito continua em todas as sementes, e o teste passou a medir a média de três vidas.
- **A inflação de um ano pode chegar a 22%** nas gerações tardias (antes, 18%), nos países com a impressora ligada (o Regime): a média continua no lugar.
- **A maior fortuna chega perto de 1 PIB** num ano (12 gerações), pelo teto do mercado de um dono (seção 7).
- **A sobrevivência natural das dinastias quase não mudou** (sem a intervenção, 3 de 27 chegam à 12ª geração; antes, 1): a herança depende de ter filhos, não da economia.

## 5. A compatibilidade dos saves

Nenhuma versão nova de esquema. O campo novo (`pais.renda_potencial`) nasce na primeira leitura (`iniciarNumeros`, chamado na carga do save e no ano do país), como o PIB nasceu no bloco A. O save antigo:

- do país que seguiu o caminho comum ganha a renda potencial do ano dele;
- do país que cresceu demais (as dinastias longas de antes) fica com o PIB que tem; a renda dele vira a potencial, e o país para de compor;
- não perde nenhum campo, nenhum real e nenhuma pessoa.

A diferença que quem joga um save antigo vai sentir é o ritmo: o país que estava a 10³⁰ reais para de crescer 2% ao ano e passa a andar com a fronteira. O teste `test/longo-prazo.test.ts › o save de um país que já tinha crescido demais` confere.

## 6. Os testes

- **Antes**: 582 testes.
- **Depois**: 598 testes, todos passando. Os novos estão em `test/longo-prazo.test.ts`: a fronteira, a tendência de 2026, a convergência e o teto de 6%, mil anos de caminho comum, a população que volta a crescer, o save antigo, o índice dos salários, o mercado dividido entre a carteira e a holding, o rendimento da holding com o teto e o Tesouro de contraparte, a inflação do caixa parado, as contas do país na herança, o id livre, a economia aquecida pelo hiato, o teto dos bens, as classes pequenas e o excedente parado.
- **Testes que mudaram de expectativa** (o comportamento mudou de propósito, e o teste mede o novo, explicitamente): o salário de entrada da carreira e o do vereador (vezes o índice), a dotação da Casa Real, a população do ano (com a população de antes), o caixa da holding depois do dividendo (com a inflação do caixa parado), a fase do país (com o potencial do ano), o preço de venda na crise (com o momento do estado). O teste da sanção depois do rompimento passou de 20 para 80 sementes: a taxa é a mesma de antes (26,5% e 25,5% em 200 sementes), mas as primeiras sementes dão menos por acaso.
- `npm run validar`: sem erro e sem aviso. `npm run auditoria`: 160 dinastias de 4 gerações, nenhum problema, resto máximo de R$ 0,03. `npm run dinastias:ci` (no `verificar` e no CI): nenhum invariante quebrado.
- Túnel de vento (`npm run tunel`, 10.000 vidas, dentro do `verificar`): passou. Nenhuma história morta, as contas e as dívidas fechando em toda entrada, nenhuma estratégia vencendo em tudo. Comparado com a rodada oficial de antes da etapa:

| Medida | Antes | Depois |
|---|---|---|
| Saturação V5 / V20 | 52,4% / 86,6% | 53,6% / 86,8% |
| Assinaturas de vida por 1.000 vidas (sem a origem) | 904 (567) | 905 (574) |
| Mobilidade (Spearman da origem ao fim) | 0,37 | 0,33 |
| Toques por vida | 483,7 | 485,2 |
| CPU por vida (não é A/B: rodadas em dias diferentes) | 184 ms | 182 ms |
| O maior save | 1.287 KB | 1.179 KB |
| Fases de uma vida (normal / aquecida / recessão / crise) | 64% / 23% / 10% / 2% | 50% / 27% / 18% / 5% |
| Demissões por vida / vindas de uma recessão ou crise | 0,54 / 31% | 0,53 / 47% |
| Bilionário feito (de quem nasce sem fortuna) | 0,33% | 0,27% |
| O PIB recorde (a história) | 6,9% das vidas | 2,3% |
| A dupla do valor: pedidos aprovados / negados; o caixa aplicado rendeu | 9 / 66; −R$ 26 bilhões | 20 / 182; R$ 65 bilhões |

Os portões que falham são os mesmos que já falhavam antes (o maior save, a CPU, os toques, a herança entre gerações, as assinaturas sem regressão, o voto e as centenas de subsidiárias); dois que falhavam passaram (a coroa que passa e o quintil mais rico ao mais pobre). O portão das fases mudou, com o porquê (seção 3.7).

## 7. As limitações que ficam

- **A fronteira que desacelera é uma hipótese**, não um fato: ninguém sabe se a produtividade do mundo para. Ela está num lugar só (`regras.ts › LONGO_PRAZO`) e pode ser trocada.
- **Os preços do conteúdo não acompanham o país.** Com o país limitado, tudo bem; se um dia a fronteira voltar a crescer sem fim, eles precisam de índice.
- **O conteúdo do fim do jogo continua faltando** (A-04 da etapa 01): nenhuma história acima de R$ 1 trilhão.
- **O teto do mercado de um dono é generoso** (43% do PIB, os R$ 5 trilhões de antes da etapa). Com o excedente perdendo a inflação, a fortuna de uma família paciente se equilibra perto de 1 PIB (a bancada viu 1,0 PIB num ano). As maiores fortunas da história ficaram perto de 2% a 6% do PIB do país delas. Baixar o teto para uns 10% do PIB deixaria o equilíbrio perto de 0,2 PIB, mas muda o jogo de quem é trilionário: é a decisão I-193, do dono.
- **As dinastias acumulam imóveis** (mais de 26 herdados num ano só, depois de dezenas de gerações). O defeito do id está corrigido; a lista crescendo é um custo de save a medir.
- **A bancada mede robôs, não pessoas**: a rede neural que aprende com jogadores extremos precisaria de dados de jogadores, e o jogo não tem backend (regra do dono). O que dá para fazer é um explorador da bancada.
- **A sobrevivência natural das dinastias é baixa** (a família sem filhos acaba): a bancada continua por um sobrinho, o jogo não.

## 8. Os riscos

- **O ritmo do país mudou para todo mundo**, não só para as dinastias longas: o crescimento médio da primeira vida caiu de uns 1,7% para uns 1,3% ao ano (a população encolhe a partir de 2046, e a fronteira desacelera devagar). As recessões quase dobraram (de 10% para 18% dos anos), mais perto do Brasil real. O túnel mede o efeito na experiência (seção 6).
- **O salário de entrada sobe com o país**: na segunda metade do século, um emprego paga uns 30% a 60% mais em reais de hoje do que pagava, e os preços do conteúdo ficam iguais; a vida fica um pouco mais folgada.
- **O caixa das empresas perde a inflação**: a empresa que acumulava caixa sem usar ficou mais fraca; a diretoria com carta branca guarda de 3 meses a 1 ano de custos, e perde uns 4,5% disso por ano.

## 9. A próxima ordem recomendada

1. **O dono joga** uma dinastia de três ou quatro gerações e diz se o país parado cansa (seção 4).
2. **O conteúdo do fim do jogo** (A-04): histórias para quem passou de R$ 1 trilhão, que com o país limitado é uma fortuna de verdade.
3. **O explorador da bancada** (a etapa da rede neural): robôs que procuram o que quebra (a vida que mais enriquece, o país que mais cai, a história que nunca aparece), com a bancada como juiz. Sem backend, sem dados de jogadores.
4. **O teto do mercado de um dono** (I-193): decidir se fica em 43% do PIB ou desce para uns 10%.
5. **Os imóveis das dinastias** (I-191 a): a lista cresce sem fim; o valor já tem teto.
