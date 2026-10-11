# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 464 eventos, 84 de personagens, 86 ações, 1268 escolhas, 189 linhas, 113 cadeias de 3+ anos.

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
| Assinaturas ≥ 1,5× a linha de base | ✅ | 895 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,47 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 480 (subiu no incremento 4: três ações escolhidas por ano) | ✅ | 449,7 (base 110,8, teto 480) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 8,1% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 15,1% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ❌ | 2,9% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,33 |
| Saturação V20 ≤ 95% | ✅ | 92,6% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 895 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 40,01 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 84,5% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 58,9% (168 dinastias, média de 3,0 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ❌ | 0,82 (342 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 272 mil / R$ 348 mil / R$ 601 mil; p10 R$ 235 mil / R$ 199 mil / R$ 103 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 6,52% (p99 R$ 785 milhões, maior R$ 1,2 trilhão) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,79% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 28,0% de 60,9% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 19,4% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 92,6% |
| Assinaturas sem regressão (≥ 918) | ❌ | 895 |
| Toques por vida ≤ 480 (três ações escolhidas por ano, cada uma em dois toques) | ✅ | 449,7 |
| CPU por vida ≤ 30 ms | ❌ | 40,01 ms |

## Portões do incremento 5 (brincar de deus)

200 vidas que nascem bilionárias ou trilionárias (25 por classe e estratégia), além das sorteadas e das dinastias.

| Portão | Situação | Valor |
|---|---|---|
| Toda jogada acontece em alguma vida | ✅ | 14 de 14 |
| Quem nasce com fortuna brinca de deus: ≥ 60% das vidas fazem uma jogada | ✅ | 98,0% (8,4 jogadas por vida, 150 vidas) |
| O mundo responde: ≥ 50% das jogadas causam um acontecimento depois | ✅ | 79,0% de 1255 jogadas |

- **Jogadas mais feitas pelos robôs:** A festa do século (368), Patrocinar o Carnaval (294), Pix para a cidade inteira (150), Uma estátua sua (103), Uma fundação com seu nome (58), Bancar um presidente (56), Pagar a cura de uma doença (51), Trazer a Copa do Mundo (45), Um programa espacial (39), Fundar uma cidade (32), Fundar um país (21), Comprar a estatal (19), Uma colônia em Marte (13), Salvar o país da crise (6).
- **Mortes numa jogada (a caminho da Lua ou de Marte):** 0 de 200 vidas.

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 62,4% / 92,6% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 69,5% |
| Efeito da memória (aleatória, V5 sem → com memória) | 66,3% → 59,5% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 895 (591) |
| Mobilidade: mesmo quintil da origem ao fim | 26,5% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 15,1% / 2,9% |
| Patrimônio p90/p10 | 385,0× (p10 R$ 301 mil, p90 R$ 116 milhões) |
| Desvio-padrão da felicidade média da vida | 8,47 |
| Vidas com patrimônio negativo ao morrer | 0,8% |
| Mudanças de estado causadas pelo jogador | 44,4% |
| Toques por vida | 449,7 |
| Tempo de CPU por vida | 40,01 ms |
| Ações (fichas usadas) por vida | 158,2 |
| Mortes na família por vida | 3,8 |
| Pontos de virada que vêm do mundo (não do jogador) | 8,1% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 23,7 |
| Vidas que terminam com filho ou filha para continuar | 84,5% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,0 / 58,9% / 23,2% |
| Idade de quem herda ao começar (mediana) / herança mediana | 35 anos / R$ 8,7 milhões |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,82 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 60,9% |
| Entre quem abriu: quebrou / vendeu | 28,0% / 28,1% |
| Quem nasce sem fortuna (classes 0 a 3, 7069 vidas): mediana / p90 / p99 / maior | R$ 2,1 milhões / R$ 63 milhões / R$ 785 milhões / R$ 1,2 trilhão |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 30,13% / 6,52% / 0,79% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 19,4% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 56,9 / 158,2 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 235 mil | R$ 272 mil | R$ 322 mil |
| moderado | R$ 199 mil | R$ 348 mil | R$ 549 mil |
| arrojado | R$ 103 mil | R$ 601 mil | R$ 2 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 808 | R$ 142 mil | R$ 1,4 milhão | R$ 30 milhões |
| moderado | 990 | R$ 161 mil | R$ 1,4 milhão | R$ 25 milhões |
| arrojado | 702 | R$ 193 mil | R$ 1,7 milhão | R$ 40 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 73,2 | R$ 2,1 milhões | 75,2 |
| pobre | 104 | 70,0 | R$ 1,3 milhão | 74,7 |
| remediada | 24 | 73,7 | R$ 2,1 milhões | 77,0 |
| media | 64 | 70,8 | R$ 2,2 milhões | 73,9 |
| rica | 64 | 73,8 | R$ 6,8 milhões | 76,6 |
| muito rica | 144 | 72,0 | R$ 33 milhões | 76,2 |
| bilionaria | 204 | 70,8 | R$ 3,1 bilhões | 77,4 |
| trilionaria | 124 | 71,0 | R$ 793 bilhões | 78,3 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 20% / 12% / 3% |
| Notícias do país por vida | 13,1 |
| Demissões por vida / vindas de uma recessão ou crise | 0,60 / 34,6% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 28 |
| Setor do último trabalho | serviço público 53% · serviços 14% · saúde 12% · cultura e internet 5% · comércio 5% · transporte e entregas 4% · construção 2% · agro 1% · tecnologia 1% · indústria 1% · sem setor 1% · finanças 0% · educação 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 25% | 40% | 53% | 62% | 82% | 88% | 93% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 30% | 22% | 17% | 15% | 15% |
| Q2 | 28% | 22% | 17% | 17% | 15% |
| Q3 | 25% | 24% | 18% | 19% | 15% |
| Q4 | 14% | 24% | 28% | 21% | 14% |
| Q5 | 3% | 8% | 19% | 28% | 41% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 8% | 71,2 | R$ 1,6 milhão | 73,7 |
| família pobre | 24% | 71,2 | R$ 1,8 milhão | 73,9 |
| família remediada | 20% | 72,4 | R$ 2 milhão | 73,9 |
| classe média | 18% | 71,5 | R$ 2,7 milhões | 73,7 |
| família rica | 13% | 71,4 | R$ 5,1 milhões | 73,8 |
| família muito rica | 13% | 71,1 | R$ 24 milhões | 75,0 |
| família bilionária | 3% | 69,1 | R$ 2,6 bilhões | 76,7 |

## Repetição

- **Dentro de uma vida:** 7,9% das aparições repetem uma instância já vista na mesma vida; pior vida: 30,0%.
- **Texto repetido entre vidas:** 35,3% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,1 · `aposentadoria` 1,6 · `avo_mesada_escondida#avo` 0,4 · `demissao` 0,3 · `bilhete_carinhoso#mae` 0,2 · `bilhete_carinhoso#pai` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `cliente_preso`, `inquilino_sumiu`, `multa_e_batida`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 105 de 519 storylets — `esporte_depois_da_aula`, `vape_festa`, `apagao_no_morro`, `briga_na_cozinha`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `rumo_a_lua`, `prefeito_da_cidade_nova`, `onu_nao_reconhece`, `greve_na_ilha`, `taxar_grandes_fortunas`, `documentario`, `convite_para_ministro`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`, `eleicao_de_fachada`, `teste_por_indicacao`, `acusado_de_nepotismo`, `plantao_que_nao_acaba`, `paciente_famoso`, `cliente_preso`, `caso_do_poderoso`, `ocorrencia_perigosa`, `deploy_de_sexta`, `pane_no_voo`, `critico_no_salao`, `noite_de_corridas`, `dono_do_clube`, `enchente_na_cidade`, `operacao_policial`, `presidir_cpi`, `queda_do_cargo`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`, `passou_mal_de_novo`, `parcela_da_tv`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_pede_ajuda`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `renegociar_cartao`, `carro_de_presente`, `cofrinho_cheio`, `vestibular_preparado`, `reencontro_amigo_brigado`, `bolsa_na_faculdade`, `zona_franca`, `emprego_engenharia`, `emprego_artes`, `ex_aluno`, `proposta_remota`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `clientes_em_panico`, `cursinho_paga_bem`, `ferias_coletivas`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `fundacao`, `trazer_a_copa`, `cura_de_doenca`, `programa_espacial`, `noite_da_apuracao`, `os_dois_lados`, `a_copa_chegou`, `resultado_da_pesquisa`, `lancamento`, `fundacao_premio`, `desvio_na_fundacao`, `ex_aluna_da_fundacao`, `hospital_da_fundacao`, `floresta_invadida`, `cozinha_da_fundacao`, `favor_do_presidente`, `cpi_da_campanha`, `elefante_branco`, `patente_da_cura`, `nova_tentativa_da_pesquisa`, `asteroide_com_seu_nome`, `receita_no_seu_pe`, `segundo_foguete`, `taxar_grandes_fortunas`, `sequestro_frustrado`, `documentario`, `rival_bilionario`, `convite_para_ministro`, `herdeiros_de_olho`, `rua_com_seu_nome`, `acionistas_furiosos`, `capa_de_revista`, `cobrir_a_tatuagem`, `filho_quer_curso_caro`, `sucessao_na_empresa`, `etiqueta_real`, `paparazzi_real`, `casamento_real`, `assinatura_real`, `mordomias_reais`, `jubileu`, `conta_na_suica`, `protesto_na_praca`, `general_ambicioso`, `eleicao_de_fachada`, `teste_por_indicacao`, `operacao_no_gabinete`, `escola_militar`, `anos_depois_do_poder`, `tribunal_internacional`, `conselho_dos_generais`, `acusado_de_nepotismo`, `vida_depois_da_coroa`, `cliente_duvidoso`, `cliente_preso`, `caso_do_poderoso`, `aluno_impossivel`, `cliente_perdeu_tudo`, `vista_da_cobertura`, `mansao_vazia`, `safra_ou_geada`, `ilha_particular`, `helicoptero_no_teto`, `festa_no_iate`, `jatinho_para_onde`, `leilao_da_obra`, `crise_internacional`, `queda_do_cargo`, `regra_sob_medida`, `escandalo_do_lobby`, `cade_investiga`, `jornal_e_o_aliado`, `o_bicho_herdeiro`
- **Apresentados por vida:** 56,9 · **com causa anterior (cadeia):** 65,3 · **maior distância causa→consequência:** 48,9 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeira_palavra` | evento | 100,0% |
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 98,9% |
| `luto` | npc | 98,1% |
| `enem` | evento | 94,3% |
| `trabalho_grande` | acao | 74,8% |
| `bico_adulto` | acao | 70,3% |
| `visitar_familia` | acao | 68,9% |
| `cuidar_da_doenca` | npc | 65,1% |
| `parquinho` | acao | 63,0% |
| `aposentadoria` | evento | 59,2% |
| `ler_gibi` | acao | 58,5% |
| `formatura` | evento | 57,6% |
| `almoco_domingo` | acao | 55,2% |
| `tocar_empresa` | acao | 53,0% |
| `ligar_amigo` | acao | 52,1% |
| `avo_mesada_escondida` | npc | 50,0% |
| `curso_online` | acao | 49,9% |
| `mochilao` | acao | 49,8% |
| `pos_graduacao` | acao | 48,8% |
| `estudar_enem` | acao | 47,7% |
| `correr` | acao | 47,7% |
| `demissao` | evento | 46,2% |
| `perdeu_emprego_na_crise` | npc | 45,4% |
| `estudar_concurso` | acao | 45,0% |
| `primeiro_investimento` | evento | 45,0% |
| `baile_terceira_idade` | acao | 44,1% |
| `paquerar` | acao | 42,2% |
| `doente_crianca` | npc | 42,0% |
| `creche_ou_vo` | evento | 40,9% |
| `primeiro_emprego` | evento | 40,8% |
| `cuidar_de_doente` | acao | 39,4% |
| `copa_do_mundo` | evento | 39,3% |
| `amigo_em_apuros` | npc | 39,1% |
| `estudar_escola` | acao | 38,5% |
| `perguntar_porque` | acao | 38,3% |
| `academia` | acao | 38,0% |
| `ler_livros` | acao | 37,9% |
| `viagem_dos_sonhos` | evento | 37,1% |
| `investir_tesouro` | acao | 36,3% |
| `primeiro_beijo` | evento | 35,4% |
| `colesterol_alto` | evento | 34,0% |
| `casamento` | npc | 34,0% |
| `golpe_pix` | evento | 32,9% |
| `amigo_pede_dinheiro` | evento | 32,7% |
| `carro` | evento | 32,2% |
| `bullying_recreio` | evento | 31,9% |
| `caminhada` | acao | 31,8% |
| `bet` | evento | 31,7% |
| `oportunidade_de_negocio` | evento | 31,4% |
| `pelada_de_quinta` | evento | 31,3% |
| `festa_80` | evento | 31,1% |
| `banda_garagem` | evento | 31,0% |
| `doar_sangue` | evento | 31,0% |
| `videogame_do_amigo` | acao | 30,9% |
| `vape_festa` | evento | 30,6% |
| `estudar_tabuada` | acao | 30,1% |
| `filho_adolescente` | evento | 29,9% |
| `viagem_realizada` | evento | 29,8% |
| `filho` | npc | 29,7% |
| `cachorro_caramelo` | evento | 29,6% |
| `investimento_furado` | evento | 29,5% |
| `criptomoeda` | evento | 29,4% |
| `festa_tema` | evento | 29,3% |
| `natacao_no_clube` | acao | 29,1% |
| `largar_tudo` | evento | 28,6% |
| `sair_de_casa` | evento | 28,3% |
| `amigo_devolve` | npc | 28,0% |
| `juros_compostos` | evento | 27,9% |
| `estudar_faculdade` | acao | 27,9% |
| `ajudar_em_casa` | acao | 27,9% |
| `hidro_com_a_turma` | acao | 27,8% |
| `bilhete_carinhoso` | npc | 27,7% |
| `primeiro_celular` | evento | 27,5% |
| `tatuagem` | evento | 27,2% |
| `festa_junina` | evento | 27,0% |
| `bolao_do_trabalho` | evento | 26,9% |
| `previdencia` | acao | 26,8% |
| `piada_no_grupo` | npc | 26,7% |
| `pelada` | acao | 26,4% |
| `casa_dos_pais` | evento | 26,3% |
| `vaquinha_do_vizinho` | evento | 26,3% |
| `esporte_depois_da_aula` | evento | 26,2% |
| `check_up` | acao | 25,6% |
| `pensar_em_adotar` | evento | 25,5% |
| `curso_nota_alta` | evento | 25,4% |
| `rebalancear` | acao | 25,2% |
| `perdeu_aniversario` | npc | 24,9% |
| `bateu_o_carro` | evento | 24,8% |
| `guardar_dinheiro` | acao | 24,6% |
| `heranca_do_tio` | evento | 24,5% |
| `show_no_estadio` | acao | 24,4% |
| `hobby_horta` | evento | 24,1% |
| `casa_propria` | evento | 24,1% |
| `voltar_a_estudar` | acao | 24,1% |
| `catapora` | evento | 23,8% |
| `proposta_na_expansao` | evento | 23,8% |
| `tempo_com_amor` | acao | 23,7% |
| `reforma_da_casa` | evento | 23,7% |
| `avo_conta_historias` | npc | 23,7% |
| `vizinho_barulhento` | evento | 23,7% |
| `reencontro_da_turma` | evento | 23,5% |
| `desempregado` | evento | 23,3% |
| `subir_de_padrao` | evento | 23,1% |
| `bico_adolescente` | acao | 22,9% |
| `hora_extra` | acao | 22,9% |
| `emprego_saude` | evento | 22,7% |
| `moeda_digital` | evento | 22,5% |
| `cortar_gastos` | acao | 22,5% |
| `pede_ajuda` | npc | 22,4% |
| `assalto_na_rua` | evento | 22,3% |
| `filho_formatura` | evento | 22,2% |
| `festa_da_cidade` | acao | 21,8% |
| `franquia` | evento | 21,7% |
| `cursinho_pago` | acao | 21,5% |
| `mesada` | evento | 21,4% |
| `feira_ciencias` | evento | 21,4% |
| `encontro` | acao | 20,8% |
| `investimento_rotina` | evento | 20,6% |
| `cozinhar_com_a_avo` | acao | 20,6% |
| `futebol_de_varzea` | acao | 20,4% |
| `cirurgia_de_catarata` | evento | 20,3% |
| `baile_da_terceira_idade` | evento | 20,0% |
| `festa_sem_pais` | evento | 20,0% |
| `corte_de_salario` | evento | 19,9% |
| `bloco_de_carnaval` | evento | 19,8% |
| `voltar_estudar` | evento | 19,8% |
| `fazenda_a_venda` | evento | 19,6% |
| `festa_de_sao_joao` | evento | 19,5% |
| `mudar_para_a_praia` | evento | 19,4% |
| `escrever_memorias` | evento | 19,3% |
| `carteira_da_diarista` | evento | 19,3% |
| `hidroginastica` | evento | 19,1% |
| `multa_e_batida` | evento | 18,9% |
| `convite_para_palestrar` | evento | 18,7% |
| `golpe_do_falso_neto` | evento | 18,6% |
| `vender_doce` | acao | 18,5% |
| `alugueis_dos_fundos` | evento | 18,4% |
| `ceu_de_fumaca` | evento | 18,4% |
| `juros_altos` | evento | 18,3% |
| `cripto_fomo` | evento | 18,2% |
| `entregas` | acao | 17,9% |
| `pai_ausente_volta` | npc | 17,9% |
| `testamento` | evento | 17,7% |
| `cartao_credito` | evento | 17,6% |
| `compra_por_impulso` | evento | 17,3% |
| `promocao` | evento | 17,2% |
| `entregador_chuva` | evento | 17,1% |
| `maratona` | evento | 16,7% |
| `queda` | evento | 16,7% |
| `convite_do_luxo` | evento | 16,6% |
| `reencontro_amigo` | evento | 16,4% |
| `empresa_quebrou` | evento | 16,3% |
| `sovina_ou_sabio` | evento | 16,3% |
| `curso_nota_media` | evento | 15,6% |
| `concorrente_gigante` | evento | 15,5% |
| `ingles_crianca` | acao | 15,3% |
| `socio_sumiu` | evento | 15,2% |
| `aula_de_musica` | evento | 15,0% |
| `brincar_com_irmao_avo` | acao | 15,0% |
| `casa_na_praia` | evento | 15,0% |
| `produto_viralizou` | evento | 14,9% |
| `esporte_escola` | acao | 14,6% |
| `greve_dos_onibus` | evento | 14,5% |
| `peneira` | evento | 14,5% |
| `reuniao_de_condominio` | evento | 14,4% |
| `consorcio` | evento | 14,4% |
| `parar_de_fumar` | acao | 14,3% |
| `casamento_na_igreja` | npc | 14,3% |
| `briga_em_casa` | npc | 14,2% |
| `alavancagem` | evento | 14,2% |
| `aniversario_da_infancia` | evento | 14,1% |
| `quarto_dividido` | evento | 14,1% |
| `imovel_valorizou` | evento | 13,7% |
| `feira_de_ciencias` | evento | 13,7% |
| `investidor_anjo` | evento | 13,4% |
| `crise_40` | evento | 13,4% |
| `casa_cheia` | evento | 13,4% |
| `fundo_da_familia` | npc | 13,4% |
| `separacao` | evento | 13,4% |
| `apartamento_na_planta` | evento | 13,4% |
| `chefe_novo` | evento | 13,3% |
| `bolsa_de_estudos` | evento | 13,3% |
| `retiro_da_igreja` | evento | 13,1% |
| `bolsa_subiu_sem_voce` | evento | 13,0% |
| `balcao_negocio` | acao | 12,8% |
| `padrao_de_vida` | evento | 12,6% |
| `cripto_disparou` | evento | 12,5% |
| `inquilino_sumiu` | evento | 12,4% |
| `ressaca_do_mar` | evento | 12,3% |
| `vicio_aposta` | evento | 12,3% |
| `separacao_dos_pais` | evento | 12,3% |
| `inquilino_dos_sonhos` | evento | 12,2% |
| `atendimento_robo` | evento | 12,1% |
| `ponto_comercial` | evento | 12,1% |
| `role` | acao | 12,1% |
| `festa_surpresa` | evento | 12,0% |
| `noite_de_stand_up` | evento | 11,9% |
| `faculdade_vida` | evento | 11,9% |
| `edital_de_cultura` | evento | 11,9% |
| `recomecar_amor` | acao | 11,7% |
| `brincar_na_rua` | acao | 11,7% |
| `concurso_lotado` | evento | 11,6% |
| `titulo_eleitor` | evento | 11,4% |
| `surpresa_do_amor` | npc | 11,4% |
| `aposentadoria_ativa` | evento | 11,3% |
| `mudanca_de_escola` | evento | 11,3% |
| `praia` | acao | 11,3% |
| `cheia_do_rio` | evento | 11,2% |
| `olimpiada_matematica` | evento | 11,0% |
| `dente_de_leite` | evento | 11,0% |
| `gerente_do_banco` | evento | 11,0% |
| `cofrinho` | acao | 11,0% |
| `seca_no_sertao` | evento | 11,0% |
| `festival_do_boi` | evento | 10,9% |
| `sao_joao` | acao | 10,7% |
| `cidadania_italiana` | evento | 10,7% |
| `pressao_alta` | evento | 10,7% |
| `dolar_disparou` | evento | 10,7% |
| `piramide_no_grupo` | npc | 10,5% |
| `herdeiro_gastao` | evento | 10,3% |
| `geada_no_sul` | evento | 10,3% |
| `apagao_no_morro` | evento | 10,3% |
| `assembleia_do_predio` | evento | 10,2% |
| `festa_surpresa_para` | npc | 10,2% |
| `fugir_inflacao` | acao | 10,1% |
| `fiscalizacao` | evento | 9,8% |
| `mei_negocio` | evento | 9,7% |
| `negocio_no_aperto` | evento | 9,7% |
| `conteudo_extra` | acao | 9,6% |
| `pousada_na_praia` | evento | 9,6% |
| `festa_de_15` | evento | 9,3% |
| `brincar_amigos` | acao | 9,3% |
| `propina_da_empreiteira` | evento | 9,2% |
| `chimarrao` | acao | 9,2% |
| `amor_proposta_fora` | npc | 9,0% |
| `show_no_bar` | evento | 9,0% |
| `bolsa_derreteu` | evento | 8,9% |
| `filho_desenho` | npc | 8,9% |
| `doenca_de_quem_ama` | evento | 8,8% |
| `geladeira_vazia` | evento | 8,7% |
| `moto_na_chuva` | evento | 8,5% |
| `boi_bumba` | acao | 8,3% |
| `pescaria_no_pantanal` | evento | 8,3% |
| `amor_piada_interna` | npc | 8,3% |
| `plantao_lotado` | evento | 8,3% |
| `adocao_chegou` | evento | 8,3% |
| `enchente_na_rua` | evento | 8,3% |
| `proposta_de_compra` | evento | 8,3% |
| `cripto_de_novo` | acao | 8,2% |
| `family_office` | evento | 8,2% |
| `mutirao_da_laje` | evento | 8,1% |
| `merenda` | evento | 8,0% |
| `netos` | evento | 8,0% |
| `cripto_derreteu` | evento | 8,0% |
| `vereador` | evento | 7,9% |
| `operacao_policial` | evento | 7,9% |
| `vo_partiu` | npc | 7,8% |
| `pular_corda` | acao | 7,8% |
| `burnout_empresa` | evento | 7,7% |
| `vo_receita` | evento | 7,7% |
| `bico_na_expansao` | evento | 7,6% |
| `promessa_da_mae` | evento | 7,5% |
| `ano_de_prejuizo` | evento | 7,4% |
| `crise_de_ansiedade` | evento | 7,4% |
| `natal_com_politica` | evento | 7,4% |
| `figurinha_repetida` | acao | 7,3% |
| `greve_do_servidor` | evento | 7,2% |
| `grupo_de_jovens` | evento | 7,2% |
| `briga_dos_pais` | evento | 7,2% |
| `soltar_pipa` | acao | 7,1% |
| `comecar_terapia` | evento | 7,1% |
| `tempo_com_filho` | acao | 7,1% |
| `compativel_para_medula` | evento | 7,1% |
| `votacao_polemica` | evento | 7,1% |
| `tarifa_do_app` | evento | 7,0% |
| `pais_na_crise` | npc | 7,0% |
| `joelho_da_pelada` | evento | 7,0% |
| `namorar_depois_dos_60` | evento | 6,9% |
| `vender_doce_nato` | acao | 6,9% |
| `chaves_do_apartamento` | evento | 6,8% |
| `estatua` | jogada | 6,8% |
| `amigo_muda_de_cidade` | npc | 6,7% |
| `blindar_contas` | acao | 6,7% |
| `processo_trabalhista` | evento | 6,7% |
| `viralizou` | evento | 6,6% |
| `pais_separados_natal` | evento | 6,6% |
| `primeiro_funcionario` | evento | 6,6% |
| `fiador` | npc | 6,6% |
| `tocar_no_bar` | acao | 6,4% |
| `olimpiada` | acao | 6,4% |
| `emprestimo_ao_irmao` | evento | 6,3% |
| `festival_lotado` | evento | 6,3% |
| `aprovado_concurso_estudo` | evento | 6,2% |
| `filho_imitacao` | npc | 6,1% |
| `convite_do_partido` | evento | 6,0% |
| `funcionario_genial` | evento | 6,0% |
| `briga_na_cozinha` | evento | 6,0% |
| `paquerar_timido` | acao | 5,9% |
| `depois_do_cargo` | evento | 5,8% |
| `confeitaria_da_vo` | evento | 5,8% |
| `assumir_negocio` | evento | 5,8% |
| `obra_grande_no_norte` | evento | 5,7% |
| `luto_do_bicho` | npc | 5,7% |
| `mae_quer_morar_junto` | npc | 5,7% |
| `cachoeira` | acao | 5,6% |
| `imposto_sobre_fortunas` | evento | 5,6% |
| `tosse_cronica` | evento | 5,5% |
| `intercambio_pago` | evento | 5,5% |
| `nome_sujo` | evento | 5,5% |
| `cobranca_de_notas` | npc | 5,4% |
| `estatua_pichada` | evento | 5,4% |
| `vaga_na_capital` | evento | 5,4% |
| `heranca` | evento | 5,4% |
| `ainda_mora_com_pais` | evento | 5,3% |
| `bater_o_pe_com_o_chefe` | evento | 5,3% |
| `tentar_outra_cidade` | evento | 5,3% |
| `fundacao_com_seu_nome` | evento | 5,2% |
| `volta_terra` | evento | 5,2% |
| `alguem_especial` | evento | 5,1% |
| `sociedade_amigo` | evento | 5,1% |
| `este_e_o_ano` | evento | 5,0% |
| `casamento_do_filho` | evento | 5,0% |
| `festa_do_seculo` | jogada | 5,0% |
| `amor_quer_mudar_de_carreira` | npc | 4,9% |
| `curso_nota_baixa` | evento | 4,9% |
| `agro_na_cidade` | evento | 4,9% |
| `convite_para_candidatura` | evento | 4,9% |
| `carona_de_madrugada` | npc | 4,9% |
| `proposta_sao_paulo` | evento | 4,8% |
| `cursinho_comunitario` | evento | 4,8% |
| `festa_vazou` | evento | 4,8% |
| `joias_no_cofre` | evento | 4,8% |
| `clientes_sumiram` | evento | 4,7% |
| `convite_igreja` | npc | 4,6% |
| `amigo_sumiu_e_voltou` | npc | 4,6% |
| `shows_cancelados` | evento | 4,6% |
| `obra_ou_hospital` | evento | 4,5% |
| `plano_de_saude_subiu` | evento | 4,5% |
| `obra_do_predio` | evento | 4,5% |
| `netos_nas_ferias` | evento | 4,5% |
| `pescaria_no_rio` | evento | 4,5% |
| `balcao_da_familia` | evento | 4,5% |
| `enchente_na_cidade` | evento | 4,5% |
| `clinica_particular_contrata` | evento | 4,4% |
| `carregar_a_geladeira` | evento | 4,4% |
| `apresentacao_para_a_diretoria` | evento | 4,3% |
| `recaida_cigarro` | evento | 4,3% |
| `trabalho_do_pai` | acao | 4,3% |
| `balcao_de_crianca` | evento | 4,3% |
| `depois_da_venda` | evento | 4,1% |
| `faculdade_depois_dos_60` | npc | 4,1% |
| `imovel_na_baixa` | evento | 4,0% |
| `crise_no_setor` | evento | 4,0% |
| `aposentadoria_nao_da` | npc | 3,9% |
| `escola_de_samba` | jogada | 3,9% |
| `rodada_grande` | evento | 3,8% |
| `programa_de_moradia` | evento | 3,7% |
| `black_friday` | evento | 3,7% |
| `hospital_sem_insumo` | evento | 3,7% |
| `cidadania_do_bisavo` | evento | 3,7% |
| `ferias_com_a_familia_do_amor` | npc | 3,7% |
| `convite_para_o_palco_grande` | evento | 3,6% |
| `filho_cuida` | npc | 3,5% |
| `arrojado_na_queda` | evento | 3,5% |
| `prova_concurso` | evento | 3,5% |
| `reencontro_paixao` | evento | 3,5% |
| `reajuste_dos_servidores` | evento | 3,5% |
| `ajudar_na_roca` | acao | 3,4% |
| `briga_por_heranca` | evento | 3,3% |
| `visitar_de_longe` | acao | 3,2% |
| `gravidez_surpresa` | npc | 3,1% |
| `vender_picole` | acao | 3,1% |
| `renegociar_divida` | evento | 3,1% |
| `aposentado_quer_ajudar_na_empresa` | npc | 3,0% |
| `vida_depois_da_condenacao` | evento | 3,0% |
| `expandir_na_alta` | evento | 3,0% |
| `dizimo` | evento | 3,0% |
| `filho_quer_carro` | evento | 3,0% |
| `cancelado` | evento | 2,8% |
| `gorjeta_boa` | evento | 2,8% |
| `presidir_cpi` | evento | 2,7% |
| `emprestimo_de_volta` | evento | 2,7% |
| `padrao_aperta` | evento | 2,7% |
| `cuidar_netos` | acao | 2,7% |
| `cara_de_comercial` | evento | 2,6% |
| `frete_sumiu` | evento | 2,6% |
| `lembranca_primeiro_amor` | evento | 2,6% |
| `filho_saude_fragil` | npc | 2,6% |
| `emprego_tecnologia` | evento | 2,6% |
| `lesao_grave` | evento | 2,6% |
| `fim_do_amor` | npc | 2,6% |
| `terapia` | acao | 2,6% |
| `pai_namorando_de_novo` | npc | 2,5% |
| `segredo_de_familia` | npc | 2,4% |
| `ajudar_na_coleta` | evento | 2,4% |
| `bodas_de_prata` | evento | 2,4% |
| `seguranca_particular` | evento | 2,4% |
| `paparazzi` | evento | 2,4% |
| `ocorrencia_perigosa` | evento | 2,3% |
| `salario_parcelado` | evento | 2,3% |
| `amigo_ficou_rico` | npc | 2,3% |
| `segundo_carro` | evento | 2,2% |
| `sair_de_casa_cedo` | evento | 2,2% |
| `carreira_futebol` | evento | 2,2% |
| `time_a_venda` | evento | 2,2% |
| `missa_em_familia` | acao | 2,2% |
| `happy_hour` | acao | 2,2% |
| `familia_descobre_o_testamento` | evento | 2,1% |
| `filho_primeiro_salario` | npc | 2,1% |
| `dez_anos_de_empresa` | evento | 2,1% |
| `passear_pet` | acao | 1,9% |
| `burnout` | evento | 1,9% |
| `amor_quadro_de_tarefas` | npc | 1,9% |
| `promocao_em_outra_cidade` | evento | 1,9% |
| `proposta_da_europa` | evento | 1,9% |
| `hit_viral` | evento | 1,9% |
| `retirada_demais` | evento | 1,9% |
| `oferece_ajuda` | npc | 1,8% |
| `filho_passou_longe` | npc | 1,8% |
| `pane_no_voo` | evento | 1,8% |
| `contrato_publicitario` | evento | 1,8% |
| `apartamento_de_presente` | evento | 1,7% |
| `critico_no_salao` | evento | 1,7% |
| `rebaixamento` | evento | 1,6% |
| `tocar_o_negocio` | acao | 1,6% |
| `reforma_sem_fim` | evento | 1,6% |
| `mestrado_fora` | evento | 1,6% |
| `foto_de_campanha` | evento | 1,5% |
| `intercambio` | evento | 1,5% |
| `briga_de_casal` | npc | 1,5% |
| `lista_dos_mais_ricos` | evento | 1,5% |
| `deploy_de_sexta` | evento | 1,5% |
| `doar_em_vida` | evento | 1,5% |
| `proposta_em_dolar` | evento | 1,5% |
| `acoes_da_startup` | evento | 1,5% |
| `chefe_amigo` | evento | 1,5% |
| `papel_da_vida` | evento | 1,5% |
| `livro_viralizou` | evento | 1,5% |
| `turne_nacional` | evento | 1,4% |
| `emprego_educacao` | evento | 1,4% |
| `fila_do_emprego` | evento | 1,4% |
| `apuracao_do_carnaval` | evento | 1,4% |
| `robos_na_fabrica` | evento | 1,4% |
| `vendas_recorde` | evento | 1,3% |
| `obra_atrasada` | evento | 1,3% |
| `celular_dos_pais` | npc | 1,3% |
| `filial_fechando` | evento | 1,3% |
| `vaga_na_empresa_dele` | npc | 1,3% |
| `holding_da_familia` | evento | 1,3% |
| `safra_da_fazenda` | evento | 1,2% |
| `vaga_no_agro` | evento | 1,2% |
| `pressao_carreira` | npc | 1,2% |
| `padrinho_casamento` | npc | 1,1% |
| `nega_ajuda` | npc | 1,1% |
| `filho_briga_na_escola` | npc | 1,1% |
| `layoff_por_email` | evento | 1,1% |
| `pix_para_a_cidade` | jogada | 1,0% |
| `despejo` | evento | 1,0% |
| `preco_do_pao` | evento | 1,0% |
| `final_da_copa` | evento | 1,0% |
| `amor_paga_a_conta` | npc | 1,0% |
| `mais_uma_mudanca` | evento | 1,0% |
| `trator_aos_dez` | evento | 0,9% |
| `tentar_a_vida_na_europa` | evento | 0,9% |
| `montadora_vai_fechar` | evento | 0,9% |
| `pedreiro_vale_ouro` | evento | 0,9% |
| `tradutor_da_familia` | evento | 0,9% |
| `estagio_do_pai` | evento | 0,9% |
| `fim_de_semana_no_sitio` | evento | 0,9% |
| `proposta_pelo_negocio` | evento | 0,9% |
| `set_de_gravacao` | evento | 0,9% |
| `carro_de_luxo_na_rua` | evento | 0,9% |
| `transito_de_sp` | evento | 0,8% |
| `sucessao_coroa` | evento | 0,8% |
| `treinar_no_clube` | acao | 0,8% |
| `fa_obcecado` | evento | 0,8% |
| `abrir_capital` | evento | 0,8% |
| `peneira_do_sobrenome` | evento | 0,8% |
| `cavalo_campeao` | evento | 0,8% |
| `aluguel_caro` | evento | 0,7% |
| `sucessao_regime` | evento | 0,7% |
| `obra_parada` | evento | 0,7% |
| `feriado_na_praia` | evento | 0,7% |
| `aperto_do_mes` | evento | 0,7% |
| `filho_quer_trabalhar_na_empresa` | npc | 0,7% |
| `noite_de_corridas` | evento | 0,7% |
| `desfile_das_campeas` | evento | 0,7% |
| `paciente_famoso` | evento | 0,7% |
| `negocio_em_crise` | evento | 0,6% |
| `plantao_que_nao_acaba` | evento | 0,6% |
| `concurso_em_brasilia` | evento | 0,6% |
| `filho_apresenta_namoro` | npc | 0,6% |
| `circo_vai_embora` | evento | 0,6% |
| `quebra_de_safra` | evento | 0,6% |
| `infancia_no_palacio` | evento | 0,6% |
| `amor_sempre_trabalhando` | npc | 0,6% |
| `bancar_presidente` | jogada | 0,6% |
| `conselho_quer_ceo` | evento | 0,6% |
| `emprego_negocios` | evento | 0,6% |
| `bola_autografada` | evento | 0,6% |
| `pais_envelhecem` | npc | 0,6% |
| `assumir_a_fazenda` | evento | 0,6% |
| `picadeiro` | evento | 0,6% |
| `estatua_derrubada` | evento | 0,5% |
| `cargo_no_gabinete` | evento | 0,5% |
| `shopping_lotado` | evento | 0,5% |
| `decreto_da_economia` | evento | 0,5% |
| `internato_real` | evento | 0,5% |
| `naturalizacao` | evento | 0,5% |
| `fundacao` | jogada | 0,5% |
| `regra_sob_medida` | evento | 0,5% |
| `turno_extra_na_fabrica` | evento | 0,5% |
| `noite_da_apuracao` | evento | 0,5% |
| `fim_carreira` | evento | 0,5% |
| `sequestro_frustrado` | evento | 0,5% |
| `crise_internacional` | evento | 0,5% |
| `favor_do_presidente` | evento | 0,4% |
| `operacao_no_gabinete` | evento | 0,4% |
| `passou_mal_de_novo` | npc | 0,4% |
| `safra_recorde` | evento | 0,4% |
| `mansao_vazia` | evento | 0,4% |
| `reencontro_amigo_brigado` | evento | 0,4% |
| `filho_quer_curso_caro` | npc | 0,4% |
| `filho_pede_ajuda` | npc | 0,4% |
| `amor_gastador` | npc | 0,4% |
| `carro_de_presente` | evento | 0,4% |
| `zona_franca` | evento | 0,4% |
| `vista_da_cobertura` | evento | 0,4% |
| `ferias_coletivas` | evento | 0,4% |
| `royalties_secaram` | evento | 0,4% |
| `caso_do_poderoso` | evento | 0,4% |
| `leilao_da_obra` | evento | 0,4% |
| `etiqueta_real` | evento | 0,4% |
| `escandalo_do_lobby` | evento | 0,4% |
| `filho_adolescente_porta` | npc | 0,4% |
| `emprego_artes` | evento | 0,4% |
| `reconciliacao` | npc | 0,4% |
| `pais_aposentados` | npc | 0,4% |
| `parcela_da_tv` | npc | 0,3% |
| `ex_aluno` | evento | 0,3% |
| `amor_planilha` | npc | 0,3% |
| `bonus_do_banco` | evento | 0,3% |
| `rival_bilionario` | evento | 0,3% |
| `teste_por_indicacao` | evento | 0,3% |
| `amor_viaja_demais` | npc | 0,3% |
| `emprego_engenharia` | evento | 0,3% |
| `amor_igreja` | npc | 0,3% |
| `proposta_remota` | evento | 0,3% |
| `paparazzi_real` | evento | 0,3% |
| `casamento_real` | evento | 0,3% |
| `cliente_perdeu_tudo` | evento | 0,3% |
| `taxar_grandes_fortunas` | evento | 0,3% |
| `amor_saude_fragil` | npc | 0,2% |
| `cozinha_da_fundacao` | evento | 0,2% |
| `aluno_impossivel` | evento | 0,2% |
| `protesto_na_praca` | evento | 0,2% |
| `cade_investiga` | evento | 0,2% |
| `filho_planilha_da_velhice` | npc | 0,2% |
| `clientes_em_panico` | evento | 0,2% |
| `cursinho_paga_bem` | evento | 0,2% |
| `queda_do_cargo` | evento | 0,2% |
| `conta_na_suica` | evento | 0,2% |
| `cliente_duvidoso` | evento | 0,2% |
| `sucessao_na_empresa` | evento | 0,2% |
| `bolsa_na_faculdade` | evento | 0,2% |
| `giz_do_proprio_bolso` | evento | 0,2% |
| `cobrir_a_tatuagem` | evento | 0,2% |
| `general_ambicioso` | evento | 0,2% |
| `vestibular_preparado` | evento | 0,2% |
| `desvio_na_fundacao` | evento | 0,2% |
| `cliente_preso` | evento | 0,2% |
| `caramelo_envelhece` | npc | 0,1% |
| `mordomias_reais` | evento | 0,1% |
| `tribunal_internacional` | evento | 0,1% |
| `conselho_dos_generais` | evento | 0,1% |
| `renegociar_cartao` | acao | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `assinatura_real` | evento | 0,1% |
| `escola_militar` | evento | 0,1% |
| `anos_depois_do_poder` | evento | 0,1% |
| `helicoptero_no_teto` | evento | 0,1% |
| `jornal_e_o_aliado` | evento | 0,1% |
| `filho_missao` | npc | 0,1% |
| `ex_aluna_da_fundacao` | evento | 0,1% |
| `capa_de_revista` | evento | 0,1% |
| `jubileu` | evento | 0,1% |
| `acusado_de_nepotismo` | evento | 0,1% |
| `festa_no_iate` | evento | 0,1% |
| `fundacao_premio` | evento | 0,1% |
| `receita_no_seu_pe` | evento | 0,1% |
| `eleicao_de_fachada` | evento | 0,1% |
| `safra_ou_geada` | evento | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `cura_de_doenca` | jogada | 0,1% |
| `os_dois_lados` | evento | 0,1% |
| `floresta_invadida` | evento | 0,1% |
| `jatinho_para_onde` | evento | 0,1% |
| `cpi_da_campanha` | evento | 0,1% |
| `amigo_lembra_zoeira` | npc | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `trazer_a_copa` | jogada | 0,1% |
| `resultado_da_pesquisa` | evento | 0,1% |
| `herdeiros_de_olho` | evento | 0,1% |
| `rua_com_seu_nome` | evento | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `filho_foi_embora` | npc | 0,0% |
| `programa_espacial` | jogada | 0,0% |
| `lancamento` | evento | 0,0% |
| `nova_tentativa_da_pesquisa` | evento | 0,0% |
| `acionistas_furiosos` | evento | 0,0% |
| `filho_distante` | npc | 0,0% |
| `cofrinho_cheio` | evento | 0,0% |
| `hospital_da_fundacao` | evento | 0,0% |
| `segundo_foguete` | evento | 0,0% |
| `vida_depois_da_coroa` | evento | 0,0% |
| `filho_hamburgueria` | npc | 0,0% |
| `a_copa_chegou` | evento | 0,0% |
| `elefante_branco` | evento | 0,0% |
| `patente_da_cura` | evento | 0,0% |
| `asteroide_com_seu_nome` | evento | 0,0% |
| `ilha_particular` | evento | 0,0% |
| `documentario` | evento | 0,0% |
| `convite_para_ministro` | evento | 0,0% |
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
| `memorial_da_missao` | evento | 0,0% |
| `mensagem_de_marte` | evento | 0,0% |
| `dono_do_clube` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 169 · **mudaram algo em pelo menos uma vida:** 169
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,4 · p10 50 · p25 57 · mediana 70 · p75 85 · p90 96

```
até 19                                        0,1%
20–29                                         0,1%
30–39          █                              0,7%
40–49          ████████████                   8,0%
50–59          ██████████████████████████████ 20,3%
60–69          █████████████████████████████  19,8%
70–79          ██████████████████████████     17,7%
80–89          ██████████████████████         14,8%
90–99          ███████████████████            13,1%
100+           ████████                       5,5%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 301 mil · p25 R$ 877 mil · mediana R$ 3,7 milhões · p75 R$ 29 milhões · p90 R$ 116 milhões

```
negativo       █                              0,8%
até 10 mil                                    0,2%
10–50 mil      █                              0,9%
50–200 mil     ███                            4,6%
200 mil–1 mi   ██████████████                 21,3%
1–5 mi         █████████████████              26,0%
5 mi+          ██████████████████████████████ 46,2%
```

**Felicidade média ao longo da vida** — p10 62 · mediana 75 · p90 85

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,4%
50–59          ████                           5,4%
60–69          ████████████████               23,9%
70–79          ██████████████████████████████ 44,8%
80+            █████████████████              25,4%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 65,0 | R$ 1,3 milhão | 70,6 | 53,4 | 157,9 | 61,8 | 100% | 61% |
| cautelosa | 92,4 🏆 | R$ 45 milhões 🏆 | 75,2 | 69,5 | 215,6 | 81,8 | 100% | 73% |
| arriscada | 52,4 | R$ 2,5 milhões | 79,1 🏆 | 44,2 | 123,6 | 63,0 | 100% | 55% |
| aleatoria | 75,9 | R$ 1,5 milhão | 71,2 | 60,6 | 135,7 | 54,4 | 100% | 59% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 12,2% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,3% — de um AVC, numa terça-feira sem graça
- 7,0% — de velhice, dormindo, num domingo depois do almoço
- 6,6% — de pneumonia, depois de teimar que era só uma gripe
- 6,5% — numa cirurgia simples que não foi tão simples
- 5,9% — de complicações pulmonares, entre uma tosse e outra
- 5,3% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
