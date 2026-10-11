import { useState } from 'preact/hooks';
import type { TipoFamilia } from '../motor/constantes.ts';
import type { Conteudo } from '../motor/conteudo.ts';
import { cidadesPorRegiao, TALENTOS_DA_CRIACAO, type EscolhaOrigem, type Talento, type Talentos } from '../motor/origem.ts';
import type { Genero } from '../motor/tipos.ts';
import { Marca } from './Marca.tsx';
import { LINK_APK, NO_APP } from './formato.ts';

interface Props {
  conteudo: Conteudo;
  vidas: number;
  aviso: string | undefined;
  aoNascer: (origem?: EscolhaOrigem) => void;
  /** Vindo de "Nova vida": a escolha da origem já aberta. */
  escolherDeInicio?: boolean;
  /** Voltar para a vida que estava em andamento. */
  aoVoltar?: () => void;
}

const REGIOES: Record<string, string> = { norte: 'Norte', nordeste: 'Nordeste', centro_oeste: 'Centro-Oeste', sudeste: 'Sudeste', sul: 'Sul' };
const TALENTOS: { id: Talento; nome: string }[] = [
  { id: 'saude', nome: 'Saúde' },
  { id: 'inteligencia', nome: 'Inteligência' },
  { id: 'aparencia', nome: 'Aparência' },
  { id: 'felicidade', nome: 'Alegria' },
];
const NIVEIS = ['Pouco', 'Médio', 'Muito'];
const MEDIOS: Record<Talento, number> = { saude: 1, inteligencia: 1, aparencia: 1, felicidade: 1 };

/** Uma fileira de chips com "Sortear" (undefined) e as opções. */
function Opcoes<T extends string | number>({ rotulo, valor, opcoes, aoMudar }: { rotulo: string; valor: T | undefined; opcoes: { id: T; nome: string }[]; aoMudar: (v: T | undefined) => void }) {
  return (
    <div class="escolhas-origem" role="group" aria-label={rotulo}>
      <button type="button" class="chip-origem" aria-pressed={valor === undefined} onClick={() => aoMudar(undefined)}>
        Sortear
      </button>
      {opcoes.map((o) => (
        <button type="button" class="chip-origem" key={String(o.id)} aria-pressed={valor === o.id} onClick={() => aoMudar(o.id)}>
          {o.nome}
        </button>
      ))}
    </div>
  );
}

/** Talentos em pontos: quatro médios, ou um "muito" à custa de um "pouco". */
function EscolherTalentos({ talentos, aoMudar }: { talentos: Talentos | undefined; aoMudar: (t: Talentos | undefined) => void }) {
  const usados = talentos ? Object.values(talentos).reduce((s, n) => s + n, 0) : 0;
  const livres = TALENTOS_DA_CRIACAO - usados;
  return (
    <>
      <div class="escolhas-origem" role="group" aria-label="Talentos">
        <button type="button" class="chip-origem" aria-pressed={!talentos} onClick={() => aoMudar(undefined)}>
          Sortear
        </button>
        <button type="button" class="chip-origem" aria-pressed={Boolean(talentos)} onClick={() => aoMudar(talentos ?? { ...MEDIOS })}>
          Escolher
        </button>
      </div>
      {talentos && (
        <div class="talentos">
          <p class="nota-origem">{livres > 0 ? `${livres} ${livres === 1 ? 'ponto livre' : 'pontos livres'}.` : 'Para subir um, baixe outro.'}</p>
          {TALENTOS.map((t) => (
            <div class="talento" key={t.id}>
              <span>{t.nome}</span>
              <div class="escolhas-origem" role="group" aria-label={t.nome}>
                {NIVEIS.map((n, nivel) => {
                  const atual = talentos[t.id] ?? 1;
                  const cabe = nivel <= atual || nivel - atual <= livres;
                  return (
                    <button
                      type="button"
                      class="chip-origem"
                      key={n}
                      aria-pressed={atual === nivel}
                      disabled={!cabe}
                      onClick={() => aoMudar({ ...talentos, [t.id]: nivel })}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/** Um toque para nascer; criar o personagem é opcional e fica recolhido. O que não for escolhido é sorteado. */
export function Abertura({ conteudo, vidas, aviso, aoNascer, escolherDeInicio = false, aoVoltar }: Props) {
  const [escolhendo, setEscolhendo] = useState(escolherDeInicio);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [genero, setGenero] = useState<Genero | undefined>(undefined);
  const [cidade, setCidade] = useState('');
  const [classe, setClasse] = useState<number | undefined>(undefined);
  const [familia, setFamilia] = useState<TipoFamilia | undefined>(undefined);
  const [linhagem, setLinhagem] = useState<string | undefined>(undefined);
  const [irmaos, setIrmaos] = useState<number | undefined>(undefined);
  const [traco, setTraco] = useState<string | undefined>(undefined);
  const [talentos, setTalentos] = useState<Talentos | undefined>(undefined);
  const { classes, familias, linhagens, tracosJogador } = conteudo.mundo;
  const defLinhagem = linhagens.find((l) => l.id === linhagem);
  const f = genero === 'f';

  const escolha = (): EscolhaOrigem => ({
    ...(nome.trim() ? { nome } : {}),
    ...(sobrenome.trim() ? { sobrenome } : {}),
    ...(genero ? { genero } : {}),
    ...(cidade ? { cidade } : {}),
    ...(classe !== undefined ? { classe } : {}),
    ...(familia ? { familia } : {}),
    ...(linhagem ? { linhagem } : {}),
    ...(irmaos !== undefined ? { irmaos } : {}),
    ...(traco ? { traco } : {}),
    ...(talentos ? { talentos } : {}),
  });

  return (
    <main class="abertura">
      <Marca />
      <h1>Trajetória</h1>
      <p>Uma vida inteira em poucos minutos. Você pode tentar quase tudo; o mundo vai reagir.</p>
      {aviso && (
        <p class="aviso-save" role="status">
          {aviso}
        </p>
      )}
      {escolhendo && (
        <section class="origem" aria-label="Criar o personagem">
          <fieldset>
            <legend>Quem</legend>
            <div class="campos-nome">
              <input class="campo" type="text" value={nome} maxLength={24} placeholder="Nome (ou sorteado)" aria-label="Nome" onInput={(ev) => setNome(ev.currentTarget.value)} />
              <input
                class="campo"
                type="text"
                value={sobrenome}
                maxLength={24}
                placeholder="Sobrenome (ou sorteado)"
                aria-label="Sobrenome"
                onInput={(ev) => setSobrenome(ev.currentTarget.value)}
              />
            </div>
            <Opcoes
              rotulo="Gênero"
              valor={genero}
              opcoes={[
                { id: 'f', nome: 'Menina' },
                { id: 'm', nome: 'Menino' },
              ]}
              aoMudar={setGenero}
            />
          </fieldset>
          <fieldset>
            <legend>Cidade</legend>
            <select class="campo" value={cidade} aria-label="Cidade" onChange={(ev) => setCidade(ev.currentTarget.value)}>
              <option value="">Sortear</option>
              {cidadesPorRegiao(conteudo).map((g) => (
                <optgroup label={REGIOES[g.regiao] ?? g.regiao} key={g.regiao}>
                  {g.cidades.map((x) => (
                    <option value={x.nome} key={x.nome}>
                      {x.nome} ({x.uf})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <legend>Linhagem</legend>
            <div class="escolhas-origem">
              <button type="button" class="chip-origem" aria-pressed={linhagem === undefined} onClick={() => setLinhagem(undefined)}>
                Nenhuma
              </button>
              {linhagens.map((l) => (
                <button type="button" class="chip-origem" key={l.id} aria-pressed={linhagem === l.id} onClick={() => setLinhagem(l.id)}>
                  {l.nome.replace(/^família /, '')}
                </button>
              ))}
            </div>
            {defLinhagem && <p class="nota-origem">{defLinhagem.descricao}</p>}
          </fieldset>
          <fieldset disabled={linhagem !== undefined}>
            <legend>Onde nascer</legend>
            <Opcoes rotulo="Classe" valor={classe} opcoes={classes.map((k, i) => ({ id: i, nome: k.nome.replace(/^família /, '') }))} aoMudar={setClasse} />
          </fieldset>
          <fieldset>
            <legend>Que família</legend>
            <Opcoes rotulo="Família" valor={familia} opcoes={familias.map((x) => ({ id: x.id, nome: x.nome.replace(/^família /, '') }))} aoMudar={setFamilia} />
          </fieldset>
          <fieldset>
            <legend>Irmãos</legend>
            <Opcoes rotulo="Irmãos" valor={irmaos} opcoes={[0, 1, 2, 3, 4, 5].map((n) => ({ id: n, nome: n === 0 ? 'Filho único' : String(n) }))} aoMudar={setIrmaos} />
          </fieldset>
          <fieldset>
            <legend>Jeito</legend>
            <Opcoes rotulo="Jeito" valor={traco} opcoes={tracosJogador.map((t) => ({ id: t.id, nome: f ? t.nome.f : t.nome.m }))} aoMudar={setTraco} />
          </fieldset>
          <fieldset>
            <legend>Talentos</legend>
            <EscolherTalentos talentos={talentos} aoMudar={setTalentos} />
          </fieldset>
        </section>
      )}
      <button class="botao grande" type="button" onClick={() => aoNascer(escolhendo ? escolha() : undefined)}>
        {escolhendo ? 'Nascer assim' : vidas > 0 ? 'Nascer de novo' : 'Nascer'}
      </button>
      {!escolhendo && (
        <button class="botao secundario" type="button" onClick={() => setEscolhendo(true)}>
          Criar o personagem
        </button>
      )}
      {escolhendo && (
        <button class="botao secundario" type="button" onClick={() => aoNascer(undefined)}>
          Sortear tudo
        </button>
      )}
      {aoVoltar && (
        <button class="botao secundario" type="button" onClick={aoVoltar}>
          Voltar para a vida atual
        </button>
      )}
      {!NO_APP && !aoVoltar && (
        <a class="botao secundario" href={LINK_APK}>
          Baixar o app para Android
        </a>
      )}
    </main>
  );
}
