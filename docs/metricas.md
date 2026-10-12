# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 536 eventos, 84 de personagens, 93 ações, 1446 escolhas, 219 linhas, 122 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 59,4% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 904 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,46 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 452,6 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 9,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,6% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 4,9% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,31 |
| Saturação V20 ≤ 95% | ✅ | 91,6% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 904 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 66,76 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,7% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 58,9% (168 dinastias, média de 3,1 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,82 (356 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 259 mil / R$ 379 mil / R$ 793 mil; p10 R$ 224 mil / R$ 217 mil / R$ 187 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 9,73% (p99 R$ 1,3 bilhão, maior R$ 1,9 trilhão) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,34% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 30,1% de 60,3% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 19,1% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 91,6% |
| Assinaturas sem regressão (≥ 918) | ❌ | 904 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 452,6 |
| CPU por vida ≤ 30 ms | ❌ | 66,76 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 95,8% (9,5 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 75,4% de 3590 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (692), A festa do século (570), Pix para a cidade inteira (364), Uma estátua sua (271), Um conselho que diz não (207), Uma fundação com seu nome (169), Uma equipe para desmontar (167), Bancar um presidente (152), Um mural de problemas (141), Tornar-se dispensável (140), Trazer a Copa do Mundo (132), Bancar quem quer sair (131), Pagar a cura de uma doença (111), Um programa espacial (102), Comprar a estatal (79), Fundar uma cidade (70), Fundar um país (36), Salvar o país da crise (33), Uma colônia em Marte (23).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 3 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 39,9% de 1813 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 20,8% delegaram, 56,4% centralizaram (754 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 25,9% (19,7 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (686), Bancar quem quer sair (386), Uma equipe para desmontar (360), Um mural de problemas (342), Tornar-se dispensável (292).
- **Na morte de quem manda:** a empresa perde em média 26,1% do valor; dependência p10 / mediana / p90: 38 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 1, p99 7, maior 14 anos (8357 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 49,8% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 64,7% / 23,1% / 10,0% / 2,2% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 15,4 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 26,9%, o bloco liberal 24,0%, a aliança da ordem 24,3%, o centrão 24,8%; 8,5 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,1% × 29,6%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,37% × 1,73%); ✓ dívida menor com a aliança da ordem que com o centrão (70% × 84% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,91% contra 0,87% por ano (37209 e 44811 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,71 votos por vida, 32,1% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 3,52 × 0,65 pontos do PIB por ano (94 e 248 governos); 96,3% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 3,7% |

## Portões do incremento 9 (o grupo de empresas)

| Portão | Situação | Valor |
|---|---|---|
| O grupo existe: ≥ 10% de quem tem empresa chega a ter duas ou mais de uma vez | ✅ | 15,1% de 7050 vidas com empresa |
| Fundir e abrir o capital acontecem: ≥ 2% de quem tem empresa funde e ≥ 2% vai para a bolsa | ✅ | 3,5% fundiram, 5,4% abriram o capital |
| Centenas de subsidiárias são possíveis: um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em até 10 anos | ✅ | 4 anos; nas vidas jogadas, o maior grupo teve 2316 (p99 320) |
| A mesa pesa: com várias empresas dependendo de quem tem talento, cada uma perde ≥ 0,5 ponto de tração | ✅ | 1,35 ponto em média (28246 empresas-ano) |
| Na bolsa, o valor anda com o mercado: a correlação do crescimento com o humor da bolsa é ≥ 0,2 maior que a das fechadas | ✅ | 0,35 na bolsa (7836 empresas-ano) × 0,00 fechadas (101268) |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 207.364 | 1,7% | 8,3% | 5,0% | 80% | 21,1% | 20,4 | 57 | 55 | 51% |
| o centrão | 191.121 | 2,0% | 8,4% | 4,9% | 84% | 25,2% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 187.471 | 2,0% | 8,5% | 4,9% | 70% | 29,5% | 17,6 | 50 | 45 | 52% |
| o bloco liberal | 185.182 | 2,4% | 8,6% | 4,8% | 81% | 29,6% | 22,1 | 43 | 50 | 51% |
| o regime | 8.674 | 1,8% | 8,9% | 4,8% | 20% | 31,4% | 17,1 | 35 | 37 | 47% |
| quem joga | 8.360 | 2,0% | 8,3% | 4,9% | 78% | 25,6% | 19,9 | 55 | 53 | 55% |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 59,4% / 91,6% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 66,9% |
| Efeito da memória (aleatória, V5 sem → com memória) | 66,2% → 56,0% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 904 (586) |
| Mobilidade: mesmo quintil da origem ao fim | 26,9% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,31 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,6% / 4,9% |
| Patrimônio p90/p10 | 584,7× (p10 R$ 298 mil, p90 R$ 174 milhões) |
| Desvio-padrão da felicidade média da vida | 8,46 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,8% |
| Toques por vida | 452,6 |
| Tempo de CPU por vida | 66,76 ms |
| Ações (fichas usadas) por vida | 159,6 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 9,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,9 |
| Vidas que terminam com filho ou filha para continuar | 84,7% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,1 / 58,9% / 25,6% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 13 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,82 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 60,3% |
| Entre quem abriu: quebrou / vendeu | 30,1% / 26,5% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,1 milhões / R$ 97 milhões / R$ 1,3 bilhão / R$ 1,9 trilhão |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 30,80% / 9,73% / 1,34% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 19,1% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 58,0 / 159,6 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 224 mil | R$ 259 mil | R$ 303 mil |
| moderado | R$ 217 mil | R$ 379 mil | R$ 611 mil |
| arrojado | R$ 187 mil | R$ 793 mil | R$ 2,7 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 815 | R$ 149 mil | R$ 1,7 milhão | R$ 43 milhões |
| moderado | 960 | R$ 171 mil | R$ 1,7 milhão | R$ 28 milhões |
| arrojado | 725 | R$ 186 mil | R$ 2,3 milhões | R$ 44 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 69,5 | R$ 2,3 milhões | 74,6 |
| pobre | 104 | 72,1 | R$ 2,2 milhões | 74,8 |
| remediada | 24 | 72,3 | R$ 2,6 milhões | 75,4 |
| media | 64 | 71,0 | R$ 3,3 milhões | 72,5 |
| rica | 64 | 71,8 | R$ 6,1 milhões | 75,1 |
| muito rica | 144 | 71,7 | R$ 22 milhões | 75,1 |
| bilionaria | 356 | 70,2 | R$ 2,4 bilhões | 75,4 |
| trilionaria | 276 | 70,7 | R$ 1,2 trilhão | 76,6 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 23% / 10% / 2% |
| Notícias do país por vida | 33,6 |
| Demissões por vida / vindas de uma recessão ou crise | 0,58 / 31,3% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 28 |
| Setor do último trabalho | serviço público 48% · serviços 14% · saúde 13% · cultura e internet 8% · comércio 5% · transporte e entregas 4% · construção 2% · tecnologia 2% · agro 1% · indústria 1% · sem setor 1% · finanças 1% · educação 1% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 23% | 37% | 50% | 59% | 81% | 88% | 92% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 21% | 18% | 16% | 15% |
| Q2 | 28% | 23% | 17% | 16% | 16% |
| Q3 | 23% | 24% | 20% | 17% | 16% |
| Q4 | 13% | 24% | 26% | 22% | 15% |
| Q5 | 5% | 8% | 20% | 29% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 71,3 | R$ 1,6 milhão | 73,2 |
| família pobre | 24% | 70,9 | R$ 1,7 milhão | 73,6 |
| família remediada | 20% | 72,4 | R$ 2,1 milhões | 73,8 |
| classe média | 18% | 71,2 | R$ 2,7 milhões | 73,4 |
| família rica | 13% | 71,4 | R$ 5,1 milhões | 73,6 |
| família muito rica | 13% | 71,1 | R$ 26 milhões | 74,6 |
| família bilionária | 3% | 69,1 | R$ 2,1 bilhões | 76,4 |

## Repetição

- **Dentro de uma vida:** 8,0% das aparições repetem uma instância já vista na mesma vida; pior vida: 26,9%.
- **Texto repetido entre vidas:** 34,4% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,0 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,5 · `eleicao_geral` 0,4 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`, `mutirao_de_cirurgias`, `escola_publica_boa`, `imposto_alto_no_contracheque`, `blitz_toda_noite`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 129 de 591 storylets — `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `duas_empresas_uma_agenda`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `o_conselho_vetou`, `presidente_pediu_as_contas`, `ferias_do_dono`, `tudo_pela_sua_mesa`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `mutirao_de_cirurgias`, `imposto_alto_no_contracheque`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `carro_de_presente`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `favor_do_presidente`, `cpi_da_campanha`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `subsidiaria_esquecida`, `conglomerado_com_desconto`, `primeiro_balanco_na_bolsa`, `grupo_na_capa`, `fusao_de_iguais`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `juros_altos_na_fatura`, `oposicao_na_tv`, `greve_geral`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 58,0 · **com causa anterior (cadeia):** 68,1 · **maior distância causa→consequência:** 47,9 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,8%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 98,9% |
| `luto` | npc | 97,7% |
| `enem` | evento | 94,4% |
| `primeiro_voto` | evento | 83,5% |
| `trabalho_grande` | acao | 74,6% |
| `bico_adulto` | acao | 69,6% |
| `visitar_familia` | acao | 68,9% |
| `cuidar_da_doenca` | npc | 63,1% |
| `eleicao_geral` | evento | 62,5% |
| `correr_no_quintal` | acao | 60,9% |
| `aposentadoria` | evento | 60,0% |
| `ler_gibi` | acao | 58,3% |
| `formatura` | evento | 57,7% |
| `parquinho` | acao | 57,3% |
| `almoco_domingo` | acao | 55,3% |
| `tocar_empresa` | acao | 52,6% |
| `ligar_amigo` | acao | 52,1% |
| `avo_mesada_escondida` | npc | 50,0% |
| `mochilao` | acao | 49,6% |
| `curso_online` | acao | 49,6% |
| `pos_graduacao` | acao | 48,4% |
| `correr` | acao | 47,6% |
| `estudar_enem` | acao | 46,7% |
| `demissao` | evento | 45,1% |
| `estudar_concurso` | acao | 44,4% |
| `baile_terceira_idade` | acao | 44,0% |
| `primeiro_investimento` | evento | 42,4% |
| `paquerar` | acao | 41,9% |
| `perdeu_emprego_na_crise` | npc | 41,2% |
| `doente_crianca` | npc | 40,7% |
| `primeiro_emprego` | evento | 40,2% |
| `estudar_escola` | acao | 38,9% |
| `cuidar_de_doente` | acao | 38,7% |
| `academia` | acao | 38,7% |
| `ler_livros` | acao | 38,6% |
| `balde_da_pracinha` | evento | 36,8% |
| `amigo_em_apuros` | npc | 35,8% |
| `copa_do_mundo` | evento | 35,7% |
| `ouvir_historia` | acao | 35,6% |
| `pre_escola` | evento | 34,6% |
| `viagem_dos_sonhos` | evento | 34,4% |
| `primeiro_beijo` | evento | 34,1% |
| `casamento` | npc | 33,4% |
| `acidente_em_casa` | evento | 33,3% |
| `rabiscar_parede` | acao | 33,0% |
| `creche_ou_vo` | evento | 32,2% |
| `perguntar_porque` | acao | 31,4% |
| `caminhada` | acao | 31,4% |
| `festa_80` | evento | 31,2% |
| `colesterol_alto` | evento | 31,0% |
| `videogame_do_amigo` | acao | 31,0% |
| `bullying_recreio` | evento | 30,2% |
| `amigo_pede_dinheiro` | evento | 29,9% |
| `golpe_pix` | evento | 29,8% |
| `banda_garagem` | evento | 29,7% |
| `estudar_tabuada` | acao | 29,7% |
| `investir_tesouro` | acao | 29,4% |
| `filho` | npc | 29,2% |
| `vape_festa` | evento | 28,9% |
| `carro` | evento | 28,9% |
| `historias_ou_telas` | evento | 28,8% |
| `natacao_no_clube` | acao | 28,6% |
| `filho_adolescente` | evento | 28,4% |
| `oportunidade_de_negocio` | evento | 28,4% |
| `bet` | evento | 28,4% |
| `doar_sangue` | evento | 28,4% |
| `estudar_faculdade` | acao | 28,3% |
| `hidro_com_a_turma` | acao | 28,1% |
| `previdencia` | acao | 28,1% |
| `viagem_realizada` | evento | 28,0% |
| `ajudar_em_casa` | acao | 27,8% |
| `pelada_de_quinta` | evento | 27,7% |
| `bilhete_carinhoso` | npc | 27,6% |
| `amigo_devolve` | npc | 27,2% |
| `cachorro_caramelo` | evento | 27,1% |
| `investimento_furado` | evento | 27,0% |
| `vacina_no_posto` | evento | 26,8% |
| `piada_no_grupo` | npc | 26,5% |
| `criptomoeda` | evento | 26,4% |
| `primeiro_celular` | evento | 26,2% |
| `largar_tudo` | evento | 26,0% |
| `check_up` | acao | 26,0% |
| `curso_nota_alta` | evento | 25,9% |
| `pelada` | acao | 25,4% |
| `rebalancear` | acao | 25,4% |
| `perdeu_aniversario` | npc | 24,8% |
| `guardar_dinheiro` | acao | 24,7% |
| `festa_tema` | evento | 24,6% |
| `proposta_na_expansao` | evento | 24,5% |
| `show_no_estadio` | acao | 24,4% |
| `tatuagem` | evento | 24,4% |
| `juros_compostos` | evento | 24,2% |
| `sair_de_casa` | evento | 24,1% |
| `voltar_a_estudar` | acao | 23,9% |
| `bolao_do_trabalho` | evento | 23,7% |
| `casa_dos_pais` | evento | 23,5% |
| `vaquinha_do_vizinho` | evento | 23,4% |
| `pensar_em_adotar` | evento | 23,4% |
| `festa_junina` | evento | 23,3% |
| `tempo_com_amor` | acao | 23,3% |
| `esporte_depois_da_aula` | evento | 22,9% |
| `emprego_saude` | evento | 22,8% |
| `bico_adolescente` | acao | 22,7% |
| `casa_propria` | evento | 22,5% |
| `cortar_gastos` | acao | 21,8% |
| `hobby_horta` | evento | 21,8% |
| `bateu_o_carro` | evento | 21,7% |
| `vizinho_barulhento` | evento | 21,7% |
| `heranca_do_tio` | evento | 21,6% |
| `festa_da_cidade` | acao | 21,6% |
| `hora_extra` | acao | 21,6% |
| `avo_conta_historias` | npc | 21,5% |
| `cursinho_pago` | acao | 21,3% |
| `subir_de_padrao` | evento | 21,2% |
| `desempregado` | evento | 21,2% |
| `reencontro_da_turma` | evento | 21,1% |
| `pede_ajuda` | npc | 21,0% |
| `reforma_da_casa` | evento | 21,0% |
| `filho_formatura` | evento | 20,9% |
| `cozinhar_com_a_avo` | acao | 20,8% |
| `encontro` | acao | 20,8% |
| `moeda_digital` | evento | 20,3% |
| `futebol_de_varzea` | acao | 20,1% |
| `assalto_na_rua` | evento | 20,1% |
| `mesada` | evento | 19,3% |
| `franquia` | evento | 19,2% |
| `feira_ciencias` | evento | 19,0% |
| `primeira_palavra` | evento | 19,0% |
| `festa_sem_pais` | evento | 18,9% |
| `voltar_estudar` | evento | 18,7% |
| `vender_doce` | acao | 18,6% |
| `catapora` | evento | 18,4% |
| `baile_da_terceira_idade` | evento | 18,4% |
| `cirurgia_de_catarata` | evento | 18,3% |
| `fazenda_a_venda` | evento | 18,3% |
| `bloco_de_carnaval` | evento | 18,0% |
| `pai_ausente_volta` | npc | 17,8% |
| `carteira_da_diarista` | evento | 17,8% |
| `festa_de_sao_joao` | evento | 17,6% |
| `empresa_quebrou` | evento | 17,5% |
| `escrever_memorias` | evento | 17,5% |
| `investimento_rotina` | evento | 17,4% |
| `mudar_para_a_praia` | evento | 17,4% |
| `hidroginastica` | evento | 17,3% |
| `entregas` | acao | 17,1% |
| `ceu_de_fumaca` | evento | 17,0% |
| `multa_e_batida` | evento | 16,8% |
| `golpe_do_falso_neto` | evento | 16,8% |
| `alugueis_dos_fundos` | evento | 16,8% |
| `cripto_fomo` | evento | 16,7% |
| `imposto_alto_no_contracheque` | evento | 16,5% |
| `fome_no_fim_do_mes` | evento | 16,3% |
| `convite_para_palestrar` | evento | 16,3% |
| `curso_nota_media` | evento | 16,3% |
| `corte_de_salario` | evento | 16,2% |
| `testamento` | evento | 16,0% |
| `vaga_sobrando` | evento | 15,9% |
| `compra_por_impulso` | evento | 15,6% |
| `entregador_chuva` | evento | 15,4% |
| `leu_antes_dos_colegas` | evento | 15,3% |
| `imposto_baixo_sobrou` | evento | 15,3% |
| `ingles_crianca` | acao | 15,2% |
| `convite_do_luxo` | evento | 15,2% |
| `queda` | evento | 15,0% |
| `reencontro_amigo` | evento | 14,9% |
| `alavancagem` | evento | 14,9% |
| `esporte_escola` | acao | 14,9% |
| `promocao` | evento | 14,7% |
| `sovina_ou_sabio` | evento | 14,4% |
| `maratona` | evento | 14,4% |
| `apartamento_na_planta` | evento | 14,4% |
| `imovel_valorizou` | evento | 14,3% |
| `pobreza_na_porta` | evento | 14,2% |
| `casamento_na_igreja` | npc | 14,1% |
| `juros_baixos_euforia` | evento | 14,0% |
| `aula_de_musica` | evento | 13,8% |
| `cartao_credito` | evento | 13,8% |
| `concorrente_gigante` | evento | 13,8% |
| `produto_viralizou` | evento | 13,8% |
| `socio_sumiu` | evento | 13,7% |
| `peneira` | evento | 13,7% |
| `casa_na_praia` | evento | 13,5% |
| `consorcio` | evento | 13,4% |
| `quarto_dividido` | evento | 13,3% |
| `parar_de_fumar` | acao | 13,2% |
| `brigas_de_madrugada` | evento | 13,1% |
| `rua_tranquila` | evento | 13,0% |
| `reuniao_de_condominio` | evento | 12,9% |
| `negocio_no_aperto` | evento | 12,9% |
| `briga_em_casa` | npc | 12,8% |
| `feira_de_ciencias` | evento | 12,5% |
| `casa_cheia` | evento | 12,5% |
| `assalto_no_onibus` | evento | 12,4% |
| `bolsa_de_estudos` | evento | 12,4% |
| `greve_dos_onibus` | evento | 12,4% |
| `separacao` | evento | 12,2% |
| `juros_altos_rendendo` | evento | 12,2% |
| `investidor_anjo` | evento | 12,0% |
| `retiro_da_igreja` | evento | 12,0% |
| `chefe_novo` | evento | 12,0% |
| `bolsa_subiu_sem_voce` | evento | 12,0% |
| `aniversario_da_infancia` | evento | 11,9% |
| `balcao_negocio` | acao | 11,9% |
| `role` | acao | 11,8% |
| `separacao_dos_pais` | evento | 11,8% |
| `cofrinho` | acao | 11,8% |
| `padrao_de_vida` | evento | 11,7% |
| `cripto_disparou` | evento | 11,6% |
| `peito_chiando` | evento | 11,5% |
| `recomecar_amor` | acao | 11,5% |
| `surpresa_do_amor` | npc | 11,5% |
| `praia` | acao | 11,3% |
| `crise_40` | evento | 11,2% |
| `ressaca_do_mar` | evento | 11,2% |
| `festa_surpresa` | evento | 10,9% |
| `sao_joao` | acao | 10,8% |
| `inquilino_sumiu` | evento | 10,8% |
| `titulo_eleitor` | evento | 10,7% |
| `blitz_toda_noite` | evento | 10,7% |
| `aposentadoria_ativa` | evento | 10,7% |
| `noite_de_stand_up` | evento | 10,6% |
| `seca_no_sertao` | evento | 10,5% |
| `ponto_comercial` | evento | 10,5% |
| `inquilino_dos_sonhos` | evento | 10,5% |
| `brincar_com_irmao_avo` | acao | 10,3% |
| `cheia_do_rio` | evento | 10,3% |
| `edital_de_cultura` | evento | 10,3% |
| `atendimento_robo` | evento | 10,2% |
| `pousada_na_praia` | evento | 10,1% |
| `vicio_aposta` | evento | 10,1% |
| `fundo_da_familia` | npc | 9,9% |
| `festival_do_boi` | evento | 9,8% |
| `olimpiada_matematica` | evento | 9,8% |
| `gerente_do_banco` | evento | 9,8% |
| `cidadania_italiana` | evento | 9,7% |
| `desemprego_em_alta` | evento | 9,5% |
| `comer_tudo` | acao | 9,4% |
| `amor_proposta_fora` | npc | 9,3% |
| `tocar_no_bar` | acao | 9,3% |
| `mudanca_de_escola` | evento | 9,3% |
| `piramide_no_grupo` | npc | 9,3% |
| `geada_no_sul` | evento | 9,2% |
| `conteudo_extra` | acao | 9,2% |
| `chimarrao` | acao | 9,2% |
| `colo_da_avo` | acao | 9,1% |
| `pressao_alta` | evento | 9,1% |
| `festa_de_15` | evento | 9,1% |
| `brincar_na_rua` | acao | 9,0% |
| `ouvido_para_musica` | evento | 9,0% |
| `fiscalizacao` | evento | 9,0% |
| `herdeiro_gastao` | evento | 9,0% |
| `brincar_com_o_pai` | acao | 8,9% |
| `apagao_no_morro` | evento | 8,8% |
| `auxilio_na_conta` | evento | 8,8% |
| `governo_que_voce_elegeu_frente_popular` | evento | 8,8% |
| `faculdade_vida` | evento | 8,7% |
| `concurso_lotado` | evento | 8,6% |
| `mei_negocio` | evento | 8,6% |
| `estatua` | jogada | 8,5% |
| `family_office` | evento | 8,5% |
| `dente_de_leite` | evento | 8,4% |
| `amor_piada_interna` | npc | 8,4% |
| `boi_bumba` | acao | 8,3% |
| `assembleia_do_predio` | evento | 8,3% |
| `brincar_amigos` | acao | 8,1% |
| `filho_desenho` | npc | 8,0% |
| `dolar_disparou` | evento | 8,0% |
| `plantao_lotado` | evento | 7,9% |
| `enchente_na_rua` | evento | 7,9% |
| `festa_surpresa_para` | npc | 7,8% |
| `propina_da_empreiteira` | evento | 7,8% |
| `show_no_bar` | evento | 7,8% |
| `passear_de_carrinho` | acao | 7,7% |
| `fugir_inflacao` | acao | 7,6% |
| `moto_na_chuva` | evento | 7,6% |
| `pescaria_no_pantanal` | evento | 7,6% |
| `adocao_chegou` | evento | 7,6% |
| `cripto_de_novo` | acao | 7,5% |
| `soltar_pipa` | acao | 7,5% |
| `pular_corda` | acao | 7,4% |
| `bolsa_derreteu` | evento | 7,3% |
| `mutirao_de_cirurgias` | evento | 7,3% |
| `doenca_de_quem_ama` | evento | 7,3% |
| `netos` | evento | 7,2% |
| `geladeira_vazia` | evento | 7,2% |
| `figurinha_repetida` | acao | 7,1% |
| `chaves_do_apartamento` | evento | 7,0% |
| `mutirao_da_laje` | evento | 6,9% |
| `merenda` | evento | 6,9% |
| `crise_de_ansiedade` | evento | 6,9% |
| `cripto_derreteu` | evento | 6,8% |
| `estatua_pichada` | evento | 6,8% |
| `grupo_de_jovens` | evento | 6,8% |
| `proposta_de_compra` | evento | 6,8% |
| `ano_de_prejuizo` | evento | 6,8% |
| `vender_doce_nato` | acao | 6,8% |
| `tempo_com_filho` | acao | 6,8% |
| `operacao_policial` | evento | 6,7% |
| `burnout_empresa` | evento | 6,7% |
| `promessa_da_mae` | evento | 6,6% |
| `blindar_contas` | acao | 6,6% |
| `briga_dos_pais` | evento | 6,5% |
| `bico_na_expansao` | evento | 6,5% |
| `festival_lotado` | evento | 6,5% |
| `vereador` | evento | 6,5% |
| `namorar_depois_dos_60` | evento | 6,4% |
| `asma_na_educacao_fisica` | evento | 6,4% |
| `convite_do_partido` | evento | 6,3% |
| `imposto_sobre_fortunas` | evento | 6,3% |
| `fundacao_com_seu_nome` | evento | 6,2% |
| `greve_do_servidor` | evento | 6,2% |
| `amigo_muda_de_cidade` | npc | 6,2% |
| `escola_publica_boa` | evento | 6,2% |
| `obra_grande_no_norte` | evento | 6,1% |
| `tarifa_do_app` | evento | 6,1% |
| `natal_com_politica` | evento | 6,0% |
| `viralizou` | evento | 6,0% |
| `pais_separados_natal` | evento | 5,9% |
| `processo_trabalhista` | evento | 5,9% |
| `olimpiada` | acao | 5,9% |
| `paquerar_timido` | acao | 5,9% |
| `vo_receita` | evento | 5,9% |
| `comecar_terapia` | evento | 5,8% |
| `filho_imitacao` | npc | 5,7% |
| `primeiro_funcionario` | evento | 5,7% |
| `mae_quer_morar_junto` | npc | 5,6% |
| `festa_do_seculo` | jogada | 5,6% |
| `joelho_da_pelada` | evento | 5,6% |
| `votacao_polemica` | evento | 5,6% |
| `vo_partiu` | npc | 5,6% |
| `pais_na_crise` | npc | 5,5% |
| `cachoeira` | acao | 5,4% |
| `festa_vazou` | evento | 5,4% |
| `fiador` | npc | 5,4% |
| `inflacao_no_mercado` | evento | 5,4% |
| `compativel_para_medula` | evento | 5,3% |
| `briga_na_cozinha` | evento | 5,2% |
| `aprovado_concurso_estudo` | evento | 5,2% |
| `luto_do_bicho` | npc | 5,1% |
| `emprestimo_ao_irmao` | evento | 5,0% |
| `funcionario_genial` | evento | 5,0% |
| `clinica_particular_contrata` | evento | 4,9% |
| `escola_de_samba` | jogada | 4,9% |
| `tosse_cronica` | evento | 4,9% |
| `bater_o_pe_com_o_chefe` | evento | 4,9% |
| `agro_na_cidade` | evento | 4,8% |
| `cobranca_de_notas` | npc | 4,6% |
| `intercambio_pago` | evento | 4,6% |
| `heranca` | evento | 4,6% |
| `amor_quer_mudar_de_carreira` | npc | 4,6% |
| `depois_do_cargo` | evento | 4,6% |
| `cursinho_comunitario` | evento | 4,4% |
| `crescer_devagar` | evento | 4,4% |
| `assumir_negocio` | evento | 4,4% |
| `curso_nota_baixa` | evento | 4,3% |
| `sociedade_amigo` | evento | 4,3% |
| `alguem_especial` | evento | 4,3% |
| `trabalho_do_pai` | acao | 4,3% |
| `confeitaria_da_vo` | evento | 4,3% |
| `casamento_do_filho` | evento | 4,3% |
| `carona_de_madrugada` | npc | 4,3% |
| `este_e_o_ano` | evento | 4,2% |
| `amigo_sumiu_e_voltou` | npc | 4,2% |
| `posto_que_funciona` | evento | 4,2% |
| `nome_sujo` | evento | 4,1% |
| `obra_ou_hospital` | evento | 4,1% |
| `convite_para_candidatura` | evento | 4,1% |
| `ainda_mora_com_pais` | evento | 4,0% |
| `tentar_outra_cidade` | evento | 4,0% |
| `convite_igreja` | npc | 4,0% |
| `enchente_na_cidade` | evento | 4,0% |
| `volta_terra` | evento | 4,0% |
| `proposta_sao_paulo` | evento | 4,0% |
| `netos_nas_ferias` | evento | 4,0% |
| `joias_no_cofre` | evento | 3,9% |
| `pescaria_no_rio` | evento | 3,9% |
| `vaga_na_capital` | evento | 3,9% |
| `filho_cuida` | npc | 3,8% |
| `greve_dos_professores` | evento | 3,8% |
| `balcao_da_familia` | evento | 3,7% |
| `apresentacao_para_a_diretoria` | evento | 3,7% |
| `obra_do_predio` | evento | 3,7% |
| `balcao_de_crianca` | evento | 3,6% |
| `aposentadoria_nao_da` | npc | 3,6% |
| `plano_de_saude_subiu` | evento | 3,5% |
| `faculdade_depois_dos_60` | npc | 3,5% |
| `reajuste_dos_servidores` | evento | 3,5% |
| `clientes_sumiram` | evento | 3,5% |
| `recaida_cigarro` | evento | 3,5% |
| `arrojado_na_queda` | evento | 3,5% |
| `carregar_a_geladeira` | evento | 3,4% |
| `conselho_que_diz_nao` | jogada | 3,4% |
| `shows_cancelados` | evento | 3,4% |
| `fila_do_posto` | evento | 3,4% |
| `black_friday` | evento | 3,3% |
| `depois_da_venda` | evento | 3,3% |
| `ferias_do_dono` | evento | 3,3% |
| `programa_de_moradia` | evento | 3,3% |
| `prova_concurso` | evento | 3,2% |
| `ajudar_na_roca` | acao | 3,2% |
| `expandir_na_alta` | evento | 3,1% |
| `ferias_com_a_familia_do_amor` | npc | 3,1% |
| `aposentado_quer_ajudar_na_empresa` | npc | 3,1% |
| `crise_no_setor` | evento | 3,0% |
| `surto_no_bairro` | evento | 3,0% |
| `reencontro_paixao` | evento | 3,0% |
| `cancelado` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `filho_quer_carro` | evento | 2,9% |
| `briga_por_heranca` | evento | 2,9% |
| `gravidez_surpresa` | npc | 2,9% |
| `rodada_grande` | evento | 2,9% |
| `hospital_sem_insumo` | evento | 2,9% |
| `convite_para_o_palco_grande` | evento | 2,9% |
| `terapia` | acao | 2,8% |
| `birra_no_mercado` | evento | 2,7% |
| `cidadania_do_bisavo` | evento | 2,7% |
| `crianca_ansiosa` | evento | 2,6% |
| `filho_saude_fragil` | npc | 2,6% |
| `gorjeta_boa` | evento | 2,6% |
| `emprego_tecnologia` | evento | 2,6% |
| `dizimo` | evento | 2,5% |
| `imovel_na_baixa` | evento | 2,5% |
| `visitar_de_longe` | acao | 2,5% |
| `duas_empresas_uma_agenda` | evento | 2,5% |
| `escola_integral` | evento | 2,5% |
| `cuidar_netos` | acao | 2,5% |
| `seguranca_particular` | evento | 2,4% |
| `fim_do_amor` | npc | 2,4% |
| `vida_depois_da_condenacao` | evento | 2,4% |
| `time_a_venda` | evento | 2,3% |
| `emprestimo_de_volta` | evento | 2,3% |
| `segundo_carro` | evento | 2,2% |
| `carreira_futebol` | evento | 2,2% |
| `filho_primeiro_salario` | npc | 2,2% |
| `missa_em_familia` | acao | 2,1% |
| `filho_passou_longe` | npc | 2,1% |
| `ajudar_na_coleta` | evento | 2,1% |
| `frete_sumiu` | evento | 2,1% |
| `lembranca_primeiro_amor` | evento | 2,1% |
| `lesao_grave` | evento | 2,1% |
| `bancar_quem_sai` | jogada | 2,1% |
| `passear_pet` | acao | 2,0% |
| `paparazzi` | evento | 2,0% |
| `pai_namorando_de_novo` | npc | 2,0% |
| `renegociar_divida` | evento | 2,0% |
| `cara_de_comercial` | evento | 2,0% |
| `bodas_de_prata` | evento | 1,9% |
| `presidir_cpi` | evento | 1,9% |
| `familia_descobre_o_testamento` | evento | 1,9% |
| `sair_de_casa_cedo` | evento | 1,8% |
| `padrao_aperta` | evento | 1,8% |
| `segredo_de_familia` | npc | 1,8% |
| `salario_parcelado` | evento | 1,8% |
| `acoes_da_startup` | evento | 1,8% |
| `pane_no_voo` | evento | 1,8% |
| `ocorrencia_perigosa` | evento | 1,8% |
| `hit_viral` | evento | 1,7% |
| `promocao_em_outra_cidade` | evento | 1,7% |
| `contrato_publicitario` | evento | 1,7% |
| `emprego_educacao` | evento | 1,7% |
| `retirada_demais` | evento | 1,7% |
| `amigo_ficou_rico` | npc | 1,6% |
| `apartamento_de_presente` | evento | 1,6% |
| `mural_de_problemas` | jogada | 1,6% |
| `burnout` | evento | 1,6% |
| `robos_na_fabrica` | evento | 1,5% |
| `doar_em_vida` | evento | 1,5% |
| `foto_de_campanha` | evento | 1,5% |
| `proposta_da_europa` | evento | 1,5% |
| `reforma_sem_fim` | evento | 1,5% |
| `divida_publica_assusta` | evento | 1,5% |
| `conselho_de_fachada` | evento | 1,5% |
| `amor_quadro_de_tarefas` | npc | 1,4% |
| `juros_altos` | evento | 1,4% |
| `proposta_em_dolar` | evento | 1,4% |
| `turne_nacional` | evento | 1,4% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,4% |
| `dez_anos_de_empresa` | evento | 1,4% |
| `tocar_o_negocio` | acao | 1,4% |
| `chefe_amigo` | evento | 1,4% |
| `happy_hour` | acao | 1,4% |
| `critico_no_salao` | evento | 1,4% |
| `apuracao_do_carnaval` | evento | 1,3% |
| `deploy_de_sexta` | evento | 1,3% |
| `safra_da_fazenda` | evento | 1,3% |
| `papel_da_vida` | evento | 1,3% |
| `o_conselho_vetou` | evento | 1,3% |
| `lista_dos_mais_ricos` | evento | 1,2% |
| `holding_da_familia` | evento | 1,2% |
| `oferece_ajuda` | npc | 1,2% |
| `vendas_recorde` | evento | 1,2% |
| `equipe_para_desmontar` | jogada | 1,2% |
| `grade_na_janela` | evento | 1,2% |
| `rebaixamento` | evento | 1,2% |
| `vaga_na_empresa_dele` | npc | 1,2% |
| `nao_para_quieto` | evento | 1,2% |
| `briga_de_casal` | npc | 1,2% |
| `mestrado_fora` | evento | 1,1% |
| `intercambio` | evento | 1,1% |
| `celular_dos_pais` | npc | 1,1% |
| `obra_atrasada` | evento | 1,1% |
| `livro_viralizou` | evento | 1,1% |
| `pix_para_a_cidade` | jogada | 1,0% |
| `pressao_carreira` | npc | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `vaga_no_agro` | evento | 1,0% |
| `mais_uma_mudanca` | evento | 0,9% |
| `tornar_se_dispensavel` | jogada | 0,9% |
| `sucessao_coroa` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `fa_obcecado` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `filial_fechando` | evento | 0,9% |
| `layoff_por_email` | evento | 0,9% |
| `padrinho_casamento` | npc | 0,9% |
| `solucao_inesperada` | evento | 0,9% |
| `treinar_no_clube` | acao | 0,8% |
| `tradutor_da_familia` | evento | 0,8% |
| `fila_do_emprego` | evento | 0,8% |
| `pedreiro_vale_ouro` | evento | 0,8% |
| `oferta_pela_subsidiaria` | evento | 0,8% |
| `amor_paga_a_conta` | npc | 0,8% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,8% |
| `sucessao_regime` | evento | 0,8% |
| `estatua_derrubada` | evento | 0,7% |
| `governo_que_voce_elegeu_centrao` | evento | 0,7% |
| `acampamento_na_porta` | evento | 0,7% |
| `carro_de_luxo_na_rua` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `ministro_pede_ajuste` | evento | 0,7% |
| `final_da_copa` | evento | 0,7% |
| `nega_ajuda` | npc | 0,7% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 0,7% |
| `aluguel_caro` | evento | 0,7% |
| `tentar_a_vida_na_europa` | evento | 0,7% |
| `fim_de_semana_no_sitio` | evento | 0,7% |
| `obra_parada` | evento | 0,7% |
| `infancia_no_palacio` | evento | 0,7% |
| `a_empresa_sem_voce` | evento | 0,7% |
| `bola_autografada` | evento | 0,7% |
| `desfile_das_campeas` | evento | 0,6% |
| `noite_de_corridas` | evento | 0,6% |
| `filho_briga_na_escola` | npc | 0,6% |
| `choque_de_culturas` | evento | 0,6% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,6% |
| `peneira_do_sobrenome` | evento | 0,6% |
| `despejo` | evento | 0,6% |
| `paciente_famoso` | evento | 0,6% |
| `violencia_vira_manchete` | evento | 0,6% |
| `circo_vai_embora` | evento | 0,6% |
| `proposta_pelo_negocio` | evento | 0,6% |
| `feriado_na_praia` | evento | 0,6% |
| `bonanca_no_governo` | evento | 0,6% |
| `fundacao` | jogada | 0,6% |
| `estagio_do_pai` | evento | 0,5% |
| `plantao_que_nao_acaba` | evento | 0,5% |
| `transito_de_sp` | evento | 0,5% |
| `montadora_vai_fechar` | evento | 0,5% |
| `cavalo_campeao` | evento | 0,5% |
| `emprego_negocios` | evento | 0,5% |
| `bancar_presidente` | jogada | 0,5% |
| `naturalizacao` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `negocio_em_crise` | evento | 0,5% |
| `turno_extra_na_fabrica` | evento | 0,5% |
| `filho_apresenta_namoro` | npc | 0,5% |
| `juros_altos_na_fatura` | evento | 0,5% |
| `greve_geral` | evento | 0,5% |
| `favor_do_presidente` | evento | 0,5% |
| `shopping_lotado` | evento | 0,5% |
| `emprego_artes` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `fusao_de_iguais` | evento | 0,5% |
| `pais_envelhecem` | npc | 0,4% |
| `assumir_a_fazenda` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `decreto_da_economia` | evento | 0,4% |
| `amor_sempre_trabalhando` | npc | 0,4% |
| `quebra_de_safra` | evento | 0,4% |
| `sequestro_frustrado` | evento | 0,4% |
| `parcela_da_tv` | npc | 0,4% |
| `concurso_em_brasilia` | evento | 0,4% |
| `abrir_capital` | evento | 0,4% |
| `regra_sob_medida` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `o_mural_do_boton` | evento | 0,4% |
| `bonus_do_banco` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `ex_aluno` | evento | 0,4% |
| `proposta_remota` | evento | 0,4% |
| `crise_internacional` | evento | 0,4% |
| `aperto_do_mes` | evento | 0,4% |
| `reencontro_amigo_brigado` | evento | 0,4% |
| `ferias_coletivas` | evento | 0,4% |
| `picadeiro` | evento | 0,4% |
| `cliente_perdeu_tudo` | evento | 0,4% |
| `pais_aposentados` | npc | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `cargo_no_gabinete` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `passou_mal_de_novo` | npc | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `fim_carreira` | evento | 0,3% |
| `filho_pede_ajuda` | npc | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `reconciliacao` | npc | 0,3% |
| `cursinho_paga_bem` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `zona_franca` | evento | 0,3% |
| `rival_bilionario` | evento | 0,3% |
| `operacao_no_gabinete` | evento | 0,3% |
| `escandalo_do_lobby` | evento | 0,3% |
| `amor_viaja_demais` | npc | 0,3% |
| `clientes_em_panico` | evento | 0,3% |
| `royalties_secaram` | evento | 0,3% |
| `paparazzi_real` | evento | 0,3% |
| `aluno_impossivel` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `amor_planilha` | npc | 0,2% |
| `emprego_engenharia` | evento | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `mansao_vazia` | evento | 0,2% |
| `sucessao_na_empresa` | evento | 0,2% |
| `presidente_pediu_as_contas` | evento | 0,2% |
| `oposicao_na_tv` | evento | 0,2% |
| `casamento_real` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `vista_da_cobertura` | evento | 0,2% |
| `mordomias_reais` | evento | 0,2% |
| `conta_na_suica` | evento | 0,2% |
| `cliente_preso` | evento | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `amor_saude_fragil` | npc | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `cobrir_a_tatuagem` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `cpi_da_campanha` | evento | 0,2% |
| `giz_do_proprio_bolso` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `queda_do_cargo` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `jatinho_para_onde` | evento | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `programa_espacial` | jogada | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `subsidiaria_esquecida` | evento | 0,1% |
| `amigo_lembra_zoeira` | npc | 0,1% |
| `filho_distante` | npc | 0,1% |
| `renegociar_cartao` | acao | 0,1% |
| `os_dois_lados` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `primeiro_balanco_na_bolsa` | evento | 0,1% |
| `lancamento` | evento | 0,0% |
| `hospital_da_fundacao` | evento | 0,0% |
| `receita_no_seu_pe` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `quem_manda_se_voce_faltar` | evento | 0,0% |
| `a_empresa_anda_sozinha` | evento | 0,0% |
| `jubileu` | evento | 0,0% |
| `vida_depois_da_coroa` | evento | 0,0% |
| `festa_no_iate` | evento | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `eleicao_de_fachada` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `helicoptero_no_teto` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `filho_hamburgueria` | npc | 0,0% |
| `construtora_quebrou` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `herdeiros_de_olho` | evento | 0,0% |
| `conglomerado_com_desconto` | evento | 0,0% |
| `grupo_na_capa` | evento | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
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
| `elefante_branco` | evento | 0,0% |
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

- **Ganhas na simulação (de quem joga):** 186 · **mudaram algo em pelo menos uma vida:** 187
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,3 · p10 50 · p25 57 · mediana 71 · p75 85 · p90 96

```
até 19         █                              0,3%
20–29                                         0,3%
30–39          ██                             1,0%
40–49          █████████████                  8,3%
50–59          ██████████████████████████████ 19,1%
60–69          █████████████████████████████  18,8%
70–79          ██████████████████████████████ 18,9%
80–89          ███████████████████████        14,8%
90–99          █████████████████████          13,0%
100+           █████████                      5,5%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 298 mil · p25 R$ 865 mil · mediana R$ 3,8 milhões · p75 R$ 35 milhões · p90 R$ 174 milhões

```
negativo                                      0,8%
até 10 mil                                    0,4%
10–50 mil      █                              0,9%
50–200 mil     ███                            4,7%
200 mil–1 mi   ██████████████                 21,2%
1–5 mi         █████████████████              25,8%
5 mi+          ██████████████████████████████ 46,3%
```

**Felicidade média ao longo da vida** — p10 62 · mediana 74 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,9%
60–69          █████████████████              24,7%
70–79          ██████████████████████████████ 44,5%
80+            █████████████████              24,5%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,0 | R$ 1,2 milhão | 70,1 | 54,5 | 159,7 | 64,3 | 100% | 59% |
| cautelosa | 92,0 🏆 | R$ 67 milhões 🏆 | 75,2 | 70,3 | 216,5 | 85,0 | 100% | 69% |
| arriscada | 52,1 | R$ 2,4 milhões | 78,7 🏆 | 45,2 | 124,7 | 65,8 | 100% | 53% |
| aleatoria | 76,2 | R$ 1,8 milhão | 71,2 | 61,9 | 137,7 | 57,3 | 100% | 56% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 13,1% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,0% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,1% — de um AVC, numa terça-feira sem graça
- 6,8% — de velhice, dormindo, num domingo depois do almoço
- 6,7% — de pneumonia, depois de teimar que era só uma gripe
- 6,1% — numa cirurgia simples que não foi tão simples
- 5,5% — em paz, no meio de uma soneca que era para ser rápida
- 5,4% — de complicações de uma queda no banheiro

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
