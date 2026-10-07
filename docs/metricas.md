# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 309 eventos, 84 de personagens, 71 ações, 936 escolhas, 171 linhas, 77 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 66,3% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 938 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,48 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 200 (o teto era 1,4× a base; subiu no incremento 3 com a segunda ficha) | ✅ | 173,6 (base 110,8, teto 200) |

## Portões do incremento 2

| Portão | Situação | Valor |
|---|---|---|
| O mundo nos pontos de virada ≥ 2× (o mundo reage) | ✅ | 7,8% (base 2,9%, alvo 5,8%) |
| Do quintil mais pobre ao mais rico ≥ 1,5× | ✅ | 8,6% (base 3,0%, alvo 4,5%) |
| Do quintil mais rico ao mais pobre ≥ a linha de base (era 1,5× até o incremento 2) | ✅ | 4,0% (base 3,0%) |
| Mobilidade nem determinista nem aleatória (Spearman entre 0,3 e 0,7) | ✅ | 0,42 |
| Saturação V20 ≤ 95% | ✅ | 94,0% (base 95,9%) |
| Assinaturas sem regressão | ✅ | 938 (base 893) |
| CPU por vida ≤ 30 ms | ❌ | 31,18 ms (base 14,5 ms) |

## Portões do incremento 3

| Portão | Situação | Valor |
|---|---|---|
| Herdeiro possível em ≥ 40% das vidas (a dinastia é comum, não rara) | ✅ | 87,9% |
| Dinastias que chegam à 3ª geração ≥ 25% | ✅ | 57,7% (168 dinastias, média de 3,2 gerações) |
| A herança importa sem decidir tudo (Spearman entre gerações entre 0,3 e 0,8) | ✅ | 0,79 (362 heranças) |
| O perfil importa: em 30 anos, o arrojado rende mais na mediana e perde mais no pior caso (laboratório de R$ 100 mil) | ✅ | mediana R$ 269 mil / R$ 356 mil / R$ 626 mil; p10 R$ 235 mil / R$ 209 mil / R$ 114 mil |
| Sem teto de milhões: ≥ 0,5% de quem nasce sem fortuna passa de R$ 100 milhões | ✅ | 1,07% (p99 R$ 102 milhões, maior R$ 19 bilhões) |
| Bilionário feito existe e é raro: entre 0,02% e 1% de quem nasce sem fortuna | ✅ | 0,11% |
| Empresa tem risco de verdade: quebram entre 15% e 55% de quem abre | ✅ | 35,2% de 65,5% das vidas que abriram empresa |
| Anos adultos sem acontecimento ≤ 20% (era 30%) | ✅ | 19,7% |
| Saturação V20 sem regressão (≤ 95%) | ✅ | 94,0% |
| Assinaturas sem regressão (≥ 918) | ✅ | 938 |
| Toques por vida ≤ 200 (duas fichas dos 18 aos 40) | ✅ | 173,6 |
| CPU por vida ≤ 30 ms | ❌ | 31,18 ms |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 66,3% / 94,0% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 72,5% |
| Efeito da memória (aleatória, V5 sem → com memória) | 68,5% → 63,1% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 938 (615) |
| Mobilidade: mesmo quintil da origem ao fim | 32,7% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,42 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 8,6% / 4,0% |
| Patrimônio p90/p10 | 105,5× (p10 R$ 169 mil, p90 R$ 18 milhões) |
| Desvio-padrão da felicidade média da vida | 8,48 |
| Vidas com patrimônio negativo ao morrer | 2,1% |
| Mudanças de estado causadas pelo jogador | 38,0% |
| Toques por vida | 173,6 |
| Tempo de CPU por vida | 31,18 ms |
| Ações (fichas usadas) por vida | 87,7 |
| Mortes na família por vida | 4,0 |
| Pontos de virada que vêm do mundo (não do jogador) | 7,8% |

### Dinheiro e dinastia

| Métrica | Valor |
|---|---|
| Operações na carteira por vida (aplicar, resgatar, trocar o perfil) | 8,4 |
| Vidas que terminam com filho ou filha para continuar | 87,9% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 3,2 / 57,7% / 29,2% |
| Idade de quem herda ao começar (mediana) / herança mediana | 42 anos / R$ 1,5 milhão |
| Mobilidade entre gerações (Spearman, patrimônio de quem morreu × do herdeiro) | 0,79 |

### Empresa e riqueza

| Métrica | Valor |
|---|---|
| Vidas que abriram empresa (pela folha ou por um storylet) | 65,5% |
| Entre quem abriu: quebrou / vendeu | 35,2% / 26,3% |
| Quem nasce sem fortuna (classes 0 a 3, 7976 vidas): mediana / p90 / p99 / maior | R$ 959 mil / R$ 6,8 milhões / R$ 102 milhões / R$ 19 bilhões |
| Quem nasce sem fortuna e passa de R$ 10 milhões / R$ 100 milhões / R$ 1 bilhão | 7,31% / 1,07% / 0,11% |

### Anos com vida

| Métrica | Valor |
|---|---|
| Anos adultos (18+) sem nenhum acontecimento, só a linha curta | 19,7% |
| Storylets apresentados por vida / ações (fichas usadas) por vida | 57,9 / 87,7 |

Laboratório de perfis: R$ 100 mil por 30 anos, rebalanceados todo ano, nos mesmos 750 sorteios do país para os três perfis:

| Perfil | p10 | Mediana | p90 |
|---|---|---|---|
| conservador | R$ 235 mil | R$ 269 mil | R$ 317 mil |
| moderado | R$ 209 mil | R$ 356 mil | R$ 544 mil |
| arrojado | R$ 114 mil | R$ 626 mil | R$ 2,3 milhões |

Patrimônio ao morrer por perfil de investidor (estratégia aleatória, perfil sorteado aos 18):

| Perfil | Vidas | p10 | Mediana | p90 |
|---|---|---|---|---|
| conservador | 838 | R$ 81 mil | R$ 794 mil | R$ 15 milhões |
| moderado | 942 | R$ 118 mil | R$ 882 mil | R$ 11 milhões |
| arrojado | 720 | R$ 87 mil | R$ 1,3 milhão | R$ 22 milhões |

Origem escolhida (6 vidas por estratégia e classe, fora das métricas acima):

| Origem | Vidas | Idade média | Patrimônio mediano ao morrer | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 24 | 70,8 | R$ 1,5 milhão | 70,2 |
| pobre | 24 | 73,9 | R$ 700 mil | 71,4 |
| remediada | 24 | 70,2 | R$ 1,2 milhão | 71,1 |
| media | 24 | 74,5 | R$ 2 milhões | 71,1 |
| rica | 24 | 73,0 | R$ 2,1 milhões | 75,0 |
| muito rica | 24 | 73,8 | R$ 24 milhões | 73,4 |
| bilionaria | 24 | 73,4 | R$ 4,5 bilhões | 73,8 |
| trilionaria | 24 | 70,9 | R$ 1,7 trilhão | 73,4 |

### O mundo reage

| Métrica | Valor |
|---|---|
| Anos em cada fase do ciclo (normal / economia aquecida / recessão / crise) | 65% / 20% / 12% / 4% |
| Notícias do país por vida | 13,4 |
| Demissões por vida / vindas de uma recessão ou crise | 0,62 / 34,7% |
| Carreiras distintas (setor × jeito de trabalhar) por 1.000 vidas | 30 |
| Setor do último trabalho | serviços 31% · saúde 16% · transporte e entregas 15% · comércio 15% · serviço público 10% · tecnologia 4% · sem setor 3% · educação 2% · cultura e internet 1% · finanças 1% · agro 1% · construção 1% · indústria 0% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 27% | 44% | 58% | 66% | 85% | 91% | 94% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 32% | 23% | 21% | 15% | 9% |
| Q2 | 28% | 25% | 21% | 16% | 10% |
| Q3 | 23% | 23% | 25% | 18% | 11% |
| Q4 | 13% | 21% | 22% | 27% | 17% |
| Q5 | 4% | 8% | 10% | 24% | 54% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 10% | 72,3 | R$ 770 mil | 70,3 |
| família pobre | 24% | 72,1 | R$ 743 mil | 69,4 |
| família remediada | 26% | 72,3 | R$ 980 mil | 69,9 |
| classe média | 20% | 72,5 | R$ 1,4 milhão | 70,0 |
| família rica | 13% | 72,8 | R$ 3,7 milhões | 70,0 |
| família muito rica | 7% | 71,9 | R$ 22 milhões | 70,7 |
| família bilionária | 0% | 74,5 | R$ 3,9 bilhões | 68,1 |
| família trilionária | 0% | 74,0 | R$ 187 bilhões | 69,2 |

## Repetição

- **Dentro de uma vida:** 7,8% das aparições repetem uma instância já vista na mesma vida; pior vida: 27,4%.
- **Texto repetido entre vidas:** 34,6% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 3,1 · `aposentadoria` 0,8 · `avo_mesada_escondida#avo` 0,4 · `demissao` 0,2 · `bilhete_carinhoso#mae` 0,2 · `bilhete_carinhoso#pai` 0,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): nenhum
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 79 de 366 storylets — `esporte_depois_da_aula`, `vape_festa`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`, `curso_nota_media`, `curso_nota_baixa`, `emprego_saude`, `emprego_tecnologia`, `emprego_engenharia`, `negocio_no_aperto`, `proposta_na_expansao`, `bico_na_expansao`, `fila_do_emprego`, `plantao_lotado`, `black_friday`, `alavancagem`, `negocio_da_familia_quebra`, `emprestimo_ao_irmao`, `hospital_sem_insumo`, `giz_do_proprio_bolso`, `turno_extra_na_fabrica`, `shows_cancelados`, `clinica_particular_contrata`, `ferias_coletivas`, `padrao_aperta`, `piramide_no_grupo`, `fiador`, `fazenda_a_venda`, `cidadania_do_bisavo`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `arrojado_na_queda`, `pai_rico_filho_nobre_neto_pobre`, `holding_da_familia`, `empresa_quebrou`, `primeiro_funcionario`, `investidor_anjo`, `processo_trabalhista`, `fiscalizacao`, `expandir_na_alta`, `produto_viralizou`, `depois_da_venda`, `pelada_de_quinta`, `joelho_da_pelada`, `obra_do_predio`, `colesterol_alto`, `chefe_novo`, `compra_por_impulso`, `reforma_da_casa`, `festa_de_sao_joao`, `gravidez_surpresa`, `celular_dos_pais`, `copa_do_mundo`, `bateu_o_carro`, `aposentadoria_ativa`, `cirurgia_de_catarata`, `doar_em_vida`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`, `passou_mal_de_novo`, `reconciliacao`, `amigo_lembra_zoeira`, `pais_aposentados`, `filho_adolescente_porta`, `filho_distante`, `caramelo_envelhece`, `amor_gastador`, `amor_igreja`, `amor_planilha`, `amor_viaja_demais`, `amor_saude_fragil`, `filho_hamburgueria`, `filho_foi_embora`, `filho_missao`, `filho_planilha_da_velhice`, `role`, `treinar_no_clube`, `carro_de_presente`, `vestibular_preparado`, `bolsa_na_faculdade`, `zona_franca`, `emprego_engenharia`, `proposta_remota`, `robos_na_fabrica`, `obra_parada`, `safra_recorde`, `bonus_do_banco`, `negocio_da_familia_quebra`, `turno_extra_na_fabrica`, `clientes_em_panico`, `shows_cancelados`, `pedreiro_vale_ouro`, `quebra_de_safra`, `ferias_coletivas`, `festival_lotado`, `filho_quer_capital`, `royalties_secaram`, `mensalidade_da_escola`, `construtora_quebrou`, `seguranca_particular`, `lista_dos_mais_ricos`, `time_a_venda`, `holding_da_familia`, `abrir_capital`, `acionistas_furiosos`, `capa_de_revista`, `cobrir_a_tatuagem`, `sucessao_na_empresa`, `conselho_quer_ceo`
- **Apresentados por vida:** 57,9 · **com causa anterior (cadeia):** 46,1 · **maior distância causa→consequência:** 46,7 anos em média
- **Vidas com 3 pontos de virada no cartão:** 100,0%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeira_palavra` | evento | 100,0% |
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,4% |
| `luto` | npc | 99,1% |
| `brincar_com_irmao_avo` | acao | 95,9% |
| `enem` | evento | 94,8% |
| `visitar_familia` | acao | 73,9% |
| `ligar_amigo` | acao | 72,4% |
| `bico_adulto` | acao | 71,9% |
| `trabalho_grande` | acao | 68,2% |
| `cuidar_da_doenca` | npc | 66,3% |
| `estudar_concurso` | acao | 62,3% |
| `aposentadoria` | evento | 61,4% |
| `ler_livros` | acao | 55,5% |
| `pos_graduacao` | acao | 55,4% |
| `almoco_domingo` | acao | 54,7% |
| `formatura` | evento | 53,5% |
| `tocar_empresa` | acao | 51,8% |
| `curso_online` | acao | 50,8% |
| `demissao` | evento | 49,9% |
| `perdeu_emprego_na_crise` | npc | 49,3% |
| `avo_mesada_escondida` | npc | 49,3% |
| `primeiro_emprego` | evento | 48,8% |
| `correr` | acao | 48,5% |
| `brincar_na_rua` | acao | 48,0% |
| `academia` | acao | 47,2% |
| `primeiro_investimento` | evento | 47,0% |
| `rebalancear` | acao | 46,0% |
| `tempo_com_amor` | acao | 43,6% |
| `copa_do_mundo` | evento | 43,5% |
| `creche_ou_vo` | evento | 43,3% |
| `caminhada` | acao | 41,8% |
| `paquerar` | acao | 41,6% |
| `viagem_dos_sonhos` | evento | 41,3% |
| `desempregado` | evento | 41,3% |
| `doente_crianca` | npc | 40,9% |
| `colesterol_alto` | evento | 40,8% |
| `bullying_recreio` | evento | 40,1% |
| `festa_tema` | evento | 39,7% |
| `encontro` | acao | 39,7% |
| `carro` | evento | 39,6% |
| `amigo_em_apuros` | npc | 39,0% |
| `cachorro_caramelo` | evento | 38,7% |
| `estudar_tabuada` | acao | 38,5% |
| `festa_junina` | evento | 38,0% |
| `primeiro_beijo` | evento | 37,8% |
| `golpe_pix` | evento | 37,2% |
| `estudar_escola` | acao | 36,9% |
| `cuidar_de_doente` | acao | 36,6% |
| `casamento` | npc | 35,9% |
| `doar_sangue` | evento | 35,8% |
| `esporte_depois_da_aula` | evento | 35,5% |
| `oportunidade_de_negocio` | evento | 34,9% |
| `bet` | evento | 34,4% |
| `estudar_faculdade` | acao | 34,3% |
| `banda_garagem` | evento | 34,1% |
| `check_up` | acao | 34,0% |
| `viagem_realizada` | evento | 33,9% |
| `pelada_de_quinta` | evento | 33,8% |
| `primeiro_celular` | evento | 33,6% |
| `filho_adolescente` | evento | 33,1% |
| `fugir_inflacao` | acao | 32,9% |
| `casa_propria` | evento | 32,7% |
| `vape_festa` | evento | 32,4% |
| `criptomoeda` | evento | 32,3% |
| `investir_tesouro` | acao | 32,1% |
| `investimento_furado` | evento | 31,3% |
| `amigo_pede_dinheiro` | evento | 30,9% |
| `vaquinha_do_vizinho` | evento | 30,8% |
| `hobby_horta` | evento | 30,3% |
| `tatuagem` | evento | 30,0% |
| `sair_de_casa` | evento | 30,0% |
| `bolao_do_trabalho` | evento | 29,9% |
| `hora_extra` | acao | 29,8% |
| `filho` | npc | 29,8% |
| `cursinho_pago` | acao | 29,5% |
| `reencontro_da_turma` | evento | 29,5% |
| `casa_dos_pais` | evento | 29,3% |
| `mesada` | evento | 28,9% |
| `bilhete_carinhoso` | npc | 28,4% |
| `hidro_com_a_turma` | acao | 28,4% |
| `heranca_do_tio` | evento | 28,2% |
| `feira_ciencias` | evento | 28,1% |
| `previdencia` | acao | 28,0% |
| `pensar_em_adotar` | evento | 28,0% |
| `piada_no_grupo` | npc | 27,8% |
| `largar_tudo` | evento | 27,5% |
| `filho_formatura` | evento | 27,2% |
| `emprego_saude` | evento | 26,9% |
| `voltar_a_estudar` | acao | 26,7% |
| `juros_compostos` | evento | 26,5% |
| `festa_80` | evento | 26,4% |
| `vizinho_barulhento` | evento | 26,2% |
| `avo_conta_historias` | npc | 26,0% |
| `guardar_dinheiro` | acao | 25,7% |
| `festa_da_cidade` | acao | 25,6% |
| `promocao` | evento | 25,0% |
| `perdeu_aniversario` | npc | 25,0% |
| `pede_ajuda` | npc | 24,7% |
| `assalto_na_rua` | evento | 24,7% |
| `amigo_devolve` | npc | 24,3% |
| `moeda_digital` | evento | 24,2% |
| `voltar_estudar` | evento | 24,2% |
| `baile_da_terceira_idade` | evento | 24,2% |
| `cirurgia_de_catarata` | evento | 23,8% |
| `mudar_para_a_praia` | evento | 23,7% |
| `hidroginastica` | evento | 23,6% |
| `reencontro_amigo` | evento | 23,3% |
| `chefe_novo` | evento | 22,8% |
| `bloco_de_carnaval` | evento | 22,4% |
| `proposta_na_expansao` | evento | 21,9% |
| `festa_de_sao_joao` | evento | 21,4% |
| `curso_nota_alta` | evento | 21,3% |
| `entregador_chuva` | evento | 21,1% |
| `festa_sem_pais` | evento | 21,1% |
| `escrever_memorias` | evento | 21,0% |
| `consorcio` | evento | 20,9% |
| `cripto_fomo` | evento | 20,5% |
| `franquia` | evento | 20,2% |
| `apartamento_na_planta` | evento | 19,9% |
| `pai_ausente_volta` | npc | 19,8% |
| `quarto_dividido` | evento | 19,8% |
| `golpe_do_falso_neto` | evento | 19,7% |
| `juros_altos` | evento | 19,6% |
| `aposentadoria_ativa` | evento | 19,5% |
| `greve_dos_onibus` | evento | 19,5% |
| `ceu_de_fumaca` | evento | 19,4% |
| `cofrinho` | acao | 19,1% |
| `alugueis_dos_fundos` | evento | 19,1% |
| `convite_do_luxo` | evento | 19,1% |
| `cortar_gastos` | acao | 19,0% |
| `socio_sumiu` | evento | 19,0% |
| `brincar_amigos` | acao | 18,7% |
| `entregas` | acao | 18,6% |
| `reforma_da_casa` | evento | 18,4% |
| `cartao_credito` | evento | 18,2% |
| `corte_de_salario` | evento | 18,0% |
| `testamento` | evento | 17,9% |
| `surpresa_do_amor` | npc | 17,9% |
| `empresa_quebrou` | evento | 17,7% |
| `investimento_rotina` | evento | 17,6% |
| `casa_cheia` | evento | 17,5% |
| `concorrente_gigante` | evento | 17,3% |
| `curso_nota_media` | evento | 16,8% |
| `recomecar_amor` | acao | 16,7% |
| `atendimento_robo` | evento | 16,6% |
| `bolsa_de_estudos` | evento | 16,6% |
| `pressao_alta` | evento | 16,6% |
| `tempo_com_filho` | acao | 16,6% |
| `estudar_enem` | acao | 16,6% |
| `esporte_escola` | acao | 16,4% |
| `tarifa_do_app` | evento | 16,1% |
| `fazenda_a_venda` | evento | 16,0% |
| `separacao` | evento | 16,0% |
| `briga_em_casa` | npc | 15,6% |
| `baile_terceira_idade` | acao | 15,5% |
| `queda` | evento | 15,3% |
| `ajudar_em_casa` | acao | 15,2% |
| `crise_40` | evento | 15,0% |
| `cripto_disparou` | evento | 14,8% |
| `retiro_da_igreja` | evento | 14,7% |
| `casamento_na_igreja` | npc | 14,5% |
| `vicio_aposta` | evento | 14,2% |
| `bolsa_subiu_sem_voce` | evento | 14,0% |
| `investidor_anjo` | evento | 13,8% |
| `padrao_de_vida` | evento | 13,7% |
| `produto_viralizou` | evento | 13,6% |
| `ressaca_do_mar` | evento | 13,6% |
| `comecar_terapia` | evento | 13,5% |
| `casa_na_praia` | evento | 13,5% |
| `festa_surpresa` | evento | 13,2% |
| `convite_para_palestrar` | evento | 13,2% |
| `faculdade_vida` | evento | 13,1% |
| `separacao_dos_pais` | evento | 13,0% |
| `seca_no_sertao` | evento | 12,9% |
| `bico_na_expansao` | evento | 12,7% |
| `piramide_no_grupo` | npc | 12,7% |
| `show_no_estadio` | acao | 12,7% |
| `cidadania_italiana` | evento | 12,7% |
| `balcao_negocio` | acao | 12,6% |
| `carteira_da_diarista` | evento | 12,5% |
| `maratona` | evento | 12,4% |
| `negocio_no_aperto` | evento | 12,4% |
| `noite_de_stand_up` | evento | 12,4% |
| `alavancagem` | evento | 12,4% |
| `concurso_lotado` | evento | 12,3% |
| `festa_surpresa_para` | npc | 12,2% |
| `pelada` | acao | 12,0% |
| `doenca_de_quem_ama` | evento | 12,0% |
| `conteudo_extra` | acao | 11,9% |
| `praia` | acao | 11,9% |
| `sao_joao` | acao | 11,9% |
| `cheia_do_rio` | evento | 11,9% |
| `dolar_disparou` | evento | 11,9% |
| `titulo_eleitor` | evento | 11,9% |
| `mutirao_da_laje` | evento | 11,9% |
| `compra_por_impulso` | evento | 11,7% |
| `merenda` | evento | 11,7% |
| `bateu_o_carro` | evento | 11,7% |
| `fiscalizacao` | evento | 11,7% |
| `netos` | evento | 11,6% |
| `plantao_lotado` | evento | 11,6% |
| `geada_no_sul` | evento | 11,4% |
| `assembleia_do_predio` | evento | 11,3% |
| `festival_do_boi` | evento | 11,3% |
| `pousada_na_praia` | evento | 10,8% |
| `show_no_bar` | evento | 10,4% |
| `geladeira_vazia` | evento | 10,3% |
| `gerente_do_banco` | evento | 10,3% |
| `parar_de_fumar` | acao | 10,2% |
| `olimpiada` | acao | 10,1% |
| `vo_receita` | evento | 9,8% |
| `cripto_de_novo` | acao | 9,7% |
| `vereador` | evento | 9,7% |
| `imovel_valorizou` | evento | 9,7% |
| `ano_de_prejuizo` | evento | 9,6% |
| `aprovado_concurso_estudo` | evento | 9,6% |
| `enchente_na_rua` | evento | 9,6% |
| `olimpiada_matematica` | evento | 9,5% |
| `terapia` | acao | 9,5% |
| `pescaria_no_pantanal` | evento | 9,3% |
| `amor_proposta_fora` | npc | 9,3% |
| `tosse_cronica` | evento | 9,3% |
| `filho_desenho` | npc | 9,0% |
| `bolsa_derreteu` | evento | 8,9% |
| `festa_de_15` | evento | 8,8% |
| `amor_piada_interna` | npc | 8,8% |
| `tentar_outra_cidade` | evento | 8,8% |
| `vaga_na_capital` | evento | 8,7% |
| `compativel_para_medula` | evento | 8,7% |
| `namorar_depois_dos_60` | evento | 8,7% |
| `cripto_derreteu` | evento | 8,6% |
| `adocao_chegou` | evento | 8,5% |
| `black_friday` | evento | 8,5% |
| `bico_adolescente` | acao | 8,3% |
| `promessa_da_mae` | evento | 8,3% |
| `chimarrao` | acao | 8,3% |
| `briga_dos_pais` | evento | 8,3% |
| `peneira` | evento | 8,2% |
| `viralizou` | evento | 8,2% |
| `vo_partiu` | npc | 8,1% |
| `crise_de_ansiedade` | evento | 8,1% |
| `greve_do_servidor` | evento | 8,1% |
| `frete_sumiu` | evento | 8,0% |
| `natal_com_politica` | evento | 8,0% |
| `fiador` | npc | 8,0% |
| `proposta_sao_paulo` | evento | 7,9% |
| `pais_na_crise` | npc | 7,9% |
| `joelho_da_pelada` | evento | 7,9% |
| `burnout_empresa` | evento | 7,9% |
| `intercambio_pago` | evento | 7,8% |
| `grupo_de_jovens` | evento | 7,8% |
| `boi_bumba` | acao | 7,8% |
| `amigo_muda_de_cidade` | npc | 7,7% |
| `clientes_sumiram` | evento | 7,7% |
| `pais_separados_natal` | evento | 7,6% |
| `casamento_do_filho` | evento | 7,6% |
| `segundo_carro` | evento | 7,5% |
| `luto_do_bicho` | npc | 7,4% |
| `proposta_de_compra` | evento | 7,3% |
| `subir_de_padrao` | evento | 7,2% |
| `sociedade_amigo` | evento | 7,1% |
| `processo_trabalhista` | evento | 7,1% |
| `ainda_mora_com_pais` | evento | 7,0% |
| `confeitaria_da_vo` | evento | 7,0% |
| `cobranca_de_notas` | npc | 7,0% |
| `herdeiro_gastao` | evento | 7,0% |
| `emprego_educacao` | evento | 6,9% |
| `chaves_do_apartamento` | evento | 6,8% |
| `netos_nas_ferias` | evento | 6,7% |
| `volta_terra` | evento | 6,7% |
| `primeiro_funcionario` | evento | 6,6% |
| `clinica_particular_contrata` | evento | 6,6% |
| `fundo_da_familia` | npc | 6,5% |
| `filho_imitacao` | npc | 6,3% |
| `emprestimo_ao_irmao` | evento | 6,3% |
| `renegociar_divida` | evento | 6,2% |
| `programa_de_moradia` | evento | 6,1% |
| `heranca` | evento | 6,1% |
| `obra_grande_no_norte` | evento | 6,1% |
| `funcionario_genial` | evento | 6,0% |
| `amor_quer_mudar_de_carreira` | npc | 6,0% |
| `assumir_negocio` | evento | 5,8% |
| `convite_para_candidatura` | evento | 5,8% |
| `amigo_sumiu_e_voltou` | npc | 5,7% |
| `sovina_ou_sabio` | evento | 5,6% |
| `cursinho_comunitario` | evento | 5,6% |
| `paquerar_timido` | acao | 5,6% |
| `nome_sujo` | evento | 5,6% |
| `curso_nota_baixa` | evento | 5,5% |
| `convite_igreja` | npc | 5,5% |
| `este_e_o_ano` | evento | 5,5% |
| `faculdade_depois_dos_60` | npc | 5,5% |
| `obra_do_predio` | evento | 5,4% |
| `mei_negocio` | evento | 5,3% |
| `depois_da_venda` | evento | 5,3% |
| `visitar_de_longe` | acao | 5,3% |
| `plano_de_saude_subiu` | evento | 5,3% |
| `bater_o_pe_com_o_chefe` | evento | 5,3% |
| `hospital_sem_insumo` | evento | 5,3% |
| `balcao_de_crianca` | evento | 5,2% |
| `blindar_contas` | acao | 5,2% |
| `filho_cuida` | npc | 5,2% |
| `mae_quer_morar_junto` | npc | 5,1% |
| `agro_na_cidade` | evento | 5,0% |
| `cuidar_netos` | acao | 5,0% |
| `prova_concurso` | evento | 5,0% |
| `aposentadoria_nao_da` | npc | 5,0% |
| `cachoeira` | acao | 5,0% |
| `carregar_a_geladeira` | evento | 4,9% |
| `ferias_com_a_familia_do_amor` | npc | 4,8% |
| `apresentacao_para_a_diretoria` | evento | 4,6% |
| `reencontro_paixao` | evento | 4,6% |
| `gorjeta_boa` | evento | 4,6% |
| `emprego_tecnologia` | evento | 4,5% |
| `burnout` | evento | 4,5% |
| `crise_no_setor` | evento | 4,5% |
| `alguem_especial` | evento | 4,4% |
| `recaida_cigarro` | evento | 4,4% |
| `cidadania_do_bisavo` | evento | 4,4% |
| `aposentado_quer_ajudar_na_empresa` | npc | 4,3% |
| `reajuste_dos_servidores` | evento | 4,2% |
| `arrojado_na_queda` | evento | 4,2% |
| `vender_doce` | acao | 4,1% |
| `filial_fechando` | evento | 4,0% |
| `convite_para_o_palco_grande` | evento | 4,0% |
| `fila_do_emprego` | evento | 4,0% |
| `imovel_na_baixa` | evento | 3,9% |
| `filho_quer_carro` | evento | 3,9% |
| `gravidez_surpresa` | npc | 3,9% |
| `ajudar_na_coleta` | evento | 3,6% |
| `briga_por_heranca` | evento | 3,6% |
| `vender_doce_nato` | acao | 3,6% |
| `vendas_recorde` | evento | 3,5% |
| `dizimo` | evento | 3,4% |
| `lembranca_primeiro_amor` | evento | 3,3% |
| `passear_pet` | acao | 3,2% |
| `amigo_ficou_rico` | npc | 3,1% |
| `pai_namorando_de_novo` | npc | 3,1% |
| `cara_de_comercial` | evento | 3,1% |
| `oferece_ajuda` | npc | 3,0% |
| `segredo_de_familia` | npc | 3,0% |
| `filho_saude_fragil` | npc | 2,9% |
| `emprestimo_de_volta` | evento | 2,9% |
| `bodas_de_prata` | evento | 2,9% |
| `tocar_o_negocio` | acao | 2,7% |
| `padrao_aperta` | evento | 2,6% |
| `rodada_grande` | evento | 2,6% |
| `filho_primeiro_salario` | npc | 2,5% |
| `carona_de_madrugada` | npc | 2,5% |
| `salario_parcelado` | evento | 2,5% |
| `ex_aluno` | evento | 2,4% |
| `amor_quadro_de_tarefas` | npc | 2,4% |
| `vaga_na_empresa_dele` | npc | 2,4% |
| `family_office` | evento | 2,4% |
| `expandir_na_alta` | evento | 2,3% |
| `sair_de_casa_cedo` | evento | 2,3% |
| `filho_passou_longe` | npc | 2,3% |
| `despejo` | evento | 2,2% |
| `rebaixamento` | evento | 2,1% |
| `retirada_demais` | evento | 2,1% |
| `nega_ajuda` | npc | 2,0% |
| `mestrado_fora` | evento | 1,9% |
| `cursinho_paga_bem` | evento | 1,9% |
| `vaga_no_agro` | evento | 1,9% |
| `doar_em_vida` | evento | 1,8% |
| `giz_do_proprio_bolso` | evento | 1,7% |
| `celular_dos_pais` | npc | 1,7% |
| `chefe_amigo` | evento | 1,6% |
| `aperto_do_mes` | evento | 1,6% |
| `emprego_negocios` | evento | 1,6% |
| `dez_anos_de_empresa` | evento | 1,6% |
| `tocar_no_bar` | acao | 1,6% |
| `mochilao` | acao | 1,5% |
| `fim_do_amor` | npc | 1,5% |
| `intercambio` | evento | 1,4% |
| `briga_de_casal` | npc | 1,4% |
| `acoes_da_startup` | evento | 1,4% |
| `fundacao_com_seu_nome` | evento | 1,3% |
| `reforma_sem_fim` | evento | 1,3% |
| `amor_paga_a_conta` | npc | 1,2% |
| `padrinho_casamento` | npc | 1,2% |
| `layoff_por_email` | evento | 1,2% |
| `apartamento_de_presente` | evento | 1,2% |
| `tentar_a_vida_na_europa` | evento | 1,2% |
| `filho_quer_trabalhar_na_empresa` | npc | 1,1% |
| `imposto_sobre_fortunas` | evento | 1,1% |
| `filho_briga_na_escola` | npc | 1,1% |
| `aluguel_caro` | evento | 1,1% |
| `pressao_carreira` | npc | 1,0% |
| `montadora_vai_fechar` | evento | 1,0% |
| `happy_hour` | acao | 1,0% |
| `edital_de_cultura` | evento | 1,0% |
| `transito_de_sp` | evento | 1,0% |
| `proposta_pelo_negocio` | evento | 0,9% |
| `carreira_futebol` | evento | 0,9% |
| `emprego_artes` | evento | 0,9% |
| `estagio_do_pai` | evento | 0,9% |
| `filho_apresenta_namoro` | npc | 0,9% |
| `negocio_em_crise` | evento | 0,8% |
| `reencontro_amigo_brigado` | evento | 0,8% |
| `safra_da_fazenda` | evento | 0,8% |
| `pais_envelhecem` | npc | 0,8% |
| `amor_sempre_trabalhando` | npc | 0,8% |
| `filho_quer_curso_caro` | npc | 0,7% |
| `cofrinho_cheio` | evento | 0,7% |
| `parcela_da_tv` | npc | 0,6% |
| `filho_pede_ajuda` | npc | 0,6% |
| `concurso_em_brasilia` | evento | 0,5% |
| `renegociar_cartao` | acao | 0,5% |
| `filho_adolescente_porta` | npc | 0,5% |
| `royalties_secaram` | evento | 0,5% |
| `pais_aposentados` | npc | 0,5% |
| `emprego_engenharia` | evento | 0,5% |
| `shows_cancelados` | evento | 0,4% |
| `time_a_venda` | evento | 0,4% |
| `amor_igreja` | npc | 0,4% |
| `zona_franca` | evento | 0,4% |
| `festival_lotado` | evento | 0,4% |
| `sucessao_na_empresa` | evento | 0,4% |
| `reconciliacao` | npc | 0,4% |
| `amor_gastador` | npc | 0,4% |
| `passou_mal_de_novo` | npc | 0,4% |
| `amor_planilha` | npc | 0,4% |
| `robos_na_fabrica` | evento | 0,4% |
| `cobrir_a_tatuagem` | evento | 0,4% |
| `amor_viaja_demais` | npc | 0,3% |
| `carro_de_presente` | evento | 0,3% |
| `clientes_em_panico` | evento | 0,3% |
| `pedreiro_vale_ouro` | evento | 0,3% |
| `seguranca_particular` | evento | 0,3% |
| `amor_saude_fragil` | npc | 0,3% |
| `filho_planilha_da_velhice` | npc | 0,3% |
| `lista_dos_mais_ricos` | evento | 0,3% |
| `bonus_do_banco` | evento | 0,2% |
| `role` | acao | 0,2% |
| `quebra_de_safra` | evento | 0,2% |
| `conselho_quer_ceo` | evento | 0,2% |
| `proposta_remota` | evento | 0,2% |
| `holding_da_familia` | evento | 0,2% |
| `abrir_capital` | evento | 0,2% |
| `bolsa_na_faculdade` | evento | 0,2% |
| `caramelo_envelhece` | npc | 0,2% |
| `obra_parada` | evento | 0,1% |
| `mensalidade_da_escola` | npc | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `turno_extra_na_fabrica` | evento | 0,1% |
| `treinar_no_clube` | acao | 0,1% |
| `filho_quer_capital` | npc | 0,1% |
| `filho_distante` | npc | 0,1% |
| `construtora_quebrou` | evento | 0,1% |
| `safra_recorde` | evento | 0,1% |
| `ferias_coletivas` | evento | 0,1% |
| `amigo_lembra_zoeira` | npc | 0,1% |
| `filho_foi_embora` | npc | 0,1% |
| `negocio_da_familia_quebra` | evento | 0,1% |
| `vestibular_preparado` | evento | 0,1% |
| `filho_hamburgueria` | npc | 0,1% |
| `acionistas_furiosos` | evento | 0,0% |
| `capa_de_revista` | evento | 0,0% |
| `filho_missao` | npc | 0,0% |
| `peso_do_sobrenome` | evento | 0,0% |
| `pai_rico_filho_nobre_neto_pobre` | evento | 0,0% |
| `carta_na_gaveta` | evento | 0,0% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 104 · **mudaram algo em pelo menos uma vida:** 104
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 72,3 · p10 57 · p25 64 · mediana 72 · p75 81 · p90 88

```
até 19                                        0,1%
20–29                                         0,1%
30–39                                         0,3%
40–49          ██                             1,9%
50–59          ████████████                   11,6%
60–69          █████████████████████████████  27,9%
70–79          ██████████████████████████████ 29,3%
80–89          █████████████████████          20,6%
90–99          ████████                       7,8%
100+                                          0,5%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 169 mil · p25 R$ 470 mil · mediana R$ 1,2 milhão · p75 R$ 3,9 milhões · p90 R$ 18 milhões

```
negativo       ██                             2,1%
até 10 mil                                    0,3%
10–50 mil      █                              1,5%
50–200 mil     ███████                        7,7%
200 mil–1 mi   ████████████████████████████   32,2%
1–5 mi         ██████████████████████████████ 34,6%
5 mi+          ███████████████████            21,6%
```

**Felicidade média ao longo da vida** — p10 59 · mediana 70 · p90 81

```
até 29                                        0,0%
30–39                                         0,0%
40–49          █                              0,9%
50–59          █████████                      11,6%
60–69          ██████████████████████████████ 37,7%
70–79          ██████████████████████████████ 37,7%
80+            ██████████                     12,0%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 68,7 | R$ 760 mil | 72,1 | 56,0 | 88,6 | 43,0 | 100% | 65% |
| cautelosa | 85,1 🏆 | R$ 2 milhão 🏆 | 66,4 | 65,0 | 104,8 | 25,7 | 100% | 75% |
| arriscada | 61,6 | R$ 1,3 milhão | 72,9 🏆 | 51,3 | 81,6 | 64,9 | 100% | 62% |
| aleatoria | 74,0 | R$ 941 mil | 68,3 | 59,4 | 75,9 | 50,8 | 100% | 63% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 11,8% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 10,8% — num hospital do SUS que fez tudo o que podia, e fez muito
- 10,8% — de um AVC, numa terça-feira sem graça
- 7,9% — de pneumonia, depois de teimar que era só uma gripe
- 6,1% — de complicações de uma queda no banheiro
- 5,8% — numa cirurgia simples que não foi tão simples
- 5,4% — de complicações pulmonares, entre uma tosse e outra
- 5,2% — de velhice, dormindo, num domingo depois do almoço

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por verbo da ficha (dos 18 aos 40, até dois por ano) ou pelo +1 ano + um por escolha + três por operação na folha Dinheiro (abrir, escolher, confirmar).
