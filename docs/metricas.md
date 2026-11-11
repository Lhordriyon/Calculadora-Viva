# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 701 eventos, 145 de personagens, 121 ações, 2061 escolhas, 239 linhas, 189 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| O estado é íntegro depois de cada ano: números finitos e nos limites, o dinheiro do mundo somando zero, as dívidas nos contratos, o tempo e a família coerentes, a clientela dentro do mercado (missão AAA) | ✅ | 0 problemas em 778947 anos (as vidas sorteadas e as de origem escolhida), mais as gerações das dinastias |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 4136746 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4741982 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 27 mil |
| Inflação no dinheiro parado | os preços | 99,9% | -R$ 437 mil |
| Acontecimentos | o mercado | 99,9% | -R$ 8,7 mil |
| Custo de vida | o mercado | 99,8% | -R$ 630 mil |
| Padrão de vida | o mercado | 99,7% | -R$ 5,3 milhões |
| Bico | o mercado | 99,6% | R$ 45 mil |
| Salário | o mercado | 96,8% | R$ 2,6 milhões |
| Juro da renda fixa | o governo | 86,6% | R$ 167 mil |
| Imposto | o governo | 84,6% | -R$ 66 mil |
| Cotação dos investimentos | os preços | 83,8% | R$ 1,3 milhão |
| Imposto mais baixo | o governo | 82,0% | R$ 67 mil |
| Auxílio | o governo | 81,6% | R$ 18 mil |
| Juros da dívida | o banco | 79,6% | -R$ 2,1 mil |
| Compras e vendas | o mercado | 73,7% | -R$ 2,3 milhões |
| Manutenção dos bens | o mercado | 73,7% | -R$ 793 mil |
| Gastos da velhice | o mercado | 65,8% | -R$ 816 mil |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 8,5% | 6,0 | 8,4% | 5,4% | 0,0% | 6,4% |
| cautelosa | 0,0% | 1,4% | 0,0 | 1,4% | 0,0% | 0,0% | 0,0% |
| arriscada | 94,5% | 24,4% | 1,0 | 12,0% | 3,0% | 18,8% | 18,3% |
| aleatoria | 45,1% | 17,8% | 1,0 | 10,6% | 2,4% | 9,4% | 10,3% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 13,1% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,93 anos com acordo (958 vezes) × 2,91 sem (685 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 20,2% de 3491 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 2,7% das vidas; 20,8% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 32,9% | R$ 48 mil | 708 | 0 (0) | 0,9% | — |
| cautelosa | 98,8% | 5,2 | 50,3% | R$ 814 mil | 13130 | 37 (27) | 1,2% | R$ 182 mil (9 vidas) |
| arriscada | 0,0% | — | 13,6% | R$ 9,4 mil | 152 | 118 (63) | 1,8% | R$ 212 milhões (26 vidas) |
| aleatoria | 85,4% | 2,4 | 15,4% | R$ 26 mil | 3311 | 1577 (835) | 1,2% | R$ 12 mil (13 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 98,8%, arriscada 0,0%, aleatoria 85,4% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,3% (126 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 190 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2789 | R$ 3,8 milhões | 0,4 |
| parte dos impostos | 1136 | R$ 1,7 bilhão | 0,8 |
| taxa da coroa | 1807 | R$ 29 bilhões | 0,3 |

A ilha: 38 vidas fundaram ou herdaram uma. População no fim: p10 2210, mediana 2764, p90 3163.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ❌ | 0,3 quedas por 100 anos com a taxa (1807 anos) × 0,4 com o salário (2789 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 38 ilhas; mediana de 2810 habitantes sem a taxa (30) e 1587 com 5 anos ou mais de taxa (3) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 169715 | -0,70 |
| regular | 343819 | -0,05 |
| prioridade | 190704 | +0,75 |

A tecnologia ao morrer: p10 42,4, mediana 49,9, p90 58,7. Descobertas por 100 vidas: a cura 17,1, o satélite 17,0, a patente 16,8; 29,2% das vidas veem uma. A fuga de cérebros: 25,2% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (169715 anos) · regular -0,05 por ano (343819 anos) · prioridade +0,75 por ano (190704 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,4 · mediana 49,9 · p90 58,7 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 29,2% das vidas; 89,0% de 5093 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 182584 | -0,84 |
| regular | 341308 | -0,01 |
| reforçada | 180346 | +0,85 |

A capacidade ao morrer: p10 42,9, mediana 49,6, p90 57,7. Encomendas por 100 vidas: 6,7 (624 entregas). Guerras por 100 vidas: 2,8, em 2,8% das vidas; acabaram em vitória 55, derrota 70 e cessar-fogo 145, com 2,7 anos em média. Pedidos de paz: 1; convocações: 67; 0,3% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,84 por ano (182584 anos) · regular -0,01 por ano (341308 anos) · reforçada +0,85 por ano (180346 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 2,8% das vidas; 90,8% de 283 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,3% de 4943 anos · forte: 2,5% de 4813 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ❌ | 0,92% em 3629 anos de guerra · 2,05% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ❌ | a mais longa: 11 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 400 em vida (100,0% com resposta) e 133 na herança (100,0%). De 139 herdeiros que começaram na fila, 79,9% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 33 | 66,7% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 51 | 52,9% | primeira 0 · cautelosa 0 · arriscada 5 · aleatoria 1 |
| Mudar a Constituição para mais um mandato | 6 | 100,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 3 |
| Restaurar a monarquia no plebiscito | 73 | 38,4% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ✅ | em vida 100,0% de 400 · na herança 100,0% de 133 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 84 tentativas, 58,3% deram certo |

## A rede (missão Ω1)

As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (`docs/auditoria-omega.md`). Nas vidas sorteadas, cada vida tem em média 13,6 pessoas diferentes, 0,33 ex, 1,57 irmãos (0,86 nascidos depois de quem joga) e 4,55 pessoas do trabalho.

| Portão | Situação | Valor |
|---|---|---|
| A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão | ✅ | ex em 26,4% · irmão em 80,1% |
| As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe | ✅ | 4,2 entradas por vida, com 13,6 pessoas por vida |
| A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada) | ✅ | ex que voltou 53 · colega que virou amigo 23 · romance do trabalho 49 |

## Os verbos sociais (missão Ω2)

Quando a resposta é de uma pessoa, ela decide pelo estado e pela memória dela e diz por quê (`decisao.ts`); o empréstimo entre pessoas é uma promissória, com parcela, atraso, quitação e calote (`promissorias.ts`). Nas vidas sorteadas: 16,9 respostas por vida, sim em 39,3%, e 47,2% delas com o porquê apontando um ano anterior.

| Portão | Situação | Valor |
|---|---|---|
| A pessoa decide: ≥ 60% das vidas têm um pedido respondido por alguém, e o sim fica entre 30% e 80% das respostas | ✅ | 65,9% das vidas · 16,9 respostas por vida · sim em 39,3% |
| O porquê cita o passado: ≥ 25% das respostas dizem a lembrança que pesou ("…, aos 31") ou a dívida em aberto | ✅ | 47,2% das respostas |
| O empréstimo entre pessoas acontece e acaba dos dois jeitos: em ≥ 10% das vidas, e dos que acabam, ≥ 50% quitados e ≥ 3% em calote | ✅ | em 34,7% das vidas (11929 empréstimos: 11606 pegos, 323 feitos) · 9035 quitados, 1305 calotes, 3395 parcelas atrasadas |

## Os projetos (missão Ω3)

Quem joga declara o que quer da vida; as etapas são condições do estado, e o fim vai para o livro com o começo de causa (`projetos.ts`). Por projeto, começados / conquistados: sair_das_dividas 1855 / 1481 · casa_propria 3841 / 2221 · ter_um_filho 2290 / 1797 · negocio_proprio 6851 / 78 · reparar_relacao 251 / 62 · cuidar_da_saude 3277 / 45 · primeiro_milhao 3398 / 2678 · casar 1078 / 748 · diploma 3264 / 542 · estrela 658 / 268 · imperio 861 / 34 · presidencia 1333 / 37 · familia_grande 688 / 513 · amor_da_vida 751 / 311 · fortuna 982 / 102 · lugar_no_mundo 952 / 946 · volta_ao_mundo 1215 / 460 · os_netos 317 / 125.

| Portão | Situação | Valor |
|---|---|---|
| Os planos existem: ≥ 40% das vidas começam um plano | ✅ | 74,7% das vidas · 3,39 planos por vida |
| Os planos acabam dos dois jeitos: dos que acabam, as conquistas ficam entre 20% e 80% | ✅ | 12448 conquistas, 24330 prazos vencidos, 6383 desistências, 86 sem tempo (conquista em 28,8%) |
| Todo plano acontece: cada um é começado e conquistado em alguma vida | ✅ | 18 de 18 |

## Os segredos (missão Ω4)

Quem joga esconde coisas de alguém; quem sabe pode contar pelos círculos (a família e o par, os amigos, os ex, o trabalho), e a notícia que chega ao alvo vira revelação, com quem contou e a causa (`segredos.ts`). Por tema, nascidos / contados ao alvo: caso 115 / 17 · divida 111 / 4 · festa 863 / 11 · esquema 890 / 209.

| Portão | Situação | Valor |
|---|---|---|
| Os segredos existem: ≥ 15% das vidas guardam um | ✅ | 18,7% das vidas · 0,20 por vida |
| A notícia corre: um boato (alguém que soube pela boca de outro) para cada 4 segredos ou mais | ✅ | 577 boatos para 1979 segredos · 241 chegaram a quem não devia · 208 chantagens |
| Os segredos acabam de todo jeito: contados, descobertos, confessados e calados, cada um em ≥ 5% dos que acabam | ✅ | contados 12,6% · descobertos 53,9% · confessados 18,1% · calados 15,5% (de 1760) |
| Todo segredo chega a quem não devia: cada tema nasce e é contado ao alvo em alguma vida | ✅ | 4 de 4 |

## Os capítulos (missão Ω5)

A peneira lê o livro de cada vida e reconhece os arcos com começo e fim, que a linha do tempo e o cartão mostram (`capitulos.ts`).

| Portão | Situação | Valor |
|---|---|---|
| A vida tem capítulos: ≥ 50% das vidas têm um arco reconhecido no livro | ✅ | 74,3% das vidas · 1,54 por vida · 18,2% com dois tipos ou mais |
| Todo tipo de capítulo acontece (o plano, o segredo, a volta, o calote, o favor e as pazes) | ✅ | plano 12532 · segredo 1488 · volta 51 · calote 1305 · favor 38 · pazes 12 |

## O caminho e o ritmo (missão Ω6)

A variedade das vidas medida pela estrutura causal (as causas dos pontos de virada e os capítulos, ao lado da assinatura do destino), os elos de causa distintos e o ritmo: depois de um ano pesado, as histórias leves ganham a vez (`diretor.ts › ritmoDoAno`).

| Portão | Situação | Valor |
|---|---|---|
| O caminho varia mais que o destino: as assinaturas do caminho (as causas dos pontos de virada, com a escolha, os capítulos e o arco do sonho) passam as do destino | ✅ | caminho 830 (sem o arco do sonho, 583) · destino 570 por 1.000 vidas · 49,4 elos causais por vida, 2836 distintos no túnel |
| A vida respira: depois de um ano pesado, o seguinte também é pesado em ≤ 10% das vezes | ✅ | 5,7% de 43838 anos pesados |

## O capitalismo com rosto (bloco H6)

A concorrente da empresa que quem joga cuida de perto tem nome e dono, e o gestor que chega com a empresa grande propõe a jogada do ano pelo jeito dele (diretoria.ts). Avisos do gestor que tinha razão: 25; gestores que foram para a concorrência: 0.

| Portão | Situação | Valor |
|---|---|---|
| A concorrência tem rosto: ≥ 60% de quem abre empresa conhece a rival pelo nome | ✅ | 100,0% |
| O rival que já era da vida (um ex, um amigo) existe: ≥ 1% de quem abre empresa | ✅ | 1,98% |
| O gestor chega em 15% a 40% das vidas com empresa | ✅ | 18,0% |
| Das propostas do gestor, as seguidas ficam entre 30% e 70% | ✅ | 49,1% de 1983 |
| Seguir o gestor não domina: o patrimônio mediano de quem mais seguiu fica abaixo de 1,5 vez o de quem mais recusou | ✅ | R$ 42 milhões contra R$ 47 milhões (167 e 193 vidas) |

## O sonho da vida (bloco S1)

Aos 15, a pergunta do que quer da vida (a estrela, o império, o topo do país); no primeiro namoro sério, a do amor (a casa cheia, o amor para a vida toda). Cada sonho é um projeto com cenas próprias e um fim que o cartão conta.

| Portão | Situação | Valor |
|---|---|---|
| Quase toda vida sonha: ≥ 60% das vidas que chegam aos 20 têm um sonho | ✅ | 91,2% |
| O sonho não é garantido: dos sonhos que acabaram, os realizados ficam entre 10% e 70% | ✅ | 19,8% de 14102 |
| Todo sonho se realiza em alguma vida | ✅ | 9 de 9 (amor_da_vida 311, estrela 268, familia_grande 513, fortuna 102, imperio 34, lugar_no_mundo 946, os_netos 125, presidencia 37, volta_ao_mundo 460) |

## O segundo ato (bloco S2)

O sonho realizado traz o dia do sonho (a cena do topo); o fim de qualquer sonho traz, no ano seguinte, a pergunta do que vem depois; e a segunda metade da vida tem sonhos próprios (a fortuna, o lugar no mundo, a volta ao mundo, os netos).

| Portão | Situação | Valor |
|---|---|---|
| O dia do sonho chega: ≥ 95% dos sonhos realizados (os que têm a cena) vivem o dia do sonho | ✅ | 97,9% de 1163 |
| Depois do sonho, a pergunta: ≥ 50% dos sonhos que acabaram chegam ao "e agora?" ou ao "sonho que ficou" | ✅ | 87,9% de 14102 |
| A segunda metade tem direção: ≥ 50% dos anos dos 50 em diante com um sonho de pé (eram 30%) | ✅ | 51,7% |

## O sonho que passa adiante (bloco S3)

O sonho que não veio pode ser contado a quem vem depois: o filho mais velho o carrega, e quem continua a história começa a vida com ele de pé. Medido nas gerações das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| O sonho passa adiante: alguma geração herdeira começa a vida com o sonho de quem veio antes (≥ 2% das herdeiras) | ✅ | 48,1% de 391 gerações herdeiras (3 gerações passaram um sonho adiante) |
| O sonho herdado se realiza em alguma vida | ✅ | 44 de 188 |

## A bolsa de verdade (bloco H7)

A empresa na bolsa emite ações (o dinheiro vai para o caixa e a parte de quem joga encolhe), recompra a maioria e toma a concorrente numa oferta hostil, sem pedir ao dono; sem a maioria, alguém pode comprar o controle dela.

| Portão | Situação | Valor |
|---|---|---|
| A oferta hostil acontece: ≥ 0,1% das vidas tentam tomar a concorrente na bolsa | ❌ | 0,07% |
| A oferta hostil nem sempre passa: das ofertas, as que passam ficam entre 30% e 85% | ✅ | 61,8% de 34 |
| Quem perde a maioria na bolsa pode perder a empresa: a oferta contra quem joga acontece (≥ 0,05% das vidas) | ✅ | 0,16% das vidas · recomprou 0, vendeu 1, brigou 19 |
| Emitir ações acontece: ≥ 0,2% das vidas | ✅ | 0,29% (recompras: 0) |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 28 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,28 ms | 1,5% | 32,7 KB | — | guerra, pais, moeda, pesquisa, empresa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,65 ms | 0,4% | 0,0 KB | exterior | pais, moeda, pesquisa, empresa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 5,41 ms | 3,4% | 59,1 KB | exterior, guerra | moeda, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, poder, coroa, regras, iniciativas, diretor |
| moeda (o dinheiro: a inflação que vai para quem emitiu, o caixa do governo, o câmbio, o crédito dos bancos e a emissão do Banco Central) | 0,71 ms | 0,5% | 31,3 KB | guerra, pais | empresa, bens, tesouro, dividas, personagens, regras, iniciativas, diretor |
| setores (os mercados de cada setor: a obra que fica pronta, a procura do ano e o preço que decide a obra do ano que vem) | 2,63 ms | 1,7% | 91,7 KB | pais | iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,21 ms | 0,1% | 0,3 KB | guerra, pais | empresa, poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,73 ms | 0,5% | 18,4 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 2,11 ms | 1,3% | 28,1 KB | pais, mercado | empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: o negócio do ano (vendas, custos, imposto, caixa, dividendos, obra), os empregos da cidade e a quebra) | 2,77 ms | 1,8% | 23,4 KB | exterior, guerra, pais, moeda, setores, pesquisa, mercado, economia | bens, tesouro, dividas, promissorias, corpo, personagens, carreira, poder, coroa, morte, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,28 ms | 0,8% | 14,7 KB | pais, moeda, mercado, economia, empresa | tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,35 ms | 0,2% | 2,5 KB | pais, moeda, economia, empresa, bens | dividas, promissorias, personagens, regras, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,47 ms | 0,3% | 0,3 KB | pais, moeda, economia, empresa, bens, tesouro | promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| promissorias (os empréstimos entre pessoas: a parcela, o atraso que magoa, a quitação e o calote) | 0,35 ms | 0,2% | 1,5 KB | pais, economia, empresa, bens, tesouro, dividas | personagens, segredos, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,05 ms | 0,0% | 0,0 KB | economia | corpo, personagens, projetos, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 2,12 ms | 1,4% | 21,7 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao | personagens, trabalho, carreira, poder, coroa, projetos, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 5,65 ms | 3,6% | 77,3 KB | exterior, guerra, pais, moeda, setores, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo | trabalho, carreira, poder, coroa, projetos, segredos, regras, morte, iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,24 ms | 0,2% | 1,5 KB | pais, setores, empresa, promissorias, personagens | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,53 ms | 0,3% | 2,0 KB | guerra, pais, pesquisa, empresa, bens, promissorias, corpo, personagens, trabalho | poder, coroa, projetos, morte, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 2,47 ms | 1,6% | 4,6 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,14 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, empresa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,05 ms | 0,0% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, promissorias, personagens | iniciativas, diretor |
| projetos (os projetos: a meta alcançada vira conquista, o prazo passado vira fracasso) | 1,93 ms | 1,2% | 2,5 KB | tudo o que veio antes | segredos, regras, morte, amor, iniciativas, diretor |
| segredos (os segredos: quem sabe pode contar, e a notícia que chega ao alvo agenda a revelação) | 2,64 ms | 1,7% | 0,0 KB | tudo o que veio antes | regras, morte, amor, iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 3,54 ms | 2,3% | 17,2 KB | pais, moeda, setores, bens, tesouro, dividas, privacao, corpo, personagens, projetos | iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 0,80 ms | 0,5% | 0,4 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa, projetos | iniciativas, diretor |
| amor (o amor que aparece e o namoro que esfria) | 0,13 ms | 0,1% | 0,0 KB | promissorias, corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 27,35 ms | 17,4% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 19,66 ms | 12,5% | 1,6 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 69,56 ms | 44,4% | — | — | — |

O save de uma vida (amostra de 1040): mediana 505 KB, p90 620 KB, máximo 779 KB; o livro é 97,3% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ✅ | 779 KB (mediana 505 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 156,81 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 55,1% | 24,1% | 15,0% | 5,4% | 0,4% |

Entre as vidas com filhos (44,9%), a média é de 1,60 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 20,8% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 23,5% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 53,0% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 904 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 9,31 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ❌ | 480,3 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 9,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 12,8% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,8% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,36 |
| Saturação V20 ≤ 95% | ✅ | 87,2% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 904 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 156,81 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 85,5% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 62,5% (168 dinastias, média de 3,3 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,86 (391 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 275 mil / R$ 403 mil / R$ 781 mil; p10 R$ 223 mil / R$ 185 mil / R$ 142 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 3,28% (p99 R$ 338 milhões, maior R$ 9,3 trilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,31% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 29,5% de 63,8% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 14,4% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 87,2% |
| Assinaturas sem regressão (≥ 918) | ❌ | 904 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ❌ | 480,3 |
| CPU por vida ≤ 30 ms | ❌ | 156,81 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 97,6% (10,3 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 70,1% de 3906 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (672), A festa do século (539), Pix para a cidade inteira (370), Uma estátua sua (259), Um conselho que diz não (239), Uma equipe para desmontar (166), Uma fundação com seu nome (165), Um mural de problemas (158), Bancar um presidente (156), Bancar quem quer sair (141), Tornar-se dispensável (137), Trazer a Copa do Mundo (131), Pagar a cura de uma doença (126), Um programa espacial (116), Tomar o poder (113), Restaurar a monarquia (87), Fundar uma cidade (82), Ficar no poder (76), Comprar a estatal (74), Fundar um país (35), Salvar o país da crise (32), Uma colônia em Marte (32).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 1 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 35,3% de 1958 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 16,4% delegaram, 72,4% centralizaram (641 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 41,7% (40,4 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (832), Bancar quem quer sair (412), Uma equipe para desmontar (411), Um mural de problemas (388), Tornar-se dispensável (292).
- **Na morte de quem manda:** a empresa perde em média 27,8% do valor; dependência p10 / mediana / p90: 30 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 7, maior 19 anos (7624 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 982 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 53,8% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 64,2% / 23,5% / 9,9% / 2,4% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 14,1 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,3%, o bloco liberal 24,2%, a aliança da ordem 24,9%, o centrão 24,6%; 8,3 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,7%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,58% × 1,87%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 85% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 2,91% contra 0,72% por ano (40365 e 55301 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ❌ | 1,23 votos por vida, 31,4% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 1,85 × 0,72 pontos do PIB por ano (147 e 161 governos); 95,4% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,1% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 200.230 | 1,9% | 8,2% | 4,9% | 82% | 21,0% | 20,5 | 58 | 55 | 50% |
| a aliança da ordem | 188.989 | 1,7% | 8,4% | 5,4% | 73% | 29,5% | 17,6 | 50 | 45 | 53% |
| o centrão | 187.087 | 2,1% | 8,3% | 4,9% | 85% | 25,1% | 21,4 | 50 | 50 | 55% |
| o bloco liberal | 183.869 | 2,6% | 8,6% | 3,3% | 81% | 29,7% | 22,1 | 43 | 50 | 51% |
| quem joga | 12.961 | 1,9% | 8,6% | 7,0% | 70% | 25,3% | 18,6 | 51 | 49 | 50% |
| o regime | 5.811 | 1,4% | 9,0% | 10,3% | 12% | 31,6% | 17,0 | 37 | 37 | 43% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,6% de 7411 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 4,7% fundiram, 3,7% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 3 anos; nas vidas jogadas, o maior grupo teve 2393 (p99 270) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,39 ponto em média (35589 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,53 na bolsa (4949 empresas-ano) × -0,00 fechadas (141835) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 48,1% de 37873 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,18 · mediana R$ 5,16 · p90 R$ 6,41 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,0% × 3,7% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,35 no agro (3892 empresas-ano) × -0,35 no comércio (26625), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 35,2%, acordo em 75,2%; 96,0% das sanções acabam em até 15 anos (mediana 4, p90 9) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,3% de 5313 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,87% × 0,15% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,74% × 0,35% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 75,9% de 395 governos; sanção depois de romper 35,2%, depois da visita 2,0% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 200.230 | 0,19% | 2,94% |
| a aliança da ordem | 188.989 | 1,91% | 0,35% |
| o centrão | 187.087 | 0,16% | 0,57% |
| o bloco liberal | 183.869 | 0,28% | 3,74% |
| quem joga | 12.961 | 2,17% | 3,43% |
| o regime | 5.811 | 3,84% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,830, Gini 0,529, população 193 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,799–0,868, Gini 0,482–0,562 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 7,5% · desigualdade_no_jornal 6,1% · idh_muito_alto 9,2% · idh_em_queda 3,5% · pais_envelhece 9,7% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,799 | 0,830 | 0,868 |
| Desigualdade (Gini) | 0,482 | 0,529 | 0,562 |
| População (milhões) | 180 | 193 | 206 |
| PIB per capita | R$ 119 mil | R$ 246 mil | R$ 537 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 53,0% / 87,2% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 62,2% |
| Efeito da memória (aleatória, V5 sem → com memória) | 56,3% → 48,5% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 904 (570) |
| Mobilidade: mesmo quintil da origem ao fim | 28,5% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,36 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 12,8% / 3,8% |
| Patrimônio p90/p10 | 262,0× (p10 R$ 238 mil, p90 R$ 62 milhões) |
| Desvio-padrão da felicidade média da vida | 9,31 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 43,7% |
| Toques por vida | 480,3 |
| Tempo de CPU por vida | 156,81 ms |
| Ações (fichas usadas) por vida | 154,7 |
| Mortes na família por vida | 4,9 |
| Pontos de virada que vêm do mundo (não do jogador) | 9,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 35,2 |
| Vidas que terminam com alguém para continuar a história | 85,5% (filho ou filha 41,5%, sobrinho ou sobrinha 42,3%, o par 0,7%, o amigo 1,0%) |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,3 / 62,5% / 35,7% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 3,3 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,86 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 63,8% |
| Entre quem abriu: quebrou / vendeu | 29,5% / 29,6% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2 milhão / R$ 36 milhões / R$ 338 milhões / R$ 9,3 trilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 26,71% / 3,28% / 0,31% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 14,4% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 62,4 / 154,7 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 275 mil | R$ 333 mil |
| moderado | R$ 185 mil | R$ 403 mil | R$ 689 mil |
| arrojado | R$ 142 mil | R$ 781 mil | R$ 2,9 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 808 | R$ 165 mil | R$ 1,7 milhão | R$ 36 milhões |
| moderado | 905 | R$ 157 mil | R$ 1,9 milhão | R$ 30 milhões |
| arrojado | 787 | R$ 188 mil | R$ 2,5 milhões | R$ 63 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 67,5 | R$ 1,4 milhão | 74,5 |
| pobre | 104 | 71,0 | R$ 1,7 milhão | 74,7 |
| remediada | 24 | 70,8 | R$ 1,7 milhão | 76,7 |
| media | 64 | 69,3 | R$ 3,1 milhões | 72,4 |
| rica | 64 | 69,9 | R$ 5,5 milhões | 74,5 |
| muito rica | 144 | 70,6 | R$ 23 milhões | 74,8 |
| bilionaria | 356 | 71,1 | R$ 2,1 bilhões | 76,1 |
| trilionaria | 276 | 71,1 | R$ 652 bilhões | 76,7 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 64% / 23% / 10% / 2% |
| Notícias do país por vida | 42,2 |
| Demissões por vida / vindas de uma recessão ou crise | 0,53 / 32,0% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 26 |
| Setor do último trabalho | serviço público 60% · serviços 13% · saúde 11% · cultura e internet 4% · comércio 3% · agro 2% · sem setor 2% · transporte e entregas 2% · construção 1% · tecnologia 1% · indústria 1% · finanças 0% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 23% | 35% | 45% | 53% | 74% | 82% | 87% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 32% | 21% | 18% | 17% | 13% |
| Q2 | 30% | 22% | 19% | 16% | 14% |
| Q3 | 23% | 25% | 19% | 19% | 14% |
| Q4 | 12% | 24% | 27% | 24% | 14% |
| Q5 | 4% | 8% | 18% | 24% | 46% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 69,8 | R$ 1,6 milhão | 73,3 |
| família pobre | 24% | 70,2 | R$ 1,5 milhão | 73,5 |
| família remediada | 20% | 70,9 | R$ 2 milhão | 73,7 |
| classe média | 18% | 70,1 | R$ 2,7 milhões | 73,3 |
| família rica | 13% | 70,6 | R$ 5,1 milhões | 73,9 |
| família muito rica | 13% | 70,1 | R$ 23 milhões | 74,3 |
| família bilionária | 3% | 73,1 | R$ 3,5 bilhões | 76,6 |

## Repetição

- **Dentro de uma vida:** 9,0% das aparições repetem uma instância já vista na mesma vida; pior vida: 33,3%.
- **Texto repetido entre vidas:** 27,8% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,3 · `aposentadoria` 1,6 · `irmao_nasce` 0,5 · `avo_mesada_escondida#avo` 0,4 · `o_sonho_que_ficou` 0,4 · `namoro_esfriou#amor` 0,3

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 169 de 358 (47%) · típico 168 de 358 (47%) · rico 182 de 358 (51%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `ex_liga_de_madrugada`, `ex_nas_redes`, `ex_cobra`, `mais_um_filho`, `irmao_mais_velho_defende`, `cobranca_da_magoa`, `chefe_hora_extra`, `chefe_magoado_cobra`, `colega_rouba_ideia`, `romance_no_trabalho`, `colega_de_licenca`, `o_caso_vem_a_tona`, `devedor_some`, `cobranca_do_filho`, `planilha_das_dividas`, `casamento_dos_outros`, `o_primeiro_palco`, `o_video_que_viralizou`, `o_debate_na_tv`, `o_quarto_vazio`, `o_natal_barulhento`, `mais_um_para_a_mesa`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `contaram_do_caso`, `a_divida_escondida`, `a_divida_vem_a_tona`, `a_festa_escondida`, `a_foto_da_festa`, `contaram_do_esquema`, `a_auditoria`, `o_neto_no_fim_de_semana`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `conglomerado_com_desconto`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `o_recall`, `a_licitacao`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `a_opa_da_rival`, `a_opa_do_fundo`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `o_processo_da_marca`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `intercambio`, `burnout`, `pais_envelhecem`, `rebaixamento`, `fim_carreira`, `passou_mal_de_novo`, `pressao_carreira`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `briga_de_casal`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_quadro_de_tarefas`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `segunda_chance`, `irmao_separou`, `fazer_as_pazes`, `chefe_elogia`, `chefe_magoado_cobra`, `cobrar_divida`, `devedor_some`, `ajudar_com_a_casa`, `festa_de_80`, `as_criancas_perguntam`, `amor_vai_embora`, `o_preco_do_imperio`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `quartel_sem_verba`, `edital_da_ciencia`, `o_laboratorio_apaga_a_luz`, `contaram_do_caso`, `chantagem_do_caso`, `confessar_o_caso`, `a_divida_vem_a_tona`, `contaram_da_divida`, `confessar_a_divida`, `contaram_da_festa`, `o_dia_do_sonho_imperio`, `o_dia_do_sonho_presidencia`, `a_promessa_cobrada`, `o_neto_no_fim_de_semana`, `o_neto_pergunta_do_sonho`, `renegociar_cartao`, `treinar_no_clube`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `tentar_a_vida_na_europa`, `transito_de_sp`, `mestrado_fora`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `fila_do_emprego`, `ex_aluno`, `proposta_remota`, `robos_na_fabrica`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `vaga_na_empresa_dele`, `giz_do_proprio_bolso`, `filial_fechando`, `vendas_recorde`, `turno_extra_na_fabrica`, `layoff_por_email`, `clientes_em_panico`, `pedreiro_vale_ouro`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `acoes_da_startup`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `construtora_quebrou`, `lista_dos_mais_ricos`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `salvar_o_pais`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `inauguracao_da_cidade`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `cidade_alagou`, `prefeito_da_cidade_nova`, `dono_do_brasil`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `oferta_pela_subsidiaria`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `celular_dos_pais`, `segredo_de_familia`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `sucessao_na_empresa`, `conselho_quer_ceo`, `greve_do_piso`, `o_recall`, `imposto_do_ano`, `receita_recorde`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `peneira_do_sobrenome`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `tradutor_da_familia`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `o_preco_remarcado`, `a_impressora_ligada`, `o_credito_sumiu`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `deploy_de_sexta`, `proposta_em_dolar`, `aluno_impossivel`, `pane_no_voo`, `final_da_copa`, `turne_nacional`, `livro_viralizou`, `critico_no_salao`, `cliente_perdeu_tudo`, `noite_de_corridas`, `obra_atrasada`, `promocao_em_outra_cidade`, `fa_obcecado`, `concorrente_quebrou`, `a_parcela_do_banco`, `faltou_gente`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `carro_de_luxo_na_rua`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `dono_do_clube`, `exportacao_bate_recorde`, `sancao_parou_o_porto`, `ameaca_de_sancao`, `importado_invadiu`, `a_opa_da_rival`, `a_opa_do_fundo`, `o_conselho_te_chama`, `juros_altos_na_fatura`, `divida_publica_assusta`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `o_cartel_vazou`, `o_rival_quer_comprar`, `o_processo_da_marca`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Apresentados por vida:** 62,4 · **com causa anterior (cadeia):** 84,4 · **maior distância causa→consequência:** 48,4 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `o_que_voce_quer_da_vida` | evento | 99,8% |
| `primeiro_dia_escola` | evento | 99,4% |
| `namoro` | evento | 99,1% |
| `luto` | npc | 94,7% |
| `enem` | evento | 90,5% |
| `trabalho_grande` | acao | 73,5% |
| `o_sonho_que_ficou` | evento | 72,8% |
| `programa_junto` | acao | 70,0% |
| `casamento_do_irmao` | evento | 67,5% |
| `primeiro_voto` | evento | 66,4% |
| `aposentadoria` | evento | 65,2% |
| `curso_online` | acao | 63,6% |
| `bico_adulto` | acao | 62,1% |
| `correr_no_quintal` | acao | 60,6% |
| `ler_gibi` | acao | 57,7% |
| `parquinho` | acao | 57,7% |
| `formatura` | evento | 56,4% |
| `almoco_domingo` | acao | 54,2% |
| `tocar_empresa` | acao | 54,1% |
| `o_que_voce_quer_do_amor` | evento | 53,0% |
| `irmao_nasce` | evento | 53,0% |
| `conversar_de_verdade` | acao | 52,8% |
| `padrinho_do_sobrinho` | evento | 51,5% |
| `cuidar_da_doenca` | npc | 51,3% |
| `saudade_de_voce` | npc | 50,7% |
| `mochilao` | acao | 49,5% |
| `avo_mesada_escondida` | npc | 48,4% |
| `dizer_umas_verdades` | acao | 47,1% |
| `presente_certo` | acao | 47,1% |
| `pedir_conselho` | acao | 46,9% |
| `visitar_familia` | acao | 46,9% |
| `ligar_amigo` | acao | 46,5% |
| `oferecer_ajuda` | acao | 45,8% |
| `estudar_concurso` | acao | 45,1% |
| `eleicao_geral` | evento | 45,0% |
| `primeiro_emprego` | evento | 42,0% |
| `pos_graduacao` | acao | 41,6% |
| `filho_adolescente` | evento | 41,6% |
| `doente_crianca` | npc | 41,2% |
| `demissao` | evento | 41,2% |
| `paquerar` | acao | 41,2% |
| `pedir_um_pix` | acao | 40,5% |
| `academia` | acao | 39,6% |
| `baile_terceira_idade` | acao | 39,3% |
| `caminhada` | acao | 39,1% |
| `pedir_emprestado` | acao | 38,9% |
| `reclama_que_voce_sumiu` | npc | 38,8% |
| `esperou_por_voce` | npc | 38,6% |
| `namoro_esfriou` | evento | 38,1% |
| `vontade_ver_o_mar` | npc | 38,1% |
| `estudar_escola` | acao | 35,8% |
| `ouvir_historia` | acao | 35,8% |
| `briga_com_o_irmao` | evento | 35,4% |
| `filho_formatura` | evento | 34,6% |
| `ler_livros` | acao | 34,2% |
| `hidro_com_a_turma` | acao | 33,7% |
| `viagem_la_para_fora` | evento | 33,5% |
| `rabiscar_parede` | acao | 33,2% |
| `vontade_de_um_bicho` | npc | 33,1% |
| `correr` | acao | 33,0% |
| `estudar_enem` | acao | 31,9% |
| `perguntar_porque` | acao | 31,9% |
| `perdeu_emprego_na_crise` | npc | 31,9% |
| `cupido_do_irmao` | acao | 31,0% |
| `videogame_do_amigo` | acao | 30,9% |
| `balde_da_pracinha` | evento | 30,8% |
| `creche_ou_vo` | evento | 30,4% |
| `estudar_faculdade` | acao | 30,0% |
| `role` | acao | 29,9% |
| `guardar_dinheiro` | acao | 29,8% |
| `bullying_recreio` | evento | 29,6% |
| `falando_bem_de_voce` | npc | 29,4% |
| `estudar_tabuada` | acao | 29,3% |
| `primeiro_investimento` | evento | 29,3% |
| `cuidar_de_doente` | acao | 29,2% |
| `pedir_desculpas` | acao | 29,2% |
| `check_up` | acao | 29,1% |
| `natacao_no_clube` | acao | 28,4% |
| `pre_escola` | evento | 28,1% |
| `ajudar_em_casa` | acao | 28,1% |
| `a_crise_dos_cinquenta` | evento | 28,1% |
| `amigo_em_apuros` | npc | 27,7% |
| `bilhete_carinhoso` | npc | 27,3% |
| `acidente_em_casa` | evento | 26,8% |
| `encontro` | acao | 26,2% |
| `vontade_viagem_com_amigo` | npc | 26,2% |
| `piada_no_grupo` | npc | 26,0% |
| `viagem_realizada` | evento | 25,9% |
| `festa_da_cidade` | acao | 25,3% |
| `visitar_o_tumulo` | acao | 24,8% |
| `socorro_com_as_criancas` | acao | 24,7% |
| `pelada` | acao | 24,6% |
| `perdeu_aniversario` | npc | 24,6% |
| `show_no_estadio` | acao | 24,5% |
| `copa_do_mundo` | evento | 24,4% |
| `vontade_voltar_a_terra` | npc | 23,9% |
| `festa_80` | evento | 23,7% |
| `historias_ou_telas` | evento | 23,3% |
| `amor_quer_casar` | npc | 23,2% |
| `cachorro_caramelo` | evento | 23,2% |
| `viagem_dos_sonhos` | evento | 22,9% |
| `primeiro_celular` | evento | 22,6% |
| `e_agora` | evento | 22,6% |
| `bico_adolescente` | acao | 22,3% |
| `vacina_no_posto` | evento | 22,3% |
| `primeiro_beijo` | evento | 22,1% |
| `curso_nota_alta` | evento | 22,1% |
| `avo_conta_historias` | npc | 21,6% |
| `investir_tesouro` | acao | 21,5% |
| `rebalancear` | acao | 21,2% |
| `colesterol_alto` | evento | 21,1% |
| `o_primeiro_palco` | evento | 20,9% |
| `casamento` | npc | 20,6% |
| `festa_junina` | evento | 20,6% |
| `cursinho_pago` | acao | 20,5% |
| `esporte_depois_da_aula` | evento | 20,3% |
| `cozinhar_com_a_avo` | acao | 20,1% |
| `futebol_de_varzea` | acao | 19,8% |
| `emprego_saude` | evento | 19,7% |
| `tentar_um_filho` | acao | 19,6% |
| `festa_tema` | evento | 19,5% |
| `amigo_pede_dinheiro` | evento | 19,5% |
| `hora_extra` | acao | 19,5% |
| `cortar_gastos` | acao | 19,3% |
| `empresa_quebrou` | evento | 19,1% |
| `tempo_com_amor` | acao | 19,0% |
| `golpe_pix` | evento | 18,8% |
| `banda_garagem` | evento | 18,6% |
| `salario_em_dolar` | evento | 18,4% |
| `carro` | evento | 18,2% |
| `primeira_palavra` | evento | 18,1% |
| `pisa_em_ovos` | npc | 18,1% |
| `oportunidade_de_negocio` | evento | 18,1% |
| `mesada` | evento | 17,9% |
| `vender_doce` | acao | 17,9% |
| `doar_sangue` | evento | 17,8% |
| `bet` | evento | 17,7% |
| `voltar_a_estudar` | acao | 17,6% |
| `previdencia` | acao | 17,6% |
| `viajar_com_o_amigo` | acao | 17,4% |
| `feira_ciencias` | evento | 17,3% |
| `pai_ausente_volta` | npc | 17,2% |
| `filho` | npc | 17,2% |
| `pelada_de_quinta` | evento | 17,1% |
| `investimento_furado` | evento | 17,1% |
| `o_bebe_chegou` | evento | 16,7% |
| `mais_um_filho` | npc | 16,4% |
| `largar_tudo` | evento | 16,2% |
| `crise_la_fora` | evento | 16,2% |
| `entregas` | acao | 15,8% |
| `criptomoeda` | evento | 15,8% |
| `tempo_com_filho` | acao | 15,7% |
| `curso_nota_media` | evento | 15,4% |
| `casa_dos_pais` | evento | 15,3% |
| `a_festa_escondida` | evento | 15,1% |
| `data_da_partida` | evento | 15,1% |
| `ingles_crianca` | acao | 15,0% |
| `reforma_da_casa` | evento | 14,9% |
| `catapora` | evento | 14,9% |
| `ceia_de_natal` | evento | 14,7% |
| `vape_festa` | evento | 14,6% |
| `subir_de_padrao` | evento | 14,5% |
| `tatuagem` | evento | 14,5% |
| `vaquinha_do_vizinho` | evento | 14,3% |
| `desempregado` | evento | 14,3% |
| `ciumes_do_irmao` | evento | 14,3% |
| `vontade_ver_o_neto` | npc | 14,2% |
| `hobby_horta` | evento | 14,2% |
| `pede_ajuda` | npc | 14,2% |
| `orgulho_da_formatura` | npc | 14,2% |
| `fila_de_pedidos` | evento | 14,1% |
| `filho_desenho` | npc | 14,0% |
| `reencontro_da_turma` | evento | 14,0% |
| `sair_de_casa` | evento | 13,8% |
| `vizinho_barulhento` | evento | 13,8% |
| `pensar_em_adotar` | evento | 13,8% |
| `bolao_do_trabalho` | evento | 13,7% |
| `sao_joao` | acao | 13,6% |
| `fome_no_fim_do_mes` | evento | 13,3% |
| `proposta_na_expansao` | evento | 12,9% |
| `heranca_do_tio` | evento | 12,9% |
| `leu_antes_dos_colegas` | evento | 12,8% |
| `franquia` | evento | 12,7% |
| `irmao_mora_longe` | evento | 12,7% |
| `juros_compostos` | evento | 12,7% |
| `pede_um_favor_a_voce` | npc | 12,7% |
| `assalto_na_rua` | evento | 12,5% |
| `primeiro_cupom` | evento | 12,3% |
| `ceu_de_fumaca` | evento | 12,3% |
| `praia` | acao | 12,3% |
| `o_esquema_do_colega` | evento | 12,3% |
| `amigo_devolve` | npc | 11,9% |
| `fazenda_a_venda` | evento | 11,8% |
| `balcao_negocio` | acao | 11,8% |
| `moeda_digital` | evento | 11,7% |
| `festa_de_sao_joao` | evento | 11,5% |
| `aula_de_musica` | evento | 11,5% |
| `filho_imitacao` | npc | 11,4% |
| `a_vacina_no_posto` | evento | 11,4% |
| `levar_ao_mar` | acao | 11,4% |
| `bateu_o_carro` | evento | 11,3% |
| `surpresa_do_amor` | npc | 11,3% |
| `o_contrato_que_pode_tudo` | evento | 11,3% |
| `mudar_para_a_praia` | evento | 11,3% |
| `o_mapa_na_parede` | evento | 11,3% |
| `bloco_de_carnaval` | evento | 11,3% |
| `o_primeiro_comicio` | evento | 11,3% |
| `plano_de_negocios` | evento | 11,2% |
| `cofrinho` | acao | 11,0% |
| `chimarrao` | acao | 11,0% |
| `cripto_fomo` | evento | 11,0% |
| `hidroginastica` | evento | 10,9% |
| `reencontro_amigo` | evento | 10,9% |
| `o_quarto_vazio` | evento | 10,9% |
| `carteira_da_diarista` | evento | 10,8% |
| `brigas_de_madrugada` | evento | 10,7% |
| `casa_propria` | evento | 10,7% |
| `voltar_estudar` | evento | 10,7% |
| `entregador_chuva` | evento | 10,3% |
| `corte_de_salario` | evento | 10,3% |
| `baile_da_terceira_idade` | evento | 10,2% |
| `recomecar_amor` | acao | 10,2% |
| `cirurgia_de_catarata` | evento | 10,1% |
| `brincar_com_irmao_avo` | acao | 10,1% |
| `mais_um_para_a_mesa` | evento | 10,1% |
| `feira_de_ciencias` | evento | 10,1% |
| `aniversario_da_infancia` | evento | 10,0% |
| `sovina_ou_sabio` | evento | 10,0% |
| `reuniao_de_condominio` | evento | 10,0% |
| `imposto_alto_no_contracheque` | evento | 10,0% |
| `esporte_escola` | acao | 9,9% |
| `produto_viralizou` | evento | 9,7% |
| `pais_envelhece` | evento | 9,7% |
| `imposto_baixo_sobrou` | evento | 9,7% |
| `imovel_valorizou` | evento | 9,6% |
| `negocio_no_aperto` | evento | 9,5% |
| `peneira` | evento | 9,5% |
| `quarto_dividido` | evento | 9,4% |
| `maratona` | evento | 9,4% |
| `comer_tudo` | acao | 9,3% |
| `casa_cheia` | evento | 9,3% |
| `alugueis_dos_fundos` | evento | 9,3% |
| `convite_para_palestrar` | evento | 9,3% |
| `alavancagem` | evento | 9,3% |
| `investimento_rotina` | evento | 9,2% |
| `colo_da_avo` | acao | 9,2% |
| `idh_muito_alto` | evento | 9,2% |
| `brincar_com_o_pai` | acao | 9,2% |
| `separacao_dos_pais` | evento | 9,1% |
| `escrever_memorias` | evento | 9,1% |
| `boi_bumba` | acao | 9,1% |
| `conteudo_extra` | acao | 9,1% |
| `casamento_na_igreja` | npc | 9,0% |
| `brincar_na_rua` | acao | 8,9% |
| `multa_e_batida` | evento | 8,9% |
| `convite_do_luxo` | evento | 8,8% |
| `peito_chiando` | evento | 8,8% |
| `golpe_do_falso_neto` | evento | 8,7% |
| `concorrente_gigante` | evento | 8,7% |
| `a_proposta_do_gestor` | npc | 8,7% |
| `o_natal_barulhento` | evento | 8,5% |
| `dolar_barato` | evento | 8,5% |
| `faculdade_a_noite` | acao | 8,4% |
| `retirada_demais` | evento | 8,4% |
| `brincar_amigos` | acao | 8,3% |
| `gerente_do_banco` | evento | 8,3% |
| `casa_na_praia` | evento | 8,2% |
| `sabado_com_os_sobrinhos` | evento | 8,2% |
| `amor_piada_interna` | npc | 8,1% |
| `vontade_casa_propria` | npc | 8,0% |
| `passear_de_carrinho` | acao | 8,0% |
| `pobreza_na_porta` | evento | 8,0% |
| `investidor_anjo` | evento | 8,0% |
| `mudanca_de_escola` | evento | 8,0% |
| `testamento` | evento | 8,0% |
| `irmao_mais_velho_defende` | evento | 8,0% |
| `o_video_que_viralizou` | evento | 8,0% |
| `promocao` | evento | 7,9% |
| `vaga_sobrando` | evento | 7,8% |
| `greve_dos_onibus` | evento | 7,8% |
| `bolsa_la_fora` | evento | 7,8% |
| `seca_no_sertao` | evento | 7,7% |
| `compra_por_impulso` | evento | 7,7% |
| `juros_baixos_euforia` | evento | 7,7% |
| `pular_corda` | acao | 7,7% |
| `rua_tranquila` | evento | 7,6% |
| `dente_de_leite` | evento | 7,6% |
| `remorso_aperta` | evento | 7,6% |
| `separacao` | evento | 7,6% |
| `pib_recorde` | evento | 7,5% |
| `bolsa_subiu_sem_voce` | evento | 7,4% |
| `levar_a_terra_natal` | acao | 7,3% |
| `tocar_no_bar` | acao | 7,3% |
| `bolsa_de_estudos` | evento | 7,3% |
| `voce_mudou` | npc | 7,3% |
| `ciume_do_bebe_novo` | evento | 7,2% |
| `amor_proposta_fora` | npc | 7,2% |
| `filho_nao_veio` | npc | 7,1% |
| `mae_quer_morar_junto` | npc | 7,1% |
| `cartao_credito` | evento | 7,1% |
| `consorcio` | evento | 7,1% |
| `cheia_do_rio` | evento | 7,1% |
| `apartamento_na_planta` | evento | 7,0% |
| `nome_sujo` | evento | 7,0% |
| `figurinha_repetida` | acao | 7,0% |
| `soltar_pipa` | acao | 6,9% |
| `retiro_da_igreja` | evento | 6,8% |
| `fundo_da_familia` | npc | 6,8% |
| `pedido_de_casamento` | acao | 6,8% |
| `o_debate_na_tv` | evento | 6,8% |
| `a_foto_da_festa` | evento | 6,8% |
| `pedem_sua_opiniao` | evento | 6,8% |
| `fugir_inflacao` | acao | 6,7% |
| `ouvido_para_musica` | evento | 6,7% |
| `parar_de_fumar` | acao | 6,7% |
| `o_padrinho_politico` | evento | 6,7% |
| `queda` | evento | 6,7% |
| `irmao_doente` | evento | 6,7% |
| `olimpiada_matematica` | evento | 6,6% |
| `o_rival_levou_seu_gerente` | npc | 6,6% |
| `apagao_no_morro` | evento | 6,6% |
| `assalto_no_onibus` | evento | 6,6% |
| `crise_40` | evento | 6,6% |
| `ressaca_do_mar` | evento | 6,6% |
| `socio_sumiu` | evento | 6,5% |
| `festival_do_boi` | evento | 6,5% |
| `padrao_de_vida` | evento | 6,4% |
| `inquilino_sumiu` | evento | 6,4% |
| `ponto_comercial` | evento | 6,4% |
| `propina_da_empreiteira` | evento | 6,4% |
| `pousada_na_praia` | evento | 6,3% |
| `noite_de_stand_up` | evento | 6,2% |
| `chefe_novo` | evento | 6,2% |
| `juros_altos_rendendo` | evento | 6,2% |
| `dolar_disparou` | evento | 6,2% |
| `fiscalizacao` | evento | 6,1% |
| `briga_em_casa` | npc | 6,1% |
| `desigualdade_no_jornal` | evento | 6,1% |
| `ninguem_conhece` | evento | 6,0% |
| `geladeira_vazia` | evento | 6,0% |
| `a_volta_ao_mundo` | evento | 6,0% |
| `inquilino_dos_sonhos` | evento | 6,0% |
| `netos` | evento | 5,9% |
| `cachoeira` | acao | 5,9% |
| `nao_acredita_mais` | npc | 5,9% |
| `edital_de_cultura` | evento | 5,9% |
| `apartamento_decorado` | evento | 5,9% |
| `a_engenheira_saiu` | evento | 5,8% |
| `vender_doce_nato` | acao | 5,8% |
| `estatua` | jogada | 5,8% |
| `blitz_toda_noite` | evento | 5,6% |
| `paquerar_timido` | acao | 5,5% |
| `geada_no_sul` | evento | 5,5% |
| `pede_emprestado_a_voce` | npc | 5,5% |
| `cidadania_italiana` | evento | 5,5% |
| `enchente_na_rua` | evento | 5,5% |
| `faculdade_vida` | evento | 5,4% |
| `aposentadoria_ativa` | evento | 5,4% |
| `operacao_policial` | evento | 5,4% |
| `cripto_disparou` | evento | 5,4% |
| `mei_negocio` | evento | 5,3% |
| `primeiro_container` | evento | 5,3% |
| `desemprego_em_alta` | evento | 5,3% |
| `filho_saude_fragil` | npc | 5,3% |
| `titulo_eleitor` | evento | 5,2% |
| `atendimento_robo` | evento | 5,2% |
| `festa_sem_pais` | evento | 5,1% |
| `chefe_hora_extra` | npc | 5,1% |
| `o_dia_do_sonho_familia_grande` | evento | 5,1% |
| `pescaria_no_pantanal` | evento | 5,1% |
| `o_partido_bate_na_porta` | evento | 5,1% |
| `vo_receita` | evento | 5,0% |
| `merenda` | evento | 5,0% |
| `briga_dos_pais` | evento | 5,0% |
| `contas_do_milhao` | evento | 5,0% |
| `herdeiro_gastao` | evento | 4,9% |
| `a_aposta_da_fortuna` | evento | 4,8% |
| `votacao_polemica` | evento | 4,8% |
| `curso_nota_baixa` | evento | 4,8% |
| `festa_surpresa` | evento | 4,7% |
| `pressao_alta` | evento | 4,6% |
| `concurso_lotado` | evento | 4,6% |
| `vo_partiu` | npc | 4,6% |
| `luto_do_bicho` | npc | 4,6% |
| `auxilio_na_conta` | evento | 4,6% |
| `festa_do_seculo` | jogada | 4,5% |
| `academia_de_janeiro` | evento | 4,5% |
| `escola_publica_boa` | evento | 4,4% |
| `asma_na_educacao_fisica` | evento | 4,4% |
| `filho_cuida` | npc | 4,4% |
| `mutirao_de_cirurgias` | evento | 4,4% |
| `socio_da_patente` | evento | 4,4% |
| `conselho_que_diz_nao` | jogada | 4,3% |
| `festa_vazou` | evento | 4,3% |
| `plantao_lotado` | evento | 4,2% |
| `chefe_injusto` | evento | 4,2% |
| `o_restaurante_do_primeiro_encontro` | evento | 4,2% |
| `briga_na_cozinha` | evento | 4,2% |
| `filho_primeiro_salario` | npc | 4,2% |
| `escola_de_samba` | jogada | 4,1% |
| `assembleia_do_predio` | evento | 4,1% |
| `proposta_de_compra` | evento | 4,1% |
| `adocao_chegou` | evento | 4,0% |
| `estatua_pichada` | evento | 4,0% |
| `a_turne_ou_a_casa` | evento | 4,0% |
| `a_aposta_escondida` | evento | 4,0% |
| `comecar_terapia` | evento | 4,0% |
| `bico_na_expansao` | evento | 4,0% |
| `chaves_do_apartamento` | evento | 4,0% |
| `grupo_de_jovens` | evento | 4,0% |
| `casamento_do_filho` | evento | 4,0% |
| `cripto_de_novo` | acao | 4,0% |
| `trabalho_do_pai` | acao | 4,0% |
| `doenca_de_quem_ama` | evento | 4,0% |
| `obra_grande_no_norte` | evento | 4,0% |
| `emprestimo_ao_irmao` | evento | 3,9% |
| `mensalidade_da_escola` | npc | 3,9% |
| `processo_trabalhista` | evento | 3,9% |
| `vicio_aposta` | evento | 3,9% |
| `um_bicho_para_o_filho` | acao | 3,8% |
| `o_lugar_que_voce_viu` | evento | 3,8% |
| `crise_de_ansiedade` | evento | 3,8% |
| `olimpiada` | acao | 3,7% |
| `romance_no_trabalho` | evento | 3,7% |
| `pais_na_crise` | npc | 3,7% |
| `pescaria_no_rio` | evento | 3,6% |
| `satelite_na_tv` | evento | 3,6% |
| `idh_em_queda` | evento | 3,5% |
| `festival_lotado` | evento | 3,5% |
| `blindar_contas` | acao | 3,4% |
| `cobranca_de_notas` | npc | 3,4% |
| `prova_concurso` | evento | 3,4% |
| `a_divida_escondida` | evento | 3,4% |
| `natal_com_politica` | evento | 3,4% |
| `moto_na_chuva` | evento | 3,3% |
| `excursao_ao_mar` | acao | 3,3% |
| `bolsa_derreteu` | evento | 3,3% |
| `setor_aquecido` | evento | 3,3% |
| `inflacao_no_mercado` | evento | 3,3% |
| `crescer_devagar` | evento | 3,2% |
| `heranca` | evento | 3,2% |
| `funcionario_genial` | evento | 3,2% |
| `family_office` | evento | 3,2% |
| `ajudar_na_roca` | acao | 3,1% |
| `burnout_empresa` | evento | 3,1% |
| `namorar_depois_dos_60` | evento | 3,1% |
| `balcao_da_familia` | evento | 3,0% |
| `ex_nas_redes` | evento | 3,0% |
| `concorrente_de_fora` | evento | 3,0% |
| `filho_passou_longe` | npc | 3,0% |
| `marca_em_alta` | evento | 3,0% |
| `festa_de_15` | evento | 3,0% |
| `ex_reencontro` | evento | 3,0% |
| `pais_separados_natal` | evento | 3,0% |
| `colega_rouba_ideia` | npc | 3,0% |
| `greve_dos_professores` | evento | 3,0% |
| `a_crise_do_setimo_ano` | evento | 3,0% |
| `cobranca_do_casamento` | npc | 2,9% |
| `o_dia_do_sonho_amor_da_vida` | evento | 2,9% |
| `balcao_de_crianca` | evento | 2,9% |
| `escolheu_bem` | npc | 2,9% |
| `terapia` | acao | 2,9% |
| `confeitaria_da_vo` | evento | 2,9% |
| `mutirao_da_laje` | evento | 2,9% |
| `qualidade_premiada` | evento | 2,9% |
| `greve_do_servidor` | evento | 2,9% |
| `agro_na_cidade` | evento | 2,9% |
| `vender_picole` | acao | 2,8% |
| `alguem_especial` | evento | 2,8% |
| `aprovado_concurso_estudo` | evento | 2,8% |
| `bater_o_pe_com_o_chefe` | evento | 2,8% |
| `clinica_particular_contrata` | evento | 2,8% |
| `promessa_da_mae` | evento | 2,8% |
| `ano_no_prejuizo` | evento | 2,8% |
| `depois_do_cargo` | evento | 2,8% |
| `joelho_da_pelada` | evento | 2,8% |
| `obra_ou_hospital` | evento | 2,8% |
| `amigo_pede_de_novo` | npc | 2,8% |
| `netos_nas_ferias` | evento | 2,7% |
| `posto_que_funciona` | evento | 2,7% |
| `o_dia_do_sonho_estrela` | evento | 2,7% |
| `enchente_na_cidade` | evento | 2,7% |
| `cuidar_netos` | acao | 2,7% |
| `piramide_no_grupo` | npc | 2,7% |
| `viralizou` | evento | 2,7% |
| `filho_quer_carro` | evento | 2,6% |
| `a_rede_na_varanda_dos_outros` | evento | 2,6% |
| `depois_da_venda` | evento | 2,6% |
| `sociedade_amigo` | evento | 2,6% |
| `tentacao_no_trabalho` | evento | 2,6% |
| `cobra_voce` | npc | 2,6% |
| `show_no_bar` | evento | 2,6% |
| `cripto_derreteu` | evento | 2,6% |
| `confessar_o_esquema` | acao | 2,5% |
| `convite_para_candidatura` | evento | 2,5% |
| `la_fora_comprando` | evento | 2,5% |
| `ferias_do_dono` | evento | 2,4% |
| `tarifa_do_app` | evento | 2,4% |
| `primeiro_funcionario` | evento | 2,4% |
| `fila_do_posto` | evento | 2,4% |
| `convite_igreja` | npc | 2,3% |
| `conselho_de_fachada` | evento | 2,3% |
| `festa_surpresa_para` | npc | 2,3% |
| `colega_happy_hour` | npc | 2,3% |
| `irmao_desempregado` | npc | 2,2% |
| `crise_no_setor` | evento | 2,2% |
| `o_que_pensa_de_voce` | npc | 2,2% |
| `ex_namora_amigo` | evento | 2,2% |
| `escola_integral` | evento | 2,2% |
| `colega_de_licenca` | evento | 2,2% |
| `aposentadoria_nao_da` | npc | 2,2% |
| `este_e_o_ano` | evento | 2,2% |
| `programa_de_moradia` | evento | 2,2% |
| `crianca_ansiosa` | evento | 2,2% |
| `bancar_quem_sai` | jogada | 2,2% |
| `birra_no_mercado` | evento | 2,1% |
| `so_aparece_por_dinheiro` | npc | 2,1% |
| `cursinho_comunitario` | evento | 2,1% |
| `emprego_tecnologia` | evento | 2,1% |
| `irmaos_brigam` | evento | 2,1% |
| `vaga_na_capital` | evento | 2,1% |
| `fim_do_amor` | npc | 2,1% |
| `olimpiada_do_instituto` | evento | 2,1% |
| `contaram_do_esquema` | evento | 2,1% |
| `surto_no_bairro` | evento | 2,1% |
| `acordo_abriu_mercado` | evento | 2,1% |
| `amigo_muda_de_cidade` | npc | 2,1% |
| `missa_em_familia` | acao | 2,0% |
| `governo_que_voce_elegeu_frente_popular` | evento | 2,0% |
| `importado_ficou_caro` | evento | 2,0% |
| `fundacao_com_seu_nome` | evento | 2,0% |
| `proposta_sao_paulo` | evento | 2,0% |
| `chantagem_do_esquema` | npc | 1,9% |
| `tentar_outra_cidade` | evento | 1,9% |
| `carregar_a_geladeira` | evento | 1,9% |
| `imposto_sobre_fortunas` | evento | 1,9% |
| `o_jantar_dos_ricos` | evento | 1,9% |
| `assumir_negocio` | evento | 1,9% |
| `apresentacao_para_a_diretoria` | evento | 1,9% |
| `vereador` | evento | 1,9% |
| `duas_empresas_uma_agenda` | evento | 1,9% |
| `joias_no_cofre` | evento | 1,9% |
| `o_rival_na_festa` | npc | 1,8% |
| `expandir_na_alta` | evento | 1,8% |
| `colega_cobre_voce` | npc | 1,8% |
| `tosse_cronica` | evento | 1,8% |
| `seguranca_particular` | evento | 1,8% |
| `shows_cancelados` | evento | 1,8% |
| `mural_de_problemas` | jogada | 1,8% |
| `ramo_em_crise` | evento | 1,7% |
| `amor_paga_a_conta` | npc | 1,7% |
| `apuracao_do_carnaval` | evento | 1,7% |
| `fiador` | npc | 1,7% |
| `compativel_para_medula` | evento | 1,7% |
| `aposentado_quer_ajudar_na_empresa` | npc | 1,7% |
| `clientes_sumiram` | evento | 1,7% |
| `as_bodas` | evento | 1,6% |
| `voltar_com_o_ex` | npc | 1,6% |
| `plano_de_saude_subiu` | evento | 1,6% |
| `saudade_de_la` | evento | 1,6% |
| `amor_quer_mudar_de_carreira` | npc | 1,6% |
| `estrutura_parada` | evento | 1,6% |
| `emprego_educacao` | evento | 1,5% |
| `a_tregua_do_rival` | npc | 1,5% |
| `presidir_cpi` | evento | 1,5% |
| `ainda_mora_com_pais` | evento | 1,5% |
| `reajuste_dos_servidores` | evento | 1,5% |
| `amigo_sumiu_e_voltou` | npc | 1,5% |
| `nega_ajuda` | npc | 1,5% |
| `cobranca_da_magoa` | npc | 1,5% |
| `hospital_sem_insumo` | evento | 1,5% |
| `pai_namorando_de_novo` | npc | 1,5% |
| `ex_casou` | npc | 1,5% |
| `carreira_futebol` | evento | 1,5% |
| `ajudar_na_coleta` | evento | 1,5% |
| `filho_cuida_de_voce` | npc | 1,4% |
| `emprestimo_de_volta` | evento | 1,4% |
| `faculdade_depois_dos_60` | npc | 1,4% |
| `rodada_grande` | evento | 1,4% |
| `visitar_de_longe` | acao | 1,4% |
| `o_conselho_vetou` | evento | 1,4% |
| `passear_pet` | acao | 1,4% |
| `equipe_para_desmontar` | jogada | 1,4% |
| `renegociar_divida` | evento | 1,4% |
| `volta_terra` | evento | 1,4% |
| `intercambio_pago` | evento | 1,4% |
| `cidadania_do_bisavo` | evento | 1,4% |
| `convite_do_partido` | evento | 1,4% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,3% |
| `juros_altos` | evento | 1,3% |
| `cupula_la_fora` | evento | 1,3% |
| `briga_por_heranca` | evento | 1,3% |
| `amigo_lembra_zoeira` | npc | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `imovel_na_baixa` | evento | 1,3% |
| `pix_para_a_cidade` | jogada | 1,3% |
| `preco_do_pao` | evento | 1,2% |
| `foto_de_campanha` | evento | 1,2% |
| `embaixador_pede` | evento | 1,2% |
| `obra_do_predio` | evento | 1,2% |
| `casamento_dos_outros` | evento | 1,2% |
| `setor_afundou` | evento | 1,2% |
| `dolar_virou_salario` | evento | 1,2% |
| `gorjeta_boa` | evento | 1,2% |
| `arrojado_na_queda` | evento | 1,2% |
| `cancelado` | evento | 1,2% |
| `a_conversa_que_faltava` | npc | 1,2% |
| `o_primeiro_neto` | evento | 1,2% |
| `sucessao_regime` | evento | 1,2% |
| `lesao_grave` | evento | 1,2% |
| `oferece_ajuda` | npc | 1,1% |
| `carona_de_madrugada` | npc | 1,1% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 1,1% |
| `vida_depois_da_condenacao` | evento | 1,1% |
| `o_irmao_viu` | npc | 1,1% |
| `a_licitacao` | evento | 1,1% |
| `reencontro_paixao` | evento | 1,1% |
| `formatura_tardia` | evento | 1,1% |
| `padrao_aperta` | evento | 1,1% |
| `bolsa_de_iniciacao` | evento | 1,0% |
| `o_ex_quer_um_cafe` | npc | 1,0% |
| `bodas_de_prata` | evento | 1,0% |
| `ano_de_prejuizo` | evento | 1,0% |
| `hit_viral` | evento | 1,0% |
| `irmao_aposentou` | evento | 1,0% |
| `mesa_cheia` | evento | 1,0% |
| `reforma_sem_fim` | evento | 1,0% |
| `ocorrencia_perigosa` | evento | 1,0% |
| `estatua_derrubada` | evento | 1,0% |
| `rompimento` | npc | 1,0% |
| `tornar_se_dispensavel` | jogada | 1,0% |
| `gravidez_surpresa` | npc | 1,0% |
| `ex_saudade_de_quem_foi` | evento | 0,9% |
| `bancar_presidente` | jogada | 0,9% |
| `feirao_limpa_nome` | evento | 0,9% |
| `happy_hour` | acao | 0,9% |
| `ferias_com_a_familia_do_amor` | npc | 0,9% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,9% |
| `doar_em_vida` | evento | 0,9% |
| `sair_de_casa_cedo` | evento | 0,9% |
| `cobranca_no_telefone` | evento | 0,9% |
| `guerra_de_precos` | evento | 0,9% |
| `dez_anos_de_empresa` | evento | 0,9% |
| `chefe_amigo` | evento | 0,9% |
| `solucao_inesperada` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `salario_parcelado` | evento | 0,9% |
| `convite_para_o_palco_grande` | evento | 0,9% |
| `time_a_venda` | evento | 0,8% |
| `tocar_o_negocio` | acao | 0,8% |
| `acampamento_na_porta` | evento | 0,8% |
| `desfile_das_campeas` | evento | 0,8% |
| `governo_que_voce_elegeu_centrao` | evento | 0,8% |
| `ex_liga_de_madrugada` | npc | 0,8% |
| `cobranca_do_filho` | npc | 0,8% |
| `greve_da_federal` | evento | 0,8% |
| `grade_na_janela` | evento | 0,8% |
| `ex_cobra` | npc | 0,8% |
| `a_auditoria` | evento | 0,8% |
| `fundacao` | jogada | 0,8% |
| `favor_do_presidente` | evento | 0,8% |
| `proposta_da_europa` | evento | 0,8% |
| `vontade_festa_de_80` | npc | 0,8% |
| `concorrente_nova` | evento | 0,8% |
| `aniversario_de_gemeos` | evento | 0,8% |
| `dizimo` | evento | 0,8% |
| `recaida_cigarro` | evento | 0,8% |
| `black_friday` | evento | 0,8% |
| `a_empresa_sem_voce` | evento | 0,8% |
| `cara_de_comercial` | evento | 0,8% |
| `mais_uma_mudanca` | evento | 0,7% |
| `nao_para_quieto` | evento | 0,7% |
| `safra_da_fazenda` | evento | 0,7% |
| `familia_descobre_o_testamento` | evento | 0,7% |
| `noite_da_apuracao` | evento | 0,7% |
| `o_mural_do_boton` | evento | 0,7% |
| `amigo_ficou_rico` | npc | 0,7% |
| `fronteira_fechada` | evento | 0,7% |
| `calote_no_noticiario` | evento | 0,7% |
| `apartamento_de_presente` | evento | 0,7% |
| `papel_da_vida` | evento | 0,7% |
| `paparazzi` | evento | 0,7% |
| `a_capa_da_revista` | evento | 0,7% |
| `despejo` | evento | 0,6% |
| `filho_briga_na_escola` | npc | 0,6% |
| `planilha_das_dividas` | evento | 0,6% |
| `depois_do_calote` | evento | 0,6% |
| `set_de_gravacao` | evento | 0,6% |
| `contrato_publicitario` | evento | 0,6% |
| `homenagem_no_trabalho` | evento | 0,6% |
| `frete_sumiu` | evento | 0,6% |
| `fim_de_semana_no_sitio` | evento | 0,6% |
| `guerra_comercial` | evento | 0,6% |
| `amor_desconfia` | npc | 0,6% |
| `o_seu_sonho_nas_maos` | evento | 0,6% |
| `protesto_na_avenida` | evento | 0,6% |
| `filho_parou_de_contar` | npc | 0,6% |
| `vaga_no_agro` | evento | 0,6% |
| `lembranca_primeiro_amor` | evento | 0,6% |
| `holding_da_familia` | evento | 0,6% |
| `segundo_carro` | evento | 0,5% |
| `desabafar_o_caso` | acao | 0,5% |
| `o_caso_vem_a_tona` | evento | 0,5% |
| `o_dono_quebrado_pede_emprego` | npc | 0,5% |
| `jantar_esfriou` | npc | 0,5% |
| `desfile_de_sete_de_setembro` | evento | 0,5% |
| `caixa_sobrando` | evento | 0,5% |
| `infancia_no_palacio` | evento | 0,5% |
| `ex_internado` | evento | 0,5% |
| `aluguel_com_nome_sujo` | evento | 0,5% |
| `feriado_na_praia` | evento | 0,5% |
| `acoes_da_startup` | evento | 0,5% |
| `tradutor_da_familia` | evento | 0,5% |
| `exportacao_bate_recorde` | evento | 0,5% |
| `a_convocacao` | evento | 0,5% |
| `promocao_em_outra_cidade` | evento | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,4% |
| `lista_dos_mais_ricos` | evento | 0,4% |
| `obra_atrasada` | evento | 0,4% |
| `queda_do_cargo` | evento | 0,4% |
| `amor_quadro_de_tarefas` | npc | 0,4% |
| `fila_do_emprego` | evento | 0,4% |
| `startup_dos_ex_funcionarios` | evento | 0,4% |
| `sancao_parou_o_porto` | evento | 0,4% |
| `divida_publica_assusta` | evento | 0,4% |
| `oferta_pela_subsidiaria` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `o_preco_remarcado` | evento | 0,4% |
| `rebaixamento` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `segredo_de_familia` | npc | 0,4% |
| `pane_no_voo` | evento | 0,4% |
| `intercambio` | evento | 0,4% |
| `livro_viralizou` | evento | 0,4% |
| `ameaca_de_sancao` | evento | 0,4% |
| `guerra_na_escola` | evento | 0,4% |
| `treinar_no_clube` | acao | 0,4% |
| `mestrado_fora` | evento | 0,4% |
| `robos_na_fabrica` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,4% |
| `turne_nacional` | evento | 0,4% |
| `racionamento` | evento | 0,4% |
| `confessar_o_caso` | acao | 0,4% |
| `proposta_em_dolar` | evento | 0,4% |
| `regra_sob_medida` | evento | 0,4% |
| `trazer_a_copa` | jogada | 0,4% |
| `burnout` | evento | 0,4% |
| `ajudar_com_a_casa` | acao | 0,4% |
| `o_dia_do_sonho_presidencia` | evento | 0,4% |
| `o_bicho_herdeiro` | evento | 0,4% |
| `briga_de_casal` | npc | 0,4% |
| `fazer_as_pazes` | acao | 0,4% |
| `aluguel_caro` | evento | 0,4% |
| `filho_apresenta_namoro` | npc | 0,4% |
| `a_impressora_ligada` | evento | 0,4% |
| `critico_no_salao` | evento | 0,4% |
| `emprego_negocios` | evento | 0,3% |
| `picadeiro` | evento | 0,3% |
| `carro_de_luxo_na_rua` | evento | 0,3% |
| `quartel_sem_verba` | evento | 0,3% |
| `o_dia_do_sonho_imperio` | evento | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `vendas_recorde` | evento | 0,3% |
| `celular_dos_pais` | npc | 0,3% |
| `deploy_de_sexta` | evento | 0,3% |
| `a_parcela_do_banco` | evento | 0,3% |
| `tomar_o_poder` | jogada | 0,3% |
| `transito_de_sp` | evento | 0,3% |
| `pedreiro_vale_ouro` | evento | 0,3% |
| `chefe_elogia` | npc | 0,3% |
| `a_conta_da_coroa` | evento | 0,3% |
| `juros_altos_na_fatura` | evento | 0,3% |
| `ministro_pede_ajuste` | evento | 0,3% |
| `choque_de_culturas` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `assinatura_real` | evento | 0,3% |
| `mordomias_reais` | evento | 0,3% |
| `a_baba_foi_embora` | evento | 0,3% |
| `confessar_a_divida` | acao | 0,3% |
| `o_neto_no_fim_de_semana` | evento | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `o_laboratorio_apaga_a_luz` | evento | 0,3% |
| `renegociar_cartao` | acao | 0,3% |
| `aperto_do_mes` | evento | 0,3% |
| `vaga_na_empresa_dele` | npc | 0,3% |
| `o_recall` | evento | 0,3% |
| `peneira_do_sobrenome` | evento | 0,3% |
| `cavalo_campeao` | evento | 0,3% |
| `cobrar_divida` | acao | 0,3% |
| `escandalo_do_lobby` | evento | 0,3% |
| `o_rival_quer_comprar` | npc | 0,3% |
| `filho_hamburgueria` | npc | 0,3% |
| `quebra_de_safra` | evento | 0,3% |
| `montadora_vai_fechar` | evento | 0,3% |
| `naturalizacao` | evento | 0,3% |
| `safra_ou_geada` | evento | 0,3% |
| `pais_envelhecem` | npc | 0,2% |
| `as_criancas_perguntam` | npc | 0,2% |
| `concurso_em_brasilia` | evento | 0,2% |
| `edital_da_ciencia` | evento | 0,2% |
| `circo_vai_embora` | evento | 0,2% |
| `violencia_vira_manchete` | evento | 0,2% |
| `bonanca_no_governo` | evento | 0,2% |
| `segunda_chance` | npc | 0,2% |
| `filial_fechando` | evento | 0,2% |
| `internato_real` | evento | 0,2% |
| `fa_obcecado` | evento | 0,2% |
| `faltou_gente` | evento | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `obra_parada` | evento | 0,2% |
| `cura_de_doenca` | jogada | 0,2% |
| `filho_quer_curso_caro` | npc | 0,2% |
| `cargo_no_gabinete` | evento | 0,2% |
| `pressao_carreira` | npc | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `filho_convocado` | evento | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `o_cartel_vazou` | evento | 0,2% |
| `a_divida_vem_a_tona` | evento | 0,2% |
| `turno_extra_na_fabrica` | evento | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `irmao_separou` | npc | 0,2% |
| `o_veterano` | evento | 0,2% |
| `contaram_do_caso` | evento | 0,2% |
| `resultado_da_pesquisa` | evento | 0,2% |
| `noite_de_corridas` | evento | 0,2% |
| `vista_da_cobertura` | evento | 0,2% |
| `o_processo_da_marca` | npc | 0,2% |
| `filho_adolescente_porta` | npc | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `o_neto_pergunta_do_sonho` | evento | 0,2% |
| `tentar_a_vida_na_europa` | evento | 0,2% |
| `a_copa_chegou` | evento | 0,2% |
| `assumir_a_fazenda` | evento | 0,2% |
| `decreto_da_economia` | evento | 0,2% |
| `o_preco_do_imperio` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `presidente_pediu_as_contas` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `leilao_da_obra` | evento | 0,1% |
| `ficar_no_poder` | jogada | 0,1% |
| `parcela_da_tv` | npc | 0,1% |
| `zona_franca` | evento | 0,1% |
| `emprego_engenharia` | evento | 0,1% |
| `ferias_coletivas` | evento | 0,1% |
| `grupo_na_capa` | evento | 0,1% |
| `imposto_do_ano` | evento | 0,1% |
| `casamento_real` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `paciente_famoso` | evento | 0,1% |
| `final_da_copa` | evento | 0,1% |
| `importado_invadiu` | evento | 0,1% |
| `greve_geral` | evento | 0,1% |
| `pais_aposentados` | npc | 0,1% |
| `amor_sempre_trabalhando` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `reencontro_amigo_brigado` | evento | 0,1% |
| `safra_recorde` | evento | 0,1% |
| `receita_recorde` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `padrinho_casamento` | npc | 0,1% |
| `royalties_secaram` | evento | 0,1% |
| `plantao_que_nao_acaba` | evento | 0,1% |
| `concorrente_quebrou` | evento | 0,1% |
| `o_conselho_te_chama` | evento | 0,1% |
| `oposicao_na_tv` | evento | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `amor_gastador` | npc | 0,1% |
| `amor_igreja` | npc | 0,1% |
| `fabrica_de_municao` | evento | 0,1% |
| `chantagem_do_caso` | npc | 0,1% |
| `contaram_da_festa` | evento | 0,1% |
| `proposta_pelo_negocio` | evento | 0,1% |
| `layoff_por_email` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `sequestro_frustrado` | evento | 0,1% |
| `carta_branca` | evento | 0,1% |
| `teste_por_indicacao` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `mansao_vazia` | evento | 0,1% |
| `a_opa_da_rival` | evento | 0,1% |
| `crise_internacional` | evento | 0,1% |
| `reconciliacao` | npc | 0,1% |
| `chefe_magoado_cobra` | npc | 0,1% |
| `negocio_em_crise` | evento | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `nova_tentativa_da_pesquisa` | evento | 0,1% |
| `abrir_capital` | evento | 0,1% |
| `cliente_perdeu_tudo` | evento | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `fusao_de_iguais` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `a_opa_do_fundo` | evento | 0,1% |
| `bonus_do_banco` | evento | 0,1% |
| `cursinho_paga_bem` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `shopping_lotado` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `greve_do_piso` | evento | 0,1% |
| `paparazzi_real` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `ex_aluno` | evento | 0,1% |
| `proposta_remota` | evento | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `amor_planilha` | npc | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `conselho_quer_ceo` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `aluno_impossivel` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `amor_viaja_demais` | npc | 0,0% |
| `amor_vai_embora` | npc | 0,0% |
| `contaram_da_divida` | evento | 0,0% |
| `bolsa_na_faculdade` | evento | 0,0% |
| `lancamento` | evento | 0,0% |
| `desvio_na_fundacao` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `acusado_de_nepotismo` | evento | 0,0% |
| `o_credito_sumiu` | evento | 0,0% |
| `cliente_preso` | evento | 0,0% |
| `restaurar_a_monarquia` | jogada | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `a_promessa_cobrada` | evento | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `primeiro_balanco_na_bolsa` | evento | 0,0% |
| `a_empresa_anda_sozinha` | evento | 0,0% |
| `anos_depois_do_poder` | evento | 0,0% |
| `caso_do_poderoso` | evento | 0,0% |
| `helicoptero_no_teto` | evento | 0,0% |
| `caramelo_envelhece` | npc | 0,0% |
| `amor_saude_fragil` | npc | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `documentario` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `devedor_some` | npc | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `quem_manda_se_voce_faltar` | evento | 0,0% |
| `cobrir_a_tatuagem` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `a_pasta_do_sonho` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `apagao` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 231 · **mudaram algo em pelo menos uma vida:** 232
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 70,4 · p10 54 · p25 61 · mediana 70 · p75 80 · p90 88

```
até 19                                        0,2%
20–29                                         0,4%
30–39          █                              0,7%
40–49          ████                           3,4%
50–59          ████████████████               15,3%
60–69          ██████████████████████████████ 28,4%
70–79          ██████████████████████████     24,8%
80–89          █████████████████████          19,6%
90–99          ███████                        6,4%
100+           █                              0,8%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 238 mil · p25 R$ 752 mil · mediana R$ 3,6 milhões · p75 R$ 20 milhões · p90 R$ 62 milhões

```
negativo       █                              0,8%
até 10 mil                                    0,4%
10–50 mil      █                              1,5%
50–200 mil     ████                           6,0%
200 mil–1 mi   ██████████████                 21,0%
1–5 mi         ████████████████               24,9%
5 mi+          ██████████████████████████████ 45,3%
```

**Felicidade média ao longo da vida** — p10 61 · mediana 74 · p90 86

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,8%
50–59          ██████                         7,3%
60–69          ███████████████████            24,8%
70–79          ██████████████████████████████ 39,2%
80+            █████████████████████          27,8%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,8 | R$ 698 mil | 67,9 | 60,1 | 161,8 | 70,8 | 100% | 54% |
| cautelosa | 83,1 🏆 | R$ 26 milhões 🏆 | 75,5 | 68,9 | 179,2 | 74,0 | 100% | 57% |
| arriscada | 58,9 | R$ 3,8 milhões | 80,9 🏆 | 55,7 | 143,8 | 108,1 | 100% | 52% |
| aleatoria | 73,8 | R$ 2 milhão | 70,6 | 64,8 | 133,9 | 84,5 | 100% | 49% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,4% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,8% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,3% — de um AVC, numa terça-feira sem graça
- 7,9% — de pneumonia, depois de teimar que era só uma gripe
- 6,8% — numa cirurgia simples que não foi tão simples
- 5,6% — de complicações de uma queda no banheiro
- 4,8% — em paz, no meio de uma soneca que era para ser rápida
- 4,4% — de velhice, dormindo, num domingo depois do almoço

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
