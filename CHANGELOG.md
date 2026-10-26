# 📜 Histórico de atualizações

Cada atualização vai ao ar inteira: jogável, medida pelo túnel de vento (10.000 vidas simuladas) e publicada no navegador e no APK. A mais nova fica no topo. As métricas de cada uma estão em [`docs/metricas.md`](docs/metricas.md) e as decisões em [`docs/decisoes.md`](docs/decisoes.md).

---

## 👑 Bloco F · O poder que passa · 26/10/2026

> [!NOTE]
> O primeiro bloco da segunda lista do dono (26/10): "não estou herdando o regime, a monarquia ou a soberania", "não consigo dar um golpe de Estado", "não consigo governar quando sou monarca, ditador ou soberano", "quando fundo o país, continuo governando o Brasil". A ordem começa pelo que existia e não funcionava.

- 👑 **A sucessão** (`sucessao.ts`):
  - quem herda a coroa do Brasil, o Regime ou a ilha (o filho, o par, o amigo ou o sobrinho: o testamento é a lei da sucessão) entra na fila (`principe`, `herdeiro_regime`, `herdeiro_ilha`), e o motor agenda a resposta para o primeiro ano da vida nova, ou para os 18 (até lá, a regência);
  - vale também em vida: quando o pai ou a mãe que reinava morre, a resposta vem no mesmo ano (ou aos 18), com a morte de causa;
  - `sucessao_coroa` e `sucessao_regime` viram storylets agendados pelo motor; o texto diz quem morreu ou que a regência acabou, e eles pedem a monarquia (ou o Regime) que ainda existe;
  - a ilha passa sozinha, no primeiro ano ou aos 18, com a dotação e a popularidade em pelo menos 55; quem tem outro cargo deixa a ilha com o conselho.
- 🏛️ **Sem interregno:** enquanto a resposta está marcada, quem governava continua, inclusive sob o Regime; quem abdica devolve o governo no ano seguinte.
- 🗳️ **Quem governa precisa do cargo:** quem deixou o cargo no meio do ano (foi reinar na ilha, caiu, renunciou) não decide mais pelo país, e o governo de transição aponta a entrada que mudou o cargo (antes dizia "com a morte de quem governava").
- ⚔️ **O poder que se toma** (`99-tomar-o-poder.json`, jogadas com `"folha": "poder"`):
  - ficar no poder: quem é presidente fecha o Congresso (popularidade contra 60) ou muda a Constituição para mais quatro anos (influência contra 70), ou cumpre o mandato;
  - tomar o poder: com influência 60 e sem cargo, liderar os quartéis (coronel ou general; influência contra 65) ou financiar os generais (R$ 20 bilhões; influência contra 75), ou recusar e contar tudo à imprensa;
  - restaurar a monarquia: com R$ 10 bilhões e fama 50, bancar o plebiscito (R$ 5 bilhões; popularidade contra 70);
  - dá certo: o cargo vitalício, o Regime ou a monarquia, e a marca `golpista` (com epitáfio); dá errado: o impeachment ou a cadeia.
- 🌐 **O mundo reage ao golpe:** sob o Regime, quem joga governa com a postura dele lá fora (a Celeste se aproxima, a Federação esfria), e a sanção aponta o golpe.
- 🔧 **Defeitos corrigidos:**
  - a coroa vai para quem herda, seja quem for (D-01); sob o Regime não há eleição geral (D-03); quem tem cargo não é demitido nem anda com o setor, a carreira para no cargo e fica para trás com a coroa ou o Regime (D-04);
  - a popularidade de quem nasce e de quem herda começa em 50 (começava em zero, e a greve tirava a ilha do herdeiro em poucos anos); a coroa aceita soma 10 pontos de imagem (somava 60) e o Regime assumido tira 5 (somava 45);
  - a eleição de verdade do Regime vira a Presidência, com mandato (deixava o cargo de chefe do Regime num país que vota);
  - a greve da ilha que acaba no churrasco devolve 15 pontos de popularidade, e fundar um país avisa que reinar lá é deixar o cargo daqui.
- 💰 **O resgate do país vira título:** "Salvar o país da crise" compra R$ 200 bilhões em títulos do Tesouro de 10 anos (`comprarTitulo` com `valor`), que ficam no patrimônio, pagam cupom e podem levar calote; o reembolso sorteado (`o_pais_te_paga`) saiu.
- 🖥️ **Na tela:** a seção "Tomar o poder" na folha Carreira e poder, com o teste e o preço de cada opção; o cartão do Poder mostra a sucessão marcada para os 18, e a seção da ilha diz que a coroa dela chega aos 18.
- 🤖 **Os robôs:** a cautelosa recusa o golpe, a arriscada tenta, a aleatória sorteia; quem é presidente só pensa nisso no fim do mandato.
- 📏 **O túnel:** 80 dinastias que nascem na família real ou no Regime, a resposta de cada sucessão e as jogadas do poder com o desfecho; dois portões novos (a coroa passa; o poder se toma e é aposta).

**Ainda não tem:** governar a ilha e a cidade fundadas (o imposto e as obras do próprio bolso: o bloco F2), o empréstimo aos bancos como contrato (o bloco I) e os países de verdade (pedem a decisão do dono).

## 🛡️ Bloco E · Defesa · 26/10/2026

> [!NOTE]
> O quinto e último bloco da ordem do dono (19/10): "sistemas de armamento e guerra". A guerra é um processo com custo, e cada notícia dela aponta a decisão que a levou até ali.

- 🛡️ **A política "Defesa"**, a oitava da folha País, em três níveis:
  - desmobilizada (−0,3 ponto do PIB no gasto), regular e reforçada (+0,5), no primário, como a saúde e a ciência;
  - armar-se preocupa os vizinhos (a relação com os países de fora anda +2, 0 e −3), e a farda dá um pouco de voto (−1, 0 e +1);
  - cada bloco tem o seu nível: a aliança da ordem e o Regime reforçam, a frente popular desmobiliza, o bloco liberal e o centrão ficam no regular.
- 🎖️ **A capacidade das Forças Armadas** (`pais.defesa`, de 0 a 100) anda 8% por ano para onde a política (±15) e a tecnologia (0,3 por ponto acima de 50) levam. A vaga e a promoção de quem é militar andam com a verba da defesa.
- ✈️ **Os sistemas de armamento** (`mundo.json › sistemas`): caças (0,6 ponto do PIB, +6, em 3 anos), submarino (0,8, +7, em 5), defesa antiaérea (0,3, +3, em 2) e satélite militar (0,4, +4, em 3, com tecnologia 55). Quem governa encomenda um por ano pela folha País, com confirmação: a dívida sobe na hora, e a entrega soma à capacidade, com a encomenda de causa. O que ainda não chegou quando quem governava morre entra na capacidade do país herdado.
- ⚔️ **A guerra** (`guerra.ts`, a etapa nova do ano, entre o mundo lá fora e o país):
  - começa com um país que sanciona o Brasil e anda frio (relação abaixo de 25): 5% ao ano, o dobro a cada 15 pontos de capacidade abaixo de 50, até 25%. A notícia aponta a decisão que esfriou a relação e, com o quartel abaixo de 45, a que o desmobilizou;
  - cada ano dela custa 1,2 ponto de crescimento (a perda se acumula), 2 de inflação, 2 pontos do PIB de gasto, 0,1 ponto da população e aprovação; no primeiro ano, o país se une;
  - acaba a partir do segundo ano (25% ao ano, 50% depois de um pedido de paz; no oitavo, de cansaço), em vitória, derrota (com 4 pontos do PIB de reparação) ou cessar-fogo (a sanção continua), pela capacidade daqui contra a força de lá. Depois, dez anos sem outra;
  - na guerra, a sanção do inimigo não acaba, e quem governa só pode pedir a paz a ele.
- 🕊️ **O pedido de paz:** um por ano, de quem governa; a relação com o outro lado sobe 5, e a notícia aponta o começo.
- 📖 **Conteúdo** (`59-defesa.json`):
  - a convocação (servir, pedir dispensa à junta ou sumir no interior) para quem tem de 18 a 30 anos, e a do filho nessa idade, no ano em que a guerra começa;
  - o racionamento, a fábrica de munição e o simulado de abrigo da escola, nos anos de guerra, com o inimigo no texto;
  - quem voltou (a marca `veterano`, com epitáfio) e a pergunta no churrasco, anos depois;
  - o desfile de Sete de Setembro com o quartel equipado e o quartel sem verba para quem é militar;
  - ninguém morre numa história de guerra: ela mata pela estatística do país.
- 🤖 **Os robôs:** a cautelosa no poder fica no regular, pede a paz assim que pode e, com ameaça à vista, encomenda o sistema mais barato; a arriscada reforça o quartel, encomenda caças e nunca pede a paz.
- 🧭 **Uma regra geral:** `decisaoQueDeixou` acha a decisão que deixou qualquer política num nível (a reforma ou a posse de quem a manteve), para a desmobilização da guerra e para a ciência das descobertas.

**Ainda não tem:** a ocupação e o território, a mobilização da economia e a logística, as alianças militares, a guerra entre os países de fora e a reconstrução como programa.

## 🔬 Bloco D · O Estado pesquisa · 26/10/2026

> [!NOTE]
> O quarto bloco da ordem do dono (19/10): "usar o Tesouro do Estado para pagar pesquisa e desenvolvimento". A pesquisa vira cura, satélite e patente, e cada uma aponta a decisão que a pagou.

- 🔬 **A política "Ciência e tecnologia"**, a sétima da folha País, em três níveis:
  - cortada (0,3% do PIB), regular (0,5%) e prioridade (0,9%), pagos pelo Tesouro: o gasto entra no primário, e a dívida anda com ele;
  - cada bloco tem o seu nível: a frente popular e o Regime pesquisam como prioridade, o bloco liberal corta, a aliança da ordem e o centrão ficam no regular;
  - a folha País mostra a pesquisa pública em reais e, na reforma, o custo e a tecnologia antes de aprovar.
- 📈 **A tecnologia do país** (`pais.tecnologia`, de 0 a 100) anda 6% por ano para onde a ciência (±15) e a escola (0,4 por ponto acima de 50) levam. Ela volta:
  - como crescimento potencial: 0,02 ponto por ponto acima de 50;
  - como saúde pública: 0,2 no alvo por ponto;
  - como tração das empresas: 0,04 na tecnologia, 0,02 na saúde e na indústria, 0,015 no agro;
  - como a vaga e a promoção de quem é cientista: metade com a ciência cortada, 1,6 vez com a prioridade.
- 💉 **As descobertas** (`pesquisa.ts`): acima de 55 de tecnologia, a cura (+4 de saúde pública), o satélite (+3 de aprovação) e a patente (+2 de tecnologia), no máximo uma a cada 4 anos. Cada uma é uma notícia na linha do tempo e aponta a decisão que deixou a ciência como prioridade (a reforma ou a posse de quem a manteve), mesmo desfeita depois. No ano seguinte, ela chega à vida de quem joga.
- ✈️ **A fuga de cérebros:** com a ciência cortada e a tecnologia abaixo de 42, os laboratórios esvaziam (−3 de tecnologia), com o corte de causa.
- 📖 **Conteúdo** (`59-pesquisa.json`):
  - a bolsa de iniciação (que abre o caminho para ser cientista) ou a greve da federal, para quem está na faculdade;
  - o edital ou o laboratório que apaga a luz, para quem já pesquisou;
  - a olimpíada do instituto, para quem é adolescente num país de tecnologia alta;
  - a vacina no posto, o satélite na TV da escola e a empresa da patente, agendados pela descoberta;
  - a cura paga por quem é bilionário e o foguete em órbita somam ao estoque do país, e liberar a fórmula da cura soma à saúde pública.
- 🧭 **Ler uma política é consultar quem a decidiu:** o storylet que pede `pais.pol_*` aponta a posse ou a reforma que a pôs ali.
- 🤖 **Os robôs:** a cautelosa no poder põe a ciência como prioridade, e a arriscada corta.
- 💸 **O preço da ciência aparece na dívida:** a frente popular, que já gastava mais do que arrecadava, passou a pagar a ciência, e o calote foi de 1,1% para 1,9% das vidas no túnel.
- 🔧 **Um conserto:** o grupo na capa pede duas empresas, não três; ele estava à beira de sumir do jogo.

**Ainda não tem:** o orçamento do governo item por item, a pesquisa das empresas, os cientistas como pessoas e a corrida tecnológica com os países de fora.

## 👑 Bloco C · A coroa recebe · 26/10/2026

> [!NOTE]
> O terceiro bloco da ordem do dono (19/10): "por que o soberano não recebe salário, parte dos impostos ou taxa da coroa". Ele jogou uma soberana bilionária numa ilha, e a coroa não pagava nada.

- 👑 **Como a coroa recebe** (`coroa.ts`), para o monarca do Brasil e para quem é soberano da ilha:
  - o salário da Casa Real (R$ 4 milhões por ano no Brasil; R$ 500 mil na ilha);
  - a parte dos impostos (0,01% da arrecadação do Brasil, 10% da da ilha);
  - a taxa da coroa (0,1% do PIB do Brasil, 8% do PIB da ilha).
  A escolha é na folha Carreira e poder, uma vez por ano, com a dotação e o custo à vista.
- 💸 **A dotação é a renda de quem reina,** paga pelo tesouro ou pela ilha, com o rótulo "Dotação da coroa" no extrato. A regra a recalcula todo ano; quem muda a forma (a folha, uma escolha, a herança) a acerta na hora.
- 📉 **O preço:**
  - com a parte dos impostos, a aprovação anda 5 pontos para baixo; com a taxa, 15;
  - o anúncio também pesa na hora;
  - abaixo de 30, o Brasil faz o plebiscito (a queda do cargo) e a ilha entra em greve geral.
- 🏝️ **A ilha** (`ilha`, tipo `jurisdicao`):
  - nasce da jogada "fundar um país", nas duas escolhas, com o nome da cidade natal, 2.300 habitantes, R$ 80 mil de PIB por pessoa e imposto de 20%;
  - todo ano, a renda por pessoa e a população andam: o reconhecimento soma, e a taxa da coroa tira;
  - passa a quem herda, com a coroa e a forma.
- 📖 **Conteúdo:**
  - quatro histórias agendadas pela decisão, com ela de causa: a rua contra a taxa da coroa, a conta da parte dos impostos, a ilha que passou de 2.600 habitantes e o barco de mudança;
  - a greve na ilha fala da população de agora, volta quando a aprovação cai e zera a renda de quem desce do trono;
  - a proposta da concorrente, o recrutador e o trabalho remoto em dólar não chegam mais a quem tem cargo.
  - as histórias de quem reina (a assinatura, as mordomias, o jubileu e a vida depois da coroa) ganharam peso: num reinado de 30 anos, quase nunca apareciam. Cortar as mordomias não mexe mais na renda, que agora é a dotação.
  - o negócio da família que quebra na crise ganhou peso: aparecia em 0,0% das vidas e estava à beira de sumir do jogo.
- 🤖 **Os robôs:** a cautelosa fica no salário e passa à parte dos impostos com o povo do lado (popularidade 60 ou mais), de onde só volta abaixo de 40; a arriscada cobra a taxa e não recua; a aleatória troca de forma de vez em quando.

**Ainda não tem:** a legitimidade medida à parte da popularidade, o imposto da ilha como decisão, o ditador com outra regra e o reconhecimento como processo.

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
