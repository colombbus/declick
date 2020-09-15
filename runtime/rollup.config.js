import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    file: 'lib/declick-runtime.js',
    format: 'es',
    name: 'DeclickRuntime',
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      //TODO: remove this when js-interpreter is updated
      mainFields: ['browser', 'main', 'module'], //required because js-interpreter package 'module' is mis-configured
    }),
    commonjs(),
  ],
}
