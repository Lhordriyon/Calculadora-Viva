# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 214 eventos, 67 de personagens, 70 ações, 642 escolhas, 139 linhas, 58 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 69,5% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 918 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,64 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 1,4× hoje | ✅ | 115,1 (base 110,8, teto 155,1) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 10,7% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 6,3% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ 1,5× | ✅ | 5,3% (base 3,0%, alvo 4,5%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,45 |
| Saturação V20 ≤ 95% | ✅ | 94,4% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 918 (base 893) |
| CPU por vida ≤ 30 ms | ✅ | 16,80 ms (base 14,5 ms) |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 69,5% / 94,4% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 76,2% |
| Efeito da memória (aleatória, V5 sem → com memória) | 72,7% → 67,0% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 918 (572) |
| Mobilidade: mesmo quintil da origem ao fim | 32,8% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,45 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 6,3% / 5,3% |
| Patrimônio p90/p10 | 26,8× (p10 R$ 63 mil, p90 R$ 1,7 milhão) |
| Desvio-padrão da felicidade média da vida | 8,64 |
| Vidas com patrimônio negativo ao morrer | 3,0% |
| Mudanças de estado causadas pelo jogador | 33,4% |
| Toques por vida | 115,1 |
| Tempo de CPU por vida | 16,80 ms |
| Ações (fichas usadas) por vida | 65,5 |
| Mortes na família por vida | 4,0 |
| Pontos de virada que vêm do mundo (não do jogador) | 10,7% |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 20% / 12% / 4% |
| Notícias do país por vida | 13,1 |
| Demissões por vida / vindas de uma recessão ou crise | 0,61 / 33,9% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 31 |
| Setor do último trabalho | serviços 29% · saúde 17% · comércio 17% · transporte e entregas 16% · serviço público 9% · tecnologia 3% · educação 3% · sem setor 3% · cultura e internet 1% · construção 1% · finanças 1% · agro 1% · indústria 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 34% | 50% | 62% | 70% | 85% | 91% | 94% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 33% | 26% | 21% | 14% | 6% |
| Q2 | 29% | 25% | 21% | 17% | 8% |
| Q3 | 19% | 23% | 24% | 23% | 10% |
| Q4 | 13% | 18% | 23% | 26% | 20% |
| Q5 | 5% | 8% | 11% | 20% | 56% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 10% | 70,7 | R$ 192 mil | 68,3 |
| família pobre | 24% | 71,1 | R$ 209 mil | 67,7 |
| família remediada | 26% | 71,1 | R$ 273 mil | 67,8 |
| classe média | 20% | 71,6 | R$ 386 mil | 68,5 |
| família rica | 13% | 71,7 | R$ 745 mil | 68,4 |
| família muito rica | 7% | 71,3 | R$ 2,2 milhões | 68,4 |

## Repetição

- **Dentro de uma vida:** 10,2% das aparições repetem uma instância já vista na mesma vida; pior vida: 32,7%.
- **Texto repetido entre vidas:** 35,9% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,9 · `aposentadoria` 1,0 · `avo_mesada_escondida#avo` 0,5 · `bilhete_carinhoso#mae` 0,4 · `bilhete_carinhoso#pai` 0,3 · `piada_no_grupo#mae` 0,3

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 54 de 257 storylets — `esporte_depois_da_aula`, `vape_festa`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `pedreiro_vale_ouro`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`, `amigo_lembra_zoeira`, `filho_distante`, `caramelo_envelhece`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `role`, `renegociar_cartao`, `treinar_no_clube`, `mochilao`, `carro_de_presente`, `vestibular_preparado`, `bolsa_na_faculdade`, `zona_franca`, `emprego_engenharia`, `proposta_remota`, `robos_na_fabrica`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `turno_extra_na_fabrica`, `clientes_em_panico`, `quebra_de_safra`, `ferias_coletivas`, `festival_lotado`, `mensalidade_da_escola`, `construtora_quebrou`
- **Apresentados por vida:** 48,0 · **com causa anterior (cadeia):** 34,9 · **maior distância causa→consequência:** 47,7 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeira_palavra` | evento | 100,0% |
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,5% |
| `luto` | npc | 99,1% |
| `brincar_com_irmao_avo` | acao | 96,1% |
| `enem` | evento | 94,3% |
| `cuidar_da_doenca` | npc | 77,7% |
| `visitar_familia` | acao | 72,0% |
| `aposentadoria` | evento | 69,4% |
| `ligar_amigo` | acao | 65,5% |
| `primeiro_investimento` | evento | 61,2% |
| `perdeu_emprego_na_crise` | npc | 59,7% |
| `ler_livros` | acao | 54,1% |
| `formatura` | evento | 53,9% |
| `almoco_domingo` | acao | 52,6% |
| `avo_mesada_escondida` | npc | 49,3% |
| `demissao` | evento | 49,1% |
| `primeiro_emprego` | evento | 48,4% |
| `correr` | acao | 47,9% |
| `brincar_na_rua` | acao | 47,9% |
| `curso_online` | acao | 46,7% |
| `amigo_em_apuros` | npc | 46,6% |
| `golpe_pix` | evento | 46,5% |
| `carro` | evento | 45,1% |
| `filho` | npc | 44,5% |
| `estudar_concurso` | acao | 44,5% |
| `bico_adulto` | acao | 44,4% |
| `creche_ou_vo` | evento | 44,3% |
| `casamento` | npc | 43,2% |
| `hobby_horta` | evento | 42,2% |
| `pos_graduacao` | acao | 41,4% |
| `doente_crianca` | npc | 41,0% |
| `festa_tema` | evento | 40,1% |
| `paquerar` | acao | 39,6% |
| `trabalho_grande` | acao | 39,4% |
| `desempregado` | evento | 39,2% |
| `estudar_tabuada` | acao | 38,6% |
| `bet` | evento | 38,2% |
| `bullying_recreio` | evento | 38,1% |
| `casa_propria` | evento | 38,0% |
| `festa_junina` | evento | 37,5% |
| `oportunidade_de_negocio` | evento | 37,1% |
| `cachorro_caramelo` | evento | 37,0% |
| `juros_compostos` | evento | 37,0% |
| `investir_tesouro` | acao | 36,8% |
| `estudar_escola` | acao | 36,7% |
| `criptomoeda` | evento | 36,6% |
| `academia` | acao | 36,1% |
| `casa_dos_pais` | evento | 35,8% |
| `filho_adolescente` | evento | 34,4% |
| `esporte_depois_da_aula` | evento | 33,8% |
| `hidroginastica` | evento | 33,7% |
| `primeiro_beijo` | evento | 32,6% |
| `sair_de_casa` | evento | 32,2% |
| `amigo_devolve` | npc | 31,4% |
| `reencontro_amigo` | evento | 30,8% |
| `investimento_rotina` | evento | 30,7% |
| `primeiro_celular` | evento | 30,5% |
| `filho_formatura` | evento | 29,3% |
| `investimento_furado` | evento | 29,2% |
| `banda_garagem` | evento | 28,6% |
| `bilhete_carinhoso` | npc | 28,4% |
| `piada_no_grupo` | npc | 28,3% |
| `estudar_faculdade` | acao | 28,2% |
| `promocao` | evento | 28,1% |
| `pede_ajuda` | npc | 28,1% |
| `vape_festa` | evento | 27,5% |
| `emprego_saude` | evento | 27,4% |
| `moeda_digital` | evento | 26,8% |
| `avo_conta_historias` | npc | 26,7% |
| `mesada` | evento | 26,7% |
| `rebalancear` | acao | 26,7% |
| `feira_ciencias` | evento | 26,6% |
| `consorcio` | evento | 26,0% |
| `voltar_estudar` | evento | 25,5% |
| `fugir_inflacao` | acao | 25,2% |
| `piramide_no_grupo` | npc | 25,2% |
| `festa_da_cidade` | acao | 24,9% |
| `socio_sumiu` | evento | 24,9% |
| `perdeu_aniversario` | npc | 24,6% |
| `voltar_a_estudar` | acao | 24,4% |
| `tocar_empresa` | acao | 24,1% |
| `separacao` | evento | 23,6% |
| `previdencia` | acao | 23,4% |
| `queda` | evento | 23,1% |
| `tempo_com_amor` | acao | 23,0% |
| `testamento` | evento | 22,8% |
| `cursinho_pago` | acao | 22,5% |
| `entregador_chuva` | evento | 22,1% |
| `proposta_na_expansao` | evento | 21,5% |
| `curso_nota_alta` | evento | 21,1% |
| `ceu_de_fumaca` | evento | 20,7% |
| `cuidar_de_doente` | acao | 20,4% |
| `encontro` | acao | 20,1% |
| `pai_ausente_volta` | npc | 19,8% |
| `doenca_de_quem_ama` | evento | 19,7% |
| `hora_extra` | acao | 19,5% |
| `cartao_credito` | evento | 19,5% |
| `pressao_alta` | evento | 19,4% |
| `festa_80` | evento | 19,0% |
| `brincar_amigos` | acao | 18,9% |
| `cofrinho` | acao | 18,6% |
| `quarto_dividido` | evento | 18,6% |
| `recomecar_amor` | acao | 18,4% |
| `guardar_dinheiro` | acao | 17,8% |
| `vicio_aposta` | evento | 17,8% |
| `tarifa_do_app` | evento | 17,8% |
| `atendimento_robo` | evento | 17,7% |
| `festa_sem_pais` | evento | 17,4% |
| `corte_de_salario` | evento | 17,2% |
| `entregas` | acao | 17,2% |
| `crise_40` | evento | 17,1% |
| `surpresa_do_amor` | npc | 17,1% |
| `curso_nota_media` | evento | 17,0% |
| `apartamento_na_planta` | evento | 16,9% |
| `netos` | evento | 16,8% |
| `estudar_enem` | acao | 16,5% |
| `briga_em_casa` | npc | 16,4% |
| `fiador` | npc | 16,2% |
| `esporte_escola` | acao | 16,0% |
| `casamento_na_igreja` | npc | 16,0% |
| `casa_cheia` | evento | 15,9% |
| `carteira_da_diarista` | evento | 15,4% |
| `ajudar_em_casa` | acao | 15,3% |
| `negocio_no_aperto` | evento | 14,9% |
| `franquia` | evento | 14,9% |
| `padrao_de_vida` | evento | 14,4% |
| `caminhada` | acao | 14,2% |
| `bolsa_de_estudos` | evento | 14,1% |
| `faculdade_vida` | evento | 14,1% |
| `festa_surpresa` | evento | 13,9% |
| `cidadania_italiana` | evento | 13,8% |
| `maratona` | evento | 13,5% |
| `plantao_lotado` | evento | 13,1% |
| `seca_no_sertao` | evento | 13,0% |
| `mutirao_da_laje` | evento | 12,6% |
| `cheia_do_rio` | evento | 12,3% |
| `separacao_dos_pais` | evento | 12,1% |
| `bico_na_expansao` | evento | 11,8% |
| `cortar_gastos` | acao | 11,7% |
| `baile_terceira_idade` | acao | 11,6% |
| `praia` | acao | 11,6% |
| `black_friday` | evento | 11,6% |
| `concurso_lotado` | evento | 11,5% |
| `merenda` | evento | 11,5% |
| `show_no_estadio` | acao | 11,5% |
| `imovel_valorizou` | evento | 11,3% |
| `pelada` | acao | 11,2% |
| `amor_proposta_fora` | npc | 11,0% |
| `amor_piada_interna` | npc | 10,7% |
| `pousada_na_praia` | evento | 10,7% |
| `sao_joao` | acao | 10,6% |
| `enchente_na_rua` | evento | 10,0% |
| `olimpiada` | acao | 9,8% |
| `filho_desenho` | npc | 9,8% |
| `balcao_negocio` | acao | 9,8% |
| `tosse_cronica` | evento | 9,7% |
| `vo_receita` | evento | 9,6% |
| `show_no_bar` | evento | 9,6% |
| `geladeira_vazia` | evento | 9,6% |
| `vereador` | evento | 9,5% |
| `tentar_outra_cidade` | evento | 9,4% |
| `fazenda_a_venda` | evento | 9,4% |
| `titulo_eleitor` | evento | 9,3% |
| `promessa_da_mae` | evento | 9,2% |
| `subir_de_padrao` | evento | 9,2% |
| `pais_na_crise` | npc | 9,2% |
| `bico_adolescente` | acao | 9,0% |
| `vaga_na_capital` | evento | 8,9% |
| `programa_de_moradia` | evento | 8,9% |
| `cripto_de_novo` | acao | 8,8% |
| `natal_com_politica` | evento | 8,8% |
| `casa_na_praia` | evento | 8,7% |
| `crise_de_ansiedade` | evento | 8,7% |
| `amigo_muda_de_cidade` | npc | 8,6% |
| `olimpiada_matematica` | evento | 8,5% |
| `greve_do_servidor` | evento | 8,4% |
| `filho_imitacao` | npc | 8,3% |
| `plano_de_saude_subiu` | evento | 8,2% |
| `proposta_sao_paulo` | evento | 8,1% |
| `vo_partiu` | npc | 8,1% |
| `ainda_mora_com_pais` | evento | 7,9% |
| `aprovado_concurso_estudo` | evento | 7,8% |
| `chimarrao` | acao | 7,8% |
| `frete_sumiu` | evento | 7,8% |
| `sociedade_amigo` | evento | 7,6% |
| `briga_dos_pais` | evento | 7,6% |
| `aposentadoria_nao_da` | npc | 7,6% |
| `boi_bumba` | acao | 7,5% |
| `confeitaria_da_vo` | evento | 7,4% |
| `volta_terra` | evento | 7,4% |
| `luto_do_bicho` | npc | 7,4% |
| `segundo_carro` | evento | 7,4% |
| `parar_de_fumar` | acao | 7,3% |
| `pais_separados_natal` | evento | 7,3% |
| `viralizou` | evento | 7,2% |
| `peneira` | evento | 7,1% |
| `emprego_educacao` | evento | 7,1% |
| `clientes_sumiram` | evento | 7,0% |
| `alavancagem` | evento | 6,9% |
| `heranca` | evento | 6,8% |
| `renegociar_divida` | evento | 6,7% |
| `convite_para_candidatura` | evento | 6,7% |
| `clinica_particular_contrata` | evento | 6,6% |
| `cobranca_de_notas` | npc | 6,6% |
| `check_up` | acao | 6,6% |
| `assumir_negocio` | evento | 6,6% |
| `festa_de_15` | evento | 6,5% |
| `este_e_o_ano` | evento | 6,5% |
| `intercambio_pago` | evento | 6,4% |
| `obra_grande_no_norte` | evento | 6,1% |
| `chaves_do_apartamento` | evento | 6,1% |
| `grupo_de_jovens` | evento | 6,0% |
| `nome_sujo` | evento | 6,0% |
| `filho_primeiro_salario` | npc | 6,0% |
| `terapia` | acao | 6,0% |
| `curso_nota_baixa` | evento | 5,6% |
| `paquerar_timido` | acao | 5,6% |
| `burnout` | evento | 5,6% |
| `herdeiro_gastao` | evento | 5,5% |
| `convite_igreja` | npc | 5,5% |
| `filho_cuida` | npc | 5,5% |
| `tempo_com_filho` | acao | 5,4% |
| `apresentacao_para_a_diretoria` | evento | 5,4% |
| `bater_o_pe_com_o_chefe` | evento | 5,4% |
| `hospital_sem_insumo` | evento | 5,3% |
| `agro_na_cidade` | evento | 5,2% |
| `mei_negocio` | evento | 5,2% |
| `carregar_a_geladeira` | evento | 5,2% |
| `oferece_ajuda` | npc | 5,2% |
| `dolar_disparou` | evento | 5,1% |
| `alguem_especial` | evento | 5,0% |
| `emprestimo_ao_irmao` | evento | 4,9% |
| `cursinho_comunitario` | evento | 4,9% |
| `balcao_de_crianca` | evento | 4,8% |
| `filho_passou_longe` | npc | 4,7% |
| `gorjeta_boa` | evento | 4,7% |
| `bolsa_derreteu` | evento | 4,7% |
| `filial_fechando` | evento | 4,7% |
| `prova_concurso` | evento | 4,6% |
| `recaida_cigarro` | evento | 4,5% |
| `blindar_contas` | acao | 4,5% |
| `vendas_recorde` | evento | 4,5% |
| `reencontro_paixao` | evento | 4,4% |
| `cachoeira` | acao | 4,2% |
| `amor_quadro_de_tarefas` | npc | 4,2% |
| `vender_doce` | acao | 4,2% |
| `briga_de_casal` | npc | 4,1% |
| `emprego_tecnologia` | evento | 4,0% |
| `reajuste_dos_servidores` | evento | 3,9% |
| `briga_por_heranca` | evento | 3,9% |
| `nega_ajuda` | npc | 3,9% |
| `ex_aluno` | evento | 3,9% |
| `lembranca_primeiro_amor` | evento | 3,8% |
| `hidro_com_a_turma` | acao | 3,8% |
| `cidadania_do_bisavo` | evento | 3,8% |
| `dizimo` | evento | 3,8% |
| `visitar_de_longe` | acao | 3,7% |
| `despejo` | evento | 3,6% |
| `fim_do_amor` | npc | 3,4% |
| `vender_doce_nato` | acao | 3,3% |
| `pais_envelhecem` | npc | 3,2% |
| `padrao_aperta` | evento | 3,2% |
| `cara_de_comercial` | evento | 3,2% |
| `cuidar_netos` | acao | 3,1% |
| `proposta_pelo_negocio` | evento | 3,1% |
| `vaga_na_empresa_dele` | npc | 3,1% |
| `ajudar_na_coleta` | evento | 3,0% |
| `filho_saude_fragil` | npc | 2,9% |
| `conteudo_extra` | acao | 2,8% |
| `rebaixamento` | evento | 2,7% |
| `passear_pet` | acao | 2,7% |
| `aperto_do_mes` | evento | 2,6% |
| `fila_do_emprego` | evento | 2,6% |
| `padrinho_casamento` | npc | 2,5% |
| `cursinho_paga_bem` | evento | 2,4% |
| `salario_parcelado` | evento | 2,4% |
| `giz_do_proprio_bolso` | evento | 2,2% |
| `mestrado_fora` | evento | 2,2% |
| `filho_pede_ajuda` | npc | 2,1% |
| `sair_de_casa_cedo` | evento | 2,0% |
| `pais_aposentados` | npc | 1,9% |
| `negocio_em_crise` | evento | 1,9% |
| `amor_paga_a_conta` | npc | 1,9% |
| `vaga_no_agro` | evento | 1,9% |
| `amor_sempre_trabalhando` | npc | 1,8% |
| `imovel_na_baixa` | evento | 1,8% |
| `apartamento_de_presente` | evento | 1,6% |
| `intercambio` | evento | 1,6% |
| `tentar_a_vida_na_europa` | evento | 1,5% |
| `emprego_negocios` | evento | 1,5% |
| `chefe_amigo` | evento | 1,5% |
| `acoes_da_startup` | evento | 1,4% |
| `aluguel_caro` | evento | 1,3% |
| `reencontro_amigo_brigado` | evento | 1,3% |
| `amor_gastador` | npc | 1,3% |
| `filho_briga_na_escola` | npc | 1,2% |
| `reconciliacao` | npc | 1,1% |
| `parcela_da_tv` | npc | 1,1% |
| `transito_de_sp` | evento | 1,1% |
| `estagio_do_pai` | evento | 1,1% |
| `montadora_vai_fechar` | evento | 1,1% |
| `edital_de_cultura` | evento | 1,0% |
| `layoff_por_email` | evento | 1,0% |
| `amor_igreja` | npc | 0,9% |
| `amor_planilha` | npc | 0,9% |
| `happy_hour` | acao | 0,9% |
| `emprego_artes` | evento | 0,9% |
| `pressao_carreira` | npc | 0,8% |
| `filho_quer_capital` | npc | 0,8% |
| `amor_saude_fragil` | npc | 0,8% |
| `passou_mal_de_novo` | npc | 0,7% |
| `filho_adolescente_porta` | npc | 0,7% |
| `concurso_em_brasilia` | evento | 0,7% |
| `carreira_futebol` | evento | 0,7% |
| `tocar_no_bar` | acao | 0,6% |
| `cofrinho_cheio` | evento | 0,6% |
| `amor_viaja_demais` | npc | 0,6% |
| `shows_cancelados` | evento | 0,5% |
| `pedreiro_vale_ouro` | evento | 0,5% |
| `royalties_secaram` | evento | 0,5% |
| `festival_lotado` | evento | 0,5% |
| `emprego_engenharia` | evento | 0,5% |
| `carro_de_presente` | evento | 0,5% |
| `robos_na_fabrica` | evento | 0,4% |
| `zona_franca` | evento | 0,4% |
| `filho_hamburgueria` | npc | 0,4% |
| `mensalidade_da_escola` | npc | 0,3% |
| `obra_parada` | evento | 0,3% |
| `quebra_de_safra` | evento | 0,3% |
| `bonus_do_banco` | evento | 0,3% |
| `clientes_em_panico` | evento | 0,3% |
| `filho_foi_embora` | npc | 0,2% |
| `bolsa_na_faculdade` | evento | 0,2% |
| `proposta_remota` | evento | 0,2% |
| `filho_distante` | npc | 0,2% |
| `ferias_coletivas` | evento | 0,2% |
| `role` | acao | 0,2% |
| `turno_extra_na_fabrica` | evento | 0,2% |
| `caramelo_envelhece` | npc | 0,1% |
| `filho_planilha_da_velhice` | npc | 0,1% |
| `mochilao` | acao | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `renegociar_cartao` | acao | 0,1% |
| `safra_recorde` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `amigo_lembra_zoeira` | npc | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `treinar_no_clube` | acao | 0,1% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 80 · **mudaram algo em pelo menos uma vida:** 80
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,3 · p10 58 · p25 65 · mediana 72 · p75 79 · p90 84

```
até 19                                        0,1%
20–29                                         0,1%
30–39                                         0,3%
40–49          █                              1,7%
50–59          █████████                      10,7%
60–69          ███████████████████████        27,8%
70–79          ██████████████████████████████ 36,9%
80–89          █████████████████              20,6%
90–99          ██                             1,8%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 63 mil · p25 R$ 148 mil · mediana R$ 323 mil · p75 R$ 708 mil · p90 R$ 1,7 milhão

```
negativo       ██                             3,0%
até 10 mil                                    0,6%
10–50 mil      ███                            4,4%
50–200 mil     ████████████████               25,6%
200 mil–1 mi   ██████████████████████████████ 49,2%
1–5 mi         █████████                      14,5%
5 mi+          ██                             2,7%
```

**Felicidade média ao longo da vida** — p10 57 · mediana 68 · p90 79

```
até 29                                        0,0%
30–39                                         0,1%
40–49          █                              1,9%
50–59          ███████████                    15,2%
60–69          ██████████████████████████████ 40,8%
70–79          █████████████████████████      33,4%
80+            ██████                         8,6%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 69,9 | R$ 353 mil | 70,6 🏆 | 47,8 | 66,8 | 32,2 | 100% | 70% |
| cautelosa | 79,3 🏆 | R$ 300 mil | 65,2 | 50,4 | 76,3 | 22,4 | 100% | 74% |
| arriscada | 62,7 | R$ 496 mil 🏆 | 70,5 | 44,3 | 59,7 | 43,2 | 100% | 66% |
| aleatoria | 73,3 | R$ 189 mil | 66,1 | 49,3 | 59,2 | 41,9 | 100% | 67% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,4% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 12,0% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,9% — de um AVC, numa terça-feira sem graça
- 8,4% — de pneumonia, depois de teimar que era só uma gripe
- 6,7% — de complicações de uma queda no banheiro
- 6,1% — numa cirurgia simples que não foi tão simples
- 4,9% — de complicações pulmonares, entre uma tosse e outra
- 4,3% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por ano (no verbo da ficha ou no +1 ano) + um por escolha.
