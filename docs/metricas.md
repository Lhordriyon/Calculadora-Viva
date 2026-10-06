# Métricas do túnel de vento

Gerado por `npm run tunel`. Não edite à mão: rode o túnel e faça commit do resultado.

**10.000 vidas** (4 estratégias × 125 jogadores × 20 vidas seguidas, com memória entre vidas) · semente 20261006 · conteúdo: 80 eventos, 214 escolhas, 111 linhas, 29 cadeias de 3+ anos.

## Metas da fase 1

| Meta | Situação | Detalhe |
|---|---|---|
| Zero eventos mortos | ✅ | 0 mortos |
| Nenhum evento não-repetível repetido na mesma vida | ✅ | 0 repetições |
| Nenhuma estratégia fixa domina | ✅ | nenhuma domina |

## Repetição

- **Dentro de uma vida:** 10,5% das aparições de evento repetem um evento já visto na mesma vida (só repetíveis podem); pior vida: 36,4%.
- **Entre vidas (2ª à 10ª):** em média 95,3% dos eventos de uma vida já tinham aparecido em alguma vida anterior do mesmo jogador; 61,7% já tinham aparecido na vida imediatamente anterior.
- **Texto repetido entre vidas:** 53,3% dos textos de uma vida (eventos e linhas, já renderizados) são idênticos a algum texto de uma vida anterior. As alternâncias `[a|b]` existem para baixar este número.
- **Efeito da memória entre vidas** (estratégia aleatória, mesmas sementes, 1000 vidas): vista na vida anterior 61,8% sem memória → 55,9% com memória; vista em qualquer vida anterior 93,4% → 93,2%.

| Vida | 2ª | 3ª | 4ª | 5ª | 10ª | 15ª | 20ª |
|---|---|---|---|---|---|---|---|
| Já visto antes | 60% | 82% | 91% | 95% | 99% | 100% | 100% |

Eventos que mais se repetem dentro da mesma vida (repetições a cada 100 aparições de evento): `namoro` 1,7 · `investimento_rotina` 1,6 · `aposentadoria` 1,4 · `entregador_chuva` 1,0 · `vicio_aposta` 1,0 · `promocao` 0,9

## Life simulator (critérios de aceitação)

| Métrica | Valor |
|---|---|
| Saturação V5 (instâncias da 5ª vida já vistas antes) | 94,5% |
| Saturação V20 | 99,9% |
| Assinaturas de vida distintas por 1.000 vidas (sem a origem) | 563 (412) |
| Mobilidade: mesmo quintil da origem ao fim | 23,8% |
| Mobilidade: correlação de postos origem × fim (Spearman) | 0,13 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,8% / 17,3% |
| Patrimônio p90/p10 | 22,3× (p10 R$ 49 mil, p90 R$ 1,1 milhão) |
| Desvio-padrão da felicidade média da vida | 5,73 |
| Vidas com patrimônio negativo ao morrer | 5,7% |
| Mudanças de estado causadas pelo jogador | 24,8% |
| Toques por vida | 110,8 |
| Tempo de CPU por vida | 2,64 ms |

Matriz de mobilidade (linhas: quintil de riqueza da origem; colunas: quintil do patrimônio ao morrer):

| Origem ↓ / Fim → | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| Q1 | 23% | 22% | 21% | 20% | 15% |
| Q2 | 22% | 21% | 23% | 19% | 15% |
| Q3 | 18% | 20% | 20% | 22% | 20% |
| Q4 | 19% | 19% | 20% | 23% | 19% |
| Q5 | 17% | 18% | 16% | 17% | 32% |

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
| `namoro` | 89,4% |
| `pais_envelhecem` | 88,9% |
| `golpe_pix` | 88,8% |
| `carro` | 88,2% |
| `primeiro_investimento` | 85,6% |
| `luto_pais` | 83,2% |
| `criptomoeda` | 83,0% |
| `hobby_horta` | 80,6% |
| `bet` | 80,5% |
| `aposentadoria` | 79,3% |
| `casa_propria` | 77,8% |
| `investimento_rotina` | 76,4% |
| `juros_compostos` | 76,3% |
| `demissao` | 72,4% |
| `sair_de_casa` | 69,2% |
| `reencontro_amigo` | 66,5% |
| `promocao` | 59,9% |
| `primeiro_emprego` | 59,5% |
| `cartao_credito` | 58,2% |
| `cachorro_caramelo` | 56,9% |
| `primeiro_beijo` | 56,8% |
| `festa_junina` | 54,2% |
| `voltar_estudar` | 54,0% |
| `bullying_recreio` | 51,8% |
| `banda_garagem` | 51,3% |
| `vape_festa` | 50,8% |
| `primeiro_celular` | 50,2% |
| `esporte_depois_da_aula` | 49,5% |
| `hidroginastica` | 49,1% |
| `vicio_aposta` | 48,0% |
| `desempregado` | 46,3% |
| `crise_40` | 45,0% |
| `queda` | 44,7% |
| `creche_ou_vo` | 43,8% |
| `formatura` | 41,7% |
| `festa_tema` | 41,5% |
| `feira_ciencias` | 41,3% |
| `mesada` | 41,1% |
| `pressao_alta` | 40,6% |
| `emprego_formado` | 39,0% |
| `testamento` | 36,9% |
| `entregador_chuva` | 36,3% |
| `festa_sem_pais` | 36,3% |
| `maratona` | 35,1% |
| `tosse_cronica` | 28,6% |
| `ainda_mora_com_pais` | 28,5% |
| `show_no_bar` | 26,3% |
| `titulo_eleitor` | 25,5% |
| `faculdade_vida` | 25,4% |
| `casamento` | 23,7% |
| `vereador` | 21,7% |
| `intercambio` | 20,3% |
| `festa_80` | 18,0% |
| `nome_sujo` | 17,8% |
| `filho` | 17,1% |
| `viralizou` | 16,9% |
| `vo_partiu` | 16,3% |
| `separacao` | 15,4% |
| `renegociar_divida` | 15,4% |
| `sociedade_amigo` | 15,0% |
| `caramelo_velhinho` | 14,2% |
| `filho_adolescente` | 12,8% |
| `olimpiada_matematica` | 12,7% |
| `peneira` | 11,9% |
| `vo_receita` | 11,8% |
| `filho_formatura` | 11,4% |
| `reencontro_paixao` | 10,6% |
| `confeitaria_da_vo` | 9,4% |
| `netos` | 9,3% |
| `burnout` | 8,9% |
| `mei_negocio` | 7,5% |
| `volta_terra` | 5,3% |
| `prova_concurso` | 3,5% |
| `rebaixamento` | 3,5% |
| `chefe_amigo` | 2,9% |
| `carreira_futebol` | 1,4% |
| `fim_carreira` | 0,5% |

</details>

## Marcas

- **Criadas na simulação:** 76 · **mudaram algo em pelo menos uma vida** (evento, escolha, linha, causa de morte, efeito passivo ou epitáfio): 76
- **Marcas que nunca dispararam nada:** nenhuma

## Distribuições

**Idade de morte** — média 72,0 · p10 60 · p25 66 · mediana 73 · p75 79 · p90 83

```
até 19                                        0,1%
20–29                                         0,1%
30–39                                         0,2%
40–49          █                              1,3%
50–59          ██████                         8,3%
60–69          ███████████████████            26,4%
70–79          ██████████████████████████████ 41,2%
80–89          ████████████████               21,7%
90–99          █                              0,8%
100+                                          0,0%
```

**Patrimônio ao morrer** (reais de hoje) — p10 R$ 49 mil · p25 R$ 168 mil · mediana R$ 375 mil · p75 R$ 678 mil · p90 R$ 1,1 milhão

```
negativo       ███                            5,7%
até 10 mil                                    0,6%
10–50 mil      ██                             3,8%
50–200 mil     ██████████                     18,9%
200 mil–1 mi   ██████████████████████████████ 59,0%
1 mi+          ██████                         11,9%
```

**Felicidade média ao longo da vida** — p10 64 · mediana 71 · p90 78

```
até 29                                        0,0%
30–39                                         0,0%
40–49                                         0,1%
50–59          ██                             3,1%
60–69          █████████████████████          37,7%
70–79          ██████████████████████████████ 53,2%
80+            ███                            5,8%
```

## Estratégias

Uma estratégia fixa que vence todas as outras nos três critérios (idade, patrimônio e felicidade) significa que o jogo tem resposta certa.

| Estratégia | Idade média de morte | Patrimônio mediano | Felicidade média | Eventos por vida | Eventos com causa | Vidas com 3 viradas | Repetição entre vidas |
|---|---|---|---|---|---|---|---|
| primeira | 71,5 | R$ 376 mil | 71,1 | 36,5 | 11,8 | 100% | 97% |
| cautelosa | 77,6 🏆 | R$ 596 mil 🏆 | 71,4 | 39,1 | 12,3 | 100% | 97% |
| arriscada | 66,7 | R$ 368 mil | 73,9 🏆 | 38,1 | 16,3 | 100% | 95% |
| aleatoria | 72,1 | R$ 169 mil | 67,9 | 37,6 | 12,9 | 100% | 93% |

Nenhuma estratégia fixa vence nos três critérios.

### Causas de morte mais comuns

- 11,9% — num hospital do SUS que fez tudo o que podia, e fez muito
- 11,6% — de câncer, depois de uma luta longa e cheia de piadas ruins
- 11,3% — de um AVC, numa terça-feira sem graça
- 9,5% — de pneumonia, depois de teimar que era só uma gripe
- 8,9% — de complicações pulmonares, entre uma tosse e outra
- 7,1% — de complicações de uma queda no banheiro
- 5,9% — numa cirurgia simples que não foi tão simples
- 4,5% — em paz, no meio de uma soneca que era para ser rápida

## Como medimos

- **Saturação Vk:** das instâncias de storylet distintas apresentadas na k-ésima vida de um jogador (eventos do diretor e de personagens; ações do jogador e linhas curtas não contam), a fração que já tinha aparecido em alguma vida anterior do mesmo jogador. Instância = storylet + quem ele envolve + variante escolhida pelo estado; alternâncias de texto não contam.
- **Assinatura da vida:** origem (classe e tipo de família), classe final (6 faixas de patrimônio), carreira, estado civil, marca principal (a que mais causou eventos depois) e categoria da causa da morte. Contamos as distintas em blocos intercalados de 1.000 vidas; entre parênteses, a mesma conta sem a origem.
- **Mobilidade:** quintis da riqueza de origem × quintis do patrimônio ao morrer. Nem determinista (tudo na diagonal) nem aleatória (correlação perto de zero).
- **Mudança de estado:** atributo que andou 0,5 ponto ou mais, patrimônio R$ 500 ou mais, renda R$ 600 por ano ou mais, marca ganha ou perdida, personagem novo. É do jogador quando acontece numa escolha ou ação dele.
- **Toques:** nascer + um por ano vivido + um por escolha.
