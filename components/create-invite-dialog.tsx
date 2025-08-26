'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'

interface CreateInviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInviteDialog({ open, onOpenChange }: CreateInviteDialogProps) {
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<'code' | 'url' | null>(null)
  const { toast } = useToast()

  const createInvite = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        setInviteCode(data.code)
        setInviteUrl(`${window.location.origin}/invite/${data.code}`)
      } else {
        throw new Error('Failed to create invite')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invite. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'code' | 'url') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast({
        title: 'Copied!',
        description: `${type === 'code' ? 'Invite code' : 'Invite link'} copied to clipboard`,
      })
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    setInviteCode(null)
    setInviteUrl(null)
    setCopied(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Invite</DialogTitle>
          <DialogDescription>
            Generate an invite code or link to share with your partner
          </DialogDescription>
        </DialogHeader>
        
        {!inviteCode ? (
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to generate a unique invite that your partner can use to join your bucket list.
            </p>
            <Button onClick={createInvite} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Generate Invite'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Invite Code</label>
              <div className="flex space-x-2 mt-1">
                <Input value={inviteCode} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(inviteCode, 'code')}
                >
                  {copied === 'code' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Invite Link</label>
              <div className="flex space-x-2 mt-1">
                <Input value={inviteUrl || ''} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(inviteUrl || '', 'url')}
                >
                  {copied === 'url' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Share either the code or link with your partner. The invite expires in 7 days.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
