---
'join-images': minor
---

Ship a real ESM build alongside the existing CommonJS one.

The package previously shipped CJS only. That output set `exports.__esModule`
next to `exports.default`, which bundlers unwrap but native ESM does not — Node
always binds `default` to `module.exports`, so `import joinImages from
'join-images'` gave ESM consumers the module object rather than the function.

`exports` now resolves `import` to a true ESM entry and `require` to the
unchanged CJS entry, so the default import is the function in both module
systems. Existing `require('join-images').default` consumers are unaffected.
