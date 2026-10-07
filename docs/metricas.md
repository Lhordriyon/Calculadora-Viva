# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 418 eventos, 84 de personagens, 86 ações, 1166 escolhas, 189 linhas, 99 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 62,4% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 899 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,46 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 450,7 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 8,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 14,8% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 3,0% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,32 |
| Saturação V20 ≤ 95% | ✅ | 92,6% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 899 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 34,91 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,4% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 60,1% (168 dinastias, média de 3,1 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,80 (349 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 272 mil / R$ 348 mil / R$ 601 mil; p10 R$ 235 mil / R$ 199 mil / R$ 103 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 8,20% (p99 R$ 953 milhões, maior R$ 1,1 trilhão) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,92% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,7% de 61,5% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 19,5% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 92,6% |
| Assinaturas sem regressão (≥ 918) | ❌ | 899 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 450,7 |
| CPU por vida ≤ 30 ms | ❌ | 34,91 ms |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 62,4% / 92,6% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 69,5% |
| Efeito da memória (aleatória, V5 sem → com memória) | 66,5% → 59,1% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 899 (589) |
| Mobilidade: mesmo quintil da origem ao fim | 26,5% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,32 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,8% / 3,0% |
| Patrimônio p90/p10 | 467,6× (p10 R$ 296 mil, p90 R$ 139 milhões) |
| Desvio-padrão da felicidade média da vida | 8,46 |
| Vidas com patrimônio negativo ao morrer | 0,9% |
| Mudanças de estado causadas pelo jogador | 44,3% |
| Toques por vida | 450,7 |
| Tempo de CPU por vida | 34,91 ms |
| Ações (fichas usadas) por vida | 158,6 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 8,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,6 |
| Vidas que terminam com filho ou filha para continuar | 84,4% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,1 / 60,1% / 25,6% |
| Idade de quem herda ao começar (mediana) / herança mediana | 36 anos / R$ 11 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,80 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 61,5% |
| Entre quem abriu: quebrou / vendeu | 28,7% / 28,4% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2 milhões / R$ 79 milhões / R$ 953 milhões / R$ 1,1 trilhão |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 31,29% / 8,20% / 0,92% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 19,5% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 57,0 / 158,6 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 235 mil | R$ 272 mil | R$ 322 mil |
| moderado | R$ 199 mil | R$ 348 mil | R$ 549 mil |
| arrojado | R$ 103 mil | R$ 601 mil | R$ 2 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 797 | R$ 140 mil | R$ 1,5 milhão | R$ 66 milhões |
| moderado | 1006 | R$ 166 mil | R$ 1,4 milhão | R$ 22 milhões |
| arrojado | 697 | R$ 154 mil | R$ 1,4 milhão | R$ 39 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 71,6 | R$ 1,4 milhão | 75,0 |
| pobre | 104 | 70,0 | R$ 1,3 milhão | 74,6 |
| remediada | 24 | 74,0 | R$ 2,1 milhões | 77,1 |
| media | 64 | 72,0 | R$ 2,2 milhões | 73,9 |
| rica | 64 | 73,1 | R$ 4,7 milhões | 76,7 |
| muito rica | 144 | 72,3 | R$ 33 milhões | 76,1 |
| bilionaria | 104 | 70,8 | R$ 4,1 bilhões | 76,6 |
| trilionaria | 24 | 71,0 | R$ 580 bilhões | 77,2 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 20% / 12% / 3% |
| Notícias do país por vida | 13,1 |
| Demissões por vida / vindas de uma recessão ou crise | 0,59 / 35,0% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 27 |
| Setor do último trabalho | serviço público 54% · serviços 14% · saúde 12% · cultura e internet 5% · comércio 5% · transporte e entregas 4% · construção 2% · tecnologia 1% · agro 1% · indústria 1% · sem setor 1% · finanças 0% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 25% | 40% | 53% | 62% | 82% | 89% | 93% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 30% | 22% | 18% | 16% | 15% |
| Q2 | 30% | 22% | 17% | 17% | 15% |
| Q3 | 23% | 23% | 19% | 19% | 15% |
| Q4 | 14% | 24% | 27% | 21% | 14% |
| Q5 | 3% | 8% | 20% | 28% | 41% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 71,3 | R$ 1,8 milhão | 73,7 |
| família pobre | 24% | 71,7 | R$ 1,7 milhão | 74,0 |
| família remediada | 20% | 72,4 | R$ 2 milhão | 73,8 |
| classe média | 18% | 71,9 | R$ 2,7 milhões | 73,6 |
| família rica | 13% | 71,7 | R$ 4,8 milhões | 73,9 |
| família muito rica | 13% | 71,1 | R$ 26 milhões | 75,0 |
| família bilionária | 3% | 69,2 | R$ 4,1 bilhões | 75,6 |

## Repetição

- **Dentro de uma vida:** 7,8% das aparições repetem uma instância já vista na mesma vida; pior vida: 26,3%.
- **Texto repetido entre vidas:** 35,3% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,0 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,4 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,2 · `bilhete_carinhoso#pai` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 98 de 475 storylets — `esporte_depois_da_aula`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `carro_de_presente`, `cofrinho_cheio`, `vestibular_preparado`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `acionistas_furiosos`, `capa_de_revista`, `cobrir_a_tatuagem`, `filho_quer_curso_caro`, `sucessao_na_empresa`, `conselho_quer_ceo`, `etiqueta_real`, `internato_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `operacao_no_gabinete`, `assumir_a_fazenda`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `vista_da_cobertura`, `mansao_vazia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `dono_do_clube`, `queda_do_cargo`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 57,0 · **com causa anterior (cadeia):** 65,5 · **maior distância causa→consequência:** 49,0 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeira_palavra` | evento | 100,0% |
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,0% |
| `luto` | npc | 98,0% |
| `enem` | evento | 94,3% |
| `trabalho_grande` | acao | 74,8% |
| `bico_adulto` | acao | 70,4% |
| `visitar_familia` | acao | 68,9% |
| `cuidar_da_doenca` | npc | 65,6% |
| `parquinho` | acao | 63,0% |
| `aposentadoria` | evento | 59,5% |
| `ler_gibi` | acao | 58,6% |
| `formatura` | evento | 57,8% |
| `almoco_domingo` | acao | 55,3% |
| `tocar_empresa` | acao | 53,5% |
| `ligar_amigo` | acao | 51,9% |
| `curso_online` | acao | 49,8% |
| `avo_mesada_escondida` | npc | 49,8% |
| `mochilao` | acao | 49,8% |
| `pos_graduacao` | acao | 48,9% |
| `estudar_enem` | acao | 47,9% |
| `correr` | acao | 47,5% |
| `demissao` | evento | 45,5% |
| `perdeu_emprego_na_crise` | npc | 44,9% |
| `primeiro_investimento` | evento | 44,8% |
| `estudar_concurso` | acao | 44,6% |
| `baile_terceira_idade` | acao | 44,3% |
| `paquerar` | acao | 42,1% |
| `doente_crianca` | npc | 42,1% |
| `creche_ou_vo` | evento | 40,9% |
| `primeiro_emprego` | evento | 40,6% |
| `copa_do_mundo` | evento | 39,5% |
| `amigo_em_apuros` | npc | 39,0% |
| `cuidar_de_doente` | acao | 38,7% |
| `ler_livros` | acao | 38,6% |
| `estudar_escola` | acao | 38,4% |
| `perguntar_porque` | acao | 38,3% |
| `academia` | acao | 37,9% |
| `viagem_dos_sonhos` | evento | 37,2% |
| `investir_tesouro` | acao | 36,5% |
| `primeiro_beijo` | evento | 35,9% |
| `colesterol_alto` | evento | 34,9% |
| `casamento` | npc | 34,3% |
| `amigo_pede_dinheiro` | evento | 33,1% |
| `golpe_pix` | evento | 33,0% |
| `carro` | evento | 32,0% |
| `bullying_recreio` | evento | 31,9% |
| `doar_sangue` | evento | 31,7% |
| `oportunidade_de_negocio` | evento | 31,7% |
| `caminhada` | acao | 31,6% |
| `pelada_de_quinta` | evento | 31,3% |
| `bet` | evento | 31,3% |
| `festa_80` | evento | 31,2% |
| `banda_garagem` | evento | 31,2% |
| `videogame_do_amigo` | acao | 30,9% |
| `vape_festa` | evento | 30,4% |
| `viagem_realizada` | evento | 30,3% |
| `filho_adolescente` | evento | 30,2% |
| `filho` | npc | 30,1% |
| `estudar_tabuada` | acao | 30,0% |
| `investimento_furado` | evento | 30,0% |
| `criptomoeda` | evento | 29,9% |
| `cachorro_caramelo` | evento | 29,6% |
| `festa_tema` | evento | 29,3% |
| `natacao_no_clube` | acao | 29,2% |
| `largar_tudo` | evento | 28,5% |
| `sair_de_casa` | evento | 28,3% |
| `hidro_com_a_turma` | acao | 28,2% |
| `estudar_faculdade` | acao | 28,0% |
| `tatuagem` | evento | 27,9% |
| `juros_compostos` | evento | 27,8% |
| `bilhete_carinhoso` | npc | 27,7% |
| `ajudar_em_casa` | acao | 27,6% |
| `amigo_devolve` | npc | 27,6% |
| `primeiro_celular` | evento | 27,4% |
| `festa_junina` | evento | 27,2% |
| `casa_dos_pais` | evento | 27,0% |
| `previdencia` | acao | 26,9% |
| `bolao_do_trabalho` | evento | 26,7% |
| `vaquinha_do_vizinho` | evento | 26,7% |
| `piada_no_grupo` | npc | 26,6% |
| `pelada` | acao | 26,5% |
| `pensar_em_adotar` | evento | 26,1% |
| `esporte_depois_da_aula` | evento | 25,9% |
| `check_up` | acao | 25,8% |
| `curso_nota_alta` | evento | 25,7% |
| `rebalancear` | acao | 25,4% |
| `perdeu_aniversario` | npc | 24,9% |
| `bateu_o_carro` | evento | 24,9% |
| `guardar_dinheiro` | acao | 24,6% |
| `heranca_do_tio` | evento | 24,6% |
| `casa_propria` | evento | 24,5% |
| `show_no_estadio` | acao | 24,4% |
| `tempo_com_amor` | acao | 24,4% |
| `hobby_horta` | evento | 24,4% |
| `reforma_da_casa` | evento | 24,1% |
| `vizinho_barulhento` | evento | 24,0% |
| `voltar_a_estudar` | acao | 23,9% |
| `reencontro_da_turma` | evento | 23,8% |
| `avo_conta_historias` | npc | 23,7% |
| `desempregado` | evento | 23,7% |
| `proposta_na_expansao` | evento | 23,7% |
| `catapora` | evento | 23,6% |
| `hora_extra` | acao | 23,2% |
| `subir_de_padrao` | evento | 23,2% |
| `cortar_gastos` | acao | 23,0% |
| `pede_ajuda` | npc | 22,7% |
| `bico_adolescente` | acao | 22,6% |
| `emprego_saude` | evento | 22,6% |
| `moeda_digital` | evento | 22,5% |
| `assalto_na_rua` | evento | 22,4% |
| `filho_formatura` | evento | 22,3% |
| `feira_ciencias` | evento | 21,8% |
| `festa_da_cidade` | acao | 21,7% |
| `mesada` | evento | 21,6% |
| `franquia` | evento | 21,6% |
| `cursinho_pago` | acao | 21,4% |
| `encontro` | acao | 21,2% |
| `baile_da_terceira_idade` | evento | 21,1% |
| `cirurgia_de_catarata` | evento | 21,0% |
| `cozinhar_com_a_avo` | acao | 20,7% |
| `futebol_de_varzea` | acao | 20,4% |
| `investimento_rotina` | evento | 20,2% |
| `escrever_memorias` | evento | 19,8% |
| `carteira_da_diarista` | evento | 19,8% |
| `festa_sem_pais` | evento | 19,7% |
| `voltar_estudar` | evento | 19,7% |
| `fazenda_a_venda` | evento | 19,7% |
| `bloco_de_carnaval` | evento | 19,7% |
| `corte_de_salario` | evento | 19,7% |
| `festa_de_sao_joao` | evento | 19,5% |
| `hidroginastica` | evento | 19,5% |
| `mudar_para_a_praia` | evento | 19,5% |
| `golpe_do_falso_neto` | evento | 19,0% |
| `multa_e_batida` | evento | 19,0% |
| `convite_para_palestrar` | evento | 18,8% |
| `alugueis_dos_fundos` | evento | 18,7% |
| `vender_doce` | acao | 18,6% |
| `cripto_fomo` | evento | 18,6% |
| `ceu_de_fumaca` | evento | 18,2% |
| `pai_ausente_volta` | npc | 17,9% |
| `juros_altos` | evento | 17,9% |
| `entregas` | acao | 17,8% |
| `testamento` | evento | 17,8% |
| `entregador_chuva` | evento | 17,7% |
| `queda` | evento | 17,6% |
| `cartao_credito` | evento | 17,5% |
| `promocao` | evento | 17,1% |
| `compra_por_impulso` | evento | 17,1% |
| `reencontro_amigo` | evento | 16,7% |
| `maratona` | evento | 16,6% |
| `convite_do_luxo` | evento | 16,6% |
| `empresa_quebrou` | evento | 16,4% |
| `sovina_ou_sabio` | evento | 15,9% |
| `concorrente_gigante` | evento | 15,6% |
| `curso_nota_media` | evento | 15,3% |
| `ingles_crianca` | acao | 15,3% |
| `socio_sumiu` | evento | 15,3% |
| `produto_viralizou` | evento | 15,2% |
| `aula_de_musica` | evento | 15,1% |
| `brincar_com_irmao_avo` | acao | 15,0% |
| `casa_na_praia` | evento | 14,9% |
| `greve_dos_onibus` | evento | 14,8% |
| `consorcio` | evento | 14,7% |
| `alavancagem` | evento | 14,6% |
| `reuniao_de_condominio` | evento | 14,6% |
| `esporte_escola` | acao | 14,5% |
| `peneira` | evento | 14,4% |
| `casamento_na_igreja` | npc | 14,4% |
| `briga_em_casa` | npc | 14,2% |
| `quarto_dividido` | evento | 14,2% |
| `imovel_valorizou` | evento | 14,1% |
| `separacao` | evento | 14,0% |
| `aniversario_da_infancia` | evento | 13,9% |
| `parar_de_fumar` | acao | 13,9% |
| `investidor_anjo` | evento | 13,8% |
| `apartamento_na_planta` | evento | 13,6% |
| `feira_de_ciencias` | evento | 13,5% |
| `crise_40` | evento | 13,5% |
| `casa_cheia` | evento | 13,5% |
| `chefe_novo` | evento | 13,4% |
| `retiro_da_igreja` | evento | 13,4% |
| `fundo_da_familia` | npc | 13,3% |
| `bolsa_de_estudos` | evento | 13,2% |
| `bolsa_subiu_sem_voce` | evento | 13,2% |
| `cripto_disparou` | evento | 13,1% |
| `balcao_negocio` | acao | 12,8% |
| `padrao_de_vida` | evento | 12,6% |
| `ressaca_do_mar` | evento | 12,5% |
| `inquilino_sumiu` | evento | 12,4% |
| `ponto_comercial` | evento | 12,3% |
| `recomecar_amor` | acao | 12,2% |
| `separacao_dos_pais` | evento | 12,2% |
| `inquilino_dos_sonhos` | evento | 12,2% |
| `role` | acao | 12,2% |
| `vicio_aposta` | evento | 12,1% |
| `festa_surpresa` | evento | 12,1% |
| `atendimento_robo` | evento | 11,9% |
| `faculdade_vida` | evento | 11,9% |
| `edital_de_cultura` | evento | 11,7% |
| `noite_de_stand_up` | evento | 11,7% |
| `brincar_na_rua` | acao | 11,6% |
| `surpresa_do_amor` | npc | 11,5% |
| `aposentadoria_ativa` | evento | 11,4% |
| `mudanca_de_escola` | evento | 11,4% |
| `titulo_eleitor` | evento | 11,4% |
| `concurso_lotado` | evento | 11,4% |
| `dente_de_leite` | evento | 11,3% |
| `praia` | acao | 11,3% |
| `cheia_do_rio` | evento | 11,2% |
| `olimpiada_matematica` | evento | 11,1% |
| `piramide_no_grupo` | npc | 11,0% |
| `cofrinho` | acao | 11,0% |
| `seca_no_sertao` | evento | 11,0% |
| `cidadania_italiana` | evento | 11,0% |
| `festival_do_boi` | evento | 11,0% |
| `gerente_do_banco` | evento | 10,9% |
| `sao_joao` | acao | 10,6% |
| `dolar_disparou` | evento | 10,6% |
| `pressao_alta` | evento | 10,5% |
| `fugir_inflacao` | acao | 10,3% |
| `geada_no_sul` | evento | 10,2% |
| `apagao_no_morro` | evento | 10,1% |
| `festa_surpresa_para` | npc | 10,1% |
| `mei_negocio` | evento | 10,0% |
| `herdeiro_gastao` | evento | 10,0% |
| `assembleia_do_predio` | evento | 9,9% |
| `fiscalizacao` | evento | 9,8% |
| `propina_da_empreiteira` | evento | 9,8% |
| `negocio_no_aperto` | evento | 9,7% |
| `pousada_na_praia` | evento | 9,7% |
| `conteudo_extra` | acao | 9,6% |
| `bolsa_derreteu` | evento | 9,5% |
| `amor_proposta_fora` | npc | 9,3% |
| `show_no_bar` | evento | 9,3% |
| `brincar_amigos` | acao | 9,2% |
| `festa_de_15` | evento | 9,2% |
| `chimarrao` | acao | 9,2% |
| `doenca_de_quem_ama` | evento | 9,0% |
| `cripto_de_novo` | acao | 8,7% |
| `geladeira_vazia` | evento | 8,7% |
| `family_office` | evento | 8,7% |
| `operacao_policial` | evento | 8,5% |
| `proposta_de_compra` | evento | 8,5% |
| `moto_na_chuva` | evento | 8,4% |
| `enchente_na_rua` | evento | 8,4% |
| `pescaria_no_pantanal` | evento | 8,4% |
| `filho_desenho` | npc | 8,4% |
| `adocao_chegou` | evento | 8,4% |
| `amor_piada_interna` | npc | 8,3% |
| `boi_bumba` | acao | 8,3% |
| `plantao_lotado` | evento | 8,2% |
| `burnout_empresa` | evento | 8,2% |
| `vereador` | evento | 8,1% |
| `mutirao_da_laje` | evento | 8,1% |
| `netos` | evento | 8,1% |
| `merenda` | evento | 8,0% |
| `pular_corda` | acao | 7,9% |
| `vo_partiu` | npc | 7,9% |
| `cripto_derreteu` | evento | 7,9% |
| `votacao_polemica` | evento | 7,8% |
| `ano_de_prejuizo` | evento | 7,8% |
| `vo_receita` | evento | 7,7% |
| `bico_na_expansao` | evento | 7,7% |
| `natal_com_politica` | evento | 7,5% |
| `crise_de_ansiedade` | evento | 7,5% |
| `promessa_da_mae` | evento | 7,5% |
| `tempo_com_filho` | acao | 7,4% |
| `comecar_terapia` | evento | 7,4% |
| `figurinha_repetida` | acao | 7,3% |
| `namorar_depois_dos_60` | evento | 7,3% |
| `briga_dos_pais` | evento | 7,2% |
| `greve_do_servidor` | evento | 7,1% |
| `primeiro_funcionario` | evento | 7,1% |
| `soltar_pipa` | acao | 7,1% |
| `grupo_de_jovens` | evento | 7,1% |
| `blindar_contas` | acao | 7,1% |
| `joelho_da_pelada` | evento | 7,0% |
| `amigo_muda_de_cidade` | npc | 6,9% |
| `vender_doce_nato` | acao | 6,9% |
| `tarifa_do_app` | evento | 6,9% |
| `compativel_para_medula` | evento | 6,8% |
| `pais_separados_natal` | evento | 6,7% |
| `processo_trabalhista` | evento | 6,7% |
| `pais_na_crise` | npc | 6,7% |
| `emprestimo_ao_irmao` | evento | 6,6% |
| `viralizou` | evento | 6,6% |
| `chaves_do_apartamento` | evento | 6,6% |
| `aprovado_concurso_estudo` | evento | 6,5% |
| `fiador` | npc | 6,5% |
| `olimpiada` | acao | 6,4% |
| `imposto_sobre_fortunas` | evento | 6,4% |
| `festival_lotado` | evento | 6,4% |
| `tocar_no_bar` | acao | 6,3% |
| `briga_na_cozinha` | evento | 6,2% |
| `fundacao_com_seu_nome` | evento | 6,2% |
| `funcionario_genial` | evento | 6,2% |
| `convite_do_partido` | evento | 6,0% |
| `luto_do_bicho` | npc | 5,9% |
| `obra_grande_no_norte` | evento | 5,9% |
| `depois_do_cargo` | evento | 5,9% |
| `confeitaria_da_vo` | evento | 5,8% |
| `tentar_outra_cidade` | evento | 5,6% |
| `paquerar_timido` | acao | 5,6% |
| `filho_imitacao` | npc | 5,6% |
| `assumir_negocio` | evento | 5,6% |
| `sociedade_amigo` | evento | 5,6% |
| `mae_quer_morar_junto` | npc | 5,5% |
| `intercambio_pago` | evento | 5,5% |
| `cachoeira` | acao | 5,5% |
| `tosse_cronica` | evento | 5,5% |
| `vaga_na_capital` | evento | 5,5% |
| `volta_terra` | evento | 5,4% |
| `cobranca_de_notas` | npc | 5,3% |
| `casamento_do_filho` | evento | 5,3% |
| `heranca` | evento | 5,3% |
| `amor_quer_mudar_de_carreira` | npc | 5,2% |
| `convite_para_candidatura` | evento | 5,2% |
| `nome_sujo` | evento | 5,2% |
| `ainda_mora_com_pais` | evento | 5,2% |
| `bater_o_pe_com_o_chefe` | evento | 5,2% |
| `este_e_o_ano` | evento | 5,1% |
| `curso_nota_baixa` | evento | 5,0% |
| `proposta_sao_paulo` | evento | 5,0% |
| `agro_na_cidade` | evento | 5,0% |
| `alguem_especial` | evento | 5,0% |
| `carona_de_madrugada` | npc | 4,9% |
| `netos_nas_ferias` | evento | 4,8% |
| `cursinho_comunitario` | evento | 4,8% |
| `joias_no_cofre` | evento | 4,7% |
| `clientes_sumiram` | evento | 4,6% |
| `shows_cancelados` | evento | 4,6% |
| `clinica_particular_contrata` | evento | 4,6% |
| `pescaria_no_rio` | evento | 4,6% |
| `convite_igreja` | npc | 4,6% |
| `amigo_sumiu_e_voltou` | npc | 4,6% |
| `apresentacao_para_a_diretoria` | evento | 4,5% |
| `balcao_de_crianca` | evento | 4,4% |
| `balcao_da_familia` | evento | 4,3% |
| `plano_de_saude_subiu` | evento | 4,3% |
| `obra_do_predio` | evento | 4,3% |
| `trabalho_do_pai` | acao | 4,3% |
| `enchente_na_cidade` | evento | 4,3% |
| `faculdade_depois_dos_60` | npc | 4,2% |
| `carregar_a_geladeira` | evento | 4,2% |
| `aposentadoria_nao_da` | npc | 4,2% |
| `recaida_cigarro` | evento | 4,1% |
| `imovel_na_baixa` | evento | 4,1% |
| `crise_no_setor` | evento | 4,1% |
| `obra_ou_hospital` | evento | 4,1% |
| `depois_da_venda` | evento | 4,0% |
| `rodada_grande` | evento | 3,9% |
| `arrojado_na_queda` | evento | 3,8% |
| `vida_depois_da_condenacao` | evento | 3,8% |
| `black_friday` | evento | 3,8% |
| `filho_cuida` | npc | 3,7% |
| `hospital_sem_insumo` | evento | 3,7% |
| `reencontro_paixao` | evento | 3,6% |
| `ferias_com_a_familia_do_amor` | npc | 3,6% |
| `cidadania_do_bisavo` | evento | 3,5% |
| `filho_quer_carro` | evento | 3,5% |
| `convite_para_o_palco_grande` | evento | 3,4% |
| `programa_de_moradia` | evento | 3,4% |
| `ajudar_na_roca` | acao | 3,4% |
| `prova_concurso` | evento | 3,4% |
| `visitar_de_longe` | acao | 3,4% |
| `briga_por_heranca` | evento | 3,4% |
| `reajuste_dos_servidores` | evento | 3,3% |
| `gravidez_surpresa` | npc | 3,2% |
| `vender_picole` | acao | 3,1% |
| `cancelado` | evento | 3,0% |
| `renegociar_divida` | evento | 3,0% |
| `filho_saude_fragil` | npc | 3,0% |
| `cuidar_netos` | acao | 3,0% |
| `aposentado_quer_ajudar_na_empresa` | npc | 2,9% |
| `dizimo` | evento | 2,8% |
| `gorjeta_boa` | evento | 2,8% |
| `emprestimo_de_volta` | evento | 2,8% |
| `expandir_na_alta` | evento | 2,7% |
| `lembranca_primeiro_amor` | evento | 2,7% |
| `lesao_grave` | evento | 2,6% |
| `cara_de_comercial` | evento | 2,5% |
| `time_a_venda` | evento | 2,5% |
| `emprego_tecnologia` | evento | 2,5% |
| `bodas_de_prata` | evento | 2,5% |
| `padrao_aperta` | evento | 2,5% |
| `segredo_de_familia` | npc | 2,5% |
| `terapia` | acao | 2,5% |
| `seguranca_particular` | evento | 2,4% |
| `ajudar_na_coleta` | evento | 2,4% |
| `fim_do_amor` | npc | 2,4% |
| `presidir_cpi` | evento | 2,3% |
| `salario_parcelado` | evento | 2,3% |
| `dez_anos_de_empresa` | evento | 2,3% |
| `pai_namorando_de_novo` | npc | 2,2% |
| `frete_sumiu` | evento | 2,2% |
| `proposta_da_europa` | evento | 2,2% |
| `ocorrencia_perigosa` | evento | 2,2% |
| `missa_em_familia` | acao | 2,1% |
| `filho_primeiro_salario` | npc | 2,1% |
| `familia_descobre_o_testamento` | evento | 2,1% |
| `amor_quadro_de_tarefas` | npc | 2,1% |
| `segundo_carro` | evento | 2,1% |
| `happy_hour` | acao | 2,1% |
| `carreira_futebol` | evento | 2,1% |
| `sair_de_casa_cedo` | evento | 2,1% |
| `amigo_ficou_rico` | npc | 2,1% |
| `paparazzi` | evento | 2,1% |
| `passear_pet` | acao | 2,0% |
| `retirada_demais` | evento | 2,0% |
| `hit_viral` | evento | 1,9% |
| `intercambio` | evento | 1,8% |
| `burnout` | evento | 1,8% |
| `promocao_em_outra_cidade` | evento | 1,8% |
| `contrato_publicitario` | evento | 1,8% |
| `filho_passou_longe` | npc | 1,8% |
| `reforma_sem_fim` | evento | 1,8% |
| `apartamento_de_presente` | evento | 1,7% |
| `lista_dos_mais_ricos` | evento | 1,7% |
| `oferece_ajuda` | npc | 1,7% |
| `tocar_o_negocio` | acao | 1,7% |
| `pane_no_voo` | evento | 1,7% |
| `rebaixamento` | evento | 1,7% |
| `mestrado_fora` | evento | 1,6% |
| `proposta_em_dolar` | evento | 1,6% |
| `livro_viralizou` | evento | 1,6% |
| `foto_de_campanha` | evento | 1,6% |
| `critico_no_salao` | evento | 1,5% |
| `emprego_educacao` | evento | 1,5% |
| `acoes_da_startup` | evento | 1,5% |
| `papel_da_vida` | evento | 1,5% |
| `doar_em_vida` | evento | 1,5% |
| `turne_nacional` | evento | 1,5% |
| `chefe_amigo` | evento | 1,5% |
| `holding_da_familia` | evento | 1,4% |
| `fila_do_emprego` | evento | 1,4% |
| `robos_na_fabrica` | evento | 1,4% |
| `deploy_de_sexta` | evento | 1,4% |
| `vendas_recorde` | evento | 1,3% |
| `briga_de_casal` | npc | 1,3% |
| `obra_atrasada` | evento | 1,3% |
| `vaga_na_empresa_dele` | npc | 1,3% |
| `layoff_por_email` | evento | 1,2% |
| `filial_fechando` | evento | 1,2% |
| `safra_da_fazenda` | evento | 1,2% |
| `pressao_carreira` | npc | 1,2% |
| `celular_dos_pais` | npc | 1,1% |
| `vaga_no_agro` | evento | 1,1% |
| `padrinho_casamento` | npc | 1,1% |
| `filho_briga_na_escola` | npc | 1,1% |
| `nega_ajuda` | npc | 1,1% |
| `despejo` | evento | 1,0% |
| `pedreiro_vale_ouro` | evento | 1,0% |
| `tradutor_da_familia` | evento | 1,0% |
| `mais_uma_mudanca` | evento | 1,0% |
| `montadora_vai_fechar` | evento | 1,0% |
| `trator_aos_dez` | evento | 0,9% |
| `final_da_copa` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `carro_de_luxo_na_rua` | evento | 0,9% |
| `sucessao_coroa` | evento | 0,9% |
| `amor_paga_a_conta` | npc | 0,9% |
| `abrir_capital` | evento | 0,9% |
| `estagio_do_pai` | evento | 0,9% |
| `tentar_a_vida_na_europa` | evento | 0,9% |
| `fa_obcecado` | evento | 0,9% |
| `treinar_no_clube` | acao | 0,9% |
| `sucessao_regime` | evento | 0,9% |
| `fim_de_semana_no_sitio` | evento | 0,9% |
| `cavalo_campeao` | evento | 0,8% |
| `aluguel_caro` | evento | 0,8% |
| `peneira_do_sobrenome` | evento | 0,8% |
| `plantao_que_nao_acaba` | evento | 0,8% |
| `negocio_em_crise` | evento | 0,8% |
| `proposta_pelo_negocio` | evento | 0,7% |
| `noite_de_corridas` | evento | 0,7% |
| `transito_de_sp` | evento | 0,7% |
| `paciente_famoso` | evento | 0,7% |
| `aperto_do_mes` | evento | 0,7% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,7% |
| `crise_internacional` | evento | 0,7% |
| `shopping_lotado` | evento | 0,7% |
| `pais_envelhecem` | npc | 0,6% |
| `quebra_de_safra` | evento | 0,6% |
| `filho_apresenta_namoro` | npc | 0,6% |
| `concurso_em_brasilia` | evento | 0,6% |
| `emprego_negocios` | evento | 0,6% |
| `naturalizacao` | evento | 0,6% |
| `obra_parada` | evento | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `amor_sempre_trabalhando` | npc | 0,6% |
| `feriado_na_praia` | evento | 0,6% |
| `decreto_da_economia` | evento | 0,6% |
| `bola_autografada` | evento | 0,6% |
| `circo_vai_embora` | evento | 0,6% |
| `cargo_no_gabinete` | evento | 0,5% |
| `picadeiro` | evento | 0,5% |
| `regra_sob_medida` | evento | 0,5% |
| `carro_de_presente` | evento | 0,5% |
| `conselho_quer_ceo` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `operacao_no_gabinete` | evento | 0,5% |
| `mansao_vazia` | evento | 0,5% |
| `filho_adolescente_porta` | npc | 0,5% |
| `assumir_a_fazenda` | evento | 0,5% |
| `caso_do_poderoso` | evento | 0,5% |
| `pais_aposentados` | npc | 0,4% |
| `amor_gastador` | npc | 0,4% |
| `leilao_da_obra` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `passou_mal_de_novo` | npc | 0,4% |
| `reencontro_amigo_brigado` | evento | 0,4% |
| `turno_extra_na_fabrica` | evento | 0,4% |
| `vista_da_cobertura` | evento | 0,4% |
| `fim_carreira` | evento | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `parcela_da_tv` | npc | 0,4% |
| `filho_pede_ajuda` | npc | 0,4% |
| `etiqueta_real` | evento | 0,4% |
| `zona_franca` | evento | 0,4% |
| `safra_recorde` | evento | 0,4% |
| `ferias_coletivas` | evento | 0,4% |
| `bonus_do_banco` | evento | 0,4% |
| `casamento_real` | evento | 0,4% |
| `escandalo_do_lobby` | evento | 0,4% |
| `proposta_remota` | evento | 0,4% |
| `paparazzi_real` | evento | 0,4% |
| `amor_planilha` | npc | 0,3% |
| `royalties_secaram` | evento | 0,3% |
| `reconciliacao` | npc | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `cliente_perdeu_tudo` | evento | 0,3% |
| `general_ambicioso` | evento | 0,3% |
| `protesto_na_praca` | evento | 0,3% |
| `cade_investiga` | evento | 0,3% |
| `filho_planilha_da_velhice` | npc | 0,3% |
| `teste_por_indicacao` | evento | 0,3% |
| `amor_igreja` | npc | 0,2% |
| `amor_viaja_demais` | npc | 0,2% |
| `amor_saude_fragil` | npc | 0,2% |
| `ex_aluno` | evento | 0,2% |
| `mordomias_reais` | evento | 0,2% |
| `sucessao_na_empresa` | evento | 0,2% |
| `clientes_em_panico` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `tribunal_internacional` | evento | 0,2% |
| `conselho_dos_generais` | evento | 0,2% |
| `giz_do_proprio_bolso` | evento | 0,2% |
| `cobrir_a_tatuagem` | evento | 0,2% |
| `bolsa_na_faculdade` | evento | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `assinatura_real` | evento | 0,2% |
| `conta_na_suica` | evento | 0,2% |
| `eleicao_de_fachada` | evento | 0,2% |
| `helicoptero_no_teto` | evento | 0,2% |
| `mensalidade_da_escola` | npc | 0,1% |
| `cliente_duvidoso` | evento | 0,1% |
| `caramelo_envelhece` | npc | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `queda_do_cargo` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `escola_militar` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `jatinho_para_onde` | evento | 0,1% |
| `cliente_preso` | evento | 0,1% |
| `ilha_particular` | evento | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `renegociar_cartao` | acao | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `vida_depois_da_coroa` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `filho_distante` | npc | 0,1% |
| `filho_foi_embora` | npc | 0,1% |
| `dono_do_clube` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `filho_hamburgueria` | npc | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `amigo_lembra_zoeira` | npc | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `o_bicho_herdeiro` | evento | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 146 · **mudaram algo em pelo menos uma vida:** 146
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,7 · p10 50 · p25 58 · mediana 70 · p75 85 · p90 96

```
até 19                                        0,1%
20–29                                         0,1%
30–39          █                              0,8%
40–49          ████████████                   7,7%
50–59          ██████████████████████████████ 19,8%
60–69          ██████████████████████████████ 19,8%
70–79          ████████████████████████████   18,5%
80–89          ██████████████████████         14,2%
90–99          ████████████████████           13,3%
100+           █████████                      5,7%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 296 mil · p25 R$ 878 mil · mediana R$ 3,7 milhões · p75 R$ 32 milhões · p90 R$ 139 milhões

```
negativo       █                              0,9%
até 10 mil                                    0,2%
10–50 mil      █                              0,8%
50–200 mil     ███                            4,9%
200 mil–1 mi   ██████████████                 21,0%
1–5 mi         █████████████████              25,8%
5 mi+          ██████████████████████████████ 46,4%
```

**Felicidade média ao longo da vida** — p10 63 · mediana 74 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,6%
60–69          ████████████████               24,1%
70–79          ██████████████████████████████ 44,5%
80+            █████████████████              25,4%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,0 | R$ 1,3 milhão | 70,6 | 53,4 | 158,1 | 62,1 | 100% | 61% |
| cautelosa | 92,9 🏆 | R$ 50 milhões 🏆 | 75,1 | 69,5 | 216,4 | 82,2 | 100% | 74% |
| arriscada | 52,6 | R$ 2,5 milhões | 79,0 🏆 | 44,3 | 124,2 | 63,1 | 100% | 55% |
| aleatoria | 76,2 | R$ 1,4 milhão | 71,3 | 60,7 | 135,9 | 54,8 | 100% | 59% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,8% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,6% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,3% — de um AVC, numa terça-feira sem graça
- 6,9% — de velhice, dormindo, num domingo depois do almoço
- 6,6% — numa cirurgia simples que não foi tão simples
- 6,4% — de pneumonia, depois de teimar que era só uma gripe
- 5,7% — de complicações pulmonares, entre uma tosse e outra
- 5,4% — de complicações de uma queda no banheiro

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
