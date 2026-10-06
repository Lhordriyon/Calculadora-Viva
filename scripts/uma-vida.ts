/** npm run vida -- [semente] [estrategia]: imprime uma vida inteira jogada por um robô. */
import { carregarConteudo } from './disco.ts';
import { nascer, avancarAno, escolher } from '../src/motor/vida.ts';
import { decidir, ESTRATEGIAS, type Estrategia } from '../src/motor/robos.ts';
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
  if (e.pendente) escolher(e, c, decidir(estrategia, e, c, robo));
  else avancarAno(e, c);
}
for (const h of e.historico) {
  const extra = h.escolha ? `\n      → ${h.escolha.texto}: ${h.resultado}` : '';
  const causas = h.causas?.length ? `  [causas: ${h.causas.join(', ')}]` : '';
  console.log(`${String(h.idade).padStart(3)} #${h.id} ${h.texto}${extra}${causas}`);
}
const r = resumirVida(e, c);
console.log(`\n${r.nomeCompleto} (${r.anoNascimento}–${r.anoFinal}), ${r.cidade}-${r.uf}. Morreu aos ${r.idade}, ${r.causa}.`);
console.log(`Patrimônio: ${formatarDinheiro(r.patrimonio)} · felicidade média ${r.felicidadeMedia.toFixed(0)}`);
for (const p of r.pontos) console.log(`• Aos ${p.idade}, você ${p.escolha} → aos ${p.consequenciaIdade}, ${p.consequencia} (${p.total})`);
console.log(`“${r.epitafio}”`);
