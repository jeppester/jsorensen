import pug from 'pug'
import fs from 'fs'
import path from 'path'
import renderMarkdown from './renderMarkdown.mjs'
import siteUrl from '../siteUrl.mjs'

const fsPromises = fs.promises

export default async (posts, templatesPath, publicPath) => {
  const compileTemplate = pug.compileFile(path.join(templatesPath, 'post.pug'))

  await posts.map(async ({ date, title, description, url, image, markdown }) => {
    const html = compileTemplate({
      title,
      url: siteUrl.concat('/', url),
      image: siteUrl.concat('/', image || 'images/archive-og-image.png'),
      post: {
        title,
        description,
        date: date.format('MMMM D, YYYY'),
        content: renderMarkdown(markdown),
      },
      posts,
    })

    const fileHandle = await fsPromises.open(path.join(publicPath, url), 'w')
    await fileHandle.write(html)
    await fileHandle.close()
  })
}
