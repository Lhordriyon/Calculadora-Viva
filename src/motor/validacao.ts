/**
 * Validação estática do conteúdo, além do esquema Zod: referências cruzadas
 * (marcas, agendamentos, variáveis, personagens) e sinais de texto ruim.
 */
import type { Condicoes, Efeitos, Evento } from './esquema.ts';
import { PAPEIS, PAPEIS_NOVOS } from './constantes.ts';
import type { Conteudo, Problema } from './conteudo.ts';
import { lerConteudo, type FontesConteudo } from './leitura.ts';
import { IDADE_MAXIMA } from './regras.ts';
import { analisarModelo, comprimentoMaximo } from './texto.ts';

export const VARIAVEIS_GLOBAIS = [
  'nome',
  'sobrenome',
  'nomeCompleto',
  'cidade',
  'uf',
  'idade',
  'ano',
  'profissao_mae',
  'profissao_pai',
  'dinheiro',
  'patrimonio',
  'salario',
  'divida',
] as const;

const LIMITE_TEXTO_EVENTO = 300;
const LIMITE_TEXTO_ESCOLHA = 60;
const LIMITE_RESUMO = 90;

export function validarConteudo(fontes: FontesConteudo): { conteudo: Conteudo | null; problemas: Problema[] } {
  const { conteudo, problemas } = lerConteudo(fontes);
  if (conteudo) verificarReferencias(conteudo, problemas);
  return { conteudo, problemas };
}

function marcasConsultadas(cond: Condicoes | undefined): string[] {
  if (!cond) return [];
  return [
    ...(cond.marcas ?? []),
    ...(cond.algumaMarca ?? []),
    ...(cond.semMarcas ?? []),
    ...(cond.marcaHa ?? []).map((m) => m.marca),
  ];
}

interface BlocoEfeitos {
  onde: string;
  efeitos: Efeitos;
}

function blocosDe(ev: Evento, onde: string): BlocoEfeitos[] {
  const blocos: BlocoEfeitos[] = [];
  if (ev.efeitos) blocos.push({ onde, efeitos: ev.efeitos });
  ev.escolhas?.forEach((esc, i) => {
    const o = `${onde} › escolha ${i + 1}`;
    if (esc.efeitos) blocos.push({ onde: o, efeitos: esc.efeitos });
    for (const [nome, r] of [['sucesso', esc.sucesso], ['fracasso', esc.fracasso], ['resultado', esc.resultado]] as const) {
      if (r?.efeitos) blocos.push({ onde: `${o} › ${nome}`, efeitos: r.efeitos });
    }
  });
  return blocos;
}

export function verificarReferencias(c: Conteudo, problemas: Problema[]): void {
  const erro = (onde: string, mensagem: string): void => void problemas.push({ nivel: 'erro', onde, mensagem });
  const aviso = (onde: string, mensagem: string): void => void problemas.push({ nivel: 'aviso', onde, mensagem });
  const nomeEv = (ev: Evento): string => `${c.arquivoDe.get(ev.id) ?? '?'} › ${ev.id}`;

  // ---- marcas criadas, consultadas e personagens criados
  const criadas = new Map<string, string[]>();
  const criar = (m: string, onde: string): void => {
    const l = criadas.get(m);
    if (l) l.push(onde);
    else criadas.set(m, [onde]);
  };
  for (const cidade of c.mundo.cidades) for (const m of cidade.marcas) criar(m, `mundo.json › ${cidade.nome}`);
  for (const fam of c.mundo.familias) criar(fam.marca, 'mundo.json › familias');

  /** Marcas gravadas no mesmo bloco que cria cada personagem novo. */
  const marcasDoPapel = new Map<string, Set<string>>();
  const agendados = new Set<string>();
  for (const ev of c.eventos) {
    for (const b of blocosDe(ev, nomeEv(ev))) {
      for (const m of b.efeitos.marcas ?? []) criar(m, b.onde);
      const papeisCriados = [...(b.efeitos.personagens ?? []), ...(b.efeitos.promover ? [b.efeitos.promover.para] : [])];
      for (const papel of papeisCriados) {
        const s = marcasDoPapel.get(papel) ?? new Set<string>();
        for (const m of b.efeitos.marcas ?? []) s.add(m);
        marcasDoPapel.set(papel, s);
      }
      for (const ag of b.efeitos.agendar ?? []) {
        agendados.add(ag.evento);
        if (!c.porId.has(ag.evento)) erro(b.onde, `agenda evento inexistente "${ag.evento}"`);
        if (Array.isArray(ag.em) && ag.em[0] > ag.em[1]) erro(b.onde, `faixa de agendamento invertida para "${ag.evento}"`);
      }
    }
  }

  const consultadas = new Map<string, string[]>();
  const consultar = (cond: Condicoes | undefined, onde: string): void => {
    for (const m of marcasConsultadas(cond)) {
      const l = consultadas.get(m);
      if (l) l.push(onde);
      else consultadas.set(m, [onde]);
    }
  };
  for (const ev of c.eventos) {
    consultar(ev.condicoes, nomeEv(ev));
    ev.escolhas?.forEach((esc, i) => consultar(esc.condicoes, `${nomeEv(ev)} › escolha ${i + 1}`));
  }
  c.linhas.forEach((l, i) => consultar(l.condicoes, `linhas.json[${i}]`));
  c.mortes.forEach((m, i) => consultar(m.condicoes, `mortes.json[${i}]`));

  for (const [m, onde] of consultadas) {
    if (!criadas.has(m)) erro(onde[0]!, `consulta a marca "${m}", que nenhum efeito cria`);
  }
  for (const m of Object.keys(c.marcas)) {
    if (!criadas.has(m)) erro('marcas.json', `"${m}" tem efeito passivo, mas nenhum efeito cria essa marca`);
  }
  for (const [m, onde] of criadas) {
    if (!consultadas.has(m) && !c.marcas[m]) aviso(onde[0]!, `marca "${m}" é criada mas nada a consulta`);
  }
  for (const ev of c.eventos) {
    for (const b of blocosDe(ev, nomeEv(ev))) {
      for (const m of b.efeitos.removerMarcas ?? []) {
        if (!criadas.has(m)) erro(b.onde, `remove a marca "${m}", que nenhum efeito cria`);
      }
    }
  }

  // ---- eventos
  for (const ev of c.eventos) {
    const onde = nomeEv(ev);
    if (ev.apenasAgendado && !agendados.has(ev.id)) erro(onde, 'é apenasAgendado, mas ninguém o agenda (evento morto)');
    if (ev.idade && ev.idade[1] > IDADE_MAXIMA) erro(onde, `idade máxima acima de ${IDADE_MAXIMA}`);
    if (ev.escolhas && !ev.escolhas.some((esc) => !esc.condicoes)) {
      erro(onde, 'precisa de pelo menos uma escolha sem condições (senão a vida pode travar)');
    }
    verificarTextosDoEvento(ev, onde, marcasDoPapel, erro, aviso);
  }

  // ---- linhas, mortes, mundo, epitáfios
  const marcasExigidas = (cond: Condicoes | undefined): Set<string> => new Set(marcasGarantidas(cond));
  c.linhas.forEach((l, i) => {
    verificarModelo(l.texto, `linhas.json[${i}]`, new Set(), marcasExigidas(l.condicoes), marcasDoPapel, erro);
  });
  c.mortes.forEach((m, i) => {
    const onde = `mortes.json[${i}]`;
    verificarModelo(m.causa, onde, new Set(), marcasExigidas(m.condicoes), marcasDoPapel, erro);
    if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(m.causa)) aviso(onde, 'a causa completa "morreu aos N anos, ..."; comece com minúscula');
  });
  for (const [m, info] of Object.entries(c.marcas)) {
    if (info.epitafio) verificarModelo(info.epitafio, `marcas.json › ${m}`, new Set(), new Set([m]), marcasDoPapel, erro);
  }
  c.mundo.nascimento.forEach((t, i) => verificarModelo(t, `mundo.json › nascimento[${i}]`, new Set(), new Set(), marcasDoPapel, erro));
  c.mundo.epitafios.forEach((t, i) => verificarModelo(t, `mundo.json › epitafios[${i}]`, new Set(), new Set(), marcasDoPapel, erro));

  for (let idade = 1; idade <= 100; idade++) {
    if (!c.linhas.some((l) => !l.condicoes && l.idade[0] <= idade && idade <= l.idade[1])) {
      aviso('linhas.json', `nenhuma linha sem condição cobre a idade ${idade}`);
    }
  }
}

type Reporter = (onde: string, mensagem: string) => void;

function verificarTextosDoEvento(
  ev: Evento,
  onde: string,
  marcasDoPapel: Map<string, Set<string>>,
  erro: Reporter,
  aviso: Reporter,
): void {
  const valores = new Set(Object.keys(ev.valores ?? {}));
  const exigidasEvento = new Set(marcasGarantidas(ev.condicoes));
  const usados = new Set<string>();
  const ver = (texto: string, o: string, criados: Set<string> = new Set(), exigidas = exigidasEvento): void => {
    for (const v of verificarModelo(texto, o, valores, exigidas, marcasDoPapel, erro, criados)) usados.add(v);
  };

  ver(ev.texto, `${onde} › texto`);
  ver(ev.resumo, `${onde} › resumo`, criadosPor(ev.efeitos));
  const tamanho = comprimentoMaximo(ev.texto);
  if (tamanho > LIMITE_TEXTO_EVENTO) aviso(onde, `texto pode chegar a ${tamanho} caracteres (limite ${LIMITE_TEXTO_EVENTO})`);
  if (comprimentoMaximo(ev.resumo) > LIMITE_RESUMO) aviso(onde, `resumo longo (${comprimentoMaximo(ev.resumo)} caracteres)`);
  if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(ev.resumo)) aviso(onde, 'resumo completa "aos N, ..."; comece com minúscula');

  ev.escolhas?.forEach((esc, i) => {
    const o = `${onde} › escolha ${i + 1}`;
    const exigidas = new Set([...exigidasEvento, ...marcasGarantidas(esc.condicoes)]);
    ver(esc.texto, `${o} › texto`, new Set(), exigidas);
    if (esc.bloqueio) ver(esc.bloqueio, `${o} › bloqueio`, new Set(), exigidas);
    if (comprimentoMaximo(esc.texto) > LIMITE_TEXTO_ESCOLHA) aviso(o, `texto do botão longo (${comprimentoMaximo(esc.texto)} caracteres)`);
    if (comprimentoMaximo(esc.resumo) > LIMITE_RESUMO) aviso(o, `resumo longo (${comprimentoMaximo(esc.resumo)} caracteres)`);
    if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(esc.resumo)) aviso(o, 'resumo completa "aos N você ..."; comece com minúscula');
    const daEscolha = criadosPor(esc.efeitos);
    for (const [nome, r] of [['sucesso', esc.sucesso], ['fracasso', esc.fracasso], ['resultado', esc.resultado]] as const) {
      if (!r) continue;
      const criados = new Set([...daEscolha, ...criadosPor(r.efeitos)]);
      ver(r.texto, `${o} › ${nome}`, criados, exigidas);
      // o resumo é renderizado depois dos efeitos do desfecho
      if (r.resumo) ver(r.resumo, `${o} › ${nome} › resumo`, criados, exigidas);
      else ver(esc.resumo, `${o} › resumo`, criados, exigidas);
    }
  });
  for (const v of valores) if (!usados.has(v)) aviso(onde, `valor "${v}" definido e nunca usado no texto`);
}

/** Marcas que a condição garante que existem (todas as exigidas e as de marcaHa). */
function marcasGarantidas(cond: Condicoes | undefined): string[] {
  return [...(cond?.marcas ?? []), ...(cond?.marcaHa ?? []).map((m) => m.marca)];
}

function criadosPor(ef: Efeitos | undefined): Set<string> {
  return new Set([...(ef?.personagens ?? []), ...(ef?.promover ? [ef.promover.para] : [])]);
}

/** Confere sintaxe, variáveis e personagens de um modelo; devolve as variáveis usadas. */
function verificarModelo(
  texto: string,
  onde: string,
  valores: Set<string>,
  marcasExigidas: Set<string>,
  marcasDoPapel: Map<string, Set<string>>,
  erro: Reporter,
  criadosAqui: Set<string> = new Set(),
): string[] {
  const a = analisarModelo(texto);
  for (const m of a.erros) erro(onde, m);
  const papeis = new Set<string>(PAPEIS);
  const globais = new Set<string>(VARIAVEIS_GLOBAIS);
  for (const v of a.variaveis) {
    if (!globais.has(v) && !papeis.has(v) && !valores.has(v)) erro(onde, `variável desconhecida {${v}}`);
  }
  for (const p of a.concordancias) if (!papeis.has(p)) erro(onde, `personagem desconhecido em {${p}:...}`);

  const novos = new Set<string>(PAPEIS_NOVOS);
  for (const p of new Set([...a.variaveis, ...a.concordancias])) {
    if (!novos.has(p) || criadosAqui.has(p)) continue;
    const garantidoras = marcasDoPapel.get(p) ?? new Set();
    if (![...marcasExigidas].some((m) => garantidoras.has(m))) {
      erro(onde, `usa {${p}} sem exigir uma marca que garanta esse personagem (${[...garantidoras].join(', ') || 'nenhuma'})`);
    }
  }
  return a.variaveis;
}

export interface Cadeia {
  de: string;
  para: string;
  /** Marca consultada, ou "agenda". */
  via: string;
  /** Menor distância possível em anos entre a causa e a consequência. */
  anosMin: number;
}

/** Ligações causa → consequência entre eventos diferentes (marcas e agendamentos). */
export function listarCadeias(c: Conteudo): Cadeia[] {
  const criadores = new Map<string, Evento[]>();
  const cadeias: Cadeia[] = [];
  for (const ev of c.eventos) {
    for (const b of blocosDe(ev, ev.id)) {
      for (const m of b.efeitos.marcas ?? []) {
        const l = criadores.get(m) ?? [];
        if (!l.includes(ev)) l.push(ev);
        criadores.set(m, l);
      }
      for (const ag of b.efeitos.agendar ?? []) {
        if (ag.evento === ev.id) continue;
        cadeias.push({ de: ev.id, para: ag.evento, via: 'agenda', anosMin: typeof ag.em === 'number' ? ag.em : ag.em[0] });
      }
    }
  }
  for (const destino of c.eventos) {
    const cond = destino.condicoes;
    const consultadas = new Set([...(cond?.marcas ?? []), ...(cond?.algumaMarca ?? []), ...(cond?.marcaHa ?? []).map((x) => x.marca)]);
    for (const m of consultadas) {
      for (const origem of criadores.get(m) ?? []) {
        if (origem.id === destino.id) continue;
        const ha = cond?.marcaHa?.find((x) => x.marca === m)?.min ?? 0;
        const porIdade = origem.idade && destino.idade ? destino.idade[0] - origem.idade[1] : 0;
        cadeias.push({ de: origem.id, para: destino.id, via: m, anosMin: Math.max(ha, porIdade, 0) });
      }
    }
  }
  return cadeias;
}
