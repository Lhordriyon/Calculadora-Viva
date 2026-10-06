/**
 * Validação estática do conteúdo, além do esquema Zod:
 * - caminhos válidos (entidade e campo existem; tipos batem);
 * - qualidades consultadas que algum efeito ou regra cria;
 * - todo campo escrito é lido por pelo menos dois sistemas e muda alguma decisão;
 * - toda ação mexe em pelo menos dois sistemas;
 * - variáveis e personagens dos textos; sinais de texto ruim.
 */
import { camposDe, defCampo, entidadeValida, separar, type Sistema } from './campos.ts';
import { ATRIBUTOS, PAPEIS, PAPEIS_NOVOS } from './constantes.ts';
import { tipoDe, type Conteudo, type Problema } from './conteudo.ts';
import { CHAVES_CONDICAO, type Condicoes, type Efeitos, type Storylet } from './esquema.ts';
import { lerConteudo, type FontesConteudo } from './leitura.ts';
import { ESCRITAS_DO_MOTOR, LEITURAS_DO_MOTOR } from './manifesto.ts';
import { IDADE_MAXIMA } from './regras.ts';
import { analisarModelo, comprimentoMaximo } from './texto.ts';

export const VARIAVEIS_GLOBAIS = ['nome', 'sobrenome', 'nomeCompleto', 'cidade', 'uf', 'idade', 'ano', 'dinheiro', 'patrimonio', 'salario', 'divida'] as const;

const LIMITE_TEXTO = 300;
const LIMITE_TEXTO_ESCOLHA = 60;
const LIMITE_RESUMO = 90;
const LIMITE_ROTULO = 28;

type Reporter = (onde: string, mensagem: string) => void;

export function validarConteudo(fontes: FontesConteudo): { conteudo: Conteudo | null; problemas: Problema[] } {
  const { conteudo, problemas } = lerConteudo(fontes);
  if (conteudo) verificarReferencias(conteudo, problemas);
  return { conteudo, problemas };
}

// ---------------------------------------------------------------- blocos de efeitos

interface BlocoEfeitos {
  onde: string;
  efeitos: Efeitos;
}

export function blocosDe(s: Storylet, onde: string): BlocoEfeitos[] {
  const blocos: BlocoEfeitos[] = [];
  if (s.efeitos) blocos.push({ onde, efeitos: s.efeitos });
  if (s.sucesso?.efeitos) blocos.push({ onde: `${onde} › sucesso`, efeitos: s.sucesso.efeitos });
  if (s.fracasso?.efeitos) blocos.push({ onde: `${onde} › fracasso`, efeitos: s.fracasso.efeitos });
  s.escolhas?.forEach((esc, i) => {
    const o = `${onde} › escolha ${i + 1}`;
    if (esc.efeitos) blocos.push({ onde: o, efeitos: esc.efeitos });
    for (const [nome, r] of [['sucesso', esc.sucesso], ['fracasso', esc.fracasso], ['resultado', esc.resultado]] as const) {
      if (r?.efeitos) blocos.push({ onde: `${o} › ${nome}`, efeitos: r.efeitos });
    }
  });
  return blocos;
}

/** Caminho concreto: "ator.x" vira um por papel possível; sem ponto, é de quem joga. */
function concretos(caminho: string, atores: readonly string[] | undefined): string[] {
  const { ent, campo } = separar(caminho);
  if (ent === 'ator') return (atores ?? []).map((a) => `${a}.${campo}`);
  return [`${ent}.${campo}`];
}

/** Os campos que cada efeito escreve, por sistema (para a regra das ações). */
function escritasDe(ef: Efeitos, atores: readonly string[] | undefined): { caminho: string; sistema: Sistema }[] {
  const out: { caminho: string; sistema: Sistema }[] = [];
  const sistemaDe = (caminho: string): Sistema => {
    const { ent, campo } = separar(caminho);
    return defCampo(ent, campo)?.sistema ?? 'historia';
  };
  for (const at of ATRIBUTOS) if (ef[at]) out.push({ caminho: `eu.${at}`, sistema: sistemaDe(at) });
  if (ef.patrimonioFator !== undefined) {
    out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' }, { caminho: 'eu.investido', sistema: 'dinheiro' });
  }
  if (ef.dinheiro || ef.divida || ef.dividaFator !== undefined || ef.investir) {
    if (ef.dinheiro || ef.investir) out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' });
    if (ef.investir) out.push({ caminho: 'eu.investido', sistema: 'dinheiro' });
    if (ef.divida || ef.dividaFator !== undefined) out.push({ caminho: 'eu.divida', sistema: 'dinheiro' });
  }
  if (ef.renda !== undefined) out.push({ caminho: 'eu.renda', sistema: 'dinheiro' });
  if (ef.custo !== undefined) out.push({ caminho: 'eu.custo', sistema: 'dinheiro' });
  for (const chave of Object.keys(ef)) {
    if (!chave.includes('.')) continue;
    for (const c of concretos(chave, atores)) out.push({ caminho: c, sistema: sistemaDe(c) });
  }
  for (const m of [...(ef.marcas ?? []), ...Object.keys(ef.qualidades ?? {})]) {
    for (const c of concretos(m, atores)) out.push({ caminho: c, sistema: 'historia' });
  }
  for (const m of ef.removerMarcas ?? []) for (const c of concretos(m, atores)) out.push({ caminho: c, sistema: 'historia' });
  if (ef.transferir) {
    for (const lado of [ef.transferir.de, ef.transferir.para]) {
      for (const c of concretos(`${lado}.dinheiro`, atores)) out.push({ caminho: c, sistema: 'dinheiro' });
    }
  }
  // Caminho vazio: mexe no sistema sem escrever um campo (o bicho não tem vínculo; a agenda não é campo).
  for (const p of ef.personagens ?? []) out.push({ caminho: p === 'pet' ? '' : `${p}.vinculo`, sistema: 'relacoes' });
  if (ef.matar) for (const c of concretos(`${ef.matar}.faleceu`, atores)) out.push({ caminho: c, sistema: 'relacoes' });
  if (ef.agendar?.length) out.push({ caminho: '', sistema: 'historia' });
  return out;
}

// ---------------------------------------------------------------- leitores

interface Leitor {
  sistema: string;
  decide: boolean;
  onde: string;
}

/** Caminhos que uma condição lê: chaves, qualidades e a inflação. */
function leiturasDe(cond: Condicoes | undefined): string[] {
  if (!cond) return [];
  const out: string[] = [];
  for (const [chave, v] of Object.entries(cond)) {
    if (v === undefined) continue;
    if (chave === 'marcas' || chave === 'algumaMarca' || chave === 'semMarcas') out.push(...(v as string[]));
    else if (chave === 'marcaHa') out.push(...(v as { marca: string }[]).map((x) => x.marca));
    else if (chave === 'inflacao') out.push('pais.inflacao');
    else if (chave === 'genero') out.push('eu.genero');
    else out.push(chave);
  }
  return out;
}

const PAPEL_PESSOA = new Set<string>(PAPEIS);

/** Normaliza um caminho concreto para a chave de leitura/escrita ("pessoa.x" do manifesto vira cada papel). */
function chavesDoManifesto(caminho: string): string[] {
  const { ent, campo } = separar(caminho);
  if (ent === 'pessoa') return PAPEIS.map((p) => `${p}.${campo}`);
  return [`${ent}.${campo}`];
}

export function verificarReferencias(c: Conteudo, problemas: Problema[]): void {
  const erro: Reporter = (onde, mensagem) => void problemas.push({ nivel: 'erro', onde, mensagem });
  const aviso: Reporter = (onde, mensagem) => void problemas.push({ nivel: 'aviso', onde, mensagem });
  const nomeDe = (s: Storylet): string => `${c.arquivoDe.get(s.id) ?? '?'} › ${s.id}`;

  const escritores = new Map<string, string[]>();
  const leitores = new Map<string, Leitor[]>();
  /** Lido via "ator.x": basta existir para algum dos papéis possíveis. */
  const irmaos = new Map<string, string[]>();
  const escrever = (chave: string, onde: string): void => {
    const l = escritores.get(chave);
    if (l) l.push(onde);
    else escritores.set(chave, [onde]);
  };
  const ler = (chave: string, leitor: Leitor): void => {
    const l = leitores.get(chave);
    if (l) l.push(leitor);
    else leitores.set(chave, [leitor]);
  };

  // ---- o que o motor escreve e lê
  for (const caminho of ESCRITAS_DO_MOTOR) for (const k of chavesDoManifesto(caminho)) escrever(k, 'motor');
  for (const l of LEITURAS_DO_MOTOR) for (const k of chavesDoManifesto(l.caminho)) ler(k, { sistema: 'motor', decide: l.decide, onde: `motor › ${l.regra}` });
  for (const cidade of c.mundo.cidades) for (const m of cidade.marcas) escrever(`lugar.${m}`, `mundo.json › ${cidade.nome}`);

  // ---- caminhos válidos
  const conferirCaminho = (caminho: string, onde: string, atores: readonly string[] | undefined): boolean => {
    const { ent, campo } = separar(caminho);
    if (!entidadeValida(ent) || ent === 'pessoa') {
      erro(onde, `entidade desconhecida em "${caminho}"`);
      return false;
    }
    if (ent === 'ator' && !atores) {
      erro(onde, `"${caminho}" usa ator, mas o storylet não declara ator`);
      return false;
    }
    if ((ent === 'lugar' || ent === 'pais') && !defCampo(ent, campo) && !c.mundo.cidades.some((x) => x.marcas.includes(campo))) {
      erro(onde, `"${caminho}" não é campo nem qualidade de ${ent}`);
      return false;
    }
    return true;
  };

  const conferirCondicao = (cond: Condicoes | undefined, onde: string, atores: readonly string[] | undefined, leitor: Omit<Leitor, 'onde'>): void => {
    if (!cond) return;
    for (const [chave, pedido] of Object.entries(cond)) {
      if (pedido === undefined || CHAVES_CONDICAO.has(chave)) continue;
      if (!conferirCaminho(chave, onde, atores)) continue;
      const { ent, campo } = separar(chave);
      const def = defCampo(ent === 'ator' ? 'mae' : ent, campo);
      const tipo = typeof pedido === 'boolean' ? 'bool' : typeof pedido === 'string' || Array.isArray(pedido) ? 'texto' : 'faixa';
      if (def?.tipo === 'num' && tipo === 'texto') erro(onde, `"${chave}" é número; use { min, max }`);
      if (def?.tipo === 'texto' && tipo === 'faixa') erro(onde, `"${chave}" é texto; use "valor" ou ["a", "b"]`);
      if (!def && tipo === 'texto') erro(onde, `"${chave}" é qualidade; use true/false ou { min, max }`);
    }
    for (const caminho of leiturasDe(cond)) {
      const legado = CHAVES_CONDICAO.has(caminho) || caminho === 'pais.inflacao' || caminho === 'eu.genero';
      if (!legado && !conferirCaminho(caminho, onde, atores)) continue;
      const ks = concretos(caminho, atores);
      for (const k of ks) {
        ler(k, { ...leitor, onde });
        if (caminho.startsWith('ator.')) irmaos.set(k, ks);
      }
    }
  };

  // ---- personagens que um efeito cria e as qualidades que os garantem
  const marcasDoPapel = new Map<string, Set<string>>();
  const agendados = new Set<string>();
  for (const s of c.storylets) {
    const atores = s.ator;
    for (const b of blocosDe(s, nomeDe(s))) {
      const ef = b.efeitos;
      for (const chave of Object.keys(ef)) {
        if (!chave.includes('.')) continue;
        if (!conferirCaminho(chave, b.onde, atores)) continue;
        const { ent, campo } = separar(chave);
        const def = defCampo(ent === 'ator' ? 'mae' : ent, campo);
        if (!def) erro(b.onde, `"${chave}" não é campo (qualidades vão em "marcas" ou "qualidades")`);
        else if (def.derivado) erro(b.onde, `"${chave}" é calculado; não dá para escrever`);
        const v = ef[chave];
        if (def?.tipo === 'texto' && !(typeof v === 'object' && v !== null && 'definir' in v && typeof v.definir === 'string')) {
          erro(b.onde, `"${chave}" é texto; use { "definir": "..." }`);
        }
      }
      for (const m of [...(ef.marcas ?? []), ...(ef.removerMarcas ?? []), ...Object.keys(ef.qualidades ?? {})]) {
        if (!conferirCaminho(m, b.onde, atores)) continue;
        const { ent, campo } = separar(m);
        if (defCampo(ent === 'ator' ? 'mae' : ent, campo)) erro(b.onde, `"${m}" é campo, não qualidade`);
      }
      for (const w of escritasDe(ef, atores)) {
        if (w.caminho) escrever(w.caminho, b.onde);
      }
      const criados = [...(ef.personagens ?? []), ...(ef.promover ? [ef.promover.para] : [])];
      for (const papel of criados) {
        const set = marcasDoPapel.get(papel) ?? new Set<string>();
        for (const m of ef.marcas ?? []) set.add(m);
        marcasDoPapel.set(papel, set);
      }
      for (const ag of ef.agendar ?? []) {
        agendados.add(ag.evento);
        if (!c.porId.has(ag.evento)) erro(b.onde, `agenda storylet inexistente "${ag.evento}"`);
        if (Array.isArray(ag.em) && ag.em[0] > ag.em[1]) erro(b.onde, `faixa de agendamento invertida para "${ag.evento}"`);
      }
    }
  }

  // ---- leitores do conteúdo
  for (const s of c.storylets) {
    const onde = nomeDe(s);
    const tipo = tipoDe(s);
    const atores = s.ator;
    for (const b of blocosDe(s, onde)) {
      const t = b.efeitos.transferir;
      if (t) for (const k of concretos(`${t.de}.dinheiro`, atores)) ler(k, { sistema: tipo, decide: true, onde: b.onde });
    }
    conferirCondicao(s.condicoes, onde, atores, { sistema: tipo, decide: true });
    if (s.preferir) for (const k of concretos(s.preferir.slice(1), atores)) ler(k, { sistema: tipo, decide: true, onde });
    if (s.teste?.atributo && conferirCaminho(s.teste.atributo, onde, atores)) {
      for (const k of concretos(s.teste.atributo, atores)) ler(k, { sistema: tipo, decide: true, onde });
    }
    for (const [nome, trechos] of Object.entries(s.trechos ?? {})) {
      trechos.forEach((t, i) => conferirCondicao(t.se, `${onde} › trechos.${nome}[${i}]`, atores, { sistema: 'texto', decide: false }));
      if (trechos[trechos.length - 1]!.se) erro(onde, `trechos.${nome}: o último trecho não pode ter condição (é o padrão)`);
    }
    s.escolhas?.forEach((esc, i) => {
      const o = `${onde} › escolha ${i + 1}`;
      conferirCondicao(esc.condicoes, o, atores, { sistema: 'escolha', decide: true });
      if (esc.teste?.atributo && conferirCaminho(esc.teste.atributo, o, atores)) {
        for (const k of concretos(esc.teste.atributo, atores)) ler(k, { sistema: 'escolha', decide: true, onde: o });
      }
    });
  }
  c.linhas.forEach((l, i) => conferirCondicao(l.condicoes, `linhas.json[${i}]`, undefined, { sistema: 'linha', decide: false }));
  c.mortes.forEach((m, i) => conferirCondicao(m.condicoes, `mortes.json[${i}]`, undefined, { sistema: 'morte', decide: false }));
  c.mundo.nascimento.forEach((n, i) => conferirCondicao(n.se, `mundo.json › nascimento[${i}]`, undefined, { sistema: 'texto', decide: false }));
  for (const [m, info] of Object.entries(c.marcas)) {
    if (info.porAno) ler(`eu.${m}`, { sistema: 'passivo', decide: false, onde: `marcas.json › ${m}` });
    if (info.epitafio) ler(`eu.${m}`, { sistema: 'cartao', decide: false, onde: `marcas.json › ${m}` });
  }

  // ---- textos (também contam como leitura, de sistema "texto")
  const lerTexto = (texto: string, onde: string, atores: readonly string[] | undefined): void => {
    for (const v of analisarModelo(texto).variaveis) {
      if (!v.includes('.')) continue;
      for (const k of concretos(v, atores)) ler(k, { sistema: 'texto', decide: false, onde });
    }
  };
  for (const s of c.storylets) {
    const onde = nomeDe(s);
    for (const t of textosDe(s)) lerTexto(t, onde, s.ator);
  }
  c.mundo.nascimento.forEach((n, i) => lerTexto(n.texto, `mundo.json › nascimento[${i}]`, undefined));
  for (const [g, ac] of Object.entries(c.mundo.acontecimentos)) for (const t of ac.textos) lerTexto(t, `mundo.json › acontecimentos.${g}`, PAPEIS);

  // ---- qualidades consultadas que nada cria
  for (const [chave, lista] of leitores) {
    const { ent, campo } = separar(chave);
    if (defCampo(ent, campo) || escritores.has(chave)) continue;
    if ((irmaos.get(chave) ?? []).some((k) => escritores.has(k))) continue;
    const doConteudo = lista.find((l) => l.sistema !== 'motor');
    if (doConteudo) erro(doConteudo.onde, `consulta "${chave}", que nenhum efeito ou regra cria`);
  }
  for (const m of Object.keys(c.marcas)) {
    if (!escritores.has(`eu.${m}`)) erro('marcas.json', `"${m}" tem efeito passivo ou epitáfio, mas nada cria essa qualidade`);
  }

  // ---- todo campo escrito: dois leitores de sistemas diferentes, e algum que decide
  for (const [chave, onde] of escritores) {
    const { ent, campo } = separar(chave);
    if (defCampo(ent, campo)?.derivado) continue;
    if (!PAPEL_PESSOA.has(ent) && ent !== 'eu' && ent !== 'lugar' && ent !== 'pais') continue;
    const lista = leitores.get(chave) ?? [];
    const sistemas = new Set(lista.map((l) => l.sistema));
    const local = onde.find((o) => o !== 'motor') ?? onde[0]!;
    if (lista.length < 2 || sistemas.size < 2) {
      erro(local, `"${chave}" é escrito, mas é lido por ${lista.length === 0 ? 'ninguém' : [...sistemas].join(' e ')} (precisa de 2 sistemas)`);
    } else if (!lista.some((l) => l.decide)) {
      erro(local, `"${chave}" não muda nenhuma decisão (lido só por ${[...sistemas].join(', ')})`);
    }
  }

  // ---- storylets
  for (const s of c.storylets) {
    const onde = nomeDe(s);
    const tipo = tipoDe(s);
    if (s.apenasAgendado && !agendados.has(s.id)) erro(onde, 'é apenasAgendado, mas ninguém o agenda (storylet morto)');
    if (s.idade && s.idade[1] > IDADE_MAXIMA) erro(onde, `idade máxima acima de ${IDADE_MAXIMA}`);
    if (s.escolhas && !s.escolhas.some((esc) => !esc.condicoes)) erro(onde, 'precisa de pelo menos uma escolha sem condições (senão a vida pode travar)');
    if (tipo === 'acao') {
      const sistemas = new Set(blocosDe(s, onde).flatMap((b) => escritasDe(b.efeitos, s.ator).map((w) => w.sistema)));
      if (sistemas.size < 2) erro(onde, `ação mexe em ${sistemas.size === 0 ? 'nada' : [...sistemas].join('')}; precisa de pelo menos 2 sistemas`);
      if (s.rotulo && (/[[\]]/.test(s.rotulo) || comprimentoMaximo(s.rotulo) > LIMITE_ROTULO)) {
        erro(onde, `rótulo sem alternâncias e com até ${LIMITE_ROTULO} caracteres`);
      }
    }
    if (tipo === 'npc' && !s.escolhas && !/^\{ator(\.quem)?\}/.test(s.resumo)) {
      aviso(onde, 'storylet de personagem sem escolha: o resumo começa pelo sujeito ({ator.quem} ...)');
    }
    verificarTextos(c, s, onde, marcasDoPapel, erro, aviso);
  }

  // ---- linhas, mortes, mundo, epitáfios
  const exigidas = (cond: Condicoes | undefined): Set<string> => new Set(qualidadesGarantidas(cond));
  c.linhas.forEach((l, i) => verificarModelo(l.texto, `linhas.json[${i}]`, new Set(), exigidas(l.condicoes), marcasDoPapel, erro, undefined));
  c.mortes.forEach((m, i) => {
    const onde = `mortes.json[${i}]`;
    verificarModelo(m.causa, onde, new Set(), exigidas(m.condicoes), marcasDoPapel, erro, undefined);
    if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(m.causa)) aviso(onde, 'a causa completa "morreu aos N anos, ..."; comece com minúscula');
  });
  for (const [m, info] of Object.entries(c.marcas)) {
    if (info.epitafio) verificarModelo(info.epitafio, `marcas.json › ${m}`, new Set(), new Set([m]), marcasDoPapel, erro, undefined);
  }
  c.mundo.nascimento.forEach((n, i) => verificarModelo(n.texto, `mundo.json › nascimento[${i}]`, new Set(), new Set(), marcasDoPapel, erro, undefined));
  c.mundo.epitafios.forEach((t, i) => verificarModelo(t, `mundo.json › epitafios[${i}]`, new Set(), new Set(), marcasDoPapel, erro, undefined));
  for (const [g, ac] of Object.entries(c.mundo.acontecimentos)) {
    for (const t of [...ac.textos, ac.resumo]) verificarModelo(t, `mundo.json › acontecimentos.${g}`, new Set(['como']), new Set(), marcasDoPapel, erro, PAPEIS);
  }
  for (let idade = 1; idade <= 100; idade++) {
    if (!c.linhas.some((l) => !l.condicoes && l.idade[0] <= idade && idade <= l.idade[1])) aviso('linhas.json', `nenhuma linha sem condição cobre a idade ${idade}`);
  }
}

function textosDe(s: Storylet): string[] {
  const t = [s.texto, s.resumo, ...(s.rotulo ? [s.rotulo] : [])];
  for (const r of [s.sucesso, s.fracasso]) if (r) t.push(r.texto, ...(r.resumo ? [r.resumo] : []));
  for (const trechos of Object.values(s.trechos ?? {})) for (const x of trechos) t.push(x.texto);
  for (const esc of s.escolhas ?? []) {
    t.push(esc.texto, esc.resumo, ...(esc.bloqueio ? [esc.bloqueio] : []));
    for (const r of [esc.sucesso, esc.fracasso, esc.resultado]) if (r) t.push(r.texto, ...(r.resumo ? [r.resumo] : []));
  }
  return t;
}

/** Qualidades que a condição garante que existem (as exigidas e as de marcaHa). */
function qualidadesGarantidas(cond: Condicoes | undefined): string[] {
  return [...(cond?.marcas ?? []), ...(cond?.marcaHa ?? []).map((m) => m.marca)];
}

function criadosPor(ef: Efeitos | undefined): Set<string> {
  return new Set([...(ef?.personagens ?? []), ...(ef?.promover ? [ef.promover.para] : [])]);
}

function verificarTextos(
  c: Conteudo,
  s: Storylet,
  onde: string,
  marcasDoPapel: Map<string, Set<string>>,
  erro: Reporter,
  aviso: Reporter,
): void {
  const extras = new Set([...Object.keys(s.valores ?? {}), ...Object.keys(s.trechos ?? {})]);
  if (blocosDe(s, onde).some((b) => b.efeitos.transferir)) extras.add('transferido');
  const exigidasStorylet = new Set(qualidadesGarantidas(s.condicoes));
  const usados = new Set<string>();
  const atores = s.ator;
  const ver = (texto: string, o: string, criados: Set<string> = new Set(), exigidas = exigidasStorylet): void => {
    for (const v of verificarModelo(texto, o, extras, exigidas, marcasDoPapel, erro, atores, criados)) usados.add(v);
  };
  ver(s.texto, `${onde} › texto`, criadosPor(s.efeitos));
  ver(s.resumo, `${onde} › resumo`, criadosPor(s.efeitos));
  if (s.rotulo) ver(s.rotulo, `${onde} › rotulo`);
  // O trecho só aparece quando a condição dele vale: as qualidades que ela exige também garantem personagens.
  for (const [nome, trechos] of Object.entries(s.trechos ?? {})) {
    trechos.forEach((t, i) => ver(t.texto, `${onde} › trechos.${nome}[${i}]`, new Set(), new Set([...exigidasStorylet, ...qualidadesGarantidas(t.se)])));
  }
  for (const [nome, r] of [['sucesso', s.sucesso], ['fracasso', s.fracasso]] as const) {
    if (r) ver(r.texto, `${onde} › ${nome}`, new Set([...criadosPor(s.efeitos), ...criadosPor(r.efeitos)]));
  }
  const tamanho = comprimentoMaximo(s.texto);
  if (tamanho > LIMITE_TEXTO) aviso(onde, `texto pode chegar a ${tamanho} caracteres (limite ${LIMITE_TEXTO})`);
  if (comprimentoMaximo(s.resumo) > LIMITE_RESUMO) aviso(onde, `resumo longo (${comprimentoMaximo(s.resumo)} caracteres)`);
  if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(s.resumo)) aviso(onde, 'resumo completa "aos N, ..."; comece com minúscula');

  s.escolhas?.forEach((esc, i) => {
    const o = `${onde} › escolha ${i + 1}`;
    const exigidas = new Set([...exigidasStorylet, ...qualidadesGarantidas(esc.condicoes)]);
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
      if (r.resumo) ver(r.resumo, `${o} › ${nome} › resumo`, criados, exigidas);
      else ver(esc.resumo, `${o} › resumo`, criados, exigidas);
    }
  });
  for (const v of Object.keys(s.valores ?? {})) if (!usados.has(v)) aviso(onde, `valor "${v}" definido e nunca usado no texto`);
  for (const v of Object.keys(s.trechos ?? {})) if (!usados.has(v)) erro(onde, `trecho "${v}" definido e nunca usado no texto`);
  void c;
}

/** Confere sintaxe, variáveis e personagens de um modelo; devolve as variáveis usadas. */
function verificarModelo(
  texto: string,
  onde: string,
  extras: Set<string>,
  marcasExigidas: Set<string>,
  marcasDoPapel: Map<string, Set<string>>,
  erro: Reporter,
  atores: readonly string[] | undefined,
  criadosAqui: Set<string> = new Set(),
): string[] {
  const a = analisarModelo(texto);
  for (const m of a.erros) erro(onde, m);
  const papeis = new Set<string>(PAPEIS);
  const globais = new Set<string>(VARIAVEIS_GLOBAIS);
  for (const v of a.variaveis) {
    if (v === 'ator') {
      if (!atores) erro(onde, '{ator} sem ator no storylet');
      continue;
    }
    if (v.includes('.')) {
      const { ent, campo } = separar(v);
      if (ent === 'ator' && !atores) erro(onde, `{${v}} sem ator no storylet`);
      else if (!entidadeValida(ent) || ent === 'pessoa') erro(onde, `entidade desconhecida em {${v}}`);
      else if (!camposDe(ent)[campo]) erro(onde, `{${v}}: "${campo}" não é campo (qualidades não aparecem no texto)`);
      continue;
    }
    if (!globais.has(v) && !papeis.has(v) && !extras.has(v)) erro(onde, `variável desconhecida {${v}}`);
  }
  for (const p of a.concordancias) {
    if (p === 'ator' ? !atores : !papeis.has(p)) erro(onde, `personagem desconhecido em {${p}:...}`);
  }

  // Personagem criado no meio da vida só aparece em texto que exige a qualidade que o garante.
  const novos = new Set<string>(PAPEIS_NOVOS);
  const usados = new Set([...a.variaveis.map((v) => separar(v.includes('.') ? v : `${v}.nome`).ent), ...a.concordancias]);
  if (usados.has('ator')) for (const p of atores ?? []) usados.add(p);
  for (const p of usados) {
    if (!novos.has(p) || criadosAqui.has(p) || atores?.includes(p)) continue;
    const garantidoras = marcasDoPapel.get(p) ?? new Set();
    if (![...marcasExigidas].some((m) => garantidoras.has(m))) {
      erro(onde, `usa {${p}} sem exigir uma qualidade que garanta esse personagem (${[...garantidoras].join(', ') || 'nenhuma'})`);
    }
  }
  return a.variaveis;
}

export interface Cadeia {
  de: string;
  para: string;
  /** Qualidade consultada, ou "agenda". */
  via: string;
  /** Menor distância possível em anos entre a causa e a consequência. */
  anosMin: number;
}

/** Ligações causa → consequência entre storylets diferentes (qualidades e agendamentos). */
export function listarCadeias(c: Conteudo): Cadeia[] {
  const criadores = new Map<string, Storylet[]>();
  const cadeias: Cadeia[] = [];
  for (const s of c.storylets) {
    for (const b of blocosDe(s, s.id)) {
      for (const m of [...(b.efeitos.marcas ?? []), ...Object.keys(b.efeitos.qualidades ?? {})]) {
        const l = criadores.get(m) ?? [];
        if (!l.includes(s)) l.push(s);
        criadores.set(m, l);
      }
      for (const ag of b.efeitos.agendar ?? []) {
        if (ag.evento === s.id) continue;
        cadeias.push({ de: s.id, para: ag.evento, via: 'agenda', anosMin: typeof ag.em === 'number' ? ag.em : ag.em[0] });
      }
    }
  }
  for (const destino of c.storylets) {
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
