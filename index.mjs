import fs from 'fs'
import path from 'path'
import rimrafCallback from 'rimraf'
import { promisify } from 'util'
import loadPosts from './util/loadPosts.mjs'
import compileArchive from './util/compileArchive.mjs'
import compilePosts from './util/compilePosts.mjs'
import compileSass from './util/compileSass.mjs'
import copyImages from './util/copyImages.mjs'
import root from './root.mjs'

const fsPromises = fs.promises
const rimraf = promisify(rimrafCallback)

const postsPath = path.join(root, 'posts')
const publicPath = path.join(root, 'public')
const templatesPath = path.join(root, 'templates')
const stylesPath = path.join(root, 'styles')
const imagesPath = path.join(root, 'images')

const build = async () => {
  // Remove and recreate `public` folder
  await rimraf(publicPath)
  await fsPromises.mkdir(publicPath)

  const posts = await loadPosts(postsPath)
  await Promise.all([
    compileArchive(posts, templatesPath, publicPath),
    compilePosts(posts, templatesPath, publicPath),
    compileSass(stylesPath, publicPath),
    copyImages(imagesPath, publicPath),
  ])
}

build()
