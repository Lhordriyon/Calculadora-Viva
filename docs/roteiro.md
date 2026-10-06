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
| 3. Mundo | balanço por entidade, setores por UF, jurisdição em dados | mínimo feito: ciclo da economia do país (4 fases em dados, com causa), 12 setores com sensibilidade ao ciclo, lugar com região, desemprego e custo de vida. Falta: setores por UF, jurisdição em dados, balanço por entidade |
| 4. Pessoas | relações como arestas, NPCs com nível de detalhe, regras anuais, herdeiro | mínimo feito: família viva (regras anuais, traços, iniciativas, herança, viuvez), amor por regra. Falta: arestas entre NPCs, confiança e dívida, continuar como herdeiro |
| 5. Riqueza e poder | empresas, ativos, status, cargos | começo: carreira por setor (curso, primeiro emprego, salário e demissão pelo mundo), padrão de vida com decisão, herança como bifurcação, riscos proporcionais ao patrimônio. Falta: negócio próprio como entidade, ativos separados, status e cargos |
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

## Incremento 2: o mundo reage e a riqueza vira sistema

- [x] Ciclo da economia do país (normal, expansão, recessão, crise) em dados, com a fase como qualidade do país e causa do que provoca
- [x] 12 setores; ocupações e empregos com setor; salário e demissão pelo setor e pela fase; servidor estável
- [x] Curso pela nota do ENEM e primeiro emprego pela área
- [x] Pais: emprego pelo setor e pela fase, poupança que rende com a fase, negócio da família que pode falir
- [x] Padrão de vida com decisão (sobe com salário e herança, não desce sozinho, a conta chega quando a reserva acaba)
- [x] Herança como bifurcação e riscos proporcionais ao patrimônio
- [x] Conteúdo de cauda longa: setor × fase, região × fase, classe × fase, apartamento na planta
- [x] Interface: fase do país e setor no cabeçalho; notícias do país na linha do tempo
- [x] Portões: mundo nos pontos de virada 10,7% (≥ 5,8%); pobre → rico 6,3% e rico → pobre 5,3% (≥ 4,5%); Spearman 0,45; V20 94,4% (≤ 95%); assinaturas 918 (≥ 893); CPU 16,9 ms (≤ 30 ms); nenhuma estratégia dominante; zero falsos dilemas
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Próximo incremento (proposta)

**Negócio próprio e herdeiro (níveis 4 e 5):** o negócio como entidade (caixa, funcionários, setor, com três alavancas: investir, cortar, vender) e continuar a vida como filho ou filha quando a pessoa morre, herdando o que sobrou do mundo que ela deixou. Portões a definir pela linha de base deste incremento: assinaturas 918, V20 94,4%, pobre → rico 6,3%, rico → pobre 5,3%, setor do último trabalho concentrado em serviços, saúde, comércio e transporte (indústria, construção, finanças e agro somam 3%).

## Como uma sessão continua

1. `npm run verificar` precisa passar antes de qualquer push.
2. Rode `npm run tunel` e compare com os portões em `docs/decisoes.md`.
3. Atualize as caixas acima e a tabela de níveis quando algo entrar.
