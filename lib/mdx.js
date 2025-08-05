import fs from 'fs'
import matter from 'gray-matter'
import { visit } from 'unist-util-visit'
import path from 'path'
import readingTime from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'

import MDXComponents from '@/components/MDXComponents'
import imgToJsx from './img-to-jsx'

const root = process.cwd()

const tokenClassNames = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-400 italic',
}

export async function getFiles(type) {
  const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const relativePath = path.relative(path.join(root, 'data', type), filePath)
        arrayOfFiles.push(relativePath)
      }
    })

    return arrayOfFiles
  }

  return getAllFiles(path.join(root, 'data', type))
}

export function formatSlug(slug) {
  // Remove file extension and convert path separators to hyphens for cleaner URLs
  return slug.replace(/\.(mdx|md)/, '').replace(/[/\\]/g, '-')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFileBySlug(type, slug) {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  let source = null
  let actualPath = null

  if (fs.existsSync(mdxPath)) {
    source = fs.readFileSync(mdxPath, 'utf8')
    actualPath = mdxPath
  } else if (fs.existsSync(mdPath)) {
    source = fs.readFileSync(mdPath, 'utf8')
    actualPath = mdPath
  } else {
    // Check if the file exists in a subdirectory with the same name
    const files = await getFiles(type)
    const matchingFile = files.find((file) => formatSlug(file) === slug)
    if (matchingFile) {
      actualPath = path.join(root, 'data', type, matchingFile)
      source = fs.readFileSync(actualPath, 'utf8')
    } else {
      throw new Error(`Unable to find ${type} with slug ${slug}`)
    }
  }

  const { data, content } = matter(source)

  // Fix image paths for posts in subdirectories
  let processedContent = content
  if (actualPath) {
    const relativePath = path.relative(path.join(root, 'data', type), actualPath)
    const dir = path.dirname(relativePath)

    // Only process if the file is in a subdirectory
    if (dir !== '.') {
      // Replace relative image paths with absolute paths
      processedContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // Skip if already an absolute path or external URL
        if (src.startsWith('/') || src.startsWith('http')) {
          return match
        }
        // Convert to absolute path using public directory
        return `![${alt}](/static/images/blog/${dir}/${src})`
      })
    }
  }

  const mdxSource = await serialize(processedContent, {
    mdxOptions: {
      remarkPlugins: [
        (await import('remark-slug')).default,
        (await import('remark-autolink-headings')).default,
        require('remark-code-titles'),
        (await import('remark-math')).default,
        imgToJsx,
      ],
      rehypePlugins: [
        (await import('rehype-katex')).default,
        require('@mapbox/rehype-prism'),
        () => {
          return (tree) => {
            visit(tree, 'element', (node, index, parent) => {
              let [token, type] = node.properties.className || []
              if (token === 'token') {
                node.properties.className = [tokenClassNames[type]]
              }
            })
          }
        },
      ],
    },
  })

  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...data,
    },
  }
}

export async function getAllFilesFrontMatter(type) {
  const files = await getFiles(type)

  const allFrontMatter = []

  files.forEach((file) => {
    const filePath = path.join(root, 'data', type, file)
    const source = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(source)
    if (data.draft !== true) {
      allFrontMatter.push({ ...data, slug: formatSlug(file) })
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
