'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Camera, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/use-toast'
import { CameraCapture } from './camera-capture'
import { ImageUploader } from './image-uploader'

const completeItemSchema = z.object({
  caption: z.string().max(500, 'Caption too long').optional(),
})

type CompleteItemForm = z.infer<typeof completeItemSchema>

interface Item {
  id: string
  title: string
  [key: string]: any
}

interface CompleteItemDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (item: Item) => void
}

export function CompleteItemDialog({ item, open, onOpenChange, onUpdate }: CompleteItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'upload' | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompleteItemForm>({
    resolver: zodResolver(completeItemSchema),
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setUploadMethod(null)
  }

  const handleCameraCapture = (file: File) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setUploadMethod(null)
  }

  const onSubmit = async (data: CompleteItemForm) => {
    if (!selectedFile) {
      toast({
        title: 'Photo required',
        description: 'Please take a photo or upload an image to complete this item.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Upload image first
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadResponse = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const { photoPath } = await uploadResponse.json()

      // Complete the item
      const response = await fetch(`/api/items/${item.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoPath,
          caption: data.caption || null,
        }),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        onUpdate(updatedItem)
        toast({
          title: 'Item completed! 🎉',
          description: 'Congratulations on completing this bucket list item!',
        })
        handleClose()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to complete item')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadMethod(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Item</DialogTitle>
          <DialogDescription>
            Take a photo to mark "{item.title}" as completed!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {!selectedFile && !uploadMethod && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadMethod('camera')}
                  className="h-20 flex-col"
                >
                  <Camera className="w-6 h-6 mb-2" />
                  Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadMethod('upload')}
                  className="h-20 flex-col"
                >
                  <Upload className="w-6 h-6 mb-2" />
                  Upload Image
                </Button>
              </div>
            )}

            {uploadMethod === 'camera' && (
              <CameraCapture
                onCapture={handleCameraCapture}
                onCancel={() => setUploadMethod(null)}
              />
            )}

            {uploadMethod === 'upload' && (
              <ImageUploader
                onFileSelect={handleFileSelect}
                onCancel={() => setUploadMethod(null)}
              />
            )}

            {previewUrl && (
              <div className="space-y-3">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl(null)
                    if (previewUrl) URL.revokeObjectURL(previewUrl)
                  }}
                >
                  Change Photo
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="caption">Caption (optional)</Label>
              <Textarea
                id="caption"
                placeholder="Add a caption to your photo..."
                rows={3}
                {...register('caption')}
                disabled={isLoading}
              />
              {errors.caption && (
                <p className="text-sm text-destructive">{errors.caption.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedFile} 
              className="flex-1"
            >
              {isLoading ? 'Completing...' : 'Complete Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
