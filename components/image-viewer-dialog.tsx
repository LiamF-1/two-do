'use client'

import { useState, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from './ui/dialog'
import { Button } from './ui/button'
import { SafeImage } from './safe-image'

interface ImageViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt: string
  caption?: string | null
  completedBy?: string | null
  completedAt?: Date
}

export function ImageViewerDialog({ 
  open, 
  onOpenChange, 
  src, 
  alt, 
  caption,
  completedBy,
  completedAt
}: ImageViewerDialogProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleClose = () => {
    setZoom(1)
    setRotation(0)
    onOpenChange(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          handleRotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleDownload = async () => {
    try {
      const response = await fetch(src.startsWith('/uploads/') 
        ? `/api/images/${src.replace('/uploads/', '')}`
        : src
      )
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `completion-image-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95 border-none [&>button]:hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex-1">
            {completedBy && (
              <p className="text-white text-sm font-medium">
                Completed by {completedBy}
              </p>
            )}
            {completedAt && (
              <p className="text-white/70 text-xs">
                {formatDate(completedAt)}
              </p>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 5}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRotate}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex items-center justify-center w-full h-full overflow-hidden">
          <div 
            className="relative transition-transform duration-200 ease-out max-w-full max-h-full"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            <SafeImage
              src={src}
              alt={alt}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-sm text-center">
              {caption}
            </p>
          </div>
        )}

        {/* Zoom indicator */}
        {zoom !== 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
