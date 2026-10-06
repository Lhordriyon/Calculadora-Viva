# Conteúdo: formato e guia de escrita

Todo conteúdo é dado. Eventos ficam em `conteudo/eventos/*.json` (um arquivo por fase, em ordem: `00-infancia`, `10-adolescencia`, `20-juventude`, `30-adulto`, `40-velhice`). Depois de mexer, rode `npm run validar`; antes de subir, `npm run tunel`.

## Evento

```json
{
  "id": "cartao_credito",
  "idade": [18, 26],
  "peso": 3,
  "condicoes": { "semMarcas": ["rotativo"] },
  "valores": { "limite": 3000 },
  "texto": "Chegou seu primeiro cartão, com limite de {limite}.",
  "resumo": "recebeu o primeiro cartão de crédito",
  "escolhas": [ ... ]
}
```

| Campo | Para quê |
|---|---|
| `id` | único, `minusculas_com_sublinhado` |
| `idade` | faixa `[min, max]` em que pode ser sorteado (obrigatória, exceto em `apenasAgendado`) |
| `apenasAgendado` | só acontece quando outro efeito o agenda |
| `marco` | quando elegível, acontece sem sorteio (ENEM, primeiro emprego, aposentadoria) |
| `peso` | chance relativa no sorteio (padrão 1) |
| `repetivel` / `intervalo` | pode voltar na mesma vida, com intervalo mínimo em anos (padrão 5) |
| `condicoes` | ver abaixo |
| `valores` | quantias em reais de hoje, usadas no texto como `{nome}` |
| `texto` | o cartão do evento (até ~280 caracteres) |
| `resumo` | frase no passado que completa "aos 34, …" no cartão da vida |
| `escolhas` | de 1 a 4; pelo menos uma sem condição |
| `efeitos` | para acontecimentos sem escolha (no lugar de `escolhas`) |

## Escolha

```json
{
  "texto": "Pagar só o mínimo da fatura",
  "resumo": "pagou só o mínimo da fatura e conheceu o rotativo",
  "condicoes": { "dinheiro": { "min": 3000 } },
  "bloqueio": "texto mostrado quando a condição não deixa escolher",
  "efeitos": { "felicidade": -1 },
  "resultado": { "texto": "O que aconteceu.", "efeitos": { "divida": 6000, "marcas": ["rotativo"] } }
}
```

- `texto` é o botão (curto: até ~45 caracteres).
- `resumo` completa "aos 17, você …" no cartão da vida. Comece com minúscula, no passado.
- Sem sorte envolvida: `resultado`. Com sorte: `teste` + `sucesso` + `fracasso`.
  - `"teste": { "chance": 0.3 }` — sorte pura.
  - `"teste": { "atributo": "inteligencia", "dificuldade": 60 }` — chance de `0,5 + (atributo − dificuldade)/50`, entre 5% e 95%.
- Um desfecho pode ter `resumo` próprio quando o resultado é o que importa ("passou no concurso").
- Opção com condição não atendida aparece desabilitada, com o `bloqueio` (ou "precisa de R$ X").

## Condições

```jsonc
{
  "saude": { "min": 40 }, "felicidade": { "max": 30 }, "inteligencia": {}, "aparencia": {},
  "dinheiro": { "min": 5000 },      // dinheiro em conta (reais de hoje)
  "patrimonio": { "min": 25000 },   // conta + investido − dívida: use para compras
  "divida": { "min": 20000 }, "renda": { "max": 0 }, "inflacao": { "min": 9 },
  "genero": "f",
  "marcas": ["todas", "estas"], "algumaMarca": ["uma", "destas"], "semMarcas": ["nenhuma"],
  "marcaHa": [{ "marca": "fumante", "min": 12 }]   // existe há pelo menos 12 anos
}
```

## Efeitos

| Efeito | Exemplo | Nota |
|---|---|---|
| atributos | `"saude": -3` | limitados a 0–100 |
| `dinheiro` | `-1500` | faltando, vira dívida (resgata investimento antes) |
| `investir` | `1000000` | move da conta para o investido (o que houver) |
| `divida` | `35000` / `-8000` | dívida nova / desconto (para pagar com dinheiro, some um `dinheiro` negativo) |
| `renda`, `custo` | `20000` ou `{ "definir": 26000 }` | anuais, reais de hoje |
| `marcas`, `removerMarcas` | `["fumante"]` | a marca guarda ano, idade e a escolha que a gravou |
| `personagens` | `["amor"]` | cria um nome novo para `amor`, `filho`, `paixao` ou `pet` |
| `promover` | `{ "de": "paixao", "para": "amor" }` | o primeiro amor vira o amor atual |
| `agendar` | `[{ "evento": "nome_sujo", "em": [2, 3] }]` | daqui a N anos (fixo ou faixa) |
| `morte` | `"num acidente de moto"` | completa "morreu aos N anos, …" |

## Texto

- `{nome}`, `{sobrenome}`, `{nomeCompleto}`, `{cidade}`, `{uf}`, `{idade}`, `{ano}`, `{dinheiro}`, `{patrimonio}`, `{salario}`, `{profissao_mae}`, `{profissao_pai}`, os personagens (`{mae}`, `{pai}`, `{avo}`, `{amigo}`, `{amor}`, `{filho}`, `{paixao}`, `{pet}`) e os `valores` do evento.
- `{o|a}` concorda com o gênero de quem joga: `cansad{o|a}`, `vereador{|a}`.
- `{amigo:o amigo|a amiga}` concorda com o gênero de um personagem.
- `[uma|outra|mais uma]` sorteia uma alternativa (pode conter variáveis). Alternância é combinatória barata: use em eventos que se repetem entre vidas.
- Personagem criado no meio da vida (`{amor}`, `{filho}`, `{paixao}`, `{pet}`) só aparece em texto cujo evento ou escolha **exija a marca** gravada junto com ele (o validador cobra), ou no desfecho que o cria.

## Marcas e cadeias

Uma escolha grava uma marca; anos depois, um evento a exige (`marcas`, `algumaMarca`, `marcaHa`) ou ela é agendada direto. Cada elo vira causa no grafo, e as escolhas com mais consequências viram os pontos de virada do cartão da vida.

- Toda marca consultada precisa ser criada por algum efeito (o validador cobra) e toda marca criada deve servir para algo: evento, escolha, linha, causa de morte, efeito passivo ou epitáfio (o túnel lista as inertes).
- Efeito passivo e epitáfio ficam em `conteudo/marcas.json`.
- Prefira cadeias longas (3+ anos) e com desfechos diferentes conforme a escolha. Ex.: `vape_festa` grava `fumante` → `tosse_cronica` exige `marcaHa ≥ 12` → a causa de morte pulmonar consulta `fumante`.

## Linhas, mortes, mundo

- `linhas.json`: `{ "idade": [30, 49], "texto": "...", "condicoes": {...}, "peso": 1 }`. Linhas com condição em marcas são o jeito mais barato de a vida "lembrar" de escolhas antigas.
- `mortes.json`: `{ "causa": "de ...", "idade": [70, 120], "condicoes": {...}, "peso": 2 }`. A causa completa "morreu aos N anos, …".
- `mundo.json`: nomes, sobrenomes, cidades (com marcas de região), famílias (marca e profissões), textos de nascimento e epitáfios genéricos.

## Guia de escrita

- Segunda pessoa ("você"), presente no `texto`, passado nos `resumo`s.
- Curto: duas ou três frases por evento; uma por desfecho. É celular.
- Leve e às vezes irônico; a ironia mira a situação (o banco, o boleto, o grupo da família), nunca a pessoa ou a pobreza.
- Brasil de verdade: ENEM, concurso, CLT, bico, Pix, inflação, SUS, INSS, feira, padaria. Sem marcas comerciais.
- Toda opção precisa valer alguma coisa: segura com pouco ganho, ousada com mais ganho esperado e risco real, tentação com prazer agora e custo depois. O túnel aponta "falsos dilemas" (uma opção melhor em tudo) e eventos "sem tensão" (a opção mais segura também é a de maior valor).
- Varie a ordem das opções: a primeira não pode ser sempre a boa (o robô "primeira" mede isso).
- Morte e luto com cuidado: a graça, quando houver, vem do afeto.

## Checklist de um evento novo

1. `npm run validar` sem erros.
2. A marca que ele grava é consultada por algo; a que ele consulta é criada por algo.
3. `npm run vida -- <semente> aleatoria` até vê-lo numa vida e ler o texto renderizado.
4. `npm run tunel`: nenhum evento morto, nenhuma estratégia dominante; veja a frequência dele.
