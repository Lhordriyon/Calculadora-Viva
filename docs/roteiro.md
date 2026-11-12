# Roteiro

Estado de cada nível da fase 2 (life simulator). Qualquer sessão continua daqui: leia este arquivo, `docs/decisoes.md` e `docs/metricas.md`.

A visão: o jogador pensa "eu posso tentar qualquer coisa", e o jogo responde "pode, mas o mundo vai reagir". Poucos sistemas fundamentais, milhares de combinações, interface simples, uma vida em minutos.

Ritmo combinado com o dono (06/10/2026): incrementos que vão ao ar inteiros (jogáveis, medidos, publicados); depois do primeiro, seguir para o próximo nível enquanto os portões passarem, sem esperar ordem. Ao fim de cada incremento, relatório curto: o que mudou, métricas antes e depois, decisões tomadas sozinho, link e o que jogar.

## A missão "Universo de bolso" (12/10/2026)

O dono pediu que o Trajetória vire um universo:
- vida, patrimônio, empresas, Estados e sistema internacional;
- contas que fecham;
- causalidade rastreável;
- agentes com mandato.
Tudo sem tentar implementar de uma vez.

A Fase 0 entregou três documentos:
- `docs/auditoria-universo.md`: o que existe, o que falta e o que quebra, com a linha de base;
- `docs/arquitetura.md`: os 13 módulos, os contratos, as fases e a primeira fatia;
- `docs/ideias.md`: o registro permanente de ideias, com dependências e fase.

Daqui em diante, os incrementos são as fatias das fases. Toda ideia nova entra primeiro no registro.

- [x] Fase 0: auditoria, arquitetura e registro de ideias
- [x] Fatia 1.1: toda transferência tem dois lados. Toda mudança de dinheiro diz de quem veio ou para quem foi (o mercado, o governo, o banco, os parentes, outra pessoa, ou o preço que mudou). As contas fecham entrada por entrada, e o túnel trava o contrário. A folha Dinheiro ganhou o extrato do ano e o da vida. Nenhuma vida mudou: as métricas saíram iguais
- [x] Fatia 1.2: a dívida como contrato. Toda dívida é um contrato com o banco: o cheque especial, o empréstimo de uma escolha, o financiamento com o imóvel em garantia e o acordo. O que passa do limite e a parcela que não cabe atrasam, e o atraso suja o nome: o banco não empresta mais nem financia. O financiamento atrasado vai a leilão, a dívida atrasada caduca em cinco anos, e renegociar é decisão. A folha Dinheiro mostra cada dívida, de onde veio e a proposta do banco. O túnel confere, em toda entrada, que o que se deve é o que o banco tem a receber
- [x] Fatia 1.3: o ano em etapas declaradas. As 19 etapas do ano dizem o que leem e escrevem, um teste confere, e o túnel mostra a ordem, a CPU e o livro de cada uma. O save tem cópia de segurança, exportar e importar. O livro compacto ficou para quando o save passar de 1 MB (o maior é 479 KB). No mesmo dia: o túnel roda um trabalhador por núcleo (687 s → 199 s), e o toque no fim da vida ficou 2,8× mais rápido no celular
- [x] Fatia 1.4a: vários filhos. Um filho novo não apaga o outro: cada um tem id próprio, vive o ano, e o conteúdo escrito para "filho" vale para qualquer um. Sem testamento, os filhos dividem a herança, e o testamento escolhe quem continua. Conteúdo novo: mais um filho, o ciúme do irmão, a briga e a mesa cheia. O cabeçalho deixou de esconder a linha do dinheiro
- [x] Fatia 1.4b: identidade de pessoas (o ex que continua existindo, o papel que aponta para a pessoa): feita na camada Ω1 da missão Ω, pela lista de quem ocupou cada papel (abaixo)

**Os blocos do dono (19/10).** O dono pediu atualizações em blocos pequenos, cada uma com o que trouxe e o que não trouxe na página de abertura do repositório (README). A ordem e as ideias de cada bloco estão em `docs/ideias.md › A ordem do dono`. A fatia 1.4b espera os blocos.

- [x] Bloco A: o país em números. O país ganhou PIB (em reais de hoje, que cresce o crescimento do ano), população (que para de crescer por volta de 2045 e encolhe depois), PIB per capita, Gini (a violência passou a ler a desigualdade) e IDH. A folha País mostra os cinco na seção "Em números", e cinco histórias novas os leem
- [x] Bloco V1: a cara nova (pedido do dono no meio dos blocos, com um mockup e depois um pacote de CSS). Tema noite e ouro, cabeçalho com a marca, o retrato, o selo da economia, os indicadores e o dinheiro em cartões, os verbos com ícone, o botão dourado, os marcos em dourado na linha do tempo e o arranjo para a letra grande
- [x] Correção C1 (20/10): a história de volta ao centro. O dono jogou o V1 e disse que o jogo perdeu qualidade, hierarquia, dimensionamento e cuidado. Medido no aparelho dele (360 × 780, letra 1,45), o cabeçalho de cartões tomava a tela e cortava o dinheiro, o botão dourado pulava as escolhas e o toque duplo passava o ano. O cabeçalho virou uma faixa de texto, o ouro ficou só onde tem papel, o botão do ano diz quantas escolhas sobram, as folhas fecham no topo e com o voltar do Android. O tema noite e ouro ficou
- [x] C0 (20/10): a régua da tela, `npm run telas`, com 52 critérios de interface; a C1 passa em todos depois de três ajustes (as opções do evento nunca saem da tela, o cargo e os aluguéis cedem na tela estreita)
- [x] Correção C2 (25/10): o texto não contradiz a vida. Mortos não falam, cada filho tem o próprio nome, a concordância segue o gênero, o amigo de infância não é estranho, o desfecho repetido volta curto, a eleição fala em palavras e o cartão conta a vida e não a rotina; cada conserto com uma regra no validador
- [x] Bloco R (25/10): as pessoas da sua vida, pedido do dono no meio dos blocos. Cada pessoa tem afeto, confiança, mágoa e anos sem contato; lembra da melhor e da pior coisa que você fez e do que você deixou de fazer (a falta); tem opinião sobre você, com o porquê, tirada do que viu e do que se sabe; quer coisas da vida (as vontades), cobra e desiste; age pelo que sabe de você; e a morte conta a relação e o que faltou. A folha Família mostra tudo isso e abre as ações com cada pessoa (I-102, I-103)
- [x] Correção C3 (25/10): regras que se medem direito. A régua do túnel mede os dilemas em três bolsos e com a empresa, e o robô sorteia no empate; zero falsos dilemas; dois mandatos seguidos no Executivo, e quem tem cargo não faz bico; quem vive de patrimônio não é demitido, e a demissão de quem é rico não vem com cesta básica (I-105). Fecha o plano de correção de 20/10
- [x] Bloco B (25/10): o Tesouro. O título público é um contrato com o governo, comprado pela folha Dinheiro por 5, 10 ou 20 anos: a taxa fica travada, o cupom cai na conta todo ano, o valor volta no vencimento (com a compra como causa) e vender antes é pelo preço do dia. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, vem o calote: quem tinha título e renda fixa perde, a dívida encolhe, o juro fica alto por seis anos e a notícia aponta quem levou a dívida até ali. O título passa a quem herda; a folha País mostra a dívida em reais e o risco (I-34, e a parte da I-31 que é a dívida em reais)
- [ ] Bloco B2: o título comprado pela empresa, quando ela tiver caixa (I-11); o orçamento do governo item por item (o resto da I-31)
- [x] Bloco C (26/10): a coroa recebe. Quem tem coroa (o monarca do Brasil e quem é soberano da ilha) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa. A dotação é a renda de quem reina, paga pelo tesouro ou pela ilha. Cobrar mais custa aprovação, e a reação chega com o decreto de causa; abaixo de 30, o plebiscito ou a greve. A ilha fundada é um país, com população, PIB e imposto, que anda todo ano e passa a quem herda (I-41; o começo da I-43)
- [x] Bloco D (26/10): o Estado pesquisa. Quem governa decide a ciência (cortada, regular ou prioridade, de 0,3% a 0,9% do PIB pagos pelo Tesouro), e cada bloco tem o seu nível. A tecnologia do país anda devagar com a ciência e a escola e volta como crescimento, saúde pública, tração das empresas e a vaga de quem é cientista. Acima de 55, o país descobre (a cura, o satélite, a patente) e, com a ciência cortada e a tecnologia baixa, os cientistas vão embora, sempre com a decisão que fez o estoque de causa; a descoberta chega à vida no ano seguinte (I-54)
- [x] Bloco E (26/10): defesa. Quem governa decide a defesa (desmobilizada, regular ou reforçada, de −0,3 a +0,5 ponto do PIB), e cada bloco tem o seu nível; a capacidade das Forças Armadas anda com ela e com a tecnologia. Quem governa encomenda um sistema de armamento por ano (caças, submarino, defesa antiaérea, satélite militar), que vai para a dívida na hora e chega anos depois. A capacidade dissuade: com um país que sanciona e anda frio, a guerra pode começar, apontando quem esfriou a relação e quem desmobilizou; cada ano dela custa crescimento, inflação, gasto, gente e aprovação, e ela acaba em vitória, derrota ou cessar-fogo, mais depressa com o pedido de paz. Na vida: a convocação, o filho convocado, o racionamento, a fábrica de munição e quem voltou (I-60, o começo da I-61)

Os cinco blocos da ordem do dono estão feitos. Seguem pendentes o Bloco B2 e a fatia 1.4b.

**A segunda ordem do dono (26/10).** A lista nova, com os blocos e a ordem, está em `docs/ideias.md › A segunda ordem do dono`.

- [x] Bloco F (26/10): o poder que passa. A coroa, o Regime e a ilha passam a quem continua a história, seja quem for (o filho, o par, o amigo, o sobrinho), no primeiro ano ou aos 18 (até lá, a regência), e também quando quem reina morre em vida; quem governava espera a resposta, sem interregno. O poder também se toma: o autogolpe de quem é presidente, o golpe de quem tem influência e a coroa restaurada no plebiscito, com o mundo reagindo lá fora. Quem foi reinar na ilha deixa de governar o Brasil; quem tem cargo não é demitido e larga a carreira com a coroa; sob o Regime não há eleição geral; o resgate do país virou título do Tesouro (I-106, I-107, parte da I-108, D-01, D-03, D-04)
- [ ] Bloco F2: governar o que você fundou. A ilha e a cidade como territórios, com imposto e obras pagas do próprio bolso (o resto da I-108)

**A missão Ω (26/10).** O dono pediu um salto, não mais um bloco: "o jogo está muito repetitivo", e que a `main` só receba o jogo quando ele se comparar a um jogo muito bem construído. O diagnóstico e a decisão estão em `docs/auditoria-omega.md`; as camadas estão em `docs/ideias.md › A missão Ω`. Cada camada vai para o branch de trabalho com o `verificar` passando; a `main` recebe o salto inteiro.

- [x] Ω0 (26/10): a auditoria do repositório e a linha de base medida (o carregamento, o ano no navegador, a vida no motor, a memória, o save, o offline, os testes e o túnel)
- [x] Ω1 (27/10): a rede. A pessoa tem identidade, não só papel: o amor que vai embora vira ex e continua vivendo (e pode voltar), o namoro sem casamento esfria e quem joga decide, os irmãos nascem com a família e vivem ao fundo (o casamento e o primeiro filho chegam como convite ou como notícia), o colega e o chefe vêm com o trabalho (o chefe pesa na promoção e na demissão), e o colega próximo vira amigo quando o emprego acaba. Na média, 13,8 pessoas por vida, contra cerca de 8 (I-05, I-130, I-131)
- [x] Ω2 (01/11): os verbos sociais. Quando a resposta é de uma pessoa, ela decide pelo que viveu com você (o vínculo, a confiança, a mágoa, o traço, o que acha de você, o que você deu e pediu, o dinheiro, o aperto, a distância, a dívida) e diz por quê, apontando a lembrança; os 14 testes que davam um dado em alguém viraram decisão. O empréstimo entre pessoas é um contrato (a promissória: parcela, atraso que magoa, calote que marca, quitação que devolve a confiança). Pegar emprestado, emprestar, cobrar, ser cobrado, dar uma força, pedir socorro com as crianças, ajudar na mudança e bancar o cupido do irmão; "propor" e "contar" ficam para os projetos e os segredos (I-123)
- [x] Ω3 (01/11): os planos. Quem joga põe na cabeça o que quer (sair das dívidas, a casa própria, um filho, o negócio próprio, reparar a relação com alguém, cuidar da saúde, o primeiro milhão, casar, o diploma); as etapas são o estado real da vida, a folha Planos mostra o que ajuda, e o fim (conquista, prazo vencido, desistência, a pessoa que morreu antes) entra na linha do tempo com o começo de causa. O mundo apoia o plano de pé com histórias próprias (I-124)
- [x] Ω4 (01/11): os segredos. O caso, a dívida escondida, a festa que era estudo e o esquema por fora: quem sabe pode contar pelos círculos (a família, os amigos, os ex, o trabalho), quem fica sabendo perde confiança em você, e a notícia que chega a quem não devia vira revelação, com quem contou e o porquê. A chantagem de quem sabe, o desabafo, a confissão; a folha Família mostra quem sabe o quê (I-125)
- [x] Ω5 (01/11): a peneira dos capítulos e o caminho não tomado. A vida lê os próprios arcos no livro (o plano, o segredo que veio à tona, o amor que voltou, a dívida que virou calote, o favor devolvido, as pazes) e mostra na linha do tempo e no cartão; no cartão, cada escolha que virou ponto de virada pode ser trocada, e a vida que não foi vivida aparece em duas frases, como experimento do modelo (I-126, I-127)
- [x] Ω6 (01/11): o ritmo e a medida. Depois de um ano pesado, as histórias leves ganham a vez; o túnel mede a variedade das vidas pelo caminho (as causas dos pontos de virada e os capítulos), não só pelo destino, e os elos de causa distintos (I-128, I-129)
- [x] Ω7 (01/11): integrar, polir, verificar, publicar e o relatório ao dono

**O bloco H, a empresa de verdade (01/11).** O dono jogou o salto e pediu um simulador de negócios de verdade: "as empresas não têm caixa, não têm produto, o conselho fala coisas aleatórias, prédios e emissoras não rendem, fama, influência e poder não mudam nada, eu só subo o patrimônio até o limite". O bloco H da segunda lista (o caixa da empresa, o lucro com origem, a pesquisa e desenvolvimento, as fábricas e lojas) passou na frente do F2 (I-132; as decisões e as medidas em `docs/decisoes.md › O bloco H`).

- [x] H1: o motor do negócio (`negocio.ts`): caixa com contraparte, demanda, capacidade e obra, preço, salário, qualidade, marca, verbas, o resultado do ano, os dividendos do lucro, o valor pelos fundamentos e a quebra por causa
- [x] H2: o mundo reage: o dólar no caixa, a exportação e a sanção que a fecha, os empregos no desemprego da cidade, o imposto na dívida do país, a mídia que vende publicidade e dá influência, o aluguel com vacância, a fama na marca
- [x] H3: 15 histórias do negócio, a folha Dinheiro com o negócio, os robôs que decidem nele, os testes e o túnel
- [ ] Depois: o crédito da empresa no banco (a empresa que deve), o lobby, o conselho que propõe (I-12) e as fábricas e lojas como lugares (hoje são a capacidade)

**O bloco $, o dinheiro existe (02/11).** O dono pediu que cada real exista, com emissão monetária de fato (I-133; as decisões e as medidas em `docs/decisoes.md › O bloco $`).

- [x] As contas do país com saldo, o lado de lá de cada real e a soma do mundo que dá zero (conferida em cada entrada e no fim de cada vida)
- [x] O crédito que cria dinheiro, a emissão e o enxugamento pela política da moeda, o imposto inflacionário, e o excesso de dinheiro na inflação e no crescimento
- [x] A folha País com o dinheiro do país, três histórias do dinheiro, os testes e o túnel
- [ ] Depois: o balanço de cada banco, a dívida pública dentro do saldo do Tesouro e o câmbio pela conta de lá fora

**O bloco H2, a concorrência e o banco da empresa (02/11).** O dono pediu a empresa "10× melhor" (I-134).

- [x] A concorrente que reage (corre atrás, guerra de preços, nova pelo lucro, quebra), o crédito do banco com o juro da Selic, quatro histórias, a folha, os robôs e os testes
- [x] H3 (02/11): os mercados de cada setor, com o ciclo de oferta e preço (a teia de aranha com inércia), o preço na receita, a sobra na concorrência e no emprego de quem trabalha nele, três histórias e a folha País com os setores (I-135)
- [x] H4 (02/11): comprar a concorrente pelo preço do dia (barata na baixa e quando está fraca), a fatia do mercado e a previsão do preço do setor pela obra em andamento (I-136)
- [x] H5 (02/11): o capitalismo integrado: a cadeia de fornecimento e a integração vertical, a folha pelo desemprego, o imposto pela política e o lobby que baixa os impostos (I-137)
- [x] ★ (02/11): a influência em três esferas (pessoal, política, negócios), cada uma com um uso, e as nove conquistas na linha do tempo, no epitáfio e no cartão (I-138)

**O bloco H6, o capitalismo com rosto (o próximo; o pedido do dono, 02/11).** O dono pediu para preparar a próxima atualização: mais capitalismo. A concorrência é um número sem dono e ninguém na empresa propõe nada (I-139, com as candidatas nos 12 critérios). A ordem de execução:

- [x] H6a: a rival tem nome e dono.
  - **O papel `rival`** (`familia.ts`), no molde do colega e do chefe: chega com a concorrente nova (ou no primeiro ano de quem já tem empresa, o save antigo) e sai quando ela quebra, é comprada ou quem joga troca de empresa. O nome da concorrente fica em `empresa.rival`, tirado de `mundo.json` e do setor.
  - **O traço do dono na reação** (`negocio.ts › concorrenciaDoAno`): na chance de guerra, na corrida atrás de quem atrai mais e na volta para a média.
  - **O rival que você conhece:** na concorrente nova, o colega antigo magoado, um ex, o irmão ou o amigo brigado pode virar o dono, pela troca de papel de `pessoas.ts` e com a entrada do motivo de causa.
  - **Comprar a concorrente é pedir ao dono** (`empresa.ts › adquirir`, com o pedido `aceitar` de `decisao.ts`): a mágoa da guerra de preços pesa, e a folha diz como ele está.
  - **No resto do motor:** o manifesto, `herdeiro.ts` (o rival passa com a empresa) e os testes de cada ligação.
- [x] H6b: o que a rival faz. Seis iniciativas do dono (`conteudo/storylets/` novo), com `teste decide` quando a resposta é dele:
  - a trégua de preços (o tema `cartel` em `mundo.json › segredos`, e o Cade se vazar);
  - a oferta pela sua empresa;
  - o funcionário roubado;
  - o processo da marca;
  - o dono quebrado que pede emprego;
  - o encontro na festa.
- [x] H6c: o gestor que propõe (I-12; o papel se chama `gestor`, porque "diretor" já é o diretor narrativo do motor).
  - **O papel `diretor`:** chega com a empresa acima de R$ 10 milhões ou com a rival comprada (o dono fica). O jeito dela, cautelosa ou arrojada, vem do traço.
  - **A proposta do ano:** a heurística do robô no jeito dela (`robos.ts`), num storylet com o texto montado do estado; as escolhas são seguir, recusar ou fazer do seu jeito.
  - **O efeito `operacao`** (`esquema.ts`, `efeitos.ts`): executa a operação da folha, com o motivo de recusa dela.
  - **A conferência no ano seguinte:** os números deram razão a ela? A resposta vai para a confiança e a lembrança, e quem ignora sempre perde a diretora para a rival.
- [x] H6d: a interface. Na folha Dinheiro, o nome da rival, o dono e como ele está para vender; na Família, o rival e a diretora no grupo do trabalho; na linha do tempo, a chegada e a saída do rival. A régua (`npm run telas`, 52 critérios) passa.
- [x] H6e: os robôs (seguem a diretora pelo jeito da estratégia), o túnel com os portões da I-139, a documentação, o `verificar` e a publicação.

Riscos já vistos:
- **Os toques estão em 479,2, com teto de 480:** as propostas e as iniciativas disputam o lugar do evento do ano; não podem somar um evento.
- **O save está a 619 KB, com teto de 700 KB** no teste: duas pessoas a mais por vida com empresa.
- **O validador:** texto com `{rival}` e `{diretor}` só onde a qualidade garante a pessoa.
- **O rival conhecido muda de papel:** a memória vai com ele, mas o conteúdo do papel antigo para de alcançá-lo.
- **Seguir a diretora não pode ser a resposta certa:** o jeito dela erra no ciclo errado (a cautelosa perde a alta, a arrojada pega a sobra).

**O bloco H7, a bolsa de verdade (03/11).** O dono pediu a próxima atualização de capitalismo (I-140; as decisões e as medidas em `docs/decisoes.md › O bloco H7`).

- [x] H7: emitir ações, recomprar a maioria, a oferta hostil pela concorrente e a oferta contra quem perdeu a maioria (a dona da concorrente ou um fundo de fora), com a folha Dinheiro, os robôs, os testes e os portões do túnel

Depois do H7: várias rivais por setor, fábricas e lojas como lugares, e o fundo ativista (a cadeira no conselho e o dividendo extra).

**O loop da qualidade de jogo (03/11).** O dono pediu um loop de atualizações cada vez melhores, com foco total na experiência de quem joga: "o mundo real é chato demais; o player busca o Trajetória para viver nele o que de fato quer viver". Cada volta escolhe, pelos 12 critérios, o que mais muda a vida de quem joga, entrega inteira e recomeça (I-141 em diante).

- [x] S1 (03/11): o sonho. Aos 15, a vida pergunta o que você quer dela (virar estrela, construir um império, governar o país, ou ainda não sei) e, com o namoro, o que você quer do amor (a casa cheia ou um amor para a vida toda). O sonho é um plano com as etapas do estado e prazo longo; cada um tem três cenas em pontos diferentes do caminho; a conquista é um marco dourado, e o cartão da vida diz como cada sonho terminou. Os sonhos têm vaga própria, à parte dos planos, e o marco não toma a vaga de um ponto de virada (I-141)

**A missão "Ascensão AAA" (10/11; I-144 a I-155).** O dono pediu uma atualização grande, com prioridade para a experiência no Android e para a simulação causal, medida pela qualidade. A ordem: investigar antes de mexer, corrigir pela causa, medir antes e depois, publicar e convidar ao teste; a auditoria final vem depois do retorno dele. A linha de base, as medidas e as decisões estão em `docs/decisoes.md › A missão Ascensão AAA`.

**A missão "Capitalismo vivo" (11/11; I-156 a I-165).** O dono pediu que o sistema empresarial vire uma economia corporativa viva. Entrou, na ordem pedida: a empresa como pessoa jurídica (o número, a dona, a sócia, a holding e as subsidiárias de verdade, sem dupla contagem); as unidades operacionais (a capacidade como soma das que produzem, a cidade, o laboratório e o centro de distribuição); as concorrentes de verdade nos setores do grupo, que rodam o mesmo negócio e decidem sozinhas, com as partes do mercado somando 100%; a compra que leva o controle sem fundir; a falência da subsidiária sozinha; o valor adicionado e o peso do grupo no PIB; a mídia que vende audiência e recebe a campanha das irmãs; o produto que envelhece; o conselho com autonomia e mandato; o Cade pelo HHI; a demonstração consolidada; e a folha do grupo em camadas. O que ficou de fora, com o motivo, está em `docs/ideias.md` (I-156 a I-165) e as decisões em `docs/decisoes.md › A missão Capitalismo vivo`. A auditoria final da Ascensão AAA continua esperando o teste do dono.

**O comando claro (12/11; I-175 a I-177).** O dono pediu botões que digam o que fazem, mais autonomia para os CEOs das subsidiárias e mover caixa em qualquer valor da holding. Entrou: a transferência de caixa nos três sentidos, os CEOs com nome e a carta branca que cuida do caixa, a subsidiária que nasce delegada e a frase embaixo de cada botão e de cada escolha.

**A missão "O mundo à vista" (12/11; I-170 a I-173).** O dono achou o grupo no mundo pouco perceptível ("quero que seja perceptível para qualquer player") e pediu que a simulação evoluísse sem ele. A ordem:

- [x] O lugar no país para todo jogador: a faixa da riqueza na distribuição do Brasil real, com a linha do nascimento, a faixa nova, a queda com causa e a volta, o marco dourado a partir do 1%, a folha Dinheiro e o cartão da vida
- [x] Os marcos do grupo na linha do tempo (funcionários, a fatia do setor, a filial com gente lá fora, as maiores do país) e as histórias que o lugar e o tamanho destravam
- [x] Os grandes do país vivem: as maiores empresas e os mais ricos andam com o setor e com o PIB, os mais ricos são donos das maiores, e o país conta quem passou quem (I-173)

- [x] A investigação: a auditoria independente (5.613 vidas em dinastias, sem um erro de conta), os retornos reais medidos, as fotos da interface na letra do dono, o desempenho com a CPU limitada e a casca do Android
- [x] A simulação: o tempo das marcas pelo calendário, a família de quem herda, o mercado com tamanho para todo ganho, a viuvez de quem é; `npm run auditoria` e os invariantes do estado no túnel
- [x] A experiência: o evento que se lê inteiro, a infância sem noticiário, o jogo que não cai, abrir e tocar mais rápido, o toque que se sente e o momento da morte
- [x] O Android: o ícone, a abertura e a janela no noite e ouro; o APK conferido e jogado num Android emulado no CI
- [ ] O teste do dono na versão publicada, e a auditoria final depois do retorno dele
- O que ficou para decidir com o dono: o arranjo do evento para texto muito longo com a letra 1,45, a riqueza das vidas contra o Brasil real, e a vida que quem herda já tinha (o casamento e os filhos que a vida anterior contou)

**O S2, o segundo ato (04/11; o dono aprovou o projeto, I-142).** O sonho do S1 acaba por volta dos 50, e a segunda metade da vida fica sem direção; o sonho realizado é uma linha dourada, sem o momento. Pular os anos sem decisão foi medido e descartado: 77% dos anos já têm uma decisão, e os trechos sem nenhuma têm mediana de 1 ano.

A linha de base (200 vidas dos robôs, com o S1):
- dos 50 em diante, 30% dos anos têm um sonho de pé (40% têm algum plano);
- o primeiro sonho acaba aos 50 na mediana (entre 50 e 55 na metade do meio), e 97,5% de quem chega ao fim dele vive mais três anos ou mais; no túnel inteiro, 11% dos sonhos que acabam se realizam;
- entre quem não nasceu rico, 25% terminam a vida com R$ 10 milhões e 9,5% com R$ 50 milhões; 12,5% das vidas terminam com sítio, casa de praia ou fazenda; 26,5% já viajam longe; só 7,5% viram avó ou avô (a história dos netos pede 22 anos de pai ou mãe).

A ordem de execução:

- [x] S2a: o dia do sonho. A conquista agenda, no mesmo ano, a cena do sonho realizado, com a conquista de causa (`projetos.ts › terminar`; os cinco storylets em `AGENDADOS_PELO_MOTOR`). Três escolhas sobre como viver o topo, e cada uma volta depois:
  - virar estrela, o estádio cheio: a primeira música que você aprendeu, a turnê pelo mundo (que cobra a saúde) ou quem duvidou de você chamado ao palco;
  - o império, os cem milhões: o bônus para todo mundo (o caixa e a marca), a casa dos sonhos (um bem de verdade, pelo efeito novo `comprarBem`, a mesma compra da folha Dinheiro) ou segunda-feira às oito, como sempre;
  - governar o país, a posse: o discurso da escola pública, a promessa grande demais (que alguém cobra no meio do mandato) ou a família no parlatório;
  - a casa cheia, a foto da família inteira; um amor para a vida toda, as bodas de prata.
- [x] S2b: o "e agora?". O fim de qualquer sonho grava `sonho_acabou`, com a entrada do fim de causa. Nos três anos seguintes, a vida pergunta, disputando o lugar do evento do ano (sem toque a mais):
  - depois do realizado ("e agora?"): sonhar de novo (dois sonhos da segunda metade, pela idade e pelo bolso), ensinar o caminho a alguém (o filho ou o amigo ganha a lembrança boa e o vínculo) ou aproveitar o que construiu;
  - depois do que não veio ("o sonho que ficou"): tentar de outro jeito (um sonho da segunda metade), contar a história aos filhos ou fazer as pazes com o que foi.
- [x] S2c: os sonhos da segunda metade (`mundo.json › projetos`, `sonho: true`, idade de 35 a 75, prazo de 15 a 25 anos), cada um com duas ou três cenas:
  - a fortuna: R$ 1 milhão, R$ 5 milhões e R$ 20 milhões, até R$ 50 milhões (com R$ 10 milhões, seria fácil demais: 25% de quem não nasceu rico já chega lá);
  - o lugar no mundo: a casa própria, o dinheiro da entrada, até o sítio, a casa de praia ou a fazenda (os bens que já existem);
  - conhecer o mundo: o dinheiro guardado e a viagem longe (`viajou_longe`, que 26,5% já fazem), até a volta ao mundo (uma história nova);
  - ver os netos crescerem: o primeiro neto (`avo_coruja`), até dez anos de avó ou avô; com só 7,5% das vidas chegando a ter neto, este sonho entra só se a história dos netos puder vir mais cedo (o filho adulto, e não 22 anos de pai ou mãe), e sai do S2 se não puder.
- [x] S2d: a folha Planos e o cartão contam os dois atos ("Virar estrela, realizado aos 41 · O lugar no mundo, realizado aos 58"), e a escolha do dia do sonho entra no cartão.
- [x] S2e: os robôs (quem sonha com o lugar no mundo compra o sítio quando cabe; quem sonha com a fortuna investe a sobra), os testes, os portões do túnel, a documentação, o `verificar`, a régua da tela e a publicação.

Os portões do S2:
- ≥ 95% dos sonhos realizados têm o dia do sonho no mesmo ano;
- ≥ 50% dos fins de sonho de quem vive três anos depois chegam ao "e agora?" ou ao "sonho que ficou";
- os anos a partir dos 50 com um sonho de pé passam de 30% para ≥ 50%;
- todo sonho da segunda metade se realiza em alguma vida, e os realizados ficam entre 10% e 70% dos que acabaram;
- zero histórias mortas, toques ≤ 480 e saturação V20 sem regressão.

Riscos já vistos:
- **Os toques estão em 479,2, com teto de 480:** o dia do sonho é agendado (um cartão a mais, só para quem realiza, uns 11% dos sonhos); o "e agora?" disputa o lugar do evento do ano, para não somar cartão; e o robô que sonha com o palco tenta a vaga a cada dois anos, não todo ano, para abrir a folga que o S2 precisa.
- **Toda qualidade nova precisa de dois leitores:** `sonho_acabou` é lida pelo motor (sai quando outro sonho começa) e pelas duas histórias; as marcas do dia do sonho, por histórias depois e pelos epitáfios.
- **O sonho da segunda metade não pode ser fácil demais:** a viagem longe já acontece em muitas vidas; a meta é a volta ao mundo, não a primeira viagem.

Na construção, o projeto mudou em três pontos: a promessa da posse é cobrada pela agenda (morria no túnel), o "e agora?" e "o sonho que ficou" são repetíveis e variam o texto, e entrou o marco dos 50 para quem chega lá sem sonho de pé. Ensinar o caminho a alguém ficou de fora (as quatro opções do cartão foram para sonhos).

Fora do S2, na fila: o sonho que passa para quem herda (S3, com a dinastia), a sorte grande (uma chance extraordinária por vida, ligada ao sonho), a despedida em várias cenas, e a rival que volta na vida seguinte.

- [x] S3 (07/11): o sonho que passa adiante. Em "o sonho que ficou", contar o sonho a quem vem depois entrega o sonho que não veio ao filho mais velho vivo; enquanto quem joga vive, o filho aparece com ele nas mãos; e quem continua a história começa a vida com o sonho de pé e acha a pasta do sonho no primeiro ano; o cartão, a folha Planos e o fim do sonho dizem de quem ele era. E, para todo sonho, cada etapa nova vira uma linha ✦ na linha do tempo (o dono: "tem que ser divertida e legal e perceptível!") (I-143)
- [ ] Na fila: a sorte grande (uma chance extraordinária por vida, ligada ao sonho), a despedida em várias cenas, ensinar o caminho a alguém, e a rival que volta na vida seguinte

O incremento 11 ("morar lá fora") ficou como rascunho e não foi publicado. Ele tem motor, 27 storylets, 15 linhas e 5 epitáfios, mas a emigração dos robôs saiu alta demais. Ele volta como a fatia 3.2 (I-23), depois da decisão sobre países reais.

## Invariantes

1. **Um formato de estado.** Pessoa, bicho, lugar, país e empresa são entidades com id, tipo, campos e qualidades. Condições e efeitos leem e escrevem caminhos (`mae.saude`, `lugar.desemprego`).
2. **Um formato de conteúdo.** Evento (o diretor escolhe), ação (o jogador escolhe) e iniciativa de personagem (a regra do personagem escolhe) são o mesmo storylet.
3. **Uma causa por mutação.** Toda mudança de estado registra quem a causou: escolha, ação, diretor, personagem ou regra. Pontos de virada e a crônica saem desse livro-razão.

## Níveis

| Nível | Conteúdo | Estado |
|---|---|---|
| 1. Fundamentos | livro-razão causal; entidades com qualidades; storylets por saliência; validador (≥2 sistemas lendo cada campo, ações em ≥2 sistemas) | **feito** (incremento 1) |
| 2. Agência | fichas de ação por ano; origem procedural | feito: fichas por ano (1 criança, 2 adolescente, 3 adulto, 2 depois dos 65), cada verbo abre todas as ações possíveis, 8 classes × 4 tipos de família × traços × linhagens, criar o personagem escolhendo tudo. Falta: famílias artística e com doença hereditária |
| 3. Mundo | balanço por entidade, setores por UF, jurisdição em dados | feito: o país vivo (dez estatísticas que se causam, o PIB, a população, o Gini e o IDH, a fase como o nome do crescimento, governos fictícios, eleição, políticas), quatro países de fora com economia e relação próprias, o dólar, 12 setores com sensibilidade ao ciclo, ao dólar e à tarifa, lugar com região, desemprego e custo de vida. Falta: setores por UF, morar em outro país |
| 4. Pessoas | relações como arestas, NPCs com nível de detalhe, regras anuais, herdeiro | feito: família viva (regras anuais, traços, iniciativas, herança, viuvez), amor por regra, herdeiro e dinastia (filho, sobrinho, testamento). Falta: arestas entre NPCs, vários filhos, confiança e dívida |
| 5. Riqueza e poder | empresas, ativos, status, cargos | feito: carreiras, carteira em cinco classes, o grupo de empresas (até cinco, subsidiárias, fusão, bolsa, a mesa de quem manda), bens, cargos e eleições, truste, brincar de deus. Falta: holding familiar como instrumento de herança |
| 6. Sandbox | política, países, narradores, vida do dia | começo: política (o país vivo, o voto, governar pelas políticas) e diplomacia (alinhamento, tarifa, sanções, acordos, o ato de quem governa lá fora). Falta: morar em outro país, narradores |

## Incremento 1: família viva + origem que importa + uma ficha por ano

- [x] Linha de base das métricas novas (ver `docs/decisoes.md`)
- [x] Estado em entidades e caminhos; livro-razão com causa por mutação
- [x] Storylets unificados (evento, ação, iniciativa de personagem) e diretor por saliência
- [x] Família viva: mãe, pai, avó e amigo com idade, saúde, dinheiro, ocupação, traço e vínculo; envelhecem, adoecem, morrem, perdem e ganham emprego, ajudam ou não
- [x] Origem: 6 classes × 4 tipos de família × traços; "escolher origem" opcional
- [x] Uma ficha por ano com 6 verbos (estudar, trabalhar extra, cuidar da saúde, ver a família, sair, poupar)
- [x] Eventos reescritos para ler família e origem (e 49 storylets novos de relações, região, classe e traço)
- [x] Validador: ≥2 sistemas lendo cada campo escrito, com uma leitura que decide; ações em ≥2 sistemas
- [x] Save v2 (reinício limpo com aviso; memória entre vidas preservada)
- [x] Portões: V5 77,0% (≤ 80%); assinaturas 893 (≥ 845); desvio da felicidade 8,57 (≥ 7,45); toques 115 (≤ 155); nenhuma estratégia dominante
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 2: o mundo reage e a riqueza vira sistema

- [x] Ciclo da economia do país (normal, expansão, recessão, crise) em dados, com a fase como qualidade do país e causa do que provoca
- [x] 12 setores; ocupações e empregos com setor; salário e demissão pelo setor e pela fase; servidor estável
- [x] Curso pela nota do ENEM e primeiro emprego pela área
- [x] Pais: emprego pelo setor e pela fase, poupança que rende com a fase, negócio da família que pode falir
- [x] Padrão de vida com decisão (sobe com salário e herança, não desce sozinho, a conta chega quando a reserva acaba)
- [x] Herança como bifurcação e riscos proporcionais ao patrimônio
- [x] Conteúdo de cauda longa: setor × fase, região × fase, classe × fase, apartamento na planta
- [x] Interface: fase do país e setor no cabeçalho; notícias do país na linha do tempo
- [x] Portões: mundo nos pontos de virada 10,7% (≥ 5,8%); pobre → rico 6,3% e rico → pobre 5,3% (≥ 4,5%); Spearman 0,45; V20 94,4% (≤ 95%); assinaturas 918 (≥ 893); CPU 16,9 ms (≤ 30 ms); nenhuma estratégia dominante; zero falsos dilemas
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 3: dinastia, dinheiro com escolha e empresa

- [x] Continuar como herdeiro (filho; sem filho, sobrinho por testamento), com partilha: dívidas, imposto de 4%, metade do cônjuge, testamento solidário
- [x] Classes bilionária e trilionária na origem
- [x] Carteira em 5 classes que rendem pela fase, 3 perfis, aplicar e resgatar pela folha Dinheiro
- [x] Padrão de vida escolhido (simples, confortável, luxo); velhice que não derrete fortuna
- [x] Empresa como entidade: abrir (setor e capital), retirada, aporte, venda, rodada, bolsa, quebra; passa ao herdeiro
- [x] Duas fichas por ano dos 18 aos 40; anos mais cheios; saldo do ano na linha do tempo
- [x] Portões: herdeiro possível 87,9%; 3ª geração 57,7%; ≥ R$ 100 milhões 1,07% de quem nasce sem fortuna; bilionário feito 0,11%; quebra 35%; anos adultos vazios 19,7%; V20 94,0%; assinaturas 938

## Incremento 4 (pedido do dono em 07/10): liberdade de verdade

- [x] Escolher a ação dentro do verbo; três fichas para adultos
- [x] 49 profissões com requisitos, cargos, pirâmide de promoção e fama (folha Carreira)
- [x] 30 bens: moradia (morar, alugar, financiar), imóveis de renda, lazer, veículos, luxo e mídia
- [x] Poder: influência, eleições municipais e gerais, mandato, popularidade, queda do cargo, decretos que mexem no ciclo
- [x] Linhagens: família real, Regime, famosa, do futebol, de políticos, do agro, de circo, imigrante, militar
- [x] Truste: comprar concorrentes; três compras fazem um truste (e uma investigação)
- [x] Infância variada: ações e acontecimentos por classe, região e família
- [x] "Nova vida" abre a escolha da origem; testamento escolhido em vida (par, amigo, sobrinhos, causa, bicho)
- [x] App Android (APK) com link no topo do README, gerado a cada push na `main`
- [x] Portões: zero storylets mortos; nenhuma estratégia domina; bilionário feito 0,92%; V20 92,6%; toques 451 (teto 480)

## Incremento 5 (pedido do dono em 08/10): brincar de deus

- [x] Tipo de storylet `jogada`: a folha Dinheiro mostra o que a fortuna permite, com o preço; a escolha é do jogador e não gasta ficha
- [x] 14 jogadas, de R$ 6 milhões a R$ 500 bilhões: festa do século, estátua, Carnaval, Pix para a cidade, fundação (4 causas), bancar um presidente, Copa do Mundo, cura de doença, programa espacial (com ida à Lua), cidade nova, estatal de energia, salvar o país da crise, fundar um país, colônia em Marte
- [x] O mundo responde: 46 eventos agendados e sorteados que leem as marcas (lei da herança que baixa o imposto para 1%, apagão, calote do governo, patente da cura, greve na ilha, asteroide com o seu nome…)
- [x] Portões: as 14 jogadas acontecem; 98% das vidas de fortuna fazem jogadas (8,2 por vida); 79% das jogadas causam algum acontecimento depois

## Incremento 6 (as 250 ideias do dono, 11/10): quem manda e o porquê

- [x] A empresa depende de quem manda (`empresa.dependencia`): o talento pesa nessa proporção, o tamanho trava mais, a morte de quem manda custa valor (com a morte como causa) e quem compra desconta; o herdeiro fica sabendo na abertura
- [x] Delegar e centralizar são decisões: 5 jogadas na seção Empresa (um conselho que diz não, um mural de problemas, tornar-se dispensável, uma equipe para desmontar, bancar quem quer sair), 8 reações agendadas e 5 eventos que leem a dependência; contratar um executivo e passar o comando ao filho também delegam
- [x] O porquê na linha do tempo: cada acontecimento aponta a decisão (ou o fato do mundo) de um ano anterior que o causou
- [x] Portões: quem manda é decisão em 39,5% das vidas com empresa de R$ 1 milhão; entre as de R$ 15 milhões, 20,8% delegaram e 57,2% centralizaram; o porquê aparece em 21,8% dos acontecimentos (16,5 por vida); zero storylets mortos
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 7 (pedidos do dono em 11/10): as crises acabam, a vida começa sua

- [x] A crise interminável: o empurrão de quem governa vale pela direção da mudança (aquecer ajuda a sair da crise; antes, prendia)
- [x] Aluguéis e valorização à vista: o aluguel do ano em chip próprio, o balanço do ano conta os bens, cada imóvel mostra por quanto foi comprado e quanto mudou; o mercado de imóveis não perde valor no longo prazo
- [x] Criar o personagem: nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos, jeito e talentos (pontos), tudo opcional
- [x] Primeira infância com causa e efeito: o parto (prematuro), quem cuida, vacina, fome, histórias ou telas, brigas em casa, pré-escola, o peito que chia, o balde da pracinha; o que volta dos 5 aos 12; ações dos 1 aos 4 anos; a primeira palavra pela família
- [x] Portões: crises com mediana de 1 ano e 99% em até 7; 975 começos distintos por 1.000 vidas; 100% das vidas decidem antes dos 5; em 45%, algo dos 5 aos 12 tem causa nos primeiros anos; zero storylets mortos. Caiu: o rico que termina pobre (2,5%, portão de 3,0%)
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 8 (pedido do dono em 11/10): o país vivo

- [x] O país ganha dez estatísticas que se causam (crescimento, desemprego, inflação, juros, dívida pública, pobreza, violência, saúde e educação públicas, aprovação do governo), com atraso como na vida real: a escola leva uma geração
- [x] A fase do ciclo deixa de ser sorteada: é o nome do crescimento, com folga para sair dela
- [x] Quatro blocos fictícios (a frente popular, o bloco liberal, a aliança da ordem, o centrão) e o regime; eleição geral de quatro em quatro anos, pela aprovação e pelo que o eleitor quer; nenhum bloco é o melhor em tudo
- [x] O voto de quem joga (o primeiro voto e as eleições seguintes) pesa no resultado e volta como "o governo que você elegeu"
- [x] Quem governa (presidente, monarca, chefe do Regime) muda as políticas pela folha País, uma reforma por ano, com o efeito à vista antes
- [x] O país na vida: emprego e salário pelo crescimento e pelo desemprego; imposto e auxílio no bolso; juros na dívida e na renda fixa; saúde pública na mortalidade; violência que mata; escola pública na inteligência
- [x] Folha País: o governo, as estatísticas com a seta do ano e para onde vão, e as políticas
- [x] Portões do incremento 8 (docs/decisoes.md)
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 9 (pedido do dono em 11/10): o grupo de empresas

- [x] Até cinco empresas de uma vez; a que quem joga cuida de perto é a de que o conteúdo fala (os eventos, as jogadas de quem manda e o "Trabalhar" do ano), e trocar é decisão dele
- [x] A concorrente comprada vira subsidiária, com as subsidiárias dela (o caminho para as centenas); vender subsidiárias dá dinheiro sem largar a empresa
- [x] Fundir duas empresas de quem joga: a absorvida vira subsidiária; no mesmo ramo, corte de custos e um passo para o truste; em ramos diferentes, o grupo da família, com desconto de conglomerado
- [x] Abrir o capital de cada uma (a mesma mecânica do evento): vale mais, vende um pedaço na estreia, depende menos de quem manda e passa a andar com o humor da bolsa
- [x] A mesa de quem manda: o talento se divide entre as empresas que dependem dele; a outra que afunda vem para a mesa (a quebra é dela)
- [x] O grupo inteiro passa ao herdeiro; o conglomerado dá influência
- [x] A seção Empresa da folha Dinheiro vira a árvore do grupo (uma linha por empresa; tocar abre os números e o que dá para fazer)
- [x] O nome da empresa concorda com o artigo em todo texto ("o Instituto Silva", "a Clínica Silva", "o Grupo Silva")
- [x] Portões do incremento 9 (docs/decisoes.md)
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Incremento 10 (o roteiro; o dono pediu a próxima em 12/10): o mundo lá fora

- [x] Quatro países fictícios (a Federação do Norte, a República Celeste, a Liga Atlântica, o Pacto do Sul), cada um com a economia dele, o que compra do Brasil, a relação com o Brasil e, às vezes, um rival
- [x] Alinhamento: cada governo daqui se aproxima de uns e esfria com os rivais deles; a tarifa (a política de comércio exterior) mexe no potencial, na inflação e na relação com todos
- [x] Sanção e acordo nascem da relação, acabam quando ela muda (a sanção também cansa) e apontam a decisão que a levou até ali
- [x] A crise e o boom lá fora viram notícias e chegam aqui: no crescimento, na inflação, na fase (a notícia é a causa da virada) e no que o mundo compra
- [x] O dólar anda com o mundo, com a dívida, com os juros e com a economia daqui; pesa na inflação, no investimento em dólar, nas empresas de cada setor e no salário em dólar
- [x] Quem governa faz um ato lá fora por ano (visita de Estado, acordo, romper), com a chance de sanção à vista antes
- [x] Folha País: a seção "Lá fora" (o dólar e cada país); 18 eventos e 13 linhas
- [x] Portões do incremento 10 (docs/decisoes.md)
- [ ] O dono joga 3 vidas e conta o que viu de inédito na 3ª

## Próximos incrementos

As fatias da missão, na ordem de `docs/arquitetura.md` (fases 1 a 9). O que estava aqui antes virou ideia registrada em `docs/ideias.md`:
- a holding familiar é a I-13;
- morar lá fora é a I-23;
- o crime é a I-90;
- vários filhos e o ex são a I-05;
- a velhice com mais escolhas é a I-91.

## Como uma sessão continua

1. `npm run verificar` precisa passar antes de qualquer push.
2. Rode `npm run tunel` e compare com os portões em `docs/decisoes.md`.
3. Atualize as caixas acima e a tabela de níveis quando algo entrar.
