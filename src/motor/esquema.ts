/**
 * Formato do conteúdo (conteudo/*.json). Um formato só para evento (o
 * diretor escolhe), ação (o jogador escolhe) e ação de personagem (a regra do
 * personagem escolhe): o storylet. O validador confere o que o esquema não vê
 * (caminhos, leitores, variáveis).
 */
import { z } from 'zod';
import {
  ATIVOS,
  ATRIBUTOS,
  CATEGORIAS_MORTE,
  CLASSES,
  FASES,
  PAPEIS,
  PERFIS,
  PAPEIS_NOVOS,
  TIPOS_FAMILIA,
  TIPOS_STORYLET,
  VERBOS,
} from './constantes.ts';

export { ATRIBUTOS, PAPEIS, PAPEIS_FIXOS, PAPEIS_NOVOS, VERBOS, type Papel, type Verbo } from './constantes.ts';
export const Atributo = z.enum(ATRIBUTOS);
export type Atributo = z.infer<typeof Atributo>;
export const PapelNovo = z.enum(PAPEIS_NOVOS);
export type PapelNovo = z.infer<typeof PapelNovo>;

const id = z.string().regex(/^[a-z0-9_]+$/, 'use só minúsculas, números e _');
/** "campo" (de quem joga) ou "entidade.campo" (mae.saude, ator.vinculo, lugar.desemprego). */
export const RE_CAMINHO = /^([a-z]+\.)?[a-z0-9_]+$/;
const Caminho = z.string().regex(RE_CAMINHO, 'caminho: "campo" ou "entidade.campo"');
const Idade = z.number().int().min(0).max(130);
const FaixaIdade = z.tuple([Idade, Idade]);
const Ref = z.enum(['eu', 'ator', ...PAPEIS]);

const Faixa = z.strictObject({
  min: z.number().optional(),
  max: z.number().optional(),
});

/** Chaves fixas das condições (todas de quem joga, exceto as de qualidade, que aceitam caminho). */
const CONDICOES_FIXAS = {
  saude: Faixa.optional(),
  felicidade: Faixa.optional(),
  inteligencia: Faixa.optional(),
  aparencia: Faixa.optional(),
  /** Dinheiro em conta, em reais de hoje. */
  dinheiro: Faixa.optional(),
  patrimonio: Faixa.optional(),
  divida: Faixa.optional(),
  /** Renda anual em reais de hoje. */
  renda: Faixa.optional(),
  /** Inflação do último ano, em % (atalho para pais.inflacao). */
  inflacao: Faixa.optional(),
  genero: z.enum(['f', 'm']).optional(),
  /** Qualidades (aceitam caminho: "mae.doente"). Exige todas. */
  marcas: z.array(Caminho).optional(),
  /** Exige pelo menos uma. */
  algumaMarca: z.array(Caminho).optional(),
  /** Exige que nenhuma exista. */
  semMarcas: z.array(Caminho).optional(),
  /** Exige a qualidade e confere há quantos anos ela foi gravada. */
  marcaHa: z
    .array(
      z.strictObject({
        marca: Caminho,
        min: z.number().int().min(0).optional(),
        max: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
};
export const CHAVES_CONDICAO = new Set(Object.keys(CONDICOES_FIXAS));

/** Valor de uma condição por caminho: faixa numérica, verdadeiro/falso, texto igual ou um entre vários. */
const ValorCondicao = z.union([Faixa, z.boolean(), z.string(), z.array(z.string()).min(1)]);
export type ValorCondicao = z.infer<typeof ValorCondicao>;

export const Condicoes = z
  .object(CONDICOES_FIXAS)
  .catchall(ValorCondicao)
  .superRefine((cond, ctx) => {
    for (const chave of Object.keys(cond)) {
      if (!CHAVES_CONDICAO.has(chave) && !RE_CAMINHO.test(chave)) ctx.addIssue({ code: 'custom', message: `chave inválida "${chave}"` });
    }
  });
export type Condicoes = z.infer<typeof Condicoes>;

/** Número soma; { definir } troca o valor. Em reais de hoje por ano. */
const Ajuste = z.union([z.number(), z.strictObject({ definir: z.number().min(0) })]);

const Agendamento = z.strictObject({
  evento: id,
  /** Anos a partir de agora: fixo ou faixa sorteada. */
  em: z.union([z.number().int().min(1), z.tuple([z.number().int().min(1), z.number().int().min(1)])]),
});

/** Como a empresa de quem joga nasce: o setor, de onde vem o valor e quanto é de quem joga. */
const AberturaEmpresa = z
  .strictObject({
    setor: id.optional(),
    /** O setor de outro caminho ("ator.setor": o negócio da família). */
    copiarSetor: Caminho.optional(),
    /** A empresa nasce valendo isto: o valor que o trabalho criou, sem ninguém pagar. */
    valor: z.number().positive().optional(),
    /** Quem joga põe este dinheiro (até o que tiver, da conta e depois dos investimentos). */
    capital: z.number().positive().optional(),
    /** Esta fração do dinheiro de `de` vira a empresa (de quem joga: da conta e dos investimentos). */
    fracao: z.number().gt(0).max(1).optional(),
    de: Ref.optional(),
    /** Quanto é de quem joga (o sócio fica com o resto). */
    participacao: z.number().gt(0).max(1).optional(),
    /** A tração com que ela começa, em % ao ano (sem isso, a do setor). */
    tracao: z.number().min(-30).max(80).optional(),
  })
  .superRefine((a, ctx) => {
    if ((a.setor === undefined) === (a.copiarSetor === undefined)) ctx.addIssue({ code: 'custom', message: 'abrirEmpresa usa setor ou copiarSetor (um dos dois)' });
    if ([a.valor, a.capital, a.fracao].filter((x) => x !== undefined).length !== 1) {
      ctx.addIssue({ code: 'custom', message: 'abrirEmpresa usa valor, capital ou fracao (um só)' });
    }
    if (a.de !== undefined && a.fracao === undefined) ctx.addIssue({ code: 'custom', message: '"de" só vale com fracao' });
  });
export type AberturaEmpresa = z.infer<typeof AberturaEmpresa>;

const EFEITOS_FIXOS = {
  saude: z.number().optional(),
  felicidade: z.number().optional(),
  inteligencia: z.number().optional(),
  aparencia: z.number().optional(),
  /** Reais de hoje; negativo é gasto. Faltando dinheiro, vira dívida. */
  dinheiro: z.number().optional(),
  /** Reais de hoje tirados do dinheiro e postos para render (negativo resgata). */
  investir: z.number().optional(),
  /** Reais de hoje de dívida nova; negativo é desconto (para pagar com dinheiro, some um dinheiro negativo). */
  divida: z.number().optional(),
  /** Multiplica a dívida (acordo: 0.3 = sobra 30% para pagar). */
  dividaFator: z.number().min(0).max(1).optional(),
  /** Multiplica o dinheiro e o investido (golpe, sociedade que quebrou, aposta que deu certo): perdas e ganhos proporcionais à riqueza. */
  patrimonioFator: z.number().min(0).max(3).optional(),
  /** Multiplica a renda (corte de salário, proposta melhor): 0,8 = −20%. */
  rendaFator: z.number().min(0).max(3).optional(),
  renda: Ajuste.optional(),
  custo: Ajuste.optional(),
  /** Soma ao custo anual uma fração do patrimônio de agora (o padrão de vida que sobe com o que se tem). */
  custoDoPatrimonio: z.number().gt(0).max(0.2).optional(),
  /** Multiplica o custo de vida anual (cortar o padrão: 0,5 = metade). */
  custoFator: z.number().min(0).max(3).optional(),
  /** Qualidades ganhas (aceitam caminho: "mae.doente"). */
  marcas: z.array(Caminho).optional(),
  removerMarcas: z.array(Caminho).optional(),
  /** Soma ao valor de qualidades numéricas ("estudo": 1). */
  qualidades: z.record(Caminho, z.number()).optional(),
  personagens: z.array(PapelNovo).optional(),
  /** Copia um personagem para outro papel (ex.: o primeiro amor vira o amor atual). */
  promover: z.strictObject({ de: z.enum(PAPEIS), para: PapelNovo }).optional(),
  agendar: z.array(Agendamento).optional(),
  /** Dinheiro de uma pessoa para outra: valor fixo ou fração do dinheiro de quem dá, com teto. */
  transferir: z
    .strictObject({
      de: Ref,
      para: Ref,
      valor: z.number().positive().optional(),
      fracao: z.number().gt(0).max(1).optional(),
      max: z.number().positive().optional(),
    })
    .optional(),
  /** Move uma fração de onde o dinheiro está para outro lugar ("de": "acoes", "para": "renda_fixa", "fracao": 1 vende todas as ações). */
  realocar: z
    .strictObject({ de: z.enum(['dinheiro', ...ATIVOS]), para: z.enum(['dinheiro', ...ATIVOS]), fracao: z.number().gt(0).max(1) })
    .refine((r) => r.de !== r.para, 'realocar precisa de origem e destino diferentes')
    .optional(),
  /** Abre a empresa de quem joga (uma por vez; se já houver uma, nada acontece). */
  abrirEmpresa: AberturaEmpresa.optional(),
  /** Multiplica o valor da empresa (o contrato grande, o escândalo, a crise do setor). */
  empresaFator: z.number().min(0).max(5).optional(),
  /** Investidores compram esta parte da empresa pelo valor de agora: o dinheiro deles entra na empresa e a parte de quem joga encolhe. */
  rodada: z.strictObject({ parte: z.number().gt(0).lt(1) }).optional(),
  /** Vende esta fração da parte de quem joga (1 = tudo), pelo valor de agora vezes o prêmio (1,5 = 50% acima do que vale). */
  venderEmpresa: z.strictObject({ fracao: z.number().gt(0).max(1), premio: z.number().gt(0).max(5).optional() }).optional(),
  /** A empresa fecha as portas: volta para quem joga esta fração da parte dele (o estoque, os móveis). */
  fecharEmpresa: z.strictObject({ sobra: z.number().min(0).max(1) }).optional(),
  /** Um personagem morre (a causa fica no texto do storylet). */
  matar: Ref.optional(),
  /** Causa da morte de quem joga, terminando a frase "morreu aos N anos, ...". */
  morte: z.string().min(3).optional(),
};
export const CHAVES_EFEITO = new Set(Object.keys(EFEITOS_FIXOS));

/** Efeito por caminho: soma um número ou define um valor ("mae.vinculo": 10; "ator.ocupacao": {"definir": "..."}). */
const ValorEfeito = z.union([
  z.number(),
  z.strictObject({ definir: z.union([z.number(), z.string()]) }),
  /** Copia o valor de outro caminho ("eu.setor": { "copiar": "pai.setor" }). */
  z.strictObject({ copiar: Caminho }),
]);

export const Efeitos = z
  .object(EFEITOS_FIXOS)
  .catchall(ValorEfeito)
  .superRefine((ef, ctx) => {
    for (const chave of Object.keys(ef)) {
      if (!CHAVES_EFEITO.has(chave) && !(RE_CAMINHO.test(chave) && chave.includes('.'))) {
        ctx.addIssue({ code: 'custom', message: `efeito inválido "${chave}" (use um efeito conhecido ou "entidade.campo")` });
      }
    }
    if (ef.transferir && (ef.transferir.valor === undefined) === (ef.transferir.fracao === undefined)) {
      ctx.addIssue({ code: 'custom', message: 'transferir usa valor ou fracao (um dos dois)' });
    }
  });
export type Efeitos = z.infer<typeof Efeitos>;

export const Resultado = z.strictObject({
  texto: z.string().min(1),
  /** Substitui o resumo da escolha no cartão da vida quando o desfecho é o que importa. */
  resumo: z.string().min(3).optional(),
  efeitos: Efeitos.optional(),
});
export type Resultado = z.infer<typeof Resultado>;

export const Teste = z
  .strictObject({
    /** Campo numérico que decide (atributo de quem joga ou caminho: "ator.vinculo"). */
    atributo: Caminho.optional(),
    dificuldade: z.number().min(0).max(100).optional(),
    chance: z.number().gt(0).lt(1).optional(),
  })
  .superRefine((t, ctx) => {
    const porAtributo = t.atributo !== undefined || t.dificuldade !== undefined;
    if (porAtributo && (t.atributo === undefined || t.dificuldade === undefined)) {
      ctx.addIssue({ code: 'custom', message: 'teste por atributo precisa de atributo e dificuldade' });
    }
    if (porAtributo === (t.chance !== undefined)) {
      ctx.addIssue({ code: 'custom', message: 'use { chance } ou { atributo, dificuldade }' });
    }
  });
export type Teste = z.infer<typeof Teste>;

/** Corpo comum de escolha e de ação: efeitos certos, e um teste com dois desfechos ou um resultado. */
function conferirDesfechos(
  e: { teste?: unknown; sucesso?: unknown; fracasso?: unknown; resultado?: unknown },
  ctx: z.RefinementCtx,
  exigeResultado: boolean,
): void {
  if (e.teste) {
    if (!e.sucesso || !e.fracasso) ctx.addIssue({ code: 'custom', message: 'com teste, precisa de sucesso e fracasso' });
    if (e.resultado) ctx.addIssue({ code: 'custom', message: 'com teste, use sucesso/fracasso, não resultado' });
  } else {
    if (exigeResultado && !e.resultado) ctx.addIssue({ code: 'custom', message: 'escolha sem teste precisa de resultado' });
    if (e.sucesso || e.fracasso) ctx.addIssue({ code: 'custom', message: 'sucesso/fracasso só existem com teste' });
  }
}

export const Escolha = z
  .strictObject({
    texto: z.string().min(1),
    /** Frase no passado, sem sujeito: "aos 17 você <resumo>". */
    resumo: z.string().min(3),
    condicoes: Condicoes.optional(),
    /** Texto mostrado quando as condições não deixam escolher. */
    bloqueio: z.string().min(3).optional(),
    efeitos: Efeitos.optional(),
    teste: Teste.optional(),
    sucesso: Resultado.optional(),
    fracasso: Resultado.optional(),
    resultado: Resultado.optional(),
  })
  .superRefine((e, ctx) => conferirDesfechos(e, ctx, true));
export type Escolha = z.infer<typeof Escolha>;

/** Trechos de texto escolhidos pelo estado: o primeiro cuja condição vale ({nome} no texto). */
const Trecho = z.strictObject({ se: Condicoes.optional(), texto: z.string() });

export const Storylet = z
  .strictObject({
    id,
    /** evento (padrão): o diretor escolhe. acao: o jogador escolhe pela ficha do ano. npc: a regra do personagem escolhe. */
    tipo: z.enum(TIPOS_STORYLET).optional(),
    /** Ações: o verbo da ficha. */
    verbo: z.enum(VERBOS).optional(),
    /** Ações: o que aparece no botão do verbo ("cursinho do ENEM"). */
    rotulo: z.string().min(3).optional(),
    /** Papéis que podem ocupar {ator}: quem age (npc) ou de quem se trata. */
    ator: z.array(z.enum(PAPEIS)).min(1).optional(),
    /** Entre vários atores possíveis, prefere o de menor ("-ator.vinculo") ou maior ("+ator.dinheiro") valor. */
    preferir: z.string().regex(/^[+-]ator\.[a-z_]+$/).optional(),
    /** Faixa de idade [min, max] de quem joga. */
    idade: FaixaIdade.optional(),
    /** Só acontece quando outro efeito o agenda. */
    apenasAgendado: z.boolean().optional(),
    /** Marco da vida: quando elegível, acontece sem depender do ritmo. */
    marco: z.boolean().optional(),
    condicoes: Condicoes.optional(),
    peso: z.number().positive().optional(),
    repetivel: z.boolean().optional(),
    /** Anos mínimos entre repetições. */
    intervalo: z.number().int().min(1).optional(),
    /** Urgência: multiplica a saliência (doença grave, despejo). */
    tensao: z.number().min(0.1).max(10).optional(),
    /** Personagens: o traço de quem age pesa na chance (generoso ajuda mais; brigão briga mais). */
    afinidade: z.enum(['ajuda', 'briga']).optional(),
    /** Valores em reais de hoje usados no texto como {nome_do_valor}. */
    valores: z.record(z.string().regex(/^[a-z_]+$/), z.number()).optional(),
    trechos: z.record(z.string().regex(/^[a-z_]+$/), z.array(Trecho).min(2)).optional(),
    texto: z.string().min(1),
    /** Frase no passado para o cartão da vida. Em storylets de personagem, com sujeito ("{ator.quem} perdeu o emprego"). */
    resumo: z.string().min(3),
    escolhas: z.array(Escolha).min(1).max(4).optional(),
    /** Sem escolha: efeitos certos (e, se houver, teste com desfechos). */
    efeitos: Efeitos.optional(),
    teste: Teste.optional(),
    sucesso: Resultado.optional(),
    fracasso: Resultado.optional(),
  })
  .superRefine((s, ctx) => {
    const tipo = s.tipo ?? 'evento';
    const erro = (message: string, path?: string): void => void ctx.addIssue({ code: 'custom', message, ...(path ? { path: [path] } : {}) });
    if (s.apenasAgendado && s.idade) erro('storylet apenasAgendado não usa idade', 'idade');
    if (!s.apenasAgendado && !s.idade) erro('storylet sorteável precisa de idade', 'idade');
    if (s.idade && s.idade[0] > s.idade[1]) erro('idade mínima maior que a máxima', 'idade');
    if (s.escolhas && (s.efeitos || s.teste)) erro('use escolhas ou efeitos/teste, não os dois');
    if (s.intervalo && !s.repetivel && tipo !== 'acao') erro('intervalo só vale para storylet repetível', 'intervalo');
    if (s.marco && s.apenasAgendado) erro('marco não combina com apenasAgendado', 'marco');
    if (!s.escolhas) conferirDesfechos({ ...s, resultado: undefined }, ctx, false);
    if (tipo === 'acao') {
      if (!s.verbo) erro('ação precisa de verbo', 'verbo');
      if (!s.rotulo) erro('ação precisa de rótulo', 'rotulo');
      if (s.escolhas) erro('ação não tem escolhas: o jogador já escolheu ao tocar no verbo', 'escolhas');
      if (s.marco || s.apenasAgendado) erro('ação não é marco nem agendada');
    } else if (s.verbo || s.rotulo) {
      erro('verbo e rótulo são só de ações');
    }
    if (tipo === 'npc' && !s.ator) erro('storylet de personagem precisa de ator', 'ator');
    if (s.preferir && !s.ator) erro('preferir só vale com ator', 'preferir');
  });
export type Storylet = z.infer<typeof Storylet>;
/** Nome antigo, mantido para quem ainda lê "evento". */
export type Evento = Storylet;
export const ArquivoStorylets = z.array(Storylet);

export const Linha = z.strictObject({
  idade: FaixaIdade,
  texto: z.string().min(1),
  condicoes: Condicoes.optional(),
  peso: z.number().positive().optional(),
});
export type Linha = z.infer<typeof Linha>;
export const ArquivoLinhas = z.array(Linha);

export const CategoriaMorte = z.enum(CATEGORIAS_MORTE);

export const CausaMorte = z.strictObject({
  causa: z.string().min(3),
  /** Agrupa as causas na assinatura da vida. */
  categoria: CategoriaMorte,
  idade: FaixaIdade.optional(),
  condicoes: Condicoes.optional(),
  peso: z.number().positive().optional(),
});
export type CausaMorte = z.infer<typeof CausaMorte>;
export const ArquivoMortes = z.array(CausaMorte);

export const InfoMarca = z.strictObject({
  /** Efeito passivo aplicado todo ano enquanto quem joga tiver a qualidade. */
  porAno: z
    .strictObject({
      saude: z.number().optional(),
      felicidade: z.number().optional(),
      inteligencia: z.number().optional(),
      aparencia: z.number().optional(),
    })
    .optional(),
  /** Frase curta para o cartão da vida. */
  epitafio: z.string().min(3).optional(),
});
export type InfoMarca = z.infer<typeof InfoMarca>;
export const ArquivoMarcas = z.record(id, InfoMarca);

/** Setor de uma ocupação: um só, ou um para cada gênero quando as duas formas são trabalhos diferentes. */
const SetorDaOcupacao = z.union([id, z.strictObject({ m: id, f: id })]);
const Profissao = z.strictObject({ m: z.string(), f: z.string(), setor: SetorDaOcupacao });

/** Setor da economia: quanto sente o ciclo e quanto os salários crescem por ano (real). */
export const DefSetor = z.strictObject({
  id,
  nome: z.string(),
  /** 0 = não sente o ciclo; 1 = sente como a média; 2 = sente o dobro. */
  ciclo: z.number().min(0).max(3),
  crescimento: z.number().min(-0.05).max(0.05),
  /** Emprego estável: ninguém é demitido (serviço público). */
  estavel: z.boolean().optional(),
  /** Empresa do setor: quanto uma pequena cresce por ano, em % acima da inflação (a tração para onde ela volta). */
  tracao: z.number().min(-10).max(30).optional(),
  /** Quanto o valor de uma empresa do setor balança (1 = a média; tecnologia balança mais, saúde menos). */
  risco: z.number().min(0.3).max(3).optional(),
  /** Nomes de empresa ({sobrenome}, {nome}, {o|a}). Sem nomes, não dá para abrir empresa no setor. */
  empresas: z.array(z.string().min(3)).min(2).optional(),
});
export type DefSetor = z.infer<typeof DefSetor>;

/** Mudanças que as regras dos personagens produzem sozinhas. */
export const GATILHOS = ['adoeceu', 'curou', 'demitido', 'empregado', 'aposentou', 'faleceu', 'faliu'] as const;
export type Gatilho = (typeof GATILHOS)[number];

/** Uma fase do ciclo econômico: para onde vai no ano seguinte e o que muda na economia. */
export const DefFase = z.strictObject({
  id: z.enum(FASES),
  /** Como aparece no cabeçalho ("recessão"); vazio no normal. */
  nome: z.string(),
  /** Peso no sorteio da fase em que a vida começa. */
  peso: z.number().positive(),
  /** Chance de passar a cada outra fase no ano (o resto fica). */
  transicoes: z.partialRecord(z.enum(FASES), z.number().min(0).max(1)),
  /** Somado à inflação média e ao rendimento real médio do ano (0,02 = 2 pontos). */
  inflacao: z.number(),
  retorno: z.number(),
  /** Multiplica a chance de demissão (e divide a de recolocação). */
  desemprego: z.number().positive(),
  /** Variação real dos salários no ano (0,02 = +2%). */
  salario: z.number(),
  /** Somado ao crescimento das empresas no ano, multiplicado pelo quanto o setor sente o ciclo (−0,18 = a crise tira 18 pontos). */
  empresa: z.number(),
  /** O que a linha do tempo conta quando o país entra nesta fase. */
  textos: z.array(z.string()).min(1),
  resumo: z.string().min(3),
});
export type DefFase = z.infer<typeof DefFase>;

/** Uma classe de investimento: rendimento real médio em cada fase do país e quanto varia em torno dele. */
export const DefAtivo = z.strictObject({
  id: z.enum(ATIVOS),
  nome: z.string(),
  retorno: z.strictObject({ normal: z.number(), expansao: z.number(), recessao: z.number(), crise: z.number() }),
  desvio: z.number().min(0).max(1),
});
export type DefAtivo = z.infer<typeof DefAtivo>;

/** Perfil de investidor: a divisão do dinheiro novo entre as classes (somando 1). */
export const DefPerfil = z
  .strictObject({
    id: z.enum(PERFIS),
    nome: z.string(),
    descricao: z.string().min(3),
    carteira: z.partialRecord(z.enum(ATIVOS), z.number().min(0).max(1)),
  })
  .refine((p) => Math.abs(Object.values(p.carteira).reduce((s, x) => s + (x ?? 0), 0) - 1) < 1e-6, 'a carteira do perfil precisa somar 1');
export type DefPerfil = z.infer<typeof DefPerfil>;
const NomeGenero = z.strictObject({ m: z.string(), f: z.string() });
const Intervalo = z.tuple([z.number(), z.number()]);

export const Classe = z.strictObject({
  id: z.enum(CLASSES),
  /** "classe média", com artigo e tudo, para o texto. */
  nome: z.string(),
  peso: z.number().positive(),
  /** Patrimônio da família ao nascer e renda anual de cada adulto da casa (reais de hoje). */
  patrimonio: Intervalo,
  renda: Intervalo,
  /** Fração da renda que a família guarda por ano. */
  poupanca: z.number().min(-0.2).max(0.5),
  /** Ajuste na saúde inicial (comida, saneamento, plano de saúde). */
  saude: z.number(),
  ocupacoes: z.array(Profissao).min(4),
  /** O negócio de uma família empreendedora desta classe. */
  negocio: Profissao,
});
export type Classe = z.infer<typeof Classe>;

export const TipoFamilia = z.strictObject({
  id: z.enum(TIPOS_FAMILIA),
  nome: z.string(),
  peso: z.number().positive(),
  /** Vínculo inicial com a família e o ponto para onde ele volta sem cuidado. */
  vinculo: z.number().min(0).max(100),
  /** Traços dos pais mais comuns neste tipo de família (peso extra). */
  tracos: z.record(id, z.number().positive()),
});
export type TipoFamilia = z.infer<typeof TipoFamilia>;

/** Traço de personagem: multiplicadores lidos pelas regras anuais (1 = normal). */
export const Traco = z.strictObject({
  id,
  nome: NomeGenero,
  /** Chance de ajudar quem joga numa crise. */
  ajuda: z.number().min(0),
  /** Chance de conflito. */
  briga: z.number().min(0),
  /** Ajuste no vínculo inicial e no ponto de equilíbrio. */
  vinculo: z.number(),
  /** Ajuste na saúde inicial e chance de adoecer. */
  saude: z.number(),
  doenca: z.number().min(0),
  /** Chance de perder o emprego. */
  emprego: z.number().min(0),
  /** Fração extra da renda guardada por ano. */
  poupanca: z.number(),
  /** O traço de quem joga que esta pessoa leva quando a história continua com ela (o filho que vira herdeiro). */
  herdeiro: z.string().optional(),
});
export type Traco = z.infer<typeof Traco>;

/** Traço de quem joga: ajustes iniciais e na felicidade de base. */
export const TracoJogador = z.strictObject({
  id,
  nome: NomeGenero,
  peso: z.number().positive(),
  saude: z.number(),
  felicidade: z.number(),
  inteligencia: z.number(),
  aparencia: z.number(),
  /** Ajuste no ponto para onde a felicidade volta todo ano. */
  base: z.number(),
  /** Multiplica a chance anual de alguém aparecer na vida (tímido menos, carismático mais). */
  amor: z.number().positive().optional(),
});
export type TracoJogador = z.infer<typeof TracoJogador>;

export const Mundo = z.strictObject({
  nomes: z.strictObject({ f: z.array(z.string()).min(10), m: z.array(z.string()).min(10) }),
  sobrenomes: z.array(z.string()).min(10),
  pets: z.array(z.strictObject({ nome: z.string(), genero: z.enum(['f', 'm']) })).min(5),
  cidades: z
    .array(z.strictObject({ nome: z.string(), uf: z.string().length(2), marcas: z.array(id) }))
    .min(10),
  classes: z.array(Classe).length(CLASSES.length),
  familias: z.array(TipoFamilia).length(TIPOS_FAMILIA.length),
  tracos: z.array(Traco).min(6),
  tracosJogador: z.array(TracoJogador).min(4),
  /** Como morre um personagem ("dormindo", "depois de uma internação"): completa "morreu aos N anos, ...". */
  mortesPersonagem: z.array(z.strictObject({ texto: z.string(), idade: FaixaIdade.optional() })).min(4),
  /** O que as regras anuais dos personagens contam na linha do tempo (adoeceu, perdeu o emprego...). */
  acontecimentos: z.record(
    z.enum(GATILHOS),
    z.strictObject({ textos: z.array(z.string()).min(1), resumo: z.string().min(3) }),
  ),
  /** Setores da economia (o emprego de quem joga e dos pais pertence a um). */
  setores: z.array(DefSetor).min(6),
  /** O ciclo econômico do país, uma fase por id. */
  fases: z.array(DefFase).length(FASES.length),
  ativos: z.array(DefAtivo).length(ATIVOS.length),
  perfis: z.array(DefPerfil).length(PERFIS.length),
  /** Textos da primeira linha da vida (sorteado entre os que a origem permite). */
  nascimento: z.array(z.strictObject({ se: Condicoes.optional(), texto: z.string() })).min(1),
  /** Epitáfios genéricos quando nenhuma marca tem um. */
  epitafios: z.array(z.string()).min(3),
});
export type Mundo = z.infer<typeof Mundo>;
