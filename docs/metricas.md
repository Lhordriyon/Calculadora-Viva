# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 567 eventos, 115 de personagens, 109 ações, 1583 escolhas, 239 linhas, 142 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3824610 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4371348 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Inflação no dinheiro parado | os preços | 100,0% | -R$ 522 mil |
| Ações do ano | o mercado | 99,9% | R$ 66 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 16 mil |
| Custo de vida | o mercado | 99,8% | -R$ 630 mil |
| Padrão de vida | o mercado | 99,7% | -R$ 5,7 milhões |
| Bico | o mercado | 99,1% | R$ 45 mil |
| Salário | o mercado | 97,4% | R$ 4,2 milhões |
| Juro da renda fixa | o governo | 93,8% | R$ 233 mil |
| Cotação dos investimentos | os preços | 91,2% | R$ 1,4 milhão |
| Imposto | o governo | 85,4% | -R$ 67 mil |
| Imposto mais baixo | o governo | 81,9% | R$ 62 mil |
| Auxílio | o governo | 81,0% | R$ 16 mil |
| Juros da dívida | o banco | 80,1% | -R$ 2,4 mil |
| Compras e vendas | o mercado | 73,9% | -R$ 1,7 milhão |
| Manutenção dos bens | o mercado | 73,9% | -R$ 636 mil |
| Gastos da velhice | o mercado | 61,5% | -R$ 1,4 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 4,9% | 5,0 | 5,4% | 2,5% | 0,0% | 3,0% |
| cautelosa | 0,0% | 2,2% | 0,0 | 2,4% | 0,0% | 0,0% | 0,0% |
| arriscada | 93,3% | 28,0% | 1,0 | 15,6% | 3,4% | 21,8% | 21,7% |
| aleatoria | 50,1% | 15,7% | 1,0 | 9,4% | 1,0% | 10,4% | 10,1% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,7% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,80 anos com acordo (743 vezes) × 2,82 sem (455 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 22,5% de 3585 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,7% das vidas; 13,6% das sujas |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 19 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 1,96 ms | 2,3% | 32,2 KB | — | pais, poder, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa e a fase do ciclo) | 3,88 ms | 4,6% | 51,3 KB | exterior | poder, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,65 ms | 0,8% | 18,3 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,57 ms | 1,9% | 29,5 KB | pais, mercado | empresa, bens, dividas, personagens, trabalho, carreira, poder, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,47 ms | 0,6% | 3,4 KB | exterior, pais, mercado, economia | bens, dividas, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,01 ms | 1,2% | 15,3 KB | mercado, economia, empresa | dividas, personagens, trabalho, carreira, poder, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,34 ms | 0,4% | 0,3 KB | economia, empresa, bens | personagens, trabalho, carreira, poder, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,06 ms | 0,1% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,79 ms | 2,1% | 21,7 KB | pais, economia, empresa, bens, dividas, privacao | personagens, trabalho, carreira, poder, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 2,89 ms | 3,4% | 44,7 KB | pais, economia, empresa, bens, dividas, privacao, corpo | iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,20 ms | 0,2% | 2,0 KB | pais | carreira, poder, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,28 ms | 0,3% | 1,8 KB | corpo, trabalho | poder, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,69 ms | 0,8% | 3,8 KB | pais, economia, empresa, bens, dividas, personagens, trabalho, carreira | morte, iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,06 ms | 0,1% | 0,0 KB | economia, empresa, bens, dividas, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,84 ms | 1,0% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,35 ms | 0,4% | 0,3 KB | pais, economia, empresa, bens, dividas, privacao, corpo, personagens, trabalho, carreira, poder | iniciativas, diretor |
| amor (o amor que aparece) | 0,09 ms | 0,1% | 0,0 KB | corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 13,51 ms | 16,1% | 2,1 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 14,33 ms | 17,1% | 1,6 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 38,92 ms | 46,4% | — | — | — |

O save de uma vida (amostra de 1040): mediana 299 KB, p90 401 KB, máximo 517 KB; o livro é 97,1% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 517 KB (mediana 299 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 83,89 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 69,4% | 19,1% | 9,8% | 1,6% | 0,1% |

Entre as vidas com filhos (30,6%), a média é de 1,44 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 11,5% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 13,3% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 55,4% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 910 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,74 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 446,4 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 13,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,8% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 4,0% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,34 |
| Saturação V20 ≤ 95% | ✅ | 90,1% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 910 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 83,89 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 83,1% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 60,7% (168 dinastias, média de 3,2 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,83 (376 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 277 mil / R$ 391 mil / R$ 795 mil; p10 R$ 227 mil / R$ 196 mil / R$ 157 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 8,76% (p99 R$ 1,2 bilhão, maior R$ 433 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,27% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,1% de 55,9% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 16,8% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 90,1% |
| Assinaturas sem regressão (≥ 918) | ❌ | 910 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 446,4 |
| CPU por vida ≤ 30 ms | ❌ | 83,89 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 96,8% (9,2 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 75,5% de 3469 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (665), A festa do século (576), Pix para a cidade inteira (354), Uma estátua sua (248), Um conselho que diz não (200), Bancar um presidente (163), Uma fundação com seu nome (153), Uma equipe para desmontar (148), Um mural de problemas (130), Pagar a cura de uma doença (130), Tornar-se dispensável (121), Trazer a Copa do Mundo (111), Bancar quem quer sair (107), Um programa espacial (105), Fundar uma cidade (85), Comprar a estatal (72), Fundar um país (45), Salvar o país da crise (30), Uma colônia em Marte (26).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 4 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 41,7% de 1863 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 20,6% delegaram, 56,6% centralizaram (831 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 31,6% (25,2 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (719), Bancar quem quer sair (413), Uma equipe para desmontar (393), Um mural de problemas (368), Tornar-se dispensável (298).
- **Na morte de quem manda:** a empresa perde em média 26,0% do valor; dependência p10 / mediana / p90: 35 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 13 anos (7297 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 59,3% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 63,3% / 24,6% / 9,8% / 2,2% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,1 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,9%, o bloco liberal 24,2%, a aliança da ordem 24,4%, o centrão 24,4%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (20,9% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,74% × 1,84%); ✓ dívida menor com a aliança da ordem que com o centrão (69% × 83% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,52% contra 0,65% por ano (37335 e 54739 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,57 votos por vida, 31,8% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 3,51 × 0,69 pontos do PIB por ano (93 e 217 governos); 96,5% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,6% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 204.189 | 1,8% | 8,1% | 5,2% | 80% | 20,9% | 20,4 | 57 | 55 | 51% |
| a aliança da ordem | 185.657 | 1,8% | 8,3% | 5,8% | 69% | 29,4% | 17,6 | 50 | 45 | 52% |
| o centrão | 185.458 | 2,1% | 8,3% | 5,1% | 83% | 25,1% | 21,4 | 50 | 50 | 55% |
| o bloco liberal | 184.166 | 2,7% | 8,5% | 4,6% | 81% | 29,5% | 22,1 | 43 | 50 | 51% |
| o regime | 8.390 | 0,9% | 9,4% | 5,2% | 22% | 32,0% | 17,2 | 35 | 37 | 45% |
| quem joga | 7.360 | 2,4% | 7,9% | 5,5% | 80% | 24,7% | 19,6 | 55 | 54 | 56% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,9% de 6526 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 4,0% fundiram, 6,5% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 3430 (p99 309) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,31 ponto em média (29384 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,35 na bolsa (7305 empresas-ano) × 0,00 fechadas (104900) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,4% de 36837 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,10 · mediana R$ 5,06 · p90 R$ 6,30 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,30 no agro (3987 empresas-ano) × -0,32 no comércio (31239), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 24,1%, acordo em 71,8%; 98,3% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,1% de 3306 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,19% × 0,08% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,66% × 0,31% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 69,0% de 342 governos; sanção depois de romper 35,2%, depois da visita 1,2% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 204.189 | 0,14% | 2,32% |
| a aliança da ordem | 185.657 | 1,20% | 0,31% |
| o centrão | 185.458 | 0,11% | 0,52% |
| o bloco liberal | 184.166 | 0,19% | 3,66% |
| o regime | 8.390 | 2,36% | 0,00% |
| quem joga | 7.360 | 0,24% | 8,11% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,831, Gini 0,529, população 194 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,801–0,867, Gini 0,482–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 10,6% · desigualdade_no_jornal 8,9% · idh_muito_alto 13,4% · idh_em_queda 5,6% · pais_envelhece 13,5% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,801 | 0,831 | 0,867 |
| Desigualdade (Gini) | 0,482 | 0,529 | 0,561 |
| População (milhões) | 180 | 194 | 207 |
| PIB per capita | R$ 117 mil | R$ 248 mil | R$ 595 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 55,4% / 90,1% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 63,5% |
| Efeito da memória (aleatória, V5 sem → com memória) | 62,4% → 52,3% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 910 (589) |
| Mobilidade: mesmo quintil da origem ao fim | 27,2% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,34 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,8% / 4,0% |
| Patrimônio p90/p10 | 595,9× (p10 R$ 277 mil, p90 R$ 165 milhões) |
| Desvio-padrão da felicidade média da vida | 8,74 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,3% |
| Toques por vida | 446,4 |
| Tempo de CPU por vida | 83,89 ms |
| Ações (fichas usadas) por vida | 158,0 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 13,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 22,9 |
| Vidas que terminam com filho ou filha para continuar | 83,1% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,2 / 60,7% / 32,1% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 9,7 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,83 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 55,9% |
| Entre quem abriu: quebrou / vendeu | 28,1% / 25,5% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,3 milhões / R$ 83 milhões / R$ 1,2 bilhão / R$ 433 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,55% / 8,76% / 1,27% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 16,8% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 60,2 / 158,0 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 227 mil | R$ 277 mil | R$ 330 mil |
| moderado | R$ 196 mil | R$ 391 mil | R$ 672 mil |
| arrojado | R$ 157 mil | R$ 795 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 823 | R$ 126 mil | R$ 1,6 milhão | R$ 41 milhões |
| moderado | 894 | R$ 136 mil | R$ 1,7 milhão | R$ 33 milhões |
| arrojado | 783 | R$ 173 mil | R$ 2,9 milhões | R$ 56 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 69,3 | R$ 1,8 milhão | 75,3 |
| pobre | 104 | 71,6 | R$ 1,7 milhão | 76,3 |
| remediada | 24 | 71,7 | R$ 3,4 milhões | 79,4 |
| media | 64 | 69,0 | R$ 3,2 milhões | 73,8 |
| rica | 64 | 68,5 | R$ 6,8 milhões | 75,9 |
| muito rica | 144 | 69,8 | R$ 24 milhões | 76,0 |
| bilionaria | 356 | 69,5 | R$ 2,6 bilhões | 76,8 |
| trilionaria | 276 | 69,8 | R$ 906 bilhões | 77,7 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 40,4 |
| Demissões por vida / vindas de uma recessão ou crise | 0,51 / 32,5% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 46% · serviços 14% · saúde 13% · cultura e internet 8% · transporte e entregas 5% · comércio 4% · agro 3% · construção 2% · tecnologia 2% · sem setor 1% · indústria 1% · finanças 1% · educação 1% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 22% | 34% | 46% | 55% | 79% | 86% | 90% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 30% | 24% | 16% | 15% | 15% |
| Q2 | 31% | 22% | 16% | 15% | 15% |
| Q3 | 23% | 23% | 21% | 19% | 14% |
| Q4 | 12% | 24% | 26% | 22% | 16% |
| Q5 | 4% | 7% | 20% | 28% | 41% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 69,3 | R$ 1,7 milhão | 75,0 |
| família pobre | 24% | 70,1 | R$ 1,7 milhão | 74,8 |
| família remediada | 20% | 71,4 | R$ 2,4 milhões | 75,1 |
| classe média | 18% | 70,0 | R$ 3,5 milhões | 74,8 |
| família rica | 13% | 70,1 | R$ 6,9 milhões | 74,9 |
| família muito rica | 13% | 69,6 | R$ 25 milhões | 75,8 |
| família bilionária | 3% | 68,8 | R$ 1,9 bilhão | 77,0 |

## Repetição

- **Dentro de uma vida:** 7,6% das aparições repetem uma instância já vista na mesma vida; pior vida: 26,8%.
- **Texto repetido entre vidas:** 29,4% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 2,8 · `aposentadoria` 1,5 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,3 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,1

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`, `mutirao_de_cirurgias`, `escola_publica_boa`, `imposto_alto_no_contracheque`, `blitz_toda_noite`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 134 de 641 storylets — `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `mais_um_filho`, `cobranca_da_magoa`, `cobranca_do_filho`, `amor_vai_embora`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `duas_empresas_uma_agenda`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `o_conselho_vetou`, `presidente_pediu_as_contas`, `ferias_do_dono`, `tudo_pela_sua_mesa`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `mutirao_de_cirurgias`, `imposto_alto_no_contracheque`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `fazer_as_pazes`, `ajudar_com_a_casa`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `renegociar_cartao`, `carro_de_presente`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `fundacao`, `trazer_a_copa`, `cura_de_doenca`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `favor_do_presidente`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `receita_no_seu_pe`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `noite_de_corridas`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `governo_que_voce_elegeu_alianca_da_ordem`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 60,2 · **com causa anterior (cadeia):** 66,9 · **maior distância causa→consequência:** 47,8 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,1% |
| `luto` | npc | 97,4% |
| `enem` | evento | 94,7% |
| `primeiro_voto` | evento | 84,0% |
| `trabalho_grande` | acao | 74,3% |
| `programa_junto` | acao | 69,4% |
| `bico_adulto` | acao | 62,1% |
| `aposentadoria` | evento | 61,5% |
| `correr_no_quintal` | acao | 60,7% |
| `cuidar_da_doenca` | npc | 58,1% |
| `ler_gibi` | acao | 57,7% |
| `formatura` | evento | 57,6% |
| `parquinho` | acao | 57,3% |
| `eleicao_geral` | evento | 55,5% |
| `saudade_de_voce` | npc | 54,7% |
| `almoco_domingo` | acao | 54,6% |
| `conversar_de_verdade` | acao | 53,5% |
| `curso_online` | acao | 49,3% |
| `ligar_amigo` | acao | 49,3% |
| `mochilao` | acao | 49,0% |
| `pedir_conselho` | acao | 48,9% |
| `avo_mesada_escondida` | npc | 48,7% |
| `presente_certo` | acao | 48,5% |
| `visitar_familia` | acao | 48,1% |
| `pos_graduacao` | acao | 45,8% |
| `viagem_la_para_fora` | evento | 45,6% |
| `tocar_empresa` | acao | 44,5% |
| `dizer_umas_verdades` | acao | 44,2% |
| `correr` | acao | 43,5% |
| `doente_crianca` | npc | 42,8% |
| `reclama_que_voce_sumiu` | npc | 42,6% |
| `estudar_concurso` | acao | 42,4% |
| `baile_terceira_idade` | acao | 41,6% |
| `vontade_ver_o_mar` | npc | 41,1% |
| `primeiro_emprego` | evento | 41,0% |
| `pedir_um_pix` | acao | 40,6% |
| `demissao` | evento | 39,4% |
| `perdeu_emprego_na_crise` | npc | 38,4% |
| `academia` | acao | 38,0% |
| `balde_da_pracinha` | evento | 37,0% |
| `ler_livros` | acao | 36,6% |
| `estudar_escola` | acao | 36,5% |
| `falando_bem_de_voce` | npc | 36,2% |
| `ouvir_historia` | acao | 35,9% |
| `primeiro_investimento` | evento | 35,8% |
| `pre_escola` | evento | 34,6% |
| `creche_ou_vo` | evento | 34,5% |
| `estudar_enem` | acao | 33,6% |
| `amigo_em_apuros` | npc | 33,4% |
| `paquerar` | acao | 33,2% |
| `primeiro_beijo` | evento | 33,1% |
| `acidente_em_casa` | evento | 33,0% |
| `rabiscar_parede` | acao | 32,8% |
| `bullying_recreio` | evento | 32,6% |
| `salario_em_dolar` | evento | 32,1% |
| `perguntar_porque` | acao | 32,0% |
| `copa_do_mundo` | evento | 31,1% |
| `cuidar_de_doente` | acao | 30,6% |
| `videogame_do_amigo` | acao | 30,4% |
| `estudar_tabuada` | acao | 29,9% |
| `viagem_dos_sonhos` | evento | 29,6% |
| `banda_garagem` | evento | 29,2% |
| `amor_quer_casar` | npc | 28,8% |
| `vontade_viagem_com_amigo` | npc | 28,6% |
| `caminhada` | acao | 28,3% |
| `vape_festa` | evento | 28,1% |
| `natacao_no_clube` | acao | 28,1% |
| `historias_ou_telas` | evento | 28,1% |
| `ajudar_em_casa` | acao | 27,8% |
| `bilhete_carinhoso` | npc | 27,5% |
| `investir_tesouro` | acao | 27,2% |
| `colesterol_alto` | evento | 27,2% |
| `festa_80` | evento | 27,1% |
| `filho` | npc | 26,9% |
| `cachorro_caramelo` | evento | 26,7% |
| `piada_no_grupo` | npc | 26,5% |
| `estudar_faculdade` | acao | 26,5% |
| `filho_adolescente` | evento | 26,3% |
| `visitar_o_tumulo` | acao | 25,9% |
| `primeiro_celular` | evento | 25,8% |
| `curso_nota_alta` | evento | 25,8% |
| `vontade_voltar_a_terra` | npc | 25,7% |
| `amigo_pede_dinheiro` | evento | 25,4% |
| `vacina_no_posto` | evento | 25,4% |
| `check_up` | acao | 25,4% |
| `pelada` | acao | 25,4% |
| `carro` | evento | 25,3% |
| `oportunidade_de_negocio` | evento | 25,2% |
| `golpe_pix` | evento | 25,0% |
| `casamento` | npc | 24,9% |
| `perdeu_aniversario` | npc | 24,9% |
| `festa_tema` | evento | 24,5% |
| `show_no_estadio` | acao | 24,3% |
| `viagem_realizada` | evento | 24,2% |
| `guardar_dinheiro` | acao | 24,1% |
| `doar_sangue` | evento | 24,0% |
| `hidro_com_a_turma` | acao | 24,0% |
| `bet` | evento | 23,9% |
| `pedir_desculpas` | acao | 23,8% |
| `amigo_devolve` | npc | 23,6% |
| `investimento_furado` | evento | 23,5% |
| `pelada_de_quinta` | evento | 23,4% |
| `festa_junina` | evento | 23,3% |
| `crise_la_fora` | evento | 23,1% |
| `esperou_por_voce` | npc | 23,0% |
| `proposta_na_expansao` | evento | 23,0% |
| `emprego_saude` | evento | 22,9% |
| `esporte_depois_da_aula` | evento | 22,7% |
| `criptomoeda` | evento | 22,5% |
| `largar_tudo` | evento | 22,4% |
| `avo_conta_historias` | npc | 22,4% |
| `vontade_de_um_bicho` | npc | 21,9% |
| `rebalancear` | acao | 21,6% |
| `bico_adolescente` | acao | 21,6% |
| `reforma_da_casa` | evento | 20,8% |
| `previdencia` | acao | 20,8% |
| `pensar_em_adotar` | evento | 20,7% |
| `tatuagem` | evento | 20,5% |
| `casa_dos_pais` | evento | 20,5% |
| `primeira_palavra` | evento | 20,4% |
| `cozinhar_com_a_avo` | acao | 20,4% |
| `festa_da_cidade` | acao | 20,3% |
| `futebol_de_varzea` | acao | 20,1% |
| `filho_formatura` | evento | 20,1% |
| `data_da_partida` | evento | 19,9% |
| `vaquinha_do_vizinho` | evento | 19,9% |
| `voltar_a_estudar` | acao | 19,8% |
| `hora_extra` | acao | 19,5% |
| `encontro` | acao | 19,4% |
| `bolao_do_trabalho` | evento | 19,3% |
| `cursinho_pago` | acao | 19,3% |
| `tempo_com_amor` | acao | 19,3% |
| `feira_ciencias` | evento | 19,1% |
| `sair_de_casa` | evento | 19,1% |
| `viajar_com_o_amigo` | acao | 19,0% |
| `juros_compostos` | evento | 18,9% |
| `cortar_gastos` | acao | 18,8% |
| `hobby_horta` | evento | 18,8% |
| `subir_de_padrao` | evento | 18,7% |
| `vizinho_barulhento` | evento | 18,6% |
| `mesada` | evento | 18,6% |
| `catapora` | evento | 18,5% |
| `pede_ajuda` | npc | 18,1% |
| `festa_sem_pais` | evento | 17,9% |
| `reencontro_da_turma` | evento | 17,8% |
| `orgulho_da_formatura` | npc | 17,8% |
| `heranca_do_tio` | evento | 17,6% |
| `desempregado` | evento | 17,6% |
| `assalto_na_rua` | evento | 17,6% |
| `pai_ausente_volta` | npc | 17,5% |
| `franquia` | evento | 17,4% |
| `bateu_o_carro` | evento | 17,4% |
| `curso_nota_media` | evento | 17,3% |
| `moeda_digital` | evento | 17,0% |
| `entregas` | acao | 16,7% |
| `voltar_estudar` | evento | 16,6% |
| `vender_doce` | acao | 16,4% |
| `fome_no_fim_do_mes` | evento | 15,9% |
| `fazenda_a_venda` | evento | 15,9% |
| `leu_antes_dos_colegas` | evento | 15,8% |
| `empresa_quebrou` | evento | 15,7% |
| `ceu_de_fumaca` | evento | 15,6% |
| `bloco_de_carnaval` | evento | 15,2% |
| `carteira_da_diarista` | evento | 15,2% |
| `vaga_sobrando` | evento | 15,0% |
| `festa_de_sao_joao` | evento | 14,9% |
| `cripto_fomo` | evento | 14,9% |
| `ingles_crianca` | acao | 14,8% |
| `mudar_para_a_praia` | evento | 14,7% |
| `casa_propria` | evento | 14,6% |
| `convite_para_palestrar` | evento | 14,2% |
| `dolar_barato` | evento | 14,2% |
| `baile_da_terceira_idade` | evento | 14,1% |
| `reuniao_de_condominio` | evento | 14,1% |
| `imposto_alto_no_contracheque` | evento | 14,1% |
| `hidroginastica` | evento | 13,8% |
| `cirurgia_de_catarata` | evento | 13,8% |
| `corte_de_salario` | evento | 13,8% |
| `entregador_chuva` | evento | 13,7% |
| `investimento_rotina` | evento | 13,6% |
| `imovel_valorizou` | evento | 13,6% |
| `aula_de_musica` | evento | 13,6% |
| `alugueis_dos_fundos` | evento | 13,5% |
| `pais_envelhece` | evento | 13,5% |
| `peneira` | evento | 13,5% |
| `idh_muito_alto` | evento | 13,4% |
| `alavancagem` | evento | 13,4% |
| `reencontro_amigo` | evento | 13,3% |
| `pisa_em_ovos` | npc | 13,3% |
| `brigas_de_madrugada` | evento | 13,1% |
| `parar_de_fumar` | acao | 12,9% |
| `quarto_dividido` | evento | 12,9% |
| `multa_e_batida` | evento | 12,8% |
| `convite_do_luxo` | evento | 12,8% |
| `imposto_baixo_sobrou` | evento | 12,8% |
| `levar_ao_mar` | acao | 12,7% |
| `mais_um_filho` | npc | 12,6% |
| `promocao` | evento | 12,6% |
| `sovina_ou_sabio` | evento | 12,6% |
| `maratona` | evento | 12,4% |
| `casa_cheia` | evento | 12,4% |
| `escrever_memorias` | evento | 12,2% |
| `golpe_do_falso_neto` | evento | 12,1% |
| `bolsa_la_fora` | evento | 12,1% |
| `separacao` | evento | 12,1% |
| `juros_altos_rendendo` | evento | 11,9% |
| `bolsa_de_estudos` | evento | 11,9% |
| `separacao_dos_pais` | evento | 11,8% |
| `rua_tranquila` | evento | 11,6% |
| `aniversario_da_infancia` | evento | 11,6% |
| `balcao_negocio` | acao | 11,5% |
| `compra_por_impulso` | evento | 11,5% |
| `feira_de_ciencias` | evento | 11,4% |
| `casa_na_praia` | evento | 11,4% |
| `concorrente_gigante` | evento | 11,4% |
| `testamento` | evento | 11,2% |
| `peito_chiando` | evento | 11,0% |
| `consorcio` | evento | 10,9% |
| `casamento_na_igreja` | npc | 10,9% |
| `cofrinho` | acao | 10,9% |
| `produto_viralizou` | evento | 10,9% |
| `vontade_ver_o_neto` | npc | 10,8% |
| `pobreza_na_porta` | evento | 10,8% |
| `praia` | acao | 10,7% |
| `pib_recorde` | evento | 10,6% |
| `greve_dos_onibus` | evento | 10,6% |
| `cartao_credito` | evento | 10,6% |
| `voce_mudou` | npc | 10,5% |
| `apartamento_na_planta` | evento | 10,5% |
| `assalto_no_onibus` | evento | 10,4% |
| `juros_baixos_euforia` | evento | 10,4% |
| `bolsa_subiu_sem_voce` | evento | 10,4% |
| `esporte_escola` | acao | 10,3% |
| `socio_sumiu` | evento | 10,2% |
| `negocio_no_aperto` | evento | 10,1% |
| `brincar_com_irmao_avo` | acao | 9,9% |
| `recomecar_amor` | acao | 9,9% |
| `briga_em_casa` | npc | 9,8% |
| `role` | acao | 9,8% |
| `retiro_da_igreja` | evento | 9,6% |
| `surpresa_do_amor` | npc | 9,6% |
| `seca_no_sertao` | evento | 9,6% |
| `gerente_do_banco` | evento | 9,6% |
| `queda` | evento | 9,5% |
| `cheia_do_rio` | evento | 9,5% |
| `padrao_de_vida` | evento | 9,4% |
| `ressaca_do_mar` | evento | 9,4% |
| `comer_tudo` | acao | 9,4% |
| `olimpiada_matematica` | evento | 9,4% |
| `chefe_novo` | evento | 9,4% |
| `investidor_anjo` | evento | 9,3% |
| `crise_40` | evento | 9,3% |
| `colo_da_avo` | acao | 9,2% |
| `conteudo_extra` | acao | 9,2% |
| `brincar_com_o_pai` | acao | 9,2% |
| `chimarrao` | acao | 9,1% |
| `mudanca_de_escola` | evento | 9,1% |
| `sao_joao` | acao | 9,1% |
| `fundo_da_familia` | npc | 9,0% |
| `ouvido_para_musica` | evento | 8,9% |
| `titulo_eleitor` | evento | 8,9% |
| `desigualdade_no_jornal` | evento | 8,9% |
| `remorso_aperta` | evento | 8,8% |
| `pousada_na_praia` | evento | 8,8% |
| `fugir_inflacao` | acao | 8,7% |
| `festa_surpresa` | evento | 8,7% |
| `edital_de_cultura` | evento | 8,7% |
| `amor_proposta_fora` | npc | 8,7% |
| `brincar_na_rua` | acao | 8,7% |
| `cripto_disparou` | evento | 8,6% |
| `aposentadoria_ativa` | evento | 8,6% |
| `atendimento_robo` | evento | 8,6% |
| `dente_de_leite` | evento | 8,6% |
| `estatua` | jogada | 8,6% |
| `festival_do_boi` | evento | 8,6% |
| `inquilino_dos_sonhos` | evento | 8,5% |
| `festa_de_15` | evento | 8,5% |
| `dolar_disparou` | evento | 8,4% |
| `apagao_no_morro` | evento | 8,4% |
| `filho_desenho` | npc | 8,3% |
| `inquilino_sumiu` | evento | 8,3% |
| `blitz_toda_noite` | evento | 8,2% |
| `ponto_comercial` | evento | 8,2% |
| `noite_de_stand_up` | evento | 8,2% |
| `boi_bumba` | acao | 8,1% |
| `herdeiro_gastao` | evento | 8,0% |
| `pressao_alta` | evento | 8,0% |
| `brincar_amigos` | acao | 8,0% |
| `amor_piada_interna` | npc | 7,9% |
| `cidadania_italiana` | evento | 7,9% |
| `levar_a_terra_natal` | acao | 7,8% |
| `passear_de_carrinho` | acao | 7,8% |
| `ciumes_do_irmao` | evento | 7,7% |
| `geada_no_sul` | evento | 7,6% |
| `vicio_aposta` | evento | 7,6% |
| `geladeira_vazia` | evento | 7,6% |
| `mei_negocio` | evento | 7,5% |
| `faculdade_vida` | evento | 7,4% |
| `desemprego_em_alta` | evento | 7,4% |
| `enchente_na_rua` | evento | 7,3% |
| `grupo_de_jovens` | evento | 7,3% |
| `pular_corda` | acao | 7,3% |
| `figurinha_repetida` | acao | 7,3% |
| `tocar_no_bar` | acao | 7,2% |
| `soltar_pipa` | acao | 7,1% |
| `inflacao_no_mercado` | evento | 7,0% |
| `fiscalizacao` | evento | 7,0% |
| `merenda` | evento | 6,8% |
| `assembleia_do_predio` | evento | 6,7% |
| `auxilio_na_conta` | evento | 6,6% |
| `family_office` | evento | 6,6% |
| `concurso_lotado` | evento | 6,6% |
| `plantao_lotado` | evento | 6,5% |
| `filho_imitacao` | npc | 6,5% |
| `pescaria_no_pantanal` | evento | 6,5% |
| `show_no_bar` | evento | 6,5% |
| `adocao_chegou` | evento | 6,5% |
| `estatua_pichada` | evento | 6,3% |
| `piramide_no_grupo` | npc | 6,3% |
| `briga_dos_pais` | evento | 6,2% |
| `vender_doce_nato` | acao | 6,1% |
| `doenca_de_quem_ama` | evento | 6,1% |
| `cripto_de_novo` | acao | 6,1% |
| `governo_que_voce_elegeu_frente_popular` | evento | 6,1% |
| `propina_da_empreiteira` | evento | 6,1% |
| `mutirao_de_cirurgias` | evento | 6,0% |
| `asma_na_educacao_fisica` | evento | 6,0% |
| `festa_do_seculo` | jogada | 6,0% |
| `crise_de_ansiedade` | evento | 5,9% |
| `chaves_do_apartamento` | evento | 5,9% |
| `nome_sujo` | evento | 5,9% |
| `moto_na_chuva` | evento | 5,8% |
| `escola_publica_boa` | evento | 5,8% |
| `cobranca_do_casamento` | npc | 5,8% |
| `festa_vazou` | evento | 5,7% |
| `vo_receita` | evento | 5,7% |
| `vo_partiu` | npc | 5,7% |
| `festival_lotado` | evento | 5,7% |
| `luto_do_bicho` | npc | 5,7% |
| `o_que_pensa_de_voce` | npc | 5,7% |
| `ano_de_prejuizo` | evento | 5,6% |
| `tempo_com_filho` | acao | 5,6% |
| `idh_em_queda` | evento | 5,6% |
| `obra_grande_no_norte` | evento | 5,4% |
| `pais_separados_natal` | evento | 5,4% |
| `convite_do_partido` | evento | 5,3% |
| `netos` | evento | 5,3% |
| `natal_com_politica` | evento | 5,3% |
| `la_fora_comprando` | evento | 5,3% |
| `tarifa_do_app` | evento | 5,3% |
| `bico_na_expansao` | evento | 5,3% |
| `burnout_empresa` | evento | 5,3% |
| `bolsa_derreteu` | evento | 5,2% |
| `escola_de_samba` | jogada | 5,2% |
| `greve_do_servidor` | evento | 5,2% |
| `blindar_contas` | acao | 5,2% |
| `namorar_depois_dos_60` | evento | 5,1% |
| `amigo_muda_de_cidade` | npc | 5,1% |
| `promessa_da_mae` | evento | 5,1% |
| `proposta_de_compra` | evento | 5,1% |
| `operacao_policial` | evento | 5,1% |
| `filho_nao_veio` | npc | 5,1% |
| `pais_na_crise` | npc | 4,9% |
| `vontade_casa_propria` | npc | 4,9% |
| `so_aparece_por_dinheiro` | npc | 4,8% |
| `viralizou` | evento | 4,8% |
| `briga_na_cozinha` | evento | 4,8% |
| `processo_trabalhista` | evento | 4,8% |
| `vereador` | evento | 4,7% |
| `paquerar_timido` | acao | 4,7% |
| `curso_nota_baixa` | evento | 4,7% |
| `fundacao_com_seu_nome` | evento | 4,5% |
| `joelho_da_pelada` | evento | 4,5% |
| `mae_quer_morar_junto` | npc | 4,5% |
| `intercambio_pago` | evento | 4,5% |
| `mutirao_da_laje` | evento | 4,5% |
| `imposto_sobre_fortunas` | evento | 4,5% |
| `festa_surpresa_para` | npc | 4,5% |
| `cripto_derreteu` | evento | 4,4% |
| `primeiro_funcionario` | evento | 4,4% |
| `cachoeira` | acao | 4,4% |
| `fim_do_amor` | npc | 4,3% |
| `olimpiada` | acao | 4,3% |
| `votacao_polemica` | evento | 4,3% |
| `crescer_devagar` | evento | 4,3% |
| `comecar_terapia` | evento | 4,3% |
| `trabalho_do_pai` | acao | 4,3% |
| `fiador` | npc | 4,3% |
| `excursao_ao_mar` | acao | 4,2% |
| `sociedade_amigo` | evento | 4,2% |
| `agro_na_cidade` | evento | 4,2% |
| `tosse_cronica` | evento | 4,1% |
| `pescaria_no_rio` | evento | 4,0% |
| `cobranca_de_notas` | npc | 4,0% |
| `bater_o_pe_com_o_chefe` | evento | 4,0% |
| `balcao_da_familia` | evento | 4,0% |
| `conselho_que_diz_nao` | jogada | 4,0% |
| `acordo_abriu_mercado` | evento | 3,9% |
| `clinica_particular_contrata` | evento | 3,9% |
| `funcionario_genial` | evento | 3,9% |
| `heranca` | evento | 3,9% |
| `convite_igreja` | npc | 3,9% |
| `cursinho_comunitario` | evento | 3,8% |
| `confeitaria_da_vo` | evento | 3,8% |
| `emprestimo_ao_irmao` | evento | 3,7% |
| `filho_cuida` | npc | 3,7% |
| `aposentadoria_nao_da` | npc | 3,5% |
| `balcao_de_crianca` | evento | 3,5% |
| `aprovado_concurso_estudo` | evento | 3,5% |
| `compativel_para_medula` | evento | 3,5% |
| `greve_dos_professores` | evento | 3,5% |
| `prova_concurso` | evento | 3,4% |
| `este_e_o_ano` | evento | 3,4% |
| `casamento_do_filho` | evento | 3,4% |
| `filho_saude_fragil` | npc | 3,4% |
| `posto_que_funciona` | evento | 3,4% |
| `assumir_negocio` | evento | 3,3% |
| `saudade_de_la` | evento | 3,3% |
| `convite_para_candidatura` | evento | 3,3% |
| `depois_do_cargo` | evento | 3,3% |
| `escolheu_bem` | npc | 3,2% |
| `tentar_outra_cidade` | evento | 3,2% |
| `reajuste_dos_servidores` | evento | 3,1% |
| `amigo_sumiu_e_voltou` | npc | 3,1% |
| `dolar_virou_salario` | evento | 3,0% |
| `enchente_na_cidade` | evento | 3,0% |
| `ajudar_na_roca` | acao | 3,0% |
| `importado_ficou_caro` | evento | 2,9% |
| `joias_no_cofre` | evento | 2,9% |
| `obra_ou_hospital` | evento | 2,9% |
| `volta_terra` | evento | 2,9% |
| `vaga_na_capital` | evento | 2,9% |
| `carregar_a_geladeira` | evento | 2,9% |
| `birra_no_mercado` | evento | 2,9% |
| `shows_cancelados` | evento | 2,9% |
| `clientes_sumiram` | evento | 2,8% |
| `ferias_do_dono` | evento | 2,8% |
| `proposta_sao_paulo` | evento | 2,8% |
| `carona_de_madrugada` | npc | 2,8% |
| `amor_quer_mudar_de_carreira` | npc | 2,8% |
| `fila_do_posto` | evento | 2,8% |
| `vender_picole` | acao | 2,7% |
| `ainda_mora_com_pais` | evento | 2,7% |
| `apresentacao_para_a_diretoria` | evento | 2,7% |
| `faculdade_depois_dos_60` | npc | 2,7% |
| `plano_de_saude_subiu` | evento | 2,7% |
| `surto_no_bairro` | evento | 2,7% |
| `alguem_especial` | evento | 2,7% |
| `filho_primeiro_salario` | npc | 2,7% |
| `crianca_ansiosa` | evento | 2,5% |
| `gorjeta_boa` | evento | 2,5% |
| `bancar_quem_sai` | jogada | 2,5% |
| `reencontro_paixao` | evento | 2,5% |
| `expandir_na_alta` | evento | 2,5% |
| `rodada_grande` | evento | 2,5% |
| `juros_altos` | evento | 2,5% |
| `filho_quer_carro` | evento | 2,4% |
| `crise_no_setor` | evento | 2,4% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,4% |
| `emprego_tecnologia` | evento | 2,4% |
| `black_friday` | evento | 2,4% |
| `recaida_cigarro` | evento | 2,4% |
| `obra_do_predio` | evento | 2,4% |
| `gravidez_surpresa` | npc | 2,4% |
| `renegociar_divida` | evento | 2,3% |
| `nao_acredita_mais` | npc | 2,3% |
| `briga_por_heranca` | evento | 2,3% |
| `netos_nas_ferias` | evento | 2,3% |
| `programa_de_moradia` | evento | 2,3% |
| `depois_da_venda` | evento | 2,2% |
| `terapia` | acao | 2,2% |
| `seguranca_particular` | evento | 2,2% |
| `cidadania_do_bisavo` | evento | 2,1% |
| `filho_passou_longe` | npc | 2,1% |
| `duas_empresas_uma_agenda` | evento | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `ferias_com_a_familia_do_amor` | npc | 2,1% |
| `cancelado` | evento | 2,1% |
| `escola_integral` | evento | 2,1% |
| `bodas_de_prata` | evento | 2,1% |
| `irmaos_brigam` | evento | 2,1% |
| `fronteira_fechada` | evento | 2,1% |
| `hospital_sem_insumo` | evento | 2,1% |
| `imovel_na_baixa` | evento | 2,1% |
| `arrojado_na_queda` | evento | 2,1% |
| `dizimo` | evento | 2,0% |
| `conselho_de_fachada` | evento | 2,0% |
| `carreira_futebol` | evento | 2,0% |
| `passear_pet` | acao | 2,0% |
| `ajudar_na_coleta` | evento | 2,0% |
| `mural_de_problemas` | jogada | 2,0% |
| `visitar_de_longe` | acao | 1,9% |
| `emprestimo_de_volta` | evento | 1,9% |
| `lesao_grave` | evento | 1,9% |
| `time_a_venda` | evento | 1,8% |
| `amigo_lembra_zoeira` | npc | 1,8% |
| `convite_para_o_palco_grande` | evento | 1,8% |
| `paparazzi` | evento | 1,8% |
| `acoes_da_startup` | evento | 1,8% |
| `sair_de_casa_cedo` | evento | 1,8% |
| `reforma_sem_fim` | evento | 1,7% |
| `promocao_em_outra_cidade` | evento | 1,7% |
| `frete_sumiu` | evento | 1,6% |
| `padrao_aperta` | evento | 1,6% |
| `equipe_para_desmontar` | jogada | 1,6% |
| `oferece_ajuda` | npc | 1,6% |
| `segundo_carro` | evento | 1,6% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,6% |
| `cara_de_comercial` | evento | 1,6% |
| `proposta_da_europa` | evento | 1,6% |
| `lembranca_primeiro_amor` | evento | 1,6% |
| `apuracao_do_carnaval` | evento | 1,6% |
| `um_bicho_para_o_filho` | acao | 1,6% |
| `retirada_demais` | evento | 1,5% |
| `cuidar_netos` | acao | 1,5% |
| `familia_descobre_o_testamento` | evento | 1,5% |
| `pane_no_voo` | evento | 1,5% |
| `hit_viral` | evento | 1,5% |
| `chefe_amigo` | evento | 1,5% |
| `ocorrencia_perigosa` | evento | 1,5% |
| `foto_de_campanha` | evento | 1,5% |
| `emprego_educacao` | evento | 1,4% |
| `vida_depois_da_condenacao` | evento | 1,4% |
| `presidir_cpi` | evento | 1,4% |
| `salario_parcelado` | evento | 1,4% |
| `embaixador_pede` | evento | 1,4% |
| `briga_de_casal` | npc | 1,4% |
| `amor_quadro_de_tarefas` | npc | 1,4% |
| `amor_paga_a_conta` | npc | 1,4% |
| `proposta_em_dolar` | evento | 1,4% |
| `cupula_la_fora` | evento | 1,4% |
| `cobranca_do_filho` | npc | 1,4% |
| `o_conselho_vetou` | evento | 1,4% |
| `dez_anos_de_empresa` | evento | 1,3% |
| `contrato_publicitario` | evento | 1,3% |
| `nega_ajuda` | npc | 1,3% |
| `jantar_esfriou` | npc | 1,3% |
| `amigo_ficou_rico` | npc | 1,3% |
| `cobranca_no_telefone` | evento | 1,2% |
| `deploy_de_sexta` | evento | 1,2% |
| `filho_cuida_de_voce` | npc | 1,2% |
| `solucao_inesperada` | evento | 1,2% |
| `pai_namorando_de_novo` | npc | 1,1% |
| `cobranca_da_magoa` | npc | 1,1% |
| `tornar_se_dispensavel` | jogada | 1,1% |
| `nao_para_quieto` | evento | 1,1% |
| `critico_no_salao` | evento | 1,1% |
| `happy_hour` | acao | 1,1% |
| `burnout` | evento | 1,1% |
| `feirao_limpa_nome` | evento | 1,1% |
| `segredo_de_familia` | npc | 1,0% |
| `amigo_pede_de_novo` | npc | 1,0% |
| `doar_em_vida` | evento | 1,0% |
| `holding_da_familia` | evento | 1,0% |
| `pix_para_a_cidade` | jogada | 1,0% |
| `turne_nacional` | evento | 1,0% |
| `tocar_o_negocio` | acao | 0,9% |
| `lista_dos_mais_ricos` | evento | 0,9% |
| `estatua_derrubada` | evento | 0,9% |
| `apartamento_de_presente` | evento | 0,9% |
| `grade_na_janela` | evento | 0,9% |
| `rebaixamento` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `livro_viralizou` | evento | 0,9% |
| `preco_do_pao` | evento | 0,9% |
| `robos_na_fabrica` | evento | 0,9% |
| `safra_da_fazenda` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `vendas_recorde` | evento | 0,9% |
| `vontade_festa_de_80` | npc | 0,9% |
| `acampamento_na_porta` | evento | 0,9% |
| `vaga_na_empresa_dele` | npc | 0,9% |
| `exportacao_bate_recorde` | evento | 0,9% |
| `divida_publica_assusta` | evento | 0,9% |
| `mais_uma_mudanca` | evento | 0,8% |
| `juros_altos_na_fatura` | evento | 0,8% |
| `oferta_pela_subsidiaria` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `obra_atrasada` | evento | 0,8% |
| `papel_da_vida` | evento | 0,8% |
| `layoff_por_email` | evento | 0,8% |
| `filho_parou_de_contar` | npc | 0,8% |
| `final_da_copa` | evento | 0,7% |
| `mestrado_fora` | evento | 0,7% |
| `sucessao_coroa` | evento | 0,7% |
| `fa_obcecado` | evento | 0,7% |
| `pressao_carreira` | npc | 0,7% |
| `tradutor_da_familia` | evento | 0,7% |
| `pedreiro_vale_ouro` | evento | 0,7% |
| `filho_briga_na_escola` | npc | 0,7% |
| `infancia_no_palacio` | evento | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `sucessao_regime` | evento | 0,7% |
| `fila_do_emprego` | evento | 0,7% |
| `guerra_comercial` | evento | 0,7% |
| `treinar_no_clube` | acao | 0,6% |
| `proposta_remota` | evento | 0,6% |
| `despejo` | evento | 0,6% |
| `peneira_do_sobrenome` | evento | 0,6% |
| `transito_de_sp` | evento | 0,6% |
| `fim_de_semana_no_sitio` | evento | 0,6% |
| `protesto_na_avenida` | evento | 0,6% |
| `intercambio` | evento | 0,6% |
| `bancar_presidente` | jogada | 0,6% |
| `vaga_no_agro` | evento | 0,6% |
| `celular_dos_pais` | npc | 0,6% |
| `carro_de_luxo_na_rua` | evento | 0,6% |
| `estagio_do_pai` | evento | 0,6% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,6% |
| `rompimento` | npc | 0,5% |
| `picadeiro` | evento | 0,5% |
| `sancao_parou_o_porto` | evento | 0,5% |
| `governo_que_voce_elegeu_centrao` | evento | 0,5% |
| `montadora_vai_fechar` | evento | 0,5% |
| `o_mural_do_boton` | evento | 0,5% |
| `mesa_cheia` | evento | 0,5% |
| `filial_fechando` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `circo_vai_embora` | evento | 0,5% |
| `feriado_na_praia` | evento | 0,5% |
| `cavalo_campeao` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 0,5% |
| `a_baba_foi_embora` | evento | 0,5% |
| `emprego_artes` | evento | 0,5% |
| `filho_apresenta_namoro` | npc | 0,5% |
| `quebra_de_safra` | evento | 0,5% |
| `noite_de_corridas` | evento | 0,5% |
| `padrinho_casamento` | npc | 0,4% |
| `fundacao` | jogada | 0,4% |
| `favor_do_presidente` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `aperto_do_mes` | evento | 0,4% |
| `carro_de_presente` | evento | 0,4% |
| `abrir_capital` | evento | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `startup_dos_ex_funcionarios` | evento | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `emprego_negocios` | evento | 0,4% |
| `obra_parada` | evento | 0,4% |
| `naturalizacao` | evento | 0,4% |
| `safra_recorde` | evento | 0,4% |
| `negocio_em_crise` | evento | 0,4% |
| `ministro_pede_ajuste` | evento | 0,4% |
| `plantao_que_nao_acaba` | evento | 0,4% |
| `regra_sob_medida` | evento | 0,4% |
| `concurso_em_brasilia` | evento | 0,4% |
| `proposta_pelo_negocio` | evento | 0,4% |
| `pais_envelhecem` | npc | 0,3% |
| `cozinha_da_fundacao` | evento | 0,3% |
| `fusao_de_iguais` | evento | 0,3% |
| `bonanca_no_governo` | evento | 0,3% |
| `tentar_a_vida_na_europa` | evento | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `pais_aposentados` | npc | 0,3% |
| `turno_extra_na_fabrica` | evento | 0,3% |
| `sequestro_frustrado` | evento | 0,3% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `filho_hamburgueria` | npc | 0,3% |
| `fazer_as_pazes` | acao | 0,3% |
| `carta_branca` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `importado_invadiu` | evento | 0,3% |
| `shopping_lotado` | evento | 0,3% |
| `assumir_a_fazenda` | evento | 0,3% |
| `aluguel_caro` | evento | 0,3% |
| `cargo_no_gabinete` | evento | 0,3% |
| `decreto_da_economia` | evento | 0,3% |
| `zona_franca` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `filho_pede_ajuda` | npc | 0,2% |
| `paparazzi_real` | evento | 0,2% |
| `caso_do_poderoso` | evento | 0,2% |
| `violencia_vira_manchete` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `reconciliacao` | npc | 0,2% |
| `cade_investiga` | evento | 0,2% |
| `fim_carreira` | evento | 0,2% |
| `passou_mal_de_novo` | npc | 0,2% |
| `filho_adolescente_porta` | npc | 0,2% |
| `ajudar_com_a_casa` | acao | 0,2% |
| `renegociar_cartao` | acao | 0,2% |
| `cliente_perdeu_tudo` | evento | 0,2% |
| `construtora_quebrou` | evento | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `escola_militar` | evento | 0,2% |
| `mansao_vazia` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `amor_planilha` | npc | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `parcela_da_tv` | npc | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,2% |
| `reencontro_amigo_brigado` | evento | 0,2% |
| `bonus_do_banco` | evento | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `ferias_coletivas` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `royalties_secaram` | evento | 0,2% |
| `amor_viaja_demais` | npc | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `festa_de_80` | acao | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `casamento_real` | evento | 0,1% |
| `as_criancas_perguntam` | npc | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `greve_geral` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `ameaca_de_sancao` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `oposicao_na_tv` | evento | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `queda_do_cargo` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `subsidiaria_esquecida` | evento | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `os_dois_lados` | evento | 0,1% |
| `conglomerado_com_desconto` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `ilha_particular` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `a_empresa_anda_sozinha` | evento | 0,0% |
| `mordomias_reais` | evento | 0,0% |
| `anos_depois_do_poder` | evento | 0,0% |
| `conselho_dos_generais` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `mensalidade_da_escola` | npc | 0,0% |
| `resultado_da_pesquisa` | evento | 0,0% |
| `hospital_da_fundacao` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `jubileu` | evento | 0,0% |
| `helicoptero_no_teto` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `grupo_na_capa` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `lancamento` | evento | 0,0% |
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

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 190 · **mudaram algo em pelo menos uma vida:** 191
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,2 · p10 51 · p25 59 · mediana 70 · p75 82 · p90 90

```
até 19                                        0,3%
20–29          █                              0,5%
30–39          █                              0,8%
40–49          ████████                       6,0%
50–59          ████████████████████████       18,6%
60–69          ██████████████████████████████ 23,7%
70–79          ██████████████████████████     20,7%
80–89          ███████████████████████        18,3%
90–99          ████████████                   9,3%
100+           ██                             1,8%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 277 mil · p25 R$ 902 mil · mediana R$ 4,3 milhões · p75 R$ 36 milhões · p90 R$ 165 milhões

```
negativo                                      0,8%
até 10 mil                                    0,4%
10–50 mil      █                              1,4%
50–200 mil     ███                            4,9%
200 mil–1 mi   ████████████                   19,0%
1–5 mi         ████████████████               25,4%
5 mi+          ██████████████████████████████ 48,0%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 76 · p90 86

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           4,9%
60–69          ███████████████                21,6%
70–79          ██████████████████████████████ 42,0%
80+            ██████████████████████         31,1%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,2 | R$ 1,3 milhão | 69,9 | 57,7 | 160,3 | 67,5 | 100% | 55% |
| cautelosa | 86,2 🏆 | R$ 59 milhões 🏆 | 77,8 | 69,8 | 204,9 | 78,0 | 100% | 64% |
| arriscada | 54,6 | R$ 2,8 milhões | 80,5 🏆 | 49,8 | 131,9 | 59,9 | 100% | 49% |
| aleatoria | 74,5 | R$ 1,9 milhão | 72,0 | 63,5 | 134,8 | 62,2 | 100% | 52% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,1% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,5% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,0% — de um AVC, numa terça-feira sem graça
- 6,9% — de pneumonia, depois de teimar que era só uma gripe
- 6,0% — numa cirurgia simples que não foi tão simples
- 5,6% — de velhice, dormindo, num domingo depois do almoço
- 5,5% — de complicações de uma queda no banheiro
- 5,3% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
