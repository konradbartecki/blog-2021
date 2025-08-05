const fs = require('fs')
const path = require('path')

const root = process.cwd()
const blogDir = path.join(root, 'data', 'blog')
const publicImagesDir = path.join(root, 'public', 'static', 'images', 'blog')

// Ensure the public images directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true })
}

// Function to recursively copy images
function copyImages(dir, relativePath = '') {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      copyImages(filePath, path.join(relativePath, file))
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)) {
      // Copy image files
      const targetDir = path.join(publicImagesDir, relativePath)
      const targetPath = path.join(targetDir, file)

      // Ensure target directory exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // Copy the file
      fs.copyFileSync(filePath, targetPath)
      console.log(`Copied: ${path.join(relativePath, file)}`)
    }
  })
}

console.log('Copying blog images to public directory...')
copyImages(blogDir)
console.log('Done copying blog images!')
