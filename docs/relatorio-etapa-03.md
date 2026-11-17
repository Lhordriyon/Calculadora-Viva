# Etapa 03 · O observatório de jogadores

17/11/2026. O pedido: um sistema que observe como cada perfil de jogador usa o jogo, encontre o que normalmente passa despercebido (as fortunas fora do comum, os conglomerados, o poder político e a coroa, as dinastias, as estratégias dominantes, o conteúdo que acaba, as situações incoerentes) e explique, com evidência, sem servidor, sem dados inventados e sem mudar a simulação.

Antes de começar, li a auditoria da etapa 01 (`docs/auditoria-neural.md`) e o relatório da etapa 02 (`docs/relatorio-etapa-02.md`). Dois pontos de lá guiaram esta etapa:

- **A-04** ("acima de R$ 1 trilhão não há o que fazer") era uma hipótese tirada da contagem dos storylets. O observatório mede isso pelo que acontece na vida: o índice de saturação e o sistema que deixa de servir (seção 4).
- **A rede neural não tem dados de jogadores** (sem servidor, por regra do dono). Esta etapa não treina nada. Ela observa robôs na bancada e, no aparelho, quem joga, com a observação guardada só ali e exportada só por vontade de quem joga.

Nada desta etapa foi publicado como comportamento de pessoas: todo número da seção 4 é de robôs, e o relatório diz isso na primeira linha.

---

## 1. A arquitetura

```
                 o jogo (interface)            a bancada (scripts/observatorio.ts)
                        │                                   │
           comandos gravados (Ω5)                 robôs do túnel jogando
                        │                                   │
                        ▼                                   ▼
          ┌──────────────────────────── caminho.ts › aplicarComando ───────────────────────────┐
          │                      (o mesmo motor, sem nenhuma linha mudada)                     │
          └────────────────────────────────────────────────────────────────────────────────────┘
                        ▲ lê antes e depois de cada comando (nunca escreve, nunca sorteia)
                        │
              src/motor/observacao.ts ── Registro (cada decisão) + FotoDoAno (cada ano)
                        │
        ┌───────────────┼─────────────────┬──────────────────────┐
        ▼               ▼                 ▼                      ▼
   perfis.ts       extremos.ts       saturacao.ts          inteligencia.ts
 (10 perfis por   (10 medidas      (7 componentes, o      (o relatório: fatos e
  janela de 10     relativas)        índice e o sistema     hipóteses, confiança,
  anos)                              que deixa de servir)   exemplos reproduzíveis)
        │                                                        │
        ▼                                                        ▼
 src/jogo/observacao.ts (no aparelho, à parte do save)     docs/observatorio.md
 src/ui/Observacao.tsx (o menu: o seu jeito de jogar)      (ou dist-observatorio.md, de um arquivo)
 src/jogo/formato-da-observacao.ts (o arquivo exportado)
```

### 1.1 A telemetria (`src/motor/observacao.ts`)

**O registro de cada comando.** Para toda decisão (escolha num evento, ação de uma ficha, operação de folha, passar o ano), o observador guarda:

- o ano, a idade, o tipo e a referência (o id do storylet, o verbo e a ação, a operação);
- a área principal e as áreas que as entradas do ano dele mexeram (21 áreas);
- **as opções na mesa**: quantas, quantas disponíveis, qual foi a escolhida e o motivo das bloqueadas;
- as fichas que sobraram ao passar o ano (a situação "sem opção relevante" aparece como ano passado com fichas livres e como evento com uma opção só);
- o patrimônio antes e a consequência: o que mudou no patrimônio, na felicidade, na influência e quantas entradas o livro ganhou;
- as referências das entradas (o que o comando causou).

**A foto de cada ano**, com o contexto temporal e o estado do mundo:

- o patrimônio por bolso (a conta, o aplicado, os títulos, os bens, as empresas), a dívida, a renda e o custo;
- as empresas, as subsidiárias, as holdings, os funcionários, o peso do grupo no PIB, a maior fatia de um mercado e a maior concorrente;
- as três esferas da influência; o cargo, a coroa e o regime;
- o percentil na régua do Brasil real e o patrimônio sobre o PIB;
- os filhos, os laços fortes, os planos e sonhos de pé e os possíveis, as conquistas;
- o quanto o mercado ainda comporta, as fichas, os eventos mostrados e os repetidos;
- **o que chegou de outras pessoas** (a herança, o fundo da família) e **de onde veio o dinheiro** que entrou (o mercado, o Tesouro, o banco, as pessoas, as empresas, os bens);
- **as oportunidades**: os storylets elegíveis naquele ano, quantos mexem com 1% do patrimônio ou mais, o maior impacto possível e as jogadas ao alcance;
- o mundo: PIB, população, PIB per capita, crescimento, inflação, desemprego, fase e governo.

**A vida observada** tem a versão do formato, a origem (`jogador` ou `robo`), a partida (a família que segue pelos herdeiros), a geração, a semente, o começo e o fim. Não tem nome, sobrenome, cidade nem texto.

**Três maneiras de observar:**

- `jogarObservando`: o robô joga e o observador olha (a bancada);
- `observarGravacao`: refaz uma gravação comando a comando (a vida de quem joga);
- `observarPeloLivro`: sem gravação (um save de antes dela), lê as decisões do livro, sem as opções que estavam na mesa, com uma foto só.

### 1.2 Os perfis (`src/motor/perfis.ts`)

São dez perfis, cada um uma probabilidade própria (a sigmoide de sinais com pesos escritos à mão), com o porquê. Os sinais saem dos registros e das fotos: a parte das decisões numa área, a parte do patrimônio num bolso, os anos com cargo, os funcionários, os filhos, o testamento, as áreas usadas e o equilíbrio entre elas, os anos no aperto.

- Os perfis saem para a vida inteira e **por janela de dez anos**: o perfil muda com a vida.
- Vários convivem: na bancada, 1,8 perfis fortes por vida em média, e o mais forte troca pelo menos uma vez em 90% das vidas.
- O explorador e o generalista se comparam com o esperado para o tempo de vida (calibrado nos robôs).
- O dinheiro da família não faz de ninguém acumulador: o percentil da família até os 30 não conta, e a herança soma à base do crescimento.

### 1.3 Os extremos (`src/motor/extremos.ts`)

São dez medidas relativas, nenhuma em reais fixos, cada uma com dois limiares (notável e extremo) e o porquê ao lado:

| Medida | Notável | Extremo |
|---|---|---|
| percentil da riqueza no Brasil real | 99% | 99,9% |
| patrimônio sobre o PIB | 0,1% | 1% |
| valor adicionado do grupo no PIB | 0,5 ponto | 2 pontos |
| subsidiárias com holding | 3 | 8 |
| maior fatia de um mercado | 25% | 50% |
| anos de poder nacional (cargo, coroa, regime) | 4 | 12 |
| geração que ainda começa no 1% | 3ª | 5ª |
| gerações da família | 4 | 8 |
| áreas do jogo usadas | 70% | 85% |
| quantas vezes o patrimônio cresceu numa década (sem a herança) | 100 | 10.000 |

O crescimento explosivo diz de onde veio a maior parte do dinheiro da década: é a pista para ler o livro.

### 1.4 A saturação (`src/motor/saturacao.ts`)

É um índice por ano, de 0 a 1: a média dos componentes que valem naquele ano.

| Componente | Satura quando | Vale |
|---|---|---|
| escala | nada do que é possível no ano mexe com 1% do patrimônio (zera com 15%) | sempre |
| investimento | o dinheiro aplicado já não cabe no mercado | sempre |
| concorrência | a maior concorrente tem menos de metade da clientela do grupo no setor | com empresa |
| objetivos | não há planos nem sonhos de pé ou por começar (zera com quatro) | a partir dos 16 |
| repetição | os eventos do ano já tinham aparecido | no ano com evento |
| consequência | as decisões grandes dos últimos cinco anos mexem em menos de 0,1% do patrimônio | com decisão grande |
| salário | 30 anos de renda não pagam o patrimônio | com renda |

- **"Não confundir ausência de conteúdo com ausência de notificações":** a escala e as oportunidades leem o que era elegível, não o que apareceu; a repetição só conta no ano com evento.
- **A vida se esgota** quando o índice passa de 0,7 cinco anos seguidos.
- **O sistema deixa de servir** quando um componente passa de 0,7 cinco anos seguidos.

### 1.5 O relatório (`src/motor/inteligencia.ts`, `scripts/observatorio.ts`)

`npm run observatorio` joga uma população fixa de robôs (as mesmas sementes a cada rodada) e escreve `docs/observatorio.md`. Ele tem as nove seções pedidas: comportamentos, estratégias dominantes, sistemas mais usados, sistemas negligenciados, gargalos, incoerências, conteúdo insuficiente, anomalias e oportunidades. Cada item traz:

- se é **fato observado** ou **hipótese**;
- a **confiança** (pelo tamanho da amostra e pela força da diferença);
- a **métrica**;
- **exemplos reproduzíveis**: o cenário, a estratégia, a semente, a geração e o ano.

A população:

- **328 vidas, 265 partidas, 20.561 anos e 81.634 registros**, em 1 min 45 s;
- as quatro estratégias em vidas comuns, com quatro vidas seguidas por jogador e a memória entre elas;
- as origens das pontas (bilionária, trilionária, realeza, regime), com a cautelosa e a arriscada;
- nove dinastias de oito gerações.

Outros usos:

- `npm run observatorio -- --vida=SEMENTE` conta uma vida década a década;
- `--arquivo=` lê o que o menu exporta e escreve `dist-observatorio.md`, com a origem de cada vida na capa.

### 1.6 No aparelho (`src/jogo/observacao.ts`, `src/ui/Observacao.tsx`)

- **Quando observa:** quando a vida acaba, depois do cartão aparecer. O jogo refaz a gravação com o observador em pedaços de 20 comandos, devolvendo a vez à interface, e confere que a vida refeita é a mesma. Se não for, ou se o save é de antes da gravação, observa pelo livro.
- **Onde guarda:** na chave `trajetoria:observacao`, à parte do save. O save não muda de formato.
- **Quanto guarda:** as últimas 3 vidas inteiras (uns 150 KB cada, com os números arredondados) e o resumo das 60 anteriores (os perfis, a saturação, os extremos).
- **Quando falta espaço:** o save passa na frente, e a observação é a primeira a sair, antes da cópia de segurança.
- **No menu**, "O seu jeito de jogar" mostra:
  - os perfis da vida de agora, com o que mais pesou;
  - se o mundo ficou pequeno na última vida observada;
  - quantas vidas foram observadas;
  - e os botões para ligar e desligar, exportar o arquivo e apagar (apagar deixa a escolha de observar como estava).
- **O que sai do aparelho:** nada, a não ser que quem joga exporte.

---

## 2. Os arquivos

**Criados:**

| Arquivo | O que é |
|---|---|
| `src/motor/observacao.ts` | o observador, o registro, a foto, as oportunidades, a origem do dinheiro, as três maneiras de observar |
| `src/motor/perfis.ts` | os dez perfis, os sinais, as janelas |
| `src/motor/extremos.ts` | os dez extremos relativos e os limiares |
| `src/motor/saturacao.ts` | o índice, os componentes e o esgotamento |
| `src/motor/inteligencia.ts` | o relatório e o markdown |
| `src/jogo/observacao.ts` | a observação no aparelho (guardar, resumir, ligar, apagar, exportar, a vida que acabou) |
| `src/jogo/formato-da-observacao.ts` | o arquivo exportado (formato `trajetoria-observacao`, versão 1, esquema com zod/mini) e a chave do aparelho |
| `src/ui/Observacao.tsx` | "O seu jeito de jogar", no menu |
| `scripts/observatorio.ts` | a bancada e o relatório |
| `test/observacao.test.ts` | 28 testes |
| `docs/observatorio.md` | o relatório de 328 vidas de robôs |
| `docs/relatorio-etapa-03.md` | este relatório |

**Modificados:**

| Arquivo | O que mudou |
|---|---|
| `src/ui/App.tsx` | a partida começa com a vida; a vida que acaba é observada depois do cartão |
| `src/ui/Menu.tsx` | a seção "O seu jeito de jogar" antes do save |
| `src/ui/exportar.ts` | `exportarTexto`, o mesmo caminho do save exportado, para qualquer texto |
| `src/jogo/salvar.ts` | sem espaço, a observação sai antes da cópia de segurança |
| `test/salvar.test.ts` | o teste disso |
| `package.json`, `.gitignore` | `npm run observatorio`; os arquivos `dist-observatorio*` fora do git |
| `CLAUDE.md`, `docs/motor.md`, `docs/decisoes.md`, `docs/roteiro.md`, `docs/ideias.md`, `README.md`, `CHANGELOG.md` | a documentação |
| `docs/metricas.md` | reescrito pelo túnel (seção 7) |

**Nenhum arquivo do motor que já existia mudou, e nenhum do conteúdo:** `git diff d0dcbd5 -- src/motor conteudo` mostra só os cinco arquivos novos.

---

## 3. Exemplos do relatório produzido

Trechos de `docs/observatorio.md` (vidas de robôs).

**Um comportamento, com a confiança e o exemplo:**

> **Os perfis convivem e mudam com a vida** · fato observado · confiança alta (n = 328)
> - em média 1,8 perfis fortes (≥ 0,6) por vida; o perfil mais forte troca pelo menos uma vez, entre as janelas de dez anos, em 90% das vidas

**Um sistema que deixa de servir em escala:**

> **"consequencia" deixa de servir: fica saturado cinco anos seguidos em 66% das vidas que chegaram ao 1% mais rico (11% das outras)** · fato observado · confiança alta (n = 233)
> - 154 de 233 vidas do topo e 10 de 95 das outras; as decisões grandes mexem em menos de 0,1% do patrimônio
> - Para reproduzir: comum/primeira, semente 10031, geração 1, 2081; …

**Uma anomalia econômica explicada pela origem do dinheiro:**

> **quantas vezes o patrimônio cresceu numa década: 2 vidas passam do limiar extremo (10000)** · fato observado · confiança baixa (n = 2)
> - o maior: 61,3 mil; … O dinheiro que entrou na década veio sobretudo de: tesouro (em 2 de 2 vidas; num exemplo, R$ 98 bilhões, 99% do que entrou)
> - Para reproduzir: realeza/arriscada, semente 22002, geração 1, 2068; realeza/arriscada, semente 22007, geração 1, 2058

**Uma hipótese, marcada como hipótese:**

> **Quem está no 0,1% mais rico decide como gente comum: 13% das escolhas mexem em menos de 0,001% do patrimônio** · hipótese · confiança alta (n = 4882)
> - as mais frequentes: luto (80), namoro_esfriou (33), esperou_por_voce (32)… Pode ser vida normal (o jantar com a família), ou pode ser o conteúdo sem escala

**A saturação por faixa de riqueza (vida adulta):**

| Faixa | Anos | Saturação | escala | consequência | salário |
|---|---|---|---|---|---|
| metade de baixo | 803 | 0,03 | 0,00 | 0,00 | 0,00 |
| percentil 50 a 90 | 2.358 | 0,04 | 0,00 | 0,03 | 0,03 |
| percentil 90 a 99 | 2.943 | 0,07 | 0,01 | 0,17 | 0,06 |
| 1% mais rico | 2.636 | 0,18 | 0,16 | 0,58 | 0,12 |
| 0,1% mais rico | 5.154 | 0,24 | 0,10 | 0,44 | 0,69 |

**Uma vida década a década** (`npm run observatorio -- --vida=21505`):

| Década | Perfis fortes (≥ 0,6) | Saturação | Patrimônio |
|---|---|---|---|
| 2036–2045 | — | 0,00 | R$ 38 bilhões |
| 2056–2065 | Estrategista político 96%, Investidor 77%, Explorador 76%, Acumulador 62% | 0,29 | R$ 1,2 trilhão |
| 2096–2105 | Estrategista político 94%, Investidor 94%, Acumulador 74% | 0,42 | R$ 9,5 trilhões |

### 3.1 O que o observatório encontrou (robôs)

**Fatos observados:**

1. **A experiência satura com a riqueza, sistema a sistema.** O índice vai de 0,03 na metade de baixo a 0,24 no 0,1% mais rico. Nas vidas que chegam ao 1% mais rico, dois sistemas deixam de servir por cinco anos seguidos:
   - a consequência das decisões grandes, em 66% delas (11% nas outras);
   - o salário, em 53% (8% nas outras).

   Os objetivos deixam de servir em 25%, todas depois dos 60 anos (aos 76, na mediana). Nenhuma vida se esgotou pelo índice inteiro (0,7 por cinco anos).
2. **A coroa faz um bilionário em um ano.** As duas vidas com o patrimônio crescendo mais de 10 mil vezes numa década são de realeza. O dinheiro veio do Tesouro: a dotação da coroa (R$ 98 bilhões numa década, R$ 226 bilhões na outra). É a A-02 da etapa 01 ("a renda da coroa é uma fração do PIB"), que a etapa 02 deixou para reavaliar e que esta etapa não podia mudar (nada de fórmulas econômicas).
3. **Nenhuma fonte de riqueza domina com folga.** A riqueza em empresas cresce 0,14 ordem de grandeza por década na mediana, e a em aplicações, 0,10. A diferença fica abaixo da folga de 0,1 que o relatório pede para chamar uma estratégia de dominante.
4. **Os sistemas mais usados** são o dinheiro (24% das decisões), as relações (15%), a família (13%), o corpo (11%) e a carreira (8%). **Os menos usados** são a dinastia (13% das vidas), a coroa (15%), a defesa (11%), a diplomacia (17%) e o grupo (18%).
5. **Abandono:** a coroa e a filantropia são deixadas de lado na segunda metade da vida em 65% e 64% das vidas que as usaram (amostras de 20 e 36).
6. **Gargalos:** partindo de baixo, 77% das vidas chegam aos 10% mais ricos, 45% ao 1% e 20% ao 0,1% (aos 54 anos, na mediana). O lugar no país quase não muda dos 30 aos 60 em 35% das vidas.
7. **Escolha que não é escolha:** 0,7% dos eventos com duas opções ou mais chegam com uma só liberada (acidente_em_casa, perdeu_emprego_na_crise, viagem_la_para_fora).
8. **Ninguém é filantropo** entre os robôs (0 de 328), e só 3% são de sobrevivência: a regra deles quase não doa e quase não vive no aperto.
9. **Cobertura:** 199 dos 1.004 storylets não apareceram nestas 328 vidas. O túnel de 10.000 vidas é a medida de cobertura, e nele nenhum está morto.

**Hipóteses (a testar com pessoas):**

- **O conteúdo do topo** pede decisões com efeito proporcional e uma carreira que pese de outro jeito (o poder, a influência, o legado).
- **13% das escolhas de quem está no 0,1%** mexem em menos de 0,001% do patrimônio: pode ser vida normal (o luto) ou conteúdo sem escala.
- **A coroa e a filantropia** podem não ter segundo ato, ou ser só a regra dos robôs.

---

## 4. Os testes

`test/observacao.test.ts` (28 testes) cobre cada item pedido.

**O registro e a integridade:**

| Pedido | Como o teste confere |
|---|---|
| Registro correto de decisões | toda escolha guarda as opções (total, disponíveis, a escolhida, que existe no conteúdo), e o número de escolhas e de ações bate com o livro; o patrimônio antes de cada comando é o antes do anterior mais o que ele mudou |
| Integridade dos dados | a ordem é contínua; todo número de toda foto é finito; nenhum nome da família aparece no JSON; o arquivo exportado vai e volta igual, e o que não é o formato (ou é de versão mais nova) volta como erro |
| Consistência temporal | os anos nunca voltam; a idade é o ano menos o nascimento; há uma foto por ano, em sequência; o fim bate com o estado; numa dinastia de três gerações, cada vida começa no ano em que a anterior terminou |

**Os perfis, os extremos e a saturação:**

| Pedido | Como o teste confere |
|---|---|
| Perfis simultâneos | quem abre empresas e governa é empreendedor e estrategista ao mesmo tempo; o perfil muda de uma década para outra; numa vida de robô, os dez perfis têm probabilidade e porquê |
| Jogadores extremos | o mesmo patrimônio é fortuna nacional num país pequeno e não num grande; o grupo no PIB, a holding, a concentração, o poder e a dinastia são achados com o ano e o limiar; o topo da riqueza aparece quando, e só quando, a vida passou do 0,1%; a herança não conta como enriquecimento, e o achado diz de onde veio o dinheiro |
| Saturação | sobe quando o mundo não responde; um ano sem eventos não conta como repetição; esgotada é cinco anos seguidos; em vidas de robô, o índice é a média dos componentes que valem |

**A escala, os saves e a simulação:**

| Pedido | Como o teste confere |
|---|---|
| Partidas longas | a dinastia de três gerações, com a mesma partida e a geração que sobe |
| Desempenho | o relatório de 50 mil registros sai em menos de 10 s (o limite do teste; TEMPO_50K); a bancada inteira (81.634 registros) roda em 1 min 45 s |
| Saves anteriores | a observação estragada, de outra versão ou ausente volta vazia; a vida sem gravação (o save de antes dela) é observada pelo livro; a gravação de outra vida cai para o livro; o save não muda de formato, e observar a vida lida de um save não muda o que o save guarda; sem espaço, a observação sai antes da cópia e o save grava |
| A telemetria não altera a simulação | a mesma vida, observada e não observada, sai igual byte a byte (o estado e o livro); refazer a gravação observando dá o mesmo estado que refazer sem observar; observar em pedaços dá os mesmos registros que de uma vez |

Resultados (`npm run verificar`, 17/11): VERIFICAR_RESULTADO

---

## 5. As limitações

- **Os perfis, os extremos e a saturação são medidas que eu escrevi**, com pesos e limiares escolhidos e o porquê ao lado. Não foram validados com pessoas: não há dados de pessoas. A calibração do explorador e do generalista usa robôs, e robôs não são a população de jogadores.
- **Os robôs decidem por regras fixas.** O que eles escolhem em 95% das vezes, a filantropia que ninguém faz e a coroa que eles largam medem as regras deles tanto quanto o jogo. O relatório marca isso nos itens em que pesa.
- **Nenhuma vida se esgotou pelo índice inteiro.** O índice é uma média de sete componentes, e alguns quase nunca saturam (o investimento cabe no mercado, a repetição fica perto de 0,2). O sinal útil está no componente, não no índice. Baixar o limiar para achar vidas esgotadas seria escolher o resultado.
- **A observação pelo livro é mais pobre.** O save de antes da gravação e a vida em andamento no menu não têm as opções que estavam na mesa nem uma foto por ano.
- **A origem do dinheiro só olha a conta corrente.** O que entra direto nos investimentos ou nos bens (o imóvel herdado) não aparece em `entradas`, e a herança que não é dinheiro (a parte numa empresa) não entra em `recebido`.
- **O custo:**
  - a vida refeita com o observador leva uns 240 ms num computador, contra 124 ms sem ele (1,4 ms por ano de vida, em oito vidas); no celular não medi, e por isso ela roda em pedaços, depois do cartão;
  - cada vida inteira guardada ocupa uns 150 KB.
- **Uma pessoa, não o público.** O arquivo exportado é de uma pessoa, e juntar arquivos de várias (a análise agregada) não foi feito.

---

## 6. Como os dados alimentam as próximas etapas

- **O explorador da bancada** (a etapa da rede neural, na ordem da etapa 02) ganha um juiz e um objetivo. Ele procura as vidas que mais saturam, as que acham crescimento explosivo e as que caem nas incoerências. O observatório diz quando achou, com exemplo reproduzível.
- **O conteúdo do fim do jogo (A-04)** ganha uma régua de antes e depois: a consequência e o salário saturados no 1% (66% e 53% das vidas) e o índice por faixa. Uma camada de fim de jogo que funcione derruba esses números no mesmo relatório, com as mesmas sementes.
- **A coroa (A-02)** tem agora dois casos reproduzíveis (as sementes 22002 e 22007) para a decisão de equilíbrio.
- **As pessoas:** o arquivo exportado é o mesmo formato que a bancada lê.
  - Quando o dono jogar e exportar, `npm run observatorio -- --arquivo=` escreve o relatório de uma pessoa real.
  - Quando houver vários arquivos, a análise agregada lê a origem, a versão e a partida de cada vida, sem nomes. O formato está pronto para isso (I-200); a análise, não.
- **O túnel** pode, numa etapa futura, cobrar portões do observatório (a saturação do topo, o sistema que deixa de servir) como cobra a saturação V5.

---

## 7. A simulação original não foi alterada

- **O código:** nenhum arquivo do motor que já existia mudou, e nenhum do conteúdo (`git diff d0dcbd5 -- src/motor conteudo`: só os cinco arquivos novos, que o motor não importa).
- **O teste:** a mesma vida, observada e não observada, sai igual byte a byte; refazer observando dá o mesmo estado que refazer sem observar.
- **O túnel (10.000 vidas):** TUNEL_RESULTADO
- **O save** não mudou de formato. A observação mora em outra chave, e o save passa na frente dela quando falta espaço.
