/**
 * O trabalho de quem joga reage ao mundo. Todo ano, quem trabalha (18 a 64,
 * com renda, sem aposentadoria) vê o salário andar com o setor e com a fase
 * do ciclo. Quem é empregado pode ser demitido (mais na recessão e na crise,
 * conforme o setor sente o ciclo): a demissão chega como storylet agendado
 * cuja causa é a fase do país. Negócio próprio balança mais com o ciclo e,
 * nos anos ruins, pode entrar no aperto. Serviço público é estável.
 *
 * O padrão de vida também cobra: quem subiu de padrão e passou a gastar mais
 * do que ganha recebe a conta quando a reserva não cobre mais uns poucos anos
 * de déficit (storylet agendado cuja causa é a escolha que subiu o padrão).
 */
import type { Conteudo } from './conteudo.ts';
import type { DefFase } from './esquema.ts';
import { faseDe } from './ciclo.ts';
import { patrimonioDe } from './campos.ts';
import { somar } from './livro.ts';
import { ANOS_DE_RESERVA, CHANCE_APERTO_NEGOCIO, DEMISSAO_JOGADOR, IDADE_APOSENTADORIA, VARIACAO_NEGOCIO } from './regras.ts';
import { aleatorio, normal } from './rng.ts';
import type { EstadoVida, Mudanca } from './tipos.ts';

/** A entrada que trouxe a fase atual do país (para ser causa do que ela provoca); null no normal. */
export function causaDaFase(e: EstadoVida): number | null {
  const fase = faseDe(e);
  return fase === 'normal' ? null : (e.entidades['pais']?.q[fase]?.causa ?? null);
}

function agendarJa(e: EstadoVida, c: Conteudo, evento: string, origem: number | null): void {
  if (!c.porId.has(evento) || e.agenda.some((a) => a.evento === evento)) return;
  e.agenda.push({ evento, ano: e.ano, origem });
}

export function regraDoTrabalho(e: EstadoVida, c: Conteudo, fase: DefFase, reg: Mudanca[]): void {
  const eu = e.entidades['eu']!;
  const renda = eu.n['renda'] ?? 0;
  if (e.idade < 18 || e.idade >= IDADE_APOSENTADORIA || renda <= 0 || eu.q['aposentado']) return;
  const setor = c.setores.get(eu.t['setor'] ?? '');
  const sente = setor?.ciclo ?? 1;
  const crescimento = setor?.crescimento ?? 0.004;
  const dono = Boolean(eu.q['empreendedor'] || eu.q['socio'] || eu.q['herdeiro_negocio']);
  const estavel = Boolean(eu.q['servidor'] || setor?.estavel);

  // O salário do ano (ou o faturamento, que balança o dobro e tem sorte e azar).
  let variacao = estavel ? crescimento : crescimento + fase.salario * sente;
  if (dono) variacao = crescimento + fase.salario * sente * 2 + normal(e.rng, 0, VARIACAO_NEGOCIO);
  somar(e, reg, 'eu', 'renda', renda * Math.max(-0.25, variacao), 'carreira');
  if (estavel) return;

  const piora = Math.max(0, fase.desemprego - 1) * sente;
  if (dono) {
    if (piora > 0 && aleatorio(e.rng) < CHANCE_APERTO_NEGOCIO * piora) agendarJa(e, c, 'negocio_no_aperto', causaDaFase(e));
    return;
  }
  const lugar = (e.entidades['lugar']?.n['desemprego'] ?? 0.08) / 0.08;
  const chance = DEMISSAO_JOGADOR * lugar * (1 + (fase.desemprego - 1) * sente);
  if (aleatorio(e.rng) < chance) agendarJa(e, c, 'demissao', causaDaFase(e));
}

/** O padrão de vida comendo a reserva: déficit no ano e reserva para menos de ANOS_DE_RESERVA anos. */
export function regraDoPadrao(e: EstadoVida, c: Conteudo, deficit: number): void {
  const padrao = e.entidades['eu']!.q['padrao_alto'];
  if (!padrao || deficit <= 0) return;
  if (patrimonioDe(e.entidades['eu']!) < deficit * ANOS_DE_RESERVA) agendarJa(e, c, 'padrao_aperta', padrao.causa);
}
