# 🎲 Trajetória

[![CI e deploy](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml)
[![App Android](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml)
![Atualização](https://img.shields.io/badge/atualiza%C3%A7%C3%A3o-H%3A%20a%20empresa%20de%20verdade-D9A321)
![Histórias](https://img.shields.io/badge/hist%C3%B3rias-909-2EA043)
![Vidas testadas](https://img.shields.io/badge/t%C3%BAnel-10.000%20vidas%20por%20push-1F6FEB)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B)

## 📱 [Baixar o app para Android (APK)](https://github.com/Lhordriyon/Calculadora-Viva/releases/download/android/Trajetoria.apk)

## 🌐 [Jogar no navegador](https://lhordriyon.github.io/Calculadora-Viva/)

**Instalar no Android:** toque no link acima pelo celular, abra o arquivo `Trajetoria.apk` quando o download terminar e confirme. Se o Android pedir, permita que o navegador instale apps ("fontes desconhecidas"). Para atualizar, baixe de novo e instale por cima: a vida salva continua. O APK é gerado de novo a cada atualização do jogo ([página da versão](https://github.com/Lhordriyon/Calculadora-Viva/releases/tag/android)).

---

## 🆕 Novidades: H · A empresa de verdade (01/11/2026)

> [!IMPORTANT]
> **O que mudou:** a empresa deixou de ser um número que sobe e virou um negócio, como você pediu.
> - **Caixa de verdade.** Cada real diz de onde veio e para onde foi: as vendas, os custos, o imposto (25% do lucro, para o governo), os dividendos, a obra. Faltou caixa, a empresa vende estrutura pela metade do que custou; dois anos seguidos no prejuízo sem caixa, e ela quebra (a folha avisa no primeiro).
> - **Produto e mercado.** A empresa tem clientela (o que o mercado quer comprar dela), estrutura (o que ela entrega), qualidade e marca. Você decide o preço, o salário, quanto vai para marketing e P&D, ampliar (a obra fica pronta no ano seguinte), cortar e demitir, exportar e quanto do lucro sai de dividendo.
> - **O mundo reage.** Os empregos que ela abre baixam o desemprego da sua cidade, e a sua família sente; o imposto baixa a dívida do país; o dólar alto enche o caixa de quem exporta e encarece o de quem importa; a sanção de um país fecha a sua exportação, com a notícia e a causa; a sua fama puxa a marca.
> - **O que você tem rende.** Rádio, jornal e emissora vendem publicidade e dão influência; o aluguel sente o desemprego.
> - **15 histórias do negócio** que leem o estado real (a fila de pedidos, a estrutura parada, a greve do piso, o recall, o primeiro container, a licitação de quem tem cargo…). As antigas da empresa agora mexem no caixa e na estrutura, e não num número que voltava sozinho.

> [!TIP]
> **Para testar:**
> - Abra uma empresa na folha Dinheiro, passe um ano e leia o resultado: vendas, lucro, imposto e caixa.
> - Ponha o preço no premium com a qualidade baixa e veja a clientela fugir; invista em P&D e tente de novo.
> - Quando o mercado pedir mais do que a estrutura entrega, amplie: a obra sai do caixa e fica pronta no ano seguinte.
> - Abra exportação para um país; se vier uma sanção, a notícia aponta a causa.
> - Compre uma rádio e veja a publicidade cair na conta e a influência subir.

| ✅ O que o bloco trouxe | ⏳ O que ele ainda não trouxe |
|---|---|
| 💰 Caixa, resultado do ano e dividendos tirados do lucro | 🏦 A empresa pegar empréstimo no banco (hoje, quem deve é você) |
| 🏭 Clientela, estrutura com obra, preço, salário, qualidade, marca, marketing e P&D | 🤝 O lobby e o conselho que propõe com base nos números |
| 📉 A quebra por causa: 22,8% de quem abre empresa (era 29% por sorteio) | 🏬 Fábricas e lojas como lugares (hoje são a estrutura) |
| 🌍 O dólar, a exportação e a sanção no caixa | |
| 👷 Os empregos no desemprego da cidade; o imposto na dívida do país | |
| 📻 A mídia que vende publicidade e dá influência; o aluguel com vacância | |

No túnel de vento (10.000 vidas), as contas fecharam em todas as 4,09 milhões de entradas, agora com o caixa das empresas dentro. A bolsa voltou a mexer no valor de quem está nela (correlação 0,44, contra 0,00 das fechadas), e o dólar divide os setores (+0,34 no agro, −0,39 no comércio). O bilionário feito ficou mais raro (0,59%, eram 0,81%). A variedade ficou onde estava: saturação de 52,5% na 5ª vida e de 87,7% na 20ª, com 909 histórias por 1.000 vidas (eram 913). Os toques foram a 478,6 por vida (eram 464). A CPU ficou em 124 ms por vida (eram 125). A atualização anterior, o salto Ω, está no [`CHANGELOG.md`](CHANGELOG.md).

## 🗺️ Os blocos do dono

Pedidos do dono em 19/10, em blocos pequenos, na ordem em que um precisa do outro. A cara nova (V1) e a correção dela (C1 a C3) entraram no meio, a pedido dele. Os cinco estão feitos; seguem o bloco B2 (o título comprado pela empresa e o orçamento do governo item por item) e a identidade das pessoas (o ex que continua existindo):

```mermaid
flowchart LR
  A["🇧🇷 A · O país em números<br/>PIB, população, Gini, IDH"]:::feito --> B["🏛️ B · O Tesouro<br/>títulos, cupom e calote"]:::feito
  B --> C["👑 C · A coroa recebe<br/>a forma da coroa e a ilha"]:::feito
  B --> D["🔬 D · O Estado pesquisa<br/>ciência, tecnologia e descobertas"]:::feito
  B --> E["🛡️ E · Defesa<br/>forças armadas e guerra"]:::feito
  classDef feito fill:#2ea043,stroke:#1a7f37,color:#fff
  classDef proximo fill:#bf8700,stroke:#9a6700,color:#fff
  classDef depois fill:#8250df,stroke:#6639ba,color:#fff
```

| Bloco | O que entra | Por que nesta ordem |
|---|---|---|
| 🟢 **A** · O país em números | PIB, população, PIB per capita, Gini, IDH | ✅ feito |
| 🟢 **B** · O Tesouro | o título do Tesouro com cupom, vencimento e calote; a dívida pública em reais | ✅ feito (o título da empresa espera o caixa dela, I-11) |
| 🟢 **C** · A coroa recebe | o salário, a parte dos impostos ou a taxa da coroa; a ilha com população, PIB e imposto | ✅ feito |
| 🟢 **D** · O Estado pesquisa | a ciência paga pelo Tesouro, a tecnologia do país e as descobertas (a cura, o satélite, a patente) | ✅ feito |
| 🟢 **E** · Defesa | forças armadas com custo e capacidade; os sistemas de armamento; a guerra como processo, com custos e consequências | ✅ feito (a ocupação e as alianças militares ficam para depois) |

### A segunda lista do dono (26/10)

A lista nova não cabe de uma vez. A ordem começa pelos defeitos (o que já existe e não funciona) e segue pelo que mais muda o que dá para fazer numa vida, um bloco publicado de cada vez. As ideias de cada um estão em [`docs/ideias.md`](docs/ideias.md) (a seção "A segunda ordem do dono").

```mermaid
flowchart LR
  F["👑 F · O poder que passa<br/>sucessão, golpe, governo vitalício"]:::feito --> F2["🏝️ F2 · Governar o que você fundou<br/>a ilha e a cidade"]:::proximo
  F2 --> C4["✍️ C4 · O texto revisado"]:::depois
  C4 --> K["👶 K · Filhos quando quiser"]:::depois
  K --> I["💰 I · O dinheiro que rende"]:::depois
  I --> H["🏭 H · A empresa de verdade"]:::feito
  H --> J["🧬 J · A vida longa"]:::depois
  classDef feito fill:#2ea043,stroke:#1a7f37,color:#fff
  classDef proximo fill:#bf8700,stroke:#9a6700,color:#fff
  classDef depois fill:#8250df,stroke:#6639ba,color:#fff
```

| Bloco | O que entra | Estado |
|---|---|---|
| 🟢 **F** · O poder que passa | a sucessão da coroa, do Regime e da ilha para quem herda (com a regência); o golpe, o autogolpe e a coroa restaurada; quem vai reinar na ilha deixa o Brasil; o resgate do país como título | ✅ feito |
| 🟡 **F2** · Governar o que você fundou | a ilha e a cidade como territórios, com imposto e obras pagas do próprio bolso | ⏭️ próximo |
| 🟣 **C4** · O texto revisado | a varredura de gramática do conteúdo inteiro, com regras novas no validador | depois |
| 🟣 **K** · Filhos quando quiser | tentar ter filho, adotar e planejar, com a fertilidade pela idade | depois |
| 🟣 **I** · O dinheiro que rende | os bens que produzem, a carteira de dívidas do SPC e do Serasa como ativo, o empréstimo aos bancos como contrato | depois |
| 🟢 **H** · A empresa de verdade | o caixa da empresa, o lucro com origem, a pesquisa e desenvolvimento, as fábricas e lojas | ✅ feito (01/11, antes do F2, a seu pedido): o caixa, o produto, o mercado e a quebra por causa |
| 🟣 **J** · A vida longa | a ciência da longevidade, com etapas até a reversão do envelhecimento e a continuidade do eu | depois |
| 🟣 **G**, **L**, **M**, **P**, **N** | os impostos um por um; a escola inteira e mais profissões; a civilização; os gráficos; as formas de governo | depois |
| ⚪ **O** · O mundo | o mapa-múndi e os países de verdade | pede a sua decisão: hoje governos, partidos e países são fictícios por requisito seu |

## 🎮 O que o jogo tem

<details open>
<summary><b>👶 A vida</b></summary>

- Nascer numa cidade brasileira, em 8 classes sociais (do barraco ao trilionário), 4 tipos de família e 9 linhagens (família real, Regime, futebol, circo, agro, políticos…), ou criar o personagem escolhendo tudo
- Primeira infância com causa e efeito: o que acontece até os 4 anos volta dos 5 aos 12
- ENEM, curso, 49 profissões com cargos e promoção, concurso, aposentadoria
- Família viva: mãe, pai, avó, amor e até quatro filhos, cada um com saúde, dinheiro, jeito e vínculo, que envelhecem, adoecem, ajudam ou atrapalham
- Gente com identidade: os irmãos, o ex que pode voltar, o colega e o chefe que vêm com o emprego, os amigos de infância e os da vida adulta; cada pessoa lembra do que você fez e tem opinião sobre você
- A pessoa decide: quem responde a um pedido pesa o que viveu com você e diz por quê; o empréstimo entre pessoas é contrato, com parcela, atraso e calote
- Os planos: a casa própria, sair das dívidas, um filho, o negócio, reparar uma relação, com etapas que são a vida de verdade
- Os segredos: o caso, a dívida escondida, a festa que era estudo, o esquema no trabalho; a fofoca que corre, a chantagem e a revelação
- Fichas de ação por ano: estudar, trabalhar, cuidar da saúde, ver a família, sair, poupar
</details>

<details>
<summary><b>💸 O dinheiro</b></summary>

- Carteira em cinco classes (renda fixa, ações, fundos imobiliários, dólar, cripto), três perfis de investidor e o padrão de vida escolhido
- Toda dívida é um contrato com o banco: cheque especial, empréstimo, financiamento com garantia e acordo. Atrasar suja o nome, e o imóvel financiado vai a leilão
- Emprestar ao governo: o título do Tesouro paga cupom todo ano, vence ou é vendido pelo preço do dia, e o calote leva parte dele
- 30 bens: morar, alugar, financiar, imóveis de renda, carros, iate, jatinho, emissora de TV
- Até cinco empresas que são negócios: caixa, clientela, estrutura com obra, preço, salário, qualidade, marca, marketing, P&D, exportação e quebra por causa; com subsidiárias, fusões, bolsa e a mesa de quem manda
- Brincar de deus: 14 jogadas bilionárias, de uma estátua a uma colônia em Marte, e a ilha que vira país, com população, PIB e coroa
- Todo real tem contraparte: o extrato do ano e o da vida fecham entrada por entrada
</details>

<details>
<summary><b>🏛️ O país e o mundo</b></summary>

- O país vivo: crescimento, desemprego, inflação, juros, dívida, pobreza, violência, saúde e educação públicas, tecnologia, aprovação, PIB, população, PIB per capita, Gini, IDH e a dívida pública em reais
- A ciência paga pelo Tesouro: a tecnologia do país vira crescimento, saúde e empresas, e descoberta (a cura, o satélite, a patente)
- As Forças Armadas com custo e capacidade, os sistemas de armamento e a guerra como processo: ela começa com quem sanciona e anda frio, custa todo ano e acaba em vitória, derrota ou cessar-fogo
- Quatro blocos políticos fictícios e o Regime; eleições a cada quatro anos; o seu voto pesa
- Ser vereador, prefeito, deputado, governador, senador, presidente, monarca ou chefe do Regime; quem governa muda as políticas do país
- A coroa, o Regime e a ilha passam a quem herda (com a regência até os 18); o poder também se toma: o autogolpe, o golpe e a coroa restaurada no plebiscito
- Quatro países fictícios lá fora, com o dólar, sanções, acordos e atos de quem governa
</details>

<details>
<summary><b>🏰 A dinastia</b></summary>

- Ao morrer, o cartão mostra os três pontos de virada e os capítulos da vida, para compartilhar
- O caminho não tomado: em cada ponto de virada que foi escolha sua, o cartão mostra a vida que você não viveu
- A história continua com quem herda: filho, sobrinho, o par ou um amigo, pelo testamento escolhido em vida
- Sem testamento, os filhos dividem a herança
</details>

## 🚧 O que o jogo ainda não tem

- 🏢 O título do Tesouro comprado pela empresa (o caixa dela já existe), a empresa que pega empréstimo no banco e o orçamento do governo item por item
- ⚖️ A legitimidade de quem governa medida à parte da popularidade
- 🛡️ A ocupação de território, as alianças militares e a guerra entre os países de fora
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
