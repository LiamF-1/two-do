'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CreateInviteDialog } from './create-invite-dialog'
import { AcceptInviteDialog } from './accept-invite-dialog'
import { UserSettingsDialog } from './user-settings-dialog'
import { PairMembership } from '@/types'
import Link from 'next/link'

interface HomeContentProps {
  pairs: PairMembership[]
  user: User
}

export function HomeContent({ pairs, user }: HomeContentProps) {
  const [showCreateInvite, setShowCreateInvite] = useState(false)
  const [showAcceptInvite, setShowAcceptInvite] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const activePairs = pairs.filter(membership => 
    membership.pair.items.some(item => !item.completedAt)
  )
  const completedPairs = pairs.filter(membership => 
    membership.pair.items.length > 0 && 
    membership.pair.items.every(item => item.completedAt)
  )

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Lists</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.name || user.email}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowSettings(true)}
          className="text-sm"
        >
          Settings
        </Button>
      </div>

      {/* Active Lists */}
      {activePairs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Lists</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePairs.map((membership) => (
              <Link
                key={membership.id}
                href={`/group/${membership.pair.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="cursor-pointer hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{membership.pair.name}</CardTitle>
                    <CardDescription>
                      {membership.pair.members.length} member{membership.pair.members.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {membership.pair.items.filter(item => !item.completedAt).length} active items
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Lists */}
      {completedPairs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Completed Lists</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedPairs.map((membership) => (
              <Link
                key={membership.id}
                href={`/group/${membership.pair.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="cursor-pointer hover:shadow-md opacity-75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{membership.pair.name}</CardTitle>
                    <CardDescription>
                      {membership.pair.members.length} member{membership.pair.members.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {membership.pair.items.length} completed items
                      </div>
                      <Badge variant="outline">Complete</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Add New List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New List</h2>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowCreateInvite(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create List
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAcceptInvite(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Join List
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {pairs.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No lists yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get started by creating your first bucket list or joining an existing one.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowCreateInvite(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create List
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAcceptInvite(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Join List
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <CreateInviteDialog
        open={showCreateInvite}
        onOpenChange={setShowCreateInvite}
      />
      <AcceptInviteDialog
        open={showAcceptInvite}
        onOpenChange={setShowAcceptInvite}
      />
      <UserSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        user={user}
      />
    </div>
  )
}
