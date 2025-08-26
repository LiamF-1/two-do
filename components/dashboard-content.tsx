'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { PairHeader } from './pair-header'
import { BucketList } from './bucket-list'
import { EmptyState } from './empty-state'
import { CreateInviteDialog } from './create-invite-dialog'
import { AcceptInviteDialog } from './accept-invite-dialog'

interface Pair {
  id: string
  members: Array<{
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  items: Array<{
    id: string
    title: string
    notes: string | null
    position: number
    dueDate: Date | null
    createdAt: Date
    completedAt: Date | null
    completion?: {
      id: string
      photoPath: string
      caption: string | null
      createdAt: Date
      user: {
        id: string
        name: string | null
      }
    } | null
  }>
}

interface DashboardContentProps {
  pair: Pair | null
  user: User
}

export function DashboardContent({ pair, user }: DashboardContentProps) {
  const [showCreateInvite, setShowCreateInvite] = useState(false)
  const [showAcceptInvite, setShowAcceptInvite] = useState(false)

  if (!pair) {
    return (
      <>
        <EmptyState
          onCreateInvite={() => setShowCreateInvite(true)}
          onAcceptInvite={() => setShowAcceptInvite(true)}
        />
        <CreateInviteDialog
          open={showCreateInvite}
          onOpenChange={setShowCreateInvite}
        />
        <AcceptInviteDialog
          open={showAcceptInvite}
          onOpenChange={setShowAcceptInvite}
        />
      </>
    )
  }

  const partner = pair.members.find(member => member.user.id !== user.id)

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <PairHeader
        user={user}
        partner={partner?.user || null}
        itemCount={pair.items.length}
        completedCount={pair.items.filter(item => item.completedAt).length}
      />
      <BucketList
        items={pair.items}
        pairId={pair.id}
        currentUserId={user.id}
      />
    </div>
  )
}
