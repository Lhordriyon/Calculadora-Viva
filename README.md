# 🎲 Trajetória

[![CI e deploy](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/ci.yml)
[![App Android](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml/badge.svg)](https://github.com/Lhordriyon/Calculadora-Viva/actions/workflows/android.yml)
![Atualização](https://img.shields.io/badge/atualiza%C3%A7%C3%A3o-Ascens%C3%A3o%20AAA-D9A321)
![Histórias](https://img.shields.io/badge/hist%C3%B3rias-903-2EA043)
![Vidas testadas](https://img.shields.io/badge/t%C3%BAnel-10.000%20vidas%20por%20push-1F6FEB)
![Idioma](https://img.shields.io/badge/idioma-pt--BR-009C3B)

## 📱 [Baixar o app para Android (APK)](https://github.com/Lhordriyon/Calculadora-Viva/releases/download/android/Trajetoria.apk)

## 🌐 [Jogar no navegador](https://lhordriyon.github.io/Calculadora-Viva/)

**Instalar no Android:** toque no link acima pelo celular, abra o arquivo `Trajetoria.apk` quando o download terminar e confirme. Se o Android pedir, permita que o navegador instale apps ("fontes desconhecidas"). Para atualizar, baixe de novo e instale por cima: a vida salva continua. O APK é gerado de novo a cada atualização do jogo ([página da versão](https://github.com/Lhordriyon/Calculadora-Viva/releases/tag/android)).

---

## 🆕 Novidades: O universo que não explode (16/11/2026)

> [!IMPORTANT]
> **O que mudou:** você mostrou um PIB de R$ 51 mil trilhões e uma holding de R$ 5 mil trilhões. A auditoria achou as causas (o PIB crescia 2% ao ano para sempre, a população sumia, o salário era o de 2026 num país milhares de vezes mais rico e o caixa da holding rendia sem teto). Esta atualização corrigiu a economia de longo prazo e criou uma bancada que joga a mesma família por até 100 gerações para provar.
> - **O país cresce para um lugar.** O que cada pessoa produz persegue uma renda que anda com o mundo, e o mundo desacelera: em 100 gerações, o PIB per capita fica entre 2,5 e 17 vezes o de hoje (antes: 10³¹ vezes).
> - **A população para de sumir.** Com menos gente do que o país já teve, as famílias voltam a crescer: ela fica entre 100 e 120 milhões (antes: 7.515 pessoas em 100 gerações).
> - **O salário anda com o país.** Quem é contratado, eleito ou herda o trabalho ganha de acordo com o que cada pessoa do país produz.
> - **A holding rende dentro do mercado.** O mercado comporta 43% do PIB de um dono só, dividido entre a sua carteira e o caixa que a dupla do valor aplica (cripto e fundos imobiliários, 3% cada); o que passa disso e o caixa parado das empresas perdem a inflação, como a sua conta.
> - **Nada compõe para sempre.** A ilha que você funda e os bens (a arte, os imóveis) também ganharam limite: antes, um bem chegava a valer 3 PIBs.
> - **O dinheiro existe entre gerações.** Quem herda continua no mesmo país: as contas dos bancos e do governo passam inteiras (antes, a herança grande jogava o país numa depressão sem causa).
> - **O ciclo é do país.** Num Brasil que envelhece, crescer 1% é um ano normal: o salário, as empresas e a aprovação do governo medem contra a tendência; e a economia aquecida é crescer acima do potencial.

> [!TIP]
> **Para testar:** jogue uma dinastia de três ou quatro gerações e abra a folha País em cada uma: o PIB, a população e o PIB per capita continuam do tamanho de um país. Com a holding e a dupla, veja na linha do tempo quanto o caixa aplicado rendeu e se o mercado comportou tudo.

| ✅ O que a atualização trouxe | ⏳ O que ela ainda não trouxe |
|---|---|
| 📏 A bancada de dinastias (até 100 gerações), no CI | 🧠 A rede neural: a próxima etapa é um explorador da bancada (sem servidor, não há dados de jogadores) |
| 🌍 PIB, população e salário com escala de país | 🏆 Histórias para quem passou de R$ 1 trilhão |
| 💼 A holding rendendo dentro do mercado | 🏠 O limite dos imóveis que as dinastias acumulam |
| 🔢 Nenhum número acima de 2^53 em 100 gerações | 📉 Mais recessões no fim do século (o Brasil envelhece): medir se cansa |

No túnel de vento (10.000 vidas), nenhuma história morta, as contas e as dívidas fechando e nenhum portão novo falhando: saturação V5 52,4% → 53,6%, assinaturas 904 → 905, toques 483,7 → 485,2, CPU 184 → 182 ms por vida. As fases de uma vida mudaram: normal 64% → 50%, aquecida 23% → 27%, recessão 10% → 18%, crise 2% → 5% (o Brasil real teve o PIB caindo em 21% dos anos de 1981 a 2023). Na bancada de dinastias (27 de 12 gerações e 9 de 100), nenhum invariante de escala quebra; antes, a precisão, o resíduo do dinheiro, o PIB per capita, o salário, a população e as contas quebravam.

O relatório completo, com as fórmulas de antes e de depois: [`docs/relatorio-etapa-02.md`](docs/relatorio-etapa-02.md).

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
- Os sonhos: aos 15, virar estrela, construir um império ou governar o país; no amor, a casa cheia ou um amor para a vida toda; na segunda metade, a fortuna, o lugar no mundo, a volta ao mundo e os netos; cada um com cenas próprias, as etapas na linha do tempo, o dia em que chega, o "e agora?" depois e a pasta do sonho para quem herda
- Os segredos: o caso, a dívida escondida, a festa que era estudo, o esquema no trabalho; a fofoca que corre, a chantagem e a revelação
- Fichas de ação por ano: estudar, trabalhar, cuidar da saúde, ver a família, sair, poupar
</details>

<details>
<summary><b>💸 O dinheiro</b></summary>

- Carteira em cinco classes (renda fixa, ações, fundos imobiliários, dólar, cripto), três perfis de investidor e o padrão de vida escolhido
- Toda dívida é um contrato com o banco: cheque especial, empréstimo, financiamento com garantia e acordo. Atrasar suja o nome, e o imóvel financiado vai a leilão
- Emprestar ao governo: o título do Tesouro paga cupom todo ano, vence ou é vendido pelo preço do dia, e o calote leva parte dele
- 30 bens: morar, alugar, financiar, imóveis de renda, carros, iate, jatinho, emissora de TV
- O dinheiro que existe: as contas do país com saldo, o crédito que cria dinheiro, a emissão do Banco Central e a inflação que vem do dinheiro que sobra
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

- 🏢 O título do Tesouro comprado pela empresa e o orçamento do governo item por item
- 📦 Vários produtos dentro da mesma empresa, o estoque das unidades e os executivos com nome
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
npm run verificar  # tipos, testes, validador de conteúdo, auditoria, túnel de vento e build
```

Outros comandos: `npm run validar` (só o conteúdo), `npm run tunel` (10.000 vidas simuladas → `docs/metricas.md`), `npm run vida -- 42 aleatoria` (imprime uma vida inteira jogada por um robô) `npm run auditoria` (a integridade da simulação, ano a ano, em dinastias) e `npm run telas -- URL` (a régua da tela: 58 critérios de interface em sete tamanhos de tela e letra, contra a build no ar).

Para escrever eventos, veja [`docs/conteudo.md`](docs/conteudo.md). O método de trabalho e as regras do projeto estão em [`CLAUDE.md`](CLAUDE.md).
