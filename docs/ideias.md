# Registro de ideias

Toda ideia para o Trajetória entra aqui antes de entrar no código. Nenhuma é descartada por estar fora da fase: o que falta para ela fica em "Depende de". Ela só vai para o código quando as dependências estão prontas e `docs/arquitetura.md` diz em que módulo ela mora.

Começou na Fase 0 da missão "Universo de bolso" (12/10/2026), com as ideias da missão, o que sobrou do `docs/roteiro.md` e as propostas abertas de `docs/auditoria.md`.

## Como registrar

Cada ideia tem um bloco com estes campos:

- **Problema:** a experiência que melhora, ou o defeito que resolve.
- **Módulos:** os números de `docs/arquitetura.md`:
  1. tempo;
  2. entidades;
  3. livro e contas;
  4. economia;
  5. patrimônio e empresas;
  6. governo;
  7. geografia;
  8. diplomacia;
  9. defesa;
  10. sociedade;
  11. agentes;
  12. causalidade;
  13. interface.
- **Depende de:** as ideias que precisam vir antes.
- **Custo:**
  - de implementação: P (parte de uma sessão), M (uma sessão), G (várias sessões) ou GG (uma fase);
  - de simulação: CPU por vida e tamanho do save.
- **Consome na simulação:** o recurso finito que ela usa ou cria (dinheiro de alguém, tempo, pessoas, capacidade).
- **Efeitos causais:** o que passa a causar o quê.
- **Riscos de regressão.**
- **Aceitação:** como saber que ficou pronta, de preferência um teste ou uma medida do túnel.
- **Prioridade e fase.**
- **Estado:**
  - proposta;
  - rascunho (código começado, não publicado);
  - em andamento;
  - feita;
  - adiada (com o motivo).

Ideia nova vai no fim da fase dela, com o próximo número livre.

## A ordem do dono (19/10/2026)

O dono pediu atualizações em blocos pequenos, nesta ordem de interesse. A ordem de execução segue as dependências: o Tesouro vem antes de quem recebe dele.

| Bloco | O que o dono pediu | Ideias | Estado |
|---|---|---|---|
| A · O país em números | PIB, PIB per capita, Gini, IDH e população | I-96 (e o começo da I-70) | feito (19/10) |
| B · O Tesouro | dívida soberana comprada vira ativo no balanço, com cupom no caixa pessoal ou da empresa | I-31, I-34 | feito (25/10): o título na conta pessoal e o calote; o da empresa espera o caixa (I-11) |
| C · A coroa recebe | o soberano recebe salário, parte dos impostos ou taxa da coroa | I-41, I-43 | feito (26/10): a forma da coroa e a ilha com população e PIB; a legitimidade (I-42) e o ditador ficam para depois |
| D · O Estado pesquisa | usar o Tesouro do Estado para pagar pesquisa e desenvolvimento | I-54 | feito (26/10): a política de ciência, o estoque de tecnologia e as descobertas; o orçamento item por item e a pesquisa das empresas ficam para depois |
| E · Defesa | sistemas de armamento e guerra | I-60, I-61 | feito (26/10): a política de defesa, a capacidade, os sistemas de armamento e a guerra como processo (o começo, os anos e o fim); a ocupação, a mobilização da economia e as alianças militares ficam para depois |

## A segunda ordem do dono (26/10/2026)

Depois do bloco E, o dono jogou e mandou duas mensagens: uma com defeitos do poder ("não estou herdando o regime, a monarquia ou a soberania", "não consigo dar um golpe de Estado", "não consigo governar a ilha") e outra com tudo o que ele quer do jogo. Resumo dela, nas palavras dele:
- governar o país e a cidade que fundou; tomar o poder e governar vitalício; os herdeiros recebem a sucessão;
- o controle dos impostos é simples demais; com trilhões, financiar o Estado com dinheiro privado;
- as empresas sem caixa, sem expansão física e sem pesquisa e desenvolvimento; um simulador de empresas completo;
- quem funda o país e vira soberano continua no Brasil e continua governando o Brasil;
- o dinheiro emprestado ao Estado, a dívida do Estado comprada e os nomes do SPC e do Serasa não entram no patrimônio nem rendem; outros bens que deveriam render não rendem;
- com riqueza astronômica, não há o que fazer: uma progressão civilizatória;
- resolver a morte pela ciência (a reversão do envelhecimento e a continuação do senso de eu);
- escolher quando ter filhos;
- mais mecânicas, liberdade, histórias e opções; interfaces mais agradáveis; economia e mercado financeiro melhores; mais profissões, diplomas e graduações; o sistema acadêmico e o de carreiras completos; sistemas de governo completos; o mapa-múndi e países de verdade; mais gráficos; causalidade em tudo; os erros de gramática corrigidos; NPCs inteligentes; descobrir coisas que nem sabia que existiam.

Não cabe de uma vez. A ordem abaixo começa pelos defeitos (o que já existe e não funciona) e segue pelo que mais muda o que dá para fazer numa vida, um bloco publicado de cada vez:

| Bloco | O que entra | Ideias | Estado |
|---|---|---|---|
| F · O poder que passa | a sucessão imediata da coroa, do regime e da ilha para quem continua a história (com regência abaixo dos 18); o golpe e o autogolpe (governar vitalício); quem funda o país deixa o cargo no Brasil; o dinheiro que salva o país vira título | I-106, I-107, parte da I-108, D-01, D-03, D-04 | feito (26/10) |
| F2 · Governar o que você fundou | a ilha e a cidade fundadas como territórios: imposto e obras pagas do próprio bolso | o resto da I-108 | próximo |
| C4 · O texto revisado | a varredura de gramática do conteúdo inteiro, com regras novas no validador | I-120 | proposta |
| K · Filhos quando quiser | tentar ter filho, adotar e planejar, com a fertilidade pela idade | I-113 | proposta |
| I · O dinheiro que rende | os bens que produzem (a fazenda, a emissora, o iate fretado), a carteira de dívidas do SPC e do Serasa como ativo, e o empréstimo aos bancos como contrato | I-112 | proposta |
| H · A empresa de verdade | o caixa da empresa, o lucro com origem, a pesquisa e desenvolvimento, as fábricas e lojas, e o título comprado pela empresa | I-11, I-111 | proposta |
| J · A vida longa | a ciência da longevidade, paga pela empresa, pela fundação ou pelo Estado, com etapas até a reversão do envelhecimento e a continuidade do eu | I-114 | proposta |
| G · Os impostos | os impostos um por um (renda, consumo, empresas, fortunas, herança) e o Estado financiado por quem joga | I-109, I-110, I-31 | proposta |
| L · A escola inteira | graduação, mestrado e doutorado, diplomas e bolsas; mais profissões e carreiras completas | I-116, I-117 | proposta |
| M · A civilização | o que fazer com riqueza astronômica: energia, espaço, cidades, inteligência artificial, uma árvore de progresso | I-115 | proposta |
| P · Os gráficos | o patrimônio, a felicidade e o país ao longo da vida | I-80, I-119 | proposta |
| N · Os governos | formas de governo (parlamento, federação, poderes separados) | I-40, I-44 | proposta |
| O · O mundo | o mapa-múndi e os países de verdade | I-20, I-22, I-118 | proposta: pede a decisão do dono sobre a política fictícia (abaixo) |

**A decisão do dono que falta:** os países de verdade batem num requisito dele mesmo, "política fictícia e genérica" (o motivo é a identidade e o risco legal). A proposta da I-118 é manter fictícios os governos, os partidos e as pessoas, e trazer reais a geografia, a economia e os nomes dos países. A guerra com um país de verdade fica de fora até ele decidir.

## A missão Ω (26/10/2026)

O dono pediu um salto, não mais um bloco: "o jogo está muito repetitivo, não tem nada criativo, único, original", "só atualize o jogo quando voltar com algo que de fato se compare a um jogo muito bem construído", e entregou um backlog mestre e uma missão (o jogador passa de "o que acontece agora?" para "o que eu posso fazer?"). O diagnóstico e a decisão estão em `docs/auditoria-omega.md`. As camadas vão para o branch de trabalho, cada uma com o `verificar` passando, e a `main` recebe o conjunto. Os blocos da segunda ordem entram onde cabem (os filhos quando quiser viram um projeto, a I-113).

| Camada | O que entra | Ideias | Estado |
|---|---|---|---|
| Ω1 · A rede | irmãos, ex, amigos novos, colegas e chefe como pessoas com vida própria, em duas escalas; a notícia quando importa | I-05, I-21, I-121, I-130, I-131 | em andamento |
| Ω2 · Os verbos sociais | pedir, oferecer, propor, cobrar, contar e apresentar, para qualquer pessoa, que decide pelo estado e pela memória e diz por quê | I-123 | proposta |
| Ω3 · Os projetos | o que você quer, com etapas que são ações de verdade e o progresso tirado do estado | I-124, I-113 | proposta |
| Ω4 · Os segredos | quem sabe o quê, o boato, a revelação, a chantagem | I-125 | proposta |
| Ω5 · A história reconhecida e o caminho não tomado | a peneira que reconhece os arcos no livro (os capítulos) e a vida que não foi | I-126, I-127 | proposta |
| Ω6 · O ritmo e a medida | os anos tranquilos, o apoio às histórias começadas e a diversidade pela estrutura causal | I-128, I-129 | proposta |

### I-130 · O namoro que esfria e o ex que continua
- **Problema:** o namoro só acabava numa crise rara, e quem ia embora sumia: o amor de antes ficava no lugar do amor para sempre, sem vida e sem memória. Só 12% das vidas chegavam a ter um ex.
- **Efeitos causais:** a pessoa tem identidade (um número e quem ocupou cada papel desde quando); o amor que vai embora vira ex, com a memória dele; quem chega no lugar começa do zero. O namoro sem casamento esfria (a chance cresce na juventude e com o vínculo baixo) e quem joga decide: salvar, terminar ou deixar morrer. O ex vive ao fundo (saúde, morte, a relação que esfria) e volta: o reencontro, o convite de casamento, a ligação de madrugada, o hospital, a cobrança, a volta e a segunda chance.
- **Aceitação:** teste: o amor novo não lembra do antigo, o ex lembra, o ex que volta é a mesma pessoa, o livro fecha; no túnel, um terço das vidas tem ex, e o casamento e os filhos ficam onde estavam (59% e 42% em 400 vidas, contra 60% e 41%).
- **Estado:** feita (Ω1).

### I-131 · Os irmãos com vida própria
- **Problema:** os irmãos eram um número: dividiam a herança com "os parentes" e nunca apareciam.
- **Efeitos causais:** os mais velhos nascem com a família (os adultos já trabalham), os mais novos nascem nos primeiros anos (se a mãe estiver viva), e às vezes há um gêmeo. Cada irmão vive ao fundo: o primeiro emprego, a demissão, o casamento, os filhos (os sobrinhos), a separação, a mudança para longe. Com quem está perto, o casamento e o primeiro filho chegam como convite (padrinho, discurso, batizado); com quem está longe, como notícia. A herança dos pais vai para a conta de cada irmão; quem herda leva os irmãos para a vida nova, e o sobrinho que herda é filho de um irmão de verdade.
- **Aceitação:** teste: a escolha de três irmãos dá três; o mais novo nasce no ano marcado; a herança da mãe se divide em partes iguais; o herdeiro leva o irmão; o sobrinho tem o irmão como pai ou mãe.
- **Estado:** feita (Ω1).

### I-123 · Os verbos sociais
- **Problema:** com uma pessoa, hoje, só dá para fazer as ações escritas para o papel dela (visitar, ligar, presentear). Não dá para pedir dinheiro, pedir um emprego, oferecer sociedade, cobrar uma dívida ou contar uma verdade, e a pessoa não decide nada: o storylet decide.
- **Efeitos causais:** um verbo (pedir, oferecer, propor, cobrar, contar, apresentar) com um objeto (dinheiro, ajuda, emprego, perdão, sociedade, casamento, morar junto) vale para qualquer pessoa. Ela decide pelo vínculo, pela confiança, pela mágoa, pelo traço, pelo dinheiro que tem, pelo que acha de você e pelo momento, e diz o porquê. O empréstimo entre pessoas é um contrato com ela de credora; o calote vira mágoa, e o favor pago, confiança. As pessoas também pedem a você.
- **Aceitação:** teste: a mesma pergunta, com a mesma pessoa, sai diferente com a mágoa alta e com a confiança alta; o empréstimo fecha as contas e aparece nas dívidas; o porquê aponta a entrada que pesou.
- **Estado:** proposta (Ω2).

### I-124 · Os projetos
- **Problema:** o jogador não pode querer nada. A vida é uma sequência de respostas.
- **Efeitos causais:** o jogador escolhe até três projetos (sair das dívidas, reparar uma relação, ter um filho, mudar de cidade, abrir uma empresa, chegar a um cargo, comprar a casa, cuidar da saúde, a independência financeira). Cada um mostra as etapas possíveis, que são ações, operações e verbos que já existem; o progresso é lido do estado; o projeto dá histórias próprias e termina em conquista, desistência ou prazo vencido, com a causa no livro.
- **Aceitação:** teste de cada projeto do começo ao fim; no túnel, os robôs perseguem projetos e a saturação cai.
- **Estado:** proposta (Ω3).

### I-125 · Os segredos
- **Problema:** todo mundo sabe o que a vida de quem joga mostra; nada fica escondido, nada é descoberto.
- **Efeitos causais:** algumas escolhas criam segredos (o caso, a dívida escondida, o crime, o filho fora do casamento); cada pessoa sabe o que viu, ouviu ou descobriu; a informação corre pela rede pelo traço e pela proximidade; a opinião só usa o que a pessoa sabe; a revelação e a chantagem são consequências; descobrir quem espalhou vira projeto.
- **Aceitação:** teste: o segredo que ninguém sabe não muda opinião nenhuma; o que a irmã sabe pode chegar à mãe, não ao chefe sem caminho.
- **Estado:** proposta (Ω4).

### I-126 · A peneira: os capítulos da vida
- **Problema:** o livro guarda o porquê de tudo, mas a vida aparece como uma lista de anos, e o rastro de uma simulação não é uma história sozinho.
- **Efeitos causais:** padrões declarados sobre o livro (a amizade que virou sociedade, a volta por cima, a dívida que virou briga, o favor devolvido, o amor reencontrado) reconhecem os arcos de cada vida e os mostram como capítulos, na linha do tempo e no cartão; o diretor apoia o arco começado.
- **Aceitação:** teste de cada padrão com uma vida montada; no túnel, a parte das vidas com capítulos e a variedade deles.
- **Estado:** proposta (Ω5).

### I-127 · O caminho não tomado
- **Problema:** o jogador não tem como saber o peso de uma escolha.
- **Efeitos causais:** o save guarda os comandos; no fim, o jogador escolhe um ponto de virada e vê a vida que não viveu: a mesma semente, as mesmas decisões até ali, a outra opção naquele ponto e um robô com o jeito dele depois. É um experimento dentro do modelo, não uma previsão, e a tela diz isso.
- **Aceitação:** teste: refazer sem trocar nada dá a mesma vida; trocar a escolha muda a vida a partir dali.
- **Estado:** proposta (Ω5).

### I-128 · O ritmo e o apoio às histórias
- **Problema:** o diretor não sabe se a vida está agitada ou parada, e o arco começado pode não ter fim.
- **Efeitos causais:** anos tranquilos depois de anos pesados; o storylet que dá continuidade a um arco começado ganha peso.
- **Estado:** proposta (Ω6).

### I-129 · A diversidade pela estrutura causal
- **Problema:** a assinatura de vida mede o destino (classe, carreira, estado civil), não o caminho. Duas vidas com os mesmos números e causas diferentes contam igual.
- **Efeitos causais:** o túnel mede a diversidade pelas cadeias de causa (quem levou a quê) e pelos capítulos, ao lado da saturação.
- **Estado:** proposta (Ω6).

## Índice

| Id | Ideia | Fase | Prioridade | Estado |
|---|---|---|---|---|
| I-01 | Contas com contrapartida e o extrato do ano | 1 | Alta | feita (fatia 1.1) |
| I-02 | Dívida e financiamento como contrato | 1 | Alta | feita (fatia 1.2, 12/10) |
| I-03 | O ano em etapas declaradas | 1 | Alta | feita (fatia 1.3) |
| I-04 | Livro compacto (anos antigos em resumo) | 1 | Alta | reavaliada: adiada com números (fatia 1.3) |
| I-05 | Identidade de pessoas e relações como arestas | 1 | Alta | parcial: vários filhos (fatia 1.4a); a rede no formato dos filhos (Ω1) |
| I-06 | Causa com contribuição e explicação incompleta | 1 | Média | proposta |
| I-07 | Comparar cenários ("e se") | 1 | Baixa | proposta |
| I-08 | Túnel mais barato (CPU por vida) | 1 | Alta | feita no critério (fatia 1.3); o próximo ganho é indexar os storylets |
| I-10 | Gestor de patrimônio com mandato | 2 | Alta | proposta |
| I-11 | Caixa da empresa e lucro com origem | 2 | Alta | proposta |
| I-12 | Diretor executivo e conselho que propõem | 2 | Média | proposta |
| I-13 | Holding familiar | 2 | Alta | proposta (estava no roteiro) |
| I-14 | Family office e fundos privados | 2 | Média | proposta |
| I-15 | Fundação com orçamento próprio | 2 | Média | proposta |
| I-16 | Concierge e gestão do estilo de vida | 2 | Média | proposta |
| I-17 | Contrato de serviço genérico | 2 | Alta | proposta |
| I-18 | Sucessão por instrumentos (doação em vida, truste, holding) | 2 | Média | proposta |
| I-20 | Países reais como condição inicial | 3 | Alta | proposta (decisão do dono) |
| I-21 | Nível de detalhe do mundo | 3 | Alta | proposta |
| I-22 | Mapa navegável | 3 | Média | proposta |
| I-23 | Morar em outro país: residência, visto e cidadania | 3 | Alta | rascunho (incremento 11) |
| I-24 | Reconhecimento limitado e territórios disputados | 3 | Baixa | proposta |
| I-25 | Mudar de cidade no Brasil | 3 | Média | proposta |
| I-30 | Banco como entidade (crédito e criação de dinheiro) | 4 | Alta | proposta |
| I-31 | Tesouro: o orçamento do Estado em reais | 4 | Alta | parcial (bloco B): a dívida em reais e quem empresta |
| I-32 | Banco central e política monetária | 4 | Média | proposta |
| I-33 | Moedas por país, regime cambial e moeda de reserva | 4 | Média | proposta |
| I-34 | Dívida soberana com credores, calote e contágio | 4 | Alta | feita em parte (bloco B, 25/10): o título de quem joga e o calote; faltam a empresa e o contágio |
| I-35 | Falência, reestruturação e intervenção | 4 | Média | proposta |
| I-36 | Setor privado agregado por país | 4 | Média | proposta |
| I-40 | Poderes separados | 5 | Alta | proposta |
| I-41 | Monarquia institucional e Casa Real | 5 | Alta | feita em parte (bloco C, 26/10): a renda da coroa tem forma e regra; falta a legitimidade à parte (I-42) |
| I-42 | Indicadores separados de poder, riqueza, prestígio e legitimidade | 5 | Média | proposta |
| I-43 | Criar um Estado | 5 | Média | começada (bloco C, 26/10): a ilha com população, PIB e imposto |
| I-44 | Formas de Estado e de governo | 5 | Média | proposta |
| I-50 | Tratados como objetos | 6 | Média | proposta |
| I-51 | Alianças e blocos econômicos | 6 | Média | proposta |
| I-52 | Instituições multilaterais | 6 | Média | proposta |
| I-53 | Poder nacional por dimensões | 6 | Média | proposta |
| I-54 | Pesquisa e tecnologia como estoque | 6 | Média | feita em parte (bloco D, 26/10): o investimento vira estoque e o estoque vira produtividade, com causa no livro; faltam a pesquisa das empresas e o setor privado (I-36) |
| I-60 | Forças armadas como capacidade | 7 | Média | feita (bloco E, 26/10): a capacidade com custo, a política e os sistemas de armamento |
| I-61 | Guerra como processo com custos | 7 | Média | parte feita (bloco E, 26/10): o começo, os anos de guerra e o fim (vitória, derrota ou cessar-fogo); a ocupação e a reconstrução ficam |
| I-62 | Coerção econômica além da sanção | 7 | Baixa | proposta |
| I-63 | Espionagem, influência, ciber e guerra híbrida | 7 | Baixa | proposta |
| I-64 | Mudança de fronteira e suas consequências | 7 | Baixa | proposta |
| I-70 | Demografia por coortes | 8 | Média | parcial: a população como número (bloco A); faltam as coortes |
| I-71 | Religião e cultura como distribuições que mudam | 8 | Baixa | proposta |
| I-72 | Movimentos sociais e ideologias | 8 | Baixa | proposta |
| I-73 | Projetos de sociedade (utopia, distopia, ultrarquia, distrarquia) | 8 | Baixa | proposta |
| I-80 | Histórico de indicadores na interface | 9 | Média | proposta |
| I-81 | Alertas e decisões pendentes num lugar só | 9 | Média | proposta |
| I-82 | Relatórios dos agentes | 9 | Média | proposta |
| I-83 | Orçamento de CPU e de save por módulo no túnel | 9 | Alta | parcial (fatia 1.3) |
| I-84 | Interface sem regra copiada do motor | 9 | Média | proposta (auditoria de 11/10) |
| I-90 | Crime com consequência | — | Baixa | proposta (roteiro) |
| I-91 | Velhice com mais escolhas | — | Baixa | proposta (roteiro) |
| I-92 | Setores por UF | — | Baixa | proposta (roteiro) |
| I-93 | Famílias artística e com doença hereditária | — | Baixa | proposta (roteiro) |
| I-94 | Narradores | — | Baixa | proposta (roteiro) |
| I-95 | A imagem pública esmaece sem cargo | — | Baixa | proposta (auditoria de 11/10) |
| I-96 | O país em números: PIB, população, PIB per capita, Gini e IDH | — | Alta | feita (bloco A, 19/10) |
| I-97 | A cara nova: tema noite e ouro, retrato, cartões de indicadores e de dinheiro, verbos com ícone, botão dourado, marcos em destaque | — | Alta | feita (bloco V1, 19/10) |
| I-98 | De que é feito o patrimônio: a rosca na folha Dinheiro | — | Média | proposta (bloco V1) |
| I-99 | Escolher o tema (claro, escuro, o do celular) dentro do jogo | — | Baixa | proposta (bloco V1) |
| I-100 | O ícone do app Android na cor nova | — | Baixa | proposta (bloco V1) |
| I-106 | A sucessão que passa (a coroa, o regime e a ilha) | 5 | Alta | feito (bloco F) |
| I-107 | Tomar o poder: o golpe, o autogolpe e o governo vitalício | 5 | Alta | feito (bloco F) |
| I-108 | Governar o que você fundou (a ilha e a cidade) | 5 | Alta | em parte (bloco F; o resto no F2) |
| I-109 | O Estado financiado por quem joga | 4 | Média | proposta (bloco G) |
| I-110 | Os impostos um por um | 5 | Alta | proposta (bloco G) |
| I-111 | A empresa de verdade: caixa, pesquisa, fábricas e lojas | 2 | Alta | proposta (bloco H) |
| I-112 | O dinheiro que rende: bens que produzem, créditos que se compram | 2 | Alta | proposta (bloco I) |
| I-113 | Filhos quando quiser | — | Alta | proposta (bloco K) |
| I-114 | A vida longa: a ciência contra a morte | 8 | Média | proposta (bloco J) |
| I-115 | A progressão civilizatória | 8 | Média | proposta (bloco M) |
| I-116 | O sistema acadêmico completo | — | Média | proposta (bloco L) |
| I-117 | Carreiras completas e mais profissões | — | Média | proposta (bloco L) |
| I-118 | O mapa-múndi e os países de verdade | 3 | Média | proposta (bloco O, decisão do dono) |
| I-119 | Os gráficos da vida e do país | 9 | Média | proposta (bloco P) |
| I-120 | O texto revisado: a gramática do conteúdo inteiro | 9 | Alta | proposta (correção C4) |
| I-121 | NPCs com objetivos próprios | 9 | Média | proposta |
| I-122 | Descobrir o que não se sabia que existia | 9 | Média | proposta |
| I-123 | Os verbos sociais: pedir, oferecer, propor, cobrar, contar, apresentar | Ω | Alta | proposta (Ω2) |
| I-130 | O namoro que esfria e o ex que continua | Ω | Alta | feita (Ω1) |
| I-131 | Os irmãos com vida própria | Ω | Alta | feita (Ω1) |
| I-124 | Os projetos: o que o jogador quer, com etapas de verdade | Ω | Alta | proposta (Ω3) |
| I-125 | Os segredos: quem sabe o quê | Ω | Alta | proposta (Ω4) |
| I-126 | A peneira: os capítulos da vida reconhecidos no livro | Ω | Alta | proposta (Ω5) |
| I-127 | O caminho não tomado | Ω | Alta | proposta (Ω5) |
| I-128 | O ritmo e o apoio às histórias | Ω | Média | proposta (Ω6) |
| I-129 | A diversidade pela estrutura causal | Ω | Média | proposta (Ω6) |

(os blocos de cada ideia vêm na versão final)

## Fase 1 — o livro e as contas

### I-01 · Contas com contrapartida e o extrato do ano
- **Problema:** 86,6% das entradas do livro que mexem em dinheiro criam ou destroem dinheiro: o salário, o aluguel e o rendimento aparecem do nada, e a compra, a manutenção e a jogada somem (sonda de 450 vidas, `docs/auditoria-universo.md`). Sem contrapartida não existe credor para a dívida, orçamento para o governo, taxa para o gestor nem caixa para a empresa.
- **Módulos:** 3, 4, 13.
- **Depende de:** nada.
- **Custo:**
  - implementação: M;
  - simulação: mais mudanças no livro (medir; aceitação até +10% de CPU e de save).
- **Consome:** nada novo. As contas de fora (`mercado`, `tesouro`, `banco` e `parentes`) são contrapartes no livro, não estado.
- **Efeitos causais:**
  - o salário sai do mercado ou do tesouro;
  - o imposto vai para o tesouro;
  - o juro vai para o banco.
  O extrato do ano mostra para onde foi cada real.
- **Riscos:**
  - mudar números por causa da ordem das somas. Por isso a aritmética do estado fica igual e só a anotação no livro muda;
  - quebrar o fechamento do livro.
- **Aceitação:**
  - conservação entrada por entrada: a soma do dinheiro de todas as contas só muda por reavaliação ou por emissão registrada;
  - 0% de entradas com dinheiro sem contraparte em 10.000 vidas;
  - `docs/metricas.md` igual ao de antes, fora as linhas novas;
  - o extrato na folha Dinheiro.
- **Prioridade:** Alta · Fase 1 (fatia 1.1).
- **Estado:** feita (fatia 1.1, 12/10). O livro guarda a contraparte (`Mudanca.p`); `contas.ts` confere e faz o extrato. O túnel conta 0 problemas, e as métricas das vidas saíram iguais.

### I-02 · Dívida e financiamento como contrato
- **Problema:**
  - a dívida é um número só em quem joga (`eu.divida`);
  - o cheque especial nasce sozinho quando o dinheiro fica negativo (`economia.ts › acertarCaixa`) e é pago sozinho quando sobra dinheiro;
  - não existem credor, prazo, parcela, atraso nem inadimplência.
- **Módulos:** 3, 4, 5, 13.
- **Depende de:** I-01.
- **Custo:**
  - implementação: M;
  - simulação: baixo (poucos contratos por vida).
- **Consome:** o crédito do banco: limite pela renda, como hoje, e mais tarde pelo capital do banco (I-30).
- **Efeitos causais:**
  - parcela atrasada leva a juro de mora, nome sujo e limite menor;
  - garantia executada leva à perda do bem;
  - renegociação é uma decisão.
  `eu.divida` vira um campo derivado (a soma dos saldos), para o conteúdo continuar valendo.
- **Riscos:**
  - mudar a distribuição de patrimônio;
  - storylets que escrevem `divida` precisam virar contratos: o efeito `divida` cria um contrato com o banco.
- **Aceitação:**
  - todo saldo devedor tem um credor;
  - a soma do que se deve é igual à soma do que se tem a receber;
  - juros, pagamentos, atrasos e inadimplência testados;
  - o túnel sem estratégia dominante.
- **Prioridade:** Alta · Fase 1 (fatia 1.2).
- **Estado:** feita (fatia 1.2, 12/10).
  - Toda dívida é um contrato com o banco (`contratos.ts`, `dividas.ts`): cheque especial, empréstimo, financiamento com garantia e acordo.
  - O atraso suja o nome; o financiamento atrasado vai a leilão; a dívida caduca em cinco anos; renegociar é decisão.
  - O túnel confere, em toda entrada, que o que se deve é o que o banco tem a receber.

### I-03 · O ano em etapas declaradas
- **Problema:**
  - a ordem do ano está só no código de `vida.ts › avancarAno`;
  - uma etapa pode ler o que outra escreveu no mesmo ano sem que ninguém declare;
  - o túnel custa 88 ms por vida, e o perfil não tem um gargalo só.
- **Módulos:** 1, 12.
- **Depende de:** nada; fica mais fácil depois de I-01.
- **Custo:**
  - implementação: M;
  - simulação: neutra, ou ganho, se as etapas puderem pular quem não muda.
- **Consome:** nada.
- **Efeitos causais:** a ordem passa a ser dado: "a economia do ano lê o crescimento deste ano, que a diplomacia escreveu antes".
- **Riscos:** mudar a ordem muda as vidas. A primeira versão só declara a ordem atual, sem mudá-la.
- **Aceitação:** a lista de etapas com leituras e escritas, e um teste que falha se uma etapa escreve o que não declarou.
- **Prioridade:** Alta · Fase 1 (fatia 1.3).
- **Estado:** feita (fatia 1.3, 18/10).
  - `manifesto.ts › ETAPAS_DO_ANO`: as 19 etapas do ano, na ordem, cada uma com o que lê e escreve (o estado, a agenda e o que passa entre as etapas). `vida.ts` roda a lista.
  - `test/ano.test.ts` joga vidas com um gravador e falha se uma etapa lê ou escreve o que não declarou.
  - `dependenciasDoAno` tira das declarações o que cada etapa lê deste ano e do ano passado; o túnel mostra a tabela.
  - A ordem não mudou: as vidas são as mesmas.

### I-04 · Livro compacto
- **Problema:**
  - o save tem 275 KB por vida na mediana (447 KB no máximo), quase tudo o livro;
  - dinastias e um mundo maior multiplicam isso, e o localStorage tem uns 5 MB.
- **Módulos:** 3, 12, 13.
- **Depende de:** I-03, para saber o que é resumível.
- **Custo:**
  - implementação: M;
  - simulação: menos memória.
- **Consome:** nada.
- **Efeitos causais:** nenhum. As causas antigas continuam apontáveis: a entrada vira resumo, mas guarda o id e o texto.
- **Riscos:**
  - perder o porquê de um acontecimento antigo;
  - quebrar o teste de fechamento. O resumo guarda o saldo de abertura.
- **Aceitação:**
  - o save de uma dinastia de 5 gerações abaixo de 1 MB;
  - os pontos de virada iguais antes e depois de compactar.
- **Prioridade:** Alta · Fase 1.
- **Estado:** reavaliada e adiada (fatia 1.3, 18/10). Os números do túnel (`docs/metricas.md` › O ano em etapas):
  - o maior save de uma vida fica bem abaixo de 1 MB, e a vida de quem herda começa um livro novo, então uma dinastia não acumula;
  - o que mais pesa no livro é o mundo: o país, o exterior e o mercado anotam todo ano as estatísticas que andaram.
  - Volta quando o mundo crescer (países reais, I-20) ou o save passar de 1 MB. O primeiro alvo é guardar as estatísticas do mundo como série por ano, não como mudanças de quem joga.

### I-05 · Identidade de pessoas e relações como arestas
- **Problema:**
  - o papel é a pessoa: um segundo amor apaga o primeiro;
  - há um filho só;
  - personagens não se relacionam entre si (auditoria de 11/10).
  Agentes, sucessão e sociedade precisam de pessoas com id estável.
- **Módulos:** 2, 11.
- **Depende de:** nada; precisa de migração de save.
- **Custo:**
  - implementação: G;
  - simulação: médio (mais pessoas por vida, com nível de detalhe).
- **Consome:** atenção do diretor: mais personagens disputam o ano.
- **Efeitos causais:**
  - vários filhos dividem a herança de verdade;
  - o ex continua existindo;
  - o gestor e o diretor executivo são pessoas.
- **Riscos:**
  - os caminhos `amor.x` e `filho.x` do conteúdo precisam continuar valendo: o papel aponta para a pessoa;
  - o save precisa migrar.
- **Aceitação:**
  - vários filhos;
  - o texto antigo mantém o nome certo;
  - o livro fecha para toda pessoa;
  - o save antigo migra.
- **Prioridade:** Alta · Fase 1 (fatia 1.4).
- **Estado:** parcial (fatia 1.4a, 19/10).
  - Feito: até quatro filhos com id estável (`filho`, `filho2`…); o conteúdo de "filho" vale para cada um; a herança se divide entre os filhos vivos, e o testamento escolhe quem continua; o save antigo migra.
  - Falta (1.4b): o ex que continua existindo (o papel `amor` ainda troca de pessoa) e as relações entre os personagens.

### I-06 · Causa com contribuição e explicação incompleta
- **Problema:**
  - a causa de hoje é a proveniência: que qualidade habilitou o storylet;
  - números que mudam pela regra do ano (o salário, a inflação) não dizem quanto veio de cada causa;
  - o jogo não diz quando não sabe.
- **Módulos:** 12, 13.
- **Depende de:** I-03.
- **Custo:**
  - implementação: G;
  - simulação: médio (guardar contribuições).
- **Consome:** nada.
- **Efeitos causais:** "o salário caiu 8%: 5 pontos pela recessão, 3 pela tarifa", e "outras causas: não rastreadas".
- **Riscos:** custo de CPU e de save.
- **Aceitação:** a soma das contribuições é igual à variação; a interface mostra a parte não explicada.
- **Prioridade:** Média · Fase 1.
- **Estado:** proposta.

### I-07 · Comparar cenários ("e se")
- **Problema:** a missão pede comparar cenários. O motor determinístico já permite: a mesma semente com uma decisão diferente.
- **Módulos:** 1, 12, 13.
- **Depende de:** I-03.
- **Custo:**
  - implementação: M;
  - simulação: alto quando se usa, porque roda a vida de novo.
- **Consome:** CPU do aparelho.
- **Efeitos causais:** mostra o efeito de uma decisão isolada.
- **Riscos:** o jogador passar a otimizar em vez de viver. Fica só no cartão final, ou no laboratório.
- **Aceitação:** a mesma semente e a mesma decisão reproduzem a vida; uma decisão trocada mostra a diferença.
- **Prioridade:** Baixa · Fase 1.
- **Estado:** proposta.

### I-08 · Túnel mais barato
- **Problema:** 88 ms por vida contra a meta de 30 ms. Cada fase nova soma custo.
- **Módulos:** 1, 9 (contínuo).
- **Depende de:** I-03.
- **Custo:**
  - implementação: M;
  - simulação: é o próprio ganho.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** otimização que muda resultado. O `docs/metricas.md` tem de sair igual.
- **Aceitação:** CPU por vida abaixo de 50 ms, com as mesmas métricas.
- **Prioridade:** Alta · Fase 1.
- **Estado:** feita no critério (fatia 1.3, 18/10).
  - O diretor calcula as causas só do storylet sorteado, e os robôs listam as ações uma vez: −12% de CPU, sem mudar nenhuma vida (48 ms por vida na amostra isolada do túnel).
  - O túnel roda um trabalhador por núcleo: 687 s → 199 s nas 10.000 vidas, com o mesmo relatório.
  - O resto está na avaliação das condições de centenas de storylets por ano (o diretor e as iniciativas, um terço da CPU). Indexar os storylets pelas qualidades que exigem é o próximo passo.

## Fase 2 — patrimônio, empresas e agentes

### I-10 · Gestor de patrimônio com mandato
- **Problema:** quem tem fortuna administra tudo à mão. O jogador faz 453 toques por vida, perto do teto de 480. A missão pede delegar com limites.
- **Módulos:** 11, 5, 3, 13.
- **Depende de:** I-01 e I-17; I-05 para que o gestor seja uma pessoa.
- **Custo:**
  - implementação: G;
  - simulação: baixo (o gestor decide uma vez por ano, com as operações que já existem).
- **Consome:** a taxa do contrato (paga ao gestor, com contrapartida) e o capital sob gestão.
- **Efeitos causais:**
  - o gestor aplica, resgata e rebalanceia dentro do mandato: perfil, limites, liquidez mínima e o que não pode tocar;
  - nos níveis assistido, delegado, autônomo e estratégico, ele recomenda, executa e reporta;
  - um gestor ruim custa caro.
- **Riscos:** o gestor virar a estratégia dominante. O túnel compara quem delega com quem não delega.
- **Aceitação:**
  - nenhuma operação fora do mandato (teste);
  - relatório anual;
  - os toques por vida caem;
  - nenhuma estratégia domina.
- **Prioridade:** Alta · Fase 2 (fatia 2.1).
- **Estado:** proposta.

### I-11 · Caixa da empresa e lucro com origem
- **Problema:**
  - a empresa é um valor;
  - o lucro e a retirada saem do nada;
  - o dinheiro da empresa e o de quem joga não se separam, porque não existe dinheiro da empresa.
- **Módulos:** 5, 3, 4.
- **Depende de:** I-01.
- **Custo:**
  - implementação: G;
  - simulação: baixo.
- **Consome:** o caixa da empresa, que paga salários, investe e distribui.
- **Efeitos causais:**
  - receita do mercado, custos para o mercado e imposto para o tesouro;
  - o lucro retido vira investimento (o valor cresce) por decisão;
  - a retirada sai do caixa;
  - sem caixa, não há retirada.
- **Riscos:** mudar a curva de crescimento das empresas e os portões de bilionário e de quebra.
- **Aceitação:**
  - a empresa tem balanço (caixa, valor, dívida) que fecha;
  - os portões de quebra e de bilionário dentro da faixa.
- **Prioridade:** Alta · Fase 2 (fatia 2.2).
- **Estado:** proposta.

### I-12 · Diretor executivo e conselho que propõem
- **Problema:**
  - a mesa de quem manda (`empresa.dependencia`) mede quanto a empresa precisa do dono, mas ninguém propõe nada;
  - a missão pede propostas com capital, custos, prazo, fluxo de caixa, retorno, riscos, cenários adversos e critérios de avaliação.
- **Módulos:** 11, 5.
- **Depende de:** I-10, I-11 e I-05.
- **Custo:**
  - implementação: G;
  - simulação: médio.
- **Consome:** o caixa da empresa e a atenção de quem joga (uma decisão pendente por proposta).
- **Efeitos causais:**
  - proposta aprovada vira projeto com prazo;
  - o resultado é avaliado contra o que foi prometido;
  - o diretor ganha ou perde a confiança do conselho.
- **Riscos:** tela de gestão. A proposta chega como cartão de decisão, uma por vez.
- **Aceitação:**
  - nenhuma proposta acima da autoridade do diretor é executada sem aprovação (teste);
  - a promessa e o realizado ficam no livro.
- **Prioridade:** Média · Fase 2.
- **Estado:** proposta.

### I-13 · Holding familiar
- **Problema:** a herança racha a empresa e paga imposto em cada geração. Estava como próximo incremento no roteiro.
- **Módulos:** 5, 3, 2.
- **Depende de:** I-01 e I-11.
- **Custo:**
  - implementação: M;
  - simulação: baixo.
- **Consome:** o custo de manter (contador, advogado) e a liquidez travada.
- **Efeitos causais:**
  - a holding passa inteira ao herdeiro, sem partilha;
  - o imposto muda;
  - tirar dinheiro dela tem regra.
- **Riscos:** piorar o portão da herança. A correlação entre gerações já está em 0,81, acima do teto de 0,8. A holding pode ter custo e risco que compensem.
- **Aceitação:** a herança pela holding testada, e o Spearman entre gerações dentro da faixa.
- **Prioridade:** Alta · Fase 2 (fatia 2.3).
- **Estado:** proposta.

### I-14 · Family office e fundos privados
- **Problema:** grandes fortunas têm estrutura própria de gestão e investimento, separada da pessoa.
- **Módulos:** 5, 11, 3.
- **Depende de:** I-10 e I-13.
- **Custo:**
  - implementação: G;
  - simulação: baixo.
- **Consome:** o custo fixo anual e os gestores contratados.
- **Efeitos causais:** o family office contrata gestores e fundos, consolida o relatório e cuida da sucessão.
- **Riscos:** virar uma tela de gestão.
- **Aceitação:** as contas do family office separadas das da pessoa, e o relatório anual.
- **Prioridade:** Média · Fase 2.
- **Estado:** proposta.

### I-15 · Fundação com orçamento próprio
- **Problema:** a jogada "fundação" só desconta dinheiro e grava uma marca. A fundação não tem caixa, mandato nem resultado medido.
- **Módulos:** 5, 3, 11.
- **Depende de:** I-01; melhor com I-10.
- **Custo:**
  - implementação: M;
  - simulação: baixo.
- **Consome:** o patrimônio doado, que fica na fundação, rende e paga os programas.
- **Efeitos causais:**
  - os programas mudam estatísticas locais (escola, saúde) na proporção do dinheiro, com atraso;
  - a fundação sobrevive a quem a criou.
- **Riscos:** criar um atalho para mudar o país. O efeito tem tamanho, proporcional ao orçamento do país.
- **Aceitação:** a fundação tem balanço; o efeito tem causa e tamanho; um teste de proporcionalidade.
- **Prioridade:** Média · Fase 2.
- **Estado:** proposta.

### I-16 · Concierge e gestão do estilo de vida
- **Problema:** a missão pede contratar uma empresa que organize a vida pessoal. Ela recebe um objetivo, consulta preferências, avalia recursos, planeja, contrata, executa, pede aprovação, registra e oferece alternativas.
- **Módulos:** 11, 5, 3, 13.
- **Depende de:** I-17, I-10 e I-01.
- **Custo:**
  - implementação: G;
  - simulação: baixo.
- **Consome:** a mensalidade, o orçamento autorizado e a disponibilidade de fornecedores (pode faltar).
- **Efeitos causais:**
  - a viagem, a casa e o evento acontecem com custo e resultado concretos (felicidade, vínculo, imagem);
  - erros, atrasos e conflitos são possíveis.
- **Riscos:** virar diálogo sem efeito. Todo pedido termina em mudança de estado, ou em "não deu, e por quê".
- **Aceitação:** um objetivo vira plano, contratos e entradas no livro; acima do limite, pede aprovação (teste).
- **Prioridade:** Média · Fase 2 (fatia 2.4).
- **Estado:** proposta.

### I-17 · Contrato de serviço genérico
- **Problema:** gestor, concierge, contador e advogado precisam do mesmo formato: custo, remuneração, escopo, autonomia, limites, indicadores e encerramento.
- **Módulos:** 3, 11.
- **Depende de:** I-01.
- **Custo:**
  - implementação: M;
  - simulação: baixo.
- **Consome:** a remuneração paga, com contrapartida.
- **Efeitos causais:** o desempenho medido contra os indicadores leva à renovação ou ao encerramento.
- **Riscos:** nenhum além do custo.
- **Aceitação:** o contrato tem partes, termos e histórico; o encerramento tem regra; testes.
- **Prioridade:** Alta · Fase 2.
- **Estado:** proposta.

### I-18 · Sucessão por instrumentos
- **Problema:** hoje a sucessão é a partilha da lei ou o testamento (`herdeiro.ts`). A missão pede patrimônio familiar e sucessão planejada.
- **Módulos:** 5, 2, 3.
- **Depende de:** I-13 e I-05.
- **Custo:**
  - implementação: M;
  - simulação: baixo.
- **Consome:** impostos e custos de cada instrumento.
- **Efeitos causais:** doação em vida, usufruto e cláusulas de truste mudam quem decide, quanto se paga e o que racha.
- **Riscos:** o portão da herança.
- **Aceitação:** cada instrumento testado na partilha.
- **Prioridade:** Média · Fase 2.
- **Estado:** proposta.


### I-111 · A empresa de verdade: caixa, pesquisa, fábricas e lojas
- **Problema:** o dono: "as empresas não têm caixa nem expansão física", "não podem investir em pesquisa e desenvolvimento para se tornarem competitivas", "um simulador de empresas completo". Hoje, a empresa é um valor que cresce com a tração, e o lucro vira retirada ou crescimento.
- **Módulos:** 5, 4, 3.
- **Depende de:** I-11.
- **Custo:** GG (em partes).
- **Consome:** o caixa da empresa, o tempo de quem manda e o mercado do setor.
- **Efeitos causais:**
  - o caixa: o lucro entra no caixa; dele saem a retirada, o investimento, a pesquisa e a compra de título; sem caixa, a empresa toma empréstimo ou quebra;
  - a pesquisa e desenvolvimento: o caixa vira tecnologia da empresa, que soma à tração e à fatia do mercado (e pode virar patente);
  - a expansão física: fábricas e lojas, cada uma com custo, capacidade e cidade, e a concorrência por fatia de mercado no setor.
- **Riscos:** o patrimônio de quem tem empresa e o portão do bilionário; o tamanho do save.
- **Aceitação:** as contas da empresa fecham entrada por entrada; o túnel mede a pesquisa que vira fatia de mercado.
- **Prioridade:** Alta · Fase 2.
- **Estado:** proposta (bloco H).

### I-112 · O dinheiro que rende: bens que produzem, créditos que se compram
- **Problema:** o dono: "o dinheiro que empresto ao Estado, a dívida do Estado que compro e os nomes do SPC e do Serasa não entram no patrimônio e não rendem", "outros bens que deveriam render também não rendem". O resgate do país (a jogada) tira R$ 200 bilhões da conta e só os devolve num storylet agendado anos depois.
- **Módulos:** 5, 4, 3.
- **Depende de:** I-34.
- **Custo:** M.
- **Consome:** o dinheiro de quem joga.
- **Efeitos causais:**
  - o empréstimo ao país é um título do Tesouro (o bloco F começa por aí), e o empréstimo aos bancos é um contrato com juro e risco;
  - a carteira de dívidas atrasadas (os nomes do SPC e do Serasa): comprada por uma fração do valor, rende o que se recupera, e quem joga decide entre cobrar e perdoar (o que o povo acha muda);
  - os bens que produzem: a fazenda colhe (e sente a seca e o preço), a emissora fatura com a audiência, o iate e o jatinho fretados pagam parte do que custam.
- **Riscos:** a conta do padrão de vida e o portão do patrimônio negativo.
- **Aceitação:** todo crédito e todo bem que rende aparecem no patrimônio e no extrato, com a contraparte.
- **Prioridade:** Alta · Fase 2.
- **Estado:** proposta (bloco I).

## Fase 3 — países reais e geografia

### I-20 · Países reais como condição inicial
- **Problema:** a missão pede países reais com dados documentados. Hoje o mundo são o Brasil e quatro países fictícios, e "política e países fictícios e genéricos" é uma regra do dono.
- **Módulos:** 7, 8, 4.
- **Depende de:**
  - **decisão do dono;**
  - I-21.
- **Custo:**
  - implementação: G (dados, licenças e migração da diplomacia);
  - simulação: depende de I-21.
- **Consome:** nada; dá as condições iniciais.
- **Efeitos causais:** os dados são o ponto de partida; depois, o motor faz o mundo andar.
- **Riscos:**
  - jurídico: nenhum político ou partido real; o que acontece é simulação, e a abertura avisa;
  - bundle maior: os dados vêm sob demanda.
- **Aceitação:**
  - cada número tem fonte, data, unidade e licença;
  - um teste de esquema dos dados;
  - CPU e bundle dentro do orçamento.
- **Prioridade:** Alta · Fase 3.
- **Estado:** proposta (decisão do dono).

### I-21 · Nível de detalhe do mundo
- **Problema:** um ano do país custa 0,23 ms. 190 países nesse detalhe seriam 3,5 s por vida, e o túnel joga 10.000 vidas.
- **Módulos:** 7, 1, 4.
- **Depende de:** I-03.
- **Custo:**
  - implementação: G;
  - simulação: é o ganho; a meta é menos de 5 ms por vida para o mundo todo.
- **Consome:** nada.
- **Efeitos causais:**
  - perto de quem joga, o detalhe e o livro;
  - longe, o modelo reduzido, com sementes derivadas (país, ano) para ser avaliado sob demanda;
  - o livro registra só os fatos (crise, guerra, troca de governo).
- **Riscos:** incoerência entre os níveis, quando um país sobe de nível de detalhe. Um teste de continuidade cobre isso.
- **Aceitação:** um país pode subir e descer de nível sem salto nas estatísticas, e o custo fica medido no túnel.
- **Prioridade:** Alta · Fase 3.
- **Estado:** proposta.

### I-22 · Mapa navegável
- **Problema:** a missão pede um mapa do planeta, dos continentes, dos países, das divisões, dos municípios e das localidades.
- **Módulos:** 13, 7.
- **Depende de:** I-20 e I-21.
- **Custo:**
  - implementação: G;
  - simulação: nenhum, porque é interface;
  - bundle: as malhas vêm sob demanda.
- **Consome:** nada.
- **Efeitos causais:** nenhum. O mapa mostra o estado: onde mora, onde tem bens, empresas, relações, crises.
- **Riscos:** o peso no celular. Usar malhas simplificadas e carregar por nível.
- **Aceitação:** dá para navegar com uma mão, nos dois temas, com 44 px por alvo; abre em menos de 1 s num celular médio.
- **Prioridade:** Média · Fase 3.
- **Estado:** proposta.

### I-23 · Morar em outro país: residência, visto e cidadania
- **Problema:** mudar de país é uma das histórias mais brasileiras e não existe. A missão pede residência, cidadania e mobilidade com custo e regra.
- **Módulos:** 7, 2, 4, 13.
- **Depende de:** nada para os países de hoje; com países reais, de I-20.
- **Custo:**
  - implementação: G;
  - simulação: baixo.
- **Consome:**
  - o custo da mudança e da volta;
  - o vínculo com quem fica, que esfria em dobro;
  - o visto, que pode ser negado.
- **Efeitos causais:**
  - o trabalho de lá: qualificado com estudo e a língua; o de quem chega, sem eles;
  - o custo de vida e o salário andam com o dólar e com a economia de lá;
  - a violência e a saúde de lá;
  - o conteúdo que só existe no Brasil não acontece.
- **Riscos:** o rascunho mostrou taxas de emigração altas demais nos robôs (de 31% a 61% das vidas) e precisa de calibragem.
- **Aceitação:** os portões do desenho:
  - de 5% a 30% das vidas moram fora;
  - mais seguro lá;
  - nem sempre melhor: quem foi termina acima da mediana de quem ficou entre 30% e 70% das vezes.
- **Prioridade:** Alta · Fase 3.
- **Estado:** rascunho (incremento 11, não publicado). Já tem:
  - o motor: `fora.ts`, a regra do conteúdo "só no Brasil" e o trabalho de lá;
  - 27 storylets, 15 linhas e 5 epitáfios.
  Faltam a calibragem, a interface, os testes e os portões.

### I-24 · Reconhecimento limitado e territórios disputados
- **Problema:** a missão pede representar à parte os Estados de reconhecimento limitado e os territórios em disputa.
- **Módulos:** 7, 8.
- **Depende de:** I-20.
- **Custo:** M de implementação.
- **Consome:** nada.
- **Efeitos causais:** o reconhecimento muda comércio, crédito e entrada em instituições.
- **Riscos:** sensibilidade política. Usar dados de fonte reconhecida, sem tomar lado.
- **Aceitação:** o reconhecimento é um dado com fonte, separado do poder material (I-53).
- **Prioridade:** Baixa · Fase 3.
- **Estado:** proposta.

### I-25 · Mudar de cidade no Brasil
- **Problema:** a cidade é sorteada no nascimento e nunca muda, mas já tem desemprego e custo de vida próprios.
- **Módulos:** 7, 4, 2.
- **Depende de:** nada.
- **Custo:**
  - implementação: M;
  - simulação: nenhum.
- **Consome:** o custo da mudança e a distância da família.
- **Efeitos causais:** emprego e custo de vida da cidade nova; a família esfria.
- **Riscos:** os storylets que leem `lugar` precisam do lugar novo; a causa é a entrada da mudança.
- **Aceitação:** mudar de cidade muda emprego e custo, com causa no livro.
- **Prioridade:** Média · Fase 3.
- **Estado:** proposta.


### I-118 · O mapa-múndi e os países de verdade
- **Problema:** o dono: "quero mapa-múndi, quero países de verdade, quero poder governar mais".
- **Módulos:** 7, 8, 13.
- **Depende de:** I-20, I-22 e a decisão do dono sobre a política fictícia.
- **Custo:** GG.
- **Consome:** CPU e save (mais países).
- **Efeitos causais:** os países de fora passam a ser os de verdade (a geografia, a economia, a população), com governos e partidos fictícios; o mapa mostra onde cada coisa acontece.
- **Riscos:** o requisito do dono "política fictícia e genérica" (identidade e risco legal) e a guerra com um país de verdade.
- **Aceitação:** a decisão do dono registrada; o mapa abre no celular em 360 px.
- **Prioridade:** Média · Fase 3.
- **Estado:** proposta (bloco O): pede a decisão do dono.

## Fase 4 — bancos, crédito, moedas e dívida

### I-30 · Banco como entidade
- **Problema:** o banco é implícito: o crédito tem limite pela renda e juros pela fase, e não tem balanço.
- **Módulos:** 4, 3.
- **Depende de:** I-01 e I-02.
- **Custo:** G de implementação; baixo de simulação.
- **Consome:** o capital do banco e a confiança dos depositantes.
- **Efeitos causais:**
  - o banco que perde com inadimplência empresta menos (contágio);
  - a criação de dinheiro pelo crédito é registrada: depósito e empréstimo nascem juntos.
- **Riscos:** o crédito some na crise e prende as vidas.
- **Aceitação:** o balanço do banco fecha; a crise de crédito tem causa no livro.
- **Prioridade:** Alta · Fase 4.
- **Estado:** proposta.

### I-31 · Tesouro: o orçamento do Estado em reais
- **Problema:**
  - a dívida pública é um percentual do PIB, sem credor;
  - o imposto que quem joga paga não vai para lugar nenhum;
  - quem governa não tem orçamento.
- **Módulos:** 6, 4, 3.
- **Depende de:** I-01.
- **Custo:** G de implementação; baixo de simulação.
- **Consome:** a receita e a capacidade de se endividar.
- **Efeitos causais:**
  - política vira receita e despesa;
  - o déficit vira dívida com credores;
  - a dívida cara aperta o orçamento;
  - os bilionários pagam imposto que conta.
- **Riscos:** os portões do país vivo (inflação, crescimento, fases).
- **Aceitação:**
  - o orçamento fecha;
  - a dívida em reais tem credores;
  - as fases do ciclo dentro das faixas atuais.
- **Prioridade:** Alta · Fase 4.
- **Estado:** parcial (bloco B, 25/10): a dívida em reais na folha País, com quem joga entre os credores (o título da I-34). O orçamento item por item fica para depois: muda a conta da dívida e os portões do país.

### I-32 · Banco central e política monetária
- **Problema:** os juros são uma regra do país, e ninguém decide.
- **Módulos:** 4, 6.
- **Depende de:** I-30 e I-31.
- **Custo:** M.
- **Consome:** a credibilidade (expectativas).
- **Efeitos causais:**
  - juros, metas e reservas são decisões, com regra automática quando ninguém decide;
  - a independência é uma escolha institucional.
- **Riscos:** os ciclos.
- **Aceitação:** sem decisão, o comportamento é o de hoje; com ela, o efeito vem com atraso e tem causa.
- **Prioridade:** Média · Fase 4.
- **Estado:** proposta.

### I-33 · Moedas, regime cambial e moeda de reserva
- **Problema:** existe um dólar (`pais.cambio`). A missão pede moedas por país, regimes cambiais e moeda de reserva por fundamentos.
- **Módulos:** 4, 8.
- **Depende de:** I-20, I-21 e I-32.
- **Custo:** G.
- **Consome:** as reservas internacionais e a confiança.
- **Efeitos causais:** a moeda de reserva depende de profundidade, liquidez, comércio, instituições e influência, e pode subir ou cair.
- **Riscos:** complexidade sem decisão para quem joga.
- **Aceitação:** a participação nas reservas muda com os fundamentos, testada em cenários.
- **Prioridade:** Média · Fase 4.
- **Estado:** proposta.

### I-34 · Dívida soberana com credores, calote e contágio
- **Problema:** o "calote do governo" é uma reação de jogada, não um processo.
- **Módulos:** 4, 6, 8.
- **Depende de:** I-31.
- **Custo:** G.
- **Consome:** a confiança dos credores.
- **Efeitos causais:** o calote atinge quem tem títulos (inclusive quem joga), o câmbio e o crédito.
- **Riscos:** os portões do país.
- **Aceitação:** quem perde no calote é quem tinha a dívida.
- **Pedido do dono (19/10):** o título comprado do Tesouro entra no balanço como ativo financeiro e paga cupom no caixa de quem comprou: a conta pessoal ou o caixa da empresa.
- **Desenho do bloco B (25/10):**
  - **O título é um contrato com o governo** (`tit<entrada>`, tipo `titulo`): quem joga empresta ao Tesouro pela folha Dinheiro, por 5, 10 ou 20 anos, a partir dos 18. Campos: o valor (o que volta no vencimento), a taxa (travada na compra), o vencimento (o ano) e a origem (a entrada que comprou). O nome é o do papel: "Tesouro IPCA+ 2045".
  - **A taxa** é o juro real do ano, mais o prêmio do prazo (0,05 ponto por ano de prazo) e o risco da dívida (0,05 ponto por ponto acima de 90% do PIB, até 3), já sem o imposto de renda (15%). Fica travada: a renda fixa anda com o juro de cada ano, o título não.
  - **O cupom** cai na conta todo ano (o tesouro paga: as contas fecham com ele de contraparte). **No vencimento**, o valor volta, numa entrada visível que aponta a compra (ou a herança).
  - **Vender antes** é pelo preço de mercado: o valor descontado pela taxa de hoje para o prazo que falta. O juro que caiu depois da compra dá lucro; o que subiu, prejuízo. Comprar longo na crise (juro alto) é a aposta.
  - **O calote:** com a dívida acima de 100% do PIB, numa recessão ou numa crise, o governo pode não pagar (1% de chance por ponto acima de 100, até 25% ao ano). Quem tem título perde 30% do valor, a renda fixa perde 15%, a dívida do país cai um quarto, a economia afunda mais no ano e o juro fica mais alto por seis anos (a confiança). A notícia aponta quem levou a dívida até ali (a posse do governo, a reforma, o decreto). Quem governa e gasta demais leva o calote para os próprios títulos.
  - **O mundo tem tamanho:** até 5 títulos ao mesmo tempo, a partir de R$ 100, e nunca mais de 30% da dívida do país nas mãos de quem joga.
  - **A herança:** o título passa a quem herda (dividido como o resto do espólio) e vence na vida dele, com a herança como causa.
  - **A dívida em reais** (PIB × dívida) aparece na folha País, com o que quem joga empresta ao governo e o risco de calote à vista.
  - **As histórias também compram:** o efeito `comprarTitulo` (o "Investir no Tesouro Direto" do primeiro investimento) empresta uma fração da conta, com a história de causa; sem como comprar, vai para a renda fixa.
- **Fica para depois, com o motivo:**
  - o título comprado pela empresa: a empresa não tem caixa (é um valor que cresce), e o cupom não teria onde cair; vem com a I-11;
  - o orçamento item por item (receita, gasto e juros em reais): muda a conta da dívida, que hoje é uma reação fiscal em pontos do PIB, e os portões do país vivo (a I-31 inteira);
  - os outros credores como entidades (bancos, fundos, gente de fora) e o contágio no crédito: a I-30 e o resto desta.
- **Aceitação do bloco B:**
  - o cupom, o resgate, a venda e o calote têm o tesouro como contraparte (as contas fecham entrada por entrada);
  - quem perde no calote é quem tinha a dívida: sem título e sem renda fixa, nada se perde (teste);
  - o título passa ao herdeiro e vence na vida dele;
  - mesma semente e mesmas decisões, a mesma vida, salvando no meio com títulos;
  - sem calote, o país vivo não muda (as fases e as estatísticas dentro das faixas atuais);
  - nenhuma estratégia domina.
- **Prioridade:** Alta · bloco B do dono.
- **Estado:** feita em parte (bloco B, 25/10): o título de quem joga, o cupom, o vencimento, a venda, o calote e a herança. Faltam o título da empresa (depois da I-11) e o contágio no crédito (com a I-30).

### I-35 · Falência, reestruturação e intervenção
- **Problema:** a empresa quebra (`empresa_quebrou`), mas não há credores, recuperação nem intervenção.
- **Módulos:** 5, 4, 6.
- **Depende de:** I-02, I-11 e I-30.
- **Custo:** G.
- **Consome:** o valor residual dividido pela ordem dos credores.
- **Efeitos causais:** a quebra contagia fornecedores e bancos; a intervenção custa ao tesouro.
- **Riscos:** os portões de quebra.
- **Aceitação:** a ordem de pagamento é testada.
- **Prioridade:** Média · Fase 4.
- **Estado:** proposta.

### I-36 · Setor privado agregado por país
- **Problema:** o "mercado" da I-01 é só uma conta. Para salário e preço como resultado, ele precisa de produção, emprego e preços.
- **Módulos:** 4.
- **Depende de:** I-01 e I-21.
- **Custo:** G de implementação; médio de simulação.
- **Consome:** trabalho e capital do país.
- **Efeitos causais:** o salário e o desemprego saem da produção e da demanda, não de constantes.
- **Riscos:** todos os portões econômicos.
- **Aceitação:** as identidades contábeis do país fecham (produto, renda, gasto).
- **Prioridade:** Média · Fase 4.
- **Estado:** proposta.


### I-109 · O Estado financiado por quem joga
- **Problema:** o dono: "quando tenho quantidades trilionárias de patrimônio, não consigo financiar o Estado com dinheiro privado". O que existe são as jogadas (salvar o país, a estatal), que gastam e somem do patrimônio.
- **Módulos:** 4, 6, 3.
- **Depende de:** I-31.
- **Custo:** M.
- **Consome:** o dinheiro de quem joga.
- **Efeitos causais:** doar ao Tesouro abate a dívida; pagar um hospital, uma escola ou uma universidade sobe a saúde, a educação ou a tecnologia do país, com a doação de causa; o dinheiro emprestado ao governo é um título (com cupom e vencimento), não um gasto.
- **Riscos:** a dívida do país e o calote mudam com quem doa.
- **Aceitação:** a doação abate a dívida e sobe a estatística paga, com a causa no livro; o empréstimo ao país aparece no patrimônio.
- **Prioridade:** Média · Fase 4.
- **Estado:** proposta (bloco G); o resgate do país vira título no bloco F.

## Fase 5 — governo, regimes e Estados

### I-40 · Poderes separados
- **Problema:** quem governa muda políticas pela folha País, mas não há Legislativo, veto, Judiciário, nomeações nem Forças Armadas.
- **Módulos:** 6.
- **Depende de:** I-31 e I-05.
- **Custo:** G.
- **Consome:** capital político (apoio) e tempo.
- **Efeitos causais:**
  - reforma que exige o Legislativo pode ser barrada;
  - nomeação muda o comportamento da instituição.
- **Riscos:** virar tela de gestão. As decisões entram como cartões.
- **Aceitação:** cada poder com regra, e testes de veto e aprovação.
- **Prioridade:** Alta · Fase 5.
- **Estado:** proposta.

### I-41 · Monarquia institucional e Casa Real
- **Problema:** hoje a coroa paga R$ 4 milhões por ano a quem a herda (`96-linhagens.json › sucessao_coroa`). A missão diz que o monarca é posição, não fonte de renda.
- **Módulos:** 6, 5, 3.
- **Depende de:** I-31 e I-40.
- **Custo:** M.
- **Consome:** a dotação da Casa Real, que sai do tesouro e tem regras; a renda privada vem de bens.
- **Efeitos causais:**
  - constitucional, parlamentar ou absoluta, cada uma com poderes diferentes;
  - mecenato, reforma, repressão e abuso pesam na legitimidade e nas contas.
- **Riscos:** as linhagens reais existentes; a migração é por conteúdo.
- **Aceitação:** a renda do monarca tem origem e regra, e a legitimidade é medida à parte.
- **Pedido do dono (19/10):** "por que o soberano não recebe salário, parte dos impostos ou taxa da coroa". Ele jogou uma soberana bilionária numa ilha que comprou, e a coroa não pagava nada.
- **Desenho do bloco C (26/10):**
  - **Quem tem coroa** (o monarca do Brasil, cargo `rei`, e quem é soberano da ilha, cargo `soberano`) escolhe **como a coroa recebe**, na folha Carreira e poder, uma vez por ano, com o efeito à vista antes:
    - **salário da Casa Real:** fixo (R$ 4 milhões por ano no Brasil, R$ 500 mil na ilha);
    - **parte dos impostos:** uma fatia da arrecadação (0,01% da do Brasil, a escala da dotação britânica, e 10% da da ilha). Sobe e desce com a economia, e a aprovação vai 5 pontos para baixo;
    - **taxa da coroa:** um imposto a mais, só para a coroa (0,1% do PIB do Brasil, 8% do PIB da ilha). É muito dinheiro, a aprovação vai 15 pontos para baixo e, na ilha, gente vai embora.
  - Abaixo de 30 de aprovação, o cargo balança: no Brasil, o plebiscito (a queda do cargo de hoje); na ilha, a greve geral.
  - A forma fica com o país (`pais.coroa`, `ilha.coroa`): quem herda a coroa herda a regra.
  - A dotação é a renda de quem tem coroa (a regra a recalcula todo ano), paga pelo tesouro, no Brasil, ou pela ilha, com o rótulo "Dotação da coroa".
- **Fica para depois, com o motivo:**
  - a legitimidade medida à parte da popularidade: é a I-42, e mexe em todo o poder;
  - o ditador: o Regime tem o salário dele, e não é coroa;
  - o efeito da dotação no orçamento do Brasil: 0,1% do PIB, no máximo, não move a dívida.
- **Prioridade:** Alta · Fase 5.
- **Estado:** feita em parte (bloco C, 26/10): a renda da coroa tem forma e regra. A legitimidade medida à parte é a I-42.

### I-42 · Indicadores separados
- **Problema:** influência e popularidade misturam poder, riqueza, fama e legitimidade.
- **Módulos:** 6, 12.
- **Depende de:** I-40.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** cada indicador decide coisas diferentes: legitimidade, golpes e protestos; prestígio, alianças.
- **Riscos:** o validador exige que cada um seja lido.
- **Aceitação:** cada indicador com dois leitores e uma decisão.
- **Prioridade:** Média · Fase 5.
- **Estado:** proposta.

### I-43 · Criar um Estado
- **Problema:** "fundar um país" é uma jogada (micronação, país reconhecido), não um processo com território, população, instituições e reconhecimento.
- **Módulos:** 6, 7, 8.
- **Depende de:** I-20, I-21, I-31, I-40 e I-50.
- **Custo:** GG.
- **Consome:** território, população, dinheiro, legitimidade e reconhecimento.
- **Efeitos causais:** independência, secessão ou federação têm custos, dívidas herdadas e reações.
- **Riscos:** escopo. Só depois das fases 3 a 6.
- **Aceitação:** um Estado novo tem balanço, instituições e situação diplomática, e as consequências ficam no livro.
- **O começo, no bloco C (26/10):**
  - a jogada "fundar um país" cria a ilha como entidade (`ilha`, tipo `jurisdicao`, efeito `fundarIlha`). O nome é "Nova" mais a cidade natal de quem fundou, com 2.300 habitantes e R$ 80 mil de PIB por pessoa;
  - o imposto da ilha é 20% do PIB;
  - todo ano, a renda por pessoa cresce 2,5% (3,5% com o país reconhecido) e a população cresce 1% (2% reconhecida), menos 4 pontos com a taxa da coroa e 1 com a parte dos impostos;
  - a ilha passa a quem herda; quem era soberano deixa a coroa da ilha para o herdeiro;
  - a república (a outra escolha da jogada) também cria a ilha, sem coroa para quem fundou.
- **Fica para depois:** o imposto da ilha como decisão (o paraíso fiscal), as empresas que se mudam para lá, as instituições, o reconhecimento como processo e as relações com os países de fora.
- **Prioridade:** Média · Fase 5.
- **Estado:** começada (bloco C, 26/10): a ilha com população, PIB e imposto.

### I-44 · Formas de Estado e de governo
- **Problema:** hoje há governos fictícios, o regime e o "você". A missão pede Estado unitário, federal, confederação, presidencialismo, parlamentarismo, híbridos e autoritários.
- **Módulos:** 6.
- **Depende de:** I-40.
- **Custo:** G.
- **Consome:** nada.
- **Efeitos causais:** a forma muda quem decide, o tempo das decisões e a legitimidade.
- **Riscos:** os portões do país.
- **Aceitação:** cada forma com regras testadas.
- **Prioridade:** Média · Fase 5.
- **Estado:** proposta.


### I-106 · A sucessão que passa (a coroa, o regime e a ilha)
- **Problema:** o dono: "não estou herdando o regime, a monarquia ou a soberania". Medido (26/10) em vidas de linhagem real: dos 19 herdeiros de quem reinou, com a cautelosa, nenhum virou rei em 40 anos; com a arriscada, de 9 filhos herdeiros, 3 viraram reis (depois de 2, 10 e 28 anos) e 6 nunca. As causas:
  - a sucessão é um storylet comum (`sucessao_coroa`, `sucessao_regime`), sorteado pelo diretor: pode levar décadas ou não vir;
  - ele pede o pai ou a mãe morto como ator: quem herda por testamento (o par, o amigo) e o sobrinho nunca se qualificam (o defeito D-01);
  - enquanto ela não vem, o país passa para um governo de transição;
  - a ilha passa a quem herda mesmo criança, e o herdeiro adulto começa com a popularidade baixa: a greve geral tira a coroa em poucos anos.
- **Módulos:** 6, 2, 11.
- **Depende de:** nada.
- **Custo:** M.
- **Consome:** nada novo.
- **Efeitos causais:**
  - quem continua a história herda a coroa, o regime e a ilha, seja quem for (o testamento é a lei da sucessão da dinastia);
  - o motor agenda a sucessão no primeiro ano de quem herda (ou no ano em que faz 18: até lá, a regência), e também quando quem reina morre durante a vida de quem joga;
  - enquanto a sucessão espera a resposta, quem governava continua governando: não há interregno;
  - quem é coroado larga a carreira de antes (o defeito D-04).
- **Riscos:** o túnel tem lotes de linhagem e de dinastia: mais coroas herdadas mudam as vidas de lá.
- **Aceitação:** teste: o herdeiro (filho, par, amigo, sobrinho) de quem reinava recebe a sucessão no primeiro ano, ou aos 18; o governo não troca no ano da sucessão. No túnel, a parte dos herdeiros de quem reinava que reinam.
- **Prioridade:** Alta · Fase 5.
- **Estado:** feito (bloco F, 26/10): `sucessao.ts`; o túnel tem dinastias que nascem na família real e no Regime e mede a resposta de cada sucessão.

### I-107 · Tomar o poder: o golpe, o autogolpe e o governo vitalício
- **Problema:** o dono: "não consigo dar um golpe de Estado", "não consigo tomar o poder ou governar vitalício". Hoje, governar para sempre só vem do berço (a linhagem real ou a do regime).
- **Módulos:** 6, 8, 9.
- **Depende de:** I-106.
- **Custo:** M.
- **Consome:** influência, popularidade, dinheiro e a relação com os países de fora.
- **Efeitos causais:**
  - o autogolpe: quem é presidente fecha o Congresso (ou muda a Constituição pelo voto) e vira chefe do Regime, vitalício; dá errado, cai e é condenado;
  - o golpe: quem tem influência (ou quem é coronel ou general) lidera os quartéis, ou quem tem bilhões financia os generais; dá errado, vai preso;
  - restaurar a monarquia: quem é famoso e rico banca o plebiscito e, se o povo quiser, vira monarca;
  - o mundo reage: os países de fora esfriam a relação (a sanção e, com ela, a guerra do bloco E podem vir), e as histórias do regime passam a valer;
  - sob o Regime, ninguém se candidata a presidente (o defeito D-03).
- **Riscos:** tom: o golpe é história, não apologia; a queda, o exílio e o tribunal também estão lá.
- **Aceitação:** teste dos três caminhos e do fracasso de cada um; no túnel, a parte de quem governa que tenta e consegue.
- **Prioridade:** Alta · Fase 5.
- **Estado:** feito (bloco F, 26/10): as jogadas da folha Carreira e poder (`99-tomar-o-poder.json`); a emenda dá mais quatro anos, não o mandato vitalício.

### I-108 · Governar o que você fundou (a ilha e a cidade)
- **Problema:** o dono: "não consigo governar o país que fundei, a cidade que fundei" e "quando fundo o país e me torno soberano, continuo no Brasil e continuo governando o Brasil". Hoje, a ilha só cresce sozinha (2.300 habitantes, R$ 184 milhões de PIB para quem pagou R$ 300 bilhões) e a cidade é só uma marca.
- **Módulos:** 6, 5, 7.
- **Depende de:** I-43.
- **Custo:** M.
- **Consome:** o dinheiro de quem joga (as obras) e a popularidade (o imposto).
- **Efeitos causais:**
  - quem funda o país deixa o cargo que tinha no Brasil na hora, e o governo daqui não é mais dele;
  - a ilha e a cidade são territórios com população, PIB, imposto e infraestrutura; quem manda nelas escolhe o imposto (o paraíso fiscal atrai gente e empresas e arrecada pouco; o alto arrecada e espanta) e paga obras do próprio bolso (o porto, o aeroporto, a universidade, a cidade nova), que viram infraestrutura e crescimento, com a obra de causa;
  - a popularidade de quem manda sente o imposto e as obras, e a greve geral deixa de ser quase certa.
- **Riscos:** o patrimônio dos mais ricos vira obra: o portão do bilionário feito.
- **Aceitação:** teste: a obra soma infraestrutura e a infraestrutura faz a população e o PIB crescerem; o paraíso fiscal cresce mais e arrecada menos; quem funda o país deixa o cargo daqui.
- **Prioridade:** Alta · Fase 5.
- **Estado:** em parte (bloco F, 26/10): quem funda o país deixa o cargo daqui na hora, e a greve da ilha pode acabar de verdade. O imposto, as obras e a cidade como território são o bloco F2.

### I-110 · Os impostos um por um
- **Problema:** o dono: "o controle dos impostos está muito simples". Hoje, a política de impostos tem três níveis e mexe na arrecadação, no crescimento e na renda de quem não é pobre.
- **Módulos:** 4, 6.
- **Depende de:** I-31.
- **Custo:** G.
- **Consome:** a renda e o patrimônio de quem joga e das empresas.
- **Efeitos causais:** o imposto de renda (com faixas), o imposto sobre o consumo, o das empresas, o das fortunas e o da herança, cada um com alíquota escolhida por quem governa, mexem na arrecadação, no crescimento, na desigualdade, na fuga de capitais e no bolso de quem joga (o extrato mostra cada um).
- **Riscos:** a conta do padrão de vida e o portão do patrimônio negativo.
- **Aceitação:** o extrato mostra cada imposto pago; o túnel mede a arrecadação e o crescimento por combinação.
- **Prioridade:** Alta · Fase 5.
- **Estado:** proposta (bloco G).

## Fase 6 — sistema internacional

### I-50 · Tratados como objetos
- **Problema:** hoje acordo e sanção são qualidades de um país; não há termos, vigência nem violação.
- **Módulos:** 8, 3.
- **Depende de:** I-17 (o formato de contrato).
- **Custo:** M.
- **Consome:** o que o tratado obriga.
- **Efeitos causais:** violar custa relação e crédito.
- **Riscos:** os portões do incremento 10.
- **Aceitação:** um tratado tem partes, termos, vigência e histórico.
- **Prioridade:** Média · Fase 6.
- **Estado:** proposta.

### I-51 · Alianças e blocos econômicos
- **Problema:** o alinhamento existe só como postura do governo.
- **Módulos:** 8.
- **Depende de:** I-50.
- **Custo:** M.
- **Consome:** a autonomia (compromissos).
- **Efeitos causais:** um bloco muda tarifas e defesa coletiva.
- **Riscos:** nenhum específico.
- **Aceitação:** os membros têm interesses próprios que convergem ou não.
- **Prioridade:** Média · Fase 6.
- **Estado:** proposta.

### I-52 · Instituições multilaterais
- **Problema:** a missão pede instituições inspiradas no FMI, no Banco Mundial e no Novo Banco de Desenvolvimento, com mandato, capital e critérios.
- **Módulos:** 8, 4, 3.
- **Depende de:** I-31, I-34 e I-50.
- **Custo:** G.
- **Consome:** o capital da instituição, que é finito.
- **Efeitos causais:** o empréstimo com condições muda as políticas e a dívida.
- **Riscos:** nenhum além do escopo.
- **Aceitação:** recursos finitos, critérios de empréstimo e governança por cotas, testados.
- **Prioridade:** Média · Fase 6.
- **Estado:** proposta.

### I-53 · Poder nacional por dimensões
- **Problema:** a missão pede classificar Estados por capacidades medidas, sem confundir com reconhecimento.
- **Módulos:** 8, 6.
- **Depende de:** I-20 e I-21.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** a classificação muda com os fundamentos e pesa em negociação e alianças.
- **Riscos:** nenhum.
- **Aceitação:** os critérios são escritos, e a classificação muda quando os fundamentos mudam (teste).
- **Prioridade:** Média · Fase 6.
- **Estado:** proposta.

### I-54 · Pesquisa e tecnologia como estoque
- **Problema:** a tecnologia não existe como variável. As jogadas (cura, foguete) são fatos isolados.
- **Módulos:** 4, 8.
- **Depende de:** I-36.
- **Custo:** G.
- **Consome:** investimento e pesquisadores.
- **Efeitos causais:** o estoque de tecnologia muda a produtividade, com atraso.
- **Riscos:** nenhum além do escopo.
- **Aceitação:** o investimento leva ao estoque e o estoque à produtividade, com causa no livro.
- **Pedido do dono (19/10):** usar o Tesouro do Estado para pagar pesquisa e desenvolvimento. Depende do orçamento em reais (I-31).
- **Desenho do bloco D (26/10):**
  - **A política "Ciência e tecnologia"**, a sétima da folha País, com três níveis: cortada, regular ou prioridade.
    - No nível regular, o governo põe 0,5% do PIB em pesquisa; cortada tira 0,2 ponto do gasto, e prioridade soma 0,4.
    - O dinheiro sai do Tesouro: o gasto entra no primário, e a dívida anda com ele. A folha País mostra quanto é, em reais.
    - Cada bloco tem o seu nível: a frente popular e o Regime pesquisam como prioridade, o bloco liberal corta, a aliança da ordem e o centrão ficam no regular. O voto decide a pesquisa.
  - **O estoque de tecnologia** (`pais.tecnologia`, de 0 a 100) anda devagar para o alvo: 6% do caminho por ano, uma década para chegar perto. O alvo é 50, mais 15 com a prioridade (menos 15 com a ciência cortada), mais 0,4 ponto por ponto de escola acima de 50.
  - **O que a tecnologia faz, com atraso:**
    - o crescimento potencial ganha 0,02 ponto por ponto acima de 50 (com 65, +0,3 ponto por ano);
    - o alvo da saúde pública ganha 0,2 ponto por ponto acima de 50;
    - a tração das empresas sobe com ela no setor de tecnologia e, menos, na saúde, na indústria e no agro;
    - a vaga e a promoção de quem é cientista valem metade com a ciência cortada e 1,6 vez com a prioridade.
  - **As descobertas** são entradas do mundo na linha do tempo, como a virada da fase:
    - acima de 55 de tecnologia, a chance é de 0,8% por ponto por ano, com no máximo uma a cada 4 anos;
    - a cura põe a saúde pública 4 pontos acima, o satélite põe a aprovação de quem governa 3 pontos acima, e a patente soma 2 pontos à tecnologia;
    - a causa é a decisão que pôs a ciência como prioridade (a posse do governo ou a reforma) nos últimos 30 anos.
  - **A fuga de cérebros:** abaixo de 42, os laboratórios esvaziam (12% por ano, no máximo uma a cada 10 anos). A tecnologia perde 3 pontos, e o corte é a causa.
  - **Na vida de quem joga:**
    - quem está na faculdade ganha a chance da bolsa de iniciação (com a prioridade) ou vê a federal parar (com a ciência cortada); quem já pesquisou é chamado para o edital ou vê o antigo laboratório apagar a luz; a decisão do governo é a causa;
    - a vacina daqui chega ao posto, o satélite passa na TV de quem é criança, e quem tem dinheiro pode entrar de sócio na empresa que nasceu da patente;
    - as jogadas de quem é bilionário (a cura e o foguete) somam ao estoque do país.
  - **Ler a política é consultar quem a decidiu:** o storylet que pede `pais.pol_pesquisa` aponta a posse ou a reforma que a pôs ali.
- **Fica para depois, com o motivo:**
  - o orçamento item por item (o resto da I-31, no bloco B2): a pesquisa entra no gasto em pontos do PIB, como a saúde e a escola;
  - a pesquisa privada como estoque de cada empresa: a empresa ainda não tem caixa (I-11);
  - os pesquisadores como pessoas e o setor privado do país (I-36);
  - a corrida tecnológica com os países de fora.
- **Prioridade:** Média · bloco D do dono.
- **Estado:** feita em parte (bloco D, 26/10): o investimento público vira estoque e o estoque vira produtividade, saúde e descoberta, com causa no livro. Faltam a pesquisa das empresas e o setor privado (I-36).

## Fase 7 — defesa e conflito

### I-60 · Forças armadas como capacidade
- **Problema:** não existem.
- **Módulos:** 9, 6, 3.
- **Depende de:** I-31.
- **Custo:** G.
- **Consome:** o orçamento, o pessoal e o equipamento.
- **Efeitos causais:** a capacidade dissuade e custa.
- **Riscos:** nenhum.
- **Aceitação:** a capacidade é um estoque com custo anual.
- **Pedido do dono (19/10):** sistemas de armamento e guerra.
- **Desenho do bloco E (26/10):**
  - **A política "Defesa"**, a oitava da folha País, com três níveis: desmobilizada, regular ou reforçada.
    - O gasto anda −0,3, 0 e +0,5 ponto do PIB, no primário, como a saúde e a ciência.
    - Armar-se preocupa os vizinhos: a relação com os países de fora anda +2, 0 e −3. A farda dá um pouco de aprovação (−1, 0 e +1).
    - Cada bloco tem o seu nível: a aliança da ordem e o Regime reforçam, a frente popular desmobiliza, o bloco liberal e o centrão ficam no regular.
  - **A capacidade das Forças Armadas** (`pais.defesa`, de 0 a 100) anda 8% por ano para 50, mais 15 com a defesa reforçada (menos 15 desmobilizada), mais 0,3 ponto por ponto de tecnologia acima de 50: o armamento moderno vem da pesquisa.
  - **Os sistemas de armamento** (`mundo.json › sistemas`): quem governa encomenda um por ano, pela folha País, com o custo e a entrega à vista:
    - os caças (0,6 ponto do PIB, +6 de capacidade, entregues em 3 anos);
    - o submarino (0,8, +7, em 5 anos);
    - a defesa antiaérea (0,3, +3, em 2 anos);
    - o satélite militar (0,4, +4, em 3 anos), que pede tecnologia 55.
    A encomenda vai para a dívida na hora; a entrega soma à capacidade, com a encomenda de causa, e o equipamento envelhece de volta para o alvo.
  - **A dissuasão:** a capacidade muda a chance da guerra (o dobro a cada 15 pontos abaixo de 50, a metade a cada 15 acima).
  - **A vaga de militar anda com a verba da defesa**, como a de cientista com a da ciência (`carreiras › verba`).
- **O que mudou ao medir (26/10):** nada no desenho da capacidade e dos sistemas. Nas vidas do túnel, quem governa raramente encomenda (os robôs só governam de vez em quando); a encomenda é decisão de quem joga no poder. Entrou uma regra: o que quem governava encomendou e ainda não chegou passa a quem herda, na capacidade do país (o livro novo não tem a encomenda).
- **Prioridade:** Média · Fase 7.
- **Estado:** feita (bloco E, 26/10).

### I-61 · Guerra como processo com custos
- **Problema:** a missão pede guerra com mobilização, logística, perdas, ocupação, impasse, negociação e reconstrução.
- **Módulos:** 9, 4, 6, 8, 10.
- **Depende de:** I-60, I-21 e I-70.
- **Custo:** GG.
- **Consome:** dinheiro, pessoas, equipamento e legitimidade.
- **Efeitos causais:** a guerra muda a economia, a população, a dívida e as relações por anos.
- **Riscos:** tom e sensibilidade. É abstrata e sem glorificação, e nunca uma ação instantânea.
- **Aceitação:** vitória, derrota, impasse e negociação são possíveis; os custos ficam no livro e testados.
- **O começo, no bloco E (26/10):**
  - **Como começa:** com um país de fora que já sanciona o Brasil e com a relação abaixo de 15, a chance por ano é de 5% vezes a dissuasão (até 25%). A guerra é uma qualidade do país de fora e do Brasil, com a notícia de causa; a notícia aponta a decisão que esfriou a relação (o rompimento, a posse, a tarifa) e, com a capacidade abaixo de 45, a decisão que desmobilizou.
  - **Os anos de guerra:** o crescimento perde 2,5 pontos, a inflação ganha 2, o governo gasta 2 pontos do PIB a mais, a população perde 0,1% por ano e a aprovação anda 3 pontos para baixo. No primeiro ano, o país se une: a aprovação sobe 5 na hora.
  - **Como acaba:** a partir do segundo ano, 25% de chance por ano, mais 25 pontos no ano em que quem governa pede a paz. Pela razão entre a capacidade daqui e a força de lá (`estrangeiros › forca`), vem a vitória (o outro recua), a derrota (a reparação soma 4 pontos à dívida) ou o cessar-fogo (a sanção continua). A notícia do fim aponta o começo e o pedido de paz.
  - **Na vida de quem joga:** a convocação (de 18 a 30 anos) e o filho convocado chegam no ano em que a guerra começa, com ela de causa; o racionamento e a fábrica de munição aparecem nos anos de guerra; quem serviu carrega a marca de quem voltou.
  - **O tom:** abstrata e sem glorificação. Ninguém morre num storylet de guerra; a guerra mata pela estatística do país, e o que ela deixa é a dívida, a inflação e quem voltou diferente.
- **O que mudou ao medir (26/10):**
  - com a relação abaixo de 15, nenhuma guerra começou em 1.200 vidas: a sanção com a relação tão baixa acontece em 0,1% dos anos. O limite passou a 25 ("frio", perto de hostil), e a guerra aparece em 2,5% das vidas;
  - o crescimento perdia 2,5 pontos por ano de guerra, mas a persistência do ciclo acumula a perda: os anos de guerra ficavam 6,8 pontos abaixo dos de paz. A perda passou a 1,2 ponto por ano, e a diferença ficou em uns 4;
  - entraram três regras que o desenho não tinha: a guerra acaba de cansaço no oitavo ano (em cessar-fogo), dez anos sem outra depois dela, e a sanção do inimigo não acaba durante a guerra (quem governa também não visita nem rompe com ele: só pede a paz).
- **Fica para depois:** a ocupação e o território, a mobilização da economia, a logística, as alianças militares (I-51), a guerra entre os países de fora e a reconstrução como programa.
- **Prioridade:** Média · Fase 7.
- **Estado:** parte feita (bloco E, 26/10): o começo, os anos de guerra e o fim.

### I-62 · Coerção econômica além da sanção
- **Problema:** já existem sanção e tarifa; faltam embargo, congelamento de reservas e controle de exportação.
- **Módulos:** 8, 4.
- **Depende de:** I-33 e I-50.
- **Custo:** M.
- **Consome:** a relação.
- **Efeitos causais:** atingem setores e reservas específicos.
- **Riscos:** os portões do incremento 10.
- **Aceitação:** cada instrumento tem alvo e custo para quem aplica.
- **Prioridade:** Baixa · Fase 7.
- **Estado:** proposta.

### I-63 · Espionagem, influência, ciber e guerra híbrida
- **Problema:** a missão pede modelos abstratos.
- **Módulos:** 9, 8.
- **Depende de:** I-60.
- **Custo:** G.
- **Consome:** o orçamento de inteligência e o risco de exposição.
- **Efeitos causais:** informação, eleição e infraestrutura do alvo.
- **Riscos:** tom.
- **Aceitação:** cada operação tem custo, chance e consequência quando é descoberta.
- **Prioridade:** Baixa · Fase 7.
- **Estado:** proposta.

### I-64 · Mudança de fronteira e suas consequências
- **Problema:** anexação, ocupação e independência mudam instituições, comércio, dívida e população.
- **Módulos:** 7, 9, 3.
- **Depende de:** I-43 e I-61.
- **Custo:** G.
- **Consome:** território e população.
- **Efeitos causais:** a dívida e a população mudam de dono; o comércio é refeito.
- **Riscos:** nenhum além do escopo.
- **Aceitação:** a conservação de população e de dívida na mudança é testada.
- **Prioridade:** Baixa · Fase 7.
- **Estado:** proposta.

## Fase 8 — sociedade e civilização

### I-70 · Demografia por coortes
- **Problema:** a população não existe como número. (Bloco A, 19/10: agora existe, como um número só, com a transição demográfica, a saúde e a pobreza; faltam as coortes e o efeito no trabalho e na previdência.)
- **Módulos:** 10, 7.
- **Depende de:** I-21.
- **Custo:** G de implementação; médio de simulação.
- **Consome:** nada.
- **Efeitos causais:** o envelhecimento muda a previdência, o trabalho e o crescimento.
- **Riscos:** a CPU.
- **Aceitação:** as coortes andam com natalidade, mortalidade e migração.
- **Prioridade:** Média · Fase 8.
- **Estado:** proposta.

### I-71 · Religião e cultura como distribuições que mudam
- **Problema:** a missão pede diversidade interna e mudança, sem estereótipos fixos.
- **Módulos:** 10.
- **Depende de:** I-70.
- **Custo:** G.
- **Consome:** nada.
- **Efeitos causais:** a distribuição muda com educação, migração e eventos, e pesa em política e costumes.
- **Riscos:** a sensibilidade. Nenhuma sociedade é um rótulo; os resultados vêm de regras.
- **Aceitação:** as distribuições mudam por regras testadas.
- **Prioridade:** Baixa · Fase 8.
- **Estado:** proposta.

### I-72 · Movimentos sociais e ideologias
- **Problema:** hoje há a aprovação do governo e greves como eventos.
- **Módulos:** 10, 6.
- **Depende de:** I-70 e I-42.
- **Custo:** G.
- **Consome:** a atenção pública.
- **Efeitos causais:** os movimentos nascem de condições (desigualdade, repressão) e mudam a política.
- **Riscos:** nenhum além do escopo.
- **Aceitação:** os movimentos têm causa no livro.
- **Prioridade:** Baixa · Fase 8.
- **Estado:** proposta.

### I-73 · Projetos de sociedade
- **Problema:** a missão pede utopias, distopias, ultrarquias e distrarquias, com definição formal quando necessário.
- **Módulos:** 10, 6.
- **Depende de:** I-44 e I-71.
- **Custo:** G.
- **Consome:** a legitimidade e o orçamento.
- **Efeitos causais:** as reformas têm efeitos pretendidos e colaterais.
- **Riscos:** a definição precisa vir antes do código.
- **Aceitação:** cada termo tem uma definição operacional (que indicadores) antes de existir no motor.
- **Prioridade:** Baixa · Fase 8.
- **Estado:** proposta.


### I-114 · A vida longa: a ciência contra a morte
- **Problema:** o dono: "uma coisa que quero muito é resolver o problema da morte física e da descontinuação mental, através da ciência (nanopartículas, a reversão do envelhecimento e a continuação indefinida do senso de eu)".
- **Módulos:** 5, 6, 10.
- **Depende de:** I-54 e I-111 (a pesquisa paga pela empresa).
- **Custo:** G.
- **Consome:** bilhões em pesquisa (da empresa, da fundação ou do Estado), anos e o risco do fracasso.
- **Efeitos causais:** uma árvore de pesquisa com etapas (a terapia do envelhecimento, a reversão, a continuidade do eu); cada etapa vencida diminui a mortalidade de quem joga (e, liberada, a do país) e empurra a idade máxima; a última muda a dinastia (a próxima vida pode ser a sua, de novo).
- **Riscos:** o túnel precisa que as vidas acabem; a fama e a desigualdade (quem tem acesso).
- **Aceitação:** a mortalidade e a idade máxima de quem venceu cada etapa, no túnel; o custo à vista antes.
- **Prioridade:** Média · Fase 8.
- **Estado:** proposta (bloco J).

### I-115 · A progressão civilizatória
- **Problema:** o dono: "quando chega a riquezas astronômicas, não tem mais o que fazer com o dinheiro; poderia ter um sistema de progressão civilizatória".
- **Módulos:** 10, 6, 5.
- **Depende de:** I-54, I-114.
- **Custo:** G.
- **Consome:** trilhões, décadas e a estabilidade do país.
- **Efeitos causais:** uma escada de projetos que dependem uns dos outros (a energia limpa e barata, a cidade inteira automatizada, a órbita, a Lua, Marte, a inteligência artificial geral), cada um mudando o país (crescimento, emprego, desigualdade) e a vida de quem joga.
- **Riscos:** o mundo tem tamanho (o teto da riqueza); o tom.
- **Aceitação:** cada degrau com custo, pré-requisito e consequência no livro; o túnel mede quem sobe.
- **Prioridade:** Média · Fase 8.
- **Estado:** proposta (bloco M).

## Fase 9 — contínuo

### I-80 · Histórico de indicadores
- **Problema:** a folha País mostra a seta do ano, não a história. Patrimônio e indicadores não têm gráfico.
- **Módulos:** 13.
- **Depende de:** nada; melhor depois de I-04.
- **Custo:** M de implementação; simulação nenhum (lê o livro).
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** o peso na tela pequena.
- **Aceitação:** uma linha por indicador, legível nos dois temas.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta.

### I-81 · Alertas e decisões pendentes num lugar só
- **Problema:** com agentes, propostas e contratos, as decisões se espalham.
- **Módulos:** 13, 11.
- **Depende de:** I-10.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** nenhum.
- **Aceitação:** toda decisão pendente aparece no palco, uma por vez.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta.

### I-82 · Relatórios dos agentes
- **Problema:** a missão pede que os agentes reportem o que decidiram, o que gastaram, os riscos e os resultados.
- **Módulos:** 13, 11.
- **Depende de:** I-10.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** nenhum.
- **Aceitação:** o relatório sai do livro, não é texto inventado.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta.

### I-83 · Orçamento de CPU e de save por módulo
- **Problema:** o túnel mede a CPU total, que já reprova (88 ms contra 30). Não se sabe quanto cada módulo custa.
- **Módulos:** 1, todos.
- **Depende de:** I-03.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** nenhum.
- **Aceitação:** o `metricas.md` mostra a CPU e os bytes por módulo, e cada fase tem teto.
- **Prioridade:** Alta · Fase 9.
- **Estado:** parcial (fatia 1.3, 18/10). O túnel mostra a CPU e o que cada etapa do ano deixa no livro, e o tamanho do save. Há dois portões: o save de uma vida ≤ 1 MB e a CPU ≤ +10% da fatia anterior. Falta o teto por fase.

### I-84 · Interface sem regra copiada do motor
- **Problema:** é uma proposta aberta da auditoria de 11/10: literais e fórmulas do motor na interface, e botões que falham em silêncio.
- **Módulos:** 13.
- **Depende de:** nada.
- **Custo:** P a M.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** baixo.
- **Aceitação:** nenhum literal de regra em `src/ui`, e toda operação com motivo.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta.


### I-119 · Os gráficos da vida e do país
- **Problema:** o dono: "quero mais gráficos". Hoje, os números do ano aparecem com a seta do último ano, sem a curva.
- **Módulos:** 13.
- **Depende de:** I-80.
- **Custo:** M.
- **Consome:** nada (sai do livro).
- **Efeitos causais:** a curva do patrimônio, da felicidade e da saúde ao longo da vida, e a do país (o crescimento, a inflação, a dívida), tiradas do livro.
- **Riscos:** a régua da tela (360 px, letra 1,45).
- **Aceitação:** os 52 critérios da régua passam; o gráfico lê no celular.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta (bloco P).

### I-120 · O texto revisado: a gramática do conteúdo inteiro
- **Problema:** o dono: "quero que corrija os erros de gramática".
- **Módulos:** 13.
- **Depende de:** nada.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** uma varredura do conteúdo (concordância, crase, regência, pontuação, a forma do resumo) e regras novas no validador para o que dá para pegar sozinho.
- **Riscos:** nenhum.
- **Aceitação:** a lista do que mudou, e as regras novas no validador.
- **Prioridade:** Alta · Fase 9.
- **Estado:** proposta (correção C4).

### I-121 · NPCs com objetivos próprios
- **Problema:** o dono: "NPCs inteligentes de verdade". O bloco R deu opinião, lembrança e vontade às pessoas; falta elas perseguirem um objetivo ao longo dos anos (a carreira, o casamento, a empresa) e cruzarem o caminho de quem joga por causa dele.
- **Módulos:** 11, 2.
- **Depende de:** I-05.
- **Custo:** G.
- **Consome:** CPU.
- **Efeitos causais:** cada pessoa tem um plano que anda sozinho e bate na vida de quem joga (o amigo que abre a empresa concorrente, a filha que entra na política).
- **Riscos:** CPU por vida.
- **Aceitação:** no túnel, a parte das histórias que nascem do plano de outra pessoa.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta.

### I-122 · Descobrir o que não se sabia que existia
- **Problema:** o dono: "quero descobrir coisas que nem sabia que existiam".
- **Módulos:** 13, 12.
- **Depende de:** nada.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** caminhos escondidos (combinações raras de qualidades que abrem histórias, jogadas e cargos), e o caderno de descobertas entre vidas, que conta o que já se viu sem dizer como.
- **Riscos:** o portão dos storylets mortos (o raro precisa acontecer no túnel).
- **Aceitação:** o caderno entre vidas; no túnel, o que cada descoberta pede.
- **Prioridade:** Média · Fase 9.
- **Estado:** proposta.

## Sem fase (do roteiro e da auditoria anterior)

### I-90 · Crime com consequência
- **Problema:** o crime existe só como eventos soltos (propina, operação policial).
- **Módulos:** 6, 2.
- **Depende de:** I-40 (Judiciário).
- **Custo:** G.
- **Consome:** risco e reputação.
- **Efeitos causais:** investigação, processo e pena com atraso.
- **Riscos:** tom.
- **Aceitação:** o crime tem causa e consequência no livro.
- **Prioridade:** Baixa.
- **Estado:** proposta (roteiro).

### I-91 · Velhice com mais escolhas
- **Problema:** depois dos 65, há duas fichas e pouco a decidir.
- **Módulos:** 1, 2.
- **Depende de:** nada.
- **Custo:** M (conteúdo).
- **Consome:** nada.
- **Efeitos causais:** o que se faz na velhice muda a saúde e o vínculo com a família.
- **Riscos:** os portões de saturação.
- **Aceitação:** os anos depois dos 65 sem acontecimento abaixo de 20%.
- **Prioridade:** Baixa.
- **Estado:** proposta (roteiro).

### I-92 · Setores por UF
- **Problema:** o setor da economia não varia por estado.
- **Módulos:** 7, 4.
- **Depende de:** I-25.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** emprego e salário dependem da economia local.
- **Riscos:** baixo.
- **Aceitação:** a distribuição de setores por UF vem de dados com fonte.
- **Prioridade:** Baixa.
- **Estado:** proposta (roteiro).

### I-93 · Famílias artística e com doença hereditária
- **Problema:** faltam dois tipos de família previstos no nível 2.
- **Módulos:** 2.
- **Depende de:** nada.
- **Custo:** P.
- **Consome:** nada.
- **Efeitos causais:** o talento e a saúde de origem.
- **Riscos:** baixo.
- **Aceitação:** os dois tipos com storylets que os leem.
- **Prioridade:** Baixa.
- **Estado:** proposta (roteiro).

### I-94 · Narradores
- **Problema:** previstos no nível 6: um diretor com personalidade, que escolhe o tom do ano.
- **Módulos:** 1.
- **Depende de:** I-03.
- **Custo:** M.
- **Consome:** nada.
- **Efeitos causais:** a escolha do storylet muda de acordo com o narrador.
- **Riscos:** os portões de saturação.
- **Aceitação:** o túnel mostra vidas diferentes por narrador.
- **Prioridade:** Baixa.
- **Estado:** proposta (roteiro).

### I-95 · A imagem pública esmaece sem cargo
- **Problema:** sem cargo, a popularidade não anda mais (auditoria de 11/10).
- **Módulos:** 6.
- **Depende de:** nada.
- **Custo:** P.
- **Consome:** nada.
- **Efeitos causais:** um escândalo antigo pesa menos com o tempo.
- **Riscos:** as eleições.
- **Aceitação:** o túnel decide a velocidade.
- **Prioridade:** Baixa.
- **Estado:** proposta (auditoria de 11/10).

### I-96 · O país em números
- **Problema:** o dono perguntou por que o país não tem PIB, PIB per capita, Gini, IDH nem população (19/10). As dez estatísticas eram taxas e notas, sem tamanho.
- **Módulos:** 6, 10, 13.
- **Depende de:** nada (o país vivo do incremento 8).
- **Custo:** P de implementação; nenhum de simulação.
- **Consome:** nada.
- **Efeitos causais:** o PIB anda com o crescimento; a população, com a demografia, a saúde e a pobreza; o Gini lê a pobreza e a educação, e a violência lê o Gini; cinco storylets leem os números.
- **Riscos:** os portões do país vivo (a violência passou a ler a educação pelo Gini).
- **Aceitação:** números plausíveis no fim da vida, diferentes de vida para vida, e as cinco histórias vivas (portões do bloco A).
- **Prioridade:** Alta · bloco A do dono.
- **Estado:** feita (19/10).

### I-97 · A cara nova
- **Problema:** o dono mandou um mockup da tela principal como inspiração (19/10): fundo noite com dourado, retrato, os quatro indicadores em cartões com ícone, o dinheiro em cartões, um destaque para o marco da trajetória, os verbos com ícone e cor e um botão dourado para viver mais um ano. A tela de hoje tem os mesmos elementos, sem identidade visual.
- **Módulos:** 13.
- **Depende de:** nada.
- **Custo:** M de implementação; nenhum de simulação.
- **Consome:** altura da tela. A linha do tempo é a história e não pode virar uma fresta.
- **Efeitos causais:** nenhum no motor. O marco da trajetória aparece na própria linha do tempo, para o destaque ser história e não painel.
- **Riscos:**
  - o cabeçalho maior espremer a linha do tempo;
  - a letra grande do APK;
  - o tema claro (o mockup só tem o escuro).
- **Aceitação:**
  - os dois temas com contraste AA;
  - nenhuma rolagem lateral a 360 px com a letra em 145%;
  - a linha do tempo com pelo menos um terço da tela num celular comum (390 × 844);
  - alvos de toque ≥ 44 px.
- **Prioridade:** Alta · pedido do dono.
- **Estado:** feita (bloco V1, 19/10). A linha do tempo ficou com 342 px num celular comum, de 844 (era 419). Com a letra em 145%, ficou com 166 px (era 152). Corrigida em 20/10 (I-101): o cabeçalho de cartões, o retrato, a barra da marca e o modo de letra grande saíram.

### I-98 · De que é feito o patrimônio
- **Problema:** o mockup do dono tem uma rosca com a composição do patrimônio (empresas, investimentos, bens, dinheiro). No cabeçalho, ela custaria a altura da linha do tempo.
- **Módulos:** 13, 5.
- **Depende de:** nada.
- **Custo:** P.
- **Consome:** nada.
- **Efeitos causais:** nenhum; é leitura do balanço.
- **Riscos:** cores que não se distinguem. É uma paleta categórica de no máximo quatro fatias, validada para daltonismo, com a legenda e os valores.
- **Aceitação:** a folha Dinheiro abre com a rosca e a legenda; tocar numa fatia leva à seção dela.
- **Prioridade:** Média.
- **Estado:** proposta (bloco V1).

### I-99 · Escolher o tema dentro do jogo
- **Problema:** o tema segue o do celular; quem quer o escuro de dia não tem como.
- **Módulos:** 13.
- **Depende de:** nada.
- **Custo:** P.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** o save (a escolha fica no aparelho, fora do save da vida).
- **Aceitação:** o menu tem claro, escuro e o do celular, e a escolha volta ao abrir.
- **Prioridade:** Baixa.
- **Estado:** proposta (bloco V1).

### I-100 · O ícone do app Android na cor nova
- **Problema:** os ícones do PWA mudaram para o ouro, mas o ícone do app Android instalado (`android/app/src/main/res/mipmap-*`) é outro arquivo e continua o antigo.
- **Módulos:** 13.
- **Depende de:** nada.
- **Custo:** P.
- **Consome:** nada.
- **Efeitos causais:** nenhum.
- **Riscos:** o build do APK no CI.
- **Aceitação:** `npm run icones` desenha também os ícones do Android, e o APK sai com o ícone novo.
- **Prioridade:** Baixa.
- **Estado:** proposta (bloco V1).

### I-101 · A história de volta ao centro (correção C1 da cara nova)
- **Problema:** o dono jogou o V1 e disse que o jogo perdeu qualidade, hierarquia, dimensionamento, cuidado e diversão (19/10). A auditoria (`docs/decisoes.md`, correção) mediu no aparelho dele, com a letra do sistema em 1,45 numa tela de 360 × 780:
  - a linha do tempo com 20–28% da tela e, durante um evento, 11 px;
  - números do dinheiro cortados com reticências;
  - o botão dourado do ano pulando as escolhas que sobravam;
  - o segundo toque de um toque duplo passando o ano depois de um evento (12 em 40);
  - folhas que só fecham rolando até o fim, e o voltar do Android fechando o app;
  - a Família com o CSS quebrado ("Saúde43");
  - a Carreira com 56 profissões antes do Poder.
- **Módulos:** 13.
- **Depende de:** I-97.
- **Custo:** M de implementação; nenhum de simulação.
- **Consome:** nada.
- **Efeitos causais:** nenhum no motor.
- **Riscos:**
  - desfazer a identidade que o dono pediu (o tema noite e ouro fica);
  - esconder rótulos para caber (proibido: o arranjo cede por quebra de linha);
  - o voltar no APK, que não dá para testar sem o aparelho.
- **Aceitação:** os critérios do plano de correção, item 1 a 10, medidos na matriz 360 × 780 (letra 1,0 a 1,45), 390 × 844, 412 × 915 e 320 × 640, nos dois temas.
- **Prioridade:** Alta · pedido do dono.
- **Estado:** feita (correção C1, 20/10).

### I-102 · Relações de verdade (pedido do dono, 25/10)
- **Problema:** o dono quer relacionamento de verdade. Pediu:
  - progressão, causa e consequência com cada personagem principal;
  - personagens únicos, que parecem vivos e que lembram;
  - emoção forte: a morte que dói pela história que vocês tiveram, a alegria, a raiva;
  - o peso de cada decisão, boa, ruim ou neutra.
  Hoje a relação é um número só (o vínculo), que volta sozinho para o equilíbrio. Ninguém lembra do que você fez, ninguém guarda mágoa, a distância não pesa, e a morte dói igual para todo mundo.
- **Módulos:** 11, 12, 13.
- **Depende de:** I-05 (parcial: as pessoas já têm id estável).
- **Custo:**
  - implementação: G;
  - simulação: pouco (três campos por pessoa; o resto sai do livro).
- **Consome:** fichas do ano. Cuidar de uma relação é uma ação, com custo de oportunidade.
- **Efeitos causais:**
  - **mágoa:** sobe com o que machucou e passa no ritmo do perdão do traço; puxa o vínculo para baixo, faz a pessoa brigar mais e ajudar menos, e a partir de 42 rompe a relação (o par faz as malas a partir de 45, medido no túnel);
  - **confiança:** abre o conselho e o segredo, e decide se a verdade dita vira conversa ou briga;
  - **anos sem contato:** esfriam o vínculo e trazem a saudade;
  - **memória:** a pessoa lembra da melhor e da pior coisa que você fez com ela, e o texto cita ("de quando você…, aos 34");
  - **na morte:** quem morre magoado ou longe deixa remorso; quem estava perto deixa a despedida;
  - **o gosto** de cada pessoa (futebol, pescaria, novela…) decide o presente certo e o programa junto.
- **Riscos:**
  - mudar o equilíbrio do vínculo (o túnel mede);
  - texto que cita lembrança sem lembrança (há o texto de quando não há);
  - storylets novos mortos no túnel;
  - save antigo: a confiança guarda a diferença para 60, então o save antigo lê 60 sem migrar.
- **Aceitação:**
  - o livro fecha para toda pessoa;
  - nenhum storylet morto;
  - nenhuma estratégia dominante;
  - a folha Família mostra o humor, a confiança, a mágoa, a distância, o gosto e as lembranças de cada pessoa;
  - numa vida jogada, a morte de alguém próximo conta o que foi a relação.
- **Prioridade:** Alta · pedido do dono.
- **Estado:** feito (25/10, bloco R).

### I-103 · Pessoas que sabem quem você é (pedido do dono, 25/10)
- **Problema:** depois do I-102, cada pessoa tem mágoa, confiança, saudade e lembranças. O dono pediu mais: que as pessoas decidam sozinhas, tenham vontades, percebam o jeito de quem joga, lembrem do que ele fez e do que deixou de fazer, e ajam pelo que sabem dele. Hoje ninguém tem opinião sobre quem joga, ninguém quer nada da vida, e faltar quando alguém precisou não deixa rastro.
- **O que dá para fazer, e o que não dá:**
  - não há consciência de verdade, nem texto gerado: o jogo não tem servidor, e o motor tem de ser puro e determinístico;
  - o que dá é o comportamento de quem conhece você: a pessoa tira do que viu uma opinião sobre o seu jeito, guarda o que você fez e o que deixou de fazer, quer coisas, cobra e reage;
  - tudo sai do livro-razão, então a pessoa sabe o que viu ou soube, e ninguém sabe o que não tem como saber.
- **Módulos:** 11, 12, 13.
- **Depende de:** I-102.
- **Custo:**
  - implementação: G;
  - simulação: quase zero. A opinião sai do livro, com o que já foi somado guardado fora do estado; as vontades são qualidades.
- **Consome:** fichas do ano. Realizar a vontade de alguém é uma ação da folha Família.
- **Efeitos causais:**
  - **O que a pessoa acha de você** (`ator.visao`) sai do que ela viu:
    - o que você fez com ela: o afeto, a mágoa, a confiança, o dinheiro dado e o pedido;
    - os anos longe e as vezes em que você faltou;
    - o que é público: a formatura, a fama, a fortuna e o cargo;
    - o que só quem está perto sabe: o nome sujo e a encrenca;
    - o amor e os avós também veem como você trata os filhos.
  - **As opiniões possíveis:**
    - orgulho da família, presente, carinhoso, de palavra, generoso;
    - sumido, metido, interesseiro, cabeça-quente, sem palavra, casado com o trabalho.
  - **O que a opinião muda:**
    - as iniciativas: quem acha você sumido procura menos, e quem acha você generoso pede mais;
    - o texto: a opinião vem com o porquê ("acha você generosa: você pagou o conserto do carro dela, aos 31");
    - o que os filhos fazem quando você envelhecer: eles aprenderam com você.
  - **Omissão:**
    - alguém próximo adoece, e você passa o ano sem aparecer;
    - isso vira entrada na linha do tempo ("você não apareceu"), com mágoa e confiança a menos;
    - vira também a pior lembrança, a que a pessoa cita depois.
  - **Vontades:**
    - cada pessoa pode querer uma coisa da vida: ver o mar, voltar à terra onde nasceu, conhecer o neto, casar, ter um filho, um cachorro, uma ajuda para a casa própria;
    - a vontade nasce de uma iniciativa da pessoa e fica gravada com o ano;
    - na folha Família, aparece como "quer…", e realizá-la é uma ação com a pessoa;
    - algumas se realizam pela vida (casar, ter o filho);
    - vontade antiga que pede pressa (casar, ter um filho) vira mágoa a cada ano;
    - quem morre sem ver a vontade realizada deixa remorso, e a morte diz o que faltou ("ela nunca viu o mar").
- **Riscos:**
  - CPU: a opinião varre o livro. A soma do que já foi visto fica guardada por entrada, e o livro só cresce;
  - opinião injusta ou sem porquê: cada opinião aponta a entrada que mais pesou;
  - vontade que nunca se realiza por falta de dinheiro: o custo segue a classe, e há sempre a escolha barata;
  - storylets novos mortos no túnel.
- **Aceitação:**
  - a opinião é determinística e igual com ou sem save no meio;
  - o livro fecha;
  - nenhum storylet morto;
  - nenhuma estratégia dominante;
  - a folha Família mostra a opinião com o porquê e a vontade de cada pessoa;
  - numa vida jogada, uma pessoa cita o que você deixou de fazer, e uma morte diz a vontade que faltou.
- **Prioridade:** Alta · pedido do dono.
- **Estado:** feito (25/10, bloco R).

### I-104 · A convivência faz bem à saúde
- **Problema:** depois do bloco R, cuidar das pessoas custa fichas, e o robô cauteloso troca academia e investimento por família: 36% → 59% das fichas. Ele vive 5,7 anos a menos (91,9 → 86,2) e junta menos (R$ 81 → 59 milhões). É o custo de oportunidade que as fichas pedem. Mas, na vida real, a convivência protege a saúde, e a solidão adoece; o jogo ainda não sabe disso.
- **Módulos:** 11, 12.
- **Depende de:** I-102, I-103.
- **Custo:**
  - implementação: P;
  - simulação: quase zero (o vínculo de quem convive já é lido todo ano).
- **Consome:** nada novo.
- **Efeitos causais:** vínculo alto com quem está perto reduz um pouco a deriva da saúde; anos sem contato com todo mundo e o luto sem despedida aumentam.
- **Riscos:**
  - a cautelosa voltar a dominar idade, patrimônio e felicidade ao mesmo tempo (o túnel mede);
  - a família virar remédio, e não relação.
- **Aceitação:** nenhuma estratégia dominante; a diferença de idade de morte entre quem cuida e quem some fica à vista no túnel.
- **Prioridade:** Média.
- **Estado:** ideia (25/10).

### I-105 · Correção C3: regras que se medem direito
- **Problema:** a auditoria de 20/10 achou regras do motor que medem ou funcionam errado. Os quatro casos:
  - **a régua do túnel:** o "arriscar nunca compensa" divide pelo total de storylets com escolha, não pelos que a conta olha. Os dilemas se medem num bolso só, e os storylets da empresa, sem empresa. No empate, o robô leva a primeira opção e vota 100% num bloco só;
  - **os falsos dilemas:** há opções melhores ou iguais em tudo;
  - **os mandatos sem fim:** 51% das cautelosas ficam mais de 8 anos seguidos no mesmo cargo executivo, e o político faz bico;
  - **a herdeira demitida:** 81% das vidas de família muito rica têm pai ou mãe "demitido", até herdeira e banqueiro, com cesta básica de despedida.
- **Módulos:** 1, 6, 9, 11.
- **Depende de:** nada.
- **Custo:**
  - implementação: P (cada item);
  - simulação: nenhum.
- **Consome:** nada.
- **Efeitos causais:**
  - a régua mede em três bolsos (R$ 1 mil, R$ 10 mil e R$ 50 milhões), com a empresa típica quando o storylet pede uma, e o robô sorteia no empate;
  - toda opção dominada ganha um motivo (custo, teste, consequência lida depois);
  - prefeito, governador e presidente não disputam o terceiro mandato seguido, que aparece desabilitado com o motivo;
  - quem tem cargo, coroa ou regime não faz bico nem entrega;
  - quem vive de patrimônio não é demitido: perde dinheiro na crise, com texto próprio. A demissão de quem é rico não vem com cesta básica.
- **Riscos:** os votos e os dilemas mudam o sorteio das vidas (o túnel inteiro muda), e uma estratégia pode passar a dominar.
- **Aceitação:**
  - cada bloco recebe de 15% a 35% dos últimos votos da cautelosa e da arriscada;
  - 0 falsos dilemas nos três bolsos;
  - 0% das vidas com mais de 8 anos seguidos no mesmo cargo executivo, e 0 bicos em ano de mandato;
  - 0 demissões de quem vive de patrimônio, e no máximo 30% das vidas de família muito rica com pai ou mãe demitido;
  - nenhuma estratégia dominante.
- **Prioridade:** Alta · fecha o plano de correção do dono.
- **Estado:** feito (25/10, correção C3).


### I-113 · Filhos quando quiser
- **Problema:** o dono: "não posso escolher quando ter filhos". Hoje, o filho vem de storylets (o casamento, a gravidez surpresa, mais um filho), e quem reina sem filho perde a dinastia.
- **Módulos:** 2, 11.
- **Depende de:** nada.
- **Custo:** M.
- **Consome:** uma ficha do ano, dinheiro (o tratamento, a adoção) e a saúde.
- **Efeitos causais:** tentar ter um filho (com o par, a chance anda com a idade e a saúde), o tratamento de fertilidade e a adoção (com ou sem par); cada filho entra com a decisão de causa.
- **Riscos:** a demografia das vidas e o tamanho do save (até quatro filhos).
- **Aceitação:** teste das três vias; no túnel, a idade em que se tem o primeiro filho por estratégia.
- **Prioridade:** Alta.
- **Estado:** proposta (bloco K).

### I-116 · O sistema acadêmico completo
- **Problema:** o dono: "mais diplomas, mais graduações, sistema acadêmico completo".
- **Módulos:** 2, 11.
- **Depende de:** nada.
- **Custo:** G.
- **Consome:** anos, mensalidade e fichas.
- **Efeitos causais:** a graduação (curso por área, pública ou particular), o mestrado, o doutorado e a pós, com bolsa, diploma e o que cada um abre nas carreiras.
- **Riscos:** a saturação e o portão das assinaturas.
- **Aceitação:** cada diploma abre ou melhora pelo menos uma carreira; o túnel mede quem chega a cada nível.
- **Prioridade:** Média.
- **Estado:** proposta (bloco L).

### I-117 · Carreiras completas e mais profissões
- **Problema:** o dono: "mais profissões, sistemas de carreiras completo". Hoje, 49 profissões com cargos e promoção.
- **Módulos:** 2, 4.
- **Depende de:** I-116.
- **Custo:** G.
- **Consome:** nada novo.
- **Efeitos causais:** mais profissões, a carreira com mudança de área, o empreendedorismo dentro da profissão (o consultório, o escritório) e a aposentadoria por carreira.
- **Riscos:** a saturação.
- **Aceitação:** o túnel mede a diversidade de carreiras por mil vidas.
- **Prioridade:** Média.
- **Estado:** proposta (bloco L).

## Defeitos conhecidos

Da auditoria de 12/10 (`docs/auditoria-universo.md`). Cada um é corrigido num commit com teste, quando a fatia que mexe naquela parte passar por lá, ou antes se ficar barato.

| Id | Defeito | Onde | Gravidade | Estado |
|---|---|---|---|---|
| D-01 | A coroa vai para a pessoa errada quando quem herda é o par ou o amigo | `herdeiro.ts:437` | Média | corrigido (bloco F, I-106: quem herda recebe a sucessão, seja quem for) |
| D-02 | Qualidades herdadas guardam a idade da geração anterior (`marcaHa` erra a partir da 2ª geração) | `herdeiro.ts:205-208` | Média | aberto |
| D-03 | Dá para ser eleito presidente sob o regime | `poder.ts:59-73` | Média | corrigido (bloco F: sob o Regime, não há eleição geral) |
| D-04 | O monarca coroado continua na carreira de antes e pode ser demitido | `carreira.ts`, `trabalho.ts`, `96-linhagens.json` | Média | corrigido (bloco F: quem tem cargo não é demitido, e a coroa leva a carreira) |
| D-05 | Quatro storylets fazem reforma fora do limite de uma por ano | `99-pais.json` | Baixa | aberto |
| D-06 | A morte do corpo pode sair rotulada como violência | `morte.ts:23-24` | Baixa | aberto |
| D-07 | Os limites do câmbio divergem entre o motor e o campo | `diplomacia.ts:291`, `campos.ts:129` | Baixa | aberto |
| D-08 | O agendado que deixou de valer some sem registro | `diretor.ts:91-93` | Baixa | aberto: a agenda inteira está fora do livro (fatia 1.3) |
| D-09 | Operações da interface que falham em silêncio, e regras copiadas do motor | `App.tsx:154-157`, `Dinheiro.tsx`, `Pais.tsx` | Média | aberto (I-84) |
| D-10 | A chave de assinatura do APK está no repositório | `android/app/build.gradle` | Alta (segurança) | decisão do dono |
| D-11 | O APK sai sem testes e antes do CI terminar | `.github/workflows/android.yml` | Média | aberto |
| D-12 | O save sem cópia nem exportação: JSON corrompido apaga a memória | `src/jogo/salvar.ts` | Média | corrigido (fatia 1.3) |
