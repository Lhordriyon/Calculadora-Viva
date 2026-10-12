# O motor

Código em `src/motor/`. Puro: não toca em DOM nem em disco; recebe o conteúdo já lido e um estado, e muda o estado. A interface clona o estado antes de cada passo; o túnel de vento muta direto (é mais rápido).

## Estado (`EstadoVida`, em `tipos.ts`)

- **Entidades** (`entidades`): `eu`, `mae`, `pai`, `avo`, `amigo`, `lugar`, `pais` e os quatro países de fora (`federacao`, `celeste`, `liga`, `pacto`) nascem com a vida; `amor`, `filho`, `paixao`, `pet` e `empresa` são criados por efeitos (ou, as empresas, pela folha Dinheiro). As empresas de quem joga ocupam `empresa` (a que ele cuida de perto, a de que o conteúdo fala) e `empresa2`…`empresa5` (as outras do grupo); só `empresa` é caminho do conteúdo. Cada entidade tem `id`, `tipo` (pessoa, animal, lugar, jurisdição, empresa), nome, gênero, nascimento, vivo/morte e três mapas:
  - `n`: campos numéricos (saúde, felicidade, inteligência, aparência, vínculo, dinheiro, as cinco classes investidas, dívida, renda, custo, classe e irmãos de origem; na empresa, valor, lucro, tração, participação e retirada…);
  - `t`: campos de texto (ocupação, setor, curso, traço, tipo de família, perfil de investidor, padrão de vida, UF, região);
  - `q`: **qualidades** (as marcas, generalizadas): `nome → { v, ano, idade, causa }`. `causa` é o id da entrada do livro que a gravou.
- **Caminhos** (`campos.ts`): `"mae.saude"`, `"lugar.desemprego"`, `"ator.vinculo"`; sem ponto, é de quem joga (`"fumante"`). O registro de campos diz o tipo, o sistema (corpo, humor, mente, dinheiro, relações, carreira, caráter, origem, mundo, história), os limites e se é derivado (`idade`, `vivo`, `patrimonio`, `investido`, `classe`, `nome`, `genero`, `quem`, `empresa.funcionarios`). O `patrimonio` de quem joga soma a parte em cada empresa (`campos.ts › patrimonioTotal`); `eu.empresas` (derivado) conta as empresas do grupo. O que não é campo é qualidade (vale 0 quando não existe).
- **Livro-razão** (`historico`): cada entrada tem tipo (nascimento, evento, ação, personagem, mundo, linha, regra, morte), **causa** (nascimento, escolha, ação, diretor, personagem, regra), o storylet (`ref`), o papel (`ator`), a instância (`storylet#papel`), textos, resumo, as entradas que a tornaram possível (`causas`) e as **mudanças** que ela fez (`{ c: caminho, d: variação | q: ganhou/perdeu | t: texto, r: regra }`). As regras miúdas do ano (economia, idade, vínculos) ficam numa entrada invisível do tipo `regra`.
- **agenda**, **vistos** (idades em que cada instância aconteceu), **pendente** (storylet com escolha esperando o jogador) e **rng** (mulberry32, um inteiro; vai no save).

Só as funções de `livro.ts` mudam números e qualidades, e cada uma anota a mudança na entrada que está sendo escrita. Há teste: nascimento + soma das variações do livro = estado final de quem joga.

## Nascer (`nascer`, `origem.ts`)

A origem é procedural: **8 classes** (extrema pobreza a trilionária; as duas últimas só por escolha ou por um sorteio raríssimo) × **4 tipos de família** (acolhedora, conflituosa, religiosa, empreendedora) × traços. A classe decide patrimônio e renda da casa (sorteados na faixa da classe), chance de desemprego, ocupações dos pais, saúde, idade da mãe e quantos irmãos. O tipo de família decide o vínculo de partida e para onde ele volta, os traços mais prováveis dos pais e, na empreendedora, o negócio da família. Pai ausente é mais comum na conflituosa. A avó pode morar junto; o amigo de infância nasce com a vida. A cidade (55, de todas as regiões) define região, desemprego e custo de vida. Cada ocupação dos pais pertence a um setor (12, de comércio a cultura). O país nasce com um governo sorteado (ou o regime, se a linhagem o trouxe), as políticas dele e as estatísticas perto de onde elas levam, com a sorte do momento. O mundo lá fora nasce junto (`diplomacia.ts › exteriorInicial`): cada país de fora com a economia dele e a relação perto de onde o governo de agora a leva, e o dólar perto de R$ 5. Quem joga ganha um traço (esperto, bonito, forte, ansioso, otimista, tímido, carismático, teimoso) que ajusta os atributos e a felicidade de base. **Criar o personagem é opcional** (nascer continua em um toque): nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos, jeito (o traço) e talentos. Os talentos são pontos: 0 (pouco), 1 (médio) ou 2 (muito) em saúde, inteligência, aparência e alegria, somando no máximo 4; o nível dá a média do atributo, e sobra um terço do sorteio. O nome digitado vira só letras, espaço, hífen e apóstrofo (não vira modelo de texto). **O parto:** 1 em cada 10 nasce prematuro (13% na extrema pobreza, 7% nas famílias ricas, +4 pontos com mãe abaixo de 18 ou acima de 37 anos), com 8 a menos de saúde e a marca `prematuro`.

## Um ano (`avancarAno`)

1. Idade e ano +1.
2. **O mundo lá fora** (`diplomacia.ts`), antes do país daqui. Quatro países fictícios (`mundo.json › estrangeiros`: a Federação do Norte, a República Celeste, a Liga Atlântica e o Pacto do Sul), cada um com o crescimento dele, a relação com o Brasil (0 a 100), o que compra daqui (setores e um peso no que o Brasil vende lá fora) e, às vezes, um rival:
   - **a relação** anda 20% por ano para um alvo, com sorte (3 pontos): a de sempre do país, +5 com a fronteira aberta e −8 com ela fechada (a política de comércio exterior), +15 com quem o governo daqui se aproxima e −15 com o rival desse país (`governos › aproxima`);
   - **a sanção**: abaixo de 35, a chance por ano cresce com o quadrado da distância (3% com a relação em 27, 20% em 15, 60% em zero); acaba quando a relação passa de 38, ou cansa (15% por ano). **O acordo**: com a relação a partir de 70 e a fronteira aberta ou moderada, o governo de turno assina (12% por ano); acaba abaixo de 45. Quando quem joga governa, o acordo é decisão dele. Sanção e acordo são notícias visíveis (tipo `mundo`, o país como ator) que apontam para a decisão que levou a relação até ali: o ato de quem governa ou uma escolha sobre a relação nos últimos dez anos, ou a posse (ou a reeleição) do governo, ou a tarifa, que pôs a postura de agora;
   - **a economia de cada um**: volta para o crescimento dele (60% do desvio fica), com a sorte que o mundo divide (0,5 ponto) e a dele; a crise de lá (1% a 2% por ano, −4 pontos lá) e o boom da Celeste (3%, +3) viram notícias;
   - **o que chega aqui**: a crise de lá tira 3 pontos do crescimento daqui (vezes o peso do país ÷ 0,3, até 1) e põe 2,5 de inflação; o boom soma 2; o que o mundo compra a mais ou a menos soma 0,15 × peso × o desvio de cada um (sem a demanda de quem sanciona); a sanção tira 1,2 × peso por ano e o acordo soma 0,5 × peso. A notícia da crise de fora é a primeira causa da virada da fase daqui;
   - **o dólar** (`pais.cambio`, em reais de hoje): anda 30% por ano para um alvo de R$ 5 que sobe com a dívida acima de 75% do PIB, com as sanções e com a economia daqui abaixo do potencial no ano anterior, e cai com o juro real alto e com o mundo comprando do Brasil; a crise lá fora o faz saltar 16% no ano e o boom o derruba 8%; sorte de 8%. Entre R$ 2 e R$ 15.
3. **O país vivo** (`pais.ts`). Andam dez estatísticas, puxadas pelo ano anterior, pelas políticas de quem governa (`mundo.json › politicas`: impostos, programas sociais, saúde, educação, segurança e comércio exterior, cada uma em três níveis), pelo empurrão dos decretos (`pais.impulso`, de −3 a 3, que some pela metade a cada ano), pelo mundo lá fora e pela sorte:
   - **crescimento** (% do PIB): volta 20% por ano para o potencial. O potencial é 2% com as políticas médias; imposto baixo soma 0,5 e alto tira 0,5; a fronteira aberta soma 0,3 e fechada tira 0,4; a escola boa sobe devagar; dívida acima de 90% do PIB e violência acima de 25 por 100 mil tiram. Desvio de 1,05 ponto, mais o que vem de fora; com a dívida acima de 100% do PIB, a fuga de capitais (0,2% de chance por ponto acima, até 8%) faz o choque de uma crise. O decreto soma 0,6 × impulso; o juro real acima do neutro freia;
   - **desemprego**: volta para o natural (8,5%, menos com escola boa) e cai 0,45 ponto por ponto de crescimento acima do potencial;
   - **inflação**: metade da do ano passado e metade da meta (4,5%), mais a economia quente, o decreto, a dívida alta, a alta do dólar (0,08 ponto por ponto percentual de alta no ano) e a tarifa (com o tempo, −0,5 ponto com a fronteira aberta e +0,8 com ela fechada);
   - **juros** (Selic): juro real neutro de 4% mais a inflação, mais metade do que ela passa da meta, mais a economia quente e o prêmio da dívida alta;
   - **dívida pública**: sobe com o que o governo gasta acima do que arrecada (políticas, emendas, decretos) e com a recessão, que derruba a arrecadação; acima de 75% do PIB, quem governa corta 5% do excesso por ano;
   - **pobreza, violência, saúde e educação públicas**: andam 30%, 20%, 15% e 8% por ano para onde as políticas, o desemprego, a pobreza e a dívida levam (a escola leva uma geração);
   - **aprovação do governo**: anda 35% por ano para um alvo feito de crescimento, desemprego, inflação, violência, saúde pública e do que as políticas agradam.

   A **fase do ciclo** é o nome do crescimento: expansão a partir de 4%, normal a partir de −0,5%, recessão a partir de −2,5%, crise abaixo disso. Para sair de uma fase, há folga (1 ponto na expansão, 0,5 na recessão e na crise); sem ela, o país trocava de fase a cada ano. Fora do normal, a fase é uma qualidade do país (`pais.recessao`) cuja causa é a entrada visível que a anunciou (tipo `mundo`, com o texto do choque de fora quando foi ele). Essa entrada aponta para o decreto que empurrou na mesma direção (até 3 anos antes) e para quem decidiu as políticas que puxam o crescimento (até 8). O que a fase fazia com a vida agora sai das estatísticas (`momentoDoPais`):
   - a chance de demissão é multiplicada por (desemprego / 8,5)^1,8;
   - o salário anda 0,8% por ponto de crescimento acima do potencial, a empresa 2,5% e a poupança da família 2%.

   **Quem governa** é um de quatro blocos fictícios (`mundo.json › governos`: a frente popular, o bloco liberal, a aliança da ordem e o centrão), o regime (quando a linhagem o trouxe) ou quem joga (presidente, monarca, chefe do Regime: os cargos com `governa`).
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
   - o vínculo volta devagar para o jeito da família e esfria sem contato na vida adulta; o casal se desgasta sem cuidado; filho adulto se afasta.
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
- **`movimentar`** pede `contraparte` (para o dinheiro) ou `fluxos` (o dinheiro repartido por contraparte). A dívida nova é com o banco, salvo `contraparteDaDivida`.
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

## As fichas do ano (`acoes.ts`)

Criança faz uma coisa por ano; adolescente, duas; adulto, três; depois dos 65, duas (`regras.ts › fichasDoAno`). Seis verbos (estudar, trabalhar extra, cuidar da saúde, ver a família, sair, poupar); tocar num verbo abre **todas as ações possíveis dele agora**, da que mais combina com o estado (mais cláusulas, mais peso, menos repetida) para a que menos combina, e o jogador escolhe. Com uma ação só, o toque já age. A mesma ação não se repete no mesmo ano. Quando as fichas acabam, o ano passa.

## Folhas sem ficha (`carteira.ts`, `empresa.ts`, `bens.ts`, `carreira.ts`, `poder.ts`, `herdeiro.ts`)

Decisões do jogador que não gastam ficha (entrada de tipo `dinheiro`, causa `acao`, com o grupo no `ref`):

- **Dinheiro:** aplicar e resgatar, perfil de investidor, padrão de vida.
- **Empresa** (cada operação diz qual, pelo lugar): abrir (até cinco de uma vez), aportar, retirada, vender, comprar uma concorrente por ano (30% do valor da empresa; o preço justo não cria valor, a tração sobe 2 pontos; ela vira subsidiária, com as subsidiárias dela, ⌊√(preço ÷ R$ 1 milhão) ÷ 2⌋; três compras fazem um truste, +5 de tração e investigação do órgão de concorrência), vender subsidiárias (uma até dez, depois um décimo, pelo preço da fase), fundir (a absorvida vira subsidiária; valores somados com 8% de ganho no mesmo ramo ou 2% de desconto em ramos diferentes, ± 8% de sorte; parte, dependência e tração viram a média pelo valor; no mesmo ramo conta como compra para o truste, em ramos diferentes vira o "Grupo {sobrenome}"; o sustento de quem joga passa para a que fica), abrir o capital (a partir de R$ 100 milhões, fora da recessão e da crise: o valor sobe 20%, quem joga vende 20% da parte dele pelo preço da fase e a dependência cai 15) e cuidar de perto (troca a empresa de lugar com a principal). Vendida ou fundida a principal, a maior das outras toma o lugar.
- **Bens** (`mundo.json › bens`, entidades `bem<id>`): comprar à vista ou financiar imóvel (20% de entrada, parcela fixa de 8% do preço ao ano, juros de 7%), morar (tira até 30% do custo de vida), alugar e vender (6% de custo no imóvel). Todo ano: o imóvel anda com o mercado de imóveis acima ou abaixo da média dele em todas as fases (o ciclo não tira nem põe valor no longo prazo; fica a valorização própria de cada imóvel), carro perde valor, manutenção e parcela saem, aluguel entra anotado à parte (`r: 'aluguel'`) para aparecer no chip do ano. O balanço do ano conta o valor dos bens menos o que falta pagar. Conforto vira felicidade de base (com teto); status vira influência.
- **Carreira** (`mundo.json › carreiras`): tentar uma vaga por ano, com requisitos (as condições dos storylets) e chance pelo talento e pelo desemprego do país; cargos com salário entre o primeiro e o último; a chance de subir cai a cada degrau (×0,8, e ×0,45 nas profissões de palco); fama nas profissões de palco; atleta e modelo têm idade para parar. Um storylet que muda o emprego encerra a carreira.
- **Poder** (`mundo.json › cargos`): influência anda 25% por ano para um alvo de patrimônio, bens, fama, cargo, empresa grande e linhagem; eleição municipal nos anos múltiplos de 4 e geral dois anos depois, com campanha paga e chance pela influência, aparência e popularidade (a imagem pública, que pesa em toda eleição; o mandato começa com ela mais 5, entre 45 e 90); o mandato acaba sozinho (o último ano é ano de eleição). Quem governa tem popularidade: nos cargos que não governam o país, ela anda com a fase; no que governa, é a aprovação do governo (`pais.ts`). Abaixo de 30, o cargo balança (`queda_do_cargo`). Coroa e Regime são cargos vitalícios dados pelo conteúdo. Decretos são storylets que escrevem `pais.impulso`, que empurra o crescimento, a inflação e a dívida.
- **País** (`pais.ts`, folha País): quem governa muda uma política por ano (`{ tipo: 'politica', politica, nivel }`); a aprovação sente na hora (o que se tira dói, o que se dá agrada), e as estatísticas, nos anos seguintes. A folha mostra cada estatística com a seta do ano e para onde caminha com as políticas de agora.
- **Lá fora** (`diplomacia.ts`, folha País): o dólar com a seta do ano e cada país de fora (a relação em palavras, o crescimento, sanção, acordo, crise; tocar abre o que ele compra do Brasil, o rival e a chance de sanção). Quem governa faz um ato por ano (`{ tipo: 'diplomacia', parceiro, acao }`): a visita de Estado (+15 na relação, −8 na do rival dele), o acordo comercial (relação a partir de 60, fronteira aberta ou moderada, sem sanção) e o rompimento (−40 na relação, o acordo acaba e a popularidade sobe 4 agora; a folha mostra a chance de sanção que fica).
- **Testamento:** para quem vai tudo (a lei: filho, senão sobrinho; ou o par, o melhor amigo, os sobrinhos, uma causa, o bicho).

## Dinastia (`herdeiro.ts`)

Quando a vida acaba, a história continua com quem herda: pelo testamento, o par (que herda tudo, sem metade separada, e começa viúvo, com o filho do casal) ou o melhor amigo (com o próprio sobrenome e a própria família); pela lei, o filho ou a filha viva, ou um sobrinho (gerado de uma semente da própria vida, sem gastar o sorteio). Testamento para uma causa ou para o bicho encerra a história. A partilha paga as dívidas com o espólio, separa a metade de quem era casado (quando o par não é o herdeiro), 4% de imposto e o quarto do testamento solidário; as empresas e os bens passam ao herdeiro (a primeira empresa é a que ele cuida de perto), e só o que a conta não cobre sai da parte em cada empresa, na mesma proporção, e, depois, dos bens mais baratos. A coroa e o Regime passam ao filho: a sucessão é o primeiro capítulo. A primeira entrada conta a herança e é a causa do estado inicial.

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
- **aleatória:** sorteia entre as disponíveis (inclusive não agir); sorteia perfil e padrão aos 18, aplica em um ano a cada cinco, às vezes abre uma empresa com capital sorteado e às vezes vende na velhice; com empresa, raramente abre outra, funde duas, abre o capital, vende subsidiárias ou troca a que cuida; no governo, um ato lá fora sorteado em 15% dos anos.
- **cautelosa:** menor risco; empate, maior valor esperado. Conservadora e simples aos 18; aplica a sobra de três em três anos com um ano de reserva; vende aos 65 as empresas que a vida lhe deu. No governo, assina o acordo que dá e visita o país mais frio quando a relação cai abaixo de 45.
- **arriscada:** maior risco; empate, maior valor esperado. Arrojada e no luxo aos 18; abre uma empresa entre os 22 e os 45 anos com metade do que tem, reinveste tudo e nunca vende; compra concorrentes quando o dinheiro dá, abre o capital na economia aquecida e, com a primeira acima de R$ 20 milhões, abre uma segunda em outro ramo. No governo, fecha a fronteira e, com a popularidade abaixo de 40, rompe com o país mais frio (abaixo de 50).

Valor de um desfecho: atributos ponderados (saúde 1,2; felicidade 1; inteligência 0,6; aparência 0,5) + dinheiro (R$ 2 mil = 1 ponto; renda e custo com 5 anos de horizonte, inclusive por fator e pelo padrão proporcional ao patrimônio; investir vale o rendimento de 10 anos, e resgatar perde o mesmo; na empresa, o que muda na parte de quem joga, e a tração pelos anos em que ela dura) + vínculos (3 pontos = 1) + efeito passivo de qualidades novas (10 anos) − 200 se mata. Risco: desvio-padrão do valor entre os desfechos + exposição (saúde perdida, inclusive por qualidade; dívida; perda de patrimônio; chance de morrer).

Uma estratégia fixa que vence as outras em idade média de morte, patrimônio mediano e felicidade média ao mesmo tempo é **dominante**: o jogo teria resposta certa, e o túnel falha.

## Determinismo

Mesma semente e mesmas decisões dão a mesma vida, mesmo salvando e recarregando a cada passo (há teste, com a ficha do ano). A interface sorteia a semente com `crypto.getRandomValues`; o túnel deriva as suas de uma semente fixa, então `docs/metricas.md` só muda quando o motor ou o conteúdo mudam.
