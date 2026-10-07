# O motor

Código em `src/motor/`. Puro: não toca em DOM nem em disco; recebe o conteúdo já lido e um estado, e muda o estado. A interface clona o estado antes de cada passo; o túnel de vento muta direto (é mais rápido).

## Estado (`EstadoVida`, em `tipos.ts`)

- **Entidades** (`entidades`): `eu`, `mae`, `pai`, `avo`, `amigo`, `lugar` e `pais` nascem com a vida; `amor`, `filho`, `paixao`, `pet` e `empresa` são criados por efeitos (ou, a empresa, pela folha Dinheiro). Cada entidade tem `id`, `tipo` (pessoa, animal, lugar, jurisdição, empresa), nome, gênero, nascimento, vivo/morte e três mapas:
  - `n`: campos numéricos (saúde, felicidade, inteligência, aparência, vínculo, dinheiro, as cinco classes investidas, dívida, renda, custo, classe e irmãos de origem; na empresa, valor, lucro, tração, participação e retirada…);
  - `t`: campos de texto (ocupação, setor, curso, traço, tipo de família, perfil de investidor, padrão de vida, UF, região);
  - `q`: **qualidades** (as marcas, generalizadas): `nome → { v, ano, idade, causa }`. `causa` é o id da entrada do livro que a gravou.
- **Caminhos** (`campos.ts`): `"mae.saude"`, `"lugar.desemprego"`, `"ator.vinculo"`; sem ponto, é de quem joga (`"fumante"`). O registro de campos diz o tipo, o sistema (corpo, humor, mente, dinheiro, relações, carreira, caráter, origem, mundo, história), os limites e se é derivado (`idade`, `vivo`, `patrimonio`, `investido`, `classe`, `nome`, `genero`, `quem`, `empresa.funcionarios`). O `patrimonio` de quem joga soma a parte na empresa (`campos.ts › patrimonioTotal`). O que não é campo é qualidade (vale 0 quando não existe).
- **Livro-razão** (`historico`): cada entrada tem tipo (nascimento, evento, ação, personagem, mundo, linha, regra, morte), **causa** (nascimento, escolha, ação, diretor, personagem, regra), o storylet (`ref`), o papel (`ator`), a instância (`storylet#papel`), textos, resumo, as entradas que a tornaram possível (`causas`) e as **mudanças** que ela fez (`{ c: caminho, d: variação | q: ganhou/perdeu | t: texto, r: regra }`). As regras miúdas do ano (economia, idade, vínculos) ficam numa entrada invisível do tipo `regra`.
- **agenda**, **vistos** (idades em que cada instância aconteceu), **pendente** (storylet com escolha esperando o jogador) e **rng** (mulberry32, um inteiro; vai no save).

Só as funções de `livro.ts` mudam números e qualidades, e cada uma anota a mudança na entrada que está sendo escrita. Há teste: nascimento + soma das variações do livro = estado final de quem joga.

## Nascer (`nascer`, `origem.ts`)

A origem é procedural: **8 classes** (extrema pobreza a trilionária; as duas últimas só por escolha ou por um sorteio raríssimo) × **4 tipos de família** (acolhedora, conflituosa, religiosa, empreendedora) × traços. A classe decide patrimônio e renda da casa (sorteados na faixa da classe), chance de desemprego, ocupações dos pais, saúde, idade da mãe e quantos irmãos. O tipo de família decide o vínculo de partida e para onde ele volta, os traços mais prováveis dos pais e, na empreendedora, o negócio da família. Pai ausente é mais comum na conflituosa. A avó pode morar junto; o amigo de infância nasce com a vida. A cidade (55, de todas as regiões) define região, desemprego e custo de vida. Cada ocupação dos pais pertence a um setor (12, de comércio a cultura). O país nasce numa fase do ciclo sorteada pelo peso de cada uma. Quem joga ganha um traço (esperto, bonito, forte, ansioso, otimista, tímido, carismático, teimoso) que ajusta os atributos e a felicidade de base. Escolher classe e tipo de família é opcional.

## Um ano (`avancarAno`)

1. Idade e ano +1.
2. **Ciclo da economia** (`ciclo.ts`): o país está em normal, expansão, recessão ou crise, numa cadeia de Markov com as chances em `mundo.json › fases` (do normal: 6% para expansão e 5% para recessão; da recessão: 28% de volta ao normal e 15% para a crise; da crise: 35% para recessão e 15% direto ao normal). Fora do normal, a fase é uma qualidade do país (`pais.recessao`) cuja causa é a entrada visível que a anunciou (tipo `mundo`). A fase soma à inflação, ao rendimento dos investimentos e da poupança da família, ao desemprego e aos salários do ano.
3. **Mercado e economia** (`carteira.ts`, `economia.ts`): o mercado do ano sorteia quanto cada classe de investimento rendeu acima da inflação (renda fixa, ações, fundos imobiliários, dólar e cripto, com média e desvio por fase em `mundo.json › ativos`) e grava em `pais.ret_*`; inflação sorteada (média 4,5% mais o que a fase soma); dinheiro parado encolhe; dívida cresce 22% ao ano, só até o limite de crédito (2 rendas anuais, mínimo R$ 30 mil). Adultos recebem a sobra do ano (renda − custo), e o **padrão de vida** escolhido decide quanto dela vira gasto (simples 35%, confortável 75%, luxo 95%; no máximo 40% para quem deve) e quanto do patrimônio acima de R$ 500 mil se gasta por ano (0%, 2%, 4%). O que o custo passa da renda é o **déficit** do ano: sai da reserva e do crédito, e além do crédito vira privação. Depois dos 65, a velhice consome 4% do patrimônio até R$ 2 milhões e 1% do que passa disso.
4. **Empresa** (`empresa.ts`), se quem joga tem uma: o valor anda pela **tração** (o ritmo em que ela vem crescendo, em % ao ano), pela fase do país vezes o quanto o setor sente o ciclo e por sorte (desvio de 30% numa pequena, 20% numa de R$ 500 milhões, vezes o risco do setor). A retirada escolhida (0%, 3% ou 8% do valor por ano) cai na conta, na proporção da parte de quem joga. A tração volta 15% por ano para a do setor, mais o talento (inteligência), menos 3 pontos por década de valor acima de R$ 10 milhões; tocar a empresa (a ficha do ano) soma 1,5 ponto. Abaixo de R$ 5 mil, a quebra é agendada (`empresa_quebrou`), com a fundação como causa.
5. **Envelhecimento:** saúde deriva com a idade; a felicidade volta 12% ao ano para a **felicidade de base** (60 + traço + padrão de vida (−3, 0, +3) + vínculo médio com quem está perto, com teto); inteligência e aparência derivam; qualidades com `porAno` somam efeitos passivos; dívida pesada pesa; patrimônio confortável dá um pouco de paz.
6. **Regras dos personagens** (`familia.ts`), cada um com o próprio estado:
   - envelhecem; adoecem (chance pela idade × traço), saram ou pioram; morrem (Gompertz pela saúde), com luto proporcional ao vínculo, herança (dividida entre os irmãos) e viuvez quando era o amor de um casamento ou de uma união de 5+ anos;
   - mãe e pai perdem e ganham emprego (pelo desemprego do lugar × a fase do país, conforme o setor sente o ciclo, e pelo traço; servidor não perde) e se aposentam aos 65; guardam dinheiro enquanto trabalham, ele rende com a fase, e gastam depois; na recessão e na crise, o negócio da família pode quebrar (some 60% do que foi guardado), com a fase do país como causa;
   - o vínculo volta devagar para o jeito da família e esfria sem contato na vida adulta; o casal se desgasta sem cuidado; filho adulto se afasta.
   Mudanças notáveis (adoeceu, sarou, perdeu o emprego, voltou a trabalhar, aposentou, faliu, morreu) viram entradas visíveis com causa `regra`.
7. **Trabalho de quem joga** (`trabalho.ts`), dos 18 aos 64, com renda: o salário anda com o crescimento do setor e com a fase (vezes quanto o setor sente o ciclo; serviço público e setores estáveis só crescem); negócio próprio balança o dobro, com sorte e azar. Empregado pode ser demitido (2,5% ao ano × desemprego do lugar × fase × setor): a regra agenda o storylet `demissao` com a fase do país como causa. Negócio próprio, nos anos ruins, pode entrar no aperto (`negocio_no_aperto`).
8. **Padrão de vida:** quem tem `padrao_alto` e fechou o ano no déficit, com reserva para menos de 5 anos desse déficit, recebe a conta (`padrao_aperta`, agendado, com a escolha que subiu o padrão como causa).
9. **Morte natural** de quem joga: risco de Gompertz (`0,00003·e^(0,09·idade)`) × `e^((60−saúde)/15)`; saúde zero mata; ninguém passa de 120.
10. **Regra do amor:** quem está sem namoro pode conhecer alguém (chance pela idade × paquera × aparência × traço); a regra agenda o storylet `namoro`, com a última paquera como causa.
11. **Iniciativas dos personagens:** cada personagem pode agir. A chance vem do storylet mais tenso que ele pode fazer, multiplicada pela afinidade do traço (o generoso ajuda mais, o brigão briga mais); tensão 3 age sempre. O storylet sai por saliência. Sem escolha, acontece já (causa `npc`); com escolha, vira candidato do diretor.
12. **Diretor** (`diretor.ts`), um storylet com escolha por ano, nesta prioridade:
   1. agendados vencidos (o primeiro que ainda cabe; os outros esperam um ano);
   2. **marcos** (`marco: true`) elegíveis: a espinha da vida não depende de sorteio;
   3. personagem em crise (tensão ≥ 2);
   4. sorteio com chance de `ritmo(idade)` (30% na primeira infância, 85% dos 13 aos 29, 78% dos 30 aos 49, 68% dos 50 aos 64, 52% depois) entre eventos e iniciativas, por **saliência** = peso × especificidade (1 + 0,25 por cláusula + 0,25 se tem ator) × novidade (memória entre vidas e vezes nesta vida) × tensão × 2 se a causa consultada surgiu há até 2 anos.
13. Sem nada visível no ano, uma **linha curta** de `linhas.json` (por idade e condições, sem repetir as 15 últimas).

Elegível = idade na faixa, ator possível (vivo, salvo storylets sobre quem morreu), condições atendidas e, se não for repetível, nunca visto nesta vida (repetível: respeita o intervalo).

## As fichas do ano (`acoes.ts`)

Criança faz uma coisa por ano; adolescente, duas; adulto, três; depois dos 65, duas (`regras.ts › fichasDoAno`). Seis verbos (estudar, trabalhar extra, cuidar da saúde, ver a família, sair, poupar); tocar num verbo abre **todas as ações possíveis dele agora**, da que mais combina com o estado (mais cláusulas, mais peso, menos repetida) para a que menos combina, e o jogador escolhe. Com uma ação só, o toque já age. A mesma ação não se repete no mesmo ano. Quando as fichas acabam, o ano passa.

## Folhas sem ficha (`carteira.ts`, `empresa.ts`, `bens.ts`, `carreira.ts`, `poder.ts`, `herdeiro.ts`)

Decisões do jogador que não gastam ficha (entrada de tipo `dinheiro`, causa `acao`, com o grupo no `ref`):

- **Dinheiro:** aplicar e resgatar, perfil de investidor, padrão de vida.
- **Empresa:** abrir, aportar, retirada, vender e comprar uma concorrente por ano (30% do valor da empresa; o preço justo não cria valor, a tração sobe 2 pontos; três compras fazem um truste, +5 de tração e investigação do órgão de concorrência).
- **Bens** (`mundo.json › bens`, entidades `bem<id>`): comprar à vista ou financiar imóvel (20% de entrada, parcela fixa de 8% do preço ao ano, juros de 7%), morar (tira até 30% do custo de vida), alugar e vender (6% de custo no imóvel). Todo ano: o imóvel acompanha o mercado de imóveis acima do que um aluguel normal rende, carro perde valor, manutenção e parcela saem, aluguel entra. Conforto vira felicidade de base (com teto); status vira influência.
- **Carreira** (`mundo.json › carreiras`): tentar uma vaga por ano, com requisitos (as condições dos storylets) e chance pelo talento e pela fase do país; cargos com salário entre o primeiro e o último; a chance de subir cai a cada degrau (×0,8, e ×0,45 nas profissões de palco); fama nas profissões de palco; atleta e modelo têm idade para parar. Um storylet que muda o emprego encerra a carreira.
- **Poder** (`mundo.json › cargos`): influência anda 25% por ano para um alvo de patrimônio, bens, fama, cargo, empresa grande e linhagem; eleição municipal nos anos múltiplos de 4 e geral dois anos depois, com campanha paga e chance pela influência, aparência e, na reeleição, popularidade; o mandato acaba sozinho (o último ano é ano de eleição). Quem governa tem popularidade (anda com a fase); abaixo de 30, o cargo balança (`queda_do_cargo`). Coroa e Regime são cargos vitalícios dados pelo conteúdo. Decretos são storylets que escrevem `pais.impulso`, que muda as chances do ciclo.
- **Testamento:** para quem vai tudo (a lei: filho, senão sobrinho; ou o par, o melhor amigo, os sobrinhos, uma causa, o bicho).

## Dinastia (`herdeiro.ts`)

Quando a vida acaba, a história continua com quem herda: pelo testamento, o par (que herda tudo, sem metade separada, e começa viúvo, com o filho do casal) ou o melhor amigo (com o próprio sobrenome e a própria família); pela lei, o filho ou a filha viva, ou um sobrinho (gerado de uma semente da própria vida, sem gastar o sorteio). Testamento para uma causa ou para o bicho encerra a história. A partilha paga as dívidas com o espólio, separa a metade de quem era casado (quando o par não é o herdeiro), 4% de imposto e o quarto do testamento solidário; a empresa e os bens passam ao herdeiro, e só o que a conta não cobre sai da parte na empresa e, depois, dos bens mais baratos. A coroa e o Regime passam ao filho: a sucessão é o primeiro capítulo. A primeira entrada conta a herança e é a causa do estado inicial.

## Linhagens (`origem.ts`)

No começo em um toque, 20% das vidas nascem numa linhagem (`mundo.json › linhagens`): família real (neste mundo, o plebiscito de 1993 deu monarquia), família do Regime, família famosa, do futebol, de políticos, do agro, de circo, imigrante, militar. A linhagem fixa a classe, dá qualidades a quem nasce e ao pai ou à mãe que a carrega, ao país (monarquia, regime), influência e fama iniciais e um texto de nascimento próprio. Quem escolhe a origem escolhe a linhagem (ou nenhuma).

## Escolha (`escolher`)

1. Aplica os `efeitos` da escolha.
2. Se houver `teste`, sorteia sucesso ou fracasso: `chance` fixa, ou `0,5 + (valor − dificuldade) / 50` (o valor pode ser qualquer caminho), entre 5% e 95%.
3. Aplica os efeitos do desfecho e lança a entrada: textos, escolha, desfecho, resumos, causas e mudanças.
4. Efeito `morte` ou saúde zerada encerram a vida (a entrada que matou vira causa da morte).

## Pontos de virada (`virada.ts`)

Cada entrada aponta as causas (a entrada que gravou cada qualidade consultada e a que a agendou). Para cada escolha, ação ou iniciativa de personagem, somam-se os descendentes (transitivos), pesados pelo impacto de cada um (atributos, patrimônio, renda, vínculos, mortes); causas do jogador pesam 25% a mais. As três mais pesadas viram os pontos de virada do cartão, cada uma ligada à consequência que melhor conta a história (impacto × distância no tempo): "aos 16, você começou a namorar Leonardo → aos 44, pagou a festa de formatura de Gabriela".

## Memória entre vidas (`memoria.ts`)

Ao fim de cada vida, cada instância que apareceu soma 1 à recência, e a recência de todas decai pela metade. Na saliência, o peso é dividido por `1 + 4 × recência`. Nada some; só cede a vez. A memória também guarda as ações já feitas: a partir da segunda vida, ação nunca feita aparece como "novo".

## Robôs do túnel (`robos.ts`)

- **primeira:** sempre a primeira opção disponível; na ficha, o primeiro verbo; nunca abre a folha Dinheiro.
- **aleatória:** sorteia entre as disponíveis (inclusive não agir); sorteia perfil e padrão aos 18, aplica em um ano a cada cinco, às vezes abre uma empresa com capital sorteado e às vezes vende na velhice.
- **cautelosa:** menor risco; empate, maior valor esperado. Conservadora e simples aos 18; aplica a sobra de três em três anos com um ano de reserva; vende aos 65 a empresa que a vida lhe deu.
- **arriscada:** maior risco; empate, maior valor esperado. Arrojada e no luxo aos 18; abre uma empresa entre os 22 e os 45 anos com metade do que tem, reinveste tudo e nunca vende.

Valor de um desfecho: atributos ponderados (saúde 1,2; felicidade 1; inteligência 0,6; aparência 0,5) + dinheiro (R$ 2 mil = 1 ponto; renda e custo com 5 anos de horizonte, inclusive por fator e pelo padrão proporcional ao patrimônio; investir vale o rendimento de 10 anos, e resgatar perde o mesmo; na empresa, o que muda na parte de quem joga, e a tração pelos anos em que ela dura) + vínculos (3 pontos = 1) + efeito passivo de qualidades novas (10 anos) − 200 se mata. Risco: desvio-padrão do valor entre os desfechos + exposição (saúde perdida, inclusive por qualidade; dívida; perda de patrimônio; chance de morrer).

Uma estratégia fixa que vence as outras em idade média de morte, patrimônio mediano e felicidade média ao mesmo tempo é **dominante**: o jogo teria resposta certa, e o túnel falha.

## Determinismo

Mesma semente e mesmas decisões dão a mesma vida, mesmo salvando e recarregando a cada passo (há teste, com a ficha do ano). A interface sorteia a semente com `crypto.getRandomValues`; o túnel deriva as suas de uma semente fixa, então `docs/metricas.md` só muda quando o motor ou o conteúdo mudam.
