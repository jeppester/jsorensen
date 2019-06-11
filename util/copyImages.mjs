import fs from 'fs'
import path from 'path'

const fsPromises = fs.promises

export default async (imagesPath, publicPath) => {
  const imagePaths = await fsPromises.readdir(imagesPath)

  await fsPromises.mkdir(path.join(publicPath, 'images'))

  await Promise.all(imagePaths.map(async imagePath => {
    const sourcePath = path.join(imagesPath, imagePath)
    const destinationPath = path.join(publicPath, 'images', imagePath)

    return fsPromises.copyFile(sourcePath, destinationPath)
  }))
}
