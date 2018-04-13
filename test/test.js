const fs = require('fs')
const path = require('path')
const glob = require('glob')
const test = require('ava')
const {poi} = require('./_utils')

const svgPath = path.resolve(__dirname, 'fixtures/svg')
const distPath = path.resolve(__dirname, 'fixtures/dist')

test('miss include', t => {
  const cmd = poi('index.js', 'miss-include', {})
  t.true(cmd.status !== 0)
  t.true(cmd.output.toString().includes('Missing required parameter: include'))
})

test('include type error', t => {
  const cmd = poi('index.js', 'include-type-error', {
    include: true,
  })
  t.true(cmd.status !== 0)
  t.true(cmd.output.toString().includes('Parameter include type error'))
})

test('extract mode', t => {
  const cmd = poi('index-with-css.js', 'extract-mode', {
    include: svgPath,
  })
  const spriteContent = fs.readFileSync(path.resolve(distPath, 'extract-mode/sprite.svg')).toString()
  t.true(
    ['id="js"', 'id="css"'].every(it =>
      spriteContent.includes(it)
    )
  )
  t.true(cmd.status === 0)
})

test('svg sprite in html', t => {
  const cmd = poi('index.js', 'svg-sprite-in-html', {
    include: svgPath,
    svgSpriteOptions: {
      extract: false,
    },
  })
  const [clientJs] = glob.sync(path.resolve(distPath, 'svg-sprite-in-html/client.*.js'))
  const spriteContent = fs.readFileSync(clientJs).toString()
  t.true(spriteContent.includes('id:"js"'))
  t.true(cmd.status === 0)
})
