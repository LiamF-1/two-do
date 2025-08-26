'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

interface Item {
  id: string
  title: string
  [key: string]: any
}

interface DeleteItemDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (itemId: string) => void
}

export function DeleteItemDialog({ item, open, onOpenChange, onDelete }: DeleteItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(item.id)
        toast({
          title: 'Item deleted',
          description: 'The bucket list item has been removed.',
        })
        onOpenChange(false)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete item')
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{item.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
