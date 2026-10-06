/**
 * Formato do conteúdo (conteudo/*.json). Um formato só para evento (o
 * diretor escolhe), ação (o jogador escolhe) e ação de personagem (a regra do
 * personagem escolhe): o storylet. O validador confere o que o esquema não vê
 * (caminhos, leitores, variáveis).
 */
import { z } from 'zod';
import {
  ATRIBUTOS,
  CATEGORIAS_MORTE,
  CLASSES,
  PAPEIS,
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
  renda: Ajuste.optional(),
  custo: Ajuste.optional(),
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
  /** Um personagem morre (a causa fica no texto do storylet). */
  matar: Ref.optional(),
  /** Causa da morte de quem joga, terminando a frase "morreu aos N anos, ...". */
  morte: z.string().min(3).optional(),
};
export const CHAVES_EFEITO = new Set(Object.keys(EFEITOS_FIXOS));

/** Efeito por caminho: soma um número ou define um valor ("mae.vinculo": 10; "ator.ocupacao": {"definir": "..."}). */
const ValorEfeito = z.union([z.number(), z.strictObject({ definir: z.union([z.number(), z.string()]) })]);

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

const Profissao = z.strictObject({ m: z.string(), f: z.string() });

/** Mudanças que as regras dos personagens produzem sozinhas. */
export const GATILHOS = ['adoeceu', 'curou', 'demitido', 'empregado', 'aposentou', 'faleceu'] as const;
export type Gatilho = (typeof GATILHOS)[number];
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
  mortesPersonagem: z.array(z.string()).min(4),
  /** O que as regras anuais dos personagens contam na linha do tempo (adoeceu, perdeu o emprego...). */
  acontecimentos: z.record(
    z.enum(GATILHOS),
    z.strictObject({ textos: z.array(z.string()).min(1), resumo: z.string().min(3) }),
  ),
  /** Textos da primeira linha da vida (sorteado entre os que a origem permite). */
  nascimento: z.array(z.strictObject({ se: Condicoes.optional(), texto: z.string() })).min(1),
  /** Epitáfios genéricos quando nenhuma marca tem um. */
  epitafios: z.array(z.string()).min(3),
});
export type Mundo = z.infer<typeof Mundo>;
