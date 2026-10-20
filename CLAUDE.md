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
  contratos.ts         a dívida como contrato com o banco (cheque especial, empréstimo, financiamento, acordo): juros, saque, pagamento, limite
  dividas.ts           o ano das dívidas: parcela, atraso, nome sujo, caducar; renegociar e quitar
  origem.ts            origem procedural: classe × tipo de família × traços, linhagem, cidade e família
  familia.ts           regras anuais dos personagens, regra do amor, iniciativas
  pais.ts              o país vivo: estatísticas, governos, eleição, políticas, a fase do ciclo e o país na vida
  diplomacia.ts        o mundo lá fora: países fictícios, relação, sanções, acordos, o dólar e o ato de quem governa
  trabalho.ts          salário e demissão pelo setor e pela fase; a conta do padrão de vida
  pessoas.ts           criar, promover e matar personagens (luto, herança, viuvez)
  storylets.ts         elegibilidade, aplicar e apresentar storylets, escolher
  diretor.ts           saliência e o storylet do ano
  acoes.ts             a ficha do ano: verbos e a ação de cada um
  efeitos.ts           efeitos de storylets (caminhos, transferências, personagens)
  condicoes.ts         condições compiladas e causas (qualidades consultadas)
  contexto.ts          variáveis de texto lidas do estado ({mae.ocupacao}, {ator.quem}, trechos)
  economia.ts          dinheiro em reais de hoje, inflação, juros, crédito, padrão de vida, gasto da velhice
  carteira.ts          investimentos por classe, mercado do ano, perfil, operações da folha Dinheiro
  empresa.ts           o grupo de quem joga (até 5 empresas): abrir, crescer, retirar, aportar, vender, comprar concorrente (subsidiária), fundir, bolsa, a mesa de quem manda, quebrar
  bens.ts              imóveis, veículos, luxo e mídia: comprar, financiar, morar, alugar, vender; o ano dos bens
  carreira.ts          profissões (mundo.json › carreiras): vaga, cargo, promoção em pirâmide, fama
  poder.ts             influência, eleições, mandato, popularidade, queda do cargo
  herdeiro.ts          dinastia e testamento: partilha, quem herda (filho, sobrinho, par, amigo) e a vida nova
  fortuna.ts           brincar de deus e quem manda na empresa: as jogadas (storylets "jogada") e a operação da folha
  morte.ts             morte de quem joga
  virada.ts            pontos de virada e resumo da vida a partir do livro-razão
  memoria.ts           memória do jogador entre vidas (reduz repetição)
  robos.ts             estratégias do túnel e análise de dilemas
  esquema.ts           esquemas Zod do conteúdo (só Node: validador, túnel, testes)
  leitura.ts           valida as fontes com o esquema e indexa
  conteudo.ts          indexa o conteúdo já lido, sem Zod (o navegador usa direto)
  validacao.ts         checagens além do esquema (leitores, sistemas, personagens, cadeias)
  manifesto.ts         o que as regras do motor leem e escrevem (para o validador) e as etapas do ano, cada uma com o que lê e escreve
  regras.ts            números de equilíbrio (ritmo, mortalidade, juros, família, amor…)
  constantes.ts        atributos, papéis, verbos, classes, tipos de família
src/jogo/salvar.ts     save versionado no localStorage (zod/mini), com cópia de segurança; exportar e importar pelo menu
src/conteudo.ts        conteúdo embutido no bundle (já validado no CI)
src/ui/                Preact: App, Abertura, Cabecalho, LinhaDoTempo, Palco, Familia, Dinheiro, Carreira, Pais, CartaoVida; Folha (a folha que sobe, com o Fechar fora da rolagem), voltar.ts (o voltar fecha a folha), Icones (SVG), estilo.css (tema noite e ouro)
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
