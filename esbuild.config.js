// eslint-disable-next-line @typescript-eslint/no-var-requires
import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    outdir: 'build',
    format: 'esm',
    platform: 'node',
    external: [
      'cosmiconfig',
      'prompts',
      '@multiversx/sdk-core',
      '@multiversx/sdk-network-providers',
      '@multiversx/sdk-wallet',
      'ora',
      'axios',
      'bignumber.js',
      'keccak',
      'chalk',
    ],
  })
  .catch(() => process.exit(1));
