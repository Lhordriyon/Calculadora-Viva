# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 632 eventos, 138 de personagens, 121 ações, 1836 escolhas, 239 linhas, 157 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 4037978 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4625706 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Inflação no dinheiro parado | os preços | 100,0% | -R$ 504 mil |
| Ações do ano | o mercado | 99,9% | R$ 41 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 14 mil |
| Custo de vida | o mercado | 99,8% | -R$ 621 mil |
| Padrão de vida | o mercado | 99,7% | -R$ 4,8 milhões |
| Bico | o mercado | 99,4% | R$ 45 mil |
| Salário | o mercado | 95,8% | R$ 3,4 milhões |
| Juro da renda fixa | o governo | 89,5% | R$ 182 mil |
| Cotação dos investimentos | os preços | 86,2% | R$ 1,2 milhão |
| Imposto | o governo | 84,0% | -R$ 57 mil |
| Imposto mais baixo | o governo | 82,7% | R$ 56 mil |
| Auxílio | o governo | 81,9% | R$ 18 mil |
| Juros da dívida | o banco | 79,6% | -R$ 2,2 mil |
| Compras e vendas | o mercado | 73,9% | -R$ 1,5 milhão |
| Manutenção dos bens | o mercado | 73,9% | -R$ 536 mil |
| Gastos da velhice | o mercado | 65,4% | -R$ 1 milhão |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 5,4% | 5,0 | 5,5% | 2,6% | 0,0% | 3,3% |
| cautelosa | 0,0% | 1,3% | 0,0 | 1,3% | 0,0% | 0,0% | 0,0% |
| arriscada | 91,8% | 26,9% | 1,0 | 16,4% | 4,0% | 18,6% | 18,6% |
| aleatoria | 48,3% | 14,8% | 1,0 | 8,6% | 1,3% | 9,5% | 9,8% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 12,1% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,93 anos com acordo (706 vezes) × 2,86 sem (533 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 20,1% de 3504 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 2,0% das vidas; 16,3% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 38,5% | R$ 48 mil | 823 | 0 (0) | 1,2% | R$ 3,5 milhões (1 vidas) |
| cautelosa | 99,2% | 6,8 | 53,4% | R$ 1,5 milhão | 16927 | 29 (25) | 1,2% | R$ 194 mil (12 vidas) |
| arriscada | 0,0% | — | 14,7% | R$ 7,4 mil | 153 | 149 (78) | 2,8% | R$ 522 milhões (33 vidas) |
| aleatoria | 86,8% | 2,5 | 16,6% | R$ 27 mil | 3590 | 1659 (878) | 1,0% | R$ 497 mil (8 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 99,2%, arriscada 0,0%, aleatoria 86,8% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,5% (154 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 198 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2887 | R$ 3,8 milhões | 0,4 |
| parte dos impostos | 1367 | R$ 1,9 bilhão | 0,4 |
| taxa da coroa | 1637 | R$ 32 bilhões | 1,0 |

A ilha: 38 vidas fundaram ou herdaram uma. População no fim: p10 2322, mediana 2545, p90 3213.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 1,0 quedas por 100 anos com a taxa (1637 anos) × 0,4 com o salário (2887 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 38 ilhas; mediana de 2612 habitantes sem a taxa (24) e 2009 com 5 anos ou mais de taxa (5) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 172804 | -0,70 |
| regular | 345984 | -0,04 |
| prioridade | 186145 | +0,76 |

A tecnologia ao morrer: p10 42,3, mediana 49,7, p90 58,5. Descobertas por 100 vidas: a cura 16,6, o satélite 16,1, a patente 15,9; 27,7% das vidas veem uma. A fuga de cérebros: 25,5% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (172804 anos) · regular -0,04 por ano (345984 anos) · prioridade +0,76 por ano (186145 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,3 · mediana 49,7 · p90 58,5 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 27,7% das vidas; 89,0% de 4863 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 178278 | -0,85 |
| regular | 343964 | -0,01 |
| reforçada | 182691 | +0,85 |

A capacidade ao morrer: p10 43,3, mediana 49,7, p90 57,8. Encomendas por 100 vidas: 6,4 (584 entregas). Guerras por 100 vidas: 3,3, em 3,3% das vidas; acabaram em vitória 61, derrota 89 e cessar-fogo 153, com 3,7 anos em média. Pedidos de paz: 3; convocações: 60; 0,2% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,85 por ano (178278 anos) · regular -0,01 por ano (343964 anos) · reforçada +0,85 por ano (182691 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 3,3% das vidas; 91,1% de 327 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,7% de 4786 anos · forte: 3,1% de 4815 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ✅ | -2,46% em 1190 anos de guerra · 2,10% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ✅ | a mais longa: 8 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 399 em vida (100,0% com resposta) e 123 na herança (99,2%). De 130 herdeiros que começaram na fila, 78,5% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 38 | 63,2% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 47 | 59,6% | primeira 0 · cautelosa 0 · arriscada 1 · aleatoria 0 |
| Mudar a Constituição para mais um mandato | 0 | — | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Restaurar a monarquia no plebiscito | 69 | 34,8% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ❌ | em vida 100,0% de 399 · na herança 99,2% de 123 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 85 tentativas, 61,2% deram certo |

## A rede (missão Ω1)

As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (`docs/auditoria-omega.md`). Nas vidas sorteadas, cada vida tem em média 14,4 pessoas diferentes, 0,30 ex, 1,57 irmãos (0,86 nascidos depois de quem joga) e 7,17 pessoas do trabalho.

| Portão | Situação | Valor |
|---|---|---|
| A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão | ❌ | ex em 25,0% · irmão em 80,1% |
| As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe | ✅ | 4,9 entradas por vida, com 14,4 pessoas por vida |
| A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada) | ✅ | ex que voltou 79 · colega que virou amigo 45 · romance do trabalho 68 |

## Os verbos sociais (missão Ω2)

Quando a resposta é de uma pessoa, ela decide pelo estado e pela memória dela e diz por quê (`decisao.ts`); o empréstimo entre pessoas é uma promissória, com parcela, atraso, quitação e calote (`promissorias.ts`). Nas vidas sorteadas: 15,6 respostas por vida, sim em 40,5%, e 47,4% delas com o porquê apontando um ano anterior.

| Portão | Situação | Valor |
|---|---|---|
| A pessoa decide: ≥ 60% das vidas têm um pedido respondido por alguém, e o sim fica entre 30% e 80% das respostas | ✅ | 67,2% das vidas · 15,6 respostas por vida · sim em 40,5% |
| O porquê cita o passado: ≥ 25% das respostas dizem a lembrança que pesou ("…, aos 31") ou a dívida em aberto | ✅ | 47,4% das respostas |
| O empréstimo entre pessoas acontece e acaba dos dois jeitos: em ≥ 10% das vidas, e dos que acabam, ≥ 50% quitados e ≥ 3% em calote | ✅ | em 36,0% das vidas (12180 empréstimos: 11753 pegos, 427 feitos) · 9027 quitados, 1443 calotes, 3591 parcelas atrasadas |

## Os projetos (missão Ω3)

Quem joga declara o que quer da vida; as etapas são condições do estado, e o fim vai para o livro com o começo de causa (`projetos.ts`). Por projeto, começados / conquistados: sair_das_dividas 2155 / 1680 · casa_propria 4392 / 2431 · ter_um_filho 2483 / 2094 · negocio_proprio 7079 / 32 · reparar_relacao 323 / 69 · cuidar_da_saude 3432 / 71 · primeiro_milhao 3994 / 2804 · casar 1272 / 1117 · diploma 3775 / 836.

| Portão | Situação | Valor |
|---|---|---|
| Os planos existem: ≥ 40% das vidas começam um plano | ✅ | 74,6% das vidas · 2,89 planos por vida |
| Os planos acabam dos dois jeitos: dos que acabam, as conquistas ficam entre 20% e 80% | ✅ | 11134 conquistas, 12586 prazos vencidos, 3282 desistências, 97 sem tempo (conquista em 41,1%) |
| Todo plano acontece: cada um é começado e conquistado em alguma vida | ✅ | 9 de 9 |

## Os segredos (missão Ω4)

Quem joga esconde coisas de alguém; quem sabe pode contar pelos círculos (a família e o par, os amigos, os ex, o trabalho), e a notícia que chega ao alvo vira revelação, com quem contou e a causa (`segredos.ts`). Por tema, nascidos / contados ao alvo: caso 173 / 22 · divida 132 / 2 · festa 1312 / 42 · esquema 1276 / 313.

| Portão | Situação | Valor |
|---|---|---|
| Os segredos existem: ≥ 15% das vidas guardam um | ✅ | 26,5% das vidas · 0,29 por vida |
| A notícia corre: um boato (alguém que soube pela boca de outro) para cada 4 segredos ou mais | ✅ | 947 boatos para 2893 segredos · 379 chegaram a quem não devia · 317 chantagens |
| Os segredos acabam de todo jeito: contados, descobertos, confessados e calados, cada um em ≥ 5% dos que acabam | ✅ | contados 13,6% · descobertos 51,7% · confessados 16,5% · calados 18,3% (de 2611) |
| Todo segredo chega a quem não devia: cada tema nasce e é contado ao alvo em alguma vida | ✅ | 4 de 4 |

## Os capítulos (missão Ω5)

A peneira lê o livro de cada vida e reconhece os arcos com começo e fim, que a linha do tempo e o cartão mostram (`capitulos.ts`).

| Portão | Situação | Valor |
|---|---|---|
| A vida tem capítulos: ≥ 50% das vidas têm um arco reconhecido no livro | ✅ | 69,6% das vidas · 1,49 por vida · 21,9% com dois tipos ou mais |
| Todo tipo de capítulo acontece (o plano, o segredo, a volta, o calote, o favor e as pazes) | ✅ | plano 11231 · segredo 2134 · volta 74 · calote 1443 · favor 34 · pazes 27 |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 26 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,26 ms | 1,9% | 32,5 KB | — | guerra, pais, pesquisa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,61 ms | 0,5% | 0,0 KB | exterior | pais, pesquisa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 4,63 ms | 3,8% | 58,5 KB | exterior, guerra | pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, poder, coroa, iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,20 ms | 0,2% | 0,4 KB | guerra, pais | poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,59 ms | 0,5% | 18,3 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 1,60 ms | 1,3% | 28,4 KB | pais, mercado | empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: crescimento, retirada, quebra) | 0,50 ms | 0,4% | 3,5 KB | exterior, guerra, pais, pesquisa, mercado, economia | bens, tesouro, dividas, promissorias, corpo, personagens, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 0,95 ms | 0,8% | 14,3 KB | pais, mercado, economia, empresa | tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,27 ms | 0,2% | 2,8 KB | pais, economia, empresa, bens | dividas, promissorias, personagens, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,33 ms | 0,3% | 0,3 KB | pais, economia, empresa, bens, tesouro | promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| promissorias (os empréstimos entre pessoas: a parcela, o atraso que magoa, a quitação e o calote) | 0,29 ms | 0,2% | 1,6 KB | pais, economia, empresa, bens, tesouro, dividas | personagens, segredos, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,05 ms | 0,0% | 0,0 KB | economia | corpo, personagens, projetos, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,75 ms | 1,4% | 21,5 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao | personagens, trabalho, carreira, poder, coroa, projetos, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 4,70 ms | 3,9% | 77,8 KB | exterior, pais, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo | trabalho, carreira, poder, coroa, projetos, segredos, iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,21 ms | 0,2% | 1,7 KB | pais, promissorias, personagens | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,47 ms | 0,4% | 1,8 KB | pais, promissorias, corpo, personagens, trabalho | poder, coroa, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,76 ms | 0,6% | 3,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,14 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,07 ms | 0,1% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, promissorias, personagens | iniciativas, diretor |
| projetos (os projetos: a meta alcançada vira conquista, o prazo passado vira fracasso) | 0,40 ms | 0,3% | 1,0 KB | tudo o que veio antes | segredos, morte, amor, iniciativas, diretor |
| segredos (os segredos: quem sabe pode contar, e a notícia que chega ao alvo agenda a revelação) | 1,65 ms | 1,4% | 0,1 KB | tudo o que veio antes | morte, amor, iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 0,77 ms | 0,6% | 0,0 KB | privacao, corpo, personagens, projetos | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,50 ms | 0,4% | 0,3 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa, projetos | iniciativas, diretor |
| amor (o amor que aparece e o namoro que esfria) | 0,12 ms | 0,1% | 0,0 KB | promissorias, corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 21,57 ms | 17,7% | 2,1 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 17,64 ms | 14,4% | 1,7 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 59,07 ms | 48,4% | — | — | — |

O save de uma vida (amostra de 1040): mediana 356 KB, p90 452 KB, máximo 584 KB; o livro é 96,8% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 584 KB (mediana 356 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 122,08 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 57,1% | 29,2% | 12,0% | 1,6% | 0,1% |

Entre as vidas com filhos (42,9%), a média é de 1,36 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 13,6% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 15,1% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 52,3% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 909 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 9,11 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 463,5 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 13,0% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 13,3% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,5% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,34 |
| Saturação V20 ≤ 95% | ✅ | 87,6% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 909 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 122,08 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,8% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 62,5% (168 dinastias, média de 3,3 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,87 (393 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 6,15% (p99 R$ 838 milhões, maior R$ 35 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,86% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 29,0% de 55,9% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 15,8% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 87,6% |
| Assinaturas sem regressão (≥ 918) | ❌ | 909 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 463,5 |
| CPU por vida ≤ 30 ms | ❌ | 122,08 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 96,0% (9,9 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 70,9% de 3757 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (682), A festa do século (574), Pix para a cidade inteira (339), Uma estátua sua (271), Um conselho que diz não (185), Uma fundação com seu nome (166), Bancar um presidente (164), Uma equipe para desmontar (135), Pagar a cura de uma doença (129), Tomar o poder (129), Um mural de problemas (129), Trazer a Copa do Mundo (125), Um programa espacial (115), Bancar quem quer sair (113), Tornar-se dispensável (112), Restaurar a monarquia (91), Ficar no poder (71), Fundar uma cidade (71), Comprar a estatal (71), Fundar um país (36), Uma colônia em Marte (27), Salvar o país da crise (22).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 4 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 39,2% de 1689 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 26,3% delegaram, 52,9% centralizaram (745 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 37,1% (34,4 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (665), Bancar quem quer sair (388), Uma equipe para desmontar (370), Um mural de problemas (369), Tornar-se dispensável (272).
- **Na morte de quem manda:** a empresa perde em média 25,1% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 21 anos (7516 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 984 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 53,7% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 62,8% / 24,9% / 9,8% / 2,4% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,1 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 25,6%, o bloco liberal 24,6%, a aliança da ordem 25,2%, o centrão 24,5%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,72% × 1,87%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 84% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,51% contra 0,75% por ano (38622 e 55642 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ❌ | 1,40 votos por vida, 30,7% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,30 × 0,50 pontos do PIB por ano (150 e 177 governos); 97,8% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,0% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 194.945 | 1,9% | 8,2% | 5,1% | 82% | 21,0% | 20,5 | 58 | 55 | 50% |
| a aliança da ordem | 192.142 | 1,7% | 8,4% | 5,8% | 73% | 29,5% | 17,6 | 50 | 45 | 52% |
| o bloco liberal | 187.512 | 2,7% | 8,5% | 4,6% | 81% | 29,5% | 22,1 | 42 | 50 | 51% |
| o centrão | 186.424 | 2,1% | 8,3% | 5,1% | 84% | 25,1% | 21,4 | 50 | 50 | 55% |
| quem joga | 12.657 | 1,7% | 8,7% | 5,4% | 83% | 25,5% | 18,9 | 51 | 50 | 51% |
| o regime | 5.931 | 0,9% | 9,6% | 5,3% | 39% | 32,2% | 17,1 | 36 | 37 | 46% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 14,1% de 6538 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,6% fundiram, 5,0% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 3796 (p99 275) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,41 ponto em média (25945 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,35 na bolsa (6783 empresas-ano) × -0,00 fechadas (100434) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 47,7% de 37183 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,14 · mediana R$ 5,10 · p90 R$ 6,35 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,5% × 4,2% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,34 no agro (3566 empresas-ano) × -0,32 no comércio (27900), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 35,0%, acordo em 75,8%; 95,5% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,4% de 5341 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,88% × 0,16% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,72% × 0,33% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 77,2% de 403 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 194.945 | 0,20% | 2,96% |
| a aliança da ordem | 192.142 | 1,91% | 0,33% |
| o bloco liberal | 187.512 | 0,28% | 3,72% |
| o centrão | 186.424 | 0,16% | 0,62% |
| quem joga | 12.657 | 1,81% | 3,76% |
| o regime | 5.931 | 4,03% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,529, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,799–0,867, Gini 0,483–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 8,9% · desigualdade_no_jornal 7,2% · idh_muito_alto 11,4% · idh_em_queda 4,8% · pais_envelhece 11,7% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,799 | 0,830 | 0,867 |
| Desigualdade (Gini) | 0,483 | 0,529 | 0,561 |
| População (milhões) | 180 | 193 | 206 |
| PIB per capita | R$ 118 mil | R$ 255 mil | R$ 576 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 52,3% / 87,6% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 61,6% |
| Efeito da memória (aleatória, V5 sem → com memória) | 58,5% → 48,7% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 909 (574) |
| Mobilidade: mesmo quintil da origem ao fim | 27,2% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,34 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 13,3% / 3,5% |
| Patrimônio p90/p10 | 454,5× (p10 R$ 243 mil, p90 R$ 110 milhões) |
| Desvio-padrão da felicidade média da vida | 9,11 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,3% |
| Toques por vida | 463,5 |
| Tempo de CPU por vida | 122,08 ms |
| Ações (fichas usadas) por vida | 158,1 |
| Mortes na família por vida | 5,1 |
| Pontos de virada que vêm do mundo (não do jogador) | 13,0% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 28,2 |
| Vidas que terminam com filho ou filha para continuar | 84,8% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,3 / 62,5% / 38,7% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 5,7 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,87 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 55,9% |
| Entre quem abriu: quebrou / vendeu | 29,0% / 23,9% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 1,7 milhão / R$ 61 milhões / R$ 838 milhões / R$ 35 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 29,54% / 6,15% / 0,86% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 15,8% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 61,4 / 158,1 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 824 | R$ 172 mil | R$ 1,5 milhão | R$ 46 milhões |
| moderado | 895 | R$ 135 mil | R$ 1,7 milhão | R$ 32 milhões |
| arrojado | 781 | R$ 185 mil | R$ 1,9 milhão | R$ 55 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 68,2 | R$ 1,3 milhão | 75,4 |
| pobre | 104 | 68,7 | R$ 1,7 milhão | 74,0 |
| remediada | 24 | 72,5 | R$ 1,2 milhão | 75,5 |
| media | 64 | 71,7 | R$ 2,2 milhões | 73,0 |
| rica | 64 | 70,9 | R$ 5,8 milhões | 75,7 |
| muito rica | 144 | 70,4 | R$ 24 milhões | 75,1 |
| bilionaria | 356 | 70,8 | R$ 2,3 bilhões | 75,1 |
| trilionaria | 276 | 71,3 | R$ 907 bilhões | 75,7 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 63% / 25% / 10% / 2% |
| Notícias do país por vida | 42,2 |
| Demissões por vida / vindas de uma recessão ou crise | 0,56 / 32,6% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 28 |
| Setor do último trabalho | serviço público 49% · serviços 16% · saúde 11% · cultura e internet 6% · transporte e entregas 4% · comércio 4% · agro 3% · construção 2% · sem setor 2% · tecnologia 1% · indústria 1% · educação 1% · finanças 1% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 20% | 33% | 44% | 52% | 74% | 83% | 88% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 22% | 17% | 17% | 13% |
| Q2 | 29% | 23% | 17% | 16% | 15% |
| Q3 | 24% | 24% | 19% | 18% | 15% |
| Q4 | 13% | 23% | 27% | 22% | 15% |
| Q5 | 4% | 7% | 20% | 28% | 42% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,6 | R$ 1,5 milhão | 73,4 |
| família pobre | 24% | 70,3 | R$ 1,5 milhão | 73,8 |
| família remediada | 20% | 71,4 | R$ 1,6 milhão | 73,4 |
| classe média | 18% | 69,9 | R$ 2,4 milhões | 73,5 |
| família rica | 13% | 70,3 | R$ 5,2 milhões | 73,4 |
| família muito rica | 13% | 70,1 | R$ 26 milhões | 74,4 |
| família bilionária | 3% | 72,0 | R$ 2,4 bilhões | 76,1 |

## Repetição

- **Dentro de uma vida:** 8,4% das aparições repetem uma instância já vista na mesma vida; pior vida: 24,7%.
- **Texto repetido entre vidas:** 25,6% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,2 · `aposentadoria` 1,5 · `irmao_nasce` 0,5 · `avo_mesada_escondida#avo` 0,4 · `namoro_esfriou#amor` 0,3 · `eleicao_geral` 0,2

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 157 de 336 (47%) · típico 156 de 336 (46%) · rico 170 de 336 (51%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `ex_liga_de_madrugada`, `ex_nas_redes`, `ex_cobra`, `mais_um_filho`, `irmao_mais_velho_defende`, `cobranca_da_magoa`, `chefe_hora_extra`, `chefe_magoado_cobra`, `colega_rouba_ideia`, `romance_no_trabalho`, `colega_de_licenca`, `o_caso_vem_a_tona`, `devedor_some`, `cobranca_do_filho`, `planilha_das_dividas`, `casamento_dos_outros`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `contaram_do_caso`, `a_divida_escondida`, `a_divida_vem_a_tona`, `a_festa_escondida`, `a_foto_da_festa`, `contaram_do_esquema`, `a_auditoria`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `pressao_carreira`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `briga_de_casal`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `segunda_chance`, `irmao_separou`, `chefe_magoado_cobra`, `cobrar_divida`, `devedor_some`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `a_conta_da_coroa`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `edital_da_ciencia`, `o_laboratorio_apaga_a_luz`, `contaram_do_caso`, `chantagem_do_caso`, `confessar_o_caso`, `a_divida_vem_a_tona`, `contaram_da_divida`, `confessar_a_divida`, `contaram_da_festa`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `transito_de_sp`, `despejo`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `filial_fechando`, `turno_extra_na_fabrica`, `layoff_por_email`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `salvar_o_pais`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `inauguracao_da_cidade`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `apagao`, `boicote_ao_traidor`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `rival_bilionario`, `herdeiros_de_olho`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `celular_dos_pais`, `filho_quer_curso_caro`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `final_da_copa`, `cliente_perdeu_tudo`, `noite_de_corridas`, `fa_obcecado`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `fim_de_semana_no_sitio`, `feriado_na_praia`, `safra_ou_geada`, `ilha_particular`, `carro_de_luxo_na_rua`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `oposicao_na_tv`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Apresentados por vida:** 61,4 · **com causa anterior (cadeia):** 78,9 · **maior distância causa→consequência:** 47,7 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,5% |
| `namoro` | evento | 98,9% |
| `luto` | npc | 95,9% |
| `enem` | evento | 89,1% |
| `primeiro_voto` | evento | 75,0% |
| `trabalho_grande` | acao | 73,9% |
| `programa_junto` | acao | 69,9% |
| `casamento_do_irmao` | evento | 67,7% |
| `curso_online` | acao | 65,4% |
| `bico_adulto` | acao | 64,9% |
| `aposentadoria` | evento | 63,8% |
| `correr_no_quintal` | acao | 60,4% |
| `formatura` | evento | 60,2% |
| `ler_gibi` | acao | 57,7% |
| `parquinho` | acao | 57,3% |
| `almoco_domingo` | acao | 54,4% |
| `cuidar_da_doenca` | npc | 53,8% |
| `irmao_nasce` | evento | 53,0% |
| `tocar_empresa` | acao | 52,6% |
| `conversar_de_verdade` | acao | 52,5% |
| `padrinho_do_sobrinho` | evento | 51,8% |
| `saudade_de_voce` | npc | 51,6% |
| `eleicao_geral` | evento | 50,2% |
| `estudar_concurso` | acao | 49,1% |
| `mochilao` | acao | 48,7% |
| `avo_mesada_escondida` | npc | 48,6% |
| `visitar_familia` | acao | 48,6% |
| `presente_certo` | acao | 47,6% |
| `pedir_conselho` | acao | 47,2% |
| `dizer_umas_verdades` | acao | 47,2% |
| `ligar_amigo` | acao | 46,6% |
| `oferecer_ajuda` | acao | 44,9% |
| `pos_graduacao` | acao | 44,5% |
| `primeiro_emprego` | evento | 42,7% |
| `demissao` | evento | 42,0% |
| `pedir_um_pix` | acao | 40,9% |
| `academia` | acao | 40,7% |
| `doente_crianca` | npc | 40,5% |
| `esperou_por_voce` | npc | 40,3% |
| `briga_com_o_irmao` | evento | 39,8% |
| `reclama_que_voce_sumiu` | npc | 39,7% |
| `caminhada` | acao | 39,3% |
| `pedir_emprestado` | acao | 39,1% |
| `vontade_ver_o_mar` | npc | 39,1% |
| `filho_adolescente` | evento | 38,8% |
| `viagem_la_para_fora` | evento | 38,5% |
| `estudar_faculdade` | acao | 38,4% |
| `baile_terceira_idade` | acao | 37,9% |
| `ler_livros` | acao | 36,8% |
| `ouvir_historia` | acao | 36,4% |
| `estudar_escola` | acao | 36,3% |
| `hidro_com_a_turma` | acao | 36,1% |
| `namoro_esfriou` | evento | 35,6% |
| `guardar_dinheiro` | acao | 35,6% |
| `paquerar` | acao | 34,0% |
| `correr` | acao | 33,9% |
| `estudar_enem` | acao | 33,9% |
| `rabiscar_parede` | acao | 32,9% |
| `perdeu_emprego_na_crise` | npc | 32,8% |
| `primeiro_investimento` | evento | 32,4% |
| `perguntar_porque` | acao | 31,7% |
| `filho_formatura` | evento | 31,4% |
| `cupido_do_irmao` | acao | 30,7% |
| `videogame_do_amigo` | acao | 30,6% |
| `vontade_de_um_bicho` | npc | 30,6% |
| `check_up` | acao | 30,5% |
| `creche_ou_vo` | evento | 30,2% |
| `estudar_tabuada` | acao | 30,1% |
| `balde_da_pracinha` | evento | 30,0% |
| `bullying_recreio` | evento | 29,9% |
| `falando_bem_de_voce` | npc | 29,6% |
| `pre_escola` | evento | 28,9% |
| `amigo_em_apuros` | npc | 28,8% |
| `pedir_desculpas` | acao | 28,5% |
| `natacao_no_clube` | acao | 28,4% |
| `ajudar_em_casa` | acao | 28,1% |
| `primeiro_beijo` | evento | 27,8% |
| `cuidar_de_doente` | acao | 27,7% |
| `bilhete_carinhoso` | npc | 27,5% |
| `acidente_em_casa` | evento | 27,2% |
| `copa_do_mundo` | evento | 27,0% |
| `vontade_viagem_com_amigo` | npc | 26,3% |
| `piada_no_grupo` | npc | 26,1% |
| `viagem_dos_sonhos` | evento | 25,9% |
| `festa_80` | evento | 25,5% |
| `socorro_com_as_criancas` | acao | 25,4% |
| `visitar_o_tumulo` | acao | 24,8% |
| `colesterol_alto` | evento | 24,6% |
| `perdeu_aniversario` | npc | 24,6% |
| `show_no_estadio` | acao | 24,4% |
| `pelada` | acao | 24,3% |
| `cortar_gastos` | acao | 24,2% |
| `salario_em_dolar` | evento | 24,2% |
| `vontade_voltar_a_terra` | npc | 24,1% |
| `historias_ou_telas` | evento | 23,8% |
| `tentar_um_filho` | acao | 23,6% |
| `cachorro_caramelo` | evento | 23,6% |
| `banda_garagem` | evento | 23,3% |
| `investir_tesouro` | acao | 22,9% |
| `curso_nota_alta` | evento | 22,8% |
| `primeiro_celular` | evento | 22,6% |
| `a_festa_escondida` | evento | 22,2% |
| `golpe_pix` | evento | 22,2% |
| `amigo_pede_dinheiro` | evento | 22,0% |
| `amor_quer_casar` | npc | 22,0% |
| `vape_festa` | evento | 21,9% |
| `carro` | evento | 21,8% |
| `bico_adolescente` | acao | 21,7% |
| `oportunidade_de_negocio` | evento | 21,6% |
| `vacina_no_posto` | evento | 21,6% |
| `avo_conta_historias` | npc | 21,3% |
| `rebalancear` | acao | 21,3% |
| `doar_sangue` | evento | 21,0% |
| `cursinho_pago` | acao | 21,0% |
| `viagem_realizada` | evento | 20,9% |
| `festa_junina` | evento | 20,9% |
| `esporte_depois_da_aula` | evento | 20,6% |
| `cozinhar_com_a_avo` | acao | 20,5% |
| `hora_extra` | acao | 20,3% |
| `o_bebe_chegou` | evento | 20,3% |
| `bet` | evento | 20,3% |
| `casamento` | npc | 20,1% |
| `pelada_de_quinta` | evento | 20,1% |
| `investimento_furado` | evento | 19,9% |
| `festa_tema` | evento | 19,8% |
| `futebol_de_varzea` | acao | 19,6% |
| `crise_la_fora` | evento | 19,2% |
| `filho` | npc | 18,9% |
| `emprego_saude` | evento | 18,7% |
| `largar_tudo` | evento | 18,7% |
| `criptomoeda` | evento | 18,7% |
| `festa_da_cidade` | acao | 18,6% |
| `tempo_com_amor` | acao | 18,1% |
| `previdencia` | acao | 18,1% |
| `feira_ciencias` | evento | 17,9% |
| `casa_dos_pais` | evento | 17,8% |
| `primeira_palavra` | evento | 17,7% |
| `mesada` | evento | 17,6% |
| `reforma_da_casa` | evento | 17,6% |
| `empresa_quebrou` | evento | 17,5% |
| `encontro` | acao | 17,4% |
| `viajar_com_o_amigo` | acao | 17,3% |
| `pai_ausente_volta` | npc | 17,3% |
| `data_da_partida` | evento | 17,3% |
| `hobby_horta` | evento | 17,2% |
| `proposta_na_expansao` | evento | 17,2% |
| `tatuagem` | evento | 17,2% |
| `pisa_em_ovos` | npc | 17,1% |
| `vender_doce` | acao | 17,1% |
| `curso_nota_media` | evento | 17,0% |
| `o_esquema_do_colega` | evento | 17,0% |
| `ceia_de_natal` | evento | 16,9% |
| `bolao_do_trabalho` | evento | 16,9% |
| `reencontro_da_turma` | evento | 16,9% |
| `vaquinha_do_vizinho` | evento | 16,8% |
| `entregas` | acao | 16,7% |
| `vizinho_barulhento` | evento | 16,4% |
| `pensar_em_adotar` | evento | 16,2% |
| `sair_de_casa` | evento | 16,0% |
| `desempregado` | evento | 15,9% |
| `pede_um_favor_a_voce` | npc | 15,8% |
| `mais_um_filho` | npc | 15,5% |
| `subir_de_padrao` | evento | 15,5% |
| `juros_compostos` | evento | 15,5% |
| `voltar_a_estudar` | acao | 15,4% |
| `primeiro_cupom` | evento | 15,3% |
| `orgulho_da_formatura` | npc | 15,2% |
| `irmao_mora_longe` | evento | 15,2% |
| `assalto_na_rua` | evento | 15,0% |
| `tempo_com_filho` | acao | 15,0% |
| `heranca_do_tio` | evento | 14,9% |
| `ingles_crianca` | acao | 14,9% |
| `catapora` | evento | 14,8% |
| `pede_ajuda` | npc | 14,6% |
| `franquia` | evento | 14,5% |
| `faculdade_a_noite` | acao | 14,2% |
| `bateu_o_carro` | evento | 14,0% |
| `moeda_digital` | evento | 13,9% |
| `vontade_ver_o_neto` | npc | 13,6% |
| `ceu_de_fumaca` | evento | 13,6% |
| `fazenda_a_venda` | evento | 13,6% |
| `festa_sem_pais` | evento | 13,4% |
| `festa_de_sao_joao` | evento | 13,4% |
| `mudar_para_a_praia` | evento | 13,2% |
| `casa_propria` | evento | 13,0% |
| `bloco_de_carnaval` | evento | 13,0% |
| `fome_no_fim_do_mes` | evento | 12,9% |
| `plano_de_negocios` | evento | 12,7% |
| `reencontro_amigo` | evento | 12,7% |
| `cripto_fomo` | evento | 12,6% |
| `hidroginastica` | evento | 12,6% |
| `leu_antes_dos_colegas` | evento | 12,5% |
| `sabado_com_os_sobrinhos` | evento | 12,4% |
| `baile_da_terceira_idade` | evento | 12,3% |
| `cirurgia_de_catarata` | evento | 12,2% |
| `amigo_devolve` | npc | 12,2% |
| `aula_de_musica` | evento | 12,0% |
| `carteira_da_diarista` | evento | 11,9% |
| `filho_desenho` | npc | 11,9% |
| `corte_de_salario` | evento | 11,8% |
| `balcao_negocio` | acao | 11,7% |
| `entregador_chuva` | evento | 11,7% |
| `pais_envelhece` | evento | 11,7% |
| `convite_para_palestrar` | evento | 11,7% |
| `levar_ao_mar` | acao | 11,6% |
| `imovel_valorizou` | evento | 11,6% |
| `dolar_barato` | evento | 11,5% |
| `alavancagem` | evento | 11,5% |
| `vaga_sobrando` | evento | 11,4% |
| `idh_muito_alto` | evento | 11,4% |
| `promocao` | evento | 11,3% |
| `pedido_de_casamento` | acao | 11,3% |
| `fugir_inflacao` | acao | 11,2% |
| `voltar_estudar` | evento | 11,2% |
| `irmao_mais_velho_defende` | evento | 11,0% |
| `a_vacina_no_posto` | evento | 10,9% |
| `imposto_alto_no_contracheque` | evento | 10,9% |
| `brigas_de_madrugada` | evento | 10,9% |
| `reuniao_de_condominio` | evento | 10,9% |
| `golpe_do_falso_neto` | evento | 10,8% |
| `cofrinho` | acao | 10,8% |
| `sovina_ou_sabio` | evento | 10,8% |
| `esporte_escola` | acao | 10,8% |
| `convite_do_luxo` | evento | 10,8% |
| `aniversario_da_infancia` | evento | 10,8% |
| `peneira` | evento | 10,7% |
| `investimento_rotina` | evento | 10,7% |
| `separacao` | evento | 10,7% |
| `alugueis_dos_fundos` | evento | 10,6% |
| `multa_e_batida` | evento | 10,6% |
| `surpresa_do_amor` | npc | 10,5% |
| `escrever_memorias` | evento | 10,5% |
| `separacao_dos_pais` | evento | 10,4% |
| `imposto_baixo_sobrou` | evento | 10,3% |
| `feira_de_ciencias` | evento | 10,3% |
| `juros_altos_rendendo` | evento | 10,3% |
| `parar_de_fumar` | acao | 10,2% |
| `maratona` | evento | 10,0% |
| `casa_cheia` | evento | 10,0% |
| `brincar_com_irmao_avo` | acao | 9,9% |
| `role` | acao | 9,8% |
| `praia` | acao | 9,7% |
| `recomecar_amor` | acao | 9,7% |
| `quarto_dividido` | evento | 9,7% |
| `negocio_no_aperto` | evento | 9,7% |
| `concorrente_gigante` | evento | 9,6% |
| `bolsa_la_fora` | evento | 9,6% |
| `rua_tranquila` | evento | 9,6% |
| `casa_na_praia` | evento | 9,6% |
| `filho_imitacao` | npc | 9,5% |
| `bolsa_de_estudos` | evento | 9,5% |
| `comer_tudo` | acao | 9,4% |
| `produto_viralizou` | evento | 9,3% |
| `a_foto_da_festa` | evento | 9,3% |
| `testamento` | evento | 9,2% |
| `pobreza_na_porta` | evento | 9,2% |
| `greve_dos_onibus` | evento | 9,2% |
| `brincar_com_o_pai` | acao | 9,2% |
| `gerente_do_banco` | evento | 9,1% |
| `apartamento_na_planta` | evento | 9,1% |
| `brincar_na_rua` | acao | 9,0% |
| `compra_por_impulso` | evento | 8,9% |
| `pib_recorde` | evento | 8,9% |
| `irmao_doente` | evento | 8,9% |
| `colo_da_avo` | acao | 8,9% |
| `brincar_amigos` | acao | 8,9% |
| `casamento_na_igreja` | npc | 8,9% |
| `assalto_no_onibus` | evento | 8,8% |
| `peito_chiando` | evento | 8,8% |
| `chimarrao` | acao | 8,7% |
| `consorcio` | evento | 8,7% |
| `padrao_de_vida` | evento | 8,7% |
| `ciumes_do_irmao` | evento | 8,7% |
| `bolsa_subiu_sem_voce` | evento | 8,7% |
| `mudanca_de_escola` | evento | 8,7% |
| `seca_no_sertao` | evento | 8,7% |
| `chefe_novo` | evento | 8,7% |
| `remorso_aperta` | evento | 8,5% |
| `sao_joao` | acao | 8,4% |
| `socio_sumiu` | evento | 8,4% |
| `retiro_da_igreja` | evento | 8,4% |
| `amor_piada_interna` | npc | 8,4% |
| `chefe_hora_extra` | npc | 8,3% |
| `investidor_anjo` | evento | 8,2% |
| `cheia_do_rio` | evento | 8,2% |
| `juros_baixos_euforia` | evento | 8,2% |
| `cartao_credito` | evento | 8,1% |
| `passear_de_carrinho` | acao | 7,9% |
| `aposentadoria_ativa` | evento | 7,8% |
| `queda` | evento | 7,8% |
| `apartamento_decorado` | evento | 7,8% |
| `conteudo_extra` | acao | 7,7% |
| `pousada_na_praia` | evento | 7,7% |
| `olimpiada_matematica` | evento | 7,6% |
| `ressaca_do_mar` | evento | 7,6% |
| `atendimento_robo` | evento | 7,6% |
| `crise_40` | evento | 7,5% |
| `voce_mudou` | npc | 7,4% |
| `festival_do_boi` | evento | 7,4% |
| `amor_proposta_fora` | npc | 7,4% |
| `briga_em_casa` | npc | 7,3% |
| `dolar_disparou` | evento | 7,3% |
| `netos` | evento | 7,3% |
| `boi_bumba` | acao | 7,3% |
| `ciume_do_bebe_novo` | evento | 7,2% |
| `pular_corda` | acao | 7,2% |
| `desigualdade_no_jornal` | evento | 7,2% |
| `estatua` | jogada | 7,2% |
| `contas_do_milhao` | evento | 7,2% |
| `soltar_pipa` | acao | 7,1% |
| `figurinha_repetida` | acao | 7,1% |
| `inquilino_dos_sonhos` | evento | 7,1% |
| `dente_de_leite` | evento | 7,1% |
| `nao_acredita_mais` | npc | 7,1% |
| `ouvido_para_musica` | evento | 7,1% |
| `fundo_da_familia` | npc | 7,1% |
| `noite_de_stand_up` | evento | 7,0% |
| `levar_a_terra_natal` | acao | 7,0% |
| `pede_emprestado_a_voce` | npc | 7,0% |
| `ponto_comercial` | evento | 7,0% |
| `apagao_no_morro` | evento | 6,9% |
| `cidadania_italiana` | evento | 6,9% |
| `filho_nao_veio` | npc | 6,9% |
| `cripto_disparou` | evento | 6,9% |
| `festa_surpresa` | evento | 6,9% |
| `chefe_injusto` | evento | 6,9% |
| `titulo_eleitor` | evento | 6,8% |
| `inquilino_sumiu` | evento | 6,8% |
| `vontade_casa_propria` | npc | 6,6% |
| `blitz_toda_noite` | evento | 6,5% |
| `edital_de_cultura` | evento | 6,4% |
| `nome_sujo` | evento | 6,3% |
| `geada_no_sul` | evento | 6,3% |
| `enchente_na_rua` | evento | 6,3% |
| `geladeira_vazia` | evento | 6,1% |
| `desemprego_em_alta` | evento | 6,1% |
| `pressao_alta` | evento | 6,0% |
| `herdeiro_gastao` | evento | 6,0% |
| `adocao_chegou` | evento | 5,9% |
| `mei_negocio` | evento | 5,9% |
| `inflacao_no_mercado` | evento | 5,9% |
| `tocar_no_bar` | acao | 5,8% |
| `auxilio_na_conta` | evento | 5,8% |
| `academia_de_janeiro` | evento | 5,8% |
| `festa_de_15` | evento | 5,8% |
| `pescaria_no_pantanal` | evento | 5,7% |
| `faculdade_vida` | evento | 5,5% |
| `merenda` | evento | 5,5% |
| `fiscalizacao` | evento | 5,4% |
| `mutirao_de_cirurgias` | evento | 5,4% |
| `chaves_do_apartamento` | evento | 5,4% |
| `a_aposta_escondida` | evento | 5,3% |
| `romance_no_trabalho` | evento | 5,3% |
| `grupo_de_jovens` | evento | 5,3% |
| `briga_dos_pais` | evento | 5,3% |
| `filho_cuida` | npc | 5,2% |
| `propina_da_empreiteira` | evento | 5,2% |
| `assembleia_do_predio` | evento | 5,2% |
| `luto_do_bicho` | npc | 5,2% |
| `vender_doce_nato` | acao | 5,1% |
| `concurso_lotado` | evento | 5,1% |
| `festa_do_seculo` | jogada | 5,1% |
| `estatua_pichada` | evento | 5,1% |
| `socio_da_patente` | evento | 5,1% |
| `bico_na_expansao` | evento | 5,0% |
| `paquerar_timido` | acao | 5,0% |
| `doenca_de_quem_ama` | evento | 5,0% |
| `plantao_lotado` | evento | 4,9% |
| `family_office` | evento | 4,9% |
| `festa_vazou` | evento | 4,8% |
| `vo_receita` | evento | 4,8% |
| `vicio_aposta` | evento | 4,8% |
| `filho_saude_fragil` | npc | 4,8% |
| `colega_rouba_ideia` | npc | 4,8% |
| `escolheu_bem` | npc | 4,8% |
| `comecar_terapia` | evento | 4,8% |
| `idh_em_queda` | evento | 4,8% |
| `crise_de_ansiedade` | evento | 4,8% |
| `namorar_depois_dos_60` | evento | 4,8% |
| `casamento_do_filho` | evento | 4,7% |
| `colega_de_licenca` | evento | 4,7% |
| `escola_publica_boa` | evento | 4,6% |
| `cripto_de_novo` | acao | 4,6% |
| `obra_grande_no_norte` | evento | 4,6% |
| `ano_de_prejuizo` | evento | 4,6% |
| `la_fora_comprando` | evento | 4,6% |
| `vo_partiu` | npc | 4,6% |
| `moto_na_chuva` | evento | 4,5% |
| `o_irmao_viu` | npc | 4,5% |
| `proposta_de_compra` | evento | 4,4% |
| `asma_na_educacao_fisica` | evento | 4,4% |
| `briga_na_cozinha` | evento | 4,4% |
| `escola_de_samba` | jogada | 4,4% |
| `festival_lotado` | evento | 4,4% |
| `tarifa_do_app` | evento | 4,3% |
| `greve_do_servidor` | evento | 4,3% |
| `burnout_empresa` | evento | 4,3% |
| `operacao_policial` | evento | 4,3% |
| `a_divida_escondida` | evento | 4,3% |
| `curso_nota_baixa` | evento | 4,2% |
| `colega_happy_hour` | npc | 4,2% |
| `pais_separados_natal` | evento | 4,2% |
| `blindar_contas` | acao | 4,1% |
| `emprestimo_ao_irmao` | evento | 4,1% |
| `votacao_polemica` | evento | 4,1% |
| `ex_nas_redes` | evento | 4,0% |
| `mae_quer_morar_junto` | npc | 4,0% |
| `olimpiada` | acao | 4,0% |
| `mensalidade_da_escola` | npc | 4,0% |
| `bolsa_derreteu` | evento | 4,0% |
| `ex_reencontro` | evento | 3,9% |
| `natal_com_politica` | evento | 3,9% |
| `trabalho_do_pai` | acao | 3,9% |
| `cachoeira` | acao | 3,8% |
| `show_no_bar` | evento | 3,8% |
| `netos_nas_ferias` | evento | 3,8% |
| `aprovado_concurso_estudo` | evento | 3,7% |
| `viralizou` | evento | 3,7% |
| `agro_na_cidade` | evento | 3,7% |
| `amigo_muda_de_cidade` | npc | 3,7% |
| `conselho_que_diz_nao` | jogada | 3,6% |
| `pais_na_crise` | npc | 3,6% |
| `processo_trabalhista` | evento | 3,6% |
| `tentacao_no_trabalho` | evento | 3,6% |
| `excursao_ao_mar` | acao | 3,6% |
| `um_bicho_para_o_filho` | acao | 3,6% |
| `convite_do_partido` | evento | 3,6% |
| `piramide_no_grupo` | npc | 3,5% |
| `confessar_o_esquema` | acao | 3,5% |
| `pescaria_no_rio` | evento | 3,5% |
| `intercambio_pago` | evento | 3,5% |
| `o_que_pensa_de_voce` | npc | 3,5% |
| `heranca` | evento | 3,5% |
| `mutirao_da_laje` | evento | 3,5% |
| `promessa_da_mae` | evento | 3,5% |
| `satelite_na_tv` | evento | 3,4% |
| `cobranca_de_notas` | npc | 3,4% |
| `cobra_voce` | npc | 3,4% |
| `imposto_sobre_fortunas` | evento | 3,3% |
| `bater_o_pe_com_o_chefe` | evento | 3,3% |
| `acordo_abriu_mercado` | evento | 3,3% |
| `sociedade_amigo` | evento | 3,3% |
| `cripto_derreteu` | evento | 3,2% |
| `posto_que_funciona` | evento | 3,2% |
| `tosse_cronica` | evento | 3,2% |
| `ajudar_na_roca` | acao | 3,1% |
| `contaram_do_esquema` | evento | 3,1% |
| `fila_do_posto` | evento | 3,1% |
| `fundacao_com_seu_nome` | evento | 3,1% |
| `vereador` | evento | 3,1% |
| `clinica_particular_contrata` | evento | 3,1% |
| `confeitaria_da_vo` | evento | 3,1% |
| `joelho_da_pelada` | evento | 3,1% |
| `prova_concurso` | evento | 3,0% |
| `funcionario_genial` | evento | 3,0% |
| `crescer_devagar` | evento | 3,0% |
| `primeiro_funcionario` | evento | 3,0% |
| `colega_cobre_voce` | npc | 3,0% |
| `terapia` | acao | 3,0% |
| `balcao_da_familia` | evento | 3,0% |
| `chantagem_do_esquema` | npc | 2,9% |
| `greve_dos_professores` | evento | 2,9% |
| `filho_primeiro_salario` | npc | 2,9% |
| `convite_para_candidatura` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `filho_passou_longe` | npc | 2,8% |
| `ex_namora_amigo` | evento | 2,8% |
| `reajuste_dos_servidores` | evento | 2,8% |
| `cuidar_netos` | acao | 2,8% |
| `depois_do_cargo` | evento | 2,8% |
| `este_e_o_ano` | evento | 2,8% |
| `balcao_de_crianca` | evento | 2,7% |
| `aposentadoria_nao_da` | npc | 2,7% |
| `assumir_negocio` | evento | 2,6% |
| `tentar_outra_cidade` | evento | 2,6% |
| `convite_igreja` | npc | 2,6% |
| `olimpiada_do_instituto` | evento | 2,6% |
| `cursinho_comunitario` | evento | 2,5% |
| `saudade_de_la` | evento | 2,5% |
| `programa_de_moradia` | evento | 2,5% |
| `joias_no_cofre` | evento | 2,5% |
| `so_aparece_por_dinheiro` | npc | 2,5% |
| `governo_que_voce_elegeu_frente_popular` | evento | 2,5% |
| `cobranca_do_casamento` | npc | 2,5% |
| `alguem_especial` | evento | 2,4% |
| `fim_do_amor` | npc | 2,4% |
| `compativel_para_medula` | evento | 2,4% |
| `irmao_desempregado` | npc | 2,4% |
| `amigo_pede_de_novo` | npc | 2,3% |
| `proposta_sao_paulo` | evento | 2,3% |
| `festa_surpresa_para` | npc | 2,3% |
| `filho_quer_carro` | evento | 2,3% |
| `escola_integral` | evento | 2,3% |
| `fiador` | npc | 2,3% |
| `vaga_na_capital` | evento | 2,3% |
| `emprego_tecnologia` | evento | 2,3% |
| `importado_ficou_caro` | evento | 2,2% |
| `carregar_a_geladeira` | evento | 2,2% |
| `clientes_sumiram` | evento | 2,2% |
| `bancar_quem_sai` | jogada | 2,2% |
| `depois_da_venda` | evento | 2,2% |
| `ex_casou` | npc | 2,1% |
| `juros_altos` | evento | 2,1% |
| `voltar_com_o_ex` | npc | 2,1% |
| `ferias_do_dono` | evento | 2,1% |
| `dolar_virou_salario` | evento | 2,1% |
| `apresentacao_para_a_diretoria` | evento | 2,1% |
| `surto_no_bairro` | evento | 2,0% |
| `rodada_grande` | evento | 2,0% |
| `seguranca_particular` | evento | 2,0% |
| `crianca_ansiosa` | evento | 2,0% |
| `plano_de_saude_subiu` | evento | 2,0% |
| `expandir_na_alta` | evento | 2,0% |
| `faculdade_depois_dos_60` | npc | 2,0% |
| `formatura_tardia` | evento | 2,0% |
| `missa_em_familia` | acao | 2,0% |
| `amor_quer_mudar_de_carreira` | npc | 2,0% |
| `shows_cancelados` | evento | 1,9% |
| `crise_no_setor` | evento | 1,9% |
| `enchente_na_cidade` | evento | 1,9% |
| `volta_terra` | evento | 1,9% |
| `gorjeta_boa` | evento | 1,9% |
| `obra_ou_hospital` | evento | 1,8% |
| `ainda_mora_com_pais` | evento | 1,8% |
| `homenagem_no_trabalho` | evento | 1,8% |
| `mural_de_problemas` | jogada | 1,8% |
| `passear_pet` | acao | 1,8% |
| `filho_cuida_de_voce` | npc | 1,8% |
| `conselho_de_fachada` | evento | 1,8% |
| `birra_no_mercado` | evento | 1,8% |
| `hospital_sem_insumo` | evento | 1,8% |
| `irmaos_brigam` | evento | 1,7% |
| `duas_empresas_uma_agenda` | evento | 1,7% |
| `bodas_de_prata` | evento | 1,7% |
| `reencontro_paixao` | evento | 1,7% |
| `ajudar_na_coleta` | evento | 1,7% |
| `cidadania_do_bisavo` | evento | 1,7% |
| `imovel_na_baixa` | evento | 1,7% |
| `cobranca_da_magoa` | npc | 1,6% |
| `emprestimo_de_volta` | evento | 1,6% |
| `aposentado_quer_ajudar_na_empresa` | npc | 1,6% |
| `recaida_cigarro` | evento | 1,6% |
| `briga_por_heranca` | evento | 1,6% |
| `amigo_sumiu_e_voltou` | npc | 1,6% |
| `black_friday` | evento | 1,6% |
| `cupula_la_fora` | evento | 1,6% |
| `carreira_futebol` | evento | 1,5% |
| `embaixador_pede` | evento | 1,5% |
| `renegociar_divida` | evento | 1,5% |
| `obra_do_predio` | evento | 1,5% |
| `arrojado_na_queda` | evento | 1,5% |
| `frete_sumiu` | evento | 1,5% |
| `apuracao_do_carnaval` | evento | 1,5% |
| `governo_que_voce_elegeu_centrao` | evento | 1,5% |
| `cancelado` | evento | 1,5% |
| `amor_paga_a_conta` | npc | 1,5% |
| `amigo_lembra_zoeira` | npc | 1,4% |
| `equipe_para_desmontar` | jogada | 1,4% |
| `reforma_sem_fim` | evento | 1,4% |
| `gravidez_surpresa` | npc | 1,4% |
| `familia_descobre_o_testamento` | evento | 1,4% |
| `ocorrencia_perigosa` | evento | 1,4% |
| `dizimo` | evento | 1,4% |
| `time_a_venda` | evento | 1,4% |
| `convite_para_o_palco_grande` | evento | 1,4% |
| `a_conversa_que_faltava` | npc | 1,4% |
| `segundo_carro` | evento | 1,3% |
| `doar_em_vida` | evento | 1,3% |
| `ex_saudade_de_quem_foi` | evento | 1,3% |
| `ferias_com_a_familia_do_amor` | npc | 1,3% |
| `lesao_grave` | evento | 1,3% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `ex_liga_de_madrugada` | npc | 1,3% |
| `nega_ajuda` | npc | 1,3% |
| `padrao_aperta` | evento | 1,3% |
| `carona_de_madrugada` | npc | 1,3% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,3% |
| `planilha_das_dividas` | evento | 1,3% |
| `pane_no_voo` | evento | 1,3% |
| `presidir_cpi` | evento | 1,3% |
| `irmao_aposentou` | evento | 1,2% |
| `retirada_demais` | evento | 1,2% |
| `visitar_de_longe` | acao | 1,2% |
| `salario_parcelado` | evento | 1,2% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,2% |
| `bolsa_de_iniciacao` | evento | 1,2% |
| `sair_de_casa_cedo` | evento | 1,2% |
| `cara_de_comercial` | evento | 1,2% |
| `rompimento` | npc | 1,2% |
| `oferece_ajuda` | npc | 1,2% |
| `a_auditoria` | evento | 1,2% |
| `o_conselho_vetou` | evento | 1,2% |
| `fronteira_fechada` | evento | 1,2% |
| `emprego_educacao` | evento | 1,1% |
| `pix_para_a_cidade` | jogada | 1,1% |
| `sucessao_regime` | evento | 1,1% |
| `tocar_o_negocio` | acao | 1,1% |
| `o_ex_quer_um_cafe` | npc | 1,1% |
| `foto_de_campanha` | evento | 1,1% |
| `preco_do_pao` | evento | 1,1% |
| `chefe_amigo` | evento | 1,1% |
| `filho_parou_de_contar` | npc | 1,1% |
| `estatua_derrubada` | evento | 1,1% |
| `vida_depois_da_condenacao` | evento | 1,0% |
| `greve_da_federal` | evento | 1,0% |
| `acoes_da_startup` | evento | 1,0% |
| `solucao_inesperada` | evento | 1,0% |
| `lembranca_primeiro_amor` | evento | 1,0% |
| `paparazzi` | evento | 1,0% |
| `tornar_se_dispensavel` | jogada | 0,9% |
| `aniversario_de_gemeos` | evento | 0,9% |
| `calote_no_noticiario` | evento | 0,9% |
| `happy_hour` | acao | 0,9% |
| `dez_anos_de_empresa` | evento | 0,9% |
| `depois_do_calote` | evento | 0,9% |
| `bancar_presidente` | jogada | 0,9% |
| `mesa_cheia` | evento | 0,9% |
| `promocao_em_outra_cidade` | evento | 0,9% |
| `amor_desconfia` | npc | 0,9% |
| `grade_na_janela` | evento | 0,9% |
| `acampamento_na_porta` | evento | 0,9% |
| `mais_uma_mudanca` | evento | 0,9% |
| `proposta_da_europa` | evento | 0,9% |
| `o_caso_vem_a_tona` | evento | 0,8% |
| `hit_viral` | evento | 0,8% |
| `cobranca_no_telefone` | evento | 0,8% |
| `holding_da_familia` | evento | 0,8% |
| `vontade_festa_de_80` | npc | 0,8% |
| `fundacao` | jogada | 0,8% |
| `nao_para_quieto` | evento | 0,8% |
| `ex_cobra` | npc | 0,8% |
| `desfile_das_campeas` | evento | 0,8% |
| `set_de_gravacao` | evento | 0,8% |
| `deploy_de_sexta` | evento | 0,8% |
| `guerra_comercial` | evento | 0,8% |
| `lista_dos_mais_ricos` | evento | 0,7% |
| `papel_da_vida` | evento | 0,7% |
| `favor_do_presidente` | evento | 0,7% |
| `proposta_em_dolar` | evento | 0,7% |
| `critico_no_salao` | evento | 0,7% |
| `ex_internado` | evento | 0,7% |
| `desabafar_o_caso` | acao | 0,7% |
| `apartamento_de_presente` | evento | 0,7% |
| `vaga_na_empresa_dele` | npc | 0,7% |
| `trator_aos_dez` | evento | 0,7% |
| `rebaixamento` | evento | 0,7% |
| `chefe_elogia` | npc | 0,7% |
| `feirao_limpa_nome` | evento | 0,7% |
| `sancao_parou_o_porto` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `jantar_esfriou` | npc | 0,7% |
| `casamento_dos_outros` | evento | 0,7% |
| `mestrado_fora` | evento | 0,7% |
| `pai_namorando_de_novo` | npc | 0,7% |
| `amigo_ficou_rico` | npc | 0,7% |
| `filho_briga_na_escola` | npc | 0,7% |
| `desfile_de_sete_de_setembro` | evento | 0,7% |
| `quartel_sem_verba` | evento | 0,7% |
| `pedreiro_vale_ouro` | evento | 0,7% |
| `a_empresa_sem_voce` | evento | 0,7% |
| `divida_publica_assusta` | evento | 0,7% |
| `contrato_publicitario` | evento | 0,7% |
| `noite_da_apuracao` | evento | 0,7% |
| `exportacao_bate_recorde` | evento | 0,7% |
| `cobranca_do_filho` | npc | 0,6% |
| `oferta_pela_subsidiaria` | evento | 0,6% |
| `livro_viralizou` | evento | 0,6% |
| `tradutor_da_familia` | evento | 0,6% |
| `juros_altos_na_fatura` | evento | 0,6% |
| `obra_atrasada` | evento | 0,6% |
| `vendas_recorde` | evento | 0,6% |
| `burnout` | evento | 0,6% |
| `o_mural_do_boton` | evento | 0,6% |
| `queda_do_cargo` | evento | 0,6% |
| `amor_quadro_de_tarefas` | npc | 0,6% |
| `robos_na_fabrica` | evento | 0,6% |
| `safra_da_fazenda` | evento | 0,6% |
| `segredo_de_familia` | npc | 0,6% |
| `intercambio` | evento | 0,6% |
| `fazer_as_pazes` | acao | 0,6% |
| `fila_do_emprego` | evento | 0,6% |
| `renegociar_cartao` | acao | 0,5% |
| `ajudar_com_a_casa` | acao | 0,5% |
| `filho_apresenta_namoro` | npc | 0,5% |
| `turne_nacional` | evento | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,5% |
| `vaga_no_agro` | evento | 0,5% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,5% |
| `ministro_pede_ajuste` | evento | 0,5% |
| `treinar_no_clube` | acao | 0,5% |
| `peneira_do_sobrenome` | evento | 0,5% |
| `infancia_no_palacio` | evento | 0,5% |
| `o_laboratorio_apaga_a_luz` | evento | 0,5% |
| `bola_autografada` | evento | 0,5% |
| `confessar_o_caso` | acao | 0,5% |
| `segunda_chance` | npc | 0,5% |
| `fim_de_semana_no_sitio` | evento | 0,5% |
| `carro_de_luxo_na_rua` | evento | 0,5% |
| `briga_de_casal` | npc | 0,5% |
| `racionamento` | evento | 0,5% |
| `layoff_por_email` | evento | 0,5% |
| `cavalo_campeao` | evento | 0,5% |
| `quebra_de_safra` | evento | 0,4% |
| `ameaca_de_sancao` | evento | 0,4% |
| `a_convocacao` | evento | 0,4% |
| `guerra_na_escola` | evento | 0,4% |
| `mordomias_reais` | evento | 0,4% |
| `contaram_da_festa` | evento | 0,4% |
| `assinatura_real` | evento | 0,4% |
| `paciente_famoso` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `pressao_carreira` | npc | 0,4% |
| `filial_fechando` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `a_conta_da_coroa` | evento | 0,4% |
| `feriado_na_praia` | evento | 0,4% |
| `edital_da_ciencia` | evento | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `celular_dos_pais` | npc | 0,4% |
| `safra_recorde` | evento | 0,4% |
| `plantao_que_nao_acaba` | evento | 0,4% |
| `final_da_copa` | evento | 0,4% |
| `tomar_o_poder` | jogada | 0,4% |
| `oposicao_na_tv` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `negocio_em_crise` | evento | 0,4% |
| `aluguel_caro` | evento | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `circo_vai_embora` | evento | 0,4% |
| `carro_de_presente` | evento | 0,3% |
| `emprego_negocios` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `greve_geral` | evento | 0,3% |
| `o_bicho_herdeiro` | evento | 0,3% |
| `montadora_vai_fechar` | evento | 0,3% |
| `despejo` | evento | 0,3% |
| `proposta_pelo_negocio` | evento | 0,3% |
| `picadeiro` | evento | 0,3% |
| `cobrar_divida` | acao | 0,3% |
| `transito_de_sp` | evento | 0,3% |
| `obra_parada` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `filho_hamburgueria` | npc | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `noite_de_corridas` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `internato_real` | evento | 0,3% |
| `bonanca_no_governo` | evento | 0,3% |
| `pais_envelhecem` | npc | 0,3% |
| `confessar_a_divida` | acao | 0,3% |
| `bonus_do_banco` | evento | 0,3% |
| `padrinho_casamento` | npc | 0,3% |
| `aperto_do_mes` | evento | 0,3% |
| `proposta_remota` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `protesto_na_praca` | evento | 0,3% |
| `fa_obcecado` | evento | 0,3% |
| `filho_planilha_da_velhice` | npc | 0,3% |
| `trazer_a_copa` | jogada | 0,3% |
| `as_criancas_perguntam` | npc | 0,3% |
| `fabrica_de_municao` | evento | 0,3% |
| `tentar_a_vida_na_europa` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `a_divida_vem_a_tona` | evento | 0,2% |
| `concurso_em_brasilia` | evento | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `vista_da_cobertura` | evento | 0,2% |
| `violencia_vira_manchete` | evento | 0,2% |
| `fusao_de_iguais` | evento | 0,2% |
| `jubileu` | evento | 0,2% |
| `assumir_a_fazenda` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `contaram_do_caso` | evento | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `conselho_quer_ceo` | evento | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `importado_invadiu` | evento | 0,2% |
| `pais_aposentados` | npc | 0,2% |
| `irmao_separou` | npc | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `reconciliacao` | npc | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `chantagem_do_caso` | npc | 0,2% |
| `reencontro_amigo_brigado` | evento | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `construtora_quebrou` | evento | 0,2% |
| `tribunal_internacional` | evento | 0,2% |
| `chefe_magoado_cobra` | npc | 0,2% |
| `ferias_coletivas` | evento | 0,2% |
| `sequestro_frustrado` | evento | 0,2% |
| `abrir_capital` | evento | 0,2% |
| `paparazzi_real` | evento | 0,2% |
| `escola_militar` | evento | 0,2% |
| `conselho_dos_generais` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `regra_sob_medida` | evento | 0,2% |
| `filho_convocado` | evento | 0,2% |
| `cura_de_doenca` | jogada | 0,2% |
| `caso_do_poderoso` | evento | 0,2% |
| `cliente_perdeu_tudo` | evento | 0,2% |
| `shopping_lotado` | evento | 0,2% |
| `filho_distante` | npc | 0,1% |
| `amor_sempre_trabalhando` | npc | 0,1% |
| `royalties_secaram` | evento | 0,1% |
| `amor_gastador` | npc | 0,1% |
| `turno_extra_na_fabrica` | evento | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `cargo_no_gabinete` | evento | 0,1% |
| `operacao_no_gabinete` | evento | 0,1% |
| `mansao_vazia` | evento | 0,1% |
| `o_veterano` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `casamento_real` | evento | 0,1% |
| `parcela_da_tv` | npc | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `escandalo_do_lobby` | evento | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `ficar_no_poder` | jogada | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `teste_por_indicacao` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `grupo_na_capa` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `zona_franca` | evento | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `lancamento` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `filho_foi_embora` | npc | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `devedor_some` | npc | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `caramelo_envelhece` | npc | 0,0% |
| `amor_saude_fragil` | npc | 0,0% |
| `fundacao_premio` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `receita_no_seu_pe` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `rival_bilionario` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `contaram_da_divida` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `restaurar_a_monarquia` | jogada | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `helicoptero_no_teto` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 211 · **mudaram algo em pelo menos uma vida:** 212
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,5 · p10 53 · p25 61 · mediana 71 · p75 81 · p90 88

```
até 19                                        0,3%
20–29                                         0,4%
30–39          █                              0,7%
40–49          █████                          4,1%
50–59          ████████████████████           16,4%
60–69          ██████████████████████████████ 25,1%
70–79          █████████████████████████████  24,6%
80–89          █████████████████████████      20,8%
90–99          ████████                       6,9%
100+           █                              0,8%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 243 mil · p25 R$ 728 mil · mediana R$ 3,4 milhões · p75 R$ 29 milhões · p90 R$ 110 milhões

```
negativo       █                              0,8%
até 10 mil                                    0,4%
10–50 mil      █                              1,5%
50–200 mil     ████                           5,7%
200 mil–1 mi   ███████████████                21,9%
1–5 mi         ████████████████               24,5%
5 mi+          ██████████████████████████████ 45,2%
```

**Felicidade média ao longo da vida** — p10 61 · mediana 75 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,9%
50–59          █████                          7,0%
60–69          ██████████████████             24,4%
70–79          ██████████████████████████████ 40,6%
80+            ████████████████████           27,1%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,9 | R$ 985 mil | 67,8 | 58,0 | 161,7 | 65,6 | 100% | 52% |
| cautelosa | 83,0 🏆 | R$ 44 milhões 🏆 | 76,1 | 68,5 | 194,4 | 70,5 | 100% | 59% |
| arriscada | 57,4 | R$ 2,3 milhões | 79,9 🏆 | 53,7 | 139,7 | 99,7 | 100% | 50% |
| aleatoria | 75,7 | R$ 1,7 milhão | 71,0 | 65,4 | 136,7 | 79,9 | 100% | 49% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,7% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,6% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,2% — de um AVC, numa terça-feira sem graça
- 7,4% — de pneumonia, depois de teimar que era só uma gripe
- 6,2% — numa cirurgia simples que não foi tão simples
- 5,7% — de complicações de uma queda no banheiro
- 5,3% — de velhice, dormindo, num domingo depois do almoço
- 4,7% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
