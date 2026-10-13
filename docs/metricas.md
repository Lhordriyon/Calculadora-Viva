# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 557 eventos, 84 de personagens, 93 ações, 1498 escolhas, 235 linhas, 124 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3828722 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4365879 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 85 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 524 mil |
| Custo de vida | o mercado | 99,9% | -R$ 638 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 17 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 5,7 milhões |
| Bico | o mercado | 99,3% | R$ 45 mil |
| Salário | o mercado | 97,8% | R$ 4,1 milhões |
| Juro da renda fixa | o governo | 95,3% | R$ 209 mil |
| Cotação dos investimentos | os preços | 92,2% | R$ 1,2 milhão |
| Imposto | o governo | 85,2% | -R$ 68 mil |
| Imposto mais baixo | o governo | 82,2% | R$ 64 mil |
| Juros da dívida | o banco | 81,3% | -R$ 3 mil |
| Auxílio | o governo | 81,1% | R$ 16 mil |
| Compras e vendas | o mercado | 74,0% | -R$ 1,4 milhão |
| Manutenção dos bens | o mercado | 74,0% | -R$ 503 mil |
| Gastos da velhice | o mercado | 61,2% | -R$ 1,7 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 3,4% | 3,0 | 4,1% | 1,4% | 0,0% | 1,8% |
| cautelosa | 0,0% | 2,0% | 0,0 | 2,0% | 0,0% | 0,0% | 0,0% |
| arriscada | 93,8% | 24,2% | 1,0 | 13,4% | 2,2% | 18,3% | 17,0% |
| aleatoria | 48,0% | 17,0% | 1,0 | 11,4% | 1,6% | 11,3% | 11,5% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 11,7% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,85 anos com acordo (688 vezes) × 2,67 sem (408 vezes; p90 4) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 20,9% de 3544 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,3% das vidas; 11,3% das sujas |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 57,9% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 906 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,40 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 450,5 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 9,5% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,8% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 4,1% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,32 |
| Saturação V20 ≤ 95% | ✅ | 90,6% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 906 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 43,74 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,0% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 55,4% (168 dinastias, média de 2,9 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,85 (326 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 272 mil / R$ 375 mil / R$ 719 mil; p10 R$ 224 mil / R$ 184 mil / R$ 136 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 10,58% (p99 R$ 1,9 bilhão, maior R$ 207 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,63% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 30,4% de 57,2% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 18,9% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 90,6% |
| Assinaturas sem regressão (≥ 918) | ❌ | 906 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 450,5 |
| CPU por vida ≤ 30 ms | ❌ | 43,74 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 97,9% (9,3 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 75,6% de 3518 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (701), A festa do século (575), Pix para a cidade inteira (350), Uma estátua sua (280), Um conselho que diz não (196), Uma fundação com seu nome (174), Bancar um presidente (174), Uma equipe para desmontar (147), Trazer a Copa do Mundo (127), Bancar quem quer sair (123), Pagar a cura de uma doença (117), Tornar-se dispensável (116), Um mural de problemas (115), Um programa espacial (108), Fundar uma cidade (68), Comprar a estatal (62), Fundar um país (35), Salvar o país da crise (27), Uma colônia em Marte (23).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 3 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 40,1% de 1877 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 20,9% delegaram, 57,6% centralizaram (818 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 30,1% (22,9 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (677), Bancar quem quer sair (403), Uma equipe para desmontar (347), Um mural de problemas (335), Tornar-se dispensável (278).
- **Na morte de quem manda:** a empresa perde em média 26,1% do valor; dependência p10 / mediana / p90: 33 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 7, maior 17 anos (7360 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 974 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 53,1% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 63,2% / 24,8% / 9,8% / 2,2% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,0 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,8%, o bloco liberal 24,4%, a aliança da ordem 24,6%, o centrão 24,1%; 8,4 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (20,9% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,76% × 1,83%); ✓ dívida menor com a aliança da ordem que com o centrão (69% × 83% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,42% contra 0,71% por ano (36361 e 53273 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,66 votos por vida, 31,4% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 3,59 × 0,61 pontos do PIB por ano (90 e 241 governos); 93,8% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 3,9% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 206.425 | 1,8% | 8,1% | 5,2% | 80% | 20,9% | 20,4 | 57 | 55 | 51% |
| a aliança da ordem | 189.516 | 1,8% | 8,3% | 5,8% | 69% | 29,4% | 17,6 | 50 | 45 | 52% |
| o bloco liberal | 188.175 | 2,8% | 8,5% | 4,6% | 80% | 29,5% | 22,1 | 43 | 50 | 51% |
| o centrão | 185.789 | 2,1% | 8,3% | 5,1% | 83% | 25,1% | 21,4 | 50 | 50 | 55% |
| o regime | 8.401 | 0,9% | 9,5% | 5,3% | 22% | 32,1% | 17,3 | 35 | 37 | 44% |
| quem joga | 8.194 | 2,4% | 7,8% | 5,5% | 78% | 24,8% | 19,7 | 56 | 54 | 56% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,8% de 6679 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,8% fundiram, 5,9% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 2532 (p99 280) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,34 ponto em média (27126 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,33 na bolsa (7276 empresas-ano) × -0,00 fechadas (98488) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,6% de 37140 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,10 · mediana R$ 5,06 · p90 R$ 6,30 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,35 no agro (4437 empresas-ano) × -0,32 no comércio (32876), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 25,1%, acordo em 72,1%; 98,6% das sanções acabam em até 15 anos (mediana 3, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,5% de 3442 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,20% × 0,10% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,72% × 0,31% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 71,5% de 368 governos; sanção depois de romper 34,8%, depois da visita 0,8% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 206.425 | 0,18% | 2,30% |
| a aliança da ordem | 189.516 | 1,21% | 0,31% |
| o bloco liberal | 188.175 | 0,19% | 3,72% |
| o centrão | 185.789 | 0,11% | 0,52% |
| o regime | 8.401 | 2,38% | 0,00% |
| quem joga | 8.194 | 0,21% | 7,51% |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 57,9% / 90,6% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 65,7% |
| Efeito da memória (aleatória, V5 sem → com memória) | 63,8% → 53,7% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 906 (580) |
| Mobilidade: mesmo quintil da origem ao fim | 26,6% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,32 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,8% / 4,1% |
| Patrimônio p90/p10 | 701,2× (p10 R$ 297 mil, p90 R$ 208 milhões) |
| Desvio-padrão da felicidade média da vida | 8,40 |
| Vidas com patrimônio negativo ao morrer | 0,6% |
| Mudanças de estado causadas pelo jogador | 44,8% |
| Toques por vida | 450,5 |
| Tempo de CPU por vida | 43,74 ms |
| Ações (fichas usadas) por vida | 159,4 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 9,5% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,4 |
| Vidas que terminam com filho ou filha para continuar | 84,0% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 2,9 / 55,4% / 20,2% |
| Idade de quem herda ao começar (mediana) / herança mediana | 37 anos / R$ 15 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,85 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 57,2% |
| Entre quem abriu: quebrou / vendeu | 30,4% / 26,6% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,2 milhões / R$ 109 milhões / R$ 1,9 bilhão / R$ 207 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,26% / 10,58% / 1,63% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 18,9% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 57,9 / 159,4 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 224 mil | R$ 272 mil | R$ 330 mil |
| moderado | R$ 184 mil | R$ 375 mil | R$ 674 mil |
| arrojado | R$ 136 mil | R$ 719 mil | R$ 2,8 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 844 | R$ 150 mil | R$ 1,4 milhão | R$ 57 milhões |
| moderado | 947 | R$ 181 mil | R$ 1,7 milhão | R$ 30 milhões |
| arrojado | 709 | R$ 137 mil | R$ 2,4 milhões | R$ 36 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 68,5 | R$ 2,3 milhões | 75,1 |
| pobre | 104 | 69,2 | R$ 1,3 milhão | 74,1 |
| remediada | 24 | 70,3 | R$ 4,5 milhões | 76,6 |
| media | 64 | 71,7 | R$ 4,1 milhões | 73,9 |
| rica | 64 | 70,7 | R$ 5,6 milhões | 74,9 |
| muito rica | 144 | 70,6 | R$ 26 milhões | 76,5 |
| bilionaria | 356 | 71,4 | R$ 2,6 bilhões | 76,3 |
| trilionaria | 276 | 70,8 | R$ 1 trilhão | 76,8 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 41,0 |
| Demissões por vida / vindas de uma recessão ou crise | 0,51 / 31,0% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 28 |
| Setor do último trabalho | serviço público 46% · serviços 14% · saúde 13% · cultura e internet 9% · comércio 4% · transporte e entregas 4% · agro 3% · construção 2% · tecnologia 2% · indústria 1% · sem setor 1% · finanças 1% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 23% | 36% | 48% | 58% | 79% | 87% | 91% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 30% | 22% | 17% | 16% | 15% |
| Q2 | 29% | 22% | 17% | 15% | 16% |
| Q3 | 23% | 24% | 20% | 18% | 15% |
| Q4 | 13% | 24% | 26% | 21% | 16% |
| Q5 | 4% | 8% | 19% | 30% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 71,0 | R$ 1,7 milhão | 73,6 |
| família pobre | 24% | 71,0 | R$ 1,8 milhão | 73,9 |
| família remediada | 20% | 71,8 | R$ 2,3 milhões | 74,0 |
| classe média | 18% | 71,2 | R$ 3 milhões | 73,6 |
| família rica | 13% | 71,2 | R$ 5,4 milhões | 73,6 |
| família muito rica | 13% | 71,0 | R$ 30 milhões | 74,7 |
| família bilionária | 3% | 68,8 | R$ 1,6 bilhão | 75,9 |

## Repetição

- **Dentro de uma vida:** 7,7% das aparições repetem uma instância já vista na mesma vida; pior vida: 27,0%.
- **Texto repetido entre vidas:** 33,6% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,0 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,4 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`, `mutirao_de_cirurgias`, `escola_publica_boa`, `imposto_alto_no_contracheque`, `blitz_toda_noite`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 129 de 612 storylets — `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `duas_empresas_uma_agenda`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `o_conselho_vetou`, `presidente_pediu_as_contas`, `ferias_do_dono`, `tudo_pela_sua_mesa`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `mutirao_de_cirurgias`, `imposto_alto_no_contracheque`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `carro_de_presente`, `estagio_do_pai`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `clientes_em_panico`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `fundacao`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `vista_da_cobertura`, `mansao_vazia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 57,9 · **com causa anterior (cadeia):** 72,0 · **maior distância causa→consequência:** 47,8 anos em média
- **Vidas com 3 pontos de virada no cartão:** 100,0%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,0% |
| `luto` | npc | 97,5% |
| `enem` | evento | 94,2% |
| `primeiro_voto` | evento | 83,9% |
| `trabalho_grande` | acao | 74,6% |
| `bico_adulto` | acao | 69,7% |
| `visitar_familia` | acao | 68,7% |
| `cuidar_da_doenca` | npc | 64,1% |
| `correr_no_quintal` | acao | 60,9% |
| `aposentadoria` | evento | 60,6% |
| `eleicao_geral` | evento | 60,1% |
| `ler_gibi` | acao | 58,7% |
| `formatura` | evento | 57,4% |
| `parquinho` | acao | 57,1% |
| `almoco_domingo` | acao | 55,3% |
| `ligar_amigo` | acao | 52,3% |
| `avo_mesada_escondida` | npc | 50,3% |
| `curso_online` | acao | 49,7% |
| `mochilao` | acao | 49,7% |
| `tocar_empresa` | acao | 49,7% |
| `viagem_la_para_fora` | evento | 48,7% |
| `correr` | acao | 47,5% |
| `pos_graduacao` | acao | 47,0% |
| `estudar_enem` | acao | 46,8% |
| `estudar_concurso` | acao | 44,7% |
| `baile_terceira_idade` | acao | 43,7% |
| `paquerar` | acao | 42,3% |
| `doente_crianca` | npc | 42,0% |
| `primeiro_emprego` | evento | 41,1% |
| `primeiro_investimento` | evento | 39,5% |
| `perdeu_emprego_na_crise` | npc | 39,3% |
| `demissao` | evento | 39,2% |
| `academia` | acao | 39,0% |
| `cuidar_de_doente` | acao | 38,8% |
| `estudar_escola` | acao | 38,2% |
| `ler_livros` | acao | 38,2% |
| `balde_da_pracinha` | evento | 37,0% |
| `amigo_em_apuros` | npc | 36,4% |
| `ouvir_historia` | acao | 35,7% |
| `pre_escola` | evento | 35,3% |
| `salario_em_dolar` | evento | 35,0% |
| `copa_do_mundo` | evento | 34,4% |
| `primeiro_beijo` | evento | 33,8% |
| `acidente_em_casa` | evento | 33,6% |
| `casamento` | npc | 33,3% |
| `rabiscar_parede` | acao | 32,8% |
| `viagem_dos_sonhos` | evento | 32,4% |
| `perguntar_porque` | acao | 31,8% |
| `creche_ou_vo` | evento | 31,8% |
| `caminhada` | acao | 31,7% |
| `videogame_do_amigo` | acao | 31,3% |
| `festa_80` | evento | 31,1% |
| `colesterol_alto` | evento | 29,8% |
| `banda_garagem` | evento | 29,6% |
| `bullying_recreio` | evento | 29,5% |
| `estudar_tabuada` | acao | 29,4% |
| `filho` | npc | 29,1% |
| `natacao_no_clube` | acao | 28,4% |
| `vape_festa` | evento | 28,3% |
| `investir_tesouro` | acao | 28,3% |
| `historias_ou_telas` | evento | 28,3% |
| `estudar_faculdade` | acao | 28,2% |
| `hidro_com_a_turma` | acao | 28,2% |
| `ajudar_em_casa` | acao | 28,1% |
| `carro` | evento | 28,0% |
| `amigo_pede_dinheiro` | evento | 28,0% |
| `oportunidade_de_negocio` | evento | 27,7% |
| `golpe_pix` | evento | 27,7% |
| `previdencia` | acao | 27,5% |
| `bilhete_carinhoso` | npc | 27,5% |
| `filho_adolescente` | evento | 27,2% |
| `bet` | evento | 26,8% |
| `doar_sangue` | evento | 26,7% |
| `pelada_de_quinta` | evento | 26,6% |
| `piada_no_grupo` | npc | 26,6% |
| `cachorro_caramelo` | evento | 26,4% |
| `primeiro_celular` | evento | 26,4% |
| `pelada` | acao | 26,3% |
| `amigo_devolve` | npc | 26,3% |
| `curso_nota_alta` | evento | 26,2% |
| `check_up` | acao | 26,2% |
| `vacina_no_posto` | evento | 26,0% |
| `viagem_realizada` | evento | 26,0% |
| `crise_la_fora` | evento | 25,7% |
| `investimento_furado` | evento | 25,5% |
| `largar_tudo` | evento | 25,1% |
| `festa_tema` | evento | 25,0% |
| `perdeu_aniversario` | npc | 24,8% |
| `criptomoeda` | evento | 24,8% |
| `guardar_dinheiro` | acao | 24,6% |
| `voltar_a_estudar` | acao | 24,4% |
| `show_no_estadio` | acao | 24,4% |
| `proposta_na_expansao` | evento | 24,4% |
| `rebalancear` | acao | 24,3% |
| `tempo_com_amor` | acao | 23,6% |
| `festa_junina` | evento | 23,4% |
| `esporte_depois_da_aula` | evento | 23,1% |
| `bico_adolescente` | acao | 23,0% |
| `reforma_da_casa` | evento | 23,0% |
| `tatuagem` | evento | 22,9% |
| `sair_de_casa` | evento | 22,2% |
| `pensar_em_adotar` | evento | 22,1% |
| `vaquinha_do_vizinho` | evento | 22,1% |
| `emprego_saude` | evento | 22,0% |
| `bolao_do_trabalho` | evento | 21,9% |
| `casa_dos_pais` | evento | 21,9% |
| `juros_compostos` | evento | 21,7% |
| `festa_da_cidade` | acao | 21,4% |
| `cursinho_pago` | acao | 21,3% |
| `avo_conta_historias` | npc | 21,2% |
| `encontro` | acao | 20,9% |
| `hora_extra` | acao | 20,8% |
| `pede_ajuda` | npc | 20,7% |
| `vizinho_barulhento` | evento | 20,5% |
| `subir_de_padrao` | evento | 20,5% |
| `cozinhar_com_a_avo` | acao | 20,5% |
| `hobby_horta` | evento | 20,5% |
| `cortar_gastos` | acao | 20,3% |
| `futebol_de_varzea` | acao | 20,3% |
| `filho_formatura` | evento | 19,8% |
| `heranca_do_tio` | evento | 19,8% |
| `reencontro_da_turma` | evento | 19,7% |
| `primeira_palavra` | evento | 19,4% |
| `mesada` | evento | 19,4% |
| `bateu_o_carro` | evento | 19,3% |
| `feira_ciencias` | evento | 19,3% |
| `desempregado` | evento | 19,1% |
| `assalto_na_rua` | evento | 19,0% |
| `moeda_digital` | evento | 18,9% |
| `vender_doce` | acao | 18,7% |
| `franquia` | evento | 18,5% |
| `catapora` | evento | 18,2% |
| `festa_sem_pais` | evento | 18,1% |
| `pai_ausente_volta` | npc | 17,7% |
| `voltar_estudar` | evento | 17,6% |
| `bloco_de_carnaval` | evento | 17,1% |
| `fazenda_a_venda` | evento | 17,0% |
| `cirurgia_de_catarata` | evento | 16,9% |
| `festa_de_sao_joao` | evento | 16,8% |
| `cripto_fomo` | evento | 16,7% |
| `baile_da_terceira_idade` | evento | 16,7% |
| `entregas` | acao | 16,6% |
| `empresa_quebrou` | evento | 16,6% |
| `hidroginastica` | evento | 16,5% |
| `escrever_memorias` | evento | 16,5% |
| `casa_propria` | evento | 16,5% |
| `ceu_de_fumaca` | evento | 16,5% |
| `carteira_da_diarista` | evento | 16,4% |
| `mudar_para_a_praia` | evento | 16,3% |
| `fome_no_fim_do_mes` | evento | 16,2% |
| `golpe_do_falso_neto` | evento | 16,1% |
| `vaga_sobrando` | evento | 16,0% |
| `dolar_barato` | evento | 15,9% |
| `imposto_alto_no_contracheque` | evento | 15,9% |
| `reuniao_de_condominio` | evento | 15,8% |
| `leu_antes_dos_colegas` | evento | 15,8% |
| `imovel_valorizou` | evento | 15,5% |
| `convite_para_palestrar` | evento | 15,4% |
| `curso_nota_media` | evento | 15,4% |
| `alugueis_dos_fundos` | evento | 15,3% |
| `investimento_rotina` | evento | 15,1% |
| `corte_de_salario` | evento | 15,1% |
| `multa_e_batida` | evento | 15,0% |
| `ingles_crianca` | acao | 14,9% |
| `imposto_baixo_sobrou` | evento | 14,8% |
| `entregador_chuva` | evento | 14,8% |
| `bolsa_la_fora` | evento | 14,7% |
| `convite_do_luxo` | evento | 14,6% |
| `testamento` | evento | 14,4% |
| `reencontro_amigo` | evento | 14,3% |
| `alavancagem` | evento | 14,2% |
| `esporte_escola` | acao | 14,1% |
| `aula_de_musica` | evento | 14,1% |
| `casamento_na_igreja` | npc | 14,0% |
| `queda` | evento | 13,9% |
| `peneira` | evento | 13,9% |
| `promocao` | evento | 13,8% |
| `maratona` | evento | 13,8% |
| `juros_altos_rendendo` | evento | 13,8% |
| `parar_de_fumar` | acao | 13,5% |
| `sovina_ou_sabio` | evento | 13,4% |
| `brigas_de_madrugada` | evento | 13,3% |
| `quarto_dividido` | evento | 13,2% |
| `compra_por_impulso` | evento | 13,2% |
| `briga_em_casa` | npc | 13,0% |
| `cartao_credito` | evento | 12,9% |
| `concorrente_gigante` | evento | 12,7% |
| `rua_tranquila` | evento | 12,6% |
| `casa_na_praia` | evento | 12,5% |
| `bolsa_de_estudos` | evento | 12,5% |
| `greve_dos_onibus` | evento | 12,4% |
| `role` | acao | 12,3% |
| `pobreza_na_porta` | evento | 12,3% |
| `casa_cheia` | evento | 12,3% |
| `juros_baixos_euforia` | evento | 12,2% |
| `consorcio` | evento | 12,2% |
| `produto_viralizou` | evento | 12,0% |
| `feira_de_ciencias` | evento | 11,8% |
| `balcao_negocio` | acao | 11,8% |
| `separacao_dos_pais` | evento | 11,8% |
| `cofrinho` | acao | 11,5% |
| `apartamento_na_planta` | evento | 11,5% |
| `aniversario_da_infancia` | evento | 11,5% |
| `peito_chiando` | evento | 11,4% |
| `socio_sumiu` | evento | 11,4% |
| `separacao` | evento | 11,4% |
| `assalto_no_onibus` | evento | 11,3% |
| `praia` | acao | 11,3% |
| `chefe_novo` | evento | 11,2% |
| `recomecar_amor` | acao | 11,2% |
| `bolsa_subiu_sem_voce` | evento | 11,1% |
| `negocio_no_aperto` | evento | 11,1% |
| `retiro_da_igreja` | evento | 11,0% |
| `surpresa_do_amor` | npc | 11,0% |
| `fugir_inflacao` | acao | 10,9% |
| `padrao_de_vida` | evento | 10,8% |
| `investidor_anjo` | evento | 10,7% |
| `crise_40` | evento | 10,6% |
| `sao_joao` | acao | 10,5% |
| `gerente_do_banco` | evento | 10,4% |
| `seca_no_sertao` | evento | 10,4% |
| `cripto_disparou` | evento | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,3% |
| `ressaca_do_mar` | evento | 10,3% |
| `fundo_da_familia` | npc | 10,2% |
| `dolar_disparou` | evento | 10,2% |
| `titulo_eleitor` | evento | 10,1% |
| `edital_de_cultura` | evento | 10,1% |
| `cheia_do_rio` | evento | 9,8% |
| `aposentadoria_ativa` | evento | 9,8% |
| `inquilino_dos_sonhos` | evento | 9,8% |
| `olimpiada_matematica` | evento | 9,8% |
| `pousada_na_praia` | evento | 9,8% |
| `ponto_comercial` | evento | 9,7% |
| `festa_surpresa` | evento | 9,7% |
| `estatua` | jogada | 9,6% |
| `blitz_toda_noite` | evento | 9,6% |
| `inquilino_sumiu` | evento | 9,6% |
| `noite_de_stand_up` | evento | 9,5% |
| `atendimento_robo` | evento | 9,5% |
| `amor_proposta_fora` | npc | 9,3% |
| `comer_tudo` | acao | 9,3% |
| `tocar_no_bar` | acao | 9,3% |
| `chimarrao` | acao | 9,1% |
| `ouvido_para_musica` | evento | 9,1% |
| `festival_do_boi` | evento | 9,1% |
| `colo_da_avo` | acao | 9,1% |
| `conteudo_extra` | acao | 9,1% |
| `vicio_aposta` | evento | 9,0% |
| `dente_de_leite` | evento | 9,0% |
| `mudanca_de_escola` | evento | 9,0% |
| `brincar_com_o_pai` | acao | 8,9% |
| `brincar_na_rua` | acao | 8,9% |
| `cidadania_italiana` | evento | 8,8% |
| `festa_de_15` | evento | 8,7% |
| `mei_negocio` | evento | 8,6% |
| `pressao_alta` | evento | 8,6% |
| `apagao_no_morro` | evento | 8,5% |
| `geada_no_sul` | evento | 8,5% |
| `boi_bumba` | acao | 8,3% |
| `desemprego_em_alta` | evento | 8,3% |
| `filho_desenho` | npc | 8,3% |
| `family_office` | evento | 8,3% |
| `piramide_no_grupo` | npc | 8,3% |
| `herdeiro_gastao` | evento | 8,1% |
| `faculdade_vida` | evento | 8,0% |
| `passear_de_carrinho` | acao | 8,0% |
| `inflacao_no_mercado` | evento | 8,0% |
| `governo_que_voce_elegeu_frente_popular` | evento | 7,9% |
| `pular_corda` | acao | 7,8% |
| `amor_piada_interna` | npc | 7,8% |
| `brincar_amigos` | acao | 7,7% |
| `fiscalizacao` | evento | 7,7% |
| `assembleia_do_predio` | evento | 7,7% |
| `concurso_lotado` | evento | 7,7% |
| `auxilio_na_conta` | evento | 7,6% |
| `estatua_pichada` | evento | 7,6% |
| `figurinha_repetida` | acao | 7,6% |
| `enchente_na_rua` | evento | 7,5% |
| `geladeira_vazia` | evento | 7,4% |
| `doenca_de_quem_ama` | evento | 7,4% |
| `propina_da_empreiteira` | evento | 7,3% |
| `pescaria_no_pantanal` | evento | 7,3% |
| `soltar_pipa` | acao | 7,2% |
| `plantao_lotado` | evento | 7,2% |
| `show_no_bar` | evento | 7,0% |
| `cripto_de_novo` | acao | 7,0% |
| `chaves_do_apartamento` | evento | 7,0% |
| `adocao_chegou` | evento | 6,9% |
| `bolsa_derreteu` | evento | 6,9% |
| `festa_surpresa_para` | npc | 6,8% |
| `grupo_de_jovens` | evento | 6,8% |
| `vender_doce_nato` | acao | 6,7% |
| `bico_na_expansao` | evento | 6,7% |
| `mutirao_de_cirurgias` | evento | 6,6% |
| `merenda` | evento | 6,6% |
| `la_fora_comprando` | evento | 6,5% |
| `asma_na_educacao_fisica` | evento | 6,5% |
| `operacao_policial` | evento | 6,4% |
| `festival_lotado` | evento | 6,4% |
| `netos` | evento | 6,3% |
| `crise_de_ansiedade` | evento | 6,3% |
| `proposta_de_compra` | evento | 6,3% |
| `festa_do_seculo` | jogada | 6,2% |
| `imposto_sobre_fortunas` | evento | 6,2% |
| `blindar_contas` | acao | 6,1% |
| `briga_dos_pais` | evento | 6,1% |
| `tempo_com_filho` | acao | 6,1% |
| `moto_na_chuva` | evento | 6,1% |
| `burnout_empresa` | evento | 6,0% |
| `amigo_muda_de_cidade` | npc | 6,0% |
| `ano_de_prejuizo` | evento | 6,0% |
| `olimpiada` | acao | 6,0% |
| `festa_vazou` | evento | 6,0% |
| `convite_do_partido` | evento | 5,9% |
| `viralizou` | evento | 5,9% |
| `vereador` | evento | 5,9% |
| `fundacao_com_seu_nome` | evento | 5,9% |
| `escola_publica_boa` | evento | 5,8% |
| `paquerar_timido` | acao | 5,8% |
| `filho_imitacao` | npc | 5,7% |
| `mutirao_da_laje` | evento | 5,7% |
| `tarifa_do_app` | evento | 5,7% |
| `namorar_depois_dos_60` | evento | 5,7% |
| `escola_de_samba` | jogada | 5,6% |
| `promessa_da_mae` | evento | 5,6% |
| `vo_partiu` | npc | 5,6% |
| `greve_do_servidor` | evento | 5,5% |
| `pais_separados_natal` | evento | 5,5% |
| `obra_grande_no_norte` | evento | 5,5% |
| `natal_com_politica` | evento | 5,5% |
| `cachoeira` | acao | 5,4% |
| `vo_receita` | evento | 5,4% |
| `pais_na_crise` | npc | 5,3% |
| `nome_sujo` | evento | 5,3% |
| `primeiro_funcionario` | evento | 5,3% |
| `processo_trabalhista` | evento | 5,3% |
| `luto_do_bicho` | npc | 5,2% |
| `comecar_terapia` | evento | 5,2% |
| `cobranca_de_notas` | npc | 5,2% |
| `mae_quer_morar_junto` | npc | 5,2% |
| `cripto_derreteu` | evento | 5,2% |
| `fiador` | npc | 4,9% |
| `briga_na_cozinha` | evento | 4,9% |
| `joelho_da_pelada` | evento | 4,9% |
| `agro_na_cidade` | evento | 4,8% |
| `votacao_polemica` | evento | 4,8% |
| `compativel_para_medula` | evento | 4,6% |
| `clinica_particular_contrata` | evento | 4,6% |
| `aprovado_concurso_estudo` | evento | 4,6% |
| `tosse_cronica` | evento | 4,5% |
| `crescer_devagar` | evento | 4,5% |
| `intercambio_pago` | evento | 4,5% |
| `saudade_de_la` | evento | 4,4% |
| `curso_nota_baixa` | evento | 4,4% |
| `acordo_abriu_mercado` | evento | 4,4% |
| `trabalho_do_pai` | acao | 4,3% |
| `funcionario_genial` | evento | 4,3% |
| `sociedade_amigo` | evento | 4,3% |
| `emprestimo_ao_irmao` | evento | 4,3% |
| `bater_o_pe_com_o_chefe` | evento | 4,3% |
| `alguem_especial` | evento | 4,3% |
| `assumir_negocio` | evento | 4,2% |
| `depois_do_cargo` | evento | 4,1% |
| `balcao_da_familia` | evento | 4,0% |
| `heranca` | evento | 4,0% |
| `posto_que_funciona` | evento | 4,0% |
| `convite_para_candidatura` | evento | 4,0% |
| `amor_quer_mudar_de_carreira` | npc | 4,0% |
| `cursinho_comunitario` | evento | 4,0% |
| `convite_igreja` | npc | 3,9% |
| `pescaria_no_rio` | evento | 3,9% |
| `proposta_sao_paulo` | evento | 3,9% |
| `confeitaria_da_vo` | evento | 3,8% |
| `tentar_outra_cidade` | evento | 3,7% |
| `amigo_sumiu_e_voltou` | npc | 3,7% |
| `balcao_de_crianca` | evento | 3,7% |
| `casamento_do_filho` | evento | 3,7% |
| `conselho_que_diz_nao` | jogada | 3,6% |
| `dolar_virou_salario` | evento | 3,6% |
| `prova_concurso` | evento | 3,6% |
| `carregar_a_geladeira` | evento | 3,6% |
| `obra_ou_hospital` | evento | 3,6% |
| `enchente_na_cidade` | evento | 3,6% |
| `apresentacao_para_a_diretoria` | evento | 3,5% |
| `volta_terra` | evento | 3,5% |
| `este_e_o_ano` | evento | 3,5% |
| `aposentadoria_nao_da` | npc | 3,5% |
| `ainda_mora_com_pais` | evento | 3,4% |
| `carona_de_madrugada` | npc | 3,4% |
| `shows_cancelados` | evento | 3,4% |
| `greve_dos_professores` | evento | 3,4% |
| `importado_ficou_caro` | evento | 3,4% |
| `programa_de_moradia` | evento | 3,3% |
| `filho_cuida` | npc | 3,3% |
| `fila_do_posto` | evento | 3,3% |
| `vaga_na_capital` | evento | 3,3% |
| `joias_no_cofre` | evento | 3,2% |
| `faculdade_depois_dos_60` | npc | 3,2% |
| `ferias_do_dono` | evento | 3,2% |
| `plano_de_saude_subiu` | evento | 3,1% |
| `netos_nas_ferias` | evento | 3,1% |
| `reajuste_dos_servidores` | evento | 3,1% |
| `clientes_sumiram` | evento | 3,1% |
| `rodada_grande` | evento | 3,1% |
| `ajudar_na_roca` | acao | 3,0% |
| `obra_do_predio` | evento | 3,0% |
| `reencontro_paixao` | evento | 3,0% |
| `recaida_cigarro` | evento | 3,0% |
| `surto_no_bairro` | evento | 2,9% |
| `gorjeta_boa` | evento | 2,9% |
| `juros_altos` | evento | 2,8% |
| `vender_picole` | acao | 2,8% |
| `expandir_na_alta` | evento | 2,8% |
| `depois_da_venda` | evento | 2,8% |
| `emprego_tecnologia` | evento | 2,7% |
| `birra_no_mercado` | evento | 2,7% |
| `briga_por_heranca` | evento | 2,7% |
| `filho_saude_fragil` | npc | 2,7% |
| `ferias_com_a_familia_do_amor` | npc | 2,6% |
| `black_friday` | evento | 2,6% |
| `filho_quer_carro` | evento | 2,6% |
| `visitar_de_longe` | acao | 2,6% |
| `terapia` | acao | 2,6% |
| `hospital_sem_insumo` | evento | 2,5% |
| `cidadania_do_bisavo` | evento | 2,5% |
| `cancelado` | evento | 2,5% |
| `convite_para_o_palco_grande` | evento | 2,5% |
| `crise_no_setor` | evento | 2,5% |
| `gravidez_surpresa` | npc | 2,5% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,5% |
| `fim_do_amor` | npc | 2,5% |
| `arrojado_na_queda` | evento | 2,5% |
| `crianca_ansiosa` | evento | 2,4% |
| `duas_empresas_uma_agenda` | evento | 2,4% |
| `renegociar_divida` | evento | 2,4% |
| `oferece_ajuda` | npc | 2,4% |
| `emprestimo_de_volta` | evento | 2,3% |
| `seguranca_particular` | evento | 2,3% |
| `vida_depois_da_condenacao` | evento | 2,2% |
| `carreira_futebol` | evento | 2,2% |
| `dizimo` | evento | 2,2% |
| `fronteira_fechada` | evento | 2,2% |
| `time_a_venda` | evento | 2,2% |
| `escola_integral` | evento | 2,2% |
| `bancar_quem_sai` | jogada | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `segundo_carro` | evento | 2,1% |
| `imovel_na_baixa` | evento | 2,1% |
| `ajudar_na_coleta` | evento | 2,1% |
| `passear_pet` | acao | 2,0% |
| `lembranca_primeiro_amor` | evento | 2,0% |
| `cuidar_netos` | acao | 2,0% |
| `paparazzi` | evento | 1,9% |
| `amigo_ficou_rico` | npc | 1,9% |
| `padrao_aperta` | evento | 1,9% |
| `reforma_sem_fim` | evento | 1,9% |
| `presidir_cpi` | evento | 1,9% |
| `segredo_de_familia` | npc | 1,9% |
| `pai_namorando_de_novo` | npc | 1,9% |
| `hit_viral` | evento | 1,8% |
| `filho_passou_longe` | npc | 1,8% |
| `lesao_grave` | evento | 1,8% |
| `cara_de_comercial` | evento | 1,8% |
| `sair_de_casa_cedo` | evento | 1,8% |
| `filho_primeiro_salario` | npc | 1,7% |
| `retirada_demais` | evento | 1,7% |
| `bodas_de_prata` | evento | 1,7% |
| `ocorrencia_perigosa` | evento | 1,7% |
| `mural_de_problemas` | jogada | 1,7% |
| `doar_em_vida` | evento | 1,7% |
| `frete_sumiu` | evento | 1,6% |
| `conselho_de_fachada` | evento | 1,6% |
| `dez_anos_de_empresa` | evento | 1,6% |
| `promocao_em_outra_cidade` | evento | 1,6% |
| `acoes_da_startup` | evento | 1,6% |
| `proposta_da_europa` | evento | 1,6% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,6% |
| `amor_paga_a_conta` | npc | 1,5% |
| `familia_descobre_o_testamento` | evento | 1,5% |
| `amor_quadro_de_tarefas` | npc | 1,5% |
| `foto_de_campanha` | evento | 1,5% |
| `cupula_la_fora` | evento | 1,5% |
| `embaixador_pede` | evento | 1,5% |
| `apuracao_do_carnaval` | evento | 1,5% |
| `pane_no_voo` | evento | 1,5% |
| `tocar_o_negocio` | acao | 1,4% |
| `nega_ajuda` | npc | 1,4% |
| `contrato_publicitario` | evento | 1,4% |
| `grade_na_janela` | evento | 1,4% |
| `critico_no_salao` | evento | 1,4% |
| `emprego_educacao` | evento | 1,3% |
| `salario_parcelado` | evento | 1,3% |
| `proposta_em_dolar` | evento | 1,3% |
| `burnout` | evento | 1,3% |
| `turne_nacional` | evento | 1,3% |
| `lista_dos_mais_ricos` | evento | 1,3% |
| `o_conselho_vetou` | evento | 1,3% |
| `equipe_para_desmontar` | jogada | 1,2% |
| `chefe_amigo` | evento | 1,2% |
| `vaga_na_empresa_dele` | npc | 1,2% |
| `happy_hour` | acao | 1,2% |
| `apartamento_de_presente` | evento | 1,2% |
| `vendas_recorde` | evento | 1,2% |
| `rebaixamento` | evento | 1,2% |
| `deploy_de_sexta` | evento | 1,2% |
| `papel_da_vida` | evento | 1,1% |
| `nao_para_quieto` | evento | 1,1% |
| `holding_da_familia` | evento | 1,1% |
| `cobranca_no_telefone` | evento | 1,1% |
| `feirao_limpa_nome` | evento | 1,1% |
| `juros_altos_na_fatura` | evento | 1,1% |
| `livro_viralizou` | evento | 1,1% |
| `exportacao_bate_recorde` | evento | 1,1% |
| `briga_de_casal` | npc | 1,0% |
| `robos_na_fabrica` | evento | 1,0% |
| `tornar_se_dispensavel` | jogada | 1,0% |
| `safra_da_fazenda` | evento | 1,0% |
| `obra_atrasada` | evento | 1,0% |
| `pix_para_a_cidade` | jogada | 1,0% |
| `celular_dos_pais` | npc | 1,0% |
| `mais_uma_mudanca` | evento | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `oferta_pela_subsidiaria` | evento | 1,0% |
| `trator_aos_dez` | evento | 1,0% |
| `intercambio` | evento | 0,9% |
| `treinar_no_clube` | acao | 0,9% |
| `despejo` | evento | 0,9% |
| `mestrado_fora` | evento | 0,9% |
| `pedreiro_vale_ouro` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `guerra_comercial` | evento | 0,9% |
| `pressao_carreira` | npc | 0,9% |
| `solucao_inesperada` | evento | 0,9% |
| `divida_publica_assusta` | evento | 0,8% |
| `layoff_por_email` | evento | 0,8% |
| `estatua_derrubada` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `fa_obcecado` | evento | 0,8% |
| `sucessao_regime` | evento | 0,8% |
| `sucessao_coroa` | evento | 0,8% |
| `padrinho_casamento` | npc | 0,8% |
| `carro_de_luxo_na_rua` | evento | 0,8% |
| `governo_que_voce_elegeu_centrao` | evento | 0,8% |
| `fim_de_semana_no_sitio` | evento | 0,7% |
| `acampamento_na_porta` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `fila_do_emprego` | evento | 0,7% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 0,7% |
| `vaga_no_agro` | evento | 0,7% |
| `filial_fechando` | evento | 0,7% |
| `peneira_do_sobrenome` | evento | 0,7% |
| `filho_briga_na_escola` | npc | 0,6% |
| `desfile_das_campeas` | evento | 0,6% |
| `tradutor_da_familia` | evento | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `bancar_presidente` | jogada | 0,6% |
| `final_da_copa` | evento | 0,6% |
| `cavalo_campeao` | evento | 0,6% |
| `aluguel_caro` | evento | 0,6% |
| `circo_vai_embora` | evento | 0,6% |
| `sancao_parou_o_porto` | evento | 0,6% |
| `proposta_pelo_negocio` | evento | 0,6% |
| `quebra_de_safra` | evento | 0,6% |
| `shopping_lotado` | evento | 0,6% |
| `transito_de_sp` | evento | 0,6% |
| `paciente_famoso` | evento | 0,6% |
| `negocio_em_crise` | evento | 0,5% |
| `obra_parada` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `favor_do_presidente` | evento | 0,5% |
| `noite_de_corridas` | evento | 0,5% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,5% |
| `safra_recorde` | evento | 0,5% |
| `proposta_remota` | evento | 0,5% |
| `tentar_a_vida_na_europa` | evento | 0,5% |
| `turno_extra_na_fabrica` | evento | 0,5% |
| `montadora_vai_fechar` | evento | 0,5% |
| `feriado_na_praia` | evento | 0,5% |
| `estagio_do_pai` | evento | 0,5% |
| `o_mural_do_boton` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `choque_de_culturas` | evento | 0,5% |
| `emprego_artes` | evento | 0,5% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `amor_sempre_trabalhando` | npc | 0,4% |
| `emprego_negocios` | evento | 0,4% |
| `fundacao` | jogada | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `naturalizacao` | evento | 0,4% |
| `bonanca_no_governo` | evento | 0,4% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `ministro_pede_ajuste` | evento | 0,4% |
| `sequestro_frustrado` | evento | 0,4% |
| `fusao_de_iguais` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `abrir_capital` | evento | 0,4% |
| `filho_apresenta_namoro` | npc | 0,4% |
| `conselho_quer_ceo` | evento | 0,4% |
| `pais_aposentados` | npc | 0,4% |
| `renegociar_cartao` | acao | 0,4% |
| `carta_branca` | evento | 0,4% |
| `plantao_que_nao_acaba` | evento | 0,4% |
| `vista_da_cobertura` | evento | 0,4% |
| `violencia_vira_manchete` | evento | 0,4% |
| `bonus_do_banco` | evento | 0,3% |
| `ferias_coletivas` | evento | 0,3% |
| `assumir_a_fazenda` | evento | 0,3% |
| `regra_sob_medida` | evento | 0,3% |
| `concurso_em_brasilia` | evento | 0,3% |
| `cliente_perdeu_tudo` | evento | 0,3% |
| `pais_envelhecem` | npc | 0,3% |
| `zona_franca` | evento | 0,3% |
| `importado_invadiu` | evento | 0,3% |
| `caso_do_poderoso` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,3% |
| `aperto_do_mes` | evento | 0,3% |
| `reencontro_amigo_brigado` | evento | 0,3% |
| `cozinha_da_fundacao` | evento | 0,3% |
| `parcela_da_tv` | npc | 0,3% |
| `amor_planilha` | npc | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `clientes_em_panico` | evento | 0,3% |
| `fim_carreira` | evento | 0,3% |
| `mansao_vazia` | evento | 0,3% |
| `passou_mal_de_novo` | npc | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `startup_dos_ex_funcionarios` | evento | 0,2% |
| `cargo_no_gabinete` | evento | 0,2% |
| `leilao_da_obra` | evento | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `paparazzi_real` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `reconciliacao` | npc | 0,2% |
| `rival_bilionario` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `royalties_secaram` | evento | 0,2% |
| `oposicao_na_tv` | evento | 0,2% |
| `greve_geral` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `construtora_quebrou` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `filho_hamburgueria` | npc | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `casamento_real` | evento | 0,2% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `ameaca_de_sancao` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `mordomias_reais` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `subsidiaria_esquecida` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `os_dois_lados` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `acionistas_furiosos` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `a_copa_chegou` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `anos_depois_do_poder` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `lancamento` | evento | 0,0% |
| `ex_aluna_da_fundacao` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `grupo_na_capa` | evento | 0,0% |
| `eleicao_de_fachada` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `amigo_lembra_zoeira` | npc | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `receita_no_seu_pe` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `o_pais_te_paga` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 190 · **mudaram algo em pelo menos uma vida:** 191
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,2 · p10 49 · p25 57 · mediana 70 · p75 85 · p90 95

```
até 19                                        0,2%
20–29          █                              0,4%
30–39          █                              0,9%
40–49          █████████████                  8,6%
50–59          ██████████████████████████████ 19,6%
60–69          █████████████████████████████  18,6%
70–79          ████████████████████████████   18,5%
80–89          ███████████████████████        15,2%
90–99          ████████████████████           12,9%
100+           ████████                       5,2%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 297 mil · p25 R$ 908 mil · mediana R$ 4 milhões · p75 R$ 40 milhões · p90 R$ 208 milhões

```
negativo                                      0,6%
até 10 mil                                    0,4%
10–50 mil      █                              0,9%
50–200 mil     ███                            5,1%
200 mil–1 mi   █████████████                  20,0%
1–5 mi         █████████████████              26,0%
5 mi+          ██████████████████████████████ 47,1%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 74 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,3%
50–59          ████                           5,6%
60–69          ████████████████               24,1%
70–79          ██████████████████████████████ 45,0%
80+            █████████████████              25,0%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,3 | R$ 1,4 milhão | 70,4 | 54,6 | 160,3 | 65,8 | 100% | 57% |
| cautelosa | 91,6 🏆 | R$ 74 milhões 🏆 | 75,0 | 70,3 | 215,7 | 90,1 | 100% | 68% |
| arriscada | 52,1 | R$ 2,4 milhões | 79,0 🏆 | 45,3 | 124,6 | 69,7 | 100% | 53% |
| aleatoria | 75,7 | R$ 1,7 milhão | 71,3 | 61,5 | 136,8 | 62,2 | 100% | 54% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,9% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,7% — num hospital do SUS que fez tudo o que podia, e fez muito
- 10,9% — de um AVC, numa terça-feira sem graça
- 7,2% — de velhice, dormindo, num domingo depois do almoço
- 7,1% — de pneumonia, depois de teimar que era só uma gripe
- 6,8% — numa cirurgia simples que não foi tão simples
- 5,5% — de complicações pulmonares, entre uma tosse e outra
- 5,1% — de complicações de uma queda no banheiro

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
