# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 582 eventos, 115 de personagens, 109 ações, 1625 escolhas, 239 linhas, 144 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3903114 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4459817 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 100,0% | R$ 45 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 16 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 592 mil |
| Custo de vida | o mercado | 99,9% | -R$ 627 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 5,5 milhões |
| Bico | o mercado | 99,3% | R$ 45 mil |
| Salário | o mercado | 97,7% | R$ 4 milhões |
| Juro da renda fixa | o governo | 91,2% | R$ 227 mil |
| Cotação dos investimentos | os preços | 87,6% | R$ 1,2 milhão |
| Imposto | o governo | 85,1% | -R$ 65 mil |
| Imposto mais baixo | o governo | 83,0% | R$ 61 mil |
| Auxílio | o governo | 82,2% | R$ 17 mil |
| Juros da dívida | o banco | 79,5% | -R$ 2,2 mil |
| Compras e vendas | o mercado | 73,9% | -R$ 1,7 milhão |
| Manutenção dos bens | o mercado | 73,9% | -R$ 618 mil |
| Gastos da velhice | o mercado | 63,0% | -R$ 1,2 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 4,4% | 5,0 | 4,4% | 2,0% | 0,0% | 2,8% |
| cautelosa | 0,0% | 1,7% | 0,0 | 1,7% | 0,0% | 0,0% | 0,0% |
| arriscada | 94,0% | 28,6% | 1,0 | 15,2% | 3,5% | 21,2% | 21,8% |
| aleatoria | 49,2% | 14,9% | 1,0 | 9,2% | 1,5% | 10,3% | 10,0% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,4% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,91 anos com acordo (651 vezes) × 2,87 sem (466 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 22,0% de 3581 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,7% das vidas; 14,0% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 41,4% | R$ 60 mil | 900 | 0 (0) | 1,6% | R$ 38 mil (5 vidas) |
| cautelosa | 99,4% | 7,1 | 59,0% | R$ 2,1 milhões | 18130 | 47 (30) | 1,9% | R$ 257 mil (18 vidas) |
| arriscada | 0,0% | — | 19,3% | R$ 6,1 mil | 182 | 218 (114) | 2,2% | R$ 698 (15 vidas) |
| aleatoria | 86,8% | 2,4 | 19,4% | R$ 22 mil | 3429 | 1723 (927) | 1,7% | R$ 3,3 mil (15 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 99,4%, arriscada 0,0%, aleatoria 86,8% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,9% (187 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 93 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 868 | R$ 3,7 milhões | 0,8 |
| parte dos impostos | 700 | R$ 2,1 bilhões | 0,7 |
| taxa da coroa | 247 | R$ 19 bilhões | 2,8 |

A ilha: 41 vidas fundaram ou herdaram uma. População no fim: p10 2186, mediana 2552, p90 3279.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 2,8 quedas por 100 anos com a taxa (247 anos) × 0,8 com o salário (868 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 41 ilhas; mediana de 2763 habitantes sem a taxa (29) e 1920 com 5 anos ou mais de taxa (5) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 171202 | -0,70 |
| regular | 342129 | -0,04 |
| prioridade | 192428 | +0,75 |

A tecnologia ao morrer: p10 42,3, mediana 49,9, p90 58,5. Descobertas por 100 vidas: a cura 16,5, o satélite 18,0, a patente 16,8; 28,7% das vidas veem uma. A fuga de cérebros: 25,8% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (171202 anos) · regular -0,04 por ano (342129 anos) · prioridade +0,75 por ano (192428 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,3 · mediana 49,9 · p90 58,5 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 28,7% das vidas; 90,7% de 5119 descobertas com a decisão de causa |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 22 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 1,97 ms | 2,2% | 32,5 KB | — | pais, pesquisa, poder, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 4,56 ms | 5,2% | 55,6 KB | exterior | pesquisa, economia, empresa, bens, tesouro, dividas, personagens, poder, iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,22 ms | 0,2% | 0,4 KB | pais | poder, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,60 ms | 0,7% | 18,5 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,54 ms | 1,8% | 29,4 KB | pais, mercado | empresa, bens, tesouro, dividas, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,36 ms | 0,4% | 3,4 KB | exterior, pais, pesquisa, mercado, economia | bens, tesouro, dividas, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 0,93 ms | 1,1% | 15,4 KB | pais, mercado, economia, empresa | tesouro, dividas, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,30 ms | 0,3% | 2,9 KB | pais, economia, empresa, bens | dividas, personagens, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,29 ms | 0,3% | 0,3 KB | pais, economia, empresa, bens, tesouro | personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,04 ms | 0,0% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,70 ms | 1,9% | 21,9 KB | pais, pesquisa, economia, empresa, bens, tesouro, dividas, privacao | personagens, trabalho, carreira, poder, coroa, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 2,87 ms | 3,3% | 44,7 KB | pais, economia, empresa, bens, tesouro, dividas, privacao, corpo | iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,19 ms | 0,2% | 2,1 KB | pais | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,31 ms | 0,4% | 1,9 KB | pais, corpo, trabalho | poder, coroa, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,71 ms | 0,8% | 3,9 KB | pais, pesquisa, economia, empresa, bens, tesouro, dividas, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,08 ms | 0,1% | 0,0 KB | pais, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,04 ms | 0,1% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,87 ms | 1,0% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,43 ms | 0,5% | 0,3 KB | pais, pesquisa, economia, empresa, bens, tesouro, dividas, privacao, corpo, personagens, trabalho, carreira, poder, coroa | iniciativas, diretor |
| amor (o amor que aparece) | 0,09 ms | 0,1% | 0,0 KB | corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 13,93 ms | 15,8% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 16,08 ms | 18,3% | 1,6 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 39,79 ms | 45,3% | — | — | — |

O save de uma vida (amostra de 1040): mediana 307 KB, p90 421 KB, máximo 514 KB; o livro é 97,1% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 514 KB (mediana 307 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 87,91 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 69,6% | 19,1% | 9,6% | 1,6% | 0,1% |

Entre as vidas com filhos (30,4%), a média é de 1,43 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 11,3% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 13,0% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 55,7% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 906 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,75 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 457,1 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 13,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,4% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,1% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,34 |
| Saturação V20 ≤ 95% | ✅ | 89,7% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 906 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 87,91 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 82,5% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 55,4% (168 dinastias, média de 3,2 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,83 (366 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 278 mil / R$ 392 mil / R$ 781 mil; p10 R$ 222 mil / R$ 196 mil / R$ 154 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 9,39% (p99 R$ 1,2 bilhão, maior R$ 147 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,20% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,6% de 57,5% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 17,0% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 89,7% |
| Assinaturas sem regressão (≥ 918) | ❌ | 906 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 457,1 |
| CPU por vida ≤ 30 ms | ❌ | 87,91 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 97,6% (9,5 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 76,3% de 3591 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (658), A festa do século (558), Pix para a cidade inteira (358), Uma estátua sua (268), Um conselho que diz não (213), Bancar um presidente (179), Uma fundação com seu nome (171), Uma equipe para desmontar (167), Trazer a Copa do Mundo (145), Tornar-se dispensável (134), Pagar a cura de uma doença (133), Um mural de problemas (132), Bancar quem quer sair (127), Um programa espacial (112), Fundar uma cidade (76), Comprar a estatal (75), Fundar um país (39), Uma colônia em Marte (28), Salvar o país da crise (18).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 3 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 41,2% de 1825 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 27,9% delegaram, 54,1% centralizaram (841 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 35,8% (28,7 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (719), Bancar quem quer sair (423), Uma equipe para desmontar (375), Um mural de problemas (350), Tornar-se dispensável (289).
- **Na morte de quem manda:** a empresa perde em média 24,9% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 7, maior 15 anos (7545 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 60,0% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 63,5% / 24,3% / 9,9% / 2,3% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,1 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,4%, o bloco liberal 24,5%, a aliança da ordem 24,6%, o centrão 24,6%; 8,4 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,70% × 1,84%); ✓ dívida menor com a aliança da ordem que com o centrão (70% × 84% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,32% contra 0,73% por ano (38637 e 54439 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,57 votos por vida, 31,5% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,84 × 0,62 pontos do PIB por ano (91 e 205 governos); 95,9% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,1% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 202.072 | 1,8% | 8,2% | 5,2% | 82% | 21,0% | 20,4 | 58 | 55 | 51% |
| o centrão | 187.946 | 2,1% | 8,3% | 5,1% | 84% | 25,1% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 187.805 | 1,7% | 8,3% | 5,8% | 70% | 29,4% | 17,6 | 50 | 45 | 52% |
| o bloco liberal | 187.057 | 2,7% | 8,5% | 4,6% | 80% | 29,5% | 22,1 | 43 | 50 | 51% |
| o regime | 8.914 | 1,0% | 9,5% | 5,3% | 30% | 32,1% | 17,2 | 37 | 37 | 45% |
| quem joga | 6.338 | 2,1% | 8,3% | 5,4% | 77% | 25,7% | 19,6 | 53 | 51 | 54% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,7% de 6748 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,7% fundiram, 6,3% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 2530 (p99 480) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,36 ponto em média (28537 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,36 na bolsa (8559 empresas-ano) × -0,00 fechadas (106356) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,5% de 37405 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,11 · mediana R$ 5,09 · p90 R$ 6,35 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,36 no agro (3870 empresas-ano) × -0,30 no comércio (29699), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 25,3%, acordo em 71,7%; 98,3% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 86,8% de 3406 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,19% × 0,10% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,67% × 0,31% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 68,2% de 318 governos; sanção depois de romper 35,2%, depois da visita 1,2% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 202.072 | 0,18% | 2,33% |
| o centrão | 187.946 | 0,10% | 0,56% |
| a aliança da ordem | 187.805 | 1,21% | 0,31% |
| o bloco liberal | 187.057 | 0,20% | 3,67% |
| o regime | 8.914 | 2,28% | 0,01% |
| quem joga | 6.338 | 0,14% | 7,29% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,530, população 194 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,799–0,867, Gini 0,483–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 10,4% · desigualdade_no_jornal 9,0% · idh_muito_alto 13,6% · idh_em_queda 5,9% · pais_envelhece 13,7% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,799 | 0,830 | 0,867 |
| Desigualdade (Gini) | 0,483 | 0,530 | 0,561 |
| População (milhões) | 179 | 194 | 207 |
| PIB per capita | R$ 119 mil | R$ 248 mil | R$ 568 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 55,7% / 89,7% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 63,4% |
| Efeito da memória (aleatória, V5 sem → com memória) | 59,7% → 53,2% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 906 (589) |
| Mobilidade: mesmo quintil da origem ao fim | 27,0% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,34 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,4% / 3,1% |
| Patrimônio p90/p10 | 684,9× (p10 R$ 270 mil, p90 R$ 185 milhões) |
| Desvio-padrão da felicidade média da vida | 8,75 |
| Vidas com patrimônio negativo ao morrer | 0,7% |
| Mudanças de estado causadas pelo jogador | 44,3% |
| Toques por vida | 457,1 |
| Tempo de CPU por vida | 87,91 ms |
| Ações (fichas usadas) por vida | 159,1 |
| Mortes na família por vida | 3,9 |
| Pontos de virada que vêm do mundo (não do jogador) | 13,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 25,6 |
| Vidas que terminam com filho ou filha para continuar | 82,5% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,2 / 55,4% / 33,3% |
| Idade de quem herda ao começar (mediana) / herança mediana | 35 anos / R$ 6,5 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,83 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 57,5% |
| Entre quem abriu: quebrou / vendeu | 28,6% / 26,4% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 1,9 milhão / R$ 91 milhões / R$ 1,2 bilhão / R$ 147 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 30,80% / 9,39% / 1,20% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 17,0% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 60,5 / 159,1 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 222 mil | R$ 278 mil | R$ 330 mil |
| moderado | R$ 196 mil | R$ 392 mil | R$ 675 mil |
| arrojado | R$ 154 mil | R$ 781 mil | R$ 2,8 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 834 | R$ 169 mil | R$ 1,4 milhão | R$ 40 milhões |
| moderado | 934 | R$ 153 mil | R$ 1,7 milhão | R$ 27 milhões |
| arrojado | 732 | R$ 153 mil | R$ 1,8 milhão | R$ 52 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 65,2 | R$ 1,3 milhão | 75,5 |
| pobre | 104 | 71,4 | R$ 2,5 milhões | 75,8 |
| remediada | 24 | 70,8 | R$ 804 mil | 78,3 |
| media | 64 | 71,8 | R$ 1,9 milhão | 74,4 |
| rica | 64 | 68,7 | R$ 7,1 milhões | 76,0 |
| muito rica | 144 | 70,2 | R$ 20 milhões | 75,8 |
| bilionaria | 356 | 69,9 | R$ 2,3 bilhões | 76,8 |
| trilionaria | 276 | 71,4 | R$ 1,1 trilhão | 78,0 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 24% / 10% / 2% |
| Notícias do país por vida | 41,6 |
| Demissões por vida / vindas de uma recessão ou crise | 0,52 / 32,1% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 46% · serviços 15% · saúde 13% · cultura e internet 7% · transporte e entregas 5% · comércio 4% · agro 3% · construção 2% · tecnologia 2% · indústria 1% · sem setor 1% · finanças 1% · educação 1% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 21% | 34% | 46% | 56% | 78% | 85% | 90% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 23% | 16% | 15% | 14% |
| Q2 | 29% | 23% | 18% | 15% | 16% |
| Q3 | 24% | 24% | 19% | 18% | 14% |
| Q4 | 13% | 24% | 27% | 22% | 15% |
| Q5 | 3% | 7% | 20% | 30% | 40% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,7 | R$ 1,7 milhão | 74,8 |
| família pobre | 24% | 70,3 | R$ 1,5 milhão | 75,0 |
| família remediada | 20% | 71,2 | R$ 1,9 milhão | 75,1 |
| classe média | 18% | 70,2 | R$ 2,7 milhões | 74,8 |
| família rica | 13% | 70,8 | R$ 6,3 milhões | 75,1 |
| família muito rica | 13% | 70,4 | R$ 25 milhões | 75,7 |
| família bilionária | 3% | 69,9 | R$ 2,1 bilhões | 77,1 |

## Repetição

- **Dentro de uma vida:** 7,6% das aparições repetem uma instância já vista na mesma vida; pior vida: 25,8%.
- **Texto repetido entre vidas:** 29,2% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 2,8 · `aposentadoria` 1,5 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,3 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,1

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 131 de 288 (45%) · típico 130 de 288 (45%) · rico 144 de 288 (50%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `mais_um_filho`, `cobranca_da_magoa`, `cobranca_do_filho`, `amor_vai_embora`, `olimpiada_do_instituto`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `fazer_as_pazes`, `ajudar_com_a_casa`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `renegociar_cartao`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `colonia_em_marte`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `chegada_em_marte`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `receita_no_seu_pe`, `segundo_foguete`, `mensagem_de_marte`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `noite_de_corridas`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 60,5 · **com causa anterior (cadeia):** 69,3 · **maior distância causa→consequência:** 48,3 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,9% |
| `namoro` | evento | 99,1% |
| `luto` | npc | 97,2% |
| `enem` | evento | 94,0% |
| `primeiro_voto` | evento | 83,5% |
| `trabalho_grande` | acao | 74,4% |
| `programa_junto` | acao | 71,0% |
| `aposentadoria` | evento | 62,5% |
| `correr_no_quintal` | acao | 60,6% |
| `bico_adulto` | acao | 60,5% |
| `cuidar_da_doenca` | npc | 58,5% |
| `ler_gibi` | acao | 58,1% |
| `parquinho` | acao | 57,5% |
| `formatura` | evento | 56,7% |
| `eleicao_geral` | evento | 55,5% |
| `saudade_de_voce` | npc | 55,1% |
| `conversar_de_verdade` | acao | 55,1% |
| `almoco_domingo` | acao | 54,7% |
| `tocar_empresa` | acao | 50,0% |
| `ligar_amigo` | acao | 49,7% |
| `curso_online` | acao | 49,5% |
| `pos_graduacao` | acao | 49,3% |
| `mochilao` | acao | 49,3% |
| `pedir_conselho` | acao | 49,2% |
| `presente_certo` | acao | 48,9% |
| `avo_mesada_escondida` | npc | 48,7% |
| `visitar_familia` | acao | 48,3% |
| `dizer_umas_verdades` | acao | 44,5% |
| `viagem_la_para_fora` | evento | 44,2% |
| `estudar_concurso` | acao | 43,3% |
| `correr` | acao | 43,0% |
| `reclama_que_voce_sumiu` | npc | 42,5% |
| `primeiro_emprego` | evento | 41,8% |
| `doente_crianca` | npc | 41,7% |
| `baile_terceira_idade` | acao | 41,1% |
| `vontade_ver_o_mar` | npc | 41,1% |
| `pedir_um_pix` | acao | 41,0% |
| `demissao` | evento | 39,9% |
| `perdeu_emprego_na_crise` | npc | 39,0% |
| `academia` | acao | 38,9% |
| `ler_livros` | acao | 37,0% |
| `estudar_escola` | acao | 36,7% |
| `balde_da_pracinha` | evento | 36,5% |
| `falando_bem_de_voce` | npc | 36,5% |
| `primeiro_investimento` | evento | 36,3% |
| `ouvir_historia` | acao | 35,9% |
| `creche_ou_vo` | evento | 34,6% |
| `amigo_em_apuros` | npc | 34,6% |
| `pre_escola` | evento | 34,3% |
| `paquerar` | acao | 34,0% |
| `estudar_enem` | acao | 33,9% |
| `rabiscar_parede` | acao | 33,1% |
| `primeiro_beijo` | evento | 32,9% |
| `acidente_em_casa` | evento | 32,9% |
| `cuidar_de_doente` | acao | 32,9% |
| `bullying_recreio` | evento | 32,7% |
| `perguntar_porque` | acao | 31,7% |
| `copa_do_mundo` | evento | 31,3% |
| `videogame_do_amigo` | acao | 30,7% |
| `viagem_dos_sonhos` | evento | 30,2% |
| `estudar_tabuada` | acao | 29,6% |
| `vontade_viagem_com_amigo` | npc | 29,2% |
| `amor_quer_casar` | npc | 28,7% |
| `banda_garagem` | evento | 28,5% |
| `natacao_no_clube` | acao | 28,3% |
| `salario_em_dolar` | evento | 28,2% |
| `historias_ou_telas` | evento | 28,2% |
| `caminhada` | acao | 28,1% |
| `ajudar_em_casa` | acao | 27,6% |
| `vape_festa` | evento | 27,6% |
| `colesterol_alto` | evento | 27,5% |
| `bilhete_carinhoso` | npc | 27,3% |
| `festa_80` | evento | 27,0% |
| `filho` | npc | 26,8% |
| `investir_tesouro` | acao | 26,8% |
| `piada_no_grupo` | npc | 26,5% |
| `cachorro_caramelo` | evento | 26,5% |
| `estudar_faculdade` | acao | 26,2% |
| `filho_adolescente` | evento | 26,1% |
| `pedir_desculpas` | acao | 26,0% |
| `vontade_voltar_a_terra` | npc | 26,0% |
| `visitar_o_tumulo` | acao | 25,7% |
| `primeiro_celular` | evento | 25,7% |
| `check_up` | acao | 25,6% |
| `curso_nota_alta` | evento | 25,6% |
| `pelada` | acao | 25,2% |
| `carro` | evento | 25,2% |
| `casamento` | npc | 25,2% |
| `amigo_pede_dinheiro` | evento | 25,2% |
| `oportunidade_de_negocio` | evento | 25,1% |
| `vacina_no_posto` | evento | 25,1% |
| `golpe_pix` | evento | 24,9% |
| `perdeu_aniversario` | npc | 24,7% |
| `festa_tema` | evento | 24,7% |
| `show_no_estadio` | acao | 24,4% |
| `viagem_realizada` | evento | 24,4% |
| `doar_sangue` | evento | 24,2% |
| `guardar_dinheiro` | acao | 24,2% |
| `hidro_com_a_turma` | acao | 23,9% |
| `investimento_furado` | evento | 23,6% |
| `bet` | evento | 23,6% |
| `festa_junina` | evento | 23,3% |
| `esperou_por_voce` | npc | 23,3% |
| `pelada_de_quinta` | evento | 23,1% |
| `criptomoeda` | evento | 22,9% |
| `esporte_depois_da_aula` | evento | 22,9% |
| `tempo_com_amor` | acao | 22,8% |
| `largar_tudo` | evento | 22,7% |
| `crise_la_fora` | evento | 22,6% |
| `emprego_saude` | evento | 22,2% |
| `vontade_de_um_bicho` | npc | 22,2% |
| `voltar_a_estudar` | acao | 22,1% |
| `avo_conta_historias` | npc | 22,0% |
| `bico_adolescente` | acao | 21,7% |
| `previdencia` | acao | 21,6% |
| `rebalancear` | acao | 21,5% |
| `reforma_da_casa` | evento | 21,0% |
| `pensar_em_adotar` | evento | 20,7% |
| `primeira_palavra` | evento | 20,7% |
| `proposta_na_expansao` | evento | 20,6% |
| `data_da_partida` | evento | 20,6% |
| `viajar_com_o_amigo` | acao | 20,4% |
| `cozinhar_com_a_avo` | acao | 20,4% |
| `cortar_gastos` | acao | 20,3% |
| `hora_extra` | acao | 20,3% |
| `festa_da_cidade` | acao | 20,2% |
| `tatuagem` | evento | 20,2% |
| `casa_dos_pais` | evento | 20,0% |
| `vaquinha_do_vizinho` | evento | 20,0% |
| `bolao_do_trabalho` | evento | 19,9% |
| `encontro` | acao | 19,8% |
| `filho_formatura` | evento | 19,7% |
| `futebol_de_varzea` | acao | 19,7% |
| `cursinho_pago` | acao | 19,4% |
| `feira_ciencias` | evento | 19,3% |
| `mesada` | evento | 19,3% |
| `juros_compostos` | evento | 19,1% |
| `sair_de_casa` | evento | 19,0% |
| `subir_de_padrao` | evento | 18,9% |
| `hobby_horta` | evento | 18,9% |
| `pede_ajuda` | npc | 18,5% |
| `desempregado` | evento | 18,4% |
| `catapora` | evento | 18,4% |
| `reencontro_da_turma` | evento | 18,3% |
| `vizinho_barulhento` | evento | 18,3% |
| `heranca_do_tio` | evento | 17,7% |
| `franquia` | evento | 17,5% |
| `festa_sem_pais` | evento | 17,4% |
| `pai_ausente_volta` | npc | 17,4% |
| `bateu_o_carro` | evento | 17,4% |
| `orgulho_da_formatura` | npc | 17,3% |
| `primeiro_cupom` | evento | 17,3% |
| `moeda_digital` | evento | 16,9% |
| `assalto_na_rua` | evento | 16,9% |
| `vender_doce` | acao | 16,6% |
| `entregas` | acao | 16,5% |
| `voltar_estudar` | evento | 16,4% |
| `empresa_quebrou` | evento | 16,1% |
| `leu_antes_dos_colegas` | evento | 16,0% |
| `curso_nota_media` | evento | 15,8% |
| `fome_no_fim_do_mes` | evento | 15,8% |
| `fazenda_a_venda` | evento | 15,6% |
| `amigo_devolve` | npc | 15,4% |
| `ceu_de_fumaca` | evento | 15,3% |
| `bloco_de_carnaval` | evento | 15,1% |
| `festa_de_sao_joao` | evento | 15,0% |
| `cripto_fomo` | evento | 14,9% |
| `casa_propria` | evento | 14,9% |
| `mudar_para_a_praia` | evento | 14,9% |
| `ingles_crianca` | acao | 14,9% |
| `carteira_da_diarista` | evento | 14,5% |
| `hidroginastica` | evento | 14,3% |
| `cirurgia_de_catarata` | evento | 14,2% |
| `baile_da_terceira_idade` | evento | 14,1% |
| `corte_de_salario` | evento | 14,0% |
| `entregador_chuva` | evento | 13,9% |
| `dolar_barato` | evento | 13,9% |
| `reencontro_amigo` | evento | 13,9% |
| `alavancagem` | evento | 13,8% |
| `reuniao_de_condominio` | evento | 13,8% |
| `pais_envelhece` | evento | 13,7% |
| `imposto_alto_no_contracheque` | evento | 13,7% |
| `investimento_rotina` | evento | 13,7% |
| `idh_muito_alto` | evento | 13,6% |
| `pisa_em_ovos` | npc | 13,6% |
| `aula_de_musica` | evento | 13,5% |
| `imovel_valorizou` | evento | 13,3% |
| `brigas_de_madrugada` | evento | 13,3% |
| `convite_para_palestrar` | evento | 13,3% |
| `vaga_sobrando` | evento | 13,3% |
| `levar_ao_mar` | acao | 13,3% |
| `multa_e_batida` | evento | 13,2% |
| `peneira` | evento | 13,1% |
| `parar_de_fumar` | acao | 12,9% |
| `sovina_ou_sabio` | evento | 12,8% |
| `quarto_dividido` | evento | 12,7% |
| `maratona` | evento | 12,7% |
| `convite_do_luxo` | evento | 12,7% |
| `imposto_baixo_sobrou` | evento | 12,6% |
| `escrever_memorias` | evento | 12,5% |
| `alugueis_dos_fundos` | evento | 12,4% |
| `mais_um_filho` | npc | 12,3% |
| `casa_cheia` | evento | 12,2% |
| `separacao` | evento | 12,2% |
| `promocao` | evento | 12,1% |
| `bolsa_de_estudos` | evento | 12,0% |
| `juros_altos_rendendo` | evento | 11,9% |
| `bolsa_la_fora` | evento | 11,9% |
| `golpe_do_falso_neto` | evento | 11,8% |
| `feira_de_ciencias` | evento | 11,7% |
| `casa_na_praia` | evento | 11,7% |
| `compra_por_impulso` | evento | 11,7% |
| `separacao_dos_pais` | evento | 11,7% |
| `balcao_negocio` | acao | 11,6% |
| `concorrente_gigante` | evento | 11,6% |
| `aniversario_da_infancia` | evento | 11,5% |
| `peito_chiando` | evento | 11,3% |
| `produto_viralizou` | evento | 11,3% |
| `casamento_na_igreja` | npc | 11,2% |
| `a_vacina_no_posto` | evento | 11,2% |
| `rua_tranquila` | evento | 11,1% |
| `cofrinho` | acao | 11,1% |
| `testamento` | evento | 11,1% |
| `negocio_no_aperto` | evento | 11,0% |
| `vontade_ver_o_neto` | npc | 10,9% |
| `gerente_do_banco` | evento | 10,8% |
| `praia` | acao | 10,8% |
| `consorcio` | evento | 10,7% |
| `greve_dos_onibus` | evento | 10,7% |
| `pobreza_na_porta` | evento | 10,7% |
| `recomecar_amor` | acao | 10,7% |
| `esporte_escola` | acao | 10,6% |
| `pib_recorde` | evento | 10,4% |
| `briga_em_casa` | npc | 10,4% |
| `assalto_no_onibus` | evento | 10,4% |
| `surpresa_do_amor` | npc | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,4% |
| `cartao_credito` | evento | 10,3% |
| `socio_sumiu` | evento | 10,2% |
| `bolsa_subiu_sem_voce` | evento | 10,1% |
| `apartamento_na_planta` | evento | 10,1% |
| `juros_baixos_euforia` | evento | 9,9% |
| `padrao_de_vida` | evento | 9,9% |
| `chefe_novo` | evento | 9,9% |
| `retiro_da_igreja` | evento | 9,8% |
| `tempo_com_filho` | acao | 9,8% |
| `olimpiada_matematica` | evento | 9,8% |
| `queda` | evento | 9,8% |
| `cheia_do_rio` | evento | 9,7% |
| `seca_no_sertao` | evento | 9,6% |
| `role` | acao | 9,5% |
| `comer_tudo` | acao | 9,5% |
| `colo_da_avo` | acao | 9,4% |
| `voce_mudou` | npc | 9,4% |
| `mudanca_de_escola` | evento | 9,4% |
| `estatua` | jogada | 9,3% |
| `ressaca_do_mar` | evento | 9,3% |
| `brincar_com_o_pai` | acao | 9,2% |
| `chimarrao` | acao | 9,1% |
| `crise_40` | evento | 9,1% |
| `titulo_eleitor` | evento | 9,1% |
| `pousada_na_praia` | evento | 9,0% |
| `investidor_anjo` | evento | 9,0% |
| `fugir_inflacao` | acao | 9,0% |
| `dolar_disparou` | evento | 9,0% |
| `desigualdade_no_jornal` | evento | 9,0% |
| `festa_surpresa` | evento | 8,9% |
| `sao_joao` | acao | 8,9% |
| `edital_de_cultura` | evento | 8,9% |
| `aposentadoria_ativa` | evento | 8,9% |
| `fundo_da_familia` | npc | 8,8% |
| `conteudo_extra` | acao | 8,8% |
| `atendimento_robo` | evento | 8,8% |
| `brincar_na_rua` | acao | 8,8% |
| `dente_de_leite` | evento | 8,7% |
| `remorso_aperta` | evento | 8,6% |
| `filho_desenho` | npc | 8,5% |
| `noite_de_stand_up` | evento | 8,5% |
| `ouvido_para_musica` | evento | 8,4% |
| `festival_do_boi` | evento | 8,4% |
| `amor_proposta_fora` | npc | 8,4% |
| `levar_a_terra_natal` | acao | 8,4% |
| `ponto_comercial` | evento | 8,4% |
| `inquilino_dos_sonhos` | evento | 8,3% |
| `cripto_disparou` | evento | 8,3% |
| `festa_de_15` | evento | 8,2% |
| `inquilino_sumiu` | evento | 8,1% |
| `blitz_toda_noite` | evento | 8,1% |
| `apagao_no_morro` | evento | 8,1% |
| `cidadania_italiana` | evento | 8,1% |
| `tocar_no_bar` | acao | 8,0% |
| `boi_bumba` | acao | 8,0% |
| `ciumes_do_irmao` | evento | 8,0% |
| `brincar_amigos` | acao | 8,0% |
| `amor_piada_interna` | npc | 7,7% |
| `pressao_alta` | evento | 7,6% |
| `passear_de_carrinho` | acao | 7,6% |
| `vicio_aposta` | evento | 7,6% |
| `geladeira_vazia` | evento | 7,5% |
| `desemprego_em_alta` | evento | 7,5% |
| `pular_corda` | acao | 7,5% |
| `mei_negocio` | evento | 7,4% |
| `geada_no_sul` | evento | 7,3% |
| `fiscalizacao` | evento | 7,3% |
| `herdeiro_gastao` | evento | 7,3% |
| `estatua_pichada` | evento | 7,2% |
| `enchente_na_rua` | evento | 7,2% |
| `figurinha_repetida` | acao | 7,1% |
| `family_office` | evento | 6,9% |
| `soltar_pipa` | acao | 6,9% |
| `inflacao_no_mercado` | evento | 6,8% |
| `grupo_de_jovens` | evento | 6,8% |
| `piramide_no_grupo` | npc | 6,6% |
| `merenda` | evento | 6,6% |
| `filho_imitacao` | npc | 6,6% |
| `assembleia_do_predio` | evento | 6,5% |
| `concurso_lotado` | evento | 6,5% |
| `adocao_chegou` | evento | 6,5% |
| `pescaria_no_pantanal` | evento | 6,5% |
| `faculdade_vida` | evento | 6,5% |
| `asma_na_educacao_fisica` | evento | 6,4% |
| `luto_do_bicho` | npc | 6,2% |
| `cripto_de_novo` | acao | 6,2% |
| `briga_dos_pais` | evento | 6,2% |
| `plantao_lotado` | evento | 6,2% |
| `propina_da_empreiteira` | evento | 6,2% |
| `auxilio_na_conta` | evento | 6,2% |
| `festa_do_seculo` | jogada | 6,0% |
| `o_que_pensa_de_voce` | npc | 6,0% |
| `idh_em_queda` | evento | 5,9% |
| `vender_doce_nato` | acao | 5,8% |
| `moto_na_chuva` | evento | 5,8% |
| `crise_de_ansiedade` | evento | 5,8% |
| `proposta_de_compra` | evento | 5,8% |
| `mutirao_de_cirurgias` | evento | 5,8% |
| `doenca_de_quem_ama` | evento | 5,8% |
| `bico_na_expansao` | evento | 5,8% |
| `show_no_bar` | evento | 5,8% |
| `vo_receita` | evento | 5,8% |
| `festa_vazou` | evento | 5,7% |
| `chaves_do_apartamento` | evento | 5,7% |
| `vo_partiu` | npc | 5,7% |
| `escola_publica_boa` | evento | 5,7% |
| `cobranca_do_casamento` | npc | 5,7% |
| `nome_sujo` | evento | 5,6% |
| `ano_de_prejuizo` | evento | 5,6% |
| `burnout_empresa` | evento | 5,5% |
| `festival_lotado` | evento | 5,5% |
| `la_fora_comprando` | evento | 5,5% |
| `filho_nao_veio` | npc | 5,4% |
| `pais_separados_natal` | evento | 5,3% |
| `amigo_muda_de_cidade` | npc | 5,3% |
| `escola_de_samba` | jogada | 5,3% |
| `socio_da_patente` | evento | 5,3% |
| `convite_do_partido` | evento | 5,3% |
| `operacao_policial` | evento | 5,2% |
| `obra_grande_no_norte` | evento | 5,2% |
| `bolsa_derreteu` | evento | 5,2% |
| `netos` | evento | 5,1% |
| `tarifa_do_app` | evento | 5,1% |
| `briga_na_cozinha` | evento | 5,1% |
| `paquerar_timido` | acao | 5,1% |
| `namorar_depois_dos_60` | evento | 5,1% |
| `viralizou` | evento | 5,0% |
| `promessa_da_mae` | evento | 4,9% |
| `greve_do_servidor` | evento | 4,9% |
| `imposto_sobre_fortunas` | evento | 4,8% |
| `natal_com_politica` | evento | 4,8% |
| `olimpiada` | acao | 4,8% |
| `pais_na_crise` | npc | 4,8% |
| `votacao_polemica` | evento | 4,8% |
| `fundacao_com_seu_nome` | evento | 4,8% |
| `so_aparece_por_dinheiro` | npc | 4,7% |
| `cripto_derreteu` | evento | 4,7% |
| `vontade_casa_propria` | npc | 4,6% |
| `blindar_contas` | acao | 4,6% |
| `intercambio_pago` | evento | 4,6% |
| `curso_nota_baixa` | evento | 4,6% |
| `processo_trabalhista` | evento | 4,6% |
| `vereador` | evento | 4,5% |
| `mutirao_da_laje` | evento | 4,5% |
| `sociedade_amigo` | evento | 4,5% |
| `fim_do_amor` | npc | 4,4% |
| `primeiro_funcionario` | evento | 4,4% |
| `excursao_ao_mar` | acao | 4,4% |
| `posto_que_funciona` | evento | 4,3% |
| `crescer_devagar` | evento | 4,3% |
| `fiador` | npc | 4,3% |
| `joelho_da_pelada` | evento | 4,3% |
| `tosse_cronica` | evento | 4,3% |
| `cachoeira` | acao | 4,2% |
| `festa_surpresa_para` | npc | 4,2% |
| `trabalho_do_pai` | acao | 4,2% |
| `bater_o_pe_com_o_chefe` | evento | 4,1% |
| `cobranca_de_notas` | npc | 4,1% |
| `heranca` | evento | 4,1% |
| `agro_na_cidade` | evento | 4,0% |
| `comecar_terapia` | evento | 4,0% |
| `funcionario_genial` | evento | 4,0% |
| `confeitaria_da_vo` | evento | 3,9% |
| `conselho_que_diz_nao` | jogada | 3,9% |
| `satelite_na_tv` | evento | 3,9% |
| `clinica_particular_contrata` | evento | 3,9% |
| `prova_concurso` | evento | 3,8% |
| `este_e_o_ano` | evento | 3,8% |
| `filho_cuida` | npc | 3,8% |
| `mae_quer_morar_junto` | npc | 3,8% |
| `acordo_abriu_mercado` | evento | 3,8% |
| `cursinho_comunitario` | evento | 3,8% |
| `pescaria_no_rio` | evento | 3,8% |
| `compativel_para_medula` | evento | 3,8% |
| `aprovado_concurso_estudo` | evento | 3,8% |
| `fila_do_posto` | evento | 3,7% |
| `olimpiada_do_instituto` | evento | 3,6% |
| `emprestimo_ao_irmao` | evento | 3,6% |
| `saudade_de_la` | evento | 3,6% |
| `balcao_de_crianca` | evento | 3,5% |
| `balcao_da_familia` | evento | 3,5% |
| `escolheu_bem` | npc | 3,5% |
| `convite_para_candidatura` | evento | 3,5% |
| `convite_igreja` | npc | 3,5% |
| `amigo_sumiu_e_voltou` | npc | 3,4% |
| `casamento_do_filho` | evento | 3,4% |
| `filho_saude_fragil` | npc | 3,4% |
| `tentar_outra_cidade` | evento | 3,3% |
| `um_bicho_para_o_filho` | acao | 3,3% |
| `vaga_na_capital` | evento | 3,2% |
| `aposentadoria_nao_da` | npc | 3,2% |
| `greve_dos_professores` | evento | 3,2% |
| `governo_que_voce_elegeu_frente_popular` | evento | 3,2% |
| `amor_quer_mudar_de_carreira` | npc | 3,2% |
| `assumir_negocio` | evento | 3,2% |
| `depois_do_cargo` | evento | 3,2% |
| `apresentacao_para_a_diretoria` | evento | 3,0% |
| `faculdade_depois_dos_60` | npc | 3,0% |
| `dolar_virou_salario` | evento | 3,0% |
| `importado_ficou_caro` | evento | 2,9% |
| `ajudar_na_roca` | acao | 2,9% |
| `alguem_especial` | evento | 2,9% |
| `mensalidade_da_escola` | npc | 2,9% |
| `ainda_mora_com_pais` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `proposta_sao_paulo` | evento | 2,9% |
| `reajuste_dos_servidores` | evento | 2,8% |
| `ferias_do_dono` | evento | 2,8% |
| `clientes_sumiram` | evento | 2,8% |
| `carregar_a_geladeira` | evento | 2,8% |
| `rodada_grande` | evento | 2,8% |
| `joias_no_cofre` | evento | 2,8% |
| `plano_de_saude_subiu` | evento | 2,8% |
| `depois_da_venda` | evento | 2,8% |
| `birra_no_mercado` | evento | 2,7% |
| `nao_acredita_mais` | npc | 2,7% |
| `emprego_tecnologia` | evento | 2,7% |
| `surto_no_bairro` | evento | 2,7% |
| `volta_terra` | evento | 2,7% |
| `carona_de_madrugada` | npc | 2,7% |
| `crianca_ansiosa` | evento | 2,7% |
| `shows_cancelados` | evento | 2,6% |
| `netos_nas_ferias` | evento | 2,6% |
| `recaida_cigarro` | evento | 2,6% |
| `crise_no_setor` | evento | 2,5% |
| `bancar_quem_sai` | jogada | 2,5% |
| `reencontro_paixao` | evento | 2,5% |
| `terapia` | acao | 2,5% |
| `juros_altos` | evento | 2,5% |
| `expandir_na_alta` | evento | 2,5% |
| `cancelado` | evento | 2,5% |
| `gravidez_surpresa` | npc | 2,5% |
| `gorjeta_boa` | evento | 2,4% |
| `obra_ou_hospital` | evento | 2,4% |
| `obra_do_predio` | evento | 2,4% |
| `programa_de_moradia` | evento | 2,4% |
| `filho_passou_longe` | npc | 2,4% |
| `enchente_na_cidade` | evento | 2,4% |
| `filho_quer_carro` | evento | 2,3% |
| `briga_por_heranca` | evento | 2,3% |
| `filho_primeiro_salario` | npc | 2,3% |
| `duas_empresas_uma_agenda` | evento | 2,3% |
| `arrojado_na_queda` | evento | 2,3% |
| `seguranca_particular` | evento | 2,2% |
| `ferias_com_a_familia_do_amor` | npc | 2,2% |
| `hospital_sem_insumo` | evento | 2,2% |
| `escola_integral` | evento | 2,2% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,1% |
| `cidadania_do_bisavo` | evento | 2,1% |
| `missa_em_familia` | acao | 2,0% |
| `bodas_de_prata` | evento | 2,0% |
| `emprestimo_de_volta` | evento | 2,0% |
| `renegociar_divida` | evento | 2,0% |
| `carreira_futebol` | evento | 2,0% |
| `conselho_de_fachada` | evento | 2,0% |
| `black_friday` | evento | 2,0% |
| `dizimo` | evento | 1,9% |
| `passear_pet` | acao | 1,9% |
| `ajudar_na_coleta` | evento | 1,9% |
| `imovel_na_baixa` | evento | 1,9% |
| `fronteira_fechada` | evento | 1,9% |
| `padrao_aperta` | evento | 1,8% |
| `segundo_carro` | evento | 1,8% |
| `lesao_grave` | evento | 1,8% |
| `mural_de_problemas` | jogada | 1,8% |
| `time_a_venda` | evento | 1,8% |
| `governo_que_voce_elegeu_centrao` | evento | 1,8% |
| `sair_de_casa_cedo` | evento | 1,8% |
| `reforma_sem_fim` | evento | 1,7% |
| `paparazzi` | evento | 1,7% |
| `visitar_de_longe` | acao | 1,7% |
| `irmaos_brigam` | evento | 1,7% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,7% |
| `convite_para_o_palco_grande` | evento | 1,7% |
| `presidir_cpi` | evento | 1,7% |
| `amigo_lembra_zoeira` | npc | 1,7% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,7% |
| `calote_no_noticiario` | evento | 1,6% |
| `frete_sumiu` | evento | 1,6% |
| `cuidar_netos` | acao | 1,6% |
| `oferece_ajuda` | npc | 1,6% |
| `cara_de_comercial` | evento | 1,5% |
| `vida_depois_da_condenacao` | evento | 1,5% |
| `apuracao_do_carnaval` | evento | 1,5% |
| `lembranca_primeiro_amor` | evento | 1,5% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,5% |
| `divida_publica_assusta` | evento | 1,5% |
| `proposta_da_europa` | evento | 1,5% |
| `promocao_em_outra_cidade` | evento | 1,5% |
| `pai_namorando_de_novo` | npc | 1,5% |
| `acoes_da_startup` | evento | 1,4% |
| `hit_viral` | evento | 1,4% |
| `amor_paga_a_conta` | npc | 1,4% |
| `ocorrencia_perigosa` | evento | 1,4% |
| `dez_anos_de_empresa` | evento | 1,4% |
| `pane_no_voo` | evento | 1,3% |
| `equipe_para_desmontar` | jogada | 1,3% |
| `contrato_publicitario` | evento | 1,3% |
| `familia_descobre_o_testamento` | evento | 1,3% |
| `emprego_educacao` | evento | 1,3% |
| `retirada_demais` | evento | 1,3% |
| `chefe_amigo` | evento | 1,3% |
| `bolsa_de_iniciacao` | evento | 1,3% |
| `tocar_o_negocio` | acao | 1,3% |
| `amor_quadro_de_tarefas` | npc | 1,3% |
| `cobranca_do_filho` | npc | 1,3% |
| `salario_parcelado` | evento | 1,2% |
| `critico_no_salao` | evento | 1,2% |
| `briga_de_casal` | npc | 1,2% |
| `foto_de_campanha` | evento | 1,2% |
| `nao_para_quieto` | evento | 1,2% |
| `filho_cuida_de_voce` | npc | 1,2% |
| `grade_na_janela` | evento | 1,2% |
| `nega_ajuda` | npc | 1,1% |
| `o_conselho_vetou` | evento | 1,1% |
| `amigo_pede_de_novo` | npc | 1,1% |
| `amigo_ficou_rico` | npc | 1,1% |
| `embaixador_pede` | evento | 1,1% |
| `cobranca_da_magoa` | npc | 1,1% |
| `cupula_la_fora` | evento | 1,1% |
| `robos_na_fabrica` | evento | 1,1% |
| `deploy_de_sexta` | evento | 1,1% |
| `holding_da_familia` | evento | 1,1% |
| `greve_da_federal` | evento | 1,1% |
| `cobranca_no_telefone` | evento | 1,1% |
| `happy_hour` | acao | 1,0% |
| `lista_dos_mais_ricos` | evento | 1,0% |
| `pix_para_a_cidade` | jogada | 1,0% |
| `rebaixamento` | evento | 1,0% |
| `depois_do_calote` | evento | 1,0% |
| `solucao_inesperada` | evento | 1,0% |
| `segredo_de_familia` | npc | 1,0% |
| `apartamento_de_presente` | evento | 1,0% |
| `tornar_se_dispensavel` | jogada | 1,0% |
| `trator_aos_dez` | evento | 1,0% |
| `turne_nacional` | evento | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `safra_da_fazenda` | evento | 1,0% |
| `feirao_limpa_nome` | evento | 1,0% |
| `papel_da_vida` | evento | 1,0% |
| `doar_em_vida` | evento | 0,9% |
| `proposta_em_dolar` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `livro_viralizou` | evento | 0,9% |
| `exportacao_bate_recorde` | evento | 0,9% |
| `jantar_esfriou` | npc | 0,9% |
| `obra_atrasada` | evento | 0,9% |
| `intercambio` | evento | 0,9% |
| `vaga_na_empresa_dele` | npc | 0,9% |
| `mais_uma_mudanca` | evento | 0,9% |
| `estatua_derrubada` | evento | 0,8% |
| `vontade_festa_de_80` | npc | 0,8% |
| `burnout` | evento | 0,8% |
| `padrinho_casamento` | npc | 0,8% |
| `juros_altos_na_fatura` | evento | 0,8% |
| `vendas_recorde` | evento | 0,8% |
| `mestrado_fora` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `pedreiro_vale_ouro` | evento | 0,8% |
| `carro_de_luxo_na_rua` | evento | 0,8% |
| `protesto_na_avenida` | evento | 0,8% |
| `o_laboratorio_apaga_a_luz` | evento | 0,7% |
| `oferta_pela_subsidiaria` | evento | 0,7% |
| `fa_obcecado` | evento | 0,7% |
| `layoff_por_email` | evento | 0,7% |
| `pressao_carreira` | npc | 0,7% |
| `acampamento_na_porta` | evento | 0,7% |
| `filial_fechando` | evento | 0,7% |
| `peneira_do_sobrenome` | evento | 0,7% |
| `tradutor_da_familia` | evento | 0,7% |
| `mesa_cheia` | evento | 0,7% |
| `vaga_no_agro` | evento | 0,7% |
| `final_da_copa` | evento | 0,7% |
| `treinar_no_clube` | acao | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `transito_de_sp` | evento | 0,7% |
| `feriado_na_praia` | evento | 0,6% |
| `bancar_presidente` | jogada | 0,6% |
| `sucessao_regime` | evento | 0,6% |
| `fila_do_emprego` | evento | 0,6% |
| `celular_dos_pais` | npc | 0,6% |
| `sucessao_coroa` | evento | 0,6% |
| `filho_parou_de_contar` | npc | 0,6% |
| `fim_de_semana_no_sitio` | evento | 0,6% |
| `filho_briga_na_escola` | npc | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `cavalo_campeao` | evento | 0,6% |
| `rompimento` | npc | 0,6% |
| `fundacao` | jogada | 0,6% |
| `noite_da_apuracao` | evento | 0,6% |
| `guerra_comercial` | evento | 0,6% |
| `edital_da_ciencia` | evento | 0,5% |
| `quebra_de_safra` | evento | 0,5% |
| `sancao_parou_o_porto` | evento | 0,5% |
| `despejo` | evento | 0,5% |
| `o_mural_do_boton` | evento | 0,5% |
| `proposta_remota` | evento | 0,5% |
| `obra_parada` | evento | 0,5% |
| `favor_do_presidente` | evento | 0,5% |
| `circo_vai_embora` | evento | 0,5% |
| `noite_de_corridas` | evento | 0,5% |
| `a_baba_foi_embora` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `choque_de_culturas` | evento | 0,4% |
| `pais_envelhecem` | npc | 0,4% |
| `aperto_do_mes` | evento | 0,4% |
| `montadora_vai_fechar` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `fusao_de_iguais` | evento | 0,4% |
| `plantao_que_nao_acaba` | evento | 0,4% |
| `internato_real` | evento | 0,4% |
| `aluguel_caro` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `proposta_pelo_negocio` | evento | 0,4% |
| `filho_apresenta_namoro` | npc | 0,4% |
| `ajudar_com_a_casa` | acao | 0,4% |
| `abrir_capital` | evento | 0,4% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,4% |
| `emprego_negocios` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `amor_sempre_trabalhando` | npc | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `tentar_a_vida_na_europa` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `negocio_em_crise` | evento | 0,3% |
| `cargo_no_gabinete` | evento | 0,3% |
| `assumir_a_fazenda` | evento | 0,3% |
| `ministro_pede_ajuste` | evento | 0,3% |
| `pais_aposentados` | npc | 0,3% |
| `renegociar_cartao` | acao | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `caso_do_poderoso` | evento | 0,3% |
| `regra_sob_medida` | evento | 0,3% |
| `reencontro_amigo_brigado` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `fim_carreira` | evento | 0,3% |
| `concurso_em_brasilia` | evento | 0,3% |
| `emprego_artes` | evento | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `operacao_no_gabinete` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `sequestro_frustrado` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `importado_invadiu` | evento | 0,3% |
| `filho_pede_ajuda` | npc | 0,3% |
| `paparazzi_real` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,2% |
| `a_conta_da_coroa` | evento | 0,2% |
| `fazer_as_pazes` | acao | 0,2% |
| `bonus_do_banco` | evento | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `shopping_lotado` | evento | 0,2% |
| `carro_de_presente` | evento | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `royalties_secaram` | evento | 0,2% |
| `etiqueta_real` | evento | 0,2% |
| `cliente_perdeu_tudo` | evento | 0,2% |
| `bonanca_no_governo` | evento | 0,2% |
| `filho_hamburgueria` | npc | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `ferias_coletivas` | evento | 0,2% |
| `violencia_vira_manchete` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `grupo_na_capa` | evento | 0,2% |
| `parcela_da_tv` | npc | 0,2% |
| `reconciliacao` | npc | 0,2% |
| `rival_bilionario` | evento | 0,2% |
| `casamento_real` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `escola_militar` | evento | 0,2% |
| `cliente_preso` | evento | 0,2% |
| `assinatura_real` | evento | 0,2% |
| `greve_geral` | evento | 0,2% |
| `cade_investiga` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `amor_gastador` | npc | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `mansao_vazia` | evento | 0,1% |
| `crise_internacional` | evento | 0,1% |
| `festa_de_80` | acao | 0,1% |
| `zona_franca` | evento | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `mordomias_reais` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `ameaca_de_sancao` | evento | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `oposicao_na_tv` | evento | 0,1% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `presidente_pediu_as_contas` | evento | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `as_criancas_perguntam` | npc | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `jatinho_para_onde` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `conglomerado_com_desconto` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `os_dois_lados` | evento | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `lancamento` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `ilha_particular` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `filho_foi_embora` | npc | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `anos_depois_do_poder` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `caramelo_envelhece` | npc | 0,0% |
| `bolsa_na_faculdade` | evento | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `eleicao_de_fachada` | evento | 0,0% |
| `conselho_dos_generais` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `o_pais_te_paga` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `documentario` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 195 · **mudaram algo em pelo menos uma vida:** 196
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,6 · p10 52 · p25 59 · mediana 70 · p75 82 · p90 90

```
até 19                                        0,2%
20–29                                         0,4%
30–39          █                              0,8%
40–49          ██████                         5,2%
50–59          ███████████████████████        18,6%
60–69          ██████████████████████████████ 23,9%
70–79          ███████████████████████████    21,3%
80–89          ███████████████████████        18,4%
90–99          ████████████                   9,4%
100+           ███                            2,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 270 mil · p25 R$ 809 mil · mediana R$ 4 milhões · p75 R$ 37 milhões · p90 R$ 185 milhões

```
negativo                                      0,7%
até 10 mil                                    0,3%
10–50 mil      █                              1,2%
50–200 mil     ███                            5,3%
200 mil–1 mi   ██████████████                 21,3%
1–5 mi         ███████████████                24,0%
5 mi+          ██████████████████████████████ 47,1%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 76 · p90 86

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,3%
60–69          ███████████████                21,2%
70–79          ██████████████████████████████ 41,3%
80+            ███████████████████████        31,8%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,6 | R$ 1,1 milhão | 69,8 | 57,9 | 161,1 | 65,3 | 100% | 56% |
| cautelosa | 86,3 🏆 | R$ 63 milhões 🏆 | 77,7 | 69,7 | 205,1 | 80,0 | 100% | 64% |
| arriscada | 55,5 | R$ 2,9 milhões | 80,9 🏆 | 50,5 | 134,4 | 67,8 | 100% | 50% |
| aleatoria | 74,9 | R$ 1,6 milhão | 72,1 | 64,0 | 135,6 | 64,0 | 100% | 53% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,0% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,8% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,0% — de um AVC, numa terça-feira sem graça
- 7,4% — de pneumonia, depois de teimar que era só uma gripe
- 6,6% — numa cirurgia simples que não foi tão simples
- 5,8% — de velhice, dormindo, num domingo depois do almoço
- 5,1% — de complicações pulmonares, entre uma tosse e outra
- 4,9% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
