import fs from 'fs'

export default fs.readFileSync('.site-url', 'utf-8').trim()
