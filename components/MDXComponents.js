import Image from 'next/image'
import CustomLink from './Link'

// Simple image component that uses regular img tag to avoid hydration issues
const SimpleImage = ({ src, alt, ...props }) => {
  const handleClick = () => window.open(src, '_blank')

  return (
    <button
      onClick={handleClick}
      className="block w-full text-left cursor-pointer border-0 bg-transparent p-0 m-0"
      aria-label={`View ${alt || 'image'} in new tab`}
    >
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        className="w-full transition-transform hover:scale-[1.02]"
        {...props}
      />
    </button>
  )
}

const MDXComponents = {
  Image,
  img: SimpleImage, // Use simple img for markdown images
  a: CustomLink,
}

export default MDXComponents
