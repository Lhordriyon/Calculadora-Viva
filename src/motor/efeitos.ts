/**
 * Aplica os efeitos de um storylet. Toda mudança vai para o registro da
 * entrada que a causou (o livro-razão); `ator` resolve os caminhos "ator.x".
 */
import { ATIVOS, ATRIBUTOS, type PapelNovo } from './constantes.ts';
import { pesosDoPerfil, realocar } from './carteira.ts';
import { defCampo, entidadeDe, lerCaminho, patrimonioDe, separar } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { movimentar } from './economia.ts';
import { abrirPorEfeito, fecharEmpresa, multiplicarEmpresa, rodadaDeInvestimento, venderParte } from './empresa.ts';
import type { Efeitos } from './esquema.ts';
import { definirNumero, definirTexto, ganhar, perder, somar, somarQualidade } from './livro.ts';
import { criarPersonagem, morrerPersonagem, promover } from './pessoas.ts';
import { inteiro } from './rng.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

export interface ContextoEfeito {
  /** Entrada do livro que está sendo escrita (vira a causa das qualidades e agendamentos). */
  origem: number;
  ator?: string | undefined;
  reg: Mudanca[];
  /** Valores calculados na hora (ex.: {transferido}) para o texto. */
  valores: Record<string, number>;
}

function ajustar(atual: number, ajuste: number | { definir: number }): number {
  return Math.max(0, typeof ajuste === 'number' ? atual + ajuste : ajuste.definir);
}

/** Os caminhos de qualidade em efeitos aceitam "ator.x"; sem ponto, são de quem joga. */
function qualidade(caminho: string, ator: string | undefined): { ent: string; nome: string } {
  const { ent, campo } = separar(caminho);
  return { ent: entidadeDe(ent, ator), nome: campo };
}

export function aplicarEfeitos(e: EstadoVida, c: Conteudo, ef: Efeitos | undefined, ctx: ContextoEfeito): void {
  if (!ef) return;
  const { reg, ator, origem } = ctx;
  for (const at of ATRIBUTOS) {
    const v = ef[at];
    if (v) somar(e, reg, 'eu', at, v);
  }
  const eu = e.entidades['eu']!;
  if (ef.dividaFator !== undefined) {
    somar(e, reg, 'eu', 'divida', (eu.n['divida'] ?? 0) * (ef.dividaFator - 1));
  }
  if (ef.patrimonioFator !== undefined) {
    const f = ef.patrimonioFator - 1;
    somar(e, reg, 'eu', 'dinheiro', Math.max(0, eu.n['dinheiro'] ?? 0) * f);
    for (const a of ATIVOS) if (eu.n[a]) somar(e, reg, 'eu', a, (eu.n[a] ?? 0) * f);
  }
  if (ef.dinheiro || ef.investir || ef.divida) movimentar(e, reg, { dinheiro: ef.dinheiro, investir: ef.investir, divida: ef.divida, pesos: pesosDoPerfil(e, c) });
  if (ef.realocar) realocar(e, reg, ef.realocar.de, ef.realocar.para, ef.realocar.fracao);
  if (ef.rendaFator !== undefined) somar(e, reg, 'eu', 'renda', (eu.n['renda'] ?? 0) * (ef.rendaFator - 1));
  if (ef.renda !== undefined) definirNumero(e, reg, 'eu', 'renda', ajustar(eu.n['renda'] ?? 0, ef.renda));
  if (ef.custo !== undefined) definirNumero(e, reg, 'eu', 'custo', ajustar(eu.n['custo'] ?? 0, ef.custo));
  if (ef.custoDoPatrimonio !== undefined) somar(e, reg, 'eu', 'custo', Math.max(0, patrimonioDe(eu)) * ef.custoDoPatrimonio);
  if (ef.custoFator !== undefined) somar(e, reg, 'eu', 'custo', (eu.n['custo'] ?? 0) * (ef.custoFator - 1));
  // A empresa nasce antes dos caminhos: "empresa.tracao" no mesmo bloco já vale para ela.
  if (ef.abrirEmpresa) ctx.valores['capital'] = abrirPorEfeito(e, c, reg, ef.abrirEmpresa, ator, origem);
  if (ef.empresaFator !== undefined) multiplicarEmpresa(e, reg, ef.empresaFator);
  if (ef.rodada) ctx.valores['rodada'] = rodadaDeInvestimento(e, reg, ef.rodada.parte);

  // Campos por caminho ("mae.vinculo": 10, "ator.ocupacao": {"definir": "..."}).
  for (const [chave, valor] of Object.entries(ef)) {
    if (!chave.includes('.') || valor === undefined) continue;
    const { ent: bruto, campo } = separar(chave);
    const ent = entidadeDe(bruto, ator);
    if (!e.entidades[ent]) continue;
    const def = defCampo(ent, campo);
    if (!def || def.derivado) continue;
    if (typeof valor === 'number') {
      if (ent === 'eu' && def.sistema === 'dinheiro' && campo === 'dinheiro') movimentar(e, reg, { dinheiro: valor });
      else somar(e, reg, ent, campo, valor);
    } else if (typeof valor === 'object' && 'definir' in valor) {
      if (typeof valor.definir === 'string') definirTexto(e, reg, ent, campo, valor.definir);
      else definirNumero(e, reg, ent, campo, valor.definir);
    } else if (typeof valor === 'object' && 'copiar' in valor) {
      const v = lerCaminho(e, String(valor.copiar), ator);
      if (typeof v === 'string' && v !== '') definirTexto(e, reg, ent, campo, v);
      else if (typeof v === 'number') definirNumero(e, reg, ent, campo, v);
    }
  }

  // Um storylet que troca a ocupação ou zera a renda (a demissão, o bico) encerra a carreira escolhida na folha.
  const zerou = ef.renda !== undefined && typeof ef.renda === 'object' && ef.renda.definir === 0;
  if (ef['eu.carreira'] === undefined && (ef['eu.ocupacao'] !== undefined || ef['eu.setor'] !== undefined || zerou) && (eu.t['carreira'] ?? '') !== '') {
    definirTexto(e, reg, 'eu', 'carreira', '');
    definirNumero(e, reg, 'eu', 'nivel', 0);
  }

  if (ef.transferir) {
    const t = ef.transferir;
    const de = entidadeDe(t.de, ator);
    const para = entidadeDe(t.para, ator);
    const quem = e.entidades[de];
    if (quem && e.entidades[para]) {
      const disponivel = Math.max(0, de === 'eu' ? patrimonioDe(quem) : (quem.n['dinheiro'] ?? 0));
      let valor = t.valor ?? disponivel * (t.fracao ?? 0);
      if (t.max !== undefined) valor = Math.min(valor, t.max);
      valor = Math.round(Math.min(valor, disponivel) / 50) * 50;
      if (valor > 0) {
        if (de === 'eu') movimentar(e, reg, { dinheiro: -valor });
        else somar(e, reg, de, 'dinheiro', -valor);
        if (para === 'eu') movimentar(e, reg, { dinheiro: valor });
        else somar(e, reg, para, 'dinheiro', valor);
      }
      ctx.valores['transferido'] = valor;
    }
  }

  // Vender ou fechar vem depois dos caminhos: a empresa ainda existe para o que o bloco muda nela.
  if (ef.venderEmpresa) ctx.valores['venda'] = venderParte(e, reg, ef.venderEmpresa.fracao, ef.venderEmpresa.premio ?? 1);
  if (ef.fecharEmpresa) ctx.valores['sobra'] = fecharEmpresa(e, reg, ef.fecharEmpresa.sobra);

  for (const caminho of ef.removerMarcas ?? []) {
    const q = qualidade(caminho, ator);
    perder(e, reg, q.ent, q.nome);
  }
  for (const caminho of ef.marcas ?? []) {
    const q = qualidade(caminho, ator);
    ganhar(e, reg, q.ent, q.nome, origem);
  }
  for (const [caminho, delta] of Object.entries(ef.qualidades ?? {})) {
    const q = qualidade(caminho, ator);
    somarQualidade(e, reg, q.ent, q.nome, delta, origem);
  }
  for (const papel of ef.personagens ?? []) criarPersonagem(e, c, papel as PapelNovo, reg);
  if (ef.promover) promover(e, c, ef.promover.de, ef.promover.para, reg);
  for (const ag of ef.agendar ?? []) {
    const anos = typeof ag.em === 'number' ? ag.em : inteiro(e.rng, ag.em[0], ag.em[1]);
    e.agenda.push(ator ? { evento: ag.evento, ano: e.ano + anos, origem, ator } : { evento: ag.evento, ano: e.ano + anos, origem });
  }
  if (ef.matar) {
    const papel = entidadeDe(ef.matar, ator);
    if (papel !== 'eu') morrerPersonagem(e, papel, reg, origem);
  }
}
