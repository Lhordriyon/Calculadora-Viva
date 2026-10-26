# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 589 eventos, 115 de personagens, 109 ações, 1654 escolhas, 239 linhas, 145 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 3909380 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4460104 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 567 mil |
| Ações do ano | o mercado | 99,9% | R$ 43 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 17 mil |
| Custo de vida | o mercado | 99,9% | -R$ 630 mil |
| Padrão de vida | o mercado | 99,8% | -R$ 5,5 milhões |
| Bico | o mercado | 99,4% | R$ 45 mil |
| Salário | o mercado | 96,4% | R$ 3,8 milhões |
| Juro da renda fixa | o governo | 90,5% | R$ 222 mil |
| Cotação dos investimentos | os preços | 87,5% | R$ 1,3 milhão |
| Imposto | o governo | 85,2% | -R$ 62 mil |
| Imposto mais baixo | o governo | 82,1% | R$ 62 mil |
| Auxílio | o governo | 81,5% | R$ 17 mil |
| Juros da dívida | o banco | 79,4% | -R$ 2,3 mil |
| Compras e vendas | o mercado | 73,9% | -R$ 1,6 milhão |
| Manutenção dos bens | o mercado | 73,9% | -R$ 621 mil |
| Gastos da velhice | o mercado | 62,6% | -R$ 1,3 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 4,3% | 5,0 | 4,4% | 2,0% | 0,0% | 2,4% |
| cautelosa | 0,0% | 2,1% | 0,0 | 2,1% | 0,0% | 0,0% | 0,0% |
| arriscada | 93,1% | 30,0% | 1,0 | 16,4% | 3,9% | 22,9% | 22,8% |
| aleatoria | 48,7% | 14,1% | 1,0 | 8,2% | 1,4% | 9,8% | 9,6% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,6% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,80 anos com acordo (716 vezes) × 2,82 sem (440 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 23,0% de 3545 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,8% das vidas; 14,3% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 39,9% | R$ 61 mil | 866 | 0 (0) | 0,9% | R$ 67 mil (3 vidas) |
| cautelosa | 99,3% | 6,9 | 59,1% | R$ 1,9 milhão | 17511 | 48 (31) | 1,3% | R$ 97 mil (10 vidas) |
| arriscada | 0,0% | — | 19,0% | R$ 6,3 mil | 185 | 219 (121) | 2,4% | R$ 564 milhões (39 vidas) |
| aleatoria | 87,9% | 2,4 | 19,9% | R$ 23 mil | 3629 | 1673 (820) | 1,1% | R$ 60 mil (11 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 99,3%, arriscada 0,0%, aleatoria 87,9% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,4% (143 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 178 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2803 | R$ 3,9 milhões | 0,4 |
| parte dos impostos | 1142 | R$ 2 bilhão | 1,1 |
| taxa da coroa | 1365 | R$ 26 bilhões | 0,4 |

A ilha: 31 vidas fundaram ou herdaram uma. População no fim: p10 2338, mediana 2728, p90 3851.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 0,4 quedas por 100 anos com a taxa (1365 anos) × 0,4 com o salário (2803 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 31 ilhas; mediana de 2830 habitantes sem a taxa (26) e 1690 com 5 anos ou mais de taxa (1) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 171120 | -0,70 |
| regular | 346428 | -0,04 |
| prioridade | 188259 | +0,75 |

A tecnologia ao morrer: p10 42,4, mediana 49,6, p90 58,5. Descobertas por 100 vidas: a cura 16,8, o satélite 16,9, a patente 16,1; 28,2% das vidas veem uma. A fuga de cérebros: 26,0% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (171120 anos) · regular -0,04 por ano (346428 anos) · prioridade +0,75 por ano (188259 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,4 · mediana 49,6 · p90 58,5 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 28,2% das vidas; 88,9% de 4981 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 180142 | -0,84 |
| regular | 343482 | -0,01 |
| reforçada | 182183 | +0,85 |

A capacidade ao morrer: p10 43,3, mediana 49,7, p90 57,7. Encomendas por 100 vidas: 6,1 (561 entregas). Guerras por 100 vidas: 3,2, em 3,1% das vidas; acabaram em vitória 72, derrota 90 e cessar-fogo 139, com 3,4 anos em média. Pedidos de paz: 3; convocações: 62; 0,3% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,84 por ano (180142 anos) · regular -0,01 por ano (343482 anos) · reforçada +0,85 por ano (182183 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 3,1% das vidas; 91,8% de 318 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 4,0% de 4933 anos · forte: 2,6% de 4721 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ✅ | -2,13% em 1069 anos de guerra · 2,09% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ✅ | a mais longa: 8 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 404 em vida (100,0% com resposta) e 112 na herança (100,0%). De 117 herdeiros que começaram na fila, 78,6% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 39 | 66,7% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 30 | 70,0% | primeira 0 · cautelosa 0 · arriscada 2 · aleatoria 0 |
| Mudar a Constituição para mais um mandato | 1 | 100,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Restaurar a monarquia no plebiscito | 40 | 30,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ✅ | em vida 100,0% de 404 · na herança 100,0% de 112 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 69 tentativas, 68,1% deram certo |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 23 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,36 ms | 2,4% | 32,6 KB | — | guerra, pais, pesquisa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,59 ms | 0,6% | 0,0 KB | exterior | pais, pesquisa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 5,19 ms | 5,2% | 58,9 KB | exterior, guerra | pesquisa, economia, empresa, bens, tesouro, dividas, personagens, poder, coroa, iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,19 ms | 0,2% | 0,4 KB | guerra, pais | poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,66 ms | 0,7% | 18,4 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,80 ms | 1,8% | 29,2 KB | pais, mercado | empresa, bens, tesouro, dividas, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,47 ms | 0,5% | 3,5 KB | exterior, guerra, pais, pesquisa, mercado, economia | bens, tesouro, dividas, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,03 ms | 1,0% | 15,4 KB | pais, mercado, economia, empresa | tesouro, dividas, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,33 ms | 0,3% | 3,0 KB | pais, economia, empresa, bens | dividas, personagens, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,34 ms | 0,3% | 0,3 KB | pais, economia, empresa, bens, tesouro | personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,05 ms | 0,1% | 0,0 KB | economia | corpo, personagens, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,94 ms | 1,9% | 21,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, privacao | personagens, trabalho, carreira, poder, coroa, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 3,20 ms | 3,2% | 44,9 KB | pais, economia, empresa, bens, tesouro, dividas, privacao, corpo | iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,19 ms | 0,2% | 1,7 KB | pais | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,48 ms | 0,5% | 1,9 KB | pais, corpo, trabalho | poder, coroa, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,75 ms | 0,8% | 4,0 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,14 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,05 ms | 0,0% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, personagens | iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,97 ms | 1,0% | 0,0 KB | privacao, corpo, personagens | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,47 ms | 0,5% | 0,3 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, privacao, corpo, personagens, trabalho, carreira, poder, coroa | iniciativas, diretor |
| amor (o amor que aparece) | 0,10 ms | 0,1% | 0,0 KB | corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 15,00 ms | 15,0% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 19,28 ms | 19,3% | 1,6 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 44,46 ms | 44,4% | — | — | — |

O save de uma vida (amostra de 1040): mediana 311 KB, p90 420 KB, máximo 527 KB; o livro é 97,1% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 527 KB (mediana 311 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 100,05 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 70,0% | 18,5% | 9,8% | 1,6% | 0,1% |

Entre as vidas com filhos (30,0%), a média é de 1,44 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 11,5% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 13,3% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 55,1% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 915 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,68 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 457,9 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 13,3% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 16,7% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ❌ | 2,8% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,33 |
| Saturação V20 ≤ 95% | ✅ | 90,1% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 915 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 100,05 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 83,2% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 54,8% (168 dinastias, média de 3,0 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,83 (333 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 8,86% (p99 R$ 1,4 bilhão, maior R$ 1,3 trilhão) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,41% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,0% de 57,0% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 16,9% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 90,1% |
| Assinaturas sem regressão (≥ 918) | ❌ | 915 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 457,9 |
| CPU por vida ≤ 30 ms | ❌ | 100,05 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 96,6% (10,2 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 70,5% de 3856 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (699), A festa do século (591), Pix para a cidade inteira (344), Uma estátua sua (264), Um conselho que diz não (211), Uma equipe para desmontar (172), Uma fundação com seu nome (164), Bancar um presidente (162), Um mural de problemas (141), Tornar-se dispensável (140), Trazer a Copa do Mundo (137), Bancar quem quer sair (136), Um programa espacial (116), Pagar a cura de uma doença (114), Tomar o poder (105), Restaurar a monarquia (75), Ficar no poder (70), Fundar uma cidade (68), Comprar a estatal (64), Uma colônia em Marte (33), Fundar um país (29), Salvar o país da crise (21).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 3 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 40,1% de 1904 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 24,7% delegaram, 53,1% centralizaram (833 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 36,6% (29,4 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (744), Bancar quem quer sair (431), Um mural de problemas (393), Uma equipe para desmontar (393), Tornar-se dispensável (297).
- **Na morte de quem manda:** a empresa perde em média 25,2% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 18 anos (7691 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 61,1% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 62,9% / 24,7% / 10,0% / 2,4% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,2 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,0%, o bloco liberal 24,4%, a aliança da ordem 25,1%, o centrão 24,6%; 8,4 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,72% × 1,88%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 84% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,27% contra 0,70% por ano (38537 e 54631 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,56 votos por vida, 31,3% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,39 × 0,51 pontos do PIB por ano (146 e 185 governos); 96,5% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,3% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 197.818 | 1,9% | 8,2% | 5,2% | 82% | 21,0% | 20,4 | 58 | 55 | 50% |
| a aliança da ordem | 190.827 | 1,7% | 8,4% | 5,8% | 73% | 29,5% | 17,6 | 50 | 45 | 52% |
| o centrão | 187.251 | 2,1% | 8,3% | 5,1% | 84% | 25,1% | 21,4 | 50 | 50 | 55% |
| o bloco liberal | 185.538 | 2,7% | 8,5% | 4,6% | 81% | 29,5% | 22,1 | 43 | 50 | 51% |
| quem joga | 12.587 | 1,6% | 8,8% | 5,4% | 80% | 25,9% | 18,9 | 51 | 49 | 51% |
| o regime | 5.938 | 1,0% | 9,5% | 5,3% | 39% | 32,1% | 17,1 | 37 | 37 | 46% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,9% de 6662 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,2% fundiram, 6,2% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 3403 (p99 268) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,33 ponto em média (29351 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,36 na bolsa (8440 empresas-ano) × -0,00 fechadas (107973) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,0% de 37555 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,15 · mediana R$ 5,11 · p90 R$ 6,36 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,28 no agro (4701 empresas-ano) × -0,32 no comércio (31739), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 34,9%, acordo em 74,7%; 95,4% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,0% de 5260 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,89% × 0,14% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,67% × 0,35% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 74,4% de 399 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 197.818 | 0,16% | 2,93% |
| a aliança da ordem | 190.827 | 1,93% | 0,35% |
| o centrão | 187.251 | 0,16% | 0,58% |
| o bloco liberal | 185.538 | 0,26% | 3,67% |
| quem joga | 12.587 | 2,04% | 3,84% |
| o regime | 5.938 | 3,77% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,829, Gini 0,530, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,798–0,867, Gini 0,483–0,562 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 10,9% · desigualdade_no_jornal 8,9% · idh_muito_alto 13,1% · idh_em_queda 6,6% · pais_envelhece 13,4% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,798 | 0,829 | 0,867 |
| Desigualdade (Gini) | 0,483 | 0,530 | 0,562 |
| População (milhões) | 179 | 193 | 207 |
| PIB per capita | R$ 118 mil | R$ 248 mil | R$ 588 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 55,1% / 90,1% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 62,8% |
| Efeito da memória (aleatória, V5 sem → com memória) | 62,5% → 52,1% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 915 (592) |
| Mobilidade: mesmo quintil da origem ao fim | 27,3% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 16,7% / 2,8% |
| Patrimônio p90/p10 | 595,0× (p10 R$ 276 mil, p90 R$ 164 milhões) |
| Desvio-padrão da felicidade média da vida | 8,68 |
| Vidas com patrimônio negativo ao morrer | 0,7% |
| Mudanças de estado causadas pelo jogador | 44,6% |
| Toques por vida | 457,9 |
| Tempo de CPU por vida | 100,05 ms |
| Ações (fichas usadas) por vida | 158,9 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 13,3% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 25,9 |
| Vidas que terminam com filho ou filha para continuar | 83,2% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,0 / 54,8% / 22,6% |
| Idade de quem herda ao começar (mediana) / herança mediana | 37 anos / R$ 12 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,83 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 57,0% |
| Entre quem abriu: quebrou / vendeu | 28,0% / 25,4% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2 milhões / R$ 87 milhões / R$ 1,4 bilhão / R$ 1,3 trilhão |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,04% / 8,86% / 1,41% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 16,9% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 60,6 / 158,9 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 833 | R$ 146 mil | R$ 1,4 milhão | R$ 35 milhões |
| moderado | 915 | R$ 156 mil | R$ 1,9 milhão | R$ 35 milhões |
| arrojado | 752 | R$ 147 mil | R$ 2,4 milhões | R$ 54 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 70,8 | R$ 1,8 milhão | 76,1 |
| pobre | 104 | 69,0 | R$ 2,2 milhões | 75,4 |
| remediada | 24 | 68,1 | R$ 1,1 milhão | 77,1 |
| media | 64 | 68,9 | R$ 2,9 milhões | 73,5 |
| rica | 64 | 67,0 | R$ 4,4 milhões | 76,9 |
| muito rica | 144 | 70,7 | R$ 18 milhões | 75,9 |
| bilionaria | 356 | 70,9 | R$ 2,8 bilhões | 77,2 |
| trilionaria | 276 | 70,8 | R$ 1 trilhão | 77,8 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 42,2 |
| Demissões por vida / vindas de uma recessão ou crise | 0,50 / 33,2% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 51% · saúde 13% · serviços 13% · cultura e internet 6% · comércio 4% · transporte e entregas 3% · agro 3% · construção 2% · tecnologia 1% · sem setor 1% · indústria 1% · finanças 0% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 21% | 34% | 46% | 55% | 77% | 85% | 90% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 22% | 16% | 14% | 17% |
| Q2 | 30% | 23% | 18% | 15% | 15% |
| Q3 | 23% | 24% | 20% | 17% | 16% |
| Q4 | 13% | 23% | 26% | 24% | 14% |
| Q5 | 3% | 7% | 21% | 30% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,0 | R$ 1,7 milhão | 75,0 |
| família pobre | 24% | 70,4 | R$ 1,5 milhão | 74,8 |
| família remediada | 20% | 71,5 | R$ 2,1 milhões | 75,1 |
| classe média | 18% | 69,9 | R$ 2,8 milhões | 74,8 |
| família rica | 13% | 70,6 | R$ 5,8 milhões | 75,0 |
| família muito rica | 13% | 70,3 | R$ 26 milhões | 75,9 |
| família bilionária | 3% | 73,0 | R$ 3,5 bilhões | 77,7 |

## Repetição

- **Dentro de uma vida:** 7,6% das aparições repetem uma instância já vista na mesma vida; pior vida: 27,6%.
- **Texto repetido entre vidas:** 29,1% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 2,8 · `aposentadoria` 1,5 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,3 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,1

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 139 de 297 (47%) · típico 138 de 297 (46%) · rico 152 de 297 (51%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `mais_um_filho`, `cobranca_da_magoa`, `cobranca_do_filho`, `amor_vai_embora`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `fazer_as_pazes`, `ajudar_com_a_casa`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `filho_convocado`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `renegociar_cartao`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `inauguracao_da_cidade`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `cidade_alagou`, `prefeito_da_cidade_nova`, `apagao`, `receita_no_seu_pe`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `noite_de_corridas`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `feriado_na_praia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `importado_invadiu`, `oposicao_na_tv`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Apresentados por vida:** 60,6 · **com causa anterior (cadeia):** 70,2 · **maior distância causa→consequência:** 48,2 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,9% |
| `namoro` | evento | 99,2% |
| `luto` | npc | 97,5% |
| `enem` | evento | 94,7% |
| `primeiro_voto` | evento | 83,1% |
| `trabalho_grande` | acao | 74,1% |
| `programa_junto` | acao | 70,8% |
| `aposentadoria` | evento | 62,4% |
| `bico_adulto` | acao | 60,9% |
| `correr_no_quintal` | acao | 60,5% |
| `ler_gibi` | acao | 58,1% |
| `cuidar_da_doenca` | npc | 58,0% |
| `formatura` | evento | 57,7% |
| `parquinho` | acao | 57,5% |
| `eleicao_geral` | evento | 55,3% |
| `conversar_de_verdade` | acao | 55,2% |
| `saudade_de_voce` | npc | 54,7% |
| `almoco_domingo` | acao | 54,6% |
| `tocar_empresa` | acao | 50,6% |
| `ligar_amigo` | acao | 49,5% |
| `curso_online` | acao | 49,5% |
| `pos_graduacao` | acao | 49,3% |
| `mochilao` | acao | 49,3% |
| `pedir_conselho` | acao | 49,0% |
| `presente_certo` | acao | 48,8% |
| `avo_mesada_escondida` | npc | 48,4% |
| `visitar_familia` | acao | 48,4% |
| `viagem_la_para_fora` | evento | 45,5% |
| `dizer_umas_verdades` | acao | 44,4% |
| `correr` | acao | 43,2% |
| `reclama_que_voce_sumiu` | npc | 42,9% |
| `estudar_concurso` | acao | 42,4% |
| `doente_crianca` | npc | 41,7% |
| `baile_terceira_idade` | acao | 41,4% |
| `pedir_um_pix` | acao | 41,3% |
| `vontade_ver_o_mar` | npc | 41,0% |
| `primeiro_emprego` | evento | 40,7% |
| `perdeu_emprego_na_crise` | npc | 39,5% |
| `demissao` | evento | 38,7% |
| `academia` | acao | 38,4% |
| `ler_livros` | acao | 36,6% |
| `estudar_escola` | acao | 36,6% |
| `balde_da_pracinha` | evento | 36,4% |
| `falando_bem_de_voce` | npc | 36,2% |
| `primeiro_investimento` | evento | 35,9% |
| `ouvir_historia` | acao | 35,8% |
| `paquerar` | acao | 34,6% |
| `pre_escola` | evento | 34,5% |
| `creche_ou_vo` | evento | 34,4% |
| `amigo_em_apuros` | npc | 34,3% |
| `estudar_enem` | acao | 33,5% |
| `primeiro_beijo` | evento | 33,2% |
| `cuidar_de_doente` | acao | 33,1% |
| `rabiscar_parede` | acao | 33,0% |
| `bullying_recreio` | evento | 33,0% |
| `acidente_em_casa` | evento | 32,7% |
| `perguntar_porque` | acao | 31,7% |
| `copa_do_mundo` | evento | 31,6% |
| `videogame_do_amigo` | acao | 30,8% |
| `estudar_tabuada` | acao | 29,6% |
| `viagem_dos_sonhos` | evento | 29,4% |
| `vontade_viagem_com_amigo` | npc | 29,2% |
| `amor_quer_casar` | npc | 28,8% |
| `banda_garagem` | evento | 28,5% |
| `natacao_no_clube` | acao | 28,3% |
| `historias_ou_telas` | evento | 28,2% |
| `caminhada` | acao | 28,1% |
| `vape_festa` | evento | 27,6% |
| `salario_em_dolar` | evento | 27,5% |
| `bilhete_carinhoso` | npc | 27,5% |
| `ajudar_em_casa` | acao | 27,5% |
| `colesterol_alto` | evento | 27,4% |
| `festa_80` | evento | 27,2% |
| `filho` | npc | 26,8% |
| `investir_tesouro` | acao | 26,8% |
| `filho_adolescente` | evento | 26,6% |
| `piada_no_grupo` | npc | 26,5% |
| `cachorro_caramelo` | evento | 26,4% |
| `estudar_faculdade` | acao | 26,2% |
| `vontade_voltar_a_terra` | npc | 26,0% |
| `curso_nota_alta` | evento | 26,0% |
| `pedir_desculpas` | acao | 25,9% |
| `visitar_o_tumulo` | acao | 25,8% |
| `primeiro_celular` | evento | 25,7% |
| `check_up` | acao | 25,6% |
| `pelada` | acao | 25,6% |
| `amigo_pede_dinheiro` | evento | 25,4% |
| `oportunidade_de_negocio` | evento | 25,2% |
| `vacina_no_posto` | evento | 25,2% |
| `casamento` | npc | 25,2% |
| `golpe_pix` | evento | 25,1% |
| `carro` | evento | 25,0% |
| `festa_tema` | evento | 25,0% |
| `perdeu_aniversario` | npc | 24,6% |
| `show_no_estadio` | acao | 24,4% |
| `guardar_dinheiro` | acao | 24,3% |
| `hidro_com_a_turma` | acao | 23,9% |
| `bet` | evento | 23,8% |
| `pelada_de_quinta` | evento | 23,8% |
| `viagem_realizada` | evento | 23,8% |
| `festa_junina` | evento | 23,7% |
| `esperou_por_voce` | npc | 23,5% |
| `doar_sangue` | evento | 23,5% |
| `investimento_furado` | evento | 23,4% |
| `emprego_saude` | evento | 23,0% |
| `crise_la_fora` | evento | 23,0% |
| `esporte_depois_da_aula` | evento | 22,9% |
| `tempo_com_amor` | acao | 22,6% |
| `largar_tudo` | evento | 22,5% |
| `avo_conta_historias` | npc | 22,3% |
| `criptomoeda` | evento | 22,3% |
| `vontade_de_um_bicho` | npc | 21,9% |
| `rebalancear` | acao | 21,8% |
| `voltar_a_estudar` | acao | 21,8% |
| `bico_adolescente` | acao | 21,6% |
| `previdencia` | acao | 21,4% |
| `reforma_da_casa` | evento | 21,2% |
| `primeira_palavra` | evento | 20,6% |
| `pensar_em_adotar` | evento | 20,6% |
| `casa_dos_pais` | evento | 20,6% |
| `viajar_com_o_amigo` | acao | 20,6% |
| `tatuagem` | evento | 20,4% |
| `hora_extra` | acao | 20,3% |
| `cozinhar_com_a_avo` | acao | 20,3% |
| `cortar_gastos` | acao | 20,3% |
| `festa_da_cidade` | acao | 20,2% |
| `futebol_de_varzea` | acao | 20,2% |
| `filho_formatura` | evento | 20,2% |
| `bolao_do_trabalho` | evento | 19,9% |
| `encontro` | acao | 19,9% |
| `vaquinha_do_vizinho` | evento | 19,7% |
| `proposta_na_expansao` | evento | 19,6% |
| `data_da_partida` | evento | 19,4% |
| `cursinho_pago` | acao | 19,4% |
| `mesada` | evento | 19,4% |
| `feira_ciencias` | evento | 19,1% |
| `vizinho_barulhento` | evento | 19,0% |
| `juros_compostos` | evento | 18,9% |
| `sair_de_casa` | evento | 18,9% |
| `hobby_horta` | evento | 18,7% |
| `subir_de_padrao` | evento | 18,7% |
| `pede_ajuda` | npc | 18,4% |
| `reencontro_da_turma` | evento | 18,4% |
| `catapora` | evento | 18,1% |
| `desempregado` | evento | 18,1% |
| `heranca_do_tio` | evento | 18,0% |
| `orgulho_da_formatura` | npc | 17,6% |
| `franquia` | evento | 17,6% |
| `pai_ausente_volta` | npc | 17,5% |
| `festa_sem_pais` | evento | 17,5% |
| `bateu_o_carro` | evento | 17,3% |
| `moeda_digital` | evento | 17,1% |
| `primeiro_cupom` | evento | 17,0% |
| `assalto_na_rua` | evento | 16,6% |
| `vender_doce` | acao | 16,4% |
| `curso_nota_media` | evento | 16,4% |
| `voltar_estudar` | evento | 16,4% |
| `leu_antes_dos_colegas` | evento | 16,2% |
| `fazenda_a_venda` | evento | 16,0% |
| `fome_no_fim_do_mes` | evento | 15,8% |
| `empresa_quebrou` | evento | 15,7% |
| `entregas` | acao | 15,7% |
| `ceu_de_fumaca` | evento | 15,4% |
| `bloco_de_carnaval` | evento | 15,4% |
| `festa_de_sao_joao` | evento | 15,2% |
| `carteira_da_diarista` | evento | 15,0% |
| `mudar_para_a_praia` | evento | 14,9% |
| `amigo_devolve` | npc | 14,9% |
| `cripto_fomo` | evento | 14,9% |
| `casa_propria` | evento | 14,9% |
| `ingles_crianca` | acao | 14,8% |
| `imovel_valorizou` | evento | 14,1% |
| `hidroginastica` | evento | 14,1% |
| `baile_da_terceira_idade` | evento | 14,1% |
| `cirurgia_de_catarata` | evento | 14,1% |
| `convite_para_palestrar` | evento | 13,9% |
| `reencontro_amigo` | evento | 13,7% |
| `pisa_em_ovos` | npc | 13,7% |
| `entregador_chuva` | evento | 13,7% |
| `investimento_rotina` | evento | 13,7% |
| `reuniao_de_condominio` | evento | 13,6% |
| `corte_de_salario` | evento | 13,6% |
| `pais_envelhece` | evento | 13,4% |
| `peneira` | evento | 13,4% |
| `multa_e_batida` | evento | 13,4% |
| `alavancagem` | evento | 13,3% |
| `imposto_alto_no_contracheque` | evento | 13,3% |
| `aula_de_musica` | evento | 13,3% |
| `brigas_de_madrugada` | evento | 13,2% |
| `dolar_barato` | evento | 13,2% |
| `promocao` | evento | 13,1% |
| `idh_muito_alto` | evento | 13,1% |
| `levar_ao_mar` | acao | 13,1% |
| `bolsa_la_fora` | evento | 13,1% |
| `vaga_sobrando` | evento | 12,9% |
| `parar_de_fumar` | acao | 12,9% |
| `imposto_baixo_sobrou` | evento | 12,8% |
| `convite_do_luxo` | evento | 12,7% |
| `sovina_ou_sabio` | evento | 12,6% |
| `escrever_memorias` | evento | 12,5% |
| `mais_um_filho` | npc | 12,5% |
| `quarto_dividido` | evento | 12,4% |
| `golpe_do_falso_neto` | evento | 12,4% |
| `maratona` | evento | 12,3% |
| `alugueis_dos_fundos` | evento | 12,3% |
| `casa_cheia` | evento | 12,2% |
| `bolsa_de_estudos` | evento | 12,1% |
| `separacao` | evento | 12,1% |
| `balcao_negocio` | acao | 11,8% |
| `casa_na_praia` | evento | 11,8% |
| `aniversario_da_infancia` | evento | 11,8% |
| `concorrente_gigante` | evento | 11,7% |
| `compra_por_impulso` | evento | 11,6% |
| `juros_altos_rendendo` | evento | 11,6% |
| `peito_chiando` | evento | 11,4% |
| `feira_de_ciencias` | evento | 11,3% |
| `greve_dos_onibus` | evento | 11,2% |
| `pobreza_na_porta` | evento | 11,2% |
| `separacao_dos_pais` | evento | 11,2% |
| `a_vacina_no_posto` | evento | 11,2% |
| `testamento` | evento | 11,1% |
| `rua_tranquila` | evento | 11,1% |
| `pib_recorde` | evento | 10,9% |
| `cofrinho` | acao | 10,9% |
| `casamento_na_igreja` | npc | 10,9% |
| `produto_viralizou` | evento | 10,9% |
| `recomecar_amor` | acao | 10,9% |
| `consorcio` | evento | 10,8% |
| `praia` | acao | 10,7% |
| `esporte_escola` | acao | 10,6% |
| `apartamento_na_planta` | evento | 10,4% |
| `vontade_ver_o_neto` | npc | 10,4% |
| `assalto_no_onibus` | evento | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,4% |
| `briga_em_casa` | npc | 10,3% |
| `cartao_credito` | evento | 10,3% |
| `bolsa_subiu_sem_voce` | evento | 10,2% |
| `gerente_do_banco` | evento | 10,2% |
| `socio_sumiu` | evento | 10,2% |
| `role` | acao | 10,1% |
| `juros_baixos_euforia` | evento | 10,1% |
| `surpresa_do_amor` | npc | 10,1% |
| `retiro_da_igreja` | evento | 10,0% |
| `negocio_no_aperto` | evento | 9,9% |
| `queda` | evento | 9,9% |
| `seca_no_sertao` | evento | 9,8% |
| `tempo_com_filho` | acao | 9,8% |
| `olimpiada_matematica` | evento | 9,7% |
| `padrao_de_vida` | evento | 9,6% |
| `cheia_do_rio` | evento | 9,4% |
| `colo_da_avo` | acao | 9,4% |
| `voce_mudou` | npc | 9,4% |
| `crise_40` | evento | 9,4% |
| `brincar_com_o_pai` | acao | 9,3% |
| `comer_tudo` | acao | 9,3% |
| `chefe_novo` | evento | 9,2% |
| `fugir_inflacao` | acao | 9,2% |
| `conteudo_extra` | acao | 9,1% |
| `investidor_anjo` | evento | 9,1% |
| `chimarrao` | acao | 9,1% |
| `mudanca_de_escola` | evento | 9,0% |
| `brincar_na_rua` | acao | 9,0% |
| `desigualdade_no_jornal` | evento | 8,9% |
| `sao_joao` | acao | 8,9% |
| `ressaca_do_mar` | evento | 8,9% |
| `remorso_aperta` | evento | 8,9% |
| `fundo_da_familia` | npc | 8,8% |
| `filho_desenho` | npc | 8,8% |
| `festa_de_15` | evento | 8,8% |
| `edital_de_cultura` | evento | 8,7% |
| `titulo_eleitor` | evento | 8,7% |
| `pousada_na_praia` | evento | 8,7% |
| `estatua` | jogada | 8,7% |
| `festa_surpresa` | evento | 8,7% |
| `tocar_no_bar` | acao | 8,6% |
| `ouvido_para_musica` | evento | 8,6% |
| `blitz_toda_noite` | evento | 8,6% |
| `aposentadoria_ativa` | evento | 8,5% |
| `festival_do_boi` | evento | 8,4% |
| `cripto_disparou` | evento | 8,4% |
| `amor_proposta_fora` | npc | 8,3% |
| `dolar_disparou` | evento | 8,3% |
| `ponto_comercial` | evento | 8,3% |
| `levar_a_terra_natal` | acao | 8,3% |
| `apagao_no_morro` | evento | 8,3% |
| `noite_de_stand_up` | evento | 8,3% |
| `inquilino_sumiu` | evento | 8,2% |
| `inquilino_dos_sonhos` | evento | 8,2% |
| `dente_de_leite` | evento | 8,2% |
| `cidadania_italiana` | evento | 8,2% |
| `amor_piada_interna` | npc | 8,1% |
| `atendimento_robo` | evento | 8,1% |
| `boi_bumba` | acao | 8,1% |
| `brincar_amigos` | acao | 8,0% |
| `pressao_alta` | evento | 7,9% |
| `ciumes_do_irmao` | evento | 7,8% |
| `passear_de_carrinho` | acao | 7,8% |
| `desemprego_em_alta` | evento | 7,7% |
| `geada_no_sul` | evento | 7,7% |
| `herdeiro_gastao` | evento | 7,7% |
| `vicio_aposta` | evento | 7,5% |
| `mei_negocio` | evento | 7,5% |
| `geladeira_vazia` | evento | 7,5% |
| `pular_corda` | acao | 7,4% |
| `filho_imitacao` | npc | 7,2% |
| `figurinha_repetida` | acao | 7,1% |
| `fiscalizacao` | evento | 7,1% |
| `faculdade_vida` | evento | 7,1% |
| `enchente_na_rua` | evento | 7,1% |
| `soltar_pipa` | acao | 7,1% |
| `piramide_no_grupo` | npc | 6,9% |
| `concurso_lotado` | evento | 6,8% |
| `merenda` | evento | 6,7% |
| `inflacao_no_mercado` | evento | 6,7% |
| `propina_da_empreiteira` | evento | 6,7% |
| `idh_em_queda` | evento | 6,6% |
| `grupo_de_jovens` | evento | 6,6% |
| `family_office` | evento | 6,6% |
| `estatua_pichada` | evento | 6,6% |
| `assembleia_do_predio` | evento | 6,6% |
| `plantao_lotado` | evento | 6,5% |
| `pescaria_no_pantanal` | evento | 6,5% |
| `asma_na_educacao_fisica` | evento | 6,4% |
| `auxilio_na_conta` | evento | 6,2% |
| `adocao_chegou` | evento | 6,2% |
| `doenca_de_quem_ama` | evento | 6,1% |
| `briga_dos_pais` | evento | 6,1% |
| `vender_doce_nato` | acao | 6,1% |
| `show_no_bar` | evento | 6,0% |
| `luto_do_bicho` | npc | 6,0% |
| `cripto_de_novo` | acao | 6,0% |
| `ano_de_prejuizo` | evento | 5,9% |
| `mutirao_de_cirurgias` | evento | 5,8% |
| `moto_na_chuva` | evento | 5,8% |
| `festa_do_seculo` | jogada | 5,8% |
| `crise_de_ansiedade` | evento | 5,8% |
| `vo_partiu` | npc | 5,8% |
| `nome_sujo` | evento | 5,8% |
| `vo_receita` | evento | 5,7% |
| `festival_lotado` | evento | 5,7% |
| `operacao_policial` | evento | 5,6% |
| `chaves_do_apartamento` | evento | 5,6% |
| `proposta_de_compra` | evento | 5,6% |
| `cobranca_do_casamento` | npc | 5,6% |
| `o_que_pensa_de_voce` | npc | 5,5% |
| `escola_publica_boa` | evento | 5,5% |
| `festa_vazou` | evento | 5,5% |
| `greve_do_servidor` | evento | 5,4% |
| `filho_nao_veio` | npc | 5,4% |
| `pais_separados_natal` | evento | 5,3% |
| `votacao_polemica` | evento | 5,3% |
| `bico_na_expansao` | evento | 5,2% |
| `viralizou` | evento | 5,2% |
| `namorar_depois_dos_60` | evento | 5,2% |
| `natal_com_politica` | evento | 5,2% |
| `bolsa_derreteu` | evento | 5,1% |
| `amigo_muda_de_cidade` | npc | 5,1% |
| `obra_grande_no_norte` | evento | 5,1% |
| `blindar_contas` | acao | 5,1% |
| `escola_de_samba` | jogada | 5,0% |
| `vontade_casa_propria` | npc | 5,0% |
| `so_aparece_por_dinheiro` | npc | 5,0% |
| `burnout_empresa` | evento | 5,0% |
| `netos` | evento | 5,0% |
| `briga_na_cozinha` | evento | 4,9% |
| `paquerar_timido` | acao | 4,9% |
| `la_fora_comprando` | evento | 4,9% |
| `processo_trabalhista` | evento | 4,9% |
| `socio_da_patente` | evento | 4,9% |
| `pais_na_crise` | npc | 4,8% |
| `joelho_da_pelada` | evento | 4,7% |
| `promessa_da_mae` | evento | 4,7% |
| `imposto_sobre_fortunas` | evento | 4,7% |
| `curso_nota_baixa` | evento | 4,6% |
| `tarifa_do_app` | evento | 4,5% |
| `cripto_derreteu` | evento | 4,5% |
| `olimpiada` | acao | 4,5% |
| `intercambio_pago` | evento | 4,5% |
| `mutirao_da_laje` | evento | 4,5% |
| `fundacao_com_seu_nome` | evento | 4,5% |
| `vereador` | evento | 4,4% |
| `convite_do_partido` | evento | 4,4% |
| `sociedade_amigo` | evento | 4,4% |
| `cachoeira` | acao | 4,3% |
| `mae_quer_morar_junto` | npc | 4,3% |
| `crescer_devagar` | evento | 4,3% |
| `fim_do_amor` | npc | 4,2% |
| `clinica_particular_contrata` | evento | 4,2% |
| `tosse_cronica` | evento | 4,2% |
| `agro_na_cidade` | evento | 4,2% |
| `fiador` | npc | 4,1% |
| `primeiro_funcionario` | evento | 4,1% |
| `funcionario_genial` | evento | 4,1% |
| `pescaria_no_rio` | evento | 4,1% |
| `conselho_que_diz_nao` | jogada | 4,1% |
| `trabalho_do_pai` | acao | 4,1% |
| `festa_surpresa_para` | npc | 4,1% |
| `comecar_terapia` | evento | 4,0% |
| `excursao_ao_mar` | acao | 4,0% |
| `confeitaria_da_vo` | evento | 4,0% |
| `balcao_da_familia` | evento | 4,0% |
| `acordo_abriu_mercado` | evento | 4,0% |
| `balcao_de_crianca` | evento | 3,9% |
| `cobranca_de_notas` | npc | 3,9% |
| `depois_do_cargo` | evento | 3,9% |
| `bater_o_pe_com_o_chefe` | evento | 3,8% |
| `cursinho_comunitario` | evento | 3,7% |
| `heranca` | evento | 3,7% |
| `posto_que_funciona` | evento | 3,6% |
| `olimpiada_do_instituto` | evento | 3,6% |
| `prova_concurso` | evento | 3,6% |
| `saudade_de_la` | evento | 3,6% |
| `filho_cuida` | npc | 3,6% |
| `casamento_do_filho` | evento | 3,5% |
| `convite_para_candidatura` | evento | 3,5% |
| `fila_do_posto` | evento | 3,5% |
| `emprestimo_ao_irmao` | evento | 3,5% |
| `este_e_o_ano` | evento | 3,4% |
| `escolheu_bem` | npc | 3,4% |
| `satelite_na_tv` | evento | 3,4% |
| `filho_saude_fragil` | npc | 3,4% |
| `aprovado_concurso_estudo` | evento | 3,4% |
| `amor_quer_mudar_de_carreira` | npc | 3,3% |
| `compativel_para_medula` | evento | 3,3% |
| `apresentacao_para_a_diretoria` | evento | 3,3% |
| `greve_dos_professores` | evento | 3,2% |
| `mensalidade_da_escola` | npc | 3,2% |
| `convite_igreja` | npc | 3,2% |
| `governo_que_voce_elegeu_frente_popular` | evento | 3,2% |
| `amigo_sumiu_e_voltou` | npc | 3,1% |
| `um_bicho_para_o_filho` | acao | 3,1% |
| `assumir_negocio` | evento | 3,1% |
| `faculdade_depois_dos_60` | npc | 3,1% |
| `clientes_sumiram` | evento | 3,0% |
| `alguem_especial` | evento | 3,0% |
| `ferias_do_dono` | evento | 3,0% |
| `ajudar_na_roca` | acao | 2,9% |
| `joias_no_cofre` | evento | 2,9% |
| `aposentadoria_nao_da` | npc | 2,9% |
| `reajuste_dos_servidores` | evento | 2,9% |
| `vaga_na_capital` | evento | 2,9% |
| `importado_ficou_caro` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `dolar_virou_salario` | evento | 2,9% |
| `tentar_outra_cidade` | evento | 2,9% |
| `nao_acredita_mais` | npc | 2,9% |
| `rodada_grande` | evento | 2,8% |
| `emprego_tecnologia` | evento | 2,8% |
| `proposta_sao_paulo` | evento | 2,8% |
| `birra_no_mercado` | evento | 2,7% |
| `carregar_a_geladeira` | evento | 2,7% |
| `surto_no_bairro` | evento | 2,7% |
| `crianca_ansiosa` | evento | 2,7% |
| `shows_cancelados` | evento | 2,7% |
| `terapia` | acao | 2,7% |
| `filho_quer_carro` | evento | 2,6% |
| `ainda_mora_com_pais` | evento | 2,6% |
| `reencontro_paixao` | evento | 2,6% |
| `carona_de_madrugada` | npc | 2,6% |
| `crise_no_setor` | evento | 2,5% |
| `enchente_na_cidade` | evento | 2,5% |
| `filho_primeiro_salario` | npc | 2,5% |
| `expandir_na_alta` | evento | 2,5% |
| `recaida_cigarro` | evento | 2,5% |
| `netos_nas_ferias` | evento | 2,5% |
| `obra_do_predio` | evento | 2,5% |
| `bancar_quem_sai` | jogada | 2,5% |
| `obra_ou_hospital` | evento | 2,5% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,5% |
| `juros_altos` | evento | 2,4% |
| `duas_empresas_uma_agenda` | evento | 2,4% |
| `gravidez_surpresa` | npc | 2,4% |
| `plano_de_saude_subiu` | evento | 2,4% |
| `briga_por_heranca` | evento | 2,4% |
| `depois_da_venda` | evento | 2,3% |
| `black_friday` | evento | 2,3% |
| `ajudar_na_coleta` | evento | 2,3% |
| `volta_terra` | evento | 2,3% |
| `hospital_sem_insumo` | evento | 2,2% |
| `programa_de_moradia` | evento | 2,2% |
| `gorjeta_boa` | evento | 2,2% |
| `seguranca_particular` | evento | 2,2% |
| `bodas_de_prata` | evento | 2,2% |
| `filho_passou_longe` | npc | 2,1% |
| `cidadania_do_bisavo` | evento | 2,1% |
| `arrojado_na_queda` | evento | 2,1% |
| `mural_de_problemas` | jogada | 2,1% |
| `ferias_com_a_familia_do_amor` | npc | 2,1% |
| `escola_integral` | evento | 2,1% |
| `emprestimo_de_volta` | evento | 2,1% |
| `cancelado` | evento | 2,1% |
| `renegociar_divida` | evento | 2,1% |
| `amigo_lembra_zoeira` | npc | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `irmaos_brigam` | evento | 1,9% |
| `visitar_de_longe` | acao | 1,9% |
| `conselho_de_fachada` | evento | 1,9% |
| `dizimo` | evento | 1,9% |
| `carreira_futebol` | evento | 1,8% |
| `time_a_venda` | evento | 1,8% |
| `lesao_grave` | evento | 1,8% |
| `segundo_carro` | evento | 1,8% |
| `padrao_aperta` | evento | 1,8% |
| `passear_pet` | acao | 1,8% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,8% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,8% |
| `governo_que_voce_elegeu_centrao` | evento | 1,8% |
| `imovel_na_baixa` | evento | 1,8% |
| `lembranca_primeiro_amor` | evento | 1,7% |
| `ocorrencia_perigosa` | evento | 1,7% |
| `sair_de_casa_cedo` | evento | 1,7% |
| `cara_de_comercial` | evento | 1,7% |
| `presidir_cpi` | evento | 1,7% |
| `cupula_la_fora` | evento | 1,7% |
| `apuracao_do_carnaval` | evento | 1,7% |
| `oferece_ajuda` | npc | 1,7% |
| `convite_para_o_palco_grande` | evento | 1,7% |
| `reforma_sem_fim` | evento | 1,6% |
| `chefe_amigo` | evento | 1,6% |
| `fronteira_fechada` | evento | 1,6% |
| `embaixador_pede` | evento | 1,6% |
| `nega_ajuda` | npc | 1,6% |
| `cuidar_netos` | acao | 1,6% |
| `paparazzi` | evento | 1,5% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,5% |
| `equipe_para_desmontar` | jogada | 1,5% |
| `vida_depois_da_condenacao` | evento | 1,5% |
| `familia_descobre_o_testamento` | evento | 1,5% |
| `o_conselho_vetou` | evento | 1,5% |
| `frete_sumiu` | evento | 1,5% |
| `cobranca_do_filho` | npc | 1,5% |
| `salario_parcelado` | evento | 1,4% |
| `amor_paga_a_conta` | npc | 1,4% |
| `proposta_da_europa` | evento | 1,4% |
| `promocao_em_outra_cidade` | evento | 1,4% |
| `foto_de_campanha` | evento | 1,4% |
| `acoes_da_startup` | evento | 1,3% |
| `retirada_demais` | evento | 1,3% |
| `hit_viral` | evento | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `tocar_o_negocio` | acao | 1,3% |
| `solucao_inesperada` | evento | 1,3% |
| `dez_anos_de_empresa` | evento | 1,3% |
| `cobranca_no_telefone` | evento | 1,2% |
| `filho_cuida_de_voce` | npc | 1,2% |
| `pai_namorando_de_novo` | npc | 1,2% |
| `contrato_publicitario` | evento | 1,2% |
| `nao_para_quieto` | evento | 1,2% |
| `greve_da_federal` | evento | 1,2% |
| `critico_no_salao` | evento | 1,2% |
| `bolsa_de_iniciacao` | evento | 1,2% |
| `pix_para_a_cidade` | jogada | 1,2% |
| `emprego_educacao` | evento | 1,2% |
| `pane_no_voo` | evento | 1,2% |
| `amor_quadro_de_tarefas` | npc | 1,2% |
| `amigo_ficou_rico` | npc | 1,2% |
| `preco_do_pao` | evento | 1,2% |
| `feirao_limpa_nome` | evento | 1,2% |
| `sucessao_regime` | evento | 1,1% |
| `rebaixamento` | evento | 1,1% |
| `briga_de_casal` | npc | 1,1% |
| `apartamento_de_presente` | evento | 1,1% |
| `lista_dos_mais_ricos` | evento | 1,1% |
| `amigo_pede_de_novo` | npc | 1,1% |
| `tornar_se_dispensavel` | jogada | 1,1% |
| `jantar_esfriou` | npc | 1,0% |
| `estatua_derrubada` | evento | 1,0% |
| `burnout` | evento | 1,0% |
| `vendas_recorde` | evento | 1,0% |
| `calote_no_noticiario` | evento | 1,0% |
| `happy_hour` | acao | 1,0% |
| `proposta_em_dolar` | evento | 1,0% |
| `grade_na_janela` | evento | 1,0% |
| `cobranca_da_magoa` | npc | 1,0% |
| `doar_em_vida` | evento | 1,0% |
| `vontade_festa_de_80` | npc | 0,9% |
| `holding_da_familia` | evento | 0,9% |
| `safra_da_fazenda` | evento | 0,9% |
| `intercambio` | evento | 0,9% |
| `livro_viralizou` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `turne_nacional` | evento | 0,9% |
| `juros_altos_na_fatura` | evento | 0,9% |
| `robos_na_fabrica` | evento | 0,9% |
| `bancar_presidente` | jogada | 0,9% |
| `segredo_de_familia` | npc | 0,9% |
| `deploy_de_sexta` | evento | 0,9% |
| `depois_do_calote` | evento | 0,9% |
| `quartel_sem_verba` | evento | 0,9% |
| `carro_de_luxo_na_rua` | evento | 0,9% |
| `vaga_na_empresa_dele` | npc | 0,8% |
| `fundacao` | jogada | 0,8% |
| `obra_atrasada` | evento | 0,8% |
| `filho_briga_na_escola` | npc | 0,8% |
| `desfile_das_campeas` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `mais_uma_mudanca` | evento | 0,8% |
| `exportacao_bate_recorde` | evento | 0,8% |
| `set_de_gravacao` | evento | 0,8% |
| `guerra_comercial` | evento | 0,8% |
| `mesa_cheia` | evento | 0,8% |
| `final_da_copa` | evento | 0,8% |
| `papel_da_vida` | evento | 0,8% |
| `pedreiro_vale_ouro` | evento | 0,8% |
| `acampamento_na_porta` | evento | 0,7% |
| `mestrado_fora` | evento | 0,7% |
| `divida_publica_assusta` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `tradutor_da_familia` | evento | 0,7% |
| `oferta_pela_subsidiaria` | evento | 0,7% |
| `layoff_por_email` | evento | 0,7% |
| `peneira_do_sobrenome` | evento | 0,7% |
| `fim_de_semana_no_sitio` | evento | 0,7% |
| `pressao_carreira` | npc | 0,7% |
| `noite_da_apuracao` | evento | 0,7% |
| `infancia_no_palacio` | evento | 0,7% |
| `edital_da_ciencia` | evento | 0,6% |
| `favor_do_presidente` | evento | 0,6% |
| `sancao_parou_o_porto` | evento | 0,6% |
| `padrinho_casamento` | npc | 0,6% |
| `treinar_no_clube` | acao | 0,6% |
| `desfile_de_sete_de_setembro` | evento | 0,6% |
| `fa_obcecado` | evento | 0,6% |
| `filho_parou_de_contar` | npc | 0,6% |
| `vaga_no_agro` | evento | 0,6% |
| `racionamento` | evento | 0,6% |
| `ameaca_de_sancao` | evento | 0,6% |
| `celular_dos_pais` | npc | 0,6% |
| `o_laboratorio_apaga_a_luz` | evento | 0,6% |
| `cavalo_campeao` | evento | 0,6% |
| `fila_do_emprego` | evento | 0,5% |
| `ministro_pede_ajuste` | evento | 0,5% |
| `o_mural_do_boton` | evento | 0,5% |
| `despejo` | evento | 0,5% |
| `filial_fechando` | evento | 0,5% |
| `a_convocacao` | evento | 0,5% |
| `queda_do_cargo` | evento | 0,5% |
| `rompimento` | npc | 0,5% |
| `transito_de_sp` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `feriado_na_praia` | evento | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,5% |
| `emprego_negocios` | evento | 0,5% |
| `quebra_de_safra` | evento | 0,5% |
| `emprego_artes` | evento | 0,4% |
| `montadora_vai_fechar` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `circo_vai_embora` | evento | 0,4% |
| `plantao_que_nao_acaba` | evento | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `mordomias_reais` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `ajudar_com_a_casa` | acao | 0,4% |
| `guerra_na_escola` | evento | 0,4% |
| `estagio_do_pai` | evento | 0,4% |
| `obra_parada` | evento | 0,4% |
| `safra_recorde` | evento | 0,4% |
| `abrir_capital` | evento | 0,4% |
| `tentar_a_vida_na_europa` | evento | 0,4% |
| `noite_de_corridas` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `startup_dos_ex_funcionarios` | evento | 0,4% |
| `proposta_pelo_negocio` | evento | 0,4% |
| `oposicao_na_tv` | evento | 0,4% |
| `violencia_vira_manchete` | evento | 0,4% |
| `bonanca_no_governo` | evento | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,4% |
| `renegociar_cartao` | acao | 0,3% |
| `filho_apresenta_namoro` | npc | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `a_conta_da_coroa` | evento | 0,3% |
| `proposta_remota` | evento | 0,3% |
| `fusao_de_iguais` | evento | 0,3% |
| `assumir_a_fazenda` | evento | 0,3% |
| `crise_internacional` | evento | 0,3% |
| `aperto_do_mes` | evento | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `assinatura_real` | evento | 0,3% |
| `decreto_da_economia` | evento | 0,3% |
| `reencontro_amigo_brigado` | evento | 0,3% |
| `greve_geral` | evento | 0,3% |
| `tomar_o_poder` | jogada | 0,3% |
| `aluguel_caro` | evento | 0,3% |
| `concurso_em_brasilia` | evento | 0,3% |
| `protesto_na_praca` | evento | 0,3% |
| `pais_envelhecem` | npc | 0,3% |
| `negocio_em_crise` | evento | 0,3% |
| `caso_do_poderoso` | evento | 0,3% |
| `importado_invadiu` | evento | 0,3% |
| `reconciliacao` | npc | 0,3% |
| `fabrica_de_municao` | evento | 0,3% |
| `ferias_coletivas` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `general_ambicioso` | evento | 0,3% |
| `sequestro_frustrado` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `cargo_no_gabinete` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,3% |
| `passou_mal_de_novo` | npc | 0,3% |
| `grupo_na_capa` | evento | 0,2% |
| `vista_da_cobertura` | evento | 0,2% |
| `shopping_lotado` | evento | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,2% |
| `carro_de_presente` | evento | 0,2% |
| `bonus_do_banco` | evento | 0,2% |
| `regra_sob_medida` | evento | 0,2% |
| `pais_aposentados` | npc | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `tribunal_internacional` | evento | 0,2% |
| `construtora_quebrou` | evento | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `mansao_vazia` | evento | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `zona_franca` | evento | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `trazer_a_copa` | jogada | 0,2% |
| `escola_militar` | evento | 0,2% |
| `cliente_perdeu_tudo` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `fim_carreira` | evento | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `filho_hamburgueria` | npc | 0,2% |
| `fazer_as_pazes` | acao | 0,2% |
| `cpi_da_campanha` | evento | 0,2% |
| `receita_no_seu_pe` | evento | 0,2% |
| `conselho_dos_generais` | evento | 0,2% |
| `amor_planilha` | npc | 0,2% |
| `primeiro_balanco_na_bolsa` | evento | 0,2% |
| `casamento_real` | evento | 0,2% |
| `jubileu` | evento | 0,2% |
| `o_veterano` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `cade_investiga` | evento | 0,2% |
| `parcela_da_tv` | npc | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `ficar_no_poder` | jogada | 0,1% |
| `royalties_secaram` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `cursinho_paga_bem` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `paparazzi_real` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `as_criancas_perguntam` | npc | 0,1% |
| `filho_convocado` | evento | 0,1% |
| `ex_aluno` | evento | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `filho_distante` | npc | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `lancamento` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `asteroide_com_seu_nome` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `acionistas_furiosos` | evento | 0,1% |
| `subsidiaria_esquecida` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,0% |
| `filho_missao` | npc | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `anos_depois_do_poder` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `desvio_na_fundacao` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `quem_manda_se_voce_faltar` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `restaurar_a_monarquia` | jogada | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 198 · **mudaram algo em pelo menos uma vida:** 199
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,6 · p10 52 · p25 60 · mediana 70 · p75 82 · p90 90

```
até 19                                        0,2%
20–29                                         0,3%
30–39          █                              0,8%
40–49          ███████                        5,1%
50–59          ███████████████████████        18,5%
60–69          ██████████████████████████████ 23,7%
70–79          ███████████████████████████    21,3%
80–89          ████████████████████████       18,7%
90–99          ████████████                   9,4%
100+           ██                             1,9%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 276 mil · p25 R$ 862 mil · mediana R$ 4 milhões · p75 R$ 34 milhões · p90 R$ 164 milhões

```
negativo                                      0,7%
até 10 mil                                    0,3%
10–50 mil      █                              1,2%
50–200 mil     ███                            5,1%
200 mil–1 mi   █████████████                  20,2%
1–5 mi         ████████████████               25,5%
5 mi+          ██████████████████████████████ 47,0%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 76 · p90 86

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,5%
50–59          ███                            4,9%
60–69          ███████████████                21,4%
70–79          ██████████████████████████████ 42,6%
80+            ██████████████████████         30,7%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,4 | R$ 1,2 milhão | 70,0 | 57,9 | 160,5 | 65,9 | 100% | 55% |
| cautelosa | 86,0 🏆 | R$ 57 milhões 🏆 | 77,7 | 69,5 | 204,3 | 81,1 | 100% | 64% |
| arriscada | 55,7 | R$ 2,7 milhões | 80,9 🏆 | 50,9 | 135,1 | 69,2 | 100% | 50% |
| aleatoria | 75,2 | R$ 1,8 milhão | 71,9 | 64,1 | 135,9 | 64,9 | 100% | 52% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,3% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,9% — de um AVC, numa terça-feira sem graça
- 7,0% — de pneumonia, depois de teimar que era só uma gripe
- 6,2% — numa cirurgia simples que não foi tão simples
- 6,0% — de velhice, dormindo, num domingo depois do almoço
- 5,5% — de complicações de uma queda no banheiro
- 5,2% — de complicações pulmonares, entre uma tosse e outra

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
