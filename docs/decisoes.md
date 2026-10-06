# Decisões

Cada decisão relevante, com uma linha de motivo. O que foi cortado também fica aqui.

## Pilha e arquitetura

- **Vite 8 + TypeScript 7 + Preact 11 + Vitest 5 + Zod 4 + vite-plugin-pwa 2.** Versões estáveis atuais; nenhuma dependência além das pedidas.
- **Sem `@preact/preset-vite`:** o JSX é compilado pelo próprio Vite (oxc). Uma dependência e o Babel a menos; recarga completa basta.
- **Scripts em TypeScript rodam direto no Node 22.18+.** Sem `tsx` nem build de scripts; o túnel usa exatamente o código do jogo.
- **O motor recebe o conteúdo já lido.** O mesmo motor roda no Node (lê do disco) e no navegador (`import.meta.glob`).
- **Ícones PNG desenhados por um script sem dependências.** Quatro PNGs não justificam uma biblioteca de imagem.
- **Deploy confere se o Pages está ativo antes de publicar** e deixa um aviso com o passo para ativar. Pages desligado não deve deixar a `main` vermelha.

## Motor e regras

- **Ano de nascimento = ano atual.** Toda vida acontece no futuro próximo; sem anacronismos de época.
- **Gênero masculino ou feminino.** A concordância do português depende disso em todo texto; um modo neutro exigiria reescrever cada frase e pode entrar se o dono pedir.
- **Marcos (`marco: true`).** ENEM, primeiro emprego, formatura e aposentadoria são a espinha da vida; sorteados, deixavam vidas sem espinha.
- **Morte por Gompertz ajustado pela saúde, mortalidade infantil mínima.** Morrer aos 2 anos não é história, é frustração.
- **Pontos de virada por descendência causal** (marcas consultadas + agendamentos). Prova a tese do jogo com número, não com palpite.
- **Consequência contada pelo que aconteceu ali** (o resumo da escolha naquele evento), com o resumo do evento como reserva. "Reencontrou Iara para um café de quatro horas" diz mais que "foi chamado para um café".
- **Memória entre vidas** (recência com decaimento divide o peso no sorteio). Reduz a sensação de "a mesma vida de novo" sem apagar eventos.

## Dinheiro

- **Tudo em reais de hoje.** Valores nominais de 2080 confundiam (carro usado de "R$ 111 mil"); a inflação continua com o efeito que importa para decidir: dinheiro parado encolhe.
- **60% da sobra anual vira padrão de vida.** Sem isso, quem morava com os pais acumulava fortunas; com isso, investir e gastar viram decisões de verdade.
- **Financiamento é dívida com juros (22% ao ano).** Um mecanismo só; parcelas e quitações foram cortadas.
- **Resgatar investimento para cobrir buraco e amortizar dívida com a sobra são automáticos.** Não são decisões interessantes.
- **Pisos de renda e de custo para adultos** (bicos, benefício, contribuição em casa). Evitam estados absurdos, como renda zero por décadas.
- **Investir está ao alcance de qualquer um com dinheiro parado** (o evento volta a cada 5 anos até a pessoa investir). Antes, a inflação comia o dinheiro de quem nunca ganhara a marca de poupador, sem saída.
- **Compras à vista exigem patrimônio, não dinheiro em conta.** Quem investe também pode comprar; o resgate é automático.

## Interface

- **Uma ação no polegar:** o palco fixo embaixo mostra o +1 ano ou o cartão do evento. Jogar com uma mão.
- **Tema segue o sistema, sem botão.** Atende claro e escuro sem uma tela a mais.
- **Opções indisponíveis aparecem desabilitadas, com o motivo.** A falta de dinheiro também conta a história.
- **Toques ignorados por 450 ms quando um evento aparece.** Um toque duplo no +1 ano escolhia sem querer.
- **Chip de inflação discreto e no máximo a cada 5 anos.** Todo ano em vermelho virou ruído no primeiro teste.
- **Cabeçalho opaco** (sem efeito de vidro). O texto vazava por trás e atrapalhava a leitura.
- **Cartão da vida sempre em tema claro.** A imagem sai do jogo e cai em qualquer fundo.

## Equilíbrio (guiado pelo túnel)

- **Risco dos robôs = incerteza + exposição** (saúde perdida, dívida, chance de morrer), não custo. A primeira definição (desvio + perda esperada) fazia "arriscado" significar "o que custa mais", e a estratégia arriscada só afundava.
- **Fumar tira 0,5 de saúde por ano (era 1,2); natação na infância deixou de dar saúde passiva vitalícia.** Com os valores antigos, a cautelosa vivia 13 anos a mais que a aleatória só por evitar duas escolhas.
- **Dívida pesada tira 1,5 de felicidade e 0,3 de saúde por ano (era 3 e 1).** Com o retorno da felicidade à média, −3 por ano prendia endividados em felicidade 35 por décadas.
- **Opções ousadas ganharam recompensa esperada maior** (festa, entrega na chuva, moto, super-herói) e opções "óbvias" ganharam custo (exames tomam a manhã, horta e hidroginástica custam dinheiro). Em 55 de 80 eventos a opção mais segura era também a de maior valor esperado.

## Cortes

- **Escolher nome, gênero e cidade antes de nascer.** O jogo começa em um toque; tudo é sorteado.
- **Configurações, botão de tema, sons, conquistas, galeria de vidas passadas.** Nada disso é a história.
- **Relações, carreira e gerações como sistemas.** Travados até o dono pedir (regra do projeto).
- **Parcelas com quitação** (carro, casa). Financiamento virou dívida.
- **`@preact/preset-vite`, Babel, `tsx`, bibliotecas de ícone e de canvas.**
- **Eventos planejados e cortados antes da escrita** (o rascunho tinha 112; o teto da fase 1 é 80): tatuagem e cobrir tatuagem, cobrança do FIES, mestrado, viagem de moto, cancelamento na internet, música antiga que viraliza, escândalo do vereador, quitação da casa e do carro, grupo da família, mangueira do vizinho, demissão aos 55, academia, jovem aprendiz, curso técnico, excursão da melhor idade, último desejo, proposta de trabalho no exterior, saudade do Brasil, segunda chance no ENEM, entregador que vira dono, decisão entre bola e escola, primeiros passos, catapora, boletim vermelho, crise dos 25. Ficaram os que sustentam cadeias; alguns viraram linhas curtas.
