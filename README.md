# 🎲 Trajetória

[![CI e deploy](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml)
[![App Android](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml)
![Atualização](https://img.shields.io/badge/atualiza%C3%A7%C3%A3o-B%3A%20o%20Tesouro-D9A321)
![Histórias](https://img.shields.io/badge/hist%C3%B3rias-813-2EA043)
![Vidas testadas](https://img.shields.io/badge/t%C3%BAnel-10.000%20vidas%20por%20push-1F6FEB)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B)

## 📱 [Baixar o app para Android (APK)](https://github.com/Lhordriyon/Calculadora-Viva/releases/download/android/Trajetoria.apk)

## 🌐 [Jogar no navegador](https://lhordriyon.github.io/Calculadora-Viva/)

**Instalar no Android:** toque no link acima pelo celular, abra o arquivo `Trajetoria.apk` quando o download terminar e confirme. Se o Android pedir, permita que o navegador instale apps ("fontes desconhecidas"). Para atualizar, baixe de novo e instale por cima: a vida salva continua. O APK é gerado de novo a cada atualização do jogo ([página da versão](https://github.com/Lhordriyon/Calculadora-Viva/releases/tag/android)).

---

## 🆕 Novidades: Bloco B · O Tesouro (25/10/2026)

> [!IMPORTANT]
> **O que mudou:** agora dá para emprestar dinheiro ao governo. O título do Tesouro é um contrato:
> - a taxa fica travada na compra;
> - o cupom cai na conta todo ano, e o dinheiro volta no vencimento;
> - vender antes sai pelo preço do dia.
>
> E o governo pode dar calote. Com a dívida acima de 100% do PIB, numa recessão ou numa crise, quem tinha título perde.

> [!TIP]
> **Para testar:**
> - Depois dos 18, abra a folha Dinheiro e empreste ao governo por 5, 10 ou 20 anos. Cada botão mostra a taxa do prazo, e o cupom cai na conta no ano seguinte.
> - Compre um título longo com a Selic alta e venda quando ela cair: o preço do dia sobe.
> - Chegue a presidente, corte imposto e abra gasto. A dívida sobe, a taxa do título passa a cobrar o risco e, numa recessão, o calote aponta a sua reforma como causa.
> - A folha País mostra a dívida pública em reais, quanto dela é sua e o risco de calote.

| ✅ O que este bloco trouxe | ⏳ O que ele ainda não trouxe |
|---|---|
| 🏛️ **O título do Tesouro:** comprado pela folha Dinheiro, por 5, 10 ou 20 anos. A taxa soma o juro real do ano, o prêmio do prazo e o risco da dívida, já sem o imposto de renda. São no máximo 5 títulos, e ninguém tem mais de 30% da dívida do país | 🏢 **O título comprado pela empresa:** a empresa ainda não tem caixa próprio (ideia I-11), então o cupom não teria onde cair. Vem depois desse caixa |
| 💵 **O cupom e o vencimento:** o governo paga o cupom na conta todo ano. No vencimento, o dinheiro volta, numa entrada que lembra a idade em que você comprou | 📊 **O orçamento do governo item por item** (receita, gasto e juros em reais): ele muda a conta da dívida e fica para um bloco próprio |
| 📉 **Vender antes pelo preço do dia:** se o juro caiu depois da compra, você vende com lucro; se subiu, com prejuízo | 🏦 Os outros credores (bancos, fundos, gente de fora) como personagens, e o calote que contagia o crédito |
| 💥 **O calote:** quem tinha título perde 30% do valor, e a renda fixa perde 15%. A dívida do país cai um quarto, a economia afunda mais e o juro fica alto por seis anos. A notícia aponta a reforma, a posse ou o decreto que levou a dívida até ali | |
| 👪 **O título passa a quem herda** e vence na vida dele | |
| 🇧🇷 **A dívida pública em reais** na folha País, com a parte que é sua e o risco de calote | |
| 📖 **Três histórias novas:** o primeiro cupom, o calote no noticiário (vender ou segurar?) e o dia seguinte ao calote | |

No túnel de vento, a estratégia cautelosa compra título em 99,6% das vidas e a arriscada em nenhuma. O calote aparece em 1% das vidas e só leva de quem tinha título ou renda fixa. Nenhuma estratégia passou a vencer em tudo. O histórico está no [📜 CHANGELOG](CHANGELOG.md), com a correção anterior (C3).

## 🗺️ Os próximos blocos

Pedidos do dono em 19/10, em blocos pequenos, na ordem em que um precisa do outro. A cara nova (V1) e a correção dela (C1 a C3) entraram no meio, a pedido dele:

```mermaid
flowchart LR
  A["🇧🇷 A · O país em números<br/>PIB, população, Gini, IDH"]:::feito --> B["🏛️ B · O Tesouro<br/>títulos, cupom e calote"]:::feito
  B --> C["👑 C · A coroa recebe<br/>dotação e imposto da ilha"]:::proximo
  B --> D["🔬 D · O Estado pesquisa<br/>pesquisa paga pelo Tesouro"]:::depois
  B --> E["🛡️ E · Defesa<br/>forças armadas e guerra"]:::depois
  classDef feito fill:#2ea043,stroke:#1a7f37,color:#fff
  classDef proximo fill:#bf8700,stroke:#9a6700,color:#fff
  classDef depois fill:#8250df,stroke:#6639ba,color:#fff
```

| Bloco | O que entra | Por que nesta ordem |
|---|---|---|
| 🟢 **A** · O país em números | PIB, população, PIB per capita, Gini, IDH | ✅ feito |
| 🟢 **B** · O Tesouro | o título do Tesouro com cupom, vencimento e calote; a dívida pública em reais | ✅ feito (o título da empresa espera o caixa dela, I-11) |
| 🟡 **C** · A coroa recebe | dotação da Casa Real que sai do Tesouro; a ilha soberana com população, PIB e imposto | precisa do Tesouro (B) e do país em números (A) |
| 🟣 **D** · O Estado pesquisa | quem governa decide quanto do orçamento vai para P&D; a pesquisa vira cura, satélite, patente | precisa do orçamento (B) |
| 🟣 **E** · Defesa | forças armadas com custo e capacidade; guerra como processo, com custos e consequências | precisa do orçamento (B) e do mundo lá fora (já feito) |

## 🎮 O que o jogo tem

<details open>
<summary><b>👶 A vida</b></summary>

- Nascer numa cidade brasileira, em 8 classes sociais (do barraco ao trilionário), 4 tipos de família e 9 linhagens (família real, Regime, futebol, circo, agro, políticos…), ou criar o personagem escolhendo tudo
- Primeira infância com causa e efeito: o que acontece até os 4 anos volta dos 5 aos 12
- ENEM, curso, 49 profissões com cargos e promoção, concurso, aposentadoria
- Família viva: mãe, pai, avó, amigo, amor e até quatro filhos, cada um com saúde, dinheiro, jeito e vínculo, que envelhecem, adoecem, ajudam ou atrapalham
- Fichas de ação por ano: estudar, trabalhar, cuidar da saúde, ver a família, sair, poupar
</details>

<details>
<summary><b>💸 O dinheiro</b></summary>

- Carteira em cinco classes (renda fixa, ações, fundos imobiliários, dólar, cripto), três perfis de investidor e o padrão de vida escolhido
- Toda dívida é um contrato com o banco: cheque especial, empréstimo, financiamento com garantia e acordo. Atrasar suja o nome, e o imóvel financiado vai a leilão
- Emprestar ao governo: o título do Tesouro paga cupom todo ano, vence ou é vendido pelo preço do dia, e o calote leva parte dele
- 30 bens: morar, alugar, financiar, imóveis de renda, carros, iate, jatinho, emissora de TV
- Até cinco empresas, com subsidiárias, fusões, bolsa e a mesa de quem manda
- Brincar de deus: 14 jogadas bilionárias, de uma estátua a uma colônia em Marte
- Todo real tem contraparte: o extrato do ano e o da vida fecham entrada por entrada
</details>

<details>
<summary><b>🏛️ O país e o mundo</b></summary>

- O país vivo: crescimento, desemprego, inflação, juros, dívida, pobreza, violência, saúde e educação públicas, aprovação, PIB, população, PIB per capita, Gini, IDH e a dívida pública em reais
- Quatro blocos políticos fictícios e o Regime; eleições a cada quatro anos; o seu voto pesa
- Ser vereador, prefeito, deputado, governador, senador, presidente, monarca ou chefe do Regime; quem governa muda as políticas do país
- Quatro países fictícios lá fora, com o dólar, sanções, acordos e atos de quem governa
</details>

<details>
<summary><b>🏰 A dinastia</b></summary>

- Ao morrer, o cartão mostra os três pontos de virada da vida, para compartilhar
- A história continua com quem herda: filho, sobrinho, o par ou um amigo, pelo testamento escolhido em vida
- Sem testamento, os filhos dividem a herança
</details>

## 🚧 O que o jogo ainda não tem

- 🏢 O título do Tesouro comprado pela empresa (precisa do caixa da empresa) e o orçamento do governo item por item
- 👑 Renda para quem é soberano de uma ilha, e a coroa paga pelo Estado (bloco C)
- 🔬 Pesquisa e desenvolvimento pagos pelo Estado (bloco D)
- 🛡️ Forças armadas e guerra (bloco E)
- 💔 O ex que continua existindo depois do fim do namoro, e as relações entre os personagens (a mãe com o pai, o amigo com o par)
- 💬 Conversar com as pessoas com as suas palavras
- ✈️ Morar em outro país
- 🚔 Crime com consequência
- 🗺️ Setores da economia por estado

Todas as ideias, com o que cada uma precisa antes, estão em [`docs/ideias.md`](docs/ideias.md). A ordem está em [`docs/roteiro.md`](docs/roteiro.md).

---

## 📖 Sobre o jogo

Uma vida inteira em poucos minutos, no celular. Você nasce numa cidade brasileira (ou num palácio, num Brasil onde a monarquia venceu o plebiscito), aperta **+1 ano** e responde ao que a vida joga na sua frente: ENEM, primeiro emprego, cartão de crédito, concurso, Pix suspeito, aposentadoria. A cada ano você escolhe o que fazer, tenta a profissão que quiser, compra imóveis, carros, iate ou uma emissora de TV, abre empresa e compra concorrentes, disputa eleições e escolhe quem herda tudo. Cada escolha deixa uma marca, e algumas voltam décadas depois. Ao morrer, o jogo mostra os três pontos de virada da sua vida num cartão que dá para compartilhar, e a história pode continuar com quem herdou.

## 🛠️ Rodar

Precisa de Node 22.18 ou mais novo.

```sh
npm install
npm run dev        # jogo em http://localhost:5173
npm run verificar  # tipos, testes, validador de conteúdo, túnel de vento e build
```

Outros comandos: `npm run validar` (só o conteúdo), `npm run tunel` (10.000 vidas simuladas → `docs/metricas.md`), `npm run vida -- 42 aleatoria` (imprime uma vida inteira jogada por um robô) e `npm run telas -- URL` (a régua da tela: 52 critérios de interface em sete tamanhos de tela e letra, contra a build no ar).

Para escrever eventos, veja [`docs/conteudo.md`](docs/conteudo.md). O método de trabalho e as regras do projeto estão em [`CLAUDE.md`](CLAUDE.md).
