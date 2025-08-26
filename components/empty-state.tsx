'use client'

import { Heart, Plus, UserPlus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface EmptyStateProps {
  onCreateInvite: () => void
  onAcceptInvite: () => void
}

export function EmptyState({ onCreateInvite, onAcceptInvite }: EmptyStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Two-Do</CardTitle>
          <CardDescription>
            Start your shared bucket list journey by connecting with your partner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button onClick={onCreateInvite} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create New Pair
            </Button>
            <Button variant="outline" onClick={onAcceptInvite} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Join Existing Pair
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            You can only be paired with one person at a time
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
