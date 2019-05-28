import fs from 'fs'
import moment from 'moment'
import path from 'path'

const fsPromises = fs.promises

const titleToUrl = title => title.toLowerCase().replace(/[^a-z]+/g, '-').concat('.html')

export default async postsPath => {
  const postFileNames = await fsPromises.readdir(postsPath)
  const posts = await Promise.all(postFileNames.map(async fileName => {
    const markdownBuffer = await fsPromises.readFile(path.join(postsPath, fileName))
    const markdown = markdownBuffer.toString()
    const dateString = path.basename(fileName, '.md')

    const markdownLines = markdown.split('\n')
    const firstLine = markdownLines.splice(0, 1)[0]
    const title = firstLine.substr(2)
    const date = moment(dateString)

    return {
      url: titleToUrl(title),
      date,
      title,
      markdown: markdownLines.join('\n').trim()
    }
  }))

  return posts.sort((a, b) => a.date.format('X') - b.date.format('X'))
}
