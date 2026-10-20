/**
 * Carreira: a profissão que quem joga escolhe e tenta pela folha Carreira
 * (mundo.json › carreiras). Cada uma tem requisitos (as mesmas condições dos
 * storylets), chance de passar pelo talento e pela fase do país, cargos que
 * sobem com os anos (salário de cada cargo entre o primeiro e o último) e fama
 * nas profissões de palco. Tentar uma vaga não gasta ficha, mas é uma por ano.
 * Mudar de emprego por um storylet (a demissão, o bico) tira a carreira.
 */
import { atende } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { momentoDoPais } from './pais.ts';
import type { DefCarreira } from './esquema.ts';
import { definirNumero, definirTexto, ganhar, lancar, novaEntrada, perder, somar } from './livro.ts';
import { PIRAMIDE, PIRAMIDE_DA_FAMA } from './regras.ts';
import { aleatorio } from './rng.ts';
import { formatarDinheiro } from './texto.ts';
import type { EstadoVida, Genero, Mudanca } from './tipos.ts';

export type OperacaoCarreira = { tipo: 'candidatar'; carreira: string } | { tipo: 'demitir' };

export function ehOperacaoDeCarreira(op: { tipo: string }): op is OperacaoCarreira {
  return op.tipo === 'candidatar' || op.tipo === 'demitir';
}

/** "médico|médica" → a forma do gênero; sem "|", o texto como está. */
export function noGenero(texto: string, genero: Genero | undefined): string {
  const i = texto.indexOf('|');
  if (i < 0) return texto;
  return genero === 'f' ? texto.slice(i + 1) : texto.slice(0, i);
}

export function defCarreira(c: Conteudo, id: string | undefined): DefCarreira | undefined {
  return c.mundo.carreiras.find((x) => x.id === id);
}

export function carreiraDe(e: EstadoVida, c: Conteudo): DefCarreira | undefined {
  return defCarreira(c, e.entidades['eu']?.t['carreira']);
}

/** Salário anual de um cargo: do primeiro ao último, crescendo por igual em proporção. */
export function salarioDoCargo(def: DefCarreira, nivel: number): number {
  const [a, b] = def.salario;
  const n = def.cargos.length - 1;
  return a * Math.pow(b / a, Math.min(nivel, n) / n);
}

export function nomeDoCargo(def: DefCarreira, nivel: number, genero: Genero | undefined): string {
  return noGenero(def.cargos[Math.min(nivel, def.cargos.length - 1)]!, genero);
}

/**
 * A profissão com o cargo entre parênteses só quando ele diz algo novo: "médica (residente)". Quando um começa pelo
 * outro, fica o mais longo ("cantor de barzinho", "atendente de telemarketing"), em vez de "cantor (cantor de barzinho)";
 * quando só a primeira palavra é a mesma, o cargo já diz a profissão ("professor adjunto", "jogador da segunda divisão").
 */
export function profissaoComCargo(nome: string, cargo: string): string {
  const n = nome.toLocaleLowerCase('pt-BR');
  const k = cargo.toLocaleLowerCase('pt-BR');
  if (n === k || n.startsWith(`${k} `)) return nome;
  if (k.startsWith(`${n} `) || n.split(' ')[0] === k.split(' ')[0]) return cargo;
  return `${nome} (${cargo})`;
}

/** Chance de passar na seleção: a base da profissão, o talento e o desemprego da fase. */
export function chanceDeEntrar(e: EstadoVida, def: DefCarreira): number {
  const talento = e.entidades['eu']!.n[def.talento] ?? 50;
  const fase = momentoDoPais(e);
  return Math.min(0.95, Math.max(0.02, (def.chance * (1 + (talento - 55) / 60)) / Math.sqrt(fase.desemprego)));
}

/** Já tentou uma vaga neste ano (as tentativas ficam no livro). */
export function tentouEsteAno(e: EstadoVida, ref: string): boolean {
  for (let i = e.historico.length - 1; i >= 0 && e.historico[i]!.ano === e.ano; i--) if (e.historico[i]!.ref === ref) return true;
  return false;
}

export function faixaDeIdade(def: DefCarreira): readonly [number, number] {
  return def.idade ?? [18, 64];
}

export function motivoParaNaoOperarCarreira(e: EstadoVida, c: Conteudo, op: OperacaoCarreira): string | null {
  const eu = e.entidades['eu']!;
  if (e.idade < 16) return 'só a partir dos 16 anos';
  if (eu.q['aposentado']) return 'você já se aposentou';
  if (op.tipo === 'demitir') return (eu.n['renda'] ?? 0) > 0 && eu.t['ocupacao'] ? null : 'você não tem emprego';
  const def = defCarreira(c, op.carreira);
  if (!def) return 'escolha a profissão';
  const [min, max] = faixaDeIdade(def);
  if (e.idade < min || e.idade > max) return `só entre ${min} e ${max} anos`;
  if (eu.t['carreira'] === def.id) return 'já é o seu trabalho';
  if (eu.t['cargo']) return 'você tem um cargo de poder';
  if (tentouEsteAno(e, 'carreira:candidatar')) return 'uma tentativa por ano';
  if (def.requisitos && !atende(def.requisitos, e)) return `exige ${def.exige}`;
  return null;
}

/** Larga o emprego atual (de qualquer origem): o salário em dólar, que era dele, acaba junto. */
export function largarEmprego(e: EstadoVida, reg: Mudanca[]): void {
  definirNumero(e, reg, 'eu', 'renda', 0);
  definirTexto(e, reg, 'eu', 'ocupacao', '');
  definirTexto(e, reg, 'eu', 'carreira', '');
  definirNumero(e, reg, 'eu', 'nivel', 0);
  perder(e, reg, 'eu', 'servidor');
  perder(e, reg, 'eu', 'salario_em_dolar');
}

/** Faz a operação (já conferida) e devolve o texto e o resumo da entrada. */
export function operarCarreira(e: EstadoVida, c: Conteudo, op: OperacaoCarreira, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  const eu = e.entidades['eu']!;
  if (op.tipo === 'demitir') {
    const era = eu.t['ocupacao'] ?? '';
    largarEmprego(e, reg);
    return { texto: `Pediu demissão${era ? ` (era ${era})` : ''}. A sensação de liberdade durou até o primeiro boleto.`, resumo: 'pediu demissão' };
  }
  const def = defCarreira(c, op.carreira)!;
  const nome = noGenero(def.nome, eu.genero);
  if (aleatorio(e.rng) >= chanceDeEntrar(e, def)) {
    // Quem insiste vê as tentativas contadas, não a mesma frase de novo.
    const resumo = `tentou ser ${nome} e não passou`;
    const vez = e.historico.filter((h) => h.resumo === resumo).length + 1;
    const texto =
      vez === 1
        ? `Tentou uma vaga de ${nome} e não passou. Ano que vem tem outra seleção.`
        : vez === 2
          ? `Tentou de novo uma vaga de ${nome}, e de novo não passou.`
          : `Tentou pela ${vez}ª vez uma vaga de ${nome}, e não foi desta vez.`;
    return { texto, resumo };
  }
  largarEmprego(e, reg);
  definirTexto(e, reg, 'eu', 'ocupacao', nome);
  definirTexto(e, reg, 'eu', 'setor', def.setor);
  definirTexto(e, reg, 'eu', 'carreira', def.id);
  definirNumero(e, reg, 'eu', 'renda', salarioDoCargo(def, 0));
  if (def.estavel) ganhar(e, reg, 'eu', 'servidor', origem);
  const cargo = nomeDoCargo(def, 0, eu.genero);
  return {
    texto: `Passou! Agora é ${profissaoComCargo(nome, cargo)}, com ${formatarDinheiro(salarioDoCargo(def, 0) / 12)} por mês.`,
    resumo: `virou ${nome}`,
  };
}

/** O ano da carreira: a fama anda para a do cargo, e o cargo pode subir (com o salário junto). */
export function regraDaCarreira(e: EstadoVida, c: Conteudo, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  const def = carreiraDe(e, c);
  const trabalhando = def !== undefined && (eu.n['renda'] ?? 0) > 0 && !eu.q['aposentado'];
  const nivel = eu.n['nivel'] ?? 0;
  const ultimo = (def?.cargos.length ?? 1) - 1;
  const alvo = trabalhando && def?.fama ? (def.fama * nivel) / Math.max(1, ultimo) : 0;
  const fama = eu.n['fama'] ?? 0;
  if (Math.abs(alvo - fama) >= 0.5) somar(e, reg, 'eu', 'fama', (alvo - fama) * (alvo > fama ? 0.35 : 0.08), 'carreira');
  if (trabalhando && def?.fim !== undefined && e.idade >= def.fim) {
    // Atleta e modelo têm prazo: a carreira acaba sozinha, com a fama indo embora devagar.
    const fim: Mudanca[] = [];
    const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'carreira:fim', texto: '' });
    const nome = noGenero(def.nome, eu.genero);
    largarEmprego(e, fim);
    entrada.texto = `Aos ${e.idade}, o corpo avisou: acabou a carreira de ${nome}. Ficaram as fotos, as histórias e a fama, que vai embora devagar.`;
    entrada.resumo = `encerrou a carreira de ${nome}`;
    lancar(e, entrada, fim);
    return;
  }
  if (!trabalhando || !def || nivel >= ultimo) return;
  const talento = eu.n[def.talento] ?? 50;
  // Pirâmide: cada degrau é mais difícil que o anterior; no palco, muito mais (pouca gente chega ao topo).
  const piramide = Math.pow(def.fama ? PIRAMIDE_DA_FAMA : PIRAMIDE, nivel);
  const chance = Math.min(0.9, Math.max(0, def.promocao * (1 + (talento - 60) / 80) * piramide));
  if (aleatorio(e.rng) >= chance) return;
  const sobe: Mudanca[] = [];
  const entrada = novaEntrada(e, { tipo: 'regra', causa: 'regra', ref: 'carreira:promocao', texto: '' });
  definirNumero(e, sobe, 'eu', 'nivel', nivel + 1);
  const renda = eu.n['renda'] ?? 0;
  somar(e, sobe, 'eu', 'renda', renda * (salarioDoCargo(def, nivel + 1) / salarioDoCargo(def, nivel) - 1));
  const cargo = nomeDoCargo(def, nivel + 1, eu.genero);
  entrada.texto = `Subiu de cargo: agora é ${cargo}, com ${formatarDinheiro((eu.n['renda'] ?? 0) / 12)} por mês.`;
  entrada.resumo = `virou ${cargo}`;
  lancar(e, entrada, sobe);
}
