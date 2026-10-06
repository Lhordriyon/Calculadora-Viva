# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 250 jogadores × 10 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 80 eventos, 212 escolhas, 101 linhas, 31 cadeias de 3+ anos.

## Metas da fase 1

| Meta | Situação | Detalhe |
|---|---|---|
| Zero eventos mortos | ✅ | 0 mortos |
| Nenhum evento não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Repetição

- **Dentro de uma vida:** 16,8% das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: 38,2%.
- **Entre vidas (2ª à 10ª):** em média 92,1% dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; 65,4% já tinham aparecido na vida imediatamente anterior.
- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, 1000 vidas): vista na vida anterior 64,6% sem memória → 61,0% com memória; vista em qualquer vida anterior 89,0% → 88,7%.

| Vida | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª | 8ª | 9ª | 10ª |
|---|---|---|---|---|---|---|---|---|---|
| Já visto antes | 64% | 85% | 92% | 96% | 97% | 98% | 98% | 99% | 99% |

Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): `exame_rotina` 2,9 · `golpe_pix` 2,3 · `namoro` 2,2 · `investimento_rotina` 2,0 · `promocao` 1,4 · `entregador_chuva` 1,3

## Dilemas

- **Falsos dilemas** (uma opção é melhor ou igual em tudo, com as mesmas consequências futuras): `queda`, `vo_partiu`
- **Sem tensão entre risco e recompensa** (a opção mais segura também tem o maior valor esperado): 50 de 80 eventos.

## Eventos

- **Mortos (nunca aparecem):** nenhum
- **Raros (em menos de 0,5% das vidas):** nenhum
- **Eventos por vida:** 45,9 · **com causa anterior (cadeia):** 17,2 · **maior distância causa→consequência:** 50,4 anos em média
- **Vidas com 3 pontos de virada no cartão:** 99,9%

<details><summary>Frequência de cada evento (% das vidas em que aparece)</summary>

| Evento | Vidas |
|---|---|
| `primeira_palavra` | 100,0% |
| `primeiro_dia_escola` | 100,0% |
| `enem` | 99,8% |
| `namoro` | 96,2% |
| `pais_envelhecem` | 93,4% |
| `carro` | 92,8% |
| `golpe_pix` | 92,6% |
| `criptomoeda` | 90,9% |
| `bet` | 88,6% |
| `luto_pais` | 87,4% |
| `exame_rotina` | 87,2% |
| `hobby_horta` | 81,2% |
| `casa_propria` | 80,0% |
| `sair_de_casa` | 78,0% |
| `aposentadoria` | 74,7% |
| `demissao` | 74,2% |
| `primeiro_beijo` | 67,8% |
| `cartao_credito` | 66,5% |
| `cachorro_caramelo` | 65,6% |
| `reencontro_amigo` | 64,5% |
| `festa_junina` | 63,2% |
| `promocao` | 61,7% |
| `vape_festa` | 61,2% |
| `banda_garagem` | 60,6% |
| `bullying_recreio` | 58,7% |
| `primeiro_celular` | 58,0% |
| `voltar_estudar` | 58,0% |
| `esporte_depois_da_aula` | 57,7% |
| `primeiro_emprego` | 56,9% |
| `vicio_aposta` | 53,3% |
| `crise_40` | 53,0% |
| `casamento` | 51,5% |
| `desempregado` | 50,0% |
| `creche_ou_vo` | 50,0% |
| `feira_ciencias` | 49,0% |
| `mesada` | 49,0% |
| `festa_tema` | 48,5% |
| `pressao_alta` | 48,0% |
| `show_no_bar` | 47,0% |
| `queda` | 45,3% |
| `maratona` | 44,7% |
| `festa_sem_pais` | 44,4% |
| `juros_compostos` | 41,9% |
| `filho` | 41,7% |
| `hidroginastica` | 41,4% |
| `investimento_rotina` | 41,1% |
| `formatura` | 40,1% |
| `separacao` | 37,6% |
| `entregador_chuva` | 37,4% |
| `testamento` | 36,6% |
| `ainda_mora_com_pais` | 35,8% |
| `tosse_cronica` | 34,5% |
| `filho_adolescente` | 34,3% |
| `sociedade_amigo` | 33,9% |
| `emprego_formado` | 32,7% |
| `filho_formatura` | 31,5% |
| `titulo_eleitor` | 30,8% |
| `burnout` | 29,5% |
| `netos` | 27,6% |
| `caramelo_velhinho` | 27,3% |
| `peneira` | 26,4% |
| `vereador` | 26,1% |
| `faculdade_vida` | 25,8% |
| `festa_80` | 23,4% |
| `nome_sujo` | 22,3% |
| `reencontro_paixao` | 22,1% |
| `intercambio` | 21,4% |
| `primeiro_investimento` | 20,7% |
| `vo_partiu` | 18,4% |
| `viralizou` | 18,4% |
| `olimpiada_matematica` | 16,9% |
| `vo_receita` | 14,6% |
| `confeitaria_da_vo` | 11,9% |
| `carreira_futebol` | 9,3% |
| `mei_negocio` | 9,0% |
| `fim_carreira` | 6,2% |
| `volta_terra` | 6,0% |
| `rebaixamento` | 4,1% |
| `prova_concurso` | 3,9% |
| `chefe_amigo` | 3,0% |

</details>

## Marcas

- **Criadas na simulação:** 76 · **mudaram algo em pelo menos uma vida** (evento, escolha, linha, causa de morte, efeito passivo ou epitáfio): 76
- **Marcas que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 71,7 · p10 58 · p25 64 · mediana 73 · p75 80 · p90 85

```
até 19                                        0,1%
20–29                                         0,0%
30–39                                         0,3%
40–49          ██                             1,8%
50–59          ██████████                     11,5%
60–69          ███████████████████████        26,4%
70–79          ██████████████████████████████ 33,8%
80–89          █████████████████████          23,1%
90–99          ███                            3,0%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 -R$ 4,9 milhões · p25 R$ 108 mil · mediana R$ 294 mil · p75 R$ 744 mil · p90 R$ 1,6 milhão

```
negativo       ████████████                   17,1%
até 10 mil                                    0,3%
10–50 mil      █                              1,8%
50–200 mil     ████████████                   18,1%
200 mil–1 mi   ██████████████████████████████ 44,1%
1 mi+          █████████████                  18,6%
```

**Felicidade média ao longo da vida** — p10 62 · mediana 70 · p90 78

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,1%
50–59          ████                           5,7%
60–69          ██████████████████████████████ 44,3%
70–79          ██████████████████████████████ 43,6%
80+            ████                           6,3%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |
|---|---|---|---|---|---|---|---|
| primeira | 73,8 | R$ 322 mil | 72,9 🏆 | 46,4 | 19,5 | 100% | 93% |
| cautelosa | 79,7 🏆 | R$ 839 mil 🏆 | 70,2 | 49,4 | 15,1 | 100% | 95% |
| arriscada | 63,0 | R$ 242 mil | 69,8 | 43,0 | 18,7 | 100% | 92% |
| aleatoria | 70,5 | R$ 139 mil | 67,0 | 44,8 | 15,5 | 100% | 89% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 10,1% — num hospital do SUS que fez tudo o que podia, e fez muito
- 9,9% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 9,7% — de um AVC, numa terça-feira sem graça
- 8,8% — de complicações pulmonares, entre uma tosse e outra
- 6,8% — de pneumonia, depois de teimar que era só uma gripe
- 6,6% — de um infarto no meio de uma discussão sobre futebol
- 6,5% — num acidente de moto numa avenida molhada
- 5,6% — de complicações de uma queda no banheiro
