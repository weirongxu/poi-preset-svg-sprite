const fs = require('fs')
const path = require('path')
const glob = require('glob')
const test = require('ava')
const {poi} = require('./_utils')

const svgPath = path.resolve(__dirname, 'fixtures/svg')
const distPath = path.resolve(__dirname, 'fixtures/dist')

test('miss include', t => {
  const cmd = poi('index.js', 'miss-include', `{
    plugins: [require('../../')({
    })],
  }`)
  t.true(cmd.status !== 0)
  t.true(cmd.output.toString().includes('Missing required parameter: "include"'))
})

test('include type error', t => {
  const cmd = poi('index.js', 'include-type-error', `{
    plugins: [require('../../')({
      include: true,
    })],
  }`)
  t.true(cmd.status !== 0)
  t.true(cmd.output.toString().includes('Parameter "include" type error'))
})

test('extract mode', t => {
  const cmd = poi('index-with-css.js', 'extract-mode', `{
    plugins: [require('../../')({
      include: "${svgPath}",
      esModule: false,
    })],
  }`)
  const spriteContent = fs.readFileSync(path.resolve(distPath, 'extract-mode/sprite.svg')).toString()
  t.true(
    ['id="sprite-by-js"', 'id="sprite-by-css"'].every(it =>
      spriteContent.includes(it)
    )
  )
  t.true(cmd.status === 0)
})

test('svg sprite in html', t => {
  const cmd = poi('index.js', 'svg-sprite-in-html', `{
    plugins: [require('../../')({
      include: "${svgPath}",
      svgSpriteOptions: {
        extract: false,
      },
    })],
  }`)
  const [mainJs] = glob.sync(path.resolve(distPath, 'svg-sprite-in-html/*.js'))
  const spriteContent = fs.readFileSync(mainJs).toString()
  t.true(spriteContent.includes('id="sprite-by-js"'))
  t.true(cmd.status === 0)
})
