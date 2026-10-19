# 🎲 Trajetória

[![CI e deploy](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml)
[![App Android](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml)
![Atualização](https://img.shields.io/badge/atualiza%C3%A7%C3%A3o-V1%3A%20a%20cara%20nova-D9A321)
![Histórias](https://img.shields.io/badge/hist%C3%B3rias-743-2EA043)
![Vidas testadas](https://img.shields.io/badge/t%C3%BAnel-10.000%20vidas%20por%20push-1F6FEB)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B)

## 📱 [Baixar o app para Android (APK)](https://github.com/Lhordriyon/Calculadora-Viva/releases/download/android/Trajetoria.apk)

## 🌐 [Jogar no navegador](https://lhordriyon.github.io/Calculadora-Viva/)

**Instalar no Android:** toque no link acima pelo celular, abra o arquivo `Trajetoria.apk` quando o download terminar e confirme. Se o Android pedir, permita que o navegador instale apps ("fontes desconhecidas"). Para atualizar, baixe de novo e instale por cima: a vida salva continua. O APK é gerado de novo a cada atualização do jogo ([página da versão](https://github.com/Lhordriyon/Calculadora-Viva/releases/tag/android)).

---

## 🆕 Novidades: Bloco V1 · A cara nova (19/10/2026)

<p align="center">
  <img src="docs/imagens/tela-escura.png" alt="A tela principal no tema escuro: a marca Trajetória em ouro, o retrato com as iniciais e uma coroa, a economia aquecida, os quatro indicadores em cartões coloridos, o dinheiro em três cartões, a história do ano e os seis verbos com ícone, e o botão dourado Viver mais 1 ano" width="290" />
  &nbsp;
  <img src="docs/imagens/tela-clara.png" alt="A mesma tela no tema claro, em papel creme com ouro velho" width="290" />
</p>

> [!TIP]
> **Para ver:** é só abrir o jogo. O tema segue o do celular (escuro ou claro). O primeiro dia de escola, aos 5 ou 6 anos, já aparece como **marco da trajetória**, no cartão dourado da linha do tempo; depois vêm o ENEM, o primeiro emprego, a formatura e a aposentadoria. Quem nasce na família real ou no Regime, chega ao trono ou passa de R$ 1 bilhão ganha a coroa no retrato.

Inspirada no mockup que o dono mandou: fundo azul-noite com ouro, os indicadores em cartões, o dinheiro em cartões, os verbos com ícone e o botão dourado. A linha do tempo continua no meio da tela, porque ela é a história.

| ✅ O que esta atualização trouxe | ⏳ O que ela ainda não trouxe |
|---|---|
| 🌙 **Tema noite e ouro** nos dois modos: azul-noite com ouro no escuro, papel creme com ouro velho no claro | 📷 **Foto no retrato:** o retrato mostra as iniciais (o jogo não tem imagens de pessoas) |
| 🏷️ **Barra da marca** com o símbolo e "sua vida, suas escolhas"; símbolo e ícones do app em ouro | 🍩 **A rosca do patrimônio** (de que é feito o dinheiro): fica para a folha Dinheiro |
| 👤 **Retrato** com as iniciais e o aro dourado; **coroa** para a realeza, o Regime, o trono e quem tem bilhão | ⚙️ Um botão para **escolher o tema** dentro do jogo (hoje segue o celular) |
| 📈 **Selo da economia** (aquecida, normal, recessão, crise) com o ano; tocar abre o país | 📱 O **ícone do app Android** instalado continua o antigo (só o do navegador mudou) |
| ❤️ **Saúde, felicidade, inteligência e aparência** em cartões com ícone, cor e barra | |
| 💰 **Dinheiro, patrimônio e renda** em três cartões; o cargo aparece no cartão da renda; a dívida, em vermelho | |
| 🧭 **Suas escolhas:** os seis verbos com ícone e cor, e o ponto dourado no que é novo | |
| 👑 **Marco da trajetória:** o primeiro dia de escola, o ENEM, o primeiro emprego, a aposentadoria… ganham o cartão dourado na própria história | |
| ⏩ **Viver mais 1 ano** em ouro, sempre no polegar | |
| 🔠 **Letra grande:** com a fonte do celular aumentada, os indicadores vão para uma linha e os nomes aparecem inteiros | |
| ✨ O acabamento do pacote visual que o dono mandou: fio de ouro no evento, opções mais táteis, folhas com alça, telas baixas mais justas | |

**Medido no navegador** (a altura que sobra para a linha do tempo, a história):

| Tela | Antes | Agora |
|---|---|---|
| 📱 Celular comum (390 × 844), 4 verbos | 419 px | 342 px |
| 📱 Celular comum, 6 verbos | 352 px | 288 px |
| 🔠 Celular pequeno (360 × 760) com a letra em 145%, 6 verbos | 152 px | 166 px |

Nenhuma rolagem para o lado, nenhum alvo de toque abaixo de 44 px e nenhum erro no console, nos dois temas. O motor não mudou: o túnel de vento dá as mesmas vidas. O histórico de atualizações está no [📜 CHANGELOG](CHANGELOG.md).

## 🗺️ Os próximos blocos

Pedidos do dono em 19/10, em blocos pequenos, na ordem em que um precisa do outro (a cara nova, V1, entrou no meio, a pedido dele):

```mermaid
flowchart LR
  A["🇧🇷 A · O país em números<br/>PIB, população, Gini, IDH"]:::feito --> B["🏛️ B · O Tesouro<br/>orçamento e títulos com juros"]:::proximo
  B --> C["👑 C · A coroa recebe<br/>dotação e imposto da ilha"]:::depois
  B --> D["🔬 D · O Estado pesquisa<br/>pesquisa paga pelo Tesouro"]:::depois
  B --> E["🛡️ E · Defesa<br/>forças armadas e guerra"]:::depois
  classDef feito fill:#2ea043,stroke:#1a7f37,color:#fff
  classDef proximo fill:#bf8700,stroke:#9a6700,color:#fff
  classDef depois fill:#8250df,stroke:#6639ba,color:#fff
```

| Bloco | O que entra | Por que nesta ordem |
|---|---|---|
| 🟢 **A** · O país em números | PIB, população, PIB per capita, Gini, IDH | ✅ feito |
| 🟡 **B** · O Tesouro | o orçamento do governo em reais; comprar títulos que pagam cupom na conta ou no caixa da empresa | quem paga a coroa, a pesquisa e o exército é o Tesouro |
| 🟣 **C** · A coroa recebe | dotação da Casa Real que sai do Tesouro; a ilha soberana com população, PIB e imposto | precisa do Tesouro (B) e do país em números (A) |
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
- 30 bens: morar, alugar, financiar, imóveis de renda, carros, iate, jatinho, emissora de TV
- Até cinco empresas, com subsidiárias, fusões, bolsa e a mesa de quem manda
- Brincar de deus: 14 jogadas bilionárias, de uma estátua a uma colônia em Marte
- Todo real tem contraparte: o extrato do ano e o da vida fecham entrada por entrada
</details>

<details>
<summary><b>🏛️ O país e o mundo</b></summary>

- O país vivo: crescimento, desemprego, inflação, juros, dívida, pobreza, violência, saúde e educação públicas, aprovação, e agora PIB, população, PIB per capita, Gini e IDH
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

- 🏛️ Tesouro com orçamento em reais e títulos públicos (bloco B)
- 👑 Renda para quem é soberano de uma ilha, e a coroa paga pelo Estado (bloco C)
- 🔬 Pesquisa e desenvolvimento pagos pelo Estado (bloco D)
- 🛡️ Forças armadas e guerra (bloco E)
- 💔 O ex que continua existindo depois do fim do namoro, e as relações entre os personagens
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

Outros comandos: `npm run validar` (só o conteúdo), `npm run tunel` (10.000 vidas simuladas → `docs/metricas.md`), `npm run vida -- 42 aleatoria` (imprime uma vida inteira jogada por um robô).

Para escrever eventos, veja [`docs/conteudo.md`](docs/conteudo.md). O método de trabalho e as regras do projeto estão em [`CLAUDE.md`](CLAUDE.md).
