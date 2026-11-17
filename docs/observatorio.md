# Observatório: robôs (não são jogadores)

**Estas vidas são de robôs.** Os quatro robôs do túnel (primeira opção, cautelosa, arriscada e aleatória) decidem por regras fixas: o que eles fazem mede o jogo diante dessas regras, não o comportamento de pessoas. Nenhum dado de jogador real entrou aqui.

População fixa (as mesmas sementes a cada rodada): comuns (as quatro estratégias, jogadores com quatro vidas seguidas e a memória entre elas), extremos (bilionária, trilionária, realeza e regime, com a arriscada e a cautelosa) e as dinastias da bancada (oito gerações). Para ver uma vida década a década: `npm run observatorio -- --vida=SEMENTE[:GERACAO]`.

328 vidas em 265 partidas, 20561 anos vividos, 81634 decisões e passagens de ano registradas; todas observadas comando a comando.

Cada item diz se é **fato observado** nestas vidas ou **hipótese** tirada dele, a confiança (pelo tamanho da amostra) e como reproduzir os exemplos.

## Comportamentos identificados

- **Investidor: 42% das vidas** · fato observado · confiança alta (n = 137)
  - probabilidade ≥ 0,6 na vida inteira em 137 de 328 vidas (média 0,48); num exemplo: 90% do patrimônio aplicado; 15% das decisões em investimentos
  - Para reproduzir: comum/primeira, semente 10010, geração 1; comum/primeira, semente 10031, geração 1
- **Estrategista político: 36% das vidas** · fato observado · confiança alta (n = 119)
  - probabilidade ≥ 0,6 na vida inteira em 119 de 328 vidas (média 0,45); num exemplo: 52 de 79 anos com cargo ou coroa; 19% das decisões no poder, na diplomacia e na coroa; influência política média de 50
  - Para reproduzir: comum/cautelosa, semente 11072, geração 1; bilionaria/cautelosa, semente 20503, geração 1
- **Empreendedor: 27% das vidas** · fato observado · confiança alta (n = 89)
  - probabilidade ≥ 0,6 na vida inteira em 89 de 328 vidas (média 0,39); num exemplo: 63% do patrimônio em empresas; 25% das decisões na empresa e no grupo; 3 empresa(s)
  - Para reproduzir: comum/arriscada, semente 12001, geração 1; comum/arriscada, semente 12002, geração 1
- **Acumulador de patrimônio: 20% das vidas** · fato observado · confiança alta (n = 65)
  - probabilidade ≥ 0,6 na vida inteira em 65 de 328 vidas (média 0,38); num exemplo: está no percentil 100,0 da riqueza do país; o patrimônio cresceu 0,80 ordem(ns) de grandeza por década; o patrimônio trabalha (aplicado ou em empresas)
  - Para reproduzir: dinastia-media-arriscada/arriscada, semente 1616997875, geração 4; dinastia-regime-arriscada/arriscada, semente 3042790093, geração 7
- **Generalista: 18% das vidas** · fato observado · confiança alta (n = 60)
  - probabilidade ≥ 0,6 na vida inteira em 60 de 328 vidas (média 0,34); num exemplo: áreas equilibradas (entropia 0,80; o comum é 0,75); nenhuma área passa de 21%
  - Para reproduzir: bilionaria/arriscada, semente 20000, geração 1; bilionaria/arriscada, semente 20001, geração 1
- **Os perfis convivem e mudam com a vida** · fato observado · confiança alta (n = 328)
  - em média 1,8 perfis fortes (≥ 0,6) por vida; o perfil mais forte troca pelo menos uma vez, entre as janelas de dez anos, em 90% das vidas
  - Para reproduzir: comum/primeira, semente 10000, geração 1; comum/primeira, semente 10001, geração 1
- **percentil da riqueza no Brasil real: 171 vidas passam do limiar extremo (0,999)** · fato observado · confiança media (n = 171)
  - o maior: 1,00; por que este limiar: o 1% e o 0,1% mais ricos da régua do lugar (lugar.ts), que anda com o PIB per capita
  - Para reproduzir: bilionaria/cautelosa, semente 20500, geração 1, 2026; trilionaria/arriscada, semente 21000, geração 1, 2026; trilionaria/arriscada, semente 21001, geração 1, 2026
- **subsidiárias com uma holding: 15 vidas passam do limiar extremo (8)** · fato observado · confiança baixa (n = 15)
  - o maior: 11,0; por que este limiar: um grupo de verdade, com camadas; oito ou mais é um conglomerado que só se governa delegando
  - Para reproduzir: trilionaria/arriscada, semente 21005, geração 1, 2085; dinastia-rica-arriscada/arriscada, semente 1021558011, geração 4, 2151; dinastia-rica-arriscada/arriscada, semente 3186752237, geração 5, 2193
- **anos com cargo de governo nacional, coroa ou regime: 62 vidas passam do limiar extremo (12)** · fato observado · confiança media (n = 62)
  - o maior: 93,0; por que este limiar: um mandato inteiro; doze anos é o poder que fica
  - Para reproduzir: regime/cautelosa, semente 23504, geração 1, 2026; regime/cautelosa, semente 23500, geração 1, 2026; regime/cautelosa, semente 23501, geração 1, 2026
- **geração que ainda começa entre os 1% mais ricos: 33 vidas passam do limiar extremo (5)** · fato observado · confiança media (n = 33)
  - o maior: 8,00; por que este limiar: a riqueza que atravessa três gerações já é rara; cinco é uma casa
  - Para reproduzir: dinastia-rica-arriscada/arriscada, semente 3755318325, geração 8, 2295; dinastia-rica-cautelosa/cautelosa, semente 191353592, geração 8, 2282; dinastia-bilionaria-arriscada/arriscada, semente 715930113, geração 8, 2289
- **gerações da família: 9 vidas passam do limiar extremo (8)** · fato observado · confiança baixa (n = 9)
  - o maior: 8,00; por que este limiar: quatro gerações passam de um século; oito, de dois
  - Para reproduzir: dinastia-rica-arriscada/arriscada, semente 3755318325, geração 8, 2295; dinastia-rica-cautelosa/cautelosa, semente 191353592, geração 8, 2282; dinastia-bilionaria-arriscada/arriscada, semente 715930113, geração 8, 2289
- **áreas do jogo usadas na vida: 39 vidas passam do limiar extremo (0,85)** · fato observado · confiança media (n = 39)
  - o maior: 0,950; por que este limiar: quem toca mais de 70% das áreas já viu quase tudo o que o jogo oferece
  - Para reproduzir: realeza/arriscada, semente 22000, geração 1, 2094; realeza/arriscada, semente 22001, geração 1, 2101; realeza/arriscada, semente 22004, geração 1, 2091

| Perfil | Vidas com probabilidade ≥ 0,6 | Probabilidade média |
|---|---|---|
| Empreendedor | 89 (27%) | 0,39 |
| Investidor | 137 (42%) | 0,48 |
| Industrialista | 37 (11%) | 0,15 |
| Estrategista político | 119 (36%) | 0,45 |
| Construtor de dinastias | 41 (13%) | 0,23 |
| Acumulador de patrimônio | 65 (20%) | 0,38 |
| Filantropo | 0 (0%) | 0,08 |
| Explorador | 44 (13%) | 0,20 |
| Generalista | 60 (18%) | 0,34 |
| Orientado à sobrevivência | 9 (3%) | 0,16 |

## Estratégias dominantes

- **Riqueza principalmente em empresas** · fato observado · confiança media (n = 60)
  - 60 vidas; o patrimônio cresce 0,14 ordens de grandeza por década na mediana (p90 0,38); felicidade média 83
  - Para reproduzir: comum/primeira, semente 10112, geração 1; comum/arriscada, semente 12001, geração 1
- **Riqueza principalmente em aplicações financeiras** · fato observado · confiança alta (n = 169)
  - 169 vidas; o patrimônio cresce 0,10 ordens de grandeza por década na mediana (p90 0,31); felicidade média 77
  - Para reproduzir: comum/primeira, semente 10010, geração 1; comum/primeira, semente 10012, geração 1
- **Riqueza principalmente em imóveis e bens** · fato observado · confiança media (n = 56)
  - 56 vidas; o patrimônio cresce 0,01 ordens de grandeza por década na mediana (p90 0,15); felicidade média 79
  - Para reproduzir: comum/cautelosa, semente 11002, geração 1; comum/cautelosa, semente 11030, geração 1
- **Riqueza principalmente em dinheiro parado na conta** · fato observado · confiança baixa (n = 29)
  - 29 vidas; o patrimônio cresce 0,00 ordens de grandeza por década na mediana (p90 0,11); felicidade média 71
  - Para reproduzir: comum/primeira, semente 10001, geração 1; comum/primeira, semente 10002, geração 1
- **17 eventos têm uma opção escolhida em 95% ou mais das vezes** · fato observado · confiança baixa (n = 17)
  - os mais frequentes: festa_vazou (122×), preco_do_pao (68×), estatua_pichada (54×), ciumes_do_irmao (49×), favor_do_presidente (34×), juros_compostos (30×). Com robôs, isso mede a regra de decisão deles, não o conteúdo: é preciso olhar a escolha de pessoas
  - Para reproduzir: comum/arriscada, semente 12093, geração 1; comum/cautelosa, semente 11072, geração 1

## Sistemas mais utilizados

- **dinheiro: 24% das decisões** · fato observado · confiança alta (n = 39040)
  - 39040 decisões tocaram a área, em 328 de 328 vidas
- **relacoes: 15% das decisões** · fato observado · confiança alta (n = 25346)
  - 25346 decisões tocaram a área, em 328 de 328 vidas
- **familia: 13% das decisões** · fato observado · confiança alta (n = 21249)
  - 21249 decisões tocaram a área, em 280 de 328 vidas
- **corpo: 11% das decisões** · fato observado · confiança alta (n = 18014)
  - 18014 decisões tocaram a área, em 326 de 328 vidas
- **carreira: 8% das decisões** · fato observado · confiança alta (n = 12660)
  - 12660 decisões tocaram a área, em 327 de 328 vidas

| Área | Decisões | Vidas que usaram |
|---|---|---|
| dinheiro | 39040 | 328 (100%) |
| relacoes | 25346 | 328 (100%) |
| familia | 21249 | 280 (85%) |
| corpo | 18014 | 326 (99%) |
| carreira | 12660 | 327 (100%) |
| estudo | 10672 | 328 (100%) |
| investimentos | 9967 | 310 (95%) |
| empresa | 8944 | 297 (91%) |
| lazer | 6934 | 270 (82%) |
| dividas | 4056 | 274 (84%) |
| politica | 3136 | 312 (95%) |
| bens | 2271 | 276 (84%) |
| planos | 1518 | 327 (100%) |
| jogada | 838 | 119 (36%) |
| diplomacia | 476 | 55 (17%) |
| defesa | 277 | 36 (11%) |
| grupo | 250 | 59 (18%) |
| filantropia | 156 | 99 (30%) |
| coroa | 125 | 50 (15%) |
| dinastia | 59 | 42 (13%) |

## Sistemas negligenciados

- **coroa: abandonada na segunda metade da vida em 65% das vidas que a usaram** · fato observado · confiança baixa (n = 20)
  - 13 de 20 vidas
- **filantropia: abandonada na segunda metade da vida em 64% das vidas que a usaram** · fato observado · confiança media (n = 36)
  - 23 de 36 vidas
- **199 de 1004 storylets não apareceram em nenhuma das 328 vidas** · fato observado · confiança media (n = 199)
  - exemplos: reencontro_paixao, pais_envelhecem, fim_carreira, nega_ajuda, doente_crianca, pressao_carreira, piada_no_grupo, bilhete_carinhoso. O túnel (10.000 vidas) é a medida de cobertura; aqui a amostra é menor

## Gargalos de progressão

- **Chegar aos 10% mais ricos partindo de baixo: 77%** · fato observado · confiança alta (n = 116)
  - 89 de 116 vidas que começaram abaixo; idade mediana ao chegar: 33
  - Para reproduzir: comum/primeira, semente 10002, geração 1; comum/primeira, semente 10010, geração 1
- **Chegar ao 1% mais rico partindo de baixo: 45%** · fato observado · confiança alta (n = 157)
  - 70 de 157 vidas que começaram abaixo; idade mediana ao chegar: 39
  - Para reproduzir: comum/primeira, semente 10033, geração 1; comum/primeira, semente 10062, geração 1
- **Chegar ao 0,1% mais rico partindo de baixo: 20%** · fato observado · confiança alta (n = 192)
  - 39 de 192 vidas que começaram abaixo; idade mediana ao chegar: 54
  - Para reproduzir: comum/cautelosa, semente 11002, geração 1; comum/cautelosa, semente 11010, geração 1
- **O lugar no país quase não muda dos 30 aos 60 em 35% das vidas** · fato observado · confiança alta (n = 226)
  - percentil da riqueza aos 60 a menos de 2 pontos do de aos 30 em 78 de 226 vidas (inclui quem já estava no topo)
  - Para reproduzir: comum/primeira, semente 10030, geração 1; comum/primeira, semente 10041, geração 1
- **A experiência se esgota (saturação ≥ 0,7 por cinco anos) em 0% das vidas** · fato observado · confiança alta (n = 328)
  - nenhuma vida esgotou

## Situações incoerentes

- **Eventos com uma opção só disponível: 0,7% das escolhas** · fato observado · confiança alta (n = 16110)
  - 106 de 16110 eventos com duas opções ou mais tinham só uma liberada; os mais frequentes: acidente_em_casa (27), perdeu_emprego_na_crise (15), viagem_la_para_fora (15), proposta_de_compra (12), o_mais_rico_quer_a_sua_empresa (5). Pela regra do jogo, a opção bloqueada aparece com o motivo: isso é decisão de conteúdo, mas não é escolha
- **Quem está no 0,1% mais rico decide como gente comum: 13% das escolhas mexem em menos de 0,001% do patrimônio** · hipótese · confiança alta (n = 4882)
  - 625 de 4882 escolhas; as mais frequentes: luto (80), namoro_esfriou (33), esperou_por_voce (32), pisa_em_ovos (29), perdeu_emprego_na_crise (28), empresa_quebrou (27). Pode ser vida normal (o jantar com a família), ou pode ser o conteúdo sem escala
- **O patrimônio triplica num ano sem uma decisão de quem joga do mesmo tamanho: 0 vezes** · hipótese · confiança baixa (n = 9594)
  - 0 de 9594 anos olhados (com patrimônio de dez PIBs por pessoa ou mais; a herança e o dinheiro da família ficam de fora); a causa pode ser legítima (a empresa que cresce, a bolsa) e precisa ser lida no livro

## Conteúdos insuficientes

- **A saturação sobe com a riqueza: 0,03 na metade de baixo, 0,24 no 0,1% mais rico** · fato observado · confiança alta (n = 5154)
  - no topo, os componentes que mais pesam: salario 0,69, consequencia 0,44, repeticao 0,24 (5154 anos de vida adulta)
- **"escala" deixa de servir: fica saturado cinco anos seguidos em 1% das vidas que chegaram ao 1% mais rico (0% das outras)** · fato observado · confiança alta (n = 233)
  - 2 de 233 vidas do topo e 0 de 95 das outras; poucos dos storylets elegíveis mexem em 1% do patrimônio ou mais
  - Para reproduzir: comum/cautelosa, semente 11000, geração 1, 2102; comum/cautelosa, semente 11013, geração 1, 2119
- **"concorrencia" deixa de servir: fica saturado cinco anos seguidos em 6% das vidas que chegaram ao 1% mais rico (4% das outras)** · fato observado · confiança alta (n = 233)
  - 15 de 233 vidas do topo e 4 de 95 das outras; as concorrentes ficaram pequenas diante do grupo
  - Para reproduzir: comum/cautelosa, semente 11072, geração 1, 2084; comum/arriscada, semente 12001, geração 1, 2072; comum/arriscada, semente 12011, geração 1, 2086
- **"objetivos" deixa de servir: fica saturado cinco anos seguidos em 25% das vidas que chegaram ao 1% mais rico (3% das outras)** · fato observado · confiança alta (n = 233)
  - 58 de 233 vidas do topo e 3 de 95 das outras; há poucos planos e sonhos de pé ou por começar
  - Para reproduzir: comum/cautelosa, semente 11000, geração 1, 2102; comum/cautelosa, semente 11002, geração 1, 2102; comum/cautelosa, semente 11010, geração 1, 2102
- **"repeticao" deixa de servir: fica saturado cinco anos seguidos em 3% das vidas que chegaram ao 1% mais rico (0% das outras)** · fato observado · confiança alta (n = 233)
  - 8 de 233 vidas do topo e 0 de 95 das outras; os storylets que aparecem já tinham aparecido antes
  - Para reproduzir: comum/cautelosa, semente 11053, geração 1, 2094; comum/cautelosa, semente 11102, geração 1, 2088; realeza/cautelosa, semente 22500, geração 1, 2100
- **"consequencia" deixa de servir: fica saturado cinco anos seguidos em 66% das vidas que chegaram ao 1% mais rico (11% das outras)** · fato observado · confiança alta (n = 233)
  - 154 de 233 vidas do topo e 10 de 95 das outras; as decisões grandes mexem em menos de 0,1% do patrimônio
  - Para reproduzir: comum/primeira, semente 10031, geração 1, 2081; comum/primeira, semente 10053, geração 1, 2086; comum/primeira, semente 10061, geração 1, 2079
- **"salario" deixa de servir: fica saturado cinco anos seguidos em 53% das vidas que chegaram ao 1% mais rico (8% das outras)** · fato observado · confiança alta (n = 233)
  - 123 de 233 vidas do topo e 8 de 95 das outras; o salário de uma carreira inteira é pouco diante do patrimônio
  - Para reproduzir: comum/primeira, semente 10031, geração 1, 2068; comum/primeira, semente 10032, geração 1, 2059; comum/primeira, semente 10052, geração 1, 2062

| Faixa da riqueza (vida adulta) | Anos | Saturação | escala | investimento | concorrencia | objetivos | repeticao | consequencia | salario |
|---|---|---|---|---|---|---|---|---|---|
| metade de baixo | 803 | 0,03 | 0,00 | 0,00 | 0,01 | 0,00 | 0,19 | 0,00 | 0,00 |
| percentil 50 a 90 | 2358 | 0,04 | 0,00 | 0,00 | 0,03 | 0,01 | 0,19 | 0,03 | 0,03 |
| percentil 90 a 99 | 2943 | 0,07 | 0,01 | 0,00 | 0,06 | 0,01 | 0,20 | 0,17 | 0,06 |
| 1% mais rico (99 a 99,9) | 2636 | 0,18 | 0,16 | 0,00 | 0,08 | 0,08 | 0,28 | 0,58 | 0,12 |
| 0,1% mais rico | 5154 | 0,24 | 0,10 | 0,00 | 0,09 | 0,12 | 0,24 | 0,44 | 0,69 |

## Anomalias econômicas

- **patrimônio sobre o PIB: 25 vidas passam do limiar extremo (0,01)** · fato observado · confiança baixa (n = 25)
  - o maior: 0,512; por que este limiar: 0,1% do PIB é a fortuna das maiores famílias do país; 1% é a do mais rico do mundo diante do PIB dos Estados Unidos
  - Para reproduzir: trilionaria/cautelosa, semente 21505, geração 1, 2046; trilionaria/cautelosa, semente 21504, geração 1, 2057; trilionaria/cautelosa, semente 21501, geração 1, 2069
- **valor adicionado do grupo em % do PIB: 5 vidas passam do limiar extremo (2)** · fato observado · confiança baixa (n = 5)
  - o maior: 6,93; por que este limiar: meio ponto do PIB é uma das maiores empresas do país; dois pontos, a maior de todas
  - Para reproduzir: dinastia-rica-arriscada/arriscada, semente 3755318325, geração 8, 2295; dinastia-rica-arriscada/arriscada, semente 1656503194, geração 7, 2266; dinastia-bilionaria-arriscada/arriscada, semente 1912009399, geração 7, 2256
- **maior fatia de um mercado do Brasil: 8 vidas passam do limiar extremo (0,5)** · fato observado · confiança baixa (n = 8)
  - o maior: 0,811; por que este limiar: um quarto de um mercado já passa pelo Cade; metade é domínio
  - Para reproduzir: dinastia-rica-arriscada/arriscada, semente 1656503194, geração 7, 2266; trilionaria/arriscada, semente 21001, geração 1, 2057; dinastia-bilionaria-arriscada/arriscada, semente 715930113, geração 8, 2289
- **quantas vezes o patrimônio cresceu numa década: 2 vidas passam do limiar extremo (10000)** · fato observado · confiança baixa (n = 2)
  - o maior: 61,3 mil; por que este limiar: cem vezes em dez anos, sem contar herança, é o que só uma empresa ou uma jogada dá; dez mil pede que se leia o livro (a jogada certa ou um defeito)
  - Para reproduzir: realeza/arriscada, semente 22002, geração 1, 2068; realeza/arriscada, semente 22007, geração 1, 2058

| Extremo | Notáveis | Extremos | Medida |
|---|---|---|---|
| riqueza_relativa | 68 | 171 | percentil da riqueza no Brasil real |
| fortuna_nacional | 26 | 25 | patrimônio sobre o PIB |
| grupo_no_pib | 9 | 5 | valor adicionado do grupo em % do PIB |
| holding_com_subsidiarias | 10 | 15 | subsidiárias com uma holding |
| concentracao_de_mercado | 5 | 8 | maior fatia de um mercado do Brasil |
| poder_politico | 7 | 62 | anos com cargo de governo nacional, coroa ou regime |
| fortuna_entre_geracoes | 14 | 33 | geração que ainda começa entre os 1% mais ricos |
| dinastia_longa | 36 | 9 | gerações da família |
| exploracao_total | 132 | 39 | áreas do jogo usadas na vida |
| crescimento_explosivo | 10 | 2 | quantas vezes o patrimônio cresceu numa década |

## Oportunidades de melhoria

- **Conteúdo para o topo: histórias e decisões com custo e risco proporcionais ao patrimônio** · hipótese · confiança alta (n = 5154)
  - a saturação do topo (0,24) passa a da metade de baixo (0,03) em 0,21; é a A-04 da etapa 01
- **Decisões do topo com efeito proporcional: as escolhas grandes de quem está no 1% mexem pouco no que ele tem** · hipótese · confiança alta (n = 233)
  - "consequencia" fica saturado cinco anos seguidos em 66% das vidas que chegaram ao 1% mais rico (seção Conteúdos insuficientes)
- **Dar à carreira de quem é rico outro peso além do salário (o poder, a influência, a fama, o legado)** · hipótese · confiança alta (n = 233)
  - "salario" fica saturado cinco anos seguidos em 53% das vidas que chegaram ao 1% mais rico (seção Conteúdos insuficientes)
- **Dar continuidade à área coroa: o que quem começa por ela encontra depois** · hipótese · confiança baixa (n = 20)
  - coroa: abandonada na segunda metade da vida em 65% das vidas que a usaram. Com robôs, pode ser a regra deles; com pessoas, seria o sinal de que a área não tem segundo ato
- **Dar continuidade à área filantropia: o que quem começa por ela encontra depois** · hipótese · confiança baixa (n = 36)
  - filantropia: abandonada na segunda metade da vida em 64% das vidas que a usaram. Com robôs, pode ser a regra deles; com pessoas, seria o sinal de que a área não tem segundo ato

## Vidas em detalhe

### trilionaria/cautelosa, semente 21505, geração 1

Viveu de 2026 a 2109 (83 anos), com 367 decisões. Patrimônio final: R$ 19 trilhões (51,2% do PIB, percentil 100,00).

| Década | Perfis fortes (≥ 0,6) | Saturação média | Patrimônio no fim da década |
|---|---|---|---|
| 2026–2035 | — | 0,21 | R$ 0 |
| 2036–2045 | — | 0,00 | R$ 38 bilhões |
| 2046–2055 | Empreendedor 65%, Estrategista político 63% | 0,32 | R$ 34 bilhões |
| 2056–2065 | Estrategista político 96%, Investidor 77%, Explorador 76%, Acumulador de patrimônio 62% | 0,29 | R$ 1,2 trilhão |
| 2066–2075 | Estrategista político 98%, Acumulador de patrimônio 61% | 0,28 | R$ 1,6 trilhão |
| 2076–2085 | Estrategista político 98% | 0,19 | R$ 2,1 trilhões |
| 2086–2095 | Estrategista político 93%, Acumulador de patrimônio 73%, Investidor 72% | 0,34 | R$ 4,2 trilhões |
| 2096–2105 | Estrategista político 94%, Investidor 94%, Acumulador de patrimônio 74% | 0,42 | R$ 9,5 trilhões |
| 2106–2109 | Estrategista político 88%, Investidor 85%, Acumulador de patrimônio 85%, Explorador 70% | 0,40 | R$ 19 trilhões |

Extremos: percentil da riqueza no Brasil real = 1,00 (extremo, desde 2026); patrimônio sobre o PIB = 0,512 (extremo, desde 2046); anos com cargo de governo nacional, coroa ou regime = 20,0 (extremo, desde 2063); áreas do jogo usadas na vida = 0,800 (notável, desde 2109).

### dinastia-rica-arriscada/arriscada, semente 3755318325, geração 8

Viveu de 2295 a 2340 (74 anos), com 235 decisões. Patrimônio final: R$ 801 bilhões (1,60% do PIB, percentil 100,00).

| Década | Perfis fortes (≥ 0,6) | Saturação média | Patrimônio no fim da década |
|---|---|---|---|
| 2295–2304 | Industrialista 100%, Construtor de dinastias 98%, Empreendedor 97%, Explorador 92%, Estrategista político 92%, Generalista 85%, Acumulador de patrimônio 62% | 0,26 | R$ 363 bilhões |
| 2305–2314 | Industrialista 100%, Construtor de dinastias 98%, Empreendedor 94%, Estrategista político 94%, Generalista 73%, Acumulador de patrimônio 62% | 0,30 | R$ 700 bilhões |
| 2315–2324 | Industrialista 100%, Estrategista político 98%, Construtor de dinastias 98%, Explorador 98%, Generalista 97%, Empreendedor 93%, Acumulador de patrimônio 72% | 0,24 | R$ 1,6 trilhão |
| 2325–2334 | Industrialista 100%, Estrategista político 99%, Construtor de dinastias 98%, Empreendedor 96%, Generalista 69% | 0,12 | R$ 1,2 trilhão |
| 2335–2340 | Industrialista 100%, Estrategista político 99%, Construtor de dinastias 98%, Empreendedor 96%, Generalista 79%, Explorador 72% | 0,09 | R$ 801 bilhões |

Extremos: percentil da riqueza no Brasil real = 1,00 (extremo, desde 2295); patrimônio sobre o PIB = 0,0225 (extremo, desde 2295); valor adicionado do grupo em % do PIB = 6,93 (extremo, desde 2295); subsidiárias com uma holding = 11,0 (extremo, desde 2295); maior fatia de um mercado do Brasil = 0,564 (extremo, desde 2295); anos com cargo de governo nacional, coroa ou regime = 22,0 (extremo, desde 2319); geração que ainda começa entre os 1% mais ricos = 8,00 (extremo, desde 2295); gerações da família = 8,00 (extremo, desde 2295); áreas do jogo usadas na vida = 0,950 (extremo, desde 2340).

### dinastia-trilionaria-cautelosa/cautelosa, semente 3750701927, geração 4

Viveu de 2164 a 2196 (86 anos), com 129 decisões. Patrimônio final: R$ 71 bilhões (0,20% do PIB, percentil 100,00).

| Década | Perfis fortes (≥ 0,6) | Saturação média | Patrimônio no fim da década |
|---|---|---|---|
| 2164–2173 | Investidor 92%, Estrategista político 86%, Construtor de dinastias 63%, Acumulador de patrimônio 61% | 0,41 | R$ 60 bilhões |
| 2174–2183 | Investidor 92%, Estrategista político 87%, Construtor de dinastias 63%, Acumulador de patrimônio 60% | 0,38 | R$ 47 bilhões |
| 2184–2193 | Estrategista político 98%, Investidor 92%, Acumulador de patrimônio 66%, Construtor de dinastias 63% | 0,52 | R$ 71 bilhões |
| 2194–2196 | Estrategista político 99%, Investidor 92%, Explorador 75%, Construtor de dinastias 63% | 0,49 | R$ 71 bilhões |

Extremos: percentil da riqueza no Brasil real = 1,00 (extremo, desde 2164); patrimônio sobre o PIB = 0,00276 (notável, desde 2164); anos com cargo de governo nacional, coroa ou regime = 10,0 (notável, desde 2183); geração que ainda começa entre os 1% mais ricos = 4,00 (notável, desde 2164); gerações da família = 4,00 (notável, desde 2164); áreas do jogo usadas na vida = 0,750 (notável, desde 2196).

### comum/primeira, semente 10000, geração 1

Viveu de 2026 a 2093 (67 anos), com 226 decisões. Patrimônio final: R$ 36 mil (1,5e-7% do PIB, percentil 28,48).

| Década | Perfis fortes (≥ 0,6) | Saturação média | Patrimônio no fim da década |
|---|---|---|---|
| 2026–2035 | Orientado à sobrevivência 95% | 0,20 | R$ 0 |
| 2036–2045 | Orientado à sobrevivência 95% | 0,02 | R$ 9,7 mil |
| 2046–2055 | — | 0,00 | R$ 182 mil |
| 2056–2065 | Investidor 67% | 0,04 | R$ 100 mil |
| 2066–2075 | Orientado à sobrevivência 100% | 0,02 | -R$ 24 mil |
| 2076–2085 | Orientado à sobrevivência 100% | 0,00 | R$ 0 |
| 2086–2093 | Orientado à sobrevivência 90% | 0,00 | R$ 36 mil |

