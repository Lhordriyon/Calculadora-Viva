# Roteiro

Estado de cada nível da fase 2 (life simulator). Qualquer sessão continua daqui: leia este arquivo, `docs/decisoes.md` e `docs/metricas.md`.

A visão: o jogador pensa "eu posso tentar qualquer coisa", e o jogo responde "pode, mas o mundo vai reagir". Poucos sistemas fundamentais, milhares de combinações, interface simples, uma vida em minutos.

## Invariantes

1. **Um formato de estado.** Pessoa, lugar e jurisdição (depois empresa) são entidades com id, tipo, campos e qualidades. Condições e efeitos leem e escrevem caminhos (`mae.saude`, `lugar.desemprego`).
2. **Um formato de conteúdo.** Evento (o diretor escolhe), ação (o jogador escolhe) e ação de personagem (a regra do personagem escolhe) são o mesmo storylet: condições, saliência, texto com modelo, opções e efeitos.
3. **Uma causa por mutação.** Toda mudança de estado registra quem a causou: escolha, ação, diretor, personagem ou regra. Pontos de virada e a crônica saem desse livro-razão.

## Níveis

| Nível | Conteúdo | Estado |
|---|---|---|
| 1. Fundamentos | livro-razão causal; entidades com qualidades; storylets por saliência; validador (≥2 leitores por campo, ações com efeitos em ≥2 sistemas) | em construção (incremento 1) |
| 2. Agência | fichas de ação por ano; origem procedural | mínimo no incremento 1 (1 ficha, 6 verbos; 6 classes × 4 tipos de família) |
| 3. Mundo | balanço por entidade, setores por UF, jurisdição em dados | a fazer |
| 4. Pessoas | relações como arestas, NPCs com nível de detalhe, regras anuais, herdeiro | mínimo no incremento 1 (família viva) |
| 5. Riqueza e poder | empresas, ativos, status, cargos | a fazer |
| 6. Sandbox | política, países, narradores, vida do dia | a fazer |

## Incremento 1: família viva + origem que importa + uma ficha por ano

- [x] Linha de base das métricas novas (ver `docs/decisoes.md`)
- [ ] Estado em entidades e caminhos; livro-razão com causa por mutação
- [ ] Storylets unificados (evento, ação, ação de personagem) e diretor por saliência
- [ ] Família viva: mãe, pai, avó e amigo com idade, saúde, dinheiro, ocupação, traço e vínculo; envelhecem, adoecem, morrem, perdem e ganham emprego, ajudam ou não
- [ ] Origem: 6 classes × 4 tipos de família × traços; "escolher origem" opcional
- [ ] Uma ficha por ano com 6 verbos (estudar, trabalhar extra, cuidar da saúde, visitar a família, sair/namorar, poupar/investir)
- [ ] ~20 eventos reescritos para ler família e origem
- [ ] Validador: ≥2 leitores por campo escrito; ações com efeitos em ≥2 sistemas
- [ ] Save v2 (reinício limpo com aviso; memória entre vidas preservada)
- [ ] Portões: saturação V5 ≤ 80%; assinaturas ≥ 845/1.000; desvio da felicidade ≥ 7,45; toques ≤ 155; nenhuma estratégia dominante

## Como uma sessão continua

1. `npm run verificar` precisa passar antes de qualquer push.
2. Rode `npm run tunel` e compare com a tabela de portões em `docs/decisoes.md`.
3. Atualize as caixas acima e a tabela de níveis quando algo entrar.
