# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 143 eventos, 59 de personagens, 70 ações, 440 escolhas, 123 linhas, 52 cadeias de 3+ anos.

## Metas permanentes

| Meta | Situação | Detalhe |
|---|---|---|
| Zero storylets mortos | ✅ | 0 mortos |
| Nenhum storylet não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Portões do incremento 1

| Portão | Situação | Valor |
|---|---|---|
| Saturação V5 ≤ 80% | ✅ | 77,0% (base 94,5%) |
| Assinaturas ≥ 1,5× a linha de base | ✅ | 893 (base 563, alvo 845) |
| Desvio da felicidade ≥ 1,3× a linha de base | ✅ | 8,57 (base 5,73, alvo 7,45) |
| Toques por vida ≤ 1,4× hoje | ✅ | 115,2 (base 110,8, teto 155,1) |

## Life simulator

| Métrica | Valor |
|---|---|
| Saturação V5 / V20 (instâncias já vistas em vidas anteriores) | 77,0% / 95,9% |
| Saturação V5 contando as narrativas de regra (adoeceu, perdeu o emprego…) | 82,0% |
| Efeito da memória (aleatória, V5 sem → com memória) | 78,6% → 74,9% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 893 (528) |
| Mobilidade: mesmo quintil da origem ao fim | 37,8% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,57 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 3,0% / 3,0% |
| Patrimônio p90/p10 | 17,9× (p10 R$ 123 mil, p90 R$ 2,2 milhões) |
| Desvio-padrão da felicidade média da vida | 8,57 |
| Vidas com patrimônio negativo ao morrer | 1,4% |
| Mudanças de estado causadas pelo jogador | 34,4% |
| Toques por vida | 115,2 |
| Tempo de CPU por vida | 14,53 ms |
| Ações (fichas usadas) por vida | 66,0 |
| Mortes na família por vida | 4,1 |
| Pontos de virada que vêm do mundo (não do jogador) | 2,9% |

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 40% | 59% | 70% | 77% | 90% | 94% | 96% |

Matriz de mobilidade (linhas: quintil da riqueza da família ao nascer; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 34% | 29% | 20% | 13% | 3% |
| Q2 | 29% | 29% | 23% | 15% | 4% |
| Q3 | 22% | 24% | 27% | 21% | 5% |
| Q4 | 11% | 15% | 22% | 31% | 21% |
| Q5 | 3% | 4% | 7% | 19% | 67% |

Por classe de origem:

| Classe de origem | Vidas | Idade média | Patrimônio mediano | Felicidade média |
|---|---|---|---|---|
| extrema pobreza | 10% | 71,7 | R$ 247 mil | 70,4 |
| família pobre | 24% | 71,9 | R$ 254 mil | 69,5 |
| família remediada | 26% | 71,9 | R$ 338 mil | 69,6 |
| classe média | 20% | 72,0 | R$ 547 mil | 70,1 |
| família rica | 13% | 71,5 | R$ 1,3 milhão | 70,1 |
| família muito rica | 7% | 71,6 | R$ 3,9 milhões | 69,9 |

## Repetição

- **Dentro de uma vida:** 12,3% das aparições repetem uma instância já vista na mesma vida; pior vida: 37,3%.
- **Texto repetido entre vidas:** 38,2% dos textos de uma vida (eventos, personagens e linhas, já renderizados) são idênticos a algum texto de uma vida anterior.
- **Mais repetidos na mesma vida** (repetições a cada 100 aparições): `namoro` 4,2 · `aposentadoria` 1,3 · `piada_no_grupo#amigo` 0,6 · `bilhete_carinhoso#mae` 0,6 · `avo_mesada_escondida#avo` 0,5 · `bilhete_carinhoso#pai` 0,5

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `vo_partiu`, `geladeira_vazia`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 25 de 181 storylets — `esporte_depois_da_aula`, `vape_festa`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`, `luto`, `amor_proposta_fora`, `amor_sempre_trabalhando`, `geladeira_vazia`, `bolsa_de_estudos`, `dizimo`, `aperto_do_mes`, `recaida_cigarro`, `investimento_furado`, `quarto_dividido`, `briga_por_heranca`, `seca_no_sertao`, `ceu_de_fumaca`, `consorcio`, `crise_de_ansiedade`, `bater_o_pe_com_o_chefe`. Algumas são armadilhas de propósito.

## Storylets

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`, `amigo_lembra_zoeira`, `filho_distante`, `caramelo_envelhece`, `filho_missao`, `filho_planilha_da_velhice`, `role`, `renegociar_cartao`, `treinar_no_clube`, `mochilao`, `vestibular_preparado`, `bolsa_na_faculdade`, `zona_franca`
- **Apresentados por vida:** 48,5 · **com causa anterior (cadeia):** 33,2 · **maior distância causa→consequência:** 49,2 anos em média
- **Vidas com 3 pontos de virada no cartão:** 100,0%

<details><summary>Frequência de cada storylet (% das vidas em que aparece)</summary>

| Storylet | Tipo | Vidas |
|---|---|---|
| `primeira_palavra` | evento | 100,0% |
| `primeiro_dia_escola` | evento | 100,0% |
| `namoro` | evento | 99,6% |
| `luto` | npc | 99,4% |
| `brincar_com_irmao_avo` | acao | 95,8% |
| `enem` | evento | 94,5% |
| `cuidar_da_doenca` | npc | 83,5% |
| `aposentadoria` | evento | 76,8% |
| `primeiro_investimento` | evento | 72,3% |
| `visitar_familia` | acao | 72,0% |
| `ligar_amigo` | acao | 64,2% |
| `carro` | evento | 60,6% |
| `golpe_pix` | evento | 59,4% |
| `filho` | npc | 54,9% |
| `ler_livros` | acao | 54,9% |
| `hobby_horta` | evento | 53,8% |
| `amigo_em_apuros` | npc | 53,3% |
| `formatura` | evento | 53,1% |
| `casa_propria` | evento | 52,5% |
| `almoco_domingo` | acao | 52,4% |
| `juros_compostos` | evento | 51,3% |
| `demissao` | evento | 50,4% |
| `oportunidade_de_negocio` | evento | 50,1% |
| `primeiro_emprego` | evento | 49,1% |
| `bet` | evento | 48,7% |
| `casamento` | npc | 48,6% |
| `avo_mesada_escondida` | npc | 48,5% |
| `emprego_formado` | evento | 47,9% |
| `correr` | acao | 47,9% |
| `brincar_na_rua` | acao | 47,8% |
| `criptomoeda` | evento | 47,2% |
| `investimento_rotina` | evento | 47,0% |
| `curso_online` | acao | 46,3% |
| `casa_dos_pais` | evento | 44,0% |
| `estudar_concurso` | acao | 44,0% |
| `bico_adulto` | acao | 43,7% |
| `creche_ou_vo` | evento | 43,6% |
| `filho_adolescente` | evento | 43,6% |
| `pos_graduacao` | acao | 42,4% |
| `investir_tesouro` | acao | 41,2% |
| `investimento_furado` | evento | 40,9% |
| `doente_crianca` | npc | 40,8% |
| `promocao` | evento | 40,5% |
| `paquerar` | acao | 40,1% |
| `hidroginastica` | evento | 40,0% |
| `festa_tema` | evento | 39,5% |
| `sair_de_casa` | evento | 39,5% |
| `reencontro_amigo` | evento | 39,3% |
| `trabalho_grande` | acao | 39,2% |
| `amigo_devolve` | npc | 38,9% |
| `bullying_recreio` | evento | 38,5% |
| `estudar_tabuada` | acao | 38,4% |
| `filho_formatura` | evento | 38,3% |
| `cachorro_caramelo` | evento | 37,2% |
| `festa_junina` | evento | 37,0% |
| `estudar_escola` | acao | 36,9% |
| `consorcio` | evento | 35,8% |
| `rebalancear` | acao | 34,5% |
| `esporte_depois_da_aula` | evento | 34,4% |
| `separacao` | evento | 33,7% |
| `academia` | acao | 33,6% |
| `primeiro_beijo` | evento | 33,4% |
| `voltar_estudar` | evento | 32,0% |
| `primeiro_celular` | evento | 30,0% |
| `banda_garagem` | evento | 29,3% |
| `desempregado` | evento | 29,1% |
| `queda` | evento | 28,7% |
| `pede_ajuda` | npc | 28,5% |
| `bilhete_carinhoso` | npc | 28,5% |
| `piada_no_grupo` | npc | 28,4% |
| `testamento` | evento | 28,4% |
| `fugir_inflacao` | acao | 28,1% |
| `feira_ciencias` | evento | 27,6% |
| `vape_festa` | evento | 27,6% |
| `mesada` | evento | 27,4% |
| `estudar_faculdade` | acao | 27,3% |
| `doenca_de_quem_ama` | evento | 27,3% |
| `entregador_chuva` | evento | 26,8% |
| `cartao_credito` | evento | 26,1% |
| `avo_conta_historias` | npc | 26,0% |
| `netos` | evento | 25,6% |
| `vicio_aposta` | evento | 25,3% |
| `perdeu_aniversario` | npc | 24,8% |
| `festa_da_cidade` | acao | 24,6% |
| `pressao_alta` | evento | 24,3% |
| `crise_40` | evento | 23,9% |
| `cursinho_pago` | acao | 23,3% |
| `tempo_com_amor` | acao | 23,1% |
| `ceu_de_fumaca` | evento | 22,8% |
| `voltar_a_estudar` | acao | 22,7% |
| `surpresa_do_amor` | npc | 22,6% |
| `previdencia` | acao | 22,2% |
| `tocar_empresa` | acao | 21,6% |
| `faculdade_vida` | evento | 21,3% |
| `festa_80` | evento | 20,7% |
| `carteira_da_diarista` | evento | 20,3% |
| `briga_em_casa` | npc | 20,2% |
| `encontro` | acao | 20,1% |
| `pai_ausente_volta` | npc | 19,9% |
| `cuidar_de_doente` | acao | 19,4% |
| `recomecar_amor` | acao | 19,3% |
| `brincar_amigos` | acao | 19,2% |
| `hora_extra` | acao | 18,9% |
| `cofrinho` | acao | 18,9% |
| `quarto_dividido` | evento | 18,7% |
| `maratona` | evento | 18,4% |
| `cidadania_italiana` | evento | 18,0% |
| `entregas` | acao | 18,0% |
| `festa_sem_pais` | evento | 17,6% |
| `festa_surpresa` | evento | 17,5% |
| `guardar_dinheiro` | acao | 17,3% |
| `casamento_na_igreja` | npc | 17,0% |
| `estudar_enem` | acao | 16,1% |
| `mutirao_da_laje` | evento | 16,1% |
| `esporte_escola` | acao | 16,1% |
| `casa_cheia` | evento | 15,9% |
| `ajudar_em_casa` | acao | 15,0% |
| `bolsa_de_estudos` | evento | 14,6% |
| `casa_na_praia` | evento | 14,5% |
| `seca_no_sertao` | evento | 14,4% |
| `caminhada` | acao | 14,0% |
| `vereador` | evento | 13,1% |
| `cheia_do_rio` | evento | 13,1% |
| `amor_piada_interna` | npc | 13,1% |
| `amigo_muda_de_cidade` | npc | 12,9% |
| `tentar_outra_cidade` | evento | 12,7% |
| `plano_de_saude_subiu` | evento | 12,6% |
| `promessa_da_mae` | evento | 12,6% |
| `amor_proposta_fora` | npc | 12,5% |
| `filho_desenho` | npc | 12,3% |
| `natal_com_politica` | evento | 12,1% |
| `baile_terceira_idade` | acao | 12,1% |
| `vaga_na_capital` | evento | 12,0% |
| `separacao_dos_pais` | evento | 11,8% |
| `tosse_cronica` | evento | 11,8% |
| `praia` | acao | 11,7% |
| `pelada` | acao | 11,6% |
| `show_no_bar` | evento | 11,6% |
| `proposta_sao_paulo` | evento | 11,5% |
| `cripto_de_novo` | acao | 11,4% |
| `merenda` | evento | 11,2% |
| `show_no_estadio` | acao | 11,2% |
| `balcao_negocio` | acao | 11,1% |
| `ainda_mora_com_pais` | evento | 11,0% |
| `enchente_na_rua` | evento | 11,0% |
| `volta_terra` | evento | 10,8% |
| `filho_imitacao` | npc | 10,8% |
| `olimpiada` | acao | 10,1% |
| `titulo_eleitor` | evento | 10,1% |
| `sao_joao` | acao | 9,9% |
| `crise_de_ansiedade` | evento | 9,9% |
| `assumir_negocio` | evento | 9,8% |
| `cortar_gastos` | acao | 9,7% |
| `heranca` | evento | 9,6% |
| `vo_receita` | evento | 9,4% |
| `filho_cuida` | npc | 9,4% |
| `geladeira_vazia` | evento | 9,2% |
| `filho_primeiro_salario` | npc | 8,9% |
| `aprovado_concurso_estudo` | evento | 8,8% |
| `bico_adolescente` | acao | 8,8% |
| `sociedade_amigo` | evento | 8,7% |
| `olimpiada_matematica` | evento | 8,5% |
| `pais_envelhecem` | npc | 8,5% |
| `este_e_o_ano` | evento | 8,5% |
| `bater_o_pe_com_o_chefe` | evento | 8,4% |
| `vo_partiu` | npc | 8,3% |
| `apresentacao_para_a_diretoria` | evento | 8,3% |
| `convite_para_candidatura` | evento | 8,2% |
| `nome_sujo` | evento | 8,0% |
| `briga_de_casal` | npc | 8,0% |
| `pais_separados_natal` | evento | 7,8% |
| `viralizou` | evento | 7,8% |
| `parar_de_fumar` | acao | 7,8% |
| `chimarrao` | acao | 7,6% |
| `briga_dos_pais` | evento | 7,6% |
| `amor_quadro_de_tarefas` | npc | 7,6% |
| `luto_do_bicho` | npc | 7,5% |
| `boi_bumba` | acao | 7,5% |
| `confeitaria_da_vo` | evento | 7,2% |
| `intercambio_pago` | evento | 7,2% |
| `tempo_com_filho` | acao | 7,1% |
| `peneira` | evento | 7,1% |
| `alguem_especial` | evento | 7,1% |
| `carregar_a_geladeira` | evento | 7,0% |
| `herdeiro_gastao` | evento | 7,0% |
| `check_up` | acao | 6,9% |
| `convite_igreja` | npc | 6,8% |
| `festa_de_15` | evento | 6,6% |
| `filho_pede_ajuda` | npc | 6,5% |
| `recaida_cigarro` | evento | 6,5% |
| `filho_passou_longe` | npc | 6,5% |
| `cobranca_de_notas` | npc | 6,4% |
| `mei_negocio` | evento | 6,0% |
| `grupo_de_jovens` | evento | 6,0% |
| `proposta_pelo_negocio` | evento | 5,9% |
| `reencontro_paixao` | evento | 5,5% |
| `paquerar_timido` | acao | 5,4% |
| `dizimo` | evento | 5,4% |
| `visitar_de_longe` | acao | 5,2% |
| `cursinho_comunitario` | evento | 5,2% |
| `briga_por_heranca` | evento | 5,2% |
| `balcao_de_crianca` | evento | 5,1% |
| `amor_sempre_trabalhando` | npc | 4,8% |
| `padrinho_casamento` | npc | 4,8% |
| `burnout` | evento | 4,6% |
| `lembranca_primeiro_amor` | evento | 4,5% |
| `cachoeira` | acao | 4,3% |
| `terapia` | acao | 4,3% |
| `cara_de_comercial` | evento | 4,2% |
| `vender_doce` | acao | 4,0% |
| `negocio_em_crise` | evento | 4,0% |
| `filho_saude_fragil` | npc | 3,9% |
| `cuidar_netos` | acao | 3,9% |
| `pais_aposentados` | npc | 3,9% |
| `hidro_com_a_turma` | acao | 3,9% |
| `prova_concurso` | evento | 3,8% |
| `fim_do_amor` | npc | 3,8% |
| `blindar_contas` | acao | 3,7% |
| `renegociar_divida` | evento | 3,5% |
| `vender_doce_nato` | acao | 3,3% |
| `rebaixamento` | evento | 3,2% |
| `mestrado_fora` | evento | 3,0% |
| `ajudar_na_coleta` | evento | 3,0% |
| `filho_briga_na_escola` | npc | 2,6% |
| `amor_gastador` | npc | 2,6% |
| `passear_pet` | acao | 2,6% |
| `nega_ajuda` | npc | 2,6% |
| `sair_de_casa_cedo` | evento | 2,6% |
| `tentar_a_vida_na_europa` | evento | 2,5% |
| `vaga_no_agro` | evento | 2,5% |
| `amor_igreja` | npc | 2,5% |
| `parcela_da_tv` | npc | 2,5% |
| `conteudo_extra` | acao | 2,3% |
| `reconciliacao` | npc | 2,3% |
| `amor_planilha` | npc | 2,3% |
| `despejo` | evento | 2,2% |
| `oferece_ajuda` | npc | 2,2% |
| `apartamento_de_presente` | evento | 2,2% |
| `chefe_amigo` | evento | 2,1% |
| `aluguel_caro` | evento | 2,1% |
| `intercambio` | evento | 2,0% |
| `reencontro_amigo_brigado` | evento | 1,9% |
| `filho_adolescente_porta` | npc | 1,8% |
| `amor_saude_fragil` | npc | 1,8% |
| `amor_viaja_demais` | npc | 1,7% |
| `happy_hour` | acao | 1,4% |
| `transito_de_sp` | evento | 1,4% |
| `passou_mal_de_novo` | npc | 1,3% |
| `estagio_do_pai` | evento | 1,2% |
| `amor_paga_a_conta` | npc | 1,2% |
| `aperto_do_mes` | evento | 1,1% |
| `carro_de_presente` | evento | 1,1% |
| `filho_hamburgueria` | npc | 1,1% |
| `concurso_em_brasilia` | evento | 1,0% |
| `pressao_carreira` | npc | 0,9% |
| `carreira_futebol` | evento | 0,7% |
| `tocar_no_bar` | acao | 0,7% |
| `filho_foi_embora` | npc | 0,7% |
| `cofrinho_cheio` | evento | 0,6% |
| `filho_distante` | npc | 0,4% |
| `zona_franca` | evento | 0,4% |
| `filho_planilha_da_velhice` | npc | 0,4% |
| `filho_missao` | npc | 0,3% |
| `bolsa_na_faculdade` | evento | 0,3% |
| `caramelo_envelhece` | npc | 0,3% |
| `vestibular_preparado` | evento | 0,2% |
| `amigo_lembra_zoeira` | npc | 0,2% |
| `role` | acao | 0,2% |
| `mochilao` | acao | 0,1% |
| `fim_carreira` | evento | 0,1% |
| `renegociar_cartao` | acao | 0,1% |
| `treinar_no_clube` | acao | 0,1% |

</details>

## Qualidades

- **Ganhas na simulação (de quem joga):** 77 · **mudaram algo em pelo menos uma vida:** 77
- **Qualidades que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,8 · p10 58 · p25 65 · mediana 73 · p75 79 · p90 84

```
até 19                                        0,0%
20–29                                         0,1%
30–39                                         0,2%
40–49          █                              1,7%
50–59          ████████                       10,1%
60–69          ██████████████████████         26,7%
70–79          ██████████████████████████████ 37,1%
80–89          ██████████████████             21,7%
90–99          ██                             2,4%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 123 mil · p25 R$ 219 mil · mediana R$ 407 mil · p75 R$ 892 mil · p90 R$ 2,2 milhões

```
negativo       █                              1,4%
até 10 mil                                    0,2%
10–50 mil      █                              1,6%
50–200 mil     ██████████                     18,7%
200 mil–1 mi   ██████████████████████████████ 55,5%
1–5 mi         ██████████                     18,8%
5 mi+          ██                             3,8%
```

**Felicidade média ao longo da vida** — p10 58 · mediana 70 · p90 81

```
até 29                                        0,0%
30–39                                         0,1%
40–49          █                              1,1%
50–59          █████████                      11,7%
60–69          ██████████████████████████████ 37,3%
70–79          ██████████████████████████████ 37,5%
80+            ██████████                     12,3%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Storylets por vida | Ações por vida | Com causa | Vidas com 3 viradas | Saturação V5 |
|---|---|---|---|---|---|---|---|---|
| primeira | 70,6 | R$ 365 mil | 72,6 🏆 | 48,4 | 67,6 | 31,1 | 100% | 78% |
| cautelosa | 79,7 🏆 | R$ 477 mil | 66,5 | 50,5 | 76,7 | 19,6 | 100% | 81% |
| arriscada | 63,4 | R$ 561 mil 🏆 | 72,6 | 45,2 | 60,4 | 41,6 | 100% | 74% |
| aleatoria | 73,6 | R$ 255 mil | 67,7 | 49,8 | 59,5 | 40,5 | 100% | 75% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,0% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,5% — de um AVC, numa terça-feira sem graça
- 8,9% — de pneumonia, depois de teimar que era só uma gripe
- 6,5% — de complicações de uma queda no banheiro
- 5,4% — numa cirurgia simples que não foi tão simples
- 4,9% — de complicações pulmonares, entre uma tosse e outra
- 4,8% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e iniciativas de personagens; ações do jogador, linhas curtas e narrativas de regra não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + papel envolvido; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza da família ao nascer × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo de quem joga que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, qualidade ganha ou perdida, contada por entrada do livro-razão. É do jogador quando a entrada é uma escolha ou uma ação dele.
- **Toques:** nascer + um por ano (no verbo da ficha ou no +1 ano) + um por escolha.
