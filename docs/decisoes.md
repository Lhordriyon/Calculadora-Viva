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

### Incremento 2: o mundo reage e a riqueza vira sistema (06/10/2026)

Mecânicas pontuadas nos 12 critérios (0 a 3 cada): carreira com setor 31, continuar como herdeiro 31, negócio como entidade 30, ativos separados 26, ciclo da economia 25, relações como arestas 19, 2–3 fichas por ano 18. Entraram o ciclo (barato e mexe em tudo) e a carreira por setor; riqueza como sistema entrou pelo padrão de vida e por riscos proporcionais ao patrimônio, sem estado novo. Herdeiro e negócio como entidade ficam para o próximo.

Portões definidos pela linha de base medida no fim do incremento 1:

| Métrica | Incremento 1 | Incremento 2 | Portão |
|---|---|---|---|
| Pontos de virada que vêm do mundo | 2,9% | 10,7% | ≥ 2× (5,8%) ✓ |
| Do quintil mais pobre ao mais rico | 3,0% | 6,3% | ≥ 1,5× (4,5%) ✓ |
| Do quintil mais rico ao mais pobre | 3,0% | 5,3% | ≥ 1,5× (4,5%) ✓ |
| Mobilidade: mesmo quintil / Spearman | 37,8% / 0,57 | 32,8% / 0,45 | Spearman entre 0,3 e 0,7 ✓ |
| Saturação V5 | 77,0% | 69,5% | ≤ 80% ✓ |
| Saturação V20 | 95,9% | 94,4% | ≤ 95% ✓ |
| Assinaturas por 1.000 vidas (só o destino) | 893 (528) | 918 (572) | sem regressão ✓ |
| Patrimônio p90/p10 | 17,9× | 26,8× | — |
| Desvio-padrão da felicidade média | 8,57 | 8,64 | — |
| Patrimônio negativo ao morrer | 1,4% | 3,0% | — |
| Mudanças de estado causadas pelo jogador | 34,4% | 33,4% | — |
| Toques por vida | 115,2 | 115,1 | ≤ 155 ✓ |
| CPU por vida | 14,5 ms | 16,9 ms | ≤ 30 ms ✓ |
| Estratégia dominante / falsos dilemas | nenhuma / 2 | nenhuma / 0 | nenhuma ✓ |

**Motor**

- **Ciclo da economia como cadeia de Markov em dados** (normal, expansão, recessão, crise; 65% / 20% / 12% / 4% dos anos). Fora do normal, a fase é uma qualidade do país cuja causa é a entrada visível que a anunciou (tipo `mundo`, etiqueta "Economia" na linha do tempo). Um storylet que consulta a fase herda essa causa: "o país entrou em crise → você perdeu o emprego". A crise aleatória de inflação da fase 1 saiu; a fase faz o papel dela.
- **A fase mexe em quatro números:** inflação, rendimento (−12% na crise, +4% na expansão), desemprego (2,4× na crise) e salários. Um mecanismo, muitos efeitos.
- **12 setores com sensibilidade ao ciclo** (saúde 0,4, construção 1,8; serviço público estável). Toda ocupação dos pais e todo emprego de quem joga tem setor; ocupação com forma masculina e feminina diferentes pode ter setores diferentes.
- **Curso pela nota do ENEM, em três faixas calibradas pela distribuição medida** (inteligência aos 17: p10 51, mediana 73). Com cortes no chute, o primeiro emprego em artes nunca aparecia; o curso leva ao primeiro emprego no setor.
- **A demissão de quem joga é agendada pela regra do trabalho** (2,5% ao ano × desemprego do lugar × fase × quanto o setor sente), com a fase como causa: 34% das demissões vêm de uma recessão ou crise. Negócio próprio balança o dobro e entra no aperto nos anos ruins; servidor e setor estável não são demitidos.
- **O negócio da família pode falir na recessão e na crise**, levando 60% do que foi guardado; a poupança dos pais rende com a fase. A herança passa a sentir o mundo.
- **Padrão de vida virou variável com decisão.** O custo anual sobe com o salário (`subir_de_padrao`) e com a herança (`custoDoPatrimonio`: 6% do patrimônio), e não desce sozinho. Quando o déficit do ano come a reserva (menos de 5 anos), o motor agenda a conta (`padrao_aperta`), com a escolha que subiu o padrão como causa. Motivo: filho de rico nunca caía jogando com cuidado (0% das vidas da primeira e da cautelosa iam do quintil de cima ao de baixo; 12% da aleatória). A fortuna rendia 4% real sem consumo e a herança chegava aos 55 em milhões.
- **A conta do padrão chega antes da dívida, não depois.** Como condição (dívida ≥ R$ 20 mil), ela aparecia tarde demais para o jogador reagir. Agendada pelo déficit, chega como aviso, e quem mantém as aparências afunda por escolha.
- **Efeitos novos no formato dos fatores:** `rendaFator`, `custoFator` e `custoDoPatrimonio`, e `copiar` para caminhos (`"eu.setor": { "copiar": "pai.setor" }`). `custo: { patrimonio }` foi a primeira ideia; o tipo do TypeScript recusava (conflito com o índice dos caminhos), e uma chave numérica ficou mais simples.
- **Robôs dão valor ao resgate como perda de rendimento**, e a análise de dilemas conta investir e os fatores. Os falsos dilemas foram a zero: os 2 que vinham do incremento 1 (`vo_partiu`, `geladeira_vazia`) e 4 que apareceram no caminho.
- **Save continua na versão 2.** O formato novo só acrescenta (entradas do mundo, setor, fase); uma vida do incremento 1 segue jogando como se o país estivesse no normal e sem setor (há teste). Recomeçar a vida de quem já jogava não se justificava.

**Conteúdo** (de 143 para 214 eventos, de 59 para 67 iniciativas de personagem e de 440 para 642 escolhas)

- **Carreira:** 3 faixas de curso, 6 primeiros empregos por área, aperto do negócio, e storylets do ciclo (corte de salário, proposta na expansão, bolsa que derrete, dólar, concurso lotado, fila do emprego, pais desempregados na crise).
- **Setor × fase:** 21 storylets, um para cada combinação que faz sentido (hospital sem insumo na crise, clínica particular contratando na expansão, férias coletivas na fábrica, frete que some, ações da empresa que viram dinheiro, reajuste dos servidores…).
- **Região e classe × fase:** pousada no Nordeste na expansão, cidadania do bisavô no Sul na crise, agro no Centro-Oeste, cidade dos royalties no RJ e ES, obra grande no Norte, montadora fechando no interior do Sudeste, programa de moradia para quem é pobre, imóvel na baixa para quem tem patrimônio, escola do filho na recessão; e a cadeia do apartamento na planta, que a crise pode deixar no quinto andar.
- **Riqueza:** a herança virou bifurcação (investir, mudar de vida, apostar num negócio grande, realizar um sonho); riscos proporcionais para quem tem muito (pirâmide no grupo da família, ser fiador, fazenda, franquia, moeda digital, alavancagem na expansão, adiantamento da herança ao filho).
- **Política continua genérica:** o validador agora varre todo texto atrás de partido com nome próprio.

**Cortes e adiamentos**

- **Ativos separados (imóvel, ações, renda fixa como contas).** Os riscos proporcionais e o padrão de vida deram as duas mobilidades sem estado novo; volta se o negócio próprio pedir.
- **Negócio próprio como entidade e continuar como herdeiro.** Pontuaram alto; são o próximo incremento.

## Incremento 3: dinastia, dinheiro com escolha e empresa

| Métrica | Incremento 2 | Incremento 3 |
|---|---|---|
| Herdeiro possível | — | 87,9% |
| Quem nasce sem fortuna e passa de R$ 100 milhões | ~0% (teto de milhões) | 1,07% (maior: R$ 19 bilhões) |
| Anos adultos sem acontecimento | 30% | 19,7% |
| Toques por vida | 155 | 174 |
| Rico → pobre | 5,3% | 4,0% |

- **O teto de milhões vinha de três regras:** o motor gastava 75% da sobra sozinho, a velhice comia 4% do patrimônio ao ano e não havia motor de riqueza que escalasse. Agora o padrão de vida é escolhido (simples gasta 35% da sobra, luxo 95%), a velhice gasta 4% só até R$ 2 milhões e 1% acima, e a empresa cresce pela tração do setor, sem teto.
- **Empresa:** valor, tração (que volta para a do setor menos o porte), lucro, participação e retirada. Volatilidade cai com o tamanho. Abrir é decisão do jogador e causa tudo o que a empresa causa (ler `empresa.*` numa condição cita a fundação).
- **Rico → pobre ficou abaixo do alvo antigo (4,5%)** porque a riqueza agora persiste quando o jogador cuida dela, que é o que o dono pediu. O portão passou a ser "não piorar a linha de base" (3,0%).
- **Sobrinho herda quando não há filho**, gerado sem gastar o sorteio da vida (a interface pergunta várias vezes).
- **Monarca ficou para o incremento 4**, como origem num Brasil fictício.

## Incremento 4: liberdade (pedido do dono em 07/10)

O dono jogou e foi direto: início sempre igual, poucas profissões, liberdade de mentira, dinheiro que não vira poder, imóveis e objetos que não servem para nada; queria realeza, regime, truste, escolher a nova vida e o testamento.

| Métrica | Incremento 3 | Incremento 4 |
|---|---|---|
| Eventos / ações / escolhas | 309 / 71 / 936 | 418 / 86 / 1.166 |
| Fichas por ano (adulto) | 2, um verbo cada, ação fixa | 3, ação escolhida na lista do verbo |
| Profissões que se tentam | 0 (só storylets) | 49 |
| Bens que se compram | 0 | 30 |
| Origens possíveis | classe × família | + 9 linhagens (20% do começo em um toque) |
| Saturação V5 / V20 | 66,3% / 94,0% | 62,4% / 92,6% |
| Bilionário feito (quem nasce sem fortuna) | 0,11% | 0,92% |
| Toques por vida | 174 | 451 |
| CPU por vida | 31 ms | 35 ms |

- **Escolher a ação, não só o verbo.** O verbo continua mostrando a ação sugerida; tocar abre todas as possíveis. Três fichas para adultos porque o dono pediu anos vividos; a mesma ação não se repete no ano (a antiga regra "um verbo por ficha" virou "uma ação por ficha").
- **Catálogos em dados, um motor genérico para cada um:** bens (entidade por item, conforto vira felicidade, status vira influência), carreiras (requisitos são condições; a promoção cai a cada degrau, bem mais no palco), cargos (eleição em ano certo, mandato que acaba, popularidade que derruba), linhagens (classe, qualidades, papel do pai ou da mãe, país). Conteúdo novo entra sem código.
- **Dinheiro vira poder pela influência:** patrimônio, bens (jatinho, jornal, emissora), fama, cargo e empresa grande sobem um número que decide eleições e abre portas no conteúdo (lobby, CPI, favores). Decretos de quem governa (presidente, monarca, Regime) mudam as chances do ciclo econômico.
- **Realeza e Regime num Brasil fictício:** "neste mundo, o plebiscito de 1993 deu monarquia"; o Regime não tem data nem nome. Ninguém real, nenhum partido com nome.
- **Três geradores de riqueza grátis foram cortados pelo túnel:** promoção sem pirâmide nas profissões de palco (bilionários iam a 3,2%), compra de concorrente que criava valor do nada e aluguel que somava rendimento duas vezes (o imóvel subia com o mercado de imóveis, que já inclui o aluguel). Agora o imóvel acompanha o mercado só acima do que um aluguel normal rende.
- **"Nova vida" abre a escolha da origem** (no menu, no palco e no cartão), com "voltar para a vida atual". **Testamento** na folha Família: a lei, o filho, o par (herda tudo e a história continua com ele, viúvo), o melhor amigo (com outro sobrenome), os sobrinhos, uma causa ou o bicho (estes dois encerram a história).
- **Portões que ficaram de fora, com motivo:** toques por vida subiram para 451 (teto 480): o robô usa as três fichas todo ano, e quem joga pode passar o ano em um toque. Assinaturas 899 (< 918) e Spearman entre gerações 0,80 ficaram no limite; CPU 35 ms (teto 30) com o triplo de ações por ano. A estratégia cautelosa vive em média 93 anos (cuida da saúde três vezes por ano); nenhuma domina, porque a arriscada é mais feliz.

## Incremento 5: brincar de deus (pedido do dono em 08/10)

"Quero fazer coisas divertidas com o dinheiro na escala dos bilhões ou trilhões." Já havia brinquedos de rico (clube, ilha, iate, jatinho, emissora); faltava o dinheiro mudar o mundo e o mundo responder.

- **Decisão: a jogada é um storylet, não um sistema novo.** O formato de conteúdo já tinha escolhas com condição e bloqueio, teste com sucesso e fracasso, agendamento e marcas; faltavam só o tipo `jogada`, o preço que bloqueia a opção sem dinheiro na mão (`custoDaEscolha`) e a operação da folha (`fortuna.ts`). Evento respondido e jogada passam pela mesma `aplicarEscolha`.
- **Por que na folha Dinheiro e sem ficha:** é decidir o que fazer com a fortuna, como comprar e investir; a ficha do ano continua sendo o que se vive no ano. A seção só aparece quando a fortuna permite (a partir de R$ 50 milhões).
- **Preços pela riqueza medida:** quem nasce bilionário tem uns R$ 2,6 bi aos 45 anos (mediana); quem nasce trilionário, R$ 600 bi aos 45 e R$ 1 tri aos 60. Por isso as jogadas vão de R$ 6 milhões (estátua) a R$ 500 bilhões (Marte).
- **O mundo responde de forma agendada:** na primeira versão as reações dependiam de sorteio e 9 histórias nunca apareciam; só 27% das jogadas causavam algo depois. Com a jogada agendando a sua reação, 0 mortas e 79% com consequência.
- **Consequência que mexe em regra:** a "lei da herança" que o presidente amigo aprova baixa o imposto da herança de 4% para 1% (`herdeiro.ts`, declarado no manifesto).
- **Conserto junto:** a classe `.dinheiro` da linha de saldo do cabeçalho pegava também as entradas de dinheiro da linha do tempo (compras, aplicações, jogadas), que ficavam cortadas numa linha só desde a versão 1.3. A linha de saldo virou `.saldo`.
- **Custo:** o túnel ganhou um lote de 200 vidas de fortuna; a CPU por vida subiu (52 ms, teto de 30 ms que já falhava) e o túnel leva cerca de 10 minutos. Fica para a auditoria.

## Interface: tela em três faixas (08/10)

O dono jogou o APK com a letra do sistema grande (cerca de 145%, numa tela de 360 px) e o cabeçalho e o palco, os dois grudados na tela (`sticky`), se cruzavam: o nome ocupava 3 linhas, o subtítulo 5, o dinheiro 5, e o texto do evento ficava por baixo. A soma dos dois passava da altura da tela.

- **Decisão:** a tela tem altura fixa e três faixas em coluna (cabeçalho, linha do tempo, palco). Nenhuma é `sticky`, então não há como se cruzarem; cada uma rola por dentro. O palco cresce até onde precisa e, se não couber, rola o texto ou a lista, com o botão de baixo sempre no polegar. A linha do tempo encolhe primeiro e desce até o fim quando cresce ou quando o palco muda de altura.
- **Cabeçalho compacto:** nome numa linha (sobrenome menor, reticências), subtítulo na largura toda, dinheiro numa linha que rola de lado (a dívida logo depois do dinheiro), verbos que quebram linha.
- **Medida** (Playwright, letra a 145%, 360×820 com as barras do Android): o cabeçalho caiu de 493 px para 289 px. Antes, o palco subia até 177 px e cobria 316 px do cabeçalho, e o robô do teste nem conseguia tocar nas opções cobertas; depois, nenhuma faixa cruzada em nenhum passo, nenhum botão vazando de lado e nada passando da borda nas folhas. A 100%, o cabeçalho tem 252 px.
- **Não limitei a letra do sistema no APK** (dava para fixar o `textZoom`): quem aumentou a letra quer ler grande, e a tela agora aguenta.
- **Segunda rodada (o dono: "De novo?"):** sem sobreposição, a história virou uma fresta de ~30 px entre o cabeçalho e o palco, porque cada verbo tinha nome, selo "NOVO" e subtítulo, e com letra grande cada um ocupava até três linhas. O que mudou:
  - o verbo virou um botão curto, de uma linha, com nomes curtos (Trabalhar, Cuidar-se, Em família); o "novo" virou um ponto; tocar sempre abre a lista das ações. O túnel já contava dois toques por ação;
  - a história guarda no mínimo 20% da tela (até 180 px), menos durante um evento, e esmaece nas bordas;
  - quando o cartão do evento não cabe, o cabeçalho esconde atributos e dinheiro até o evento acabar. Com letra normal, isso não acontece;
  - o subtítulo e os atributos ficaram menores.

  Medida a 145% (360×820): a história nas ações foi de ~30 px para 227 px; o cabeçalho, de 289 px para 271 px (122 px no modo compacto); um cartão de evento ganha até 698 px. Só um evento muito longo (9 linhas e 3 opções) ainda rola dentro do cartão.

## Auditoria por primeiros princípios (11/10)

O relatório completo, com os três mapas (princípios, complexidade e oportunidades), está em `docs/auditoria.md`. Entraram só as mudanças pequenas, com evidência e teste; as de risco maior ficaram como propostas.

- **O mundo tem tamanho.** O dono mostrou uma empresa de R$ 144 tri com 956.903.676 funcionários e uma herdeira com R$ 357 tri, quase tudo em títulos. Por quê: o valor da empresa crescia em proporção a ele mesmo sem limite, o investimento rendia sobre qualquer valor, e funcionários eram o valor dividido por R$ 150 mil. Agora:
  - o ganho da empresa encolhe perto de R$ 20 tri e some acima disso;
  - o investimento rende até R$ 5 tri, e o excedente fica parado;
  - os funcionários saturam em 3 milhões.

  Medida em 16 dinastias trilionárias de 3 gerações (mesmas sementes):

  | | Antes | Depois |
  |---|---|---|
  | Maior empresa | R$ 25,5 tri, 170.285.731 funcionários | R$ 11,7 tri, 3.000.000 |
  | Maior patrimônio | R$ 13,6 tri | R$ 16,7 tri |
  | Mediana no fim da dinastia | R$ 1,5 tri | R$ 633 bi |

  Os números escolhidos: R$ 20 tri é a ordem de grandeza das maiores empresas do mundo somadas a uma economia como a brasileira; R$ 5 tri, o que o mercado de um país desse tamanho absorve sem virar o próprio mercado; 3 milhões, as maiores empregadoras do mundo. Bilhões e trilhões continuam possíveis; o infinito, não.
- **Imagem pública com consequência.** 103 efeitos do conteúdo mexiam na popularidade de quem não tinha cargo, e ela só pesava na reeleição. Agora pesa em toda eleição (cada 3 pontos de imagem acima ou abaixo de 50 valem 1 ponto de influência), e o mandato começa com a imagem de quem ganhou mais 5 (entre 45 e 90), em vez de 55 para todos. Não pus esquecimento (a imagem voltar sozinha para 50): fica para medir no túnel.
- **Livro-razão fechado para toda entidade.** Par, filho, paixão e bicho nasciam com números fora do livro, e quem chegava sobrescrevia quem saía sem registro (67 violações em 96 vidas; o teste só olhava quem joga). Agora quem sai deixa os números no livro (`r: 'saida'`, fora dos chips) e quem chega entra com os seus. O teste cobre toda entidade, em vidas sorteadas, de fortuna e de linhagem.
- **Manifesto conferido pelo comportamento.** Um teste joga vidas e exige que toda escrita das regras esteja no manifesto. Ele achou três escritas não declaradas: `bem.valor`, `bem.financiado` e o dinheiro de qualquer pessoa que morre.
- **O porquê visível.** A linha do tempo escondia toda entrada de regra; promoções, fins de mandato e fins de carreira não apareciam. Agora só o resumo do ano fica escondido.
- **Um número de regra na interface:** o aviso da popularidade usa o mesmo limiar que derruba o cargo (30), em vez de 25.

## Incremento 6: quem manda e o porquê (as 250 ideias do dono, 11/10)

O dono mandou "O livro dos 250 experimentos de um império" e pediu que eu decidisse sozinho, por primeiros princípios.

**O que as 250 ideias pedem, reduzido ao essencial.** Não são 250 telas. Cada ideia é intervenção → consequência que ninguém previu → próxima missão, e o próprio texto diz: "histórias diferentes, não somente despesas diferentes". Disso saem três necessidades:
1. A intervenção mexe num estado que decide algo depois.
2. O resultado depende do que o jogador construiu, não só de sorte.
3. O porquê fica à vista quando a consequência chega.

**O que o jogo já tinha.** A jogada do incremento 5 já é intervenção → reação agendada → marca. Faltavam duas peças:
- **A empresa era só um número, sem ninguém mandando nela.** É o que pedem a ideia 44 ("mobilizar quase um bilhão de pessoas sem centralizar") e a 250 ("tornar-se dispensável").
- **O porquê só aparecia no cartão final.** É o que pede a ideia 236, o "museu das consequências".

**A conta pelos 12 critérios.**
- **Dependência da empresa:** alta em decisão, consequência, interação (empresa, dinastia, morte, venda, saúde), história emergente e fantasia. Custa pouco: um campo e três leituras do motor.
- **Porquê na linha do tempo:** compreensão e história emergente máximas, com custo quase zero, porque os dados já estavam no livro-razão.
- **Ficaram de fora** as ideias que viram tela de gestão (orçamentos, turnos, índices), proibidas pelo CLAUDE.md, e as que só trocam uma despesa por outra.

**Decisões tomadas e por quê:**
- **Só decisões mudam a dependência.** Na primeira versão, "tocar a empresa até tarde" somava 3 pontos por ano (depois, 1).
  - Medido: a ação aconteceu 3.874 vezes; as decisões somaram −825; a mediana na morte ficou em 99.
  - Uma rotina que desfaz a decisão a cada ano vira esteira.
  - Sem ela, a mediana ficou em 80 (quem nunca decidiu nada) e 15% das empresas grandes terminaram delegadas.
- **O freio do tamanho depende de quem manda.** Sem um custo de centralizar em vida, delegar só servia para a hora da morte.
  - A mesa do dono tem tamanho: o freio passa a ser multiplicado por 1 + 0,8 × (dependência − 0,5).
  - Quem tem talento e centraliza cresce mais enquanto a empresa é pequena; depois de grande, quem não delegou trava.
  - O bilionário feito continuou em 0,84% das vidas (era 0,79%).
- **Perda na morte e desconto na venda.** Na morte, a empresa perde 0,4 × a dependência do valor; na venda, quem compra desconta 0,25 × a dependência. A perda fica no livro com a morte como causa, e a abertura do herdeiro conta o que aconteceu.
- **Uma marca, um conceito.** O conteúdo já tinha `passou_o_comando` (contratar um executivo, passar a empresa ao filho). A jogada nova usa a mesma marca, e as duas decisões antigas agora também baixam a dependência (−30 e −25).
- **O porquê só no que acontece com quem joga:** eventos, iniciativas dos outros e a morte.
  - Nas ações, a mesma causa se repetia todo ano ("Tocou a empresa… porque aos 32…").
  - Em 80 vidas, 21% de todas as entradas tinham uma causa. Contando só os acontecimentos, são 22%, ou 16 por vida.

- **Robôs que experimentam e um lote de fortunas maior.** O primeiro túnel de 10.000 vidas do incremento matou `os_bancos_pagam`: a reação a "Emprestar aos bancos", uma opção do meio da jogada mais rara (salvar o país pede crise e R$ 200 bilhões).
  - O robô arriscado sempre escolhia a opção mais cara entre todas as jogadas, e o cauteloso a mais barata. Assim, a opção do meio de uma jogada rara saía 1 vez em 200 vidas de fortuna, e a meta passava ou caía por sorteio.
  - Agora cada robô sorteia uma jogada que cabe no bolso e escolhe a opção do seu jeito dentro dela: em 200 vidas, "Emprestar aos bancos" foi de 1 para 5 escolhas.
  - O lote de fortunas foi de 200 para 496 vidas (13 segundos a mais no túnel). A opção mais rara sai 5 vezes, e a chance de uma reação morrer por sorteio fica abaixo de 1%.

**Portões novos (10.000 vidas):**
- Quem manda é decisão em 39,5% das 1.728 vidas que morrem com empresa de R$ 1 milhão (alvo: 30%).
- As duas histórias existem entre as 713 empresas de R$ 15 milhões: 20,8% delegaram e 57,2% centralizaram (alvo: 10% cada).
  - O primeiro desenho contava todas as empresas de R$ 1 milhão. Passei a contar só as de R$ 15 milhões, onde as jogadas existem e os dois caminhos estão abertos.
- O porquê aparece em 21,8% dos acontecimentos, 16,5 por vida (alvo: 20%).
- Na morte de quem manda, a empresa perde em média 26% do valor.

**Sem regressão:** zero storylets mortos; nenhuma estratégia domina; bilionário feito em 0,71% das vidas (era 0,79%); quem nasce com fortuna faz jogadas em 98,4% das vidas; 76,4% das jogadas causam algo depois. O rico que fica pobre voltou a 3,1% (estava em 2,9%, um décimo abaixo do portão).

## Incremento 7: as crises acabam, a vida começa sua (pedidos do dono em 11/10)

O dono relatou: uma crise interminável, aluguéis que não rendiam nem valorizavam, todas as vidas começando iguais (só dava para dizer as mesmas palavras, sem efeito) e pouca liberdade para criar o personagem.

**O que causava cada problema:**
- **Crise interminável:** um defeito de causalidade no ciclo. O empurrão de quem governa reduzia toda transição *para* recessão, e da crise para a recessão é melhorar.
  - Com estímulo renovado todo ano (+3), a crise durava 3 anos em mediana, 20 em 1% dos casos, e chegou a 29.
  - Com arrocho (−3), durava no máximo 5.
  - Agora a melhora e a piora vêm da ordem das fases. Com estímulo, a crise acaba em 1 ano. Com arrocho, dura 3 anos em mediana e 17 no pior 1%: o arrocho pode cortar a chance de melhorar pela metade, não mais que isso.
- **Aluguéis:** o aluguel entrava, mas somado à manutenção e à parcela na entrada invisível do ano. O balanço do ano ignorava os bens, como a auditoria já tinha apontado.
  - O mercado de imóveis era medido contra 6% ao ano, mas na média das fases rende 4,8%. Na conta esperada, o imóvel perdia uns 0,45% reais por ano.
  - Agora:
    - o aluguel é anotado à parte e vira um chip no ano;
    - o balanço conta os bens;
    - cada imóvel mostra por quanto foi comprado e quanto mudou;
    - o ciclo tem média zero, e sobra a valorização de cada imóvel.
- **Começos iguais:** a primeira palavra era marco obrigatório, com três escolhas quase iguais. O ritmo até os 4 anos era de 30%, com só 1 a 3 histórias possíveis por idade e nenhuma ação antes dos 3.

**Decisões:**
- **A primeira infância segue a ordem causal da vida real:** o parto, depois quem cuida, depois nutrição, vacina e estímulo, depois o estresse em casa, depois a pré-escola. As marcas desses anos voltam dos 5 aos 12: ler antes dos colegas, não parar quieto, o surto no bairro, crescer devagar, a dor de barriga de domingo, o ouvido para música, a asma na educação física, a babá que foi embora, a mãe que quer voltar a trabalhar. O porquê da linha do tempo mostra a ligação.
- **Quem decide antes da fala:** nas decisões de quem cuida, vacina e pré-escola, quem joga escolhe pela família. As ações dos 1 aos 4 anos são o jeito do ano da criança: ouvir histórias, correr no quintal, colo da vó.
- **Ritmo de 75% até os 4 anos:** um ano vazio ali é uma decisão perdida. Os toques por vida subiram de 450 para 454, abaixo do teto de 480.
- **Prematuro no parto:** 1 em cada 10, mais nos pobres e nas mães muito novas ou mais velhas, com menos saúde. A linhagem continua contando o próprio nascimento.
- **Criar o personagem, tudo opcional:**
  - Escolhe-se nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos, jeito e talentos.
  - Os talentos são pontos (pouco, médio, muito, somando 4): ser muito inteligente custa ser pouco em outra coisa.
  - O nome digitado vira só letras, para não virar modelo de texto.
- **A primeira palavra deixou de ser obrigatória e passou a depender da família:** "papai" só com pai em casa, "vó" só com a avó perto. "Não!" deixa a marca da teimosia. O "Pix" saiu (o limite é de 4 opções), e o tino financeiro passou a nascer de abrir a primeira conta com o cofrinho.
- **Conserto em teste:** a amostra "de linhagem" do teste de fundamentos usava a linhagem `real`, que não existe, e nunca testou uma família real. Agora usa `realeza`.

**Portões (10.000 vidas):**
- crises com mediana de 1 ano, 99% em até 7 anos e a maior com 13 (11.830 crises);
- 975 começos distintos por 1.000 vidas;
- 100% das vidas decidem algo antes dos 5;
- em 45% das vidas, algo dos 5 aos 12 tem causa nos primeiros anos.

**O que piorou:** o rico que termina pobre caiu de 3,1% para 2,5%, abaixo do portão de 3,0%. A causa provável é o conserto dos imóveis: eles pararam de perder 0,45% reais por ano, então quem é rico cai menos. O bilionário feito subiu de 0,71% para 0,89% (portão: até 1%). A mobilidade geral segue no meio (Spearman 0,33). Não mexi nisso agora: a riqueza vai passar a depender das estatísticas do país no próximo incremento, e esse portão será medido de novo lá.

Aos 18, quem dormia ouvindo histórias ganhou em média 57 pontos de inteligência; quem dormia com o celular, 31. Parte da diferença vem do resto da vida e da estratégia dos robôs, mas a direção é a da vida real.

## Incremento 8: o país vivo (pedido do dono em 11/10)

O dono pediu um mundo inteiro vivo e integrado, com política, diplomacia e estatísticas que respondem ao mundo do Trajetória: "se o personagem governa, quero que suas decisões alterem estatísticas populacionais e econômicas", sem perder a simplicidade. A diplomacia ficou para um incremento próprio (`docs/roteiro.md`); este faz o país.

**O que mudou:**
- **O ciclo sorteado saiu.** A cadeia de Markov de quatro fases deu lugar a dez estatísticas que se causam: crescimento, desemprego, inflação, juros (Selic), dívida pública, pobreza, violência, saúde e educação públicas e aprovação do governo (`src/motor/pais.ts`, que substitui `ciclo.ts`). A fase virou o nome do crescimento, e o que ela fazia com a vida (demissão, salário, empresa, poupança da família) agora sai do crescimento e do desemprego de verdade.
- **Governos fictícios que se alternam.** Quatro blocos genéricos, cada um com as cinco políticas que adota (impostos, programas sociais, saúde, educação, segurança), e o regime. Na posse, um ano depois da eleição geral, quem governa fica pela aprovação, e os outros disputam o resto pelo que o eleitor quer no momento.
- **O voto.** O primeiro voto é um marco aos 18–21 anos, e depois o voto aparece por saliência, umas duas vezes por vida. Ele pesa no resultado (mais com influência), entra como causa da posse quando o escolhido ganha e volta 2 a 4 anos depois como "o governo que você elegeu".
- **Governar.** Presidente, monarca e chefe do Regime mudam as políticas pela folha País, uma reforma por ano, com o efeito à vista antes de aprovar. A aprovação do governo passa a ser a popularidade de quem governa, então governar mal derruba o cargo pela regra que já existia.
- **O país na vida.** Imposto e auxílio no bolso, juros na dívida e na renda fixa, saúde pública na mortalidade de quem não é rico, violência que mata (mais o jovem, o homem e quem não é rico) e escola pública na inteligência de quem estuda nela.
- **Conteúdo:** 33 storylets (`99-pais.json`), 15 linhas curtas e 3 causas de morte que leem o país.
- **O porquê:** a virada de fase aponta para o decreto que empurrou e para quem decidiu as políticas que puxam o crescimento; a posse aponta para o voto. A linha do tempo passa a mostrar o porquê também nas entradas do mundo.
- **Folha País** (toque na linha do lugar e do ano, no cabeçalho): o governo, as dez estatísticas com a seta do ano e para onde vão com as políticas de agora, e as políticas.

**Decisões tomadas sozinho:**
- **Calibrar antes de escrever.** O modelo foi calibrado em Python antes do motor, para manter as fases com o tamanho de antes.
  - A primeira versão da dívida explodia: juros sobre a dívida, prêmio de risco e crise se alimentavam sem freio.
  - A dívida agora se estabiliza pela reação de quem governa: corta 5% do que passa de 75% do PIB por ano. O que pesa nela é o que se gasta acima do que se arrecada e a recessão.
- **Folga para sair da fase.** Sem folga, o crescimento oscilava em volta dos limites e o país trocava de fase 23 vezes por vida, contra umas 13 no ciclo sorteado. Com folga de 1 ponto para sair da expansão e de 0,5 para sair da recessão e da crise: 15,4 viradas a cada 70 anos (portão: até 18).
- **Nenhum bloco é o melhor em tudo.** Na primeira calibração, a frente popular vencia em quase todas as estatísticas, o que é tomar partido. Agora:
  - o imposto alto custa 0,5 ponto de crescimento;
  - a segurança linha dura tira 8 pontos de violência;
  - a pobreza pesa 0,3 na violência;
  - o centrão ganha governabilidade (+4 de aprovação) e gasta em emendas.

  O resultado, por governo (médias de 10.000 vidas):

  | Governo | Crescimento | Desemprego | Dívida | Pobreza | Violência | Saúde | Educação | Aprovação |
  |---|---|---|---|---|---|---|---|---|
  | a frente popular | 1,7% | 8,2% | 80% | 21,0% | 20,4 | 57 | 55 | 51% |
  | o bloco liberal | 2,4% | 8,6% | 81% | 29,6% | 22,1 | 43 | 50 | 51% |
  | a aliança da ordem | 2,0% | 8,5% | 70% | 29,5% | 17,6 | 50 | 45 | 52% |
  | o centrão | 2,1% | 8,4% | 84% | 25,2% | 21,4 | 50 | 50 | 55% |

  Cada bloco ganha numa coisa e perde em outra: a frente popular na pobreza, na saúde e na escola, o bloco liberal no crescimento, a aliança da ordem na violência e na dívida, o centrão na aprovação.
- **Imposto baixo sem cortar gasto cresce mais no começo e menos depois**: a dívida sobe e freia o crescimento. Ficou assim de propósito, e há teste.
- **O voto não aparece em toda eleição.** Seriam 15 cartões iguais por vida; com o marco e a saliência, são 1,7 por vida.
  - O marco começou aos 16–19 e roubava um ano da adolescência: a escola militar morreu no túnel e o título de eleitor ficou raro.
  - Aos 18–21, ele vem depois do ENEM.
- **Uma reforma por ano.** Sem limite, bastava acertar as políticas uma vez e esquecer; com ele, cada reforma tem custo de oportunidade.
- **A violência mata por um canal próprio.** A chance é homicídios por 100 mil × idade × gênero × bolso, e as causas novas só servem a esse canal (`daViolencia`). Na primeira versão elas entravam também no sorteio da morte natural e 15,5% das vidas morriam de violência; agora são 4,0% (antes do incremento eram uns 3%, das causas violentas que já existiam no sorteio da morte natural).
- **A renda fixa acompanha o juro real** do país, em vez de uma tabela por fase. A dívida de quem joga paga 22% com a Selic média e anda junto com ela.
- **Removido:**
  - `ciclo.ts`;
  - o peso e as transições das fases em `mundo.json`;
  - a inflação sorteada à parte (`sortearInflacao`);
  - uma função que ninguém chamava (`precoDaParte`);
  - o parâmetro de conteúdo que duas funções não liam.
- **A folha País abre pela linha do lugar e do ano**, não por um quinto ícone, que não cabia no celular de 360 px. O alvo tem 44 px sem crescer o cabeçalho.
- **Save antigo:** o país ganha as estatísticas típicas da fase que tinha e o centrão no governo. A vida continua (há teste).
- **Conserto:** com saúde zero, a morte é certa; a saúde pública boa não salva quem já não tem saúde (a primeira versão deixava até 40% de chance).
- **Conserto no chip dos aluguéis:** ele contava só o que entrava na conta. Para quem tinha dívida, a parte do aluguel que já ia para ela sumia do chip. Agora conta as duas (um teste que dependia da sorte da vida simulada achou o defeito).
- **Cadeias que pediam crise:** com menos anos ruins (12% contra 15%), elas ficaram raras demais, e o túnel achou 5 storylets mortos.
  - A construtora agora quebra também na recessão.
  - Salvar o país vale com a economia patinando (crescimento de até 1%).
  - A manchete "O dono do Brasil?" vem também de emprestar aos bancos.
  - A escola militar e a vida depois da coroa ganharam peso.

**Portões (10.000 vidas):**
- fases com o tamanho de antes: normal 64,7%, expansão 23,1%, recessão 10,0%, crise 2,2% dos anos (antes: 65/20/12/3%);
- o país não pisca: 15,4 viradas de fase a cada 70 anos (portão: até 18);
- os governos se alternam: cada bloco governa entre 24% e 27% dos anos, com 8,4 trocas por vida;
- a política muda o país nas 4 direções medidas: pobreza 21,0% × 29,6% (frente popular × bloco liberal), violência 17,6 × 22,1 (aliança da ordem × bloco liberal), crescimento 2,37% × 1,74% (bloco liberal × frente popular), dívida 70% × 84% do PIB (aliança da ordem × centrão);
- o país pesa no trabalho: com desemprego de 10,5% ou mais, 3,85% de chance de demissão por ano; com 6,5% ou menos, 0,91%;
- o voto aparece e conta: 1,7 voto por vida, e 32% deles ajudam a eleger quem ganha;
- quem governa decide: no poder, a dívida sobe 3,59 pontos do PIB por ano com a populista (arriscada) e 0,64 com a responsável (cautelosa); 97% de quem governa reforma;
- a violência do país mata 4,0% das vidas;
- zero storylets mortos, nenhuma estratégia dominante; crises com mediana de 1 ano e 99% em até 7.

**O que melhorou de carona:** o rico que termina pobre voltou a 4,5% (era 2,5% no incremento 7, abaixo do portão de 3,0%): imposto, crise, violência e saúde pública agora também derrubam quem tem. A saturação ficou em 59,8% (V5) e 91,4% (V20), contra 60,9% e 92,1%.

**O que não mudou ou piorou:**
- Continuam abaixo dos portões antigos: a herança entre gerações (Spearman 0,81; portão até 0,8) e as assinaturas (906 por 1.000 vidas; portão 918, eram 900).
- O bilionário feito subiu de 0,89% para 1,41% de quem nasce sem fortuna (portão: até 1%). Fora do túnel, com as mesmas 2.000 vidas de origem até a classe média e as quatro estratégias, o motor antigo fez 1,30% e o novo 1,10%. A alta vem da composição da amostra do túnel, não do país (só 1 dos bilionários do comparativo tinha a empresa como metade do patrimônio). Não mexi.
- CPU por vida: 64 ms no túnel desta sessão (portão antigo: 30 ms, que já não passava). A máquina ficou mais lenta depois de um reinício: o motor antigo, que media 41 ms no túnel do incremento 7, mede 61 ms nela. No mesmo hardware e em sequência, o motor novo gasta 67 ms, 10% a mais, porque o país roda todo ano.

## Incremento 9: o grupo de empresas (pedido do dono em 11/10)

O dono escreveu: "Eu só posso ter uma empresa, poderia ter uma empresa mãe, poderia ter subsidiárias, posso ter mais de uma empresa mãe, centenas de subsidiárias, possibilidade de fundi-las". O roteiro juntou a isso vender ou abrir o capital de cada uma.

**O que mudou:**
- **Até cinco empresas de uma vez.** Cada uma é uma entidade como as outras: `empresa` é a que quem joga cuida de perto, e `empresa2` a `empresa5` são as outras. A seção Empresa da folha Dinheiro vira a árvore do grupo: uma linha por empresa (ramo, valor, a sua parte, as subsidiárias, se está na bolsa); tocar numa abre os números e o que dá para fazer com ela.
- **A empresa de que a história fala.** Os eventos, as jogadas de quem manda e o "Trabalhar" do ano vão para a que quem joga cuida de perto. Trocar é decisão dele ("Cuidar desta de perto"). Se ela é vendida, fecha ou é absorvida, a maior das outras toma o lugar, no fim da entrada, para o texto ainda falar da que saiu.
- **Subsidiárias.** A concorrente comprada vira subsidiária, com as subsidiárias dela: nenhuma até uns R$ 4 milhões, 8 numa de R$ 300 milhões, 27 numa de R$ 3 bilhões. Elas ficam dentro do valor (cada uma vale valor ÷ (subsidiárias + 2)); vender algumas dá dinheiro sem largar a empresa: uma até dez, depois um décimo delas, pelo preço da fase do país.
- **Fundir.** Uma empresa de quem joga absorve outra, que vira subsidiária dela. Os valores se somam com o corte de custos no mesmo ramo (+8%) ou o desconto de conglomerado em ramos diferentes (−2%), com sorte (± 8%). A parte de quem joga, a dependência e a tração viram a média pelo valor. No mesmo ramo, a fusão conta como uma compra para o truste. Em ramos diferentes, a empresa vira o "Grupo {sobrenome}". O sustento de quem joga passa para a que fica.
- **Abrir o capital de cada uma**, a partir de R$ 100 milhões, fora da recessão e da crise:
  - a empresa passa a valer 20% mais (tem preço todo dia);
  - quem joga vende 20% da parte dele na estreia, pelo preço da fase;
  - a dependência cai 15 (conselho, auditoria, balanço público);
  - depois, o valor anda também com o humor do mercado (0,6 × o que as ações renderam além do esperado para a fase), e quem compra não desconta a dependência.

  O evento "abrir capital" usa a mesma mecânica (um efeito, `abrirCapital`).
- **A mesa de quem manda.** O talento de quem joga se divide entre as empresas na medida em que elas dependem dele: duas empresas a 80% somam 160%, e cada uma recebe o talento ÷ 1,6. Delegar libera a mesa. Se uma das outras afunda, ela vem para a mesa de quem joga (troca de lugar com a que ele cuidava) e a quebra é dela, com a fundação dela como causa.
- **O grupo na vida:** o patrimônio, a classe e a herança contam todas as empresas (o grupo passa inteiro ao herdeiro, e o que a conta não paga da partilha sai de cada uma na mesma proporção); na morte de quem manda, cada empresa sente a falta na medida da dependência; o conglomerado (20 subsidiárias ou mais) dá influência.
- **Conteúdo:** 8 eventos do grupo (`92-grupo.json`: duas empresas numa agenda, o choque de culturas depois da fusão, a subsidiária esquecida, a oferta por uma subsidiária, o conglomerado que o mercado desconta, o primeiro balanço na bolsa, a capa da revista, a fusão de iguais), 6 linhas curtas, e o órgão de concorrência pode mandar vender subsidiárias.
- **O nome da empresa concorda com o artigo** em todo texto: "o Instituto Silva", "da Clínica Silva", "no Grupo Silva". As 83 ocorrências de "a {empresa}" no conteúdo viraram `{empresa:o|a} {empresa}`; o gênero sai do nome, e o save antigo ganha o dele ao abrir.

**Decisões tomadas sozinho:**
- **Subsidiária é um número, não uma entidade.** Centenas de entidades seriam uma tela de gestão e um save pesado; o pedido era poder ter centenas e juntar, e isso cabe num campo (`empresa.subsidiarias`) lido pela venda, pela influência e pelo conteúdo.
- **Cinco empresas no máximo**, porque a árvore precisa caber no celular. Para abrir a sexta, venda ou junte duas.
- **O conteúdo fala só da que quem joga cuida de perto.** Assim, os 60 storylets da empresa continuam valendo sem reescrever, e escolher qual cuidar é uma decisão com custo (as outras andam com a diretoria).
- **A mesa de quem manda é o custo do grupo.** Sem ela, ter cinco empresas era só somar. Com ela, quem tem talento perde 1,35 ponto de tração por empresa, em média, nos anos em que várias dependem dele (portão abaixo).
- **A holding familiar (instrumento de herança) ficou para depois** (`docs/roteiro.md`): ela mexe na herança e no imposto, e merece um incremento próprio.
- **Os robôs:** a arriscada compra concorrentes quando o dinheiro dá, abre o capital na economia aquecida e abre uma segunda empresa quando a primeira passa de R$ 20 milhões. A primeira versão abria até três e fundia a menor todo ano, num vai e vem que gastava o dinheiro dela. A aleatória faz um pouco de tudo, raramente; a cautelosa vende o grupo aos 65.
- **Fusão sem prêmio garantido:** no mesmo ramo, ganha 8% em média; em ramos diferentes, perde 2%. Há sorte nos dois casos: fusão boa existe, e ruim também.
- **A troca de lugar espera o texto.** Quando um evento vende ou fecha a empresa que quem joga cuida, a maior das outras só toma o lugar no fim da entrada: o texto ("a rede comprou a {empresa}") ainda fala da que saiu. Na primeira versão, a troca acontecia no meio do efeito e o texto falava da empresa errada (há teste).
- **O gênero do nome sai da primeira palavra** ("Instituto", "Banco", "Grupo" são "o"; "Clínica", "Fazenda" são "a"); com o sobrenome ou o nome de quem joga na frente, é "a" empresa ("a Silva Tech"). O conteúdo já dizia "a Instituto Silva" antes; o grupo, que cria o "Grupo Silva", deixaria o erro em toda parte. Save antigo: a empresa ganha o gênero do nome ao abrir; sem gênero, o texto usa "a".

**Portões (10.000 vidas):**
- o grupo existe: 15,1% das 7.050 vidas com empresa chegaram a ter duas ou mais de uma vez (portão: 10%);
- fundir e abrir o capital acontecem: 3,5% fundiram e 5,4% abriram o capital (portão: 2% cada);
- centenas de subsidiárias são possíveis: no laboratório, um grupo de R$ 10 bilhões que compra uma concorrente por ano passa de 100 em 4 anos (portão: 10); nas vidas jogadas, o maior grupo chegou a 2.316 subsidiárias, e o p99 de quem tem empresa é 320;
- a mesa pesa: nos anos em que várias empresas dependem de quem tem talento, cada uma perde 1,35 ponto de tração (28.246 empresas-ano; portão: 0,5);
- na bolsa, o valor anda com o mercado: correlação de 0,35 entre o crescimento e o humor da bolsa nas listadas, contra 0,00 nas fechadas (portão: 0,2 a mais);
- zero storylets mortos, nenhuma estratégia dominante. Os 8 eventos novos aparecem; os que pedem bolsa, muitas subsidiárias ou três empresas são raros, de propósito.

**O que não mudou ou piorou:**
- Continuam abaixo dos portões antigos:
  - a herança entre gerações: Spearman 0,82, contra 0,81 (portão: até 0,8). O grupo passa inteiro ao herdeiro;
  - as assinaturas: 904 por 1.000 vidas, contra 906 (portão: 918);
  - o bilionário feito: 1,34% de quem nasce sem fortuna, contra 1,41% (portão: até 1%).
- CPU por vida: 66,8 ms no túnel, contra 64,2. No mesmo hardware e em sequência, o motor antigo gasta 79,5 ms de CPU por vida e o novo, 80,6 (+1%). A diferença do túnel é ruído da máquina.
- Melhorou de carona: o rico que termina pobre foi de 4,5% para 4,9%, e a saturação V5 de 59,8% para 59,4%.

## Incremento 10: o mundo lá fora (o roteiro; o dono pediu a próxima em 12/10)

O roteiro dizia: "Países fictícios com estatísticas próprias; comércio, câmbio, tarifas, sanções e alinhamento; o que o país decide lá fora muda o crescimento, o dólar e os setores daqui." O dono pediu "Próxima".

**O que mudou:**
- **Quatro países fictícios** (`mundo.json › estrangeiros`, entidades do tipo jurisdição):
  - a Federação do Norte, a superpotência rica: compra aviões, aço e suco de laranja, pesa 30% do que o Brasil vende lá fora e é rival da Celeste;
  - a República Celeste, o gigante industrial: compra soja, minério e carne, pesa 35%, cresce 4,5% ao ano e tem booms;
  - a Liga Atlântica, as velhas democracias do outro lado do oceano: compra café, frutas e celulose e pesa 20%;
  - o Pacto do Sul, os vizinhos: compra carros, máquinas e calçados, pesa 15% e tem crises frequentes.

  Cada um tem a economia dele (o crescimento volta para o de sempre, com a sorte que o mundo divide e a dele), as crises e os booms de lá (notícias na linha do tempo), a relação com o Brasil (0 a 100) e o que compra daqui.
- **Alinhamento e tarifa.** Cada governo daqui se aproxima de uns (`aproxima`): a frente popular do Pacto e da Celeste, o bloco liberal da Federação e da Liga, a aliança da ordem da Federação, o regime da Celeste; o centrão de ninguém. A relação com eles sobe 15, e a com o rival deles cai 15. A nova política de comércio exterior (aberto, moderado, fechado) mexe no potencial (+0,3 / 0 / −0,4), na inflação (−0,5 / 0 / +0,8 ponto, com o tempo), na relação com todos (+5 / 0 / −8) e na aprovação (quem trabalha na fábrica gosta da tarifa).
- **Sanção e acordo nascem da relação.** Abaixo de 35, a chance de sanção cresce com o quadrado da distância (3% ao ano com a relação em 27; 20% em 15). A sanção tira 1,2 × o peso do país do crescimento daqui, por ano, e a demanda dele; acaba quando a relação passa de 38, ou cansa (15% por ano). Acima de 70, com a fronteira aberta ou moderada, o governo de turno assina um acordo (12% ao ano): soma 0,5 × o peso por ano; acaba abaixo de 45. As notícias apontam para a decisão que levou a relação até ali.
- **O que chega aqui:** a crise lá fora tira até 3 pontos do crescimento daqui e põe 2,5 de inflação, e a notícia dela é a primeira causa da virada da fase ("a República Celeste entrou em crise → o país entrou em recessão → você perdeu o emprego"); o boom soma 2; o que o mundo compra a mais ou a menos soma 0,15 × peso × o desvio de cada um.
- **O dólar** (`pais.cambio`, em reais de hoje, perto de R$ 5): sobe com a dívida, com as sanções e com a economia daqui fraca, e cai com o juro real alto e com o mundo comprando do Brasil. A crise lá fora o faz saltar 16% no ano, e o boom o derruba 8%. Ele pesa:
  - na inflação: 0,08 ponto por ponto percentual de alta;
  - no investimento em dólar, que rende o quanto ele subiu (antes, o rendimento era sorteado pela fase);
  - nas empresas de cada setor (o agro ganha com o dólar alto, o comércio perde; a indústria ganha com a tarifa; a sanção de quem compra o setor dói);
  - no salário em dólar (o trabalho remoto para fora), que anda com ele e não é demitido pela crise daqui.
- **Quem governa faz um ato lá fora por ano** (folha País, seção "Lá fora"):
  - a visita de Estado: +15 na relação e −8 na do rival;
  - o acordo comercial: pede relação 60, a fronteira aberta ou moderada e nenhuma sanção;
  - romper relações: −40 na relação, o acordo acaba e a popularidade sobe 4 agora. A confirmação mostra a chance de sanção que fica.
- **Conteúdo:** 18 eventos (`98-la-fora.json`):
  - o dólar barato e o dólar caro;
  - a exportação que bate recorde, o importado que ficou caro;
  - o salário em dólar e o que ele vira com o dólar alto;
  - a crise lá fora na sua rua, o país que compra sem pechinchar, a sanção que para o porto, o acordo que abre mercado;
  - a viagem para fora e a saudade dela, a bolsa de estudos lá fora;
  - para quem governa: a cúpula, o embaixador, a ameaça de sanção, a guerra comercial entre a Federação e a Celeste;
  - a fronteira fechada, o importado que invadiu a fábrica.

  Mais 13 linhas curtas e as notícias do mundo (crise, boom, sanção, acordo e os três atos).

**Decisões tomadas sozinho:**
- **Quatro países, não um mundo inteiro.** Cada um faz um papel na história: o grande cliente industrial, o gigante que compra a soja, o bloco rico e os vizinhos. Com rivalidade entre os dois maiores, escolher lado tem preço. Mais países seriam nomes a decorar sem decisão nova.
- **O choque de fora agora vem dos países.** A crise de lá substituiu a "crise lá fora" sorteada do incremento 2; a alta das commodities virou o boom da Celeste. Para o país não mudar de tamanho, calibrei pelo mesmo conjunto de vidas (300 vidas com as mesmas sementes, antes e depois):
  - as chances de crise de cada país: 1% a 2% ao ano;
  - o peso da demanda: 0,15;
  - o desvio do crescimento daqui: de 1,15 para 1,05, porque o mundo já balança;
  - as relações de sempre: em torno de 50.

  Resultado: as fases ficaram 63,6% / 24,9% / 9,3% / 2,1% (normal, expansão, recessão, crise), contra 64,0% / 24,2% / 9,8% / 2,0% antes. Na primeira versão, com os acordos sempre ativos, a expansão chegava a 30,6% (o portão é 30%).
- **Sanção pela distância, não por limiar.** Com um limiar (abaixo de 20, 30% ao ano), a sanção nunca acontecia: nenhuma postura levava a relação tão baixo. Com a chance crescendo com o quadrado da distância abaixo de 35, acontece em 25,5% das vidas, quase sempre com a Celeste sob a aliança da ordem, que se aproxima da rival dela (1,21% de chance por ano de governo, contra 0,09% com a frente popular).
- **A sanção cansa.** Sem isso, a aliança da ordem reeleita prendia o país numa sanção de 20 anos: só 82,6% acabavam em até 15 anos. Com 15% de chance por ano de acabar mesmo com a relação fria, a mediana é de 4 anos e o p90, de 9.
- **O porquê da sanção.** Primeiro, a decisão sobre a relação com aquele país nos últimos dez anos, no mesmo sentido (o ato de quem governa, uma escolha); senão, a posse ou a reeleição do governo cuja postura puxa a relação para baixo, ou a tarifa. A reeleição não mudava nada no livro, e 14% das sanções ficavam sem causa por isso. As que sobram sem causa são de governos que já estavam lá quando a vida começou.
- **O dólar rende o que o dólar sobe.** O investimento em dólar tinha rendimento sorteado pela fase (+22% na crise). Agora ele segue o câmbio, que sobe na crise, mas menos (+7% em média nos anos de crise, +4% na recessão, −1% na expansão): continua sendo o seguro da carteira, com uma causa à vista.
- **Romper relações dá popularidade e custa caro.** No laboratório, romper com a Celeste traz a sanção em até 5 anos em 34,8% dos casos; depois de uma visita de Estado, em 0,8%. A folha mostra a chance antes de confirmar. A arriscada rompe quando a popularidade cai; a cautelosa assina o acordo que dá e visita quem esfriou.
- **O salário em dólar acaba com o emprego.** Largar o emprego (folha Carreira, fim de carreira, storylet que troca de emprego ou zera a renda) encerra a marca; sem isso, quem virava empresário continuava "ganhando em dólar".
- **Um defeito antigo apareceu:** o campo `pais.pol_comercio` não foi declarado e o motor o lia como qualidade (sempre 0). Por isso a fronteira fechada nunca acontecia, e o importado barato acontecia sempre. Os campos de política agora saem da lista de políticas, para nenhum ficar de fora.
- **CPU:** com quatro entidades a mais, as funções que varriam todas as entidades a cada leitura do patrimônio ficaram mais caras. As empresas agora são lidas pelos lugares delas (`empresa`, `empresa2`…), os bens pelo prefixo do id, e a postura do governo é calculada uma vez por ano. Mesmo assim, o motor novo custa uns 10% a mais de CPU por vida (108,5 contra 98,5 ms, três rodadas alternadas de 600 vidas no mesmo hardware): é o preço de um sistema inteiro novo.

**Portões (10.000 vidas):**
- a crise lá fora chega aqui: 48,4% das 37.034 viradas para recessão ou crise apontam a crise de um país de fora como causa (portão: 10%);
- o dólar anda e volta: p10 R$ 4,09, mediana R$ 5,06, p90 R$ 6,31 (portão: p90 ≥ 1,3 × p10, mediana entre R$ 4 e R$ 6);
- o dólar pesa na inflação: 6,5% nos anos em que ele sobe 10% ou mais, contra 4,2% nos anos em que cai 10% ou mais (portão: 1 ponto);
- o dólar divide os setores: por ponto de alta, a empresa do agro cresce 0,30 ponto a mais e a do comércio, 0,31 a menos (4.431 e 33.047 empresas-ano);
- sanções e acordos acontecem e acabam: sanção em 25,5% das vidas, acordo em 71,9%, e 98,7% das sanções acabam em até 15 anos (portão: 5% a 40%, 30% e 90%);
- toda sanção tem um porquê: 87,3% das 3.448 sanções apontam a decisão que esfriou a relação (portão: 80%); as outras são de governos que já estavam lá quando a vida começou;
- alinhar-se tem preço e abrir tem prêmio: a Celeste sanciona 1,21% dos anos com a aliança da ordem e 0,09% com a frente popular; acordos começam em 3,75% dos anos com o bloco liberal e 0,30% com a aliança da ordem;
- quem governa decide lá fora: 73,5% dos 351 governos de quem joga fazem um ato; romper traz sanção em 34,8%, a visita, em 0,8% (portão: 50%, 30% e 5%);
- zero storylets mortos, nenhuma estratégia dominante; as fases ficaram 63,2% / 24,9% / 9,7% / 2,2% (antes 64,7% / 23,1% / 10,0% / 2,2%), com 14,0 viradas a cada 70 anos (antes 15,4).

**O que não mudou ou piorou:**
- Continuam abaixo dos portões antigos:
  - a herança entre gerações: Spearman 0,81 (antes 0,82; portão: até 0,8);
  - as assinaturas: 903 por 1.000 vidas (antes 904; portão: 918);
  - o bilionário feito: 1,70% de quem nasce sem fortuna (antes 1,34%; portão: até 1%). Não isolei a causa: o sorteio de todas as vidas mudou, e as empresas agora também andam com o dólar.
- CPU por vida no túnel: 87,4 ms, contra 66,8 (o túnel roda junto com outras coisas na máquina; a comparação justa é a de cima, +10%).
- O rico que termina pobre caiu de 4,9% para 3,8% (portão: 3,0%). O pobre que termina rico, de 14,6% para 14,0%.
- Melhorou de carona: o porquê à vista foi de 25,9% para 29,8% dos acontecimentos (as notícias de fora explicam viradas daqui), a saturação V5 de 59,4% para 58,0%, e o mundo nos pontos de virada de 9,1% para 9,6%.
- Um storylet antigo morreu com o sorteio novo e voltou: `construtora_quebrou` só acontecia se o país estivesse em crise exatamente três anos depois da compra na planta (as chaves chegavam antes na recessão). Agora a recessão também para a obra, e toda compra na planta termina numa das duas histórias.

## Universo de bolso: Fase 0 e a fatia 1.1, toda transferência tem dois lados (12/10)

O dono mandou a missão "Universo de bolso" e pediu: "audite o projeto antes de modificar qualquer código". Depois da auditoria, pediu: "Lance uma atualização nova".

### Fase 0

- `docs/auditoria-universo.md`: o inventário de cada área, a linha de base e os defeitos achados.
- `docs/arquitetura.md`: os 13 módulos, os contratos, os conflitos com os requisitos de hoje, as fases e a primeira fatia.
- `docs/ideias.md`: o registro permanente de ideias.

O incremento 11 ("morar lá fora") ficou como rascunho, não publicado: a emigração dos robôs saiu alta demais. Ele volta como a fatia 3.2, depois da decisão sobre países reais.

### Fatia 1.1: toda transferência tem dois lados

**O que mudou:**
- **A contraparte no livro.** Toda mudança de dinheiro diz de quem veio ou para quem foi (`Mudanca.p`). Pode ser:
  - o mercado, o governo, o banco ou os parentes;
  - uma pessoa ou empresa da vida;
  - a reavaliação, quando é preço que mudou sem dinheiro trocar de mão.
- **O ano econômico, fluxo por fluxo:** salário, imposto, auxílio, bico, consumo, padrão de vida, velhice, juros da dívida, juro da renda fixa, inflação e cotação. Também dizem a contraparte:
  - bens, empresas e campanhas;
  - as heranças entre personagens e a família;
  - os efeitos do conteúdo.
- **`contas.ts`** confere as contas entrada por entrada e monta o extrato. O túnel trava o CI se uma entrada não fechar.
- **A folha Dinheiro** mostra o extrato do ano e o da vida toda: "Salário, +R$ 240 mil, do mercado", "Imposto, −R$ 18 mil, para o governo", "Juros da dívida, −R$ 2,4 mil, para o banco", "Inflação no dinheiro parado: preço que mudou, ninguém pagou".
- **Efeito novo no conteúdo:** `contraparte`. Sem ele, o dinheiro do bloco é com o mercado.

**Decisões tomadas sozinho:**
- **A conta do estado ficou idêntica; só a anotação mudou.** Por isso nenhuma vida mudou, e o túnel prova: o `docs/metricas.md` saiu igual linha por linha, fora as linhas novas e o tempo de CPU. Mexer nos números ficou para quando houver uma decisão nova (a dívida como contrato, a fatia 1.2).
- **As contas de fora ficam só no livro, não no estado.** Elas ainda não decidem nada, e o validador exige que todo campo escrito seja lido por quem decide. Viram entidades com balanço na Fase 4 (o banco e o tesouro).
- **As contrapartes:**
  - o salário vem do mercado; para servidor, cargo público e aposentadoria, do tesouro;
  - o juro da renda fixa vem do tesouro (títulos);
  - a cotação das ações, dos fundos, do dólar e das criptomoedas é reavaliação;
  - a dívida é com o banco;
  - a parte dos irmãos numa herança vai para os parentes;
  - a venda de imóvel separa a corretagem e a quitação do financiamento.
- **O imposto.** A renda já vem sem o imposto de sempre; a política do governo cobra a mais ("Imposto") ou devolve ("Imposto mais baixo"). Na primeira versão do extrato, um corte de imposto aparecia como "Imposto, +R$ 9,6 mil, do governo", o que confunde.
- **A troca de quem ocupa um papel não entra na conferência.** O amor novo entra com os números dele, e o antigo sai com os seus: não é dinheiro trocando de mão.
- **O esquema do save ganhou o campo.** Sem isso, a contraparte sumia ao recarregar, a mesma fragilidade que a auditoria apontou (o Zod descarta chave desconhecida). O teste de ida e volta pegou na hora. Save antigo carrega; o extrato só mostra o que veio depois.
- **A conferência só olha pessoas.** A primeira versão acusou 5.030 "problemas" que eram a dívida do país, um percentual do PIB, não dinheiro.

**Medidas:**

| Medida | Antes | Depois |
|---|---|---|
| Entradas com dinheiro sem contraparte | 86,6% das que mexem em dinheiro (sonda de 450 vidas) | 0 problemas em 3.838.873 entradas (10.000 vidas do túnel) |
| Métricas do túnel | | iguais, fora as linhas novas e o tempo de CPU |
| CPU por vida (mesma máquina, três rodadas alternadas de 240 vidas) | 50 ms | 53 ms (+6%) |
| Save no fim da vida | mediana 279 KB, p90 384 KB, máximo 445 KB | 304 KB, 421 KB, 487 KB (+9%) |
| Testes | 197 | 204 (7 de contas, inclusive os que provam que a conferência acusa o erro) |

**O que não mudou, ou ficou de fora:**
- A dívida continua um número: o contrato é a fatia 1.2.
- A empresa continua sem caixa: fatia 2.2.
- O governo continua sem orçamento: Fase 4.
- **Herança de quem joga.** A partilha cria a vida nova com o espólio já dividido. O que saiu dele (o imposto, a metade do cônjuge, a dívida que ele não cobria) ainda não aparece como fluxo, porque a vida nova começa um livro novo.
- **Leitura do extrato da vida.** Ele soma valores de anos diferentes em reais de hoje. A inflação já está fora deles; o que aparece como "inflação no dinheiro parado" é o que o dinheiro parado perdeu.

## Universo de bolso: fatia 1.2, a dívida como contrato (12/10)

O dono pediu de novo: "Lance uma atualização nova". A fatia seguinte do roteiro era a 1.2 (I-02 em `docs/ideias.md`).

**O que mudou:**
- **Toda dívida é um contrato com o banco**, uma entidade com credor, saldo, parcela, atraso e a entrada do livro que a fez (o porquê). As modalidades:
  - **o cheque especial**, que cobre a conta no vermelho;
  - **o empréstimo**, que nasce de uma escolha: o efeito `divida` do conteúdo, como a festa parcelada ou o carro em sessenta vezes;
  - **o financiamento**, com o imóvel em garantia;
  - **o acordo** de uma renegociação.
- **A dívida de quem joga e o financiado de cada bem** viraram espelhos dos contratos. O túnel trava o CI se, em alguma entrada, o que se deve não for o que o banco tem a receber.
- **O ano das dívidas:**
  - juros por contrato e mora no que atrasou;
  - o dinheiro que sobra paga primeiro o atrasado;
  - a parcela sai da conta, dos investimentos e do crédito que sobrar;
  - o que passa do limite atrasa;
  - atraso suja o nome, e o banco não empresta mais nem financia;
  - o financiamento atrasado dois anos vai a leilão;
  - a dívida atrasada há cinco anos caduca.
- **Decisões:**
  - renegociar troca as dívidas por um acordo com desconto, que cresce com o atraso;
  - quitar paga uma dívida;
  - financiar é a compra que cria o risco.
- **A folha Dinheiro tem a seção Dívidas.** Cada contrato mostra de onde veio ("aos 27, casou numa festa parcelada"), o saldo, o juro real, a parcela e quanto falta para caducar ou para o leilão. Ela também mostra a proposta do banco, com o botão "Renegociar".
- **A linha do tempo conta o nome que suja e limpa, a dívida que caduca e o leilão**, cada um com o porquê: a escolha que fez a dívida ou, no cheque especial, o que mais sacou nele.
  - As entradas de regra que contam algo passaram a mostrar o "Porque aos 27, você casou numa festa parcelada". Antes, só os eventos, as iniciativas dos personagens, a morte e o país mostravam.
  - A empresa que perde valor sem o dono ganhou o porquê junto.
- **Conteúdo:**
  - três storylets que leem o nome sujo: a cobrança no telefone, o aluguel negado e o feirão de limpar o nome;
  - três linhas curtas;
  - o efeito novo `renegociar`;
  - a carta do banco agora só chega a quem está mesmo com o nome sujo.

**Decisões tomadas sozinho:**
- **Espelhos em vez de apagar os campos.** `eu.divida` e `bem.financiado` continuam no estado, sempre iguais à soma dos contratos. Assim, o conteúdo e as regras que já liam a dívida seguem valendo, e o túnel confere os dois lados.
- **O crédito do dia a dia se paga sozinho; o acordo e o financiamento, pela parcela.** O dinheiro que sobra paga o cheque especial e os empréstimos, como antes. Se o acordo também fosse pago assim, a parcela não teria sentido.
- **O critério do atraso do cheque especial e do empréstimo é o limite de crédito.** Ele é o de antes: duas rendas por ano, no mínimo R$ 30 mil. O que passa dele no fim do ano atrasa, o mais novo primeiro.
  - Antes, a dívida acima do limite congelava, sem juro e sem consequência.
  - Quem tem investimentos resgata para cobrir antes de atrasar. Na vida real, a justiça bloquearia; e assim ninguém "espera caducar" com dinheiro aplicado.
- **O atraso só sai pago, renegociado ou caduco.** Na primeira versão, o atraso sumia quando a dívida voltava a caber no limite. A sonda mostrou o defeito: quem vivia no limite sujava e limpava o nome a cada um ou dois anos, e a linha do tempo virava um pisca-pisca. A parcela do financiamento e a do acordo seguem outra regra: paga, o contrato volta a ficar em dia.
- **Os números:**
  - **mora:** 8% reais ao ano no lugar do juro do contrato;
  - **multa:** 2% ao atrasar;
  - **acordo:** 8% reais, em quatro parcelas;
  - **desconto do banco:** 30% com um ano de atraso, chegando a 70%, o desconto de feirão;
  - **caducar:** cinco anos. É o tempo que a dívida fica no cadastro de devedores e o prazo de cobrança na vida real; "esperar caducar" é uma decisão brasileira de verdade;
  - **leilão:** dois anos de parcelas atrasadas. O lance paga 70% do valor, a sobra volta para quem joga e o que não cobre o banco perde.
- **O nome sujo é do motor.** Três escolhas do conteúdo davam a marca sem dívida nenhuma, e ela durava a vida inteira. Agora:
  - a marca só existe enquanto houver dívida atrasada;
  - as escolhas que "ignoravam a carta" deixam a dívida atrasar sozinha;
  - as renegociações do conteúdo usam `renegociar`.
- **Os robôs:**
  - a arriscada financia a casa assim que a parcela cabe, e nunca renegocia: espera caducar;
  - a cautelosa nunca financia e renegocia na hora;
  - a aleatória faz um pouco de cada.
  Sem isso, o financiamento e o leilão nunca apareciam no túnel: os robôs não financiavam.
- **O portão do acordo conta cada vez que o nome sujou pela dívida sem garantia.** A primeira versão comparava vidas: a mediana deu 1 ano com acordo e 1 ano sem, e o portão reprovou. A sonda mostrou que o grupo sem acordo era quase todo de financiamento, que acaba no leilão ou no pagamento em cerca de um ano, com acordo ou sem. Pela dívida que se renegocia, o acordo encurta o nome sujo de 2,67 para 0,85 ano.
- **A herança.** O financiamento passa ao herdeiro com o imóvel. A dívida sem garantia continua paga pelo espólio, e o que ele não cobre o banco perde, como já era. A abertura da vida nova anota de qual imóvel é o financiamento herdado. A conferência achou essa falta na primeira rodada: o livro novo não tinha a compra.

**Medidas** (túnel de 10.000 vidas; CPU e save em A/B na mesma máquina, três rodadas alternadas de 240 vidas):

| Medida | Antes | Depois |
|---|---|---|
| Dívida com credor | um número sem credor | toda dívida é contrato; 0 problemas em 4.365.879 entradas (sorteadas, de origem escolhida e dinastias) |
| Vidas com o nome sujo (portão: 2% a 25%) | só pela marca do conteúdo, sem dívida por trás | 11,7% (arriscada 24,2%, aleatória 17%, primeira 3,4%, cautelosa 2%) |
| Anos com o nome sujo pela dívida sem garantia: com acordo × esperando | — | 0,85 × 2,67 (p90 4) |
| Quem financiou e perdeu o imóvel em leilão (portão: 1% a 25%) | ninguém (os robôs não financiavam) | 20,9% de 3.544 vidas |
| Vidas que viram uma dívida caducar | — | 1,3% (11,3% das que sujaram o nome) |
| O porquê à vista na linha do tempo | 29,7% dos acontecimentos | 30,1% |
| Patrimônio mediano: arriscada / aleatória | R$ 2,9 milhões / R$ 2 milhões | R$ 2,4 milhões / R$ 1,7 milhão |
| Patrimônio mediano: cautelosa / primeira | R$ 73 milhões / R$ 1,4 milhão | R$ 74 milhões / R$ 1,4 milhão |
| Quem nasce sem fortuna: mediana do patrimônio | R$ 2,5 milhões | R$ 2,2 milhões |
| Mobilidade: do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 13,9% / 3,6% | 14,8% / 4,1% |
| Dinastias: gerações em média / chegam à 3ª | 3,1 / 61,3% | 2,9 / 55,4% |
| Spearman entre gerações (o portão já reprovava) | 0,81 | 0,85 |
| Vidas com patrimônio negativo ao morrer | 0,6% | 0,6% |
| Nenhuma estratégia domina | sim | sim |
| CPU por vida (A/B) | 53,1 ms | 56,1 ms (+6%) |
| Save no fim da vida: mediana / p90 / máximo | 273 / 410 / 485 KB | 279 / 411 / 486 KB |
| Testes | 204 | 216 |
| Conteúdo | 554 eventos, 232 linhas | 557 eventos, 235 linhas |

**O que ficou de fora:**
- **O banco como entidade com balanço e capital** (Fase 4). O limite continua pela renda.
- **Credores que não são o banco** (o agiota, o amigo que empresta). O contrato já tem o campo `credor`.
- **A penhora de outros bens além da garantia.** Quem tem um iate e nenhum dinheiro pode ficar com o nome sujo.
- **A dívida da empresa** continua no CPF de quem joga (fatia 2.2).
- **O Spearman entre gerações piorou um pouco (0,81 para 0,85).** O portão já reprovava. As dinastias da arriscada e da aleatória ficaram mais curtas, porque o leilão e o nome sujo tiram fortuna de quem arrisca. Fica para quando a herança for instrumento (holding, I-13).

## Próximos passos (núcleo)

- Ver `docs/roteiro.md`: a fase 2 substitui os próximos passos da fase 1.
