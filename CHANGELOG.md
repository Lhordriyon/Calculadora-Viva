# 📜 Histórico de atualizações

Cada atualização vai ao ar inteira: jogável, medida pelo túnel de vento (10.000 vidas simuladas) e publicada no navegador e no APK. A mais nova fica no topo. As métricas de cada uma estão em [`docs/metricas.md`](docs/metricas.md) e as decisões em [`docs/decisoes.md`](docs/decisoes.md).

---

## 🧬 S3 · O sonho que passa adiante · 07/11/2026

> [!NOTE]
> O dono pediu a próxima volta do loop (07/11) e, no meio da construção: "tem que ser divertida e legal e perceptível!".

- ✦ **O caminho do sonho à vista** (`projetos.ts › anunciarEtapas`): cada etapa nova de qualquer sonho vira uma linha na linha do tempo, com o começo do sonho de causa ("2 de 3 etapas do sonho"; na última, "agora falta só ele").
- 🧬 **O sonho passa adiante** (`herdeiro.ts`): quem morre com um sonho de pé deixa esse sonho para quem herda; o que não veio pode ser contado a um filho em vida (o efeito `passarSonho` e o campo `sonho` da pessoa), e o filho aparece com o sonho nas mãos.
- 📁 **A pasta do sonho** (`a_pasta_do_sonho`): no primeiro ano, quem herda acha as anotações de quem veio antes; quatro jeitos de recebê-la, um deles a gaveta (o efeito `largarSonhoHerdado`).
- 🪪 **De quem era:** a folha Planos, o fim do sonho e o cartão da vida dizem de quem era o sonho herdado.
- 🤖 **A régua dos dilemas** conta passar e largar o sonho como consequências próprias.
- 🗣️ **A dívida de quem é casado vai direto ao par** (o peso `aoAlvo` no tema do segredo): a revelação da dívida morria no túnel.
- 📊 **No túnel** (10.000 vidas): 48,4% das gerações herdeiras começaram com o sonho de quem veio antes, e 44 o realizaram; o porquê à vista foi de 38,6% para 41,8% dos acontecimentos; as contas fecham nas 4,13 milhões de entradas, e nenhuma estratégia domina; nenhuma história morta; saturação V5 53,2% e V20 87,1%; 903 histórias por 1.000 vidas; toques 478,6.

---

## 🌅 S2 · O segundo ato · 04/11/2026

> [!NOTE]
> O dono leu o projeto e mandou seguir (04/11): a segunda volta do loop da qualidade de jogo.

- 🌅 **O dia do sonho** (`o_dia_do_sonho_<id>`, pela agenda, com a conquista de causa): o estádio cheio, os cem milhões, a posse, a foto da família inteira e as bodas de prata, cada um com três jeitos de viver o topo; a promessa grande demais da posse é cobrada no ano seguinte.
- ❓ **O "e agora?" e "o sonho que ficou"** (`projetos.ts › terminar`): um ano depois do fim de qualquer sonho, a vida pergunta o que vem depois; as perguntas são repetíveis e oferecem os sonhos da segunda metade, cada um bloqueado com o motivo quando não faz sentido.
- 🌍 **Quatro sonhos da segunda metade** (`mundo.json › projetos`): a fortuna (R$ 50 milhões), o lugar no mundo (o sítio, a casa de praia ou a fazenda), a volta ao mundo e ver os netos crescerem, com nove cenas.
- 🎂 **A pergunta dos 50** (`a_crise_dos_cinquenta`): para quem chega lá sem sonho de pé.
- 🃏 **O cartão conta os dois atos**, com a escolha do dia do sonho na linha do sonho realizado.
- 🤖 **Os robôs:** quem sonha com o lugar no mundo compra o maior que cabe no bolso; quem sonha com o palco tenta a vaga a cada dois anos. Começar um sonho conta como consequência própria na régua dos dilemas.
- 📊 **No túnel** (10.000 vidas): os anos dos 50 em diante com um sonho de pé foram de 30% para 51,9%; o dia do sonho chegou em 98,4% dos sonhos realizados; 87,6% dos sonhos que acabaram chegaram à pergunta do que vem depois; os realizados foram de 11,3% para 19,5% dos que acabaram; as contas fecham nas 4,10 milhões de entradas, e nenhuma estratégia domina; nenhuma história morta; saturação V5 53,1% e V20 87,2%; 903 histórias por 1.000 vidas; toques 478,9; a oferta hostil caiu para 0,07% das vidas, abaixo do portão de 0,1%.

---

## ✦ S1 · O sonho · 03/11/2026

> [!NOTE]
> O pedido do dono (03/11): um loop de atualizações com foco total na qualidade de jogo, porque "o player busca o Trajetória para viver nele o que de fato quer viver".

- ✦ **O sonho dos 15 anos** (o marco `o_que_voce_quer_da_vida`): virar estrela, construir um império, governar o país, ou ainda não sei. Com o namoro, o do amor (`o_que_voce_quer_do_amor`): a casa cheia ou um amor para a vida toda.
- 🗺️ **O sonho é um plano** (`mundo.json › projetos`, `"sonho": true`; o efeito `sonhar`): as etapas são o estado (a fama até 60, a empresa até R$ 100 milhões, o cargo até o Planalto, três filhos, 25 anos de casado), o prazo vai de 30 a 40 anos, e a folha Planos marca o sonho com ✦.
- 🎬 **Quinze cenas** (`58-sonhos.json`), três por sonho, em pontos diferentes do caminho; a primeira da estrela é a porta (o microfone do bar, a câmera, a várzea com o olheiro, o teatro), e cada uma abre uma carreira de holofote.
- 💪 **A garra do sonho:** quem sonha em virar estrela sobe com o dobro da chance numa carreira de holofote (`regras.ts › GARRA_DO_SONHO`).
- 🏆 **O fim que se conta:** o sonho realizado é um marco dourado na linha do tempo, e o cartão da vida diz como cada sonho terminou (`virada.ts › sonhosDaVida`).
- 🤖 **Os robôs que sonham vão atrás do sonho:** a vaga de holofote, a eleição com chance menor, a empresa aberta.
- 🪪 **Os sonhos têm vaga própria** (dois de pé, à parte dos três planos), e o marco do sonho não toma a vaga de um ponto de virada: o cartão já conta o sonho na linha própria.
- 📏 **A régua do caminho** conta a escolha de cada ponto de virada e o arco do sonho, e mostra o caminho sem o arco, comparável com as versões de antes.
- 🏠 **A casa dos pais cabe na tela** com a letra 1,5: o texto, uma opção e os motivos dos bloqueios ficaram mais curtos (a régua da tela achou a última opção fora da tela aos 42 anos de uma das vidas de teste), e a régua passa a mostrar o começo do texto do evento quando esse critério falha. Os 52 critérios passam.
- 📊 **No túnel** (10.000 vidas): 91,0% das vidas que chegam aos 20 sonham; dos 10.850 sonhos que acabaram, 11,3% se realizaram (a casa cheia 534, o amor para a vida toda 323, a estrela 302, o império 41, o país 31); as contas fecham nas 4,10 milhões de entradas, e nenhuma estratégia domina; saturação V5 52,6% e V20 87,0%; 903 histórias por 1.000 vidas; toques 479,2; caminho 792 por 1.000 vidas (572 sem o arco do sonho, contra 650 do H7 na mesma régua) e destino 569; a oferta hostil caiu para 0,09% das vidas, abaixo do portão de 0,1%.

---

## 📈 H7 · A bolsa de verdade · 03/11/2026

> [!NOTE]
> O pedido do dono (03/11): a próxima atualização de capitalismo (o passo combinado no fim do H6).

- 📈 **Emitir ações** (`emitir`): a rodada de 15% na bolsa; o dinheiro vai para o caixa, e a parte de quem joga encolhe.
- 🔁 **Recomprar a maioria** (`recomprar`): o que falta para 51%, com 10% de prêmio a quem vende.
- 🦈 **A oferta hostil** (`opa`): a concorrente pela bolsa, sem pedir ao dono, com 35% de prêmio; a chance pelos acionistas, pela influência de negócios e pela garra do dono; a que falha custa 5% e fortalece a rival.
- 🛡️ **A oferta contra quem joga:** sem a maioria, a dona da concorrente ou um fundo de fora pode comprar o controle (pela agenda, com a diluição de causa); recomprar, vender com prêmio ou brigar no conselho.
- 🤖 **Os robôs:** a arriscada emite antes de pegar crédito e vai pela oferta hostil; a cautelosa recompra a maioria.
- 📊 **No túnel** (10.000 vidas): as contas fecham em 4,10 milhões de entradas; a oferta hostil em 0,11% das vidas, passando em 61% das 23; a oferta contra quem perdeu a maioria em 0,23% (os robôs brigam no conselho); a emissão em 0,43%; bilionário feito 0,38%; quebram 25,7% de quem abre empresa; saturação V5 52,3% e V20 87,2%; 901 histórias por 1.000 vidas; toques 477,1.

---

## 🧑‍💼 H6 · O capitalismo com rosto · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): continuar o foco no capitalismo, cada atualização melhor que a anterior.

- 🧑‍💼 **A rival tem nome e dono** (o papel `rival`): o traço dele dá a garra na briga (`negocio.ts › garraDaRival`), a guerra de preços o magoa, e ele sai quando a empresa acaba, muda de setor, chega concorrente nova ou dois anos depois da quebra.
- 💔 **O rival que você conhece:** na concorrente nova, um ex ou um amigo magoado pode ser o dono, a mesma pessoa (`pessoas.ts › levarParaAEmpresa`).
- 🤝 **Comprar a concorrente é pedir ao dono** (o pedido `aceitar`, com o porquê); quem vende pode virar o gestor.
- 🗂️ **O gestor que propõe** (o papel `gestor`, `diretoria.ts`): chega com a empresa de R$ 10 milhões e propõe a jogada do ano pelo jeito do traço (a heurística dos robôs), com o número que a justifica; o ano seguinte confere, e sem confiança ele vai para a concorrência.
- 🎭 **Oito histórias** (a proposta, a trégua e o cartel que vaza, a oferta pela empresa, o gerente roubado, o processo da marca, o dono quebrado, a festa) e a folha Dinheiro com a rival, o diretor e como o dono está para vender.
- 📊 **No túnel** (10.000 vidas): as contas fecham em 4,10 milhões de entradas; a rival pelo nome em 100% de quem abre empresa, e o rival que já era da vida em 2,6%; o gestor em 19,2%, com 51% das 1.982 propostas seguidas e sem dominar (R$ 41 milhões contra R$ 42 milhões); bilionário feito 0,40%; quebram 25,6% de quem abre empresa; saturação V5 52,3% e V20 87,2%; 901 histórias por 1.000 vidas; toques 476,9.

---

## 🌐 ★ · A influência que importa · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): o sistema de influência no centro, com as esferas pessoal, política e de negócios, que quem joga sinta que importa, e conquistas baseadas nela.

- 🌐 **Três esferas** (`influencia.ts`), tiradas do estado, sem número novo: a pessoal (6 por laço forte e 0,7 da fama), a política (o poder do cargo, 0,3 da popularidade, o lobby, a mídia própria e a linhagem) e a de negócios (o tamanho da maior empresa, o truste e as empresas a mais).
- ⚙️ **Cada uma muda uma decisão:** a vaga, a eleição e o lobby, o crédito da empresa e o preço da concorrente.
- 🏅 **Nove conquistas**, três por esfera (40, 70 e 90), uma vez só: em dourado na linha do tempo, no epitáfio e no cartão da vida, com três histórias que elas abrem (o bairro pede a sua opinião, os partidos batem na porta, os conselhos te chamam). Em 500 vidas dos robôs, o primeiro degrau vem em 28% a 33% (6% no de negócios), o segundo em 1% a 3%, e o terceiro é raro (até 0,4%).
- 🧾 **A folha Carreira** com a influência, a fama, as três esferas e a conquista que está perto.
- 📊 **No túnel** (10.000 vidas, com o H5 junto): as contas fecham em 4,10 milhões de entradas; bilionário feito 0,51%; quebram 24,7% de quem abre empresa; saturação V5 52,6% e V20 86,9%; 904 histórias por 1.000 vidas; toques 479,2.

---

## 🔗 H5 · O capitalismo integrado · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): o núcleo da nova grande atualização, o simulador de capitalismo.

- 🔗 **A cadeia de fornecimento** (`mundo.json › setores`: `insumo` e `parteDoInsumo`): cada setor compra de outro, e o preço do setor fornecedor entra no custo.
- 🏭 **A integração vertical:** com empresa no setor fornecedor, quem joga compra a preço de custo e fica fora do ciclo de lá.
- 👷 **A mão de obra:** a folha sobe 3% por ponto de desemprego abaixo do natural, e a falta de gente vira história.
- 🏛️ **O imposto pela política de impostos** de quem governa (de 0,8 a 1,25 vezes) e **o lobby** (2% do valor): pode baixar os impostos de um governo que não é o de quem joga, uma vez, com o lobby de causa e o risco do escândalo.
- 📊 Medido junto com o bloco ★, publicado na mesma atualização.

---

## 🛒 H4 · Comprar no tempo certo · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): mais melhorias para a empresa.

- 🔮 **A previsão do setor:** a folha mostra para onde o preço do setor vai no ano que vem, pela obra em andamento (o indicador antecedente do ciclo).
- 📊 **A fatia do mercado** da empresa, na folha.
- 🛒 **A concorrente pelo preço do dia** (o preço do setor vezes a força dela): barata na sobra e quando está fraca, cara na alta; o negócio entra pelo preço justo, e a concorrente perde 15 pontos. A arriscada só compra pelo justo ou abaixo.
- 📊 **No túnel** (10.000 vidas): as contas fecham em 4,09 milhões de entradas; bilionário feito 0,69%; quebram 26,6% de quem abre empresa; saturação V5 52,6% e V20 87,4%; 906 histórias por 1.000 vidas; toques 477,2.

---

## 🌀 H3 · Os mercados de cada setor · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): a simulação da empresa ainda melhor, "como um pós-doc faria".

- 🌀 **A teia de aranha** (`negocio.ts › anoDosSetores`): cada setor é uma entidade com a oferta relativa e a obra em andamento; o preço sai da oferta (elasticidade 1,5), e a onda de obras responde ao preço com inércia, com ciclos de uns oito anos.
- 💵 **O preço do setor** entra na receita de toda empresa dele e no custo da obra (comprar na baixa).
- 🥊 **A sobra tira a concorrente fraca e aperta o emprego** de quem trabalha no setor (quem joga e a família); a falta chama concorrente nova.
- 📖 **Três histórias** (o setor aquecido, o que afundou, o ramo em crise), e as folhas Dinheiro e País com o setor.
- 📊 **No túnel** (10.000 vidas): as contas fecham em 4,09 milhões de entradas; bilionário feito 0,74%; quebram 26,0% de quem abre empresa; saturação V5 52,3% e V20 87,6%; 905 histórias por 1.000 vidas; toques 477,8.

---

## 🥊 H2 · A concorrência e o banco da empresa · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): a simulação da empresa "10× melhor".

- 🥊 **A concorrente que reage** (`negocio.ts`): a demanda cresce pela atratividade de quem joga menos a força da concorrente; ela corre atrás de quem atrai muito mais, entra na guerra de preços contra quem cobra o popular, chega nova quando o lucro passa de 18% das vendas e quebra quando perde a briga (a clientela vem junto), com a decisão de preço de causa.
- 🏦 **O banco da empresa:** crédito até duas vezes o lucro mais 30% da estrutura, com dinheiro novo; o juro real da Selic sai antes do imposto, e 10% da dívida sai por ano; a dívida sai do valor.
- 📖 **Quatro histórias do mercado** e a folha Dinheiro com a disputa, a dívida e o limite do banco.
- 📊 **No túnel** (10.000 vidas): as contas fecham em 4,09 milhões de entradas; bilionário feito 0,79%; quebram 25,2% de quem abre empresa; saturação V5 52,4% e V20 87,6%; 908 histórias por 1.000 vidas; toques 477,2.

---

## 💵 $ · O dinheiro existe · 02/11/2026

> [!NOTE]
> O pedido do dono (02/11): que cada real exista de fato, com emissão monetária de fato, e que o dinheiro tenha de onde vir e para onde ir.

- 🏦 **As contas do país** (`moeda.ts`): as empresas e as famílias, os bancos, o governo, o Banco Central e lá fora são entidades com saldo. Todo dinheiro que vem de fora da vida sai de uma delas, no mesmo lançamento, e a soma de todo o dinheiro do mundo é zero (o túnel trava o contrário, entrada por entrada e no fim de cada vida).
- 🖨️ **O dinheiro nasce e morre:** o crédito dos bancos cria dinheiro, e o empréstimo que volta o destrói; o Banco Central emite para o governo ou enxuga, pela nova política da moeda (contida, regular, impressora); a inflação come o dinheiro de todo mundo e vai para quem emitiu.
- 🔥 **O dinheiro que sobra vira inflação** e aquece o crescimento do ano seguinte; o crédito desfaz metade do excesso por ano. No A/B: contida 3,5% de inflação, regular 4,9%, impressora 9,2%.
- 📖 **Três histórias do dinheiro** e a folha País com o dinheiro circulando, a emissão do ano e o que a inflação levou.
- 📊 **No túnel** (10.000 vidas): o dinheiro fecha nas 4,09 milhões de entradas, e a soma do mundo dá zero no fim de toda vida; saturação V5 52,1% e V20 87,6%; 911 histórias por 1.000 vidas; toques 478,2; CPU 130 ms por vida (eram 124).

---

## 🏭 H · A empresa de verdade · 01/11/2026

> [!NOTE]
> O pedido do dono (01/11): um simulador de negócios de verdade, com caixa, produto, mercado, e decisões que mexem na economia, nos personagens e na política.

- 💰 **O negócio** (`negocio.ts`): caixa com contraparte, clientela, estrutura com um ano de obra, preço, salário, qualidade, marca, marketing, P&D, imposto de 25% do lucro, dividendos tirados do lucro e o valor pelos fundamentos (na bolsa, com o humor do mercado).
- 📉 **A quebra por causa:** dois anos seguidos no prejuízo, com o caixa que não pagou as contas no segundo; a folha avisa no primeiro. Quebram 22,8% de quem abre empresa (eram 29%, por sorteio).
- 🌍 **O mundo reage:** os empregos no desemprego da cidade, o imposto na dívida do país, o dólar do ano no caixa, a sanção que fecha a exportação com a causa, a fama na marca; a mídia própria vende publicidade e dá influência, e o aluguel sente a vacância.
- 📖 **15 histórias do negócio**, e o valor que as antigas mexiam agora passa pelo caixa e pela estrutura; pôr dinheiro do bolso é um aporte de verdade.
- 📊 **No túnel** (10.000 vidas): as contas fecham em 4,09 milhões de entradas; bilionário feito 0,59% (era 0,81%); saturação V5 52,5% e V20 87,7%; 909 histórias por 1.000 vidas (eram 913); toques 478,6 (eram 464); CPU 124 ms por vida (eram 125).

---

## 🌱 Ω · Vidas que contam uma história · 01/11/2026

> [!NOTE]
> O pedido do dono (26/10): "faça o que for preciso e só atualize o jogo quando voltar com algo que de fato se compare com um jogo muito bem construído… me surpreenda, esse jogo está muito repetitivo". A auditoria (`docs/auditoria-omega.md`) achou o limite nas pessoas, na voz delas e na falta de vontade e de segredo; o salto veio em seis camadas, e a `main` recebe todas juntas.

- 👥 **Ω1 · A rede** (`pessoas.ts`, `relacoes.ts`, `familia.ts`):
  - a pessoa tem identidade (um número e quem ocupou cada papel desde quando): o amor que vai embora vira ex (até três), continua vivendo e pode voltar; a memória e a opinião são da pessoa;
  - os irmãos nascem com a família (os mais novos nos primeiros anos) e vivem ao fundo (o casamento, os filhos, a mudança), como convite quando estão perto e como notícia quando estão longe;
  - o colega e o chefe chegam com o emprego e saem com ele; o chefe pesa na promoção e na demissão; até três amigos, o de infância e os da vida adulta;
  - o namoro sem casamento esfria, e quem joga decide: salvar, terminar ou deixar morrer.
- 🗣️ **Ω2 · A pessoa decide** (`decisao.ts`, `promissorias.ts`):
  - quando a resposta é de uma pessoa (`"teste": { "decide": … }`), ela decide pelo vínculo, pela confiança, pela mágoa, pelo traço, pelo que acha de você, pelo que você já deu e pediu, pelo dinheiro que tem e pela distância, e o desfecho diz o porquê, apontando a entrada que pesou;
  - o empréstimo entre pessoas é uma promissória: parcela, vencimento, atraso que magoa, calote que vira a pior lembrança e quitação que vira confiança;
  - os verbos sociais: dar uma força, pedir socorro, o cupido, a mudança.
- 🎯 **Ω3 · Os planos** (`projetos.ts`, a folha Planos): nove planos como conteúdo, com etapas que são o estado da vida, o que ajuda em cada uma, a meta e o prazo; o fim vai para a linha do tempo com o começo de causa, e o mundo apoia o plano de pé com histórias próprias.
- 🤫 **Ω4 · Os segredos** (`segredos.ts`, `59-segredos.json`):
  - o caso, a dívida escondida, a festa que era estudo e o esquema por fora: o alvo leva `escondido_<tema>` e quem sabe, `sabe_<tema>`;
  - todo ano, quem sabe pode contar pelos círculos (a família e o par; os amigos, o par e os irmãos; os ex e os amigos; o colega e o chefe), e quem fica sabendo perde confiança em você;
  - a notícia que chega ao alvo vira revelação no mesmo ano, com quem contou (`{fonte}`) e o porquê; a chantagem, a confissão e o desabafo; quem sabe pesa o segredo nas decisões.
- 📖 **Ω5 · Os capítulos e o caminho não tomado** (`capitulos.ts`, `caminho.ts`):
  - a peneira reconhece seis arcos no livro (o plano, o segredo que veio à tona, o amor que voltou, o calote, o favor devolvido, as pazes), que a linha do tempo e o cartão mostram;
  - a interface grava a vida como comandos; no cartão, "E se tivesse escolhido outra coisa?" refaz a vida igual até a escolha, troca a opção e deixa um robô com o jeito de quem joga seguir dali.
- 🌬️ **Ω6 · O ritmo e a medida:** depois de um ano pesado, as histórias leves ganham a vez; o túnel mede a variedade pelo caminho (as causas dos pontos de virada e os capítulos) e os elos de causa distintos.
- 🔧 **Defeitos corrigidos:** o plano "cuidar da saúde" era impossível (2 conquistas em 3.384 tentativas) e virou 66 em oito anos; o falso dilema do casamento dos outros; a conferência das promissórias que se compensam.

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
