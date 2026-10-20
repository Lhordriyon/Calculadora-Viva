/**
 * Validação estática do conteúdo, além do esquema Zod:
 * - caminhos válidos (entidade e campo existem; tipos batem);
 * - qualidades consultadas que algum efeito ou regra cria;
 * - todo campo escrito é lido por pelo menos dois sistemas e muda alguma decisão;
 * - toda ação mexe em pelo menos dois sistemas;
 * - variáveis e personagens dos textos; sinais de texto ruim.
 */
import { camposDe, defCampo, entidadeValida, separar, type Sistema } from './campos.ts';
import { ATIVOS, ATRIBUTOS, CACULA, PADROES, PAPEIS, PAPEIS_NOVOS, PARCEIROS, PERFIS, TIPOS_FAMILIA } from './constantes.ts';
import { REGIOES_DO_BRASIL } from './origem.ts';
import { tipoDe, type Conteudo, type Problema } from './conteudo.ts';
import { CHAVES_CONDICAO, type Condicoes, type Efeitos, type Storylet } from './esquema.ts';
import { lerConteudo, type FontesConteudo } from './leitura.ts';
import { AGENDADOS_PELO_MOTOR, ESCRITAS_DO_MOTOR, LEITURAS_DO_MOTOR, VOTOS } from './manifesto.ts';
import { DESTINOS } from './herdeiro.ts';
import { verificarPortugues } from './portugues.ts';
import { IDADE_MAXIMA } from './regras.ts';
import { analisarModelo, comprimentoMaximo } from './texto.ts';

export const VARIAVEIS_GLOBAIS = ['nome', 'sobrenome', 'nomeCompleto', 'cidade', 'uf', 'idade', 'ano', 'dinheiro', 'patrimonio', 'salario', 'divida'] as const;

const LIMITE_TEXTO = 300;
const LIMITE_TEXTO_ESCOLHA = 60;
const LIMITE_RESUMO = 90;
const LIMITE_ROTULO = 28;
/** "Partido Fulano": nome próprio de partido (qualquer um pode existir de verdade). */
const RE_PARTIDO_COM_NOME = /\b[Pp]artido (d[aeo]s? )?[A-ZÁÉÍÓÚÂÊÔÃÕ]/;

type Reporter = (onde: string, mensagem: string) => void;

export function validarConteudo(fontes: FontesConteudo): { conteudo: Conteudo | null; problemas: Problema[] } {
  const { conteudo, problemas } = lerConteudo(fontes);
  if (conteudo) {
    verificarReferencias(conteudo, problemas);
    verificarPortugues(conteudo, problemas);
    verificarCoerencia(conteudo, problemas);
  }
  verificarPolitica(fontes, problemas);
  return { conteudo, problemas };
}

/** Política é fictícia e genérica: partido com nome próprio pode coincidir com um real. Vale para todo texto. */
function verificarPolitica(fontes: FontesConteudo, problemas: Problema[]): void {
  const visitar = (v: unknown, onde: string): void => {
    if (typeof v === 'string') {
      if (RE_PARTIDO_COM_NOME.test(v)) problemas.push({ nivel: 'erro', onde, mensagem: 'partido com nome próprio; use algo genérico ("o partido do tio")' });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => visitar(x, `${onde}[${i}]`));
    } else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) visitar(x, `${onde}.${k}`);
    }
  };
  for (const { arquivo, dados } of fontes.storylets) visitar(dados, arquivo);
  visitar(fontes.linhas, 'linhas.json');
  visitar(fontes.mortes, 'mortes.json');
  visitar(fontes.marcas, 'marcas.json');
  visitar(fontes.mundo, 'mundo.json');
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
    out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' }, ...ATIVOS.map((a) => ({ caminho: `eu.${a}`, sistema: 'dinheiro' as Sistema })));
  }
  if (ef.realocar) {
    for (const lado of [ef.realocar.de, ef.realocar.para]) out.push({ caminho: `eu.${lado}`, sistema: 'dinheiro' });
  }
  if (ef.dinheiro || ef.divida || ef.dividaFator !== undefined || ef.investir) {
    if (ef.dinheiro || ef.investir) out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' });
    if (ef.investir) out.push(...ATIVOS.map((a) => ({ caminho: `eu.${a}`, sistema: 'dinheiro' as Sistema })));
    if (ef.divida || ef.dividaFator !== undefined) out.push({ caminho: 'eu.divida', sistema: 'dinheiro' });
  }
  // O acordo troca as dívidas por uma só e limpa o nome se nada mais atrasar.
  if (ef.renegociar) out.push({ caminho: 'eu.divida', sistema: 'dinheiro' }, { caminho: 'eu.nome_sujo', sistema: 'historia' });
  if (ef.renda !== undefined || ef.rendaFator !== undefined) out.push({ caminho: 'eu.renda', sistema: 'dinheiro' });
  if (ef.abrirEmpresa) {
    const a = ef.abrirEmpresa;
    for (const campo of ['valor', 'participacao']) out.push({ caminho: `empresa.${campo}`, sistema: 'dinheiro' });
    for (const campo of ['setor', 'tracao']) out.push({ caminho: `empresa.${campo}`, sistema: 'carreira' });
    out.push({ caminho: 'empresa.fundada', sistema: 'historia' });
    if (a.capital !== undefined || (a.fracao !== undefined && (a.de ?? 'eu') === 'eu')) {
      out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' }, ...ATIVOS.map((x) => ({ caminho: `eu.${x}`, sistema: 'dinheiro' as Sistema })));
    } else if (a.fracao !== undefined) {
      for (const c of concretos(`${a.de}.dinheiro`, atores)) out.push({ caminho: c, sistema: 'dinheiro' });
    }
  }
  if (ef.empresaFator !== undefined) out.push({ caminho: 'empresa.valor', sistema: 'dinheiro' });
  if (ef.rodada) out.push({ caminho: 'empresa.valor', sistema: 'dinheiro' }, { caminho: 'empresa.participacao', sistema: 'dinheiro' });
  if (ef.venderEmpresa || ef.fecharEmpresa) {
    // Vender tudo ou fechar tira a empresa da vida (e a renda de quem vivia dela).
    out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' }, { caminho: 'empresa.valor', sistema: 'dinheiro' }, { caminho: 'empresa.participacao', sistema: 'dinheiro' });
    out.push({ caminho: 'eu.renda', sistema: 'dinheiro' }, ...['empreendedor', 'socio', 'herdeiro_negocio'].map((q) => ({ caminho: `eu.${q}`, sistema: 'historia' as Sistema })));
  }
  if (ef.venderSubsidiarias) {
    out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' }, { caminho: 'empresa.valor', sistema: 'dinheiro' }, { caminho: 'empresa.subsidiarias', sistema: 'poder' });
  }
  if (ef.abrirCapital) {
    // A estreia vende um pedaço da parte de quem joga e tira um pouco da empresa da mesa dele.
    out.push({ caminho: 'eu.dinheiro', sistema: 'dinheiro' }, { caminho: 'empresa.valor', sistema: 'dinheiro' }, { caminho: 'empresa.participacao', sistema: 'dinheiro' });
    out.push({ caminho: 'empresa.dependencia', sistema: 'poder' }, { caminho: 'empresa.na_bolsa', sistema: 'historia' });
  }
  if (ef.custo !== undefined || ef.custoFator !== undefined || ef.custoDoPatrimonio !== undefined) out.push({ caminho: 'eu.custo', sistema: 'dinheiro' });
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
const PAIS_DE_FORA = new Set<string>(PARCEIROS);

/** A entidade que dá os campos de um caminho: "ator.x" é de pessoa, ou de país de fora quando os atores do storylet são países. */
function modeloDe(ent: string, atores: readonly string[] | undefined): string {
  if (ent !== 'ator') return ent;
  return atores && atores.length > 0 && atores.every((a) => PAIS_DE_FORA.has(a)) ? atores[0]! : 'mae';
}

/** Normaliza um caminho concreto para a chave de leitura/escrita ("pessoa.x" do manifesto vira cada papel). */
function chavesDoManifesto(caminho: string): string[] {
  const { ent, campo } = separar(caminho);
  if (ent === 'pessoa') return PAPEIS.map((p) => `${p}.${campo}`);
  return [`${ent}.${campo}`];
}

/** Os valores possíveis de um campo de texto de vocabulário fechado (os outros, como ocupação e curso, são livres). */
function valoresDe(c: Conteudo, ent: string, campo: string): Set<string> | null {
  if (campo === 'regiao' && ent === 'lugar') return new Set(REGIOES_DO_BRASIL);
  if (campo === 'setor') return new Set(c.mundo.setores.map((s) => s.id));
  if (campo === 'padrao') return new Set(PADROES);
  if (campo === 'perfil') return new Set(PERFIS);
  if (campo === 'familia') return new Set(TIPOS_FAMILIA);
  if (campo === 'cargo') return new Set(['', ...c.mundo.cargos.map((x) => x.id)]);
  if (campo === 'governo') return new Set(['voce', ...c.mundo.governos.map((x) => x.id)]);
  if (campo === 'carreira') return new Set(['', ...c.mundo.carreiras.map((x) => x.id)]);
  if (campo === 'testamento') return new Set<string>(DESTINOS);
  if (campo === 'traco') return new Set(ent === 'eu' ? c.mundo.tracosJogador.map((t) => t.id) : c.mundo.tracos.map((t) => t.id));
  return null;
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
  for (const k of VOTOS(c.mundo.governos)) ler(k, { sistema: 'motor', decide: true, onde: 'motor › eleição: o voto de quem joga pesa no resultado' });
  for (const cidade of c.mundo.cidades) for (const m of cidade.marcas) escrever(`lugar.${m}`, `mundo.json › ${cidade.nome}`);
  // Catálogos: quem compra um bem ganha a qualidade dele; quem nasce numa linhagem, as dela (e o pai ou a mãe, a do papel).
  for (const b of c.mundo.bens) escrever(`eu.${b.marca}`, `mundo.json › bens › ${b.id}`);
  for (const l of c.mundo.linhagens) {
    const onde = `mundo.json › linhagens › ${l.id}`;
    for (const m of l.marcas) escrever(`eu.${m}`, onde);
    for (const p of ['mae', 'pai']) escrever(`${p}.${l.papel.marca}`, onde);
    for (const m of l.pais ?? []) escrever(`pais.${m}`, onde);
    if (!c.mundo.setores.some((x) => x.id === l.papel.setor)) erro(onde, `setor desconhecido "${l.papel.setor}"`);
  }

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
    if ((ent === 'lugar' || ent === 'pais') && !defCampo(ent, campo) && !c.mundo.cidades.some((x) => x.marcas.includes(campo)) && !escritores.has(`${ent}.${campo}`)) {
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
      const def = defCampo(modeloDe(ent, atores), campo);
      const tipo = typeof pedido === 'boolean' ? 'bool' : typeof pedido === 'string' || Array.isArray(pedido) ? 'texto' : 'faixa';
      const validos = valoresDe(c, ent, campo);
      if (validos && tipo === 'texto') {
        for (const v of [pedido].flat() as string[]) if (!validos.has(v)) erro(onde, `"${chave}": valor desconhecido "${v}" (vale ${[...validos].join(', ')})`);
      }
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
  const agendados = new Set<string>(AGENDADOS_PELO_MOTOR);
  /** Quem agenda cada storylet: o storylet e o bloco de efeitos do agendamento. */
  const agendadoPor = new Map<string, { s: Storylet; ef: Efeitos }[]>();
  for (const s of c.storylets) {
    const atores = s.ator;
    for (const b of blocosDe(s, nomeDe(s))) {
      const ef = b.efeitos;
      for (const chave of Object.keys(ef)) {
        if (!chave.includes('.')) continue;
        if (!conferirCaminho(chave, b.onde, atores)) continue;
        const { ent, campo } = separar(chave);
        const def = defCampo(modeloDe(ent, atores), campo);
        if (!def) erro(b.onde, `"${chave}" não é campo (qualidades vão em "marcas" ou "qualidades")`);
        else if (def.derivado) erro(b.onde, `"${chave}" é calculado; não dá para escrever`);
        const v = ef[chave];
        const copia = typeof v === 'object' && v !== null && 'copiar' in v ? v.copiar : undefined;
        if (def?.tipo === 'texto' && copia === undefined && !(typeof v === 'object' && v !== null && 'definir' in v && typeof v.definir === 'string')) {
          erro(b.onde, `"${chave}" é texto; use { "definir": "..." } ou { "copiar": "caminho" }`);
        }
        if (copia !== undefined && conferirCaminho(copia, b.onde, atores)) {
          const { ent: entOrigem, campo: campoOrigem } = separar(copia);
          const defOrigem = defCampo(modeloDe(entOrigem, atores), campoOrigem);
          if (!defOrigem || defOrigem.tipo !== def?.tipo) erro(b.onde, `"${chave}" copia "${copia}", que não é um campo do mesmo tipo`);
          for (const k of concretos(copia, atores)) ler(k, { sistema: 'efeito', decide: false, onde: b.onde });
        }
        if (def && campo === 'setor' && typeof v === 'object' && v !== null && 'definir' in v && !c.mundo.setores.some((x) => x.id === v.definir)) {
          erro(b.onde, `setor desconhecido "${String(v.definir)}" (veja mundo.json › setores)`);
        }
      }
      for (const m of [...(ef.marcas ?? []), ...(ef.removerMarcas ?? []), ...Object.keys(ef.qualidades ?? {})]) {
        if (!conferirCaminho(m, b.onde, atores)) continue;
        const { ent, campo } = separar(m);
        if (defCampo(modeloDe(ent, atores), campo)) erro(b.onde, `"${m}" é campo, não qualidade`);
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
        agendadoPor.set(ag.evento, [...(agendadoPor.get(ag.evento) ?? []), { s, ef }]);
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
  // Requisitos das profissões leem o estado e decidem quem pode tentar a vaga.
  for (const k of c.mundo.carreiras) {
    const onde = `mundo.json › carreiras › ${k.id}`;
    conferirCondicao(k.requisitos, onde, undefined, { sistema: 'carreira', decide: true });
    if (!c.mundo.setores.some((x) => x.id === k.setor)) erro(onde, `setor desconhecido "${k.setor}"`);
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
  for (const [g, n] of Object.entries(c.mundo.noticias)) for (const t of [...n.textos, n.resumo]) lerTexto(t, `mundo.json › noticias.${g}`, PARCEIROS);

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
    if (!PAPEL_PESSOA.has(ent) && !PAIS_DE_FORA.has(ent) && ent !== 'eu' && ent !== 'lugar' && ent !== 'pais' && ent !== 'empresa') continue;
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
  /**
   * Só o storylet que o nascimento de um irmão agenda pode falar dos dois filhos: o agendamento é sobre quem nasceu (o
   * ator), e quem agendou já exigia uma qualidade que garante o primeiro filho, então {filho} é outra pessoa.
   */
  const doPrimeiro = marcasDoPapel.get('filho') ?? new Set<string>();
  const doIrmaoNovo = (s: Storylet): boolean => {
    const quem = agendadoPor.get(s.id) ?? [];
    if (!s.apenasAgendado || AGENDADOS_PELO_MOTOR.includes(s.id) || quem.length === 0) return false;
    return quem.every(({ s: t, ef }) => (ef.personagens ?? []).includes('filho') && qualidadesGarantidas(t.condicoes).some((m) => doPrimeiro.has(m)));
  };
  for (const s of c.storylets) {
    const onde = nomeDe(s);
    const tipo = tipoDe(s);
    if (s.apenasAgendado && !agendados.has(s.id)) erro(onde, 'é apenasAgendado, mas ninguém o agenda (storylet morto)');
    if (s.ator && s.ator.some((a) => PAIS_DE_FORA.has(a)) && !s.ator.every((a) => PAIS_DE_FORA.has(a))) erro(onde, 'atores de um tipo só: pessoas ou países de fora');
    if (s.idade && s.idade[1] > IDADE_MAXIMA) erro(onde, `idade máxima acima de ${IDADE_MAXIMA}`);
    // A jogada não trava a vida (a folha tem "Voltar"); o resto precisa de uma saída sempre aberta.
    if (tipo !== 'jogada' && s.escolhas && !s.escolhas.some((esc) => !esc.condicoes)) erro(onde, 'precisa de pelo menos uma escolha sem condições (senão a vida pode travar)');
    if (tipo === 'jogada') {
      s.escolhas?.forEach((esc, i) => {
        const so: Storylet = { ...s, escolhas: [esc] };
        const sistemas = new Set(blocosDe(so, onde).flatMap((b) => escritasDe(b.efeitos, undefined).map((w) => w.sistema)));
        if (sistemas.size < 2) erro(`${onde} › escolha ${i + 1}`, `a jogada mexe em ${sistemas.size === 0 ? 'nada' : [...sistemas].join('')}; precisa de pelo menos 2 sistemas`);
      });
      if (s.rotulo && (/[[\]]/.test(s.rotulo) || comprimentoMaximo(s.rotulo) > LIMITE_ROTULO)) erro(onde, `rótulo sem alternâncias e com até ${LIMITE_ROTULO} caracteres`);
    }
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
    // Com ator filho, o storylet vale para cada filho, e "filho" é sempre o primeiro: o texto e os efeitos falam do ator.
    if (s.ator?.includes('filho') && !doIrmaoNovo(s)) {
      const citados = citacoesDoFilho(s);
      if (citados.length > 0) erro(onde, `com ator filho, "filho" é o primeiro filho, não o ator (${citados.slice(0, 3).join(', ')}): use {ator} e "ator.x"`);
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
  // Quando você nasce, a família inteira está viva; o epitáfio olha para trás e pode lembrar de quem já se foi.
  const todosVivos = PAPEIS_QUE_MORREM.map(sabeSeVivo);
  for (const [m, info] of Object.entries(c.marcas)) {
    if (info.epitafio) verificarModelo(info.epitafio, `marcas.json › ${m}`, new Set(), new Set([m, ...todosVivos]), marcasDoPapel, erro, undefined);
  }
  c.mundo.nascimento.forEach((n, i) => verificarModelo(n.texto, `mundo.json › nascimento[${i}]`, new Set(), new Set(todosVivos), marcasDoPapel, erro, undefined));
  c.mundo.epitafios.forEach((t, i) => verificarModelo(t, `mundo.json › epitafios[${i}]`, new Set(), new Set(todosVivos), marcasDoPapel, erro, undefined));
  for (const [g, ac] of Object.entries(c.mundo.acontecimentos)) {
    for (const t of [...ac.textos, ac.resumo]) verificarModelo(t, `mundo.json › acontecimentos.${g}`, new Set(['como']), new Set(), marcasDoPapel, erro, PAPEIS);
  }
  for (const [g, n] of Object.entries(c.mundo.noticias)) {
    for (const t of [...n.textos, n.resumo]) verificarModelo(t, `mundo.json › noticias.${g}`, new Set(), new Set(), marcasDoPapel, erro, PARCEIROS);
  }
  for (const est of c.mundo.estrangeiros) {
    const onde = `mundo.json › estrangeiros › ${est.id}`;
    if (est.rival && est.rival === est.id) erro(onde, 'o rival não pode ser ele mesmo');
    for (const setor of est.compra) if (!c.mundo.setores.some((x) => x.id === setor)) erro(onde, `setor desconhecido "${setor}"`);
  }
  if (c.mundo.estrangeiros.reduce((soma, x) => soma + x.peso, 0) > 1 + 1e-9) erro('mundo.json › estrangeiros', 'os pesos no comércio somam mais que 1');
  for (let idade = 1; idade <= 100; idade++) {
    if (!c.linhas.some((l) => !l.condicoes && l.idade[0] <= idade && idade <= l.idade[1])) aviso('linhas.json', `nenhuma linha sem condição cobre a idade ${idade}`);
  }
}

/** Onde o storylet cita o papel "filho" ({filho}, {filho:o|a}, "filho.vinculo", "para": "filho"), fora o ator e quem ele cria. */
function citacoesDoFilho(s: Storylet): string[] {
  const achados = new Set<string>();
  const ver = (x: unknown): void => {
    if (typeof x === 'string') {
      if (/^filho(\.|$)/.test(x)) achados.add(`"${x}"`);
      for (const m of x.matchAll(/\{filho(?:[.:][^{}]*)?\}/g)) achados.add(m[0]);
    } else if (Array.isArray(x)) {
      for (const y of x) ver(y);
    } else if (x !== null && typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        if (k === 'ator' || k === 'personagens') continue;
        if (/^filho\./.test(k)) achados.add(`"${k}"`);
        ver(v);
      }
    }
  };
  ver(s);
  return [...achados];
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

/** Marca de mentira que diz "a condição garante que existe empresa" (para o texto poder usar {empresa}). */
const COM_EMPRESA = '@empresa';

/** Personagens que morrem no meio da vida e que o texto chama pelo nome: o texto precisa saber se estão vivos. */
export const PAPEIS_QUE_MORREM = ['mae', 'pai', 'avo', 'amigo', 'amor'] as const;

/** Marca de mentira que diz "a condição sabe se esse personagem está vivo" (`<papel>.vivo`, ou a qualidade `<papel>.faleceu`). */
const sabeSeVivo = (papel: string): string => `@vivo:${papel}`;

/** Qualidades de quem joga que o motor tira quando o personagem morre (pessoas.ts › morrerPersonagem): exigir uma delas é exigir que ele esteja vivo. */
const VIVO_PELA_QUALIDADE: Record<string, readonly string[]> = { amor: ['namoro', 'casado'] };

/** Qualidades que a condição garante que existem (as exigidas e as de marcaHa), mais a empresa, se ela é exigida, e quem ela sabe se está vivo. */
function qualidadesGarantidas(cond: Condicoes | undefined): string[] {
  const marcas = [...(cond?.marcas ?? []), ...(cond?.marcaHa ?? []).map((m) => m.marca)];
  // Qualquer condição sobre a empresa (menos "false") falha sem empresa: então ela garante a empresa.
  const exige = marcas.some((m) => m.startsWith('empresa.')) || Object.entries(cond ?? {}).some(([k, v]) => k.startsWith('empresa.') && v !== false && v !== undefined);
  // Vivo ou morto, tanto faz: o texto escrito para um dos dois casos é o que importa (vivo: a fala; morto: a lembrança).
  const lidas = new Set([...marcas, ...(cond?.semMarcas ?? [])]);
  const vivos = PAPEIS_QUE_MORREM.filter(
    (p) => (cond !== undefined && `${p}.vivo` in cond) || lidas.has(`${p}.faleceu`) || (VIVO_PELA_QUALIDADE[p] ?? []).some((m) => marcas.includes(m)),
  ).map(sabeSeVivo);
  return [...marcas, ...(exige ? [COM_EMPRESA] : []), ...vivos];
}

function criadosPor(ef: Efeitos | undefined): Set<string> {
  return new Set([...(ef?.personagens ?? []), ...(ef?.promover ? [ef.promover.para] : []), ...(ef?.abrirEmpresa ? ['empresa'] : [])]);
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
  const blocos = blocosDe(s, onde);
  if (blocos.some((b) => b.efeitos.transferir)) extras.add('transferido');
  // Valores calculados pelos efeitos da empresa: com quanto ela abriu, quanto a rodada pôs, por quanto vendeu, o que sobrou.
  if (blocos.some((b) => b.efeitos.abrirEmpresa)) extras.add('capital');
  if (blocos.some((b) => b.efeitos.rodada)) extras.add('rodada');
  if (blocos.some((b) => b.efeitos.venderEmpresa || b.efeitos.venderSubsidiarias || b.efeitos.abrirCapital)) extras.add('venda');
  if (blocos.some((b) => b.efeitos.fecharEmpresa)) extras.add('sobra');
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
    // O botão aparece mesmo bloqueado: a condição da escolha não diz se quem ele cita está vivo.
    const doBotao = new Set([...exigidas].filter((m) => !m.startsWith('@vivo:') || exigidasStorylet.has(m)));
    ver(esc.texto, `${o} › texto`, new Set(), doBotao);
    if (esc.bloqueio) ver(esc.bloqueio, `${o} › bloqueio`, new Set(), doBotao);
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
  const papeis = new Set<string>([...PAPEIS, ...PARCEIROS, 'empresa', CACULA]);
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
      else if (!camposDe(modeloDe(ent, atores))[campo]) erro(onde, `{${v}}: "${campo}" não é campo (qualidades não aparecem no texto)`);
      continue;
    }
    if (!globais.has(v) && !papeis.has(v) && !extras.has(v)) erro(onde, `variável desconhecida {${v}}`);
  }
  for (const p of a.concordancias) {
    if (p === 'ator' ? !atores : !papeis.has(p)) erro(onde, `personagem desconhecido em {${p}:...}`);
  }

  // Personagem criado no meio da vida (e a empresa) só aparece em texto que exige a qualidade que o garante.
  const novos = new Set<string>([...PAPEIS_NOVOS, 'empresa']);
  const usados = new Set([...a.variaveis.map((v) => separar(v.includes('.') ? v : `${v}.nome`).ent), ...a.concordancias]);
  if (usados.has('ator')) for (const p of atores ?? []) usados.add(p);
  for (const usado of usados) {
    // O caçula é um dos filhos: o que garante {filho} garante {cacula}.
    const p = usado === CACULA ? 'filho' : usado;
    if (!novos.has(p) || criadosAqui.has(p) || atores?.includes(p)) continue;
    if (p === 'empresa') {
      if (!marcasExigidas.has(COM_EMPRESA)) erro(onde, 'usa {empresa} sem exigir a empresa (uma condição como "empresa.valor": true)');
      continue;
    }
    const garantidoras = marcasDoPapel.get(p) ?? new Set();
    if (![...marcasExigidas].some((m) => garantidoras.has(m))) {
      erro(onde, `usa {${usado}} sem exigir uma qualidade que garanta esse personagem (${[...garantidoras].join(', ') || 'nenhuma'})`);
    }
  }

  // Morto não fala: quem pode ter morrido só aparece em texto que sabe se ele está vivo. O ator único já vem vivo
  // (o motor só escolhe ator morto quando a condição lê "ator.vivo"); com dois atores possíveis, o outro pode ter morrido.
  const peloNome = new Set([...a.variaveis.filter((v) => v !== 'ator').map((v) => separar(v.includes('.') ? v : `${v}.nome`).ent), ...a.concordancias]);
  for (const p of PAPEIS_QUE_MORREM) {
    if (!peloNome.has(p) || criadosAqui.has(p) || (atores?.length === 1 && atores[0] === p) || marcasExigidas.has(sabeSeVivo(p))) continue;
    erro(onde, `usa {${p}} sem saber se a pessoa está viva: ponha "${p}.vivo" na condição ou num trecho (viva: a fala; morta: a lembrança)`);
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

// ---------------------------------------------------------------- o texto combina com o que já aconteceu

/**
 * O amigo de infância nasce com você: tem vínculo desde o primeiro ano, adoece e se cura na linha do tempo ("seu amigo
 * Pedro foi parar no hospital") e aparece na pracinha e na pré-escola. Texto que o apresenta como desconhecido
 * ("um menino chamado {amigo}", "conheceu {amigo}") contradiz o que já pode ter acontecido.
 */
function reAmigoDesconhecido(quem: string): RegExp {
  const papel = String.raw`\{${quem}(?:\.nome)?\}`;
  return new RegExp(String.raw`chamad(?:[oa]|\{[^{}]*\})\s+${papel}|(?:^|[.,;:!?]\s*|\be\s+|[Vv]ocê\s+)conheceu\s+${papel}`, 'u');
}
const RE_AMIGO_DESCONHECIDO = reAmigoDesconhecido('amigo');
/** Com o amigo entre os atores, {ator} também pode ser ele. */
const RE_AMIGO_DESCONHECIDO_ATOR = reAmigoDesconhecido('(?:amigo|ator)');

/**
 * Os irmãos de quem joga (irmão, irmã, irmãos): fora o meio-irmão, o irmão de alguém ("irmão do vizinho"), a comparação
 * ("como irmãos", "pareciam irmãos") e o campo ({irmaos}).
 */
const RE_IRMAO = /(?<![\p{L}{.-])(?<!(?:como|pareciam|feito|nem)\s+(?:uns?\s+|umas?\s+)?)irm[ãa]o?s?(?![\p{L}-])(?!\s+d[eoa]s?\s)/iu;

/** A condição garante que quem joga tem irmão ("irmaos": { "min": 1 } ou true). */
function sabeDosIrmaos(cond: Condicoes | undefined): boolean {
  const v = cond?.['irmaos'];
  return v === true || (typeof v === 'object' && !Array.isArray(v) && (v.min ?? 0) >= 1);
}

/**
 * Texto que contradiz o que a vida já tem: o amigo de infância apresentado como estranho e o irmão de quem é filho
 * único. O irmão só aparece quando a condição (do storylet, do trecho ou da escolha, para o desfecho) garante que ele
 * existe; o botão da escolha aparece mesmo bloqueado, então ali só vale a condição do storylet. Com ator filho, os
 * irmãos são os dos filhos.
 */
export function verificarCoerencia(c: Conteudo, problemas: Problema[]): void {
  const erro: Reporter = (onde, mensagem) => void problemas.push({ nivel: 'erro', onde, mensagem });
  const conferir = (texto: string, onde: string, temIrmao: boolean, atores: readonly string[] | undefined): void => {
    if ((atores?.includes('amigo') ? RE_AMIGO_DESCONHECIDO_ATOR : RE_AMIGO_DESCONHECIDO).test(texto)) {
      erro(onde, 'apresenta o amigo de infância como desconhecido ("chamado {amigo}", "conheceu {amigo}"), mas ele existe desde que você nasceu: use um trecho pela memória ou um jeito neutro');
    }
    if (!temIrmao && !atores?.includes('filho') && RE_IRMAO.test(texto)) {
      erro(onde, 'fala do irmão de quem joga sem saber se ele existe: ponha "irmaos": { "min": 1 } na condição ou num trecho (e outro texto para filho único)');
    }
  };
  for (const s of c.storylets) {
    const onde = `${c.arquivoDe.get(s.id) ?? '?'} › ${s.id}`;
    const base = sabeDosIrmaos(s.condicoes);
    const at = s.ator;
    conferir(s.texto, `${onde} › texto`, base, at);
    conferir(s.resumo, `${onde} › resumo`, base, at);
    if (s.rotulo) conferir(s.rotulo, `${onde} › rotulo`, base, at);
    for (const [nome, r] of [['sucesso', s.sucesso], ['fracasso', s.fracasso]] as const) {
      if (!r) continue;
      conferir(r.texto, `${onde} › ${nome}`, base, at);
      if (r.resumo) conferir(r.resumo, `${onde} › ${nome} › resumo`, base, at);
    }
    for (const [nome, trechos] of Object.entries(s.trechos ?? {})) {
      trechos.forEach((t, i) => conferir(t.texto, `${onde} › trechos.${nome}[${i}]`, base || sabeDosIrmaos(t.se), at));
    }
    s.escolhas?.forEach((esc, i) => {
      const o = `${onde} › escolha ${i + 1}`;
      conferir(esc.texto, `${o} › texto`, base, at);
      if (esc.bloqueio) conferir(esc.bloqueio, `${o} › bloqueio`, base, at);
      const daEscolha = base || sabeDosIrmaos(esc.condicoes);
      conferir(esc.resumo, `${o} › resumo`, daEscolha, at);
      for (const [nome, r] of [['sucesso', esc.sucesso], ['fracasso', esc.fracasso], ['resultado', esc.resultado]] as const) {
        if (!r) continue;
        conferir(r.texto, `${o} › ${nome}`, daEscolha, at);
        if (r.resumo) conferir(r.resumo, `${o} › ${nome} › resumo`, daEscolha, at);
      }
    });
  }
  c.linhas.forEach((l, i) => conferir(l.texto, `linhas.json[${i}]`, sabeDosIrmaos(l.condicoes), undefined));
  c.mortes.forEach((m, i) => conferir(m.causa, `mortes.json[${i}]`, sabeDosIrmaos(m.condicoes), undefined));
  c.mundo.nascimento.forEach((n, i) => conferir(n.texto, `mundo.json › nascimento[${i}]`, sabeDosIrmaos(n.se), undefined));
  for (const [m, info] of Object.entries(c.marcas)) if (info.epitafio) conferir(info.epitafio, `marcas.json › ${m}`, false, undefined);
  for (const [g, ac] of Object.entries(c.mundo.acontecimentos)) {
    for (const t of [...ac.textos, ac.resumo]) conferir(t, `mundo.json › acontecimentos.${g}`, false, PAPEIS);
  }
}
