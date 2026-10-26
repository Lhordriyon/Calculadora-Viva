# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 590 eventos, 115 de personagens, 109 ações, 1646 escolhas, 239 linhas, 145 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3909232 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4466803 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 44 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 574 mil |
| Custo de vida | o mercado | 99,9% | -R$ 629 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 15 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 5,5 milhões |
| Bico | o mercado | 99,3% | R$ 45 mil |
| Salário | o mercado | 96,5% | R$ 4,1 milhões |
| Juro da renda fixa | o governo | 90,7% | R$ 223 mil |
| Cotação dos investimentos | os preços | 87,6% | R$ 1,3 milhão |
| Imposto | o governo | 85,0% | -R$ 63 mil |
| Imposto mais baixo | o governo | 82,0% | R$ 63 mil |
| Auxílio | o governo | 81,0% | R$ 16 mil |
| Juros da dívida | o banco | 79,6% | -R$ 2,2 mil |
| Compras e vendas | o mercado | 74,0% | -R$ 1,6 milhão |
| Manutenção dos bens | o mercado | 74,0% | -R$ 610 mil |
| Gastos da velhice | o mercado | 62,9% | -R$ 1,2 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 4,2% | 5,0 | 4,4% | 2,0% | 0,0% | 2,3% |
| cautelosa | 0,0% | 1,7% | 0,0 | 1,8% | 0,0% | 0,0% | 0,0% |
| arriscada | 93,1% | 28,7% | 1,0 | 15,8% | 3,8% | 22,4% | 21,3% |
| aleatoria | 50,1% | 14,8% | 1,0 | 8,6% | 1,1% | 10,6% | 10,2% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,3% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,83 anos com acordo (665 vezes) × 2,90 sem (441 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 23,0% de 3580 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,7% das vidas; 13,9% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 39,6% | R$ 59 mil | 856 | 0 (0) | 1,0% | R$ 67 mil (3 vidas) |
| cautelosa | 99,4% | 7,0 | 57,8% | R$ 2,1 milhões | 17807 | 43 (22) | 1,1% | R$ 635 mil (6 vidas) |
| arriscada | 0,0% | — | 18,5% | R$ 6,8 mil | 167 | 223 (131) | 1,2% | R$ 2 bilhão (12 vidas) |
| aleatoria | 88,2% | 2,5 | 20,4% | R$ 26 mil | 3620 | 1758 (949) | 1,1% | R$ 37 mil (12 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 99,4%, arriscada 0,0%, aleatoria 88,2% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,1% (111 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 107 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 1156 | R$ 3,8 milhões | 0,3 |
| parte dos impostos | 788 | R$ 2,2 bilhões | 1,3 |
| taxa da coroa | 408 | R$ 29 bilhões | 1,5 |

A ilha: 42 vidas fundaram ou herdaram uma. População no fim: p10 2039, mediana 2527, p90 3551.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 1,5 quedas por 100 anos com a taxa (408 anos) × 0,3 com o salário (1156 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 42 ilhas; mediana de 2756 habitantes sem a taxa (30) e 2013 com 5 anos ou mais de taxa (6) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 170182 | -0,70 |
| regular | 346857 | -0,04 |
| prioridade | 189262 | +0,75 |

A tecnologia ao morrer: p10 42,6, mediana 49,8, p90 58,7. Descobertas por 100 vidas: a cura 16,6, o satélite 16,6, a patente 16,4; 28,5% das vidas veem uma. A fuga de cérebros: 25,8% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (170182 anos) · regular -0,04 por ano (346857 anos) · prioridade +0,75 por ano (189262 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,6 · mediana 49,8 · p90 58,7 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 28,5% das vidas; 89,3% de 4957 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 180612 | -0,84 |
| regular | 344583 | -0,01 |
| reforçada | 181106 | +0,86 |

A capacidade ao morrer: p10 43,2, mediana 49,7, p90 57,7. Encomendas por 100 vidas: 2,1 (188 entregas). Guerras por 100 vidas: 3,0, em 2,9% das vidas; acabaram em vitória 59, derrota 92 e cessar-fogo 135, com 3,6 anos em média. Pedidos de paz: 0; convocações: 55; 0,3% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,84 por ano (180612 anos) · regular -0,01 por ano (344583 anos) · reforçada +0,86 por ano (181106 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 2,9% das vidas; 88,9% de 298 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,5% de 4708 anos · forte: 2,9% de 4554 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ✅ | -2,18% em 1051 anos de guerra · 2,10% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ✅ | a mais longa: 8 anos |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 23 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,67 ms | 2,4% | 32,7 KB | — | guerra, pais, pesquisa, poder, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,68 ms | 0,6% | 0,0 KB | exterior | pais, pesquisa, personagens, poder, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 5,82 ms | 5,1% | 58,9 KB | exterior, guerra | pesquisa, economia, empresa, bens, tesouro, dividas, personagens, poder, iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,22 ms | 0,2% | 0,3 KB | guerra, pais | poder, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,73 ms | 0,6% | 18,5 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 2,00 ms | 1,8% | 29,6 KB | pais, mercado | empresa, bens, tesouro, dividas, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,49 ms | 0,4% | 3,3 KB | exterior, guerra, pais, pesquisa, mercado, economia | bens, tesouro, dividas, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,19 ms | 1,0% | 15,3 KB | pais, mercado, economia, empresa | tesouro, dividas, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,38 ms | 0,3% | 3,0 KB | pais, economia, empresa, bens | dividas, personagens, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,40 ms | 0,4% | 0,3 KB | pais, economia, empresa, bens, tesouro | personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,06 ms | 0,1% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 2,13 ms | 1,9% | 21,9 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, privacao | personagens, trabalho, carreira, poder, coroa, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 3,47 ms | 3,1% | 44,7 KB | pais, economia, empresa, bens, tesouro, dividas, privacao, corpo | iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,24 ms | 0,2% | 2,1 KB | pais | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,44 ms | 0,4% | 1,9 KB | pais, corpo, trabalho | poder, coroa, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,89 ms | 0,8% | 3,9 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,09 ms | 0,1% | 0,0 KB | pais, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,06 ms | 0,1% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 1,07 ms | 0,9% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,62 ms | 0,5% | 0,3 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, privacao, corpo, personagens, trabalho, carreira, poder, coroa | iniciativas, diretor |
| amor (o amor que aparece) | 0,13 ms | 0,1% | 0,0 KB | corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 17,13 ms | 15,1% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 22,93 ms | 20,2% | 1,6 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 49,71 ms | 43,8% | — | — | — |

O save de uma vida (amostra de 1040): mediana 313 KB, p90 421 KB, máximo 528 KB; o livro é 97,1% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 528 KB (mediana 313 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 113,55 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 70,1% | 18,5% | 9,8% | 1,5% | 0,1% |

Entre as vidas com filhos (29,9%), a média é de 1,44 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 11,4% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 13,2% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 55,1% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 912 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,72 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 457,6 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 13,8% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,4% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ❌ | 2,6% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,33 |
| Saturação V20 ≤ 95% | ✅ | 90,2% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 912 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 113,55 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 82,8% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 57,7% (168 dinastias, média de 3,1 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,82 (360 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 9,79% (p99 R$ 1,6 bilhão, maior R$ 341 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,56% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,4% de 57,5% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 17,0% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 90,2% |
| Assinaturas sem regressão (≥ 918) | ❌ | 912 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 457,6 |
| CPU por vida ≤ 30 ms | ❌ | 113,55 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 96,6% (9,5 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 76,3% de 3605 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (701), A festa do século (579), Pix para a cidade inteira (338), Uma estátua sua (260), Um conselho que diz não (215), Bancar um presidente (166), Uma equipe para desmontar (165), Uma fundação com seu nome (164), Um mural de problemas (148), Tornar-se dispensável (144), Trazer a Copa do Mundo (136), Bancar quem quer sair (129), Pagar a cura de uma doença (116), Um programa espacial (102), Fundar uma cidade (80), Comprar a estatal (67), Fundar um país (38), Uma colônia em Marte (34), Salvar o país da crise (23).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 1 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 41,4% de 1918 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 23,0% delegaram, 55,5% centralizaram (858 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 36,5% (29,2 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (760), Bancar quem quer sair (445), Uma equipe para desmontar (400), Um mural de problemas (370), Tornar-se dispensável (308).
- **Na morte de quem manda:** a empresa perde em média 25,3% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 14 anos (7719 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 61,0% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 63,1% / 24,7% / 9,8% / 2,4% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,1 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,0%, o bloco liberal 24,3%, a aliança da ordem 24,9%, o centrão 24,8%; 8,4 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,71% × 1,88%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 85% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,48% contra 0,70% por ano (38231 e 54522 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,58 votos por vida, 31,1% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,72 × 0,53 pontos do PIB por ano (100 e 195 governos); 95,1% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,0% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 198.652 | 1,9% | 8,2% | 5,2% | 82% | 21,0% | 20,4 | 58 | 55 | 50% |
| a aliança da ordem | 190.641 | 1,7% | 8,4% | 5,8% | 73% | 29,5% | 17,6 | 50 | 45 | 52% |
| o centrão | 189.501 | 2,1% | 8,3% | 5,1% | 85% | 25,1% | 21,4 | 50 | 50 | 55% |
| o bloco liberal | 186.141 | 2,7% | 8,5% | 4,6% | 81% | 29,5% | 22,1 | 43 | 50 | 51% |
| o regime | 8.830 | 1,0% | 9,6% | 5,3% | 40% | 32,1% | 17,2 | 37 | 37 | 46% |
| quem joga | 6.742 | 2,2% | 8,2% | 5,4% | 81% | 25,5% | 19,5 | 54 | 52 | 54% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 16,3% de 6705 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,7% fundiram, 6,3% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 6024 (p99 308) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,33 ponto em média (30517 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,34 na bolsa (8397 empresas-ano) × 0,01 fechadas (108448) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,5% de 37327 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,15 · mediana R$ 5,10 · p90 R$ 6,36 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,32 no agro (4895 empresas-ano) × -0,31 no comércio (32041), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 34,4%, acordo em 75,4%; 95,5% das sanções acabam em até 15 anos (mediana 4, p90 10) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 86,0% de 5165 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,86% × 0,14% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,69% × 0,36% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 66,3% de 326 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 198.652 | 0,17% | 2,95% |
| a aliança da ordem | 190.641 | 1,90% | 0,36% |
| o centrão | 189.501 | 0,17% | 0,58% |
| o bloco liberal | 186.141 | 0,27% | 3,69% |
| o regime | 8.830 | 3,83% | 0,02% |
| quem joga | 6.742 | 0,62% | 7,40% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,530, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,798–0,867, Gini 0,482–0,562 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 10,9% · desigualdade_no_jornal 9,1% · idh_muito_alto 13,2% · idh_em_queda 6,5% · pais_envelhece 13,6% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,798 | 0,830 | 0,867 |
| Desigualdade (Gini) | 0,482 | 0,530 | 0,562 |
| População (milhões) | 179 | 193 | 207 |
| PIB per capita | R$ 117 mil | R$ 252 mil | R$ 589 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 55,1% / 90,2% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 62,8% |
| Efeito da memória (aleatória, V5 sem → com memória) | 62,5% → 52,2% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 912 (595) |
| Mobilidade: mesmo quintil da origem ao fim | 27,1% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,4% / 2,6% |
| Patrimônio p90/p10 | 624,1× (p10 R$ 280 mil, p90 R$ 175 milhões) |
| Desvio-padrão da felicidade média da vida | 8,72 |
| Vidas com patrimônio negativo ao morrer | 0,7% |
| Mudanças de estado causadas pelo jogador | 44,3% |
| Toques por vida | 457,6 |
| Tempo de CPU por vida | 113,55 ms |
| Ações (fichas usadas) por vida | 159,1 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 13,8% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 25,7 |
| Vidas que terminam com filho ou filha para continuar | 82,8% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,1 / 57,7% / 29,8% |
| Idade de quem herda ao começar (mediana) / herança mediana | 37 anos / R$ 13 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,82 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 57,5% |
| Entre quem abriu: quebrou / vendeu | 28,4% / 25,5% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,2 milhões / R$ 98 milhões / R$ 1,6 bilhão / R$ 341 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,69% / 9,79% / 1,56% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 17,0% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 60,6 / 159,1 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 824 | R$ 138 mil | R$ 1,4 milhão | R$ 37 milhões |
| moderado | 918 | R$ 139 mil | R$ 1,9 milhão | R$ 33 milhões |
| arrojado | 758 | R$ 201 mil | R$ 2,6 milhões | R$ 66 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 70,3 | R$ 1,9 milhão | 76,1 |
| pobre | 104 | 70,0 | R$ 2,2 milhões | 75,4 |
| remediada | 24 | 70,6 | R$ 1,6 milhão | 77,3 |
| media | 64 | 68,8 | R$ 2,9 milhões | 73,6 |
| rica | 64 | 66,5 | R$ 4,2 milhões | 76,8 |
| muito rica | 144 | 70,3 | R$ 19 milhões | 76,0 |
| bilionaria | 356 | 70,7 | R$ 2,8 bilhões | 77,0 |
| trilionaria | 276 | 70,9 | R$ 1,2 trilhão | 77,7 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 42,2 |
| Demissões por vida / vindas de uma recessão ou crise | 0,51 / 32,6% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 46% · serviços 14% · saúde 13% · cultura e internet 7% · transporte e entregas 5% · comércio 4% · agro 3% · construção 2% · tecnologia 2% · indústria 1% · sem setor 1% · finanças 1% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 21% | 34% | 46% | 55% | 77% | 85% | 90% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 32% | 20% | 17% | 17% | 14% |
| Q2 | 30% | 23% | 16% | 15% | 16% |
| Q3 | 22% | 25% | 20% | 18% | 15% |
| Q4 | 13% | 24% | 26% | 21% | 16% |
| Q5 | 3% | 8% | 21% | 29% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,3 | R$ 1,7 milhão | 74,9 |
| família pobre | 24% | 70,7 | R$ 1,7 milhão | 75,0 |
| família remediada | 20% | 71,6 | R$ 2,2 milhões | 75,1 |
| classe média | 18% | 70,3 | R$ 2,9 milhões | 74,8 |
| família rica | 13% | 70,5 | R$ 6 milhões | 74,8 |
| família muito rica | 13% | 69,7 | R$ 27 milhões | 75,9 |
| família bilionária | 3% | 70,6 | R$ 3 bilhões | 77,2 |

## Repetição

- **Dentro de uma vida:** 7,6% das aparições repetem uma instância já vista na mesma vida; pior vida: 27,6%.
- **Texto repetido entre vidas:** 29,2% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 2,9 · `aposentadoria` 1,5 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,3 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,1

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 137 de 294 (47%) · típico 136 de 294 (46%) · rico 150 de 294 (51%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `mais_um_filho`, `cobranca_da_magoa`, `cobranca_do_filho`, `amor_vai_embora`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `rompimento`, `fazer_as_pazes`, `ajudar_com_a_casa`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `a_convocacao`, `filho_convocado`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `renegociar_cartao`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `despejo`, `proposta_pelo_negocio`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `fundacao`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `circo_vai_embora`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `noite_de_corridas`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 60,6 · **com causa anterior (cadeia):** 69,8 · **maior distância causa→consequência:** 48,4 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,9% |
| `namoro` | evento | 99,1% |
| `luto` | npc | 97,4% |
| `enem` | evento | 94,6% |
| `primeiro_voto` | evento | 83,2% |
| `trabalho_grande` | acao | 74,3% |
| `programa_junto` | acao | 70,6% |
| `aposentadoria` | evento | 62,7% |
| `bico_adulto` | acao | 61,3% |
| `correr_no_quintal` | acao | 60,5% |
| `ler_gibi` | acao | 58,1% |
| `cuidar_da_doenca` | npc | 58,1% |
| `formatura` | evento | 57,6% |
| `parquinho` | acao | 57,5% |
| `eleicao_geral` | evento | 55,8% |
| `conversar_de_verdade` | acao | 55,1% |
| `almoco_domingo` | acao | 54,5% |
| `saudade_de_voce` | npc | 54,3% |
| `tocar_empresa` | acao | 50,3% |
| `ligar_amigo` | acao | 49,8% |
| `curso_online` | acao | 49,5% |
| `pos_graduacao` | acao | 49,4% |
| `mochilao` | acao | 49,3% |
| `pedir_conselho` | acao | 49,1% |
| `presente_certo` | acao | 49,0% |
| `avo_mesada_escondida` | npc | 48,4% |
| `visitar_familia` | acao | 48,3% |
| `viagem_la_para_fora` | evento | 45,2% |
| `dizer_umas_verdades` | acao | 44,4% |
| `correr` | acao | 43,3% |
| `reclama_que_voce_sumiu` | npc | 43,0% |
| `estudar_concurso` | acao | 42,5% |
| `doente_crianca` | npc | 42,0% |
| `baile_terceira_idade` | acao | 41,6% |
| `pedir_um_pix` | acao | 41,3% |
| `vontade_ver_o_mar` | npc | 40,9% |
| `primeiro_emprego` | evento | 40,8% |
| `demissao` | evento | 39,9% |
| `perdeu_emprego_na_crise` | npc | 39,0% |
| `academia` | acao | 38,3% |
| `ler_livros` | acao | 36,5% |
| `estudar_escola` | acao | 36,5% |
| `balde_da_pracinha` | evento | 36,4% |
| `falando_bem_de_voce` | npc | 36,0% |
| `ouvir_historia` | acao | 35,8% |
| `primeiro_investimento` | evento | 35,7% |
| `pre_escola` | evento | 34,5% |
| `creche_ou_vo` | evento | 34,4% |
| `amigo_em_apuros` | npc | 34,4% |
| `paquerar` | acao | 34,3% |
| `estudar_enem` | acao | 33,3% |
| `rabiscar_parede` | acao | 33,0% |
| `bullying_recreio` | evento | 32,9% |
| `primeiro_beijo` | evento | 32,9% |
| `cuidar_de_doente` | acao | 32,8% |
| `acidente_em_casa` | evento | 32,6% |
| `perguntar_porque` | acao | 31,7% |
| `copa_do_mundo` | evento | 31,3% |
| `videogame_do_amigo` | acao | 30,8% |
| `estudar_tabuada` | acao | 29,6% |
| `vontade_viagem_com_amigo` | npc | 29,1% |
| `viagem_dos_sonhos` | evento | 29,1% |
| `amor_quer_casar` | npc | 28,4% |
| `banda_garagem` | evento | 28,4% |
| `natacao_no_clube` | acao | 28,3% |
| `historias_ou_telas` | evento | 28,2% |
| `salario_em_dolar` | evento | 28,0% |
| `vape_festa` | evento | 27,9% |
| `caminhada` | acao | 27,8% |
| `colesterol_alto` | evento | 27,8% |
| `ajudar_em_casa` | acao | 27,6% |
| `bilhete_carinhoso` | npc | 27,5% |
| `festa_80` | evento | 27,1% |
| `filho` | npc | 26,9% |
| `investir_tesouro` | acao | 26,7% |
| `piada_no_grupo` | npc | 26,5% |
| `cachorro_caramelo` | evento | 26,4% |
| `vontade_voltar_a_terra` | npc | 26,2% |
| `filho_adolescente` | evento | 26,1% |
| `estudar_faculdade` | acao | 26,1% |
| `visitar_o_tumulo` | acao | 25,9% |
| `primeiro_celular` | evento | 25,8% |
| `amigo_pede_dinheiro` | evento | 25,8% |
| `pedir_desculpas` | acao | 25,7% |
| `curso_nota_alta` | evento | 25,7% |
| `pelada` | acao | 25,7% |
| `casamento` | npc | 25,4% |
| `vacina_no_posto` | evento | 25,2% |
| `check_up` | acao | 25,2% |
| `festa_tema` | evento | 25,0% |
| `golpe_pix` | evento | 24,9% |
| `oportunidade_de_negocio` | evento | 24,9% |
| `carro` | evento | 24,8% |
| `perdeu_aniversario` | npc | 24,7% |
| `show_no_estadio` | acao | 24,4% |
| `guardar_dinheiro` | acao | 24,2% |
| `hidro_com_a_turma` | acao | 24,1% |
| `bet` | evento | 23,9% |
| `esperou_por_voce` | npc | 23,8% |
| `doar_sangue` | evento | 23,7% |
| `festa_junina` | evento | 23,6% |
| `pelada_de_quinta` | evento | 23,5% |
| `investimento_furado` | evento | 23,4% |
| `viagem_realizada` | evento | 23,3% |
| `esporte_depois_da_aula` | evento | 23,0% |
| `emprego_saude` | evento | 23,0% |
| `largar_tudo` | evento | 22,7% |
| `crise_la_fora` | evento | 22,7% |
| `criptomoeda` | evento | 22,6% |
| `avo_conta_historias` | npc | 22,4% |
| `tempo_com_amor` | acao | 22,1% |
| `previdencia` | acao | 22,1% |
| `rebalancear` | acao | 22,0% |
| `bico_adolescente` | acao | 21,9% |
| `voltar_a_estudar` | acao | 21,7% |
| `vontade_de_um_bicho` | npc | 21,6% |
| `pensar_em_adotar` | evento | 20,7% |
| `primeira_palavra` | evento | 20,6% |
| `tatuagem` | evento | 20,6% |
| `reforma_da_casa` | evento | 20,4% |
| `cozinhar_com_a_avo` | acao | 20,4% |
| `viajar_com_o_amigo` | acao | 20,3% |
| `futebol_de_varzea` | acao | 20,3% |
| `hora_extra` | acao | 20,2% |
| `proposta_na_expansao` | evento | 20,2% |
| `cortar_gastos` | acao | 20,1% |
| `festa_da_cidade` | acao | 20,1% |
| `casa_dos_pais` | evento | 20,0% |
| `data_da_partida` | evento | 19,8% |
| `bolao_do_trabalho` | evento | 19,7% |
| `filho_formatura` | evento | 19,7% |
| `encontro` | acao | 19,6% |
| `cursinho_pago` | acao | 19,5% |
| `mesada` | evento | 19,5% |
| `vaquinha_do_vizinho` | evento | 19,4% |
| `feira_ciencias` | evento | 19,3% |
| `hobby_horta` | evento | 19,0% |
| `juros_compostos` | evento | 18,9% |
| `sair_de_casa` | evento | 18,8% |
| `reencontro_da_turma` | evento | 18,5% |
| `subir_de_padrao` | evento | 18,5% |
| `vizinho_barulhento` | evento | 18,5% |
| `pede_ajuda` | npc | 18,3% |
| `catapora` | evento | 18,0% |
| `desempregado` | evento | 17,9% |
| `heranca_do_tio` | evento | 17,7% |
| `pai_ausente_volta` | npc | 17,6% |
| `festa_sem_pais` | evento | 17,6% |
| `primeiro_cupom` | evento | 17,5% |
| `franquia` | evento | 17,4% |
| `orgulho_da_formatura` | npc | 17,4% |
| `moeda_digital` | evento | 17,4% |
| `bateu_o_carro` | evento | 17,3% |
| `assalto_na_rua` | evento | 17,1% |
| `curso_nota_media` | evento | 16,7% |
| `vender_doce` | acao | 16,4% |
| `voltar_estudar` | evento | 16,3% |
| `leu_antes_dos_colegas` | evento | 16,0% |
| `fome_no_fim_do_mes` | evento | 15,8% |
| `empresa_quebrou` | evento | 15,7% |
| `entregas` | acao | 15,6% |
| `fazenda_a_venda` | evento | 15,5% |
| `ceu_de_fumaca` | evento | 15,5% |
| `festa_de_sao_joao` | evento | 15,4% |
| `bloco_de_carnaval` | evento | 15,3% |
| `cripto_fomo` | evento | 15,1% |
| `casa_propria` | evento | 14,9% |
| `carteira_da_diarista` | evento | 14,8% |
| `ingles_crianca` | acao | 14,8% |
| `mudar_para_a_praia` | evento | 14,8% |
| `amigo_devolve` | npc | 14,7% |
| `hidroginastica` | evento | 14,3% |
| `reuniao_de_condominio` | evento | 14,2% |
| `baile_da_terceira_idade` | evento | 14,1% |
| `cirurgia_de_catarata` | evento | 14,1% |
| `entregador_chuva` | evento | 14,1% |
| `pisa_em_ovos` | npc | 14,0% |
| `convite_para_palestrar` | evento | 14,0% |
| `reencontro_amigo` | evento | 14,0% |
| `imposto_alto_no_contracheque` | evento | 13,9% |
| `imovel_valorizou` | evento | 13,7% |
| `investimento_rotina` | evento | 13,6% |
| `corte_de_salario` | evento | 13,6% |
| `pais_envelhece` | evento | 13,6% |
| `peneira` | evento | 13,4% |
| `dolar_barato` | evento | 13,3% |
| `alavancagem` | evento | 13,3% |
| `brigas_de_madrugada` | evento | 13,2% |
| `idh_muito_alto` | evento | 13,2% |
| `multa_e_batida` | evento | 13,1% |
| `bolsa_la_fora` | evento | 13,0% |
| `aula_de_musica` | evento | 13,0% |
| `imposto_baixo_sobrou` | evento | 12,9% |
| `levar_ao_mar` | acao | 12,9% |
| `vaga_sobrando` | evento | 12,8% |
| `escrever_memorias` | evento | 12,8% |
| `parar_de_fumar` | acao | 12,8% |
| `promocao` | evento | 12,8% |
| `convite_do_luxo` | evento | 12,7% |
| `sovina_ou_sabio` | evento | 12,6% |
| `quarto_dividido` | evento | 12,6% |
| `alugueis_dos_fundos` | evento | 12,4% |
| `maratona` | evento | 12,4% |
| `golpe_do_falso_neto` | evento | 12,3% |
| `mais_um_filho` | npc | 12,3% |
| `bolsa_de_estudos` | evento | 12,2% |
| `separacao` | evento | 12,0% |
| `casa_cheia` | evento | 11,9% |
| `balcao_negocio` | acao | 11,9% |
| `juros_altos_rendendo` | evento | 11,8% |
| `casa_na_praia` | evento | 11,7% |
| `feira_de_ciencias` | evento | 11,6% |
| `aniversario_da_infancia` | evento | 11,6% |
| `testamento` | evento | 11,6% |
| `concorrente_gigante` | evento | 11,5% |
| `compra_por_impulso` | evento | 11,5% |
| `peito_chiando` | evento | 11,4% |
| `pobreza_na_porta` | evento | 11,3% |
| `rua_tranquila` | evento | 11,2% |
| `a_vacina_no_posto` | evento | 11,1% |
| `greve_dos_onibus` | evento | 11,1% |
| `produto_viralizou` | evento | 11,1% |
| `separacao_dos_pais` | evento | 11,0% |
| `casamento_na_igreja` | npc | 11,0% |
| `cofrinho` | acao | 10,9% |
| `pib_recorde` | evento | 10,9% |
| `negocio_no_aperto` | evento | 10,7% |
| `praia` | acao | 10,7% |
| `consorcio` | evento | 10,7% |
| `recomecar_amor` | acao | 10,7% |
| `esporte_escola` | acao | 10,5% |
| `assalto_no_onibus` | evento | 10,5% |
| `briga_em_casa` | npc | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,4% |
| `bolsa_subiu_sem_voce` | evento | 10,4% |
| `gerente_do_banco` | evento | 10,3% |
| `surpresa_do_amor` | npc | 10,3% |
| `apartamento_na_planta` | evento | 10,3% |
| `role` | acao | 10,2% |
| `retiro_da_igreja` | evento | 10,2% |
| `juros_baixos_euforia` | evento | 10,2% |
| `socio_sumiu` | evento | 10,0% |
| `queda` | evento | 10,0% |
| `cartao_credito` | evento | 10,0% |
| `vontade_ver_o_neto` | npc | 10,0% |
| `voce_mudou` | npc | 9,9% |
| `seca_no_sertao` | evento | 9,8% |
| `olimpiada_matematica` | evento | 9,7% |
| `tempo_com_filho` | acao | 9,7% |
| `padrao_de_vida` | evento | 9,6% |
| `cheia_do_rio` | evento | 9,6% |
| `colo_da_avo` | acao | 9,4% |
| `crise_40` | evento | 9,4% |
| `chefe_novo` | evento | 9,4% |
| `fugir_inflacao` | acao | 9,3% |
| `conteudo_extra` | acao | 9,3% |
| `comer_tudo` | acao | 9,3% |
| `brincar_com_o_pai` | acao | 9,2% |
| `investidor_anjo` | evento | 9,2% |
| `remorso_aperta` | evento | 9,2% |
| `chimarrao` | acao | 9,1% |
| `desigualdade_no_jornal` | evento | 9,1% |
| `mudanca_de_escola` | evento | 9,1% |
| `atendimento_robo` | evento | 9,0% |
| `estatua` | jogada | 9,0% |
| `pousada_na_praia` | evento | 9,0% |
| `ressaca_do_mar` | evento | 9,0% |
| `sao_joao` | acao | 9,0% |
| `festa_surpresa` | evento | 8,9% |
| `brincar_na_rua` | acao | 8,9% |
| `fundo_da_familia` | npc | 8,8% |
| `titulo_eleitor` | evento | 8,8% |
| `filho_desenho` | npc | 8,8% |
| `dolar_disparou` | evento | 8,8% |
| `aposentadoria_ativa` | evento | 8,7% |
| `inquilino_sumiu` | evento | 8,7% |
| `edital_de_cultura` | evento | 8,6% |
| `blitz_toda_noite` | evento | 8,6% |
| `ouvido_para_musica` | evento | 8,6% |
| `tocar_no_bar` | acao | 8,6% |
| `noite_de_stand_up` | evento | 8,6% |
| `festa_de_15` | evento | 8,5% |
| `cripto_disparou` | evento | 8,5% |
| `festival_do_boi` | evento | 8,4% |
| `ponto_comercial` | evento | 8,4% |
| `inquilino_dos_sonhos` | evento | 8,4% |
| `apagao_no_morro` | evento | 8,3% |
| `cidadania_italiana` | evento | 8,3% |
| `dente_de_leite` | evento | 8,2% |
| `amor_proposta_fora` | npc | 8,2% |
| `boi_bumba` | acao | 8,1% |
| `amor_piada_interna` | npc | 8,0% |
| `levar_a_terra_natal` | acao | 8,0% |
| `pressao_alta` | evento | 7,9% |
| `brincar_amigos` | acao | 7,9% |
| `passear_de_carrinho` | acao | 7,8% |
| `desemprego_em_alta` | evento | 7,8% |
| `ciumes_do_irmao` | evento | 7,7% |
| `geada_no_sul` | evento | 7,6% |
| `vicio_aposta` | evento | 7,5% |
| `geladeira_vazia` | evento | 7,4% |
| `mei_negocio` | evento | 7,3% |
| `herdeiro_gastao` | evento | 7,3% |
| `pular_corda` | acao | 7,3% |
| `enchente_na_rua` | evento | 7,2% |
| `fiscalizacao` | evento | 7,2% |
| `soltar_pipa` | acao | 7,1% |
| `family_office` | evento | 7,1% |
| `figurinha_repetida` | acao | 7,0% |
| `faculdade_vida` | evento | 7,0% |
| `filho_imitacao` | npc | 6,9% |
| `piramide_no_grupo` | npc | 6,9% |
| `grupo_de_jovens` | evento | 6,8% |
| `estatua_pichada` | evento | 6,8% |
| `inflacao_no_mercado` | evento | 6,7% |
| `merenda` | evento | 6,7% |
| `pescaria_no_pantanal` | evento | 6,6% |
| `assembleia_do_predio` | evento | 6,5% |
| `idh_em_queda` | evento | 6,5% |
| `festa_do_seculo` | jogada | 6,4% |
| `asma_na_educacao_fisica` | evento | 6,4% |
| `concurso_lotado` | evento | 6,3% |
| `plantao_lotado` | evento | 6,3% |
| `adocao_chegou` | evento | 6,3% |
| `doenca_de_quem_ama` | evento | 6,2% |
| `show_no_bar` | evento | 6,2% |
| `auxilio_na_conta` | evento | 6,2% |
| `briga_dos_pais` | evento | 6,1% |
| `cripto_de_novo` | acao | 6,1% |
| `festa_vazou` | evento | 6,1% |
| `mutirao_de_cirurgias` | evento | 6,1% |
| `luto_do_bicho` | npc | 6,0% |
| `vender_doce_nato` | acao | 6,0% |
| `festival_lotado` | evento | 5,8% |
| `proposta_de_compra` | evento | 5,8% |
| `moto_na_chuva` | evento | 5,8% |
| `ano_de_prejuizo` | evento | 5,8% |
| `propina_da_empreiteira` | evento | 5,7% |
| `nome_sujo` | evento | 5,7% |
| `crise_de_ansiedade` | evento | 5,7% |
| `chaves_do_apartamento` | evento | 5,7% |
| `escola_publica_boa` | evento | 5,7% |
| `cobranca_do_casamento` | npc | 5,7% |
| `escola_de_samba` | jogada | 5,7% |
| `vo_receita` | evento | 5,6% |
| `vo_partiu` | npc | 5,6% |
| `greve_do_servidor` | evento | 5,6% |
| `bico_na_expansao` | evento | 5,5% |
| `o_que_pensa_de_voce` | npc | 5,4% |
| `bolsa_derreteu` | evento | 5,4% |
| `convite_do_partido` | evento | 5,4% |
| `la_fora_comprando` | evento | 5,4% |
| `obra_grande_no_norte` | evento | 5,3% |
| `burnout_empresa` | evento | 5,3% |
| `viralizou` | evento | 5,3% |
| `natal_com_politica` | evento | 5,2% |
| `namorar_depois_dos_60` | evento | 5,2% |
| `socio_da_patente` | evento | 5,2% |
| `pais_separados_natal` | evento | 5,2% |
| `briga_na_cozinha` | evento | 5,1% |
| `amigo_muda_de_cidade` | npc | 5,1% |
| `blindar_contas` | acao | 5,0% |
| `filho_nao_veio` | npc | 5,0% |
| `paquerar_timido` | acao | 5,0% |
| `netos` | evento | 4,9% |
| `votacao_polemica` | evento | 4,9% |
| `processo_trabalhista` | evento | 4,9% |
| `operacao_policial` | evento | 4,8% |
| `so_aparece_por_dinheiro` | npc | 4,8% |
| `fundacao_com_seu_nome` | evento | 4,8% |
| `imposto_sobre_fortunas` | evento | 4,8% |
| `tarifa_do_app` | evento | 4,8% |
| `vontade_casa_propria` | npc | 4,7% |
| `promessa_da_mae` | evento | 4,7% |
| `sociedade_amigo` | evento | 4,7% |
| `pais_na_crise` | npc | 4,7% |
| `cripto_derreteu` | evento | 4,6% |
| `curso_nota_baixa` | evento | 4,6% |
| `intercambio_pago` | evento | 4,5% |
| `olimpiada` | acao | 4,5% |
| `mutirao_da_laje` | evento | 4,5% |
| `primeiro_funcionario` | evento | 4,4% |
| `cachoeira` | acao | 4,4% |
| `crescer_devagar` | evento | 4,3% |
| `vereador` | evento | 4,3% |
| `fim_do_amor` | npc | 4,3% |
| `joelho_da_pelada` | evento | 4,3% |
| `conselho_que_diz_nao` | jogada | 4,2% |
| `mae_quer_morar_junto` | npc | 4,2% |
| `agro_na_cidade` | evento | 4,1% |
| `festa_surpresa_para` | npc | 4,1% |
| `fiador` | npc | 4,1% |
| `posto_que_funciona` | evento | 4,1% |
| `trabalho_do_pai` | acao | 4,0% |
| `pescaria_no_rio` | evento | 4,0% |
| `acordo_abriu_mercado` | evento | 4,0% |
| `cobranca_de_notas` | npc | 4,0% |
| `funcionario_genial` | evento | 4,0% |
| `tosse_cronica` | evento | 4,0% |
| `clinica_particular_contrata` | evento | 4,0% |
| `comecar_terapia` | evento | 4,0% |
| `excursao_ao_mar` | acao | 3,9% |
| `heranca` | evento | 3,8% |
| `balcao_da_familia` | evento | 3,8% |
| `confeitaria_da_vo` | evento | 3,8% |
| `balcao_de_crianca` | evento | 3,8% |
| `prova_concurso` | evento | 3,7% |
| `convite_para_candidatura` | evento | 3,7% |
| `bater_o_pe_com_o_chefe` | evento | 3,7% |
| `fila_do_posto` | evento | 3,6% |
| `emprestimo_ao_irmao` | evento | 3,6% |
| `saudade_de_la` | evento | 3,6% |
| `cursinho_comunitario` | evento | 3,6% |
| `compativel_para_medula` | evento | 3,6% |
| `filho_cuida` | npc | 3,5% |
| `este_e_o_ano` | evento | 3,5% |
| `olimpiada_do_instituto` | evento | 3,4% |
| `satelite_na_tv` | evento | 3,4% |
| `casamento_do_filho` | evento | 3,4% |
| `governo_que_voce_elegeu_frente_popular` | evento | 3,4% |
| `aprovado_concurso_estudo` | evento | 3,4% |
| `amor_quer_mudar_de_carreira` | npc | 3,3% |
| `depois_do_cargo` | evento | 3,3% |
| `convite_igreja` | npc | 3,3% |
| `filho_saude_fragil` | npc | 3,3% |
| `escolheu_bem` | npc | 3,3% |
| `amigo_sumiu_e_voltou` | npc | 3,2% |
| `greve_dos_professores` | evento | 3,2% |
| `mensalidade_da_escola` | npc | 3,2% |
| `assumir_negocio` | evento | 3,1% |
| `aposentadoria_nao_da` | npc | 3,1% |
| `ferias_do_dono` | evento | 3,1% |
| `clientes_sumiram` | evento | 3,1% |
| `dolar_virou_salario` | evento | 3,0% |
| `ajudar_na_roca` | acao | 3,0% |
| `reajuste_dos_servidores` | evento | 3,0% |
| `um_bicho_para_o_filho` | acao | 3,0% |
| `joias_no_cofre` | evento | 3,0% |
| `tentar_outra_cidade` | evento | 2,9% |
| `faculdade_depois_dos_60` | npc | 2,9% |
| `vender_picole` | acao | 2,9% |
| `alguem_especial` | evento | 2,8% |
| `apresentacao_para_a_diretoria` | evento | 2,8% |
| `vaga_na_capital` | evento | 2,8% |
| `importado_ficou_caro` | evento | 2,8% |
| `ainda_mora_com_pais` | evento | 2,8% |
| `rodada_grande` | evento | 2,8% |
| `proposta_sao_paulo` | evento | 2,8% |
| `birra_no_mercado` | evento | 2,7% |
| `shows_cancelados` | evento | 2,7% |
| `surto_no_bairro` | evento | 2,7% |
| `filho_primeiro_salario` | npc | 2,7% |
| `crianca_ansiosa` | evento | 2,7% |
| `bancar_quem_sai` | jogada | 2,6% |
| `carona_de_madrugada` | npc | 2,6% |
| `terapia` | acao | 2,6% |
| `juros_altos` | evento | 2,6% |
| `obra_ou_hospital` | evento | 2,6% |
| `carregar_a_geladeira` | evento | 2,6% |
| `expandir_na_alta` | evento | 2,6% |
| `emprego_tecnologia` | evento | 2,5% |
| `crise_no_setor` | evento | 2,5% |
| `filho_quer_carro` | evento | 2,5% |
| `plano_de_saude_subiu` | evento | 2,5% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,5% |
| `duas_empresas_uma_agenda` | evento | 2,5% |
| `volta_terra` | evento | 2,5% |
| `enchente_na_cidade` | evento | 2,4% |
| `nao_acredita_mais` | npc | 2,4% |
| `briga_por_heranca` | evento | 2,4% |
| `reencontro_paixao` | evento | 2,4% |
| `obra_do_predio` | evento | 2,4% |
| `netos_nas_ferias` | evento | 2,4% |
| `depois_da_venda` | evento | 2,4% |
| `seguranca_particular` | evento | 2,4% |
| `recaida_cigarro` | evento | 2,3% |
| `hospital_sem_insumo` | evento | 2,3% |
| `cancelado` | evento | 2,3% |
| `black_friday` | evento | 2,3% |
| `ajudar_na_coleta` | evento | 2,2% |
| `filho_passou_longe` | npc | 2,2% |
| `arrojado_na_queda` | evento | 2,2% |
| `gravidez_surpresa` | npc | 2,2% |
| `programa_de_moradia` | evento | 2,2% |
| `cidadania_do_bisavo` | evento | 2,1% |
| `gorjeta_boa` | evento | 2,1% |
| `renegociar_divida` | evento | 2,1% |
| `imovel_na_baixa` | evento | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `bodas_de_prata` | evento | 2,1% |
| `conselho_de_fachada` | evento | 2,0% |
| `amigo_lembra_zoeira` | npc | 2,0% |
| `emprestimo_de_volta` | evento | 2,0% |
| `ferias_com_a_familia_do_amor` | npc | 2,0% |
| `dizimo` | evento | 2,0% |
| `governo_que_voce_elegeu_centrao` | evento | 2,0% |
| `passear_pet` | acao | 1,9% |
| `segundo_carro` | evento | 1,9% |
| `padrao_aperta` | evento | 1,9% |
| `ocorrencia_perigosa` | evento | 1,9% |
| `escola_integral` | evento | 1,9% |
| `time_a_venda` | evento | 1,9% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,8% |
| `carreira_futebol` | evento | 1,8% |
| `mural_de_problemas` | jogada | 1,8% |
| `lesao_grave` | evento | 1,8% |
| `irmaos_brigam` | evento | 1,8% |
| `convite_para_o_palco_grande` | evento | 1,8% |
| `visitar_de_longe` | acao | 1,8% |
| `paparazzi` | evento | 1,7% |
| `reforma_sem_fim` | evento | 1,7% |
| `lembranca_primeiro_amor` | evento | 1,7% |
| `fronteira_fechada` | evento | 1,7% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,7% |
| `apuracao_do_carnaval` | evento | 1,6% |
| `familia_descobre_o_testamento` | evento | 1,6% |
| `sair_de_casa_cedo` | evento | 1,6% |
| `oferece_ajuda` | npc | 1,6% |
| `cara_de_comercial` | evento | 1,6% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,6% |
| `chefe_amigo` | evento | 1,6% |
| `cuidar_netos` | acao | 1,5% |
| `amor_paga_a_conta` | npc | 1,5% |
| `cobranca_do_filho` | npc | 1,5% |
| `frete_sumiu` | evento | 1,5% |
| `vida_depois_da_condenacao` | evento | 1,5% |
| `equipe_para_desmontar` | jogada | 1,5% |
| `presidir_cpi` | evento | 1,5% |
| `contrato_publicitario` | evento | 1,5% |
| `o_conselho_vetou` | evento | 1,5% |
| `salario_parcelado` | evento | 1,4% |
| `acoes_da_startup` | evento | 1,4% |
| `tocar_o_negocio` | acao | 1,4% |
| `hit_viral` | evento | 1,4% |
| `promocao_em_outra_cidade` | evento | 1,4% |
| `nega_ajuda` | npc | 1,4% |
| `emprego_educacao` | evento | 1,4% |
| `critico_no_salao` | evento | 1,4% |
| `amigo_ficou_rico` | npc | 1,4% |
| `proposta_da_europa` | evento | 1,3% |
| `retirada_demais` | evento | 1,3% |
| `foto_de_campanha` | evento | 1,3% |
| `pane_no_voo` | evento | 1,3% |
| `dez_anos_de_empresa` | evento | 1,3% |
| `cobranca_no_telefone` | evento | 1,3% |
| `pai_namorando_de_novo` | npc | 1,3% |
| `amor_quadro_de_tarefas` | npc | 1,2% |
| `bolsa_de_iniciacao` | evento | 1,2% |
| `nao_para_quieto` | evento | 1,2% |
| `filho_cuida_de_voce` | npc | 1,2% |
| `amigo_pede_de_novo` | npc | 1,2% |
| `proposta_em_dolar` | evento | 1,2% |
| `briga_de_casal` | npc | 1,2% |
| `pix_para_a_cidade` | jogada | 1,2% |
| `tornar_se_dispensavel` | jogada | 1,1% |
| `lista_dos_mais_ricos` | evento | 1,1% |
| `greve_da_federal` | evento | 1,1% |
| `preco_do_pao` | evento | 1,1% |
| `cupula_la_fora` | evento | 1,1% |
| `embaixador_pede` | evento | 1,1% |
| `calote_no_noticiario` | evento | 1,1% |
| `jantar_esfriou` | npc | 1,0% |
| `happy_hour` | acao | 1,0% |
| `rebaixamento` | evento | 1,0% |
| `grade_na_janela` | evento | 1,0% |
| `deploy_de_sexta` | evento | 1,0% |
| `vontade_festa_de_80` | npc | 1,0% |
| `estatua_derrubada` | evento | 1,0% |
| `feirao_limpa_nome` | evento | 1,0% |
| `solucao_inesperada` | evento | 1,0% |
| `livro_viralizou` | evento | 1,0% |
| `cobranca_da_magoa` | npc | 1,0% |
| `apartamento_de_presente` | evento | 1,0% |
| `papel_da_vida` | evento | 1,0% |
| `safra_da_fazenda` | evento | 1,0% |
| `turne_nacional` | evento | 1,0% |
| `segredo_de_familia` | npc | 0,9% |
| `vendas_recorde` | evento | 0,9% |
| `obra_atrasada` | evento | 0,9% |
| `burnout` | evento | 0,9% |
| `robos_na_fabrica` | evento | 0,9% |
| `intercambio` | evento | 0,9% |
| `holding_da_familia` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `mais_uma_mudanca` | evento | 0,9% |
| `acampamento_na_porta` | evento | 0,9% |
| `vaga_na_empresa_dele` | npc | 0,9% |
| `pedreiro_vale_ouro` | evento | 0,9% |
| `divida_publica_assusta` | evento | 0,9% |
| `doar_em_vida` | evento | 0,9% |
| `exportacao_bate_recorde` | evento | 0,8% |
| `set_de_gravacao` | evento | 0,8% |
| `sancao_parou_o_porto` | evento | 0,8% |
| `juros_altos_na_fatura` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `final_da_copa` | evento | 0,8% |
| `fa_obcecado` | evento | 0,8% |
| `mestrado_fora` | evento | 0,7% |
| `tradutor_da_familia` | evento | 0,7% |
| `sucessao_coroa` | evento | 0,7% |
| `padrinho_casamento` | npc | 0,7% |
| `bancar_presidente` | jogada | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `quartel_sem_verba` | evento | 0,7% |
| `treinar_no_clube` | acao | 0,7% |
| `oferta_pela_subsidiaria` | evento | 0,7% |
| `peneira_do_sobrenome` | evento | 0,7% |
| `infancia_no_palacio` | evento | 0,7% |
| `filho_briga_na_escola` | npc | 0,7% |
| `o_mural_do_boton` | evento | 0,7% |
| `pressao_carreira` | npc | 0,7% |
| `mesa_cheia` | evento | 0,7% |
| `sucessao_regime` | evento | 0,7% |
| `o_laboratorio_apaga_a_luz` | evento | 0,6% |
| `desfile_de_sete_de_setembro` | evento | 0,6% |
| `carro_de_luxo_na_rua` | evento | 0,6% |
| `guerra_comercial` | evento | 0,6% |
| `layoff_por_email` | evento | 0,6% |
| `cavalo_campeao` | evento | 0,6% |
| `depois_do_calote` | evento | 0,6% |
| `vaga_no_agro` | evento | 0,6% |
| `desfile_das_campeas` | evento | 0,6% |
| `filial_fechando` | evento | 0,6% |
| `racionamento` | evento | 0,6% |
| `favor_do_presidente` | evento | 0,6% |
| `feriado_na_praia` | evento | 0,6% |
| `fim_de_semana_no_sitio` | evento | 0,6% |
| `obra_parada` | evento | 0,5% |
| `edital_da_ciencia` | evento | 0,5% |
| `celular_dos_pais` | npc | 0,5% |
| `filho_parou_de_contar` | npc | 0,5% |
| `emprego_negocios` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `paciente_famoso` | evento | 0,5% |
| `transito_de_sp` | evento | 0,5% |
| `fila_do_emprego` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `a_convocacao` | evento | 0,5% |
| `montadora_vai_fechar` | evento | 0,5% |
| `fundacao` | jogada | 0,5% |
| `abrir_capital` | evento | 0,5% |
| `bola_autografada` | evento | 0,5% |
| `circo_vai_embora` | evento | 0,5% |
| `quebra_de_safra` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `plantao_que_nao_acaba` | evento | 0,5% |
| `aperto_do_mes` | evento | 0,4% |
| `guerra_na_escola` | evento | 0,4% |
| `regra_sob_medida` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `aluguel_caro` | evento | 0,4% |
| `noite_de_corridas` | evento | 0,4% |
| `sequestro_frustrado` | evento | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `leilao_da_obra` | evento | 0,4% |
| `ajudar_com_a_casa` | acao | 0,4% |
| `tentar_a_vida_na_europa` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `assumir_a_fazenda` | evento | 0,4% |
| `rompimento` | npc | 0,4% |
| `negocio_em_crise` | evento | 0,4% |
| `despejo` | evento | 0,4% |
| `proposta_remota` | evento | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `pais_envelhecem` | npc | 0,4% |
| `renegociar_cartao` | acao | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `fabrica_de_municao` | evento | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `ferias_coletivas` | evento | 0,3% |
| `grupo_na_capa` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `cargo_no_gabinete` | evento | 0,3% |
| `ministro_pede_ajuste` | evento | 0,3% |
| `reconciliacao` | npc | 0,3% |
| `filho_hamburgueria` | npc | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `mansao_vazia` | evento | 0,3% |
| `importado_invadiu` | evento | 0,3% |
| `escandalo_do_lobby` | evento | 0,3% |
| `proposta_pelo_negocio` | evento | 0,3% |
| `cozinha_da_fundacao` | evento | 0,3% |
| `filho_apresenta_namoro` | npc | 0,3% |
| `bonanca_no_governo` | evento | 0,3% |
| `filho_pede_ajuda` | npc | 0,3% |
| `fusao_de_iguais` | evento | 0,3% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,3% |
| `operacao_no_gabinete` | evento | 0,3% |
| `shopping_lotado` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,2% |
| `concurso_em_brasilia` | evento | 0,2% |
| `bonus_do_banco` | evento | 0,2% |
| `casamento_real` | evento | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,2% |
| `escola_militar` | evento | 0,2% |
| `a_conta_da_coroa` | evento | 0,2% |
| `pais_aposentados` | npc | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `assinatura_real` | evento | 0,2% |
| `cliente_perdeu_tudo` | evento | 0,2% |
| `fim_carreira` | evento | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `o_veterano` | evento | 0,2% |
| `violencia_vira_manchete` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `cade_investiga` | evento | 0,2% |
| `parcela_da_tv` | npc | 0,2% |
| `royalties_secaram` | evento | 0,2% |
| `ameaca_de_sancao` | evento | 0,2% |
| `passou_mal_de_novo` | npc | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `construtora_quebrou` | evento | 0,2% |
| `trazer_a_copa` | jogada | 0,2% |
| `paparazzi_real` | evento | 0,2% |
| `reencontro_amigo_brigado` | evento | 0,2% |
| `primeiro_balanco_na_bolsa` | evento | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `rival_bilionario` | evento | 0,2% |
| `mordomias_reais` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `greve_geral` | evento | 0,2% |
| `zona_franca` | evento | 0,1% |
| `ex_aluno` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `fazer_as_pazes` | acao | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `oposicao_na_tv` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `subsidiaria_esquecida` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `jatinho_para_onde` | evento | 0,1% |
| `decreto_da_economia` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `as_criancas_perguntam` | npc | 0,1% |
| `cursinho_paga_bem` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `lancamento` | evento | 0,1% |
| `filho_convocado` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `acionistas_furiosos` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `ex_aluna_da_fundacao` | evento | 0,0% |
| `cpi_da_campanha` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `receita_no_seu_pe` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `conselho_dos_generais` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `bolsa_na_faculdade` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `anos_depois_do_poder` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `safra_ou_geada` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
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

- **Ganhas na simulação (de quem joga):** 194 · **mudaram algo em pelo menos uma vida:** 195
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,6 · p10 52 · p25 60 · mediana 70 · p75 82 · p90 91

```
até 19                                        0,2%
20–29                                         0,3%
30–39          █                              0,8%
40–49          ██████                         5,1%
50–59          ███████████████████████        18,4%
60–69          ██████████████████████████████ 23,8%
70–79          ███████████████████████████    21,5%
80–89          ███████████████████████        18,3%
90–99          ████████████                   9,5%
100+           ███                            2,1%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 280 mil · p25 R$ 874 mil · mediana R$ 4,1 milhões · p75 R$ 37 milhões · p90 R$ 175 milhões

```
negativo                                      0,7%
até 10 mil                                    0,4%
10–50 mil      █                              1,3%
50–200 mil     ███                            4,8%
200 mil–1 mi   █████████████                  20,2%
1–5 mi         ████████████████               25,1%
5 mi+          ██████████████████████████████ 47,6%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 76 · p90 86

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,1%
60–69          ███████████████                21,2%
70–79          ██████████████████████████████ 42,4%
80+            ██████████████████████         30,9%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,1 | R$ 1,2 milhão | 69,8 | 57,7 | 160,0 | 65,8 | 100% | 55% |
| cautelosa | 86,6 🏆 | R$ 63 milhões 🏆 | 77,7 | 69,9 | 205,7 | 80,6 | 100% | 64% |
| arriscada | 55,7 | R$ 2,9 milhões | 81,0 🏆 | 50,8 | 135,1 | 68,2 | 100% | 49% |
| aleatoria | 75,0 | R$ 1,9 milhão | 72,0 | 63,9 | 135,8 | 64,6 | 100% | 52% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,4% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,7% — de um AVC, numa terça-feira sem graça
- 12,2% — num hospital do SUS que fez tudo o que podia, e fez muito
- 7,2% — de pneumonia, depois de teimar que era só uma gripe
- 6,3% — numa cirurgia simples que não foi tão simples
- 5,6% — de velhice, dormindo, num domingo depois do almoço
- 5,3% — de complicações de uma queda no banheiro
- 5,0% — de complicações pulmonares, entre uma tosse e outra

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
