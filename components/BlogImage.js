import Image from 'next/image'
import { useState } from 'react'

const BlogImage = ({ src, alt, width, height, ...props }) => {
  // If width/height are not provided, use fill mode
  const useFixedDimensions = width && height
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div
        className="relative cursor-pointer group"
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        role="button"
        tabIndex={0}
        aria-label="Click to enlarge image"
      >
        {useFixedDimensions ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="transition-transform group-hover:scale-[1.02]"
            {...props}
          />
        ) : (
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              className="object-contain transition-transform group-hover:scale-[1.02]"
              {...props}
            />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20 rounded-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div
            className="absolute inset-0"
            onClick={handleClose}
            onKeyDown={(e) => e.key === 'Escape' && handleClose()}
            role="button"
            tabIndex={0}
            aria-label="Close lightbox"
          />
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none">
            {useFixedDimensions ? (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="object-contain w-full h-full"
                style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
              />
            ) : (
              <div className="relative w-full h-full">
                <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
              </div>
            )}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors pointer-events-auto"
              onClick={handleClose}
              aria-label="Close"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default BlogImage
