# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 716 eventos, 145 de personagens, 121 ações, 2095 escolhas, 239 linhas, 189 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| O estado é íntegro depois de cada ano: números finitos e nos limites, o dinheiro do mundo somando zero, as dívidas nos contratos, o tempo e a família coerentes, a clientela dentro do mercado (missão AAA) | ✅ | 0 problemas em 777579 anos (as vidas sorteadas e as de origem escolhida), mais as gerações das dinastias |
| Todo real tem contraparte: as contas fecham em toda entrada (fatia 1.1) | ✅ | 0 problemas em 4247981 entradas |
| Toda dívida tem credor: o que se deve é o que o banco tem a receber, em toda entrada (fatia 1.2) | ✅ | 0 problemas em 4896170 entradas (as vidas sorteadas, as de origem escolhida e as gerações das dinastias) |
| Nenhum filho apaga outro: os filhos que a vida teve estão todos no estado (fatia 1.4a) | ✅ | 0 em 11056 vidas |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## O dinheiro de uma vida, por contraparte (fatia 1.1)

De quem veio e para quem foi o dinheiro de quem joga na vida inteira, pelo extrato do livro: a mediana entre as vidas que tiveram o fluxo (positivo entrou). Os 16 fluxos mais comuns.

| Fluxo | Contraparte | Vidas com ele | Mediana por vida |
|---|---|---|---|
| Ações do ano | o mercado | 99,9% | R$ 26 mil |
| Inflação no dinheiro parado | os preços | 99,8% | -R$ 600 mil |
| Acontecimentos | o mercado | 99,8% | -R$ 11 mil |
| Custo de vida | o mercado | 99,8% | -R$ 627 mil |
| Padrão de vida | o mercado | 99,7% | -R$ 8,4 milhões |
| Bico | o mercado | 99,7% | R$ 45 mil |
| Salário | o mercado | 96,8% | R$ 3,5 milhões |
| Juro da renda fixa | o governo | 86,9% | R$ 246 mil |
| Imposto | o governo | 84,9% | -R$ 102 mil |
| Cotação dos investimentos | os preços | 83,9% | R$ 556 mil |
| Imposto mais baixo | o governo | 82,6% | R$ 99 mil |
| Juros da dívida | o banco | 79,2% | -R$ 2 mil |
| Auxílio | o governo | 78,3% | R$ 14 mil |
| Compras e vendas | o mercado | 74,0% | -R$ 2,4 milhões |
| Manutenção dos bens | o mercado | 74,0% | -R$ 837 mil |
| Gastos da velhice | o mercado | 65,8% | -R$ 964 mil |

## As dívidas como contrato (fatia 1.2)

Toda dívida de quem joga é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento (com o imóvel em garantia) e o acordo de uma renegociação. Por estratégia, nas vidas sorteadas:

| Estratégia | Financiou | Nome sujo | Anos sujo (mediana, entre as sujas) | Acordo | Caducou | Leilão | Nome limpo de novo |
|---|---|---|---|---|---|---|---|
| primeira | 0,0% | 8,0% | 5,0 | 7,7% | 4,5% | 0,0% | 5,5% |
| cautelosa | 0,0% | 1,2% | 0,0 | 1,3% | 0,0% | 0,0% | 0,0% |
| arriscada | 95,3% | 23,4% | 1,0 | 12,7% | 3,5% | 17,3% | 16,9% |
| aleatoria | 51,0% | 14,2% | 1,0 | 7,4% | 1,5% | 9,2% | 9,0% |

| Portão | Situação | Valor |
|---|---|---|
| O nome sujo acontece, mas não é a regra: entre 2% e 25% das vidas | ✅ | 11,7% |
| Renegociar muda a história: pela dívida sem garantia, o nome fica sujo menos tempo com acordo do que esperando (média por vez que sujou) | ✅ | 0,98 anos com acordo (691 vezes) × 3,12 sem (586 vezes; p90 5) |
| Financiar tem risco, não sentença: de quem financiou, entre 1% e 25% perde o imóvel em leilão | ✅ | 18,1% de 3658 vidas que financiaram |
| Dívida atrasada caduca: acontece, e em no máximo metade das vidas com o nome sujo | ✅ | 2,4% das vidas; 20,2% das sujas |

## O Tesouro (bloco B)

Quem joga empresta ao governo comprando título: a taxa fica travada na compra, o cupom cai na conta todo ano (o tesouro paga), o valor volta no vencimento e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode dar calote: quem tinha título e renda fixa perde. Por estratégia, nas vidas sorteadas:

| Estratégia | Comprou pela folha | Compras (média de quem comprou) | Ganhou título numa história | Cupons na vida (mediana de quem teve título) | Venceram | Vendeu antes (com lucro) | Viu um calote | Perdeu no calote (mediana de quem perdeu) |
|---|---|---|---|---|---|---|---|---|
| primeira | 0,0% | — | 32,5% | R$ 53 mil | 689 | 0 (0) | 1,2% | R$ 13 mil (5 vidas) |
| cautelosa | 98,6% | 5,4 | 50,9% | R$ 1,5 milhão | 13602 | 27 (21) | 1,3% | R$ 195 mil (8 vidas) |
| arriscada | 0,0% | — | 13,9% | R$ 8,2 mil | 160 | 116 (66) | 2,2% | R$ 85 milhões (26 vidas) |
| aleatoria | 88,6% | 2,5 | 14,7% | R$ 44 mil | 3463 | 1739 (941) | 1,3% | R$ 32 mil (12 vidas) |

| Portão | Situação | Valor |
|---|---|---|
| Emprestar ao governo é escolha: alguma estratégia compra título pela folha em pelo menos 30% das vidas, e outra em menos de 5% | ✅ | primeira 0,0%, cautelosa 98,6%, arriscada 0,0%, aleatoria 88,6% |
| O calote é raro: entre 0,2% e 5% das vidas veem um | ✅ | 1,5% (149 vidas) |
| Quem perde no calote é quem tinha a dívida: nada sai de quem joga fora dos títulos e da renda fixa | ✅ | 0 vidas |

## A coroa (bloco C)

Quem tem coroa (o monarca do Brasil e quem é soberano da ilha que fundou) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha, e a aprovação anda para mais baixo com a parte dos impostos e mais ainda com a taxa. 200 vidas tiveram coroa (todas as vidas do túnel, com as de origem escolhida e as dinastias):

| Forma | Anos de coroa | Dotação por ano (média) | Quedas por 100 anos |
|---|---|---|---|
| salário da Casa Real | 2839 | R$ 7,8 milhões | 0,5 |
| parte dos impostos | 1150 | R$ 959 milhões | 0,4 |
| taxa da coroa | 1900 | R$ 19 bilhões | 0,5 |

A ilha: 32 vidas fundaram ou herdaram uma. População no fim: p10 2069, mediana 2552, p90 3322.

| Portão | Situação | Valor |
|---|---|---|
| A taxa da coroa tem preço: por ano de coroa, ela cai mais com a taxa do que com o salário | ✅ | 0,5 quedas por 100 anos com a taxa (1900 anos) × 0,5 com o salário (2839 anos) |
| A ilha vive: a população de toda ilha andou desde a fundação, e a taxa da coroa a esvazia | ✅ | 32 ilhas; mediana de 2674 habitantes sem a taxa (15) e 2069 com 5 anos ou mais de taxa (6) |
| Toda dotação tem coroa por trás: nenhum real dela para quem não reina | ✅ | 0 vidas |

## O Estado pesquisa (bloco D)

Quem governa decide quanto do orçamento vai para a ciência: cortada, regular ou prioridade (de 0,3% a 0,9% do PIB, pagos pelo Tesouro). A tecnologia do país anda devagar para onde a ciência e a escola levam e volta como crescimento, saúde pública e tração das empresas. Nas vidas sorteadas:

| Ciência | Anos | A tecnologia por ano |
|---|---|---|
| cortada | 171474 | -0,70 |
| regular | 343894 | -0,04 |
| prioridade | 187694 | +0,75 |

A tecnologia ao morrer: p10 42,5, mediana 49,7, p90 58,5. Descobertas por 100 vidas: a cura 16,6, o satélite 16,8, a patente 16,3; 28,1% das vidas veem uma. A fuga de cérebros: 25,6% das vidas.

| Portão | Situação | Valor |
|---|---|---|
| A ciência paga vira tecnologia: com a prioridade, a tecnologia do país sobe; com a ciência cortada, cai | ✅ | cortada -0,70 por ano (171474 anos) · regular -0,04 por ano (343894 anos) · prioridade +0,75 por ano (187694 anos) |
| O país termina diferente: a tecnologia ao morrer tem p90 − p10 ≥ 10 pontos | ✅ | p10 42,5 · mediana 49,7 · p90 58,5 |
| A descoberta acontece e tem porquê: em 10% a 70% das vidas, e ≥ 60% delas apontam a decisão que pôs a ciência como prioridade | ✅ | 28,1% das vidas; 88,6% de 4977 descobertas com a decisão de causa |

## A defesa (bloco E)

Quem governa decide a defesa (desmobilizada, regular ou reforçada) e encomenda sistemas de armamento, que vão para a dívida na hora e somam à capacidade quando chegam. A capacidade das Forças Armadas dissuade: com um país que sanciona e anda frio, a guerra pode começar, e a chance dobra a cada 15 pontos abaixo de 50. Nas vidas sorteadas:

| Defesa | Anos | A capacidade por ano |
|---|---|---|
| desmobilizada | 179624 | -0,84 |
| regular | 345735 | -0,01 |
| reforçada | 177703 | +0,85 |

A capacidade ao morrer: p10 43,2, mediana 49,6, p90 57,7. Encomendas por 100 vidas: 6,7 (618 entregas). Guerras por 100 vidas: 3,0, em 3,0% das vidas; acabaram em vitória 64, derrota 84 e cessar-fogo 142, com 3,6 anos em média. Pedidos de paz: 7; convocações: 72; 0,3% das vidas voltaram da guerra com a marca.

| Portão | Situação | Valor |
|---|---|---|
| A defesa paga vira capacidade: com a defesa reforçada, a capacidade sobe; desmobilizada, cai | ✅ | desmobilizada -0,84 por ano (179624 anos) · regular -0,01 por ano (345735 anos) · reforçada +0,85 por ano (177703 anos) |
| A guerra é rara e tem porquê: em 0,5% a 8% das vidas, e ≥ 70% dos começos apontam a decisão que esfriou a relação | ✅ | 3,0% das vidas; 91,7% de 301 guerras com a decisão de causa |
| A capacidade dissuade: nos anos de ameaça, a guerra começa mais com o quartel abaixo de 60 do que acima | ✅ | quartel fraco: 3,6% de 4976 anos · forte: 2,6% de 4685 anos |
| A guerra custa: o crescimento nos anos de guerra fica ≥ 1,5 ponto abaixo do dos anos de paz | ✅ | -3,19% em 1066 anos de guerra · 1,15% nos de paz |
| Toda guerra acaba: nenhuma passa do oitavo ano | ✅ | a mais longa: 8 anos |

## O poder que passa (bloco F)

A coroa, o Regime e a ilha passam a quem continua a história: em vida (o pai ou a mãe que reinava morre) e na herança (seja quem for que herde), agora ou aos 18, e quem governava espera a resposta, sem interregno. Quem tem cargo vive dele, e o poder também se toma: o golpe, o autogolpe, a emenda e a coroa restaurada. Nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias (com 80 dinastias que nascem na família real ou no Regime):

Sucessões que chegaram a quem tinha 18 anos ou mais: 396 em vida (100,0% com resposta) e 103 na herança (100,0%). De 109 herdeiros que começaram na fila, 70,6% reinaram.

| Jogada | Tentativas | Deram certo | Por estratégia (tentativas nas vidas sorteadas) |
|---|---|---|---|
| Tomar o poder (liderar os quartéis ou financiar os generais) | 26 | 50,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 1 |
| Fechar o Congresso (o autogolpe de quem é presidente) | 49 | 46,9% | primeira 0 · cautelosa 0 · arriscada 2 · aleatoria 0 |
| Mudar a Constituição para mais um mandato | 2 | 50,0% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |
| Restaurar a monarquia no plebiscito | 92 | 35,9% | primeira 0 · cautelosa 0 · arriscada 0 · aleatoria 0 |

| Portão | Situação | Valor |
|---|---|---|
| A coroa passa: toda coroa, Regime ou ilha que chega a quem joga com 18 anos ou mais tem resposta, em vida e na herança (≥ 20 casos de cada) | ✅ | em vida 100,0% de 396 · na herança 100,0% de 103 |
| O poder se toma, e é aposta: golpes e autogolpes são tentados (≥ 20 vezes) e dão certo em 15% a 85% das tentativas | ✅ | 75 tentativas, 48,0% deram certo |

## A rede (missão Ω1)

As pessoas passam a ter identidade: o amor que vai embora vira ex, os irmãos nascem e vivem ao fundo, o colega e o chefe vêm com o trabalho (`docs/auditoria-omega.md`). Nas vidas sorteadas, cada vida tem em média 13,4 pessoas diferentes, 0,31 ex, 1,57 irmãos (0,86 nascidos depois de quem joga) e 4,30 pessoas do trabalho.

| Portão | Situação | Valor |
|---|---|---|
| A rede vive: ≥ 25% das vidas têm um ex e ≥ 60% têm um irmão | ✅ | ex em 25,9% · irmão em 80,0% |
| As pessoas da rede contam a vida: ≥ 3 entradas visíveis por vida com um irmão, um ex, o colega ou o chefe | ✅ | 4,2 entradas por vida, com 13,4 pessoas por vida |
| A mesma pessoa muda de papel: o ex que volta, o colega que vira amigo e o romance do trabalho acontecem (≥ 10 vezes cada) | ✅ | ex que voltou 69 · colega que virou amigo 21 · romance do trabalho 54 |

## Os verbos sociais (missão Ω2)

Quando a resposta é de uma pessoa, ela decide pelo estado e pela memória dela e diz por quê (`decisao.ts`); o empréstimo entre pessoas é uma promissória, com parcela, atraso, quitação e calote (`promissorias.ts`). Nas vidas sorteadas: 16,9 respostas por vida, sim em 39,7%, e 47,8% delas com o porquê apontando um ano anterior.

| Portão | Situação | Valor |
|---|---|---|
| A pessoa decide: ≥ 60% das vidas têm um pedido respondido por alguém, e o sim fica entre 30% e 80% das respostas | ✅ | 66,2% das vidas · 16,9 respostas por vida · sim em 39,7% |
| O porquê cita o passado: ≥ 25% das respostas dizem a lembrança que pesou ("…, aos 31") ou a dívida em aberto | ✅ | 47,8% das respostas |
| O empréstimo entre pessoas acontece e acaba dos dois jeitos: em ≥ 10% das vidas, e dos que acabam, ≥ 50% quitados e ≥ 3% em calote | ✅ | em 35,9% das vidas (12290 empréstimos: 11828 pegos, 462 feitos) · 9363 quitados, 1245 calotes, 3491 parcelas atrasadas |

## Os projetos (missão Ω3)

Quem joga declara o que quer da vida; as etapas são condições do estado, e o fim vai para o livro com o começo de causa (`projetos.ts`). Por projeto, começados / conquistados: sair_das_dividas 1786 / 1452 · casa_propria 3670 / 2203 · ter_um_filho 2332 / 1871 · negocio_proprio 6812 / 76 · reparar_relacao 229 / 54 · cuidar_da_saude 3312 / 43 · primeiro_milhao 3290 / 2605 · casar 1073 / 747 · diploma 3179 / 508 · estrela 621 / 256 · imperio 892 / 27 · presidencia 1389 / 35 · familia_grande 666 / 459 · amor_da_vida 758 / 299 · fortuna 1031 / 100 · lugar_no_mundo 935 / 982 · volta_ao_mundo 1242 / 428 · os_netos 320 / 78.

| Portão | Situação | Valor |
|---|---|---|
| Os planos existem: ≥ 40% das vidas começam um plano | ✅ | 74,5% das vidas · 3,35 planos por vida |
| Os planos acabam dos dois jeitos: dos que acabam, as conquistas ficam entre 20% e 80% | ✅ | 12223 conquistas, 24044 prazos vencidos, 6396 desistências, 64 sem tempo (conquista em 28,6%) |
| Todo plano acontece: cada um é começado e conquistado em alguma vida | ✅ | 18 de 18 |

## Os segredos (missão Ω4)

Quem joga esconde coisas de alguém; quem sabe pode contar pelos círculos (a família e o par, os amigos, os ex, o trabalho), e a notícia que chega ao alvo vira revelação, com quem contou e a causa (`segredos.ts`). Por tema, nascidos / contados ao alvo: caso 101 / 19 · divida 89 / 5 · festa 887 / 20 · esquema 779 / 191.

| Portão | Situação | Valor |
|---|---|---|
| Os segredos existem: ≥ 15% das vidas guardam um | ✅ | 17,6% das vidas · 0,19 por vida |
| A notícia corre: um boato (alguém que soube pela boca de outro) para cada 4 segredos ou mais | ✅ | 590 boatos para 1856 segredos · 235 chegaram a quem não devia · 193 chantagens |
| Os segredos acabam de todo jeito: contados, descobertos, confessados e calados, cada um em ≥ 5% dos que acabam | ✅ | contados 12,9% · descobertos 55,8% · confessados 14,7% · calados 16,6% (de 1672) |
| Todo segredo chega a quem não devia: cada tema nasce e é contado ao alvo em alguma vida | ✅ | 4 de 4 |

## Os capítulos (missão Ω5)

A peneira lê o livro de cada vida e reconhece os arcos com começo e fim, que a linha do tempo e o cartão mostram (`capitulos.ts`).

| Portão | Situação | Valor |
|---|---|---|
| A vida tem capítulos: ≥ 50% das vidas têm um arco reconhecido no livro | ✅ | 72,7% das vidas · 1,51 por vida · 16,8% com dois tipos ou mais |
| Todo tipo de capítulo acontece (o plano, o segredo, a volta, o calote, o favor e as pazes) | ✅ | plano 12287 · segredo 1394 · volta 66 · calote 1245 · favor 46 · pazes 21 |

## O caminho e o ritmo (missão Ω6)

A variedade das vidas medida pela estrutura causal (as causas dos pontos de virada e os capítulos, ao lado da assinatura do destino), os elos de causa distintos e o ritmo: depois de um ano pesado, as histórias leves ganham a vez (`diretor.ts › ritmoDoAno`).

| Portão | Situação | Valor |
|---|---|---|
| O caminho varia mais que o destino: as assinaturas do caminho (as causas dos pontos de virada, com a escolha, os capítulos e o arco do sonho) passam as do destino | ✅ | caminho 835 (sem o arco do sonho, 582) · destino 574 por 1.000 vidas · 51,6 elos causais por vida, 2846 distintos no túnel |
| A vida respira: depois de um ano pesado, o seguinte também é pesado em ≤ 10% das vezes | ✅ | 5,6% de 43824 anos pesados |

## O capitalismo com rosto (bloco H6)

A concorrente da empresa que quem joga cuida de perto tem nome e dono, e o gestor que chega com a empresa grande propõe a jogada do ano pelo jeito dele (diretoria.ts). Avisos do gestor que tinha razão: 42; gestores que foram para a concorrência: 1.

| Portão | Situação | Valor |
|---|---|---|
| A concorrência tem rosto: ≥ 60% de quem abre empresa conhece a rival pelo nome | ✅ | 100,0% |
| O rival que já era da vida (um ex, um amigo) existe: ≥ 1% de quem abre empresa | ✅ | 1,49% |
| O gestor chega em 15% a 40% das vidas com empresa | ✅ | 22,0% |
| Das propostas do gestor, as seguidas ficam entre 30% e 70% | ✅ | 52,2% de 2765 |
| Seguir o gestor não domina: o patrimônio mediano de quem mais seguiu fica abaixo de 1,5 vez o de quem mais recusou | ✅ | R$ 43 milhões contra R$ 41 milhões (282 e 270 vidas) |

## O capitalismo vivo (missão Capitalismo vivo)

Nos setores em que o grupo produz, a concorrência é feita de empresas de verdade (concorrentes.ts), que rodam o mesmo negócio e decidem sozinhas. Vidas com concorrente de verdade: 64,4%; concorrentes que quebraram: 1235; compras que preservaram a comprada: 1649 (o Cade: livre 1649). Filiais lá fora: 132. A diretoria com carta branca, sozinha (I-178): 5642 unidades construídas, 81 filiais lá fora e 40 concorrentes compradas. A dupla do valor (I-179 a I-181): contratada em 57 vidas, dirigiu 575 anos; as CEOs pediram e levaram 20 vezes e ouviram não 182; 163 negócios comprados na baixa, 57 vendidos; o caixa aplicado rendeu R$ 65 bilhões. Unidades construídas pela folha: 310; anos com decisão de conselho: 21887; lançamentos de produto: 10802; campanha paga à mídia do grupo: R$ 167 bilhões. O peso do grupo no PIB, pelo valor adicionado, entre as vidas que pesaram: mediana 0,0500%, máximo 1,18%.

## O mundo à vista (I-170 a I-173)

Todo jogador vê o próprio lugar no país (lugar.ts): a linha do nascimento e, a partir dos 18, a faixa nova, a queda com causa e a volta. Vidas com alguma linha do lugar ou do grupo depois do nascimento: 77,4%; linhas por vida: 1,84 (douradas: 0,51).

| Nasceu em ↓ · terminou em → | a metade de baixo | a metade de cima (até os 10%) | o 1% e acima |
|---|---|---|---|
| a metade de baixo (3238 vidas) | 6,1% | 55,8% | 38,1% |
| a metade de cima (até os 10%) (4530 vidas) | 2,3% | 54,0% | 43,7% |
| o 1% e acima (2232 vidas) | 0,2% | 22,4% | 77,4% |

Os grandes do país (I-173): a pessoa mais rica e a maior empresa trocaram de lugar, com notícia, 1,73 vezes por vida.

Vidas que chegaram a cada marco: milesimo do mercado 137 · grupo mil 125 · grupo la fora 56 · entre os mais ricos 41 · grupo dez mil 39 · centesimo do mercado 30 · grupo cem mil 14 · o mais rico do pais 9 · entre as maiores 6 · grupo um milhao 1 · a maior do pais 1.

## O sonho da vida (bloco S1)

Aos 15, a pergunta do que quer da vida (a estrela, o império, o topo do país); no primeiro namoro sério, a do amor (a casa cheia, o amor para a vida toda). Cada sonho é um projeto com cenas próprias e um fim que o cartão conta.

| Portão | Situação | Valor |
|---|---|---|
| Quase toda vida sonha: ≥ 60% das vidas que chegam aos 20 têm um sonho | ✅ | 91,1% |
| O sonho não é garantido: dos sonhos que acabaram, os realizados ficam entre 10% e 70% | ✅ | 19,2% de 13909 |
| Todo sonho se realiza em alguma vida | ✅ | 9 de 9 (amor_da_vida 299, estrela 256, familia_grande 459, fortuna 100, imperio 27, lugar_no_mundo 982, os_netos 78, presidencia 35, volta_ao_mundo 428) |

## O segundo ato (bloco S2)

O sonho realizado traz o dia do sonho (a cena do topo); o fim de qualquer sonho traz, no ano seguinte, a pergunta do que vem depois; e a segunda metade da vida tem sonhos próprios (a fortuna, o lugar no mundo, a volta ao mundo, os netos).

| Portão | Situação | Valor |
|---|---|---|
| O dia do sonho chega: ≥ 95% dos sonhos realizados (os que têm a cena) vivem o dia do sonho | ✅ | 98,0% de 1076 |
| Depois do sonho, a pergunta: ≥ 50% dos sonhos que acabaram chegam ao "e agora?" ou ao "sonho que ficou" | ✅ | 88,2% de 13909 |
| A segunda metade tem direção: ≥ 50% dos anos dos 50 em diante com um sonho de pé (eram 30%) | ✅ | 52,1% |

## O sonho que passa adiante (bloco S3)

O sonho que não veio pode ser contado a quem vem depois: o filho mais velho o carrega, e quem continua a história começa a vida com ele de pé. Medido nas gerações das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| O sonho passa adiante: alguma geração herdeira começa a vida com o sonho de quem veio antes (≥ 2% das herdeiras) | ✅ | 47,8% de 414 gerações herdeiras (2 gerações passaram um sonho adiante) |
| O sonho herdado se realiza em alguma vida | ✅ | 39 de 198 |

## A bolsa de verdade (bloco H7)

A empresa na bolsa emite ações (o dinheiro vai para o caixa e a parte de quem joga encolhe), recompra a maioria e toma a concorrente numa oferta hostil, sem pedir ao dono; sem a maioria, alguém pode comprar o controle dela.

| Portão | Situação | Valor |
|---|---|---|
| A oferta hostil acontece: ≥ 0,1% das vidas tentam tomar a concorrente na bolsa | ✅ | 0,10% |
| A oferta hostil nem sempre passa: das ofertas, as que passam ficam entre 30% e 85% | ✅ | 75,0% de 20 |
| Quem perde a maioria na bolsa pode perder a empresa: a oferta contra quem joga acontece (≥ 0,05% das vidas) | ✅ | 0,11% das vidas · recomprou 0, vendeu 0, brigou 11 |
| Emitir ações acontece: ≥ 0,2% das vidas | ✅ | 0,27% (recompras: 0) |

## O ano em etapas (fatia 1.3)

O ano é uma lista de 29 etapas, cada uma com o que lê e escreve declarado (`manifesto.ts › ETAPAS_DO_ANO`); `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou. Pelas declarações, cada etapa lê o valor deste ano do que uma etapa anterior escreveu, e o do ano passado do que vem depois dela. A CPU é a de uma amostra de 240 vidas rodada sozinha, depois das outras (que rodam em 4 trabalhadores); o livro, o que cada etapa deixa no save, em 1 jogador de cada 10.

| Etapa | CPU por vida | Da CPU | Livro por vida | Lê deste ano, de | Lê do ano passado, de |
|---|---|---|---|---|---|
| exterior (o mundo lá fora: a economia de cada país, a relação, sanções e acordos) | 2,16 ms | 1,3% | 32,8 KB | — | guerra, pais, moeda, pesquisa, empresa, poder, coroa, iniciativas, diretor |
| guerra (a defesa: o armamento encomendado chega, e a guerra começa, segue ou acaba) | 0,54 ms | 0,3% | 0,0 KB | exterior | pais, moeda, pesquisa, empresa, personagens, poder, coroa, iniciativas, diretor |
| pais (o país: as estatísticas, a eleição, quem governa, a fase do ciclo e o calote) | 5,28 ms | 3,1% | 63,6 KB | exterior, guerra | moeda, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, poder, coroa, regras, iniciativas, diretor |
| moeda (o dinheiro: a inflação que vai para quem emitiu, o caixa do governo, o câmbio, o crédito dos bancos e a emissão do Banco Central) | 0,76 ms | 0,4% | 32,0 KB | guerra, pais | empresa, bens, tesouro, dividas, personagens, regras, iniciativas, diretor |
| setores (os mercados de cada setor: a obra que fica pronta, a procura do ano e o preço que decide a obra do ano que vem) | 2,45 ms | 1,4% | 92,0 KB | pais | empresa, iniciativas, diretor |
| pesquisa (a pesquisa: a tecnologia do país vira descoberta (a cura, o satélite, a patente) ou fuga de cérebros) | 0,18 ms | 0,1% | 0,3 KB | guerra, pais | empresa, poder, coroa, iniciativas, diretor |
| mercado (o mercado do ano: quanto cada classe de investimento rendeu) | 0,69 ms | 0,4% | 18,5 KB | pais | iniciativas, diretor |
| economia (a economia de quem joga: inflação, juros, salário, imposto, gastos) | 2,25 ms | 1,3% | 29,0 KB | pais, mercado | empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, iniciativas, diretor |
| empresa (as empresas: o negócio do ano (vendas, custos, imposto, caixa, dividendos, obra), os empregos da cidade e a quebra) | 12,77 ms | 7,4% | 49,7 KB | tudo o que veio antes | bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa, padrao, projetos, segredos, lugar, regras, morte, amor, iniciativas, diretor |
| bens (os bens: valor, manutenção, aluguel e o financiamento) | 1,49 ms | 0,9% | 15,5 KB | pais, moeda, mercado, economia, empresa | tesouro, dividas, promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| tesouro (os títulos do Tesouro: o cupom do ano e o que venceu) | 0,39 ms | 0,2% | 2,7 KB | pais, moeda, economia, empresa, bens | dividas, promissorias, personagens, regras, iniciativas, diretor |
| dividas (as dívidas: a parcela do acordo, o limite, o que caduca e o nome) | 0,48 ms | 0,3% | 0,2 KB | pais, moeda, economia, empresa, bens, tesouro | promissorias, personagens, trabalho, carreira, poder, coroa, regras, iniciativas, diretor |
| promissorias (os empréstimos entre pessoas: a parcela, o atraso que magoa, a quitação e o calote) | 0,36 ms | 0,2% | 1,5 KB | pais, economia, empresa, bens, tesouro, dividas | personagens, segredos, iniciativas, diretor |
| privacao (a privação: o buraco que nem o crédito cobriu) | 0,05 ms | 0,0% | 0,0 KB | economia | corpo, personagens, projetos, iniciativas, diretor |
| corpo (o corpo e o humor de quem joga: idade, escola, marcas, dívida pesada, conforto) | 2,36 ms | 1,4% | 21,8 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao | personagens, trabalho, carreira, poder, coroa, projetos, lugar, morte, iniciativas, diretor |
| personagens (a família e os amigos: saúde, vínculo, dinheiro, trabalho, morte) | 5,68 ms | 3,3% | 77,6 KB | exterior, guerra, pais, moeda, setores, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo | trabalho, carreira, poder, coroa, projetos, segredos, regras, morte, iniciativas, diretor |
| trabalho (o trabalho de quem joga: salário e demissão) | 0,29 ms | 0,2% | 1,5 KB | pais, setores, pesquisa, empresa, promissorias, personagens | carreira, poder, coroa, iniciativas, diretor |
| carreira (a carreira: promoção, fama e o fim da carreira) | 0,46 ms | 0,3% | 2,0 KB | guerra, pais, pesquisa, empresa, bens, promissorias, corpo, personagens, trabalho | poder, coroa, projetos, morte, iniciativas, diretor |
| poder (o poder: influência, popularidade, mandato e queda) | 2,64 ms | 1,5% | 4,7 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, personagens, trabalho, carreira | coroa, morte, iniciativas, diretor |
| coroa (a coroa: a ilha anda e quem tem coroa recebe a dotação da forma) | 0,14 ms | 0,1% | 0,0 KB | guerra, pais, pesquisa, empresa, trabalho, carreira, poder | iniciativas, diretor |
| padrao (o padrão de vida: a conta que chega quando a reserva acaba) | 0,05 ms | 0,0% | 0,0 KB | pais, economia, empresa, bens, tesouro, dividas, promissorias, personagens | iniciativas, diretor |
| projetos (os projetos: a meta alcançada vira conquista, o prazo passado vira fracasso) | 1,99 ms | 1,2% | 2,4 KB | tudo o que veio antes | segredos, lugar, regras, morte, amor, iniciativas, diretor |
| segredos (os segredos: quem sabe pode contar, e a notícia que chega ao alvo agenda a revelação) | 2,71 ms | 1,6% | 0,1 KB | tudo o que veio antes | lugar, regras, morte, amor, iniciativas, diretor |
| lugar (o lugar no país e os marcos do grupo: a faixa nova, a volta e a queda, com o porquê) | 5,08 ms | 2,9% | 1,5 KB | exterior, guerra, pais, moeda, setores, pesquisa, mercado, economia, empresa, bens, tesouro, dividas, promissorias, personagens, projetos, segredos | morte, iniciativas, diretor |
| regras (fecha as regras do ano numa entrada invisível do livro) | 4,17 ms | 2,4% | 17,5 KB | pais, moeda, setores, empresa, bens, tesouro, dividas, privacao, corpo, personagens, projetos | morte, iniciativas, diretor |
| morte (a morte: a do corpo e a da violência) | 1,02 ms | 0,6% | 0,4 KB | guerra, pais, pesquisa, economia, empresa, bens, tesouro, dividas, promissorias, privacao, corpo, personagens, trabalho, carreira, poder, coroa, projetos, lugar | iniciativas, diretor |
| amor (o amor que aparece e o namoro que esfria) | 0,12 ms | 0,1% | 0,0 KB | empresa, promissorias, corpo, personagens | iniciativas, diretor |
| iniciativas (o que os personagens resolvem fazer (o conteúdo)) | 29,58 ms | 17,2% | 2,2 KB | tudo o que veio antes | diretor |
| diretor (o storylet do ano, o agendado ou a linha curta (o conteúdo)) | 18,10 ms | 10,5% | 1,5 KB | tudo o que veio antes | — |
| fora das etapas (nascer, escolher, agir, operar e os robôs) | 67,94 ms | 39,5% | — | — | — |

O save de uma vida (amostra de 1040): mediana 542 KB, p90 671 KB, máximo 1179 KB; o livro é 97,2% dele. A vida de quem herda começa um livro novo, então o save de uma dinastia é o da geração que está viva.

| Portão | Situação | Valor |
|---|---|---|
| O save de uma vida cabe no orçamento: o maior da amostra ≤ 1 MB | ❌ | 1179 KB (mediana 542 KB, 1040 vidas) |
| A CPU por vida não passa de +10% da fatia 1.2 sem decisão registrada | ❌ | 172,17 ms (base 43,74 ms, teto 48,11 ms) |

## Os filhos (fatia 1.4a)

Um filho novo não toma o lugar de outro: cada um tem id próprio (`filho`, `filho2`…), vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, a herança se divide entre os filhos vivos.

| Filhos por vida | Nenhum | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Vidas | 55,3% | 25,2% | 14,4% | 4,9% | 0,2% |

Entre as vidas com filhos (44,7%), a média é de 1,56 filhos.

| Portão | Situação | Valor |
|---|---|---|
| Família de mais de um filho acontece, sem virar regra: entre 5% e 40% das vidas | ✅ | 19,6% |
| Herança dividida entre irmãos acontece: de quem tem filho para continuar, entre 5% e 50% tem irmãos | ✅ | 22,1% |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 53,6% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 905 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 9,23 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ❌ | 485,2 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 11,0% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,0% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,3% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,33 |
| Saturação V20 ≤ 95% | ✅ | 86,8% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 905 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 172,17 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 85,0% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 66,7% (168 dinastias, média de 3,5 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,88 (414 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 276 mil / R$ 378 mil / R$ 699 mil; p10 R$ 223 mil / R$ 190 mil / R$ 126 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 3,17% (p99 R$ 301 milhões, maior R$ 6,8 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,27% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 33,8% de 64,4% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 14,2% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 86,8% |
| Assinaturas sem regressão (≥ 918) | ❌ | 905 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ❌ | 485,2 |
| CPU por vida ≤ 30 ms | ❌ | 172,17 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 22 de 22 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 97,6% (10,3 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 71,6% de 3883 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (654), A festa do século (567), Pix para a cidade inteira (372), Uma estátua sua (281), Um conselho que diz não (246), Uma fundação com seu nome (171), Bancar um presidente (169), Trazer a Copa do Mundo (149), Um mural de problemas (145), Uma equipe para desmontar (144), Tornar-se dispensável (141), Bancar quem quer sair (124), Pagar a cura de uma doença (124), Um programa espacial (119), Restaurar a monarquia (99), Tomar o poder (94), Comprar a estatal (74), Fundar uma cidade (72), Ficar no poder (64), Salvar o país da crise (30), Fundar um país (29), Uma colônia em Marte (15).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 5 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 33,2% de 1955 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 30,6% delegaram, 57,2% centralizaram (565 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 45,1% (43,6 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (762), Bancar quem quer sair (395), Um mural de problemas (359), Uma equipe para desmontar (349), Tornar-se dispensável (325).
- **Na morte de quem manda:** a empresa perde em média 26,7% do valor; dependência p10 / mediana / p90: 24 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 2, p99 8, maior 20 anos (14847 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 981 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 53,2% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de um Brasil que envelhece: normal 45–72%, aquecida 15–30%, recessão 7–22%, crise 1–8% dos anos | ✅ | 50,3% / 26,8% / 17,5% / 5,3% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 17,7 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 25,9%, o bloco liberal 24,5%, a aliança da ordem 24,6%, o centrão 25,0%; 8,2 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,5%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (1,61% × 1,00%); ✓ dívida menor com a aliança da ordem que com o centrão (73% × 84% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,24% contra 0,64% por ano (40649 e 61122 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ❌ | 1,20 votos por vida, 31,3% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 1,85 × 0,76 pontos do PIB por ano (150 e 147 governos); 94,3% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,1% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 196.275 | 1,0% | 8,2% | 4,9% | 82% | 21,0% | 20,5 | 58 | 55 | 51% |
| o centrão | 189.938 | 1,2% | 8,2% | 4,9% | 84% | 25,0% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 187.014 | 0,8% | 8,4% | 5,4% | 73% | 29,5% | 17,6 | 50 | 45 | 53% |
| o bloco liberal | 186.010 | 1,6% | 8,5% | 3,3% | 81% | 29,5% | 22,1 | 42 | 50 | 52% |
| quem joga | 12.452 | 0,7% | 8,4% | 7,0% | 70% | 25,1% | 18,6 | 52 | 50 | 50% |
| o regime | 5.890 | 0,9% | 8,9% | 10,3% | 12% | 31,4% | 16,9 | 37 | 37 | 44% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 28,2% de 7504 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 4,7% fundiram, 3,6% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ❌ | nunca (26); nas vidas jogadas, o maior grupo teve 1372 (p99 175) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,14 ponto em média (46666 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,39 na bolsa (6212 empresas-ano) × -0,00 fechadas (185573) |

## Portões do incremento 10 (o mundo lá fora)

| Portão | Situação | Valor |
|---|---|---|
| A crise lá fora chega aqui: ≥ 10% das viradas para recessão ou crise apontam a crise de um país de fora como causa | ✅ | 38,5% de 61474 viradas |
| O dólar anda e volta: p90 ≥ 1,3× o p10, com a mediana entre R$ 4 e R$ 6 | ✅ | p10 R$ 4,16 · mediana R$ 5,13 · p90 R$ 6,39 |
| O dólar pesa na inflação: nos anos em que ele sobe 10% ou mais, a inflação é ≥ 1 ponto maior do que nos anos em que cai 10% ou mais | ✅ | 6,0% × 3,7% |
| O dólar divide os setores: na alta do dólar, a empresa do agro cresce mais e a do comércio menos | ✅ | 0,46 no agro (5422 empresas-ano) × -0,41 no comércio (25347), por ponto de alta |
| Sanções e acordos acontecem e acabam: sanção em 5% a 40% das vidas, acordo em ≥ 30%, e ≥ 90% das sanções acabam em até 15 anos | ✅ | sanção em 34,6%, acordo em 74,7%; 95,7% das sanções acabam em até 15 anos (mediana 4, p90 10) |
| Toda sanção tem um porquê: ≥ 80% apontam a decisão que esfriou a relação (a posse de um governo, a tarifa, o ato de quem governa, uma escolha) | ✅ | 87,3% de 5234 sanções |
| Alinhar-se tem preço e abrir tem prêmio: as 2 direções certas | ✅ | ✓ a Celeste sanciona mais com a aliança da ordem (amiga da rival dela) que com a frente popular (amiga dela) (1,89% × 0,15% por ano); ✓ mais acordos com a fronteira aberta (bloco liberal) que fechada (aliança da ordem) (3,75% × 0,33% por ano) |
| Quem governa decide lá fora: ≥ 50% de quem governa faz um ato, e romper traz sanção em até 5 anos em ≥ 30% dos casos, a visita de Estado em ≤ 5% | ✅ | 69,2% de 383 governos; sanção depois de romper 32,8%, depois da visita 2,4% (laboratório de 250 governos) |

| Governo | Anos | Sanções que começaram (por ano) | Acordos que começaram (por ano) |
|---|---|---|---|
| a frente popular | 196.275 | 0,19% | 2,94% |
| o centrão | 189.938 | 0,16% | 0,57% |
| a aliança da ordem | 187.014 | 1,93% | 0,33% |
| o bloco liberal | 186.010 | 0,28% | 3,75% |
| quem joga | 12.452 | 1,85% | 3,36% |
| o regime | 5.890 | 3,79% | 0,00% |

## Portões do bloco A (o país em números)

| Portão | Situação | Valor |
|---|---|---|
| Os números do país são plausíveis no fim da vida: IDH mediano entre 0,75 e 0,95, Gini mediano entre 0,42 e 0,6 e população mediana entre 150 e 230 milhões | ✅ | IDH 0,813, Gini 0,529, população 194 milhões |
| O país termina diferente de vida para vida: p90 − p10 ≥ 0,03 no IDH e no Gini | ✅ | IDH 0,781–0,851, Gini 0,482–0,562 |
| Os números viram história: cada uma das 5 histórias do país em números aparece em ≥ 2% das vidas | ✅ | pib_recorde 2,3% · desigualdade_no_jornal 5,8% · idh_muito_alto 6,1% · idh_em_queda 4,0% · pais_envelhece 9,3% |

| No fim da vida | p10 | mediana | p90 |
|---|---|---|---|
| IDH | 0,781 | 0,813 | 0,851 |
| Desigualdade (Gini) | 0,482 | 0,529 | 0,562 |
| População (milhões) | 183 | 194 | 205 |
| PIB per capita | R$ 87 mil | R$ 132 mil | R$ 201 mil |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 53,6% / 86,8% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 62,8% |
| Efeito da memória (aleatória, V5 sem → com memória) | 57,2% → 48,3% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 905 (574) |
| Mobilidade: mesmo quintil da origem ao fim | 26,9% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,0% / 3,3% |
| Patrimônio p90/p10 | 286,8× (p10 R$ 223 mil, p90 R$ 64 milhões) |
| Desvio-padrão da felicidade média da vida | 9,23 |
| Vidas com patrimônio negativo ao morrer | 0,9% |
| Mudanças de estado causadas pelo jogador | 43,2% |
| Toques por vida | 485,2 |
| Tempo de CPU por vida | 172,17 ms |
| Ações (fichas usadas) por vida | 154,3 |
| Mortes na família por vida | 4,9 |
| Pontos de virada que vêm do mundo (não do jogador) | 11,0% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 37,1 |
| Vidas que terminam com alguém para continuar a história | 85,0% (filho ou filha 41,3%, sobrinho ou sobrinha 42,2%, o par 0,7%, o amigo 0,9%) |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,5 / 66,7% / 39,9% |
| Idade de quem herda ao começar (mediana) / herança mediana | 37 anos / R$ 4,2 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,88 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 64,4% |
| Entre quem abriu: quebrou / vendeu | 33,8% / 22,4% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2 milhão / R$ 40 milhões / R$ 301 milhões / R$ 6,8 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 30,06% / 3,17% / 0,27% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 14,2% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 62,3 / 154,3 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 223 mil | R$ 276 mil | R$ 336 mil |
| moderado | R$ 190 mil | R$ 378 mil | R$ 685 mil |
| arrojado | R$ 126 mil | R$ 699 mil | R$ 3 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 820 | R$ 183 mil | R$ 2,1 milhões | R$ 36 milhões |
| moderado | 876 | R$ 187 mil | R$ 2,1 milhões | R$ 26 milhões |
| arrojado | 804 | R$ 160 mil | R$ 2,4 milhões | R$ 38 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 68,7 | R$ 4,4 milhões | 72,1 |
| pobre | 104 | 70,1 | R$ 1,6 milhão | 75,0 |
| remediada | 24 | 69,5 | R$ 1,1 milhão | 74,6 |
| media | 64 | 68,5 | R$ 3,1 milhões | 73,5 |
| rica | 64 | 70,4 | R$ 5,6 milhões | 74,7 |
| muito rica | 144 | 69,0 | R$ 20 milhões | 74,3 |
| bilionaria | 356 | 71,1 | R$ 2 bilhões | 75,8 |
| trilionaria | 276 | 71,7 | R$ 600 bilhões | 76,6 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 50% / 27% / 18% / 5% |
| Notícias do país por vida | 47,3 |
| Demissões por vida / vindas de uma recessão ou crise | 0,53 / 46,8% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 26 |
| Setor do último trabalho | serviço público 60% · serviços 13% · saúde 12% · cultura e internet 4% · comércio 3% · agro 2% · sem setor 2% · transporte e entregas 2% · construção 1% · tecnologia 1% · indústria 1% · finanças 0% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 23% | 36% | 45% | 54% | 74% | 82% | 87% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 21% | 18% | 17% | 14% |
| Q2 | 30% | 22% | 17% | 17% | 14% |
| Q3 | 24% | 23% | 19% | 20% | 14% |
| Q4 | 12% | 25% | 27% | 21% | 15% |
| Q5 | 3% | 8% | 20% | 26% | 42% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,1 | R$ 1,6 milhão | 73,4 |
| família pobre | 24% | 69,9 | R$ 1,5 milhão | 73,6 |
| família remediada | 20% | 71,1 | R$ 2 milhões | 73,7 |
| classe média | 18% | 70,0 | R$ 2,9 milhões | 73,4 |
| família rica | 13% | 70,6 | R$ 5,1 milhões | 73,8 |
| família muito rica | 13% | 69,9 | R$ 22 milhões | 74,3 |
| família bilionária | 3% | 71,2 | R$ 2,8 bilhões | 76,7 |

## Repetição

- **Dentro de uma vida:** 9,0% das aparições repetem uma instância já vista na mesma vida; pior vida: 37,5%.
- **Texto repetido entre vidas:** 27,5% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,3 · `aposentadoria` 1,6 · `irmao_nasce` 0,5 · `avo_mesada_escondida#avo` 0,4 · `o_sonho_que_ficou` 0,4 · `namoro_esfriou#amor` 0,3

## Dilemas

Medidos em três bolsos de adulto: pobre (R$ 1 mil na conta e R$ 18 mil de renda por ano), típico (R$ 10 mil na conta e R$ 30 mil de renda por ano), rico (R$ 50 milhões na conta e R$ 600 mil de renda por ano). Os storylets que pedem empresa se medem com uma de R$ 1 milhão, inteira de quem joga.

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum, nos três bolsos
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade; contam só os storylets com 2 ou mais opções sem condição e alguma com risco, os que a conta olha): pobre 168 de 360 (47%) · típico 167 de 360 (46%) · rico 181 de 360 (50%). Algumas são armadilhas de propósito.
  - No típico: `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `ex_liga_de_madrugada`, `ex_nas_redes`, `ex_cobra`, `mais_um_filho`, `irmao_mais_velho_defende`, `cobranca_da_magoa`, `chefe_hora_extra`, `chefe_magoado_cobra`, `colega_rouba_ideia`, `romance_no_trabalho`, `colega_de_licenca`, `o_caso_vem_a_tona`, `devedor_some`, `cobranca_do_filho`, `planilha_das_dividas`, `casamento_dos_outros`, `o_primeiro_palco`, `o_video_que_viralizou`, `o_debate_na_tv`, `o_quarto_vazio`, `o_natal_barulhento`, `mais_um_para_a_mesa`, `a_convocacao`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `o_veterano`, `quartel_sem_verba`, `olimpiada_do_instituto`, `contaram_do_caso`, `a_divida_escondida`, `a_divida_vem_a_tona`, `a_festa_escondida`, `a_foto_da_festa`, `contaram_do_esquema`, `a_auditoria`, `o_neto_no_fim_de_semana`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `depois_da_venda`, `choque_de_culturas`, `o_conselho_vetou`, `acampamento_na_porta`, `ferias_do_dono`, `o_primeiro_bilhao`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `o_recall`, `a_licitacao`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `a_opa_da_rival`, `a_opa_do_fundo`, `idh_em_queda`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`, `escandalo_do_lobby`, `o_processo_da_marca`, `tomar_o_poder`, `restaurar_a_monarquia`.
  - No pobre, a mais que no típico: `entregador_chuva`, `frete_sumiu`, `imovel_na_baixa`, `pib_recorde`; a menos: `fila_do_emprego`, `chefe_novo`, `cliente_preso`.
  - No rico, a mais que no típico: `carreira_futebol`, `mei_negocio`, `confeitaria_da_vo`, `viralizou`, `sociedade_amigo`, `crise_40`, `vereador`, `herdeiro_gastao`, `zona_franca`, `vaga_no_agro`, `emprego_negocios`, `franquia`, `montadora_vai_fechar`, `gerente_do_banco`, `seguranca_particular`, `lista_dos_mais_ricos`, `fundacao_com_seu_nome`, `time_a_venda`, `largar_tudo`, `lesao_grave`, `pib_recorde`, `pais_envelhece`; a menos: `negocio_no_aperto`, `alavancagem`, `giz_do_proprio_bolso`, `fazenda_a_venda`, `royalties_secaram`, `depois_da_venda`, `desemprego_em_alta`, `queda_do_cargo`.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `intercambio`, `burnout`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `pressao_carreira`, `parcela_da_tv`, `reconciliacao`, `padrinho_casamento`, `pais_aposentados`, `briga_de_casal`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_sempre_trabalhando`, `amor_quadro_de_tarefas`, `filho_briga_na_escola`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `segunda_chance`, `irmao_separou`, `fazer_as_pazes`, `chefe_elogia`, `chefe_magoado_cobra`, `devedor_some`, `ajudar_com_a_casa`, `festa_de_80`, `jantar_esfriou`, `as_criancas_perguntam`, `amor_vai_embora`, `o_preco_do_imperio`, `rua_contra_a_taxa_da_coroa`, `a_conta_da_coroa`, `filho_convocado`, `racionamento`, `fabrica_de_municao`, `guerra_na_escola`, `o_veterano`, `quartel_sem_verba`, `edital_da_ciencia`, `o_laboratorio_apaga_a_luz`, `contaram_do_caso`, `chantagem_do_caso`, `confessar_o_caso`, `desabafar_o_caso`, `a_divida_vem_a_tona`, `contaram_da_divida`, `confessar_a_divida`, `contaram_da_festa`, `o_dia_do_sonho_imperio`, `o_dia_do_sonho_presidencia`, `a_promessa_cobrada`, `o_seu_sonho_nas_maos`, `o_neto_no_fim_de_semana`, `o_neto_pergunta_do_sonho`, `renegociar_cartao`, `treinar_no_clube`, `carro_de_presente`, `estagio_do_pai`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `aluguel_caro`, `reencontro_amigo_brigado`, `lembranca_primeiro_amor`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `vaga_no_agro`, `tentar_a_vida_na_europa`, `transito_de_sp`, `despejo`, `mestrado_fora`, `proposta_pelo_negocio`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `robos_na_fabrica`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `vaga_na_empresa_dele`, `giz_do_proprio_bolso`, `vendas_recorde`, `turno_extra_na_fabrica`, `layoff_por_email`, `clientes_em_panico`, `pedreiro_vale_ouro`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `lista_dos_mais_ricos`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `fundar_uma_cidade`, `comprar_a_estatal`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `apagao`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `choque_de_culturas`, `subsidiaria_esquecida`, `oferta_pela_subsidiaria`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `o_sindicato_dos_dez_mil`, `a_avenida_com_o_seu_nome`, `o_logo_no_aeroporto`, `o_ministro_liga`, `a_seguranca_da_lista`, `o_primeiro_bilhao`, `o_mais_rico_quer_a_sua_empresa`, `cobrir_a_tatuagem`, `aluguel_com_nome_sujo`, `celular_dos_pais`, `segredo_de_familia`, `amigo_ficou_rico`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `filho_quer_trabalhar_na_empresa`, `conselho_quer_ceo`, `caixa_sobrando`, `greve_do_piso`, `imposto_do_ano`, `receita_recorde`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `infancia_no_palacio`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `bola_autografada`, `peneira_do_sobrenome`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `circo_vai_embora`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `o_preco_remarcado`, `a_impressora_ligada`, `o_credito_sumiu`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `deploy_de_sexta`, `proposta_em_dolar`, `aluno_impossivel`, `pane_no_voo`, `final_da_copa`, `turne_nacional`, `livro_viralizou`, `cliente_perdeu_tudo`, `noite_de_corridas`, `obra_atrasada`, `promocao_em_outra_cidade`, `fa_obcecado`, `guerra_de_precos`, `concorrente_quebrou`, `a_parcela_do_banco`, `faltou_gente`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `carro_de_luxo_na_rua`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `cavalo_campeao`, `dono_do_clube`, `exportacao_bate_recorde`, `sancao_parou_o_porto`, `ameaca_de_sancao`, `guerra_comercial`, `importado_invadiu`, `a_opa_do_fundo`, `juros_altos_na_fatura`, `divida_publica_assusta`, `protesto_na_avenida`, `oposicao_na_tv`, `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`, `decreto_da_economia`, `crise_internacional`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`, `o_cartel_vazou`, `o_rival_quer_comprar`, `o_processo_da_marca`, `ficar_no_poder`, `tomar_o_poder`, `restaurar_a_monarquia`
- **Na beira (as 20 que menos aparecem, em vidas de 10000):** `fundar_uma_cidade` 1 · `comprar_a_estatal` 1 · `apagao` 1 · `conglomerado_com_desconto` 1 · `jatinho_para_onde` 1 · `segundo_foguete` 2 · `capa_de_revista` 2 · `subsidiaria_esquecida` 2 · `dono_do_clube` 2 · `amor_igreja` 3 · `documentario` 3 · `herdeiros_de_olho` 3 · `primeiro_balanco_na_bolsa` 3 · `tudo_pela_sua_mesa` 3 · `cobrir_a_tatuagem` 3 · `aluno_impossivel` 3 · `jornal_e_o_aliado` 3 · `restaurar_a_monarquia` 3 · `amor_vai_embora` 4 · `fundacao_premio` 4
- **Apresentados por vida:** 62,3 · **com causa anterior (cadeia):** 88,4 · **maior distância causa→consequência:** 48,4 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `o_que_voce_quer_da_vida` | evento | 99,7% |
| `primeiro_dia_escola` | evento | 99,4% |
| `namoro` | evento | 98,9% |
| `luto` | npc | 94,3% |
| `enem` | evento | 90,3% |
| `trabalho_grande` | acao | 73,4% |
| `o_sonho_que_ficou` | evento | 73,0% |
| `programa_junto` | acao | 70,4% |
| `casamento_do_irmao` | evento | 67,8% |
| `primeiro_voto` | evento | 66,5% |
| `aposentadoria` | evento | 64,9% |
| `curso_online` | acao | 63,6% |
| `bico_adulto` | acao | 61,8% |
| `correr_no_quintal` | acao | 60,5% |
| `ler_gibi` | acao | 57,7% |
| `parquinho` | acao | 57,5% |
| `formatura` | evento | 55,9% |
| `tocar_empresa` | acao | 54,6% |
| `almoco_domingo` | acao | 54,3% |
| `o_que_voce_quer_do_amor` | evento | 53,1% |
| `irmao_nasce` | evento | 53,0% |
| `conversar_de_verdade` | acao | 52,6% |
| `padrinho_do_sobrinho` | evento | 52,1% |
| `saudade_de_voce` | npc | 50,2% |
| `cuidar_da_doenca` | npc | 49,9% |
| `mochilao` | acao | 49,5% |
| `avo_mesada_escondida` | npc | 49,1% |
| `perdeu_emprego_na_crise` | npc | 48,2% |
| `presente_certo` | acao | 47,3% |
| `dizer_umas_verdades` | acao | 46,7% |
| `pedir_conselho` | acao | 46,6% |
| `visitar_familia` | acao | 46,6% |
| `ligar_amigo` | acao | 46,4% |
| `oferecer_ajuda` | acao | 45,8% |
| `eleicao_geral` | evento | 42,9% |
| `primeiro_emprego` | evento | 42,1% |
| `doente_crianca` | npc | 41,9% |
| `pos_graduacao` | acao | 41,7% |
| `filho_adolescente` | evento | 41,4% |
| `pedir_um_pix` | acao | 41,4% |
| `demissao` | evento | 41,4% |
| `paquerar` | acao | 41,0% |
| `estudar_concurso` | acao | 40,5% |
| `academia` | acao | 39,9% |
| `pedir_emprestado` | acao | 39,1% |
| `baile_terceira_idade` | acao | 39,0% |
| `caminhada` | acao | 39,0% |
| `reclama_que_voce_sumiu` | npc | 38,9% |
| `namoro_esfriou` | evento | 38,5% |
| `vontade_ver_o_mar` | npc | 37,8% |
| `esperou_por_voce` | npc | 37,6% |
| `ouvir_historia` | acao | 35,6% |
| `estudar_escola` | acao | 35,6% |
| `briga_com_o_irmao` | evento | 35,3% |
| `ler_livros` | acao | 34,1% |
| `filho_formatura` | evento | 34,1% |
| `hidro_com_a_turma` | acao | 33,7% |
| `rabiscar_parede` | acao | 33,2% |
| `vontade_de_um_bicho` | npc | 33,0% |
| `correr` | acao | 32,4% |
| `viagem_la_para_fora` | evento | 32,4% |
| `estudar_enem` | acao | 31,9% |
| `perguntar_porque` | acao | 31,7% |
| `cupido_do_irmao` | acao | 31,3% |
| `videogame_do_amigo` | acao | 31,0% |
| `balde_da_pracinha` | evento | 30,7% |
| `creche_ou_vo` | evento | 30,4% |
| `estudar_faculdade` | acao | 29,8% |
| `bullying_recreio` | evento | 29,6% |
| `role` | acao | 29,6% |
| `estudar_tabuada` | acao | 29,1% |
| `falando_bem_de_voce` | npc | 29,1% |
| `pedir_desculpas` | acao | 29,1% |
| `check_up` | acao | 28,8% |
| `cuidar_de_doente` | acao | 28,8% |
| `guardar_dinheiro` | acao | 28,7% |
| `primeiro_investimento` | evento | 28,7% |
| `natacao_no_clube` | acao | 28,5% |
| `ajudar_em_casa` | acao | 28,2% |
| `pre_escola` | evento | 28,0% |
| `a_crise_dos_cinquenta` | evento | 27,5% |
| `amigo_em_apuros` | npc | 27,5% |
| `bilhete_carinhoso` | npc | 27,2% |
| `acidente_em_casa` | evento | 27,0% |
| `vontade_viagem_com_amigo` | npc | 26,2% |
| `piada_no_grupo` | npc | 26,0% |
| `encontro` | acao | 25,9% |
| `festa_da_cidade` | acao | 25,1% |
| `pelada` | acao | 25,0% |
| `socorro_com_as_criancas` | acao | 24,9% |
| `visitar_o_tumulo` | acao | 24,7% |
| `perdeu_aniversario` | npc | 24,5% |
| `show_no_estadio` | acao | 24,4% |
| `copa_do_mundo` | evento | 24,2% |
| `viagem_realizada` | evento | 24,2% |
| `festa_80` | evento | 23,6% |
| `cachorro_caramelo` | evento | 23,5% |
| `amor_quer_casar` | npc | 23,4% |
| `historias_ou_telas` | evento | 23,2% |
| `vontade_voltar_a_terra` | npc | 23,2% |
| `empresa_quebrou` | evento | 23,1% |
| `vacina_no_posto` | evento | 22,6% |
| `bico_adolescente` | acao | 22,4% |
| `primeiro_celular` | evento | 22,4% |
| `investir_tesouro` | acao | 22,3% |
| `rebalancear` | acao | 21,8% |
| `e_agora` | evento | 21,8% |
| `curso_nota_alta` | evento | 21,7% |
| `primeiro_beijo` | evento | 21,6% |
| `avo_conta_historias` | npc | 21,3% |
| `viagem_dos_sonhos` | evento | 21,2% |
| `esporte_depois_da_aula` | evento | 21,0% |
| `festa_junina` | evento | 21,0% |
| `casamento` | npc | 20,7% |
| `cursinho_pago` | acao | 20,7% |
| `tentar_um_filho` | acao | 20,2% |
| `cozinhar_com_a_avo` | acao | 20,1% |
| `o_primeiro_palco` | evento | 20,0% |
| `colesterol_alto` | evento | 19,8% |
| `futebol_de_varzea` | acao | 19,8% |
| `previdencia` | acao | 19,7% |
| `festa_tema` | evento | 19,4% |
| `hora_extra` | acao | 19,1% |
| `banda_garagem` | evento | 19,1% |
| `cortar_gastos` | acao | 18,9% |
| `amigo_pede_dinheiro` | evento | 18,8% |
| `tempo_com_amor` | acao | 18,8% |
| `emprego_saude` | evento | 18,7% |
| `primeira_palavra` | evento | 18,3% |
| `vender_doce` | acao | 18,1% |
| `voltar_a_estudar` | acao | 18,0% |
| `pisa_em_ovos` | npc | 17,8% |
| `viajar_com_o_amigo` | acao | 17,7% |
| `oportunidade_de_negocio` | evento | 17,5% |
| `corte_de_salario` | evento | 17,5% |
| `salario_em_dolar` | evento | 17,5% |
| `carro` | evento | 17,2% |
| `investimento_furado` | evento | 17,2% |
| `golpe_pix` | evento | 17,2% |
| `o_bebe_chegou` | evento | 17,2% |
| `feira_ciencias` | evento | 17,1% |
| `filho` | npc | 17,1% |
| `pai_ausente_volta` | npc | 17,1% |
| `doar_sangue` | evento | 16,9% |
| `mesada` | evento | 16,8% |
| `largar_tudo` | evento | 16,4% |
| `bet` | evento | 16,3% |
| `entregas` | acao | 16,0% |
| `a_maior_empresa_na_cidade` | evento | 15,8% |
| `pelada_de_quinta` | evento | 15,8% |
| `tempo_com_filho` | acao | 15,5% |
| `criptomoeda` | evento | 15,4% |
| `o_mais_rico_na_tv` | evento | 15,3% |
| `mais_um_filho` | npc | 15,2% |
| `vape_festa` | evento | 15,1% |
| `ingles_crianca` | acao | 15,0% |
| `a_festa_escondida` | evento | 15,0% |
| `curso_nota_media` | evento | 15,0% |
| `catapora` | evento | 14,9% |
| `subir_de_padrao` | evento | 14,7% |
| `crise_la_fora` | evento | 14,6% |
| `reforma_da_casa` | evento | 14,3% |
| `orgulho_da_formatura` | npc | 14,2% |
| `data_da_partida` | evento | 14,1% |
| `casa_dos_pais` | evento | 14,1% |
| `tatuagem` | evento | 14,0% |
| `filho_desenho` | npc | 14,0% |
| `vontade_ver_o_neto` | npc | 14,0% |
| `vizinho_barulhento` | evento | 13,9% |
| `desempregado` | evento | 13,6% |
| `vaquinha_do_vizinho` | evento | 13,6% |
| `sao_joao` | acao | 13,5% |
| `proposta_na_expansao` | evento | 13,3% |
| `sair_de_casa` | evento | 13,3% |
| `ceia_de_natal` | evento | 13,3% |
| `ciumes_do_irmao` | evento | 13,2% |
| `fome_no_fim_do_mes` | evento | 13,2% |
| `hobby_horta` | evento | 13,2% |
| `pede_ajuda` | npc | 13,2% |
| `bolao_do_trabalho` | evento | 13,1% |
| `fila_de_pedidos` | evento | 12,8% |
| `reencontro_da_turma` | evento | 12,6% |
| `pensar_em_adotar` | evento | 12,5% |
| `leu_antes_dos_colegas` | evento | 12,4% |
| `juros_compostos` | evento | 12,4% |
| `primeiro_cupom` | evento | 12,4% |
| `praia` | acao | 12,1% |
| `assalto_na_rua` | evento | 12,0% |
| `heranca_do_tio` | evento | 11,9% |
| `franquia` | evento | 11,9% |
| `pede_um_favor_a_voce` | npc | 11,8% |
| `ceu_de_fumaca` | evento | 11,8% |
| `surpresa_do_amor` | npc | 11,8% |
| `irmao_mora_longe` | evento | 11,8% |
| `balcao_negocio` | acao | 11,8% |
| `amigo_devolve` | npc | 11,4% |
| `aula_de_musica` | evento | 11,4% |
| `bateu_o_carro` | evento | 11,2% |
| `a_proposta_do_gestor` | npc | 11,2% |
| `levar_ao_mar` | acao | 11,1% |
| `o_esquema_do_colega` | evento | 11,1% |
| `filho_imitacao` | npc | 11,1% |
| `o_contrato_que_pode_tudo` | evento | 11,1% |
| `a_vacina_no_posto` | evento | 11,0% |
| `fazenda_a_venda` | evento | 11,0% |
| `festa_de_sao_joao` | evento | 11,0% |
| `chimarrao` | acao | 11,0% |
| `brigas_de_madrugada` | evento | 10,9% |
| `hidroginastica` | evento | 10,9% |
| `cofrinho` | acao | 10,9% |
| `moeda_digital` | evento | 10,8% |
| `o_mapa_na_parede` | evento | 10,7% |
| `o_primeiro_comicio` | evento | 10,7% |
| `carteira_da_diarista` | evento | 10,7% |
| `mudar_para_a_praia` | evento | 10,7% |
| `reencontro_amigo` | evento | 10,5% |
| `plano_de_negocios` | evento | 10,5% |
| `bloco_de_carnaval` | evento | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,3% |
| `concorrente_gigante` | evento | 10,3% |
| `casa_propria` | evento | 10,3% |
| `alavancagem` | evento | 10,2% |
| `aniversario_da_infancia` | evento | 10,2% |
| `recomecar_amor` | acao | 10,2% |
| `baile_da_terceira_idade` | evento | 10,1% |
| `feira_de_ciencias` | evento | 10,1% |
| `voltar_estudar` | evento | 10,1% |
| `cripto_fomo` | evento | 10,0% |
| `o_quarto_vazio` | evento | 10,0% |
| `imovel_valorizou` | evento | 9,9% |
| `entregador_chuva` | evento | 9,8% |
| `esporte_escola` | acao | 9,8% |
| `sovina_ou_sabio` | evento | 9,7% |
| `casa_cheia` | evento | 9,7% |
| `imposto_alto_no_contracheque` | evento | 9,5% |
| `negocio_no_aperto` | evento | 9,5% |
| `cirurgia_de_catarata` | evento | 9,4% |
| `separacao_dos_pais` | evento | 9,4% |
| `reuniao_de_condominio` | evento | 9,4% |
| `peneira` | evento | 9,4% |
| `imposto_baixo_sobrou` | evento | 9,4% |
| `pais_envelhece` | evento | 9,3% |
| `comer_tudo` | acao | 9,3% |
| `colo_da_avo` | acao | 9,2% |
| `mais_um_para_a_mesa` | evento | 9,1% |
| `quarto_dividido` | evento | 9,1% |
| `investimento_rotina` | evento | 9,1% |
| `produto_viralizou` | evento | 9,1% |
| `brincar_na_rua` | acao | 9,1% |
| `brincar_com_o_pai` | acao | 9,1% |
| `convite_para_palestrar` | evento | 9,0% |
| `boi_bumba` | acao | 8,9% |
| `maratona` | evento | 8,9% |
| `o_produto_envelheceu` | evento | 8,9% |
| `conteudo_extra` | acao | 8,8% |
| `peito_chiando` | evento | 8,7% |
| `voce_mudou` | npc | 8,7% |
| `dolar_barato` | evento | 8,7% |
| `alugueis_dos_fundos` | evento | 8,7% |
| `casamento_na_igreja` | npc | 8,6% |
| `golpe_do_falso_neto` | evento | 8,6% |
| `escrever_memorias` | evento | 8,4% |
| `mudanca_de_escola` | evento | 8,3% |
| `vaga_sobrando` | evento | 8,2% |
| `irmao_mais_velho_defende` | evento | 8,2% |
| `faculdade_a_noite` | acao | 8,1% |
| `brincar_amigos` | acao | 8,1% |
| `multa_e_batida` | evento | 8,1% |
| `amor_piada_interna` | npc | 8,1% |
| `passear_de_carrinho` | acao | 8,0% |
| `o_natal_barulhento` | evento | 8,0% |
| `convite_do_luxo` | evento | 8,0% |
| `o_primeiro_da_familia` | evento | 7,9% |
| `juros_baixos_euforia` | evento | 7,9% |
| `casa_na_praia` | evento | 7,9% |
| `bolsa_la_fora` | evento | 7,9% |
| `testamento` | evento | 7,8% |
| `retirada_demais` | evento | 7,8% |
| `promocao` | evento | 7,8% |
| `compra_por_impulso` | evento | 7,8% |
| `sabado_com_os_sobrinhos` | evento | 7,7% |
| `investidor_anjo` | evento | 7,6% |
| `tocar_no_bar` | acao | 7,6% |
| `concurso_lotado` | evento | 7,6% |
| `rua_tranquila` | evento | 7,5% |
| `dente_de_leite` | evento | 7,5% |
| `seca_no_sertao` | evento | 7,4% |
| `gerente_do_banco` | evento | 7,4% |
| `cheia_do_rio` | evento | 7,3% |
| `pular_corda` | acao | 7,3% |
| `ciume_do_bebe_novo` | evento | 7,3% |
| `greve_dos_onibus` | evento | 7,3% |
| `emprestimo_ao_irmao` | evento | 7,2% |
| `mensalidade_da_escola` | npc | 7,2% |
| `figurinha_repetida` | acao | 7,2% |
| `apartamento_na_planta` | evento | 7,2% |
| `bolsa_de_estudos` | evento | 7,1% |
| `pobreza_na_porta` | evento | 7,1% |
| `o_video_que_viralizou` | evento | 7,0% |
| `vontade_casa_propria` | npc | 7,0% |
| `fundo_da_familia` | npc | 7,0% |
| `parar_de_fumar` | acao | 7,0% |
| `cartao_credito` | evento | 7,0% |
| `levar_a_terra_natal` | acao | 7,0% |
| `soltar_pipa` | acao | 6,9% |
| `separacao` | evento | 6,9% |
| `fugir_inflacao` | acao | 6,9% |
| `bolsa_subiu_sem_voce` | evento | 6,9% |
| `pedido_de_casamento` | acao | 6,9% |
| `remorso_aperta` | evento | 6,9% |
| `amor_proposta_fora` | npc | 6,8% |
| `o_padrinho_politico` | evento | 6,8% |
| `retiro_da_igreja` | evento | 6,8% |
| `a_foto_da_festa` | evento | 6,8% |
| `apagao_no_morro` | evento | 6,8% |
| `ouvido_para_musica` | evento | 6,7% |
| `pousada_na_praia` | evento | 6,7% |
| `pedem_sua_opiniao` | evento | 6,6% |
| `assalto_no_onibus` | evento | 6,5% |
| `o_debate_na_tv` | evento | 6,4% |
| `mae_quer_morar_junto` | npc | 6,4% |
| `nome_sujo` | evento | 6,3% |
| `o_convite_do_clube` | evento | 6,3% |
| `filho_nao_veio` | npc | 6,3% |
| `olimpiada_matematica` | evento | 6,3% |
| `propina_da_empreiteira` | evento | 6,2% |
| `irmao_doente` | evento | 6,2% |
| `ressaca_do_mar` | evento | 6,2% |
| `inquilino_dos_sonhos` | evento | 6,2% |
| `socio_sumiu` | evento | 6,2% |
| `queda` | evento | 6,1% |
| `briga_em_casa` | npc | 6,1% |
| `ponto_comercial` | evento | 6,1% |
| `crise_40` | evento | 6,1% |
| `festival_do_boi` | evento | 6,1% |
| `inquilino_sumiu` | evento | 6,1% |
| `idh_muito_alto` | evento | 6,1% |
| `consorcio` | evento | 6,0% |
| `vender_doce_nato` | acao | 5,9% |
| `juros_altos_rendendo` | evento | 5,9% |
| `chefe_novo` | evento | 5,9% |
| `cachoeira` | acao | 5,8% |
| `desigualdade_no_jornal` | evento | 5,8% |
| `pede_emprestado_a_voce` | npc | 5,7% |
| `a_engenheira_saiu` | evento | 5,7% |
| `ninguem_conhece` | evento | 5,6% |
| `estatua` | jogada | 5,6% |
| `paquerar_timido` | acao | 5,6% |
| `padrao_de_vida` | evento | 5,5% |
| `fiscalizacao` | evento | 5,5% |
| `a_volta_ao_mundo` | evento | 5,5% |
| `geladeira_vazia` | evento | 5,5% |
| `primeiro_container` | evento | 5,4% |
| `o_partido_bate_na_porta` | evento | 5,4% |
| `faculdade_vida` | evento | 5,4% |
| `nao_acredita_mais` | npc | 5,3% |
| `apartamento_decorado` | evento | 5,3% |
| `noite_de_stand_up` | evento | 5,3% |
| `festa_sem_pais` | evento | 5,3% |
| `aposentadoria_ativa` | evento | 5,3% |
| `desemprego_em_alta` | evento | 5,3% |
| `dolar_disparou` | evento | 5,3% |
| `operacao_policial` | evento | 5,2% |
| `filho_saude_fragil` | npc | 5,2% |
| `geada_no_sul` | evento | 5,2% |
| `netos` | evento | 5,1% |
| `enchente_na_rua` | evento | 5,1% |
| `merenda` | evento | 5,0% |
| `briga_dos_pais` | evento | 5,0% |
| `edital_de_cultura` | evento | 5,0% |
| `o_rival_levou_seu_gerente` | npc | 5,0% |
| `cidadania_italiana` | evento | 4,9% |
| `blitz_toda_noite` | evento | 4,9% |
| `titulo_eleitor` | evento | 4,9% |
| `a_aposta_da_fortuna` | evento | 4,9% |
| `atendimento_robo` | evento | 4,9% |
| `mei_negocio` | evento | 4,8% |
| `chefe_hora_extra` | npc | 4,8% |
| `votacao_polemica` | evento | 4,7% |
| `pescaria_no_pantanal` | evento | 4,7% |
| `pais_na_crise` | npc | 4,7% |
| `asma_na_educacao_fisica` | evento | 4,6% |
| `amor_planilha` | npc | 4,6% |
| `vo_receita` | evento | 4,6% |
| `amor_saude_fragil` | npc | 4,6% |
| `curso_nota_baixa` | evento | 4,6% |
| `bolsa_derreteu` | evento | 4,6% |
| `o_dia_do_sonho_familia_grande` | evento | 4,6% |
| `crise_no_setor` | evento | 4,6% |
| `escola_publica_boa` | evento | 4,5% |
| `academia_de_janeiro` | evento | 4,5% |
| `luto_do_bicho` | npc | 4,5% |
| `aposentadoria_nao_da` | npc | 4,5% |
| `vo_partiu` | npc | 4,4% |
| `herdeiro_gastao` | evento | 4,4% |
| `cripto_disparou` | evento | 4,4% |
| `contas_do_milhao` | evento | 4,3% |
| `festa_do_seculo` | jogada | 4,3% |
| `festa_surpresa` | evento | 4,3% |
| `chefe_injusto` | evento | 4,2% |
| `briga_na_cozinha` | evento | 4,1% |
| `trabalho_do_pai` | acao | 4,1% |
| `festa_vazou` | evento | 4,1% |
| `pressao_alta` | evento | 4,1% |
| `juros_altos` | evento | 4,0% |
| `assembleia_do_predio` | evento | 4,0% |
| `adocao_chegou` | evento | 4,0% |
| `estatua_pichada` | evento | 4,0% |
| `idh_em_queda` | evento | 4,0% |
| `chaves_do_apartamento` | evento | 4,0% |
| `o_restaurante_do_primeiro_encontro` | evento | 3,9% |
| `grupo_de_jovens` | evento | 3,9% |
| `escola_de_samba` | jogada | 3,9% |
| `proposta_de_compra` | evento | 3,8% |
| `socio_da_patente` | evento | 3,8% |
| `pescaria_no_rio` | evento | 3,8% |
| `plantao_lotado` | evento | 3,8% |
| `filho_primeiro_salario` | npc | 3,7% |
| `imovel_na_baixa` | evento | 3,7% |
| `mutirao_de_cirurgias` | evento | 3,7% |
| `comecar_terapia` | evento | 3,7% |
| `excursao_ao_mar` | acao | 3,7% |
| `festival_lotado` | evento | 3,7% |
| `cripto_de_novo` | acao | 3,6% |
| `conselho_que_diz_nao` | jogada | 3,6% |
| `um_bicho_para_o_filho` | acao | 3,6% |
| `auxilio_na_conta` | evento | 3,6% |
| `filho_cuida` | npc | 3,6% |
| `obra_grande_no_norte` | evento | 3,6% |
| `doenca_de_quem_ama` | evento | 3,5% |
| `a_turne_ou_a_casa` | evento | 3,5% |
| `a_aposta_escondida` | evento | 3,5% |
| `casamento_do_filho` | evento | 3,5% |
| `olimpiada` | acao | 3,5% |
| `satelite_na_tv` | evento | 3,4% |
| `processo_trabalhista` | evento | 3,4% |
| `amor_viaja_demais` | npc | 3,4% |
| `agro_na_cidade` | evento | 3,4% |
| `bico_na_expansao` | evento | 3,3% |
| `prova_concurso` | evento | 3,3% |
| `balcao_da_familia` | evento | 3,3% |
| `crise_de_ansiedade` | evento | 3,3% |
| `burnout_empresa` | evento | 3,3% |
| `cobranca_de_notas` | npc | 3,3% |
| `romance_no_trabalho` | evento | 3,2% |
| `a_divida_escondida` | evento | 3,2% |
| `blindar_contas` | acao | 3,2% |
| `vicio_aposta` | evento | 3,2% |
| `festa_de_15` | evento | 3,1% |
| `ajudar_na_roca` | acao | 3,1% |
| `pais_separados_natal` | evento | 3,1% |
| `a_lista_da_revista` | evento | 3,1% |
| `filho_passou_longe` | npc | 3,1% |
| `clientes_sumiram` | evento | 3,1% |
| `o_lugar_que_voce_viu` | evento | 3,0% |
| `heranca` | evento | 3,0% |
| `colega_rouba_ideia` | npc | 3,0% |
| `a_crise_do_setimo_ano` | evento | 3,0% |
| `namorar_depois_dos_60` | evento | 3,0% |
| `crescer_devagar` | evento | 3,0% |
| `setor_aquecido` | evento | 3,0% |
| `cobranca_do_casamento` | npc | 2,9% |
| `marca_em_alta` | evento | 2,9% |
| `greve_dos_professores` | evento | 2,9% |
| `family_office` | evento | 2,9% |
| `ex_nas_redes` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `inflacao_no_mercado` | evento | 2,9% |
| `ex_reencontro` | evento | 2,8% |
| `funcionario_genial` | evento | 2,8% |
| `moto_na_chuva` | evento | 2,8% |
| `o_dia_do_sonho_amor_da_vida` | evento | 2,8% |
| `promessa_da_mae` | evento | 2,8% |
| `cidadania_do_bisavo` | evento | 2,8% |
| `ano_no_prejuizo` | evento | 2,8% |
| `concorrente_de_fora` | evento | 2,8% |
| `balcao_de_crianca` | evento | 2,8% |
| `hospital_sem_insumo` | evento | 2,8% |
| `shows_cancelados` | evento | 2,7% |
| `filho_quer_carro` | evento | 2,7% |
| `clinica_particular_contrata` | evento | 2,7% |
| `show_no_bar` | evento | 2,7% |
| `natal_com_politica` | evento | 2,7% |
| `enchente_na_cidade` | evento | 2,6% |
| `terapia` | acao | 2,6% |
| `cobra_voce` | npc | 2,6% |
| `obra_ou_hospital` | evento | 2,6% |
| `o_dia_do_sonho_estrela` | evento | 2,5% |
| `alguem_especial` | evento | 2,5% |
| `depois_do_cargo` | evento | 2,5% |
| `amigo_pede_de_novo` | npc | 2,5% |
| `duas_empresas_uma_agenda` | evento | 2,5% |
| `netos_nas_ferias` | evento | 2,4% |
| `a_rede_na_varanda_dos_outros` | evento | 2,4% |
| `cripto_derreteu` | evento | 2,4% |
| `mutirao_da_laje` | evento | 2,4% |
| `joelho_da_pelada` | evento | 2,4% |
| `aprovado_concurso_estudo` | evento | 2,4% |
| `confeitaria_da_vo` | evento | 2,3% |
| `viralizou` | evento | 2,3% |
| `sociedade_amigo` | evento | 2,3% |
| `piramide_no_grupo` | npc | 2,3% |
| `colega_happy_hour` | npc | 2,3% |
| `tentacao_no_trabalho` | evento | 2,3% |
| `bater_o_pe_com_o_chefe` | evento | 2,3% |
| `pib_recorde` | evento | 2,3% |
| `depois_da_venda` | evento | 2,3% |
| `greve_do_servidor` | evento | 2,3% |
| `o_que_pensa_de_voce` | npc | 2,3% |
| `escolheu_bem` | npc | 2,3% |
| `o_dono_quebrado_pede_emprego` | npc | 2,2% |
| `convite_para_candidatura` | evento | 2,2% |
| `ferias_do_dono` | evento | 2,2% |
| `fila_do_posto` | evento | 2,2% |
| `colega_de_licenca` | evento | 2,2% |
| `cursinho_comunitario` | evento | 2,1% |
| `la_fora_comprando` | evento | 2,1% |
| `surto_no_bairro` | evento | 2,1% |
| `ex_namora_amigo` | evento | 2,1% |
| `a_tregua_do_rival` | npc | 2,1% |
| `irmao_desempregado` | npc | 2,1% |
| `amigo_muda_de_cidade` | npc | 2,1% |
| `convite_igreja` | npc | 2,1% |
| `confessar_o_esquema` | acao | 2,1% |
| `qualidade_premiada` | evento | 2,1% |
| `primeiro_funcionario` | evento | 2,1% |
| `cuidar_netos` | acao | 2,1% |
| `este_e_o_ano` | evento | 2,0% |
| `bancar_quem_sai` | jogada | 2,0% |
| `so_aparece_por_dinheiro` | npc | 2,0% |
| `programa_de_moradia` | evento | 2,0% |
| `posto_que_funciona` | evento | 2,0% |
| `birra_no_mercado` | evento | 2,0% |
| `tarifa_do_app` | evento | 2,0% |
| `os_amigos_de_antes` | evento | 2,0% |
| `crianca_ansiosa` | evento | 1,9% |
| `missa_em_familia` | acao | 1,9% |
| `festa_surpresa_para` | npc | 1,9% |
| `contaram_do_esquema` | evento | 1,9% |
| `o_jantar_dos_ricos` | evento | 1,9% |
| `presidir_cpi` | evento | 1,9% |
| `acordo_abriu_mercado` | evento | 1,9% |
| `assumir_negocio` | evento | 1,9% |
| `olimpiada_do_instituto` | evento | 1,9% |
| `irmaos_brigam` | evento | 1,9% |
| `arrojado_na_queda` | evento | 1,9% |
| `fim_do_amor` | npc | 1,8% |
| `apresentacao_para_a_diretoria` | evento | 1,8% |
| `carregar_a_geladeira` | evento | 1,8% |
| `fiador` | npc | 1,8% |
| `fundacao_com_seu_nome` | evento | 1,8% |
| `importado_ficou_caro` | evento | 1,8% |
| `tosse_cronica` | evento | 1,8% |
| `chantagem_do_esquema` | npc | 1,8% |
| `escola_integral` | evento | 1,8% |
| `joias_no_cofre` | evento | 1,8% |
| `tentar_outra_cidade` | evento | 1,7% |
| `governo_que_voce_elegeu_frente_popular` | evento | 1,7% |
| `imposto_sobre_fortunas` | evento | 1,7% |
| `o_rival_na_festa` | npc | 1,7% |
| `voltar_com_o_ex` | npc | 1,7% |
| `seguranca_particular` | evento | 1,7% |
| `conselho_de_fachada` | evento | 1,6% |
| `vereador` | evento | 1,6% |
| `vaga_na_capital` | evento | 1,6% |
| `ajudar_na_coleta` | evento | 1,6% |
| `mural_de_problemas` | jogada | 1,6% |
| `saudade_de_la` | evento | 1,6% |
| `expandir_na_alta` | evento | 1,6% |
| `proposta_sao_paulo` | evento | 1,6% |
| `ramo_em_crise` | evento | 1,6% |
| `cobranca_da_magoa` | npc | 1,5% |
| `as_bodas` | evento | 1,5% |
| `colega_cobre_voce` | npc | 1,5% |
| `estrutura_parada` | evento | 1,5% |
| `intercambio_pago` | evento | 1,5% |
| `carreira_futebol` | evento | 1,5% |
| `emprego_tecnologia` | evento | 1,5% |
| `apuracao_do_carnaval` | evento | 1,5% |
| `compativel_para_medula` | evento | 1,5% |
| `ex_casou` | npc | 1,5% |
| `reajuste_dos_servidores` | evento | 1,5% |
| `emprego_educacao` | evento | 1,5% |
| `gorjeta_boa` | evento | 1,5% |
| `ainda_mora_com_pais` | evento | 1,4% |
| `passear_pet` | acao | 1,4% |
| `amor_paga_a_conta` | npc | 1,4% |
| `amigo_lembra_zoeira` | npc | 1,4% |
| `emprestimo_de_volta` | evento | 1,4% |
| `aposentado_quer_ajudar_na_empresa` | npc | 1,4% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,3% |
| `o_conselho_vetou` | evento | 1,3% |
| `dolar_virou_salario` | evento | 1,3% |
| `o_irmao_viu` | npc | 1,3% |
| `amigo_sumiu_e_voltou` | npc | 1,3% |
| `a_licitacao` | evento | 1,3% |
| `sucessao_coroa` | evento | 1,3% |
| `salario_parcelado` | evento | 1,3% |
| `pai_namorando_de_novo` | npc | 1,3% |
| `amor_quer_mudar_de_carreira` | npc | 1,3% |
| `cupula_la_fora` | evento | 1,3% |
| `obra_do_predio` | evento | 1,2% |
| `plano_de_saude_subiu` | evento | 1,2% |
| `rodada_grande` | evento | 1,2% |
| `oferece_ajuda` | npc | 1,2% |
| `fila_do_emprego` | evento | 1,2% |
| `pix_para_a_cidade` | jogada | 1,2% |
| `faculdade_depois_dos_60` | npc | 1,2% |
| `preco_do_pao` | evento | 1,2% |
| `setor_afundou` | evento | 1,2% |
| `nega_ajuda` | npc | 1,2% |
| `embaixador_pede` | evento | 1,2% |
| `tornar_se_dispensavel` | jogada | 1,2% |
| `reforma_sem_fim` | evento | 1,2% |
| `lesao_grave` | evento | 1,2% |
| `foto_de_campanha` | evento | 1,1% |
| `filho_cuida_de_voce` | npc | 1,1% |
| `padrao_aperta` | evento | 1,1% |
| `sucessao_regime` | evento | 1,1% |
| `rompimento` | npc | 1,1% |
| `equipe_para_desmontar` | jogada | 1,1% |
| `convite_do_partido` | evento | 1,1% |
| `a_conversa_que_faltava` | npc | 1,1% |
| `frete_sumiu` | evento | 1,1% |
| `vida_depois_da_condenacao` | evento | 1,1% |
| `o_primeiro_neto` | evento | 1,1% |
| `estatua_derrubada` | evento | 1,1% |
| `sair_de_casa_cedo` | evento | 1,0% |
| `carona_de_madrugada` | npc | 1,0% |
| `queda_do_cargo` | evento | 1,0% |
| `black_friday` | evento | 1,0% |
| `volta_terra` | evento | 1,0% |
| `ex_saudade_de_quem_foi` | evento | 1,0% |
| `visitar_de_longe` | acao | 1,0% |
| `formatura_tardia` | evento | 1,0% |
| `renegociar_divida` | evento | 1,0% |
| `aniversario_de_gemeos` | evento | 1,0% |
| `gravidez_surpresa` | npc | 1,0% |
| `casamento_dos_outros` | evento | 0,9% |
| `o_recall` | evento | 0,9% |
| `briga_por_heranca` | evento | 0,9% |
| `reencontro_paixao` | evento | 0,9% |
| `mesa_cheia` | evento | 0,9% |
| `chefe_amigo` | evento | 0,9% |
| `a_empresa_sem_voce` | evento | 0,9% |
| `governo_que_voce_elegeu_centrao` | evento | 0,9% |
| `happy_hour` | acao | 0,9% |
| `bancar_presidente` | jogada | 0,9% |
| `ano_de_prejuizo` | evento | 0,9% |
| `safra_da_fazenda` | evento | 0,9% |
| `bolsa_de_iniciacao` | evento | 0,8% |
| `greve_da_federal` | evento | 0,8% |
| `ferias_com_a_familia_do_amor` | npc | 0,8% |
| `a_auditoria` | evento | 0,8% |
| `montadora_vai_fechar` | evento | 0,8% |
| `depois_do_calote` | evento | 0,8% |
| `ocorrencia_perigosa` | evento | 0,8% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,8% |
| `solucao_inesperada` | evento | 0,8% |
| `bodas_de_prata` | evento | 0,8% |
| `fim_de_semana_no_sitio` | evento | 0,8% |
| `o_conselho_te_chama` | evento | 0,8% |
| `desfile_das_campeas` | evento | 0,8% |
| `ex_liga_de_madrugada` | npc | 0,8% |
| `cara_de_comercial` | evento | 0,8% |
| `cancelado` | evento | 0,8% |
| `irmao_aposentou` | evento | 0,8% |
| `dez_anos_de_empresa` | evento | 0,8% |
| `trator_aos_dez` | evento | 0,8% |
| `proposta_da_europa` | evento | 0,8% |
| `favor_do_presidente` | evento | 0,8% |
| `familia_descobre_o_testamento` | evento | 0,8% |
| `mais_uma_mudanca` | evento | 0,8% |
| `paparazzi` | evento | 0,8% |
| `nao_para_quieto` | evento | 0,7% |
| `time_a_venda` | evento | 0,7% |
| `fundacao` | jogada | 0,7% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 0,7% |
| `grade_na_janela` | evento | 0,7% |
| `ex_cobra` | npc | 0,7% |
| `concorrente_nova` | evento | 0,7% |
| `vontade_festa_de_80` | npc | 0,7% |
| `o_mural_do_boton` | evento | 0,7% |
| `fronteira_fechada` | evento | 0,7% |
| `o_ex_quer_um_cafe` | npc | 0,7% |
| `dizimo` | evento | 0,7% |
| `noite_da_apuracao` | evento | 0,7% |
| `convite_para_o_palco_grande` | evento | 0,7% |
| `cobranca_do_filho` | npc | 0,7% |
| `set_de_gravacao` | evento | 0,7% |
| `papel_da_vida` | evento | 0,7% |
| `calote_no_noticiario` | evento | 0,6% |
| `apartamento_de_presente` | evento | 0,6% |
| `acoes_da_startup` | evento | 0,6% |
| `hit_viral` | evento | 0,6% |
| `construtora_quebrou` | evento | 0,6% |
| `acampamento_na_porta` | evento | 0,6% |
| `a_capa_da_revista` | evento | 0,6% |
| `segundo_carro` | evento | 0,6% |
| `ex_internado` | evento | 0,6% |
| `planilha_das_dividas` | evento | 0,6% |
| `doar_em_vida` | evento | 0,6% |
| `desfile_de_sete_de_setembro` | evento | 0,6% |
| `recaida_cigarro` | evento | 0,6% |
| `cobranca_no_telefone` | evento | 0,6% |
| `rebaixamento` | evento | 0,6% |
| `tradutor_da_familia` | evento | 0,6% |
| `critico_no_salao` | evento | 0,6% |
| `o_caso_vem_a_tona` | evento | 0,5% |
| `filho_parou_de_contar` | npc | 0,5% |
| `feirao_limpa_nome` | evento | 0,5% |
| `obra_parada` | evento | 0,5% |
| `filial_fechando` | evento | 0,5% |
| `homenagem_no_trabalho` | evento | 0,5% |
| `tocar_o_negocio` | acao | 0,5% |
| `contrato_publicitario` | evento | 0,5% |
| `amor_desconfia` | npc | 0,5% |
| `cobrar_divida` | acao | 0,5% |
| `a_convocacao` | evento | 0,5% |
| `holding_da_familia` | evento | 0,5% |
| `feriado_na_praia` | evento | 0,5% |
| `filho_briga_na_escola` | npc | 0,5% |
| `lembranca_primeiro_amor` | evento | 0,5% |
| `infancia_no_palacio` | evento | 0,5% |
| `jantar_esfriou` | npc | 0,5% |
| `rua_contra_a_taxa_da_coroa` | evento | 0,5% |
| `o_mais_rico_quer_a_sua_empresa` | evento | 0,5% |
| `segredo_de_familia` | npc | 0,5% |
| `treinar_no_clube` | acao | 0,5% |
| `mestrado_fora` | evento | 0,5% |
| `lista_dos_mais_ricos` | evento | 0,5% |
| `fazer_as_pazes` | acao | 0,5% |
| `o_seu_sonho_nas_maos` | evento | 0,5% |
| `guerra_comercial` | evento | 0,5% |
| `divida_publica_assusta` | evento | 0,5% |
| `regra_sob_medida` | evento | 0,5% |
| `ajudar_com_a_casa` | acao | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `tomar_o_poder` | jogada | 0,4% |
| `guerra_na_escola` | evento | 0,4% |
| `amigo_ficou_rico` | npc | 0,4% |
| `a_parcela_do_banco` | evento | 0,4% |
| `protesto_na_avenida` | evento | 0,4% |
| `desabafar_o_caso` | acao | 0,4% |
| `robos_na_fabrica` | evento | 0,4% |
| `choque_de_culturas` | evento | 0,4% |
| `o_primeiro_bilhao` | evento | 0,4% |
| `briga_de_casal` | npc | 0,4% |
| `despejo` | evento | 0,4% |
| `burnout` | evento | 0,4% |
| `quebra_de_safra` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `concorrente_quebrou` | evento | 0,4% |
| `segunda_chance` | npc | 0,4% |
| `vaga_na_empresa_dele` | npc | 0,4% |
| `a_seguranca_da_lista` | evento | 0,4% |
| `exportacao_bate_recorde` | evento | 0,4% |
| `racionamento` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `amor_quadro_de_tarefas` | npc | 0,4% |
| `vaga_no_agro` | evento | 0,4% |
| `bola_autografada` | evento | 0,4% |
| `o_cartel_vazou` | evento | 0,4% |
| `o_dia_do_sonho_presidencia` | evento | 0,4% |
| `vendas_recorde` | evento | 0,4% |
| `peneira_do_sobrenome` | evento | 0,4% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,3% |
| `internato_real` | evento | 0,3% |
| `picadeiro` | evento | 0,3% |
| `o_preco_remarcado` | evento | 0,3% |
| `promocao_em_outra_cidade` | evento | 0,3% |
| `carro_de_luxo_na_rua` | evento | 0,3% |
| `sancao_parou_o_porto` | evento | 0,3% |
| `a_conta_da_coroa` | evento | 0,3% |
| `quartel_sem_verba` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `deploy_de_sexta` | evento | 0,3% |
| `ministro_pede_ajuste` | evento | 0,3% |
| `obra_atrasada` | evento | 0,3% |
| `ameaca_de_sancao` | evento | 0,3% |
| `escandalo_do_lobby` | evento | 0,3% |
| `o_bicho_herdeiro` | evento | 0,3% |
| `intercambio` | evento | 0,3% |
| `emprego_negocios` | evento | 0,3% |
| `layoff_por_email` | evento | 0,3% |
| `aluguel_com_nome_sujo` | evento | 0,3% |
| `mordomias_reais` | evento | 0,3% |
| `proposta_em_dolar` | evento | 0,3% |
| `chefe_elogia` | npc | 0,3% |
| `aperto_do_mes` | evento | 0,3% |
| `pedreiro_vale_ouro` | evento | 0,3% |
| `royalties_secaram` | evento | 0,3% |
| `a_impressora_ligada` | evento | 0,3% |
| `turne_nacional` | evento | 0,3% |
| `violencia_vira_manchete` | evento | 0,3% |
| `estagio_do_pai` | evento | 0,3% |
| `juros_altos_na_fatura` | evento | 0,3% |
| `renegociar_cartao` | acao | 0,3% |
| `transito_de_sp` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `as_criancas_perguntam` | npc | 0,3% |
| `o_dia_do_sonho_imperio` | evento | 0,3% |
| `o_neto_no_fim_de_semana` | evento | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `celular_dos_pais` | npc | 0,3% |
| `assinatura_real` | evento | 0,3% |
| `livro_viralizou` | evento | 0,3% |
| `confessar_o_caso` | acao | 0,3% |
| `filho_quer_curso_caro` | npc | 0,3% |
| `o_laboratorio_apaga_a_luz` | evento | 0,2% |
| `filho_quer_capital` | npc | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `noite_de_corridas` | evento | 0,2% |
| `cavalo_campeao` | evento | 0,2% |
| `vestibular_preparado` | evento | 0,2% |
| `trazer_a_copa` | jogada | 0,2% |
| `pane_no_voo` | evento | 0,2% |
| `final_da_copa` | evento | 0,2% |
| `padrinho_casamento` | npc | 0,2% |
| `filho_hamburgueria` | npc | 0,2% |
| `filho_convocado` | evento | 0,2% |
| `aluguel_caro` | evento | 0,2% |
| `filho_apresenta_namoro` | npc | 0,2% |
| `cargo_no_gabinete` | evento | 0,2% |
| `circo_vai_embora` | evento | 0,2% |
| `vista_da_cobertura` | evento | 0,2% |
| `o_rival_quer_comprar` | npc | 0,2% |
| `irmao_separou` | npc | 0,2% |
| `festa_de_80` | acao | 0,2% |
| `contaram_da_festa` | evento | 0,2% |
| `imposto_do_ano` | evento | 0,2% |
| `jubileu` | evento | 0,2% |
| `operacao_no_gabinete` | evento | 0,2% |
| `naturalizacao` | evento | 0,2% |
| `filho_pede_ajuda` | npc | 0,2% |
| `contaram_do_caso` | evento | 0,2% |
| `safra_recorde` | evento | 0,2% |
| `turno_extra_na_fabrica` | evento | 0,2% |
| `paciente_famoso` | evento | 0,2% |
| `safra_ou_geada` | evento | 0,2% |
| `pais_envelhecem` | npc | 0,2% |
| `os_dois_lados` | evento | 0,2% |
| `grupo_na_capa` | evento | 0,2% |
| `assumir_a_fazenda` | evento | 0,2% |
| `faltou_gente` | evento | 0,2% |
| `greve_geral` | evento | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `ferias_coletivas` | evento | 0,2% |
| `o_ministro_liga` | evento | 0,2% |
| `receita_recorde` | evento | 0,2% |
| `o_credito_sumiu` | evento | 0,2% |
| `o_neto_pergunta_do_sonho` | evento | 0,2% |
| `reencontro_amigo_brigado` | evento | 0,2% |
| `a_avenida_com_o_seu_nome` | evento | 0,2% |
| `caixa_sobrando` | evento | 0,2% |
| `amor_sempre_trabalhando` | npc | 0,1% |
| `edital_da_ciencia` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `conselho_quer_ceo` | evento | 0,1% |
| `oposicao_na_tv` | evento | 0,1% |
| `decreto_da_economia` | evento | 0,1% |
| `crise_internacional` | evento | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `pressao_carreira` | npc | 0,1% |
| `filho_adolescente_porta` | npc | 0,1% |
| `filho_foi_embora` | npc | 0,1% |
| `negocio_em_crise` | evento | 0,1% |
| `concurso_em_brasilia` | evento | 0,1% |
| `tentar_a_vida_na_europa` | evento | 0,1% |
| `proposta_pelo_negocio` | evento | 0,1% |
| `cursinho_paga_bem` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `bonanca_no_governo` | evento | 0,1% |
| `o_processo_da_marca` | npc | 0,1% |
| `chefe_magoado_cobra` | npc | 0,1% |
| `o_veterano` | evento | 0,1% |
| `a_copa_chegou` | evento | 0,1% |
| `plantao_que_nao_acaba` | evento | 0,1% |
| `fa_obcecado` | evento | 0,1% |
| `chantagem_do_caso` | npc | 0,1% |
| `confessar_a_divida` | acao | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `oferta_pela_subsidiaria` | evento | 0,1% |
| `casamento_real` | evento | 0,1% |
| `protesto_na_praca` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `devedor_some` | npc | 0,1% |
| `o_preco_do_imperio` | evento | 0,1% |
| `proposta_remota` | evento | 0,1% |
| `hospital_da_fundacao` | evento | 0,1% |
| `elefante_branco` | evento | 0,1% |
| `fusao_de_iguais` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `o_logo_no_aeroporto` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `mansao_vazia` | evento | 0,1% |
| `a_opa_do_fundo` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `fabrica_de_municao` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `sequestro_frustrado` | evento | 0,1% |
| `teste_por_indicacao` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `guerra_de_precos` | evento | 0,1% |
| `ficar_no_poder` | jogada | 0,1% |
| `a_divida_vem_a_tona` | evento | 0,1% |
| `zona_franca` | evento | 0,1% |
| `bonus_do_banco` | evento | 0,1% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `clientes_em_panico` | evento | 0,1% |
| `paparazzi_real` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `shopping_lotado` | evento | 0,1% |
| `leilao_da_obra` | evento | 0,1% |
| `pais_aposentados` | npc | 0,1% |
| `acionistas_furiosos` | evento | 0,1% |
| `o_sindicato_dos_dez_mil` | evento | 0,1% |
| `caso_do_poderoso` | evento | 0,1% |
| `cliente_perdeu_tudo` | evento | 0,1% |
| `importado_invadiu` | evento | 0,1% |
| `parcela_da_tv` | npc | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `amor_gastador` | npc | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `nova_tentativa_da_pesquisa` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `reconciliacao` | npc | 0,1% |
| `a_promessa_cobrada` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `ex_aluno` | evento | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `lancamento` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `abrir_capital` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `passou_mal_de_novo` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `contaram_da_divida` | evento | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `patente_da_cura` | evento | 0,1% |
| `rival_bilionario` | evento | 0,1% |
| `convite_para_ministro` | evento | 0,1% |
| `conta_na_suica` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `amor_vai_embora` | npc | 0,0% |
| `fundacao_premio` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `carta_branca` | evento | 0,0% |
| `greve_do_piso` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `amor_igreja` | npc | 0,0% |
| `documentario` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `primeiro_balanco_na_bolsa` | evento | 0,0% |
| `tudo_pela_sua_mesa` | evento | 0,0% |
| `cobrir_a_tatuagem` | evento | 0,0% |
| `aluno_impossivel` | evento | 0,0% |
| `jornal_e_o_aliado` | evento | 0,0% |
| `restaurar_a_monarquia` | jogada | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `subsidiaria_esquecida` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `fundar_uma_cidade` | jogada | 0,0% |
| `comprar_a_estatal` | jogada | 0,0% |
| `apagao` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `a_ilha_cresceu` | evento | 0,0% |
| `barco_de_mudanca` | evento | 0,0% |
| `a_pasta_do_sonho` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |
| `salvar_o_pais` | jogada | 0,0% |
| `fundar_um_pais` | jogada | 0,0% |
| `colonia_em_marte` | jogada | 0,0% |
| `rumo_a_lua` | evento | 0,0% |
| `inauguracao_da_cidade` | evento | 0,0% |
| `os_bancos_pagam` | evento | 0,0% |
| `chegada_em_marte` | evento | 0,0% |
| `cidade_alagou` | evento | 0,0% |
| `prefeito_da_cidade_nova` | evento | 0,0% |
| `dono_do_brasil` | evento | 0,0% |
| `boicote_ao_traidor` | evento | 0,0% |
| `onu_nao_reconhece` | evento | 0,0% |
| `greve_na_ilha` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `o_grupo_no_pib` | evento | 0,0% |
| `sucessao_na_empresa` | evento | 0,0% |
| `a_opa_da_rival` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 240 · **mudaram algo em pelo menos uma vida:** 239
- **Qualidades que nunca dispararam nada:** `cidade_em_obras`, `filho_na_empresa`

## Distribuições

**Idade de morte** — média 70,3 · p10 54 · p25 61 · mediana 70 · p75 80 · p90 88

```
até 19                                        0,4%
20–29                                         0,4%
30–39          █                              0,7%
40–49          ████                           3,6%
50–59          ████████████████               14,9%
60–69          ██████████████████████████████ 28,0%
70–79          ███████████████████████████    25,6%
80–89          ████████████████████           19,0%
90–99          ███████                        6,6%
100+           █                              0,7%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 223 mil · p25 R$ 761 mil · mediana R$ 3,8 milhões · p75 R$ 24 milhões · p90 R$ 64 milhões

```
negativo       █                              0,9%
até 10 mil                                    0,6%
10–50 mil      █                              1,2%
50–200 mil     ████                           6,5%
200 mil–1 mi   █████████████                  20,4%
1–5 mi         ███████████████                23,8%
5 mi+          ██████████████████████████████ 46,6%
```

**Felicidade média ao longo da vida** — p10 61 · mediana 74 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,8%
50–59          █████                          7,0%
60–69          ██████████████████             24,4%
70–79          ██████████████████████████████ 40,5%
80+            ████████████████████           27,2%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,6 | R$ 731 mil | 67,7 | 59,8 | 161,1 | 73,0 | 100% | 55% |
| cautelosa | 82,9 🏆 | R$ 30 milhões 🏆 | 75,4 | 68,8 | 178,7 | 77,6 | 100% | 58% |
| arriscada | 58,6 | R$ 4 milhões | 81,0 🏆 | 55,6 | 143,1 | 115,6 | 100% | 53% |
| aleatoria | 74,1 | R$ 2,2 milhões | 71,0 | 64,9 | 134,2 | 87,4 | 100% | 48% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,7% — num hospital do SUS que fez tudo o que podia, e fez muito
- 13,3% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,5% — de um AVC, numa terça-feira sem graça
- 7,5% — de pneumonia, depois de teimar que era só uma gripe
- 6,8% — numa cirurgia simples que não foi tão simples
- 5,5% — de complicações de uma queda no banheiro
- 4,9% — de velhice, dormindo, num domingo depois do almoço
- 4,4% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **CPU por vida:** o tempo de uma vida (nascer, os robôs decidindo e o motor), medido numa amostra de 240 vidas rodada sozinha depois das outras. As outras rodam em 4 trabalhadores, um por núcleo, e cada vida demora mais quando elas dividem a máquina. O relatório sai igual com qualquer número de trabalhadores, menos o tempo.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
