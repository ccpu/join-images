import { defineConfig } from 'tsup';

// Dual CJS + ESM output.
//
// The package used to ship CJS only, built with `tsc`. That output set
// `exports.__esModule = true` alongside `exports.default`, which esbuild-style
// bundlers unwrap but native ESM does not: Node always binds `default` to
// `module.exports`, so `import joinImages from 'join-images'` handed ESM
// consumers the module object instead of the function.
//
// Shipping a real ESM build alongside the CJS one makes the default import
// resolve to the function in both module systems.
export default defineConfig({
  clean: true,
  dts: true,
  entry: { main: 'src/main.ts' },
  format: ['cjs', 'esm'],
  outDir: 'lib',
  sourcemap: true,
  target: 'node24',
});
