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

## Universo de bolso: fatia 1.3, o ano em etapas declaradas, e o processo mais barato (18/10)

O dono disse "Vá" para a fatia 1.3 (I-03, com o livro compacto, I-04). No meio dela, pediu uma missão de autoaperfeiçoamento: medir por que o trabalho custa tanto tempo e contexto, e melhorar o processo e o produto com números.

**O que mudou na fatia:**
- **O ano é uma lista de 19 etapas declaradas** (`manifesto.ts › ETAPAS_DO_ANO`). Cada uma diz o que lê e escreve do estado, a agenda e o que passa às seguintes (`ano.fase`, `ano.mercado`, `ano.economia`). `dependenciasDoAno` tira daí o que cada etapa lê deste ano e o que lê do ano passado.
- **`test/ano.test.ts`** joga 30 vidas com um gravador (Proxy) e falha se uma etapa sair da declaração. A conferência numa amostra larga (660 vidas e os herdeiros delas, de 11 origens) também passou.
- **O túnel mostra a CPU e o livro de cada etapa, e o tamanho do save** (I-83, parcial).
- **O save tem cópia de segurança, exportar e importar** (D-12).
- **O diretor calcula as causas só do storylet sorteado, e os robôs listam as ações uma vez:** −12% de CPU sem mudar nenhuma vida.

**O que mudou no processo e no produto:**
- **O túnel roda um trabalhador por núcleo:** 687 s → 199 s nas 10.000 vidas, com o relatório igual linha por linha, menos o tempo. `npm run verificar` caiu de 12 min 05 s para 3 min 54 s.
- **`npm run tunel:rapido`** (2.000 vidas, cerca de 1 min) é o ciclo curto. Um túnel parcial escreve `dist-tunel.md` e não apaga mais as métricas oficiais; antes, escrevia por cima e era preciso desfazer à mão.
- **O toque no celular ficou 2,8× mais rápido no fim da vida.** A cópia da vida divide o livro, o save grava depois da pintura e a linha do tempo só redesenha o que mudou.
- **O CLAUDE.md manda ler só ele e o começo do roteiro;** o resto se busca com grep. Antes, o fluxo pedia seis documentos inteiros, 260 KB, perto de 75 mil tokens antes de qualquer trabalho. Ele também registra as armadilhas que custaram rodadas inteiras.

**Diagnóstico do processo** (pela transcrição desta sessão, 2.977 respostas em 12 dias):
- **Tempo:** 34 rodadas de `verificar` e 36 túneis avulsos. A 12 min cada, o túnel de um núcleo foi a maior espera, com 3 dos 4 núcleos parados.
- **Tokens:**
  - cada resposta relê o contexto inteiro (435 mil tokens em média);
  - houve 13 compactações;
  - o custo é o número de idas e voltas vezes o tamanho do contexto. Cortar consultas repetidas e saídas grandes rende mais que encurtar textos.
- **Desperdício recorrente:**
  - a lista de tarefas tinha 72 itens concluídos e voltava em cada lembrete do sistema (limpa: agora são os itens ativos);
  - dois `verificar` perdidos com `pkill -f`, que casava com o próprio shell;
  - túneis parciais que sobrescreviam as métricas.
- **O que não foi medido:** o comando `/usage` não roda numa sessão na nuvem, então o consumo vem da transcrição, não da cobrança.

**Decisões tomadas sozinho:**
- **Declarar a ordem de hoje, sem mudá-la.** As vidas são as mesmas: mesma impressão digital do save em 160 vidas, e `docs/metricas.md` igual fora as linhas novas e o tempo.
- **Caminhos genéricos, com `*` só onde o conteúdo decide.** `ctr.*` é o contrato inteiro (uma unidade). `eu.*` só nas leituras das marcas e das causas de morte, que são dados. `*` nas etapas do conteúdo, que o validador já cobre.
- **O que passa entre as etapas sem gravar também é declarado** (`ano.*`). O primeiro teste mostrou que a economia recebia o mercado pelo argumento, fora do estado.
- **O gravador fica no teste.** O Proxy custa 0,2 s por vida, e o túnel não o roda.
- **O livro compacto (I-04) ficou para depois, com números.**
  - O maior save de uma vida é 479 KB (mediana 277 KB, 97% dele o livro), e a vida de quem herda começa um livro novo.
  - Um terço do livro é o mundo: o país, o exterior e o mercado anotam 98 KB por vida.
  - Volta quando o save passar de 1 MB ou o mundo crescer.
- **D-08 continua aberto.** Registrar o agendado que caiu pedia uma entrada nova no livro, e ela apareceria vazia na linha do tempo. A agenda inteira está fora do livro; corrigir isso é colocá-la lá.
- **A cópia de segurança se renova quando o jogo abre, não a cada toque.** A cada toque, ela dobraria o custo da gravação.
- **A CPU por vida vem de uma amostra isolada.** Com os núcleos ocupados, cada vida demora 34% mais; na thread principal, o heap com as outras vidas a atrasava 7%. A amostra de 240 vidas, num trabalhador novo e sozinho depois de um aquecimento, dá 46,8 ms contra 47,4 ms do túnel de um núcleo.
- **A cópia que divide o livro depende de o livro só crescer.** Um teste congela o livro entre os toques em vidas inteiras e falha se o motor mexer numa entrada antiga.
- **O save grava até meio segundo depois do toque.** Sair do app ou trocar de aba grava já. Recarregar logo depois de tocar não perdeu o ano (Playwright).

**Medidas:**

| Medida | Antes | Depois |
|---|---|---|
| Etapas do ano com leitura e escrita declaradas | 0 | 19, conferidas por teste |
| `npm run verificar` (tipos, testes, validador, túnel, build) | 12 min 05 s | 3 min 54 s |
| `npm run tunel`: simulação das 10.000 vidas | 687 s (1 núcleo) | 197–199 s (4 trabalhadores) |
| Túnel rápido para iterar | 400 vidas escrevendo por cima das métricas | `tunel:rapido`: 2.000 vidas em cerca de 1 min, sem tocar nas métricas |
| CPU por vida (A/B, mesma máquina, 600 vidas) | 51,6 ms | 45,5 ms (−12%) |
| Toque aos 60–79 anos, CPU 4× mais lenta: mediana / p90 | 82 / 107 ms | 29 / 46 ms |
| Toque aos 75–83 anos: mediana / p90 | 99–115 / 185–199 ms | 35–41 / 72–128 ms |
| Leitura pedida no início de cada sessão | 260 KB (6 docs inteiros) | CLAUDE.md e o começo do roteiro |
| Lista de tarefas repetida nos lembretes | 72 itens | os ativos |
| Save corrompido | apagava a vida e a memória | volta da cópia, com aviso |
| Testes | 216 | 230 |
| Bundle (precache) | 1.140 KB | 1.145 KB (`memo` do Preact) |

**O que ficou de fora:**
- **A CPU do motor por vida** (o portão antigo de 30 ms). O diretor e as iniciativas avaliam as condições de centenas de storylets por ano; indexá-los pelas qualidades que exigem é o próximo passo (I-08).
- **O teto por fase do orçamento** (I-83).

## Universo de bolso: fatia 1.4a, vários filhos (19/10)

O dono mandou três telas do APK (uma soberana bilionária aos 50 anos) e pediu a próxima atualização. A fatia seguinte do roteiro era a 1.4 (I-05, identidade de pessoas). Pelo método, ela foi cortada em duas, e esta é a parte de maior valor para quem joga: vários filhos. As telas também mostravam o cabeçalho cortado.

**O que mudou:**
- **Um filho novo não apaga o outro.** Antes, um segundo filho tomava o papel `filho`, e a adoção depois de um filho apagava o primeiro. Agora:
  - cada filho tem um id estável, na ordem de chegada (`filho`, `filho2`… até 4), e `eu.filhos` conta quantos a vida teve;
  - todos vivem o ano (saúde, doença, morte, vínculo e iniciativas);
  - o conteúdo escrito para o papel `filho` vale para cada um (instâncias diferentes, mais combinações sem texto novo).
- **O storylet que cria um filho fala do recém-nascido**, e o que ele agenda (adolescência, formatura) é sobre esse filho.
- **A herança:**
  - continua o filho mais velho vivo;
  - sem testamento, os filhos dividem, e os outros viram irmãos de quem herda na vida nova (o caminho do sobrinho na geração seguinte);
  - o testamento tem um botão por filho: tudo para ele, sem dividir;
  - se o primeiro filho morreu, o segundo herda.
- **Conteúdo:**
  - quatro storylets: mais um filho, o ciúme do irmão mais velho, os irmãos que brigam e o Natal com os filhos todos;
  - a gravidez surpresa vale também para quem já tem filho.
- **O cabeçalho:** a linha do dinheiro rolava escondida com seis itens, e na tela do dono aparecia cortada no meio. Agora mostra dinheiro, dívida, patrimônio e renda, e quebra linha quando não cabe.
- **Um defeito antigo das dinastias, achado pelo túnel:**
  - o imóvel e o financiamento herdados mantinham os ids da vida anterior, enquanto o livro novo recomeça a numeração;
  - uma entrada de mesmo número comprava outro imóvel por cima do herdado, ou reusava o id de um contrato quitado;
  - agora os dois ganham ids da abertura da vida nova.

**Decisões tomadas sozinho:**
- **Ids estáveis em vez de "o papel aponta para a pessoa".** O ponteiro mexeria no livro, no save, no validador e na interface de uma vez (a 1.4 inteira, custo G). Com ids estáveis, o livro, as condições (`filho.idade`) e o texto antigo continuam valendo, e o save antigo só ganha a conta dos filhos. O ponteiro fica para a 1.4b, com o ex que continua existindo.
- **`{filho}` é o primeiro filho, salvo no storylet que cria um filho,** em que é o recém-nascido. O conteúdo que fala de qualquer filho usa `{ator}`.
- **Sem testamento, a lei divide; o testamento concentra.** A divisão sai como a metade do cônjuge: do dinheiro primeiro, e só depois das empresas e dos bens. Escolher um filho no testamento vira a decisão de dinastia: dividir com justiça ou manter a fortuna inteira.
- **Até quatro filhos.** É o que cabe na folha Família sem virar tela de gestão.
- **A frequência do segundo filho.** A iniciativa do par com tensão 1,5 dava 4% das vidas com dois ou mais filhos. Com tensão 2 (a mesma do primeiro filho), dá 13,6%, ou 41% de quem tem filho, perto do Brasil real (1,6 filho por mulher). Os pedidos têm intervalo de 5 anos, e "a família está completa" encerra o assunto.

**Medidas** (túnel de 10.000 vidas; a CPU em A/B na mesma máquina, porque a VM do reinício é mais lenta):

| Medida | Antes | Depois |
|---|---|---|
| Vidas com 2 ou mais filhos | 0% (o segundo apagava o primeiro) | 13,6% (1,47 filho em média entre quem tem) |
| Filhos apagados por outro | possível (adoção depois de um filho) | 0 em 11.056 vidas (meta que trava o CI) |
| Herdeiro com irmãos (a herança se divide) | 0% | 15,5% |
| Dinastias: gerações em média / chegam à 3ª / chegam à 5ª | 2,9 / 55,4% / 20,2% | 3,3 / 62,5% / 32,7% |
| Spearman entre gerações (o portão já reprovava) | 0,85 | 0,86 |
| Mobilidade (Spearman origem × fim) | 0,32 | 0,31 |
| Saturação V5 / V20 | 57,9% / 90,6% | 57,4% / 90,6% |
| Assinaturas por 1.000 vidas (sem a origem) | 906 (580) | 906 (591) |
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| CPU por vida (A/B, 400 vidas, duas rodadas) | 61,9–64,2 ms | 64,2–65,6 ms (+3%) |
| Testes | 230 | 238 |
| Conteúdo | 557 eventos | 560 eventos e 85 de personagens |

**O que ficou de fora:**
- **A 1.4b:** o ex que continua existindo (o papel `amor` ainda troca de pessoa) e as relações entre os personagens.
- **Gêmeos e irmãos que se relacionam entre si.** Os irmãos aparecem pelo texto, não como laços próprios.
- **O Spearman entre gerações continua acima do portão (0,86).** A divisão entre irmãos baixa a fortuna de quem herda, mas os 85% de vidas com um filho só, ou nenhum, seguem herdando tudo.

## Os blocos do dono: bloco A, o país em números (19/10)

O dono fez seis perguntas de uma vez (19/10):
- por que o soberano não recebe salário, parte dos impostos ou taxa da coroa;
- por que o país não tem PIB, PIB per capita, Gini, IDH nem população;
- por que o título do Tesouro comprado não entra no balanço como ativo, pagando no caixa pessoal ou no da empresa;
- por que o Estado não paga pesquisa;
- por que não há armas nem guerra;
- por que as ideias dele não estavam sendo aplicadas.

Ele pediu atualizações em blocos pequenos, cada uma descrita, colorida, na página de abertura do repositório.

**Por que as ideias esperavam:**
- todas estavam no registro (`docs/ideias.md`): o Tesouro é a I-31, o título é a I-34, a coroa é a I-41, a ilha é a I-43, a pesquisa é a I-54, as forças armadas são a I-60 e a guerra é a I-61;
- elas ficavam nas fases 4 a 7 da arquitetura, ordenadas por dependência, e o trabalho vinha fatia a fatia pela fase 1 (contas, contratos, o ano em etapas, os filhos).

A ordem agora é a do dono, respeitando só as dependências (`docs/ideias.md › A ordem do dono`).

**O que mudou:**
- **O PIB** (`pais.pib`), em reais de hoje: começa em R$ 11,7 trilhões e cresce exatamente o crescimento do ano, o mesmo número que a folha País mostra.
- **A população** (`pais.populacao`): começa em 213 milhões.
  - Cresce 0,45% ao ano em 2026, menos 0,022 ponto por ano depois (a transição demográfica), com piso de −0,35%.
  - Soma 0,01 ponto por ponto de saúde pública acima de 50, e 0,006 por ponto de pobreza acima de 25.
  - Para de crescer por volta de 2045 e depois encolhe.
- **Três números derivados**, sem estado nem save (`campos.ts › indicadoresDoPais`):
  - o PIB per capita;
  - o Gini, que sobe com a pobreza e cai com a educação;
  - o IDH, a média geométrica de saúde, educação e renda (o log do PIB per capita em dólar).
- **A violência passa a ler o Gini:** o mesmo peso de antes por ponto de pobreza, mais o efeito da educação.
- **A folha País ganha a seção "Em números":** os cinco indicadores, a seta do ano e uma linha sobre o que cada um quer dizer.
- **Cinco histórias leem os números:** o PIB recorde (pedir aumento, pôr a sobra na bolsa, churrasco), a desigualdade no jornal, o IDH muito alto (trocar o plano de saúde pelo SUS), o IDH em queda (pagar plano, cobrar o vereador) e o país que encolhe.
- **O texto do conteúdo** mostra o IDH e o Gini com vírgula ("0,83") e a população em milhões ("205 milhões"): os campos ganharam `casas` e `milhoes`.
- **O save antigo** ganha o PIB e a população projetados de 2026 até o ano dele, sem sorteio.
- **O README** abre com as novidades: o que a atualização trouxe, o que não trouxe e os próximos blocos. O `CHANGELOG.md` guarda o histórico.

**Decisões tomadas sozinho:**
- **O bloco A primeiro.** É o único dos cinco sem dependência.
  - O Tesouro (B) é a base dos outros três: quem paga a coroa, a pesquisa e o exército é o orçamento.
  - Mas ele mexe na dívida do país, nas contrapartes do livro (hoje `tesouro` é um nome de contraparte, não uma entidade) e nos contratos. É uma atualização inteira.
- **Os números de partida** são os do Brasil real, arredondados:
  - o PIB de 2024 (R$ 11,7 trilhões);
  - a população estimada de 2025 (213 milhões);
  - Gini perto de 0,52 e IDH perto de 0,77 com as estatísticas típicas.
- **Gini e IDH derivados, não guardados.** Eles são funções do que o país já tem (pobreza, educação, saúde, PIB per capita). Guardar seria estado duplicado, e o validador exigiria leitores para uma cópia.
- **O PIB cresce o crescimento já arredondado.** Com o valor sem arredondar, o PIB crescia um pouco diferente do número que a folha mostra (o teste pegou 4,24% contra 4,2%).
- **Peso 1 nas cinco histórias.**
  - Com peso 2, elas tiravam anos das histórias de família: nas mesmas 600 vidas, as vidas com filho caíam de 28,8% para 25,7%.
  - Com peso 1, ficam em 28,2%. O país é pano de fundo; a família é o centro.

**Medidas** (túnel de 10.000 vidas; a CPU na mesma máquina):

| Medida | Antes | Depois |
|---|---|---|
| PIB, população, PIB per capita, Gini e IDH | não existiam | no fim da vida: IDH 0,80 a 0,87 (mediana 0,83), Gini 0,48 a 0,56 (0,53), população 177 a 208 milhões (193), PIB per capita R$ 117 mil a R$ 650 mil (R$ 252 mil) |
| As cinco histórias do país em números | — | em 6% a 16% das vidas cada (o IDH em queda 6,0%, a desigualdade 9,7%, o PIB recorde 11,7%, o país que encolhe 15,4%, o IDH muito alto 16,0%) |
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| Saturação V5 / V20 | 57,4% / 90,6% | 57,1% / 90,3% |
| Assinaturas por 1.000 vidas (sem a origem) | 906 (591) | 909 (585) |
| Mobilidade (Spearman origem × fim) | 0,31 | 0,31 |
| Vidas com filho / com 2 ou mais | 33,3% / 13,6% | 32,6% / 13,3% |
| Mortes pela violência do país | 4,5% | 3,9% (variação de amostra: nas mesmas 3.000 vidas, 3,8% sem as histórias novas e 4,6% com elas) |
| Mudanças de estado causadas pelo jogador | 44,8% | 44,8% |
| CPU por vida (A/B, 400 vidas, duas rodadas) | 62,8–65,1 ms | 63,0–63,1 ms |
| Testes | 238 | 244 |
| Conteúdo | 560 eventos | 565 eventos |

O `tudo_pela_sua_mesa` (quem centralizou tudo na empresa) aparecia em menos de 0,05% das vidas e morreu nesta rodada, com os caminhos novos. A condição desceu de 85 para 82 de dependência: quem funda sozinho começa em 80, e agora basta uma decisão de centralizar (antes, duas) para a consequência poder aparecer.

**O que ficou de fora:**
- **O IDH e o Gini ainda não mudam o voto.** O eleitor continua lendo crescimento, desemprego, inflação, violência e saúde.
- **A população não muda o mercado de trabalho nem a previdência.** São as coortes da I-70.
- **Não há gráfico da história dos indicadores** (I-80).
- **Os blocos B a E**, na ordem de `docs/ideias.md › A ordem do dono`.

## Os blocos do dono: bloco V1, a cara nova (19/10)

Depois do bloco A, o dono mandou duas coisas:
- **um mockup da tela principal**, "a inspiração": fundo azul-noite com ouro, a marca no topo, um retrato, os quatro indicadores em cartões, o dinheiro em cartões com uma rosca, um destaque para o "marco da trajetória", os seis verbos com ícone e um botão dourado "viver mais 1 ano";
- **um pacote zip** com o bundle do APK e uma camada de CSS por cima: paleta terracota refinada, cartões nos atributos, folhas com alça, o evento com um fio de cor no topo e ajustes para telas baixas.

A tela de hoje já tinha todos os elementos do mockup, sem identidade visual. O bloco V1 é a repaginada.

**O que mudou:**
- **Tema noite e ouro** (`estilo.css`, os dois modos):
  - o escuro em azul-noite (`#0b0f17`) com ouro (`#e8b84a`);
  - o claro em papel creme com ouro velho;
  - o ouro tem dois papéis: `--destaque` pinta fundos (botão, ponto) e `--destaque-forte` é o ouro de texto, com contraste AA na superfície;
  - o símbolo do jogo, o favicon, os ícones do PWA, a cor da barra do sistema e o cartão compartilhável seguiram a paleta.
- **O cabeçalho** (`Cabecalho.tsx`):
  - a barra da marca com as folhas à direita;
  - o retrato com as iniciais, o aro de ouro e a coroa (título de nobreza, trono, Regime ou patrimônio de R$ 1 bilhão);
  - o selo da economia (a fase, o país e o ano), que abre a folha País;
  - os indicadores em cartões com ícone, cor e barra;
  - o dinheiro, o patrimônio e a renda em três cartões. O cargo é o rótulo da renda, e a dívida aparece em vermelho no cartão do dinheiro.
- **O palco** (`Palco.tsx`): "Suas escolhas" em ouro, os verbos com ícone e cor (o ponto dourado marca o que é novo) e o botão dourado "Viver mais 1 ano", sempre no polegar.
- **O marco da trajetória** (`LinhaDoTempo.tsx`): os storylets com `marco: true` ganham um cartão dourado com a coroa na própria linha do tempo. Entre eles estão o primeiro dia de escola, o ENEM, o primeiro emprego, a formatura e a aposentadoria.
- **Ícones** (`Icones.tsx`): 22 ícones de traço em SVG, sem biblioteca nova.
- **Letra grande** (`letra.ts`):
  - o jogo mede a fonte do sistema com uma sonda de 100 px e altura de linha 1;
  - a partir de 1,2×, o html ganha `letra-grande`;
  - nesse modo os indicadores vão para uma linha só, sem o rótulo (o ícone e a cor dizem qual é), o dinheiro vira pílulas que quebram linha, os verbos perdem o ícone e mostram o nome inteiro, e o botão perde os ícones e a caixa alta.
- **Do pacote do dono:**
  - o fio de ouro no topo do cartão do evento;
  - as opções com borda fina, um leve afundar no toque e o desbotado das indisponíveis;
  - as folhas com alça e o fundo desfocado;
  - a palavra comprida que quebra em vez de empurrar a tela;
  - telas baixas (até 700 px) mais justas;
  - a moldura em tela larga.

**Decisões tomadas sozinho:**
- **A linha do tempo fica.** O mockup não mostra a história, mas ela é o produto. O teto era a linha do tempo ocupar pelo menos um terço da tela num celular comum.
  - A primeira versão deixava 298 px, de 419.
  - O cargo foi para o cartão da renda, o ano para o selo do país, os cartões ficaram mais justos e os verbos passaram a 48 px de altura. Assim ficaram 342 px.
- **A rosca do patrimônio não entrou no cabeçalho.** Ela custaria mais 60 px de história. Vai para a folha Dinheiro (I-98).
- **Iniciais no lugar da foto.** O jogo não tem imagens de pessoas, e um rosto sorteado seria um personagem que o conteúdo não conhece.
- **O pacote não substituiu o código.** O JS dele é o bundle compilado de um APK anterior às últimas atualizações. Trocar a pasta web apagaria o bloco A e as fatias recentes, e o próprio README do pacote avisa do risco de reassinar o APK. As ideias de CSS dele entraram no código-fonte, na paleta do mockup (ouro, não terracota).
- **O botão dourado sempre.** Antes, o "+1 ano" ficava cinza enquanto havia ação no ano, para puxar o jogador para os verbos. O mockup o põe sempre em ouro. A contagem "aos 30, 3 este ano" passa esse recado no título das escolhas. *Desfeita na correção C1 (20/10): no aparelho do dono a contagem saía cortada, e o botão dourado fazia passar o ano sem as escolhas.*
- **Detectar a letra grande em vez de adivinhar.** O app Android herda a fonte do celular, que aumenta o texto e não as caixas. Com a sonda, o arranjo estreito só aparece para quem precisa. *Desfeita na correção C1 (20/10): o limiar trocava o arranjo de uma vez, e na letra do dono (1,45) os dois arranjos cortavam texto.*

**Medidas** (navegador, a altura da linha do tempo; antes = a versão do bloco A):

| Tela | Antes | Depois |
|---|---|---|
| 390 × 844, 4 verbos | 419 px | 342 px |
| 390 × 844, 6 verbos | 352 px | 288 px |
| 360 × 760, letra 145%, 4 verbos | 229 px | 220 px |
| 360 × 760, letra 145%, 6 verbos | 152 px | 166 px |
| Rolagem para o lado / alvos de toque abaixo de 44 px / erros no console | 0 / 0 / 0 | 0 / 0 / 0 |

O motor e o conteúdo não mudaram, e o túnel deu as mesmas vidas. Os números de `docs/metricas.md` saíram iguais, menos a CPU, que varia de máquina.

**O pacote do dono, comparado com o código antes de integrar** (o pedido dele: comparar, integrar, testar e compilar):

| Arquivo do pacote | Comparado com | Resultado | O que entrou |
|---|---|---|---|
| `assets/index-h91VxHY7.js` | o build Android de 7a0bd85 (bloco A) | idêntico byte a byte | nada: é o código de antes do V1, compilado |
| `assets/index-RaeWEfWG.css`, primeira linha | o CSS compilado de 7a0bd85 | idêntico | nada |
| `assets/index-RaeWEfWG.css`, a camada acrescentada | `src/ui/estilo.css` atual | ver a lista abaixo | regra por regra |
| `index.html` | `index.html` da fonte | só as duas cores da barra do sistema (neutras, do tema terracota) | nada: as cores são as do tema noite e ouro |
| `favicon.svg`, `icon-*.png`, `apple-touch-icon.png` | `public/` de 7a0bd85 e de agora | iguais aos antigos (terracota) | nada: os novos são em ouro |
| `capacitor.config.json` | o da raiz | igual | nada |
| `cordova.js`, `cordova_plugins.js` | — | vazios, gerados pelo Capacitor no `cap sync` | nada |

Da camada de CSS, regra por regra:
- **Entrou (no código-fonte, na paleta do ouro):**
  - o fio de cor no topo do cartão do evento e o fundo em degradê;
  - as opções com borda fina, peso 650, o afundar no toque e o desbotado das indisponíveis;
  - o véu com desfoque, a folha com borda, sombra e alça;
  - o botão principal com o brilho da cor e o secundário com borda;
  - o ícone que afunda no toque, os botões sem seleção de texto e a palavra comprida que quebra;
  - telas baixas (até 700 px) mais justas e a moldura em tela larga;
  - o fundo no `html`, a seleção de texto na cor, a fonte herdada nos campos e as barras de rolagem finas;
  - o cartão da morte com borda e sombra, os cartões das folhas com sombra leve e raio de 15 px, os avisos com a borda da cor;
  - a rolagem sem animação para quem pede menos movimento.
- **Já estava resolvido de outro jeito no V1:** os atributos em cartões (viraram os cartões com ícone) e o dinheiro em pílulas (viraram os três cartões).
- **Não entrou:**
  - a paleta terracota (o mockup pediu noite e ouro);
  - a fonte Inter (o jogo não carrega fonte de fora, e ela só valeria onde já estivesse instalada);
  - o degradê no fundo da página e o espaçamento negativo das letras (mudam a largura do texto que o arranjo para letra grande mede);
  - a borda nas bolhas de idade (elas já têm cor por tipo de acontecimento);
  - o fundo dourado no verbo ao passar o mouse (o verbo tem a cor dele).

**Testado e compilado:**
- `npm run verificar`;
- as telas no navegador nos dois temas, com a letra normal e em 145%, sem rolagem lateral e sem alvo de toque abaixo de 44 px;
- `npm run build:android` aqui: o jogo montado e copiado para o projeto Android.

O APK assinado sai do workflow `App Android` a cada push na `main`. O passo do Gradle precisa do SDK do Android, que a rede desta sessão não deixa baixar. A chave de assinatura é a do repositório, então o APK novo instala por cima do antigo.

**O que ficou de fora:**
- **A rosca do patrimônio** (I-98).
- **Escolher o tema dentro do jogo** (I-99).
- **O ícone do app Android instalado** (I-100). Os ícones do navegador mudaram; os do APK são outros arquivos.

## Correção C1: a história de volta ao centro (20/10)

O dono jogou o V1 e respondeu com uma lista: perdeu qualidade, originalidade, diversão, hierarquia de interface e de cores, dimensionamento de tela e de botões, inteligência mecânica e de funcionamento, propósito, otimização, capacidade, carinho, cuidado e perfeição. "Faça o que é preciso para salvar o jogo."

**O erro foi de medida.** O V1 foi medido num celular comum (390 × 844) com a letra normal, e a 360 × 760 com a letra em 1,45. O aparelho do dono tem 360 × 780 e a letra do sistema por volta de 1,45. Nesse aparelho:
- a linha do tempo, que é a história, ficava com 20–28% da tela;
- durante um evento, ela ficava com 11 px;
- o dinheiro saía cortado com reticências.

Uma auditoria com sete lentes e um cético por lente separou o que se confirma do que não se confirma (29 achados rejeitados, entre eles trocar o ouro por terracota: o tema noite e ouro é pedido do dono). O plano de correção tem três blocos:
- C1, a interface (este);
- C2, o texto que contradiz a vida;
- C3, regras do motor que se medem errado.

**O que mudou:**
- **O cabeçalho virou uma faixa de texto.**
  - Saíram a barra da marca, o retrato de iniciais e os cartões; o nome do jogo fica na abertura, no ícone e no cartão.
  - O nome divide a linha com as quatro folhas.
  - Embaixo vêm o título, a idade e a cidade, e depois o selo da economia, que é um link de texto.
  - Os indicadores ficam em 2×2, com a barra fina.
  - O dinheiro fica numa linha que quebra, sem cortar número. Com um evento, o cabeçalho mostra só o nome e o dinheiro.
- **Um arranjo só.** Saíram o `letra.ts` e o modo de letra grande. O que precisa ceder cede por quebra de linha e por container queries em `em`: o ícone dos indicadores e dos verbos só aparece quando cabe.
- **O cartão do evento é uma coluna.** O texto rola por dentro, com uma sombra na borda quando há mais. As opções ficam sempre à vista, e a história guarda três linhas.
- **A rolagem mostra o começo do ano.** Depois do "+1 ano", a linha do tempo para no topo da primeira entrada nova, não no fim. O balanço do ano (o patrimônio, os aluguéis) virou uma linha pequena e neutra, sem pílula.
- **O botão do ano muda com o estado.**
  - Com escolhas sobrando, "Viver mais 1 ano · sobram 3" é o botão secundário.
  - Sem escolhas (o bebê), é o dourado.
  - O título das escolhas diz "Suas escolhas · 3 este ano".
- **O ouro só onde tem papel:** o botão do ano sem escolhas, o ponto de novidade, o foco, o fio do evento e o marco.
  - Saíram o `--brilho` e todas as sombras de brilho.
  - O verbo Trabalhar ficou verde-dinheiro.
  - A Felicidade passou do amarelo para o laranja.
- **A carência de 450 ms** vale também quando um evento fecha e quando a lista de um verbo abre ou fecha.
- **As folhas fecham onde o dedo está.** Cada folha tem o título e o Fechar fora da parte que rola, e a alça saiu (ela prometia um arrasto que não existe).
  - Abrir uma folha empilha uma entrada no histórico, e o voltar a fecha.
  - No APK, o `MainActivity` passa o voltar para a página.
  - O véu perdeu o desfoque.
- **As folhas tortas.**
  - A Família recuperou as regras dos medidores ("Saúde43" voltou a ser "Saúde 43").
  - A Carreira mostra o Poder primeiro para quem tem cargo, e junta numa linha as profissões e os cargos fechados pelo mesmo motivo ("49 profissões fechadas: você tem um cargo de poder · ver todas").
  - Os cargos fechados passaram a mostrar o motivo, que antes ficava escondido.
  - O menu se chama "Menu", e "Começar outra vida" é um botão secundário.
- **As barras animam com `transform`**, sem refazer o layout a cada ano.

**Decisões tomadas sozinho:**
- **O nome do país saiu do selo** ("Economia aquecida · 2056 ›"). Com a letra 1,45 ele quebrava a linha. O país está na folha que o selo abre e no rótulo de acessibilidade.
- **"Suas escolhas · 3 este ano"** no lugar de "3 para fazer aos 30": a idade já está no cabeçalho, e a frase longa quebrava em duas linhas na letra do dono.
- **O "sobram 3" some do botão quando não cabe numa linha** (por container query). O título das escolhas diz o mesmo.
- **Os motivos de idade, de influência e de ano de eleição agrupam juntos** ("13 profissões fechadas: só para outras idades"), porque cada profissão tem a sua faixa. A faixa de cada uma aparece em "ver todas", e não se repete quando o motivo já é a idade.

**Medidas** (navegador; antes = o V1 publicado, depois = a C1; o save do dono é o "real", um deputado de 30 anos com a vida cheia):

| Tela | Cabeçalho | Linha do tempo | Textos cortados | "R$" cortado |
|---|---|---|---|---|
| 360 × 780, letra 1,0 | 287 → 193 px | 224 → 334 px (29% → 43%) | 5 → 1 | 0 → 0 |
| 360 × 780, letra 1,15 | 305 → 203 px | 168 → 320 px (22% → 41%) | 11 → 1 | 3 → 0 |
| 360 × 780, letra 1,45 (a do dono) | 306 → 280 px | 186 → 234 px (24% → 30%) | 3 → 1 | 0 → 0 |
| 390 × 844, letra 1,0 | 287 → 196 px | 288 → 395 px (34% → 47%) | 1 → 1 | 0 → 0 |
| 320 × 640, letra 1,0 | 269 → 193 px | 128 → 198 px (20% → 31%) | 16 → 1 | 3 → 0 |
| Evento, 360 × 780, letra 1,0 | 287 → 95 px | 65 → 256 px | 5 → 1 | 2 → 0 |
| Evento, 360 × 780, letra 1,45 | 114 → 95 px | 11 → 107 px | 1 → 1 | 0 → 0 |

O único texto cortado que sobra é o sobrenome no nome.

| Conferência | Antes | Depois |
|---|---|---|
| Toque duplo numa opção de evento: o ano passou (40 eventos, 360 × 780, letra 1,15) | 12 | 0 |
| Toque duplo no verbo: agiu sem querer (6 verbos) | 5 | 0 |
| O Fechar das folhas, distância do topo (Carreira) | 6.096 px (o Voltar no fim) | 56 px |
| A folha Carreira, telas de rolagem (save do dono) | 8,4 | 2,0 |
| Voltar com a folha aberta | sai do jogo | fecha a folha |
| A primeira entrada nova do ano à vista depois do "+1 ano" (save do dono, letra 1,15) | começava 279 px acima, 0 px de texto | começa no topo, 255 px de texto |
| Cor viva na tela principal | 14% | 2% |
| Felicidade × ouro (matiz), escuro / claro | 3° / 0,5° | 18,5° / 19° |
| `var(--destaque` no CSS / `var(--brilho` | 47 / 5 | 23 / 0 |
| Varredura da letra de 1,00 a 1,50 em passos de 0,02: a linha do tempo cresce mais de 4 px entre dois passos | sim: 56 px no limiar da letra grande (189 px com evento) | nunca |
| Letra abaixo de 12 px (letra 1,0) | 5 | 0 |

O motor não mudou: o túnel dá as mesmas vidas.

### C0 e os ajustes da C1: a régua da tela (20/10)

`npm run telas` (`scripts/telas.cjs`) junta os scripts da auditoria numa régua só, com os critérios dos itens 1 a 9 do plano. Ela abre a build no ar num Chromium de celular, simula a letra do sistema multiplicando as letras do CSS, e sai com 1 se algum critério falha. O Playwright fica fora do `package.json` (pilha mínima): ela usa o que estiver instalado na máquina. Os seis saves da auditoria ficam em `test/telas/`.

**Medidas.** Contra a versão anterior à correção, 46 dos 52 critérios reprovam. Contra a C1 publicada, 3 reprovavam, e foram corrigidos:
- **Uma opção fora da tela** num evento de 4 opções longas, com a letra 1,45. A história guardava três linhas, e o cartão rolava. Agora, quando nem o texto no mínimo deixa as opções à vista, a história cede o que falta, só naquele evento (`Palco.tsx` mede e ajusta `--min-vida`).
- **O balanço do ano em 2 linhas** com a letra 1,15. Quando a faixa é estreita, fica só o patrimônio; os aluguéis estão no extrato da folha Dinheiro.
- **Patrimônio e Renda fora da vista** em 320 × 640 com a letra 1,45 e 1,5, porque o cabeçalho rolava.
  - O cargo agora sai do cabeçalho estreito (continua na folha Carreira).
  - Mesmo assim, o cabeçalho precisa de 283 px com 1,45 e de 313 px com 1,5, e cabem 268 (42% da altura). Essa tela, com essa letra, não comporta o cabeçalho inteiro e a história ao mesmo tempo. O cabeçalho rola por dentro, que é o recurso das três faixas; com 1,3, cabe inteiro.

**Decisões tomadas sozinho:**
- **O escopo do critério dos rótulos** voltou ao do plano: 320 × 640 só com letra 1,0 e 1,15. A régua o estendia à varredura de 320 até 1,5, que o plano usa só para os textos cortados.
- **A régua passou a exigir só os rótulos que existem.** Quem não tem renda não tem a linha da renda, e a régua cobrava "Renda" de um rapaz de 17 anos. Um rótulo que existe e foi escondido pelo arranjo continua reprovando.
- **Os padrões da régua** passaram a ser os saves de `test/telas/` e a porta do `vite preview`, para ela rodar em qualquer máquina.

Com a máquina ocupada por outro túnel, uma das vidas jogadas parou numa lista de ações por demora. Com uma página por vez (`--paralelo=1`), as oito passaram. O motor não mudou.

## Correção C2: o texto não contradiz a vida (25/10)

Seis itens do plano de correção, feitos por agentes em paralelo (um por item, cada um medindo antes e depois) e juntados por cima da C1. Cada item trouxe uma regra no validador, com teste, para o erro não voltar.

| Item | Medida | Antes | Depois |
|---|---|---|---|
| Mortos não falam | vidas com um morto falando (150 por estratégia: primeira, cautelosa, arriscada, aleatória) | 77% / 69% / 8% / 43% | 0 / 0 / 0 / 0 |
| Cada filho com o próprio nome | vidas com 2+ filhos com o nome de outro filho | 56 de 153 | 0 de 153 |
| | o ciúme do irmão com o primogênito de 10 anos ou mais | 71 de 176 | 0 de 101 |
| Português | vidas com "inteiroa", "tioa", "donoa"… (200 vidas) | 44 | 0 |
| | "fala de a/o …" | 176 vidas | 0 |
| Coerência | o amigo apresentado como estranho depois de já ter aparecido (200 vidas) | 134 | 0 |
| | "Agora é X (X…)" | 144 de 369 | 0 de 228 |
| Repetição | frases repetidas na mesma vida (40 vidas) | 29% | 18% |
| | vidas com o mesmo resultado 10 vezes ou mais (primeira / arriscada) | 84% / 99% | 0% / 2% |
| Cartão da vida | pontos de virada que são rotina (400 vidas) | 37,8% | 8,6% |
| | vidas com 8+ anos de mandato que citam o cargo | 1 de 290 | 283 de 290 |

**Decisões tomadas sozinho:**
- **Os conflitos da junção** ficaram com as duas intenções:
  - o dízimo lembra da mãe morta e ganhou o gênero;
  - o empréstimo ao amigo pede o amigo vivo e ganhou o "dele/dela";
  - o validador soma as regras de português, de coerência e de repetição;
  - a derrota na eleição conta a vez e aponta a causa.
- **Dois storylets raros sumiram** com o sorteio mudado: `filho_foi_embora` (0,1% das vidas na C1) e `o_bicho_herdeiro` (menos de 0,05%). Eles voltaram por duas mudanças:
  - o filho trabalhador também pode ir morar fora;
  - o robô aleatório pensa no testamento do bicho mais vezes quando há um bicho vivo.
- **A C3 ficou para depois.** As regras do motor (a régua do dinheiro, os falsos dilemas, os mandatos, a herdeira) não foram implementadas: o limite semanal de uso parou os agentes, e o dono pediu, em 25/10, o sistema de relacionamento para o mesmo dia.

O túnel joga vidas diferentes da C1: o amigo de infância gravado no balde da pracinha muda a infância. As metas passam, sem storylet morto e sem estratégia dominante.

## Bloco R: as pessoas da sua vida (25/10)

O dono pediu, no meio dos blocos, relacionamento de verdade: progressão, causa e consequência, pessoas únicas que parecem vivas, a morte que dói pela história, e o peso de cada decisão. Depois pediu mais: que as pessoas decidam sozinhas, tenham vontades, percebam o jeito de quem joga, lembrem do que ele fez e do que deixou de fazer, e ajam pelo que sabem dele (I-102 e I-103).

**O limite, dito ao dono:** não há consciência nem texto gerado. O jogo não tem servidor, e o motor tem de ser puro e determinístico. O que se simula é o comportamento de quem conhece você:
- a opinião, tirada do que a pessoa viu;
- a memória do que você fez e do que deixou de fazer;
- as vontades, a cobrança e a desistência;
- a reação, pelo que ela sabe.
O texto é escrito, com variações e trechos que mudam com o estado.

**O que mediu** (200 vidas, 50 por robô, na versão final):

| Robô | Falta (alguém doente sem visita) | Alguma vontade nasceu | Realizada por você | Perdida com a idade | Alguém morreu com a vontade | Remorso | Despedida | Com opinião aos 50 |
|---|---|---|---|---|---|---|---|---|
| cautelosa (cuida) | 18% | 88% | 88% | 0% | 6% | 8% | 100% | 100% |
| arriscada | 58% | 90% | 0% | 36% | 56% | 60% | 42% | 69% |
| aleatória | 76% | 98% | 60% | 26% | 54% | 72% | 80% | 91% |
| primeira (só o botão) | 68% | 80% | 0% | 60% | 52% | 74% | 38% | 62% |

Antes do bloco, nada disso existia: a relação era um número só (o vínculo) que voltava sozinho para o equilíbrio. Cuidar é decisão: o robô que cuida se despede em todas as vidas e tem remorso em 8%; o que só aperta o botão tem remorso em 74%.

**O túnel** (10.000 vidas; antes = a C2 publicada, depois = este bloco):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos | 0 | 0 |
| Estratégia dominante | nenhuma | nenhuma (a arriscada continua a mais feliz: 80,5 × 77,8 da cautelosa) |
| Saturação V5 / V20 | 57,3% / 90,3% | 55,4% / 90,1% |
| Assinaturas por 1.000 vidas (sem a origem) | 904 (583) | 910 (589) |
| Mobilidade: mesmo quintil / Spearman | 26,7% / 0,31 | 27,2% / 0,34 |
| Patrimônio p90/p10 | 777,8× | 595,9× |
| Desvio da felicidade média | 8,38 | 8,74 |
| Patrimônio negativo ao morrer | 0,6% | 0,8% |
| Mudanças causadas pelo jogador | 44,8% | 44,3% |
| Toques por vida | 450,5 | 446,4 |
| Cautelosa: idade de morte / patrimônio / felicidade | 91,9 / R$ 81 milhões / 75,1 | 86,2 / R$ 59 milhões / 77,8 |

Os portões que já falhavam continuam falhando:
- a CPU;
- a herança entre gerações, que melhorou (Spearman 0,85 → 0,83);
- o bilionário feito, que melhorou (1,87% → 1,27%, com teto de 1%);
- as assinaturas sem regressão (904 → 910, para ≥ 918).

Nenhum portão novo falha.

**O robô cauteloso troca a academia pela família.** Ele gasta 59% das fichas com a família (eram 36%), e a saúde cai de 25% para 16%. Por isso vive 5,7 anos a menos e junta menos. É o custo de oportunidade que as fichas pedem, e a meta de nenhuma estratégia dominante continua valendo. Na vida real, porém, a convivência protege a saúde; isso ficou registrado como ideia (I-104), para não mexer no equilíbrio sem medir.

**Decisões tomadas sozinho:**
- **A opinião sai do livro, não do estado.** São 14 opiniões, as duas mais fortes com o porquê. O que dói pesa 15% a mais, e o antigo pesa metade a cada 12 anos. A soma do livro fica guardada por entrada, fora do estado: o livro só cresce e a entrada lançada não muda. Assim não há save novo, a opinião é a mesma numa cópia salva e lida (há teste), e o custo não cresce com a vida.
- **Ninguém sabe o que não tem como saber:**
  - todo mundo sabe da formatura, da fama, da fortuna nova, do cargo e da condenação;
  - só quem convive, quem é próximo (vínculo 55+) e o par sabem do nome sujo e da aposta;
  - quem morreu não forma opinião nova. Numa vida jogada, a avó morta "sabia" do nome que sujou anos depois.
- **A falta conta só como falta.** A primeira versão fazia a mágoa da falta virar "cabeça-quente" e a vontade perdida virar "sumido". Agora a falta é sumiço, e a vontade perdida fica na lembrança e na mágoa. A falta vale mesmo que a doença tenha sarado no ano: a cura deste ano não apaga quem não apareceu.
- **Os limiares vieram do túnel.** Em 160 vidas, a mágoa máxima de uma vida ficou em p50 22, p90 31 e p99 46, então romper com 60 nunca acontecia. Os limiares novos:
  - a pessoa rompe a partir de 42, e o par faz as malas a partir de 45;
  - a fúria aparece a partir de 45 e a mágoa, a partir de 25;
  - "sem palavra" vale a partir de −7 de confiança.
- **Pedir dinheiro virou escolha com preço.** Quem joga quase nunca pedia dinheiro por conta própria: só aceitava quando ofereciam. Por isso "interesseiro" aparecia em 1 vida de 160. A ação "pedir um Pix a…" dá o dinheiro com custo no afeto e na confiança, e pedir sem dar nada em troca vira a opinião (27% das vidas dos robôs, que pedem muito).
- **O par não rompe: vai embora.** Um par "rompido" que continuava casado era incoerente. Com mágoa de 45 ou mais, ele faz as malas. Quem joga deixa ir ou pede uma última chance, um teste no vínculo.
- **As vontades são qualidades `quer_…`.** Elas são declaradas em `mundo.json`, com a condição que as realiza, a idade em que passam, a pressa e a frase da morte. O validador recusa uma `quer_…` sem declaração. As que a vida realiza (casar, ter o filho, o bicho, ver o neto) dão a entrada `regra:vontade_realizada`, que aponta de onde a vontade veio.
- **A CPU subiu, e fica registrado.** Em A/B na mesma máquina (três rodadas alternadas de 80 vidas), a versão publicada (C2) mede 64 ms por vida; esta, 92 ms (+44%). No túnel, a CPU foi de 69,8 para 83,9 ms (+20%). A primeira versão do bloco media 106 ms no A/B. O que sobrou é proporcional ao conteúdo: ações de família com cada pessoa e iniciativas novas, que os robôs avaliam a cada ficha. Três otimizações baixaram o resto:
  - as condições em campos calculados (o patrimônio, a opinião, a lembrança) rodam por último;
  - as expressões dos nomes são montadas uma vez;
  - a ação escolhida é conferida direto, sem montar a lista do verbo.

  A meta de 30 ms já falhava antes (69,8 ms na C2); esta decisão fica registrada. O próximo corte é guardar, dentro do ano, o que cada pessoa pode fazer (o robô monta a lista de todos os verbos a cada ficha).
- **Os três agentes de conteúdo não chegaram a escrever nada** (o limite de uso parou todos no começo). O conteúdo novo foi escrito direto: 14 storylets de relação e 34 de quem sabe quem você é.

## Correção C3: regras que se medem direito (25/10)

O plano de correção de 20/10 tinha um quarto bloco, a C3: quatro regras do motor, de custo pequeno, que mediam ou funcionavam errado. Ela ficou para depois duas vezes. Primeiro, o limite de uso parou os agentes; depois, o dono pediu o bloco R. Parte do item 17 já estava escrita numa worktree do workflow, sem commit. Ela foi trazida para cima da `main` de agora e terminada.

| Item | Medida | Antes | Depois |
|---|---|---|---|
| 17. A régua do túnel | último voto da cautelosa e da arriscada (120 vidas cada) | 100% num bloco | de 20% a 27% e de 15% a 35% em cada |
| | denominador do "arriscar nunca compensa" | 641 storylets com escolha | 286 que a conta olha |
| 18. Falsos dilemas | opções melhores em tudo, nos três bolsos | 7 | 0 |
| 19. O Executivo | cautelosas com mais de dois mandatos seguidos no mesmo cargo (120 vidas) | 42,5% | 0% |
| | bicos e entregas em ano de mandato (120 vidas arriscadas) | 1.427 | 0 |
| 20. A herdeira | vidas de família muito rica com pai ou mãe "demitido" (400 vidas até os 40) | 81% (59 de 73) | 8% (6 de 73) |
| | demissões de quem vive de patrimônio (120 vidas por estratégia) | de 26 a 36 | 0 |

**O túnel** (10.000 vidas; antes = o bloco R publicado, depois = a C3):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma (a arriscada continua a mais feliz: 80,8 × 77,7 da cautelosa) |
| Falsos dilemas | 7, num bolso só | 0, nos três bolsos |
| Arriscar nunca compensa | 134 "de 641" | 129 de 286 no típico, 130 no pobre, 143 no rico |
| Saturação V5 / V20 | 55,4% / 90,1% | 56,0% / 89,9% |
| Assinaturas por 1.000 vidas (sem a origem) | 910 (589) | 903 (583) |
| Mobilidade: mesmo quintil / Spearman | 27,2% / 0,34 | 26,7% / 0,34 |
| Patrimônio p90/p10 | 595,9× | 621,3× |
| Desvio da felicidade média | 8,74 | 8,73 |
| Patrimônio negativo ao morrer | 0,8% | 0,6% |
| Mudanças causadas pelo jogador | 44,3% | 44,2% |
| Toques por vida | 446,4 | 448,5 |
| CPU por vida (túnel) | 83,9 ms | 88,9 ms; no A/B na mesma máquina, 92,4 → 88,4 ms: a C3 não custa nada a mais |

Os portões que já falhavam continuam falhando: a CPU, a herança entre gerações (Spearman 0,83 → 0,84), o bilionário feito (1,27% → 1,46%, com teto de 1%) e as assinaturas sem regressão (910 → 903, para ≥ 918). Nenhum portão novo falha. O primeiro `verificar` falhou com um storylet morto (a mensalidade da escola); o conserto está nas decisões abaixo.

**Decisões tomadas sozinho:**
- **A medida dos mandatos conta mandatos, não anos.** O ano da eleição entra nos dois mandatos, então dois mandatos seguidos dão 9 anos no cargo. A meta do plano, "mais de 8 anos seguidos", contaria quem cumpriu só os dois mandatos permitidos.
- **O bico pede "sem cargo agora", não "sem a marca de político".** A qualidade `politico` fica para sempre depois do primeiro mandato, porque o fim do mandato só soma `ex_politico`. A condição `"cargo": false` também cobre o rei e o regime.
- **Quem vive de patrimônio:**
  - são 18 ocupações das classes e dois papéis de linhagem: o dono de fazenda e o ex-jogador da seleção, que apareceram como demitidos na medida;
  - o diretor de multinacional continua demissível;
  - o sorteio do desemprego no nascimento acontece do mesmo jeito, para as outras vidas não mudarem por causa disso;
  - na crise, a perda é de 20% do patrimônio e da renda, com chance de 12% × (o desemprego da fase − 1) × o ciclo do setor. Para quem está em finanças, isso dá uns 19% ao ano na crise. Para comparar: a falência do negócio da família tem 8% e leva 60%.
- **Os falsos dilemas sem qualidade nova.** O plano falava em "o Pix sem seguro: teste e agenda" e "o clube de ciências: um custo e uma qualidade que o ENEM lê". Ficaram o teste e o custo (as tardes de futebol), sem qualidade nova: cada qualidade nova pede dois leitores, e a troca já desfaz a dominância.
- **O cliente preso.** O plano não o listava. Com a régua dos três bolsos, ele virou falso dilema no típico e no rico: perder o registro pesa mais com renda alta. A troca que sobrou é emocional: escapar dá alívio (+6 de felicidade) e o maior contrato do ano. Colaborar continua mais seguro e mais barato.
- **A mensalidade da escola na crise ganhou tensão 2.** Era o storylet mais raro (menos de 0,05% das vidas) e sumiu nas 10.000 vidas, porque passou a disputar a vez com as iniciativas novas do filho.
- **O fechamento do plano é do dono:** jogar 3 vidas da build e reportar algo inédito na terceira.

## Bloco B: o Tesouro (25/10)

O segundo bloco da ordem do dono: "o título comprado do Tesouro entra no balanço como ativo financeiro e paga cupom no caixa de quem comprou" (I-34), e o orçamento do governo em reais (I-31). Entrou o título de quem joga, com o calote; ficaram o título da empresa e o orçamento item por item, com os motivos abaixo.

**O que o título faz** (`tesouro.ts`, `docs/motor.md › O Tesouro`):
- é um contrato com o governo (`tit<entrada>`): o valor, a taxa travada na compra, o vencimento e a entrada que comprou;
- a taxa é (juro real do ano + 0,05 × anos + risco da dívida) × 0,85;
- o cupom cai na conta todo ano, o valor volta no vencimento e vender antes sai pelo preço do dia;
- o calote vem com a dívida acima de 100% do PIB numa recessão ou numa crise.

**Medidas:**

| Medida | Valor |
|---|---|
| Quem compra título pela folha (10.000 vidas) | cautelosa 99,6% (7 compras por vida), aleatória 87,2% (2,5), primeira e arriscada 0% |
| Quem ganha título numa história ("Investir no Tesouro Direto") | de 18,7% (arriscada) a 57,8% (cautelosa) |
| Cupons na vida, mediana de quem teve título | de R$ 5,7 mil (arriscada) a R$ 2,2 milhões (cautelosa) |
| Títulos que venceram / vendidos antes (com lucro) | 22.451 / 1.877 (993) |
| Vidas com calote | 0,9% (93 vidas); quem perdeu algo fora dos títulos e da renda fixa: 0 |
| Livro por vida (150 vidas do A/B) | 384,3 → 395,3 entradas, 4.716 → 4.810 mudanças |

**O túnel** (10.000 vidas; antes = a C3 publicada, depois = o bloco B):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| Falsos dilemas | 0, nos três bolsos | 0, nos três bolsos |
| Saturação V5 / V20 | 56,0% / 89,9% | 55,9% / 90,2% |
| Assinaturas por 1.000 vidas (sem a origem) | 903 (583) | 910 (585) |
| Mobilidade: mesmo quintil / Spearman | 26,7% / 0,34 | 27,2% / 0,34 |
| Patrimônio p90/p10 | 621,3× | 618,2× |
| Patrimônio mediano da cautelosa | R$ 63 milhões | R$ 62 milhões |
| Desvio da felicidade média | 8,73 | 8,78 |
| Patrimônio negativo ao morrer | 0,6% | 0,7% |
| Mudanças causadas pelo jogador | 44,2% | 44,2% |
| Toques por vida | 448,5 | 456,2 |
| CPU por vida (túnel) | 88,9 ms | 81,5 ms; no A/B na mesma máquina, 85,6 → 89,6 ms (+4,7%) |

Os portões que já falhavam continuam falhando: a CPU, a herança entre gerações (Spearman 0,84 → 0,84), o bilionário feito (1,46% → 1,34%, com teto de 1%) e as assinaturas sem regressão (903 → 910, para ≥ 918). Os três portões novos (emprestar é escolha, o calote é raro, quem perde é quem tinha a dívida) passam. O segundo `verificar` falhou com um storylet morto (a acusação de nepotismo); o conserto está abaixo.

**Decisões tomadas sozinho:**
- **O título da empresa ficou para depois.** A empresa é um valor que cresce, sem caixa: o cupom não teria onde cair, e tirar o título do valor dela mudaria a curva de crescimento e os portões de bilionário. Vem com a I-11 (o caixa da empresa).
- **O orçamento item por item ficou para depois.** A dívida do país anda por uma reação fiscal em pontos do PIB; um orçamento em reais que feche (receita, gasto e juros) muda essa conta e os portões do país vivo. Entrou a dívida em reais (PIB × dívida), que fecha por construção, com quem joga entre os credores.
- **A taxa é a do papel IPCA+, já sem o imposto.** O jogo inteiro é em reais de hoje; a taxa acima da inflação é a que cabe. O imposto de renda do cupom (15%) entra na taxa, para o botão mostrar o que cai na conta.
- **O prêmio do prazo é pequeno (0,05 ponto por ano).** Com ele, o título longo rende de 0,4 a 1 ponto a mais que a renda fixa, em troca de travar o dinheiro e do risco do preço. A cautelosa não ficou mais rica por isso: o cupom e o valor que voltam ficam parados na conta até a próxima aplicação.
- **Os títulos entram no patrimônio que paga o padrão de vida.** Sem isso, emprestar ao governo escondia a fortuna do gasto do padrão e virava a resposta certa.
- **O calote leva 30% do título e 15% da renda fixa.** A renda fixa também é dívida do governo (o Tesouro Selic, o CDB lastreado), mas mais curta e diversificada. A chance (1% por ponto acima de 100% do PIB, até 25%) dá 0,9% das vidas com calote.
- **A causa do calote é a decisão que pôs a dívida para cima**, pesada pelo efeito na arrecadação e no gasto: a posse de um governo, a reforma que corta imposto ou abre gasto, o decreto que aquece. O nascimento (o país como estava) não conta.
- **O mundo tem tamanho:** até 5 títulos ao mesmo tempo, de R$ 100 para cima, e nunca mais de 30% da dívida do país nas mãos de quem joga.
- **O título herdado na infância:** o cupom cai na conta de quem herdou, e vender espera os 18.
- **O Tesouro Direto das histórias virou título de verdade.** Duas escolhas diziam "Investir no Tesouro Direto" e punham o dinheiro no perfil, que pode ser metade em ações. Agora elas compram um título (o efeito `comprarTitulo`; sem como comprar, o dinheiro vai para a renda fixa). A ação "investir com método", que investe pelo perfil, deixou de falar em Tesouro.
- **A CPU subiu 4,7% no A/B** (85,6 → 89,6 ms por vida). O livro cresce 2,9% (as compras, os cupons e os vencimentos), e as vidas da amostra duraram 1,2 ano a mais. Juntar a leitura dos bens e dos títulos numa passada só não mudou a medida, então ficou o código mais simples.
- **A acusação de nepotismo ganhou o peso 3 dos vizinhos da mesma cadeia.** Ela aparecia em 0,1% das vidas e zerou no túnel quando o título das histórias mudou a trajetória de muita gente. Com o peso, quem ganhou a marca vê a conta chegar; continua rara, porque pede a marca e a fama.
- **O fechamento do bloco é do dono:** jogar 3 vidas da build e reportar algo inédito na terceira.

## Bloco C: a coroa recebe (26/10)

O terceiro bloco da ordem do dono: "por que o soberano não recebe salário, parte dos impostos ou taxa da coroa" (19/10). Ele jogou uma soberana bilionária numa ilha, e a coroa não pagava nada. Entrou a forma da coroa (I-41) e o começo do Estado novo (I-43): a ilha com população, PIB e imposto. Ficaram a legitimidade à parte (I-42), o ditador e o efeito no orçamento, com os motivos abaixo.

**O que a coroa faz** (`coroa.ts`, `docs/motor.md › A coroa`):
- quem tem coroa (o monarca do Brasil e quem é soberano da ilha) escolhe na folha Carreira e poder, uma vez por ano: o salário da Casa Real, a parte dos impostos ou a taxa da coroa;
- a forma fica com o país (`pais.coroa`, `ilha.coroa`), e a dotação é a renda de quem reina, paga pelo tesouro ou pela ilha;
- a parte dos impostos tira 5 pontos do alvo da aprovação, a taxa 15; abaixo de 30, o plebiscito ou a greve geral;
- a ilha nasce da jogada "fundar um país" e anda todo ano; quem herda leva a ilha, a coroa e a forma.

**Medidas:**

| Medida | Valor |
|---|---|
| Vidas com coroa (todas as do túnel, com as de origem escolhida e as dinastias) | 111, e 38 com ilha |
| Anos de coroa: salário / parte dos impostos / taxa | 1.136 / 792 / 371 |
| Dotação por ano, média | R$ 3,8 milhões / R$ 1,8 bilhão / R$ 22 bilhões |
| Quedas do cargo por 100 anos de coroa | 0,6 / 1,0 / 2,2 |
| População da ilha no fim (fundada com 2.300) | p10 2.042, mediana 2.544, p90 3.180; mediana de 2.791 sem a taxa (22 ilhas) e 1.413 com 5 anos ou mais de taxa (6) |
| Dotação para quem não reina | 0 vidas |
| Trocas de forma por reinado (160 vidas da linhagem real) | cautelosa 2 (até 4), arriscada 2, aleatória 3 (até 9) |

**O túnel** (10.000 vidas; antes = o bloco B publicado, depois = o bloco C):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| Falsos dilemas | 0, nos três bolsos | 0, nos três bolsos |
| Saturação V5 / V20 | 55,9% / 90,2% | 55,7% / 90,1% |
| Assinaturas por 1.000 vidas (sem a origem) | 910 (585) | 909 (581) |
| Mobilidade: mesmo quintil / Spearman | 27,2% / 0,34 | 27,0% / 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,3% / 3,3% | 13,2% / 2,8% |
| Patrimônio p90/p10 | 618,2× | 645,1× |
| Patrimônio mediano da cautelosa | R$ 62 milhões | R$ 62 milhões |
| Desvio da felicidade média | 8,78 | 8,72 |
| Patrimônio negativo ao morrer | 0,7% | 0,6% |
| Mudanças causadas pelo jogador | 44,2% | 44,2% |
| Toques por vida | 456,2 | 455,7 |
| CPU por vida (túnel) | 81,5 ms | 105,9 ms; no A/B na mesma máquina, 108,1 → 113,6 ms (+5,1%) |

Os portões que já falhavam continuam falhando: a CPU, a herança entre gerações (Spearman 0,84 → 0,85), o bilionário feito (1,34% → 1,40%, com teto de 1%) e as assinaturas sem regressão (910 → 909, para ≥ 918). Os três portões novos (a taxa tem preço, a ilha vive, toda dotação tem coroa) passam.

Um portão que passava falhou: do quintil mais rico ao mais pobre, 3,3% → 2,8%, para ≥ 3,0%. Noutra semente (20261026), a base dá 3,4% e o bloco C 3,1%. A diferença, de 0,3 a 0,5 ponto, cabe no ruído de uma rodada (uns 0,5 ponto), e o que mudou para quem não tem coroa é pouco: as propostas de emprego de quem tem cargo e o peso do negócio da família que quebra. Se a queda se repetir no próximo bloco, ela vira uma investigação própria.

O primeiro `verificar` falhou com um storylet morto, o negócio da família que quebra na crise; o conserto está abaixo.

**Decisões tomadas sozinho:**
- **Os números das três formas.** O salário é fixo e pequeno perto de uma fortuna real (R$ 4 milhões por ano no Brasil, R$ 500 mil na ilha). A parte dos impostos do Brasil é 0,01% da arrecadação, a escala da dotação de uma casa real europeia: uns R$ 400 milhões por ano em 2026, que sobem com o PIB. A taxa é 0,1% do PIB, uns R$ 12 bilhões por ano: muito dinheiro, com o preço mais alto. Na ilha, que é pequena, as fatias são maiores (10% da arrecadação e 8% do PIB), e a taxa espanta gente.
- **A primeira parte dos impostos era o dobro.** Com 0,02% da arrecadação, ela dava R$ 2,2 bilhões por ano numa vida de 2066: 550 vezes o salário, por um terço do preço da taxa. Com 0,01%, dá R$ 1,1 bilhão nessa vida.
- **A forma é do país, não da pessoa.** Ela fica em `pais.coroa` e `ilha.coroa`, como uma lei: quem herda a coroa herda a regra, e o conteúdo pode mudá-la (a rua que derruba a taxa).
- **A dotação é recalculada todo ano** e acertada na hora em que a forma muda (pela folha, por uma escolha do conteúdo ou na herança). Na primeira versão, o túnel media de R$ 31 a 83 milhões por ano de salário, que é de R$ 4 milhões, por três vazamentos:
  - uma escolha que voltava ao salário deixava a renda da taxa por mais um ano;
  - quem descia do trono da ilha levava a renda junto;
  - as propostas de emprego trocavam a dotação por um salário.
- **O preço está no alvo da aprovação, não num tombo só.** A cada ano, a aprovação anda uma parte do caminho até o alvo (35% no Brasil, 20% na ilha); com a taxa, o alvo fica 15 pontos mais baixo enquanto ela durar. O anúncio pesa na hora (−6 na taxa, −2 na parte dos impostos, +3 ao voltar ao salário).
- **A reação ao decreto vem agendada, com o decreto de causa:** a rua contra a taxa e o barco de mudança, de 1 a 3 anos depois; a conta da parte dos impostos, de 2 a 4. O porquê fica à vista na linha do tempo.
- **A ilha é uma entidade nova** (`ilha`, tipo `jurisdicao`), lida pelo validador como as outras: nome, população, PIB, PIB por pessoa e a forma da coroa. Os números da fundação (2.300 habitantes, R$ 80 mil por pessoa, imposto de 20%) são os de um país pequeno e rico. A ilha anda devagar (a renda por pessoa 2,5% e a população 1% por ano, mais com o reconhecimento), para a taxa ser a decisão que mais pesa nela.
- **O ditador ficou de fora.** O Regime não é coroa: quem manda nele continua com o salário que já tinha.
- **O efeito da dotação no orçamento do Brasil ficou para depois.** A taxa, a maior forma, é 0,1% do PIB: abaixo do ruído da reação fiscal da dívida. A dotação sai da conta do tesouro, e as contas fecham entrada por entrada.
- **As propostas de emprego não chegam a quem tem cargo** (`"cargo": false`): a concorrente, o recrutador e o trabalho remoto em dólar. Valia para o bico e a entrega desde a C3; agora vale também para elas.
- **Quem desce do trono da ilha fica sem a renda da coroa:** a greve na ilha zera a renda nas duas saídas do trono, como a queda do cargo faz com quem perde o mandato.
- **Os robôs.** A arriscada cobra a taxa e não recua: na primeira versão, ela voltava ao salário com a popularidade abaixo de 35, e o túnel não via o preço da taxa. A cautelosa passa à parte dos impostos com popularidade 60 ou mais e só volta ao salário abaixo de 40; com 55 e 45, ela trocava de forma 4 vezes por reinado (até 10), e agora troca 2 (até 4). A aleatória troca de forma em 30% dos anos.
- **O negócio da família que quebra na crise ganhou peso 4.** Ele pede a marca de quem assumiu o negócio (3,2% das vidas) e um ano de crise (2,3% dos anos), e aparecia em 0,0% das vidas. Zerou no primeiro túnel do bloco C e, noutra semente, zera também na base: estava à beira de morrer. Com o peso, continua raro.
- **As histórias de quem reina ganharam peso.** Em 160 vidas da linhagem real (1.736 anos de rei), a assinatura da reforma apareceu 2 vezes, as mordomias 2 e o jubileu 3; no túnel do bloco B, 0,1% e 0,0% das vidas, à beira de morrer. Com peso 4 (e 6 na vida depois da coroa), elas aparecem 17, 19 e 9 vezes, e a vida depois da coroa 8. Cortar as mordomias não mexe mais na renda: ela é a dotação, e o corte sumia no ano seguinte.
- **A CPU subiu 5,1% no A/B:** 20 rodadas alternadas de cada versão, de 150 a 300 vidas, deram 108,1 → 113,6 ms por vida (±3,5%). O livro tem o mesmo tamanho (395 → 396 entradas por vida), e a etapa da coroa custa 0,11 ms por vida (0,1% do ano). O perfil não aponta uma função nova entre as que mais custam: a diferença se espalha pelas de sempre, como a elegibilidade dos storylets e os atores possíveis. Nesta máquina, uma rodada variou de 100 a 127 ms.
- **O fechamento do bloco é do dono:** jogar 3 vidas da build e reportar algo inédito na terceira.

## Bloco D: o Estado pesquisa (26/10)

O quarto bloco da ordem do dono: "usar o Tesouro do Estado para pagar pesquisa e desenvolvimento" (19/10). Entrou a política de ciência, o estoque de tecnologia do país e o que ele vira: as descobertas (a cura, o satélite, a patente) e a fuga de cérebros, com a decisão de causa. Ficaram o orçamento item por item (bloco B2), a pesquisa das empresas (I-11), os cientistas como pessoas (I-36) e a corrida com os países de fora, com os motivos abaixo.

**O que a pesquisa faz** (`pesquisa.ts`, `docs/motor.md › O Estado pesquisa`):
- a política "Ciência e tecnologia" (cortada, regular, prioridade) põe de 0,3% a 0,9% do PIB em pesquisa, e o gasto entra no primário;
- a tecnologia do país (`pais.tecnologia`) anda 6% por ano para onde a ciência e a escola levam e volta como crescimento potencial, saúde pública, tração das empresas e a vaga de quem é cientista;
- acima de 55, as descobertas; com a ciência cortada e a tecnologia abaixo de 42, a fuga de cérebros; cada uma aponta a decisão que fez o estoque e chega à vida de quem joga.

**Medidas** (10.000 vidas):

| Medida | Valor |
|---|---|
| Anos com a ciência cortada / regular / prioridade (vidas sorteadas) | 171.202 / 342.129 / 192.428 |
| A tecnologia por ano em cada nível | −0,70 / −0,04 / +0,75 |
| A tecnologia ao morrer (quem nasce começa perto de 50) | p10 42,3, mediana 49,9, p90 58,5 |
| Descobertas por 100 vidas | a cura 16,5, o satélite 18,0, a patente 16,8; 28,7% das vidas veem uma |
| Descobertas com a decisão de causa | 90,7% de 5.119 |
| Vidas com fuga de cérebros | 25,8% |
| Vidas com calote | 1,1% → 1,9% (107 → 187) |

**O túnel** (10.000 vidas; antes = o bloco C publicado, depois = o bloco D):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| Falsos dilemas | 0, nos três bolsos | 0, nos três bolsos |
| Saturação V5 / V20 | 55,7% / 90,1% | 55,7% / 89,7% |
| Assinaturas por 1.000 vidas (sem a origem) | 909 (581) | 906 (589) |
| Mobilidade: mesmo quintil / Spearman | 27,0% / 0,33 | 27,0% / 0,34 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 13,2% / 2,8% | 14,4% / 3,1% |
| Patrimônio p90/p10 | 645,1× | 684,9× |
| Patrimônio mediano da cautelosa | R$ 62 milhões | R$ 63 milhões |
| Desvio da felicidade média | 8,72 | 8,75 |
| Patrimônio negativo ao morrer | 0,6% | 0,7% |
| Mudanças causadas pelo jogador | 44,2% | 44,3% |
| Toques por vida | 455,7 | 457,1 |
| O porquê à vista (acontecimentos com a causa de um ano anterior) | 34,2% | 35,8% |
| CPU por vida (túnel) | 105,9 ms | 87,9 ms; no A/B na mesma máquina, 97,1 → 96,5 ms (−0,7%) |

Os portões que já falhavam continuam falhando: a CPU, a herança entre gerações (Spearman 0,85 → 0,83), o bilionário feito (1,40% → 1,20%, com teto de 1%) e as assinaturas sem regressão (909 → 906, para ≥ 918). O do quintil mais rico ao mais pobre, que tinha falhado no bloco C (2,8%), voltou a passar (3,1%, para ≥ 3,0%), como a outra semente do bloco C sugeria. Os três portões novos (a ciência paga vira tecnologia, o país termina diferente, a descoberta tem porquê) passam.

O primeiro `verificar` falhou com um storylet morto, o grupo na capa; o conserto está abaixo.

**Decisões tomadas sozinho:**
- **A pesquisa é a sétima política, não um orçamento novo.** A saúde e a escola já são políticas de três níveis com o gasto em pontos do PIB, e a folha País já mostra o efeito antes da reforma. A pesquisa entrou do mesmo jeito; o orçamento item por item continua no bloco B2.
- **Os números da ciência.** O regular põe 0,5% do PIB em pesquisa, perto do que o Brasil gasta de dinheiro público hoje; a prioridade soma 0,4 ponto, e a ciência cortada tira 0,2. A primeira versão somava 0,6 e tirava 0,3: com ela, a dívida de equilíbrio da frente popular subia 12 pontos do PIB, e o calote quase triplicava na amostra de 2.000 vidas (de 1,1% para 3,0%).
- **O preço da ciência é a dívida.** Mesmo com 0,4 ponto, o calote subiu de 1,1% para 1,9% das vidas: a frente popular, que já gastava mais do que arrecadava, passou a pagar a ciência, e a dívida de equilíbrio dela sobe 8 pontos do PIB. O portão do calote (de 0,2% a 5%) continua passando, e a notícia do calote aponta a reforma da ciência quando foi ela que pôs a dívida para cima.
- **Cada bloco tem o seu nível**, para o voto decidir a pesquisa: a frente popular pesquisa como prioridade, o bloco liberal corta, a aliança da ordem e o centrão ficam no regular. O Regime pesquisa como prioridade ("ordem e progresso", o satélite estratégico). Na média dos quatro blocos eleitos, a ciência fica no regular.
- **A tecnologia anda devagar** (6% do caminho por ano, uma década para chegar perto). Os governos se alternam a cada oito anos, em média, e o estoque guarda o que cada um fez. O efeito é pequeno de propósito: com 65 de tecnologia, o crescimento potencial ganha 0,3 ponto por ano, menos que o imposto baixo (0,5) e mais que a escola boa de uma geração.
- **A escola forma quem pesquisa:** 0,4 ponto de tecnologia por ponto de escola acima de 50. Assim, a educação, que já mexia no crescimento e no desemprego, também mexe na ciência, e um governo que prioriza as duas colhe mais.
- **A descoberta é uma notícia do mundo, não um storylet.** Ela acontece no país, como a virada da fase e a sanção, e chega à vida de quem joga no ano seguinte, por um storylet agendado (a vacina no posto, o satélite na TV, a empresa da patente) com a descoberta de causa.
- **A causa da descoberta é a decisão que fez o estoque, mesmo desfeita depois.** A tecnologia de hoje vem da ciência de dez anos atrás, então a reforma que pôs a ciência como prioridade continua sendo a causa depois que outro governo a cortou. Na amostra de 2.000 vidas, só 60% das descobertas tinham causa: quem nasceu com a ciência como prioridade e viu o mesmo bloco reeleito não tinha nenhuma mudança no livro. A posse de quem manteve a ciência passou a contar, como a reeleição conta na sanção, e a parte com causa foi para 91% no túnel de 10.000 vidas.
- **Ler uma política é consultar quem a decidiu.** O storylet que pede `pais.pol_pesquisa` (a greve da federal, o laboratório que apaga a luz) ganha de causa a posse ou a reforma que a pôs ali. A regra vale para todas as políticas: os storylets que já pediam uma (a saúde, a escola, o programa social, o imposto, a segurança, a tarifa) passam a mostrar a decisão também.
- **As histórias de quem pesquisa mudaram de público.** A primeira versão falava de quem é cientista, mas nenhuma das 600 vidas de uma amostra virou cientista: as histórias morreriam no túnel. Agora são de quem está na faculdade (a bolsa de iniciação, que dá a marca de quem pesquisou e abre o caminho para a carreira, ou a greve da federal) e de quem já pesquisou (o edital ou o laboratório que apaga a luz).
- **A vaga de cientista anda com a verba** (`carreiras › verba`): metade com a ciência cortada e 1,6 vez com a prioridade, na entrada e na promoção. O campo vale para qualquer carreira que uma política pague, mas só a de cientista usa por enquanto: ligar a do médico à saúde e a do professor à escola mudaria vidas demais neste bloco.
- **A fuga de cérebros** acontece em 26% das vidas: o bloco liberal corta a ciência e governa um quarto dos anos. Ela tira 3 pontos de tecnologia, com o corte de causa, e no máximo uma vez a cada 10 anos.
- **As jogadas somam ao estoque.** A cura paga por quem é bilionário soma 3 pontos à tecnologia do país, o foguete em órbita soma 2, e liberar a fórmula da cura soma 2 à saúde pública. Brincar de deus passa a mexer no país do jeito que a ciência pública mexe.
- **O grupo na capa pede duas empresas, não três.** Ele aparecia em 0,0% das vidas e zerou no túnel do bloco D.
- **A CPU não mudou no A/B:** 10 rodadas alternadas de cada versão, de 150 vidas, deram 97,1 → 96,5 ms por vida (−0,7%, ±2,9%). A etapa da pesquisa custa 0,22 ms por vida (0,2% do ano) e grava 0,4 KB no livro.
- **O fechamento do bloco é do dono:** jogar 3 vidas da build e reportar algo inédito na terceira.

## Bloco E: defesa (26/10)

O quinto e último bloco da ordem do dono: "sistemas de armamento e guerra" (19/10). Entraram a política de defesa, a capacidade das Forças Armadas, os sistemas de armamento e a guerra como processo: o começo, os anos de guerra e o fim. Ficaram a ocupação e o território, a mobilização da economia, a logística, as alianças militares (I-51), a guerra entre os países de fora e a reconstrução, com os motivos abaixo.

**O que a defesa faz** (`guerra.ts`, `docs/motor.md › A defesa e a guerra`):
- a política "Defesa" (desmobilizada, regular, reforçada) gasta de −0,3 a +0,5 ponto do PIB, mexe na relação com os países de fora (+2 a −3) e dá um pouco de voto (−1 a +1);
- a capacidade (`pais.defesa`) anda 8% por ano para onde a política e a tecnologia levam, e os sistemas encomendados somam quando chegam;
- com um país que sanciona e anda frio, a guerra pode começar, mais fácil com o quartel fraco; cada ano dela custa ao país, e ela acaba em vitória, derrota ou cessar-fogo, com a decisão de causa em cada notícia.

**Medidas** (10.000 vidas):

| Medida | Valor |
|---|---|
| Anos com a defesa desmobilizada / regular / reforçada (vidas sorteadas) | 180.612 / 344.583 / 181.106 |
| A capacidade por ano em cada nível | −0,84 / −0,01 / +0,86 |
| A capacidade ao morrer (quem nasce começa perto de 50) | p10 43,2, mediana 49,7, p90 57,7 |
| Guerras por 100 vidas | 3,0, em 2,9% das vidas; 88,9% de 298 apontam a decisão que esfriou a relação |
| Como acabaram | vitória 59, derrota 92, cessar-fogo 135 (12 corriam quando a vida acabou); 3,6 anos em média, 8 no máximo |
| O crescimento nos anos de guerra / nos de paz | −2,18% (1.051 anos) / 2,10% |
| A guerra começa nos anos de ameaça | 3,5% com o quartel abaixo de 60 (4.708 anos), 2,9% acima (4.554) |
| Sanções (vidas com sanção) | 3.406 → 5.165 (25,3% → 34,4%) |
| Vidas com calote | 1,9% → 1,1% (187 → 111) |
| Encomendas por 100 vidas | 2,1 (188 entregas); convocações, 55; 0,3% das vidas voltaram com a marca de quem serviu |

**O túnel** (10.000 vidas; antes = o bloco D publicado, depois = o bloco E):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| Falsos dilemas | 0, nos três bolsos | 0, nos três bolsos |
| Saturação V5 / V20 | 55,7% / 89,7% | 55,1% / 90,2% |
| Assinaturas por 1.000 vidas (sem a origem) | 906 (589) | 912 (595) |
| Mobilidade: mesmo quintil / Spearman | 27,0% / 0,34 | 27,1% / 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,4% / 3,1% | 14,4% / 2,6% |
| Patrimônio p90/p10 | 684,9× | 624,1× |
| Patrimônio mediano da cautelosa | R$ 63 milhões | R$ 63 milhões |
| Desvio da felicidade média | 8,75 | 8,72 |
| Patrimônio negativo ao morrer | 0,7% | 0,7% |
| Mudanças causadas pelo jogador | 44,3% | 44,3% |
| Toques por vida | 457,1 | 457,6 |
| O porquê à vista (acontecimentos com a causa de um ano anterior) | 35,8% | 36,5% |
| CPU por vida (túnel) | 87,9 ms | 113,6 ms; no A/B na mesma máquina, 111,1 → 112,2 ms (+1,0%) |

Os portões que já falhavam continuam falhando: a CPU, a herança entre gerações (Spearman 0,83 → 0,82) e as assinaturas sem regressão (906 → 912, para ≥ 918). Dois pioraram: o bilionário feito (1,20% → 1,56%, com teto de 1%) e o do quintil mais rico ao mais pobre, que volta a falhar (3,1% → 2,6%, para ≥ 3,0%). Com outra semente (20261026), as duas versões dão o mesmo sentido: 1,11% → 1,34% e 3,5% → 2,8%, e o calote 2,0% → 1,2%. A explicação está nas decisões abaixo. Os cinco portões novos passam nas duas sementes.

**Decisões tomadas sozinho:**
- **A defesa é a oitava política, e a guerra é um processo, não um ato.** A política entrou como a ciência e a saúde: três níveis, o gasto em pontos do PIB e o efeito à vista antes da reforma. A guerra não tem botão: ela nasce da relação, e quem governa decide o que leva até ela (romper, desarmar) e o que a encurta (armar-se, pedir a paz).
- **Os números da defesa.** A reforçada soma 0,5 ponto do PIB ao gasto, e a dívida de equilíbrio de quem reforça sobe 10 pontos; a desmobilizada tira 0,3, e a de quem desmobiliza cai 6. Armar-se esfria a relação com todos os países em 3 pontos (desmobilizar esquenta 2), e a farda vale 1 ponto de aprovação.
- **Cada bloco tem o seu nível**, para o voto decidir a defesa: a aliança da ordem e o Regime reforçam ("polícia na rua" e "ordem"), a frente popular desmobiliza, o bloco liberal e o centrão ficam no regular. A cautelosa no poder fica no regular; a arriscada reforça.
- **A capacidade anda devagar** (8% do caminho por ano, mais 0,3 ponto por ponto de tecnologia acima de 50): o quartel equipado leva uma década, e o equipamento que chega envelhece de volta para o alvo. O armamento moderno vem da pesquisa, e a ciência do bloco D passa a armar o país.
- **Os sistemas de armamento: um por ano, a conta na hora, a entrega com a encomenda de causa.** A encomenda vai para a dívida no ano em que é feita, como um decreto; a entrega é uma notícia do mundo que aponta a encomenda. O que ainda não chegou sai do livro, sem estado novo. O satélite militar pede tecnologia 55: a pesquisa abre o armamento.
- **A encomenda a caminho passa a quem herda.** O livro da vida nova não tem a encomenda, então o que quem governava pagou e ainda não chegou entra na capacidade do país herdado, como os títulos entram na herança. Sem isso, o submarino pago sumia com a morte de quem o encomendou.
- **A guerra começa com a relação abaixo de 25, não de 15.** Com 15, nenhuma guerra começou em 1.200 vidas: um país que sanciona e anda tão frio aparece em 0,1% dos anos. Com 25 ("frio", perto de hostil), a guerra aparece em 2,9% das vidas, dentro do portão (de 0,5% a 8%).
- **Um ano de guerra tira 1,2 ponto do crescimento, não 2,5.** A persistência do ciclo acumula a perda: com 2,5, os anos de guerra ficavam 6,8 pontos abaixo dos de paz (no túnel de 2.000 vidas), e uma guerra de quatro anos levava um quinto do PIB. Com 1,2, a diferença fica em 4,3 pontos. A inflação ganha 2, o governo gasta 2 pontos do PIB a mais, a população cresce 0,1 ponto a menos e a aprovação anda 3 pontos para baixo.
- **Toda guerra acaba.** A partir do segundo ano, 25% de chance por ano (50% no ano seguinte a um pedido de paz) e, no oitavo, o cessar-fogo de cansaço: sem o teto, uma guerra em treze passaria de dez anos. Depois de uma guerra, dez anos sem outra, para o país não viver uma em série.
- **O desfecho sai da capacidade contra a força de lá.** 60% das guerras acabam decididas, vitória ou derrota na razão entre a capacidade daqui e a força do outro (a Federação 90, a Celeste 85, a Liga 70, o Pacto 45); o resto é cessar-fogo, e a sanção continua. A derrota soma 4 pontos do PIB de reparação à dívida. Contra a Celeste, quase todas as guerras do túnel, a derrota sai mais que a vitória (92 × 59): o Brasil tem capacidade perto de 50, e ela tem 85.
- **Na guerra, a sanção do inimigo não acaba, e com ele só cabe pedir a paz.** A sanção cansava (15% ao ano) no meio da guerra, e quem governava podia fazer visita de Estado ao inimigo.
- **A dissuasão é fraca nas vidas do túnel, e isso é do desenho.** Quem esfria a relação (a aliança da ordem, o Regime) é quem reforça o quartel, então a capacidade dos anos de ameaça fica perto de 60 (com o limite em 50, só 4 anos de ameaça em 2.000 vidas tinham o quartel fraco, e o portão passou a dividir em 60). A dissuasão pesa para quem governa: desarmar e romper é a combinação perigosa (com a capacidade em 20, a chance é 20% ao ano; em 50, 5%).
- **O preço do quartel reforçado aparece lá fora.** As sanções foram de 3.406 para 5.165 nas 10.000 vidas, e a Celeste sanciona 1,9% dos anos da aliança da ordem (era 1,2%). Ficou: "armar-se preocupa os vizinhos" é o desenho, e o portão das sanções (de 5% a 40% das vidas) passa com 34%.
- **O calote voltou a 1,1%, e o rico ficou mais rico.** A frente popular, que já gastava mais do que arrecadava e passou a pagar a ciência no bloco D, desmobiliza e gasta 0,3 ponto a menos: a dívida dela passa menos de 100% do PIB, e o calote voltou perto do que era antes da ciência. O calote é o que mais derruba quem tem título e renda fixa, e com ele raro o bilionário feito subiu e a queda do quintil mais rico ficou menor. Os dois portões oscilam de incremento em incremento: o do bilionário falha há vários (entre 1,2% e 1,9%), e o do rico que fica pobre já passou e falhou perto dos 3%. A outra semente dá o mesmo sentido. Nenhum dos dois trava o CI, e mexer neles pede uma decisão sobre o teto da riqueza, fora deste bloco.
- **Ninguém morre num storylet de guerra.** O tom pedido na I-61 (abstrata e sem glorificação): a guerra mata pela estatística do país (a população) e aparece na vida pela convocação, pelo racionamento, pela fábrica de munição, pelo simulado de abrigo e por quem voltou.
- **A convocação vale para todo mundo de 18 a 30 anos sem cargo.** O texto é o mesmo para qualquer gênero; o presidente, o deputado e o rei não são convocados.
- **As histórias da guerra têm peso alto (10).** Elas só cabem nos anos de guerra (3% das vidas), e com peso 6 o racionamento apareceu 2 vezes em 31 guerras. Com 10, a guerra se sente na vida de quem a atravessa; nenhuma morreu no túnel.
- **Nos robôs, quase ninguém pede a paz** (0 pedidos nas 10.000 vidas): os robôs raramente governam durante uma guerra. O pedido é testado à parte: em 300 guerras, a que pediu a paz no primeiro ano acaba no segundo bem mais vezes do que a que não pediu.
- **A CPU não mudou no A/B:** 10 rodadas alternadas de cada versão, de 150 vidas, deram 111,1 → 112,2 ms por vida (+1,0%, ±1,6%). A etapa da guerra custa 0,68 ms por vida no túnel (0,6% do ano) e quase nada no livro; a ameaça só lê o livro quando há quem ameace. A CPU do túnel muda de rodada para rodada na mesma máquina (o mesmo código mediu 101,8 e 113,6 ms por vida), por isso a comparação é o A/B.
- **O fechamento do bloco é do dono:** jogar 3 vidas da build e reportar algo inédito na terceira.

## Bloco F: o poder que passa (26/10)

O primeiro bloco da segunda ordem do dono (26/10, `docs/ideias.md › A segunda ordem do dono`): "não estou herdando o regime, a monarquia ou a soberania", "não consigo dar um golpe de Estado", "não consigo governar quando sou monarca, ditador ou soberano", "quando fundo o país, continuo governando o Brasil". A ordem começa pelos defeitos: o que existia e não funcionava. Entraram a sucessão (em vida e na herança, com a regência), o poder que se toma (o autogolpe, o golpe e a coroa restaurada), a saída do governo de quem vai reinar na ilha, os defeitos D-01, D-03 e D-04 e o resgate do país como título. Ficou para o bloco F2 governar a ilha e a cidade fundadas (o imposto e as obras do próprio bolso).

**O que mudou** (`sucessao.ts`, `docs/motor.md › A sucessão e o poder que se toma`):
- quem herda a coroa, o Regime ou a ilha entra na fila, e o motor agenda a resposta para o primeiro ano ou para os 18; o mesmo quando o pai ou a mãe que reinava morre em vida;
- enquanto a resposta não vem, quem governava continua; quem joga só governa com o cargo que governa;
- as jogadas do poder na folha Carreira e poder: ficar no poder, tomar o poder, restaurar a monarquia.

**Medidas** (as 10.000 vidas, as de origem escolhida e as gerações das dinastias, com 80 dinastias novas que nascem na família real ou no Regime):

| Medida | Valor |
|---|---|
| Sucessões que chegaram a quem tinha 18 anos ou mais | 404 em vida e 112 na herança, 100% com resposta |
| Herdeiros que começaram na fila e reinaram | 78,6% de 117 |
| Anos governados por quem joga / pelo Regime dos outros (vidas sorteadas) | 6.742 → 12.587 / 8.830 → 5.938 |
| Tomar o poder (liderar os quartéis ou financiar os generais) | 39 tentativas, 66,7% deram certo |
| Fechar o Congresso / mudar a Constituição | 30 (70,0%) / 1 (100%) |
| Restaurar a monarquia | 40 tentativas, 30,0% deram certo |
| Sanções nas vidas sorteadas | 5.165 → 5.260; nos anos de quem joga governando, 0,62% → 2,04% dos anos com sanção nova (e os acordos, 7,40% → 3,84%) |
| Vidas com calote | 1,1% → 1,4% |

**O túnel** (10.000 vidas; antes = o bloco E publicado, depois = o bloco F):

| Métrica | Antes | Depois |
|---|---|---|
| Storylets mortos / estratégia dominante | 0 / nenhuma | 0 / nenhuma |
| Falsos dilemas | 0, nos três bolsos | 0, nos três bolsos |
| Saturação V5 / V20 | 55,1% / 90,2% | 55,1% / 90,1% |
| Assinaturas por 1.000 vidas (sem a origem) | 912 (595) | 915 (592) |
| Mobilidade: mesmo quintil / Spearman | 27,1% / 0,33 | 27,3% / 0,33 |
| Do quintil mais pobre ao mais rico / do mais rico ao mais pobre | 14,4% / 2,6% | 16,7% / 2,8% |
| Patrimônio p90/p10 | 624,1× | 595,0× |
| Patrimônio mediano da cautelosa | R$ 63 milhões | R$ 57 milhões |
| Desvio da felicidade média | 8,72 | 8,68 |
| Patrimônio negativo ao morrer | 0,7% | 0,7% |
| Mudanças causadas pelo jogador | 44,3% | 44,6% |
| Toques por vida | 457,6 | 457,9 |
| O porquê à vista (acontecimentos com a causa de um ano anterior) | 36,5% | 36,6% |
| CPU por vida (túnel) | 113,6 ms | 100,1 ms; no A/B na mesma máquina, 99,9 → 97,2 ms (−2,7%, ±1,5%) |

Os portões que já falhavam continuam falhando, alguns um pouco melhores: a CPU, a herança entre gerações (Spearman 0,82 → 0,83), as assinaturas sem regressão (912 → 915, para ≥ 918), o bilionário feito (1,56% → 1,41%, com teto de 1%) e o do quintil mais rico ao mais pobre (2,6% → 2,8%, para ≥ 3,0%). Os dois portões novos passam.

**Decisões tomadas sozinho:**
- **A sucessão é do motor, não do sorteio.** Ela era um storylet comum, sorteado pelo ritmo da idade: em vidas de linhagem real, dos 19 herdeiros de quem reinou com a cautelosa, nenhum virou rei em 40 anos. Agora a morte de quem reina (ou a abertura da vida nova) agenda a resposta, e o storylet só acontece agendado (`AGENDADOS_PELO_MOTOR`). No túnel, todas as 516 sucessões que chegaram a um adulto tiveram resposta.
- **Quem herda é quem continua a história, seja quem for.** O storylet pedia o pai ou a mãe morto como ator: o par, o amigo e o sobrinho nunca se qualificavam (D-01). O testamento é a lei da sucessão da dinastia: quem herda a fortuna herda a coroa.
- **A regência vai até os 18.** Antes, a resposta fica marcada para o ano dos 18: a coroa espera com um governo de transição, e o Regime, com a junta (o Regime dos outros). O texto diz quem morreu ou que a regência acabou.
- **Sem interregno.** Enquanto a resposta está marcada, quem governava continua governando, inclusive sob o Regime (antes, o Regime tomava o governo do herdeiro no primeiro ano, antes de ele responder). Quem abdica devolve o governo, e o governo de transição entra no ano seguinte.
- **A ilha passa sozinha, e quem assume começa com a imagem em pelo menos 55.** A popularidade de quem nascia (e de quem herdava) começava em zero, porque o campo não existia e a soma partia do nada, e a greve geral da ilha tirava a coroa do herdeiro em poucos anos. Quem nasce e quem herda começam em 50, e o save antigo também. A coroa aceita somava 60 pontos de imagem (com a base em 50, chegava a 100): agora soma 10; o Regime assumido somava 45, agora tira 5.
- **Quem governa precisa do cargo que governa.** As decisões pelo país (as políticas, o ato lá fora, a defesa) pediam só o governo de quem joga; quem ia reinar na ilha que fundou continuava decidindo pelo Brasil até a próxima posse. Agora quem deixou o cargo não decide mais, e o governo de transição aponta a entrada que mudou o cargo (antes, sem marca de saída, o texto dizia "com a morte de quem governava").
- **Sob o Regime, não há eleição geral** (D-03); a municipal continua. **Quem tem cargo vive dele** (D-04): o setor e a demissão não o alcançam, a carreira para no cargo e, com a coroa ou o Regime, fica para trás, numa entrada com a posse de causa. A mobilidade de quem nasce pobre subiu (14,4% → 16,7% chegam ao quintil mais rico): quem chega a um cargo não perde mais o salário numa demissão.
- **Os três caminhos do poder, cada um com o seu teste.** O autogolpe testa a popularidade (dificuldade 60): quem fecha o Congresso precisa do povo; a emenda testa a influência (70) e dá mais quatro anos, não o mandato vitalício; o golpe de fora pede influência 60 e testa a influência (65 nos quartéis, que só seguem coronel ou general; 75 com o dinheiro, R$ 20 bilhões); a coroa restaurada pede R$ 10 bilhões e fama 50 e testa a popularidade (70). Dá errado: o impeachment, ou a cadeia (`condenado`). Dá certo: o cargo vitalício, o Regime ou a monarquia, e a marca `golpista`, que fecha as outras jogadas do poder.
- **O mundo reage ao golpe pela relação.** Sob o Regime, quem joga governa com a postura do Regime lá fora (a Celeste se aproxima, a Federação, rival dela, esfria 15 pontos), e a sanção que vier aponta o golpe (ou o fim do Regime) como causa. Por isso a sanção nova nos anos de quem joga governando foi de 0,62% para 2,04%: os herdeiros do Regime agora governam eles mesmos.
- **A eleição de verdade do Regime vira a Presidência.** Ela tirava o Regime e deixava o cargo de chefe do Regime, vitalício, num país que vota. Agora quem ganha é presidente, com quatro anos de mandato e a marca de quem redemocratizou.
- **O resgate do país é um título do Tesouro.** "Salvar o país da crise" tirava R$ 200 bilhões e devolvia, anos depois, um reembolso sorteado (`o_pais_te_paga`, que saiu). Agora a jogada compra R$ 200 bilhões em títulos de 10 anos (`comprarTitulo` com `valor`, que resgata o que faltar na conta): o dinheiro fica no patrimônio, paga cupom e pode levar calote. O empréstimo aos bancos continua como era até o bloco I (o dinheiro que rende).
- **Os robôs e o poder.** A cautelosa recusa (a última opção, por convenção a que devolve o poder), a arriscada tenta a primeira que cabe em 35% do que tem e a aleatória sorteia; quem é presidente só pensa nisso no fim do mandato. Sem cargo de presidente, influência 60 ou fama 50, o robô nem abre a seção e não gasta sorteio. Quase todas as tentativas vêm das vidas que nascem com fortuna ou numa linhagem.
- **Dinastias que nascem na família real e no Regime** (80) entram no túnel para medir a herança da coroa; contam para storylet morto, não para as métricas das dinastias, porque a origem é escolhida.
- **A linha da sucessão na folha só aparece na regência.** Na régua da tela, a folha Carreira e poder do save real (um príncipe deputado) estava a 23 px do limite de duas telas, e a linha "Sucessão" custava 61 px. Para quem é adulto, a resposta vem no mesmo ano da morte de quem reina, então a linha só informa algo quando a sucessão está marcada para os 18.
- **A CPU não mudou no A/B:** 10 rodadas alternadas de cada versão, de 150 vidas, deram 99,9 → 97,2 ms por vida (−2,7%, ±1,5%). Quem tem cargo pula a etapa do trabalho e a da carreira.
- **Governar a ilha e a cidade fica para o bloco F2**, para o bloco ficar pequeno e os defeitos chegarem antes ao dono.
- **O fechamento do bloco é do dono:** jogar 3 vidas da build e reportar algo inédito na terceira.

## Próximos passos (núcleo)

- Ver `docs/roteiro.md`: a fase 2 substitui os próximos passos da fase 1.
