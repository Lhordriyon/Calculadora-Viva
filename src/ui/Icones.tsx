import type { Atributo, Verbo } from '../motor/constantes.ts';

/** Os traços de cada ícone, num quadrado de 24 (linha de 2, pontas redondas). */
const TRACOS = {
  // indicadores
  saude: 'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z',
  felicidade: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.2 14.2c1 1.4 2.3 2.1 3.8 2.1s2.8-.7 3.8-2.1 M9 9.5h.01 M15 9.5h.01',
  inteligencia:
    'M11 4.5a3 3 0 0 0-5.6 1.2A3.2 3.2 0 0 0 3.7 11a3.4 3.4 0 0 0 2 5.6A3.2 3.2 0 0 0 11 18.5z M13 4.5a3 3 0 0 1 5.6 1.2 3.2 3.2 0 0 1 1.7 5.3 3.4 3.4 0 0 1-2 5.6 3.2 3.2 0 0 1-5.3 1.9z M11 4.5v15 M13 4.5v15 M7.5 9.5c1 0 1.8.6 2.2 1.4 M16.5 9.5c-1 0-1.8.6-2.2 1.4',
  aparencia: 'M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z',
  // dinheiro
  carteira: 'M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7z M4 7l11-3v3 M16 13.5h.01',
  patrimonio: 'M4 20h16 M5 15.5l4.5-4.5 3.5 3.5 6-6 M15 8.5h4v4',
  renda: 'M9.5 3.5h5l-1.3 3h-2.4z M9 7c-3 2.3-5 5.4-5 8.3 0 3.2 2.6 4.7 8 4.7s8-1.5 8-4.7c0-2.9-2-6-5-8.3z M13.8 11.6c-.4-.6-1-.9-1.8-.9-1 0-1.7.5-1.7 1.3 0 1.8 3.6 1 3.6 2.8 0 .8-.8 1.4-1.9 1.4-.9 0-1.6-.4-2-1 M12 9.5v1.2 M12 16.2v1.2',
  // verbos
  estudar: 'M2.5 9.5L12 5l9.5 4.5L12 14z M6.5 11.5v4.3c0 1.4 2.5 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4.3 M21.5 9.5v5',
  trabalhar: 'M3 7.5h18v12H3z M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2 M3 12.5h18',
  cuidar: 'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z M3 12.5h4.5l1.5-2.5 2.5 5 2-3.5h7.5',
  familia: 'M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6 M17 12.1a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z M15.8 14.3c2.9-.4 5.2 1.7 5.2 5.2',
  sair: 'M21 3L3 10.4l7 2.6 2.6 7z M10 13L21 3',
  poupar:
    'M18 10.5c0-3-2.9-5-6.5-5-2 0-3.7.6-4.9 1.6L4.5 6v3.4C3.6 10.3 3 11.5 3 12.8c0 1.9 1.2 3.5 3 4.5V20h3v-1.8h4V20h3v-2.6c1.3-.8 2.2-1.9 2.6-3.1H20v-3.8z M9 5.8l1-2.3h3l1 2.3 M14.5 10.5h.01',
  // o resto
  coroa: 'M3.5 18h17 M4 16L3 7l5 4 4-6 4 6 5-4-1 9z',
  bussola: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 5.5l2 6.5-2 6.5-2-6.5z',
  sobe: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
  desce: 'M3 7l6 6 4-4 8 8 M15 17h6v-6',
  estavel: 'M3 12h18 M15 6l6 6-6 6',
  seta: 'M5 12h14 M13 6l6 6-6 6',
  avancar: 'M3.5 6.5l7.5 5.5-7.5 5.5z M12.5 6.5l7.5 5.5-7.5 5.5z',
  chevron: 'M9.5 6l6 6-6 6',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
} as const;

export type NomeIcone = keyof typeof TRACOS;

/** Os ícones do jogo: traço com a cor do texto (currentColor), escondidos dos leitores de tela. */
export function Icone({ nome, tamanho = 24, classe }: { nome: NomeIcone; tamanho?: number; classe?: string }) {
  return (
    <svg
      class={classe}
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d={TRACOS[nome]} />
    </svg>
  );
}

/** O ícone de cada indicador e de cada verbo. */
export const ICONE_DO_ATRIBUTO: Record<Atributo, NomeIcone> = { saude: 'saude', felicidade: 'felicidade', inteligencia: 'inteligencia', aparencia: 'aparencia' };
export const ICONE_DO_VERBO: Record<Verbo, NomeIcone> = { estudar: 'estudar', trabalhar: 'trabalhar', saude: 'cuidar', familia: 'familia', sair: 'sair', poupar: 'poupar' };
/** A cor de cada verbo (o ícone e a borda do botão). */
export const COR_DO_VERBO: Record<Verbo, string> = {
  estudar: 'var(--inteligencia)',
  trabalhar: 'var(--destaque)',
  saude: 'var(--saude)',
  familia: 'var(--vinculo)',
  sair: 'var(--violeta)',
  poupar: 'var(--turquesa)',
};
