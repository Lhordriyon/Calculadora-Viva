# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 495 eventos, 84 de personagens, 93 ações, 1335 escolhas, 198 linhas, 122 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 60,9% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 900 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,45 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 452,9 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 7,8% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 15,0% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ❌ | 2,5% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,33 |
| Saturação V20 ≤ 95% | ✅ | 92,1% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 900 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 41,06 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,3% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 61,3% (168 dinastias, média de 3,2 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,82 (362 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 271 mil / R$ 365 mil / R$ 636 mil; p10 R$ 233 mil / R$ 208 mil / R$ 115 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 7,78% (p99 R$ 943 milhões, maior R$ 201 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,89% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,2% de 60,6% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 19,2% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 92,1% |
| Assinaturas sem regressão (≥ 918) | ❌ | 900 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 452,9 |
| CPU por vida ≤ 30 ms | ❌ | 41,06 ms |

## Portões do incremento 5 (brincar de deus)

504 vidas que nascem bilionárias ou trilionárias (63 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 19 de 19 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 99,5% (10,8 jogadas por vida, 378 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 74,8% de 4070 jogadas |

- **Jogadas mais feitas pelos robôs:** Patrocinar o Carnaval (800), A festa do século (660), Pix para a cidade inteira (388), Uma estátua sua (289), Um conselho que diz não (265), Uma equipe para desmontar (207), Bancar um presidente (183), Uma fundação com seu nome (182), Um mural de problemas (166), Bancar quem quer sair (162), Tornar-se dispensável (148), Pagar a cura de uma doença (139), Trazer a Copa do Mundo (137), Um programa espacial (118), Comprar a estatal (71), Fundar uma cidade (68), Fundar um país (42), Uma colônia em Marte (29), Salvar o país da crise (16).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 4 de 504 vidas.

## Portões do incremento 6 (quem manda na empresa e o porquê)

| Portão | Situação | Valor |
|---|---|---|
| Quem manda é decisão: ≥ 30% de quem morre com empresa de R$ 1 milhão mudou a dependência numa escolha | ✅ | 42,0% de 1812 vidas |
| As duas histórias existem: entre quem morre com empresa de R$ 15 milhões, ≥ 10% delegou (dependência ≤ 30) e ≥ 10% centralizou (≥ 60) | ✅ | 18,3% delegaram, 60,7% centralizaram (797 vidas) |
| O porquê à vista: ≥ 20% dos acontecimentos mostram a causa de um ano anterior | ✅ | 22,0% (16,8 por vida) |

- **Jogadas na empresa mais feitas pelos robôs:** Um conselho que diz não (770), Bancar quem quer sair (460), Uma equipe para desmontar (428), Um mural de problemas (378), Tornar-se dispensável (289).
- **Na morte de quem manda:** a empresa perde em média 26,4% do valor; dependência p10 / mediana / p90: 40 / 80 / 80.

## Portões do incremento 7 (as crises acabam, a vida começa sua)

| Portão | Situação | Valor |
|---|---|---|
| Toda crise acaba: 99% duram até 8 anos | ✅ | mediana 1, p99 7, maior 13 anos (11830 crises) |
| Cada vida começa diferente: ≥ 800 começos distintos por 1.000 vidas (histórias até os 6 anos, com a escolha) | ✅ | 975 |
| Decidir desde cedo: ≥ 80% das vidas têm 2 decisões ou mais antes dos 5 anos | ✅ | 100,0% |
| A infância volta: ≥ 30% das vidas têm algo dos 5 aos 12 causado pelos anos até os 4 | ✅ | 44,8% |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 60,9% / 92,1% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 68,1% |
| Efeito da memória (aleatória, V5 sem → com memória) | 64,9% → 57,9% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 900 (582) |
| Mobilidade: mesmo quintil da origem ao fim | 26,4% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 15,0% / 2,5% |
| Patrimônio p90/p10 | 477,3× (p10 R$ 283 mil, p90 R$ 135 milhões) |
| Desvio-padrão da felicidade média da vida | 8,45 |
| Vidas com patrimônio negativo ao morrer | 0,9% |
| Mudanças de estado causadas pelo jogador | 44,8% |
| Toques por vida | 452,9 |
| Tempo de CPU por vida | 41,06 ms |
| Ações (fichas usadas) por vida | 160,0 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 7,8% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,8 |
| Vidas que terminam com filho ou filha para continuar | 84,3% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,2 / 61,3% / 28,6% |
| Idade de quem herda ao começar (mediana) / herança mediana | 38 anos / R$ 7,7 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,82 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 60,6% |
| Entre quem abriu: quebrou / vendeu | 28,2% / 26,7% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 1,8 milhão / R$ 74 milhões / R$ 943 milhões / R$ 201 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 29,86% / 7,78% / 0,89% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 19,2% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 58,1 / 160,0 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 233 mil | R$ 271 mil | R$ 318 mil |
| moderado | R$ 208 mil | R$ 365 mil | R$ 565 mil |
| arrojado | R$ 115 mil | R$ 636 mil | R$ 2,3 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 845 | R$ 128 mil | R$ 1,2 milhão | R$ 48 milhões |
| moderado | 949 | R$ 168 mil | R$ 1,3 milhão | R$ 18 milhões |
| arrojado | 706 | R$ 154 mil | R$ 1,7 milhão | R$ 36 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 70,3 | R$ 2 milhão | 74,8 |
| pobre | 104 | 72,3 | R$ 1,6 milhão | 74,7 |
| remediada | 24 | 75,9 | R$ 861 mil | 75,6 |
| media | 64 | 69,7 | R$ 2,5 milhões | 73,7 |
| rica | 64 | 73,0 | R$ 6,6 milhões | 76,1 |
| muito rica | 144 | 71,6 | R$ 25 milhões | 75,4 |
| bilionaria | 356 | 71,1 | R$ 2,5 bilhões | 77,0 |
| trilionaria | 276 | 71,6 | R$ 907 bilhões | 77,6 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 20% / 12% / 3% |
| Notícias do país por vida | 13,0 |
| Demissões por vida / vindas de uma recessão ou crise | 0,61 / 35,4% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 53% · serviços 14% · saúde 12% · cultura e internet 6% · comércio 5% · transporte e entregas 4% · construção 2% · tecnologia 1% · agro 1% · indústria 1% · finanças 1% · sem setor 1% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 23% | 38% | 51% | 61% | 82% | 89% | 92% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 30% | 22% | 17% | 16% | 15% |
| Q2 | 30% | 22% | 17% | 15% | 15% |
| Q3 | 24% | 24% | 19% | 18% | 15% |
| Q4 | 13% | 25% | 26% | 21% | 14% |
| Q5 | 3% | 7% | 20% | 30% | 40% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 71,3 | R$ 1,6 milhão | 73,7 |
| família pobre | 24% | 71,3 | R$ 1,6 milhão | 73,7 |
| família remediada | 20% | 72,1 | R$ 1,8 milhão | 73,9 |
| classe média | 18% | 71,3 | R$ 2,4 milhões | 73,4 |
| família rica | 13% | 71,6 | R$ 4,7 milhões | 73,7 |
| família muito rica | 13% | 70,9 | R$ 23 milhões | 75,1 |
| família bilionária | 3% | 69,3 | R$ 2,8 bilhões | 77,0 |

## Repetição

- **Dentro de uma vida:** 7,8% das aparições repetem uma instância já vista na mesma vida; pior vida: 31,1%.
- **Texto repetido entre vidas:** 36,2% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,0 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,4 · `demissao` 0,3 · `bilhete_carinhoso#mae` 0,2 · `bilhete_carinhoso#pai` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 115 de 550 storylets — `esporte_depois_da_aula`, `fome_no_fim_do_mes`, `brigas_de_madrugada`, `peito_chiando`, `surto_no_bairro`, `crescer_devagar`, `crianca_ansiosa`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `o_conselho_vetou`, `presidente_pediu_as_contas`, `ferias_do_dono`, `tudo_pela_sua_mesa`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `a_baba_foi_embora`, `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `cofrinho_cheio`, `vestibular_preparado`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `emprego_negocios`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `clientes_em_panico`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `receita_no_seu_pe`, `taxar_grandes_fortunas`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `acionistas_furiosos`, `capa_de_revista`, `o_mural_do_boton`, `presidente_pediu_as_contas`, `startup_dos_ex_funcionarios`, `tudo_pela_sua_mesa`, `quem_manda_se_voce_faltar`, `a_empresa_anda_sozinha`, `cobrir_a_tatuagem`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `assumir_a_fazenda`, `picadeiro`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `vista_da_cobertura`, `mansao_vazia`, `shopping_lotado`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 58,1 · **com causa anterior (cadeia):** 65,7 · **maior distância causa→consequência:** 48,4 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,0% |
| `luto` | npc | 98,3% |
| `enem` | evento | 94,3% |
| `trabalho_grande` | acao | 74,8% |
| `bico_adulto` | acao | 69,5% |
| `visitar_familia` | acao | 68,8% |
| `cuidar_da_doenca` | npc | 64,9% |
| `correr_no_quintal` | acao | 60,9% |
| `aposentadoria` | evento | 59,7% |
| `ler_gibi` | acao | 58,2% |
| `formatura` | evento | 57,5% |
| `parquinho` | acao | 57,2% |
| `almoco_domingo` | acao | 55,3% |
| `tocar_empresa` | acao | 52,5% |
| `ligar_amigo` | acao | 52,5% |
| `curso_online` | acao | 49,9% |
| `avo_mesada_escondida` | npc | 49,8% |
| `mochilao` | acao | 49,7% |
| `pos_graduacao` | acao | 48,7% |
| `correr` | acao | 47,3% |
| `estudar_enem` | acao | 46,7% |
| `demissao` | evento | 46,0% |
| `primeiro_investimento` | evento | 44,9% |
| `perdeu_emprego_na_crise` | npc | 44,8% |
| `estudar_concurso` | acao | 44,8% |
| `baile_terceira_idade` | acao | 44,3% |
| `doente_crianca` | npc | 42,0% |
| `paquerar` | acao | 41,7% |
| `primeiro_emprego` | evento | 40,9% |
| `amigo_em_apuros` | npc | 40,0% |
| `copa_do_mundo` | evento | 39,2% |
| `cuidar_de_doente` | acao | 38,8% |
| `estudar_escola` | acao | 38,6% |
| `ler_livros` | acao | 38,1% |
| `academia` | acao | 38,0% |
| `viagem_dos_sonhos` | evento | 37,2% |
| `balde_da_pracinha` | evento | 37,0% |
| `ouvir_historia` | acao | 35,5% |
| `pre_escola` | evento | 35,5% |
| `primeiro_beijo` | evento | 35,0% |
| `colesterol_alto` | evento | 34,1% |
| `casamento` | npc | 33,9% |
| `acidente_em_casa` | evento | 33,5% |
| `rabiscar_parede` | acao | 33,1% |
| `golpe_pix` | evento | 33,0% |
| `amigo_pede_dinheiro` | evento | 32,6% |
| `creche_ou_vo` | evento | 32,4% |
| `caminhada` | acao | 32,1% |
| `carro` | evento | 31,9% |
| `perguntar_porque` | acao | 31,6% |
| `bet` | evento | 31,5% |
| `oportunidade_de_negocio` | evento | 31,5% |
| `videogame_do_amigo` | acao | 31,5% |
| `doar_sangue` | evento | 31,3% |
| `pelada_de_quinta` | evento | 31,2% |
| `festa_80` | evento | 31,0% |
| `investir_tesouro` | acao | 30,7% |
| `estudar_tabuada` | acao | 30,4% |
| `banda_garagem` | evento | 30,4% |
| `investimento_furado` | evento | 30,1% |
| `viagem_realizada` | evento | 30,0% |
| `filho_adolescente` | evento | 30,0% |
| `bullying_recreio` | evento | 30,0% |
| `criptomoeda` | evento | 29,9% |
| `vape_festa` | evento | 29,8% |
| `filho` | npc | 29,8% |
| `largar_tudo` | evento | 29,0% |
| `natacao_no_clube` | acao | 28,4% |
| `sair_de_casa` | evento | 28,4% |
| `historias_ou_telas` | evento | 28,3% |
| `estudar_faculdade` | acao | 28,3% |
| `amigo_devolve` | npc | 28,1% |
| `hidro_com_a_turma` | acao | 27,9% |
| `ajudar_em_casa` | acao | 27,7% |
| `previdencia` | acao | 27,5% |
| `tatuagem` | evento | 27,5% |
| `bilhete_carinhoso` | npc | 27,4% |
| `cachorro_caramelo` | evento | 27,3% |
| `juros_compostos` | evento | 27,0% |
| `vacina_no_posto` | evento | 26,7% |
| `piada_no_grupo` | npc | 26,7% |
| `primeiro_celular` | evento | 26,6% |
| `bolao_do_trabalho` | evento | 26,6% |
| `vaquinha_do_vizinho` | evento | 26,4% |
| `pelada` | acao | 26,0% |
| `curso_nota_alta` | evento | 25,9% |
| `check_up` | acao | 25,8% |
| `casa_dos_pais` | evento | 25,8% |
| `pensar_em_adotar` | evento | 25,5% |
| `festa_tema` | evento | 25,2% |
| `rebalancear` | acao | 25,1% |
| `perdeu_aniversario` | npc | 24,9% |
| `bateu_o_carro` | evento | 24,9% |
| `guardar_dinheiro` | acao | 24,7% |
| `show_no_estadio` | acao | 24,4% |
| `voltar_a_estudar` | acao | 24,4% |
| `hobby_horta` | evento | 24,2% |
| `casa_propria` | evento | 23,9% |
| `vizinho_barulhento` | evento | 23,9% |
| `proposta_na_expansao` | evento | 23,9% |
| `tempo_com_amor` | acao | 23,8% |
| `heranca_do_tio` | evento | 23,8% |
| `reencontro_da_turma` | evento | 23,7% |
| `festa_junina` | evento | 23,7% |
| `reforma_da_casa` | evento | 23,7% |
| `esporte_depois_da_aula` | evento | 23,3% |
| `moeda_digital` | evento | 23,1% |
| `subir_de_padrao` | evento | 22,9% |
| `desempregado` | evento | 22,8% |
| `bico_adolescente` | acao | 22,8% |
| `emprego_saude` | evento | 22,6% |
| `filho_formatura` | evento | 22,6% |
| `assalto_na_rua` | evento | 22,5% |
| `cortar_gastos` | acao | 22,3% |
| `pede_ajuda` | npc | 22,2% |
| `hora_extra` | acao | 22,1% |
| `festa_da_cidade` | acao | 21,7% |
| `cursinho_pago` | acao | 21,6% |
| `franquia` | evento | 21,6% |
| `avo_conta_historias` | npc | 21,5% |
| `encontro` | acao | 21,1% |
| `investimento_rotina` | evento | 20,6% |
| `bloco_de_carnaval` | evento | 20,4% |
| `voltar_estudar` | evento | 20,4% |
| `cirurgia_de_catarata` | evento | 20,3% |
| `baile_da_terceira_idade` | evento | 20,3% |
| `futebol_de_varzea` | acao | 20,3% |
| `cozinhar_com_a_avo` | acao | 20,2% |
| `mesada` | evento | 20,0% |
| `festa_sem_pais` | evento | 19,9% |
| `fazenda_a_venda` | evento | 19,7% |
| `feira_ciencias` | evento | 19,6% |
| `carteira_da_diarista` | evento | 19,5% |
| `corte_de_salario` | evento | 19,4% |
| `festa_de_sao_joao` | evento | 19,1% |
| `escrever_memorias` | evento | 19,1% |
| `primeira_palavra` | evento | 19,0% |
| `hidroginastica` | evento | 19,0% |
| `mudar_para_a_praia` | evento | 19,0% |
| `multa_e_batida` | evento | 18,8% |
| `catapora` | evento | 18,6% |
| `golpe_do_falso_neto` | evento | 18,5% |
| `cripto_fomo` | evento | 18,4% |
| `vender_doce` | acao | 18,4% |
| `alugueis_dos_fundos` | evento | 18,2% |
| `pai_ausente_volta` | npc | 18,1% |
| `convite_para_palestrar` | evento | 18,1% |
| `ceu_de_fumaca` | evento | 18,0% |
| `juros_altos` | evento | 17,9% |
| `entregas` | acao | 17,7% |
| `entregador_chuva` | evento | 17,6% |
| `testamento` | evento | 17,4% |
| `compra_por_impulso` | evento | 17,2% |
| `cartao_credito` | evento | 17,1% |
| `reencontro_amigo` | evento | 16,9% |
| `convite_do_luxo` | evento | 16,7% |
| `queda` | evento | 16,7% |
| `fome_no_fim_do_mes` | evento | 16,5% |
| `empresa_quebrou` | evento | 16,3% |
| `promocao` | evento | 16,3% |
| `curso_nota_media` | evento | 16,2% |
| `maratona` | evento | 16,0% |
| `sovina_ou_sabio` | evento | 16,0% |
| `leu_antes_dos_colegas` | evento | 15,9% |
| `socio_sumiu` | evento | 15,5% |
| `concorrente_gigante` | evento | 15,4% |
| `ingles_crianca` | acao | 15,3% |
| `casa_na_praia` | evento | 14,9% |
| `reuniao_de_condominio` | evento | 14,8% |
| `consorcio` | evento | 14,6% |
| `casamento_na_igreja` | npc | 14,4% |
| `esporte_escola` | acao | 14,4% |
| `greve_dos_onibus` | evento | 14,4% |
| `produto_viralizou` | evento | 14,3% |
| `peneira` | evento | 14,2% |
| `briga_em_casa` | npc | 14,2% |
| `parar_de_fumar` | acao | 14,0% |
| `alavancagem` | evento | 13,9% |
| `apartamento_na_planta` | evento | 13,7% |
| `aula_de_musica` | evento | 13,6% |
| `fundo_da_familia` | npc | 13,6% |
| `separacao` | evento | 13,5% |
| `imovel_valorizou` | evento | 13,5% |
| `bolsa_subiu_sem_voce` | evento | 13,4% |
| `chefe_novo` | evento | 13,4% |
| `brigas_de_madrugada` | evento | 13,1% |
| `bolsa_de_estudos` | evento | 13,1% |
| `crise_40` | evento | 13,1% |
| `quarto_dividido` | evento | 13,1% |
| `retiro_da_igreja` | evento | 12,8% |
| `cripto_disparou` | evento | 12,7% |
| `balcao_negocio` | acao | 12,7% |
| `padrao_de_vida` | evento | 12,6% |
| `investidor_anjo` | evento | 12,4% |
| `ressaca_do_mar` | evento | 12,4% |
| `festa_surpresa` | evento | 12,4% |
| `faculdade_vida` | evento | 12,4% |
| `casa_cheia` | evento | 12,3% |
| `inquilino_dos_sonhos` | evento | 12,1% |
| `feira_de_ciencias` | evento | 12,0% |
| `role` | acao | 12,0% |
| `separacao_dos_pais` | evento | 12,0% |
| `ponto_comercial` | evento | 12,0% |
| `aniversario_da_infancia` | evento | 12,0% |
| `peito_chiando` | evento | 12,0% |
| `noite_de_stand_up` | evento | 12,0% |
| `inquilino_sumiu` | evento | 11,9% |
| `recomecar_amor` | acao | 11,8% |
| `cofrinho` | acao | 11,7% |
| `edital_de_cultura` | evento | 11,7% |
| `vicio_aposta` | evento | 11,7% |
| `surpresa_do_amor` | npc | 11,5% |
| `titulo_eleitor` | evento | 11,4% |
| `seca_no_sertao` | evento | 11,4% |
| `aposentadoria_ativa` | evento | 11,3% |
| `concurso_lotado` | evento | 11,3% |
| `praia` | acao | 11,3% |
| `atendimento_robo` | evento | 11,3% |
| `cidadania_italiana` | evento | 11,1% |
| `gerente_do_banco` | evento | 11,0% |
| `cheia_do_rio` | evento | 10,9% |
| `sao_joao` | acao | 10,8% |
| `herdeiro_gastao` | evento | 10,7% |
| `piramide_no_grupo` | npc | 10,4% |
| `festival_do_boi` | evento | 10,4% |
| `geada_no_sul` | evento | 10,3% |
| `assembleia_do_predio` | evento | 10,2% |
| `pressao_alta` | evento | 10,2% |
| `fugir_inflacao` | acao | 10,1% |
| `festa_surpresa_para` | npc | 10,1% |
| `brincar_com_irmao_avo` | acao | 10,0% |
| `olimpiada_matematica` | evento | 9,9% |
| `dolar_disparou` | evento | 9,8% |
| `pousada_na_praia` | evento | 9,7% |
| `comer_tudo` | acao | 9,6% |
| `fiscalizacao` | evento | 9,5% |
| `filho_desenho` | npc | 9,4% |
| `negocio_no_aperto` | evento | 9,3% |
| `propina_da_empreiteira` | evento | 9,3% |
| `tocar_no_bar` | acao | 9,3% |
| `mudanca_de_escola` | evento | 9,3% |
| `bolsa_derreteu` | evento | 9,2% |
| `festa_de_15` | evento | 9,2% |
| `chimarrao` | acao | 9,2% |
| `show_no_bar` | evento | 9,2% |
| `colo_da_avo` | acao | 9,1% |
| `brincar_na_rua` | acao | 9,1% |
| `conteudo_extra` | acao | 9,0% |
| `mei_negocio` | evento | 9,0% |
| `ouvido_para_musica` | evento | 8,9% |
| `amor_proposta_fora` | npc | 8,9% |
| `doenca_de_quem_ama` | evento | 8,9% |
| `family_office` | evento | 8,8% |
| `dente_de_leite` | evento | 8,8% |
| `plantao_lotado` | evento | 8,7% |
| `amor_piada_interna` | npc | 8,6% |
| `moto_na_chuva` | evento | 8,6% |
| `brincar_com_o_pai` | acao | 8,6% |
| `pescaria_no_pantanal` | evento | 8,6% |
| `apagao_no_morro` | evento | 8,4% |
| `boi_bumba` | acao | 8,4% |
| `netos` | evento | 8,3% |
| `brincar_amigos` | acao | 8,3% |
| `enchente_na_rua` | evento | 8,2% |
| `geladeira_vazia` | evento | 8,1% |
| `mutirao_da_laje` | evento | 8,1% |
| `cripto_de_novo` | acao | 8,1% |
| `operacao_policial` | evento | 8,0% |
| `adocao_chegou` | evento | 7,9% |
| `passear_de_carrinho` | acao | 7,9% |
| `cripto_derreteu` | evento | 7,8% |
| `burnout_empresa` | evento | 7,6% |
| `ano_de_prejuizo` | evento | 7,6% |
| `vereador` | evento | 7,5% |
| `pular_corda` | acao | 7,5% |
| `proposta_de_compra` | evento | 7,4% |
| `natal_com_politica` | evento | 7,4% |
| `crise_de_ansiedade` | evento | 7,4% |
| `promessa_da_mae` | evento | 7,4% |
| `grupo_de_jovens` | evento | 7,4% |
| `namorar_depois_dos_60` | evento | 7,2% |
| `blindar_contas` | acao | 7,2% |
| `figurinha_repetida` | acao | 7,1% |
| `comecar_terapia` | evento | 7,1% |
| `votacao_polemica` | evento | 7,1% |
| `tarifa_do_app` | evento | 7,1% |
| `bico_na_expansao` | evento | 7,0% |
| `estatua` | jogada | 7,0% |
| `merenda` | evento | 7,0% |
| `primeiro_funcionario` | evento | 7,0% |
| `tempo_com_filho` | acao | 7,0% |
| `soltar_pipa` | acao | 7,0% |
| `pais_na_crise` | npc | 7,0% |
| `joelho_da_pelada` | evento | 6,9% |
| `greve_do_servidor` | evento | 6,8% |
| `festival_lotado` | evento | 6,7% |
| `compativel_para_medula` | evento | 6,7% |
| `amigo_muda_de_cidade` | npc | 6,7% |
| `asma_na_educacao_fisica` | evento | 6,6% |
| `chaves_do_apartamento` | evento | 6,6% |
| `vender_doce_nato` | acao | 6,6% |
| `pais_separados_natal` | evento | 6,5% |
| `viralizou` | evento | 6,5% |
| `emprestimo_ao_irmao` | evento | 6,4% |
| `briga_dos_pais` | evento | 6,4% |
| `processo_trabalhista` | evento | 6,4% |
| `fiador` | npc | 6,3% |
| `filho_imitacao` | npc | 6,2% |
| `imposto_sobre_fortunas` | evento | 6,0% |
| `vo_partiu` | npc | 6,0% |
| `convite_do_partido` | evento | 6,0% |
| `fundacao_com_seu_nome` | evento | 5,9% |
| `aprovado_concurso_estudo` | evento | 5,9% |
| `depois_do_cargo` | evento | 5,8% |
| `paquerar_timido` | acao | 5,7% |
| `obra_grande_no_norte` | evento | 5,7% |
| `olimpiada` | acao | 5,6% |
| `vaga_na_capital` | evento | 5,6% |
| `vo_receita` | evento | 5,5% |
| `cachoeira` | acao | 5,5% |
| `funcionario_genial` | evento | 5,4% |
| `estatua_pichada` | evento | 5,4% |
| `agro_na_cidade` | evento | 5,4% |
| `bater_o_pe_com_o_chefe` | evento | 5,4% |
| `tosse_cronica` | evento | 5,4% |
| `mae_quer_morar_junto` | npc | 5,4% |
| `assumir_negocio` | evento | 5,4% |
| `heranca` | evento | 5,3% |
| `tentar_outra_cidade` | evento | 5,3% |
| `alguem_especial` | evento | 5,3% |
| `briga_na_cozinha` | evento | 5,3% |
| `cobranca_de_notas` | npc | 5,2% |
| `ainda_mora_com_pais` | evento | 5,2% |
| `nome_sujo` | evento | 5,1% |
| `sociedade_amigo` | evento | 5,1% |
| `volta_terra` | evento | 5,1% |
| `amigo_sumiu_e_voltou` | npc | 5,1% |
| `proposta_sao_paulo` | evento | 5,0% |
| `este_e_o_ano` | evento | 4,9% |
| `casamento_do_filho` | evento | 4,9% |
| `amor_quer_mudar_de_carreira` | npc | 4,9% |
| `carona_de_madrugada` | npc | 4,9% |
| `luto_do_bicho` | npc | 4,9% |
| `intercambio_pago` | evento | 4,8% |
| `joias_no_cofre` | evento | 4,8% |
| `plano_de_saude_subiu` | evento | 4,8% |
| `festa_do_seculo` | jogada | 4,8% |
| `cursinho_comunitario` | evento | 4,7% |
| `convite_para_candidatura` | evento | 4,7% |
| `clinica_particular_contrata` | evento | 4,7% |
| `crescer_devagar` | evento | 4,6% |
| `netos_nas_ferias` | evento | 4,6% |
| `aposentadoria_nao_da` | npc | 4,6% |
| `festa_vazou` | evento | 4,6% |
| `obra_ou_hospital` | evento | 4,6% |
| `obra_do_predio` | evento | 4,5% |
| `apresentacao_para_a_diretoria` | evento | 4,5% |
| `enchente_na_cidade` | evento | 4,5% |
| `trabalho_do_pai` | acao | 4,4% |
| `curso_nota_baixa` | evento | 4,4% |
| `confeitaria_da_vo` | evento | 4,3% |
| `escola_de_samba` | jogada | 4,3% |
| `faculdade_depois_dos_60` | npc | 4,3% |
| `shows_cancelados` | evento | 4,3% |
| `ferias_do_dono` | evento | 4,2% |
| `carregar_a_geladeira` | evento | 4,2% |
| `clientes_sumiram` | evento | 4,2% |
| `imovel_na_baixa` | evento | 4,2% |
| `convite_igreja` | npc | 4,1% |
| `balcao_de_crianca` | evento | 4,1% |
| `recaida_cigarro` | evento | 4,1% |
| `crise_no_setor` | evento | 3,9% |
| `pescaria_no_rio` | evento | 3,9% |
| `depois_da_venda` | evento | 3,9% |
| `cidadania_do_bisavo` | evento | 3,8% |
| `arrojado_na_queda` | evento | 3,8% |
| `black_friday` | evento | 3,8% |
| `convite_para_o_palco_grande` | evento | 3,7% |
| `balcao_da_familia` | evento | 3,7% |
| `filho_cuida` | npc | 3,7% |
| `gravidez_surpresa` | npc | 3,6% |
| `hospital_sem_insumo` | evento | 3,6% |
| `rodada_grande` | evento | 3,6% |
| `conselho_que_diz_nao` | jogada | 3,6% |
| `ferias_com_a_familia_do_amor` | npc | 3,6% |
| `filho_quer_carro` | evento | 3,5% |
| `vida_depois_da_condenacao` | evento | 3,5% |
| `reencontro_paixao` | evento | 3,4% |
| `programa_de_moradia` | evento | 3,4% |
| `aposentado_quer_ajudar_na_empresa` | npc | 3,4% |
| `reajuste_dos_servidores` | evento | 3,3% |
| `prova_concurso` | evento | 3,3% |
| `briga_por_heranca` | evento | 3,2% |
| `dizimo` | evento | 3,1% |
| `cancelado` | evento | 3,1% |
| `ajudar_na_roca` | acao | 3,0% |
| `visitar_de_longe` | acao | 3,0% |
| `frete_sumiu` | evento | 3,0% |
| `filho_saude_fragil` | npc | 2,9% |
| `surto_no_bairro` | evento | 2,9% |
| `vender_picole` | acao | 2,9% |
| `renegociar_divida` | evento | 2,8% |
| `emprego_tecnologia` | evento | 2,7% |
| `cuidar_netos` | acao | 2,7% |
| `expandir_na_alta` | evento | 2,6% |
| `cara_de_comercial` | evento | 2,6% |
| `birra_no_mercado` | evento | 2,6% |
| `presidir_cpi` | evento | 2,6% |
| `gorjeta_boa` | evento | 2,6% |
| `emprestimo_de_volta` | evento | 2,6% |
| `crianca_ansiosa` | evento | 2,5% |
| `segredo_de_familia` | npc | 2,5% |
| `pai_namorando_de_novo` | npc | 2,5% |
| `fim_do_amor` | npc | 2,5% |
| `padrao_aperta` | evento | 2,5% |
| `lesao_grave` | evento | 2,5% |
| `seguranca_particular` | evento | 2,5% |
| `segundo_carro` | evento | 2,4% |
| `terapia` | acao | 2,4% |
| `amigo_ficou_rico` | npc | 2,4% |
| `bodas_de_prata` | evento | 2,3% |
| `bancar_quem_sai` | jogada | 2,3% |
| `lembranca_primeiro_amor` | evento | 2,3% |
| `familia_descobre_o_testamento` | evento | 2,2% |
| `filho_passou_longe` | npc | 2,2% |
| `sair_de_casa_cedo` | evento | 2,1% |
| `filho_primeiro_salario` | npc | 2,1% |
| `ajudar_na_coleta` | evento | 2,1% |
| `time_a_venda` | evento | 2,1% |
| `carreira_futebol` | evento | 2,1% |
| `happy_hour` | acao | 2,1% |
| `missa_em_familia` | acao | 2,1% |
| `ocorrencia_perigosa` | evento | 2,0% |
| `burnout` | evento | 2,0% |
| `dez_anos_de_empresa` | evento | 2,0% |
| `proposta_da_europa` | evento | 2,0% |
| `pane_no_voo` | evento | 2,0% |
| `promocao_em_outra_cidade` | evento | 2,0% |
| `salario_parcelado` | evento | 2,0% |
| `oferece_ajuda` | npc | 2,0% |
| `hit_viral` | evento | 2,0% |
| `paparazzi` | evento | 2,0% |
| `retirada_demais` | evento | 1,9% |
| `passear_pet` | acao | 1,8% |
| `contrato_publicitario` | evento | 1,8% |
| `amor_quadro_de_tarefas` | npc | 1,8% |
| `tocar_o_negocio` | acao | 1,8% |
| `conselho_de_fachada` | evento | 1,8% |
| `apartamento_de_presente` | evento | 1,7% |
| `critico_no_salao` | evento | 1,7% |
| `emprego_educacao` | evento | 1,7% |
| `proposta_em_dolar` | evento | 1,7% |
| `intercambio` | evento | 1,6% |
| `acoes_da_startup` | evento | 1,5% |
| `mural_de_problemas` | jogada | 1,5% |
| `reforma_sem_fim` | evento | 1,5% |
| `deploy_de_sexta` | evento | 1,5% |
| `doar_em_vida` | evento | 1,5% |
| `mae_quer_voltar_a_trabalhar` | evento | 1,5% |
| `mestrado_fora` | evento | 1,5% |
| `apuracao_do_carnaval` | evento | 1,4% |
| `turne_nacional` | evento | 1,4% |
| `robos_na_fabrica` | evento | 1,4% |
| `livro_viralizou` | evento | 1,4% |
| `lista_dos_mais_ricos` | evento | 1,4% |
| `rebaixamento` | evento | 1,4% |
| `chefe_amigo` | evento | 1,3% |
| `fila_do_emprego` | evento | 1,3% |
| `foto_de_campanha` | evento | 1,3% |
| `papel_da_vida` | evento | 1,3% |
| `holding_da_familia` | evento | 1,3% |
| `celular_dos_pais` | npc | 1,3% |
| `obra_atrasada` | evento | 1,3% |
| `briga_de_casal` | npc | 1,3% |
| `vaga_na_empresa_dele` | npc | 1,3% |
| `vendas_recorde` | evento | 1,3% |
| `o_conselho_vetou` | evento | 1,2% |
| `layoff_por_email` | evento | 1,2% |
| `equipe_para_desmontar` | jogada | 1,2% |
| `nao_para_quieto` | evento | 1,1% |
| `filial_fechando` | evento | 1,1% |
| `safra_da_fazenda` | evento | 1,1% |
| `pressao_carreira` | npc | 1,1% |
| `despejo` | evento | 1,1% |
| `padrinho_casamento` | npc | 1,0% |
| `pix_para_a_cidade` | jogada | 1,0% |
| `montadora_vai_fechar` | evento | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `mais_uma_mudanca` | evento | 1,0% |
| `amor_paga_a_conta` | npc | 1,0% |
| `solucao_inesperada` | evento | 1,0% |
| `nega_ajuda` | npc | 1,0% |
| `vaga_no_agro` | evento | 0,9% |
| `trator_aos_dez` | evento | 0,9% |
| `pedreiro_vale_ouro` | evento | 0,9% |
| `estagio_do_pai` | evento | 0,9% |
| `sucessao_coroa` | evento | 0,9% |
| `tentar_a_vida_na_europa` | evento | 0,9% |
| `fa_obcecado` | evento | 0,9% |
| `carro_de_luxo_na_rua` | evento | 0,9% |
| `paciente_famoso` | evento | 0,8% |
| `noite_de_corridas` | evento | 0,8% |
| `final_da_copa` | evento | 0,8% |
| `proposta_pelo_negocio` | evento | 0,8% |
| `tornar_se_dispensavel` | jogada | 0,8% |
| `treinar_no_clube` | acao | 0,8% |
| `transito_de_sp` | evento | 0,8% |
| `obra_parada` | evento | 0,8% |
| `filho_briga_na_escola` | npc | 0,8% |
| `estatua_derrubada` | evento | 0,8% |
| `set_de_gravacao` | evento | 0,8% |
| `aperto_do_mes` | evento | 0,8% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,8% |
| `sucessao_regime` | evento | 0,8% |
| `aluguel_caro` | evento | 0,8% |
| `tradutor_da_familia` | evento | 0,8% |
| `pais_envelhecem` | npc | 0,7% |
| `fim_de_semana_no_sitio` | evento | 0,7% |
| `acampamento_na_porta` | evento | 0,7% |
| `plantao_que_nao_acaba` | evento | 0,7% |
| `cavalo_campeao` | evento | 0,7% |
| `negocio_em_crise` | evento | 0,7% |
| `abrir_capital` | evento | 0,7% |
| `a_empresa_sem_voce` | evento | 0,7% |
| `circo_vai_embora` | evento | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `filho_apresenta_namoro` | npc | 0,7% |
| `peneira_do_sobrenome` | evento | 0,7% |
| `cargo_no_gabinete` | evento | 0,7% |
| `naturalizacao` | evento | 0,6% |
| `carro_de_presente` | evento | 0,6% |
| `filho_quer_curso_caro` | npc | 0,6% |
| `internato_real` | evento | 0,6% |
| `quebra_de_safra` | evento | 0,6% |
| `amor_sempre_trabalhando` | npc | 0,6% |
| `operacao_no_gabinete` | evento | 0,6% |
| `fundacao` | jogada | 0,6% |
| `concurso_em_brasilia` | evento | 0,6% |
| `bancar_presidente` | jogada | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `feriado_na_praia` | evento | 0,5% |
| `sequestro_frustrado` | evento | 0,5% |
| `decreto_da_economia` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `bola_autografada` | evento | 0,5% |
| `turno_extra_na_fabrica` | evento | 0,5% |
| `cliente_perdeu_tudo` | evento | 0,5% |
| `favor_do_presidente` | evento | 0,5% |
| `carta_branca` | evento | 0,5% |
| `passou_mal_de_novo` | npc | 0,5% |
| `a_baba_foi_embora` | evento | 0,5% |
| `pais_aposentados` | npc | 0,5% |
| `royalties_secaram` | evento | 0,5% |
| `shopping_lotado` | evento | 0,5% |
| `emprego_artes` | evento | 0,5% |
| `proposta_remota` | evento | 0,5% |
| `crise_internacional` | evento | 0,5% |
| `reencontro_amigo_brigado` | evento | 0,4% |
| `ferias_coletivas` | evento | 0,4% |
| `regra_sob_medida` | evento | 0,4% |
| `picadeiro` | evento | 0,4% |
| `emprego_negocios` | evento | 0,4% |
| `amor_gastador` | npc | 0,4% |
| `o_mural_do_boton` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `filho_pede_ajuda` | npc | 0,4% |
| `safra_recorde` | evento | 0,4% |
| `cozinha_da_fundacao` | evento | 0,4% |
| `leilao_da_obra` | evento | 0,4% |
| `fim_carreira` | evento | 0,4% |
| `parcela_da_tv` | npc | 0,4% |
| `vista_da_cobertura` | evento | 0,4% |
| `zona_franca` | evento | 0,4% |
| `filho_adolescente_porta` | npc | 0,3% |
| `assumir_a_fazenda` | evento | 0,3% |
| `mansao_vazia` | evento | 0,3% |
| `escandalo_do_lobby` | evento | 0,3% |
| `reconciliacao` | npc | 0,3% |
| `conselho_quer_ceo` | evento | 0,3% |
| `amor_igreja` | npc | 0,3% |
| `teste_por_indicacao` | evento | 0,3% |
| `rival_bilionario` | evento | 0,3% |
| `startup_dos_ex_funcionarios` | evento | 0,3% |
| `amor_planilha` | npc | 0,3% |
| `ex_aluno` | evento | 0,3% |
| `bonus_do_banco` | evento | 0,3% |
| `cliente_duvidoso` | evento | 0,3% |
| `clientes_em_panico` | evento | 0,3% |
| `etiqueta_real` | evento | 0,3% |
| `paparazzi_real` | evento | 0,3% |
| `giz_do_proprio_bolso` | evento | 0,2% |
| `assinatura_real` | evento | 0,2% |
| `cliente_preso` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `casamento_real` | evento | 0,2% |
| `mordomias_reais` | evento | 0,2% |
| `cobrir_a_tatuagem` | evento | 0,2% |
| `amor_viaja_demais` | npc | 0,2% |
| `taxar_grandes_fortunas` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `amor_saude_fragil` | npc | 0,2% |
| `filho_missao` | npc | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `fundacao_premio` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `cpi_da_campanha` | evento | 0,2% |
| `conselho_dos_generais` | evento | 0,2% |
| `conta_na_suica` | evento | 0,2% |
| `desvio_na_fundacao` | evento | 0,1% |
| `presidente_pediu_as_contas` | evento | 0,1% |
| `general_ambicioso` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `cade_investiga` | evento | 0,1% |
| `bolsa_na_faculdade` | evento | 0,1% |
| `emprego_engenharia` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `tudo_pela_sua_mesa` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `cofrinho_cheio` | evento | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `sucessao_na_empresa` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `quem_manda_se_voce_faltar` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `amigo_lembra_zoeira` | npc | 0,1% |
| `filho_hamburgueria` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `ilha_particular` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `renegociar_cartao` | acao | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `herdeiros_de_olho` | evento | 0,1% |
| `a_empresa_anda_sozinha` | evento | 0,1% |
| `jatinho_para_onde` | evento | 0,1% |
| `filho_foi_embora` | npc | 0,0% |
| `os_dois_lados` | evento | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `receita_no_seu_pe` | evento | 0,0% |
| `rua_com_seu_nome` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `lancamento` | evento | 0,0% |
| `hospital_da_fundacao` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `floresta_invadida` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `vida_depois_da_coroa` | evento | 0,0% |
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

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 182 · **mudaram algo em pelo menos uma vida:** 183
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,4 · p10 50 · p25 58 · mediana 70 · p75 85 · p90 95

```
até 19                                        0,1%
20–29                                         0,1%
30–39          █                              0,7%
40–49          ████████████                   8,2%
50–59          ██████████████████████████████ 19,9%
60–69          ██████████████████████████████ 19,8%
70–79          ███████████████████████████    18,1%
80–89          ██████████████████████         14,9%
90–99          ███████████████████            12,7%
100+           ████████                       5,5%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 283 mil · p25 R$ 814 mil · mediana R$ 3,4 milhões · p75 R$ 32 milhões · p90 R$ 135 milhões

```
negativo       █                              0,9%
até 10 mil                                    0,2%
10–50 mil      █                              0,9%
50–200 mil     ███                            4,9%
200 mil–1 mi   ███████████████                22,1%
1–5 mi         █████████████████              25,8%
5 mi+          ██████████████████████████████ 45,2%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 75 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,6%
60–69          ████████████████               24,2%
70–79          ██████████████████████████████ 44,9%
80+            █████████████████              24,9%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 64,9 | R$ 1,2 milhão | 70,5 | 54,4 | 159,6 | 61,2 | 100% | 61% |
| cautelosa | 92,2 🏆 | R$ 57 milhões 🏆 | 75,2 | 70,7 | 217,2 | 82,5 | 100% | 72% |
| arriscada | 52,5 | R$ 2,3 milhões | 78,9 🏆 | 45,4 | 125,9 | 65,1 | 100% | 53% |
| aleatoria | 76,0 | R$ 1,4 milhão | 71,2 | 61,6 | 137,4 | 53,8 | 100% | 58% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,7% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,6% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,1% — de um AVC, numa terça-feira sem graça
- 7,1% — de velhice, dormindo, num domingo depois do almoço
- 6,6% — de pneumonia, depois de teimar que era só uma gripe
- 6,3% — numa cirurgia simples que não foi tão simples
- 5,7% — de complicações pulmonares, entre uma tosse e outra
- 5,2% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
