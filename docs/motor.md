# O motor

Código em `src/motor/`. Puro: não toca em DOM nem em disco; recebe o conteúdo já lido e um estado, e muda o estado. A interface clona o estado antes de cada passo; o túnel de vento muta direto (é mais rápido).

## Estado (`EstadoVida`, em `tipos.ts`)

- **Entidades** (`entidades`): `eu`, `mae`, `pai`, `avo`, `amigo`, `lugar` e `pais` nascem com a vida; `amor`, `filho`, `paixao` e `pet` são criados por efeitos. Cada entidade tem `id`, `tipo` (pessoa, animal, lugar, jurisdição), nome, gênero, nascimento, vivo/morte e três mapas:
  - `n`: campos numéricos (saúde, felicidade, inteligência, aparência, vínculo, dinheiro, investido, dívida, renda, custo, classe e irmãos de origem…);
  - `t`: campos de texto (ocupação, traço, tipo de família, UF, região);
  - `q`: **qualidades** (as marcas, generalizadas): `nome → { v, ano, idade, causa }`. `causa` é o id da entrada do livro que a gravou.
- **Caminhos** (`campos.ts`): `"mae.saude"`, `"lugar.desemprego"`, `"ator.vinculo"`; sem ponto, é de quem joga (`"fumante"`). O registro de campos diz o tipo, o sistema (corpo, humor, mente, dinheiro, relações, carreira, caráter, origem, mundo, história), os limites e se é derivado (`idade`, `vivo`, `patrimonio`, `classe`, `nome`, `genero`, `quem`). O que não é campo é qualidade (vale 0 quando não existe).
- **Livro-razão** (`historico`): cada entrada tem tipo (nascimento, evento, ação, personagem, linha, regra, morte), **causa** (nascimento, escolha, ação, diretor, personagem, regra), o storylet (`ref`), o papel (`ator`), a instância (`storylet#papel`), textos, resumo, as entradas que a tornaram possível (`causas`) e as **mudanças** que ela fez (`{ c: caminho, d: variação | q: ganhou/perdeu | t: texto, r: regra }`). As regras miúdas do ano (economia, idade, vínculos) ficam numa entrada invisível do tipo `regra`.
- **agenda**, **vistos** (idades em que cada instância aconteceu), **pendente** (storylet com escolha esperando o jogador) e **rng** (mulberry32, um inteiro; vai no save).

Só as funções de `livro.ts` mudam números e qualidades, e cada uma anota a mudança na entrada que está sendo escrita. Há teste: nascimento + soma das variações do livro = estado final de quem joga.

## Nascer (`nascer`, `origem.ts`)

A origem é procedural: **6 classes** (extrema pobreza a muito rica) × **4 tipos de família** (acolhedora, conflituosa, religiosa, empreendedora) × traços. A classe decide patrimônio e renda da casa (sorteados na faixa da classe), chance de desemprego, ocupações dos pais, saúde, idade da mãe e quantos irmãos. O tipo de família decide o vínculo de partida e para onde ele volta, os traços mais prováveis dos pais e, na empreendedora, o negócio da família. Pai ausente é mais comum na conflituosa. A avó pode morar junto; o amigo de infância nasce com a vida. A cidade (55, de todas as regiões) define região, desemprego e custo de vida. Quem joga ganha um traço (esperto, bonito, forte, ansioso, otimista, tímido, carismático, teimoso) que ajusta os atributos e a felicidade de base. Escolher classe e tipo de família é opcional.

## Um ano (`avancarAno`)

1. Idade e ano +1.
2. **Economia** (`economia.ts`): inflação sorteada (média 4,5%, com crises); dinheiro parado encolhe; investido rende ~4% real (com anos ruins); dívida cresce 22% ao ano, só até o limite de crédito (2 rendas anuais, mínimo R$ 30 mil). Adultos recebem a sobra do ano (renda − custo; 75% vira padrão de vida, 40% para quem deve). Déficit além do crédito vira privação. Depois dos 65, a velhice consome 4% do patrimônio por ano.
3. **Envelhecimento:** saúde deriva com a idade; a felicidade volta 12% ao ano para a **felicidade de base** (60 + traço + vínculo médio com quem está perto, com teto); inteligência e aparência derivam; qualidades com `porAno` somam efeitos passivos; dívida pesada pesa; patrimônio confortável dá um pouco de paz.
4. **Regras dos personagens** (`familia.ts`), cada um com o próprio estado:
   - envelhecem; adoecem (chance pela idade × traço), saram ou pioram; morrem (Gompertz pela saúde), com luto proporcional ao vínculo, herança (dividida entre os irmãos) e viuvez quando era o amor de um casamento ou de uma união de 5+ anos;
   - mãe e pai perdem e ganham emprego (pelo desemprego do lugar e pelo traço) e se aposentam aos 65; guardam dinheiro enquanto trabalham e gastam depois;
   - o vínculo volta devagar para o jeito da família e esfria sem contato na vida adulta; o casal se desgasta sem cuidado; filho adulto se afasta.
   Mudanças notáveis (adoeceu, sarou, perdeu o emprego, voltou a trabalhar, aposentou, morreu) viram entradas visíveis com causa `regra`.
5. **Morte natural** de quem joga: risco de Gompertz (`0,00003·e^(0,09·idade)`) × `e^((60−saúde)/15)`; saúde zero mata; ninguém passa de 120.
6. **Regra do amor:** quem está sem namoro pode conhecer alguém (chance pela idade × paquera × aparência × traço); a regra agenda o storylet `namoro`, com a última paquera como causa.
7. **Iniciativas dos personagens:** cada personagem pode agir. A chance vem do storylet mais tenso que ele pode fazer, multiplicada pela afinidade do traço (o generoso ajuda mais, o brigão briga mais); tensão 3 age sempre. O storylet sai por saliência. Sem escolha, acontece já (causa `npc`); com escolha, vira candidato do diretor.
8. **Diretor** (`diretor.ts`), um storylet com escolha por ano, nesta prioridade:
   1. agendados vencidos (o primeiro que ainda cabe; os outros esperam um ano);
   2. **marcos** (`marco: true`) elegíveis: a espinha da vida não depende de sorteio;
   3. personagem em crise (tensão ≥ 2);
   4. sorteio com chance de `ritmo(idade)` (30% a 65%) entre eventos e iniciativas, por **saliência** = peso × especificidade (1 + 0,25 por cláusula + 0,25 se tem ator) × novidade (memória entre vidas e vezes nesta vida) × tensão × 2 se a causa consultada surgiu há até 2 anos.
9. Sem nada visível no ano, uma **linha curta** de `linhas.json` (por idade e condições, sem repetir as 15 últimas).

Elegível = idade na faixa, ator possível (vivo, salvo storylets sobre quem morreu), condições atendidas e, se não for repetível, nunca visto nesta vida (repetível: respeita o intervalo).

## A ficha do ano (`acoes.ts`)

Uma ação por ano (o motor garante). Seis verbos: estudar, trabalhar extra, cuidar da saúde, ver a família, sair, poupar. Cada verbo faz **a ação mais específica que o estado permite** (mais cláusulas, mais peso, menos repetida); a escolha é determinística, então o botão mostra exatamente o que vai acontecer ("estudar para o ENEM", "visitar sua avó"). A interface dá um toque: o verbo age e o ano passa. A mesma ação em anos seguidos vira uma linha curta ("Estudou para as provas, mais um ano.").

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

- **primeira:** sempre a primeira opção disponível; na ficha, o primeiro verbo.
- **aleatória:** sorteia entre as disponíveis (inclusive não agir).
- **cautelosa:** menor risco; empate, maior valor esperado.
- **arriscada:** maior risco; empate, maior valor esperado.

Valor de um desfecho: atributos ponderados (saúde 1,2; felicidade 1; inteligência 0,6; aparência 0,5) + dinheiro (R$ 2 mil = 1 ponto; renda e custo com 5 anos de horizonte; investir vale o rendimento de 10 anos) + vínculos (3 pontos = 1) + efeito passivo de qualidades novas (10 anos) − 200 se mata. Risco: desvio-padrão do valor entre os desfechos + exposição (saúde perdida, inclusive por qualidade; dívida; perda de patrimônio; chance de morrer).

Uma estratégia fixa que vence as outras em idade média de morte, patrimônio mediano e felicidade média ao mesmo tempo é **dominante**: o jogo teria resposta certa, e o túnel falha.

## Determinismo

Mesma semente e mesmas decisões dão a mesma vida, mesmo salvando e recarregando a cada passo (há teste, com a ficha do ano). A interface sorteia a semente com `crypto.getRandomValues`; o túnel deriva as suas de uma semente fixa, então `docs/metricas.md` só muda quando o motor ou o conteúdo mudam.
