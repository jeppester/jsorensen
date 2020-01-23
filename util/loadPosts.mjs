import fs from 'fs'
import moment from 'moment'
import path from 'path'

const fsPromises = fs.promises

export default async postsPath => {
  const dirs = await fsPromises.readdir(postsPath)
  const posts = await Promise.all(dirs.map(async dateString => {
    const postPath = path.join(postsPath, dateString)
    const markdownBuffer = await fsPromises.readFile(path.join(postPath, 'index.md'))
    const markdown = markdownBuffer.toString()

    const markdownLines = markdown.split('\n')
    const firstLine = markdownLines.splice(0, 1)[0]
    const title = firstLine.substr(2)
    const slug = title.toLowerCase().replace(/[^a-z]+/g, '-')
    const description = markdownLines.find(l => /^[^#]/.test(l.trim())) // The first non-heading
    const date = moment(dateString)
    const firstImageMatch = markdown.match(/\!\[.+\]\((.+)\)/)
    const firstImageUrl = firstImageMatch && slug.concat('/', firstImageMatch[1])

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const files = []
    for (let [index, content] of Object.entries(markdownLines)) {
      markdownLines[index] = content.replace(linkRegex, (wholeMatch, linkText, linkPath) => {
        const isAnExternalLink = /:/.test(linkPath)
        if (isAnExternalLink) return wholeMatch

        const isAPostReference = /.html$/.test(linkPath)
        if (isAPostReference) return wholeMatch

        files.push(path.join(postPath, linkPath))
        return `[${linkText}](${slug}/${linkPath})`
      })
    }

    return {
      slug,
      url: slug.concat('.html'),
      description,
      image: firstImageUrl,
      date,
      title,
      files,
      markdown: markdownLines.join('\n').trim(),
    }
  }))

  return posts.sort((a, b) => b.date.format('X') - a.date.format('X'))
}
