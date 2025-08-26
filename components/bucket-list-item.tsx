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
  CheckCircle2,
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
      <Card className={`group relative overflow-hidden transition-all duration-300 shadow-soft hover:shadow-glow border-2 ${
        isCompleted 
          ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20 border-green-200 hover:border-green-300' 
          : 'bg-gradient-to-br from-card via-card to-card/80 hover:from-primary/5 hover:via-card hover:to-primary/5 border-border hover:border-primary/30'
      }`}>
        {isCompleted && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/20 to-transparent" />
        )}
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              {...dragHandleProps}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className={`text-lg font-semibold leading-tight ${
                    isCompleted ? 'line-through text-muted-foreground' : 'text-foreground group-hover:text-primary transition-colors'
                  }`}>
                    {item.title}
                  </h3>
                  {item.notes && (
                    <p className={`text-sm leading-relaxed ${
                      isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!isCompleted && (
                    <Button
                      onClick={() => setShowComplete(true)}
                      size="sm"
                      className="shadow-soft hover:shadow-glow transition-all duration-200"
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="shadow-glow">
                      <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setShowDelete(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="flex items-center flex-wrap gap-3">
                {isCompleted && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-soft">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
                
                {item.dueDate && (
                  <Badge variant={isOverdue ? "destructive" : "outline"} className="shadow-soft">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.dueDate)}
                  </Badge>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span>Added {formatRelativeTime(item.createdAt)}</span>
                </div>
              </div>
              
              {item.completion && (
                <div className="mt-6 p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20 rounded-xl border border-green-200/50 dark:border-green-800/30 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div 
                      className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all duration-200 group shadow-soft"
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
                        <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                          Completed by {item.completion.user.name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(item.completion.createdAt)}
                      </p>
                      {item.completion.caption && (
                        <p className="text-sm text-foreground bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-green-200/30 dark:border-green-800/30">
                          "{item.completion.caption}"
                        </p>
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
          completedAt={new Date(item.completion.createdAt)}
        />
      )}
    </>
  )
}
