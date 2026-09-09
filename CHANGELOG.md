# join-images

## 1.5.0

### Minor Changes

- add dual ESM and CJS output with tsup
- 6ea4635: Ship a real ESM build alongside the existing CommonJS one.

  The package previously shipped CJS only. That output set `exports.__esModule`
  next to `exports.default`, which bundlers unwrap but native ESM does not — Node
  always binds `default` to `module.exports`, so `import joinImages from
'join-images'` gave ESM consumers the module object rather than the function.

  `exports` now resolves `import` to a true ESM entry and `require` to the
  unchanged CJS entry, so the default import is the function in both module
  systems. Existing `require('join-images').default` consumers are unaffected.

## 1.4.0

### Minor Changes

- change access level from restricted to public

## 1.3.0

### Minor Changes

- accept sharp pipeline inputs

## 1.2.0

### Minor Changes

- 8f0201e: update repo
- add initial configuration and README for Changesets
