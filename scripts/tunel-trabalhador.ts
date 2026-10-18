/** Um trabalhador do túnel: lê o conteúdo uma vez e roda as tarefas que o túnel manda (scripts/tunel-vida.ts). */
import { parentPort } from 'node:worker_threads';
import { carregarConteudo } from './disco.ts';
import { executar, type Tarefa } from './tunel-vida.ts';

const c = carregarConteudo();
parentPort!.on('message', (m: { i: number; t: Tarefa }) => parentPort!.postMessage({ i: m.i, r: executar(c, m.t) }));
