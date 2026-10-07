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
import { patrimonioTotal } from './campos.ts';
import { statusDosBens } from './bens.ts';
import { noGenero, largarEmprego, tentouEsteAno } from './carreira.ts';
import type { Conteudo } from './conteudo.ts';
import { liquidoDe, tirarDeQuemJoga } from './empresa.ts';
import type { DefCargo, DefFase } from './esquema.ts';
import { definirNumero, definirTexto, ganhar, lancar, novaEntrada, somar } from './livro.ts';
import { influenciaDoPatrimonio, POPULARIDADE_CRITICA, RITMO_INFLUENCIA, RITMO_POPULARIDADE } from './regras.ts';
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

/** Chance de ganhar: influência contra a dificuldade do cargo, a aparência e, na reeleição, a popularidade. */
export function chanceDeEleicao(e: EstadoVida, def: DefCargo): number {
  const eu = e.entidades['eu']!;
  const reeleicao = eu.t['cargo'] === def.id ? ((eu.n['popularidade'] ?? 50) - 50) / 3 : 0;
  const x = ((eu.n['influencia'] ?? 0) - def.dificuldade + reeleicao) / 7 + ((eu.n['aparencia'] ?? 50) - 50) / 50;
  return Math.min(0.95, Math.max(0.03, 1 / (1 + Math.exp(-x))));
}

export function motivoParaNaoOperarPoder(e: EstadoVida, c: Conteudo, op: OperacaoPoder): string | null {
  const eu = e.entidades['eu']!;
  const def = defCargo(c, op.cargo);
  if (!def || def.esfera === 'vitalicio') return 'escolha o cargo';
  const atual = cargoDe(e, c);
  if (atual?.esfera === 'vitalicio') return 'quem tem coroa não disputa eleição';
  if (e.idade < def.idade) return `só a partir dos ${def.idade} anos`;
  const ano = proximaEleicao(e.ano, def);
  if (ano !== e.ano) return `a próxima eleição é em ${ano}`;
  if (atual && atual.id !== def.id && (eu.n['mandato'] ?? 0) > 1) return 'termine o mandato antes';
  if ((eu.n['influencia'] ?? 0) < def.influencia) return `precisa de influência ${def.influencia}`;
  if (tentouEsteAno(e, 'poder:candidatarCargo')) return 'uma candidatura por eleição';
  if (def.campanha > liquidoDe(e) + 0.5) return `a campanha custa ${formatarDinheiro(def.campanha)}`;
  return null;
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
  definirNumero(e, reg, 'eu', 'popularidade', 55);
  ganhar(e, reg, 'eu', 'politico', origem);
}

export function operarPoder(e: EstadoVida, c: Conteudo, op: OperacaoPoder, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  const eu = e.entidades['eu']!;
  const def = defCargo(c, op.cargo)!;
  const custo = tirarDeQuemJoga(e, reg, def.campanha);
  const chance = chanceDeEleicao(e, def);
  const ganhou = aleatorio(e.rng) < chance;
  const votos = Math.round(Math.min(78, Math.max(4, 50 + (chance - 0.5) * 36 + normal(e.rng, 0, 4) + (ganhou ? 4 : -4))));
  const nome = noGenero(def.nome, eu.genero);
  const onde = ondeDoCargo(e, def);
  if (ganhou) {
    const reeleito = eu.t['cargo'] === def.id;
    assumir(e, reg, def, origem);
    const verbo = reeleito ? `reeleit${eu.genero === 'f' ? 'a' : 'o'}` : `eleit${eu.genero === 'f' ? 'a' : 'o'}`;
    return {
      texto: `Eleições de ${e.ano}: você foi ${verbo} ${nome} ${onde} com ${Math.max(51, votos)}% dos votos. A campanha custou ${formatarDinheiro(custo)}.`,
      resumo: `foi ${verbo} ${nome} ${onde}`,
    };
  }
  somar(e, reg, 'eu', 'influencia', 2);
  return {
    texto: `Eleições de ${e.ano}: ${Math.min(49, votos)}% dos votos para ${nome} ${onde} não bastaram. A campanha custou ${formatarDinheiro(custo)}, e o seu nome ficou mais conhecido.`,
    resumo: `perdeu a eleição para ${nome}`,
  };
}

/** O que a influência persegue: patrimônio, cargo, fama, bens, empresa grande e linhagem. */
export function influenciaAlvo(e: EstadoVida, c: Conteudo): number {
  const eu = e.entidades['eu']!;
  const empresa = e.entidades['empresa'];
  const grande = empresa && empresa.vivo !== false && (empresa.n['valor'] ?? 0) >= 1e8 ? 6 : 0;
  const linhagem = eu.q['principe'] || eu.q['herdeiro_regime'] ? 20 : eu.q['filho_de_politico'] ? 8 : 0;
  const alvo =
    influenciaDoPatrimonio(patrimonioTotal(e)) + statusDosBens(e, c) + 0.3 * (eu.n['fama'] ?? 0) + (cargoDe(e, c)?.poder ?? 0) + grande + linhagem;
  return Math.min(100, Math.max(0, alvo));
}

const BONUS_DA_FASE: Record<string, number> = { normal: 0, expansao: 10, recessao: -10, crise: -20 };

/** O ano do poder: influência e popularidade andam, o mandato corre, o empurrão no país se desfaz. */
export function regraDoPoder(e: EstadoVida, c: Conteudo, fase: DefFase, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  const pais = e.entidades['pais']!;
  const impulso = pais.n['impulso'] ?? 0;
  if (Math.abs(impulso) >= 0.05) somar(e, reg, 'pais', 'impulso', -impulso * 0.5, 'poder');
  if (e.idade < 14) return;
  const inf = eu.n['influencia'] ?? 0;
  const alvo = influenciaAlvo(e, c);
  if (Math.abs(alvo - inf) >= 0.3) somar(e, reg, 'eu', 'influencia', (alvo - inf) * RITMO_INFLUENCIA, 'poder');
  const def = cargoDe(e, c);
  if (!def) return;
  const pop = eu.n['popularidade'] ?? 50;
  somar(e, reg, 'eu', 'popularidade', (50 + (BONUS_DA_FASE[fase.id] ?? 0) - pop) * RITMO_POPULARIDADE + normal(e.rng, 0, 3), 'poder');
  if ((eu.n['popularidade'] ?? 50) < POPULARIDADE_CRITICA && c.porId.has('queda_do_cargo') && !e.agenda.some((a) => a.evento === 'queda_do_cargo')) {
    e.agenda.push({ evento: 'queda_do_cargo', ano: e.ano, origem: eu.q['politico']?.causa ?? eu.q['monarca']?.causa ?? eu.q['ditador']?.causa ?? null });
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
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'poder:fim_do_mandato', texto: '' });
  const nome = noGenero(def.nome, eu.genero);
  definirTexto(e, fim, 'eu', 'cargo', '');
  definirNumero(e, fim, 'eu', 'renda', 0);
  definirTexto(e, fim, 'eu', 'ocupacao', '');
  ganhar(e, fim, 'eu', 'ex_politico', entrada.id);
  entrada.texto = `O mandato de ${nome} acabou. O telefone tocou bem menos na semana seguinte.`;
  entrada.resumo = `deixou o cargo de ${nome}`;
  lancar(e, entrada, fim);
}
