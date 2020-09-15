import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
import json from '@rollup/plugin-json'

export default {
  input: {
    'declick-runtime': 'src/main.js',
  },
  output: {
    dir: 'lib',
    /*file: 'lib/declick-runtime.js',*/
    format: 'es',
  },
  plugins: [
    json({ namedExports: false }),
    dynamicImportVars(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      //TODO: remove this when js-interpreter is updated
      mainFields: ['browser', 'main', 'module'], //required because js-interpreter package 'module' is mis-configured
    }),
    commonjs(),
  ],
}
