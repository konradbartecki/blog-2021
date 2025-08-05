import Image from 'next/image'
import CustomLink from './Link'

const MDXComponents = {
  Image,
  img: Image, // Map standard img tags to Next.js Image component
  a: CustomLink,
}

export default MDXComponents
