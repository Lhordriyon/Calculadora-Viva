# Auditoria Ω (26/10/2026)

O dono pediu (26/10) um salto de qualidade, não mais um bloco: "o jogo está muito repetitivo, não tem nada criativo, único, original", e entregou um backlog mestre e uma missão ("Trajetória Ω"). Este documento é o diagnóstico que a missão pede antes de mexer em qualquer coisa: o que existe, o que falta, o que foi medido e a decisão de arquitetura. A auditoria anterior, de 12/10, está em `docs/auditoria-universo.md`.

## 1. Arquitetura atual

- **Pilha:** Vite, TypeScript estrito, Preact, Vitest, Zod (só em Node), vite-plugin-pwa e Capacitor (o APK). Sem backend: o save fica no localStorage, com versão, migração, cópia de segurança, exportar e importar.
- **Motor puro e determinístico** (`src/motor`, cerca de 14 mil linhas): mesma semente e mesmas decisões dão a mesma vida, e há teste disso. O ano é uma lista de 23 etapas que declaram o que leem e escrevem (`manifesto.ts › ETAPAS_DO_ANO`), e um teste confere a declaração jogando vidas.
- **Um formato de estado:** entidades com id, tipo, números, textos e qualidades. Condições e efeitos leem caminhos (`mae.saude`, `pais.juros`).
- **Um formato de conteúdo:** 835 storylets em JSON (589 eventos, 115 iniciativas de personagem, 109 ações, 22 jogadas), com 1.654 escolhas, 239 linhas curtas e 32 causas de morte, validados por esquema e por um validador (leitores, sistemas, personagens, falsos dilemas).
- **Uma causa por mutação:** toda mudança vai para o livro-razão com quem a causou. Do livro saem o porquê na linha do tempo, a opinião das pessoas, os pontos de virada e o extrato. Todo real tem contraparte, e as dívidas batem com os contratos.
- **O túnel de vento** joga cerca de 16 mil vidas por push (as 10.000 sorteadas, as de origem escolhida, as fortunas e as dinastias) com quatro robôs e escreve `docs/metricas.md`. A régua da tela (`npm run telas`) mede 52 critérios de interface.

## 2. Funcionalidades

| Área | Estado | Observação |
|---|---|---|
| Nascer, origem, linhagens, primeira infância | completo e testado | origem procedural; 9 linhagens |
| Escola, ENEM, carreira (49 profissões), concurso | completo, raso na escola | sem habilidades: a carreira lê inteligência e aparência |
| Economia pessoal, contratos, nome sujo, Tesouro, carteira | completo e testado | contas fecham entrada por entrada |
| Empresa e grupo (até 5), bolsa, fusões | parcial | sem caixa próprio, sem produto, sem P&D (bloco H) |
| Bens, imóveis, financiamento, leilão | completo | os bens não produzem renda (bloco I) |
| País, governos, eleições, políticas, diplomacia, ciência, defesa, guerra | completo e testado | governos e países fictícios por requisito |
| Coroa, Regime, ilha, sucessão, golpe | completo (bloco F) | governar a ilha e a cidade: bloco F2 |
| Relações (afeto, confiança, mágoa, contato, lembranças, opinião, vontades) | completo para quem existe | **as pessoas são papéis fixos** (abaixo) |
| Pessoas | **parcial** | mãe, pai, avó, um amigo, o par, a paixão, até quatro filhos e o bicho. Irmãos são um número; o ex some; não há colegas, chefe, vizinhos nem amigos novos |
| Agência do jogador | **parcial** | seis verbos com ações fixas e folhas de gestão; não há objetivos, planos nem pedidos a pessoas |
| Narrativa | parcial | o diretor escolhe storylets por saliência; não há arcos que atravessam anos, nem capítulos, nem reconhecimento de histórias no livro |
| Segredos e o que cada um sabe | ausente | a opinião usa o que a pessoa viveu e o que "todo mundo sabe"; não há segredo nem boato |
| Contrafactual ("e se?") | ausente | o motor determinístico permite, mas o save não guarda os comandos |
| Cartão da vida | completo | três pontos de virada pelo impacto no livro, epitáfio, dinastia |
| PWA e offline | completo | medido: abre sem rede depois da primeira visita |

## 3. Medidas (linha de base)

Medidas nesta máquina (não num celular de verdade: o navegador é o Chromium do Playwright com a tela de 360 × 780 e toque).

| Medida | Valor |
|---|---|
| Carregamento até o botão "Nascer" (servidor local, três vezes) | 234, 162 e 165 ms; 396 KB transferidos |
| "+1 ano" no navegador, do toque à tela nova (40 anos) | mediana 45 ms, p90 58 ms, máximo 62 ms |
| Uma vida inteira no motor, com os robôs decidindo (Node, 200 vidas) | 114 ms; 1,6 ms por ano |
| Memória do motor antes e depois de 200 vidas | 20,1 → 23,6 MB (sem vazamento) |
| Tamanho do save de uma vida | mediana 329 KB, p90 438 KB, máximo 525 KB |
| Offline | abre sem rede e mantém a vida salva |
| Testes | 396 testes em 37 arquivos, todos passam; sem medição de cobertura (a ferramenta não está instalada) |
| Saturação (instâncias de storylet já vistas) na 5ª e na 20ª vida | 55,1% e 90,1% |
| Assinaturas de vida distintas por 1.000 vidas | 915 |
| Storylets mortos, falsos dilemas, estratégia dominante | 0, 0, nenhuma |
| Defeitos abertos da auditoria anterior | D-02, D-05 a D-09, D-11 (D-10 é decisão do dono) |

## 4. Diagnóstico

1. **O maior limite hoje:** as pessoas. O mundo social tem cerca de oito pessoas, e elas são papéis, não indivíduos: quando o namoro acaba, a pessoa some; o irmão é um número; não existe colega, chefe, vizinho, amigo novo. Todo sistema que poderia virar história com gente (carreira, empresa, política, dívida, família) fica sem gente.
2. **O maior desperdício:** o livro-razão guarda o porquê de tudo, mas a história só aparece como uma lista de anos. Nada reconhece, no livro, a amizade que virou sociedade ou a dívida que virou briga.
3. **O sistema que mais vale para os outros:** a pessoa com estado e memória. Uma pessoa a mais vale para a família, a carreira, a empresa, a política, a dívida, a herança e a narrativa.
4. **O que tira agência:** o jogo pergunta "o que acontece agora?". O jogador responde a eventos e escolhe ações fixas; não pode querer algo (sair das dívidas, reparar uma relação, ter um filho) e perseguir isso por anos.
5. **O que faz as vidas parecerem iguais:** o conteúdo é escrito um por um e volta (90% já visto na 20ª vida). As pessoas não têm objetivos próprios que gerem histórias, e a vida não tem arcos.
6. **Realismo que não cansa:** pessoas com a vida delas acontecendo ao fundo (casar, perder o emprego, mudar, adoecer), contadas em uma linha quando importam.
7. **Abstração inteligente:** quem está longe vive numa regra barata (a cada poucos anos), e quem está perto, na regra completa.
8. **Difícil de testar hoje:** "a decisão aos 15 muda os 40". O livro tem o encadeamento, mas não há teste nem medida de arco.
9. **O que ficaria simples depois de outra camada:** segredos, pedidos, sociedade, rivalidade e projetos com gente dependem de pessoas que persistem.
10. **O maior ganho com o menor risco:** a rede de pessoas no mesmo formato que os filhos já usam (um papel com vários indivíduos, como `filho` a `filho4`), sem trocar o formato do estado.

## 5. Estratégias consideradas

| Estratégia | Ganho | Custo e risco | Decisão |
|---|---|---|---|
| **A. Mais conteúdo** (milhares de storylets) | variedade linear | alto custo de escrita; a repetição só demora mais | não: o problema é estrutural |
| **B. Identidade total** (toda pessoa com id próprio, papéis como ponteiros, o livro por id) | o modelo mais limpo | reescreve a leitura de caminhos, o livro antigo e a migração de todo save; risco alto | não agora |
| **C. Rede no formato dos filhos** (papéis com vários indivíduos: irmãos, ex, amigos, colegas, chefe), vida própria em duas escalas, verbos sociais que qualquer pessoa decide, projetos e segredos por cima | multiplica todos os sistemas; compatível com o conteúdo e os saves | médio; cada papel novo precisa do validador, da família, da herança e da interface | **sim** |

## 6. A decisão: o salto Ω

O jogo passa de "o que acontece agora?" para "o que eu posso fazer?". Sete camadas, cada uma em cima das anteriores, cada uma verificada antes da próxima:

1. **A rede (Ω1).** Irmãos, ex, amigos, colegas e chefe viram pessoas, com nome, traço, idade, trabalho, cidade, dinheiro e saúde. Quem está perto vive a regra completa; quem está longe, uma regra barata. A vida delas acontece ao fundo e chega como notícia quando importa. O ex continua existindo.
2. **Os verbos sociais (Ω2).** Pedir, oferecer, propor, cobrar, contar e apresentar, para qualquer pessoa: ela decide pelo estado e pela memória e diz por quê. O empréstimo entre pessoas é um contrato, e o favor fica lembrado. As pessoas também pedem a você.
3. **Os projetos (Ω3).** O jogador declara o que quer (sair das dívidas, reparar uma relação, ter um filho, mudar de cidade, abrir uma empresa, virar referência), e o projeto mostra as etapas possíveis, que são ações de verdade. O progresso sai do estado, não de uma barra; o projeto dá histórias e termina em conquista, desistência ou fracasso, no livro.
4. **Os segredos (Ω4).** Quem joga pode guardar segredos; cada pessoa sabe o que viu, ouviu ou descobriu; a informação corre pela rede; a revelação e a chantagem são consequências.
5. **A história reconhecida e o caminho não tomado (Ω5).** Uma peneira lê o livro e reconhece os arcos da vida (a amizade que virou sociedade, a volta por cima, a dívida que virou briga) e os mostra como capítulos. No fim, o jogador pode ver a vida que não viveu: a mesma semente, as mesmas decisões até um ponto de virada, a outra escolha ali.
6. **O ritmo e a medida (Ω6).** O diretor ganha anos tranquilos e apoio às histórias começadas; o túnel mede a diversidade pela estrutura causal, não pelos números.
7. **Publicar só o salto inteiro (Ω7).** Cada camada vai para o branch de trabalho com o `verificar` passando; a `main` recebe o conjunto, como o dono pediu.

**O que não muda:** os três invariantes, a pilha, o save que nunca trava, o motor determinístico, o conteúdo em JSON validado, a política fictícia.

**Riscos e controles:** o save cresce (hoje 525 KB no máximo): a rede guarda pouco por pessoa e a vida de quem está longe não vai para o livro em detalhe; a CPU (hoje 1,6 ms por ano): a regra barata roda a cada poucos anos; a repetição: o túnel mede a saturação e a diversidade a cada camada.
