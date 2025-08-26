'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/use-toast'

const editItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  dueDate: z.string().optional(),
})

type EditItemForm = z.infer<typeof editItemSchema>

interface Item {
  id: string
  title: string
  notes: string | null
  dueDate: Date | null
  [key: string]: any
}

interface EditItemDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (item: Item) => void
}

export function EditItemDialog({ item, open, onOpenChange, onUpdate }: EditItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditItemForm>({
    resolver: zodResolver(editItemSchema),
  })

  useEffect(() => {
    if (open && item) {
      reset({
        title: item.title,
        notes: item.notes || '',
        dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
      })
    }
  }, [open, item, reset])

  const onSubmit = async (data: EditItemForm) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          notes: data.notes || null,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        }),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        onUpdate(updatedItem)
        toast({
          title: 'Item updated',
          description: 'Your bucket list item has been updated!',
        })
        onOpenChange(false)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update item')
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
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your bucket list item
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What do you want to do?"
              {...register('title')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any details or notes..."
              rows={3}
              {...register('notes')}
              disabled={isLoading}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              disabled={isLoading}
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Updating...' : 'Update Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
