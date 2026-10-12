# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 528 eventos, 84 de personagens, 93 ações, 1425 escolhas, 213 linhas, 122 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 59,8% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 906 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,48 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 451,3 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 9,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,3% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 4,5% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,32 |
| Saturação V20 ≤ 95% | ✅ | 91,4% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 906 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 64,15 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,3% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 58,3% (168 dinastias, média de 3,1 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,81 (358 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 259 mil / R$ 379 mil / R$ 793 mil; p10 R$ 224 mil / R$ 217 mil / R$ 187 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 9,61% (p99 R$ 1,4 bilhão, maior R$ 1,9 trilhão) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ❌ | 1,41% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 30,0% de 60,3% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 19,0% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 91,4% |
| Assinaturas sem regressão (≥ 918) | ❌ | 906 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 451,3 |
| CPU por vida ≤ 30 ms | ❌ | 64,15 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 95,5% (9,3 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 76,2% de 3502 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (692), A festa do século (555), Pix para a cidade inteira (390), Uma estátua sua (270), Um conselho que diz não (197), Uma fundação com seu nome (165), Bancar um presidente (158), Uma equipe para desmontar (144), Tornar-se dispensável (131), Um mural de problemas (128), Trazer a Copa do Mundo (122), Bancar quem quer sair (111), Pagar a cura de uma doença (108), Um programa espacial (100), Fundar uma cidade (74), Comprar a estatal (65), Fundar um país (40), Salvar o país da crise (28), Uma colônia em Marte (24).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 2 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 36,4% de 1689 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 18,5% delegaram, 58,1% centralizaram (682 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 25,8% (19,7 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (634), Bancar quem quer sair (334), Uma equipe para desmontar (316), Um mural de problemas (308), Tornar-se dispensável (246).
- **Na morte de quem manda:** a empresa perde em média 26,3% do valor; dependência p10 / mediana / p90: 40 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 1, p99 7, maior 13 anos (8320 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 973 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 50,0% |

## Portões do incremento 8 (o país vivo)

| Portão | Situação | Valor |
|---|---|---|
| As fases têm o tamanho de antes: normal 55–72%, expansão 15–30%, recessão 7–18%, crise 1–6% dos anos | ✅ | 64,7% / 23,1% / 10,0% / 2,2% |
| O país não pisca: até 18 viradas de fase a cada 70 anos | ✅ | 15,4 |
| Os governos se alternam: cada bloco governa de 12% a 40% dos anos, com 2 trocas ou mais por vida | ✅ | a frente popular 27,0%, o bloco liberal 24,1%, a aliança da ordem 24,2%, o centrão 24,7%; 8,4 trocas por vida |
| A política muda o país: as 4 direções certas | ✅ | ✓ pobreza menor com a frente popular que com o bloco liberal (21,0% × 29,6%); ✓ violência menor com a aliança da ordem que com o bloco liberal (17,6 × 22,1); ✓ crescimento maior com o bloco liberal que com a frente popular (2,37% × 1,74%); ✓ dívida menor com a aliança da ordem que com o centrão (70% × 84% do PIB) |
| O país pesa no trabalho: com desemprego de 10,5% ou mais, a demissão é ≥ 2× mais provável do que com 6,5% ou menos | ✅ | 3,85% contra 0,91% por ano (36635 e 44755 anos de trabalho) |
| O voto aparece e conta: ≥ 1,5 voto por vida, e ≥ 25% dos votos ajudam a eleger quem ganha | ✅ | 1,71 votos por vida, 32,4% elegeram |
| Quem governa decide: no poder, a dívida sobe mais com a populista (arriscada) do que com a responsável (cautelosa), e ≥ 80% de quem governa reforma | ✅ | 3,59 × 0,64 pontos do PIB por ano (89 e 248 governos); 97,1% reformaram |
| A violência do país mata, e pouco: entre 0,5% e 6% das vidas | ✅ | 4,0% |

| Governo | Anos | Crescimento | Desemprego | Inflação | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
|---|---|---|---|---|---|---|---|---|---|---|
| a frente popular | 207.652 | 1,7% | 8,2% | 5,0% | 80% | 21,0% | 20,4 | 57 | 55 | 51% |
| o centrão | 190.273 | 2,1% | 8,4% | 4,9% | 84% | 25,2% | 21,4 | 50 | 50 | 55% |
| a aliança da ordem | 186.166 | 2,0% | 8,5% | 4,9% | 70% | 29,5% | 17,6 | 50 | 45 | 52% |
| o bloco liberal | 185.785 | 2,4% | 8,6% | 4,8% | 81% | 29,6% | 22,1 | 43 | 50 | 51% |
| o regime | 8.576 | 1,8% | 8,9% | 4,8% | 21% | 31,4% | 17,1 | 35 | 37 | 47% |
| quem joga | 8.462 | 2,0% | 8,4% | 4,9% | 79% | 25,6% | 19,8 | 55 | 53 | 55% |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 59,8% / 91,4% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 67,3% |
| Efeito da memória (aleatória, V5 sem → com memória) | 65,4% → 57,1% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 906 (586) |
| Mobilidade: mesmo quintil da origem ao fim | 27,3% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,32 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,3% / 4,5% |
| Patrimônio p90/p10 | 613,4× (p10 R$ 283 mil, p90 R$ 173 milhões) |
| Desvio-padrão da felicidade média da vida | 8,48 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,8% |
| Toques por vida | 451,3 |
| Tempo de CPU por vida | 64,15 ms |
| Ações (fichas usadas) por vida | 159,4 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 9,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,7 |
| Vidas que terminam com filho ou filha para continuar | 84,3% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,1 / 58,3% / 27,4% |
| Idade de quem herda ao começar (mediana) / herança mediana | 36 anos / R$ 13 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,81 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 60,3% |
| Entre quem abriu: quebrou / vendeu | 30,0% / 25,5% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2 milhão / R$ 95 milhões / R$ 1,4 bilhão / R$ 1,9 trilhão |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 30,23% / 9,61% / 1,41% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 19,0% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 57,9 / 159,4 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 224 mil | R$ 259 mil | R$ 303 mil |
| moderado | R$ 217 mil | R$ 379 mil | R$ 611 mil |
| arrojado | R$ 187 mil | R$ 793 mil | R$ 2,7 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 797 | R$ 131 mil | R$ 1,4 milhão | R$ 43 milhões |
| moderado | 966 | R$ 175 mil | R$ 1,6 milhão | R$ 18 milhões |
| arrojado | 737 | R$ 179 mil | R$ 2 milhão | R$ 40 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 69,3 | R$ 2,4 milhões | 74,5 |
| pobre | 104 | 72,2 | R$ 2,2 milhões | 74,9 |
| remediada | 24 | 71,3 | R$ 2,1 milhões | 75,5 |
| media | 64 | 70,9 | R$ 3,2 milhões | 72,6 |
| rica | 64 | 72,3 | R$ 6,1 milhões | 74,9 |
| muito rica | 144 | 72,4 | R$ 20 milhões | 75,2 |
| bilionaria | 356 | 70,2 | R$ 2,6 bilhões | 75,5 |
| trilionaria | 276 | 70,6 | R$ 1,2 trilhão | 76,5 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 23% / 10% / 2% |
| Notícias do país por vida | 33,6 |
| Demissões por vida / vindas de uma recessão ou crise | 0,58 / 31,0% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 28 |
| Setor do último trabalho | serviço público 48% · serviços 14% · saúde 13% · cultura e internet 8% · comércio 5% · transporte e entregas 4% · construção 2% · tecnologia 2% · agro 1% · sem setor 1% · indústria 1% · finanças 1% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 23% | 37% | 50% | 60% | 81% | 88% | 91% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 31% | 21% | 18% | 16% | 14% |
| Q2 | 29% | 23% | 17% | 15% | 16% |
| Q3 | 23% | 24% | 21% | 17% | 15% |
| Q4 | 12% | 25% | 25% | 23% | 15% |
| Q5 | 5% | 8% | 19% | 30% | 39% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 70,9 | R$ 1,9 milhão | 73,2 |
| família pobre | 24% | 70,8 | R$ 1,5 milhão | 73,6 |
| família remediada | 20% | 72,1 | R$ 2,1 milhões | 73,7 |
| classe média | 18% | 71,2 | R$ 2,5 milhões | 73,5 |
| família rica | 13% | 71,2 | R$ 4,9 milhões | 73,5 |
| família muito rica | 13% | 71,2 | R$ 26 milhões | 74,6 |
| família bilionária | 3% | 69,3 | R$ 2,1 bilhões | 76,3 |

## Repetição

- **Dentro de uma vida:** 7,9% das aparições repetem uma instância já vista na mesma vida; pior vida: 26,9%.
- **Texto repetido entre vidas:** 34,5% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,0 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,4 · `eleicao_geral` 0,4 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`, `mutirao_de_cirurgias`, `escola_publica_boa`, `imposto_alto_no_contracheque`, `blitz_toda_noite`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 126 de 583 storylets — `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `o_conselho_vetou`, `presidente_pediu_as_contas`, `ferias_do_dono`, `tudo_pela_sua_mesa`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `governo_que_voce_elegeu_frente_popular`, `governo_que_voce_elegeu_centrao`, `desemprego_em_alta`, `vaga_sobrando`, `assalto_no_onibus`, `grade_na_janela`, `fila_do_posto`, `mutirao_de_cirurgias`, `imposto_alto_no_contracheque`, `protesto_na_avenida`, `blitz_toda_noite`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `pais_envelhecem`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_sempre_trabalhando`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `carro_de_presente`, `negocio_em_crise`, `cofrinho_cheio`, `vestibular_preparado`, `aperto_do_mes`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `concurso_em_brasilia`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `montadora_vai_fechar`, `mensalidade_da_escola`, `construtora_quebrou`, `bancar_presidente`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `favor_do_presidente`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `receita_no_seu_pe`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `abrir_capital`, `capa_de_revista`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `acampamento_na_porta`, `startup_dos_ex_funcionarios`, `carta_branca`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `filho_quer_curso_caro`, `filho_apresenta_namoro`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `cargo_no_gabinete`, `operacao_no_gabinete`, `assumir_a_fazenda`, `picadeiro`, `naturalizacao`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `plantao_que_nao_acaba`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `vista_da_cobertura`, `mansao_vazia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `juros_altos_na_fatura`, `oposicao_na_tv`, `greve_geral`, `decreto_da_economia`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 57,9 · **com causa anterior (cadeia):** 67,9 · **maior distância causa→consequência:** 47,9 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,8%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 98,7% |
| `luto` | npc | 97,7% |
| `enem` | evento | 94,2% |
| `primeiro_voto` | evento | 83,9% |
| `trabalho_grande` | acao | 74,5% |
| `bico_adulto` | acao | 69,6% |
| `visitar_familia` | acao | 68,8% |
| `cuidar_da_doenca` | npc | 63,2% |
| `eleicao_geral` | evento | 62,6% |
| `correr_no_quintal` | acao | 60,9% |
| `aposentadoria` | evento | 59,7% |
| `ler_gibi` | acao | 58,2% |
| `formatura` | evento | 57,3% |
| `parquinho` | acao | 57,2% |
| `almoco_domingo` | acao | 55,2% |
| `tocar_empresa` | acao | 52,3% |
| `ligar_amigo` | acao | 52,0% |
| `avo_mesada_escondida` | npc | 50,0% |
| `mochilao` | acao | 49,7% |
| `curso_online` | acao | 49,6% |
| `pos_graduacao` | acao | 48,1% |
| `correr` | acao | 47,4% |
| `estudar_enem` | acao | 46,7% |
| `demissao` | evento | 45,2% |
| `estudar_concurso` | acao | 44,6% |
| `baile_terceira_idade` | acao | 44,3% |
| `primeiro_investimento` | evento | 42,5% |
| `paquerar` | acao | 42,4% |
| `perdeu_emprego_na_crise` | npc | 41,5% |
| `doente_crianca` | npc | 41,2% |
| `primeiro_emprego` | evento | 40,5% |
| `academia` | acao | 38,8% |
| `cuidar_de_doente` | acao | 38,7% |
| `estudar_escola` | acao | 38,7% |
| `ler_livros` | acao | 38,0% |
| `balde_da_pracinha` | evento | 36,8% |
| `amigo_em_apuros` | npc | 36,2% |
| `copa_do_mundo` | evento | 35,9% |
| `ouvir_historia` | acao | 35,6% |
| `viagem_dos_sonhos` | evento | 34,6% |
| `pre_escola` | evento | 34,5% |
| `primeiro_beijo` | evento | 34,3% |
| `casamento` | npc | 33,3% |
| `acidente_em_casa` | evento | 33,3% |
| `rabiscar_parede` | acao | 33,0% |
| `creche_ou_vo` | evento | 32,3% |
| `perguntar_porque` | acao | 31,4% |
| `caminhada` | acao | 31,3% |
| `colesterol_alto` | evento | 31,2% |
| `festa_80` | evento | 30,9% |
| `videogame_do_amigo` | acao | 30,9% |
| `banda_garagem` | evento | 30,2% |
| `bullying_recreio` | evento | 30,1% |
| `amigo_pede_dinheiro` | evento | 29,7% |
| `golpe_pix` | evento | 29,7% |
| `estudar_tabuada` | acao | 29,7% |
| `carro` | evento | 29,1% |
| `investir_tesouro` | acao | 29,0% |
| `vape_festa` | evento | 28,9% |
| `historias_ou_telas` | evento | 28,8% |
| `natacao_no_clube` | acao | 28,6% |
| `filho` | npc | 28,4% |
| `bet` | evento | 28,3% |
| `estudar_faculdade` | acao | 28,1% |
| `doar_sangue` | evento | 28,0% |
| `previdencia` | acao | 28,0% |
| `ajudar_em_casa` | acao | 28,0% |
| `filho_adolescente` | evento | 28,0% |
| `oportunidade_de_negocio` | evento | 28,0% |
| `viagem_realizada` | evento | 27,7% |
| `hidro_com_a_turma` | acao | 27,6% |
| `bilhete_carinhoso` | npc | 27,6% |
| `pelada_de_quinta` | evento | 27,5% |
| `amigo_devolve` | npc | 27,4% |
| `investimento_furado` | evento | 27,2% |
| `cachorro_caramelo` | evento | 27,1% |
| `vacina_no_posto` | evento | 26,8% |
| `criptomoeda` | evento | 26,8% |
| `piada_no_grupo` | npc | 26,5% |
| `primeiro_celular` | evento | 26,1% |
| `largar_tudo` | evento | 26,0% |
| `check_up` | acao | 25,9% |
| `curso_nota_alta` | evento | 25,9% |
| `rebalancear` | acao | 25,6% |
| `pelada` | acao | 25,4% |
| `perdeu_aniversario` | npc | 24,7% |
| `tatuagem` | evento | 24,7% |
| `proposta_na_expansao` | evento | 24,7% |
| `guardar_dinheiro` | acao | 24,6% |
| `festa_tema` | evento | 24,6% |
| `show_no_estadio` | acao | 24,5% |
| `juros_compostos` | evento | 24,2% |
| `voltar_a_estudar` | acao | 24,1% |
| `bolao_do_trabalho` | evento | 23,9% |
| `sair_de_casa` | evento | 23,8% |
| `vaquinha_do_vizinho` | evento | 23,5% |
| `pensar_em_adotar` | evento | 23,5% |
| `festa_junina` | evento | 23,3% |
| `casa_dos_pais` | evento | 23,3% |
| `tempo_com_amor` | acao | 23,0% |
| `bico_adolescente` | acao | 22,9% |
| `esporte_depois_da_aula` | evento | 22,9% |
| `emprego_saude` | evento | 22,5% |
| `casa_propria` | evento | 22,3% |
| `cortar_gastos` | acao | 21,8% |
| `heranca_do_tio` | evento | 21,8% |
| `hobby_horta` | evento | 21,6% |
| `vizinho_barulhento` | evento | 21,6% |
| `cursinho_pago` | acao | 21,6% |
| `festa_da_cidade` | acao | 21,6% |
| `avo_conta_historias` | npc | 21,4% |
| `hora_extra` | acao | 21,4% |
| `reencontro_da_turma` | evento | 21,4% |
| `subir_de_padrao` | evento | 21,3% |
| `bateu_o_carro` | evento | 21,3% |
| `reforma_da_casa` | evento | 21,3% |
| `desempregado` | evento | 21,1% |
| `pede_ajuda` | npc | 21,0% |
| `encontro` | acao | 20,8% |
| `cozinhar_com_a_avo` | acao | 20,7% |
| `assalto_na_rua` | evento | 20,6% |
| `filho_formatura` | evento | 20,5% |
| `futebol_de_varzea` | acao | 20,0% |
| `moeda_digital` | evento | 19,8% |
| `mesada` | evento | 19,4% |
| `franquia` | evento | 19,3% |
| `feira_ciencias` | evento | 19,0% |
| `festa_sem_pais` | evento | 19,0% |
| `primeira_palavra` | evento | 18,9% |
| `catapora` | evento | 18,5% |
| `vender_doce` | acao | 18,5% |
| `voltar_estudar` | evento | 18,4% |
| `cirurgia_de_catarata` | evento | 18,2% |
| `fazenda_a_venda` | evento | 18,2% |
| `baile_da_terceira_idade` | evento | 18,1% |
| `pai_ausente_volta` | npc | 17,8% |
| `bloco_de_carnaval` | evento | 17,7% |
| `hidroginastica` | evento | 17,5% |
| `carteira_da_diarista` | evento | 17,4% |
| `escrever_memorias` | evento | 17,4% |
| `mudar_para_a_praia` | evento | 17,3% |
| `festa_de_sao_joao` | evento | 17,3% |
| `entregas` | acao | 17,3% |
| `investimento_rotina` | evento | 17,2% |
| `empresa_quebrou` | evento | 17,2% |
| `golpe_do_falso_neto` | evento | 16,9% |
| `alugueis_dos_fundos` | evento | 16,9% |
| `cripto_fomo` | evento | 16,8% |
| `ceu_de_fumaca` | evento | 16,7% |
| `multa_e_batida` | evento | 16,6% |
| `imposto_alto_no_contracheque` | evento | 16,5% |
| `fome_no_fim_do_mes` | evento | 16,3% |
| `convite_para_palestrar` | evento | 16,2% |
| `curso_nota_media` | evento | 16,2% |
| `testamento` | evento | 16,0% |
| `corte_de_salario` | evento | 16,0% |
| `vaga_sobrando` | evento | 15,9% |
| `compra_por_impulso` | evento | 15,7% |
| `entregador_chuva` | evento | 15,5% |
| `imposto_baixo_sobrou` | evento | 15,4% |
| `leu_antes_dos_colegas` | evento | 15,3% |
| `queda` | evento | 15,2% |
| `ingles_crianca` | acao | 15,2% |
| `reencontro_amigo` | evento | 15,2% |
| `convite_do_luxo` | evento | 15,1% |
| `promocao` | evento | 15,0% |
| `alavancagem` | evento | 14,8% |
| `esporte_escola` | acao | 14,6% |
| `maratona` | evento | 14,5% |
| `apartamento_na_planta` | evento | 14,5% |
| `sovina_ou_sabio` | evento | 14,4% |
| `imovel_valorizou` | evento | 14,4% |
| `casamento_na_igreja` | npc | 14,2% |
| `juros_baixos_euforia` | evento | 14,1% |
| `socio_sumiu` | evento | 14,0% |
| `pobreza_na_porta` | evento | 14,0% |
| `produto_viralizou` | evento | 14,0% |
| `aula_de_musica` | evento | 13,8% |
| `peneira` | evento | 13,7% |
| `concorrente_gigante` | evento | 13,5% |
| `cartao_credito` | evento | 13,5% |
| `consorcio` | evento | 13,3% |
| `parar_de_fumar` | acao | 13,3% |
| `brigas_de_madrugada` | evento | 13,2% |
| `casa_na_praia` | evento | 13,1% |
| `quarto_dividido` | evento | 13,1% |
| `negocio_no_aperto` | evento | 13,0% |
| `greve_dos_onibus` | evento | 12,8% |
| `reuniao_de_condominio` | evento | 12,8% |
| `briga_em_casa` | npc | 12,8% |
| `rua_tranquila` | evento | 12,7% |
| `feira_de_ciencias` | evento | 12,7% |
| `casa_cheia` | evento | 12,7% |
| `assalto_no_onibus` | evento | 12,7% |
| `bolsa_de_estudos` | evento | 12,6% |
| `separacao` | evento | 12,4% |
| `chefe_novo` | evento | 12,3% |
| `juros_altos_rendendo` | evento | 12,2% |
| `retiro_da_igreja` | evento | 12,2% |
| `bolsa_subiu_sem_voce` | evento | 12,1% |
| `balcao_negocio` | acao | 11,9% |
| `cripto_disparou` | evento | 11,9% |
| `aniversario_da_infancia` | evento | 11,8% |
| `investidor_anjo` | evento | 11,8% |
| `role` | acao | 11,7% |
| `padrao_de_vida` | evento | 11,7% |
| `cofrinho` | acao | 11,7% |
| `separacao_dos_pais` | evento | 11,6% |
| `crise_40` | evento | 11,6% |
| `recomecar_amor` | acao | 11,6% |
| `peito_chiando` | evento | 11,5% |
| `praia` | acao | 11,3% |
| `surpresa_do_amor` | npc | 11,1% |
| `ressaca_do_mar` | evento | 11,1% |
| `inquilino_sumiu` | evento | 10,9% |
| `sao_joao` | acao | 10,8% |
| `aposentadoria_ativa` | evento | 10,8% |
| `inquilino_dos_sonhos` | evento | 10,7% |
| `blitz_toda_noite` | evento | 10,7% |
| `seca_no_sertao` | evento | 10,6% |
| `ponto_comercial` | evento | 10,6% |
| `titulo_eleitor` | evento | 10,5% |
| `festa_surpresa` | evento | 10,5% |
| `cheia_do_rio` | evento | 10,4% |
| `edital_de_cultura` | evento | 10,4% |
| `atendimento_robo` | evento | 10,4% |
| `noite_de_stand_up` | evento | 10,4% |
| `brincar_com_irmao_avo` | acao | 10,3% |
| `vicio_aposta` | evento | 10,0% |
| `cidadania_italiana` | evento | 10,0% |
| `pousada_na_praia` | evento | 10,0% |
| `olimpiada_matematica` | evento | 9,9% |
| `festival_do_boi` | evento | 9,9% |
| `fundo_da_familia` | npc | 9,8% |
| `gerente_do_banco` | evento | 9,7% |
| `mudanca_de_escola` | evento | 9,5% |
| `tocar_no_bar` | acao | 9,5% |
| `comer_tudo` | acao | 9,4% |
| `piramide_no_grupo` | npc | 9,4% |
| `amor_proposta_fora` | npc | 9,4% |
| `geada_no_sul` | evento | 9,4% |
| `conteudo_extra` | acao | 9,3% |
| `chimarrao` | acao | 9,2% |
| `colo_da_avo` | acao | 9,1% |
| `desemprego_em_alta` | evento | 9,1% |
| `pressao_alta` | evento | 9,1% |
| `festa_de_15` | evento | 9,1% |
| `ouvido_para_musica` | evento | 9,0% |
| `brincar_na_rua` | acao | 9,0% |
| `brincar_com_o_pai` | acao | 8,9% |
| `apagao_no_morro` | evento | 8,9% |
| `fiscalizacao` | evento | 8,8% |
| `governo_que_voce_elegeu_frente_popular` | evento | 8,8% |
| `auxilio_na_conta` | evento | 8,7% |
| `herdeiro_gastao` | evento | 8,7% |
| `estatua` | jogada | 8,6% |
| `mei_negocio` | evento | 8,5% |
| `assembleia_do_predio` | evento | 8,5% |
| `family_office` | evento | 8,5% |
| `dente_de_leite` | evento | 8,5% |
| `concurso_lotado` | evento | 8,4% |
| `boi_bumba` | acao | 8,3% |
| `brincar_amigos` | acao | 8,3% |
| `amor_piada_interna` | npc | 8,3% |
| `dolar_disparou` | evento | 8,2% |
| `faculdade_vida` | evento | 8,2% |
| `plantao_lotado` | evento | 8,0% |
| `filho_desenho` | npc | 7,9% |
| `propina_da_empreiteira` | evento | 7,9% |
| `enchente_na_rua` | evento | 7,8% |
| `show_no_bar` | evento | 7,8% |
| `pescaria_no_pantanal` | evento | 7,8% |
| `passear_de_carrinho` | acao | 7,7% |
| `soltar_pipa` | acao | 7,6% |
| `fugir_inflacao` | acao | 7,5% |
| `adocao_chegou` | evento | 7,5% |
| `pular_corda` | acao | 7,4% |
| `doenca_de_quem_ama` | evento | 7,4% |
| `festa_surpresa_para` | npc | 7,4% |
| `moto_na_chuva` | evento | 7,3% |
| `bolsa_derreteu` | evento | 7,3% |
| `mutirao_de_cirurgias` | evento | 7,3% |
| `geladeira_vazia` | evento | 7,3% |
| `cripto_de_novo` | acao | 7,3% |
| `chaves_do_apartamento` | evento | 7,2% |
| `figurinha_repetida` | acao | 7,1% |
| `mutirao_da_laje` | evento | 7,0% |
| `netos` | evento | 7,0% |
| `burnout_empresa` | evento | 7,0% |
| `bico_na_expansao` | evento | 6,9% |
| `crise_de_ansiedade` | evento | 6,8% |
| `operacao_policial` | evento | 6,8% |
| `estatua_pichada` | evento | 6,8% |
| `cripto_derreteu` | evento | 6,7% |
| `promessa_da_mae` | evento | 6,7% |
| `merenda` | evento | 6,7% |
| `festival_lotado` | evento | 6,7% |
| `briga_dos_pais` | evento | 6,6% |
| `ano_de_prejuizo` | evento | 6,6% |
| `grupo_de_jovens` | evento | 6,6% |
| `vereador` | evento | 6,5% |
| `proposta_de_compra` | evento | 6,5% |
| `vender_doce_nato` | acao | 6,5% |
| `asma_na_educacao_fisica` | evento | 6,5% |
| `namorar_depois_dos_60` | evento | 6,4% |
| `imposto_sobre_fortunas` | evento | 6,3% |
| `tempo_com_filho` | acao | 6,3% |
| `blindar_contas` | acao | 6,3% |
| `convite_do_partido` | evento | 6,3% |
| `fundacao_com_seu_nome` | evento | 6,3% |
| `amigo_muda_de_cidade` | npc | 6,3% |
| `greve_do_servidor` | evento | 6,3% |
| `obra_grande_no_norte` | evento | 6,1% |
| `escola_publica_boa` | evento | 6,1% |
| `pais_separados_natal` | evento | 6,0% |
| `natal_com_politica` | evento | 6,0% |
| `viralizou` | evento | 6,0% |
| `tarifa_do_app` | evento | 6,0% |
| `primeiro_funcionario` | evento | 6,0% |
| `comecar_terapia` | evento | 6,0% |
| `olimpiada` | acao | 5,9% |
| `vo_receita` | evento | 5,9% |
| `paquerar_timido` | acao | 5,8% |
| `fiador` | npc | 5,8% |
| `pais_na_crise` | npc | 5,8% |
| `processo_trabalhista` | evento | 5,7% |
| `filho_imitacao` | npc | 5,7% |
| `joelho_da_pelada` | evento | 5,6% |
| `vo_partiu` | npc | 5,6% |
| `inflacao_no_mercado` | evento | 5,5% |
| `votacao_polemica` | evento | 5,5% |
| `festa_do_seculo` | jogada | 5,4% |
| `mae_quer_morar_junto` | npc | 5,4% |
| `cachoeira` | acao | 5,4% |
| `clinica_particular_contrata` | evento | 5,1% |
| `festa_vazou` | evento | 5,1% |
| `aprovado_concurso_estudo` | evento | 5,1% |
| `briga_na_cozinha` | evento | 5,0% |
| `compativel_para_medula` | evento | 5,0% |
| `luto_do_bicho` | npc | 5,0% |
| `agro_na_cidade` | evento | 5,0% |
| `emprestimo_ao_irmao` | evento | 4,9% |
| `escola_de_samba` | jogada | 4,9% |
| `tosse_cronica` | evento | 4,9% |
| `bater_o_pe_com_o_chefe` | evento | 4,8% |
| `intercambio_pago` | evento | 4,8% |
| `alguem_especial` | evento | 4,8% |
| `funcionario_genial` | evento | 4,8% |
| `heranca` | evento | 4,6% |
| `sociedade_amigo` | evento | 4,5% |
| `cobranca_de_notas` | npc | 4,5% |
| `assumir_negocio` | evento | 4,5% |
| `amigo_sumiu_e_voltou` | npc | 4,5% |
| `amor_quer_mudar_de_carreira` | npc | 4,4% |
| `depois_do_cargo` | evento | 4,4% |
| `crescer_devagar` | evento | 4,3% |
| `trabalho_do_pai` | acao | 4,3% |
| `cursinho_comunitario` | evento | 4,3% |
| `posto_que_funciona` | evento | 4,3% |
| `este_e_o_ano` | evento | 4,3% |
| `casamento_do_filho` | evento | 4,3% |
| `confeitaria_da_vo` | evento | 4,2% |
| `curso_nota_baixa` | evento | 4,2% |
| `carona_de_madrugada` | npc | 4,2% |
| `tentar_outra_cidade` | evento | 4,2% |
| `volta_terra` | evento | 4,1% |
| `proposta_sao_paulo` | evento | 4,1% |
| `obra_ou_hospital` | evento | 4,1% |
| `vaga_na_capital` | evento | 4,1% |
| `ainda_mora_com_pais` | evento | 4,1% |
| `convite_para_candidatura` | evento | 4,0% |
| `convite_igreja` | npc | 4,0% |
| `enchente_na_cidade` | evento | 4,0% |
| `pescaria_no_rio` | evento | 4,0% |
| `nome_sujo` | evento | 4,0% |
| `joias_no_cofre` | evento | 4,0% |
| `apresentacao_para_a_diretoria` | evento | 3,9% |
| `netos_nas_ferias` | evento | 3,9% |
| `greve_dos_professores` | evento | 3,8% |
| `recaida_cigarro` | evento | 3,8% |
| `obra_do_predio` | evento | 3,7% |
| `aposentadoria_nao_da` | npc | 3,7% |
| `balcao_de_crianca` | evento | 3,7% |
| `balcao_da_familia` | evento | 3,6% |
| `programa_de_moradia` | evento | 3,6% |
| `filho_cuida` | npc | 3,6% |
| `shows_cancelados` | evento | 3,6% |
| `carregar_a_geladeira` | evento | 3,5% |
| `clientes_sumiram` | evento | 3,5% |
| `faculdade_depois_dos_60` | npc | 3,5% |
| `fila_do_posto` | evento | 3,5% |
| `reajuste_dos_servidores` | evento | 3,5% |
| `plano_de_saude_subiu` | evento | 3,4% |
| `black_friday` | evento | 3,4% |
| `prova_concurso` | evento | 3,4% |
| `depois_da_venda` | evento | 3,4% |
| `ferias_do_dono` | evento | 3,3% |
| `conselho_que_diz_nao` | jogada | 3,3% |
| `arrojado_na_queda` | evento | 3,3% |
| `reencontro_paixao` | evento | 3,2% |
| `filho_quer_carro` | evento | 3,1% |
| `vender_picole` | acao | 3,0% |
| `aposentado_quer_ajudar_na_empresa` | npc | 3,0% |
| `ajudar_na_roca` | acao | 3,0% |
| `surto_no_bairro` | evento | 2,9% |
| `cancelado` | evento | 2,9% |
| `ferias_com_a_familia_do_amor` | npc | 2,9% |
| `rodada_grande` | evento | 2,9% |
| `expandir_na_alta` | evento | 2,9% |
| `convite_para_o_palco_grande` | evento | 2,9% |
| `hospital_sem_insumo` | evento | 2,8% |
| `gravidez_surpresa` | npc | 2,8% |
| `cidadania_do_bisavo` | evento | 2,8% |
| `crianca_ansiosa` | evento | 2,8% |
| `gorjeta_boa` | evento | 2,8% |
| `briga_por_heranca` | evento | 2,7% |
| `terapia` | acao | 2,7% |
| `birra_no_mercado` | evento | 2,7% |
| `filho_saude_fragil` | npc | 2,7% |
| `visitar_de_longe` | acao | 2,7% |
| `crise_no_setor` | evento | 2,7% |
| `imovel_na_baixa` | evento | 2,6% |
| `dizimo` | evento | 2,4% |
| `emprego_tecnologia` | evento | 2,4% |
| `emprestimo_de_volta` | evento | 2,4% |
| `cuidar_netos` | acao | 2,4% |
| `vida_depois_da_condenacao` | evento | 2,4% |
| `time_a_venda` | evento | 2,3% |
| `seguranca_particular` | evento | 2,3% |
| `escola_integral` | evento | 2,3% |
| `carreira_futebol` | evento | 2,3% |
| `fim_do_amor` | npc | 2,3% |
| `pai_namorando_de_novo` | npc | 2,3% |
| `filho_passou_longe` | npc | 2,3% |
| `lembranca_primeiro_amor` | evento | 2,2% |
| `segundo_carro` | evento | 2,2% |
| `missa_em_familia` | acao | 2,2% |
| `passear_pet` | acao | 2,1% |
| `ajudar_na_coleta` | evento | 2,1% |
| `filho_primeiro_salario` | npc | 2,1% |
| `padrao_aperta` | evento | 2,1% |
| `cara_de_comercial` | evento | 2,1% |
| `lesao_grave` | evento | 2,1% |
| `paparazzi` | evento | 2,1% |
| `frete_sumiu` | evento | 2,1% |
| `segredo_de_familia` | npc | 2,1% |
| `renegociar_divida` | evento | 1,9% |
| `bodas_de_prata` | evento | 1,9% |
| `presidir_cpi` | evento | 1,9% |
| `sair_de_casa_cedo` | evento | 1,9% |
| `familia_descobre_o_testamento` | evento | 1,9% |
| `contrato_publicitario` | evento | 1,9% |
| `amigo_ficou_rico` | npc | 1,8% |
| `promocao_em_outra_cidade` | evento | 1,8% |
| `bancar_quem_sai` | jogada | 1,8% |
| `salario_parcelado` | evento | 1,8% |
| `hit_viral` | evento | 1,8% |
| `retirada_demais` | evento | 1,8% |
| `apartamento_de_presente` | evento | 1,7% |
| `ocorrencia_perigosa` | evento | 1,7% |
| `burnout` | evento | 1,7% |
| `emprego_educacao` | evento | 1,7% |
| `pane_no_voo` | evento | 1,7% |
| `amor_quadro_de_tarefas` | npc | 1,6% |
| `tocar_o_negocio` | acao | 1,6% |
| `divida_publica_assusta` | evento | 1,6% |
| `acoes_da_startup` | evento | 1,6% |
| `proposta_da_europa` | evento | 1,5% |
| `conselho_de_fachada` | evento | 1,5% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,5% |
| `lista_dos_mais_ricos` | evento | 1,5% |
| `mural_de_problemas` | jogada | 1,4% |
| `foto_de_campanha` | evento | 1,4% |
| `apuracao_do_carnaval` | evento | 1,4% |
| `doar_em_vida` | evento | 1,4% |
| `reforma_sem_fim` | evento | 1,4% |
| `proposta_em_dolar` | evento | 1,4% |
| `dez_anos_de_empresa` | evento | 1,4% |
| `juros_altos` | evento | 1,4% |
| `grade_na_janela` | evento | 1,4% |
| `holding_da_familia` | evento | 1,3% |
| `vaga_na_empresa_dele` | npc | 1,3% |
| `papel_da_vida` | evento | 1,3% |
| `vendas_recorde` | evento | 1,3% |
| `chefe_amigo` | evento | 1,3% |
| `deploy_de_sexta` | evento | 1,3% |
| `oferece_ajuda` | npc | 1,3% |
| `turne_nacional` | evento | 1,2% |
| `critico_no_salao` | evento | 1,2% |
| `rebaixamento` | evento | 1,2% |
| `happy_hour` | acao | 1,2% |
| `robos_na_fabrica` | evento | 1,1% |
| `mestrado_fora` | evento | 1,1% |
| `celular_dos_pais` | npc | 1,1% |
| `livro_viralizou` | evento | 1,1% |
| `nao_para_quieto` | evento | 1,1% |
| `intercambio` | evento | 1,1% |
| `pix_para_a_cidade` | jogada | 1,1% |
| `briga_de_casal` | npc | 1,1% |
| `o_conselho_vetou` | evento | 1,1% |
| `equipe_para_desmontar` | jogada | 1,1% |
| `safra_da_fazenda` | evento | 1,1% |
| `obra_atrasada` | evento | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `mais_uma_mudanca` | evento | 1,0% |
| `pedreiro_vale_ouro` | evento | 1,0% |
| `pressao_carreira` | npc | 0,9% |
| `solucao_inesperada` | evento | 0,9% |
| `fa_obcecado` | evento | 0,9% |
| `sucessao_coroa` | evento | 0,9% |
| `estatua_derrubada` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `padrinho_casamento` | npc | 0,9% |
| `governo_que_voce_elegeu_alianca_da_ordem` | evento | 0,9% |
| `amor_paga_a_conta` | npc | 0,9% |
| `treinar_no_clube` | acao | 0,9% |
| `layoff_por_email` | evento | 0,9% |
| `governo_que_voce_elegeu_bloco_liberal` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `fila_do_emprego` | evento | 0,8% |
| `tradutor_da_familia` | evento | 0,8% |
| `fim_de_semana_no_sitio` | evento | 0,8% |
| `filial_fechando` | evento | 0,8% |
| `vaga_no_agro` | evento | 0,8% |
| `tornar_se_dispensavel` | jogada | 0,8% |
| `governo_que_voce_elegeu_centrao` | evento | 0,8% |
| `nega_ajuda` | npc | 0,7% |
| `sucessao_regime` | evento | 0,7% |
| `protesto_na_avenida` | evento | 0,7% |
| `final_da_copa` | evento | 0,7% |
| `filho_briga_na_escola` | npc | 0,7% |
| `obra_parada` | evento | 0,7% |
| `ministro_pede_ajuste` | evento | 0,7% |
| `despejo` | evento | 0,7% |
| `cavalo_campeao` | evento | 0,7% |
| `carro_de_luxo_na_rua` | evento | 0,7% |
| `infancia_no_palacio` | evento | 0,7% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,7% |
| `circo_vai_embora` | evento | 0,7% |
| `bola_autografada` | evento | 0,6% |
| `peneira_do_sobrenome` | evento | 0,6% |
| `estagio_do_pai` | evento | 0,6% |
| `aluguel_caro` | evento | 0,6% |
| `paciente_famoso` | evento | 0,6% |
| `tentar_a_vida_na_europa` | evento | 0,6% |
| `transito_de_sp` | evento | 0,6% |
| `feriado_na_praia` | evento | 0,6% |
| `violencia_vira_manchete` | evento | 0,6% |
| `proposta_pelo_negocio` | evento | 0,6% |
| `desfile_das_campeas` | evento | 0,6% |
| `bonanca_no_governo` | evento | 0,6% |
| `a_empresa_sem_voce` | evento | 0,6% |
| `noite_de_corridas` | evento | 0,6% |
| `shopping_lotado` | evento | 0,5% |
| `fundacao` | jogada | 0,5% |
| `bonus_do_banco` | evento | 0,5% |
| `abrir_capital` | evento | 0,5% |
| `bancar_presidente` | jogada | 0,5% |
| `filho_apresenta_namoro` | npc | 0,5% |
| `juros_altos_na_fatura` | evento | 0,5% |
| `acampamento_na_porta` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `naturalizacao` | evento | 0,5% |
| `cliente_perdeu_tudo` | evento | 0,5% |
| `negocio_em_crise` | evento | 0,5% |
| `aperto_do_mes` | evento | 0,5% |
| `plantao_que_nao_acaba` | evento | 0,5% |
| `decreto_da_economia` | evento | 0,5% |
| `assumir_a_fazenda` | evento | 0,4% |
| `greve_geral` | evento | 0,4% |
| `quebra_de_safra` | evento | 0,4% |
| `favor_do_presidente` | evento | 0,4% |
| `amor_sempre_trabalhando` | npc | 0,4% |
| `emprego_negocios` | evento | 0,4% |
| `montadora_vai_fechar` | evento | 0,4% |
| `noite_da_apuracao` | evento | 0,4% |
| `a_baba_foi_embora` | evento | 0,4% |
| `parcela_da_tv` | npc | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `carro_de_presente` | evento | 0,4% |
| `concurso_em_brasilia` | evento | 0,4% |
| `proposta_remota` | evento | 0,4% |
| `sequestro_frustrado` | evento | 0,4% |
| `picadeiro` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `pais_envelhecem` | npc | 0,4% |
| `reencontro_amigo_brigado` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `crise_internacional` | evento | 0,4% |
| `filho_pede_ajuda` | npc | 0,4% |
| `cargo_no_gabinete` | evento | 0,4% |
| `pais_aposentados` | npc | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `o_mural_do_boton` | evento | 0,3% |
| `ferias_coletivas` | evento | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `regra_sob_medida` | evento | 0,3% |
| `fim_carreira` | evento | 0,3% |
| `passou_mal_de_novo` | npc | 0,3% |
| `reconciliacao` | npc | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `rival_bilionario` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `filho_adolescente_porta` | npc | 0,3% |
| `ex_aluno` | evento | 0,3% |
| `safra_recorde` | evento | 0,3% |
| `carta_branca` | evento | 0,3% |
| `clientes_em_panico` | evento | 0,3% |
| `cursinho_paga_bem` | evento | 0,3% |
| `paparazzi_real` | evento | 0,3% |
| `operacao_no_gabinete` | evento | 0,3% |
| `mansao_vazia` | evento | 0,3% |
| `casamento_real` | evento | 0,3% |
| `oposicao_na_tv` | evento | 0,3% |
| `cliente_duvidoso` | evento | 0,3% |
| `vista_da_cobertura` | evento | 0,3% |
| `leilao_da_obra` | evento | 0,3% |
| `zona_franca` | evento | 0,2% |
| `amor_gastador` | npc | 0,2% |
| `amor_viaja_demais` | npc | 0,2% |
| `amor_igreja` | npc | 0,2% |
| `royalties_secaram` | evento | 0,2% |
| `escola_militar` | evento | 0,2% |
| `conta_na_suica` | evento | 0,2% |
| `sucessao_na_empresa` | evento | 0,2% |
| `mordomias_reais` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `escandalo_do_lobby` | evento | 0,2% |
| `amor_planilha` | npc | 0,2% |
| `giz_do_proprio_bolso` | evento | 0,2% |
| `teste_por_indicacao` | evento | 0,2% |
| `tribunal_internacional` | evento | 0,2% |
| `cliente_preso` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `amor_saude_fragil` | npc | 0,1% |
| `filho_missao` | npc | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `taxar_grandes_fortunas` | evento | 0,1% |
| `presidente_pediu_as_contas` | evento | 0,1% |
| `queda_do_cargo` | evento | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `cobrir_a_tatuagem` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `desvio_na_fundacao` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `herdeiros_de_olho` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `amigo_lembra_zoeira` | npc | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `os_dois_lados` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `filho_hamburgueria` | npc | 0,0% |
| `filho_quer_capital` | npc | 0,0% |
| `jatinho_para_onde` | evento | 0,0% |
| `renegociar_cartao` | acao | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `negocio_da_familia_quebra` | evento | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `resultado_da_pesquisa` | evento | 0,0% |
| `lancamento` | evento | 0,0% |
| `hospital_da_fundacao` | evento | 0,0% |
| `receita_no_seu_pe` | evento | 0,0% |
| `vida_depois_da_coroa` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `filho_foi_embora` | npc | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
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
| `segundo_foguete` | evento | 0,0% |
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 187 · **mudaram algo em pelo menos uma vida:** 188
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,2 · p10 50 · p25 57 · mediana 70 · p75 85 · p90 96

```
até 19         █                              0,4%
20–29                                         0,3%
30–39          █                              0,9%
40–49          █████████████                  8,4%
50–59          ██████████████████████████████ 19,3%
60–69          ██████████████████████████████ 19,3%
70–79          ████████████████████████████   18,2%
80–89          ███████████████████████        14,8%
90–99          ████████████████████           13,0%
100+           ████████                       5,4%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 283 mil · p25 R$ 847 mil · mediana R$ 3,7 milhões · p75 R$ 35 milhões · p90 R$ 173 milhões

```
negativo       █                              0,8%
até 10 mil                                    0,4%
10–50 mil      █                              1,0%
50–200 mil     ███                            5,0%
200 mil–1 mi   ██████████████                 20,8%
1–5 mi         █████████████████              26,0%
5 mi+          ██████████████████████████████ 46,1%
```

**Felicidade média ao longo da vida** — p10 62 · mediana 74 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           6,0%
60–69          █████████████████              24,8%
70–79          ██████████████████████████████ 44,2%
80+            █████████████████              24,6%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,0 | R$ 1,2 milhão | 70,1 | 54,4 | 159,5 | 64,0 | 100% | 59% |
| cautelosa | 91,9 🏆 | R$ 67 milhões 🏆 | 75,1 | 70,3 | 216,4 | 85,0 | 100% | 69% |
| arriscada | 52,3 | R$ 2,4 milhões | 78,7 🏆 | 45,3 | 125,1 | 66,3 | 100% | 54% |
| aleatoria | 75,6 | R$ 1,7 milhão | 71,1 | 61,6 | 136,7 | 56,5 | 100% | 57% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,9% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,6% — num hospital do SUS que fez tudo o que podia, e fez muito
- 10,9% — de um AVC, numa terça-feira sem graça
- 6,9% — de velhice, dormindo, num domingo depois do almoço
- 6,9% — de pneumonia, depois de teimar que era só uma gripe
- 6,1% — numa cirurgia simples que não foi tão simples
- 5,3% — em paz, no meio de uma soneca que era para ser rápida
- 5,3% — de complicações pulmonares, entre uma tosse e outra

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
