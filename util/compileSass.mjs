import fs from 'fs'
import path from 'path'
import sass from 'sass'

const fsPromises = fs.promises

export default async (stylesPath, publicPath) => {
  const result = await sass.compileAsync(path.join(stylesPath, 'style.scss'))

  const fileHandle = await fsPromises.open(path.join(publicPath, `style.css`), 'w')
  await fileHandle.write(result.css)
  await fileHandle.close()
}
