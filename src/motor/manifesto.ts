/**
 * O que as regras do motor leem e escrevem (o conteúdo declara o resto nos
 * próprios storylets). O validador soma isto aos leitores e escritores do
 * conteúdo para cobrar que todo campo escrito seja lido por pelo menos dois
 * sistemas e mude alguma decisão.
 *
 * Caminhos usam papéis genéricos: "pessoa.x" vale para mãe, pai, avó, amigo,
 * amor, filho, paixão e bicho.
 */

export interface LeituraMotor {
  caminho: string;
  /** Regra que lê. */
  regra: string;
  /** A leitura decide algo (quem age, o que acontece, quanto custa), não só desenha a tela. */
  decide: boolean;
}

const de = (papeis: readonly string[], campo: string): string[] => papeis.map((p) => `${p}.${campo}`);
const PAIS_E_AVO = ['mae', 'pai', 'avo'] as const;
const DOENTES = ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho'] as const;
const TODOS = ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho', 'pet'] as const;
/** O bicho não tem vínculo: a alegria dele já está na qualidade de ter um. */
const PESSOAS = ['mae', 'pai', 'avo', 'amigo', 'amor', 'filho'] as const;

export const ESCRITAS_DO_MOTOR: string[] = [
  // economia e idade de quem joga
  'eu.saude',
  'eu.felicidade',
  'eu.inteligencia',
  'eu.aparencia',
  'eu.dinheiro',
  'eu.investido',
  'eu.divida',
  'eu.privacao',
  'eu.herdou',
  'eu.viuvo',
  'pais.inflacao',
  // o trabalho de quem joga (salário anda com o setor e o ciclo)
  'eu.renda',
  // o ciclo econômico (fora do normal, a fase é uma qualidade do país)
  'pais.expansao',
  'pais.recessao',
  'pais.crise',
  // origem
  'eu.classe_origem',
  'eu.irmaos',
  'eu.familia',
  'eu.traco',
  'eu.negocio_familiar',
  ...de(PESSOAS, 'traco'),
  ...de(['mae', 'pai'], 'ocupacao'),
  ...de(['mae', 'pai'], 'setor'),
  ...de(['mae', 'pai'], 'dono_do_negocio'),
  'pai.ausente',
  'avo.mora_junto',
  'lugar.desemprego',
  'lugar.custo_vida',
  'lugar.regiao',
  // regras anuais dos personagens
  ...de(TODOS, 'saude'),
  ...de(PESSOAS, 'vinculo'),
  ...de(TODOS, 'faleceu'),
  ...de(PAIS_E_AVO, 'dinheiro'),
  ...de(PAIS_E_AVO, 'renda'),
  ...de(DOENTES, 'doente'),
  ...de(['mae', 'pai'], 'desempregado'),
  ...de(['mae', 'pai'], 'aposentado'),
];

const ler = (caminhos: string[], regra: string, decide: boolean): LeituraMotor[] => caminhos.map((caminho) => ({ caminho, regra, decide }));

/** Storylets que as regras do motor agendam (o amor que aparece, a demissão, o negócio e o padrão de vida no aperto). */
export const AGENDADOS_PELO_MOTOR = ['namoro', 'demissao', 'negocio_no_aperto', 'padrao_aperta'];

export const LEITURAS_DO_MOTOR: LeituraMotor[] = [
  ...ler(['eu.saude'], 'mortalidade', true),
  ...ler(['eu.felicidade'], 'retorno da felicidade', false),
  ...ler(['eu.dinheiro', 'eu.investido', 'eu.divida', 'eu.renda', 'eu.custo'], 'economia (sobra, crédito, juros)', true),
  ...ler(['eu.traco'], 'felicidade de base', false),
  ...ler(['eu.familia'], 'equilíbrio do vínculo', false),
  ...ler(['eu.classe_origem'], 'renda e poupança da família', false),
  ...ler(['eu.irmaos'], 'divisão da herança', true),
  ...ler(['eu.mora_com_pais'], 'distância da família', false),
  ...ler(['pais.inflacao'], 'economia', false),
  ...ler(['pais.expansao', 'pais.recessao', 'pais.crise'], 'ciclo: inflação, rendimento, demissões e salários', true),
  ...ler(['lugar.desemprego'], 'demissão e recolocação dos pais', true),
  ...ler(['lugar.custo_vida'], 'custo mínimo de vida', true),
  ...ler(de(TODOS, 'saude'), 'mortalidade dos personagens', true),
  ...ler(de(PESSOAS, 'vinculo'), 'luto e felicidade de base', false),
  ...ler(de(PESSOAS, 'traco'), 'iniciativas dos personagens (afinidade) e vínculo', true),
  ...ler(['eu.paquera', 'eu.aparencia', 'eu.traco'], 'chance de alguém aparecer', true),
  ...ler(de(PAIS_E_AVO, 'renda'), 'poupança dos personagens', false),
  ...ler(de(TODOS, 'dinheiro'), 'herança', false),
  ...ler(de(DOENTES, 'doente'), 'saúde dos personagens', true),
  ...ler(de(['mae', 'pai'], 'desempregado'), 'recolocação', true),
  ...ler(de(['mae', 'pai'], 'aposentado'), 'aposentadoria', true),
  ...ler(de(['mae', 'pai'], 'dono_do_negocio'), 'demissão (dono não é demitido)', true),
  ...ler(de(['mae', 'pai'], 'setor'), 'demissão dos pais (o setor sente o ciclo)', true),
  ...ler(['eu.setor', 'eu.servidor', 'eu.empreendedor', 'eu.socio', 'eu.herdeiro_negocio', 'eu.aposentado'], 'trabalho: salário, demissão e aperto do negócio', true),
  ...ler(['eu.padrao_alto'], 'padrão de vida: a conta chega quando a reserva acaba', true),
  ...ler(['pai.ausente'], 'herança, vínculo e felicidade de base', true),
  ...ler(['avo.mora_junto'], 'distância da família', false),
  ...ler(de(TODOS, 'faleceu'), 'cartão da vida', false),
];
