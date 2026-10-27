import { useState } from 'preact/hooks';
import { Folha } from './Folha.tsx';
import { acoesComPessoa, fichasUsadas } from '../motor/acoes.ts';
import { fichasDoAno } from '../motor/regras.ts';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import type { Destino } from '../motor/herdeiro.ts';
import { EXES, FILHOS, IRMAOS, VISOES_RUINS, ehEx, ehFilho, ehIrmao, type Humor, type Verbo, type Visao } from '../motor/constantes.ts';
import { idadeDe, lerCaminho, patrimonioDe } from '../motor/campos.ts';
import { convivem, gostoDe, humorDe, lembrancasDe, porqueDe, semONome, visoesDe } from '../motor/relacoes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { capitalizar, formatarDinheiro } from '../motor/texto.ts';
import type { Entidade, EstadoVida } from '../motor/tipos.ts';
import { descreverOrigem } from '../motor/virada.ts';
import { anos } from './formato.ts';

/** Para quem vai tudo: a escolha do testamento (sem ficha, a qualquer hora). */
function Testamento({ vida, conteudo, aoOperar }: { vida: EstadoVida; conteudo: Conteudo; aoOperar: (op: Operacao) => void }) {
  const eu = vida.entidades['eu']!;
  const atual = (eu.t['testamento'] ?? '') as Destino;
  const nome = (id: string): string => vida.entidades[id]?.nome ?? '';
  // Um botão por filho que existe (o primeiro aparece mesmo antes de nascer, desabilitado com o motivo).
  const filhos = FILHOS.filter((id, i) => i === 0 || vida.entidades[id]);
  const opcoes: { para: Destino; rotulo: string }[] = [
    { para: '', rotulo: 'A lei (os filhos dividem)' },
    ...filhos.map((id) => ({ para: id, rotulo: nome(id) ? `${nome(id)} (${vida.entidades[id]?.genero === 'f' ? 'filha' : 'filho'})` : 'Filho' })),
    { para: 'amor', rotulo: nome('amor') ? `${nome('amor')} (par)` : 'Par' },
    { para: 'amigo', rotulo: nome('amigo') ? `${nome('amigo')} (amizade)` : 'Melhor amigo' },
    { para: 'sobrinho', rotulo: 'Os sobrinhos' },
    { para: 'causa', rotulo: 'Uma causa' },
    { para: 'pet', rotulo: nome('pet') ? `${nome('pet')} (o bicho)` : 'O bicho' },
  ];
  const umFilho = 'Tudo para este filho, sem dividir com os irmãos: a história continua com ele.';
  const explica: Record<Destino, string> = {
    '': 'Sem testamento, vale a lei: os filhos dividem a herança, e o mais velho continua a história; sem filho, um sobrinho.',
    filho: umFilho,
    filho2: umFilho,
    filho3: umFilho,
    filho4: umFilho,
    amor: 'Tudo para o par, sem dividir: a história continua com quem dividiu a vida com você.',
    amigo: 'Tudo para o melhor amigo. A família vai estranhar; a história continua com ele.',
    sobrinho: 'Tudo para os sobrinhos: um deles continua a história.',
    causa: 'Tudo para hospitais e escolas. A fortuna sai da família e a história termina com você.',
    pet: 'Tudo para o bicho, com tutor e fundo. A história termina com você, e ele vive como rei.',
  };
  return (
    <fieldset class="grupo testamento">
      <legend>Testamento</legend>
      <div class="escolhas-origem" role="group" aria-label="Para quem vai tudo">
        {opcoes.map((o) => {
          const op: Operacao = { tipo: 'testamento', para: o.para };
          const motivo = o.para === atual ? null : motivoParaNaoOperar(vida, conteudo, op);
          return (
            <button type="button" class="chip-origem" key={o.para || 'lei'} aria-pressed={o.para === atual} disabled={motivo !== null} onClick={() => o.para !== atual && aoOperar(op)}>
              {o.rotulo}
            </button>
          );
        })}
      </div>
      <p class="nota">{explica[atual]}</p>
    </fieldset>
  );
}

/** Ordem do painel: quem veio antes, quem chegou depois, e por último quem passou (os ex) e quem é do trabalho. */
const ORDEM = ['mae', 'pai', 'avo', ...IRMAOS, 'amigo', 'amor', ...FILHOS, 'pet', ...EXES, 'colega', 'chefe'] as const;

function papelDe(id: string, en: Entidade, vida: EstadoVida): string {
  const f = en.genero === 'f';
  if (ehFilho(id)) return f ? 'Filha' : 'Filho';
  if (ehIrmao(id)) return f ? 'Irmã' : 'Irmão';
  if (ehEx(id)) return 'Ex';
  switch (id) {
    case 'colega':
      return 'Colega';
    case 'chefe':
      return 'Chefe';
    case 'mae':
    case 'pai':
      // Numa dinastia, a família de quem herda pode ter duas mães ou dois pais.
      return f ? 'Mãe' : 'Pai';
    case 'avo':
      return f ? 'Avó' : 'Avô';
    case 'amigo':
      return f ? 'Amiga' : 'Amigo';
    case 'amor': {
      const q = vida.entidades['eu']!.q;
      if (en.vivo !== false && q['casado']) return f ? 'Esposa' : 'Marido';
      if (en.vivo !== false && q['namoro']) return f ? 'Namorada' : 'Namorado';
      return 'Amor';
    }
    default:
      return 'Bicho';
  }
}

/** Como a pessoa está com quem joga (o humor do ano) e a cor dele. */
const HUMOR: Record<Humor, { m: string; f: string; tom: 'ruim' | 'bom' | 'saudade' | 'neutro' }> = {
  furia: { m: 'furioso com você', f: 'furiosa com você', tom: 'ruim' },
  magoa: { m: 'magoado com você', f: 'magoada com você', tom: 'ruim' },
  abatimento: { m: 'abatido', f: 'abatida', tom: 'neutro' },
  saudade: { m: 'com saudade de você', f: 'com saudade de você', tom: 'saudade' },
  alegria: { m: 'feliz com você', f: 'feliz com você', tom: 'bom' },
  paz: { m: 'em paz com você', f: 'em paz com você', tom: 'neutro' },
  distancia: { m: 'distante', f: 'distante', tom: 'neutro' },
};

/** O que a pessoa acha de quem joga, no gênero de quem joga ("acha você generosa"). */
const VISAO: Record<Visao, { m: string; f: string }> = {
  orgulho: { m: 'um orgulho', f: 'um orgulho' },
  presente: { m: 'presente', f: 'presente' },
  carinhoso: { m: 'carinhoso', f: 'carinhosa' },
  de_palavra: { m: 'de palavra', f: 'de palavra' },
  generoso: { m: 'generoso', f: 'generosa' },
  cuida_dos_filhos: { m: 'um pai presente', f: 'uma mãe presente' },
  sumido: { m: 'sumido', f: 'sumida' },
  metido: { m: 'metido', f: 'metida' },
  interesseiro: { m: 'interesseiro', f: 'interesseira' },
  cabeca_quente: { m: 'cabeça-quente', f: 'cabeça-quente' },
  sem_palavra: { m: 'sem palavra', f: 'sem palavra' },
  longe_dos_filhos: { m: 'um pai ausente', f: 'uma mãe ausente' },
  casado_com_o_trabalho: { m: 'casado com o trabalho', f: 'casada com o trabalho' },
  perdido: { m: 'perdido', f: 'perdida' },
};
const DOI: ReadonlySet<string> = new Set(VISOES_RUINS);

/** "Acha você generosa, mas sumida", e o porquê da primeira opinião que tem um. */
function Opiniao({ vida, id, en }: { vida: EstadoVida; id: string; en: Entidade }) {
  const ops = visoesDe(vida, id, en);
  if (ops.length === 0) return null;
  const g = vida.entidades['eu']!.genero === 'f' ? 'f' : 'm';
  const [a, b] = ops;
  const liga = b && DOI.has(a!.visao) !== DOI.has(b.visao) ? ', mas ' : ' e ';
  const porque = ops.map((o) => porqueDe(vida, id, en, o)).find(Boolean);
  return (
    <>
      <p class={`visao ${DOI.has(a!.visao) ? 'ruim' : 'bom'}`}>
        Acha você <b>{VISAO[a!.visao][g]}</b>
        {b && (
          <>
            {liga}
            <b>{VISAO[b.visao][g]}</b>
          </>
        )}
        .
      </p>
      {porque && <p class="porque">Por quê: {porque}.</p>}
    </>
  );
}

/** A vontade que a pessoa guarda (mundo.json › vontades), com o tempo que ela espera. */
function Vontade({ vida, conteudo, en }: { vida: EstadoVida; conteudo: Conteudo; en: Entidade }) {
  const v = conteudo.mundo.vontades.find((x) => (en.q[x.id]?.v ?? 0) > 0);
  if (!v) return null;
  const desde = vida.idade - en.q[v.id]!.idade;
  if (en.vivo === false) return <p class="vontade">Queria {v.quer}.</p>;
  return (
    <p class="vontade">
      Quer {v.quer}.{desde >= 2 ? ` Fala disso há ${desde} anos.` : ''}
    </p>
  );
}

/**
 * O que a relação é agora e o que ficou dela: o humor (e o rompimento), os anos sem notícia, o que a pessoa acha de
 * quem joga (com o porquê), o que ela quer e as lembranças que ela tem de quem joga, do livro-razão (a melhor e, se
 * ainda dói, a pior). De quem morreu, fica a lembrança e a vontade que faltou.
 */
function Relacao({ vida, conteudo, id, en }: { vida: EstadoVida; conteudo: Conteudo; id: string; en: Entidade }) {
  const f = en.genero === 'f';
  const viva = en.vivo !== false;
  const { boa, ruim } = lembrancasDe(vida, id);
  const rompeu = (en.q['rompido']?.v ?? 0) > 0;
  const humor = humorDe(vida, id, en);
  const longe = en.n['sem_contato'] ?? 0;
  const lembra = boa ? `de quando você ${semONome(boa.texto, id, en)}, aos ${boa.idade}` : '';
  const doi = ruim && (en.n['magoa'] ?? 0) >= 10 ? `de quando você ${semONome(ruim.texto, id, en)}, aos ${ruim.idade}` : '';
  if (!viva) {
    return (
      <>
        {lembra && <p class="lembranca">Fica a lembrança {lembra}.</p>}
        <Vontade vida={vida} conteudo={conteudo} en={en} />
      </>
    );
  }
  // Quem rompeu, rompeu: o resto do humor não importa até as pazes.
  const como = rompeu ? 'rompeu com você' : humor ? HUMOR[humor][f ? 'f' : 'm'] : '';
  const tom = rompeu ? 'ruim' : humor ? HUMOR[humor].tom : 'neutro';
  const distancia = longe >= 2 && !convivem(vida, id, en) ? `sem notícias há ${longe} anos` : '';
  return (
    <>
      {(como || distancia) && <p class={`humor ${tom}`}>{[como, distancia].filter(Boolean).join(' · ')}</p>}
      <Opiniao vida={vida} id={id} en={en} />
      <Vontade vida={vida} conteudo={conteudo} en={en} />
      {lembra && <p class="lembranca">Lembra {lembra}.</p>}
      {doi && <p class="lembranca doi">Guarda a mágoa {doi}.</p>}
    </>
  );
}

/** Quantas coisas ainda cabem no ano: cada uma com alguém gasta uma escolha, como no palco. */
function escolhasDoAno(vida: EstadoVida): string {
  const restam = fichasDoAno(vida.idade) - fichasUsadas(vida);
  if (restam <= 0) return 'As escolhas deste ano acabaram: no ano que vem dá para fazer algo com cada um.';
  return restam === 1 ? 'Você ainda tem uma escolha este ano: fazer algo com alguém gasta ela.' : `Você ainda tem ${restam} escolhas este ano: cada coisa com alguém gasta uma.`;
}

/** O que está acontecendo com a pessoa agora, em poucas palavras. */
function situacao(id: string, en: Entidade, c: Conteudo): string[] {
  const f = en.genero === 'f';
  const o = (m: string, fem: string) => (f ? fem : m);
  const itens: string[] = [];
  const traco = c.tracos.get(en.t['traco'] ?? '');
  if (traco) itens.push(f ? traco.nome.f : traco.nome.m);
  const ocupacao = en.t['ocupacao'];
  if (en.q['aposentado']) itens.push(o('aposentado', 'aposentada'));
  else if (en.q['desempregado']) itens.push(o('desempregado', 'desempregada'));
  else if (ocupacao) itens.push(ocupacao);
  if (en.q['doente']) itens.push('doente');
  if (en.q['ausente']) itens.push('ausente');
  if (id === 'avo' && en.q['mora_junto']) itens.push('mora com vocês');
  // O que a pessoa ama: o presente certo, o programa junto.
  if (en.tipo === 'pessoa' && id !== 'eu') {
    const gosto = c.mundo.gostos.find((g) => g.id === gostoDe(en))?.nome;
    if (gosto) itens.push(`ama ${gosto}`);
  }
  return itens;
}

function Barra({ rotulo, valor, cor }: { rotulo: string; valor: number; cor: string }) {
  const v = Math.round(Math.max(0, Math.min(100, valor)));
  return (
    <div class="atributo">
      <div class="rotulo">
        <span>{rotulo}</span>
        <b>{v}</b>
      </div>
      <div class="barra" role="meter" aria-label={rotulo} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} style={{ '--cor': cor, '--v': v / 100 }}>
        <span />
      </div>
    </div>
  );
}

interface Props {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
  /** Fazer algo com uma pessoa: gasta uma ficha do ano, como o verbo (e a folha fecha para a história contar). */
  aoAgir: (verbo: Verbo, escolha: { id: string; ator: string }) => void;
  aoFechar: () => void;
}

/** O que dá para fazer com a pessoa neste ano (as ações de "Em família" com ela), aberto por um botão. */
function Juntos({ vida, conteudo, id, nome, aoAgir }: { vida: EstadoVida; conteudo: Conteudo; id: string; nome: string; aoAgir: Props['aoAgir'] }) {
  const [aberto, setAberto] = useState(false);
  const opcoes = acoesComPessoa(vida, conteudo, id);
  if (opcoes.length === 0) return null;
  return (
    <div class="juntos">
      <button class="botao secundario juntos-abrir" type="button" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        {aberto ? 'Agora não' : `Fazer algo com ${nome}`}
      </button>
      {aberto && (
        <div class="juntos-lista">
          {opcoes.map((o) => (
            <button class="opcao" type="button" key={o.s.id} onClick={() => aoAgir('familia', { id: o.s.id, ator: id })}>
              {o.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Familia({ vida, conteudo, aoOperar, aoAgir, aoFechar }: Props) {

  const eu = vida.entidades['eu']!;
  const tipo = conteudo.mundo.familias.find((f) => f.id === eu.t['familia']);
  const classe = conteudo.mundo.classes[eu.n['classe_origem'] ?? 0];
  const irmaos = eu.n['irmaos'] ?? 0;
  const pessoas = ORDEM.flatMap((id) => {
    const en = vida.entidades[id];
    return en ? [[id, en] as const] : [];
  });

  return (
    <Folha id="titulo-familia" titulo="Família" classe="familia" aoFechar={aoFechar}>
        <p class="meta">
          {capitalizar(descreverOrigem(classe?.nome, tipo?.nome))}
          {irmaos > 0 ? ` · ${irmaos === 1 ? '1 irmão' : `${irmaos} irmãos`}` : ' · filh' + (eu.genero === 'f' ? 'a' : 'o') + ' únic' + (eu.genero === 'f' ? 'a' : 'o')}
          {vida.dinastia ? ` · geração ${vida.dinastia.geracao} da família` : ''}
        </p>
        {vida.vivo && !vida.pendente && <p class="meta escolhas-do-ano">{escolhasDoAno(vida)}</p>}
        <ul class="pessoas">
          {pessoas.map(([id, en]) => {
            const viva = en.vivo !== false;
            const idade = idadeDe(vida, en);
            const itens = situacao(id, en, conteudo);
            const dinheiro = id === 'mae' || id === 'pai' || id === 'avo' ? patrimonioDe(en) : null;
            return (
              <li class={`pessoa${viva ? '' : ' falecida'}`} key={id}>
                <div class="quem">
                  <b>{en.nome}</b>
                  <span>
                    {papelDe(id, en, vida)} · {viva ? anos(idade) : `faleceu aos ${idade}`}
                  </span>
                </div>
                {id !== 'pet' && <Relacao vida={vida} conteudo={conteudo} id={id} en={en} />}
                {viva && itens.length > 0 && <p class="situacao">{itens.join(' · ')}</p>}
                {viva && (
                  <div class="barras">
                    <Barra rotulo="Saúde" valor={en.n['saude'] ?? 0} cor="var(--saude)" />
                    {id !== 'pet' && <Barra rotulo="Vínculo" valor={en.n['vinculo'] ?? 0} cor="var(--vinculo)" />}
                    {id !== 'pet' && <Barra rotulo="Confiança" valor={Number(lerCaminho(vida, `${id}.confianca`) ?? 60)} cor="var(--turquesa)" />}
                    {id !== 'pet' && <Barra rotulo="Mágoa" valor={en.n['magoa'] ?? 0} cor="var(--ruim)" />}
                  </div>
                )}
                {viva && dinheiro !== null && dinheiro >= 1 && <p class="situacao">Guardado: {formatarDinheiro(dinheiro)}</p>}
                {viva && id !== 'pet' && <Juntos vida={vida} conteudo={conteudo} id={id} nome={en.nome} aoAgir={aoAgir} />}
              </li>
            );
          })}
        </ul>
        {vida.vivo && vida.idade >= 18 && <Testamento vida={vida} conteudo={conteudo} aoOperar={aoOperar} />}
        <div class="acoes">
          <button class="botao" type="button" onClick={aoFechar} autoFocus>
            Voltar
          </button>
        </div>
    </Folha>
  );
}
