# Conteúdo: formato e guia de escrita

Todo conteúdo é dado. Os storylets ficam em `conteudo/storylets/*.json` (por tema: `00-infancia` a `40-velhice`, `50-familia` e `55-relacoes` para iniciativas de personagens, `60-acoes` para a ficha do ano, `70-origem` e `80-variedade` para o que depende de classe, família, região e traço, `85-carreira` a `89-lugar-e-fase` para curso, setor, ciclo da economia, riqueza e padrão de vida). Depois de mexer, rode `npm run validar`; antes de subir, `npm run tunel`.

## Storylet

Evento, ação e iniciativa de personagem têm o mesmo formato. O `tipo` diz quem escolhe:

| `tipo` | Quem escolhe | Como aparece |
|---|---|---|
| `evento` (padrão) | o diretor, por saliência | cartão com opções, ou acontecimento sem escolha |
| `npc` | a regra do personagem do `ator` (chance pela tensão × afinidade do traço) | sem escolha, acontece na hora; com escolha, disputa o ano com os eventos |
| `acao` | o jogador, pela ficha do ano (`verbo` + `rotulo`) | entrada da linha do tempo com a etiqueta do verbo |

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
| `tipo` | `evento`, `npc` ou `acao` |
| `ator` | papéis que podem ocupar `{ator}` (`mae`, `pai`, `avo`, `amigo`, `amor`, `filho`, `paixao`, `pet`); cada papel é uma instância diferente |
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
  "classe": { "max": 1 }, "classe_origem": { "min": 4 },       // classe atual (pelo patrimônio) e de origem, 0 a 5
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

A fase da economia é uma qualidade do país (`pais.expansao`, `pais.recessao`, `pais.crise`; no normal, nenhuma). Storylet que a consulta tem a entrada que anunciou a fase como causa: o cartão da vida pode contar "o país entrou em crise → você perdeu o emprego".

## Efeitos

| Efeito | Exemplo | Nota |
|---|---|---|
| atributos | `"saude": -3` | limitados a 0–100 |
| caminho | `"mae.vinculo": 10`, `"ator.saude": 5`, `"ator.ocupacao": { "definir": "aposentada" }` | soma, ou define |
| `dinheiro` | `-1500` | faltando, resgata investimento e depois vira dívida |
| `investir` | `10000` | move da conta para o investido (o que houver) |
| `divida`, `dividaFator` | `35000`, `0.3` | dívida nova (negativo é desconto); acordo que deixa 30% |
| `patrimonioFator` | `0.5` | multiplica conta e investido (golpe, sociedade que quebrou) |
| `renda`, `custo` | `20000` ou `{ "definir": 26000 }` | anuais, reais de hoje |
| `rendaFator`, `custoFator` | `0.8`, `0.5` | multiplicam a renda (corte de salário, proposta) e o custo anual (cortar o padrão) |
| `custoDoPatrimonio` | `0.06` | soma ao custo anual 6% do patrimônio de agora (subir de padrão com a herança) |
| caminho com `copiar` | `"eu.setor": { "copiar": "pai.setor" }` | copia o valor de outro caminho da mesma espécie |
| `transferir` | `{ "de": "ator", "para": "eu", "fracao": 0.2, "max": 30000 }` | dinheiro de uma pessoa para outra; `{transferido}` no texto |
| `marcas`, `removerMarcas` | `["fumante", "ator.desempregado"]` | a qualidade guarda ano, idade e a entrada que a gravou |
| `qualidades` | `{ "paquera": 1 }` | soma a um contador |
| `personagens` | `["amor"]` | cria `amor`, `filho`, `paixao` ou `pet` (pessoas nascem com traço) |
| `promover` | `{ "de": "paixao", "para": "amor" }` | o primeiro amor vira o amor atual |
| `agendar` | `[{ "evento": "nome_sujo", "em": [2, 3] }]` | daqui a N anos; o agendado herda o ator |
| `matar` | `"ator"` | um personagem morre (luto, herança, viuvez) |
| `morte` | `"num acidente de moto"` | quem joga morre; completa "morreu aos N anos, …" |

## Texto

- Globais: `{nome}`, `{sobrenome}`, `{nomeCompleto}`, `{cidade}`, `{uf}`, `{idade}`, `{ano}`, `{dinheiro}`, `{patrimonio}`, `{salario}`, `{divida}`.
- Personagens pelo papel (`{mae}`, `{avo}`, `{amor}`, `{pet}`) e pelo ator (`{ator}`). Caminhos: `{mae.ocupacao}`, `{lugar.nome}`, `{ator.quem}` ("sua mãe", "seu avô", "sua amiga Ana"). Campos em reais saem formatados (R$ 4,5 mil).
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

## Linhas, mortes, mundo

- `linhas.json`: `{ "idade": [30, 49], "texto": "...", "condicoes": {...}, "peso": 1 }`. Linha com condição é o jeito mais barato de a vida lembrar de escolhas antigas e do lugar onde se vive.
- `mortes.json`: `{ "causa": "de ...", "categoria": "violencia", "idade": [18, 75], "condicoes": {...}, "peso": 2 }`. Categorias: velhice, coração, doença, acidente, violência.
- `mundo.json`: nomes, sobrenomes, bichos, cidades (com qualidades de lugar), as 6 classes (patrimônio, renda, poupança, saúde, ocupações com setor, negócio), os 4 tipos de família (vínculo, traços), os traços de personagem e de quem joga, como morrem os personagens (por idade), os textos das regras (adoeceu, perdeu o emprego, faliu, morreu…), os 12 **setores** (quanto sentem o ciclo, quanto crescem, se são estáveis), as 4 **fases** da economia (peso, chances de transição, o que somam à inflação, ao rendimento, ao desemprego e aos salários, e os textos que anunciam cada uma), nascimento e epitáfios genéricos.

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
