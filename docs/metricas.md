# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 250 jogadores × 10 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 80 eventos, 213 escolhas, 101 linhas, 29 cadeias de 3+ anos.

## Metas da fase 1

| Meta | Situação | Detalhe |
|---|---|---|
| Zero eventos mortos | ✅ | 0 mortos |
| Nenhum evento não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Repetição

- **Dentro de uma vida:** 16,3% das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: 38,3%.
- **Entre vidas (2ª à 10ª):** em média 92,0% dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; 64,6% já tinham aparecido na vida imediatamente anterior.
- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, 1000 vidas): vista na vida anterior 64,3% sem memória → 60,4% com memória; vista em qualquer vida anterior 89,3% → 88,9%.

| Vida | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª | 8ª | 9ª | 10ª |
|---|---|---|---|---|---|---|---|---|---|
| Já visto antes | 63% | 85% | 93% | 96% | 97% | 98% | 98% | 99% | 99% |

Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): `investimento_rotina` 2,9 · `exame_rotina` 2,5 · `golpe_pix` 2,1 · `namoro` 1,9 · `promocao` 1,2 · `entregador_chuva` 1,2

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `queda`, `vo_partiu`
- **Sem tensão entre risco e recompensa** (a opção mais segura também tem o maior valor esperado): 50 de 80 eventos.

## Eventos

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** nenhum
- **Eventos por vida:** 46,3 · **com causa anterior (cadeia):** 17,4 · **maior distância causa→consequência:** 50,5 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada evento (% das vidas em que aparece)</summary>

| Evento | Vidas |
|---|---|
| `primeira_palavra` | 100,0% |
| `primeiro_dia_escola` | 100,0% |
| `enem` | 99,8% |
| `namoro` | 94,3% |
| `pais_envelhecem` | 90,5% |
| `golpe_pix` | 90,4% |
| `carro` | 89,8% |
| `criptomoeda` | 86,6% |
| `bet` | 85,6% |
| `luto_pais` | 84,8% |
| `exame_rotina` | 83,7% |
| `primeiro_investimento` | 80,0% |
| `hobby_horta` | 77,8% |
| `casa_propria` | 77,5% |
| `sair_de_casa` | 75,4% |
| `investimento_rotina` | 74,9% |
| `aposentadoria` | 74,8% |
| `juros_compostos` | 74,7% |
| `demissao` | 72,8% |
| `primeiro_beijo` | 67,8% |
| `cachorro_caramelo` | 65,6% |
| `cartao_credito` | 63,6% |
| `festa_junina` | 63,2% |
| `reencontro_amigo` | 63,0% |
| `vape_festa` | 61,3% |
| `banda_garagem` | 60,6% |
| `promocao` | 59,2% |
| `bullying_recreio` | 58,7% |
| `primeiro_celular` | 58,0% |
| `esporte_depois_da_aula` | 57,7% |
| `voltar_estudar` | 57,0% |
| `primeiro_emprego` | 56,9% |
| `vicio_aposta` | 51,1% |
| `creche_ou_vo` | 50,0% |
| `casamento` | 49,1% |
| `feira_ciencias` | 49,0% |
| `mesada` | 49,0% |
| `festa_tema` | 48,5% |
| `crise_40` | 48,5% |
| `desempregado` | 48,1% |
| `show_no_bar` | 46,0% |
| `pressao_alta` | 45,7% |
| `queda` | 44,8% |
| `festa_sem_pais` | 44,4% |
| `maratona` | 43,8% |
| `hidroginastica` | 40,6% |
| `formatura` | 40,1% |
| `filho` | 39,2% |
| `entregador_chuva` | 37,2% |
| `testamento` | 36,8% |
| `separacao` | 34,4% |
| `tosse_cronica` | 34,2% |
| `ainda_mora_com_pais` | 33,4% |
| `sociedade_amigo` | 33,3% |
| `filho_adolescente` | 32,6% |
| `emprego_formado` | 32,6% |
| `titulo_eleitor` | 30,8% |
| `filho_formatura` | 29,9% |
| `burnout` | 27,5% |
| `caramelo_velhinho` | 27,3% |
| `peneira` | 26,4% |
| `netos` | 25,9% |
| `vereador` | 25,7% |
| `faculdade_vida` | 25,6% |
| `festa_80` | 23,5% |
| `reencontro_paixao` | 21,6% |
| `nome_sujo` | 20,9% |
| `intercambio` | 20,9% |
| `vo_partiu` | 18,4% |
| `viralizou` | 18,3% |
| `olimpiada_matematica` | 16,9% |
| `vo_receita` | 14,6% |
| `confeitaria_da_vo` | 11,8% |
| `carreira_futebol` | 9,3% |
| `mei_negocio` | 8,9% |
| `fim_carreira` | 6,1% |
| `volta_terra` | 6,1% |
| `rebaixamento` | 4,1% |
| `prova_concurso` | 3,9% |
| `chefe_amigo` | 3,0% |

</details>

## Marcas

- **Criadas na simulação:** 76 · **mudaram algo em pelo menos uma vida** (evento, escolha, linha, causa de morte, efeito passivo ou epitáfio): 76
- **Marcas que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,9 · p10 58 · p25 64 · mediana 73 · p75 80 · p90 85

```
até 19                                        0,1%
20–29                                         0,1%
30–39                                         0,3%
40–49          ██                             1,8%
50–59          ██████████                     11,0%
60–69          ████████████████████████       26,6%
70–79          ██████████████████████████████ 33,2%
80–89          ██████████████████████         23,8%
90–99          ███                            3,1%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 -R$ 5,1 milhões · p25 R$ 241 mil · mediana R$ 742 mil · p75 R$ 1,4 milhão · p90 R$ 2,5 milhões

```
negativo       █████████████                  16,3%
até 10 mil                                    0,2%
10–50 mil      █                              0,7%
50–200 mil     ████                           5,8%
200 mil–1 mi   █████████████████████████████  38,1%
1 mi+          ██████████████████████████████ 38,9%
```

**Felicidade média ao longo da vida** — p10 62 · mediana 71 · p90 78

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,1%
50–59          ███                            5,5%
60–69          █████████████████████████      40,1%
70–79          ██████████████████████████████ 47,6%
80+            ████                           6,7%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |
|---|---|---|---|---|---|---|---|
| primeira | 74,0 | R$ 1,3 milhão 🏆 | 73,0 🏆 | 47,1 | 19,8 | 100% | 93% |
| cautelosa | 79,7 🏆 | R$ 1,1 milhão | 70,9 | 49,5 | 15,2 | 100% | 95% |
| arriscada | 63,2 | R$ 497 mil | 70,2 | 43,2 | 19,1 | 100% | 92% |
| aleatoria | 70,8 | R$ 275 mil | 67,5 | 45,3 | 15,6 | 100% | 89% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 10,0% — num hospital do SUS que fez tudo o que podia, e fez muito
- 9,8% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 9,3% — de um AVC, numa terça-feira sem graça
- 8,8% — de complicações pulmonares, entre uma tosse e outra
- 7,5% — de pneumonia, depois de teimar que era só uma gripe
- 6,7% — num acidente de moto numa avenida molhada
- 6,5% — de complicações de uma queda no banheiro
- 5,8% — de um infarto no meio de uma discussão sobre futebol
