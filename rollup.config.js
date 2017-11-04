import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

export default {
  input: "lib/browser.js",
  output: {
    file: "dist/browser.js",
    format: "umd"
  },
  name: pkg.name,
  plugins: [
    commonjs(),
    resolve({
      include: 'node_modules/**',
    }),
    babel({
      babelrc: false,
      presets: [
        [
          "env",
          {
            modules: false
          }
        ]
      ],
      plugins: ["external-helpers"]
    }),
    replace({
      __VERSION__: pkg.version
    })
  ]
};
