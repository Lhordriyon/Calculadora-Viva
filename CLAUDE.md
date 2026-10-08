# Trajetória — como trabalhar neste projeto

Simulador de vida em texto, ano a ano, jogado no celular pelo navegador (PWA). O jogador consome uma coisa só: **uma história sobre uma vida que ele mesmo causou, em poucos minutos**. A matéria-prima é texto, números e escolhas; todo o resto é embalagem e só entra se provar que aumenta essa experiência.

A visão em uma troca: o jogador pensa "eu posso tentar qualquer coisa", e o jogo responde "pode, mas o mundo vai reagir". Poucos sistemas fundamentais, milhares de combinações, interface simples (nunca 500 botões), uma vida em minutos.

## Fluxo de cada sessão

1. Leia este arquivo, `docs/roteiro.md`, `docs/metricas.md` e `docs/decisoes.md`.
2. Escolha o incremento de maior impacto pelo método abaixo.
3. Commits pequenos e descritivos. Antes de cada push: `npm run verificar` (tipos, testes, validador, túnel e build).
4. Push na `main` (o CI publica no GitHub Pages). Sem permissão, abra um PR e diga isso.
5. Termine com: o que mudou, métricas antes e depois, o que foi decidido sozinho e por quê, link do jogo e o que jogar para testar.

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
3. **Uma causa por mutação.** Toda mudança de estado vai para o livro-razão com quem a causou: escolha, ação, diretor, personagem ou regra. Pontos de virada e a crônica saem dele (há teste: nascimento + soma das variações = estado final).

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
- **Toda variável de estado é lida por ≥ 2 sistemas e altera ≥ 1 decisão; toda ação mexe em ≥ 2 sistemas.** O validador bloqueia o contrário (`src/motor/manifesto.ts` declara o que as regras do motor leem e escrevem).
- O caminho padrão começa em um toque; escolher a origem é opcional.
- Expansão liberada por incremento quando o túnel cumpre os portões e o dono joga 3 vidas da nova build e reporta algo inédito na 3ª. (Em 06/10/2026 o dono autorizou seguir para o próximo nível enquanto os portões passarem, sem esperar ordem; ver `docs/roteiro.md`.)

## Critério de aceitação: o túnel

`npm run tunel` joga 10.000 vidas (4 estratégias × 125 jogadores × 20 vidas seguidas, com a memória entre vidas) e escreve `docs/metricas.md`. Falha (e trava o CI) se:

- algum storylet nunca aparece (morto) ou um não-repetível se repete na mesma vida;
- uma estratégia fixa vence as outras em idade, patrimônio e felicidade ao mesmo tempo.

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
  mundo.json           nomes, cidades, classes, tipos de família, traços, setores, fases, acontecimentos
src/motor/             motor puro, sem UI: roda em Node e no navegador
  vida.ts              nascer → (fichas do ano) → +1 ano → regras → personagens → diretor → escolha
  tipos.ts             estado: entidades, livro-razão (entradas e mudanças), agenda
  campos.ts            campos de cada entidade e leitura de caminhos ("mae.saude")
  livro.ts             as únicas funções que mudam o estado (cada uma anota a mudança)
  origem.ts            origem procedural: classe × tipo de família × traços, linhagem, cidade e família
  familia.ts           regras anuais dos personagens, regra do amor, iniciativas
  ciclo.ts             ciclo da economia do país (normal, expansão, recessão, crise)
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
  empresa.ts           a empresa de quem joga: abrir, crescer, retirar, aportar, vender, comprar concorrente, quebrar
  bens.ts              imóveis, veículos, luxo e mídia: comprar, financiar, morar, alugar, vender; o ano dos bens
  carreira.ts          profissões (mundo.json › carreiras): vaga, cargo, promoção em pirâmide, fama
  poder.ts             influência, eleições, mandato, popularidade, queda do cargo
  herdeiro.ts          dinastia e testamento: partilha, quem herda (filho, sobrinho, par, amigo) e a vida nova
  morte.ts             morte de quem joga
  virada.ts            pontos de virada e resumo da vida a partir do livro-razão
  memoria.ts           memória do jogador entre vidas (reduz repetição)
  robos.ts             estratégias do túnel e análise de dilemas
  esquema.ts           esquemas Zod do conteúdo (só Node: validador, túnel, testes)
  leitura.ts           valida as fontes com o esquema e indexa
  conteudo.ts          indexa o conteúdo já lido, sem Zod (o navegador usa direto)
  validacao.ts         checagens além do esquema (leitores, sistemas, personagens, cadeias)
  manifesto.ts         o que as regras do motor leem e escrevem (para o validador)
  regras.ts            números de equilíbrio (ritmo, mortalidade, juros, família, amor…)
  constantes.ts        atributos, papéis, verbos, classes, tipos de família
src/jogo/salvar.ts     save versionado no localStorage (zod/mini)
src/conteudo.ts        conteúdo embutido no bundle (já validado no CI)
src/ui/                Preact: App, Abertura, Cabecalho, LinhaDoTempo, Palco, Familia, Dinheiro, Carreira, CartaoVida
scripts/               validar, tunel (+ medidas), uma-vida, icones (Node com TypeScript nativo)
android/               app Android (Capacitor): o jogo vai dentro do APK, offline; capacitor.config.json na raiz
test/                  Vitest
```

Detalhes do motor em `docs/motor.md`; formato e guia de escrita em `docs/conteudo.md`; estado dos níveis em `docs/roteiro.md`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | jogo local com recarga |
| `npm run verificar` | tudo que o CI roda: tipos, testes, validador, túnel, build |
| `npm run validar` | só o conteúdo (esquema, ids, caminhos, leitores, personagens, cadeias) |
| `npm run tunel` | 10.000 vidas simuladas → `docs/metricas.md`; falha se uma meta quebrar |
| `npm run vida -- 42 cautelosa` | imprime uma vida inteira (semente e estratégia) |
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
| Túnel com metas e portões (saturação, assinaturas, mobilidade, dispersão, agência, toques) | dono | qualidade se mede |
| Caminho padrão em um toque; origem opcional | dono | começar rápido, e quem quiser escolhe |
| "Nova vida" (no menu, no palco, no cartão) abre a escolha da origem | dono | escolher como será a próxima vida, no começo, durante e depois |
| Testamento escolhido em vida (filho, par, amigo, sobrinhos, causa, bicho) | dono | decidir quem herda e com quem a história continua |
| Origens de realeza e de regime num Brasil fictício; profissões, imóveis, bens, eleições, truste | dono | liberdade de verdade e dinheiro que vira poder |
| Expansão por incremento: portões + 3 vidas do dono | dono | provar cada nível antes do próximo |
| Toda escolha e toda ação têm `resumo` | agente | o cartão da vida conta "aos 17, você…" |
| Dinheiro mostrado em reais de hoje | agente | valores nominais de 2080 confundem; a inflação aparece como dinheiro parado que encolhe |
| `marco: true` para ENEM, primeiro emprego, aposentadoria… | agente | a espinha da vida não pode depender de sorteio |
| Personagem novo (`{amor}`, `{filho}`…) só em texto que exige a qualidade que o garante | agente | sem "alguém" no lugar de um nome |
| Pelo menos uma escolha sem condição por storylet | agente | a vida nunca trava |
| Opções somem? Não: aparecem desabilitadas com o motivo | agente | a pobreza também é história |
| Toques ignorados por 450 ms quando um evento aparece | agente | toque duplo no +1 ano não pode escolher por você |
| Tela em três faixas (cabeçalho, linha do tempo, palco) que rolam por dentro; nada `sticky` | agente | com a letra do sistema grande, cabeçalho e palco grudados se cruzavam no APK |
| O verbo mostra a ação sugerida; tocar abre todas as ações possíveis dele | agente | liberdade de verdade, sem 500 botões na tela |
| Fichas por ano: 1 criança, 2 adolescente, 3 adulto, 2 depois dos 65; a mesma ação não repete no ano | agente | a agência tem custo de oportunidade; o dono pediu anos mais vividos |
| Dinheiro, empresa, bens, vaga, eleição e testamento não gastam ficha | agente | é gestão, não o que se vive no ano; a decisão aparece no livro como do jogador |
