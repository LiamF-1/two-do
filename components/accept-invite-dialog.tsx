'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface AcceptInviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AcceptInviteDialog({ open, onOpenChange }: AcceptInviteDialogProps) {
  const [inviteCode, setInviteCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const acceptInvite = async () => {
    if (!inviteCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an invite code',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/pair/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim().toUpperCase() }),
      })

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'You have successfully joined the list!',
        })
        onOpenChange(false)
        router.refresh()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to accept invite',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setInviteCode('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a List</DialogTitle>
          <DialogDescription>
            Enter the invite code someone shared with you
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="Enter 6-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={acceptInvite} disabled={isLoading} className="flex-1">
              {isLoading ? 'Joining...' : 'Join List'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Make sure you have the correct 6-character code
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
