const path = require('path')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

function excludePaths(config, paths) {
  const {exclude} = config.module.rule('svg')
  for (const path of paths) {
    exclude.add(path)
  }
}

function register(config, options, isProduction) {
  excludePaths(config, options.include)
  const rule = config.module.rule('svg-sprite')
  const {include} = rule.test(/\.(svg)(\?.*)?$/)
  for (const path of options.include) {
    include.add(path)
  }

  rule
    .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options(options.svgSpriteOptions)
      .end()

  if (isProduction) {
    rule
      .use('svgo-loader')
        .loader('svgo-loader')
        .options(options.svgoOptions)
        .end()
  }

  config.plugin('svg-sprite')
    .use(SpriteLoaderPlugin, [options.svgSpritePluginOptions])
  // Config.plugins.delete('module-concatenation')
}

/**
 * Add svg-sprite support in Poi.
 * @name svgSpritePreset
 * @param {Object} options - options
 * @param {String|String[]} [options.include] - Specific directory for svg files
 *
 * @param {Object} [options.svgSpriteOptions={
 *   extract: true
 * }] - svg-sprite-loader options
 * See {@link https://github.com/kisenka/svg-sprite-loader#configuration svg-sprite-loader options}
 *
 * @param {Object} [options.svgSpritePluginOptions={}] - svg-sprite-loader-plugin options
 * See {@link https://github.com/kisenka/svg-sprite-loader#plain-sprite svg-sprite-loader-plugin options}
 *
 * @param {Object} [options.svgoOptions={
 *   plugins: []
 * }] - svgo-loader options
 * See {@link https://github.com/rpominov/svgo-loader#usage svgo-loader options}
 * @return {Function} poi plugin
 *
 */
module.exports = ({
  include,
  svgSpriteOptions = {
    extract: true,
  },
  svgSpritePluginOptions = {},
  svgoOptions = {
    plugins: [],
  },
}) => {
  if (!include) {
    throw new Error('Missing required parameter: "include"')
  }
  if (typeof include === 'string') {
    include = [include]
  }
  if (!Array.isArray(include)) {
    throw new TypeError('Parameter "include" type error')
  }
  include = include.map(inc => {
    return path.resolve(process.cwd(), inc)
  })
  return poi => {
    const options = {
      include,
      svgSpriteOptions,
      svgSpritePluginOptions,
      svgoOptions,
    }
    poi.chainWebpack((config, context) => {
      register(
        config,
        options,
        context.comamnd === 'build'
      )
    })
  }
}
