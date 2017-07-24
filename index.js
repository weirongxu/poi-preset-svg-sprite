const path = require('path')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

function excludePaths(config, paths) {
  const exclude = config.module.rule('svg').exclude
  for (const path of paths) {
    exclude.add(path)
  }
}

function register(config, options, isProduction) {
  excludePaths(config, options.include)
  const rule = config.module.rule('svg-sprite')
  const include = rule.test(/\.(svg)(\?.*)?$/).include
  for (const path of options.include) {
    include.add(path)
  }

  rule
    .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options(options.pluginOptions)
      .end()

  if (isProduction) {
    rule
      .use('svgo-loader')
        .loader('svgo-loader')
        .end()
  }

  config.plugin('svg-sprite')
    .use(SpriteLoaderPlugin)
  // Config.plugins.delete('module-concatenation')
}

/**
 * Add svg-sprite support in Poi.
 * @name svgSpritePreset
 * @param {Object} options
 * @param {String|String[]} [options.include] - Specific directory for svg files
 * @param {Object} [options.pluginOptions={
 *   extract: true
 * }] - svg-sprite loader configuration
 * See {@link https://github.com/kisenka/svg-sprite-loader#configuration svg-sprite loader configuration}
 *
 */
module.exports = options => {
  if (!options.include) {
    throw new Error('Missing required parameter: include')
  }
  if (typeof options.include === 'string') {
    options.include = [options.include]
  }
  if (!Array.isArray(options.include)) {
    throw new TypeError('Parameter include type error')
  }
  options.include = options.include.map(inc => {
    return path.resolve(process.cwd(), inc)
  })
  return poi => {
    options = poi.merge({
      pluginOptions: {
        extract: true
      }
    }, options)
    poi.extendWebpack(['development', 'watch', 'test'], config => {
      register(config, options, false)
    })
    poi.extendWebpack('production', config => {
      register(config, options, true)
    })
  }
}
