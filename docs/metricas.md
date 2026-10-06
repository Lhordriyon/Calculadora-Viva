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

- **Dentro de uma vida:** 10,5% das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: 35,1%.
- **Entre vidas (2ª à 10ª):** em média 90,7% dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; 61,4% já tinham aparecido na vida imediatamente anterior.
- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, 1000 vidas): vista na vida anterior 61,4% sem memória → 55,3% com memória; vista em qualquer vida anterior 87,4% → 86,6%.

| Vida | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª | 8ª | 9ª | 10ª |
|---|---|---|---|---|---|---|---|---|---|
| Já visto antes | 59% | 83% | 91% | 94% | 96% | 97% | 98% | 98% | 99% |

Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): `namoro` 1,7 · `investimento_rotina` 1,6 · `aposentadoria` 1,3 · `entregador_chuva` 1,0 · `vicio_aposta` 0,9 · `promocao` 0,9

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `vo_partiu`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 10 de 80 eventos — `creche_ou_vo`, `esporte_depois_da_aula`, `vape_festa`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`. Algumas são armadilhas de propósito.

## Eventos

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`
- **Eventos por vida:** 37,7 · **com causa anterior (cadeia):** 13,2 · **maior distância causa→consequência:** 50,6 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,8%

<details><summary>Frequência de cada evento (% das vidas em que aparece)</summary>

| Evento | Vidas |
|---|---|
| `primeira_palavra` | 100,0% |
| `primeiro_dia_escola` | 100,0% |
| `enem` | 99,9% |
| `namoro` | 89,4% |
| `golpe_pix` | 88,6% |
| `pais_envelhecem` | 88,1% |
| `carro` | 87,9% |
| `primeiro_investimento` | 85,7% |
| `criptomoeda` | 82,9% |
| `luto_pais` | 82,5% |
| `bet` | 80,8% |
| `hobby_horta` | 80,8% |
| `aposentadoria` | 79,7% |
| `casa_propria` | 77,1% |
| `juros_compostos` | 76,6% |
| `investimento_rotina` | 76,2% |
| `demissao` | 72,8% |
| `sair_de_casa` | 68,0% |
| `reencontro_amigo` | 65,9% |
| `primeiro_emprego` | 60,2% |
| `promocao` | 59,9% |
| `cartao_credito` | 57,7% |
| `primeiro_beijo` | 57,0% |
| `cachorro_caramelo` | 56,4% |
| `voltar_estudar` | 54,1% |
| `festa_junina` | 53,9% |
| `vape_festa` | 51,5% |
| `banda_garagem` | 51,4% |
| `bullying_recreio` | 51,2% |
| `primeiro_celular` | 50,5% |
| `hidroginastica` | 49,1% |
| `esporte_depois_da_aula` | 48,8% |
| `vicio_aposta` | 48,1% |
| `desempregado` | 47,1% |
| `crise_40` | 45,2% |
| `queda` | 44,9% |
| `creche_ou_vo` | 44,0% |
| `festa_tema` | 41,8% |
| `formatura` | 41,0% |
| `mesada` | 40,9% |
| `pressao_alta` | 40,8% |
| `feira_ciencias` | 40,6% |
| `emprego_formado` | 38,4% |
| `testamento` | 37,0% |
| `entregador_chuva` | 36,5% |
| `festa_sem_pais` | 36,2% |
| `maratona` | 34,4% |
| `tosse_cronica` | 29,2% |
| `ainda_mora_com_pais` | 27,4% |
| `show_no_bar` | 26,4% |
| `titulo_eleitor` | 25,1% |
| `faculdade_vida` | 24,4% |
| `casamento` | 23,6% |
| `vereador` | 21,2% |
| `intercambio` | 19,8% |
| `nome_sujo` | 18,4% |
| `festa_80` | 18,2% |
| `filho` | 17,2% |
| `viralizou` | 16,8% |
| `vo_partiu` | 16,3% |
| `renegociar_divida` | 15,3% |
| `separacao` | 15,2% |
| `sociedade_amigo` | 14,5% |
| `caramelo_velhinho` | 13,4% |
| `olimpiada_matematica` | 13,0% |
| `filho_adolescente` | 12,9% |
| `vo_receita` | 11,8% |
| `filho_formatura` | 11,6% |
| `peneira` | 11,2% |
| `reencontro_paixao` | 10,1% |
| `confeitaria_da_vo` | 9,7% |
| `netos` | 9,3% |
| `burnout` | 9,1% |
| `mei_negocio` | 7,6% |
| `volta_terra` | 5,4% |
| `prova_concurso` | 3,7% |
| `rebaixamento` | 3,6% |
| `chefe_amigo` | 2,6% |
| `carreira_futebol` | 1,2% |
| `fim_carreira` | 0,4% |

</details>

## Marcas

- **Criadas na simulação:** 76 · **mudaram algo em pelo menos uma vida** (evento, escolha, linha, causa de morte, efeito passivo ou epitáfio): 76
- **Marcas que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,9 · p10 60 · p25 66 · mediana 73 · p75 79 · p90 83

```
até 19                                        0,1%
20–29                                         0,1%
30–39                                         0,2%
40–49          █                              1,5%
50–59          ██████                         7,9%
60–69          ███████████████████            26,8%
70–79          ██████████████████████████████ 41,2%
80–89          ████████████████               21,7%
90–99                                         0,6%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 47 mil · p25 R$ 169 mil · mediana R$ 373 mil · p75 R$ 672 mil · p90 R$ 1,1 milhão

```
negativo       ███                            5,5%
até 10 mil                                    0,7%
10–50 mil      ██                             4,2%
50–200 mil     ██████████                     19,3%
200 mil–1 mi   ██████████████████████████████ 58,9%
1 mi+          ██████                         11,4%
```

**Felicidade média ao longo da vida** — p10 64 · mediana 71 · p90 78

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,1%
50–59          ██                             3,0%
60–69          █████████████████████          38,2%
70–79          ██████████████████████████████ 53,6%
80+            ███                            5,0%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |
|---|---|---|---|---|---|---|---|
| primeira | 71,8 | R$ 389 mil | 71,1 | 36,7 | 11,8 | 100% | 93% |
| cautelosa | 77,5 🏆 | R$ 584 mil 🏆 | 71,3 | 39,0 | 12,2 | 100% | 93% |
| arriscada | 66,7 | R$ 370 mil | 73,8 🏆 | 38,0 | 16,2 | 100% | 89% |
| aleatoria | 71,7 | R$ 166 mil | 67,8 | 37,3 | 12,7 | 100% | 87% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,0% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,3% — de um AVC, numa terça-feira sem graça
- 9,2% — de complicações pulmonares, entre uma tosse e outra
- 9,1% — de pneumonia, depois de teimar que era só uma gripe
- 7,3% — de complicações de uma queda no banheiro
- 5,8% — numa cirurgia simples que não foi tão simples
- 4,4% — em paz, no meio de uma soneca que era para ser rápida
