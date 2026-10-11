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

## Incremento 3: dinastia, dinheiro com escolha e empresa

- [x] Continuar como herdeiro (filho; sem filho, sobrinho por testamento), com partilha: dívidas, imposto de 4%, metade do cônjuge, testamento solidário
- [x] Classes bilionária e trilionária na origem
- [x] Carteira em 5 classes que rendem pela fase, 3 perfis, aplicar e resgatar pela folha Dinheiro
- [x] Padrão de vida escolhido (simples, confortável, luxo); velhice que não derrete fortuna
- [x] Empresa como entidade: abrir (setor e capital), retirada, aporte, venda, rodada, bolsa, quebra; passa ao herdeiro
- [x] Duas fichas por ano dos 18 aos 40; anos mais cheios; saldo do ano na linha do tempo
- [x] Portões: herdeiro possível 87,9%; 3ª geração 57,7%; ≥ R$ 100 milhões 1,07% de quem nasce sem fortuna; bilionário feito 0,11%; quebra 35%; anos adultos vazios 19,7%; V20 94,0%; assinaturas 938

## Incremento 4 (pedido do dono em 07/10): liberdade de verdade

- [x] Escolher a ação dentro do verbo; três fichas para adultos
- [x] 49 profissões com requisitos, cargos, pirâmide de promoção e fama (folha Carreira)
- [x] 30 bens: moradia (morar, alugar, financiar), imóveis de renda, lazer, veículos, luxo e mídia
- [x] Poder: influência, eleições municipais e gerais, mandato, popularidade, queda do cargo, decretos que mexem no ciclo
- [x] Linhagens: família real, Regime, famosa, do futebol, de políticos, do agro, de circo, imigrante, militar
- [x] Truste: comprar concorrentes; três compras fazem um truste (e uma investigação)
- [x] Infância variada: ações e acontecimentos por classe, região e família
- [x] "Nova vida" abre a escolha da origem; testamento escolhido em vida (par, amigo, sobrinhos, causa, bicho)
- [x] App Android (APK) com link no topo do README, gerado a cada push na `main`
- [x] Portões: zero storylets mortos; nenhuma estratégia domina; bilionário feito 0,92%; V20 92,6%; toques 451 (teto 480)

## Incremento 5 (pedido do dono em 08/10): brincar de deus

- [x] Tipo de storylet `jogada`: a folha Dinheiro mostra o que a fortuna permite, com o preço; a escolha é do jogador e não gasta ficha
- [x] 14 jogadas, de R$ 6 milhões a R$ 500 bilhões: festa do século, estátua, Carnaval, Pix para a cidade, fundação (4 causas), bancar um presidente, Copa do Mundo, cura de doença, programa espacial (com ida à Lua), cidade nova, estatal de energia, salvar o país da crise, fundar um país, colônia em Marte
- [x] O mundo responde: 46 eventos agendados e sorteados que leem as marcas (lei da herança que baixa o imposto para 1%, apagão, calote do governo, patente da cura, greve na ilha, asteroide com o seu nome…)
- [x] Portões: as 14 jogadas acontecem; 98% das vidas de fortuna fazem jogadas (8,2 por vida); 79% das jogadas causam algum acontecimento depois

## Incremento 6 (as 250 ideias do dono, 11/10): quem manda e o porquê

- [x] A empresa depende de quem manda (`empresa.dependencia`): o talento pesa nessa proporção, o tamanho trava mais, a morte de quem manda custa valor (com a morte como causa) e quem compra desconta; o herdeiro fica sabendo na abertura
- [x] Delegar e centralizar são decisões: 5 jogadas na seção Empresa (um conselho que diz não, um mural de problemas, tornar-se dispensável, uma equipe para desmontar, bancar quem quer sair), 8 reações agendadas e 5 eventos que leem a dependência; contratar um executivo e passar o comando ao filho também delegam
- [x] O porquê na linha do tempo: cada acontecimento aponta a decisão (ou o fato do mundo) de um ano anterior que o causou
- [x] Portões: quem manda é decisão em 39,5% das vidas com empresa de R$ 1 milhão; entre as de R$ 15 milhões, 20,8% delegaram e 57,2% centralizaram; o porquê aparece em 21,8% dos acontecimentos (16,5 por vida); zero storylets mortos
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 7 (pedidos do dono em 11/10): as crises acabam, a vida começa sua

- [x] A crise interminável: o empurrão de quem governa vale pela direção da mudança (aquecer ajuda a sair da crise; antes, prendia)
- [x] Aluguéis e valorização à vista: o aluguel do ano em chip próprio, o balanço do ano conta os bens, cada imóvel mostra por quanto foi comprado e quanto mudou; o mercado de imóveis não perde valor no longo prazo
- [x] Criar o personagem: nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos, jeito e talentos (pontos), tudo opcional
- [x] Primeira infância com causa e efeito: o parto (prematuro), quem cuida, vacina, fome, histórias ou telas, brigas em casa, pré-escola, o peito que chia, o balde da pracinha; o que volta dos 5 aos 12; ações dos 1 aos 4 anos; a primeira palavra pela família
- [x] Portões: crises com mediana de 1 ano e 99% em até 7; 975 começos distintos por 1.000 vidas; 100% das vidas decidem antes dos 5; em 45%, algo dos 5 aos 12 tem causa nos primeiros anos; zero storylets mortos. Caiu: o rico que termina pobre (2,5%, portão de 3,0%)
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Próximos incrementos (pedidos do dono em 11/10)

1. **O país vivo.** O país ganha estatísticas que se causam umas às outras (crescimento, desemprego, inflação, juros, dívida pública, pobreza, desigualdade, violência, saúde e educação públicas, aprovação), com atraso como na vida real (educação hoje, produtividade em dez anos). Quem governa escolhe políticas, poucas e com troca (impostos, gasto social, saúde, educação, segurança, juros, salário mínimo, abertura comercial), e os grupos da população reagem. Quem não governa sente o governo eleito: os partidos fictícios têm programas, e a eleição muda o país. O ciclo da economia passa a nascer das estatísticas. Diplomacia com países fictícios: comércio, câmbio, sanções.
2. **Grupo de empresas.** Mais de uma empresa, holdings e subsidiárias, comprar concorrentes como subsidiárias, fundir, vender ou abrir o capital de cada uma; a seção Empresa vira a árvore do grupo.
3. Depois: outros países para morar, crime com consequência, relacionamentos com mais gente (vários filhos, ex) e a velhice com mais escolhas.

## Como uma sessão continua

1. `npm run verificar` precisa passar antes de qualquer push.
2. Rode `npm run tunel` e compare com os portões em `docs/decisoes.md`.
3. Atualize as caixas acima e a tabela de níveis quando algo entrar.
