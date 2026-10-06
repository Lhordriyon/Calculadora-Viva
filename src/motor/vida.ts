/**
 * O ciclo da vida: estado → +1 ano → eventos elegíveis → escolha → efeitos.
 * Funções puras sobre o estado (mutam o objeto recebido; quem precisa de
 * imutabilidade, como a interface, clona antes).
 */
import { atende, causasDe, motivoBloqueio, patrimonio } from './condicoes.ts';
import type { Conteudo } from './conteudo.ts';
import { economiaDoAno, movimentar } from './economia.ts';
import { ATRIBUTOS, type Efeitos, type Evento, type Papel, type PapelNovo, type Resultado, type Teste } from './esquema.ts';
import { fatorNovidade } from './memoria.ts';
import {
  FELICIDADE_BASE,
  IDADE_MAXIMA,
  PATRIMONIO_CONFORTO,
  RETORNO_FELICIDADE,
  derivaAparencia,
  derivaInteligencia,
  derivaSaude,
  dividaPesada,
  riscoDeMorte,
  ritmo,
} from './regras.ts';
import { aleatorio, criarRng, inteiro, normal, sortear, sortearIndice } from './rng.ts';
import { formatarDinheiro, renderizar, type ContextoTexto } from './texto.ts';
import {
  VERSAO_ESTADO,
  type Deltas,
  type EstadoVida,
  type Genero,
  type MemoriaJogador,
  type OpcaoPendente,
  type Personagem,
} from './tipos.ts';

/** Anos mínimos entre repetições de um evento repetível sem intervalo próprio. */
export const INTERVALO_PADRAO = 5;
/** Quantas linhas recentes não podem voltar. */
const MEMORIA_LINHAS = 15;
/** A perda do dinheiro parado para a inflação só aparece a partir deste valor. */
const LIMITE_CHIP_INFLACAO = 200;

export interface OpcoesNascimento {
  semente: number;
  /** Ano de nascimento (a interface usa o ano atual). */
  ano: number;
}

function limitar(v: number, min = 0, max = 100): number {
  return v < min ? min : v > max ? max : v;
}

// ---------------------------------------------------------------- texto

function variavelDe(e: EstadoVida, nome: string, valores: Record<string, number> | undefined): string | undefined {
  const f = e.financas;
  switch (nome) {
    case 'nome':
      return e.pessoa.nome;
    case 'sobrenome':
      return e.pessoa.sobrenome;
    case 'nomeCompleto':
      return `${e.pessoa.nome} ${e.pessoa.sobrenome}`;
    case 'cidade':
      return e.pessoa.cidade;
    case 'uf':
      return e.pessoa.uf;
    case 'idade':
      return String(e.idade);
    case 'ano':
      return String(e.ano);
    case 'profissao_mae':
      return e.pessoa.profissaoMae;
    case 'profissao_pai':
      return e.pessoa.profissaoPai;
    case 'dinheiro':
      return formatarDinheiro(f.dinheiro);
    case 'patrimonio':
      return formatarDinheiro(f.dinheiro + f.investido - f.divida);
    case 'salario':
      return formatarDinheiro(f.renda / 12);
  }
  const valor = valores?.[nome];
  if (valor !== undefined) return formatarDinheiro(valor);
  return e.personagens[nome as Papel]?.nome;
}

export function contexto(e: EstadoVida, valores?: Record<string, number>): ContextoTexto {
  return {
    rng: e.rng,
    genero: e.pessoa.genero,
    variavel: (nome) => variavelDe(e, nome, valores),
    generoDe: (papel) => e.personagens[papel as Papel]?.genero,
  };
}

// ---------------------------------------------------------------- nascimento

export function nascer(c: Conteudo, op: OpcoesNascimento): EstadoVida {
  const rng = criarRng(op.semente);
  const { mundo } = c;
  const genero: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';
  const nome = sortear(rng, mundo.nomes[genero]);
  const outroNome = (g: Genero): string => {
    let n = sortear(rng, mundo.nomes[g]);
    while (n === nome) n = sortear(rng, mundo.nomes[g]);
    return n;
  };
  const cidade = sortear(rng, mundo.cidades);
  const familia = mundo.familias[sortearIndice(rng, mundo.familias.map((f) => f.peso))]!;
  const sobrenome = `${sortear(rng, mundo.sobrenomes)} ${sortear(rng, mundo.sobrenomes)}`;
  const generoAmigo: Genero = aleatorio(rng) < 0.5 ? 'f' : 'm';

  const e: EstadoVida = {
    versao: VERSAO_ESTADO,
    semente: op.semente,
    rng,
    pessoa: {
      nome,
      sobrenome,
      genero,
      cidade: cidade.nome,
      uf: cidade.uf,
      profissaoMae: sortear(rng, familia.profissoes).f,
      profissaoPai: sortear(rng, familia.profissoes).m,
    },
    personagens: {
      mae: { nome: outroNome('f'), genero: 'f' },
      pai: { nome: outroNome('m'), genero: 'm' },
      avo: { nome: outroNome('f'), genero: 'f' },
      amigo: { nome: outroNome(generoAmigo), genero: generoAmigo },
    },
    anoNascimento: op.ano,
    idade: 0,
    ano: op.ano,
    atributos: {
      saude: Math.round(limitar(normal(rng, 80, 7), 45, 98)),
      felicidade: Math.round(limitar(normal(rng, 65, 8), 30, 95)),
      inteligencia: Math.round(limitar(normal(rng, 30, 10), 5, 70)),
      aparencia: Math.round(limitar(normal(rng, 50, 14), 10, 95)),
    },
    financas: { dinheiro: 0, investido: 0, divida: 0, renda: 0, custo: 0, inflacao: 0 },
    marcas: {},
    agenda: [],
    vistos: {},
    linhasRecentes: [],
    historico: [],
    pendente: null,
    vivo: true,
    morte: null,
    somaFelicidade: 0,
    proximoId: 1,
  };
  for (const m of [...cidade.marcas, familia.marca]) e.marcas[m] = { ano: op.ano, idade: 0, origem: null };

  e.historico.push({ id: 0, idade: 0, ano: op.ano, tipo: 'nascimento', texto: renderizar(sortear(rng, mundo.nascimento), contexto(e)) });
  return e;
}

// ---------------------------------------------------------------- +1 ano

export function avancarAno(e: EstadoVida, c: Conteudo, memoria?: MemoriaJogador): void {
  if (!e.vivo) throw new Error('Esta vida já terminou.');
  if (e.pendente) throw new Error('Há uma escolha esperando resposta.');
  e.idade++;
  e.ano++;
  const comida = economiaDoAno(e, e.rng);
  const inflacao = comida >= LIMITE_CHIP_INFLACAO ? comida : undefined;
  envelhecer(e, c);
  e.somaFelicidade += e.atributos.felicidade;

  if (e.idade >= IDADE_MAXIMA || aleatorio(e.rng) < riscoDeMorte(e.idade, e.atributos.saude)) {
    morrer(e, c);
    return;
  }
  const sorteado = escolherEvento(e, c, memoria);
  if (sorteado) apresentar(e, c, sorteado.evento, sorteado.causas, inflacao);
  else registrarLinha(e, c, inflacao);
}

function envelhecer(e: EstadoVida, c: Conteudo): void {
  const a = e.atributos;
  const r = e.rng;
  a.saude += derivaSaude(e.idade, a.saude) + normal(r, 0, 1.2);
  a.felicidade += (FELICIDADE_BASE - a.felicidade) * RETORNO_FELICIDADE + normal(r, 0, 2.5);
  a.inteligencia += derivaInteligencia(e.idade);
  a.aparencia += derivaAparencia(e.idade) + normal(r, 0, 0.8);
  for (const m of Object.keys(e.marcas)) {
    const porAno = c.marcas[m]?.porAno;
    if (!porAno) continue;
    for (const at of ATRIBUTOS) a[at] += porAno[at] ?? 0;
  }
  if (e.idade >= 18) {
    if (e.financas.divida > dividaPesada(e.financas.renda)) {
      a.felicidade -= 1.5;
      a.saude -= 0.3;
    }
    if (patrimonio(e) > PATRIMONIO_CONFORTO) a.felicidade += 1;
  }
  for (const at of ATRIBUTOS) a[at] = limitar(a[at]);
}

function podeAcontecer(ev: Evento, e: EstadoVida): boolean {
  const vezes = e.vistos[ev.id];
  if (vezes && vezes.length > 0) {
    if (!ev.repetivel) return false;
    if (e.idade - vezes[vezes.length - 1]! < (ev.intervalo ?? INTERVALO_PADRAO)) return false;
  }
  return atende(ev.condicoes, e);
}

function escolherEvento(
  e: EstadoVida,
  c: Conteudo,
  memoria: MemoriaJogador | undefined,
): { evento: Evento; causas: number[] } | null {
  // 1. Agendados vencidos têm prioridade; os que não cabem mais caem fora.
  const devidos = e.agenda.filter((a) => a.ano <= e.ano).sort((x, y) => x.ano - y.ano);
  for (const item of devidos) {
    e.agenda.splice(e.agenda.indexOf(item), 1);
    const ev = c.porId.get(item.evento);
    if (!ev || !podeAcontecer(ev, e)) continue;
    const causas = causasDe(ev.condicoes, e);
    if (item.origem !== null) causas.unshift(item.origem);
    return { evento: ev, causas };
  }
  // 2. Marcos da vida elegíveis acontecem sem sorteio de ritmo.
  const candidatos = c.sorteaveisPorIdade[e.idade] ?? [];
  for (const ev of candidatos) {
    if (ev.marco && podeAcontecer(ev, e)) return { evento: ev, causas: causasDe(ev.condicoes, e) };
  }
  // 3. Sorteio pelo ritmo da idade.
  if (aleatorio(e.rng) >= ritmo(e.idade)) return null;
  const elegiveis: Evento[] = [];
  const pesos: number[] = [];
  for (const ev of candidatos) {
    if (!podeAcontecer(ev, e)) continue;
    elegiveis.push(ev);
    pesos.push((ev.peso ?? 1) * fatorNovidade(memoria, ev.id));
  }
  const i = sortearIndice(e.rng, pesos);
  if (i < 0) return null;
  const evento = elegiveis[i]!;
  return { evento, causas: causasDe(evento.condicoes, e) };
}

function apresentar(e: EstadoVida, c: Conteudo, ev: Evento, causas: number[], inflacao?: number): void {
  (e.vistos[ev.id] ??= []).push(e.idade);
  const ctx = contexto(e, ev.valores);
  const texto = renderizar(ev.texto, ctx);
  const unicas = [...new Set(causas)];

  if (ev.escolhas) {
    const opcoes: OpcaoPendente[] = ev.escolhas.map((esc) => {
      const disponivel = atende(esc.condicoes, e);
      const opcao: OpcaoPendente = { texto: renderizar(esc.texto, ctx), disponivel };
      if (!disponivel) {
        const motivo = esc.bloqueio ? renderizar(esc.bloqueio, ctx) : motivoBloqueio(esc.condicoes, e);
        if (motivo) opcao.motivo = motivo;
      }
      return opcao;
    });
    if (!opcoes.some((o) => o.disponivel)) opcoes[0]!.disponivel = true;
    e.pendente = { eventoId: ev.id, texto, causas: unicas, opcoes };
    if (inflacao !== undefined) e.pendente.inflacao = inflacao;
    return;
  }

  const id = e.proximoId++;
  const deltas = aplicarEfeitos(e, c, ev.efeitos, id);
  const ctxDepois = contexto(e, ev.valores);
  e.historico.push({
    id,
    idade: e.idade,
    ano: e.ano,
    tipo: 'evento',
    eventoId: ev.id,
    texto,
    resumo: renderizar(ev.resumo, ctxDepois),
    causas: unicas,
    deltas,
    ...(inflacao !== undefined ? { inflacao } : {}),
  });
  morrerSePreciso(e, c, ev.efeitos?.morte, id);
}

// ---------------------------------------------------------------- escolha

export function chanceDeSucesso(teste: Teste, e: EstadoVida): number {
  if (teste.chance !== undefined) return teste.chance;
  const valor = e.atributos[teste.atributo ?? 'saude'];
  return limitar(0.5 + (valor - (teste.dificuldade ?? 50)) / 50, 0.05, 0.95);
}

export function escolher(e: EstadoVida, c: Conteudo, indice: number): void {
  const p = e.pendente;
  if (!p) throw new Error('Nenhuma escolha pendente.');
  const ev = c.porId.get(p.eventoId);
  if (!ev?.escolhas) {
    // O conteúdo mudou desde o save: deixa a vida seguir.
    e.pendente = null;
    return;
  }
  const esc = ev.escolhas[indice];
  const opcao = p.opcoes[indice];
  if (!esc || !opcao?.disponivel) throw new Error('Essa escolha não está disponível.');

  const id = e.proximoId++;
  let deltas = aplicarEfeitos(e, c, esc.efeitos, id);
  let resultado: Resultado;
  if (esc.teste) {
    resultado = (aleatorio(e.rng) < chanceDeSucesso(esc.teste, e) ? esc.sucesso : esc.fracasso)!;
  } else {
    resultado = esc.resultado!;
  }
  deltas = somarDeltas(deltas, aplicarEfeitos(e, c, resultado.efeitos, id));

  const ctx = contexto(e, ev.valores);
  e.historico.push({
    id,
    idade: e.idade,
    ano: e.ano,
    tipo: 'evento',
    eventoId: ev.id,
    texto: p.texto,
    resumo: renderizar(ev.resumo, ctx),
    escolha: { indice, texto: opcao.texto, resumo: renderizar(resultado.resumo ?? esc.resumo, ctx) },
    resultado: renderizar(resultado.texto, ctx),
    causas: p.causas,
    deltas,
    ...(p.inflacao !== undefined ? { inflacao: p.inflacao } : {}),
  });
  e.pendente = null;
  morrerSePreciso(e, c, resultado.efeitos?.morte ?? esc.efeitos?.morte, id);
}

function ajustar(atual: number, ajuste: number | { definir: number }): number {
  return Math.max(0, typeof ajuste === 'number' ? atual + ajuste : ajuste.definir);
}

function novoPersonagem(e: EstadoVida, c: Conteudo, papel: PapelNovo): Personagem {
  if (papel === 'pet') {
    const pet = sortear(e.rng, c.mundo.pets);
    return { nome: pet.nome, genero: pet.genero };
  }
  const genero: Genero = aleatorio(e.rng) < 0.5 ? 'f' : 'm';
  const usados = new Set([e.pessoa.nome, ...Object.values(e.personagens).map((p) => p?.nome)]);
  let nome = sortear(e.rng, c.mundo.nomes[genero]);
  for (let i = 0; i < 20 && usados.has(nome); i++) nome = sortear(e.rng, c.mundo.nomes[genero]);
  return { nome, genero };
}

export function aplicarEfeitos(e: EstadoVida, c: Conteudo, ef: Efeitos | undefined, origem: number): Deltas {
  const d: Deltas = {};
  if (!ef) return d;
  for (const at of ATRIBUTOS) {
    const v = ef[at];
    if (!v) continue;
    const antes = e.atributos[at];
    e.atributos[at] = limitar(antes + v);
    const dif = e.atributos[at] - antes;
    if (dif !== 0) d[at] = dif;
  }
  if (ef.dinheiro || ef.investir || ef.divida) {
    const m = movimentar(e, ef);
    if (Math.abs(m.dinheiro) >= 1) d.dinheiro = m.dinheiro;
    if (Math.abs(m.divida) >= 1) d.divida = m.divida;
    if (Math.abs(m.investido) >= 1) d.investido = m.investido;
  }
  const f = e.financas;
  if (ef.renda !== undefined) {
    const antes = f.renda;
    f.renda = ajustar(antes, ef.renda);
    if (f.renda !== antes) d.renda = (f.renda - antes) / 12;
  }
  if (ef.custo !== undefined) f.custo = ajustar(f.custo, ef.custo);
  for (const m of ef.removerMarcas ?? []) delete e.marcas[m];
  for (const m of ef.marcas ?? []) e.marcas[m] ??= { ano: e.ano, idade: e.idade, origem };
  for (const papel of ef.personagens ?? []) e.personagens[papel] = novoPersonagem(e, c, papel);
  if (ef.promover) {
    const p = e.personagens[ef.promover.de];
    if (p) e.personagens[ef.promover.para] = { ...p };
  }
  for (const ag of ef.agendar ?? []) {
    const anos = typeof ag.em === 'number' ? ag.em : inteiro(e.rng, ag.em[0], ag.em[1]);
    e.agenda.push({ evento: ag.evento, ano: e.ano + anos, origem });
  }
  return d;
}

function somarDeltas(a: Deltas, b: Deltas): Deltas {
  const r: Deltas = { ...a };
  for (const k of Object.keys(b) as (keyof Deltas)[]) {
    const v = (r[k] ?? 0) + (b[k] ?? 0);
    if (Math.abs(v) >= 0.5) r[k] = v;
    else delete r[k];
  }
  return r;
}

// ---------------------------------------------------------------- anos sem evento

function registrarLinha(e: EstadoVida, c: Conteudo, inflacao?: number): void {
  const candidatas = c.linhasPorIdade[Math.min(e.idade, IDADE_MAXIMA)] ?? [];
  const pesos = candidatas.map((i) => {
    const l = c.linhas[i]!;
    return !e.linhasRecentes.includes(i) && atende(l.condicoes, e) ? (l.peso ?? 1) : 0;
  });
  const sorteada = sortearIndice(e.rng, pesos);
  const i = sorteada >= 0 ? candidatas[sorteada]! : -1;
  let texto = 'Um ano sem novidade nenhuma. Às vezes é bom.';
  if (i >= 0) {
    texto = renderizar(c.linhas[i]!.texto, contexto(e));
    e.linhasRecentes.push(i);
    if (e.linhasRecentes.length > MEMORIA_LINHAS) e.linhasRecentes.shift();
  }
  e.historico.push({
    id: e.proximoId++,
    idade: e.idade,
    ano: e.ano,
    tipo: 'linha',
    texto,
    ...(inflacao !== undefined ? { inflacao } : {}),
  });
}

// ---------------------------------------------------------------- morte

/** Morte vinda de um efeito (causa explícita) ou de saúde zerada; a entrada que a provocou vira causa. */
function morrerSePreciso(e: EstadoVida, c: Conteudo, causa: string | undefined, origem: number): void {
  if (causa) morrer(e, c, { causa, causas: [origem] });
  else if (e.atributos.saude <= 0) morrer(e, c, { causas: [origem] });
}

function sortearCausa(e: EstadoVida, c: Conteudo): { causa: string; causas: number[]; fonte?: number } {
  const pesos = c.mortes.map((m) =>
    (!m.idade || (m.idade[0] <= e.idade && e.idade <= m.idade[1])) && atende(m.condicoes, e) ? (m.peso ?? 1) : 0,
  );
  const i = sortearIndice(e.rng, pesos);
  if (i < 0) return { causa: 'de causas que nem o médico soube explicar', causas: [] };
  const m = c.mortes[i]!;
  return { causa: m.causa, causas: causasDe(m.condicoes, e), fonte: i };
}

export function morrer(e: EstadoVida, c: Conteudo, de: { causa?: string; causas?: number[] } = {}): void {
  const sorteada = de.causa === undefined ? sortearCausa(e, c) : null;
  const texto = renderizar(de.causa ?? sorteada!.causa, contexto(e));
  const causas = [...new Set([...(de.causas ?? []), ...(sorteada?.causas ?? [])])];
  e.vivo = false;
  e.pendente = null;
  e.morte = { idade: e.idade, ano: e.ano, causa: texto };
  if (sorteada?.fonte !== undefined) e.morte.fonte = sorteada.fonte;
  const anos = e.idade === 1 ? 'ano' : 'anos';
  e.historico.push({
    id: e.proximoId++,
    idade: e.idade,
    ano: e.ano,
    tipo: 'morte',
    texto: `Morreu aos ${e.idade} ${anos}, ${texto}.`,
    resumo: `morreu ${texto}`,
    causas,
  });
}
