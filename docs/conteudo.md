# Conteúdo: formato e guia de escrita

Todo conteúdo é dado. Os storylets ficam em `conteudo/storylets/*.json` (por tema: `00-infancia` a `40-velhice`, `50-familia` e `55-relacoes` para iniciativas de personagens, `60-acoes` para a ficha do ano, `70-origem` e `80-variedade` para o que depende de classe, família, região e traço, `85-carreira` a `89-lugar-e-fase` para curso, setor, ciclo da economia, riqueza e padrão de vida, `90-investimentos` e `91-fortuna` para a carteira, as fortunas e a dinastia, `92-empresa`, `92-imperio` e `92-grupo` para a empresa de quem joga, quem manda nela e o grupo, `93-vida-adulta` e `94-gente` para o que enche os anos entre os 20 e os 70, `98-la-fora` para o mundo lá fora e o dólar, `99-pais` para o país vivo). Depois de mexer, rode `npm run validar`; antes de subir, `npm run tunel`.

## Storylet

Evento, ação e iniciativa de personagem têm o mesmo formato. O `tipo` diz quem escolhe:

| `tipo` | Quem escolhe | Como aparece |
|---|---|---|
| `evento` (padrão) | o diretor, por saliência | cartão com opções, ou acontecimento sem escolha |
| `npc` | a regra do personagem do `ator` (chance pela tensão × afinidade do traço) | sem escolha, acontece na hora; com escolha, disputa o ano com os eventos |
| `acao` | o jogador, pela ficha do ano (`verbo` + `rotulo`) | entrada da linha do tempo com a etiqueta do verbo |
| `jogada` | o jogador, na seção "Brincar de deus" da folha Dinheiro (`rotulo`), sem gastar ficha | entrada "Fortuna" com a escolha e o desfecho |

```json
{
  "id": "amor_proposta_fora",
  "tipo": "npc",
  "ator": ["amor"],
  "idade": [22, 60],
  "condicoes": { "marcas": ["namoro"], "ator.traco": ["ambicioso", "trabalhador"] },
  "tensao": 2,
  "texto": "{amor} recebeu uma proposta para trabalhar em outra cidade…",
  "resumo": "teve que decidir se ia junto quando {amor} mudou de cidade",
  "escolhas": [ … ]
}
```

| Campo | Para quê |
|---|---|
| `id` | único, `minusculas_com_sublinhado` |
| `tipo` | `evento`, `npc`, `acao` ou `jogada` |
| `ator` | papéis que podem ocupar `{ator}` (`mae`, `pai`, `avo`, `amigo`, `amor`, `filho`, `paixao`, `pet`), ou os países de fora (`federacao`, `celeste`, `liga`, `pacto`), nunca os dois juntos; cada um é uma instância diferente. `filho` vale para cada filho de quem joga (até quatro): escreva `{ator}`, não `{filho}`, quando o texto é sobre qualquer um deles. `{filho}` e `filho.x` são o primeiro filho, salvo no storylet que cria um filho, em que `{filho}` é o recém-nascido |
| `preferir` | entre vários atores possíveis, o de menor (`-ator.vinculo`) ou maior (`+ator.dinheiro`) valor |
| `idade` | faixa `[min, max]` de quem joga (obrigatória, exceto em `apenasAgendado`) |
| `apenasAgendado` | só acontece quando outro efeito o agenda |
| `marco` | quando elegível, acontece sem sorteio (ENEM, primeiro emprego, aposentadoria) |
| `peso` | peso na saliência (padrão 1) |
| `tensao` | urgência: multiplica a saliência e a chance de o personagem agir; 2 passa na frente do sorteio; 3 acontece com certeza |
| `afinidade` | `ajuda` ou `briga`: o traço do personagem multiplica a chance (o generoso ajuda mais, o brigão briga mais) |
| `repetivel` / `intervalo` | pode voltar na mesma vida, com intervalo mínimo em anos (padrão 5); ações sempre podem repetir, respeitando `intervalo` |
| `condicoes` | ver abaixo |
| `valores` | quantias em reais de hoje, usadas no texto como `{nome}` |
| `trechos` | pedaços de texto escolhidos pelo estado (ver Texto) |
| `texto` | o cartão (até ~300 caracteres) |
| `resumo` | frase no passado que completa "aos 34, …" no cartão da vida; em iniciativa sem escolha, começa pelo sujeito (`{ator} …`) |
| `escolhas` | de 1 a 4; pelo menos uma sem condição |
| `efeitos`, ou `teste` + `sucesso` + `fracasso` | para storylets sem escolha (ações e acontecimentos) |
| `verbo`, `rotulo` | só em ações: o verbo da ficha (`estudar`, `trabalhar`, `saude`, `familia`, `sair`, `poupar`) e o texto do botão (até 28 caracteres, sem alternâncias) |

Uma ação precisa mexer em pelo menos dois sistemas (ex.: inteligência e felicidade; dinheiro e vínculo). Cada verbo faz a ação mais específica que o estado permite: escreva ações com condições (traço, qualidade, classe, região) para que o mesmo verbo vire coisas diferentes em vidas diferentes.

## Escolha

```json
{
  "texto": "Namoro a distância",
  "resumo": "topou um relacionamento a distância com {amor}",
  "condicoes": { "dinheiro": { "min": 3000 } },
  "bloqueio": "texto mostrado quando a condição não deixa escolher",
  "efeitos": { "dinheiro": -2400 },
  "teste": { "chance": 0.5 },
  "sucesso": { "texto": "…", "efeitos": { "ator.vinculo": 4 }, "resumo": "segurou um relacionamento a distância com {amor}" },
  "fracasso": { "texto": "…", "efeitos": { "ator.vinculo": -22 } }
}
```

- `texto` é o botão (até ~60 caracteres; curto é melhor).
- `resumo` completa "aos 17, você …". Minúscula, no passado.
- Sem sorte: `resultado`. Com sorte: `teste` + `sucesso` + `fracasso`.
  - `{ "chance": 0.3 }`: sorte pura.
  - `{ "atributo": "inteligencia", "dificuldade": 60 }`: chance de `0,5 + (valor − dificuldade)/50`, entre 5% e 95%. O atributo pode ser qualquer caminho numérico (`ator.vinculo`).
- Um desfecho pode ter `resumo` próprio quando o resultado é o que importa.
- Opção com condição não atendida aparece desabilitada, com o `bloqueio`.

## Condições

Chaves fixas e caminhos. Caminho sem ponto é de quem joga; `ator.x` é do papel ligado ao storylet.

```jsonc
{
  "saude": { "min": 40 }, "felicidade": { "max": 30 },       // campos numéricos: faixa
  "dinheiro": { "min": 5000 }, "patrimonio": { "min": 25000 }, // patrimônio = conta + investido − dívida
  "classe": { "max": 1 }, "classe_origem": { "min": 4 },       // classe atual (pelo patrimônio, com a empresa) e de origem, 0 a 7 (6 bilionária, 7 trilionária)
  "padrao": "luxo", "perfil": ["arrojado", "moderado"],        // padrão de vida e perfil de investidor que o jogador escolheu
  "empresa.valor": true, "empresa.tracao": { "min": 12 },      // a empresa de quem joga (qualquer condição sobre ela, menos false, exige que ela exista)
  "empresa.setor": "tecnologia", "marcas": ["empresa.na_bolsa"], "empresa.valor": false, // sem empresa
  "empresas": { "min": 2 }, "empresa.subsidiarias": { "min": 10 },     // o grupo: quantas empresas quem joga tem e as subsidiárias da que ele cuida
  "marcaHa": [{ "marca": "empresa.fundiu", "min": 1, "max": 3 }],       // de 1 a 3 anos depois de uma fusão
  "pais.ret_acoes": { "max": -20 },                            // quanto cada classe de investimento rendeu no ano, em %
  "carreira": ["medico", "enfermeiro"], "nivel": { "min": 2 },   // profissão escolhida (mundo.json › carreiras) e o cargo nela
  "influencia": { "min": 30 }, "fama": { "min": 40 },            // poder: 0 a 100
  "cargo": ["prefeito", "governador", "presidente", "rei", "ditador"], "popularidade": { "max": 30 }, "mandato": { "max": 0 },
  "testamento": ["amigo", "causa"],                             // para quem vai tudo ('' é a lei)
  "pais.impulso": { "min": 1 },                                 // decretos que aquecem (+) ou esfriam (−) a economia
  "pais.desemprego": { "min": 11 }, "pais.inflacao": { "min": 8 }, "pais.juros": { "min": 13 }, // o país vivo: crescimento, desemprego, inflação, juros (%)
  "pais.divida": { "min": 100 }, "pais.pobreza": { "min": 31 }, "pais.violencia": { "min": 24 }, // dívida (% do PIB), pobreza (%), homicídios por 100 mil
  "pais.saude": { "max": 38 }, "pais.educacao": { "min": 58 }, "pais.aprovacao": { "max": 34 }, // saúde e educação públicas (0 a 100), aprovação do governo (%)
  "pais.governo": ["frente_popular", "centrao"], "pais.governo": "voce", // quem governa (mundo.json › governos, 'regime' ou 'voce')
  "pais.pol_social": { "min": 2 }, "pais.pol_impostos": { "max": 0 },  // políticas em vigor (0 baixo, 1 médio, 2 alto; pol_comercio 2 é a fronteira fechada)
  "pais.cambio": { "min": 6 },                                   // o dólar, em reais de hoje (anda em volta de R$ 5)
  "pais.pib": { "min": 2.0e13 }, "pais.populacao": { "max": 2.08e8 }, // o PIB por ano em reais de hoje (R$ 11,7 tri em 2026) e a população (213 milhões em 2026)
  "pais.pib_per_capita": { "min": 100000 }, "pais.gini": { "min": 0.55 }, "pais.idh": { "min": 0.8 }, // derivados: PIB por pessoa, desigualdade (0 a 1) e IDH (0 a 1); o texto mostra 0,55 e "205 milhões"
  "ator.relacao": { "max": 32 }, "ator.crescimento": { "min": 6 }, // com ator país de fora: a relação com o Brasil (0 a 100) e a economia dele (%)
  "marcas": ["ator.sancao"], "marcas": ["celeste.acordo"], "marcas": ["federacao.crise"], // sanção contra o Brasil, acordo comercial, crise lá
  "marcas": ["salario_em_dolar"],                                // o salário de quem joga anda com o dólar
  "pais.eleicao": true, "marcas": ["voto_bloco_liberal"],          // ano de eleição geral; o voto de quem joga (marcaHa para "anos depois")
  "marcas": ["iate"], "marcas": ["senhorio"],                   // bens: a qualidade de cada item (mundo.json › bens › marca); senhorio = tem imóvel alugado
  "familia": "religiosa", "traco": ["ansioso", "timido"],      // texto: igual a um, ou a um dentre vários
  "mae.vivo": true, "ator.traco": "gastador", "ator.idade": { "min": 13, "max": 17 },
  "lugar.regiao": "nordeste", "lugar.capital": true, "lugar.desemprego": { "min": 0.095 },
  "paquera": { "min": 2 },                                      // qualidade numérica (contador)
  "genero": "f", "inflacao": { "min": 9 },
  "setor": "saude", "ator.setor": ["industria", "construcao"],  // setor de trabalho (12, em mundo.json › setores)
  "marcas": ["todas", "estas"], "algumaMarca": ["uma", "destas"], "semMarcas": ["nenhuma", "ator.ausente"],
  // fase do país: "marcas": ["pais.expansao"] ou "algumaMarca": ["pais.recessao", "pais.crise"]
  "marcaHa": [{ "marca": "fumante", "min": 12 }, { "marca": "ator.faleceu", "max": 0 }]
}
```

Storylets sobre quem morreu pedem `ator.vivo: false` ou `ator.faleceu` nas condições; os outros exigem o ator vivo.

**A relação com cada pessoa** (bloco R, `relacoes.ts`):

```jsonc
{
  "ator.vinculo": { "min": 50 },      // o afeto (0 a 100)
  "ator.magoa": { "min": 40 },        // a mágoa com quem joga (0 a 100); passa com o tempo no ritmo do perdão do traço
  "ator.confianca": { "min": 70 },    // a confiança (0 a 100, começa em 60)
  "ator.sem_contato": { "min": 3 },   // anos sem se falar (ganhar vínculo zera)
  "ator.gosto": "pescaria",           // o que a pessoa ama: futebol, novela, pescaria, cozinha, musica, fe, plantas, jogos, livros, carros, viagem, danca, bichos, politica, artesanato
  "marcas": ["ator.rompido"],         // a pessoa rompeu (o storylet "rompimento", com mágoa de 42+; o par faz as malas com 45+); "fazer_as_pazes" tira
  "marcas": ["remorso"], "marcas": ["despediu"], // de quem joga: alguém morreu magoado, longe ou com uma vontade guardada; alguém morreu perto e em paz
  "ator.visao": ["sumido", "metido"], // o que a pessoa acha de quem joga (a opinião mais forte; true = tem alguma): orgulho, presente,
                                      // carinhoso, de_palavra, generoso, cuida_dos_filhos, sumido, metido, interesseiro, cabeca_quente,
                                      // sem_palavra, longe_dos_filhos, casado_com_o_trabalho, perdido
  "marcas": ["ator.quer_o_mar"],      // uma vontade guardada (mundo.json › vontades); a ação que a realiza tira a marca
  "marcaHa": [{ "marca": "ator.nao_apareceu", "max": 2 }] // a falta: a pessoa passou um ano doente e você não apareceu
}
```

**A vontade** é uma qualidade `quer_…` da pessoa, declarada em `mundo.json › vontades`. A declaração tem:

- `quer`: o que aparece na folha Família ("Quer ver o mar.");
- `nunca`: a frase que a morte diz, se a vontade ficou guardada;
- opcionais: `feita` e `realizada` (a vida realiza: a condição e os textos), `ate` e `perdida` (a idade da pessoa em que a vontade passa, a falta que fica e a mágoa dela) e `pressa` (depois de tantos anos guardada, vira tanta mágoa por ano).

O conteúdo faz a vontade nascer (uma iniciativa da pessoa com `"marcas": ["ator.quer_…"]` e `semMarcas` da mesma vontade) e a ação que a realiza (`removerMarcas`). Toda qualidade que começa com `quer_` precisa estar em `vontades`. Para o texto mudar com a opinião, use trechos com `"se": { "ator.visao": "generoso" }`.

Nos efeitos, `"ator.magoa": 15` machuca e `-20` repara; `"ator.confianca": -10` quebra a confiança; `"ator.sem_contato": { "definir": 0 }` é o contato que não dá vínculo (a briga). No texto, `{ator.lembranca}` e `{ator.magoa_de}` viram "de quando você …, aos 34" (a melhor e a pior coisa que quem joga fez com a pessoa, do livro; sem lembrança forte, o que toda relação tem): escreva "{ator:Ele|Ela} lembrou {ator.lembranca}" e "A mágoa vinha {ator.magoa_de}". Use `"preferir": "+ator.magoa"` para a ação ir primeiro a quem está mais magoado.

O validador confere os campos de texto de vocabulário fechado: `lugar.regiao` (norte, nordeste, centro_oeste, sudeste, sul), `setor` (os 12 de `mundo.json`), `padrao`, `perfil`, `familia` e `traco` (de quem joga ou de personagem).

A fase da economia é uma qualidade do país (`pais.expansao`, `pais.recessao`, `pais.crise`; no normal, nenhuma). Storylet que a consulta tem a entrada que anunciou a fase como causa: o cartão da vida pode contar "o país entrou em crise → você perdeu o emprego".

O nome de quem governa vem por trecho, pela condição `pais.governo` (veja `99-pais.json`): `{ "se": { "pais.governo": "centrao" }, "texto": "o centrão" }`. Personagens, partidos e eventos políticos são fictícios e genéricos: blocos em minúsculas, com artigo, sem nome próprio.

## O mundo lá fora (incremento 10)

Os quatro países de fora (`mundo.json › estrangeiros`) são entidades como as pessoas: `{ator}` dá o nome ("República Celeste"), `{ator:O|A} {ator}`, `d{ator:o|a} {ator}` e `n{ator:o|a} {ator}` concordam com o artigo ("o Pacto do Sul", "na Federação do Norte"), e `{ator.produtos}` diz o que ele compra do Brasil ("soja, minério e carne"). Com `"ator": ["federacao", "celeste", "liga", "pacto"]` e `"preferir": "+ator.relacao"`, o mesmo storylet acontece com o país que faz mais sentido. Fora de `ator`, o caminho é pelo id: `"celeste.relacao"`, `"federacao.acordo"`.

- Cada país tem: `nome`, `genero`, `descricao` (a folha País mostra), `produtos`, `peso` no que o Brasil vende lá fora (a soma não passa de 1), o `crescimento` dele, o `desvio` e as chances de `crise` e de `boom`, o `rival` (opcional), os setores daqui que ele `compra` e a `relacao` de sempre.
- As notícias (`mundo.json › noticias`: crise, boom, sanção e o fim dela, acordo e o fim dele, e os três atos de quem governa) são textos com o país como ator, e o resumo completa o porquê ("Porque aos 41, a República Celeste impôs sanções ao Brasil").
- Os governos dizem de quem se aproximam (`aproxima`): a relação com eles sobe 15, e a com o rival deles cai 15. A política `comercio` (aberto, moderado, fechado) mexe no potencial, na inflação, na relação com todos (`relacao`: +5, 0, −8) e na aprovação.
- Os setores dizem quanto sentem o dólar (`cambio`: o agro ganha com ele alto, o comércio perde) e a tarifa (`protecao`: a indústria ganha com a fronteira fechada). O investimento em dólar (`ativos › dolar`, `cambio: 1`) rende o quanto o dólar subiu.
- Efeitos: `"ator.relacao": 10` (a cúpula, o embaixador), `"celeste.relacao": -15` (escolher lado numa guerra comercial). Sanção e acordo não se escrevem pelo conteúdo: nascem da relação.

## Dívidas (fatia 1.2)

Toda dívida é um contrato com o banco (`docs/motor.md`): o cheque especial, o empréstimo de uma escolha, o financiamento de um imóvel e o acordo.
- **A qualidade `nome_sujo` é do motor.** Ela existe enquanto alguma dívida estiver atrasada, e o conteúdo só a lê. A cobrança, o aluguel negado, o feirão (`94-dividas.json`) e o carro que não se financia são condições sobre ela. Para a história sujar o nome, a escolha cria a dívida; quem decide se ela atrasa é o limite do banco.
- **A carta do banco** (o storylet `nome_sujo`) é agendada pelo motor quando o nome suja, e pelo rotativo; ela só chega se o nome estiver sujo.
- **Renegociar é decisão.** A escolha que fecha um acordo usa `renegociar`. A que só abate (vender o carro, cortar tudo) usa `dividaFator` ou `divida` negativo.

## A coroa e a ilha (bloco C)

Quem tem coroa escolhe como ela recebe (`docs/motor.md › A coroa`). O conteúdo lê e, quando a história pede, muda a forma.
- **`pais.coroa` e `ilha.coroa`** (texto: `salario`, `impostos` ou `taxa`; vazio é o salário) são a forma da coroa do Brasil e da ilha. Condição: `"pais.coroa": "taxa"`. Efeito: `"pais.coroa": { "definir": "salario" }`. A dotação de quem reina acompanha a forma na hora.
- **A ilha** (`ilha`): `{ilha.nome}`, `{ilha.populacao}` (com ponto de milhar: "2.300"), `{ilha.pib}` e `{ilha.pib_per_capita}` no texto; `"ilha.populacao": { "min": 3000 }` nas condições; `"ilha.populacao": 200` nos efeitos (o porto novo que trouxe gente). Texto que fala da ilha pede a marca `micronacao`.
- **`fundarIlha`** (efeito, `true`): a ilha nasce, com o nome da cidade natal de quem fundou. Só a jogada "fundar um país" usa.
- **Os agendados do motor:** a rua contra a taxa, o barco de mudança e a conta da parte dos impostos chegam depois do decreto; a ilha que cresceu, quando ela passa de 2.600 habitantes; a greve na ilha, quando a popularidade de quem é soberano cai abaixo de 30.
- Quem tem cargo (`"cargo": false` exclui) não recebe proposta de emprego: a renda de quem reina é a dotação.

## O Tesouro (bloco B)

Quem joga empresta ao governo pela folha Dinheiro (`docs/motor.md › O Tesouro`). O conteúdo não compra título: lê e, quando a história pede, vende.
- **`eu.titulos`** (ou `"titulos"` nas condições) é quanto quem joga emprestou ao governo, em reais: `"titulos": { "min": 5000 }` pede alguém com título, e `{eu.titulos}` no texto sai como dinheiro ("R$ 731 mil"). A régua dos dilemas mede o storylet que pede título com um título típico (R$ 20 mil a 5%, com 15 anos pela frente).
- **`pais.calote`** é a qualidade do país que deu calote, com o ano: `"marcaHa": [{ "marca": "pais.calote", "max": 2 }]` é "até dois anos depois do calote". O calote é do motor (a dívida acima de 100% do PIB numa recessão ou numa crise); o conteúdo lê.
- **`venderTitulos`** (efeito) vende uma fração de cada título pelo preço do dia: o medo do calote no noticiário (`58-tesouro.json`), a conta que apertou.
- **`comprarTitulo`** (efeito) empresta ao governo uma fração da conta num título de 5, 10 ou 20 anos, com a taxa do dia e a história de causa (o vencimento diz "que você comprou aos 19"). Sem como comprar (antes dos 18, cinco títulos, menos de R$ 100), o dinheiro vai para a renda fixa. Texto que diz "Tesouro Direto" usa este efeito; o que investe pelo perfil (`investir`) não fala em Tesouro, porque o perfil pode ser metade em ações.
- O storylet `depois_do_calote` é agendado pelo motor no ano seguinte ao calote, com ele de causa.

## Efeitos

| Efeito | Exemplo | Nota |
|---|---|---|
| atributos | `"saude": -3` | limitados a 0–100 |
| caminho | `"mae.vinculo": 10`, `"ator.saude": 5`, `"ator.ocupacao": { "definir": "aposentada" }` | soma, ou define |
| `dinheiro` | `-1500` | faltando, resgata investimento e depois vira dívida |
| `investir` | `10000` | move da conta para o investido (o que houver) |
| `divida` | `35000` | um empréstimo do banco que nasce desta entrada (o porquê, se ele atrasar); negativo é desconto do banco, o atrasado primeiro |
| `dividaFator` | `0.4` | multiplica a dívida sem garantia (a venda do carro que abateu, os cortes que pagaram); o banco perdoa a diferença |
| `renegociar` | `{}` ou `{ "desconto": 0.6 }` | fecha um acordo com o banco: as dívidas sem garantia viram uma só, com parcela, e o nome limpa se nada mais atrasar. Sem `desconto`, vale o do banco pelos anos de atraso (até 70%) |
| `patrimonioFator` | `0.5` | multiplica conta e investido (golpe, sociedade que quebrou) |
| `renda`, `custo` | `20000` ou `{ "definir": 26000 }` | anuais, reais de hoje |
| `rendaFator`, `custoFator` | `0.8`, `0.5` | multiplicam a renda (corte de salário, proposta) e o custo anual (cortar o padrão) |
| `custoDoPatrimonio` | `0.06` | soma ao custo anual 6% do patrimônio de agora (subir de padrão com a herança) |
| caminho com `copiar` | `"eu.setor": { "copiar": "pai.setor" }` | copia o valor de outro caminho da mesma espécie |
| `transferir` | `{ "de": "ator", "para": "eu", "fracao": 0.2, "max": 30000 }` | dinheiro de uma pessoa para outra; `{transferido}` no texto |
| `contraparte` | `"tesouro"` | de quem vem ou para quem vai o `dinheiro` do bloco: o mercado, se nada for dito; o tesouro (imposto, multa, título do governo), o banco ou os parentes. A dívida é sempre com o banco. O livro guarda a contraparte, e o extrato a mostra |
| `marcas`, `removerMarcas` | `["fumante", "ator.desempregado"]` | a qualidade guarda ano, idade e a entrada que a gravou |
| `qualidades` | `{ "paquera": 1 }` | soma a um contador |
| `personagens` | `["amor"]` | cria `amor`, `filho`, `paixao` ou `pet` (pessoas nascem com traço) |
| `promover` | `{ "de": "paixao", "para": "amor" }` | o primeiro amor vira o amor atual |
| `agendar` | `[{ "evento": "nome_sujo", "em": [2, 3] }]` | daqui a N anos; o agendado herda o ator |
| `matar` | `"ator"` | um personagem morre (luto, herança, viuvez) |
| `morte` | `"num acidente de moto"` | quem joga morre; completa "morreu aos N anos, …" |
| `realocar` | `{ "de": "acoes", "para": "renda_fixa", "fracao": 1 }` | move dinheiro entre a conta e as classes investidas |
| `venderTitulos` | `1` ou `0.5` | vende essa fração de cada título do Tesouro pelo preço do dia (o juro que caiu dá lucro, o que subiu dá prejuízo) |
| `comprarTitulo` | `{ "fracao": 0.6, "prazo": 10 }` | empresta ao governo essa fração da conta num título do Tesouro (5, 10 ou 20 anos); sem como comprar, vai para a renda fixa |
| `abrirEmpresa` | `{ "setor": "comercio", "valor": 30000 }` | abre a empresa de quem joga (uma por vez): `setor` ou `copiarSetor` (`"ator.setor"`); `valor` (o trabalho criou, ninguém paga), `capital` (quem joga põe) ou `fracao` do dinheiro de `de` (o negócio da família: `"de": "ator"`); `participacao` e `tracao` opcionais; `{capital}` no texto |
| `empresaFator` | `0.7` | multiplica o valor da empresa (o contrato grande, a crise do setor) |
| `rodada` | `{ "parte": 0.2 }` | investidores compram 20% pelo valor de agora: o dinheiro entra na empresa e a parte de quem joga encolhe; `{rodada}` no texto |
| `venderEmpresa` | `{ "fracao": 1, "premio": 1.5 }` | vende a fração da parte de quem joga pelo valor × prêmio; vendeu tudo, a empresa sai da vida; `{venda}` no texto |
| `fecharEmpresa` | `{ "sobra": 0.1 }` | a empresa fecha e volta a fração `sobra` da parte; `{sobra}` no texto |
| `venderSubsidiarias` | `{ "quantas": 1, "premio": 1.5 }` ou `{ "fracao": 0.3 }` | a empresa vende subsidiárias pelo que valem × prêmio (cada uma vale valor ÷ (subsidiárias + 2)); a parte de quem joga vira dinheiro; `{venda}` no texto |
| `abrirCapital` | `true` | a empresa vai para a bolsa, como na folha: vale 20% mais, quem joga vende 20% da parte na estreia (`{venda}`), a dependência cai 15 e ela ganha `empresa.na_bolsa` |
| caminhos de poder | `"eu.influencia": 5`, `"eu.popularidade": -8`, `"eu.fama": 10`, `"eu.cargo": { "definir": "rei" }` | a coroa e o Regime entram assim; eleição é pela folha Carreira |
| caminhos de carreira | `"eu.carreira": { "definir": "ator" }`, `"eu.nivel": 1` | dá uma profissão (com `renda` e `eu.setor`); trocar `eu.setor` ou zerar a renda sem `eu.carreira` encerra a carreira |
| `pais.impulso` | `1.5` | decreto que aquece a economia (mais crescimento, inflação e dívida); some pela metade a cada ano |
| `pais.pol_<política>` | `"pais.pol_social": 1` | quem governa muda uma política (0 a 2): as estatísticas andam para o novo alvo nos anos seguintes |
| `pais.divida`, `pais.inflacao` | `-5`, `1` | o decreto que paga dívida ou que solta a inflação |
| caminho na empresa | `"empresa.tracao": 2`, `"empresa.valor": -30000`, `"empresa.retirada": { "definir": 0 }` | sem empresa, não faz nada |

A qualidade `empresa.sustenta` (gravada junto com `abrirEmpresa`) diz que a renda de quem joga vem dela: quando ela é vendida ou fecha, a renda vai a zero e as qualidades de dono (`empreendedor`, `socio`, `herdeiro_negocio`) somem.

## Texto

- Globais: `{nome}`, `{sobrenome}`, `{nomeCompleto}`, `{cidade}`, `{uf}`, `{idade}`, `{ano}`, `{dinheiro}`, `{patrimonio}`, `{salario}`, `{divida}`.
- Personagens pelo papel (`{mae}`, `{avo}`, `{amor}`, `{pet}`) e pelo ator (`{ator}`); a empresa pelo nome (`{empresa}`, `{empresa.valor}`, `{empresa.funcionarios}`, `{empresa.subsidiarias}`), só em texto cujo storylet exige a empresa ou que a abre. O artigo concorda com o nome: `{empresa:O|A} {empresa}`, `d{empresa:o|a} {empresa}`, `n{empresa:o|a} {empresa}` ("o Instituto Silva", "da Clínica Silva", "no Grupo Silva"). Caminhos: `{mae.ocupacao}`, `{lugar.nome}`, `{ator.quem}` ("sua mãe", "seu avô", "sua amiga Ana"). Campos em reais saem formatados (R$ 4,5 mil).
- `{o|a}` concorda com quem joga; `{ator:o|a}` e `{amigo:o amigo|a amiga}` concordam com um personagem.
- `[uma|outra|mais uma]` sorteia uma alternativa (pode conter variáveis): variedade barata entre vidas.
- **Trechos** escolhem um pedaço de texto pelo estado: o primeiro cuja condição vale; o último não tem condição (é o padrão).

  ```json
  "trechos": { "escola": [
    { "se": { "classe_origem": { "min": 4 } }, "texto": "escola particular bilíngue" },
    { "se": { "classe_origem": { "min": 2 } }, "texto": "escolinha do bairro" },
    { "texto": "escola municipal, com fila no portão" } ] }
  ```

- Personagem criado no meio da vida (`{amor}`, `{filho}`, `{paixao}`, `{pet}`) só aparece em texto cujo storylet, escolha ou trecho **exija a qualidade** gravada junto com ele, ou no desfecho que o cria, ou quando ele é o ator (o validador cobra).
- Política é fictícia e genérica: nunca dê nome próprio a partido ou político (o validador recusa "Partido Fulano").

## Qualidades, leitores e cadeias

Uma escolha grava uma qualidade; anos depois, um storylet a exige ou ela é agendada direto. Cada elo vira causa no grafo, e as causas com mais consequências viram os pontos de virada.

- **Todo campo ou qualidade escrito precisa de leitores em pelo menos dois sistemas, e de pelo menos uma leitura que decida algo** (condição de storylet, de escolha, regra do motor). Texto, epitáfio e efeito passivo contam como sistemas, mas não decidem. O validador bloqueia o contrário; as regras do motor declaram o que leem e escrevem em `src/motor/manifesto.ts`.
- Toda qualidade consultada precisa ser criada por algum efeito ou regra.
- Efeito passivo (`porAno`) e epitáfio ficam em `conteudo/marcas.json`.
- Prefira cadeias longas (3+ anos) e desfechos diferentes conforme a escolha.

## Catálogos (incremento 4)

`mundo.json` tem quatro catálogos que o jogador usa pelas folhas, e que o conteúdo lê pelas qualidades e campos que eles gravam:

- `bens`: preço, manutenção, valorização, aluguel, conforto, status, a qualidade (`marca`) que quem tem ganha, idade mínima, se é financiável.
- `carreiras`: nome (`"médico|médica"`), setor, requisitos (condições), o que a interface mostra como requisito, chance, talento, salário do primeiro e do último cargo, cargos, chance de promoção, fama no topo, estável (concurso), idade para tentar e para parar.
- `cargos`: eletivos (municipal, geral) e vitalícios (rei, ditador): idade, influência mínima, dificuldade, campanha, salário, mandato, influência que dá e, no Executivo, `seguidos` (prefeito, governador e presidente: dois mandatos seguidos, e o terceiro aparece desabilitado com o motivo).
- `linhagens`: classe, qualidades de quem nasce, o papel do pai ou da mãe (ocupação, setor, qualidade e, se vive do que tem, `patrimonio`), qualidades do país, influência e fama iniciais. Cada linhagem tem um texto em `nascimento` que pede a qualidade dela.

Os arquivos de storylet do incremento 4: `96-linhagens`, `97-carreiras` (profissões e fama), `98-bens`, `99-poder` (política, decretos, queda do cargo, lobby, truste, testamento).

## Linhas, mortes, mundo

- `linhas.json`: `{ "idade": [30, 49], "texto": "...", "condicoes": {...}, "peso": 1 }`. Linha com condição é o jeito mais barato de a vida lembrar de escolhas antigas e do lugar onde se vive.
- `mortes.json`: `{ "causa": "de ...", "categoria": "violencia", "idade": [18, 75], "condicoes": {...}, "peso": 2 }`. Categorias: velhice, coração, doença, acidente, violência.
- `mundo.json`: nomes, sobrenomes, bichos, cidades (com qualidades de lugar), os países de fora e as notícias deles (ver "O mundo lá fora"), as 8 classes (patrimônio, renda, poupança, saúde, ocupações com setor, negócio; a ocupação com `"patrimonio": true` vive do que tem: não é demitida nem nasce desempregada, e na crise perde parte do patrimônio), os 4 tipos de família (vínculo, traços), os traços de personagem e de quem joga, como morrem os personagens (por idade), os textos das regras (adoeceu, perdeu o emprego, faliu, perdeu patrimônio, não apareceu, morreu…), que podem ter `trechos` escolhidos pelo estado, como os storylets (a demissão de quem é rico não vem com cesta básica), os 12 **setores** (quanto sentem o ciclo, quanto crescem, se são estáveis, quanto sentem o dólar e a tarifa), as 4 **fases** da economia (o nome do crescimento: só os textos que anunciam cada uma e, em `choque`, os de quando foi a crise lá fora ou a alta das commodities), as 6 **políticas** (níveis, descrição para a folha País, o que cada nível faz nas contas, nas estatísticas e no bolso, e o texto da reforma ao subir e ao baixar), os **governos** (blocos fictícios com as políticas que adotam, a promessa, emendas e governabilidade; o regime não é eleito), nascimento e epitáfios genéricos. Em `mortes.json`, `daViolencia: true` marca as causas que só servem para a morte pela violência do país.

## Guia de escrita

- Segunda pessoa ("você"), presente no `texto`, passado nos `resumo`s.
- Curto: duas ou três frases por storylet; uma por desfecho. É celular.
- Leve e às vezes irônico; a ironia mira a situação (o banco, o boleto, o grupo da família), nunca a pessoa ou a pobreza.
- Brasil de verdade: ENEM, concurso, CLT, bico, Pix, inflação, SUS, INSS, feira, padaria, laje, seca, cheia do rio. Sem marcas comerciais.
- Escreva para o estado: o mesmo acontecimento é outro para quem nasceu pobre ou rico, no sertão ou na capital, com mãe carinhosa ou pai ausente. Condições e trechos fazem isso sem duplicar storylets.
- Toda opção precisa valer alguma coisa: segura com pouco ganho, ousada com mais ganho esperado e risco real, tentação com prazer agora e custo depois. O túnel aponta "falsos dilemas" e eventos em que arriscar nunca compensa.
- Varie a ordem das opções: a primeira não pode ser sempre a boa (o robô "primeira" mede isso).
- Morte e luto com cuidado: a graça, quando houver, vem do afeto.

## Checklist de um storylet novo

1. `npm run validar` sem erros.
2. O que ele grava é lido por algo que decide; o que ele consulta é criado por algo.
3. `npm run vida -- <semente> aleatoria` até vê-lo numa vida e ler o texto renderizado.
4. `npm run tunel`: nenhum storylet morto, nenhuma estratégia dominante; veja a frequência dele.

## Primeira infância

Os anos até os 4 decidem muito, e a ordem é a da vida real: o parto (`prematuro`, pelo motor), quem cuida (`creche`, `criado_pela_vo`, `criado_pela_baba`, `mae_em_casa`), nutrição e vacina (`desnutricao`, `sem_vacina`), estímulo (`leitura_na_infancia`, `telas_cedo`, `musica_cedo`), estresse em casa (`ansiedade_cedo`) e pré-escola (`pre_escola`, `fala_ingles`).

- **Cada marca volta depois** num evento dos 5 aos 12 que a consulta (a linha do tempo mostra "Porque aos 2, …"). Precisa também de um segundo leitor: um epitáfio em `marcas.json` ou uma linha curta em `linhas.json`.
- **Decisões de bebê:** quando a decisão é da família (quem cuida, vacina, pré-escola), o texto diz quem decide, e quem joga escolhe por ela.
- **Opções pela família:** a opção depende de quem está perto (`pai.ausente`, `avo.vivo`, `avo.mora_junto`) e da classe (babá, plano de saúde, escola bilíngue).
- **Ações dos 1 aos 4 anos:** o jeito do ano de uma criança pequena (ouvir histórias, correr no quintal, colo da vó). Como toda ação, mexem em 2 sistemas.

## Jogadas (brincar de deus)

O que só dá para fazer com muito dinheiro. Uma jogada é um storylet `"tipo": "jogada"` com `rotulo` (o nome na lista, até 28 caracteres), `idade`, `condicoes` (em geral `"patrimonio": { "min": … }` e `semMarcas` com a marca que ela deixa) e `escolhas`. Não usa `verbo`, `ator`, `marco`, `apenasAgendado` nem `repetivel`: repete com `intervalo`, e as condições dizem quando.

- **Preço:** o `dinheiro` negativo dos efeitos certos da escolha (mais o `capital` de `abrirEmpresa`). Sem esse valor na mão (conta e investimentos), a opção aparece bloqueada com "precisa de R$ X na mão": jogada não se faz no fiado. A lista mostra "a partir de" a opção mais barata.
- **Não precisa de escolha sem condição:** a jogada não trava a vida, porque a folha tem "Voltar". Em compensação, cada escolha precisa mexer em 2 sistemas ou mais.
- **O mundo responde:** a jogada deixa uma marca e agenda a reação (`agendar`), que é um evento comum, de preferência `apenasAgendado` e repetível quando a jogada pode se repetir. A entrada da jogada vira causa da reação. O túnel mede quantas jogadas causam algum acontecimento depois (portão: 50% ou mais).
- **Jogadas na empresa:** uma jogada cuja condição exige a empresa (`"empresa.valor": { "min": … }`) aparece na seção Empresa da folha, em "Quem manda", não em Brincar de deus. O custo pode sair da própria empresa (`empresaFator: 0.995`): a opção mostra "R$ X da empresa", não bloqueia pelo dinheiro na mão e não sai da conta.
- **Quem manda (`empresa.dependencia`, de 0 a 100):** quanto a empresa depende de quem manda nela. Nasce em 80 (com sócios, 80 × a parte de quem joga). Só muda por decisão: escolhas e jogadas escrevem `"empresa.dependencia": -25` (delegar) ou `+20` (centralizar), ou `{ "definir": 5 }` (sair de cena). Condições como `"empresa.dependencia": { "min": 70 }` dão os eventos de quem centraliza (férias que param a empresa, tudo pela sua mesa); `{ "max": 25 }`, os de quem delegou (a empresa atravessa a crise sem você). O motor lê a dependência no ritmo, na morte e na venda (ver `docs/motor.md`).

