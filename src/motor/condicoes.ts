import { ATRIBUTOS, type Condicoes } from './esquema.ts';
import { formatarDinheiro } from './texto.ts';
import type { EstadoVida } from './tipos.ts';

type Faixa = { min?: number | undefined; max?: number | undefined };

export function patrimonio(e: EstadoVida): number {
  const f = e.financas;
  return f.dinheiro + f.investido - f.divida;
}

function dentro(valor: number, faixa: Faixa | undefined): boolean {
  if (!faixa) return true;
  if (faixa.min !== undefined && valor < faixa.min) return false;
  if (faixa.max !== undefined && valor > faixa.max) return false;
  return true;
}

type Teste = (e: EstadoVida) => boolean;
const compiladas = new WeakMap<Condicoes, Teste>();

/**
 * Transforma a condição numa lista só com as checagens que ela usa (marcas
 * primeiro, que são as que mais eliminam). Compilada uma vez por objeto.
 */
function compilar(cond: Condicoes): Teste {
  const testes: Teste[] = [];
  if (cond.marcas) for (const m of cond.marcas) testes.push((e) => m in e.marcas);
  if (cond.semMarcas) for (const m of cond.semMarcas) testes.push((e) => !(m in e.marcas));
  if (cond.algumaMarca) {
    const ms = cond.algumaMarca;
    testes.push((e) => ms.some((m) => m in e.marcas));
  }
  for (const req of cond.marcaHa ?? []) {
    testes.push((e) => {
      const reg = e.marcas[req.marca];
      return reg !== undefined && dentro(e.idade - reg.idade, req);
    });
  }
  if (cond.genero) {
    const g = cond.genero;
    testes.push((e) => e.pessoa.genero === g);
  }
  for (const a of ATRIBUTOS) {
    const faixa = cond[a];
    if (faixa) testes.push((e) => dentro(e.atributos[a], faixa));
  }
  const { dinheiro, patrimonio: pat, divida, renda, inflacao } = cond;
  if (dinheiro) testes.push((e) => dentro(e.financas.dinheiro, dinheiro));
  if (pat) testes.push((e) => dentro(patrimonio(e), pat));
  if (divida) testes.push((e) => dentro(e.financas.divida, divida));
  if (renda) testes.push((e) => dentro(e.financas.renda, renda));
  if (inflacao) testes.push((e) => dentro(e.financas.inflacao, inflacao));
  return (e) => {
    for (const t of testes) if (!t(e)) return false;
    return true;
  };
}

export function atende(cond: Condicoes | undefined, e: EstadoVida): boolean {
  if (!cond) return true;
  let teste = compiladas.get(cond);
  if (!teste) {
    teste = compilar(cond);
    compiladas.set(cond, teste);
  }
  return teste(e);
}

/** Versão direta, sem cache (referência para os testes). */
export function atendeDireto(cond: Condicoes | undefined, e: EstadoVida): boolean {
  if (!cond) return true;
  for (const a of ATRIBUTOS) if (!dentro(e.atributos[a], cond[a])) return false;
  const f = e.financas;
  if (!dentro(f.dinheiro, cond.dinheiro)) return false;
  if (cond.patrimonio && !dentro(patrimonio(e), cond.patrimonio)) return false;
  if (!dentro(f.divida, cond.divida)) return false;
  if (!dentro(f.renda, cond.renda)) return false;
  if (!dentro(f.inflacao, cond.inflacao)) return false;
  if (cond.genero && cond.genero !== e.pessoa.genero) return false;
  if (cond.marcas) for (const m of cond.marcas) if (!(m in e.marcas)) return false;
  if (cond.algumaMarca && !cond.algumaMarca.some((m) => m in e.marcas)) return false;
  if (cond.semMarcas) for (const m of cond.semMarcas) if (m in e.marcas) return false;
  if (cond.marcaHa) {
    for (const req of cond.marcaHa) {
      const reg = e.marcas[req.marca];
      if (!reg) return false;
      const anos = e.idade - reg.idade;
      if (!dentro(anos, req)) return false;
    }
  }
  return true;
}

/** Entradas que gravaram as marcas que esta condição consultou (presentes). */
export function causasDe(cond: Condicoes | undefined, e: EstadoVida): number[] {
  if (!cond) return [];
  const nomes = new Set<string>([
    ...(cond.marcas ?? []),
    ...(cond.algumaMarca ?? []).filter((m) => m in e.marcas),
    ...(cond.marcaHa ?? []).map((r) => r.marca),
  ]);
  const causas: number[] = [];
  for (const m of nomes) {
    const origem = e.marcas[m]?.origem;
    if (origem !== undefined && origem !== null) causas.push(origem);
  }
  return causas;
}

/** Explica por que uma escolha está bloqueada (só para dinheiro; o resto fica implícito). */
export function motivoBloqueio(cond: Condicoes | undefined, e: EstadoVida): string | undefined {
  if (!cond) return undefined;
  if (cond.dinheiro?.min !== undefined && e.financas.dinheiro < cond.dinheiro.min) {
    return `precisa de ${formatarDinheiro(cond.dinheiro.min)}`;
  }
  if (cond.patrimonio?.min !== undefined && patrimonio(e) < cond.patrimonio.min) {
    return `precisa de ${formatarDinheiro(cond.patrimonio.min)} guardados`;
  }
  if (cond.divida?.max !== undefined && e.financas.divida > cond.divida.max) return 'dívida alta demais';
  return 'fora de alcance agora';
}
