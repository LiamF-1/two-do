'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { BucketListItem } from './bucket-list-item'
import { useToast } from './ui/use-toast'
import { Item } from '@/types'

interface BucketListProps {
  items: Item[]
  pairId: string
  currentUserId: string
}

export function BucketList({ items: initialItems, pairId, currentUserId }: BucketListProps) {
  const [items, setItems] = useState(initialItems)
  const { toast } = useToast()

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    // Optimistically update the UI
    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(sourceIndex, 1)
    newItems.splice(destinationIndex, 0, reorderedItem)

    // Update positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      position: index
    }))

    setItems(updatedItems)

    // Send update to server
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairId,
          items: updatedItems.map(item => ({
            id: item.id,
            position: item.position
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reorder items')
      }
    } catch (error) {
      // Revert on error
      setItems(initialItems)
      toast({
        title: 'Error',
        description: 'Failed to reorder items. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleItemUpdate = (updatedItem: Item) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    )
  }

  const handleItemDelete = (deletedItemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== deletedItemId))
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium mb-2">No items yet</h3>
        <p className="text-muted-foreground">
          Start building your bucket list by adding your first item!
        </p>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="bucket-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-transform ${
                      snapshot.isDragging ? 'rotate-2 scale-105' : ''
                    }`}
                  >
                    <BucketListItem
                      item={item}
                      dragHandleProps={provided.dragHandleProps}
                      currentUserId={currentUserId}
                      onUpdate={handleItemUpdate}
                      onDelete={handleItemDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
