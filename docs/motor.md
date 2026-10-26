# O motor

Código em `src/motor/`. Puro: não toca em DOM nem em disco; recebe o conteúdo já lido e um estado, e muda o estado. A interface clona o estado antes de cada passo; o túnel de vento muta direto (é mais rápido).

## Estado (`EstadoVida`, em `tipos.ts`)

- **Entidades** (`entidades`): `eu`, `mae`, `pai`, `avo`, `amigo`, `lugar`, `pais` e os quatro países de fora (`federacao`, `celeste`, `liga`, `pacto`) nascem com a vida; `amor`, `filho`, `paixao`, `pet` e `empresa` são criados por efeitos (ou, as empresas, pela folha Dinheiro). Os filhos têm id estável, na ordem de chegada: `filho` e depois `filho2` a `filho4` (um filho novo não toma o lugar de outro; `eu.filhos` conta quantos a vida teve); o conteúdo escrito para o papel `filho` vale para cada um. As empresas de quem joga ocupam `empresa` (a que ele cuida de perto, a de que o conteúdo fala) e `empresa2`…`empresa5` (as outras do grupo); só `empresa` é caminho do conteúdo. Cada entidade tem `id`, `tipo` (pessoa, animal, lugar, jurisdição, empresa), nome, gênero, nascimento, vivo/morte e três mapas:
  - `n`: campos numéricos (saúde, felicidade, inteligência, aparência, vínculo, dinheiro, as cinco classes investidas, dívida, renda, custo, classe e irmãos de origem; na empresa, valor, lucro, tração, participação e retirada…);
  - `t`: campos de texto (ocupação, setor, curso, traço, tipo de família, perfil de investidor, padrão de vida, UF, região);
  - `q`: **qualidades** (as marcas, generalizadas): `nome → { v, ano, idade, causa }`. `causa` é o id da entrada do livro que a gravou.
- **Caminhos** (`campos.ts`): `"mae.saude"`, `"lugar.desemprego"`, `"ator.vinculo"`; sem ponto, é de quem joga (`"fumante"`). O registro de campos diz o tipo, o sistema (corpo, humor, mente, dinheiro, relações, carreira, caráter, origem, mundo, história), os limites, a base e se é derivado (`idade`, `vivo`, `patrimonio`, `investido`, `classe`, `nome`, `genero`, `quem`, `gosto`, `humor`, `lembranca`, `magoa_de`, `empresa.funcionarios`). Um campo com **base** (a confiança, 60) guarda a diferença para ela: o livro fecha e o save antigo vale sem migrar. O `patrimonio` de quem joga soma a parte em cada empresa (`campos.ts › patrimonioTotal`); `eu.empresas` (derivado) conta as empresas do grupo. O que não é campo é qualidade (vale 0 quando não existe).
- **Livro-razão** (`historico`): cada entrada tem tipo (nascimento, evento, ação, personagem, mundo, linha, regra, morte), **causa** (nascimento, escolha, ação, diretor, personagem, regra), o storylet (`ref`), o papel (`ator`), a instância (`storylet#papel`), textos, resumo, as entradas que a tornaram possível (`causas`) e as **mudanças** que ela fez (`{ c: caminho, d: variação | q: ganhou/perdeu | t: texto, r: regra }`). As regras miúdas do ano (economia, idade, vínculos) ficam numa entrada invisível do tipo `regra`.
- **agenda**, **vistos** (idades em que cada instância aconteceu), **pendente** (storylet com escolha esperando o jogador) e **rng** (mulberry32, um inteiro; vai no save).

Só as funções de `livro.ts` mudam números e qualidades, e cada uma anota a mudança na entrada que está sendo escrita. Há teste: nascimento + soma das variações do livro = estado final de quem joga.

## Nascer (`nascer`, `origem.ts`)

A origem é procedural: **8 classes** (extrema pobreza a trilionária; as duas últimas só por escolha ou por um sorteio raríssimo) × **4 tipos de família** (acolhedora, conflituosa, religiosa, empreendedora) × traços. A classe decide patrimônio e renda da casa (sorteados na faixa da classe), chance de desemprego, ocupações dos pais, saúde, idade da mãe e quantos irmãos. O tipo de família decide o vínculo de partida e para onde ele volta, os traços mais prováveis dos pais e, na empreendedora, o negócio da família. Pai ausente é mais comum na conflituosa. A avó pode morar junto; o amigo de infância nasce com a vida. A cidade (55, de todas as regiões) define região, desemprego e custo de vida. Cada ocupação dos pais pertence a um setor (12, de comércio a cultura). O país nasce com um governo sorteado (ou o regime, se a linhagem o trouxe), as políticas dele e as estatísticas perto de onde elas levam, com a sorte do momento. O mundo lá fora nasce junto (`diplomacia.ts › exteriorInicial`): cada país de fora com a economia dele e a relação perto de onde o governo de agora a leva, e o dólar perto de R$ 5. Quem joga ganha um traço (esperto, bonito, forte, ansioso, otimista, tímido, carismático, teimoso) que ajusta os atributos e a felicidade de base. **Criar o personagem é opcional** (nascer continua em um toque): nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos, jeito (o traço) e talentos. Os talentos são pontos: 0 (pouco), 1 (médio) ou 2 (muito) em saúde, inteligência, aparência e alegria, somando no máximo 4; o nível dá a média do atributo, e sobra um terço do sorteio. O nome digitado vira só letras, espaço, hífen e apóstrofo (não vira modelo de texto). **O parto:** 1 em cada 10 nasce prematuro (13% na extrema pobreza, 7% nas famílias ricas, +4 pontos com mãe abaixo de 18 ou acima de 37 anos), com 8 a menos de saúde e a marca `prematuro`.

## Um ano (`avancarAno`)

**O ano é uma lista de etapas declaradas** (fatia 1.3 do universo de bolso). `manifesto.ts › ETAPAS_DO_ANO` diz a ordem das 23 etapas e o que cada uma lê e escreve, em caminhos genéricos:
- a ordem: `exterior`, `guerra`, `pais`, `pesquisa`, `mercado`, `economia`, `empresa`, `bens`, `tesouro`, `dividas`, `privacao`, `corpo`, `personagens`, `trabalho`, `carreira`, `poder`, `coroa`, `padrao`, `regras`, `morte`, `amor`, `iniciativas` e `diretor`;
- os caminhos: `pessoa.saude` vale para qualquer personagem; `bem.*`, `ctr.*`, `tit.*`, `empresa.*` e `fora.*` valem para qualquer bem, contrato, título do Tesouro, empresa e país de fora; `agenda` é o que fica marcado para um ano que vem; `ano.fase`, `ano.mercado` e `ano.economia` são o que uma etapa passa às seguintes sem gravar no estado; `*` é o conteúdo.

`vida.ts › ETAPAS` roda as etapas nessa ordem, e o ano para quando a vida acaba ou o storylet do ano acontece.

`dependenciasDoAno` tira das declarações o que cada etapa lê deste ano (escrito por uma etapa anterior) e o que lê do ano passado (escrito por uma que vem depois). Exemplos: a economia de quem joga lê a inflação deste ano e o salário do ano passado; o poder lê a fama que a carreira deu neste ano. O túnel mostra a tabela inteira, com a CPU e o livro de cada etapa.

`test/ano.test.ts` joga vidas com um gravador (`test/gravador.ts`, um Proxy nas entidades e no que passa entre as etapas, mais o livro e a agenda). O teste falha se uma etapa lê ou escreve o que não declarou, e confere que o gravador não muda a vida.

`observarOAno` liga um observador de antes e depois de cada etapa; só o teste e o túnel o usam.

1. Idade e ano +1.
2. **O mundo lá fora** (`diplomacia.ts`), antes do país daqui. Quatro países fictícios (`mundo.json › estrangeiros`: a Federação do Norte, a República Celeste, a Liga Atlântica e o Pacto do Sul), cada um com o crescimento dele, a relação com o Brasil (0 a 100), o que compra daqui (setores e um peso no que o Brasil vende lá fora) e, às vezes, um rival:
   - **a relação** anda 20% por ano para um alvo, com sorte (3 pontos): a de sempre do país, +5 com a fronteira aberta e −8 com ela fechada (a política de comércio exterior), +15 com quem o governo daqui se aproxima e −15 com o rival desse país (`governos › aproxima`);
   - **a sanção**: abaixo de 35, a chance por ano cresce com o quadrado da distância (3% com a relação em 27, 20% em 15, 60% em zero); acaba quando a relação passa de 38, ou cansa (15% por ano). **O acordo**: com a relação a partir de 70 e a fronteira aberta ou moderada, o governo de turno assina (12% por ano); acaba abaixo de 45. Quando quem joga governa, o acordo é decisão dele. Sanção e acordo são notícias visíveis (tipo `mundo`, o país como ator) que apontam para a decisão que levou a relação até ali: o ato de quem governa ou uma escolha sobre a relação nos últimos dez anos, ou a posse (ou a reeleição) do governo, ou a tarifa, que pôs a postura de agora;
   - **a economia de cada um**: volta para o crescimento dele (60% do desvio fica), com a sorte que o mundo divide (0,5 ponto) e a dele; a crise de lá (1% a 2% por ano, −4 pontos lá) e o boom da Celeste (3%, +3) viram notícias;
   - **o que chega aqui**: a crise de lá tira 3 pontos do crescimento daqui (vezes o peso do país ÷ 0,3, até 1) e põe 2,5 de inflação; o boom soma 2; o que o mundo compra a mais ou a menos soma 0,15 × peso × o desvio de cada um (sem a demanda de quem sanciona); a sanção tira 1,2 × peso por ano e o acordo soma 0,5 × peso. A notícia da crise de fora é a primeira causa da virada da fase daqui;
   - **o dólar** (`pais.cambio`, em reais de hoje): anda 30% por ano para um alvo de R$ 5 que sobe com a dívida acima de 75% do PIB, com as sanções e com a economia daqui abaixo do potencial no ano anterior, e cai com o juro real alto e com o mundo comprando do Brasil; a crise lá fora o faz saltar 16% no ano e o boom o derruba 8%; sorte de 8%. Entre R$ 2 e R$ 15.
3. **A defesa** (`guerra.ts`, bloco E, abaixo): o armamento encomendado chega, e a guerra começa, segue ou acaba; o país do ano já a sente.
4. **O país vivo** (`pais.ts`). Andam doze estatísticas, puxadas pelo ano anterior, pelas políticas de quem governa (`mundo.json › politicas`: impostos, programas sociais, saúde, educação, segurança, comércio exterior, ciência e tecnologia e defesa, cada uma em três níveis), pelo empurrão dos decretos (`pais.impulso`, de −3 a 3, que some pela metade a cada ano), pelo mundo lá fora, pela guerra e pela sorte:
   - **crescimento** (% do PIB): volta 20% por ano para o potencial. O potencial é 2% com as políticas médias; imposto baixo soma 0,5 e alto tira 0,5; a fronteira aberta soma 0,3 e fechada tira 0,4; a escola boa sobe devagar; a tecnologia soma 0,02 por ponto acima de 50; dívida acima de 90% do PIB e violência acima de 25 por 100 mil tiram. Desvio de 1,05 ponto, mais o que vem de fora; com a dívida acima de 100% do PIB, a fuga de capitais (0,2% de chance por ponto acima, até 8%) faz o choque de uma crise. O decreto soma 0,6 × impulso; o juro real acima do neutro freia;
   - **desemprego**: volta para o natural (8,5%, menos com escola boa) e cai 0,45 ponto por ponto de crescimento acima do potencial;
   - **inflação**: metade da do ano passado e metade da meta (4,5%), mais a economia quente, o decreto, a dívida alta, a alta do dólar (0,08 ponto por ponto percentual de alta no ano) e a tarifa (com o tempo, −0,5 ponto com a fronteira aberta e +0,8 com ela fechada);
   - **juros** (Selic): juro real neutro de 4% mais a inflação, mais metade do que ela passa da meta, mais a economia quente e o prêmio da dívida alta;
   - **dívida pública**: sobe com o que o governo gasta acima do que arrecada (políticas, emendas, decretos) e com a recessão, que derruba a arrecadação; acima de 75% do PIB, quem governa corta 5% do excesso por ano. Com ela acima de 100% do PIB, numa recessão ou numa crise (as do ano passado), vem o **calote** com 1% de chance por ponto acima de 100 (até 25%): a economia perde 2 pontos de crescimento e ganha 2 de inflação no ano, a dívida cai um quarto, e a Selic paga 2 pontos a mais, que somem em seis anos (`pais.calote` guarda o ano). Quem perde está em `tesouro.ts`;
   - **pobreza, violência, saúde e educação públicas**: andam 30%, 20%, 15% e 8% por ano para onde as políticas, o desemprego, a pobreza e a dívida levam (a escola leva uma geração). O alvo da saúde ganha 0,2 por ponto de tecnologia acima de 50;
   - **tecnologia** (bloco D, `pais.tecnologia`, de 0 a 100): anda 6% por ano para 50, mais o efeito da ciência (−15 cortada, +15 com a prioridade), mais 0,4 por ponto de escola acima de 50 (uma década para chegar perto). Quem nasce começa em 50 + 0,6 × o efeito da ciência do governo + 0,4 × (escola − 50); o save de antes ganha esse valor e a ciência do governo de agora no primeiro ano, sem sorteio;
   - **defesa** (bloco E, `pais.defesa`, de 0 a 100, a capacidade das Forças Armadas): anda 8% por ano para 50, mais o efeito da política (−15 desmobilizada, +15 reforçada), mais 0,3 por ponto de tecnologia acima de 50 (o armamento moderno vem da pesquisa). O equipamento que chega soma na hora e envelhece de volta para o alvo. Quem nasce começa em 50 + 0,6 × o efeito da defesa do governo + 0,3 × (tecnologia − 50); o save de antes ganha esse valor e a defesa do governo de agora no primeiro ano, sem sorteio;
   - **aprovação do governo**: anda 35% por ano para um alvo feito de crescimento, desemprego, inflação, violência, saúde pública e do que as políticas agradam.
   - **a guerra** (bloco E): com o Brasil em guerra (um país de fora com a qualidade `guerra`), o crescimento perde 1,2 ponto por ano (com a persistência do ciclo, a perda se acumula: nas vidas do túnel, o crescimento dos anos de guerra fica uns 4 pontos abaixo do dos anos de paz), a inflação ganha 2, o governo gasta 2 pontos do PIB a mais (no primário), a população cresce 0,1 ponto a menos e o alvo da aprovação cai 3. A virada da fase para pior aponta o começo da guerra.
   - **o país em números** (bloco A): o PIB (`pais.pib`, em reais de hoje, R$ 11,7 trilhões em 2026) cresce exatamente o crescimento do ano, já arredondado; a população (`pais.populacao`, 213 milhões em 2026) cresce `0,45% − 0,022 por ano depois de 2026` (com piso de −0,35%), mais 0,01 por ponto de saúde pública acima de 50 e 0,006 por ponto de pobreza acima de 25 (`regras.ts › DEMOGRAFIA`). Três números são derivados, sem estado (`campos.ts › indicadoresDoPais`): o PIB per capita; o Gini, `0,52 + 0,005 × (pobreza − 25) − 0,0015 × (educação − 50)`, entre 0,25 e 0,75; e o IDH, a média geométrica de saúde (expectativa de vida `62 + 0,3 × saúde`), educação (`0,4 + 0,0056 × educação`) e renda (log do PIB per capita em dólar, com paridade de poder de compra de 1,6, entre US$ 100 e US$ 75 mil). O alvo da violência passou a ler o Gini (60 por ponto acima de 0,52), o que soma o efeito da educação ao da pobreza. Save antigo: `iniciarNumeros` projeta o PIB e a população de 2026 até o ano do save, sem sorteio.

   A **fase do ciclo** é o nome do crescimento: expansão a partir de 4%, normal a partir de −0,5%, recessão a partir de −2,5%, crise abaixo disso. Para sair de uma fase, há folga (1 ponto na expansão, 0,5 na recessão e na crise); sem ela, o país trocava de fase a cada ano. Fora do normal, a fase é uma qualidade do país (`pais.recessao`) cuja causa é a entrada visível que a anunciou (tipo `mundo`, com o texto do choque de fora quando foi ele). Essa entrada aponta para o decreto que empurrou na mesma direção (até 3 anos antes) e para quem decidiu as políticas que puxam o crescimento (até 8). O que a fase fazia com a vida agora sai das estatísticas (`momentoDoPais`):
   - a chance de demissão é multiplicada por (desemprego / 8,5)^1,8. Quem vive de patrimônio (as ocupações e os papéis de linhagem com `patrimonio`: herdeiro, investidor, banqueiro, dono, fazendeiro) não é demitido nem nasce desempregado: na recessão e na crise, com chance de 12% × (o desemprego da fase − 1) × o ciclo do setor, perde 20% do que tem e do que rende (`regra:perdeu_patrimonio`, com a fase como causa);
   - o salário anda 0,8% por ponto de crescimento acima do potencial, a empresa 2,5% e a poupança da família 2%.

   **Quem governa** é um de quatro blocos fictícios (`mundo.json › governos`: a frente popular, o bloco liberal, a aliança da ordem e o centrão), o regime (quando a linhagem o trouxe) ou quem joga (presidente, monarca, chefe do Regime: os cargos com `governa`).
   - Quem joga só decide pelo país (as políticas, o ato lá fora, a defesa) com o governo e o cargo que governa (`motivoParaNaoGovernar`): quem deixou o cargo no meio do ano (foi reinar na ilha que fundou, caiu, renunciou) não governa mais, e quem o governo de transição substitui aponta a entrada que mudou o cargo.
   - Enquanto a resposta da sucessão está marcada (`sucessao.ts › sucessaoPendente`), quem governava continua governando, inclusive sob o Regime: não há interregno.
   - Na posse, no ano seguinte ao da eleição geral, quem governa fica com chance igual à aprovação + 5% (entre 15% e 85%). Os outros dividem o resto pelo desejo do eleitor: desemprego e pobreza puxam quem tem programa social amplo; inflação e dívida, quem gasta pouco; violência, quem tem segurança linha dura.
   - O voto de quem joga (storylets `primeiro_voto` e `eleicao_geral`, qualidade `voto_<bloco>`) aumenta a parte do escolhido em 4% mais a influência / 250 do que falta, e entra como causa da posse quando ele ganha.
   - Quem assume adota as políticas do bloco. No ano da eleição, quem governa abre os cofres (+0,5 de impulso).
   - Quando quem joga governa, a aprovação do governo é a popularidade dele. Quando ele sai (mandato, queda, renúncia, morte na dinastia) fora da posse, um bloco assume até a próxima eleição.

   **O país na vida de quem joga:**
   - a renda de quem não é pobre ganha ou perde 4% com o imposto;
   - quem ganha menos de R$ 24 mil por ano recebe o auxílio (nada, R$ 1.800 ou R$ 4.800 por ano);
   - a dívida paga 22% ao ano com a Selic média (9,2%) e anda junto com ela; a renda fixa rende o juro real;
   - a mortalidade de quem não é rico (classe até 4) é multiplicada por 1 + (50 − saúde pública) / 120;
   - a violência mata: homicídios por 100 mil × perfil de idade (2 dos 15 aos 24 anos, até 0,45 dos 45 aos 59) × gênero (1,5 nos homens, 0,3 nas mulheres), 40% disso para os ricos. A causa sai das mortes violentas de `mortes.json`;
   - a escola pública (classe de origem até 3) soma (educação − 50) / 40 de inteligência por ano, dos 6 aos 17.
4. **Mercado e economia** (`carteira.ts`, `economia.ts`): o mercado do ano sorteia quanto cada classe de investimento rendeu acima da inflação (renda fixa, ações, fundos imobiliários e cripto, com média e desvio por fase em `mundo.json › ativos`; o dólar rende o quanto o dólar subiu no ano, com um desvio de 2%) e grava em `pais.ret_*`; inflação do país; dinheiro parado encolhe; dívida cresce com os juros do país (22% ao ano com a Selic média), só até o limite de crédito (2 rendas anuais, mínimo R$ 30 mil). Adultos recebem a sobra do ano (renda − custo), e o **padrão de vida** escolhido decide quanto dela vira gasto (simples 35%, confortável 75%, luxo 95%; no máximo 40% para quem deve) e quanto do patrimônio acima de R$ 500 mil se gasta por ano (0%, 2%, 4%). O que o custo passa da renda é o **déficit** do ano: sai da reserva e do crédito, e além do crédito vira privação. Depois dos 65, a velhice consome 4% do patrimônio até R$ 2 milhões e 1% do que passa disso. O mercado tem tamanho: acima de R$ 5 trilhões investidos (`CAPACIDADE_DO_MERCADO`), o excedente não rende.
5. **Empresa** (`empresa.ts`), se quem joga tem uma: o valor anda pela **tração** (o ritmo em que ela vem crescendo, em % ao ano), pela fase do país vezes o quanto o setor sente o ciclo, pelo mundo lá fora (`exteriorNaEmpresa`: a alta do dólar vezes metade da sensibilidade do setor (o agro ganha 0,4 ponto por ponto de alta, o comércio perde 0,2), a tarifa vezes a proteção do setor (a indústria ganha 2% com a fronteira fechada e perde 2% com ela aberta) e a sanção (−8%) ou o acordo (+2%) de quem compra do setor, vezes o peso dele ÷ 0,3) e por sorte (desvio de 30% numa pequena, 20% numa de R$ 500 milhões, vezes o risco do setor). A retirada escolhida (0%, 3% ou 8% do valor por ano) cai na conta, na proporção da parte de quem joga. A tração volta 15% por ano para a do setor, mais o talento (inteligência), menos 3 pontos por década de valor acima de R$ 10 milhões; tocar a empresa (a ficha do ano) soma 1,5 ponto. Abaixo de R$ 5 mil, a quebra é agendada (`empresa_quebrou`), com a fundação como causa. O ganho encolhe perto de R$ 20 trilhões (`TETO_EMPRESA`, o tamanho das maiores do mundo) e some acima disso; a perda vale inteira. Os funcionários são um a cada R$ 150 mil numa empresa pequena e saturam em 3 milhões. **Quem manda** (`empresa.dependencia`, 0 a 100, nasce em 80): o talento de quem joga pesa na tração na proporção da dependência (25% numa empresa que anda sozinha, 100% numa que depende de tudo), a equipe dá até 1 ponto à que anda sozinha, e o freio do tamanho cresce com a dependência (× 1 + 0,8 × (dependência − 0,5)): a mesa do dono tem tamanho. Na morte de quem joga, a empresa perde 0,4 × a dependência do valor (a 80, 32%), numa entrada que tem a morte como causa; quem compra desconta 0,25 × a dependência do preço. Só decisões mudam a dependência. **O grupo** (incremento 9): cada empresa tem o seu ano, e a mesa de quem manda tem tamanho: o talento dele se divide pela soma das dependências (`cargaDaMesa`; duas empresas a 80 somam 1,6, e cada uma recebe o talento ÷ 1,6). A empresa na bolsa (`empresa.na_bolsa`) anda também com o humor do mercado: 0,6 × o que as ações renderam além do esperado para a fase; quem compra não desconta a dependência. Se uma das outras cai abaixo do piso, ela troca de lugar com a que quem joga cuida (o livro anota a troca) e a quebra é agendada com a fundação dela como causa. Subsidiárias (`empresa.subsidiarias`) estão dentro do valor: cada uma vale valor ÷ (subsidiárias + 2).
6. **Envelhecimento:** saúde deriva com a idade; a felicidade volta 12% ao ano para a **felicidade de base** (60 + traço + padrão de vida (−3, 0, +3) + vínculo médio com quem está perto, com teto); inteligência e aparência derivam; qualidades com `porAno` somam efeitos passivos; dívida pesada pesa; patrimônio confortável dá um pouco de paz.
7. **Regras dos personagens** (`familia.ts`), cada um com o próprio estado:
   - envelhecem; adoecem (chance pela idade × traço), saram ou pioram; morrem (Gompertz pela saúde), com luto proporcional ao vínculo, herança (dividida entre os irmãos) e viuvez quando era o amor de um casamento ou de uma união de 5+ anos;
   - mãe e pai perdem e ganham emprego (pelo desemprego do lugar × o do país, conforme o setor sente o ciclo, e pelo traço; servidor não perde) e se aposentam aos 65; guardam dinheiro enquanto trabalham, ele rende com a fase, e gastam depois; na recessão e na crise, o negócio da família pode quebrar (some 60% do que foi guardado), com a fase do país como causa;
   - o vínculo volta devagar para o jeito da família, menos a mágoa, e esfria no ano sem contato da vida adulta (dois anos longe esfriam mais); o casal se desgasta sem cuidado; filho adulto se afasta;
   - **a relação** (`relacoes.ts`, `familia.ts › relacaoNoAno`): a mágoa passa no ritmo do perdão do traço (o generoso perdoa 38% por ano, o rígido 8%), a confiança volta 4% por ano para 60, e o ano longe de quem joga conta em `sem_contato` (quem convive não conta: o casal, os filhos menores, os pais e o amigo da infância). Chegar perto (ganhar vínculo numa entrada) zera os anos sem contato (`storylets.ts › contato`). Magoada, a pessoa briga mais e ajuda menos (`humorDaIniciativa` multiplica a afinidade do traço);
   - **o que a pessoa acha de quem joga** (`relacoes.ts › visoesDe`, o caminho `ator.visao`): sai do que ela viu no livro-razão, com o antigo pesando metade a cada 12 anos. Conta o afeto e a mágoa que quem joga deu a ela, a confiança ganha e perdida, o dinheiro dado (e o gasto com ela a partir de R$ 500) e o pedido, as faltas, e, para o par e os avós, como quem joga trata os filhos. Conta também o que todo mundo sabe (formatura, fama, fortuna nova, cargo, condenação) e o que só quem está perto sabe (o nome sujo, a aposta). As opiniões: orgulho, presente, carinhoso, de palavra, generoso e cuida dos filhos; sumido, metido, interesseiro, cabeça-quente, sem palavra, longe dos filhos, casado com o trabalho e perdido. Saem as duas mais fortes (o que dói pesa 15% a mais), cada uma com a entrada que mais pesou (o porquê). Quem morreu não forma opinião nova. A soma do livro fica guardada por entrada, fora do estado (o livro só cresce): não há campo novo no save, e a opinião é a mesma numa cópia salva e lida. A opinião muda a chance de a pessoa ajudar (quem acha você sumido ou interesseiro procura menos) e de brigar (quem acha você cabeça-quente ou sem palavra briga mais fácil);
   - **a falta** (`familia.ts › faltaNoAno`): alguém próximo (vínculo a partir de 35) passa um ano doente sem que vocês se vejam e sem morar junto. Vira a entrada visível `regra:nao_apareceu`, com a doença como causa: a mágoa sobe 12 mais 12% do vínculo, a confiança cai 10 e o vínculo, 4. A pessoa guarda `nao_apareceu`, que vira a lembrança ruim ("de quando você não apareceu quando ela estava doente"). É uma falta por doença, e vale mesmo se a pessoa sarou no ano;
   - **as vontades** (`mundo.json › vontades`, `familia.ts › vontadesNoAno`): a vontade é uma qualidade `quer_…` da pessoa, e nasce de uma iniciativa dela, no conteúdo. Ela sai de três jeitos:
     - realizada por uma ação de quem joga, que é do conteúdo;
     - realizada pela vida, quando a condição `feita` vale (o casamento, o filho, o bicho, a visita): a entrada `regra:vontade_realizada` aponta de onde a vontade veio e traz +8 de vínculo e −10 de mágoa;
     - perdida quando a pessoa passa da idade `ate`: a entrada `regra:vontade_perdida` é uma falta, com mágoa, e vira lembrança ruim.

     A vontade guardada com `pressa` vira mágoa a cada ano depois de tantos anos (casar, ter um filho, ver o neto);
   - **na morte** de alguém, a relação pesa:
     - morrer com mágoa de 35 ou mais, depois de 4 anos sem contato ou com uma vontade guardada deixa `remorso` (mais tristeza);
     - morrer perto e em paz deixa `despediu`;
     - o texto da morte ganha um fecho pelo que foi a relação (`mundo.json › despedidas`) e diz a vontade que faltou ("Ela nunca viu o mar.").
   Mudanças notáveis (adoeceu, sarou, perdeu o emprego, voltou a trabalhar, aposentou, faliu, morreu) viram entradas visíveis com causa `regra`.
8. **Trabalho de quem joga** (`trabalho.ts`), dos 18 aos 64, com renda: o salário anda com o crescimento do setor e com a fase (vezes quanto o setor sente o ciclo; serviço público e setores estáveis só crescem); negócio próprio balança o dobro, com sorte e azar. Empregado pode ser demitido (2,5% ao ano × desemprego do lugar × o do país × setor): a regra agenda o storylet `demissao` com a fase do país como causa. Negócio próprio, nos anos ruins, pode entrar no aperto (`negocio_no_aperto`). Quem ganha em dólar (`salario_em_dolar`, o trabalho remoto para fora) vê o salário andar com o dólar e não é demitido pela crise daqui; largar o emprego encerra o salário em dólar.
9. **Padrão de vida:** quem tem `padrao_alto` e fechou o ano no déficit, com reserva para menos de 5 anos desse déficit, recebe a conta (`padrao_aperta`, agendado, com a escolha que subiu o padrão como causa).
10. **Morte natural** de quem joga: risco de Gompertz (`0,00003·e^(0,09·idade)`) × `e^((60−saúde)/15)`; saúde zero mata; ninguém passa de 120.
11. **Regra do amor:** quem está sem namoro pode conhecer alguém (chance pela idade × paquera × aparência × traço); a regra agenda o storylet `namoro`, com a última paquera como causa.
12. **Iniciativas dos personagens:** cada personagem pode agir. A chance vem do storylet mais tenso que ele pode fazer, multiplicada pela afinidade do traço (o generoso ajuda mais, o brigão briga mais); tensão 3 age sempre. O storylet sai por saliência. Sem escolha, acontece já (causa `npc`); com escolha, vira candidato do diretor.
13. **Diretor** (`diretor.ts`), um storylet com escolha por ano, nesta prioridade:
   1. agendados vencidos (o primeiro que ainda cabe; os outros esperam um ano);
   2. **marcos** (`marco: true`) elegíveis: a espinha da vida não depende de sorteio;
   3. personagem em crise (tensão ≥ 2);
   4. sorteio com chance de `ritmo(idade)` (30% na primeira infância, 85% dos 13 aos 29, 78% dos 30 aos 49, 68% dos 50 aos 64, 52% depois) entre eventos e iniciativas, por **saliência** = peso × especificidade (1 + 0,25 por cláusula + 0,25 se tem ator) × novidade (memória entre vidas e vezes nesta vida) × tensão × 2 se a causa consultada surgiu há até 2 anos.
14. Sem nada visível no ano, uma **linha curta** de `linhas.json` (por idade e condições, sem repetir as 15 últimas).

Elegível = idade na faixa, ator possível (vivo, salvo storylets sobre quem morreu), condições atendidas e, se não for repetível, nunca visto nesta vida (repetível: respeita o intervalo).

## Contas e contrapartes (`contas.ts`, fatia 1.1 do universo de bolso)

Toda mudança de dinheiro no livro diz a contraparte (`Mudanca.p`): de quem veio ou para quem foi. As mudanças de dinheiro são as que mexem no dinheiro, nas cinco classes investidas ou na dívida de uma pessoa. A contraparte pode ser:
- uma entidade da vida: a mãe, a empresa, um bem;
- uma conta de fora (`CONTAS_DE_FORA`):
  - `mercado`: o setor privado, que paga salário, vende, aluga e compra;
  - `tesouro`: o governo, com imposto, auxílio, aposentadoria, salário de servidor e de cargo público, e o juro da renda fixa;
  - `banco`: o juro da dívida, a parcela e a quitação de financiamento;
  - `parentes`: a parte dos irmãos numa herança;
- `reavaliacao`: preço que mudou sem dinheiro trocar de mão, como a inflação no dinheiro parado e a cotação das ações, dos fundos, do dólar e das criptomoedas.

As contas de fora ainda não são estado: o saldo delas sai do livro. Viram entidades com balanço quando passarem a decidir alguma coisa (Fase 4 de `docs/arquitetura.md`).

**O que muda nas funções do livro e da economia:**
- **`anotar` e `somar`** recebem a contraparte. **`somarRepartido`** soma um total de uma vez e anota as partes, cada uma com a sua contraparte (a herança que vai para quem joga e para os irmãos).
- **`movimentar`** pede `contraparte` (para o dinheiro) ou `fluxos` (o dinheiro repartido por contraparte). Dívida nova ou perdoada é contrato (`dividas.ts`, abaixo).
- **`tirarDeQuemJoga`** pede quem recebe.
- **`economiaDoAno`** faz a mesma conta de antes, mas anota fluxo por fluxo:
  - salário ou aposentadoria;
  - imposto;
  - bico do piso;
  - auxílio;
  - consumo;
  - padrão de vida;
  - gastos da velhice;
  - juros da dívida;
  - juro da renda fixa;
  - inflação;
  - cotação.
- **`anotarCaixa`** anota os fluxos e, sem contraparte, o resto de cada campo: a conversão dentro da mesma pessoa (aplicar, resgatar, pagar dívida com dinheiro), que soma zero.

**Conferência (`conferirContas`), entrada por entrada:**
- toda contraparte é conhecida;
- para cada pessoa, o que não tem contraparte soma zero;
- dinheiro entre duas pessoas aparece nos dois lados.
Ficam de fora a troca de quem ocupa um papel (`saida`, `nascimento`) e os campos que não são caixa. A dívida do país, por exemplo, é um percentual do PIB.

O túnel trava o CI se houver um problema sequer. O teste `test/contas.test.ts` confere vidas sorteadas, pobres, de fortuna, de linhagem e de herdeiro, e prova que a conferência acusa dinheiro sem contraparte e transferência que não volta.

**Extrato (`extrato`, `saldosComOMundo`):** o que entrou e saiu do patrimônio financeiro de quem joga, por fluxo e contraparte, num ano ou na vida inteira; a reavaliação vai à parte. A folha Dinheiro mostra o extrato do ano e o da vida. Save antigo não tem a contraparte nas entradas velhas, e o extrato mostra só o que veio depois.

## Dívidas como contratos (`contratos.ts`, `dividas.ts`, fatia 1.2 do universo de bolso)

Toda dívida de quem joga é um contrato com o banco: uma entidade `tipo: 'contrato'` com saldo, parcela, atraso, modalidade, credor, garantia e a entrada do livro que a fez (`origem`). As modalidades:
- **cheque especial** (`ctr0`): cobre a conta no vermelho; abre no primeiro saque e fecha quando é pago;
- **empréstimo** (`ctr<entrada>`): a dívida que uma escolha fez (o efeito `divida` do conteúdo);
- **financiamento**: o imóvel comprado financiado, com ele em garantia (`garantia: bem<id>`);
- **acordo**: a renegociação, com desconto e parcela (tabela Price, `ACORDO_REAL` em `PRAZO_ACORDO` anos).

`eu.divida` é a soma dos contratos sem garantia, e `bem.financiado`, o saldo do financiamento daquele bem: espelhos que mudam junto com o contrato, na mesma entrada (`mexerNoSaldo`). Quando só o espelho mudou por outro caminho (o caixa acertado), `ajustarSaldo` leva a mudança ao contrato.

**O ano das dívidas:**
1. **Juros** (`jurosDoAno`, dentro de `economiaDoAno`): em dia, o cheque especial e o empréstimo pagam o juro real do momento (a Selic do país); o acordo, o dele; em atraso, a mora (`MORA_REAL`). O financiamento paga `JUROS_FINANCIAMENTO`, em `bens.ts`.
2. **Caixa** (`acertarCaixaDeQuemJoga`): o dinheiro negativo vira saque no cheque especial; o que sobra paga o crédito que gira, o atrasado primeiro, depois o cheque especial e os empréstimos do mais antigo. O acordo e o financiamento só pela parcela.
3. **Parcelas** (`pagarComOQueHouver`): a do financiamento (em `regraDosBens`) e a do acordo (em `regraDasDividas`) saem da conta, dos investimentos e do crédito que sobrar. O que não couber atrasa; paga, o contrato volta a ficar em dia.
4. **Limite** (`regraDasDividas`): quem passou do limite de crédito (`limiteDeCredito`) ou tem dívida atrasada resgata os investimentos para cobrir. O que ainda passa atrasa: o cheque especial e os mais novos primeiro. Ao atrasar, o banco cobra a multa (`MULTA_ATRASO`). Dívida atrasada do crédito que gira só sai do atraso paga, renegociada ou caduca.
5. **Leilão** (`bens.ts › leiloar`): financiamento atrasado `ANOS_PARA_LEILAO` anos seguidos. O banco toma o imóvel, o lance (`LANCE_DO_LEILAO` do valor) paga o saldo, a sobra volta para quem joga e o que o lance não cobre o banco perde.
6. **Caducar:** dívida sem garantia atrasada há `ANOS_PARA_CADUCAR` anos. O banco desiste de cobrar (contraparte `banco`, rótulo `caducou`).
7. **O nome:** `eu.nome_sujo` enquanto alguma dívida estiver atrasada. Sem crédito novo (`creditoNovo` é zero, e o buraco do ano vira privação) e sem financiamento. O motor é o único que escreve a qualidade; o conteúdo lê.

O nome que suja e limpa, a dívida que caduca e o leilão viram entradas próprias no livro (`divida:nome_sujo`, `divida:nome_limpo`, `divida:caducou`, `divida:leilao`), com o porquê. Ele é a entrada que fez a dívida ou, no cheque especial, as que mais sacaram nele. A carta do banco (o storylet `nome_sujo`) chega no ano seguinte ao nome sujo.

**Decisões de quem joga:**
- **Renegociar** (operação `renegociar`, efeito `renegociar` do conteúdo): as dívidas sem garantia viram um acordo. O desconto cresce com o atraso (`descontoDoAcordo`, até 70%), ou é o que o conteúdo der. O nome limpa se nada mais estiver atrasado.
- **Quitar** (operação `quitar`): paga um contrato com a conta e os investimentos.

**Herança:** a partilha paga a dívida sem garantia com o espólio, e o que ela não cobre o banco perde. O financiamento passa ao herdeiro com o imóvel; a abertura da vida nova anota a garantia.

**Save antigo:** a dívida vira o cheque especial (`migrarDividaSemContrato`) e o financiado de cada bem vira o financiamento dele (`migrarFinanciamentos`).

**Conferência** (`contas.ts`):
- **`conferirContratos`**, entrada por entrada: o que mudou nos contratos sem garantia é o que mudou na dívida de quem joga, e o do financiamento é o que mudou no financiado do bem.
- **`conferirDividas`**, no estado: os espelhos batem com os contratos; todo contrato tem credor e todo financiamento tem o bem em garantia.

O túnel trava o CI se houver um problema sequer, nas vidas sorteadas, nas de origem escolhida e nas gerações das dinastias.

## O Tesouro (`tesouro.ts`, bloco B)

Quem joga empresta ao governo comprando um título: uma entidade `tit<entrada>` (tipo `titulo`), da entrada que comprou. O devedor é o tesouro, contraparte de todo real que entra e sai daqui (as contas fecham entrada por entrada).

- **O título:** `valor` (o que volta no vencimento e a base do cupom), `taxa` (% ao ano acima da inflação, já sem o imposto de renda, travada na compra), `vencimento` (o ano) e `origem` (a entrada que comprou, ou a abertura da vida de quem herdou). O nome é o do papel: "Tesouro IPCA+ 2045". `campos.ts › titulosDe` e `valorDosTitulos`; o título entra no patrimônio pelo valor, e no patrimônio que paga o padrão de vida também (emprestar ao governo não esconde a fortuna do gasto).
- **A taxa** de um título de `n` anos comprado hoje (`taxaDoTitulo`): (juro real do ano + 0,05 × n + risco da dívida) × 0,85, com uma casa e piso de 0,5. O risco é 0,05 ponto por ponto da dívida acima de 90% do PIB, até 3.
- **A compra** (folha Dinheiro, `comprarTitulo`, a partir dos 18): sai da conta; 5, 10 ou 20 anos; de R$ 100 para cima; até 5 títulos; e nunca mais de 30% da dívida do país (PIB × dívida) nas mãos de quem joga. Não gasta a ficha do ano.
- **O ano** (etapa `tesouro`, depois dos bens): o cupom de cada título (valor × taxa) cai na conta, com o tesouro de contraparte e o rótulo `cupom`. O que venceu volta numa entrada visível (`tesouro:vencimento`) que aponta a compra ("que você comprou aos 40") ou a herança ("que você herdou").
- **As histórias** também compram: o efeito `comprarTitulo` empresta uma fração da conta, com a entrada da história de causa (o "Investir no Tesouro Direto" do primeiro investimento e da moeda do cachorrinho). Sem como comprar, o dinheiro vai para a renda fixa.
- **A venda** antes do vencimento (`venderTitulo`, ou o efeito `venderTitulos` do conteúdo, que vende uma fração de cada título) sai pelo preço do dia (`precoDoTitulo`): os cupons e o valor que faltam, descontados pela taxa de hoje para o prazo que falta. No ano da compra, o preço é o valor; o juro que caiu depois dá lucro, e o que subiu dá prejuízo.
- **O calote** (`darCalote`, sorteado em `pais.ts`): quem tem título perde 30% do valor (o cupom encolhe junto) e a renda fixa perde 15%, com o tesouro de contraparte; nada mais sai de quem joga. A dívida do país cai um quarto e `pais.calote` ganha a entrada como causa. A entrada é do mundo (`tesouro:calote`) e aponta quem levou a dívida até ali nos últimos doze anos: a decisão mais recente que pôs a dívida para cima (a posse de um governo ou a reforma que corta imposto ou abre gasto, pesadas pelo efeito na arrecadação e no gasto) e o decreto que aqueceu nos últimos quatro. No ano seguinte, o storylet `depois_do_calote` vem agendado, com o calote de causa.
- **A herança** (`herdeiro.ts`): os títulos entram na partilha como o resto do dinheiro (pagam a dívida que a conta e os investimentos não pagaram, e cada um fica com a mesma fração que a conta) e passam a quem herda com ids da abertura (`tit<abertura>`), vencendo na vida nova.
- **A folha País** mostra a dívida em reais (`dividaEmReais`), quanto dela é de quem joga e o risco de calote do ano (`chanceDeCalote`).

## A coroa (`coroa.ts`, bloco C)

Quem tem coroa (o monarca do Brasil, cargo `rei`, e quem é soberano da ilha, cargo `soberano`) escolhe como ela recebe. A forma fica com o país (`pais.coroa`, `ilha.coroa`; vazio é o salário), e quem herda a coroa herda a regra.

- **As formas** (`COROA` em `regras.ts`):
  - o salário da Casa Real é fixo: R$ 4 milhões por ano no Brasil e R$ 500 mil na ilha;
  - a parte dos impostos é uma fatia da arrecadação (`arrecadacaoDe`): 0,01% da do Brasil (o PIB vezes a carga de 33%, mais o que as políticas somam) ou 10% da da ilha (20% do PIB dela);
  - a taxa da coroa é uma fatia do PIB: 0,1% do Brasil, 8% da ilha.
- **A dotação** (`dotacaoDe`) é a renda de quem reina. A etapa `coroa`, depois do poder, a recalcula todo ano, e `acertarDotacao` a acerta na hora quando a forma muda: pela folha (`operarCoroa`), por uma escolha do conteúdo (`"pais.coroa": { "definir": "salario" }`) ou na herança. A economia do ano a paga com o tesouro (no Brasil) ou a ilha de contraparte, com o rótulo `dotacao`.
- **O preço** (`custoDaCoroa`):
  - no Brasil, o ponto para onde a aprovação do governo anda (`pais.ts`) fica 5 pontos mais baixo com a parte dos impostos e 15 com a taxa;
  - na ilha, o mesmo vale para a popularidade de quem é soberano (`poder.ts`);
  - o anúncio também pesa na hora (+3 ao voltar ao salário, −2 na parte dos impostos, −6 na taxa);
  - abaixo de 30, o cargo balança: no Brasil, `queda_do_cargo` (o plebiscito); na ilha, `greve_na_ilha`.
- **A reação ao decreto** vem agendada, com o decreto de causa: a rua contra a taxa (`rua_contra_a_taxa_da_coroa`) ou o barco de mudança, na ilha (`barco_de_mudanca`), de 1 a 3 anos depois; a conta da parte dos impostos (`a_conta_da_coroa`), de 2 a 4.
- **A ilha** (`ilha`, tipo `jurisdicao`, campos `populacao`, `pib`, `pib_per_capita` e `coroa`):
  - nasce do efeito `fundarIlha` (as duas escolhas de "fundar um país"), com o nome "Nova" mais a cidade natal, 2.300 habitantes e R$ 80 mil de PIB por pessoa;
  - todo ano, na etapa `coroa`, a renda por pessoa cresce 2,5% (+1 ponto com o país reconhecido, −1 com a taxa da coroa) e a população cresce 1% (+1 reconhecida, −1 com a parte dos impostos, −4 com a taxa), com sorte;
  - a ilha que passa de 2.600 habitantes agenda `a_ilha_cresceu`, uma vez;
  - sem soberano (quem fundou desceu do trono ou fez a república), a coroa não cobra nada;
  - o save antigo de quem fundou um país (a marca `micronacao` sem ilha) ganha a ilha no primeiro ano;
  - na herança, a ilha passa a quem herda (com a marca `micronacao` e o reconhecimento), e quem era soberano deixa a coroa da ilha: quem herda assume no primeiro ano, ou aos 18 (a sucessão, abaixo).

## A sucessão e o poder que se toma (`sucessao.ts`, bloco F)

- **A fila.** Quem herda a coroa do Brasil, o Regime ou a ilha ganha a qualidade de sucessor (`principe`, `herdeiro_regime`, `herdeiro_ilha`), seja quem for: o filho, o par, o amigo ou o sobrinho (o testamento é a lei da sucessão da dinastia). Quem nasce numa linhagem já nasce na fila.
- **A resposta.** O motor agenda a resposta (`sucessao_coroa`, `sucessao_regime`, storylets só agendados): no primeiro ano da vida nova, ou no ano em que quem herda faz 18 (até lá, a regência: o governo de transição, ou a junta do Regime). Vale também em vida: quando o pai ou a mãe que reinava morre (`pessoas.ts › morrerPersonagem`), a resposta vem no mesmo ano, ou aos 18. A morte (ou a abertura da vida nova) é a causa. O texto diz quem morreu, ou que a regência acabou.
- **A ilha passa sozinha:** na etapa `coroa`, quem herdou assume no primeiro ano com 18 anos ou mais (ou aos 18), com a dotação da forma e a popularidade em pelo menos 55; quem tem outro cargo deixa a ilha com o conselho. A herança é a causa.
- **Sem interregno:** enquanto a resposta está marcada, quem governava continua (acima, em Quem governa). Quem abdica devolve o governo: no ano seguinte, o governo de transição.
- **Quem tem cargo vive dele:** nem o setor nem a demissão o alcançam (`trabalho.ts`), e a carreira para (`carreira.ts`); com a coroa ou o Regime, ela fica para trás, numa entrada com a posse de causa. Sob o Regime, não há eleição geral (`poder.ts`).
- **O poder que se toma** são jogadas da folha Carreira e poder (`"folha": "poder"`, `99-tomar-o-poder.json`): ficar no poder (quem é presidente fecha o Congresso pela popularidade, ou muda a Constituição pela influência para mais quatro anos), tomar o poder (quem tem influência 60 lidera os quartéis, se for coronel ou general, ou financia os generais com R$ 20 bilhões) e restaurar a monarquia (quem é famoso e tem R$ 10 bilhões banca o plebiscito). Dá certo: o cargo vitalício, o Regime (ou a coroa) e a marca `golpista`; dá errado: a queda, ou a cadeia. Sob o Regime, quem joga governa com a postura dele lá fora (`diplomacia.ts › posturaDoGoverno`): a Federação esfria, a Celeste esquenta, e a sanção que vier aponta o golpe.

## A defesa e a guerra (`guerra.ts`, bloco E)

Quem governa decide quanto o país gasta com as Forças Armadas e o que encomenda; a capacidade dissuade, e a guerra é um processo com custo, não um ato.

- **A política "Defesa"** (`mundo.json › politicas › defesa`): desmobilizada, regular ou reforçada.
  - O gasto anda −0,3, 0 e +0,5 ponto do PIB, no primário, como a saúde e a ciência. Armar-se preocupa os vizinhos: a relação com os países de fora anda +2, 0 e −3 (somada à tarifa no alvo da relação). A farda dá um pouco de aprovação (−1, 0 e +1).
  - Cada bloco tem o seu nível: a aliança da ordem e o Regime reforçam, a frente popular desmobiliza, o bloco liberal e o centrão ficam no regular. A cautelosa no poder fica no regular; a arriscada reforça.
  - A vaga e a promoção de militar andam com a verba da defesa (`carreiras › verba`), como as de cientista com a da ciência.
- **Os sistemas de armamento** (`mundo.json › sistemas`): os caças (0,6 ponto do PIB, +6 de capacidade, 3 anos), o submarino (0,8, +7, 5 anos), a defesa antiaérea (0,3, +3, 2 anos) e o satélite militar (0,4, +4, 3 anos, pede tecnologia 55).
  - Quem governa encomenda um por ano pela folha País (`{ tipo: 'sistema', sistema }`, entrada `defesa:sistema:<id>`); o mesmo sistema, só depois da entrega. A encomenda soma o custo à dívida na hora.
  - A entrega (etapa `guerra`) é uma entrada do mundo (`defesa:entrega:<id>`) que soma a capacidade, com a encomenda de causa; as encomendas que ainda não chegaram saem do livro (`encomendasPendentes`), sem estado novo.
- **A ameaça e a dissuasão** (`ameacaDeGuerra`, `chanceDeGuerra`): um país de fora que sanciona o Brasil, com a relação abaixo de 25, ameaça; com mais de um, o mais frio. A chance de a guerra começar no ano é 5%, dobrando a cada 15 pontos de capacidade abaixo de 50 e caindo à metade a cada 15 acima, até 25%. Depois de uma guerra, 10 anos sem outra.
- **O começo** (etapa `guerra`): a notícia (`guerra:guerra:<país>`, tipo `mundo`, o país como ator) aponta a decisão que esfriou a relação (`diplomacia.ts › causaDaRelacao`: o rompimento, a posse, a tarifa) e, com a capacidade abaixo de 45, a que desmobilizou o quartel nos últimos 15 anos (`pais.ts › decisaoQueDeixou`). A guerra é uma qualidade do país de fora (`fora.guerra`, com a notícia de causa); `pais.guerra` é derivado (o Brasil está em guerra) e `campos.ts › inimigoDe` acha com quem. No primeiro ano, o país se une: a aprovação sobe 5 na hora (a popularidade, se quem governa é quem joga). A convocação chega a quem joga com 18 a 30 anos, sem cargo (`a_convocacao`, com o país de ator), e ao filho mais velho nessa idade (`filho_convocado`), agendadas no ano, com a guerra de causa.
- **Os anos de guerra**: o custo está no país vivo (acima). A sanção do inimigo não acaba enquanto a guerra dura, e quem governa não visita, não assina nem rompe com ele: só pede a paz.
- **O fim**: a partir do segundo ano, 25% de chance por ano, 50% no ano seguinte a um pedido de paz (`{ tipo: 'paz' }`, entrada `defesa:paz`, um por ano, só de quem governa: a relação com o outro lado sobe 5); no oitavo ano, ela acaba de cansaço, em cessar-fogo. O desfecho sai da razão entre a capacidade daqui e a força de lá (`estrangeiros › forca`: a Federação 90, a Celeste 85, a Liga 70, o Pacto 45): 60% das guerras acabam decididas, vitória ou derrota nessa proporção; o resto é cessar-fogo (`chancesDoFim`, que a folha mostra antes).
  - Vitória: o outro lado recua, a sanção acaba, a relação vai a 30 e a aprovação sobe 6.
  - Derrota: a reparação soma 4 pontos do PIB à dívida, a sanção acaba, a relação vai a 30 e a aprovação cai 8.
  - Cessar-fogo: ninguém assina nada, a sanção continua e a relação vai a 22.
  - A notícia do fim aponta o começo e o pedido de paz.
- **A herança**: o país, a guerra em curso e a sanção passam a quem herda como estavam (a qualidade aponta a abertura da vida nova). O armamento que quem governava encomendou e ainda não chegou entra na capacidade do país herdado: o livro novo não tem a encomenda, e o que foi pago não se perde.
- **O tom**: abstrata e sem glorificação. Ninguém morre num storylet de guerra; a guerra mata pela estatística do país e deixa a dívida, a inflação e quem voltou diferente (a marca `veterano`, com epitáfio e o storylet `o_veterano`).

## O Estado pesquisa (`pesquisa.ts`, bloco D)

Quem governa decide quanto do orçamento vai para a ciência, e o que ela compra volta uma década depois.

- **A política "Ciência e tecnologia"** (`mundo.json › politicas › pesquisa`): cortada, regular ou prioridade.
  - No regular, o governo põe 0,5% do PIB em pesquisa (`PESQUISA.base`); a ciência cortada tira 0,2 ponto do gasto, e a prioridade soma 0,4. O gasto entra no primário, e a dívida anda com ele. `gastoEmPesquisa` dá os pontos e os reais, que a folha País mostra.
  - Cada bloco tem o seu nível: a frente popular e o Regime pesquisam como prioridade, o bloco liberal corta, a aliança da ordem e o centrão ficam no regular. A cautelosa no poder põe a ciência como prioridade; a arriscada corta.
- **O estoque** é `pais.tecnologia` (o país vivo, acima). O que ele faz:
  - o crescimento potencial ganha 0,02 ponto por ponto acima de 50, e o alvo da saúde pública, 0,2;
  - a tração das empresas sobe com ele (`setores › pesquisa`, por ponto acima de 50): tecnologia 0,04, saúde e indústria 0,02, agro 0,015;
  - a carreira que a ciência paga (`carreiras › verba`: a de cientista) tem a vaga e a promoção vezes 0,5, 1 ou 1,6 pelo nível da política (`VERBA_DA_CARREIRA`).
- **A etapa `pesquisa`** (`regraDaPesquisa`, depois do país):
  - acima de 55 de tecnologia, a chance de uma descoberta é de 0,8% por ponto por ano, com no máximo uma a cada 4 anos e o mesmo tipo a cada 15. A cura põe a saúde pública 4 pontos acima, o satélite põe a aprovação 3 pontos acima (a popularidade, se quem governa é quem joga), e a patente soma 2 à tecnologia;
  - a descoberta é uma entrada do mundo (`pesquisa:<tipo>`, com o texto de `mundo.json › noticias`). A causa é `causaDaPesquisa`: a decisão mais recente, nos últimos 30 anos, que deixou a ciência como prioridade (a reforma que a pôs ali ou a posse do governo que a manteve), mesmo desfeita depois, porque a tecnologia ainda carrega o que ela fez (`pais.ts › decisaoQueDeixou`, que a guerra também usa para a desmobilização). O país em que se nasce não tem decisão;
  - a descoberta chega à vida de quem joga no ano seguinte, agendada com ela de causa: `a_vacina_no_posto` (de 12 anos em diante), `satelite_na_tv` (de 6 a 17) e `socio_da_patente` (de 25 a 75);
  - com a ciência cortada e a tecnologia abaixo de 42, a fuga de cérebros (12% por ano, no máximo uma a cada 10 anos) tira 3 pontos de tecnologia, com o corte de causa.
- **Ler a política é consultar quem a decidiu:** `causasDe` põe entre as causas do storylet que pede `pais.pol_*` a última decisão sobre ela (`entradaQueDecidiu`: a posse ou a reforma, nunca uma regra).
- **As jogadas somam ao estoque:** a cura paga (+3) e o foguete em órbita (+2); liberar a fórmula da cura soma 2 à saúde pública.

## As fichas do ano (`acoes.ts`)

Criança faz uma coisa por ano; adolescente, duas; adulto, três; depois dos 65, duas (`regras.ts › fichasDoAno`). Seis verbos (estudar, trabalhar extra, cuidar da saúde, ver a família, sair, poupar); tocar num verbo abre **todas as ações possíveis dele agora**, da que mais combina com o estado (mais cláusulas, mais peso, menos repetida) para a que menos combina, e o jogador escolhe. Com uma ação só, o toque já age. A mesma ação não se repete no mesmo ano. Quando as fichas acabam, o ano passa.

## Folhas sem ficha (`carteira.ts`, `empresa.ts`, `bens.ts`, `carreira.ts`, `poder.ts`, `herdeiro.ts`)

Decisões do jogador que não gastam ficha (entrada de tipo `dinheiro`, causa `acao`, com o grupo no `ref`):

- **Dinheiro:** aplicar e resgatar, perfil de investidor, padrão de vida.
- **Empresa** (cada operação diz qual, pelo lugar): abrir (até cinco de uma vez), aportar, retirada, vender, comprar uma concorrente por ano (30% do valor da empresa; o preço justo não cria valor, a tração sobe 2 pontos; ela vira subsidiária, com as subsidiárias dela, ⌊√(preço ÷ R$ 1 milhão) ÷ 2⌋; três compras fazem um truste, +5 de tração e investigação do órgão de concorrência), vender subsidiárias (uma até dez, depois um décimo, pelo preço da fase), fundir (a absorvida vira subsidiária; valores somados com 8% de ganho no mesmo ramo ou 2% de desconto em ramos diferentes, ± 8% de sorte; parte, dependência e tração viram a média pelo valor; no mesmo ramo conta como compra para o truste, em ramos diferentes vira o "Grupo {sobrenome}"; o sustento de quem joga passa para a que fica), abrir o capital (a partir de R$ 100 milhões, fora da recessão e da crise: o valor sobe 20%, quem joga vende 20% da parte dele pelo preço da fase e a dependência cai 15) e cuidar de perto (troca a empresa de lugar com a principal). Vendida ou fundida a principal, a maior das outras toma o lugar.
- **Bens** (`mundo.json › bens`, entidades `bem<id>`): comprar à vista ou financiar imóvel (20% de entrada, parcela fixa de 8% do preço ao ano, juros de 7%), morar (tira até 30% do custo de vida), alugar e vender (6% de custo no imóvel). Todo ano: o imóvel anda com o mercado de imóveis acima ou abaixo da média dele em todas as fases (o ciclo não tira nem põe valor no longo prazo; fica a valorização própria de cada imóvel), carro perde valor, manutenção e parcela saem, aluguel entra anotado à parte (`r: 'aluguel'`) para aparecer no chip do ano. O balanço do ano conta o valor dos bens menos o que falta pagar. Conforto vira felicidade de base (com teto); status vira influência.
- **Carreira** (`mundo.json › carreiras`): tentar uma vaga por ano, com requisitos (as condições dos storylets) e chance pelo talento e pelo desemprego do país; cargos com salário entre o primeiro e o último; a chance de subir cai a cada degrau (×0,8, e ×0,45 nas profissões de palco); fama nas profissões de palco; atleta e modelo têm idade para parar. Um storylet que muda o emprego encerra a carreira.
- **Poder** (`mundo.json › cargos`): no Executivo (prefeito, governador, presidente), dois mandatos seguidos (`seguidos`), contados do livro pela mesma frase que diz "para o 2º mandato"; o terceiro aparece desabilitado com o motivo, e um mandato fora libera. Quem tem cargo não faz bico, entrega nem trabalho grande. A influência anda 25% por ano para um alvo de patrimônio, bens, fama, cargo, empresa grande e linhagem; eleição municipal nos anos múltiplos de 4 e geral dois anos depois, com campanha paga e chance pela influência, aparência e popularidade (a imagem pública, que pesa em toda eleição; o mandato começa com ela mais 5, entre 45 e 90); o mandato acaba sozinho (o último ano é ano de eleição). Quem governa tem popularidade: nos cargos que não governam o país, ela anda com a fase; no que governa, é a aprovação do governo (`pais.ts`). Abaixo de 30, o cargo balança (`queda_do_cargo`). Coroa e Regime são cargos vitalícios dados pelo conteúdo (a sucessão, o golpe, a coroa restaurada); sob o Regime, não há eleição geral, e quem tem cargo não é demitido. Decretos são storylets que escrevem `pais.impulso`, que empurra o crescimento, a inflação e a dívida.
- **País** (`pais.ts`, folha País): quem governa muda uma política por ano (`{ tipo: 'politica', politica, nivel }`); a aprovação sente na hora (o que se tira dói, o que se dá agrada), e as estatísticas, nos anos seguintes. A folha mostra cada estatística com a seta do ano e para onde caminha com as políticas de agora.
- **Lá fora** (`diplomacia.ts`, folha País): o dólar com a seta do ano e cada país de fora (a relação em palavras, o crescimento, sanção, acordo, crise; tocar abre o que ele compra do Brasil, o rival e a chance de sanção). Quem governa faz um ato por ano (`{ tipo: 'diplomacia', parceiro, acao }`): a visita de Estado (+15 na relação, −8 na do rival dele), o acordo comercial (relação a partir de 60, fronteira aberta ou moderada, sem sanção) e o rompimento (−40 na relação, o acordo acaba e a popularidade sobe 4 agora; a folha mostra a chance de sanção que fica).
- **Testamento:** para quem vai tudo (a lei: os filhos dividem, e o mais velho continua; senão, um sobrinho; ou um filho escolhido, o par, o melhor amigo, os sobrinhos, uma causa, o bicho).

## Dinastia (`herdeiro.ts`)

Quando a vida acaba, a história continua com quem herda: pelo testamento, o par (que herda tudo, sem metade separada, e começa viúvo, com o filho do casal) ou o melhor amigo (com o próprio sobrenome e a própria família); pela lei, o filho mais velho vivo (com os irmãos levando a parte deles, como a metade do cônjuge sai, e entrando na vida nova como os irmãos de quem herda) ou, pelo testamento, o filho escolhido, sem dividir; sem filho, um sobrinho (gerado de uma semente da própria vida, sem gastar o sorteio). Testamento para uma causa ou para o bicho encerra a história. A partilha paga as dívidas com o espólio, separa a metade de quem era casado (quando o par não é o herdeiro), 4% de imposto e o quarto do testamento solidário; as empresas e os bens passam ao herdeiro (a primeira empresa é a que ele cuida de perto), e só o que a conta não cobre sai da parte em cada empresa, na mesma proporção, e, depois, dos bens mais baratos. A coroa, o Regime e a ilha passam a quem herda, seja quem for (`sucessao.ts`): a resposta é o primeiro capítulo, ou vem aos 18. A primeira entrada conta a herança e é a causa do estado inicial.

## Linhagens (`origem.ts`)

No começo em um toque, 20% das vidas nascem numa linhagem (`mundo.json › linhagens`): família real (neste mundo, o plebiscito de 1993 deu monarquia), família do Regime, família famosa, do futebol, de políticos, do agro, de circo, imigrante, militar. A linhagem fixa a classe, dá qualidades a quem nasce e ao pai ou à mãe que a carrega, ao país (monarquia, regime), influência e fama iniciais e um texto de nascimento próprio. Quem escolhe a origem escolhe a linhagem (ou nenhuma).

## Escolha (`escolher`)

1. Aplica os `efeitos` da escolha.
2. Se houver `teste`, sorteia sucesso ou fracasso: `chance` fixa, ou `0,5 + (valor − dificuldade) / 50` (o valor pode ser qualquer caminho), entre 5% e 95%.
3. Aplica os efeitos do desfecho e lança a entrada: textos, escolha, desfecho, resumos, causas e mudanças.
4. Efeito `morte` ou saúde zerada encerram a vida (a entrada que matou vira causa da morte).

## Pontos de virada (`virada.ts`)

Cada entrada aponta as causas (a entrada que gravou cada qualidade consultada e a que a agendou). Para cada escolha, ação ou iniciativa de personagem, somam-se os descendentes (transitivos), pesados pelo impacto de cada um (atributos, patrimônio, renda, vínculos, mortes); causas do jogador pesam 25% a mais. As três mais pesadas viram os pontos de virada do cartão, cada uma ligada à consequência que melhor conta a história (impacto × distância no tempo): "aos 16, você começou a namorar Leonardo → aos 44, pagou a festa de formatura de Gabriela".

**O porquê na linha do tempo** (`porqueDe`): o que acontece com quem joga (eventos, iniciativas dos outros, a morte) mostra a causa direta de um ano anterior que se conta numa frase, a do jogador antes da do mundo e a mais recente primeiro: "Porque aos 15, você deu a primeira tragada num vape." As ações e as operações das folhas não mostram: quem joga sabe por que fez. Cerca de 1 acontecimento em 5 aponta para a sua causa.

## Memória entre vidas (`memoria.ts`)

Ao fim de cada vida, cada instância que apareceu soma 1 à recência, e a recência de todas decai pela metade. Na saliência, o peso é dividido por `1 + 4 × recência`. Nada some; só cede a vez. A memória também guarda as ações já feitas: a partir da segunda vida, ação nunca feita aparece como "novo".

## Robôs do túnel (`robos.ts`)

- **primeira:** sempre a primeira opção disponível; na ficha, o primeiro verbo; nunca abre a folha Dinheiro.
- **aleatória:** sorteia entre as disponíveis (inclusive não agir); sorteia perfil e padrão aos 18, aplica em um ano a cada cinco, às vezes abre uma empresa com capital sorteado e às vezes vende na velhice; com empresa, raramente abre outra, funde duas, abre o capital, vende subsidiárias ou troca a que cuida; no governo, um ato lá fora sorteado em 15% dos anos, um sistema de armamento sorteado em 8% e, em guerra, o pedido de paz em metade dos anos.
- **No empate em tudo** (o mesmo risco e o mesmo valor esperado: o voto, o amigo em apuros), a cautelosa e a arriscada sorteiam com o rng do robô; fora do empate, o sorteio não anda. **Os dilemas** (`falsosDilemas`, `arriscarNaoCompensa`) se medem em três bolsos de adulto (R$ 1 mil, R$ 10 mil e R$ 50 milhões na conta) e, se o storylet pede empresa, com uma de R$ 1 milhão; o "arriscar nunca compensa" divide pelos storylets com 2 ou mais opções sem condição e alguma com risco.
- **O poder que se toma** (as jogadas da folha Carreira e poder), para quem é presidente no fim do mandato ou tem influência 60 ou fama 50: a cautelosa recusa (a última opção) em 10% dos anos, a arriscada tenta a primeira que cabe em 35% do que tem em 25% e a aleatória sorteia em 10%.
- **cautelosa:** menor risco; empate, maior valor esperado. Conservadora e simples aos 18; aplica a sobra de três em três anos com um ano de reserva; vende aos 65 as empresas que a vida lhe deu. No governo, assina o acordo que dá e visita o país mais frio quando a relação cai abaixo de 45; pede a paz assim que pode e, com ameaça à vista e o quartel abaixo de 60, encomenda o sistema mais barato.
- **arriscada:** maior risco; empate, maior valor esperado. Arrojada e no luxo aos 18; abre uma empresa entre os 22 e os 45 anos com metade do que tem, reinveste tudo e nunca vende; compra concorrentes quando o dinheiro dá, abre o capital na economia aquecida e, com a primeira acima de R$ 20 milhões, abre uma segunda em outro ramo. No governo, fecha a fronteira, reforça a defesa e encomenda caças sempre que pode; com a popularidade abaixo de 40, rompe com o país mais frio (abaixo de 50); nunca pede a paz.

Valor de um desfecho: atributos ponderados (saúde 1,2; felicidade 1; inteligência 0,6; aparência 0,5) + dinheiro (R$ 2 mil = 1 ponto; renda e custo com 5 anos de horizonte, inclusive por fator e pelo padrão proporcional ao patrimônio; investir vale o rendimento de 10 anos, e resgatar perde o mesmo; na empresa, o que muda na parte de quem joga, e a tração pelos anos em que ela dura) + vínculos (3 pontos = 1) + efeito passivo de qualidades novas (10 anos) − 200 se mata. Risco: desvio-padrão do valor entre os desfechos + exposição (saúde perdida, inclusive por qualidade; dívida; perda de patrimônio; chance de morrer).

Uma estratégia fixa que vence as outras em idade média de morte, patrimônio mediano e felicidade média ao mesmo tempo é **dominante**: o jogo teria resposta certa, e o túnel falha.

## Determinismo

Mesma semente e mesmas decisões dão a mesma vida, mesmo salvando e recarregando a cada passo (há teste, com a ficha do ano). A interface sorteia a semente com `crypto.getRandomValues`; o túnel deriva as suas de uma semente fixa, então `docs/metricas.md` só muda quando o motor ou o conteúdo mudam.
