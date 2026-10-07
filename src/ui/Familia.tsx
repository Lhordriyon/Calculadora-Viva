import { useEffect } from 'preact/hooks';
import { motivoParaNaoOperar, type Operacao } from '../motor/carteira.ts';
import type { Destino } from '../motor/herdeiro.ts';
import { idadeDe, patrimonioDe } from '../motor/campos.ts';
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
  const opcoes: { para: Destino; rotulo: string }[] = [
    { para: '', rotulo: 'A lei (filho, senão sobrinho)' },
    { para: 'filho', rotulo: nome('filho') ? `${nome('filho')} (filho)` : 'Filho' },
    { para: 'amor', rotulo: nome('amor') ? `${nome('amor')} (par)` : 'Par' },
    { para: 'amigo', rotulo: nome('amigo') ? `${nome('amigo')} (amizade)` : 'Melhor amigo' },
    { para: 'sobrinho', rotulo: 'Os sobrinhos' },
    { para: 'causa', rotulo: 'Uma causa' },
    { para: 'pet', rotulo: nome('pet') ? `${nome('pet')} (o bicho)` : 'O bicho' },
  ];
  const explica: Record<Destino, string> = {
    '': 'Sem testamento, vale a lei: o filho herda; sem filho, um sobrinho. A história continua com quem herda.',
    filho: 'Tudo para o filho, que continua a história.',
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

/** Ordem do painel: quem veio antes, quem chegou depois. */
const ORDEM = ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho', 'pet'] as const;

function papelDe(id: string, en: Entidade, vida: EstadoVida): string {
  const f = en.genero === 'f';
  switch (id) {
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
    case 'filho':
      return f ? 'Filha' : 'Filho';
    default:
      return 'Bicho';
  }
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
      <div class="barra" role="meter" aria-label={rotulo} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} style={{ '--cor': cor }}>
        <span style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

interface Props {
  vida: EstadoVida;
  conteudo: Conteudo;
  aoOperar: (op: Operacao) => void;
  aoFechar: () => void;
}

export function Familia({ vida, conteudo, aoOperar, aoFechar }: Props) {
  useEffect(() => {
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar();
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aoFechar]);

  const eu = vida.entidades['eu']!;
  const tipo = conteudo.mundo.familias.find((f) => f.id === eu.t['familia']);
  const classe = conteudo.mundo.classes[eu.n['classe_origem'] ?? 0];
  const irmaos = eu.n['irmaos'] ?? 0;
  const pessoas = ORDEM.flatMap((id) => {
    const en = vida.entidades[id];
    return en ? [[id, en] as const] : [];
  });

  return (
    <div class="veu" role="dialog" aria-modal="true" aria-labelledby="titulo-familia" onClick={(e) => e.target === e.currentTarget && aoFechar()}>
      <div class="folha familia">
        <h2 id="titulo-familia">Família</h2>
        <p class="meta">
          {capitalizar(descreverOrigem(classe?.nome, tipo?.nome))}
          {irmaos > 0 ? ` · ${irmaos === 1 ? '1 irmão' : `${irmaos} irmãos`}` : ' · filh' + (eu.genero === 'f' ? 'a' : 'o') + ' únic' + (eu.genero === 'f' ? 'a' : 'o')}
          {vida.dinastia ? ` · geração ${vida.dinastia.geracao} da família` : ''}
        </p>
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
                {viva && itens.length > 0 && <p class="situacao">{itens.join(' · ')}</p>}
                {viva && (
                  <div class="barras">
                    <Barra rotulo="Saúde" valor={en.n['saude'] ?? 0} cor="var(--saude)" />
                    {id !== 'pet' && <Barra rotulo="Vínculo" valor={en.n['vinculo'] ?? 0} cor="var(--vinculo)" />}
                  </div>
                )}
                {viva && dinheiro !== null && dinheiro >= 1 && <p class="situacao">Guardado: {formatarDinheiro(dinheiro)}</p>}
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
      </div>
    </div>
  );
}
