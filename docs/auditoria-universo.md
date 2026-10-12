# Auditoria para o universo de bolso (12/10/2026)

Pergunta: contra a missão "Universo de bolso" (vida, patrimônio, empresas, Estados e sistema internacional, com contas que fecham, causalidade rastreável e agentes com mandato), o que o Trajetória já tem? O que está incompleto, ausente, repetido ou frágil?

Base: `main` em `07cb03c`. A auditoria anterior (`docs/auditoria.md`, 11/10) olhou o produto por primeiros princípios; esta olha a missão nova e não repete aquela.

**Método.**
- **Cinco auditores de leitura**, um por área:
  - núcleo temporal e causalidade;
  - entidades, pessoas e agentes;
  - dinheiro e empresas;
  - país e mundo;
  - persistência, interface e testes.
  Cada achado vem com arquivo e linha. Os que sustentam decisões eu conferi no código e estão marcados "conferido".
- **Quatro sondas próprias**, scripts fora do repositório:
  - de onde vem e para onde vai o dinheiro (450 vidas, três estratégias);
  - quanto custa um ano do país;
  - o tamanho do save;
  - os ciclos de import.
- **Classificação:**
  - existe: funciona e tem teste;
  - incompleto;
  - ausente;
  - redundante;
  - frágil: funciona, mas quebra fácil, não tem teste ou tem regra duplicada.

## Linha de base

| Medida | Valor | Fonte |
|---|---|---|
| Testes | 197 casos em 20 arquivos; 32 s | `npx vitest run` |
| Túnel | 10.000 vidas; zero storylets mortos; nenhuma estratégia domina | `docs/metricas.md` |
| Portões que reprovam (não travam o CI) | CPU 88,49 ms por vida (teto 30); Spearman entre gerações 0,81 (teto 0,8); bilionário feito 1,71% (teto 1%); assinaturas 903 (piso 918) | `docs/metricas.md` |
| CPU por vida | mediana 72 ms, p90 91 ms (sonda, outra máquina) | sonda |
| Save (o estado no fim da vida) | mediana 275 KB, p90 386 KB, máximo 447 KB | sonda |
| Livro por vida | mediana 380 entradas, p90 555 | sonda |
| Dinheiro sem contrapartida | 86,6% das 99.375 entradas que mexem em dinheiro | sonda |
| Um ano do país | 0,23 ms (o mundo lá fora, 4 países: 0,0125 ms) | sonda |
| Código | motor: 9.428 linhas em 37 módulos; interface: 2.812; scripts: 1.949; testes: 3.397 | `wc -l` |
| Conteúdo | 554 eventos, 84 iniciativas de personagem, 93 ações, 19 jogadas, 1.492 escolhas, 232 linhas, 31 causas de morte | `npm run validar` |
| Bundle | 1,09 MB de JS (311 KB comprimido) | `vite build` |
| Ciclos de import no motor | 1: `carteira → fortuna → storylets → efeitos → carteira` | sonda |

## Inventário

### 1. Núcleo temporal e sistema de eventos

| Funcionalidade | Situação | Evidência |
|---|---|---|
| O ano | Frágil | `vida.ts › avancarAno` (166-223), na ordem do código: exterior, país, mercado, economia, empresa, bens, privação, personagens, trabalho, carreira, poder, padrão, morte, diretor. Nenhum teste fixa a ordem; `docs/motor.md` não situa bens, carreira, poder e privação |
| Leituras escondidas no mesmo ano | Frágil | Os bens leem `pais.ret_fii` que o mercado gravou no estado (`bens.ts:212`); o poder lê a fama que a carreira acabou de mudar (`poder.ts:123`); a retirada e o aluguel entram depois da economia e escapam do padrão de vida; a parcela e a manutenção viram dívida sem limite de crédito |
| Storylets (evento, ação, iniciativa, jogada), elegibilidade, saliência e diretor | Existe | 750 storylets: 554 eventos (16 marcos, 64 só agendados, 140 repetíveis), 93 ações, 84 iniciativas, 19 jogadas. `storylets.ts:50-64`, `diretor.ts:32-110`; `vida.test.ts:64-79, 183-244`. A saliência não tem teste próprio |
| Um storylet do diretor por ano | Frágil | O agendado passa na frente do marco (`diretor.ts:95` antes de 97-100): um marco de janela de um ano se perde se cair num ano com agendado |
| Atrasos | Incompleto | Agenda com prazo fixo ou faixa, `marcaHa`, saliência que dobra com causa fresca, estoques que andam devagar. Não há atraso como conceito |
| Invalidação de agendados | Frágil | Um agendado que deixou de valer some sem registro nem motivo (`diretor.ts:91-93`, conferido); o adiamento não tem limite; o agendamento do conteúdo não deduplica |
| Determinismo | Existe | mulberry32 no estado; nenhum `Math.random`, `Date` ou `performance.now` em `src/motor`; testes com save no meio (`vida.test.ts:81-91`). Risco: a interface e os robôs chamam `jogadasDe`, que renderiza texto com o `rng` da vida; hoje nenhuma jogada tem alternância no rótulo |
| Custo por ano | Frágil | `anotar` faz busca linear a cada mudança, O(k²) por entrada (`livro.ts:16-25`, conferido); `causaDaRelacao` varre o histórico inteiro; o portão de CPU reprova e não trava o CI (só as três metas permanentes travam, conferido em `tunel.ts`) |

### 2. Personagens, atributos, decisões e memória

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Entidades | Existe | 6 tipos, 92 campos (17 derivados) em 6 tabelas (`campos.ts`); caminhos `ent.campo` |
| Tabela de campos pelo id | Frágil | A tabela sai do prefixo do id, não do tipo: o bicho recebe os 41 campos de pessoa (`campos.ts:182-189`) |
| Identidade de personagem | **Frágil** | O papel é o id (`pessoas.ts:46`): quem chega apaga quem estava. Em 300 vidas, o amor foi sobrescrito em 35 (até 3 amores seguidos). Um filho por vez; a adoção pode sobrescrever o filho. O ex continua no papel até o próximo namoro apagá-lo, e o dinheiro dele some |
| Relações entre personagens | Ausente | O vínculo é sempre com quem joga; irmãos são só um número |
| Personagens que agem sozinhos | Incompleto | Regras anuais (saúde, morte, emprego, falência, poupança, vínculo) e 84 iniciativas por chance (0,22 × tensão × afinidade). Sem objetivos próprios. A paixão não envelhece nem morre |
| Qualidades como memória | Existe | `{v, ano, idade, causa}`; o conteúdo grava 179 qualidades distintas; 124 epitáfios |
| Qualidades na vida do herdeiro | **Frágil** | `recausar` troca só a causa (`herdeiro.ts:205-208`, conferido): a idade em que a qualidade nasceu continua sendo a da geração anterior, e `marcaHa` erra a partir da 2ª geração |
| Origem procedural e criação do personagem | Existe | 8 classes, 4 tipos de família, 9 linhagens, 55 cidades, irmãos; o jogador escolhe tudo ou nada (`origem.ts`, `Abertura.tsx`). Os limites de irmãos divergem (0–5 na tela, 0–6 no motor, 0–8 no campo) |
| Memória entre vidas | Incompleto | Recência por instância de storylet, que cai pela metade a cada vida, só na saliência (`memoria.ts`). Sem teste unitário. Linhas, ações e mortes ficam fora |

### 3. Dinheiro, inflação, juros, investimentos, dívidas e transações

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Contas de quem joga: dinheiro, cinco classes investidas, dívida, renda, custo, padrão de vida e perfil | Existe | `campos.ts:32-48`; testes em `economia.test.ts` |
| O ano econômico: inflação, rendimento, juros, imposto, auxílio, sobra, gasto pelo padrão, velhice | Existe | `economia.ts › economiaDoAno` (128-170); `economia.test.ts:19-98` |
| Contrapartida do dinheiro | **Ausente** | 86,6% das 99.375 entradas que mexem em dinheiro (450 vidas) criam ou destroem dinheiro (sonda). Ninguém paga salário, piso, auxílio, rendimento ou aluguel, e ninguém recebe custo, imposto, juros ou manutenção. Só fecham `transferir` entre pessoas, a herança entre personagens e as trocas de dinheiro por bem |
| Livro de partidas dobradas | **Ausente** | O livro anota o saldo líquido de cada campo: o ano econômico inteiro vira uma só variação de `eu.dinheiro` (`economia.ts:168`, exigido em `economia.test.ts:43`). O teste "começo + Σ = fim" passa mesmo com dinheiro criado do nada |
| Dívida | **Frágil** | É um número (`eu.n.divida`), não um contrato. Nasce sozinha quando o dinheiro fica negativo (`acertarCaixa`, `economia.ts:73-84`), pelo efeito `divida` (24 usos) e pelo déficit do ano. Juros reais de 22% + (Selic − 9,2), só até o limite de crédito (max(R$ 30 mil, 2 rendas)); acima dele, congela. Amortiza sozinha com qualquer dinheiro positivo. Sem credor, prazo, parcela, atraso ou inadimplência; "nome sujo" é só uma marca do conteúdo |
| Dívida que some | **Frágil** | Na morte (`herdeiro.ts › partilhar`, conferido: o que o espólio não cobre desaparece, sem credor que perca); no acordo do conteúdo (`dividaFator: 0.3`, `30-adulto.json:980`); com dívida negativa (`economia.ts:193`) |
| Limite de crédito | **Frágil** | Só vale no déficit do ano. Criam dívida sem limite: o efeito `divida`, a parcela e a manutenção dos bens (`bens.ts:237`), os eventos caros (`storylets.ts:142`) e gastos de menor de idade |
| Investimentos | Existe | Cinco classes, três perfis, mercado do ano por fase, juro real e câmbio (`carteira.ts:48-62`); teto de R$ 5 tri (`CAPACIDADE_DO_MERCADO`). O retorno multiplica o saldo: não sai de juros que alguém paga nem de lucro de empresa |
| Inflação | Existe | Corrige só o dinheiro parado (`economia.ts:133-135`); o investido rende o retorno real |
| Impostos | **Incompleto** | O imposto de renda é um ajuste de −4%, 0 ou +4% na renda (`economia.ts:150-151`), não um valor recolhido; o imposto de herança é 4% (ou 1% com a lei). Nada chega ao governo: a "receita" do país é fixa por nível de política (`pais.ts:201`) |
| Transferências entre pessoas | Existe | Efeito `transferir` (`efeitos.ts:95-113`); herança entre personagens (`pessoas.ts:109-121`). A parte dos irmãos que não são personagens some (`pessoas.ts:115-117`) |

### 4. Empresas, bens e entidades econômicas

| Funcionalidade | Situação | Evidência |
|---|---|---|
| A empresa como entidade (até 5, subsidiárias como número, fusão, bolsa, quebra, rodada, venda) | Existe | `empresa.ts`; `empresa.test.ts`, `grupo.test.ts` (o livro da empresa fecha: `empresa.test.ts:233`, `grupo.test.ts:355`) |
| Caixa da empresa separado do dinheiro de quem joga | **Ausente** | A empresa é um `valor`. O "lucro" é a variação do valor (`empresa.ts:391`, conferido). A retirada é uma fração do valor (0, 3% ou 8%), paga até em ano de prejuízo, e a parte dos sócios sai do valor e some (`empresa.ts:392-396`, conferido). A dívida da empresa vai para o CPF (`92-empresa.json:588`); a compra de concorrente sai do dinheiro pessoal (`empresa.ts:604`) |
| Sócios e investidores como entidades | Ausente | Só existe `participacao < 1`; a rodada cria o dinheiro dos investidores (`empresa.ts:228-236`) |
| Bens (30 itens: moradia, renda, lazer, veículos, luxo, mídia) | Existe | `bens.ts`; `liberdade.test.ts:30-56` |
| Financiamento | **Incompleto** | Saldo no bem (`bem.financiado`), entrada de 20%, juro real de 7%, parcela de 10% ao ano; sem prazo nem credor; o teto de 40% da renda vale item a item (`bens.ts:97`) |
| Dois caminhos para a mesma coisa | **Redundante** | O carro do storylet é marca e dívida, sem bem (`20-juventude.json:577`); "vender o carro" tira a marca mas o bem continua (`30-adulto.json:984-990`). A fundação tem três mecanismos e nenhuma entidade: a jogada (`91-jogadas.json:302`), um evento que multiplica o patrimônio por 0,9 (`91-fortuna.json:245`) e um que multiplica por 0,85 (`95-maturidade.json:305`); a parte solidária do espólio vai para uma "causa" que não existe (`herdeiro.ts:176`) |
| Holding, family office, fundos, fundação | Ausente | Não encontrados como entidades |
| Patrimônio da família | **Incompleto** | Mãe, pai e avó têm dinheiro e poupam todo ano sem custo nem dívida (`familia.ts:184-193`) |
| Herança de quem joga | **Frágil** | A metade do cônjuge é descontada, mas só é creditada quando quem herda é o filho (`herdeiro.ts:175-177` contra 369-376, conferido): com sobrinho ou amigo, ela some. A morte de personagem não paga imposto; a de quem joga paga |
| Jogadas de fortuna | **Incompleto** | O custo sai da conta e some; o efeito é uma marca ou o empurrão do país. "Salvar o país" mexe só em `pais.impulso`; a devolução vem por evento com valor fixo, sem devedor (`91-jogadas.json:1657-1731`); comprar a estatal não paga o governo |

### 5. Agendados, marcos, pontos de virada e mortes

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Agenda e marcos | Existe | 100 agendamentos no conteúdo (62 alvos), 16 marcos; ver item 1 para a invalidação |
| Causas | Incompleto | A causa é a proveniência das qualidades que a condição consulta, mais a origem do agendamento (`condicoes.ts:142-153`). Condição sobre número não gera causa; não há peso nem incerteza; fica só o primeiro autor da qualidade |
| Sem causa | Frágil | Promoção e fim de mandato (`carreira.ts:148`, `poder.ts:153`) e a jogada (`fortuna.ts:80`) |
| Pontos de virada e o porquê | Existe | `virada.ts`; o porquê aparece em 29,8% dos acontecimentos (`docs/metricas.md`). O crédito vai a cada origem por todos os descendentes, sem dividir entre causas |
| Morte de quem joga | Frágil | Risco do corpo (idade, saúde, saúde pública) e da violência num sorteio só (`vida.ts:200-208`). A causa é sorteada depois: a morte do corpo pode sair com causa da categoria violência, e o portão do túnel conta o rótulo (`morte.ts:23-24`, conferido). O efeito `morte` vira sempre acidente |

### 6. Múltiplas vidas, persistência e reprodutibilidade

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Túnel de 10.000 vidas, robôs, lotes de origem, fortuna e dinastia | Existe | `scripts/tunel.ts` (1.591 linhas); travam o CI só as três metas permanentes |
| Save versionado | Incompleto | Versão 2 (`salvar.ts:17`). Não há cadeia de migração: mudar a versão descarta a vida (e a dinastia) com aviso. Os remendos aditivos dentro da v2 escrevem fora do livro |
| Recuperação | **Frágil** | JSON corrompido ou migração que lança exceção apagam a memória; o toque seguinte sobrescreve o save; cota cheia passa em silêncio (`salvar.ts:142-146, 179-192`). Não há exportar nem importar |
| Esquema do save | Frágil | O Zod repete a interface TypeScript e descarta chave desconhecida: campo novo esquecido no esquema some ao recarregar |
| Tamanho | Frágil | Até 411 mil caracteres numa vida; o teste trava em 600 mil numa semente só; nada de compactação; a origem do localStorage (`lhordriyon.github.io`) é dividida com outros sites do dono |
| Dado repetido | Redundante | `save.vidas` repete `memoria.vidas` |

### 7. Governo, regimes e poder

| Funcionalidade | Situação | Evidência |
|---|---|---|
| O país vivo: dez estatísticas que se causam, com atraso | Existe | `pais.ts` (fórmulas em 185-212 e 513-567); `pais.test.ts` (20 testes) |
| Governos fictícios, eleição, seis políticas, uma reforma por ano | Existe | `pais.ts:178-182, 321-330, 658-688`; testes em `pais.test.ts:94-188` |
| Orçamento do Estado em reais, PIB e população | **Ausente** | Só o "primário" em pontos do PIB (`Pais.tsx:85`). A dívida pública não tem juros nem credores (`pais.ts:546`); o empurrão entra duas vezes (1,5× ao ano); a reação fiscal de 5% ao ano é automática, mesmo com quem joga no poder (`pais.ts:205`) |
| Banco central | **Incompleto** | A Selic é uma regra de Taylor (`pais.ts:209-212`), sem teste próprio; nenhuma operação ou storylet escreve `pais.juros` |
| Poder: influência, popularidade, dez cargos, eleição, mandato, queda | Existe | `poder.ts`; `liberdade.test.ts:107-135`. A queda do cargo não tem teste |
| Monarquia | **Frágil** | `pais.monarquia` não é lida pelo motor (conferido: só um comentário em `esquema.ts:706`); os blocos seguem eleitos sob a coroa. A coroa paga renda a quem a herda (`sucessao_coroa`, `96-linhagens.json:128`) |
| Regime | **Frágil** | É um governo (`pais.governo = 'regime'`) sem eleição. A candidatura não confere o regime (`poder.ts:59-73`, conferido): dá para ser eleito presidente sob o regime. Ganhar a "eleição de verdade" tira o regime, mas o jogador segue ditador vitalício (`96-linhagens.json:474-477`) |
| Reforma por storylet | **Frágil** | Quatro storylets mudam `pais.pol_*` fora do limite de uma reforma por ano (conferido: `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo`). Dois elegem presidente fora do calendário (`bancar_presidente`, `noite_da_apuracao`) |
| Regras duplicadas | Frágil | O calendário eleitoral está em três lugares (`pais.ts:178-182`, `campos.ts:352`, `poder.ts:46-48`); os limites do câmbio divergem ([2, 15] em `diplomacia.ts:291` contra [1,5; 20] em `campos.ts:129`) |

### 8. Mundo, geografia e diplomacia

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Quatro países fictícios com economia, relação, sanção, acordo, demanda, alinhamento e atos de quem governa | Existe | `diplomacia.ts`; `diplomacia.test.ts` (16 testes) |
| Governo, política interna, moeda, população e dívida dos países de fora | Ausente | Cada um tem crescimento, relação, produtos e as qualidades crise, sanção e acordo (`campos.ts:133-141`) |
| Países no código | **Frágil** | Os quatro estão fixos em `PARCEIROS` (`constantes.ts:14`), no esquema (`z.enum` e `.length`), em `ENTIDADES`, na herança e no manifesto. País novo pede código e migração |
| O dólar | Existe | `pais.cambio`: alvo pela dívida, juro real, demanda externa, sanções e hiato; repasse para a inflação (`diplomacia.ts:274-293`; testes) |
| Cidades | **Incompleto** | 55 cidades nas 27 UFs, sem coordenadas (`esquema.ts:717-719`). O desemprego local é fixo e não acompanha o do país |
| Mudar de cidade | Ausente | Só na criação (`Abertura.tsx:160-166`); storylets que dizem "mudou de cidade" não mexem em `lugar` |
| Mapa | Ausente | Não encontrado |
| Países reais e fontes de dados | Ausente | Nenhum dado de país real além do Brasil, e nenhuma fonte documentada (IBGE, PNAD) |
| Morar em outro país | Rascunho | Incremento 11, não publicado (I-23 em `docs/ideias.md`) |

### 9. Defesa, sociedade e instituições internacionais

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Guerra, defesa, espionagem, forças armadas | Ausente | Só texto: `guerra_comercial` (relação ±15), "mandar o Exército para as ruas" (segurança +1), `general_ambicioso`, `conselho_dos_generais`; carreiras militares |
| População, natalidade, migração, religião, cultura | Ausente no país; incompleto na pessoa | A família "religiosa" e o traço "devoto"; a linhagem imigrante; 22 storylets leem a região |
| Instituições multilaterais, tratados, reconhecimento | Ausente | O único tratado é o acordo comercial bilateral. "Fundar um país" (R$ 300 bi) dá o cargo de soberano e a marca `micronacao`; o país criado não vira entidade, e 0,0% das vidas do túnel chegam lá |

### 10. Agentes autônomos e delegação

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Agente com objetivo, mandato, orçamento ou relatório | Ausente | Não encontrado em `src/motor` |
| Delegar na empresa | Incompleto | `empresa.dependencia` (0 a 100) pesa o talento de quem joga, divide a mesa, desconta a venda e custa valor na morte. Delegar é baixar o número: o diretor, o conselho e a presidente existem só no texto (`conselho_quer_ceo`, `presidente_pediu_as_contas`, `sucessao_na_empresa`) |
| Governos como quase-agentes | Incompleto | Cinco blocos com políticas fixas, escolhidos pelo "desejo" do eleitor (`pais.ts:290-310`) |
| Robôs | — | São jogadores simulados do túnel, não agentes do mundo |
| Validador e manifesto | Existe, com partes frágeis | Cada campo escrito precisa de 2 leitores de 2 sistemas e 1 leitura que decida. O manifesto (177 escritas, 164 leituras) é escrito à mão; o teste de escritas olha só entradas de regra em 20 vidas; as leituras não têm teste, e há declarações erradas (`faleceu`, a linhagem) |

### 11. Interface, armazenamento, desempenho, testes e CI

| Funcionalidade | Situação | Evidência |
|---|---|---|
| Três faixas e quatro folhas (Família, Dinheiro, Carreira, País), cartão da vida, criação do personagem | Existe | `src/ui`; só `formato.ts` tem teste |
| Regras do motor copiadas na interface | **Frágil** | Venda com 0,94 que ignora o financiado (`Dinheiro.tsx:570`), retirada refeita, "três compras" e idades escritas à mão, juro real refeito (`Pais.tsx:79`), "abaixo de 30%" escrito à mão |
| Operações que falham em silêncio | Frágil | `App.tsx:154-157` engole a exceção; retirada, perfil, vender empresa, morar, alugar e vender bem não consultam o motivo |
| Histórico de indicadores | Ausente | Só o valor atual e a variação do ano |
| Tema claro e escuro, alvos de 44 px | Existe | `estilo.css` (1.372 linhas, um arquivo global): só automático; alvos de 44 a 60 px. Sem teste visual nem de acessibilidade |
| PWA e APK offline | Existe | `vite.config.ts`, Capacitor. O vite-plugin-pwa recusa arquivo de mais de 2 MiB, e o bundle cresceu 63% em cinco dias |
| Assinatura do APK | **Frágil** | A chave e a senha estão no repositório, de propósito (comentário em `android/app/build.gradle:20-21`, conferido): qualquer um pode assinar um APK que se instala por cima do jogo |
| CI | Existe | `ci.yml`: tipos, testes, validador, túnel e build, e Pages na `main`. O `android.yml` não roda testes e não espera o CI: o APK sai antes do CI terminar |
| Testes | Incompleto | 197 casos. Sem teste dedicado: diretor, morte, memória, saliência, ordem do ano, interface, migração com save real, golden de semente fixa |
| Documentação | Incompleto | Números velhos: "~125 KB" de save, "61 KB" de bundle, tamanhos de arquivo da auditoria anterior. `motor.md` diz que o teste do livro olha só quem joga (hoje olha toda entidade). `conteudo.md` não cita `91-jogadas` nem `95-maturidade`. O CLAUDE.md não cita `rng.ts`, `texto.ts`, `formato.ts`, `cartaoImagem.ts` e `disco.ts` |

## Os achados que mudam a arquitetura

1. **O dinheiro não tem contrapartida.** 86,6% das entradas que mexem em dinheiro o criam ou o destroem. O livro anota o saldo líquido por campo, e o teste de fechamento passa assim mesmo. Sem isso não há:
   - dívida com credor;
   - orçamento do governo;
   - caixa da empresa;
   - taxa de gestor.
2. **A dívida é um número.** Nasce sozinha, amortiza sozinha e some na morte ou num acordo, sem credor que perca.
3. **A empresa é um valor.** O lucro é a variação do valor, e a retirada sai do valor até em ano de prejuízo.
4. **O Estado não tem caixa.** Dívida pública em % do PIB, sem juros nem credores. Os impostos de quem joga não chegam a lugar nenhum.
5. **O papel é a pessoa.** Não há identidade estável, vários filhos, ex ou relações entre personagens. Agentes e sucessão precisam disso.
6. **Nenhum agente.** Delegar é baixar um número.
7. **O monarca é um salário.** A coroa paga renda a quem a herda; essa renda sobe com promoção e o expõe à demissão. A monarquia não muda nada no país; o regime aceita candidatura a presidente.
8. **O mundo é caro e fixo.** Um ano do país custa 0,23 ms; 190 países nesse detalhe seriam 3,5 s por vida. Os quatro países de fora estão fixos no código, no esquema e no save.
9. **O save cresce e não se recupera.** Não há cadeia de migração, compactação, exportação nem cópia.
10. **A ordem do ano é implícita.** Há leituras escondidas no mesmo ano e um ciclo de import. A agenda descarta em silêncio.

A proposta para cada um está em `docs/arquitetura.md`; a ordem, em `docs/ideias.md`.

## Defeitos encontrados

Correções pequenas, cada uma no seu commit, com teste. Entram no registro (`docs/ideias.md`, seção "Defeitos") e são feitas quando a fatia que mexe naquela parte passar por lá.

| Defeito | Evidência | Gravidade |
|---|---|---|
| A coroa vai para a pessoa errada quando quem herda é o par ou o amigo | `herdeiro.ts:437`: `morto = e.entidades[slotVelho]` aponta para a mãe nova do herdeiro (conferido o código; reproduzido pelo auditor) | Média |
| Qualidades herdadas guardam a idade da geração anterior | `herdeiro.ts:205-208` (conferido) | Média |
| Candidatura a presidente sob o regime | `poder.ts:59-73` (conferido) | Média |
| O monarca coroado continua na carreira de antes e pode ser demitido | reproduzido pelo auditor (`carreira.ts:151`, `trabalho.ts:43-58`) | Média |
| Quatro storylets fazem reforma fora do limite de uma por ano | `ministro_pede_ajuste`, `violencia_vira_manchete`, `greve_geral`, `bonanca_no_governo` (conferido) | Baixa |
| A morte do corpo pode sair rotulada como violência | `morte.ts:23-24` (conferido) | Baixa |
| Limites do câmbio divergem | `diplomacia.ts:291` contra `campos.ts:129` | Baixa |
| O agendado descartado some do livro sem motivo | `diretor.ts:91-93` (conferido) | Baixa |

## O que preservar

O que funciona e tem teste não se reescreve:
- o livro-razão causal (só `livro.ts` muda o estado);
- o formato único de estado e de conteúdo, com o validador;
- o `rng` no estado e o motor puro;
- o túnel com metas;
- a família viva;
- a carteira;
- o grupo de empresas;
- os bens;
- o país vivo;
- a diplomacia;
- a dinastia;
- as jogadas;
- a criação do personagem;
- as três faixas da tela.

Cada fatia nova troca o mínimo e prova no túnel que o resto não mudou.

## O que esta auditoria não verificou

- Não rodei a interface no aparelho: custo por toque, foco e leitor de tela.
- Não li um a um os 750 storylets: só contagens e buscas.
- Não reproduzi eu mesmo:
  - a sobrescrita do amor e do filho;
  - o monarca demitido;
  - os tamanhos de save por estratégia.
  Os três vieram dos auditores, com o método descrito por eles.
