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
  'eu.renda_fixa',
  'eu.acoes',
  'eu.fii',
  'eu.dolar',
  'eu.cripto',
  'eu.divida',
  'eu.privacao',
  'eu.herdou',
  // a dinastia: quem herda começa com a geração, a família que já tinha e o que a vida dela deixou
  'eu.dinastia',
  'eu.independente',
  'eu.formado',
  'eu.namoro',
  'eu.casado',
  'eu.pai_mae',
  'eu.viuvo',
  'pais.inflacao',
  // o mercado do ano (quanto cada classe rendeu) e o perfil que o jogador escolhe
  'pais.ret_renda_fixa',
  'pais.ret_acoes',
  'pais.ret_fii',
  'pais.ret_dolar',
  'pais.ret_cripto',
  'eu.perfil',
  // o padrão de vida que o jogador escolhe na folha Dinheiro
  'eu.padrao',
  // a empresa: a folha Dinheiro abre, aporta, escolhe a retirada e vende; a regra do ano faz ela crescer
  'empresa.setor',
  'empresa.valor',
  'empresa.lucro',
  'empresa.tracao',
  'empresa.participacao',
  'empresa.retirada',
  'empresa.fundada',
  'eu.vendeu_empresa',
  'eu.empreendedor',
  'eu.socio',
  'eu.herdeiro_negocio',
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
export const AGENDADOS_PELO_MOTOR = ['namoro', 'demissao', 'negocio_no_aperto', 'padrao_aperta', 'empresa_quebrou'];

export const LEITURAS_DO_MOTOR: LeituraMotor[] = [
  ...ler(['eu.saude'], 'mortalidade', true),
  ...ler(['eu.felicidade'], 'retorno da felicidade', false),
  ...ler(['eu.dinheiro', 'eu.divida', 'eu.renda', 'eu.custo'], 'economia (sobra, crédito, juros)', true),
  ...ler(['eu.renda_fixa', 'eu.acoes', 'eu.fii', 'eu.dolar', 'eu.cripto'], 'carteira: cada classe rende o mercado do ano', true),
  ...ler(['pais.ret_renda_fixa', 'pais.ret_acoes', 'pais.ret_fii', 'pais.ret_dolar', 'pais.ret_cripto'], 'carteira: o que cada classe rendeu no ano', true),
  ...ler(['eu.perfil'], 'carteira: para onde vai o dinheiro novo', true),
  ...ler(['eu.padrao'], 'economia: quanto da sobra do ano vira gasto', true),
  ...ler(['eu.padrao'], 'felicidade de base', false),
  ...ler(['empresa.valor', 'empresa.tracao', 'empresa.setor', 'empresa.participacao', 'empresa.retirada'], 'empresa: crescimento, retirada, patrimônio e quebra', true),
  ...ler(['empresa.fundada'], 'empresa: a fundação é a causa da quebra', false),
  ...ler(['empresa.sustenta'], 'empresa: fechar ou vender a que sustentava quem joga leva a renda junto', true),
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
