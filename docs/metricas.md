# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 250 jogadores × 10 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 80 eventos, 214 escolhas, 101 linhas, 29 cadeias de 3+ anos.

## Metas da fase 1

| Meta | Situação | Detalhe |
|---|---|---|
| Zero eventos mortos | ✅ | 0 mortos |
| Nenhum evento não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Repetição

- **Dentro de uma vida:** 9,5% das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: 36,6%.
- **Entre vidas (2ª à 10ª):** em média 89,9% dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; 58,5% já tinham aparecido na vida imediatamente anterior.
- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, 1000 vidas): vista na vida anterior 61,4% sem memória → 55,5% com memória; vista em qualquer vida anterior 87,5% → 86,7%.

| Vida | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª | 8ª | 9ª | 10ª |
|---|---|---|---|---|---|---|---|---|---|
| Já visto antes | 57% | 81% | 90% | 94% | 96% | 97% | 98% | 98% | 99% |

Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): `investimento_rotina` 1,4 · `aposentadoria` 1,3 · `namoro` 1,3 · `entregador_chuva` 1,0 · `vicio_aposta` 0,9 · `caramelo_velhinho` 0,8

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `queda`, `vo_partiu`
- **Sem tensão entre risco e recompensa** (a opção mais segura também tem o maior valor esperado): 50 de 80 eventos.

## Eventos

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** nenhum
- **Eventos por vida:** 38,0 · **com causa anterior (cadeia):** 14,3 · **maior distância causa→consequência:** 50,5 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,8%

<details><summary>Frequência de cada evento (% das vidas em que aparece)</summary>

| Evento | Vidas |
|---|---|
| `primeira_palavra` | 100,0% |
| `primeiro_dia_escola` | 100,0% |
| `enem` | 99,8% |
| `namoro` | 88,3% |
| `golpe_pix` | 87,3% |
| `pais_envelhecem` | 85,6% |
| `carro` | 85,6% |
| `primeiro_investimento` | 84,9% |
| `luto_pais` | 80,0% |
| `criptomoeda` | 79,9% |
| `aposentadoria` | 79,5% |
| `hobby_horta` | 78,3% |
| `bet` | 77,7% |
| `investimento_rotina` | 73,7% |
| `casa_propria` | 73,6% |
| `juros_compostos` | 73,5% |
| `sair_de_casa` | 67,0% |
| `reencontro_amigo` | 64,6% |
| `demissao` | 63,4% |
| `primeiro_emprego` | 57,9% |
| `cartao_credito` | 56,4% |
| `cachorro_caramelo` | 55,9% |
| `primeiro_beijo` | 55,0% |
| `voltar_estudar` | 53,9% |
| `festa_junina` | 53,8% |
| `promocao` | 53,5% |
| `bullying_recreio` | 50,3% |
| `banda_garagem` | 49,9% |
| `vape_festa` | 49,5% |
| `primeiro_celular` | 49,0% |
| `esporte_depois_da_aula` | 48,4% |
| `hidroginastica` | 45,7% |
| `queda` | 45,6% |
| `vicio_aposta` | 44,8% |
| `creche_ou_vo` | 44,0% |
| `crise_40` | 43,1% |
| `festa_tema` | 41,8% |
| `desempregado` | 41,4% |
| `mesada` | 41,0% |
| `feira_ciencias` | 40,9% |
| `formatura` | 40,1% |
| `pressao_alta` | 39,8% |
| `testamento` | 38,6% |
| `casamento` | 38,5% |
| `maratona` | 37,2% |
| `entregador_chuva` | 36,7% |
| `show_no_bar` | 36,7% |
| `festa_sem_pais` | 35,4% |
| `emprego_formado` | 33,9% |
| `filho` | 29,0% |
| `ainda_mora_com_pais` | 27,3% |
| `separacao` | 27,1% |
| `tosse_cronica` | 27,0% |
| `sociedade_amigo` | 26,8% |
| `filho_adolescente` | 24,3% |
| `titulo_eleitor` | 24,3% |
| `burnout` | 24,2% |
| `faculdade_vida` | 22,9% |
| `caramelo_velhinho` | 22,7% |
| `filho_formatura` | 22,4% |
| `festa_80` | 20,8% |
| `vereador` | 20,6% |
| `peneira` | 20,0% |
| `intercambio` | 19,6% |
| `netos` | 18,9% |
| `nome_sujo` | 18,5% |
| `reencontro_paixao` | 17,1% |
| `vo_partiu` | 16,3% |
| `renegociar_divida` | 15,4% |
| `viralizou` | 14,8% |
| `olimpiada_matematica` | 13,1% |
| `vo_receita` | 11,9% |
| `confeitaria_da_vo` | 9,8% |
| `mei_negocio` | 7,6% |
| `carreira_futebol` | 7,0% |
| `volta_terra` | 5,8% |
| `fim_carreira` | 4,2% |
| `prova_concurso` | 3,7% |
| `rebaixamento` | 3,6% |
| `chefe_amigo` | 2,5% |

</details>

## Marcas

- **Criadas na simulação:** 76 · **mudaram algo em pelo menos uma vida** (evento, escolha, linha, causa de morte, efeito passivo ou epitáfio): 76
- **Marcas que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 72,2 · p10 60 · p25 66 · mediana 73 · p75 79 · p90 84

```
até 19                                        0,1%
20–29                                         0,1%
30–39                                         0,2%
40–49          █                              1,5%
50–59          ██████                         7,9%
60–69          ███████████████████            25,8%
70–79          ██████████████████████████████ 39,7%
80–89          ██████████████████             23,9%
90–99          █                              0,8%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 50 mil · p25 R$ 181 mil · mediana R$ 410 mil · p75 R$ 763 mil · p90 R$ 1,4 milhão

```
negativo       ███                            5,4%
até 10 mil                                    0,8%
10–50 mil      ██                             3,9%
50–200 mil     █████████                      17,1%
200 mil–1 mi   ██████████████████████████████ 56,4%
1 mi+          █████████                      16,5%
```

**Felicidade média ao longo da vida** — p10 64 · mediana 72 · p90 81

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,1%
50–59          ██                             3,2%
60–69          ████████████████████           34,2%
70–79          ██████████████████████████████ 51,0%
80+            ███████                        11,4%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |
|---|---|---|---|---|---|---|---|
| primeira | 73,0 | R$ 630 mil 🏆 | 75,8 🏆 | 38,0 | 16,2 | 100% | 90% |
| cautelosa | 77,5 🏆 | R$ 584 mil | 71,3 | 39,0 | 12,2 | 100% | 93% |
| arriscada | 66,7 | R$ 352 mil | 73,1 | 37,9 | 16,1 | 100% | 89% |
| aleatoria | 71,7 | R$ 156 mil | 67,6 | 37,3 | 12,6 | 100% | 87% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 11,5% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,5% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,4% — de um AVC, numa terça-feira sem graça
- 8,5% — de pneumonia, depois de teimar que era só uma gripe
- 7,8% — de complicações pulmonares, entre uma tosse e outra
- 6,8% — de complicações de uma queda no banheiro
- 5,5% — numa cirurgia simples que não foi tão simples
- 5,3% — de um infarto no meio de uma discussão sobre futebol
