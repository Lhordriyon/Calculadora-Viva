# Decisões

Cada decisão relevante, com uma linha de motivo. O que foi cortado também fica aqui. Números vêm de `npm run tunel` (10.000 vidas).

## Pilha e arquitetura

- **Vite 8 + TypeScript 7 + Preact 11 + Vitest 5 + Zod 4 + vite-plugin-pwa 2.** Versões estáveis atuais; nenhuma dependência além das pedidas.
- **Sem `@preact/preset-vite`:** o JSX é compilado pelo próprio Vite (oxc). Uma dependência e o Babel a menos; recarga completa basta.
- **Scripts em TypeScript rodam direto no Node 22.18+.** Sem `tsx` nem build de scripts; o túnel usa exatamente o código do jogo.
- **O motor recebe o conteúdo já lido.** O mesmo motor roda no Node (lê do disco) e no navegador (`import.meta.glob`).
- **Zod só no Node; o navegador recebe o conteúdo já validado no CI** e o save usa `zod/mini`. Bundle de 84 para 61 KB gzip; um teste garante que o conteúdo do bundle é o mesmo que o validador aprova.
- **Condições compiladas uma vez por objeto.** O túnel caiu de 22 s para 17 s sem mudar resultado (há teste comparando com a avaliação direta).
- **Ícones PNG desenhados por um script sem dependências.** Quatro PNGs não justificam uma biblioteca de imagem.
- **Deploy confere se o Pages está ativo antes de publicar** e deixa um aviso com o passo para ativar. Pages desligado não deve deixar a `main` vermelha.

## Motor e regras

- **Ano de nascimento = ano atual.** Toda vida acontece no futuro próximo; sem anacronismos de época.
- **Gênero masculino ou feminino.** A concordância do português depende disso em todo texto; um modo neutro exigiria reescrever cada frase e pode entrar se o dono pedir.
- **Marcos (`marco: true`).** ENEM, primeiro emprego, formatura e aposentadoria são a espinha da vida; sorteados, deixavam vidas sem espinha.
- **Morte por Gompertz ajustado pela saúde, mortalidade infantil mínima.** Morrer aos 2 anos não é história, é frustração.
- **Ritmo de eventos menor** (35%→30% na primeira infância, 80%→65% dos 13 aos 29, 45%→35% na velhice). Vida com 38 eventos em vez de 44: mais curta de jogar e menos repetida (vista na vida anterior: 66% → 58%).
- **Memória entre vidas com força 4.** Testadas 2, 4 e 8: diferença de menos de 1 ponto; o gargalo é haver poucos eventos alternativos em cada idade, não a força.
- **Repetíveis espaçados; golpe do Pix uma vez por vida.** Repetição dentro da vida: 16% → 10,5%.

## Pontos de virada e cartão da vida

- **Pontos de virada por descendência causal** (marcas consultadas + agendamentos + causa de morte). Prova a tese do jogo com número.
- **Ranqueados pelo impacto das consequências, não pela contagem.** Pela contagem, a cadeia "investiu → investiu mais uma sobra" aparecia em quase todo cartão.
- **Consequência escolhida por impacto × distância no tempo,** contada pelo que aconteceu ali (resumo da escolha). "Aos 17, você passou na federal → aos 71, morreu de cirrose, depois de anos de happy hour" em vez de "→ aos 28, recusou o intercâmbio".
- **Dinheiro conta pela variação do patrimônio.** Investir só troca de bolso; não é drama.
- **Epitáfio sorteado entre todas as marcas da vida e os genéricos** (metade das vezes, de um ponto de virada), com alternâncias. O dos juros compostos saía em 1 de cada 3 cartões.

## Dinheiro

- **Tudo em reais de hoje.** Valores nominais de 2080 confundiam (carro usado de "R$ 111 mil"); a inflação continua com o efeito que importa para decidir: dinheiro parado encolhe.
- **75% da sobra anual vira padrão de vida (40% para quem deve).** Sem isso, quem morava com os pais acumulava fortunas; com 60%, o patrimônio mediano ao morrer passava de R$ 700 mil.
- **Limite de crédito (2 rendas anuais, mínimo R$ 30 mil): juros só até ele; acima, a dívida congela e o déficit vira privação** (−2 de felicidade no ano). Antes havia vidas terminando com −R$ 48 milhões.
- **Renegociação de dívida (efeito `dividaFator`)** substitui o exame de rotina. Dívida grande precisava de saída e de decisão.
- **Financiamento é dívida com juros (22% ao ano).** Um mecanismo só; parcelas e quitações foram cortadas.
- **Resgatar investimento para cobrir buraco e amortizar dívida com a sobra são automáticos.** Não são decisões interessantes.
- **Pisos de renda e de custo para adultos** (bicos, benefício, contribuição em casa). Evitam renda zero por décadas.
- **Investir está ao alcance de qualquer um com dinheiro parado** (o evento volta até a pessoa investir; quem guardava a mesada tem uma opção a mais). Antes, a inflação comia o dinheiro de quem nunca ganhara a marca de poupador, sem saída.
- **Compras à vista exigem patrimônio, não dinheiro em conta.** Quem investe também pode comprar; o resgate é automático.

## Equilíbrio (guiado pelo túnel)

- **Risco dos robôs = incerteza + exposição** (saúde perdida, dívida, chance de morrer), não custo. A primeira definição (desvio + perda esperada) fazia "arriscado" significar "o que custa mais".
- **Fumar tira 0,5 de saúde por ano (era 1,2); natação na infância deixou de dar saúde vitalícia.** A cautelosa vivia 13 anos a mais que a aleatória só por evitar duas escolhas.
- **Dívida pesada tira 1,5 de felicidade e 0,3 de saúde por ano (era 3 e 1).** Com o retorno da felicidade à média, −3 prendia endividados em felicidade 35 por décadas.
- **Namoro (+0,6), amizade de infância (+0,3) e filhos (+0,3) dão felicidade passiva.** Quem nunca arrisca no amor perde felicidade; sem isso, a cautelosa vencia em idade e patrimônio e perdia em felicidade por 1,3 ponto (frágil).
- **Opções ousadas com recompensa à altura** (festa, entrega na chuva, startup, creche, dança aos 80) **e opções "óbvias" com custo** (horta e hidroginástica custam dinheiro; caminhar custa disciplina).
- **"Arriscar nunca compensa" medido num estado típico da idade de cada evento, só onde há opção arriscada e sem opções condicionadas.** 10 de 80 eventos, quase todos armadilhas de propósito (apostar para recuperar o prejuízo, café no burnout, disfarçar um tombo) ou escolhas de valores (festão, filhos).
- **Opções reordenadas em 23 eventos.** A de maior valor esperado vinha primeiro em 48 de 80 (viés de quem escreve); agora em 25. Resultado: cautelosa vive mais e guarda mais; arriscada é a mais feliz e vive menos; nenhuma vence nos três.

## Texto

- **Métrica de texto idêntico entre vidas** (eventos e linhas já renderizados). Linha de base 56%.
- **Alternâncias nos 40 eventos e 15 linhas mais frequentes e 10 linhas novas para a fase adulta.** Texto idêntico entre vidas: 56% → 40%.
- **Validador mede o tamanho do texto pela maior renderização possível.** Contar colchetes punia justamente as alternâncias.

## Interface

- **Uma ação no polegar:** o palco fixo embaixo mostra o +1 ano ou o cartão do evento. Jogar com uma mão.
- **Tema segue o sistema, sem botão.** Atende claro e escuro sem uma tela a mais.
- **Opções indisponíveis aparecem desabilitadas, com o motivo.** A falta de dinheiro também conta a história.
- **Toques ignorados por 450 ms quando um evento aparece.** Um toque duplo no +1 ano escolhia sem querer.
- **Chip de inflação discreto e no máximo a cada 5 anos.** Todo ano em vermelho virou ruído no primeiro teste.
- **Cabeçalho opaco** (sem efeito de vidro). O texto vazava por trás e atrapalhava a leitura.
- **Cartão da vida sempre em tema claro.** A imagem sai do jogo e cai em qualquer fundo.

## Cortes

- **Escolher nome, gênero e cidade antes de nascer.** O jogo começa em um toque; tudo é sorteado.
- **Configurações, botão de tema, sons, conquistas, galeria de vidas passadas.** Nada disso é a história.
- **Relações, carreira e gerações como sistemas.** Travados até o dono pedir (regra do projeto).
- **Parcelas com quitação** (carro, casa). Financiamento virou dívida.
- **Exame de rotina.** Genérico, repetitivo (2,5 repetições a cada 100 eventos) e sem cadeia; o lugar ficou com a renegociação de dívida.
- **`@preact/preset-vite`, Babel, `tsx`, bibliotecas de ícone e de canvas.**
- **Eventos planejados e cortados antes da escrita** (o rascunho tinha 112; o teto da fase 1 é 80): tatuagem e cobrir tatuagem, cobrança do FIES, mestrado, viagem de moto, cancelamento na internet, música antiga que viraliza, escândalo do vereador, quitação da casa e do carro, grupo da família, mangueira do vizinho, demissão aos 55, academia, jovem aprendiz, curso técnico, excursão da melhor idade, último desejo, proposta de trabalho no exterior, saudade do Brasil, segunda chance no ENEM, entregador que vira dono, decisão entre bola e escola, primeiros passos, catapora, boletim vermelho, crise dos 25. Ficaram os que sustentam cadeias; alguns viraram linhas curtas.

## Fase 2: life simulator

### Linha de base (06/10/2026, motor da fase 1, 10.000 vidas, 20 vidas por jogador)

| Métrica | Linha de base | Portão do incremento 1 |
|---|---|---|
| Saturação V5 | 94,5% | ≤ 80% |
| Saturação V20 | 99,9% | — |
| Assinaturas distintas por 1.000 vidas (sem a origem) | 563 (412) | ≥ 845 |
| Mobilidade: mesmo quintil / Spearman | 23,8% / 0,13 | nem determinista nem aleatória |
| Patrimônio p90/p10 | 22,3× | — |
| Desvio-padrão da felicidade média | 5,73 | ≥ 7,45 |
| Patrimônio negativo ao morrer | 5,7% | — |
| Mudanças de estado causadas pelo jogador | 24,8% | — |
| Toques por vida | 110,8 | ≤ 155 |
| CPU por vida | 2,45 ms | — |

- **Túnel com 20 vidas por jogador** (4 estratégias × 125 jogadores). A saturação V20 precisa de 20 vidas seguidas; o total continua 10.000.
- **Assinatura com uma marca principal e a categoria da causa da morte.** Com duas marcas e a causa exata, a linha de base já dava 832 de 1.000 e a meta de 1,5× seria impossível; o que distingue duas vidas é a forma delas, não a combinação exata de marcas. Mostramos também a conta sem a origem, para provar que as vidas divergem e não só o rótulo de nascimento.
- **Causas de morte ganharam categoria** (velhice, coração, doença, acidente, violência) para a assinatura.
- **Mobilidade quase aleatória hoje** (Spearman 0,13): a origem só trocava a profissão dos pais. É o primeiro sintoma de "a origem não importa".

### Incremento 1: família viva, origem que importa e uma ficha por ano (06/10/2026)

| Métrica | Linha de base | Incremento 1 | Portão |
|---|---|---|---|
| Saturação V5 | 94,5% | 77,0% | ≤ 80% ✓ |
| Saturação V20 | 99,9% | 95,9% | — |
| Assinaturas por 1.000 vidas (só o destino) | 563 (412) | 893 (528) | ≥ 845 ✓ |
| Mobilidade: mesmo quintil / Spearman | 23,8% / 0,13 | 37,8% / 0,57 | nem determinista nem aleatória ✓ |
| Patrimônio p90/p10 | 22,3× | 17,9× | — |
| Desvio-padrão da felicidade média | 5,73 | 8,57 | ≥ 7,45 ✓ |
| Patrimônio negativo ao morrer | 5,7% | 1,4% | — |
| Mudanças de estado causadas pelo jogador | 24,8% | 34,4% | — |
| Toques por vida | 110,8 | 115,2 | ≤ 155 ✓ |
| CPU por vida | 2,45 ms | 14,5 ms | — |
| Estratégia dominante | — | nenhuma | nenhuma ✓ |

**Motor**

- **Estado em entidades com campos e qualidades; condições e efeitos por caminho.** Um formato para pessoa, bicho, lugar e país; empresa entra no mesmo molde.
- **Livro-razão: só `livro.ts` muda o estado, e cada mudança fica na entrada que a causou.** As regras miúdas do ano vão para uma entrada invisível do tipo `regra`. Um teste confere que nascimento + soma das variações = estado final.
- **Evento, ação e iniciativa de personagem no mesmo formato (storylet).** Um validador, um túnel e um grafo para os três.
- **Saliência = peso × especificidade × novidade × tensão × causa fresca.** Storylet que lê mais o estado ganha a vez; o que já apareceu cede; consequência perto da causa pesa o dobro.
- **Uma ficha por ano, com 6 verbos, e o motor garante o limite.** O mínimo do nível 2; 2 ou 3 fichas só se o túnel mostrar que uma é pouca.
- **O verbo faz a ação mais específica que o estado permite, de forma determinística.** O botão mostra a ação ("estudar para o ENEM"); agir sem surpresa. Um toque age e passa o ano: toques por vida subiram só 4%.
- **Personagens com regras anuais próprias** (saúde, doença, morte, emprego, aposentadoria, dinheiro, vínculo) **e iniciativas escolhidas pela regra deles** (tensão × afinidade do traço).
- **Origem com 6 classes × 4 tipos de família** (acolhedora, conflituosa, religiosa, empreendedora = saudável, problemática, religiosa, empresarial). Política, artística e com doença hereditária ficam para o nível 2 completo.
- **Herança dividida entre os irmãos e poupança dos pais só enquanto trabalham, gastando 3% ao ano depois dos 65.** A herança média era R$ 9 milhões; ficou perto de R$ 2,5 milhões.
- **Amor por regra, não por sorteio do diretor.** Só 29% das vidas namoravam (o storylet competia com dezenas de outros); com a regra anual (chance pela idade × paquera × aparência × traço), 69% namoram e 53% têm filhos. Casamento e filhos viraram iniciativa do amor. Estado civil ao morrer: 31% solteiro, 28% viúvo, 23% casado, 16% separado.
- **Amor, filho e amigo novos nascem com traço.** O mesmo storylet vira outra história com um amor gastador ou ambicioso, um filho frágil ou ausente: combinação em vez de texto novo.
- **Viuvez como estado civil:** morte do amor depois de casamento ou de 5+ anos juntos.
- **Depois dos 65, a velhice consome 4% do patrimônio por ano.** A cautelosa vencia nos três critérios (idade 79,5; R$ 944 mil; felicidade 67,4) porque vivia mais e deixava os juros compostos trabalharem; com o gasto da velhice, quem vive mais não acumula para sempre (cautelosa R$ 469 mil, arriscada R$ 564 mil) e cada estratégia ganha em uma coisa.
- **Traços de quem joga pesam mais na felicidade de base** (ansioso −12, otimista +12, tímido −5, carismático +6). Desvio da felicidade 6,99 → 8,12, e a terapia (cuidar da saúde, para quem anda triste) dá uma saída que custa dinheiro.
- **O jeito de morrer de um personagem combina com a idade dele.** Uma amiga de 14 anos morria "do jeito que sempre quis".

**Conteúdo**

- **Reescrita para ler família e origem, e 49 storylets novos:** 20 de amor e filhos por traço; 29 de região (seca, cheia do rio, Zona Franca, concurso em Brasília, agro, fumaça, cidadania italiana, trânsito de São Paulo), classe (laje em mutirão, despejo, carteira da diarista, consórcio, plano de saúde, casa na praia), família e traço de quem joga. Saturação V5: 82,5% antes deles, 80,5% com o amor por regra e os storylets de traço, 77,0% com região, classe e traço de quem joga.
- **Mortes violentas** (a categoria existia, nenhuma causa usava), sempre com condição.
- **Os três storylets que nunca apareciam:** o luto do bicho consultava `pet.faleceu` em vez de `ator.faleceu` (o bicho morto não era ator possível); fim do namoro e filho distante pediam vínculos que as regras nunca alcançavam.
- **Partido sem nome próprio, com checagem no validador.** Um storylet novo tinha "Partido Verde", que existe de verdade.

**Medidas e interface**

- **A instância de storylet é storylet + papel; trechos e alternâncias não contam.** Pensamos em contar o trecho escolhido pela origem (escola pública ou bilíngue) como instância diferente, mas o portão passou sem isso e a medida ficou mais exigente.
- **O túnel conta como ativa a qualidade exigida por caminho** (contador com mínimo ou verdadeiro). Antes só contava marcas e listava como inertes qualidades que decidiam coisas.
- **Save é o estado inteiro (~125 KB por vida no fim), não semente + registro de escolhas.** Repetir escolhas quebra quando o conteúdo muda; o estado é robusto e cabe no localStorage. IndexedDB não foi preciso.
- **Save antigo recomeça a vida com aviso e mantém a memória entre vidas.** Migrar o estado da fase 1 para entidades não valia o código: era só a vida em andamento.
- **Selo "novo" a partir da segunda vida.** Na primeira, tudo é novo e o selo vira ruído; depois, aponta o que você nunca tentou.
- **A mesma ação em anos seguidos vira uma linha curta** ("Estudou para as provas, mais um ano."). Repetir o verbo é rotina, não história.
- **Painel da família, origem opcional na abertura e chips de vínculo na linha do tempo.** O estado dos personagens fica visível sem tela de gestão; o chip do amor fala "do casal" porque o amor pode mudar de pessoa.

## Próximos passos (núcleo)

- Ver `docs/roteiro.md`: a fase 2 substitui os próximos passos da fase 1.
