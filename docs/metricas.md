# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 613 eventos, 133 de personagens, 114 ações, 1777 escolhas, 239 linhas, 147 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3974894 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4543964 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 100,0% | R$ 44 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 501 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 12 mil |
| Custo de vida | o mercado | 99,8% | -R$ 608 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 4,8 milhões |
| Bico | o mercado | 99,4% | R$ 45 mil |
| Salário | o mercado | 95,9% | R$ 3,5 milhões |
| Juro da renda fixa | o governo | 89,5% | R$ 192 mil |
| Cotação dos investimentos | os preços | 86,2% | R$ 1,1 milhão |
| Imposto | o governo | 84,2% | -R$ 58 mil |
| Imposto mais baixo | o governo | 82,3% | R$ 55 mil |
| Auxílio | o governo | 81,7% | R$ 18 mil |
| Juros da dívida | o banco | 79,7% | -R$ 2,2 mil |
| Compras e vendas | o mercado | 73,7% | -R$ 1,5 milhão |
| Manutenção dos bens | o mercado | 73,7% | -R$ 524 mil |
| Gastos da velhice | o mercado | 65,4% | -R$ 992 mil |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 6,0% | 5,0 | 6,0% | 2,8% | 0,0% | 3,8% |
| cautelosa | 0,0% | 1,4% | 0,0 | 1,5% | 0,0% | 0,0% | 0,0% |
| arriscada | 91,9% | 25,9% | 1,0 | 13,8% | 3,8% | 18,5% | 19,0% |
| aleatoria | 49,2% | 15,1% | 1,0 | 8,5% | 1,2% | 10,3% | 9,8% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,1% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,92 anos com acordo (702 vezes) × 2,82 sem (513 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 20,4% de 3527 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 2,0% das vidas; 16,3% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 38,4% | R$ 60 mil | 819 | 0 (0) | 0,9% | R$ 62 mil (1 vidas) |
| cautelosa | 99,3% | 6,7 | 55,1% | R$ 1,4 milhão | 16713 | 45 (26) | 1,1% | R$ 195 mil (13 vidas) |
| arriscada | 0,0% | — | 16,3% | R$ 7,3 mil | 173 | 170 (89) | 2,8% | R$ 792 milhões (35 vidas) |
| aleatoria | 86,8% | 2,4 | 18,8% | R$ 22 mil | 3532 | 1602 (830) | 1,1% | R$ 26 mil (9 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 99,3%, arriscada 0,0%, aleatoria 86,8% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,5% (146 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 178 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2833 | R$ 3,8 milhões | 0,3 |
| parte dos impostos | 983 | R$ 1,8 bilhão | 1,3 |
| taxa da coroa | 1609 | R$ 26 bilhões | 0,3 |

A ilha: 29 vidas fundaram ou herdaram uma. População no fim: p10 2220, mediana 2568, p90 3403.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 0,3 quedas por 100 anos com a taxa (1609 anos) × 0,3 com o salário (2833 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 29 ilhas; mediana de 2619 habitantes sem a taxa (19) e 2040 com 5 anos ou mais de taxa (4) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 172355 | -0,70 |
| regular | 344351 | -0,04 |
| prioridade | 186867 | +0,76 |

A tecnologia ao morrer: p10 42,4, mediana 49,7, p90 58,5. Descobertas por 100 vidas: a cura 16,9, o satélite 16,2, a patente 15,4; 27,8% das vidas veem uma. A fuga de cérebros: 25,0% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (172355 anos) · regular -0,04 por ano (344351 anos) · prioridade +0,76 por ano (186867 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,4 · mediana 49,7 · p90 58,5 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 27,8% das vidas; 89,0% de 4855 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 179087 | -0,84 |
| regular | 343688 | -0,01 |
| reforçada | 180798 | +0,85 |

A capacidade ao morrer: p10 43,1, mediana 49,6, p90 57,8. Encomendas por 100 vidas: 6,4 (589 entregas). Guerras por 100 vidas: 3,3, em 3,2% das vidas; acabaram em vitória 63, derrota 105 e cessar-fogo 140, com 3,3 anos em média. Pedidos de paz: 4; convocações: 65; 0,3% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,84 por ano (179087 anos) · regular -0,01 por ano (343688 anos) · reforçada +0,85 por ano (180798 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 3,2% das vidas; 89,8% de 325 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,6% de 4870 anos · forte: 3,2% de 4768 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ✅ | -2,31% em 1070 anos de guerra · 2,09% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ✅ | a mais longa: 8 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 402 em vida (100,0% com resposta) e 101 na herança (100,0%). De 110 herdeiros que começaram na fila, 80,0% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 35 | 45,7% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 1 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 40 | 52,5% | primeira 0 · cautelosa 0 · arriscada 3 · aleatoria 0 |
| Mudar a Constituição para mais um mandato | 2 | 100,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Restaurar a monarquia no plebiscito | 61 | 23,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 1 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ✅ | em vida 100,0% de 402 · na herança 100,0% de 101 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 75 tentativas, 49,3% deram certo |

## A rede (missão Ω1)

As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (`docs/auditoria-omega.md`). Nas vidas sorteadas, cada vida tem em média 14,2 pessoas diferentes, 0,35 ex, 1,57 irmãos (0,86 nascidos depois de quem joga) e 7,16 pessoas do trabalho.

| Portão | Situação | Valor |
|---|---|---|
| A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão | ✅ | ex em 28,0% · irmão em 80,1% |
| As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe | ✅ | 4,8 entradas por vida, com 14,2 pessoas por vida |
| A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada) | ✅ | ex que voltou 78 · colega que virou amigo 31 · romance do trabalho 64 |

## Os verbos sociais (missão Ω2)

Quando a resposta é de uma pessoa, ela decide pelo estado e pela memória dela e diz por quê (`decisao.ts`); o empréstimo entre pessoas é uma promissória, com parcela, atraso, quitação e calote (`promissorias.ts`). Nas vidas sorteadas: 15,5 respostas por vida, sim em 38,2%, e 48,0% delas com o porquê apontando um ano anterior.

| Portão | Situação | Valor |
|---|---|---|
| A pessoa decide: ≥ 60% das vidas têm um pedido respondido por alguém, e o sim fica entre 30% e 80% das respostas | ✅ | 62,9% das vidas · 15,5 respostas por vida · sim em 38,2% |
| O porquê cita o passado: ≥ 25% das respostas dizem a lembrança que pesou ("…, aos 31") ou a dívida em aberto | ✅ | 48,0% das respostas |
| O empréstimo entre pessoas acontece e acaba dos dois jeitos: em ≥ 10% das vidas, e dos que acabam, ≥ 50% quitados e ≥ 3% em calote | ✅ | em 36,5% das vidas (12775 empréstimos: 12340 pegos, 435 feitos) · 9501 quitados, 1403 calotes, 3618 parcelas atrasadas |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 24 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,24 ms | 2,0% | 32,6 KB | — | guerra, pais, pesquisa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,64 ms | 0,6% | 0,0 KB | exterior | pais, pesquisa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 4,65 ms | 4,0% | 58,8 KB | exterior, guerra | pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, poder, coroa, iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,19 ms | 0,2% | 0,4 KB | guerra, pais | poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,56 ms | 0,5% | 18,4 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,67 ms | 1,5% | 28,5 KB | pais, mercado | empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,45 ms | 0,4% | 3,5 KB | exterior, guerra, pais, pesquisa, mercado, economia | bens, tesouro, dividas, promissorias, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 0,93 ms | 0,8% | 14,1 KB | pais, mercado, economia, empresa | tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,29 ms | 0,3% | 2,9 KB | pais, economia, empresa, bens | dividas, promissorias, personagens, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,34 ms | 0,3% | 0,3 KB | pais, economia, empresa, bens, tesouro | promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| promissorias (os empréstimos entre pessoas: a parcela, o atraso que magoa, a quitação e o calote) | 0,30 ms | 0,3% | 1,5 KB | pais, economia, empresa, bens, tesouro, dividas | personagens, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,06 ms | 0,0% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,81 ms | 1,6% | 21,6 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao | personagens, trabalho, carreira, poder, coroa, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 4,55 ms | 4,0% | 76,9 KB | exterior, pais, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo | trabalho, carreira, poder, coroa, iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,23 ms | 0,2% | 1,7 KB | pais, promissorias, personagens | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,52 ms | 0,5% | 1,7 KB | pais, promissorias, corpo, personagens, trabalho | poder, coroa, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,78 ms | 0,7% | 3,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,14 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,06 ms | 0,1% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, promissorias, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,88 ms | 0,8% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,49 ms | 0,4% | 0,3 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa | iniciativas, diretor |
| amor (o amor que aparece e o namoro que esfria) | 0,12 ms | 0,1% | 0,0 KB | promissorias, corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 20,76 ms | 18,1% | 2,0 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 17,42 ms | 15,2% | 1,7 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 54,72 ms | 47,7% | — | — | — |

O save de uma vida (amostra de 1040): mediana 351 KB, p90 449 KB, máximo 552 KB; o livro é 96,8% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 552 KB (mediana 351 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 114,80 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 73,4% | 17,2% | 8,0% | 1,4% | 0,0% |

Entre as vidas com filhos (26,6%), a média é de 1,41 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 9,4% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 11,1% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 52,8% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 915 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 9,00 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 454,3 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 15,2% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 13,7% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ❌ | 2,8% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,35 |
| Saturação V20 ≤ 95% | ✅ | 87,6% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 915 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 114,80 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 82,3% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 63,7% (168 dinastias, média de 3,3 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,85 (390 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 6,38% (p99 R$ 706 milhões, maior R$ 821 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,66% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 31,8% de 56,4% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 16,2% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 87,6% |
| Assinaturas sem regressão (≥ 918) | ❌ | 915 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 454,3 |
| CPU por vida ≤ 30 ms | ❌ | 114,80 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 95,8% (9,6 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 71,0% de 3622 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (649), A festa do século (518), Pix para a cidade inteira (347), Uma estátua sua (261), Um conselho que diz não (181), Bancar um presidente (176), Uma fundação com seu nome (155), Uma equipe para desmontar (145), Trazer a Copa do Mundo (132), Um mural de problemas (130), Pagar a cura de uma doença (127), Tomar o poder (117), Bancar quem quer sair (115), Um programa espacial (114), Tornar-se dispensável (104), Restaurar a monarquia (74), Fundar uma cidade (69), Comprar a estatal (65), Ficar no poder (62), Uma colônia em Marte (31), Fundar um país (27), Salvar o país da crise (23).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 2 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 38,1% de 1620 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 29,2% delegaram, 52,1% centralizaram (679 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 35,1% (31,4 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (607), Bancar quem quer sair (373), Uma equipe para desmontar (341), Um mural de problemas (323), Tornar-se dispensável (242).
- **Na morte de quem manda:** a empresa perde em média 25,2% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 16 anos (7709 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 984 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 53,7% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 62,9% / 24,7% / 10,0% / 2,5% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,2 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 25,9%, o bloco liberal 24,6%, a aliança da ordem 25,0%, o centrão 24,6%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,6%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,69% × 1,88%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 85% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,51% contra 0,82% por ano (38937 e 54828 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ❌ | 1,42 votos por vida, 30,5% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,33 × 0,53 pontos do PIB por ano (156 e 166 governos); 97,1% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,1% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 196.279 | 1,9% | 8,2% | 5,2% | 82% | 21,0% | 20,5 | 58 | 55 | 50% |
| a aliança da ordem | 189.598 | 1,7% | 8,4% | 5,8% | 73% | 29,5% | 17,6 | 50 | 45 | 52% |
| o centrão | 186.891 | 2,1% | 8,3% | 5,1% | 85% | 25,1% | 21,4 | 50 | 50 | 55% |
| o bloco liberal | 186.384 | 2,7% | 8,5% | 4,6% | 81% | 29,6% | 22,1 | 43 | 50 | 51% |
| quem joga | 12.034 | 1,6% | 8,8% | 5,4% | 83% | 25,6% | 18,5 | 51 | 49 | 51% |
| o regime | 6.004 | 1,0% | 9,5% | 5,3% | 39% | 32,1% | 17,1 | 37 | 37 | 46% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 13,5% de 6604 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,5% fundiram, 4,6% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 2242 (p99 460) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,33 ponto em média (25341 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,35 na bolsa (6473 empresas-ano) × 0,00 fechadas (97568) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 47,7% de 37508 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,15 · mediana R$ 5,11 · p90 R$ 6,36 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,29 no agro (3488 empresas-ano) × -0,31 no comércio (27867), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 34,7%, acordo em 74,8%; 95,3% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,9% de 5308 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,89% × 0,14% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,75% × 0,34% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 71,4% de 377 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 196.279 | 0,18% | 2,94% |
| a aliança da ordem | 189.598 | 1,93% | 0,34% |
| o centrão | 186.891 | 0,16% | 0,60% |
| o bloco liberal | 186.384 | 0,28% | 3,75% |
| quem joga | 12.034 | 1,94% | 3,73% |
| o regime | 6.004 | 3,85% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,529, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,798–0,868, Gini 0,483–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 9,0% · desigualdade_no_jornal 7,4% · idh_muito_alto 11,6% · idh_em_queda 5,5% · pais_envelhece 12,5% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,798 | 0,830 | 0,868 |
| Desigualdade (Gini) | 0,483 | 0,529 | 0,561 |
| População (milhões) | 180 | 193 | 206 |
| PIB per capita | R$ 117 mil | R$ 249 mil | R$ 579 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 52,8% / 87,6% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 61,3% |
| Efeito da memória (aleatória, V5 sem → com memória) | 58,7% → 49,7% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 915 (606) |
| Mobilidade: mesmo quintil da origem ao fim | 26,8% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,35 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 13,7% / 2,8% |
| Patrimônio p90/p10 | 460,8× (p10 R$ 232 mil, p90 R$ 107 milhões) |
| Desvio-padrão da felicidade média da vida | 9,00 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,5% |
| Toques por vida | 454,3 |
| Tempo de CPU por vida | 114,80 ms |
| Ações (fichas usadas) por vida | 159,0 |
| Mortes na família por vida | 5,1 |
| Pontos de virada que vêm do mundo (não do jogador) | 15,2% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 24,8 |
| Vidas que terminam com filho ou filha para continuar | 82,3% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,3 / 63,7% / 35,1% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 7,8 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,85 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 56,4% |
| Entre quem abriu: quebrou / vendeu | 31,8% / 23,8% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 1,7 milhão / R$ 60 milhões / R$ 706 milhões / R$ 821 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 28,24% / 6,38% / 0,66% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 16,2% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 60,8 / 159,0 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 824 | R$ 137 mil | R$ 1,5 milhão | R$ 41 milhões |
| moderado | 904 | R$ 145 mil | R$ 1,7 milhão | R$ 26 milhões |
| arrojado | 772 | R$ 171 mil | R$ 2 milhões | R$ 57 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 69,5 | R$ 3,4 milhões | 74,4 |
| pobre | 104 | 68,7 | R$ 1,2 milhão | 74,0 |
| remediada | 24 | 69,1 | R$ 731 mil | 76,3 |
| media | 64 | 69,2 | R$ 3,9 milhões | 72,7 |
| rica | 64 | 68,2 | R$ 7,7 milhões | 74,6 |
| muito rica | 144 | 70,4 | R$ 20 milhões | 74,2 |
| bilionaria | 356 | 69,6 | R$ 1,8 bilhão | 74,8 |
| trilionaria | 276 | 70,5 | R$ 784 bilhões | 75,6 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 42,1 |
| Demissões por vida / vindas de uma recessão ou crise | 0,56 / 33,4% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 28 |
| Setor do último trabalho | serviço público 48% · serviços 15% · saúde 12% · cultura e internet 7% · transporte e entregas 4% · comércio 4% · agro 3% · construção 2% · tecnologia 2% · sem setor 1% · indústria 1% · finanças 1% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 21% | 33% | 43% | 53% | 75% | 83% | 88% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 24% | 16% | 16% | 14% |
| Q2 | 33% | 21% | 16% | 14% | 16% |
| Q3 | 21% | 25% | 20% | 19% | 15% |
| Q4 | 12% | 24% | 28% | 21% | 15% |
| Q5 | 3% | 7% | 19% | 30% | 41% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,6 | R$ 1,3 milhão | 73,1 |
| família pobre | 24% | 69,9 | R$ 1,2 milhão | 73,2 |
| família remediada | 20% | 71,1 | R$ 1,8 milhão | 73,4 |
| classe média | 18% | 70,0 | R$ 2,5 milhões | 72,8 |
| família rica | 13% | 70,2 | R$ 5 milhões | 73,0 |
| família muito rica | 13% | 70,0 | R$ 24 milhões | 74,0 |
| família bilionária | 3% | 72,8 | R$ 2,8 bilhões | 76,0 |

## Repetição

- **Dentro de uma vida:** 8,7% das aparições repetem uma instância já vista na mesma vida; pior vida: 27,3%.
- **Texto repetido entre vidas:** 24,6% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,3 · `aposentadoria` 1,5 · `irmao_nasce` 0,5 · `avo_mesada_escondida#avo` 0,4 · `namoro_esfriou#amor` 0,3 · `eleicao_geral` 0,2

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 148 de 320 (46%) · típico 147 de 320 (46%) · rico 161 de 320 (50%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `ex_liga_de_madrugada`, `ex_nas_redes`, `ex_cobra`, `mais_um_filho`, `irmao_mais_velho_defende`, `cobranca_da_magoa`, `chefe_hora_extra`, `chefe_magoado_cobra`, `colega_rouba_ideia`, `romance_no_trabalho`, `colega_de_licenca`, `o_caso_vem_a_tona`, `devedor_some`, `cobranca_do_filho`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `segunda_chance`, `irmao_separou`, `chefe_magoado_cobra`, `cobrar_divida`, `devedor_some`, `ajudar_com_a_casa`, `festa_de_80`, `filho_parou_de_contar`, `as_criancas_perguntam`, `amor_vai_embora`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `edital_da_ciencia`, `renegociar_cartao`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `transito_de_sp`, `despejo`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `salvar_o_pais`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `os_bancos_pagam`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `dono_do_brasil`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `infancia_no_palacio`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `peneira_do_sobrenome`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `final_da_copa`, `cliente_perdeu_tudo`, `noite_de_corridas`, `fa_obcecado`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `feriado_na_praia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Apresentados por vida:** 60,8 · **com causa anterior (cadeia):** 72,9 · **maior distância causa→consequência:** 47,5 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,5% |
| `namoro` | evento | 98,9% |
| `luto` | npc | 96,5% |
| `enem` | evento | 92,0% |
| `primeiro_voto` | evento | 75,5% |
| `trabalho_grande` | acao | 74,1% |
| `programa_junto` | acao | 70,5% |
| `casamento_do_irmao` | evento | 68,4% |
| `aposentadoria` | evento | 64,9% |
| `correr_no_quintal` | acao | 60,4% |
| `ler_gibi` | acao | 57,7% |
| `parquinho` | acao | 57,4% |
| `formatura` | evento | 55,3% |
| `bico_adulto` | acao | 55,2% |
| `almoco_domingo` | acao | 54,6% |
| `padrinho_do_sobrinho` | evento | 53,3% |
| `conversar_de_verdade` | acao | 53,0% |
| `cuidar_da_doenca` | npc | 53,0% |
| `irmao_nasce` | evento | 53,0% |
| `eleicao_geral` | evento | 51,2% |
| `saudade_de_voce` | npc | 51,1% |
| `curso_online` | acao | 49,4% |
| `visitar_familia` | acao | 49,0% |
| `mochilao` | acao | 48,9% |
| `avo_mesada_escondida` | npc | 48,7% |
| `presente_certo` | acao | 47,7% |
| `pedir_conselho` | acao | 47,4% |
| `ligar_amigo` | acao | 47,1% |
| `dizer_umas_verdades` | acao | 46,9% |
| `oferecer_ajuda` | acao | 46,4% |
| `tocar_empresa` | acao | 45,8% |
| `pos_graduacao` | acao | 44,0% |
| `primeiro_emprego` | evento | 42,3% |
| `demissao` | evento | 42,2% |
| `estudar_concurso` | acao | 41,9% |
| `pedir_um_pix` | acao | 41,7% |
| `doente_crianca` | npc | 40,7% |
| `briga_com_o_irmao` | evento | 40,6% |
| `viagem_la_para_fora` | evento | 40,0% |
| `esperou_por_voce` | npc | 40,0% |
| `reclama_que_voce_sumiu` | npc | 39,9% |
| `vontade_ver_o_mar` | npc | 39,7% |
| `pedir_emprestado` | acao | 39,5% |
| `academia` | acao | 38,9% |
| `baile_terceira_idade` | acao | 38,5% |
| `namoro_esfriou` | evento | 38,2% |
| `ler_livros` | acao | 37,7% |
| `ouvir_historia` | acao | 36,4% |
| `estudar_escola` | acao | 36,4% |
| `paquerar` | acao | 35,3% |
| `primeiro_investimento` | evento | 33,6% |
| `estudar_enem` | acao | 33,2% |
| `rabiscar_parede` | acao | 32,9% |
| `perdeu_emprego_na_crise` | npc | 32,8% |
| `correr` | acao | 32,5% |
| `perguntar_porque` | acao | 31,7% |
| `cupido_do_irmao` | acao | 31,5% |
| `videogame_do_amigo` | acao | 30,8% |
| `falando_bem_de_voce` | npc | 30,5% |
| `creche_ou_vo` | evento | 30,3% |
| `bullying_recreio` | evento | 30,1% |
| `estudar_tabuada` | acao | 29,9% |
| `balde_da_pracinha` | evento | 29,8% |
| `amigo_em_apuros` | npc | 29,5% |
| `primeiro_beijo` | evento | 29,2% |
| `pedir_desculpas` | acao | 29,0% |
| `pre_escola` | evento | 28,7% |
| `cuidar_de_doente` | acao | 28,6% |
| `natacao_no_clube` | acao | 28,4% |
| `caminhada` | acao | 28,4% |
| `copa_do_mundo` | evento | 28,2% |
| `ajudar_em_casa` | acao | 27,9% |
| `bilhete_carinhoso` | npc | 27,5% |
| `acidente_em_casa` | evento | 27,4% |
| `vontade_viagem_com_amigo` | npc | 26,7% |
| `viagem_dos_sonhos` | evento | 26,5% |
| `piada_no_grupo` | npc | 26,2% |
| `estudar_faculdade` | acao | 25,4% |
| `check_up` | acao | 25,3% |
| `colesterol_alto` | evento | 25,2% |
| `amor_quer_casar` | npc | 25,1% |
| `visitar_o_tumulo` | acao | 25,0% |
| `banda_garagem` | evento | 24,7% |
| `festa_80` | evento | 24,6% |
| `perdeu_aniversario` | npc | 24,6% |
| `vontade_voltar_a_terra` | npc | 24,5% |
| `pelada` | acao | 24,5% |
| `vape_festa` | evento | 24,4% |
| `show_no_estadio` | acao | 24,4% |
| `salario_em_dolar` | evento | 24,4% |
| `guardar_dinheiro` | acao | 24,2% |
| `historias_ou_telas` | evento | 23,9% |
| `cachorro_caramelo` | evento | 23,8% |
| `filho` | npc | 23,3% |
| `investir_tesouro` | acao | 23,2% |
| `hidro_com_a_turma` | acao | 23,2% |
| `filho_adolescente` | evento | 23,1% |
| `curso_nota_alta` | evento | 23,1% |
| `golpe_pix` | evento | 23,0% |
| `primeiro_celular` | evento | 22,9% |
| `casamento` | npc | 22,9% |
| `amigo_pede_dinheiro` | evento | 22,7% |
| `oportunidade_de_negocio` | evento | 22,1% |
| `carro` | evento | 22,1% |
| `bico_adolescente` | acao | 21,6% |
| `vacina_no_posto` | evento | 21,5% |
| `bet` | evento | 21,5% |
| `festa_junina` | evento | 21,4% |
| `viagem_realizada` | evento | 21,4% |
| `doar_sangue` | evento | 21,4% |
| `avo_conta_historias` | npc | 21,4% |
| `investimento_furado` | evento | 21,2% |
| `emprego_saude` | evento | 20,8% |
| `rebalancear` | acao | 20,7% |
| `pelada_de_quinta` | evento | 20,6% |
| `cozinhar_com_a_avo` | acao | 20,5% |
| `esporte_depois_da_aula` | evento | 20,3% |
| `hora_extra` | acao | 20,3% |
| `voltar_a_estudar` | acao | 20,2% |
| `criptomoeda` | evento | 19,9% |
| `festa_tema` | evento | 19,8% |
| `vontade_de_um_bicho` | npc | 19,8% |
| `crise_la_fora` | evento | 19,7% |
| `futebol_de_varzea` | acao | 19,5% |
| `largar_tudo` | evento | 19,4% |
| `tempo_com_amor` | acao | 19,3% |
| `pisa_em_ovos` | npc | 19,2% |
| `empresa_quebrou` | evento | 19,2% |
| `cursinho_pago` | acao | 19,1% |
| `ceia_de_natal` | evento | 18,7% |
| `festa_da_cidade` | acao | 18,6% |
| `pensar_em_adotar` | evento | 18,4% |
| `reforma_da_casa` | evento | 18,4% |
| `casa_dos_pais` | evento | 18,3% |
| `proposta_na_expansao` | evento | 18,3% |
| `filho_formatura` | evento | 18,1% |
| `feira_ciencias` | evento | 18,0% |
| `mesada` | evento | 17,9% |
| `data_da_partida` | evento | 17,8% |
| `desempregado` | evento | 17,6% |
| `viajar_com_o_amigo` | acao | 17,6% |
| `primeira_palavra` | evento | 17,6% |
| `vaquinha_do_vizinho` | evento | 17,6% |
| `previdencia` | acao | 17,5% |
| `pai_ausente_volta` | npc | 17,5% |
| `tatuagem` | evento | 17,5% |
| `bolao_do_trabalho` | evento | 17,2% |
| `hobby_horta` | evento | 17,2% |
| `encontro` | acao | 17,2% |
| `reencontro_da_turma` | evento | 17,2% |
| `pede_um_favor_a_voce` | npc | 17,1% |
| `cortar_gastos` | acao | 17,0% |
| `sair_de_casa` | evento | 16,9% |
| `vender_doce` | acao | 16,8% |
| `entregas` | acao | 16,7% |
| `heranca_do_tio` | evento | 16,5% |
| `vizinho_barulhento` | evento | 16,4% |
| `subir_de_padrao` | evento | 16,2% |
| `festa_sem_pais` | evento | 15,8% |
| `curso_nota_media` | evento | 15,8% |
| `juros_compostos` | evento | 15,7% |
| `irmao_mora_longe` | evento | 15,6% |
| `assalto_na_rua` | evento | 15,4% |
| `primeiro_cupom` | evento | 15,2% |
| `pede_ajuda` | npc | 15,0% |
| `catapora` | evento | 14,9% |
| `ingles_crianca` | acao | 14,9% |
| `franquia` | evento | 14,8% |
| `orgulho_da_formatura` | npc | 14,7% |
| `bateu_o_carro` | evento | 14,7% |
| `moeda_digital` | evento | 14,6% |
| `voltar_estudar` | evento | 14,3% |
| `fazenda_a_venda` | evento | 14,1% |
| `ceu_de_fumaca` | evento | 14,1% |
| `mudar_para_a_praia` | evento | 13,7% |
| `festa_de_sao_joao` | evento | 13,7% |
| `sabado_com_os_sobrinhos` | evento | 13,7% |
| `bloco_de_carnaval` | evento | 13,6% |
| `casa_propria` | evento | 13,2% |
| `hidroginastica` | evento | 13,2% |
| `baile_da_terceira_idade` | evento | 13,1% |
| `fome_no_fim_do_mes` | evento | 12,9% |
| `amigo_devolve` | npc | 12,9% |
| `reencontro_amigo` | evento | 12,7% |
| `carteira_da_diarista` | evento | 12,7% |
| `leu_antes_dos_colegas` | evento | 12,7% |
| `cripto_fomo` | evento | 12,6% |
| `cirurgia_de_catarata` | evento | 12,5% |
| `pais_envelhece` | evento | 12,5% |
| `entregador_chuva` | evento | 12,3% |
| `aula_de_musica` | evento | 12,1% |
| `corte_de_salario` | evento | 12,1% |
| `imovel_valorizou` | evento | 12,0% |
| `levar_ao_mar` | acao | 11,9% |
| `irmao_mais_velho_defende` | evento | 11,9% |
| `convite_para_palestrar` | evento | 11,8% |
| `reuniao_de_condominio` | evento | 11,8% |
| `promocao` | evento | 11,8% |
| `imposto_alto_no_contracheque` | evento | 11,8% |
| `investimento_rotina` | evento | 11,7% |
| `peneira` | evento | 11,6% |
| `dolar_barato` | evento | 11,6% |
| `idh_muito_alto` | evento | 11,6% |
| `balcao_negocio` | acao | 11,6% |
| `convite_do_luxo` | evento | 11,5% |
| `alavancagem` | evento | 11,4% |
| `parar_de_fumar` | acao | 11,3% |
| `vaga_sobrando` | evento | 11,3% |
| `a_vacina_no_posto` | evento | 11,2% |
| `socorro_com_as_criancas` | acao | 11,2% |
| `imposto_baixo_sobrou` | evento | 11,1% |
| `cofrinho` | acao | 10,9% |
| `multa_e_batida` | evento | 10,9% |
| `golpe_do_falso_neto` | evento | 10,9% |
| `escrever_memorias` | evento | 10,9% |
| `maratona` | evento | 10,8% |
| `esporte_escola` | acao | 10,8% |
| `brigas_de_madrugada` | evento | 10,8% |
| `sovina_ou_sabio` | evento | 10,7% |
| `separacao_dos_pais` | evento | 10,7% |
| `feira_de_ciencias` | evento | 10,6% |
| `alugueis_dos_fundos` | evento | 10,5% |
| `aniversario_da_infancia` | evento | 10,5% |
| `surpresa_do_amor` | npc | 10,4% |
| `juros_altos_rendendo` | evento | 10,4% |
| `mais_um_filho` | npc | 10,3% |
| `bolsa_la_fora` | evento | 10,3% |
| `greve_dos_onibus` | evento | 10,2% |
| `casa_cheia` | evento | 10,2% |
| `separacao` | evento | 10,1% |
| `role` | acao | 10,1% |
| `rua_tranquila` | evento | 10,1% |
| `concorrente_gigante` | evento | 10,0% |
| `casa_na_praia` | evento | 10,0% |
| `compra_por_impulso` | evento | 9,9% |
| `brincar_com_irmao_avo` | acao | 9,9% |
| `praia` | acao | 9,9% |
| `quarto_dividido` | evento | 9,9% |
| `negocio_no_aperto` | evento | 9,8% |
| `produto_viralizou` | evento | 9,8% |
| `testamento` | evento | 9,8% |
| `pobreza_na_porta` | evento | 9,7% |
| `casamento_na_igreja` | npc | 9,7% |
| `bolsa_de_estudos` | evento | 9,6% |
| `assalto_no_onibus` | evento | 9,5% |
| `consorcio` | evento | 9,5% |
| `comer_tudo` | acao | 9,4% |
| `gerente_do_banco` | evento | 9,3% |
| `fugir_inflacao` | acao | 9,3% |
| `brincar_com_o_pai` | acao | 9,2% |
| `apartamento_na_planta` | evento | 9,1% |
| `recomecar_amor` | acao | 9,1% |
| `brincar_na_rua` | acao | 9,0% |
| `seca_no_sertao` | evento | 9,0% |
| `pib_recorde` | evento | 9,0% |
| `colo_da_avo` | acao | 8,9% |
| `bolsa_subiu_sem_voce` | evento | 8,9% |
| `cartao_credito` | evento | 8,8% |
| `socio_sumiu` | evento | 8,8% |
| `padrao_de_vida` | evento | 8,8% |
| `peito_chiando` | evento | 8,8% |
| `chimarrao` | acao | 8,7% |
| `brincar_amigos` | acao | 8,7% |
| `cheia_do_rio` | evento | 8,6% |
| `retiro_da_igreja` | evento | 8,5% |
| `chefe_hora_extra` | npc | 8,5% |
| `sao_joao` | acao | 8,4% |
| `chefe_novo` | evento | 8,4% |
| `juros_baixos_euforia` | evento | 8,3% |
| `remorso_aperta` | evento | 8,3% |
| `ressaca_do_mar` | evento | 8,2% |
| `briga_em_casa` | npc | 8,2% |
| `irmao_doente` | evento | 8,2% |
| `mudanca_de_escola` | evento | 8,2% |
| `aposentadoria_ativa` | evento | 8,2% |
| `atendimento_robo` | evento | 8,2% |
| `vontade_ver_o_neto` | npc | 8,1% |
| `pousada_na_praia` | evento | 8,1% |
| `crise_40` | evento | 8,1% |
| `queda` | evento | 8,0% |
| `conteudo_extra` | acao | 8,0% |
| `amor_piada_interna` | npc | 8,0% |
| `passear_de_carrinho` | acao | 7,9% |
| `olimpiada_matematica` | evento | 7,9% |
| `dolar_disparou` | evento | 7,8% |
| `titulo_eleitor` | evento | 7,7% |
| `investidor_anjo` | evento | 7,6% |
| `noite_de_stand_up` | evento | 7,5% |
| `pede_emprestado_a_voce` | npc | 7,5% |
| `edital_de_cultura` | evento | 7,5% |
| `fundo_da_familia` | npc | 7,5% |
| `festival_do_boi` | evento | 7,5% |
| `chefe_injusto` | evento | 7,4% |
| `desigualdade_no_jornal` | evento | 7,4% |
| `festa_surpresa` | evento | 7,3% |
| `levar_a_terra_natal` | acao | 7,3% |
| `pular_corda` | acao | 7,3% |
| `inquilino_dos_sonhos` | evento | 7,3% |
| `festa_de_15` | evento | 7,3% |
| `ciume_do_bebe_novo` | evento | 7,3% |
| `boi_bumba` | acao | 7,2% |
| `dente_de_leite` | evento | 7,2% |
| `filho_desenho` | npc | 7,2% |
| `amor_proposta_fora` | npc | 7,1% |
| `soltar_pipa` | acao | 7,1% |
| `geada_no_sul` | evento | 7,1% |
| `inquilino_sumiu` | evento | 7,1% |
| `blitz_toda_noite` | evento | 7,0% |
| `ouvido_para_musica` | evento | 7,0% |
| `desemprego_em_alta` | evento | 7,0% |
| `estatua` | jogada | 7,0% |
| `figurinha_repetida` | acao | 6,9% |
| `ponto_comercial` | evento | 6,9% |
| `apagao_no_morro` | evento | 6,8% |
| `voce_mudou` | npc | 6,8% |
| `vicio_aposta` | evento | 6,8% |
| `cidadania_italiana` | evento | 6,7% |
| `cripto_disparou` | evento | 6,7% |
| `ciumes_do_irmao` | evento | 6,5% |
| `enchente_na_rua` | evento | 6,5% |
| `pressao_alta` | evento | 6,5% |
| `geladeira_vazia` | evento | 6,4% |
| `nao_acredita_mais` | npc | 6,4% |
| `inflacao_no_mercado` | evento | 6,3% |
| `mei_negocio` | evento | 6,3% |
| `herdeiro_gastao` | evento | 6,2% |
| `tempo_com_filho` | acao | 6,2% |
| `fiscalizacao` | evento | 6,2% |
| `adocao_chegou` | evento | 6,0% |
| `pescaria_no_pantanal` | evento | 5,9% |
| `mutirao_de_cirurgias` | evento | 5,9% |
| `tocar_no_bar` | acao | 5,9% |
| `nome_sujo` | evento | 5,8% |
| `auxilio_na_conta` | evento | 5,8% |
| `romance_no_trabalho` | evento | 5,8% |
| `faculdade_vida` | evento | 5,7% |
| `filho_imitacao` | npc | 5,6% |
| `bico_na_expansao` | evento | 5,6% |
| `plantao_lotado` | evento | 5,5% |
| `colega_rouba_ideia` | npc | 5,5% |
| `idh_em_queda` | evento | 5,5% |
| `grupo_de_jovens` | evento | 5,5% |
| `concurso_lotado` | evento | 5,5% |
| `assembleia_do_predio` | evento | 5,4% |
| `merenda` | evento | 5,4% |
| `briga_dos_pais` | evento | 5,4% |
| `vender_doce_nato` | acao | 5,3% |
| `colega_de_licenca` | evento | 5,2% |
| `propina_da_empreiteira` | evento | 5,2% |
| `family_office` | evento | 5,1% |
| `cripto_de_novo` | acao | 5,1% |
| `crise_de_ansiedade` | evento | 5,1% |
| `escola_publica_boa` | evento | 5,1% |
| `doenca_de_quem_ama` | evento | 5,0% |
| `festival_lotado` | evento | 5,0% |
| `chaves_do_apartamento` | evento | 5,0% |
| `estatua_pichada` | evento | 5,0% |
| `festa_do_seculo` | jogada | 4,9% |
| `paquerar_timido` | acao | 4,9% |
| `socio_da_patente` | evento | 4,8% |
| `vo_partiu` | npc | 4,8% |
| `ex_reencontro` | evento | 4,8% |
| `burnout_empresa` | evento | 4,8% |
| `moto_na_chuva` | evento | 4,7% |
| `greve_do_servidor` | evento | 4,7% |
| `festa_vazou` | evento | 4,7% |
| `vo_receita` | evento | 4,7% |
| `curso_nota_baixa` | evento | 4,7% |
| `colega_happy_hour` | npc | 4,6% |
| `proposta_de_compra` | evento | 4,6% |
| `ano_de_prejuizo` | evento | 4,6% |
| `netos` | evento | 4,5% |
| `pais_na_crise` | npc | 4,5% |
| `ex_nas_redes` | evento | 4,5% |
| `comecar_terapia` | evento | 4,5% |
| `show_no_bar` | evento | 4,5% |
| `filho_nao_veio` | npc | 4,4% |
| `pais_separados_natal` | evento | 4,4% |
| `luto_do_bicho` | npc | 4,4% |
| `operacao_policial` | evento | 4,3% |
| `obra_grande_no_norte` | evento | 4,3% |
| `asma_na_educacao_fisica` | evento | 4,3% |
| `viralizou` | evento | 4,3% |
| `escola_de_samba` | jogada | 4,3% |
| `briga_na_cozinha` | evento | 4,2% |
| `votacao_polemica` | evento | 4,2% |
| `la_fora_comprando` | evento | 4,2% |
| `emprestimo_ao_irmao` | evento | 4,2% |
| `cobranca_do_casamento` | npc | 4,1% |
| `amigo_muda_de_cidade` | npc | 4,1% |
| `blindar_contas` | acao | 4,1% |
| `tarifa_do_app` | evento | 4,1% |
| `convite_do_partido` | evento | 4,0% |
| `natal_com_politica` | evento | 4,0% |
| `vontade_casa_propria` | npc | 4,0% |
| `namorar_depois_dos_60` | evento | 3,9% |
| `bolsa_derreteu` | evento | 3,9% |
| `tentacao_no_trabalho` | evento | 3,9% |
| `piramide_no_grupo` | npc | 3,8% |
| `olimpiada` | acao | 3,8% |
| `promessa_da_mae` | evento | 3,8% |
| `intercambio_pago` | evento | 3,8% |
| `o_que_pensa_de_voce` | npc | 3,8% |
| `excursao_ao_mar` | acao | 3,8% |
| `cachoeira` | acao | 3,8% |
| `trabalho_do_pai` | acao | 3,8% |
| `processo_trabalhista` | evento | 3,8% |
| `posto_que_funciona` | evento | 3,7% |
| `cobranca_de_notas` | npc | 3,7% |
| `ex_namora_amigo` | evento | 3,7% |
| `sociedade_amigo` | evento | 3,6% |
| `pescaria_no_rio` | evento | 3,6% |
| `cobra_voce` | npc | 3,5% |
| `mae_quer_morar_junto` | npc | 3,5% |
| `vereador` | evento | 3,5% |
| `clinica_particular_contrata` | evento | 3,5% |
| `colega_cobre_voce` | npc | 3,5% |
| `agro_na_cidade` | evento | 3,5% |
| `tosse_cronica` | evento | 3,5% |
| `aprovado_concurso_estudo` | evento | 3,4% |
| `cripto_derreteu` | evento | 3,4% |
| `joelho_da_pelada` | evento | 3,4% |
| `acordo_abriu_mercado` | evento | 3,4% |
| `heranca` | evento | 3,4% |
| `bater_o_pe_com_o_chefe` | evento | 3,3% |
| `satelite_na_tv` | evento | 3,3% |
| `mutirao_da_laje` | evento | 3,3% |
| `primeiro_funcionario` | evento | 3,3% |
| `prova_concurso` | evento | 3,3% |
| `funcionario_genial` | evento | 3,2% |
| `conselho_que_diz_nao` | jogada | 3,2% |
| `filho_saude_fragil` | npc | 3,2% |
| `fundacao_com_seu_nome` | evento | 3,1% |
| `imposto_sobre_fortunas` | evento | 3,1% |
| `terapia` | acao | 3,1% |
| `ajudar_na_roca` | acao | 3,1% |
| `balcao_da_familia` | evento | 3,1% |
| `festa_surpresa_para` | npc | 3,1% |
| `amigo_pede_de_novo` | npc | 3,1% |
| `reajuste_dos_servidores` | evento | 3,0% |
| `casamento_do_filho` | evento | 3,0% |
| `confeitaria_da_vo` | evento | 3,0% |
| `alguem_especial` | evento | 3,0% |
| `greve_dos_professores` | evento | 3,0% |
| `vaga_na_capital` | evento | 3,0% |
| `depois_do_cargo` | evento | 2,9% |
| `fila_do_posto` | evento | 2,9% |
| `convite_para_candidatura` | evento | 2,9% |
| `filho_cuida` | npc | 2,9% |
| `cursinho_comunitario` | evento | 2,9% |
| `crescer_devagar` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `saudade_de_la` | evento | 2,9% |
| `este_e_o_ano` | evento | 2,8% |
| `olimpiada_do_instituto` | evento | 2,8% |
| `tentar_outra_cidade` | evento | 2,8% |
| `ex_casou` | npc | 2,7% |
| `irmao_desempregado` | npc | 2,7% |
| `importado_ficou_caro` | evento | 2,7% |
| `fim_do_amor` | npc | 2,7% |
| `compativel_para_medula` | evento | 2,7% |
| `balcao_de_crianca` | evento | 2,6% |
| `escolheu_bem` | npc | 2,6% |
| `proposta_sao_paulo` | evento | 2,6% |
| `assumir_negocio` | evento | 2,6% |
| `clientes_sumiram` | evento | 2,6% |
| `convite_igreja` | npc | 2,6% |
| `aposentadoria_nao_da` | npc | 2,6% |
| `voltar_com_o_ex` | npc | 2,5% |
| `joias_no_cofre` | evento | 2,5% |
| `fiador` | npc | 2,5% |
| `governo_que_voce_elegeu_frente_popular` | evento | 2,5% |
| `so_aparece_por_dinheiro` | npc | 2,5% |
| `dolar_virou_salario` | evento | 2,5% |
| `apresentacao_para_a_diretoria` | evento | 2,5% |
| `programa_de_moradia` | evento | 2,4% |
| `depois_da_venda` | evento | 2,4% |
| `mensalidade_da_escola` | npc | 2,4% |
| `amor_quer_mudar_de_carreira` | npc | 2,3% |
| `volta_terra` | evento | 2,3% |
| `shows_cancelados` | evento | 2,3% |
| `carregar_a_geladeira` | evento | 2,2% |
| `crise_no_setor` | evento | 2,2% |
| `reencontro_paixao` | evento | 2,2% |
| `filho_quer_carro` | evento | 2,1% |
| `recaida_cigarro` | evento | 2,1% |
| `ferias_do_dono` | evento | 2,1% |
| `imovel_na_baixa` | evento | 2,1% |
| `gorjeta_boa` | evento | 2,1% |
| `netos_nas_ferias` | evento | 2,1% |
| `ainda_mora_com_pais` | evento | 2,1% |
| `seguranca_particular` | evento | 2,1% |
| `surto_no_bairro` | evento | 2,1% |
| `bancar_quem_sai` | jogada | 2,1% |
| `faculdade_depois_dos_60` | npc | 2,1% |
| `emprego_tecnologia` | evento | 2,0% |
| `juros_altos` | evento | 2,0% |
| `amigo_sumiu_e_voltou` | npc | 2,0% |
| `cobranca_da_magoa` | npc | 2,0% |
| `crianca_ansiosa` | evento | 2,0% |
| `filho_primeiro_salario` | npc | 1,9% |
| `ex_saudade_de_quem_foi` | evento | 1,9% |
| `plano_de_saude_subiu` | evento | 1,9% |
| `hospital_sem_insumo` | evento | 1,9% |
| `missa_em_familia` | acao | 1,9% |
| `aposentado_quer_ajudar_na_empresa` | npc | 1,9% |
| `rodada_grande` | evento | 1,8% |
| `obra_ou_hospital` | evento | 1,8% |
| `filho_passou_longe` | npc | 1,8% |
| `ex_liga_de_madrugada` | npc | 1,8% |
| `cidadania_do_bisavo` | evento | 1,8% |
| `briga_por_heranca` | evento | 1,8% |
| `black_friday` | evento | 1,8% |
| `enchente_na_cidade` | evento | 1,8% |
| `expandir_na_alta` | evento | 1,8% |
| `birra_no_mercado` | evento | 1,8% |
| `emprestimo_de_volta` | evento | 1,8% |
| `arrojado_na_queda` | evento | 1,8% |
| `carreira_futebol` | evento | 1,7% |
| `obra_do_predio` | evento | 1,7% |
| `renegociar_divida` | evento | 1,7% |
| `duas_empresas_uma_agenda` | evento | 1,7% |
| `gravidez_surpresa` | npc | 1,7% |
| `ocorrencia_perigosa` | evento | 1,7% |
| `um_bicho_para_o_filho` | acao | 1,7% |
| `cupula_la_fora` | evento | 1,7% |
| `segundo_carro` | evento | 1,7% |
| `cancelado` | evento | 1,6% |
| `escola_integral` | evento | 1,6% |
| `ajudar_na_coleta` | evento | 1,6% |
| `bodas_de_prata` | evento | 1,6% |
| `padrao_aperta` | evento | 1,6% |
| `passear_pet` | acao | 1,6% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,6% |
| `irmaos_brigam` | evento | 1,6% |
| `ferias_com_a_familia_do_amor` | npc | 1,5% |
| `mural_de_problemas` | jogada | 1,5% |
| `convite_para_o_palco_grande` | evento | 1,5% |
| `ex_cobra` | npc | 1,5% |
| `salario_parcelado` | evento | 1,5% |
| `conselho_de_fachada` | evento | 1,5% |
| `apuracao_do_carnaval` | evento | 1,5% |
| `embaixador_pede` | evento | 1,5% |
| `amigo_lembra_zoeira` | npc | 1,4% |
| `cara_de_comercial` | evento | 1,4% |
| `time_a_venda` | evento | 1,4% |
| `homenagem_no_trabalho` | evento | 1,4% |
| `dizimo` | evento | 1,4% |
| `reforma_sem_fim` | evento | 1,4% |
| `carona_de_madrugada` | npc | 1,4% |
| `lesao_grave` | evento | 1,4% |
| `amor_paga_a_conta` | npc | 1,4% |
| `sair_de_casa_cedo` | evento | 1,4% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,4% |
| `oferece_ajuda` | npc | 1,3% |
| `nega_ajuda` | npc | 1,3% |
| `lembranca_primeiro_amor` | evento | 1,3% |
| `visitar_de_longe` | acao | 1,3% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,3% |
| `governo_que_voce_elegeu_centrao` | evento | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `rompimento` | npc | 1,3% |
| `presidir_cpi` | evento | 1,3% |
| `fronteira_fechada` | evento | 1,3% |
| `frete_sumiu` | evento | 1,3% |
| `familia_descobre_o_testamento` | evento | 1,2% |
| `retirada_demais` | evento | 1,2% |
| `cuidar_netos` | acao | 1,2% |
| `promocao_em_outra_cidade` | evento | 1,2% |
| `foto_de_campanha` | evento | 1,2% |
| `hit_viral` | evento | 1,2% |
| `sucessao_regime` | evento | 1,2% |
| `pix_para_a_cidade` | jogada | 1,1% |
| `equipe_para_desmontar` | jogada | 1,1% |
| `o_conselho_vetou` | evento | 1,1% |
| `irmao_aposentou` | evento | 1,1% |
| `acoes_da_startup` | evento | 1,1% |
| `aniversario_de_gemeos` | evento | 1,1% |
| `jantar_esfriou` | npc | 1,1% |
| `preco_do_pao` | evento | 1,1% |
| `vida_depois_da_condenacao` | evento | 1,1% |
| `emprego_educacao` | evento | 1,1% |
| `bolsa_de_iniciacao` | evento | 1,1% |
| `ex_internado` | evento | 1,1% |
| `amor_quadro_de_tarefas` | npc | 1,0% |
| `cobranca_do_filho` | npc | 1,0% |
| `cobranca_no_telefone` | evento | 1,0% |
| `pane_no_voo` | evento | 1,0% |
| `chefe_amigo` | evento | 1,0% |
| `paparazzi` | evento | 1,0% |
| `critico_no_salao` | evento | 1,0% |
| `dez_anos_de_empresa` | evento | 1,0% |
| `grade_na_janela` | evento | 1,0% |
| `vontade_festa_de_80` | npc | 1,0% |
| `amor_desconfia` | npc | 0,9% |
| `proposta_em_dolar` | evento | 0,9% |
| `proposta_da_europa` | evento | 0,9% |
| `o_caso_vem_a_tona` | evento | 0,9% |
| `estatua_derrubada` | evento | 0,9% |
| `holding_da_familia` | evento | 0,9% |
| `solucao_inesperada` | evento | 0,9% |
| `nao_para_quieto` | evento | 0,9% |
| `depois_do_calote` | evento | 0,9% |
| `tocar_o_negocio` | acao | 0,9% |
| `calote_no_noticiario` | evento | 0,8% |
| `mais_uma_mudanca` | evento | 0,8% |
| `apartamento_de_presente` | evento | 0,8% |
| `tornar_se_dispensavel` | jogada | 0,8% |
| `doar_em_vida` | evento | 0,8% |
| `contrato_publicitario` | evento | 0,8% |
| `protesto_na_avenida` | evento | 0,8% |
| `bancar_presidente` | jogada | 0,8% |
| `feirao_limpa_nome` | evento | 0,8% |
| `amigo_ficou_rico` | npc | 0,8% |
| `robos_na_fabrica` | evento | 0,8% |
| `lista_dos_mais_ricos` | evento | 0,8% |
| `pai_namorando_de_novo` | npc | 0,8% |
| `filho_cuida_de_voce` | npc | 0,8% |
| `greve_da_federal` | evento | 0,8% |
| `chefe_elogia` | npc | 0,8% |
| `segredo_de_familia` | npc | 0,8% |
| `deploy_de_sexta` | evento | 0,8% |
| `set_de_gravacao` | evento | 0,8% |
| `burnout` | evento | 0,7% |
| `fundacao` | jogada | 0,7% |
| `quartel_sem_verba` | evento | 0,7% |
| `vendas_recorde` | evento | 0,7% |
| `safra_da_fazenda` | evento | 0,7% |
| `exportacao_bate_recorde` | evento | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `trator_aos_dez` | evento | 0,7% |
| `intercambio` | evento | 0,7% |
| `mesa_cheia` | evento | 0,7% |
| `happy_hour` | acao | 0,7% |
| `guerra_comercial` | evento | 0,7% |
| `fazer_as_pazes` | acao | 0,7% |
| `a_empresa_sem_voce` | evento | 0,7% |
| `turne_nacional` | evento | 0,7% |
| `juros_altos_na_fatura` | evento | 0,7% |
| `desfile_de_sete_de_setembro` | evento | 0,7% |
| `rebaixamento` | evento | 0,7% |
| `briga_de_casal` | npc | 0,7% |
| `pedreiro_vale_ouro` | evento | 0,7% |
| `livro_viralizou` | evento | 0,7% |
| `mestrado_fora` | evento | 0,6% |
| `papel_da_vida` | evento | 0,6% |
| `vaga_na_empresa_dele` | npc | 0,6% |
| `tradutor_da_familia` | evento | 0,6% |
| `favor_do_presidente` | evento | 0,6% |
| `sancao_parou_o_porto` | evento | 0,6% |
| `divida_publica_assusta` | evento | 0,6% |
| `o_laboratorio_apaga_a_luz` | evento | 0,6% |
| `fim_de_semana_no_sitio` | evento | 0,6% |
| `obra_atrasada` | evento | 0,6% |
| `filial_fechando` | evento | 0,6% |
| `noite_da_apuracao` | evento | 0,6% |
| `treinar_no_clube` | acao | 0,5% |
| `celular_dos_pais` | npc | 0,5% |
| `pressao_carreira` | npc | 0,5% |
| `a_convocacao` | evento | 0,5% |
| `vaga_no_agro` | evento | 0,5% |
| `acampamento_na_porta` | evento | 0,5% |
| `bola_autografada` | evento | 0,5% |
| `carro_de_luxo_na_rua` | evento | 0,5% |
| `filho_briga_na_escola` | npc | 0,5% |
| `fila_do_emprego` | evento | 0,5% |
| `layoff_por_email` | evento | 0,5% |
| `oferta_pela_subsidiaria` | evento | 0,5% |
| `despejo` | evento | 0,5% |
| `peneira_do_sobrenome` | evento | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,5% |
| `infancia_no_palacio` | evento | 0,5% |
| `edital_da_ciencia` | evento | 0,5% |
| `ameaca_de_sancao` | evento | 0,5% |
| `queda_do_cargo` | evento | 0,5% |
| `filho_parou_de_contar` | npc | 0,4% |
| `segunda_chance` | npc | 0,4% |
| `racionamento` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `feriado_na_praia` | evento | 0,4% |
| `obra_parada` | evento | 0,4% |
| `circo_vai_embora` | evento | 0,4% |
| `o_mural_do_boton` | evento | 0,4% |
| `o_bicho_herdeiro` | evento | 0,4% |
| `transito_de_sp` | evento | 0,4% |
| `proposta_remota` | evento | 0,4% |
| `montadora_vai_fechar` | evento | 0,4% |
| `cobrar_divida` | acao | 0,4% |
| `guerra_na_escola` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `bonanca_no_governo` | evento | 0,4% |
| `tomar_o_poder` | jogada | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `picadeiro` | evento | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `noite_de_corridas` | evento | 0,4% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,4% |
| `internato_real` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,3% |
| `a_conta_da_coroa` | evento | 0,3% |
| `aluguel_caro` | evento | 0,3% |
| `quebra_de_safra` | evento | 0,3% |
| `mordomias_reais` | evento | 0,3% |
| `fa_obcecado` | evento | 0,3% |
| `ministro_pede_ajuste` | evento | 0,3% |
| `fabrica_de_municao` | evento | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `emprego_negocios` | evento | 0,3% |
| `fusao_de_iguais` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `assinatura_real` | evento | 0,3% |
| `aperto_do_mes` | evento | 0,3% |
| `filho_apresenta_namoro` | npc | 0,3% |
| `plantao_que_nao_acaba` | evento | 0,3% |
| `cavalo_campeao` | evento | 0,3% |
| `tentar_a_vida_na_europa` | evento | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `violencia_vira_manchete` | evento | 0,3% |
| `choque_de_culturas` | evento | 0,3% |
| `padrinho_casamento` | npc | 0,3% |
| `final_da_copa` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `oposicao_na_tv` | evento | 0,3% |
| `turno_extra_na_fabrica` | evento | 0,3% |
| `trazer_a_copa` | jogada | 0,3% |
| `greve_geral` | evento | 0,3% |
| `concurso_em_brasilia` | evento | 0,3% |
| `ferias_coletivas` | evento | 0,3% |
| `pais_envelhecem` | npc | 0,3% |
| `ajudar_com_a_casa` | acao | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `proposta_pelo_negocio` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `general_ambicioso` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `bonus_do_banco` | evento | 0,2% |
| `filho_quer_curso_caro` | npc | 0,2% |
| `leilao_da_obra` | evento | 0,2% |
| `irmao_separou` | npc | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `negocio_em_crise` | evento | 0,2% |
| `assumir_a_fazenda` | evento | 0,2% |
| `renegociar_cartao` | acao | 0,2% |
| `abrir_capital` | evento | 0,2% |
| `paparazzi_real` | evento | 0,2% |
| `regra_sob_medida` | evento | 0,2% |
| `o_veterano` | evento | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `filho_adolescente_porta` | npc | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `cura_de_doenca` | jogada | 0,2% |
| `jubileu` | evento | 0,2% |
| `reencontro_amigo_brigado` | evento | 0,2% |
| `carta_branca` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `ficar_no_poder` | jogada | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `cargo_no_gabinete` | evento | 0,2% |
| `caso_do_poderoso` | evento | 0,2% |
| `shopping_lotado` | evento | 0,2% |
| `importado_invadiu` | evento | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `clientes_em_panico` | evento | 0,2% |
| `resultado_da_pesquisa` | evento | 0,2% |
| `conselho_dos_generais` | evento | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `fim_carreira` | evento | 0,2% |
| `rival_bilionario` | evento | 0,2% |
| `vida_depois_da_coroa` | evento | 0,2% |
| `cliente_preso` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `amor_vai_embora` | npc | 0,1% |
| `zona_franca` | evento | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `operacao_no_gabinete` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `pais_aposentados` | npc | 0,1% |
| `filho_hamburgueria` | npc | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `amor_gastador` | npc | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `sequestro_frustrado` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `cliente_perdeu_tudo` | evento | 0,1% |
| `mansao_vazia` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `parcela_da_tv` | npc | 0,1% |
| `reconciliacao` | npc | 0,1% |
| `filho_convocado` | evento | 0,1% |
| `royalties_secaram` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `casamento_real` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `grupo_na_capa` | evento | 0,1% |
| `presidente_pediu_as_contas` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `as_criancas_perguntam` | npc | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `lancamento` | evento | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `nova_tentativa_da_pesquisa` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `restaurar_a_monarquia` | jogada | 0,1% |
| `filho_distante` | npc | 0,0% |
| `chefe_magoado_cobra` | npc | 0,0% |
| `devedor_some` | npc | 0,0% |
| `bolsa_na_faculdade` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `documentario` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `caramelo_envelhece` | npc | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 200 · **mudaram algo em pelo menos uma vida:** 200
- **Qualidades que nunca dispararam nada:** `cidade_em_obras`

## Distribuições

**Idade de morte** — média 70,4 · p10 53 · p25 61 · mediana 70 · p75 81 · p90 88

```
até 19                                        0,3%
20–29                                         0,4%
30–39          █                              0,7%
40–49          █████                          4,2%
50–59          ██████████████████             15,7%
60–69          ██████████████████████████████ 26,5%
70–79          ████████████████████████████   24,6%
80–89          ███████████████████████        20,5%
90–99          ███████                        6,3%
100+           █                              0,8%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 232 mil · p25 R$ 730 mil · mediana R$ 3,2 milhões · p75 R$ 28 milhões · p90 R$ 107 milhões

```
negativo       █                              0,8%
até 10 mil                                    0,5%
10–50 mil      █                              1,6%
50–200 mil     ████                           5,9%
200 mil–1 mi   ███████████████                21,7%
1–5 mi         █████████████████              25,1%
5 mi+          ██████████████████████████████ 44,4%
```

**Felicidade média ao longo da vida** — p10 61 · mediana 74 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,9%
50–59          █████                          7,4%
60–69          ██████████████████             25,4%
70–79          ██████████████████████████████ 41,7%
80+            ██████████████████             24,5%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 66,1 | R$ 987 mil | 68,1 | 58,3 | 162,2 | 65,5 | 100% | 53% |
| cautelosa | 82,6 🏆 | R$ 44 milhões 🏆 | 76,8 | 68,1 | 197,6 | 67,1 | 100% | 60% |
| arriscada | 57,5 | R$ 2,3 milhões | 78,8 🏆 | 52,6 | 139,9 | 89,6 | 100% | 49% |
| aleatoria | 75,2 | R$ 1,7 milhão | 69,7 | 64,2 | 136,1 | 69,4 | 100% | 50% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,9% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,8% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,2% — de um AVC, numa terça-feira sem graça
- 7,5% — de pneumonia, depois de teimar que era só uma gripe
- 6,6% — numa cirurgia simples que não foi tão simples
- 5,6% — de complicações de uma queda no banheiro
- 5,4% — de velhice, dormindo, num domingo depois do almoço
- 4,5% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
