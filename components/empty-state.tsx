'use client'

import { Heart, Plus, UserPlus, Settings, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface EmptyStateProps {
  onCreateInvite: () => void
  onAcceptInvite: () => void
  onSettings: () => void
}

export function EmptyState({ onCreateInvite, onAcceptInvite, onSettings }: EmptyStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <Card className="w-full max-w-lg text-center shadow-soft border-0 bg-gradient-to-br from-card via-card to-card/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-xl" />
        <CardHeader className="relative z-10">
          <div className="flex justify-end mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSettings}
              className="hover:bg-primary/10 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative mx-auto mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center shadow-soft">
              <Sparkles className="w-12 h-12 text-primary/60" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient mb-3">Welcome to Adventures</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Start your shared adventure journey by creating your first list or joining someone else's
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="grid gap-4">
            <Button 
              onClick={onCreateInvite} 
              className="w-full shadow-soft hover:shadow-glow transition-all duration-200"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Adventure List
            </Button>
            <Button 
              variant="outline" 
              onClick={onAcceptInvite} 
              className="w-full shadow-soft hover:shadow-glow transition-all duration-200"
              size="lg"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Join Adventure
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            You can be part of multiple adventure lists and collaborate with different groups
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
