import alias from 'rollup-plugin-alias'
import config from './rollup.config'

config.input = 'test/unit/index.js'
config.output = {
  file: 'test/unit/build/index.js',
  format: 'umd'
}

config.plugins.unshift(alias({
  '../../..': require.resolve('./dist/browser')
}))

export default config
