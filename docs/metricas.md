# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 567 eventos, 115 de personagens, 109 ações, 1583 escolhas, 239 linhas, 142 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3838236 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4389680 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 100,0% | R$ 45 mil |
| Inflação no dinheiro parado | os preços | 100,0% | -R$ 530 mil |
| Acontecimentos | o mercado | 100,0% | -R$ 16 mil |
| Custo de vida | o mercado | 99,9% | -R$ 630 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 5,4 milhões |
| Bico | o mercado | 99,3% | R$ 45 mil |
| Salário | o mercado | 97,5% | R$ 4,1 milhões |
| Juro da renda fixa | o governo | 93,9% | R$ 233 mil |
| Cotação dos investimentos | os preços | 91,3% | R$ 1,3 milhão |
| Imposto | o governo | 85,0% | -R$ 64 mil |
| Auxílio | o governo | 81,9% | R$ 17 mil |
| Imposto mais baixo | o governo | 81,8% | R$ 63 mil |
| Juros da dívida | o banco | 80,3% | -R$ 2,5 mil |
| Compras e vendas | o mercado | 73,9% | -R$ 1,6 milhão |
| Manutenção dos bens | o mercado | 73,9% | -R$ 618 mil |
| Gastos da velhice | o mercado | 61,9% | -R$ 1,4 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 4,0% | 5,0 | 4,6% | 1,9% | 0,0% | 2,6% |
| cautelosa | 0,0% | 1,6% | 0,0 | 1,7% | 0,0% | 0,0% | 0,0% |
| arriscada | 92,6% | 29,3% | 1,0 | 17,4% | 3,9% | 22,2% | 21,6% |
| aleatoria | 48,6% | 15,9% | 1,0 | 9,7% | 1,3% | 10,2% | 10,0% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,7% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,85 anos com acordo (719 vezes) × 2,80 sem (483 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 23,0% de 3530 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,8% das vidas; 13,9% das sujas |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 19 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,10 ms | 2,4% | 32,2 KB | — | pais, poder, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa e a fase do ciclo) | 4,27 ms | 4,8% | 51,3 KB | exterior | poder, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,66 ms | 0,7% | 18,3 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,63 ms | 1,8% | 29,5 KB | pais, mercado | empresa, bens, dividas, personagens, trabalho, carreira, poder, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,44 ms | 0,5% | 3,3 KB | exterior, pais, mercado, economia | bens, dividas, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,02 ms | 1,1% | 15,2 KB | mercado, economia, empresa | dividas, personagens, trabalho, carreira, poder, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,33 ms | 0,4% | 0,3 KB | economia, empresa, bens | personagens, trabalho, carreira, poder, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,06 ms | 0,1% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,87 ms | 2,1% | 21,7 KB | pais, economia, empresa, bens, dividas, privacao | personagens, trabalho, carreira, poder, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 3,06 ms | 3,4% | 44,2 KB | pais, economia, empresa, bens, dividas, privacao, corpo | iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,20 ms | 0,2% | 2,1 KB | pais | carreira, poder, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,31 ms | 0,4% | 1,8 KB | corpo, trabalho | poder, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,74 ms | 0,8% | 3,9 KB | pais, economia, empresa, bens, dividas, personagens, trabalho, carreira | morte, iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,06 ms | 0,1% | 0,0 KB | economia, empresa, bens, dividas, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,90 ms | 1,0% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,48 ms | 0,5% | 0,3 KB | pais, economia, empresa, bens, dividas, privacao, corpo, personagens, trabalho, carreira, poder | iniciativas, diretor |
| amor (o amor que aparece) | 0,08 ms | 0,1% | 0,0 KB | corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 14,34 ms | 16,1% | 2,1 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 15,39 ms | 17,3% | 1,6 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 40,95 ms | 46,1% | — | — | — |

O save de uma vida (amostra de 1040): mediana 302 KB, p90 396 KB, máximo 496 KB; o livro é 97,1% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 496 KB (mediana 302 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 88,89 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 69,9% | 18,8% | 9,5% | 1,7% | 0,1% |

Entre as vidas com filhos (30,1%), a média é de 1,43 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 11,3% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 13,0% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 56,0% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 903 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,73 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 448,5 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 12,8% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 13,2% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,1% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,34 |
| Saturação V20 ≤ 95% | ✅ | 89,9% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 903 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 88,89 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 82,9% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 64,3% (168 dinastias, média de 3,3 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,84 (378 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 277 mil / R$ 391 mil / R$ 795 mil; p10 R$ 227 mil / R$ 196 mil / R$ 157 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 9,70% (p99 R$ 1,4 bilhão, maior R$ 232 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,46% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,9% de 56,5% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 16,9% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 89,9% |
| Assinaturas sem regressão (≥ 918) | ❌ | 903 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 448,5 |
| CPU por vida ≤ 30 ms | ❌ | 88,89 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 97,1% (9,7 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 75,9% de 3667 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (682), A festa do século (590), Pix para a cidade inteira (368), Uma estátua sua (280), Um conselho que diz não (206), Uma fundação com seu nome (179), Bancar um presidente (172), Uma equipe para desmontar (161), Trazer a Copa do Mundo (148), Um mural de problemas (142), Pagar a cura de uma doença (137), Bancar quem quer sair (132), Tornar-se dispensável (125), Um programa espacial (112), Comprar a estatal (74), Fundar uma cidade (61), Fundar um país (42), Uma colônia em Marte (29), Salvar o país da crise (27).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 1 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 43,9% de 1780 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 24,9% delegaram, 58,0% centralizaram (779 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 31,6% (25,2 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (714), Bancar quem quer sair (425), Uma equipe para desmontar (385), Um mural de problemas (367), Tornar-se dispensável (285).
- **Na morte de quem manda:** a empresa perde em média 25,8% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 7, maior 16 anos (7393 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 59,4% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 63,3% / 24,7% / 9,8% / 2,2% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,1 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,2%, o bloco liberal 24,4%, a aliança da ordem 24,7%, o centrão 24,7%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,76% × 1,82%); ✓ dívida menor com a aliança da ordem que com o centrão (69% × 83% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,36% contra 0,65% por ano (37770 e 53507 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,58 votos por vida, 31,2% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 3,48 × 0,66 pontos do PIB por ano (97 e 206 governos); 91,2% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,2% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 200.080 | 1,8% | 8,2% | 5,2% | 80% | 21,0% | 20,4 | 57 | 55 | 51% |
| o centrão | 188.722 | 2,1% | 8,3% | 5,1% | 83% | 25,1% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 188.237 | 1,8% | 8,3% | 5,8% | 69% | 29,4% | 17,6 | 50 | 45 | 52% |
| o bloco liberal | 186.561 | 2,8% | 8,5% | 4,6% | 81% | 29,5% | 22,1 | 43 | 50 | 51% |
| o regime | 8.628 | 0,9% | 9,4% | 5,3% | 23% | 32,0% | 17,2 | 35 | 37 | 45% |
| quem joga | 6.889 | 2,1% | 8,3% | 5,4% | 75% | 25,5% | 19,3 | 51 | 50 | 55% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,4% de 6603 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,7% fundiram, 6,1% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 3551 (p99 371) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,37 ponto em média (29040 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,35 na bolsa (8052 empresas-ano) × 0,01 fechadas (104129) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,8% de 36971 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,10 · mediana R$ 5,06 · p90 R$ 6,31 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,31 no agro (4841 empresas-ano) × -0,33 no comércio (30253), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 24,5%, acordo em 70,7%; 98,3% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 86,9% de 3278 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,17% × 0,08% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,69% × 0,30% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 67,4% de 341 governos; sanção depois de romper 35,2%, depois da visita 1,2% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 200.080 | 0,14% | 2,27% |
| o centrão | 188.722 | 0,10% | 0,50% |
| a aliança da ordem | 188.237 | 1,18% | 0,30% |
| o bloco liberal | 186.561 | 0,19% | 3,69% |
| o regime | 8.628 | 2,29% | 0,01% |
| quem joga | 6.889 | 0,30% | 6,55% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,831, Gini 0,529, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,801–0,866, Gini 0,482–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 11,0% · desigualdade_no_jornal 8,9% · idh_muito_alto 14,0% · idh_em_queda 5,7% · pais_envelhece 13,3% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,801 | 0,831 | 0,866 |
| Desigualdade (Gini) | 0,482 | 0,529 | 0,561 |
| População (milhões) | 179 | 193 | 206 |
| PIB per capita | R$ 118 mil | R$ 251 mil | R$ 586 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 56,0% / 89,9% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 63,5% |
| Efeito da memória (aleatória, V5 sem → com memória) | 62,1% → 52,8% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 903 (583) |
| Mobilidade: mesmo quintil da origem ao fim | 26,7% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,34 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 13,2% / 3,1% |
| Patrimônio p90/p10 | 621,3× (p10 R$ 291 mil, p90 R$ 181 milhões) |
| Desvio-padrão da felicidade média da vida | 8,73 |
| Vidas com patrimônio negativo ao morrer | 0,6% |
| Mudanças de estado causadas pelo jogador | 44,2% |
| Toques por vida | 448,5 |
| Tempo de CPU por vida | 88,89 ms |
| Ações (fichas usadas) por vida | 158,7 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 12,8% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,0 |
| Vidas que terminam com filho ou filha para continuar | 82,9% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,3 / 64,3% / 31,0% |
| Idade de quem herda ao começar (mediana) / herança mediana | 36 anos / R$ 4,5 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,84 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 56,5% |
| Entre quem abriu: quebrou / vendeu | 28,9% / 26,0% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,2 milhões / R$ 96 milhões / R$ 1,4 bilhão / R$ 232 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,70% / 9,70% / 1,46% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 16,9% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 60,5 / 158,7 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 227 mil | R$ 277 mil | R$ 330 mil |
| moderado | R$ 196 mil | R$ 391 mil | R$ 672 mil |
| arrojado | R$ 157 mil | R$ 795 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 824 | R$ 189 mil | R$ 1,7 milhão | R$ 39 milhões |
| moderado | 922 | R$ 190 mil | R$ 1,7 milhão | R$ 36 milhões |
| arrojado | 754 | R$ 202 mil | R$ 2,5 milhões | R$ 56 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 71,1 | R$ 1,8 milhão | 75,5 |
| pobre | 104 | 72,7 | R$ 2,9 milhões | 76,1 |
| remediada | 24 | 70,9 | R$ 3,7 milhões | 78,6 |
| media | 64 | 69,0 | R$ 4 milhões | 74,0 |
| rica | 64 | 69,5 | R$ 5,4 milhões | 76,4 |
| muito rica | 144 | 68,7 | R$ 22 milhões | 75,9 |
| bilionaria | 356 | 71,0 | R$ 2,3 bilhões | 77,1 |
| trilionaria | 276 | 70,9 | R$ 970 bilhões | 77,8 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 40,6 |
| Demissões por vida / vindas de uma recessão ou crise | 0,52 / 31,7% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 46% · serviços 15% · saúde 13% · cultura e internet 7% · transporte e entregas 5% · comércio 4% · agro 3% · construção 3% · tecnologia 2% · indústria 1% · sem setor 1% · finanças 0% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 22% | 34% | 47% | 56% | 78% | 86% | 90% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 23% | 17% | 16% | 13% |
| Q2 | 31% | 23% | 15% | 16% | 15% |
| Q3 | 22% | 24% | 19% | 18% | 17% |
| Q4 | 12% | 22% | 28% | 21% | 16% |
| Q5 | 3% | 8% | 21% | 29% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,1 | R$ 1,5 milhão | 75,0 |
| família pobre | 24% | 70,4 | R$ 1,6 milhão | 75,0 |
| família remediada | 20% | 71,4 | R$ 2,3 milhões | 75,2 |
| classe média | 18% | 70,3 | R$ 3,2 milhões | 74,8 |
| família rica | 13% | 70,4 | R$ 5,9 milhões | 75,1 |
| família muito rica | 13% | 69,6 | R$ 25 milhões | 75,6 |
| família bilionária | 3% | 69,9 | R$ 2 bilhão | 77,5 |

## Repetição

- **Dentro de uma vida:** 7,6% das aparições repetem uma instância já vista na mesma vida; pior vida: 24,3%.
- **Texto repetido entre vidas:** 29,3% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 2,8 · `aposentadoria` 1,5 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,3 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,1

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 130 de 286 (45%) · típico 129 de 286 (45%) · rico 143 de 286 (50%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `mais_um_filho`, `cobranca_da_magoa`, `cobranca_do_filho`, `amor_vai_embora`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `rompimento`, `fazer_as_pazes`, `ajudar_com_a_casa`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `renegociar_cartao`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `transito_de_sp`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `fundacao`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `inauguracao_da_cidade`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `favor_do_presidente`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `cidade_alagou`, `prefeito_da_cidade_nova`, `apagao`, `receita_no_seu_pe`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `noite_de_corridas`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 60,5 · **com causa anterior (cadeia):** 67,7 · **maior distância causa→consequência:** 48,2 anos em média
- **Vidas com 3 pontos de virada no cartão:** 100,0%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,2% |
| `luto` | npc | 97,7% |
| `enem` | evento | 94,6% |
| `primeiro_voto` | evento | 83,5% |
| `trabalho_grande` | acao | 74,4% |
| `programa_junto` | acao | 70,8% |
| `aposentadoria` | evento | 61,6% |
| `correr_no_quintal` | acao | 60,7% |
| `bico_adulto` | acao | 60,7% |
| `ler_gibi` | acao | 58,1% |
| `cuidar_da_doenca` | npc | 57,8% |
| `formatura` | evento | 57,6% |
| `parquinho` | acao | 57,2% |
| `eleicao_geral` | evento | 56,2% |
| `conversar_de_verdade` | acao | 55,1% |
| `saudade_de_voce` | npc | 54,9% |
| `almoco_domingo` | acao | 54,7% |
| `pos_graduacao` | acao | 49,9% |
| `ligar_amigo` | acao | 49,6% |
| `curso_online` | acao | 49,4% |
| `tocar_empresa` | acao | 49,4% |
| `mochilao` | acao | 49,2% |
| `pedir_conselho` | acao | 49,1% |
| `avo_mesada_escondida` | npc | 49,0% |
| `presente_certo` | acao | 48,9% |
| `visitar_familia` | acao | 48,5% |
| `viagem_la_para_fora` | evento | 45,8% |
| `dizer_umas_verdades` | acao | 44,4% |
| `correr` | acao | 43,4% |
| `reclama_que_voce_sumiu` | npc | 43,1% |
| `doente_crianca` | npc | 42,4% |
| `estudar_concurso` | acao | 42,3% |
| `baile_terceira_idade` | acao | 41,7% |
| `vontade_ver_o_mar` | npc | 40,9% |
| `pedir_um_pix` | acao | 40,7% |
| `primeiro_emprego` | evento | 40,6% |
| `demissao` | evento | 40,4% |
| `perdeu_emprego_na_crise` | npc | 39,0% |
| `academia` | acao | 38,6% |
| `balde_da_pracinha` | evento | 37,0% |
| `ler_livros` | acao | 36,7% |
| `estudar_escola` | acao | 36,7% |
| `falando_bem_de_voce` | npc | 36,3% |
| `primeiro_investimento` | evento | 35,9% |
| `ouvir_historia` | acao | 35,8% |
| `creche_ou_vo` | evento | 34,6% |
| `pre_escola` | evento | 34,4% |
| `amigo_em_apuros` | npc | 34,4% |
| `estudar_enem` | acao | 33,3% |
| `paquerar` | acao | 33,3% |
| `primeiro_beijo` | evento | 33,0% |
| `acidente_em_casa` | evento | 32,9% |
| `cuidar_de_doente` | acao | 32,8% |
| `rabiscar_parede` | acao | 32,8% |
| `bullying_recreio` | evento | 32,5% |
| `salario_em_dolar` | evento | 32,5% |
| `perguntar_porque` | acao | 31,9% |
| `copa_do_mundo` | evento | 31,0% |
| `videogame_do_amigo` | acao | 30,4% |
| `viagem_dos_sonhos` | evento | 30,3% |
| `estudar_tabuada` | acao | 29,8% |
| `vontade_viagem_com_amigo` | npc | 29,0% |
| `amor_quer_casar` | npc | 28,7% |
| `banda_garagem` | evento | 28,5% |
| `historias_ou_telas` | evento | 28,4% |
| `ajudar_em_casa` | acao | 28,4% |
| `vape_festa` | evento | 28,3% |
| `caminhada` | acao | 28,3% |
| `natacao_no_clube` | acao | 28,1% |
| `colesterol_alto` | evento | 27,6% |
| `bilhete_carinhoso` | npc | 27,4% |
| `festa_80` | evento | 27,3% |
| `investir_tesouro` | acao | 26,9% |
| `filho` | npc | 26,7% |
| `cachorro_caramelo` | evento | 26,6% |
| `piada_no_grupo` | npc | 26,5% |
| `estudar_faculdade` | acao | 26,4% |
| `visitar_o_tumulo` | acao | 26,2% |
| `curso_nota_alta` | evento | 26,0% |
| `filho_adolescente` | evento | 25,9% |
| `carro` | evento | 25,8% |
| `check_up` | acao | 25,7% |
| `golpe_pix` | evento | 25,7% |
| `primeiro_celular` | evento | 25,7% |
| `pelada` | acao | 25,6% |
| `vontade_voltar_a_terra` | npc | 25,6% |
| `vacina_no_posto` | evento | 25,3% |
| `casamento` | npc | 25,3% |
| `pedir_desculpas` | acao | 25,3% |
| `amigo_pede_dinheiro` | evento | 25,2% |
| `oportunidade_de_negocio` | evento | 25,1% |
| `perdeu_aniversario` | npc | 24,9% |
| `festa_tema` | evento | 24,6% |
| `viagem_realizada` | evento | 24,5% |
| `show_no_estadio` | acao | 24,4% |
| `hidro_com_a_turma` | acao | 24,4% |
| `investimento_furado` | evento | 24,3% |
| `guardar_dinheiro` | acao | 24,1% |
| `bet` | evento | 24,0% |
| `doar_sangue` | evento | 23,7% |
| `esperou_por_voce` | npc | 23,6% |
| `pelada_de_quinta` | evento | 23,3% |
| `largar_tudo` | evento | 23,2% |
| `festa_junina` | evento | 23,2% |
| `emprego_saude` | evento | 23,0% |
| `proposta_na_expansao` | evento | 22,9% |
| `esporte_depois_da_aula` | evento | 22,8% |
| `crise_la_fora` | evento | 22,6% |
| `tempo_com_amor` | acao | 22,6% |
| `avo_conta_historias` | npc | 22,3% |
| `criptomoeda` | evento | 22,2% |
| `vontade_de_um_bicho` | npc | 22,0% |
| `voltar_a_estudar` | acao | 21,6% |
| `previdencia` | acao | 21,5% |
| `rebalancear` | acao | 21,5% |
| `pensar_em_adotar` | evento | 21,4% |
| `bico_adolescente` | acao | 21,3% |
| `reforma_da_casa` | evento | 20,8% |
| `cortar_gastos` | acao | 20,6% |
| `tatuagem` | evento | 20,5% |
| `data_da_partida` | evento | 20,4% |
| `primeira_palavra` | evento | 20,4% |
| `cozinhar_com_a_avo` | acao | 20,3% |
| `festa_da_cidade` | acao | 20,2% |
| `bolao_do_trabalho` | evento | 20,1% |
| `futebol_de_varzea` | acao | 20,0% |
| `viajar_com_o_amigo` | acao | 20,0% |
| `encontro` | acao | 20,0% |
| `casa_dos_pais` | evento | 19,9% |
| `sair_de_casa` | evento | 19,6% |
| `vaquinha_do_vizinho` | evento | 19,6% |
| `filho_formatura` | evento | 19,5% |
| `cursinho_pago` | acao | 19,3% |
| `hora_extra` | acao | 19,3% |
| `juros_compostos` | evento | 19,1% |
| `feira_ciencias` | evento | 19,0% |
| `vizinho_barulhento` | evento | 18,9% |
| `mesada` | evento | 18,9% |
| `hobby_horta` | evento | 18,7% |
| `desempregado` | evento | 18,6% |
| `subir_de_padrao` | evento | 18,3% |
| `catapora` | evento | 18,2% |
| `reencontro_da_turma` | evento | 18,2% |
| `pede_ajuda` | npc | 18,2% |
| `festa_sem_pais` | evento | 18,1% |
| `orgulho_da_formatura` | npc | 18,0% |
| `heranca_do_tio` | evento | 17,9% |
| `franquia` | evento | 17,6% |
| `pai_ausente_volta` | npc | 17,6% |
| `assalto_na_rua` | evento | 17,5% |
| `bateu_o_carro` | evento | 17,3% |
| `moeda_digital` | evento | 17,1% |
| `curso_nota_media` | evento | 16,9% |
| `entregas` | acao | 16,7% |
| `voltar_estudar` | evento | 16,6% |
| `vender_doce` | acao | 16,3% |
| `fazenda_a_venda` | evento | 16,2% |
| `fome_no_fim_do_mes` | evento | 16,0% |
| `leu_antes_dos_colegas` | evento | 15,8% |
| `empresa_quebrou` | evento | 15,8% |
| `ceu_de_fumaca` | evento | 15,5% |
| `bloco_de_carnaval` | evento | 15,4% |
| `cripto_fomo` | evento | 15,3% |
| `mudar_para_a_praia` | evento | 15,3% |
| `amigo_devolve` | npc | 15,2% |
| `festa_de_sao_joao` | evento | 15,2% |
| `carteira_da_diarista` | evento | 15,0% |
| `casa_propria` | evento | 15,0% |
| `ingles_crianca` | acao | 14,9% |
| `vaga_sobrando` | evento | 14,8% |
| `hidroginastica` | evento | 14,4% |
| `cirurgia_de_catarata` | evento | 14,4% |
| `dolar_barato` | evento | 14,4% |
| `baile_da_terceira_idade` | evento | 14,3% |
| `entregador_chuva` | evento | 14,1% |
| `idh_muito_alto` | evento | 14,0% |
| `pisa_em_ovos` | npc | 13,9% |
| `reuniao_de_condominio` | evento | 13,9% |
| `corte_de_salario` | evento | 13,8% |
| `convite_para_palestrar` | evento | 13,8% |
| `peneira` | evento | 13,8% |
| `imposto_alto_no_contracheque` | evento | 13,6% |
| `reencontro_amigo` | evento | 13,6% |
| `aula_de_musica` | evento | 13,5% |
| `investimento_rotina` | evento | 13,5% |
| `imovel_valorizou` | evento | 13,4% |
| `alugueis_dos_fundos` | evento | 13,3% |
| `pais_envelhece` | evento | 13,3% |
| `bolsa_la_fora` | evento | 13,3% |
| `convite_do_luxo` | evento | 13,3% |
| `brigas_de_madrugada` | evento | 13,2% |
| `alavancagem` | evento | 13,1% |
| `parar_de_fumar` | acao | 13,0% |
| `multa_e_batida` | evento | 13,0% |
| `levar_ao_mar` | acao | 12,8% |
| `sovina_ou_sabio` | evento | 12,8% |
| `escrever_memorias` | evento | 12,8% |
| `imposto_baixo_sobrou` | evento | 12,8% |
| `promocao` | evento | 12,7% |
| `mais_um_filho` | npc | 12,6% |
| `maratona` | evento | 12,6% |
| `casa_cheia` | evento | 12,4% |
| `separacao` | evento | 12,4% |
| `golpe_do_falso_neto` | evento | 12,4% |
| `quarto_dividido` | evento | 12,4% |
| `compra_por_impulso` | evento | 12,1% |
| `bolsa_de_estudos` | evento | 12,1% |
| `feira_de_ciencias` | evento | 12,0% |
| `separacao_dos_pais` | evento | 11,9% |
| `aniversario_da_infancia` | evento | 11,7% |
| `pobreza_na_porta` | evento | 11,6% |
| `juros_altos_rendendo` | evento | 11,5% |
| `testamento` | evento | 11,5% |
| `balcao_negocio` | acao | 11,5% |
| `casa_na_praia` | evento | 11,5% |
| `rua_tranquila` | evento | 11,5% |
| `casamento_na_igreja` | npc | 11,3% |
| `concorrente_gigante` | evento | 11,3% |
| `peito_chiando` | evento | 11,1% |
| `greve_dos_onibus` | evento | 11,1% |
| `cofrinho` | acao | 11,0% |
| `pib_recorde` | evento | 11,0% |
| `produto_viralizou` | evento | 10,9% |
| `negocio_no_aperto` | evento | 10,9% |
| `recomecar_amor` | acao | 10,8% |
| `praia` | acao | 10,8% |
| `juros_baixos_euforia` | evento | 10,8% |
| `consorcio` | evento | 10,7% |
| `vontade_ver_o_neto` | npc | 10,7% |
| `socio_sumiu` | evento | 10,6% |
| `assalto_no_onibus` | evento | 10,6% |
| `esporte_escola` | acao | 10,5% |
| `cartao_credito` | evento | 10,4% |
| `apartamento_na_planta` | evento | 10,4% |
| `briga_em_casa` | npc | 10,4% |
| `bolsa_subiu_sem_voce` | evento | 10,3% |
| `role` | acao | 10,2% |
| `brincar_com_irmao_avo` | acao | 10,0% |
| `olimpiada_matematica` | evento | 9,9% |
| `seca_no_sertao` | evento | 9,9% |
| `surpresa_do_amor` | npc | 9,8% |
| `queda` | evento | 9,8% |
| `voce_mudou` | npc | 9,8% |
| `retiro_da_igreja` | evento | 9,8% |
| `cheia_do_rio` | evento | 9,5% |
| `investidor_anjo` | evento | 9,5% |
| `comer_tudo` | acao | 9,4% |
| `gerente_do_banco` | evento | 9,4% |
| `tempo_com_filho` | acao | 9,4% |
| `colo_da_avo` | acao | 9,3% |
| `crise_40` | evento | 9,3% |
| `chefe_novo` | evento | 9,3% |
| `fundo_da_familia` | npc | 9,3% |
| `ressaca_do_mar` | evento | 9,3% |
| `fugir_inflacao` | acao | 9,2% |
| `chimarrao` | acao | 9,2% |
| `festa_surpresa` | evento | 9,2% |
| `padrao_de_vida` | evento | 9,1% |
| `sao_joao` | acao | 9,1% |
| `brincar_com_o_pai` | acao | 9,1% |
| `blitz_toda_noite` | evento | 9,0% |
| `titulo_eleitor` | evento | 9,0% |
| `mudanca_de_escola` | evento | 9,0% |
| `desigualdade_no_jornal` | evento | 8,9% |
| `aposentadoria_ativa` | evento | 8,9% |
| `conteudo_extra` | acao | 8,9% |
| `cripto_disparou` | evento | 8,9% |
| `estatua` | jogada | 8,8% |
| `dolar_disparou` | evento | 8,8% |
| `brincar_na_rua` | acao | 8,7% |
| `edital_de_cultura` | evento | 8,7% |
| `remorso_aperta` | evento | 8,7% |
| `filho_desenho` | npc | 8,6% |
| `festival_do_boi` | evento | 8,6% |
| `dente_de_leite` | evento | 8,6% |
| `pousada_na_praia` | evento | 8,6% |
| `ponto_comercial` | evento | 8,5% |
| `atendimento_robo` | evento | 8,5% |
| `inquilino_sumiu` | evento | 8,5% |
| `ouvido_para_musica` | evento | 8,5% |
| `inquilino_dos_sonhos` | evento | 8,5% |
| `festa_de_15` | evento | 8,4% |
| `noite_de_stand_up` | evento | 8,4% |
| `amor_proposta_fora` | npc | 8,3% |
| `tocar_no_bar` | acao | 8,2% |
| `apagao_no_morro` | evento | 8,1% |
| `geada_no_sul` | evento | 8,1% |
| `boi_bumba` | acao | 8,1% |
| `brincar_amigos` | acao | 7,9% |
| `levar_a_terra_natal` | acao | 7,9% |
| `cidadania_italiana` | evento | 7,9% |
| `ciumes_do_irmao` | evento | 7,9% |
| `herdeiro_gastao` | evento | 7,8% |
| `desemprego_em_alta` | evento | 7,8% |
| `passear_de_carrinho` | acao | 7,8% |
| `amor_piada_interna` | npc | 7,7% |
| `vicio_aposta` | evento | 7,7% |
| `pressao_alta` | evento | 7,6% |
| `mei_negocio` | evento | 7,6% |
| `enchente_na_rua` | evento | 7,3% |
| `figurinha_repetida` | acao | 7,3% |
| `geladeira_vazia` | evento | 7,3% |
| `pular_corda` | acao | 7,2% |
| `soltar_pipa` | acao | 7,2% |
| `family_office` | evento | 7,1% |
| `grupo_de_jovens` | evento | 7,0% |
| `faculdade_vida` | evento | 7,0% |
| `fiscalizacao` | evento | 7,0% |
| `assembleia_do_predio` | evento | 6,9% |
| `plantao_lotado` | evento | 6,9% |
| `estatua_pichada` | evento | 6,8% |
| `inflacao_no_mercado` | evento | 6,8% |
| `merenda` | evento | 6,7% |
| `concurso_lotado` | evento | 6,7% |
| `pescaria_no_pantanal` | evento | 6,6% |
| `adocao_chegou` | evento | 6,6% |
| `piramide_no_grupo` | npc | 6,5% |
| `filho_imitacao` | npc | 6,4% |
| `auxilio_na_conta` | evento | 6,4% |
| `doenca_de_quem_ama` | evento | 6,4% |
| `mutirao_de_cirurgias` | evento | 6,4% |
| `vender_doce_nato` | acao | 6,3% |
| `briga_dos_pais` | evento | 6,2% |
| `moto_na_chuva` | evento | 6,2% |
| `asma_na_educacao_fisica` | evento | 6,1% |
| `luto_do_bicho` | npc | 6,1% |
| `show_no_bar` | evento | 6,0% |
| `festival_lotado` | evento | 6,0% |
| `cripto_de_novo` | acao | 5,9% |
| `propina_da_empreiteira` | evento | 5,9% |
| `o_que_pensa_de_voce` | npc | 5,9% |
| `cobranca_do_casamento` | npc | 5,9% |
| `crise_de_ansiedade` | evento | 5,9% |
| `vo_receita` | evento | 5,8% |
| `ano_de_prejuizo` | evento | 5,8% |
| `festa_do_seculo` | jogada | 5,8% |
| `nome_sujo` | evento | 5,7% |
| `idh_em_queda` | evento | 5,7% |
| `vo_partiu` | npc | 5,7% |
| `chaves_do_apartamento` | evento | 5,7% |
| `escola_publica_boa` | evento | 5,7% |
| `obra_grande_no_norte` | evento | 5,6% |
| `bolsa_derreteu` | evento | 5,5% |
| `festa_vazou` | evento | 5,5% |
| `proposta_de_compra` | evento | 5,5% |
| `convite_do_partido` | evento | 5,4% |
| `burnout_empresa` | evento | 5,4% |
| `amigo_muda_de_cidade` | npc | 5,4% |
| `bico_na_expansao` | evento | 5,3% |
| `natal_com_politica` | evento | 5,3% |
| `escola_de_samba` | jogada | 5,3% |
| `pais_separados_natal` | evento | 5,3% |
| `la_fora_comprando` | evento | 5,3% |
| `netos` | evento | 5,3% |
| `so_aparece_por_dinheiro` | npc | 5,2% |
| `viralizou` | evento | 5,2% |
| `blindar_contas` | acao | 5,1% |
| `tarifa_do_app` | evento | 5,1% |
| `briga_na_cozinha` | evento | 5,1% |
| `operacao_policial` | evento | 5,1% |
| `namorar_depois_dos_60` | evento | 5,1% |
| `vontade_casa_propria` | npc | 5,0% |
| `greve_do_servidor` | evento | 4,9% |
| `imposto_sobre_fortunas` | evento | 4,9% |
| `filho_nao_veio` | npc | 4,8% |
| `intercambio_pago` | evento | 4,8% |
| `paquerar_timido` | acao | 4,8% |
| `fundacao_com_seu_nome` | evento | 4,8% |
| `votacao_polemica` | evento | 4,8% |
| `pais_na_crise` | npc | 4,7% |
| `joelho_da_pelada` | evento | 4,7% |
| `cripto_derreteu` | evento | 4,7% |
| `festa_surpresa_para` | npc | 4,6% |
| `sociedade_amigo` | evento | 4,6% |
| `mutirao_da_laje` | evento | 4,6% |
| `curso_nota_baixa` | evento | 4,5% |
| `vereador` | evento | 4,5% |
| `processo_trabalhista` | evento | 4,5% |
| `promessa_da_mae` | evento | 4,4% |
| `excursao_ao_mar` | acao | 4,4% |
| `olimpiada` | acao | 4,4% |
| `cachoeira` | acao | 4,4% |
| `crescer_devagar` | evento | 4,4% |
| `agro_na_cidade` | evento | 4,3% |
| `fim_do_amor` | npc | 4,3% |
| `clinica_particular_contrata` | evento | 4,2% |
| `mae_quer_morar_junto` | npc | 4,2% |
| `trabalho_do_pai` | acao | 4,2% |
| `cobranca_de_notas` | npc | 4,2% |
| `fiador` | npc | 4,2% |
| `comecar_terapia` | evento | 4,1% |
| `primeiro_funcionario` | evento | 4,1% |
| `tosse_cronica` | evento | 4,0% |
| `conselho_que_diz_nao` | jogada | 4,0% |
| `bater_o_pe_com_o_chefe` | evento | 4,0% |
| `confeitaria_da_vo` | evento | 4,0% |
| `emprestimo_ao_irmao` | evento | 3,9% |
| `heranca` | evento | 3,9% |
| `funcionario_genial` | evento | 3,9% |
| `cursinho_comunitario` | evento | 3,8% |
| `pescaria_no_rio` | evento | 3,8% |
| `convite_igreja` | npc | 3,6% |
| `escolheu_bem` | npc | 3,6% |
| `balcao_de_crianca` | evento | 3,6% |
| `este_e_o_ano` | evento | 3,6% |
| `acordo_abriu_mercado` | evento | 3,6% |
| `balcao_da_familia` | evento | 3,6% |
| `filho_cuida` | npc | 3,5% |
| `aprovado_concurso_estudo` | evento | 3,5% |
| `saudade_de_la` | evento | 3,5% |
| `casamento_do_filho` | evento | 3,5% |
| `prova_concurso` | evento | 3,5% |
| `compativel_para_medula` | evento | 3,4% |
| `convite_para_candidatura` | evento | 3,4% |
| `filho_saude_fragil` | npc | 3,4% |
| `governo_que_voce_elegeu_frente_popular` | evento | 3,4% |
| `reajuste_dos_servidores` | evento | 3,3% |
| `depois_do_cargo` | evento | 3,3% |
| `greve_dos_professores` | evento | 3,3% |
| `posto_que_funciona` | evento | 3,2% |
| `assumir_negocio` | evento | 3,2% |
| `ainda_mora_com_pais` | evento | 3,1% |
| `vaga_na_capital` | evento | 3,1% |
| `amor_quer_mudar_de_carreira` | npc | 3,1% |
| `ajudar_na_roca` | acao | 3,1% |
| `amigo_sumiu_e_voltou` | npc | 3,0% |
| `importado_ficou_caro` | evento | 3,0% |
| `mensalidade_da_escola` | npc | 3,0% |
| `joias_no_cofre` | evento | 3,0% |
| `dolar_virou_salario` | evento | 3,0% |
| `um_bicho_para_o_filho` | acao | 3,0% |
| `carregar_a_geladeira` | evento | 3,0% |
| `tentar_outra_cidade` | evento | 3,0% |
| `aposentadoria_nao_da` | npc | 3,0% |
| `faculdade_depois_dos_60` | npc | 2,9% |
| `apresentacao_para_a_diretoria` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `surto_no_bairro` | evento | 2,9% |
| `clientes_sumiram` | evento | 2,9% |
| `plano_de_saude_subiu` | evento | 2,8% |
| `ferias_do_dono` | evento | 2,8% |
| `proposta_sao_paulo` | evento | 2,8% |
| `carona_de_madrugada` | npc | 2,7% |
| `birra_no_mercado` | evento | 2,7% |
| `shows_cancelados` | evento | 2,7% |
| `filho_quer_carro` | evento | 2,7% |
| `filho_primeiro_salario` | npc | 2,7% |
| `enchente_na_cidade` | evento | 2,7% |
| `crianca_ansiosa` | evento | 2,6% |
| `volta_terra` | evento | 2,6% |
| `fila_do_posto` | evento | 2,6% |
| `cancelado` | evento | 2,6% |
| `alguem_especial` | evento | 2,6% |
| `recaida_cigarro` | evento | 2,6% |
| `bancar_quem_sai` | jogada | 2,6% |
| `obra_do_predio` | evento | 2,6% |
| `depois_da_venda` | evento | 2,6% |
| `emprego_tecnologia` | evento | 2,5% |
| `crise_no_setor` | evento | 2,5% |
| `obra_ou_hospital` | evento | 2,5% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,5% |
| `nao_acredita_mais` | npc | 2,4% |
| `filho_passou_longe` | npc | 2,4% |
| `rodada_grande` | evento | 2,4% |
| `reencontro_paixao` | evento | 2,3% |
| `seguranca_particular` | evento | 2,3% |
| `netos_nas_ferias` | evento | 2,3% |
| `juros_altos` | evento | 2,3% |
| `duas_empresas_uma_agenda` | evento | 2,3% |
| `renegociar_divida` | evento | 2,3% |
| `ferias_com_a_familia_do_amor` | npc | 2,2% |
| `terapia` | acao | 2,2% |
| `hospital_sem_insumo` | evento | 2,2% |
| `cidadania_do_bisavo` | evento | 2,2% |
| `black_friday` | evento | 2,2% |
| `expandir_na_alta` | evento | 2,2% |
| `gravidez_surpresa` | npc | 2,2% |
| `carreira_futebol` | evento | 2,2% |
| `briga_por_heranca` | evento | 2,2% |
| `gorjeta_boa` | evento | 2,2% |
| `arrojado_na_queda` | evento | 2,2% |
| `passear_pet` | acao | 2,1% |
| `bodas_de_prata` | evento | 2,1% |
| `ajudar_na_coleta` | evento | 2,1% |
| `programa_de_moradia` | evento | 2,0% |
| `escola_integral` | evento | 2,0% |
| `fronteira_fechada` | evento | 2,0% |
| `irmaos_brigam` | evento | 1,9% |
| `segundo_carro` | evento | 1,9% |
| `time_a_venda` | evento | 1,9% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,9% |
| `missa_em_familia` | acao | 1,9% |
| `dizimo` | evento | 1,9% |
| `conselho_de_fachada` | evento | 1,9% |
| `lesao_grave` | evento | 1,9% |
| `mural_de_problemas` | jogada | 1,9% |
| `governo_que_voce_elegeu_centrao` | evento | 1,8% |
| `amigo_lembra_zoeira` | npc | 1,8% |
| `convite_para_o_palco_grande` | evento | 1,8% |
| `lembranca_primeiro_amor` | evento | 1,8% |
| `imovel_na_baixa` | evento | 1,8% |
| `cuidar_netos` | acao | 1,7% |
| `emprestimo_de_volta` | evento | 1,7% |
| `visitar_de_longe` | acao | 1,7% |
| `sair_de_casa_cedo` | evento | 1,7% |
| `paparazzi` | evento | 1,7% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,7% |
| `oferece_ajuda` | npc | 1,6% |
| `frete_sumiu` | evento | 1,6% |
| `apuracao_do_carnaval` | evento | 1,6% |
| `promocao_em_outra_cidade` | evento | 1,6% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,6% |
| `acoes_da_startup` | evento | 1,6% |
| `reforma_sem_fim` | evento | 1,6% |
| `cara_de_comercial` | evento | 1,6% |
| `retirada_demais` | evento | 1,6% |
| `presidir_cpi` | evento | 1,6% |
| `padrao_aperta` | evento | 1,6% |
| `foto_de_campanha` | evento | 1,5% |
| `ocorrencia_perigosa` | evento | 1,5% |
| `chefe_amigo` | evento | 1,5% |
| `equipe_para_desmontar` | jogada | 1,5% |
| `familia_descobre_o_testamento` | evento | 1,5% |
| `proposta_em_dolar` | evento | 1,4% |
| `amigo_ficou_rico` | npc | 1,4% |
| `vida_depois_da_condenacao` | evento | 1,4% |
| `proposta_da_europa` | evento | 1,4% |
| `nega_ajuda` | npc | 1,4% |
| `cobranca_do_filho` | npc | 1,4% |
| `amor_paga_a_conta` | npc | 1,3% |
| `cobranca_no_telefone` | evento | 1,3% |
| `tocar_o_negocio` | acao | 1,3% |
| `emprego_educacao` | evento | 1,3% |
| `salario_parcelado` | evento | 1,3% |
| `o_conselho_vetou` | evento | 1,3% |
| `contrato_publicitario` | evento | 1,3% |
| `nao_para_quieto` | evento | 1,2% |
| `briga_de_casal` | npc | 1,2% |
| `amor_quadro_de_tarefas` | npc | 1,2% |
| `feirao_limpa_nome` | evento | 1,2% |
| `pane_no_voo` | evento | 1,2% |
| `pai_namorando_de_novo` | npc | 1,2% |
| `hit_viral` | evento | 1,2% |
| `cupula_la_fora` | evento | 1,2% |
| `filho_cuida_de_voce` | npc | 1,2% |
| `turne_nacional` | evento | 1,2% |
| `solucao_inesperada` | evento | 1,2% |
| `papel_da_vida` | evento | 1,1% |
| `amigo_pede_de_novo` | npc | 1,1% |
| `dez_anos_de_empresa` | evento | 1,1% |
| `tornar_se_dispensavel` | jogada | 1,1% |
| `embaixador_pede` | evento | 1,1% |
| `grade_na_janela` | evento | 1,1% |
| `lista_dos_mais_ricos` | evento | 1,1% |
| `segredo_de_familia` | npc | 1,1% |
| `deploy_de_sexta` | evento | 1,1% |
| `cobranca_da_magoa` | npc | 1,1% |
| `jantar_esfriou` | npc | 1,1% |
| `holding_da_familia` | evento | 1,1% |
| `critico_no_salao` | evento | 1,1% |
| `pix_para_a_cidade` | jogada | 1,1% |
| `burnout` | evento | 1,0% |
| `happy_hour` | acao | 1,0% |
| `doar_em_vida` | evento | 1,0% |
| `obra_atrasada` | evento | 1,0% |
| `vaga_na_empresa_dele` | npc | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `safra_da_fazenda` | evento | 1,0% |
| `apartamento_de_presente` | evento | 1,0% |
| `rebaixamento` | evento | 0,9% |
| `vendas_recorde` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `robos_na_fabrica` | evento | 0,9% |
| `estatua_derrubada` | evento | 0,9% |
| `livro_viralizou` | evento | 0,9% |
| `mestrado_fora` | evento | 0,9% |
| `oferta_pela_subsidiaria` | evento | 0,8% |
| `pedreiro_vale_ouro` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `divida_publica_assusta` | evento | 0,8% |
| `set_de_gravacao` | evento | 0,8% |
| `pressao_carreira` | npc | 0,8% |
| `mais_uma_mudanca` | evento | 0,8% |
| `juros_altos_na_fatura` | evento | 0,8% |
| `layoff_por_email` | evento | 0,8% |
| `vontade_festa_de_80` | npc | 0,8% |
| `sucessao_coroa` | evento | 0,8% |
| `exportacao_bate_recorde` | evento | 0,7% |
| `treinar_no_clube` | acao | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `guerra_comercial` | evento | 0,7% |
| `intercambio` | evento | 0,7% |
| `sucessao_regime` | evento | 0,7% |
| `carro_de_luxo_na_rua` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `acampamento_na_porta` | evento | 0,7% |
| `tradutor_da_familia` | evento | 0,7% |
| `vaga_no_agro` | evento | 0,6% |
| `filho_briga_na_escola` | npc | 0,6% |
| `mesa_cheia` | evento | 0,6% |
| `celular_dos_pais` | npc | 0,6% |
| `filho_parou_de_contar` | npc | 0,6% |
| `fila_do_emprego` | evento | 0,6% |
| `fim_de_semana_no_sitio` | evento | 0,6% |
| `filial_fechando` | evento | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `fa_obcecado` | evento | 0,6% |
| `feriado_na_praia` | evento | 0,6% |
| `bancar_presidente` | jogada | 0,6% |
| `peneira_do_sobrenome` | evento | 0,5% |
| `padrinho_casamento` | npc | 0,5% |
| `despejo` | evento | 0,5% |
| `sancao_parou_o_porto` | evento | 0,5% |
| `proposta_remota` | evento | 0,5% |
| `plantao_que_nao_acaba` | evento | 0,5% |
| `final_da_copa` | evento | 0,5% |
| `circo_vai_embora` | evento | 0,5% |
| `cavalo_campeao` | evento | 0,5% |
| `aluguel_caro` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `fundacao` | jogada | 0,5% |
| `bola_autografada` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `rompimento` | npc | 0,5% |
| `quebra_de_safra` | evento | 0,5% |
| `noite_de_corridas` | evento | 0,5% |
| `safra_recorde` | evento | 0,4% |
| `filho_apresenta_namoro` | npc | 0,4% |
| `aperto_do_mes` | evento | 0,4% |
| `montadora_vai_fechar` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `emprego_negocios` | evento | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `o_mural_do_boton` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `transito_de_sp` | evento | 0,4% |
| `favor_do_presidente` | evento | 0,4% |
| `negocio_em_crise` | evento | 0,4% |
| `assumir_a_fazenda` | evento | 0,4% |
| `estagio_do_pai` | evento | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `cargo_no_gabinete` | evento | 0,4% |
| `ajudar_com_a_casa` | acao | 0,4% |
| `emprego_engenharia` | evento | 0,4% |
| `regra_sob_medida` | evento | 0,4% |
| `pais_envelhecem` | npc | 0,4% |
| `renegociar_cartao` | acao | 0,4% |
| `carro_de_presente` | evento | 0,4% |
| `concurso_em_brasilia` | evento | 0,4% |
| `proposta_pelo_negocio` | evento | 0,4% |
| `fusao_de_iguais` | evento | 0,4% |
| `carta_branca` | evento | 0,4% |
| `operacao_no_gabinete` | evento | 0,4% |
| `naturalizacao` | evento | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `obra_parada` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `shopping_lotado` | evento | 0,3% |
| `pais_aposentados` | npc | 0,3% |
| `reencontro_amigo_brigado` | evento | 0,3% |
| `cozinha_da_fundacao` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `tentar_a_vida_na_europa` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `amor_sempre_trabalhando` | npc | 0,3% |
| `construtora_quebrou` | evento | 0,3% |
| `escandalo_do_lobby` | evento | 0,3% |
| `fim_carreira` | evento | 0,3% |
| `bonus_do_banco` | evento | 0,3% |
| `abrir_capital` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `bonanca_no_governo` | evento | 0,3% |
| `sequestro_frustrado` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `ministro_pede_ajuste` | evento | 0,3% |
| `violencia_vira_manchete` | evento | 0,3% |
| `zona_franca` | evento | 0,2% |
| `ferias_coletivas` | evento | 0,2% |
| `etiqueta_real` | evento | 0,2% |
| `reconciliacao` | npc | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `mansao_vazia` | evento | 0,2% |
| `greve_geral` | evento | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `fazer_as_pazes` | acao | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `clientes_em_panico` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `importado_invadiu` | evento | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `paparazzi_real` | evento | 0,2% |
| `royalties_secaram` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `casamento_real` | evento | 0,2% |
| `escola_militar` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `conta_na_suica` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `as_criancas_perguntam` | npc | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `filho_hamburgueria` | npc | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `crise_internacional` | evento | 0,1% |
| `parcela_da_tv` | npc | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `cursinho_paga_bem` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `ameaca_de_sancao` | evento | 0,1% |
| `oposicao_na_tv` | evento | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `cliente_perdeu_tudo` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `mordomias_reais` | evento | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `subsidiaria_esquecida` | evento | 0,1% |
| `conglomerado_com_desconto` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `filho_foi_embora` | npc | 0,0% |
| `fundacao_premio` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `quem_manda_se_voce_faltar` | evento | 0,0% |
| `filho_distante` | npc | 0,0% |
| `vestibular_preparado` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `vida_depois_da_coroa` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `os_dois_lados` | evento | 0,0% |
| `lancamento` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `grupo_na_capa` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `o_pais_te_paga` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 196 · **mudaram algo em pelo menos uma vida:** 197
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,5 · p10 52 · p25 60 · mediana 70 · p75 82 · p90 90

```
até 19                                        0,2%
20–29          █                              0,4%
30–39          █                              0,8%
40–49          ██████                         5,0%
50–59          ██████████████████████         18,4%
60–69          ██████████████████████████████ 24,7%
70–79          █████████████████████████      20,4%
80–89          ███████████████████████        18,9%
90–99          ███████████                    9,1%
100+           ██                             2,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 291 mil · p25 R$ 878 mil · mediana R$ 4 milhões · p75 R$ 37 milhões · p90 R$ 181 milhões

```
negativo                                      0,6%
até 10 mil                                    0,3%
10–50 mil      █                              1,2%
50–200 mil     ███                            4,6%
200 mil–1 mi   █████████████                  20,3%
1–5 mi         ████████████████               25,8%
5 mi+          ██████████████████████████████ 47,2%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 76 · p90 86

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,1%
60–69          ███████████████                21,4%
70–79          ██████████████████████████████ 41,4%
80+            ███████████████████████        31,7%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,1 | R$ 1,3 milhão | 69,9 | 57,6 | 160,0 | 63,2 | 100% | 55% |
| cautelosa | 86,2 🏆 | R$ 63 milhões 🏆 | 77,7 | 69,6 | 204,7 | 78,2 | 100% | 65% |
| arriscada | 55,3 | R$ 2,8 milhões | 80,8 🏆 | 50,6 | 133,9 | 66,3 | 100% | 50% |
| aleatoria | 75,3 | R$ 1,9 milhão | 72,2 | 64,1 | 136,3 | 63,0 | 100% | 53% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,1% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,9% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,3% — de um AVC, numa terça-feira sem graça
- 7,5% — de pneumonia, depois de teimar que era só uma gripe
- 6,6% — numa cirurgia simples que não foi tão simples
- 5,8% — de velhice, dormindo, num domingo depois do almoço
- 5,4% — de complicações pulmonares, entre uma tosse e outra
- 5,1% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
