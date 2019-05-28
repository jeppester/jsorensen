import fs from 'fs'
import path from 'path'

const fsPromises = fs.promises

const readdirRecursive = async (dir, pathPrefix = '', foundPaths = []) => {
  const fileNames = await fsPromises.readdir(dir)

  await Promise.all(fileNames.map(async fileName => {
    const relativePath = path.join(pathPrefix, fileName)
    const fullPath = path.join(dir, fileName)
    const stats = await fsPromises.stat(fullPath, 'r')

    if (stats.isDirectory()) {
      await readdirRecursive(fullPath, relativePath, foundPaths)
    }
    else {
      foundPaths.push(relativePath)
    }
  }))

  return foundPaths
}

export default async (imagesPath, publicPath) => {
  const imagePaths = await readdirRecursive(imagesPath)

  const missingDirs = new Set
  await Promise.all(imagePaths.map(async imagePath => {
    const dir = path.dirname(path.join(publicPath, 'images', imagePath))
    try {
      await fsPromises.stat(dir, 'r')
    }
    catch (e) {
      missingDirs.add(dir)
    }
  }))

  for (let dir of missingDirs) {
    await fsPromises.mkdir(dir)
  }

  await Promise.all(imagePaths.map(async imagePath => {
    const sourcePath = path.join(imagesPath, imagePath)
    const destinationPath = path.join(publicPath, 'images', imagePath)

    return fsPromises.copyFile(sourcePath, destinationPath)
  }))
}
