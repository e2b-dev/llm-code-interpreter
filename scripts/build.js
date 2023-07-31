/* eslint-disable import/no-extraneous-dependencies */

const esbuild = require('esbuild')

const makeAllPackagesExternalPlugin = {
  name: 'make-all-packages-external',
  setup(build) {
    const filter = /^[^./]|^\.[^./]|^\.\.[^/]/ // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }))
  },
}

esbuild
  .build({
    bundle: true,
    minify: true,
    tsconfig: 'tsconfig.json',
    platform: 'node',
    target: 'node18',
    sourcemap: 'both',
    plugins: [makeAllPackagesExternalPlugin],
    outdir: 'lib',
    entryPoints: ['src/index.ts'],
  })
  .catch(() => process.exit(1))
