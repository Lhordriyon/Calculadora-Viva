/**
 * Robôs do túnel de vento. Cada um decide sempre do mesmo jeito, nas escolhas
 * e na ficha do ano; se um deles vence em tudo, o jogo tem uma resposta certa
 * e está quebrado.
 *
 * Valor de um desfecho: soma ponderada dos efeitos imediatos, mais o efeito
 * passivo das qualidades gravadas (10 anos de horizonte), mais dinheiro (R$ 2
 * mil de hoje ≈ 1 ponto), mais vínculos (3 pontos ≈ 1), menos 200 se mata.
 * Risco: incerteza (desvio-padrão do valor entre os desfechos) mais exposição
 * (saúde perdida, dívida contraída, chance de morrer). Gastar dinheiro ou
 * perder felicidade com certeza é custo, não risco.
 */
import { acoesDoVerbo, jaAgiu } from './acoes.ts';
import { defBem, defDoBem, moradiaDe } from './bens.ts';
import { carreiraDe, chanceDeEntrar, salarioDoCargo } from './carreira.ts';
import { motivoParaNaoOperar, perfilDe, type Operacao } from './carteira.ts';
import { chanceDeEleicao } from './poder.ts';
import { governoAtual, momentoDoPais, nivelDe } from './pais.ts';
import { bensDe, empresasDe, entidadeDe, investidoDe, parteNaEmpresa, patrimonioDe, separar, titulosDe } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { FORMAS_DA_COROA, PADROES, PERFIS, POLITICAS, RETIRADAS, VERBOS, type FormaDaCoroa, type Parceiro, type Politica, type Verbo } from './constantes.ts';
import { propostaDeAcordo } from './dividas.ts';
import { padraoDe } from './economia.ts';
import { ACOES_DIPLOMATICAS, parceirosDe, type AcaoDiplomatica } from './diplomacia.ts';
import { abrirPorEfeito, empresaDe, liquidoDe, setoresDeEmpresa } from './empresa.ts';
import { ehDaEmpresa, jogadasDe } from './fortuna.ts';
import { fracaoDeUmaSubsidiaria, PREMIO_DA_BOLSA, REVERSAO_TRACAO, subsidiariasPorVenda } from './regras.ts';
import type { Efeitos, Escolha, Storylet } from './esquema.ts';
import { aleatorio, sortear, type Rng } from './rng.ts';
import { chanceDeSucesso } from './storylets.ts';
import { precoDoTitulo, taxaDoTitulo, type Prazo } from './tesouro.ts';
import { formaDaCoroa, paisDaCoroa } from './coroa.ts';
import type { Entidade, EstadoVida } from './tipos.ts';

export const ESTRATEGIAS = ['primeira', 'cautelosa', 'arriscada', 'aleatoria'] as const;
export type Estrategia = (typeof ESTRATEGIAS)[number];

const HORIZONTE_MARCA = 10;
const HORIZONTE_RENDA = 5;
const REAIS_POR_PONTO = 2000;
const VINCULO_POR_PONTO = 3;

function valorAtributos(x: { saude?: number | undefined; felicidade?: number | undefined; inteligencia?: number | undefined; aparencia?: number | undefined }): number {
  return (x.saude ?? 0) * 1.2 + (x.felicidade ?? 0) + (x.inteligencia ?? 0) * 0.6 + (x.aparencia ?? 0) * 0.5;
}

/** Rendimento real médio de onde o dinheiro está, pesado pelo tempo típico em cada fase (dinheiro parado perde a inflação). */
function rendimentoEsperado(c: Conteudo, onde: string): number {
  if (onde === 'dinheiro') return -0.045;
  const a = c.mundo.ativos.find((x) => x.id === onde);
  if (!a) return 0;
  return 0.65 * a.retorno.normal + 0.2 * a.retorno.expansao + 0.11 * a.retorno.recessao + 0.04 * a.retorno.crise;
}

function dinheiroDe(e: EstadoVida, ent: string): number {
  return e.entidades[ent]?.n['dinheiro'] ?? 0;
}

export function valorEfeitos(ef: Efeitos | undefined, e: EstadoVida, c: Conteudo, ator?: string): number {
  if (!ef) return 0;
  const eu = e.entidades['eu']!;
  let v = valorAtributos(ef);
  v += ((ef.dinheiro ?? 0) - (ef.divida ?? 0)) / REAIS_POR_PONTO;
  if (ef.dividaFator !== undefined) v += ((eu.n['divida'] ?? 0) * (1 - ef.dividaFator)) / REAIS_POR_PONTO;
  // O acordo: o desconto do banco é dinheiro que fica, e o nome limpo devolve o crédito e o financiamento.
  if (ef.renegociar) {
    const proposta = propostaDeAcordo(e, ef.renegociar.desconto);
    if (proposta) v += (proposta.antes - proposta.depois) / REAIS_POR_PONTO;
    if (eu.q['nome_sujo']) v += 5;
  }
  if (ef.patrimonioFator !== undefined) v += ((ef.patrimonioFator - 1) * (Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu))) / REAIS_POR_PONTO;
  if (ef.rendaFator !== undefined) v += ((ef.rendaFator - 1) * (eu.n['renda'] ?? 0) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  // Investir troca dinheiro parado (que encolhe) por dinheiro que rende: ~4% reais em 10 anos de horizonte.
  if (ef.investir && ef.investir > 0) v += (Math.min(ef.investir, eu.n['dinheiro'] ?? 0) * 0.48) / REAIS_POR_PONTO;
  // Resgatar é o contrário: o dinheiro sai do que rende e volta a encolher.
  if (ef.investir && ef.investir < 0) v -= (Math.min(-ef.investir, investidoDe(eu)) * 0.48) / REAIS_POR_PONTO;
  // Realocar troca o rendimento esperado de um lugar pelo de outro (dinheiro parado perde para a inflação).
  if (ef.realocar) {
    const { de, para, fracao } = ef.realocar;
    const valor = Math.max(0, eu.n[de] ?? 0) * fracao;
    v += ((rendimentoEsperado(c, para) - rendimentoEsperado(c, de)) * 10 * valor) / REAIS_POR_PONTO;
  }
  // Vender o título: a diferença entre o preço do dia e o valor, e o cupom que vira dinheiro parado (que encolhe).
  if (ef.venderTitulos !== undefined) {
    for (const tit of titulosDe(e)) {
      const preco = precoDoTitulo(e, tit) * ef.venderTitulos;
      const valor = (tit.n['valor'] ?? 0) * ef.venderTitulos;
      v += (preco - valor + (rendimentoEsperado(c, 'dinheiro') - (tit.n['taxa'] ?? 0) / 100) * 10 * preco) / REAIS_POR_PONTO;
    }
  }
  // Comprar o título troca dinheiro parado (que encolhe) pelo cupom do dia, nos anos de horizonte.
  if (ef.comprarTitulo) {
    const valor = Math.max(0, eu.n['dinheiro'] ?? 0) * ef.comprarTitulo.fracao;
    v += ((taxaDoTitulo(e, ef.comprarTitulo.prazo) / 100 - rendimentoEsperado(c, 'dinheiro')) * 10 * valor) / REAIS_POR_PONTO;
  }
  const renda = eu.n['renda'] ?? 0;
  if (ef.renda !== undefined) {
    const nova = typeof ef.renda === 'number' ? renda + ef.renda : ef.renda.definir;
    v += ((nova - renda) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  }
  const custo = eu.n['custo'] ?? 0;
  if (ef.custo !== undefined) {
    const novo = typeof ef.custo === 'number' ? custo + ef.custo : ef.custo.definir;
    v -= ((novo - custo) * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  }
  if (ef.custoDoPatrimonio !== undefined) v -= (Math.max(0, patrimonioDe(eu)) * ef.custoDoPatrimonio * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  if (ef.custoFator !== undefined) v -= ((ef.custoFator - 1) * custo * HORIZONTE_RENDA) / REAIS_POR_PONTO;
  // A empresa: o que muda na parte de quem joga (a tração vale pelos anos em que ela dura).
  const parte = parteNaEmpresa(e);
  const emp = empresaDe(e);
  if (ef.abrirEmpresa) {
    const a = ef.abrirEmpresa;
    if (a.valor !== undefined) v += (a.valor * (a.participacao ?? 1)) / REAIS_POR_PONTO;
    // O negócio da família passa para quem joga: vale metade, porque já era quase da família.
    if (a.fracao !== undefined && a.de !== undefined && entidadeDe(a.de, ator) !== 'eu') v += (Math.max(0, dinheiroDe(e, entidadeDe(a.de, ator))) * a.fracao * 0.5) / REAIS_POR_PONTO;
  }
  if (ef.empresaFator !== undefined) v += ((ef.empresaFator - 1) * parte) / REAIS_POR_PONTO;
  if (ef.venderEmpresa) v += (((ef.venderEmpresa.premio ?? 1) - 1) * parte * ef.venderEmpresa.fracao) / REAIS_POR_PONTO;
  if (ef.fecharEmpresa) v -= ((1 - ef.fecharEmpresa.sobra) * parte) / REAIS_POR_PONTO;
  if (ef.venderSubsidiarias && emp) {
    const subs = emp.n['subsidiarias'] ?? 0;
    const f = ef.venderSubsidiarias.fracao;
    const vendidas = Math.min(subs, f !== undefined ? Math.ceil(subs * f) : (ef.venderSubsidiarias.quantas ?? subsidiariasPorVenda(subs)));
    v += (((ef.venderSubsidiarias.premio ?? 1) - 1) * parte * vendidas * fracaoDeUmaSubsidiaria(subs)) / REAIS_POR_PONTO;
  }
  // A estreia na bolsa reavalia a parte de quem joga.
  if (ef.abrirCapital && emp && !emp.q['na_bolsa']) v += (PREMIO_DA_BOLSA * parte) / REAIS_POR_PONTO;
  for (const [chave, valor] of Object.entries(ef)) {
    if (!chave.includes('.') || typeof valor !== 'number') continue;
    const { ent, campo } = separar(chave);
    const id = entidadeDe(ent, ator);
    if (campo === 'vinculo') v += valor / VINCULO_POR_PONTO;
    else if (id === 'eu' && campo === 'dinheiro') v += valor / REAIS_POR_PONTO;
    else if (campo === 'saude' && id !== 'eu') v += valor * 0.15;
    else if (id === 'empresa' && emp && campo === 'tracao') v += ((valor / 100) * parte) / REVERSAO_TRACAO / REAIS_POR_PONTO;
    else if (id === 'empresa' && emp && campo === 'valor') v += (valor * (emp.n['participacao'] ?? 1)) / REAIS_POR_PONTO;
    else if (id === 'empresa' && emp && campo === 'participacao') v += (valor * (emp.n['valor'] ?? 0)) / REAIS_POR_PONTO;
  }
  if (ef.transferir) {
    const t = ef.transferir;
    const de = entidadeDe(t.de, ator);
    const para = entidadeDe(t.para, ator);
    let valor = t.valor ?? Math.max(0, dinheiroDe(e, de)) * (t.fracao ?? 0);
    if (t.max !== undefined) valor = Math.min(valor, t.max);
    if (para === 'eu') v += valor / REAIS_POR_PONTO;
    if (de === 'eu') v -= valor / REAIS_POR_PONTO;
  }
  for (const m of ef.marcas ?? []) {
    const porAno = c.marcas[m]?.porAno;
    if (porAno && !(m in eu.q)) v += valorAtributos(porAno) * HORIZONTE_MARCA;
  }
  for (const m of ef.removerMarcas ?? []) {
    const porAno = c.marcas[m]?.porAno;
    if (porAno && m in eu.q) v -= valorAtributos(porAno) * HORIZONTE_MARCA;
  }
  if (ef.morte) v -= 200;
  return v;
}

export interface Avaliacao {
  esperado: number;
  risco: number;
}

/** Exposição de um conjunto de efeitos: saúde perdida (inclusive por qualidade), dívida, morte. */
function exposicao(ef: Efeitos | undefined, e: EstadoVida, c: Conteudo): number {
  if (!ef) return 0;
  let x = Math.max(0, -(ef.saude ?? 0)) * 1.2 + Math.max(0, ef.divida ?? 0) / REAIS_POR_PONTO;
  if (ef.patrimonioFator !== undefined && ef.patrimonioFator < 1) {
    const eu = e.entidades['eu']!;
    x += ((1 - ef.patrimonioFator) * (Math.max(0, eu.n['dinheiro'] ?? 0) + investidoDe(eu))) / REAIS_POR_PONTO;
  }
  if (ef.empresaFator !== undefined && ef.empresaFator < 1) x += ((1 - ef.empresaFator) * parteNaEmpresa(e)) / REAIS_POR_PONTO;
  if (ef.fecharEmpresa) x += ((1 - ef.fecharEmpresa.sobra) * parteNaEmpresa(e)) / REAIS_POR_PONTO;
  for (const m of ef.marcas ?? []) {
    const s = c.marcas[m]?.porAno?.saude ?? 0;
    if (s < 0 && !(m in e.entidades['eu']!.q)) x += -s * HORIZONTE_MARCA * 1.2;
  }
  if (ef.morte) x += 100;
  return x;
}

type Corpo = Pick<Escolha, 'efeitos' | 'teste' | 'sucesso' | 'fracasso' | 'resultado'>;

export function avaliarEscolha(esc: Corpo, e: EstadoVida, c: Conteudo, ator?: string): Avaliacao {
  const base = valorEfeitos(esc.efeitos, e, c, ator);
  const baseX = exposicao(esc.efeitos, e, c);
  const desfechos: { p: number; v: number; x: number }[] = esc.teste
    ? [
        { p: chanceDeSucesso(esc.teste, e, ator), r: esc.sucesso },
        { p: 1 - chanceDeSucesso(esc.teste, e, ator), r: esc.fracasso },
      ].map(({ p, r }) => ({ p, v: base + valorEfeitos(r?.efeitos, e, c, ator), x: baseX + exposicao(r?.efeitos, e, c) }))
    : [{ p: 1, v: base + valorEfeitos(esc.resultado?.efeitos, e, c, ator), x: baseX + exposicao(esc.resultado?.efeitos, e, c) }];
  const esperado = desfechos.reduce((s, d) => s + d.p * d.v, 0);
  const variancia = desfechos.reduce((s, d) => s + d.p * (d.v - esperado) ** 2, 0);
  const expo = desfechos.reduce((s, d) => s + d.p * d.x, 0);
  return { esperado, risco: Math.sqrt(variancia) + expo };
}

/**
 * A melhor opção para a estratégia: o menor (cautelosa) ou o maior (arriscada) risco e, no mesmo risco, o maior
 * valor esperado. Empate em tudo (o voto, o amigo em apuros) se resolve no sorteio do robô, como quem joga escolhe
 * entre opções que valem o mesmo; sem isso, o robô levava sempre a primeira e votava 100% num bloco só.
 */
function melhorPor(estrategia: 'cautelosa' | 'arriscada', avaliacoes: Avaliacao[], rng: Rng): number {
  let melhores = [0];
  for (let i = 1; i < avaliacoes.length; i++) {
    const a = avaliacoes[i]!;
    const m = avaliacoes[melhores[0]!]!;
    const dif = estrategia === 'cautelosa' ? m.risco - a.risco : a.risco - m.risco;
    if (dif > 1e-9 || (Math.abs(dif) <= 1e-9 && a.esperado > m.esperado + 1e-9)) melhores = [i];
    else if (Math.abs(dif) <= 1e-9 && Math.abs(a.esperado - m.esperado) <= 1e-9) melhores.push(i);
  }
  // Só sorteia no empate: fora dele, o rng do robô segue a mesma sequência.
  return melhores.length === 1 ? melhores[0]! : sortear(rng, melhores);
}

/** Índice da escolha que a estratégia faz na pendência atual. */
export function decidir(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): number {
  const p = e.pendente;
  if (!p) throw new Error('Nada para decidir.');
  const disponiveis = p.opcoes.flatMap((o, i) => (o.disponivel ? [i] : []));
  const escolhas = c.porId.get(p.storylet)?.escolhas;
  if (!escolhas || disponiveis.length === 0) return 0;
  if (estrategia === 'primeira') return disponiveis[0]!;
  if (estrategia === 'aleatoria') return sortear(rng, disponiveis);
  const av = disponiveis.map((i) => avaliarEscolha(escolhas[i]!, e, c, p.ator));
  return disponiveis[melhorPor(estrategia, av, rng)]!;
}

function corpoDaAcao(s: Storylet): Corpo {
  return s.teste
    ? { efeitos: s.efeitos, teste: s.teste, sucesso: s.sucesso, fracasso: s.fracasso }
    : { efeitos: s.efeitos, resultado: { texto: '' } };
}

/** O verbo que a estratégia gasta na ficha do ano (null: deixa o ano passar). */
/** A ação do robô: o verbo e, quando ele escolhe dentro do verbo, qual ação (id e ator). Null passa o ano. */
export interface AcaoDoRobo {
  verbo: Verbo;
  escolha?: { id: string; ator?: string | undefined };
}

export function decidirAcao(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): AcaoDoRobo | null {
  if (!e.vivo || e.pendente || jaAgiu(e)) return null;
  // As ações de cada verbo, uma vez só: a primeira de cada uma é a que o verbo faria (acoes.ts › acoesPossiveis).
  const porVerbo = VERBOS.map((v) => acoesDoVerbo(e, c, v));
  const primeira = porVerbo.find((l) => l.length > 0)?.[0];
  if (!primeira) return null;
  if (estrategia === 'primeira') return { verbo: primeira.verbo };
  // Como quem joga: todas as ações de todos os verbos estão na mesa.
  const todas = porVerbo.flat();
  if (estrategia === 'aleatoria') {
    if (aleatorio(rng) < 0.15) return null;
    const a = sortear(rng, todas);
    return { verbo: a.verbo, escolha: { id: a.s.id, ator: a.ator } };
  }
  const av = [{ esperado: 0, risco: 0 }, ...todas.map((a) => avaliarEscolha(corpoDaAcao(a.s), e, c, a.ator))];
  const i = melhorPor(estrategia, av, rng);
  if (i === 0) return null;
  const a = todas[i - 1]!;
  return { verbo: a.verbo, escolha: { id: a.s.id, ator: a.ator } };
}

/**
 * O que a estratégia faz com o dinheiro no começo do ano (sem gastar a ficha).
 * Aos 18, a cautelosa vira conservadora e vive simples; a arriscada vira
 * arrojada e vive no luxo; a aleatória sorteia os dois. De três em três anos,
 * quem cuida do dinheiro aplica o que passa da reserva (um ano de gastos para
 * a cautelosa, três meses para a arriscada); a aleatória lembra disso em um
 * ano a cada cinco. A "primeira" nunca abre a folha: é quem joga sem mexer no
 * dinheiro.
 */
export function decidirDinheiro(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (!e.vivo || e.pendente || e.idade < 18 || estrategia === 'primeira') return [];
  const ops: Operacao[] = [];
  if (e.idade === 18) {
    const perfil = estrategia === 'cautelosa' ? 'conservador' : estrategia === 'arriscada' ? 'arrojado' : sortear(rng, PERFIS);
    if (perfil !== perfilDe(e)) ops.push({ tipo: 'perfil', perfil, rebalancear: true });
    const padrao = estrategia === 'cautelosa' ? 'simples' : estrategia === 'arriscada' ? 'luxo' : sortear(rng, PADROES);
    if (padrao !== padraoDe(e)) ops.push({ tipo: 'padrao', padrao });
  }
  const daEmpresa = decidirEmpresa(estrategia, e, c, rng);
  ops.push(...daEmpresa);
  ops.push(
    ...decidirCarreira(estrategia, e, c, rng),
    ...decidirPoder(estrategia, e, c, rng),
    ...decidirGoverno(estrategia, e, c, rng),
    ...decidirDiplomacia(estrategia, e, c, rng),
    ...decidirBens(estrategia, e, c, rng),
    ...decidirCoroa(estrategia, e, c, rng),
    ...venderTituloParaPagar(e),
    ...decidirDividas(estrategia, e, c, rng),
    ...decidirJogada(estrategia, e, c, rng),
    ...decidirQuemManda(estrategia, e, c, rng),
  );
  // Testamento: a aleatória, aos 50, às vezes deixa tudo para alguém fora da linha da lei (o bicho, se houver, tem a preferência,
  // e com bicho vivo ela pensa nisso mais vezes: o bicho morre cedo, e o storylet da herança dele precisa de vez).
  const temBicho = e.entidades['pet'] !== undefined && e.entidades['pet']!.vivo !== false;
  if (estrategia === 'aleatoria' && e.idade >= 30 && e.idade <= 75 && aleatorio(rng) < (temBicho ? 0.08 : 0.03)) {
    const para = temBicho && aleatorio(rng) < 0.6 ? 'pet' : sortear(rng, ['', 'amor', 'amigo', 'causa', 'sobrinho'] as const);
    if (pode(e, c, { tipo: 'testamento', para })) ops.push({ tipo: 'testamento', para });
  }
  // Abrir ou vender a empresa já mexeu na conta: aplicar fica para outro ano.
  if (daEmpresa.some((op) => op.tipo === 'abrir' || op.tipo === 'vender')) return ops;
  const lembra = estrategia === 'aleatoria' ? aleatorio(rng) < 0.2 : e.idade % 3 === 0;
  if (!lembra) return ops;
  const eu = e.entidades['eu']!;
  const conta = Math.max(0, eu.n['dinheiro'] ?? 0);
  const gastos = Math.max(eu.n['custo'] ?? 0, 10000);
  const reserva = estrategia === 'cautelosa' ? gastos : estrategia === 'arriscada' ? gastos / 4 : gastos / 2;
  const sobra = conta - reserva;
  if (sobra < 1000) return ops;
  const noTesouro = emprestarAoGoverno(estrategia, e, c, rng, sobra);
  ops.push(...noTesouro);
  const resto = sobra - noTesouro.reduce((s, op) => s + (op.tipo === 'comprarTitulo' ? op.valor : 0), 0);
  if (resto >= 1000) ops.push({ tipo: 'aplicar', valor: Math.floor(estrategia === 'aleatoria' ? resto / 2 : resto) });
  return ops;
}

/**
 * A coroa dos robôs: a cautelosa fica no salário da Casa Real e, com o povo do lado (popularidade 60 ou mais), passa a
 * receber uma parte dos impostos, de onde só volta abaixo de 40; a arriscada cobra a taxa da coroa e não recua; a
 * aleatória troca de forma de vez em quando.
 */
function decidirCoroa(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  const onde = paisDaCoroa(e);
  if (!onde) return [];
  const forma = formaDaCoroa(e, onde);
  const pop = e.entidades['eu']!.n['popularidade'] ?? 50;
  let alvo: FormaDaCoroa = forma;
  if (estrategia === 'cautelosa') alvo = pop >= 60 ? 'impostos' : pop < 40 || forma === 'taxa' ? 'salario' : forma;
  else if (estrategia === 'arriscada') alvo = 'taxa';
  else if (aleatorio(rng) < 0.3) alvo = sortear(rng, FORMAS_DA_COROA);
  const op: Operacao = { tipo: 'coroa', forma: alvo };
  return alvo !== forma && pode(e, c, op) ? [op] : [];
}

/** Devendo no banco, vende o título que vale mais: o juro da dívida come mais do que o cupom paga. */
function venderTituloParaPagar(e: EstadoVida): Operacao[] {
  if ((e.entidades['eu']!.n['divida'] ?? 0) < 1000) return [];
  const maior = titulosDe(e).sort((a, b) => precoDoTitulo(e, b) - precoDoTitulo(e, a))[0];
  return maior ? [{ tipo: 'venderTitulo', id: maior.id }] : [];
}

/**
 * O Tesouro dos robôs. A cautelosa empresta ao governo um terço da sobra quando o título longo paga bem (o juro real
 * alto, que costuma vir com a crise) e guarda até vencer; o prazo encurta com a idade. A aleatória, de vez em quando,
 * compra um prazo sorteado ou vende um título sorteado. A arriscada prefere a bolsa.
 */
function emprestarAoGoverno(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng, sobra: number): Operacao[] {
  if (estrategia === 'cautelosa') {
    const prazo: Prazo = e.idade <= 55 ? 20 : e.idade <= 70 ? 10 : 5;
    if (taxaDoTitulo(e, prazo) < 4.8) return [];
    const op: Operacao = { tipo: 'comprarTitulo', valor: Math.floor(sobra / 3), prazo };
    return pode(e, c, op) ? [op] : [];
  }
  if (estrategia !== 'aleatoria') return [];
  const titulos = titulosDe(e);
  if (titulos.length > 0 && aleatorio(rng) < 0.15) return [{ tipo: 'venderTitulo', id: sortear(rng, titulos).id }];
  if (aleatorio(rng) >= 0.3) return [];
  const op: Operacao = { tipo: 'comprarTitulo', valor: Math.floor(sobra * (0.2 + 0.3 * aleatorio(rng))), prazo: sortear(rng, [5, 10, 20] as const) };
  return pode(e, c, op) ? [op] : [];
}

/**
 * A empresa dos robôs. A arriscada abre uma entre os 22 e os 45 anos, com
 * metade do que tem, no setor em que trabalha (ou de tecnologia), e reinveste
 * tudo; a aleatória abre de vez em quando, num setor e com um capital
 * sorteados, sorteia a retirada e às vezes vende na velhice. A cautelosa
 * vende aos 65 a empresa que a vida lhe deu.
 */
const pode = (e: EstadoVida, c: Conteudo, op: Operacao): boolean => motivoParaNaoOperar(e, c, op) === null;

/** Vagas: a cautelosa busca estabilidade e salário, a arriscada o topo mais alto (palco, mercado), a aleatória sorteia. */
function decidirCarreira(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (e.idade < 17 || e.idade > 58) return [];
  const eu = e.entidades['eu']!;
  const atual = carreiraDe(e, c);
  const renda = eu.n['renda'] ?? 0;
  const vagas = c.mundo.carreiras.filter((k) => pode(e, c, { tipo: 'candidatar', carreira: k.id }));
  if (vagas.length === 0) return [];
  let alvo: (typeof vagas)[number] | undefined;
  if (estrategia === 'aleatoria') {
    if (aleatorio(rng) < (atual ? 0.06 : 0.25)) alvo = sortear(rng, vagas);
  } else if (estrategia === 'cautelosa') {
    if (!atual || (eu.n['nivel'] ?? 0) >= atual.cargos.length - 1) {
      const nota = (k: (typeof vagas)[number]) => chanceDeEntrar(e, k) * salarioDoCargo(k, 1) * (k.estavel ? 1.4 : 1);
      alvo = [...vagas].sort((a, b) => nota(b) - nota(a))[0];
    }
  } else if (!atual?.fama && e.idade <= 40) {
    const nota = (k: (typeof vagas)[number]) => chanceDeEntrar(e, k) * k.salario[1];
    alvo = [...vagas].sort((a, b) => nota(b) - nota(a))[0];
  }
  if (!alvo) return [];
  // Ninguém troca um emprego por outro que paga bem menos, a não ser pelo topo da carreira nova.
  if (estrategia !== 'aleatoria' && renda > 0 && salarioDoCargo(alvo, 0) < renda * 0.7 && alvo.salario[1] < renda * 3) return [];
  return [{ tipo: 'candidatar', carreira: alvo.id }];
}

/** Eleições: a arriscada disputa o cargo mais alto com chance razoável; a cautelosa, só o que é quase certo; a aleatória, às vezes. */
/**
 * Quem governa o país, uma reforma por ano. A cautelosa governa com as contas em ordem: imposto médio, saúde e
 * escola caprichadas, e sobe o imposto ou corta o social quando a dívida passa de 90% do PIB. A arriscada é
 * populista: imposto baixo, programa social amplo, polícia na rua e a fronteira fechada (a conta fica para depois). A aleatória
 * mexe numa política sorteada de vez em quando.
 */
const GOVERNO_DOS_ROBOS: Record<'cautelosa' | 'arriscada', Record<Politica, number>> = {
  cautelosa: { impostos: 1, social: 1, saude: 2, educacao: 2, seguranca: 1, comercio: 1 },
  arriscada: { impostos: 0, social: 2, saude: 1, educacao: 1, seguranca: 2, comercio: 2 },
};

function decidirGoverno(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (estrategia === 'primeira' || governoAtual(e) !== 'voce') return [];
  if (estrategia === 'aleatoria') {
    if (aleatorio(rng) >= 0.35) return [];
    const op: Operacao = { tipo: 'politica', politica: sortear(rng, POLITICAS), nivel: sortear(rng, [0, 1, 2]) };
    return pode(e, c, op) ? [op] : [];
  }
  const alvo = { ...GOVERNO_DOS_ROBOS[estrategia] };
  if (estrategia === 'cautelosa' && (e.entidades['pais']?.n['divida'] ?? 0) > 90) Object.assign(alvo, { impostos: 2, social: 0 });
  const politica = POLITICAS.find((p) => nivelDe(e, p) !== alvo[p]);
  if (!politica) return [];
  const op: Operacao = { tipo: 'politica', politica, nivel: alvo[politica] };
  return pode(e, c, op) ? [op] : [];
}

/**
 * Lá fora, um ato por ano. A cautelosa assina acordo quando a relação deixa e,
 * senão, se aproxima de quem anda frio com o Brasil (abaixo de 45), para fugir
 * da sanção. A arriscada, com a popularidade baixa, rompe com quem anda mais
 * frio (a bandeira na janela rende voto agora; a sanção chega depois). A
 * aleatória faz um ato sorteado de vez em quando.
 */
function decidirDiplomacia(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (estrategia === 'primeira' || governoAtual(e) !== 'voce') return [];
  const paises = parceirosDe(e);
  if (paises.length === 0) return [];
  const ato = (p: Entidade, acao: AcaoDiplomatica): Operacao[] => {
    const op: Operacao = { tipo: 'diplomacia', parceiro: p.id as Parceiro, acao };
    return pode(e, c, op) ? [op] : [];
  };
  const maisFrio = paises.reduce((a, b) => ((b.n['relacao'] ?? 50) < (a.n['relacao'] ?? 50) ? b : a));
  if (estrategia === 'aleatoria') return aleatorio(rng) < 0.15 ? ato(sortear(rng, paises), sortear(rng, ACOES_DIPLOMATICAS)) : [];
  if (estrategia === 'cautelosa') {
    for (const p of paises) {
      const acordo = ato(p, 'acordo');
      if (acordo.length > 0) return acordo;
    }
    return (maisFrio.n['relacao'] ?? 50) < 45 ? ato(maisFrio, 'aproximar') : [];
  }
  return (e.entidades['eu']!.n['popularidade'] ?? 50) < 40 && (maisFrio.n['relacao'] ?? 50) < 50 ? ato(maisFrio, 'romper') : [];
}

function decidirPoder(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (e.idade < 18 || estrategia === 'primeira') return [];
  const liquido = liquidoDe(e);
  const cargos = c.mundo.cargos.filter((k) => k.esfera !== 'vitalicio' && pode(e, c, { tipo: 'candidatarCargo', cargo: k.id }) && k.campanha <= liquido * 0.35);
  if (cargos.length === 0) return [];
  const minimo = estrategia === 'cautelosa' ? 0.6 : estrategia === 'arriscada' ? 0.3 : 0;
  if (estrategia === 'aleatoria' && aleatorio(rng) >= 0.12) return [];
  const bons = cargos.filter((k) => chanceDeEleicao(e, k) >= minimo).sort((a, b) => b.poder - a.poder);
  const alvo = estrategia === 'aleatoria' ? (bons.length ? sortear(rng, bons) : undefined) : bons[0];
  return alvo ? [{ tipo: 'candidatarCargo', cargo: alvo.id }] : [];
}

/**
 * Dívida atrasada: a cautelosa renegocia assim que o banco aceita; a aleatória, às vezes; a arriscada espera a dívida
 * caducar (cinco anos de nome sujo, sem crédito novo nem financiamento).
 */
function decidirDividas(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  const op: Operacao = { tipo: 'renegociar' };
  if (estrategia === 'arriscada' || !pode(e, c, op)) return [];
  if (estrategia === 'cautelosa' || aleatorio(rng) < 0.3) return [op];
  return [];
}

/** O imóvel de morar mais caro que dá para financiar agora (a entrada na mão, a parcela até 40% da renda, o nome limpo). */
function casaFinanciavel(e: EstadoVida, c: Conteudo): string | undefined {
  if (moradiaDe(e)) return undefined;
  return c.mundo.bens.filter((b) => b.categoria === 'moradia' && b.financiavel && pode(e, c, { tipo: 'comprar', item: b.id, financiar: true })).sort((a, b) => b.preco - a.preco)[0]?.id;
}

/**
 * Bens: a cautelosa compra casa e carro quando sobra, sempre à vista; a arriscada financia a casa assim que a parcela
 * cabe e compra o mais caro que cabe num quinto do que tem; a aleatória, de vez em quando, à vista ou financiado.
 */
function decidirBens(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (e.idade < 20 || estrategia === 'primeira') return [];
  const liquido = liquidoDe(e);
  const tem = new Set(bensDe(e).map((b) => defDoBem(c, b)?.marca));
  const compra = (item: string): Operacao[] => (pode(e, c, { tipo: 'comprar', item }) ? [{ tipo: 'comprar', item }] : []);
  const financia = (item: string): Operacao[] => [{ tipo: 'comprar', item, financiar: true }];
  if (estrategia === 'cautelosa') {
    if (!moradiaDe(e)) {
      const casa = c.mundo.bens.filter((b) => b.categoria === 'moradia' && b.preco * 1.3 <= liquido).sort((a, b) => b.preco - a.preco)[0];
      if (casa) return compra(casa.id);
    }
    if (!tem.has('carro') && liquido >= (defBem(c, 'carro_popular')?.preco ?? 80000) * 4) return compra('carro_popular');
    if (e.idade % 5 === 0) {
      const renda = c.mundo.bens.filter((b) => b.categoria === 'imovel' && b.preco * 3 <= liquido).sort((a, b) => b.preco - a.preco)[0];
      if (renda) return compra(renda.id);
    }
    return [];
  }
  if (estrategia === 'arriscada') {
    const casa = e.idade >= 25 && e.idade <= 50 ? casaFinanciavel(e, c) : undefined;
    if (casa) return financia(casa);
    if (e.idade % 2 !== 0) return [];
    const item = c.mundo.bens.filter((b) => b.preco <= liquido * 0.2 && !tem.has(b.marca)).sort((a, b) => b.preco - a.preco)[0];
    return item ? compra(item.id) : [];
  }
  if (aleatorio(rng) >= 0.1) return [];
  const casa = casaFinanciavel(e, c);
  const opcoes: Operacao[] = [...c.mundo.bens.filter((b) => b.preco <= liquido * 0.3).map((b): Operacao => ({ tipo: 'comprar', item: b.id })), ...(casa ? financia(casa) : [])];
  if (opcoes.length === 0) return [];
  const op = sortear(rng, opcoes);
  return pode(e, c, op) ? [op] : [];
}

/**
 * Brincar de deus: a cautelosa, de vez em quando, faz a jogada mais barata que
 * cabe em 8% do que tem; a arriscada, a mais cara que cabe em 35%; a aleatória
 * sorteia qualquer uma que caiba na metade (inclusive as de graça).
 */
function decidirJogada(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  // Quem não tem nem R$ 20 milhões na mão nem abre a seção (e não gasta sorteio: as vidas comuns ficam iguais).
  if (e.idade < 20 || liquidoDe(e) < 2e7) return [];
  const chance = estrategia === 'cautelosa' ? 0.12 : estrategia === 'arriscada' ? 0.3 : 0.25;
  if (aleatorio(rng) >= chance) return [];
  const teto = liquidoDe(e) * (estrategia === 'cautelosa' ? 0.08 : estrategia === 'arriscada' ? 0.35 : 0.5);
  const jogadas = jogadasDe(e, c)
    .filter((j) => !ehDaEmpresa(j.s))
    .map((j) =>
      j.opcoes.map((o, i) => ({ id: j.s.id, i, custo: j.custos[i]!, livre: o.disponivel })).filter((x) => x.livre && x.custo <= teto && (x.custo > 0 || estrategia === 'aleatoria')),
    )
    .filter((opcoes) => opcoes.length > 0);
  if (jogadas.length === 0) return [];
  // Como quem joga: escolhe o que fazer (qualquer jogada que caiba no bolso) e, dentro dela, a opção do seu jeito:
  // a cautelosa a mais barata, a arriscada a mais cara, a aleatória qualquer uma.
  const opcoes = sortear(rng, jogadas);
  const alvo =
    estrategia === 'aleatoria'
      ? sortear(rng, opcoes)
      : [...opcoes].sort((a, b) => (estrategia === 'arriscada' ? b.custo - a.custo : a.custo - b.custo))[0]!;
  return [{ tipo: 'jogada', id: alvo.id, escolha: alvo.i }];
}

/** O quanto a opção mexe na dependência da empresa (negativo é delegar). */
function deltaDependencia(e: EstadoVida, esc: Escolha | undefined): number {
  const v = (esc?.efeitos as Record<string, unknown> | undefined)?.['empresa.dependencia'];
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object' && 'definir' in v) return Number((v as { definir: unknown }).definir) - (empresaDe(e)?.n['dependencia'] ?? 0);
  return 0;
}

/**
 * Quem manda na empresa (as jogadas da seção Empresa), em um ano a cada cinco
 * para quem tem uma de R$ 15 milhões: a cautelosa delega (a empresa sobrevive
 * a ela); a arriscada quer crescer, então centraliza enquanto a empresa é
 * pequena (o talento pesa mais) e delega quando ela passa de R$ 100 milhões
 * (a mesa do dono vira o freio); a aleatória sorteia.
 */
function decidirQuemManda(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  if (e.idade < 22 || (empresaDe(e)?.n['valor'] ?? 0) < 1.5e7) return [];
  if (aleatorio(rng) >= 0.2) return [];
  const teto = liquidoDe(e) * 0.2;
  const opcoes = jogadasDe(e, c)
    .filter((j) => ehDaEmpresa(j.s))
    .flatMap((j) => j.opcoes.map((o, i) => ({ id: j.s.id, i, livre: o.disponivel && j.custos[i]! <= teto, delta: deltaDependencia(e, j.s.escolhas?.[i]) })))
    .filter((x) => x.livre);
  if (opcoes.length === 0) return [];
  const centralizar = estrategia === 'arriscada' && (empresaDe(e)?.n['valor'] ?? 0) < 1e8;
  const alvo = estrategia === 'aleatoria' ? sortear(rng, opcoes) : [...opcoes].sort((a, b) => (centralizar ? b.delta - a.delta : a.delta - b.delta))[0]!;
  return [{ tipo: 'jogada', id: alvo.id, escolha: alvo.i }];
}

/**
 * O grupo dos robôs (uma decisão que mexe nele por ano, porque fundir e
 * vender mudam as empresas de lugar). A arriscada compra concorrentes quando
 * o dinheiro dá, leva para a bolsa na economia aquecida e, quando a primeira
 * passa de R$ 20 milhões, abre uma segunda em outro ramo; a aleatória faz um
 * pouco de tudo, raramente (é ela quem funde); a cautelosa vende tudo aos 65.
 */
function decidirEmpresa(estrategia: Estrategia, e: EstadoVida, c: Conteudo, rng: Rng): Operacao[] {
  const emp = empresaDe(e);
  const liquido = liquidoDe(e);
  const idade = e.idade;
  const setores = setoresDeEmpresa(c).map((s) => s.id);
  if (!emp) {
    if (estrategia === 'arriscada' && idade >= 22 && idade <= 45 && liquido >= 20000) {
      const setor = e.entidades['eu']!.t['setor'] ?? '';
      return [{ tipo: 'abrir', setor: setores.includes(setor) ? setor : 'tecnologia', valor: Math.floor(liquido * 0.5) }];
    }
    if (estrategia === 'aleatoria' && idade >= 20 && idade <= 55 && liquido >= 25000 && aleatorio(rng) < 0.04) {
      return [{ tipo: 'abrir', setor: sortear(rng, setores), valor: Math.floor(liquido * (0.2 + 0.4 * aleatorio(rng))) }];
    }
    return [];
  }
  const grupo = empresasDe(e);
  const outras = grupo.filter((x) => x.id !== emp.id);
  if (estrategia === 'cautelosa') {
    // As outras primeiro: vender a que toca põe outra no lugar dela.
    return idade >= 65 ? [...grupo].reverse().map((x) => ({ tipo: 'vender', empresa: x.id }) as Operacao) : [];
  }
  if (estrategia === 'aleatoria') {
    if (e.ano - (emp.nascimento ?? e.ano) === 1) {
      const fracao = sortear(rng, RETIRADAS);
      return fracao !== (emp.n['retirada'] ?? 0) ? [{ tipo: 'retirada', fracao }] : [];
    }
    if (idade >= 60 && aleatorio(rng) < 0.05) return [{ tipo: 'vender' }];
    const sorte = aleatorio(rng);
    if (sorte < 0.02 && idade <= 60 && liquido >= 50000) return [{ tipo: 'abrir', setor: sortear(rng, setores), valor: Math.floor(liquido * (0.2 + 0.3 * aleatorio(rng))) }];
    if (sorte < 0.04 && outras.length > 0) return [{ tipo: 'fundir', empresa: emp.id, com: sortear(rng, outras).id }];
    if (sorte < 0.07) {
      const bolsa = grupo.find((x) => pode(e, c, { tipo: 'abrirCapital', empresa: x.id }));
      return bolsa ? [{ tipo: 'abrirCapital', empresa: bolsa.id }] : [];
    }
    if (sorte < 0.09) {
      const com = grupo.find((x) => (x.n['subsidiarias'] ?? 0) > 0);
      return com ? [{ tipo: 'venderSubsidiaria', empresa: com.id }] : [];
    }
    if (sorte < 0.11 && outras.length > 0) return [{ tipo: 'cuidar', empresa: sortear(rng, outras).id }];
    return [];
  }
  if (estrategia !== 'arriscada') return [];
  if (pode(e, c, { tipo: 'adquirir' }) && (emp.n['valor'] ?? 0) * 0.3 <= liquido * 0.5) return [{ tipo: 'adquirir' }];
  if (momentoDoPais(e).id === 'expansao') {
    const bolsa = grupo.find((x) => pode(e, c, { tipo: 'abrirCapital', empresa: x.id }));
    if (bolsa) return [{ tipo: 'abrirCapital', empresa: bolsa.id }];
  }
  if (grupo.length < 2 && idade <= 55 && (emp.n['valor'] ?? 0) >= 2e7 && liquido >= 1e6) {
    const ramo = setores.find((s) => s !== emp.t['setor']) ?? 'tecnologia';
    return [{ tipo: 'abrir', setor: ramo, valor: Math.floor(liquido * 0.4) }];
  }
  return [];
}

// ---------------------------------------------------------------- análise de dilemas

interface Vetor {
  saude: number;
  felicidade: number;
  inteligencia: number;
  aparencia: number;
  dinheiro: number;
  morte: number;
  risco: number;
  marcas: string;
}

function vetorDe(esc: Escolha, e: EstadoVida, c: Conteudo): Vetor {
  const desfechos = esc.teste
    ? [
        { p: chanceDeSucesso(esc.teste, e), r: esc.sucesso },
        { p: 1 - chanceDeSucesso(esc.teste, e), r: esc.fracasso },
      ]
    : [{ p: 1, r: esc.resultado }];
  const v: Vetor = { saude: 0, felicidade: 0, inteligencia: 0, aparencia: 0, dinheiro: 0, morte: 0, risco: 0, marcas: '' };
  const marcas = new Set<string>();
  for (const { p, r } of desfechos) {
    for (const ef of [esc.efeitos, r?.efeitos]) {
      if (!ef) continue;
      v.saude += p * (ef.saude ?? 0);
      v.felicidade += p * (ef.felicidade ?? 0);
      v.inteligencia += p * (ef.inteligencia ?? 0);
      v.aparencia += p * (ef.aparencia ?? 0);
      const so: Record<string, unknown> = {};
      for (const k of ['dinheiro', 'investir', 'realocar', 'venderTitulos', 'comprarTitulo', 'divida', 'renda', 'custo', 'custoDoPatrimonio', 'rendaFator', 'custoFator', 'patrimonioFator', 'abrirEmpresa', 'empresaFator', 'venderEmpresa', 'fecharEmpresa', 'rodada'] as const) {
        if (ef[k] !== undefined) so[k] = ef[k];
      }
      v.dinheiro += p * valorEfeitos(so as Efeitos, e, c);
      if (ef.morte) v.morte += p;
      const outros = Object.keys(ef).filter((k) => k.includes('.')).map((k) => `${k}=${String(ef[k])}`);
      for (const m of [...(ef.marcas ?? []), ...(ef.removerMarcas ?? []).map((x) => `-${x}`), ...(ef.agendar ?? []).map((a) => `>${a.evento}`), ...outros]) marcas.add(m);
      if (ef.transferir) marcas.add(`$${ef.transferir.de}>${ef.transferir.para}`);
    }
  }
  v.risco = avaliarEscolha(esc, e, c).risco;
  v.marcas = [...marcas].sort().join(',');
  return v;
}

const DIMENSOES = ['saude', 'felicidade', 'inteligencia', 'aparencia', 'dinheiro'] as const;

function domina(a: Vetor, b: Vetor): boolean {
  if (a.marcas !== b.marcas) return false;
  let melhorEmAlgo = a.risco < b.risco - 1e-9 || a.morte < b.morte - 1e-9;
  if (a.risco > b.risco + 1e-9 || a.morte > b.morte + 1e-9) return false;
  for (const d of DIMENSOES) {
    if (a[d] < b[d] - 1e-9) return false;
    if (a[d] > b[d] + 1e-9) melhorEmAlgo = true;
  }
  return melhorEmAlgo;
}

/**
 * Os três bolsos de adulto em que os dilemas se medem: a mesma escolha pesa diferente com R$ 1 mil, R$ 10 mil ou
 * R$ 50 milhões na conta (dinheiro e renda por ano em reais de hoje). Criança não tem bolso: vale o mesmo nos três.
 */
export const BOLSOS = {
  pobre: { dinheiro: 1_000, renda: 18_000, custo: 15_000 },
  tipico: { dinheiro: 10_000, renda: 30_000, custo: 18_000 },
  rico: { dinheiro: 50_000_000, renda: 600_000, custo: 120_000 },
} as const;
export type Bolso = keyof typeof BOLSOS;
export const NOMES_DOS_BOLSOS = Object.keys(BOLSOS) as Bolso[];

/** A empresa típica de quem tem uma, para medir os storylets que pedem empresa: R$ 1 milhão, inteira de quem joga. */
export const EMPRESA_TIPICA = 1_000_000;

/** Um estado típico para a idade de um storylet (atributos médios daquela fase), no bolso dado. */
export function estadoTipico(base: EstadoVida, idade: number, bolso: Bolso = 'tipico'): EstadoVida {
  const e = structuredClone(base);
  e.idade = idade;
  e.ano = e.anoNascimento + idade;
  const crianca = idade < 18;
  const n = e.entidades['eu']!.n;
  const b = BOLSOS[bolso];
  Object.assign(n, {
    saude: crianca ? 85 : idade < 60 ? 65 : 45,
    felicidade: 60,
    inteligencia: crianca ? 30 + idade * 1.5 : 55,
    aparencia: 50,
    renda: crianca ? 0 : b.renda,
    custo: crianca ? 0 : b.custo,
    dinheiro: crianca ? 0 : b.dinheiro,
    divida: 0,
  });
  return e;
}

/** O storylet só acontece com empresa: alguma condição lê a empresa de quem joga (e não pede que ela falte). */
export function pedeEmpresa(s: Storylet): boolean {
  const cond = s.condicoes;
  if (!cond) return false;
  const daEmpresa = (m: string): boolean => m.startsWith('empresa.');
  if ((cond.marcas ?? []).some(daEmpresa) || (cond.algumaMarca ?? []).some(daEmpresa) || (cond.marcaHa ?? []).some((x) => daEmpresa(x.marca))) return true;
  return Object.entries(cond).some(([k, v]) => (k === 'empresas' || daEmpresa(k)) && v !== false);
}

/** O título típico de quem tem um, para medir os storylets que pedem título: R$ 20 mil a 5% ao ano, com 15 anos pela frente. */
export const TITULO_TIPICO = { valor: 20_000, taxa: 5, anos: 15 } as const;

/** O storylet só acontece com título do Tesouro: alguma condição pede que quem joga tenha emprestado ao governo. */
export function pedeTitulos(s: Storylet): boolean {
  const v = s.condicoes?.['titulos' as keyof NonNullable<Storylet['condicoes']>] as { min?: number } | undefined;
  return v !== undefined && (v.min ?? 0) > 0;
}

/**
 * O estado em que um dilema se mede: o estado típico da idade, no bolso dado, e, se o storylet pede empresa ou
 * título, com a empresa típica ou o título típico (sem eles, a régua dava zero a tudo o que mexe neles).
 */
export function estadoDoDilema(c: Conteudo, base: EstadoVida, s: Storylet, idade: number, bolso: Bolso = 'tipico'): EstadoVida {
  const e = estadoTipico(base, idade, bolso);
  if (pedeEmpresa(s)) abrirPorEfeito(e, c, [], { setor: 'comercio', valor: EMPRESA_TIPICA }, undefined, 0);
  if (pedeTitulos(s)) {
    const t = TITULO_TIPICO;
    e.entidades['tit0'] = { id: 'tit0', tipo: 'titulo', nome: 'Tesouro IPCA+', nascimento: e.ano, vivo: true, n: { valor: t.valor, taxa: t.taxa, vencimento: e.ano + t.anos }, t: {}, q: {} };
  }
  return e;
}

/**
 * Falso dilema: uma escolha melhor ou igual às outras em tudo (efeitos esperados,
 * risco, mesmas qualidades). Avaliado num estado típico de adulto, no bolso dado.
 */
export function falsosDilemas(c: Conteudo, base: EstadoVida, bolso: Bolso = 'tipico'): { evento: string; escolha: number }[] {
  const achados: { evento: string; escolha: number }[] = [];
  const semEmpresa = estadoTipico(base, 30, bolso);
  for (const s of c.storylets) {
    if (!s.escolhas || s.escolhas.length < 2) continue;
    const e = pedeEmpresa(s) || pedeTitulos(s) ? estadoDoDilema(c, base, s, 30, bolso) : semEmpresa;
    const vetores = s.escolhas.map((esc) => vetorDe(esc, e, c));
    const i = vetores.findIndex((a, k) => vetores.every((b, j) => j === k || domina(a, b)));
    if (i >= 0) achados.push({ evento: s.id, escolha: i });
  }
  return achados;
}

/**
 * Storylets em que arriscar nunca compensa: há opção com risco, mas a mais
 * segura também tem o maior valor esperado. (Armadilhas de propósito entram
 * aqui e tudo bem; o número serve para não deixar o jogo inteiro assim.)
 * `avaliados` é o denominador: os storylets com 2 ou mais opções sem condição
 * e alguma com risco, os únicos que a conta olha.
 */
export function arriscarNaoCompensa(c: Conteudo, base: EstadoVida, bolso: Bolso = 'tipico'): { avaliados: number; achados: string[] } {
  const achados: string[] = [];
  let avaliados = 0;
  for (const s of c.storylets) {
    if (!s.escolhas || s.escolhas.length < 2) continue;
    const idade = s.idade ? Math.round((s.idade[0] + s.idade[1]) / 2) : 30;
    const e = estadoDoDilema(c, base, s, idade, bolso);
    // Opções com condição são situacionais (dependem de qualidades ou dinheiro): ficam de fora.
    const av = s.escolhas.filter((esc) => !esc.condicoes).map((esc) => avaliarEscolha(esc, e, c));
    if (av.length < 2) continue;
    if (!av.some((a) => a.risco > 1e-9)) continue;
    avaliados++;
    const segura = av.reduce((m, a, i) => (a.risco < av[m]!.risco - 1e-9 || (Math.abs(a.risco - av[m]!.risco) <= 1e-9 && a.esperado > av[m]!.esperado) ? i : m), 0);
    if (av.every((a) => a.esperado <= av[segura]!.esperado + 1e-9)) achados.push(s.id);
  }
  return { avaliados, achados };
}
