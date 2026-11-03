# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 664 eventos, 145 de personagens, 121 ações, 1945 escolhas, 239 linhas, 157 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 4097916 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4690852 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 32 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 422 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 9 mil |
| Custo de vida | o mercado | 99,8% | -R$ 621 mil |
| Padrão de vida | o mercado | 99,7% | -R$ 4,9 milhões |
| Bico | o mercado | 99,4% | R$ 45 mil |
| Salário | o mercado | 96,2% | R$ 2,5 milhões |
| Juro da renda fixa | o governo | 88,9% | R$ 154 mil |
| Cotação dos investimentos | os preços | 86,3% | R$ 1,1 milhão |
| Imposto | o governo | 84,6% | -R$ 60 mil |
| Imposto mais baixo | o governo | 82,4% | R$ 60 mil |
| Auxílio | o governo | 80,7% | R$ 17 mil |
| Juros da dívida | o banco | 79,1% | -R$ 2 mil |
| Compras e vendas | o mercado | 73,8% | -R$ 1,5 milhão |
| Manutenção dos bens | o mercado | 73,8% | -R$ 550 mil |
| Gastos da velhice | o mercado | 65,9% | -R$ 874 mil |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 5,5% | 5,0 | 5,6% | 3,0% | 0,0% | 3,5% |
| cautelosa | 0,0% | 1,8% | 0,0 | 1,8% | 0,0% | 0,0% | 0,0% |
| arriscada | 93,8% | 24,6% | 1,0 | 12,5% | 1,9% | 18,6% | 18,6% |
| aleatoria | 49,1% | 15,3% | 1,0 | 8,2% | 1,2% | 11,0% | 10,5% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 11,8% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,91 anos com acordo (636 vezes) × 3,07 sem (349 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 20,7% de 3573 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 1,5% das vidas; 13,0% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 38,9% | R$ 51 mil | 840 | 0 (0) | 0,6% | — |
| cautelosa | 98,8% | 5,1 | 54,3% | R$ 836 mil | 13197 | 28 (17) | 1,2% | R$ 185 mil (13 vidas) |
| arriscada | 0,0% | — | 16,4% | R$ 8,7 mil | 182 | 135 (70) | 2,0% | R$ 191 milhões (28 vidas) |
| aleatoria | 87,3% | 2,5 | 16,7% | R$ 21 mil | 3616 | 1652 (879) | 1,6% | R$ 10 mil (21 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 98,8%, arriscada 0,0%, aleatoria 87,3% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,4% (136 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 191 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2696 | R$ 3,9 milhões | 0,1 |
| parte dos impostos | 1177 | R$ 1,7 bilhão | 0,8 |
| taxa da coroa | 1879 | R$ 29 bilhões | 0,7 |

A ilha: 41 vidas fundaram ou herdaram uma. População no fim: p10 1654, mediana 2410, p90 2919.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 0,7 quedas por 100 anos com a taxa (1879 anos) × 0,1 com o salário (2696 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 41 ilhas; mediana de 2607 habitantes sem a taxa (21) e 1654 com 5 anos ou mais de taxa (9) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 169770 | -0,70 |
| regular | 345215 | -0,04 |
| prioridade | 190106 | +0,75 |

A tecnologia ao morrer: p10 42,4, mediana 49,8, p90 58,6. Descobertas por 100 vidas: a cura 17,3, o satélite 16,9, a patente 17,1; 28,5% das vidas veem uma. A fuga de cérebros: 25,9% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (169770 anos) · regular -0,04 por ano (345215 anos) · prioridade +0,75 por ano (190106 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,4 · mediana 49,8 · p90 58,6 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 28,5% das vidas; 89,4% de 5132 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 181956 | -0,83 |
| regular | 342773 | -0,01 |
| reforçada | 180362 | +0,84 |

A capacidade ao morrer: p10 43,2, mediana 49,7, p90 57,8. Encomendas por 100 vidas: 7,3 (673 entregas). Guerras por 100 vidas: 3,2, em 3,2% das vidas; acabaram em vitória 69, derrota 91 e cessar-fogo 145, com 2,8 anos em média. Pedidos de paz: 2; convocações: 74; 0,4% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,83 por ano (181956 anos) · regular -0,01 por ano (342773 anos) · reforçada +0,84 por ano (180362 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 3,2% das vidas; 93,1% de 320 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,6% de 5141 anos · forte: 2,8% de 4869 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ❌ | 0,56% em 2996 anos de guerra · 2,04% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ✅ | a mais longa: 8 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 405 em vida (100,0% com resposta) e 129 na herança (100,0%). De 138 herdeiros que começaram na fila, 76,8% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 39 | 46,2% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 1 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 47 | 57,4% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Mudar a Constituição para mais um mandato | 2 | 50,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Restaurar a monarquia no plebiscito | 69 | 43,5% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 1 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ✅ | em vida 100,0% de 405 · na herança 100,0% de 129 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 86 tentativas, 52,3% deram certo |

## A rede (missão Ω1)

As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (`docs/auditoria-omega.md`). Nas vidas sorteadas, cada vida tem em média 13,5 pessoas diferentes, 0,31 ex, 1,57 irmãos (0,86 nascidos depois de quem joga) e 4,81 pessoas do trabalho.

| Portão | Situação | Valor |
|---|---|---|
| A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão | ✅ | ex em 25,2% · irmão em 80,1% |
| As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe | ✅ | 4,7 entradas por vida, com 13,5 pessoas por vida |
| A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada) | ✅ | ex que voltou 83 · colega que virou amigo 31 · romance do trabalho 71 |

## Os verbos sociais (missão Ω2)

Quando a resposta é de uma pessoa, ela decide pelo estado e pela memória dela e diz por quê (`decisao.ts`); o empréstimo entre pessoas é uma promissória, com parcela, atraso, quitação e calote (`promissorias.ts`). Nas vidas sorteadas: 16,7 respostas por vida, sim em 39,7%, e 46,9% delas com o porquê apontando um ano anterior.

| Portão | Situação | Valor |
|---|---|---|
| A pessoa decide: ≥ 60% das vidas têm um pedido respondido por alguém, e o sim fica entre 30% e 80% das respostas | ✅ | 66,3% das vidas · 16,7 respostas por vida · sim em 39,7% |
| O porquê cita o passado: ≥ 25% das respostas dizem a lembrança que pesou ("…, aos 31") ou a dívida em aberto | ✅ | 46,9% das respostas |
| O empréstimo entre pessoas acontece e acaba dos dois jeitos: em ≥ 10% das vidas, e dos que acabam, ≥ 50% quitados e ≥ 3% em calote | ✅ | em 35,4% das vidas (12305 empréstimos: 11863 pegos, 442 feitos) · 9307 quitados, 1271 calotes, 3254 parcelas atrasadas |

## Os projetos (missão Ω3)

Quem joga declara o que quer da vida; as etapas são condições do estado, e o fim vai para o livro com o começo de causa (`projetos.ts`). Por projeto, começados / conquistados: sair_das_dividas 2026 / 1612 · casa_propria 4308 / 2469 · ter_um_filho 2565 / 2152 · negocio_proprio 7056 / 68 · reparar_relacao 323 / 83 · cuidar_da_saude 3409 / 60 · primeiro_milhao 3898 / 2771 · casar 1291 / 1103 · diploma 3787 / 876.

| Portão | Situação | Valor |
|---|---|---|
| Os planos existem: ≥ 40% das vidas começam um plano | ✅ | 74,6% das vidas · 2,87 planos por vida |
| Os planos acabam dos dois jeitos: dos que acabam, as conquistas ficam entre 20% e 80% | ✅ | 11194 conquistas, 12309 prazos vencidos, 3367 desistências, 79 sem tempo (conquista em 41,5%) |
| Todo plano acontece: cada um é começado e conquistado em alguma vida | ✅ | 9 de 9 |

## Os segredos (missão Ω4)

Quem joga esconde coisas de alguém; quem sabe pode contar pelos círculos (a família e o par, os amigos, os ex, o trabalho), e a notícia que chega ao alvo vira revelação, com quem contou e a causa (`segredos.ts`). Por tema, nascidos / contados ao alvo: caso 125 / 17 · divida 128 / 5 · festa 1298 / 40 · esquema 1049 / 262.

| Portão | Situação | Valor |
|---|---|---|
| Os segredos existem: ≥ 15% das vidas guardam um | ✅ | 24,1% das vidas · 0,26 por vida |
| A notícia corre: um boato (alguém que soube pela boca de outro) para cada 4 segredos ou mais | ✅ | 900 boatos para 2600 segredos · 324 chegaram a quem não devia · 272 chantagens |
| Os segredos acabam de todo jeito: contados, descobertos, confessados e calados, cada um em ≥ 5% dos que acabam | ✅ | contados 12,8% · descobertos 54,2% · confessados 15,5% · calados 17,5% (de 2392) |
| Todo segredo chega a quem não devia: cada tema nasce e é contado ao alvo em alguma vida | ✅ | 4 de 4 |

## Os capítulos (missão Ω5)

A peneira lê o livro de cada vida e reconhece os arcos com começo e fim, que a linha do tempo e o cartão mostram (`capitulos.ts`).

| Portão | Situação | Valor |
|---|---|---|
| A vida tem capítulos: ≥ 50% das vidas têm um arco reconhecido no livro | ✅ | 69,7% das vidas · 1,47 por vida · 19,7% com dois tipos ou mais |
| Todo tipo de capítulo acontece (o plano, o segredo, a volta, o calote, o favor e as pazes) | ✅ | plano 11273 · segredo 1974 · volta 78 · calote 1271 · favor 54 · pazes 16 |

## O caminho e o ritmo (missão Ω6)

A variedade das vidas medida pela estrutura causal (as causas dos pontos de virada e os capítulos, ao lado da assinatura do destino), os elos de causa distintos e o ritmo: depois de um ano pesado, as histórias leves ganham a vez (`diretor.ts › ritmoDoAno`).

| Portão | Situação | Valor |
|---|---|---|
| O caminho varia mais que o destino: as assinaturas do caminho (as causas dos pontos de virada e os capítulos) passam as do destino | ✅ | caminho 610 · destino 561 por 1.000 vidas · 45,7 elos causais por vida, 2687 distintos no túnel |
| A vida respira: depois de um ano pesado, o seguinte também é pesado em ≤ 10% das vezes | ✅ | 5,4% de 42950 anos pesados |

## O capitalismo com rosto (bloco H6)

A concorrente da empresa que quem joga cuida de perto tem nome e dono, e o gestor que chega com a empresa grande propõe a jogada do ano pelo jeito dele (diretoria.ts). Avisos do gestor que tinha razão: 19; gestores que foram para a concorrência: 0.

| Portão | Situação | Valor |
|---|---|---|
| A concorrência tem rosto: ≥ 60% de quem abre empresa conhece a rival pelo nome | ✅ | 100,0% |
| O rival que já era da vida (um ex, um amigo) existe: ≥ 1% de quem abre empresa | ✅ | 2,59% |
| O gestor chega em 15% a 40% das vidas com empresa | ✅ | 19,1% |
| Das propostas do gestor, as seguidas ficam entre 30% e 70% | ✅ | 51,6% de 1939 |
| Seguir o gestor não domina: o patrimônio mediano de quem mais seguiu fica abaixo de 1,5 vez o de quem mais recusou | ✅ | R$ 43 milhões contra R$ 41 milhões (193 e 177 vidas) |

## A bolsa de verdade (bloco H7)

A empresa na bolsa emite ações (o dinheiro vai para o caixa e a parte de quem joga encolhe), recompra a maioria e toma a concorrente numa oferta hostil, sem pedir ao dono; sem a maioria, alguém pode comprar o controle dela.

| Portão | Situação | Valor |
|---|---|---|
| A oferta hostil acontece: ≥ 0,1% das vidas tentam tomar a concorrente na bolsa | ✅ | 0,11% |
| A oferta hostil nem sempre passa: das ofertas, as que passam ficam entre 30% e 85% | ✅ | 60,9% de 23 |
| Quem perde a maioria na bolsa pode perder a empresa: a oferta contra quem joga acontece (≥ 0,05% das vidas) | ✅ | 0,23% das vidas · recomprou 0, vendeu 0, brigou 29 |
| Emitir ações acontece: ≥ 0,2% das vidas | ✅ | 0,43% (recompras: 0) |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 28 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,14 ms | 1,5% | 32,9 KB | — | guerra, pais, moeda, pesquisa, empresa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,59 ms | 0,4% | 0,0 KB | exterior | pais, moeda, pesquisa, empresa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 4,78 ms | 3,4% | 59,3 KB | exterior, guerra | moeda, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, poder, coroa, regras, iniciativas, diretor |
| moeda (o dinheiro: a inflação que vai para quem emitiu, o caixa do governo, o câmbio, o crédito dos bancos e a emissão do Banco Central) | 0,69 ms | 0,5% | 31,3 KB | guerra, pais | empresa, bens, tesouro, dividas, personagens, regras, iniciativas, diretor |
| setores (os mercados de cada setor: a obra que fica pronta, a procura do ano e o preço que decide a obra do ano que vem) | 2,37 ms | 1,7% | 92,1 KB | pais | iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,19 ms | 0,1% | 0,4 KB | guerra, pais | empresa, poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,64 ms | 0,5% | 18,5 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 2,02 ms | 1,4% | 28,7 KB | pais, mercado | empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: o negócio do ano (vendas, custos, imposto, caixa, dividendos, obra), os empregos da cidade e a quebra) | 1,82 ms | 1,3% | 19,0 KB | exterior, guerra, pais, moeda, setores, pesquisa, mercado, economia | bens, tesouro, dividas, promissorias, corpo, personagens, carreira, poder, coroa, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,34 ms | 0,9% | 14,9 KB | pais, moeda, mercado, economia, empresa | tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,36 ms | 0,3% | 2,6 KB | pais, moeda, economia, empresa, bens | dividas, promissorias, personagens, regras, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,44 ms | 0,3% | 0,3 KB | pais, moeda, economia, empresa, bens, tesouro | promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| promissorias (os empréstimos entre pessoas: a parcela, o atraso que magoa, a quitação e o calote) | 0,32 ms | 0,2% | 1,5 KB | pais, economia, empresa, bens, tesouro, dividas | personagens, segredos, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,04 ms | 0,0% | 0,0 KB | economia | corpo, personagens, projetos, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 1,89 ms | 1,3% | 21,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao | personagens, trabalho, carreira, poder, coroa, projetos, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 5,27 ms | 3,7% | 77,9 KB | exterior, guerra, pais, moeda, setores, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo | trabalho, carreira, poder, coroa, projetos, segredos, regras, morte, iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,23 ms | 0,2% | 1,5 KB | pais, setores, empresa, promissorias, personagens | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,45 ms | 0,3% | 1,7 KB | guerra, pais, pesquisa, empresa, bens, promissorias, corpo, personagens, trabalho | poder, coroa, morte, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 2,33 ms | 1,7% | 4,5 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,12 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, empresa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,04 ms | 0,0% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, promissorias, personagens | iniciativas, diretor |
| projetos (os projetos: a meta alcançada vira conquista, o prazo passado vira fracasso) | 0,38 ms | 0,3% | 0,9 KB | tudo o que veio antes | segredos, regras, morte, amor, iniciativas, diretor |
| segredos (os segredos: quem sabe pode contar, e a notícia que chega ao alvo agenda a revelação) | 2,41 ms | 1,7% | 0,1 KB | tudo o que veio antes | regras, morte, amor, iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 3,39 ms | 2,4% | 17,3 KB | pais, moeda, setores, bens, tesouro, dividas, privacao, corpo, personagens, projetos | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,72 ms | 0,5% | 0,4 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa, projetos | iniciativas, diretor |
| amor (o amor que aparece e o namoro que esfria) | 0,15 ms | 0,1% | 0,0 KB | promissorias, corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 24,63 ms | 17,5% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 17,21 ms | 12,2% | 1,7 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 64,10 ms | 45,5% | — | — | — |

O save de uma vida (amostra de 1040): mediana 507 KB, p90 614 KB, máximo 752 KB; o livro é 97,3% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 752 KB (mediana 507 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 141,04 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 56,6% | 29,5% | 12,3% | 1,5% | 0,1% |

Entre as vidas com filhos (43,4%), a média é de 1,36 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 13,9% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 15,6% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 52,3% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 901 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 9,21 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 477,1 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 11,7% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 11,9% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ❌ | 2,8% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,38 |
| Saturação V20 ≤ 95% | ✅ | 87,2% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 901 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 141,04 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,7% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 56,5% (168 dinastias, média de 3,1 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,89 (350 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 3,45% (p99 R$ 373 milhões, maior R$ 306 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,38% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 25,7% de 56,1% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 15,7% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 87,2% |
| Assinaturas sem regressão (≥ 918) | ❌ | 901 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 477,1 |
| CPU por vida ≤ 30 ms | ❌ | 141,04 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 95,5% (10,0 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 70,8% de 3792 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (688), A festa do século (569), Pix para a cidade inteira (357), Uma estátua sua (266), Um conselho que diz não (201), Bancar um presidente (169), Uma fundação com seu nome (163), Uma equipe para desmontar (147), Pagar a cura de uma doença (138), Trazer a Copa do Mundo (133), Um mural de problemas (123), Bancar quem quer sair (120), Tornar-se dispensável (113), Tomar o poder (112), Um programa espacial (109), Restaurar a monarquia (86), Fundar uma cidade (77), Comprar a estatal (76), Ficar no poder (55), Fundar um país (38), Salvar o país da crise (34), Uma colônia em Marte (18).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 4 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 39,1% de 1812 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 15,6% delegaram, 73,6% centralizaram (648 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 36,3% (34,3 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (757), Bancar quem quer sair (410), Uma equipe para desmontar (362), Um mural de problemas (331), Tornar-se dispensável (237).
- **Na morte de quem manda:** a empresa perde em média 27,6% do valor; dependência p10 / mediana / p90: 25 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 14 anos (7764 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 981 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 53,8% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 64,1% / 23,4% / 10,0% / 2,4% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,2 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,2%, o bloco liberal 24,2%, a aliança da ordem 24,8%, o centrão 24,8%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,7%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,54% × 1,85%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 85% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,28% contra 0,80% por ano (40333 e 52939 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ❌ | 1,38 votos por vida, 30,7% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 2,04 × 0,74 pontos do PIB por ano (152 e 173 governos); 97,2% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,0% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 199.309 | 1,8% | 8,2% | 4,9% | 82% | 21,0% | 20,5 | 58 | 55 | 50% |
| o centrão | 188.846 | 2,1% | 8,3% | 4,9% | 85% | 25,1% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 188.794 | 1,7% | 8,4% | 5,4% | 73% | 29,5% | 17,6 | 50 | 45 | 53% |
| o bloco liberal | 184.196 | 2,5% | 8,6% | 3,3% | 82% | 29,7% | 22,1 | 43 | 50 | 51% |
| quem joga | 13.115 | 1,9% | 8,5% | 7,0% | 68% | 25,4% | 18,6 | 51 | 49 | 50% |
| o regime | 5.686 | 1,4% | 9,1% | 10,3% | 12% | 31,6% | 17,0 | 37 | 37 | 43% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 14,6% de 6532 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,9% fundiram, 4,7% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 3 anos; nas vidas jogadas, o maior grupo teve 2857 (p99 380) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,42 ponto em média (28403 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,50 na bolsa (5470 empresas-ano) × -0,00 fechadas (121209) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,0% de 38380 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,19 · mediana R$ 5,16 · p90 R$ 6,42 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,0% × 3,7% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,39 no agro (3385 empresas-ano) × -0,34 no comércio (29688), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 35,0%, acordo em 75,2%; 95,4% das sanções acabam em até 15 anos (mediana 4, p90 10) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,7% de 5361 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,92% × 0,15% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,70% × 0,34% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 77,6% de 397 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 199.309 | 0,19% | 2,96% |
| o centrão | 188.846 | 0,17% | 0,57% |
| a aliança da ordem | 188.794 | 1,96% | 0,34% |
| o bloco liberal | 184.196 | 0,27% | 3,70% |
| quem joga | 13.115 | 1,93% | 3,80% |
| o regime | 5.686 | 3,89% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,530, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,798–0,866, Gini 0,483–0,562 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 8,1% · desigualdade_no_jornal 7,4% · idh_muito_alto 10,9% · idh_em_queda 5,3% · pais_envelhece 11,4% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,798 | 0,830 | 0,866 |
| Desigualdade (Gini) | 0,483 | 0,530 | 0,562 |
| População (milhões) | 180 | 193 | 206 |
| PIB per capita | R$ 116 mil | R$ 242 mil | R$ 543 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 52,3% / 87,2% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 61,9% |
| Efeito da memória (aleatória, V5 sem → com memória) | 58,3% → 47,9% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 901 (561) |
| Mobilidade: mesmo quintil da origem ao fim | 29,2% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,38 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 11,9% / 2,8% |
| Patrimônio p90/p10 | 276,7× (p10 R$ 237 mil, p90 R$ 66 milhões) |
| Desvio-padrão da felicidade média da vida | 9,21 |
| Vidas com patrimônio negativo ao morrer | 0,6% |
| Mudanças de estado causadas pelo jogador | 44,2% |
| Toques por vida | 477,1 |
| Tempo de CPU por vida | 141,04 ms |
| Ações (fichas usadas) por vida | 158,4 |
| Mortes na família por vida | 5,0 |
| Pontos de virada que vêm do mundo (não do jogador) | 11,7% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 32,6 |
| Vidas que terminam com filho ou filha para continuar | 84,7% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,1 / 56,5% / 30,4% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 4,1 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,89 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 56,1% |
| Entre quem abriu: quebrou / vendeu | 25,7% / 24,5% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 1,7 milhão / R$ 35 milhões / R$ 373 milhões / R$ 306 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 25,62% / 3,45% / 0,38% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 15,7% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 61,5 / 158,4 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 820 | R$ 134 mil | R$ 1,1 milhão | R$ 36 milhões |
| moderado | 883 | R$ 132 mil | R$ 1,3 milhão | R$ 22 milhões |
| arrojado | 797 | R$ 187 mil | R$ 2 milhão | R$ 44 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 72,8 | R$ 3,1 milhões | 73,6 |
| pobre | 104 | 70,3 | R$ 1,4 milhão | 75,1 |
| remediada | 24 | 68,9 | R$ 875 mil | 76,8 |
| media | 64 | 67,6 | R$ 3,4 milhões | 74,1 |
| rica | 64 | 72,0 | R$ 5,2 milhões | 75,9 |
| muito rica | 144 | 70,9 | R$ 18 milhões | 74,7 |
| bilionaria | 356 | 71,5 | R$ 1,9 bilhão | 75,9 |
| trilionaria | 276 | 70,8 | R$ 731 bilhões | 76,0 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 64% / 23% / 10% / 2% |
| Notícias do país por vida | 42,4 |
| Demissões por vida / vindas de uma recessão ou crise | 0,55 / 33,5% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 57% · serviços 14% · saúde 11% · cultura e internet 4% · comércio 3% · agro 2% · transporte e entregas 2% · construção 2% · sem setor 1% · tecnologia 1% · indústria 1% · educação 1% · finanças 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 21% | 33% | 44% | 52% | 74% | 83% | 87% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 33% | 22% | 18% | 16% | 12% |
| Q2 | 29% | 23% | 17% | 18% | 12% |
| Q3 | 23% | 25% | 20% | 19% | 13% |
| Q4 | 12% | 23% | 27% | 23% | 16% |
| Q5 | 3% | 7% | 19% | 24% | 47% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,3 | R$ 1,3 milhão | 73,3 |
| família pobre | 24% | 70,2 | R$ 1,3 milhão | 73,8 |
| família remediada | 20% | 71,2 | R$ 1,6 milhão | 73,7 |
| classe média | 18% | 70,0 | R$ 2,5 milhões | 73,4 |
| família rica | 13% | 70,6 | R$ 5,1 milhões | 73,9 |
| família muito rica | 13% | 70,2 | R$ 23 milhões | 74,5 |
| família bilionária | 3% | 72,5 | R$ 3,2 bilhões | 76,5 |

## Repetição

- **Dentro de uma vida:** 8,7% das aparições repetem uma instância já vista na mesma vida; pior vida: 33,3%.
- **Texto repetido entre vidas:** 25,2% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,2 · `aposentadoria` 1,6 · `irmao_nasce` 0,5 · `avo_mesada_escondida#avo` 0,4 · `namoro_esfriou#amor` 0,3 · `eleicao_geral` 0,2

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 162 de 344 (47%) · típico 161 de 344 (47%) · rico 175 de 344 (51%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `ex_liga_de_madrugada`, `ex_nas_redes`, `ex_cobra`, `mais_um_filho`, `irmao_mais_velho_defende`, `cobranca_da_magoa`, `chefe_hora_extra`, `chefe_magoado_cobra`, `colega_rouba_ideia`, `romance_no_trabalho`, `colega_de_licenca`, `o_caso_vem_a_tona`, `devedor_some`, `cobranca_do_filho`, `planilha_das_dividas`, `casamento_dos_outros`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `contaram_do_caso`, `a_divida_escondida`, `a_divida_vem_a_tona`, `a_festa_escondida`, `a_foto_da_festa`, `contaram_do_esquema`, `a_auditoria`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `o_recall`, `a_licitacao`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `a_opa_da_rival`, `a_opa_do_fundo`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `o_processo_da_marca`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `intercambio`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `pressao_carreira`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `segunda_chance`, `irmao_separou`, `fazer_as_pazes`, `chefe_elogia`, `chefe_magoado_cobra`, `cobrar_divida`, `devedor_some`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `a_conta_da_coroa`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `quartel_sem_verba`, `edital_da_ciencia`, `o_laboratorio_apaga_a_luz`, `contaram_do_caso`, `chantagem_do_caso`, `confessar_o_caso`, `desabafar_o_caso`, `a_divida_vem_a_tona`, `contaram_da_divida`, `confessar_a_divida`, `contaram_da_festa`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `transito_de_sp`, `despejo`, `mestrado_fora`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `fila_do_emprego`, `ex_aluno`, `proposta_remota`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `vaga_na_empresa_dele`, `giz_do_proprio_bolso`, `filial_fechando`, `turno_extra_na_fabrica`, `layoff_por_email`, `clientes_em_panico`, `pedreiro_vale_ouro`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `rumo_a_lua`, `inauguracao_da_cidade`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `cidade_alagou`, `prefeito_da_cidade_nova`, `apagao`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `oferta_pela_subsidiaria`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `celular_dos_pais`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `caixa_sobrando`, `greve_do_piso`, `o_recall`, `imposto_do_ano`, `receita_recorde`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `peneira_do_sobrenome`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `tradutor_da_familia`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `o_preco_remarcado`, `a_impressora_ligada`, `o_credito_sumiu`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `final_da_copa`, `turne_nacional`, `cliente_perdeu_tudo`, `noite_de_corridas`, `contrato_publicitario`, `fa_obcecado`, `concorrente_quebrou`, `a_parcela_do_banco`, `faltou_gente`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `fim_de_semana_no_sitio`, `feriado_na_praia`, `safra_ou_geada`, `ilha_particular`, `carro_de_luxo_na_rua`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `importado_invadiu`, `a_opa_da_rival`, `a_opa_do_fundo`, `o_conselho_te_chama`, `juros_altos_na_fatura`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `o_cartel_vazou`, `o_rival_quer_comprar`, `o_processo_da_marca`, `o_dono_quebrado_pede_emprego`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Apresentados por vida:** 61,5 · **com causa anterior (cadeia):** 80,9 · **maior distância causa→consequência:** 47,6 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 99,4% |
| `namoro` | evento | 99,0% |
| `luto` | npc | 96,0% |
| `enem` | evento | 89,2% |
| `primeiro_voto` | evento | 74,9% |
| `trabalho_grande` | acao | 74,0% |
| `programa_junto` | acao | 69,8% |
| `casamento_do_irmao` | evento | 67,4% |
| `aposentadoria` | evento | 66,0% |
| `curso_online` | acao | 65,0% |
| `bico_adulto` | acao | 63,7% |
| `correr_no_quintal` | acao | 60,7% |
| `formatura` | evento | 60,4% |
| `ler_gibi` | acao | 57,7% |
| `parquinho` | acao | 57,6% |
| `almoco_domingo` | acao | 54,4% |
| `cuidar_da_doenca` | npc | 53,7% |
| `tocar_empresa` | acao | 53,0% |
| `irmao_nasce` | evento | 53,0% |
| `conversar_de_verdade` | acao | 52,6% |
| `saudade_de_voce` | npc | 52,1% |
| `padrinho_do_sobrinho` | evento | 50,9% |
| `eleicao_geral` | evento | 49,4% |
| `mochilao` | acao | 49,0% |
| `avo_mesada_escondida` | npc | 48,5% |
| `visitar_familia` | acao | 48,4% |
| `estudar_concurso` | acao | 47,8% |
| `dizer_umas_verdades` | acao | 47,1% |
| `presente_certo` | acao | 46,9% |
| `pedir_conselho` | acao | 46,9% |
| `ligar_amigo` | acao | 46,6% |
| `oferecer_ajuda` | acao | 45,8% |
| `pos_graduacao` | acao | 45,1% |
| `primeiro_emprego` | evento | 42,3% |
| `demissao` | evento | 42,1% |
| `doente_crianca` | npc | 41,2% |
| `pedir_um_pix` | acao | 41,0% |
| `academia` | acao | 40,5% |
| `esperou_por_voce` | npc | 39,6% |
| `filho_adolescente` | evento | 39,5% |
| `reclama_que_voce_sumiu` | npc | 39,5% |
| `pedir_emprestado` | acao | 38,8% |
| `caminhada` | acao | 38,8% |
| `vontade_ver_o_mar` | npc | 38,7% |
| `estudar_faculdade` | acao | 38,6% |
| `briga_com_o_irmao` | evento | 38,4% |
| `viagem_la_para_fora` | evento | 38,0% |
| `baile_terceira_idade` | acao | 37,7% |
| `estudar_escola` | acao | 36,7% |
| `ler_livros` | acao | 36,7% |
| `namoro_esfriou` | evento | 35,9% |
| `ouvir_historia` | acao | 35,8% |
| `hidro_com_a_turma` | acao | 35,4% |
| `guardar_dinheiro` | acao | 35,3% |
| `paquerar` | acao | 35,1% |
| `correr` | acao | 34,2% |
| `estudar_enem` | acao | 34,1% |
| `perdeu_emprego_na_crise` | npc | 33,7% |
| `rabiscar_parede` | acao | 33,2% |
| `primeiro_investimento` | evento | 32,6% |
| `filho_formatura` | evento | 32,5% |
| `perguntar_porque` | acao | 31,9% |
| `videogame_do_amigo` | acao | 31,0% |
| `balde_da_pracinha` | evento | 30,9% |
| `vontade_de_um_bicho` | npc | 30,8% |
| `creche_ou_vo` | evento | 30,4% |
| `cupido_do_irmao` | acao | 30,4% |
| `check_up` | acao | 30,4% |
| `falando_bem_de_voce` | npc | 30,2% |
| `bullying_recreio` | evento | 29,9% |
| `pedir_desculpas` | acao | 29,8% |
| `estudar_tabuada` | acao | 29,3% |
| `cuidar_de_doente` | acao | 28,9% |
| `amigo_em_apuros` | npc | 28,8% |
| `natacao_no_clube` | acao | 28,5% |
| `pre_escola` | evento | 28,2% |
| `ajudar_em_casa` | acao | 28,2% |
| `bilhete_carinhoso` | npc | 27,4% |
| `copa_do_mundo` | evento | 27,3% |
| `primeiro_beijo` | evento | 26,9% |
| `acidente_em_casa` | evento | 26,7% |
| `piada_no_grupo` | npc | 26,2% |
| `vontade_viagem_com_amigo` | npc | 25,8% |
| `socorro_com_as_criancas` | acao | 25,4% |
| `viagem_dos_sonhos` | evento | 25,3% |
| `visitar_o_tumulo` | acao | 24,9% |
| `festa_80` | evento | 24,9% |
| `perdeu_aniversario` | npc | 24,6% |
| `tentar_um_filho` | acao | 24,5% |
| `show_no_estadio` | acao | 24,3% |
| `cortar_gastos` | acao | 24,2% |
| `vontade_voltar_a_terra` | npc | 24,0% |
| `pelada` | acao | 23,9% |
| `banda_garagem` | evento | 23,8% |
| `colesterol_alto` | evento | 23,6% |
| `historias_ou_telas` | evento | 23,4% |
| `cachorro_caramelo` | evento | 23,3% |
| `investir_tesouro` | acao | 23,2% |
| `curso_nota_alta` | evento | 23,0% |
| `primeiro_celular` | evento | 23,0% |
| `amor_quer_casar` | npc | 22,7% |
| `vacina_no_posto` | evento | 22,2% |
| `salario_em_dolar` | evento | 22,1% |
| `bico_adolescente` | acao | 22,0% |
| `amigo_pede_dinheiro` | evento | 21,9% |
| `golpe_pix` | evento | 21,7% |
| `avo_conta_historias` | npc | 21,6% |
| `a_festa_escondida` | evento | 21,6% |
| `cursinho_pago` | acao | 21,4% |
| `vape_festa` | evento | 21,4% |
| `o_bebe_chegou` | evento | 20,9% |
| `rebalancear` | acao | 20,8% |
| `festa_junina` | evento | 20,7% |
| `viagem_realizada` | evento | 20,6% |
| `esporte_depois_da_aula` | evento | 20,5% |
| `doar_sangue` | evento | 20,4% |
| `carro` | evento | 20,2% |
| `cozinhar_com_a_avo` | acao | 20,2% |
| `oportunidade_de_negocio` | evento | 20,2% |
| `hora_extra` | acao | 20,0% |
| `casamento` | npc | 19,9% |
| `bet` | evento | 19,7% |
| `futebol_de_varzea` | acao | 19,7% |
| `pelada_de_quinta` | evento | 19,7% |
| `investimento_furado` | evento | 19,6% |
| `emprego_saude` | evento | 19,6% |
| `festa_tema` | evento | 19,5% |
| `filho` | npc | 19,4% |
| `previdencia` | acao | 18,9% |
| `crise_la_fora` | evento | 18,9% |
| `festa_da_cidade` | acao | 18,9% |
| `largar_tudo` | evento | 18,9% |
| `pisa_em_ovos` | npc | 18,5% |
| `criptomoeda` | evento | 18,4% |
| `primeira_palavra` | evento | 18,2% |
| `tempo_com_amor` | acao | 18,1% |
| `casa_dos_pais` | evento | 18,1% |
| `reforma_da_casa` | evento | 17,7% |
| `mesada` | evento | 17,6% |
| `encontro` | acao | 17,6% |
| `feira_ciencias` | evento | 17,6% |
| `tatuagem` | evento | 17,3% |
| `data_da_partida` | evento | 17,3% |
| `pai_ausente_volta` | npc | 17,3% |
| `viajar_com_o_amigo` | acao | 17,1% |
| `curso_nota_media` | evento | 17,1% |
| `vender_doce` | acao | 17,0% |
| `voltar_a_estudar` | acao | 16,7% |
| `vaquinha_do_vizinho` | evento | 16,4% |
| `ceia_de_natal` | evento | 16,4% |
| `tempo_com_filho` | acao | 16,4% |
| `bolao_do_trabalho` | evento | 16,4% |
| `entregas` | acao | 16,2% |
| `reencontro_da_turma` | evento | 16,2% |
| `hobby_horta` | evento | 16,2% |
| `pensar_em_adotar` | evento | 16,0% |
| `mais_um_filho` | npc | 15,9% |
| `vizinho_barulhento` | evento | 15,8% |
| `orgulho_da_formatura` | npc | 15,7% |
| `sair_de_casa` | evento | 15,7% |
| `subir_de_padrao` | evento | 15,6% |
| `pede_ajuda` | npc | 15,5% |
| `juros_compostos` | evento | 15,3% |
| `pede_um_favor_a_voce` | npc | 15,2% |
| `proposta_na_expansao` | evento | 15,1% |
| `ingles_crianca` | acao | 15,0% |
| `irmao_mora_longe` | evento | 15,0% |
| `catapora` | evento | 14,9% |
| `heranca_do_tio` | evento | 14,9% |
| `o_esquema_do_colega` | evento | 14,5% |
| `assalto_na_rua` | evento | 14,5% |
| `desempregado` | evento | 14,5% |
| `primeiro_cupom` | evento | 14,3% |
| `franquia` | evento | 14,2% |
| `faculdade_a_noite` | acao | 14,1% |
| `vontade_ver_o_neto` | npc | 14,0% |
| `bateu_o_carro` | evento | 13,6% |
| `festa_sem_pais` | evento | 13,5% |
| `ceu_de_fumaca` | evento | 13,3% |
| `festa_de_sao_joao` | evento | 13,3% |
| `empresa_quebrou` | evento | 13,2% |
| `fome_no_fim_do_mes` | evento | 13,2% |
| `moeda_digital` | evento | 13,1% |
| `bloco_de_carnaval` | evento | 13,0% |
| `leu_antes_dos_colegas` | evento | 12,9% |
| `fazenda_a_venda` | evento | 12,9% |
| `mudar_para_a_praia` | evento | 12,9% |
| `casa_propria` | evento | 12,7% |
| `plano_de_negocios` | evento | 12,6% |
| `cripto_fomo` | evento | 12,6% |
| `sabado_com_os_sobrinhos` | evento | 12,5% |
| `fila_de_pedidos` | evento | 12,4% |
| `corte_de_salario` | evento | 12,4% |
| `filho_desenho` | npc | 12,3% |
| `reencontro_amigo` | evento | 12,3% |
| `hidroginastica` | evento | 12,3% |
| `amigo_devolve` | npc | 12,1% |
| `carteira_da_diarista` | evento | 12,0% |
| `baile_da_terceira_idade` | evento | 11,9% |
| `cirurgia_de_catarata` | evento | 11,8% |
| `aula_de_musica` | evento | 11,6% |
| `balcao_negocio` | acao | 11,5% |
| `investimento_rotina` | evento | 11,5% |
| `pedido_de_casamento` | acao | 11,5% |
| `a_vacina_no_posto` | evento | 11,5% |
| `pais_envelhece` | evento | 11,4% |
| `levar_ao_mar` | acao | 11,4% |
| `imposto_alto_no_contracheque` | evento | 11,3% |
| `convite_para_palestrar` | evento | 11,3% |
| `sovina_ou_sabio` | evento | 11,1% |
| `peneira` | evento | 11,0% |
| `cofrinho` | acao | 11,0% |
| `entregador_chuva` | evento | 11,0% |
| `imovel_valorizou` | evento | 10,9% |
| `idh_muito_alto` | evento | 10,9% |
| `reuniao_de_condominio` | evento | 10,8% |
| `imposto_baixo_sobrou` | evento | 10,8% |
| `brigas_de_madrugada` | evento | 10,8% |
| `esporte_escola` | acao | 10,7% |
| `irmao_mais_velho_defende` | evento | 10,7% |
| `alavancagem` | evento | 10,5% |
| `surpresa_do_amor` | npc | 10,5% |
| `voltar_estudar` | evento | 10,4% |
| `escrever_memorias` | evento | 10,4% |
| `aniversario_da_infancia` | evento | 10,4% |
| `promocao` | evento | 10,4% |
| `alugueis_dos_fundos` | evento | 10,4% |
| `casa_cheia` | evento | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,3% |
| `maratona` | evento | 10,3% |
| `multa_e_batida` | evento | 10,3% |
| `juros_baixos_euforia` | evento | 10,3% |
| `parar_de_fumar` | acao | 10,2% |
| `role` | acao | 10,1% |
| `convite_do_luxo` | evento | 10,1% |
| `separacao_dos_pais` | evento | 10,1% |
| `recomecar_amor` | acao | 10,0% |
| `dolar_barato` | evento | 10,0% |
| `feira_de_ciencias` | evento | 10,0% |
| `filho_imitacao` | npc | 10,0% |
| `praia` | acao | 10,0% |
| `golpe_do_falso_neto` | evento | 9,8% |
| `separacao` | evento | 9,8% |
| `quarto_dividido` | evento | 9,8% |
| `produto_viralizou` | evento | 9,8% |
| `rua_tranquila` | evento | 9,6% |
| `negocio_no_aperto` | evento | 9,6% |
| `bolsa_la_fora` | evento | 9,5% |
| `a_foto_da_festa` | evento | 9,5% |
| `vaga_sobrando` | evento | 9,4% |
| `comer_tudo` | acao | 9,3% |
| `compra_por_impulso` | evento | 9,3% |
| `greve_dos_onibus` | evento | 9,3% |
| `bolsa_de_estudos` | evento | 9,3% |
| `testamento` | evento | 9,3% |
| `gerente_do_banco` | evento | 9,3% |
| `colo_da_avo` | acao | 9,2% |
| `brincar_com_o_pai` | acao | 9,2% |
| `casa_na_praia` | evento | 9,1% |
| `casamento_na_igreja` | npc | 9,0% |
| `brincar_na_rua` | acao | 9,0% |
| `consorcio` | evento | 8,8% |
| `chimarrao` | acao | 8,8% |
| `peito_chiando` | evento | 8,8% |
| `ciumes_do_irmao` | evento | 8,8% |
| `seca_no_sertao` | evento | 8,8% |
| `pobreza_na_porta` | evento | 8,7% |
| `assalto_no_onibus` | evento | 8,6% |
| `sao_joao` | acao | 8,6% |
| `remorso_aperta` | evento | 8,5% |
| `cheia_do_rio` | evento | 8,5% |
| `bolsa_subiu_sem_voce` | evento | 8,4% |
| `concorrente_gigante` | evento | 8,3% |
| `cartao_credito` | evento | 8,3% |
| `retiro_da_igreja` | evento | 8,3% |
| `brincar_amigos` | acao | 8,3% |
| `a_proposta_do_gestor` | npc | 8,2% |
| `pib_recorde` | evento | 8,1% |
| `irmao_doente` | evento | 8,1% |
| `investidor_anjo` | evento | 8,1% |
| `socio_sumiu` | evento | 8,1% |
| `amor_piada_interna` | npc | 8,0% |
| `mudanca_de_escola` | evento | 8,0% |
| `passear_de_carrinho` | acao | 8,0% |
| `apartamento_na_planta` | evento | 8,0% |
| `padrao_de_vida` | evento | 7,8% |
| `fugir_inflacao` | acao | 7,7% |
| `chefe_novo` | evento | 7,7% |
| `conteudo_extra` | acao | 7,6% |
| `olimpiada_matematica` | evento | 7,6% |
| `dente_de_leite` | evento | 7,6% |
| `pular_corda` | acao | 7,5% |
| `briga_em_casa` | npc | 7,4% |
| `desigualdade_no_jornal` | evento | 7,4% |
| `ressaca_do_mar` | evento | 7,4% |
| `aposentadoria_ativa` | evento | 7,4% |
| `crise_40` | evento | 7,4% |
| `boi_bumba` | acao | 7,3% |
| `amor_proposta_fora` | npc | 7,3% |
| `queda` | evento | 7,3% |
| `ciume_do_bebe_novo` | evento | 7,3% |
| `filho_nao_veio` | npc | 7,2% |
| `apartamento_decorado` | evento | 7,2% |
| `figurinha_repetida` | acao | 7,2% |
| `retirada_demais` | evento | 7,2% |
| `pousada_na_praia` | evento | 7,1% |
| `festival_do_boi` | evento | 7,1% |
| `pede_emprestado_a_voce` | npc | 7,0% |
| `vontade_casa_propria` | npc | 7,0% |
| `levar_a_terra_natal` | acao | 6,9% |
| `fundo_da_familia` | npc | 6,9% |
| `netos` | evento | 6,9% |
| `dolar_disparou` | evento | 6,9% |
| `noite_de_stand_up` | evento | 6,9% |
| `propina_da_empreiteira` | evento | 6,9% |
| `titulo_eleitor` | evento | 6,8% |
| `festa_surpresa` | evento | 6,8% |
| `soltar_pipa` | acao | 6,8% |
| `inquilino_dos_sonhos` | evento | 6,8% |
| `juros_altos_rendendo` | evento | 6,8% |
| `ponto_comercial` | evento | 6,8% |
| `ouvido_para_musica` | evento | 6,7% |
| `inquilino_sumiu` | evento | 6,7% |
| `geladeira_vazia` | evento | 6,7% |
| `cidadania_italiana` | evento | 6,7% |
| `atendimento_robo` | evento | 6,7% |
| `apagao_no_morro` | evento | 6,7% |
| `blitz_toda_noite` | evento | 6,7% |
| `chefe_hora_extra` | npc | 6,6% |
| `contas_do_milhao` | evento | 6,5% |
| `cripto_disparou` | evento | 6,4% |
| `geada_no_sul` | evento | 6,3% |
| `desemprego_em_alta` | evento | 6,3% |
| `voce_mudou` | npc | 6,1% |
| `enchente_na_rua` | evento | 6,1% |
| `nao_acredita_mais` | npc | 6,1% |
| `pedem_sua_opiniao` | evento | 6,0% |
| `primeiro_container` | evento | 6,0% |
| `tocar_no_bar` | acao | 6,0% |
| `festa_de_15` | evento | 6,0% |
| `pescaria_no_pantanal` | evento | 6,0% |
| `faculdade_vida` | evento | 6,0% |
| `pressao_alta` | evento | 6,0% |
| `o_rival_levou_seu_gerente` | npc | 5,9% |
| `herdeiro_gastao` | evento | 5,9% |
| `mei_negocio` | evento | 5,8% |
| `fiscalizacao` | evento | 5,8% |
| `mutirao_de_cirurgias` | evento | 5,7% |
| `edital_de_cultura` | evento | 5,7% |
| `vender_doce_nato` | acao | 5,6% |
| `chefe_injusto` | evento | 5,6% |
| `operacao_policial` | evento | 5,6% |
| `adocao_chegou` | evento | 5,5% |
| `estatua` | jogada | 5,5% |
| `auxilio_na_conta` | evento | 5,4% |
| `grupo_de_jovens` | evento | 5,3% |
| `briga_dos_pais` | evento | 5,3% |
| `idh_em_queda` | evento | 5,3% |
| `assembleia_do_predio` | evento | 5,3% |
| `merenda` | evento | 5,3% |
| `nome_sujo` | evento | 5,3% |
| `academia_de_janeiro` | evento | 5,2% |
| `paquerar_timido` | acao | 5,1% |
| `escola_publica_boa` | evento | 5,1% |
| `socio_da_patente` | evento | 5,0% |
| `plantao_lotado` | evento | 5,0% |
| `luto_do_bicho` | npc | 5,0% |
| `vo_receita` | evento | 5,0% |
| `vo_partiu` | npc | 4,9% |
| `a_aposta_escondida` | evento | 4,9% |
| `concurso_lotado` | evento | 4,9% |
| `filho_cuida` | npc | 4,9% |
| `ninguem_conhece` | evento | 4,8% |
| `emprestimo_ao_irmao` | evento | 4,8% |
| `a_engenheira_saiu` | evento | 4,8% |
| `o_partido_bate_na_porta` | evento | 4,8% |
| `escolheu_bem` | npc | 4,8% |
| `votacao_polemica` | evento | 4,8% |
| `chaves_do_apartamento` | evento | 4,7% |
| `vicio_aposta` | evento | 4,6% |
| `filho_saude_fragil` | npc | 4,6% |
| `comecar_terapia` | evento | 4,6% |
| `doenca_de_quem_ama` | evento | 4,6% |
| `obra_grande_no_norte` | evento | 4,6% |
| `romance_no_trabalho` | evento | 4,6% |
| `crise_de_ansiedade` | evento | 4,5% |
| `casamento_do_filho` | evento | 4,5% |
| `asma_na_educacao_fisica` | evento | 4,4% |
| `conselho_que_diz_nao` | jogada | 4,3% |
| `festa_do_seculo` | jogada | 4,3% |
| `proposta_de_compra` | evento | 4,3% |
| `bico_na_expansao` | evento | 4,3% |
| `o_irmao_viu` | npc | 4,2% |
| `briga_na_cozinha` | evento | 4,2% |
| `moto_na_chuva` | evento | 4,2% |
| `aprovado_concurso_estudo` | evento | 4,2% |
| `cripto_de_novo` | acao | 4,2% |
| `curso_nota_baixa` | evento | 4,2% |
| `mensalidade_da_escola` | npc | 4,1% |
| `namorar_depois_dos_60` | evento | 4,1% |
| `pais_na_crise` | npc | 4,0% |
| `show_no_bar` | evento | 4,0% |
| `festa_vazou` | evento | 4,0% |
| `burnout_empresa` | evento | 4,0% |
| `pais_separados_natal` | evento | 4,0% |
| `trabalho_do_pai` | acao | 3,9% |
| `greve_do_servidor` | evento | 3,9% |
| `escola_de_samba` | jogada | 3,9% |
| `inflacao_no_mercado` | evento | 3,9% |
| `a_divida_escondida` | evento | 3,9% |
| `agro_na_cidade` | evento | 3,9% |
| `cachoeira` | acao | 3,9% |
| `viralizou` | evento | 3,8% |
| `heranca` | evento | 3,8% |
| `colega_rouba_ideia` | npc | 3,8% |
| `amigo_muda_de_cidade` | npc | 3,8% |
| `olimpiada` | acao | 3,8% |
| `estatua_pichada` | evento | 3,7% |
| `processo_trabalhista` | evento | 3,7% |
| `cobranca_de_notas` | npc | 3,7% |
| `natal_com_politica` | evento | 3,7% |
| `bolsa_derreteu` | evento | 3,7% |
| `ex_nas_redes` | evento | 3,7% |
| `blindar_contas` | acao | 3,6% |
| `um_bicho_para_o_filho` | acao | 3,6% |
| `pescaria_no_rio` | evento | 3,6% |
| `mae_quer_morar_junto` | npc | 3,6% |
| `colega_de_licenca` | evento | 3,5% |
| `promessa_da_mae` | evento | 3,5% |
| `excursao_ao_mar` | acao | 3,5% |
| `satelite_na_tv` | evento | 3,5% |
| `marca_em_alta` | evento | 3,5% |
| `intercambio_pago` | evento | 3,5% |
| `family_office` | evento | 3,5% |
| `ex_reencontro` | evento | 3,5% |
| `festival_lotado` | evento | 3,5% |
| `prova_concurso` | evento | 3,4% |
| `mutirao_da_laje` | evento | 3,4% |
| `piramide_no_grupo` | npc | 3,4% |
| `qualidade_premiada` | evento | 3,4% |
| `la_fora_comprando` | evento | 3,4% |
| `netos_nas_ferias` | evento | 3,4% |
| `greve_dos_professores` | evento | 3,4% |
| `concorrente_de_fora` | evento | 3,3% |
| `terapia` | acao | 3,3% |
| `filho_primeiro_salario` | npc | 3,3% |
| `joelho_da_pelada` | evento | 3,3% |
| `confeitaria_da_vo` | evento | 3,2% |
| `ajudar_na_roca` | acao | 3,2% |
| `colega_happy_hour` | npc | 3,2% |
| `funcionario_genial` | evento | 3,2% |
| `cripto_derreteu` | evento | 3,2% |
| `tentacao_no_trabalho` | evento | 3,1% |
| `balcao_da_familia` | evento | 3,1% |
| `crescer_devagar` | evento | 3,1% |
| `balcao_de_crianca` | evento | 3,1% |
| `sociedade_amigo` | evento | 3,1% |
| `confessar_o_esquema` | acao | 3,1% |
| `acordo_abriu_mercado` | evento | 3,1% |
| `posto_que_funciona` | evento | 3,1% |
| `enchente_na_cidade` | evento | 3,1% |
| `bater_o_pe_com_o_chefe` | evento | 3,0% |
| `obra_ou_hospital` | evento | 3,0% |
| `o_que_pensa_de_voce` | npc | 3,0% |
| `cobra_voce` | npc | 3,0% |
| `clinica_particular_contrata` | evento | 3,0% |
| `depois_do_cargo` | evento | 3,0% |
| `tarifa_do_app` | evento | 3,0% |
| `vereador` | evento | 3,0% |
| `tosse_cronica` | evento | 2,9% |
| `filho_quer_carro` | evento | 2,8% |
| `fila_do_posto` | evento | 2,8% |
| `vender_picole` | acao | 2,8% |
| `cuidar_netos` | acao | 2,8% |
| `convite_para_candidatura` | evento | 2,8% |
| `amigo_pede_de_novo` | npc | 2,7% |
| `setor_aquecido` | evento | 2,7% |
| `ex_namora_amigo` | evento | 2,7% |
| `olimpiada_do_instituto` | evento | 2,7% |
| `cursinho_comunitario` | evento | 2,7% |
| `filho_passou_longe` | npc | 2,7% |
| `este_e_o_ano` | evento | 2,6% |
| `aposentadoria_nao_da` | npc | 2,6% |
| `contaram_do_esquema` | evento | 2,6% |
| `chantagem_do_esquema` | npc | 2,6% |
| `primeiro_funcionario` | evento | 2,6% |
| `convite_igreja` | npc | 2,6% |
| `conselho_de_fachada` | evento | 2,6% |
| `alguem_especial` | evento | 2,6% |
| `ano_no_prejuizo` | evento | 2,6% |
| `festa_surpresa_para` | npc | 2,5% |
| `fim_do_amor` | npc | 2,5% |
| `irmao_desempregado` | npc | 2,5% |
| `saudade_de_la` | evento | 2,5% |
| `governo_que_voce_elegeu_frente_popular` | evento | 2,5% |
| `clientes_sumiram` | evento | 2,4% |
| `compativel_para_medula` | evento | 2,4% |
| `so_aparece_por_dinheiro` | npc | 2,4% |
| `fundacao_com_seu_nome` | evento | 2,4% |
| `imposto_sobre_fortunas` | evento | 2,4% |
| `bancar_quem_sai` | jogada | 2,4% |
| `joias_no_cofre` | evento | 2,4% |
| `apresentacao_para_a_diretoria` | evento | 2,3% |
| `tentar_outra_cidade` | evento | 2,3% |
| `cobranca_do_casamento` | npc | 2,3% |
| `importado_ficou_caro` | evento | 2,3% |
| `proposta_sao_paulo` | evento | 2,3% |
| `reajuste_dos_servidores` | evento | 2,3% |
| `assumir_negocio` | evento | 2,3% |
| `escola_integral` | evento | 2,3% |
| `programa_de_moradia` | evento | 2,2% |
| `birra_no_mercado` | evento | 2,2% |
| `crianca_ansiosa` | evento | 2,2% |
| `colega_cobre_voce` | npc | 2,2% |
| `vaga_na_capital` | evento | 2,2% |
| `fiador` | npc | 2,2% |
| `ramo_em_crise` | evento | 2,2% |
| `ferias_do_dono` | evento | 2,1% |
| `crise_no_setor` | evento | 2,1% |
| `emprego_tecnologia` | evento | 2,1% |
| `surto_no_bairro` | evento | 2,0% |
| `missa_em_familia` | acao | 2,0% |
| `voltar_com_o_ex` | npc | 2,0% |
| `faculdade_depois_dos_60` | npc | 2,0% |
| `amor_quer_mudar_de_carreira` | npc | 2,0% |
| `ex_casou` | npc | 2,0% |
| `depois_da_venda` | evento | 2,0% |
| `volta_terra` | evento | 1,9% |
| `plano_de_saude_subiu` | evento | 1,9% |
| `carregar_a_geladeira` | evento | 1,9% |
| `gorjeta_boa` | evento | 1,9% |
| `dolar_virou_salario` | evento | 1,9% |
| `seguranca_particular` | evento | 1,9% |
| `formatura_tardia` | evento | 1,9% |
| `hospital_sem_insumo` | evento | 1,8% |
| `filho_cuida_de_voce` | npc | 1,8% |
| `irmaos_brigam` | evento | 1,8% |
| `cidadania_do_bisavo` | evento | 1,8% |
| `shows_cancelados` | evento | 1,7% |
| `cobranca_da_magoa` | npc | 1,7% |
| `juros_altos` | evento | 1,7% |
| `presidir_cpi` | evento | 1,7% |
| `amigo_sumiu_e_voltou` | npc | 1,7% |
| `ainda_mora_com_pais` | evento | 1,6% |
| `imovel_na_baixa` | evento | 1,6% |
| `carreira_futebol` | evento | 1,6% |
| `obra_do_predio` | evento | 1,6% |
| `o_rival_na_festa` | npc | 1,6% |
| `mural_de_problemas` | jogada | 1,6% |
| `passear_pet` | acao | 1,6% |
| `ajudar_na_coleta` | evento | 1,6% |
| `duas_empresas_uma_agenda` | evento | 1,6% |
| `emprestimo_de_volta` | evento | 1,6% |
| `bodas_de_prata` | evento | 1,6% |
| `apuracao_do_carnaval` | evento | 1,6% |
| `cupula_la_fora` | evento | 1,5% |
| `a_conversa_que_faltava` | npc | 1,5% |
| `arrojado_na_queda` | evento | 1,5% |
| `recaida_cigarro` | evento | 1,5% |
| `expandir_na_alta` | evento | 1,5% |
| `ferias_com_a_familia_do_amor` | npc | 1,5% |
| `black_friday` | evento | 1,5% |
| `gravidez_surpresa` | npc | 1,5% |
| `aposentado_quer_ajudar_na_empresa` | npc | 1,5% |
| `reencontro_paixao` | evento | 1,4% |
| `a_tregua_do_rival` | npc | 1,4% |
| `embaixador_pede` | evento | 1,4% |
| `amigo_lembra_zoeira` | npc | 1,4% |
| `carona_de_madrugada` | npc | 1,4% |
| `briga_por_heranca` | evento | 1,4% |
| `rodada_grande` | evento | 1,4% |
| `equipe_para_desmontar` | jogada | 1,4% |
| `governo_que_voce_elegeu_centrao` | evento | 1,3% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,3% |
| `doar_em_vida` | evento | 1,3% |
| `foto_de_campanha` | evento | 1,3% |
| `vida_depois_da_condenacao` | evento | 1,3% |
| `padrao_aperta` | evento | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `amor_paga_a_conta` | npc | 1,3% |
| `pix_para_a_cidade` | jogada | 1,3% |
| `convite_para_o_palco_grande` | evento | 1,3% |
| `convite_do_partido` | evento | 1,3% |
| `estrutura_parada` | evento | 1,2% |
| `fronteira_fechada` | evento | 1,2% |
| `visitar_de_longe` | acao | 1,2% |
| `sair_de_casa_cedo` | evento | 1,2% |
| `nega_ajuda` | npc | 1,2% |
| `preco_do_pao` | evento | 1,2% |
| `reforma_sem_fim` | evento | 1,2% |
| `ex_saudade_de_quem_foi` | evento | 1,2% |
| `sucessao_regime` | evento | 1,2% |
| `ocorrencia_perigosa` | evento | 1,2% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,2% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 1,2% |
| `irmao_aposentou` | evento | 1,1% |
| `dez_anos_de_empresa` | evento | 1,1% |
| `renegociar_divida` | evento | 1,1% |
| `salario_parcelado` | evento | 1,1% |
| `rompimento` | npc | 1,1% |
| `dizimo` | evento | 1,1% |
| `oferece_ajuda` | npc | 1,1% |
| `lembranca_primeiro_amor` | evento | 1,1% |
| `greve_da_federal` | evento | 1,1% |
| `cara_de_comercial` | evento | 1,1% |
| `ano_de_prejuizo` | evento | 1,1% |
| `lesao_grave` | evento | 1,1% |
| `ex_liga_de_madrugada` | npc | 1,1% |
| `frete_sumiu` | evento | 1,1% |
| `familia_descobre_o_testamento` | evento | 1,1% |
| `tocar_o_negocio` | acao | 1,1% |
| `emprego_educacao` | evento | 1,0% |
| `bolsa_de_iniciacao` | evento | 1,0% |
| `setor_afundou` | evento | 1,0% |
| `grade_na_janela` | evento | 1,0% |
| `o_conselho_vetou` | evento | 1,0% |
| `chefe_amigo` | evento | 0,9% |
| `aniversario_de_gemeos` | evento | 0,9% |
| `a_auditoria` | evento | 0,9% |
| `happy_hour` | acao | 0,9% |
| `time_a_venda` | evento | 0,9% |
| `bancar_presidente` | jogada | 0,9% |
| `estatua_derrubada` | evento | 0,9% |
| `concorrente_nova` | evento | 0,9% |
| `planilha_das_dividas` | evento | 0,9% |
| `cancelado` | evento | 0,9% |
| `o_ex_quer_um_cafe` | npc | 0,9% |
| `fundacao` | jogada | 0,9% |
| `proposta_da_europa` | evento | 0,9% |
| `guerra_de_precos` | evento | 0,9% |
| `calote_no_noticiario` | evento | 0,9% |
| `segundo_carro` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `ex_cobra` | npc | 0,8% |
| `acoes_da_startup` | evento | 0,8% |
| `solucao_inesperada` | evento | 0,8% |
| `mais_uma_mudanca` | evento | 0,8% |
| `amor_quadro_de_tarefas` | npc | 0,8% |
| `depois_do_calote` | evento | 0,8% |
| `nao_para_quieto` | evento | 0,8% |
| `filho_parou_de_contar` | npc | 0,8% |
| `acampamento_na_porta` | evento | 0,8% |
| `apartamento_de_presente` | evento | 0,8% |
| `cobranca_no_telefone` | evento | 0,8% |
| `safra_da_fazenda` | evento | 0,8% |
| `pane_no_voo` | evento | 0,8% |
| `vontade_festa_de_80` | npc | 0,8% |
| `favor_do_presidente` | evento | 0,8% |
| `hit_viral` | evento | 0,8% |
| `homenagem_no_trabalho` | evento | 0,7% |
| `tornar_se_dispensavel` | jogada | 0,7% |
| `exportacao_bate_recorde` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `mesa_cheia` | evento | 0,7% |
| `noite_da_apuracao` | evento | 0,7% |
| `pai_namorando_de_novo` | npc | 0,7% |
| `briga_de_casal` | npc | 0,7% |
| `promocao_em_outra_cidade` | evento | 0,7% |
| `casamento_dos_outros` | evento | 0,7% |
| `guerra_comercial` | evento | 0,7% |
| `jantar_esfriou` | npc | 0,7% |
| `holding_da_familia` | evento | 0,7% |
| `amigo_ficou_rico` | npc | 0,7% |
| `renegociar_cartao` | acao | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `feirao_limpa_nome` | evento | 0,7% |
| `set_de_gravacao` | evento | 0,7% |
| `critico_no_salao` | evento | 0,6% |
| `divida_publica_assusta` | evento | 0,6% |
| `robos_na_fabrica` | evento | 0,6% |
| `o_mural_do_boton` | evento | 0,6% |
| `obra_atrasada` | evento | 0,6% |
| `cobranca_do_filho` | npc | 0,6% |
| `a_convocacao` | evento | 0,6% |
| `lista_dos_mais_ricos` | evento | 0,6% |
| `segredo_de_familia` | npc | 0,6% |
| `proposta_em_dolar` | evento | 0,6% |
| `filho_briga_na_escola` | npc | 0,6% |
| `ex_internado` | evento | 0,6% |
| `a_licitacao` | evento | 0,6% |
| `sancao_parou_o_porto` | evento | 0,6% |
| `queda_do_cargo` | evento | 0,6% |
| `amor_desconfia` | npc | 0,6% |
| `a_empresa_sem_voce` | evento | 0,6% |
| `paparazzi` | evento | 0,6% |
| `burnout` | evento | 0,6% |
| `rebaixamento` | evento | 0,6% |
| `papel_da_vida` | evento | 0,6% |
| `o_caso_vem_a_tona` | evento | 0,5% |
| `infancia_no_palacio` | evento | 0,5% |
| `vaga_no_agro` | evento | 0,5% |
| `ajudar_com_a_casa` | acao | 0,5% |
| `livro_viralizou` | evento | 0,5% |
| `treinar_no_clube` | acao | 0,5% |
| `vendas_recorde` | evento | 0,5% |
| `deploy_de_sexta` | evento | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,5% |
| `desfile_de_sete_de_setembro` | evento | 0,5% |
| `ameaca_de_sancao` | evento | 0,5% |
| `intercambio` | evento | 0,5% |
| `segunda_chance` | npc | 0,5% |
| `cozinha_da_fundacao` | evento | 0,5% |
| `tradutor_da_familia` | evento | 0,5% |
| `desabafar_o_caso` | acao | 0,5% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,5% |
| `racionamento` | evento | 0,5% |
| `guerra_na_escola` | evento | 0,5% |
| `pedreiro_vale_ouro` | evento | 0,5% |
| `emprego_artes` | evento | 0,5% |
| `vaga_na_empresa_dele` | npc | 0,5% |
| `fazer_as_pazes` | acao | 0,4% |
| `peneira_do_sobrenome` | evento | 0,4% |
| `contrato_publicitario` | evento | 0,4% |
| `cavalo_campeao` | evento | 0,4% |
| `pressao_carreira` | npc | 0,4% |
| `mestrado_fora` | evento | 0,4% |
| `fila_do_emprego` | evento | 0,4% |
| `turne_nacional` | evento | 0,4% |
| `padrinho_casamento` | npc | 0,4% |
| `oferta_pela_subsidiaria` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `a_parcela_do_banco` | evento | 0,4% |
| `quartel_sem_verba` | evento | 0,4% |
| `o_preco_remarcado` | evento | 0,4% |
| `contaram_da_festa` | evento | 0,4% |
| `despejo` | evento | 0,4% |
| `caixa_sobrando` | evento | 0,4% |
| `assinatura_real` | evento | 0,4% |
| `o_laboratorio_apaga_a_luz` | evento | 0,4% |
| `confessar_o_caso` | acao | 0,4% |
| `aluguel_com_nome_sujo` | evento | 0,4% |
| `a_impressora_ligada` | evento | 0,4% |
| `ministro_pede_ajuste` | evento | 0,4% |
| `chefe_elogia` | npc | 0,4% |
| `montadora_vai_fechar` | evento | 0,4% |
| `mordomias_reais` | evento | 0,4% |
| `circo_vai_embora` | evento | 0,4% |
| `feriado_na_praia` | evento | 0,4% |
| `juros_altos_na_fatura` | evento | 0,4% |
| `cobrar_divida` | acao | 0,4% |
| `aluguel_caro` | evento | 0,4% |
| `transito_de_sp` | evento | 0,4% |
| `startup_dos_ex_funcionarios` | evento | 0,4% |
| `picadeiro` | evento | 0,4% |
| `fim_de_semana_no_sitio` | evento | 0,4% |
| `carro_de_luxo_na_rua` | evento | 0,4% |
| `o_dono_quebrado_pede_emprego` | npc | 0,4% |
| `quebra_de_safra` | evento | 0,3% |
| `o_bicho_herdeiro` | evento | 0,3% |
| `a_conta_da_coroa` | evento | 0,3% |
| `celular_dos_pais` | npc | 0,3% |
| `internato_real` | evento | 0,3% |
| `bonanca_no_governo` | evento | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `regra_sob_medida` | evento | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `obra_parada` | evento | 0,3% |
| `filial_fechando` | evento | 0,3% |
| `noite_de_corridas` | evento | 0,3% |
| `greve_geral` | evento | 0,3% |
| `filho_hamburgueria` | npc | 0,3% |
| `as_criancas_perguntam` | npc | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `layoff_por_email` | evento | 0,3% |
| `choque_de_culturas` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `o_cartel_vazou` | evento | 0,3% |
| `trazer_a_copa` | jogada | 0,3% |
| `filho_apresenta_namoro` | npc | 0,3% |
| `oposicao_na_tv` | evento | 0,3% |
| `decreto_da_economia` | evento | 0,3% |
| `a_baba_foi_embora` | evento | 0,3% |
| `irmao_separou` | npc | 0,3% |
| `confessar_a_divida` | acao | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `emprego_negocios` | evento | 0,3% |
| `plantao_que_nao_acaba` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,2% |
| `o_veterano` | evento | 0,2% |
| `cargo_no_gabinete` | evento | 0,2% |
| `assumir_a_fazenda` | evento | 0,2% |
| `violencia_vira_manchete` | evento | 0,2% |
| `tomar_o_poder` | jogada | 0,2% |
| `pais_envelhecem` | npc | 0,2% |
| `fabrica_de_municao` | evento | 0,2% |
| `concurso_em_brasilia` | evento | 0,2% |
| `turno_extra_na_fabrica` | evento | 0,2% |
| `o_recall` | evento | 0,2% |
| `paciente_famoso` | evento | 0,2% |
| `final_da_copa` | evento | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `leilao_da_obra` | evento | 0,2% |
| `crise_internacional` | evento | 0,2% |
| `aperto_do_mes` | evento | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `mansao_vazia` | evento | 0,2% |
| `importado_invadiu` | evento | 0,2% |
| `proposta_pelo_negocio` | evento | 0,2% |
| `jubileu` | evento | 0,2% |
| `faltou_gente` | evento | 0,2% |
| `o_rival_quer_comprar` | npc | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `chefe_magoado_cobra` | npc | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `fa_obcecado` | evento | 0,2% |
| `edital_da_ciencia` | evento | 0,2% |
| `a_divida_vem_a_tona` | evento | 0,2% |
| `imposto_do_ano` | evento | 0,2% |
| `conselho_dos_generais` | evento | 0,2% |
| `concorrente_quebrou` | evento | 0,2% |
| `contaram_do_caso` | evento | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `o_conselho_te_chama` | evento | 0,2% |
| `tentar_a_vida_na_europa` | evento | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `proposta_remota` | evento | 0,2% |
| `cura_de_doenca` | jogada | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `floresta_invadida` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `bonus_do_banco` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `shopping_lotado` | evento | 0,1% |
| `a_opa_da_rival` | evento | 0,1% |
| `reconciliacao` | npc | 0,1% |
| `filho_convocado` | evento | 0,1% |
| `negocio_em_crise` | evento | 0,1% |
| `reencontro_amigo_brigado` | evento | 0,1% |
| `sequestro_frustrado` | evento | 0,1% |
| `receita_recorde` | evento | 0,1% |
| `casamento_real` | evento | 0,1% |
| `cliente_perdeu_tudo` | evento | 0,1% |
| `vista_da_cobertura` | evento | 0,1% |
| `a_opa_do_fundo` | evento | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `pais_aposentados` | npc | 0,1% |
| `ferias_coletivas` | evento | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `teste_por_indicacao` | evento | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `o_processo_da_marca` | npc | 0,1% |
| `zona_franca` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `paparazzi_real` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `amor_gastador` | npc | 0,1% |
| `chantagem_do_caso` | npc | 0,1% |
| `lancamento` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `amor_viaja_demais` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `abrir_capital` | evento | 0,1% |
| `carta_branca` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `asteroide_com_seu_nome` | evento | 0,1% |
| `grupo_na_capa` | evento | 0,1% |
| `ficar_no_poder` | jogada | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `devedor_some` | npc | 0,1% |
| `royalties_secaram` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `fusao_de_iguais` | evento | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `parcela_da_tv` | npc | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `conselho_quer_ceo` | evento | 0,1% |
| `o_credito_sumiu` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `contaram_da_divida` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `fundar_uma_cidade` | jogada | 0,1% |
| `greve_do_piso` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `amor_saude_fragil` | npc | 0,0% |
| `bolsa_na_faculdade` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `cpi_da_campanha` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `quem_manda_se_voce_faltar` | evento | 0,0% |
| `acusado_de_nepotismo` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `caso_do_poderoso` | evento | 0,0% |
| `helicoptero_no_teto` | evento | 0,0% |
| `caramelo_envelhece` | npc | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `a_empresa_anda_sozinha` | evento | 0,0% |
| `cliente_duvidoso` | evento | 0,0% |
| `cliente_preso` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `restaurar_a_monarquia` | jogada | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `primeiro_balanco_na_bolsa` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 217 · **mudaram algo em pelo menos uma vida:** 218
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,5 · p10 54 · p25 61 · mediana 71 · p75 81 · p90 88

```
até 19                                        0,2%
20–29          █                              0,4%
30–39          █                              0,8%
40–49          █████                          4,0%
50–59          ██████████████████             15,5%
60–69          ██████████████████████████████ 26,3%
70–79          ████████████████████████████   25,0%
80–89          ███████████████████████        20,2%
90–99          ████████                       6,8%
100+           █                              0,8%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 237 mil · p25 R$ 707 mil · mediana R$ 3,4 milhões · p75 R$ 19 milhões · p90 R$ 66 milhões

```
negativo                                      0,6%
até 10 mil                                    0,6%
10–50 mil      █                              1,3%
50–200 mil     ████                           6,0%
200 mil–1 mi   ███████████████                22,4%
1–5 mi         █████████████████              24,6%
5 mi+          ██████████████████████████████ 44,6%
```

**Felicidade média ao longo da vida** — p10 61 · mediana 75 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,9%
50–59          █████                          6,9%
60–69          ██████████████████             24,3%
70–79          ██████████████████████████████ 40,5%
80+            ████████████████████           27,4%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,8 | R$ 765 mil | 68,0 | 58,1 | 161,6 | 66,0 | 100% | 52% |
| cautelosa | 82,8 🏆 | R$ 27 milhões 🏆 | 76,2 | 68,2 | 193,9 | 73,7 | 100% | 59% |
| arriscada | 58,4 | R$ 3,7 milhões | 80,4 🏆 | 54,6 | 142,3 | 104,6 | 100% | 50% |
| aleatoria | 75,1 | R$ 1,4 milhão | 70,7 | 65,0 | 135,7 | 79,4 | 100% | 48% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,0% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,0% — de um AVC, numa terça-feira sem graça
- 7,7% — de pneumonia, depois de teimar que era só uma gripe
- 6,5% — numa cirurgia simples que não foi tão simples
- 5,5% — de velhice, dormindo, num domingo depois do almoço
- 5,5% — de complicações de uma queda no banheiro
- 4,7% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
