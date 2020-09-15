import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import image from '@rollup/plugin-image'
import fs from 'fs'

export default {
  input: {
    'declick-objects': 'src/loader.js',
  },
  output: {
    dir: 'lib',
    /*file: 'lib/declick-objects.js',*/
    format: 'es',
    name: 'DeclickObject',
    /*inlineDynamicImports: true,*/
  },
  plugins: [
    replace({
      __CLASSES__: JSON.stringify(
        fs
          .readdirSync('./src/classes')
          .filter(file => file.match(/.*\.js$/))
          .map(filename => filename.slice(0, -3)),
      ),
      __INSTANCES__: JSON.stringify(
        fs
          .readdirSync('./src/instances')
          .filter(file => file.match(/.*\.js$/))
          .map(filename => filename.slice(0, -3)),
      ),
    }),
    babel({
      babelHelpers: 'bundled',
    }),
    json({ namedExports: false }),
    image(),
    dynamicImportVars({ exclude: ['translations/translation.en.json'] }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
  ],
}
