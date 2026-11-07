# Trajetória — como trabalhar neste projeto

Simulador de vida em texto, ano a ano, jogado no celular pelo navegador (PWA). O jogador consome uma coisa só: **uma história sobre uma vida que ele mesmo causou, em poucos minutos**. A matéria-prima é texto, números e escolhas; todo o resto é embalagem e só entra se provar que aumenta essa experiência.

A visão em uma troca: o jogador pensa "eu posso tentar qualquer coisa", e o jogo responde "pode, mas o mundo vai reagir". Poucos sistemas fundamentais, milhares de combinações, interface simples (nunca 500 botões), uma vida em minutos.

## Fluxo de cada sessão

1. Leia este arquivo e o começo de `docs/roteiro.md` (o estado e a próxima fatia). Os outros docs são consulta: busque com grep a seção que a tarefa pede, não leia inteiros (`decisoes.md`, `ideias.md`, `metricas.md`, `motor.md` e `arquitetura.md` somam mais de 250 KB). Toda ideia nova entra em `docs/ideias.md` antes de entrar no código.
2. Escolha o incremento de maior impacto pelo método abaixo.
3. Ciclo curto enquanto trabalha: `npx tsc -p .`, `npx vitest run test/<arquivo>` e `npm run tunel:rapido` (2.000 vidas, cerca de 1 min, relatório em `dist-tunel.md`). Commits pequenos e descritivos. Antes de cada push, uma vez: `npm run verificar` (tipos, testes, validador, túnel inteiro e build). Se mexeu na interface, também `npm run telas` contra a build.
4. Push na `main` (o CI publica no GitHub Pages). Sem permissão, abra um PR e diga isso.
5. Atualize as Novidades do README (o que a atualização trouxe e o que não trouxe) e o `CHANGELOG.md`. Termine com: o que mudou, métricas antes e depois, o que foi decidido sozinho e por quê, link do jogo e o que jogar para testar.

Armadilhas que já custaram caro:
- `pkill -f "vite preview"` casa com o próprio shell que o roda e o mata (duas rodadas de `verificar` perdidas). Use `pkill -f "[v]ite preview"`, num comando separado.
- O túnel inteiro reescreve `docs/metricas.md` no fim: commite o resto antes e as métricas depois.
- Comando longo roda em segundo plano, e a notificação avisa quando acaba. Consultar o andamento repetidas vezes gasta contexto à toa.
- Filtre as saídas (`| tail`, `grep`): cada resposta relê o contexto inteiro.
- Interface se mede na escala do dono: 360 × 780 com a letra do sistema em 1,0, 1,15 e 1,45, nos dois temas, além de 390 × 844. O V1 foi medido só num celular comum e quebrou no aparelho dele.
- A CPU absoluta muda de máquina para máquina (depois de um reinício, a mesma versão mediu 46 e 63 ms por vida). Para saber se o código ficou mais caro, compare em A/B na mesma máquina: uma worktree da versão anterior e as duas rodadas alternadas.

## Como pensar (nesta ordem; nunca inverta)

1. **Questione cada requisito**, inclusive os daqui. Todo requisito tem dono e motivo (tabela abaixo); requisito sem motivo é suspeito, e os do agente podem ser apagados.
2. **Apague.** Peça, tela, sistema ou regra que não serve à experiência central sai. Se você nunca precisar devolver algo que cortou, cortou pouco.
3. **Simplifique** o que sobrou.
4. **Acelere o ciclo de feedback** (túnel de vento, `npm run vida`, testes).
5. **Automatize por último**, só o que já provou que funciona.

O erro mais caro é otimizar algo que nem deveria existir. Decisão sem número é palpite: use o túnel. Uma mecânica nova é pontuada em 12 critérios (liberdade, variedade, rejogabilidade, decisão, consequência, interação com outros sistemas, história emergente, fantasia de viver uma vida, diversão, compreensão, custo, reuso); entra o que pontua alto em vários. Menu decorativo, atributo que nada lê e tela de gestão não entram.

## Três invariantes

1. **Um formato de estado.** Pessoa, bicho, lugar, país e empresa são entidades com id, tipo, campos e qualidades. Condições e efeitos leem e escrevem caminhos: `mae.saude`, `lugar.desemprego`, `ator.vinculo`, `empresa.valor`.
2. **Um formato de conteúdo.** Evento (o diretor escolhe), ação (o jogador escolhe) e iniciativa de personagem (a regra do personagem escolhe) são o mesmo storylet: condições, saliência, texto com modelo, opções e efeitos. Um validador, um túnel e um grafo para os três.
3. **Uma causa por mutação.** Toda mudança de estado vai para o livro-razão com quem a causou: escolha, ação, diretor, personagem ou regra. Pontos de virada e a crônica saem dele (há teste, para toda entidade, inclusive quem chega durante a vida: começo + soma das variações = estado final).

## A física do problema

- O inimigo do gênero é a repetição. Conteúdo escrito um por um não escala; a saída é a combinatória: estado que varia de vida para vida (origem, família, traços, região), papéis (o mesmo storylet com a mãe, o pai ou a avó), trechos escolhidos pelo estado e alternâncias `[a|b]`.
- **Qualidades são a memória da vida.** Cada decisão relevante grava uma qualidade com o ano e a entrada que a causou; storylets futuros a consultam. Cadeias multiplicam histórias em vez de somar.
- Personagens têm estado próprio e agem sozinhos; o mundo reage às ações de quem joga.
- Gerar texto custa quase zero; o gargalo é a qualidade, e qualidade se mede.

## Limites que não se negociam

- Conteúdo 100% original: nenhum nome de outro jogo em nenhum arquivo.
- Texto em português do Brasil, leve, às vezes irônico, com ambientação brasileira real. Personagens, partidos e eventos políticos são fictícios e genéricos (o validador recusa partido com nome próprio).
- Mobile-first: uma mão, alvos de toque ≥ 44px, tema claro e escuro, sessão curta.
- Sem backend; save no localStorage com versão de esquema. Save antigo nunca trava o jogo: migra ou recomeça a vida com aviso, mantendo a memória entre vidas.
- Motor puro e determinístico: mesma semente + mesmas decisões = mesma vida, mesmo salvando no meio (há teste).
- Nada quebrado vai para a `main`. Nada irreversível sem perguntar ao dono (apagar histórico, force push, apagar repositório ou a `main`).
- **Toda variável de estado é lida por ≥ 2 sistemas e altera ≥ 1 decisão; toda ação mexe em ≥ 2 sistemas.** O validador bloqueia o contrário (`src/motor/manifesto.ts` declara o que as regras do motor leem e escrevem; um teste joga vidas e confere que toda escrita das regras está declarada).
- O caminho padrão começa em um toque; escolher a origem é opcional.
- Expansão liberada por incremento quando o túnel cumpre os portões e o dono joga 3 vidas da nova build e reporta algo inédito na 3ª. (Em 06/10/2026 o dono autorizou seguir para o próximo nível enquanto os portões passarem, sem esperar ordem; ver `docs/roteiro.md`.)

## Critério de aceitação: o túnel

`npm run tunel` joga 10.000 vidas (4 estratégias × 125 jogadores × 20 vidas seguidas, com a memória entre vidas) e escreve `docs/metricas.md`. Falha (e trava o CI) se:

- algum storylet nunca aparece (morto) ou um não-repetível se repete na mesma vida;
- uma estratégia fixa vence as outras em idade, patrimônio e felicidade ao mesmo tempo;
- o dinheiro de alguma entrada não tem contraparte (as contas não fecham), ou a dívida de quem joga não bate com os contratos (o que se deve não é o que o banco tem a receber).

E mede, com portões por incremento (`docs/decisoes.md` e `docs/roteiro.md`):

- saturação V5 e V20 (instâncias de storylet já vistas na 5ª e na 20ª vida);
- assinaturas de vida distintas por 1.000 vidas (origem, classe final, carreira, estado civil, qualidade principal, categoria da morte);
- mobilidade social (quintil de origem × quintil final: nem determinista nem aleatória);
- dispersão (patrimônio p90/p10, desvio da felicidade, % de patrimônio negativo);
- % das mudanças de estado causadas pelo jogador;
- toques e CPU por vida.

## Arquitetura

```
conteudo/              dados, nunca código
  storylets/*.json     eventos, iniciativas de personagem e ações (formato em docs/conteudo.md)
  linhas.json          linhas curtas dos anos sem storylet
  mortes.json          causas de morte (com condições e categoria)
  marcas.json          efeitos passivos e epitáfios de qualidades
  mundo.json           nomes, cidades, classes, tipos de família, traços, setores, fases, políticas, governos, acontecimentos
src/motor/             motor puro, sem UI: roda em Node e no navegador
  vida.ts              nascer → (fichas do ano) → +1 ano (as etapas do ano, na ordem do manifesto) → escolha
  tipos.ts             estado: entidades, livro-razão (entradas e mudanças), agenda
  campos.ts            campos de cada entidade e leitura de caminhos ("mae.saude")
  livro.ts             as únicas funções que mudam o estado (cada uma anota a mudança, e o dinheiro com a contraparte)
  contas.ts            toda transferência tem dois lados: a conferência das contas e das dívidas (entrada por entrada) e o extrato
  moeda.ts             o dinheiro existe: as contas do país (o mercado, os bancos, o governo, o Banco Central, lá fora) com saldo, o lado de lá de cada real, a soma do mundo que dá zero, o crédito que cria dinheiro, a emissão e o imposto inflacionário
  contratos.ts         a dívida como contrato com o banco (cheque especial, empréstimo, financiamento, acordo): juros, saque, pagamento, limite
  dividas.ts           o ano das dívidas: parcela, atraso, nome sujo, caducar; renegociar e quitar
  tesouro.ts           o título do Tesouro: a taxa travada, o cupom, o vencimento, a venda pelo preço do dia e o calote
  coroa.ts             a coroa recebe: a forma (salário, parte dos impostos, taxa), a dotação e o preço na aprovação; a ilha que quem joga fundou
  sucessao.ts          a coroa, o Regime e a ilha passam a quem herda: a fila, a resposta agendada (agora ou aos 18, a regência) e a ilha que passa sozinha, sem interregno
  pesquisa.ts          o Estado pesquisa: o gasto da ciência em reais, a verba das carreiras, as descobertas (a cura, o satélite, a patente) e a fuga de cérebros, com a decisão de causa
  guerra.ts            a defesa: os sistemas de armamento (encomenda e entrega), a ameaça e a dissuasão, a guerra que começa, custa e acaba (vitória, derrota, cessar-fogo) e o pedido de paz
  origem.ts            origem procedural: classe × tipo de família × traços, linhagem, cidade e família (os irmãos: os mais velhos já nascidos, os mais novos agendados)
  familia.ts           regras anuais dos personagens (e a relação no ano), regra do amor (e o namoro que esfria), iniciativas; a rede: a vida dos irmãos ao fundo, o colega e o chefe que vêm com o trabalho, a rival e o gestor que vêm com a empresa
  relacoes.ts          a relação com cada pessoa: o gosto, o humor, a convivência, as lembranças e o que a pessoa acha de você (do livro, somado pela pessoa que ocupava o papel)
  decisao.ts           a pessoa decide: o pedido (dinheiro, favor, perdão, outra chance, pagar, prazo, aceitar, ouvir) pelo estado e pela memória dela, e o porquê, que aponta a entrada que pesou
  promissorias.ts      o empréstimo entre pessoas: a promissória (quem emprestou e quem deve, pelo número da pessoa), a parcela, o atraso que magoa, a quitação, o calote e quitar pela folha
  projetos.ts          os projetos (mundo.json › projetos): o que quem joga quer, com etapas que são condições do estado; começar e desistir, o sonho que começa por uma escolha (o efeito `sonhar`) e o que passa adiante (`passarSonho`), e o fim (conquista, prazo vencido, sem tempo) com o começo de causa
  segredos.ts          os segredos (mundo.json › segredos): quem sabe e de quem é escondido, a notícia que corre pelos círculos, a revelação com quem contou ({fonte}) e o segredo que acaba calado
  capitulos.ts         os capítulos da vida: a peneira que reconhece no livro os arcos com começo e fim (o plano, o segredo que veio à tona, o amor que voltou, o calote, o favor devolvido, as pazes)
  caminho.ts           o caminho não tomado: a vida como comandos (a gravação), refeita igual; e a outra escolha num ponto de virada, com um robô do jeito de quem joga seguindo dali
  pais.ts              o país vivo: estatísticas, governos, eleição, políticas, a fase do ciclo e o país na vida
  diplomacia.ts        o mundo lá fora: países fictícios, relação, sanções, acordos, o dólar e o ato de quem governa
  trabalho.ts          salário e demissão pelo setor e pela fase; a conta do padrão de vida
  pessoas.ts           criar, promover e matar personagens (luto, herança, viuvez); a identidade de pessoas (o número e quem ocupou cada papel) e a troca de papel (o amor que vira ex, o colega que vira amigo)
  storylets.ts         elegibilidade, aplicar e apresentar storylets, escolher
  diretor.ts           saliência e o storylet do ano
  acoes.ts             a ficha do ano: verbos e a ação de cada um
  efeitos.ts           efeitos de storylets (caminhos, transferências, personagens)
  condicoes.ts         condições compiladas e causas (qualidades consultadas)
  contexto.ts          variáveis de texto lidas do estado ({mae.ocupacao}, {ator.quem}, trechos)
  economia.ts          dinheiro em reais de hoje, inflação, juros, crédito, padrão de vida, gasto da velhice
  carteira.ts          investimentos por classe, mercado do ano, perfil, operações da folha Dinheiro
  empresa.ts           o grupo de quem joga (até 5 empresas): abrir, crescer, retirar, aportar, vender, comprar concorrente (subsidiária), fundir, bolsa (emitir, recomprar, a oferta hostil e a oferta contra quem perdeu a maioria), a mesa de quem manda, quebrar
  negocio.ts           o negócio de cada empresa: caixa, demanda, capacidade e obra, preço, salário, qualidade, marca, verbas; o ano (vendas, custos, imposto, dividendos, o caixa que não fecha), a concorrente que reage, o crédito do banco, os mercados de cada setor (a teia de aranha da oferta e do preço), os empregos da cidade e as decisões da folha
  bens.ts              imóveis, veículos, luxo e mídia: comprar, financiar, morar, alugar, vender; o ano dos bens
  carreira.ts          profissões (mundo.json › carreiras): vaga, cargo, promoção em pirâmide, fama
  poder.ts             influência, eleições, mandato, popularidade, queda do cargo
  influencia.ts        as três esferas da influência (pessoal, política, negócios), tiradas do estado, e as nove conquistas
  herdeiro.ts          dinastia e testamento: partilha, quem herda (filho, sobrinho, par, amigo) e a vida nova (com o sonho que passou adiante)
  fortuna.ts           brincar de deus e quem manda na empresa: as jogadas (storylets "jogada") e a operação da folha
  diretoria.ts         o gestor e as jogadas do negócio: a heurística pelo jeito de quem decide (os robôs e o gestor), a proposta do ano em palavras e o efeito de seguir ou recusar
  morte.ts             morte de quem joga
  virada.ts            pontos de virada e resumo da vida a partir do livro-razão (e como terminou cada sonho)
  memoria.ts           memória do jogador entre vidas (reduz repetição)
  robos.ts             estratégias do túnel e análise de dilemas
  esquema.ts           esquemas Zod do conteúdo (só Node: validador, túnel, testes)
  leitura.ts           valida as fontes com o esquema e indexa
  conteudo.ts          indexa o conteúdo já lido, sem Zod (o navegador usa direto)
  validacao.ts         checagens além do esquema (leitores, sistemas, personagens, cadeias)
  manifesto.ts         o que as regras do motor leem e escrevem (para o validador) e as etapas do ano, cada uma com o que lê e escreve
  regras.ts            números de equilíbrio (ritmo, mortalidade, juros, família, amor…)
  constantes.ts        atributos, papéis, verbos, classes, tipos de família
src/jogo/salvar.ts     save versionado no localStorage (zod/mini), com cópia de segurança e a gravação da vida (o caminho não tomado); exportar e importar pelo menu
src/conteudo.ts        conteúdo embutido no bundle (já validado no CI)
src/ui/                Preact: App, Abertura, Cabecalho, LinhaDoTempo, Palco, Familia, Dinheiro, Carreira, Pais, Projetos (a folha Planos), CartaoVida; Folha (a folha que sobe, com o Fechar fora da rolagem), voltar.ts (o voltar fecha a folha), Icones (SVG), estilo.css (tema noite e ouro)
scripts/               validar, tunel (orquestra as tarefas e analisa), tunel-vida (uma vida e as tarefas), tunel-trabalhador (um por núcleo), medidas, uma-vida, icones (Node com TypeScript nativo)
android/               app Android (Capacitor): o jogo vai dentro do APK, offline; capacitor.config.json na raiz
test/                  Vitest
```

Detalhes do motor em `docs/motor.md`; formato e guia de escrita em `docs/conteudo.md`; estado dos níveis em `docs/roteiro.md`; a arquitetura do universo de bolso (os 13 módulos e as fases) em `docs/arquitetura.md`, sobre a auditoria de `docs/auditoria-universo.md`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | jogo local com recarga |
| `npm run verificar` | tudo que o CI roda: tipos, testes, validador, túnel, build |
| `npm run validar` | só o conteúdo (esquema, ids, caminhos, leitores, personagens, cadeias) |
| `npm run tunel` | 10.000 vidas simuladas, um trabalhador por núcleo → `docs/metricas.md`; falha se uma meta quebrar |
| `npm run tunel:rapido` | 2.000 vidas → `dist-tunel.md` (não toca nas métricas oficiais); `--paralelo=1` roda sem trabalhadores |
| `npm run vida -- 42 cautelosa` | imprime uma vida inteira (semente e estratégia) |
| `npm run telas -- URL` | a régua da tela: 52 critérios de interface na matriz de telas e letras, contra a build no ar (`npx vite build && npx vite preview`); Playwright fora do `package.json` |
| `npm run icones` | redesenha os PNGs do PWA |
| `npm run build:android` | monta o jogo para o app Android (`dist-android`) e copia para `android/`; o APK sai no CI (`.github/workflows/android.yml`) |

Node 22.18+ roda os scripts TypeScript direto (sem build). Use só sintaxe apagável (sem `enum`, sem propriedades no construtor) e imports com `.ts`.

## Requisitos, com dono e motivo

| Requisito | Dono | Motivo |
|---|---|---|
| Uma história causada pelo jogador, em poucos minutos, no celular | dono | é o produto |
| "Eu posso tentar qualquer coisa / o mundo vai reagir" | dono | é a visão do life simulator |
| Três invariantes (um estado, um formato de conteúdo, uma causa por mutação) | dono | poucos sistemas que combinam, e a vida explicável |
| Conteúdo original, nenhum jogo citado; política fictícia e genérica | dono | identidade e risco legal |
| pt-BR leve e irônico, Brasil real (ENEM, CLT, Pix, SUS…) | dono | o público se reconhece |
| Mobile-first, uma mão, alvos ≥ 44px, claro e escuro | dono | é onde e como se joga |
| APK Android com link de download no topo do README, atualizado a cada push na `main` | dono | instalar no celular sem procurar |
| Sem backend; localStorage com versão de esquema; save antigo nunca trava | dono | custo zero e save que sobrevive a mudanças |
| Nada quebrado na `main`; CI roda tudo; nada irreversível sem perguntar | dono | a `main` é o que o jogador recebe |
| Vite + TS estrito + Preact + Vitest + Zod + vite-plugin-pwa; Pages via Actions | dono | pilha mínima e deploy automático |
| Motor puro e determinístico, em Node e navegador | dono | o túnel joga com o mesmo motor que o jogador |
| Conteúdo em JSON, validado (`npm run validar`) | dono | conteúdo escala sem código e sem quebrar |
| Toda variável lida por ≥ 2 sistemas e altera ≥ 1 decisão | dono | estado que nada decide é peso morto |
| Todo real tem contraparte: toda mudança de dinheiro diz de quem veio ou para quem foi, e as contas fecham entrada por entrada (o túnel trava o contrário) | dono (missão Universo de Bolso) | dívida com credor, orçamento do governo, caixa da empresa e taxa de gestor precisam de contas que fecham |
| Toda dívida é contrato com credor, saldo, parcela e atraso; o que se deve é o que o banco tem a receber (o túnel trava o contrário) | dono (missão Universo de Bolso) | parcela atrasada, nome sujo, garantia executada e renegociação precisam de um contrato por trás, não de um número |
| Dívida atrasada só sai do atraso paga, renegociada ou caduca (cinco anos) | agente | quem vivia no limite do cheque especial sujava e limpava o nome a cada ano: ruído na linha do tempo e nenhuma decisão |
| O nome sujo é do motor: o conteúdo lê, não escreve | agente | o nome sujo tem de ter causa no livro (a dívida que atrasou); a marca solta do conteúdo durava para sempre sem dívida nenhuma |
| Financiamento atrasado dois anos vai a leilão; a sobra do lance volta para quem joga | agente | garantia executada é a consequência que faz o financiamento ser decisão, e a sobra evita que o leilão confisque o que já foi pago |
| Túnel com metas e portões (saturação, assinaturas, mobilidade, dispersão, agência, toques) | dono | qualidade se mede |
| Caminho padrão em um toque; origem opcional | dono | começar rápido, e quem quiser escolhe |
| Criar o personagem escolhendo tudo: nome, sobrenome, gênero, cidade, classe, família, linhagem, irmãos, jeito e talentos (pontos) | dono | liberdade na criação; o que não se escolhe é sorteado |
| Primeira infância com decisões e consequências na ordem causal da vida real (quem cuida, vacina, fome, histórias, pré-escola → o que volta dos 5 aos 12) | dono | todos os começos eram iguais e as escolhas não mudavam nada |
| "Nova vida" (no menu, no palco, no cartão) abre a escolha da origem | dono | escolher como será a próxima vida, no começo, durante e depois |
| Testamento escolhido em vida (filho, par, amigo, sobrinhos, causa, bicho) | dono | decidir quem herda e com quem a história continua |
| O país vivo: estatísticas que se causam (crescimento, desemprego, inflação, juros, dívida, pobreza, violência, saúde e educação públicas, aprovação), governos fictícios que se alternam em eleição, o voto de quem joga, e quem governa muda as estatísticas pelas políticas | dono | o mundo inteiro vivo e integrado, com política e estatísticas que respondem a quem joga |
| Brincar de deus: jogadas de bilhões e trilhões (fundação, cura, foguete, cidade, presidente, salvar o país, fundar um país, Marte) e o mundo reagindo a elas | dono | riqueza extrema vira possibilidade, não só número; a causa de cada consequência fica no livro |
| Origens de realeza e de regime num Brasil fictício; profissões, imóveis, bens, eleições, truste | dono | liberdade de verdade e dinheiro que vira poder |
| Expansão por incremento: portões + 3 vidas do dono | dono | provar cada nível antes do próximo |
| Toda escolha e toda ação têm `resumo` | agente | o cartão da vida conta "aos 17, você…" |
| Dinheiro mostrado em reais de hoje | agente | valores nominais de 2080 confundem; a inflação aparece como dinheiro parado que encolhe |
| `marco: true` para ENEM, primeiro emprego, aposentadoria… | agente | a espinha da vida não pode depender de sorteio |
| Personagem novo (`{amor}`, `{filho}`…) só em texto que exige a qualidade que o garante | agente | sem "alguém" no lugar de um nome |
| Pelo menos uma escolha sem condição por storylet | agente | a vida nunca trava |
| Opções somem? Não: aparecem desabilitadas com o motivo | agente | a pobreza também é história |
| Toques ignorados por 450 ms quando um evento aparece ou fecha e quando a lista de um verbo abre ou fecha | agente | toque duplo não pode escolher por você nem passar o ano (depois de um evento, o segundo toque passava o ano 12 vezes em 40) |
| Tela em três faixas (cabeçalho, linha do tempo, palco) que rolam por dentro; nada `sticky` | agente | com a letra do sistema grande, cabeçalho e palco grudados se cruzavam no APK |
| O verbo é um botão curto (um ponto marca o que é novo); tocar abre todas as ações possíveis dele | agente | liberdade de verdade, sem 500 botões na tela; com a letra grande, o nome quebra linha em vez de ser cortado |
| Fichas por ano: 1 criança, 2 adolescente, 3 adulto, 2 depois dos 65; a mesma ação não repete no ano | agente | a agência tem custo de oportunidade; o dono pediu anos mais vividos |
| Dinheiro, empresa, bens, vaga, eleição e testamento não gastam ficha | agente | é gestão, não o que se vive no ano; a decisão aparece no livro como do jogador |
| O empurrão de quem governa soma ao crescimento do país (aquecer ajuda a sair da crise) | agente | o estímulo prendia o país numa crise sem fim (o dono viveu uma) |
| O mundo tem tamanho: empresa até ~R$ 20 tri, investimento que rende até R$ 5 tri, no máximo 3 milhões de funcionários | agente | o dono viu 957 milhões de funcionários e uma herdeira com R$ 357 tri em títulos; estado impossível quebra o Brasil real |
| Popularidade é a imagem pública: pesa em toda eleição e segue para o mandato | agente | 103 efeitos do conteúdo mexiam nela sem consequência para quem não tinha cargo |
| A empresa depende de quem manda (talento, freio do tamanho, morte, venda); só decisões mudam isso | agente | das 250 ideias do dono, as que mudam a história e não só a despesa: mandar sem centralizar e construir o que sobrevive a você |
| Mais de uma empresa, empresa-mãe com centenas de subsidiárias, fusões; vender ou abrir o capital de cada uma | dono | "eu só posso ter uma empresa": o grupo vira história (comprar, juntar, listar, vender aos pedaços) |
| Até 5 empresas; o conteúdo fala da que quem joga cuida de perto, e trocar é decisão dele; subsidiárias são um número dentro do valor | agente | a árvore do grupo cabe no celular e o conteúdo inteiro continua valendo sem reescrever; centenas de subsidiárias como entidades seriam uma tela de gestão |
| A mesa de quem manda: o talento se divide entre as empresas que dependem dele | agente | sem custo, ter cinco empresas era só somar; com ele, crescer o grupo pede delegar |
| Todo acontecimento mostra o porquê (a causa de um ano anterior) na linha do tempo | agente | a causalidade é o diferencial que o dono pediu para o jogo inteiro; o cartão final contava tarde demais |
| A linha do tempo mostra as entradas de regra que têm texto (promoção, fim de mandato); só o resumo do ano fica escondido | agente | o porquê de cada mudança precisa estar à vista |
| A fase do ciclo é o nome do crescimento, com folga para sair dela | agente | sem folga, o país trocava de fase a cada três anos e a linha do tempo virava noticiário |
| Quem governa faz uma reforma por ano (a folha País mostra o efeito antes) | agente | sem limite, bastava acertar as políticas uma vez; com ele, cada reforma tem custo de oportunidade |
| O primeiro voto é marco aos 18–21 e os outros aparecem por saliência (uns 2 por vida) | agente | votar a cada 4 anos repetia o mesmo cartão 15 vezes por vida; aos 16, o marco roubava um ano da adolescência |
| Nenhum bloco é o melhor em tudo: cada um ganha numa estatística e perde em outra | agente | política fictícia e genérica; o jogo mostra trocas, não toma partido |
| O país em números: PIB (que anda com o crescimento), população, PIB per capita, Gini e IDH, na folha País e no conteúdo | dono | o país vivo precisava de tamanho, não só de taxas; o dono pediu em 19/10 |
| Atualizações em blocos pequenos; o README diz o que a última trouxe e o que não trouxe, e o `CHANGELOG.md` guarda o histórico | dono | saber o que mudou sem ler o código |
| O mundo lá fora: quatro países fictícios com economia e relação próprias; alinhamento, tarifa, sanção, acordo e o dólar mudam o crescimento, a inflação e os setores daqui | agente (o dono pediu a próxima do roteiro) | o que o país decide lá fora precisa voltar para a vida de quem joga, como o resto do mundo |
| Sanção e acordo nascem da relação e apontam a decisão que a levou até ali (o ato de quem governa, a posse ou a reeleição de um governo, a tarifa) | agente | o porquê vale lá fora também; sanção sorteada do nada seria ruído |
| A sanção acaba quando a relação volta ou cansa (15% por ano) | agente | sem isso, um governo reeleito prendia o país numa sanção de 20 anos |
| Quem governa faz um ato lá fora por ano (visita, acordo, romper), com a chance de sanção à vista antes | agente | como na reforma: custo de oportunidade e consequência à vista |
| O ano é uma lista de etapas que declaram o que leem e escrevem (`manifesto.ts › ETAPAS_DO_ANO`); um teste falha se uma etapa sair da declaração | agente | a ordem do ano estava só no código, e uma etapa podia ler o que outra escreveu no mesmo ano sem ninguém saber (I-03) |
| O save que abre bem vira a cópia de segurança; o principal estragado volta dela, com aviso; exportar e importar pelo menu | agente | um JSON corrompido apagava a vida e a memória entre vidas (D-12) |
| Até quatro filhos com id estável (`filho`, `filho2`…); o conteúdo de "filho" vale para cada um; sem testamento, os filhos dividem a herança, e o testamento pode escolher um | agente (fatia 1.4a da missão) | um segundo filho apagava o primeiro (I-05); dividir e escolher quem herda vira decisão de dinastia |
| O cabeçalho é uma faixa de texto: o nome com as quatro folhas, a idade e a cidade, o selo da economia (um link), os indicadores em 2×2 com a barra fina e o dinheiro numa linha que quebra; nenhum número cortado; durante um evento, só o nome e o dinheiro | agente (correção C1, 20/10) | a história é o produto e só o que se toca tem caixa; no aparelho do dono (letra 1,45), os cartões do V1 tomavam 287 px e cortavam o dinheiro |
| Tema noite e ouro nos dois modos; `--destaque` pinta fundos e `--destaque-forte` é o ouro de texto | dono (o mockup) | o ouro claro não tem contraste para texto no papel creme |
| A linha do tempo fica com pelo menos um terço da tela em 390 × 844 e em 360 × 780 com a letra 1,0 e 1,15, e um quarto com a letra 1,45 (a do dono) | agente | a história é o produto; o mockup não a mostrava, e o V1 foi medido só num celular comum |
| Um arranjo só: com a letra do sistema grande, o que precisa ceder cede por quebra de linha e por container queries em `em` | agente | o modo de letra grande do V1 trocava o arranjo num limiar, e o dono (letra 1,45) via o pior dos dois |
| O ouro só onde tem papel: o botão do ano sem escolhas, o ponto de novidade, o fio do evento e o marco | agente (correção C1) | ouro em tudo não aponta nada; com ele no título, no botão e nos ícones, o marco deixava de ser o destaque |
| Com escolhas sobrando, "Viver mais 1 ano" é o botão secundário e diz quantas sobram | agente (correção C1) | o botão dourado sempre fazia passar o ano sem as escolhas, e a contagem que avisava saía cortada no aparelho do dono |
| Toda folha tem o título e o Fechar fora da parte que rola, e o voltar do Android fecha a folha | agente (correção C1) | a Carreira pedia rolar 6.000 px para fechar, e o voltar fechava o app |
| Os marcos da vida (`marco: true`) aparecem em dourado na linha do tempo | agente (o mockup do dono) | o destaque do mockup vira história, não painel |
| Relação de verdade com cada pessoa: afeto, confiança, mágoa (que passa no ritmo do perdão do traço e rompe a partir de 42; o par faz as malas a partir de 45) e anos sem contato; a pessoa lembra da melhor e da pior coisa que você fez (do livro), magoada briga mais e ajuda menos; morrer magoado ou longe deixa remorso, perto deixa a despedida | dono (25/10) | "relacionamento de fato, inteligente, com progressão real e causalidade"; NPCs vivos e únicos, a morte que dói pela história, o peso de cada decisão |
| A confiança guarda a diferença para 60 (campo com base); o gosto, o humor e as lembranças saem do estado e do livro | agente | o save antigo vale sem migrar e o livro fecha; estado novo só onde a relação precisa lembrar sozinha |
| Contato é chegar perto: ganhar vínculo zera os anos sem contato; ignorar a ligação não | agente | a distância precisa de uma decisão para acabar; aparecer num storylet não é estar perto |
| Cada pessoa tem opinião sobre quem joga, tirada do que ela viu no livro, do que todo mundo sabe e do que só quem está perto sabe; a opinião mostra o porquê e muda o que a pessoa faz | dono (25/10) | "NPCs que identificam a personalidade do player, lembram do que ele fez ou deixou de fazer e se comportam segundo o que sabem" |
| A opinião sai do livro, com o antigo pesando metade a cada 12 anos; a soma guardada fica fora do estado; quem morreu não forma opinião nova | agente | sem save novo e sem varrer o livro todo ano; ninguém sabe o que não tinha como saber |
| A falta: alguém próximo passa um ano doente sem ver você, e isso vira entrada, mágoa e a pior lembrança (uma vez por doença) | agente | o que você deixou de fazer também é história; antes, faltar não deixava rastro |
| As vontades são qualidades `quer_…` declaradas em `mundo.json`: nascem de uma iniciativa da pessoa, saem realizadas por você ou pela vida, ou perdidas com a idade; a pressa vira mágoa, e morrer com a vontade guardada deixa remorso | agente | a pessoa quer coisas da vida, e a morte diz o que faltou ("ela nunca viu o mar") |
| O par não "rompe": faz as malas, e o namoro acaba de verdade | agente | um par rompido que continuava casado era incoerente |
| Os dilemas se medem em três bolsos (R$ 1 mil, R$ 10 mil e R$ 50 milhões), com a empresa típica quando o storylet pede uma; zero falsos dilemas (há teste com o conteúdo real); no empate em tudo, o robô sorteia | agente (correção C3) | a régua dava o denominador errado e um bolso só; no empate, o robô levava a primeira opção e votava 100% num bloco só |
| No Executivo (prefeito, governador, presidente), dois mandatos seguidos; o terceiro aparece desabilitado com o motivo | agente (correção C3) | 42% das cautelosas ficavam mais de dois mandatos seguidos no mesmo cargo: a política virava eterna |
| Quem tem cargo, coroa ou regime não faz bico nem entrega, nem recebe proposta de emprego | agente (correção C3; a proposta, no bloco C) | o político arriscado fazia 1.427 bicos em ano de mandato a cada 120 vidas, e o rei recebia oferta da concorrente |
| Quem vive de patrimônio (herdeiro, investidor, banqueiro, dono, fazendeiro) não é demitido: na crise, perde parte do que tem; a demissão de quem é rico não vem com cesta básica | agente (correção C3) | 81% das vidas de família muito rica tinham pai ou mãe "demitido", até herdeira e banqueiro |
| O título do Tesouro é um contrato com o governo: taxa travada na compra (o juro real, o prazo e o risco da dívida, sem o imposto), cupom na conta todo ano, o valor de volta no vencimento e a venda pelo preço do dia | dono (bloco B) | "o título comprado do Tesouro entra no balanço como ativo financeiro e paga cupom no caixa de quem comprou" |
| Até 5 títulos ao mesmo tempo, de R$ 100 para cima, e nunca mais de 30% da dívida do país nas mãos de quem joga | agente (bloco B) | o mundo tem tamanho: um trilionário compraria o país inteiro, e a lista de títulos cabe no celular |
| O calote só vem com a dívida acima de 100% do PIB numa recessão ou numa crise; quem perde é quem tinha a dívida (título e renda fixa), e a notícia aponta a posse, a reforma ou o decreto que a levou até ali | agente (bloco B) | o pedido da I-34 ("quem perde no calote é quem tinha a dívida"); calote sorteado do nada seria ruído, e quem governa e gasta demais precisa ver a conta voltar |
| Os títulos entram no patrimônio que paga o padrão de vida | agente (bloco B) | sem isso, emprestar ao governo escondia a fortuna do gasto do padrão e virava a resposta certa |
| O título comprado pela empresa espera o caixa da empresa (I-11) | agente (bloco B) | a empresa é um valor que cresce, sem caixa: o cupom não teria onde cair |
| Quem tem coroa (o monarca do Brasil e quem é soberano da ilha) escolhe como ela recebe: o salário da Casa Real, uma parte dos impostos ou a taxa da coroa; a dotação é a renda de quem reina, paga pelo tesouro ou pela ilha | dono (bloco C) | "por que o soberano não recebe salário, parte dos impostos ou taxa da coroa" |
| Cobrar mais custa aprovação (5 pontos com a parte dos impostos, 15 com a taxa), a reação chega com o decreto de causa, e abaixo de 30 vem o plebiscito ou a greve; a forma muda uma vez por ano | agente (bloco C) | sem preço, a taxa da coroa seria a resposta certa; com ele, cobrar é aposta, e o porquê fica no livro |
| A ilha que quem joga funda é uma entidade com população, PIB e imposto, que anda todo ano e passa a quem herda | dono (bloco C) | "a ilha soberana ganha população, PIB e imposto": o país fundado precisava existir depois da jogada |
| Quem governa decide a ciência (cortada, regular, prioridade: de 0,3% a 0,9% do PIB, pagos pelo Tesouro), e a tecnologia do país anda devagar com ela e com a escola e volta como crescimento, saúde pública, tração das empresas e a vaga de quem é cientista | dono (bloco D) | "usar o Tesouro do Estado para pagar pesquisa e desenvolvimento" |
| A descoberta (a cura, o satélite, a patente) e a fuga de cérebros são entradas do mundo que apontam a decisão que fez o estoque (a posse ou a reforma, mesmo desfeita depois), e chegam à vida de quem joga no ano seguinte | agente (bloco D) | a pesquisa vira cura, satélite e patente, e o porquê vale para ela como para a fase e a sanção |
| Ler uma política é consultar quem a decidiu: o storylet que pede `pais.pol_*` aponta a posse ou a reforma que a pôs ali | agente (bloco D) | o corte da bolsa precisa mostrar o corte da ciência como causa, e não só a marca de quem pesquisa |
| Quem governa decide a defesa (desmobilizada, regular, reforçada: −0,3 a +0,5 ponto do PIB) e encomenda sistemas de armamento, um por ano, que vão para a dívida na hora e chegam anos depois com a encomenda de causa; a capacidade das Forças Armadas anda com a política e a tecnologia | dono (bloco E) | "sistemas de armamento e guerra" |
| A guerra é um processo, não um ato: começa com quem sanciona e anda frio (a capacidade dissuade), custa ao país todo ano, acaba a partir do segundo ano (de cansaço no oitavo) em vitória, derrota ou cessar-fogo, e cada notícia aponta a decisão que a levou até ali | agente (bloco E) | guerra que não acaba prenderia o país, e guerra sorteada do nada seria ruído; o rompimento e a desmobilização precisam voltar como consequência |
| Ninguém morre num storylet de guerra; ela chega à vida pela convocação, pelo racionamento, pela fábrica de munição e por quem voltou | agente (bloco E) | tom e sensibilidade (I-61): abstrata e sem glorificação; a guerra mata pela estatística do país |
| A coroa, o Regime e a ilha passam a quem continua a história, seja quem for (o filho, o par, o amigo, o sobrinho); a resposta vem no primeiro ano ou aos 18 (até lá, a regência), e também quando quem reina morre em vida; até a resposta, quem governava continua | dono (bloco F) | "não estou herdando o regime, a monarquia ou a soberania"; a sucessão sorteada podia levar décadas ou não vir, e o par e o amigo nunca se qualificavam |
| Tomar o poder: o autogolpe de quem é presidente (fechar o Congresso ou mudar a Constituição), o golpe de quem tem influência (liderar os quartéis ou financiar os generais) e a coroa restaurada no plebiscito; dá errado, cai ou vai preso | dono (bloco F) | "não consigo dar um golpe de Estado, tomar o poder ou governar vitalício" |
| Quem joga só governa o país com o cargo que governa: quem foi reinar na ilha que fundou (ou caiu) deixa de governar na hora, e o governo de transição aponta a entrada que mudou o cargo | agente (bloco F) | "quando fundo o país e me torno soberano, continuo governando o Brasil" |
| Sob o Regime, não há eleição geral; quem tem cargo não é demitido, e a carreira para (com a coroa ou o Regime, fica para trás) | agente (bloco F, D-03 e D-04) | dava para ser eleito presidente sob o Regime, e o rei era demitido da carreira de antes |
| Sob o Regime, quem joga governa com a postura dele lá fora (a Federação esfria, a Celeste esquenta), e a sanção que vier aponta o golpe | agente (bloco F) | o mundo reage ao golpe pela relação, como reage às outras decisões de quem governa |
| O resgate do país é um título do Tesouro (com cupom, vencimento e calote), não um reembolso sorteado | agente (bloco F) | "o dinheiro que empresto para o Estado não entra como patrimônio e não rende nada" |
| A pessoa tem identidade, não só papel: um número e a lista de quem ocupou cada papel desde quando; a memória, as lembranças e a opinião são da pessoa | agente (missão Ω1) | o amor novo herdava a memória do antigo, e quem ia embora sumia; o save antigo continua valendo, com a memória pelo papel |
| O amor que vai embora vira ex (até três) e continua vivendo, e pode voltar, a mesma pessoa; a troca de papel vai para o livro marcada `papel` | agente (missão Ω1) | NPCs vivos e únicos, como o dono pediu; a troca não é chegada, nem afeto, nem dinheiro trocando de mão |
| O namoro sem casamento esfria (a chance cresce na juventude e com o vínculo baixo), e quem joga decide: salvar, terminar ou deixar morrer | agente (missão Ω1) | só 12% das vidas chegavam a ter um ex; calibrado para o casamento e os filhos ficarem onde estavam (59% e 42%, contra 60% e 41%) |
| Os irmãos são pessoas: os mais velhos nascem com a família, os mais novos nos primeiros anos (quem escolhe três tem três), e a herança dos pais vai para a conta de cada um | agente (missão Ω1) | os irmãos eram um número que dividia a herança com "os parentes" e nunca apareciam |
| A vida dos irmãos chega como convite quando eles estão perto (o casamento, o batizado) e como notícia quando estão longe; a cura e o emprego de volta não viram notícia | agente (missão Ω1) | a vida de quem está longe aparece quando importa, sem encher a linha do tempo |
| O colega e o chefe vêm com o trabalho, se aposentam aos 67 e saem com ele; o chefe pesa na promoção (0,6 a 1,4) e na demissão (0,7 a 1,8) | agente (missão Ω1) | o trabalho não tinha gente; sem aposentadoria, o chefe envelhecia com quem joga e morria no cargo |
| Até três amigos: o de infância (`de_infancia`) e os da vida adulta (o colega próximo, quando o emprego acaba) | agente (missão Ω1) | a vida adulta também faz amigos |
| A mesma ação não se repete no ano, nem com outra pessoa | agente (missão Ω1) | com a família maior, o programa com a mãe e o com o irmão faziam do ano a mesma coisa duas vezes |
| Com ator de um papel de várias pessoas (filho, irmão, ex, amigo), o texto e os efeitos falam do ator, não do primeiro do papel | agente (missão Ω1) | o conteúdo vale para cada pessoa do papel; o validador cobra |
| Os irmãos não pedem Pix (por enquanto) | agente (missão Ω1) | com cinco pessoas a mais, os robôs pediam Pix a algum irmão quase todo ano e largavam a empresa; volta com os verbos sociais, com a decisão da pessoa |
| Quando a resposta é de uma pessoa, ela decide (`"teste": { "decide": … }`): pelo vínculo, pela confiança, pela mágoa, pelo traço, pelo que acha de você, pelo que você já deu e já pediu a ela, pelo dinheiro que tem, pelo aperto e pela distância; o desfecho diz o porquê ({porque}) e aponta a entrada que pesou | dono (missão Ω2, I-123) | "NPCs que identificam a personalidade do player, lembram do que ele fez ou deixou de fazer e se comportam segundo o que sabem": o dado no vínculo não sabia de nada disso |
| A lembrança e a opinião que nasceu dela (o presente e o "acha você generosa") contam uma vez só na decisão | agente (missão Ω2) | a mesma evidência contada duas vezes fazia de um único presente um cheque em branco |
| Quem não tem o dinheiro não empresta: a chance é zero, e o porquê diz isso | agente (missão Ω2) | com a mágoa zerada e a confiança alta, a mãe sem dinheiro ainda "emprestava" uma vez em dez |
| O tamanho do pedido é do storylet (`ajuste`, de −3 a 3) | agente (missão Ω2) | com a mesma conta, pedir aumento saía mais fácil que pedir folga, e perdoar um caso, mais fácil que um aniversário esquecido |
| A folha mostra como a pessoa está para o pedido ("deve dizer sim", "pode ser que sim", "difícil", "não tem como"), não a chance | agente (missão Ω2) | dá para ler a pessoa antes de pedir sem transformar a relação em planilha |
| O empréstimo entre pessoas é uma promissória: credor e devedor pela pessoa, saldo, parcela, vencimento e atraso; sem juros, fora de `eu.divida` e do nome sujo; entra no patrimônio; cada mudança de saldo com dinheiro anda com o dinheiro entre os dois, na mesma entrada (o túnel confere junto com as dívidas) | dono (missão Ω2, I-123: "o empréstimo entre pessoas é um contrato") | o Pix da mãe virava presente, e o empréstimo ao irmão voltava ou não por sorteio |
| A parcela atrasada magoa quem emprestou (a primeira vez é notícia); três anos sem pagar é calote, que vira a pior lembrança; a última parcela vira confiança | agente (missão Ω2) | o calote vira mágoa, e o favor pago, confiança, como o dono pediu; notícia todo ano encheria a linha do tempo |
| Quem morre leva a dívida, nos dois sentidos, e a herança não paga nem recebe promissória | agente (missão Ω2) | simples e coerente com "quem morre leva"; a partilha continua sendo do banco e dos bens |
| A parcela da promissória sai da conta e, faltando, do que quem joga tem investido | agente (missão Ω2) | com a parcela só da conta, quem investia a sobra dava calote na mãe: 836 calotes para 976 quitações em 2.000 vidas (com o investido, 287 para 1.953) |
| No porquê, entre motivos quase do mesmo tamanho, a lembrança de verdade ganha do estado ("lembra de quando você…" antes de "gosta de você") | agente (missão Ω2) | com o motivo mais pesado puro, só 13% das respostas citavam o passado; com a preferência, 48% |
| Quem joga declara o que quer (os projetos, até três): as etapas são condições do estado e o que ajuda são verbos, ações e folhas que já existem; o fim (conquista, prazo vencido, a pessoa que morreu antes, a desistência) vai para o livro com o começo de causa | dono (missão Ω3, I-124: "o jogador não pode querer nada") | a vida era uma sequência de respostas; o projeto dá direção e um arco que o cartão conta |
| Os projetos são conteúdo (`mundo.json › projetos`), e o storylet que lê um projeto de pé pesa o dobro para o diretor | agente (missão Ω3) | projeto novo sem código, e o mundo apoia a história começada (a visita ao apartamento quando você quer a casa) |
| Começar e desistir de um plano não gastam a ficha do ano; o caminho até lá, sim | agente (missão Ω3) | o plano é intenção, não o que se vive no ano; o custo de oportunidade fica nas ações que ajudam |
| Pagar o que se deve não conta como dar na opinião da pessoa; atrasar, dar calote e quitar contam como coisa que você fez | agente (missão Ω2) | sem isso, devolver o dinheiro da mãe fazia você "generoso" aos olhos dela |
| Os segredos são qualidades da pessoa (`escondido_<tema>` no alvo, `sabe_<tema>` em quem sabe, com a entrada de causa) e o tema é conteúdo (`mundo.json › segredos`); a notícia corre pelos círculos (a família e o par; os amigos, o par e os irmãos; os ex e os amigos; o colega e o chefe), e quem fica sabendo perde confiança em você numa entrada que conta como coisa que você fez | agente (missão Ω4, I-125) | o que a vida esconde também é história; o segredo que ninguém sabe não muda opinião nenhuma, e a irmã não conta ao chefe sem caminho (há teste) |
| A notícia que chega ao alvo agenda a revelação do mesmo ano, com quem contou (`{fonte}`) e a entrada em que essa pessoa soube de causa; se quem contou saiu da vida, ela não acontece | agente (missão Ω4) | o porquê da revelação aponta a escolha que deixou o segredo escapar ("você desabafou com sua irmã") |
| A fofoca corre de lado: quem sabe conta a terceiros duas vezes mais do que ao alvo, cada tema tem o quanto corre, e quem está muito magoado (40) conta direto ao alvo | agente (missão Ω4) | na primeira medida, 25 boatos para 538 segredos: a notícia ia direto ao alvo e não havia fofoca para contar |
| Quem sabe pesa o segredo no pedido (a gravidade do tema dividida por 24) e diz por quê ("porque sabe do caso"); quem te emprestou dinheiro sabe da dívida sem ninguém contar | agente (missão Ω4) | a pessoa decide pelo que sabe, e quem sabe precisava mudar alguma decisão |
| A chantagem custa uma fração do patrimônio, não um Pix para quem chantageia; criança conta a partir dos 8 | agente (missão Ω4) | o dinheiro do colega não é lido por ninguém (seria estado morto); o irmão que viu você chegando da festa precisava poder contar à mãe |
| Os capítulos da vida são padrões lidos do livro (o plano, o segredo que veio à tona, o amor que voltou, o calote, o favor devolvido, as pazes), com título e frase tirados dos resumos; a linha do tempo marca o fim de cada um e o cartão conta os mais longos | agente (missão Ω5, I-126) | o livro guarda o porquê, mas a vida em lista de anos não se lia como história |
| A interface grava a vida como comandos, com o começo e a memória do começo, no save (fora do estado); no cartão, a escolha que virou ponto de virada pode ser trocada, e a vida que não foi vivida aparece como experimento do modelo, só se a vida refeita for a mesma até o ponto | agente (missão Ω5, I-127) | quem joga não tinha como saber o peso de uma escolha; fora do estado, o túnel não paga e o determinismo não muda |
| Depois de um ano pesado (o que aconteceu tirou 8 de felicidade ou mais), a história leve pesa 1,6 e a pesada 0,6 | agente (missão Ω6, I-128) | a vida respira; medido em A/B, os anos pesados colados caem de 5,7% para 5,1% |
| O túnel mede a variedade pelo caminho (as causas dos pontos de virada, com a escolha quando a causa foi uma escolha, os capítulos e o arco do sonho) ao lado do destino, e os elos de causa distintos; mostra também o caminho sem o arco do sonho | agente (missão Ω6, I-129; a escolha e o arco, bloco S1) | duas vidas com o mesmo destino e causas diferentes contavam como iguais; e quem sonhou com a estrela e quem sonhou com o império, vindos do mesmo marco, também. O caminho sem o arco é a régua comparável com as versões de antes do sonho |
| A empresa é um negócio: caixa, demanda, capacidade (com um ano de obra), preço, salário, qualidade, marca, marketing, P&D e exportação; vende o que a estrutura entrega, paga custos e imposto, distribui dividendos do lucro, e o valor segue os fundamentos | dono (bloco H, I-132) | "as empresas não têm caixa, não têm produto… eu só subo o patrimônio até o limite": um número que sobe não é um negócio |
| O caixa da empresa tem contraparte, como o dinheiro de quem joga (o túnel confere), e nunca termina negativo: faltou caixa, ela vende estrutura pela metade do custo | agente (bloco H) | as contas fecham na empresa também; caixa negativo sem dívida seria dinheiro do nada |
| A quebra tem causa: dois anos seguidos no prejuízo, com o caixa que não pagou as contas no segundo; a folha avisa no primeiro | agente (bloco H) | vendendo estrutura a cada aperto, a empresa encolhia e não morria (13% de quebra, contra 29% antes); o aviso dá um ano para reagir |
| Os empregos das empresas mexem no desemprego da cidade, o imposto baixa a dívida do país, o dólar do ano entra no caixa (quem exporta recebe mais, quem importa paga mais) e a sanção fecha a exportação com a sanção de causa | dono (bloco H) | "que influencie a economia, as finanças, os personagens, a política, a geoeconomia e a geopolítica" |
| A mídia própria vende publicidade e dá influência a quem é dono; o aluguel sente a vacância; a fama de quem manda e a mídia puxam a marca | dono (bloco H) | "muito prédio que pode gerar renda e não gera, emissoras de TV e rádio; fama, influência e poder não mudam nada" |
| Cada real existe: as contas do país (as empresas e as famílias, os bancos, o governo, o Banco Central e lá fora) têm saldo; o dinheiro que vem de fora da vida sai de uma delas e o que vai para fora entra nela, no mesmo lançamento; a soma de todo o dinheiro do mundo é zero (o túnel trava o contrário, entrada por entrada e no fim de cada vida) | dono (bloco $, I-133) | "quero que cada real exista de fato, que cada uso movimente a economia, com emissão monetária de fato: dinheiro que tenha de onde vir e para onde ir" |
| O dinheiro nasce quando os bancos emprestam e quando o Banco Central emite, e morre quando o empréstimo volta e quando ele enxuga; a inflação come o dinheiro de todo mundo e vai para quem emitiu | agente (bloco $) | é como o dinheiro de verdade funciona; sem isso, "o mercado" pagava salário de um poço sem fundo |
| Quem governa decide a moeda (contida, regular, impressora: o Banco Central enxuga 1% do PIB, não emite ou emite 3% para o governo gastar); o dinheiro que sobra na economia acende a inflação e aquece o crescimento do ano seguinte, e o crédito desfaz metade do excesso por ano | agente (bloco $) | a emissão precisa de dono e de preço; sem a volta, uma impressora ligada uma vez ficava para sempre |
| O que quem joga paga ou recebe do mercado move o dinheiro que circula: a fortuna gasta de uma vez vira inflação | agente (bloco $) | "que cada uso realmente o movimente na economia" |
| A empresa disputa a clientela com uma concorrente que reage: ela corre atrás de quem atrai muito mais, entra na guerra de preços contra quem cobra o popular, chega nova quando o lucro é alto e quebra quando perde a briga (a clientela vem junto); cada notícia aponta a decisão de preço que a provocou | dono (bloco H2, I-134) | "o simulador de empresas precisa ser de verdade": sem concorrência, crescer era só somar |
| A empresa pega crédito no banco (dinheiro novo, como no bloco $), paga o juro real (Selic − inflação + 3) antes do imposto e 10% da dívida por ano do caixa; a dívida sai do valor | dono (bloco H2) | alavancagem é decisão: cresce mais rápido com o juro baixo e quebra mais rápido com o juro alto |
| Cada setor é um mercado (entidade `setor_<id>`): a oferta relativa faz o preço (elasticidade 1,5), e a onda de obras responde ao preço com inércia, o que dá ciclos de boom e sobra de uns oito anos; o preço do setor entra na receita da empresa, a sobra tira a concorrente fraca e aperta a demissão de quem trabalha nele, e a falta chama concorrente nova | agente (bloco H3, I-135; o dono pediu a empresa "10× melhor") | o mercado de verdade tem ciclo próprio: construir na alta é encontrar a sobra, e comprar na baixa é decisão; um número por setor faz a empresa, a concorrência e o emprego da família andarem juntos |
| Comprar a concorrente custa o preço do dia (o preço do setor vezes a força dela: barata na sobra e quando está fraca), entrega o negócio pelo preço justo e tira 15 pontos da concorrente; a folha mostra a fatia do mercado e o que a obra em andamento no setor diz do preço do ano que vem | agente (bloco H4, I-136; o dono pediu mais da empresa) | o momento da compra vira decisão, e a obra do setor é o indicador antecedente que deixa quem joga ler o ciclo antes dele chegar |
| O capitalismo integrado: cada setor compra insumo de outro (`mundo.json › setores`: `insumo`, `parteDoInsumo`), e o preço do fornecedor entra no custo; quem tem empresa no setor fornecedor compra a preço de custo; a folha anda 3% por ponto de desemprego abaixo do natural; o imposto da empresa segue a política de impostos de quem governa; o lobby (2% do valor) pode baixar a política de impostos de um governo que não é o de quem joga, uma vez, com o lobby de causa | dono (bloco H5, I-137: "o núcleo da nova grande atualização é o simulador de capitalismo") | a empresa deixa de ser uma ilha: o fornecedor, o trabalhador e o governo entram na conta, e quem joga pode mexer em cada um (comprar o fornecedor, pagar o salário, fazer lobby) |
| A influência tem três esferas tiradas do estado, sem número novo: a pessoal (6 por laço forte, 0,7 da fama), a política (o poder do cargo, 0,3 da popularidade, o lobby, a mídia própria, a linhagem) e a de negócios (12 por zero do valor da maior empresa acima de R$ 100 mil, o truste, as empresas a mais); cada uma muda uma coisa de verdade (a vaga; a eleição e o lobby; o crédito e a compra), e cada uma tem três conquistas (40, 70 e 90) que entram na linha do tempo em dourado, no epitáfio e no cartão da vida | dono (bloco ★, I-138: "o centro é o sistema de influências do player; ele deve sentir que a influência importa, e conquistas baseadas nela") | um número de influência que só pesava na eleição não se sentia; três esferas com uso e conquista viram objetivo de vida |
| A concorrente da empresa que quem joga cuida de perto tem nome e dono (o papel `rival`): o traço dele dá a garra na briga, a guerra de preços o magoa, e comprar a concorrente é pedir a ele (o pedido `aceitar`, com o porquê); quando ela quebra, ele pode pedir emprego | dono (bloco H6, I-139: "melhorar mais o sistema de capitalismo") | a concorrência era um número sem dono; com rosto, a briga vira história e a compra vira decisão de outra pessoa |
| Na concorrente nova, um ex ou um amigo da vida adulta, magoado ou distante, pode ser o dono (a mesma pessoa, com a memória dela); quem vem com a empresa leva só o traço, o vínculo, a mágoa e a confiança, e não tem o ano da família | agente (bloco H6) | o rival que você conhece é a história mais forte da concorrência; a saúde e os anos sem contato não decidem nada nela |
| Com a empresa de R$ 10 milhões chega o gestor (o papel `gestor`), que propõe a jogada do ano pelo jeito do traço (a heurística dos robôs, `diretoria.ts`), em palavras e com o número que a justifica; seguir faz a jogada pela folha, e no ano seguinte o livro diz quem tinha razão (o aviso aponta a recusa); sem confiança ou magoado demais, ele vai para a concorrência | agente (bloco H6, I-12) | a gestão vira uma escolha de um toque, com o porquê; o jeito do gestor erra no ciclo errado, e seguir não é a resposta certa (o túnel confere) |
| A proposta do gestor passa na frente do ritmo do ano (tensão 2), no máximo a cada três anos; as outras histórias da rival disputam o lugar do evento do ano | agente (bloco H6) | no ritmo, a proposta virava cartão em 2 de 842 anos com gestor; com o intervalo, os toques ficam abaixo de 480 |
| O acordo de preços com a rival (o cartel) é uma marca da empresa: enquanto dura, não há guerra de preços nem corrida atrás de quem atrai mais; acaba quando o dono sai, e o vazamento chama o Cade | agente (bloco H6) | o cartel tem preço e risco, e o motor o lê; os segredos são de pessoa para pessoa, e o Cade não é uma pessoa |
| Os robôs com gestor deixam a empresa de perto com ele (a jogada chega como proposta); quem recusa faz do próprio jeito no mesmo ano | agente (bloco H6) | o túnel compara o jeito do gestor com o de quem joga, e não com ficar parado |
| Na bolsa, a empresa emite ações (15% em ações novas: o dinheiro vai para o caixa e a parte de quem joga encolhe), quem joga recompra a maioria (51%, com 10% de prêmio a quem vende), e a concorrente pode ser tomada numa oferta hostil, sem pedir ao dono: 35% de prêmio sobre o preço do dia, a chance pelos acionistas, pela influência de negócios e pela garra do dono; a que falha custa 5% em bancos e advogados, fortalece a rival (+10) e a magoa (+30); uma a cada três anos | dono (bloco H7, I-140: "próxima atualização de capitalismo") | a bolsa é onde o capitalismo vira jogo: o dinheiro sem dívida custa controle, e comprar sem pedir custa prêmio e risco |
| Sem a maioria na bolsa, a dona da concorrente (seis em dez) ou um fundo de fora pode comprar o controle: 12% de chance por ano (22% com a concorrente forte), pela agenda, com a entrada que tirou a maioria de causa; quem joga recompra, vende com 30% de prêmio ou briga no conselho | agente (bloco H7) | vender ações demais tem consequência, e o porquê aponta a emissão ou a venda que tirou a maioria |
| Na bolsa, a arriscada emite ações antes de pegar crédito e vai pela oferta hostil quando os acionistas tendem a vender (55% de chance, ou 40% se o dono já disse não); a cautelosa recompra a maioria | agente (bloco H7) | sem isso, a bolsa não acontecia no túnel: quem chega lá tem gestor, e as histórias da oferta contra quem joga morriam |
| A vida pergunta o que quem joga quer dela: aos 15, o sonho (virar estrela, construir um império, governar o país, ou ainda não sei) e, com o namoro, o do amor (a casa cheia ou um amor para a vida toda); o sonho é um plano com etapas do estado e prazo longo, e o cartão da vida diz como cada um terminou | dono (bloco S1, I-141: "o player busca o Trajetória para viver nele o que de fato quer viver") | a vida respondia ao mundo e nunca perguntava o que quem joga queria; o sonho dá direção, cenas e um fim que se conta |
| O sonho é conteúdo (`mundo.json › projetos` com `sonho: true`): começa pela escolha de um marco (o efeito `sonhar`, com a escolha de causa) ou pela folha Planos, como qualquer plano, com um ✦ no nome; cada sonho tem cenas que só aparecem para quem sonha | agente (bloco S1) | o marco faz do sonho um momento da vida, na hora certa; a folha deixa quem disse "ainda não sei" sonhar depois; as cenas dão ao caminho histórias próprias |
| O sonho realizado é um marco dourado na linha do tempo; a conquista de um plano comum (a casa, o diploma) não | agente (bloco S1) | realizar o que se quis da vida é o ponto mais alto de uma vida; ouro em todo plano deixaria de apontar alguma coisa |
| Quem sonha em virar estrela sobe com o dobro da chance numa carreira de holofote (a garra do sonho), e a primeira cena é a porta (o bar, a câmera, a várzea, o teatro) que abre a carreira | agente (bloco S1) | sem a garra, a pirâmide da fama levava mais de 50 anos ao segundo degrau e nenhuma estrela se realizava em 400 vidas; o sonho que nada muda não é decisão |
| Os robôs que sonham vão atrás do sonho: a vaga de holofote, a eleição com chance menor, a empresa aberta | agente (bloco S1) | o túnel mede quanto a vida realiza o sonho de quem joga por ele, não de quem nunca tenta |
| Os sonhos têm vaga própria (até 2 de pé: a ambição e o amor), à parte dos 3 planos | agente (bloco S1) | com a vaga dividida, quem sonhava quase não punha mais na cabeça a casa própria ou o diploma, e o plano sumiu dos pontos de virada |
| A escolha que começa um sonho não toma a vaga de um ponto de virada; o ponto de virada do sonho é o que se fez por ele | agente (bloco S1) | o cartão já conta o sonho na linha própria, com o fim; no ponto de virada, "aos 15, você sonhou com…" repetia vida após vida |
| O sonho realizado traz, no mesmo ano, o dia do sonho (a cena do topo, uma por sonho); o fim de qualquer sonho traz, no ano seguinte, o "e agora?" (depois do realizado) ou "o sonho que ficou" (depois do que não veio); os três pela agenda, com o fim de causa | dono (bloco S2, I-142: "cubra o tédio do player pela vida") | o sonho acabava aos 50 numa linha, e a segunda metade da vida ficava sem direção |
| Os sonhos da segunda metade (a fortuna em R$ 50 milhões, o lugar no mundo, a volta ao mundo, ver os netos crescerem) começam pelo "e agora?", pelo "sonho que ficou", pelo marco dos 50 (para quem chega lá sem sonho) ou pela folha Planos | agente (bloco S2) | as metas saíram da medida: com R$ 10 milhões, a fortuna seria fácil demais (25% de quem não nasceu rico chega lá) |
| Começar um sonho conta como consequência própria na régua dos dilemas | agente (bloco S2) | sem isso, "aproveitar o que construiu" (felicidade +5) parecia melhor em tudo que começar um sonho novo |
| O robô que sonha com o palco tenta a vaga a cada dois anos | agente (bloco S2) | cada tentativa custa três toques, e o teto de 480 precisava de folga para o segundo ato |
| O sonho passa adiante: o que não veio, contado a quem vem depois, vai para o filho mais velho vivo (o campo `sonho`); sem ele, o sonho que quem morreu ainda tinha de pé; quem continua a história começa a vida com ele de pé, com a abertura de causa, e pode guardar a pasta numa gaveta; o cartão diz de quem era | agente (bloco S3, I-143: o dono pediu a próxima volta do loop) | o sonho que não vinha morria com a vida, e a dinastia continuava sem nada do que quem morreu queria |
| Passar o sonho conta como consequência própria na régua dos dilemas | agente (bloco S3) | sem isso, "fazer as pazes com o que foi" (felicidade +5) parecia melhor em tudo que passar o sonho adiante |
| O caminho do sonho é perceptível: cada etapa nova vira uma linha ✦ na linha do tempo (uma vez por contagem, com o começo do sonho de causa); quem herda um sonho acha a pasta do sonho no primeiro ano; a folha Planos e o fim do sonho dizem de quem ele era | dono (07/11: "tem que ser divertida e legal e perceptível!") | o progresso do sonho só aparecia na folha Planos, e o sonho herdado chegava como uma linha da abertura |
