const shiki = require('shiki')
const languages = require('shiki-languages')
const visit = require('unist-util-visit')

const CLASS_BLOCK = 'shiki'
const CLASS_INLINE = 'shiki-inline'

module.exports = (options) => {
  const theme = options.theme ? options.theme : 'nord'

  return async tree => {
    const highlighter = await shiki.getHighlighter({ theme })

    visit(tree, 'code', node => {
      node.type = 'html'
      node.value = highlight(node, CLASS_BLOCK, highlighter)
    })

    visit(tree, 'inlineCode', node => {
      node.type = 'html'
      node.value = highlight(node, CLASS_INLINE, highlighter)
    })
  }
}

function highlight ({ value, lang }, cls, highlighter) {
  const index = languages.languages.findIndex((x) => x.id === lang || x.aliases.includes(lang))
  const theme = shiki.getTheme('nord')

  console.log(index)

  if (index >= 0) {
    return highlighter.codeToHtml(value, lang)
  }

  // Fallback for unknown languages.
  return `<code class="${cls}" style="background: ${theme.bg}; color: ${theme.colors['terminal.foreground']}">${escape(value)}</code>`
}

function escape (value) {
  return value.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
