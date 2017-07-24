# poi-preset-svg-sprite

Add [svg-sprite](https://github.com/kisenka/svg-sprite-loader) support in Poi.

## Install

```sh
npm i -g poi-preset-svg-sprite
```

## Usage

```javascript
// poi.config.js
module.exports = {
  presets: [
    require('poi-preset-svg-sprite')()
  ]
}
// index.js
import demo from 'demo.svg'
const rendered = `
<svg>
  <use xlink:href="${demo.url}" />
</svg>
<img src="${demo.url}" alt="">
`;
```

### Disable extract mode

```javascript
// poi.config.js
module.exports = {
  presets: [
    require('poi-preset-svg-sprite')({extract: false})
  ]
}
// index.js
import demo from 'demo.svg'
const rendered = `
<svg>
  <use xlink:href="#${demo.id}" />
</svg>
`;
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### svgSpritePreset

Add svg-sprite support in Poi.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.include` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>)?** Specific directory for svg files
    -   `options.pluginOptions` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** svg-sprite loader configuration
        See [svg-sprite loader configuration](https://github.com/kisenka/svg-sprite-loader#configuration) (optional, default `{
        extract:true
        }`)
