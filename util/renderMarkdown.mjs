import remarkable from 'remarkable'
import hljs from 'highlight.js'

// Actual default values
const markdown = new remarkable({
  linkTarget: '_blank',
  highlight: function (str, lang) {
    let result = ''

    if (lang && hljs.getLanguage(lang)) {
      try {
        result = hljs.highlight(lang, str).value;
      } catch (err) {}
    }
    else {
      try {
        result = hljs.highlightAuto(str).value;
      } catch (err) {}
    }

    if (result) {
      return `<div class="highlighted">${result}</div>`
    }

    return ''; // use external default escaping
  }
});

export default markdown.render.bind(markdown)
