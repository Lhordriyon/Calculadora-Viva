/** npm run vida -- [semente] [estrategia]: imprime uma vida inteira jogada por um robô. */
import { carregarConteudo } from './disco.ts';
import { jaAgiu } from '../src/motor/acoes.ts';
import { agir, avancarAno, escolher, nascer } from '../src/motor/vida.ts';
import { decidir, decidirAcao, ESTRATEGIAS, type Estrategia } from '../src/motor/robos.ts';
import { criarRng } from '../src/motor/rng.ts';
import { resumirVida } from '../src/motor/virada.ts';
import { formatarDinheiro } from '../src/motor/texto.ts';

const semente = Number(process.argv[2] ?? 42);
const estrategia = (process.argv[3] ?? 'aleatoria') as Estrategia;
if (!ESTRATEGIAS.includes(estrategia)) throw new Error(`estratégia desconhecida: ${estrategia}`);

const c = carregarConteudo();
const e = nascer(c, { semente, ano: 2026 });
const robo = criarRng(semente ^ 0x9e3779b9);
while (e.vivo) {
  if (e.pendente) {
    escolher(e, c, decidir(estrategia, e, c, robo));
    continue;
  }
  for (let verbo = decidirAcao(estrategia, e, c, robo); verbo && e.vivo; verbo = jaAgiu(e) ? null : decidirAcao(estrategia, e, c, robo)) agir(e, c, verbo);
  if (e.vivo) avancarAno(e, c);
}
const eu = e.entidades['eu']!;
console.log(`Origem: classe ${eu.n['classe_origem']}, família ${eu.t['familia']}, traço ${eu.t['traco']}`);
for (const papel of ['mae', 'pai', 'avo', 'amigo']) {
  const p = e.entidades[papel]!;
  console.log(`  ${papel}: ${p.nome}, ${p.t['ocupacao'] ?? '-'}, traço ${p.t['traco']}, vínculo ${Math.round(p.n['vinculo'] ?? 0)}, ${Object.keys(p.q).join(' ')}`);
}
for (const h of e.historico) {
  if (h.tipo === 'regra') continue;
  const extra = h.escolha ? `\n      → ${h.escolha.texto}: ${h.resultado}` : h.resultado ? `\n      → ${h.resultado}` : '';
  const causas = h.causas?.length ? `  [causas: ${h.causas.join(', ')}]` : '';
  const quem = h.tipo === 'acao' ? '◆ ' : h.tipo === 'npc' ? `(${h.ator}) ` : '';
  console.log(`${String(h.idade).padStart(3)} #${h.id} ${quem}${h.texto}${extra}${causas}`);
}
const r = resumirVida(e, c);
console.log(`\n${r.nomeCompleto} (${r.anoNascimento}–${r.anoFinal}), ${r.cidade}-${r.uf}, ${r.origem}. Morreu aos ${r.idade}, ${r.causa}.`);
console.log(`Patrimônio: ${formatarDinheiro(r.patrimonio)} · felicidade média ${r.felicidadeMedia.toFixed(0)}`);
for (const p of r.pontos) console.log(`• Aos ${p.idade}, ${p.causa} → aos ${p.consequenciaIdade}, ${p.consequencia} (${p.total})`);
console.log(`“${r.epitafio}”`);
