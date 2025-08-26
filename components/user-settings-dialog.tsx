'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Save, X } from 'lucide-react'
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
import { useToast } from './ui/use-toast'

interface UserSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function UserSettingsDialog({ open, onOpenChange, user }: UserSettingsDialogProps) {
  const [name, setName] = useState(user.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { update } = useSession()
  const router = useRouter()

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Name cannot be empty',
        variant: 'destructive',
      })
      return
    }

    if (name.trim() === user.name) {
      onOpenChange(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        
        // Update the session with new user data
        await update({
          ...user,
          name: updatedUser.name,
        })

        toast({
          title: 'Success',
          description: 'Your name has been updated',
        })

        // Refresh the page to reflect changes
        router.refresh()
        onOpenChange(false)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update name')
      }
    } catch (error) {
      console.error('Update name error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update name',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setName(user.name || '')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span>User Settings</span>
          </DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              maxLength={50}
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
