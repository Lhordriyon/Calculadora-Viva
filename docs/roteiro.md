# Roteiro

Estado de cada nível da fase 2 (life simulator). Qualquer sessão continua daqui: leia este arquivo, `docs/decisoes.md` e `docs/metricas.md`.

A visão: o jogador pensa "eu posso tentar qualquer coisa", e o jogo responde "pode, mas o mundo vai reagir". Poucos sistemas fundamentais, milhares de combinações, interface simples, uma vida em minutos.

Ritmo combinado com o dono (06/10/2026): incrementos que vão ao ar inteiros (jogáveis, medidos, publicados); depois do primeiro, seguir para o próximo nível enquanto os portões passarem, sem esperar ordem. Ao fim de cada incremento, relatório curto: o que mudou, métricas antes e depois, decisões tomadas sozinho, link e o que jogar.

## Invariantes

1. **Um formato de estado.** Pessoa, bicho, lugar e país (depois empresa) são entidades com id, tipo, campos e qualidades. Condições e efeitos leem e escrevem caminhos (`mae.saude`, `lugar.desemprego`).
2. **Um formato de conteúdo.** Evento (o diretor escolhe), ação (o jogador escolhe) e iniciativa de personagem (a regra do personagem escolhe) são o mesmo storylet.
3. **Uma causa por mutação.** Toda mudança de estado registra quem a causou: escolha, ação, diretor, personagem ou regra. Pontos de virada e a crônica saem desse livro-razão.

## Níveis

| Nível | Conteúdo | Estado |
|---|---|---|
| 1. Fundamentos | livro-razão causal; entidades com qualidades; storylets por saliência; validador (≥2 sistemas lendo cada campo, ações em ≥2 sistemas) | **feito** (incremento 1) |
| 2. Agência | fichas de ação por ano; origem procedural | mínimo feito: 1 ficha, 6 verbos; 6 classes × 4 tipos de família × traços. Falta: 2–3 fichas se o túnel pedir; famílias política, artística e com doença hereditária |
| 3. Mundo | balanço por entidade, setores por UF, jurisdição em dados | começo: lugar com região, desemprego e custo de vida; país com inflação. A fazer |
| 4. Pessoas | relações como arestas, NPCs com nível de detalhe, regras anuais, herdeiro | mínimo feito: família viva (regras anuais, traços, iniciativas, herança, viuvez), amor por regra. Falta: arestas entre NPCs, confiança e dívida, continuar como herdeiro |
| 5. Riqueza e poder | empresas, ativos, status, cargos | a fazer |
| 6. Sandbox | política, países, narradores, vida do dia | a fazer |

## Incremento 1: família viva + origem que importa + uma ficha por ano

- [x] Linha de base das métricas novas (ver `docs/decisoes.md`)
- [x] Estado em entidades e caminhos; livro-razão com causa por mutação
- [x] Storylets unificados (evento, ação, iniciativa de personagem) e diretor por saliência
- [x] Família viva: mãe, pai, avó e amigo com idade, saúde, dinheiro, ocupação, traço e vínculo; envelhecem, adoecem, morrem, perdem e ganham emprego, ajudam ou não
- [x] Origem: 6 classes × 4 tipos de família × traços; "escolher origem" opcional
- [x] Uma ficha por ano com 6 verbos (estudar, trabalhar extra, cuidar da saúde, ver a família, sair, poupar)
- [x] Eventos reescritos para ler família e origem (e 49 storylets novos de relações, região, classe e traço)
- [x] Validador: ≥2 sistemas lendo cada campo escrito, com uma leitura que decide; ações em ≥2 sistemas
- [x] Save v2 (reinício limpo com aviso; memória entre vidas preservada)
- [x] Portões: V5 77,0% (≤ 80%); assinaturas 893 (≥ 845); desvio da felicidade 8,57 (≥ 7,45); toques 115 (≤ 155); nenhuma estratégia dominante
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Próximo incremento (proposta)

**Riqueza como sistema + o mundo reage (níveis 3 e 5, mínimo):** carreira com setores (emprego, salário e demissão pelo setor e pelo ciclo da economia), ativos heterogêneos (imóvel, ações, renda fixa) e um negócio próprio com poucas alavancas. Portões a definir pela linha de base deste incremento (hoje: 3,0% do quintil mais pobre chegam ao mais rico e 3,0% fazem o caminho inverso; V20 95,9%; CPU 14,5 ms por vida).

## Como uma sessão continua

1. `npm run verificar` precisa passar antes de qualquer push.
2. Rode `npm run tunel` e compare com os portões em `docs/decisoes.md`.
3. Atualize as caixas acima e a tabela de níveis quando algo entrar.
