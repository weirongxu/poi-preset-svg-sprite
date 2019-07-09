const fs = require('fs')
const path = require('path')
const glob = require('glob')
const pify = require('pify')
const rimraf = require('rimraf')
const {poi} = require('./_utils')

const svgPath = path.resolve(__dirname, 'fixtures/svg')
const distPath = path.resolve(__dirname, 'fixtures/dist')

const testBuild = (success, source, dist, options) => {
  const cmd = poi(source, dist, `{
    plugins: [{
      resolve: '../../',
      options: ${JSON.stringify(options)}
    }],
  }`)
  console.log(cmd.stdout.toString())
  console.log(cmd.stderr.toString())
  if (success) {
    expect(cmd.status).toEqual(0)
  } else {
    expect(cmd.status).not.toEqual(0)
  }

  return cmd.output.toString()
}

afterAll(() => {
  return pify(rimraf)(distPath)
})

describe('build', () => {
  test('miss include', () => {
    const output = testBuild(false, 'index.js', 'miss-include', {})
    expect(output).toContain('Missing required parameter: include')
  })

  test('include type error', () => {
    const output = testBuild(false, 'index.js', 'include-type-error', {
      include: true,
    })
    expect(output).toContain('Parameter include type(boolean) error')
  })

  test('extract mode', () => {
    testBuild(true, 'index-with-css.js', 'extract-mode', {
      include: svgPath,
    })
    const spriteContent = fs.readFileSync(path.resolve(distPath, 'extract-mode/sprite.svg')).toString()
    ;['id="js"', 'id="css"'].every(it =>
      expect(spriteContent).toContain(it)
    )
  })

  test('svg sprite in html', () => {
    testBuild(true, 'index.js', 'svg-sprite-in-html', {
      include: svgPath,
      svgSpriteOptions: {
        extract: false,
      },
    })
    const clientJsArr = glob.sync(path.resolve(distPath, 'svg-sprite-in-html/assets/js/*.js'))
    const spriteContent = clientJsArr.map(clientJs => fs.readFileSync(clientJs).toString()).join()
    expect(spriteContent).toContain('id:"js"')
  })
})
