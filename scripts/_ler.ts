import { carregarConteudo } from './disco.ts';
import { nascer, contexto } from '../src/motor/vida.ts';
import { renderizar } from '../src/motor/texto.ts';
const c = carregarConteudo();
const genero = (process.argv[2] ?? 'f') as 'f' | 'm';
let e = nascer(c, { semente: 3, ano: 2026 });
for (let s = 4; e.pessoa.genero !== genero; s++) e = nascer(c, { semente: s, ano: 2026 });
e.personagens.amor = { nome: 'Rafa', genero: 'm' };
e.personagens.filho = { nome: 'Lia', genero: 'f' };
e.personagens.paixao = { nome: 'Duda', genero: 'f' };
e.personagens.pet = { nome: 'Paçoca', genero: 'f' };
e.idade = 30;
const arquivo = process.argv[3];
for (const ev of c.eventos) {
  if (arquivo && !c.arquivoDe.get(ev.id)?.includes(arquivo)) continue;
  const ctx = contexto(e, ev.valores);
  console.log(`\n## ${ev.id}  [${ev.idade?.join('–') ?? 'agendado'}]  resumo: ${renderizar(ev.resumo, ctx)}`);
  console.log(renderizar(ev.texto, ctx));
  for (const esc of ev.escolhas ?? []) {
    console.log(`  > ${renderizar(esc.texto, ctx)}   («${renderizar(esc.resumo, ctx)}»)`);
    for (const r of [esc.resultado, esc.sucesso, esc.fracasso]) {
      if (r) console.log(`      ${r === esc.sucesso ? '✓' : r === esc.fracasso ? '✗' : '='} ${renderizar(r.texto, ctx)}${r.resumo ? `  («${renderizar(r.resumo, ctx)}»)` : ''}`);
    }
  }
}
