'use client'

import { User } from 'next-auth'
import { Heart, Settings, Plus, Users, Target, Trophy, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { useState } from 'react'
import { CreateItemDialog } from './create-item-dialog'
import { UserSettingsDialog } from './user-settings-dialog'

interface PairHeaderProps {
  user: User
  partner: { id: string; name: string | null; email: string } | null
  itemCount: number
  completedCount: number
  pairName?: string
}

export function PairHeader({ user, partner, itemCount, completedCount, pairName }: PairHeaderProps) {
  const [showCreateItem, setShowCreateItem] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const progress = itemCount > 0 ? (completedCount / itemCount) * 100 : 0

  return (
    <>
      <Card className="relative overflow-hidden shadow-soft border-0 bg-gradient-to-br from-card via-card to-card/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow">
                    <Heart className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-background" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold text-gradient">
                    {pairName || 'Adventure List'}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{user.name} & {partner?.name || 'Partner'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <div className="flex-1 max-w-xs bg-secondary rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold text-primary">{itemCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Total</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{completedCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Done</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-2xl font-bold text-amber-600">{itemCount - completedCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Left</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setShowCreateItem(true)}
                  className="shadow-soft hover:shadow-glow transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Adventure
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowSettings(true)}
                  className="shadow-soft hover:shadow-glow transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CreateItemDialog
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
      />
      
      <UserSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        user={user}
      />
    </>
  )
}
