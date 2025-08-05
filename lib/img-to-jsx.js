import { visit } from 'unist-util-visit'
import sizeOf from 'image-size'
import fs from 'fs'

export default (options) => (tree) => {
  visit(
    tree,
    // only visit p tags that contain an img element
    (node) => node.type === 'paragraph' && node.children.some((n) => n.type === 'image'),
    (node) => {
      const imageNode = node.children.find((n) => n.type === 'image')

      // Handle both public and API served images
      let imagePath = null
      let dimensions = null

      if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
        // For public images
        imagePath = `${process.cwd()}/public${imageNode.url}`
        dimensions = sizeOf(imagePath)
      }

      if (dimensions) {
        // Convert original node to next/image
        imageNode.type = 'jsx'
        imageNode.value = `<Image
          alt="${imageNode.alt || ''}" 
          src="${imageNode.url}"
          width={${dimensions.width}}
          height={${dimensions.height}}
      />`

        // Change node type from p to div to avoid nesting error
        node.type = 'div'
        node.children = [imageNode]
      }
    }
  )
}
