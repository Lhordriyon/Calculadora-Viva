# Arquitetura do universo de bolso

Proposta da Fase 0 da missão "Universo de bolso" (12/10/2026), sobre o código de `main` em `07cb03c`.
- O que existe hoje, com evidência, está em `docs/auditoria-universo.md`.
- As ideias, com dependências e fase, estão em `docs/ideias.md`.
- Nada aqui está implementado, salvo onde se diz "hoje".

## O que a arquitetura garante

A missão pede um mundo que existe além do jogador. O produto continua sendo uma vida em poucos minutos no celular. As duas coisas cabem juntas com quatro garantias:

1. **As contas fecham.** Todo real sai de alguém e entra em alguém; toda dívida tem credor. Valor que muda sem dinheiro trocar de mão (inflação, cotação, valorização) é reavaliação declarada, não dinheiro novo.
2. **A complexidade é delegada, não exibida.** Quem joga decide o essencial. Gestores com mandato cuidam do resto e prestam contas. Painel novo só entra para sistema que decide alguma coisa.
3. **O detalhe acompanha a atenção.** No detalhe, com livro-razão, fica o que está perto de quem joga:
   - a família;
   - o país onde mora;
   - as empresas dele;
   - os países com quem ele lida.
   O resto do mundo anda num modelo reduzido e barato. Para ele, o livro guarda só os fatos: crise, guerra, troca de governo.
4. **Tudo continua puro, determinístico e medido.** Mesma semente e mesmas decisões dão a mesma história. O túnel mede cada fase antes de ela ir ao ar.

## O que se preserva

- **O livro-razão causal:** só `livro.ts` muda o estado, e cada mudança tem a entrada que a causou.
- **Os formatos:** um de estado (entidades com `n`, `t` e `q`; caminhos `ent.campo`) e um de conteúdo (o storylet), com o validador e o manifesto.
- **A base do motor:**
  - o `rng` dentro do estado;
  - o motor sem interface;
  - o save versionado.
- **A forma do jogo:**
  - o túnel com metas que travam o CI;
  - as três faixas da tela;
  - mobile-first.
- **Os sistemas que já funcionam:** família, carreira, carteira, empresa, bens, país vivo, diplomacia, dinastia e jogadas. Eles evoluem, não são reescritos. Cada fatia nova começa trocando o mínimo e prova, no túnel, que o resto não mudou.

## Conflitos com requisitos de hoje

| Requisito de hoje | O que a missão pede | Proposta |
|---|---|---|
| Política e países fictícios e genéricos (dono; motivo: identidade e risco legal) | Países reais com dados documentados | Países reais como geografia e estatística de partida, com fonte, data, unidade e licença. Governos, partidos e políticos continuam fictícios e genéricos. O que acontece depois é simulação, e a abertura diz isso. **Decisão do dono antes da Fase 3.** |
| Uma vida em poucos minutos; nunca 500 botões; tela de gestão não entra | Painéis para doze sistemas | A delegação é a interface. Cada painel é um relatório, um histórico e a decisão pendente. Painel sem sistema por trás não entra. |
| CPU ≤ 30 ms por vida (hoje 88 ms; o portão já reprova e não trava o CI) | Economia mundial em várias escalas | Nível de detalhe (garantia 3) e orçamento de CPU por módulo no túnel. Um ano do país custa 0,23 ms. 190 países nesse detalhe seriam 3,5 s por vida. |
| Save no localStorage (hoje 275 KB por vida na mediana e 447 KB no máximo, sem compactação) | Universo persistente e dinastias longas | Dados de referência fora do save (vêm do bundle ou de arquivos estáticos). Estado do mundo compacto. O livro dos anos antigos vira resumo. Exportar e importar o save. |
| A coroa paga R$ 4 milhões por ano a quem a herda (`sucessao_coroa`) | O monarca é posição institucional, não fonte de renda | Separar o cargo e os poderes (governo) do dinheiro. A dotação da Casa Real sai do tesouro e tem regras; a renda privada vem de bens. Fase 5. |
| APK assinado com chave versionada (de propósito, para o APK novo atualizar o antigo) | Persistência e confiança | Risco de segurança: qualquer um pode assinar um APK que se instala por cima do jogo. Trocar a chave obriga quem tem o APK a reinstalar. **Decisão do dono.** |

## Os 13 módulos

Para cada módulo: o que existe hoje, o contrato (como os outros falam com ele) e o que falta.

### 1. Núcleo temporal e de simulação
- **Hoje:**
  - `vida.ts › avancarAno`, cuja ordem é a do código: exterior, país, mercado, economia, empresa, bens, privação, personagens, trabalho, carreira, poder, padrão, morte e diretor;
  - `acoes.ts` (as fichas), `diretor.ts`, `storylets.ts` e a agenda.
- **Contrato:**
  - o ano é uma lista declarada de etapas, e cada uma diz o que lê e o que escreve (o manifesto já faz isso para os campos);
  - `avancarAno` é a única porta do tempo;
  - um agendado que deixa de valer sai com motivo, no livro.
- **Falta:**
  - a ordem testada (hoje há leituras escondidas no mesmo ano: os bens leem o mercado gravado no estado, o poder lê a fama que a carreira acabou de mudar);
  - a invalidação explícita da agenda (hoje o descarte é silencioso).

### 2. Entidades e relações
- **Hoje:** `tipos.ts`, `campos.ts` e `pessoas.ts`. O papel é a identidade: `amor` e `filho` são ids, e o segundo apaga o primeiro.
- **Contrato:**
  - entidade com id estável;
  - relações como arestas tipadas: parentesco, emprego, propriedade, participação, residência, cidadania, filiação e mandato;
  - o papel do conteúdo (`amor`, `filho`) aponta para uma pessoa, e os caminhos de hoje continuam valendo.
- **Falta:** identidade estável, arestas, vários filhos e relações entre personagens.

### 3. Livro-razão financeiro e contabilidade
- **Hoje:** o livro anota a mudança líquida de cada campo, com a causa. O dinheiro muda de um lado só: 86,6% das entradas que mexem em dinheiro o criam ou o destroem. A dívida é um número.
- **Contrato:**
  - **`transferir(de, para, valor, motivo)`** é o único jeito de mover dinheiro entre entidades, e grava os dois lados na mesma entrada;
  - **`reavaliar(ent, campo, valor, motivo)`** muda valor sem mover dinheiro, marcado como reavaliação;
  - **criar e destruir dinheiro** só por quem pode (o banco ao emprestar, o banco central), registrado;
  - **contratos** (empréstimo, financiamento, serviço, mandato) são objetos com partes, termos, saldo, eventos e a entrada que os criou;
  - **invariante:** em cada entrada, a soma das variações financeiras de todas as entidades é igual à soma das reavaliações e emissões declaradas.
- **Falta:** tudo isso. É a base das Fases 2, 4, 5 e 6.

### 4. Economia e mercados
- **Hoje:**
  - `economia.ts` (o ano de quem joga);
  - `carteira.ts` (cinco classes e o mercado do ano);
  - `trabalho.ts`;
  - `pais.ts` (crescimento, inflação, juros e câmbio como estatísticas que se causam).
- **Contrato:** as contrapartidas existem como contas:
  - `mercado`: o setor privado (quem paga salário, vende, aluga e compra);
  - `tesouro`: o governo;
  - `banco`: o sistema bancário;
  - `parentes`: a família fora de cena.
  Mais tarde, cada uma vira entidade com balanço e decisões (Fase 4).
- **Falta:**
  - as contrapartidas;
  - preço e salário como resultado (hoje são regras);
  - balanço de pagamentos.

### 5. Patrimônio, empresas e serviços profissionais
- **Hoje:**
  - `empresa.ts`: até 5 empresas, subsidiárias como número, fusão, bolsa e quebra;
  - `bens.ts`, `herdeiro.ts` (a partilha) e `fortuna.ts` (as jogadas).
- **Contrato:**
  - cada entidade econômica tem contas próprias: pessoa, empresa, holding, fundo, fundação, family office;
  - a propriedade é uma aresta de participação;
  - o dinheiro só passa entre elas por transferência;
  - serviço contratado é um contrato.
- **Falta:**
  - o caixa da empresa (hoje a empresa é um valor, e a retirada sai do valor);
  - holding, fundo, fundação e family office;
  - contratos de serviço.

### 6. Governo e instituições políticas
- **Hoje:**
  - `pais.ts`: governos fictícios, eleição, seis políticas e uma reforma por ano;
  - `poder.ts`: influência, popularidade, cargos e mandato.
  - A monarquia não é lida pelo motor, e o regime aceita candidatura a presidente.
- **Contrato:**
  - o Estado é uma entidade com tesouro (receitas, despesas e dívida com credores), poderes separados e um regime que diz quem decide o quê;
  - política é uma decisão com custo no orçamento.
- **Falta:** orçamento em reais, poderes, regimes como instituições e a monarquia institucional.

### 7. Geografia e dados nacionais
- **Hoje:** a cidade (`lugar`: região, desemprego e custo de vida, escolhida só no nascimento), o Brasil e quatro países fictícios fixos no código.
- **Contrato:**
  - dados de referência imutáveis e versionados, com fonte, data, unidade e licença;
  - estado dinâmico compacto por país e por divisão, no nível de detalhe certo;
  - residência e cidadania como arestas;
  - países e divisões são dados, não constantes do código.
- **Falta:** países reais, divisões, mapa e mudar de cidade ou de país (o rascunho do incremento 11 cobre parte).

### 8. Diplomacia e relações internacionais
- **Hoje:** `diplomacia.ts`, com relação, sanção, acordo, câmbio, alinhamento e o ato de quem governa.
- **Contrato:**
  - tratados e acordos são contratos entre Estados: partes, termos, vigência e violação;
  - instituições multilaterais são entidades com capital, governança e regras.
- **Falta:** tratados como objetos, alianças, multilaterais e reconhecimento.

### 9. Defesa, conflitos e segurança
- **Hoje:** só texto.
- **Contrato:**
  - a capacidade militar é um estoque de um Estado: orçamento, pessoal, equipamento e logística;
  - o conflito é um processo de vários anos, com custos nas contas e na população.
- **Falta:** tudo. Depende de 6, 7 e 8.

### 10. Demografia, religião, cultura e sociedade
- **Hoje:** traços, tipo de família e classe de origem. A população não existe como número.
- **Contrato:**
  - a população é organizada por coortes, no nível de detalhe do país;
  - cultura e religião são distribuições que mudam, não rótulos fixos.
- **Falta:** tudo. Depende de 7.

### 11. Agentes autônomos e delegação
- **Hoje:**
  - os personagens agem por chance (regras anuais e iniciativas);
  - `empresa.dependencia` mede quanto a empresa precisa de quem manda;
  - os robôs do túnel jogam de fora.
- **Contrato:**
  - **o agente** é uma entidade com:
    - objetivo;
    - mandato: escopo, limites e nível de autonomia (assistido, delegado, autônomo, estratégico);
    - conta para o orçamento;
    - relatório.
  - **o agente propõe operações**, e as mesmas regras de `motivoParaNaoOperar` decidem se ele pode;
  - **o mandato decide** se ele executa ou só recomenda;
  - **a relação** com quem joga é um contrato de serviço, com custo e encerramento.
- **Falta:** tudo.

### 12. Causalidade, explicabilidade e histórico
- **Hoje:**
  - a entrada guarda as causas: as qualidades que a condição consultou, mais a origem do agendamento;
  - pontos de virada, o porquê na linha do tempo e o resumo da vida.
  - Condição sobre número não gera causa, e a promoção e o fim de mandato não têm causa.
- **Contrato:**
  - além da proveniência (que entrada habilitou a outra), a contribuição quantitativa: quanto de uma mudança de número veio de cada causa;
  - "explicação incompleta" quando a causa é a regra do ano;
  - comparação de cenários: a mesma semente com uma decisão diferente.
- **Falta:** contribuição, incerteza e cenários.

### 13. Interface de decisões e administração
- **Hoje:**
  - três faixas (cabeçalho, linha do tempo, palco) e quatro folhas (Família, Dinheiro, Carreira, País);
  - o porquê na linha do tempo;
  - sem histórico de indicadores.
  - A interface copia regras do motor (o 0,94 da venda, a retirada) e engole falhas de operação.
- **Contrato:**
  - a interface lê o motor e nunca recalcula regra;
  - cada folha nova é relatório, histórico e decisão pendente;
  - toda operação mostra o motivo quando não pode.
- **Falta:** histórico, extrato, painel de agentes e mapa.

## Regras técnicas para todo módulo

- **Estado:** um só `EstadoVida`. Cada módulo é dono das suas entidades e campos, declarados no manifesto.
- **Dinheiro:** só por `transferir`, `reavaliar` ou emissão registrada, com teste de conservação em toda vida do túnel.
- **Contratos:** objetos no estado, com partes, termos, saldo, eventos (pagamento, atraso, inadimplência, encerramento) e a entrada que os criou.
- **Tempo:** o ano é uma lista de etapas declaradas. Nenhuma etapa lê o que uma posterior escreve no mesmo ano sem declarar.
- **Determinismo:**
  - todo sorteio vem do `rng` do estado;
  - o modelo reduzido do mundo usa sementes derivadas (país, ano), para poder ser avaliado sob demanda;
  - consultar não sorteia: a interface e os robôs não podem gastar o `rng` da vida.
- **Dados de referência:** em `conteudo/`, ou em arquivos estáticos carregados sob demanda, com fonte, data, unidade e licença; nunca no save. O vite-plugin-pwa recusa arquivo de mais de 2 MiB, e o bundle já tem 1,09 MB.
- **Persistência:**
  - save com versão e cadeia de migração (v → v+1) testada com saves reais guardados como fixture;
  - exportar e importar;
  - o livro antigo compactado em resumo.
- **Dependências:** nenhum ciclo novo de import. Hoje há um: `carteira → fortuna → storylets → efeitos → carteira`. Um teste trava ciclos novos.
- **Interface:** sem fórmula do motor copiada; botão habilitado só quando o motor permite.

## Dependências entre as frentes

```
Contas com contrapartida (I-01)
├── Dívida como contrato (I-02) ── Banco (I-30) ── Banco central (I-32) ── Moedas (I-33)
│                                         └── Falência e contágio (I-35)
├── Tesouro (I-31) ── Dívida soberana (I-34) ── Multilaterais (I-52)
│        └── Poderes (I-40) ── Monarquia institucional (I-41) ── Criar Estado (I-43)
├── Caixa da empresa (I-11) ── Diretor executivo e conselho (I-12)
└── Contrato de serviço (I-17) ── Gestor de patrimônio (I-10) ── Holding (I-13), fundação (I-15), family office (I-14)
                                                         └── Concierge (I-16)
Identidade de pessoas (I-05) ── agentes que são pessoas, sucessão por instrumentos (I-18), demografia (I-70)
O ano em etapas (I-03) ── livro compacto (I-04), túnel mais barato (I-08), nível de detalhe (I-21)
Nível de detalhe (I-21) + decisão do dono ── Países reais (I-20) ── Morar fora (I-23), mapa (I-22), tratados (I-50), defesa (I-60), sociedade (I-70)
```

## Fases e primeiras fatias

| Fase | Entrega | Primeiras fatias |
|---|---|---|
| 0 | Auditoria, arquitetura e registro de ideias | estes três documentos |
| 1 | O livro e as contas | 1.1 contas com contrapartida e o extrato do ano (feita em 12/10); 1.2 dívida como contrato; 1.3 o ano em etapas declaradas, com o livro compacto; 1.4 identidade de pessoas |
| 2 | Patrimônio e agentes | 2.1 gestor de patrimônio com mandato; 2.2 caixa da empresa; 2.3 holding, fundação e family office; 2.4 concierge |
| 3 | Países reais e geografia | 3.1 dados de referência e nível de detalhe; 3.2 morar em outra cidade e em outro país; 3.3 mapa |
| 4 | Bancos, crédito, moedas e dívida | banco e tesouro como entidades; banco central; dívida soberana |
| 5 | Governo, regimes e Estados | poderes; monarquias; criar Estados |
| 6 | Sistema internacional | tratados; multilaterais; poder nacional |
| 7 | Defesa e conflito | forças armadas; guerra como processo |
| 8 | Sociedade | demografia; cultura e religião |
| 9 | Contínuo | interface, desempenho, equilíbrio, testes |

Cada fatia é de ponta a ponta: motor, conteúdo quando houver, interface, testes, portão no túnel e documentação. Uma fatia só começa quando as dependências dela estão publicadas.

## A primeira fatia (1.1): toda transferência tem dois lados

**Problema.** 86,6% das entradas do livro que mexem em dinheiro o criam ou o destroem (450 vidas, três estratégias). Sem contrapartida não há:
- credor para a dívida;
- orçamento para o governo;
- taxa para o gestor;
- caixa para a empresa.

Tudo o que a missão pede para dinheiro (fases 2, 4, 5 e 6) começa aqui.

**Regras.**
1. **A contraparte no livro.** Toda mudança de dinheiro diz de quem veio ou para quem foi: o campo `p` da mudança (`tipos.ts › Mudanca`). A contraparte pode ser:
   - **uma entidade**, como a mãe, a empresa ou um bem;
   - **uma conta de fora:**
     - `mercado`: o setor privado, que paga salário, vende, aluga e compra;
     - `tesouro`: o governo, que recebe imposto e paga auxílio, cargo público e o juro dos títulos;
     - `banco`: crédito e juros;
     - `parentes`: a família que não é personagem;
   - **`reavaliacao`**, quando é um preço que mudou sem dinheiro trocar de mão: a inflação que come o dinheiro parado, a cotação das ações, dos fundos, do dólar e das criptomoedas.

   As contas de fora não são estado nesta fatia, porque não decidem nada. O saldo de cada uma sai do livro. Viram entidades com balanço na Fase 4.
2. **Funções do livro.**
   - `anotar`, `somar` e `movimentar` aceitam a contraparte.
   - `transferir` entre duas entidades grava os dois lados na mesma entrada, cada um apontando o outro.
3. **O ano econômico, fluxo por fluxo.** A conta do estado fica igual; muda só a anotação, que hoje junta tudo numa mudança por campo:

   | Fluxo | De | Para |
   |---|---|---|
   | Salário | mercado; o tesouro, para servidor e cargo público | quem joga |
   | Imposto | quem joga | tesouro |
   | Auxílio | tesouro | quem joga |
   | Bico do piso de renda | mercado | quem joga |
   | Consumo | quem joga | mercado |
   | Gasto do padrão de vida | quem joga | mercado |
   | Gasto da velhice | quem joga | mercado |
   | Juros da dívida | quem joga | banco |
   | Juro da renda fixa | tesouro | quem joga |

   Viram reavaliação a inflação e a cotação. Aplicar, resgatar e pagar dívida com dinheiro são conversões dentro da mesma pessoa e não precisam de contraparte.
4. **Os outros caminhos do dinheiro**, cada um com a sua contraparte:
   - **os personagens:** a poupança do ano vem do mercado; a herança entre eles fecha dos dois lados; a parte dos irmãos que não são personagens vai para `parentes`;
   - **bens:** compra, venda, aluguel e manutenção;
   - **empresas:** abertura, aporte, retirada, venda e quebra;
   - **campanhas e jogadas;**
   - **efeitos do conteúdo:**
     - `dinheiro` é com o mercado, salvo quando o bloco diz outra contraparte;
     - `divida` é com o banco;
     - `transferir` é entre as duas pessoas.

**Invariante.** Em cada entrada, para cada entidade:
- as mudanças de dinheiro sem contraparte (conversões internas) somam zero;
- uma mudança com contraparte entre duas entidades aparece nos dois lados, com sinais opostos.

**Preservar.** As mesmas sementes dão as mesmas vidas: nenhum número de nenhuma vida muda. O `docs/metricas.md` tem de sair igual, fora as linhas novas e o tempo de CPU.

**Testes.**
- O invariante, entrada por entrada, em vidas sorteadas, de fortuna, de linhagem e de dinastia.
- Toda contraparte é uma entidade da vida, uma conta de fora ou `reavaliacao`.
- O extrato do ano soma a variação do patrimônio financeiro de quem joga.
- O livro de cada entidade continua fechando (começo + Σ = fim).
- Um save antigo carrega: as contas nascem zeradas.

**Túnel.**
- Medida nova: entradas com dinheiro sem contraparte, com portão em 0% que trava o CI.
- CPU e tamanho do save antes e depois; aceitação de até +10%.

**Interface.** O extrato do ano na folha Dinheiro, lido do livro: de quem veio e para quem foi o dinheiro (salário, imposto, juros, aluguel, consumo).

**Fora do escopo:**
- contratos de dívida (1.2);
- caixa da empresa (2.2);
- banco e governo decidindo com o próprio saldo (Fase 4).

**Riscos:**
- números mudarem por arredondamento ou pela ordem das somas: o teste de igualdade das métricas pega isso;
- o save crescer com as mudanças a mais: medir; a compactação (I-04) é a resposta;
- o validador exige leitores para todo campo escrito: por isso as contas de fora ficam só no livro, como o próprio histórico, até virarem entidades com decisão (Fase 4).

**Critério de pronto:**
- os testes acima passam;
- o túnel mostra 0% sem contraparte e as métricas iguais;
- o extrato aparece nos dois temas;
- `npm run verificar` passa;
- `docs/decisoes.md` registra o que mudou.

## Orçamentos

| Recurso | Hoje | Regra |
|---|---|---|
| CPU por vida no túnel | 88 ms (meta antiga: 30 ms) | Cada fatia mede o seu custo; nenhuma passa de +10% sem decisão registrada. A fatia 1.3 é a hora de atacar o custo. |
| Save | 275 KB na mediana, 447 KB no máximo por vida | Teto de 1 MB para o save inteiro (vida, memória e dinastia), com compactação do livro antigo |
| Bundle | 1,09 MB de JS (311 KB comprimido) | Dados de países e mapas carregados sob demanda; nenhum arquivo acima de 2 MiB |
| Toques por vida | 453 (teto 480) | Delegação e agentes devem baixar, não subir |
