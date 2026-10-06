# O motor

Código em `src/motor/`. Puro: não toca em DOM nem em disco; recebe o conteúdo já lido e um estado, e muda o estado. A interface clona o estado antes de cada passo; o túnel de vento muta direto (é mais rápido).

## Estado (`EstadoVida`, em `tipos.ts`)

- **pessoa e personagens:** nome, gênero, cidade, profissões dos pais; `mae`, `pai`, `avo` e `amigo` nascem junto; `amor`, `filho`, `paixao` e `pet` são criados por efeitos.
- **atributos:** saúde, felicidade, inteligência e aparência, de 0 a 100.
- **finanças:** dinheiro, investido, dívida, renda e custo anuais — tudo em reais de hoje.
- **marcas:** `nome → { ano, idade, origem }`. `origem` é o id da entrada do histórico que gravou a marca.
- **agenda:** eventos marcados para um ano futuro, com a entrada que os agendou.
- **histórico:** as entradas da linha do tempo (nascimento, evento, linha, morte). Cada evento guarda `causas`: as entradas que o tornaram possível.
- **rng:** estado do gerador com semente (mulberry32, um inteiro). Vai no save; recarregar a página não muda o futuro.

## Um ano (`avancarAno`)

1. Idade e ano +1.
2. **Economia** (`economia.ts`): sorteia a inflação do ano (média 4,5%, com crises ocasionais); o dinheiro parado encolhe por ela; o investido rende ~4% real ao ano (com anos ruins); a dívida cresce 22% ao ano nominais. Adultos recebem a sobra do ano — renda menos custo — e 60% da sobra vira padrão de vida. Falta de dinheiro resgata investimento e depois vira dívida; sobra amortiza dívida. Piso de renda (bicos, benefício) e de custo para adultos.
3. **Envelhecimento:** a saúde deriva com a idade, a felicidade volta 12% ao ano para 60 (ninguém vive de pico), a inteligência cresce na escola e cai na velhice, a aparência cai com a idade. Marcas com `porAno` (em `marcas.json`) somam efeitos passivos. Dívida pesada tira felicidade e saúde; patrimônio confortável dá um pouco de paz.
4. **Morte natural:** risco anual de Gompertz (`0,00003·e^(0,09·idade)`, mínimo infantil) multiplicado por `e^((60−saúde)/15)`. Saúde zero mata. Ninguém passa de 120.
5. **Evento do ano**, nesta prioridade:
   1. agendados vencidos (o primeiro que ainda cabe nas condições; os que não cabem caem fora);
   2. **marcos** (`marco: true`) elegíveis — a espinha da vida não depende de sorteio;
   3. sorteio com chance de `ritmo(idade)` (35% na primeira infância, 80% dos 13 aos 29, 45% na velhice) entre os eventos elegíveis, por peso × fator de novidade (memória entre vidas).
6. Sem evento, uma **linha curta** sorteada de `linhas.json` (por idade e condições, sem repetir as 15 últimas).

Elegível = idade na faixa, condições atendidas e, se não for repetível, nunca visto nesta vida (repetível: respeita `intervalo`).

## Escolha (`escolher`)

1. Aplica os `efeitos` da escolha.
2. Se houver `teste`, sorteia sucesso ou fracasso: `chance` fixa, ou `0,5 + (atributo − dificuldade) / 50`, entre 5% e 95%.
3. Aplica os efeitos do desfecho e registra a entrada: texto do evento, escolha, desfecho, resumos, causas e os deltas visíveis (chips).
4. Efeito `morte` ou saúde zerada encerram a vida (a entrada que matou vira causa da morte).

Efeitos possíveis: atributos (limitados a 0–100), `dinheiro`, `investir`, `divida` (negativo é desconto), `renda` e `custo` (soma ou `{ definir }`), `marcas`, `removerMarcas`, `personagens`, `promover` (copia um personagem para outro papel), `agendar` e `morte`.

## Pontos de virada (`virada.ts`)

Cada evento aponta suas causas: a entrada que gravou cada marca consultada nas condições e a entrada que o agendou. Isso forma um grafo. Para cada escolha do jogador, conta-se quantos eventos descendem dela (transitivamente). As três com mais descendentes viram os pontos de virada do cartão, cada uma ligada à sua consequência mais distante no tempo: "aos 17 você… → aos 34 …". Causas de morte com condição em marcas também apontam para a escolha que gravou a marca.

## Memória entre vidas (`memoria.ts`)

Ao fim de cada vida, cada evento que apareceu soma 1 à sua recência, e a recência de todos decai pela metade. No sorteio, o peso é dividido por `1 + 2 × recência`. Nada some; só cede a vez.

## Robôs do túnel (`robos.ts`)

- **primeira:** sempre a primeira opção disponível.
- **aleatória:** sorteia entre as disponíveis.
- **cautelosa:** menor risco; empate, maior valor esperado.
- **arriscada:** maior risco; empate, maior valor esperado.

Valor de um desfecho: atributos ponderados (saúde 1,2; felicidade 1; inteligência 0,6; aparência 0,5) + dinheiro (R$ 2 mil = 1 ponto; renda e custo com 5 anos de horizonte; investir vale o rendimento de 10 anos) + efeito passivo de marcas novas (10 anos) − 200 se o desfecho mata.
Risco: desvio-padrão do valor entre os desfechos + exposição (saúde perdida, inclusive por marca; dívida contraída; chance de morrer). Gastar ou perder felicidade com certeza é custo, não risco.

Uma estratégia fixa que vence as outras três em idade média de morte, patrimônio mediano e felicidade média ao mesmo tempo é **dominante**: o jogo teria resposta certa, e o túnel falha.

## Determinismo

Mesma semente e mesmas escolhas dão a mesma vida, mesmo salvando e recarregando no meio (há teste para isso). A interface sorteia a semente com `crypto.getRandomValues`; o túnel deriva as suas de uma semente fixa, então `docs/metricas.md` só muda quando o motor ou o conteúdo mudam.
