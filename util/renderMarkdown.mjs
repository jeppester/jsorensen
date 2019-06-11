import remarkable from 'remarkable'
import hljs from 'highlight.js'

// Actual default values
const markdown = new remarkable({
  linkTarget: '_blank',
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  }
});

export default markdown.render.bind(markdown)
