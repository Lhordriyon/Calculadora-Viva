/**
 * A pessoa decide (missão Ω2). O que quem joga pede a alguém (dinheiro, um favor, o perdão, outra chance, que pague o
 * que deve, mais prazo) e o que oferece (a ajuda que a pessoa pode recusar) não sai de um dado: sai do estado e da
 * memória dela. Pesam o vínculo, a confiança, a mágoa, o traço, o que ela acha de você e por quê (relacoes.ts), o que
 * você já fez por ela e já pediu a ela (do livro), o dinheiro que ela tem, o aperto do momento, a distância e o pedido
 * repetido.
 *
 * Cada parcela é um motivo, com a entrada do livro que o sustenta quando há uma. A chance é a logística da soma; o
 * porquê da resposta é o motivo que mais pesou para o lado dela: vira o {porque} do texto e a primeira causa da
 * entrada (o livro fica sabendo que o empréstimo de hoje saiu do conserto do carro que você pagou aos 31).
 */
import { entidadeDe, entreVoceE, lerCaminho } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import type { Pedido, Visao } from './constantes.ts';
import type { Efeitos } from './esquema.ts';
import { fraseDaEntrada, historiaCom, ROTULO_DA_VISAO, temRelacao, visoesDe } from './relacoes.ts';
import { PERDAO_BASE } from './regras.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida } from './tipos.ts';

/** O que a decisão lê da pessoa (o validador conta como leitura que decide). */
export const CAMPOS_DA_DECISAO = ['vinculo', 'confianca', 'magoa', 'traco', 'dinheiro', 'desempregado', 'doente', 'sem_contato'] as const;

/** Uma parcela da decisão. */
export interface Motivo {
  /** Qual parcela (a frase sai de `fraseDoMotivo`, só para quem acontece). */
  tipo: TipoMotivo;
  /** Quanto somou na conta (positivo: a favor do pedido). */
  peso: number;
  /** A entrada do livro que sustenta o motivo: a lembrança, a opinião, o pedido de antes. */
  entrada?: number;
  /** A opinião, quando o motivo é ela. */
  visao?: Visao;
  /** Os anos sem contato, quando o motivo é a distância. */
  anos?: number;
}

type TipoMotivo =
  | 'gosta'
  | 'distante'
  | 'confia'
  | 'desconfia'
  | 'magoa'
  | 'traco'
  | 'visao'
  | 'deu'
  | 'pediu'
  | 'sem_dinheiro'
  | 'aperta'
  | 'sobra'
  | 'desempregado'
  | 'doente'
  | 'precisa'
  | 'longe'
  | 'repetido'
  | 'deve'
  | 'esperou'
  | 'te_deve';

export interface Decisao {
  chance: number;
  motivos: Motivo[];
}

/** Quanto cada parcela pesa em cada pedido (0: não conta). */
interface Pesos {
  base: number;
  vinculo: number;
  confianca: number;
  magoa: number;
  /** Qual lado do traço decide (mundo.json › tracos): a ajuda, o perdão ou a briga (que pesa contra ouvir). */
  traco: 'ajuda' | 'perdao' | 'briga' | null;
  deu: number;
  pediu: number;
  /** O aperto de quem decide (desemprego, doença): contra no dinheiro e no favor, a favor de aceitar a ajuda. */
  aperto: number;
  longe: number;
  repetido: number;
}

const PESOS: Record<Pedido, Pesos> = {
  dinheiro: { base: 0.2, vinculo: 0.8, confianca: 1.1, magoa: 1, traco: 'ajuda', deu: 0.9, pediu: 0.8, aperto: 1, longe: 1, repetido: 1 },
  favor: { base: 0.5, vinculo: 1, confianca: 0.5, magoa: 0.9, traco: 'ajuda', deu: 0.7, pediu: 0.3, aperto: 0.6, longe: 1, repetido: 0.8 },
  perdao: { base: 1, vinculo: 0.9, confianca: 0.4, magoa: 0.8, traco: 'perdao', deu: 0.3, pediu: 0, aperto: 0, longe: 0.6, repetido: 0.6 },
  chance: { base: 0.2, vinculo: 1.2, confianca: 0.8, magoa: 1, traco: 'perdao', deu: 0.2, pediu: 0, aperto: 0, longe: 0.5, repetido: 0.8 },
  pagar: { base: 0.8, vinculo: 0.5, confianca: 0, magoa: 0.6, traco: null, deu: 0.3, pediu: 0, aperto: 1.4, longe: 0.6, repetido: 0.6 },
  prazo: { base: 0.5, vinculo: 0.7, confianca: 1, magoa: 0.8, traco: 'perdao', deu: 0.5, pediu: 0, aperto: 0, longe: 0.6, repetido: 1 },
  aceitar: { base: 0.9, vinculo: 0.6, confianca: 0.3, magoa: 0.9, traco: null, deu: 0, pediu: 0, aperto: -0.8, longe: 0.6, repetido: 0.6 },
  ouvir: { base: 0.3, vinculo: 0.8, confianca: 0.9, magoa: 0.5, traco: 'briga', deu: 0, pediu: 0, aperto: 0, longe: 0.5, repetido: 0.8 },
};

/** O que a pessoa acha de você muda a resposta: quem acha você de palavra empresta; quem acha você sumido não faz favor. */
const VISAO_NO_PEDIDO: Partial<Record<Visao, Partial<Record<Pedido, number>>>> = {
  generoso: { dinheiro: 0.8, favor: 0.6, prazo: 0.6, aceitar: 0.3, perdao: 0.3 },
  carinhoso: { favor: 0.7, perdao: 0.6, chance: 0.7, dinheiro: 0.4, prazo: 0.4, aceitar: 0.5, ouvir: 0.5 },
  presente: { favor: 0.6, perdao: 0.4, chance: 0.5, dinheiro: 0.3, prazo: 0.3, aceitar: 0.4, ouvir: 0.4 },
  de_palavra: { dinheiro: 1, prazo: 1, favor: 0.4, chance: 0.4 },
  orgulho: { favor: 0.5, dinheiro: 0.4, perdao: 0.4, ouvir: 0.5, prazo: 0.3 },
  cuida_dos_filhos: { chance: 0.6, perdao: 0.4, favor: 0.3 },
  interesseiro: { dinheiro: -1.4, favor: -0.6, aceitar: -0.6, prazo: -0.6 },
  sem_palavra: { dinheiro: -1.4, prazo: -1.3, chance: -0.8, favor: -0.4, perdao: -0.3 },
  sumido: { favor: -0.7, dinheiro: -0.5, chance: -0.5, aceitar: -0.4, perdao: -0.3 },
  metido: { favor: -0.6, dinheiro: -0.4, aceitar: -0.8, ouvir: -0.6 },
  cabeca_quente: { ouvir: -1, perdao: -0.5, chance: -0.6 },
  perdido: { dinheiro: -1, favor: -0.3, chance: -0.4 },
  casado_com_o_trabalho: { chance: -0.6, favor: -0.3, perdao: -0.2 },
  longe_dos_filhos: { chance: -0.8, perdao: -0.5 },
};

/** A chance fica entre estes limites: ninguém é certeza, nem impossível (fora o dinheiro que a pessoa não tem, que é zero). */
const CHANCE_MINIMA = 0.03;
const CHANCE_MAXIMA = 0.97;
/** O que mexe menos do que isto na conta não vira motivo. */
const MOTIVO_MINIMO = 0.25;

function logistica(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/** O traço da pessoa na conta: o generoso empresta, o mão de vaca não; o generoso perdoa, o rígido guarda; o brigão não ouve. */
function pesoDoTraco(c: Conteudo, en: Entidade, lado: 'ajuda' | 'perdao' | 'briga'): number {
  const t = c.tracos.get(en.t['traco'] ?? '');
  if (!t) return 0;
  if (lado === 'ajuda') return 1.2 * Math.log(Math.max(0.05, t.ajuda));
  if (lado === 'perdao') return ((t.perdao ?? PERDAO_BASE) - 0.24) * 6;
  return -Math.log(Math.max(0.05, t.briga));
}

/**
 * A decisão da pessoa no papel `id` sobre o pedido. `valor` é o dinheiro em jogo, quando há (o empréstimo pedido, o
 * que ela deve): quem não tem não empresta, por mais que queira. `ajuste` é o tamanho do pedido, que o storylet diz
 * (pedir aumento é mais do que pedir folga; perdoar um caso, mais do que um aniversário esquecido). Sem relação (o
 * papel vago, o bicho), meio a meio.
 */
export function decidir(e: EstadoVida, c: Conteudo, id: string, pedido: Pedido, valor?: number, ajuste = 0): Decisao {
  const en = e.entidades[id];
  if (!temRelacao(id, en)) return { chance: 0.5, motivos: [] };
  const w = PESOS[pedido];
  const motivos: Motivo[] = [];
  let z = w.base + ajuste;
  const somar = (m: Motivo): void => {
    if (Math.abs(m.peso) >= MOTIVO_MINIMO || m.tipo === 'sem_dinheiro') motivos.push(m);
    z += m.peso;
  };
  const historia = historiaCom(e, id, en);
  const vinculo = en.n['vinculo'] ?? 50;
  const confianca = Number(lerCaminho(e, `${id}.confianca`) ?? 60);
  const magoa = en.n['magoa'] ?? 0;

  // O afeto e a distância também têm lembrança: a entrada que mais aproximou, e a falta que mais afastou.
  const pv = (w.vinculo * (vinculo - 50)) / 20;
  const porqueDoVinculo = pv >= 0 ? historia.porque.afeto : historia.porque.faltou;
  somar({ tipo: pv >= 0 ? 'gosta' : 'distante', peso: pv, ...(porqueDoVinculo !== undefined ? { entrada: porqueDoVinculo } : {}) });
  const pc = (w.confianca * (confianca - 60)) / 20;
  const porquePalavra = pc >= 0 ? historia.porque.palavraBem : historia.porque.palavraMal;
  somar({ tipo: pc >= 0 ? 'confia' : 'desconfia', peso: pc, ...(porquePalavra !== undefined ? { entrada: porquePalavra } : {}) });
  // Quem pede perdão já sabe da mágoa: pesa o que passa dela.
  const pm = -w.magoa * (pedido === 'perdao' ? Math.max(0, magoa - 15) : magoa) / 15;
  if (pm < 0) somar({ tipo: 'magoa', peso: pm, ...(historia.porque.ferida !== undefined ? { entrada: historia.porque.ferida } : {}) });
  if (w.traco) somar({ tipo: 'traco', peso: pesoDoTraco(c, en, w.traco) });

  // O favor fica lembrado: o que você deu pesa a favor; o que você já pediu, contra. A opinião que nasceu disso
  // (generosa, interesseira) é a mesma lembrança: conta uma vez só, pelo que pesa mais, com a entrada que a fez.
  const opiniao = visoesDe(e, id, en)[0];
  const pVisao = opiniao ? (VISAO_NO_PEDIDO[opiniao.visao]?.[pedido] ?? 0) : 0;
  let deu = Math.min(1.2, 0.6 * historia.soma.deu) * w.deu;
  let pediu = -Math.min(1.5, 0.6 * historia.soma.pediu) * w.pediu;
  if (opiniao?.visao === 'generoso' && pVisao > 0) deu = Math.max(deu, pVisao);
  else if (opiniao?.visao === 'interesseiro' && pVisao < 0) pediu = Math.min(pediu, pVisao);
  else if (opiniao && pVisao !== 0) somar({ tipo: 'visao', peso: pVisao, visao: opiniao.visao, ...(opiniao.entrada !== undefined ? { entrada: opiniao.entrada } : {}) });
  if (deu > 0) somar({ tipo: 'deu', peso: deu, ...(historia.porque.deu !== undefined ? { entrada: historia.porque.deu } : {}) });
  if (pediu < 0) somar({ tipo: 'pediu', peso: pediu, ...(historia.porque.pediu !== undefined ? { entrada: historia.porque.pediu } : {}) });

  // O que corre entre vocês (as promissórias): quem você ainda não pagou não empresta de novo, e espera menos; quem te
  // deve faz o favor mais fácil. O que ela deve é o dinheiro em jogo quando você cobra.
  const entre = entreVoceE(e, id);
  const daDivida = entre.origem !== undefined ? { entrada: entre.origem } : {};
  if (entre.voceDeve > 0) {
    if (pedido === 'dinheiro') somar({ tipo: 'deve', peso: entre.atraso > 0 ? -2.6 : -1.6, ...daDivida });
    else if (pedido === 'favor') somar({ tipo: 'deve', peso: -0.4, ...daDivida });
    else if (pedido === 'prazo' && entre.atraso > 0) somar({ tipo: 'esperou', peso: -0.6 * entre.atraso, anos: entre.atraso, ...daDivida });
  }
  if (entre.teDeve > 0 && pedido === 'favor') somar({ tipo: 'te_deve', peso: 0.4, ...daDivida });
  if (pedido === 'pagar' && valor === undefined && entre.teDeve > 0) valor = entre.teDeve;
  // Quem não tem não dá: o dinheiro que falta fecha a porta, por mais que a pessoa queira.
  let semDinheiro = false;
  if (valor !== undefined && valor > 0 && (pedido === 'dinheiro' || pedido === 'pagar')) {
    const folga = Math.max(0, en.n['dinheiro'] ?? 0) / valor;
    semDinheiro = folga < 1;
    if (semDinheiro) somar({ tipo: 'sem_dinheiro', peso: -6 });
    else if (folga < 3) somar({ tipo: 'aperta', peso: -0.8 });
    else if (folga >= 10 && pedido === 'dinheiro') somar({ tipo: 'sobra', peso: 0.4 });
  }
  if (w.aperto !== 0) {
    const tipo = en.q['desempregado'] ? 'desempregado' : en.q['doente'] ? 'doente' : null;
    if (tipo) somar({ tipo: w.aperto < 0 ? 'precisa' : tipo, peso: -w.aperto });
  }
  const anos = en.n['sem_contato'] ?? 0;
  if (anos >= 3 && w.longe > 0) somar({ tipo: 'longe', peso: -w.longe * Math.min(1.5, 0.3 * (anos - 2)), anos });
  return { chance: semDinheiro ? 0 : Math.min(CHANCE_MAXIMA, Math.max(CHANCE_MINIMA, logistica(z))), motivos };
}

/**
 * O mesmo pedido, à mesma pessoa, nos últimos dois anos: a insistência pesa contra. Conta à parte porque depende do
 * storylet (a instância), não da pessoa.
 */
export function comRepeticao(d: Decisao, pedido: Pedido, vezes: number, entrada: number | undefined): Decisao {
  if (vezes <= 0 || d.chance <= 0) return d;
  const peso = -0.8 * vezes * PESOS[pedido].repetido;
  if (peso === 0) return d;
  const z = Math.log(d.chance / (1 - d.chance)) + peso;
  return {
    chance: Math.min(CHANCE_MAXIMA, Math.max(CHANCE_MINIMA, logistica(z))),
    motivos: [...d.motivos, { tipo: 'repetido', peso, ...(entrada !== undefined ? { entrada } : {}) }],
  };
}

/** O dinheiro que o desfecho bom tira da pessoa e dá a quem joga (o empréstimo, o Pix): o que ela precisa ter. */
export function valorDoPedido(ef: Efeitos | undefined, e: EstadoVida, ator: string): number | undefined {
  const t = ef?.transferir;
  if (!t || entidadeDe(t.de, ator) !== ator || entidadeDe(t.para, ator) !== 'eu') return undefined;
  if (t.valor !== undefined) return t.valor;
  const tem = Math.max(0, e.entidades[ator]?.n['dinheiro'] ?? 0);
  return Math.min(tem * (t.fracao ?? 0), t.max ?? Infinity);
}

/**
 * Quanto uma lembrança de verdade vale a mais na hora de dizer o porquê: entre motivos quase do mesmo tamanho, a pessoa
 * fala do que aconteceu ("lembra de quando você…"), não de um estado ("gosta de você").
 */
const PESO_DA_LEMBRANCA_NO_PORQUE = 0.35;

/** O motivo que mais pesou para o lado da resposta (o maior a favor no sim, o maior contra no não), com a lembrança na frente. */
export function motivoDaResposta(d: Decisao, sim: boolean): Motivo | undefined {
  let melhor: Motivo | undefined;
  let nota = -Infinity;
  for (const m of d.motivos) {
    if (sim ? m.peso <= 0 : m.peso >= 0) continue;
    const n = Math.abs(m.peso) + (m.entrada !== undefined ? PESO_DA_LEMBRANCA_NO_PORQUE : 0);
    if (n > nota) {
      melhor = m;
      nota = n;
    }
  }
  return melhor;
}

/** Sem motivo que se destaque, a resposta vem com o jeito de cada pedido. */
const SEM_MOTIVO: Record<Pedido, { sim: string; nao: string }> = {
  dinheiro: { sim: 'sem fazer muitas perguntas', nao: 'porque o mês também está apertado do lado de lá' },
  favor: { sim: 'sem pensar duas vezes', nao: 'porque não ia dar mesmo' },
  perdao: { sim: 'porque já estava na hora', nao: 'porque ainda não está {pronto}' },
  chance: { sim: 'porque também queria tentar', nao: 'porque já tinha decidido' },
  pagar: { sim: 'como tinha prometido', nao: 'porque não tem como agora' },
  prazo: { sim: 'porque entende o aperto', nao: 'porque já esperou demais' },
  aceitar: { sim: 'depois de muita insistência', nao: 'por orgulho' },
  ouvir: { sim: 'porque no fundo já sabia', nao: 'porque ninguém gosta de ouvir isso' },
};

/**
 * O porquê da resposta, do ponto de vista da pessoa, pronto para o texto ("…, porque lembra de quando você pagou o
 * conserto do carro dela, aos 31"), e a entrada que ele aponta.
 */
export function porqueDaResposta(e: EstadoVida, c: Conteudo, id: string, pedido: Pedido, d: Decisao, sim: boolean): { texto: string; entrada?: number } {
  const en = e.entidades[id];
  const f = en?.genero === 'f';
  const o = (m: string): string => (f ? `${m.slice(0, -1)}a` : m);
  const m = motivoDaResposta(d, sim);
  if (!en || !m) return { texto: SEM_MOTIVO[pedido][sim ? 'sim' : 'nao'].replace('{pronto}', o('pronto')) };
  const lembra = m.entrada !== undefined ? fraseDaEntrada(e, id, en, m.entrada) : '';
  const eu = e.entidades['eu']!;
  const g = eu.genero === 'f' ? 'f' : 'm';
  let texto: string;
  switch (m.tipo) {
    case 'gosta':
      texto = lembra ? `porque lembra de quando ${lembra}` : 'porque gosta muito de você';
      break;
    case 'distante':
      texto = lembra ? `porque não esqueceu de quando ${lembra}` : 'porque vocês andam distantes';
      break;
    case 'confia':
      texto = lembra ? `porque confia em você desde que ${lembra}` : 'porque confia em você';
      break;
    case 'desconfia':
      texto = lembra ? `porque não esqueceu de quando ${lembra}` : 'porque não confia mais em você';
      break;
    case 'magoa':
      texto = lembra ? `porque ainda lembra de quando ${lembra}` : `porque ainda está ${o('magoado')} com você`;
      break;
    case 'traco': {
      const t = c.tracos.get(en.t['traco'] ?? '');
      texto = t ? `porque é ${f ? t.nome.f : t.nome.m}` : SEM_MOTIVO[pedido][sim ? 'sim' : 'nao'];
      break;
    }
    case 'visao':
      texto = `porque acha você ${ROTULO_DA_VISAO[m.visao!][g]}${lembra ? ` desde que ${lembra}` : ''}`;
      break;
    case 'deu':
      texto = lembra ? `porque lembra de quando ${lembra}` : 'porque você ajudou quando precisou';
      break;
    case 'pediu':
      texto = lembra ? `porque não esqueceu de quando ${lembra}` : 'porque você já pediu outras vezes';
      break;
    case 'sem_dinheiro':
      texto = pedido === 'pagar' ? 'porque não tem como pagar agora' : 'porque não tem esse dinheiro';
      break;
    case 'aperta':
      texto = 'porque ia apertar as contas do lado de lá';
      break;
    case 'sobra':
      texto = 'porque não vai fazer falta';
      break;
    case 'desempregado':
      texto = `porque está ${o('desempregado')}`;
      break;
    case 'doente':
      texto = 'porque está doente';
      break;
    case 'precisa':
      texto = 'porque está precisando';
      break;
    case 'longe':
      texto = `porque faz ${m.anos} anos que vocês não se falam`;
      break;
    case 'repetido':
      texto = 'porque você pediu a mesma coisa faz pouco tempo';
      break;
    case 'deve':
      texto = `porque você ainda deve ${formatarDinheiro(entreVoceE(e, id).voceDeve)} a ${f ? 'ela' : 'ele'}`;
      break;
    case 'esperou':
      texto = m.anos === 1 ? 'porque já esperou um ano' : `porque já esperou ${m.anos} anos`;
      break;
    case 'te_deve':
      texto = 'porque ainda está te devendo';
      break;
  }
  return { texto, ...(m.entrada !== undefined ? { entrada: m.entrada } : {}) };
}
