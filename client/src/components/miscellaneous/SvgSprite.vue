<template>
  <svg width="0" height="0" style="display: none" v-html="$options.svgSprite" />
</template>

<script>
const svgContext = require.context(
  '!svg-inline-loader?' +
  'removeTags=true' + // remove title tags, etc.
  '&removeSVGTagAttrs=true' + // enable removing attributes
  '&removingTagAttrs=fill' + // remove fill attributes
    '!@/assets/images/icons', // search this directory
  true, // search subdirectories
  /\w+\.svg$/i, // only include SVG files
)
const symbols = svgContext.keys().map(path => {
  const content = svgContext(path)
  const id = path.replace(/^\.\/(.*)\.\w+$/, '$1')
  return content
    .replace('<svg', `<symbol id="${id}"`)
    .replace('svg>', 'symbol>')
})
export default {
  name: 'SvgSprite',
  svgSprite: symbols.join('\n'), // concatenate all symbols into $options.svgSprite
}
</script>
