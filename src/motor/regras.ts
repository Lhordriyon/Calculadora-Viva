/**
 * Números de equilíbrio do motor. Mudou algo aqui, rode `npm run tunel`
 * e registre o antes/depois em docs/decisoes.md.
 */
import type { Padrao } from './constantes.ts';

/**
 * Chance de um ano trazer evento (se houver evento elegível), por idade. A
 * vida adulta é a mais cheia: é onde se escolhe trabalho, amor, filhos,
 * empresa e dinheiro, e um ano vazio ali é um ano que o jogador não viveu.
 */
export function ritmo(idade: number): number {
  // A primeira infância decide muito (quem cuida, o que se come, a vacina, as histórias): ano vazio ali é decisão perdida.
  if (idade <= 4) return 0.75;
  if (idade <= 12) return 0.55;
  if (idade <= 29) return 0.85;
  if (idade <= 49) return 0.78;
  if (idade <= 64) return 0.68;
  return 0.52;
}

/**
 * Fichas do ano: quantas coisas quem joga faz antes de o ano passar. Criança,
 * uma; adolescente, duas; adulto, três; depois dos 65, duas. Cada ficha é uma
 * ação escolhida (a mesma ação não se repete no mesmo ano). Mexer no
 * dinheiro, comprar, trocar de emprego e se candidatar não gastam ficha.
 */
export function fichasDoAno(idade: number): number {
  if (idade <= 12) return 1;
  if (idade <= 17 || idade >= 65) return 2;
  return 3;
}

/** Bens: o que morar no próprio imóvel tira do custo de vida (fração do custo, no máximo esta fração do valor por ano). */
export const ECONOMIA_DA_MORADIA = 0.3;
export const ALUGUEL_DA_MORADIA = 0.045;
/** Financiamento de imóvel: entrada, juros reais ao ano e parcela (fração do saldo inicial por ano). */
export const ENTRADA_FINANCIAMENTO = 0.2;
export const JUROS_FINANCIAMENTO = 0.07;
export const PARCELA_FINANCIAMENTO = 0.1;
/** Corretagem e impostos na venda de imóvel. */
export const CUSTO_VENDA_IMOVEL = 0.06;
/** O carro não vale menos que isto do preço (vira carro velho, não pó). */
export const PISO_VEICULO = 0.12;

/** Poder: quanto a influência anda por ano na direção do alvo, e a popularidade de quem governa. */
export const RITMO_INFLUENCIA = 0.25;
export const RITMO_POPULARIDADE = 0.2;
export const POPULARIDADE_CRITICA = 30;
/** Influência alvo: 3 + 6 × log10(patrimônio / R$ 50 mil), mais cargo, fama, bens e linhagem. */
export function influenciaDoPatrimonio(p: number): number {
  return Math.max(0, 3 + 6 * Math.log10(Math.max(1, p / 50000)));
}
/** Começo em um toque: chance de nascer numa linhagem (coroa, regime, gente famosa…). */
export const CHANCE_LINHAGEM = 0.2;
/** Quanto do conforto dos bens (casa, carro, iate) vira felicidade de base. */
export const PESO_CONFORTO_BENS = 0.6;
/** Carreira: a chance de subir de cargo cai a cada degrau (multiplica por isto a cada nível); no palco, cai mais. */
export const PIRAMIDE = 0.8;
export const PIRAMIDE_DA_FAMA = 0.45;
/** Truste: quanto custa comprar uma concorrente (fração do valor da empresa) e quantas compras fazem um truste. */
export const CUSTO_AQUISICAO = 0.3;
export const AQUISICOES_TRUSTE = 3;

/** Risco anual de morte natural: curva de Gompertz ajustada pela saúde. */
export function riscoDeMorte(idade: number, saude: number): number {
  if (saude <= 0) return 1;
  const base = idade < 15 ? 0.0002 : 0.00003 * Math.exp(0.09 * idade);
  const fatorSaude = Math.exp((60 - saude) / 15);
  return Math.min(1, base * fatorSaude);
}

/** Idade-limite: ninguém passa disso. */
export const IDADE_MAXIMA = 120;

/** Deriva anual da saúde só pela idade (antes de ruído, marcas e eventos). */
export function derivaSaude(idade: number, saude: number): number {
  if (idade < 25) return (85 - saude) * 0.15;
  if (idade < 45) return -0.4;
  if (idade < 60) return -0.9;
  if (idade < 75) return -1.4;
  return -2.2;
}

/** A felicidade volta devagar para a linha de base: ninguém vive de pico. */
export const FELICIDADE_BASE = 60;
export const RETORNO_FELICIDADE = 0.12;

export function derivaInteligencia(idade: number): number {
  if (idade >= 4 && idade <= 21) return 1.2;
  if (idade < 60) return 0.1;
  if (idade < 75) return -0.4;
  return -0.8;
}

export function derivaAparencia(idade: number): number {
  if (idade < 30) return 0;
  if (idade < 60) return -0.35;
  return -0.6;
}

/** Juros nominais anuais da dívida (cartão, cheque especial) com a Selic em JUROS_MEDIOS; andam junto com ela. */
export const JUROS_DIVIDA = 0.22;

/**
 * Da sobra de cada ano (renda menos custo-base), quanto vira gasto, pelo
 * padrão de vida que o jogador escolhe. Quem vive simples guarda quase dois
 * terços; quem vive no luxo gasta quase tudo, e é mais feliz por isso
 * (FELICIDADE_DO_PADRAO).
 */
export const GASTO_DA_SOBRA: Record<Padrao, number> = { simples: 0.35, confortavel: 0.75, luxo: 0.95 };
/** Quanto o padrão de vida muda o ponto para onde a felicidade volta todo ano. */
export const FELICIDADE_DO_PADRAO: Record<Padrao, number> = { simples: -3, confortavel: 0, luxo: 3 };
/**
 * Quem tem patrimônio gasta parte dele por ano, pelo padrão de vida (a casa
 * maior, as viagens, o motorista): nada para quem vive simples, 2% no
 * confortável, 4% no luxo, só sobre o que passa de R$ 500 mil (fora a
 * empresa, que não paga conta). É o que faz uma fortuna encolher na mão de
 * quem só gasta, e o que separa a dinastia que dura da que acaba.
 */
export const GASTO_DO_PATRIMONIO: Record<Padrao, number> = { simples: 0, confortavel: 0.02, luxo: 0.04 };
export const PATRIMONIO_SEM_GASTO = 500_000;
/** Baixar o padrão dói na hora (o carro menor, o clube que ficou para trás). */
export const CORTE_DE_PADRAO_FELICIDADE = 3;
/** Quem está devendo aperta o cinto: gasta no máximo isto da sobra e paga a dívida. */
export const PROPENSAO_GASTO_ENDIVIDADO = 0.4;

/** Limite de crédito: o banco empresta (e cobra juros) até tantas rendas anuais, com um mínimo. */
export const LIMITE_CREDITO_MINIMO = 30000;
export const LIMITE_CREDITO_RENDAS = 2;

/** Felicidade perdida num ano de privação (o déficit não coube no crédito). */
export const PRIVACAO_FELICIDADE = 2;

/** Renda mínima de bicos e auxílios (reais de hoje por ano). */
export function pisoRenda(idade: number): number {
  if (idade < 18) return 0;
  if (idade < 65) return 9000;
  return 18000;
}

/**
 * Depois da aposentadoria, a velhice consome uma parte do patrimônio por ano
 * (remédio, plano de saúde, ajuda aos filhos): quem vive mais não acumula
 * para sempre. A parte é de 4% até R$ 2 milhões e de 1% do que passa disso:
 * remédio não custa proporcionalmente mais para quem tem uma fortuna, e uma
 * fortuna não pode derreter só porque o dono envelheceu.
 */
export const GASTO_VELHICE = 0.04;
export const GASTO_VELHICE_ACIMA = 0.01;
export const TETO_GASTO_VELHICE = 2_000_000;
export const IDADE_GASTO_VELHICE = 65;

export function gastoDaVelhice(patrimonio: number): number {
  if (patrimonio <= 0) return 0;
  return GASTO_VELHICE * Math.min(patrimonio, TETO_GASTO_VELHICE) + GASTO_VELHICE_ACIMA * Math.max(0, patrimonio - TETO_GASTO_VELHICE);
}

/** Custo mínimo de vida de um adulto (reais de hoje por ano). */
export function pisoCusto(idade: number): number {
  return idade < 18 ? 0 : 10000;
}

/** Dívida que começa a tirar o sono (reais de hoje). */
export function dividaPesada(renda: number): number {
  return Math.max(10000, renda * 0.5);
}

/** Patrimônio que dá um pouco de paz (reais de hoje), e quanta paz por ano. */
export const PATRIMONIO_CONFORTO = 200000;
export const CONFORTO_FELICIDADE = 0.5;

// ---------------------------------------------------------------- personagens

/** Chance anual de um personagem adoecer (antes do traço). */
export function chanceDoenca(idade: number): number {
  if (idade < 40) return 0.008;
  if (idade < 60) return 0.025;
  if (idade < 75) return 0.05;
  return 0.09;
}
/** Saúde perdida ao adoecer e por ano enquanto doente. */
export const DOENCA_QUEDA = 14;
export const DOENCA_POR_ANO = 2.5;
export const CHANCE_CURA = 0.35;
/** Chance anual de demissão com o desemprego do lugar em 8% (personagens). */
export const DEMISSAO_BASE = 0.04;
/** Chance anual de quem joga ser demitido, no normal, num setor médio, com desemprego de 8%. */
export const DEMISSAO_JOGADOR = 0.025;
/** Negócio próprio: desvio-padrão do faturamento no ano e chance de aperto por ponto de piora do ciclo. */
export const VARIACAO_NEGOCIO = 0.05;
export const CHANCE_APERTO_NEGOCIO = 0.25;
export const RECOLOCACAO = 0.38;
export const IDADE_APOSENTADORIA = 65;
/** O padrão de vida aperta quando a reserva cobre menos que estes anos de déficit. */
export const ANOS_DE_RESERVA = 5;
/** Chance anual de o negócio de um personagem quebrar, por ponto de piora do ciclo (vezes quanto o setor sente). */
export const CHANCE_FALENCIA = 0.08;
/** O vínculo volta devagar para o ponto de equilíbrio da família. */
export const RETORNO_VINCULO = 0.06;
/** Vínculo perdido por ano depois dos 20 de quem joga, sem contato (amigos perdem mais). */
export const DISTANCIA_ADULTO = 1.2;
/** Filho adulto cria a própria vida: fração da distância de quem joga que ele perde por ano. */
export const DISTANCIA_FILHO = 1.2;
/** Vínculo do casal que a rotina gasta por ano, sem cuidado. */
export const DESGASTE_CASAL = 1.4;
/** Chance anual de alguém aparecer na vida de quem está sem namoro (antes de paquera, aparência e traço). */
export function chanceDeAmor(idade: number): number {
  if (idade < 16) return 0;
  if (idade < 18) return 0.06;
  if (idade < 30) return 0.18;
  if (idade < 45) return 0.12;
  if (idade < 60) return 0.07;
  return 0.035;
}
/** Cada ponto de paquera (sair, conhecer gente) aumenta a chance em tanto, até 3 pontos. */
export const PAQUERA_AMOR = 0.6;
/** Namoro que dura isso (anos) já é união: a morte de quem você ama deixa você viúv{o|a}. */
export const ANOS_UNIAO = 5;

/** Chance anual de um personagem tomar uma iniciativa (quando há storylet para isso). */
export const ATIVIDADE_PERSONAGEM = 0.22;
/** Quanto o vínculo médio com quem está perto puxa a felicidade de base (por ponto acima de 50). */
export const PESO_VINCULO_FELICIDADE = 0.09;
/** Acima disso, mais vínculo não traz mais felicidade de base (retorno decrescente). */
export const TETO_VINCULO_FELICIDADE = 78;

// ---------------------------------------------------------------- empresa

/** Abaixo deste valor, a empresa de quem joga quebra. */
export const PISO_EMPRESA = 5000;
/** O menor capital para abrir uma empresa pela folha Dinheiro (um MEI com o básico). */
export const CAPITAL_MINIMO_EMPRESA = 5000;
/** Por ano, a tração volta este tanto para a do setor (o resto fica: crescer vira hábito, encolher também). */
export const REVERSAO_TRACAO = 0.15;
/** Sorte e azar na tração de um ano, em pontos percentuais. */
export const DESVIO_TRACAO = 4;
/** Cada década de valor acima disto tira tantos pontos da tração para onde a empresa volta: gigante cresce devagar. */
export const PORTE_GRANDE = 1e7;
export const PENALIDADE_PORTE = 3;
/** Inteligência acima de 50 soma à tração para onde a empresa volta (cada 10 pontos, 1 ponto percentual). */
export const TALENTO_TRACAO = 0.1;
/** O pior ano possível: a empresa perde no máximo isto do valor. */
export const PIOR_ANO_EMPRESA = -0.95;

/**
 * Quanto o valor de uma empresa balança num ano (desvio-padrão), pelo
 * tamanho: 30% para uma de R$ 50 mil, 25% com R$ 5 milhões, 20% com
 * R$ 500 milhões, 12% no mínimo. O setor multiplica (DefSetor.risco).
 */
export function volatilidadeDaEmpresa(valor: number): number {
  const ordem = Math.log10(Math.max(1e4, valor));
  return Math.max(0.12, 0.32 - 0.025 * (ordem - 4));
}

/** Vender uma empresa na fase do país: na crise só sai com desconto; na economia aquecida, com prêmio. */
export function precoDeVenda(faseEmpresa: number): number {
  return Math.max(0.5, 1 + 2 * faseEmpresa);
}

// ---- o tamanho do mundo (auditoria de 11/10: sem isto, a empresa e a fortuna cresciam sem fim)

/** O tamanho do mercado: nenhuma empresa passa disso (é o valor das maiores do mundo); perto do teto, crescer fica difícil. */
export const TETO_EMPRESA = 2e13;
/** Quanto o mercado comporta de dinheiro investido de uma só pessoa: o excedente fica parado (nem rende, nem perde). */
export const CAPACIDADE_DO_MERCADO = 5e12;
/** Gente que uma empresa consegue empregar no máximo (as maiores do mundo empregam uns 3 milhões). */
export const MAX_FUNCIONARIOS = 3e6;
/** Valor da empresa por pessoa empregada, enquanto ela é pequena. */
export const VALOR_POR_FUNCIONARIO = 150000;

// ---- quem manda na empresa (incremento 6: a empresa que depende de quem manda nela)

/** Quanto uma empresa nova depende de quem a abriu (0 a 100); com sócios, só a parte de quem joga. */
export const DEPENDENCIA_INICIAL = 80;
/** Quanto do talento de quem manda ainda pesa na tração de uma empresa que não depende de ninguém; o resto pesa na proporção da dependência. */
export const TALENTO_MINIMO = 0.25;
/** Pontos de tração que a equipe dá sozinha a uma empresa que anda sem o dono (proporcional ao quanto ela anda sozinha). */
export const TRACAO_DA_EQUIPE = 1;
/** Fração do valor que a empresa perde na morte de quem manda, vezes a dependência (a 80, perde 32%). */
export const PERDA_SEM_DONO = 0.4;
/** Desconto que o comprador dá pela dependência, vezes ela (a 80, paga 20% menos). */
export const DESCONTO_DA_DEPENDENCIA = 0.25;
/**
 * O freio do tamanho pesa mais na empresa que depende do dono (a mesa dele tem tamanho) e menos na que anda
 * sozinha: o freio vezes 1 + GARGALO_DO_DONO × (dependência − 0,5). Com dependência de 50%, é o freio de sempre.
 */
export const GARGALO_DO_DONO = 0.8;

// ---- o país vivo (incremento 8: estatísticas que andam, governos que se alternam, políticas que mudam a vida)

/** O crescimento (% do PIB ao ano) para onde a economia volta, com as políticas médias e as contas em ordem. */
export const CRESCIMENTO_POTENCIAL = 2;
/** Quanto do desvio do crescimento fica para o ano seguinte, e a sorte do ano (pontos percentuais). */
export const PERSISTENCIA_DO_CRESCIMENTO = 0.8;
export const DESVIO_DO_CRESCIMENTO = 1.15;
/** A fase do ciclo é o nome do crescimento: a partir de quanto é expansão, normal e recessão (abaixo, crise). */
export const LIMITES_DAS_FASES = { expansao: 4, normal: -0.5, recessao: -2.5 } as const;
/** Para sair de uma fase, o crescimento precisa passar do limite com esta folga (sem ela, o país trocava de fase a cada ano). */
export const FOLGA_DAS_FASES = { expansao: 1, recessao: 0.5, crise: 0.5 } as const;
/** Choques de fora, por ano: a crise lá fora (tira crescimento e põe inflação) e a alta das commodities. */
export const CHANCE_CRISE_DE_FORA = 0.05;
export const CHOQUE_DA_CRISE = -3;
export const INFLACAO_DA_CRISE = 2.5;
export const CHANCE_BOOM = 0.03;
export const CHOQUE_DO_BOOM = 2;
/** Desemprego (%) com a economia no potencial; a inflação que o Banco Central persegue; o juro real neutro. */
export const DESEMPREGO_NATURAL = 8.5;
export const META_DE_INFLACAO = 4.5;
export const JURO_REAL_NEUTRO = 4;
/** A Selic média (%) do modelo: com ela, a dívida de quem joga paga JUROS_DIVIDA. */
export const JUROS_MEDIOS = 9.2;
/** A dívida pública (% do PIB) para onde as contas puxam: acima dela, o mercado cobra e quem governa corta. */
export const DIVIDA_DE_EQUILIBRIO = 75;
export const REACAO_FISCAL = 0.05;
/** No ano da eleição, o governo abre os cofres (empurrão na economia). */
export const IMPULSO_ELEITORAL = 0.5;
/** Quanto do empurrão de quem governa (pais.impulso) sobra no ano seguinte. */
export const MEMORIA_DO_IMPULSO = 0.5;
/** Chance de o governo ser reconduzido: a aprovação (0 a 1) mais isto, entre os limites. */
export const VANTAGEM_DE_QUEM_GOVERNA = 0.05;
export const LIMITES_DA_RECONDUCAO = [0.15, 0.85] as const;
/** Peso do voto de quem joga (com amigos e família que vão atrás): o mínimo, mais a influência dividida por isto. */
export const PESO_DO_VOTO = 0.04;
export const INFLUENCIA_POR_VOTO = 250;
/** Renda anual abaixo da qual a pessoa é pobre: não paga o imposto de renda e recebe o auxílio. */
export const LINHA_DA_POBREZA = 24000;
/** A saúde pública pesa na mortalidade de quem depende dela (classe até 4): (50 − índice) / isto. */
export const PESO_DA_SAUDE_PUBLICA = 120;
/** Homicídios por 100 mil, vezes o perfil de idade e gênero, é a chance anual de morrer de violência. */
export const PERFIL_DA_VIOLENCIA: readonly [number, number, number][] = [
  [15, 24, 2],
  [25, 34, 1.5],
  [35, 44, 0.9],
  [45, 59, 0.45],
];
export const VIOLENCIA_POR_GENERO = { m: 1.5, f: 0.3 } as const;
/** Quem é rico (classe 5 ou mais) tem carro blindado e condomínio: a violência pesa isto. */
export const VIOLENCIA_DOS_RICOS = 0.4;
/** A escola pública (classe de origem até 3) soma à inteligência, dos 6 aos 17, (índice − 50) / isto por ano. */
export const PESO_DA_ESCOLA_PUBLICA = 40;
