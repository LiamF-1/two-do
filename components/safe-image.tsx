'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
  fallbackIcon?: React.ReactNode
}

export function SafeImage({ 
  src, 
  alt, 
  fill, 
  className,
  width,
  height,
  fallbackIcon
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Transform upload paths to use our API route
  const imageSrc = src.startsWith('/uploads/') 
    ? `/api/images/${src.replace('/uploads/', '')}`
    : src

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        {fallbackIcon || <ImageIcon className="w-6 h-6 text-muted-foreground" />}
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className={`bg-muted animate-pulse ${className}`} />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        unoptimized={src.startsWith('/uploads/')} // Skip optimization for uploaded files
      />
    </>
  )
}
