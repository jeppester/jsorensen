import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import sass from 'node-sass'

const fsPromises = fs.promises
const renderSass = promisify(sass.render).bind(sass)

export default async (stylesPath, publicPath) => {
  const result = await renderSass({
    file: path.join(stylesPath, 'style.scss'),
  })

  const fileHandle = await fsPromises.open(path.join(publicPath, `style.css`), 'w')
  await fileHandle.write(result.css)
  await fileHandle.close()
}
