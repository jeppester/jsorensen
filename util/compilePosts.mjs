import pug from 'pug'
import fs from 'fs'
import path from 'path'
import renderMarkdown from './renderMarkdown.mjs'
import siteUrl from '../siteUrl.mjs'

const fsPromises = fs.promises

export default async (posts, templatesPath, publicPath) => {
  const compileTemplate = pug.compileFile(path.join(templatesPath, 'post.pug'))

  await posts.map(async ({ date, title, description, slug, url, image, markdown, files }) => {
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

    if (files.length > 0) {
      const filesPath = path.join(publicPath, slug)
      await fsPromises.mkdir(filesPath)

      await Promise.all(files.map(async sourcePath => {
        const baseName = path.basename(sourcePath)
        const destinationPath = path.join(filesPath, baseName)

        return fsPromises.copyFile(sourcePath, destinationPath)
      }))
    }

    const fileHandle = await fsPromises.open(path.join(publicPath, url), 'w')
    await fileHandle.write(html)
    await fileHandle.close()
  })
}
