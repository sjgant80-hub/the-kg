# The Holder — a typed knowledge graph the organs write into

**▶ Live: https://sjgant80-hub.github.io/the-kg/**

The organs *produce* edges; this graph **holds** them. It's the **BODY/REMEMBER** socket of the Seal
(§27) and organ #2 of the anatomy cascade (after [the-wallet](https://sjgant80-hub.github.io/the-wallet/)).
Nodes + **typed** directed edges, traversed by edge type — because "these two are alike" (`kin`) and
"these two conflict" (`clash`) must never be blurred into one graph.

## What it holds — and from where

- **the-throat** → `recognize()` emits **kin / complementary / clash** between Seals (symmetric edges)
- **the-room** → grounded plans emit **reuses** (a plan reuses what exists)
- **mesh-sings** → a coherent path emits **path-through** (directed, along the walk)
- **estate-nest** → chambers emit **contains**

The live page is not a mock: it runs `recognize()` over eight public folds on load and draws the real
verdicts. Click a node and it **traverses by the enabled edge types only** — turn off `clash` and the
conflict edges stop propagating; you can watch `kin` reach a cluster while never crossing into a `clash`.

## Proven — `node test.mjs`, zero tokens, 20/20

- Typed edges: symmetric types auto-add the reverse, directed don't, duplicates dedup, unknown types rejected.
- Traversal is **edge-type-aware and cycle-safe** (a 3-cycle terminates), respects `maxDepth`.
- **Anti-vacuous teeth**: walking `kin` reaches y but does **not** cross a `clash` to z — and the *unfiltered*
  traversal *does* reach z, so the filter is a real restriction.
- Simple `paths()` are bounded (no infinite loop on cycles).
- **The wire**: the-throat's `recognize()` verdicts become the correct symmetric KG edges; a `distant`
  verdict creates none.
- **REMEMBER**: `toJSON → fromJSON → toJSON` is byte-identical (the graph persists losslessly).
- 300-graph fuzz (cyclic): traverse + paths + serialize never throw, always terminate. Deterministic.

## Files

`kg.mjs` (the kernel — nodes, typed edges, traversal, paths, query, ingest adapters, serialize) ·
`throat.mjs` + `ladder.mjs` (imported so the page + gate can run the real `recognize()` wire) ·
`test.mjs` (the 20/20 gate) · `index.html` (the live PWA — the real graph, click-to-traverse, edge-type
filters) · `sw.js` + `manifest.webmanifest` (offline). Zero-dep, Node + browser.

```bash
node test.mjs                 # the proof
python -m http.server 8080    # then open http://localhost:8080
```
