'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { PairHeader } from './pair-header'
import { BucketList } from './bucket-list'
import { Pair } from '@/types'

interface GroupContentProps {
  pair: Pair
  user: User
}

export function GroupContent({ pair, user }: GroupContentProps) {
  const partner = pair.members.find(member => member.user.id !== user.id)

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Home Button */}
      <div className="mb-6">
        <Link href="/home">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>

      <PairHeader
        user={user}
        partner={partner?.user || null}
        itemCount={pair.items.length}
        completedCount={pair.items.filter(item => item.completedAt).length}
        pairName={pair.name}
      />
      <BucketList
        items={pair.items}
        pairId={pair.id}
        currentUserId={user.id}
      />
    </div>
  )
}
