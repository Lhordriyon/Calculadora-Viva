/**
 * Poder: influência (quanto o mundo escuta quem joga), fama, popularidade e
 * cargos. A influência anda todo ano para um alvo feito de patrimônio, cargo,
 * fama, bens (o jatinho, o jornal), empresa grande e linhagem; decide eleições
 * e abre portas no conteúdo. Cargos eletivos (mundo.json › cargos) se disputam
 * pela folha Carreira nos anos de eleição (municipal nos múltiplos de 4, geral
 * dois anos depois), com campanha paga; o mandato acaba sozinho. Coroa e
 * regime são cargos vitalícios que o conteúdo dá (sucessão, golpe). Quem
 * governa tem popularidade; abaixo do ponto crítico, o cargo balança (storylet
 * agendado). Decretos são storylets que mexem no país (`pais.impulso`).
 */
import { empresasDe, entradaQueDefiniu, patrimonioTotal } from './campos.ts';
import { statusDosBens } from './bens.ts';
import { noGenero, largarEmprego, tentouEsteAno } from './carreira.ts';
import type { Conteudo } from './conteudo.ts';
import { liquidoDe, tirarDeQuemJoga } from './empresa.ts';
import type { DefCargo } from './esquema.ts';
import type { Momento } from './pais.ts';
import { definirNumero, definirTexto, ganhar, lancar, novaEntrada, somar } from './livro.ts';
import { influenciaDoPatrimonio, POPULARIDADE_CRITICA, RITMO_INFLUENCIA, RITMO_POPULARIDADE, SUBSIDIARIAS_DO_CONGLOMERADO } from './regras.ts';
import { custoDaCoroa } from './coroa.ts';
import { aleatorio, normal } from './rng.ts';
import { formatarDinheiro } from './texto.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

export type OperacaoPoder = { tipo: 'candidatarCargo'; cargo: string };

export function ehOperacaoDePoder(op: { tipo: string }): op is OperacaoPoder {
  return op.tipo === 'candidatarCargo';
}

export function defCargo(c: Conteudo, id: string | undefined): DefCargo | undefined {
  return c.mundo.cargos.find((x) => x.id === id);
}

export function cargoDe(e: EstadoVida, c: Conteudo): DefCargo | undefined {
  return defCargo(c, e.entidades['eu']?.t['cargo']);
}

/** "de Campinas", "de SP", "do Brasil". */
export function ondeDoCargo(e: EstadoVida, def: DefCargo): string {
  const lugar = e.entidades['lugar'];
  return def.onde.replace('{cidade}', lugar?.nome ?? '').replace('{uf}', lugar?.t['uf'] ?? '');
}

/** O ano da próxima eleição para o cargo (eleição municipal nos anos múltiplos de 4; geral, dois anos depois). */
export function proximaEleicao(ano: number, def: DefCargo): number {
  const resto = def.esfera === 'municipal' ? 0 : 2;
  return ano + ((resto - (ano % 4) + 4) % 4);
}

/** Chance de ganhar: influência contra a dificuldade do cargo, a imagem pública (na reeleição, a aprovação do mandato) e a aparência. */
export function chanceDeEleicao(e: EstadoVida, def: DefCargo): number {
  const eu = e.entidades['eu']!;
  const imagem = ((eu.n['popularidade'] ?? 50) - 50) / 3;
  const x = ((eu.n['influencia'] ?? 0) - def.dificuldade + imagem) / 7 + ((eu.n['aparencia'] ?? 50) - 50) / 50;
  return Math.min(0.95, Math.max(0.03, 1 / (1 + Math.exp(-x))));
}

export function motivoParaNaoOperarPoder(e: EstadoVida, c: Conteudo, op: OperacaoPoder): string | null {
  const eu = e.entidades['eu']!;
  const def = defCargo(c, op.cargo);
  if (!def || def.esfera === 'vitalicio') return 'escolha o cargo';
  const atual = cargoDe(e, c);
  if (atual?.esfera === 'vitalicio') return 'quem tem coroa não disputa eleição';
  // Sob o Regime, não há eleição geral; a municipal continua, de fachada (D-03).
  if (e.entidades['pais']?.q['regime'] && def.esfera === 'geral') return 'sob o Regime, não há eleição';
  if (e.idade < def.idade) return `só a partir dos ${def.idade} anos`;
  const ano = proximaEleicao(e.ano, def);
  if (ano !== e.ano) return `a próxima eleição é em ${ano}`;
  if (atual && atual.id !== def.id && (eu.n['mandato'] ?? 0) > 1) return 'termine o mandato antes';
  if (def.seguidos !== undefined && mandatosSeguidos(e, def) >= def.seguidos) return `já foram ${def.seguidos} mandatos seguidos`;
  if ((eu.n['influencia'] ?? 0) < def.influencia) return `precisa de influência ${def.influencia}`;
  if (tentouEsteAno(e, 'poder:candidatarCargo')) return 'uma candidatura por eleição';
  if (def.campanha > liquidoDe(e) + 0.5) return `a campanha custa ${formatarDinheiro(def.campanha)}`;
  return null;
}

/**
 * Os mandatos seguidos no cargo que quem joga ocupa agora: a eleição que o deu e as reeleições depois dela, contadas
 * do livro (a mesma frase que diz "para o 2º mandato"). Fora do cargo, zero: quem ficou um mandato fora volta do um.
 */
export function mandatosSeguidos(e: EstadoVida, def: DefCargo): number {
  const eu = e.entidades['eu']!;
  if (eu.t['cargo'] !== def.id) return 0;
  const o = eu.genero === 'f' ? 'a' : 'o';
  const nome = noGenero(def.nome, eu.genero);
  const onde = ondeDoCargo(e, def);
  let n = 0;
  for (let i = e.historico.length - 1; i >= 0; i--) {
    const h = e.historico[i]!;
    if (h.ref !== 'poder:candidatarCargo') continue;
    if (h.resumo === `foi reeleit${o} ${nome} ${onde}`) n++;
    else if (h.resumo === `foi eleit${o} ${nome} ${onde}`) return n + 1;
  }
  return n;
}

/** Assume um cargo eletivo: vira o trabalho de quem joga, com salário, mandato e popularidade inicial. */
function assumir(e: EstadoVida, reg: Mudanca[], def: DefCargo, origem: number): void {
  const eu = e.entidades['eu']!;
  largarEmprego(e, reg);
  definirTexto(e, reg, 'eu', 'cargo', def.id);
  definirNumero(e, reg, 'eu', 'mandato', def.mandato);
  definirNumero(e, reg, 'eu', 'renda', def.salario);
  definirTexto(e, reg, 'eu', 'ocupacao', noGenero(def.nome, eu.genero));
  definirTexto(e, reg, 'eu', 'setor', 'publico');
  // O mandato começa com a imagem de quem ganhou, mais a lua de mel (quem venceu tem ao menos o crédito de quem votou).
  definirNumero(e, reg, 'eu', 'popularidade', Math.min(90, Math.max(45, (eu.n['popularidade'] ?? 50) + 5)));
  ganhar(e, reg, 'eu', 'politico', origem);
}

/** A candidatura nasce da anterior (a reeleição, a revanche da derrota, o degrau seguinte) ou, a primeira, da filiação. */
function causasDaCandidatura(e: EstadoVida): number[] {
  for (let i = e.historico.length - 1; i >= 0; i--) if (e.historico[i]!.ref === 'poder:candidatarCargo') return [e.historico[i]!.id];
  const filiacao = e.entidades['eu']!.q['filiado']?.causa;
  return filiacao !== undefined && filiacao !== null ? [filiacao] : [];
}

export function operarPoder(
  e: EstadoVida,
  c: Conteudo,
  op: OperacaoPoder,
  reg: Mudanca[],
  origem: number,
): { texto: string; resumo: string; causas: number[] } {
  const eu = e.entidades['eu']!;
  const def = defCargo(c, op.cargo)!;
  const causas = causasDaCandidatura(e);
  const custo = tirarDeQuemJoga(e, reg, def.campanha, 'mercado');
  const chance = chanceDeEleicao(e, def);
  const ganhou = aleatorio(e.rng) < chance;
  const votos = Math.round(Math.min(78, Math.max(4, 50 + (chance - 0.5) * 36 + normal(e.rng, 0, 4) + (ganhou ? 4 : -4))));
  const nome = noGenero(def.nome, eu.genero);
  const onde = ondeDoCargo(e, def);
  const o = eu.genero === 'f' ? 'a' : 'o';
  if (ganhou) {
    const reeleito = eu.t['cargo'] === def.id;
    // Os mandatos que o livro já conta para o mesmo cargo, no mesmo lugar: a reeleição diz qual é.
    const mandato = 1 + e.historico.filter((h) => h.resumo === `foi eleit${o} ${nome} ${onde}` || h.resumo === `foi reeleit${o} ${nome} ${onde}`).length;
    assumir(e, reg, def, origem);
    const verbo = reeleito ? `reeleit${o}` : `eleit${o}`;
    const qual = mandato > 1 ? ` para o ${mandato}º mandato` : '';
    return {
      texto: `Eleições de ${e.ano}: você foi ${verbo} ${nome} ${onde}${qual}, com ${Math.max(51, votos)}% dos votos e uma campanha de ${formatarDinheiro(custo)}.`,
      resumo: `foi ${verbo} ${nome} ${onde}`,
      causas,
    };
  }
  somar(e, reg, 'eu', 'influencia', 2);
  const resumo = `perdeu a eleição para ${nome}`;
  const derrota = 1 + e.historico.filter((h) => h.resumo === resumo).length;
  return {
    texto:
      derrota > 1
        ? `Eleições de ${e.ano}: ${Math.min(49, votos)}% dos votos para ${nome} ${onde} não bastaram. Foi a ${derrota}ª derrota, e a campanha custou ${formatarDinheiro(custo)}.`
        : `Eleições de ${e.ano}: ${Math.min(49, votos)}% dos votos para ${nome} ${onde} não bastaram. A campanha custou ${formatarDinheiro(custo)}, e o seu nome ficou mais conhecido.`,
    resumo,
    causas,
  };
}

/** O que a influência persegue: patrimônio, cargo, fama, bens, empresas grandes (o conglomerado, mais) e linhagem. */
export function influenciaAlvo(e: EstadoVida, c: Conteudo): number {
  const eu = e.entidades['eu']!;
  const grupo = empresasDe(e);
  const valor = grupo.reduce((s, x) => s + (x.n['valor'] ?? 0), 0);
  const subsidiarias = grupo.reduce((s, x) => s + (x.n['subsidiarias'] ?? 0), 0);
  const grande = (valor >= 1e8 ? 6 : 0) + (subsidiarias >= SUBSIDIARIAS_DO_CONGLOMERADO ? 3 : 0);
  const linhagem = eu.q['principe'] || eu.q['herdeiro_regime'] ? 20 : eu.q['filho_de_politico'] ? 8 : 0;
  const alvo =
    influenciaDoPatrimonio(patrimonioTotal(e)) + statusDosBens(e, c) + 0.3 * (eu.n['fama'] ?? 0) + (cargoDe(e, c)?.poder ?? 0) + grande + linhagem;
  return Math.min(100, Math.max(0, alvo));
}

const BONUS_DA_FASE: Record<string, number> = { normal: 0, expansao: 10, recessao: -10, crise: -20 };

/** O ano do poder: influência e popularidade andam, o mandato corre. */
export function regraDoPoder(e: EstadoVida, c: Conteudo, fase: Momento, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  if (e.idade < 14) return;
  const inf = eu.n['influencia'] ?? 0;
  const alvo = influenciaAlvo(e, c);
  if (Math.abs(alvo - inf) >= 0.3) somar(e, reg, 'eu', 'influencia', (alvo - inf) * RITMO_INFLUENCIA, 'poder');
  const def = cargoDe(e, c);
  if (!def) return;
  // Quem governa o país tem a aprovação do governo como popularidade (pais.ts); os outros cargos sentem a fase.
  const pop = eu.n['popularidade'] ?? 50;
  // A coroa da ilha cobra do povo de lá: a parte dos impostos e a taxa puxam a popularidade de quem é soberano (coroa.ts).
  if (!def.governa) somar(e, reg, 'eu', 'popularidade', (50 + (BONUS_DA_FASE[fase.id] ?? 0) - custoDaCoroa(e, 'ilha') - pop) * RITMO_POPULARIDADE + normal(e.rng, 0, 3), 'poder');
  // Abaixo do ponto crítico, o cargo balança: na ilha, a greve geral; nos outros, a queda do cargo.
  const queda = def.id === 'soberano' ? 'greve_na_ilha' : 'queda_do_cargo';
  if ((eu.n['popularidade'] ?? 50) < POPULARIDADE_CRITICA && c.porId.has(queda) && !e.agenda.some((a) => a.evento === queda)) {
    e.agenda.push({ evento: queda, ano: e.ano, origem: eu.q['politico']?.causa ?? eu.q['monarca']?.causa ?? eu.q['ditador']?.causa ?? eu.q['micronacao']?.causa ?? null });
  }
  if (def.esfera === 'vitalicio') return;
  // O último ano do mandato (0) é ano de eleição: dá para tentar a reeleição ainda no cargo.
  const restante = eu.n['mandato'] ?? 0;
  if (restante > 0) {
    definirNumero(e, reg, 'eu', 'mandato', restante - 1, 'poder');
    return;
  }
  // O mandato acabou: sem reeleição, volta a ser só quem era (com o nome conhecido).
  const fim: Mudanca[] = [];
  // O fim do mandato descende da eleição que o deu: o que vem depois do cargo (ex_politico) também.
  const posse = entradaQueDefiniu(e, 'eu', 'cargo');
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'poder:fim_do_mandato', texto: '', ...(posse !== null ? { causas: [posse] } : {}) });
  const nome = noGenero(def.nome, eu.genero);
  definirTexto(e, fim, 'eu', 'cargo', '');
  definirNumero(e, fim, 'eu', 'renda', 0);
  definirTexto(e, fim, 'eu', 'ocupacao', '');
  ganhar(e, fim, 'eu', 'ex_politico', entrada.id);
  entrada.texto = `O mandato de ${nome} acabou. O telefone tocou bem menos na semana seguinte.`;
  entrada.resumo = `deixou o cargo de ${nome}`;
  lancar(e, entrada, fim);
}
