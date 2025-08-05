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
  const files = fs.readdirSync(path.join(root, 'data', type))
  return files.filter((file) => {
    const filePath = path.join(root, 'data', type, file)
    const stat = fs.statSync(filePath)
    return stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))
  })
}

export function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFileBySlug(type, slug) {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')

  const { data, content } = matter(source)
  const mdxSource = await serialize(content, {
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
  const files = fs.readdirSync(path.join(root, 'data', type))

  const allFrontMatter = []

  files.forEach((file) => {
    const filePath = path.join(root, 'data', type, file)
    const stat = fs.statSync(filePath)
    if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      const source = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(source)
      if (data.draft !== true) {
        allFrontMatter.push({ ...data, slug: formatSlug(file) })
      }
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
