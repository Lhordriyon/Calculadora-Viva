/**
 * O gestor e as jogadas do negócio (bloco H6, I-139). As jogadas pelo jeito de quem decide (`jogadasDoNegocio`) são as
 * dos robôs do túnel e as do gestor: a cautelosa amplia devagar, corta a estrutura parada, paga a dívida e o piso no
 * prejuízo; a arriscada pega crédito para a obra, cobra premium, faz lobby, tira dividendo do caixa que sobra e exporta.
 * O gestor propõe a primeira que a folha aceitaria, em palavras (`textoDaProposta`, guardada em `gestor.proposta` por
 * familia.ts › gestorNoAno), e quem joga segue ou recusa (o efeito `proposta`); no ano seguinte, os números dizem quem
 * tinha razão (familia.ts › conferirGestor).
 */
import { motivoParaNaoOperar, type Operacao } from './carteira.ts';
import { PARCEIROS } from './constantes.ts';
import type { Conteudo } from './conteudo.ts';
import { aEmpresa, ehOperacaoDeEmpresa, empresaDe, operarEmpresa } from './empresa.ts';
import { definirTexto } from './livro.ts';
import { custoDaObra, ehOperacaoDeNegocio, NIVEIS_DE_PRECO, NIVEIS_DE_SALARIO, NOME_DO_PRECO, ofertaDe, operarNegocio, VERBAS } from './negocio.ts';
import { nivelDe } from './pais.ts';
import { BOLSA, GESTOR } from './regras.ts';
import { aleatorio, criarRng, misturar, sortear, type Rng } from './rng.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';

const ARROJADOS: ReadonlySet<string> = new Set(GESTOR.arrojados);

/** O storylet da proposta e as escolhas dele que a conferência do ano seguinte lê (familia.ts › conferirGestor). */
export const PROPOSTA = 'a_proposta_do_gestor';
export const ESCOLHA_SEGUIR = 0;
export const ESCOLHA_RECUSAR = 1;

/** O jeito do gestor: arrojado pelo traço (a ambição, o gasto, a briga, a piada), cauteloso nos outros. */
export function jeitoDoGestor(en: Entidade): 'cautelosa' | 'arriscada' {
  return ARROJADOS.has(en.t['traco'] ?? '') ? 'arriscada' : 'cautelosa';
}

/**
 * As jogadas do negócio de uma empresa, pelo jeito de quem decide, só quando a conta pede: a cautelosa cresce devagar
 * quando sobra pedido, corta quando sobra estrutura, paga dividendo e investe 3%; a arriscada cresce na frente da fila,
 * investe 8%, cobra premium quando a qualidade deixa e abre mercado lá fora; a aleatória mexe de vez em quando.
 */
export function jogadasDoNegocio(estrategia: string, e: EstadoVida, c: Conteudo, emp: Entidade, rng: Rng, pode: (op: Operacao) => boolean): Operacao[] {
  const ops: Operacao[] = [];
  const n = emp.n;
  const id = emp.id;
  const ocupacao = n['ocupacao'] ?? 1;
  const primeiroAno = e.ano - (emp.nascimento ?? e.ano) <= 1;
  const tentar = (op: Operacao): boolean => {
    if (!pode(op)) return false;
    ops.push(op);
    return true;
  };
  if (estrategia === 'cautelosa') {
    if (primeiroAno) {
      tentar({ tipo: 'retirada', fracao: 0.3, empresa: id });
    }
    // A cautelosa não amplia com o setor sobrando oferta.
    if (ocupacao > 1.2 && ofertaDe(e, emp.t['setor']) < 110) tentar({ tipo: 'expandir', fracao: 0.25, empresa: id });
    else if (ocupacao < 0.55) tentar({ tipo: 'cortar', fracao: 0.2, empresa: id });
    if ((n['divida'] ?? 0) > 0) tentar({ tipo: 'pagar', empresa: id });
    // No prejuízo, paga o piso; com lucro e fila de pedidos, volta a pagar o de mercado.
    if ((n['lucro'] ?? 0) < 0 && emp.t['salario'] !== 'piso') tentar({ tipo: 'salario', nivel: 'piso', empresa: id });
    else if ((n['lucro'] ?? 0) > 0 && ocupacao > 1 && emp.t['salario'] === 'piso') tentar({ tipo: 'salario', nivel: 'mercado', empresa: id });
  } else if (estrategia === 'arriscada') {
    if (primeiroAno) tentar({ tipo: 'verbas', marketing: 0.08, pd: 0.08, empresa: id });
    // Sem caixa para a obra, pega no banco (e amplia na revisão seguinte).
    // Na bolsa, emite ações antes de pegar crédito (bloco H7): a obra sai sem dívida, e a parte de quem joga encolhe.
    if (ocupacao > 1.1 && !tentar({ tipo: 'expandir', fracao: 0.5, empresa: id }) && !tentar({ tipo: 'expandir', fracao: 0.25, empresa: id }) && !tentar({ tipo: 'emitir', empresa: id }))
      tentar({ tipo: 'emprestimo', valor: Math.round(custoDaObra(c, emp, 0.5, e)), empresa: id });
    if ((n['qualidade'] ?? 50) >= 65 && emp.t['preco'] !== 'premium') tentar({ tipo: 'preco', nivel: 'premium', empresa: id });
    // Com a empresa grande e os impostos altos, a arriscada contrata lobby (uma vez a cada tanto).
    if (!e.entidades['eu']?.q['lobista'] && (n['valor'] ?? 0) >= 50e6 && nivelDe(e, 'impostos') >= 1 && aleatorio(rng) < 0.2) tentar({ tipo: 'lobby', empresa: id });
    // Com caixa sobrando (mais de 30% do valor), passa a tirar dividendos.
    if ((n['caixa'] ?? 0) > 0.3 * (n['valor'] ?? 0) && (n['retirada'] ?? 0) < 0.3) tentar({ tipo: 'retirada', fracao: 0.3, empresa: id });
    if (!emp.t['exporta'] && (n['receita'] ?? 0) > 0) {
      const melhor = [...PARCEIROS].sort((a, b) => (e.entidades[b]?.n['relacao'] ?? 0) - (e.entidades[a]?.n['relacao'] ?? 0))[0];
      if (melhor) tentar({ tipo: 'exportar', para: melhor, empresa: id });
    }
  } else if (estrategia === 'aleatoria' && aleatorio(rng) < 0.1) {
    const sorte = aleatorio(rng);
    if (sorte < 0.35 && ocupacao > 1) tentar({ tipo: 'expandir', fracao: sortear(rng, [0.25, 0.5]), empresa: id });
    else if (sorte < 0.5) tentar({ tipo: 'preco', nivel: sortear(rng, NIVEIS_DE_PRECO), empresa: id });
    else if (sorte < 0.65) tentar({ tipo: 'verbas', marketing: sortear(rng, VERBAS), pd: sortear(rng, VERBAS), empresa: id });
    else if (sorte < 0.75) tentar({ tipo: 'salario', nivel: sortear(rng, NIVEIS_DE_SALARIO), empresa: id });
    else if (sorte < 0.85 && ocupacao < 0.7) tentar({ tipo: 'cortar', fracao: 0.25, empresa: id });
    else if (sorte < 0.9) tentar({ tipo: 'exportar', para: sortear(rng, [...PARCEIROS]), empresa: id });
  }
  return ops;
}

/** O sorteio da proposta não gasta o da vida: no mesmo ano, a proposta é a mesma (o texto do cartão e a jogada batem). */
function sorteioDaProposta(e: EstadoVida): Rng {
  return criarRng(misturar(e.semente, e.ano, 6151));
}

/** A proposta do gestor agora: a primeira jogada do jeito dele que a folha aceitaria, ou nenhuma. */
export function propostaDoGestor(e: EstadoVida, c: Conteudo): Operacao | null {
  const g = e.entidades['gestor'];
  const emp = empresaDe(e);
  if (!g || g.vivo === false || !emp || emp.n['capacidade'] === undefined) return null;
  return jogadasDoNegocio(jeitoDoGestor(g), e, c, emp, sorteioDaProposta(e), (op) => motivoParaNaoOperar(e, c, op) === null)[0] ?? null;
}

const pct = (x: number): string => `${Math.round(x * 100)}%`;

/** A proposta em palavras, com o número que a justifica (o texto do cartão e da folha Dinheiro). */
export function textoDaProposta(e: EstadoVida, op: Operacao): string {
  const n = empresaDe(e)?.n ?? {};
  switch (op.tipo) {
    case 'expandir':
      return `ampliar a estrutura em ${pct(op.fracao)}, porque os pedidos já passam ${pct(Math.max(0, (n['ocupacao'] ?? 1) - 1))} do que ela entrega`;
    case 'cortar':
      return `fechar ${pct(op.fracao)} da estrutura, porque ${pct(Math.max(0, 1 - (n['ocupacao'] ?? 1)))} dela está parada`;
    case 'pagar':
      return `quitar a dívida da empresa, de ${formatarDinheiro(n['divida'] ?? 0)}, porque o juro está comendo o lucro`;
    case 'salario':
      return op.nivel === 'piso'
        ? `pagar o piso até o lucro voltar, porque o ano fechou ${formatarDinheiro(Math.abs(n['lucro'] ?? 0))} no vermelho`
        : `voltar a pagar o salário de ${op.nivel === 'acima' ? 'acima do mercado' : 'mercado'}, porque o lucro voltou e falta gente para tanto pedido`;
    case 'retirada':
      return `distribuir ${pct(op.fracao)} do lucro em dividendos, porque o caixa está em ${formatarDinheiro(n['caixa'] ?? 0)}`;
    case 'verbas':
      return `pôr ${pct(op.marketing)} das vendas em marketing e ${pct(op.pd)} em pesquisa, porque quem não aparece não vende`;
    case 'emprestimo':
      return `pegar ${formatarDinheiro(op.valor)} no banco para a obra, porque os pedidos passam do que a estrutura entrega`;
    case 'preco':
      return `cobrar ${NOME_DO_PRECO[op.nivel]}, porque a qualidade já aguenta`;
    case 'emitir':
      return `emitir ações novas para a obra, porque os pedidos passam do que a estrutura entrega e ações não cobram juro (a sua parte cai para ${pct((empresaDe(e)?.n['participacao'] ?? 1) * (1 - BOLSA.emissao))})`;
    case 'lobby':
      return 'contratar lobby contra os impostos do país, porque o imposto come a margem';
    case 'exportar':
      return `começar a vender para ${e.entidades[op.para]?.nome ?? 'fora'}, porque é quem mais gosta da gente lá fora`;
    default:
      return 'mexer no negócio';
  }
}

/**
 * O efeito `proposta` (a resposta à proposta do gestor): seguir faz a jogada pela folha, no lançamento da escolha (o
 * motivo de recusa da folha vale; se os números mudaram desde a proposta, nada acontece); recusar não faz nada. Nos dois
 * casos a proposta sai da mesa, e a escolha fica no livro para a conferência do ano seguinte.
 */
export function seguirProposta(e: EstadoVida, c: Conteudo, reg: Mudanca[], segue: boolean, origem: number): void {
  const g = e.entidades['gestor'];
  if (!g) return;
  const op = segue ? propostaDoGestor(e, c) : null;
  if (op && textoDaProposta(e, op) === (g.t['proposta'] ?? '')) {
    if (ehOperacaoDeNegocio(op)) operarNegocio(e, c, op, reg, aEmpresa(empresaDe(e, op.empresa)!, 'A'));
    else if (ehOperacaoDeEmpresa(op)) operarEmpresa(e, c, op, reg, origem);
  }
  definirTexto(e, reg, 'gestor', 'proposta', '');
}
