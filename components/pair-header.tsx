'use client'

import { User } from 'next-auth'
import { Heart, Settings, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
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

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  {pairName || 'Bucket List'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user.name} & {partner?.name || 'Partner'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-6 text-sm">
              <div>
                <span className="text-2xl font-bold">{itemCount}</span>
                <p className="text-muted-foreground">Total Items</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-green-500">{completedCount}</span>
                <p className="text-muted-foreground">Completed</p>
              </div>
              <div>
                <span className="text-2xl font-bold">{itemCount - completedCount}</span>
                <p className="text-muted-foreground">Remaining</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateItem(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
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
