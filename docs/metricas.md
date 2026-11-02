# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 657 eventos, 138 de personagens, 121 ações, 1903 escolhas, 239 linhas, 157 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 4091500 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4677227 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 40 mil |
| Inflação no dinheiro parado | os preços | 99,8% | -R$ 447 mil |
| Acontecimentos | o mercado | 99,8% | -R$ 10 mil |
| Custo de vida | o mercado | 99,7% | -R$ 627 mil |
| Padrão de vida | o mercado | 99,6% | -R$ 4,8 milhões |
| Bico | o mercado | 99,2% | R$ 45 mil |
| Salário | o mercado | 95,7% | R$ 3,4 milhões |
| Juro da renda fixa | o governo | 88,8% | R$ 167 mil |
| Cotação dos investimentos | os preços | 86,3% | R$ 1,3 milhão |
| Imposto | o governo | 83,8% | -R$ 58 mil |
| Auxílio | o governo | 82,3% | R$ 18 mil |
| Imposto mais baixo | o governo | 82,1% | R$ 55 mil |
| Juros da dívida | o banco | 78,7% | -R$ 1,9 mil |
| Compras e vendas | o mercado | 73,8% | -R$ 1,7 milhão |
| Manutenção dos bens | o mercado | 73,8% | -R$ 600 mil |
| Gastos da velhice | o mercado | 66,8% | -R$ 995 mil |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 5,4% | 5,0 | 5,4% | 2,8% | 0,0% | 3,7% |
| cautelosa | 0,0% | 1,6% | 0,0 | 1,6% | 0,0% | 0,0% | 0,0% |
| arriscada | 92,8% | 20,1% | 1,0 | 10,4% | 1,9% | 15,3% | 15,1% |
| aleatoria | 49,6% | 14,9% | 1,0 | 8,4% | 1,4% | 10,8% | 10,4% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 10,5% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,86 anos com acordo (630 vezes) × 3,01 sem (358 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 18,3% de 3561 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,5% das vidas; 14,6% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 38,0% | R$ 46 mil | 813 | 0 (0) | 0,9% | R$ 2,9 milhões (2 vidas) |
| cautelosa | 99,0% | 5,4 | 55,8% | R$ 1,1 milhão | 13882 | 29 (17) | 1,1% | R$ 626 mil (11 vidas) |
| arriscada | 0,0% | — | 15,8% | R$ 7,4 mil | 163 | 152 (77) | 1,8% | R$ 479 milhões (24 vidas) |
| aleatoria | 87,4% | 2,4 | 16,1% | R$ 20 mil | 3570 | 1597 (878) | 1,2% | R$ 60 mil (14 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 99,0%, arriscada 0,0%, aleatoria 87,4% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,3% (127 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 187 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2597 | R$ 3,9 milhões | 0,3 |
| parte dos impostos | 1215 | R$ 1,9 bilhão | 0,7 |
| taxa da coroa | 1777 | R$ 29 bilhões | 0,3 |

A ilha: 36 vidas fundaram ou herdaram uma. População no fim: p10 2271, mediana 2681, p90 3386.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 0,3 quedas por 100 anos com a taxa (1777 anos) × 0,3 com o salário (2597 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 36 ilhas; mediana de 2896 habitantes sem a taxa (28) e 2092 com 5 anos ou mais de taxa (6) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 170629 | -0,70 |
| regular | 344912 | -0,04 |
| prioridade | 191933 | +0,75 |

A tecnologia ao morrer: p10 42,3, mediana 49,8, p90 58,5. Descobertas por 100 vidas: a cura 18,1, o satélite 17,7, a patente 17,3; 29,1% das vidas veem uma. A fuga de cérebros: 26,0% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (170629 anos) · regular -0,04 por ano (344912 anos) · prioridade +0,75 por ano (191933 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,3 · mediana 49,8 · p90 58,5 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 29,1% das vidas; 89,3% de 5310 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 183871 | -0,83 |
| regular | 344425 | -0,01 |
| reforçada | 179178 | +0,85 |

A capacidade ao morrer: p10 43,0, mediana 49,6, p90 57,7. Encomendas por 100 vidas: 7,2 (665 entregas). Guerras por 100 vidas: 3,1, em 3,0% das vidas; acabaram em vitória 65, derrota 74 e cessar-fogo 153, com 2,9 anos em média. Pedidos de paz: 0; convocações: 71; 0,3% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,83 por ano (183871 anos) · regular -0,01 por ano (344425 anos) · reforçada +0,85 por ano (179178 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 3,0% das vidas; 90,4% de 311 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,6% de 4783 anos · forte: 2,8% de 5007 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ✅ | 0,39% em 3062 anos de guerra · 2,05% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ❌ | a mais longa: 10 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 400 em vida (100,0% com resposta) e 116 na herança (98,3%). De 121 herdeiros que começaram na fila, 75,2% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 41 | 78,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 67 | 49,3% | primeira 0 · cautelosa 0 · arriscada 5 · aleatoria 0 |
| Mudar a Constituição para mais um mandato | 1 | 100,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Restaurar a monarquia no plebiscito | 70 | 47,1% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 1 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ❌ | em vida 100,0% de 400 · na herança 98,3% de 116 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 108 tentativas, 60,2% deram certo |

## A rede (missão Ω1)

As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (`docs/auditoria-omega.md`). Nas vidas sorteadas, cada vida tem em média 14,4 pessoas diferentes, 0,30 ex, 1,57 irmãos (0,86 nascidos depois de quem joga) e 7,14 pessoas do trabalho.

| Portão | Situação | Valor |
|---|---|---|
| A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão | ✅ | ex em 25,1% · irmão em 80,1% |
| As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe | ✅ | 4,8 entradas por vida, com 14,4 pessoas por vida |
| A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada) | ✅ | ex que voltou 77 · colega que virou amigo 40 · romance do trabalho 72 |

## Os verbos sociais (missão Ω2)

Quando a resposta é de uma pessoa, ela decide pelo estado e pela memória dela e diz por quê (`decisao.ts`); o empréstimo entre pessoas é uma promissória, com parcela, atraso, quitação e calote (`promissorias.ts`). Nas vidas sorteadas: 16,1 respostas por vida, sim em 40,7%, e 47,0% delas com o porquê apontando um ano anterior.

| Portão | Situação | Valor |
|---|---|---|
| A pessoa decide: ≥ 60% das vidas têm um pedido respondido por alguém, e o sim fica entre 30% e 80% das respostas | ✅ | 67,3% das vidas · 16,1 respostas por vida · sim em 40,7% |
| O porquê cita o passado: ≥ 25% das respostas dizem a lembrança que pesou ("…, aos 31") ou a dívida em aberto | ✅ | 47,0% das respostas |
| O empréstimo entre pessoas acontece e acaba dos dois jeitos: em ≥ 10% das vidas, e dos que acabam, ≥ 50% quitados e ≥ 3% em calote | ✅ | em 35,8% das vidas (12353 empréstimos: 11884 pegos, 469 feitos) · 9485 quitados, 1178 calotes, 3135 parcelas atrasadas |

## Os projetos (missão Ω3)

Quem joga declara o que quer da vida; as etapas são condições do estado, e o fim vai para o livro com o começo de causa (`projetos.ts`). Por projeto, começados / conquistados: sair_das_dividas 2028 / 1624 · casa_propria 4329 / 2482 · ter_um_filho 2518 / 2130 · negocio_proprio 7068 / 92 · reparar_relacao 350 / 90 · cuidar_da_saude 3448 / 74 · primeiro_milhao 3924 / 2753 · casar 1304 / 1127 · diploma 3720 / 817.

| Portão | Situação | Valor |
|---|---|---|
| Os planos existem: ≥ 40% das vidas começam um plano | ✅ | 74,6% das vidas · 2,87 planos por vida |
| Os planos acabam dos dois jeitos: dos que acabam, as conquistas ficam entre 20% e 80% | ✅ | 11189 conquistas, 12463 prazos vencidos, 3324 desistências, 96 sem tempo (conquista em 41,3%) |
| Todo plano acontece: cada um é começado e conquistado em alguma vida | ✅ | 9 de 9 |

## Os segredos (missão Ω4)

Quem joga esconde coisas de alguém; quem sabe pode contar pelos círculos (a família e o par, os amigos, os ex, o trabalho), e a notícia que chega ao alvo vira revelação, com quem contou e a causa (`segredos.ts`). Por tema, nascidos / contados ao alvo: caso 144 / 18 · divida 136 / 1 · festa 1275 / 51 · esquema 1269 / 332.

| Portão | Situação | Valor |
|---|---|---|
| Os segredos existem: ≥ 15% das vidas guardam um | ✅ | 26,0% das vidas · 0,28 por vida |
| A notícia corre: um boato (alguém que soube pela boca de outro) para cada 4 segredos ou mais | ✅ | 864 boatos para 2824 segredos · 402 chegaram a quem não devia · 299 chantagens |
| Os segredos acabam de todo jeito: contados, descobertos, confessados e calados, cada um em ≥ 5% dos que acabam | ✅ | contados 14,7% · descobertos 52,1% · confessados 16,4% · calados 16,8% (de 2564) |
| Todo segredo chega a quem não devia: cada tema nasce e é contado ao alvo em alguma vida | ✅ | 4 de 4 |

## Os capítulos (missão Ω5)

A peneira lê o livro de cada vida e reconhece os arcos com começo e fim, que a linha do tempo e o cartão mostram (`capitulos.ts`).

| Portão | Situação | Valor |
|---|---|---|
| A vida tem capítulos: ≥ 50% das vidas têm um arco reconhecido no livro | ✅ | 69,7% das vidas · 1,47 por vida · 20,3% com dois tipos ou mais |
| Todo tipo de capítulo acontece (o plano, o segredo, a volta, o calote, o favor e as pazes) | ✅ | plano 11282 · segredo 2133 · volta 75 · calote 1178 · favor 58 · pazes 18 |

## O caminho e o ritmo (missão Ω6)

A variedade das vidas medida pela estrutura causal (as causas dos pontos de virada e os capítulos, ao lado da assinatura do destino), os elos de causa distintos e o ritmo: depois de um ano pesado, as histórias leves ganham a vez (`diretor.ts › ritmoDoAno`).

| Portão | Situação | Valor |
|---|---|---|
| O caminho varia mais que o destino: as assinaturas do caminho (as causas dos pontos de virada e os capítulos) passam as do destino | ✅ | caminho 645 · destino 568 por 1.000 vidas · 45,6 elos causais por vida, 2726 distintos no túnel |
| A vida respira: depois de um ano pesado, o seguinte também é pesado em ≤ 10% das vezes | ✅ | 5,6% de 43329 anos pesados |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 28 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,36 ms | 1,6% | 32,8 KB | — | guerra, pais, moeda, pesquisa, empresa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,67 ms | 0,5% | 0,0 KB | exterior | pais, moeda, pesquisa, empresa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 5,29 ms | 3,6% | 59,5 KB | exterior, guerra | moeda, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, poder, coroa, regras, iniciativas, diretor |
| moeda (o dinheiro: a inflação que vai para quem emitiu, o caixa do governo, o câmbio, o crédito dos bancos e a emissão do Banco Central) | 0,65 ms | 0,4% | 31,4 KB | guerra, pais | empresa, bens, tesouro, dividas, personagens, regras, iniciativas, diretor |
| setores (os mercados de cada setor: a obra que fica pronta, a procura do ano e o preço que decide a obra do ano que vem) | 2,25 ms | 1,5% | 92,4 KB | pais | iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,19 ms | 0,1% | 0,4 KB | guerra, pais | poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,70 ms | 0,5% | 18,6 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 2,05 ms | 1,4% | 29,3 KB | pais, mercado | empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: o negócio do ano (vendas, custos, imposto, caixa, dividendos, obra), os empregos da cidade e a quebra) | 1,85 ms | 1,3% | 19,1 KB | exterior, guerra, pais, moeda, setores, pesquisa, mercado, economia | bens, tesouro, dividas, promissorias, corpo, personagens, carreira, poder, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,19 ms | 0,8% | 14,8 KB | pais, moeda, mercado, economia, empresa | tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,38 ms | 0,3% | 2,7 KB | pais, moeda, economia, empresa, bens | dividas, promissorias, personagens, regras, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,42 ms | 0,3% | 0,3 KB | pais, moeda, economia, empresa, bens, tesouro | promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| promissorias (os empréstimos entre pessoas: a parcela, o atraso que magoa, a quitação e o calote) | 0,36 ms | 0,2% | 1,6 KB | pais, economia, empresa, bens, tesouro, dividas | personagens, segredos, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,06 ms | 0,0% | 0,0 KB | economia | corpo, personagens, projetos, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,93 ms | 1,3% | 21,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao | personagens, trabalho, carreira, poder, coroa, projetos, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 5,30 ms | 3,6% | 78,3 KB | exterior, pais, moeda, setores, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo | trabalho, carreira, poder, coroa, projetos, segredos, regras, iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,22 ms | 0,1% | 1,7 KB | pais, setores, empresa, promissorias, personagens | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,62 ms | 0,4% | 1,8 KB | pais, promissorias, corpo, personagens, trabalho | poder, coroa, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 0,97 ms | 0,7% | 3,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,16 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,06 ms | 0,0% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, promissorias, personagens | iniciativas, diretor |
| projetos (os projetos: a meta alcançada vira conquista, o prazo passado vira fracasso) | 0,39 ms | 0,3% | 0,9 KB | tudo o que veio antes | segredos, regras, morte, amor, iniciativas, diretor |
| segredos (os segredos: quem sabe pode contar, e a notícia que chega ao alvo agenda a revelação) | 2,30 ms | 1,6% | 0,1 KB | tudo o que veio antes | regras, morte, amor, iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 3,23 ms | 2,2% | 17,3 KB | pais, moeda, setores, bens, tesouro, dividas, privacao, corpo, personagens, projetos | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,73 ms | 0,5% | 0,4 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa, projetos | iniciativas, diretor |
| amor (o amor que aparece e o namoro que esfria) | 0,14 ms | 0,1% | 0,0 KB | promissorias, corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 25,47 ms | 17,5% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 19,32 ms | 13,3% | 1,8 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 66,50 ms | 45,6% | — | — | — |

O save de uma vida (amostra de 1040): mediana 502 KB, p90 616 KB, máximo 767 KB; o livro é 97,3% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 767 KB (mediana 502 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 145,74 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 56,8% | 29,8% | 11,8% | 1,5% | 0,1% |

Entre as vidas com filhos (43,2%), a média é de 1,35 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 13,4% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 15,0% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 52,6% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 906 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 9,17 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 477,2 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 12,7% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,5% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,1% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,35 |
| Saturação V20 ≤ 95% | ✅ | 87,4% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 906 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 145,74 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,8% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 61,9% (168 dinastias, média de 3,1 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,90 (357 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 5,94% (p99 R$ 688 milhões, maior R$ 555 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,69% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 26,6% de 55,8% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 16,0% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 87,4% |
| Assinaturas sem regressão (≥ 918) | ❌ | 906 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 477,2 |
| CPU por vida ≤ 30 ms | ❌ | 145,74 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 97,1% (10,0 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 71,7% de 3782 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (665), A festa do século (577), Pix para a cidade inteira (365), Uma estátua sua (267), Um conselho que diz não (189), Uma fundação com seu nome (174), Bancar um presidente (167), Trazer a Copa do Mundo (143), Pagar a cura de uma doença (133), Uma equipe para desmontar (131), Um mural de problemas (120), Tornar-se dispensável (119), Bancar quem quer sair (115), Tomar o poder (114), Um programa espacial (111), Comprar a estatal (80), Fundar uma cidade (78), Restaurar a monarquia (74), Ficar no poder (64), Salvar o país da crise (34), Fundar um país (33), Uma colônia em Marte (29).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 4 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 39,5% de 1819 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 23,1% delegaram, 62,8% centralizaram (658 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 36,8% (34,3 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (729), Bancar quem quer sair (418), Uma equipe para desmontar (360), Um mural de problemas (355), Tornar-se dispensável (293).
- **Na morte de quem manda:** a empresa perde em média 26,2% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 16 anos (7757 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 981 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 54,0% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 64,0% / 23,6% / 10,0% / 2,4% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,2 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,3%, o bloco liberal 24,2%, a aliança da ordem 24,6%, o centrão 24,8%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,6%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,56% × 1,86%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 85% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,69% contra 0,79% por ano (39407 e 52597 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ❌ | 1,39 votos por vida, 31,5% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,02 × 0,71 pontos do PIB por ano (162 e 171 governos); 97,0% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,0% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 200.945 | 1,9% | 8,2% | 4,9% | 82% | 21,0% | 20,5 | 58 | 55 | 50% |
| o centrão | 189.687 | 2,1% | 8,3% | 4,9% | 85% | 25,1% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 188.038 | 1,7% | 8,4% | 5,4% | 73% | 29,5% | 17,6 | 50 | 45 | 53% |
| o bloco liberal | 184.884 | 2,6% | 8,6% | 3,3% | 81% | 29,6% | 22,1 | 43 | 50 | 51% |
| quem joga | 12.708 | 2,0% | 8,4% | 7,0% | 70% | 25,0% | 18,4 | 52 | 50 | 50% |
| o regime | 5.708 | 1,4% | 9,1% | 10,3% | 12% | 31,6% | 17,0 | 37 | 37 | 43% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,7% de 6502 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,7% fundiram, 6,0% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 3 anos; nas vidas jogadas, o maior grupo teve 1013 (p99 21) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,39 ponto em média (27965 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,36 na bolsa (8717 empresas-ano) × 0,00 fechadas (118619) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,2% de 38066 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,19 · mediana R$ 5,16 · p90 R$ 6,41 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,0% × 3,7% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,33 no agro (3331 empresas-ano) × -0,39 no comércio (29876), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 34,3%, acordo em 74,7%; 95,4% das sanções acabam em até 15 anos (mediana 4, p90 10) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,3% de 5220 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,85% × 0,13% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,68% × 0,32% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 75,3% de 396 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 200.945 | 0,17% | 2,95% |
| o centrão | 189.687 | 0,16% | 0,56% |
| a aliança da ordem | 188.038 | 1,90% | 0,32% |
| o bloco liberal | 184.884 | 0,28% | 3,68% |
| quem joga | 12.708 | 2,05% | 3,92% |
| o regime | 5.708 | 3,89% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,528, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,799–0,867, Gini 0,483–0,561 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 8,6% · desigualdade_no_jornal 7,1% · idh_muito_alto 11,3% · idh_em_queda 5,2% · pais_envelhece 11,9% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,799 | 0,830 | 0,867 |
| Desigualdade (Gini) | 0,483 | 0,528 | 0,561 |
| População (milhões) | 180 | 193 | 206 |
| PIB per capita | R$ 118 mil | R$ 244 mil | R$ 548 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 52,6% / 87,4% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 61,9% |
| Efeito da memória (aleatória, V5 sem → com memória) | 57,9% → 49,3% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 906 (568) |
| Mobilidade: mesmo quintil da origem ao fim | 27,7% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,35 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,5% / 3,1% |
| Patrimônio p90/p10 | 444,3× (p10 R$ 234 mil, p90 R$ 104 milhões) |
| Desvio-padrão da felicidade média da vida | 9,17 |
| Vidas com patrimônio negativo ao morrer | 0,7% |
| Mudanças de estado causadas pelo jogador | 44,3% |
| Toques por vida | 477,2 |
| Tempo de CPU por vida | 145,74 ms |
| Ações (fichas usadas) por vida | 158,9 |
| Mortes na família por vida | 5,1 |
| Pontos de virada que vêm do mundo (não do jogador) | 12,7% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 32,3 |
| Vidas que terminam com filho ou filha para continuar | 84,8% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,1 / 61,9% / 25,0% |
| Idade de quem herda ao começar (mediana) / herança mediana | 39 anos / R$ 4,4 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,90 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 55,8% |
| Entre quem abriu: quebrou / vendeu | 26,6% / 25,0% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 1,7 milhão / R$ 58 milhões / R$ 688 milhões / R$ 555 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 29,59% / 5,94% / 0,69% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 16,0% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 61,5 / 158,9 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 831 | R$ 114 mil | R$ 1,1 milhão | R$ 28 milhões |
| moderado | 895 | R$ 123 mil | R$ 1,5 milhão | R$ 27 milhões |
| arrojado | 774 | R$ 117 mil | R$ 1,8 milhão | R$ 40 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 67,5 | R$ 1,4 milhão | 73,2 |
| pobre | 104 | 71,1 | R$ 2,6 milhões | 75,0 |
| remediada | 24 | 71,8 | R$ 1,7 milhão | 75,7 |
| media | 64 | 68,9 | R$ 3,4 milhões | 73,8 |
| rica | 64 | 70,1 | R$ 4,6 milhões | 74,9 |
| muito rica | 144 | 71,0 | R$ 21 milhões | 74,6 |
| bilionaria | 356 | 70,9 | R$ 2,4 bilhões | 75,6 |
| trilionaria | 276 | 70,3 | R$ 676 bilhões | 76,0 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 64% / 24% / 10% / 2% |
| Notícias do país por vida | 42,4 |
| Demissões por vida / vindas de uma recessão ou crise | 0,60 / 32,1% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 50% · serviços 15% · saúde 11% · cultura e internet 6% · transporte e entregas 5% · comércio 3% · agro 3% · construção 2% · sem setor 2% · tecnologia 2% · indústria 1% · finanças 1% · educação 1% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 21% | 33% | 43% | 53% | 74% | 83% | 87% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 32% | 21% | 16% | 16% | 14% |
| Q2 | 30% | 22% | 18% | 16% | 14% |
| Q3 | 23% | 24% | 20% | 18% | 15% |
| Q4 | 11% | 25% | 27% | 23% | 15% |
| Q5 | 3% | 8% | 20% | 28% | 41% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,7 | R$ 1,4 milhão | 73,4 |
| família pobre | 24% | 70,5 | R$ 1,3 milhão | 73,8 |
| família remediada | 20% | 71,8 | R$ 1,9 milhão | 73,7 |
| classe média | 18% | 70,2 | R$ 2,4 milhões | 73,4 |
| família rica | 13% | 70,4 | R$ 4,9 milhões | 73,9 |
| família muito rica | 13% | 70,2 | R$ 24 milhões | 74,2 |
| família bilionária | 3% | 72,6 | R$ 4 bilhões | 76,4 |

## Repetição

- **Dentro de uma vida:** 8,4% das aparições repetem uma instância já vista na mesma vida; pior vida: 33,8%.
- **Texto repetido entre vidas:** 25,5% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,2 · `aposentadoria` 1,5 · `irmao_nasce` 0,5 · `avo_mesada_escondida#avo` 0,4 · `namoro_esfriou#amor` 0,3 · `demissao` 0,3

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 159 de 340 (47%) · típico 158 de 340 (46%) · rico 172 de 340 (51%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `ex_liga_de_madrugada`, `ex_nas_redes`, `ex_cobra`, `mais_um_filho`, `irmao_mais_velho_defende`, `cobranca_da_magoa`, `chefe_hora_extra`, `chefe_magoado_cobra`, `colega_rouba_ideia`, `romance_no_trabalho`, `colega_de_licenca`, `o_caso_vem_a_tona`, `devedor_some`, `cobranca_do_filho`, `planilha_das_dividas`, `casamento_dos_outros`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `contaram_do_caso`, `a_divida_escondida`, `a_divida_vem_a_tona`, `a_festa_escondida`, `a_foto_da_festa`, `contaram_do_esquema`, `a_auditoria`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `o_recall`, `a_licitacao`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `pressao_carreira`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `segunda_chance`, `irmao_separou`, `fazer_as_pazes`, `chefe_elogia`, `chefe_magoado_cobra`, `cobrar_divida`, `devedor_some`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `desfile_de_sete_de_setembro`, `edital_da_ciencia`, `contaram_do_caso`, `chantagem_do_caso`, `confessar_o_caso`, `a_divida_vem_a_tona`, `contaram_da_divida`, `confessar_a_divida`, `treinar_no_clube`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `transito_de_sp`, `despejo`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `fila_do_emprego`, `ex_aluno`, `proposta_remota`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `filial_fechando`, `turno_extra_na_fabrica`, `layoff_por_email`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `comprar_a_estatal`, `salvar_o_pais`, `colonia_em_marte`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `os_bancos_pagam`, `chegada_em_marte`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `apagao`, `dono_do_brasil`, `receita_no_seu_pe`, `segundo_foguete`, `memorial_da_missao`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `oferta_pela_subsidiaria`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `celular_dos_pais`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `sucessao_na_empresa`, `conselho_quer_ceo`, `caixa_sobrando`, `greve_do_piso`, `o_recall`, `imposto_do_ano`, `receita_recorde`, `a_licitacao`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `o_preco_remarcado`, `a_impressora_ligada`, `o_credito_sumiu`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `final_da_copa`, `livro_viralizou`, `cliente_perdeu_tudo`, `noite_de_corridas`, `fa_obcecado`, `concorrente_quebrou`, `a_parcela_do_banco`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `fim_de_semana_no_sitio`, `feriado_na_praia`, `safra_ou_geada`, `ilha_particular`, `carro_de_luxo_na_rua`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `dono_do_clube`, `ameaca_de_sancao`, `importado_invadiu`, `juros_altos_na_fatura`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Apresentados por vida:** 61,5 · **com causa anterior (cadeia):** 79,3 · **maior distância causa→consequência:** 47,9 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,4% |
| `namoro` | evento | 99,0% |
| `luto` | npc | 96,1% |
| `enem` | evento | 89,1% |
| `primeiro_voto` | evento | 75,3% |
| `trabalho_grande` | acao | 74,2% |
| `programa_junto` | acao | 69,7% |
| `casamento_do_irmao` | evento | 67,6% |
| `aposentadoria` | evento | 65,2% |
| `curso_online` | acao | 65,0% |
| `bico_adulto` | acao | 63,7% |
| `correr_no_quintal` | acao | 60,7% |
| `formatura` | evento | 60,6% |
| `ler_gibi` | acao | 57,8% |
| `parquinho` | acao | 57,6% |
| `almoco_domingo` | acao | 54,4% |
| `cuidar_da_doenca` | npc | 53,6% |
| `irmao_nasce` | evento | 53,0% |
| `conversar_de_verdade` | acao | 52,7% |
| `tocar_empresa` | acao | 52,4% |
| `saudade_de_voce` | npc | 51,9% |
| `padrinho_do_sobrinho` | evento | 51,6% |
| `eleicao_geral` | evento | 49,8% |
| `estudar_concurso` | acao | 48,8% |
| `mochilao` | acao | 48,8% |
| `avo_mesada_escondida` | npc | 48,8% |
| `visitar_familia` | acao | 48,4% |
| `presente_certo` | acao | 47,5% |
| `pedir_conselho` | acao | 47,2% |
| `ligar_amigo` | acao | 46,8% |
| `dizer_umas_verdades` | acao | 46,7% |
| `oferecer_ajuda` | acao | 45,6% |
| `pos_graduacao` | acao | 44,5% |
| `demissao` | evento | 44,3% |
| `primeiro_emprego` | evento | 42,1% |
| `doente_crianca` | npc | 41,5% |
| `pedir_um_pix` | acao | 40,8% |
| `academia` | acao | 40,5% |
| `reclama_que_voce_sumiu` | npc | 39,5% |
| `caminhada` | acao | 39,4% |
| `filho_adolescente` | evento | 39,4% |
| `esperou_por_voce` | npc | 38,9% |
| `pedir_emprestado` | acao | 38,8% |
| `vontade_ver_o_mar` | npc | 38,8% |
| `baile_terceira_idade` | acao | 38,6% |
| `briga_com_o_irmao` | evento | 38,3% |
| `estudar_faculdade` | acao | 38,2% |
| `viagem_la_para_fora` | evento | 38,1% |
| `ler_livros` | acao | 36,8% |
| `estudar_escola` | acao | 36,7% |
| `hidro_com_a_turma` | acao | 36,0% |
| `guardar_dinheiro` | acao | 35,8% |
| `ouvir_historia` | acao | 35,8% |
| `namoro_esfriou` | evento | 35,7% |
| `correr` | acao | 34,2% |
| `paquerar` | acao | 34,2% |
| `estudar_enem` | acao | 34,0% |
| `rabiscar_parede` | acao | 33,2% |
| `perdeu_emprego_na_crise` | npc | 33,1% |
| `primeiro_investimento` | evento | 32,6% |
| `filho_formatura` | evento | 32,4% |
| `perguntar_porque` | acao | 31,9% |
| `videogame_do_amigo` | acao | 31,0% |
| `check_up` | acao | 30,9% |
| `balde_da_pracinha` | evento | 30,8% |
| `vontade_de_um_bicho` | npc | 30,5% |
| `creche_ou_vo` | evento | 30,3% |
| `falando_bem_de_voce` | npc | 30,3% |
| `cupido_do_irmao` | acao | 30,2% |
| `bullying_recreio` | evento | 30,0% |
| `estudar_tabuada` | acao | 29,4% |
| `amigo_em_apuros` | npc | 29,2% |
| `pedir_desculpas` | acao | 28,9% |
| `natacao_no_clube` | acao | 28,5% |
| `pre_escola` | evento | 28,2% |
| `ajudar_em_casa` | acao | 28,1% |
| `cuidar_de_doente` | acao | 27,8% |
| `bilhete_carinhoso` | npc | 27,4% |
| `copa_do_mundo` | evento | 26,9% |
| `primeiro_beijo` | evento | 26,9% |
| `acidente_em_casa` | evento | 26,8% |
| `vontade_viagem_com_amigo` | npc | 26,7% |
| `piada_no_grupo` | npc | 26,2% |
| `viagem_dos_sonhos` | evento | 25,9% |
| `festa_80` | evento | 25,9% |
| `socorro_com_as_criancas` | acao | 25,4% |
| `visitar_o_tumulo` | acao | 24,8% |
| `perdeu_aniversario` | npc | 24,5% |
| `colesterol_alto` | evento | 24,5% |
| `show_no_estadio` | acao | 24,3% |
| `salario_em_dolar` | evento | 24,2% |
| `pelada` | acao | 24,1% |
| `vontade_voltar_a_terra` | npc | 24,1% |
| `tentar_um_filho` | acao | 24,0% |
| `banda_garagem` | evento | 23,9% |
| `cachorro_caramelo` | evento | 23,7% |
| `cortar_gastos` | acao | 23,6% |
| `historias_ou_telas` | evento | 23,4% |
| `curso_nota_alta` | evento | 23,1% |
| `primeiro_celular` | evento | 22,8% |
| `investir_tesouro` | acao | 22,4% |
| `vacina_no_posto` | evento | 22,2% |
| `amor_quer_casar` | npc | 22,2% |
| `amigo_pede_dinheiro` | evento | 22,1% |
| `bico_adolescente` | acao | 22,1% |
| `a_festa_escondida` | evento | 21,6% |
| `avo_conta_historias` | npc | 21,5% |
| `golpe_pix` | evento | 21,4% |
| `vape_festa` | evento | 21,4% |
| `cursinho_pago` | acao | 21,3% |
| `viagem_realizada` | evento | 21,2% |
| `festa_junina` | evento | 20,9% |
| `hora_extra` | acao | 20,9% |
| `carro` | evento | 20,9% |
| `rebalancear` | acao | 20,8% |
| `o_bebe_chegou` | evento | 20,7% |
| `oportunidade_de_negocio` | evento | 20,6% |
| `esporte_depois_da_aula` | evento | 20,5% |
| `doar_sangue` | evento | 20,5% |
| `investimento_furado` | evento | 20,3% |
| `casamento` | npc | 20,2% |
| `cozinhar_com_a_avo` | acao | 20,1% |
| `bet` | evento | 19,8% |
| `futebol_de_varzea` | acao | 19,7% |
| `festa_tema` | evento | 19,5% |
| `pelada_de_quinta` | evento | 19,3% |
| `emprego_saude` | evento | 19,2% |
| `filho` | npc | 19,2% |
| `largar_tudo` | evento | 19,0% |
| `festa_da_cidade` | acao | 18,8% |
| `crise_la_fora` | evento | 18,7% |
| `criptomoeda` | evento | 18,6% |
| `previdencia` | acao | 18,2% |
| `primeira_palavra` | evento | 18,2% |
| `tempo_com_amor` | acao | 18,0% |
| `mesada` | evento | 17,7% |
| `casa_dos_pais` | evento | 17,6% |
| `pisa_em_ovos` | npc | 17,6% |
| `feira_ciencias` | evento | 17,5% |
| `viajar_com_o_amigo` | acao | 17,5% |
| `reforma_da_casa` | evento | 17,4% |
| `encontro` | acao | 17,3% |
| `pai_ausente_volta` | npc | 17,2% |
| `data_da_partida` | evento | 17,2% |
| `vaquinha_do_vizinho` | evento | 17,1% |
| `vender_doce` | acao | 17,0% |
| `curso_nota_media` | evento | 17,0% |
| `tatuagem` | evento | 17,0% |
| `o_esquema_do_colega` | evento | 16,8% |
| `ceia_de_natal` | evento | 16,7% |
| `hobby_horta` | evento | 16,7% |
| `reencontro_da_turma` | evento | 16,6% |
| `proposta_na_expansao` | evento | 16,5% |
| `bolao_do_trabalho` | evento | 16,2% |
| `desempregado` | evento | 16,1% |
| `pensar_em_adotar` | evento | 15,9% |
| `entregas` | acao | 15,7% |
| `sair_de_casa` | evento | 15,7% |
| `vizinho_barulhento` | evento | 15,6% |
| `orgulho_da_formatura` | npc | 15,4% |
| `voltar_a_estudar` | acao | 15,4% |
| `tempo_com_filho` | acao | 15,4% |
| `mais_um_filho` | npc | 15,3% |
| `ingles_crianca` | acao | 15,0% |
| `juros_compostos` | evento | 15,0% |
| `catapora` | evento | 15,0% |
| `irmao_mora_longe` | evento | 15,0% |
| `pede_um_favor_a_voce` | npc | 14,8% |
| `pede_ajuda` | npc | 14,8% |
| `heranca_do_tio` | evento | 14,8% |
| `subir_de_padrao` | evento | 14,8% |
| `franquia` | evento | 14,6% |
| `assalto_na_rua` | evento | 14,5% |
| `primeiro_cupom` | evento | 14,0% |
| `faculdade_a_noite` | acao | 13,9% |
| `ceu_de_fumaca` | evento | 13,7% |
| `bateu_o_carro` | evento | 13,7% |
| `festa_sem_pais` | evento | 13,6% |
| `vontade_ver_o_neto` | npc | 13,3% |
| `moeda_digital` | evento | 13,3% |
| `empresa_quebrou` | evento | 13,3% |
| `fome_no_fim_do_mes` | evento | 13,2% |
| `fazenda_a_venda` | evento | 12,9% |
| `festa_de_sao_joao` | evento | 12,8% |
| `leu_antes_dos_colegas` | evento | 12,8% |
| `plano_de_negocios` | evento | 12,8% |
| `bloco_de_carnaval` | evento | 12,8% |
| `mudar_para_a_praia` | evento | 12,8% |
| `sabado_com_os_sobrinhos` | evento | 12,7% |
| `hidroginastica` | evento | 12,7% |
| `casa_propria` | evento | 12,6% |
| `reencontro_amigo` | evento | 12,4% |
| `amigo_devolve` | npc | 12,3% |
| `baile_da_terceira_idade` | evento | 12,3% |
| `cirurgia_de_catarata` | evento | 12,2% |
| `fila_de_pedidos` | evento | 12,2% |
| `carteira_da_diarista` | evento | 12,2% |
| `a_vacina_no_posto` | evento | 12,1% |
| `cripto_fomo` | evento | 12,1% |
| `filho_desenho` | npc | 12,0% |
| `pais_envelhece` | evento | 11,9% |
| `corte_de_salario` | evento | 11,8% |
| `pedido_de_casamento` | acao | 11,6% |
| `balcao_negocio` | acao | 11,5% |
| `aula_de_musica` | evento | 11,5% |
| `surpresa_do_amor` | npc | 11,4% |
| `levar_ao_mar` | acao | 11,4% |
| `entregador_chuva` | evento | 11,3% |
| `idh_muito_alto` | evento | 11,3% |
| `imovel_valorizou` | evento | 11,3% |
| `imposto_alto_no_contracheque` | evento | 11,2% |
| `promocao` | evento | 11,1% |
| `convite_para_palestrar` | evento | 11,1% |
| `escrever_memorias` | evento | 11,0% |
| `irmao_mais_velho_defende` | evento | 10,9% |
| `cofrinho` | acao | 10,9% |
| `reuniao_de_condominio` | evento | 10,9% |
| `peneira` | evento | 10,9% |
| `brigas_de_madrugada` | evento | 10,8% |
| `alavancagem` | evento | 10,8% |
| `golpe_do_falso_neto` | evento | 10,8% |
| `alugueis_dos_fundos` | evento | 10,7% |
| `esporte_escola` | acao | 10,7% |
| `convite_do_luxo` | evento | 10,7% |
| `investimento_rotina` | evento | 10,6% |
| `negocio_no_aperto` | evento | 10,5% |
| `sovina_ou_sabio` | evento | 10,4% |
| `casa_cheia` | evento | 10,4% |
| `vaga_sobrando` | evento | 10,4% |
| `voltar_estudar` | evento | 10,3% |
| `imposto_baixo_sobrou` | evento | 10,3% |
| `maratona` | evento | 10,3% |
| `juros_baixos_euforia` | evento | 10,2% |
| `role` | acao | 10,2% |
| `aniversario_da_infancia` | evento | 10,2% |
| `separacao` | evento | 10,2% |
| `brincar_com_irmao_avo` | acao | 10,2% |
| `recomecar_amor` | acao | 10,2% |
| `separacao_dos_pais` | evento | 10,1% |
| `feira_de_ciencias` | evento | 10,1% |
| `dolar_barato` | evento | 10,1% |
| `parar_de_fumar` | acao | 10,1% |
| `multa_e_batida` | evento | 10,0% |
| `praia` | acao | 9,8% |
| `quarto_dividido` | evento | 9,7% |
| `produto_viralizou` | evento | 9,6% |
| `casa_na_praia` | evento | 9,6% |
| `rua_tranquila` | evento | 9,6% |
| `testamento` | evento | 9,5% |
| `bolsa_la_fora` | evento | 9,4% |
| `comer_tudo` | acao | 9,3% |
| `bolsa_de_estudos` | evento | 9,3% |
| `consorcio` | evento | 9,2% |
| `filho_imitacao` | npc | 9,2% |
| `a_foto_da_festa` | evento | 9,2% |
| `compra_por_impulso` | evento | 9,2% |
| `greve_dos_onibus` | evento | 9,2% |
| `colo_da_avo` | acao | 9,2% |
| `brincar_com_o_pai` | acao | 9,2% |
| `brincar_na_rua` | acao | 9,0% |
| `remorso_aperta` | evento | 8,9% |
| `pobreza_na_porta` | evento | 8,9% |
| `chimarrao` | acao | 8,8% |
| `peito_chiando` | evento | 8,8% |
| `gerente_do_banco` | evento | 8,7% |
| `apartamento_na_planta` | evento | 8,6% |
| `casamento_na_igreja` | npc | 8,6% |
| `seca_no_sertao` | evento | 8,6% |
| `pib_recorde` | evento | 8,6% |
| `irmao_doente` | evento | 8,5% |
| `assalto_no_onibus` | evento | 8,5% |
| `amor_piada_interna` | npc | 8,5% |
| `sao_joao` | acao | 8,5% |
| `ciumes_do_irmao` | evento | 8,4% |
| `retiro_da_igreja` | evento | 8,4% |
| `brincar_amigos` | acao | 8,4% |
| `concorrente_gigante` | evento | 8,3% |
| `padrao_de_vida` | evento | 8,2% |
| `mudanca_de_escola` | evento | 8,2% |
| `bolsa_subiu_sem_voce` | evento | 8,2% |
| `cartao_credito` | evento | 8,1% |
| `investidor_anjo` | evento | 8,1% |
| `cheia_do_rio` | evento | 8,1% |
| `socio_sumiu` | evento | 8,1% |
| `passear_de_carrinho` | acao | 8,0% |
| `chefe_novo` | evento | 8,0% |
| `ressaca_do_mar` | evento | 7,9% |
| `chefe_hora_extra` | npc | 7,9% |
| `queda` | evento | 7,8% |
| `conteudo_extra` | acao | 7,8% |
| `fugir_inflacao` | acao | 7,8% |
| `aposentadoria_ativa` | evento | 7,7% |
| `pular_corda` | acao | 7,6% |
| `dente_de_leite` | evento | 7,5% |
| `olimpiada_matematica` | evento | 7,5% |
| `vontade_casa_propria` | npc | 7,5% |
| `retirada_demais` | evento | 7,5% |
| `amor_proposta_fora` | npc | 7,4% |
| `briga_em_casa` | npc | 7,4% |
| `atendimento_robo` | evento | 7,4% |
| `netos` | evento | 7,3% |
| `boi_bumba` | acao | 7,3% |
| `juros_altos_rendendo` | evento | 7,3% |
| `ciume_do_bebe_novo` | evento | 7,3% |
| `festival_do_boi` | evento | 7,2% |
| `figurinha_repetida` | acao | 7,2% |
| `inquilino_dos_sonhos` | evento | 7,2% |
| `voce_mudou` | npc | 7,2% |
| `desigualdade_no_jornal` | evento | 7,1% |
| `apartamento_decorado` | evento | 7,1% |
| `pede_emprestado_a_voce` | npc | 7,1% |
| `levar_a_terra_natal` | acao | 7,1% |
| `dolar_disparou` | evento | 7,1% |
| `pousada_na_praia` | evento | 7,0% |
| `edital_de_cultura` | evento | 7,0% |
| `fundo_da_familia` | npc | 6,9% |
| `festa_surpresa` | evento | 6,9% |
| `soltar_pipa` | acao | 6,9% |
| `ponto_comercial` | evento | 6,9% |
| `crise_40` | evento | 6,9% |
| `filho_nao_veio` | npc | 6,8% |
| `titulo_eleitor` | evento | 6,8% |
| `estatua` | jogada | 6,8% |
| `ouvido_para_musica` | evento | 6,8% |
| `apagao_no_morro` | evento | 6,8% |
| `inquilino_sumiu` | evento | 6,7% |
| `blitz_toda_noite` | evento | 6,7% |
| `chefe_injusto` | evento | 6,7% |
| `geladeira_vazia` | evento | 6,6% |
| `noite_de_stand_up` | evento | 6,5% |
| `cidadania_italiana` | evento | 6,5% |
| `contas_do_milhao` | evento | 6,4% |
| `cripto_disparou` | evento | 6,3% |
| `geada_no_sul` | evento | 6,3% |
| `desemprego_em_alta` | evento | 6,3% |
| `enchente_na_rua` | evento | 6,2% |
| `faculdade_vida` | evento | 6,1% |
| `pressao_alta` | evento | 6,1% |
| `mei_negocio` | evento | 6,0% |
| `auxilio_na_conta` | evento | 5,9% |
| `primeiro_container` | evento | 5,9% |
| `nao_acredita_mais` | npc | 5,7% |
| `grupo_de_jovens` | evento | 5,7% |
| `festa_de_15` | evento | 5,7% |
| `tocar_no_bar` | acao | 5,7% |
| `adocao_chegou` | evento | 5,6% |
| `pescaria_no_pantanal` | evento | 5,6% |
| `luto_do_bicho` | npc | 5,5% |
| `academia_de_janeiro` | evento | 5,5% |
| `socio_da_patente` | evento | 5,5% |
| `herdeiro_gastao` | evento | 5,5% |
| `vender_doce_nato` | acao | 5,4% |
| `fiscalizacao` | evento | 5,4% |
| `propina_da_empreiteira` | evento | 5,4% |
| `romance_no_trabalho` | evento | 5,3% |
| `chaves_do_apartamento` | evento | 5,3% |
| `briga_dos_pais` | evento | 5,3% |
| `mutirao_de_cirurgias` | evento | 5,3% |
| `a_aposta_escondida` | evento | 5,2% |
| `idh_em_queda` | evento | 5,2% |
| `merenda` | evento | 5,1% |
| `filho_cuida` | npc | 5,1% |
| `escola_publica_boa` | evento | 5,0% |
| `assembleia_do_predio` | evento | 5,0% |
| `paquerar_timido` | acao | 4,9% |
| `a_engenheira_saiu` | evento | 4,9% |
| `festa_do_seculo` | jogada | 4,9% |
| `plantao_lotado` | evento | 4,9% |
| `vo_receita` | evento | 4,9% |
| `crise_de_ansiedade` | evento | 4,9% |
| `bico_na_expansao` | evento | 4,8% |
| `estatua_pichada` | evento | 4,8% |
| `escolheu_bem` | npc | 4,8% |
| `concurso_lotado` | evento | 4,8% |
| `vo_partiu` | npc | 4,8% |
| `greve_do_servidor` | evento | 4,8% |
| `ninguem_conhece` | evento | 4,8% |
| `family_office` | evento | 4,8% |
| `nome_sujo` | evento | 4,7% |
| `colega_rouba_ideia` | npc | 4,7% |
| `vicio_aposta` | evento | 4,7% |
| `cripto_de_novo` | acao | 4,6% |
| `asma_na_educacao_fisica` | evento | 4,6% |
| `casamento_do_filho` | evento | 4,6% |
| `comecar_terapia` | evento | 4,5% |
| `festa_vazou` | evento | 4,5% |
| `filho_saude_fragil` | npc | 4,5% |
| `escola_de_samba` | jogada | 4,5% |
| `la_fora_comprando` | evento | 4,5% |
| `namorar_depois_dos_60` | evento | 4,4% |
| `doenca_de_quem_ama` | evento | 4,4% |
| `moto_na_chuva` | evento | 4,4% |
| `curso_nota_baixa` | evento | 4,4% |
| `festival_lotado` | evento | 4,4% |
| `operacao_policial` | evento | 4,4% |
| `votacao_polemica` | evento | 4,4% |
| `emprestimo_ao_irmao` | evento | 4,3% |
| `o_irmao_viu` | npc | 4,3% |
| `obra_grande_no_norte` | evento | 4,3% |
| `colega_de_licenca` | evento | 4,3% |
| `tarifa_do_app` | evento | 4,2% |
| `mensalidade_da_escola` | npc | 4,2% |
| `conselho_que_diz_nao` | jogada | 4,1% |
| `briga_na_cozinha` | evento | 4,1% |
| `blindar_contas` | acao | 4,1% |
| `proposta_de_compra` | evento | 4,1% |
| `burnout_empresa` | evento | 4,1% |
| `pais_separados_natal` | evento | 4,0% |
| `aprovado_concurso_estudo` | evento | 4,0% |
| `ex_nas_redes` | evento | 4,0% |
| `pais_na_crise` | npc | 3,9% |
| `show_no_bar` | evento | 3,9% |
| `olimpiada` | acao | 3,9% |
| `trabalho_do_pai` | acao | 3,9% |
| `a_divida_escondida` | evento | 3,9% |
| `colega_happy_hour` | npc | 3,9% |
| `processo_trabalhista` | evento | 3,9% |
| `cachoeira` | acao | 3,8% |
| `intercambio_pago` | evento | 3,8% |
| `heranca` | evento | 3,8% |
| `viralizou` | evento | 3,8% |
| `cobranca_de_notas` | npc | 3,8% |
| `pescaria_no_rio` | evento | 3,8% |
| `marca_em_alta` | evento | 3,8% |
| `excursao_ao_mar` | acao | 3,7% |
| `mae_quer_morar_junto` | npc | 3,7% |
| `natal_com_politica` | evento | 3,7% |
| `promessa_da_mae` | evento | 3,7% |
| `satelite_na_tv` | evento | 3,6% |
| `um_bicho_para_o_filho` | acao | 3,6% |
| `ex_reencontro` | evento | 3,6% |
| `mutirao_da_laje` | evento | 3,6% |
| `netos_nas_ferias` | evento | 3,5% |
| `inflacao_no_mercado` | evento | 3,5% |
| `bolsa_derreteu` | evento | 3,5% |
| `o_que_pensa_de_voce` | npc | 3,5% |
| `confessar_o_esquema` | acao | 3,5% |
| `agro_na_cidade` | evento | 3,5% |
| `amigo_muda_de_cidade` | npc | 3,5% |
| `tentacao_no_trabalho` | evento | 3,4% |
| `piramide_no_grupo` | npc | 3,4% |
| `clinica_particular_contrata` | evento | 3,4% |
| `convite_do_partido` | evento | 3,3% |
| `contaram_do_esquema` | evento | 3,3% |
| `cripto_derreteu` | evento | 3,3% |
| `funcionario_genial` | evento | 3,3% |
| `posto_que_funciona` | evento | 3,3% |
| `filho_passou_longe` | npc | 3,3% |
| `qualidade_premiada` | evento | 3,3% |
| `concorrente_de_fora` | evento | 3,2% |
| `sociedade_amigo` | evento | 3,2% |
| `greve_dos_professores` | evento | 3,2% |
| `filho_primeiro_salario` | npc | 3,1% |
| `cuidar_netos` | acao | 3,1% |
| `crescer_devagar` | evento | 3,1% |
| `prova_concurso` | evento | 3,1% |
| `tosse_cronica` | evento | 3,1% |
| `ajudar_na_roca` | acao | 3,1% |
| `confeitaria_da_vo` | evento | 3,1% |
| `bater_o_pe_com_o_chefe` | evento | 3,0% |
| `joelho_da_pelada` | evento | 3,0% |
| `terapia` | acao | 3,0% |
| `depois_do_cargo` | evento | 2,9% |
| `olimpiada_do_instituto` | evento | 2,9% |
| `fundacao_com_seu_nome` | evento | 2,9% |
| `balcao_de_crianca` | evento | 2,9% |
| `imposto_sobre_fortunas` | evento | 2,9% |
| `balcao_da_familia` | evento | 2,9% |
| `amigo_pede_de_novo` | npc | 2,9% |
| `reajuste_dos_servidores` | evento | 2,9% |
| `vender_picole` | acao | 2,8% |
| `fila_do_posto` | evento | 2,8% |
| `vereador` | evento | 2,8% |
| `ex_namora_amigo` | evento | 2,8% |
| `ano_no_prejuizo` | evento | 2,8% |
| `chantagem_do_esquema` | npc | 2,8% |
| `governo_que_voce_elegeu_frente_popular` | evento | 2,8% |
| `setor_aquecido` | evento | 2,8% |
| `filho_quer_carro` | evento | 2,7% |
| `acordo_abriu_mercado` | evento | 2,7% |
| `convite_igreja` | npc | 2,7% |
| `colega_cobre_voce` | npc | 2,7% |
| `cursinho_comunitario` | evento | 2,7% |
| `irmao_desempregado` | npc | 2,7% |
| `cobra_voce` | npc | 2,6% |
| `convite_para_candidatura` | evento | 2,6% |
| `alguem_especial` | evento | 2,6% |
| `primeiro_funcionario` | evento | 2,6% |
| `aposentadoria_nao_da` | npc | 2,5% |
| `compativel_para_medula` | evento | 2,5% |
| `vaga_na_capital` | evento | 2,5% |
| `clientes_sumiram` | evento | 2,5% |
| `bancar_quem_sai` | jogada | 2,5% |
| `tentar_outra_cidade` | evento | 2,5% |
| `festa_surpresa_para` | npc | 2,5% |
| `saudade_de_la` | evento | 2,5% |
| `importado_ficou_caro` | evento | 2,4% |
| `assumir_negocio` | evento | 2,4% |
| `so_aparece_por_dinheiro` | npc | 2,4% |
| `fiador` | npc | 2,4% |
| `este_e_o_ano` | evento | 2,3% |
| `emprego_tecnologia` | evento | 2,3% |
| `joias_no_cofre` | evento | 2,3% |
| `fim_do_amor` | npc | 2,3% |
| `cobranca_do_casamento` | npc | 2,3% |
| `crianca_ansiosa` | evento | 2,2% |
| `programa_de_moradia` | evento | 2,2% |
| `proposta_sao_paulo` | evento | 2,2% |
| `conselho_de_fachada` | evento | 2,2% |
| `crise_no_setor` | evento | 2,2% |
| `apresentacao_para_a_diretoria` | evento | 2,2% |
| `birra_no_mercado` | evento | 2,1% |
| `voltar_com_o_ex` | npc | 2,1% |
| `ramo_em_crise` | evento | 2,1% |
| `plano_de_saude_subiu` | evento | 2,1% |
| `escola_integral` | evento | 2,1% |
| `dolar_virou_salario` | evento | 2,1% |
| `shows_cancelados` | evento | 2,1% |
| `surto_no_bairro` | evento | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `carregar_a_geladeira` | evento | 2,1% |
| `hospital_sem_insumo` | evento | 2,1% |
| `volta_terra` | evento | 2,0% |
| `seguranca_particular` | evento | 2,0% |
| `depois_da_venda` | evento | 2,0% |
| `amor_quer_mudar_de_carreira` | npc | 2,0% |
| `ex_casou` | npc | 1,9% |
| `ferias_do_dono` | evento | 1,9% |
| `faculdade_depois_dos_60` | npc | 1,9% |
| `amigo_sumiu_e_voltou` | npc | 1,9% |
| `mural_de_problemas` | jogada | 1,9% |
| `obra_do_predio` | evento | 1,9% |
| `expandir_na_alta` | evento | 1,9% |
| `irmaos_brigam` | evento | 1,8% |
| `filho_cuida_de_voce` | npc | 1,8% |
| `gorjeta_boa` | evento | 1,8% |
| `bodas_de_prata` | evento | 1,8% |
| `obra_ou_hospital` | evento | 1,8% |
| `formatura_tardia` | evento | 1,8% |
| `juros_altos` | evento | 1,8% |
| `cidadania_do_bisavo` | evento | 1,7% |
| `emprestimo_de_volta` | evento | 1,7% |
| `ainda_mora_com_pais` | evento | 1,7% |
| `reencontro_paixao` | evento | 1,6% |
| `imovel_na_baixa` | evento | 1,6% |
| `apuracao_do_carnaval` | evento | 1,6% |
| `duas_empresas_uma_agenda` | evento | 1,6% |
| `enchente_na_cidade` | evento | 1,6% |
| `passear_pet` | acao | 1,6% |
| `ocorrencia_perigosa` | evento | 1,6% |
| `cobranca_da_magoa` | npc | 1,6% |
| `a_conversa_que_faltava` | npc | 1,6% |
| `estrutura_parada` | evento | 1,6% |
| `carreira_futebol` | evento | 1,6% |
| `gravidez_surpresa` | npc | 1,6% |
| `ajudar_na_coleta` | evento | 1,6% |
| `briga_por_heranca` | evento | 1,6% |
| `arrojado_na_queda` | evento | 1,5% |
| `amor_paga_a_conta` | npc | 1,5% |
| `segundo_carro` | evento | 1,5% |
| `recaida_cigarro` | evento | 1,5% |
| `reforma_sem_fim` | evento | 1,5% |
| `cancelado` | evento | 1,5% |
| `black_friday` | evento | 1,5% |
| `equipe_para_desmontar` | jogada | 1,5% |
| `cupula_la_fora` | evento | 1,5% |
| `amigo_lembra_zoeira` | npc | 1,4% |
| `rodada_grande` | evento | 1,4% |
| `aposentado_quer_ajudar_na_empresa` | npc | 1,4% |
| `lesao_grave` | evento | 1,4% |
| `padrao_aperta` | evento | 1,4% |
| `carona_de_madrugada` | npc | 1,4% |
| `renegociar_divida` | evento | 1,4% |
| `ex_saudade_de_quem_foi` | evento | 1,4% |
| `sair_de_casa_cedo` | evento | 1,4% |
| `homenagem_no_trabalho` | evento | 1,3% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,3% |
| `embaixador_pede` | evento | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,3% |
| `pix_para_a_cidade` | jogada | 1,3% |
| `ferias_com_a_familia_do_amor` | npc | 1,3% |
| `foto_de_campanha` | evento | 1,3% |
| `ex_liga_de_madrugada` | npc | 1,3% |
| `preco_do_pao` | evento | 1,3% |
| `a_auditoria` | evento | 1,2% |
| `dizimo` | evento | 1,2% |
| `solucao_inesperada` | evento | 1,2% |
| `doar_em_vida` | evento | 1,2% |
| `presidir_cpi` | evento | 1,2% |
| `convite_para_o_palco_grande` | evento | 1,2% |
| `cara_de_comercial` | evento | 1,2% |
| `pane_no_voo` | evento | 1,2% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,2% |
| `o_conselho_vetou` | evento | 1,2% |
| `fronteira_fechada` | evento | 1,2% |
| `governo_que_voce_elegeu_centrao` | evento | 1,2% |
| `frete_sumiu` | evento | 1,1% |
| `ano_de_prejuizo` | evento | 1,1% |
| `familia_descobre_o_testamento` | evento | 1,1% |
| `oferece_ajuda` | npc | 1,1% |
| `visitar_de_longe` | acao | 1,1% |
| `time_a_venda` | evento | 1,1% |
| `sucessao_regime` | evento | 1,1% |
| `irmao_aposentou` | evento | 1,1% |
| `tornar_se_dispensavel` | jogada | 1,1% |
| `salario_parcelado` | evento | 1,1% |
| `tocar_o_negocio` | acao | 1,1% |
| `greve_da_federal` | evento | 1,1% |
| `aniversario_de_gemeos` | evento | 1,0% |
| `proposta_da_europa` | evento | 1,0% |
| `emprego_educacao` | evento | 1,0% |
| `nega_ajuda` | npc | 1,0% |
| `lembranca_primeiro_amor` | evento | 1,0% |
| `guerra_de_precos` | evento | 1,0% |
| `rompimento` | npc | 1,0% |
| `estatua_derrubada` | evento | 1,0% |
| `promocao_em_outra_cidade` | evento | 1,0% |
| `planilha_das_dividas` | evento | 1,0% |
| `chefe_amigo` | evento | 0,9% |
| `dez_anos_de_empresa` | evento | 0,9% |
| `proposta_em_dolar` | evento | 0,9% |
| `setor_afundou` | evento | 0,9% |
| `grade_na_janela` | evento | 0,9% |
| `bolsa_de_iniciacao` | evento | 0,9% |
| `bancar_presidente` | jogada | 0,9% |
| `o_ex_quer_um_cafe` | npc | 0,9% |
| `apartamento_de_presente` | evento | 0,9% |
| `acoes_da_startup` | evento | 0,9% |
| `hit_viral` | evento | 0,9% |
| `filho_parou_de_contar` | npc | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `paparazzi` | evento | 0,9% |
| `pai_namorando_de_novo` | npc | 0,9% |
| `vida_depois_da_condenacao` | evento | 0,9% |
| `jantar_esfriou` | npc | 0,9% |
| `vontade_festa_de_80` | npc | 0,8% |
| `holding_da_familia` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `ex_cobra` | npc | 0,8% |
| `happy_hour` | acao | 0,8% |
| `critico_no_salao` | evento | 0,8% |
| `casamento_dos_outros` | evento | 0,8% |
| `acampamento_na_porta` | evento | 0,8% |
| `mais_uma_mudanca` | evento | 0,8% |
| `obra_atrasada` | evento | 0,8% |
| `nao_para_quieto` | evento | 0,8% |
| `fundacao` | jogada | 0,8% |
| `exportacao_bate_recorde` | evento | 0,8% |
| `depois_do_calote` | evento | 0,8% |
| `vaga_na_empresa_dele` | npc | 0,7% |
| `safra_da_fazenda` | evento | 0,7% |
| `quartel_sem_verba` | evento | 0,7% |
| `favor_do_presidente` | evento | 0,7% |
| `amigo_ficou_rico` | npc | 0,7% |
| `papel_da_vida` | evento | 0,7% |
| `concorrente_nova` | evento | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `deploy_de_sexta` | evento | 0,7% |
| `ex_internado` | evento | 0,7% |
| `cobranca_do_filho` | npc | 0,7% |
| `o_caso_vem_a_tona` | evento | 0,7% |
| `calote_no_noticiario` | evento | 0,7% |
| `lista_dos_mais_ricos` | evento | 0,7% |
| `divida_publica_assusta` | evento | 0,7% |
| `amor_quadro_de_tarefas` | npc | 0,7% |
| `amor_desconfia` | npc | 0,7% |
| `cobranca_no_telefone` | evento | 0,7% |
| `mesa_cheia` | evento | 0,7% |
| `feirao_limpa_nome` | evento | 0,7% |
| `set_de_gravacao` | evento | 0,7% |
| `guerra_comercial` | evento | 0,7% |
| `filho_briga_na_escola` | npc | 0,6% |
| `mestrado_fora` | evento | 0,6% |
| `noite_da_apuracao` | evento | 0,6% |
| `protesto_na_avenida` | evento | 0,6% |
| `rebaixamento` | evento | 0,6% |
| `briga_de_casal` | npc | 0,6% |
| `renegociar_cartao` | acao | 0,6% |
| `intercambio` | evento | 0,6% |
| `sancao_parou_o_porto` | evento | 0,6% |
| `burnout` | evento | 0,6% |
| `pedreiro_vale_ouro` | evento | 0,6% |
| `vendas_recorde` | evento | 0,6% |
| `contrato_publicitario` | evento | 0,6% |
| `ajudar_com_a_casa` | acao | 0,6% |
| `o_laboratorio_apaga_a_luz` | evento | 0,6% |
| `robos_na_fabrica` | evento | 0,6% |
| `desabafar_o_caso` | acao | 0,5% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,5% |
| `infancia_no_palacio` | evento | 0,5% |
| `vaga_no_agro` | evento | 0,5% |
| `turne_nacional` | evento | 0,5% |
| `a_convocacao` | evento | 0,5% |
| `contaram_da_festa` | evento | 0,5% |
| `tradutor_da_familia` | evento | 0,5% |
| `segredo_de_familia` | npc | 0,5% |
| `peneira_do_sobrenome` | evento | 0,5% |
| `chefe_elogia` | npc | 0,5% |
| `o_mural_do_boton` | evento | 0,5% |
| `caixa_sobrando` | evento | 0,5% |
| `fim_de_semana_no_sitio` | evento | 0,5% |
| `despejo` | evento | 0,5% |
| `fila_do_emprego` | evento | 0,5% |
| `livro_viralizou` | evento | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,5% |
| `guerra_na_escola` | evento | 0,5% |
| `cavalo_campeao` | evento | 0,5% |
| `segunda_chance` | npc | 0,5% |
| `desfile_de_sete_de_setembro` | evento | 0,5% |
| `obra_parada` | evento | 0,5% |
| `filial_fechando` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `o_preco_remarcado` | evento | 0,4% |
| `ameaca_de_sancao` | evento | 0,4% |
| `a_parcela_do_banco` | evento | 0,4% |
| `treinar_no_clube` | acao | 0,4% |
| `layoff_por_email` | evento | 0,4% |
| `carro_de_luxo_na_rua` | evento | 0,4% |
| `racionamento` | evento | 0,4% |
| `confessar_o_caso` | acao | 0,4% |
| `startup_dos_ex_funcionarios` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `assinatura_real` | evento | 0,4% |
| `circo_vai_embora` | evento | 0,4% |
| `ministro_pede_ajuste` | evento | 0,4% |
| `queda_do_cargo` | evento | 0,4% |
| `padrinho_casamento` | npc | 0,4% |
| `a_licitacao` | evento | 0,4% |
| `juros_altos_na_fatura` | evento | 0,4% |
| `tomar_o_poder` | jogada | 0,4% |
| `pressao_carreira` | npc | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `o_bicho_herdeiro` | evento | 0,4% |
| `picadeiro` | evento | 0,4% |
| `cobrar_divida` | acao | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `final_da_copa` | evento | 0,4% |
| `feriado_na_praia` | evento | 0,4% |
| `fazer_as_pazes` | acao | 0,3% |
| `proposta_pelo_negocio` | evento | 0,3% |
| `montadora_vai_fechar` | evento | 0,3% |
| `filho_apresenta_namoro` | npc | 0,3% |
| `aluguel_caro` | evento | 0,3% |
| `emprego_negocios` | evento | 0,3% |
| `proposta_remota` | evento | 0,3% |
| `choque_de_culturas` | evento | 0,3% |
| `aluguel_com_nome_sujo` | evento | 0,3% |
| `a_impressora_ligada` | evento | 0,3% |
| `a_baba_foi_embora` | evento | 0,3% |
| `fabrica_de_municao` | evento | 0,3% |
| `edital_da_ciencia` | evento | 0,3% |
| `turno_extra_na_fabrica` | evento | 0,3% |
| `celular_dos_pais` | npc | 0,3% |
| `internato_real` | evento | 0,3% |
| `mordomias_reais` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `bonanca_no_governo` | evento | 0,3% |
| `a_conta_da_coroa` | evento | 0,3% |
| `confessar_a_divida` | acao | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `trazer_a_copa` | jogada | 0,3% |
| `paciente_famoso` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `decreto_da_economia` | evento | 0,3% |
| `as_criancas_perguntam` | npc | 0,3% |
| `transito_de_sp` | evento | 0,3% |
| `quebra_de_safra` | evento | 0,3% |
| `assumir_a_fazenda` | evento | 0,3% |
| `plantao_que_nao_acaba` | evento | 0,3% |
| `greve_geral` | evento | 0,3% |
| `concurso_em_brasilia` | evento | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `os_dois_lados` | evento | 0,3% |
| `noite_de_corridas` | evento | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `imposto_do_ano` | evento | 0,3% |
| `regra_sob_medida` | evento | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `jubileu` | evento | 0,3% |
| `fa_obcecado` | evento | 0,3% |
| `violencia_vira_manchete` | evento | 0,3% |
| `importado_invadiu` | evento | 0,2% |
| `oposicao_na_tv` | evento | 0,2% |
| `pais_envelhecem` | npc | 0,2% |
| `filho_hamburgueria` | npc | 0,2% |
| `receita_recorde` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `cura_de_doenca` | jogada | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `filho_adolescente_porta` | npc | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `irmao_separou` | npc | 0,2% |
| `aperto_do_mes` | evento | 0,2% |
| `resultado_da_pesquisa` | evento | 0,2% |
| `fusao_de_iguais` | evento | 0,2% |
| `pais_aposentados` | npc | 0,2% |
| `filho_convocado` | evento | 0,2% |
| `a_divida_vem_a_tona` | evento | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `cargo_no_gabinete` | evento | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `contaram_do_caso` | evento | 0,2% |
| `oferta_pela_subsidiaria` | evento | 0,2% |
| `o_recall` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `cliente_perdeu_tudo` | evento | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `chantagem_do_caso` | npc | 0,2% |
| `sequestro_frustrado` | evento | 0,2% |
| `caso_do_poderoso` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `parcela_da_tv` | npc | 0,2% |
| `bonus_do_banco` | evento | 0,2% |
| `carta_branca` | evento | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `filho_distante` | npc | 0,1% |
| `chefe_magoado_cobra` | npc | 0,1% |
| `zona_franca` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `ferias_coletivas` | evento | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `reconciliacao` | npc | 0,1% |
| `o_veterano` | evento | 0,1% |
| `leilao_da_obra` | evento | 0,1% |
| `negocio_em_crise` | evento | 0,1% |
| `royalties_secaram` | evento | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `conselho_quer_ceo` | evento | 0,1% |
| `paparazzi_real` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `concorrente_quebrou` | evento | 0,1% |
| `reencontro_amigo_brigado` | evento | 0,1% |
| `tentar_a_vida_na_europa` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `abrir_capital` | evento | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `grupo_na_capa` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `casamento_real` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `shopping_lotado` | evento | 0,1% |
| `amor_gastador` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `teste_por_indicacao` | evento | 0,1% |
| `mansao_vazia` | evento | 0,1% |
| `amor_saude_fragil` | npc | 0,1% |
| `devedor_some` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `ficar_no_poder` | jogada | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `lancamento` | evento | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `comprar_a_estatal` | jogada | 0,1% |
| `nova_tentativa_da_pesquisa` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `greve_do_piso` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,0% |
| `cobrir_a_tatuagem` | evento | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `desvio_na_fundacao` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `taxar_grandes_fortunas` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `o_credito_sumiu` | evento | 0,0% |
| `helicoptero_no_teto` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `a_empresa_anda_sozinha` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `restaurar_a_monarquia` | jogada | 0,0% |
| `caramelo_envelhece` | npc | 0,0% |
| `contaram_da_divida` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `conta_na_suica` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `cade_investiga` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 210 · **mudaram algo em pelo menos uma vida:** 211
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,7 · p10 54 · p25 61 · mediana 71 · p75 81 · p90 88

```
até 19                                        0,3%
20–29                                         0,4%
30–39          █                              0,6%
40–49          █████                          4,0%
50–59          ██████████████████             15,4%
60–69          ██████████████████████████████ 26,1%
70–79          ████████████████████████████   24,5%
80–89          ████████████████████████       20,9%
90–99          ████████                       7,0%
100+           █                              0,9%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 234 mil · p25 R$ 717 mil · mediana R$ 3,4 milhões · p75 R$ 28 milhões · p90 R$ 104 milhões

```
negativo                                      0,7%
até 10 mil                                    0,5%
10–50 mil      █                              1,3%
50–200 mil     ████                           6,3%
200 mil–1 mi   ███████████████                22,2%
1–5 mi         ████████████████               24,0%
5 mi+          ██████████████████████████████ 45,0%
```

**Felicidade média ao longo da vida** — p10 61 · mediana 75 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,9%
50–59          █████                          6,9%
60–69          ██████████████████             24,3%
70–79          ██████████████████████████████ 40,7%
80+            ████████████████████           27,3%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,9 | R$ 779 mil | 67,9 | 58,1 | 161,8 | 65,4 | 100% | 53% |
| cautelosa | 83,4 🏆 | R$ 42 milhões 🏆 | 76,2 | 68,4 | 195,2 | 70,5 | 100% | 58% |
| arriscada | 58,3 | R$ 3,8 milhões | 80,4 🏆 | 54,2 | 142,0 | 101,6 | 100% | 51% |
| aleatoria | 75,4 | R$ 1,4 milhão | 70,8 | 65,3 | 136,4 | 79,7 | 100% | 49% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,9% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,4% — de um AVC, numa terça-feira sem graça
- 11,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 7,6% — de pneumonia, depois de teimar que era só uma gripe
- 6,0% — numa cirurgia simples que não foi tão simples
- 5,8% — de complicações de uma queda no banheiro
- 5,5% — de velhice, dormindo, num domingo depois do almoço
- 5,2% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
