'use client'

import { useState } from 'react'
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import { 
  GripVertical, 
  Calendar, 
  Camera, 
  Edit, 
  Trash2, 
  Check,
  MoreHorizontal,
  ZoomIn
} from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { EditItemDialog } from './edit-item-dialog'
import { CompleteItemDialog } from './complete-item-dialog'
import { DeleteItemDialog } from './delete-item-dialog'
import { ImageViewerDialog } from './image-viewer-dialog'
import { SafeImage } from './safe-image'
import { Item } from '@/types'

interface BucketListItemProps {
  item: Item
  dragHandleProps?: DraggableProvidedDragHandleProps | null
  currentUserId: string
  onUpdate: (item: Item) => void
  onDelete: (itemId: string) => void
}

export function BucketListItem({
  item,
  dragHandleProps,
  currentUserId,
  onUpdate,
  onDelete
}: BucketListItemProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)

  const isCompleted = !!item.completedAt
  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !isCompleted

  return (
    <>
      <Card className={`transition-all ${isCompleted ? 'opacity-75 bg-green-50 dark:bg-green-950/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div
              {...dragHandleProps}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </h3>
                  {item.notes && (
                    <p className={`text-sm mt-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                      {item.notes}
                    </p>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!isCompleted && (
                      <DropdownMenuItem onClick={() => setShowComplete(true)}>
                        <Camera className="w-4 h-4 mr-2" />
                        Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setShowEdit(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDelete(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center flex-wrap gap-2 mt-3">
                {isCompleted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
                
                {item.dueDate && (
                  <Badge variant={isOverdue ? "destructive" : "outline"}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.dueDate)}
                  </Badge>
                )}
                
                <span className="text-xs text-muted-foreground">
                  Added {formatRelativeTime(item.createdAt)}
                </span>
              </div>
              
              {item.completion && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                      onClick={() => setShowImageViewer(true)}
                      title="Click to view full image"
                    >
                      <SafeImage
                        src={item.completion.photoPath}
                        alt="Completion photo"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        Completed by {item.completion.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(item.completion.createdAt)}
                      </p>
                      {item.completion.caption && (
                        <p className="text-sm mt-1">{item.completion.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <EditItemDialog
        item={item}
        open={showEdit}
        onOpenChange={setShowEdit}
        onUpdate={onUpdate}
      />
      
      <CompleteItemDialog
        item={item}
        open={showComplete}
        onOpenChange={setShowComplete}
        onUpdate={onUpdate}
      />
      
      <DeleteItemDialog
        item={item}
        open={showDelete}
        onOpenChange={setShowDelete}
        onDelete={onDelete}
      />
      
      {item.completion && (
        <ImageViewerDialog
          open={showImageViewer}
          onOpenChange={setShowImageViewer}
          src={item.completion.photoPath}
          alt={`Completion photo for ${item.title}`}
          caption={item.completion.caption}
          completedBy={item.completion.user.name}
          completedAt={item.completion.createdAt}
        />
      )}
    </>
  )
}
