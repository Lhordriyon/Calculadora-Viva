/**
 * A coroa recebe (bloco C). Quem tem coroa (o monarca do Brasil, cargo `rei`, e quem é soberano da ilha, cargo
 * `soberano`) escolhe como ela recebe: o salário da Casa Real (fixo), uma parte dos impostos (uma fatia da
 * arrecadação, que anda com a economia) ou a taxa da coroa (um imposto a mais, só para ela). A forma fica com o país
 * (`pais.coroa`, `ilha.coroa`), e quem herda a coroa herda a regra. A dotação é a renda de quem tem a coroa: a regra a
 * recalcula todo ano, e quem paga é o tesouro (no Brasil) ou a ilha. O povo sente: a aprovação anda para mais baixo
 * com a parte dos impostos, e muito mais com a taxa; abaixo de 30, o cargo balança.
 *
 * A ilha (o começo da I-43): o país que quem joga fundou no Pacífico, com população, PIB e imposto. Ela anda todo ano
 * (a renda por pessoa e a gente que chega ou vai embora) e passa a quem herda.
 */
import { FORMAS_DA_COROA, type FormaDaCoroa } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { definirNumero, definirTexto, somar } from './livro.ts';
import { efeitoDasPoliticas } from './pais.ts';
import { novaEntidade } from './pessoas.ts';
import { COROA, ILHA, REACAO_DA_COROA } from './regras.ts';
import { inteiro, normal } from './rng.ts';
import { formatarDinheiro } from './texto.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

export type OndeDaCoroa = 'pais' | 'ilha';
export type OperacaoCoroa = { tipo: 'coroa'; forma: FormaDaCoroa };

export function ehOperacaoDeCoroa(op: { tipo: string }): op is OperacaoCoroa {
  return op.tipo === 'coroa';
}

/** Onde fica a coroa de quem joga: o Brasil para o monarca, a ilha para quem é soberano dela; null sem coroa. */
export function paisDaCoroa(e: EstadoVida): OndeDaCoroa | null {
  const cargo = e.entidades['eu']?.t['cargo'] ?? '';
  if (cargo === 'rei') return 'pais';
  if (cargo === 'soberano' && e.entidades['ilha']) return 'ilha';
  return null;
}

/** A forma da coroa de um país (o salário da Casa Real, se nunca mudou). */
export function formaDaCoroa(e: EstadoVida, onde: OndeDaCoroa): FormaDaCoroa {
  const f = e.entidades[onde]?.t['coroa'];
  return (FORMAS_DA_COROA as readonly string[]).includes(f ?? '') ? (f as FormaDaCoroa) : 'salario';
}

/** O que o país arrecada num ano (reais de hoje): no Brasil, o PIB vezes a carga (que as políticas mudam); na ilha, o imposto dela. */
export function arrecadacaoDe(e: EstadoVida, c: Conteudo, onde: OndeDaCoroa): number {
  const pib = e.entidades[onde]?.n['pib'] ?? 0;
  if (onde === 'ilha') return pib * ILHA.imposto;
  return (pib * (COROA.carga + efeitoDasPoliticas(e, c, 'receita'))) / 100;
}

/** Quanto a coroa recebe por ano numa forma (reais de hoje). */
export function dotacaoDe(e: EstadoVida, c: Conteudo, onde: OndeDaCoroa, forma: FormaDaCoroa = formaDaCoroa(e, onde)): number {
  const regra = onde === 'pais' ? COROA.brasil : COROA.ilha;
  if (forma === 'salario') return regra.salario;
  if (forma === 'impostos') return arrecadacaoDe(e, c, onde) * regra.parte;
  return (e.entidades[onde]?.n['pib'] ?? 0) * regra.taxa;
}

/** Quanto a forma da coroa tira do ponto para onde a aprovação de quem tem a coroa anda (0 sem coroa). */
export function custoDaCoroa(e: EstadoVida, onde: OndeDaCoroa): number {
  return paisDaCoroa(e) === onde ? COROA.custo[formaDaCoroa(e, onde)] : 0;
}

// ---------------------------------------------------------------- a ilha

/** O nome da ilha: "Nova" mais a cidade natal de quem fundou ("Ilha" quando a cidade já é nova). */
function nomeDaIlha(e: EstadoVida): string {
  const cidade = e.entidades['lugar']?.nome ?? 'Esperança';
  return /^Nov[ao] /.test(cidade) ? `Ilha ${cidade}` : `Nova ${cidade}`;
}

/** A ilha nasce (o efeito `fundarIlha` da jogada): os habitantes e a renda por pessoa da fundação. */
export function fundarIlha(e: EstadoVida, reg: Mudanca[]): void {
  if (e.entidades['ilha']) return;
  e.entidades['ilha'] = novaEntidade({ id: 'ilha', tipo: 'jurisdicao', nome: nomeDaIlha(e), nascimento: e.ano, vivo: true });
  somar(e, reg, 'ilha', 'populacao', ILHA.habitantes);
  somar(e, reg, 'ilha', 'pib', ILHA.habitantes * ILHA.porPessoa);
}

/**
 * O ano da ilha: a renda por pessoa cresce (mais com o país reconhecido, menos com a taxa da coroa) e a gente chega ou
 * vai embora (a taxa espanta, a parte dos impostos um pouco). Sem soberano, a coroa não cobra nada.
 */
function anoDaIlha(e: EstadoVida, reg: Mudanca[]): void {
  const ilha = e.entidades['ilha']!;
  const reconhecida = (e.entidades['eu']?.q['pais_reconhecido']?.v ?? 0) > 0;
  const forma = paisDaCoroa(e) === 'ilha' ? formaDaCoroa(e, 'ilha') : 'salario';
  const renda = ILHA.renda + (reconhecida ? ILHA.reconhecida : 0) - (forma === 'taxa' ? ILHA.taxaNaRenda : 0) + normal(e.rng, 0, ILHA.desvio);
  const gente = ILHA.populacao + (reconhecida ? ILHA.reconhecida : 0) - ILHA.fuga[forma] + normal(e.rng, 0, ILHA.desvio / 2);
  const antes = Math.max(1, ilha.n['populacao'] ?? ILHA.habitantes);
  const porPessoa = (ilha.n['pib'] ?? antes * ILHA.porPessoa) / antes;
  const populacao = Math.max(50, Math.round(antes * (1 + gente)));
  definirNumero(e, reg, 'ilha', 'populacao', populacao, 'ilha');
  definirNumero(e, reg, 'ilha', 'pib', Math.round(populacao * porPessoa * (1 + renda)), 'ilha');
  // A ilha que passa do marco ganha a história do crescimento, com a fundação como causa.
  if (antes < ILHA.marco && populacao >= ILHA.marco) e.agenda.push({ evento: 'a_ilha_cresceu', ano: e.ano, origem: e.entidades['eu']?.q['micronacao']?.causa ?? null });
}

/**
 * O ano da coroa (depois do poder): a ilha anda e quem tem coroa recebe a dotação da forma (a renda do ano que vem,
 * paga pelo tesouro ou pela ilha). A vida de antes da ilha (o país fundado num save antigo) ganha a ilha aqui.
 */
export function regraDaCoroa(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  if (!e.entidades['ilha'] && (e.entidades['eu']?.q['micronacao']?.v ?? 0) > 0) fundarIlha(e, reg);
  if (e.entidades['ilha']) anoDaIlha(e, reg);
  acertarDotacao(e, c, reg, 'coroa');
}

/**
 * A renda de quem tem coroa é a dotação da forma de agora: a regra do ano a recalcula, e quem muda a forma (a folha,
 * uma escolha do conteúdo, a herança) a acerta na hora, para o ano que vem já pagar a forma nova.
 */
export function acertarDotacao(e: EstadoVida, c: Conteudo, reg: Mudanca[], r?: string): void {
  const onde = paisDaCoroa(e);
  if (onde) definirNumero(e, reg, 'eu', 'renda', Math.round(dotacaoDe(e, c, onde)), r);
}

// ---------------------------------------------------------------- a operação da folha Carreira e poder

/** Já mudou a forma neste ano (a mudança fica no livro). */
function mudouEsteAno(e: EstadoVida): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano === e.ano; i--) if (e.historico[i]!.ref === 'coroa:coroa') return true;
  return false;
}

export function motivoParaNaoOperarCoroa(e: EstadoVida, op: OperacaoCoroa): string | null {
  const onde = paisDaCoroa(e);
  if (!onde) return 'só quem tem coroa escolhe como ela recebe';
  if (!(FORMAS_DA_COROA as readonly string[]).includes(op.forma)) return 'escolha a forma';
  if (formaDaCoroa(e, onde) === op.forma) return 'essa já é a forma da coroa';
  if (mudouEsteAno(e)) return 'uma mudança por ano: a corte tem limite';
  return null;
}

/** O nome de cada forma, para a folha: no Brasil, o salário é da Casa Real; na ilha, da coroa. */
export function nomeDaForma(f: FormaDaCoroa, onde: OndeDaCoroa): string {
  if (f === 'salario') return onde === 'pais' ? 'Salário da Casa Real' : 'Salário da coroa';
  return f === 'impostos' ? 'Parte dos impostos' : 'Taxa da coroa';
}

/**
 * Muda a forma (já conferida): a dotação nova vale a partir do ano que vem, e o povo reage na hora ao anúncio (no
 * Brasil, a aprovação do governo, que é a sua; na ilha, a sua popularidade).
 */
export function operarCoroa(e: EstadoVida, c: Conteudo, op: OperacaoCoroa, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  const onde = paisDaCoroa(e)!;
  definirTexto(e, reg, onde, 'coroa', op.forma);
  acertarDotacao(e, c, reg);
  // A reação chega depois, com o decreto de causa: a rua contra a taxa (ou o barco de mudança, na ilha) e a conta da parte dos impostos.
  const reacao = op.forma === 'taxa' ? (onde === 'pais' ? 'rua_contra_a_taxa_da_coroa' : 'barco_de_mudanca') : op.forma === 'impostos' && onde === 'pais' ? 'a_conta_da_coroa' : null;
  if (reacao) {
    const [de, ate] = REACAO_DA_COROA[op.forma === 'taxa' ? 'taxa' : 'impostos'];
    e.agenda.push({ evento: reacao, ano: e.ano + inteiro(e.rng, de, ate), origem });
  }
  const valor = Math.round(dotacaoDe(e, c, onde, op.forma));
  const pop = somar(e, reg, 'eu', 'popularidade', COROA.anuncio[op.forma]);
  if (onde === 'pais') somar(e, reg, 'pais', 'aprovacao', pop);
  const quanto = formatarDinheiro(valor);
  const ilha = e.entidades['ilha']?.nome ?? 'a ilha';
  const daIlha = onde === 'ilha';
  const textos: Record<FormaDaCoroa, string> = {
    salario: daIlha
      ? `A coroa de ${ilha} volta ao salário: ${quanto} por ano, e nem um centavo a mais. No porto, alguém pintou "viva" no muro.`
      : `A Casa Real volta ao salário combinado com o Tesouro: ${quanto} por ano. O país quase não percebe, e esse é o ponto.`,
    impostos: daIlha
      ? `A coroa passa a ficar com um décimo do que ${ilha} arrecada: ${quanto} por ano, mais quando a ilha cresce. Os pescadores fizeram as contas.`
      : `A coroa passa a ficar com 0,01% de tudo o que o país arrecada: ${quanto} por ano, mais quando a economia cresce e menos na crise. Nas redes, a conta já circula.`,
    taxa: daIlha
      ? `Decretada a taxa da coroa: 8% de tudo o que ${ilha} produz vai para você. São ${quanto} por ano, e o primeiro barco de mudança já saiu.`
      : `Decretada a taxa da coroa: um imposto a mais, de 0,1% do PIB, só para a Casa Real. São ${quanto} por ano. Na rua, as coroas de papelão já estão sendo rasgadas.`,
  };
  const resumos: Record<FormaDaCoroa, string> = {
    salario: 'pôs a coroa de volta no salário da Casa Real',
    impostos: 'pôs a coroa para ficar com parte dos impostos',
    taxa: 'criou a taxa da coroa',
  };
  return { texto: textos[op.forma], resumo: resumos[op.forma] };
}
