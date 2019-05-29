import pug from 'pug'
import fs from 'fs'
import path from 'path'
import renderMarkdown from './renderMarkdown.mjs'
import siteUrl from '../siteUrl.mjs'

const fsPromises = fs.promises

export default async (posts, templatesPath, publicPath) => {
  const compileTemplate = pug.compileFile(path.join(templatesPath, 'archive.pug'))

  const previews = posts.map(({ url, date, title, markdown }) => {
    // Only show the first few lines for each post
    markdown = markdown.split('\n').slice(0, 3).join('\n').trim().replace(/(.?)$/, '...')

    return {
      url,
      title,
      date: date.format('MMMM D, YYYY'),
      content: renderMarkdown(markdown),
    }
  })

  const html = compileTemplate({
    url: siteUrl,
    title: 'jsorensen',
    previews,
    posts,
  })

  const fileHandle = await fsPromises.open(path.join(publicPath, `index.html`), 'w')
  await fileHandle.write(html)
  await fileHandle.close()
}
