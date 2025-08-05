import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { path: imagePath } = req.query

  if (!imagePath || !Array.isArray(imagePath)) {
    return res.status(400).json({ error: 'Invalid path' })
  }

  const fullPath = path.join(process.cwd(), 'data', 'blog', ...imagePath)

  // Security check - ensure path doesn't escape data/blog directory
  const normalizedPath = path.normalize(fullPath)
  const blogDir = path.join(process.cwd(), 'data', 'blog')
  if (!normalizedPath.startsWith(blogDir)) {
    return res.status(403).json({ error: 'Access denied' })
  }

  // Check if file exists and is an image
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'File not found' })
  }

  const ext = path.extname(fullPath).toLowerCase()
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']

  if (!allowedExtensions.includes(ext)) {
    return res.status(403).json({ error: 'File type not allowed' })
  }

  // Set appropriate content type
  const contentTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }

  res.setHeader('Content-Type', contentTypes[ext])
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  const fileStream = fs.createReadStream(fullPath)
  fileStream.pipe(res)
}
