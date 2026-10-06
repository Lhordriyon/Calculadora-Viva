/**
 * Formato do conteúdo (conteudo/*.json). O validador e o motor usam estes
 * esquemas; nada de conteúdo vira código.
 */
import { z } from 'zod';
import { ATRIBUTOS, PAPEIS, PAPEIS_NOVOS } from './constantes.ts';

export { ATRIBUTOS, PAPEIS, PAPEIS_FIXOS, PAPEIS_NOVOS, type Papel } from './constantes.ts';
export const Atributo = z.enum(ATRIBUTOS);
export type Atributo = z.infer<typeof Atributo>;
export const PapelNovo = z.enum(PAPEIS_NOVOS);
export type PapelNovo = z.infer<typeof PapelNovo>;

const id = z.string().regex(/^[a-z0-9_]+$/, 'use só minúsculas, números e _');
const IdEvento = id;
const IdMarca = id;
const Idade = z.number().int().min(0).max(130);
const FaixaIdade = z.tuple([Idade, Idade]);

const Faixa = z.strictObject({
  min: z.number().optional(),
  max: z.number().optional(),
});

export const Condicoes = z.strictObject({
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
  /** Inflação do último ano, em %. */
  inflacao: Faixa.optional(),
  genero: z.enum(['f', 'm']).optional(),
  /** Exige todas. */
  marcas: z.array(IdMarca).optional(),
  /** Exige pelo menos uma. */
  algumaMarca: z.array(IdMarca).optional(),
  /** Exige que nenhuma exista. */
  semMarcas: z.array(IdMarca).optional(),
  /** Exige a marca e confere há quantos anos ela foi gravada. */
  marcaHa: z
    .array(
      z.strictObject({
        marca: IdMarca,
        min: z.number().int().min(0).optional(),
        max: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
});
export type Condicoes = z.infer<typeof Condicoes>;

/** Número soma; { definir } troca o valor. Em reais de hoje por ano. */
const Ajuste = z.union([z.number(), z.strictObject({ definir: z.number().min(0) })]);

const Agendamento = z.strictObject({
  evento: IdEvento,
  /** Anos a partir de agora: fixo ou faixa sorteada. */
  em: z.union([z.number().int().min(1), z.tuple([z.number().int().min(1), z.number().int().min(1)])]),
});

export const Efeitos = z.strictObject({
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
  marcas: z.array(IdMarca).optional(),
  removerMarcas: z.array(IdMarca).optional(),
  personagens: z.array(PapelNovo).optional(),
  /** Copia um personagem para outro papel (ex.: o primeiro amor vira o amor atual). */
  promover: z.strictObject({ de: z.enum(PAPEIS), para: PapelNovo }).optional(),
  agendar: z.array(Agendamento).optional(),
  /** Causa da morte, terminando a frase "morreu aos N anos, ...". */
  morte: z.string().min(3).optional(),
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
    atributo: Atributo.optional(),
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
  .superRefine((e, ctx) => {
    if (e.teste) {
      if (!e.sucesso || !e.fracasso) ctx.addIssue({ code: 'custom', message: 'escolha com teste precisa de sucesso e fracasso' });
      if (e.resultado) ctx.addIssue({ code: 'custom', message: 'escolha com teste usa sucesso/fracasso, não resultado' });
    } else {
      if (!e.resultado) ctx.addIssue({ code: 'custom', message: 'escolha sem teste precisa de resultado' });
      if (e.sucesso || e.fracasso) ctx.addIssue({ code: 'custom', message: 'sucesso/fracasso só existem com teste' });
    }
  });
export type Escolha = z.infer<typeof Escolha>;

export const Evento = z
  .strictObject({
    id: IdEvento,
    /** Faixa de idade [min, max] em que o evento pode ser sorteado. */
    idade: FaixaIdade.optional(),
    /** Só acontece quando outro efeito o agenda. */
    apenasAgendado: z.boolean().optional(),
    /** Marco da vida: quando elegível, acontece sem depender do ritmo do sorteio. */
    marco: z.boolean().optional(),
    condicoes: Condicoes.optional(),
    peso: z.number().positive().optional(),
    repetivel: z.boolean().optional(),
    /** Anos mínimos entre repetições. */
    intervalo: z.number().int().min(1).optional(),
    /** Valores em reais de hoje usados no texto como {nome_do_valor}. */
    valores: z.record(z.string().regex(/^[a-z_]+$/), z.number()).optional(),
    texto: z.string().min(1),
    /** Frase no passado para o cartão da vida: "aos 34, <resumo>". */
    resumo: z.string().min(3),
    escolhas: z.array(Escolha).min(1).max(4).optional(),
    /** Para acontecimentos sem escolha. */
    efeitos: Efeitos.optional(),
  })
  .superRefine((ev, ctx) => {
    if (ev.apenasAgendado && ev.idade) ctx.addIssue({ code: 'custom', message: 'evento apenasAgendado não usa idade', path: ['idade'] });
    if (!ev.apenasAgendado && !ev.idade) ctx.addIssue({ code: 'custom', message: 'evento sorteável precisa de idade', path: ['idade'] });
    if (ev.idade && ev.idade[0] > ev.idade[1]) ctx.addIssue({ code: 'custom', message: 'idade mínima maior que a máxima', path: ['idade'] });
    if (ev.escolhas && ev.efeitos) ctx.addIssue({ code: 'custom', message: 'use escolhas ou efeitos, não os dois' });
    if (ev.intervalo && !ev.repetivel) ctx.addIssue({ code: 'custom', message: 'intervalo só vale para evento repetível', path: ['intervalo'] });
    if (ev.marco && ev.apenasAgendado) ctx.addIssue({ code: 'custom', message: 'marco não combina com apenasAgendado', path: ['marco'] });
  });
export type Evento = z.infer<typeof Evento>;
export const ArquivoEventos = z.array(Evento);

export const Linha = z.strictObject({
  idade: FaixaIdade,
  texto: z.string().min(1),
  condicoes: Condicoes.optional(),
  peso: z.number().positive().optional(),
});
export type Linha = z.infer<typeof Linha>;
export const ArquivoLinhas = z.array(Linha);

export const CausaMorte = z.strictObject({
  causa: z.string().min(3),
  idade: FaixaIdade.optional(),
  condicoes: Condicoes.optional(),
  peso: z.number().positive().optional(),
});
export type CausaMorte = z.infer<typeof CausaMorte>;
export const ArquivoMortes = z.array(CausaMorte);

export const InfoMarca = z.strictObject({
  /** Efeito passivo aplicado todo ano enquanto a marca existir. */
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
export const ArquivoMarcas = z.record(IdMarca, InfoMarca);

const Profissao = z.strictObject({ m: z.string(), f: z.string() });

export const Mundo = z.strictObject({
  nomes: z.strictObject({ f: z.array(z.string()).min(10), m: z.array(z.string()).min(10) }),
  sobrenomes: z.array(z.string()).min(10),
  pets: z.array(z.strictObject({ nome: z.string(), genero: z.enum(['f', 'm']) })).min(5),
  cidades: z
    .array(z.strictObject({ nome: z.string(), uf: z.string().length(2), marcas: z.array(IdMarca) }))
    .min(10),
  familias: z
    .array(
      z.strictObject({
        marca: IdMarca,
        peso: z.number().positive(),
        profissoes: z.array(Profissao).min(3),
      }),
    )
    .min(1),
  /** Textos da primeira linha da vida. Variáveis extras: {profissao_mae}, {profissao_pai}. */
  nascimento: z.array(z.string()).min(1),
  /** Epitáfios genéricos quando nenhuma marca tem um. */
  epitafios: z.array(z.string()).min(3),
});
export type Mundo = z.infer<typeof Mundo>;
