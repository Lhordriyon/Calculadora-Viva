# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 250 jogadores × 10 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 80 eventos, 214 escolhas, 111 linhas, 29 cadeias de 3+ anos.

## Metas da fase 1

| Meta | Situação | Detalhe |
|---|---|---|
| Zero eventos mortos | ✅ | 0 mortos |
| Nenhum evento não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Repetição

- **Dentro de uma vida:** 10,5% das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: 36,4%.
- **Entre vidas (2ª à 10ª):** em média 90,7% dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; 61,4% já tinham aparecido na vida imediatamente anterior.
- **Texto repetido entre vidas:** 39,9% dos textos de uma vida (eventos e linhas, já renderizados) são idênticos a algum texto de uma vida anterior. As alternâncias `[a|b]` existem para baixar este número.
- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, 1000 vidas): vista na vida anterior 62,0% sem memória → 55,3% com memória; vista em qualquer vida anterior 87,6% → 86,9%.

| Vida | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª | 8ª | 9ª | 10ª |
|---|---|---|---|---|---|---|---|---|---|
| Já visto antes | 60% | 82% | 91% | 95% | 96% | 97% | 98% | 98% | 99% |

Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): `namoro` 1,7 · `investimento_rotina` 1,6 · `aposentadoria` 1,4 · `entregador_chuva` 1,0 · `vicio_aposta` 1,0 · `promocao` 0,9

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `vo_partiu`
- **Arriscar nunca compensa** (há opção arriscada, mas a mais segura também tem o maior valor esperado, num estado típico da idade): 10 de 80 eventos — `creche_ou_vo`, `esporte_depois_da_aula`, `vape_festa`, `bet`, `vicio_aposta`, `casamento`, `filho`, `burnout`, `pressao_alta`, `queda`. Algumas são armadilhas de propósito.

## Eventos

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** `fim_carreira`
- **Eventos por vida:** 37,8 · **com causa anterior (cadeia):** 13,3 · **maior distância causa→consequência:** 50,8 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada evento (% das vidas em que aparece)</summary>

| Evento | Vidas |
|---|---|
| `primeira_palavra` | 100,0% |
| `primeiro_dia_escola` | 100,0% |
| `enem` | 99,9% |
| `namoro` | 89,2% |
| `golpe_pix` | 88,6% |
| `carro` | 88,2% |
| `pais_envelhecem` | 88,1% |
| `primeiro_investimento` | 85,7% |
| `criptomoeda` | 82,8% |
| `luto_pais` | 82,6% |
| `hobby_horta` | 80,7% |
| `aposentadoria` | 80,1% |
| `bet` | 79,9% |
| `casa_propria` | 77,9% |
| `investimento_rotina` | 76,6% |
| `juros_compostos` | 76,5% |
| `demissao` | 72,5% |
| `sair_de_casa` | 68,8% |
| `reencontro_amigo` | 66,5% |
| `promocao` | 60,3% |
| `primeiro_emprego` | 59,6% |
| `cartao_credito` | 58,1% |
| `primeiro_beijo` | 57,4% |
| `cachorro_caramelo` | 56,6% |
| `festa_junina` | 54,1% |
| `voltar_estudar` | 53,7% |
| `banda_garagem` | 51,2% |
| `bullying_recreio` | 51,0% |
| `vape_festa` | 50,8% |
| `primeiro_celular` | 50,8% |
| `hidroginastica` | 49,3% |
| `esporte_depois_da_aula` | 48,4% |
| `vicio_aposta` | 47,5% |
| `desempregado` | 46,8% |
| `crise_40` | 44,8% |
| `queda` | 44,2% |
| `creche_ou_vo` | 44,1% |
| `festa_tema` | 41,8% |
| `formatura` | 41,6% |
| `feira_ciencias` | 40,8% |
| `mesada` | 40,2% |
| `pressao_alta` | 40,1% |
| `emprego_formado` | 39,1% |
| `entregador_chuva` | 36,5% |
| `testamento` | 36,1% |
| `festa_sem_pais` | 36,0% |
| `maratona` | 34,4% |
| `tosse_cronica` | 28,2% |
| `ainda_mora_com_pais` | 28,0% |
| `show_no_bar` | 26,0% |
| `titulo_eleitor` | 25,5% |
| `faculdade_vida` | 25,1% |
| `casamento` | 24,1% |
| `vereador` | 21,4% |
| `intercambio` | 20,0% |
| `nome_sujo` | 18,2% |
| `festa_80` | 17,5% |
| `viralizou` | 17,3% |
| `filho` | 17,3% |
| `vo_partiu` | 16,7% |
| `separacao` | 15,5% |
| `renegociar_divida` | 15,3% |
| `sociedade_amigo` | 14,6% |
| `caramelo_velhinho` | 14,0% |
| `olimpiada_matematica` | 13,1% |
| `filho_adolescente` | 12,9% |
| `vo_receita` | 11,7% |
| `peneira` | 11,6% |
| `filho_formatura` | 11,6% |
| `reencontro_paixao` | 10,2% |
| `confeitaria_da_vo` | 9,3% |
| `netos` | 9,3% |
| `burnout` | 9,1% |
| `mei_negocio` | 7,6% |
| `volta_terra` | 5,1% |
| `prova_concurso` | 3,7% |
| `rebaixamento` | 3,5% |
| `chefe_amigo` | 2,5% |
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
20–29                                         0,0%
30–39                                         0,2%
40–49          █                              1,5%
50–59          ██████                         7,9%
60–69          ███████████████████            26,4%
70–79          ██████████████████████████████ 42,3%
80–89          ███████████████                20,9%
90–99                                         0,7%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 50 mil · p25 R$ 170 mil · mediana R$ 376 mil · p75 R$ 677 mil · p90 R$ 1,1 milhão

```
negativo       ███                            5,6%
até 10 mil                                    0,6%
10–50 mil      ██                             3,7%
50–200 mil     ██████████                     19,1%
200 mil–1 mi   ██████████████████████████████ 59,0%
1 mi+          ██████                         11,9%
```

**Felicidade média ao longo da vida** — p10 64 · mediana 71 · p90 78

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,2%
50–59          ██                             3,0%
60–69          ██████████████████████         38,2%
70–79          ██████████████████████████████ 53,2%
80+            ███                            5,5%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |
|---|---|---|---|---|---|---|---|
| primeira | 71,5 | R$ 384 mil | 71,1 | 36,5 | 11,8 | 100% | 93% |
| cautelosa | 77,4 🏆 | R$ 600 mil 🏆 | 71,3 | 39,0 | 12,3 | 100% | 93% |
| arriscada | 66,7 | R$ 373 mil | 73,8 🏆 | 38,0 | 16,3 | 100% | 89% |
| aleatoria | 72,0 | R$ 164 mil | 67,8 | 37,5 | 12,8 | 100% | 87% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 12,4% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,8% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 10,9% — de um AVC, numa terça-feira sem graça
- 9,6% — de pneumonia, depois de teimar que era só uma gripe
- 8,9% — de complicações pulmonares, entre uma tosse e outra
- 7,0% — de complicações de uma queda no banheiro
- 5,7% — numa cirurgia simples que não foi tão simples
- 4,7% — em paz, no meio de uma soneca que era para ser rápida
