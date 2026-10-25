# 📜 Histórico de atualizações

Cada atualização vai ao ar inteira: jogável, medida pelo túnel de vento (10.000 vidas simuladas) e publicada no navegador e no APK. A mais nova fica no topo. As métricas de cada uma estão em [`docs/metricas.md`](docs/metricas.md) e as decisões em [`docs/decisoes.md`](docs/decisoes.md).

---

## 🏛️ Bloco B · O Tesouro · 25/10/2026

> [!NOTE]
> O segundo bloco da ordem do dono (19/10): a dívida do governo vira um contrato que quem joga pode comprar, com cupom, vencimento, preço de mercado e calote.

- 🏛️ **O título do Tesouro** (`tit<entrada>`, tipo `titulo`):
  - comprado pela folha Dinheiro, a partir dos 18 anos, por 5, 10 ou 20 anos;
  - a taxa fica travada na compra: o juro real do ano, mais 0,05 ponto por ano de prazo e o risco da dívida acima de 90% do PIB, menos o imposto de renda;
  - no máximo 5 títulos ao mesmo tempo, de R$ 100 para cima, e nunca mais de 30% da dívida do país.
- 💵 **O cupom e o vencimento:**
  - o cupom cai na conta todo ano, com o governo de contraparte;
  - no vencimento, o dinheiro volta numa entrada visível, que aponta a compra (ou a herança).
- 📉 **A venda antes do vencimento** sai pelo preço do dia: o valor que falta, descontado pela taxa de hoje.
- 💥 **O calote:**
  - acontece com a dívida acima de 100% do PIB, numa recessão ou numa crise (1% de chance por ponto acima de 100, até 25% ao ano);
  - quem tinha título perde 30% do valor, e a renda fixa perde 15%;
  - a dívida do país cai um quarto e a economia perde 2 pontos de crescimento no ano;
  - a Selic paga 2 pontos a mais, que somem em seis anos;
  - a notícia aponta a posse, a reforma ou o decreto que pôs a dívida para cima, e no ano seguinte vem a história do dia seguinte.
- 👪 **A herança:** o título passa a quem herda, dividido como o resto do espólio, e vence na vida nova.
- 🇧🇷 **A folha País** mostra a dívida pública em reais, quanto dela é sua e o risco de calote do ano.
- 📖 **Conteúdo:**
  - três histórias novas: o primeiro cupom, o calote no noticiário e o dia seguinte ao calote;
  - o efeito `venderTitulos` deixa uma escolha vender os títulos pelo preço do dia, e o `comprarTitulo`, comprar um;
  - "Investir no Tesouro Direto" (o primeiro investimento, a moeda do cachorrinho) compra um título de verdade, que aparece na folha e vence anos depois; a ação "investir com método", que investe pelo perfil, deixou de falar em Tesouro.
- 🤖 **Os robôs:**
  - a cautelosa empresta ao governo quando o título longo paga bem;
  - a aleatória compra e vende de vez em quando;
  - quem está devendo no banco vende o título.

**Ainda não tem:** o título comprado pela empresa (falta o caixa dela, I-11), o orçamento do governo item por item e os outros credores como personagens.

## 📏 Correção C3 · Regras que se medem direito · 25/10/2026

> [!NOTE]
> O fim do plano de correção de 20/10: quatro regras do motor de custo pequeno, cada uma medida antes e depois.

- 📏 **A régua do túnel:**
  - os dilemas se medem em três bolsos de adulto (R$ 1 mil, R$ 10 mil e R$ 50 milhões na conta);
  - o storylet que pede empresa se mede com uma empresa típica;
  - o "arriscar nunca compensa" divide pelos storylets que a conta olha (286), não por todos os que têm escolha (641);
  - no empate em tudo, o robô sorteia (a cautelosa votava 100% num bloco só).
- ⚖️ **Zero falsos dilemas** nos três bolsos (eram 7), com um teste que confere o conteúdo de verdade.
- 🏛️ **O Executivo:**
  - prefeito, governador e presidente: dois mandatos seguidos, e o terceiro aparece desabilitado com o motivo;
  - quem tem cargo, coroa ou regime não faz bico, entrega nem trabalho grande.
- 💼 **Quem vive de patrimônio:**
  - não é demitido nem nasce desempregado, e na crise perde parte do que tem;
  - a demissão de quem é rico vem com rescisão e bônus, sem cesta básica;
  - os textos das regras agora escolhem trechos pelo estado, como os storylets.
- 🔧 **A mensalidade da escola na crise** ganhou tensão: era o storylet mais raro e sumia nas 10.000 vidas.

**Ainda não tem:** o dinheiro do conteúdo que acompanha a fortuna, o risco que compensa, a conversa livre com as pessoas e o ícone novo no app Android.

## 💞 Bloco R · As pessoas da sua vida · 25/10/2026

> [!NOTE]
> Pedido do dono no meio dos blocos: relacionamento de verdade, com causa e consequência, e pessoas que parecem vivas e sabem quem você é. Tudo sai de regras e do livro-razão, sem texto gerado e sem servidor.

- 💞 **A relação com cada pessoa:**
  - o afeto, a confiança, a mágoa e os anos sem contato;
  - a mágoa passa no ritmo do perdão de cada traço;
  - a pessoa rompe a partir de 42 de mágoa, e o par faz as malas a partir de 45;
  - chegar perto zera os anos longe.
- 🧠 **A memória:**
  - a pessoa lembra da melhor e da pior coisa que você fez com ela, contada do ponto de vista dela ("de quando você levou ela para ver o mar, aos 41");
  - ela lembra também do que você deixou de fazer: quem passa um ano doente sem ver você guarda a falta.
- 🪞 **A opinião:**
  - são 14 opiniões sobre você, cada uma com o porquê;
  - elas saem do que a pessoa viu, do que todo mundo sabe e do que só quem está perto sabe;
  - o antigo pesa menos, e quem morreu não forma opinião nova;
  - a opinião muda o que a pessoa faz: quem acha você sumido procura menos, e quem acha você cabeça-quente briga mais fácil.
- 🌊 **As vontades:**
  - são nove: ver o mar, voltar à terra natal, ver o neto, casar, ter um filho, um bicho, a casa própria, a viagem com o amigo e a festa de 80;
  - realizar é uma escolha;
  - a vontade que espera cobra, e a que passa da hora vira falta;
  - a morte diz o que faltou.
- 🕯️ **O luto conta a relação:**
  - morrer magoado, longe ou com a vontade guardada deixa remorso;
  - morrer perto e em paz deixa a despedida.
- 👴 **Os filhos aprendem com você:** na velhice, o filho cuida ou some conforme o que viu.
- 🤝 **A folha Família:**
  - mostra o humor, a opinião com o porquê, a vontade, as lembranças, a confiança e a mágoa de cada um;
  - **Fazer algo com…** abre as ações com cada pessoa.
- 🧩 **Conteúdo novo:**
  - 14 storylets de relação (conversar, presentear pelo gosto, pedir desculpas, desabafar, o túmulo, a saudade, a cobrança, o rompimento, as pazes);
  - 34 storylets de quem sabe quem você é (as vontades e quem as realiza, as reações pela opinião, a falta lembrada, o par que vai embora, pedir um Pix).
- ⚙️ **Por baixo:**
  - a soma do livro fica guardada fora do estado: não há save novo;
  - as condições em campos calculados rodam por último;
  - o leilão declara as marcas que tira.

**Ainda não tem:** conversa livre com as pessoas, as relações entre os personagens, o ex que continua existindo, a correção C3 e o ícone novo no app Android.

## ✍️ Correção C2 · O texto não contradiz a vida · 25/10/2026

> [!NOTE]
> Seis consertos de texto, cada um medido em centenas de vidas antes e depois, e cada um com uma regra nova no validador para o erro não voltar.

- 🕊️ **Quem morreu não fala:**
  - o texto que cita a mãe, o pai, a avó, o amigo ou o amor sabe se a pessoa vive;
  - vivo, a fala; morto, a lembrança.
  - Em 150 vidas por estratégia, os mortos falavam em 8% a 77% delas; agora, em nenhuma.
- 👶 **Cada filho com o próprio nome:**
  - a história de "um filho" fala do filho certo;
  - o ciúme do irmão é do primogênito pequeno;
  - "mais um filho" fala do caçula.
- ✍️ **Concordância:**
  - sete modelos quebrados consertados ("inteiroa", "tioa", "rica/rico");
  - o "dele/dela" segue o amigo;
  - cerca de 80 textos sobre quem joga ganharam o gênero.
- 🧒 **Coerência:**
  - o amigo de infância é reencontrado na escola, não apresentado;
  - filho único não tem irmão;
  - o cargo não se repete entre parênteses.
- 🔁 **Repetição:**
  - o desfecho já contado volta curto;
  - as ações mais usadas ganharam variações;
  - a eleição fala em palavras e conta a vez.
- 🃏 **O cartão da vida:**
  - a mesma consequência conta uma vez;
  - pesam o marco, a eleição, a empresa, o filho, o casamento e as mortes;
  - o dinheiro pesa pelo logaritmo.
- 🔧 **Dois storylets raros** (o filho que vai morar fora e a herança do bicho) voltaram a aparecer.

**Ainda não tem:** a correção C3 (regras do motor), o ícone novo no app Android e a rosca do patrimônio.

## 📏 C0 e ajustes da C1 · A régua da tela · 20/10/2026

- 📏 **`npm run telas`:** uma régua com 52 critérios de interface, medida em sete combinações de tela e letra (do celular pequeno com a letra normal ao do dono com a letra em 1,45), nos dois temas, com seis saves guardados no repositório e oito vidas jogadas pela interface. A versão anterior à correção reprovava em 46 critérios; esta passa em todos.
- 🎴 **As opções do evento nunca saem da tela:**
  - primeiro a história cede até três linhas;
  - depois o texto do evento rola;
  - se ainda faltar espaço, a história cede o resto, só naquele evento.
- 💼 **Na tela estreita com a letra grande,** o cargo sai do cabeçalho (ele está na folha Carreira), e o dinheiro cabe.
- 📜 **O balanço do ano fica numa linha:** quando não cabe, os aluguéis saem dela e ficam no extrato da folha Dinheiro.

## 📖 Correção C1 · A história de volta ao centro · 20/10/2026

> [!NOTE]
> O dono jogou o V1 e disse que o jogo perdeu qualidade, hierarquia, dimensionamento e cuidado. Medido no celular dele (360 × 780, letra do sistema em 1,45), o cabeçalho de cartões tomava a tela, o dinheiro saía cortado, o botão dourado pulava as escolhas e o toque duplo passava o ano. O motor não mudou.

- 📖 **O cabeçalho virou uma faixa de texto:**
  - o nome divide a linha com as quatro folhas;
  - embaixo, o título, a idade e a cidade;
  - o selo da economia é um link;
  - os indicadores ficam em 2×2 com a barra fina, e o dinheiro numa linha que quebra.
  - Saíram a barra da marca, o retrato e os cartões. Com um evento na tela, ficam só o nome e o dinheiro.
- 🔠 **Um arranjo só,** sem o modo de letra grande: o que precisa ceder quebra linha. O ícone dos indicadores e dos verbos só aparece quando cabe.
- 🎴 **O cartão do evento:** o texto rola por dentro, com uma sombra quando há mais; as opções ficam sempre à vista, e a história guarda três linhas.
- 📜 **A rolagem para no começo do ano** depois do "+1 ano". O balanço do ano virou uma linha pequena e neutra.
- ⏩ **O botão do ano:**
  - com escolhas sobrando, é o secundário e diz "sobram 3";
  - sem escolhas, é o dourado;
  - o título diz "Suas escolhas · 3 este ano".
- 👆 **Toque duplo:** a carência de 450 ms vale também quando um evento fecha e quando a lista de um verbo abre ou fecha. Depois de um evento, o segundo toque passava o ano 12 vezes em 40; agora, nenhuma.
- ❌ **Folhas:**
  - o título e o X ficam fora da parte que rola;
  - o voltar do navegador e o do Android fecham a folha (no APK, o voltar fechava o app);
  - saíram a alça e o fundo desfocado.
- 👨‍👩‍👧 **Família** com os medidores de volta ("Saúde43" → "Saúde 43").
- 💼 **Carreira:**
  - o Poder vem primeiro para quem tem cargo;
  - as profissões e os cargos fechados pelo mesmo motivo viram uma linha só, com o motivo;
  - os cargos fechados passaram a dizer por quê.
- 🌙 **O ouro só onde tem papel:**
  - o marco, o ponto de novidade, o fio do evento e o botão do ano sem escolhas;
  - saiu o brilho dourado;
  - o verbo Trabalhar ficou verde, e a Felicidade, laranja.

**Ainda não tem:** as correções C2 (o texto que contradiz a vida) e C3 (regras do motor que se medem errado), o ícone novo no app Android e a rosca do patrimônio.

## 🌙 Bloco V1 · A cara nova · 19/10/2026

> [!NOTE]
> Inspirada no mockup que o dono mandou, com o acabamento do pacote visual que ele mandou depois. O motor não mudou.

- 🌙 **Tema noite e ouro:** azul-noite com ouro no escuro e papel creme com ouro velho no claro. O símbolo, os ícones do navegador e o cartão compartilhável também mudaram.
- 🏷️ **Cabeçalho novo:**
  - a barra da marca;
  - o retrato com as iniciais e a coroa (realeza, Regime, trono, bilhão);
  - o selo da economia com o ano;
  - os quatro indicadores em cartões com ícone e cor;
  - o dinheiro, o patrimônio e a renda em três cartões, com o cargo.
- 🧭 **Suas escolhas:** os verbos com ícone e cor, e o botão dourado **Viver mais 1 ano**.
- 👑 **Marco da trajetória:** o primeiro dia de escola, o ENEM, o primeiro emprego, a aposentadoria e os outros marcos ganham um cartão dourado na linha do tempo.
- 🔠 **Letra grande:** o jogo mede a fonte do celular. Quando ela está grande, troca o arranjo: indicadores numa linha, dinheiro em pílulas e verbos sem ícone, com o nome inteiro.
- ✨ **Acabamento,** comparado regra por regra com o pacote de CSS que o dono mandou:
  - o fio de ouro no cartão do evento;
  - opções mais táteis;
  - folhas com alça e fundo desfocado;
  - cartões com sombra leve;
  - avisos com borda dourada;
  - telas baixas mais justas;
  - moldura em tela larga.
- 🔧 **Correção:** os chips no cartão da morte agora são legíveis (estavam verde-claro sobre creme).

**Ainda não tem:** foto no retrato, a rosca do patrimônio, um botão para escolher o tema e o ícone novo no app Android instalado.

## 🇧🇷 Bloco A · O país em números · 19/10/2026

> [!NOTE]
> O primeiro dos blocos pequenos pedidos pelo dono. O país já tinha dez estatísticas vivas; agora tem tamanho.

- 📈 **PIB** em reais de hoje (começa em R$ 11,7 trilhões em 2026) que cresce exatamente o crescimento do ano.
- 👥 **População** (213 milhões em 2026) que sobe devagar, para de crescer por volta de 2045 e depois encolhe. Ela nasce mais quando a saúde pública melhora.
- 💰 **PIB per capita**, o PIB dividido por todo mundo.
- ⚖️ **Índice de Gini** (desigualdade), que sobe com a pobreza e cai com a educação. A violência do país passa a ler a desigualdade.
- 🎓 **IDH**, que junta saúde, educação e renda, com a faixa da ONU (baixo, médio, alto, muito alto).
- 🗂️ Folha País com a seção **Em números**: os cinco indicadores, a seta do ano e o que cada um quer dizer.
- 📰 Cinco histórias novas que leem esses números: o PIB recorde, a desigualdade no jornal, o IDH muito alto, o IDH em queda e o país que encolhe.
- 💾 O save antigo ganha os números do ano em que está, sem sorteio.

**Ainda não tem:** o Tesouro com orçamento em reais, títulos públicos que pagam juros na conta, renda para o soberano, pesquisa paga pelo Estado e forças armadas. São os blocos B a E (veja o README).

## 👨‍👩‍👧‍👦 Fatia 1.4a · Vários filhos · 19/10/2026

- Um filho novo não apaga o outro: até quatro filhos, cada um com nome, idade e vida própria.
- Sem testamento, os filhos dividem a herança, e o mais velho continua a história. O testamento escolhe qual filho herda.
- Histórias novas: mais um filho, o ciúme do irmão, a briga dos irmãos e a mesa cheia no Natal.
- O cabeçalho deixou de esconder a linha do dinheiro.

## ⚙️ Fatia 1.3 e eficiência · 18/10/2026

- O ano virou 19 etapas declaradas, cada uma dizendo o que lê e o que escreve. Um teste confere.
- O save ganhou cópia de segurança. Exportar e importar ficam no menu.
- O túnel roda um trabalhador por núcleo: de 687 s para 199 s.
- O toque no fim de uma vida longa ficou 2,8× mais rápido no celular.

## 🏦 Fatias 1.1 e 1.2 · As contas fecham · 12–13/10/2026

- Todo real tem contraparte: cada mudança de dinheiro diz de quem veio ou para quem foi. O extrato do ano e o da vida estão na folha Dinheiro.
- Toda dívida é um contrato com o banco: cheque especial, empréstimo, financiamento com garantia e acordo.
- Os contratos têm atraso, nome sujo, leilão do imóvel e dívida que caduca em cinco anos. Renegociar é uma escolha.

## 🌍 Incremento 10 · O mundo lá fora · 12/10/2026

- Quatro países fictícios, cada um com economia e relação próprias, e o dólar.
- Alinhamento, tarifa, sanções e acordos mudam o crescimento, a inflação e os setores daqui.
- Quem governa faz um ato lá fora por ano: visita de Estado, acordo ou romper relações.

## 🏢 Incremento 9 · O grupo de empresas · 11–12/10/2026

- Até cinco empresas ao mesmo tempo, com subsidiárias, fusões e abertura de capital de cada uma.
- A mesa de quem manda: o talento se divide entre as empresas que dependem dele.

## 🗳️ Incremento 8 · O país vivo · 11/10/2026

- Dez estatísticas que se causam, quatro blocos fictícios mais o Regime, e eleições.
- O voto de quem joga pesa no resultado. Quem governa muda as políticas pela folha País.

## 🍼 Incremento 7 · As crises acabam, a vida começa sua · 11/10/2026

- Criar o personagem escolhendo tudo: nome, cidade, classe, família, linhagem, irmãos, jeito e talentos.
- Primeira infância com causa e efeito: o que acontece até os 4 anos volta dos 5 aos 12.
- A crise econômica deixou de ser interminável.

## 🧭 Incremento 6 · Quem manda e o porquê · 11/10/2026

- A empresa depende de quem manda, e delegar é decisão.
- Cada acontecimento mostra, na linha do tempo, a decisão de um ano anterior que o causou.

## ✨ Incremento 5 · Brincar de deus · 08/10/2026

- Quatorze jogadas de R$ 6 milhões a R$ 500 bilhões. Entre elas: fundação, cura de doença, programa espacial, cidade nova, fundar um país e colônia em Marte.
- O mundo responde a cada uma.

## 🎭 Incremento 4 · Liberdade de verdade · 07/10/2026

- 49 profissões, 30 bens, eleições e mandatos, linhagens (inclusive a família real e o Regime) e truste.
- O testamento é escolhido em vida.
- Saiu o primeiro APK para Android.

## 🏰 Incremento 3 · Dinastia, dinheiro com escolha e empresa · 07/10/2026

- A história continua com quem herda.
- Carteira em cinco classes de investimento, padrão de vida escolhido e a empresa como entidade.

## 🌦️ Incremento 2 · O mundo reage · 06/10/2026

- Ciclo da economia, 12 setores, ENEM e curso, e herança como bifurcação.

## 🌱 Incremento 1 · Família viva · 06/10/2026

- O livro-razão causal e a família viva (mãe, pai, avó e amigo).
- A origem procedural e as fichas de ação do ano.
