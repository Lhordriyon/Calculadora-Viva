/**
 * npm run validar — confere o conteúdo: esquema Zod, ids únicos, marcas
 * consultadas que algum efeito cria, variáveis válidas, agendamentos e cadeias.
 * Sai com código 1 se houver erro (o CI para aqui).
 */
import { z } from 'zod';
import { lerFontes } from './disco.ts';
import { listarCadeias, validarConteudo } from '../src/motor/validacao.ts';

z.config(z.locales.ptBR());

/** Exigência da fase 1: cadeias marca → evento anos depois. */
const CADEIAS_MINIMAS = 8;
const ANOS_DE_CADEIA = 3;

const { conteudo, problemas } = validarConteudo(lerFontes());
const erros = problemas.filter((p) => p.nivel === 'erro');
const avisos = problemas.filter((p) => p.nivel === 'aviso');

for (const p of erros) console.log(`✗ ${p.onde}: ${p.mensagem}`);
for (const p of avisos) console.log(`! ${p.onde}: ${p.mensagem}`);

if (conteudo) {
  const longas = listarCadeias(conteudo).filter((x) => x.anosMin >= ANOS_DE_CADEIA);
  const pares = new Set(longas.map((x) => `${x.de}→${x.para}`));
  const escolhas = conteudo.storylets.reduce((s, ev) => s + (ev.escolhas?.length ?? 0), 0);
  const marcas = new Set(longas.map((x) => x.via));
  const porTipo = (t: string): number => conteudo.storylets.filter((s) => (s.tipo ?? 'evento') === t).length;
  console.log(
    `\n${porTipo('evento')} eventos · ${porTipo('npc')} de personagens · ${porTipo('acao')} ações · ${escolhas} escolhas · ${conteudo.linhas.length} linhas · ` +
      `${conteudo.mortes.length} causas de morte · ${pares.size} cadeias de ${ANOS_DE_CADEIA}+ anos (${marcas.size} vias)`,
  );
  if (pares.size < CADEIAS_MINIMAS) {
    console.log(`✗ só ${pares.size} cadeias de ${ANOS_DE_CADEIA}+ anos; o mínimo é ${CADEIAS_MINIMAS}`);
    erros.push({ nivel: 'erro', onde: 'cadeias', mensagem: 'poucas cadeias' });
  }
}
console.log(erros.length === 0 ? `✓ conteúdo válido (${avisos.length} avisos)` : `✗ ${erros.length} erros, ${avisos.length} avisos`);
process.exit(erros.length === 0 ? 0 : 1);
