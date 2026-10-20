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
| B · O Tesouro | dívida soberana comprada vira ativo no balanço, com cupom no caixa pessoal ou da empresa | I-31, I-34 | o próximo |
| C · A coroa recebe | o soberano recebe salário, parte dos impostos ou taxa da coroa | I-41, I-43 | depois do B |
| D · O Estado pesquisa | usar o Tesouro do Estado para pagar pesquisa e desenvolvimento | I-54 | depois do B |
| E · Defesa | sistemas de armamento e guerra | I-60, I-61 | depois do B |

## Índice

| Id | Ideia | Fase | Prioridade | Estado |
|---|---|---|---|---|
| I-01 | Contas com contrapartida e o extrato do ano | 1 | Alta | feita (fatia 1.1) |
| I-02 | Dívida e financiamento como contrato | 1 | Alta | feita (fatia 1.2, 12/10) |
| I-03 | O ano em etapas declaradas | 1 | Alta | feita (fatia 1.3) |
| I-04 | Livro compacto (anos antigos em resumo) | 1 | Alta | reavaliada: adiada com números (fatia 1.3) |
| I-05 | Identidade de pessoas e relações como arestas | 1 | Alta | parcial: vários filhos (fatia 1.4a) |
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
| I-31 | Tesouro: o orçamento do Estado em reais | 4 | Alta | proposta (bloco B do dono) |
| I-32 | Banco central e política monetária | 4 | Média | proposta |
| I-33 | Moedas por país, regime cambial e moeda de reserva | 4 | Média | proposta |
| I-34 | Dívida soberana com credores, calote e contágio | 4 | Alta | proposta (bloco B do dono) |
| I-35 | Falência, reestruturação e intervenção | 4 | Média | proposta |
| I-36 | Setor privado agregado por país | 4 | Média | proposta |
| I-40 | Poderes separados | 5 | Alta | proposta |
| I-41 | Monarquia institucional e Casa Real | 5 | Alta | proposta (bloco C do dono) |
| I-42 | Indicadores separados de poder, riqueza, prestígio e legitimidade | 5 | Média | proposta |
| I-43 | Criar um Estado | 5 | Média | proposta (bloco C do dono: a ilha com população, PIB e imposto) |
| I-44 | Formas de Estado e de governo | 5 | Média | proposta |
| I-50 | Tratados como objetos | 6 | Média | proposta |
| I-51 | Alianças e blocos econômicos | 6 | Média | proposta |
| I-52 | Instituições multilaterais | 6 | Média | proposta |
| I-53 | Poder nacional por dimensões | 6 | Média | proposta |
| I-54 | Pesquisa e tecnologia como estoque | 6 | Média | proposta (bloco D do dono) |
| I-60 | Forças armadas como capacidade | 7 | Média | proposta (bloco E do dono) |
| I-61 | Guerra como processo com custos | 7 | Média | proposta (bloco E do dono) |
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
- **Estado:** proposta.

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
- **Prioridade:** Alta · bloco B do dono.
- **Estado:** proposta.

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
- **Prioridade:** Alta · Fase 5.
- **Estado:** proposta.

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
- **Prioridade:** Média · Fase 5.
- **Estado:** proposta.

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
- **Prioridade:** Média · bloco D do dono.
- **Estado:** proposta.

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
- **Prioridade:** Média · Fase 7.
- **Estado:** proposta.

### I-61 · Guerra como processo com custos
- **Problema:** a missão pede guerra com mobilização, logística, perdas, ocupação, impasse, negociação e reconstrução.
- **Módulos:** 9, 4, 6, 8, 10.
- **Depende de:** I-60, I-21 e I-70.
- **Custo:** GG.
- **Consome:** dinheiro, pessoas, equipamento e legitimidade.
- **Efeitos causais:** a guerra muda a economia, a população, a dívida e as relações por anos.
- **Riscos:** tom e sensibilidade. É abstrata e sem glorificação, e nunca uma ação instantânea.
- **Aceitação:** vitória, derrota, impasse e negociação são possíveis; os custos ficam no livro e testados.
- **Prioridade:** Média · Fase 7.
- **Estado:** proposta.

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

## Defeitos conhecidos

Da auditoria de 12/10 (`docs/auditoria-universo.md`). Cada um é corrigido num commit com teste, quando a fatia que mexe naquela parte passar por lá, ou antes se ficar barato.

| Id | Defeito | Onde | Gravidade | Estado |
|---|---|---|---|---|
| D-01 | A coroa vai para a pessoa errada quando quem herda é o par ou o amigo | `herdeiro.ts:437` | Média | aberto |
| D-02 | Qualidades herdadas guardam a idade da geração anterior (`marcaHa` erra a partir da 2ª geração) | `herdeiro.ts:205-208` | Média | aberto |
| D-03 | Dá para ser eleito presidente sob o regime | `poder.ts:59-73` | Média | aberto |
| D-04 | O monarca coroado continua na carreira de antes e pode ser demitido | `carreira.ts`, `trabalho.ts`, `96-linhagens.json` | Média | aberto (vai com I-41) |
| D-05 | Quatro storylets fazem reforma fora do limite de uma por ano | `99-pais.json` | Baixa | aberto |
| D-06 | A morte do corpo pode sair rotulada como violência | `morte.ts:23-24` | Baixa | aberto |
| D-07 | Os limites do câmbio divergem entre o motor e o campo | `diplomacia.ts:291`, `campos.ts:129` | Baixa | aberto |
| D-08 | O agendado que deixou de valer some sem registro | `diretor.ts:91-93` | Baixa | aberto: a agenda inteira está fora do livro (fatia 1.3) |
| D-09 | Operações da interface que falham em silêncio, e regras copiadas do motor | `App.tsx:154-157`, `Dinheiro.tsx`, `Pais.tsx` | Média | aberto (I-84) |
| D-10 | A chave de assinatura do APK está no repositório | `android/app/build.gradle` | Alta (segurança) | decisão do dono |
| D-11 | O APK sai sem testes e antes do CI terminar | `.github/workflows/android.yml` | Média | aberto |
| D-12 | O save sem cópia nem exportação: JSON corrompido apaga a memória | `src/jogo/salvar.ts` | Média | corrigido (fatia 1.3) |
