/**
 * O que as regras do motor leem e escrevem (o conteúdo declara o resto nos
 * próprios storylets). O validador soma isto aos leitores e escritores do
 * conteúdo para cobrar que todo campo escrito seja lido por pelo menos dois
 * sistemas e mude alguma decisão.
 *
 * Caminhos usam papéis genéricos: "pessoa.x" vale para mãe, pai, avó, amigo,
 * amor, filho, paixão e bicho.
 */
import { PARCEIROS, POLITICAS } from './constantes.ts';

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
  'empresa.dependencia',
  'empresa.fundada',
  'eu.vendeu_empresa',
  'eu.empreendedor',
  'eu.socio',
  'eu.herdeiro_negocio',
  // o trabalho de quem joga (salário anda com o setor e o ciclo)
  'eu.renda',
  // carreira escolhida na folha Carreira: profissão, cargo, fama
  'eu.carreira',
  'eu.nivel',
  'eu.ocupacao',
  'eu.setor',
  'eu.servidor',
  // o fim da carreira (atleta, modelo) larga o emprego, e o salário em dólar vai junto
  'eu.salario_em_dolar',
  'eu.fama',
  // poder: influência, eleições, mandato, popularidade; decretos empurram o país
  'eu.influencia',
  'eu.popularidade',
  'eu.cargo',
  'eu.mandato',
  'eu.politico',
  'eu.ex_politico',
  'pais.impulso',
  // bens: morar no que é seu, alugar; a coroa e o regime passam ao filho
  'eu.casa_propria',
  'eu.senhorio',
  'eu.principe',
  'eu.herdeiro_regime',
  ...de(['mae', 'pai'], 'monarca'),
  ...de(['mae', 'pai'], 'ditador'),
  // o testamento que o jogador escolhe na folha Família
  'eu.testamento',
  // truste: compras de concorrentes
  'empresa.aquisicoes',
  'empresa.truste',
  // o grupo: a concorrente comprada e a empresa absorvida viram subsidiárias; a bolsa; a fusão; quem sustentava passa o sustento;
  // e a empresa que afunda vem para a mesa de quem joga (troca de lugar com as qualidades que o conteúdo deu a ela)
  'empresa.subsidiarias',
  'empresa.na_bolsa',
  'empresa.fundiu',
  'empresa.sustenta',
  'empresa.conselho',
  'empresa.mural',
  'empresa.incubadora',
  // o ano dos bens: o valor anda com o mercado e o financiamento é pago
  'bem.valor',
  'bem.financiado',
  // as dívidas como contratos com o banco (contratos.ts, dividas.ts): o saldo, a parcela, o atraso e o nome sujo
  'ctr.saldo',
  'ctr.parcela',
  'ctr.atraso',
  'ctr.modalidade',
  'ctr.credor',
  'ctr.garantia',
  'ctr.origem',
  'eu.nome_sujo',
  // o país vivo: as estatísticas andam, governos se alternam na eleição e quem governa muda as políticas
  'pais.crescimento',
  'pais.desemprego',
  'pais.juros',
  'pais.divida',
  'pais.pobreza',
  'pais.violencia',
  'pais.saude',
  'pais.educacao',
  'pais.aprovacao',
  'pais.governo',
  ...POLITICAS.map((p) => `pais.pol_${p}`),
  // o mundo lá fora: a economia e a relação de cada país, as crises de lá, as sanções e os acordos, e o dólar
  ...de(PARCEIROS, 'crescimento'),
  ...de(PARCEIROS, 'relacao'),
  ...de(PARCEIROS, 'crise'),
  ...de(PARCEIROS, 'sancao'),
  ...de(PARCEIROS, 'acordo'),
  'pais.cambio',
  // o ciclo econômico (fora do normal, a fase é uma qualidade do país, o nome do crescimento)
  'pais.expansao',
  'pais.recessao',
  'pais.crise',
  // origem
  'eu.classe_origem',
  'eu.irmaos',
  'eu.familia',
  'eu.traco',
  'eu.negocio_familiar',
  'eu.prematuro',
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
  // O dinheiro dos pais e da avó anda todo ano; o de qualquer pessoa vai para os herdeiros quando ela morre.
  ...de(PESSOAS, 'dinheiro'),
  ...de(PAIS_E_AVO, 'renda'),
  ...de(DOENTES, 'doente'),
  ...de(['mae', 'pai'], 'desempregado'),
  ...de(['mae', 'pai'], 'aposentado'),
];

const ler = (caminhos: string[], regra: string, decide: boolean): LeituraMotor[] => caminhos.map((caminho) => ({ caminho, regra, decide }));

/** Quem joga vota (qualidade voto_<bloco>, da eleição do ano): o motor pesa o voto no resultado. */
export const VOTOS = (governos: readonly { id: string; eleito: boolean }[]): string[] => governos.filter((g) => g.eleito).map((g) => `eu.voto_${g.id}`);

/** Storylets que as regras do motor agendam (o amor que aparece, a demissão, o negócio e o padrão de vida no aperto). */
export const AGENDADOS_PELO_MOTOR = ['namoro', 'demissao', 'negocio_no_aperto', 'padrao_aperta', 'empresa_quebrou', 'queda_do_cargo', 'nome_sujo'];

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
  ...ler(['empresa.dependencia'], 'empresa: o talento de quem manda pesa na tração, a morte de quem manda custa valor e quem compra desconta', true),
  ...ler(['empresa.sustenta'], 'empresa: fechar ou vender a que sustentava quem joga leva a renda junto', true),
  ...ler(['eu.testamento_solidario'], 'dinastia: um quarto do espólio vai para a causa do testamento', true),
  ...ler(['eu.influencia'], 'poder: chance de ganhar eleição e influência mínima para concorrer', true),
  ...ler(['eu.influencia'], 'empresa: influência abre portas (tração)', true),
  ...ler(['eu.fama'], 'poder: a fama vira influência', true),
  ...ler(['eu.popularidade'], 'poder: a imagem pesa em toda eleição e começa o mandato; baixa, derruba o cargo', true),
  ...ler(['eu.cargo', 'eu.mandato'], 'poder: salário, fim do mandato e reeleição', true),
  ...ler(['eu.carreira', 'eu.nivel'], 'carreira: cargo, promoção, salário e fama', true),
  ...ler(['pais.impulso'], 'país: o decreto empurra o crescimento, a inflação e a dívida', true),
  ...ler(['pais.crescimento'], 'país: a fase do ciclo, salários, empresas, desemprego, inflação e aprovação', true),
  ...ler(['pais.desemprego'], 'país: demissão e recolocação, vaga, pobreza e aprovação', true),
  ...ler(['pais.juros'], 'país: juros da dívida de quem joga, renda fixa e crescimento', true),
  ...ler(['pais.divida'], 'país: crescimento, juros, inflação e chance de crise lá fora', true),
  ...ler(['pais.pobreza'], 'país: violência e o desejo do eleitor', true),
  ...ler(['pais.violencia'], 'país: chance de morrer de violência, crescimento e aprovação', true),
  ...ler(['pais.saude'], 'país: mortalidade de quem depende do SUS e aprovação', true),
  ...ler(['pais.educacao'], 'país: inteligência de quem estuda na escola pública, desemprego e crescimento', true),
  ...ler(['pais.aprovacao'], 'país: reeleição do governo', true),
  ...ler(['pais.governo'], 'país: quem governa adota as políticas; eleição e transição', true),
  ...ler(
    POLITICAS.map((p) => `pais.pol_${p}`),
    'país: as políticas puxam as estatísticas, o imposto e o auxílio de quem joga',
    true,
  ),
  ...ler(['pais.regime'], 'país: sob o regime, não há eleição', true),
  ...ler(de(PARCEIROS, 'crescimento'), 'mundo lá fora: o que o Brasil vende para lá e a economia de lá no ano seguinte', true),
  ...ler(de(PARCEIROS, 'relacao'), 'mundo lá fora: relação ruim vira sanção, boa vira acordo', true),
  ...ler(de(PARCEIROS, 'sancao'), 'mundo lá fora: a sanção tira crescimento, sobe o dólar e pesa nas empresas de quem vendia para lá', true),
  ...ler(de(PARCEIROS, 'acordo'), 'mundo lá fora: o acordo soma crescimento e ajuda as empresas de quem vende para lá', true),
  ...ler(de(PARCEIROS, 'crise'), 'mundo lá fora: a crise de lá acaba quando a economia deles volta a crescer', false),
  ...ler(['pais.cambio'], 'dólar: a inflação, o investimento em dólar e as empresas que exportam ou importam', true),
  ...ler(['eu.salario_em_dolar'], 'trabalho: o salário em dólar anda com o dólar, e a crise daqui não demite', true),
  ...ler(['eu.classe_origem'], 'escola pública: quem estuda nela sente a educação do país', true),
  ...ler(['empresa.aquisicoes'], 'empresa: três compras fazem um truste', true),
  ...ler(['empresa.subsidiarias'], 'grupo: vender subsidiárias dá dinheiro sem largar a empresa; o conglomerado dá influência', true),
  ...ler(['empresa.na_bolsa'], 'grupo: na bolsa, o valor anda com o humor do mercado e quem compra não desconta a dependência', true),
  ...ler(['eu.principe', 'eu.herdeiro_regime', 'eu.filho_de_politico'], 'poder: a linhagem dá influência', false),
  ...ler(['eu.lei_da_heranca'], 'herança: a lei comprada baixa o imposto de 4% para 1%', true),
  ...ler(['eu.monarca', 'eu.ditador'], 'dinastia: a coroa e o regime passam ao filho', true),
  ...ler(['eu.testamento'], 'dinastia: quem herda e continua a história', true),
  ...ler(['eu.politico', 'eu.monarca', 'eu.ditador'], 'poder: a posse é a causa da queda', false),
  ...ler(['eu.ocupacao'], 'carreira: quem tem ocupação pode pedir demissão', true),
  ...ler(['eu.traco'], 'felicidade de base', false),
  ...ler(['eu.familia'], 'equilíbrio do vínculo', false),
  ...ler(['eu.classe_origem'], 'renda e poupança da família', false),
  ...ler(['eu.irmaos'], 'divisão da herança', true),
  ...ler(['eu.mora_com_pais'], 'distância da família', false),
  ...ler(['pais.inflacao'], 'economia: o dinheiro parado encolhe; país: juros e aprovação', true),
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
  ...ler(['eu.nome_sujo'], 'dívida: com o nome sujo, o banco não empresta mais nem financia', true),
  ...ler(['pai.ausente'], 'herança, vínculo e felicidade de base', true),
  ...ler(['avo.mora_junto'], 'distância da família', false),
  ...ler(de(TODOS, 'faleceu'), 'cartão da vida', false),
];
