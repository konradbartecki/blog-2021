import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { kebabCase } from './utils'

const root = process.cwd()

export async function getAllTags(type) {
  const files = fs.readdirSync(path.join(root, 'data', type))

  let tagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  files.forEach((file) => {
    const filePath = path.join(root, 'data', type, file)
    const stat = fs.statSync(filePath)
    if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      const source = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(source)
      if (data.tags && data.draft !== true) {
        data.tags.forEach((tag) => {
          const formattedTag = kebabCase(tag)
          if (formattedTag in tagCount) {
            tagCount[formattedTag] += 1
          } else {
            tagCount[formattedTag] = 1
          }
        })
      }
    }
  })

  return tagCount
}
