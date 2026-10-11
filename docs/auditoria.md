# Auditoria por primeiros princípios (11/10/2026)

Pergunta: o que este software precisa ser, dado o que ele promete? E o que ele é hoje?

**Método:**
- **Evidência própria:** experimentos com o motor (96 vidas sorteadas, bilionárias e trilionárias; 16 dinastias trilionárias de 3 gerações), um perfil de CPU de 1.600 vidas do túnel e leitura dirigida do código.
- **Auditoria da interface:** feita por um auditor separado; os achados dele que eu conferi estão marcados "conferido".
- **Fora de alcance:** os auditores dos outros sistemas pararam no limite de uso. O que não verifiquei está dito como tal, na última seção.

## O objetivo, reduzido ao essencial

O produto é **uma história sobre uma vida que o próprio jogador causou, em poucos minutos, no celular**. Disso saem as necessidades:

| Requisito | Fundamento | Regra que o código precisa ter |
|---|---|---|
| A vida é do jogador e é explicável | Toda mudança tem uma causa | Livro-razão: só `livro.ts` muda o estado, e cada mudança fica na entrada que a causou |
| A mesma vida pode ser rejogada e salva | Repetibilidade | Motor puro; todo sorteio vem do `rng` do estado, e o `rng` vai para o save |
| "Posso tentar qualquer coisa / o mundo reage" | Liberdade com consequência | Escolha → efeito → marca (memória) → reação depois; nenhum efeito sem leitor |
| Poucos sistemas, muitas combinações | Combinatória | Um formato de estado (caminhos) e um de conteúdo (storylet) |
| Brasil real, mesmo na fantasia | Coerência do mundo | Nenhum estado impossível (mais empregados que gente, mais títulos que dívida) |
| Qualidade se mede | Evidência | Túnel com metas que travam o CI; validador de leitores e escritores |
| Uma mão, poucos minutos | Custo de atenção | Decisão do momento em um toque; o porquê visível; nada de tela de gestão |

## 1. Mapa dos primeiros princípios

| Sistema | Problema fundamental | Necessidades | Invariantes | Implementação atual | Divergência (antes desta rodada) |
|---|---|---|---|---|---|
| Estado e livro-razão (`tipos`, `campos`, `livro`) | Saber o que é verdade agora e por quê | Entidades por caminho; toda mutação anotada com a causa | Começo + Σ variações = estado, para **toda** entidade | Funções únicas de mutação; anotação de caixa nas operações de dinheiro | **Parcial:** personagens criados durante a vida (par, filho, paixão, bicho) nasciam com saúde e dinheiro fora do livro, e o papel novo sobrescrevia o antigo sem registro (amor.saude: 67 violações em 96 vidas). O teste só olhava quem joga. |
| Determinismo e save (`rng`, `salvar`) | Rejogar e continuar depois | Sorteio só pelo `rng` do estado; save versionado | Mesma semente + mesmas escolhas = mesma vida | Nenhum `Math.random`, `Date` ou relógio no motor (conferido); save com versão e teste de ida e volta | Alinhado |
| Conteúdo (`storylets`, `diretor`, `efeitos`, `condicoes`) | Muitas histórias com pouco código | Um formato; elegibilidade; saliência; efeitos por caminho; causas | Pelo menos uma saída sempre aberta; texto com personagem garantido | Evento, ação, iniciativa e jogada pelo mesmo storylet; `aplicarEscolha` comum desde o incremento 5 | Alinhado, mas pouco auditado nesta rodada (ver o fim) |
| Economia (`economia`, `carteira`, `empresa`, `bens`) | Dinheiro com dinâmica plausível e escolha | Renda, gasto, risco, crescimento, crise | Valores dentro do tamanho do mundo | Empresa crescia `valor × (tração + fase + sorte)` sem teto; investimento rendia sem limite; funcionários = valor ÷ 150 mil | **Desalinhada:** estados impossíveis. A Brito Tech chegou a 956.903.676 funcionários e a R$ 144 tri; uma herdeira, a R$ 357 tri, quase tudo em títulos públicos. |
| Poder (`poder`) | Dinheiro e imagem viram poder, causalmente | Influência, imagem pública, eleição, mandato | Todo campo escrito altera alguma decisão | Influência anda para um alvo; popularidade só pesava na reeleição e zerava em 55 ao assumir | **Desalinhada:** 103 efeitos de conteúdo mexiam na popularidade de quem não tinha cargo, sem consequência nenhuma. |
| Ações e jogadas (`acoes`, `fortuna`) | O que o jogador faz no ano, e o que a fortuna permite | Escolha explícita; custo; sem gastar ficha na gestão | Opção indisponível aparece com o motivo | Ficha derivada do livro; jogada com preço que bloqueia sem dinheiro na mão | Alinhado |
| Vida, pessoas e herança (`vida`, `familia`, `pessoas`, `herdeiro`) | O ano passa; os outros vivem; a história continua | Ordem do ano; regras dos personagens; partilha | Uma pessoa é uma pessoa (identidade estável) | Papéis fixos (`amor`, `filho`) servem de identidade | **Parcial:** o segundo amor apaga o primeiro; um filho só. Nomes atuais aparecem em entradas antigas. Esta parte continua aberta. |
| Validação (`validacao`, `manifesto`) | Impedir estado que nada decide | Leitores e escritores por sistema | O manifesto descreve o código | Manifesto escrito à mão | **Parcial:** desatualizado sem ninguém notar (`bem.valor` com 18.695 escritas por ano de vida; `amor.dinheiro`). |
| Túnel e robôs (`tunel`, `robos`) | Medir qualidade antes do dono | Vidas suficientes; metas que travam o CI | Cada storylet aparece; nenhuma estratégia domina | 10.000 vidas, mais lotes de origem, linhagem, fortuna e dinastia | Alinhado no que mede. **Custo:** 604–656 s e 52 ms/vida (teto de 30); sem gargalo único (o maior consumo próprio é `acoesDoVerbo`, com 9%). |
| Interface (`src/ui`) | Projetar o estado e a decisão do momento | Um toque; o porquê visível; motivo nas opções | Botão habilitado ⇔ o motor permite | Três faixas; carência de 450 ms; morte sempre pelo mesmo fluxo | **Parcial:** promoções, fins de mandato e fins de carreira escondidos (116 + 30 + 1 a cada 40 vidas; conferido). Fórmulas copiadas do motor. Botões que falham em silêncio. |

## 2. Mapa de complexidade

- 🟢 **Necessária**
  - `livro.ts` como único caminho de mutação.
  - `rng` dentro do estado.
  - Um formato de storylet para quatro tipos.
  - Caminhos `ent.campo` em condições e efeitos.
  - Validador de leitores e escritores.
  - Túnel com metas que travam o CI.
  - Motor sem interface.
  - Save versionado com migração.
  - As três faixas da tela.
- 🟡 **Justificável, mas investigável**
  - **Manifesto manual.** As escritas agora têm teste; as leituras ainda não.
  - **Robôs que avaliam efeitos com conhecimento do motor** (`valorEfeitos`): medem o jogo, mas podem mascarar problemas de compreensão.
  - **Cadeia de `ehOperacaoDe…` em `carteira.ts`:** são seis grupos.
  - **Tamanho de arquivos:** `Dinheiro.tsx` tem 531 linhas e `scripts/tunel.ts`, 1.012.
  - **Custo do túnel.**
- 🟠 **Provavelmente acidental**
  - **Fórmulas e limites copiados na interface** (`Dinheiro.tsx`):
    - venda com `0,94`;
    - retirada, aluguel e manutenção refeitos;
    - "Três compras" escrito no texto.
  - **Balanço do ano calculado na interface:** ignora os bens e a parcela do financiamento, e difere de `patrimonioTotal`.
  - **Dado duplicado:** `save.vidas` repete `memoria.vidas`.
  - **Classes CSS vindas de dados no espaço global:** a colisão `.dinheiro` já aconteceu uma vez.
- 🔴 **Contradizia os fundamentos (corrigido nesta rodada)**
  - Economia sem tamanho.
  - Popularidade sem consequência.
  - Livro-razão aberto para personagens criados.
  - Manifesto desatualizado.
  - Entradas de regra escondidas da linha do tempo.
- 🔴 **Ainda aberto**
  - **Identidade de personagem:** o papel é a pessoa.

## 3. Mapa de oportunidades

### Feitas nesta rodada (pequenas, comprovadas e com teste)

**1. O mundo tem tamanho**
- **Problema:** estados impossíveis.
- **Fundamento:** coerência e Brasil real.
- **Evidência:** a captura do dono (957 milhões de funcionários) e as dinastias medidas.
- **Mudança:**
  - O ganho da empresa encolhe perto de `TETO_EMPRESA` (R$ 20 tri, o valor das maiores do mundo) e some acima dele; a perda vale inteira.
  - O investimento rende só até `CAPACIDADE_DO_MERCADO` (R$ 5 tri); o excedente fica parado.
  - Os funcionários saturam em 3 milhões, e continuam lineares enquanto a empresa é pequena.
- **Preserva:** bilhões e trilhões continuam alcançáveis. O maior patrimônio medido foi R$ 16,7 tri.
- **Risco:** só nos extremos.
- **Testes:** `fundamentos.test.ts`.

**2. Imagem pública com consequência**
- **Problema:** efeito sem leitor.
- **Fundamento:** toda variável altera uma decisão.
- **Mudança:**
  - A popularidade pesa em toda eleição, não só na reeleição.
  - O mandato começa com a imagem de quem ganhou mais 5 (no mínimo 45, no máximo 90), em vez de zerar em 55.
- **Preserva:** sem efeitos, a imagem é 50 e a chance não muda.
- **Teste:** eleição sensível à imagem.

**3. Livro-razão fechado para toda entidade**
- **Mudança:** quem sai do papel deixa os números no livro (marcados `saida`, fora dos chips), e quem chega entra com os seus.
- **Preserva:** os chips continuam iguais.
- **Teste:** começo + Σ variações = fim, para toda entidade, em vidas sorteadas, de fortuna e de linhagem.

**4. Manifesto conferido pelo comportamento**
- **Mudança:** um teste joga vidas e exige que toda escrita de regra esteja declarada. Isso achou `bem.valor`, `bem.financiado` e o dinheiro de qualquer pessoa que morre.
- **Risco:** nenhum na lógica.

**5. O porquê visível**
- **Mudança:** a linha do tempo mostra as entradas de regra com texto (promoção, fim de mandato, fim de carreira); só a entrada invisível do ano fica escondida.
- **Teste:** `visivel()`.

**6. Um número de regra na interface**
- **Mudança:** o aviso de popularidade usa `POPULARIDADE_CRITICA`. Antes, ficava vermelho só abaixo de 25, e o cargo cai abaixo de 30.

### Propostas (não feitas: risco maior, ou exigem decisão de produto)

| Problema | Fundamento | Evidência | Mudança proposta | Comportamento preservado | Risco | Teste necessário |
|---|---|---|---|---|---|---|
| O papel é a pessoa | Identidade estável | `pessoas.ts`: `e.entidades[papel] = en` sobrescreve | Pessoas com id próprio (`p1`, `p2`…); papéis apontam para elas; vários filhos e ex | Caminhos `amor.x` continuam valendo (o papel resolve para a pessoa) | Alto: save novo e conteúdo | Migração de save; livro fechado; texto antigo com o nome certo |
| Balanço do ano na interface | Um cálculo por conceito | `formato.ts` ignora bens | O motor grava a variação de `patrimonioTotal` na entrada do ano | O chip | Médio: campo novo no save | Chip = Δ patrimônio |
| Botões que falham em silêncio | Opção indisponível tem motivo | Retirada, perfil, vender, morar e alugar sem `motivoParaNaoOperar` | Todo botão de operação com motivo; carência nas confirmações; limpar a seleção depois de comprar | Operações válidas | Baixo | Com evento pendente ou vida encerrada, toda operação devolve motivo |
| Literais do motor na interface | Uma regra, um lugar | `0,94`, `RETIRADAS`, `AQUISICOES_TRUSTE`, `taxaDeAluguel` | Usar as constantes e funções do motor | Valores de hoje | Baixo | Visual |
| Classes vindas de dados | Isolamento | `ano ${tipo}`, `fase ${fase}` | Prefixar (`tipo-…`, `fase-…`) | Aparência | Baixo | Visual nos dois temas |
| Leituras do manifesto sem prova | O validador confia nele | Leituras declaradas à mão | Registrar as leituras reais em modo de teste e comparar | O validador | Médio | Leituras observadas ⊆ declaradas |
| Túnel lento | Ciclo de feedback | 604–656 s; 52 ms/vida | Medir antes: paralelizar o túnel por processos (só scripts) ou reduzir trabalho repetido por ano | As métricas (mesmas sementes) | Médio | Mesmo `metricas.md` antes e depois |
| A imagem não esmaece | O povo esquece | Imagem sem cargo não anda mais | Decidir com o túnel se a imagem volta devagar para 50 sem cargo | Eleições | Baixo | Túnel |

## O que esta rodada não verificou

Não verifiquei com evidência própria:
- a ordem causal das regras do ano em `vida.ts`;
- a construção da vida do herdeiro (`herdeiro.ts`, além do imposto);
- os detalhes do diretor (saliência, cálculo de causas);
- os caminhos de migração de save antigos;
- o realismo dos robôs.

Os testes existentes cobrem parte disso, porque passam o determinismo com save no meio, o livro de quem joga e a herança. Uma auditoria específica desses pontos fica como próximo passo.

Achados da auditoria da interface que eu não reproduzi:
- o toque duplo em confirmações que empurram a lista;
- o custo por toque no aparelho;
- o cartão que chama de "Escolhas" a contagem de eventos.

Ficam na tabela de propostas como relatados.
