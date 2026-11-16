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
- **O que antes mudava o ritmo agora muda o nível.** As políticas, a escola, a tecnologia, a dívida e a violência continuam somando ao potencial de cada ano; a convergência transforma um ponto a mais por ano em uns 65% a mais de renda no longo prazo (`e^(1/2)`). Entre o melhor e o pior país possível, umas 20 vezes, perto do que existe entre países de verdade.
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

A saída foi limitar os números pelo modelo e conferir o limite: com o país limitado, o maior número em reais da bancada de 100 gerações ficou em 5,7 × 10¹³, 160 vezes abaixo de 2^53; o invariante do motor trava o contrário. As folgas de cada entrada do livro (meio real mais 10⁻⁹ do maior valor da entrada) ficaram: não acumulam no tempo, e os valores de uma entrada agora são limitados.

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

## 4. Os resultados comparados (mesmas sementes e condições)

RESULTADOS_DA_BANCADA

**Como ler.** A primeira geração já é diferente em todas as dinastias: o crescimento muda desde o primeiro ano, e a vida segue outro caminho. Por isso a comparação é das distribuições (medianas, mínimos e máximos), não vida a vida.

**O que melhorou, além de números menores** (o pedido: "não considere uma redução de números, por si só, uma melhoria"):

- **O salário voltou a dizer alguma coisa.** A renda aos 40 de quem vive de salário ficou entre 0,4 e 1,7 vezes a renda média do país em todas as gerações (antes: de 0,04 na 2ª geração a 10⁻⁹ na 25ª).
- **O país continua um país.** A população para perto de 105 milhões, em vez de sumir.
- **O dinheiro existe em todas as gerações.** O resíduo do dinheiro do mundo ficou em centavos (antes: R$ 466 na 12ª geração e 10³² na 100ª).
- **A holding aplica e rende, dentro do mercado.** O maior rendimento da holding numa vida foi de R$ 1,8 trilhão (12 gerações; antes, R$ 1,3 quatrilhão); o caixa das holdings ficou abaixo de 17% do PIB.

**O que não mudou e pode piorar a experiência** (para medir com o dono):

- **O crescimento médio de uma vida fica perto de zero depois de 2300.** A fronteira quase parou e a população também; o que sobra é o ciclo e as políticas. Algumas vidas inteiras têm média de −2% a −3% quando as políticas pioram muito (o regime, a dívida), e outras de +2% a +3% na volta. É o que o modelo diz de um mundo que parou de crescer; se cansar quem joga dinastias longas, a saída é conteúdo (o que fazer num país parado), não um crescimento inventado.
- **A sobrevivência natural das dinastias não mudou de forma** (sem a intervenção, 1 de 27 chega à 12ª geração): a herança depende de ter filhos, não da economia.

## 5. A compatibilidade dos saves

Nenhuma versão nova de esquema. O campo novo (`pais.renda_potencial`) nasce na primeira leitura (`iniciarNumeros`, chamado na carga do save e no ano do país), como o PIB nasceu no bloco A. O save antigo:

- do país que seguiu o caminho comum ganha a renda potencial do ano dele;
- do país que cresceu demais (as dinastias longas de antes) fica com o PIB que tem; a renda dele vira a potencial, e o país para de compor;
- não perde nenhum campo, nenhum real e nenhuma pessoa.

A diferença que quem joga um save antigo vai sentir é o ritmo: o país que estava a 10³⁰ reais para de crescer 2% ao ano e passa a andar com a fronteira. O teste `test/longo-prazo.test.ts › o save de um país que já tinha crescido demais` confere.

## 6. Os testes

- **Antes**: 582 testes.
- **Depois**: 594 testes, todos passando. Os doze novos estão em `test/longo-prazo.test.ts`: a fronteira, a tendência de 2026, a convergência e o teto de 6%, mil anos de caminho comum, a população que volta a crescer, o save antigo, o índice dos salários, o mercado dividido entre a carteira e a holding, o rendimento da holding com o teto e o Tesouro de contraparte, a inflação do caixa parado, as contas do país na herança e o id livre.
- **Testes que mudaram de expectativa** (o comportamento mudou de propósito, e o teste mede o novo, explicitamente): o salário de entrada da carreira e o do vereador (vezes o índice), a dotação da Casa Real, a população do ano (com a população de antes), o caixa da holding depois do dividendo (com a inflação do caixa parado).
- `npm run validar`: sem erro e sem aviso. `npm run auditoria`: 160 dinastias de 4 gerações, nenhum problema, resto máximo de R$ 0,03.
- Túnel de vento: TUNEL_DA_ETAPA

## 7. As limitações que ficam

- **A fronteira que desacelera é uma hipótese**, não um fato: ninguém sabe se a produtividade do mundo para. Ela está num lugar só (`regras.ts › LONGO_PRAZO`) e pode ser trocada.
- **Os preços do conteúdo não acompanham o país.** Com o país limitado, tudo bem; se um dia a fronteira voltar a crescer sem fim, eles precisam de índice.
- **O conteúdo do fim do jogo continua faltando** (A-04 da etapa 01): nenhuma história acima de R$ 1 trilhão. A maior fortuna da bancada ficou em 38% do PIB (uns R$ 10 trilhões).
- **As dinastias acumulam imóveis** (mais de 26 herdados num ano só, depois de dezenas de gerações). O defeito do id está corrigido; a lista crescendo é um custo de save a medir.
- **A bancada mede robôs, não pessoas**: a rede neural que aprende com jogadores extremos precisaria de dados de jogadores, e o jogo não tem backend (regra do dono). O que dá para fazer é um explorador da bancada.
- **A sobrevivência natural das dinastias é baixa** (a família sem filhos acaba): a bancada continua por um sobrinho, o jogo não.

## 8. Os riscos

- **O ritmo do país mudou para todo mundo**, não só para as dinastias longas: o crescimento médio da primeira vida caiu de uns 1,8% para uns 0,9% ao ano (a convergência começa no primeiro ano e a fronteira desacelera). Isso pesa nas fases do ciclo, no desemprego e nas histórias de crise. O túnel mede o efeito na experiência (seção 6).
- **O salário de entrada sobe com o país**: na segunda metade do século, um emprego paga uns 30% a 60% mais em reais de hoje do que pagava, e os preços do conteúdo ficam iguais; a vida fica um pouco mais folgada.
- **O caixa das empresas perde a inflação**: a empresa que acumulava caixa sem usar ficou mais fraca; a diretoria com carta branca guarda de 3 meses a 1 ano de custos, e perde uns 4,5% disso por ano.

## 9. A próxima ordem recomendada

1. **O dono joga** uma dinastia de três ou quatro gerações e diz se o país parado cansa (seção 4).
2. **O conteúdo do fim do jogo** (A-04): histórias para quem passou de R$ 1 trilhão, que com o país limitado é uma fortuna de verdade.
3. **O explorador da bancada** (a etapa da rede neural): robôs que procuram o que quebra (a vida que mais enriquece, o país que mais cai, a história que nunca aparece), com a bancada como juiz. Sem backend, sem dados de jogadores.
4. **Os imóveis das dinastias** (I-191 a).
