# Trajetória — como trabalhar neste projeto

Simulador de vida em texto, ano a ano, jogado no celular pelo navegador (PWA). O jogador consome uma coisa só: **uma história sobre uma vida que ele mesmo causou, em poucos minutos**. A matéria-prima é texto, números e escolhas; todo o resto é embalagem e só entra se provar que aumenta essa experiência.

## Fluxo de cada sessão

1. Leia este arquivo, `docs/metricas.md` e `docs/decisoes.md`.
2. Escolha o incremento de maior impacto pelo método abaixo.
3. Commits pequenos e descritivos. Antes de cada push: `npm run verificar` (tipos, testes, validador, túnel e build).
4. Push na `main` (o CI publica no GitHub Pages). Sem permissão, abra um PR e diga isso.
5. Termine com: o que mudou, métricas antes e depois, link do jogo e o próximo passo.

## Como pensar (nesta ordem; nunca inverta)

1. **Questione cada requisito**, inclusive os daqui. Todo requisito tem dono e motivo (tabela abaixo); requisito sem motivo é suspeito, e os do agente podem ser apagados.
2. **Apague.** Peça, tela, sistema ou regra que não serve à experiência central sai. Se você nunca precisar devolver algo que cortou, cortou pouco.
3. **Simplifique** o que sobrou.
4. **Acelere o ciclo de feedback** (túnel de vento, `npm run vida`, testes).
5. **Automatize por último**, só o que já provou que funciona.

O erro mais caro é otimizar algo que nem deveria existir. Decisão sem número é palpite: use o túnel.

## A física do problema

- O inimigo do gênero é a repetição. Conteúdo escrito um por um não escala; a saída é a combinatória (alternâncias `[a|b]`, condições, marcas).
- **Marcas são a memória da vida.** Cada decisão relevante grava uma marca com o ano; eventos futuros consultam marcas. Cadeias de marcas multiplicam histórias em vez de somar.
- Gerar texto custa quase zero; o gargalo é a qualidade, e qualidade se mede.

## Limites que não se negociam

- Conteúdo 100% original. Não cite, compare nem copie nenhum jogo existente em nenhum arquivo.
- Texto em português do Brasil, leve, às vezes irônico, com ambientação brasileira real.
- Mobile-first: uma mão, alvos de toque ≥ 44px, tema claro e escuro.
- Sem backend; save no localStorage com versão de esquema.
- Nada quebrado vai para a `main`.
- Expansão de funcionalidades (relações, carreira, gerações…) **travada** até o dono dizer que jogou 5 vidas e quis jogar a 6ª. Até lá, só melhorar o núcleo: textos, cadeias, repetição, equilíbrio.

## Arquitetura

```
conteudo/            dados, nunca código
  eventos/*.json     eventos por fase da vida (formato em docs/conteudo.md)
  linhas.json        linhas curtas dos anos sem evento
  mortes.json        causas de morte (com condições)
  marcas.json        efeitos passivos e epitáfios de marcas
  mundo.json         nomes, cidades, famílias, textos de nascimento
src/motor/           motor puro, sem UI: roda em Node e no navegador
  vida.ts            nascer → +1 ano → evento elegível → escolha → efeitos → morte
  esquema.ts         esquemas Zod do conteúdo
  conteudo.ts        indexa o conteúdo já lido (quem lê é o chamador)
  condicoes.ts       condições e causas (marcas consultadas)
  economia.ts        dinheiro em reais de hoje, inflação, juros, investimento
  texto.ts           variáveis, concordância de gênero, alternâncias, R$
  virada.ts          grafo de causas → pontos de virada e resumo da vida
  robos.ts           estratégias do túnel e análise de dilemas
  validacao.ts       checagens além do esquema (marcas, variáveis, cadeias)
  memoria.ts         memória do jogador entre vidas (reduz repetição)
  regras.ts          números de equilíbrio (ritmo, mortalidade, juros…)
src/jogo/salvar.ts   save versionado no localStorage
src/ui/              Preact: App, Cabecalho, LinhaDoTempo, Palco, CartaoVida
scripts/             validar, tunel, uma-vida, icones (Node com TypeScript nativo)
test/                Vitest
```

Detalhes do motor em `docs/motor.md`; formato e guia de escrita em `docs/conteudo.md`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | jogo local com recarga |
| `npm run verificar` | tudo que o CI roda: tipos, testes, validador, túnel, build |
| `npm run validar` | só o conteúdo (esquema, ids, marcas, variáveis, cadeias) |
| `npm run tunel` | 10.000 vidas simuladas → `docs/metricas.md`; falha se uma meta quebrar |
| `npm run vida -- 42 cautelosa` | imprime uma vida inteira (semente e estratégia) |
| `npm run icones` | redesenha os PNGs do PWA |

Node 22.18+ roda os scripts TypeScript direto (sem build). Use só sintaxe apagável (sem `enum`, sem propriedades no construtor) e imports com `.ts`.

## Requisitos, com dono e motivo

| Requisito | Dono | Motivo |
|---|---|---|
| Uma história causada pelo jogador, em poucos minutos, no celular | dono | é o produto |
| Conteúdo original, nenhum jogo citado | dono | identidade e risco legal |
| pt-BR leve e irônico, Brasil real (ENEM, CLT, Pix, SUS…) | dono | o público se reconhece |
| Mobile-first, uma mão, alvos ≥ 44px, claro e escuro | dono | é onde e como se joga |
| Sem backend; localStorage com versão de esquema | dono | custo zero e save que sobrevive a mudanças |
| Nada quebrado na `main`; CI roda tudo | dono | a `main` é o que o jogador recebe |
| Vite + TS estrito + Preact + Vitest + Zod + vite-plugin-pwa; Pages via Actions | dono | pilha mínima e deploy automático |
| Motor puro, sem UI, em Node e navegador | dono | o túnel joga com o mesmo motor que o jogador |
| Eventos em JSON, validados (`npm run validar`) | dono | conteúdo escala sem código e sem quebrar |
| Dinheiro só onde gera decisão | dono | realismo sem decisão é peso morto |
| Túnel de vento com metas: zero eventos mortos, não-repetível nunca repete, nenhuma estratégia fixa domina | dono | qualidade se mede |
| Expansão travada até o dono pedir a 6ª vida | dono | primeiro provar o núcleo |
| Toda escolha tem `resumo` | agente | o cartão da vida conta "aos 17 você…" |
| Dinheiro mostrado em reais de hoje | agente | valores nominais de 2080 confundem; a inflação aparece como dinheiro parado que encolhe |
| `marco: true` para ENEM, primeiro emprego, aposentadoria… | agente | a espinha da vida não pode depender de sorteio |
| Personagem novo (`{amor}`, `{filho}`…) só em texto que exige a marca que o garante | agente | sem "alguém" no lugar de um nome |
| Pelo menos uma escolha sem condição por evento | agente | a vida nunca trava |
| Opções somem? Não: aparecem desabilitadas com o motivo | agente | a pobreza também é história |
| Toques ignorados por 450 ms quando um evento aparece | agente | toque duplo no +1 ano não pode escolher por você |
