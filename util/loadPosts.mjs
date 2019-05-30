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
    const description = markdownLines.find(l => /^[^#]/.test(l.trim())) // The first non-heading
    const date = moment(dateString)
    const firstImageMatch = markdown.match(/\!\[.+\]\((.+)\)/)
    const firstImageUrl = firstImageMatch && firstImageMatch[1]

    return {
      url: titleToUrl(title),
      description,
      image: firstImageUrl,
      date,
      title,
      markdown: markdownLines.join('\n').trim()
    }
  }))

  return posts.sort((a, b) => b.date.format('X') - a.date.format('X'))
}
