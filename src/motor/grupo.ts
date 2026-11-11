/**
 * O grupo econômico de quem joga (missão Capitalismo vivo, I-156): as operações societárias da folha.
 *
 * - **Criar a holding:** uma pessoa jurídica sem operação, com capital de quem joga.
 * - **Levar para a holding:** a parte de quem joga numa empresa passa a ser da holding (a propriedade muda de mão; não
 *   é dinheiro, e o patrimônio dele não muda: a parte efetiva é a mesma).
 * - **Fundar uma subsidiária:** o capital sai do caixa da controladora e entra no da empresa nova, que nasce com o
 *   número dela, o setor, a estrutura e a controladora escrita.
 * - **Aportar na controlada:** do caixa da controladora para o da controlada; com sócios, a parte da controladora cresce.
 * - **A política de dividendos da controlada:** quanto do lucro sobe para a controladora.
 * - **Vender participação:** a controladora vende uma fração da parte dela no mercado e recebe no caixa; vendida a parte
 *   inteira, a empresa continua existindo, fora do grupo (com o nome, o caixa, a clientela e a história).
 *
 * As regras de cada uma estão em `motivoParaNaoOperarGrupo`; o que muda o estado, em `operarGrupo`.
 */
import { donaDe, empresaDoRegistro, parteNaEmpresa, refDaEmpresa } from './campos.ts';
import type { Conteudo } from './conteudo.ts';
import { aEmpresa, fundar, liquidoDe, lugarLivre, setoresDeEmpresa, tirarDeQuemJoga } from './empresa.ts';
import { definirNumero, somar } from './livro.ts';
import { momentoDoPais } from './pais.ts';
import { CAPITAL_MINIMO_EMPRESA, MAX_EMPRESAS, precoDeVenda } from './regras.ts';
import { controladaPor, diluirPeloAporte, formaCiclo, liberarParticipadas, mudarDona } from './societario.ts';
import { formatarDinheiro } from './texto.ts';
import type { Entidade, EstadoVida, Mudanca } from './tipos.ts';
import { movimentar } from './economia.ts';
import { moverEmpresa } from './empresa.ts';

export type OperacaoGrupo =
  | { tipo: 'criarHolding'; valor: number }
  | { tipo: 'paraAHolding'; empresa: string; holding: string }
  | { tipo: 'fundarSubsidiaria'; controladora: string; setor: string; valor: number }
  | { tipo: 'aportarNaControlada'; de: string; para: string; valor: number }
  | { tipo: 'dividendosDaControlada'; empresa: string; fracao: number }
  | { tipo: 'venderParticipacao'; empresa: string; fracao: number };

const TIPOS = new Set(['criarHolding', 'paraAHolding', 'fundarSubsidiaria', 'aportarNaControlada', 'dividendosDaControlada', 'venderParticipacao']);
export function ehOperacaoDeGrupo(op: { tipo: string }): op is OperacaoGrupo {
  return TIPOS.has(op.tipo);
}

/** O capital mínimo de uma holding: a estrutura de um ano mais um pouco. */
export const CAPITAL_MINIMO_HOLDING = 200_000;

/** A empresa viva com esse id, se for uma empresa. */
function viva(e: EstadoVida, id: string | undefined): Entidade | undefined {
  const x = id ? e.entidades[id] : undefined;
  return x && x.tipo === 'empresa' && x.vivo !== false ? x : undefined;
}

/** A empresa é do grupo de quem joga (a cadeia de controle chega nele)? */
export function doGrupo(e: EstadoVida, emp: Entidade): boolean {
  return donaDe(emp) === 'eu' || controladaPor(e, emp, 'eu');
}

/** A controladora da empresa, se for uma empresa (a holding de uma subsidiária). */
export function controladoraEmpresa(e: EstadoVida, emp: Entidade): Entidade | undefined {
  const d = donaDe(emp);
  return d[0] === '#' ? empresaDoRegistro(e, d) : undefined;
}

/** O preço de uma fração da parte da controladora, pelo valor da empresa e pela fase do país (o mesmo da venda de quem joga). */
export function precoDaParticipacao(e: EstadoVida, emp: Entidade, fracao: number): number {
  const parte = emp.n['participacao'] ?? 1;
  return Math.max(0, emp.n['valor'] ?? 0) * parte * Math.max(0, Math.min(1, fracao)) * precoDeVenda(momentoDoPais(e).empresa);
}

export function motivoParaNaoOperarGrupo(e: EstadoVida, c: Conteudo, op: OperacaoGrupo): string | null {
  if (e.idade < 18) return 'só a partir dos 18 anos';
  switch (op.tipo) {
    case 'criarHolding':
      if (!lugarLivre(e)) return `já são ${MAX_EMPRESAS} empresas no grupo`;
      if (!e.entidades['empresa'] || e.entidades['empresa']!.vivo === false) return 'a holding precisa ter o que controlar: abra uma empresa antes';
      if (!(op.valor >= CAPITAL_MINIMO_HOLDING)) return `o capital mínimo de uma holding é ${formatarDinheiro(CAPITAL_MINIMO_HOLDING)}`;
      return op.valor > liquidoDe(e) + 0.5 ? 'não há tanto dinheiro' : null;
    case 'paraAHolding': {
      const emp = viva(e, op.empresa);
      const holding = viva(e, op.holding);
      if (!emp || !holding) return 'essa empresa não existe';
      if (!holding.q['holding']) return 'só uma holding recebe participações';
      if (emp.q['holding']) return 'uma holding não vai para dentro de outra por aqui';
      if (donaDe(emp) !== 'eu') return 'essa empresa já é de outra empresa do grupo';
      if (donaDe(holding) !== 'eu') return 'a holding precisa ser sua';
      return formaCiclo(e, emp, refDaEmpresa(holding)) ? 'isso faria a holding ser dona dela mesma' : null;
    }
    case 'fundarSubsidiaria': {
      const mae = viva(e, op.controladora);
      if (!mae || !doGrupo(e, mae)) return 'essa empresa não é do seu grupo';
      if (!lugarLivre(e)) return `já são ${MAX_EMPRESAS} empresas no grupo`;
      if (!setoresDeEmpresa(c).some((s) => s.id === op.setor)) return 'escolha o ramo';
      if (!(op.valor >= CAPITAL_MINIMO_EMPRESA)) return `o mínimo para abrir é ${formatarDinheiro(CAPITAL_MINIMO_EMPRESA)}`;
      return op.valor > (mae.n['caixa'] ?? 0) + 0.5 ? `o caixa ${aEmpresa(mae, 'da')} não tem ${formatarDinheiro(op.valor)}` : null;
    }
    case 'aportarNaControlada': {
      const de = viva(e, op.de);
      const para = viva(e, op.para);
      if (!de || !para) return 'essa empresa não existe';
      if (!doGrupo(e, de)) return 'essa empresa não é do seu grupo';
      if (donaDe(para) !== refDaEmpresa(de)) return `${aEmpresa(para)} não é controlada ${aEmpresa(de, 'da')}`;
      if (!(op.valor >= 1)) return 'escolha quanto pôr';
      return op.valor > (de.n['caixa'] ?? 0) + 0.5 ? `o caixa ${aEmpresa(de, 'da')} não tem tanto` : null;
    }
    case 'dividendosDaControlada': {
      const emp = viva(e, op.empresa);
      if (!emp || !doGrupo(e, emp) || donaDe(emp) === 'eu') return 'essa empresa não é controlada por outra do seu grupo';
      if (!(op.fracao >= 0 && op.fracao <= 1)) return 'escolha a parte do lucro';
      return Math.abs((emp.n['retirada'] ?? 0) - op.fracao) < 1e-9 ? 'já é assim' : null;
    }
    case 'venderParticipacao': {
      const emp = viva(e, op.empresa);
      if (!emp || !doGrupo(e, emp) || !controladoraEmpresa(e, emp)) return 'essa empresa não é controlada por outra do seu grupo';
      if (!(op.fracao > 0 && op.fracao <= 1)) return 'escolha quanto vender';
      return precoDaParticipacao(e, emp, op.fracao) < 1 ? 'essa participação não vale nada agora' : null;
    }
  }
}

/** O id fora do grupo de uma empresa que deixou de ser dele (continua existindo, com o número dela). */
export function idForaDoGrupo(emp: Entidade): string {
  return `empresaR${emp.registro ?? 0}`;
}

export function operarGrupo(e: EstadoVida, c: Conteudo, op: OperacaoGrupo, reg: Mudanca[], origem: number): { texto: string; resumo: string } {
  switch (op.tipo) {
    case 'criarHolding': {
      const lugar = lugarLivre(e)!;
      const valor = tirarDeQuemJoga(e, reg, op.valor, lugar);
      const holding = fundar(e, c, reg, { setor: 'financas', valor, de: 'eu', holding: true }, origem, lugar, `${e.sobrenome} Participações`)!;
      return {
        texto: `Nasceu ${aEmpresa(holding)}, a holding da família, com ${formatarDinheiro(valor)} de capital. Ela não fabrica nem vende nada: é dona das outras.`,
        resumo: `criou a holding ${holding.nome}`,
      };
    }
    case 'paraAHolding': {
      const emp = e.entidades[op.empresa]!;
      const holding = e.entidades[op.holding]!;
      mudarDona(e, reg, emp, refDaEmpresa(holding), emp.n['participacao'] ?? 1);
      return {
        texto: `A sua parte ${aEmpresa(emp, 'da')} passou para ${aEmpresa(holding)}. Os dividendos ${aEmpresa(emp, 'da')} sobem para a holding agora, e ela decide o que sobe para você.`,
        resumo: `pôs ${aEmpresa(emp)} dentro da holding`,
      };
    }
    case 'fundarSubsidiaria': {
      const mae = e.entidades[op.controladora]!;
      const lugar = lugarLivre(e)!;
      // O capital sai do caixa da controladora e entra no da filha, no mesmo lançamento; o valor da controladora (que
      // inclui o caixa) desce o mesmo tanto, e a filha entra pela parte dela (sem contar duas vezes).
      somar(e, reg, mae.id, 'caixa', -op.valor, 'capital', lugar);
      somar(e, reg, mae.id, 'valor', -Math.min(op.valor, Math.max(0, mae.n['valor'] ?? 0)), 'empresa');
      const filha = fundar(e, c, reg, { setor: op.setor, valor: op.valor, de: mae.id, dona: refDaEmpresa(mae) }, origem, lugar)!;
      // Quem cuida da subsidiária é a diretoria dela: ela depende pouco de quem joga.
      definirNumero(e, reg, lugar, 'dependencia', 15);
      const ramo = c.setores.get(op.setor)?.nome ?? op.setor;
      return {
        texto: `${aEmpresa(mae, 'A')} fundou ${aEmpresa(filha)}, de ${ramo}, com ${formatarDinheiro(op.valor)} do caixa dela. É outra pessoa jurídica: tem o caixa, a estrutura e as contas dela.`,
        resumo: `fundou a subsidiária ${filha.nome}`,
      };
    }
    case 'aportarNaControlada': {
      const de = e.entidades[op.de]!;
      const para = e.entidades[op.para]!;
      const antes = Math.max(0, para.n['valor'] ?? 0);
      const parte = para.n['participacao'] ?? 1;
      somar(e, reg, de.id, 'caixa', -op.valor, 'aporte', para.id);
      somar(e, reg, de.id, 'valor', -Math.min(op.valor, Math.max(0, de.n['valor'] ?? 0)), 'empresa');
      somar(e, reg, para.id, 'caixa', op.valor, 'aporte', de.id);
      somar(e, reg, para.id, 'valor', op.valor, 'empresa');
      // Os outros sócios não puseram nada: a parte da controladora cresce.
      if (parte < 1 || (para.n['participacao_socia'] ?? 0) > 0) diluirPeloAporte(e, reg, para, op.valor, antes);
      return { texto: `${aEmpresa(de, 'A')} pôs ${formatarDinheiro(op.valor)} no caixa ${aEmpresa(para, 'da')}.`, resumo: `aportou ${formatarDinheiro(op.valor)} na controlada ${para.nome}` };
    }
    case 'dividendosDaControlada': {
      const emp = e.entidades[op.empresa]!;
      definirNumero(e, reg, emp.id, 'retirada', op.fracao);
      const mae = controladoraEmpresa(e, emp);
      return {
        texto: `${aEmpresa(emp, 'A')} passa a distribuir ${Math.round(op.fracao * 100)}% do lucro${mae ? `, que sobe para ${aEmpresa(mae)}` : ''}.`,
        resumo: `mudou os dividendos ${aEmpresa(emp, 'da')}`,
      };
    }
    case 'venderParticipacao': {
      const emp = e.entidades[op.empresa]!;
      const mae = controladoraEmpresa(e, emp)!;
      const preco = precoDaParticipacao(e, emp, op.fracao);
      const parte = emp.n['participacao'] ?? 1;
      const vendida = parte * Math.min(1, op.fracao);
      // Quem compra é o mercado (os investidores): o dinheiro entra no caixa da controladora.
      somar(e, reg, mae.id, 'caixa', preco, 'venda', 'mercado');
      somar(e, reg, mae.id, 'valor', preco, 'empresa');
      if (parte - vendida < 0.005) {
        // A empresa continua existindo, fora do grupo: com o nome, o caixa, a clientela e a história (missão Capitalismo vivo).
        // O que ela controlava fica no grupo: o preço foi o do negócio dela sozinha.
        liberarParticipadas(e, reg, emp);
        definirNumero(e, reg, emp.id, 'participacao', 1 - (emp.n['participacao_socia'] ?? 0));
        mudarDona(e, reg, emp, 'mercado', 1 - (emp.n['participacao_socia'] ?? 0));
        const nome = emp.nome;
        moverEmpresa(e, reg, emp.id, idForaDoGrupo(emp));
        return {
          texto: `${aEmpresa(mae, 'A')} vendeu a parte inteira ${aEmpresa({ nome, genero: emp.genero }, 'da')} por ${formatarDinheiro(preco)}. A empresa segue a vida dela, com dono novo, fora do grupo.`,
          resumo: `vendeu ${nome} inteira`,
        };
      }
      definirNumero(e, reg, emp.id, 'participacao', parte - vendida);
      return {
        texto: `${aEmpresa(mae, 'A')} vendeu ${Math.round(op.fracao * 100)}% da parte dela ${aEmpresa(emp, 'na')} por ${formatarDinheiro(preco)}; continua com ${Math.round((parte - vendida) * 100)}%.`,
        resumo: `vendeu parte ${aEmpresa(emp, 'da')}`,
      };
    }
  }
}

/** O que a parte de quem joga no grupo vale, empresa por empresa (para a folha): sem dupla contagem, pela parte efetiva. */
export function valorDoGrupoParaQuemJoga(e: EstadoVida, empresas: readonly Entidade[]): number {
  return empresas.reduce((s, x) => s + parteNaEmpresa(e, x.id), 0);
}

/** O dinheiro que sobe da holding para quem joga pela política dela: o mesmo que `pagarDividendos` faz no ano (aqui, uma retirada extraordinária do caixa). */
export function retiradaDaHolding(e: EstadoVida, reg: Mudanca[], holding: Entidade, valor: number): number {
  const v = Math.min(valor, Math.max(0, holding.n['caixa'] ?? 0));
  if (v < 1) return 0;
  somar(e, reg, holding.id, 'caixa', -v, 'dividendos', 'eu');
  movimentar(e, reg, { dinheiro: v, contraparte: holding.id }, 'eu', 'dividendos');
  return v;
}
