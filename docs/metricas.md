# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 565 eventos, 85 de personagens, 93 ações, 1525 escolhas, 235 linhas, 128 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3831654 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4382072 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 83 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 542 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 19 mil |
| Custo de vida | o mercado | 99,8% | -R$ 666 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 5,6 milhões |
| Bico | o mercado | 99,2% | R$ 45 mil |
| Salário | o mercado | 97,7% | R$ 4 milhões |
| Juro da renda fixa | o governo | 94,8% | R$ 205 mil |
| Cotação dos investimentos | os preços | 92,7% | R$ 1,3 milhão |
| Imposto | o governo | 84,6% | -R$ 67 mil |
| Imposto mais baixo | o governo | 82,5% | R$ 62 mil |
| Auxílio | o governo | 81,4% | R$ 16 mil |
| Juros da dívida | o banco | 81,1% | -R$ 3 mil |
| Compras e vendas | o mercado | 73,8% | -R$ 1,5 milhão |
| Manutenção dos bens | o mercado | 73,8% | -R$ 537 mil |
| Gastos da velhice | o mercado | 61,3% | -R$ 1,7 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 4,2% | 5,0 | 4,5% | 2,2% | 0,0% | 2,6% |
| cautelosa | 0,0% | 1,4% | 0,0 | 1,6% | 0,0% | 0,0% | 0,0% |
| arriscada | 92,4% | 24,4% | 1,0 | 14,0% | 3,2% | 18,9% | 17,8% |
| aleatoria | 49,0% | 15,6% | 1,0 | 10,6% | 1,3% | 10,6% | 10,4% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 11,4% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,89 anos com acordo (692 vezes) × 2,77 sem (448 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 20,9% de 3533 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,7% das vidas; 14,7% das sujas |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 19 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 1,66 ms | 3,2% | 32,8 KB | — | pais, poder, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa e a fase do ciclo) | 2,88 ms | 5,6% | 52,3 KB | exterior | poder, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,51 ms | 1,0% | 18,6 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,17 ms | 2,3% | 30,5 KB | pais, mercado | empresa, bens, dividas, personagens, trabalho, carreira, poder, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,35 ms | 0,7% | 3,4 KB | exterior, pais, mercado, economia | bens, dividas, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 0,75 ms | 1,5% | 15,9 KB | mercado, economia, empresa | dividas, personagens, trabalho, carreira, poder, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,30 ms | 0,6% | 0,3 KB | economia, empresa, bens | personagens, trabalho, carreira, poder, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,06 ms | 0,1% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,44 ms | 2,8% | 22,0 KB | pais, economia, empresa, bens, dividas, privacao | personagens, trabalho, carreira, poder, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 1,21 ms | 2,3% | 34,5 KB | pais, economia, empresa, bens, dividas, privacao, corpo | iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,16 ms | 0,3% | 2,0 KB | pais | carreira, poder, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,22 ms | 0,4% | 1,9 KB | corpo, trabalho | poder, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,49 ms | 0,9% | 3,9 KB | pais, economia, empresa, bens, dividas, personagens, trabalho, carreira | morte, iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,04 ms | 0,1% | 0,0 KB | economia, empresa, bens, dividas, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,63 ms | 1,2% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,37 ms | 0,7% | 0,3 KB | pais, economia, empresa, bens, dividas, privacao, corpo, personagens, trabalho, carreira, poder | iniciativas, diretor |
| amor (o amor que aparece) | 0,08 ms | 0,1% | 0,0 KB | corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 5,46 ms | 10,6% | 1,3 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 13,16 ms | 25,5% | 1,8 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 20,71 ms | 40,1% | — | — | — |

O save de uma vida (amostra de 1040): mediana 282 KB, p90 407 KB, máximo 506 KB; o livro é 97,1% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 506 KB (mediana 282 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 51,65 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 67,4% | 19,4% | 11,3% | 1,8% | 0,2% |

Entre as vidas com filhos (32,6%), a média é de 1,47 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 13,3% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 15,2% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 57,1% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 909 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,43 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 450,5 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 9,6% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,8% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 4,5% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,31 |
| Saturação V20 ≤ 95% | ✅ | 90,3% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 909 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 51,65 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,0% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 62,5% (168 dinastias, média de 3,3 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,81 (391 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 272 mil / R$ 375 mil / R$ 719 mil; p10 R$ 224 mil / R$ 183 mil / R$ 134 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 10,81% (p99 R$ 2,4 bilhões, maior R$ 259 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 2,05% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 29,8% de 56,4% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 18,7% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 90,3% |
| Assinaturas sem regressão (≥ 918) | ❌ | 909 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 450,5 |
| CPU por vida ≤ 30 ms | ❌ | 51,65 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 96,3% (9,5 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 75,8% de 3594 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (693), A festa do século (594), Pix para a cidade inteira (393), Uma estátua sua (270), Um conselho que diz não (194), Bancar um presidente (164), Uma fundação com seu nome (162), Uma equipe para desmontar (158), Tornar-se dispensável (135), Um mural de problemas (133), Bancar quem quer sair (128), Trazer a Copa do Mundo (124), Pagar a cura de uma doença (112), Um programa espacial (112), Comprar a estatal (67), Fundar uma cidade (64), Fundar um país (37), Salvar o país da crise (28), Uma colônia em Marte (26).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 0 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 39,7% de 1769 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 20,3% delegaram, 55,7% centralizaram (775 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 30,2% (23,1 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (664), Bancar quem quer sair (377), Uma equipe para desmontar (342), Um mural de problemas (321), Tornar-se dispensável (292).
- **Na morte de quem manda:** a empresa perde em média 26,0% do valor; dependência p10 / mediana / p90: 35 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 7, maior 14 anos (7387 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 974 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 52,9% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 63,4% / 24,7% / 9,7% / 2,3% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,0 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,8%, o bloco liberal 24,3%, a aliança da ordem 24,5%, o centrão 24,5%; 8,5 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (20,9% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,74% × 1,83%); ✓ dívida menor com a aliança da ordem que com o centrão (69% × 83% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,35% contra 0,70% por ano (37181 e 53840 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,63 votos por vida, 31,9% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 3,45 × 0,68 pontos do PIB por ano (92 e 264 governos); 94,3% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 3,9% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 206.466 | 1,8% | 8,1% | 5,2% | 80% | 20,9% | 20,4 | 57 | 55 | 51% |
| a aliança da ordem | 188.526 | 1,8% | 8,3% | 5,8% | 69% | 29,4% | 17,6 | 50 | 45 | 52% |
| o centrão | 188.414 | 2,1% | 8,3% | 5,1% | 83% | 25,1% | 21,4 | 50 | 50 | 55% |
| o bloco liberal | 187.023 | 2,7% | 8,5% | 4,6% | 80% | 29,5% | 22,1 | 43 | 50 | 51% |
| o regime | 8.553 | 0,8% | 9,5% | 5,2% | 23% | 32,1% | 17,2 | 35 | 37 | 44% |
| quem joga | 8.125 | 2,3% | 7,9% | 5,5% | 80% | 24,6% | 19,6 | 56 | 54 | 56% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,4% de 6586 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,7% fundiram, 5,9% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 3257 (p99 233) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,36 ponto em média (27955 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,35 na bolsa (7283 empresas-ano) × 0,00 fechadas (96158) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,9% de 36992 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,10 · mediana R$ 5,06 · p90 R$ 6,31 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,28 no agro (4008 empresas-ano) × -0,29 no comércio (31167), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 25,0%, acordo em 71,5%; 98,4% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 86,7% de 3416 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,21% × 0,09% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,66% × 0,32% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 69,2% de 389 governos; sanção depois de romper 34,8%, depois da visita 0,8% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 206.466 | 0,16% | 2,25% |
| a aliança da ordem | 188.526 | 1,22% | 0,32% |
| o centrão | 188.414 | 0,10% | 0,53% |
| o bloco liberal | 187.023 | 0,19% | 3,66% |
| o regime | 8.553 | 2,64% | 0,00% |
| quem joga | 8.125 | 0,17% | 7,95% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,831, Gini 0,528, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,800–0,867, Gini 0,482–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 11,7% · desigualdade_no_jornal 9,7% · idh_muito_alto 16,0% · idh_em_queda 6,0% · pais_envelhece 15,4% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,800 | 0,831 | 0,867 |
| Desigualdade (Gini) | 0,482 | 0,528 | 0,561 |
| População (milhões) | 177 | 193 | 208 |
| PIB per capita | R$ 117 mil | R$ 252 mil | R$ 650 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 57,1% / 90,3% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 65,1% |
| Efeito da memória (aleatória, V5 sem → com memória) | 63,4% → 54,1% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 909 (585) |
| Mobilidade: mesmo quintil da origem ao fim | 26,7% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,31 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,8% / 4,5% |
| Patrimônio p90/p10 | 719,7× (p10 R$ 293 mil, p90 R$ 211 milhões) |
| Desvio-padrão da felicidade média da vida | 8,43 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,8% |
| Toques por vida | 450,5 |
| Tempo de CPU por vida | 51,65 ms |
| Ações (fichas usadas) por vida | 159,4 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 9,6% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,3 |
| Vidas que terminam com filho ou filha para continuar | 84,0% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,3 / 62,5% / 35,7% |
| Idade de quem herda ao começar (mediana) / herança mediana | 36 anos / R$ 8,2 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,81 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 56,4% |
| Entre quem abriu: quebrou / vendeu | 29,8% / 26,6% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,2 milhões / R$ 113 milhões / R$ 2,4 bilhões / R$ 259 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,62% / 10,81% / 2,05% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 18,7% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 58,1 / 159,4 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 224 mil | R$ 272 mil | R$ 330 mil |
| moderado | R$ 183 mil | R$ 375 mil | R$ 674 mil |
| arrojado | R$ 134 mil | R$ 719 mil | R$ 2,8 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 819 | R$ 156 mil | R$ 1,5 milhão | R$ 44 milhões |
| moderado | 967 | R$ 171 mil | R$ 1,8 milhão | R$ 35 milhões |
| arrojado | 714 | R$ 200 mil | R$ 2,5 milhões | R$ 52 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 71,1 | R$ 2,4 milhões | 74,8 |
| pobre | 104 | 70,6 | R$ 1,7 milhão | 74,8 |
| remediada | 24 | 68,8 | R$ 2,3 milhões | 77,2 |
| media | 64 | 70,5 | R$ 4,4 milhões | 73,3 |
| rica | 64 | 69,7 | R$ 3,3 milhões | 74,9 |
| muito rica | 144 | 71,4 | R$ 22 milhões | 76,3 |
| bilionaria | 356 | 70,2 | R$ 2,8 bilhões | 76,0 |
| trilionaria | 276 | 72,3 | R$ 938 bilhões | 77,1 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 41,0 |
| Demissões por vida / vindas de uma recessão ou crise | 0,51 / 31,7% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 45% · serviços 14% · saúde 13% · cultura e internet 9% · comércio 4% · transporte e entregas 4% · agro 3% · construção 2% · tecnologia 2% · indústria 1% · sem setor 1% · finanças 1% · educação 1% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 22% | 36% | 47% | 57% | 79% | 87% | 90% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 30% | 23% | 17% | 15% | 15% |
| Q2 | 28% | 23% | 18% | 15% | 16% |
| Q3 | 23% | 23% | 19% | 18% | 17% |
| Q4 | 14% | 23% | 26% | 22% | 14% |
| Q5 | 4% | 8% | 20% | 29% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 71,4 | R$ 1,7 milhão | 73,6 |
| família pobre | 24% | 71,1 | R$ 1,8 milhão | 73,9 |
| família remediada | 20% | 72,0 | R$ 2,6 milhões | 74,1 |
| classe média | 18% | 70,8 | R$ 2,8 milhões | 73,6 |
| família rica | 13% | 71,4 | R$ 5,8 milhões | 73,8 |
| família muito rica | 13% | 71,1 | R$ 26 milhões | 74,9 |
| família bilionária | 3% | 68,9 | R$ 1,3 bilhão | 76,2 |

## Repetição

- **Dentro de uma vida:** 7,7% das aparições repetem uma instância já vista na mesma vida; pior vida: 26,8%.
- **Texto repetido entre vidas:** 33,0% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,0 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,4 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`, `mutirao_de_cirurgias`, `escola_publica_boa`, `imposto_alto_no_contracheque`, `blitz_toda_noite`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 131 de 621 storylets — `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `mais_um_filho`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `duas_empresas_uma_agenda`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `o_conselho_vetou`, `presidente_pediu_as_contas`, `ferias_do_dono`, `tudo_pela_sua_mesa`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `mutirao_de_cirurgias`, `imposto_alto_no_contracheque`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `carro_de_presente`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `obra_parada`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `fundacao`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `favor_do_presidente`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `receita_no_seu_pe`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `noite_de_corridas`, `vista_da_cobertura`, `mansao_vazia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 58,1 · **com causa anterior (cadeia):** 71,8 · **maior distância causa→consequência:** 47,7 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,1% |
| `luto` | npc | 97,3% |
| `enem` | evento | 94,0% |
| `primeiro_voto` | evento | 83,8% |
| `trabalho_grande` | acao | 74,6% |
| `bico_adulto` | acao | 69,8% |
| `visitar_familia` | acao | 68,6% |
| `cuidar_da_doenca` | npc | 64,5% |
| `correr_no_quintal` | acao | 60,9% |
| `aposentadoria` | evento | 60,0% |
| `ler_gibi` | acao | 58,6% |
| `eleicao_geral` | evento | 58,5% |
| `formatura` | evento | 57,6% |
| `parquinho` | acao | 57,0% |
| `almoco_domingo` | acao | 55,4% |
| `ligar_amigo` | acao | 52,3% |
| `avo_mesada_escondida` | npc | 50,1% |
| `curso_online` | acao | 49,7% |
| `mochilao` | acao | 49,7% |
| `tocar_empresa` | acao | 49,0% |
| `viagem_la_para_fora` | evento | 47,6% |
| `correr` | acao | 47,4% |
| `pos_graduacao` | acao | 47,1% |
| `estudar_enem` | acao | 47,0% |
| `estudar_concurso` | acao | 44,3% |
| `baile_terceira_idade` | acao | 44,0% |
| `paquerar` | acao | 42,1% |
| `doente_crianca` | npc | 42,0% |
| `primeiro_emprego` | evento | 40,5% |
| `perdeu_emprego_na_crise` | npc | 39,4% |
| `cuidar_de_doente` | acao | 39,2% |
| `academia` | acao | 39,0% |
| `primeiro_investimento` | evento | 38,9% |
| `demissao` | evento | 38,8% |
| `ler_livros` | acao | 38,7% |
| `estudar_escola` | acao | 38,5% |
| `balde_da_pracinha` | evento | 37,0% |
| `amigo_em_apuros` | npc | 36,1% |
| `ouvir_historia` | acao | 35,7% |
| `pre_escola` | evento | 35,3% |
| `salario_em_dolar` | evento | 34,0% |
| `copa_do_mundo` | evento | 33,8% |
| `acidente_em_casa` | evento | 33,5% |
| `primeiro_beijo` | evento | 33,1% |
| `rabiscar_parede` | acao | 32,8% |
| `casamento` | npc | 32,4% |
| `perguntar_porque` | acao | 31,8% |
| `creche_ou_vo` | evento | 31,7% |
| `caminhada` | acao | 31,7% |
| `viagem_dos_sonhos` | evento | 31,6% |
| `festa_80` | evento | 31,4% |
| `videogame_do_amigo` | acao | 31,4% |
| `estudar_tabuada` | acao | 29,5% |
| `banda_garagem` | evento | 29,3% |
| `bullying_recreio` | evento | 29,2% |
| `filho` | npc | 28,8% |
| `colesterol_alto` | evento | 28,8% |
| `natacao_no_clube` | acao | 28,5% |
| `estudar_faculdade` | acao | 28,3% |
| `historias_ou_telas` | evento | 28,3% |
| `ajudar_em_casa` | acao | 28,2% |
| `hidro_com_a_turma` | acao | 28,1% |
| `investir_tesouro` | acao | 28,0% |
| `vape_festa` | evento | 27,9% |
| `filho_adolescente` | evento | 27,8% |
| `bilhete_carinhoso` | npc | 27,6% |
| `previdencia` | acao | 27,4% |
| `carro` | evento | 27,0% |
| `golpe_pix` | evento | 27,0% |
| `amigo_pede_dinheiro` | evento | 26,8% |
| `oportunidade_de_negocio` | evento | 26,5% |
| `bet` | evento | 26,5% |
| `piada_no_grupo` | npc | 26,5% |
| `cachorro_caramelo` | evento | 26,4% |
| `amigo_devolve` | npc | 26,4% |
| `pelada` | acao | 26,2% |
| `check_up` | acao | 26,2% |
| `vacina_no_posto` | evento | 26,1% |
| `doar_sangue` | evento | 26,0% |
| `primeiro_celular` | evento | 25,9% |
| `curso_nota_alta` | evento | 25,9% |
| `viagem_realizada` | evento | 25,7% |
| `pelada_de_quinta` | evento | 25,5% |
| `crise_la_fora` | evento | 25,3% |
| `festa_tema` | evento | 25,0% |
| `perdeu_aniversario` | npc | 24,9% |
| `investimento_furado` | evento | 24,7% |
| `guardar_dinheiro` | acao | 24,6% |
| `show_no_estadio` | acao | 24,4% |
| `rebalancear` | acao | 24,3% |
| `largar_tudo` | evento | 24,3% |
| `criptomoeda` | evento | 24,0% |
| `proposta_na_expansao` | evento | 23,9% |
| `voltar_a_estudar` | acao | 23,8% |
| `festa_junina` | evento | 23,6% |
| `tempo_com_amor` | acao | 23,4% |
| `bico_adolescente` | acao | 22,8% |
| `esporte_depois_da_aula` | evento | 22,7% |
| `tatuagem` | evento | 22,5% |
| `reforma_da_casa` | evento | 22,1% |
| `emprego_saude` | evento | 22,0% |
| `pensar_em_adotar` | evento | 21,9% |
| `cursinho_pago` | acao | 21,7% |
| `festa_da_cidade` | acao | 21,6% |
| `sair_de_casa` | evento | 21,5% |
| `casa_dos_pais` | evento | 21,4% |
| `filho_formatura` | evento | 21,3% |
| `vaquinha_do_vizinho` | evento | 21,2% |
| `bolao_do_trabalho` | evento | 21,1% |
| `avo_conta_historias` | npc | 21,0% |
| `encontro` | acao | 20,9% |
| `juros_compostos` | evento | 20,9% |
| `pede_ajuda` | npc | 20,7% |
| `cortar_gastos` | acao | 20,7% |
| `futebol_de_varzea` | acao | 20,4% |
| `cozinhar_com_a_avo` | acao | 20,3% |
| `hora_extra` | acao | 20,0% |
| `vizinho_barulhento` | evento | 19,8% |
| `heranca_do_tio` | evento | 19,8% |
| `feira_ciencias` | evento | 19,6% |
| `hobby_horta` | evento | 19,6% |
| `subir_de_padrao` | evento | 19,6% |
| `mesada` | evento | 19,5% |
| `primeira_palavra` | evento | 19,4% |
| `reencontro_da_turma` | evento | 19,1% |
| `bateu_o_carro` | evento | 18,6% |
| `vender_doce` | acao | 18,6% |
| `desempregado` | evento | 18,6% |
| `assalto_na_rua` | evento | 18,5% |
| `catapora` | evento | 18,4% |
| `moeda_digital` | evento | 18,1% |
| `festa_sem_pais` | evento | 17,9% |
| `pai_ausente_volta` | npc | 17,8% |
| `franquia` | evento | 17,5% |
| `voltar_estudar` | evento | 17,1% |
| `bloco_de_carnaval` | evento | 17,1% |
| `baile_da_terceira_idade` | evento | 16,7% |
| `ceu_de_fumaca` | evento | 16,6% |
| `cirurgia_de_catarata` | evento | 16,5% |
| `casa_propria` | evento | 16,4% |
| `entregas` | acao | 16,4% |
| `cripto_fomo` | evento | 16,4% |
| `empresa_quebrou` | evento | 16,4% |
| `fazenda_a_venda` | evento | 16,2% |
| `fome_no_fim_do_mes` | evento | 16,2% |
| `vaga_sobrando` | evento | 16,2% |
| `carteira_da_diarista` | evento | 16,0% |
| `mudar_para_a_praia` | evento | 16,0% |
| `idh_muito_alto` | evento | 16,0% |
| `hidroginastica` | evento | 15,9% |
| `festa_de_sao_joao` | evento | 15,7% |
| `escrever_memorias` | evento | 15,6% |
| `leu_antes_dos_colegas` | evento | 15,6% |
| `pais_envelhece` | evento | 15,4% |
| `curso_nota_media` | evento | 15,3% |
| `reuniao_de_condominio` | evento | 15,3% |
| `dolar_barato` | evento | 15,3% |
| `imposto_alto_no_contracheque` | evento | 15,3% |
| `golpe_do_falso_neto` | evento | 15,2% |
| `ingles_crianca` | acao | 15,0% |
| `investimento_rotina` | evento | 15,0% |
| `alugueis_dos_fundos` | evento | 14,8% |
| `bolsa_la_fora` | evento | 14,8% |
| `corte_de_salario` | evento | 14,7% |
| `mais_um_filho` | npc | 14,7% |
| `imposto_baixo_sobrou` | evento | 14,6% |
| `esporte_escola` | acao | 14,5% |
| `entregador_chuva` | evento | 14,5% |
| `multa_e_batida` | evento | 14,5% |
| `convite_para_palestrar` | evento | 14,5% |
| `imovel_valorizou` | evento | 14,3% |
| `peneira` | evento | 14,1% |
| `testamento` | evento | 13,9% |
| `casamento_na_igreja` | npc | 13,9% |
| `convite_do_luxo` | evento | 13,8% |
| `queda` | evento | 13,6% |
| `aula_de_musica` | evento | 13,6% |
| `brigas_de_madrugada` | evento | 13,4% |
| `maratona` | evento | 13,3% |
| `juros_altos_rendendo` | evento | 13,2% |
| `reencontro_amigo` | evento | 13,2% |
| `promocao` | evento | 13,2% |
| `sovina_ou_sabio` | evento | 13,2% |
| `alavancagem` | evento | 13,1% |
| `quarto_dividido` | evento | 13,1% |
| `parar_de_fumar` | acao | 13,0% |
| `compra_por_impulso` | evento | 12,9% |
| `briga_em_casa` | npc | 12,9% |
| `ciumes_do_irmao` | evento | 12,7% |
| `cartao_credito` | evento | 12,5% |
| `rua_tranquila` | evento | 12,4% |
| `bolsa_de_estudos` | evento | 12,3% |
| `role` | acao | 12,2% |
| `pobreza_na_porta` | evento | 12,0% |
| `casa_na_praia` | evento | 12,0% |
| `casa_cheia` | evento | 11,9% |
| `juros_baixos_euforia` | evento | 11,8% |
| `aniversario_da_infancia` | evento | 11,8% |
| `feira_de_ciencias` | evento | 11,8% |
| `balcao_negocio` | acao | 11,7% |
| `separacao_dos_pais` | evento | 11,7% |
| `pib_recorde` | evento | 11,7% |
| `produto_viralizou` | evento | 11,6% |
| `greve_dos_onibus` | evento | 11,6% |
| `cofrinho` | acao | 11,6% |
| `consorcio` | evento | 11,5% |
| `concorrente_gigante` | evento | 11,5% |
| `peito_chiando` | evento | 11,4% |
| `recomecar_amor` | acao | 11,4% |
| `praia` | acao | 11,3% |
| `negocio_no_aperto` | evento | 11,0% |
| `fugir_inflacao` | acao | 10,9% |
| `socio_sumiu` | evento | 10,9% |
| `surpresa_do_amor` | npc | 10,9% |
| `filho_desenho` | npc | 10,7% |
| `bolsa_subiu_sem_voce` | evento | 10,7% |
| `retiro_da_igreja` | evento | 10,7% |
| `separacao` | evento | 10,7% |
| `sao_joao` | acao | 10,6% |
| `apartamento_na_planta` | evento | 10,6% |
| `ressaca_do_mar` | evento | 10,5% |
| `assalto_no_onibus` | evento | 10,5% |
| `chefe_novo` | evento | 10,5% |
| `fundo_da_familia` | npc | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,4% |
| `padrao_de_vida` | evento | 10,3% |
| `seca_no_sertao` | evento | 10,3% |
| `crise_40` | evento | 10,1% |
| `edital_de_cultura` | evento | 10,1% |
| `festa_surpresa` | evento | 10,0% |
| `olimpiada_matematica` | evento | 9,9% |
| `gerente_do_banco` | evento | 9,9% |
| `cripto_disparou` | evento | 9,8% |
| `estatua` | jogada | 9,8% |
| `cheia_do_rio` | evento | 9,7% |
| `desigualdade_no_jornal` | evento | 9,7% |
| `aposentadoria_ativa` | evento | 9,7% |
| `investidor_anjo` | evento | 9,7% |
| `titulo_eleitor` | evento | 9,6% |
| `inquilino_sumiu` | evento | 9,5% |
| `noite_de_stand_up` | evento | 9,5% |
| `ponto_comercial` | evento | 9,4% |
| `inquilino_dos_sonhos` | evento | 9,4% |
| `tocar_no_bar` | acao | 9,3% |
| `dolar_disparou` | evento | 9,3% |
| `atendimento_robo` | evento | 9,3% |
| `comer_tudo` | acao | 9,2% |
| `festival_do_boi` | evento | 9,2% |
| `blitz_toda_noite` | evento | 9,2% |
| `conteudo_extra` | acao | 9,2% |
| `chimarrao` | acao | 9,2% |
| `pousada_na_praia` | evento | 9,2% |
| `mudanca_de_escola` | evento | 9,1% |
| `dente_de_leite` | evento | 9,1% |
| `colo_da_avo` | acao | 9,1% |
| `ouvido_para_musica` | evento | 9,0% |
| `brincar_com_o_pai` | acao | 8,9% |
| `cidadania_italiana` | evento | 8,9% |
| `brincar_na_rua` | acao | 8,8% |
| `vicio_aposta` | evento | 8,8% |
| `amor_proposta_fora` | npc | 8,5% |
| `geada_no_sul` | evento | 8,5% |
| `festa_de_15` | evento | 8,4% |
| `apagao_no_morro` | evento | 8,4% |
| `mei_negocio` | evento | 8,3% |
| `boi_bumba` | acao | 8,3% |
| `desemprego_em_alta` | evento | 8,2% |
| `amor_piada_interna` | npc | 8,1% |
| `faculdade_vida` | evento | 8,1% |
| `passear_de_carrinho` | acao | 7,9% |
| `piramide_no_grupo` | npc | 7,9% |
| `family_office` | evento | 7,9% |
| `auxilio_na_conta` | evento | 7,9% |
| `estatua_pichada` | evento | 7,9% |
| `pular_corda` | acao | 7,8% |
| `brincar_amigos` | acao | 7,8% |
| `herdeiro_gastao` | evento | 7,7% |
| `inflacao_no_mercado` | evento | 7,7% |
| `figurinha_repetida` | acao | 7,6% |
| `fiscalizacao` | evento | 7,6% |
| `governo_que_voce_elegeu_frente_popular` | evento | 7,6% |
| `pressao_alta` | evento | 7,5% |
| `geladeira_vazia` | evento | 7,5% |
| `pescaria_no_pantanal` | evento | 7,5% |
| `concurso_lotado` | evento | 7,4% |
| `assembleia_do_predio` | evento | 7,4% |
| `enchente_na_rua` | evento | 7,3% |
| `filho_imitacao` | npc | 7,2% |
| `soltar_pipa` | acao | 7,2% |
| `show_no_bar` | evento | 7,0% |
| `plantao_lotado` | evento | 7,0% |
| `vender_doce_nato` | acao | 6,9% |
| `adocao_chegou` | evento | 6,8% |
| `cripto_de_novo` | acao | 6,7% |
| `asma_na_educacao_fisica` | evento | 6,7% |
| `doenca_de_quem_ama` | evento | 6,7% |
| `festa_surpresa_para` | npc | 6,6% |
| `festa_do_seculo` | jogada | 6,6% |
| `grupo_de_jovens` | evento | 6,6% |
| `festival_lotado` | evento | 6,6% |
| `bolsa_derreteu` | evento | 6,5% |
| `propina_da_empreiteira` | evento | 6,5% |
| `crise_de_ansiedade` | evento | 6,5% |
| `merenda` | evento | 6,4% |
| `la_fora_comprando` | evento | 6,3% |
| `imposto_sobre_fortunas` | evento | 6,3% |
| `briga_dos_pais` | evento | 6,2% |
| `chaves_do_apartamento` | evento | 6,2% |
| `tempo_com_filho` | acao | 6,2% |
| `festa_vazou` | evento | 6,2% |
| `netos` | evento | 6,2% |
| `blindar_contas` | acao | 6,2% |
| `mutirao_de_cirurgias` | evento | 6,1% |
| `convite_do_partido` | evento | 6,1% |
| `burnout_empresa` | evento | 6,0% |
| `idh_em_queda` | evento | 6,0% |
| `olimpiada` | acao | 6,0% |
| `bico_na_expansao` | evento | 6,0% |
| `fundacao_com_seu_nome` | evento | 6,0% |
| `proposta_de_compra` | evento | 6,0% |
| `moto_na_chuva` | evento | 5,9% |
| `paquerar_timido` | acao | 5,8% |
| `escola_publica_boa` | evento | 5,8% |
| `viralizou` | evento | 5,8% |
| `escola_de_samba` | jogada | 5,8% |
| `namorar_depois_dos_60` | evento | 5,8% |
| `operacao_policial` | evento | 5,7% |
| `amigo_muda_de_cidade` | npc | 5,7% |
| `pais_separados_natal` | evento | 5,7% |
| `vo_partiu` | npc | 5,6% |
| `comecar_terapia` | evento | 5,6% |
| `greve_do_servidor` | evento | 5,6% |
| `nome_sujo` | evento | 5,5% |
| `obra_grande_no_norte` | evento | 5,5% |
| `cachoeira` | acao | 5,5% |
| `ano_de_prejuizo` | evento | 5,5% |
| `promessa_da_mae` | evento | 5,5% |
| `vo_receita` | evento | 5,4% |
| `mae_quer_morar_junto` | npc | 5,4% |
| `tarifa_do_app` | evento | 5,4% |
| `natal_com_politica` | evento | 5,4% |
| `cripto_derreteu` | evento | 5,4% |
| `pais_na_crise` | npc | 5,4% |
| `vereador` | evento | 5,3% |
| `briga_na_cozinha` | evento | 5,2% |
| `mutirao_da_laje` | evento | 5,1% |
| `cobranca_de_notas` | npc | 5,0% |
| `luto_do_bicho` | npc | 4,9% |
| `primeiro_funcionario` | evento | 4,9% |
| `joelho_da_pelada` | evento | 4,9% |
| `clinica_particular_contrata` | evento | 4,7% |
| `processo_trabalhista` | evento | 4,7% |
| `agro_na_cidade` | evento | 4,7% |
| `fiador` | npc | 4,6% |
| `votacao_polemica` | evento | 4,5% |
| `curso_nota_baixa` | evento | 4,5% |
| `crescer_devagar` | evento | 4,5% |
| `aprovado_concurso_estudo` | evento | 4,4% |
| `trabalho_do_pai` | acao | 4,4% |
| `bater_o_pe_com_o_chefe` | evento | 4,3% |
| `tosse_cronica` | evento | 4,3% |
| `intercambio_pago` | evento | 4,3% |
| `compativel_para_medula` | evento | 4,3% |
| `heranca` | evento | 4,2% |
| `emprestimo_ao_irmao` | evento | 4,2% |
| `funcionario_genial` | evento | 4,2% |
| `sociedade_amigo` | evento | 4,2% |
| `assumir_negocio` | evento | 4,2% |
| `balcao_da_familia` | evento | 4,1% |
| `acordo_abriu_mercado` | evento | 4,1% |
| `tentar_outra_cidade` | evento | 4,0% |
| `confeitaria_da_vo` | evento | 4,0% |
| `alguem_especial` | evento | 3,9% |
| `este_e_o_ano` | evento | 3,9% |
| `saudade_de_la` | evento | 3,9% |
| `convite_para_candidatura` | evento | 3,8% |
| `filho_cuida` | npc | 3,8% |
| `vaga_na_capital` | evento | 3,8% |
| `casamento_do_filho` | evento | 3,7% |
| `filho_saude_fragil` | npc | 3,7% |
| `cursinho_comunitario` | evento | 3,7% |
| `convite_igreja` | npc | 3,7% |
| `posto_que_funciona` | evento | 3,7% |
| `depois_do_cargo` | evento | 3,7% |
| `balcao_de_crianca` | evento | 3,6% |
| `dolar_virou_salario` | evento | 3,6% |
| `enchente_na_cidade` | evento | 3,6% |
| `pescaria_no_rio` | evento | 3,6% |
| `conselho_que_diz_nao` | jogada | 3,6% |
| `amor_quer_mudar_de_carreira` | npc | 3,5% |
| `aposentadoria_nao_da` | npc | 3,4% |
| `proposta_sao_paulo` | evento | 3,4% |
| `amigo_sumiu_e_voltou` | npc | 3,4% |
| `apresentacao_para_a_diretoria` | evento | 3,4% |
| `obra_ou_hospital` | evento | 3,3% |
| `prova_concurso` | evento | 3,3% |
| `volta_terra` | evento | 3,3% |
| `carona_de_madrugada` | npc | 3,3% |
| `clientes_sumiram` | evento | 3,2% |
| `shows_cancelados` | evento | 3,2% |
| `greve_dos_professores` | evento | 3,2% |
| `programa_de_moradia` | evento | 3,2% |
| `gravidez_surpresa` | npc | 3,2% |
| `ainda_mora_com_pais` | evento | 3,2% |
| `carregar_a_geladeira` | evento | 3,1% |
| `importado_ficou_caro` | evento | 3,1% |
| `ajudar_na_roca` | acao | 3,1% |
| `reajuste_dos_servidores` | evento | 3,0% |
| `joias_no_cofre` | evento | 3,0% |
| `recaida_cigarro` | evento | 3,0% |
| `surto_no_bairro` | evento | 2,9% |
| `plano_de_saude_subiu` | evento | 2,9% |
| `filho_quer_carro` | evento | 2,9% |
| `ferias_do_dono` | evento | 2,9% |
| `faculdade_depois_dos_60` | npc | 2,8% |
| `juros_altos` | evento | 2,8% |
| `obra_do_predio` | evento | 2,8% |
| `fila_do_posto` | evento | 2,8% |
| `black_friday` | evento | 2,8% |
| `escola_integral` | evento | 2,8% |
| `vender_picole` | acao | 2,7% |
| `depois_da_venda` | evento | 2,7% |
| `reencontro_paixao` | evento | 2,7% |
| `terapia` | acao | 2,7% |
| `birra_no_mercado` | evento | 2,7% |
| `netos_nas_ferias` | evento | 2,7% |
| `rodada_grande` | evento | 2,7% |
| `emprego_tecnologia` | evento | 2,7% |
| `ferias_com_a_familia_do_amor` | npc | 2,6% |
| `gorjeta_boa` | evento | 2,6% |
| `crise_no_setor` | evento | 2,5% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,5% |
| `cancelado` | evento | 2,5% |
| `crianca_ansiosa` | evento | 2,5% |
| `fim_do_amor` | npc | 2,5% |
| `filho_passou_longe` | npc | 2,5% |
| `hospital_sem_insumo` | evento | 2,5% |
| `filho_primeiro_salario` | npc | 2,4% |
| `oferece_ajuda` | npc | 2,4% |
| `expandir_na_alta` | evento | 2,3% |
| `visitar_de_longe` | acao | 2,3% |
| `seguranca_particular` | evento | 2,3% |
| `cidadania_do_bisavo` | evento | 2,3% |
| `convite_para_o_palco_grande` | evento | 2,2% |
| `irmaos_brigam` | evento | 2,2% |
| `arrojado_na_queda` | evento | 2,1% |
| `renegociar_divida` | evento | 2,1% |
| `time_a_venda` | evento | 2,1% |
| `fronteira_fechada` | evento | 2,1% |
| `briga_por_heranca` | evento | 2,1% |
| `emprestimo_de_volta` | evento | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `duas_empresas_uma_agenda` | evento | 2,1% |
| `passear_pet` | acao | 2,1% |
| `carreira_futebol` | evento | 2,1% |
| `cuidar_netos` | acao | 2,0% |
| `lesao_grave` | evento | 2,0% |
| `dizimo` | evento | 2,0% |
| `segundo_carro` | evento | 2,0% |
| `lembranca_primeiro_amor` | evento | 2,0% |
| `bancar_quem_sai` | jogada | 2,0% |
| `ajudar_na_coleta` | evento | 1,9% |
| `amigo_ficou_rico` | npc | 1,9% |
| `vida_depois_da_condenacao` | evento | 1,9% |
| `paparazzi` | evento | 1,9% |
| `reforma_sem_fim` | evento | 1,8% |
| `imovel_na_baixa` | evento | 1,8% |
| `presidir_cpi` | evento | 1,8% |
| `segredo_de_familia` | npc | 1,8% |
| `cara_de_comercial` | evento | 1,8% |
| `frete_sumiu` | evento | 1,8% |
| `hit_viral` | evento | 1,7% |
| `sair_de_casa_cedo` | evento | 1,7% |
| `conselho_de_fachada` | evento | 1,7% |
| `padrao_aperta` | evento | 1,7% |
| `pai_namorando_de_novo` | npc | 1,7% |
| `pane_no_voo` | evento | 1,7% |
| `acoes_da_startup` | evento | 1,6% |
| `contrato_publicitario` | evento | 1,6% |
| `promocao_em_outra_cidade` | evento | 1,6% |
| `amor_paga_a_conta` | npc | 1,6% |
| `bodas_de_prata` | evento | 1,6% |
| `proposta_da_europa` | evento | 1,5% |
| `emprego_educacao` | evento | 1,5% |
| `lista_dos_mais_ricos` | evento | 1,5% |
| `familia_descobre_o_testamento` | evento | 1,5% |
| `ocorrencia_perigosa` | evento | 1,5% |
| `retirada_demais` | evento | 1,5% |
| `foto_de_campanha` | evento | 1,5% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,5% |
| `mural_de_problemas` | jogada | 1,5% |
| `apuracao_do_carnaval` | evento | 1,4% |
| `cupula_la_fora` | evento | 1,4% |
| `turne_nacional` | evento | 1,4% |
| `dez_anos_de_empresa` | evento | 1,4% |
| `tocar_o_negocio` | acao | 1,4% |
| `embaixador_pede` | evento | 1,4% |
| `salario_parcelado` | evento | 1,3% |
| `burnout` | evento | 1,3% |
| `deploy_de_sexta` | evento | 1,3% |
| `amor_quadro_de_tarefas` | npc | 1,3% |
| `grade_na_janela` | evento | 1,3% |
| `happy_hour` | acao | 1,3% |
| `critico_no_salao` | evento | 1,3% |
| `nega_ajuda` | npc | 1,2% |
| `cobranca_no_telefone` | evento | 1,2% |
| `chefe_amigo` | evento | 1,2% |
| `proposta_em_dolar` | evento | 1,2% |
| `apartamento_de_presente` | evento | 1,2% |
| `o_conselho_vetou` | evento | 1,2% |
| `livro_viralizou` | evento | 1,2% |
| `doar_em_vida` | evento | 1,2% |
| `safra_da_fazenda` | evento | 1,2% |
| `feirao_limpa_nome` | evento | 1,1% |
| `nao_para_quieto` | evento | 1,1% |
| `equipe_para_desmontar` | jogada | 1,1% |
| `rebaixamento` | evento | 1,1% |
| `holding_da_familia` | evento | 1,1% |
| `divida_publica_assusta` | evento | 1,1% |
| `vaga_na_empresa_dele` | npc | 1,1% |
| `intercambio` | evento | 1,1% |
| `vendas_recorde` | evento | 1,1% |
| `exportacao_bate_recorde` | evento | 1,0% |
| `obra_atrasada` | evento | 1,0% |
| `pedreiro_vale_ouro` | evento | 1,0% |
| `briga_de_casal` | npc | 1,0% |
| `papel_da_vida` | evento | 1,0% |
| `robos_na_fabrica` | evento | 1,0% |
| `mais_uma_mudanca` | evento | 1,0% |
| `trator_aos_dez` | evento | 0,9% |
| `tornar_se_dispensavel` | jogada | 0,9% |
| `pix_para_a_cidade` | jogada | 0,9% |
| `celular_dos_pais` | npc | 0,9% |
| `pressao_carreira` | npc | 0,9% |
| `juros_altos_na_fatura` | evento | 0,9% |
| `preco_do_pao` | evento | 0,9% |
| `solucao_inesperada` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `treinar_no_clube` | acao | 0,9% |
| `mestrado_fora` | evento | 0,9% |
| `vaga_no_agro` | evento | 0,8% |
| `estatua_derrubada` | evento | 0,8% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 0,8% |
| `mesa_cheia` | evento | 0,8% |
| `sucessao_coroa` | evento | 0,8% |
| `protesto_na_avenida` | evento | 0,8% |
| `oferta_pela_subsidiaria` | evento | 0,8% |
| `filial_fechando` | evento | 0,8% |
| `guerra_comercial` | evento | 0,8% |
| `filho_briga_na_escola` | npc | 0,7% |
| `tradutor_da_familia` | evento | 0,7% |
| `final_da_copa` | evento | 0,7% |
| `carro_de_luxo_na_rua` | evento | 0,7% |
| `governo_que_voce_elegeu_centrao` | evento | 0,7% |
| `peneira_do_sobrenome` | evento | 0,7% |
| `layoff_por_email` | evento | 0,7% |
| `a_empresa_sem_voce` | evento | 0,7% |
| `fim_de_semana_no_sitio` | evento | 0,7% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,7% |
| `sucessao_regime` | evento | 0,7% |
| `padrinho_casamento` | npc | 0,6% |
| `fila_do_emprego` | evento | 0,6% |
| `despejo` | evento | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `fa_obcecado` | evento | 0,6% |
| `shopping_lotado` | evento | 0,6% |
| `quebra_de_safra` | evento | 0,6% |
| `desfile_das_campeas` | evento | 0,6% |
| `acampamento_na_porta` | evento | 0,6% |
| `tentar_a_vida_na_europa` | evento | 0,6% |
| `transito_de_sp` | evento | 0,6% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,6% |
| `bancar_presidente` | jogada | 0,5% |
| `sancao_parou_o_porto` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `feriado_na_praia` | evento | 0,5% |
| `safra_recorde` | evento | 0,5% |
| `plantao_que_nao_acaba` | evento | 0,5% |
| `estagio_do_pai` | evento | 0,5% |
| `montadora_vai_fechar` | evento | 0,5% |
| `naturalizacao` | evento | 0,5% |
| `aluguel_com_nome_sujo` | evento | 0,5% |
| `circo_vai_embora` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `obra_parada` | evento | 0,5% |
| `favor_do_presidente` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `noite_de_corridas` | evento | 0,5% |
| `bonanca_no_governo` | evento | 0,5% |
| `amor_sempre_trabalhando` | npc | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `violencia_vira_manchete` | evento | 0,4% |
| `negocio_em_crise` | evento | 0,4% |
| `proposta_pelo_negocio` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `aluguel_caro` | evento | 0,4% |
| `pais_aposentados` | npc | 0,4% |
| `fundacao` | jogada | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `sequestro_frustrado` | evento | 0,4% |
| `filho_apresenta_namoro` | npc | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `cavalo_campeao` | evento | 0,4% |
| `ministro_pede_ajuste` | evento | 0,4% |
| `emprego_negocios` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `proposta_remota` | evento | 0,4% |
| `o_mural_do_boton` | evento | 0,4% |
| `importado_invadiu` | evento | 0,4% |
| `passou_mal_de_novo` | npc | 0,4% |
| `reencontro_amigo_brigado` | evento | 0,4% |
| `assumir_a_fazenda` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `pais_envelhecem` | npc | 0,4% |
| `aperto_do_mes` | evento | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `filho_pede_ajuda` | npc | 0,4% |
| `concurso_em_brasilia` | evento | 0,4% |
| `cargo_no_gabinete` | evento | 0,4% |
| `parcela_da_tv` | npc | 0,3% |
| `fusao_de_iguais` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `operacao_no_gabinete` | evento | 0,3% |
| `fim_carreira` | evento | 0,3% |
| `cliente_perdeu_tudo` | evento | 0,3% |
| `abrir_capital` | evento | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `teste_por_indicacao` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `ferias_coletivas` | evento | 0,3% |
| `ex_aluno` | evento | 0,3% |
| `bonus_do_banco` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `cozinha_da_fundacao` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `crise_internacional` | evento | 0,3% |
| `regra_sob_medida` | evento | 0,3% |
| `renegociar_cartao` | acao | 0,3% |
| `royalties_secaram` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `zona_franca` | evento | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `cursinho_paga_bem` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `paparazzi_real` | evento | 0,3% |
| `carro_de_presente` | evento | 0,2% |
| `rival_bilionario` | evento | 0,2% |
| `filho_adolescente_porta` | npc | 0,2% |
| `amor_planilha` | npc | 0,2% |
| `casamento_real` | evento | 0,2% |
| `mansao_vazia` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `escola_militar` | evento | 0,2% |
| `clientes_em_panico` | evento | 0,2% |
| `greve_geral` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `reconciliacao` | npc | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `construtora_quebrou` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `oposicao_na_tv` | evento | 0,2% |
| `amor_saude_fragil` | npc | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `escandalo_do_lobby` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `filho_hamburgueria` | npc | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `ameaca_de_sancao` | evento | 0,1% |
| `filho_foi_embora` | npc | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `mordomias_reais` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `os_dois_lados` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `quem_manda_se_voce_faltar` | evento | 0,0% |
| `jubileu` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `amigo_lembra_zoeira` | npc | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `ex_aluna_da_fundacao` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `grupo_na_capa` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `lancamento` | evento | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
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
| `segundo_foguete` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 190 · **mudaram algo em pelo menos uma vida:** 191
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,2 · p10 50 · p25 57 · mediana 70 · p75 85 · p90 95

```
até 19                                        0,3%
20–29          █                              0,4%
30–39          ██                             1,1%
40–49          █████████████                  8,3%
50–59          ██████████████████████████████ 19,4%
60–69          █████████████████████████████  19,1%
70–79          ███████████████████████████    17,7%
80–89          ████████████████████████       15,4%
90–99          █████████████████████          13,5%
100+           ████████                       4,9%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 293 mil · p25 R$ 875 mil · mediana R$ 4,1 milhões · p75 R$ 39 milhões · p90 R$ 211 milhões

```
negativo                                      0,8%
até 10 mil                                    0,4%
10–50 mil      █                              1,0%
50–200 mil     ███                            4,8%
200 mil–1 mi   █████████████                  20,2%
1–5 mi         ████████████████               25,4%
5 mi+          ██████████████████████████████ 47,5%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 75 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,5%
60–69          ████████████████               24,3%
70–79          ██████████████████████████████ 44,6%
80+            █████████████████              25,2%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,3 | R$ 1,4 milhão | 70,6 | 55,0 | 160,6 | 65,4 | 100% | 57% |
| cautelosa | 91,8 🏆 | R$ 77 milhões 🏆 | 75,1 | 70,4 | 216,0 | 90,0 | 100% | 66% |
| arriscada | 51,9 | R$ 2,5 milhões | 79,2 🏆 | 45,3 | 123,9 | 69,7 | 100% | 52% |
| aleatoria | 75,9 | R$ 1,9 milhão | 71,3 | 61,8 | 137,3 | 62,1 | 100% | 54% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,0% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,7% — num hospital do SUS que fez tudo o que podia, e fez muito
- 10,9% — de um AVC, numa terça-feira sem graça
- 7,3% — de velhice, dormindo, num domingo depois do almoço
- 6,7% — de pneumonia, depois de teimar que era só uma gripe
- 6,6% — numa cirurgia simples que não foi tão simples
- 5,5% — de complicações pulmonares, entre uma tosse e outra
- 5,5% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
