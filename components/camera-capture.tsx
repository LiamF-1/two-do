'use client'

import { useRef, useEffect, useState } from 'react'
import { Camera, X, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setFacingMode(facing)
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })
        stopCamera()
        onCapture(file)
      }
    }, 'image/jpeg', 0.8)
  }

  const switchCamera = () => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user'
    startCamera(newFacing)
  }

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const handleCancel = () => {
    stopCamera()
    onCancel()
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button onClick={() => startCamera()} variant="outline">
            Try Again
          </Button>
        </div>
        <Button onClick={handleCancel} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 object-cover"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-sm">Starting camera...</div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleCancel} variant="outline" size="icon">
          <X className="w-4 h-4" />
        </Button>
        <Button onClick={switchCamera} variant="outline" size="icon">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button 
          onClick={capturePhoto} 
          disabled={isLoading}
          className="flex-1"
        >
          <Camera className="w-4 h-4 mr-2" />
          Capture
        </Button>
      </div>
    </div>
  )
}
