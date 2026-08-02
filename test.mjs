// test.mjs — PROOF-OF-PLAY for THE TYPED KG (the holder). Zero tokens, deterministic.
// Proves: typed edges (symmetric auto-reverse, directed don't, dedup) · edge-type-aware traversal with
// TEETH (kin never crosses clash) · cycle-safe · simple paths · the WIRE (the-throat's recognize → KG
// edges) · REMEMBER (serialize round-trip exact) · fuzz (never throws / never loops).
import { graph, fromJSON, EDGE_TYPES } from './kg.mjs';
import { seal, recognize } from './throat.mjs';

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? '  ✓ ' : '  ✗ FAIL ') + m); };

console.log('=== §1 · TYPED EDGES — symmetric auto-reverse, directed do not, dedup ===');
{
  const g = graph();
  g.addEdge('a', 'b', 'kin');
  ok(g.hasEdge('a', 'kin', 'b') && g.hasEdge('b', 'kin', 'a'), 'symmetric edge (kin) auto-adds the reverse');
  g.addEdge('p', 'q', 'reuses');
  ok(g.hasEdge('p', 'reuses', 'q') && !g.hasEdge('q', 'reuses', 'p'), 'directed edge (reuses) does NOT add a reverse');
  const before = g.edges.size;
  g.addEdge('a', 'b', 'kin'); g.addEdge('a', 'b', 'kin');
  ok(g.edges.size === before, `adding the same edge again is a no-op (dedup) — still ${before} edges`);
  let threw = false; try { g.addEdge('x', 'y', 'not-a-type'); } catch { threw = true; }
  ok(threw, 'an unknown edge type is rejected');
}

console.log('\n=== §2 · TRAVERSAL — edge-type-aware + CYCLE-SAFE ===');
{
  const g = graph();
  g.addEdge('a', 'b', 'depends'); g.addEdge('b', 'c', 'depends'); g.addEdge('c', 'a', 'depends');   // a 3-cycle
  const t = g.traverse('a', { edgeTypes: ['depends'] });
  ok(t.visited.size === 3 && [...t.visited].sort().join('') === 'abc', 'traversal of a 3-cycle terminates and visits all 3 (cycle-safe)');
  g.addEdge('a', 'z', 'contains'); g.addEdge('z', 'w', 'contains');
  const d1 = g.traverse('a', { edgeTypes: ['contains'], maxDepth: 1 });
  ok(d1.visited.has('z') && !d1.visited.has('w'), 'maxDepth=1 reaches z but not w (depth bound respected)');
  const nb = g.neighbors('a', { type: 'depends', dir: 'out' });
  ok(nb.length === 1 && nb[0].node.id === 'b', 'typed out-neighbours of a over depends = [b]');
}

console.log('\n=== §3 · ANTI-VACUOUS — type-filtered traversal has TEETH ===');
{
  const g = graph();
  g.addEdge('x', 'y', 'kin'); g.addEdge('y', 'z', 'clash');
  const kinOnly = g.traverse('x', { edgeTypes: ['kin'] });
  ok(kinOnly.visited.has('y') && !kinOnly.visited.has('z'), 'walking KIN reaches y but does NOT cross the clash to z (types are not blurred)');
  const all = g.traverse('x');
  ok(all.visited.has('z'), 'unfiltered traversal DOES reach z — so the filter above is a real restriction, not vacuous');
}

console.log('\n=== §4 · SIMPLE PATHS — bounded, no infinite loop on cycles ===');
{
  const g = graph();
  ['a-b', 'b-c', 'c-d', 'a-c', 'd-a'].forEach(e => { const [f, t] = e.split('-'); g.addEdge(f, t, 'depends'); });   // has a cycle d→a
  const ps = g.paths('a', 'd', { edgeTypes: ['depends'] });
  ok(ps.length >= 2 && ps.every(p => new Set(p).size === p.length), `found ${ps.length} SIMPLE paths a→d (no node repeats — cycle didn't loop forever)`);
}

console.log('\n=== §5 · THE WIRE — the-throat recognize() becomes KG edges (the cascade holds) ===');
{
  const witness = seal(['verify the proof', 'witness the gate, check the key, close the wall', 'test audit konomify adversary', 'assert reproducible, stop the leak']);
  const kin     = seal(['proof and verify, audit the witness', 'check the gate, test, konomify', 'assert the wall, stop the fail']);
  const broad   = seal(['transmit and broadcast the message', 'send the api mcp sdk over the mesh stream', 'the core engine kernel vault remember the state', 'build the spec design the scaffold wire the plan', 'own the seed sign the sovereign identity mint the fork']);
  const vKin = recognize(witness, kin).verdict, vComp = recognize(witness, broad).verdict;
  ok(['kin', 'complementary', 'clash'].includes(vKin) && ['kin', 'complementary', 'clash'].includes(vComp), `recognize gave real verdicts (witness~kin='${vKin}', witness~broad='${vComp}')`);
  const g = graph();
  g.fromRecognize([{ a: 'witness', b: 'kin', verdict: vKin }, { a: 'witness', b: 'broad', verdict: vComp }]);
  ok(g.hasEdge('witness', vKin, 'kin') && g.hasEdge('kin', vKin, 'witness'), `the-throat verdict '${vKin}' became a SYMMETRIC KG edge (throat → holder, proven)`);
  ok(g.hasEdge('witness', vComp, 'broad'), `the-throat verdict '${vComp}' held too`);
  const g2 = graph(); g2.fromRecognize([{ a: 'x', b: 'y', verdict: 'distant' }]);
  ok(g2.edges.size === 0, "a 'distant' verdict creates no edge (only kin/complementary/clash are held)");
}

console.log('\n=== §6 · OTHER WIRES — room reuses, mesh-sings path, estate-nest contains ===');
{
  const g = graph();
  g.fromEstateHits('plan-1', ['the-toll', 'witness']);      // the-room
  g.fromPath(['a', 'b', 'c']);                               // mesh-sings
  g.fromChamber('chamber-3', ['f1', 'f2']);                 // estate-nest
  ok(g.hasEdge('plan-1', 'reuses', 'the-toll') && g.query({ nodeType: 'plan' }).nodes.length === 1, 'the-room hits → reuses edges + a typed plan node');
  ok(g.hasEdge('a', 'path-through', 'b') && g.hasEdge('b', 'path-through', 'c') && !g.hasEdge('b', 'path-through', 'a'), 'mesh-sings path → directed path-through edges');
  ok(g.hasEdge('chamber-3', 'contains', 'f1'), 'estate-nest → contains edges');
}

console.log('\n=== §7 · REMEMBER — serialize ⇄ deserialize, EXACT ===');
{
  const g = graph();
  g.addEdge('a', 'b', 'kin'); g.addEdge('a', 'c', 'reuses'); g.addEdge('c', 'd', 'supersedes');
  g.addNode('a', { type: 'seal', meta: { note: 'root' } });
  const j1 = JSON.stringify(g.toJSON());
  const j2 = JSON.stringify(fromJSON(g.toJSON()).toJSON());
  ok(j1 === j2, 'toJSON → fromJSON → toJSON is byte-identical (the graph persists losslessly)');
}

console.log('\n=== §8 · FUZZ — random cyclic graphs never throw / never loop ===');
{
  let threw = false, seed = 0x51ed7ea1 >>> 0;
  const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
  const types = Object.keys(EDGE_TYPES);
  try {
    for (let t = 0; t < 300; t++) {
      const g = graph(), N = 3 + rnd() % 12;
      for (let i = 0; i < N * 2; i++) g.addEdge('n' + (rnd() % N), 'n' + (rnd() % N), types[rnd() % types.length]);
      g.traverse('n' + (rnd() % N), { maxDepth: 20 });
      g.paths('n0', 'n' + (rnd() % N), { maxDepth: 5 });
      JSON.parse(JSON.stringify(g.toJSON()));
    }
  } catch (e) { threw = true; console.log('    threw:', e.message); }
  ok(!threw, '300 random cyclic graphs: traverse + paths + serialize, 0 throws, all terminate');
}

console.log('\n=== §9 · DETERMINISM ===');
{
  const build = () => { const g = graph(); g.addEdge('a', 'b', 'kin'); g.addEdge('b', 'c', 'reuses'); return JSON.stringify(g.toJSON()); };
  ok(build() === build(), 'same construction → identical serialization');
}

console.log('\n' + (fail === 0
  ? `=== ✅ THE HOLDER HOLDS — typed edges, type-aware cycle-safe traversal, the throat→KG wire proven · ${pass}/${pass} · zero tokens ===`
  : `=== ✗ ${fail} FAILED (${pass} passed) ===`));
process.exit(fail === 0 ? 0 : 1);
