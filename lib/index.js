import { getHighlighter } from 'shiki'
import { render } from 'posthtml-render'
import parseAttrs from 'posthtml-attrs-parser'

const plugin = (options = {}) => tree => {
  // Highlighter defaults
  options.langs = options.langs || ['html']
  options.themes = options.themes || ['nord']
  options.wrapTag = options.wrapTag || false
  options.tag = options.tag || 'shiki'
  options.decorations = options.decorations || []
  options.transformers = options.transformers || []

  const promises = []

  tree.walk(node => {
    let promise

    if (node.tag === options.tag && node.content) {
      const attrs = parseAttrs(node.attrs)
      let highlighterOptions = {}

      // Use `theme` attr if present
      if (attrs.theme) {
        if (options.themes.some(theme => theme.name !== attrs.theme)) {
          options.themes = [attrs.theme, ...options.themes]
        }

        highlighterOptions.theme = attrs.theme
      } else {
        // Fall back to `theme-` attrs
        const themes = Object.entries(attrs).filter(([key]) => key.startsWith('theme-'))

        if (themes.length > 0) {
          // Don't load `nord` theme by default
          options.themes = []
          // Construct `themes` object for highlighter
          highlighterOptions.themes = {}

          themes.forEach(([key, value]) => {
            options.themes.push(value)
            highlighterOptions.themes[key.replace('theme-', '')] = value
          })
        } else {
          // If no values remain after filtering, use first theme in the list
          // Needs to be done only for highlighter
          highlighterOptions.theme = options.themes[0]
        }
      }

      promise = getHighlighter({
        langs: options.langs,
        themes: options.themes,
      })
        .then(highlighter => {
          highlighterOptions.lang = attrs.lang || attrs.language || options.langs[0]
          const wrapTag = attrs.wrap || options.wrapTag
          const source = render(node.content).trim()

          if (attrs['default-color']) {
            highlighterOptions.defaultColor = attrs['default-color']
          }

          if (options.defaultColor) {
            highlighterOptions.defaultColor = options.defaultColor
          }

          if (options.decorations) {
            highlighterOptions.decorations = options.decorations
          }

          if (options.transformers) {
            highlighterOptions.transformers = options.transformers
          }

          node.attrs = {}
          node.tag = wrapTag
          node.content = highlighter.codeToHtml(source, highlighterOptions)
        })

      promises.push(promise)
    }

    return node
  })

  return Promise.all(promises).then(() => tree)
}

export default plugin
